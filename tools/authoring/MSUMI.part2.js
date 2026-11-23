// Motherson Sumi Wiring India report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./MSUMI.ctx');
const { C, D, SA, SQ, n0, n1, cust1, cust2 } = X;
const I = D.industry, MX = C.profile.mixFY26, PL = C.profile.plants;

const business = {
  id: 'business', nav: 'What MSWIL does', kicker: 'The business', title: 'One product, one country: wiring harnesses for Indian vehicles, 64% for cars',
  blocks: [
    { p: `A wiring harness is the bundle of wires, terminals, connectors, junction boxes, tubes and clips that carries power and signals to every electrical part of a vehicle. Each one is designed for a single model and assembled largely by hand, which makes the business labour-intensive (staff cost is 16-17% of revenue), and MSWIL places its plants next to its customers\' factories. MSWIL makes them for Indian vehicle makers only (exports are negligible) in ${PL.count} plants across ${PL.states}, with ${n0(PL.employeesPermanent)} permanent employees and ~${n0(PL.associates)} associates on the shop floor (60,000+ people including contract labour, per the company). By vehicle, FY26 revenue was ${MX.pv}% passenger vehicles (${MX.fy25Pv}% in FY25), ${MX.cv}% commercial vehicles, ${MX.twoWheeler}% two-wheelers, ${MX.offRoadAgri}% tractors and off-road machines and ${MX.others}% other (mostly components). EV programmes were ${C.profile.evShare.fy26}% of FY26 revenue and ${C.profile.evShare.q1fy27}% in Q1FY27. It supplies 9 of India\'s 10 best-selling car models; the exception (Hyundai and Kia) is served by a different SAMIL joint venture.` },
    { exhibit: { type: 'table', title: 'MSWIL at a glance, FY26', head: ['Item', 'FY26', 'Comment'], wide: [2], rows: [
      ['Revenue', '₹11,478 cr (+23%)', 'Crossed ₹10,000 cr for the first time; ~₹1,040 cr from the new greenfield plants'],
      ['EBITDA', '₹1,061 cr (9.2%)', '11.4% excluding ₹127 cr of greenfield start-up losses'],
      ['Net profit / EPS', '₹625 cr / ₹0.94', '+3%: copper lag and start-up costs absorbed the revenue growth'],
      ['Largest customer', `${Math.round(cust1)}% of revenue`, 'Not named; Maruti Suzuki per Emkay. Second customer ' + Math.round(cust2) + '% (12% in FY25)'],
      ['Purchases from JV partners', '₹5,243 cr', `~${Math.round(X.rpPurchPct)}% of raw-material purchases (SAMIL ₹4,440 cr, Sumitomo ₹826 cr)`],
      ['Fees to JV partners', `₹${n0(X.feesFy26)} cr`, `Royalty ₹61 cr (SWS), management fee ₹61 cr and support services ₹151 cr (SAMIL): ${n1(X.feesPct)}% of revenue`],
      ['ROCE (Screener)', '39%', '48% in FY24; capital-light assembly'],
    ], source: 'AR FY26 (MD&A, notes 26, 31, 34; AGM notice); Q4FY26 presentation' } },
    { pair: [
      { type: 'hbar', title: 'Cars are 64% of revenue', unit: 'Share of FY26 revenue (%)', x: ['Passenger vehicles', 'Two-wheelers', 'Commercial vehicles', 'Others', 'Off-road and tractors'], series: [{ name: 'FY26', values: [MX.pv, MX.twoWheeler, MX.cv, MX.others, MX.offRoadAgri], fmt: 'pct0' }], labels: 'all', source: 'Q4FY26 presentation p6' },
      { type: 'column', title: 'Customer 1 bought 41% of FY26 output; Customer 2 16%', unit: 'Share of revenue (%)', x: ['Customer 1 FY25', 'Customer 1 FY26', 'Customer 2 FY25', 'Customer 2 FY26'], series: [{ name: 'Share', values: [39.1, Math.round(cust1 * 10) / 10, 12.3, Math.round(cust2 * 10) / 10], fmt: 'pct' }], labels: 'all', source: 'AR FY26 note 34 (customers with 10% or more of revenue; not named)' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Carved out of Motherson in 2022 to keep the Sumitomo partnership in India; two bonus issues since',
  blocks: [
    { p: 'Wiring harnesses are where the Motherson group began: Motherson Sumi Systems (MSSL) was formed with Sumitomo Wiring Systems in 1986, and the domestic harness business stayed its core as MSSL grew into a global supplier of mirrors, bumpers and modules. In 2021-22 the group reorganised. The domestic wiring-harness business (DWH) was moved into a new company, MSWIL, with an appointed date of 1-Apr-2021, and every MSSL shareholder received one MSWIL share for each MSSL share (19-Jan-2022). MSWIL listed on 28-Mar-2022. The result: Sumitomo keeps 25% of the Indian harness business directly, and SAMIL keeps 33%. Since then the share count has risen only through bonus issues (2:5 in Nov-2022, 1:2 in Jul-2025), so per-share figures are comparable once adjusted; no new money has been raised.' },
    { exhibit: { type: 'table', title: 'Milestones and corporate actions', head: ['When', 'What'], wide: [1], rows: C.history, source: C.historySrc } },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'Action', 'Impact'], wide: [1, 2], rows: [
      ['FY22', 'Demerger and listing', 'FY22 is MSWIL\'s first year; ₹65 cr (₹46 cr after tax) exceptional charge for its share of the costs of the reorganisation scheme; a ₹33.5 cr management fee to SAMIL from the appointed date'],
      ['Nov-2022', 'Bonus 2:5', 'Shares 315.8 cr → 442.1 cr; EPS restated (Screener shows all years on today\'s 663.2 cr shares)'],
      ['Jul-2025', 'Bonus 1:2', 'Shares 442.1 cr → 663.2 cr; the stock price fell by a third on the ex-date, value unchanged'],
      ['Feb-2026', 'ESOP 2025 (up to 1.55 cr options)', 'Shares bought in the market through a trust: no dilution, but a cash cost and a P&L charge'],
      ['FY25-27', 'Greenfield plants (Kharkhoda, Navagam, Pune; Pathredi and Chennai)', 'Start-up losses ₹122 cr (FY25) and ₹127 cr (FY26); ~₹450 cr of quarterly revenue by Q1FY27'],
    ], source: 'AR FY22, AR FY23, AR FY26 notes 11 and 46; Q4FY26 presentation' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: `Indian car production +${I.fy26PvProdGrowthPct}% in FY26 and a GST-led jump in Q1FY27; content per car keeps rising`,
  blocks: [
    { p: `India produced ${I.fy26PvProdMn} mn passenger vehicles in FY26 (+${I.fy26PvProdGrowthPct}% from ${I.fy25PvProdMn} mn) and ${I.fy26CvProdMn} mn commercial vehicles (+${I.fy26CvProdGrowthPct}%), per the annual report. Lower GST rates on cars from September 2025 lifted the second half, and industry passenger-vehicle volumes rose ${I.q1fy27PvIndustryGrowthPct}% in Q1FY27. From Q3FY27 the comparison base includes the GST boost, so volume growth should slow. Harness value grows faster than volumes: SUVs keep taking share, every new model carries more electronics (screens, cameras, sensors, connected features), and electric and hybrid cars need high-voltage harnesses on top of the low-voltage ones. Copper is the swing factor: it makes up 24-28% of MSWIL\'s cost of goods (CFO, Q4 call) and averaged ₹1,348/kg in Q1FY27, 53% above a year earlier.` },
    { exhibit: { type: 'table', title: 'What drives harness demand beyond vehicle volumes', head: ['Driver', 'Evidence (to Aug-2026)', 'What it means for MSWIL'], wide: [1, 2], rows: I.drivers, source: I.src + '; Q1FY27 call; JM Financial (28-Apr-2026)' } },
    { callout: '**Our read:** demand is strong and content growth is structural, but MSWIL captures it as revenue more easily than as profit. The harness is an assembly business with pass-through raw materials: when copper or connectors get dearer, revenue rises and the margin percentage falls. The long-term threat, simpler zonal architectures that cut harness length, is real abroad but not yet visible in India.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach the company?', title: 'Tailwind test: yes, with room to spare; it reaches revenue faster than profit',
  blocks: [
    { exhibit: { type: 'table', title: 'MSWIL growth vs its market', head: ['Period', 'Market growth', 'MSWIL growth', 'Outperformance'], rows: [
      ['FY26', `PV production +${I.fy26PvProdGrowthPct}%; CV +${I.fy26CvProdGrowthPct}%`, 'Revenue +23.2%; existing plants +15%', '~+6 to +14 points'],
      ['Q4FY26', `PV industry +${I.q4fy26PvIndustryGrowthPct}%`, 'Revenue +32.9% (~+28% ex copper); existing plants +21%', '~+17 points ex copper'],
      ['Q1FY27', `PV industry +${I.q1fy27PvIndustryGrowthPct}%`, 'Revenue +36.6% (~+30% ex copper); existing plants +26%', '~+13 points ex copper'],
      ['FY26 profit', 'Volumes up ~9-13%', 'EBITDA +6%; net profit +3%', 'Negative: margins absorbed the growth'],
    ], source: 'AR FY26; Q4FY26 and Q1FY27 presentations and calls; Emkay Exhibit 4 (existing plants)' } },
    { bullets: [
      '**Volumes and content reach MSWIL in full.** Existing plants alone grew 15% in FY26 and 26% in Q1FY27, ahead of car production; Emkay shows MSWIL outgrowing Maruti Suzuki\'s volumes in every quarter.',
      '**Part of the growth is copper.** About 5 points of Q4FY26 growth and 7 points of Q1FY27 growth were higher copper prices passed on at cost.',
      '**Profit did not follow.** FY26 EBITDA rose 6% on 23% more revenue. The tailwind reaches MSWIL\'s top line; whether it reaches shareholders depends on copper resets, wage recovery and the greenfields turning profitable.',
    ] },
  ],
};

module.exports = { business, history, industry, tailwind };
