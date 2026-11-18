// Aster DM Quality Care report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./ASTERDM.ctx');
const { rup, C, D, F, A, AS, n0, n1, pc, Q1, FY26, b, YRS, BL, exF, nwF, othF, totBeds, blOcc, mo, ic, pl, shortDate, repFY27, REP } = X;
const PQ = Q1.proForma, QA = Q1.aster, QQ = Q1.qcil;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: pro-forma revenue +20%, EBITDA +30%; management targets a 24-25% margin by FY28-29',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Aster', 'Quality Care', 'Combined (pro-forma)', 'Combined YoY'], rows: [
      ['Revenue', n0(QA.revenue), n0(QQ.revenue), n0(PQ.revenue), pc(PQ.revenueYoYPct)],
      ['Operating EBITDA', n0(QA.opEbitda), n0(QQ.opEbitda), n0(PQ.opEbitda), pc(PQ.opEbitdaYoYPct)],
      ['Operating EBITDA margin', `${QA.opMarginPct}%`, `${QQ.opMarginPct}%`, `${PQ.opMarginPct}%`, '+170bp'],
      ['Operational beds / occupancy', `${n0(QA.opBeds)} / ${QA.occupancyPct}%`, `${n0(QQ.opBeds)} / ${QQ.occupancyPct}%`, `${n0(PQ.opBeds)} / ${PQ.occupancyPct}%`, '+3.6% / +5.1pp'],
      ['ARPP IP (₹)', n0(QA.arppIp), n0(QQ.arppIp), n0(PQ.arppIp), '+10%'],
      ['Net debt excl. leases (Jun-26)', `−${QA.netCash}`, n0(QQ.netDebt), n0(PQ.netDebtExLeases), ''],
      { hl: true, cells: ['**Aster reported: normalised PAT / reported PAT to owners**', `**${QA.normalisedPat} / ${QA.patAttribReported}**`, '–', '–', '**+39% normalised**'] },
    ], source: 'Q1FY27 presentation pp.7-8, 20-22, 27 (5-Aug-2026); Q1FY27 call; Aster reported PAT after ₹114 cr merger costs' } },
    { bullets: [
      '**Volume-led growth:** total patients +13% (2.01 mn), ALOS down 2% to 3.4 days; Kerala +25% (+20% without Kasargod), Karnataka +16% after re-hiring doctors, Andhra & Telangana +33%; QCIL added 50+ doctors.',
      '**Before synergies:** "for merged entity, synergies haven\'t played out" (Varun Khanna); integration started in July 2026.',
      '**One-offs:** Aster booked ₹114 cr of merger costs as an exceptional item, so reported profit to owners was ₹16 cr against ₹125 cr normalised.',
      '**Reporting change:** the company will report one consolidated entity and stop separate QCIL disclosure; geography cuts may return later.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (Nov-2024 to Aug-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome) || '–']), source: C.guidanceSrc } },
    { callout: '**Why it matters:** management delivered the merger on time and both businesses accelerated through FY26. The 24-25% margin target is credible arithmetic (22.2% today plus synergies of ~1.5pp and new-unit breakevens) but leaves little room for the drag from ~1,800 new beds opening in FY27-28. We model 23.6% post-Ind AS (~24% operating) for FY29E.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean at Aster, untested at the merged level',
  blocks: [
    { bullets: [
      '**Pro-forma, not audited.** QCIL\'s numbers are "indicative and subject to statutory audit adjustments"; the merged accounts start in Q2FY27 and pooling of interests may restate comparatives. Our FY26 base uses estimates for QCIL\'s depreciation, interest, tax and minorities (see gaps).',
      '**Three EBITDA definitions.** Company "operating EBITDA" (₹2,013 cr pro-forma FY26) excludes ESOP cost and variable O&M fees on asset-light hospitals (₹45 cr at Aster in FY26); reported post-Ind AS EBITDA is lower (Aster ₹901 cr vs ₹947 cr operating); pre-Ind AS (after rent) lower still (₹788 cr). Rent sits in depreciation and interest under Ind AS 116.',
      '**Minorities matter.** KIMSHEALTH\'s founder keeps 15-20%, several Aster and CARE hospitals have partners; brokers put minorities at 10-13% of EBITDA. We value EBITDA after minorities and model minorities inside the tax line.',
      '**Associates lose money.** The Aster pharmacies are run by Alfaone (~49% owned), which cost ₹37 cr in FY26 and needs Aster\'s support letter.',
      '**Exceptionals every year.** FY25: ₹4,981 cr GCC gain; FY26: ₹38 cr income (minimum-wage reversal) and ₹71 cr expenses (merger costs, CSR on the GCC gain); Q1FY27: ₹114 cr merger costs. We exclude them.',
      `**Cash conversion.** Aster's operating cash flow was ${Math.round(656 / 901 * 100)}% of post-Ind AS EBITDA in FY26 (₹656 cr); receivables are short (~24 days) because cash and insurance dominate.`,
      '**Screener quirks.** Its FY26 net profit (₹427 cr) is before minorities and it books ₹374 cr of preference-share equity reserve as debt; we use profit after minorities and neutralise the ₹374 cr in our net-debt figure (ASTERDM.patch.js).',
    ] },
    { callout: '**Accounting flag: AMBER.** Aster itself reports cleanly (detailed KPIs, both EBITDA bases, Deloitte audit). The amber is for the transition: unaudited QCIL figures, a pooling accounting choice for a merger of two unrelated groups, large minorities and recurring "exceptional" items. The Q2FY27 and FY27 accounts will tell whether pro-forma margins survive audit.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Before the merger the Moopen family owned ${OH.categoriesPct.promoter}% of Aster (Jun-2026), Indian institutions ${OH.categoriesPct.dii}%, foreign investors ${OH.categoriesPct.fii}% and the public ${OH.categoriesPct.public}%. The 35.36 cr shares issued to QCIL holders on 13-Jul-2026 changed the register: the family's stake fell to ~24% and Blackstone, which owned ~68% of QCIL, became a co-promoter with ~30-31%. The first pattern after the allotment (July 2026) shows promoters at ${OH.postMergerJul26Pct.promoter}%, foreign investors ${OH.postMergerJul26Pct.fii}% and Indian institutions ${OH.postMergerJul26Pct.dii}%. TPG received 9.90% and sold ~6.66% within weeks; the Moopen family bought 0.52% at ₹760 on 2-Sep-2026.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: OH.namedHolders.map(r => r.map(rup)), source: OH.src } },
  { callout: '**Our read:** joint control by a founder family and a private-equity owner is workable (both have three board seats; independents are half the board) but it creates a known overhang: Blackstone will sell down over the next few years, as TPG has already started to. The family\'s purchase in September is a useful signal of alignment.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professional CEO from QCIL, a founder chairman and a shared-control agreement',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note) || '']), source: C.managementSrc } },
    { verdicts: [
      ['Audit and accounts', 'Adequate', 'Deloitte (Aster), Price Waterhouse (QCIL); detailed KPIs; pooling accounting for a merger of unrelated groups.', 'Watch the first merged accounts.'],
      ['Control', 'Shared', 'Moopen family ~24% and Blackstone ~31% with three nominees each and reserved matters (equity, debt above 2.5x, M&A, large capex).', 'Stable, but decisions need both.'],
      ['Management depth', 'Strong', 'Varun Khanna (MD & Group CEO), three India CEOs by region, specialty heads; Group CFO from Aster.', 'Better bench than either company alone.'],
      ['Board', 'Adequate', '13 directors, independents at least half; two founder-family executives.', 'In line with practice.'],
      ['Related parties', 'Watch', 'Aster brand shared with the Gulf business (35% Moopen-owned); loss-making pharmacy associate supported by Aster; a director paid by the Mauritius subsidiary.', 'Small amounts, but conflicts to monitor.'],
      ['Minority shareholders', 'Watch', 'TPG pledged and sold; Blackstone a seller over time; promoter purchase in Sep-2026.', 'Supply overhang.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (scheme notice, AR FY26, filings to Sep-2026)' },
  ],
};

const g3 = arr => arr.map(v => n0(v));
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: revenue ~16% a year, EBITDA ~${Math.round(X.ebitdaCagrFwd)}%, EPS ~${Math.round(X.epsCagrFwd)}% as margins improve`,
  blocks: [
    { p: 'We model the merged company on a pro-forma basis (twelve months of QCIL in every year), from a bed build: existing beds × occupancy × implied ARPOB, plus new beds and other income streams; the authoring script checks the build equals model revenue. EBITDA is post-Ind AS (rent excluded), so leases count as debt and new leases are added to capex. Depreciation is 9.0% of the Aster gross block plus new capex (QCIL assets sit outside the gross block in the pro-forma base because the Excel model reads the Aster block from Screener, so the rate is high and D&A conservative), finance cost ₹330-350 cr, tax plus minorities plus associates ~34-35% of PBT, payout 25%. Every assumption and our reasoning is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'table', title: 'Bed build (₹ crore; checked to sum to model revenue)', head: ['', 'FY26 PF', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Existing network (10,559 operational beds)' },
      ['Occupancy / implied ARPOB (₹)', `62% / ~${n0(X.arpob26)}`, ...YRS.map((_, i) => `${BL.existing.occupancyPct[i]}% / ${n0(BL.existing.arpob[i])}`)], ['Revenue', n0(X.hosp26), ...g3(exF)],
      { sec: 'New beds (pipeline, weighted average)' },
      ['Beds / occupancy / ARPOB (₹)', '–', ...YRS.map((_, i) => `${BL.newBeds.opBeds[i]} / ${BL.newBeds.occupancyPct[i]}% / ${n0(BL.newBeds.arpob[i])}`)], ['Revenue', '–', ...g3(nwF)],
      { sec: 'Labs, pharmacy and other' }, ['Revenue', '~232', ...g3(othF)],
      ['Memo: total beds / blended occupancy', '~10,350 / 62%', ...YRS.map((_, i) => `${n0(totBeds[i])} / ${n1(blOcc[i])}%`)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'Company KPIs (FY26, Q1FY27); GAM estimates (assumptions.json businessLines)' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26 PF', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Aster: bank-deposit interest (treasury)', '84.2', '72', '70', '70'],
      ['  basis', '~6.3% on ~₹1,330 cr', '6.3% on ~₹1,150 cr', '~₹1,100 cr', '~₹1,100 cr'],
      ['Aster: lease-deposit interest, grants, rents, fees', '27.0', '28', '25', '25'],
      ['Aster: one-offs (lease derecognition, tax-refund interest)', '14.4', '0', '0', '0'],
      ['Quality Care (GAM)', '20', '20', '20', '20'],
      { hl: true, cells: ['**Other income (model)**', `**${n0(A.otherIncome[b])}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: Aster, twelve months to Jun-26, before exceptionals (Screener) / incl. exceptionals', '129 / −12', '', '', ''],
    ], source: 'AR FY26 note 21 (FY26 Aster ₹125.6 cr); Screener quarterly other income; GAM estimates. Built on gross cash because the model\'s net cash is after debt and leases.' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore; FY26 pro-forma)', from: 'FY26', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'EBITDA (post-Ind AS)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (incl. new leases)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Net cash incl. leases (negative = net debt; FY26: cash less the QCIL treasury plug, before borrowings)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'GAM Research estimates; FY26 pro-forma (ASTERDM.patch.js)' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM', 'Motilal Oswal', 'ICICI Securities', 'Prabhudas Lilladher'], rows: [
      { sec: 'FY28E (full combined year for everyone)' },
      ['Revenue (₹ cr)', '{{F.sales.1|num}}', n0(mo.sales.FY28E), n0(ic.sales.FY28E), n0(pl.sales.FY28E)],
      ['EBITDA, post-Ind AS (₹ cr)', '{{F.ebitda.1|num}}', n0(mo.ebitda.FY28E), n0(ic.ebitda.FY28E), n0(pl.ebitda.FY28E)],
      ['EPS (₹, 87.17 cr shares)', '{{F.eps.1|n1}}', n1(mo.eps.FY28E), n1(ic.eps.FY28E), 'n.c. (Aster-only EPS)'],
      { sec: 'FY27E (reported basis: QCIL from 1-Jul-2026)' },
      ['Revenue (₹ cr)', n0(repFY27.sales), n0(mo.sales.FY27E), n0(ic.sales.FY27E), `${n0(pl.sales.FY27E)} (pro-forma; GAM {{F.sales.0|num}})`],
      ['EBITDA (₹ cr)', n0(repFY27.ebitda), n0(mo.ebitda.FY27E), n0(ic.ebitda.FY27E), `${n0(pl.ebitda.FY27E)} (pro-forma; GAM {{F.ebitda.0|num}})`],
    ], source: `Motilal Oswal (${shortDate(mo.date)}), ICICI Securities retail (${shortDate(ic.date)}), PL (${shortDate(pl.date)}) notes; GAM reported-basis FY27E = pro-forma less QCIL's Q1FY27. No consensus dated before 30-Sep-2026 was found.` } },
    { callout: `Our FY28E revenue is ${Math.round((1 - F.sales[1] / mo.sales.FY28E) * 100)}% below Motilal Oswal and ${Math.round((1 - F.sales[1] / pl.sales.FY28E) * 100)}% below PL, close to ICICI Securities: we assume slower ramps of the new beds. EBITDA is ${Math.round((1 - F.ebitda[1] / mo.ebitda.FY28E) * 100)}% below Motilal Oswal. EPS estimates differ far more (₹9.7 to ₹18.9) because brokers treat QCIL's interest, depreciation and minorities differently; ours (₹{{F.eps.1|n1}}) sits in the middle. EBITDA grows ~${Math.round(X.ebitdaCagrFwd)}% a year over FY26-29E and EPS ~${Math.round(X.epsCagrFwd)}%.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
