// Medanta report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./MEDANTA.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, b, YRS, BL, c1F, c2F, otherF, netBeds, netOcc, netArpob, RENT, preEbitda, preMargin, pl, choice, ar, mosl, shortDate } = X;
const QC = C.clusters;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +26%, EBITDA +26%, Noida nearly breaks even; profit flat only because of a one-off a year ago',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n1(Q1.revenuePriorMn / 10), n1(Q1.revenueMn / 10), pc((Q1.revenueMn / Q1.revenuePriorMn - 1) * 100)],
      ['  of which Noida (total income)', '0', n1(Q1.noidaIncomeMn / 10), ''],
      ['Installed / census beds', `${n0(Q1.totalBedsPrior)} / ${n0(Q1.censusBedsPrior)}`, `${n0(Q1.totalBeds)} / ${n0(Q1.censusBeds)}`, '+22% / +22%'],
      ['Occupancy / ARPOB (₹)', `${Q1.occupancyPriorPct}% / ${n0(Q1.arpobPrior)}`, `${Q1.occupancyPct}% / ${n0(Q1.arpob)}`, '−0.6pp / +5.5%'],
      ['In-patients / out-patient encounters (lakh)', `${n0(Q1.ipPrior)} / ${n1(Q1.opPrior / 1e5)}`, `${n0(Q1.ipVolume)} / ${n1(Q1.opVolume / 1e5)}`, '+28% / +34%'],
      ['EBITDA, company basis (before ESOP, incl. other income)', n1(Q1.ebitdaCoPriorMn / 10), n1(Q1.ebitdaCoMn / 10), pc((Q1.ebitdaCoMn / Q1.ebitdaCoPriorMn - 1) * 100)],
      ['  margin on total income (ex Noida)', `${Q1.ebitdaCoMarginPriorPct}% (24.6%)`, `${Q1.ebitdaCoMarginPct}% (${Q1.ebitdaExNoidaMarginPct}%)`, '−50bp (+120bp)'],
      ['EBITDA, model basis (after ESOP, ex other income; Q1FY26 ex the ₹19.6 cr EPCG reversal)', '227', n0(Q1.screenerEbitdaCr), '+26%'],
      ['Finance cost / depreciation', `${n1(Q1.financePriorMn / 10)} / ${n1(Q1.depPriorMn / 10)}`, `${n1(Q1.financeMn / 10)} / ${n1(Q1.depMn / 10)}`, '+93% / +53%'],
      ['Exceptional income', n1(Q1.exceptionalPriorMn / 10), '0', ''],
      ['Profit before tax', n1(Q1.pbtPriorMn / 10), n1(Q1.pbtMn / 10), '+2.5% (+13% ex one-off)'],
      { hl: true, cells: ['**Net profit to owners**', `**${Q1.patOwnersPriorCr}**`, `**${Q1.patOwnersCr}**`, '**flat**'] },
    ], source: 'Q1FY27 presentation (30-Jul-2026) pp. 5-13, 29-30; Q1FY27 call (31-Jul-2026); Screener.in (model-basis EBITDA, profit to owners)' } },
    { bullets: [
      `**Why profit was flat:** Q1FY26 had ₹19.6 cr of exceptional income (EPCG interest reversal); and Noida now carries full depreciation and loan interest (D&A +53%, finance cost +93%). Before the one-off, pre-tax profit grew 13%.`,
      `**Growth quality:** volume-led. Cluster 1 income +10% (in-patients +14%, ARPOB +7%, margin ${QC.c1.Q1FY27.marginPct}%); Lucknow + Patna +28% at a ${QC.c2.Q1FY27.marginExNoidaPct}% margin (in-patient volumes +27% ex Noida); Noida ₹85.5 cr income with a ₹4.9 cr loss (₹23.6 cr in Q4FY26). OPD pharmacy +51%, international patients +23%.`,
      '**Capacity:** 72 beds added (Noida 51, Lucknow 21); 70+ doctors hired, 50+ of them senior; Guwahati scaled up to 650 beds; capex ₹161 cr in the quarter.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-Jul 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: rup(C.guidanceSrc) } },
    { callout: '**Why it matters:** management does not give revenue or margin guidance, but its few specific statements have held (Noida breakeven brought forward; Cluster 1 margin in the 24-25% band; volume growth above 20% in Lucknow and Patna). The Q2FY27 results (due by mid-November 2026) will show whether Noida broke even and whether the Indore cancer unit and Gurugram\'s new operating theatres arrived on time.' },
  ],
};

const AC = C.accounting;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean books, but three EBITDA numbers, grant income and yearly one-offs',
  blocks: [
    { bullets: [
      `**Three EBITDA numbers.** Company EBITDA for FY26 is ₹1,056 cr (23.4% of total income): before the ₹38 cr ESOP cost and including ₹99 cr of other income. Screener (and our model) show ₹930 cr (21.1%) after ESOP and before other income; the AR P&L gives ₹919 cr on that basis (Screener puts ₹11 cr more into finance cost). Brokers use ₹919 cr. Always compare like with like.`,
      `**EPCG grant income in revenue.** Duty saved on imported equipment under the export-promotion scheme is booked as a government grant and released to revenue as export obligations are met: ₹55.8 cr in FY26 (₹16.2 cr in FY25), about 6% of EBITDA, boosted by the licences' transfer after the merger. ₹77.8 cr remains deferred. We assume ₹30 / 25 / 22 cr in FY27-29E.`,
      '**Doctors are partly outside employee cost.** Retainer doctors are paid "retainers and consultants fee" (₹658 cr, 14.9% of revenue) on top of ₹1,096 cr of employee cost; together ~40% of revenue.',
      `**One-offs every year.** FY25: ₹49.9 cr stamp duty on the subsidiary merger. FY26: +₹19.6 cr EPCG interest reversal, +₹16.0 cr stamp duty reversal, −₹36.6 cr Labour Codes charge. Screener folds these into "other income" in its quarterly table, so its quarterly other income swings (−₹27 cr in Q4FY25, −₹15 cr in Q3FY26).`,
      `**Interest capitalisation.** Interest and costs of projects under construction are capitalised; when Noida opened its loan interest and depreciation hit the P&L (finance cost ₹26.7 cr in Q1FY27 vs ₹13.8 cr). The same will happen as each greenfield opens from FY30.`,
      `**Cash conversion.** Operating cash flow was ${Math.round(A.cfoToEbitda[b])}% of model-basis EBITDA in FY26 (${Math.round(A.cfoToEbitda[b - 1])}% in FY25; company: 68% of its EBITDA). Receivable days rose from 24 (FY24) to 34 (FY26) with CGHS and insurer dues; ₹15 cr of receivables were written off in FY26.`,
      '**Other income** was ₹99 cr in FY26 (14% of pre-tax profit): deposit interest ₹73 cr, interest on tax refunds ₹12 cr (one-off), write-backs ₹8 cr. We build it rather than extrapolate it (see Forecasts).',
      '**Audit.** Walker Chandiok & Co LLP (Grant Thornton network), unmodified opinion. Leases are small (₹559 cr; lease payments ₹47 cr a year), so Ind AS 116 barely flatters EBITDA.',
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing suggests aggressive accounting, and disclosure is good (cluster and Noida economics every quarter). We flag AMBER because reported EBITDA mixes in grant income that tripled in FY26, the headline company EBITDA includes other income and excludes ESOP, and a one-off line has appeared in each of the last two years. Read the margin on the after-ESOP, ex-other-income basis.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Dr Naresh Trehan holds ${OH.categoriesPct.promoter}% (Jun-2026), with no pledge reported. The rest of the register is concentrated: Temasek's Dunearn Investments (14.85% at Mar-2026, on the register since 2015), co-founder Sunil Sachdeva (10.79% at Mar-2026; he sold 20 lakh shares, ~0.74%, to HDFC Mutual Fund in May-Jun 2026) and RJ Corp (6.59%) all sit in the "public" category. Mutual funds own ${OH.categoriesPct.mf}% and all domestic institutions ${OH.categoriesPct.dii}% (11.15% in Dec-2023); foreign portfolio investors ${OH.categoriesPct.fii}%. ${rup(OH.peExits)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.named.map(h => [h.name, h.pct + '%', `${h.type} (31-Mar-2026)`]),
    ['Promoter (Jun-2026)', OH.categoriesPct.promoter + '%', 'No pledge reported'],
    ['Mutual funds (Jun-2026)', OH.categoriesPct.mf + '%', 'HDFC MF bought the Sachdeva blocks'],
    ['Foreign portfolio investors (Jun-2026)', OH.categoriesPct.fii + '%', 'Down from 12.9% in Jun-2024'],
  ], source: rup(OH.src) } },
  { callout: '**Our read:** an aligned founder, but with only a third of the company, and ~32% held by three non-promoter blocks (Temasek, the co-founder and RJ Corp). Retail and other corporate holders own only ~8%, so the real free float is thin and any sale by Temasek or the co-founder is a supply event. Carlyle is not an overhang: it sold out in the 2022 IPO.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: founder-led with a professional CEO; generous pay for the founder-surgeon',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Good', 'Walker Chandiok (Grant Thornton); unmodified; cluster and Noida economics disclosed quarterly.', 'No red flags; watch grant income and one-offs.'],
      ['Promoter', 'Good', 'Founder at 33.0%, steady since listing; no pledge.', 'Aligned, but a minority owner.'],
      ['Pay', 'Watch', 'CMD pay 193x the median employee plus ₹22.8 cr as Chief Cardiac Surgeon; KMP short-term pay ₹39.9 cr in FY26 plus ₹11.9 cr of share-based pay.', 'High in absolute terms, though he is also a practising surgeon.'],
      ['Board', 'Adequate', '10 directors, 5 independent (one woman); Lead Independent Director Dr Ravi Gupta.', 'Reasonable for the size.'],
      ['Related parties', 'Minor', 'Small dealings with trusts and entities linked to KMPs (under ₹2 cr); no material RPTs reported.', 'Clean.'],
      ['Capital allocation', 'Watch', '₹4,858 cr of new capex, three of the five greenfields in Delhi and Mumbai; JV with DLF and O&M with a society leave part of the value with partners.', 'Returns on this cycle decide the stock.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26)' },
  ],
};

const g3 = arr => arr.map(v => n0(v));
const gapTxt = (g, x) => { const v = Math.round((g / x - 1) * 100); return `${v >= 0 ? '+' : '−'}${Math.abs(v)}%`; };
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue +25% / +16% / +9%, EPS ~16% a year, then an air pocket before the new hospitals',
  blocks: [
    { p: 'We forecast revenue bottom-up, cluster by cluster (census beds × 365 × occupancy × ARPOB) plus pharmacy, labs and other operating revenue, and run the model on the resulting growth rate (the authoring script checks the build equals model revenue). EBITDA is on Screener\'s basis (after ESOP cost, before other income, post-Ind AS 116); lease liabilities count as debt. Depreciation is 5.0% of gross block, finance cost rises from ₹108 cr to ₹128 cr, tax (net of the small minority loss) 25.5%, payout 3%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Bed build (₹ crore; checked to sum to model revenue)', head: ['', 'FY26 (actual)', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Cluster 1: Gurugram, Indore, Ranchi' },
      ['Census beds / occupancy / ARPOB (₹)', `~1,594 / 61% / 74,493`, ...YRS.map((_, i) => `${n0(BL.cluster1.censusBeds[i])} / ${BL.cluster1.occupancyPct[i]}% / ${n0(BL.cluster1.arpob[i])}`)], ['Hospital revenue', '2,643', ...g3(c1F)],
      { sec: 'Cluster 2: Lucknow, Patna, Noida' },
      ['Census beds / occupancy / ARPOB (₹)', `~1,188 / 60% / 56,500`, ...YRS.map((_, i) => `${n0(BL.cluster2.censusBeds[i])} / ${BL.cluster2.occupancyPct[i]}% / ${n0(BL.cluster2.arpob[i])}`)], ['Hospital revenue', '1,470', ...g3(c2F)],
      { sec: 'Pharmacy, labs, EPCG grants, other' }, ['Revenue', n0(X.other26), ...g3(otherF)],
      ['Memo: network beds / occupancy / ARPOB', `2,737 / 61.6% / 66,550`, ...YRS.map((_, i) => `${n0(netBeds[i])} / ${n1(netOcc[i])}% / ${n0(netArpob[i])}`)],
      ['Memo: Noida income / EBITDA (inside Cluster 2)', '91 / −78', ...YRS.map((_, i) => `${BL.noida.income[i]} / ${BL.noida.ebitda[i]}`)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'Company KPIs (FY26, Q1FY27); GAM estimates (assumptions.json businessLines). FY26 cluster beds derived from bed-days and occupancy; cluster revenues sum to ₹4,113 cr vs ₹4,093 cr for the network because of rounding in the disclosed ARPOBs.' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury: interest on bank deposits', '73.0', '75.6', '69.4', '62.0'],
      ['  basis: 6.2% × average gross cash', '6.2% on ~₹1,181 cr', '₹1,220 cr', '₹1,120 cr', '₹1,000 cr'],
      ['Recurring non-treasury (rent, misc., normal write-backs)', '~8', '8.4', '8.6', '9.0'],
      ['One-offs (tax-refund interest ₹12.2 cr, excess write-backs ~₹5 cr)', '~17', '0', '0', '0'],
      { hl: true, cells: ['**Other income (model)**', '**98.6**', '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: twelve months to Jun-26 (Screener, ex exceptional) / Q1FY27', `100 / ${n1(Q1.otherIncomeMn / 10)}`, '', '', ''],
    ], source: 'AR FY26 note 28; company cash (Mar-25 ₹1,140 cr, Mar-26 ₹1,222 cr); GAM estimates. Built on gross cash because the model\'s net cash is after debt and lease liabilities.' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (after ESOP, ex other income)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (forecasts incl. new leases)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts net of debt and leases)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of bank debt and lease liabilities (₹1,190 cr at Mar-26) in forecasts.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026; EBITDA after ESOP, before other income)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['Revenue (₹ cr): PL / Choice / Anand Rathi', '{{F.sales.0|num}}', `${n0(pl.sales.FY27E)} / ${n0(choice.sales.FY27E)} / ${n0(ar.sales.FY27E)}`, '{{F.sales.1|num}}', `${n0(pl.sales.FY28E)} / ${n0(choice.sales.FY28E)} / ${n0(ar.sales.FY28E)}`],
      ['EBITDA (₹ cr): PL / Choice / Anand Rathi', '{{F.ebitda.0|num}}', `${n0(pl.ebitda.FY27E)} / ${n0(choice.ebitda.FY27E)} / ${n0(ar.ebitda.FY27E)}`, '{{F.ebitda.1|num}}', `${n0(pl.ebitda.FY28E)} / ${n0(choice.ebitda.FY28E)} / ${n0(ar.ebitda.FY28E)}`],
      ['EBITDA margin: PL / Choice', '{{F.ebitdaMargin.0|pct}}', `${n1(pl.ebitda.FY27E / pl.sales.FY27E * 100)}% / ${n1(choice.ebitda.FY27E / choice.sales.FY27E * 100)}%`, '{{F.ebitdaMargin.1|pct}}', `${n1(pl.ebitda.FY28E / pl.sales.FY28E * 100)}% / ${n1(choice.ebitda.FY28E / choice.sales.FY28E * 100)}%`],
      ['EPS (₹): PL / Choice', '{{F.eps.0|n1}}', `${n1(pl.eps.FY27E)} / ${n1(choice.eps.FY27E)}`, '{{F.eps.1|n1}}', `${n1(pl.eps.FY28E)} / ${n1(choice.eps.FY28E)}`],
      ['FY29E: GAM vs PL (revenue / EBITDA / EPS)', '{{F.sales.2|num}} / {{F.ebitda.2|num}} / {{F.eps.2|n1}}', `${n0(pl.sales.FY29E)} / ${n0(pl.ebitda.FY29E)} / ${n1(pl.eps.FY29E)}`, `Motilal Oswal FY28E: revenue ₹${n0(mosl.sales.FY28E)} cr, EBITDA ₹${n0(mosl.ebitda.FY28E)} cr`, ''],
    ], source: `PL note (PDF, ${shortDate(pl.date)}); Choice result update (PDF, ${shortDate(choice.date)}); Anand Rathi and Motilal Oswal via DSIJ (${shortDate(ar.date)}, ${shortDate(mosl.date)}). No consensus dated before 30-Sep-2026 was found.` } },
    { callout: `Our revenue is ${gapTxt(F.sales[0], pl.sales.FY27E)} vs PL for FY27 and ${gapTxt(F.sales[1], pl.sales.FY28E)} for FY28 (Q1FY27 beat the street by 4-12%), but our margin is lower (${n1(F.ebitdaMargin[1])}% vs PL ${n1(pl.ebitda.FY28E / pl.sales.FY28E * 100)}% in FY28E: we assume grants fade and doctors are hired ahead of the new hospitals), so EBITDA is in line for FY27-28 (${gapTxt(F.ebitda[1], pl.ebitda.FY28E)} vs PL in FY28E) and ${gapTxt(F.ebitda[2], pl.ebitda.FY29E)} in FY29E. EPS is lower (${gapTxt(F.eps[1], pl.eps.FY28E)} vs PL in FY28E, ${gapTxt(F.eps[2], pl.eps.FY29E)} in FY29E) because we carry more depreciation and interest for the capex programme. EPS grows ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E and EBITDA ~${Math.round(X.ebitdaCagrFwd)}%.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
