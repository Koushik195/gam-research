// GSFC initiation, part 2: cover, the story in charts, the business and its history.
const X = require('./GSFC.ctx');
const { C, F, V, SC, n0, n1, pctChg, SRC, SA, SQ, QL, FYS, A26, A25, A23, Q1, price, mcap, listedMv, unlistedV, investShare, listedShare, HH, NOW, derived, K, coreEb27, rating, fm, fwd, pe28, dcfV, peV, P, VP, sh, pb } = X;
const hr = HH.rows;

const cover = {
  headline: 'A fertiliser and chemicals PSU priced at the value of its share portfolio, as it always has been',
  lead: `GSFC makes fertilisers (78% of FY26 revenue: ammonium sulphate, APS, urea, DAP and traded products) and industrial chemicals (22%: caprolactam, nylon-6, melamine), and owns shares in other Gujarat companies worth ~₹${n0(listedMv + unlistedV)} cr: **${Math.round(investShare)}% of its ₹${n0(mcap)} cr market value at the ${X.ASOF_TXT} close** (listed stakes alone ${Math.round(listedShare)}%). Q1FY27 showed both businesses at the mercy of outside prices: revenue +64%, but the fertiliser EBIT margin fell to 4.1% (8.5%) as sulphur, ammonia and P₂O₅ spiked, while industrial products earned ₹116 cr of EBIT (₹25 cr) on a $816/t caprolactam spread. Coverage is effectively nil; the last full broker series (Emkay) used a sum of the parts, and so do we: **the business at ${K}x Sep-27E EBITDA, the holdings at market, plus net cash, less a ${derived.base}% holding discount**, GSFC's own median since 2021 in quarters with normal earnings. That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** P/E (₹${n0(peV)}) and DCF (₹${n0(dcfV)}, holdings at full book) bracket it. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The market has never paid for the business', p: `Since June 2021 GSFC's market value has been a median ${HH.medMcapToListed.toFixed(1)}x its listed holdings. Take the holdings at market and the cash at face value, and the price has implied roughly nothing for a business that earned ₹514-1,588 cr of EBITDA a year (median ${n1(HH.medImpliedCoreX)}x EBITDA). On our look-through measure (business at ${K}x EBITDA) the discount has ranged from ${Math.round(Math.min(...hr.map(r => r.disc)))}% to ${Math.round(Math.max(...hr.map(r => r.disc)))}%. On ${X.ASOF_TXT} it was ~${Math.round(NOW.disc)}%: cheap on assets (${pb.toFixed(2)}x book), not cheap against its own history.` },
    { h: 'Fertiliser margins are set by policy and sulphur', p: `Urea (New Urea Policy) and DAP (special package: import parity plus 4%) are protected. GSFC's largest manufactured products, APS and ammonium sulphate, are not: they run on sulphur, which averaged ~₹82,000/t in Q1FY27 and was above ₹115,000/t by mid-August. Rabi 2026-27 NBS rates were not announced by 30-Sep. We model a fertiliser EBITDA margin of 5.0% / 6.5% / 7.0% (FY27-29E) vs 6.6% in FY26 and 17.6% in the FY23 boom.` },
    { h: 'Chemicals: a crisis windfall, not a trend', p: `Industrial products EBIT went from ₹56 cr (FY25) to ₹200 cr (FY26) and ₹116 cr in Q1FY27 alone, as China curbed exports and the capro-benzene spread jumped to $816/t (FY26 average $535). Management expects the spread to be "stable to soft"; melamine output has already stopped on Chinese imports. We model a 13.5% EBITDA margin in FY27 falling to 11% (FY19-26 average ~10%).` },
    { h: 'Capital allocation explains the discount', p: `ROE was 5.5% in FY26. The portfolio has never been sold or distributed; the payout is ~30% of profit (~1.6% of net worth) against a state policy floor of 5% of net worth (the policy allows less with Finance Department approval, e.g. for capex); no buyback is planned. A new capex cycle (Sikka acid plants, Dahej complex) starts without a disclosed cost, under a board that had three managing directors in FY26. Until that changes, we see no reason for the discount to close.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Rabi 2026-27 NBS subsidy rates (due for the October-March season): the main swing factor for APS, AS and NPK margins in H2FY27.',
    'Q2FY27 results (due by mid-November 2026): the first quarter with sulphur above ₹1 lakh/t; working capital and borrowings.',
    'Award and cost of the Sikka phosphoric/sulphuric acid EPC contract (expected by Sep-2026, not announced by 30-Sep) and the Dahej plan.',
    'Commissioning of the C-Train modification at Sikka (APS or DAP on one train; due in Q2FY27).',
    'Any dividend, buyback or stake sale under Gujarat\'s 2023 PSU capital policy: the one thing that would narrow the holding discount.',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'line', title: `Market value has tracked the listed holdings (median ${HH.medMcapToListed.toFixed(1)}x)`, unit: '₹ crore, quarter-ends', x: hr.map(r => r.d), series: [{ name: 'GSFC market value', values: hr.map(r => Math.round(r.mcap)), fmt: 'num' }, { name: 'Listed holdings at market', values: hr.map(r => Math.round(r.listed)), fmt: 'num' }], labels: 'last', yearTicks: true, yearStep: 1, source: 'NSE closes; annual reports (holdings); GAM Research' },
      { type: 'column', title: `Discount to look-through value: median ${Math.round(HH.medAll)}% (all), ${Math.round(HH.medNormal)}% (normal years)`, unit: 'Discount (%; business at 6x trailing EBITDA)', x: hr.map(r => r.d.slice(0, 7)), series: [{ name: 'Discount', values: hr.map(r => Math.round(r.disc)), fmt: 'pct0' }], labels: 'none', source: 'GAM Research (see Valuation); our base case uses 41%' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Segment EBITDA: fertilisers carry it, except in chemical booms', unit: 'Segment EBITDA (₹ crore)', x: FYS, series: [{ name: 'Fertilizer products', values: SA.map(a => Math.round(a.fertEbitda)), fmt: 'num' }, { name: 'Industrial products', values: SA.map(a => Math.round(a.ipEbitda)), fmt: 'num' }], minLabel: 100, source: 'Annual reports (segment note); EBITDA = segment result + segment depreciation' },
      { type: 'line', title: 'Both margins swing; the boom (FY22-23) was the exception', unit: 'Segment EBITDA margin (%)', x: FYS, series: [{ name: 'Fertilizer products', values: SA.map(a => a.fertEbitdaPct), fmt: 'pct' }, { name: 'Industrial products', values: SA.map(a => a.ipEbitdaPct), fmt: 'pct' }], labels: 'all', min: 0, max: 24, source: 'Annual reports, GAM calculation' },
    ] },
    { pair: [
      { type: 'column', title: 'Q1FY27: fertiliser margin squeezed, chemicals boomed', unit: 'Segment EBIT margin (%, standalone)', x: QL, series: [{ name: 'Fertilizer products', values: SQ.map(q => q.fertEbitPct), fmt: 'pct' }, { name: 'Industrial products', values: SQ.map(q => q.ipEbitPct), fmt: 'pct' }], labels: 'none', source: SRC + '; Q4 = full year less nine months; IP EBIT not disclosed for Q1, Q3, Q4 FY25' },
      { type: 'column', title: 'Capro-benzene spread: $816/t in Q1FY27', unit: 'US$ per tonne (quarter)', x: QL, series: [{ name: 'Spread', values: SQ.map(q => q.caproSpread), fmt: 'num' }], labels: 'all', source: 'GSFC media releases and investor presentations' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(pe28)}x our FY28E; median since 2021 ${fm.median}x`, unit: 'Price ÷ next full-year EPS (x)', x: fwd.filter(x => x[0] >= '2019-04-01').map(x => x[0]), series: [{ name: 'Forward P/E', values: fwd.filter(x => x[0] >= '2019-04-01').map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: fm.median, text: `Median since 2021: ${fm.median}x` }], source: 'Screener.in prices; reported EPS, GAM estimates for FY27-29E' },
      { type: 'hbar', title: 'What makes up our {{dcf.tp|inr}} (₹ per share)', unit: '₹ per share (base case)', x: ['Business (6x EBITDA)', 'Listed holdings', 'Unlisted holdings', 'Net cash Sep-27E', 'Holding discount', 'Target'], series: [{ name: 'Value', values: [X.coreV, listedMv, unlistedV, X.ncSep27, X.pDisc.value, V.tp * sh].map(v => Math.round(v / sh)), fmt: 'inr' }], labels: 'all', highlight: 'Target', source: 'GAM Research' },
    ] },
  ],
};

const business = {
  id: 'business', nav: 'What GSFC does', kicker: 'The business', title: 'Two commodity businesses on one integrated site, plus a portfolio of shares',
  blocks: [
    { p: C.profile.what + ' ' + C.profile.segments },
    { exhibit: { type: 'table', title: 'The two segments in FY26 (consolidated)', head: ['Segment', 'What it sells', 'Revenue (₹ cr)', 'EBITDA (₹ cr)', 'EBITDA margin', 'EBIT (₹ cr)', 'Capital employed (₹ cr)'], wide: [1], rows: [
      ['**Fertilizer products**', 'AS 5.76 lakh t, APS 7.16 lakh t, urea 3.25 lakh t, DAP 1.46 lakh t (manufactured 17.68 lakh t) + traded urea and P&K 4.63 lakh t; subsidy income ₹4,514 cr', n0(A26.fertRev), n0(A26.fertEbitda), A26.fertEbitdaPct + '%', n0(A26.fertEbit), n0(5892.15 - 796.47)],
      ['**Industrial products**', 'Caprolactam 54,671 t (external), nylon-6 35,010 t, melamine 38,780 t, methanol, MEK oxime, HX crystal, technical urea, traded ammonia', n0(A26.ipRev), n0(A26.ipEbitda), A26.ipEbitdaPct + '%', n0(A26.ipEbit), n0(2476.22 - 160.47)],
      { hl: true, cells: ['**Consolidated**', '', n0(A26.consRev), `790 (after ₹${n0(A26.centralCosts)} cr central costs)`, '7.2%', '', ''] },
    ], source: 'Annual Report 2025-26 (note 40, ten-year product table); capital employed = segment assets − segment liabilities' } },
    { h: 'How each business makes money' },
    { p: '**Fertilisers are a policy-priced conversion business.** GSFC makes ammonia from piped natural gas, sulphuric acid from sulphur, and buys phosphoric acid (P₂O₅) and rock. Urea earns a fixed return under the New Urea Policy: the subsidy covers the gap between cost (including gas) and the fixed farm price, so gas costs pass through. DAP, APS, AS and NPK get a fixed subsidy per kg of nutrient (NBS), reset each season; MRPs are nominally free but farmers\' ability to pay caps them, so when sulphur or P₂O₅ jump faster than the subsidy, margins shrink. In the current crisis the government added a DAP special package (import parity plus 4%). GSFC also trades imported urea, DAP and NPK at thin margins. **Industrial products are commodity chemicals**: caprolactam (from benzene) goes into nylon-6 (sold as chips and engineering plastics), melamine (from urea) into laminates. Prices follow China, the world\'s swing producer; the capro-benzene spread is the profit driver.' },
    { pair: [
      { type: 'column', title: 'Manufactured fertiliser sales: 17.7 lakh t in FY26', unit: 'Sales volume (lakh tonnes)', x: FYS, series: [{ name: 'Manufactured', values: SA.map(a => a.volMfd), fmt: 'n1' }, { name: 'Traded', values: SA.map(a => a.volTraded), fmt: 'n1' }], labels: 'all', source: 'AR FY26 ten-year product table (excl. captive); traded volumes from FY25-26 decks' },
      { type: 'column', title: 'Chemical volumes: melamine ramped up by FY22, caprolactam drifting lower', unit: 'Sales volume (\'000 tonnes)', x: FYS, series: [{ name: 'Caprolactam (external)', values: SA.map(a => Math.round(a.caproSales / 100) / 10), fmt: 'n1' }, { name: 'Nylon-6', values: SA.map(a => Math.round(a.nylonSales / 100) / 10), fmt: 'n1' }, { name: 'Melamine', values: SA.map(a => Math.round(a.melamineSales / 100) / 10), fmt: 'n1' }], labels: 'none', source: 'AR FY26 ten-year product table' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From India\'s first joint-sector fertiliser company to a state-run holding of assets',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, h.event, h.impact || '–'].map(t => t.replace(/Rs(?=\d)/g, '₹').replace(/P2O5/g, 'P₂O₅'))), source: 'Annual reports FY20-26, media releases, GNFC buyback offer, GSPC scheme notices' } },
    { callout: '**Corporate actions:** no bonus, split or buyback by GSFC itself; the share count has been 39.85 cr for years. The actions that move value happen in the portfolio: GSFC tendered 15.9 lakh GNFC shares in GNFC\'s December-2023 buyback (₹123 cr), swapped its unlisted GSPC shares for Gujarat Energy shares in May-2026, received GSPL Transmission shares in July-2026, and got Paradeep shares for its Mangalore Chemicals stake. None of these was a decision to sell.' },
  ],
};

module.exports = { cover, narrative, business, history };
