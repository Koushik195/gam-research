// Belrise Industries report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, two-wheeler core, cars/trucks and H-One, new verticals and trading, moat, Q1FY27, earnings quality,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// BELRISE.ctx.js; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./BELRISE.ctx');
const { F, V, SQ, QL, n0, n1, n2, price, mv, PE12, sector12, MULT, epsSep, rating, live, medTp, sd, lines, mergerAccretion } = X;
const P2 = require('./BELRISE.part2'), P3 = require('./BELRISE.part3'), P4 = require('./BELRISE.part4'), P5 = require('./BELRISE.part5'), P6 = require('./BELRISE.part6');

const cover = {
  headline: 'A well-run two-wheeler parts maker priced for a story it has not yet written: we initiate with ' + rating,
  lead: `Belrise Industries (formerly Badve Engineering) makes chassis, exhaust systems, fuel tanks and other metal and plastic parts, mainly for two-wheelers (82% of manufacturing revenue). Revenue grew 15% a year over FY22-26; the May-2025 IPO repaid debt and profit rose 40% in FY26. Since then the founder's family has sold down, the company has raised ₹1,700 cr in a QIP for acquisitions (aerospace, cars and trucks), and the share price has risen 2.7x from the ₹90 IPO price. We forecast EPS of ₹${n2(F.eps[0])} / ₹${n2(F.eps[1])} / ₹${n2(F.eps[2])} for FY27-29E on the post-QIP share count. The street values Belrise on **P/E on FY28E EPS** (Jefferies and JM Financial 26x). The house rule (its own forward P/E median over the 12 months to ${X.ASOF_TXT}, ${n1(PE12.med)}x, cut by the ${Math.abs(sector12).toFixed(1)}% same-window auto-component de-rating) gives **${MULT.base}x Sep-28E EPS of ₹${n2(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A good operator in a slow market', p: 'Belrise has out-grown two-wheeler volumes for a decade (revenue >11.5% a year over FY16-25 vs 1.4% for domestic 2W volumes) by adding parts per bike: content per vehicle rose from ~₹12,000 to ~₹20,000 in 18 months (including the promoter companies being merged). Manufacturing margins are steady at 13.7-13.9%, plants are highly automated (890+ robots) and it is now winning business at the two fast-growing 2W makers where it was small (already a ~₹200 cr a year run-rate at one of them). We model manufacturing revenue +{{as.lineBuild.mfgGrowth.0|pct0}} / +{{as.lineBuild.mfgGrowth.1|pct0}} / +{{as.lineBuild.mfgGrowth.2|pct0}}.' },
    { h: 'But the numbers are less than they look', p: `19% of revenue is trading of goods at a ~5% margin (−19% in Q1FY27); the largest customer is losing share, so Q1FY27 2W/3W revenue grew 18% against industry production of 20-25%; Q1 margin fell 90bp; ROCE is 14-15%. The FY26 profit jump came from the IPO repaying debt and will not repeat. Our EPS grows ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E (pro forma for the QIP), helped by interest on the QIP cash.` },
    { h: 'The new stories are small, early and bought', p: 'Aerospace and defence (Chester Hall in the UK, SDM in France, an alliance with Israel\'s Plasan Sasa), US solar-tracker parts and tipper bodies (Hyva) together are a few per cent of revenue today; SDM lost ₹9.5 cr in its first quarter. Management wants aerospace and defence at 10% of revenue and will spend most of the ₹1,657 cr of net QIP money on acquisitions in FY27: we do not model deals we cannot see.' },
    { h: 'Valuation: full for a 14% ROCE business', p: `At ₹${n2(price)} the stock trades at ${n1(X.fwdNow)}x our FY28E and ${n1(X.sepNow)}x Sep-28E EPS, in the upper part of its ${n1(PE12.min)}-${n1(PE12.max)}x range over the last year, while auto-component peers trade ${Math.abs(sector12).toFixed(1)}% below their own 12-month medians. The street (targets ₹250-280) includes the pending merger of two promoter companies (+${n1(mergerAccretion)}% to our Sep-28E EPS if completed; NCLT approval was still awaited on ${X.ASOF_TXT}) and more growth than we do. The DCF (₹${n0(mv('dcf').value)}) is far below the price.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether the Q1 steel and wage costs were passed on, trading recovered, and the new 2W/3W programmes started.',
    'NCLT approval of the BAPL/EITSPL merger: adds ~₹112 cr of profit (FY25) for 4.72 cr new shares; would lift our EPS by ~' + Math.round(mergerAccretion) + '%.',
    'Use of the QIP money: management intends to deploy most of ₹1,657 cr in FY27, mainly acquisitions; price paid and earnings acquired decide whether this adds value.',
    'Start of production in Q4FY27: exhaust/fuel tank/chassis for a fast-growing 2W/3W OEM, a top OEM\'s 2W chassis, US solar-tracker assemblies, 3W brakes.',
    'Hyva tipper business closing (Q3FY27) and the aero-engine localisation talks management mentioned in Aug-2026.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const yoyQ = X.M.quarterly.sales.map((s, i, a) => (i >= 4 ? Math.round((s / a[i - 4] - 1) * 1000) / 10 : null)).slice(-6);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹9,509 cr in FY26; ₹${n0(F.sales[2])} cr by FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'stacked', title: 'Manufacturing grows 15-18% a year; trading shrinks as a share', unit: 'Revenue (₹ crore)', x: ['FY25', 'FY26', ...lines.map(r => r.y)], series: [{ name: 'Manufacturing', values: [X.A25.manufacturing, X.A26.manufacturing, ...lines.map(r => Math.round(r.mfg))], fmt: 'num' }, { name: 'Trading of goods', values: [X.A25.trading, X.A26.trading, ...lines.map(r => Math.round(r.trading))], fmt: 'num' }], minLabel: 500, source: 'Company decks; GAM estimates FY27-29E' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Two- and three-wheelers: four-fifths of manufacturing revenue', unit: 'Manufacturing revenue (₹ crore)', x: QL, series: [{ name: '2W/3W', values: SQ.map(q => q.twoThreeW), fmt: 'num' }, { name: 'Cars', values: SQ.map(q => q.pv), fmt: 'num' }, { name: 'Trucks/buses', values: SQ.map(q => q.cv), fmt: 'num' }, { name: 'Others', values: SQ.map(q => q.others), fmt: 'num', color: '#7a5195' }], minLabel: 120, source: 'Company decks (Q4FY25 and Q1FY26 from the comparatives); Q2-Q3FY26 split not published in the decks we read' },
      { type: 'column', title: 'Revenue growth has slowed from 27% to 8-14% a quarter', unit: 'Revenue growth year on year (%)', x: X.M.quarterly.labels.slice(-6), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', source: 'Quarterly results as reported (Screener.in)' },
    ] },
    { pair: [
      { type: 'line', title: 'Manufacturing margin 13-14%; trading 4-6%', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'Manufacturing', values: SQ.map(q => Math.round(q.mfgEbitda / q.manufacturing * 1000) / 10), fmt: 'pct' }, { name: 'Trading', values: SQ.map(q => Math.round((q.ebitda - q.mfgEbitda) / q.trading * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 16, source: 'Company decks; trading = reported EBITDA less manufacturing EBITDA' },
      { type: 'column', title: `Net profit: ₹497 cr in FY26, ₹${n0(F.pat[2])} cr in FY29E`, unit: 'Net profit (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates (incl. ~₹70-80 cr a year of interest on the QIP cash)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(X.fwdNow)}x FY28E now vs a ${n1(PE12.med)}x 12-month median`, unit: 'Price ÷ next full-year EPS (x)', x: X.fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: X.fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; EPS: FY26 pro forma, GAM FY27-28E (post-QIP shares)' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n2(price)}`, x: [...live.map(s => `${s.broker} (${sd(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...live.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Press reports of broker notes (Equitybulls, Multibagg, Business Today); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.core, P3.fourWheel, P3.newVerticals, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
