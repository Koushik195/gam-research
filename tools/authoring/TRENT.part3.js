// Trent report, part 3: the fashion store engine (standalone), Star and the Inditex stakes (equity-accounted), moat scorecard.
const X = require('./TRENT.ctx');
const { C, SA, SQ, sa, n0, n1, build, BL, rpsBase, rpsFY25 } = X;
const K = C.fy26.kpi, Q1 = C.q1fy27, B = C.business, SP = B.spsfFY26;
const yrs = SA.filter(r => r.fy >= 'FY22');
const qs = SQ.filter(r => r.westside != null);

const stores = {
  id: 'stores', nav: 'The store engine', kicker: 'Fashion (Westside, Zudio)', title: 'The store engine: area up ~30% a year, revenue per sq ft down ~15% in FY26 and ~10% in Q1FY27',
  blocks: [
    { p: `Trent grows by opening stores in clusters: it adds stores in catchments where it already trades (accepting some cannibalisation) and pushes into new towns. FY26 was the biggest year yet: ${K.opened.westside} Westside and ${K.opened.zudio} Zudio stores opened, ${K.consolidated.westside + K.consolidated.zudio} closed or merged, ${K.newCities} new cities; 131 of the ~250 net additions came in Q4. Q1FY27 added 20 net Westside and Zudio stores (plus 6 smaller concepts); management says the annual pace will stay in line with the AGM outlook of ~50 Westside and 200-250 Zudio stores a year, with medium-term targets of ~700 Westside and ~5,000 Zudio stores.` },
    { p: `Productivity is the weak spot. On our measure (standalone revenue per sq ft of effective area, weighting new stores by the part of the year they were open), revenue per sq ft fell from ₹${n0(rpsFY25)} in FY25 to ₹${n0(rpsBase)} in FY26 (−${Math.round((1 - rpsBase / rpsFY25) * 100)}%), and Q1FY27 revenue grew 18.5% on ~32% more average area (−10%, which MOSL also reports). Trent says like-for-like growth was "low single digits" in FY26 and Q1FY27, that new markets take two to three years to mature, and that it targets revenue growth per micro-market rather than per store. Its own data show the mix effect: FY26 annualised sales per sq ft were ₹${n0(SP.metroTier1)} in metro and Tier I cities, ₹${n0(SP.tier2)} in Tier II and ₹${n0(SP.restOfIndia)} elsewhere, and most new space is in the last group.` },
    { pair: [
      { type: 'column', title: 'Fashion retail area: 5.3 mn sq ft (FY22) to 17.7 mn (FY26)', unit: 'Retail area at year end (mn sq ft)', x: [...C.annualKpis.map(r => r.fy), ...build.map(r => r.y)], series: [{ name: 'Area', values: [...C.annualKpis.map(r => r.areaMnSqft), ...build.map(r => Math.round(r.area * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'AR FY26 key performance metrics; GAM estimates FY27-29E' },
      { type: 'line', title: 'Revenue has grown slower than space since FY25', unit: 'Growth y/y (%)', x: yrs.slice(1).map(r => r.fy), series: [{ name: 'Standalone revenue', values: yrs.slice(1).map((r, i) => Math.round((r.standaloneRev / yrs[i].standaloneRev - 1) * 1000) / 10), fmt: 'pct' }, { name: 'Average retail area', values: yrs.slice(1).map((r, i) => Math.round((r.avgAreaMnSqft / yrs[i].avgAreaMnSqft - 1) * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Screener.in (standalone); AR FY26; GAM calculation (simple average of opening and closing area)' },
    ] },
    { exhibit: { type: 'table', title: 'Quarterly fashion business (standalone)', head: ['Quarter', 'Revenue (₹ cr)', 'y/y', 'EBITDA margin', 'Westside', 'Zudio', 'Net adds', 'Area (mn sq ft)'], rows: SQ.map(q => [q.q, n0(q.standaloneRev), q.standaloneRevYoY != null ? q.standaloneRevYoY + '%' : '–', q.standaloneMarginPct + '%', q.westside != null ? String(q.westside) : '–', q.zudio != null ? String(q.zudio) : '–', q.westsideAdds != null ? String(q.westsideAdds + q.zudioAdds) : '–', q.areaMnSqft != null ? n1(q.areaMnSqft) : '–']), source: 'Screener.in standalone quarterly results (quarterly EBITDA basis); company presentations (store counts include Zudio in Star and the UAE; – = not disclosed in the documents we could read)' } },
    { callout: `**What we assume:** ${BL.storeAdds.join(' / ')} net openings in FY27-29E, effective area +${build.map((r, i) => Math.round((r.eff / X.effPrev[i] - 1) * 100)).join('% / +')}%, and revenue per effective sq ft ${BL.revPerSqftGrowth.map(g => (g > 0 ? '+' : '') + g + '%').join(' / ')} (₹${n0(rpsBase)} in FY26 to ₹${n0(build[2].rps)} in FY29E). That gives fashion revenue +${build.map((r, i) => Math.round(((r.st / (i ? build[i - 1].st : BL.base.standaloneRev)) - 1) * 1000) / 10).join('% / +')}%. The swing factor is productivity: each 1pp of revenue per sq ft growth is ~₹${n0(build[1].st / 100)} cr of FY28E revenue.` },
  ],
};

const star = {
  id: 'star', nav: 'Star & Zara', kicker: 'Joint ventures', title: 'Star and Zara: ₹5,500 cr of sales outside the revenue line; Star\'s losses now cancel Zara\'s profit',
  blocks: [
    { p: `**Star** (Trent Hypermarket, 50:50 with Tesco) runs ${Q1.kpi.starStores} food and grocery stores in 12 cities (Jun-26), 18,000-24,000 sq ft, with own brands at ${Q1.kpi.starOwnBrandPct}% of sales and a Zudio shop-in-shop in most stores. Revenue (excl. GST) was ₹${n0(Q1.kpi.starRevenue)} cr in Q1FY27, +${Math.round((Q1.kpi.starRevenue / Q1.kpi.starRevenueQ1FY26 - 1) * 100)}% y/y. THPL's total income was ₹2,774 cr in FY26 (+3%) and its loss before tax widened to ₹128 cr (₹92 cr in FY25) as stores were refitted and fruit and vegetable prices fell. Management says the business "increasingly delivers a viable economic profile at the store level" (Q1FY27) and plans 25-40 new stores a year; part of the proposed ₹2,500 cr raise is meant to speed this up, including retail real estate.` },
    { p: `**Zara and Massimo Dutti** are run by Inditex with Trent as a minority partner: Trent owns 20% of Inditex Trent Retail India (Zara: ₹2,768 cr of income, −3%; profit ₹204 cr, down from ₹299 cr) and a stake in Massimo Dutti India (₹129 cr of income). Inditex controls sourcing and the brand licence (AR FY26). In FY26 Trent\'s net share of JV and associate profit was ₹3.9 cr (₹86.5 cr in FY25); Zara\'s dividends reach the standalone accounts, which is one reason standalone profit (₹1,968 cr) exceeds consolidated (₹1,721 cr).` },
    { callout: '**So what:** in a sum of the parts the street adds Star at 2-2.5x sales (~₹50-65 a share for Trent\'s half) and Zara on ~40x P/E (~₹30 a share): together ~3% of value. Our P/E on consolidated EPS instead includes Star\'s losses (~₹1.2 a share); the difference is ~₹110-130 a share, which we show as a sensitivity. Neither stake changes the investment case; Star is an option that has not yet paid in a decade.' },
  ],
};

const moatRows = [
  ['Own brands, own stores', 'Strong', 'Almost all revenue from in-house brands sold only in Trent stores', 'Full control of price, design and inventory; gross margin ~46-47%'],
  ['Supply chain speed and cost', 'Strong', 'India-based sourcing, RFID across the network, inventory turns 5.1x (3.1x in FY22)', 'Fresh product at low prices with little markdown'],
  ['Price-for-quality in value fashion', 'Moderate', 'Zudio: stable low prices, no discounting; rivals (Yousta, Max, Vishal, V-Mart) copying the format', 'An execution lead rather than a barrier'],
  ['Scale and real estate', 'Moderate', '1,312 stores in 330 cities; the Tata name helps with landlords', 'Gets the best sites first; but leases are rented, not owned'],
  ['Pricing power', 'Weak', 'Low-single-digit LFL; must hold prices as input costs rise', 'Growth comes from space, not price'],
];
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real operating edge in own-brand fashion; not a wide moat in value retail',
  blocks: [
    { verdicts: moatRows, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'AR FY26; Q4FY26 and Q1FY27 presentations; GAM Research' },
    { callout: '**Honest verdict:** Trent is the best operator in Indian fashion retail: own brands, a fast supply chain and disciplined pricing gave it ~19% EBITDA margins and ~28% ROE while growing 30%+ a year. But that is an operating edge, not a moat that stops others: value fashion has low switching costs, and the biggest retailers in India are now copying Zudio. The edge shows in margins and returns; it does not protect same-store growth, which is already low single digit.' },
  ],
};

module.exports = { stores, star, moat };
