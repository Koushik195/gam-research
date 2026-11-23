// Eicher Motors report, part 2: what the company does, history and corporate actions, industry (premium
// motorcycles, GST 2.0, rare earths, EVs), the tailwind test and competition.
const X = require('./EICHERMOT.ctx');
const { C, D, SG, A26, A25, n0, n1, pc, rup } = X;
const I = D.industry, MW = I.middleweight, G = I.gst;
const pctOf = (x, t) => n1(x / t * 100) + '%';

const business = {
  id: 'business', nav: 'What Eicher does', kicker: 'The business', title: 'Two businesses: Royal Enfield (all of the revenue) and 54.4% of VECV (a sixth of the profit)',
  blocks: [
    { p: 'Eicher Motors owns **Royal Enfield**, the world\'s oldest motorcycle brand in continuous production (1901) and the leader in mid-size motorcycles (250-750cc). It makes three engine platforms: the 350cc "J" single (Classic, Bullet, Hunter, Meteor, Goan Classic; ~92% of domestic volume), the 450cc "Sherpa" (Himalayan, Guerrilla) plus the 440cc Scram, and the 650cc twin (Interceptor, Continental GT, Super Meteor, Shotgun, Bear, Classic and Bullet 650). Since Apr-2026 it also sells an electric city motorcycle under a new brand, **Flying Flea**. Bikes are made in Chennai (Oragadam, Vallam Vadagal) and Cheyyar, and assembled from kits (CKD) in Thailand, Brazil, Argentina, Colombia, Nepal and Bangladesh. Revenue also includes spares, accessories, riding gear and service: "allied" business, ~15% of revenue.' },
    { p: 'Eicher also owns **54.4% of VE Commercial Vehicles (VECV)**, a joint venture with Sweden\'s Volvo (45.6%) formed in 2008. VECV makes Eicher trucks and buses, distributes Volvo trucks and buses in India and makes engines (VE Powertrain). Control is shared 50:50 by agreement, so VECV is not consolidated: Eicher books 54.4% of its profit as one line ("share of profit of joint venture"). **Eicher\'s reported revenue and EBITDA are therefore Royal Enfield alone.** Screener adds the VECV share to other income.' },
    { exhibit: { type: 'table', title: 'The businesses, FY26 (₹ crore)', head: ['Business', 'Revenue', 'Profit', 'How it is reported'], wide: [3], rows: [
      ['**Royal Enfield (consolidated)**', `**${n0(A26.reRevenue)}**`, `EBITDA ${n0(A26.reEbitda)} (${n1(A26.reEbitda / A26.reRevenue * 100)}%)`, 'All of Eicher\'s revenue and EBITDA; one reportable segment'],
      ['  Motorcycles', n0(A26.motoRevenue), `${n0(A26.units)} units; ₹${n0(X.real26)} a bike`, 'India 1,107,343 units; international 120,634'],
      ['  Spares and components', n0(A26.spares), '–', 'AR note 28'],
      ['  Accessories, apparel and other traded goods', n0(A26.accessories), '–', 'Accessories bought by 87% of buyers (Q1FY27)'],
      ['  Warranties, after-sales services, export incentives, scrap', n0(A26.warranties + A26.otherOperating), '–', ''],
      ['  of which sold outside India (all lines)', n0(A26.overseasRevenue), pctOf(A26.overseasRevenue, A26.reRevenue) + ' of revenue', 'Geographic disclosure (note 44)'],
      ['**VECV (100% figures)**', `**${n0(A26.vecvRevenue)}**`, `EBITDA ${n0(A26.vecvEbitda)}; PAT ${n0(A26.vecvPat)}`, '54.4% of PAT = ₹798 cr in Eicher\'s profit'],
      ['  Volumes', n0(A26.vecvVolume) + ' vehicles', 'Market share 18.4% (>3.5T)', '#1 light and medium trucks (34.9%)'],
      { hl: true, cells: ['**Eicher consolidated**', `**${n0(A26.reRevenue)}**`, '**PAT 5,515 (VECV share 798, 14%)**', 'VECV and treasury income sit below EBITDA'] },
    ], source: 'AR FY26 (consolidated notes 8, 28, 44); Q4FY26 and Q1FY27 investor presentations' } },
    { pair: [
      { type: 'hbar', title: 'Motorcycles are 85% of revenue; allied lines 15%', unit: 'FY26 revenue (₹ crore)', x: ['Motorcycles', 'Spares and components', 'Accessories and apparel', 'Services, warranties, other'], series: [{ name: 'Revenue', values: [A26.motoRevenue, A26.spares, A26.accessories, A26.warranties + A26.otherOperating].map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR FY26 note 28' },
      { type: 'column', title: 'VECV volumes back above 1 lakh after the CV slump', unit: 'VECV vehicles sold', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'VECV', values: [41265, 57077, 79623, 85560, 90163, 103404], fmt: 'num' }], labels: 'all', source: 'Investor presentations; ICICI Direct (FY21)' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Capacity', '1.4 mn a year at Mar-2026 (Oragadam ~6 lakh, Vallam ~9 lakh); 1.5 mn after the first Cheyyar module (late Jul-2026); 2.0 mn by FY27-28 (₹958 cr brownfield); 2.45 mn by FY2029-30 with Tada, Andhra Pradesh (₹1,225 cr phase 1, 261 acres)'],
      ['Distribution', 'Rated #1 in FADA\'s 2025 dealer satisfaction survey; Flying Flea sold through separate stores (one in Bengaluru, ten planned); Flipkart and Amazon listings for the 350 range; ~9 lakh service job cards a month'],
      ['International', 'Subsidiaries in the UK, North America (incl. Canada), Brazil, Thailand and the Netherlands (Europe); CKD plants in 6 countries; Brazil #2 in middleweight; 6.6% / 9.7% / 7.6% middleweight share in the Americas / APAC / EMEA (FY26)'],
      ['Technology', 'Tech centres in Bruntingthorpe (UK, 170+ people) and Chennai (1,000+); ~₹2,350 cr spent on R&D in five years; 9.99% of Stark Future (Spanish electric off-road maker)'],
      ['VECV', 'Plants in Pithampur and Bhopal (MP); Eicher Pro X small trucks (incl. EVs) since FY26; 430+ service sites; electric buses (9-13.5 m); proposed 50:50 finance JV with Volvo Financial Services'],
    ], source: 'Q1FY27 presentation and call; Q4FY26 call; AR FY26' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a near-dead brand in 2000 to a 12-lakh-a-year exporter; few acquisitions, one written-off JV',
  blocks: [
    { p: 'Eicher bought Enfield India in 1994. In the 2000s, under Siddhartha Lal, the group sold its tractor and other businesses, folded its own trucks into the Volvo JV (2008) and bet on Royal Enfield, whose Classic 350 took off after the Oragadam plant opened (2013). Volumes reached 8.3 lakh in FY19, fell to ~6 lakh in FY21-22 (new safety and insurance rules raised prices; Covid; chip shortages), and doubled again to 12.3 lakh by FY26 on the new J-platform 350s and GST 2.0.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['2008', 'VECV formed with Volvo (Eicher 54.4%)', 'Trucks leave Eicher\'s revenue; profit share enters below EBITDA'],
      ['FY18-FY20', 'Eicher Polaris (utility vehicles) JV wound down', '₹220 cr share of loss in FY18 and ₹18 cr in FY19, booked as exceptional; liquidation still under way'],
      ['FY19-FY22', 'Volumes fall from 8.3 lakh to 6.0 lakh (ABS rules, long-term insurance, Covid, chips)', 'EBITDA margin 30% (FY19) to 20% (FY21); EPS ₹80.8 to ₹49.3'],
      ['FY23 (2022-23)', 'EUR50 mn for ~10% of Stark Future (electric dirt bikes, Spain)', 'Fair-value loss of ₹302 cr through OCI in FY25 (not in EPS); carried at ₹173 cr at Mar-26'],
      ['13-Feb-2025', 'Siddhartha Lal becomes executive chairman; B. Govindarajan MD', 'Lal\'s pay fell 34% in FY26 (to ₹18.9 cr)'],
      ['22-Sep-2025', 'GST 2.0: 350cc and below 28% to 18%; above 350cc 31% to 40%', 'Q2FY26 revenue +45%; 350s boom, >350cc volumes dip; RE cut 350 prices by up to ₹22,000'],
      ['Nov-2025', 'New Labour Codes', '₹55 cr exceptional charge in FY26 (VECV: ₹59 cr)'],
      ['Feb-2026 / Jul-2026', 'Cheyyar brownfield (₹958 cr) and Tada greenfield phase 1 (₹1,225 cr)', 'Capex roughly doubles to ₹1,700-1,800 cr a year; depreciation +40% in Q1FY27'],
      ['Apr-2026', 'Flying Flea C6 launched (first EV)', 'Start-up costs and depreciation; volumes tiny (100+ deliveries by July)'],
      ['May-2026', 'Plan for a 50:50 vehicle-finance JV with Volvo Financial Services India (up to ₹750 cr)', 'Not yet in our numbers: ~4% of treasury, would earn a JV share instead of interest'],
    ], source: 'Annual reports, investor presentations, calls; Autocar Pro (GST, Flying Flea)' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Premium motorcycles are the only growing part of the motorcycle market; GST 2.0 made the 350s cheaper',
  blocks: [
    { p: `India sold ${n1(I.twoWheelersFY26.units / 1e7)} crore two-wheelers in FY26 (+${I.twoWheelersFY26.growthPct}%, a record above FY19), but motorcycles grew only ${I.twoWheelersFY26.motorcyclesGrowthPct}% (scooters +${I.twoWheelersFY26.scootersGrowthPct}%). Within motorcycles, the mid-size segment is where the growth is: ~${n0(MW.monthly3yAgo)} a month three years ago, ~${n0(MW.monthlyNow / 1000)}k a month now, after 20+ launches by rivals. Royal Enfield went from ~${n0(MW.reMonthly3yAgo / 1000)}k to ~${n0(MW.reMonthlyNow / 1000)}k a month (management, Jul-2026). It holds ~${MW.reShareMidsizePct}% of the segment but only ${MW.reShareMotorcyclesPct}% of all Indian motorcycles: the headroom is in upgrading commuters, a quarter of RE buyers are first-time buyers.` },
    { exhibit: { type: 'table', title: 'GST 2.0 (effective 22-Sep-2025): the rate change that reshaped Royal Enfield\'s mix', head: ['Category', 'Before', 'After', 'Royal Enfield models', 'What happened'], wide: [3, 4], rows: [
      ['Motorcycles up to 350cc', `${G.upTo350Before}%`, `${G.upTo350After}%`, 'Classic, Bullet, Hunter, Meteor, Goan Classic (349cc), Flying Flea', 'Full cut passed on (up to ₹22,000); 350s +34% in Q1FY27, +15% in Aug-2026'],
      ['Motorcycles above 350cc', `${G.above350Before}% (28% + 3% cess)`, `${G.above350After}%`, 'Scram 440, Himalayan and Guerrilla 450, all 650s', 'Prices raised; >350cc -6% in Nov-2025 and -23% in Jun-2026 YoY; back to pre-GST monthly levels by July'],
      ['Trucks and buses', `${G.trucksBusesBefore}%`, `${G.trucksBusesAfter}%`, 'VECV', 'VECV Q4FY26 volumes +18%; FY26 +14.7%'],
    ], source: 'Autocar Pro (10-Sep-2025), Business Today (3-Dec-2025), monthly releases, Q1FY27 call. Note: Royal Enfield did not cut the 450 to 350cc to dodge the rate (CEO, Jul-2026).' } },
    { bullets: [
      `**Rare earths (2025).** ${rup(I.rareEarth.what)}`,
      `**Electric.** Flying Flea C6 launched on 9-Apr-2026 at ${I.ev.price}; deliveries ${I.ev.deliveries}; plan: ${I.ev.plan}. Premium electric motorcycles are a tiny market in India today; the EV threat to Royal Enfield is long-dated, but its answer is still a one-city experiment.`,
      `**Commodities and supply (2026).** ${I.commodities.what}`,
      `**Abroad.** The global middleweight market is ~${I.globalMiddleweight.marketMn} mn a year; Royal Enfield has ${I.globalMiddleweight.reSharePct}%. Brazil is now its biggest export market; the US (tariffs), Europe ("market adjustment") and Thailand are weak; Indonesia caps imports at ~10,000 a year.`,
      `**Commercial vehicles.** The CV industry grew ~${I.cvFY26.industryGrowthPct}% in FY26 (VECV ${I.cvFY26.vecvGrowthPct}%), helped by the GST cut on trucks and buses and infrastructure spending; the Delhi-NCR PARIVARTAN scheme targets 2.07 lakh old trucks and buses.`,
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does premiumisation reach Royal Enfield? Yes in volume; less so in price and mix',
  blocks: [
    { exhibit: { type: 'table', title: 'Three tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach RE?', 'Catch'], wide: [1, 3], rows: [
      ['Premiumisation of motorcycles', `Mid-size market ~70k to ~1.2 lakh a month in three years`, `Yes: RE ~61k to ~1.01 lakh a month (+66%)`, 'RE grew a little slower than the segment (+71%): share ~87% to ~84% as 20+ rival models arrived'],
      ['GST 2.0 on 350s', 'Domestic Q1FY27 +32%; 350s +34%; retail ~+20% (MOSL)', 'Yes: ~92% of RE domestic volume is 350cc', 'One-off step: the base gets tough from Sep-2026; and the 40% rate hurt the higher-margin 450/650s'],
      ['Exports and CKD', 'International revenue ₹1,000 cr+ in Q1FY27; Brazil +71% in FY26', 'Partly: 15% of revenue', 'Exports -9% in Apr-Aug 2026; US tariffs, weak Europe; run-rate ~10k a month for a year (MOSL)'],
      ['CV cycle (VECV)', 'CV industry +13% in FY26; GST cut; replacement scheme', 'Yes, through the 54.4% share', 'Cyclical; GST-boosted H2FY26 base; VECV margin only ~9%'],
    ], source: 'Q1FY27 call and presentation, monthly releases, MOSL (29-Jul-2026), GAM Research' } },
    { callout: '**Verdict:** the tailwind is real and Royal Enfield is its main beneficiary, but it arrives as volume in the cheapest part of the range. Revenue per motorcycle rose only 1.7% in FY26 (two-wheeler revenue ÷ units) and margins fell 30bp. Investors paying for "premiumisation" should note that RE\'s own mix has moved toward its most affordable bikes.' },
  ],
};

const CP = D.competition;
const competition = {
  id: 'competition', nav: 'Competition', kicker: 'Competition', title: 'Rivals are many but small: RE still had ~82% of 350-450cc dispatches in June 2026',
  blocks: [
    { p: 'Every large two-wheeler maker has now entered Royal Enfield\'s segment, mostly through foreign brands: Bajaj with Triumph (Speed 400, Scrambler 400, and from 2026 a 350) and KTM; Hero with Harley-Davidson (X440) and its own Mavrick; Honda with the CB350 and H\'ness; Mahindra-backed Classic Legends with Jawa, Yezdi and BSA; TVS with BMW (310s) and Norton. None has come close: in June 2026 Royal Enfield\'s 350s alone outsold all rivals in 350-450cc by ~4 to 1. The risks are slower share erosion at the edges (Honda CB350 +62% YoY) and price pressure if a rival with scale (Bajaj-Triumph, Honda) decides to buy share.' },
    { exhibit: { type: 'table', title: '350-450cc motorcycle dispatches, June 2026', head: ['Model', 'Brand', 'Units', 'YoY growth'], rows: CP.rows.map(r => [r[0], r[1], n0(r[2]), r[3] == null ? 'n.d.' : pc(r[3])]), source: `Rushlane (29-Jul-2026). Segment total ${n0(122594)} (+44% YoY); Royal Enfield models ~${n0(CP.rows.filter(r => r[1] === 'Royal Enfield').reduce((s, r) => s + r[2], 0))} (~${Math.round(CP.rows.filter(r => r[1] === 'Royal Enfield').reduce((s, r) => s + r[2], 0) / 122594 * 100)}%). Dispatches include exports.` } },
    { callout: '**Our read:** competition has not dented Royal Enfield\'s volumes, but it caps pricing. RE\'s answer has been more bike for the same price (Hunter base variants, Guerrilla Apex, refreshed 350s) rather than price increases above inflation. That is good for share and bad for margin; we model the latter.' },
  ],
};

module.exports = { business, history, industry, tailwind, competition };
