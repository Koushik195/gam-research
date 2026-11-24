// Ipca Laboratories report, part B: cover, the story in charts, and the merger of part2-6 (business, history & the Unichem
// deal, industry, tailwind test, India branded, exports, APIs, Unichem & subsidiaries, the USFDA record, moat, Q1FY27,
// earnings quality, ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs
// in IPCALAB.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./IPCALAB.ctx');
const { F, V, A, n0, n1, pc, SQ, QL, Q1, price, mv, MULT, HB, k, SECTOR, rating, ST, YRS, BL, LINES, LBL, fwdNow, trailPe, dr5, USED, P, shortName, shortDate, epsU, epsSep, epsBase, epsRep, UD, stakeMv, netCashOwn, postQ1, sotpVal, mult22 } = X;
const P2 = require('./IPCALAB.part2'), P3 = require('./IPCALAB.part3'), P4 = require('./IPCALAB.part4'), P5 = require('./IPCALAB.part5'), P5b = require('./IPCALAB.part5b'), P6 = require('./IPCALAB.part6');

const cover = {
  headline: `A pain-and-rheumatology franchise with its own APIs, back in the US and with Unichem finally helping: a better business, but after a 47% rise the price already reflects it. On the street's P/E method we see {{dcf.upside|chg}}`,
  lead: `Ipca is India's 16th-largest drug maker (2.08% share), with 53% of domestic sales in pain and rheumatology (Zerodol, HCQS, Folitrax), branded exports to Africa, CIS and Asia, UK/EU and US generics, anti-malarial tenders and ~80 APIs it makes itself; it owns 52.67% of listed Unichem Laboratories. Q1FY27 revenue rose 21% to ₹2,788 cr (domestic +13%, export formulations +34%, APIs +30%), EBITDA 50% (margin 22.9%) and profit to shareholders 72%; management raised FY27 guidance to 14-16% growth and a ~23% margin. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E. Six of the seven brokers that disclose a method use **P/E** on consolidated EPS after minorities, and so do we: **${MULT.base}x Sep-28E EPS (₹${n1(epsSep)})**, i.e. Ipca's ${n1(HB.med)}x median forward P/E since the Unichem deal (on EPS before exceptional items), lifted ${SECTOR}% for the pharma sector's re-rating, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}; Unichem at market less 20% ₹${n0(Math.round(sotpVal / 10) * 10)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A franchise that compounds, with a cost edge', p: 'Pain/analgesics ₹2,152 cr on IQVIA (Jul-2026), top 10 brands 38% of sales, domestic growth ahead of the market (Q1FY27 +12.6%; chronic +17.2% vs 15.2%). Ipca makes most of its own APIs, so material cost is ~25% of standalone sales and gross margin ~71%. Cardio, derma, urology and CNS (+16-25%) are the push; anti-malarials are now ~1% of domestic sales.' },
    { h: 'The margin story is half done', p: 'Standalone margin 22.7% (FY25) → 25.2% (FY26) → 26.3% (Q1FY27); management sees ~30%. Unichem 4% → 11% in a year, 13% guided, mid-teens possible. Consolidated 20.7% → ~23% guided for FY27, 25-26% aspired in 2-3 years. We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}: below the aspiration because freight and solvents have risen sharply.' },
    { h: 'Back in the US after nine years; regulatory record now clean', p: 'Import alerts (2015) on Ratlam, Pithampur and Silvassa were lifted in FY24 after VAI inspections; Tarapur VAI in Feb-2026. Ipca\'s products drove Unichem\'s US +27% in Q1FY27; Europe/UK generics quadrupled. Open items on 30-Sep: five observations at Unichem\'s Goa plant (26-Sep) and Kolhapur (Feb).' },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} Ipca trades at ${n1(fwdNow)}x our FY28E EPS against a ${n1(HB.med)}x median forward P/E since the Unichem deal; it rose 47% in twelve months. Our ${MULT.base}x gives ₹${n0(V.tp)}, inside the street's ₹1,935-2,190 post-Q1 range but ${pc(V.upside)} away: a HOLD on our rule. Counting the pre-deal year in the history (${mult22}x) would make it a BUY; we explain why we do not.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether the margin holds near 23% as freight and solvent costs bite and the institutional catch-up reverses; Unichem\'s margin vs the 13% guidance.',
    'USFDA: the outcome of Unichem\'s Goa inspection (five observations, 21-26 Sep 2026) and of the Kolhapur API inspection; any new inspections at Ipca\'s plants.',
    'Monthly IQVIA data: chronic growth vs the market; anti-malarial decline; pricing on non-controlled products.',
    'Capacity: Dewas formulations (₹275 cr), Pithampur mAb plant (₹250 cr) and the Pisgah (US) plant starting trial production in FY27; Krebs merger approvals.',
    'FY28 guidance with the Q4FY27 results; biosimilar clinical trials from FY28.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp && s.date >= '2026-01-01');
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Revenue: ₹2,788 cr in Q1FY27, +21%', unit: 'Revenue (₹ crore), quarterly', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company results; Screener.in' },
      { type: 'hbar', title: 'India is 40%; exports, APIs and Unichem make up the rest', unit: 'FY26 revenue by business (₹ crore)', x: LINES.map(l => LBL[l]), series: [{ name: 'FY26', values: LINES.map(l => Math.round(BL.base[l])), fmt: 'num' }], labels: 'all', highlight: LBL.domForm, source: 'AR FY26; Q4FY26 call; GAM' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: from 18% to 23% in a year', unit: 'EBITDA margin (%), company basis (ex forex), quarterly', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 14, max: 26, source: 'PL result update (16-Aug-2026); Q1FY27 call' },
      { type: 'line', title: 'Unichem: margin from 4% to 11%', unit: 'Unichem operating margin (%), quarterly', x: QL, series: [{ name: 'Unichem margin', values: SQ.map(q => q.unichemOpm), fmt: 'pct0' }], labels: 'all', min: 0, max: 18, source: 'Screener.in (UNICHEMLAB)' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: back above the COVID peak, rising further', unit: 'EPS (₹); FY27-29E = GAM (to shareholders)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Reported / forecast', values: [epsRep[2021], epsRep[2022], epsRep[2023], epsRep[2024], epsRep[2025], epsRep[2026], ...epsU.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }, { name: 'Before exceptional items and one-offs', values: [null, null, 18.58, 25.82, 35.14, Math.round(epsBase[2026] * 10) / 10, null, null, null], fmt: 'n1' }], labels: 'all', source: 'Screener.in; AR note 34; GAM Research' },
      { type: 'line', title: `Forward P/E since the Unichem deal: ${n1(fwdNow)}x now vs ${n1(HB.med)}x median`, unit: 'Price ÷ next full-year EPS before exceptional items (x)', x: X.sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median ${n1(HB.med)}x` }, { v: MULT.base, text: `Target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; GAM' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma re-rated (+${SECTOR}% vs five-year medians); Ipca did not`, unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...[...USED].sort((a, c) => dr5[c] - dr5[a]).map(shortName), 'Ipca Labs'], series: [{ name: 'vs median', values: [...[...USED].sort((a, c) => dr5[c] - dr5[a]).map(s => Math.round(dr5[s] * 10) / 10), Math.round(dr5.IPCALAB * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Ipca Labs', source: 'Screener.in P/E series; asof-peers.js' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (2026 notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and summaries (Feb to Aug-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.exportsSec, P3.apis, P3.unichem, P3.regulatory, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5b.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
