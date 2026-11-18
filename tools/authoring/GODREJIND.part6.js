// Godrej Industries report, part B-6: valuation (street method, SOTP, holding-company discount
// derivation from GIL's own history, chemicals multiple, Godrej Capital P/B, cross-checks, scenarios, peers).
const X = require('./GODREJIND.ctx');
const { forwardSeries } = require('./valuation-blend');
const { M, F, V, AS, n0, n1, price, sh, mcap, P, VP, ps, mv, chemSep28, listedMv, ltvBase, discHist, discNow, discMedAll, discMedRecent, discMedListed, discMin, discMax, derived, ebRatio,
  pChem, pGc, pNd, gcBook, peFm, PEERS, peerHist, galaxyDerate, CHEM_PEERS, HFC_PEERS, rating, ASOF_TXT, A26 } = X;

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const qlab = d => `${MON[+d.slice(5, 7) - 1]}-${d.slice(2, 4)}`;
const pe = mv('pe'), so = mv('sotp');
const pctv = v => `${v >= 0 ? '+' : ''}${Math.round(v)}%`;
const partRows = P.map((p, i) => [`**${p.name}**`, VP[i].seg ? `{{dcf.parts.${i}.metric|num}}` : '–', VP[i].multiple ? `${p.mult}x` : '–', `{{dcf.parts.${i}.value|num}}`, `{{dcf.parts.${i}.perShare|num}}`, VP[i].metricLabel]);
const discRows = discHist.map(r => [qlab(r.d), n0(r.close), n0(r.mcap), n0(r.listed), n0(r.gcV), n0(r.chemV), n0(r.nd), n0(r.ltv), `${n1(r.disc)}%`, `${n1(r.discListed)}%`]);
const exDisc = ltvBase; // look-through value before the discount (base)
const tpAt = (d, gcm) => Math.round((exDisc + (gcm - 2.0) * gcBook) * (1 - d / 100) / sh / 10) * 10;
const hs = peFm.series; // trough year (FY24 forward EPS) left out, as in the median

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: sum of the parts, less a ${derived.base}% holding-company discount, gives {{dcf.tp|inr}}`,
  blocks: [
    { h: 'How the street values GIL' },
    { p: `GIL is valued as a **sum of the parts (SOTP)**: the listed stakes at market (or at the broker's targets for them), chemicals on a multiple, Godrej Capital on book value, less the holding company's own net debt and less a **holding-company discount** for the fact that GIL's shareholders cannot get at the underlying value (no dividends, no buybacks, control stays with the family). Coverage is thin: ICICI Securities used this method with a 50% discount on the listed stakes, but its last note we found is from August 2024 (target ₹1,090), and no other broker published a target in the two years to ${ASOF_TXT}. P/E on consolidated EPS is not how the stock is priced: most of that profit belongs to minorities or comes from GPL's lumpy accounting.` },
    { h: 'Our sum of the parts' },
    { p: `Listed stakes are at their NSE closes on ${ASOF_TXT} (GCPL ₹850.00, GPL ₹1,628.50, GAVL ₹623.55). Chemicals is on Sep-28E EBITDA (half FY28E, half FY29E), the earnings the market will look at in a year. Godrej Capital is on GIL's share of book. Holding-company net debt is our estimate for June 2026. The discount is applied to the whole look-through value, the same way we measure it in history below.` },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Sep-28E EBITDA (₹ cr)', 'Multiple', 'Value (₹ cr)', '₹ / share', 'Basis'], wide: [5], rows: [
      ...partRows,
      { hl: true, cells: ['**Equity value / target (rounded)**', '', '', '**{{dcf.equity|num}}**', '**{{dcf.tp|num}}**', 'vs price ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research; NSE closes on 30-Sep-2026; GIL AR FY26 and Q1FY27 deck' } },
    { h: 'The holding-company discount: derived from GIL\'s own history' },
    { p: `House method: at every quarter-end since June 2021 we compare GIL's market value with its **look-through value** on the same conventions as our SOTP: the three listed stakes at that day's market value (from GIL's own quarterly decks), Godrej Capital at 2.0x GIL's invested cost (cost ≈ GIL's share of book: ₹3,913 cr vs ₹3,960 cr at Mar-26), chemicals at ${X.chemMult.base}x the last reported full-year EBITDA (before FY25, PBIT × ${n1(ebRatio)}, the FY25-26 ratio), other investments at cost, less holding-company net debt (March figures, straight-line between years). The result over 21 quarter-ends: median **${n1(discMedAll)}%**, range ${n1(discMin)}-${n1(discMax)}%. Measured against the listed stakes alone the median is ${n1(discMedListed)}%: chemicals and Godrej Capital roughly offset the holding company's debt.` },
    { exhibit: { type: 'table', title: 'GIL\'s discount to look-through value at each quarter-end (₹ crore)', head: ['Quarter-end', 'GIL close (₹)', 'GIL market value', 'Listed stakes', 'Godrej Capital (2.0x cost)', `Chemicals (${X.chemMult.base}x EBITDA)`, 'Holdco net debt', 'Look-through value', 'Discount', 'Discount to listed stakes only'], rows: [
      ...discRows,
      { hl: true, cells: [`**${ASOF_TXT}**`, `**${n0(price)}**`, `**${n0(discNow.mcap)}**`, `**${n0(discNow.listed)}**`, `**${n0(discNow.gcV)}**`, `**${n0(discNow.chemV)}**`, `**${n0(discNow.nd)}**`, `**${n0(discNow.ltv)}**`, `**${n1(discNow.disc)}%**`, `**${n1(discNow.discListed)}%**`] },
      { hl: true, cells: ['**Median, Jun-21 to Jun-26 (21 quarters)**', '', '', '', '', '', '', '', `**${n1(discMedAll)}%**`, `**${n1(discMedListed)}%**`] },
      { hl: true, cells: ['**Median since Sep-24 (8 quarters)**', '', '', '', '', '', '', '', `**${n1(discMedRecent)}%**`, ''] },
    ], source: 'GIL quarterly decks (stake values, investments at cost), NSE bhavcopies (closes), AR FY26 and Screener standalone (net debt; approximate before FY25), GAM Research' } },
    { p: `**Judging the median against today.** On ${ASOF_TXT} the discount was ${n1(discNow.disc)}%, half the five-year median. The history has two regimes. Until June 2024 the discount never fell below 57% (GIL kept borrowing, paid nothing, and Godrej Capital was a new cash sink). Since September 2024 it has stayed between ${n1(Math.min(...X.discRecent.map(r => r.disc)))}% and ${n1(Math.max(...X.discRecent.map(r => r.disc)))}%, with a median of ${n1(discMedRecent)}%: the 2024 settlement settled control, the promoter group bought up to 74.6% (the free float is now ~15%), Godrej Capital was ring-fenced under Godrej Investment, and in April 2026 management promised to list Godrej Capital and chemicals. We think the second regime is the relevant one, so our **base case uses its median, ${derived.base}%**. The bull case keeps the ${ASOF_TXT} level (${derived.bull}%: the market is right to price in the listings); the bear case returns to the five-year median (${derived.bear}%: the listings drift and the holding company keeps borrowing). We do not go lower in the base case because nothing has yet changed the cash reality: no dividend, more debt, and no outside money in Godrej Capital.` },
    { pair: [
      { type: 'line', title: 'Discount to look-through value since Jun-2021', unit: 'Discount (%)', x: [...discHist.map(r => qlab(r.d)), 'Sep-26'], series: [{ name: 'Discount', values: [...discHist.map(r => Math.round(r.disc * 10) / 10), Math.round(discNow.disc * 10) / 10], fmt: 'pct' }], labels: 'last', min: 0, max: 80, lines: [{ v: derived.bear, text: `Bear ${derived.bear}%: five-year median` }, { v: derived.base, text: `Base ${derived.base}%: median since Sep-24`, color: '#cf8f1f' }], source: 'GAM Research (method above)' },
      { type: 'hbar', title: 'What each discount implies for the target', unit: '₹ per share (base-case parts)', x: [`${derived.bull}% (as of ${ASOF_TXT})`, `${derived.base}% (base)`, '50% (I-Sec\'s rate)', `${derived.bear}% (five-year median)`], series: [{ name: 'Target', values: [tpAt(derived.bull, 2), tpAt(derived.base, 2), tpAt(50, 2), tpAt(derived.bear, 2)], fmt: 'inr' }], labels: 'all', highlight: `${derived.base}% (base)`, lines: [{ v: 'P.last', axis: 'x', text: 'Price', color: '#b4232a' }], source: 'GAM Research' },
    ] },
    { h: `The chemicals multiple: ${VP[0].multiple.base}x Sep-28E EBITDA` },
    { exhibit: { type: 'table', title: 'Deriving the chemicals multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Own history', 'None: chemicals has never been listed separately', 'Use peers'],
      ['2. Closest listed peer', `Galaxy Surfactants: ${n1(PEERS.GALAXYSURF.evEbitda)}x trailing EBITDA on ${ASOF_TXT} vs a ${n1(peerHist.GALAXYSURF.ev5y)}x five-year median (${galaxyDerate}%); EBITDA margin ${PEERS.GALAXYSURF.ebitdaMargin}%, ROE ${PEERS.GALAXYSURF.roe}%`, 'The sector has de-rated by about a quarter'],
      ['3. Specialty peer', `Fine Organic: ${n1(PEERS.FINEORG.evEbitda)}x (median ${n1(peerHist.FINEORG.ev5y)}x); margin ${PEERS.FINEORG.ebitdaMargin}%`, 'A ceiling: GIL is mostly commodity'],
      ['4. Mix and volatility', 'Fatty acids, alcohols and glycerine ~66% of revenue; PBIT margin 7-17% over FY20-26; FY24 PBIT −64%', 'A discount to Galaxy'],
      ['5. Growth', `Sep-28E EBITDA ₹${n0(chemSep28)} cr vs FY26 ₹${n0(A26.chemEbitda)} cr: we already assume a recovery`, 'No premium'],
      ['6. Returns', '~17% pre-tax ROCE on segment capital in FY26 (assets ₹2,745 cr less liabilities ₹991 cr)', 'Around the cost of capital after tax; no premium'],
      ['**Result**', `${VP[0].multiple.base}x Sep-28E EBITDA = ${n1(VP[0].multiple.base * chemSep28 / F.seg.chem.adjEbitda[0])}x our FY27E and ${n1(VP[0].multiple.base * chemSep28 / A26.chemEbitda)}x a weak FY26 (Galaxy: ${n1(PEERS.GALAXYSURF.evEbitda)}x trailing). No premium to Galaxy on recovered earnings, because GIL's mix is more commodity`, `Bull ${VP[0].multiple.bull}x, bear ${VP[0].multiple.bear}x`],
    ], source: `Screener.in (multiples at the ${ASOF_TXT} close), GIL AR FY26, GAM Research` } },
    { h: 'Godrej Capital: 2.0x book' },
    { exhibit: { type: 'table', title: 'Godrej Capital against listed affordable-housing lenders', head: ['Lender', 'P/B on 30-Sep-2026', 'Five-year median P/B', 'FY26 ROE', 'Market value (₹ cr)'], rows: [
      ...HFC_PEERS.map(s => [PEERS[s].name.replace(/ Ltd$/, ''), `${peerHist[s].pbNow}x`, `${peerHist[s].pb5y}x`, `${PEERS[s].roe}%`, n0(PEERS[s].mcapCr)]),
      { hl: true, cells: ['**Godrej Capital (GAM)**', '**2.0x** (bull 3.0x, bear 1.0x)', 'unlisted', '~6%', `${n0(pGc.value)} (GIL share)`] },
    ], source: 'Screener.in (P/B at 30-Sep-2026 scaled to the NSE close, ROE FY26); GIL AR FY26' } },
    { h: 'Cross-checks (shown, not used in the target)' },
    { pair: [
      { type: 'line', title: 'Forward P/E on consolidated EPS since Apr-2021 (FY24 trough left out)', unit: 'Price ÷ next full-year EPS (x)', x: hs.map(x => x[0]), series: [{ name: 'Forward P/E', values: hs.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: peFm.median, text: `Median ex-FY24 trough: ${peFm.median}x` }], source: 'Screener.in prices; actual EPS, GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['Sum of the parts (target)', 'P/E cross-check', 'Listed stakes at I-Sec\'s 50% only', 'Share price'], series: [{ name: 'Value', values: [Math.round(so.value), Math.round(pe.value), Math.round(listedMv * 0.5 / sh), price], fmt: 'inr' }], labels: 'all', highlight: 'Sum of the parts (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts**', '**Target**', 'Stakes at market; chemicals Sep-28E EBITDA; Godrej Capital on book; less net debt and discount', `Discount ${derived.base}% (bull ${derived.bull}%, bear ${derived.bear}%)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['P/E on consolidated EPS', 'Cross-check', `Sep-28E EPS ₹${n1(pe.metric)}`, `${pe.mult}x (bull ${pe.multiple.bull}x, bear ${pe.multiple.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pctv(pe.vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs price', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**Why the cross-checks differ.** The P/E cross-check (${pe.mult}x, the stock's own forward median since Apr-2021 with the FY24 trough left out; bull/bear at the 75th/25th percentiles) gives ₹${n0(pe.value)}, above the SOTP, because consolidated EPS counts GPL's and GCPL's accounting profit that never reaches GIL as cash and ignores the holding company's debt. I-Sec's own method (listed stakes less 50%, before anything else) gives ~₹${n0(listedMv * 0.5 / sh)}. We have no DCF: a cash-flow model of a group that contains a lender and a developer is not meaningful, and GIL's own cash flow is negative by design.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs price', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Chemicals ${VP[0].multiple.bull}x; discount ${derived.bull}%.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Stakes at 30-Sep-2026 prices; chemicals EBITDA margin 11.5-12%, ${VP[0].multiple.base}x Sep-28E; Godrej Capital 2.0x book; discount ${derived.base}% (median since the 2024 re-rating).`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Chemicals ${VP[0].multiple.bear}x; discount ${derived.bear}%.`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Target sensitivity (₹/share): holding-company discount down the side, Godrej Capital P/B across', head: ['Discount \\ P/B', '1.0x', '2.0x', '3.0x', '4.0x'], rows: [derived.bull, 40, derived.base, 50, derived.bear].map(d => [`${d}%`, ...[1, 2, 3, 4].map(g => n0(tpAt(d, g)))]), source: 'GAM Research; other parts at base' } },
    { exhibit: { type: 'table', title: 'Listed peers used', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'P/E (x)', 'P/B (x)', 'ROE'], rows: [...CHEM_PEERS, ...HFC_PEERS, 'GODREJCP', 'GODREJPROP', 'GODREJAGRO'].map(s => [PEERS[s].name.replace(/ Ltd$/, ''), n0(PEERS[s].mcapCr), n0(PEERS[s].revenue), PEERS[s].ebitdaMargin + '%', n1(PEERS[s].evEbitda), n1(PEERS[s].pe), peerHist[s] ? `${peerHist[s].pbNow}x` : '–', PEERS[s].roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; lenders' EBITDA margin is not meaningful` } },
  ],
};

module.exports = { valuation };
