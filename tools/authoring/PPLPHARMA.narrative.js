// Piramal Pharma report: the story in eight exhibits. Shared inputs in PPLPHARMA.ctx.js.
const X = require('./PPLPHARMA.ctx');
const { F, V, A, AS, n0, n1, r1, price, b, LINES, SA, SQ, EVS, EVH_BASE, MULT, K, SET, FW, shortName, postQ1, shortDate, ndBy, YRS, SECTOR_EV } = X;

const FYH = SA.map(a => a.fy), XH = [...FYH, ...YRS];
const tpRows = postQ1.slice().sort((a, c) => c.tp - a.tp);
const fwd = EVS.filter((_, i) => i % 2 === 0 || i === EVS.length - 1);
const ndHist = ['FY23', 'FY24', 'FY25', 'FY26'].map(l => ndBy[2000 + +l.slice(2)]);
const ndFc = F.treasury.map(t => -t);
const lev = [...['FY23', 'FY24', 'FY25', 'FY26'].map((l, i) => ndHist[i] / A.ebitda[A.labels.indexOf(l)]), ...ndFc.map((n, i) => n / F.ebitda[i])];
const ebSep = X.ebitdaSep28, depSep = X.sep(F.dep), intSep = X.sep(F.interest), oiSep = X.sep(F.otherIncome), taxSep = X.sep(F.tax), patSep = X.sep(F.pat);

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Revenue: CDMO fell in FY26 and is growing again; consumer keeps compounding', unit: 'Revenue by business (₹ crore)', x: XH, series: [{ name: 'CDMO', values: [...SA.map(a => a.cdmo), ...LINES.cdmo.map(Math.round)], fmt: 'num' }, { name: 'Hospital generics (CHG)', values: [...SA.map(a => a.chg), ...LINES.chg.map(Math.round)], fmt: 'num' }, { name: 'Consumer (PCH)', values: [...SA.map(a => a.pch), ...LINES.pch.map(Math.round)], fmt: 'num' }], minLabel: 900, source: 'Q4FY26 presentation (FY23-26); GAM estimates FY27-29E' },
      { type: 'column', title: 'CDMO by quarter: the destocking hole of FY26 and the Q1FY27 rebound', unit: 'CDMO revenue (₹ crore)', x: SQ.map(s => s.q), series: [{ name: 'CDMO', values: SQ.map(s => s.cdmo), fmt: 'num' }], labels: 'all', source: 'Quarterly investor presentations' },
    ] },
    { pair: [
      { type: 'column', title: 'From EBITDA to profit: little is left after depreciation, interest and tax', unit: '₹ crore, Sep-28E (½ FY28E + ½ FY29E)', x: ['EBITDA', 'Depreciation', 'Interest', 'Other income incl. JV', 'Tax', 'Net profit'], series: [{ name: 'Sep-28E', values: [ebSep, -depSep, -intSep, oiSep, -taxSep, patSep].map(Math.round), fmt: 'num' }], labels: 'all', source: 'GAM estimates' },
      { type: 'line', title: 'Leverage: net debt/EBITDA 4.4x in FY26, falling only slowly', unit: 'Net debt ÷ EBITDA before other income (x), Screener basis incl. leases', x: ['FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Net debt / EBITDA', values: lev.map(v => r1(v)), fmt: 'x' }], labels: 'all', min: 0, max: 8, source: 'Screener.in; GAM estimates (forecast net debt excludes the Kenalog contingent payment)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: ${n1(EVH_BASE.med)}x median since May-2023, incl. ~33x when FY26 EBITDA collapsed`, unit: 'EV ÷ next full-year EBITDA (x), JV looked through', x: fwd.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwd.map(x => r1(x[1])), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Target: ${MULT.base}x (median ${n1(EVH_BASE.med)}x × ${K.toFixed(3)})`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; actual EBITDA, GAM estimates for FY27-28E' },
      { type: 'hbar', title: `Pharma trades above its post-May-2023 EV/EBITDA: median +${SECTOR_EV}%`, unit: 'Trailing EV/EBITDA at 30-Sep-2026 vs median since 1-May-2023 (%)', x: [...SET.map(shortName), 'Piramal Pharma'], series: [{ name: 'vs median', values: [...SET.map(s => FW.drEv[s]), FW.drEv.PPLPHARMA], fmt: 'pct' }], labels: 'all', highlight: 'Piramal Pharma', source: 'Screener.in EV/EBITDA history; NSE closes on 30-Sep-2026; PLAYBOOK §7c peer set' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Our target is above every broker: a higher multiple, not higher estimates', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpRows.map(s => `${s.broker} (${s.rating})`), 'GAM (base)'], series: [{ name: 'Target', values: [...tpRows.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes of 30-31 Jul 2026 as cited in deep.json; GAM Research' },
      { type: 'hbar', title: 'Valuation methods disagree: EV/EBITDA vs earnings and cash flow', unit: '₹ per share', x: ['SOTP (target)', 'SOTP, EPS trough reading', 'P/E at peers\' 34.5x', 'DCF (25% tax, 25% margin)', 'DCF (base)'], series: [{ name: 'Value', values: [V.tp, X.SENS[1].tp, Math.round(mv('pe').value), Math.round(X.DCFV.both), Math.round(mv('dcf').value)], fmt: 'inr' }], labels: 'all', highlight: 'SOTP (target)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'GAM Research' },
    ] },
  ],
};
function mv(k) { return X.mv(k); }

module.exports = { narrative };
