// Authoring source for the Solar Industries India initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated).
// Part B (SOLARINDS.research.js + part2-4, shared SOLARINDS.ctx.js) adds the research chapters.
// Usage: node tools/authoring/SOLARINDS.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SOLARINDS', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const MOD = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'SOLARINDS.json'), 'utf8'));
const A = MOD.annual, F = MOD.forecast.F, ix = l => A.labels.indexOf(l);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const cg = (k, a, z) => (Math.pow(A[k][ix(z)] / A[k][ix(a)], 1 / (ix(z) - ix(a))) - 1) * 100;
const sumR = (k, a, z) => A[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const nd = i => A.borrowings[i] - A.cashAndInvestments[i];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years of 21% growth, with one input-cost boom and bust and a defence-led margin step-up',
  blocks: [
    { p: `Solar's revenue grew from ₹${n0(A.sales[ix('FY16')])} cr in FY16 to ₹${n0(A.sales[ix('FY26')])} cr in FY26, about ${Math.round(cg('sales', 'FY16', 'FY26'))}% a year, and net profit from ₹${n0(A.pat[ix('FY16')])} cr to ₹${n0(A.pat[ix('FY26')])} cr, about ${Math.round(cg('pat', 'FY16', 'FY26'))}% a year. The path had three phases. Until FY21 it was a pure explosives company (exports and overseas already ~35-42% of sales) growing ~12% a year with a ~20% EBITDA margin. In FY22-23 the ammonium nitrate (AN) price spike after the Russia-Ukraine war pushed revenue up 57% and 75% (prices are passed on), while the margin slipped to ~19%; when AN fell, FY24 revenue dropped 12%. Since FY24 defence has changed the mix: defence rose from 9% of revenue in FY24 to 27% in FY26, and EBITDA margin rose from 19% in FY23 to 28% in FY26.` },
    { pair: [
      { type: 'column', title: 'Revenue: 21% a year, with an AN-price bulge in FY23', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: up six times since FY21', unit: 'Net profit incl. minority (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Gross margin fell when AN spiked, then rose with defence', unit: 'Gross margin (%)', x: 'A.labels', from: 'FY16', series: [{ name: 'Gross margin', ref: 'A.grossMargin', fmt: 'pct0' }], labels: 'all', min: 30, max: 55, source: 'Screener.in (100 − material cost % of revenue)' },
      { type: 'line', title: 'EBITDA margin: ~20% for a decade, 28% now', unit: 'EBITDA margin (%, Screener basis)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 32, source: SRC.co },
    ] },
    { callout: '**Our view:** the FY24-26 margin step-up is real and mostly mix: defence (higher margin) went from a tenth to over a quarter of revenue, and the domestic explosives business, which is sold by tender, stayed flat. The swing factor in explosives is ammonium nitrate: Solar passes on most of a price rise with a lag, so revenue jumps and the percentage margin falls. That is happening again in FY27 (management: 18-20% of explosives growth is price).' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Returns above 30%, but capex and working capital now eat most of the profit',
  blocks: [
    { p: `Over FY15-26 Solar generated ₹${n0(A.cumulative.cfo)} cr of operating cash and spent ₹${n0(A.cumulative.capex)} cr on capex, so free cash flow was only ₹${n0(A.cumulative.fcf)} cr against cumulative profit of ₹${n0(A.cumulative.pat)} cr. Capex has stepped up sharply: ₹${n0(A.capex[ix('FY24')])} cr in FY24, ₹${n0(A.capex[ix('FY25')])} cr in FY25 and ₹${n0(A.capex[ix('FY26')])} cr in FY26 on Screener's cash flow (company: ₹1,182 cr and ₹1,556 cr for FY25-26), with ₹2,050 cr guided for FY27, for defence capacity (Nagpur, Dhule, Dholpur), new explosives plants and overseas units. Returns are still high: ROE was ${Math.round(A.roe[ix('FY26')])}% and ROCE ${SCR.rows['ROCE %'].at(-1)}% in FY26, against our 12.5% cost of equity. Dividends are small (₹11 a share, ~6% of profit).` },
    { pair: [
      { type: 'column', title: 'Capex has overtaken operating cash flow', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: ~20-25% before defence, 32-38% since FY23', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 45, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(sumR('cfo', 'FY21', 'FY23')), n0(sumR('cfo', 'FY24', 'FY26')), n0(sumR('cfo', 'FY21', 'FY26'))],
      ['Capex', n0(sumR('capex', 'FY21', 'FY23')), n0(sumR('capex', 'FY24', 'FY26')), n0(sumR('capex', 'FY21', 'FY26'))],
      ['Acquisitions (Problast etc.)', n0(sumR('acquisitions', 'FY21', 'FY23')), n0(sumR('acquisitions', 'FY24', 'FY26')), n0(sumR('acquisitions', 'FY21', 'FY26'))],
      ['Dividends paid', n0(sumR('dividendsPaid', 'FY21', 'FY23')), n0(sumR('dividendsPaid', 'FY24', 'FY26')), n0(sumR('dividendsPaid', 'FY21', 'FY26'))],
      { hl: true, cells: ['**Left over**', ...[['FY21', 'FY23'], ['FY24', 'FY26'], ['FY21', 'FY26']].map(([a, z]) => `**${n0(sumR('cfo', a, z) - sumR('capex', a, z) - sumR('acquisitions', a, z) - sumR('dividendsPaid', a, z))}**`)] },
      ['Memo: net debt at the end (negative = net cash)', n0(nd(ix('FY23'))), n0(nd(ix('FY26'))), ''],
    ], source: 'Screener.in cash flow (consolidated); net debt = borrowings incl. leases less cash and investments' } },
    { callout: `**The capital question:** the business needs more capital than it used to. Defence plants, overseas units and working capital absorbed all of FY26's operating cash, and on our forecasts free cash flow is negative in FY27 (₹{{F.fcf.0|num}} cr) before turning positive. Then comes Omnia: ₹12,951 cr in cash, mostly borrowed. Solar's returns justify investing, but shareholders should expect debt, not cash, to build for the next two years.` },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & debt', kicker: 'Balance sheet', title: 'From net cash to net debt in one year, as inventory and receivables ballooned',
  blocks: [
    { p: `At Mar-2026 Solar had ₹${n0(A.borrowings[b()])} cr of borrowings (incl. leases) and ₹${n0(A.cashAndInvestments[b()])} cr of cash and investments: net debt of ₹${n0(nd(b()))} cr, against net cash of ₹${n0(-nd(ix('FY25')))} cr a year earlier (company: net debt ₹867 cr, 0.32x EBITDA). The swing came from working capital: inventory days rose from ${SCR.rows['Inventory Days'].at(-2)} to ${SCR.rows['Inventory Days'].at(-1)} and receivable days from ${SCR.rows['Debtor Days'].at(-2)} to ${SCR.rows['Debtor Days'].at(-1)}. Management says the inventory was built on purpose "to mitigate the risk arising from geopolitical uncertainties" and should normalise "maybe in the next 2 quarters". Our model holds working capital at FY26's share of revenue, which is conservative if that happens.` },
    { pair: [
      { type: 'line', title: 'Working-capital days jumped in FY26', unit: 'Days (of revenue)', x: RL, series: [{ name: 'Inventory days', values: SCR.rows['Inventory Days'], fmt: 'num' }, { name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt: back after one year of net cash', unit: 'Net debt, ₹ crore (negative = net cash)', x: A.labels.slice(ix('FY19')), series: [{ name: 'Net debt', values: A.labels.slice(ix('FY19')).map((_, k) => Math.round(nd(ix('FY19') + k))), fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26', 'Mar-27E', 'Mar-28E'], rows: [
      ['Net worth (attributable; minority interest of ₹272 cr at Mar-26 excluded)', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => n0(A.netWorth[ix(l)])), '{{F.netWorth.0|num}}', '{{F.netWorth.1|num}}'],
      ['Borrowings (incl. leases)', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => n0(A.borrowings[ix(l)])), '', ''],
      ['Cash and investments', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => n0(A.cashAndInvestments[ix(l)])), '', ''],
      { hl: true, cells: ['**Net debt (negative = net cash)**', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => `**${n0(nd(ix(l)))}**`), `**${n0(-F.treasury[0])}**`, `**${n0(-F.treasury[1])}**`] },
      ['Inventories', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => n0(A.inventories[ix(l)])), '', ''],
      ['Trade receivables', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => n0(A.receivables[ix(l)])), '', ''],
      ['Trade payables', ...['FY22', 'FY24', 'FY25', 'FY26'].map(l => n0(A.payables[ix(l)])), '', ''],
    ], source: 'Screener.in (consolidated); GAM estimates for Mar-27E/28E (organic, before any Omnia acquisition debt)' } },
    { callout: 'Before Omnia the balance sheet is comfortable: net debt below 0.5x EBITDA on our forecasts. With Omnia, management expects total debt of ₹10,000-11,000 cr by FY28 and promises to stay below 2x net debt to EBITDA. That is manageable for a business earning ~₹4,700 cr of organic EBITDA in FY28E, but it ends Solar\'s history as a near-debt-free company.' },
  ],
};
function b() { return A.labels.length - 1; }

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Nuwal family at 73%, Indian funds 12%, a thin free float',
  blocks: [
    { pair: [
      { type: 'line', title: 'Indian institutions ~13%, foreign funds ~6%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters unchanged at 73.15%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 50, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (net of hyperinflation loss)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (incl. minority)', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'SOLARINDS.research.js')) ? require('./SOLARINDS.research') : null;
  const report = {
    symbol: 'SOLARINDS', listing: 'NSE: SOLARINDS · BSE: 532725', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Defence & Industrials',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
