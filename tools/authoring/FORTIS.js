// Authoring source for the Fortis Healthcare initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to owners,
// see FORTIS.patch.js). Part B (FORTIS.research.js + part2-6, shared FORTIS.ctx.js/ctx2.js) adds the research chapters.
// Usage: node tools/authoring/FORTIS.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'FORTIS', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated, post-Ind AS 116; profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'From crisis to 23% margins: revenue 2.3x since FY15, profit only since FY22',
  blocks: [
    { p: 'Fortis\'s revenue went from ₹3,966 cr in FY15 to ₹9,128 cr in FY26, but the first half of that decade was lost: under the former promoters the company paid rent on its own hospitals to RHT Health Trust, lent money to promoter entities and lost ₹934 cr in FY18. After IHH took control (Nov-2018) and the hospitals were bought back from RHT (2019), the EBITDA margin rose from 5% (FY19) to 13% (FY20); Covid then swung the numbers (FY21 revenue −13%, FY22 +42% with a testing boom at Agilus). Since FY23 the story has been clean: revenue +13% a year, operating EBITDA ₹1,101 cr → ₹2,085 cr (+24% a year) and margin 17.5% → 22.8%. Profit attributable to shareholders reached ₹1,042 cr in FY26.' },
    { pair: [
      { type: 'column', title: 'Revenue: flat for six years, then 13% a year since FY23', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Profit: losses until FY21, ₹1,042 cr in FY26', unit: 'Net profit attributable to shareholders (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 5% in FY19, 23% in FY26', unit: 'EBITDA margin, post-Ind AS (%)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.co },
      { type: 'hbar', title: 'Doctors\' fees and drugs take 44% of revenue', unit: 'FY26 costs and EBITDA, % of revenue', x: ['Medical consumables and drugs', 'Professional fees to doctors', 'Employees (nurses, staff)', 'Other expenses', 'Operating EBITDA'], series: [{ name: 'Share', values: [22.9, 21.4, 14.2, 18.6, 22.8], fmt: 'pct' }], labels: 'all', highlight: 'Operating EBITDA', source: 'AR FY26 consolidated notes 6(xxiv), 6(xxvii); Screener.in' },
    ] },
    { callout: '**Our view:** the turnaround under IHH is real and mostly done. The margin gain of FY23-26 came from fixing weak hospitals (facilities above 20% margin went from 10 to 13), pricing and case mix, and Agilus recovering from its post-Covid slump. From here growth has to come from new beds, and the margin is held back by a new ESOP charge, doctor costs in NCR and government drug-price caps.' },
  ],
};

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarterly pattern', title: 'A steady business: Q2 is the strongest quarter, Q1 the richest per bed',
  blocks: [
    { p: 'Fortis has little seasonality compared with a children\'s or infectious-disease hospital. The monsoon quarter (Q2, July-September) brings dengue and other medical cases: occupancy peaks (72% in Q2FY25, 71% in Q2FY26) but ARPOB dips because medical patients pay less per day than surgical ones. Q1 (April-June) is surgery-heavy with the highest ARPOB (₹2.71 cr in Q1FY27). Revenue has grown 17-18% year on year in each of the last five quarters, helped by the FY26 acquisitions (Jalandhar from Jul-2025, Greater Noida from Sep-2025, People Tree from Jan-2026).' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: up every year, Q2 a little higher', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Occupancy steady at 67-72% while beds grow', unit: 'Hospital occupancy (%), quarterly', x: 'R.segments.quarterly[].q', series: [{ name: 'Occupancy', ref: 'R.segments.quarterly[].occupancyPct', fmt: 'pct' }], labels: 'all', min: 60, max: 75, source: 'Company presentations (Q1FY25-Q1FY27)' },
    ] },
    { callout: '**Why it matters now:** Q1FY27 was in line but the margin slipped: 21.5% before ESOP (22.1% a year earlier) and 20.1% after it. Q2FY27 results (due by mid-November 2026) are the first full quarter of the ~₹40 cr quarterly ESOP charge and should show whether the FMRI tower opened.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Cash went into buying back minorities and hospitals; returns are only just above the cost of capital',
  blocks: [
    { p: 'Over FY25-26 Fortis generated ₹3,025 cr of operating cash. It spent ₹1,792 cr on capex, ₹1,778 cr buying 31% of Agilus from private-equity holders, ₹645 cr on acquisitions and other investments (deal values: Jalandhar ₹462 cr, People Tree ₹430 cr), ₹552 cr on interest and lease payments and ₹187 cr on dividends; the gap was borrowed (₹1,550 cr of NCDs in FY25; net debt excluding leases ₹1,694 cr at Mar-25 and ₹2,334 cr at Mar-26). Returns are improving but modest: ROCE (Screener) was 10% in FY22-24 and 13% in FY26, because ₹4,722 cr of goodwill from past deals sits in the capital base. Management now guides ~50% of EBITDA (~₹1,150-1,250 cr a year) for brownfield beds, robots and a ₹252 cr proton centre, plus acquisitions "in our clusters".' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 13% in FY26, barely above the cost of capital', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 20, source: 'Screener.in (capital includes goodwill and lease liabilities)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26', 'Two years'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '3,025'],
      ['Capex', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '1,792'],
      ['Agilus minority buyout (31.21%, financing cash flow)', '1,778', '0', '1,778'],
      ['Acquisitions and other investing (Screener)', '8', '637', '645'],
      ['Interest paid and lease principal', '190', '362', '552'],
      ['Dividends', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '187'],
      { hl: true, cells: ['**Left over (funded by debt)**', '**−1,508**', '**−421**', '**−1,929**'] },
      ['Memo: net debt excl. leases, year end (company)', '1,694', '2,334', ''],
    ], source: 'Screener.in cash flow and schedules; AR FY26 (deal values Jalandhar ₹462 cr, People Tree ₹430 cr; part of the purchase sits in capex as land and buildings); company presentations.' } },
    { callout: '**The capital question:** on our numbers free cash flow after capex is ~₹600-1,150 cr a year in FY27-29E, so Fortis can fund its brownfield plan and pay down most of its debt by FY29 without IHH\'s money. The risk is the opposite: a large acquisition, or a merger with IHH\'s Gleneagles hospitals on terms set by the parent.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & leases', kicker: 'Balance sheet', title: 'Net debt ₹2,334 cr plus ₹600 cr of leases: comfortable at ~1.1x EBITDA',
  blocks: [
    { p: 'Fortis owns most of its hospitals since the 2019 RHT buyback, so leases are small for an Indian hospital chain: ₹600 cr of lease liabilities at Mar-2026 (₹280 cr a year earlier; the Greater Noida hospital was taken on a 15-year lease in Sep-2025). Borrowings were ₹2,872 cr (incl. ₹1,550 cr of NCDs raised for the Agilus buyout) against ₹538 cr of cash: net debt ₹2,334 cr excluding leases (1.09x annualised EBITDA), ₹2,580 cr of debt and ₹2,233 cr of net debt at Jun-2026. Goodwill of ₹4,722 cr is 35% of capital employed. Minorities on the balance sheet are only ₹273 cr at book, but the 11.68% of Agilus they own is worth ~₹1,000 cr at our multiple.' },
    { pair: [
      { type: 'column', title: 'Borrowings jumped in FY25-26 to fund the Agilus buyout and acquisitions', unit: 'Borrowings incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in (borrowings include lease liabilities: ₹280 cr FY25, ₹600 cr FY26)' },
      { type: 'line', title: 'Suppliers and doctors fund the working capital', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. lease liabilities', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['  of which lease liabilities', '223', '297', '280', '600'],
      ['Cash (Screener)', '363', '598', '508', '544'],
      ['Investments (mostly associates at equity value)', '{{A.investments.8|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      { hl: true, cells: ['**Net debt excl. leases (company)**', '–', '–', '**1,694**', '**2,334**'] },
      ['Minorities at book', '858', '893', '253', '273'],
      ['Goodwill (company)', '–', '–', '4,194', '4,722'],
    ], source: 'Screener.in balance sheet and schedules; Q4FY26 presentation p.21 (net debt, goodwill; company cash ₹502 cr at Mar-25 and ₹538 cr at Mar-26).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: IHH at 31%, Indian funds now own more than foreign ones',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 29.8% to 32.2% in a year; FIIs down to 25.2%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'IHH unchanged at 31.17% since 2018', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 20, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

module.exports = { financials, seasons, capital, balance, ownershipBase, RD };
Object.assign(module.exports, require('./FORTIS.partA2'));

if (require.main === module) {
  const { statements, statementNotes } = module.exports;
  const B = fs.existsSync(path.join(__dirname, 'FORTIS.research.js')) ? require('./FORTIS.research') : null;
  const report = {
    symbol: 'FORTIS', listing: 'NSE: FORTIS · BSE: 532843', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, capital, balance, ownershipBase, statements }) : [financials, seasons, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
