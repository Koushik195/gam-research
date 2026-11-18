// Pulls everything Screener exposes publicly for one company into data/raw/<SYMBOL>/screener.json:
// statement tables (annual + quarterly), line-item schedules, ratios, shareholding, peers,
// long-run valuation/margin/price series, and document links (annual reports, concalls).
// Usage: node src/fetch-screener.js MARUTI
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const BASE = 'https://www.screener.in';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get(url, json = false) {
  for (let i = 0; i < 3; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' } });
    if (r.ok) return json ? r.json() : r.text();
    if (r.status === 429) { await sleep(3000 * (i + 1)); continue; }
    throw new Error(`${r.status} ${url}`);
  }
  throw new Error(`rate-limited ${url}`);
}

const clean = s => s.replace(/\s+/g, ' ').trim().replace(/\s*\+$/, '');
function num(s) {
  if (s == null) return null;
  const t = String(s).replace(/[,%₹\s]/g, '');
  if (t === '' || t === '-') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

// Screener tables: header row of periods, then one row per line item.
function parseTable($, table) {
  const head = $(table).find('thead th').map((_, th) => clean($(th).text())).get().slice(1);
  const rows = {};
  $(table).find('tbody tr').each((_, tr) => {
    const cells = $(tr).find('td');
    const label = clean($(cells[0]).text());
    if (!label) return;
    const vals = cells.slice(1).map((_, td) => num($(td).text())).get();
    // Rows with fewer cells than periods (e.g. EPS only after listing) belong to the latest periods.
    rows[label] = vals.length < head.length ? [...Array(head.length - vals.length).fill(null), ...vals] : vals;
  });
  return { periods: head, rows };
}

const CHARTS = {
  price: 'Price-DMA50-DMA200-Volume',
  pe: 'Price to Earning-Median PE-EPS',
  evEbitda: 'EV Multiple-Median EV Multiple-EBITDA',
  pb: 'Price to book value-Median PBV-Book value',
  mcapSales: 'Market Cap to Sales-Median Market Cap to Sales-Sales',
  margins: 'GPM-OPM-NPM-Quarter Sales',
};

async function main(symbol) {
  const outDir = path.join(__dirname, '..', 'data', 'raw', symbol);
  fs.mkdirSync(outDir, { recursive: true });
  // Prefer consolidated statements; fall back to standalone when the company doesn't publish them
  // (Screener's consolidated page then has an empty P&L table).
  let basis = 'consolidated';
  let html = await get(`${BASE}/company/${symbol}/consolidated/`);
  let $ = cheerio.load(html);
  // Also fall back when the consolidated history is stale (a couple of old years only), or on --standalone.
  const plCols = $('section#profit-loss table.data-table thead th').length - 1;
  if (process.argv.includes('--standalone') || plCols < 4 || !$('section#profit-loss table.data-table tbody tr').length || !$('[data-warehouse-id]').attr('data-warehouse-id')) {
    basis = 'standalone';
    html = await get(`${BASE}/company/${symbol}/`);
    $ = cheerio.load(html);
  }
  const id = $('[data-company-id]').attr('data-company-id');
  const wid = $('[data-warehouse-id]').attr('data-warehouse-id');

  const out = { symbol, basis, fetchedAt: new Date().toISOString(), source: `${BASE}/company/${symbol}/${basis === 'consolidated' ? 'consolidated/' : ''}`, id };
  out.name = clean($('h1').first().text());
  out.about = clean($('.company-profile .about').text() || $('.about').first().text());
  out.keyPoints = clean($('.company-profile .commentary').text());
  out.links = $('.company-links a').map((_, a) => ({ text: clean($(a).text()), href: $(a).attr('href') })).get();
  out.sectorPath = $('#peers .sub a, #peers p a').map((_, a) => clean($(a).text())).get();
  out.topRatios = {};
  $('#top-ratios li').each((_, li) => {
    out.topRatios[clean($(li).find('.name').text())] = clean($(li).find('.value').text());
  });
  out.pros = $('.pros li').map((_, li) => clean($(li).text())).get();
  out.cons = $('.cons li').map((_, li) => clean($(li).text())).get();

  out.tables = {};
  for (const sec of ['quarters', 'profit-loss', 'balance-sheet', 'cash-flow', 'ratios']) {
    const t = $(`section#${sec} table.data-table`).first();
    if (t.length) out.tables[sec] = parseTable($, t);
  }
  // Compounded growth boxes under the P&L
  out.growth = $('section#profit-loss table.ranges-table').map((_, t) => ({
    title: clean($(t).find('th').first().text()),
    values: $(t).find('tr').slice(1).map((_, tr) => [[clean($(tr).find('td').eq(0).text()), clean($(tr).find('td').eq(1).text())]]).get(),
  })).get();
  out.shareholding = {};
  $('section#shareholding table.data-table').each((i, t) => {
    out.shareholding[i === 0 ? 'quarterly' : 'yearly'] = parseTable($, t);
  });

  // Line-item breakdowns behind the "+" buttons
  out.schedules = {};
  const sched = new Set();
  html.replace(/showSchedule\('([^']+)', '([^']+)'/g, (_, p, s) => sched.add(`${s}|${p}`));
  for (const key of sched) {
    const [section, parent] = key.split('|');
    try {
      const j = await get(`${BASE}/api/company/${id}/schedules/?parent=${encodeURIComponent(parent)}&section=${section}${basis === 'consolidated' ? '&consolidated=' : ''}`, true);
      const data = {};
      for (const [item, byPeriod] of Object.entries(j)) data[item] = Object.fromEntries(Object.entries(byPeriod).map(([p, v]) => [p, num(v)]));
      (out.schedules[section] ||= {})[parent] = data;
    } catch (e) { console.warn('schedule', key, e.message); }
    await sleep(400);
  }

  // Peers come from a separate endpoint keyed by the warehouse id
  try {
    const peersHtml = await get(`${BASE}/api/company/${wid}/peers/`);
    const p$ = cheerio.load(peersHtml);
    const head = p$('table th').map((_, th) => clean(p$(th).text())).get();
    out.peers = { head, rows: p$('table tbody tr').map((_, tr) => [p$(tr).find('td').map((_, td) => clean(p$(td).text())).get()]).get().filter(r => r.length > 2) };
  } catch (e) { console.warn('peers', e.message); }

  out.charts = {};
  for (const [k, q] of Object.entries(CHARTS)) {
    const j = await get(`${BASE}/api/company/${id}/chart/?q=${encodeURIComponent(q)}&days=10000${basis === 'consolidated' ? '&consolidated=true' : ''}`, true);
    out.charts[k] = Object.fromEntries((j.datasets || []).filter(d => Array.isArray(d.values)).map(d => [d.metric, d.values.map(v => [v[0], num(v[1])])]));
    await sleep(400);
  }

  // Documents: annual reports and concall transcripts / PPTs
  out.documents = { annualReports: [], concalls: [], announcements: [] };
  $('.documents.annual-reports li a').each((_, a) => out.documents.annualReports.push({ text: clean($(a).text()), href: $(a).attr('href') }));
  $('.documents.concalls li').each((_, li) => {
    const period = clean($(li).find('.nowrap').first().text());
    const links = $(li).find('a').map((_, a) => ({ text: clean($(a).text()), href: $(a).attr('href') })).get();
    out.documents.concalls.push({ period, links });
  });
  $('.documents.flex-column li a, #company-announcements-tab li a').each((_, a) => out.documents.announcements.push({ text: clean($(a).text()), href: $(a).attr('href') }));

  fs.writeFileSync(path.join(outDir, 'screener.json'), JSON.stringify(out, null, 1));
  const t = out.tables;
  console.log(`${out.name} (id ${id}) → annual ${t['profit-loss']?.periods.length}, quarters ${t.quarters?.periods.length}, schedules ${sched.size}, peers ${out.peers?.rows.length}, ARs ${out.documents.annualReports.length}, concalls ${out.documents.concalls.length}`);
}

main((process.argv[2] || 'MARUTI').toUpperCase()).catch(e => { console.error(e); process.exit(1); });
