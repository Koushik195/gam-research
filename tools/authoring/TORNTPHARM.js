// Authoring source for the Torrent Pharmaceuticals initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; FY26 put on a pro forma basis with
// 100% of JB merged in and 38.04 cr shares, see TORNTPHARM.patch.js). Part B (TORNTPHARM.research.js + part2-6, shared
// TORNTPHARM.ctx.js) adds the research chapters. Usage: node tools/authoring/TORNTPHARM.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'TORNTPHARM', 'research');
const RAWS = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const SCR = RAWS.tables.ratios, RPL = RAWS.tables['profit-loss'];
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated); FY26 pro forma per GAM (TORNTPHARM.patch.js)' };
const rawRow = (k, from) => { const i0 = RPL.periods.indexOf(`Mar 20${from}`); return RPL.rows[k].slice(i0, RPL.periods.indexOf('Mar 2026') + 1); };
const X = fs.existsSync(path.join(__dirname, 'TORNTPHARM.ctx.js')) ? require('./TORNTPHARM.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');

const FYS = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const revRep = rawRow('Sales', 19), ebRep = rawRow('Operating Profit', 19);
const financials = X && {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue +64% and margins +4pp since FY22; the JB deal lifts revenue by a third but halves EPS for now',
  blocks: [
    { p: `Torrent's revenue grew from ₹8,508 cr in FY22 to ₹13,980 cr in FY26 (13% a year), led by India (₹4,286 cr → ₹7,645 cr) and Brazil, while the US and Germany barely grew. FY26 was +21%, of which the base business +15% and JB (consolidated for 70 days from 21-Jan-2026) the rest. EBITDA margin rose every year, from 28.6% to 32.6%, as India's branded, chronic-heavy mix grew and generics shrank in the mix. Reported profit to shareholders rose from ₹777 cr (FY22, after a ₹299 cr impairment) to ₹2,163 cr (FY26), EPS ₹22.97 → ₹63.92. **The deal changes the base:** with JB for a full year, its brand amortisation (₹1,340 cr a year) and interest on ₹12,500 cr of acquisition debt, pro forma FY26 profit is only ₹${n0(X.PATCH.B.pat)} cr, or ₹${X.n1(X.PATCH.B.eps)} a share on the 38.04 cr shares that trade today. That is the base our forecasts grow from.` },
    { pair: [
      { type: 'column', title: 'Revenue: 13% a year FY22-26; ₹17,352 cr with JB for a full year', unit: 'Revenue (₹ crore); FY26 PF = pro forma with JB from 1-Apr-2025', x: [...FYS, 'FY26 PF'], series: [{ name: 'Revenue', values: [...revRep, X.PATCH.B.sales], fmt: 'num' }], labels: 'all', highlight: 'FY26 PF', source: 'Screener.in; AR FY26 note 42 (pro forma)' },
      { type: 'line', title: 'EBITDA margin: up every year since FY22', unit: 'EBITDA margin (%), reported', x: FYS, series: [{ name: 'EBITDA margin', values: FYS.map((_, i) => Math.round(ebRep[i] / revRep[i] * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 20, max: 36, source: 'Screener.in' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26 reported, % of revenue', x: ['Materials and purchases', 'Employees', 'Selling, promotion, literature', 'Other expenses', 'EBITDA'], series: [{ name: 'Share', values: [24.2, 19.1, 10.7, 13.4, 32.6], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'AR FY26 consolidated P&L and note 35' },
      { type: 'column', title: 'EPS: ₹63.9 reported, ₹35.0 on the merged basis', unit: 'EPS (₹); FY26 PF = pro forma on 38.04 cr shares', x: [...FYS, 'FY26 PF'], series: [{ name: 'EPS', values: [...rawRow('EPS in Rs', 19), Math.round(X.PATCH.B.eps * 10) / 10], fmt: 'n1' }], labels: 'all', highlight: 'FY26 PF', source: 'Screener.in (bonus-adjusted); GAM pro forma' },
    ] },
    { exhibit: { type: 'table', title: 'From reported FY26 to the pro forma base year (₹ crore)', head: ['', 'Reported FY26', 'Add: JB before 21-Jan-2026', 'Deal adjustments', 'Pro forma FY26'], rows: [
      ['Revenue', '13,980', n0(X.PATCH.B.sales - 13980), '–', n0(X.PATCH.B.sales)],
      ['EBITDA', '4,558', n0(X.PATCH.B.ebitda - 4558), '–', n0(X.PATCH.B.ebitda)],
      ['Depreciation and amortisation', '1,119', n0(X.PATCH.B.jb.dep), `${n0(X.PATCH.B.ppaPre)} (brand amortisation, 295 days)`, n0(X.PATCH.B.dep)],
      ['Interest', '385', n0(X.PATCH.B.jb.interest), `${n0(X.PATCH.B.acqInt)} (₹12,500 cr at 7.66%, 295 days)`, n0(X.PATCH.B.interest)],
      ['Other income incl. exceptional items', '−182', n0(X.PATCH.B.jb.oi), '–', n0(X.PATCH.B.oi)],
      ['Profit before tax', '2,872', '', '', n0(X.PATCH.B.pbt)],
      { hl: true, cells: ['**Profit to shareholders**', '**2,163**', '', '', `**${n0(X.PATCH.B.pat)}**`] },
      ['Shares (crore) / EPS (₹)', '33.84 / 63.92', '', '+4.19 cr merger shares', `38.04 / ${X.n1(X.PATCH.B.eps)}`],
    ], source: 'AR FY26 (P&L, note 42: pro forma revenue ₹17,352 cr, PBT ₹2,570 cr before deal interest); JB results (Screener); NCD coupons (Jan-2026); GAM. JB EBITDA before completion is the figure that reproduces the AR\'s pro forma PBT.' } },
    { callout: `**Our view:** the operating record is excellent (India compounding at ~15%, margins up 4pp in four years), but the per-share numbers have been reset by the deal. Reported EPS falls from ₹63.9 (FY26) to ₹{{F.eps.0|n1}} in FY27E before recovering to ₹{{F.eps.2|n1}} in FY29E; before the JB brand amortisation it is ₹${X.n1(X.adjEps[0])} → ₹${X.n1(X.adjEps[2])}. Investors should judge the deal on cash earnings and on how fast JB's margin and Torrent's debt move.` },
  ],
};

const capital = X && {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Four debt-funded brand acquisitions; the first three paid off, JB is the largest by far',
  blocks: [
    { p: 'Torrent grows in India by buying brands and pushing them through a bigger, better-paid field force: Elder\'s India business (FY15, ₹1,960 cr outflow), Unichem\'s India business (FY18, ~₹3,940 cr), Curatio (Oct-2022, ₹2,000 cr) and now JB (₹12,537 cr in cash for 48.8% plus 4.19 cr new shares, ~₹20,100 cr at ₹4,800, for the rest). Each deal was debt-funded and each cut returns before lifting them: ROCE fell from 48% (FY16) to 13% (FY18-19) after Unichem and recovered to 27% by FY25; it fell to 15% in FY26 with JB. Capex is modest (₹430-680 cr a year, 4-5% of revenue) and the company pays out 55-60% of profit as dividends.' },
    { pair: [
      { type: 'column', title: 'Cash from operations covers capex several times over', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow (FY26 includes JB from 21-Jan)' },
      { type: 'line', title: 'ROCE: dips after every deal, then recovers', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in (FY26 on the reported balance sheet incl. JB)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26'], rows: [
      ['Cash from operations', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}'],
      ['Capex', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}'],
      ['Acquisitions (JB, net of cash acquired)', '0', '0', '12,315'],
      ['Dividends', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}'],
      ['Interest paid', '371', '262', '427'],
      { hl: true, cells: ['**Net borrowing (repaid) / raised**', '**−1,369**', '**−926**', '**+11,922**'] },
    ], source: 'Screener.in cash-flow schedules; AR FY26 note 42' } },
    { callout: `**The JB price:** ₹1,600 a share for KKR's 46.39% and the employees' 2.41%, and 51 Torrent shares per 100 JB shares for the rest (worth ~₹2,450 a JB share at ₹4,800). At ₹1,600 JB's equity was worth ~₹25,700 cr, ~23x its FY26 EBITDA of ₹1,107 cr and ~36x its profit (Torrent itself traded at ~27x FY26E EBITDA then; PL, 1-Jul-2025). The deal adds ~₹4,150 cr of revenue at a 27% margin before synergies; with ₹400-450 cr of cost synergies JB's EBITDA would be ~₹1,560 cr on FY26 revenue, ~16x the price. It creates value only if synergies arrive and the brands keep growing double-digit under Torrent.` },
  ],
};

const balance = X && {
  id: 'balance', nav: 'Debt & deleveraging', kicker: 'Balance sheet', title: `Net debt from ₹2,500 cr to ₹12,900 cr; on our numbers it falls below 1x EBITDA by FY29`,
  blocks: [
    { p: `Torrent funded JB with debt: borrowings rose from ₹3,026 cr (Mar-25) to ₹14,798 cr (Mar-26): ₹11,161 cr of NCDs (₹10,990 cr raised in Jan-2026 at 7.45-7.80% plus ₹400 cr of older bonds), ₹1,420 cr of commercial paper, ₹1,495 cr of working-capital loans and ₹723 cr of term loans, plus ₹227 cr of leases. Against this it holds ₹2,031 cr of cash, deposits and liquid funds (₹1,155 cr came with JB). Net debt was ₹12,684 cr excluding leases, 2.3x combined EBITDA (company); 2.07x in Q1FY27. Management's target at the deal was below 0.5x within 2-3 years. Our own net-debt path, which adds back the ~₹${n0(X.DTL_UNWIND)} cr a year of tax the engine does not see (JB's brand amortisation is not tax-deductible), gives ${X.lev.slice(1).map(v => v.toFixed(1) + 'x').join(', ')} at Mar-27/28/29: slower than the target because we assume dividends continue at half of profit.` },
    { pair: [
      { type: 'column', title: 'Net debt: the deal year and our path down', unit: 'Net debt incl. leases (₹ crore); FY27-29E = GAM path', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...X.YRS], series: [{ name: 'Net debt', values: [...[7, 8, 9, 10].map(i => Math.round(X.A.netDebt[i])), Math.round(X.nd0), ...X.ndOwn.map(v => Math.round(v))], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in; GAM (engine net cash plus the non-deductible-amortisation tax)' },
      { type: 'line', title: 'Net debt / EBITDA: 2.4x pro forma, ~0.6x by FY29E', unit: 'Net debt ÷ EBITDA (x); FY26 on pro forma EBITDA', x: ['FY26', ...X.YRS], series: [{ name: 'Net debt / EBITDA', values: X.lev.map(v => Math.round(v * 100) / 100), fmt: 'x' }], labels: 'all', min: 0, max: 3, source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Debt maturities at Mar-2026 (₹ crore)', head: ['', 'FY27', 'FY28', 'FY29', 'FY30', 'FY31'], rows: [
      ['NCDs (face value)', '100', '2,100', '2,590', '3,100', '3,500'],
      ['Term loans', '133', '324', '138', '100', '30'],
      ['Commercial paper and working-capital loans (current)', '2,915', '', '', '', ''],
      ['Acquisition NCD coupons', '', '7.45%', '7.60%', '7.70%', '7.80%'],
    ], source: 'AR FY26 note 21; Venture Intelligence (19-Jan-2026: CP ₹1,500 cr for 1 year; NCDs ₹2,000/2,500/3,000/3,500 cr for 2-5 years)' } },
    { exhibit: { type: 'table', title: 'Our deleveraging path (₹ crore)', head: ['', 'Mar-26', 'Mar-27E', 'Mar-28E', 'Mar-29E'], rows: [
      ['EBITDA (year to)', `${n0(X.ebitdaPF26)} PF`, '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['Net debt incl. leases (GAM)', n0(X.nd0), ...X.ndOwn.map(n0)],
      ['Net debt / EBITDA', ...X.lev.map(v => v.toFixed(2) + 'x')],
      ['Gross borrowings (cash kept at ₹1,500-2,031 cr)', ...X.grossDebt.map(n0)],
      ['Interest (year to; model)', '1,163 PF', ...X.AS.interest.map(n0)],
    ], source: 'GAM Research. Interest = 7.7% of average gross borrowings + ~₹55 cr of lease and other finance costs (checked against the model in TORNTPHARM.ctx.js).' } },
    { callout: '**Two things to watch.** (1) The AGM of 23-Jun-2026 passed an enabling resolution to raise up to ₹5,000 cr of equity (QIP) in FY27: nothing was raised by 30-Sep-2026, but a raise of that size would equal ~45% of our Mar-27E net debt and dilute holders by ~3% at ₹4,800. (2) Management says it will not exceed 3-3.5x net debt/EBITDA for any future deal and will wait 12-18 months before the next one.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Mehta family\'s holding company owns 60.8% after the merger',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs and DIIs have been adding', unit: '% of shares (to Jun-2026, before the merger shares)', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 71.25% → 68.31% (Dec-2024), 60.8% after the merger', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 75, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'FY26 in these tables is the pro forma combined year (JB owned 100% from 1-Apr-2025, full-year brand amortisation and acquisition interest, 38.04 cr shares). Reported FY26: revenue ₹13,980 cr, EBITDA ₹4,559 cr, profit to owners ₹2,163 cr, EPS ₹63.92.' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation (incl. JB brands)' },
      { key: 'otherIncome', name: 'Other income (history incl. exceptional items)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income incl. exceptional' },
      { key: 'dep', name: 'Depreciation & amortisation' }, { key: 'interest', name: 'Interest' }, { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'TORNTPHARM.research.js')) ? require('./TORNTPHARM.research') : null;
  const report = {
    symbol: 'TORNTPHARM', listing: 'NSE: TORNTPHARM · BSE: 500420', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
