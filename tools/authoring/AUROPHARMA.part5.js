// Aurobindo Pharma report, part 5: moat scorecard, Q1FY27 and guidance, earnings quality, ownership, governance.
const X = require('./AUROPHARMA.ctx');
const { C, D, F, A, n0, n1, pc, rup, Q1, FY26, ACC, OB, b, ix, shortDate, SQ } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale and backward integration; no pricing power',
  blocks: [
    { verdicts: D.moat.map(m => [m.area, m.verdict, rup(m.evidence), rup(m.soWhat)]), head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'GAM Research; company presentations and calls' },
    { callout: '**Honest verdict:** Aurobindo has a cost moat, not a franchise. Its breadth (700+ approved US products, 4,000+ European registrations) and its own APIs, now including penicillin starting materials, let it supply cheaply and reliably, which keeps it in the top tier of generics suppliers. But it has no brands that doctors ask for, no meaningful Indian business and no product that holds its price for long. Returns (ROE ~10-11%) show it: the advantage protects volumes, not margins. If the biosimilar and contract-manufacturing bets work, that could change after FY29.' },
  ],
};

const OIQ = { Q1FY26: 105, Q2FY26: 116, Q3FY26: 154, Q4FY26: 117, Q1FY27: 212 }; // company other income (Q2 = FY26 492 less the other three)
const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: a clean beat on currency and Europe; FY27 guidance of 21%+ and ₹8,000 cr+ kept',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore unless stated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q1.revenuePrior), n0(Q1.revenue), `+${Q1.revenueYoYPct}% (rupee ₹${Q1.fxAvg} vs ₹${Q1.fxAvgPrior} per $)`],
      ['  US (US$ mn)', SQ[4].usUsd, Q1.usUsdMn, pc((Q1.usUsdMn / SQ[4].usUsd - 1) * 100)],
      ['  Europe (EUR mn)', SQ[4].europeEur, Q1.europeEurMn, `+${Q1.europeCcGrowthPct}% constant currency`],
      ['  Growth Markets / ARV (US$ mn)', `${SQ[4].gmUsd} / ${SQ[4].arvUsd}`, `${Q1.gmUsdMn} / ${Q1.arvUsdMn}`, '+26% / −15%'],
      ['  APIs', n0(SQ[4].api), n0(Q1.api), `+${Q1.apiGrowthPct}%`],
      ['Gross margin', `${Q1.grossMarginPriorPct}%`, `${Q1.grossMarginPct}%`, '+153bp'],
      ['R&D (% of revenue)', '~365 (4.6%)', `${Q1.rdCr} (${Q1.rdPct}%)`, 'Phase-3 biosimilar trials completed'],
      ['EBITDA before forex (operating, before the ₹43 cr lease write-off)', n0(Q1.ebitdaPrior), `${n0(Q1.ebitda)} (${n0(Q1.opEbitda)})`, `${pc((Q1.ebitda / Q1.ebitdaPrior - 1) * 100)} (${pc((Q1.opEbitda / Q1.ebitdaPrior - 1) * 100)})`],
      ['  margin', `${Q1.marginPriorPct}%`, `${Q1.ebitdaMarginPct}% (${Q1.opMarginPct}%)`, '+20bp (+60bp)'],
      ['Other income / forex gain / exceptional item', `${Q1.otherIncomePrior} / 0 / 0`, `${Q1.otherIncome} / ${Q1.fxGain} / ${Q1.exceptional}`, 'Other income doubled (not explained)'],
      ['Tax rate', '31.7%', `${Q1.taxRatePct}%`, 'Guided 28-29% by year-end'],
      { hl: true, cells: ['**Profit attributable to owners (EPS ₹)**', `**${n0(Q1.patPrior)} (${Q1.epsPrior.toFixed(2)})**`, `**${n0(Q1.patOwners)} (${Q1.eps.toFixed(2)})**`, `**${pc((Q1.patOwners / Q1.patPrior - 1) * 100)}**`] },
    ], source: 'Q1FY27 presentation (5-Aug-2026) and call (6-Aug-2026); ICICI Direct quarterly table' } },
    { bullets: [
      `**Why it beat:** Europe (+26% in rupees) and Growth Markets (+38%) on top of a ~10% weaker rupee; gross margin +153bp on own Pen-G/6-APA and mix; R&D down ₹20 cr as biosimilar trials ended. PL (Hold) noted the beat was "partly aided by currency tailwinds".`,
      `**What was weak:** the US fell 2% in dollars year on year ($${Q1.usUsdMn}mn); ARV −15% in dollars; employee cost +20%; an exceptional charge (₹40 cr) and a ₹43 cr lease write-off inside EBITDA.`,
      '**Cash:** free cash flow from the business US$98mn; US$247mn paid for Lannett and US$85mn for the buyback, so net cash fell from US$317mn to US$42mn.',
      '**What changed after the call (to 30-Sep-2026):** Eugia Unit I received an FDA warning letter (13-Aug, disclosed 14-Aug); the A1 Biochem CRO deal (US$17mn EV, agreed Jul) moved towards closing; HSBC reiterated Buy (₹1,900, 1-Sep); the AGM was held on 27-Aug.',
    ] },
    { exhibit: { type: 'table', title: 'What management said, and what happened (Feb-Aug 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome || '–')]), source: 'Q3FY26, Q4FY26 and Q1FY27 calls and presentations' } },
    { callout: '**Credibility check:** management delivered its FY26 margin target (20.4% vs "higher side of 20-21%") and has kept FY27 guidance after Q1 (₹1,924 cr of operating EBITDA, ~₹7,700 cr annualised before Lannett). ₹8,000 cr+ needs ~₹2,050 cr a quarter for the rest of the year: reachable with Lannett and seasonally stronger antibiotics in H2. The weak spot in its record is compliance: Eugia was called "procedural" in Feb-2026 and was OAI by Jun-2026.' },
  ],
};

const OI = ACC.otherIncomeFy26;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: reasonable, but exceptional items, other income and capitalised R&D need watching',
  blocks: [
    { bullets: [
      `**Exceptional items recur.** ${ACC.exceptionals.map(e => `${e.fy}: ${e.item.toLowerCase()} (₹${n0(e.preTaxCr)} cr)`).join('; ')}. FY21's Natrol gain is large enough to distort the reported P/E history (and its trough test), so we value on EPS before exceptional items (see Valuation).`,
      `**Other income is partly one-off.** FY26 other income was ₹${n0(OI.total)} cr (~10% of pre-tax profit): ₹${n0(OB.treasury26)} cr of treasury income (3.2% on ~₹9,500 cr of average gross cash), ₹${n0(OB.leaseInterest26)} cr of interest on a US sub-lease receivable that has now been written off, ₹${n0(OI.misc)} cr of unexplained "miscellaneous income" and small write-backs. FY25 included a ₹120.5 cr gain on that sub-lease. Q1FY27 other income doubled to ₹${Q1.otherIncome} cr without explanation. Screener adds forex gains and nets exceptional items, so its figures differ.`,
      `**Some development spend is capitalised.** Intangible assets under development rose from ₹1,634 cr to ₹2,205 cr in FY26 (product filings, biosimilars), on top of ₹${n0(FY26.rdCr)} cr of R&D expensed (4.7% of revenue). Capitalised development flatters EBITDA today and adds amortisation and impairment risk later.`,
      `**Cash conversion is weak.** Operating cash flow was ${Math.round(A.cfoToEbitda[ix('FY24')])}%, ${Math.round(A.cfoToEbitda[ix('FY25')])}% and ${Math.round(A.cfoToEbitda[ix('FY26')])}% of EBITDA in FY24-26 (Screener); inventory was 326 days of material cost in FY26. Free cash flow after capex was ₹${n0(A.fcfCalc[ix('FY26')])} cr in FY26 and negative in FY24.`,
      '**High tax rate.** 31.5% in FY26 and 31.9% in Q1FY27, because losses in new subsidiaries (CuraTeQ, TheraNym, China) get no tax credit. It should fall as they turn profitable (guided 28-29%).',
      '**Small minorities and JV.** Minorities absorbed a ₹2 cr loss in FY26; we use profit attributable to owners (patch to Screener\'s net-profit row). Equity-accounted JVs are immaterial.',
      `**Audit and disclosures.** ${C.governance.auditor}; unmodified opinion for FY26. Revenue by business is disclosed every quarter; EBITDA by business is not (except management comments). Contingent liabilities (mainly tax) were ₹682 cr at Mar-2026 (~₹12 a share).`,
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing alarming, but several items move reported EPS by 1-5% in a typical year (exceptional items, the sub-lease gain and write-off, forex, unexplained other income), development spend is increasingly capitalised, and working capital absorbs a large part of profit. We forecast no exceptional items and no forex gains.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The founding families (the Penaka family of P.V. Ramprasad Reddy and the Kambam family of K. Nithyananda Reddy) and related entities own ${OH.categoriesPct.promoter}% (Jun-2026), mostly through RPR Sons Advisors (33.54%). ${OH.pledgePctOfEquity}% of the company (${OH.pledgePctOfPromoter}% of the promoter stake) is pledged, chiefly by RPR Sons and K. Nithyananda Reddy (38% of his 4.37%). Indian mutual funds own ${OH.categoriesPct.mf}% (Quant 4.96%, SBI 3.57%, HDFC 3.22%), insurers ${OH.categoriesPct.insurance}% (LIC 2.94%), the NPS Trust 2.74% and foreign investors ${OH.categoriesPct.fpi}% (down from 20.7% in Dec-2023); the public ${OH.categoriesPct.public}%. The Apr-May 2026 buyback cut the share count to ${(OH.shares / 1e7).toFixed(2)} cr.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (Jun-2026)', head: ['Holder', 'Stake', 'Pledged (share of holding)', 'Note'], wide: [3], rows: [
    ...OH.promoters.map(h => [h.name, h.pct.toFixed(2) + '%', h.pledgedPct ? h.pledgedPct.toFixed(1) + '%' : '–', 'Promoter group']),
    { hl: true, cells: ['**All promoters**', `**${OH.categoriesPct.promoter}%**`, `**${OH.pledgePctOfPromoter}%**`, `${OH.pledgePctOfEquity}% of the company`] },
    ...OH.institutions.map(h => [h.name, h.pct.toFixed(2) + '%', '–', /NPS|LIC/.test(h.name) ? 'Insurer / pension' : 'Domestic mutual fund']),
  ], source: 'Shareholding pattern 30-Jun-2026 (company website / BSE); fund houses shown as one line' } },
  { callout: '**Our read:** control is secure (52%); the families tendered 2.4mn shares into the 2026 buyback but have not sold in the market, and both buybacks nudged their stake up. The pledge (7% of the company) is the watch point: a sharp fall in the share price could force sales. No foreign investor holds more than 1%, so Indian funds now set the marginal price.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a founder-run company with a professional board, a pledge and a political shadow',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Adequate', 'Deloitte Haskins & Sells since 2022, unmodified opinion; quarterly business-wise revenue; no segment EBITDA.', 'No red flags; some opacity (other income, capitalised development).'],
      ['Board', 'Adequate', 'Nine directors, four independent incl. the non-executive chairman (former LIC chairman) and one woman; two founders and the son of one on the board.', 'Independent chair helps; the family still dominates the board.'],
      ['Promoter pledge', 'Watch', `${D.ownership.pledgePctOfEquity}% of equity pledged (Jun-2026).`, 'A forced-selling risk in a sharp sell-off.'],
      ['Promoter director and the ED case', 'Weak', 'P. Sarath Chandra Reddy (founder\'s son) was arrested by the ED in Nov-2022 in the Delhi liquor-policy case, turned approver in 2023 and was re-appointed a director at the Sep-2025 AGM; the company bought ₹52 cr of electoral bonds, the first ₹5 cr days after his arrest.', 'Reputational; the company says the case is unconnected to its business.'],
      ['Legacy legal cases', 'Watch', 'CBI land-allotment cases against the company and a subsidiary (₹13.2 cr deposited with the ED); US price-fixing civil suits (the DOJ dropped Aurobindo as a target in 2024).', 'Tail risks; no provisions.'],
      ['Plant compliance', 'Weak', 'Eugia Unit III warning letter (2024) and OAI (2026); Unit I warning letter (Aug-2026); the 2024 letter followed data-integrity findings.', 'The main operational governance risk.'],
      ['Capital allocation', 'Moderate', 'Disciplined on cash returns (two buybacks), but a US$5.5bn Zentiva bid (2025) and heavy capex with ROE ~10-11%.', 'Shareholders bear a lot of investment before returns.'],
      ['Pay', 'Fine', 'MD 75x and whole-time director 95x the median employee; no raise in FY26.', 'Moderate for a company this size.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, shareholding pattern, FDA, ECI data via news reports)' },
  ],
};

module.exports = { moat, guidance, quality, ownership, governance, OIQ };
