// KIMS report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./KIMS.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, b, YRS, BL, CLN, clRev, clEb, clEbSum, ebPlug, RENT, preEbitda, preMargin, pl, axis, shortDate, grpBeds, grpOccPct, grpArpob, MIPCT, miProfit } = X;
const cr = mn => n1(mn / 10);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +35%, EBITDA +16%, profit −47%; the QIP cuts interest from Q2',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', cr(Q1.revenuePriorMn), cr(Q1.revenueMn), pc(Q1.revenueYoYPct)],
      ['Operational beds / occupancy', `${n0(Q1.operationalPrior)} / ${Q1.occupancyPriorPct}%`, `${n0(Q1.operationalBeds)} / ${Q1.occupancyPct}%`, '+29% / −2.3pp'],
      ['IP volume / ARPOB (₹)', `${n0(Q1.ipPrior)} / ${n0(Q1.arpobPrior)}`, `${n0(Q1.ipVolume)} / ${n0(Q1.arpob)}`, '+27% / +10%'],
      ['EBITDA before other income (post-Ind AS)', cr(Q1.ebitdaExOiPriorMn), cr(Q1.ebitdaExOiMn), pc((Q1.ebitdaExOiMn / Q1.ebitdaExOiPriorMn - 1) * 100)],
      ['  margin', '22.1%', `${Q1.ebitdaExOiMarginPct}%`, '−320bp'],
      ['EBITDA pre-Ind AS (after rent), incl. other income', cr(Q1.ebitdaPreIndAsPriorMn), cr(Q1.ebitdaPreIndAsMn), pc((Q1.ebitdaPreIndAsMn / Q1.ebitdaPreIndAsPriorMn - 1) * 100)],
      ['Other income', cr(Q1.otherIncomePriorMn), cr(Q1.otherIncomeMn), pc((Q1.otherIncomeMn / Q1.otherIncomePriorMn - 1) * 100)],
      ['Interest / depreciation', `${cr(Q1.interestPriorMn)} / ${cr(Q1.depPriorMn)}`, `${cr(Q1.interestMn)} / ${cr(Q1.depMn)}`, '+156% / +89%'],
      { hl: true, cells: ['**Net profit to owners**', `**${cr(Q1.patAttributablePriorMn)}**`, `**${cr(Q1.patAttributableMn)}**`, `**${pc((Q1.patAttributableMn / Q1.patAttributablePriorMn - 1) * 100)}**`] },
    ], source: 'Q1FY27 presentation (3-Aug-2026) and call (4-Aug-2026); attributable PAT, interest and depreciation per PL (5-Aug-2026)' } },
    { bullets: [
      '**Why profit fell while revenue rose 35%:** interest and depreciation nearly doubled as the new hospitals (and the debt that built them) moved from work in progress into the P&L; the QIP money only arrived on ~24-Jun, so the ₹1,125 cr of debt repaid helps from Q2.',
      '**Telangana:** EBITDA +16% with only 10 days of the new Kondapur hospital; ~200 Secunderabad beds are out of use until the new block is ready (end-CY27). Like-for-like occupancy 61-65% (CEO).',
      '**New clusters:** Bengaluru loss halved to ₹19 cr; Maharashtra ₹11 cr positive (Nagpur strong, Nashik breakeven, Thane −₹7 cr); Kerala ₹7.5 cr positive with Palakkad added.',
      '**Balance sheet:** debt ₹3,250 cr (Mar-26) → ₹2,570 cr (Jun-26) → ~₹2,400 cr (early Aug); cash and funds ₹505 cr at Jun-26.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-Aug 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: rup(C.guidanceSrc) } },
    { callout: '**Why it matters:** management gives no group revenue or margin guidance, only cluster-level comments, and its new-hospital timelines have slipped before (Thane, Electronic City). The FY27 checkpoints are clear: Bengaluru EBITDA-neutral for the year, Thane and Electronic City breakeven, Telangana EBITDA +10-12%, and interest down from Q2.' },
  ],
};

const AC = C.accounting;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: read the EBITDA definitions, the minorities and the related-party Kondapur structure',
  blocks: [
    { bullets: [
      `**Three EBITDA numbers.** The company's "EBITDA" includes other income (FY26 ₹828 cr, 21.1%); Screener's and ours excludes it (₹815 cr, 20.9%); both are post-Ind AS 116, i.e. before rent. Pre-Ind AS (after rent) it was ₹785 cr including other income. Rent is small for KIMS (₹44 cr in FY26) because it owns most hospitals, but rising (₹18 cr in Q1FY27).`,
      `**Doctors sit in other expenses.** Consultancy charges to doctors were ₹1,007 cr (25.8% of revenue) on top of ₹682 cr of employee cost.`,
      `**Capitalisation is unwinding.** In FY26 ₹34 cr of lease interest and ₹21.5 cr of right-of-use depreciation were capitalised into projects; as hospitals open these move into the P&L, which is why profit lags EBITDA in FY27.`,
      `**Minorities.** Ten hospital companies have doctor-partners (stakes 51-91%). Their share of profit fell from ₹30 cr (FY25) to ₹0.6 cr (FY26) because they share Bengaluru and Nashik losses; it rises again as those turn profitable (management: 10-15% of profit long term). We report profit attributable to owners throughout and count minorities at book (₹311 cr) in net debt.`,
      `**O&M accounting.** Kannur and Kollam are consolidated as business combinations (right-of-use assets, contingent consideration); Sangli, Guntur and Kompally earn a fee and sit outside the bed KPIs; call options on O&M hospital companies are fair-valued through P&L (−₹3.8 cr in FY26).`,
      `**One-offs.** FY25 included a ₹12 cr land sale in revenue and EBITDA and a ₹10.9 cr asset-sale gain; FY26 an ₹11.2 cr exceptional loss and a ₹46 cr deferred-tax credit.`,
      `**Cash conversion.** Operating cash flow was ${Math.round(A.cfoToEbitda[b])}% of EBITDA in FY26 (${Math.round(A.cfoToEbitda[b - 1])}% in FY25) as receivables grew faster than revenue (52 days, from 28 in FY22).`,
      '**Related parties.** The new 787-bed Kondapur hospital building belongs to Kondapur Healthcare Ltd, a 40.5% associate that KIMS has also lent ₹68.8 cr (12%); who owns the other 59.5% is not disclosed in what we read. In FY25 KIMS sold land for ₹45 cr to a company of KMP relatives. Small in value, but they deserve scrutiny.',
    ] },
    { callout: '**Accounting flag: AMBER.** Disclosure is good (cluster P&Ls every quarter, unit charts for new hospitals) and the auditor (S.R. Batliboi, EY) is clean. The amber is for structure: three EBITDA definitions in circulation, profit leaking to minorities, capitalised costs now unwinding, an associate-owned flagship building and slow receivables.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The founder's family owns ${OH.categoriesPct.promoter}% (Jun-2026): Dr B. Bhaskara Rao 25.0% directly and through Bluebridge Capital 5.8%, Mrs Rajyasri Bollineni 1.6%, the two sons ~0.1%. The stake was 38.8% until the Jun-2025 quarter, when some promoter-group members were reclassified as public, and fell to 32.5% with the June-2026 QIP; the warrants would lift it to 33.7%. Indian institutions own ${OH.categoriesPct.dii}% (SBI, Axis, HDFC, Invesco, Kotak funds), foreign investors ${OH.categoriesPct.fii}% (BSE basis; the company counts 17.4%), the public ${OH.categoriesPct.public}%. ${rup(OH.peExits)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoterVehicles.map(h => [h.name, h.pct + '%', 'Promoter group (shares at 31-Mar-2026 over 42.0 cr)']),
    ['All promoters (Jun-2026)', OH.categoriesPct.promoter + '%', '1.40 cr shares pledged at Mar-26; 2.80 cr more pledged on 18-Sep-2026'],
    ...OH.institutions.map(h => [h.name, h.pct + '%', /Amansa|LILAC|Nomura/.test(h.name) ? 'Foreign investor' : 'Domestic fund / insurer']),
  ], source: rup(OH.src) } },
  { callout: '**Our read:** an owner-founder with a third of the company, backing the business with ₹600 cr of warrants priced at ₹779, above the 30-Sep price. Against that, the promoters pledged another 6.67% of the company to a debenture trustee on 18-Sep-2026, presumably to fund the warrants: rising pledges are a risk if the share price falls.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a founder-family company with good disclosure and some structures to watch',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and disclosure', 'Strong', 'S.R. Batliboi (EY), unqualified; cluster revenue, EBITDA and KPIs every quarter; new-unit P&L charts.', 'Better than most mid-cap hospital chains.'],
      ['Promoter alignment', 'Moderate', 'Family owns 32.5% and is adding through warrants; but pledges rose in Sep-2026 and the founder\'s two sons are executive directors.', 'Aligned, but a family company.'],
      ['Board', 'Moderate', '9 directors, 5 independent (55%), 2 women; the chairman is also MD.', 'Adequate.'],
      ['Related parties', 'Moderate', 'Associate KHL owns the new Kondapur building and borrows from KIMS; FY25 land sale to a KMP-relatives company; hospital buildings on land leased from promoters.', 'Small amounts; the Kondapur lease terms matter.'],
      ['Capital allocation', 'Weak', 'ROCE fell from 34% (FY22) to 10% (FY26) as ~₹3,100 cr went into capex in three years; the balance sheet needed a QIP and promoter money; management plans more greenfields next year.', 'Growth first, returns later.'],
      ['Minority structure', 'Moderate', 'Doctor-partners in ten subsidiaries; put options to some; buy-outs at full prices (Sunshine ₹150 cr in FY26).', 'Aligns doctors; leaks profit and cash.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, filings to 30-Sep-2026)' },
  ],
};

const g3 = arr => arr.map(v => n0(v));
const gapTxt = (g, x) => { const v = Math.round((g / x - 1) * 100); return `${v >= 0 ? '+' : '−'}${Math.abs(v)}%`; };
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue +32% / +20% / +18%, EBITDA doubling by FY29E as the new beds fill',
  blocks: [
    { p: `We forecast revenue cluster by cluster (average operational beds × 365 × occupancy × ARPOB), add O&M fees less eliminations, and run the model on the resulting growth rate; the authoring script checks the build equals model revenue and that cluster EBITDA reconciles to model EBITDA. EBITDA is post-Ind AS and before other income (the model and Screener basis); lease liabilities and minorities at book therefore count as debt, and new leases are added to capex. Depreciation is 6.25% of gross block, interest falls with the QIP repayments, tax plus minorities is 31-33% of PBT, no dividend. Per-share figures use 42.77 cr fully diluted shares. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet, which recalculates this report's target price.` },
    { exhibit: { type: 'table', title: 'Cluster build (₹ crore; checked to sum to model revenue)', head: ['Cluster', 'Operational beds FY27E / 28E / 29E', 'Occupancy', 'ARPOB (₹)', 'Revenue FY27E / 28E / 29E', 'EBITDA margin'], rows: [
      ...CLN.map(c => { const k = BL.clusters[c]; return [`**${c}**`, k.opBeds.map(n0).join(' / '), k.occupancyPct.map(v => v + '%').join(' / '), k.arpob.map(n0).join(' / '), g3(clRev[c]).join(' / '), k.marginPct.map(v => v + '%').join(' / ')]; }),
      ['O&M fees less eliminations', '', '', '', BL.other.join(' / '), ''],
      ['Memo: group operational beds / occupancy / ARPOB', g3(grpBeds).join(' / '), grpOccPct.map(v => n1(v) + '%').join(' / '), g3(grpArpob).join(' / '), '', ''],
      { hl: true, cells: ['**Revenue (model)**', '', '', '', '**{{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}}**', ''] },
    ], source: 'Company KPIs (FY26, Q1FY27); GAM estimates (assumptions.json businessLines)' } },
    { exhibit: { type: 'table', title: 'Cluster EBITDA to model EBITDA (₹ crore)', head: ['', 'FY26 (company)', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...CLN.map(c => { const k = { Telangana: 'ts', 'Andhra Pradesh': 'ap', Maharashtra: 'mh', Kerala: 'kl', Karnataka: 'ka' }[c]; return [c, n0(X.SA.at(-1)[`${k}Ebitda`]), ...g3(clEb[c])]; }),
      ['Sum of clusters (company basis, incl. other income)', '828', ...g3(clEbSum)],
      ['Less other income in cluster figures, plus O&M fees and classification', '−13', ...g3(ebPlug)],
      { hl: true, cells: ['**EBITDA (model, before other income)**', `**${n0(A.ebitda[b])}**`, '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
      ['  margin', `${n1(A.ebitdaMargin[b])}%`, '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}'],
    ], source: 'Q4FY26 presentation; GAM estimates. FY26 reconciling line = Screener EBITDA ₹815 cr less company EBITDA ₹828 cr.' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Q1FY27 reported (Screener; not split)', '–', '17.0', '–', '–'],
      ['Recurring non-treasury: KHL loan interest, deposits, grants, rent, misc. (Q2-Q4 in FY27E)', '20.6', '15.5', '22.0', '23.0'],
      ['Share of associate KHL\'s profit', '2.6', '2.4', '4.0', '5.0'],
      ['Treasury: deposits and funds (~6.5% on average cash)', '2.7', '12.1', '10.0', '10.0'],
      ['One-offs and exceptional items (call option, Labour Codes, tax-refund interest, write-backs)', '−8.3', '0', '0', '0'],
      { hl: true, cells: ['**Other income (model)**', `**${n0(A.otherIncome[b])}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: twelve months to Jun-26 (Screener) / cash and funds at Jun-26', `${n0(A.ttm.otherIncome)} / 505`, '', '', ''],
    ], source: 'AR FY26 note 2.18; Q1FY27 presentation and call; GAM estimates. Built on gross cash because the model\'s net cash is after borrowings, leases and minorities.' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (post-Ind AS)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹; FY26 pro forma)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (forecasts incl. new leases)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (FY26 pro forma; forecasts net of debt, leases, minorities)', ref: 'fin.treasury' },
    ], source: 'Company, GAM Research estimates. Cash is gross in FY23-25, gross plus QIP/warrant money in FY26 (pro forma) and net of borrowings, lease liabilities and minorities in forecasts.' } },
    { exhibit: { type: 'table', title: 'Pre-Ind AS view (rent deducted) and minorities', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['EBITDA post-Ind AS (model)', n0(A.ebitda[b]), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['Less: rent (Ind AS 116 impact; FY27-29E GAM)', n1(RENT.FY26), ...YRS.map(y => n0(RENT[y]))],
      { hl: true, cells: ['**EBITDA pre-Ind AS**', `**${n0(A.ebitda[b] - RENT.FY26)}**`, ...preEbitda.map(v => `**${n0(v)}**`)] },
      ['  margin', `${n1((A.ebitda[b] - RENT.FY26) / A.sales[b] * 100)}%`, ...preMargin.map(v => `${n1(v)}%`)],
      ['Minorities\' share of profit inside the tax line (GAM)', '0.6', ...miProfit.map(v => n0(v))],
    ], source: 'Q4FY26 and Q1FY27 presentations (Ind AS impact); GAM estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['Revenue (₹ cr), PL / Axis', '{{F.sales.0|num}}', `${n0(pl.sales.FY27E)} / ${n0(axis.sales.FY27E)}`, '{{F.sales.1|num}}', `${n0(pl.sales.FY28E)} / ${n0(axis.sales.FY28E)}`],
      ['EBITDA (₹ cr), PL / Axis', '{{F.ebitda.0|num}}', `${n0(pl.ebitda.FY27E)} / ${n0(axis.ebitda.FY27E)}`, '{{F.ebitda.1|num}}', `${n0(pl.ebitda.FY28E)} / ${n0(axis.ebitda.FY28E)}`],
      ['EBITDA margin, PL / Axis', '{{F.ebitdaMargin.0|pct}}', `${n1(pl.ebitda.FY27E / pl.sales.FY27E * 100)}% / ${n1(axis.ebitda.FY27E / axis.sales.FY27E * 100)}%`, '{{F.ebitdaMargin.1|pct}}', `${n1(pl.ebitda.FY28E / pl.sales.FY28E * 100)}% / ${n1(axis.ebitda.FY28E / axis.sales.FY28E * 100)}%`],
      ['Net profit (₹ cr), PL / Axis', '{{F.pat.0|num}}', `${n0(pl.pat.FY27E)} / ${n0(axis.pat.FY27E)}`, '{{F.pat.1|num}}', `${n0(pl.pat.FY28E)} / ${n0(axis.pat.FY28E)}`],
      ['EPS (₹), PL (42.0 cr shares) / Axis (40.0 cr)', '{{F.eps.0|n1}}', `${n1(pl.eps.FY27E)} / ${n1(axis.eps.FY27E)}`, '{{F.eps.1|n1}}', `${n1(pl.eps.FY28E)} / ${n1(axis.eps.FY28E)}`],
    ], source: `PL Q1FY27 note (${shortDate(pl.date)}); Axis Securities Q1FY27 note (${shortDate(axis.date)}). No consensus dated before 30-Sep-2026 was found.` } },
    { callout: `Our revenue is in line with the street; our EBITDA is ${gapTxt(F.ebitda[1], pl.ebitda.FY28E)} vs PL and ${gapTxt(F.ebitda[1], axis.ebitda.FY28E)} vs Axis for FY28E, because we keep start-up losses going (₹25-30 cr a year) and assume a slower climb at Thane and Electronic City. Our FY28E profit is ${gapTxt(F.pat[1], pl.pat.FY28E)} vs PL: higher depreciation (₹${n0(F.dep[1])} cr vs PL's ₹430 cr) and minorities rising to ~8% of profit. Even so, EBITDA grows ~${Math.round(X.ebitdaCagrFwd)}% a year over FY26-29E and EPS from a pro forma ₹${n1(A.eps[b])} to ₹${n1(F.eps[2])}.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
