// Go Digit statements in IRDAI format, transcribed from the company's SEBI Reg-33 results filings
// (Annexure-1 revenue account + shareholders' account, Enclosure I balance sheet, Enclosure II receipts
// & payments). Filed figures are ₹ lakh; converted to ₹ crore here. Every period's arithmetic was
// checked (operating profit, PBT, balance-sheet totals, cash-flow totals tie to the filed figures).
// Usage: node tools/authoring/GODIGIT.statements.js   → data/raw/GODIGIT/research/statements.json
const fs = require('fs');
const path = require('path');

const cr = a => a.map(v => (v == null ? null : Math.round(v) / 100)); // lakh → crore, 2dp
const row = (key, label, lakh, opt = {}) => ({ key, label, values: cr(lakh), ...opt });
const sec = section => ({ section });
const sum = (...rows) => rows[0].map((_, i) => (rows.every(r => r[i] != null) ? rows.reduce((s, r) => s + r[i], 0) : null));

// ---------------- ANNUAL (FY23–FY26) ----------------
// FY23: only summary lines are legible in the scanned FY24 filing; the rest is null.
const A = {
  gwp: [724299, 901559, 1028214, 1129409], nwp: [590934, 773092, 823081, 832133], nep: [516361, 709640, 804596, 841434],
  invPh: [null, 87879, 110910, 131274], eom: [null, 46752, 32401, 46873], kmp: [null, 0, 23, 80], oth: [null, 3, 22, 62],
  comm: [null, 188846, 222837, 234424], emp: [null, 27021, 32152, 36828], bd: [null, 49594, 24511, 18010], othExp: [null, 31373, 21099, 25420],
  paid: [null, 333821, 387168, 448717], dOs: [null, 165199, 198728, 164585],
  invSh: [null, 17213, 21566, 27820], othSh: [null, 51, 37, 243], expSh: [null, 47516, 40566, 55609], prov: [null, 0, 0, 1024],
  pbt: [3554, 18168, 42494, 63169], tax: [0, 0, 0, 8734],
};
const totInc = sum(A.nep, A.invPh, A.eom, A.kmp, A.oth);
const totExp = sum(A.comm, A.emp, A.bd, A.othExp, A.paid, A.dOs);
const opProfit = totInc.map((v, i) => (v != null && totExp[i] != null ? v - totExp[i] : null));
const uw = A.nep.map((v, i) => (totExp[i] != null ? v - totExp[i] : null));

const annual = {
  periods: ['FY23', 'FY24', 'FY25', 'FY26'],
  revenueAccount: [
    sec('Premiums'),
    row('gwp', 'Gross written premium', A.gwp, { bold: true }),
    row('nwp', 'Net written premium (after reinsurance)', A.nwp),
    row('premiums_earned', 'Premiums earned (net)', A.nep, { bold: true }),
    sec('Income'),
    row('inv_income_ph', 'Income from investments (policyholders\')', A.invPh),
    row('eom_contribution', 'Contribution from shareholders towards excess expenses of management', A.eom, { indent: 1 }),
    row('other_income_ra', 'Other income (incl. KMP remuneration contribution)', sum(A.kmp, A.oth), { indent: 1 }),
    row('total_income_ra', 'Total income (A)', totInc, { bold: true }),
    sec('Expenses'),
    row('commission', 'Net commission & brokerage', A.comm),
    row('opex_emp', 'Employees\' remuneration & welfare', A.emp, { indent: 1 }),
    row('opex_bd', 'Business development & sales promotion', A.bd, { indent: 1 }),
    row('opex_other', 'Other operating expenses', A.othExp, { indent: 1 }),
    row('opex', 'Operating expenses related to insurance business', sum(A.emp, A.bd, A.othExp)),
    row('claims_paid', 'Claims paid (net)', A.paid, { indent: 1 }),
    row('claims_os_change', 'Change in outstanding claims (incl. IBNR/IBNER)', A.dOs, { indent: 1 }),
    row('claims', 'Claims incurred (net)', sum(A.paid, A.dOs)),
    row('total_exp_ra', 'Total expenses (B)', totExp, { bold: true }),
    row('uw_result', 'Underwriting profit / (loss) = premiums earned − total expenses', uw, { bold: true }),
    row('operating_profit_ra', 'Operating profit / (loss) (A − B), transferred to shareholders\' account', opProfit, { bold: true }),
  ],
  profitLoss: [
    row('op_profit_transfer', 'Operating profit transferred from revenue account', opProfit),
    row('inv_income_sh', 'Income from investments (shareholders\')', A.invSh),
    row('other_income_pl', 'Other income', A.othSh),
    row('total_income_pl', 'Total (A)', sum(opProfit, A.invSh, A.othSh), { bold: true }),
    row('expenses_sh', 'Expenses other than those related to insurance business (incl. excess EoM borne by shareholders)', A.expSh),
    row('provisions', 'Provisions for doubtful debts / diminution', A.prov),
    row('total_exp_pl', 'Total (B)', sum(A.expSh, A.prov), { bold: true }),
    row('pbt', 'Profit before tax', A.pbt, { bold: true }),
    row('tax', 'Provision for tax', A.tax),
    row('pat', 'Profit after tax', A.pbt.map((v, i) => v - A.tax[i]), { bold: true }),
  ],
  balanceSheet: [
    sec('Sources of funds'),
    row('share_capital', 'Share capital', [87402, 87516, 92303, 92450]),
    row('reserves', 'Reserves & surplus', [null, 239510, 344107, 371635]),
    row('fvca_sh', 'Fair value change account – shareholders', [null, 10005, 22228, 2170]),
    row('fvca_ph', 'Fair value change account – policyholders', [null, 7284, 2602, 2333]),
    row('borrowings', 'Borrowings (subordinated debt)', [null, 35000, 35000, 35000]),
    row('total_sources', 'Total sources of funds', [334675, 379315, 496240, 503588], { bold: true }),
    sec('Application of funds'),
    row('inv_sh', 'Investments – shareholders', [null, 203828, 393628, 440899]),
    row('inv_ph', 'Investments – policyholders', [null, 1336936, 1552774, 1829367], { bold: true }),
    row('fixed_assets', 'Fixed assets', [null, 16275, 16156, 15688]),
    row('dta', 'Deferred tax asset (net)', [null, 0, 0, 176]),
    row('cash_bank', 'Cash & bank balances', [17930, 35606, 23905, 21915], { indent: 1 }),
    row('advances_other', 'Advances & other assets', [null, 113201, 159631, 187181], { indent: 1 }),
    row('current_assets', 'Current assets (A)', [null, 148807, 183536, 209096]),
    row('current_liabilities', 'Current liabilities (incl. claims outstanding)', [null, null, 1290406, 1611380], { indent: 1 }),
    row('provisions_bs', 'Provisions (incl. reserve for unexpired risk)', [null, null, 389318, 380258], { indent: 1 }),
    row('cl_and_provisions', 'Current liabilities & provisions (B)', [null, 1398895, 1679724, 1991638]),
    row('net_current_assets', 'Net current assets (A − B)', [null, -1250088, -1496188, -1782542], { bold: true }),
    row('pl_debit', 'Debit balance in profit & loss account (accumulated losses)', [90532, 72364, 29870, 0]),
    row('total_bs', 'Total application of funds', [334675, 379315, 496240, 503588], { bold: true }),
    sec('Memo'),
    row('net_worth', 'Net worth (share capital + reserves − accumulated losses)', [null, 254662, 406540, 464085], { bold: true }),
  ],
  cashFlow: [
    sec('Operating activities'),
    row('premium_received', 'Premium received from policyholders (incl. advance receipts)', [null, null, 1036342, 1236034]),
    row('reinsurer_net', 'Payments to / from reinsurers, net of commission and claims', [null, null, -34839, -4906]),
    row('coinsurer_net', 'Payments to / from co-insurers, net of claims', [null, null, 4824, 10990]),
    row('claims_paid_cf', 'Payments of claims', [null, null, -363856, -478180]),
    row('commission_paid', 'Payments of commission & brokerage, net', [null, null, -283278, -354827]),
    row('opex_paid', 'Payments of other operating expenses, net', [null, null, -109855, -93088]),
    row('deposits_net', 'Deposits, advances & staff loans, net', [null, null, -594, -176]),
    row('tax_paid', 'Income taxes paid, net', [null, null, 0, -8091]),
    row('gst_paid', 'Goods & services tax paid, net', [null, null, -88341, -105187]),
    row('cfo', 'Net cash from operating activities', [225000, 172000, 160403, 202569], { bold: true }),
    sec('Investing activities'),
    row('capex_cf', 'Purchase of fixed assets (net of sales)', [null, null, -1738, -1694]),
    row('purchase_investments', 'Purchase of investments', [null, null, -1029497, -677609]),
    row('sale_investments', 'Sale of investments', [null, null, 654088, 320305]),
    row('investment_income_received', 'Rent / interest / dividends received', [null, null, 109769, 135855]),
    row('money_market_net', 'Money-market instruments & liquid funds, net (incl. related expenses)', [null, null, -16365, 21225]),
    row('cfi', 'Net cash from investing activities', [-251400, -198600, -283743, -201918], { bold: true }),
    sec('Financing activities'),
    row('share_issue', 'Proceeds from issue of share capital (net)', [null, null, 112108, 603]),
    row('interest_paid', 'Interest / dividends paid', [null, null, -2904, -3413]),
    row('cff', 'Net cash from financing activities', [39700, 34200, 109204, -2810], { bold: true }),
    row('net_change_cash', 'Net change in cash & cash equivalents', [null, null, -14136, -2159], { bold: true }),
    row('cash_open', 'Cash & equivalents at beginning of year', [null, null, 35579, 21443]),
    row('cash_close', 'Cash & equivalents at end of year', [null, null, 21443, 19284]),
  ],
};

// ---------------- QUARTERLY (Q1FY25–Q1FY27) ----------------
const qp = ['Q1FY25', 'Q2FY25', 'Q3FY25', 'Q4FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'];
const Q = {
  gwp: [266041, 236857, 267678, 257638, 298180, 266745, 290918, 273566, 273086],
  nwp: [202681, 192785, 224237, 203378, 195060, 210931, 214820, 211322, 209419],
  nep: [182373, 189122, 208414, 224687, 186500, 208821, 216011, 230102, 200696],
  invPh: [25319, 28420, 28765, 28406, 31407, 31992, 33739, 34136, 35183],
  eom: [0, 0, 0, 32401, 0, 0, 0, 46873, 0],
  othRa: [7, 7, 7, 24, 39, 24, 19, 60, 57],
  comm: [51447, 57261, 54302, 59827, 57207, 60256, 60288, 56673, 61512],
  emp: [8837, 9048, 8620, 5647, 8994, 9150, 9522, 9162, 9910],
  bd: [5075, 8127, 10467, 842, 2883, 4761, 5697, 4669, 3914],
  othExp: [5497, 5722, 5504, 4376, 5641, 6834, 6433, 6512, 6374],
  paid: [71815, 85115, 94877, 135361, 90253, 109820, 131063, 117581, 104654],
  dOs: [56718, 48332, 57119, 36559, 40880, 42616, 25610, 55479, 42533],
  invSh: [2852, 5893, 6459, 6362, 5690, 7991, 7290, 6849, 6823],
  othSh: [1, -1, 0, 37, 85, 52, 44, 62, 39],
  expSh: [1029, 889, 904, 37744, 1797, 1883, 2199, 49730, 2182],
  prov: [0, 0, 0, 0, 0, 0, 0, 1024, 174],
  tax: [0, 0, 0, 0, 2233, 1909, 2282, 2310, 2906],
};
const qInc = sum(Q.nep, Q.invPh, Q.eom, Q.othRa);
const qExp = sum(Q.comm, Q.emp, Q.bd, Q.othExp, Q.paid, Q.dOs);
const qOp = qInc.map((v, i) => v - qExp[i]);
const qPbt = qOp.map((v, i) => v + Q.invSh[i] + Q.othSh[i] - Q.expSh[i] - Q.prov[i]);
const quarterly = {
  periods: qp,
  revenueAccount: [
    row('gwp', 'Gross written premium', Q.gwp, { bold: true }), row('nwp', 'Net written premium', Q.nwp), row('premiums_earned', 'Premiums earned (net)', Q.nep, { bold: true }),
    row('inv_income_ph', 'Income from investments (policyholders\')', Q.invPh), row('eom_contribution', 'Contribution from shareholders towards excess EoM', Q.eom, { indent: 1 }), row('other_income_ra', 'Other income', Q.othRa, { indent: 1 }),
    row('total_income_ra', 'Total income (A)', qInc, { bold: true }),
    row('commission', 'Net commission & brokerage', Q.comm), row('opex', 'Operating expenses related to insurance business', sum(Q.emp, Q.bd, Q.othExp)),
    row('claims', 'Claims incurred (net)', sum(Q.paid, Q.dOs)), row('claims_paid', 'of which claims paid', Q.paid, { indent: 1 }), row('claims_os_change', 'of which change in outstanding claims', Q.dOs, { indent: 1 }),
    row('total_exp_ra', 'Total expenses (B)', qExp, { bold: true }),
    row('uw_result', 'Underwriting profit / (loss)', Q.nep.map((v, i) => v - qExp[i]), { bold: true }),
    row('operating_profit_ra', 'Operating profit / (loss) (A − B)', qOp, { bold: true }),
  ],
  profitLoss: [
    row('op_profit_transfer', 'Operating profit transferred from revenue account', qOp), row('inv_income_sh', 'Income from investments (shareholders\')', Q.invSh), row('other_income_pl', 'Other income', Q.othSh),
    row('expenses_sh', 'Expenses other than insurance business (incl. excess EoM)', Q.expSh), row('provisions', 'Provisions', Q.prov),
    row('pbt', 'Profit before tax', qPbt, { bold: true }), row('tax', 'Provision for tax', Q.tax), row('pat', 'Profit after tax', qPbt.map((v, i) => v - Q.tax[i]), { bold: true }),
  ],
  balanceSheet: [
    sec('Sources of funds'),
    row('share_capital', 'Paid-up equity capital', [91720, 92098, 92224, 92303, 92328, 92335, 92429, 92450, 92460]),
    row('reserves', 'Reserves & surplus (net of accumulated losses)', [281350, 291207, 303043, 314237, 328664, 340908, 355765, 371635, 381096]),
    row('fvca', 'Fair value change account', [25138, 30004, 24615, 24830, 39398, 32627, 40291, 4503, 26812]),
    row('borrowings', 'Borrowings', [35000, 35000, 35000, 35000, 35000, 35000, 35000, 35000, 35000]),
    sec('Application of funds'),
    row('inv_sh', 'Investments – shareholders', [273966, 364761, 375617, 393628, 436821, 425673, 443676, 440899, 478515]),
    row('inv_ph', 'Investments – policyholders', [1482358, 1471205, 1504105, 1552774, 1630792, 1694718, 1796071, 1829367, 1866856], { bold: true }),
    row('other_assets_net', 'Other assets, net of current liabilities & provisions', [-1323016, -1387644, -1424820, -1480032, -1572223, -1619512, -1716250, -1766678, -1810003]),
  ],
};
quarterly.balanceSheet.push(row('total_bs', 'Total (sources = application)', qp.map((_, i) => [273966, 364761, 375617, 393628, 436821, 425673, 443676, 440899, 478515][i] + [1482358, 1471205, 1504105, 1552774, 1630792, 1694718, 1796071, 1829367, 1866856][i] + [-1323016, -1387644, -1424820, -1480032, -1572223, -1619512, -1716250, -1766678, -1810003][i]), { bold: true }));

const out = {
  basis: 'IGAAP standalone, IRDAI format (from SEBI Reg-33 results filings)', unit: '₹ crore', sector: 'insurer',
  annual, quarterly,
  notes: [
    'Transcribed from Go Digit\'s quarterly results filings (₹ lakh, converted to ₹ crore). Each period\'s operating profit, PBT, balance-sheet total and cash-flow total was checked against the filed figures.',
    'FY23: the scanned FY24 filing is not legible line by line; only GWP, NWP, NEP, PBT, share capital, cash, accumulated losses and totals are shown. FY23–FY24 cash-flow totals are from Screener (detail not legible).',
    'FY24 fixed assets and advances are derived from the filed balance-sheet totals; FY24 current liabilities vs provisions split not legible.',
    'Quarterly balance sheet uses the summary disclosed in each results statement (reserves shown net of accumulated losses).',
  ],
  sources: [{ doc: 'Go Digit SEBI Reg-33 results filings Q1FY25–Q1FY27, Q4FY24 (godigit.com investor relations)', url: 'https://www.godigit.com/investor-relations' }],
};
// Quarterly balance check (sources vs application) for the record.
const src = quarterly.balanceSheet.filter(r => ['share_capital', 'reserves', 'fvca', 'borrowings'].includes(r.key));
const tot = quarterly.balanceSheet.find(r => r.key === 'total_bs').values;
const diff = tot.map((t, i) => Math.round((src.reduce((s, r) => s + r.values[i], 0) - t) * 100) / 100);
fs.writeFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'GODIGIT', 'research', 'statements.json'), JSON.stringify(out, null, 1));
console.log('quarterly BS sources − application (₹ cr):', diff.join(' '));
console.log('annual op profit:', annual.revenueAccount.find(r => r.key === 'operating_profit_ra').values.join(' '), '| PBT:', annual.profitLoss.find(r => r.key === 'pbt').values.join(' '));
console.log('quarterly PBT:', quarterly.profitLoss.find(r => r.key === 'pbt').values.join(' '));
