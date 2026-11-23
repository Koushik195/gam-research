// M&M report, part 4: automotive, farm equipment, EVs (MEAL) and the group stakes. As of 30-Sep-2026.
const X = require('./M&M.ctx3');
const { n0, n1, n2, F, BUILD, BUILD26, LN, R, SG, SB, sh, DISC, C, TPD, SUBS_NOW, closes } = X;
const A = SG.annual, Q = SG.quarterly, YRS = ['FY26', ...F.years];
const lk = v => n2(v);

const auto = {
  id: 'auto', nav: 'Automotive', kicker: 'Segment', title: 'Automotive: No.1 by SUV revenue, capacity-bound until FY28',
  blocks: [
    { p: 'M&M\'s automotive revenue rose from ₹25,014 cr in FY21 to ₹1,09,355 cr in FY26. Three things did it: a run of hit SUVs (XUV700 in 2021, Scorpio-N in 2022, Thar Roxx in 2024, the XUV 7XO refresh in 2026), price and mix (revenue per vehicle up from ~₹7 lakh to ~₹11 lakh including e-SUVs built for MEAL), and the GST cut. Segment PBIT margin rose from 4.8% in FY23 (AR FY24 comparatives) to 8.4% in FY24 and 9.3% in FY26. Q1FY27 was the first setback: margin 7.1% (8.9% for SUVs and pickups without e-SUVs) after 400-500bp of commodity inflation and an ~85bp hedging loss. Management took 1.5% and then a 2.7% average price increase (mid-July) and calls Q1 the low point.' },
    { pair: [
      { type: 'column', title: 'SUV capacity doubles by FY31', unit: 'Operational capacity, units a month (\'000), ICE + BEV', x: ['FY25 exit', 'FY26 exit', 'Sep-26', 'FY27 exit', 'FY28 exit', 'FY31 exit'], series: [{ name: 'Capacity', values: [59, 64.5, 68, 82, 92, 132], fmt: 'n1' }], labels: 'all', highlight: 'FY31 exit', source: 'Q1FY27 deck slide 37 and call (Nagpur: 20k by H1CY29, +20k ~12 months later)' },
      { type: 'stacked', title: 'Our auto revenue build: e-SUVs grow fastest', unit: 'Automotive revenue (₹ \'000 crore): ICE SUVs, pickups and exports vs e-SUVs for MEAL', x: YRS, series: [{ name: 'ICE SUVs, pickups, exports', values: [BUILD26.ice, ...BUILD.map(b => b.ice)].map(v => Math.round(v / 100) / 10), fmt: 'n1' }, { name: 'e-SUVs for MEAL', values: [BUILD26.esuv, ...BUILD.map(b => b.esuv)].map(v => Math.round(v / 100) / 10), fmt: 'n1' }], minLabel: 5, source: 'Company; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'Automotive build: volume x realisation (company volume basis)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['ICE SUVs, domestic (units)', n0(LN.iceSuv.base), ...LN.iceSuv.units.map(n0)],
      ['Pickups, LCVs <3.5T, trucks & buses, domestic', n0(LN.lcv.base), ...LN.lcv.units.map(n0)],
      ['Exports', n0(LN.exports.base), ...LN.exports.units.map(n0)],
      ['ICE pool realisation (₹ lakh / vehicle)', lk(R.iceLakh.base), ...BUILD.map(b => lk(b.iceReal))],
      ['ICE pool revenue (₹ cr)', n0(BUILD26.ice), ...BUILD.map(b => n0(b.ice))],
      ['e-SUVs built for MEAL (units)', n0(LN.esuv.base), ...LN.esuv.units.map(n0)],
      ['e-SUV contract revenue (₹ cr)', n0(BUILD26.esuv), ...BUILD.map(b => n0(b.esuv))],
      [{ b: 'Automotive revenue (₹ cr)' }, n0(BUILD26.auto), ...BUILD.map(b => n0(b.auto))].map(c => (typeof c === 'object' ? `**${c.b}**` : c)),
      ['Domestic UVs incl. e-SUVs (growth)', `${n0(BUILD26.uvDom)}`, ...BUILD.map((b, i) => `${n0(b.uvDom)} (${((b.uvDom / (i ? BUILD[i - 1].uvDom : BUILD26.uvDom) - 1) * 100).toFixed(0)}%)`)],
    ], source: 'Company releases and AR FY26 (base); GAM estimates. Drivers and reasons in assumptions.json' } },
    { callout: `**Our view:** demand is not the problem: capacity is. We model domestic UVs +16% in FY27 (inside the 68-70k a month M&M can build) and +12% in FY28 as NU_IQ adds a new segment. The risk is margin: e-SUVs, which M&M builds for MEAL at ~0.4% PBIT, rise from ${n0(BUILD26.esuv / BUILD26.auto * 100)}% to ~${n0(BUILD[2].esuv / BUILD[2].auto * 100)}% of automotive revenue by FY29E, which mechanically pulls down the standalone margin even if each business does well.` },
  ],
};

const farm = {
  id: 'farm', nav: 'Farm equipment', kicker: 'Segment', title: 'Farm: the best business in the group, at the top of its cycle',
  blocks: [
    { p: 'M&M has held 40-45% of India\'s tractor market for decades through two brands (Mahindra and Swaraj), with core tractor PBIT margins in a 17-21% band through up- and down-cycles. FY26 was a record: 5.26 lakh tractors (+24%), farm PBIT margin 19.8%. Q1FY27 volumes rose 18% (share 44.9%, down from a record 45.2% a year earlier); core tractor margin held at 19.2% despite steel (+24%) and rubber (+30%) inflation; farm PBIT including the loss-making international businesses was 18.5% standalone and 14.2% consolidated. The weak spots are abroad: Turkey (Erkunt Foundry exited with an impairment), Brazil and the US are in industry downturns, and Sampo (Finland) was sold in 2025.' },
    { pair: [
      { type: 'column', title: 'Tractors: we forecast a flat FY27-28 after two record years', unit: 'Tractors sold, domestic + exports (lakh); FY27-29E = GAM', x: [...A.map(a => a.fy), ...F.years], series: [{ name: 'Tractors', values: [...A.map(a => a.tractors), ...LN.tractors.units], fmt: 'lakh', growth: true }], source: 'Company; GAM estimates' },
      { type: 'column', title: 'Farm PBIT margin near 20%: hard to beat', unit: 'Standalone farm PBIT margin (%)', x: [...A.filter(a => a.farmPbit).map(a => a.fy), ...Q.slice(-3).map(q => q.q)], series: [{ name: 'Farm PBIT %', values: [...A.filter(a => a.farmPbit).map(a => Math.round(a.farmPbit / a.farmRev * 1000) / 10), ...Q.slice(-3).map(q => Math.round(q.farmPbit / q.farmRev * 1000) / 10)], fmt: 'pct' }], labels: 'all', min: 0, max: 26, source: 'AR FY24-FY26; quarterly results' },
    ] },
    { p: `**Our forecast:** tractor volumes +4% in FY27 (April-August was +16%, so September-March is ~−2% against a base that grew 31% after the GST cut) and −2% in FY28, the year an El Nino monsoon usually hits rabi incomes, then +5% in FY29. Realisation +3% a year (a ₹15,000 price increase in August, more 40-50HP tractors, farm machinery). Farm revenue: ₹${n0(BUILD[0].farm)} / ${n0(BUILD[1].farm)} / ${n0(BUILD[2].farm)} cr. Management guided mid-single-digit industry growth for FY27; a repeat of FY26 is not in our numbers.` },
    { callout: '**Why it matters:** farm is ~25% of standalone revenue but ~40% of segment profit (FY26 PBIT ₹7,206 cr vs ₹10,141 cr in auto). A 10% fall in tractor volumes with 2 points lower margin would cut FY28E standalone EPS by ~6%: our bear case takes revenue growth 4 points lower and margins 1.5 points lower across the company.' },
  ],
};

const ev = {
  id: 'ev', nav: 'EVs and MEAL', kicker: 'Segment', title: 'EVs: a profitable leader, owned through a subsidiary investors valued at half the headline',
  blocks: [
    { p: 'M&M\'s electric SUVs (BE 6, XEV 9e and, since late 2025, the XEV 9S) are sold by Mahindra Electric Automobile Ltd (MEAL), on M&M\'s INGLO platform, and built under contract in M&M\'s Chakan plant. MEAL sold 51,820 e-SUVs in FY26 and 19,540 in Q1FY27 (+77%): 12% of M&M\'s SUVs, against 9% for the industry, and No.1 by e-SUV revenue (44%). In Q1FY27 MEAL earned ₹5,430 cr of revenue at a 10.6% EBITDA margin (₹271 cr PBIT); M&M\'s contract manufacturing earned only ~0.4%. Management says MEAL is EBITDA positive even without the PLI subsidy; FY26 PAT was ₹387 cr.' },
    { pair: [
      { type: 'column', title: 'MEAL: headline valuations vs what investors converted at', unit: 'MEAL equity value (₹ crore)', x: ['BII headline (2022)', 'Temasek headline (2023)', 'CCPS conversion (May-2026)', 'M&M investment at cost (Mar-26)'], series: [{ name: 'Value', values: [70070, 80580, 40400, Math.round(SUBS_NOW.meal)], fmt: 'num' }], labels: 'all', highlight: 'CCPS conversion (May-2026)', source: 'Temasek press release (Aug-2023); AR FY26 (BII 4.58% for ₹1,850 cr, Temasek 2.97% for ₹1,200 cr; M&M 92.45%; cost note 8)' },
      { type: 'column', title: 'e-SUV volumes: +77% YoY in Q1FY27', unit: 'e-SUVs sold by MEAL (units)', x: ['Q1FY26', 'Q4FY26', 'Q1FY27', 'FY26', 'FY27E (GAM)'], series: [{ name: 'Units', values: [11027, 16638, 19540, 51820, LN.esuv.units[0]], fmt: 'num' }], labels: 'all', source: 'Q1FY27 press release; GAM estimate' },
    ] },
    { p: `**How we value it.** BII and Temasek invested ₹3,050 cr through convertible shares at headline valuations of ₹70,070 cr and ₹80,580 cr. On 1-May-2026 they converted into 4.58% and 2.97% of MEAL, the top of their ranges, which implies a post-money value of only ~₹40,400 cr: the performance-linked formula did not deliver the headline. M&M has invested ₹6,950 cr and has approved ₹15,925 cr in total. Investors may seek an exit from November 2027 (a listing or a sale). In our base case MEAL is at M&M's cost (₹${n0(SUBS_NOW.meal)} cr), the same basis as our multiple history; at the conversion value it would add ~₹${n0((40400 * 0.9245 - SUBS_NOW.meal) * (1 - DISC.base / 100) / sh)} a share (our bull case).` },
    { callout: '**Brutal honesty:** EVs are M&M\'s best strategic asset but not yet a big profit pool. MEAL\'s ₹387 cr FY26 profit is ~2% of group profit, it relies on PLI support that management expects to taper, and its outside investors converted at half the headline value. The bull case on M&M is not about MEAL alone.' },
  ],
};

const stakes = {
  id: 'stakes', nav: 'Group stakes & capital allocation', kicker: 'Group', title: 'The stakes: ₹' + n0(SB.subsGross / sh) + ' a share gross, mostly Tech Mahindra and M&M Finance',
  blocks: [
    { p: `M&M's listed stakes were worth ₹${n0(SUBS_NOW.lv)} cr at the 30-Sep-2026 closes, ₹${n0(SUBS_NOW.lv / sh)} a share: Tech Mahindra (24.8 cr shares at ₹${n0(closes.TECHM)}) and M&M Finance (73.0 cr shares at ₹${closes['M&MFIN']}) are 78% of it. Group companies paid M&M ₹1,769 cr of dividends in FY26, most of it from these two. GAM rates Tech Mahindra SELL (target ₹1,430) and M&M Finance HOLD (₹330); at those targets the stakes would be worth ~₹${n0((SUBS_NOW.listed[0] * (1430 / closes.TECHM - 1) + SUBS_NOW.listed[1] * (330 / closes['M&MFIN'] - 1)) / sh * -1)} a share less. Unlisted companies are carried at cost (₹${n0(SUBS_NOW.meal + SUBS_NOW.lmm + SUBS_NOW.oth)} cr after ₹7,101 cr of write-downs), and we add ₹${n0(X.NEWINV)} cr for new investment by Sep-27E.` },
    { exhibit: { type: 'table', title: 'Group stakes in our sum of the parts (base case)', head: ['Company', 'How valued', 'Value (₹ cr)', '₹/share', `₹/share after ${DISC.base}%`], wide: [1], rows: X.stakeRows, source: 'AR FY26 note 8; NSE closes 30-Sep-2026; GAM Research' } },
    { h: 'The holding discount: history cannot pin it down, and it barely matters' },
    { p: 'The market price is one number; it cannot tell us both what investors pay for the core business and what discount they apply to the stakes. So we take the street\'s 20% (ICICI Direct uses 20-25%) and derive the core multiple from M&M\'s own history on the same 20%. Because both are on one basis, the target hardly moves with the discount: a bigger discount lowers the stakes but raises the core multiple history implies.' },
    { exhibit: { type: 'table', title: 'Target vs holding discount (core multiple re-derived at each discount)', head: ['Holding discount', 'Core median since Apr-2021', 'Core multiple (x 0.931, nearest 0.5x)', 'Value per share (₹)'], rows: TPD.map(r => [`${r.disc}%`, `${n1(r.med)}x`, `${r.mult}x`, n0(r.tp)]), source: 'GAM Research' } },
    { callout: '**Capital allocation:** since 2021 management has exited loss-makers (SsangYong, Sampo, Erkunt), set an 18% ROE hurdle and paid out ~26% of profit. But the parent keeps funding group companies (₹6,398 cr in FY26; ₹8,975 cr still committed to MEAL) and wrote down ₹1,778 cr of them in FY24-26. We treat that money as worth its cost, no more.' },
  ],
};

module.exports = { auto, farm, ev, stakes };
