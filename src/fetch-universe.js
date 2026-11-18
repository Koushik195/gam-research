// Builds data/universe.json — the BSE-500 constituents the stock picker offers.
// Source: Screener's BSE 500 index page (paginated, 25 per page).
// Usage: node src/fetch-universe.js
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const INDEX_URL = 'https://www.screener.in/company/1005/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clean = s => s.replace(/\s+/g, ' ').trim();
const num = s => { const n = Number(String(s).replace(/[,\s]/g, '')); return Number.isFinite(n) && String(s).trim() !== '' ? n : null; };

async function page(n) {
  const r = await fetch(`${INDEX_URL}?page=${n}`, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${r.status} page ${n}`);
  return cheerio.load(await r.text());
}

async function main() {
  const out = [];
  const seen = new Set();
  let head = null;
  for (let n = 1; n <= 30; n++) {
    const $ = await page(n);
    const table = $('table.data-table').first();
    head ||= table.find('tr').first().find('th').map((_, th) => clean($(th).text())).get();
    const rows = table.find('tbody tr').filter((_, tr) => $(tr).find('a[href^="/company/"]').length);
    if (!rows.length) break;
    let fresh = 0;
    rows.each((_, tr) => {
      const a = $(tr).find('a[href^="/company/"]').first();
      const href = a.attr('href');
      const cells = $(tr).find('td').map((_, td) => clean($(td).text())).get();
      if (seen.has(href)) return;
      seen.add(href); fresh++;
      const rec = { symbol: href.split('/')[2], name: clean(a.text()), consolidated: href.includes('/consolidated/') };
      head.forEach((h, i) => { if (i > 1 && cells[i] != null) rec[h] = num(cells[i]); });
      out.push(rec);
    });
    if (!fresh) break; // past the last page Screener repeats it
    await sleep(500);
  }
  const file = path.join(__dirname, '..', 'data', 'universe.json');
  fs.writeFileSync(file, JSON.stringify({ index: 'BSE 500', source: INDEX_URL, fetchedAt: new Date().toISOString(), columns: head, companies: out }, null, 1));
  console.log(`${out.length} companies → ${file}`);
}

main().catch(e => { console.error(e); process.exit(1); });
