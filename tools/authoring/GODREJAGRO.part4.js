// Godrej Agrovet initiation, part 4: Crop Care and Astec, Dairy and Godrej Foods, competitive advantage.
const X = require('./GODREJAGRO.ctx');
const { D, F, n0, n1, SRC, SA, SQ, QL, A26, A25, P, VP, partIdx } = X;
const segM = k => F.years.map((_, i) => Math.round(F.seg[k].adjEbitda[i] / F.seg[k].revenue[i] * 1000) / 10);
const astecPart = P[partIdx(/^Astec/)], astecMv = 1620;

const crop = {
  id: 'crop', nav: 'Crop Care & Astec', kicker: 'Segment', title: 'Crop Care and Astec: a high-margin franchise in a soft patch, and a chemicals arm still losing money',
  blocks: [
    { pair: [
      { type: 'column', title: 'Standalone crop care revenue by quarter', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Crop Care (standalone)', values: SQ.map(q => q.ccRev), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'Standalone EBIT margin: 45% to 32% in two years (Q1)', unit: 'Segment result margin (%)', x: QL, series: [{ name: 'Margin', values: SQ.map(q => q.ccEbitPct), fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: SRC },
    ] },
    { bullets: [
      '**The franchise.** Standalone revenue ₹764 cr (FY25) and ₹772 cr (FY26) at 40% and 29% EBIT margins. Profit is concentrated in in-house cotton herbicide (Hitweed) and the chilli insecticide Gracia, sold in a few weeks of the season. FY26 suffered unseasonal rain, lower cotton acreage and channel stock; Q1FY27 a 40% June rain deficit (revenue −17%, EBIT −38%).',
      '**Diversification.** Ashitaka (maize herbicide), Takai (insecticide, paddy plus five crops) and Ghassnash (soybean herbicide, May-2026) were ~18-20% of Q1FY27 sales vs ~3% in FY26. They are in-licensed, so margins are lower than Hitweed\'s. Management targets a 26-27% standalone EBIT margin for FY27 and would give a fuller view only after September.',
      `**Astec LifeSciences (67.03%, listed).** Revenue ₹628 cr (FY23), ₹381 cr (FY25), ₹448 cr (FY26); losses ₹47 cr, ₹135 cr and ₹81 cr in FY24-26 (Screener). FY26 EBITDA broke even (company basis); Q1FY27 revenue ₹83 cr (−9%), EBITDA nil. CDMO is ~52% of revenue and exports ~53%. GAVL put ₹199 cr into a rights issue in Jul-2025; the board was reshaped in 2026 and the group is reviewing Astec's structure. Its 30-Sep-2026 market value was ~₹${n0(astecMv)} cr (₹722.75 a share).`,
    ] },
    { pair: [
      { type: 'column', title: 'Astec revenue: a third below the FY22 peak', unit: 'Astec revenue (₹ crore, annual)', x: FYS(), series: [{ name: 'Revenue', values: SA.map(a => a.astRev), fmt: 'num' }], labels: 'all', source: 'Screener.in (Astec consolidated)' },
      { type: 'column', title: 'Astec operating profit: from ₹154 cr to a loss', unit: 'Astec operating profit (₹ crore)', x: FYS(), series: [{ name: 'Operating profit', values: SA.map(a => a.astEbitda), fmt: 'num' }], labels: 'all', source: 'Screener.in (Astec consolidated)' },
    ] },
    { callout: `**Our view:** crop care is still a very profitable business, but not the 40%+ margin business of FY25: the new products dilute margins and the weather risk is high. We model standalone revenue +3% / +12% / +10% and EBITDA margin ${segM('cc').join('% / ')}% (our basis: crop care less Astec). Astec: revenue +15% / +15% / +12% at ${segM('ast').join('% / ')}% EBITDA margins, i.e. still loss-making after interest in FY27-28. In the SOTP we take Astec at its market value less 20%: ₹${n0(astecPart.value)} cr, ~₹${n0(astecPart.perShare)} a share.` },
  ],
};

function FYS() { return SA.map(a => a.fy); }

const consumer = {
  id: 'consumer', nav: 'Dairy & Godrej Foods', kicker: 'Segments', title: 'Dairy and Godrej Foods: ₹2,360 cr of revenue earning less than ₹110 cr of EBITDA',
  blocks: [
    { pair: [
      { type: 'line', title: 'Creamline EBITDA margin: 6.4% to 1.5% in two years (Q1)', unit: 'Company EBITDA margin (%)', x: QL, series: [{ name: 'Dairy', values: SQ.map(q => q.dairyEbitdaPct), fmt: 'pct' }, { name: 'Godrej Foods', values: SQ.map(q => q.foodEbitdaPct), fmt: 'pct' }], labels: 'last', min: 0, max: 12, source: SRC },
      { type: 'column', title: 'Revenue: dairy growing again, foods flat', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Dairy', values: SQ.map(q => q.dairyRev), fmt: 'num' }, { name: 'Godrej Foods', values: SQ.map(q => q.foodRev), fmt: 'num' }], labels: 'none', source: SRC },
    ] },
    { bullets: [
      `**Dairy (Creamline, 'Godrej Jersey').** Revenue ₹1,501 cr (FY23) to ₹1,589 cr (FY26); segment EBITDA margin ${SA.map(a => `${a.dairyEbitdaPct}%`).join(', ')} (FY20-26). Value-added products rose to 49% of sales in Q1FY27 and volume grew 8%, but milk procurement prices and war-led packaging costs cut EBITDA to ₹7 cr. GAVL paid ₹922 cr in FY25-26 to own 99.78%; Creamline earned ₹3 cr of profit in FY26. A new CEO is redoing the route to market over 18-20 months.`,
      `**Godrej Foods (Real Good Chicken, Yummiez).** Revenue ₹1,003 cr (FY23) to ₹768 cr (FY26) as live-bird trading is cut 15-20% a year; branded B2C is ~32% of the business and grows ~20% (Yummiez volume +22% in Q1FY27). EBITDA ₹50 cr in FY26, ₹5 cr in Q1FY27 as costs rose and advertising stepped up. Management expects 3-4 years of investment; target 65-70% B2C.`,
      '**Synergies are thin.** Management admits it has not linked Creamline\'s milk farmers to its cattle-feed sales; the businesses mostly share a parent, not customers.',
    ] },
    { callout: `**Our view:** two turnarounds with good brands and poor economics: Creamline's return on segment capital was ${A26.dairyRoce}% and Godrej Foods' ${A26.foodRoce}% in FY26. We model dairy EBITDA margins of ${segM('dairy').join('% / ')}% and foods ${segM('food').join('% / ')}%, i.e. a recovery to FY24-25 levels, not beyond. Together they are ~₹{{F.seg.dairy.adjEbitda.2|num}} cr + ₹{{F.seg.food.adjEbitda.2|num}} cr of FY29E EBITDA.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in oil palm and feed scale, absent in pricing',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict[0].toUpperCase() + m.verdict.slice(1), m.evidence, m.verdict === 'advantage' ? 'Protects volume, cost or margin.' : m.verdict === 'parity' ? 'Keeps GAVL competitive; does not set it apart.' : 'Caps margins and returns.']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** GAVL has **two genuine advantages**: the oil-palm franchise (state-allotted factory zones, farmer relationships built over decades, the best extraction rates in India, and plantations that take 4-8 years to replicate) and scale and sourcing skill in cattle feed. Crop care has a strong brand but a narrow product base. Dairy, chicken and Astec have **no moat today**. None of the businesses sets its own prices: feed and dairy pass on 60-70% of costs, oil palm earns a formula-linked share of a world price, and Indian import duties can move that price overnight. Expect a 15-20% ROE company whose profits swing with commodity cycles, not a compounding consumer franchise.' },
  ],
};

module.exports = { crop, consumer, moat };
