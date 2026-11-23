// Tube Investments of India report, part B-3: industry, tailwind test, the standalone businesses, CG Power, and
// TI Clean Mobility and the other new ventures.
const X = require('./TIINDIA.ctx');
const { C, D, F, AS, SA, SQ, QL, ann, n0, n1, price, ps, cgMv, P, sh } = X;

const I = D.industry, Q1 = C.q1fy27, T = C.ticmpl;
const segYrs = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], sy = f => ann(f);
const mg = (p, r) => (p == null || !r ? null : Math.round(p / r * 1000) / 10);

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Four industries, one common thread: Indian vehicle and industrial production',
  blocks: [
    { exhibit: { type: 'table', title: 'Where TII and its subsidiaries compete', head: ['Business', 'Market and position', 'What drives it'], wide: [1, 2], rows: [
      ['Precision tubes and strips', I.tubes.replace(/ \(q1call\)/, ''), 'Two-wheeler, car, truck and tractor production; exports (~14% of standalone revenue); steel prices (passed on with a lag)'],
      ['Chains, door frames, fine blanking', I.chains.replace(/ \(q4call, q1call\)/, ''), 'Two-wheeler and car volumes, Hyundai\'s output, railway tenders'],
      ['Bicycles and fitness', I.cycles, 'School demand, rural incomes, premiumisation'],
      ['Electric commercial vehicles (TICMPL)', I.ev.replace(/ \(q4call, q1call\)/, ''), 'Total cost of ownership vs diesel, financing, charging, PM E-DRIVE incentives, cell prices'],
      ['CG Power', 'India\'s largest motor maker and a top transformer and switchgear supplier; new in semiconductors', 'Power transmission capex, railways, industrial capex; data centres and OSAT demand'],
    ], source: 'TII AR FY26 MD&A, Q4FY26 and Q1FY27 calls, Q1FY27 deck' } },
    { p: 'The common thread is the Indian capital and vehicle cycle. In Q1FY27 TII\'s engineering volumes grew ~17% and management called demand "pretty good across segments" with exports up double digits; the risks it named were steel and fuel inflation, cell prices for EVs, the West Asia conflict and Hyundai\'s weak output. None of TII\'s businesses has pricing power over steel: tube and chain contracts reset to steel prices with a one-to-three-quarter lag, which is why margins dip when steel rises (Q4FY26-Q1FY27) and recover after.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the sector tailwind reach TII? Yes in volumes, not yet in margins or EVs',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Does it reach TII?', 'Evidence'], wide: [2], rows: [
      ['Vehicle production growth (GST cut of Sep-2025, rural recovery)', 'Yes', `Engineering volume +17% and revenue +21% in Q1FY27; MFP revenue +11.5%; cycles +26%`],
      ['Steel prices', 'Neutral over a cycle, negative now', 'Engineering PBIT margin 9.8% in Q1FY27 vs 11.8% a year earlier; recovery promised "in the coming quarters"'],
      ['Exports and China+1', 'Partly', 'Exports ~14% of standalone revenue, double-digit growth in Q1FY27; US tariffs and West Asia flagged as risks'],
      ['Electrification of commercial vehicles', 'Not yet profitable', `EV segment revenue +77% to ₹${T.evSegment.revQ1FY27} cr in Q1FY27 but loss ₹${n0(T.evSegment.lossQ1FY27)} cr; one business to break even in FY27`],
      ['Power transmission and data-centre capex (via CG Power)', 'Yes, but TII\'s shareholders get it at a discount', `CG Power revenue +25% in FY26, power systems +31% in Q1FY27; CG worth ₹${n0(ps(cgMv))} per TII share`],
    ], source: 'Q1FY27 call and deck; Cofacto results summary (14-Aug-2026); GAM Research' } },
    { callout: '**Verdict:** the volume tailwind is real and visible in Q1FY27; the margin will follow once steel prices are passed through. But the stock\'s value depends far more on CG Power\'s price and on the discount the market applies to it than on TII\'s tube volumes.' },
  ],
};

const standalone = {
  id: 'standalone', nav: 'TII\'s own businesses', kicker: 'Segment', title: 'TII\'s own businesses: a high-return tube maker with a cycles drag',
  blocks: [
    { p: `Engineering (precision tubes and strips) is the core: ₹5,612 cr of FY26 revenue and ₹689 cr of PBIT (12.3%). It grew 12% in FY26 and 21% in Q1FY27 on volumes (+17%), new tube and strip capacity in western India (tubes ~30% utilised in May-2026, the Nashik strip plant to be full by end-FY27 or mid-FY28) and exports. Metal formed products (chains, door frames, fine blanking, railway sections) is slower: revenue +2% in FY26 with a 10.1% margin, held back by unprofitable railway tenders, Hyundai's weak production and a western greenfield plant running six months late. Cycles finally makes money (PBIT ₹19 cr in FY26 after a ₹18 cr loss in FY24) and management wants ~2 more points of margin in FY27. "Others" holds industrial chains (Rombo, 50%+ exports in special-purpose chains), TMT bars, truck bodies, optics, CDMO and Orange Koi.` },
    { pair: [
      { type: 'column', title: 'Segment revenue: engineering is two-thirds and growing fastest', unit: 'Revenue incl. inter-segment (₹ crore)', x: segYrs, series: [{ name: 'Engineering', values: segYrs.map(f => sy(f).engRev), fmt: 'num' }, { name: 'Metal formed', values: segYrs.map(f => sy(f).mfpRev), fmt: 'num' }, { name: 'Cycles', values: segYrs.map(f => sy(f).mobRev), fmt: 'num' }, { name: 'Others', values: segYrs.map(f => sy(f).othRev ?? null), fmt: 'num' }], labels: 'none', source: 'TII AR FY22, FY24 and FY26 MD&A; Q4FY25 and Q4FY26 calls (FY21-22 "others" not extracted)' },
      { type: 'line', title: 'PBIT margins: engineering 10-13%, MFP down from 12% to 10%, cycles ~2%', unit: 'Segment PBIT margin (%)', x: segYrs, series: [{ name: 'Engineering', values: segYrs.map(f => mg(sy(f).engPbit, sy(f).engRev)), fmt: 'pct' }, { name: 'Metal formed', values: segYrs.map(f => mg(sy(f).mfpPbit, sy(f).mfpRev)), fmt: 'pct' }, { name: 'Cycles', values: segYrs.map(f => mg(sy(f).mobPbit, sy(f).mobRev)), fmt: 'pct' }], labels: 'last', min: -4, max: 16, source: 'As left' },
    ] },
    { pair: [
      { type: 'column', title: 'Standalone revenue by quarter: +18% in Q1FY27', unit: 'Revenue net of inter-segment (₹ crore)', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.saRev), fmt: 'num' }], labels: 'all', source: 'TII earnings calls' },
      { type: 'column', title: 'Standalone PBT by quarter: Q1FY27 −4% despite the volume jump', unit: 'PBT before exceptional items and CCPS fair value (₹ crore)', x: QL, series: [{ name: 'PBT', values: SQ.map(q => q.saPbt), fmt: 'num' }], labels: 'all', source: 'TII earnings calls (Q4 includes the CG Power dividend)' },
    ] },
    { callout: `**So what:** TII's own businesses earned ₹${n0(X.coreHist.FY26)} cr of core profit in FY26 (before dividends from CG Power and Shanthi Gears), with a pre-tax ROIC of 44%. That is an excellent return, but growth has been modest (core profit ~9% a year since FY23) and Q1FY27 shows how exposed margins are to steel. We forecast core profit of ₹${n0(X.saB.base[0].pat)} cr / ₹${n0(X.saB.base[1].pat)} cr / ₹${n0(X.saB.base[2].pat)} cr for FY27-29E: flat this year as the steel lag unwinds, then ~13-19% growth.` },
  ],
};

const cgpower = {
  id: 'cgpower', nav: 'CG Power', kicker: 'Subsidiary', title: 'CG Power: the turnaround that made TII, now 85% of its look-through value',
  blocks: [
    { p: `TII took control of CG Power in November 2020, when it was a near-bankrupt company. Under TII's management CG Power's consolidated revenue rose from ₹2,964 cr (FY21) to ₹12,418 cr (FY26) and EBITDA from ₹116 cr to ₹1,641 cr. On ${X.ASOF_TXT} it was worth ~₹${n0(X.cgPx * 157.44)} cr (₹${X.cgPx.toFixed(2)} a share, ${n1(P.CGPOWER.pe)}x trailing earnings against a five-year median of ${n1(X.MED5.CGPOWER)}x). TII's 88.65 cr shares (56.29%) were worth ₹${n0(cgMv)} cr, ₹${n0(ps(cgMv))} per TII share, against TII's own share price of ₹${n0(price)}.` },
    { pair: [
      { type: 'column', title: 'CG Power revenue: four times FY21', unit: 'Revenue (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Revenue', values: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => ann(f).cgRev), fmt: 'num' }], labels: 'all', source: 'Screener.in (CG Power consolidated)' },
      { type: 'column', title: 'CG Power by quarter: margin dipped in Q1FY27 on semiconductor losses', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => Math.round(q.cgEbitda / q.cgRev * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Screener.in (CG Power consolidated quarterly)' },
    ] },
    { p: `For TII's shareholders CG Power matters in three ways. **Value:** the stake is ~${Math.round(cgMv / (cgMv + X.sgMv + X.SOTP.base.saV + X.TIC.base + X.OTHER_UNL) * 100)}% of our look-through value before the discount. **Cash:** TII receives only CG's dividends (₹115 cr in FY24, ₹1.30 a share); CG keeps most of its cash for its own growth (switchgear, transformers, the CG Semi OSAT plant with Renesas and Stars Microelectronics). **Earnings:** CG is ~58% of the EBITDA of TII's profitable blocks (72% of the consolidated total after the ventures' losses), which is why TII's consolidated P/E is not a useful yardstick. CG Power is covered separately; in this report we take its market price as given and do not form our own view of its value.` },
  ],
};

const ventures = {
  id: 'ventures', nav: 'EV & new ventures', kicker: 'Subsidiaries', title: 'TI Clean Mobility and the new ventures: ~₹1,700 cr invested, ~₹550 cr a year of EBITDA losses',
  blocks: [
    { p: `**TI Clean Mobility (TICMPL, brand Montra Electric)** has four businesses: electric 3-wheelers (passenger and cargo; ~6,700 billed in FY26, ~120 outlets), e-tractors (first billing in Q1FY27), electric small commercial vehicles (TIVOLT, Eviator; 27% market share in Q4FY26) and heavy electric trucks (IPLTech, Rhino; ~28% share of a ~300-trucks-a-year market). Revenue reached ₹${T.evSegment.revQ1FY27} cr in Q1FY27 (+77%), but the segment lost ₹${n0(T.evSegment.lossQ1FY27)} cr (₹${n0(T.evSegment.lossQ1FY26)} cr a year earlier). Management says peak quarterly losses are behind it, one business should break even in FY27 and two more in FY28.` },
    { exhibit: { type: 'table', title: 'TICMPL\'s capital structure', head: ['Investor', 'Instrument', 'Amount (₹ cr)', 'Status'], wide: [3], rows: [
      ['TII', 'Equity', '250', 'Fully owns the equity today'],
      ['TII', 'Series B CCPS (FY23-24) and Series C CCPS (30-Mar-2026)', '500 + 250', 'Series B fair-valued at ₹1,075.80 cr just before the Mar-2026 restatement; now at cost'],
      ['Multiples PE funds and co-investors', 'Equity and Series A1 CCPS (FY24)', '~1,200', 'Convert only at an IPO'],
      ['South Asia Growth Invest III / EBT Trust III (Temasek group)', 'Equity and CCPS (agreement 6-May-2024)', '~580', 'Convert only at an IPO'],
      { hl: true, cells: ['**Outside investors\' CCPS, carrying value at 30-Mar-2026**', '', `**${n0(T.investorCcpsFairValueMar26)}**`, 'Moved from liability to minority interest'] },
      ['TII, planned', 'Second tranche of the ₹750 cr programme', '250 in Q3FY27', 'Third tranche later'],
    ], source: 'TII AR FY24 (Board\'s report 4.1), AR FY26 notes 6a and 29, Q4FY26 deck p.30, Q1FY27 call' } },
    { p: `How much of TICMPL TII will own after conversion depends on the IPO valuation (CFO, Q1FY27 call). We value TII's interest at its cost (₹${n0(T.tiiInvested)} cr) in the base case, at the March-2026 fair-value mark (₹${n0(X.TIC.bull)} cr) in the bull case, and in the bear case at minus the present value of the ₹500 cr TII has still promised (equity worth nothing). The **other ventures** are smaller: TI Medical (sutures, surgical devices; ~₹200 cr revenue, ~20% growth guided, an IV-cannula plant from Aug-Sep 2026), 3xper (CDMO and APIs; a 200 KL plant at Naidupeta commissioned, regulatory inspection expected in FY28), Kcaltech (aluminium HVAC tubes), Orange Koi (metal injection moulding) and TI Optics (camera lenses; "yet to make inroads").` },
    { callout: `**So what:** together the residual block (EV plus new ventures, net of eliminations) lost ₹550 cr at EBITDA in FY26 and about ₹110 cr in Q1FY27. We assume losses narrow to ₹${n0(-F.seg.res.adjEbitda[1])} cr in FY28E and ₹${n0(-F.seg.res.adjEbitda[2])} cr in FY29E, slower than management's break-even talk. Every ₹100 cr of loss is ~₹${n0(100 / sh)} a share a year of TII's earnings; in the valuation the ventures are only ~₹${n0(ps(X.TIC.base + X.OTHER_UNL))} a share at cost.` },
  ],
};

module.exports = { industry, tailwind, standalone, cgpower, ventures };
