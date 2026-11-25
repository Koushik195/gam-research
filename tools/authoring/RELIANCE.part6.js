// Reliance report, part 6: the street and the valuation (SOTP table, target and cross-checks, scenarios).
const X = require('./RELIANCE.ctx');
const { D, V, n0, n1, pc, rup, price, shares, SP, E, MULT, val, ST, postQ1, medTp, medAll, streetAt, streetMult, rating, shortDate, mv, dcfTp, B, FM, peM, impliedPe, impliedEv, ASOF_TXT, sep, F } = X;
const ps = v => n0(v / shares);
const nb = v => (v < 0 ? `(${n0(-v)})` : n0(v));

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: ${postQ1.filter(s => /buy|overweight|outperform|long/i.test(s.rating)).length} of ${postQ1.length} post-Q1 notes positive, median target ₹${n0(medTp)}`,
  blocks: [
    { p: `After the Q1FY27 results (17-Jul-2026) ${postQ1.length} houses we could trace kept positive ratings, with targets from ₹1,510 (Macquarie) to ₹1,870 (Goldman Sachs): median ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} from the ${ASOF_TXT} close of ₹${n0(price)}. FactSet's mean was ₹1,682 across 31 analysts (20-Jul). Every house that discloses its method uses a **sum of the parts: O2C at 6-7.5x EV/EBITDA, E&P 4.5-6x, Jio 11.5-12x, Retail 27-35x, New Energy at 1-2x committed capital**; Motilal Oswal also takes 25% off the Jio stake as a holding-company discount. The stock fell from ₹1,327 on results day to ₹${n0(price)} (−11%), and ~26% from its ₹1,612 high of 5-Jan-2026, while targets were not cut: the press blamed export levies, Middle East volatility, high capex and weak free-cash conversion, and the primary-only Jio IPO.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], wide: [0], rows: D.critiques.map(r => [rup(r)]), source: 'Broker notes and press to 30-Sep-2026; GAM Research' } },
  ],
};

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: a sum of the parts gives {{dcf.tp|inr}}; the street's ₹${n0(medTp)} median needs multiples its peers no longer get`,
  blocks: [
    { h: 'How the street values RIL' },
    { p: 'We use the street\'s method so our target is comparable: each segment on EV/EBITDA on the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), new businesses at invested or transaction value, less net debt at the target date (Sep-27E), spectrum dues and leases, and less what other shareholders own of Jio and Retail. "At our numbers" applies each broker\'s multiples to our Sep-28E EBITDA and net debt.' },
    { exhibit: { type: 'table', title: 'How the street values the stock', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiples', 'On', 'At our numbers (₹)', 'Thesis'], wide: [4, 7], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method, rup(s.multiple || 'not disclosed'), s.on, streetAt[s.broker] ? n0(streetAt[s.broker]) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**SOTP**', `**O2C ${MULT.o2c.base}x, E&P ${MULT.ep.base}x, Jio ${MULT.jio.base}x, Retail ${MULT.ret.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Peer multiples have de-rated; ours follow them'] },
    ], source: 'MOSL, Emkay and BOBCAPS result notes (PDFs); others via Business Today (20-Jul, 10-Sep-2026), Business Standard roundups (search summaries), MarketScreener, Trendlyne. Older notes are the latest we found for that broker.' } },
    { h: `Our sum of the parts: O2C ${MULT.o2c.base}x, Jio ${MULT.jio.base}x, Retail ${MULT.ret.base}x` },
    { exhibit: { type: 'table', title: 'Sum of the parts (₹ crore unless stated)', head: ['Part', 'Metric', 'Multiple (bull / bear)', 'Value', '₹ / share', 'Basis'], wide: [5], rows: [
      ...SP.map(p => { const a = X.AS.valuation.parts.find(q => q.name === p.name); const m = a.multiple ? `${n1(Math.abs(a.multiple.base))}x (${n1(Math.abs(a.multiple.bull))}x / ${n1(Math.abs(a.multiple.bear))}x)` : (a.adj && a.adj.bull !== a.adj.base ? `bull ${n0(a.adj.bull)} / bear ${n0(a.adj.bear)}` : '–');
        return [/^Less|^Add/.test(p.name) ? p.name : `**${p.name}**`, p.metric ? `Sep-28E EBITDA ${n0(p.metric)}` : rup(a.metricLabel || ''), m, nb(p.value), nb(p.value / shares), rup(a.note || '')]; }),
      { hl: true, cells: ['**Equity value / target**', '', '', `**${n0(V.sotp.equity)}**`, '**{{dcf.tp|inr}}**', 'vs CMP ₹{{P.last|n0}}: {{dcf.upside|chg}}'] },
      ['Bull / bear', '', '', '', '{{scen.bull.tp|inr}} / {{scen.bear.tp|inr}}', 'Scenario earnings and multiples'],
    ], source: 'GAM Research (assumptions.json valuation.parts; multiples written by RELIANCE.sync.js from RELIANCE.val.js)' } },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target'], rows: [
      ['**Sum of the parts**', '**Target**', 'Sep-28E EBITDA by segment; net debt Sep-27E', `O2C ${MULT.o2c.base}x, Jio ${MULT.jio.base}x, Retail ${MULT.ret.base}x`, '**{{dcf.blend.methods.0.value|num}}**', '–'],
      ['P/E (own history)', 'Cross-check', `Sep-28E EPS ₹${n1(sep(F.eps))}`, `${peM.base}x (own forward median since Apr-2021: ${n1(FM.median)}x)`, '{{dcf.blend.methods.1.value|num}}', pc(mv('pe').vsTarget)],
      ['DCF (ours, no working-capital release)', 'Cross-check', 'FCFF FY28-37E, WACC 11%, g 5%, net debt and dues at Mar-27E', '–', n0(dcfTp), pc((dcfTp / V.tp - 1) * 100)],
      ['Street median target', 'Reference', `${postQ1.length} post-Q1 notes`, '–', n0(medTp), pc((medTp / V.tp - 1) * 100)],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** The target implies ${n1(impliedPe)}x Sep-28E EPS and ${n1(impliedEv)}x group EBITDA. RIL's own forward P/E has a median of ${n1(FM.median)}x since 2021 (no trough years), which would give ₹${n0(mv('pe').value)}: the market used to pay that when refiners, telecom and retail peers were all richer than they are now; we do not add the stock's own history to the base (§7c). Our DCF, which strips out the engine's working-capital release, gives ₹${n0(dcfTp)}: it says the heavy, low-return capex plan is not obviously worth more than the parts. The target sits between the two.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiples with no sector de-rating: O2C ${MULT.o2c.bull}x, Jio ${MULT.jio.bull}x, Retail ${MULT.ret.bull}x; New Energy at 2x cost.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `O2C EBITDA ₹${n0(E.o2c)} cr, Jio ₹${n0(E.jio)} cr, Retail ₹${n0(E.ret)} cr (Sep-28E) at ${MULT.o2c.base}x / ${MULT.jio.base}x / ${MULT.ret.base}x.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiples at the peers' 25th percentile, de-rated: O2C ${MULT.o2c.bear}x, Jio ${MULT.jio.bear}x, Retail ${MULT.ret.bear}x; New Energy at half cost.`],
    ], source: 'GAM Research. Net debt, dues and fixed-value parts as in the base.' } },
  ],
};

module.exports = { street, valuation };
