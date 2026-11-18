// Authoring source for the Asian Paints initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the
// attributable basis via ASIANPAINT.patch.js). Part B (ASIANPAINT.research.js + part2-4, shared
// ASIANPAINT.ctx.js) adds the research chapters. Usage: node tools/authoring/ASIANPAINT.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ASIANPAINT', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated; profit attributable to shareholders), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years of growth, but EPS barely moved in FY21-26 as competition and input costs bit',
  blocks: [
    { p: 'Asian Paints\' revenue grew from ₹14,271 cr in FY16 to ₹35,584 cr in FY26, about 9.6% a year, and profit attributable to shareholders from ₹1,745 cr to ₹4,325 cr, about 9.5% a year. The last five years were rough. Revenue jumped 34% in FY22 and 19% in FY23 as the company passed on a raw-material spike, then stalled: +3% in FY24, −4.5% in FY25 (price cuts, weak demand and Birla Opus\'s launch) and +5% in FY26. EPS went from ₹32.7 (FY21) to ₹56.9 (FY24) and back to ₹38.2 (FY25) and ₹45.1 (FY26): only 6.6% a year over FY21-26.' },
    { pair: [
      { type: 'column', title: 'Revenue: 9.6% a year, flat since FY23', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'ends', source: SRC.co },
      { type: 'column', title: 'Profit peaked in FY24 and fell a third in FY25', unit: 'Net profit attributable to shareholders (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Gross margin swings with crude and TiO2', unit: 'Gross margin (%), Screener basis (100 − material cost incl. traded goods)', x: 'A.labels', from: 'FY16', series: [{ name: 'Gross margin', ref: 'A.grossMargin', fmt: 'pct0' }], labels: 'all', min: 40, max: 60, source: 'Screener.in' },
      { type: 'line', title: 'EBITDA margin: 22% in FY21, 16.5% in FY22, 18.8% now', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 30, source: SRC.co },
    ] },
    { callout: '**Our view:** two forces explain the last five years. First, input costs: paints are made from crude derivatives and titanium dioxide, and every spike (FY22, early 2026) squeezes margins until prices catch up. Second, competition: since Birla Opus launched in Feb-2024 Asian Paints has cut prices, raised dealer schemes and grown value slower than volume. FY24\'s 21.4% EBITDA margin was earned on cheap inputs before the new entrants arrived; we do not expect it again.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Returns halved from the 40s to the mid-20s: more capital, lower margins',
  blocks: [
    { p: 'Asian Paints used to be one of India\'s highest-return companies: ROCE of 42% in FY15-16 and 29-38% in FY19-FY24. It was 26% in FY25 and FY26. Two reasons. Margins fell (above). And the company stepped up investment: capex was ₹5,813 cr in FY24-26 against ₹2,286 cr in FY21-23, for new paint capacity, the VAM-VAE emulsion plant at Dahej (~₹3,250 cr committed), a white-cement plant in the UAE and home-decor businesses (White Teak, Weatherseal) that still lose money. Operating cash flow was ₹17,616 cr over FY24-26 (FY26 ₹7,088 cr, helped by a ₹976 cr inventory release) and dividends ₹8,116 cr.' },
    { pair: [
      { type: 'column', title: 'Cash from operations comfortably covers capex', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: from 42% to 26%', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 50, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', '8,862', '17,616', '26,478'],
      ['Capex', '2,286', '5,813', '8,099'],
      ['Dividends paid', '4,198', '8,116', '12,314'],
      { hl: true, cells: ['**Left over**', '**2,378**', '**3,687**', '**6,065**'] },
      ['Memo: cash and investments at the end (gross, excl. term deposits)', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.11|num}}', ''],
    ], source: 'Screener.in cash flow (consolidated). Term deposits of ₹2,439 cr at Mar-26 sit in other financial assets and are not in the memo line.' } },
    { callout: '**The capital question:** management has committed ~₹2,000 cr to a new paint plant in Madhya Pradesh, ~₹340 cr to a second UAE plant and the balance of VAM-VAE. We model ₹1,400 cr of capex a year, about 3-3.5% of revenue. The payout policy (60% of profit) is reliable; the risk is more money going into home decor, where returns so far are negative.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹6,600 cr; working capital tightened in FY26',
  blocks: [
    { p: 'Asian Paints is net cash. At Mar-2026 it held ₹1,074 cr of cash, ₹7,062 cr of investments and ₹2,439 cr of term deposits (inside other financial assets), against ₹3,929 cr of borrowings, of which ₹1,636 cr are leases and ₹805 cr long-term debt taken over with the polymers subsidiary that is building VAM-VAE. Net cash was ~₹6,600 cr. Working-capital days fell from 52 to 38 in FY26 as inventory came down from 142 to 118 days; receivables have stayed at ~46 days, above the 30-38 days of FY15-20, a sign of more generous dealer credit in a competitive market.' },
    { pair: [
      { type: 'line', title: 'Inventory days fell in FY26; receivable days stay high', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash and investments rose to ₹8,136 cr (plus ₹2,439 cr deposits)', unit: 'Cash and investments (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (excl. minorities)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}'],
    ], source: SRC.co + '. Minorities (₹643 cr at Mar-26) are shown by Screener under other liabilities.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: three founding families at 52.6%, domestic institutions now 21%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions up from 11% to 21% in two years; foreign funds down', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters unchanged at 52.6%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 60, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (incl. associates, exceptional items)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 12 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'ASIANPAINT.research.js')) ? require('./ASIANPAINT.research') : null;
  const report = {
    symbol: 'ASIANPAINT', listing: 'NSE: ASIANPAINT · BSE: 500820', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer & Building Materials',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
