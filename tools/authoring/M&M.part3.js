// M&M report, part 3: industry and the tailwind test. As of 30-Sep-2026 (monthly data to Aug-2026; September
// volumes were released on 1-Oct-2026 and are not used).
const X = require('./M&M.ctx3');
const { n0, n1, D, C } = X;
const I = D.industry, MO = I.monsoon2026, Y = C.monthly.fy27ytdAug;
const uvShareYtd = Y.uvDomestic / I.pv.aprAug26Uv * 100;

const industry = {
  id: 'industry', nav: 'Industry tailwinds', kicker: 'Industry', title: 'Three markets, three cycles: SUVs booming, tractors peaking, pickups steady',
  blocks: [
    { p: `**SUVs.** India sold ${n0(I.pv.fy26)} passenger vehicles in FY26 (+${I.pv.fy26Growth}%), of which ${n0(I.pv.uvFy26)} were utility vehicles (+${I.pv.uvGrowth}%): two out of three. M&M's share of UVs rose from 17.2% (FY24) to 19.7% (FY25) and ${C.industryFY26.mmUvShare}% (FY26). The GST reset of 22-Sep-2025 cut the tax on large SUVs from 28% plus 22% cess to a flat 40% and M&M cut prices by ₹81,000-1.56 lakh. April-August 2026 UV sales rose ${I.pv.aprAug26UvGrowth}% to ${n0(I.pv.aprAug26Uv)}, but against a weak base: buyers held back in August-September 2025 waiting for the tax cut. M&M's UVs rose ${Y.uvYoY}% in the same months (~${n1(uvShareYtd)}% of industry UVs), capped by capacity. Forecasters (CRISIL in May-2026: +5-7% for FY27) expect much slower growth once the base normalises.` },
    { p: `**Tractors.** The industry sold ${n0(I.tractors.fy26)} tractors in FY26 (+${I.tractors.fy26Growth}%): +${I.tractors.growthAprAug25}% in April-August, then +${I.tractors.growthSepMar26}% after the GST cut in September 2025. Volumes have grown ${I.tractors.fy09to26Cagr}% a year since FY09, but in cycles: a weak monsoon usually brings a down year. The 2026 monsoon was ${MO.pctLpa}% of the long-period average, the 4th weakest since 2001, with June at ${MO.june}% and 17 of 36 sub-divisions deficient; central and north-west India (the big tractor markets) were close to normal (${MO.central}% and ${MO.nwIndia}%), the south (${MO.south}%) and north-east (${MO.ne}%) were not. M&M sold ${n0(Y.tractorsDomestic)} tractors in India in April-August 2026 (+${Y.tractorsDomesticYoY}%) but only +5% in August, and retail sales were flat in August. Management guided mid-single-digit industry growth for FY27 in May.` },
    { p: `**Pickups and small trucks.** LCVs under 3.5 tonnes: ${n0(I.lcv.fy26Below3_5T)} units in FY26 (+${I.lcv.growth}%), M&M ${I.lcv.mmShare}% on SIAM's basis (52% on the company's). A steady, rural-linked market, helped by the GST cut on goods vehicles; management guides high-single-digit growth.` },
    { pair: [
      { type: 'column', title: 'M&M\'s share of India\'s UVs: 17% to 21% in two years', unit: 'M&M domestic UVs as % of industry UVs (%); FY27 = Apr-Aug', x: ['FY24', 'FY25', 'FY26', 'Apr-Aug FY27'], series: [{ name: 'Share', values: [17.2, 19.7, 21.3, Math.round(uvShareYtd * 10) / 10], fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: 'CRISIL (18-Sep-2026), AR FY26 MD&A, SIAM via The Week (Aug-2026), company releases' },
      { type: 'column', title: 'Monsoon 2026: 87% of normal, after a 65% June', unit: 'All-India rainfall as % of long-period average', x: ['June', 'July', 'August', 'September', 'Season'], series: [{ name: '% of LPA', values: [MO.june, MO.july, MO.august, MO.september, MO.pctLpa], fmt: 'pct0' }], labels: 'all', min: 0, max: 110, highlight: 'Season', source: 'IMD, Salient Features of the 2026 SW Monsoon (30-Sep-2026)' },
    ] },
    { h: 'Five other forces that matter for M&M' },
    { bullets: [
      '**Commodities and West Asia:** crude touched ~$100 in March 2026; steel rose 24% and rubber 30% in calendar 2026 to July. M&M lost 400-500bp of auto margin and 300bp+ of farm margin in Q1FY27 before price increases.',
      `**EVs:** industry e-SUV penetration reached ~9% in Q1FY27 (2-2.5% a few quarters earlier); M&M is at 12% and No.1 by e-SUV revenue (44%). The PLI subsidy supports margins and is expected to taper as scale builds. CAFE-III fuel-efficiency norms start in April 2027.`,
      '**Rare-earth magnets:** China\'s export curbs from April 2025 threatened EV motors; M&M said it was covered through March 2026 with stocked sub-assemblies and alternative sources, China eased curbs for India in August 2025, and India launched a ₹7,280 cr magnet scheme. No production loss was disclosed.',
      '**Competition:** six credible SUV makers (Maruti, Tata, Hyundai, Kia, Toyota, M&M) plus new entrants (VinFast, BYD) and, after the India-EU trade deal of January 2026, cheaper European imports over time.',
      '**Interest rates and rural credit:** most tractors and pickups are bought on loans (M&M Finance is a large lender to M&M customers); a weak monsoon raises credit costs and tightens lending in the following year.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach M&M?', title: 'Tailwind test: M&M captures the SUV and EV shift; tractors are a cycle, not a trend',
  blocks: [
    { p: 'A sector tailwind helps shareholders only if the company captures it. We score each driver.' },
    { verdicts: [
      ['Shift to SUVs', 'Yes', 'UVs are two-thirds of PVs; M&M is No.1 by SUV revenue share (25%) and gained 4 points of UV volume share in two years.', 'The core of the investment case; capacity (not demand) limits volumes to FY28.'],
      ['GST 2.0', 'Partly', 'Large SUVs moved to 40% from ~50%; small cars to 18%. M&M passed on ₹81,000-1.56 lakh; tractors and pickups also got lower GST.', 'A one-time step-up in demand; FY27-28 compare against a high base.'],
      ['EV adoption', 'Yes', 'M&M e-SUV penetration 12% vs industry 9%; No.1 by e-SUV revenue. But the profit sits in MEAL (92.45%), not in standalone M&M.', 'Positive for the group; neutral to slightly negative for standalone margins.'],
      ['Farm mechanisation', 'Yes', 'Labour shortages push farmers to tractors and implements; 69-70% of M&M\'s Q1FY27 mix is 40-50HP; farm machinery +17%.', 'A real long-term trend (8.2% CAGR since FY09) but around a volatile cycle.'],
      ['Monsoon / rural cycle', 'No', 'FY26 and H1FY27 were strong; the 2026 monsoon was 87% of normal (El Nino).', 'The next 12-18 months are more likely a headwind than a tailwind.'],
      ['Exports', 'Partly', 'Vehicle exports +63% in Apr-Aug 2026, but only ~5% of volume; tractor exports 4% of volume, with weak international subsidiaries (Turkey, Brazil, US).', 'Small for now.'],
      ['Commodity cycle', 'No', '400-500bp margin hit in Q1FY27; 4.2% of price increases since.', 'Pricing power exists, but with a lag of 1-2 quarters.'],
    ], head: ['Tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind scorecard: M&M captures 3 of 7 fully, 2 partly, and faces 2 headwinds', source: 'SIAM, IMD, company, GAM Research' },
    { callout: '**Our view:** M&M is the clearest beneficiary of India\'s SUV boom and is well placed for EVs. The tractor business is a high-quality franchise in a cyclical market, and FY26 was close to a peak. Our forecasts give the SUV tailwind full credit (domestic UVs +16% in FY27, +12% in FY28) and assume tractors flatten (+4% in FY27, −2% in FY28).' },
  ],
};

module.exports = { industry, tailwind };
