// Lenskart report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./LENSKART.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, n2, price, shares, evMULT, EVL, rating, buyBelow, sellAbove, medTp, ebitdaSep28, Q1, evSepNow, preMultAt, V } = X;
const tpPerPp = pp => evMULT.base * (F.sales[1] + F.sales[2]) / 2 * pp / 100 / shares; // TP change for 1pp of Sep-28E EBITDA margin

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a strong business at ${n1(evSepNow)}x Sep-28E EBITDA; ${rating} on valuation, not on quality`,
  blocks: [
    { callout: `**What you are buying:** India's largest organised eyewear company, growing ~30% with ~600 new stores a year, a ~70% product margin from its own factories, an International business that has just become properly profitable (${Q1.intlPreIndAsPct}% margin after rent in Q1FY27), ₹${n0(Q1.netCash)} cr of net cash and a long runway (4-6% share of a market that is itself being created). The quality is not in question.` },
    { callout: `**What you are paying:** ₹${n2(price)} is ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS, and ${n1(evSepNow)}x Sep-28E EBITDA before rent (≈${n1(preMultAt(price))}x after rent on the street's basis). Since listing the stock has traded at a median ${n1(EVL.med)}x forward EBITDA; retail multiples have fallen ~12% over the same months. The street (median ₹${n0(medTp)}) pays 48-58x after-rent EBITDA, a premium the stock's own short history and the sector's de-rating do not support under our rule.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['India SSSG re-accelerates above 20% while openings stay ~600', 'Medium', `SSSG ${Q1.sssg}% in Q1FY27 (24.2% in Q4FY26); SPSG gap over SSSG`],
      ['After-rent margin climbs faster towards ~25%', 'Medium', `Pre-IndAS margin ${Q1.preIndAsMarginPct}% in Q1FY27; we model ~16.5-18% by FY29E on our numbers`],
      ['Hyderabad on time and product margin above 71%', 'Medium-High', 'Commissioning ~18 months from May-2026 (late 2027); frames and lenses in-house'],
      ['Pre-IPO supply cleared', 'Medium', 'SoftBank 7.3%, ADIA, PI Opportunities, Macritchie, Steadview stakes in the next patterns'],
      ['A price fall to our BUY level', '–', `Below ~₹${n0(buyBelow)} the rule gives BUY on today's numbers`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Same-store growth fades as stores densify and move to smaller towns', 'Medium', 'India revenue growth in the low 20s; operating leverage stalls'],
      ['Rupee weakness against the renminbi/yen', 'Medium', 'Imported frames and components cost more; product margin under pressure'],
      ['Expensive acquisitions', 'Medium', '₹683 cr of IPO money for acquisitions and general purposes; goodwill already ₹2,198 cr'],
      ['Continued block sales by pre-IPO funds', 'High', 'Supply on every rally; ~2% blocks in Aug and Sep-2026'],
      ['Execution of ~600 stores a year (staff, optometrists, service)', 'Medium', 'NPS and SSSG fall; new-store payback lengthens'],
      ['International margins revert (Q1 was seasonally strong)', 'Medium', 'FY27E International margin below our {{as.segments.1.marginPct.0|pct}}'],
      ['The street keeps paying 50x+ after rent', 'Medium-High', 'Upside risk to our SELL: at Motilal Oswal\'s 49x on our EBITDA the value is ~₹' + n0(X.streetAtOurs(49))],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD below ~₹${n0(sellAbove)}** and to BUY below ~₹${n0(buyBelow)} on today's numbers.`,
      `**This is a valuation call, not a business call.** Our EPS is in the middle of the street (FY28E ₹${n2(F.eps[1])} vs ₹5.6-8.4); the gap is the multiple: the street's 48-58x after-rent EBITDA vs our ≈${n1(preMultAt(V.tp))}x, which comes from Lenskart's own ${n1(EVL.med)}x median since listing and the retail sector's de-rating.`,
      `**Biggest swing factors:** the multiple (each 1x of Sep-28E EBITDA is ~₹${n0(ebitdaSep28 / shares)} a share) and the margin (each point of Sep-28E EBITDA margin moves the target by ~₹${n0(tpPerPp(1))}).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'India revenue growth', v: `+${Q1.indiaGrowth}%`, d: `Q1FY27; SSSG ${Q1.sssg}%` },
      { k: 'Margin after rent', v: `${Q1.preIndAsMarginPct}%`, d: 'Q1FY27; aim ~25% long term' },
      { k: 'Stores', v: n0(Q1.stores), d: '~600 net additions a year' },
      { k: 'EV ÷ Sep-28E EBITDA', v: `${n1(evSepNow)}x`, d: `median since listing: ${n1(EVL.med)}x forward` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Ind AS 116', 'The accounting rule for leases: store rent is booked as depreciation of a right-of-use asset plus interest on a lease liability, not as an operating cost.'],
      ['EBITDA (post-IndAS / reported)', 'Earnings before interest, tax, depreciation and amortisation as reported; under Ind AS 116 it excludes rent.'],
      ['EBITDA pre-IndAS 116 (after rent)', 'EBITDA after deducting rent; the measure Lenskart\'s ~25% long-term aim and the street\'s multiples use.'],
      ['Proforma', 'Prior-year figures restated by the company as if acquisitions (Dealskart, GeoIQ, Meller) had been owned throughout.'],
      ['SSSG', 'Same-store sales growth: revenue growth of stores open at least a year.'],
      ['SPSG', 'Same-pin-code sales growth: revenue growth of all stores in pin codes where Lenskart already had a store; shows whether new stores add or cannibalise demand.'],
      ['ASP', 'Average selling price per eyewear unit.'],
      ['Product margin', 'Revenue less the cost of goods sold (frames, lenses, materials), as a % of revenue.'],
      ['CoCo / FoFo', 'Company-owned company-operated stores / franchise-owned franchise-operated stores.'],
      ['Remote optometry', 'Eye tests done by an optometrist connected by video to a store.'],
      ['Lenskart Gold', 'Paid membership giving discounts and offers; 9.35 mn members at Jun-2026.'],
      ['Tier 2+', 'Smaller cities and towns below the metros and Tier 1 cities.'],
      ['Lock-up', 'A period after an IPO in which existing holders may not sell.'],
      ['Block deal', 'A large negotiated sale of shares in a single trade on the exchange.'],
      ['EV/EBITDA, P/E', 'Enterprise value (market value plus debt including leases, less cash) ÷ EBITDA; share price ÷ earnings per share.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade above or below their own median multiple over a window on the valuation date.'],
      ['DCF', 'Discounted cash flow valuation; here discounted at the cost of equity, with lease payments in cash flow.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY23': '+152%: first year with Owndays (majority stake acquired).',
  'ebitdaMargin@FY24': '12.5% from 7.0%: product margin up (materials 31% of revenue vs 36%), Owndays integration.',
  'otherIncome@FY25': 'Includes a ₹167 cr non-cash gain on the Owndays deferred consideration and ₹73 cr of mutual-fund gains.',
  'pat@FY25': '₹296 cr reported; ~₹130 cr excluding the Owndays gain.',
  'sales@FY26': '+32.5%: India +29.5%, International +36.7% (Meller added; rupee weaker).',
  'ebitdaMargin@FY26': '19.9%: commissions fell (FoFo to CoCo) and operating leverage; ~11% after rent.',
  'otherIncome@FY26': '₹174 cr less a ₹16 cr exceptional loss and ₹4 cr of associates\' losses; IPO cash from Nov-2025.',
  'pat@FY26': 'After ₹7 cr of minorities (₹501 cr before).',
  'cfo@FY26': 'Before ₹620 cr of lease principal and ₹163 cr of lease interest (financing cash flow).',
  'capex@FY27E': 'Forecast capex includes lease principal (₹760 cr in FY27E); Hyderabad plant peaks.',
  'otherIncome@Q4FY25': 'Includes the ₹167 cr Owndays deferred-consideration gain.',
  'pat@Q3FY25': 'Tax 77% of a small profit.',
  'sales@Q3FY26': 'Dealskart and Meller fully consolidated (reported = proforma from Q3FY26).',
  'pat@Q4FY26': '₹204 cr before minorities.',
  'sales@Q1FY27': '+43% reported, +34% proforma; India +30.7%, International +38%.',
  'opm@Q1FY27': '21.7% before rent; 13.3% after rent (9.1% a year earlier).',
};

module.exports = { risks, glossary, statementNotes };
