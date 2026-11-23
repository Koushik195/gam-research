// Bajaj Auto report, part 2: business, history, industry and the tailwind test. Business-line chapters are in part2b.
const X = require('./BAJAJ-AUTO.ctx');
const { C, D, n0, n1, rup, SRC, SA, A26, A25, FY26, KTM, BACL } = X;
const I = D.industry;

const business = {
  id: 'business', nav: 'What Bajaj Auto does', kicker: 'The business', title: 'Motorcycles, three-wheelers and scooters for India and 70+ countries, plus a lender and KTM',
  blocks: [
    { p: `Bajaj Auto makes two- and three-wheelers in India: Waluj (2.7 mn motorcycles and 1.02 mn three-wheelers a year), Pantnagar (1.8 mn), Chakan 1 (0.9 mn Pulsar, Dominar), Chakan 2 (0.3 mn KTM, Husqvarna, Triumph) and Chakan/Akurdi (0.48 mn Chetak scooters): 7.2 mn units of capacity at Mar-26 (AR Table 5). In FY26 it sold **${n0(A26.units)} vehicles**: ${n0(A26.dom2w)} two-wheelers in India (of which ${n0(FY26.domMc)} motorcycles and ${n0(FY26.chetak)} Chetak electric scooters), ${n0(A26.dom3w)} three-wheelers in India, and ${n0(A26.exp2w + A26.exp3w)} vehicles abroad. Its brands span commuters (Platina, CT, the Freedom CNG bike), the Pulsar and Dominar sports range, KTM and Husqvarna bikes it builds for KTM, Triumph's 350-400cc bikes it builds and sells under licence, Chetak scooters, and passenger and goods three-wheelers (petrol, CNG and electric under Wego and Riki). Spares bring in ~₹1,700-1,800 cr a quarter at record margins. The listed company ("standalone") had revenue of ₹${n0(A26.saRev)} cr and EBITDA of ₹${n0(A26.saEbitda)} cr (${n1(A26.saMarginPct)}%).` },
    { p: `Two big subsidiaries sit around it. **Bajaj Auto Credit (BACL)** lends to buyers of Bajaj vehicles: AUM ~₹${n0(BACL.fy26.aumCr)} cr at Mar-26, income ₹${n0(BACL.fy26.income)} cr and profit ₹${n0(BACL.fy26.pat)} cr in FY26. **KTM**: since 18-Nov-2025 Bajaj owns 74.94% of Bajaj Mobility AG (formerly PIERER Mobility), the listed Austrian parent of KTM AG (KTM, Husqvarna, GASGAS); it had revenue of €${n0(KTM.history[4].revenueEurM)} m in 2025 after a restructuring, and €${n0(KTM.h1_2026.revenueEurM)} m in H1 2026. Smaller pieces: a Brazil plant and sales company (~32,000 bikes in CY2025), and an EV and design subsidiary (Bajaj Auto Technology).` },
    { exhibit: { type: 'table', title: 'The businesses, FY26', head: ['Business', 'Volume', 'Revenue (₹ cr)', 'Profit', 'How it is reported'], wide: [4], rows: [
      ['Domestic motorcycles (incl. KTM/Triumph sold in India)', `${n0(FY26.domMc)} (15.6% share)`, 'Pulsar >₹11,000 cr in India', 'n.d.', 'Inside standalone'],
      ['Chetak electric scooters', n0(FY26.chetak), 'n.d.', 'EBITDA positive from Q1FY27', 'Inside standalone; EV 2W+3W ~30% of domestic revenue in Q1FY27'],
      ['Domestic three-wheelers (ICE + electric)', n0(A26.dom3w), 'n.d.', 'n.d.', 'Inside standalone; ICE share 73.8%, e-3W 33.5%'],
      ['Exports (2W + 3W)', n0(A26.exp2w + A26.exp3w), `${n0(FY26.exportRevCr)} ($${n0(FY26.exportUsdM)} m)`, 'n.d.', 'Inside standalone'],
      ['Other operating revenue (PLI, export incentives, royalty)', '–', n0(FY26.otherOpRev.total), 'Mostly profit', 'Inside standalone (AR note 23)'],
      { hl: true, cells: ['**Bajaj Auto standalone**', `**${n0(A26.units)}**`, `**${n0(A26.saRev)}**`, `**EBITDA ${n0(A26.saEbitda)} (${n1(A26.saMarginPct)}%)**`, 'Listed company'] },
      ['Bajaj Auto Credit (100%)', `AUM ~₹${n0(BACL.fy26.aumCr)} cr`, n0(BACL.fy26.income), `PAT ${n0(BACL.fy26.pat)}`, 'Consolidated; "Financing" segment'],
      ['KTM via Bajaj Mobility AG (74.94%)', 'n.a. (6 weeks)', n0(FY26.ktmRevenue6wk), `Loss before tax ${n0(FY26.ktmLossBeforeTax6wk)}`, 'Consolidated from 18-Nov-2025, one quarter in arrears'],
      { hl: true, cells: ['**Group (consolidated)**', '', `**${n0(A26.consRev)}**`, `**Attributable PAT ${n0(FY26.consPatAttrib)}**`, 'Segments: automotive, financing, investments'] },
    ], source: 'AR FY26 (MD&A tables, notes 23, 44 and 46); BACL FY26 results; n.d. = not disclosed' } },
    { pair: [
      { type: 'hbar', title: 'Where the volume comes from, FY26', unit: "Units ('000)", x: ['Domestic motorcycles', 'Export 2W', 'Domestic 3W', 'Chetak', 'Export 3W'], series: [{ name: 'Units', values: [FY26.domMc, A26.exp2w, A26.dom3w, FY26.chetak, A26.exp3w].map(v => Math.round(v / 1000)), fmt: 'num' }], labels: 'all', source: 'AR FY26, sales releases' },
      { type: 'column', title: 'PLI and other incentives doubled in FY26', unit: 'Standalone other operating revenue, FY26 (₹ crore)', x: ['PLI/PSI', 'Export incentives', 'Royalty', 'Misc. and other'], series: [{ name: '₹ cr', values: [FY26.otherOpRev.pliPsi, FY26.otherOpRev.exportIncentives, FY26.otherOpRev.royalty, FY26.otherOpRev.total - FY26.otherOpRev.pliPsi - FY26.otherOpRev.exportIncentives - FY26.otherOpRev.royalty].map(Math.round), fmt: 'num' }], labels: 'all', source: 'AR FY26 standalone note 23' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From scooters to motorcycles to the world, and now to KTM',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: C.historySrc } },
    { callout: '**Corporate actions and per-share data:** buybacks in FY23 and FY24 and again in July 2026 (up to 46.94 lakh shares at ₹12,000) took the share count from 28.9 cr to ~27.48 cr. Our engine uses the FY26 count (27.95 cr); EPS on the post-buyback count is ~1.7% higher and is what the street quotes. Screener\'s consolidated "Net Profit" is before minorities; we use profit attributable to owners (higher, because minorities share KTM\'s losses). We also move BACL\'s funding cost into EBITDA and the KTM associate result into other income (BAJAJ-AUTO.patch.js). Big one-offs: KTM associate loss ₹915 cr (FY25), ₹1,599 cr of remeasurement and currency-reserve gains (Q4FY26).' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A slow-growing domestic market that is splitting in two, and a booming export market that busts every few years',
  blocks: [
    { p: `India sold ${n0(I.domMc[4][1])} motorcycles in FY26 (+6.6%), the most since FY19 (AR, SIAM data). That is still only ~4% a year of growth over the last decade: a mature, replacement-led market. Inside it the market is K-shaped. Bikes above 150cc grew 20%+ in Q1FY27 while 100-125cc commuters grew in low single digits; the 100cc share of motorcycles has fallen from ~55% to ~46% in 5-7 years (management). Scooters are going electric fast: e-scooters reached ~25% of scooters by Q1FY27. Three-wheelers are going electric even faster: e-autos were 44% of the L5 segment in Q1FY27.` },
    { p: 'Exports are a different world. India ships two- and three-wheelers mainly to Africa, Latin America and South Asia, where demand swings with oil prices, elections and currencies. FY23-24 were a bust (Nigeria\'s naira devaluation and inflation cut Bajaj\'s sales there from ~50,000 a month to under 5,000); FY26 and FY27 so far are a boom (India\'s motorcycle exports +10% in FY26, three-wheeler exports +44%).' },
    { exhibit: { type: 'table', title: 'Forces acting on Bajaj\'s markets (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Bajaj'], wide: [2], rows: I.themes, source: I.src } },
    { pair: [
      { type: 'column', title: 'Domestic motorcycles: back above 13 mn in FY26', unit: 'Domestic motorcycle sales (mn units)', x: I.domMc.map(r => r[0]), series: [{ name: 'Industry', values: I.domMc.map(r => Math.round(r[1] / 1e5) / 10), fmt: 'n1' }], labels: 'all', source: 'AR FY26 Table 1 (SIAM)' },
      { type: 'hbar', title: 'Three-wheelers: Bajaj owns ICE, shares electric', unit: 'Bajaj share of domestic sales, FY26 (%)', x: ['ICE 3W (passenger)', 'ICE 3W (all)', 'CNG 3W', 'Electric 3W (L5)', 'ICE 3W (goods)'], series: [{ name: 'Share', values: [79.1, 73.8, 87.9, 33.5, 52.5], fmt: 'pct' }], labels: 'all', source: 'AR FY26 Table 3 (SIAM, Vahan)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Bajaj captures exports, EVs and premiumisation; it misses the mass market',
  blocks: [
    { verdicts: [
      ['GST cut on bikes up to 350cc (Sep-2025)', 'Partly', `Industry +6.6% in FY26 with a strong H2; Bajaj's domestic motorcycles +0.6% and share down 100 bp.`, 'The cut helped commuters most, where Bajaj is weakest.'],
      ['Premiumisation (150cc+)', 'Yes', 'Pulsar N/NS gaining Vahan share; 125cc+ is 77.5% of its motorcycles; KTM-Triumph 1.30 lakh units.', 'Mix and margin tailwind.'],
      ['Electric scooters', 'Yes', 'Chetak 20.7% share in FY26, +80% in Q1FY27, EBITDA positive; capacity-constrained.', 'New business with no ICE scooter to cannibalise.'],
      ['Electric three-wheelers', 'Yes, with dilution', '#1 in e-3W (33.5%) within three years; e-autos 44% of L5.', 'Growth, but a lower share than its 73.8% in ICE.'],
      ['Emerging-market exports', 'Yes', 'Exports +21% (FY26), +50% (Apr-Aug 2026); ~2x the industry in its top-30 markets.', 'The biggest driver of FY27 earnings, and the most volatile.'],
      ['Weak rupee', 'Yes (temporary)', 'Realised USD/INR 94.4 in Q1FY27 vs 85.6 a year earlier; exports 40-45% of revenue.', 'Reverses if the rupee strengthens.'],
      ['Rural and mass-market recovery', 'No', '100-125cc grew low single digits in Q1FY27; Bajaj cedes share there.', 'Hero, Honda and TVS capture it.'],
      ['Captive financing', 'Yes', 'BACL finances ~40-45% of Bajaj\'s domestic retail; AUM +70%.', 'Supports sales; adds credit risk.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, tailwind, ...require('./BAJAJ-AUTO.part2b') };
