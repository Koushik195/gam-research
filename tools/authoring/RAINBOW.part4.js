// Rainbow report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./RAINBOW.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, b, YRS, BL, matF, newF, pipeF, coreBeds, coreOcc, coreArpob, RENT, preEbitda, preMargin, pl, isec, shortDate } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +33%, margin down; management guides ~20% growth and a 24-25% pre-Ind AS margin',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q1.revenuePriorMn / 10), n0(Q1.revenueMn / 10), pc(Q1.revenueYoYPct)],
      ['  of which acquisitions (Warangal, Guwahati)', '–', `~${Q1.acqRevenueCr}`, `organic ~+${Q1.organicGrowthPct}%`],
      ['Capacity / operational beds', `${n0(Q1.capacityBedsPrior)} / ${n0(Q1.operationalBedsPrior)}`, `${n0(Q1.capacityBeds)} / ${n0(Q1.operationalBeds)}`, '+26% / +22%'],
      ['Occupancy / ARPOB (₹)', `${Q1.occupancyPriorPct}% / ${n0(Q1.arpobPrior)}`, `${Q1.occupancyPct}% / ${n0(Q1.arpob)}`, '+1.0pp / +6%'],
      ['IP discharges / deliveries', `${n0(Q1.ipPrior)} / ${n0(Q1.deliveriesPrior)}`, `${n0(Q1.ipDischarges)} / ${n0(Q1.deliveries)}`, '+28% / +23%'],
      ['Professional fees to doctors (% of revenue)', '26.0%', '26.3%', ''],
      ['EBITDA, post-Ind AS', n1(Q1.ebitdaPriorMn / 10), n1(Q1.ebitdaPostIndAsMn / 10), pc(Q1.ebitdaYoYPct)],
      ['  margin', `${Q1.ebitdaMarginPriorPct}%`, `${Q1.ebitdaMarginPct}%`, '−80bp'],
      ['EBITDA, pre-Ind AS (after rent)', n1(Q1.ebitdaPrePriorMn / 10), n1(Q1.ebitdaPreIndAsMn / 10), '+33%'],
      ['  margin', '23.0%', `${Q1.ebitdaPreMarginPct}%`, 'flat'],
      ['Other income', n1(Q1.otherIncomePriorMn / 10), n1(Q1.otherIncomeMn / 10), '−37%'],
      { hl: true, cells: ['**Net profit to owners**', `**${n1(Q1.patAttributablePriorMn / 10)}**`, `**${n1(Q1.patAttributableMn / 10)}**`, '**+13%**'] },
    ], source: 'Q1FY27 presentation (30-Jul-2026) and call (31-Jul-2026); attributable profit per PL (3-Aug-2026)' } },
    { bullets: [
      '**Why profit grew less than revenue:** losses at the new Bengaluru hospitals (HRBR opened 1-May-2026 with 48 operational beds; Electronic City in Q4FY26), doctor fees and other costs rising faster than revenue, and other income down 37% (lower mutual-fund gains after the cash spent on acquisitions).',
      '**Growth quality:** ~9 of the 33 points came from the two acquisitions; organic growth of ~24% came from mature hospitals (occupancy 45.0% vs 42.6%, ARPOB +10% on "pricing as well as case mix") and new hospitals ramping (occupancy 34.4% vs 31.1%).',
      '**The season:** "the monsoon has been delayed... July is too early to draw any conclusions" (CMD); Q2 growth guided "above 20%".',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-Jul 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: rup(C.guidanceSrc) } },
    { callout: '**Why it matters:** management has been right on growth (Q1 beat the ~20% guidance) but the margin guidance has been cut: the pre-Ind AS margin was 26-27% in FY24-26 and the target is now 24-25% for FY27. A new CEO (from Jan-2026) is adding digital marketing, CRM and cluster heads; those costs come before the occupancy they are meant to buy.' },
  ],
};

const AC = C.accounting;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean, but read the Ind AS 116 and minority lines carefully',
  blocks: [
    { bullets: [
      `**Two EBITDA numbers.** Under Ind AS 116 rent is not an expense: FY26 EBITDA was ₹544 cr (32.0%) post-Ind AS but ₹449 cr (26.3%) after ₹96 cr of lease payments. Rent shows up as right-of-use depreciation (₹54 cr) and lease interest (₹78 cr, all of Rainbow's finance cost). Compare margins with other hospitals on the same basis; the street's targets use pre-Ind AS EBITDA (PL) or do not say.`,
      '**Doctor costs sit outside employee cost.** Full-time doctors are paid "professional fees" (₹419 cr, 24.6% of FY26 revenue; 26.3% in Q1FY27), on top of ₹234 cr of employee cost. The two together are ~38% of revenue.',
      '**Minorities.** Since FY26 profit has a minority share (24% of Warangal and Guwahati: ₹3 cr in FY26, ₹2 cr in Q1FY27), and the Malad JV with doctors will add more. We use profit attributable to shareholders throughout.',
      `**One-offs.** FY26 tax included a ₹13 cr deferred-tax credit at Rosewalk (Q4FY26; reported PAT +38%, ~+17% without it); a ₹1.5 cr Labour Code charge; FY22 revenue included ₹96 cr of Covid-vaccine sales.`,
      `**Cash conversion.** Operating cash flow was ${Math.round(A.cfoToEbitda[b])}% of post-Ind AS EBITDA in FY26 (${Math.round(A.cfoToEbitda[b - 1])}% in FY25), but rent (₹96 cr) is paid out of financing cash flow; after rent, management puts conversion at ~72% of pre-Ind AS EBITDA.`,
      '**Other income** was ₹44 cr in FY26 (12% of pre-tax profit), mostly mutual-fund gains and deposit interest: it fell 14% as cash went into acquisitions, and we build it rather than extrapolate it (see Forecasts).',
      '**Audit.** S.R. Batliboi & Associates (EY), unqualified; key audit matters were the accounting for the two acquisitions and a loan impairment test (standalone).',
    ] },
    { callout: '**Accounting flag: GREEN.** Simple, cash-generative and well disclosed (KPIs every quarter, pre- and post-Ind AS EBITDA). The traps are presentational: post-Ind AS margins flatter comparisons with pre-Ind AS peers, and doctor fees must be added to staff costs. Related-party dealings are small (~₹10 cr a year; see Governance).' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The founder, Dr Ramesh Kancharla, and his group own ${OH.categoriesPct.promoter}% (Jun-2026), with no pledge reported; he personally holds 31.0%, co-founder Dr Dinesh Chirla 6.5%, Dr Adarsh Kancharla 6.0% and the Kancharla Family Trust 5.1%. Indian mutual funds and AIFs own ${OH.categoriesPct.mfAif}%, foreign investors ${OH.categoriesPct.fii}% (down from 25.1% in Sep-2024) and the public ${OH.categoriesPct.public}%. ${rup(OH.peExits)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoterVehicles.map(h => [h.name, h.pct + '%', 'Promoter group (31-Mar-2026)']),
    ['All promoters (Jun-2026)', OH.categoriesPct.promoter + '%', 'No pledge reported'],
    ...OH.institutions.map(h => [h.name, h.pct + '%', /Abu Dhabi|Franklin|Vanguard|Ashoka/.test(h.name) ? 'Foreign investor' : 'Domestic fund / insurer']),
  ], source: rup(OH.src) } },
  { callout: '**Our read:** an aligned founder with half the company, and a register that has rotated from foreign to Indian funds (ICICI Prudential, DSP, HDFC, Tata, Axis, Nippon, Motilal Oswal). No PE overhang remains. Free float is ~50%, so liquidity is adequate.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: founder-led, a new professional CEO, small related-party dealings',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'S.R. Batliboi (EY); unqualified; detailed KPIs and both EBITDA bases disclosed.', 'No accounting red flags.'],
      ['Promoter', 'Strong', 'Founder group at 49.8%, steady; no pledge reported; founder pay fell 17% in FY26 (₹3.8 cr, 106x median).', 'Aligned, clinician-founder.'],
      ['Management depth', 'Improving', 'Group CEO Abrarali Dalal from Jan-2026; CFO Vikas Maheshwari; regional and project heads added; COO left in FY25.', 'Bandwidth is the constraint for a five-state expansion.'],
      ['Board', 'Moderate', '7 directors, 57% independent (incl. Dr Anil Dhawan, paediatric hepatologist), one woman director.', 'Adequate.'],
      ['Related parties', 'Minor', 'Rent and services to Unimed Healthcare (relative of KMP) ₹8 cr; consultancy to the CMD\'s brother ₹0.6 cr; professional fees to the whole-time director ₹2 cr; rent to sellers of the acquired hospitals.', 'Small relative to ₹1,703 cr revenue.'],
      ['Capital allocation', 'Watch', '₹2,200 cr of new capex mostly in new markets; JV structures with doctors (Malad) and 76% stakes (Warangal, Guwahati) leave value with partners.', 'Returns on the new cycle are the key test.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26)' },
  ],
};

const gapTxt = (g, ...xs) => { const v = xs.filter(Boolean).map(x => Math.round((g / x - 1) * 100)); const lo = Math.min(...v), hi = Math.max(...v); return lo === hi ? `${lo >= 0 ? '+' : '−'}${Math.abs(lo)}%` : `${lo >= 0 ? '+' : '−'}${Math.abs(lo)}% to ${hi >= 0 ? '+' : '−'}${Math.abs(hi)}%`; };
const g3 = arr => arr.map(v => n0(v));
const ak26 = X.AK.at(-1);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue ~20% a year from beds and price; EPS ~16% a year as margins dip',
  blocks: [
    { p: 'We forecast revenue bottom-up, hospital cohort by cohort (beds × days × occupancy × ARPOB) plus each pipeline hospital, and run the model on the resulting growth rate (the authoring script checks the build equals model revenue). EBITDA is on the post-Ind AS basis (rent excluded) because the model\'s history (Screener) is; lease liabilities therefore count as debt, and new leases are added to capex. Depreciation is 6.5% of gross block, lease interest rises with new leases, tax plus minorities is 27.5%, payout 13%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Bed build (₹ crore; checked to sum to model revenue)', head: ['', 'FY26 (network)', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Mature hospitals (1,202 operational beds)' },
      ['Occupancy / ARPOB (₹)', '–', ...YRS.map((_, i) => `${BL.mature.occupancyPct[i]}% / ${n0(BL.mature.arpob[i])}`)], ['Revenue', '–', ...g3(matF)],
      { sec: 'New hospitals (under five years)' },
      ['Operational beds / occupancy / ARPOB (₹)', '–', ...YRS.map((_, i) => `${BL.newUnits.opBeds[i]} / ${BL.newUnits.occupancyPct[i]}% / ${n0(BL.newUnits.arpob[i])}`)], ['Revenue', '–', ...g3(newF)],
      { sec: 'Pipeline hospitals (see Expansion)' }, ['Revenue', '–', ...g3(pipeF)],
      ['Memo: existing network beds / occupancy / ARPOB', `${n0(ak26.opBedsAvg)} / ${ak26.occupancyPct}% / ${n0(ak26.arpob)}`, ...YRS.map((_, i) => `${n0(coreBeds[i])} / ${n1(coreOcc[i])}% / ${n0(coreArpob[i])}`)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'Company KPIs (FY26, Q1FY27); GAM estimates (assumptions.json businessLines)' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury: deposit interest + mutual-fund gains', '38.4', '37.1', '37.5', '38.1'],
      ['  basis: 6.25% × opening cash, deposits and funds', '~6.0% on ~₹645 cr', '₹594 cr', '₹600 cr', '₹610 cr'],
      ['Recurring non-treasury interest (loans, deposits)', '3.6', '3.9', '4.5', '4.9'],
      ['One-offs (asset sale, write-backs, FX)', '1.7', '0', '0', '0'],
      { hl: true, cells: ['**Other income (model)**', '**43.8**', '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: twelve months to Jun-26 (Screener) / Q1FY27', `${n0(A.ttm.otherIncome)} / ${n1(Q1.otherIncomeMn / 10)}`, '', '', ''],
    ], source: 'AR FY26 note 2.21; company cash figures (Mar-26 ₹594 cr, Jun-26 ₹613 cr); GAM estimates. Built on gross cash because the model\'s net cash is after lease liabilities.' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (post-Ind AS)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (forecasts incl. new leases)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts net of lease liabilities)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of lease liabilities (~₹890-1,140 cr) in forecasts.' } },
    { exhibit: { type: 'table', title: 'Pre-Ind AS view (rent deducted) for comparison with the street', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['EBITDA post-Ind AS (model)', n0(A.ebitda[b]), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['Less: rent (lease payments; FY27-29E = GAM estimate)', n0(RENT.FY26), ...YRS.map(y => n0(RENT[y]))],
      { hl: true, cells: ['**EBITDA pre-Ind AS**', `**${n0(A.ebitda[b] - RENT.FY26)}**`, ...preEbitda.map(v => `**${n0(v)}**`)] },
      ['  margin (company FY26: 26.3%)', `${n1((A.ebitda[b] - RENT.FY26) / A.sales[b] * 100)}%`, ...preMargin.map(v => `${n1(v)}%`)],
    ], source: 'AR FY26 note 2.32 (lease payments ₹95.6 cr); GAM estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      [`EPS (₹), Prabhudas Lilladher (${shortDate(pl.date)})`, '{{F.eps.0|n1}}', n1(pl.eps.FY27E), '{{F.eps.1|n1}}', n1(pl.eps.FY28E)],
      ['Revenue (₹ cr), Prabhudas Lilladher / ICICI Securities', '{{F.sales.0|num}}', `${n0(pl.sales.FY27E)} / ${n0(isec.sales.FY27E)}`, '{{F.sales.1|num}}', `${n0(pl.sales.FY28E)} / ${n0(isec.sales.FY28E)}`],
      ['EBITDA (₹ cr), Prabhudas Lilladher (post-Ind AS) / ICICI (basis n.s.)', '{{F.ebitda.0|num}}', `${n0(pl.ebitda.FY27E)} / ${n0(isec.ebitda.FY27E)}`, '{{F.ebitda.1|num}}', `${n0(pl.ebitda.FY28E)} / ${n0(isec.ebitda.FY28E)}`],
      ['EBITDA margin, PL / ICICI', '{{F.ebitdaMargin.0|pct}}', `${n1(pl.ebitda.FY27E / pl.sales.FY27E * 100)}% / ${n1(isec.ebitdaMarginPct.FY27E)}%`, '{{F.ebitdaMargin.1|pct}}', `${n1(pl.ebitda.FY28E / pl.sales.FY28E * 100)}% / ${n1(isec.ebitdaMarginPct.FY28E)}%`],
    ], source: 'PL Q1FY27 note (PDF, 3-Aug-2026); DSIJ summary of the ICICI Securities note (3-Aug-2026). No consensus dated before 30-Sep-2026 was found.' } },
    { callout: `Our revenue is in line with the street (within ${Math.max(...[F.sales[0] / pl.sales.FY27E, F.sales[0] / isec.sales.FY27E, F.sales[1] / pl.sales.FY28E, F.sales[1] / isec.sales.FY28E].map(r => Math.abs(Math.round((r - 1) * 100))))}%); the gap is the margin. We take management's 24-25% pre-Ind AS guidance at face value for FY27 (~30% post) and assume the FY28-29 openings hold it near 30%, while PL assumes ~32% post-Ind AS. So our EPS is ${gapTxt(F.eps[0], pl.eps.FY27E)} vs PL for FY27 and ${gapTxt(F.eps[1], pl.eps.FY28E)} for FY28; EBITDA is between PL and ICICI. EPS still grows ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E and EBITDA ~${Math.round(X.ebitdaCagrFwd)}%.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
