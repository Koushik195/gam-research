// Authoring source for the Gabriel India initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener; FY19-23 standalone, FY24-25 consolidated as reported,
// FY26 restated for the scheme, Mar-26 balance sheet pro forma for the scheme and Project Jupiter: GABRIEL.patch.js).
// Part B (GABRIEL.research.js + part2-6, shared GABRIEL.ctx.js) adds the research chapters. GABRIEL.ctx.js first syncs the
// entity build, the JV build, the effective tax rate and the derived multiples into assumptions.json.
// Usage: node tools/authoring/GABRIEL.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'GABRIEL', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const STD = JSON.parse(fs.readFileSync(path.join(RD, 'screener-standalone.json'), 'utf8'));
const f0 = v => Math.round(v).toLocaleString('en-IN');
// Cash flows FY19-23 (standalone) and FY24-26 (consolidated, as reported, pre-scheme)
const cfv = (par, item, y) => (y <= 2023 ? STD : SCR).schedules['cash-flow'][par][item]?.[`Mar ${y}`] || 0;
const cash = yrs => { const s = (par, item) => yrs.reduce((t, y) => t + cfv(par, item, y), 0);
  const cfo = s('Cash from Operating Activity', 'Profit from operations') + s('Cash from Operating Activity', 'Working capital changes') + s('Cash from Operating Activity', 'Direct taxes');
  const capex = -s('Cash from Investing Activity', 'Fixed assets purchased'), div = -s('Cash from Financing Activity', 'Dividends paid');
  return { cfo, capex, div, left: cfo - capex - div }; };
const c1 = cash([2019, 2020, 2021, 2022, 2023]), c2 = cash([2024, 2025, 2026]);
const SRC = { co: 'Screener.in (FY19-23 standalone; FY24-25 consolidated as reported; FY26 restated for the scheme, Q1FY27 results), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue 2.5x in five years on the old business; the scheme then added ~₹580 cr of revenue and ~₹180 cr of profit to FY26',
  blocks: [
    { p: 'Read the history in two parts. **The old Gabriel** (one ride-control company) grew revenue from ₹1,695 cr in FY21 (Covid) to ₹4,667 cr in FY26 as reported, ~22% a year, and lifted its EBITDA margin from 6% to ~9.5% as volumes recovered, two-wheelers premiumised and the sunroof subsidiary (from May-2023) and the Marelli Motherson suspension assets (Chakan-2, from Apr-2025) were added. Reported net profit rose from ₹60 cr to ₹252 cr. **The new Gabriel** is the FY26 the company restated in Jul-2026 for the scheme (pooling of interests): Anchemco\'s fluids and 76% of Anand CY Myutec add ~₹578 cr of revenue (to ₹5,245 cr), and the 25.1% of Dana Anand and 49% of Henkel Anand add ₹158 cr of equity-accounted profit. Restated profit to shareholders was ₹431 cr (reported ₹252 cr) and EPS ₹24.29 on the 17.72 cr post-scheme shares (₹17.55 reported). FY25 and earlier were not restated, so the FY26 step is not growth.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹1,695 cr (FY21) to ₹5,245 cr (FY26 restated), ₹{{F.sales.2|num}} cr by FY29E', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: SRC.co + '; GAM estimates FY27-29E' },
      { type: 'column', title: 'Net profit to shareholders: ₹60 cr (FY21) to ₹431 cr (FY26 restated)', unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY26 as reported: ₹252 cr.' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 6% (FY21-22) to ~9.6%; never above 10%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 4, max: 12, source: SRC.co + '; GAM estimates' },
      { type: 'column', title: 'Other income incl. the JV share: ₹17-26 cr a year before the scheme, ₹171 cr in FY26 restated', unit: 'Other income incl. share of JV profit (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Other income', ref: 'fin.otherIncome', fmt: 'num' }], labels: 'all', source: SRC.co + '. FY26 = other income ₹28.6 cr + JV share ₹157.6 cr − labour-code charge ₹15.3 cr; FY27-29E add HL Mando Anand and HL Klemove.' },
    ] },
    { callout: '**Our view:** the operating business is a decent, low-margin supplier that grows a little faster than vehicle production. What changed is not the factory but the ownership map: by FY28E minority stakes of 25-49% in group JVs and associates contribute ~45% of profit before tax in our model, against none before the scheme. That makes Gabriel part manufacturer, part holding company.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Capital allocation: from self-funded capex to a promoter-group scheme and ₹3,179 cr of stake purchases in fifteen months',
  blocks: [
    { p: `Until 2025 capital allocation was simple: Gabriel funded capex (₹${f0(c1.capex)} cr in FY19-23, ₹${f0(c2.capex)} cr in FY24-26) and dividends (₹${f0(c1.div + c2.div)} cr over eight years) from operating cash flow (₹${f0(c1.cfo)} cr and ₹${f0(c2.cfo)} cr), carried almost no debt and kept surplus cash. Since Jun-2025 it has become the Anand Group's consolidation vehicle. **Project Rise** (scheme, effective 22-May-2026) brought in Anchemco's fluids business and the group's stakes in Dana Anand, Henkel Anand and Anand CY Myutec in exchange for 3.36 cr new shares (19% dilution) issued to the owners of the promoter company. **Project Jupiter** (Jul-Sep 2026) bought the promoter's 28.99% of HL Mando Anand for ₹2,231 cr (1.44 cr new shares at ₹1,305.89 plus ₹350 cr cash) and ~30% of HL Klemove India for US$98.44 mn (~₹948 cr), funded with ₹1,000 cr of 8.15% NCDs.` },
    { exhibit: { type: 'table', title: 'What shareholders gave and got (₹ crore)', head: ['Deal', 'Paid with', 'What came in', 'FY26 profit of the stake', 'Price ÷ profit'], wide: [2], rows: [
      ['Project Rise (scheme, 2026)', '3.36 cr new shares (19% of post-scheme equity)', 'Anchemco fluids (~₹344 cr revenue), 76% of ACYM, 25.1% of Dana Anand, 49% of Henkel Anand', '~₹180 cr (restated PAT ₹431 cr less reported ₹252 cr)', 'At the scheme value of the shares (₹951 on 4-Jul-2025): ~₹3,200 cr ≈ 18x'],
      ['HL Mando Anand 28.99% (Sep-2026)', '1.44 cr shares at ₹1,305.89 (₹1,881 cr) + ₹350 cr cash', 'Brakes, steering, suspension; FY26 revenue ₹5,886 cr', '₹104 cr (28.99% × ₹358 cr)', '21.5x'],
      ['HL Klemove India ~30% (Aug-Sep 2026)', '~₹948 cr cash (75% at closing, 25% within 18 months)', 'ADAS radar/camera maker; FY26 revenue ₹1,049 cr, adj. EBITDA ~₹129 cr', 'n.d. (we assume ~₹21 cr)', '~24x EV/adj. EBITDA (100%)'],
    ], source: 'Scheme and allotment filings (9-Jun-2026, 11-Sep-2026); Q1FY27 results notes; KPMG/BDO valuation report (21-Jul-2026); Q1FY27 call; GAM Research. Scheme value is our illustration, not a company figure.' } },
    { pair: [
      { type: 'column', title: 'Cash from operations vs capex (FY24-26 consolidated, pre-scheme)', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROE: 12-20% before the scheme; ~13-15% after paying for the stakes', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.co + '; GAM estimates. FY26 ROE on the pro forma Mar-26 equity (incl. Jupiter) is understated.' },
    ] },
    { callout: '**The capital question:** both deals were priced by independent valuers and approved by the board, the audit committee and shareholders; the HL Mando Anand stake came at 21.5x earnings, paid largely in Gabriel stock issued at ~54x restated FY26 EPS, so it raised EPS (~9-10% in FY28E in our model). But the deals were chosen and priced by the promoter on both sides of the table, ROE falls from 19-22% (FY24-25) to ~{{F.roe.1|pct}} as the equity base triples, and the 2030 group target (₹50,000 cr revenue) points to more such transactions.' },
  ],
};

// Display pro forma (the model's tables net the new debt into Investments: see GABRIEL.patch.js step 5)
const { PF } = require('./GABRIEL.patch');
const BS0 = Object.fromEntries(Object.entries(SCR.tables['balance-sheet'].rows).map(([k, v]) => [k, v[SCR.tables['balance-sheet'].periods.indexOf('Mar 2026')]]));
const PFBS = { nw: 19.163 + PF.reserves26 + PF.hmaiShares - (19.163 - 14.364), debt: BS0.Borrowings + PF.debtRise + PF.ncd + PF.klemoveDeferred, cash: 203 + PF.ncd - PF.hmaiCash - PF.klemovePaid, stakes: PF.jvBook + PF.hmai + PF.klemove, otherInv: BS0.Investments };
PFBS.netDebt = PFBS.debt - PFBS.cash - PFBS.otherInv;
const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'From net cash to ~₹1,250 cr of net debt: the balance sheet now holds ~₹3,600 cr of JV stakes',
  blocks: [
    { p: `Before the deals Gabriel had almost no debt (₹148 cr incl. leases at Mar-26) and ₹324 cr of cash and investments. Our pro forma Mar-26 balance sheet adds the scheme (restated equity, ₹127 cr of Anchemco and ACYM debt, the Dana and Henkel stakes at ~₹395 cr) and Project Jupiter (₹2,231 cr HL Mando Anand stake, ₹948 cr HL Klemove stake, ₹1,000 cr NCDs, ₹237 cr deferred payment, ₹1,881 cr of new equity). Pro forma: net worth ~₹${f0(PFBS.nw)} cr, borrowings ~₹${f0(PFBS.debt)} cr (incl. the deferred payment), cash ~₹${f0(PFBS.cash)} cr, other investments ₹${f0(PFBS.otherInv)} cr and stakes ~₹${f0(PFBS.stakes)} cr. Net debt excluding the stakes is ~₹${f0(PFBS.netDebt)} cr, ~2.5x FY26 EBITDA and ~1.6x FY26 EBITDA plus the pro forma JV share; CRISIL rates the NCDs AA+/Stable. Management spoke of debt/equity ~1:1; we get ~${(PFBS.debt / PFBS.nw).toFixed(1)}x consolidated because the stakes were largely paid in shares. **Model note:** the engine and the Excel model read Screener's reported borrowings, fixed assets and working capital, so our model books the whole pro forma change against "Investments" (₹{{A.investments.7|num}} cr = stakes less the new net debt plus ~₹330 cr of the scheme's operating assets); net cash plus stakes is the same either way.` },
    { pair: [
      { type: 'line', title: 'Working capital: debtor days ~53, inventory ~43, payables ~78', unit: 'Days', x: 'A.labels', from: 'FY19', series: [{ name: 'Inventory days', ref: 'A.inventoryDays', fmt: 'num' }, { name: 'Receivable days', ref: 'A.debtorDays', fmt: 'num' }, { name: 'Payable days', ref: 'A.payableDays', fmt: 'num' }], labels: 'last', source: 'Screener.in' },
      { type: 'column', title: `Borrowings: under ₹100 cr for years, ~₹${f0(PFBS.debt)} cr pro forma`, unit: 'Borrowings incl. leases (₹ crore)', x: ['Mar-22', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Mar-26 PF'], series: [{ name: 'Borrowings', values: [13, 11, 75, 69, 148, Math.round(PFBS.debt)], fmt: 'num' }], labels: 'all', source: SRC.co + '. Mar-26 PF incl. the NCDs, scheme debt and the deferred HL Klemove payment (GAM).' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22', 'Mar-24', 'Mar-25', 'Mar-26 reported', 'Mar-26 pro forma'], rows: [
      ['Net worth', '{{A.netWorth.3|num}}', '{{A.netWorth.5|num}}', '{{A.netWorth.6|num}}', f0(BS0['Equity Capital'] + BS0.Reserves), f0(PFBS.nw)],
      ['Borrowings (incl. leases)', '{{A.borrowings.3|num}}', '{{A.borrowings.5|num}}', '{{A.borrowings.6|num}}', f0(BS0.Borrowings), f0(PFBS.debt)],
      ['Cash', '{{A.cash.3|num}}', '{{A.cash.5|num}}', '{{A.cash.6|num}}', '203', f0(PFBS.cash)],
      ['Investments (treasury and small stakes)', '{{A.investments.3|num}}', '{{A.investments.5|num}}', '{{A.investments.6|num}}', f0(BS0.Investments), f0(PFBS.otherInv)],
      ['JV / associate stakes (scheme and Jupiter)', '–', '–', '–', '–', f0(PFBS.stakes)],
      ['Net fixed assets', '{{A.fixedAssets.3|num}}', '{{A.fixedAssets.5|num}}', '{{A.fixedAssets.6|num}}', f0(BS0['Fixed Assets']), `${f0(BS0['Fixed Assets'])} + scheme assets`],
    ], source: SRC.co + '. Mar-22 standalone. Pro forma by GAM (restated Mar-26 balance sheet not published by 30-Sep-2026); Dana and Henkel stakes at share of FY26 net worth.' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Anand family now owns ~66%; institutions were diluted from 23% to ~19%',
  blocks: [
    { pair: [
      { type: 'line', title: 'Mutual funds and insurers 16% before the scheme, 12-13% after', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 55% for years, 63.6% after the scheme (Jun-2026)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 0, max: 80, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY19–FY29E (FY19-23 standalone; FY26 restated)', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 150 } },
      { key: 'dep', name: 'Depreciation' },
      { key: 'otherIncome', name: 'Other income incl. share of JV profit (and exceptional items in actual years)', flag: { type: 'pct', th: 50 } },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (to shareholders)', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹; FY26 on 19.16 cr shares)', fmt: 'n2' },
      { key: 'cfo', name: 'Cash from operations' },
      { key: 'capex', name: 'Capex' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (FY26 restated; Q2-Q3FY26 split by GAM)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' },
      { key: 'otherIncome', name: 'Other income incl. JV share' },
      { key: 'interest', name: 'Interest' },
      { key: 'dep', name: 'Depreciation' },
      { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

module.exports = { financials, capital, balance, ownershipBase, statements, RD, c1, c2 };

if (require.main === module) {
  const X = require('./GABRIEL.ctx');
  if (X.syncBuild() || X.syncMultiples()) { console.log('Assumptions changed: run node src/model.js GABRIEL, then this script again.'); process.exit(0); }
  const B = fs.existsSync(path.join(__dirname, 'GABRIEL.research.js')) ? require('./GABRIEL.research') : null;
  const report = {
    symbol: 'GABRIEL', listing: 'NSE: GABRIEL · BSE: 505714', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Automobiles & components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
