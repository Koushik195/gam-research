// Authoring source for the ITC Hotels initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file + ITCHOTELS.partA2.js): chapters built on reported financials (Screener, consolidated; ITCHOTELS.patch.js restores
// the audited split of operating costs, other income and finance costs for FY25-26 and puts Net Profit on the attributable basis).
// Part B (ITCHOTELS.research.js + part2-6, shared ITCHOTELS.ctx.js / ctx2.js) adds the research chapters.
// Usage: node tools/authoring/ITCHOTELS.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ITCHOTELS', 'research');
const SRC = { co: 'Company filings (AR FY26, quarterly decks), Screener.in (consolidated; FY25-26 on the audited split), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Two full years as a listed company: revenue +16%, EBITDA +18% in FY26, helped by Colombo apartment sales; margins steady at ~34-35%',
  blocks: [
    { p: 'ITC Hotels has only two full years of its own accounts. FY25 revenue was ₹3,560 cr and EBITDA (operating profit before other income) ₹1,211 cr; FY26 revenue rose 16% to ₹4,139 cr and EBITDA 18% to ₹1,424 cr. About a third of that growth came from a new and lumpy source: ₹211 cr of revenue and ₹64 cr of EBITDA from handing over apartments at Sapphire Residences in Colombo (the "real estate" segment). The hotels alone grew 10% (₹3,928 cr) and their margin rose ~0.5 point to 34.6%. Reported profit was ₹817 cr after an ₹80 cr exceptional charge (new labour codes ₹54 cr; cyclone Ditwah damage in Sri Lanka ₹26 cr); before it, profit rose ~39%, also helped by ~₹125 cr more treasury income on the cash ITC handed over. Screener\'s FY24 column covers only ~8 months (from the company\'s incorporation on 28-Jul-2023), so the 60% "growth" in FY25 is an accounting artefact, not growth.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹3,560 cr (FY25) to ₹4,139 cr (FY26)', unit: 'Revenue from operations, consolidated (₹ crore); FY24 = ~8 months', x: 'fin.labels', from: 'FY24', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Profit: ₹635 cr to ₹817 cr (after an ₹80 cr one-off)', unit: 'Net profit attributable to owners, reported (₹ crore); FY24 = ~8 months', x: 'fin.labels', from: 'FY24', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin has held at 34-35%', unit: 'EBITDA margin, consolidated (%)', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Consolidated', values: [34.0, 34.4, 30.0, 31.2], fmt: 'pct' }, { name: 'Hotels ex-real estate', values: [34.0, 34.6, 30.0, 31.3], fmt: 'pct' }], labels: 'all', min: 20, max: 40, source: 'Company decks; AR FY26' },
      { type: 'hbar', title: 'Staff and "other" costs take over half of revenue', unit: 'FY26 costs and EBITDA, % of consolidated revenue (₹4,139 cr)', x: ['Food and beverages consumed', 'Apartment cost of sales (Sapphire)', 'Employees', 'Other expenses (power, repairs, marketing, fees)', 'EBITDA'], series: [{ name: 'Share', values: [9.0, 3.3, 18.9, 34.3, 34.4], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA', source: 'AR FY26 consolidated statement of profit and loss' },
    ] },
    { callout: '**Our view:** the hotel business is solid but not fast-growing: ~10% revenue growth with ~34-35% margins. The profit line was flattered in FY26 by two things that will not repeat at the same pace: apartment handovers in Colombo and a jump in interest income on the cash ITC handed over. The honest yardstick is return on capital: on Screener\'s numbers ITC Hotels earns a pre-tax ROCE of ~11% and an ROE of ~7% on ₹11,658 cr of equity, because the owned luxury hotels carry a very large asset base.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Cash-rich and lightly invested so far; capex is now rising (acquisitions, Delhi and Vizag) and returns stay low',
  blocks: [
    { p: 'ITC Hotels turned 78% of FY26 EBITDA into operating cash (₹1,110 cr of ₹1,424 cr) and spent only ₹410 cr on fixed assets (₹386 cr in FY25), so cash and investments grew. It paid its first dividend (₹1 a share, ₹208 cr) for FY26. Spending is now stepping up: a luxury resort at Kumarakom (Kerala; ₹205 cr enterprise value) bought in May-2026, Welcomhotel Ahmedabad (GHK, enterprise value ₹155 cr) agreed in Jul-2026, a ₹326.5 cr land premium for a hotel at Yashobhoomi in New Delhi, a ₹328 cr hotel at Visakhapatnam, and projects at Puri and Bhubaneswar. Management\'s yardstick is 10-12% of cumulative revenue for operating capex, renovations and new builds (8-10% in the May-2026 deck). The managed (fee) side needs almost no capital: 60% of operating keys are managed and the target is ~15,000 managed keys by 2031.' },
    { pair: [
      { type: 'column', title: 'Operating cash covers capex two to three times', unit: '₹ crore', x: 'A.labels', from: 'FY25', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Returns are low: ROE ~7%, pre-tax ROCE ~11%', unit: '% (Screener; FY24 = ~8 months)', x: 'A.labels', from: 'FY25', series: [{ name: 'ROE', ref: 'A.roe', fmt: 'pct' }, { name: 'ROCE (pre-tax)', ref: 'A.roce', fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Screener.in; GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26'], rows: [
      ['Cash from operations', '{{A.cfo.1|num}}', '{{A.cfo.2|num}}'],
      ['Capex (fixed assets)', '−386', '−410'],
      ['Interest received on treasury', '+32', '+155'],
      ['Dividends paid', '–', '–'],
      ['Cash brought in by the demerger scheme', '+1,437', '–'],
      { hl: true, cells: ['**Net added to cash, deposits and investments (approx.)**', '**~1,880**', '**~860**'] },
      ['Memo: gross treasury at year end (cash, deposits, investments excl. associates)', '~2,220', '~3,125'],
    ], source: 'AR FY26 consolidated cash flow statement (p.208) and notes 5, 6, 11, 13, 14; GAM Research' } },
    { callout: '**The capital question:** ITC Hotels has ~₹3,100 cr of surplus cash and one of India\'s best collections of luxury hotels, but a ~7% ROE. Shareholders gain only if the cash goes into managed growth or acquisitions that earn more than the ~7% the cash earns in deposits. Kumarakom and Ahmedabad are small (~200 keys); Delhi and Vizag are multi-year owned builds that will dilute returns before they add to them.' },
  ],
};

module.exports = { financials, capital, RD, SRC };
Object.assign(module.exports, require('./ITCHOTELS.partA2'));

if (require.main === module) {
  const P = module.exports;
  const B = fs.existsSync(path.join(__dirname, 'ITCHOTELS.research.js')) ? require('./ITCHOTELS.research') : null;
  const parts = { financials: P.financials, capital: P.capital, balance: P.balance, ownershipBase: P.ownershipBase, statements: P.statements };
  const report = {
    symbol: 'ITCHOTELS', listing: 'NSE: ITCHOTELS', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections(parts) : Object.values(parts),
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
