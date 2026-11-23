// Ather Energy report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./ATHERENERG.ctx');
const { C, D, F, A, n0, n1, rup, b, shortDate } = X;
const Q = C.q1fy27, QK = X.QK, FY = C.fy26, q1 = QK.find(q => q.q === 'Q1FY27'), q0 = QK.find(q => q.q === 'Q1FY26');
const yoy = (a, p) => X.pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: volumes +81%, first positive EBITDA on the company\'s measure, capacity the bottleneck',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Scooters sold (wholesale)', n0(q0.units), n0(q1.units), yoy(q1.units, q0.units)],
      ['Registrations (retail)', n0(q0.registrations), n0(q1.registrations), yoy(q1.registrations, q0.registrations)],
      ['Revenue from operations', n0(Q.revenuePrior), n0(Q.revenue), yoy(Q.revenue, Q.revenuePrior)],
      ['Adjusted gross margin (company)', `${q0.agmPct}%`, `${q1.agmPct}%`, '−60bp'],
      ['EBITDA before other income (Screener)', n0(Q.ebitdaScreenerPrior), n0(Q.ebitdaScreener), `margin ${n1(Q.ebitdaScreenerPrior / Q.revenuePrior * 100)}% → ${n1(Q.ebitdaScreener / Q.revenue * 100)}%`],
      ['EBITDA incl. other income (company)', '−106', n1(q1.ebitdaCo), `${q0.ebitdaCoPct}% → +${q1.ebitdaCoPct}%`],
      ['Other income', n1(Q.otherIncomePrior), n1(Q.otherIncome), yoy(Q.otherIncome, Q.otherIncomePrior)],
      { hl: true, cells: ['**Net loss / EPS (₹)**', `**${n1(Q.patPrior)} / ${Q.epsPrior}**`, `**${n1(Q.pat)} / ${Q.eps}**`, '**loss −71%**'] },
    ], source: 'Q1FY27 investor presentation (3-Aug-2026); Screener.in' } },
    { bullets: Q.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (May-2026 to Aug-2026)', head: ['When', 'Topic', 'What was said', 'Outcome by 30-Sep-2026'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome || '–')]), source: 'Ather calls (4-May-2026, 3-Aug-2026); Business Today (Konarc, 29-Aug-2026)' } },
    { callout: '**Why it matters:** management gives few hard numbers (no volume, margin or capex guidance), but its operational calls have been broadly right: it flagged the commodity hit a quarter ahead and delivered breakeven while absorbing it. The test for FY27 is the AURIC timetable. A slip of a quarter would cut ~40-50k scooters from our FY27E-FY28E volumes.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts; watch the company\'s EBITDA definition, capitalised R&D and the GST credit',
  blocks: [
    { bullets: [
      '**Two EBITDA definitions.** Ather\'s "EBITDA" adds other income (mostly interest on IPO cash): Q1FY27 was +₹9.5 cr on its measure but −₹33 cr before other income. We use the stricter Screener basis throughout.',
      `**Capitalised development.** Product development is capitalised (intangibles ₹439 cr gross, ₹238 cr under development at Mar-2026, mostly the EL platform) and amortised over ~7 years; R&D spend was ₹${n0(FY.rAndD)} cr in FY26 (₹${n0(FY.rAndDPrior)} cr in FY25). Amortisation of EL starts with production in FY27, adding to depreciation.`,
      `**Deferred revenue and warranty.** ₹${n0(FY.deferredRevenue)} cr of software subscriptions and extended battery warranties are booked over time (a conservative feature); warranty provisions were ₹${n0(FY.warranty)} cr in FY26 and were recalibrated upward in Q4 for commodity prices.`,
      `**Share-based pay** ₹${n0(FY.esopCost)} cr in FY26 (₹${n0(FY.esopCostPrior)} cr in FY25), charged in employee costs.`,
      `**GST credit** of ₹${n0(FY.gstCredit)} cr sits in current assets because EVs pay 5% GST but many inputs 18-28%; it is recovered through refunds and future output tax.`,
      `**FAME-II.** ${rup(FY.fameRefund)}`,
      `**Exceptional item** ₹${n1(-FY.exceptional)} cr in FY26: ${FY.exceptionalNote.toLowerCase()}.`,
    ] },
    { callout: '**Accounting flag: GREEN.** Unmodified audit opinion, simple structure (tiny overseas subsidiaries), net cash, deferred rather than front-loaded revenue. Two disclosure gaps: no quarterly balance sheet, and Screener\'s FY26 cash-flow rows are misaligned (we fixed them from the annual report).' },
  ],
};

const OH = D.ownership, CT = OH.categories;
const ownership = base => ({ ...base, blocks: [
  { p: `At 30-Jun-2026 the promoter group (Hero MotoCorp and the two founders) held ${CT.promoters}%: Hero ${OH.named[0][1]}%, the founders ~5.3% each with their family trusts. Mutual funds held ${CT.mutualFunds}%, all domestic institutions ${CT.dii}% and foreign investors ${CT.fii}% (GIC's Caladium ${OH.named[3][1]}%). Foreign holdings fell from 24% after the IPO as pre-IPO investors sold after their lock-ins; Indian funds bought. ${rup(OH.afterJun)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: [...OH.named.map(([h, p]) => [h, p + '%']), ['Mutual funds (all)', CT.mutualFunds + '%'], ['Foreign investors (all)', CT.fii + '%'], ['Retail and others', CT.public + '%']], source: 'BSE shareholding pattern (Jun-2026) via Trendlyne and Screener.in. Founder stakes include family trusts.' } },
  { callout: '**Our read:** Hero MotoCorp\'s rising stake (warrants at ₹1,260) and the founders\' warrants signal confidence and anchor the register. The overhangs are pre-IPO investors that still hold large blocks (GIC sold ~3% in August) and the 18-month conversion window, which adds ~2% to the share count.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: founder-led and transparent, with one unusual conflict: the biggest shareholder is a rival',
  blocks: [
    { p: rup(D.governance.board) },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor + ' Simple structure; deferred revenue booked conservatively.', 'No accounting red flags.'],
      ['Board', 'Moderate', 'Eight directors, three independent including the chair; three non-executive investor nominees.', 'Independent chair; investor-heavy board.'],
      ['Founders', 'Strong', 'Tarun Mehta (CEO) and Swapnil Jain (CTO) have run Ather since 2013 and are buying more (warrants at ₹1,260).', 'Aligned and accountable.'],
      ['Largest shareholder', 'Watch', rup(D.governance.relatedParty), 'Hero gains either way; minority holders need Ather to win share from Vida too.'],
      ['ESOPs and dilution', 'Moderate', rup(D.governance.esop) + ' Equity raised in FY25, FY26 and FY27.', 'Dilution has been the price of growth.'],
      ['Regulatory history', 'Moderate', rup(D.governance.fame), 'Resolved, but a reminder of subsidy-rule risk.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; exchange filings; shareholding pattern' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: revenue ₹${n0(Math.round(F.sales[2] / 100) * 100)} cr and first annual profit in FY28E`,
  blocks: [
    { p: 'We forecast scooters sold × revenue per scooter (Konarc and the 450/Rizta range built separately), an EBITDA margin (before other income) of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, capex of ₹1,000 / 600 / 900 cr with depreciation at 10% of gross block, other income of 4.5-6.5% on pro forma net cash, no tax until FY29E (then 25.17%, conservatively) and no dividends. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Volume (scooters)', ref: 'kpi.units' }, { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Net cash (forecast) / cash (actual)', ref: 'fin.treasury' },
    ], source: 'Company, GAM Research estimates. Actual-year "net cash" row is gross cash and investments (engine convention).' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E', 'GAM FY29E', 'Street FY29E'], rows: [
      ['Revenue growth, Nomura (10-Sep-26)', '{{F.salesGrowth.0|chg}}', '+54%', '{{F.salesGrowth.1|chg}}', '+100%', '{{F.salesGrowth.2|chg}}', '+31%'],
      ['Revenue (₹ cr), Nomura implied', '{{F.sales.0|num}}', n0(A.sales[b] * 1.54), '{{F.sales.1|num}}', n0(A.sales[b] * 1.54 * 2), '{{F.sales.2|num}}', n0(A.sales[b] * 1.54 * 2 * 1.31)],
      ['Volume, Nomura', '{{F.volume.0|num}}', '–', '{{F.volume.1|num}}', '~794,000', '{{F.volume.2|num}}', '–'],
      ['EBITDA breakeven, JPMorgan / Nirmal Bang (initiations)', '{{F.ebitdaMargin.0|pct}}', '–', '{{F.ebitdaMargin.1|pct}}', '"by FY28E"', '{{F.ebitdaMargin.2|pct}}', '–'],
    ], source: 'Nomura via Business Today (10-Sep-2026); JPMorgan and Nirmal Bang via Business Today and Multibagg (Jun-Aug 2026). Other brokers\' estimates not available to us (gaps).' } },
    { callout: `Our FY27E revenue is above Nomura's (we include ~37k AURIC units in Q4); our FY28E-FY29E revenue is well below it (Nomura ~₹${n0(Math.round(A.sales[b] * 3.08 / 100) * 100)} cr in FY28 vs our ₹${n0(F.sales[1])} cr) because we assume AURIC runs at ~76% in its first full year and that Konarc lowers revenue per scooter by ~7% in FY28E. That revenue gap explains roughly two-fifths of the distance between our target and Nomura's; the multiple (our ${X.MULT.base}x vs its 5.5x) explains the rest.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
