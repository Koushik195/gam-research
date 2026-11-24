// Lenskart report, part 3: India, International, margins after and before rent, competitive advantage.
const X = require('./LENSKART.ctx');
const { F, SQ, SA, n0, n1, n2, Q1, f26, f25, segM, storeRows, rps26, rps25, SB, AS } = X;
const L4 = 'Q4FY26 shareholders\' letter (20-May-2026)', L1 = 'Q1FY27 shareholders\' letter and call (12-Aug-2026)', AR = 'AR FY26 note 41';
const QL = SQ.map(q => q.q);

const india = {
  id: 'india', nav: 'India', kicker: 'Segment 1', title: `India: revenue +30%, stores +26% a year, and margins still rising (${Q1.indiaPreIndAsPct}% after rent in Q1FY27)`,
  blocks: [
    { p: `India revenue rose from ₹${n0(f25.indiaRev)} cr in FY25 to ₹${n0(f26.indiaRev)} cr in FY26 (+${n1((f26.indiaRev / f25.indiaRev - 1) * 100)}%) and ₹${n0(Q1.indiaRev)} cr in Q1FY27 (+${Q1.indiaGrowth}%). Growth comes from three places: same-store sales (SSSG 20.8% in FY26, 24.2% in Q4FY26, ${Q1.sssg}% in Q1FY27), new stores (542 net in FY26, 116 in Q1FY27, two-thirds in Tier 2+ towns) and price/mix (India ASP ₹${n0(Q1.indiaAsp)} in Q1FY27, +6.4%). Units grew 22.8% in Q1FY27; eye tests 42.7%. Same-pin-code growth (SPSG, ${Q1.spsg}%) running ~6 points above SSSG is the company's evidence that new stores add demand rather than cannibalise.` },
    { pair: [
      { type: 'column', title: 'India segment EBITDA margin: 15.5% (Q4FY25) to 21.4% (Q1FY27)', unit: 'India segment EBITDA ÷ revenue (%), after Ind AS 116', x: QL, series: [{ name: 'After Ind AS 116 (before rent)', values: SQ.map(q => q.indiaMarginPct), fmt: 'pct' }, { name: 'Pre-Ind AS 116 (after rent)', values: SQ.map(q => q.indiaPreIndAsPct), fmt: 'pct' }], labels: 'all', source: `${L4}; ${L1}. Q4FY25 and Q1FY26 are proforma (prior-year) figures quoted in those letters.` },
      { type: 'column', title: 'Our India store build: ~560 stores a year, revenue per store +5%', unit: 'India stores at year end', x: ['FY25', 'FY26', ...storeRows.map(r => r.y)], series: [{ name: 'India stores', values: [SB.indiaStoresMar25, SB.indiaStoresMar26, ...storeRows.map(r => r.stores)], fmt: 'num' }], labels: 'all', source: 'Company (FY25-26); GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'India build: stores x revenue per store (our forecast)', head: ['', 'FY25', 'FY26', ...storeRows.map(r => r.y)], rows: [
      ['Net new stores', '282', '542', ...storeRows.map(r => n0(r.adds))], ['Stores at year end', n0(SB.indiaStoresMar25), n0(SB.indiaStoresMar26), ...storeRows.map(r => n0(r.stores))],
      ['Revenue per average store (₹ cr, incl. online)', n2(rps25), n2(rps26), ...storeRows.map(r => n2(r.rps))],
      ['India revenue (₹ cr)', n0(f25.indiaRev), n0(f26.indiaRev), ...F.years.map((_, i) => n0(X.SEG.india.revenue[i]))], ['growth', '–', `+${n1((f26.indiaRev / f25.indiaRev - 1) * 100)}%`, ...storeRows.map(r => `+${n1(r.g)}%`)],
      ['Segment EBITDA margin (before ESOP)', '12.3%', '20.5%', ...segM('india').map(v => `${n1(v)}%`)],
    ], source: `${AR}; ${L4}; GAM estimates. Our model grows India revenue at +${AS.segments[0].growth.join("% / +")}%; the store build reproduces it within 1.5 points (checked in LENSKART.ctx.js).` } },
    { callout: `**Our view:** India is the engine and it is accelerating in stores but slowing in same-store growth (24.2% in Q4FY26, ${Q1.sssg}% in Q1FY27). New Tier 2+ stores do ₹16-18 lakh a month (₹2 cr a year), slightly below the India average of ~₹${n2(rps26)} cr including online. We assume revenue per store grows ~5% a year: lower than recent SSSG because every year a larger share of the base is young, smaller-town stores.` },
  ],
};

const intl = {
  id: 'international', nav: 'International', kicker: 'Segment 2', title: `International: profitable at last, ${Q1.intlPreIndAsPct}% margin after rent in Q1FY27, with few new stores`,
  blocks: [
    { p: `International revenue rose from ₹${n0(f25.intlRev)} cr (FY25) to ₹${n0(f26.intlRev)} cr (FY26, +${n1((f26.intlRev / f25.intlRev - 1) * 100)}%, with Meller added and rupee weakness) and ₹${n0(Q1.intlRev)} cr in Q1FY27 (+${Q1.intlGrowth}%; ~${Q1.intlCc}% in constant currency). Only 61 net new stores were added in FY26 and 16 in Q1FY27: growth is same-store and online. Japan (Owndays) grew mainly through same stores with better unit economics; Singapore, Thailand and the UAE are growing online; the Middle East had 41 stores at Mar-2026; Meller (Spanish sunglasses brand, ~US$35 mn at acquisition) is tracking to ~US$70 mn and is now in 1,000+ Lenskart stores. Product margin is higher than India's (77.1% vs 64.2% in Q1FY27) because ASPs are ~3x (₹5,267 vs ₹1,856).` },
    { pair: [
      { type: 'column', title: 'International margin after rent: 3.6% (FY25), 7.0% (FY26), 10.6% (Q1FY27)', unit: 'Pre-Ind AS 116 EBITDA margin (%)', x: ['FY25', 'FY26', 'Q4FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'International (after rent)', values: [f25.intlPreIndAsPct, f26.intlPreIndAsPct, ...SQ.map(q => q.intlPreIndAsPct)], fmt: 'pct' }], labels: 'all', source: `${L4}; ${L1}` },
      { type: 'line', title: 'Segment EBITDA margins (before ESOP): ours for FY27-29E', unit: 'Segment EBITDA ÷ revenue (%), after Ind AS 116', x: ['FY25', 'FY26', ...F.years], series: [{ name: 'India', values: [12.3, 20.5, ...segM('india').map(v => Math.round(v * 10) / 10)], fmt: 'pct' }, { name: 'International', values: [17.6, 19.3, ...segM('intl').map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', min: 10, max: 26, source: `${AR} (ESOP added back); GAM estimates` },
    ] },
    { callout: `**Our view:** management asks investors to read International on a trailing basis because Q1 carries the sunglasses season (units +58% in Q1FY27). We take ${n1(segM('intl')[0])}% for FY27E before ESOP (FY26 19.3%; Q1FY27 21.9%) and add ~0.7-0.8 points a year. The risk is currency: International is ~41% of revenue and earns in yen, Singapore dollars and dirhams, so a stronger rupee would cut reported growth.` },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins: before and after rent', kicker: 'Unit economics', title: 'Two margins tell the story: 21.7% before rent, 13.3% after rent in Q1FY27, against a ~25% long-term aim',
  blocks: [
    { p: `Under Ind AS 116, store rent is not an operating expense: it becomes depreciation of a "right-of-use" asset plus interest on a lease liability. Lenskart's reported EBITDA (${Q1.ebitdaMarginPct}% in Q1FY27) therefore excludes rent; its "EBITDA pre-IndAS 116" (${Q1.preIndAsMarginPct}%) deducts it. The gap (~8 points) is the rent bill. Management's long-term aim of ~25% is on the after-rent basis, so even our FY29E (EBITDA {{F.ebitdaMargin.2|pct}} before rent) implies only ~16-17% after rent.` },
    { exhibit: { type: 'table', title: 'Q1FY27 margins by segment', head: ['', 'India', 'International', 'Consolidated'], rows: [
      ['Revenue (₹ cr)', n0(Q1.indiaRev), n0(Q1.intlRev), n0(Q1.revenue)], ['Product margin', '64.2%', '77.1%', `${Q1.productMarginPct}%`],
      ['EBITDA after Ind AS 116 (before rent)', `₹${Q1.indiaEbitda} cr / 21.4%`, `₹${Q1.intlEbitda} cr / 21.9%`, `₹${Q1.ebitda} cr / ${Q1.ebitdaMarginPct}%`],
      ['EBITDA pre-Ind AS 116 (after rent)', `₹236 cr / ${Q1.indiaPreIndAsPct}%`, `₹127 cr / ${Q1.intlPreIndAsPct}%`, `₹${Q1.preIndAsEbitda} cr / ${Q1.preIndAsMarginPct}%`],
      ['Same quarter a year ago (after rent)', '13.3%', '4.5%', '9.1%'],
    ], source: `${L1}` } },
    { bullets: [
      '**Product margin** (revenue less cost of goods) rose from 68.7% to 70.3% in Q1FY27 despite a weaker rupee against the renminbi: in-house frames and lenses (Bhiwadi, Thailand JV, Hyderabad from ~FY28) and premium mix.',
      '**Employee cost** is the largest line (23% of FY26 revenue): optometrists and store staff. It rose with company stores (franchise buy-back) and new Tier 2+ stores are staffed before revenue ramps.',
      '**Marketing** fell to 4.8% of India revenue in Q1FY27 (5.7% a year earlier); International stays ~9% as brands are built.',
      '**Rent** fell to 5.8% of India revenue in Q4FY26 (6.5% a year earlier) as SSSG outran ~5% rent escalations; International 12.2%.',
    ] },
    { callout: '**So what:** most of the margin gain since FY24 is operating leverage on a largely fixed store and head-office base. It continues only if same-store growth stays well above rent and wage inflation. With SSSG falling from 24% to 18% and openings shifting to smaller towns, we model ~1 point of segment margin a year, not the ~4 points of FY26.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'A real but narrow moat: scale in manufacturing and eye tests, not in brand pricing power',
  blocks: [
    { verdicts: [
      ['Vertical integration (cost)', 'Strong', 'Own frame and lens plants, central lab, ~70% product margin; Hyderabad (~50 mn pairs a year) to add capacity', 'Lets it sell a ₹500 pair profitably and still earn more on ₹10,000+ orders'],
      ['Eye-test funnel and data', 'Strong', '23.8 mn tests in FY26, half first-time; remote optometry in 786 stores; AI self-test in pilots', 'Unorganised opticians cannot match the reach; tests feed sales'],
      ['Store network and logistics', 'Moderate-Strong', '3,459 stores; next-day delivery in 78 cities; stores double as service and pickup points', 'Hard to replicate quickly, but capital is the main barrier and well-funded rivals can build it'],
      ['Brand and loyalty', 'Moderate', 'Gold 9.35 mn members; NPS 81.4 (Q4FY26); ~50% word-of-mouth acquisition', 'Strong consideration, but eyewear buyers are price-aware; Lenskart passes mix gains back in value campaigns'],
      ['Pricing power', 'Weak-Moderate', 'India ASP flat at ~₹1,760-1,865 for years; growth is volume (~25%)', 'The moat protects cost, not price'],
      ['International', 'Moderate', 'Owndays #3 direct-to-consumer chain in Japan; Meller brand; margins rising', 'Sub-scale against the top two Japanese chains'],
    ], head: ['Factor', 'Score', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: `${L4}; ${L1}; AR FY26; GAM Research` },
    { callout: '**Verdict:** Lenskart has a genuine cost and reach advantage over unorganised opticians, which is where its share gains come from. It is a narrow moat in a fragmented market: it does not give pricing power, and returns depend on executing ~600 openings a year without hurting service. That is enough to justify a premium retail multiple; it is not a platform-style moat.' },
  ],
};

module.exports = { india, intl, margins, moat };
