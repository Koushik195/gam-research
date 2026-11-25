// Jubilant FoodWorks report, part 3: Domino's India, Popeyes and emerging brands, International (DP Eurasia), margins before
// and after rent, competitive advantage.
const X = require('./JUBLFOOD.ctx');
const { C, D, F, SQ, AS, BL, n0, n1, n2, f26, f25, CO, segM, indiaRows, rps26, rps25, preEbitda, preEbitda26, rent, rent26, SEG } = X;
const P4 = 'Q4FY26 presentation (20-May-2026)', L1 = 'Q1FY27 letter and call (13-Aug-2026)', AR = 'AR FY26';
const BZ = C.business, DI = BZ.dominosIndia, DP = BZ.dpEurasia, QL = SQ.map(q => q.q), pct = (a, c) => Math.round(a / c * 1000) / 10;

const dominos = {
  id: 'dominos', nav: 'Domino\'s India', kicker: 'Business 1', title: 'Domino\'s India: orders up, tickets down; LFL of 2.5% in Q1FY27 against a 5-7% guide',
  blocks: [
    { p: `Domino's India revenue grew ${DI.growthFY26}% in FY26 to ₹${n0(DI.revenueFY26)} cr on 276 net new stores (2,455 at Mar-2026) and LFL growth of ${DI.lfl.FY26avg}% (simple average of the quarters: ${DI.lfl.FY26.join('%, ')}%). In Q1FY27 revenue grew ${DI.q1fy27.revenueGrowth}% and LFL ${DI.lfl.Q1FY27}% on a high base (11.6%), with orders +${DI.q1fy27.orderGrowth}%, delivery revenue +${DI.q1fy27.deliveryRevGrowth}% (${DI.q1fy27.deliveryMix}% of revenue) and ~${DI.q1fy27.netPriceIncreaseBps} bp of net price increases. Two things hold LFL back: the ₹149→₹99 minimum order value cut lower tickets, and dine-in/takeaway (DITA) keeps losing small solo orders to ₹49-99 aggregator deliveries. Management has put a dedicated leader on DITA, is upgrading ~400 dine-in-heavy stores and says Q2 started better. Revenue per average store rose only ${n1((rps26 / rps25 - 1) * 100)}% in FY26 (₹${n2(rps25)} cr to ₹${n2(rps26)} cr) despite 6.5% LFL: new and split stores dilute it.` },
    { pair: [
      { type: 'column', title: 'LFL by quarter: a strong FY26 first half, then near zero', unit: 'Domino\'s India LFL growth (%)', x: ['Q1FY25', 'Q2FY25', 'Q3FY25', 'Q4FY25', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'LFL', values: [...DI.lfl.FY25, ...DI.lfl.FY26, DI.lfl.Q1FY27], fmt: 'pct' }], labels: 'all', source: `${P4} slide 15; ${L1}` },
      { type: 'column', title: 'Our store build: ~250 Domino\'s openings a year', unit: 'Domino\'s India stores at year end', x: ['FY24', 'FY25', 'FY26', ...indiaRows.map(r => r.y)], series: [{ name: 'Stores', values: [1995, BL.dominosStoresMar25, BL.dominosStoresMar26, ...indiaRows.map(r => r.stores)], fmt: 'num' }], labels: 'all', source: 'AR FY24; Q4FY26 presentation; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'India build: Domino\'s stores x revenue per store + emerging brands (our forecast)', head: ['', 'FY25', 'FY26', ...indiaRows.map(r => r.y)], rows: [
      ['Domino\'s net new stores', '184', '276', ...indiaRows.map(r => n0(r.adds))], ['Domino\'s stores at year end', n0(BL.dominosStoresMar25), n0(BL.dominosStoresMar26), ...indiaRows.map(r => n0(r.stores))],
      ['Revenue per average store (₹ cr)', n2(rps25), n2(rps26), ...indiaRows.map(r => n2(r.rps))], ['Domino\'s India revenue (₹ cr)', n0(f25.dominosIndiaRev), n0(DI.revenueFY26), ...indiaRows.map(r => n0(r.dom))],
      ['Popeyes + Hong\'s (₹ cr)', n0(f25.indiaRev - f25.dominosIndiaRev), n0(BL.emergingRevFY26), ...indiaRows.map(r => n0(r.em))],
      ['Sales within India (₹ cr)', n0(f25.indiaRev), n0(f26.indiaRev), ...indiaRows.map(r => n0(r.rev))], ['growth', '–', `+${n1((f26.indiaRev / f25.indiaRev - 1) * 100)}%`, ...indiaRows.map(r => `+${n1(r.g)}%`)],
      ['India EBITDA margin (standalone, after Ind AS 116)', `${f25.indiaMarginPct}%`, `${f26.indiaMarginPct}%`, ...segM('india').map(v => `${n1(v)}%`)],
    ], source: `${AR} note 43; ${P4}; GAM estimates. The build reproduces the model's India growth (+${AS.segments[0].growth.join('% / +')}%) within 0.3 points (checked in JUBLFOOD.ctx.js). FY25 emerging brands = sales within India less Domino's (Dunkin' excluded).` } },
    { callout: `**Our view:** we assume LFL of ~4.5% in FY27E (2.5% in Q1, easier base from Q3) and ~6% after, inside the 5-7% guide but not at the top, and revenue per store ${BL.revPerStoreGrowth.map(v => (v >= 0 ? '+' : '') + v + '%').join(' / ')}. The volume story is sound (orders, delivery share, new cities). The value story depends on whether aggregators keep subsidising small orders; that is outside JFL's control.` },
  ],
};

const emerging = {
  id: 'emerging', nav: 'Popeyes & emerging brands', kicker: 'Business 2', title: 'Popeyes: revenue +97% and LFL 40%+ in Q1FY27; the second engine, still loss-making',
  blocks: [
    { p: `Popeyes had 78 stores at Mar-2026 and 88 at Jun-2026 (+10 in Q1FY27). Same-store growth was 28% in FY26 and above 40% for three quarters to Q1FY27; revenue grew 97% in Q1FY27 and system average daily sales passed ₹95,000 (seven cities above ₹1 lakh for the quarter), vs ~₹80,000 for a mature Domino's store. Management targets a ₹1,000 cr brand in three to four years with 35-40 openings a year (sites identified for the next 200) and says EBITDA profitability is "the next challenge": restaurant-level profits exist, but marketing and the team built for a ₹1,000 cr brand weigh on a business of a few hundred crore. Hong's Kitchen (29 stores) is not being funded further and Dunkin' has been exited. The drag of emerging brands on standalone after-rent EBITDA was ~220 bp in FY26 (~200 bp without Dunkin'), and management aims to bring it to ~100 bp by end-FY28.` },
    { pair: [
      { type: 'column', title: `Popeyes + Hong's revenue: ₹219 cr in FY26, ~₹${n0(indiaRows[2].em)} cr in FY29E (ours)`, unit: '₹ crore', x: ['FY26', ...indiaRows.map(r => r.y)], series: [{ name: 'Popeyes + Hong\'s', values: [BL.emergingRevFY26, ...indiaRows.map(r => Math.round(r.em))], fmt: 'num' }], labels: 'all', source: 'Derived from AR FY26 and the Q4FY26 presentation; GAM estimates (+65% / +45% / +35%)' },
      { type: 'column', title: 'Popeyes stores: 61 → 78 → 88 (Jun-26)', unit: 'Stores', x: ['Mar-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Popeyes', values: [61, 78, 88], fmt: 'num' }], labels: 'all', source: `${P4}; ${L1}` },
    ] },
    { callout: `**Our view:** Popeyes has found product-market fit faster than we expected, but at ~2% of revenue (with Hong's) it cannot move group numbers much before FY29. We model emerging-brand revenue of ~₹${n0(indiaRows[2].em)} cr in FY29E, short of the ₹1,000 cr ambition, and no separate break-even date. If it breaks even sooner, the ~100 bp of India margin it carries is worth ~₹${n0(AS.valuation.parts[0].multiple.base * (SEG.india.revenue[1] + SEG.india.revenue[2]) / 2 / 100 * 0.97 / X.shares)} a share at our multiple.` },
  ],
};

const intl = {
  id: 'international', nav: 'International (DP Eurasia)', kicker: 'Business 3', title: 'International: +28% in rupees, mostly inflation; a cash-generating Turkish franchise with noisy accounting',
  blocks: [
    { p: `Sales outside India rose from ₹${n0(f25.intlRev)} cr (FY25) to ₹${n0(f26.intlRev)} cr (FY26, +${n1((f26.intlRev / f25.intlRev - 1) * 100)}%). DP Eurasia (${DP.stake['Mar-26']}% owned) reported revenue of ₹${n0(DP.revenueFY26)} cr (+${DP.growthFY26}%) and PAT of ₹${n0(DP.patFY26)} cr (${DP.patMarginFY26}%), up 62% with lower interest after its lira loans were moved into euro; Q1FY27 revenue +${DP.q1fy27.revenueGrowth}%. Real growth is far lower: Domino's Turkey LFL was +${DP.q1fy27.lflDominosTry}% in lira but ${DP.q1fy27.lflDominosInflAdj}% after inflation, COFFY +${DP.q1fy27.lflCoffyTry}% and ${DP.q1fy27.lflCoffyInflAdj}%. Reported EBITDA includes the IAS 29 monetary gain on net monetary liabilities, which fell in Q1FY27 as inflation eased: International EBITDA margin was 20.0% vs 20.5% a year earlier, but +15 bp excluding it. DP Eurasia has upstreamed ~₹52 cr of dividends in nine months; management guides a 7-9% PAT margin for FY27.` },
    { pair: [
      { type: 'column', title: 'International revenue and EBITDA margin by quarter', unit: 'International EBITDA ÷ revenue (%, consolidated less standalone)', x: QL, series: [{ name: 'Margin', values: SQ.map(q => pct(q.intlEbitda, q.intlRev)), fmt: 'pct' }], labels: 'all', source: `${P4} slides 24-25; ${L1}. Q4 is restated to the year-end price level and rate under IAS 29.` },
      { type: 'line', title: 'EBITDA margins after Ind AS 116: ours for FY27-29E', unit: 'EBITDA ÷ revenue (%)', x: ['FY25', 'FY26', ...F.years], series: [{ name: 'India', values: [f25.indiaMarginPct, f26.indiaMarginPct, ...segM('india').map(v => Math.round(v * 10) / 10)], fmt: 'pct' }, { name: 'International', values: [f25.intlMarginPct, f26.intlMarginPct, ...segM('intl').map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', source: 'AR FY26; GAM estimates' },
    ] },
    { callout: `**Our view:** we model International revenue +{{as.segments.1.growth.0|pct0}} / +{{as.segments.1.growth.1|pct0}} / +{{as.segments.1.growth.2|pct0}} and a margin of ${segM('intl').map(v => n1(v) + '%').join(' / ')}, a little below FY26 as the monetary gain fades. The franchise is sound (787 Domino's stores, strong order growth and cash generation; COFFY the 5th largest coffee chain in Turkey by stores), but rupee profits depend on how fast the lira falls relative to Turkish inflation, and the street values it at 15-18x EBITDA after rent, below India. We use one group multiple and show the street's lower International multiple as a sensitivity.` },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins: before and after rent', kicker: 'Unit economics', title: `Two margins: ~20% before rent, ~13% after it; we model ${n1(preEbitda[2] / F.sales[2] * 100)}% after rent by FY29E`,
  blocks: [
    { p: `Under Ind AS 116 store rent is not an operating cost: it becomes depreciation of a right-of-use asset plus interest on a lease liability. JFL's reported EBITDA (${CO.ebitdaMargin}% in FY26) therefore excludes rent; its "adjusted EBITDA" (pre-Ind AS 116) deducts it. Standalone, that was ${C.fy26.standalone.adjEbitdaMargin}% in FY26 (${C.fy26.standalone.adjEbitdaMarginFY25}% in FY25), and Domino's India alone ${DI.adjEbitdaMarginFY26}% in both years: the ~2 points between is the emerging-brand drag. Consolidated after-rent EBITDA is not reported; EBITDA less the cash paid on leases gives ~₹${n0(preEbitda26)} cr (${n1(preEbitda26 / CO.revenue * 100)}%) for FY26. The street's multiples are on this after-rent basis.` },
    { exhibit: { type: 'table', title: 'From reported EBITDA to EBITDA after rent (₹ crore)', head: ['', 'FY26', ...F.years], rows: [
      ['EBITDA (after Ind AS 116)', n0(CO.ebitda), ...F.ebitda.map(n0)], ['Less: lease principal', n0(X.RB.fy26.leasePrincipal), ...X.RB.leasePrincipal.map(n0)], ['Less: lease interest', n0(X.RB.fy26.leaseInterest), ...X.RB.leaseInterest.map(n0)],
      { hl: true, cells: ['**EBITDA after rent (pre-Ind AS)**', `**${n0(preEbitda26)}**`, ...preEbitda.map(v => `**${n0(v)}**`)] }, ['margin', `${n1(preEbitda26 / CO.revenue * 100)}%`, ...preEbitda.map((v, i) => `${n1(v / F.sales[i] * 100)}%`)],
      ['Rent as % of revenue', `${n1(rent26 / CO.revenue * 100)}%`, ...rent.map((v, i) => `${n1(v / F.sales[i] * 100)}%`)],
    ], source: `${AR} cash flow (lease payments ₹641 cr) and note 3b (lease interest ₹338 cr); GAM estimates (rentBuild)` } },
    { callout: '**Our view:** management\'s +200 bp target is on the after-rent standalone margin (12.6% in FY26). We assume about +125 bp over three years: Popeyes scaling and supply-chain leverage help, but the ₹99 minimum order, wage codes and LPG/cheese inflation take part of it. Each point of after-rent margin on Sep-28E revenue is worth ~₹' + n0(AS.valuation.parts[0].multiple.base * (F.sales[1] + F.sales[2]) / 2 / 100 * 0.97 / X.shares) + ' a share at our multiple.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'A real moat in delivery logistics and supply chain; a licence, not a brand it owns',
  blocks: [
    { verdicts: D.moat.map(m => [m.k, m.v, m.why, { 'Scale and delivery network': 'Lowest delivery cost and time in pizza; rivals rely on aggregators', 'Supply chain': 'Cost advantage that grows with every store', 'Brand and pricing power': 'Protects volume, not price', 'Franchise terms': 'Royalties cap margins; renewal risk is low but real' }[m.k]]), head: ['Factor', 'Score', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: `${P4}; ${L1}; ${AR}; GAM Research` },
    { callout: '**Verdict:** JFL has a genuine moat in pizza delivery: the densest store and rider network in India, own app, commissaries built for ~5,000 stores, and ~1.7x the scale of the next QSR. It does not give pricing power, as FY26 showed, and the brands (Domino\'s, Popeyes) are licensed. A wide moat in operations, a narrow one in economics.' },
  ],
};

module.exports = { dominos, emerging, intl, margins, moat };
