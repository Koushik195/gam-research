// Kansai Nerolac report, part 3: decorative, industrial, the parent (Kansai Paint), competitive advantage.
const X = require('./KANSAINER.ctx');
const { C, D, F, n0, n1, pc, rup, SRC, SQ, QL, BL, lines, decoShare, Q1 } = X;
const BO = D.industry.birlaOpus, FY = C.fy26, Qd = Q1.consolidated;
const dq = (x, i) => [x.q, x.deco, x.ind];

const decorative = {
  id: 'decorative', nav: 'Decorative paint', kicker: 'Business line', title: 'Decorative: a well-known brand losing scale to better-funded rivals',
  blocks: [
    { p: `Decorative is ~45% of revenue (~₹${n0(BL.base.decorative)} cr in FY26, our estimate from management's split). Nerolac's brand is well known: the company says it is the No.2 brand in top-of-mind recall and its jingle has run for 30+ years. But brand recall has not turned into growth. Decorative revenue fell in FY25 (low-single-digit decline in Q3FY25), was flat to slightly negative through H1FY26, and recovered only to mid single digit in Q4FY26 and high single digit in Q1FY27, the last mostly on price: volumes grew "low single digit". Over the same period Birla Opus went from launch (Feb-2024) to ~${BO.fy26RevenueSharePct}% of decorative and ₹${n0(BO.q1fy27RevenueCr)} cr of revenue in Q1FY27, while Asian Paints, Berger and Indigo grew revenue 12-20% in that quarter.` },
    { exhibit: { type: 'table', title: 'Decorative and industrial growth, quarter by quarter (management\'s words)', head: ['Quarter', 'Decorative', 'Industrial'], wide: [1, 2], rows: SQ.map(dq), source: 'Kansai Nerolac earnings calls (Nov-2024 to Aug-2026); n.d. = not stated' } },
    { pair: [
      { type: 'column', title: `Decorative revenue in our model: +${BL.decorativeGrowth[0]}% in FY27, then +${BL.decorativeGrowth[1]}% a year`, unit: 'Decorative revenue (₹ crore; FY26 approximate)', x: ['FY26', ...F.years], series: [{ name: 'Decorative', values: [BL.base.decorative, ...lines.deco.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Management split (Feb-2026); GAM estimates' },
      { type: 'hbar', title: 'Birla Opus vs Nerolac decorative, Jun-2026 quarter', unit: '₹ crore', x: ['Birla Opus revenue', 'Nerolac decorative (est., 50% of sales)'], series: [{ name: 'Revenue', values: [BO.q1fy27RevenueCr, Math.round(Qd.revenue * 0.5)], fmt: 'num' }], labels: 'all', highlight: 'Birla Opus revenue', source: 'Grasim Q1FY27 release; GAM estimate (Q1 is decorative-heavy, so we use the mid-point of 45-55%)' },
    ] },
    { bullets: [
      '**Strategy: defend, focus, premiumise.** Management\'s six pillars are new products (Paint+, Excel Everlast 20 with a 20-year warranty, Perma NoDamp NXT), projects, construction chemicals, waterproofing and wood finish, branding, influencer programmes and "focused geographies": over-investing in the towns, mainly in the North and East, where it is No.1 or No.2, for "a 2-3 year strategy" (Feb-2026).',
      '**Giving up volume for mix.** Nerolac is deliberately cutting low-margin, high-volume economy items ("we are not participating greatly into low-margin, high-volume items"), so volume grows slower than the market: in Q1FY27 economy grew mid single digit, super-premium double digit.',
      '**Competition is not easing.** "competition intensity continues to remain intact" and, "for this year, at least that intensity will remain"; freebies (extra grammage) withdrawn in some markets, not others; dealer incentives unchanged from last year (Aug-2026). New entrants now have "reached every corner of the country"; the fight has moved from adding dealers to "extraction from the counter".',
      '**Network.** 1,700+ dealers added in Q1FY27 (3,500+ in 9MFY26); 1.2 lakh painters in the loyalty programme; 385 Paint+ zones. Management plans 5-10% network growth a year, far less than the new entrants added.',
      '**Pricing.** Four decorative price rises between 25-Mar and 11-May 2026 (2%, then 5-6% each, "higher single digit" net); about 3% more flowed into Q2FY27.',
    ] },
    { callout: `**Our view:** decorative is not a turnaround story. The market is recovering, but Nerolac is recovering slower than everyone else, and on Grasim's own data Birla Opus now sells more decorative paint in a quarter than Nerolac does. Management's honest goal is to hold share in its strongholds. We model +${BL.decorativeGrowth[0]}% in FY27 (mostly price) and +${BL.decorativeGrowth[1]}% a year after, so decorative falls to ~${Math.round(decoShare(2))}% of revenue by FY29E. In February 2026 an analyst asked whether Kansai would sell the decorative business; the MD said "this is not a call we would like to take", though "evaluations are ongoing".` },
  ],
};

const industrial = {
  id: 'industrial', nav: 'Industrial coatings', kicker: 'Business line', title: 'Industrial: India\'s auto-paint leader, riding an auto boom, and now spending ₹600 cr to grow',
  blocks: [
    { pair: [
      { type: 'hbar', title: 'Share of paint at the seven largest 2/3-wheeler makers: 61-81%', unit: 'Kansai Nerolac share of each customer\'s paint purchases (%)', x: ['D', 'A', 'C', 'G', 'E', 'B', 'F'].map(c => `Customer ${c} (2/3W)`), series: [{ name: 'Share', values: [81, 76, 76, 76, 74, 68, 61], fmt: 'pct0' }], labels: 'all', min: 0, max: 100, source: 'Kansai Paint India strategy briefing (24-Feb-2026), company estimates' },
      { type: 'column', title: `Industrial revenue in our model: +${BL.industrialGrowth[0]}% in FY27, then +${BL.industrialGrowth[1]}% a year`, unit: 'Industrial revenue (₹ crore; FY26 approximate)', x: ['FY26', ...F.years], series: [{ name: 'Industrial', values: [BL.base.industrial, ...lines.ind.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Management split (Feb-2026); GAM estimates' },
    ] },
    { bullets: [
      '**Automotive OEM (No.1).** Share of India\'s auto OEM paint rose from 58.1% (FY22) to 61.0% (FY24); "50% plus" across autos (MD, Feb-2026). Kansai Paint\'s Japanese technology, 200-300 technicians on customer lines and no supply failures make it hard to dislodge. Growth comes from vehicle output (Q1FY27: PVs +25.9%, two-wheelers +20.3%), larger SUVs with more paintable area, metallic shades and new areas such as underbody coatings, sealers, alloy wheels and pre-treatment chemicals.',
      '**Powder coatings (No.1).** Leader "for more than two decades"; demand from appliances, ACs, electricals, furniture and auto parts; growth "robust" in Q1FY27 after a soft FY26 (mid single digit in Q4FY26).',
      '**Performance and general industrial liquids (No.3).** Infrastructure, railways, metro, bridges, coil coating and pre-engineered buildings; "very strong growth" in Q1FY27; management targets double-digit growth and wants to be No.1 in non-auto industrial "in next 2 years".',
      '**Auto refinish.** Flat in Q1FY27; shift from solvent-borne to waterborne under way.',
      '**Pricing power is limited.** OEMs negotiate price rises customer by customer, "always with effective date" but with a 1-2 quarter lag; ~5% industrial price in Q1FY27, another 3-5% expected in Q2. CRISIL lists "pricing pressure from auto OEMs" as a key weakness.',
      '**Capex.** ₹601 cr over ~2-2.5 years for auto, powder and resin capacity at Sayakha, Bawal and Hosur (+65,880 KL a year of paint and powder, +9,780 KL of resin for in-house auto-paint intermediates), on top of ₹150-200 cr of normal capex. Industrial utilisation is 70-75%; management expects ROCE in line with today\'s, rising "towards 18%".',
    ] },
    { callout: `**Our view:** this is the half of Nerolac worth owning: a leadership position with technical switching costs, in a market (vehicles, appliances, infrastructure) growing faster than house paint. We model industrial revenue +${BL.industrialGrowth[0]}% in FY27 and +${BL.industrialGrowth[1]}% a year after, which takes it to ~${Math.round(100 - decoShare(2))}% of revenue by FY29E. The risks: auto growth slows sharply once the post-GST surge is in the base (from October 2026), OEMs squeeze price, and JSW Dulux brings some of Akzo Nobel's industrial range into the fight.` },
  ],
};

const RP = FY;
const parent = {
  id: 'parent', nav: 'The parent', kicker: 'Parent', title: 'Kansai Paint: technology for a small royalty, and a parent that now sets the strategy openly',
  blocks: [
    { p: `Kansai Paint Co. (Japan), one of the world's top-10 coatings makers (CRISIL), owns 74.96% of KNPL, the maximum allowed under India's 75% public-shareholding rule. India is one of its most important markets: since Apr-2025 Kansai Paint itself has held India strategy briefings for its own investors, at which KNPL's MD answers their questions. The relationship is cheap for minorities: KNPL paid a royalty of ₹${n1(RP.royaltyPaidToParent)} cr in FY26 (₹${n1(RP.royaltyPaidToParentFY25)} cr in FY25), about ${n1(RP.royaltyPaidToParent / RP.standalone.revenue * 100)}% of standalone revenue, and ₹${n1(RP.technicalFeesToParent)} cr of technical fees, for access to the group's automotive and industrial technology. In return the parent received ₹${n0(RP.dividendPaidToParent)} cr of the ₹303 cr of dividends paid in FY26.` },
    { exhibit: { type: 'table', title: 'Money and know-how flowing between KNPL and Kansai Paint, FY26', head: ['Flow', 'FY26 (₹ cr)', 'Note'], wide: [2], rows: [
      ['Royalty paid to Kansai Paint', n1(RP.royaltyPaidToParent), `₹${n1(RP.royaltyPaidToParentFY25)} cr in FY25; ~0.4% of standalone revenue`],
      ['Technical fees (incl. reimbursements)', n1(RP.technicalFeesToParent), 'Small'],
      ['Dividend paid to Kansai Paint', n0(RP.dividendPaidToParent), '₹3.75 a share (FY25 final incl. ₹1.25 special) on 60.62 cr shares'],
      ['Sales to fellow subsidiaries (Philippines, Russia)', '7.3', 'Negligible exports to the group'],
      ['Group support ("One-Kansai")', 'n.a.', 'Kansai Paint Japan supports auto/industrial and lends talent; Kansai Helios helps in railways; KNPL helps Plascon in construction chemicals'],
    ], source: 'Annual report FY26 (related-party note 39); Kansai Paint briefing (Feb-2026)' } },
    { bullets: [
      '**The parent\'s plan.** Kansai Paint\'s mid-term plan treats decorative as the "stability" pillar and auto plus industrial as the "growth" and "innovation" pillars, with decorative resources shifted "towards where we are strong". It aims to lift KNPL\'s margin by ~200bp through premiumisation and tighter selling costs.',
      '**Sourcing.** "As a Kansai Group, we have operation in more than 30-odd countries"; intermediates can be sourced from group plants when needed. KNPL makes its own auto-paint resins and is adding resin capacity; it has no plans to integrate into basic raw materials.',
      '**What minorities cannot control.** Strategy for decorative, any decision to exit it, capital allocation of a ₹2,500 cr cash pile and the payout ratio all sit with a parent that owns three-quarters of the shares. We found no sign of a buyback, delisting offer or stake change by 30-Sep-2026.',
    ] },
    { callout: '**Our view:** unlike some MNC subsidiaries, KNPL is not milked by its parent: the royalty is small and related-party trade is negligible. The parent\'s influence shows up instead in strategy (a cautious, margin-first decorative stance) and in a conservative balance sheet that keeps too much cash. A bolder parent could unlock value (buy back shares, sell or merge decorative); there is no sign of that yet.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: wide in auto paint, narrow in industrial, eroding in decorative',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings, Kansai Paint briefings, calls to Sep-2026)' },
    { callout: '**Honest verdict:** Kansai Nerolac has **a moat in automotive coatings and none worth paying for in decorative**. Auto OEM paint is a technical, approval-driven business where a ~61% share, Kansai Paint\'s technology and people on the customer\'s line create real switching costs. Decorative is where most paint profit in India is made, and there Nerolac is a sub-scale follower: its distribution was copied within two years by newcomers with deeper pockets, and it follows rather than sets prices. Group ROE of ~10% says the same thing: the company as a whole does not earn its cost of capital.' },
  ],
};

module.exports = { decorative, industrial, parent, moat };
