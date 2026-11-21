// L&T Finance report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, franchise and AUM mix, rural and urban chapters, gold/SME/wholesale run-off, spread and NIM, asset quality,
// funding, capital, ROA tree, moat, Q1FY27 and guidance, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in LTF.ctx.js. Forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./LTF.ctx');
const { F, V, C, SG, n0, n1, pc, pc1, price, pbMult, bvSep28, PBR, PB21, fwdPbChart, fwdPbNow, rating, ST, Q1, mv, distPctPbt, distInc, sectorPbDr, QN, feeCutEps28, px18Sep, unsec } = X;
const P2 = require('./LTF.part2'), P3 = require('./LTF.part3'), P4 = require('./LTF.part4'), P5 = require('./LTF.part5'), P6 = require('./LTF.part6');

const cover = {
  headline: 'A rebuilt retail lender already priced for its 2031 targets, and the NBFC most exposed to IRDAI\'s commission caps',
  lead: `L&T Finance (LTF), two-thirds owned by Larsen & Toubro, has turned itself from a wholesale-heavy lender into a 98% retail one in four years: rural group loans, farm equipment, two-wheelers, personal loans, home loans and LAP, SME and, since Jun-2025, gold loans. Q1FY27 was its best quarter yet (book +27%, profit +29% to ₹902 cr, credit cost 2.54%, ROE 12.71%), but ROE is still below a ~13% cost of equity, and ~26% of FY26 pre-tax profit came from selling insurance, which IRDAI proposed on 23-Sep to cap. The street values LTF on **P/B (2.7x FY28E book)**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E and ROE of 13-15%, including a haircut for the IRDAI proposal. Applying **${pbMult}x to Sep-28E book of ₹${n0(bvSep28)}** (LTF's own ${PBR.med}x median since it became a retail lender in 2024, adjusted for the sector's ${pc1(sectorPbDr)} move) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Every cross-check is below the price (P/E ₹${n0(mv('pe').value)}, justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}); at ₹${n0(price)} the market already assumes a ~{{dcf.impliedRoe|pct0}} ROE for ever. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The repair is done; the returns are not', p: `Retail is 98% of the book (51% in FY22), the wholesale loans are down to ₹2,098 cr, and NIM plus fees is a steady 10.3-10.5% of the book. But ROE was 11.25% in FY26 and 12.71% in Q1FY27, and LTF missed its own Lakshya 2026 ROA goal (2.8-3.0%; 2.40% delivered). The new goal, ROE of 16-18% by FY31, needs credit costs below 2%, against 2.45-3.44% in every year from FY22 to FY26. We model ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}}.` },
    { h: 'Growth is fast and broad, but leans on the riskiest products', p: `Book growth of 27% in Q1 came from personal loans (+80%), gold (+182%), micro-LAP (+169%), LAP (+38%) and SME (+28%); microfinance resumed growing (+18%). Unsecured loans (microfinance, personal and SME) are ~${n0(unsec(QN))}% of the book. Project Cyclops, LTF's in-house underwriting engine, has a two-year record only in two-wheelers. We take 24% AUM growth for FY27E (guidance "over 20%") and keep credit cost above the guided path.` },
    { h: 'IRDAI: the most exposed listed NBFC', p: `Insurance distribution income was ₹${n0(distInc)} cr in FY26, ${n0(distPctPbt)}% of pre-tax profit, most of it credit-life cover sold with microfinance and other loans. IRDAI's paper proposes a 2% cap on credit-life commission (28% today) and a ban on compulsory bundling; IIFL puts LTF's hit at 12% of PBT even after mitigation. We cut fee income by 0.30% of the book from FY28E (~₹${n1(feeCutEps28)} of EPS); the bear case loses most of it. The stock fell from ₹${n0(px18Sep)} to ₹${n0(price)} in the last two weeks of September.` },
    { h: 'Valuation: you pay today for the 2031 plan', p: `At ₹${n0(price)} LTF trades at ${n1(fwdPbNow)}x our FY28E book and ${n1(price / F.eps[1])}x FY28E EPS, above its ${PBR.med}x median forward P/B since Apr-2024 (and ${PB21.med}x since 2021), for an ROE that only reaches the cost of equity in FY28E on our numbers. Our ${pbMult}x Sep-28E book gives {{dcf.tp|inr}} ({{dcf.upside|chg}}). The street's 2.7x FY28E book assumes ROE heads to 16-18% and that IRDAI does not bite.` },
  ],
  keyRows: [['Loan book (₹ cr)', 'aum', 'num'], ['AUM growth', 'aumGrowth', 'chg'], ['NII (₹ cr)', 'nii', 'num'], ['NIM (on AUM)', 'nim', 'pct'], ['Credit cost', 'creditCost', 'pct'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['BVPS (₹)', 'bvps', 'n1'], ['ROA (on assets)', 'roa', 'pct'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Regulation', v: 'RED' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): is credit cost on the path to 2.0-2.2% by Q4FY27, and does personal-loan quality hold after +80% growth?',
    'IRDAI\'s insurance-distribution reforms: consultation paper of 23-Sep-2026, comments due 25-Oct-2026; a 2% credit-life cap would remove most of LTF\'s ₹1,047 cr of distribution income.',
    'RBI\'s October 2026 policy: most economists polled expected a 25bp repo hike; the CFO budgets FY27 WACB at 7.35-7.40% (Q1 7.20%).',
    'Monsoon and El Niño: rural books (microfinance, tractors, 39% of the book) are the first place a weak kharif would show; LTF says reservoirs are adequate.',
    'The Q4FY27 test: management has committed to an ROA of at least 2.8% in Q4FY27 (2.48% in Q1).',
    'Security-receipt resolutions (₹4,808 cr net): recoveries go to provisions, not profit, but would free capital and remove a ~20bp ROA drag.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const AK = C.annualKpis, QK = C.quarterlyKpis;
const mixKeys = SG.lines.map(l => l.key), mixName = Object.fromEntries(SG.lines.map(l => [l.key, l.name]));
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'From 36% retail to 98% retail in seven years', unit: 'Book at March (₹ \'000 crore); Q1FY27 = Jun-2026', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [
        { name: 'Retail', values: [...AK.map(k => Math.round(k.retailBook / 100) / 10), Math.round(Q1.retailBook / 100) / 10], fmt: 'n1' },
        { name: 'Wholesale (infra, real estate)', values: [...AK.map(k => Math.round(k.wholesaleBook / 100) / 10), Math.round((Q1.book - Q1.retailBook) / 100) / 10], fmt: 'n1' },
      ], minLabel: 8, source: 'Company presentations Q4FY20-Q1FY27' },
      { type: 'hbar', title: 'Rural group loans, home loans and farm are half the book', unit: 'Share of book, Jun-2026 (%)', x: mixKeys.map(k => mixName[k]), series: [{ name: 'Share', values: mixKeys.map(k => Math.round(QN[k] / QN.total * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p48' },
    ] },
    { pair: [
      { type: 'column', title: 'Book: shrank to FY23, now growing ~25% a year', unit: 'Consolidated book at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'Book', ref: 'fin.aum', scale: 0.001, fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates FY27-29E' },
      { type: 'column', title: 'Credit cost: 3.8% at the microfinance peak, 2.54% now; target 2.0-2.2% by Q4FY27', unit: 'Credit cost before macro-prudential releases (% of average book, company basis), quarterly; dashed line = Q4FY27 target (2.0-2.2%)', x: QK.map(k => k.q), series: [{ name: 'Credit cost', values: QK.map(k => k.creditCostCo), fmt: 'n2' }], labels: 'all', highlight: 'Q1FY27', lines: [{ v: 2.1, text: '' }], source: 'Q1FY27 presentation p46' },
    ] },
    { pair: [
      { type: 'line', title: 'NIM nearly 9% of AUM as retail replaced wholesale', unit: '% of average AUM (yield, NIM) or borrowings (cost), our basis', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Yield on AUM', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }, { name: 'NIM', ref: 'fin.nim', fmt: 'pct' }], labels: 'ends', min: 4, max: 17, source: 'Annual reports, Screener.in; GAM estimates' },
      { type: 'line', title: 'ROE climbs, but only reaches ~15% by FY29E', unit: 'ROE and ROA on total assets (%)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'ROA', ref: 'fin.roa', fmt: 'pct' }], labels: 'ends', min: 0, max: 20, source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/B: ${n1(fwdPbNow)}x now vs ${PBR.med}x median since Apr-2024`, unit: `Price ÷ next full-year book value per share (x); orange line = our ${pbMult.toFixed(1)}x`, x: fwdPbChart.map(x => x[0]), series: [{ name: 'Forward P/B', values: fwdPbChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, min: 0, lines: [{ v: PBR.med, text: `Retail-era median: ${PBR.med}x` }, { v: pbMult, text: '', color: '#cf8f1f' }], source: 'Screener.in prices; book value per share; GAM estimates FY27-28E; last point = 30-Sep-2026 close' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press (12-Jul to 23-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.franchise, P3.rural, P3.urban, P3.newbiz, P3.spread, P3.quality, P4.funding, P4.capital, P4.roaTree, p.financials, P4.moat, P4.guidance, P4.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
