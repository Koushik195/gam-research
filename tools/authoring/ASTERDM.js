// Authoring source for the Aster DM Quality Care initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials. Screener history is Aster alone (with the Gulf business
// to FY22); FY26 in the model is PRO-FORMA Aster + Quality Care (ASTERDM.patch.js). Charts here use explicit
// series so the two bases are never mixed silently. Part B (ASTERDM.research.js + part2-6, shared ASTERDM.ctx.js).
// Usage: node tools/authoring/ASTERDM.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'ASTERDM', 'research');
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const CO = JSON.parse(fs.readFileSync(path.join(RD, 'company.json'), 'utf8'));
const SA = SG.annual, SQ = SG.quarterly, F26 = CO.fy26.aster;
const SRC = { co: 'Company presentations (Q4FY26, Q1FY27), Screener.in (Aster consolidated), GAM Research', pf: 'Company pro-forma figures (unaudited; Q1FY27 presentation p.29, Q4FY26 call)' };
const yrs = SA.map(s => s.fy);
const MD = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'ASTERDM.json'), 'utf8'));
const FT = MD.forecast.F.treasury.map(v => Math.round(-v).toLocaleString('en-IN'));
const nd26 = Math.round(MD.annual.borrowings.at(-1) - MD.annual.cash.at(-1) - MD.annual.investments.at(-1)).toLocaleString('en-IN');

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Two businesses of equal size: combined revenue up 13% a year and margins up 2.6pp since FY24',
  blocks: [
    { p: 'The company that trades today did not exist as one set of accounts until July 2026, so we show two histories. **Aster alone** (reported): revenue grew from ₹2,994 cr in FY23 (India only, after the Gulf business was carved out) to ₹4,643 cr in FY26, 16% a year, and its operating EBITDA margin rose from 15.0% to 20.4% as Kerala recovered and Bengaluru matured. **Quality Care (QCIL)**, Blackstone\'s CARE + KIMSHEALTH + Evercare platform, grew from ₹3,615 cr to ₹4,630 cr over FY24-26 with a higher margin (21.5% → 23.0%). **Combined**, revenue grew 13% a year (₹7,314 cr → ₹9,273 cr) and operating EBITDA 20% a year (₹1,396 cr → ₹2,013 cr). These are the company\'s pro-forma figures, unaudited, and QCIL\'s include KIMSHEALTH for the full year although it was bought in Q4FY24.' },
    { pair: [
      { type: 'stacked', title: 'Combined revenue: two halves of almost equal size', unit: 'Revenue (₹ crore), company pro-forma', x: yrs, series: [{ name: 'Aster', values: SA.map(s => s.asterRev), fmt: 'num' }, { name: 'Quality Care', values: SA.map(s => s.qcilRev), fmt: 'num' }], source: SRC.pf },
      { type: 'line', title: 'Operating EBITDA margin: QCIL higher, Aster catching up', unit: 'Operating EBITDA margin (%)', x: yrs, series: [{ name: 'Aster', values: SA.map(s => Math.round(s.asterOpEbitda / s.asterRev * 1000) / 10), fmt: 'pct' }, { name: 'Quality Care', values: SA.map(s => Math.round(s.qcilOpEbitda / s.qcilRev * 1000) / 10), fmt: 'pct' }, { name: 'Combined', values: SA.map(s => s.pfMarginPct), fmt: 'pct' }], labels: 'all', min: 14, max: 25, source: SRC.pf },
    ] },
    { pair: [
      { type: 'column', title: 'Aster alone (reported): India revenue +16% a year since FY23', unit: 'Revenue (₹ crore), India only', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Revenue', values: [2994, 3699, 4138, 4643], fmt: 'num', growth: true }], labels: 'all', source: 'Screener.in (FY23 restated without the Gulf business)' },
      { type: 'hbar', title: 'Doctors and staff cost 40% of revenue; EBITDA is a fifth', unit: 'Aster FY26 costs and operating EBITDA, % of revenue', x: ['Medicines and consumables', 'Doctors (fees and salaries)', 'Employees', 'Other costs', 'Operating EBITDA'], series: [{ name: 'Share', values: [F26.materials, F26.doctors, F26.employees, F26.otherCost, F26.opEbitda].map(v => Math.round(v / F26.revenue * 1000) / 10), fmt: 'pct' }], labels: 'all', highlight: 'Operating EBITDA', source: 'Q4FY26 presentation p.22' },
    ] },
    { exhibit: { type: 'table', title: 'FY26 on two bases: reported Aster vs the pro-forma merged company (₹ crore)', head: ['', 'Aster reported', 'Pro-forma Aster + QCIL', 'Note'], wide: [3], rows: [
      ['Revenue', '4,643', '9,273', 'QCIL ₹4,630 cr (unaudited)'],
      ['EBITDA, post-Ind AS', '901', '1,967', 'QCIL operating EBITDA ₹1,066 cr; company operating basis ₹2,013 cr'],
      ['Depreciation / finance cost', '264 / 123', '564 / 323', 'QCIL ₹300 cr / ₹200 cr: GAM estimates'],
      ['Net profit to shareholders', '388', '779', 'Pro-forma after tax, associates and minorities (GAM)'],
      ['Shares (crore)', '51.81', '87.17', 'After 35.36 cr shares issued to QCIL holders (13-Jul-2026)'],
      { hl: true, cells: ['**EPS (₹)**', '**7.49**', '**8.94**', '**Model base year = pro-forma**'] },
    ], source: 'AR FY26; Q4FY26 and Q1FY27 presentations; ASTERDM.patch.js (pro-forma build); GAM Research' } },
    { callout: '**Our view:** on paper the merger is accretive: QCIL brought 53% of combined FY26 operating EBITDA for 42.7% of the shares, and EPS on the pro-forma basis rises from ₹7.49 to ₹8.94. The catch is quality: QCIL\'s below-EBITDA lines (interest, depreciation, minorities) are not published, so the pro-forma profit relies on our estimates, and the first combined quarterly accounts (Q2FY27, due by mid-November 2026) will test them.' },
  ],
};

const quarters = {
  id: 'quarters', nav: 'Quarterly momentum', kicker: 'Momentum', title: 'Pro-forma quarters: revenue +20% and margin +1.7pp in Q1FY27, before any synergies',
  blocks: [
    { p: 'On a combined basis the business has accelerated through FY26: revenue growth reached 20% in Q1FY27 (₹2,597 cr) and operating EBITDA 30% (₹576 cr), with occupancy up 5.1pp to 64%. Both halves contributed: Aster revenue +22% (Kerala +25% after a weak FY25, Karnataka back to +16% after re-hiring doctors) and QCIL +19% (occupancy 65.4%, +6.6pp). Management stresses that none of this is merger synergy; the two companies ran separately until 1-Jul-2026.' },
    { pair: [
      { type: 'column', title: 'Pro-forma quarterly revenue: ₹2,156 cr → ₹2,597 cr in a year', unit: 'Revenue (₹ crore), company pro-forma', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => q.pfRev), fmt: 'num' }], labels: 'all', source: `${SRC.pf}; Q2-Q3FY26 derived from H1FY26 and FY26 totals` },
      { type: 'line', title: 'Pro-forma operating EBITDA margin: 20.5% → 22.2%', unit: 'Operating EBITDA margin (%)', x: SQ.map(q => q.q), series: [{ name: 'Margin', values: SQ.map(q => q.pfMarginPct), fmt: 'pct' }], labels: 'all', min: 18, max: 25, source: SRC.pf },
    ] },
    { callout: '**Why it matters:** the starting margin (~22%) is already within 2-3pp of the 24-25% target, so the synergies and the new-hospital ramp-ups only have to deliver the last stretch. But Q2FY26 (23.1%) shows quarterly margins swing by 1-2pp with the season and one-offs: do not annualise one good quarter.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'A ₹4,700 cr expansion over 3-4 years, funded from operating cash; returns on tangible capital are good',
  blocks: [
    { p: 'Aster generated ₹656 cr of operating cash in FY26 and spent ₹549 cr on capex (45% on expansion). The merged plan is far bigger: Aster ~₹2,700 cr for ~2,500 beds over four years (₹350 cr already spent), QCIL ~₹2,000 cr for ~1,700 beds over 3-4 years (₹1-1.1 cr a bed; brownfield ₹0.8-1.0 cr, greenfield ₹1.5 cr), plus maintenance capex of ~5% of revenue. We model ₹1,550 / 1,900 / 2,000 cr in FY27-29E including ~₹100 cr a year of new leases. Operating cash (~₹1,500-2,200 cr a year) roughly covers it, so net debt stays near ₹3,000 cr including leases (~1x EBITDA).' },
    { pair: [
      { type: 'column', title: 'Aster: operating cash flow vs capex (reported)', unit: '₹ crore (FY24-25 distorted by the Gulf sale)', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Cash from operations', values: [1834, 158, 425, 656], fmt: 'num' }, { name: 'Capex', values: [848, 806, 357, 478], fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow (FY23-24 include the GCC business; FY26 capex per company ₹549 cr incl. capital advances)' },
      { type: 'column', title: 'Company ROCE on tangible capital: 21-23%', unit: 'Pre-tax ROCE (%), excl. CWIP, revaluation reserve, intangibles', x: ['Aster FY25', 'Aster FY26', 'Combined FY26', 'Combined Q1FY27'], series: [{ name: 'ROCE', values: [19.5, 21.3, 21.1, 22.9], fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Q4FY26 presentation p.23; June-2026 presentation p.11; Q1FY27 presentation p.7' },
    ] },
    { callout: '**The capital question:** company ROCE (21-23%) excludes goodwill and work in progress. On all the capital investors have put in, including the goodwill from QCIL\'s own acquisitions (KIMSHEALTH, Evercare) carried at book under pooling, our ROE is only ~12-14% in FY27-29E. The new beds have to earn well above the ~11.6% cost of capital for the expansion to create value; Kasargod (breakeven in nine months) and Nagercoil (~30% margin in ~18 months) are encouraging examples.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & leases', kicker: 'Balance sheet', title: 'Aster brought net cash, QCIL brought debt: combined net debt ₹1,162 cr before leases',
  blocks: [
    { p: 'At March 2026 Aster had ₹1,327 cr of cash against ₹701 cr of bank debt (net cash ₹626 cr), the remains of the Gulf sale proceeds, and ₹1,518 cr of lease liabilities, mostly on asset-light operate-and-manage hospitals. QCIL had net debt of ₹1,388 cr after paying ~₹672 cr of deferred consideration for its Bangladesh hospitals, plus ~₹270 cr of leases. Combined net debt was ₹763 cr at March 2026 and ₹1,162 cr at June 2026 (₹1,673 cr at QCIL less Aster\'s ₹511 cr net cash), or ~₹2,950 cr including leases: about 1.2x pro-forma EBITDA. Minorities (₹258 cr at Aster, ₹1,518 cr at QCIL at book) are a further claim on the group.' },
    { exhibit: { type: 'table', title: 'Net debt (₹ crore; negative = net cash)', head: ['', 'Mar-25', 'Sep-25', 'Mar-26', 'Jun-26', 'Mar-27E', 'Mar-29E'], rows: [
      ['Aster: bank debt less cash', '−739', '−636', '−626', '−511', '', ''],
      ['QCIL: net debt (excl. leases)', '–', '209 (+672 deferred)', '1,388', '1,673', '', ''],
      { hl: true, cells: ['**Combined, excl. leases**', '–', '**−427 (245 with deferred)**', '**763**', '**1,162**', '', ''] },
      ['Lease liabilities (Aster + QCIL)', '1,376 + n.d.', '1,450 + 267', '1,518 + ~267', '~1,800 (GAM)', '', ''],
      { hl: true, cells: ['**Combined, incl. leases (model)**', '', '', `**${nd26}**`, '', `**${FT[0]}**`, `**${FT[2]}**`] },
    ], source: 'Q4FY26 presentation p.23; scheme notice p.47 (Sep-25); June-2026 presentation p.11; Q1FY27 call; GAM model (pro-forma Mar-26 base and FY27-29E forecasts, leases included)' } },
    { callout: '**Comfortable, not idle:** the Gulf cash is no longer a cushion; it now funds QCIL\'s debt and the expansion. The shareholder agreement caps borrowing at 2.5x net debt/EBITDA without both promoters\' consent; we expect ~1x. The bigger balance-sheet issue is minorities: about 11% of EBITDA belongs to partners in subsidiaries (KIMSHEALTH\'s founder keeps 15-20%), which we deduct in the valuation.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Moopen family and Blackstone control ~54% jointly; funds were diluted by the merger',
  blocks: [
    { pair: [
      { type: 'line', title: 'Before the merger: Indian funds up, foreign funds down', unit: '% of shares (Aster, pre-merger)', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern via Screener.in (to Jun-2026)' },
      { type: 'hbar', title: 'After the merger: two promoters hold ~54%', unit: '% of the 87.17 cr shares, expected post-merger (company, Nov-2024)', x: ['Blackstone', 'Moopen family', 'Aster public', 'Other QCIL holders (TPG etc.)'], series: [{ name: 'Stake', values: [30.7, 24.0, 33.3, 12.0], fmt: 'pct' }], labels: 'all', source: 'June-2026 investor presentation p.14' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { p: 'History is Screener\'s consolidated data for Aster: FY15-FY22 include the Gulf business; FY23-FY25 are India only; **FY26 is pro-forma Aster + Quality Care** (the model\'s base year). Profit is attributable to shareholders (after minorities).' },
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (post-Ind AS)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation (incl. right-of-use)' },
      { key: 'otherIncome', name: 'Other income (incl. exceptionals to FY25)' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 30 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations (to FY26: Aster reported)' }, { key: 'capex', name: 'Capex (forecasts incl. new leases)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Aster alone; QCIL consolidated only from Q2FY27)', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (incl. exceptionals)' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, quarters, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'ASTERDM.research.js')) ? require('./ASTERDM.research') : null;
  const report = {
    symbol: 'ASTERDM', listing: 'NSE: ASTERDM · BSE: 540975', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, quarters, capital, balance, ownershipBase, statements }) : [financials, quarters, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
