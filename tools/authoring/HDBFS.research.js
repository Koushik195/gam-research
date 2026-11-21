// HDB Financial Services report, part B: cover, story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, franchise and verticals, spread and NIM, asset quality, funding, capital, ROA tree,
// HDFC Bank / BPO / regulation, moat, Q1FY27 and guidance, earnings quality, ownership, governance, forecasts,
// street, valuation, verdict, glossary, statement notes). Shared inputs in HDBFS.ctx.js. As of 30-Sep-2026.
const X = require('./HDBFS.ctx');
const { F, V, C, SG, n0, n1, n2, pc, price, pbMult, bvSep28, PB12, PBL, fwdPb, fwdPbNow, fwdPeNow, trailPb, rating, ST, Q1, mv, P, DR_SYMS, shortName, CONS, secPb12 } = X;
const P2 = require('./HDBFS.part2'), P3 = require('./HDBFS.part3'), P4 = require('./HDBFS.part4'), P5 = require('./HDBFS.part5'), P6 = require('./HDBFS.part6');
const ke = V.ke;

const cover = {
  headline: `HDFC Bank's retail lender: an 8% margin, a 2.3% loss rate and a mid-teens ROE, fairly priced at ~2x forward book. We initiate at ${rating}.`,
  lead: `HDB Financial Services lends ₹1.22 lakh cr to the customers banks find hard to serve: small businesses (38% of loans), truck, equipment and tractor buyers (37%) and consumers buying appliances, cars and two-wheelers (25%), through 1,710 branches and 23.9 mn customers. It also runs a ₹1,224 cr BPO business for its parent, HDFC Bank, which adds only ~2% of profit. The economics are those of a high-yield retail lender: NIM 8.35%, operating costs ~3.8% of loans and loan losses ~2.3% leave an ROA of 2.5% and an ROE of 15% (Q1FY27). The weak spot is growth: loans grew only 11% in FY26 and Q1FY27 while HDB cut back risky products. The street values the stock on **P/B on FY28E book (2.2-2.5x)**. We forecast EPS of ₹${n2(F.eps[0])} / ₹${n2(F.eps[1])} / ₹${n2(F.eps[2])} for FY27-29E and ROE of {{F.roe.0|pct}}-{{F.roe.2|pct}}. Applying **${pbMult.toFixed(1)}x to Sep-28E book of ₹${n0(bvSep28)}** (HDB's own ${PB12.med}x median over the last 12 months, adjusted for the ${pc(secPb12)} move in lender multiples) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}.** Our intrinsic checks are lower (justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}): at ₹${n0(price)} the market prices a long-run ROE of ~{{dcf.impliedRoe|pct0}} against our 15%. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A granular, AAA-funded retail franchise', p: `23.9 mn customers, an average loan of ~₹1.6 lakh, the top 20 borrowers 0.3% of loans, 74% of the book secured. HDFC Bank's name and a AAA rating keep borrowing costs at ~6.9%, so HDB can lend at 14% yields and still earn an 8%+ margin, which management calls "non-negotiable". Q1FY27 delivered record profit (₹785 cr, +38%) and the lowest Stage 3 in a year (2.34%).` },
    { h: 'But the returns swing with the credit cycle', p: `Loan losses were 1.3% of loans in FY24, 2.5% in FY26 and 5.1% in Covid (FY21); ROE ranged from 4.8% to 19.5% in six years. Asset finance (37% of loans) still has 3.6% Stage 3; 26% of the book is unsecured. A weak monsoon or a rate hike (both live risks in Sep-2026) hit exactly these borrowers. We model ${n2(F.creditCost[0])}% loan losses and ROE of {{F.roe.0|pct}}-{{F.roe.2|pct}}.` },
    { h: 'Growth is the missing piece', p: `AUM grew 10.7% in FY26 against ~20% at Bajaj Finance and Cholamandalam. Management aims for nominal GDP + 6-7% (~16-18%) and says asset finance and business loans will turn "over the next few quarters". We model ${F.aumGrowth.map(v => n0(v)).join(' / ')}% for FY27-29E: a recovery, but not the full 18%. EPS grows ~${n0((Math.pow(F.eps[2] / X.eps26, 1 / 3) - 1) * 100)}% a year (FY26-29E).` },
    { h: `Valuation: ${n1(fwdPbNow)}x forward book, down from 3.0x at listing`, p: `The stock listed at ₹835 (2.99x next-year book) and trades at ₹${n0(price)}: ${n1(trailPb)}x trailing and ${n1(fwdPbNow)}x FY28E book, ${n1(fwdPeNow)}x FY28E EPS. That is about fair for a 14-15% ROE at our ${n1(ke)}% cost of equity plus some premium for parentage. Our {{dcf.tp|inr}} is below the street's median ₹${n0(CONS.medianTp)} because our FY28-29E EPS is 6-11% lower: slower growth and a cut to insurance commissions after IRDAI's proposal.` },
  ],
  keyRows: [['AUM (₹ cr)', 'aum', 'num'], ['AUM growth', 'aumGrowth', 'chg'], ['NII (₹ cr)', 'nii', 'num'], ['NIM (on AUM)', 'nim', 'pct'], ['Credit cost (% of AUM)', 'creditCost', 'n2'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['BVPS (₹)', 'bvps', 'n1'], ['ROA (on assets)', 'roa', 'pct'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Parent & regulation', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether asset finance and business loans start growing, as management said, and whether Stage 3 holds in a seasonally weaker quarter.',
    'RBI\'s October policy: most economists polled in late September expected a 25bp repo hike; HDB\'s bank loans (46% of borrowings) reprice up while its vehicle and consumer loans are typically fixed-rate.',
    'IRDAI\'s final rules on loan-linked insurance commissions (comments due by 25-Oct-2026): ₹455 cr of FY26 income (13% of pre-tax profit) is exposed.',
    'The monsoon and El Nino: management\'s main monitorable for truck, tractor and rural borrowers in H2FY27.',
    'HDFC Bank\'s choices: the scope of the BPO contracts and the board-recorded rationale for overlapping products under the RBI\'s Dec-2025 directions.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const QK = C.quarterlyKpis, AK = C.annualKpis, VJ = SG.verticalBook.find(v => v.q === 'Jun-26');
const prodRows = SG.products.rows.map(r => [r[0], r[4]]).sort((a, c) => c[1] - a[1]);
const lend = [...DR_SYMS, 'BAJAJHFL', 'HDBFS'].map(s => P[s]).filter(p => p.pb != null).sort((a, c) => c.pb - a.pb);
const fwdChart = fwdPb.filter((_, i, a) => i % 2 === 0 || i === a.length - 1);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'AUM: flat in Covid, then ₹61,000 cr to ₹1.19 lakh cr', unit: 'AUM at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'AUM', ref: 'fin.aum', scale: 0.001, fmt: 'n1' }], labels: 'all', source: 'Company presentations; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Thirteen products; LAP and truck loans are the two big ones', unit: 'Gross loans, Jun-2026 (₹ \'000 crore)', x: prodRows.map(r => r[0]), series: [{ name: 'Loans', values: prodRows.map(r => Math.round(r[1] / 100) / 10), fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p24' },
    ] },
    { pair: [
      { type: 'line', title: 'NIM up from 7.5% to 8.35% as funding costs fell and yields held', unit: 'Company yield, cost of funds (both on average gross loans) and NIM (%)', x: QK.map(q => q.q), series: [{ name: 'Yield', values: QK.map(q => q.yieldLoansPct), fmt: 'n2' }, { name: 'NIM', values: QK.map(q => q.nimLoansPct), fmt: 'n2' }, { name: 'Cost of funds', values: QK.map(q => q.cofLoansPct), fmt: 'n2' }], labels: 'ends', min: 4, max: 15, source: 'Q4FY26 and Q1FY27 presentations' },
      { type: 'column', title: 'Loan losses: 5.1% in Covid, 1.3% at the low, ~2.3% now', unit: 'Loan losses ÷ average gross loans (%), company; Q1FY27 annualised', x: [...AK.filter(k => k.fy >= 'FY18').map(k => k.fy), 'Q1FY27'], series: [{ name: 'Credit cost', values: [...AK.filter(k => k.fy >= 'FY18').map(k => k.creditCostLoansPct), Q1.creditCostLoans], fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', source: 'Q1FY27 presentation p32, p30' },
    ] },
    { pair: [
      { type: 'line', title: `ROE has been above our ${n1(ke)}% cost of equity in most years, but not by much`, unit: 'Return on average equity (%); red line = our cost of equity', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 22, lines: [{ v: ke, text: `Cost of equity ${n1(ke)}%`, color: '#b4232a' }], source: 'Screener.in; GAM estimates' },
      { type: 'hbar', title: 'On book, HDB sits in the middle of listed lenders', unit: `Trailing P/B at the ${X.ASOF_TXT} close (x); ROE FY26 in brackets`, x: lend.map(p => `${shortName(p.symbol)} (${n0(p.roe)}%)`), series: [{ name: 'P/B', values: lend.map(p => Math.round(p.pb * 100) / 100), fmt: 'x' }], labels: 'all', highlight: `HDB Financial (${n0(P.HDBFS.roe)}%)`, source: 'Screener.in (P/B scaled to the NSE close), GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/B: 3.0x at listing, ${n1(fwdPbNow)}x now`, unit: `Price ÷ next full-year book value per share (x); orange line = our ${pbMult.toFixed(1)}x`, x: fwdChart.map(x => x[0]), series: [{ name: 'Forward P/B', values: fwdChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, lines: [{ v: PBL.med, text: `Median since listing: ${n1(PBL.med)}x` }, { v: pbMult, text: '', color: '#cf8f1f' }], source: 'Screener.in weekly prices (every other week shown), NSE close 30-Sep-2026; book value per share; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (targets standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker.replace(/ \(unnamed; Overweight\)/, ' (Overweight)').replace(' Securities', '')), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press reports (Aug-2025 to Aug-2026; see the street table), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.franchise, P3.verticals, P3.spread, P3.quality, P4.funding, P4.capital, P4.roaTree, p.financials, P4.parent, P4.moat, P4.guidance, P4.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
