// IndiaMART report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, marketplace, Busy, strategic stakes, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in INDIAMART.ctx.js; forecast and valuation figures are
// live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./INDIAMART.ctx');
const { F, V, SA, SQ, n0, n1, pc, price, mv, MV, MULT, SENS, epsSep, at, rating, ST, medTp, sepNow, cleanMed, cleanS, A26, Q1, coMargin, dr5 } = X;
const P2 = require('./INDIAMART.part2'), P3 = require('./INDIAMART.part3'), P4 = require('./INDIAMART.part4'), P5 = require('./INDIAMART.part5'), P6 = require('./INDIAMART.part6');

const cover = {
  headline: 'A cash-rich B2B platform priced for decline: the customer base has stalled, but at ~16x forward EPS the de-rating has run ahead of the peers',
  lead: `IndiaMART is India's largest B2B marketplace: 2.2 lakh MSME suppliers pay it subscriptions for buyer leads, in advance. Q1FY27 revenue rose 11% and the EBITDA margin was 35%, but paying suppliers fell for a third quarter (218K) and buyer enquiries are flat; the stock is down 15% since the results and 59% below its five-year median P/E. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, within ~3% of MOSL and Choice. The street values IndiaMART on **P/E on FY28E** (Choice 20x; MOSL's DCF ≈ 21x). On the house rule we start from its own one-year-forward P/E median since Apr-2021 on EPS before start-up fair-value gains (${n1(cleanMed)}x) and apply the sector move of the internet and online-classifieds names with a usable five-year history (Info Edge, Just Dial, Matrimony.com: median ${pc(MV.all)}). **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** The street median is ₹${n0(medTp)}; on the last two years' multiples alone the value is ₹${n0(at(SENS.two))}, which is the bear argument in one number. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Growth is all price now, and that has limits', p: `Paying suppliers were 217K at Mar-25 and 218K at Jun-26; ARPU rose from ₹61K to ₹69K. Platinum and Gold (half the base, >75% of revenue) renew and upgrade; Silver churns ~7% a month, and the Q2FY26 Silver price rise cut gross additions. Management will not buy growth until renewals improve. We assume ~10% revenue growth from ARPU, no customer recovery.` },
    { h: 'A high-margin cash machine with a third of its value in cash', p: `Customers prepay (deferred revenue ₹${n0(Q1.deferredRevenue)} cr), capex is negligible and the company has no debt: ₹${n0(Q1.cashTreasury)} cr of cash and treasury (~₹590 a share) plus ₹${Q1.strategic} cr of start-up stakes. EBITDA margin ~${n1(coMargin[0])}% (company basis); FY26 payout 76%. Excluding its cash and stakes (~₹${n0(X.cashPs)} a share) and their income, the stock trades at ~${n1(X.exCashPe)}x FY28E operating EPS.` },
    { h: 'Reported EPS is noisy; we value it before the noise', p: 'Other income is a third of pre-tax profit and swings with bond marks (−₹34 cr in Q4FY26, +₹107 cr in Q1FY27); fair-value gains on 13 start-up stakes added up to a fifth of EPS (FY23). Associates\' losses (₹55 cr) sit inside Screener\'s EBITDA. We forecast a normal 7% treasury return and no start-up gains, and derive the multiple on EPS before them.' },
    { h: 'Valuation: the de-rating has gone further than at its peers', p: `IndiaMART trades ${Math.abs(Math.round(dr5.INDIAMART))}% below its five-year median P/E; Info Edge (${pc(dr5.NAUKRI)}), Just Dial (${pc(dr5.JUSTDIAL)}) and Matrimony.com (${pc(dr5.MATRIMONY)}) less. The house multiple (${MULT.base}x) assumes IndiaMART recovers to its history less the peers' de-rating. That is the upside, and the risk: if AI search erodes buyer enquiries, part of the de-rating is permanent.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin (after associates)', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): net supplier additions, Silver churn, collections growth and the margin as acquisition spending is reviewed.',
    'Category-based Platinum pricing and the paid buyer programme: any disclosure of their effect on ARPU.',
    'IndiaMART Finance: partner-lender launch and first transaction-finance products (approved Jul-2026).',
    'Capital return: a buyback or a higher regular dividend from ~₹3,500 cr of cash and treasury.',
    'Busy: subscription transition and Busy Magic; target 27-30% revenue growth.',
  ],
};

const L = SQ.filter(x => x.ebitdaCo), coM = L.map(x => x.coMargin);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Paying suppliers flat for two years at ~217-222K', unit: 'Paying suppliers (000s)', x: [...SA.map(a => a.fy), 'Q1FY27'], series: [{ name: 'Paying suppliers', values: [...SA.map(a => a.suppliersK), Q1.standalone.payingSuppliersK], fmt: 'num' }], labels: 'all', source: 'Q1FY27 investor presentation' },
      { type: 'column', title: 'So growth is ARPU: ₹44K (FY22) to ₹69K (Q1FY27)', unit: 'ARPU (₹000)', x: [...SA.map(a => a.fy), 'Q1FY27'], series: [{ name: 'ARPU', values: [...SA.map(a => a.arpuK), Q1.standalone.arpuK], fmt: 'num' }], labels: 'all', source: 'Q1FY27 investor presentation' },
    ] },
    { pair: [
      { type: 'column', title: 'Collections lead revenue; both now grow ~8-11%', unit: 'Consolidated, ₹ crore', x: SA.map(a => a.fy), series: [{ name: 'Collections', values: SA.map(a => a.collCons), fmt: 'num' }, { name: 'Revenue', values: SA.map(a => a.sales), fmt: 'num' }], labels: 'none', source: 'Q1FY27 investor presentation' },
      { type: 'column', title: 'EBITDA margin (company basis): 33-35% for five quarters', unit: 'EBITDA before associates, % of revenue', x: L.map(x => x.q), series: [{ name: 'EBITDA margin', values: coM, fmt: 'pct' }], labels: 'all', min: 20, source: 'Q4FY26 and Q1FY27 presentations; MOSL (21-Jul-2026)' },
    ] },
    { pair: [
      { type: 'column', title: 'Other income swings with bond marks', unit: 'Consolidated other income per quarter (₹ crore)', x: SQ.filter(x => x.otherIncome != null).map(x => x.q), series: [{ name: 'Other income', values: SQ.filter(x => x.otherIncome != null).map(x => x.otherIncome), fmt: 'num' }], labels: 'all', source: 'Company results via MOSL (21-Jul-2026); Screener.in' },
      { type: 'column', title: `EPS before start-up gains: ₹${n1(X.epsClean[2026])} (FY26) to ₹${n1(F.eps[2])} (FY29E)`, unit: 'EPS (₹)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EPS before one-offs', values: [2023, 2024, 2025, 2026, 2027, 2028, 2029].map(y => Math.round(X.epsClean[y] * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'Screener.in; AR FY24/FY26 (one-offs); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(price / F.eps[1])}x FY28E now vs a ${n1(cleanMed)}x median since 2021`, unit: 'Price ÷ next full-year EPS before one-offs (x)', x: cleanS.map(x => x[0]), series: [{ name: 'Forward P/E', values: cleanS.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: SENS.two, text: `Last two years: ${SENS.two}x` }], source: 'Screener.in prices; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our target vs the street and the sensitivities', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.short), 'Street median', 'DCF', 'Last two years', 'GAM (base)'], series: [{ name: 'Value', values: [...ST.map(s => s.tp), medTp, Math.round(mv('dcf').value), at(SENS.two), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes (21-22 Jul-2026) as cited; GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.marketplace, P3.busy, P3.stakes, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
