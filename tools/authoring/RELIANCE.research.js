// Reliance Industries report, part B: cover, the story in charts, and the merge of part2-8. Shared inputs in
// RELIANCE.ctx.js (model, valuation derivations, street); forecast and valuation figures are live tokens or model values.
const X = require('./RELIANCE.ctx');
const { F, V, SA, SQ, QL, n0, n1, pc, price, shares, seg, sep, E, MULT, rating, postQ1, medTp, streetMult, dcfTp, mv, VAL, sotpAt, A26 } = X;
const P2 = require('./RELIANCE.part2'), P3 = require('./RELIANCE.part3'), P4 = require('./RELIANCE.part4'), P5 = require('./RELIANCE.part5'), P6 = require('./RELIANCE.part6'), P7 = require('./RELIANCE.part7'), P8 = require('./RELIANCE.part8');
const D = VAL.D, FY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], FYE = [...FY, 'FY27E', 'FY28E', 'FY29E'];
const segE = (k, hk) => [...SA.map(a => a[hk]), ...seg(k).adjEbitda.map(Math.round)];

const cover = {
  headline: 'Good businesses, fair price: our numbers match the street, its multiples do not match the market',
  lead: `Reliance is four businesses in one stock: refining and petrochemicals (O2C), Jio, Reliance Retail and a pre-revenue New Energy build-out, with gas fields, JioStar and consumer brands on the side. Q1FY27 was a record (EBITDA ₹54,067 cr, +10%) because the Iran war lifted fuel cracks, while Retail stalled and Jio kept compounding. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E, close to the street. The street values RIL on a **sum of the parts** and so do we, but with each segment priced like its listed peers on the house rule: **O2C ${MULT.o2c.base}x, Jio ${MULT.jio.base}x, Retail ${MULT.ret.base}x Sep-28E EV/EBITDA** (E&P ${MULT.ep.base}x, the brokers' median), New Energy at cost, less net debt, spectrum dues and minorities: **{{dcf.tp|inr}} ({{dcf.upside|chg}}). We initiate with ${rating}.** Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}. At the street's own multiples our numbers give ₹${n0(streetMult)}, which is where the street's median target (₹${n0(medTp)}) sits: the gap is the multiple, not the earnings.`,
  arguments: [
    { h: 'O2C: a war windfall that the state shares', p: `Q1FY27 O2C EBITDA ₹17,010 cr (+17%) on diesel and jet cracks of ~$63/bbl, but export duties, PSU under-recoveries, $20/bbl crude premiums and 10x freight took much of it. We model ₹${n0(seg('o2c').adjEbitda[0])} cr in FY27E falling to ₹${n0(seg('o2c').adjEbitda[1])} cr in FY28E. Listed refiners have traded at a median ${n1(D.o2c.level)}x forward EBITDA since 2021 and sit ${Math.abs(Math.round(D.o2c.move))}% below their own history now (EV/EBITDA): hence ${MULT.o2c.base}x, half the street's ~7x.` },
    { h: 'Jio: the IPO will set the price we cannot', p: `Q1FY27 EBITDA ₹20,865 cr (+15%), 53.3% margin, 533 mn subscribers, without a tariff rise. The DRHP is filed and SEBI cleared it on 28-Aug-2026; media talk of ~US$130-137 bn. Bharti Airtel has traded at ${n1(D.jio.rows[0].med)}x forward EBITDA since 2021 (telecom set ${n1(D.jio.level)}x, ${pc(D.jio.move)} now): we use ${MULT.jio.base}x on Sep-28E EBITDA of ₹${n0(E.jio)} cr; the street uses 11.5-12x.` },
    { h: 'Retail: growth slowed, the spend went up', p: `Q1FY27 gross revenue +7.4% (+11.6% like-for-like) and EBITDA −1% as stores turn into dark stores for 30-minute delivery. Management targets 2x EBITDA over FY27-29; we model ~1.5x. Listed retailers traded at a median ${n1(D.ret.level)}x forward EBITDA since 2021 but sit ${Math.abs(Math.round(D.ret.move))}% below their own history now: ${MULT.ret.base}x vs the street's 27-35x.` },
    { h: 'What you pay', p: `At ₹${n0(price)} the stock trades at ${n1(price / sep(F.eps))}x Sep-28E EPS, against its own forward median of ${n1(X.FM.median)}x since 2021 (P/E value ₹${n0(mv('pe').value)}). Our DCF (no working-capital release) gives ₹${n0(dcfTp)}. Three methods, three answers, the target in the middle: we would buy below ₹${n0(X.buyBelow)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Jio Platforms IPO: price band and dates (media expected late October to around Diwali); the listing price re-marks a third of our SOTP.',
    'Q2FY27 results (due by mid-November 2026): O2C margin under export duties; Retail growth against the 2x EBITDA plan.',
    'A mobile tariff increase (street assumes ~15% in FY27-28; none in our FY27E).',
    'Strait of Hormuz: a durable ceasefire would cut fuel cracks; fortnightly export-duty reviews (diesel ₹20/l from 16-Sep-2026).',
    'New Energy: 40 GWh battery line commissioning this year, power from Kutch, partners for the rest of the green-fuel capacity after the US$3 bn Samsung C&T ammonia contract.',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'EBITDA by segment: consumer businesses now earn more than energy', unit: 'Company-definition EBITDA (₹ crore)', x: FYE, series: [{ name: 'O2C', values: segE('o2c', 'o2cEbitda'), fmt: 'num' }, { name: 'Oil & gas', values: segE('ep', 'epEbitda'), fmt: 'num' }, { name: 'Jio (Digital)', values: segE('jio', 'jioEbitda'), fmt: 'num' }, { name: 'Retail', values: segE('ret', 'retEbitda'), fmt: 'num' }, { name: 'Others incl. treasury', values: segE('oth', 'othEbitda'), fmt: 'num', color: '#8a8f98' }], minLabel: 45000, source: 'AR segment notes, presentations; GAM estimates. FY26 Others include the ₹8,924 cr Asian Paints gain.' },
      { type: 'line', title: 'Quarterly EBITDA: O2C swings, Jio climbs every quarter', unit: '₹ crore', x: QL, series: [{ name: 'O2C', values: SQ.map(q => q.o2cEbitda), fmt: 'num' }, { name: 'Jio (Digital)', values: SQ.map(q => q.jioEbitda), fmt: 'num' }, { name: 'Retail', values: SQ.map(q => q.retEbitda), fmt: 'num' }], labels: 'last', source: 'Quarterly presentations' },
    ] },
    { pair: [
      { type: 'line', title: 'O2C EBITDA margin on gross revenue: 8-11% whatever crude does', unit: 'O2C EBITDA ÷ gross revenue (%)', x: QL, series: [{ name: 'O2C margin', values: SQ.map(q => Math.round(q.o2cEbitda / q.o2cRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 6, max: 12, source: 'Quarterly presentations' },
      { type: 'line', title: 'Retail margin slipping as hyper-local delivery scales', unit: 'Retail EBITDA ÷ gross revenue (%)', x: QL, series: [{ name: 'Retail margin', values: SQ.map(q => Math.round(q.retEbitda / q.retRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 5, max: 9, source: 'Quarterly presentations' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Our multiples vs the street\'s (Sep/Jun-28E EV/EBITDA)', unit: 'EV/EBITDA (x)', x: ['O2C: GAM', 'O2C: street', 'Jio: GAM', 'Jio: street', 'Retail: GAM', 'Retail: street'], series: [{ name: 'Multiple', values: [MULT.o2c.base, VAL.streetMed('o2c'), MULT.jio.base, VAL.streetMed('jio'), MULT.ret.base, VAL.streetMed('ret')], fmt: 'x' }], labels: 'all', source: 'GAM (peer-derived, RELIANCE.val.js); street = median of MOSL, Emkay, BOBCAPS, Antique (Jul-Sep 2026)' },
      { type: 'column', title: 'Where the target comes from (₹ per share)', unit: '₹ per share', x: ['O2C', 'E&P', 'Jio (66%)', 'Retail (84%)', 'JioStar + RCPL', 'New Energy', 'Net debt & dues'], series: [{ name: '₹/share', values: [X.val(/^Oil to/) / shares, X.val(/^Oil and Gas/) / shares, (X.val(/^Jio Platforms/) + X.val(/33\.57% of Jio/)) / shares, (X.val(/^Retail/) + X.val(/16\.44%/)) / shares, (X.val(/^JioStar/) + X.val(/^Reliance Consumer/)) / shares, X.NE / shares, X.netClaims / shares].map(Math.round), fmt: 'num' }], labels: 'all', source: 'GAM Research SOTP' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes and press reports, 17-Jul to 10-Sep-2026 (median ₹${n0(medTp)}), GAM Research` },
      { type: 'line', title: 'The market already pays less: RIL\'s own forward P/E', unit: 'Price ÷ next-year EPS (x)', x: X.FM.series.map(s => s[0]), series: [{ name: 'Forward P/E', values: X.FM.series.map(s => Math.round(s[1] * 10) / 10), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: Math.round(X.FM.median * 10) / 10, text: `Median since Apr-2021: ${n1(X.FM.median)}x` }], source: 'Screener.in prices and EPS; GAM forecasts for FY27-28E' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.o2c, P3.ep, P3.jio, P4.retail, P4.newbiz, P4.moat, p.financials, P4.q1, p.capital, P5.quality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P6.street, P6.valuation, P7.derivation, P7.risks, p.statements, P8.glossary],
  statementNotes: P8.statementNotes,
};
