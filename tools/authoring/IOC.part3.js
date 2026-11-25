// Indian Oil report, part 3: petroleum products (refining + marketing + pipelines), petrochemicals / gas / other, moat.
const X = require('./IOC.ctx');
const { C, SG, SA, EPT, eptAvg, bld, F, n0, n1 } = X;
const fyH = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], Q = C.q1fy27.call, PB = X.AS.petBuild;

const petroleum = {
  id: 'petroleum', nav: 'Petroleum products', kicker: 'Segment: petroleum products', title: 'Petroleum products: 95% of EBITDA, two margin pools, one of them political',
  blocks: [
    { p: `The petroleum segment refines crude (IOC standalone ${C.business.volumesFY26.throughput} MMT in FY26 at 107% utilisation, plus CPCL ~10 MMT), carries it through IOC's pipelines (${C.business.volumesFY26.pipelineThroughput} MMT in FY26) and sells it (${C.business.volumesFY26.petDomestic} MMT in India, ${C.business.volumesFY26.exports} MMT exported). Its EBITDA is the sum of a refining margin (GRM: product value less crude cost, US$/bbl), a marketing margin (retail price less the refinery-gate price, taxes and dealer commission, ₹/litre), pipeline tariffs and inventory gains or losses, less operating costs. IOC disclosed GRM until Q3FY26 (US$12.05/bbl in FY24, US$4.80 in FY25) and has paused it "while volatility lasts"; it has never disclosed the marketing margin.` },
    { exhibit: { type: 'table', title: 'Petroleum products: the cycle in one table', head: ['', ...fyH, 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Segment revenue, net of excise (₹ cr)', ...fyH.map(f => n0(SA.find(a => a.fy === f).petRev)), ...bld.map(r => n0(r.rev))],
      ['Segment EBITDA (₹ cr)', ...fyH.map(f => n0(SA.find(a => a.fy === f).petEbitda)), ...bld.map(r => n0(r.ebitda))],
      ['Petroleum sales incl. exports (MMT)', '–', ...fyH.slice(1).map(f => n1(SA.find(a => a.fy === f).petVol)), ...bld.map(r => n1(r.vol))],
      { hl: true, cells: ['**EBITDA per tonne sold (₹)**', '–', ...fyH.slice(1).map(f => `**${n0(EPT[f])}**`), ...bld.map(r => `**${n0(r.ept)}**`)] },
      ['Standalone throughput (MMT)', '–', '67.7', '72.4', '73.3', '71.6', '75.5', ...PB.throughput.map(String)],
      ['Reported GRM (US$/bbl)', '–', '–', '–', '12.05', '4.80', 'n.d.', '–', '–', '–'],
    ], source: 'AR FY22/FY24/FY26 segment notes and five-year summary; Q4FY25 call (GRMs); Q1FY27 call (throughput guidance); GAM estimates' } },
    { pair: [
      { type: 'column', title: `EBITDA per tonne: FY22-26 average ₹${n0(eptAvg)}; ours ₹3,800 → 5,900`, unit: '₹ per tonne', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: '₹/t', values: [...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => EPT[f]), ...bld.map(r => r.ept)].map(Math.round), fmt: 'num' }], labels: 'all', lines: [{ v: Math.round(eptAvg), text: 'FY22-26 average' }], source: 'GAM from AR segment notes' },
      { type: 'column', title: 'Volumes: +1.5% in FY27E, then the expansions', unit: 'Petroleum sales incl. exports (MMT)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'MMT', values: [...['FY23', 'FY24', 'FY25', 'FY26'].map(f => SA.find(a => a.fy === f).petVol), ...bld.map(r => r.vol)].map(v => Math.round(v * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'AR FY26; GAM estimates' },
    ] },
    { h: 'Refining: bigger, more complex, and taxed when it booms' },
    { p: `Three expansions add ~17 MMTPA (+21%) to IOC's refining: Panipat 15→25 MMTPA (₹38,231 cr, 94% complete), Gujarat 13.7→18 (₹18,936 cr, 89%) and Barauni 6→9 (₹18,113 cr, 92%), all due Nov-Dec 2026, with a 60% / 80% / 100% ramp-up over three years. Management guides throughput of ${PB.throughput.join(' / ')} MMT for FY27-29 and expects higher distillate yields (79-80% now) and lower fuel & loss (8.0% in Q1FY27, the lowest since BS-VI). The 2026 war pushed product cracks very high: Q1FY27 GRM was US$36/bbl before the special export duty and US$15.59 after it (crude inventory loss US$3-4/bbl). The state took most of the windfall through the export duty, as it did with the 2022 windfall tax.` },
    { h: 'Marketing: volumes grow, margins are decided elsewhere' },
    { p: `IOC sells ~42% of India's petroleum products through 43,138 fuel stations (Jun-2026) and ~46% of its LPG. Volumes grew 4.7% in FY26, ahead of the market. But in Q1FY27 retail prices were held while the crude basket averaged US$100.74/bbl: LPG under-recovery reached ₹670/cylinder in May and ₹665 in June, then ~₹475 in July; petrol and diesel lost money until price rises in tranches from May (the SAED cut of ₹10/litre on 27-Mar helped). The quarter's EBITDA (₹4,062 cr consolidated) was only positive because of a ~₹15,000 cr gain on finished-goods inventory. IOC expects LPG losses to fall to ~₹250/cylinder in Q2 and is "confident" of compensation, but the timing and amount are the Government's call: the negative LPG buffer stood at ₹29,730 cr at Jun-2026.` },
    { callout: `**Our forecast:** petroleum EBITDA of ₹${n0(bld[0].ebitda)} / ${n0(bld[1].ebitda)} / ${n0(bld[2].ebitda)} cr (₹${PB.ebitdaPerTonne.join(' / ')} per tonne). FY27E assumes Q2-Q4 average ~₹4,800/t after Q1's ~₹850/t: falling LPG losses, retail prices that roughly cover cost, refining margins well above pre-war levels but taxed. FY28-29E sit ~6% below the FY22-26 average of ₹${n0(eptAvg)}/t. Each ₹500/t is ~₹${n0(500 * bld[1].vol / 10)} cr of FY28E EBITDA (~₹${n0(500 * bld[1].vol / 10 * 0.725 / X.shares)} of EPS).` },
  ],
};

const other = {
  id: 'other', nav: 'Petrochemicals, gas & other', kicker: 'Segments: petrochemicals, gas, other', title: 'Petrochemicals and gas: 5% of EBITDA today, where the next ₹1 lakh cr goes',
  blocks: [
    { p: `Petrochemicals (polymers, PX, PTA, LAB, glycols) earned segment EBITDA of ₹${n0(SA.find(a => a.fy === 'FY21').pcEbitda)} cr in FY21 and ₹${n0(SA.find(a => a.fy === 'FY22').pcEbitda)} cr in FY22, then ₹716-949 cr a year in FY23-FY25 (2-3% margins) as Chinese capacity flooded the market, and ₹${n0(SA.find(a => a.fy === 'FY26').pcEbitda)} cr in FY26 (Q4 EBIT ₹1,209 cr, the best ever). Q1FY27 EBIT was ₹217 cr on 0.77 MMT. The ₹13,805 cr PX-PTA complex at Paradip (95% complete) and the ₹2,949 cr polybutadiene rubber plant at Panipat start in FY27; another ~₹1 lakh cr of petchem projects (petchem intensity 6.5% → 15%) is planned to FY30. We forecast EBITDA of ₹2,800 / 4,500 / 5,200 cr.` },
    { p: `Gas (LNG and natural gas trading, city gas) and other businesses (E&P, explosives, cryogenics, wind and solar) earned ₹${n0(SA.find(a => a.fy === 'FY25').goEbitda)} cr in FY25 and ₹${n0(SA.find(a => a.fy === 'FY26').goEbitda)} cr in FY26 (gas alone only ₹130 cr). Q1FY27 was unusually strong (EBIT: gas ₹526 cr, other ₹625 cr). We forecast ₹3,600 / 3,000 / 3,200 cr. The bigger long-term bets sit in joint ventures and are in our valuation at book: IndianOil LNG (Ennore terminal), IndianOil-Adani Gas, Hindustan Urvarak (fertiliser), Terra Clean (renewables, 2.65 GW of grid connectivity) and the Russian and Abu Dhabi upstream stakes.` },
    { pair: [
      { type: 'column', title: 'Petrochemicals EBITDA: ₹6,100 cr (FY21) to ₹700 cr (FY23)', unit: 'Segment EBITDA (₹ crore)', x: [...fyH, ...F.years], series: [{ name: 'Petrochemicals', values: [...fyH.map(f => SA.find(a => a.fy === f).pcEbitda), ...F.seg.pc.adjEbitda].map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR segment notes; GAM estimates' },
      { type: 'column', title: 'Gas & other EBITDA', unit: 'Segment EBITDA (₹ crore)', x: [...fyH, ...F.years], series: [{ name: 'Gas & other', values: [...fyH.map(f => SA.find(a => a.fy === f).goEbitda), ...F.seg.go.adjEbitda].map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR segment notes; GAM estimates' },
    ] },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real scale advantages, no pricing power; the moat protects volumes, not returns',
  blocks: [
    { verdicts: [
      ['Scale and integration', 'Strong', '~31% of India\'s refining, the largest pipeline network, 43,000+ fuel stations, 54% of jet fuel.', 'Lowest-cost logistics in the country.'],
      ['Pricing power', 'None', 'Retail prices for petrol, diesel and LPG are set with the Government; FY23 and Q1FY27 show losses are absorbed first.', 'Returns cannot be defended in a spike.'],
      ['Refining quality', 'Moderate', 'Distillate yield ~79-80%, fuel & loss 8%; older, smaller refineries than Jamnagar; expansions add complexity.', 'GRMs historically below the best private refiner.'],
      ['Customer captivity', 'Weak-moderate', 'Fuel is a commodity; brand (Servo, XTRAPREMIUM) helps only in lubricants and premium fuels.', 'Share held by network density.'],
      ['Regulatory position', 'Mixed', 'State ownership brings LPG compensation and cheap funding, but also price controls, windfall taxes and policy capex.', 'A two-way street.'],
    ], head: ['Source', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'AR FY26; calls; GAM' },
    { callout: '**Honest verdict:** IOC has the strongest physical franchise in Indian oil, and nobody will take its volumes. But a moat that does not let you set prices does not earn excess returns through the cycle: ROE averaged ~18% in FY22-FY26 (standalone 22.6%, 7.1%, 29.8%, 8.7%, 22.7%), close to the cost of equity once the trough years are weighted honestly.' },
  ],
};

module.exports = { petroleum, other, moat };
