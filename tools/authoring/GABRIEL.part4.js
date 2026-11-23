// Gabriel India report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./GABRIEL.ctx');
const { C, D, F, AS, n0, n1, pc1, BL, jvTot, jvPctPbt, exJupEps, accretion, ST } = X;
const Q = C.q1fy27.consolidated, S1 = C.q1fy27.standalone, rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const yoy = (a, p) => pc1((a / p - 1) * 100);
const G = Object.fromEntries(C.guidance.map(g => [g.item, g.text]));

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +15.5%, EBITDA +5%, PAT +2% on the restated base; margins slipped, the JV share rose',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (consolidated, ₹ crore; Q1FY26 restated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue', n0(Q.revenueQ1FY26), n0(Q.revenue), yoy(Q.revenue, Q.revenueQ1FY26)],
      ['EBITDA', n1(Q.ebitdaQ1FY26), n1(Q.ebitda), yoy(Q.ebitda, Q.ebitdaQ1FY26)],
      ['EBITDA margin', `${n1(Q.ebitdaQ1FY26 / Q.revenueQ1FY26 * 100)}%`, `${n1(Q.ebitda / Q.revenue * 100)}%`, `${Math.round((Q.ebitda / Q.revenue - Q.ebitdaQ1FY26 / Q.revenueQ1FY26) * 10000)}bp`],
      ['Share of JV profit (Dana, Henkel, SK Enmove)', n1(Q.jvShareQ1FY26), n1(Q.jvShare), yoy(Q.jvShare, Q.jvShareQ1FY26)],
      ['Standalone revenue', n0(S1.revenueQ1FY26), n0(S1.revenue), yoy(S1.revenue, S1.revenueQ1FY26)],
      ['Standalone EBITDA (company)', n0(S1.ebitdaCompanyQ1FY26), n0(S1.ebitdaCompany), yoy(S1.ebitdaCompany, S1.ebitdaCompanyQ1FY26)],
      { hl: true, cells: ['**Net profit to shareholders**', `**${n1(Q.patQ1FY26)}**`, `**${n1(Q.pat)}**`, `**${yoy(Q.pat, Q.patQ1FY26)}**`] },
      ['EPS (₹, on 17.72 cr shares)', n2(Q.epsQ1FY26), n2(Q.eps), yoy(Q.eps, Q.epsQ1FY26)],
    ], source: 'Q1FY27 consolidated and standalone results (21-Jul-2026); Q1FY27 deck' } },
    { bullets: [
      rup(`**Demand was strong.** ${C.q1fy27.industry} Standalone revenue +18.9%, helped by the fluids business and aftermarket.`),
      rup(`**Margins were not.** ${C.q1fy27.margin}`),
      rup(`**Cars lagged.** ${C.q1fy27.pv}`),
      rup(`**Sunroofs:** ${C.q1fy27.sunroof}`),
      '**Brokers:** Motilal Oswal said EBITDA beat its estimate by 15%; Choice saw EBITDA 4% and PAT 12% below its estimates. Both rest on different definitions of the restated base.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-2026 to Jul-2026)', head: ['Topic', 'What was said'], wide: [1], rows: Object.entries(G).map(([k, v]) => [k, rup(v)]), source: 'Q4FY26 call (28-May-2026); Q1FY27 call (22-Jul-2026)' } },
    { callout: '**Why it matters:** management gives directions, not numbers: no revenue or margin guidance, a capex range and a leverage target. The group\'s ₹50,000 cr 2030 revenue target is a consolidation plan more than an organic forecast, so the growth investors are paying for depends on future related-party deals as much as on vehicle production.' },
  ],
};
function n2(v) { return (Math.round(v * 100) / 100).toFixed(2); }

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but restated, part-unreviewed history and a rising non-cash profit share',
  blocks: [
    { bullets: [
      '**Restated history.** FY26 was restated by pooling of interests; the undertaking\'s Q1FY26 and Q4FY26 figures were furnished by management and not reviewed by the auditor (results note 1). FY25 and earlier are not restated, Q2-Q3FY26 restated were not published separately, and FY27 will include the Jupiter stakes for ~6.5 months.',
      `**Non-cash profit share.** Share of JV profit was ${n1(X.jvPct26)}% of restated FY26 profit before tax and ~${Math.round(jvPctPbt[1])}% of our FY28E. Cash arrives only through dividends set by the partners (none of the restated FY26 dividends are disclosed). The engine counts the share of profit as cash: our net cash forecast is therefore really "net cash plus the stakes at book".`,
      '**Fair-value stakes.** The Jupiter stakes were bought at negotiated values (₹2,231 cr and ~₹948 cr) and are carried as associates; the purchase-price allocation, and any amortisation of fair-value uplifts within the share of profit, was not known by 30-Sep-2026.',
      '**Exceptional items.** FY26 had a ₹15.3 cr labour-code charge (consolidated). Deal advisory costs for Rise and Jupiter were expensed in the P&L and described as immaterial (CFO).',
      '**Cash conversion of the operations is good.** Cash from operations was 73-97% of EBITDA in FY24-26 (Screener, pre-scheme); working capital is ~20-30 days.',
    ] },
    { callout: '**Accounting flag: AMBER.** Unmodified PwC audit and a conventional business, but the reported numbers will be hard to compare for at least two years, a growing part of profit is a non-cash share of companies Gabriel does not control, and the inputs were set in related-party transactions.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: rup(`At Jun-2026 the promoter group held ${OH.categories.promoters}% (Asia Investments 42.67%, Anfilco on behalf of Anand Automobiles 18.58%, family members ~2.3%), mutual funds ${OH.categories.mutualFunds}%, foreign portfolio investors ${OH.categories.fpi}%, insurers ${OH.categories.insurance}% and retail and others ${OH.categories.retailAndOthers}%. ${OH.trend} ${OH.after}`) },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders we can name (Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p != null ? p + '%' : 'n.d.']), source: rup(OH.src) } },
  { callout: '**Our read:** the family has raised its stake from 55% to ~66% without buying shares in the market: it sold assets to Gabriel for new shares. Free float is now ~34%. Institutions that held 23% before the scheme hold ~19%, diluted rather than sellers. Investors are now minority partners in a family holding structure; that is not bad in itself, but it puts the weight on governance.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: professional management, a family board, and the promoter on both sides of the deals',
  blocks: [
    { p: rup(`${C.management.map(m => `${m.name} (${m.role})`).join('; ')}. The auditor is ${C.accounting.auditor} The group is run by professional managers (Group CEO Mahendra Goyal, Group CFO Manish Mundra) under the Anand family, whose member Anjali Singh chairs the board.`) },
    { verdicts: [
      ['Audit and accounts', 'Good', 'PwC; unmodified opinion; restatement by pooling disclosed', 'No red flags; comparability is the issue'],
      ['Related-party deals', 'Watch', 'Promoter sold Gabriel a 28.99% stake for ₹1,881 cr of new shares + ₹350 cr cash; scheme issued 3.36 cr shares to promoter-group holders; independent valuers, audit committee and AGM approved', 'Priced reasonably (21.5x), but the promoter chose the assets and the timing'],
      ['Capital allocation', 'Watch', 'From net cash to ~₹1,250 cr net debt in a quarter; ROE falls from ~20% to ~13-15%', 'EPS-accretive, returns-dilutive'],
      ['Board', 'Moderate', 'Family chairperson (whole-time director); professional CEO', 'Typical promoter-led board'],
      ['Disclosure', 'Good', 'Entity-level financials of every JV in the decks; valuation reports published; candid calls', 'Better than most mid-caps'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; scheme, Jupiter and allotment filings; Q1FY27 deck and call' },
  ],
};

const MO = ST.find(s => s.broker === 'Choice Institutional Equities'), AR = ST.find(s => s.broker === 'Arihant Capital'), IS = ST.find(s => s.broker === 'ICICI Securities');
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, below most of the street',
  blocks: [
    { p: `We build revenue and EBITDA by entity (standalone +${BL.saGrowth.join('% / +')}% at ${BL.saMargin.join('% / ')}%; subsidiaries +${BL.subGrowth.join('% / +')}% at ${BL.subMargin.join('% / ')}%) and other income from the stakes (recurring ₹${AS.recurringOI.join(' / ')} cr + share of profit ₹${jvTot.map(n0).join(' / ')} cr). Capex ₹${AS.capex.join(' / ')} cr; depreciation ${AS.depRateOnGrossBlock}% of gross block; interest ₹${AS.interest.join(' / ')} cr (NCDs at 8.15% from Sep-2026); operating tax ${AS.opTaxRate[0]}% on profit before the JV share plus minorities (effective ${AS.taxRate.map(n1).join(' / ')}%); payout ${AS.payout[0]}%. All per-share numbers use 19.16 cr shares; FY27E therefore carries the full share count but only ~6.5 months of HL Mando Anand. Without Jupiter (17.72 cr shares, no stakes, no NCD interest) our EPS would be ₹${exJupEps.map(n1).join(' / ')}: the deal adds ~${Math.round(accretion[1])}% to FY28E.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth (FY26: restated vs reported FY25)', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income incl. JV share', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹; FY26 on 19.16 cr shares)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, Screener.in, GAM Research estimates. FY23 standalone; FY26 restated; FY26 EPS on today\'s shares.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'Revenue FY27E', 'Revenue FY28E', 'EBITDA FY28E', 'EPS FY27E (₹)', 'EPS FY28E (₹)', 'EPS FY29E (₹)'], rows: [
      ['Choice (22-Jul-2026)', n0(MO.revenue.FY27E), n0(MO.revenue.FY28E), n0(MO.ebitda.FY28E), n1(MO.eps.FY27E), n1(MO.eps.FY28E), 'n.d.'],
      ['Arihant (24-Jul-2026)', n0(AR.revenue.FY27E), n0(AR.revenue.FY28E), '690', n1(AR.eps.FY27E), n1(AR.eps.FY28E), n1(AR.eps.FY29E)],
      ['ICICI Securities (23-Jul-2026)', 'n.d.', 'n.d.', 'n.d.', 'n.d.', n1(IS.eps.FY28E), 'n.d.'],
      ['Motilal Oswal (22-Jul-2026)', 'n.d.', 'n.d.', 'n.d.', 'n.d.', '~41.6 (implied: ₹1,664 ÷ 40x)', 'n.d.'],
      { hl: true, cells: ['**GAM Research**', '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', '**{{F.eps.2|n1}}**'] },
    ], source: 'Choice and Arihant result updates (₹ mn converted); ICICI Securities company update (FY28E PAT ₹787 cr on 19.2 cr shares); MOSL summary (investmentguruindia); GAM Research' } },
    { callout: `**Where we differ:** our revenue and EBITDA are close to Choice and Arihant; our FY28E EPS (₹{{F.eps.1|n1}}) is near Arihant's ₹${AR.eps.FY28E} but ~16% below ICICI Securities and Choice (~₹41). The gap is (1) interest: we charge ₹${AS.interest[1]} cr in FY28E for the NCDs and other debt, which ICICI Securities' sum-of-profits table leaves out; (2) HL Mando Anand: ICICI's ₹155 cr FY28E share implies ~22% a year profit growth, we take 12% (₹${n0(X.jvOf('hmai')[1])} cr); (3) Choice's FY27E EPS of ₹34.7 seems to include a full year of the stakes. On ₹41 of FY28E EPS our ${X.MULT.base}x would give ~₹${n0(Math.round(X.MULT.base * 41 / 10) * 10)}.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
