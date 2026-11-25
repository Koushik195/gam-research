// Authoring source for the Coal India initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated, after COALINDIA.patch.js: FY25/FY26
// stripping credit back in operating costs; owners' profit). Part B (COALINDIA.research.js + part2-6, shared
// COALINDIA.ctx.js) adds the research chapters. COALINDIA.val.js first syncs the derived multiples into assumptions.json.
// Usage: node tools/authoring/COALINDIA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'COALINDIA', 'research');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'COALINDIA.json'), 'utf8'));
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const keepR = SCR.periods.map(p => /^Mar 20(1[6-9]|2\d)$/.test(p) && `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = SCR.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => SCR.rows[k].filter((_, i) => keepR[i]);
const A = M.annual, ix = l => A.labels.indexOf(l);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const sum = (k, a, z) => A[k].slice(ix(a), ix(z) + 1).reduce((s, x) => s + (x || 0), 0);
const SRC = { co: 'Company filings, Screener.in (consolidated; FY25-26 EBITDA includes the stripping activity credit, as in earlier years: see COALINDIA.patch.js), GAM Research' };
const cfo = sum('cfo', 'FY21', 'FY26'), capex = sum('capex', 'FY21', 'FY26'), divs = sum('dividendsPaid', 'FY21', 'FY26');

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'A windfall in FY23-24, a slow fade since: EBITDA ₹47,971 cr at the peak, ₹41,243 cr in FY26',
  blocks: [
    { p: `Coal India's revenue was ₹77,861 cr in FY16 and ₹1,44,762 cr in FY24 on the old basis (net of statutory levies). From FY25 the accounts show levies that Coal India collects as principal (royalty-linked charges, cesses, transport and evacuation recoveries) inside revenue, after an auditor and C&AG observation: FY25 was restated to ₹1,69,177 cr and FY26 was ₹1,68,400 cr. About ₹48,300 cr of FY26 revenue (₹650 a tonne) is such pass-through charges, which also sit in costs, so the EBITDA margin on the new basis (24.5% in FY26) is not comparable with the 32-33% of FY23-24. EBITDA tells the real story: ₹18,628 cr in FY21, ₹44,232 cr in FY23 and ₹47,971 cr in FY24, when e-auction prices ran 228% and 99% above notified prices after the 2022 global coal spike, then ₹47,205 cr (FY25) and ₹41,243 cr (FY26) as premiums fell to 69% and 57% and volumes slipped. Net profit peaked at ₹37,402 cr (EPS ₹60.7) in FY24 and was ₹31,094 cr (EPS ₹50.5) in FY26.` },
    { pair: [
      { type: 'column', title: 'EBITDA doubled in FY23 on e-auction prices, and has faded since', unit: 'EBITDA (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'EBITDA', ref: 'fin.ebitda', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'column', title: 'Net profit: ₹37,402 cr peak in FY24, ₹31,094 cr in FY26', unit: 'Net profit, owners (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'column', title: 'Revenue: the FY25 jump is accounting (levies now inside revenue)', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY25 restated; FY24 and earlier net of levies.' },
      { type: 'column', title: 'Other income is now ~29% of pre-tax profit', unit: 'Other income (incl. JV share), % of profit before tax', x: 'fin.labels', from: 'FY16', to: 'FY26', series: [{ name: 'Share of PBT', ref: 'fin.otherIncomeShare', fmt: 'pct0' }], labels: 'all', source: SRC.co },
    ] },
    { callout: '**Our view:** Coal India\'s earnings are set by three things it only partly controls: how much coal India\'s power plants burn (volume), what the Government lets it charge on FSA coal (no general notified-price rise from Apr-2025 to 30-Sep-2026 in our sources) and what traders pay in e-auctions (the swing factor: FY23-24 were a windfall, not a new normal). Costs are sticky: a unionised workforce of 2.12 lakh, contractors paid for overburden removal, diesel and explosives. The FY26 dip was volume (-2.4%), lower e-auction prices and a ₹2,201 cr executive pay-scale provision; a quarter of pre-tax profit now comes from interest, write-backs and tax refunds.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: `Cash machine: ₹${n0(cfo)} cr of operating cash in FY21-26, ₹${n0(divs)} cr paid out as dividends`,
  blocks: [
    { p: `Over FY21-26 Coal India generated ₹${n0(cfo)} cr of operating cash, spent ₹${n0(capex)} cr on fixed assets (Screener cash-flow basis; the company's own capex measure, which adds land, rehabilitation and JV equity, was ₹21,776 cr in FY25 and ₹19,607 cr in FY26) and paid ₹${n0(divs)} cr of dividends, about two-thirds of it to the Government. Cash and bank balances still rose, from ₹17,310 cr (Mar-21) to ₹52,574 cr (Mar-26). Capex targets are now ₹16,000-16,500 cr a year (FY27 ₹16,500 cr) on evacuation (rail sidings, first-mile connectivity), washeries, land and diversification (solar, gasification with BHEL and GAIL, fertiliser JVs, critical minerals). Returns are very high on old, depreciated assets: ROE of 52% in FY24 and 28% in FY26, falling as cash builds and profits fade.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow swings with working capital; capex is rising', unit: '₹ crore', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: above 60% in FY23-24, 35% in FY26 (Screener basis)', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: RR('ROCE %'), fmt: 'pct0' }], labels: 'all', min: 0, source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore, Screener cash-flow basis)', head: ['', 'FY21-23', 'FY24-26', 'Six years'], rows: [
      ['Cash from operations', n0(sum('cfo', 'FY21', 'FY23')), n0(sum('cfo', 'FY24', 'FY26')), n0(cfo)],
      ['Capex (fixed assets purchased)', n0(sum('capex', 'FY21', 'FY23')), n0(sum('capex', 'FY24', 'FY26')), n0(capex)],
      ['Dividends paid', n0(sum('dividendsPaid', 'FY21', 'FY23')), n0(sum('dividendsPaid', 'FY24', 'FY26')), n0(divs)],
      { hl: true, cells: ['**Left over**', `**${n0(sum('cfo', 'FY21', 'FY23') - sum('capex', 'FY21', 'FY23') - sum('dividendsPaid', 'FY21', 'FY23'))}**`, `**${n0(sum('cfo', 'FY24', 'FY26') - sum('capex', 'FY24', 'FY26') - sum('dividendsPaid', 'FY24', 'FY26'))}**`, `**${n0(cfo - capex - divs)}**`] },
      ['Memo: company capex incl. land, R&R and JV equity', '', '21,776 (FY25) / 19,607 (FY26)', ''],
      ['Memo: OFS proceeds from BCCL (Jan-26) and CMPDI (Mar-26) listings', '', '~1,071 + ~1,840 (to Coal India)', ''],
    ], source: 'Screener.in cash flow (consolidated); AR FY26 annexure 12 (company capex); BCCL and CMPDI offer documents as reported (CMPDI: 10.71 crore shares at up to ₹172)' } },
    { callout: '**The capital question:** the Government wants Coal India to grow towards 1 billion tonnes by FY30 and to diversify (solar 9.5 GW by FY30, a ₹25,000 cr coal-gasification project with BHEL, fertiliser JVs, critical minerals abroad). The core mines earn very high returns; most of the diversification is policy-led and earns less, or nothing yet. We do not value any of it beyond its cost: it sits in capex and investments.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹42,700 cr (₹69 a share), but large provisions for people and mine closure',
  blocks: [
    { p: 'At Mar-2026 Coal India held ₹8,620 cr of cash, ₹43,955 cr of other bank balances (deposits, some earmarked) and ₹4,187 cr of current investments: ₹56,761 cr (~₹92 a share), against ₹14,072 cr of borrowings (mostly BCCL, ECL and rail-project loans, plus ₹251 cr of leases): net cash ~₹42,700 cr. It also holds ₹6,038 cr of JV equity (HURL, Talcher Fertilisers and others) and mine-closure escrow deposits that rose ₹2,251 cr in FY26. Against that sit ₹77,763 cr of provisions (employee benefits and mine closure), ₹19,815 cr of customer advances (e-auction and FSA buyers pay ahead) and contingent liabilities of ₹56,471 cr (Mar-25, CARE). GST on coal rose to 18% in Sep-2025, which lets Coal India use ~₹17,006 cr of accumulated input tax credit: ~₹8,000 cr in FY26 and the rest expected in FY27, extra cash our model does not count.' },
    { pair: [
      { type: 'line', title: 'Receivable days near 30; inventory days rose as stocks built up in FY26', unit: 'Days', x: RL, series: [{ name: 'Inventory days', values: RR('Inventory Days'), fmt: 'num' }, { name: 'Receivable days', values: RR('Debtor Days'), fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: 'Cash, bank balances and investments: ₹62,800 cr at Mar-26', unit: 'Cash, bank balances and investments (₹ crore)', x: 'A.labels', from: 'FY16', series: [{ name: 'Cash and investments', ref: 'A.cashAndInvestments', fmt: 'num' }], labels: 'all', source: SRC.co + '. Investments include ₹6,038 cr of JV equity; escrow deposits sit in other assets.' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.7|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings (incl. leases)', '{{A.borrowings.7|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and bank balances', '{{A.cash.7|num}}', '{{A.cash.9|num}}', '{{A.cash.10|num}}', '{{A.cash.11|num}}'],
      ['Investments (incl. JV equity)', '{{A.investments.7|num}}', '{{A.investments.9|num}}', '{{A.investments.10|num}}', '{{A.investments.11|num}}'],
      ['Net fixed assets', '{{A.fixedAssets.7|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Capital work in progress', '{{A.cwip.7|num}}', '{{A.cwip.9|num}}', '{{A.cwip.10|num}}', '{{A.cwip.11|num}}'],
      ['Inventories', '{{A.inventories.7|num}}', '{{A.inventories.9|num}}', '{{A.inventories.10|num}}', '{{A.inventories.11|num}}'],
      ['Trade receivables', '{{A.receivables.7|num}}', '{{A.receivables.9|num}}', '{{A.receivables.10|num}}', '{{A.receivables.11|num}}'],
      ['Other liabilities (provisions, advances, payables)', '{{A.otherLiab.7|num}}', '{{A.otherLiab.9|num}}', '{{A.otherLiab.10|num}}', '{{A.otherLiab.11|num}}'],
    ], source: SRC.co + '; AR FY26 (provisions ₹77,763 cr at Mar-26).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: Government 61.1% after the May-2026 OFS; LIC ~11%; foreign funds 10.4%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign funds jumped to 10.4% in Jun-2026 as they bought the OFS', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Government: 63.13% for three years, 61.13% after the May-2026 OFS', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoter (Government)', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 55, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue (FY25 on: levies collected as principal included)', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (incl. stripping activity credit)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
      { key: 'dep', name: 'Depreciation, amortisation and impairment' },
      { key: 'otherIncome', name: 'Other income (incl. JV share)', flag: { type: 'pct', th: 30 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 20 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (as reported by 30-Sep-2026)', rows: [
      { key: 'sales', name: 'Revenue (FY25 quarters on the old net basis)', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income (incl. JV share)' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};

module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  require('./COALINDIA.val').syncMultiples();
  const B = fs.existsSync(path.join(__dirname, 'COALINDIA.research.js')) ? require('./COALINDIA.research') : null;
  const report = {
    symbol: 'COALINDIA', listing: 'NSE: COALINDIA · BSE: 533278', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Oil, gas & consumable fuels',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
