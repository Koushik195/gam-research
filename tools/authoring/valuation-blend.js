// Shared valuation blocks.
//   blendBlocks  – weighted multi-method summary (legacy; used when methods carry weights)
//   streetBlocks – the house approach: value the stock the way the street does (primary method),
//                  derive the multiple from the stock's own forward-multiple history, and show the
//                  other methods as cross-checks only (no weights).
const fs = require('fs');
const path = require('path');
const BASIS = { dcf: 'DCF (cash flows)', sotp: 'Sum of the parts', ri: 'Residual income on book', pe: 'EPS', pb: 'Book value / share', jpb: 'Book value / share (justified P/B)', evEbitda: 'EBITDA', evSales: 'Revenue', evGov: 'Order value (GOV)' };
const loadModel = sym => JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', `${sym}.json`), 'utf8'));
const n0 = v => Math.round(v).toLocaleString('en-IN');

function blendBlocks(sym, { intro, source = 'GAM Research' } = {}) {
  const M = loadModel(sym);
  const V = M.forecast.dcf, B = V.blend, price = M.price.last;
  const pct = w => `${Math.round(w * 100)}%`;
  return [
    { h: 'How we get to the target: several methods, weighted' },
    ...(intro ? [{ p: intro }] : []),
    { exhibit: { type: 'table', title: 'Valuation summary: {{dcf.method}}', head: ['Method', 'Basis', 'Base multiple', 'Value / share (₹)', 'Weight', 'Bull (₹)', 'Bear (₹)', 'Why this method'], wide: [7], rows: [
      ...B.methods.map((m, i) => [`**${m.name}**`, m.year ? `${BASIS[m.method]} ${m.year}` : BASIS[m.method], m.mult != null ? `${m.mult}x` : '–', `{{dcf.blend.methods.${i}.value|num}}`, pct(m.weight), `{{scen.bull.blend.methods.${i}.value|num}}`, `{{scen.bear.blend.methods.${i}.value|num}}`, m.why || '']),
      { hl: true, cells: ['**Weighted value**', '', '', '{{dcf.blend.value|num}}', '100%', '{{scen.bull.blend.value|num}}', '{{scen.bear.blend.value|num}}', ''] },
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '**{{dcf.tp|inr}}**', '', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}', 'vs CMP ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source } },
    { exhibit: { type: 'hbar', title: 'Each method against the share price', unit: '₹ per share (base case)', x: [...B.methods.map(m => m.name), 'Weighted target', 'Share price today'], series: [{ name: 'Value', values: [...B.methods.map(m => Math.round(m.value)), V.tp, price], fmt: 'inr' }], labels: 'all', highlight: 'Weighted target', source } },
  ];
}

// One-year-forward multiple history: price ÷ next full fiscal year's EPS (or BVPS), actuals then
// our estimates for the latest dates.
function forwardSeries(sym, M, field = 'eps') {
  const S = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', sym, 'screener.json'), 'utf8'));
  const by = {};
  if (field === 'eps') { const pl = S.tables['profit-loss']; pl.periods.forEach((p, i) => { if (/Mar/.test(p)) by[+p.slice(-4)] = pl.rows['EPS in Rs'][i]; }); }
  else M.annual.labels.forEach((l, i) => (by[2000 + +l.slice(2, 4)] = M.annual.bvps[i]));
  M.forecast.F.years.forEach((y, i) => (by[2000 + +y.slice(2, 4)] = M.forecast.F[field][i]));
  return S.charts.price.Price.filter(([d]) => !M.meta.asOf || d <= M.meta.asOf).filter((_, i) => i % 5 === 0).map(([d, px]) => {
    const dt = new Date(d), fy = dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1;
    return [d, by[fy] > 0 ? Math.round(px / by[fy] * 10) / 10 : null];
  }).filter(x => x[1] != null);
}

// o: { rating, street: [[broker, rating, tp, method, multiple, on, thesis]], streetIntro, ourThesis, noOurEps,
//      derivation: [[yardstick, evidence, implies]], derivationIntro, history: { field, from, median, label, title },
//      crossNote, source }
function streetBlocks(sym, o) {
  const M = loadModel(sym), V = M.forecast.dcf, B = V.blend, price = M.price.last, F = M.forecast.F;
  const P = B.methods.find(m => m.role === 'primary'), others = B.methods.filter(m => m.role !== 'primary'), idx = m => B.methods.indexOf(m);
  const basisOf = m => (m.metric != null ? `${BASIS[m.method]} ${m.year} ${m.method.startsWith('ev') ? `₹${n0(m.metric)} cr` : `₹${(Math.round(m.metric * 10) / 10).toLocaleString('en-IN')}`}` : BASIS[m.method]);
  const multTxt = m => (m.multiple ? `${m.multiple.base}x (bull ${m.multiple.bull}x, bear ${m.multiple.bear}x)` : m.method === 'jpb' && m.mult != null ? `${Math.round(m.mult * 100) / 100}x (justified)` : '–');
  const ourAt = (x, on) => { const k = parseFloat(x); if (!k || !on) return '–'; const e = /Sep-28/.test(on) ? (F.eps[1] + F.eps[2]) / 2 : /Jun-28/.test(on) ? F.eps[1] * 0.75 + F.eps[2] * 0.25 : /FY29|Mar-29/.test(on) ? F.eps[2] : /FY28|Mar-28/.test(on) ? F.eps[1] : null; return e ? n0(k * e) : '–'; };
  const blocks = [
    { h: `How the street values ${M.meta.name.replace(/ (India )?Ltd$/, '')}` },
    ...(o.streetIntro ? [{ p: o.streetIntro }] : []),
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiple', 'On', ...(o.noOurEps ? [] : ['At our EPS (₹)']), 'Thesis'], wide: [o.noOurEps ? 6 : 7], rows: [
      ...o.street.map(([b, r, tp, m, x, on, th]) => [b, r || '–', tp ? n0(tp) : '–', m || 'n.d.', x || '–', on || '–', ...(o.noOurEps ? [] : [m === 'P/E' ? ourAt(x, on) : '–']), th || '–']),
      { hl: true, cells: ['**GAM Research**', `**${o.rating}**`, '**{{dcf.tp|num}}**', `**${P.name}**`, `**${P.mult != null ? P.mult + 'x' : '–'}**`, `**${P.year || '–'}**`, ...(o.noOurEps ? [] : ['**{{dcf.tp|num}}**']), o.ourThesis || ''] },
    ], source: o.streetSource || 'Broker notes as cited in GAM research files; n.d. = method not disclosed' } },
  ];
  if (o.derivation) blocks.push(
    { h: o.derivationTitle || `Our target multiple: ${P.mult}x, and why` },
    ...(o.derivationIntro ? [{ p: o.derivationIntro }] : []),
    { exhibit: { type: 'table', title: o.derivationTableTitle || 'Deriving the target multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: o.derivation, source: o.derivationSource || 'Screener.in, GAM Research' } });
  const pair = [];
  if (o.history) {
    const hs = forwardSeries(sym, M, o.history.field).filter(x => x[0] >= (o.history.from || '2016-04-01'));
    pair.push({ type: 'line', title: o.history.title, unit: o.history.field === 'eps' ? 'Price ÷ next full-year EPS (x)' : 'Price ÷ next year-end book value (x)', x: hs.map(x => x[0]), series: [{ name: 'Forward multiple', values: hs.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: o.history.yearStep || 2, min: o.history.min, lines: [...(Math.abs(o.history.median - (P.mult ?? -99)) >= 2 ? [{ v: o.history.median, text: o.history.label }] : []), ...(P.mult != null ? [{ v: P.mult, text: `Our target: ${P.mult}x`, color: '#cf8f1f' }] : [])], source: 'Screener.in prices; actual earnings, GAM estimates for forecast years' });
  }
  pair.push({ type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: [`${P.name} (target)`, ...others.map(m => m.name), 'Share price today'], series: [{ name: 'Value', values: [Math.round(P.value), ...others.map(m => Math.round(m.value)), price], fmt: 'inr' }], labels: 'all', highlight: `${P.name} (target)`, source: 'GAM Research' });
  blocks.push(pair.length === 2 ? { pair } : { exhibit: pair[0] });
  blocks.push({ exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
    [`**${P.name}**`, '**Target**', basisOf(P), multTxt(P), `**{{dcf.blend.methods.${idx(P)}.value|num}}**`, '–', `{{scen.bull.blend.methods.${idx(P)}.value|num}}`, `{{scen.bear.blend.methods.${idx(P)}.value|num}}`],
    ...others.map(m => [m.name, 'Cross-check', basisOf(m), multTxt(m), `{{dcf.blend.methods.${idx(m)}.value|num}}`, `${m.vsTarget >= 0 ? '+' : ''}${m.vsTarget.toFixed(0)}%`, `{{scen.bull.blend.methods.${idx(m)}.value|num}}`, `{{scen.bear.blend.methods.${idx(m)}.value|num}}`]),
    { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
  ], source: o.source || 'GAM Research' } });
  if (o.crossNote) blocks.push({ callout: o.crossNote });
  return blocks;
}

// House starting point for the target multiple: median one-year-forward P/E from Apr-2021 (or a
// later listing/demerger date) to the as-of date, leaving out "trough years": dates whose forward
// EPS was a loss or below half the highest EPS of the previous three years. In a trough the P/E
// balloons because earnings collapsed, not because the market paid more for normal earnings.
// Returns { median, medianAll, troughYears, series } (series = [date, pe] points kept).
function forwardMedian(sym, M, { from = '2021-04-01' } = {}) {
  const S = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', sym, 'screener.json'), 'utf8'));
  const by = {}; const pl = S.tables['profit-loss'];
  pl.periods.forEach((p, i) => { if (/Mar/.test(p)) by[+p.slice(-4)] = pl.rows['EPS in Rs'][i]; });
  M.forecast.F.years.forEach((y, i) => (by[2000 + +y.slice(2, 4)] = M.forecast.F.eps[i]));
  const fyOf = d => { const dt = new Date(d); return dt.getMonth() >= 3 ? dt.getFullYear() + 2 : dt.getFullYear() + 1; };
  const trough = fy => { const prev = [by[fy - 1], by[fy - 2], by[fy - 3]].filter(v => v != null); const pk = prev.length ? Math.max(...prev) : null; return !(by[fy] > 0) || (pk > 0 && by[fy] < 0.5 * pk); };
  const all = forwardSeries(sym, M, 'eps').filter(([d]) => d >= from);
  const kept = all.filter(([d]) => !trough(fyOf(d)));
  const med = a => { const s = a.map(x => x[1]).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
  return { median: med(kept), medianAll: med(all), troughYears: [...new Set(all.filter(([d]) => trough(fyOf(d))).map(([d]) => `FY${String(fyOf(d)).slice(2)}`))], series: kept };
}

// Lenders: median one-year-forward P/B (price ÷ next full fiscal year's book) from Apr-2021 (or `from`) to the as-of date.
// Book value does not collapse the way EPS does, so no trough years are left out.
function forwardMedianPb(sym, M, { from = '2021-04-01' } = {}) {
  const s = forwardSeries(sym, M, 'bvps').filter(([d]) => d >= from), v = s.map(x => x[1]).sort((x, y) => x - y);
  return { median: v.length ? v[Math.floor(v.length / 2)] : null, min: v[0] ?? null, max: v[v.length - 1] ?? null, series: s };
}

module.exports = { blendBlocks, streetBlocks, forwardSeries, forwardMedian, forwardMedianPb };
