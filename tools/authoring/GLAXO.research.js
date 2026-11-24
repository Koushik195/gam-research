// GSK India report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, general medicines, vaccines, specialty and innovation, dealings with the parent, price control, moat, Q1FY27,
// earnings quality, ownership, governance, forecasts, street, valuation, risks, glossary, statement notes). Shared inputs
// in GLAXO.ctx.js. Forecast and valuation figures are live tokens ({{...}}) or computed from the model, so they follow
// assumptions.json. As of 30-Sep-2026.
const X = require('./GLAXO.ctx');
const { F, V, SC, n0, n1, pc1, SQ, QL, price, mv, MULT, HB, sBaseWk, epsSep, rating, withTp, peFY28, peSep28, SET_FACTOR, ownDr, derate, SET, shortName, shortDate, netCash26, BL, build, YRS, SA, innovShare, mosl, TR } = X;
const P2 = require('./GLAXO.part2'), P3 = require('./GLAXO.part3'), P4 = require('./GLAXO.part4'), P5 = require('./GLAXO.part5'), P6 = require('./GLAXO.part6');
const PEAK = 3439.6, fromPeak = (price / PEAK - 1) * 100;

const cover = {
  headline: 'A century-old brand franchise turning into a launch platform for GSK\'s pipeline: on the street\'s P/E method and its own history GSK India has {{dcf.upside|chg}} upside; slow base growth and the DCF are the caution',
  lead: `GlaxoSmithKline Pharmaceuticals (GSK India) is 75% owned by GSK plc: ₹3,822 cr of FY26 revenue, more than 80% from general medicines (Augmentin, Calpol, T-Bact, Ceftum, Betnovate), the rest from India's leading private vaccine business and a young innovation portfolio (Shingrix, Nucala, Trelegy, Jemperli, Zejula; Blenrep next). It discloses no royalty to its parent, has no debt and ₹${n0(X.netCashCo)} cr of net cash. Revenue grew only 5.5% a year in FY21-26, but margins rose from 20% to 34%, so EPS before one-offs more than doubled. After a fire at a contract manufacturer cut FY26 growth to 2%, Q1FY27 revenue rose 16.5%. At ₹${n0(price)} the stock is ${Math.abs(Math.round(fromPeak))}% below its Jun-2025 peak and trades at ${n1(peSep28)}x Sep-28E EPS against a ${n1(HB.med)}x forward median since 2021, while pharma peers trade ${SET_FACTOR}% above their own medians. The street values GSK India on **P/E** (Motilal Oswal 35x; Nirmal Bang 50x). We forecast EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E, below Motilal Oswal. Applying **${MULT.base}x to Sep-28E EPS of ₹${n1(epsSep.base)}** (the ${n1(HB.med)}x median on EPS before one-offs × the pharma sector factor of 1.082) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}, which says the price already capitalises a lot. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The base business is back to growth after a lost year', p: 'Q1FY27 standalone revenue rose 15% (9-10% underlying after a 4-5pp soft base): Augmentin +12.8%, T-Bact +17.9%, Calpol +8.1%, all gaining share (IQVIA evolution indices 101-106), and paediatric vaccines held a 26% value share. FY26 had lost more than ₹100 cr of general-medicine sales to the fire. Management guides the base business to 8-10% a year; we model +10.5% in FY27 (the lost sales return) and +8% after.' },
    { h: 'An innovation engine that finally moves the numbers', p: `Innovative products rose from ~2% of sales a year earlier to 6% in Q4FY26 and 7% in Q1FY27: Shingrix +65% (₹100 cr+ a year), Nucala patients doubling, oncology (~₹10 cr a month) a year after launch. Blenrep (multiple myeloma), Arexvy (RSV vaccine) and bepirovirsen (hepatitis B) are next, with launch lags now 6-8 months behind the US. We model innovation at +${BL.growth.innovation.join('% / +')}%, ${n1(innovShare(2))}% of FY29E sales, below management's 10-15% ambition.` },
    { h: 'A cash machine, but the parent decides', p: `Capex is ~1.4% of sales, 89-99% of profit has been paid out for four years and ₹${n0(TR.mar26.total)} cr of cash and liquid funds remain. ROE is ~45%. The catches: ~40% of sales is under price control, the general-medicine base grew ~5% a year for a decade, and GSK plc (75%) has used the listed company to sell land, a plant and two brands (the last to a group company), and ~₹890 cr was written off on the Vemgal plant after the Zinetac recall.` },
    { h: 'Valuation: fair on history, rich on cash flows', p: `GSK India trades at ${n1(peFY28)}x FY28E and ${n1(peSep28)}x Sep-28E against a ${n1(HB.med)}x forward median since 2021 (on EPS before one-offs), and its trailing P/E is ${pc1(ownDr)} below its five-year median while the pharma set is ${SET_FACTOR}% above. The house rule gives ${MULT.base}x and {{dcf.tp|inr}}. A DCF at an 11.3% cost of equity gives only ₹${n0(mv('dcf').value)}; Motilal Oswal's 35x on our FY28E EPS gives ₹${n0(Math.round(35 * F.eps[1] / 10) * 10)}. The upside needs earnings delivery and the market to keep paying its history.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the peak acute season, the first full quarter without supply constraints, and margins after Q1\'s front-loaded promotion.',
    'Blenrep launch (guided for Q2 or Q3FY27) and Arexvy launch; first oncology access in public "CARE" accounts (management: six to eight months from May-2026).',
    'Bepirovirsen (hepatitis B) approval: management expected marketing authorisation within FY27.',
    'Monthly IQVIA data: Augmentin, Calpol, T-Bact share; Shingrix and Trelegy volumes.',
    'Price policy: April-2027 WPI revision for NLEM drugs; any new NLEM list (2022\'s added two or three large GSK brands).',
    'FY27 dividend (May-2027) and any special dividend; any further asset sales or related-party deals with GSK group companies.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const sortedPeers = [...SET].sort((a, c) => derate[c] - derate[a]);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Quarterly revenue: +16.5% in Q1FY27 after a fire-hit FY26', unit: 'Revenue from operations (₹ crore, consolidated)', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.revenue), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Screener.in quarterly results' },
      { type: 'stacked', title: `Innovation rises from ~5% to ${Math.round(innovShare(2))}% of revenue on our build`, unit: 'Revenue (₹ crore); FY26 split GAM estimate, FY27-29E GAM', x: ['FY26', ...YRS], series: [{ name: 'Base business', values: [BL.base.base, ...build.base.map(Math.round)], fmt: 'num' }, { name: 'Innovation portfolio', values: [BL.base.innovation, ...build.innovation.map(Math.round)], fmt: 'num' }], minLabel: 150, source: 'Company (innovation % of sales); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 20% (FY21) to 34% (FY26); we hold ~34-35%', unit: 'EBITDA margin before other income (%)', x: 'fin.labels', from: 'FY19', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 40, source: 'Screener.in; GAM estimates' },
      { type: 'column', title: 'EPS before one-offs: ₹27 (FY21) to ₹60 (FY26); ~11% a year next', unit: 'EPS before one-offs (₹); FY27-29E = GAM', x: [...SA.filter(a => a.fy !== 'FY20').map(a => a.fy), ...YRS], series: [{ name: 'EPS', values: [...SA.filter(a => a.fy !== 'FY20').map(a => a.epsBeforeOneOffs), ...F.eps.map(e => Math.round(e * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Annual reports (continuing operations before exceptional items); GAM' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(peFY28)}x on FY28E vs a ${n1(HB.med)}x median since 2021`, unit: 'Price ÷ next full-year EPS before one-offs (x), weekly', x: sBaseWk.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBaseWk.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HB.med, text: `Median ${n1(HB.med)}x` }, { v: MULT.base, text: `Our target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; EPS before one-offs; GAM estimates FY27-28E' },
      { type: 'hbar', title: `Pharma re-rated (+${SET_FACTOR}%); GSK India de-rated (${pc1(ownDr)})`, unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...sortedPeers.map(shortName), 'GSK India'], series: [{ name: 'vs median', values: [...sortedPeers.map(s => Math.round(derate[s] * 10) / 10), Math.round(ownDr * 10) / 10], fmt: 'pct' }], labels: 'all', highlight: 'GSK India', source: 'Screener.in P/E series; asof-peers.js' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...withTp.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...withTp.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes (Aug-2025 to Aug-2026); GAM Research' },
      { type: 'hbar', title: 'Target, cross-checks and scenarios', unit: '₹ per share', x: ['DCF', 'Bear case', 'CMP', 'GAM target', 'EV/EBITDA', 'Bull case'], series: [{ name: 'Value', values: [Math.round(mv('dcf').value), SC.bear.tp, price, V.tp, Math.round(mv('ev').value), SC.bull.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM target', source: 'GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.genmed, P3.vaccines, P3.innovation, P3.parent, P3.pricing, P3.moat, p.financials, p.margins, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
