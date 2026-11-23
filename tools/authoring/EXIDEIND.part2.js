// Exide report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./EXIDEIND.ctx');
const { C, D, SA, n0, BL, LINES, LN, Q1 } = X;
const I = D.industry, A26 = SA.find(a => a.fy === 'FY26'), share = (x, t) => Math.round(x / t * 100) + '%';
const WHAT = { autoDomestic: 'Car, two- and three-wheeler and commercial-vehicle batteries for OEMs (75+ customers) and the replacement market (doorstep Batmobile service)', homeUps: 'Inverter and home-UPS batteries; seasonal (summer), 15-25% of revenue by quarter', solar: 'Batteries for rooftop and off-grid solar; >₹400 cr in Q1FY27 alone', exports: 'Automotive, traction and UPS batteries to 70+ countries; down from ~8% to ~5% of revenue', industrialDomestic: 'Industrial UPS and data centres, railways, traction (forklifts), power and solar projects, telecom (shrinking), submarine batteries' };

const business = {
  id: 'business', nav: 'What Exide does', kicker: 'The business', title: 'India\'s battery for everything: cars, inverters, railways and submarines, sold through 120,000 outlets',
  blocks: [
    { p: `Exide Industries (Kolkata, founded 1947, listed 1979) makes lead-acid batteries from 2.5 Ah to 20,200 Ah in 11 plants, buys most of its lead from three recycling plants of its subsidiary Chloride Metals, and sells through 120,000+ touchpoints. About half of revenue is automotive (OEM and replacement) and half non-auto (inverters, solar, industrial); ~65-70% goes through the trade (B2C) channel. It reports one segment. The standalone company is the lead-acid business; two subsidiaries matter: **Exide Energy Solutions (EESL)**, a lithium-ion cell and pack maker building a 12 GWh plant in Bengaluru (6 GWh in phase 1), and **Chloride Metals**, the lead recycler (₹6,036 cr revenue, a ₹14 cr loss in FY26). It also holds **8.70 cr HDFC Life shares** (~4%), received when it sold Exide Life Insurance in 2022.` },
    { exhibit: { type: 'table', title: 'The business lines, FY26 (₹ crore, GAM split from management\'s figures)', head: ['Line', 'Revenue', 'Share', 'What it sells'], wide: [3], rows: [
      ...LINES.map(k => [`**${LN[k]}**`, n0(BL.base[k]), share(BL.base[k], X.base26), WHAT[k]]),
      { hl: true, cells: ['**Total (standalone)**', `**${n0(X.base26)}**`, '100%', 'Reported revenue from operations ₹17,268.9 cr (AR FY26)'] },
    ], source: A26.linesSrc } },
    { pair: [
      { type: 'column', title: 'Institutional sales are only a quarter of revenue', unit: 'FY26 revenue by customer type (₹ crore)', x: ['Non-institutional (trade, replacement)', 'Institutional (OEMs, projects)'], series: [{ name: 'Revenue', values: [13000, 4241], fmt: 'num' }], labels: 'all', source: 'AR FY26 note 25' },
      { type: 'column', title: 'Exports: ₹1,342 cr in FY25, ₹915 cr in FY26', unit: 'Sales outside India (₹ crore)', x: ['FY25', 'FY26'], series: [{ name: 'Exports', values: [1342, 915], fmt: 'num' }], labels: 'all', source: 'AR FY26 note 25 (geography). Q1FY27: +20%+ after five quarters of decline.' },
    ] },
    { exhibit: { type: 'table', title: 'The group around the lead-acid business', head: ['Entity', 'Stake', 'What it does', 'How it shows up in our valuation'], wide: [2, 3], rows: [
      ['Exide Industries (standalone)', '–', 'Lead-acid batteries; FY26 revenue ₹17,269 cr, PAT ₹1,111 cr', 'Core: P/E on Sep-28E standalone EPS'],
      ['Exide Energy Solutions (EESL)', '100%', 'Lithium-ion cells (NMC cylindrical, LFP prismatic) and packs; FY26 revenue ₹158 cr, loss ₹248 cr', 'Book equity less PV of losses to breakeven'],
      ['Chloride Metals', '100%', 'Lead recycling (3 plants); FY26 revenue ₹6,036 cr, loss ₹14 cr', 'At book with other investments'],
      ['HDFC Life Insurance', '~4.0% (8.70 cr shares)', 'Listed life insurer; received for Exide Life in Jan-2022', 'Market value less 20%'],
      ['Others', 'various', 'Associated Battery Manufacturers (Ceylon) 61.5%, small overseas subsidiaries, solar-power associates, Faering fund', 'At book'],
    ], source: 'AR FY26 Form AOC-1 and note 4' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Seventy-nine years of batteries, one big sale (Exide Life) and one big bet (lithium-ion cells)',
  blocks: [
    { p: 'Exide\'s promoter is Chloride Eastern Ltd (UK), its holding company by de facto control, with 45.99%. Until 2021 it was a lead-acid maker with a life-insurance subsidiary (Exide Life). Two decisions in 2021-22 reshaped it. It sold Exide Life to HDFC Life (completed 1-Jan-2022) for ₹726 cr of cash and 8.70 cr HDFC Life shares then worth ₹5,653 cr, and it set up EESL (incorporated 24-Mar-2022) to make lithium-ion cells. In effect, the insurance money has been recycled into the cell plant: ₹4,902 cr of equity by Jul-2026, roughly what the HDFC Life shares were worth at receipt.' },
    { exhibit: { type: 'table', title: 'Milestones and corporate actions', head: ['When', 'What'], wide: [1], rows: C.history, source: C.historySrc } },
    { exhibit: { type: 'table', title: 'Actions and what they did to the numbers', head: ['When', 'Action', 'Impact'], wide: [1, 2], rows: [
      ['FY22', 'Exide Life sold to HDFC Life', 'Standalone exceptional gain ₹4,694 cr (EPS ₹55 vs ~₹10 before it); ₹726 cr cash; HDFC Life stake now moves through other comprehensive income (−₹834 cr in FY26)'],
      ['FY23-FY27', 'Equity into EESL: ₹715 / 1,587 / 1,000 / 1,500 cr, then ₹1,400 cr approved', 'Uses most of the free cash flow; consolidated profit runs ₹170-280 cr a year below standalone (FY24-26)'],
      ['FY25', '\'One Exide\' operating model', 'Single go-to-market across business units; management credits it for FY26 cost control'],
      ['Q2FY26', 'GST cut announced mid-Aug-2025, effective 22-Sep-2025', 'Six to eight weeks of near-zero channel offtake: Q2FY26 revenue −2%, margin 9.5%; then OEM demand +25%'],
      ['Q4FY26', 'Labour-code exceptional charge', '₹9 cr pre-tax; FY26 PAT ₹1,111 cr'],
    ], source: 'AR FY23 notes 52/54; AR FY26; Q4FY26 call' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A two-player lead-acid market enjoying a post-GST car boom while lithium takes the edges',
  blocks: [
    { p: `${I.structure} ${I.demand}` },
    { exhibit: { type: 'table', title: 'What drives the battery market', head: ['Driver', 'Evidence (to Aug-2026)', 'What it means for Exide'], wide: [1, 2], rows: [
      ['Vehicle sales and the replacement cycle', 'Auto OEM +25% YoY for three quarters after the GST cut; PV production ~1.2 mn to ~1.4 mn a quarter (CEO)', 'OEM batteries now, replacement batteries in 2.5-3 years: Exide is adding 4W capacity by debottlenecking'],
      ['Power back-up and solar', 'Home UPS ~₹2,300 cr; solar >₹1,000 cr in FY26 and >₹400 cr in Q1FY27; PM Surya Ghar rooftop scheme; 500 GW renewables target by 2030', 'Seasonal but growing; solar is the fastest-growing line'],
      ['Industrial capex', 'Railways, traction, industrial UPS and data centres growing double digits; government tenders soft in Q1FY27, expected to recover in H2', 'Industrial ex-telecom is a steady grower'],
      ['Lithium substitution', `Telecom (~2-3% of revenue) and e-rickshaws moving to lithium; ${I.threat.split('; ')[0].replace(/\.$/, '')}`, 'Erodes lead-acid at the edges now; the reason for EESL'],
      ['Input costs', I.costs, 'Margins depend on how fast price increases follow costs'],
    ], source: I.src } },
    { callout: '**Our read:** the lead-acid market is in a good phase (OEM boom feeding a future replacement wave, inverters and solar strong), but it is a mature, cost-pass-through market with one strong rival. Lithium is not a near-term threat to car starter batteries (12V lead-acid starter batteries remain standard in petrol and diesel vehicles), but it is already taking telecom, e-rickshaw and parts of stationary storage.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Tailwind test: yes for volumes, only partly for margins',
  blocks: [
    { exhibit: { type: 'table', title: 'Exide\'s growth vs the market signals', head: ['Period', 'Market signal', 'Exide (standalone)', 'Verdict'], rows: [
      ['FY21-26', 'Auto, power back-up, industrial demand', `Revenue +${X.salesCagrHist.toFixed(1)}% a year; EBITDA margin from 13.5% to 11.3%`, 'Volume yes, margin no'],
      ['FY26', 'GST cut boosts OEMs from Oct-2025; Q2 channel washout', 'Revenue +4.1%; domestic +7.5%; exports and telecom down', 'Muted by the washout and exports'],
      ['Q1FY27', 'OEM boom continues; hot summer', `Revenue +${Q1.revenueGrowth}%; EBITDA +${Q1.ebitdaGrowth}%; margin ${Q1.ebitdaMargin}%`, 'Reaches the company'],
      ['Q1FY27 volumes', '4W OEM, 2W OEM, 4W replacement', '+21%, +20%, +10% (CEO)', 'Exide keeps its OEM share'],
    ], source: 'Q4FY26 and Q1FY27 calls; Screener.in' } },
    { bullets: [
      '**The tailwind reaches Exide\'s volumes.** It is the largest OEM supplier, so the post-GST production jump shows up at once, and the bigger car parc feeds replacement demand later.',
      '**It reaches margins only partly.** Lead is priced at import parity and the rupee is weak; sulphur rose about five-fold in FY26. Exide raises prices in steps (5-6% from January to March 2026, ~3% in April, +4-6% YoY in Q1FY27), and Q1FY27 margin was 12.4%, but FY22-26 margins never got back to the 13-15% of the decade before.',
      '**The lithium transition cuts against it at the edges.** Telecom and e-rickshaw batteries, exports to markets moving to lithium, and future EV packs are where lead-acid loses; that is the business EESL is meant to win back.',
    ] },
  ],
};

module.exports = { business, history, industry, tailwind };
