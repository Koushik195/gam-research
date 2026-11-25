// ONGC report, part B-6: valuation (street method, SOTP, core multiple from ONGC's own history, sector move, holding discount,
// OVL and unlisted parts, cross-checks, scenarios, sensitivity, peers).
const X = require('./ONGC.ctx');
const { M, F, V, AS, n0, n1, price, sh, ps, med, half, mv, CM, DISC, SOTP, coreSep, coreSepEps, impl, implRep, implMed, implP25, implP75, implMedRep, implNow, implSepNow, impliedAt, fyOf,
  sectorDr, k, subDr, USED, EXCL, PEER_SYMS, P, MED5, derate, shortName, listedMv, OVL, OVLPS, UNL, OPAL, FM, PEM, fmP25, fmP75, ASOF_TXT, medTp, S } = X;
const { ratingFor } = require('../../src/ratings');
const pctv = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const VP = AS.valuation.parts, sepCore = coreSep('base');
const partRows = VP.map((p, i) => [`**${p.name}**`, `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`, p.metricLabel]);
const tpOf = (m, d = DISC.base, ovl = OVL.base, unl = UNL.base) => Math.round((m * sepCore + listedMv * (1 - d / 100) + ovl + unl) / F.shares / 5) * 5;
const row = (lab, x, note) => { const m = half(x * k), tp = tpOf(m), up = (tp / price - 1) * 100; return [lab, `${n1(x)}x`, `${m}x`, n0(tp), pctv(up), ratingFor(up), note]; };
const exPeak = med(impl.filter(r => ![2023, 2027].includes(fyOf(r.d))).map(r => r.pe)), since23 = med(impl.filter(r => r.d >= '2023-04-01').map(r => r.pe));
const WK = S.charts.price.Price.filter(([d]) => d >= '2021-04-01' && d <= X.ASOF);
const reDer = d => med(WK.map(([dd, p]) => impliedAt(dd, p, 'norm', d).pe));
const IQ = impl.filter((_, i) => i % 2 === 0);
const peerMedPe = med(USED.map(s => P[s].pe));
const usdCore = [1, 2].map(i => X.build[i].crude * (1 - AS.build.cessPct[i] / 100 - AS.build.royaltyPct[i] / 100) / AS.build.brent[i]).reduce((a, b) => a + b, 0) / 2 * (1 - X.T); // core profit per US$1/bbl, Sep-28E

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: the core at ${CM.base}x, the stakes at market less ${DISC.base}%, gives {{dcf.tp|inr}}`,
  blocks: [
    { h: 'How the street values ONGC' },
    { p: `The street values ONGC as a **sum of the parts (SOTP)**: standalone earnings on a P/E of 6.3-8x (JM 7x FY28E core EPS, MOSL 6.5x Dec-27E, PL 8x FY28E, Geojit 6.3x, BOB 6.5x on consolidated EPS), plus the listed stakes at market less a 20-25% holding discount (Geojit 50%), plus ONGC Videsh. We use the same structure. Two choices matter: we capitalise **core** profit (before the dividends the stakes pay, which would otherwise be counted twice, and before one-offs), and we **derive** the core multiple from what the market has actually paid for ONGC since 2021 rather than adopt a broker's multiple.` },
    { h: 'Our sum of the parts' },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Value (₹ cr)', '₹ / share', 'Basis'], wide: [3], rows: [
      ...partRows,
      { hl: true, cells: ['**Equity value / target (rounded)**', '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs price ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research; NSE closes on 30-Sep-2026; ONGC AR FY26 note 11.1' } },
    { p: `We add no separate net cash: interest on ONGC's ₹28,660 cr of cash and its site-restoration fund is inside core profit, and lease costs are inside it too. OPaL is in at ONGC's cost (₹${n0(OPAL)} cr), which is generous for a plant that lost money at EBITDA in Q1FY27; the bear case sets it to zero.` },
    { h: `The core multiple: ${CM.base}x Sep-28E core profit` },
    { p: `ONGC has never traded without its stakes, so its own P/E history mixes the E&P business with HPCL, MRPL, IOC, GAIL and Petronet. We separate them the way our SOTP does: every week since April 2021 we take ONGC's market value, deduct the listed stakes at that week's prices less the same ${DISC.base}% discount, ONGC Videsh (₹${OVLPS.base} a share) and the unlisted holdings at cost, and divide what is left by the next full year's core profit (actual, our estimates for FY27-28). That is the **implied forward P/E the market paid for the core business**.` },
    { exhibit: { type: 'table', title: 'Deriving the core multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Own history', `Implied forward P/E on core profit, ${impl.length} weekly points from Apr-2021 to ${ASOF_TXT}: median **${n1(implMed)}x** (25th-75th percentile ${n1(implP25)}-${n1(implP75)}x). No trough years in the window (forward years FY23-FY28; FY21, a trough year under the rule, falls before it). On reported core profit (PAT less dividends): ${n1(implMedRep)}x.`, `${n1(implMed)}x`],
      ['2. Sector move', `Oil-and-gas peers traded a median **${sectorDr >= 0 ? '+' : ''}${n1(sectorDr)}%** against their five-year median P/E on ${ASOF_TXT} (${USED.length} names; HPCL excluded as distorted; upstream ${pctv(subDr.upstream)}, OMCs ${pctv(subDr.omc)}, gas ${pctv(subDr.gas)})`, `${n1(implMed)}x × ${k.toFixed(3)} = ${n1(implMed * k)}x → **${CM.base}x** (nearest half-turn)`],
      ['3. Growth vs the street', `Core profit falls ~${Math.round((1 - X.CP.base[1].core / X.CP.base[0].core) * 100)}% from the FY27E peak as Brent normalises, then grows ~3%; production growth is guided at ~2-3% a year. The street's 6.3-8x assumes more than ONGC has been paid`, 'No uplift; street multiples shown as sensitivity'],
      ['4. Peers today', `The same peers trade at a median ${n1(peerMedPe)}x trailing earnings; Oil India ${n1(P.OIL.pe)}x, Coal India ${n1(P.COALINDIA.pe)}x. ONGC's own trailing P/E (incl. the stakes) was ${n1(P.ONGC.pe)}x vs a five-year median of ${n1(MED5.ONGC)}x`, 'ONGC trades at a discount to upstream peers, consistently'],
      ['5. Returns', 'Standalone return on net worth 9.9% (FY26) and 11.3% (FY25), 17.0% in FY22 (AR), below or around a 12.5% cost of equity', 'No case for a premium'],
      ['**Result**', `**${CM.base}x** Sep-28E core profit of ₹${n0(sepCore)} cr (₹${n1(coreSepEps('base'))} a share). At ${ASOF_TXT} the market paid ${n1(implSepNow)}x on the same basis`, `Bull ${CM.bull}x (75th percentile × sector), bear ${CM.bear}x (25th percentile × sector)`],
    ], source: 'Screener.in weekly prices (ONGC and the five listed stakes), ONGC AR FY26, GAM Research; peers\' P/E at the 30-Sep-2026 close' } },
    { pair: [
      { type: 'line', title: `Implied forward P/E on core profit since Apr-2021: median ${n1(implMed)}x`, unit: 'x', x: IQ.map(r => r.d), series: [{ name: 'Implied core P/E', values: IQ.map(r => Math.round(r.pe * 10) / 10), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: CM.base, text: `Our multiple ${CM.base}x (median ${n1(implMed)}x)`, color: '#cf8f1f' }], source: 'GAM Research (method above)' },
      { type: 'hbar', title: `Oil-and-gas peers vs their five-year median P/E: median ${sectorDr >= 0 ? '+' : ''}${n1(sectorDr)}%`, unit: `Trailing P/E on ${ASOF_TXT} vs five-year median (%)`, x: PEER_SYMS.map(s => shortName(s) + (EXCL.includes(s) ? ' (excluded)' : '')), series: [{ name: 'vs median', values: PEER_SYMS.map(s => (EXCL.includes(s) ? 0 : Math.round(derate[s] * 10) / 10)), fmt: 'pct' }], labels: 'all', source: 'Screener.in P/E history; GAM Research (HPCL +792%, shown as 0)' },
    ] },
    { exhibit: { type: 'table', title: 'The multiple decides the call: target under other windows and the street\'s multiples', head: ['Basis', 'Own median', 'Core multiple', 'Target (₹)', 'vs price', 'Rating under the rule', 'Note'], wide: [6], rows: [
      row('**Since Apr-2021, normalised core profit (base)**', implMed, 'House rule: Apr-2021 window'),
      row('Since Apr-2021, reported core profit', implMedRep, 'FY22 tax write-back, FY23 exceptional left in'),
      row('Leaving out weeks whose forward year was a price spike (FY23, FY27)', exPeak, 'A judgement: the rule removes troughs, not peaks'),
      row('Since Apr-2023 only', since23, 'After the windfall-tax shock of 2022'),
      ...[6.5, 7, 8].map(m => { const tp = tpOf(m), up = (tp / price - 1) * 100; return [`Street multiple ${m}x (${m === 7 ? 'JM' : m === 8 ? 'PL' : 'MOSL, BOB'})`, '–', `${m}x`, n0(tp), pctv(up), ratingFor(up), 'Not what the market has paid']; }),
    ], source: `GAM Research; other parts at base. ${X.ruleText}` } },
    { p: `**Reading the table.** Our base follows the rule (median since Apr-2021, no trough years). It is pulled down by two price spikes (forward years FY23 and FY27), when the market rightly refused to capitalise peak profit; leaving those weeks out, or starting in Apr-2023, gives ~${n1(exPeak)}x and a HOLD-range target. We keep the rule: at ${ASOF_TXT} the market paid ${n1(implSepNow)}x on our normalised Sep-28E core profit, above the median, so the share already prices in more than ONGC's history supports. The street's 6.5-8x would give ₹${n0(tpOf(6.5))}-${n0(tpOf(8))}: the whole gap between us and the street is the multiple.` },
    { h: 'The holding discount, ONGC Videsh and the unlisted parts' },
    { exhibit: { type: 'table', title: 'The discount hardly changes the target, because the core multiple is measured with the same discount', head: ['Discount on the listed stakes', 'Core multiple re-derived', 'Target (₹)', 'Stakes after discount (₹/share)'], rows: [0, 20, 25, 50].map(d => { const m = half(reDer(d) * k); return [`${d}%${d === DISC.base ? ' (ours, house rule; JM, BOB)' : d === 25 ? ' (MOSL, PL)' : d === 50 ? ' (Geojit)' : ''}`, `${m}x`, n0(tpOf(m, d)), n0(listedMv * (1 - d / 100) / sh)]; }), source: 'GAM Research; other parts at base' } },
    { p: `ONGC Videsh: base ₹${OVLPS.base} a share (₹${n0(OVL.base)} cr), the midpoint of the two broker values we have (JM ₹${OVLPS.bear}, MOSL ₹${OVLPS.bull}); bull MOSL, bear JM. Unlisted subsidiaries, JVs and associates at ONGC's cost (₹${n0(UNL.base)} cr, mostly OPaL and ONGC Green); bear case ₹${n0(UNL.bear)} cr (OPaL at zero).` },
    { h: 'Cross-checks (shown, not used in the target)' },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts**', '**Target**', 'Core on Sep-28E core profit; stakes at market less discount; OVL; unlisted at cost', `${CM.base}x; discount ${DISC.base}%`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E on standalone EPS', 'Cross-check', `Sep-28E EPS ₹${n1(mv('pe').metric)}`, `${PEM.base}x (bull ${PEM.bull}x, bear ${PEM.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pctv(mv('pe').vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF (standalone + investments at book)', 'Cross-check', 'FCFF FY28-37E, cost of equity 12.5%, terminal growth 1%', '–', '{{dcf.blend.methods.2.value|num}}', pctv(mv('dcf').vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs price', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**Why the cross-checks differ.** The P/E cross-check (ONGC's own forward P/E on reported standalone EPS since Apr-2021, ${n1(FM.median)}x, times the sector move: ${PEM.base}x) gives ₹${n0(mv('pe').value)}, close to our target: the market has priced ONGC at ~5-6x total EPS for five years. The DCF gives ₹${n0(mv('dcf').value)} because it assumes ~45-50% EBITDA margins forever, no windfall tax and no state-directed investments, and adds ONGC's investments at book value (₹1,13,379 cr). The gap between the DCF and the market is the policy discount investors have applied since 2021; we do not assume it closes.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs price', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Core ${CM.bull}x.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Brent US$${AS.build.brent.join(' / ')} (FY27-29E); ${CM.base}x Sep-28E core profit; stakes at 30-Sep prices less ${DISC.base}%; OVL ₹${OVLPS.base}; unlisted at cost.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Core ${CM.bear}x.`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Target sensitivity (₹/share): core multiple across, Sep-28E core profit down the side', head: ['Core profit \\ multiple', '2.5x', '3.5x', '4.5x', '5.5x', '7.0x'], rows: [0.8, 0.9, 1, 1.1, 1.2].map(f => [`₹${n0(sepCore * f)} cr${f === 1 ? ' (base)' : ''}`, ...[2.5, 3.5, 4.5, 5.5, 7].map(m => n0(Math.round((m * sepCore * f + listedMv * (1 - DISC.base / 100) + OVL.base + UNL.base) / F.shares / 5) * 5))]), source: `GAM Research; ±10% core profit ≈ ±US$${n1(sepCore * 0.1 / usdCore)}/bbl of Brent in FY28-29E (crude only, after royalty, cess and tax)` } },
    { exhibit: { type: 'table', title: 'Listed peers and stakes', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'Five-year median P/E (x)', 'vs median', 'ROE'], rows: ['ONGC', ...PEER_SYMS, 'MRPL'].map(s => [shortName(s) + (EXCL.includes(s) ? ' (excluded)' : s === 'ONGC' ? ' (standalone)' : s === 'MRPL' ? ' (stake; not in set)' : ''), n0(P[s].mcapCr), P[s].revenue ? n0(P[s].revenue) : '–', P[s].ebitdaMargin != null ? P[s].ebitdaMargin + '%' : '–', n1(P[s].pe), n1(MED5[s]), pctv(derate[s]), P[s].roe != null ? P[s].roe + '%' : '–']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (consolidated for peers)` } },
  ],
};

module.exports = { valuation };
