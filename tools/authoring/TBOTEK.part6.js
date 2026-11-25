// TBO Tek report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./TBOTEK.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, pc, price, MULT, SENS, MV, PE12, rating, buyBelow, sellAbove, epsSep, at, mv, sepNow, Q1, A26, ebitdaToGp } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a well-run global platform at ${n1(sepNow)}x Sep-28E EPS; ${rating}, with the Middle East as the swing factor`,
  blocks: [
    { callout: `**What you are buying:** one of the four largest B2B travel distributors in the world, founder-run, with ~₹37,000 cr of GTV, two-thirds of it international hotels, a new US luxury business (Classic Vacations) and a cost base that has just started to grow more slowly than gross profit (organic EBITDA/GP ${Q1.adjEbitdaToGpOrganicPct}% in Q1FY27). Net cash ~₹836 cr; no dividend.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(sepNow)}x Sep-28E EPS. Over the past twelve months the market paid a median ${n1(PE12.med)}x one-year-forward for TBO; peers trade ${n0(Math.abs(MV.set))}% below their own medians. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. With no sector move it would be ~₹${n0(at(SENS.none))}; on the longer post-IPO window ~₹${n0(at(SENS.postIpo))}; the DCF says ~₹${n0(mv('dcf').value)}. The street (median ₹${n0(X.medTp)}) is more bullish because its FY27E EPS is 15-29% and its FY28E EPS ~9% above ours.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Middle East travel normalises (MEA was a quarter of hotel GTV and above-average margin)', 'Medium', 'MEA constant-currency growth; agent activity (back to Jan-2026 levels by Jun-2026)'],
      ['Hotel GP/GTV back to ~5.7-5.8% (FY26 average)', 'Medium', 'Q2FY27 GP/GTV (results due by mid-November 2026); management expects a drift back'],
      ['Classic Vacations revenue synergies after the platform migration (end-CY2026)', 'Medium', 'Intercompany sales (₹64 cr in Q1FY27) and Classic GTV growth from Q3FY27'],
      ['SG&A stays near +10% while gross profit grows ~18%', 'Medium-High', `EBITDA/GP; we already assume ${n1(ebitdaToGp[0])}% → ${n1(ebitdaToGp[2])}% (FY27-29E)`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['The Middle East conflict becomes a long, Russia-Ukraine-type disruption', 'Medium', 'Management would look for other growth levers and may restart investment; our bear case'],
      ['The rupee strengthens (reverses the FY27 translation tailwind)', 'Medium', '~11 points of Q1FY27 hotel GTV growth came from currency; costs move too, so profit is less affected'],
      ['Price competition from bed banks and OTAs\' B2B arms', 'Medium', 'Each 10bp of hotel GP/GTV is ~₹30 cr of FY28E gross profit (~5% of EPS)'],
      ['FEMA case decided against TBO', 'Low-Medium', '₹49 cr in contravention; penalty up to three times (~₹150 cr, ~₹14 a share), not provided for'],
      ['Pre-IPO funds sell their 22% in blocks', 'High', 'Near-term price pressure, not value'],
      ['AI agents or airline/hotel direct channels bypass travel agents', 'Low (near term)', 'The whole assisted-travel model; management sees AI as a productivity tool for advisors'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**This is an earnings call more than a multiple call.** Our multiple (${MULT.base}x) is close to the street's 35x; our Sep-28E EPS (₹${n1(epsSep.base)}) is close to Choice's (₹59.3), but our FY27E EPS is 13-22% and FY28E ~9% lower because we do not assume a quick Middle East recovery. If Q2-Q3FY27 show the GP/GTV and Middle East recovery the street expects, we would raise estimates.`,
      `**We would move to BUY below ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers.`,
      `**Biggest swing factors:** the multiple (each 1x is ~₹${n0(epsSep.base)} a share), hotel GP/GTV (each 10bp ~5% of EPS) and SG&A growth (each point of organic SG&A growth ~₹12 cr of EBITDA).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'GTV, Q1FY27', v: '₹11,154 cr', d: '+37% reported; +15% organic in constant currency' },
      { k: 'Hotels share of gross profit', v: `~${n0(A26.hotGp / A26.gp * 100)}%`, d: 'organic, FY26; Classic Vacations another 16%' },
      { k: 'Organic EBITDA ÷ gross profit', v: `${Q1.adjEbitdaToGpOrganicPct}%`, d: `Q1FY27; ${Q1.adjEbitdaToGpOrganicPriorQ}% in Q4FY26` },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `own 12-month median: ${n1(PE12.med)}x forward` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['GTV (gross transaction value)', 'The total value of bookings made on the platform, net of cancellations; TBO keeps only a small part of it as revenue.'],
      ['Take rate', 'Revenue ÷ GTV: what TBO keeps from each rupee booked.'],
      ['Gross profit (GP)', 'Revenue less service fees paid to partners; for TBO the cleanest measure of what the platform earns.'],
      ['SG&A', 'Selling, general and administrative costs: staff, technology hosting, payment-gateway charges, marketing and offices.'],
      ['EBITDA / adjusted EBITDA', 'Profit before interest, tax, depreciation and amortisation, other income and FX loss / the same before ESOP (share-based pay) cost. We use EBITDA after ESOP cost.'],
      ['B2B / B2B2C', 'Selling to businesses (travel agents) rather than consumers / selling through advisors who serve consumers (Classic Vacations).'],
      ['Bed bank', 'A wholesaler that contracts hotel rooms in bulk and sells them to agents and OTAs (e.g. Hotelbeds, WebBeds).'],
      ['OTA, GDS, NDC', 'Online travel agency (Booking, MakeMyTrip) / global distribution system for airline seats (Amadeus, Sabre) / airlines\' own direct-distribution standard.'],
      ['Monthly transacting buyers (MTB)', 'Average number of agents a month with net positive bookings.'],
      ['KAM', 'Key-account manager: TBO\'s sales staff who sign and grow agents in a region.'],
      ['Constant currency (CC)', 'Growth calculated at last year\'s exchange rates, to remove the effect of rupee moves.'],
      ['Check-in basis', 'Revenue and GTV counted when the traveller checks in, not when the booking is made (Classic Vacations).'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade below (or above) their own median P/E on the valuation date, measured over the same window as TBO\'s own history.'],
      ['DCF', 'Discounted cash flow valuation; future free cash flow discounted at the cost of equity.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '−75%: Covid; travel stopped for most of the year.',
  'pat@FY21': 'Loss of ₹34 cr, incl. ₹29 cr of exceptional charges.',
  'sales@FY22': '+241%: travel reopened from mid-2021.',
  'sales@FY23': '+120%: first full normal year; hotels grew fastest.',
  'ebitdaMargin@FY23': '17.7%: operating leverage on recovered volumes.',
  'otherIncome@FY25': '₹75 cr incl. interest on unspent IPO money and ₹19 cr of exceptional gains.',
  'ebitdaMargin@FY25': '16.4%: KAM hiring and market development ahead of revenue.',
  'sales@FY26': '+54%: organic +23%, plus ₹534 cr from Classic Vacations (six months).',
  'ebitdaMargin@FY26': '14.1%: Classic Vacations mix, ₹14.5 cr acquisition costs, Middle East disruption in Q4.',
  'dep@FY26': '₹86 cr (₹52 cr in FY25): amortisation of Classic Vacations intangibles from Oct-2025.',
  'cfo@FY26': '−₹21 cr: receivables +₹726 cr (Brazil card instalments not discounted for a few months, war-related collection delays).',
  'sales@Q3FY26': '+86%: first quarter with Classic Vacations.',
  'opm@Q4FY26': '13%: Middle East conflict hit March; Classic Vacations at a lower margin on gross revenue.',
  'sales@Q1FY27': '+81%: organic +16%, Classic Vacations ₹331 cr (peak season); rupee added ~11 points to hotel GTV growth.',
  'opm@Q1FY27': '15%: organic SG&A +4% in constant currency; Screener deducts the ₹5.5 cr FX loss (company EBITDA ₹143.5 cr).',
  'sales@FY27E': 'GAM: organic hotels GTV +21%, air +12%, Classic Vacations full year (GTV ~₹4,380 cr).',
  'ebitdaMargin@FY27E': 'GAM: EBITDA/GP ~25% (FY26 22.6%).',
  'otherIncome@FY27E': 'GAM: 3.5% on ₹836 cr of opening net cash plus ₹20 cr of write-backs and other items.',
};

module.exports = { risks, glossary, statementNotes };
