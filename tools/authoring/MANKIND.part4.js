// Mankind Pharma report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./MANKIND.ctx');
const { C, D, F, A, AS, n0, n1, rup, Q1, FY26, DEAL, YRS, LINES, LBL, BL, build, oiTreas, oiBuild, GRANTS, MISC, ASSOC, TY, grossCash, adjEps, ownersEps, epsU, ppaPs, minPs, MIN, mosl, jm, geo, shortDate, SHARES, intBuild, NCD, OTHER_DEBT, KD_OTHER, FY26_OI_CORE, ttmOi } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +13%, EBITDA +25%, profit +30%; the tax rate rose to 25% and other income halved',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '3,570', n0(Q1.revenue), `+${Q1.revenueGrowthPct}%`],
      ['  Domestic prescription (incl. BSV India)', '2,864', n0(Q1.domesticRx), `+${Q1.domesticRxGrowthPct}%`],
      ['  Consumer healthcare', '237', n0(Q1.consumer), `+${Q1.consumerGrowthPct}%`],
      ['  Exports (incl. BSV international)', '469', n0(Q1.exports), `+${Q1.exportsGrowthPct}% (12-13pp currency)`],
      ['Gross margin', '70.5%', `${Q1.grossMarginPct}%`, '+230bp'],
      ['EBITDA (company)', '850', n0(Q1.ebitda), '+24.7%'],
      ['  margin', '23.8%', `${Q1.ebitdaMarginPct}%`, '+250bp'],
      ['Depreciation & amortisation (≈half BSV)', '219', n0(Q1.dep), ''],
      ['Finance cost', '171', n0(Q1.financeCost), '−36% (₹1,250 cr NCD repaid 16-Apr-2026)'],
      ['Other income', '83', n0(Q1.otherIncome), 'Lower treasury balances'],
      ['Tax rate', '17.7%', `${Q1.taxRatePct}%`, 'New regime after the Sikkim exemption'],
      { hl: true, cells: ['**Profit to shareholders**', '**438**', `**${Q1.patOwners}**`, '**+30%**'] },
      ['EPS (₹)', '10.62', `${Q1.eps}`, '+29%'],
    ], source: 'Q1FY27 investor presentation and call (30-Jul-2026); Screener.in (other income, profit to owners)' } },
    { bullets: [
      `**In line on revenue and EBITDA, a miss on profit:** brokers expected higher other income and a lower tax rate (Motilal Oswal\'s PAT estimate was ₹650 cr). The stock fell up to 6% on 31-Jul-2026.`,
      '**Gross margin 72.8%** was helped by price increases, a richer chronic mix and a weak base (inventory provisions in Q1FY26); management expects compression from Q2 as West Asia raises commodity and dollar costs, and keeps "upward of 71%".',
      `**IQVIA:** ${Q1.iqvia}.`,
      `**BSV:** ${Q1.bsv}.`,
      `**Consumer:** ${Q1.consumerNote}.`,
      `**Balance sheet:** net debt ₹${n0(Q1.netDebt)} cr (${Q1.netDebtToAdjEbitda}x adjusted EBITDA); working capital 52 days (inventory high, to come down by year-end); cash flow 77% of EBITDA (higher tax, base effect).`,
    ] },
    { exhibit: { type: 'table', title: 'What management guided for FY27 (May and Jul-2026)', head: ['Guidance'], rows: C.guidance.fy27.map(g => [g]), source: rup(C.guidance.src) } },
    { callout: '**Why it matters:** this is the second double-digit quarter for the prescription business after a year of single digits, and management has stopped promising outperformance ("we never said... we\'ll be beating the IPM"). The guidance (double-digit revenue, 25.5-26.5% margin) is achievable; the swing factors are gross margin from Q2 and whether consumer healthcare really returns to high single digits.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: good cash conversion; read the BSV amortisation, the tax step-up and the tax dispute carefully',
  blocks: [
    { bullets: [
      `**Acquisition amortisation.** BSV's ₹${n0(DEAL.ppa.intangibles)} cr of intangibles are amortised at ~₹${DEAL.ppa.amortisationPerYearCr} cr a year (our estimate from the Q1FY27 call; group intangible amortisation ₹162 cr FY24, ₹362 cr FY25, ₹594 cr FY26). It is not tax-deductible; the ₹1,800 cr deferred tax liability unwinds by ~₹113 cr a year, so it costs ~₹337 cr of reported profit (₹${n1(ppaPs)} a share) and no cash.`,
      '**Exceptional items.** FY26: −₹129.75 cr (labour-code gratuity and leave ₹97 cr, a trademark assignment between Mankind and BSV, a ₹13 cr BSV project write-down). FY25: +₹164 cr gain on selling Mahananda Spa & Resorts, booked in other income. Screener tags both as exceptional; we exclude both from the earnings history.',
      '**Other income.** ₹359 cr in FY26 included ₹127 cr of mutual-fund gains (₹64 cr unrealised) and ₹70 cr of foreign-exchange gains; Q1FY27 fell to ₹49 cr as cash went to repay debt.',
      '**Tax.** 16.9% in FY26 and ~25% from FY27 (Sikkim plant\'s exemption ended): reported EPS growth in FY27 is ~9 points lower than pre-tax growth.',
      '**"Cash EPS".** The company adds back all depreciation and amortisation (₹19.2 in Q1FY27), not only acquisition amortisation; Macquarie challenged this on the Q1FY27 call. We use EPS before the BSV amortisation only.',
      `**Cash conversion.** Operating cash flow was 84% / 80% / 89% of company EBITDA in FY24-26 (77% in Q1FY27); capex 3.8-5.2% of revenue. Working capital 52 days.`,
      '**Income-tax dispute.** After a search in FY24 the department made adjustments of ₹1,909 cr (₹1,609 cr of expenses disallowed under section 37(1), ₹257 cr of tax-holiday deductions); demands of ₹1,113 cr are contingent liabilities (₹229 cr paid under protest) and the auditors drew attention to it. Section 37(1) disallows expenses incurred for purposes prohibited by law; the filings do not say which expenses were challenged.',
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing aggressive in revenue or cost recognition, and cash conversion is good. But four things distort reported EPS (non-deductible amortisation for many years, one-off gains and charges, a tax-rate step-up, a large tax dispute) and BSV is no longer disclosed separately. We show reported EPS, EPS to shareholders and EPS before the BSV amortisation side by side.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The founding Juneja family (Ramesh and Rajeev Juneja, their family trusts and relatives) and CEO Sheetal Arora's family own ${OH.promoters}% (Jun-2026); no pledge is reported. Three family trusts hold 54.5%: Ramesh Juneja Family Trust 20.19%, Rajeev Juneja Family Trust 19.36%, Prem Sheetal Family Trust 14.96%. Foreign investors hold ${OH.fiis}%, Indian institutions ${OH.diis}% and the public ${OH.public}% (${n0(OH.shareholders)} shareholders). The free float is small: 26.4% (₹27,765 cr at the Jun-2026 price, company).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who sold, and when: the overhang has cleared', head: ['When', 'Seller', 'Stake', 'Value / price'], wide: [1], rows: [
    ['May-2023', 'IPO offer for sale (promoters, ChrysCapital, Capital Group funds)', '4.0 cr shares (~10%)', '~₹4,326 cr at ₹1,080'],
    ['Dec-2023', 'ChrysCapital (Beige), Hema CIPEF, Cairnhill CIPEF (exit)', '~7.6%', '~₹5,589 cr'],
    ['8-Feb-2024', 'Promoters Sheetal Arora, Arjun Juneja, Puja Juneja (to meet the 25% public-float rule)', '1.62%', '~₹1,368 cr at ~₹2,107'],
    ['26-Mar-2024', 'Beige (ChrysCapital)', '2.9%', '~₹2,470 cr at ₹2,122.5'],
    ['Jul-2024', 'Hema CIPEF (Capital Group)', '~0.9%', '~₹771 cr'],
    ['20-Dec-2024', 'QIP (new shares, not a sale)', '1.19 cr shares (+3.0%)', '₹3,000 cr at ₹2,520'],
  ], source: 'Business Standard, Medical Dialogues and exchange block-deal data (Dec-2023 to Dec-2024); company filings' } },
  { callout: '**Our read:** the supply overhang that weighed on the stock in its first 18 months (private-equity exits and a promoter sale) is over: no pre-IPO financial investor appears among large holders in the Jun-2026 pattern, and the promoters are at 72.6%, inside the 75% cap. Domestic funds have absorbed the selling (DIIs 9.8% → 15.4% since Dec-2023 while FIIs fell from a 13.3% peak to 9.5%). With a 26% float, index weights and liquidity stay modest.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: an able founder team with a long record; family control, related parties and a tax dispute to watch',
  blocks: [
    { p: 'Mankind is run by its founders and their families: Ramesh Juneja (Chairman), Rajeev Juneja (Vice Chairman and MD), Sheetal Arora (CEO and Whole-time Director, promoter) and Arjun Juneja (COO). Professionals run finance (Ashutosh Dhawan, Global CFO), strategy (Prakash Agarwal) and BSV. The record is strong: thirty years of above-market growth, cost discipline, a balance sheet deleveraged quickly after BSV. The weaknesses are typical of a promoter-run Indian pharma company, plus a few specific ones.' },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Evidence'], wide: [2], rows: [
      ['Control and board', 'AMBER', 'Chairman, MD, CEO and COO are all promoters or family; joint Big-4-network audit (S.R. Batliboi with Bhagi Bhardwaj Gaur)'],
      ['Related parties', 'AMBER', 'Many promoter-linked suppliers (packaging, latex, real estate, hospitality); ₹339 cr of loans from related parties inside consolidated borrowings'],
      ['Tax and legal', 'AMBER', 'FY24 income-tax search; ₹1,909 cr of assessment adjustments under appeal; ₹1,113 cr of demands contingent; emphasis of matter in the audit report'],
      ['Disclosure', 'AMBER', 'BSV revenue and margin no longer disclosed; "cash EPS" defined generously'],
      ['Capital allocation', 'AMBER', 'BSV at ~28x EBITDA with debt; deleveraged on schedule; first dividend only in FY26 (₹1 a share)'],
      ['Minority treatment', 'GREEN', 'No pledges; QIP priced 3.7% below the floor to institutions (standard); public-float rule met by a promoter sale, not a dilutive issue'],
      ['Pay', 'GREEN', 'Directors waived commission in Q4FY26 (CFO); ESOP cost ₹18 cr in FY26'],
    ], source: 'AR FY26 (notes 22, 37-38, 43; corporate governance report); Q4FY26 call; GAM assessment' } },
    { callout: '**Overall: AMBER.** We see no sign of minority abuse, and the founders own 72.6% so their interests line up with shareholders. The tax dispute is the item to watch: if the section 37(1) disallowances are upheld, the cash cost could approach the ₹1,113 cr of demands (~₹27 a share), and the reputational cost could be larger.' },
  ],
};

const STREET_F = [['JM Financial (30-Jul)', jm], ['Motilal Oswal (31-Jul)', mosl], ['Geojit (16-Jun)', geo]];
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS to shareholders ₹${n1(ownersEps[0])} / ${n1(ownersEps[1])} / ${n1(ownersEps[2])}, within the street's range; we are below the bulls on margin`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, and EPS to shareholders of ₹${n1(ownersEps[0])} / ${n1(ownersEps[1])} / ${n1(ownersEps[2])} (the model's EPS of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} includes ~₹${n1(minPs[0])} of minorities' share; the engine has no minority line). Before the BSV amortisation EPS is ₹${n1(adjEps[0])} / ${n1(adjEps[1])} / ${n1(adjEps[2])}. FY27E EPS growth of ${Math.round((ownersEps[0] / 46.34 - 1) * 100)}% on FY26's ₹46.34, helped by lower interest and the absence of FY26's one-offs, is held back by the tax rate rising from 17% to 25%.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', ...STREET_F.map(s => s[0])], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ...STREET_F.map(([, s]) => Object.values(s.sales).map(n0).join(' / '))],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', ...STREET_F.map(([, s]) => Object.values(s.ebitda).map(n0).join(' / '))],
      ['EPS to shareholders (₹)', n1(ownersEps[0]), n1(ownersEps[1]), n1(ownersEps[2]), ...STREET_F.map(([, s]) => Object.values(s.eps).map(n1).join(' / '))],
      ['EPS before BSV amortisation (₹)', n1(adjEps[0]), n1(adjEps[1]), n1(adjEps[2]), '–', '–', '–'],
    ], source: 'GAM; JM Financial (30-Jul-2026), Motilal Oswal (31-Jul-2026), Geojit (16-Jun-2026) notes; street columns show FY27E / FY28E (/ FY29E)' } },
    { exhibit: { type: 'column', title: 'FY28E EPS: GAM in the middle of the street', unit: 'FY28E EPS to shareholders (₹)', x: ['JM Financial', 'GAM', 'Geojit', 'Motilal Oswal'], series: [{ name: 'FY28E EPS', values: [jm.eps.FY28E, Math.round(ownersEps[1] * 10) / 10, geo.eps.FY28E, mosl.eps.FY28E], fmt: 'n1' }], labels: 'all', highlight: 'GAM', source: 'Broker notes; GAM' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ...LINES.map(l => [`${LBL[l]} growth`, ...BL.growth[l].map(g => g + '%'), l === 'domesticRx' ? 'Q1 +11.0%; market ~10%; chronic share rising' : l === 'consumer' ? 'Q1 +3.9%; guided high single to double digit from Q2' : 'Q1 +29% incl. 12-13pp currency; high-teens constant-currency guidance']),
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Middle of the 25.5-26.5% FY27 guidance; +50bp / +30bp from mix'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), '6-7% of FY27 revenue guided (Vadodara biotech)'],
      ['Interest (₹ cr)', ...AS.interest.map(n0), `NCDs: ₹${n0(NCD[0])} / ${n0(NCD[1])} / 0 cr (coupons 7.97-7.99%, repaid Oct-26 and Nov-27) + ${KD_OTHER}% on ₹${n0(OTHER_DEBT)} cr of other debt + leases`],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'New regime; Q1 25.4%'],
      ['Minorities (₹ cr; not in the engine)', ...MIN.map(n0), 'FY26 ₹25 cr; Q1FY27 ₹6 cr'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Treasury income (interest + fund gains)', '185', ...oiTreas.map(n0), `${TY}% on average cash, deposits and liquid funds (₹${grossCash.map(n0).join(' → ')} cr, Mar-26 to Mar-29E); FY26 earned ~7.4% incl. ₹64 cr of unrealised gains`],
      ['Government grants and export incentives', '61', n0(GRANTS), n0(GRANTS), n0(GRANTS), 'FY26 ₹61 cr, FY25 ₹88 cr'],
      ['Scrap, liabilities written back, insurance, misc.', '42', n0(MISC), n0(MISC), n0(MISC), 'FY26 ₹42 cr'],
      ['Share of associates', '12', n0(ASSOC), n0(ASSOC), n0(ASSOC), 'FY26 ₹11.7 cr (Screener includes it in other income)'],
      ['Foreign-exchange gains', '70', '0', '0', '0', 'Not forecast (FY25 ₹20 cr, FY26 ₹70 cr with a falling rupee)'],
      { hl: true, cells: ['**Total (model)**', `**${n0(FY26_OI_CORE)}**`, ...AS.otherIncome.map(v => `**${n0(v)}**`), `Twelve months to Jun-26: ₹${n0(ttmOi)} cr; Q1FY27 ₹49 cr. Excluded: exceptional items and the FY25 Mahananda gain`] },
    ], source: 'AR FY26 note 30; Screener.in quarterly schedules; GAM (checked in MANKIND.ctx.js)' } },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
