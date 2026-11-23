// Zydus Lifesciences report, part 4: margins, earnings quality, ownership, governance, our forecasts vs the street.
const X = require('./ZYDUSLIFE.ctx');
const { C, D, SA, SQ, QL, Q1, FY26, F, A, AS, bld, BL, OB, oiPre, oiFy26, oiTtm, repDA, TB, taxRows, finRows, n0, n1, pc, rup, ST, avgEps, SH_POST } = X;
const f26 = SA.find(a => a.fy === 'FY26');
const fxPp = f26.fxGain / f26.revenue * 100, saroPp = 70 * 95.6 / 10 / F.sales[0] * 100, fxF = 0.5;
const resid = F.ebitdaMargin[0] - (f26.ebitdaMarginPct - (fxPp - fxF) - saroPp);

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: 31.2% in FY26 was a peak built on windfalls and forex; ~24% is the new base',
  blocks: [
    { p: `Company-basis EBITDA margin went from 21.9% (FY22) to 27.5% (FY24), 30.4% (FY25) and 31.2% (FY26), then 24.1% in Q1FY27. Gross margin tells the same story: 72.7% in FY25 and 73.1% in FY26, 72.1% in Q1FY27 as gRevlimid left and the Mirabegron per-unit licence fee entered cost of goods. Two other things moved the line. Zydus books exchange gains inside other expenses: ₹${n0(f26.fxGain)} cr in FY26, ${n1(fxPp)}% of revenue, up to 8 points in a single quarter (Q4FY26). And acquisitions added costs faster than profit: other expenses excluding R&D rose 45-50% YoY in Q1FY27, about 80% of it from deals (CFO).` },
    { pair: [
      { type: 'waterfall', title: `From 31.2% to ${n1(F.ebitdaMargin[0])}%: forex and Saroglitazar explain most of it`, unit: 'EBITDA margin, FY26 to FY27E (percentage points); GAM estimates from company data', x: ['FY26', 'Forex gains (to ~0.5%)', 'Saroglitazar spend (~US$70 mn)', 'gRevlimid, Mirabegron, deals, mix (net)', 'FY27E'], series: [{ name: 'pp', values: [f26.ebitdaMarginPct, -(fxPp - fxF), -saroPp, resid, F.ebitdaMargin[0]].map(v => Math.round(v * 10) / 10), fmt: 'n1' }], fmt: 'n1', totalFmt: 'pct', min: 0, max: 34, source: 'AR FY26 and presentations (forex); Q4FY26 call (Saroglitazar US$70 mn); GAM Research (residual)' },
      { type: 'line', title: 'Gross margin slipped to 72.1% in Q1FY27', unit: 'Gross margin (%)', x: QL, series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }], labels: 'all', min: 65, max: 76, source: 'Company presentations; MOSL' },
    ] },
    { p: `**Where we land:** {{F.ebitdaMargin.0|pct}} in FY27E (guidance "~24%"), {{F.ebitdaMargin.1|pct}} in FY28E (the Saroglitazar launch year with little revenue; more Mirabegron competition) and {{F.ebitdaMargin.2|pct}} in FY29E. Management aims for 28-30% within five years as branded products pass two-thirds of revenue. We think that needs Saroglitazar to succeed and US biosimilars to arrive, so we do not model it. Below EBITDA, reported D&A rises from ₹1,408 cr (FY26) to ~₹${n0(repDA[0])} cr in FY27E (acquisition amortisation and the Mirabegron licence, ₹${OB.licenceAmort[0]} cr) and finance cost from ₹439 cr to ~₹${AS.interest[0]} cr.` },
    { callout: `**Every 100bp of EBITDA margin is ~₹${n0(F.sales[1] / 100)} cr of FY28E EBITDA, ~₹${n1(F.sales[1] / 100 * (1 - taxRows[1].rate / 100) / X.SH_ENGINE)} of EPS (~${Math.round(F.sales[1] / 100 * (1 - taxRows[1].rate / 100) / F.pat[1] * 100)}%).** Each ₹1 move in the rupee against the US dollar shifts FY28E North America revenue by ~₹${n0(bld[1].usd / 10)} cr.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: AMBER. Forex in EBITDA, recurring "exceptional" items and ₹17,400 cr of acquired intangibles',
  blocks: [
    { exhibit: { type: 'table', title: 'What to adjust for when reading Zydus\'s numbers', head: ['Item', 'FY26 / Q1FY27', 'Treatment', 'Our view'], wide: [1, 3], rows: [
      ['Forex gains inside EBITDA', `₹${n0(f26.fxGain)} cr (14% of FY26 EBITDA); ₹${n1(Q1.fxGain)} cr in Q1FY27`, 'In "other expenses"; brokers (PL, MOSL, JM) move them to other income', 'Real cash but not repeatable; we assume only ~0.5% of revenue in FY27E and none in the multiple history.'],
      ['Exceptional items', `₹517 cr (FY26: Mirabegron US$45 mn ₹398 cr, labour code ₹85 cr, deal costs ₹25 cr); ₹220 cr (FY25: impairments); ₹18 cr (Q1FY27)`, 'Excluded from the company\'s "adjusted PAT"', 'The Mirabegron payment is a cost of earning Mirabegron profits; exceptional items recur most years. We still use EPS before them for the multiple (PLAYBOOK one-offs rule), and say so.'],
      ['Mirabegron licence', 'US$75 mn (₹662.5 cr) capitalised, amortised over 19 months to Sep-2027 (~₹105 cr a quarter)', 'Inside D&A, not EBITDA', 'Flatters EBITDA by ~1.3 points; in our EPS.'],
      ['Acquisition accounting', 'Goodwill ₹7,543 cr + intangibles ₹7,332 cr + under development ₹2,533 cr = 64% of owners\' equity; PPAs provisional (Amplitude, Comfort Click, Agenus, Assertio)', 'Amortisation of acquired intangibles in D&A', 'Goodwill is tested for impairment yearly (Brazil written off in FY25); PPA changes can move D&A.'],
      ['Minorities', '₹83.5 cr (FY26), ₹50.4 cr (Q1FY27): 42.41% of Zydus Wellness', 'Screener\'s "Net Profit" is before minorities', 'We use attributable profit (ZYDUSLIFE.patch.js) and carry minorities in the tax line.'],
      ['Cash conversion', 'Operating cash flow ₹2,117 cr in FY26 = 25% of EBITDA (122% in FY25)', 'Mirabegron payments, acquired working capital, inventory 282 days', 'Watch FY27: we assume CFO recovers to ~65% of EBITDA.'],
      ['Tax rate', '22.3% before exceptional items in FY26; 27.1% in Q1FY27 (UK tax disallowance)', '—', 'We use 25-25.5%.'],
    ], source: 'AR FY26 notes 3, 30, 34, 44, 48, 49, 54; Q4FY26 and Q1FY27 presentations and calls; PL and MOSL notes' } },
    { callout: '**Verdict: AMBER.** Nothing suggests aggressive accounting, the auditor (Deloitte) is clean and the company discloses its forex gains and exceptional items line by line. But reported EBITDA and "adjusted" profit both flatter the underlying business: forex gains were 14% of FY26 EBITDA, exceptional charges recur, and acquisition accounting now drives a large and rising D&A line.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The Patel family controls Zydus through the Zydus Family Trust (${C.management.promoter}). Free float is only ~25%, so institutions own little: foreign investors ${D.ownership.categories.fii}%, domestic institutions ${D.ownership.categories.dii}% (mutual funds ${D.ownership.categories.mutualFunds}%), the public ${D.ownership.categories.public}% across ${n0(D.ownership.shareholders)} shareholders (Jun-2026). The Jun-2026 buyback (${n0(C.buyback2026.shares)} shares at ₹1,260) cut the count to ${n1(SH_POST)} cr.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding at 30-Jun-2026', head: ['Holder', 'Stake / note'], wide: [1], rows: [
    ...D.ownership.named,
    ['Foreign portfolio investors', `${D.ownership.categories.fii}%`],
    ['Mutual funds', `${D.ownership.categories.mutualFunds}%`],
    ['Other domestic institutions (insurers, pensions)', `${D.ownership.categories.otherDii}%`],
    ['Public and others', `${D.ownership.categories.public}%`],
    ['Promoter pledge', D.ownership.pledge],
  ], source: D.ownership.src } },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: capable family management, generous pay, a busy deal record',
  blocks: [
    { p: `${C.management.chairman}. ${C.management.md}. CFO: ${C.management.cfo}. ${C.management.director}. Independent directors: ${C.management.independents}. Auditor: ${C.management.auditor}.` },
    { verdicts: [
      ['Promoter alignment', 'Strong', 'Family trust owns ~75%; no pledge; no stock options for directors.', 'Owners think in decades (founded 1952).'],
      ['Execution record', 'Strong', 'India out-grows the market for three years; clean USFDA run since 2025; Saroglitazar and desidustat taken from lab to market.', 'Genuine scientific ambition.'],
      ['Capital allocation', 'Moderate', 'Buybacks at ₹650, ₹1,005 and ₹1,260; then ₹7,000+ cr of deals in 15 months across four unrelated areas.', 'MedTech and Comfort Click earn below Zydus\'s cost of capital so far.'],
      ['Executive pay', 'Moderate', 'MD Sharvil Patel: ₹45 cr in FY26 (+25%) = 685x the median employee, while PAT rose 11%; chairman takes no commission.', 'High even by Indian promoter standards.'],
      ['Board independence', 'Moderate', 'Six independent directors; one (Upasana Konidela, Apollo family) is linked to a customer, Apollo HealthCo, listed in related-party balances.', 'Small but worth noting.'],
      ['Disclosure', 'Moderate', 'Good on forex, exceptional items, segments and acquisitions; never discloses product sales (gRevlimid, Mirabegron).', 'The biggest profit drivers were invisible to investors.'],
      ['Legal and regulatory', 'Moderate', 'US price-fixing MDL: five bellwether trials 2026-2028; opioid case settled (US$17.5 mn); Mirabegron settled.', 'No provision for the price-fixing cases.'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, Annexure D, notes 30 and 47); company calls' },
  ],
};

const streetRow = (n, s) => [n, s.FY27E?.rev ?? '–', s.FY28E?.rev ?? '–', s.FY27E?.ebitda ?? '–', s.FY28E?.ebitda ?? '–', s.FY27E?.eps ?? '–', s.FY28E?.eps ?? '–'];
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs street', kicker: 'Our numbers', title: `Our forecasts: EPS ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])}, 5-12% below the street`,
  blocks: [
    { exhibit: { type: 'table', title: 'Revenue build by business (₹ crore; North America in US$ mn)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['North America (US$ mn)', n0(BL.base.naUsdMn), ...bld.map(r => n0(r.usd))],
      ['Rs per US$', n1(BL.base.fx), ...bld.map(r => n1(r.fx))],
      ['North America (₹ cr)', n0(BL.base.na), ...bld.map(r => n0(r.na))],
      ['India formulations', n0(BL.base.india), ...bld.map(r => n0(r.india))],
      ['International markets', n0(BL.base.im), ...bld.map(r => n0(r.im))],
      ['APIs + alliances', n0(BL.base.api + BL.base.alliances), ...bld.map(r => n0(r.api + r.alliances))],
      ['Consumer Wellness', n0(BL.base.consumer), ...bld.map(r => n0(r.consumer))],
      ['MedTech', n0(BL.base.medtech), ...bld.map(r => n0(r.medtech))],
      ['Other operating revenue', n0(BL.base.otherOp), ...bld.map(r => n0(r.otherOp))],
      { hl: true, cells: ['**Revenue (= model)**', `**${n0(BL.base.revenue)}**`, ...bld.map(r => `**${n0(r.model)}**`)] },
    ], source: 'Q4FY26 presentation; GAM estimates (checked against model revenue in ZYDUSLIFE.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Other income, tax and minorities: built, not plugged (₹ crore)', head: ['', 'FY26', 'TTM Jun-26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury and other income', n0(OB.fy26.total), n0(OB.ttmJun26.otherIncome), ...OB.treasury.map(n0)],
      ['Share of JV profit (after tax)', n1(OB.fy26.jv), n1(OB.ttmJun26.jv), ...OB.jv.map(n0)],
      { hl: true, cells: ['**Other income incl. JV**', `**${n0(oiFy26)}**`, `**${n0(oiTtm)}**`, ...oiPre.map(v => `**${n0(v)}**`)] },
      ['Less: Mirabegron licence amortisation (engine workaround; reported in D&A)', '57', '–', ...OB.licenceAmort.map(v => `(${n0(v)})`)],
      ['= Model "other income"', '–', '–', ...F.otherIncome.map(n0)],
      ['Finance cost', '439', n0(1013 / 10 + 1299 / 10 + 1230 / 10 + 156), ...AS.interest.map(n0)],
      ['Tax rate on PBT excl. JV', '22.3% (pre-exc.)', '—', ...TB.taxOnPbtExJv.map(v => `${v}%`)],
      ['Minorities (42.41% of Zydus Wellness)', n1(83.5), '~79', ...TB.minorities.map(n0)],
      ['= Model tax line (tax + minorities, % of PBT)', '—', '—', ...taxRows.map(r => `${n1(r.rate)}%`)],
    ], source: 'AR FY26 notes 4, 34, 39, 48, 49; quarterly presentations; GAM estimates. FY26 other income excludes ₹517 cr of exceptional items that Screener nets into it.' } },
    { p: `**Reconciliation.** FY27E other income before the licence item (₹${n0(oiPre[0])} cr) is below FY26 (₹${n0(oiFy26)} cr) and the twelve months to Jun-26 (₹${n0(oiTtm)} cr) because the treasury that earned it has been spent on deals and the buyback: Zydus moved from ₹4,888 cr net cash (Mar-25) to ₹5,904 cr net debt (Jun-26). FY26 also had a ₹38 cr swap gain and ₹29 cr of fair-value gains that we do not repeat. Net finance cost (finance cost less treasury income) falls from ₹${finRows[0].net} cr to ₹${finRows[2].net} cr as free cash flow repays debt; we deleverage more slowly than the engine's cash line because the engine's working capital (10.5% of revenue) is lower than Zydus's inventory-plus-receivables-less-payables (~30%).` },
    { exhibit: { type: 'table', title: 'Our forecasts vs the street (notes to 30-Sep-2026; ₹ crore, EPS ₹)', head: ['', 'Revenue FY27E', 'Revenue FY28E', 'EBITDA FY27E', 'EBITDA FY28E', 'EPS FY27E', 'EPS FY28E'], rows: [
      { hl: true, cells: ['**GAM Research**', `**${n0(F.sales[0])}**`, `**${n0(F.sales[1])}**`, `**${n0(F.ebitda[0])}**`, `**${n0(F.ebitda[1])}**`, `**${n1(F.eps[0])}**`, `**${n1(F.eps[1])}**`] },
      ['GAM EBITDA excl. forex (~0.5% of revenue)', '', '', n0(F.ebitda[0] - 0.005 * F.sales[0]), n0(F.ebitda[1] - 0.005 * F.sales[1]), '', ''],
      ['Prabhudas Lilladher (12-Aug-26)', '32,207', '35,369', '7,680', '8,539', '41.7', '47.7'],
      ['Motilal Oswal (11-Aug-26)', '32,242', '35,080', '7,792', '8,210', '40.8', '48.8'],
      ['JM Financial (19-May-26)', '30,033', '30,389', '7,229', '7,052', '38.6', '39.1'],
      ['Post-Q1 average (PL, MOSL)', '32,225', '35,225', '7,736', '8,375', n1(avgEps('FY27E')), n1(avgEps('FY28E'))],
    ], source: 'Broker notes as dated; brokers\' EBITDA excludes forex gains (moved to other income); all EPS on 100.62 cr shares (pre-buyback)' } },
    { callout: `**Why we are below the street:** (1) higher D&A (~₹${n0(repDA[0])} cr vs ₹2,160-2,220 cr in FY27E: Q1's ₹555 cr run-rate plus Assertio amortisation from Q2); (2) a 25-25.5% tax rate (Q1FY27 27.1%) vs ~24%; (3) minorities of ₹${TB.minorities[0]}-${TB.minorities[1]} cr vs ₹40-100 cr; (4) a 23.5% FY28E margin for the Saroglitazar launch year vs 24.1% at PL. Our FY28E EPS of {{F.eps.1|inr}} is ${pc((F.eps[1] / avgEps('FY28E') - 1) * 100)} vs the post-Q1 average; FY29E ({{F.eps.2|inr}}) is where Saroglitazar and specialty start to pay back.` },
  ],
};

module.exports = { margins, quality, ownership, governance, forecasts };
