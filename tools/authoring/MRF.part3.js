// MRF report, part 3: the channels (replacement, OEM, exports), the raw-material spread, and the moat.
const X = require('./MRF.ctx');
const { C, D, SA, SQ, A, AS, F, n0, n1, bld } = X;
const BL = AS.build, A25 = SA.find(a => a.fy === 'FY25');
const mixRows = SA.map(a => [a.fy, a.replacementPct + '%', a.oemPct + '%', a.exportsPct + '%']);

const channels = {
  id: 'channels', nav: 'Replacement, OEM, exports', kicker: 'Channels', title: 'Replacement pays the bills; OEM brings volume; exports have stalled',
  blocks: [
    { p: `MRF does not report revenue by channel or product; CARE publishes the rounded mix each September. **Replacement** (${SA.at(-1).replacementPct}% of FY26 sales) is the profit centre: prices are set by the tyre makers, move first when costs rise, and demand follows the vehicle parc and freight activity rather than new-vehicle sales. In FY25 replacement volume grew only 5% (revenue +9%), while **OEM** volume grew 15% (revenue +19%) and **exports** 22% (revenue +23%) (CARE). In FY26 OEM gained share (${SA.at(-1).oemPct}% from ${A25.oemPct}%) as GST 2.0 lifted vehicle sales; exports were flat at ₹${n0(SA.at(-1).exportsStandalone)} cr as the Philippines, Bangladesh and the Middle East weakened (AR FY26).` },
    { pair: [
      { type: 'column', title: 'FY25: OEM and exports grew volume fastest; replacement +5%', unit: 'Volume growth FY25 (%)', x: ['Replacement', 'OEM', 'Exports', 'All tyres and tubes'], series: [{ name: 'Volume growth', values: [A25.replacementVolGrowth, A25.oemVolGrowth, A25.exportsVolGrowth, A25.unitsGrowth], fmt: 'pct0' }], labels: 'all', source: 'CARE Ratings (29-Sep-2025)' },
      { type: 'column', title: `Our build: revenue ₹${n0(bld[0].rev)} cr in FY27E, ₹${n0(bld[2].rev)} cr in FY29E`, unit: 'Revenue (₹ crore)', x: ['FY26', ...bld.map(r => r.y)], series: [{ name: 'Replacement', values: [BL.base.replacement, ...bld.map(r => r.re)].map(Math.round), fmt: 'num' }, { name: 'OEM', values: [BL.base.oem, ...bld.map(r => r.oe)].map(Math.round), fmt: 'num' }, { name: 'Exports', values: [BL.base.exports, ...bld.map(r => r.ex)].map(Math.round), fmt: 'num' }], labels: 'none', source: 'CARE mix applied to consolidated revenue; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'Channel mix and our growth assumptions', head: ['', 'Replacement', 'OEM', 'Exports'], rows: [
      ...mixRows.map(([fy, r, o, e]) => [`Share of sales, ${fy}`, r, o, e]),
      ['FY26 base in our build (₹ cr)', n0(BL.base.replacement), n0(BL.base.oem), n0(BL.base.exports)],
      ['Our growth FY27E / FY28E / FY29E', BL.replacementGrowth.map(g => g + '%').join(' / '), BL.oemGrowth.map(g => g + '%').join(' / '), BL.exportsGrowth.map(g => g + '%').join(' / ')],
      { hl: true, cells: ['**Total revenue FY27E / FY28E / FY29E (₹ cr)**', `**${bld.map(r => n0(r.rev)).join(' / ')}**`, '', ''] },
    ], source: 'CARE Ratings (FY24 mix from the 29-Sep-2025 note, FY25-26 from 28-Sep-2026); GAM estimates. The build is checked against model revenue in MRF.ctx.js.' } },
    { callout: '**Why the mix matters:** a rupee of replacement revenue earns more than a rupee of OEM revenue (CARE calls replacement "margin-accretive"; OEM prices catch up with costs only through periodic pass-through, CLSA), so the OEM share rising from 21% to 23% over two years has quietly diluted margins even before rubber. Exports should be MRF\'s growth option but have stalled; Apollo (Europe) and BKT (off-highway) are the Indian names with real global franchises, not MRF.' },
  ],
};

const qs = SQ.filter(q => q.rmPct != null);
const spread = {
  id: 'spread', nav: 'Rubber and the margin', kicker: 'Raw materials', title: 'The margin is a rubber spread: Q1FY27 gross margin fell 566bp in one quarter',
  blocks: [
    { p: `Raw materials were ${qs.at(-2).rmPct}% of standalone revenue in Q4FY26 and ${qs.at(-1).rmPct}% in Q1FY27 (MOSL), a 5.6pp jump in one quarter. Natural rubber, about half of the raw-material bill, rose from ~₹220/kg (FY26 average) to ~₹275/kg in June 2026 (CRISIL) and was still ~₹273/kg on 3-Sep-2026; crude-linked inputs rose with the Middle East conflict. MRF raised prices, but the industry's 7-9% increases cover only part of a 35-40% rise in inputs. The consolidated EBITDA margin fell to ${C.q1fy27.ebitdaMarginPct}% (Q1FY26 ${C.q1fy27.ebitdaMarginPrevPct}%; Q4FY26 16.2%). MRF discloses no rubber hedging and says little beyond "margins are likely to be impacted on account of higher commodity prices and transport costs" (AR FY26 outlook).` },
    { pair: [
      { type: 'line', title: 'Raw material, % of revenue (standalone): 61.7% to 67.3% in one quarter', unit: '% of revenue', x: qs.map(q => q.q), series: [{ name: 'Raw material', values: qs.map(q => q.rmPct), fmt: 'pct' }], labels: 'all', min: 55, max: 70, source: 'MOSL 1QFY27 results update (11-Aug-2026)' },
      { type: 'line', title: 'EBITDA margin by quarter (consolidated)', unit: 'EBITDA margin (%)', x: SQ.map(q => q.q), series: [{ name: 'EBITDA margin', values: SQ.map(q => Math.round(q.ebitda / q.sales * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 8, max: 20, source: 'Screener.in (as reported)' },
    ] },
    { exhibit: { type: 'table', title: 'Margin cycles: how far and how fast', head: ['Period', 'What happened', 'EBITDA margin', 'EPS (₹)'], wide: [1], rows: [
      ['FY21', 'Rubber and crude low; replacement-led recovery after Covid', `${n1(A.ebitdaMargin[4])}%`, n0(A.eps[4])],
      ['FY22-23', 'Rubber, crude and carbon black spike; price increases lag', `${n1(A.ebitdaMargin[5])}% / ${n1(A.ebitdaMargin[6])}%`, `${n0(A.eps[5])} / ${n0(A.eps[6])}`],
      ['FY24', 'Costs ease while prices hold', `${n1(A.ebitdaMargin[7])}%`, n0(A.eps[7])],
      ['FY25-26', 'Rubber rises again (FY25), then GST 2.0 volume and operating leverage', `${n1(A.ebitdaMargin[8])}% / ${n1(A.ebitdaMargin[9])}%`, `${n0(A.eps[8])} / ${n0(A.eps[9])}`],
      { hl: true, cells: ['**FY27E-29E (GAM)**', '**Q1 squeeze, partial recovery as prices catch up**', '**{{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}**', '**{{F.eps.0|num}} / {{F.eps.1|num}} / {{F.eps.2|num}}**'] },
    ], source: 'Screener.in; GAM estimates' } },
    { callout: `**Our assumption:** FY27E margin of {{F.ebitdaMargin.0|pct}} (H1 ~12%, H2 ~13.5% as price increases work through), {{F.ebitdaMargin.1|pct}} in FY28E and {{F.ebitdaMargin.2|pct}} in FY29E, still below MRF's FY17-26 median of 15.0%. That is close to CRISIL's industry path (11.5-12% in FY27, 13-13.5% in FY28) plus MRF's usual premium of ~1.5pp. Each 1pp of margin is ~₹${n0(F.sales[1] * 0.01 * 0.75 / F.shares)} of FY28E EPS (~${Math.round(F.sales[1] * 0.01 * 0.75 / F.pat[1] * 100)}%).` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: the strongest brand and dealer network, but no edge on its biggest cost',
  blocks: [
    { verdicts: D.moat.map(([dim, v, ev]) => [dim, v || '–', ev, { 'Brand and replacement pull': 'Keeps share and lets MRF lead price increases', 'Scale and breadth': 'Scale spreads fixed costs; no category gaps', 'Cost position': 'The spread, not the brand, sets profit', 'Pricing power': 'Margins recover, but one to three quarters late', 'Technology': 'Good enough to win OE fitments; not a source of premium pricing', 'Threats': 'Caps how high margins can go in good years' }[dim] || '']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (AR FY26, CARE Ratings, CRISIL, broker notes to Aug-2026)' },
    { callout: '**Honest verdict:** MRF has a real but narrow moat. Its brand, its 5,000-dealer replacement network and its scale in truck and two-wheeler tyres protect market share (~32% of units, rising). They do not protect margins: MRF buys the same rubber and crude derivatives as Apollo, CEAT and JK, at the same prices, and its EBITDA margin has moved with theirs for a decade. Returns on equity of 10-13% in normal years say the moat is worth share, not super-normal profit.' },
  ],
};

module.exports = { channels, spread, moat };
