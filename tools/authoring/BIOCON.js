// Authoring source for the Biocon initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable basis
// and FY26 EPS on the 162.97 cr shares outstanding at 30-Jun-2026 via BIOCON.patch.js). Part B (BIOCON.research.js +
// part2-6, shared BIOCON.ctx.js / BIOCON.ctx2.js) adds the research chapters. BIOCON.sotp.js first syncs the sum of the
// parts (biosimilars and generics on EV/EBITDA, Syngene and Bicara at market less 20%, less biopharma net debt) into
// assumptions.json as an implied P/E on Sep-28E EPS. Usage: node tools/authoring/BIOCON.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'BIOCON', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'BIOCON.json'), 'utf8'));
const A = M.annual, b = A.labels.length - 1, ix = l => A.labels.indexOf(l);
const RT = SCR.tables.ratios, keepR = RT.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = RT.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => RT.rows[k].filter((_, i) => keepR[i]);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const sum = (k, from, to) => { let s = 0; for (let i = ix(from); i <= ix(to); i++) s += A[k][i] || 0; return s; };
const SRC = { co: 'Company filings, Screener.in (consolidated; net profit attributable to owners), GAM Research' };
const cagr = (a, c, y) => (Math.pow(c / a, 1 / y) - 1) * 100;
const cfo2126 = sum('cfo', 'FY21', 'FY26'), capex2126 = sum('capex', 'FY21', 'FY26'), div2126 = sum('dividendsPaid', 'FY21', 'FY26');
const nd = l => A.borrowings[ix(l)] - A.cash[ix(l)] - A.investments[ix(l)];

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue up 2.4x in five years; profit attributable to shareholders roughly halved',
  blocks: [
    { p: `Biocon's consolidated revenue went from ₹${n0(A.sales[ix('FY21')])} cr in FY21 to ₹${n0(A.sales[b])} cr in FY26, ${n1(cagr(A.sales[ix('FY21')], A.sales[b], 5))}% a year, mostly because Biocon Biologics bought Viatris's biosimilars business (closed 29-Nov-2022), which doubled the biosimilars segment. EBITDA before other income rose from ₹${n0(A.ebitda[ix('FY21')])} cr to ₹${n0(A.ebitda[b])} cr, but the margin slipped from ${n1(A.ebitdaMargin[ix('FY21')])}% to ${n1(A.ebitdaMargin[b])}%. Below EBITDA the deal's costs took everything: interest went from ₹${n0(A.interest[ix('FY21')])} cr to ₹${n0(A.interest[b])} cr and depreciation and amortisation from ₹${n0(A.dep[ix('FY21')])} cr to ₹${n0(A.dep[b])} cr. Profit attributable to shareholders fell from ₹${n0(A.pat[ix('FY21')])} cr to ₹${n0(A.pat[b])} cr, and per share from ₹${n1(A.eps[ix('FY21')])} to ₹${n1(A.eps[b])} once the shares issued since Jun-2025 (120 cr to 163 cr) are counted. FY24 and FY25 look better than they were: they carried ₹530 cr of Bicara gains and ₹1,057 cr from selling the India branded business.` },
    { pair: [
      { type: 'column', title: 'Revenue: the Viatris deal doubled the business in FY23-24', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'EBITDA margin before other income: 25% in FY20, ~21% since', unit: 'EBITDA margin (%), Screener basis', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 30, source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Interest and amortisation absorb most of EBITDA since FY23', unit: '₹ crore', x: A.labels.slice(ix('FY19'), b + 1), series: [{ name: 'EBITDA', values: A.ebitda.slice(ix('FY19'), b + 1), fmt: 'num' }, { name: 'Depreciation & amortisation', values: A.dep.slice(ix('FY19'), b + 1), fmt: 'num' }, { name: 'Interest', values: A.interest.slice(ix('FY19'), b + 1), fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'column', title: 'Profit attributable: FY24-25 propped up by one-off gains', unit: 'Net profit attributable to owners (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: `${SRC.co}. FY24 incl. ₹530 cr Bicara gain and ₹350 cr from two branded units; FY25 incl. ₹1,057 cr gain on the India branded business` },
    ] },
    { callout: '**Our view:** the business grew; the shareholder did not. Five years of 19% revenue growth produced lower profit per share because the growth was bought with debt (interest ~₹1,000 cr a year), with minority partners (23% of BBL until Jan-2026) and finally with new shares (36% more since Jun-2025). FY27 is the first year in which those costs fall rather than rise: interest is down 23% YoY in Q1FY27 and minorities in BBL are gone. The case for the stock is that this reverses; the record says it has not yet.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Returns on capital fell from 13% to 4%: a big, expensive bet still waiting to pay',
  blocks: [
    { p: `Over FY21-26 Biocon generated ₹${n0(cfo2126)} cr of operating cash and spent ₹${n0(capex2126)} cr on fixed assets (plants in Malaysia, Bengaluru, Vizag, Hyderabad and the US, plus Syngene's labs) and ₹${n0(div2126)} cr on dividends; the Viatris deal (FY23, ~₹14,260 cr of investing outflow that year) was paid with debt and BBL shares. Equity raised: ₹4,500 cr (Jun-2025 QIP at ₹330) and ₹4,150 cr (Jan-2026 QIP at ₹368.35), plus 17.1 cr shares swapped to BBL's minorities. ROCE on Screener's basis fell from ${RR('ROCE %')[RL.indexOf('FY20')]}% in FY20 to ${RR('ROCE %').at(-1)}% in FY26; ROE was ${n1(A.roe[b])}%. Goodwill of ₹18,377 cr and other intangibles of ₹8,058 cr (Mar-26 balance sheet) are the price of the Viatris business; at a 10% pre-tax return they need ~₹2,600 cr a year of operating profit on their own.` },
    { pair: [
      { type: 'column', title: 'Operating cash covered capex only from FY24', unit: '₹ crore', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 12-13% before the deal, 4-6% since', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, max: 16, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(sum('cfo', 'FY21', 'FY23')), n0(sum('cfo', 'FY24', 'FY26')), n0(cfo2126)],
      ['Capex (fixed assets)', n0(sum('capex', 'FY21', 'FY23')), n0(sum('capex', 'FY24', 'FY26')), n0(capex2126)],
      ['Dividends paid', n0(sum('dividendsPaid', 'FY21', 'FY23')), n0(sum('dividendsPaid', 'FY24', 'FY26')), n0(div2126)],
      { hl: true, cells: ['**Left over before acquisitions**', `**${n0(sum('cfo', 'FY21', 'FY23') - sum('capex', 'FY21', 'FY23') - sum('dividendsPaid', 'FY21', 'FY23'))}**`, `**${n0(sum('cfo', 'FY24', 'FY26') - sum('capex', 'FY24', 'FY26') - sum('dividendsPaid', 'FY24', 'FY26'))}**`, `**${n0(cfo2126 - capex2126 - div2126)}**`] },
      ['Memo: Viatris biosimilars deal (FY23 investing outflow incl. capex)', '~14,260', '–', '~14,260'],
      ['Memo: equity raised (QIPs)', '–', '8,650', '8,650'],
    ], source: 'Screener.in cash flow (consolidated); AR FY26 (QIPs)' } },
    { callout: '**The capital question has changed.** Management says the investment phase is over: no large greenfield capex, the Malaysia drug-substance expansion finishing by end-FY27, and "every dollar" of free cash to debt (CFO, Q4FY26 and Q1FY27 calls). That is the right promise; the test is whether operating cash flow, ₹1,994 cr in FY26 after ₹4,061 cr in FY25 (helped then by a ₹743 cr fall in receivables), can stay above ₹3,000 cr while inventory is built for the launches.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & leverage', kicker: 'Balance sheet', title: `Net debt ₹${n0(nd('FY26'))} cr at Mar-26 (3.0x EBITDA), ₹11,098 cr at Jun-26; falling, but inventory is rising`,
  blocks: [
    { p: `At Mar-2026 Biocon had ₹${n0(A.borrowings[b])} cr of borrowings incl. ₹609 cr of leases, against ₹${n0(A.cash[b])} cr of cash and ₹${n0(A.investments[b])} cr of investments (incl. the Bicara stake at ₹1,027 cr): net debt ₹${n0(nd('FY26'))} cr on Screener's basis, ${n1(nd('FY26') / A.ebitda[b])}x EBITDA before other income (the company quotes $1.1 bn and 2.7x on its own EBITDA). The core of the debt is BBL's: $800 mn of 6.67% senior secured notes (callable from Oct-2026 at a premium) and a ~$295 mn syndicated loan, with term maturities moved out to FY29-30 (June-2026 presentation). At Jun-2026 borrowings were ₹15,551 cr incl. leases and net debt rose ~₹1,100 cr in the quarter as inventory was built for the second-half launches (CFO). Inventories (₹${n0(A.inventories[b])} cr) and receivables (₹${n0(A.receivables[b])} cr) are ~${Math.round((A.inventories[b] + A.receivables[b]) / A.sales[b] * 100)}% of sales; inventory days on Screener's basis ${RR('Inventory Days').at(-1)}.` },
    { pair: [
      { type: 'column', title: 'Net debt jumped with the Viatris deal and is coming down slowly', unit: 'Net debt, Screener basis (₹ crore)', x: A.labels.slice(ix('FY19'), b + 1), series: [{ name: 'Net debt', values: A.labels.slice(ix('FY19'), b + 1).map(nd), fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'Inventory ~390 days of cost of goods; receivables ~130 days', unit: 'Days (Screener basis)', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }, { name: 'Payable days', values: RR('Days Payable'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Jun-26'], rows: [
      ['Equity attributable to owners', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}', '35,229'],
      ['Non-controlling interests', '1,038', '4,622', '5,491', '6,068', '2,590', '2,317'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}', '15,551'],
      ['Cash and investments', '{{A.cashAndInvestments.7|num}}', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}', '4,453'],
      ['Net fixed assets incl. goodwill and intangibles', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}', '36,359'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.8|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}', '6,733'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.8|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}', '6,827'],
      ['Trade payables', '{{A.payables.7|num}}', '{{A.payables.8|num}}', '{{A.payables.9|num}}', '{{A.payables.10|num}}', '{{A.payables.11|num}}', '7,281'],
    ], source: `${SRC.co}. Non-controlling interests: Screener schedule (Mar-22 from MOSL); Jun-26 from the Q1FY27 fact sheet (cash ₹1,518 cr + bank ₹836 cr + investments ₹2,099 cr; fixed assets = PP&E, right-of-use, goodwill and intangibles)` } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: founder 44.7% after the dilution, mutual funds 15.5%, Viatris 5.6% and free to sell',
  blocks: [
    { pair: [
      { type: 'line', title: 'Indian institutions bought the QIPs; foreign funds stayed small', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters diluted from 60.6% to 44.7% in a year', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 30, max: 65, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (consolidated; net profit attributable)', rows: [
      { key: 'sales', name: 'Revenue from operations', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } },
      { key: 'dep', name: 'Depreciation and amortisation' },
      { key: 'otherIncome', name: 'Other income (actuals after exceptional items; forecasts net of Syngene minorities)' },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹; FY26 on 162.97 cr shares)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener basis; net profit attributable)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (before other income)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (after exceptional items)' },
      { key: 'interest', name: 'Interest' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit (attributable)', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./BIOCON.sotp').syncSotp();
  const B = fs.existsSync(path.join(__dirname, 'BIOCON.research.js')) ? require('./BIOCON.research') : null;
  const report = {
    symbol: 'BIOCON', listing: 'NSE: BIOCON · BSE: 532523', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
