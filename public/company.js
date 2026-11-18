// Company story page. Renders one model (from /api/model/<SYMBOL>) as a sequence of chapters.
// Every chapter has three layers: the narrative (research/story.json, if any), the engine's
// computed insights, and the charts/tables — so a company with no research still reads well.
const SYMBOL = decodeURIComponent(location.pathname.split('/')[2] || '').toUpperCase();
const C = { navy: '#0d1f44', navy3: '#16305f', gold: '#c6a44e', gold2: '#d8bd77', pos: '#1a7f4b', neg: '#b4232a', blue: '#2f5d9e', teal: '#2a8a8a', grey: '#9aa3b2', line: '#e7e2d3', purple: '#8a5cc2' };
const SERIES = [C.navy, C.gold, C.teal, C.blue, C.neg, C.purple, C.grey, '#d97a2b'];

// ---------- formatting ----------
const isNum = v => typeof v === 'number' && isFinite(v);
const fmt = (v, d = 0) => (isNum(v) ? v.toLocaleString('en-IN', { maximumFractionDigits: d, minimumFractionDigits: d }) : '–');
const pc = (v, d = 1) => (isNum(v) ? `${fmt(v, d)}%` : '–');
const x = (v, d = 1) => (isNum(v) ? `${fmt(v, d)}x` : '–');
const rs = (v, d = 0) => (isNum(v) ? `₹${fmt(v, d)}` : '–');
const crore = v => (isNum(v) ? (Math.abs(v) >= 1e5 ? `₹${fmt(v / 1e5, 2)} lakh cr` : `₹${fmt(v)} cr`) : '–');
const cls = v => (isNum(v) ? (v > 0 ? 'pos' : v < 0 ? 'neg' : '') : '');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const linkify = u => (u ? String(u).split(/\s*;\s*/).filter(Boolean).map((h, i) => `<a href="${esc(h)}" target="_blank" rel="noopener">[${i + 1}]</a>`).join(' ') : '');
const last = a => a[a.length - 1];

// ---------- period helpers (Indian FY) ----------
function qOf(dateStr) { // 'YYYY-MM' or 'YYYY-MM-DD' → 'Q2FY27'
  const [y, m] = dateStr.split('-').map(Number);
  const fy = m <= 3 ? y : y + 1;
  const q = m <= 3 ? 4 : m <= 6 ? 1 : m <= 9 ? 2 : 3;
  return `Q${q}FY${String(fy).slice(2)}`;
}
const fyOf = dateStr => { const [y, m] = dateStr.split('-').map(Number); return `FY${String(m <= 3 ? y : y + 1).slice(2)}`; };

// ---------- charts ----------
Chart.defaults.font.family = "'Segoe UI', system-ui, Arial, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#4b5563';
Chart.defaults.plugins.legend.labels.boxWidth = 10;
Chart.defaults.plugins.legend.labels.boxHeight = 10;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.animation = false;
Chart.defaults.plugins.tooltip.mode = 'index';
Chart.defaults.plugins.tooltip.intersect = false;

// Vertical event markers: options.plugins.events = [{ at: <x label>, text, color }]
const eventPlugin = {
  id: 'events',
  afterDatasetsDraw(chart, _a, opts) {
    const evs = opts?.list;
    if (!evs?.length) return;
    const { ctx, chartArea: a, scales: { x: xs } } = chart;
    const labels = chart.data.labels;
    ctx.save();
    ctx.font = '600 10px Segoe UI, sans-serif';
    evs.forEach((e, k) => {
      const i = labels.indexOf(e.at);
      if (i < 0) return;
      const px = xs.getPixelForValue(i);
      ctx.strokeStyle = e.color || C.gold; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, a.top + 12); ctx.lineTo(px, a.bottom); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = e.color || '#7a5c12';
      const tw = ctx.measureText(e.text).width;
      const tx = Math.min(Math.max(px - tw / 2, a.left), a.right - tw);
      ctx.fillText(e.text, tx, a.top + 9 + (k % 2) * 11);
    });
    ctx.restore();
  },
};
Chart.register(eventPlugin);

// Vertical reference line on a horizontal bar chart: options.plugins.refline = { value, text }
Chart.register({
  id: 'refline',
  afterDatasetsDraw(chart, _a, o) {
    if (!isNum(o?.value)) return;
    const { ctx, chartArea: a, scales: { x: xs } } = chart;
    const px = xs.getPixelForValue(o.value);
    ctx.save(); ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(px, a.top); ctx.lineTo(px, a.bottom); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#7a5c12'; ctx.font = '600 10px Segoe UI, sans-serif'; ctx.fillText(o.text || '', px + 4, a.bottom - 4);
    ctx.restore();
  },
});

const charts = [];
function mk(id, cfg) {
  const el = document.getElementById(id);
  if (!el) return;
  charts.push(new Chart(el, cfg));
}
const yPct = { ticks: { callback: v => `${v}%` }, grid: { color: '#f0ece0' } };
const yNum = { ticks: { callback: v => fmt(v) }, grid: { color: '#f0ece0' } };
const noGrid = { grid: { display: false } };
const bar = (label, data, color, extra = {}) => ({ type: 'bar', label, data, backgroundColor: color, borderRadius: 3, ...extra });
const line = (label, data, color, extra = {}) => ({ type: 'line', label, data, borderColor: color, backgroundColor: color, pointRadius: 2, borderWidth: 2, tension: 0.25, spanGaps: true, ...extra });

// ---------- layout helpers ----------
const box = (id, title, cap, size = '') => `<div class="card"><h3>${title}</h3>${cap ? `<p class="cap">${cap}</p>` : ''}<div class="chartbox ${size}"><canvas id="${id}"></canvas></div></div>`;
const kpi = (k, v, s = '', c = '') => `<div class="kpi"><div class="k">${k}</div><div class="v ${c}">${v}</div>${s ? `<div class="s">${s}</div>` : ''}</div>`;
function storyHtml(M, id) {
  const ch = M.research.story?.chapters?.[id];
  const paras = ch?.paragraphs || [];
  const ins = M.insights[id] || [];
  return (paras.length ? `<div class="story">${paras.map(p => `<p>${p}</p>`).join('')}</div>` : '') +
    (ins.length ? `<ul class="insights">${ins.map(i => `<li class="${i.tone}">${esc(i.text)}</li>`).join('')}</ul>` : '');
}
const CHAPTERS = [];
function chapter(id, title, sub, body) {
  CHAPTERS.push({ id, title });
  return `<section class="ch" id="${id}"><h2><span class="num">${String(CHAPTERS.length).padStart(2, '0')}</span>${title}</h2>${sub ? `<p class="sub">${sub}</p>` : ''}${body}</section>`;
}

// Timeline events → chart markers on annual (FY) or quarterly (Qn FYyy) axes.
function markers(M, axis) {
  const tl = M.research.company?.timeline || [];
  const keep = tl.filter(e => e.chart || e.major);
  const src = keep.length ? keep : tl.filter(e => ['corporate', 'capacity', 'regulation', 'macro'].includes(e.category));
  const out = [], seen = new Set();
  for (const e of src) {
    if (!e.date) continue;
    const at = axis === 'q' ? qOf(e.date) : fyOf(e.date);
    if (seen.has(at)) continue;
    seen.add(at);
    out.push({ at, text: e.short || e.title.split(/[:(—–-]/)[0].trim().slice(0, 22), color: e.category === 'macro' ? C.neg : e.category === 'regulation' ? C.purple : '#7a5c12' });
  }
  return out;
}

// ================= chapters =================
function hero(M) {
  const m = M.meta, P = M.price, S = M.research.story?.summary, st = M.research.street;
  const tp = st?.ratings?.tpMean;
  return `<div class="hero">
    <div class="path">${esc(m.sectorPath.join('  ›  '))}</div>
    <h1>${esc(m.name)}</h1>
    <div class="px">
      <div><div class="k">Price</div><div class="v">${rs(P?.last ?? m.price, 0)}</div></div>
      <div><div class="k">1Y return</div><div class="v ${cls(P?.returns['1y'])}">${pc(P?.returns['1y'])}</div></div>
      <div><div class="k">Market cap</div><div class="v">${crore(m.marketCap)}</div></div>
      <div><div class="k">P/E (TTM)</div><div class="v">${x(M.valuation.pe?.current ?? m.pe)}</div></div>
      <div><div class="k">EV/EBITDA</div><div class="v">${x(M.valuation.evEbitda?.current)}</div></div>
      <div><div class="k">ROE / ROCE</div><div class="v">${pc(m.roe, 1)} / ${pc(m.roce, 1)}</div></div>
      <div><div class="k">52W range</div><div class="v">${rs(P?.low52)} – ${rs(P?.high52)}</div></div>
      ${tp ? `<div><div class="k">Street target</div><div class="v">${rs(tp)} <span style="font-size:13px" class="${cls(tp - P.last)}">(${pc((tp / P.last - 1) * 100, 0)})</span></div></div>` : ''}
    </div>
    ${S?.headline ? `<div class="headline">${S.headline}</div>` : ''}
    ${S?.thesis?.length ? `<div class="thesis">${S.thesis.map(t => `<div>${t}</div>`).join('')}</div>` : ''}
    <div class="meta">Data as of ${esc(P?.lastDate || '')} · Source: Screener.in (consolidated)${M.research.story ? ' · Narrative: GAM Research' : ' · Narrative not yet generated — computed commentary only'} · Built ${new Date(M.builtAt).toLocaleString('en-IN')}</div>
  </div>`;
}

function business(M) {
  const m = M.meta, ck = M.research.company;
  const seg = (m.keyPoints || '').replace(/\[\d+\]/g, '');
  const ak = ck?.annualKpis?.filter(r => isNum(r.units)) || [];
  const body = `<div class="grid g2">
      <div class="card"><h3>What the company does</h3><p>${esc(m.about)}</p>${seg ? `<p class="cap" style="margin-top:8px"><b>Key points:</b> ${esc(seg)}</p>` : ''}
        <p class="cap">${(m.indices || []).slice(0, 12).map(i => `<span class="chip ghost">${esc(i)}</span>`).join(' ')}</p></div>
      <div class="card"><h3>Screener's quick read</h3>
        <div class="bb"><div><b class="pos">Strengths</b><ul>${(m.pros || []).map(p => `<li>${esc(p)}</li>`).join('') || '<li class="muted">–</li>'}</ul></div>
        <div><b class="neg">Watch-outs</b><ul>${(m.cons || []).map(p => `<li>${esc(p)}</li>`).join('') || '<li class="muted">–</li>'}</ul></div></div></div>
    </div>
    ${ak.length ? `<div class="grid g2" style="margin-top:14px">${box('c-units', 'Volumes', 'Units sold, domestic vs exports (lakh units)')}${box('c-share', 'Market share & realisation', 'Domestic PV share (%) and revenue per vehicle (₹ lakh)')}</div>` : ''}`;
  return chapter('business', 'The business', 'Who they are, what they sell, where they sit.', storyHtml(M, 'business') + body);
}
function businessCharts(M) {
  const ak = M.research.company?.annualKpis?.filter(r => isNum(r.units)) || [];
  if (!ak.length) return;
  const L = ak.map(r => r.fy);
  mk('c-units', { data: { labels: L, datasets: [bar('Domestic', ak.map(r => r.domestic / 1e5), C.navy, { stack: 'u' }), bar('Exports', ak.map(r => r.exports / 1e5), C.gold, { stack: 'u' })] }, options: { scales: { x: { stacked: true, ...noGrid }, y: { stacked: true, ...yNum } }, plugins: { events: { list: markers(M, 'y') } } } });
  mk('c-share', { data: { labels: L, datasets: [line('Market share %', ak.map(r => r.marketShare), C.navy, { yAxisID: 'y' }), bar('Realisation ₹ lakh', ak.map(r => (isNum(r.realisation) ? r.realisation / 1e5 : null)), 'rgba(198,164,78,.45)', { yAxisID: 'y1' })] }, options: { scales: { x: noGrid, y: { ...yPct, position: 'left' }, y1: { position: 'right', grid: { display: false } } } } });
}

function growth(M) {
  const A = M.annual, c = A.cagr;
  const row = (k, n) => `<tr><td>${n}</td><td>${pc(c[k]['3y'])}</td><td>${pc(c[k]['5y'])}</td><td>${pc(c[k]['10y'])}</td></tr>`;
  const body = `<div class="kpis">
      ${kpi(`Revenue ${last(A.labels)}`, crore(last(A.sales)), `${pc(last(A.salesGrowth))} YoY`)}
      ${kpi(`EBITDA ${last(A.labels)}`, crore(last(A.ebitda)), `${pc(last(A.ebitdaGrowth))} YoY`)}
      ${kpi(`Net profit ${last(A.labels)}`, crore(last(A.pat)), `${pc(last(A.patGrowth))} YoY`)}
      ${kpi('Revenue TTM', crore(A.ttm?.sales), `PAT TTM ${crore(A.ttm?.pat)}`)}
      ${kpi('EPS TTM', rs(A.ttm?.eps, 1), `${last(A.labels)}: ${rs(last(A.eps), 1)}`)}
    </div>
    <div class="grid g2">${box('c-rev', 'Revenue & profit, annual', '₹ crore · line = PAT growth % (right axis)', 'tall')}
      <div class="card"><h3>Compounding</h3><p class="cap">CAGR to ${last(A.labels)}</p>
        <table class="fin"><thead><tr><th>Metric</th><th>3 yr</th><th>5 yr</th><th>10 yr</th></tr></thead><tbody>
        ${row('sales', 'Revenue')}${row('ebitda', 'EBITDA')}${row('pat', 'Net profit')}${row('eps', 'EPS')}${row('bvps', 'Book value / share')}${row('dps', 'Dividend / share')}</tbody></table>
        <div class="chartbox short" style="margin-top:12px"><canvas id="c-growthbars"></canvas></div></div></div>
    <div class="grid g2" style="margin-top:14px">${box('c-qrev', 'Last 13 quarters', 'Revenue (bars, ₹ cr) and YoY growth of revenue and profit (%)')}
      ${M.longQuarterly ? box('c-longq', `Quarterly revenue since ${M.longQuarterly[0].label}`, '₹ crore; dashed markers = key corporate events') : ''}</div>`;
  return chapter('growth', 'Growth', 'How fast the business has compounded — and whether profit kept up.', storyHtml(M, 'growth') + body);
}
function growthCharts(M) {
  const A = M.annual, Q = M.quarterly;
  mk('c-rev', { data: { labels: A.labels, datasets: [bar('Revenue', A.sales, 'rgba(13,31,68,.85)', { yAxisID: 'y' }), bar('Net profit', A.pat, C.gold, { yAxisID: 'y' }), line('PAT growth %', A.patGrowth, C.teal, { yAxisID: 'y1', borderDash: [4, 3] })] },
    options: { scales: { x: noGrid, y: yNum, y1: { position: 'right', grid: { display: false }, ticks: { callback: v => `${v}%` } } }, plugins: { events: { list: markers(M, 'y') } } } });
  mk('c-growthbars', { type: 'bar', data: { labels: A.labels, datasets: [bar('Revenue growth %', A.salesGrowth, A.salesGrowth.map(v => (v < 0 ? C.neg : C.navy)))] }, options: { plugins: { legend: { display: false } }, scales: { x: noGrid, y: yPct } } });
  if (Q) mk('c-qrev', { data: { labels: Q.labels, datasets: [bar('Revenue', Q.sales, 'rgba(13,31,68,.8)', { yAxisID: 'y' }), line('Revenue YoY %', Q.salesYoY, C.gold, { yAxisID: 'y1' }), line('Profit YoY %', Q.patYoY, C.neg, { yAxisID: 'y1' })] },
    options: { scales: { x: noGrid, y: yNum, y1: { position: 'right', grid: { display: false }, ticks: { callback: v => `${v}%` } } } } });
  const LQ = M.longQuarterly;
  if (LQ) mk('c-longq', { data: { labels: LQ.map(r => r.label), datasets: [bar('Quarterly revenue', LQ.map(r => r.sales), 'rgba(13,31,68,.75)', { barPercentage: 1, categoryPercentage: 0.9 })] }, options: { plugins: { legend: { display: false }, events: { list: markers(M, 'q') } }, scales: { x: { ...noGrid, ticks: { maxTicksLimit: 12 } }, y: yNum } } });
}

function margins(M) {
  const A = M.annual;
  const rows = [['Gross margin (1 − material)', A.grossMargin], ['Material cost', A.materialPct], ['Employee cost', A.employeePct], ['Manufacturing cost', A.manufacturingPct], ['Other costs', A.otherCostPct], ['EBITDA margin', A.ebitdaMargin], ['Depreciation', A.depPct], ['EBIT margin', A.ebitMargin], ['PBT margin', A.pbtMargin], ['Net margin', A.npm], ['Other income / PBT', A.otherIncomeShare], ['Effective tax', A.taxPct]];
  const table = `<div class="tablewrap"><table class="fin"><thead><tr><th>% of revenue</th>${A.labels.map(l => `<th>${l}</th>`).join('')}</tr></thead><tbody>${rows.map(([n, a]) => `<tr class="${/EBITDA|Net margin/.test(n) ? 'b' : ''}"><td>${n}</td>${a.map(v => `<td>${fmt(v, 1)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const body = `${M.longQuarterly ? `<div class="grid">${box('c-qmargin', `Margins every quarter since ${M.longQuarterly[0].label}`, 'Gross, operating and net margin (%). Dashed lines mark the events that moved them.', 'tall')}</div>` : ''}
    <div class="grid g2" style="margin-top:14px">${box('c-cost', 'Where each rupee of revenue goes', 'Cost lines as % of revenue, annual')}${box('c-qcost', 'Recent quarters: cost pressure', 'Material and employee cost % of revenue, OPM %')}</div>
    <div class="card" style="margin-top:14px"><h3>Margin structure, annual</h3>${table}</div>`;
  return chapter('margins', 'Margins', 'What the company keeps from each rupee — and what squeezed it.', storyHtml(M, 'margins') + body);
}
function marginCharts(M) {
  const A = M.annual, Q = M.quarterly, LQ = M.longQuarterly;
  if (LQ) mk('c-qmargin', { data: { labels: LQ.map(r => r.label), datasets: [line('Gross margin', LQ.map(r => r.gpm), C.gold, { pointRadius: 0 }), line('Operating margin', LQ.map(r => r.opm), C.navy, { pointRadius: 0 }), line('Net margin', LQ.map(r => r.npm), C.teal, { pointRadius: 0 })] },
    options: { plugins: { events: { list: markers(M, 'q') } }, scales: { x: { ...noGrid, ticks: { maxTicksLimit: 14 } }, y: yPct } } });
  const rest = A.labels.map((_, i) => (isNum(A.ebitdaMargin[i]) ? A.ebitdaMargin[i] : null));
  mk('c-cost', { type: 'bar', data: { labels: A.labels, datasets: [bar('Material', A.materialPct, C.navy, { stack: 's' }), bar('Employee', A.employeePct, C.blue, { stack: 's' }), bar('Manufacturing', A.manufacturingPct, C.teal, { stack: 's' }), bar('Other', A.otherCostPct, C.grey, { stack: 's' }), bar('EBITDA', rest, C.gold, { stack: 's' })] },
    options: { scales: { x: { stacked: true, ...noGrid }, y: { stacked: true, ...yPct, max: 100 } } } });
  if (Q) mk('c-qcost', { data: { labels: Q.labels, datasets: [line('Material %', Q.materialPct, C.navy, { yAxisID: 'y' }), line('OPM %', Q.opm, C.gold, { yAxisID: 'y1' }), line('Employee %', Q.employeePct, C.teal, { yAxisID: 'y1' })] },
    options: { scales: { x: noGrid, y: { ...yPct, title: { display: true, text: 'Material %' } }, y1: { position: 'right', grid: { display: false }, ticks: { callback: v => `${v}%` } } } } });
}

function returns(M) {
  const A = M.annual;
  const rows = [['Net margin %', A.npm, 1], ['× Asset turnover', A.assetTurnover, 2], ['× Leverage (assets / equity)', A.leverage, 2], ['= ROE %', A.roe, 1], ['ROCE %', A.roce, 0], ['Core ROCE ex-cash %', A.coreRoce, 1], ['Incremental ROCE (3y) %', A.incrementalRoce, 1], ['ROA %', A.roa, 1], ['Fixed-asset turnover', A.fixedAssetTurnover, 2]];
  const body = `<div class="grid g2">${box('c-roe', 'Return ratios', 'ROE, ROCE and return on operating capital (ex cash & investments)')}
    <div class="card"><h3>DuPont: what drives ROE</h3><div class="tablewrap"><table class="fin"><thead><tr><th></th>${A.labels.map(l => `<th>${l}</th>`).join('')}</tr></thead><tbody>${rows.map(([n, a, d]) => `<tr class="${n.startsWith('=') ? 'b' : ''}"><td>${n}</td>${a.map(v => `<td>${fmt(v, d)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div></div>`;
  return chapter('returns', 'Returns on capital', 'Is growth creating value? ROE, ROCE and the DuPont breakdown.', storyHtml(M, 'returns') + body);
}
function returnCharts(M) {
  const A = M.annual;
  mk('c-roe', { data: { labels: A.labels, datasets: [line('ROE %', A.roe, C.navy), line('ROCE %', A.roce, C.gold), line('Core ROCE ex-cash %', A.coreRoce, C.teal, { borderDash: [4, 3], yAxisID: 'y1' })] },
    options: { scales: { x: noGrid, y: yPct, y1: { position: 'right', grid: { display: false }, ticks: { callback: v => `${v}%` }, title: { display: true, text: 'Core ROCE' } } }, plugins: { events: { list: markers(M, 'y') } } } });
}

function balance(M) {
  const A = M.annual, i = A.labels.length - 1;
  const body = `<div class="kpis">${kpi('Net worth', crore(A.netWorth[i]), `BVPS ${rs(A.bvps[i])}`)}${kpi('Borrowings', crore(A.borrowings[i]), `D/E ${x(A.debtEquity[i], 2)}`)}${kpi('Cash + investments', crore(A.cashAndInvestments[i]))}${kpi(A.netDebt[i] < 0 ? 'Net cash' : 'Net debt', crore(Math.abs(A.netDebt[i])), '', A.netDebt[i] < 0 ? 'pos' : 'neg')}${kpi('Gross block', crore(A.grossBlock[i]), `CWIP ${crore(A.cwip[i])}`)}</div>
    <div class="grid g2">${box('c-bs', 'Balance sheet composition', 'Assets side, ₹ crore')}${box('c-net', 'Net cash / (debt) and net worth', '₹ crore')}</div>`;
  return chapter('balance', 'Balance sheet', 'What the company owns, what it owes, and how much cash it sits on.', storyHtml(M, 'balance') + body);
}
function balanceCharts(M) {
  const A = M.annual;
  const otherA = A.otherAssets.map((v, i) => (isNum(v) ? v - (A.cash[i] || 0) : null));
  mk('c-bs', { type: 'bar', data: { labels: A.labels, datasets: [bar('Fixed assets', A.fixedAssets, C.navy, { stack: 'a' }), bar('CWIP', A.cwip, C.blue, { stack: 'a' }), bar('Investments', A.investments, C.gold, { stack: 'a' }), bar('Cash', A.cash, C.gold2, { stack: 'a' }), bar('Other assets', otherA, C.grey, { stack: 'a' })] }, options: { scales: { x: { stacked: true, ...noGrid }, y: { stacked: true, ...yNum } } } });
  mk('c-net', { data: { labels: A.labels, datasets: [bar('Net cash (+) / debt (−)', A.netDebt.map(v => (isNum(v) ? -v : null)), A.netDebt.map(v => (v <= 0 ? C.pos : C.neg))), line('Net worth', A.netWorth, C.navy)] }, options: { scales: { x: noGrid, y: yNum } } });
}

function cash(M) {
  const A = M.annual, k = A.cumulative;
  const body = `<div class="kpis">${kpi(`CFO, ${k.years} yrs`, crore(k.cfo), `${pc((k.cfo / k.pat) * 100, 0)} of PAT`)}${kpi('Capex', crore(k.capex))}${kpi('Free cash flow', crore(k.fcf))}${kpi('Dividends paid', crore(k.dividends))}${kpi('Acquisitions', crore(k.acquisitions))}</div>
    <div class="grid g2">${box('c-cf', 'Cash generation vs reported profit', '₹ crore')}${box('c-capex', 'Capex cycle', 'Capex (₹ cr) and capex ÷ depreciation (x)')}</div>
    <div class="grid g2" style="margin-top:14px">${box('c-wc', 'Working capital days', 'Debtor, inventory and payable days; cash conversion cycle')}${box('c-conv', 'Cash conversion', 'CFO / EBITDA and FCF / PAT (%)')}</div>`;
  return chapter('cash', 'Cash flow & working capital', 'Profit is an opinion; cash is a fact.', storyHtml(M, 'cash') + body);
}
function cashCharts(M) {
  const A = M.annual;
  mk('c-cf', { data: { labels: A.labels, datasets: [bar('Operating cash flow', A.cfo, C.navy), bar('Net profit', A.pat, C.gold), bar('Free cash flow', A.fcfCalc, C.teal)] }, options: { scales: { x: noGrid, y: yNum } } });
  mk('c-capex', { data: { labels: A.labels, datasets: [bar('Capex', A.capex, 'rgba(13,31,68,.8)', { yAxisID: 'y' }), line('Capex / depreciation', A.capexToDep, C.gold, { yAxisID: 'y1' })] }, options: { scales: { x: noGrid, y: yNum, y1: { position: 'right', grid: { display: false }, ticks: { callback: v => `${v}x` } } }, plugins: { events: { list: markers(M, 'y') } } } });
  mk('c-wc', { data: { labels: A.labels, datasets: [line('Debtor days', A.debtorDays, C.blue), line('Inventory days', A.inventoryDays, C.teal), line('Payable days', A.payableDays, C.gold), bar('Cash conversion cycle', A.ccc, 'rgba(13,31,68,.25)')] }, options: { scales: { x: noGrid, y: yNum } } });
  mk('c-conv', { data: { labels: A.labels, datasets: [bar('CFO / EBITDA %', A.cfoToEbitda, C.navy), line('FCF / PAT %', A.fcfToPat, C.gold)] }, options: { scales: { x: noGrid, y: yPct } } });
}

function actions(M) {
  const ck = M.research.company;
  if (!ck) return chapter('actions', 'What management did', '', `<div class="notice">Corporate-actions research hasn't been generated for this company yet. The numbers chapters above are complete.</div>`);
  const tl = (ck.timeline || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const quarters = (ck.quarterlyKpis || []).filter(r => r.units || r.marginDrivers);
  const body = `<div class="tabs" id="tlf"><button class="on" data-c="">All</button>${[...new Set(tl.map(e => e.category))].map(c => `<button data-c="${c}">${c}</button>`).join('')}</div>
    <div class="grid g2"><div class="timeline" id="tl">${tl.map(e => `<div class="tl cat-${e.category}" data-c="${e.category}"><div class="d">${esc(e.date)} · ${esc(e.category)}</div><div class="t">${esc(e.title)}</div><div>${esc(e.detail || '')}</div>${e.impact ? `<div class="i ${/fall|declin|drop|loss|lower|hit|compress|down/i.test(e.impact) ? 'neg' : ''}">▸ ${esc(e.impact)}</div>` : ''}<div class="src">${linkify(e.src)}</div></div>`).join('')}</div>
    <div>${(ck.concallTakeaways || []).map(c => `<div class="card" style="margin-bottom:12px"><h3>Concall: ${esc(c.call)}</h3><ul>${c.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul><div class="src">${linkify(c.src)}</div></div>`).join('')}
      ${ck.guidance?.length ? `<div class="card"><h3>Management guidance</h3><table class="fin"><tbody>${ck.guidance.map(g => `<tr><td style="white-space:normal">${esc(g.item)}</td><td style="white-space:normal;text-align:left">${esc(g.value)} ${linkify(g.src)}</td></tr>`).join('')}</tbody></table></div>` : ''}</div></div>
    ${quarters.length ? `<div class="card" style="margin-top:14px"><h3>Quarter by quarter: volumes and what moved margins</h3><div class="tablewrap"><table class="fin"><thead><tr><th>Quarter</th><th>Units</th><th>Domestic</th><th>Exports</th><th>Realisation ₹</th><th style="text-align:left">Margin drivers</th></tr></thead><tbody>${quarters.map(r => `<tr><td>${esc(r.q)}</td><td>${fmt(r.units)}</td><td>${fmt(r.domestic)}</td><td>${fmt(r.exports)}</td><td>${fmt(r.realisation)}</td><td style="white-space:normal;text-align:left;min-width:380px">${esc(r.marginDrivers || '')}</td></tr>`).join('')}</tbody></table></div></div>` : ''}`;
  return chapter('actions', 'What management did — and what it did to the numbers', 'Capacity, products, corporate actions and policy shocks, with their measurable impact.', storyHtml(M, 'actions') + body);
}
function actionsWire() {
  const f = document.getElementById('tlf');
  if (!f) return;
  f.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    f.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('#tl .tl').forEach(t => (t.style.display = !b.dataset.c || t.dataset.c === b.dataset.c ? '' : 'none'));
  };
}

function industry(M) {
  const ind = M.research.industry;
  if (!ind) return chapter('industry', 'Industry & sector', '', `<div class="notice">Sector research not yet generated. Peer table below is live.</div>`);
  const dr = ind.drivers || [];
  const body = `${ind.fy27 ? `<div class="notice"><b>Current year:</b> ${esc(ind.fy27.ytd)}<br><b>Outlook:</b> ${esc(ind.fy27.forecast)} ${linkify(ind.fy27.src)}</div>` : ''}
    <div class="grid g2">${box('c-indvol', 'Industry volumes', 'Domestic sales (lakh units) and YoY growth')}${box('c-oem', 'Market share by player', 'Share of domestic market (%)')}</div>
    <div class="grid g2" style="margin-top:14px">${box('c-mix', 'Segment mix shift', 'Share of industry volume (%)')}${box('c-exp', 'Exports', 'Industry exports and the company’s share (lakh units)')}</div>
    <div class="bb" style="margin-top:14px"><div class="card bull"><h3>Tailwinds</h3><ul>${dr.filter(d => d.direction === 'tailwind').map(d => `<li><b>${esc(d.theme)}.</b> ${esc(d.detail)} ${linkify(d.src)}</li>`).join('')}</ul></div>
      <div class="card bear"><h3>Headwinds</h3><ul>${dr.filter(d => d.direction !== 'tailwind').map(d => `<li><b>${esc(d.theme)}.</b> ${esc(d.detail)} ${linkify(d.src)}</li>`).join('')}</ul></div></div>
    ${ind.porter ? `<div class="card" style="margin-top:14px"><h3>Industry structure (five forces)</h3><table class="fin"><tbody>${Object.entries(ind.porter).map(([k, v]) => `<tr><td style="text-transform:capitalize;width:130px">${esc(k)}</td><td style="white-space:normal;text-align:left">${esc(v)}</td></tr>`).join('')}</tbody></table></div>` : ''}
    ${ind.themes?.length ? `<div class="card" style="margin-top:14px"><h3>Themes for the next 2–3 years</h3><ol>${ind.themes.map(t => `<li>${esc(t)}</li>`).join('')}</ol></div>` : ''}`;
  return chapter('industry', 'Industry & sector', 'The pond the company swims in: size, growth, mix, competition.', storyHtml(M, 'industry') + body);
}
function industryCharts(M) {
  const ind = M.research.industry;
  if (!ind) return;
  const iv = (ind.industryVolumes || []).filter(r => isNum(r.domesticPV));
  mk('c-indvol', { data: { labels: iv.map(r => r.fy), datasets: [bar('Domestic volume (lakh)', iv.map(r => r.domesticPV / 1e5), 'rgba(13,31,68,.8)', { yAxisID: 'y' }), line('YoY %', iv.map(r => r.yoy), C.gold, { yAxisID: 'y1' })] }, options: { scales: { x: noGrid, y: yNum, y1: { position: 'right', grid: { display: false }, ticks: { callback: v => `${v}%` } } } } });
  const os = ind.oemShare || [];
  const players = ['maruti', 'hyundai', 'tata', 'mm', 'toyota', 'kia', 'honda'];
  const names = { maruti: 'Maruti', hyundai: 'Hyundai', tata: 'Tata', mm: 'M&M', toyota: 'Toyota', kia: 'Kia', honda: 'Honda' };
  mk('c-oem', { data: { labels: os.map(r => r.fy), datasets: players.filter(p => os.some(r => isNum(r[p]))).map((p, i) => line(names[p], os.map(r => r[p]), SERIES[i], { borderWidth: p === 'maruti' ? 3 : 1.5 })) }, options: { scales: { x: noGrid, y: yPct } } });
  const mx = (ind.segmentMix || []).filter(r => isNum(r.uvs) || isNum(r.smallCars));
  mk('c-mix', { data: { labels: mx.map(r => r.fy), datasets: [line('Utility vehicles / SUVs', mx.map(r => r.uvs), C.navy), line('Small cars / hatchbacks', mx.map(r => r.smallCars), C.gold), line('Sedans', mx.map(r => r.sedans), C.teal)] }, options: { scales: { x: noGrid, y: yPct } } });
  const ex = ind.exports || [];
  mk('c-exp', { data: { labels: ex.map(r => r.fy), datasets: [bar('Industry exports', ex.map(r => (isNum(r.industry) ? r.industry / 1e5 : null)), 'rgba(13,31,68,.75)'), bar('Company exports', ex.map(r => (isNum(r.maruti) ? r.maruti / 1e5 : null)), C.gold)] }, options: { scales: { x: noGrid, y: yNum } } });
}

function peers(M) {
  const p = M.peers;
  if (!p?.rows?.length) return '';
  const extra = M.research.industry?.peers || [];
  const body = `<div class="card"><h3>Listed peers (Screener industry group)</h3><div class="tablewrap"><table class="fin"><thead><tr>${p.head.slice(1).map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${p.rows.map(r => `<tr class="${r[1] && M.meta.name.toLowerCase().startsWith(r[1].toLowerCase().split(' ')[0]) ? 'b' : ''}">${r.slice(1).map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
    <div class="grid g2" style="margin-top:14px">${box('c-peerpe', 'Valuation vs peers', 'P/E (x)', 'short')}${box('c-peerroce', 'Quality vs peers', 'ROCE (%)', 'short')}</div>
    ${extra.length ? `<div class="card" style="margin-top:14px"><h3>Peer context</h3><table class="fin"><tbody>${extra.map(e => `<tr><td>${esc(e.name)}</td><td style="white-space:normal;text-align:left">${esc(e.note || '')} ${linkify(e.src)}</td></tr>`).join('')}</tbody></table></div>` : ''}`;
  return chapter('peers', 'Peers', 'How the company stacks up on size, growth, quality and price.', storyHtml(M, 'peers') + body);
}
function peerCharts(M) {
  const p = M.peers;
  if (!p?.rows?.length) return;
  const col = n => p.head.indexOf(n);
  const names = p.rows.map(r => r[1]).filter(Boolean);
  const val = (n) => p.rows.filter(r => r[1]).map(r => Number(String(r[col(n)]).replace(/,/g, '')) || null);
  const me = names.map(n => M.meta.name.toLowerCase().startsWith(n.toLowerCase().split(' ')[0]));
  const h = { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#f0ece0' } }, y: noGrid } };
  mk('c-peerpe', { type: 'bar', data: { labels: names, datasets: [bar('P/E', val('P/E'), me.map(m => (m ? C.gold : C.navy)))] }, options: h });
  mk('c-peerroce', { type: 'bar', data: { labels: names, datasets: [bar('ROCE %', val('ROCE %'), me.map(m => (m ? C.gold : C.navy)))] }, options: h });
}

function valuation(M) {
  const V = M.valuation;
  const row = (n, v) => { if (!v) return ''; const w = v.windows['10y'] || v.windows.all, w5 = v.windows['5y'], a = v.windows.all; return `<tr><td>${n}</td><td><b>${x(v.current)}</b></td><td>${x(w5?.median)}</td><td>${x(w.median)}</td><td>${x(a.median)}</td><td>${x(w.min)} – ${x(w.max)}</td><td>${fmt(w.percentile, 0)}</td><td class="${cls(-w.zScore)}">${fmt(w.zScore, 2)}</td></tr>`; };
  const body = `<div class="card"><h3>Where the multiples sit today</h3><table class="fin"><thead><tr><th>Multiple</th><th>Now</th><th>5y median</th><th>10y median</th><th>All-time median</th><th>10y range</th><th>10y percentile</th><th>z-score</th></tr></thead><tbody>
    ${row('P/E', V.pe)}${row('EV / EBITDA', V.evEbitda)}${row('Price / Book', V.pb)}${row('Mkt cap / Sales', V.mcapSales)}</tbody></table>
    <p class="cap" style="margin-top:8px">Percentile = share of the last 10 years the multiple was at or below today’s level. Low percentile = historically cheap.</p></div>
    <div class="grid g2" style="margin-top:14px">${box('c-pe', 'P/E band', 'Trailing P/E with 10-year median and ±1σ', 'tall')}${box('c-ev', 'EV/EBITDA band', 'With 10-year median and ±1σ', 'tall')}</div>
    <div class="grid g2" style="margin-top:14px">${box('c-pb', 'Price / Book band', 'With 10-year median and ±1σ')}${box('c-eps', 'Earnings power behind the price', 'TTM EPS (₹) vs share price (₹)')}</div>`;
  return chapter('valuation', 'Valuation through time', 'Is the stock cheap or expensive — against its own history?', storyHtml(M, 'valuation') + body);
}
function band(id, v, label) {
  if (!v) return;
  const w = v.windows['10y'] || v.windows.all;
  const L = v.series.map(p => p[0]);
  const flat = val => L.map(() => val);
  mk(id, { data: { labels: L, datasets: [
    line(label, v.series.map(p => p[1]), C.navy, { pointRadius: 0, borderWidth: 1.6, tension: 0 }),
    line('10y median', flat(w.median), C.gold, { pointRadius: 0, borderWidth: 1.5 }),
    line('+1σ', flat(w.mean + w.sd), C.grey, { pointRadius: 0, borderWidth: 1, borderDash: [4, 4] }),
    line('−1σ', flat(w.mean - w.sd), C.grey, { pointRadius: 0, borderWidth: 1, borderDash: [4, 4] }),
  ] }, options: { scales: { x: { ...noGrid, ticks: { maxTicksLimit: 10, callback(val) { return this.getLabelForValue(val).slice(0, 4); } } }, y: { grid: { color: '#f0ece0' }, ticks: { callback: v => `${v}x` } } } } });
}
function valuationCharts(M) {
  const V = M.valuation, P = M.price;
  band('c-pe', V.pe, 'P/E'); band('c-ev', V.evEbitda, 'EV/EBITDA'); band('c-pb', V.pb, 'P/B');
  if (P && V.epsTtm.length) {
    // EPS is quarterly; step it across the weekly price dates.
    const eps = V.epsTtm; let j = 0;
    const epsOnPx = P.series.map(([d]) => { while (j + 1 < eps.length && eps[j + 1][0] <= d) j++; return eps[j][0] <= d ? eps[j][1] : null; });
    mk('c-eps', { data: { labels: P.series.map(p => p[0]), datasets: [line('Share price', P.series.map(p => p[1]), C.navy, { pointRadius: 0, borderWidth: 1.4, tension: 0, yAxisID: 'y' }), line('TTM EPS', epsOnPx, C.gold, { pointRadius: 0, borderWidth: 2, stepped: true, yAxisID: 'y1' })] },
      options: { scales: { x: { ...noGrid, ticks: { maxTicksLimit: 10, callback(val) { return this.getLabelForValue(val).slice(0, 4); } } }, y: yNum, y1: { position: 'right', grid: { display: false } } } } });
  }
}

function priceOwnership(M) {
  const P = M.price, R = P?.relative;
  if (!P) return '';
  const body = `<div class="kpis">${['1y', '3y', '5y', '10y', '15y', '20y'].filter(k => P.returns[k] != null).map(k => kpi(k === '1y' ? '1-year return' : `${k} CAGR`, pc(P.returns[k]), '', cls(P.returns[k]))).join('')}${kpi('From all-time high', pc(P.currentDrawdown), `ATH ${rs(P.allTimeHigh)}`, 'neg')}${kpi('Worst drawdown', pc(P.maxDrawdown), P.maxDrawdownDate || '')}</div>
    <div class="grid g2">${R ? box('c-rel', `Stock vs BSE-500 since ${R.start.slice(0, 4)}`, `Rebased to 100. CAGR: stock ${pc(R.stockCagr)} vs index ${pc(R.indexCagr)}`) : ''}${box('c-px', 'Price with 50/200-day averages', '₹, weekly')}</div>
    <div class="grid g2" style="margin-top:14px">${box('c-dd', 'Drawdown from peak', '% below previous all-time high')}${M.shareholding ? box('c-sh', 'Who owns the stock', 'Shareholding pattern, %') : ''}</div>`;
  return chapter('market', 'Share price & ownership', 'How the market has paid shareholders — and who is buying or selling.', storyHtml(M, 'price') + (M.insights.ownership ? `<ul class="insights">${M.insights.ownership.map(i => `<li class="${i.tone}">${esc(i.text)}</li>`).join('')}</ul>` : '') + body);
}
function priceCharts(M) {
  const P = M.price, R = P?.relative;
  if (!P) return;
  const yr = { ...noGrid, ticks: { maxTicksLimit: 10, callback(val) { return this.getLabelForValue(val).slice(0, 7); } } };
  if (R) mk('c-rel', { data: { labels: R.series.map(r => r[0]), datasets: [line(M.meta.name.split(' ')[0], R.series.map(r => r[1]), C.navy, { pointRadius: 0, tension: 0 }), line('BSE-500', R.series.map(r => r[2]), C.gold, { pointRadius: 0, tension: 0 })] }, options: { scales: { x: yr, y: yNum } } });
  const tail = P.series.filter(([d]) => d >= P.series[Math.max(0, P.series.length - 260)][0]);
  const idx = P.series.length - tail.length;
  mk('c-px', { data: { labels: tail.map(r => r[0]), datasets: [line('Price', tail.map(r => r[1]), C.navy, { pointRadius: 0, tension: 0 }), line('50 DMA', (P.dma50 || []).slice(idx).map(r => +r[1]), C.gold, { pointRadius: 0, borderWidth: 1 }), line('200 DMA', (P.dma200 || []).slice(idx).map(r => +r[1]), C.neg, { pointRadius: 0, borderWidth: 1 })] }, options: { scales: { x: yr, y: yNum } } });
  mk('c-dd', { data: { labels: P.drawdown.map(r => r[0]), datasets: [line('Drawdown %', P.drawdown.map(r => r[1]), C.neg, { pointRadius: 0, tension: 0, fill: true, backgroundColor: 'rgba(180,35,42,.12)' })] }, options: { plugins: { legend: { display: false } }, scales: { x: yr, y: yPct } } });
  const S = M.shareholding;
  if (S) {
    const keys = Object.keys(S.rows).filter(k => !/Shareholders/.test(k));
    mk('c-sh', { type: 'bar', data: { labels: S.periods, datasets: keys.map((k, i) => bar(k, S.rows[k], SERIES[i], { stack: 's' })) }, options: { scales: { x: { stacked: true, ...noGrid }, y: { stacked: true, ...yPct, max: 100 } } } });
  }
}

function street(M) {
  const s = M.research.street;
  if (!s) return chapter('street', 'The street view', '', `<div class="notice">Consensus estimates not yet loaded for this company.</div>`);
  const A = M.annual, i = A.labels.length - 1, P = M.price;
  const cons = (s.consensus || []).filter(c => /^FY\d\dE$/.test(c.fy) && (isNum(c.eps) || isNum(c.revenue)));
  const fwd = cons.map(c => ({ ...c, pe: isNum(c.eps) ? P.last / c.eps : null, epsG: null }));
  fwd.forEach((c, k) => { const prev = k ? fwd[k - 1].eps : A.eps[i]; c.epsG = isNum(c.eps) && isNum(prev) ? (c.eps / prev - 1) * 100 : null; c.revG = isNum(c.revenue) ? ((c.revenue / (k ? fwd[k - 1].revenue : A.sales[i])) - 1) * 100 : null; });
  const r = s.ratings || {};
  const be = s.brokerEstimates || [];
  const body = `<div class="kpis">${kpi('Analysts', fmt(r.analysts), `${fmt(r.buy)} Buy · ${fmt(r.hold)} Hold · ${fmt(r.sell)} Sell`)}${kpi('Mean target', rs(r.tpMean), `${pc((r.tpMean / P.last - 1) * 100, 0)} upside`, cls(r.tpMean - P.last))}${kpi('Target range', `${rs(r.tpLow)} – ${rs(r.tpHigh)}`)}${fwd[0] ? kpi(`P/E on ${fwd[0].fy}`, x(fwd[0].pe), `EPS ${rs(fwd[0].eps, 1)}`) : ''}${fwd[1] ? kpi(`P/E on ${fwd[1].fy}`, x(fwd[1].pe), `EPS ${rs(fwd[1].eps, 1)}`) : ''}</div>
    <div class="grid g2"><div class="card"><h3>Consensus forecasts</h3><p class="cap">Actuals from the model; estimates shaded</p><table class="fin"><thead><tr><th></th><th>${A.labels[i - 1]}A</th><th>${A.labels[i]}A</th>${fwd.map(c => `<th class="est">${c.fy}</th>`).join('')}</tr></thead><tbody>
      <tr><td>Revenue (₹ cr)</td><td>${fmt(A.sales[i - 1])}</td><td>${fmt(A.sales[i])}</td>${fwd.map(c => `<td class="est">${fmt(c.revenue)}</td>`).join('')}</tr>
      <tr><td>Revenue growth</td><td>${pc(A.salesGrowth[i - 1])}</td><td>${pc(A.salesGrowth[i])}</td>${fwd.map(c => `<td class="est">${pc(c.revG)}</td>`).join('')}</tr>
      <tr><td>EPS (₹)</td><td>${fmt(A.eps[i - 1], 1)}</td><td>${fmt(A.eps[i], 1)}</td>${fwd.map(c => `<td class="est">${fmt(c.eps, 1)}</td>`).join('')}</tr>
      <tr><td>EPS growth</td><td>${pc(A.epsGrowth[i - 1])}</td><td>${pc(A.epsGrowth[i])}</td>${fwd.map(c => `<td class="est">${pc(c.epsG)}</td>`).join('')}</tr>
      <tr><td>EPS range</td><td></td><td></td>${fwd.map(c => `<td class="est">${fmt(c.epsLow, 0)}–${fmt(c.epsHigh, 0)}</td>`).join('')}</tr>
      <tr class="b"><td>P/E at ${rs(P.last)}</td><td>${x(P.last / A.eps[i - 1])}</td><td>${x(P.last / A.eps[i])}</td>${fwd.map(c => `<td class="est">${x(c.pe)}</td>`).join('')}</tr></tbody></table>
      <div class="src">${esc(cons[0]?.source || '')} ${linkify(cons[0]?.url)}</div></div>
      ${box('c-rev-eps', 'Estimate revisions', 'Consensus EPS for the current year over time (₹)')}</div>
    ${be.length ? `<div class="card" style="margin-top:14px"><h3>Broker models</h3><div class="tablewrap"><table class="fin"><thead><tr><th>Broker</th><th>Date</th>${['FY27E', 'FY28E'].map(y => `<th>${y} Rev</th><th>${y} EBITDA %</th><th>${y} EPS</th>`).join('')}<th>Basis</th></tr></thead><tbody>${be.map(b => `<tr><td>${esc(b.broker)}</td><td>${esc(b.date)}</td>${['FY27E', 'FY28E'].map(y => `<td>${fmt(b[y]?.revenue)}</td><td>${fmt(b[y]?.ebitdaMargin, 1)}</td><td>${fmt(b[y]?.eps, 1)}</td>`).join('')}<td style="text-align:left">${esc(b.basis || '')} ${linkify(b.url)}</td></tr>`).join('')}</tbody></table></div></div>` : ''}
    <div class="grid g2" style="margin-top:14px">${box('c-tp', 'Broker targets vs price', `₹; line = current price ${rs(P.last)}`)}
      <div class="card"><h3>Latest broker calls</h3><div class="tablewrap" style="max-height:300px"><table class="fin"><thead><tr><th>Broker</th><th>Rating</th><th>Target</th><th>Date</th></tr></thead><tbody>${(s.brokers || []).map(b => `<tr title="${esc(b.thesis)}"><td>${esc(b.broker)} ${linkify(b.url)}</td><td>${esc(b.rating)}</td><td>${fmt(b.tp)}</td><td>${esc(b.date)}</td></tr><tr><td colspan="4" style="white-space:normal;text-align:left;font-size:11.5px;color:#6b7280">${esc(b.thesis)}</td></tr>`).join('')}</tbody></table></div></div></div>
    <div class="bb" style="margin-top:14px"><div class="card bull"><h3>Bull case</h3><ul>${(s.bull || []).map(b => `<li>${esc(b)}</li>`).join('')}</ul></div><div class="card bear"><h3>Bear case</h3><ul>${(s.bear || []).map(b => `<li>${esc(b)}</li>`).join('')}</ul></div></div>
    ${s.notes ? `<p class="src">Notes: ${esc(typeof s.notes === 'string' ? s.notes : JSON.stringify(s.notes))}</p>` : ''}`;
  return chapter('street', 'The street view', 'What analysts expect, how expectations have moved, and the debate.', storyHtml(M, 'street') + body);
}
function streetCharts(M) {
  const s = M.research.street;
  if (!s) return;
  const rev = (s.revisions || []).find(r => /consensus EPS/i.test(r.metric));
  if (rev) mk('c-rev-eps', { data: { labels: rev.series.map(p => p.ago || p.date), datasets: [line(rev.metric, rev.series.map(p => p.value), C.navy)] }, options: { plugins: { legend: { display: false } }, scales: { x: noGrid, y: yNum } } });
  const b = (s.brokers || []).filter(b => isNum(b.tp)).sort((a, z) => z.tp - a.tp);
  const px = M.price.last;
  mk('c-tp', { data: { labels: b.map(b => b.broker.replace(/ (Securities|Institutional|Financial|Capital).*$/, '')), datasets: [bar('Target', b.map(b => b.tp), b.map(b => (/sell|reduce|under/i.test(b.rating) ? C.neg : /hold|neutral|add|accum/i.test(b.rating) ? C.grey : C.navy)))] },
    options: { indexAxis: 'y', plugins: { legend: { display: false }, refline: { value: px, text: `Price ₹${fmt(px)}` } }, scales: { x: { grid: { color: '#f0ece0' }, min: Math.floor(Math.min(px, ...b.map(b => b.tp)) * 0.85 / 1000) * 1000 }, y: noGrid } } });
}

function verdict(M) {
  const s = M.research.story;
  if (!s?.verdict && !s?.watch) return '';
  const body = `${s.verdict ? `<div class="story">${(Array.isArray(s.verdict) ? s.verdict : [s.verdict]).map(p => `<p>${p}</p>`).join('')}</div>` : ''}
    ${s.watch?.length ? `<div class="card"><h3>What to watch</h3><table class="fin"><thead><tr><th>Signal</th><th style="text-align:left">Why it matters</th><th style="text-align:left">Where we'd see it</th></tr></thead><tbody>${s.watch.map(w => `<tr><td style="white-space:normal;text-align:left"><b>${esc(w.signal)}</b></td><td style="white-space:normal;text-align:left">${esc(w.why)}</td><td style="white-space:normal;text-align:left">${esc(w.where || '')}</td></tr>`).join('')}</tbody></table></div>` : ''}`;
  return chapter('verdict', 'Putting it together', 'The story in one place, and the signals that would change it.', body);
}

// ---------- full statements (appendix) ----------
function statements(M) {
  const A = M.annual, Q = M.quarterly;
  const T = (rows, labels, d = 0) => `<div class="tablewrap"><table class="fin"><thead><tr><th>₹ crore</th>${labels.map(l => `<th>${l}</th>`).join('')}</tr></thead><tbody>${rows.map(r => (r.h ? `<tr class="hd"><td colspan="${labels.length + 1}">${r.h}</td></tr>` : `<tr class="${r.b ? 'b' : ''}"><td>${r.n}</td>${labels.map((_, i) => `<td class="${r.c ? cls(r.v[i]) : ''}">${fmt(r.v[i], r.d ?? d)}</td>`).join('')}</tr>`)).join('')}</tbody></table></div>`;
  const pl = [{ n: 'Revenue', v: A.sales, b: 1 }, { n: 'Growth %', v: A.salesGrowth, d: 1, c: 1 }, { n: 'Expenses', v: A.expenses }, { n: 'EBITDA', v: A.ebitda, b: 1 }, { n: 'EBITDA margin %', v: A.ebitdaMargin, d: 1 }, { n: 'Other income', v: A.otherIncome }, { n: 'Interest', v: A.interest }, { n: 'Depreciation', v: A.dep }, { n: 'PBT', v: A.pbt, b: 1 }, { n: 'Tax %', v: A.taxPct, d: 0 }, { n: 'Net profit', v: A.pat, b: 1 }, { n: 'Growth %', v: A.patGrowth, d: 1, c: 1 }, { n: 'EPS (₹)', v: A.eps, d: 2 }, { n: 'DPS (₹)', v: A.dps, d: 1 }, { n: 'Payout %', v: A.payout, d: 0 }];
  const bs = [{ h: 'Liabilities' }, { n: 'Equity capital', v: A.equity }, { n: 'Reserves', v: A.reserves }, { n: 'Net worth', v: A.netWorth, b: 1 }, { n: 'Borrowings', v: A.borrowings }, { n: 'Trade payables', v: A.payables }, { n: 'Customer advances', v: A.customerAdvances }, { n: 'Other liabilities (total)', v: A.otherLiab }, { n: 'Total liabilities', v: A.totalLiab, b: 1 }, { h: 'Assets' }, { n: 'Net block', v: A.fixedAssets }, { n: 'Gross block', v: A.grossBlock }, { n: 'CWIP', v: A.cwip }, { n: 'Investments', v: A.investments }, { n: 'Inventories', v: A.inventories }, { n: 'Receivables', v: A.receivables }, { n: 'Cash', v: A.cash }, { n: 'Other assets (total)', v: A.otherAssets }, { n: 'Total assets', v: A.totalAssets, b: 1 }];
  const cf = [{ n: 'Cash from operations', v: A.cfo, b: 1 }, { n: '  of which working capital', v: A.wcChange }, { n: '  taxes paid', v: A.taxesPaid }, { n: 'Cash from investing', v: A.cfi }, { n: '  capex', v: A.capex }, { n: 'Cash from financing', v: A.cff }, { n: '  dividends paid', v: A.dividendsPaid }, { n: 'Net cash flow', v: A.netCash }, { n: 'Free cash flow', v: A.fcfCalc, b: 1 }, { n: 'CFO / EBITDA %', v: A.cfoToEbitda, d: 0 }];
  const rt = [{ n: 'ROE %', v: A.roe, d: 1 }, { n: 'ROCE %', v: A.roce, d: 0 }, { n: 'Core ROCE ex-cash %', v: A.coreRoce, d: 1 }, { n: 'Debt / equity', v: A.debtEquity, d: 2 }, { n: 'Asset turnover', v: A.assetTurnover, d: 2 }, { n: 'Debtor days', v: A.debtorDays }, { n: 'Inventory days', v: A.inventoryDays }, { n: 'Payable days', v: A.payableDays }, { n: 'Cash conversion cycle', v: A.ccc }, { n: 'Capex / sales %', v: A.capexToSales, d: 1 }, { n: 'Book value / share', v: A.bvps, d: 0 }];
  const ql = Q ? [{ n: 'Revenue', v: Q.sales, b: 1 }, { n: 'YoY %', v: Q.salesYoY, d: 1, c: 1 }, { n: 'EBITDA', v: Q.ebitda, b: 1 }, { n: 'OPM %', v: Q.opm, d: 0 }, { n: 'Material cost %', v: Q.materialPct, d: 0 }, { n: 'Other income', v: Q.otherIncome }, { n: 'Depreciation', v: Q.dep }, { n: 'PBT', v: Q.pbt }, { n: 'Net profit', v: Q.pat, b: 1 }, { n: 'YoY %', v: Q.patYoY, d: 0, c: 1 }, { n: 'EPS (₹)', v: Q.eps, d: 2 }] : [];
  const tabs = { 'Profit & loss': T(pl, A.labels), 'Balance sheet': T(bs, A.labels), 'Cash flow': T(cf, A.labels), Ratios: T(rt, A.labels), Quarterly: Q ? T(ql, Q.labels) : '' };
  window.__tabs = tabs;
  const body = `<div class="tabs" id="sttabs">${Object.keys(tabs).map((k, i) => `<button class="${i ? '' : 'on'}" data-k="${k}">${k}</button>`).join('')}<button id="csv">⬇ Download CSV</button></div><div id="stbody">${tabs['Profit & loss']}</div>
    <p class="src">Source: Screener.in consolidated, fetched ${new Date(M.meta.fetchedAt).toLocaleString('en-IN')}. Annual reports: ${(M.documents?.annualReports || []).slice(0, 6).map(a => `<a href="${esc(a.href)}" target="_blank">${esc(a.text.replace('Annual Report ', 'AR'))}</a>`).join(' · ')}</p>`;
  return chapter('statements', 'Financial statements', 'The full numbers, annual and quarterly.', body);
}
function statementsWire(M) {
  const t = document.getElementById('sttabs');
  t.onclick = e => {
    const b = e.target.closest('button[data-k]'); if (!b) return;
    t.querySelectorAll('button[data-k]').forEach(x => x.classList.toggle('on', x === b));
    document.getElementById('stbody').innerHTML = window.__tabs[b.dataset.k];
  };
  document.getElementById('csv').onclick = () => {
    const tbl = document.querySelector('#stbody table');
    const csv = [...tbl.rows].map(r => [...r.cells].map(c => `"${c.innerText.replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${SYMBOL}-${t.querySelector('.on').dataset.k.replace(/\W+/g, '-')}.csv`;
    a.click();
  };
}

// ---------- page ----------
function render(M) {
  document.title = `${M.meta.name} · GAM Research`;
  const html = hero(M) + business(M) + growth(M) + margins(M) + returns(M) + balance(M) + cash(M) + actions(M) + industry(M) + peers(M) + valuation(M) + priceOwnership(M) + street(M) + verdict(M) + statements(M);
  document.getElementById('app').innerHTML = `<div class="layout"><nav class="toc">${CHAPTERS.map((c, i) => `<a href="#${c.id}"><span class="n">${String(i + 1).padStart(2, '0')}</span>${c.title.split(' — ')[0]}</a>`).join('')}</nav><main>${html}</main></div>`;
  [businessCharts, growthCharts, marginCharts, returnCharts, balanceCharts, cashCharts, industryCharts, peerCharts, valuationCharts, priceCharts, streetCharts].forEach(f => { try { f(M); } catch (e) { console.error(f.name, e); } });
  actionsWire(); statementsWire(M);
  const links = [...document.querySelectorAll('nav.toc a')];
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`)); }), { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('section.ch').forEach(s => obs.observe(s));
}

async function load(refresh) {
  document.getElementById('loadmsg').textContent = refresh ? 'Re-fetching source data and rebuilding the model…' : `Loading ${SYMBOL}… (first open of a company fetches its data — about 20 seconds)`;
  const r = await fetch(`/api/model/${encodeURIComponent(SYMBOL)}${refresh ? '?refresh=1' : ''}`);
  const M = await r.json();
  if (!r.ok) { document.getElementById('app').innerHTML = `<div class="loading">Couldn't build ${esc(SYMBOL)}: ${esc(M.error)}</div>`; return; }
  CHAPTERS.length = 0; charts.splice(0).forEach(c => c.destroy());
  render(M);
}
document.getElementById('refresh').onclick = () => { document.getElementById('app').innerHTML = '<div class="loading"><div class="spin"></div><div id="loadmsg"></div></div>'; load(true); };

// header search
let U = [];
fetch('/api/universe').then(r => r.json()).then(u => (U = u.companies));
const hq = document.getElementById('hq'), hdd = document.getElementById('hdd');
hq.oninput = () => {
  const q = hq.value.trim().toLowerCase();
  const hits = q ? U.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)).slice(0, 12) : [];
  hdd.innerHTML = hits.map(c => `<a href="/company/${encodeURIComponent(c.symbol)}"><span>${esc(c.name)}</span><span class="muted">${esc(c.symbol)}</span></a>`).join('');
  hdd.style.display = hits.length ? 'block' : 'none';
};
hq.onkeydown = e => { if (e.key === 'Enter') { const a = hdd.querySelector('a'); if (a) location.href = a.href; } };
document.addEventListener('click', e => { if (!e.target.closest('.hsearch')) hdd.style.display = 'none'; });

document.getElementById('xlsLink').href = `/api/excel/${encodeURIComponent(SYMBOL)}`;
document.getElementById('icLink').href = `/company/${encodeURIComponent(SYMBOL)}/initiation`;
load(false);
