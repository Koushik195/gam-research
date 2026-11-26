// Bharat Petroleum report, part 3: downstream (refining + marketing), upstream (BPRL) and projects, moat.
const X = require('./BPCL.ctx');
const { C, SA, EPT, eptAvg, bld, F, FYH, n0, n1, shares } = X;
const PB = X.AS.dsBuild, CALL = C.q1fy27.call, EPI = X.EPI, MULT = X.MULT;
const fy = f => SA.find(a => a.fy === f);

const downstream = {
  id: 'downstream', nav: 'Downstream: refining & marketing', kicker: 'Segment: downstream petroleum', title: 'Downstream: all of the EBITDA, a strong refining arm and a political marketing arm',
  blocks: [
    { p: `The downstream segment refines crude (41.15 MMT in FY26 at 116% of nameplate), moves it through BPCL's pipelines and sells it (${C.business.domesticSalesFY26} MMT in India and 1.54 MMT exported in FY26). Its EBITDA is the sum of a refining margin (GRM: product value less crude cost, US$/bbl), a marketing margin (retail price less the refinery-gate price, taxes and dealer commission, ₹/litre), inventory gains or losses and the gas, petchem and lubricants businesses, less operating costs. BPCL reports GRM every quarter (US$11.74/bbl in FY26) but never the marketing margin; brokers back it out (PL: −₹5.4/litre in Q1FY27 vs +₹5.8 in Q4FY26).` },
    { exhibit: { type: 'table', title: 'Downstream: the cycle in one table', head: ['', ...FYH, 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Segment revenue, net of excise (₹ cr)', ...FYH.map(f => n0(fy(f).dsRev)), ...bld.map(r => n0(r.rev))],
      ['Segment EBITDA (₹ cr)', ...FYH.map(f => n0(fy(f).dsEbitda)), ...bld.map(r => n0(r.ebitda))],
      ['Domestic market sales (MMT)', ...FYH.map(f => n1(fy(f).vol)), ...bld.map(r => n1(r.vol))],
      { hl: true, cells: ['**EBITDA per tonne sold (₹)**', ...FYH.map(f => `**${n0(EPT[f])}**`), ...bld.map(r => `**${n0(r.ept)}**`)] },
      ['Refinery throughput (MMT)', ...FYH.map(f => n1(fy(f).throughput)), ...PB.throughput.map(v => n1(v))],
      ['Reported GRM (US$/bbl)', ...FYH.map(f => n1(fy(f).grm)), '–', '–', '–'],
    ], source: 'AR FY22/FY24/FY26 segment notes; July-2026 presentation (volumes, throughput, GRM); GAM estimates' } },
    { pair: [
      { type: 'column', title: `EBITDA per tonne: FY22-26 average ₹${n0(eptAvg)}; ours ₹3,600 → 5,500`, unit: '₹ per tonne', x: [...FYH, ...F.years], series: [{ name: '₹/t', values: [...FYH.map(f => EPT[f]), ...bld.map(r => r.ept)].map(Math.round), fmt: 'num' }], labels: 'all', lines: [{ v: Math.round(eptAvg), text: 'FY22-26 average' }], source: 'GAM from AR segment notes' },
      { type: 'column', title: 'Volumes: +1.5% in FY27E, +3% a year after', unit: 'Domestic market sales (MMT)', x: [...FYH, ...F.years], series: [{ name: 'MMT', values: [...FYH.map(f => fy(f).vol), ...bld.map(r => r.vol)].map(v => Math.round(v * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'July-2026 presentation; GAM estimates' },
    ] },
    { h: 'Refining: complex, full, and taxed when it booms' },
    { p: `Mumbai (12 MMTPA, Nelson 9.84, 134% utilised in FY26), Kochi (15.5 MMTPA, 11.22, 113%) and Bina (7.8 MMTPA, 11.76, 95%) process 76% high-sulphur crude over an API range of 24-60. Distillate yield was 84.5% in FY26. BPCL's GRM has been above the Singapore benchmark for four years: US$20.2 (FY23), 14.1, 6.8, 11.7 (FY26). In Q1FY27 the war pushed cracks to multi-year highs: GRM US$41.4/bbl before the special export duty and road cess (Bina US$56, Kochi US$39, Mumbai US$34) and US$17.0 after it. The state took most of the windfall, as with the 2022 windfall tax. Spot crude rose to 69% of purchases and Russian crude to ~38% of imports, at premiums of >US$15/bbl over the Indian basket (US$4-5 before the war).` },
    { h: 'Marketing: the most productive network, the least control over price' },
    { p: `BPCL's ${n0(C.business.retailOutlets)} fuel stations sold 139 KL a month each in FY26 (157 KL in Q1FY27), the most of the three PSU marketers; management targets a 32% retail share from ~30%. But in Q1FY27 retail prices lagged crude until the second half of May: the implied gross marketing margin fell to −₹5.4/litre (PL) and LPG under-recovery reached ~₹510/cylinder (₹5,380 cr gross, ₹3,485 cr after ₹1,898 cr of compensation). LPG losses eased to ₹490 in July and ~₹210 expected for August. The negative LPG buffer rose from ₹12,319 cr (Mar-26) to ₹15,804 cr (Jun-26), and the ₹7,594 cr compensation package ends with its October-2026 instalment.` },
    { callout: `**Our forecast:** downstream EBITDA of ₹${n0(bld[0].ebitda)} / ${n0(bld[1].ebitda)} / ${n0(bld[2].ebitda)} cr (₹${PB.ebitdaPerTonne.join(' / ')} per tonne). FY27E assumes Q2-Q4 average ~₹5,700/t after Q1's ~−₹2,800/t: falling LPG losses, retail prices that roughly cover cost, refining margins well above pre-war levels but taxed. FY28-29E sit ~2-3% below the FY22-26 average of ₹${n0(eptAvg)}/t. Each ₹500/t is ~₹${n0(500 * bld[1].vol / 10)} cr of FY28E EBITDA (~₹${n1(500 * bld[1].vol / 10 * 0.74 / shares)} of EPS; ~₹${n0(500 * bld[1].vol / 10 * MULT.base / shares)} a share of value at ${MULT.base}x).` },
  ],
};

const upstream = {
  id: 'upstream', nav: 'Upstream & projects', kicker: 'BPRL and the capex plan', title: 'Upstream and new projects: ₹1.7 lakh cr of bets, none earning yet',
  blocks: [
    { p: `BPRL, the 100% upstream subsidiary, has spent two decades building a portfolio of 15 blocks in six countries. Its segment lost ₹${n0(-fy('FY26').epEbitda)} cr at EBITDA in FY26 and held ₹${n0(EPI.assets)} cr of assets at Mar-26: ₹${n0(EPI.investees)} cr in equity-accounted JVs (Russia's Vankor and Taas fields, Lower Zakum in the UAE) and ~₹${n0(X.epInv)} cr of other assets, mostly Mozambique (₹${n0(EPI.mozambiqueNonCurrentAssets)} cr of non-current assets there; ₹${n0(EPI.suspendedCwip)} cr of capital work 'temporarily suspended' at Mar-26). BPRL's own equity is only ₹${n0(EPI.bprlNetAssets)} cr: the rest is funded mostly by debt, inside group borrowings (group debt excluding leases ₹43,482 cr vs ₹10,480 cr at the standalone company).` },
    { exhibit: { type: 'table', title: 'The big bets (known by 30-Sep-2026)', head: ['Project', 'Size / BPCL share', 'Status', 'What it means'], wide: [2, 3], rows: [
      ['Mozambique LNG Area 1', '10% of a 13 TCF first phase; ~1.3 MMTPA group entitlement', '~42% built; force majeure lifted Nov-2025; project finance agreed; first LNG mid-2028', 'No more equity from BPCL; ~US$350m a year of cash flow at US$65 crude (Motilal Oswal)'],
      ['Brazil BM-SEAL-11 (via IBV)', '40% interest; project ~US$6.4bn, BPCL share US$2.8bn', 'FPSO tender done after ~3 years; first oil FY31, gas FY32; impaired ₹4,300 cr in FY26', '~US$1.2bn more equity over 3-4 years'],
      ['Bina refinery expansion + petchem', '₹49,800 cr; 7.8 → 11 MMTPA + 2.2 MMTPA polymers', '30.7% complete, ₹5,900 cr spent; behind plan (23% vs 32% at Mar-26); commissioning by 2028', 'Petchem 0.83 → ~3.2 MMTPA; margins uncertain'],
      ['Mumbai PRFCC', '~₹14,000 cr; replaces 40-year-old crackers', '7% complete; Sep-2029', 'More propylene, petrol and diesel from residue'],
      ['Kochi polypropylene', '~₹5,000 cr; 400 KTPA', '~40% complete; mechanical completion May-2028', 'Small'],
      ['Andhra Pradesh refinery-petchem', '9 MMTPA; ~₹95,000-97,000 cr (press); ~6,000 acres', 'Pre-project; environmental clearance expected Q2FY27; not sanctioned', 'Would roughly double the capex plan; not in our numbers'],
    ], source: 'Q4FY26 call (20-May-2026); PL and Motilal Oswal Q1FY27 notes (23-Jul-2026); July-2026 presentation pp. 17-19; AR FY26; sahi.com (24-Jul-2026) for the Andhra cost estimate' } },
    { callout: `**How we value it:** BPRL's assets earn nothing today, so we do not put an EBITDA multiple on them. We add the non-JV E&P assets at Mar-26 book (₹${n0(X.epInv)} cr, ₹${n1(X.epInv / shares)} a share) and leave the JVs at book inside net debt, as IOC's Russian upstream is in the IOC report. That is more generous than the street: Motilal Oswal puts Mozambique at 40% below its 2019 transaction value (₹15 a share) and other upstream at ₹6; JM Financial gives upstream nothing. Our bear case cuts the invested value by ${X.EP_BEAR}%.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: better assets than its peers, no pricing power',
  blocks: [
    { verdicts: [
      ['Refining quality', 'Strong', 'Nelson 9.8-11.8, 116% utilisation, 76% high-sulphur crude, GRM above Singapore for four years; Bina US$56/bbl in Q1FY27.', 'Earns more per barrel than IOC or HPCL in most years.'],
      ['Marketing network', 'Strong', '139 KL per outlet per month (FY26), the highest of the PSU three; 11,000+ highway outlets; 27% of PSU sales.', 'Volume and share are safe.'],
      ['Pricing power', 'None', 'Retail prices for petrol, diesel and LPG are set with the Government; FY23 and Q1FY27 show losses are absorbed first.', 'Returns cannot be defended in a spike.'],
      ['Product balance', 'Weak', 'Refines ~41 MMT, sells ~56 MMT: ~20% bought in, so it carries more marketing than refining risk.', 'More exposed than IOC to marketing losses, less than HPCL.'],
      ['Regulatory position', 'Mixed', 'State ownership brings LPG compensation and cheap funding, but also price controls, windfall/export duties and policy capex.', 'A two-way street.'],
    ], head: ['Source', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'July-2026 presentation; calls; GAM' },
    { callout: '**Honest verdict:** BPCL has the best refining and retail assets of the three PSU marketers, and nobody will take its volumes. But a moat that does not let you set prices does not earn steady excess returns: ROE was 22%, 4%, 42%, 17% and 29% in FY22-FY26 (average ~23%), well above the cost of equity on average, but with one year in five close to zero.' },
  ],
};

module.exports = { downstream, upstream, moat };
