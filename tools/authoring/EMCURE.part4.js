// Emcure report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./EMCURE.ctx');
const { C, D, F, A, AS, n0, n1, rup, Q1, FY26, YRS, LINES, LBL, BL, oiTreas, oiBuild, MISC, TY_OP, TY_SURPLUS, grossCash, epsU, byBase, icici, mosl, bob, moslEps, SHARES, intBuild, intBorrow, avgGD, KD, LEASE_INT, OTHER_FIN, ADV_TAX, UNWIND, ttmOi, CASH_MIN } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +23%, EBITDA +26%, profit +36%; international did the work, gross margin fell 340bp',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '2,101', n0(Q1.revenue), `+${Q1.revenueGrowthPct}% (6-7pp currency)`],
      ['  India', '994', n0(Q1.india), `+${Q1.indiaGrowthPct}% (6-7% organic)`],
      ['  Europe', '404', n0(Q1.europe), `+${Q1.europeGrowthPct}%`],
      ['  Canada', '343', n0(Q1.canada), `+${Q1.canadaGrowthPct}%`],
      ['  Rest of world', '360', n0(Q1.row), `+${Q1.rowGrowthPct}% (ARV ~2/3)`],
      ['Gross margin', '61.8%', `${Q1.grossMarginPct}%`, '−340bp (mix: Europe, ARV)'],
      ['EBITDA (company)', '404', n0(Q1.ebitda), '+25.8%'],
      ['  margin', '19.2%', `${Q1.ebitdaMarginPct}%`, '+50bp'],
      ['R&D', '73', n0(Q1.rnd), `${Q1.rndPct}% of revenue`],
      ['Depreciation & amortisation', '99', n0(Q1.dep), ''],
      ['Finance cost', '27', n0(Q1.financeCost), ''],
      ['Tax rate', '26.1%', `${Q1.taxRatePct}%`, ''],
      { hl: true, cells: ['**Profit after tax (company)**', '**215**', `**${n0(Q1.pat)}**`, '**+36%**'] },
      ['Adjusted PAT (excl. exchange gain and earn-out item)', '217', n0(Q1.adjPat), '+34%'],
      ['EPS (₹)', '10.92', `${Q1.eps}`, '+42%'],
    ], source: 'Q1FY27 investor presentation and call (6-Aug-2026); Screener.in (EPS); Motilal Oswal (7-Aug-2026)' } },
    { bullets: [
      '**A clear beat:** revenue, EBITDA and PAT were 6%, 7% and 21% above Motilal Oswal\'s estimates (lower interest and tax helped). The weekly close was ₹1,978 on 7-Aug-2026, up from ₹1,881 two weeks earlier.',
      `**Mix is moving abroad:** international was 58% of revenue (${Q1.internationalGrowthPct}% growth, ~12-13pp from currency). That is why gross margin fell to ${Q1.grossMarginPct}% while EBITDA margin rose: management calls the B2B international business "more accretive at EBITDA level" despite lower gross margins.`,
      '**India:** +10.2% (12% over Q4FY26), "no channel filling"; ~6-7% excluding Sanofi diabetes and Roche brands. Management: in line with the market in Q2, faster in H2.',
      `**Balance sheet:** gross debt ₹${n0(Q1.grossDebt)} cr, cash ₹${n0(Q1.cash)} cr, net debt ₹${n0(Q1.netDebt)} cr (working capital rose); ~₹1,560 cr after the July Mantra and Gennova payouts, ~₹1,450 cr expected at Sep-26.`,
      '**People:** Satish Mehta becomes Chairman as well as MD & CEO after the AGM (Berjis Desai retires to join the National Commission for Minorities); his son Samit Mehta becomes COO and CEO of Gennova.',
    ] },
    { exhibit: { type: 'table', title: 'What management guided for FY27 (May and Aug-2026)', head: ['Guidance'], rows: C.guidance.fy27.map(g => [g]), source: rup(C.guidance.src) } },
    { callout: '**Why it matters:** this was the strongest quarter since listing, but two of its drivers (currency and an ARV-heavy rest of world) will fade. The FY27 guidance (higher end of low-to-mid-teens growth, +70-100bp margin) needs only ~13% growth in Q2-Q4. The swing factor for FY28 is whether India, and Zuventus in particular, can carry more of the growth.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounting, but weak cash conversion, currency gains in profit and three EBITDA definitions to reconcile',
  blocks: [
    { bullets: [
      `**Cash conversion.** Operating cash flow was ₹${n0(FY26.cfo)} cr in FY26, 53% of company EBITDA (FY24 89%, FY25 58%): working capital absorbed ₹${n0(FY26.nwcIncrease)} cr as inventory and receivables rose ₹1,027 cr. Inventory + receivables − payables is 34% of revenue. This is the main quality issue.`,
      `**Currency gains.** FY26 profit included ₹${n0(FY26.fxGain)} cr of foreign-exchange gains (9% of PBT; ₹23 cr in Q1FY27) as the rupee fell. The company's "adjusted PAT" keeps them. We forecast none, which is one reason our FY27E EPS growth looks modest against FY26.`,
      `**Three EBITDA numbers.** Company ₹${n0(FY26.ebitdaCompany)} cr (19.4%, excludes exchange gains and the ₹${n1(FY26.earnoutTrueUp)} cr earn-out true-up); Screener ₹${n0(FY26.ebitdaScreener)} cr (19.0%, includes the true-up as a cost); ICICI Direct ₹1,907 cr (includes exchange gains). Screener's quarterly operating profit includes exchange gains (Q1FY27 ₹532 cr vs company ₹508 cr). We forecast on the company basis.`,
      `**Exceptional items.** FY26 −₹${n1(FY26.exceptional)} cr (labour codes ₹26.1 cr, a legal settlement ₹3.5 cr, consultancy ₹1.8 cr) plus the ₹${n1(FY26.earnoutTrueUp)} cr Mantra earn-out true-up booked above the line; FY25 −₹10.4 cr (US and EU legal settlements) and a ₹38.2 cr gain on asset sales in other income.`,
      '**Traded goods.** Purchases of finished products rose 27% to ₹2,397 cr (26% of revenue), mostly the Sanofi brands; these carry distribution margins, not brand margins.',
      '**Related-party sales.** ₹276 cr of sales to the promoter-owned US company Avet and its units in FY26, with ₹197 cr receivable at Mar-26 (Avet ₹167 cr, about 266 days of its purchases).',
      '**Contingent liabilities.** ₹259 cr incl. interest (income tax ₹100 cr after the Dec-2020 search; indirect tax ₹64 cr); US price-fixing cases indemnified by Avet; a Canadian class action against Marcan being settled.',
    ] },
    { callout: '**Accounting flag: AMBER.** We see nothing aggressive in revenue recognition, and the auditor (B S R & Co., KPMG network) gave a clean opinion. But profit has run ahead of cash for two years, currency gains flattered FY26, and the related-party receivable from Avet is large relative to the sales. We show reported EPS and EPS before exceptional items side by side and forecast no currency gains.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Mehta family owns ${OH.promoters}% (Jun-2026): founder Satish Mehta 39.77%, his son Samit Mehta 7.14% and daughter Namita Thapar 2.67%, his brothers' trusts (Everest Trust 7.66%, trustee Sanjay Mehta; Unity Trust 7.65%, trustee Sunil Mehta) and other relatives (AR FY26, Mar-26 holdings). No pledge is reported. Foreign investors hold ${OH.fiis}%, Indian institutions ${OH.diis}% and the public ${OH.public}% (${n0(OH.shareholders)} shareholders). The free float is ~22% (~₹8,200 cr at ₹1,943).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who sold, and when: Bain has exited', head: ['When', 'Seller', 'Stake', 'Value / price'], wide: [1], rows: [
    ['Jul-2024', 'IPO offer for sale (Bain up to 72.3 lakh shares; promoters incl. Satish Mehta, Namita Thapar)', '1.14 cr shares (~6%)', '₹1,151 cr at ₹1,008'],
    ['4-Jul-2025', 'BC Investments IV (Bain)', '2.4% (45.5 lakh shares)', '~₹563 cr (floor ₹1,279.80)'],
    ['18-Nov-2025', 'BC Investments IV (Bain)', '~2.1% (40.6 lakh shares)', 'Up to ~₹493 cr'],
    ['Apr-2026', 'BC Investments IV (Bain)', '~1%', '₹289 cr'],
    ['Jun-2026', 'BC Investments IV (Bain)', '~2%', '₹612 cr'],
    ['25-Jun-2026', 'BC Investments IV (Bain): final clean-out', '1.02% (19.4 lakh shares)', '₹352 cr at ₹1,817 (buyers incl. Goldman Sachs, BNP Paribas, Morgan Stanley, ABSL, HSBC and Axis MFs)'],
  ], source: 'Outlook Business / PTI (25-26 Jun-2026); Business Today (4-Jul-2025); Motilal Oswal news (18-Nov-2025); AR FY26 note 17' } },
  { callout: '**Our read:** the private-equity overhang is over: Bain held 8.68% at Mar-25 and nothing by end-Jun-2026, and domestic funds absorbed most of it (DIIs 2.8% → 8.5% in a year). One overhang remains: promoters at 77.8% are above the 75% cap, so ~2.8% of the company (~₹1,000 cr at today\'s price) has to be sold or issued; the company has said it will comply but has not said how or when (our reading of the rules: within three years of listing, i.e. by Jul-2027). Expect a promoter offer for sale or a QIP within twelve months.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a capable founder-scientist and a family-run board; succession is now visible, related-party links and pay need watching',
  blocks: [
    { p: 'Satish Mehta (founder, MD & CEO since 1981) will also be Chairman after the 2026 AGM, when Berjis Desai, a lawyer who chaired the board and worked with him for 35 years, retires. The family fills five of the top roles: Samit Mehta (son; Whole-time Director, COO from Aug-2026 and CEO of Gennova), Namita Thapar (daughter; Whole-time Director, consumer business), Sunil Mehta (Whole-time Director, manufacturing), Sanjay Mehta (President, Emerging Markets) and Vikas Thapar (son-in-law; President, Corporate Development, Strategy & Finance). Professionals run finance (CFO Tajuddin Shaikh), India (Srinivasan Raghavachari, ex-Sun Pharma) and technical operations. Independent directors include two former MNC pharma heads (Sanofi India, Allergan India), a former Foreign Secretary and a former Sun Pharma group CFO.' },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Evidence'], wide: [2], rows: [
      ['Control and board', 'AMBER', 'Founder becomes executive Chairman; five family members in top roles; independent chair leaves at the 2026 AGM'],
      ['Succession', 'GREEN-AMBER', 'Samit Mehta (20+ years in the company) elevated to COO in Aug-2026: the succession path is now visible, and family-only'],
      ['Related parties', 'RED-AMBER', '₹276 cr sales to promoter-owned Avet (US) with ₹197 cr receivable; Avet redeemed ₹250 cr of NCDs held by Emcure in FY25; Gennova minority bought from its CEO at ~₹1,924 cr for a ₹5 cr-profit company'],
      ['Legal and regulatory history', 'AMBER', 'US generic price-fixing cases named Emcure and Satish Mehta (state AG, direct-purchaser and end-payer settlements 2024-25; indemnified by Avet); Canadian class action against Marcan; income-tax search in Dec-2020'],
      ['Pay', 'AMBER', 'Whole-time directors ₹54 cr in FY26 (Satish Mehta ₹32.4 cr, +27%); with family executives ₹65 cr, ~7% of profit'],
      ['Capital allocation', 'AMBER', 'IPO money repaid debt as promised; ~₹1,330 cr on minority buyouts and an earn-out in twelve months'],
      ['Minority treatment', 'GREEN', 'No pledges; dividends restarted (₹3 a share); subsidiaries now 100% owned (no minority leakage)'],
      ['Disclosure', 'GREEN-AMBER', 'Quarterly geography split and call transcripts; no revenue disclosed for in-licensed brands, Poviztra or ARV'],
    ], source: 'AR FY26 (notes 17, 44, 45, 50, 57); Q1FY27 deck and call; Kotak Neo (14-Jul-2026); GAM assessment' } },
    { callout: '**Overall: AMBER.** Satish Mehta has built a science-led company over 45 years and the family owns 78%, so interests are broadly aligned. But this is a family-controlled board with the independent chair leaving, a commercial relationship with the promoters\' US company that is large and slow-paying, and a Gennova buyout whose price we cannot reconcile with Gennova\'s earnings. None of this is disqualifying; all of it argues against paying a premium multiple.' },
  ],
};

const STREET_F = [['ICICI Direct (4-Sep)', icici], ['Motilal Oswal (7-Aug)', mosl], ['BOB Capital (6-May)', bob]];
const fmtSt = (s, key, f) => (s[key] ? Object.values(s[key]).map(f).join(' / ') : '–');
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}; in line with the street for FY27, ~5% below for FY28 on slower international growth`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}}. FY27E EPS growth is ${Math.round((epsU[0] / byBase[2026] - 1) * 100)}% on FY26 EPS before exceptional items (₹${n1(byBase[2026])}) and ${Math.round((epsU[0] / 48.76 - 1) * 100)}% on reported EPS: margin +80bp and no minorities, against higher interest after the July payouts and no currency gains. FY28E grows ${Math.round((epsU[1] / epsU[0] - 1) * 100)}% on lower interest and operating leverage.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', ...STREET_F.map(s => s[0])], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ...STREET_F.map(([, s]) => fmtSt(s, 'sales', n0))],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', ...STREET_F.map(([, s]) => fmtSt(s, 'ebitda', n0))],
      ['EPS (₹)', n1(epsU[0]), n1(epsU[1]), n1(epsU[2]), ...STREET_F.map(([, s]) => fmtSt(s, 'eps', n1))],
      ['EPS on 18.96 cr shares (₹)', '', '', '', '62.3 / 76.8', `${n1(moslEps.FY27E)} / ${n1(moslEps.FY28E)}`, '61.3'],
    ], source: 'GAM; ICICI Direct (4-Sep-2026; EBITDA incl. exchange gains), Motilal Oswal (7-Aug-2026; its EPS uses ~18.1 cr shares), BOB Capital Markets (6-May-2026). Street columns show FY27E / FY28E.' } },
    { exhibit: { type: 'column', title: 'FY28E EPS: GAM below the bulls', unit: 'FY28E EPS (₹), on 18.96 cr shares', x: ['GAM', 'ICICI Direct', 'Motilal Oswal'], series: [{ name: 'FY28E EPS', values: [Math.round(epsU[1] * 10) / 10, icici.eps.FY28E, Math.round(moslEps.FY28E * 10) / 10], fmt: 'n1' }], labels: 'all', highlight: 'GAM', source: 'Broker notes; GAM' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ...LINES.map(l => [`${LBL[l]} growth`, ...BL.growth[l].map(x => x + '%'), { india: 'Q1 +10.2% (6-7% organic); market 8-9%; Zuventus recovery in H2', europe: 'Q1 +32.8% incl. ~12pp currency; amphotericin B, Manx; mid-teens CAGR guided', canada: 'Q1 +24.6%; share gains, launches; no semaglutide counted', row: 'Q1 +44.8% (ARV 2/3); ARV 50-55% for FY27; tenders lumpy' }[l]]),
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', '+80bp in FY27 (guidance 70-100bp); gross margin ~59%; R&D 4-5%'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), '₹400-425 cr guided for FY27'],
      ['Interest (₹ cr)', ...AS.interest.map(n0), `${KD}% on average gross debt (₹${avgGD.map(n0).join(' / ')} cr) + leases ₹${LEASE_INT} cr + other ₹${OTHER_FIN + ADV_TAX} cr + earn-out unwind ₹${UNWIND[0]} cr (FY27)`],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'FY26 26% before exceptional items; Q1 25.7%'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Treasury income (interest + fund gains)', '3.2', ...oiTreas.map(n1), `${TY_OP}% on ~₹${CASH_MIN} cr of operating cash + ${TY_SURPLUS}% on surplus cash (gross cash ₹${grossCash.map(n0).join(' → ')} cr, Mar-26 to Mar-29E)`],
      ['Miscellaneous (rent, write-backs, insurance, licence income)', '9.5', n1(MISC), n1(MISC), n1(MISC), 'FY26 ₹9.5 cr incl. one-time licence income'],
      ['Foreign-exchange gains', '118.8', '0', '0', '0', 'Not forecast (Q1FY27 ₹23 cr)'],
      ['Asset-sale gains', '–', '0', '0', '0', 'FY25 ₹38.2 cr; one-off'],
      { hl: true, cells: ['**Total (model)**', '**12.7 (ex-FX)**', ...AS.otherIncome.map(v => `**${n0(v)}**`), `Twelve months to Jun-26 (Screener, ex-FX): ₹${n0(ttmOi)} cr`] },
    ], source: 'AR FY26 note 30; Screener.in quarterly schedules; GAM (checked in EMCURE.ctx.js)' } },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
