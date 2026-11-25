// Coal India report, part 4: Q1FY27 and momentum, earnings quality, ownership, governance, forecasts vs street.
const X = require('./COALINDIA.ctx');
const { C, D, F, A, AS, n0, n1, pc, pc1, b, ttmOI, oiRows, ST } = X;
const Q = C.q1fy27, OI = C.otherIncomeFY26, L = C.liabilities;
const yoy = (a, p) => pc1((a / p - 1) * 100);
const PL = ST.find(s => s.broker === 'PL Capital'), IC = ST.find(s => s.broker.startsWith('ICICI'));

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & momentum', kicker: 'Momentum', title: 'Q1FY27: offtake +4%, EBITDA −4% on diesel and contractors; Jul-Aug offtake stronger',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (consolidated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Production (MT)', n1(Q.productionPrev), n1(Q.production), yoy(Q.production, Q.productionPrev)],
      ['Offtake (MT)', n1(Q.offtakePrev), n1(Q.offtake), yoy(Q.offtake, Q.offtakePrev)],
      ['Revenue from operations (₹ cr)', n0(Q.revenuePrev), n0(Q.revenue), yoy(Q.revenue, Q.revenuePrev)],
      ['EBITDA (₹ cr)', n0(Q.ebitdaPrev), n0(Q.ebitda), yoy(Q.ebitda, Q.ebitdaPrev)],
      ['EBITDA per tonne sold (₹)', '661', '609', '−8%'],
      ['Other income excl. JV (₹ cr)', '1,616', n0(Q.otherIncomeExJv), yoy(Q.otherIncomeExJv, 1616)],
      ['Share of JV profit (₹ cr)', '144', n0(Q.jvShare), yoy(Q.jvShare, 144)],
      { hl: true, cells: ['**Net profit (₹ cr)**', `**${n0(Q.patPrev)}**`, `**${n0(Q.pat)}**`, `**${yoy(Q.pat, Q.patPrev)}**`] },
      ['EPS (₹)', '14.27', n1(Q.eps), ''],
    ], source: 'Q1FY27 deck (27-Jul-2026); Screener.in' } },
    { bullets: [
      `**Volume up, output down by design.** Coal India sold more than it mined: pithead stocks fell 28.9 MT to 101.4 MT, which also cost ₹${n0(Q.inventoryChange)} cr through the inventory line. Production fell 7.5%; offtake rose 3.6%.`,
      '**Costs drove the miss.** Materials +27% (diesel and explosives), contractual +11%, other expenses +14% (mostly the Jharkhand land cess, billed through). PL: EBITDA before the stripping credit was 10% below its estimate; MOSL: EBITDA/t ₹517 on that basis.',
      '**Price mix:** e-auction share rose to 13.4% at ₹2,320/t ex charges (+4%); FSA realisation fell 2.3% to ₹1,435/t on grade mix. Average realisation ex charges was flat at ₹1,595/t.',
      '**Since then:** July offtake +18.4% (64.2 MT, a record month), August +5.5% (60.6 MT); Apr-Aug offtake +6.7% to 322.9 MT while production fell 4.5% to 267.5 MT (monsoon). Thermal generation +9.9% in Apr-Aug and power-plant stocks of ~8 days set up a strong second half for e-auctions.',
    ] },
    { exhibit: { type: 'table', title: 'What management and the company have said (Apr-Sep 2026)', head: ['When', 'Topic', 'What was said'], wide: [2], rows: [
      ['Apr-2026 (CARE)', 'FY27 production', '815 MT target (FY26: 768 MT); capex ₹16,000-16,500 cr a year FY27-29'],
      ['Jul-2026', 'Capex', 'FY27 target ₹16,500 cr; Q1 ₹3,399 cr (land ₹804 cr, evacuation ₹949 cr, machinery ₹819 cr)'],
      ['Jul-2026', 'Dividend', 'First FY27 interim ₹5.50 a share (record date 31-Jul-2026)'],
      ['31-Aug-2026 (AGM)', 'Growth and prices', '~1 bn t by FY30; e-auction premium 43% in Apr-Jul; FY26 hurt by lower realisation and higher depreciation, contractual and statutory costs'],
      ['31-Aug-2026 (AGM)', 'Listings', 'MCL IPO (board approved up to 25% in principle) and an SECL listing this year'],
    ], source: 'CARE 13-Apr-2026; Angel One 28-Jul-2026; Goodreturns 28-Jul-2026; ANI/Devdiscourse and Sahi news, 31-Aug-2026' } },
    { callout: '**Why it matters:** Coal India gives volume targets, not earnings guidance, and it has missed its production targets (FY26: 768 MT against a 937 MT plan in the MoU). The near-term earnings drivers are e-auction premiums in the winter, whether a wage provision starts in Q2/Q3, and diesel. Our FY27E EBITDA of ₹{{F.ebitda.0|num}} cr assumes ~₹${n0(AS.build.ebitdaPerT[0])}/t, below Q1\'s ₹609/t, because Q2 is the weak monsoon quarter (₹397/t in Q2FY26).' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: cash-backed, but restated revenue, capitalised stripping and one-off other income',
  blocks: [
    { bullets: [
      `**Revenue was restated.** From FY25, levies collected "in principal capacity" are inside revenue (auditor emphasis of matter; C&AG comment). Revenue and costs both rose ~₹29,000-32,000 cr; profit did not change. Screener's FY25 quarters remain on the old basis, so quarterly year-on-year revenue growth for FY26 is overstated.`,
      `**Overburden is partly capitalised.** When a mine strips more rock than its plan ratio, the excess cost becomes a "stripping activity asset" (₹${n0(-C.fy26.strippingAdjustment)} cr credited to costs in FY26, ₹1,830 cr in Q1FY27) and is amortised later; the old ratio-variance provision is also being reversed into revenue (₹${n0(C.fy26.strippingProvisionReversal)} cr in FY26). Both lift EBITDA above the cash cost of the year. Screener moved the FY25-26 credit into other income; we put it back in costs (as in earlier years and all quarters) so EBITDA is comparable.`,
      `**Other income is flattered by items that fade.** FY26 other income of ₹${n0(OI.total)} cr included ₹${n0(OI.ofWhichTaxRefundInterest)} cr of interest on income-tax refunds and ₹${n0(OI.provisionsWrittenBack + OI.liabilitiesWrittenBack)} cr of provisions and liabilities written back: ~${Math.round((OI.ofWhichTaxRefundInterest + OI.provisionsWrittenBack + OI.liabilitiesWrittenBack) / C.fy26.pbt * 100)}% of pre-tax profit. We forecast ₹{{F.otherIncome.0|num}} cr in FY27E (incl. JV share) against ₹12,033 cr in FY26 and ₹${n0(ttmOI)} cr in the year to Jun-26.`,
      `**Cash conversion is fine over time.** Cash from operations was ${Math.round(A.cfoToPat[b - 1])}% of net profit in FY25 and ${Math.round(A.cfoToPat[b])}% in FY26 (₹${n0(A.cfo[b])} cr; helped by lower taxes paid and working capital); it swings with customer advances and dues from power utilities.`,
      `**Big provisions and contingencies.** ₹77,763 cr of provisions (employee benefits, mine closure) at Mar-26; contingent liabilities ₹${n0(L.contingentMar25)} cr (Mar-25); the Supreme Court's mineral-tax ruling could cost ~₹${n0(L.scMineralTaxRetro)} cr gross, ~₹${n0(L.scMineralTaxNetOfRecovery)} cr net of recovery from FSA customers (management via CARE). Not in our numbers.`,
    ] },
    { callout: '**Accounting flag: AMBER.** Audited by statutory auditors appointed by the C&AG, unqualified, with emphasis of matter on the levies presentation and the stripping policy. Nothing improper, but reported EBITDA includes capitalised stripping and a provision reversal, other income includes ~₹5,300 cr of refunds and write-backs, and large contingencies sit off the balance sheet. We value on EBITDA as reported (the street does too) and forecast lower other income.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The President of India (Government) owns ${OH.categories.promoters}% (Jun-2026), down from 63.13% after the May-2026 OFS. Foreign portfolio investors own ${OH.categories.fii}%, mutual funds ${OH.categories.mutualFunds}%, insurers and other domestic institutions ${OH.categories.otherDomesticInstitutions}% (LIC alone 11.05% at Mar-26) and individuals ~${n1(OH.categories.public)}% across ${n0(OH.shareholders)} shareholders. Nothing is pledged.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: OH.src } },
  { callout: '**Our read:** the controlling shareholder is also the price-setter, the regulator and the main dividend recipient. That cuts both ways: it guarantees a high payout and a near-monopoly, but it caps prices, steers capital into policy projects and sells stock when the budget needs it (2% in May-2026 at ~10% below market). Expect more OFS and subsidiary IPOs; each is a short-term supply overhang.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: clean books, a Government-run board, policy-led capital allocation',
  blocks: [
    { p: `Management (Mar-2026): ${C.management.filter(m => m.name).map(m => `${m.name}, ${m.role}`).join('; ')}. Directors are appointed by the Ministry of Coal; the CMD changed in Dec-2025.` },
    { verdicts: [
      ['Audit and accounts', 'Moderate', 'Unqualified, with emphasis of matter (levies, stripping); C&AG supplementary audit; FY25 restated', 'No red flags; presentation changes need watching.'],
      ['Board independence', 'Weak', D.governance.board, 'Below the SEBI LODR minimum; minority interests have little voice.'],
      ['Owner as price-setter', 'Watch', 'Notified prices unchanged from Apr-2025 to 30-Sep-2026 while costs rose; diesel cost absorbed in 2026', 'Profit is a policy variable.'],
      ['Capital allocation', 'Moderate', 'High payout (52.5% FY26); diversification into fertiliser, gasification, solar and minerals at Government direction', 'Dividends good; new projects earn less than coal.'],
      ['Disclosure', 'Good', 'Quarterly decks with channel volumes and prices, subsidiary profits and cost bridges', 'Better than most PSUs.'],
      ['Pay and labour', 'Watch', 'Pay set by Government and court orders (₹2,201 cr executive upgrade in Q3FY26); NCWA-XII pending', 'Large, lumpy wage decisions outside management\'s control.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, auditor and C&AG reports); company decks; CARE' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, between PL and ICICI Direct',
  blocks: [
    { p: `Revenue comes from the channel build (coal sold +${AS.build.qtyGrowth.join('% / +')}%, e-auction 13% of volume, FSA price flat then +1%), EBITDA from EBITDA per tonne (₹${AS.build.ebitdaPerT.join(' / ₹')}, including our wage provision), capex of ₹18,000-20,000 cr, depreciation at 7% of gross block, other income built from treasury interest (6.5%), escrow interest, fading tax-refund interest and write-backs, misc income and the JV share (₹${oiRows.map(r => n0(r.total)).join(' / ₹')} cr). Tax 25%; payout 52%. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY22', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (incl. JV share)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates. FY25 revenue restated (levies inside revenue).' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'PL FY27E', 'ICICI FY27E', 'GAM FY28E', 'PL FY28E', 'ICICI FY28E'], rows: [
      ['Coal sold (MT)', n0(X.bld[0].qty), n0(PL.volumeMt.FY27E), n0(IC.volumeMt.FY27E), n0(X.bld[1].qty), n0(PL.volumeMt.FY28E), n0(IC.volumeMt.FY28E)],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(PL.ebitda.FY27E), n0(IC.ebitda.FY27E), '{{F.ebitda.1|num}}', n0(PL.ebitda.FY28E), n0(IC.ebitda.FY28E)],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(PL.eps.FY27E)}**`, `**${n1(IC.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(PL.eps.FY28E)}**`, `**${n1(IC.eps.FY28E)}**`] },
      ['GAM EPS vs broker', '', pc(gap(F.eps[0], PL.eps.FY27E)), pc(gap(F.eps[0], IC.eps.FY27E)), '', pc(gap(F.eps[1], PL.eps.FY28E)), pc(gap(F.eps[1], IC.eps.FY28E))],
    ], source: 'PL result update (28-Jul-2026); ICICI Direct company update (30-Jul-2026). PL volume is dispatch; ICICI\'s is total sales volume.' } },
    { callout: `Our EPS sits between PL's and ICICI Direct's: we have more volume than PL (${n0(X.bld[0].qty)} vs ${PL.volumeMt.FY27E} MT) but a lower EBITDA per tonne than both, because we provide for the wage settlement and expect the Q2 monsoon quarter to be weak. EPS grows only ~${Math.round((Math.pow(F.eps[2] / 50.46, 1 / 3) - 1) * 100)}% a year over FY26-29E: volume growth is offset by costs and fading other income.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
