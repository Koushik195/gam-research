// Authoring source for the PCBL Chemical initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated).
// Part B (PCBL.research.js, merging PCBL.part2-4.js with shared context in PCBL.ctx.js) adds the
// story, business, industry, segment chapters, moat, quality, ownership, governance, forecasts,
// street, valuation and verdict.
// Usage: node tools/authoring/PCBL.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'PCBL', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const MP = path.join(__dirname, '..', '..', 'data', 'models', 'PCBL.json');
const M = fs.existsSync(MP) ? JSON.parse(fs.readFileSync(MP, 'utf8')) : null;
const A = M?.annual, ai = l => A.labels.indexOf(l);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumL = (k, ls) => ls.reduce((s, l) => s + (A[k][ai(l)] || 0), 0);
const L21_26 = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const cfo21 = A ? sumL('cfo', L21_26) : 0, capex21 = A ? sumL('capex', L21_26) : 0, acq = A ? sumL('acquisitions', L21_26) : 0;
const burden26 = A ? Math.round((A.interest[ai('FY26')] + A.dep[ai('FY26')]) / A.ebitda[ai('FY26')] * 100) : 0;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue tripled since FY21 but profit is lower: an acquisition bought sales, not earnings',
  blocks: [
    { p: `PCBL's revenue rose from ₹2,660 cr in FY21 to ₹8,404 cr in FY25: carbon black prices followed crude up in FY22-23, volumes grew from 389 kt to 596 kt, and Aquapharm (acquired in Jan-2024) added ~₹1,400 cr a year. EBITDA rose from ₹517 cr to ₹1,337 cr. Then FY26 went wrong: carbon black realisations fell (Russian imports, Indian overcapacity, US tariffs), EBITDA dropped 22% to ₹1,043 cr and net profit more than halved to ₹198 cr (EPS ₹5.0, from ₹13.0 in FY24). Below EBITDA, the acquisition changed the cost structure: interest went from ₹34 cr (FY21) to ₹423 cr and depreciation from ₹110 cr to ₹373 cr, together ${burden26}% of FY26 EBITDA.` },
    { pair: [
      { type: 'column', title: 'Revenue: ₹8,189 cr in FY26, three times FY21', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'EBITDA: ₹1,337 cr peak (FY25), back to ₹1,043 cr', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Interest and depreciation now absorb three-quarters of EBITDA', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Depreciation', ref: 'A.dep', fmt: 'num' }, { name: 'Interest', ref: 'A.interest', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'column', title: 'Net profit: ₹198 cr in FY26, below FY19', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 12-19%, it moves with crude', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 22, source: SRC.co },
      { type: 'line', title: 'ROCE: 25% (FY19) → 8% (FY26)', unit: 'ROCE (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, source: 'Screener.in' },
    ] },
    { callout: `**Our view:** PCBL used to be a high-return commodity business: ROCE of 16-25% in FY19-FY23 with little debt. Over FY21-26 it generated ₹${n0(cfo21)} cr of operating cash, spent ₹${n0(capex21)} cr on plants and ₹${n0(acq)} cr on Aquapharm, and borrowed the difference. ROCE is now ~8%, below the ~11% cost of capital. A margin percentage tells you little here (revenue swings with crude); the numbers that matter are carbon black EBITDA per tonne and Aquapharm's EBITDA, covered in their own chapters.` },
  ],
};

const seasons = {
  id: 'quarters', nav: 'Quarterly run-rate', kicker: 'Quarters', title: 'Quarters: a record Q1FY27, but about ₹70 cr of it came from cheap inventory',
  blocks: [
    { p: 'Quarterly EBITDA slid from ₹358-364 cr in H1FY25 to a low of ₹215 cr in Q3FY26 as carbon black spreads fell and Aquapharm weakened. Q1FY27 jumped to ₹396 cr (16% margin): crude rose from $78 to $97 a barrel, PCBL sold its low-cost inventory at new, higher prices (~₹70 cr of gains, says the CFO), took spot-price premiums on about a third of its volume and got ₹5.39 per unit for surplus power (₹3.66 in Q4FY26). Management itself warned that ₹40-50 cr of the inventory benefit reverses in Q2FY27 and that customers were buying cautiously. Underlying Q1 EBITDA was closer to ₹326-340 cr (ICICI Securities, Nuvama), still the best quarter in a year.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: up 17% YoY in Q1FY27 on prices, not volume', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Quarterly EBITDA: ₹396 cr in Q1FY27, incl. ~₹70 cr inventory gain', unit: 'EBITDA (₹ crore)', x: 'Q.labels', series: [{ name: 'EBITDA', ref: 'Q.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 12% for three quarters, then 16%', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 20, source: SRC.co },
      { type: 'column', title: 'Quarterly net profit: from ₹2 cr (Q3FY26) to ₹155 cr', unit: 'Net profit (₹ crore)', x: 'Q.labels', series: [{ name: 'Net profit', ref: 'Q.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**So what:** do not annualise Q1FY27. Strip out the inventory gain and the run-rate is ~₹1,300-1,350 cr of EBITDA a year, and Q2FY27 (results due by mid-November 2026) carries the reversal plus softer volumes. Our FY27E EBITDA of {{F.ebitda.0|num}} cr assumes ~₹280 cr a quarter for Q2-Q4.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net debt: ~₹4,500 cr, five times EBITDA, and it stopped falling once capex resumes',
  blocks: [
    { p: 'Before Aquapharm, PCBL had almost no net debt (₹39 cr at Mar-22). Borrowings jumped from ₹1,029 cr (Mar-23) to ₹4,983 cr (Mar-24) to fund the ₹3,800 cr purchase, and have stayed there: ₹5,571 cr at Mar-25 and ₹4,989 cr at Mar-26 including leases. FY26 was a good cash year (operating cash ₹1,576 cr, helped by ₹529 cr of working-capital release as crude fell), the promoters paid ₹336 cr for their warrants, and the company cut net borrowings by ₹454 cr to ₹4,536 cr. Even so, debt was 5.0x EBITDA (CARE), above every agency\'s comfort level. Note that Screener\'s "investments" (₹464 cr) are shares of RPSG group companies (CESC ₹253 cr and unquoted group entities), not cash.' },
    { pair: [
      { type: 'column', title: 'Net debt: from almost nil to ~₹4,200-4,700 cr in one deal', unit: 'Borrowings incl. leases less cash and investments (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Operating cash vs capex: FY24 also paid for Aquapharm', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }, { name: 'Acquisitions', ref: 'A.acquisitions', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Working-capital days: tighter in FY26 as crude fell', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Capital work in progress: ₹583 cr at Mar-26', unit: 'CWIP (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'CWIP', ref: 'A.cwip', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash', '{{A.cash.7|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Investments (mostly RPSG group shares)', '{{A.investments.7|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Net fixed assets (incl. goodwill and acquired intangibles)', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
    ], source: SRC.co } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Goenka group holds 53%, Indian institutions are buying, foreign funds are not',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 6% to 11%; FIIs ~6%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 51.4% → 53.4% after the ₹280 warrants', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 45, max: 56, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY18–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'interest', name: 'Interest' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, seasons, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'PCBL.research.js')) ? require('./PCBL.research') : null;
  const report = {
    symbol: 'PCBL', listing: 'NSE: PCBL · BSE: 506590', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Chemicals',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, balance, ownershipBase, statements }) : [financials, seasons, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
