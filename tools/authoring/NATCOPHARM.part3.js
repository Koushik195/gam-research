// Natco Pharma report, part 3: the gRevlimid windfall and cliff; the US pipeline after the cliff.
const X = require('./NATCOPHARM.ctx2');
const { C, SA, SQ, QL, A, F, BL, FY26, Q1, n0, n1, ix } = X;
const BASE_M = 25; // base-business EBITDA margin used to size the windfall (Q1FY27: 25.3% with negligible lenalidomide)
const WY = ['FY23', 'FY24', 'FY25', 'FY26'];
const wind = WY.map(fy => { const s = SA.find(a => a.fy === fy), i = ix(fy), sales = A.sales[i], len = s.lenalidomideEst, base = (sales - len) * BASE_M / 100;
  return { fy, us: C.grevlimid.usRevenue[fy], exports: s.exports, len, sales, ebitda: A.ebitda[i], margin: A.ebitdaMargin[i], base, windfall: A.ebitda[i] - base, eps: A.eps[i] }; });
const windSum = wind.reduce((s, r) => s + r.windfall, 0), lenSum = wind.reduce((s, r) => s + r.len, 0);
const R_D = { FY22: [195.0, 12.8], FY23: [226.7, 9.1], FY24: [269.4, 7.5], FY25: [373.3, 8.3], FY26: [407.7, 10.5] };

const windfall = {
  id: 'grevlimid', nav: 'The gRevlimid windfall', kicker: 'The windfall and the cliff', title: `gRevlimid: ~₹${n0(lenSum)} cr of revenue and ~₹${n0(Math.round(windSum / 100) * 100)} cr of extra EBITDA in four years, and now almost nothing`,
  blocks: [
    { p: `${C.grevlimid.text}` },
    { p: 'Natco does not disclose lenalidomide sales, so we estimate them. Two quarters tell us what the business looks like without the product: Q3FY25 (export formulations ₹286 cr) and Q3FY26 (₹421 cr, "0 Revlimid"). Everything above that run-rate in a year is, roughly, lenalidomide. The US revenue the annual reports disclose moves the same way: ₹1,606 cr (FY23), ₹2,805 cr (FY24), ₹3,149 cr (FY25), ₹2,381 cr (FY26).' },
    { exhibit: { type: 'table', title: 'The windfall by year (₹ crore; lenalidomide and windfall EBITDA are GAM estimates)', head: ['', ...WY, 'FY27E'], rows: [
      ['US revenue (AR)', ...wind.map(r => n0(r.us)), '–'],
      ['Export formulations', ...wind.map(r => n0(r.exports)), n0(BL.us[0] + BL.brazil[0] + BL.canada[0] + BL.row[0])],
      ['Lenalidomide revenue (est.)', ...wind.map(r => n0(r.len)), '~0'],
      ['Revenue from operations', ...wind.map(r => n0(r.sales)), n0(F.sales[0])],
      ['EBITDA (Screener basis)', ...wind.map(r => n0(r.ebitda)), n0(F.ebitda[0])],
      ['EBITDA margin', ...wind.map(r => `${n1(r.margin)}%`), `${n1(F.ebitdaMargin[0])}%`],
      [`EBITDA the rest would earn at ${BASE_M}%`, ...wind.map(r => n0(r.base)), '–'],
      { hl: true, cells: ['**Windfall EBITDA (est.)**', ...wind.map(r => `**${n0(r.windfall)}**`), '**~0**'] },
      ['EPS (₹)', ...wind.map(r => n1(r.eps)), n1(F.eps[0])],
    ], source: `AR FY24-FY26 MD&A (US revenue), AR FY24 and Q1FY27 presentation (segments), Screener.in; GAM estimates. Windfall EBITDA = reported EBITDA less ${BASE_M}% (the Q1FY27 margin) on revenue excluding lenalidomide.` } },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: the quota pattern, then the cliff', unit: 'Revenue from operations (₹ crore a quarter)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in quarterly results (to Q1FY27)' },
      { type: 'column', title: 'Windfall EBITDA (est.): peaked at ~₹1,700 cr in FY25', unit: '₹ crore (GAM estimate)', x: WY, series: [{ name: 'Windfall EBITDA', values: wind.map(r => Math.round(r.windfall)), fmt: 'num' }], labels: 'all', source: 'GAM estimates (table above)' },
    ] },
    { h: 'What is left of lenalidomide' },
    { bullets: [
      '**US:** from Feb-2026 any generic can sell without volume limits; the CFO called Q1FY27 lenalidomide "very, very small... negligible". We forecast nothing.',
      '**Price protection:** Natco carried a ₹494.5 cr refund liability at Mar-26 (₹16.8 cr a year earlier) for price protection and returns: channel inventory repriced after the price collapse. It reduces FY27 cash, not FY27 profit (already provided in FY26).',
      '**Canada:** Natco still has the highest market share for lenalidomide in Canada; a small market, and in our base.',
      '**Patents:** the Revlimid patents expire in Apr-2027, after which nothing special remains.',
    ] },
    { callout: `**So what:** at its peak gRevlimid contributed roughly three-quarters of Natco's EBITDA (FY25: ~₹${n0(wind[2].windfall)} cr of ₹${n0(wind[2].ebitda)} cr). The FY23-FY26 earnings, and the P/E history built on them, describe a different company from the one investors own today.` },
  ],
};

const us = {
  id: 'us-pipeline', nav: 'US pipeline after the cliff', kicker: 'US generics', title: 'After the cliff: carfilzomib and two unnamed FY28 exclusivities; olaparib and semaglutide are further out and uncertain',
  blocks: [
    { p: `Natco's US business earned ₹${n0(FY26.segments.us)} cr in FY26, most of it lenalidomide. In Q1FY27 export formulations were ₹${n0(Q1.exports)} cr; after Brazil (₹178 cr) and Canada (₹56 cr) that leaves ~₹243 cr a quarter for the US and other markets. The pipeline is the reason to own the stock, so we set out what management has said, molecule by molecule, as of ${X.ASOF_TXT}.` },
    { exhibit: { type: 'table', title: 'Key US molecules and their status (30-Sep-2026)', head: ['Molecule (brand)', 'Status', 'Source'], wide: [1], rows: C.pipeline.map(r => [r.molecule, r.status, { q1tx: 'Q1FY27 call', q4tx: 'Q4FY26 call', q3tx: 'Q3FY26 call', q1ppt: 'Q1FY27 presentation' }[r.src] || r.src]), source: 'Company calls (12-Feb, 29-May and 14-Aug-2026) and Q1FY27 investor presentation. FTF = first to file; TA = tentative approval.' } },
    { p: `**What we put in the numbers.** US revenue of ₹${n0(BL.us[0])} cr in FY27E (Q1 run-rate plus a modest second-half lift from new approvals now that the Kothur warning letter is closed), ₹${n0(BL.us[1])} cr in FY28E (the two exclusivity launches management guides for FY28; we assume ~₹200 cr in their first year, below what a sole first-to-file can earn) and ₹${n0(BL.us[2])} cr in FY29E. We put nothing in for olaparib (still in court; exclusivity may be lost because approval took over 30 months) or US semaglutide (no approval yet, the Ozempic settlement date is confidential and Wegovy is not settled). These are upside options, not base case.` },
    { exhibit: { type: 'table', title: 'R&D: spending stayed high through the windfall', head: ['', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], rows: [
      ['R&D spend (₹ crore)', ...Object.values(R_D).map(r => n0(r[0]))],
      ['% of standalone revenue', ...Object.values(R_D).map(r => `${n1(r[1])}%`)],
    ], source: 'Q1FY27 investor presentation (R&D spend); AR FY26 (₹4,086 mn) and AR FY25 (₹3,733 mn). FY27 guidance: 7-9% of sales; 70-80% of R&D money targets launches in 2028-2035 (CEO, 14-Aug-2026).' } },
    { callout: '**Honest assessment:** Natco\'s filing machine is slowing in the way that matters: 7-8 US filings in FY26 with "no major first to files", and a target of 2-3 FTFs a year that it has not hit recently. The FY28 launches are real (management has repeated them on two calls) but unnamed, so neither we nor the street can size them with confidence. Treat FY28-29E earnings as more uncertain than the steady line in our model suggests.' },
  ],
};

module.exports = { windfall, us, wind, windSum, lenSum };
