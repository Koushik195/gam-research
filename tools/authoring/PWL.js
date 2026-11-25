// Authoring source for the Physicswallah initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; PWL.patch.js drops the FY21 ten-month
// column, moves the CCPS / other equity reserve out of borrowings and restates FY26 EPS on 290.09 cr shares). Part B
// (PWL.research.js + part2-6, shared PWL.ctx.js) adds the research chapters. PWL.val.js first syncs the derived multiples.
// Usage: node tools/authoring/PWL.js   (then node src/model.js PWL)
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'PWL', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research', ar: 'AR FY26 consolidated cash flow statement, Q4FY26 shareholders\' letter' };
// Cash uses (₹ crore): AR FY26 / Screener cash-flow schedules. Lease payments = principal + interest (company letters).
const CF = { FY25: { cfo: 507, capex: 172, lease: 186, acq: 54 }, FY26: { cfo: 833, capex: 343, lease: 252, acq: 57 } };
const left = y => CF[y].cfo - CF[y].capex - CF[y].lease;
const n0 = v => Math.round(v).toLocaleString('en-IN');

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 5x in three years; the first profitable year before tax came in FY26',
  blocks: [
    { p: 'Revenue went from ₹744 cr in FY23 to ₹3,900 cr in FY26 (+74% a year), with growth slowing from 161% in FY24 to 49% and 35%. The losses came from building the offline network: in FY24 the company lost ₹1,131 cr (including fair-value charges on preference shares then held as liabilities), in FY25 ₹243 cr and in FY26 only ₹24 cr, after ₹63 cr of IPO and one-off costs. Profit before tax was ₹10 cr in FY26, the first positive year. The business is seasonal: students pay in March-September, but revenue is booked over the batch, so Q2 and Q3 carry the profit and Q4 and Q1 show losses. Q1FY27 lost ₹88 cr (₹127 cr a year earlier).' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹744 cr in FY23, ₹3,900 cr in FY26', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net loss shrank from ₹1,131 cr (FY24) to ₹24 cr (FY26)', unit: 'Net profit / (loss) (₹ crore)', x: 'fin.labels', from: 'FY23', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: Q2 and Q3 are the big quarters', unit: 'Revenue from operations, quarterly (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Quarterly EBITDA: profits in Q2-Q3, losses in Q4-Q1', unit: 'EBITDA, quarterly (₹ crore; Screener basis, after ESOP)', x: 'Q.labels', series: [{ name: 'EBITDA', ref: 'Q.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co + '. Q1FY27 includes a ₹44 cr fair-value charge on the Sarrthi IAS stake.' },
    ] },
    { callout: '**Our view:** the turn to profit is real but thin. FY26 EBITDA in our model (revenue less operating costs including ₹171 cr of share-based pay, before rent is counted under Ind AS 116) was ₹370 cr, a 9.5% margin. After rent the company\'s own "pre-IndAS" EBITDA was ₹300 cr (7.7%), and other income of ₹232 cr on the IPO cash is what made the year profitable before tax. Operating leverage is visible (employee costs before ESOP fell from 45.4% to 44.5% of revenue, advertising from 9.6% to 9.1%), but the offline network still loses money.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Cash & capital', kicker: 'Capital allocation', title: `Students pay upfront: ₹${n0(left('FY26'))} cr left in FY26 after capex and rent, and the IPO cash is mostly unspent`,
  blocks: [
    { p: `Physicswallah's cash comes before its revenue. Fees are collected at enrolment and booked over the course, so contract liabilities (fees received, not yet earned) were ₹1,149 cr at Mar-2026, up from ₹864 cr. In FY26 operating cash of ₹${n0(CF.FY26.cfo)} cr paid for ₹${n0(CF.FY26.capex)} cr of capex (centre fit-outs, servers) and ₹${n0(CF.FY26.lease)} cr of lease payments, leaving ₹${n0(left('FY26'))} cr. The ₹3,100 cr fresh issue (Nov-2025) was mostly unspent at Mar-2026 (₹768 cr used, of which ₹547 cr on acquisitions and general purposes, the biggest use so far). Treasury was ₹5,027 cr at Mar-2026 and ₹5,601 cr at Jun-2026, the Q1 rise being student fees paid in advance.` },
    { pair: [
      { type: 'column', title: 'Operating cash covers capex and rent with room to spare', unit: '₹ crore', x: ['FY25', 'FY26'], series: [{ name: 'Cash from operations', values: [CF.FY25.cfo, CF.FY26.cfo], fmt: 'num' }, { name: 'Capex', values: [CF.FY25.capex, CF.FY26.capex], fmt: 'num' }, { name: 'Lease payments', values: [CF.FY25.lease, CF.FY26.lease], fmt: 'num' }], labels: 'all', source: SRC.ar },
      { type: 'column', title: 'IPO money: ₹2,332 cr of ₹3,100 cr still unspent at Mar-2026', unit: 'Fresh-issue objects, ₹ crore (unutilised at 31-Mar-2026)', x: ['Marketing', 'Lease payments', 'Centre fit-outs', 'M&A and general', 'Servers/cloud', 'Other'], series: [{ name: 'Unutilised', values: [687, 492, 441, 394, 185, 134], fmt: 'num' }], labels: 'all', source: 'AR FY26 directors\' report, IPO utilisation table. Other = Xylem and Utkarsh objects and issue expenses.' },
    ] },
    { callout: '**The capital question:** the core needs little capital, so how the ₹5,000 cr+ treasury is used decides returns. So far: an aggressive offline build (155 centres in FY26), a K-12 school-management company (₹400 cr allocated), acquisitions with put options to buy out minorities (Xylem, Utkarsh, Sarrthi IAS: up to 85% by FY31), and a lending arm (FinZ) now being sold. After investor pushback management now says capital goes to online content, AI and "selective" online acquisitions, with offline opening "opportunistic". We take that at face value but watch it.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'Treasury ₹5,027 cr at Mar-2026 against ₹1,042 cr of lease liabilities and ₹10 cr of bank debt',
  blocks: [
    { p: 'At Mar-2026 the group held ₹5,027 cr of treasury (company definition: investments ₹2,421 cr, bank and cash ₹1,126 cr, and ~₹1,475 cr of deposits in other financial assets). Bank borrowings were ₹10.5 cr; lease liabilities on centres, hostels and offices were ₹1,042 cr. Screener files two equity items as "borrowings": the preference shares at Mar-2025 (₹834 cr) and an ₹824 cr reserve at Mar-2026. We count both as equity in net worth; the borrowings line below still includes them (as Screener and our Excel model show it), and offset the ₹824 cr in the investments line, so net cash is right (PWL.patch.js). Goodwill was ₹274 cr (Xylem, Utkarsh, Sarrthi and others; ₹16 cr impaired in FY26). Other financial liabilities of ₹463 cr include the redemption liability for buying out minority shareholders of acquired companies.' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (incl. minorities)', '{{A.netWorth.1|num}}', '{{A.netWorth.2|num}}', '{{A.netWorth.3|num}}', '{{A.netWorth.4|num}}'],
      ['Borrowings incl. lease liabilities (Screener; FY23-24 preference shares then held as liabilities)', '{{A.borrowings.1|num}}', '{{A.borrowings.2|num}}', '{{A.borrowings.3|num}}', '{{A.borrowings.4|num}}'],
      ['Cash, bank balances and investments (Screener)', '{{A.cashAndInvestments.1|num}}', '{{A.cashAndInvestments.2|num}}', '{{A.cashAndInvestments.3|num}}', '{{A.cashAndInvestments.4|num}}'],
      ['Net fixed assets incl. goodwill and right-of-use', '{{A.fixedAssets.1|num}}', '{{A.fixedAssets.2|num}}', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.4|num}}'],
      ['Memo: equity items filed as borrowings by Screener', '–', '–', '834', '824'], ['Memo: company treasury', '–', '–', '–', '5,027'], ['Memo: lease liabilities (in borrowings)', '–', '–', '996', '1,042'], ['Memo: contract liabilities (fees received in advance)', '–', '–', '864', '1,149'],
    ], source: SRC.co + '; AR FY26 consolidated balance sheet and notes 12, 16' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the two founders own 71%; free float is under 30%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Institutions hold ~25%; retail ~3.6%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Public', ref: 'SH.rows.Public', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in. WestBridge AIF I (5.84% at Mar-2026) is counted among institutions.' },
      { type: 'column', title: 'Founders: 72.3% at listing, 71.3% at Jun-2026', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'all', min: 60, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY22–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 40 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (after ESOP, before rent under Ind AS 116)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 500 } },
      { key: 'dep', name: 'Depreciation (incl. right-of-use)' },
      { key: 'otherIncome', name: 'Other income (history: net of exceptional items)', flag: { type: 'pct', th: 60 } },
      { key: 'interest', name: 'Finance cost (mostly lease interest)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit / (loss)', hl: true },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations (before lease payments)' },
      { key: 'capex', name: 'Capex (forecast: incl. lease principal)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 60 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income' },
      { key: 'pat', name: 'Net profit / (loss)', hl: true },
    ] } },
  ],
};

const statementNotes = {
  'sales@FY23': 'First offline centres (2022) and acquisitions (Xylem and others) consolidated.',
  'pat@FY24': 'Loss ₹1,131 cr: offline build-out plus fair-value charges on preference shares then carried as liabilities.',
  'ebitda@FY24': 'Rapid centre and faculty expansion; costs ran ahead of revenue.',
  'sales@FY26': '+35%: online +39%, offline +31% (155 new centres), on the then-reported basis.',
  'pat@FY26': 'First positive PBT (₹10 cr); loss after ₹34 cr tax and ₹63 cr of IPO, impairment and labour-code costs.',
  'otherIncome@FY26': 'Screener nets ₹53 cr of exceptional items; company other income ₹232 cr (IPO cash from Nov-2025).',
  'eps@FY26': 'Restated on 290.09 cr diluted shares (PWL.patch.js); reported −₹0.08.',
};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./PWL.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'PWL.research.js')) ? require('./PWL.research') : null;
  const report = {
    symbol: 'PWL', listing: 'NSE: PWL · BSE: 544609', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Internet & Consumer Platforms',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
