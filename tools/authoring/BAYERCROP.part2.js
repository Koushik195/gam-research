// Bayer CropScience report, part B (2 of 4): story in charts, business, history, industry, tailwind test.
const S = require('./BAYERCROP.research');
const { C, D, SA, MIX, A, A21, A25, n0, n1, pc, price, cornCagr, cpCagr, RP, PEERS, fwdPe, H21, shortName, V, SRC, ASOF_TXT, cashNow, TX } = S;
const pePeers = PEERS.filter(p => p.pe).sort((a, c) => c.pe - a.pe);
const ST = D.street.brokers;
const kotak = ST.find(s => s.broker === 'Kotak Institutional Equities'), hsbc = ST.find(s => s.broker === 'HSBC');
const rup = s => String(s).replace(/Rs /g, '₹');
const yrs = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], ai = y => A.labels.indexOf(y);

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Crop protection is most of revenue; corn seed is the growing part', unit: 'Revenue by business line (₹ crore)', x: MIX.map(a => a.fy), series: [{ name: 'Crop protection ex-Roundup', values: MIX.map(a => a.cpExRoundup), fmt: 'num' }, { name: 'Corn seed (DEKALB)', values: MIX.map(a => a.cornSeeds), fmt: 'num' }, { name: 'Others (Roundup, exports, traded seed)', values: MIX.map(a => a.others), fmt: 'num' }], minLabel: 400, source: 'Investor meet presentation (Nov-2025)' },
      { type: 'column', title: 'Corn seed: from 12% to ~19% of revenue', unit: 'Corn seed as % of revenue', x: SA.map(a => a.fy), series: [{ name: 'Corn share', values: SA.map(a => a.cornSharePct), fmt: 'pct0' }], labels: 'all', source: 'Investor meet (FY21-25); FY26 annual report BRSR (rounded)' },
    ] },
    { pair: [
      { type: 'line', title: 'Quarterly EBITDA margin: the FY25 collapse and the recovery', unit: 'EBITDA margin (%)', x: 'Q.labels', series: [{ name: 'EBITDA margin', ref: 'Q.opm', fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in (standalone)' },
      { type: 'column', title: 'Purchases from Bayer AG fell 45% in FY26 as margins rose', unit: 'Purchases from Bayer AG (₹ crore)', x: ['FY25', 'FY26'], series: [{ name: 'Purchases', values: [RP.purchasesFromBayerAGFY25, RP.purchasesFromBayerAG], fmt: 'num' }], labels: 'all', source: 'Annual report FY26 (related-party note 42)' },
    ] },
    { pair: [
      { type: 'column', title: 'Almost every rupee of profit is paid out', unit: '₹ per share', x: yrs, series: [{ name: 'EPS', values: yrs.map(y => A.eps[ai(y)]), fmt: 'n1' }, { name: 'Dividend', values: SA.map(a => a.dps), fmt: 'n1' }], labels: 'none', source: 'Screener.in; company (dividend declared for each year)' },
      { type: 'hbar', title: 'Valued below Sumitomo and PI, above Indian generic makers', unit: `Trailing P/E (x), ${ASOF_TXT}`, x: pePeers.map(p => shortName(p.name)), series: [{ name: 'P/E', values: pePeers.map(p => p.pe), fmt: 'x' }], labels: 'all', highlight: 'Bayer CropScience', source: 'Screener.in (at the NSE close; Bayer, Dhanuka, Rallis standalone)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: from ~${Math.round(H21.max)}x (2024) to ~${Math.round(fwdPe.at(-1)[1])}x`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: Math.round(H21.med * 10) / 10, text: `Median since 2021: ${n1(H21.med)}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the two street targets we found', unit: `₹ per share; CMP ₹${n0(price)}`, x: ['HSBC (Nov-25)', 'Kotak (Aug-26)', 'GAM (base)'], series: [{ name: 'Target', values: [hsbc.tp, kotak.tp, V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes as reported (Whalesbook, Investing.com), GAM Research' },
    ] },
  ],
};

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'Bayer\'s Indian arm: crop protection, DEKALB corn seed, and an agent for the group',
  blocks: [
    { p: `Bayer CropScience Ltd (BCSL) sells Bayer's crop-protection products and corn seed to Indian farmers through ~3,500 distributors and their retailers. **Crop protection** (insecticides, fungicides, herbicides, seed treatment, biologicals) is about three-quarters of turnover: many products are formulated at Himatnagar (Gujarat) from technical-grade ingredients bought from Bayer AG and group companies; others are bought finished. **Corn seed** (DEKALB and Xellano hybrids, from the Monsanto India merger of 2019) is ~19%: BCSL breeds hybrids at its own R&D centre and pays contract farmers to grow seed. The rest is Roundup (glyphosate), exports (₹${n0(C.profile.geographyFY26.Germany + C.profile.geographyFY26.Bangladesh + C.profile.geographyFY26.Others)} cr in FY26, mostly to group companies in Germany and Bangladesh), traded rice seed, and group seed products sold as an agent.` },
    { exhibit: { type: 'table', title: 'Where revenue comes from', head: ['Line', 'FY21 (₹ cr)', 'FY25 (₹ cr)', 'Growth a year', 'FY26 share', 'What it is'], wide: [5], rows: [
      ['**Crop protection ex-Roundup**', n0(A21.cpExRoundup), n0(A25.cpExRoundup), pc(cpCagr), '76% (incl. Roundup)', 'Insecticides (Bicota, Camalus), herbicides (Council Activ, Laudis), fungicides (Nativo), biologicals; rice, vegetables, cotton, wheat'],
      ['**Corn seed**', n0(A21.cornSeeds), n0(A25.cornSeeds), pc(cornCagr), '19%', 'DEKALB/Xellano hybrids for kharif, rabi and spring corn; feed, starch, ethanol and silage demand'],
      ['**Others**', n0(A21.others), n0(A25.others), pc(S.cagr(A21.others, A25.others, 4)), '5%', 'Roundup glyphosate, exports to group companies, traded rice seed, agency sales'],
      { hl: true, cells: ['**Revenue from operations**', n0(A21.consRev), n0(A25.consRev), pc(S.cagr(A21.consRev, A25.consRev, 4)), '₹5,675 cr', 'After ₹900 cr of discounts and ₹123 cr of expected returns in FY26'] },
    ], source: 'Investor meet presentation (Nov-2025); annual report FY26 (BRSR, note 24)' } },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Customers', rup(C.profile.distribution)],
      ['Plants', rup(C.profile.plants)],
      ['R&D', rup(C.profile.rnd)],
      ['People', C.profile.people],
      ['Digital and partners', 'FarmRise and FarmRise One apps, Alivio weather-assurance pilot, ~50 Bayer Learning Centers, DirectAcres direct-seeded rice programme (~16,000 farmers)'],
    ], source: 'Annual report FY26; investor meet Nov-2025' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a 1958 Bayer unit to Bayer\'s and Monsanto\'s combined Indian arm',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history.map(h => [h.when, rup(h.event)]), source: C.historySrc } },
    { callout: `**Corporate actions:** buybacks in FY16-FY18 cut the share count; the Monsanto India merger (2019) raised it to 4.49 cr shares, unchanged since. No bonus or split. Since FY21 the company has paid out 77-105% of profit as dividends (₹115-150 a share), so the balance sheet does not grow: cash was ₹${n0(cashNow)} cr at Mar-2026 against ₹${n0(A.cashAndInvestments[A.labels.indexOf('FY21')])} cr at Mar-2021.` },
  ],
};

const IND = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A ₹31,000 cr crop-protection market growing 5-6%, and a corn market set to double',
  blocks: [
    { p: `India's crop-protection market was ~₹${n0(IND.domesticCropProtection.sizeFY25Cr)} cr in FY25 and CRISIL expects 5-6% a year to FY28. Use per hectare is low (~0.6 kg vs ~3 kg in the US), but demand in any year depends on the monsoon, pests and crop prices, and Chinese generics set prices for most old molecules. Global innovators (Bayer, Syngenta, BASF, Corteva, FMC, Sumitomo) compete with Indian companies (UPL, PI, Coromandel, Rallis, Dhanuka) and hundreds of generic formulators. Corn is different: India grows ~37 MMT on 11-12 m ha at 3.7 t/ha (world 5.8), and demand from poultry feed, starch and ethanol is expected to reach ~70 MMT by 2030. More corn means more hybrid seed, and better hybrids are the main way to lift yields because there is little new land.` },
    { pair: [
      { type: 'stacked', title: 'Corn demand: 26 MMT (FY21) to ~73 MMT (FY30E)', unit: 'Corn demand by use (million tonnes)', x: ['FY21', 'FY25', 'FY30E'], series: [{ name: 'Feed', values: [17.8, 27.7, 43.8], fmt: 'n1' }, { name: 'Ethanol', values: [0.6, 7.6, 16.5], fmt: 'n1' }, { name: 'Food, starch and other', values: [7.3, 8.8, 12.6], fmt: 'n1' }], minLabel: 3, source: 'Bayer CropScience investor meet (Nov-2025), company chart reading' },
      { type: 'column', title: '2026 monsoon: June was 35% short; the season ended 12.6% below normal', unit: 'Rainfall, % of long-period average', x: ['June', 'July', 'August', 'September', 'Season'], series: [{ name: 'Rain', values: [IND.monsoon2026.june, IND.monsoon2026.july, IND.monsoon2026.august, IND.monsoon2026.september, IND.monsoon2026.pctOfLpa], fmt: 'pct0' }], labels: 'all', min: 0, max: 110, source: 'IMD end-of-season statement (30-Sep-2026)' },
    ] },
    { exhibit: { type: 'table', title: 'Forces acting on the industry (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Bayer CropScience'], wide: [2], rows: [
      ['2026 monsoon (deficient, weakest since 2015)', 'Headwind', 'Kharif area −1.5% (rice −4%, maize ~−4% at 21-Aug, still above normal); East/North-East and the South driest; fewer sprays.'],
      ['El Niño to Feb-2027; southern reservoirs ~33% below normal', 'Headwind', 'Rabi corn seed (Andhra Pradesh, Telangana, Karnataka, Bihar) and wheat herbicides at risk.'],
      ['Chinese generic prices', 'Headwind', 'Peers call pricing weakness "structural"; Bayer\'s FY25 margin fell when it could not raise prices.'],
      ['Channel inventory', 'Neutral', 'Peers (Rallis, 360 ONE) say dealer stocks were largely back to normal by Jul-Sep 2026.'],
      ['Corn demand (feed, ethanol)', 'Tailwind', 'Demand set to double by 2030; Bayer is the leading hybrid breeder.'],
      ['Paraquat ban (final 22-Sep-2026)', 'Tailwind', 'Removes a rival weedkiller to Roundup.'],
      ['Glyphosate restriction (Delhi High Court)', 'Risk', 'Would limit use to licensed pest-control operators if upheld.'],
      ['GM corn and US corn imports', 'Two-way', 'GM approval would open trait sales for Bayer; duty-free US corn imports would cut local demand.'],
    ], source: 'IMD, CWC, agriculture ministry data via press, peer calls (SUMICHEM fact base), investor meet Nov-2025' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: corn reaches Bayer; crop-protection growth mostly does not',
  blocks: [
    { verdicts: [
      ['Rising corn demand (feed, ethanol)', 'Yes', `Corn seed ~${Math.round(cornCagr)}% a year FY21-25; ~19% of FY26 turnover; new hybrids for Karnataka and the South-West; corn held up in Q1FY27 despite lower acreage.`, 'The strongest driver in the company.'],
      ['Indian crop-protection growth (5-6%)', 'Partly', `Crop protection ex-Roundup ~${Math.round(cpCagr)}% a year FY21-25, about the market; older products are being divested.`, 'Keeps pace, no share gain.'],
      ['Herbicides and labour shortage (direct-seeded rice)', 'Partly', 'Council Activ is a top-2/3 product; Etciostar launched for direct-seeded rice; DirectAcres on ~1.1 lakh acres.', 'A real niche, still small.'],
      ['India as a sourcing hub ("make in India")', 'Not yet', 'Management "would love to come more to a 50-50" India/Asia sourcing; half of purchases still from group companies.', 'The biggest margin lever, under the parent\'s control.'],
      ['Biologicals', 'Partly', 'Spintor (biological insecticide) launched; no disclosed revenue.', 'Too small to judge.'],
      ['GM traits and short-stature corn', 'No (policy)', 'Not approved in India; Preceon short corn "subject to regulatory approval".', 'An option, not in our numbers.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { narrative, business, history, industry, tailwind };
