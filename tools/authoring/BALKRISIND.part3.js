// BKT report, part 3: the OHT tyre business (volumes, realisation, geography, currency), the new businesses (carbon black,
// on-highway tyres) and the moat.
const X = require('./BALKRISIND.ctx');
const { C, D, SA, SQ, F, BL, bld, n0, n1, pc1, rup, FY26, Q1 } = X;
const vq = SQ.filter(q => q.volumeMt);
const H = C.hedges;

const oht = {
  id: 'oht', nav: 'Off-highway tyres', kicker: 'Core business: OHT', title: 'OHT: volume flat for two years, then a record Q1; price and the euro do the rest',
  blocks: [
    { p: `BKT sold ${n0(SA[0].volumeMt)} MT of OHT tyres in FY24, ${n0(SA[1].volumeMt)} MT in FY25 (+8%) and ${n0(SA[2].volumeMt)} MT in FY26 (+1%). FY26 had two halves: the US duty on Indian goods went to 50% in the middle of Q2 and BKT stopped shipping to the US (Q2 volume ${n0(SQ.find(q => q.q === 'Q2FY26').volumeMt)} MT, −4%), then Europe recovered as dealer stocks cleared and Q4 set a record. Q1FY27 beat it: ${n0(Q1.standalone.volumeMt)} MT (+16%), with India ~40% of volume, Europe stable on a weak base and the US better at a ~10% duty. Revenue per tonne rose ~3% in FY26 (₹${n0(SA[2].revPerTonne / 1000)}k vs ₹${n0(SA[1].revPerTonne / 1000)}k, standalone, before FX) and ~7% in Q1FY27 (₹367k vs ₹342k), on price increases (3-5% by May, ~5% more in Q1) and the euro.` },
    { pair: [
      { type: 'column', title: 'Quarterly volume: the US duty hit Q2FY26; Q1FY27 a record', unit: 'OHT sales volume (tonnes)', x: vq.map(q => q.q), series: [{ name: 'Volume', values: vq.map(q => q.volumeMt), fmt: 'num' }], labels: 'all', source: 'Company calls (Jan-2025 to Jul-2026)' },
      { type: 'line', title: 'Euro realised: ₹94 in Q1FY26, ₹102 in Q1FY27; hedges at ~₹107 for FY27', unit: '₹ per euro realised', x: ['Q1FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27', 'FY27 hedge'], series: [{ name: 'EUR/INR', values: [H.eurRealised.Q1FY26, H.eurRealised.Q3FY26, H.eurRealised.Q4FY26, H.eurRealised.Q1FY27, H.eurInrHedgeRateFY27], fmt: 'n1' }], labels: 'all', min: 85, max: 112, source: 'Calls Jul-2025 to Jul-2026; AR FY26 hedge note (EUR 259 mn sold forward for FY27 at ₹107.16)' },
    ] },
    { exhibit: { type: 'table', title: 'OHT volume mix (% of volume)', head: ['', 'FY26', 'Q1FY27', 'What it means'], wide: [3], rows: [
      ['Agriculture / OTR / others', `${FY26.mix.agriPct} / ${FY26.mix.otrPct} / ${FY26.mix.othersPct}`, 'n.d.', 'Farm tyres are the core; mining (all-steel radials to 57") is the growth push'],
      ['Replacement / OEM', `${FY26.mix.replacementPct} / ${FY26.mix.oemPct}`, 'n.d.', 'Replacement is stickier and pays better'],
      ['Europe', FY26.mix.europePct + '%', Q1.mix.europePct + '%', 'Market share 7-8%'],
      ['Americas', FY26.mix.americasPct + '%', Q1.mix.americasPct + '%', 'US share 3-4%; target 15-16% of revenue'],
      ['India', FY26.mix.indiaPct + '%', Q1.mix.indiaPct + '%', 'Share 18-19%; margin "marginally lower"'],
      ['Rest of world', FY26.mix.rowPct + '%', Q1.mix.rowPct + '%', ''],
    ], source: 'AR FY26 p.25; Q1FY27 presentation p.7 (Q1 geography decoded from the chart; the call confirms India ~40%)' } },
    { p: `**Currency is the biggest swing factor.** About 64% of revenue is exported and BKT sells euros and dollars forward. At Mar-2026 it had sold EUR 259 mn against the rupee for FY27 at ₹${H.eurInrHedgeRateFY27}, EUR 238 mn against the dollar and USD 163 mn against the rupee (plus EUR 73 mn of other contracts). When the rupee falls below the hedged rates, as it did in FY26, the gap shows up as realised losses in revenue (₹${-FY26.standalone.realisedFx} cr) and mark-to-market losses below EBITDA (₹${-FY26.standalone.unrealisedFx} cr), and a ₹575 cr loss on hedges went through other comprehensive income. In FY27 the hedge rate is higher, so the realised loss shrank to ₹${-Q1.standalone.realisedFx} cr in Q1 and unrealised turned into a ₹${Q1.standalone.unrealisedFx} cr gain.` },
    { callout: `**Our view:** we model OHT volume +${BL.ohtVolumeGrowth[0]}% in FY27E (Q1 +16% on a weak base; Q3-Q4 against records), then +${BL.ohtVolumeGrowth[1]}% and +${BL.ohtVolumeGrowth[2]}% as capacity moves towards 425,000 MTPA, and price/mix of +${n1(bld[0].realGrowth)}% in FY27E (price increases and euro hedges, less India mix), then ~3% a year. That is OHT revenue of ₹${n0(bld[0].oht)} cr in FY27E. MOSL and Anand Rathi model 12-13% volume CAGR for FY26-28E; we are a little lower (${n1((Math.pow(bld[1].vol / FY26.standalone.volumeMt, 0.5) - 1) * 100)}%), because the global market grows ~3% and Q1 included a rebound.` },
  ],
};

const newbiz = {
  id: 'newbiz', nav: 'Carbon black & on-highway', kicker: 'New businesses', title: 'Carbon black and on-highway tyres: a third of the 2030 plan, with no track record yet',
  blocks: [
    { p: `**Carbon black.** BKT built carbon black at Bhuj to secure its own supply and power; with phase 2 (Q1FY27, ₹800 cr) capacity is 360,000 MTPA, well above its own needs. Management said ~70% of the new capacity's output is sold outside and ~30% used inside, at "industry average" margins. Third-party sales were ~9% of FY26 revenue (~₹${n0(BL.base.carbonBlack)} cr) and ~10% in Q1FY27. We grow it ${BL.carbonBlackGrowth.join('% / ')}% (₹${n0(bld[2].cb)} cr by FY29E). The plan for 2030 is ~10% of ₹23,000 cr. This is a commodity business, priced off crude-linked feedstock; it helps BKT's costs more than its margin.` },
    { p: `**On-highway tyres.** BKT launched truck and bus radials (Feb/Apr-2026, phase 1 of the CV radial project: ₹750 cr, 800 tyres a day, fungible with OHT), re-launched two-wheeler tyres and plans a passenger-car radial pilot in Q3FY27, all for the Indian replacement market, through ~90 distributors appointed for the purpose. Management calls FY27 "a year of building the portfolio" and FY28 "serious business", and keeps a ₹5,000 cr revenue target for 2030; it will not disclose on-highway revenue yet. We assume ₹${BL.onHighway.map(n0).join(' / ')} cr for FY27-29E (Anand Rathi: ₹600 cr in FY28E at mid-single-digit margins) and start-up losses inside our FY27E margin.` },
    { exhibit: { type: 'table', title: 'The 2030 plan vs our model (₹ crore)', head: ['', 'FY26', 'GAM FY29E', 'Company FY30 target', 'Gap'], rows: [
      ['OHT tyres', n0(BL.base.oht), n0(bld[2].oht), '~16,100 (70%)', `${Math.round(bld[2].oht / 16100 * 100)}% of target a year early`],
      ['Carbon black (third party)', n0(BL.base.carbonBlack), n0(bld[2].cb), '~2,300 (10%)', `${Math.round(bld[2].cb / 2300 * 100)}%`],
      ['On-highway', '~0', n0(bld[2].oh), '~4,600-5,000 (20%)', `${Math.round(bld[2].oh / 5000 * 100)}%`],
      { hl: true, cells: ['**Total**', `**${n0(BL.base.oht + BL.base.carbonBlack)}**`, `**${n0(bld[2].rev)}**`, '**~23,000**', `**${Math.round(bld[2].rev / 23000 * 100)}%**`] },
    ], source: 'Q1FY27 presentation pp.11-18 (shares of the ₹23,000 cr target); GAM estimates' } },
    { callout: '**Our view:** OHT is a niche BKT dominates on cost; Indian on-highway tyres are a scale business where MRF, Apollo, CEAT and JK have brands, dealers and OEM relationships. BKT\'s plan to win through "a great product strategy" and premium positioning is plausible in two-wheelers and premium SUV tyres, but it will take years and dilute margins and returns meanwhile. We give it little value: our FY29E on-highway revenue is a fifth of the 2030 target.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a cost-and-range moat in OHT; none yet in the new businesses',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual reports, presentations and calls to Jul-2026; Screener.in peers)' },
    { callout: '**Honest verdict:** BKT has a genuine but narrow moat: the widest OHT range from a low-cost base, sold mainly in replacement markets where buyers trade down from Michelin and Bridgestone. That has earned an EBITDA margin of 18-31% over a decade. It does not protect against the farm cycle, freight, the rupee or US trade policy, and it does not extend to Indian on-highway tyres or merchant carbon black, where BKT is a newcomer with no cost or brand edge.' },
  ],
};

module.exports = { oht, newbiz, moat };
