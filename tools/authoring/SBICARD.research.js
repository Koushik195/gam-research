// SBI Cards report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, franchise and spends, fee engine, spread and NIM, asset quality, funding, capital, ROA tree,
// moat, Q1FY27 and guidance, earnings quality, ownership, governance, forecasts, street, valuation, verdict,
// glossary, statement notes). Shared inputs in SBICARD.ctx.js. Forecast and valuation figures are live
// tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./SBICARD.ctx');
const { F, V, A, C, SG, AK, n0, n1, pc, price, peMult, epsSep28, PEN24, PE21, fwdPeNow, pe27, rating, ST, Q1, mv, fwdPeN, fwdPe, sectorPeDr, tpLo, tpHi } = X;
const P2 = require('./SBICARD.part2'), P3 = require('./SBICARD.part3'), P4 = require('./SBICARD.part4'), P5 = require('./SBICARD.part5'), P6 = require('./SBICARD.part6');

const cover = {
  headline: 'India\'s No. 2 card issuer is past the worst of its credit cycle and trades at 16x next year\'s earnings; the catch is that growth has stalled and fundamentals alone do not support the price',
  lead: `SBI Card has 2.26 crore cards in force (18.6% of India's) and 19.5% of card spends. Two years of heavy loan losses (gross credit cost 9.1% of receivables in FY25, 8.8% in FY26 on our basis) cut profit 20% and halved ROE to ~15%. Q1FY27 showed the turn: credit cost 6.5%, profit +20%, ROE 16.5%. But receivables grew only 3% and pre-provision profit fell 12%. The street values the stock on **P/E (18-22x FY28E EPS)**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E and ROE of ~17%. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** (derived from its own credit-cycle-adjusted history, the post-FY24 growth regime and the sector's de-rating) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Be clear about what that assumes: the market pays ~21x again for a 17% ROE business. Our intrinsic checks (justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}) sit below today's price. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The credit cycle has turned, and it drives FY27-28', p: `Gross credit cost fell from 9.5% in Q1FY26 to 6.5% in Q1FY27; GNPA 2.04% and Stage 2 3.57% are post-COVID lows; entry into the first delinquency bucket is at a "decadal low" (management). At {{F.creditCost.0|pct}} of receivables in FY27E, profit grows {{F.patGrowth.0|pct}} even with flat pre-provision profit. Each 10bp of credit cost is ~${n1(X.cc10)}% of FY28E profit.` },
    { h: 'A franchise SBI built and keeps feeding', p: `Nearly half of new cards come through SBI's branches (47% in Q1FY27), the cheapest and best-quality channel any Indian issuer has; co-brands (BPCL, Flipkart, Tata Neu, IndiGo, PhonePe) bring the rest. New accounts are back above 10 lakh a quarter (+17%). SBI also lends it ₹19,900 cr (45% of borrowings) and owns 68.6%.` },
    { h: 'But growth has stalled and income quality has slipped', p: `Receivables grew 2% in FY26 and 3% in Q1; revolvers (the most profitable balances) fell to 22% of the book; spend growth comes from thin-margin corporate cards. NIM fell 28bp in Q1 to 10.8% and cost-to-income rose to 58.7%. We model receivables +{{F.aumGrowth.0|pct0}} / +{{F.aumGrowth.1|pct0}} / +{{F.aumGrowth.2|pct0}}: below the 22% CAGR of FY19-24 and dependent on the H2 pick-up management promised.` },
    { h: 'Valuation: cheap on its history, full on fundamentals', p: `At ₹${n0(price)} the stock trades at ${n1(pe27)}x FY27E and ${n1(fwdPeNow)}x FY28E EPS, the lowest forward multiple since listing; its credit-cycle-adjusted forward P/E has a ${PEN24.med}x median since Apr-2024 and listed lenders trade ${Math.abs(Math.round(sectorPeDr))}% below their own medians. Our ${peMult}x gives {{dcf.tp|inr}}. At a 13.1% cost of equity the price already implies a ~{{dcf.impliedRoe|pct0}} long-run ROE, above the 16-18% that management's 4-4.5% ROA target supports.` },
  ],
  keyRows: [['Receivables (₹ cr)', 'aum', 'num'], ['Receivables growth', 'aumGrowth', 'chg'], ['Total income (₹ cr)', 'sales', 'num'], ['NIM', 'nim', 'pct'], ['Credit cost', 'creditCost', 'pct'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['BVPS (₹)', 'bvps', 'n1'], ['ROA (on assets)', 'roa', 'pct'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Growth', v: 'RED' },
    { k: 'Regulation', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether the promised H2 receivables pick-up starts and credit cost holds near 6.5%.',
    'Festive quarter (Q3FY27): spends, EMI conversion and acquisition costs; cost-to-income guided to peak in this quarter.',
    'RBI: whether the lower risk weight on transactor balances (final for banks from 1-Apr-2027) is extended to NBFC card issuers; the final rule on NBFC revolving credit (draft of 6-Aug-2026 exempts card issuers).',
    'Leadership: the MD & CEO\'s two-year SBI deputation runs to about Mar-2027; a renewal or successor decision is due before then.',
    'Capital: CAR 25.6% against a 15% minimum; any change in payout (11-12% now) would show whether the surplus will be returned.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const QK = C.quarterlyKpis, ccQ = SG.assetQuality.grossCreditCost;
const fy = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const K26 = X.K26;
const incomeMix = [['Interest on card loans', K26.interestOnLoans], ['Interchange', K26.interchange], ['Late and other fees', K26.feeBased], ['Membership fees', K26.membership], ['Network incentives', K26.bdIncentive], ['Recoveries (other income)', K26.recoveries], ['Interest on investments', K26.interestOnInvestments]];
const tot = K26.totalIncome;
const withTp = ST.filter(s => s.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Receivables: 25-30% growth until FY24, then a stall', unit: 'Gross card receivables at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Receivables', ref: 'fin.aum', scale: 0.001, fmt: 'n1' }], labels: 'all', source: 'Annual reports; GAM estimates FY27-29E' },
      { type: 'column', title: 'Spends kept growing: ₹4.3 lakh crore in FY26', unit: 'Card spends (₹ \'000 crore)', x: fy, series: [{ name: 'Spends', values: fy.map(l => Math.round(AK[l].spends / 1000)), fmt: 'num' }], labels: 'all', source: 'Annual reports FY21, FY22, FY26 (FY23-24 rounded)' },
    ] },
    { pair: [
      { type: 'column', title: 'Credit cost: from 9.5% to 6.5% in a year', unit: 'Gross credit cost, % of average receivables (company basis, annualised)', x: Object.keys(ccQ), series: [{ name: 'Gross credit cost', values: Object.values(ccQ), fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', source: 'Quarterly presentations Q2FY26-Q1FY27' },
      { type: 'stacked', title: 'Revolvers shrank to 22%: the book earns less interest', unit: 'Receivables by behaviour (%)', x: QK.map(q => q.q), series: [{ name: 'Transactor (no interest)', values: QK.map(q => q.transactorPct), fmt: 'pct0' }, { name: 'EMI', values: QK.map(q => q.emiPct), fmt: 'pct0' }, { name: 'Revolver', values: QK.map(q => q.revolverPct), fmt: 'pct0' }], minLabel: 5, max: 101, source: 'Q4FY26 and Q1FY27 presentations' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Fees are now as big as interest: FY26 income by source', unit: `Share of total income of ₹${n0(tot)} cr, FY26 (%)`, x: incomeMix.map(r => r[0]), series: [{ name: 'Share', values: incomeMix.map(r => Math.round(r[1] / tot * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Annual report FY26, notes 24-26' },
      { type: 'line', title: 'ROE back to ~17%, not to the old 25%', unit: 'ROE and ROA on total assets (%)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'ROA', ref: 'fin.roa', fmt: 'pct' }], labels: 'ends', min: 0, max: 35, source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: from 40x+ to ${n1(fwdPeNow)}x`, unit: `Price ÷ next full-year EPS (x), reported and credit-cycle-adjusted; orange line = our ${peMult}x`, x: fwdPe.filter(x => x[0] >= '2021-01-01').map(x => x[0]), series: [{ name: 'Reported EPS', values: fwdPe.filter(x => x[0] >= '2021-01-01').map(x => x[1]), fmt: 'x', thin: true }, { name: 'Credit-cycle-adjusted EPS', values: fwdPe.filter(x => x[0] >= '2021-01-01').map(x => (fwdPeN.find(y => y[0] === x[0]) || [])[1] ?? null), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: peMult, text: '', color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS FY22-26, GAM estimates FY27-29E; adjusted = credit cost at 7.2%' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Apr-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...withTp.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...withTp.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (27-Apr to 21-Aug 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.franchise, P3.fees, P3.spread, P3.quality, P4.funding, P4.capital, P4.roaTree, p.financials, P4.moat, P4.guidance, P4.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
