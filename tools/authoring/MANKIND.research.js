// Mankind Pharma report, part B: cover, the story in charts, and the merger of part2-6 (business, history & the BSV deal,
// industry, tailwind test, India Rx, BSV, consumer, exports, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in MANKIND.ctx.js. Forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./MANKIND.ctx');
const { F, V, A, n0, n1, pc, SQ, QL, Q1, price, mv, MULT, adjEps, ownersEps, adjSep, HB, HR, HB_post, k, SECTOR, rating, ST, lev, ndCo, YRS, BL, LINES, LBL, fwdNowAdj, fwdNowRep, trailPe, drW, PEER_SET, P, shortName, shortDate, sectorCalc, byBase, epsRep, ppaPs } = X;
const P2 = require('./MANKIND.part2'), P3 = require('./MANKIND.part3'), P4 = require('./MANKIND.part4'), P5 = require('./MANKIND.part5'), P5b = require('./MANKIND.part5b'), P6 = require('./MANKIND.part6');

const cover = {
  headline: `India's #1 prescription franchise has de-rated below its own history while pharma re-rated: on the street's P/E method, with EPS put on one basis across the BSV deal, we see {{dcf.upside|chg}}`,
  lead: `Mankind is India's 4th-largest drug maker by value (4.7% share), #1 by prescriptions for nine years, 79% of revenue from the domestic prescription market and 40% of that in chronic therapies; it bought Bharat Serums and Vaccines (BSV, women's health, fertility, critical-care biologics) for ₹13,768 cr in Oct-2024 with debt. Q1FY27 revenue rose 13% to ₹4,031 cr (domestic prescriptions +11%, exports +29%), EBITDA 25% and profit to shareholders 30%, with growth back at market pace after a lost FY26. We forecast EPS to shareholders of ₹${n1(ownersEps[0])} / ${n1(ownersEps[1])} / ${n1(ownersEps[2])} for FY27-29E (₹${n1(adjEps[0])} / ${n1(adjEps[1])} / ${n1(adjEps[2])} before ~₹450 cr a year of non-cash BSV amortisation) and net cash by FY28E. Three of the four brokers that disclose a method use **P/E**, and so do we: **${MULT.base}x Sep-28E EPS before the BSV amortisation (₹${n1(adjSep)})**, i.e. Mankind's ${n1(HB.med)}x median forward P/E since Nov-2023 on the same basis, lifted ${SECTOR}% for the pharma sector's move over the same window, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A franchise that is hard to copy', p: '15.2% of all prescriptions in India, 84% of doctors writing its brands, 18,500+ reps reaching deeper into small towns than peers, 22 brands above ₹100 cr and consumer brands with 28-84% shares (Manforce, Prega News). It turns ordinary molecules into large brands at low cost; gross margin 71-73%, employee cost ~22% of sales.' },
    { h: 'Growth is back to market pace; outperformance is the upside', p: 'A field-force overhaul cost Mankind its growth premium in FY26 (organic +8.6%). Since then: secondary sales +12.7% in Q1FY27 vs the market\'s 13.0%, acute back to 10.9%, chronic 15.8%, volume 4.7%. We model 10.5-11% domestic growth (market pace); management\'s aspiration of beating the market again is our bull case, not our base.' },
    { h: 'BSV: the right asset, a full price, now de-risked financially', p: `~28x EBITDA for the only recombinant Anti-D, a fertility portfolio and an emerging-market biologics business. Growth recovered to 21% in Q1FY27 (domestic ~17%, international ~25%), but Mankind no longer discloses BSV's numbers. Net debt fell from ₹5,784 cr to ₹3,377 cr in five quarters (0.9x EBITDA); on our path Mankind is net cash by Mar-28 (₹${n0(-ndCo[2])} cr).` },
    { h: 'Valuation: de-rated while the sector re-rated', p: `At ₹${n0(price)} the stock trades at ${n1(fwdNowAdj)}x our FY28E EPS before the BSV amortisation (${n1(fwdNowRep)}x reported) against a ${n1(HB.med)}x median since Nov-2023 (${n1(HR.med)}x on reported EPS); its trailing P/E is ${pc(drW.MANKIND)} vs its own median while pharma peers are +${SECTOR}%. The street (34-40x reported EPS) assumes the de-rating lasts; even on the post-Oct-2025 median (${n1(HB_post.med)}x) the value is above today's price. The DCF (₹${n0(mv('dcf').value)}) is the warning: the price, like the sector's, rests on the multiple.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): gross margin after higher West Asia-linked input costs, consumer healthcare\'s return to high-single-digit growth, BSV growth and the domestic business vs the market.',
    'Debt: ₹1,250 cr NCD due 16-Oct-2026 and the last ₹2,500 cr in Nov-2027; net cash by FY28E on our numbers, and with it the question of payout vs the next acquisition.',
    'Monthly IQVIA data: whether acute growth stays at market pace and chronic keeps ~1.1x the market.',
    'BSV: international approvals (FSH in Russia, more markets), Anti-D coverage; the India Anti-D patent runs to 2028.',
    'Income-tax appeals (₹1,909 cr of assessment adjustments before CIT(A)); the Vadodara biotech plant (capex 6-7% of FY27 revenue).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STREET_TP = ST.filter(s => s.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Revenue: ₹4,031 cr in Q1FY27, +13%', unit: 'Revenue (₹ crore), quarterly; BSV from 23-Oct-2024', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company investor presentations' },
      { type: 'hbar', title: 'Four-fifths is the Indian prescription market', unit: 'FY26 revenue by business (₹ crore)', x: LINES.map(l => LBL[l]), series: [{ name: 'FY26', values: LINES.map(l => BL.base[l]), fmt: 'num' }], labels: 'all', highlight: LBL.domesticRx, source: 'Q4FY26 investor presentation' },
    ] },
    { pair: [
      { type: 'column', title: 'Chronic share keeps rising: 40% in Q1FY27', unit: 'Chronic therapies, % of domestic sales ex-BSV (IQVIA)', x: P2.CHRONIC.x, series: [{ name: 'Chronic share', values: P2.CHRONIC.v, fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', min: 20, max: 45, source: 'AR FY26; Q1FY27 call' },
      { type: 'line', title: 'EBITDA margin: back to 26% after a weak FY26', unit: 'EBITDA margin (%), company reported, quarterly', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 18, max: 30, source: 'Company investor presentations (Q3FY26 adjusted: 25.9%)' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: flat through the deal, then growing again', unit: 'EPS (₹); FY27-29E = GAM (to shareholders)', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'Reported / to shareholders', values: [epsRep[2024], epsRep[2025], epsRep[2026], ...ownersEps.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }, { name: 'Before exceptional items and BSV amortisation', values: [Math.round((epsRep[2024] - X.EXC_AT[2024] / X.SHR[2024]) * 10) / 10, Math.round(byBase[2025] * 10) / 10, Math.round(byBase[2026] * 10) / 10, ...adjEps.map(v => Math.round(v * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM Research' },
      { type: 'column', title: 'Net debt: ₹5,784 cr to net cash by FY28E', unit: 'Net debt (₹ crore), company basis; FY27-29E = GAM', x: ['Mar-25', 'Mar-26', 'Jun-26', ...YRS], series: [{ name: 'Net debt', values: [5784, 3932, 3377, ...ndCo.slice(1).map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'Jun-26', source: 'Company decks; GAM Research' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma re-rated over Mankind's window (+${SECTOR}%); Mankind did not`, unit: `Trailing P/E at the 30-Sep-2026 close vs median since 1-Nov-2023 (%)`, x: [...[...PEER_SET].sort((a, c) => drW[c] - drW[a]).map(shortName), 'Mankind'], series: [{ name: 'vs median', values: [...[...PEER_SET].sort((a, c) => drW[c] - drW[a]).map(s => Math.round(drW[s] * 10) / 10), Math.round(drW.MANKIND * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'Mankind', source: 'Screener.in P/E series; asof-peers.js' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET_TP.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET_TP.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and summaries (Dec-2025 to Jul-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.bsv, P3.consumer, P3.exportsSec, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5b.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
