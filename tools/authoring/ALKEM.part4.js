// Alkem Laboratories report, part 4: Q1FY27 and guidance, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./ALKEM.ctx');
const { C, D, F, A, AS, n0, n1, pc, SQ, QL, Q1, FY26, YRS, BL, build, LINES, LBL, MIN, ownersEps, epsU, TY, YIELD26, TREAS26, GROSSUP, RECUR, oiTreas, openCash, ttmOi, GROSS_DEBT, OI, mosl, bob, choice, nuv, ex26, epsRep, EXC_AT, SHR, SHARES } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 and guidance', kicker: 'Latest quarter', title: 'Q1FY27: revenue +11%, EBITDA +4%, profit −22% on a 32% tax rate; guidance held, Daman turned OAI',
  blocks: [
    { p: `Alkem reported Q1FY27 on 14-Aug-2026. Revenue rose ${n1(Q1.revenueGrowthPct)}% to ₹${n0(Q1.revenue)} cr: India +${n1(Q1.indiaGrowthPct)}% (branded ~12%, trade generics flat), US +${n1(Q1.usGrowthPct)}%, other international +${n1(Q1.rowGrowthPct)}%. Gross margin hit ${n1(Q1.grossMarginPct)}% (+260bp), but EBITDA rose only ${n1(Q1.ebitdaGrowthPct)}% to ₹${n0(Q1.ebitda)} cr (margin ${n1(Q1.ebitdaMarginPct)}%, −145bp) as staff costs rose ${n1(Q1.staffCostGrowthPct)}% and other expenses ${n1(Q1.otherExpGrowthPct)}%. Profit before tax was flat (+1.8%) and profit to shareholders fell ${Math.abs(Q1.patGrowthPct)}% to ₹${n0(Q1.patOwners)} cr (EPS ₹${Q1.eps}) because the tax rate jumped from 13.3% to 32.4% under the new regime. The quarter beat MOSL's estimates (EBITDA +16%) and BOBCAPS's (+6%) on margin. On the same day the company disclosed that the Daman plant had been classified OAI by the USFDA.` },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: ₹3,740 cr in Q1FY27, +11%', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
      { type: 'column', title: 'Quarterly EPS: tax takes Q1FY27 below Q1FY26', unit: 'EPS (₹), reported', x: 'Q.labels', series: [{ name: 'EPS', ref: 'Q.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Q1FY27 in one table (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'YoY', 'Comment'], wide: [4], rows: [
      ['Revenue', '3,371', n0(Q1.revenue), `+${n1(Q1.revenueGrowthPct)}%`, 'India +10.3%, US +6.5%, other international +34.5%'],
      ['Gross margin', `${Q1.grossMarginPrevPct}%`, `${Q1.grossMarginPct}%`, '+260bp', 'Mix (less trade generics), rupee, old-cost API inventory'],
      ['EBITDA', '739', n0(Q1.ebitda), `+${Q1.ebitdaGrowthPct}%`, 'Enzene US opex ~₹60 cr; 1,200 more reps; Occlutech diligence'],
      ['EBITDA margin', `${Q1.ebitdaMarginPrevPct}%`, `${Q1.ebitdaMarginPct}%`, '−145bp', 'Guidance 20-21% for FY27 before Occlutech'],
      ['Other income', '137', n0(Q1.otherIncome), '+12%', 'Treasury income on ₹5,764 cr net cash'],
      ['Tax rate', `${Q1.etrPrevPct}%`, `${Q1.etrPct}%`, '+19pp', 'New regime; loss-making subsidiaries get no tax credit'],
      { hl: true, cells: ['**Profit to shareholders**', '**664**', `**${n0(Q1.patOwners)}**`, `**${Q1.patGrowthPct}%**`, `EPS ₹${Q1.eps} vs ₹55.6`] },
    ], source: 'Q1FY27 press release and presentation (14-Aug-2026); MOSL and BOBCAPS result notes' } },
    { exhibit: { type: 'table', title: 'What management guided (by 30-Sep-2026)', head: ['Item', 'Guidance', 'Source'], wide: [1], rows: C.guidance, source: 'Company earnings calls (28-May-2026, 14-Aug-2026)' } },
    { callout: '**Our read:** the operating quarter was decent (the best gross margin in a decade, India ahead of the market) but three things cap the story: the tax reset is real and permanent, the new businesses are absorbing the margin gains, and the Daman OAI turns the US from a slow business into a risky one. The CEO post was still vacant at the time of the call.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audit, real cash, but recurring "exceptional" items, a big other-income share and a tax holiday that flattered profits',
  blocks: [
    { p: `Deloitte gave an unmodified opinion on FY26. Profits convert to cash, though less fully of late (cash from operations after tax was ${Math.round(FY26.cfo / FY26.ebitda * 100)}% of EBITDA in FY26, 76% in FY25 and 87% in FY24, as inventory and receivables grew), revenue recognition is conventional, and capitalised R&D is small (intangibles under development ₹144 cr). We flag four things. (1) **"Exceptional" items recur**: charges in FY23 (₹173 cr pre-tax), FY24 (₹122 cr) and FY26 (₹175 cr: labour codes ₹113 cr, real-estate impairment ₹75 cr, less a ₹14 cr plant-sale gain). We use EPS before them for the valuation history, but investors should not assume they never come back. (2) **Other income is large**: ₹583 cr in FY26, 19% of PBT before exceptional items, of which ₹85 cr was FX gains. (3) **Tax**: a decade of 9-18% tax rates came from Sikkim holiday units; the income-tax department challenged those deductions (search in Sep-2023), though CIT(A) deleted ₹661 cr of disallowances in Jun-2026; the ₹${n0(FY26.matCredit)} cr MAT credit is an asset whose cash value depends on future taxable profit. (4) **Minorities**: 49% of Indchemie and 39% of Cachet belong to others, and 45% of Occlutech from FY27; Screener's "net profit" is before minorities (our patch fixes it).` },
    { exhibit: { type: 'table', title: 'Exceptional items and their effect on EPS', head: ['Year', 'Exceptional items after tax (₹ cr)', 'EPS reported (₹)', 'EPS before exceptional items (₹)', 'What it was'], wide: [4], rows: [2022, 2023, 2024, 2025, 2026].map(y => [`FY${String(y).slice(2)}`, n0(EXC_AT[y]), n1(epsRep[y]), n1(epsRep[y] - EXC_AT[y] / SHR[y]), { 2022: 'Small', 2023: 'US-related charges (₹173 cr pre-tax, MOSL)', 2024: '₹122 cr pre-tax (MOSL); Indore plant impairment', 2025: 'Small gain', 2026: 'Labour codes ₹113 cr, real estate ₹75 cr, Indore sale gain ₹14 cr' }[y]]), source: 'Screener.in (exceptional items after tax); AR FY26 note 3.43; MOSL' } },
    { exhibit: { type: 'table', title: 'Accounting checklist', head: ['Test', 'Result', 'Flag'], wide: [1], rows: [
      ['Audit opinion (Deloitte Haskins & Sells)', 'Unmodified, FY26', 'GREEN'],
      ['Cash conversion (CFO / EBITDA)', `FY26 ${Math.round(FY26.cfo / FY26.ebitda * 100)}%; working capital rose with sales (inventory 239 days)`, 'AMBER'],
      ['Exceptional items', 'Three of the last four years', 'AMBER'],
      ['Other income share of PBT', '19% (FY26); treasury partly in NBFC deposits and real estate', 'AMBER'],
      ['Tax', 'Holiday-driven low rate ending; deductions disputed (largely won on appeal)', 'AMBER'],
      ['Related-party transactions', 'Pay to family executives and relatives ₹135 cr incl. KMP; rent ₹0.4 cr; dividends to promoter entities', 'AMBER'],
      ['Segment disclosure', 'One segment; no profitability by business; Enzene and MedTech numbers only in the annual report', 'AMBER'],
    ], source: 'AR FY26; Screener.in; GAM' } },
    { callout: '**Overall: AMBER.** Nothing suggests the profits are not real, and cash backs them. But reported EPS has been pushed around by "exceptional" charges, tax holidays and treasury income for years, and disclosure on the new businesses is thin. We value on EPS before exceptional items and forecast none, which is the street\'s convention too.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The Singh family (founder B.N. Singh's branch and the late Samprada Singh's branch, their trusts and relatives) owned ${D.ownership.jun2026.promoter}% at Jun-2026; no pledge is reported. Domestic institutions held ${D.ownership.jun2026.dii}%, foreign institutions ${D.ownership.jun2026.fii}% and the public ${D.ownership.jun2026.public}% (${n0(D.ownership.jun2026.shareholders)} shareholders). ${D.ownership.promoterSales}. Named institutional holders above 1% were not retrieved (gap).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Promoter-group sales since Dec-2023', head: ['When', 'Seller', 'Stake', 'Price'], wide: [1], rows: [
    ['Dec-23 → Mar-25', 'Promoter-group members (incl. reclassification of some members to public, approved 15-Jul-2025)', '56.7% → 55.1%', '–'],
    ['Jun-2025', 'Jayanti Sinha (promoter group)', '1.42%', 'Floor ₹4,850 (~₹825 cr)'],
    ['Jul-Sep 2025', 'Reclassification and member sales', '53.0% → 51.2%', '–'],
    ['2-Jun-2026', 'Jayanti Sinha (exit) and the Samprada & Nanhamati Singh Family Trust', '~1.49%', '₹5,200 (~₹930 cr); 90-day lock-up'],
  ], source: 'Screener.in shareholding (BSE); Angel One (Jun-2025); Business Today (3-Jun-2026); Venture Intelligence' } },
  { callout: '**Our read:** a steady trickle of family selling (7pp in 30 months) is an overhang: the 90-day lock-up from the Jun-2026 block ran to about the end of Aug-2026, so more supply could come. The buyers have been domestic mutual funds, which now own more than foreign investors.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a capable family company with founder-era habits; CEO seat empty, pay high, tax history untidy',
  blocks: [
    { exhibit: { type: 'table', title: 'Who runs Alkem', head: ['Name', 'Role', 'Note'], wide: [1, 2], rows: C.management, source: C.managementSrc } },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Assessment', 'Score'], wide: [1], rows: [
      ['Board', C.governance.board, 'AMBER'],
      ['Succession', C.governance.succession, 'RED'],
      ['Pay', C.governance.pay, 'AMBER'],
      ['Tax and conduct', C.governance.incomeTax, 'AMBER'],
      ['Family', C.governance.family, 'AMBER'],
      ['Auditor and disclosure', `${C.governance.auditor}; one reported segment; investor decks give sales by business but no profitability`, 'GREEN / AMBER'],
      ['Capital allocation', 'Conservative balance sheet and steady dividends; but three capital-hungry new businesses at once and treasury money in real estate', 'AMBER'],
    ], source: C.governance.src } },
    { callout: '**Verdict: AMBER.** The family has built and run a good business for 50 years and keeps a clean balance sheet. But a founder in his mid-80s, six family executives on the Board, the departure of the first professional CEO after about three years, high promoter pay, steady promoter selling and an income-tax search (with unproven press allegations of payments to doctors) are reasons the stock has not earned a governance premium. The appointment of a strong CEO with real authority over the pharma business would be the most useful signal.' },
  ],
};

const STREET_F = [['Motilal Oswal', mosl], ['BOBCAPS', bob], ['Choice', choice]];
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS to shareholders ₹${n1(ownersEps[0])} / ${n1(ownersEps[1])} / ${n1(ownersEps[2])}: below consensus, close to BOBCAPS and MOSL`,
  blocks: [
    { p: `We forecast revenue of ₹{{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, tax of ${AS.taxRate.join(' / ')}% and EPS to shareholders of ₹${n1(ownersEps[0])} / ${n1(ownersEps[1])} / ${n1(ownersEps[2])} (the model's EPS of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} includes ₹${MIN.join(' / ')} cr of minorities, which the engine cannot separate). FY27E EPS is ${pc(ownersEps[0] / ex26 * 100 - 100)} on FY26 before exceptional items; from there EPS grows ${Math.round((ownersEps[2] / ownersEps[0]) ** 0.5 * 100 - 100)}% a year to FY29E. Our FY27-28E EPS is 6-7% below the Bloomberg consensus (₹195.8 / ₹227.7, Aug-2026), mainly because we take the bottom of the margin guidance and 31% tax.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', ...STREET_F.map(s => s[0]), 'Consensus'], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ...STREET_F.map(([, s]) => Object.values(s.sales).map(n0).join(' / ')), '–'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', ...STREET_F.map(([, s]) => Object.values(s.ebitda).map(n0).join(' / ')), '–'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', ...STREET_F.map(([, s]) => ['FY27E', 'FY28E'].map(y => n1(s.ebitda[y] / s.sales[y] * 100) + '%').join(' / ')), '–'],
      ['EPS to shareholders (₹)', n1(ownersEps[0]), n1(ownersEps[1]), n1(ownersEps[2]), ...STREET_F.map(([, s]) => Object.values(s.eps).map(n1).join(' / ')), '195.8 / 227.7'],
    ], source: 'GAM; MOSL (15-Aug-2026), BOBCAPS (14-Aug-2026), Choice (17-Aug-2026) notes; Bloomberg consensus as printed by BOBCAPS. Street columns show FY27E / FY28E' } },
    { pair: [
      { type: 'hbar', title: 'FY28E EPS: GAM at the low end with BOBCAPS', unit: 'FY28E EPS to shareholders (₹)', x: ['BOBCAPS', 'GAM', 'Motilal Oswal', 'Nuvama (Nov-25)', 'Consensus', 'Choice'], series: [{ name: 'FY28E EPS', values: [bob.eps.FY28E, Math.round(ownersEps[1] * 10) / 10, mosl.eps.FY28E, nuv.eps.FY28E, 227.7, choice.eps.FY28E], fmt: 'n1' }], labels: 'all', highlight: 'GAM', source: 'Broker notes; GAM' },
      { type: 'stacked', title: 'Our revenue build by business', unit: 'Revenue (₹ crore); FY26 actual, FY27-29E GAM', x: ['FY26', ...YRS], series: LINES.map(l => ({ name: LBL[l], values: [Math.round(X.base26[l]), ...build[l].map(Math.round)], fmt: 'num', ...(l === 'otherOp' ? { grey: true } : {}) })), labels: 'none', source: 'Company; GAM (ALKEM.ctx.js checks the sum against the model)' },
    ] },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ['India growth', ...BL.growth.india.map(g => g + '%'), 'Q1 +10.3% (branded ~12%, trade generics flat); MD expects ~12% for FY27'],
      ['US growth (₹)', ...BL.growth.us.map(g => g + '%'), 'Q1 +6.5%; guidance mid-to-high single digit incl. currency; tolvaptan; Daman OAI'],
      ['Other international growth (organic)', ...BL.growth.row.map(g => g + '%'), 'Q1 +34.5%; guidance higher teens'],
      ['Occlutech revenue (₹ cr)', ...BL.occlutech.map(n0), '₹400 cr target for 8.5 months of FY27 (CFO)'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Bottom of the 20-21% guidance in FY27 (Occlutech dilutes ~50bp); CDMO and Occlutech losses narrow later'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), 'FY27E incl. up to ₹1,100 cr for 55% of Occlutech'],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'Guidance 30-32% consolidated; falls as US CDMO losses shrink'],
      ['Minorities (₹ cr; not in the engine)', ...MIN.map(n0), 'FY26 ₹49 cr (Indchemie, Cachet); less 45% of Occlutech losses'],
      ['Dividend payout', ...AS.payout.map(p => p + '%'), 'FY26 ₹53 a share; absolute dividend held as tax rises'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Treasury income on net cash (engine)', n0(TREAS26), ...oiTreas.map(n0), `${TY[0]}% on opening net cash (₹${openCash.map(n0).join(' → ')} cr, engine basis after leases). FY26: ₹${n0(TREAS26)} cr on average gross treasury of ₹6,474 cr = ${n1(YIELD26)}%`],
      ['Income on cash matched by borrowings and leases', 'in the above', ...GROSSUP.map(n0), `${TY[0]}% on ₹${n0(GROSS_DEBT)} cr of gross borrowings and leases (held flat): Alkem borrows against its deposits; the cost is in the interest line`],
      ['Liabilities written back and miscellaneous', n0(OI.writeBacks + OI.misc), n0(RECUR), n0(RECUR), n0(RECUR), 'FY26 ₹24.5 cr + ₹28.6 cr'],
      ['Foreign-exchange gains', n0(OI.fxGain), '0', '0', '0', 'Not forecast (FY25 ₹38 cr, FY26 ₹85 cr with a falling rupee)'],
      { hl: true, cells: ['**Total other income**', `**${n0(OI.total)}**`, ...F.otherIncome.map(v => `**${n0(v)}**`), `Twelve months to Jun-26: ₹${n0(ttmOi)} cr. FY28E dips after the Occlutech payment`] },
    ], source: 'AR FY26 note 3.20; Screener.in quarterly schedules; GAM (checked in ALKEM.ctx.js)' } },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
