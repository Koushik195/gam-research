// Cipla report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./CIPLA.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, ACC, b, YRS, BL, lines, blTot, fx26, OI, treas26, recur26, oneOff26, netCash26, openCash, oiTreas, yield26, ttmOiCompany, ela, idir, shortDate } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: record revenue, weakest Q1 margin in years; guidance of 18.5-20% kept',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore unless stated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q1.revenuePrior), n0(Q1.revenue), `+${Q1.revenueYoYPct}% (~+${Q1.likeForLikeGrowthPct}% like-for-like)`],
      ['  One India', n0(Q1.indiaPrior), n0(Q1.india), `+${Q1.indiaGrowthPct}%`],
      ['  North America (US$ mn)', Q1.naUsdPrior, Q1.naUsdMn, pc((Q1.naUsdMn / Q1.naUsdPrior - 1) * 100)],
      ['  One Africa / EMEU (US$ mn)', `${Q1.oneAfricaPrior} / ${Q1.emeuPrior}`, `${Q1.oneAfricaUsdMn} / ${Q1.emeuUsdMn}`, '+1% / +5%'],
      ['Gross margin after material cost', `${Q1.grossMarginPriorPct}%`, `${Q1.grossMarginPct}%`, '−630bp'],
      ['R&D (% of revenue)', '432 (6.2%)', `${Q1.rdCr} (${Q1.rdPct}%)`, '+13%'],
      ['EBITDA (excl. other income)', n0(Q1.ebitdaPrior), n0(Q1.ebitda), pc((Q1.ebitda / Q1.ebitdaPrior - 1) * 100)],
      ['  margin', `${Q1.ebitdaMarginPriorPct}%`, `${Q1.ebitdaMarginPct}%`, '−890bp'],
      ['Other income', n0(Q1.otherIncomePrior), n0(Q1.otherIncome), pc((Q1.otherIncome / Q1.otherIncomePrior - 1) * 100)],
      { hl: true, cells: ['**Profit attributable to shareholders**', `**${n0(Q1.patPrior)}**`, `**${n0(Q1.pat)}**`, `**${pc((Q1.pat / Q1.patPrior - 1) * 100)}**`] },
    ], source: 'Q1FY27 presentation and call (23-Jul-2026)' } },
    { bullets: [
      '**Why margins fell so far:** the loss of gRevlimid and lanreotide (both high-margin), war-related freight and sourcing costs (1-2% of revenue), one-off inventory write-offs, PLI incentives not yet accrued, and US plants and staff paid for ahead of launches. Sequentially the margin improved from 15.2% (Q4FY26).',
      '**India carried the quarter:** +12.4% with prescriptions +15.4% (IQVIA), led by respiratory, anti-diabetes (incl. Yurpeak, ~₹80 cr) and cardiac.',
      '**What changed after the call (to 30-Sep-2026):** gAdvair approved (27-Jul); CFO Ashish Adukia handed over to Dinesh Jain; the Pithampur re-inspection (17-25 Aug) ended with seven observations; CARE reaffirmed AAA (10-Sep).',
    ] },
    { exhibit: { type: 'table', title: 'What management said, and what happened (Jan-Jul 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome || '–')]), source: 'Q3FY26, Q4FY26 and Q1FY27 calls and presentations; CARE' } },
    { callout: '**Credibility check:** management kept the FY27 margin range even after a 16.7% quarter, which needs ~19.5-20% in H2. That only works if the launches land on time. In the past year the company lost gRevlimid on schedule but was surprised by lanreotide; its US guidance was cut once (Jan-2026). We take the bottom of the range.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts; watch exceptional items, intangibles and the new revenue presentation',
  blocks: [
    { bullets: [
      `**New revenue presentation (from Apr-2026).** Certain marketing and promotional spend is now deducted from revenue rather than shown as an expense. Q1FY27 growth was 2.3% reported vs ~4% like-for-like, mostly in South Africa. EBITDA is unchanged; the margin is slightly flattered.`,
      `**Exceptional items recur, in different forms.** ${ACC.exceptionals.map(e => `${e.fy}: ${e.item.toLowerCase()} (₹${n0(-e.preTaxCr)} cr)`).join('; ')}. Each is genuinely one-off, so we use EPS before them for the valuation history (see Valuation).`,
      `**Other income is large and partly one-off.** FY26 other income was ₹${n0(OI.total)} cr (16% of pre-tax profit): ₹${n0(treas26)} cr of treasury income (deposit interest and mutual-fund gains), ₹${n0(recur26)} cr of recurring items and ₹${n0(oneOff26)} cr of one-offs (FX gains, litigation settlement, asset-sale gains). Screener nets the ₹276 cr labour-code charge against it (₹606 cr). We build it from its parts (see Forecasts).`,
      '**Intangibles are rising.** Goodwill and intangibles went from ₹4,986 cr to ₹6,850 cr in FY26 as in-licensed brands and products were capitalised; amortisation will rise, and impairments (as with Pulmazole in FY24) are possible.',
      `**Cash conversion.** Operating cash flow was ₹${n0(A.cfo[b])} cr in FY26, ${Math.round(A.cfoToEbitda[b])}% of EBITDA (after tax and working capital); inventory days rose to 252. Free cash flow was only ₹${n0(A.fcfCalc[b])} cr after ₹${n0(A.capex[b])} cr of capex.`,
      '**Contingent liability.** NPPA (drug-price regulator) overcharging claims since 1998: ₹2,011 cr (₹863 cr principal plus interest) under litigation, not provided (CARE). It is ~₹25 a share; we do not deduct it, but it is a tail risk.',
      '**Minorities.** Small (a ₹17 cr loss absorbed in FY26). We use profit attributable to shareholders throughout (patch to Screener\'s net-profit row).',
      '**Audit.** Walker Chandiok & Co (Grant Thornton Bharat), unqualified opinion for FY26.',
    ] },
    { callout: '**Accounting flag: GREEN.** Simple and well disclosed: business-wise revenue every quarter, R&D expensed (7% of revenue), net cash. The traps are presentational: other income and exceptional items move reported EPS by 3-6% a year, and the revenue presentation changed in FY27.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Hamied family owns ${OH.categoriesPct.promoter}% (Jun-2026), with no pledge: Dr Y K Hamied ${OH.promoters[0].pct}%, Sophie Ahmed ${OH.promoters[1].pct}%, M K Hamied ${OH.promoters[2].pct}% and Kamil Hamied ${OH.promoters[3].pct}%. Two family branches sold in 2024: 2.53% in May (Shirin, Rumana and Samina Hamied and Okasa Pharma) and 1.72% in Nov-Dec (Samina and Rumana Hamied's full exit). Indian mutual funds own ${OH.categoriesPct.mf}% and insurers ${OH.categoriesPct.insurance}% (mostly LIC); foreign investors ${OH.categoriesPct.fpi}%, down from 28.8% in Sep-2024; the public ${OH.categoriesPct.public}%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoters.map(h => [h.name, h.pct + '%', 'Promoter group']),
    { hl: true, cells: ['**All promoters**', `**${OH.categoriesPct.promoter}%**`, 'No pledge'] },
    ...OH.institutions.map(h => [h.name, h.pct + '%', /Norway|Vanguard/.test(h.name) ? 'Foreign investor' : 'Domestic fund / insurer']),
  ], source: 'BSE shareholding pattern (Jun-2026) via Trendlyne; fund houses shown as one line' } },
  { callout: '**Our read:** the family still holds 29% and the chairman alone 18.7%, but the next generation is less involved (Samina Hamied left her executive role in 2024 and sold; Kamil Hamied is a non-executive director) and the company is run by professionals. Sales by family members could recur; there is no sign of a controlling-stake sale after the 2023 talks went nowhere.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professional company in a CEO and CFO transition',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Walker Chandiok (Grant Thornton Bharat), unqualified; quarterly business data; AAA rating.', 'No accounting red flags.'],
      ['Leadership transition', 'Moderate', 'Achin Gupta (CEO from Apr-2026, an insider who ran One India and operations) and Dinesh Jain (CFO from Jul-2026, 30 years at Cipla); Umang Vohra left after ten years.', 'Continuity of strategy, but two top changes inside four months, in the hardest year since FY20.'],
      ['Promoter', 'Moderate', 'Family at 29.2%, no pledge; Chairman Dr Y K Hamied; family members sold 4.3% in 2024 and left executive roles.', 'Aligned, but a slowly loosening grip.'],
      ['Board', 'Strong', '10 directors incl. 5 independent and 2 women; Vice-Chairman and Lead Independent Director P R Ramesh.', 'Adequate independence.'],
      ['Pay', 'Watch', 'Outgoing CEO\'s FY26 pay 682x the median employee, incl. a one-time ₹25 cr long-term incentive; median pay +2.3%.', 'High, but approved by shareholders in 2024.'],
      ['Compliance', 'Weak', 'Pithampur warning letter since Nov-2023 and seven new observations; partner import alert; InvaGen 483.', 'The main governance-type risk for the US plan.'],
      ['Capital allocation', 'Moderate', '₹9,500 cr of net cash, 27% payout, no large deal since FY16; capex and in-licensing stepped up.', 'Prudent, but dilutes returns.'],
      ['Legacy disputes', 'Watch', 'NPPA claims ₹2,011 cr since 1998, not provided.', 'Tail risk (~₹25 a share).'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, CARE, exchange filings)' },
  ],
};

const g3 = arr => arr.map(v => n0(v));
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue ~9% a year, EPS ₹{{F.eps.0|n1}} → ₹{{F.eps.2|n1}}; below the street on the US',
  blocks: [
    { p: `We build revenue by business (India, USA, One Africa, Rest of world, the AR's customer-location split) and run the model on the resulting growth rate; the authoring script checks the build equals model revenue. US revenue is built in dollars and converted at an assumed rupee rate (₹${BL.fx.join(' / ')} per $ for FY27-29E; FY26 ₹${n1(fx26)}). EBITDA margin follows guidance (bottom of the range in FY27). Depreciation is ${AS.depRateOnGrossBlock}% of gross block, capex ₹${AS.capex.map(n0).join(' / ')} cr, tax ${AS.taxRate[0]}%, payout ${AS.payout[0]}%. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet, which recalculates the target price.` },
    { exhibit: { type: 'table', title: 'Business-line build (₹ crore; checked to sum to model revenue)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['One India (growth)', n0(BL.base.india), ...YRS.map((_, i) => `${n0(lines.india[i])} (+${BL.growth.india[i]}%)`)],
      ['USA: US$ mn × ₹/$', `${C.fy26.naUsdMn} × ${n1(fx26)}`, ...YRS.map((_, i) => `${BL.usdMn[i]} × ${BL.fx[i]}`)],
      ['USA (₹ crore)', n0(BL.base.usa), ...g3(lines.usa)],
      ['One Africa (growth)', n0(BL.base.africa), ...YRS.map((_, i) => `${n0(lines.africa[i])} (+${BL.growth.africa[i]}%)`)],
      ['Rest of world: EMEU, API, others (growth)', n0(BL.base.row), ...YRS.map((_, i) => `${n0(lines.row[i])} (+${BL.growth.row[i]}%)`)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      ['  growth', `${n1(A.salesGrowth[b])}%`, '{{F.salesGrowth.0|pct}}', '{{F.salesGrowth.1|pct}}', '{{F.salesGrowth.2|pct}}'],
    ], source: 'AR FY26 note 53; GAM estimates (assumptions.json businessLines)' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury: deposit interest + mutual-fund gains', n0(treas26), ...g3(oiTreas)],
      ['  basis: yield × opening net cash', `${n1(yield26)}% × avg ~10,450`, ...YRS.map((_, i) => `${AS.treasuryYield[i]}% × ${n0(openCash[i])}`)],
      ['Recurring non-treasury (other interest, rent, grants, misc.)', n0(recur26), ...g3(AS.otherIncome)],
      ['One-offs (FX, litigation settlement, asset sales, SEZ interest, insurance, write-backs)', n0(oneOff26), '0', '0', '0'],
      { hl: true, cells: ['**Other income**', `**${n0(OI.total)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: Screener basis (net of exceptional items) / twelve months to Jun-26 before exceptional items', `${n0(A.otherIncome[b])} / ${n0(ttmOiCompany)}`, '', '', ''],
    ], source: `AR FY26 note 32; company net cash ₹${n0(netCash26)} cr at Mar-26 (model opening balance, see assumptions otherTreasury); GAM estimates. FY27E is below FY26 because one-offs are excluded and ₹1,050 cr was paid out as dividend in Q1FY27.` } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation & amortisation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net cash)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is Screener gross cash and investments in actual years and company-basis net cash in forecasts.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Elara / ICICI Direct FY27E', 'GAM FY28E', 'Elara / ICICI Direct FY28E', 'GAM FY29E', 'Elara FY29E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', `${n0(ela.sales.FY27E)} / ${n0(idir.sales.FY27E)}`, '{{F.sales.1|num}}', `${n0(ela.sales.FY28E)} / ${n0(idir.sales.FY28E)}`, '{{F.sales.2|num}}', n0(ela.sales.FY29E)],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', `${n0(ela.ebitda.FY27E)} / ${n0(idir.ebitda.FY27E)}`, '{{F.ebitda.1|num}}', `${n0(ela.ebitda.FY28E)} / ${n0(idir.ebitda.FY28E)}`, '{{F.ebitda.2|num}}', n0(ela.ebitda.FY29E)],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', `${n1(ela.ebitda.FY27E / ela.sales.FY27E * 100)}% / ${n1(idir.ebitda.FY27E / idir.sales.FY27E * 100)}%`, '{{F.ebitdaMargin.1|pct}}', `${n1(ela.ebitda.FY28E / ela.sales.FY28E * 100)}% / ${n1(idir.ebitda.FY28E / idir.sales.FY28E * 100)}%`, '{{F.ebitdaMargin.2|pct}}', `${n1(ela.ebitda.FY29E / ela.sales.FY29E * 100)}%`],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(ela.eps.FY27E)} / ${n1(idir.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(ela.eps.FY28E)} / ${n1(idir.eps.FY28E)}**`, '**{{F.eps.2|n1}}**', `**${n1(ela.eps.FY29E)}**`] },
    ], source: `Elara (${shortDate(ela.date)}, PDF; core EPS lower), ICICI Direct (${shortDate(idir.date)}, PDF); Nomura's FY27E EPS ~₹52.2 (TradeBrains). No consensus dated on or before 30-Sep-2026 was found.` } },
    { callout: `Our revenue is close to the street (within ${Math.max(...[F.sales[0] / ela.sales.FY27E, F.sales[0] / idir.sales.FY27E, F.sales[1] / ela.sales.FY28E, F.sales[1] / idir.sales.FY28E].map(r => Math.abs(Math.round((r - 1) * 100))))}%); the gap is margin. We take 18.5% for FY27 (the street ~18.9%) and 21% for FY28 (ICICI Direct 22%, Elara 23.7% with a one-off first-to-file exclusivity on gDovato). So our FY28E EPS is ${Math.round((1 - F.eps[1] / idir.eps.FY28E) * 100)}% below ICICI Direct and ${Math.round((1 - F.eps[1] / ela.eps.FY28E) * 100)}% below Elara. FY29E EPS (₹${n1(F.eps[2])}) is above Elara's ₹${n1(ela.eps.FY29E)} because we do not assume a one-off exclusivity in FY28 that then disappears.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
