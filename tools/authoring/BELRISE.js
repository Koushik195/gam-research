// Authoring source for the Belrise Industries initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated FY22-26; standalone FY18-21 dropped).
// Part B (BELRISE.research.js + part2-6, shared BELRISE.ctx.js) adds the research chapters. BELRISE.patch.js drops the
// standalone columns and puts the Mar-26 balance sheet and FY26 EPS on a post-QIP basis (96.72 cr shares).
// BELRISE.val.js first syncs the derived multiples into assumptions.json. Usage: node tools/authoring/BELRISE.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BELRISE', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(2[3-6])$/.test(p));
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const MA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'BELRISE.json'), 'utf8')).annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sumR = (k, a, z) => MA[k].slice(MA.labels.indexOf(a), MA.labels.indexOf(z) + 1).reduce((s, x) => s + (x || 0), 0);
const cash5 = { cfo: sumR('cfo', 'FY22', 'FY26'), capex: sumR('capex', 'FY22', 'FY26'), div: sumR('dividendsPaid', 'FY22', 'FY26'), acq: sumR('acquisitions', 'FY22', 'FY26') };
const left = cash5.cfo - cash5.capex - cash5.div;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue +15% a year since FY22; the margin slipped from 14% to 12%, and the IPO cut interest so profit jumped 40% in FY26',
  blocks: [
    { p: 'Belrise\'s consolidated revenue rose from ₹5,397 cr in FY22 to ₹9,509 cr in FY26, 15% a year; ₹1,775 cr of FY26 revenue (19%) is trading of goods, mostly steel and other materials sold to buyers outside India at a ~5% margin, so manufacturing revenue was ₹7,735 cr. The EBITDA margin fell from 14.0% to 12.1% as the trading share rose and raw materials went from 78% to 81% of revenue (Screener cost split; materials include the goods traded). Depreciation rose from ₹246 cr to ₹361 cr with new plants and H-One (bought in Mar-2025). For three years profit hardly moved (₹314 cr in FY23 and FY24, ₹355 cr in FY25) because interest took ₹250-307 cr a year; the IPO repaid ₹1,596 cr of debt in Jun-2025, interest fell to ₹232 cr and profit rose 40% to ₹497 cr in FY26.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹5,397 cr in FY22, ₹9,509 cr in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: flat FY23-25, +40% in FY26 after the IPO repaid debt', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY26 after a ₹5 cr exceptional charge (labour codes).' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 14.0% in FY22, 12.1% in FY26', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 16, source: SRC.co },
      { type: 'column', title: 'Interest equalled 70-77% of pre-tax profit until the IPO', unit: '₹ crore', x: 'fin.labels', from: 'FY22', to: 'FY26', series: [{ name: 'Finance cost', ref: 'fin.interest', fmt: 'num' }, { name: 'Profit before tax', ref: 'fin.pbt', fmt: 'num' }], labels: 'none', source: SRC.co },
    ] },
    { callout: '**Our view:** Belrise is a steady, mid-teens grower whose reported profit was held down by debt, not by the business. Manufacturing EBITDA margins have been stable at 13.7-13.9% (FY25-26); the headline margin moves mostly with the trading share. The FY26 profit jump is a one-time refinancing gain; from here profit can only grow as fast as the factories.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: `Capital hungry: ₹${n0(cash5.capex)} cr of capex in five years against ₹${n0(cash5.cfo)} cr of operating cash; ₹3,850 cr of new equity since May-2025`,
  blocks: [
    { p: `Over FY22-26 Belrise generated ₹${n0(cash5.cfo)} cr of operating cash (before interest), spent ₹${n0(cash5.capex)} cr on fixed assets and paid ₹${n0(cash5.div)} cr of dividends. After ~₹1,300 cr of interest over the five years, little was left: debt rose to ₹2,964 cr by Mar-2025. Since then the company has raised ₹2,150 cr in the IPO (May-2025, at ₹90) and ₹1,700 cr in a QIP (Jul-2026, at ₹220). Management guides capex at 6-6.5% of manufacturing revenue (incl. R&D) and wants to spend most of the QIP money on acquisitions in FY27, mainly aerospace abroad and car/truck parts in India. Returns are modest: ROCE 14-15% on Screener's basis (company ROACE 14.7% in FY26), about our 12.5% cost of equity.` },
    { pair: [
      { type: 'column', title: 'Operating cash vs capex and dividends', unit: '₹ crore', x: 'A.labels', from: 'FY22', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }, { name: 'Dividends paid', ref: 'A.dividendsPaid', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 14-15%, barely above the cost of capital', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in (consolidated; FY22 omitted: balance-sheet mapping error)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went, FY22-FY26 (₹ crore)', head: ['', 'Five years'], rows: [
      ['Cash from operations', n0(cash5.cfo)], ['Capex (cash)', n0(cash5.capex)], ['Dividends paid', n0(cash5.div)],
      { hl: true, cells: ['**Left over before interest and acquisitions**', `**${n0(left)}**`] },
      ['Memo: IPO fresh issue (May-2025) / QIP (Jul-2026)', '2,150 / 1,700'], ['Memo: acquisitions since Mar-2025', 'H-One, Mag Filters, Chester Hall (GBP13.2m), SDM, Hyva (~₹54 cr)'],
    ], source: 'Screener.in cash flow; company filings; GAM Research' } },
    { callout: '**The capital question:** this is a business that has needed outside money to grow. Each rupee of fixed assets turns over ~3 times a year at a ~12% EBITDA margin, so returns depend on keeping plants full and debt low. The QIP money (₹1,657 cr net) is the swing factor: spent well on acquisitions it adds earnings; parked, it earns ~6.5%.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'From 1.0x net debt to equity to net cash in eighteen months',
  blocks: [
    { p: 'Net debt was ₹2,706 cr at Mar-2025 (1.01x equity, company basis). The IPO money repaid ₹1,596 cr in Jun-2025 and net debt fell to ₹598 cr at Mar-2026 (0.11x), with gross borrowings of ₹1,521 cr (incl. ₹82 cr of leases) and ₹954 cr of cash and investments. The Jul-2026 QIP added ₹1,657 cr net, so pro forma Mar-2026 the company has ~₹1,090 cr of net cash; ₹532 cr had been used by 30-Sep-2026, mainly to repay debt and pay vendors (CRISIL monitoring report). Working capital is moderate: receivables ~67 days, inventory ~44 days, payables ~63 days in FY26.' },
    { pair: [
      { type: 'line', title: 'Receivable days 60-71; payable days rose to 63', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Net debt: ₹2,706 cr in FY25, net cash after the IPO and QIP', unit: 'Net debt incl. leases (₹ crore; negative = net cash)', x: 'A.labels', from: 'FY23', series: [{ name: 'Net debt', ref: 'A.netDebt', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY26 pro forma for the Jul-2026 QIP (₹1,657 cr net); reported Mar-26 net debt ₹598 cr.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26 (pro forma QIP)'], rows: [
      ['Net worth', '{{A.netWorth.1|num}}', '{{A.netWorth.2|num}}', '{{A.netWorth.3|num}}', '{{A.netWorth.4|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.1|num}}', '{{A.borrowings.2|num}}', '{{A.borrowings.3|num}}', '{{A.borrowings.4|num}}'],
      ['Cash and investments', '{{A.cashAndInvestments.1|num}}', '{{A.cashAndInvestments.2|num}}', '{{A.cashAndInvestments.3|num}}', '{{A.cashAndInvestments.4|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.1|num}}', '{{A.fixedAssets.2|num}}', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.4|num}}'],
      ['Inventories', '{{A.inventories.1|num}}', '{{A.inventories.2|num}}', '{{A.inventories.3|num}}', '{{A.inventories.4|num}}'],
      ['Trade receivables', '{{A.receivables.1|num}}', '{{A.receivables.2|num}}', '{{A.receivables.3|num}}', '{{A.receivables.4|num}}'],
      ['Trade payables', '{{A.payables.1|num}}', '{{A.payables.2|num}}', '{{A.payables.3|num}}', '{{A.payables.4|num}}'],
    ], source: SRC.co + '. Mar-26 net worth and cash include the Jul-2026 QIP (₹1,657 cr net, BELRISE.patch.js); investments include ₹113 cr of unlisted equity (₹99 cr in promoter company BAPL).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Badve family 66.5% (Jun-2026), 61% after the QIP; institutions doubled to ~19%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign and Indian institutions both rising since listing', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters 73.0% after the IPO, 66.5% from Dec-2025', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 50, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY22–FY29E', rows: [
      { key: 'sales', name: 'Revenue (incl. trading)', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income (history: net of exceptional items)', flag: { type: 'pct', th: 60 } },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹; FY26 pro forma 96.7 cr shares)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'interest', name: 'Finance cost' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./BELRISE.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'BELRISE.research.js')) ? require('./BELRISE.research') : null;
  const report = {
    symbol: 'BELRISE', listing: 'NSE: BELRISE · BSE: 544405', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1).replace(/(^|[^A-Za-z])Rs ?(?=[0-9~])/g, '$1₹'));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
