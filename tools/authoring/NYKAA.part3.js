// Nykaa report, part 3: the Beauty and Fashion chapters and the competitive-advantage scorecard.
const C = require('./NYKAA.ctx');
const { n0, n1, QL, qv, A25, A26, q1, q1y, F, PB, PF } = C;
const SRC = 'Nykaa investor presentations (vertical reporting), GAM Research';
const pc = (a, b) => (a / b * 100).toFixed(1) + '%';
const Q1Y = q1y, Q1 = q1;
const econ = (gp, ff, mk, ct, ot, eb, nsv) => [pc(gp, nsv), pc(ff, nsv), pc(mk, nsv), pc(ct, nsv), pc(ot, nsv), pc(eb, nsv)];
const LINES = ['Gross margin', 'Fulfilment', 'Marketing and selling', 'Contribution margin', 'Employee and other overheads', 'EBITDA margin'];
const tbl = cols => LINES.map((l, i) => [l, ...cols.map(c => c[i])]).map((r, i) => (i === 3 || i === 5 ? { hl: true, cells: r } : r));

// ---------------------------------------------------------------- Beauty
const bCols = [econ(A25.bGp, A25.bFulfil, A25.bMkt, A25.bContrib, A25.bOther, A25.bEbitda, A25.bNsv), econ(A26.bGp, A26.bFulfil, A26.bMkt, A26.bContrib, A26.bOther, A26.bEbitda, A26.bNsv),
  econ(Q1Y.bGp, 170, 234, Q1Y.bContrib, 250, Q1Y.bEbitda, Q1Y.bNsv), econ(Q1.bGp, 227, 300, Q1.bContrib, 298, Q1.bEbitda, Q1.bNsv)];
const beauty = {
  id: 'beauty', nav: 'Beauty', kicker: 'Segment: Beauty', title: `Beauty: growing ${q1.bGmvYoY}% at a ${q1.bEbitdaPctNsv}% margin, with owned brands doing the heavy lifting`,
  blocks: [
    { p: `Beauty is ~75% of GMV and all of Nykaa's profit. It combines the Nykaa app and website (most of the business), 324 stores, the House of Nykaa brands (Nykaa Cosmetics, Kay Beauty, Dot & Key and others: ₹1,700 cr of NSV in FY26, ~16% of group GMV), Superstore (eB2B supply to small shops) and Nykaa Man grooming. In Q1FY27 GMV rose ${q1.bGmvYoY}% to ₹${n0(q1.bGmv)} cr on more buyers (annual unique customers +25% to ${q1.bAutcMn} mn) and slightly bigger baskets (AOV +5% to ₹${n0(q1.bAov)}). The EBITDA margin rose to ${q1.bEbitdaPctNsv}% of NSV from ${q1y.bEbitdaPctNsv}% a year earlier.` },
    { pair: [
      { type: 'column', title: 'Beauty NSV: growth back near 30%', unit: 'Beauty NSV by quarter (₹ crore)', x: QL, series: [{ name: 'NSV', values: qv('bNsv'), fmt: 'num' }], labels: 'ends', source: SRC },
      { type: 'line', title: 'Beauty margin: from 8.5% to 10.3% of NSV in two years', unit: 'Beauty EBITDA, % of NSV', x: QL, series: [{ name: 'EBITDA margin', values: qv('bEbitdaPctNsv'), fmt: 'pct' }], labels: 'all', source: SRC },
    ] },
    { exhibit: { type: 'table', title: 'Beauty unit economics (% of NSV)', head: ['', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27'], rows: tbl(bCols), source: 'Nykaa Q4FY26 and Q1FY27 presentations (vertical reporting); GAM calculations' } },
    { p: 'Where the margin comes from: the gross margin is up ~1.5pp in two years (owned brands earn more than third-party brands; premium brands; brands paying for advertising on the app), and overheads have fallen as a share of sales. Fulfilment and marketing have stayed roughly flat: Nykaa is reinvesting in faster delivery (Nykaa Now) and customer acquisition. That is a healthy mix: the gains are structural, not from cutting growth spending.' },
    { exhibit: { type: 'tiles', title: 'Beauty drivers (Q1FY27, YoY)', tiles: [
      { k: 'Visits', v: `${q1.bVisitsMn} mn`, d: `+${Math.round((q1.bVisitsMn / q1y.bVisitsMn - 1) * 100)}%` },
      { k: 'Monthly unique visitors', v: `${q1.bMauvMn} mn`, d: `+${Math.round((q1.bMauvMn / q1y.bMauvMn - 1) * 100)}%` },
      { k: 'Orders', v: `${q1.bOrdersMn} mn`, d: `+${Math.round((q1.bOrdersMn / q1y.bOrdersMn - 1) * 100)}%` },
      { k: 'Average order value', v: `₹${n0(q1.bAov)}`, d: `+${Math.round((q1.bAov / q1y.bAov - 1) * 100)}%` },
      { k: 'Stores', v: n0(q1.stores), d: `${q1y.stores} a year ago; target ~600 by FY30` },
    ], source: 'Nykaa Q1FY27 presentation' } },
    { h: 'Superstore: the drag inside Beauty' },
    { p: `Superstore supplies beauty and personal-care products to ${q1.ssRetailersK}k registered small retailers (chemists, general stores) in 1,200+ cities. GMV was ~₹${n0(A26.ssGmv)} cr in FY26 and ₹${q1.ssGmv} cr in Q1FY27 (+17%; NSV +28%, as GST cuts lowered retail prices). Nykaa stopped reporting its profit when it merged Superstore into Beauty in FY26; HSIE estimates an EBITDA loss of ~7% of NSV in FY26. Management targets ₹3,500 cr of GMV and breakeven by FY30. Our Beauty margin forecast includes these losses, which is one reason we add only ~0.4pp of GMV a year.` },
    { callout: `**Our forecast:** Beauty GMV +27% / +26% / +25% in FY27-29E and EBITDA of 6.0% / 6.4% / 6.8% of GMV (≈10.4% / 11.1% / 11.8% of NSV), giving Sep-28E EBITDA of ₹${n0(PB.metric)} cr, which we value at ${PB.mult}x.` },
  ],
};

// ---------------------------------------------------------------- Fashion
const fCols = [econ(A25.fGp, A25.fFulfil, A25.fMkt, A25.fContrib, A25.fOther, A25.fEbitda, A25.fNsv), econ(A26.fGp, A26.fFulfil, A26.fMkt, A26.fContrib, A26.fOther, A26.fEbitda, A26.fNsv),
  econ(Q1Y.fGp, 33, 83, Q1Y.fContrib, 42, Q1Y.fEbitda, Q1Y.fNsv), econ(Q1.fGp, 47, 103, Q1.fContrib, 51, Q1.fEbitda, Q1.fNsv)];
const fashion = {
  id: 'fashion', nav: 'Fashion', kicker: 'Segment: Fashion', title: `Fashion: GMV +${n0(q1.fGmvYoY)}% and at breakeven, but still a long way from Beauty's margins`,
  blocks: [
    { p: `Nykaa Fashion is a curated, premium fashion platform: mostly a marketplace, so revenue was only ${A26.fRevPctGmv}% of GMV in FY26. For years it grew slowly and lost money (EBITDA -₹93 cr in FY25, -8.3% of NSV). That has changed fast: GMV growth rose from 12% (FY25) to 30% (FY26) and ${n0(q1.fGmvYoY)}% in Q1FY27, while marketing fell from 31% of NSV (FY25) to 23% (Q1FY27), so EBITDA reached breakeven in Q4FY26 and Q1FY27. Management credits a richer brand line-up (130+ new brands in Q1), cheaper customer acquisition (~30% lower cost per new customer in two years) and more repeat buyers.` },
    { pair: [
      { type: 'column', title: 'Fashion GMV: acceleration in the last four quarters', unit: 'Fashion GMV by quarter (₹ crore)', x: QL, series: [{ name: 'GMV', values: qv('fGmv'), fmt: 'num' }], labels: 'ends', source: SRC },
      { type: 'column', title: 'Fashion EBITDA: losses closed out', unit: 'Fashion EBITDA by quarter (₹ crore)', x: QL, series: [{ name: 'EBITDA', values: qv('fEbitda'), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { exhibit: { type: 'table', title: 'Fashion unit economics (% of NSV)', head: ['', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27'], rows: tbl(fCols), source: 'Nykaa Q4FY26 and Q1FY27 presentations (vertical reporting); GAM calculations' } },
    { bullets: [
      `**Nike is a boost, not the whole story.** Since Feb-2026 Nykaa runs Nike.in and the Nike app in India (1.5 mn+ app installs in six months). JM Financial asked on the Q1 call how growth looks once Nike enters the base in mid-Q4FY27; management said Q1 growth was "largely reflective of the underlying platform" and kept its 3-3.5x-by-FY30 guidance.`,
      `**Customers:** visits +28%, annual buyers +38% to ${q1.fAutcMn} mn and orders +48% in Q1FY27; AOV fell 2% to ₹${n0(q1.fAov)}, likely because men's (+83% GMV) and kids' (+57%) categories grew fastest.`,
      '**Competition:** Myntra (Flipkart) is the online fashion leader; Ajio (Reliance), Amazon and brand websites compete too. Nykaa Fashion is a niche premium player, not a leader.',
    ] },
    { callout: `**Our forecast:** GMV +42% / +32% / +30% in FY27-29E and EBITDA of 0.3% / 0.9% / 1.5% of GMV (≈1% / 3% / 5% of NSV, short of the high-single-digit FY30 target). We value Fashion at ${PF.mult}x Sep-28E GMV (₹${n0(PF.metric)} cr): ₹${n0(PF.perShare)} a share.` },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real but narrow moat in Beauty; none yet in Fashion',
  blocks: [
    { verdicts: [
      ['Assortment and brand relationships', 'GREEN', '10,000+ brands; first or only Indian home for many global brands (Rare Beauty, Charlotte Tilbury and Kiehl\'s outlets, Unilever Prestige and P&G exclusives)', 'Global brands choose Nykaa to enter India: hard for a generalist to copy quickly'],
      ['Authenticity and trust', 'GREEN', 'Buys most beauty stock itself; brands fund discounts; no retailer-funded price war', 'Matters in beauty, where fakes are common'],
      ['Owned brands', 'GREEN', 'House of Nykaa NSV ₹1,700 cr (FY26), 16% of GMV, higher margins', 'Profit pool rivals cannot access on Nykaa\'s platform'],
      ['Scale and cost', 'AMBER', 'Fulfilment ~9-10% of NSV, flat for two years; stores add cost', 'Scale helps overheads, not logistics'],
      ['Switching costs and network effects', 'RED', 'Shoppers can buy the same brand on Tira, Myntra, Amazon or Blinkit at the brand\'s price', 'Loyalty must be re-earned with content, range and service'],
      ['Fashion', 'RED', 'Small vs Myntra; just at breakeven; reliant on partnerships such as Nike', 'No moat yet'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'Nykaa presentations, MOFSL (4-Aug-2026), Elara (25-Aug-2026), GAM Research' },
    { callout: '**Verdict: a narrow moat in Beauty.** Nykaa\'s edge is curation, trust and brand relationships, plus a growing owned-brand business, which together explain why it keeps ~10% margins while growing ~28%. It is not a monopoly: brands sell everywhere and rivals with deeper pockets (Reliance, Flipkart, Amazon, the quick-commerce apps) are investing in beauty. Fashion has no moat yet. Our 50x Beauty multiple assumes the moat holds; if quick commerce compresses Beauty growth to ~20%, our bear case applies.' },
  ],
};

module.exports = { beauty, fashion, moat };
