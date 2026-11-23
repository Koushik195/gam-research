// TCS report, part 2b: industries and markets, deals and AI, people and delivery (the operating chapters).
const X = require('./TCS.ctx');
const { C, n0, n1, pc1, SA, SQ, QL, A26, Q1, FY26, VERT, GEO, VN, GN, UB, usd, usdGrowth } = X;
const last = SQ.at(-1);
const vRow = k => [VN[k], `${A26[k]}%`, `${A26[k + 'Cc'] >= 0 ? '+' : ''}${A26[k + 'Cc']}%`, `${last[k + 'Cc'] >= 0 ? '+' : ''}${last[k + 'Cc']}%`, `${UB.growthPct[k][0] >= 0 ? '+' : ''}${UB.growthPct[k][0]}% / +${UB.growthPct[k][1]}%`, n0(usd[1][k])];
const DRV = { bfsi: 'Core modernisation, vendor consolidation; US banks strong', cbg: 'Large projects ended in Q1; airlines, discretionary retail weak; M&S and US pharmacy-retail mega deals', lsh: 'Declined in Q1 (pharma cost cuts); recovery expected', mfg: 'Auto soft (tariffs, EV reset); SKF US$800 m+ net-new deal ramps', tech: 'Software and platform firms; ServiceNow deal', cmi: 'Telecom headwinds; UK operator mega deal (Q4FY26)', eru: 'Energy and utilities transformation; AI data-centre power demand', rmo: 'India (BSNL fall in FY26, add-on order next), public sector, products' };

const verticals = {
  id: 'verticals', nav: 'Industries & markets', kicker: 'Segments', title: 'Industries and markets: BFSI and technology carry growth; consumer and Europe lag',
  blocks: [
    { p: `In FY26 only three of eight industries grew in constant currency: BFSI (+${A26.bfsiCc}%), Technology (+${A26.techCc}%) and Energy & Utilities (+${A26.eruCc}%). Regional Markets fell ${Math.abs(A26.rmoCc)}% as BSNL tapered, and Communications fell ${Math.abs(A26.cmiCc)}%. By market, North America was flat (+${A26.naCc}%), the UK fell ${Math.abs(A26.ukCc)}% and continental Europe ${Math.abs(A26.ceCc)}%. Q1FY27 was broader: six of eight industries grew year on year, led by Energy & Utilities (+${last.eruCc}%), Technology and Life Sciences (+${last.techCc}% each) and BFSI (+${last.bfsiCc}%), while Consumer Business shrank ${Math.abs(last.cbgCc)}% after large programmes ended. India rose ${last.indiaCc}% on a low base.` },
    { exhibit: { type: 'table', title: 'Industries: what they are, how they grew, what we model', head: ['Industry', 'FY26 share', 'FY26 CC growth', 'Q1FY27 CC YoY', 'GAM USD growth FY27E / FY28E', 'GAM FY28E revenue (US$ m)', 'What drives it'], wide: [6], rows: VERT.map(k => [...vRow(k), DRV[k]]), source: 'TCS fact sheets (Q4FY26, Q1FY27); GAM Research (assumptions.json usdBuild)' } },
    { pair: [
      { type: 'line', title: 'BFSI steady; Regional Markets swung with BSNL', unit: 'Constant-currency growth, YoY (%)', x: QL, series: [{ name: 'BFSI', values: SQ.map(q => q.bfsiCc), fmt: 'pct' }, { name: 'Consumer Business', values: SQ.map(q => q.cbgCc), fmt: 'pct' }, { name: 'Regional Markets & Others', values: SQ.map(q => q.rmoCc), fmt: 'pct' }], labels: 'last', source: 'TCS fact sheets' },
      { type: 'hbar', title: 'Q1FY27 by market: India and Europe up, the UK still down', unit: 'Constant-currency growth, Q1FY27 YoY (%)', x: ['North America', 'UK', 'Continental Europe', 'India'], series: [{ name: 'CC growth', values: [last.naCc, last.ukCc, last.ceCc, last.indiaCc], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 fact sheet' },
    ] },
    { callout: `**So what:** TCS is a BFSI-and-North-America company (32% and 48% of revenue). Our FY27E USD growth of ${n1(usdGrowth[0])}% assumes BFSI keeps compounding at ~4%, Consumer stays slightly negative until H2, and the BSNL add-on lifts Regional Markets. The swing factors are Consumer (15%) and the UK (17%), both exposed to discretionary cuts and the West Asia conflict.` },
  ],
};

const deals = {
  id: 'deals', nav: 'Deals, clients & AI', kicker: 'Order book', title: 'Order book: record mega deals, but revenue converts slowly and at lower prices',
  blocks: [
    { p: `TCS signed US$${FY26.tcvBn} bn of contracts in FY26 (FY25 US$39.4 bn, FY24 US$42.7 bn), ~1.35x a year's revenue, including five mega deals, and US$${Q1.tcvBn} bn in Q1FY27 with an US$800 m+ net-new deal from SKF. Roughly half of TCV is renewals and half new programmes (CEO, Apr-2026). The problem is conversion: TCV has stayed at US$39-43 bn a year for three years while revenue went sideways, because renewals carry productivity give-backs and new AI projects are short (12-16 weeks) and must be re-won. Client metrics turned in Q4FY26: every revenue band added clients for the first time in about two years, and the US$100 m+ group went from 62 to 66.` },
    { pair: [
      { type: 'column', title: 'TCV of US$9-12 bn a quarter', unit: 'Total contract value signed (US$ m)', x: QL, series: [{ name: 'TCV', values: SQ.map(q => q.tcvM), fmt: 'num' }], labels: 'all', source: 'TCS fact sheets' },
      { type: 'line', title: 'Book-to-bill: TCV ÷ quarterly revenue', unit: 'TCV ÷ revenue in the quarter (x)', x: QL, series: [{ name: 'Book-to-bill', values: SQ.map(q => Math.round(q.tcvM / q.usdRevM * 100) / 100), fmt: 'x' }], labels: 'all', min: 0, source: 'TCS fact sheets; GAM calculation' },
    ] },
    { exhibit: { type: 'table', title: 'Recent mega deals and AI', head: ['When', 'What', 'Why it matters'], wide: [1, 2], rows: [
      ['Q4FY26', 'Marks & Spencer: renewal and expansion of a decade-plus relationship', 'Retained a marquee client after its 2025 cyber-attack'],
      ['Q4FY26', 'Leading UK telecom operator: five-year IT transformation of its consumer business, consolidating several vendors', 'First CMI mega deal; vendor consolidation in action'],
      ['Q4FY26', 'Leading US healthcare and pharmacy retailer: renewal (claims platform)', 'Retention, likely at lower price'],
      ['Q1FY27', 'SKF: US$800 m+ net-new, AI-led S/4HANA, infrastructure and process transformation (five years)', 'Proof that clients still buy large transformation from SIs'],
      ['Q1FY27', 'North American utility (renewal with "AI-first" proposition); autonomous GBS deals in HR, finance and customer service', 'Outcome- and transaction-based pricing growing'],
      ['FY26-Q1FY27', `AI services run-rate US$1.5 bn → US$2.3 bn → US$${Q1.aiAnnualizedRevenueBn} bn`, 'Higher revenue productivity than average (CFO); lumpy'],
    ], source: 'TCS calls (Apr-2026, Jul-2026) and Q1FY27 press release; JM Financial via BT (8-Sep-2026) for SKF tenure' } },
    { callout: '**So what:** the order book is not the problem; pricing and conversion are. A US$40 bn TCV run-rate that produced 0-3% revenue growth in FY25-27 tells you each dollar of renewal TCV now buys less revenue than before. We model conversion improving only slowly (USD growth 3.3% FY27E, 4.2% FY28E).' },
  ],
};

const rpe = SA.slice(1).map((a, i) => ({ fy: a.fy, v: a.usdRevM / ((a.headcount + SA[i].headcount) / 2) * 1000 }));
const people = {
  id: 'people', nav: 'People & delivery', kicker: 'Workforce', title: 'Fewer people, more revenue each: AI productivity is already visible',
  blocks: [
    { p: `Headcount peaked at 615,318 in Jun-2023 and was ${n0(FY26.headcount)} in Mar-2026 after the 2025 restructuring (~12,000 roles, ₹1,388 cr of severance); TCS then added ${n0(Q1.headcountQoQ)} people in Q1FY27, the most in over a year. Revenue per employee rose from ~US$${Math.round(rpe.find(r => r.fy === 'FY23').v)}k in FY23 to ~US$${Math.round(rpe.find(r => r.fy === 'FY26').v)}k in FY26. Voluntary attrition is ${Q1.voluntaryAttritionPct}% (LTM), far below FY22-23's ~17-20%. Wages: FY26 increments were delayed to Sep-2025 and given to ~80% of staff; FY27 increments for all grades from Apr-2026 cost 170 bp of margin in Q1. Subcontracting (fees to external consultants) rose from 4.7% of revenue in Q1FY26 to 5.9% in Q1FY27, a sign of skills TCS does not yet have in-house.` },
    { pair: [
      { type: 'column', title: 'Headcount fell 30,000 in FY26, then rose again', unit: 'Closing headcount', x: QL, series: [{ name: 'Headcount', values: SQ.map(q => q.headcount), fmt: 'num' }], labels: 'ends', source: 'TCS fact sheets' },
      { type: 'column', title: 'Revenue per employee: up ~9% in three years', unit: 'US$ revenue ÷ average headcount (US$ thousand)', x: rpe.map(r => r.fy), series: [{ name: 'Revenue per employee', values: rpe.map(r => Math.round(r.v * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'TCS fact sheets; GAM calculation' },
    ] },
    { exhibit: { type: 'table', title: 'Cost structure (% of revenue, before exceptional items)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27'], rows: [
      ['Employee cost', '59.5%', '56.8%', '58.3%'], ['Fees to external consultants', '4.7%', '5.6%', '5.9%'], ['Equipment and software licences', '1.1%', '2.0%', '1.9%'],
      ['Project expenses and delivery software', '3.4%', '3.5%', '3.3%'], ['Depreciation and amortisation', '1.8%', '1.7%', '1.7%'], ['Other (facilities, travel, marketing, etc.)', '5.0%', '5.1%', '4.9%'],
      { hl: true, cells: ['**Operating (EBIT) margin**', '**24.5%**', '**25.3%**', '**24.0%**'] },
    ], source: 'Q1FY27 fact sheet (expense by nature, restated categories)' } },
    { callout: '**So what:** TCS is delivering more revenue per person, which is what AI should do; the question is who keeps the gain. So far TCS has kept enough to hold margins at ~25% while passing 10-15% to clients at renewal. FX hedges matter too: TCS had ₹66,475 cr of forwards and options outstanding at Mar-26 and booked a ₹2,771 cr loss on them in FY26 as the rupee fell (offset in translation), so the rupee tailwind reaches margins with a lag.' },
  ],
};

module.exports = { verticals, deals, people };
