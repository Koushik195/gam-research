// Deepak Fertilisers report, part B (2/5): business, history, industry and the tailwind test. As of 30-Sep-2026.
const { ctx } = require('./DEEPAKFERT.ctx');
const { C, D, F, n0, n1, A26, A25, Q1 } = ctx;
const SRC = 'Company presentations (May/Jul-2026), Annual Report 2025-26, GAM Research';
const S26 = C.fy26.subsidiaries;

const business = {
  id: 'business', nav: 'What the company does', kicker: 'The business', title: 'What Deepak does: turns gas into ammonia, ammonia into explosives-grade nitrate, acids and fertilisers',
  blocks: [
    { p: `Deepak Fertilisers and Petrochemicals (DFPCL) started in 1979 as an ammonia-based chemicals and fertiliser maker at Taloja, near Mumbai. Today it runs one value chain: natural gas (a domestic take-or-pay contract and, since May-2026, a 15-year LNG contract with Equinor of Norway) → ammonia (a 500 ktpa plant at Taloja, plus bought and traded ammonia) → nitric acid (885 ktpa weak, 231 ktpa concentrated) → technical ammonium nitrate (TAN, 587 ktpa), the oxidiser in mining and quarrying explosives. Alongside sit isopropyl alcohol (IPA, 70 ktpa, made from refinery propylene) for pharma solvents, and Mahadhan crop nutrition: complex fertilisers (NP 24:24:0, NPK), crop-specific Croptek blends, Bensulf and water-soluble fertilisers sold mainly in Maharashtra, Karnataka and Gujarat. Despite the name, fertilisers are 54% of revenue but only ~${Math.round(A26.fertEbit / (A26.fertEbit + A26.chemEbit) * 100)}% of segment profit; chemicals are the profit engine.` },
    { exhibit: { type: 'table', title: 'Three businesses, two reported segments', head: ['Business (entity)', 'What it sells', 'Capacity', 'Position', 'FY26 revenue (₹ cr)', 'Customers'], wide: [1, 5], rows: [
      ['Mining chemicals (Deepak Mining Solutions, DMSL)', 'TAN: high- and low-density prills, AN melt; mine-site blasting services; blasting in Australia (Platinum Blasting)', '587 ktpa → ~963 ktpa with Gopalpur', '~40% of India; only Indian maker of LDAN, HDAN and medical-grade AN', '2,604 (TAN)', 'Explosives makers, Coal India and other miners (an analyst called Coal India the largest client on the Q4FY26 call), infrastructure contractors'],
      ['Ammonia (Performance Chemiserve, PCL, under DMSL)', 'Ammonia, mostly used in-house (~80%); surplus sold; ammonia trading', '500 ktpa (+~10% debottleneck)', 'Covered ~93% of group ammonia needs in FY26', 'Inside Chemicals (sales + other: 858)', 'Group plants; chemical buyers'],
      ['Industrial chemicals (DFPCL)', 'Weak and concentrated nitric acid, IPA, methanol (closing), liquid CO2, pharma solvents', 'WNA 885, CNA 231, IPA 70 ktpa', '62% of India\'s CNA, 27% of DNA', '1,842', 'Nitro-aromatics, pharma, explosives, solar/steel grades'],
      ['Crop nutrition (Mahadhan AgriTech, MAL)', 'NP, NPK, Croptek, Bensulf, Solutek, traded DAP/MOP', 'NP 300, NPK 800, Bensulf 57 ktpa', 'Leader in specialty and water-soluble fertilisers; the only prilled NP 24:24:0 maker', '6,166', 'Farmers via dealers; cash crops, fruit and vegetables'],
    ], source: SRC } },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue: fertilisers are the biggest line', unit: '₹ crore', x: ['Crop nutrition', 'TAN', 'Industrial chemicals', 'Ammonia, blasting, other chemicals', 'Realty & others'], series: [{ name: 'FY26 revenue', values: [6166, 2604, 1842, Math.round(A26.chemOtherRev), Math.round(A26.othRev)], fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM calculation (Chemicals segment less TAN and industrial chemicals)' },
      { type: 'column', title: 'Segment EBIT margin: chemicals 22-31%, fertilisers 0-9%', unit: 'EBIT ÷ segment revenue (%)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Chemicals', values: [...['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => ctx.ann(y).chemEbitPct), Q1.chemEbitPct], fmt: 'pct' }, { name: 'Fertilisers', values: [...['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => ctx.ann(y).fertEbitPct), Q1.fertEbitPct], fmt: 'pct' }], labels: 'none', source: 'Annual reports (segment notes); Q1FY27 results' },
    ] },
    { exhibit: { type: 'table', title: 'Group structure after the 2024 restructuring (FY26, ₹ crore)', head: ['Entity', 'Holding', 'Turnover', 'Profit after tax', 'Net worth'], rows: [
      ['DFPCL (listed parent: industrial chemicals, realty)', '—', '1,964 (standalone)', '269 (incl. ₹102 cr dividend from a subsidiary)', '3,661'],
      ['Mahadhan AgriTech (MAL)', '100%', n0(S26.MAL.turnover), n0(S26.MAL.pat), n0(S26.MAL.netWorth)],
      ['Deepak Mining Solutions (DMSL, standalone)', '100% (CCDs convert into ~6-7%)', n0(S26.DMSL.turnover), n0(S26.DMSL.pat), n0(S26.DMSL.netWorth)],
      ['Performance Chemiserve (PCL, ammonia)', '100% via DMSL', n0(S26.PCL.turnover), n0(S26.PCL.pat), n0(S26.PCL.netWorth)],
      ['Platinum Blasting Services (Australia)', '100% via DMSL (85% until Nov-2025)', n0(S26.PBS.turnover), n0(S26.PBS.pat), n0(S26.PBS.netWorth)],
    ], source: 'Annual Report 2025-26 (standalone results, Form AOC-1); Q4FY26 results (28-May-2026)' } },
    { callout: '**So what:** the listed parent is now mostly a holding company. The valuable parts (TAN and ammonia in DMSL, fertilisers in MAL) sit in 100% subsidiaries that management says it is "committed" to listing (form and timing undecided). The ammonia plant shows a loss in its own books because it sells to group plants at internal transfer prices; its value shows up as cheaper raw material for TAN and nitric acid, which is why we value Chemicals as one block.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: two big bets (ammonia, then TAN and nitric acid), each followed by a margin squeeze',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['1979-2000s', 'Ammonia-based chemicals and fertilisers at Taloja; TAN and IPA added; Smartchem (now MAL) set up for fertilisers', 'A mid-sized commodity producer: EPS ₹7-18 in FY15-FY20'],
      ['FY21-FY23', 'Covid recovery, then the Russia-Ukraine war lifts ammonia, nitric acid and fertiliser prices', 'EPS ₹39 → ₹56 → ₹96; net debt down to ~₹1,500 cr (FY22)'],
      ['FY24', '500 ktpa Taloja ammonia plant capitalised (fixed assets ₹2,678 cr → ₹6,258 cr); ammonia prices collapse', 'EPS ₹35.9 (−63%); interest ₹404 cr and depreciation ₹334 cr'],
      ['FY25', 'NCLT-approved restructuring: TAN, ammonia and Australian blasting into DMSL, crop nutrition into MAL; Equinor contract signed earlier (Feb-2024)', 'EPS ₹74.0; ROCE back to 16%'],
      ['Apr-2025', 'DMSL issues ₹800 cr CCDs: ₹500 cr third party, ₹300 cr SCM Growth LLP (promoter)', '₹619 cr shown as minority interest; ₹181 cr as debt; 8% coupon'],
      ['FY26', 'Gopalpur and Dahej spend (capex ₹1,570 cr); last 15% of Platinum Blasting bought (AUD10.7 mn); planned ammonia shutdown', 'EBITDA −13%, EPS ₹58.4; net debt ₹4,824 cr (2.9x EBITDA)'],
      ['May-2026', 'First Equinor LNG cargo; Chardham Chemicals (explosives) bought for ₹121 cr', 'Gas cost and security improve from Q2FY27'],
      ['Q1FY27', 'Middle East war: ammonia ~$800/t, TAN ~₹70/kg', 'Record EBITDA ₹845 cr; net debt ₹4,719 cr'],
    ], source: 'Annual reports FY21-FY26; company presentations and calls; Screener.in' } },
    { callout: '**Pattern to remember:** Deepak builds big integrated assets and then lives through the commodity cycle on them. The ammonia plant arrived as ammonia prices fell (FY24) and lost money in its own books in FY26; it is earning well only now, in a war. Gopalpur arrives as TAN prices are at a peak. The assets are real, but timing has rarely been kind, and both projects ran late and over their first budgets.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: TAN is short in India, ammonia is volatile, fertilisers are run by policy',
  blocks: [
    { p: `**TAN.** India used ~1,319 kt of TAN in FY25 but made only ~916 kt and imported ~422 kt, mostly from Russia (Emkay, citing industry data). Demand follows coal and mineral output and infrastructure blasting; Q2 (monsoon) is the weak quarter and Q4 the strongest. In early 2026 Russian exports were disrupted (an export ban, lifted in May-2026, and plant incidents), which is why domestic prices jumped. New supply is coming: Deepak's own Gopalpur (376 ktpa) and, further out, Coal India's coal-gasification-based ammonium nitrate, whose technology is still unproven. **Ammonia.** Global ammonia rose from ~$300/t (mid-2025) to $801/t (May-2026) on Middle East supply losses and was falling again by September. **Fertilisers.** Phosphatic and potassic fertilisers are paid a per-kg Nutrient Based Subsidy (NBS) fixed each season, and the government keeps farm-gate prices in check: if phosphoric acid and sulphur rise faster than the subsidy, NPK makers' margins shrink, as in FY24 and H2FY26.` },
    { pair: [
      { type: 'column', title: 'India imported ~a third of its TAN in FY25', unit: 'FY25, kt', x: ['Demand', 'Domestic production', 'Imports'], series: [{ name: 'kt', values: [1319, 916, 422], fmt: 'num' }], labels: 'all', source: 'Emkay initiation (18-Nov-2025), citing industry data' },
      { type: 'hbar', title: '2026 monsoon: 87% of normal; Central India 97%', unit: 'June-September rainfall, % of long-period average', x: ['All India', 'Central India', 'Northwest', 'South Peninsula', 'East & Northeast'], series: [{ name: '% of LPA', values: [87, 97, 94, 76, 74], fmt: 'num' }], labels: 'all', lines: [{ v: 90, axis: 'x', text: 'Deficient below 90%', color: '#b4232a' }], source: 'IMD end-of-season statement (30-Sep-2026)' },
    ] },
    { exhibit: { type: 'table', title: 'Policy and input prices known on 30-Sep-2026', head: ['Item', 'Latest', 'Earlier', 'Source / date'], wide: [0], rows: [
      ['NBS outlay, Kharif 2026 (Apr-Sep)', '₹41,534 cr', '₹37,216 cr (Kharif 2025)', 'Cabinet, Apr-2026'],
      ['NBS rates, Kharif 2026 (per kg)', 'N ₹47.32, P ₹52.76, K ₹2.38, S ₹3.16', 'K unchanged', 'One press report (Apr-2026); only K corroborated'],
      ['NBS rates, Rabi 2026-27', 'Not announced by 30-Sep-2026', '—', 'Left out of our numbers'],
      ['Phosphoric acid (CFR India)', '$1,360/t (Apr-Jun 2026)', '$1,153/t (Apr-Jun 2025)', 'Company presentation, Jul-2026'],
      ['Potash (CFR)', '$383/t (from Jan-2026)', '$284-349/t (2025)', 'Company presentation, Jul-2026'],
      ['Ammonia (FOB Middle East)', '$777/t (Jun-2026); ~$600 end-July', '$298/t (Jun-2025)', 'Company presentation; Q1FY27 call'],
      ['Ammonia (Tampa contract)', '$555/t for Sep-2026, fourth monthly fall', '—', 'Fertilizer Daily, 10-Sep-2026'],
      ['Gas', 'Equinor LNG from May-2026, Henry Hub-linked, up to 0.65 MTPA for 15 years', 'Domestic take-or-pay + spot', 'Annual Report 2025-26; Q4FY26 call'],
    ], source: 'As listed; PIB/Cabinet coverage (Tribune, Rural Voice, Apr-2026)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach Deepak?', title: 'Tailwind test: mining and import tightness reach Deepak; the fertiliser tailwind mostly does not',
  blocks: [
    { verdicts: [
      ['Mining and infrastructure growth', 'Strong', 'TAN volumes +11% in FY26 (577 kt) at ~98% utilisation; Q4 is the peak quarter as miners chase annual targets.', 'Gopalpur\'s 376 ktpa has a market; it is next to the eastern coal belt.'],
      ['TAN import tightness', 'Moderate', 'TAN revenue per kg ₹45 (FY26) → ₹70 (Q1FY27) as Russian supply was disrupted; Russia lifted its export ban in May-2026.', 'Real but temporary; new domestic capacity (including Deepak\'s own) loosens the market from FY28.'],
      ['Ammonia price spike', 'Moderate', 'Own ammonia at Equinor gas cost vs ~$600-800/t market; but ~80% is used in-house and Gopalpur buys ammonia.', 'Helps the integrated Taloja chain; hurts Gopalpur\'s margins if prices stay high.'],
      ['Higher fertiliser subsidies', 'Weak', 'Kharif 2026 NBS outlay +12%, but phosphoric acid +18% YoY and sulphur higher; segment EBIT margin 3.2% in Q1FY27.', 'Subsidy follows costs with a lag; margins thin until it catches up.'],
      ['Monsoon', 'Weak', '87% of normal in 2026 (deficient), though Central India got 97%.', 'Neutral-to-negative for Rabi demand; reservoirs matter more than rain in Deepak\'s irrigated markets.'],
      ['Specialty shift in chemicals and fertilisers', 'Moderate', 'Specialty + Croptek ~40% of crop revenue; solar/semiconductor-grade nitric acid and IPA in trials.', 'Mix helps slowly; too small to move group margins in our horizon.'],
    ], head: ['Tailwind', 'Reaches Deepak?', 'Evidence', 'So what'], title: 'Tailwind scorecard', source: 'GAM Research from company data, IMD, Cabinet releases' },
  ],
};

module.exports = { business, history, industry, tailwind };
