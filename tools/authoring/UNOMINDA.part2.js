// Uno Minda report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./UNOMINDA.ctx');
const { C, D, SA, n0, n1, pc, base26, DIV, DIVN } = X;
const I = D.industry, PR = I.production, A26 = SA.find(a => a.fy === 'FY26'), MX = C.profile.mixQ1FY27;
const share = (x, t) => Math.round(x / t * 100) + '%';
const WHAT = { switches: '2W handlebar and 4W switches (Uno Mindarika, 51%, Tokai Rika 49%), steering-column and window switches', lighting: '2W and 4W head/tail lamps, LED and ambient lighting; plants in India and Indonesia', castings: '4W and 2W alloy wheels (gravity, low-pressure and, from H2FY27, high-pressure die cast), aluminium die-cast parts', greenMobility: 'EV chargers, DC-DC converters, motors and controllers (2W/3W); electric drive units for cars (UMAI); CNG kits (Minda Westport)', seating: '2W and CV seats (incl. the Harita and Sundaram Auto seat businesses); PV seats with Tachi-S from Q4FY28', others: 'Sensors and ADAS, horns and acoustics, blow-moulded tanks and ducts, controllers, aftermarket (incl. batteries), EMS (Uno Minda Katolec), sunroof from end-FY27' };

const business = {
  id: 'business', nav: 'What Uno Minda does', kicker: 'The business', title: 'A supermarket of auto parts: 28 product lines, two-wheelers and cars in equal measure',
  blocks: [
    { p: `Uno Minda (formerly Minda Industries) is a Gurugram-based, promoter-run tier-1 supplier controlled by the Minda family (68.4%). It makes ~28 product lines in 78 plants and sells ${MX.oem}% to vehicle makers and ${MX.aftermarket}% to the aftermarket; ${MX.india}% of Q1FY27 revenue was billed in India. By vehicle, Q1FY27 revenue was ${MX.fourWheeler}% cars and utility vehicles, ${MX.twoWheeler}% two-wheelers, ${MX.cv}% commercial vehicles, ${MX.threeWheeler}% three-wheelers and ${MX.offRoad}% off-road. It reports one segment, but discloses revenue by division. Two customers were each above 10% of FY26 revenue. Around the consolidated business sit equity-accounted JVs with Japanese partners (airbags and steering wheels with Toyoda Gosei, filters with Roki, infotainment with Denso Ten, seatbelts and locks with Tokai Rika) whose combined FY26 revenue was ~₹5,660 cr; including them, "group" revenue was ₹25,203 cr.` },
    { exhibit: { type: 'table', title: 'The divisions, FY26 (₹ crore)', head: ['Division', 'Revenue', 'Share', 'Q1FY27 growth', 'What it sells'], wide: [4], rows: [
      ...DIV.map(k => [`**${DIVN[k]}**`, n0(A26[k]), share(A26[k], A26.total), pc(C.q1fy27.divisions[k][1]), WHAT[k]]),
      { hl: true, cells: ['**Total (divisions)**', `**${n0(A26.total)}**`, '100%', '+26%', `Reported revenue ₹${n0(A26.reported)} cr incl. ₹69 cr of prior-period income`] },
    ], source: 'Q4FY26 and Q1FY27 presentations and calls; AR FY26. No divisional profit is disclosed.' } },
    { pair: [
      { type: 'stacked', title: 'FY25 to FY26: Others and Seating grew fastest', unit: 'Revenue by division (₹ crore)', x: SA.map(a => a.fy), series: DIV.map((k, i) => ({ name: DIVN[k], values: SA.map(a => a[k]), fmt: 'num', ...(i === 4 ? { color: '#7a5195' } : i === 5 ? { color: '#8c8c8c' } : {}) })), minLabel: 900, source: 'Company; FY25 Lighting, Castings, Seating and Others derived from stated FY26 growth' },
      { type: 'column', title: 'Exports from India: ₹141 cr to ₹228 cr in a year', unit: 'Physical exports from India per quarter (₹ crore)', x: ['Q1FY26', 'Q1FY27'], series: [{ name: 'Exports', values: [141, 228], fmt: 'num' }], labels: 'all', source: 'Q1FY27 call (4-Aug-2026). FY26 exports ~₹600 cr; target >₹1,500 cr "in next few years".' },
    ] },
    { exhibit: { type: 'table', title: 'Partners and structure', head: ['Entity', 'Uno Minda stake', 'What it does', 'How it shows up'], wide: [2], rows: [
      ['Uno Mindarika', '51% (Tokai Rika 49%)', '4W switches; FY26 revenue ₹1,983 cr', 'Consolidated; 49% of its profit (₹44 cr) to minorities'],
      ['Toyoda Gosei Uno Minda', '49.9%', 'Airbags, steering wheels, weather strips; FY26 revenue ₹2,903 cr', 'Equity-accounted: ₹129 cr share of profit'],
      ['Roki Uno Minda', '49%', 'Air filters, canisters; ₹808 cr', 'Equity-accounted: ₹53 cr'],
      ['Denso Ten Uno Minda', '49%', 'Infotainment and displays; ₹817 cr', 'Equity-accounted: ₹45 cr'],
      ['Tokai Rika Minda', '30%', 'Seatbelts, locksets, shifters; ₹1,133 cr', 'Equity-accounted: ₹16 cr'],
      ['Minda Westport / Uno Minda Kyoraku / Uno Minda Katolec', '76% / 68% / 51%', 'CNG systems / blow moulding / EMS', 'Consolidated; minorities ₹11 cr / ₹10 cr / ₹11 cr'],
      ['Uno Minda Auto Innovations (UMAI); Inovance JV (pending)', '100%', '4W EV powertrain (electric drive units, hybrid transmissions)', 'Consolidated; Khed H2FY27, CSN Q2FY28'],
    ], source: 'AR FY26 consolidated notes 7, 44; Q4FY26 and Q1FY27 calls' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Sixty-eight years of adding products: horns to EV drives, built by JVs, licences and buy-outs',
  blocks: [
    { p: 'The company began in 1958 making ammeters, added horns, switches and lighting, and since the 1990s has grown by pairing with Japanese and European specialists: a licence or JV first, then, often, buying the partner out. Kosei (alloy wheels) went from JV to full merger in 2024-26; Westport (CNG) from 50% to 76%; FRIWO\'s 49.9% of Uno Minda EV Systems was bought in FY26 (₹141 cr plus ₹58 cr for e-drive assets). Each step moved profit from "share of JV" or "minorities" into owners\' profit, which helped EPS grow faster than revenue. Equity has been issued only for ESOPs and small share-swap deals since the FY23 1:1 bonus (Screener EPS is bonus-adjusted).' },
    { exhibit: { type: 'table', title: 'Milestones and corporate actions', head: ['When', 'What'], wide: [1], rows: C.history, source: C.historySrc } },
    { exhibit: { type: 'table', title: 'Recent actions and what they did to the numbers', head: ['When', 'Action', 'Impact'], wide: [1, 2], rows: [
      ['Mar-2025', '2W seat business of Sundaram Auto Components bought (slump sale)', 'Seating revenue +23% in FY26; small goodwill'],
      ['FY26', 'FRIWO\'s 49.9% of Uno Minda EV Systems for ₹141 cr; e-drive IP and assets ₹58 cr', 'EV Systems now 100% owned: its profit (₹24 cr in FY26) no longer shared; ₹124 cr charged to equity'],
      ['Q1FY26', '₹69 cr of prior-period income booked in revenue (customer price settlements)', 'Inflates FY26 revenue/EBITDA; Q1FY27 growth +24% reported, +26% normalised'],
      ['Q3FY26', 'New labour codes: ₹27.6 cr exceptional charge (gratuity, leave)', 'FY26 PAT −₹18 cr after tax; higher wage costs from FY27'],
      ['Jul/Aug-2026', 'Onkyo\'s 19% of Minda Onkyo bought (₹1.02 cr); amalgamation approved, appointed date 1-Apr-2026', 'Immaterial; a tiny share issue to the remaining 1%'],
      ['May-2026', 'Enabling resolution to raise up to ₹2,500 cr', '"No plan as of now"; covers NCDs and borrowings as well (CFO)'],
    ], source: 'AR FY26 notes 13, 41, 42; Q4FY26 and Q1FY27 calls; board outcome 4-Aug-2026' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: `Record vehicle production in FY26 (+${PR.fy26GrowthPct}%) and Q1FY27 (+${PR.q1fy27GrowthPct}%); input costs are the catch`,
  blocks: [
    { p: `India produced ~${PR.fy26TotalMn} mn vehicles in FY26 (+${PR.fy26GrowthPct}%): ${PR.fy26PvMn} mn passenger vehicles (+${PR.fy26PvGrowthPct}%), ${PR.fy26TwMn} mn two-wheelers (+${PR.fy26TwGrowthPct}%) and ${PR.fy26CvMn} mn commercial vehicles (+${PR.fy26CvGrowthPct}%), with a strong second half after the Sep-2025 GST cuts. Q1FY27 production was a record ${PR.q1fy27TotalMn} mn (+${PR.q1fy27GrowthPct}%): PVs +${PR.q1fy27PvGrowthPct}%, two-wheelers +${PR.q1fy27TwGrowthPct}% (exports +37%), CVs +${PR.q1fy27CvGrowthPct}%. From Q3FY27 the comparison base includes the GST boost, and management itself expects a move "towards more stable technology-led growth".` },
    { exhibit: { type: 'table', title: 'What drives a parts maker\'s growth beyond volumes', head: ['Driver', 'Evidence (to Aug-2026)', 'Relevance for Uno Minda'], wide: [1, 2], rows: [
      ['Electrification', `e-PV penetration ${I.ev.fy26EPvPenetration}% (FY26) → ${I.ev.q1fy27EPvPenetration}% (Q1FY27); e-2W ${I.ev.fy26E2wPenetration}% → ${I.ev.q1fy27E2wPenetration}%; e-3W >${I.ev.e3wPenetration}%`, 'Green Mobility +78% in Q1; most of the catalogue (lights, switches, wheels, seats) is powertrain-agnostic'],
      ['CNG', `CNG share of PV sales ${I.ev.cngPvPenetrationFY26}% in FY26 (10% in FY23)`, 'Alternate-fuel revenue ₹592 cr in FY26 (+18%), ₹184 cr in Q1FY27'],
      ['Premiumisation and SUVs', 'Kit value up to ~₹2.5 lakh per SUV on Uno Minda\'s full catalogue (company)', 'LED and ambient lighting, alloy wheels, sunroofs, seats'],
      ['Regulation', 'CAFE norms tighter from Apr-2027 (LEDs, light-weighting); new labour codes (Nov-2025)', 'Content tailwind; wage-cost headwind (Haryana +~35%)'],
      ['Alloy-wheel penetration', '~70% in 2W, ~40% in 4W (company); temporary dip in FY26 as entry models grew', 'Castings growth above volumes as penetration recovers'],
      ['Commodities and the rupee', 'Aluminium at a record in Q4FY26; USD/INR above 95.5; West Asia conflict', 'Passed through with a 1-6 month lag and without a mark-up'],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls' } },
    { callout: '**Our read:** the cycle helped in FY26-Q1FY27 and turns into a tougher base from H2FY27. For Uno Minda the bigger drivers are structural (content per vehicle, EV, exports), but they come with a margin cost: new electronics carry lower gross margins and commodity pass-through dilutes percentages.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Tailwind test: yes, Uno Minda outgrows production, but less than it used to and not at every customer',
  blocks: [
    { exhibit: { type: 'table', title: 'Uno Minda revenue growth vs vehicle production', head: ['Period', 'Production growth', 'Uno Minda revenue growth', 'Outperformance'], rows: [
      ['FY16-26 (a year)', '4-5% (PV and 2W, Jefferies)', '~23%', '~18 points'],
      ['FY26', `+${PR.fy26GrowthPct}% (all vehicles)`, '+17% (normalised)', '+5 points'],
      ['Q1FY27', `+${PR.q1fy27GrowthPct}%`, '+26% (normalised)', '+4 points'],
      ['Q1FY27 vs key client Maruti Suzuki', '–', '–', '−12.1% (Emkay; −10.4% in Q4FY26, −8.8% in Q3FY26)'],
    ], source: 'Company calls; Jefferies initiation (10-Mar-2026, via Business Today); Emkay (5-Aug-2026)' } },
    { bullets: [
      '**The tailwind reaches it.** Growth beat production in FY26 and Q1FY27 across divisions; EV and CNG volumes flow straight into Green Mobility.',
      '**But the gap is narrowing.** Outperformance of 4-5 points is far below the decade average, and Emkay shows Uno Minda lagging its key car client: share gains elsewhere and new products have to do more work.',
      '**Margins do not capture the tailwind.** Record volumes in Q1FY27 came with a 10.3% margin, the lowest in two years; the upside goes to revenue, not to margin percentages.',
    ] },
  ],
};

module.exports = { business, history, industry, tailwind };
