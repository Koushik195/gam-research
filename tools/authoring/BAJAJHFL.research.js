// Bajaj Housing Finance report, part B: cover, story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, franchise and AUM mix, commercial book, spread and NIM, asset quality, funding,
// capital, ROA tree, the parent's sell-down, moat, Q1FY27 and guidance, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in BAJAJHFL.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./BAJAJHFL.ctx');
const { F, V, C, SG, n0, n1, n2, pc, price, pbMult, bvSep28, PBL, PB12, fwdPb, fwdPbNow, trailPb, rating, ST, Q1, mv, P, HFC_SYMS, shortName, toSellCr, floatNowCr, toSellSh, daysOfVolume } = X;
const P2 = require('./BAJAJHFL.part2'), P3 = require('./BAJAJHFL.part3'), P4 = require('./BAJAJHFL.part4'), P5 = require('./BAJAJHFL.part5'), P6 = require('./BAJAJHFL.part6');
const ke = V.ke;
const nextHfc = HFC_SYMS.map(s => P[s]).sort((a, c) => c.pb - a.pb)[0];

const cover = {
  headline: `India's cleanest mortgage book, priced for returns it does not earn: a 12-13% ROE lender at 3x book, with an 11.7% stake sale still to come. We initiate at ${rating}.`,
  lead: `Bajaj Housing Finance (BHFL) is India's largest non-deposit-taking housing-finance company: ₹1.50 lakh cr of home loans, loans against property, lease-rental and developer loans, AAA-funded, with gross bad loans of just 0.29% and loan losses of 5-20bp a year. It grows 21-24% a year. The problem is the economics: prime home loans are priced by banks, margins are falling (NIM −20-25bp guided for FY27), and return on equity is 12-13%, barely above our ${n1(ke)}% cost of equity. The street values the stock on **P/B on FY28E book (2.5-2.7x)**. We forecast EPS of ₹${n2(F.eps[0])} / ₹${n2(F.eps[1])} / ₹${n2(F.eps[2])} for FY27-29E and ROE of {{F.roe.0|pct}}-{{F.roe.2|pct}}. Applying **${pbMult}x to Sep-28E book of ₹${n1(bvSep28)}** (the stock's own ${PB12.med}x median over the last year, adjusted for the ${pc(X.hfcPb12)} move in housing-finance multiples) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}, at the edge of SELL.** Our intrinsic checks are lower still (justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}): at ₹${n0(price)} the market prices a long-run ROE of ~{{dcf.impliedRoe|pct0}}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A superb mortgage franchise: fast, clean and cheap to run', p: `AUM +24% in Q1FY27 with a record ₹8,918 cr added; gross NPA 0.29%, nil in lease-rental loans since inception; loan losses 17bp in FY26 and guided at 10-15bp; opex only 19.6% of income with 2,025 staff. Funding is AAA with a positive behavioural maturity gap. On quality there is little to criticise.` },
    { h: 'But it earns a utility return: ROE 12-13% against a 12.5% cost of equity', p: `Prime home loans are priced by SBI and the private banks; NIM fell from 3.9% to 3.7% in a year and management expects 6-10bp more. ROE was 12.1% in FY26 and is guided at 12-13% for FY27; it rises only if leverage goes from 5.8x toward the 8x ceiling. We model {{F.roe.0|pct}} → {{F.roe.2|pct}}. A lender earning its cost of capital is worth about book; BHFL trades at ${n1(trailPb)}x.` },
    { h: 'The parent must still sell ~₹8,000 cr of stock', p: `Bajaj Finance holds 86.70% and must get to 75% by 15-Sep-2029 (deadline extended in Mar-2026). That is ${n1(toSellSh)} cr shares, ~₹${n0(toSellCr)} cr at ₹${n0(price)}: ${n1(toSellCr / floatNowCr)}x today's free float and ~${n0(daysOfVolume)} days of average trading. The first 2% (Dec-2025) knocked 9% off the price. Institutions own under 2%; 23 lakh retail holders own 11%.` },
    { h: `Valuation: de-rated from ${n1(PBL.max)}x to ${n1(fwdPbNow)}x forward book, still the priciest HFC`, p: `The forward P/B fell from ${PBL.max}x at listing to ${n1(fwdPbNow)}x (FY28E), and the stock trades 17% above its ₹70 IPO price. Yet at ${n1(trailPb)}x trailing book it is still the dearest listed housing-finance company (next: ${shortName(nextHfc.symbol)} at ${n1(nextHfc.pb)}x with a ${n0(nextHfc.roe)}% ROE) on the lowest FY26 ROE in the group (${n1(P.BAJAJHFL.roe)}%). Our ${pbMult}x Sep-28E book gives {{dcf.tp|inr}}; a 2.5x multiple (its 12-month median) gives ~₹${n0(2.5 * bvSep28)}.` },
  ],
  keyRows: [['AUM (₹ cr)', 'aum', 'num'], ['AUM growth', 'aumGrowth', 'chg'], ['NII (₹ cr)', 'nii', 'num'], ['NIM (on AUM)', 'nim', 'pct'], ['Credit cost (% of AUM)', 'creditCost', 'n2'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['BVPS (₹)', 'bvps', 'n1'], ['ROA (on assets)', 'roa', 'pct'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Supply overhang', v: 'RED' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): management will raise FY27 AUM guidance only if the Q1 easing in balance-transfer attrition holds for another quarter.',
    'The parent\'s next sell-down tranche: size, price and route (block deals, an offer for sale, or a fresh BHFL issue). The Dec-2025 block took 9% off the price.',
    'Bajaj Finance\'s own equity raise (board meeting noticed for early October 2026): if it raises enough, it has less reason to rush BHFL sales.',
    'The rate cycle: management says rate cuts are over; a repo hike would let it reprice ~₹17,000 cr of repo-linked loans and its lending rate, the only route to wider margins.',
    'Sambhav (near-prime and affordable) reaching ₹600 cr+ of monthly disbursements and 20% of home loans by Mar-27: the one yield lever management controls.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const QK = C.quarterlyKpis, AK = C.annualKpis, QJ = SG.quarterly.find(q => q.q === 'Q1FY27');
const mixNames = SG.lines.map(l => l.name.replace(' (incl. top-ups)', ''));
const hfcPb = [...HFC_SYMS, 'BAJAJHFL'].map(s => P[s]).sort((a, c) => c.pb - a.pb);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'AUM: ₹33,000 cr to ₹1.4 lakh crore in six years', unit: 'AUM at March (₹ \'000 crore)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'AUM', ref: 'fin.aum', scale: 0.001, fmt: 'n1' }], labels: 'all', source: 'Company presentations; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Home loans are 54% of the book; lease-rental loans are the fastest growers', unit: 'Share of AUM, Jun-2026 (%)', x: mixNames, series: [{ name: 'Share', values: SG.lines.map(l => Math.round(QJ[l.key] / QJ.total * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p38' },
    ] },
    { pair: [
      { type: 'line', title: 'Portfolio yield down 0.9pp in two years; funding cost down only 0.7pp', unit: 'Company-reported portfolio yield and cost of funds (%), quarter-end', x: QK.map(q => q.q), series: [{ name: 'Portfolio yield', values: QK.map(q => q.portfolioYield), fmt: 'n1' }, { name: 'Cost of funds', values: QK.map(q => q.costOfFunds), fmt: 'n1' }], labels: 'ends', min: 6, max: 10.5, source: 'Q1FY27 presentation p24' },
      { type: 'column', title: 'Loan losses: tiny, and guided at 10-15bp for FY27', unit: 'Loan losses ÷ average loan assets (%), company basis; Q1FY27 annualised', x: [...AK.filter(k => k.fy >= 'FY20').map(k => k.fy), 'Q1FY27'], series: [{ name: 'Credit cost', values: [...AK.filter(k => k.fy >= 'FY20').map(k => k.creditCostAr), Q1.creditCostAr], fmt: 'n2' }], labels: 'all', highlight: 'Q1FY27', source: 'Q1FY27 presentation p10, p22' },
    ] },
    { pair: [
      { type: 'line', title: `ROE hovers around a ${n1(ke)}% cost of equity`, unit: 'Return on average equity (%); red line = our cost of equity', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 18, lines: [{ v: ke, text: `Cost of equity ${n1(ke)}%`, color: '#b4232a' }], source: 'Screener.in; GAM estimates' },
      { type: 'hbar', title: 'Still the most expensive housing-finance stock on book', unit: 'Trailing P/B at the 30-Sep-2026 close (x); ROE FY26 in brackets', x: hfcPb.map(p => `${shortName(p.symbol)} (${n1(p.roe)}%)`), series: [{ name: 'P/B', values: hfcPb.map(p => Math.round(p.pb * 100) / 100), fmt: 'x' }], labels: 'all', highlight: `Bajaj Housing Finance (${n1(P.BAJAJHFL.roe)}%)`, source: 'Screener.in (P/B scaled to the NSE close), GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/B: ${PBL.max}x at listing, ${n1(fwdPbNow)}x now`, unit: `Price ÷ next full-year book value per share (x); orange line = our ${pbMult.toFixed(1)}x`, x: fwdPb.map(x => x[0]), series: [{ name: 'Forward P/B', values: fwdPb.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 0, lines: [{ v: PBL.med, text: `Median since listing: ${PBL.med}x` }, { v: pbMult, text: '', color: '#cf8f1f' }], source: 'Screener.in prices; book value per share; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker.replace(/ (Institutional Equities|Global|Capital|Securities)$/, '')), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and BusinessToday roundup (29-Jul to 1-Aug 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.franchise, P3.commercial, P3.spread, P3.quality, P4.funding, P4.capital, P4.roaTree, p.financials, P4.selldown, P4.moat, P4.guidance, P4.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
