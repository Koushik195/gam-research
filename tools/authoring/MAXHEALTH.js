// Authoring source for the Max Healthcare Institute initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, MHIL consolidated; Screener's FY26 profit ÷ EPS
// = 97.30 cr shares = the actual 97.33 cr; MAXHEALTH.patch.js only puts profit on the attributable basis, which
// changes FY19 and Q1FY27). Part B (MAXHEALTH.research.js + part2-6, shared
// MAXHEALTH.ctx.js / ctx2.js) adds the research chapters. Usage: node tools/authoring/MAXHEALTH.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'MAXHEALTH', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (MHIL consolidated, post-Ind AS 116), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 3.3x since FY21 and EBITDA 5.5x; but profit growth lagged as depreciation and interest caught up',
  blocks: [
    { p: 'MHIL\'s consolidated revenue rose from ₹2,508 cr in FY21 (the first year after the Radiant merger, hit by Covid) to ₹8,373 cr in FY26, 27% a year. About a third of the FY23-26 growth was bought: the Lucknow, Nagpur and Noida hospitals (~1,300 beds) were acquired in FY25, when revenue jumped 30%. EBITDA grew faster (₹407 cr to ₹2,243 cr) as margins went from 16% to 27%. Profit is noisier: FY23 included a ₹244 cr deferred-tax gain and FY26 a ₹142 cr one-time tax gain on a subsidiary merger, so the clean trend is ₹860 cr (FY23) → ₹1,058 cr → ₹1,114 cr → ₹1,341 cr (FY26): ~16% a year, slower than EBITDA because depreciation and interest doubled after the acquisitions and new towers.' },
    { pair: [
      { type: 'column', title: 'Revenue: 27% a year since FY21, with a 30% acquisition year', unit: 'Revenue, MHIL consolidated (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: reported numbers carry tax one-offs in FY23 and FY26', unit: 'Net profit, reported (₹ crore)', x: 'fin.labels', from: 'FY21', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: ~27% since FY23, a step up from the merger years', unit: 'EBITDA margin, consolidated, post-Ind AS 116 (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: SRC.co },
      { type: 'hbar', title: 'Doctors and drugs each take about a fifth of revenue', unit: 'FY26 costs and EBITDA, % of consolidated revenue (₹8,373 cr)', x: ['Drugs and consumables', 'Professional fees to doctors', 'Employees (nurses, staff)', 'Other expenses', 'EBITDA'], series: [{ name: 'Share', values: [21.4, 21.4, 16.2, 14.2, 26.8], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'AR FY26 consolidated statement of profit and loss' },
    ] },
    { callout: '**Our view:** Max runs the most profitable large hospital network in India per bed (Network EBITDA of ₹72 lakh per bed in FY26), and margins have held at 26-28% through two waves of acquisitions. The weakness is below EBITDA: each wave of capacity adds depreciation and interest years before the beds are full, so EPS has grown about half as fast as EBITDA since FY23. The next wave (~4,000 beds by FY30) is the largest yet.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Cash generation is strong, but capex now exceeds it and returns are falling',
  blocks: [
    { p: 'Max turns ~75% of EBITDA into operating cash (FY26: ₹1,633 cr). Until FY24 that easily covered capex. Since then the company has spent on acquisitions (~1,300 beds in FY25), brownfield towers and loans to the Max Smart society, and borrowed to do it: net debt including leases went from net cash of ₹780 cr (Mar-23) to ₹2,772 cr (Mar-26). Returns are falling as a result: the company\'s own pre-tax ROCE was 33% in FY23 and 21.8% in FY26 (about 31% for hospitals more than four years old), and Screener\'s ROCE, which counts the 2020 merger goodwill, is ~15%. The next phase is bigger: ₹6,961 cr of project outflow over FY27-30 on the company\'s own estimate, before land, routine capex and any acquisitions.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex: capex overtook cash in FY26', unit: '₹ crore', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'Company pre-tax ROCE: 33% (FY23) to 22% (FY26)', unit: 'Pre-tax ROCE, company definition (%)', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Company ROCE', values: [33, 32, 25.9, 21.8], fmt: 'pct' }, { name: 'Screener ROCE (incl. goodwill)', values: SCR.rows['ROCE %'].slice(-4), fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Company decks (May-2025, May-2026; excludes merger fair-value uplift); Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26', 'Two years'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '3,071'],
      ['Capex (fixed assets)', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '2,429'],
      ['Loans to Partner Healthcare Facilities (net increase, AR note 13)', '–', '363', '363'],
      ['Interest paid', '140', '227', '367'],
      ['Dividends', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '292'],
      { hl: true, cells: ['**Left over before acquisitions and borrowing**', '**208**', '**−588**', '**−380**'] },
      ['Memo: net debt incl. leases, year end (Screener)', '2,325', '2,772', ''],
    ], source: 'Screener.in cash flow; AR FY26 notes 13 and cash-flow statement. FY25 acquisitions (Lucknow, Nagpur, Noida) were paid partly in FY24-25 and partly through assumed debt; they sit in other investing items.' } },
    { callout: '**The capital question:** management says capex will be funded from cash flow plus some project debt, and is "happy to go to 2.5x" net debt/EBITDA for acquisitions. On our numbers capex plus new leases (₹{{F.capex.0|num}} / {{F.capex.1|num}} / {{F.capex.2|num}} cr in FY27-29E) exceeds operating cash (₹{{F.cfo.0|num}} / {{F.cfo.1|num}} / {{F.cfo.2|num}} cr) in FY27-28, so net debt including leases rises to ~₹4,100 cr (~1.1x EBITDA) by FY29E: comfortable, but returns on the new beds decide whether this cycle creates value.' },
  ],
};

module.exports = { financials, capital, RD, SRC, SCR, RL };
Object.assign(module.exports, require('./MAXHEALTH.partA2'));

if (require.main === module) {
  const P = module.exports;
  const B = fs.existsSync(path.join(__dirname, 'MAXHEALTH.research.js')) ? require('./MAXHEALTH.research') : null;
  const parts = { financials: P.financials, capital: P.capital, balance: P.balance, ownershipBase: P.ownershipBase, statements: P.statements };
  const report = {
    symbol: 'MAXHEALTH', listing: 'NSE: MAXHEALTH · BSE: 543220', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections(parts) : Object.values(parts),
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
