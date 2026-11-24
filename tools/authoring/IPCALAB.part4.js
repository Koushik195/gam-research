// Ipca Laboratories report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./IPCALAB.ctx');
const { C, D, F, A, AS, n0, n1, rup, Q1, FY26, UD, YRS, LINES, LBL, BL, build, TB, MIN, oiTreas, oiBuild, TY, MISC, JV, grossCash, OI26, ttmOi, intBuild, UNI_INT, KD, LEASE_INT, LEASE_IPCA, epsU, epsBase, epsRep, minPs, mosl, pl_, idir, emkay, hsie, SHARES } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +21%, EBITDA +50%, profit +72%; guidance raised to 14-16% growth and a ~23% margin',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '2,309', n0(Q1.revenue), `+${Q1.revenueGrowthPct}% (~5pp currency)`],
      ['  Domestic formulations', '961', n0(Q1.domesticFormulations), `+${Q1.domesticGrowthPct}%`],
      ['  Export formulations (branded / generic / institutional)', '450 (124 / 268 / 58)', `${n0(Q1.exportFormulations)} (143 / 340 / 112)`, `+${Q1.exportFormGrowthPct}%`],
      ['  APIs', '326', n0(Q1.api), `+${Q1.apiGrowthPct}%`],
      ['  Subsidiaries (net)', '562', n0(Q1.subsidiaries), `+${Q1.subsidiariesGrowthPct}%`],
      ['Gross margin', '70.0%', `${Q1.grossMarginPct}%`, '+135bp'],
      ['EBITDA (company, ex forex gain)', '425', n0(Q1.ebitdaCompany), '+50%'],
      ['  margin', '18.4%', `${Q1.ebitdaMarginCompanyPct}%`, '+449bp (standalone 26.3%, Unichem 11%)'],
      ['Forex gain in other expenses', '−8', n0(Q1.forexGain), 'Screener\'s EBITDA ₹670 cr (24.0%) includes it'],
      ['Depreciation / finance cost', '100 / 19', `${n0(Q1.dep)} / ${n0(Q1.interest)}`, 'Debt repaid'],
      ['Other income', '33', n0(Q1.otherIncome), ''],
      ['Tax rate / minorities', '29.1% / 1', `${Q1.taxRatePct}% / ${n0(Q1.minorities)}`, 'Unichem profitable again'],
      { hl: true, cells: ['**Profit to shareholders**', '**233**', `**${n0(Q1.patOwners)}**`, `**+${Q1.patGrowthPct}%**`] },
      ['EPS (₹)', '9.19', `${Q1.eps}`, ''],
    ], source: 'Q1FY27 results (13-Aug-2026) and call (14-Aug-2026); PL (16-Aug-2026) and ICICI Direct (17-Aug-2026) result updates; Screener.in' } },
    { bullets: [
      `**A clean beat, with three helpers:** EBITDA was ~20-27% above broker estimates (Emkay, PL). Helpers: the weak rupee (~5pp of growth; partly offset because ~25% of costs are dollar-linked), ₹40 cr of March institutional shipments delayed into April, and a ₹32 cr forex gain (excluded from the company's margin). The stock rose 12% to a record ₹1,945 on 17-Aug-2026.`,
      `**IQVIA:** ${Q1.iqvia}.`,
      `**Exports:** ${Q1.exportsNote}.`,
      `**Unichem:** ${Q1.unichemNote}.`,
      '**Costs:** material cost rose in line with sales; the margin gain came from operating leverage (employee cost −1.5pp and other costs −1.2pp of sales, consolidated). Freight is up 2-3x on some lanes; management says it is in the guidance.',
      `**Balance sheet:** Ipca's own debt ~₹${Q1.grossDebt} cr ("long-term debt"; no working-capital debt), ~₹70 cr by Mar-27; capex ₹700-800 cr in FY27.`,
    ] },
    { exhibit: { type: 'table', title: 'What management guided for FY27 (Jun and Aug-2026)', head: ['Guidance'], rows: C.guidance.fy27.map(g => [g]), source: rup(C.guidance.src) } },
    { callout: '**Why it matters:** two guidance raises in ten weeks (growth 12-13% → 14-16%, margin 22% → 23%) from a management that usually under-promises. The quality of the beat is decent (domestic +13%, generics +27%, Unichem 11% margin) but flattered by currency and timing. The swing factor for the rest of FY27 is cost: freight, solvents and packaging rose sharply from Feb-2026, and generics contracts reprice slowly.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: decent cash conversion, but read the exceptional items, the forex line and the minorities carefully',
  blocks: [
    { bullets: [
      '**Exceptional items every year:** FY24 −₹107.75 cr (Unichem\'s EU fine provision ₹125.62 cr, deal costs ₹39.04 cr, Krebs impairment ₹11.10 cr, less a ₹64.78 cr gain on Optimus shares), FY25 −₹205.05 cr (Krebs impairment ₹118.90 cr, Unichem land impairment ₹86.15 cr), FY26 −₹86.43 cr (EU interest ₹58.26 cr, labour codes ₹45.82 cr, land gain ₹17.65 cr). Screener books them in other income. Most relate to Unichem and Krebs, i.e. to past capital-allocation decisions.',
      `**One-off gains in other income:** FY26 other income of ₹174 cr included ₹60.04 cr on deconsolidating Bayshore and ₹5.31 cr on selling a business; we remove the Bayshore gain from the FY26 base (EPS ₹${n1(epsBase[2026])} vs the company's ₹46.94 before exceptional items).`,
      '**Forex:** gains are booked inside other expenses (₹31.7 cr in Q1FY27), so Screener\'s EBITDA (24.0%) is above the company\'s (22.88%). We forecast neither forex gains nor losses.',
      `**Minorities:** 47.33% of Unichem and 41.12% of Trophic Wellness; ₹42.7 cr in FY26, ~₹21 cr in Q1FY27, rising with Unichem's recovery (our ₹${MIN.join(' / ')} cr). The engine has no minority line, so our tax line carries them.`,
      '**Cash conversion:** operating cash flow was 71-97% of EBITDA in FY22-25 and 57% in FY26 (working capital −₹294 cr, taxes ₹414 cr; Screener). Working capital is structurally heavy (~144 days); Ipca says its own has been flat for two years, Unichem carries US stock in transit.',
      '**Capitalisation:** capex ran at 7-9% of revenue in FY22-26 while D&A was 4-5%; R&D is expensed (₹246 cr, 3.4% of standalone turnover in FY26).',
      '**Auditor and contingencies:** N V C & Associates LLP; contingent liabilities ₹249 cr; no emphasis of matter found in the consolidated audit report; the Unichem auditor flagged a key audit matter on its own accounts.',
    ] },
    { callout: '**Accounting flag: AMBER.** Revenue and cost recognition look conservative and the balance sheet is clean. But reported EPS has been distorted by exceptional items in each of the last three years, FY26 carries a one-off gain inside other income, and the forex line moves Screener\'s margin. We value Ipca on EPS before exceptional items and one-offs, and show reported EPS alongside.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Two families control Ipca: the Godhas (Executive Chairman Premchand Godha and his sons Pranay, MD & CEO, and Prashant, Executive Director; mainly through Kaygee Investments, 25.49%, and Kaygee Laboratories, 6.61%) and the Chandurkars (Chandurkar Investments 5.50%, Usha Chandurkar 1.70%, Sameer Chandurkar 0.79%). Promoters own ${OH.promoters}% (Jun-2026), with no pledge. Domestic institutions own ${OH.diis}% (mutual funds 31.2% at Mar-26: HDFC Mutual Fund 9.60%, Kotak 6.28%, DSP 5.52%), foreign investors ${OH.fiis}% and the public ${OH.public}% (${n0(OH.shareholders)} shareholders).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders above 1% (31-Mar-2026)', head: ['Holder', 'Type', 'Stake'], rows: [
    ['Kaygee Investments Pvt Ltd', 'Promoter (Godha family)', '25.49%'], ['HDFC Mutual Fund', 'Institution', '9.60%'], ['Kaygee Laboratories Pvt Ltd', 'Promoter (Godha family)', '6.61%'],
    ['Kotak Mutual Fund', 'Institution', '6.28%'], ['DSP Mutual Fund', 'Institution', '5.52%'], ['Chandurkar Investments Pvt Ltd', 'Promoter (Chandurkar family)', '5.50%'],
    ['Premchand Godha', 'Promoter', '2.29%'], ['Usha M. Chandurkar', 'Promoter', '1.70%'],
  ], source: 'AR FY26 note 13 and shareholding pattern at 31-Mar-2026 (the Jun-2026 named list was not retrieved)' } },
  { callout: '**Our read:** a stable, institution-heavy register: domestic mutual funds have bought steadily (DIIs 34.2% → 37.0% since Dec-2023) and the only promoter sale was the Chandurkar family\'s 1.58% in Dec-2024. A 44.7% promoter stake is lower than at most family-run Indian pharma companies, which makes the board\'s independence and minority treatment more important, not less.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: an experienced family-plus-professional team; the succession has happened; pay and related-party bets are the weak spots',
  blocks: [
    { p: `Premchand Godha has led Ipca since the 1980s; he handed the MD & CEO role to his son Pranay Godha (born 1972) on 1-Apr-2023 and stayed on as Executive Chairman. Day-to-day finance and investor communication sit with A.K. Jain (born 1955), Managing Director and CFO, a non-promoter professional who runs the earnings calls. Prashant Godha (born 1974) is Executive Director, re-appointed for five years from Aug-2026. Succession is therefore in place at the top, with A.K. Jain's age (71) the key-person question for the finance role. The board has eight members: four executives and four independents.` },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Evidence'], wide: [2], rows: [
      ['Control and board', 'AMBER', 'Executive Chairman, MD & CEO and an Executive Director are one family; 4 of 8 directors independent (the legal minimum with an executive chair)'],
      ['Succession', 'GREEN', 'Pranay Godha MD & CEO since Apr-2023 (re-appointed to Nov-2028); professional MD & CFO; the founder remains as chairman'],
      ['Pay', 'AMBER', `Four whole-time directors earned ₹42.7 cr in FY26 (3.7% of profit to owners): Premchand Godha ₹15.0 cr, A.K. Jain ₹10.6 cr, Pranay Godha ₹10.0 cr, Prashant Godha ₹7.2 cr; half is profit-linked commission`],
      ['Related parties and group bets', 'AMBER', 'Krebs Biochemicals (49.65%): loans, a ₹11 cr deposit lien and a comfort letter, ₹130 cr impaired, now being merged in; Lyka Labs (40.98%) loss-making'],
      ['Capital allocation', 'AMBER', 'Unichem bought near the top of Ipca\'s cycle and still earning ~4-5% on its price; debt repaid within three years; dividends low (13%)'],
      ['Disclosure', 'GREEN', 'Detailed business, geography and therapy splits; candid calls; segment margins not disclosed'],
      ['Regulatory compliance', 'AMBER', 'Nine years of USFDA import alerts (2015-2023) after data-integrity findings; all Ipca plants VAI since'],
      ['Minority treatment', 'GREEN', 'No pledges; open offer for Unichem at the same ₹440 as the promoters\' block (₹402 recorded); no dilutive issues'],
    ], source: 'AR FY26 (corporate governance report, directors\' remuneration, notes 13, 36, 38); Q4FY26 and Q1FY27 calls; GAM assessment' } },
    { callout: '**Overall: AMBER.** A long, competent record and a succession that has already happened. Minority shareholders should watch three things: pay that is high for the company\'s size, a habit of propping up group companies (Krebs, Lyka) before writing them down, and the open question of whether and on what terms Unichem\'s minorities will eventually be bought out.' },
  ],
};

const STREET_F = [['PL (16-Aug)', pl_], ['ICICI Direct (17-Aug)', idir], ['Emkay (17-Aug)', emkay], ['HDFC Sec (27-Feb)', hsie]];
const val = (o, k) => (o[k] ? Object.values(o[k]).map(v => (k === 'eps' ? n1(v) : n0(v))).join(' / ') : '–');
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}, at the upper end of the street on lower interest and tax`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS to shareholders of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} (minorities of ₹${MIN.join(' / ')} cr deducted). FY27E EPS is up ${Math.round((epsU[0] / epsBase[2026] - 1) * 100)}% on FY26's ₹${n1(epsBase[2026])} before exceptional items and one-offs (${Math.round((epsU[0] / epsRep[2026] - 1) * 100)}% on the reported ₹${epsRep[2026]}). Our revenue is close to the street; our EPS is at the upper end because we assume lower interest (Ipca's own debt is nearly gone) and a 26% tax rate (PL uses 27%).` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', ...STREET_F.map(s => s[0])], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ...STREET_F.map(([, s]) => val(s, 'sales'))],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', ...STREET_F.map(([, s]) => val(s, 'ebitda'))],
      ['EPS to shareholders (₹)', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', ...STREET_F.map(([, s]) => val(s, 'eps'))],
    ], source: 'GAM; PL (16-Aug-2026), ICICI Direct (17-Aug-2026), Emkay (17-Aug-2026), HDFC Securities (27-Feb-2026) notes; street columns show FY27E / FY28E (/ FY29E). Motilal Oswal: FY28E PAT ₹16.2 bn (EPS ~₹63.9), revenue ₹121 bn, EBITDA ₹28 bn.' } },
    { exhibit: { type: 'column', title: 'FY28E EPS: GAM at the top of the range', unit: 'FY28E EPS to shareholders (₹)', x: ['Emkay', 'Motilal Oswal', 'HDFC Sec (Feb)', 'PL', 'GAM', 'ICICI Direct'], series: [{ name: 'FY28E EPS', values: [emkay.eps.FY28E, mosl.eps.FY28E, hsie.eps.FY28E, pl_.eps.FY28E, Math.round(epsU[1] * 10) / 10, idir.eps.FY28E], fmt: 'n1' }], labels: 'all', highlight: 'GAM', source: 'Broker notes; GAM (MOSL derived from its FY28E PAT)' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ...LINES.map(l => [`${LBL[l]} growth`, ...BL.growth[l].map(g => g + '%'), { domForm: 'Guidance 12-13%; Q1 +12.6%; market ~10%', expBranded: 'Q1 +16%; FY26 +14%', expGeneric: 'Q1 +27% (Europe/UK); US launches', expInstitutional: 'Guided ₹260-300 cr', api: 'Q1 +30%; Ratlam near capacity', subsidiaries: 'Unichem +10% guided; Ipca products in the US faster' }[l]]),
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Guidance ~23% for FY27; Unichem 12.5% → 15%; no forex gains'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), '₹700-800 cr guided (Ipca) plus Unichem'],
      ['Interest (₹ cr)', ...AS.interest.map(n0), `Unichem ~₹${UNI_INT} cr; Ipca term loans at ${KD}% (₹193 cr → ₹70 cr → nil); leases (₹${n0(LEASE_IPCA)} cr) at ${LEASE_INT}%`],
      ['Tax on PBT', ...TB.taxOnPbt.map(t => t + '%'), 'Q1 26.1%; Ipca standalone 26.1% in FY26'],
      ['Minorities (₹ cr; in the tax line)', ...MIN.map(n0), '47.33% of Unichem + 41.12% of Trophic; Q1 ~₹21 cr'],
      ['Payout', ...AS.payout.map(p => p + '%'), 'FY26 ₹6 a share (13%)'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Treasury income (interest + fund gains)', n0(OI26.treasury), ...oiTreas.map(n0), `${TY}% on average cash, deposits and liquid funds (₹${grossCash.map(n0).join(' → ')} cr, Mar-26 to Mar-29E); FY26 earned ~7.9% incl. ₹27 cr of unrealised gains`],
      ['Miscellaneous income, royalty, asset-sale profits', n0(OI26.misc + OI26.royalty + OI26.ppeGain), n0(MISC), n0(MISC), n0(MISC), 'FY26 ₹16.5 cr, FY25 ₹11.1 cr'],
      ['Share of JV and associates (Lyka, Krebs)', n1(FY26.jvAssociates), n0(JV), n0(JV), n0(JV), 'FY26 −₹7.6 cr; Screener counts it in other income'],
      ['One-offs (Bayshore deconsolidation, business sale)', n1(OI26.bayshoreDeconsolidation + OI26.businessSale), '0', '0', '0', 'Not forecast'],
      { hl: true, cells: ['**Total (model)**', `**${n0(OI26.total + FY26.jvAssociates)}**`, ...AS.otherIncome.map(v => `**${n0(v)}**`), `Same basis ex one-offs FY26: ₹${n0(OI26.total + FY26.jvAssociates - OI26.bayshoreDeconsolidation - OI26.businessSale)} cr; twelve months to Jun-26 ₹${n0(ttmOi)} cr (Screener, incl. the Bayshore gain); Q1FY27 ₹25 cr. Exceptional items excluded`] },
    ], source: 'AR FY26 note 24; Screener.in quarterly schedules; GAM (checked in IPCALAB.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Interest: built from the debt schedule (₹ crore)', head: ['', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Q1FY27 actual (all entities)', n1(Q1.interest), '–', '–'],
      ['Unichem borrowings (₹469 cr, held flat)', n1(UNI_INT * 0.75), n1(UNI_INT), n1(UNI_INT)],
      [`Ipca term loans at ${KD}% (₹193 cr Jun-26 → ₹70 cr Mar-27 → nil)`, n1(KD / 100 * (193 + 70) / 2 * 0.75), n1(KD / 100 * 70 / 2), '0.0'],
      [`Ipca leases (₹${n0(LEASE_IPCA)} cr) at ${LEASE_INT}%`, n1(LEASE_INT / 100 * LEASE_IPCA * 0.75), n1(LEASE_INT / 100 * LEASE_IPCA), n1(LEASE_INT / 100 * LEASE_IPCA)],
      ['Other finance costs', ...X.OTHER_FIN.map(n1)],
      { hl: true, cells: ['**Total (build / model)**', ...intBuild.map((v, i) => `**${n1(v)} / ${n0(AS.interest[i])}**`)] },
    ], source: 'AR FY26 notes 15, 20, 35; Screener (UNICHEMLAB); Q1FY27 call; GAM (FY27E = Q1 actual + nine months)' } },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
