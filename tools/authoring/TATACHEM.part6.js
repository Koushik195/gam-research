// Tata Chemicals report, part B-6: valuation (street table, SOTP, multiple derivation with trough
// years left out, cross-checks, scenarios, DCF, peers).
const X = require('./TATACHEM.ctx');
const { M, F, V, AS, D, n0, n1, price, sh, mcap, P, VP, mv, opsMult, impliedOpsMult, evChart, evMed, evMedAll, evAtClose, evTroughYears, evByFy, peFm, tpEvFy28, claimsTotal, claimsTurns,
  sectorDerate, derivedGroup, commodityDerates, evClaimsPs, PEERS, PEER_SYMS, peerMed, derate, ASOF_TXT, rating, sep28 } = X;

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dmy = d => { const [y, mo, da] = d.split('-'); return `${+da}-${MON[+mo - 1]}-${y.slice(2)}`; };
const streetTable = D.street.brokers.map(b => [b.broker, b.rating, n0(b.tp), dmy(b.date), b.method, b.multiple || '–', b.thesis || b.note || '–']);
const partRows = P.map((p, i) => [`**${p.name}**`, p.metric != null && !VP[i].netCash ? `{{dcf.sotp.parts.${i}.metric|num}}` : '–', VP[i].multiple ? `${p.mult}x` : '–', `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`, VP[i].note || '']);
const ev = mv('ev'), dc = mv('dcf'), so = mv('sotp');
const pctv = v => `${v >= 0 ? '+' : ''}${Math.round(v)}%`;

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: sum of the parts gives {{dcf.tp|inr}}',
  blocks: [
    { h: 'How the street values Tata Chemicals' },
    { p: 'Brokers value Tata Chemicals as a **sum of the parts (SOTP)**: each geography on EV/EBITDA (enterprise value to operating profit), the listed Rallis stake and the quoted Tata-group shares at market value less a ~20% holding-company discount, less net debt, pension provisions and minorities. Motilal Oswal (Jul-2026) and JM Financial (Oct-2025) publish the full build; Kotak has used the same method. P/E is not usable: profit after minorities was a loss in FY26 and is close to zero in our FY27-28E. We use the street\'s method so our target is comparable; the difference to the street is mostly our lower EBITDA.' },
    { exhibit: { type: 'table', title: 'How the street values Tata Chemicals (latest note per broker, to 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method', 'Multiples', 'Thesis / note'], wide: [5, 6], rows: [
      ...streetTable,
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '30-Sep-26', '**SOTP EV/EBITDA, Sep-28E**', `**India ${P[0].mult}x, US ${P[1].mult}x, UK/Kenya ${P[2].mult}x; Rallis and shares at −20%**`, 'Soda ash recovery slower than the street assumes'] },
    ], source: 'Broker notes and rating records to 30-Sep-2026; n.d. = not disclosed' } },
    { h: 'Our sum of the parts' },
    { p: 'The target is a 12-month price, so each business is valued on the EBITDA the market will look at in September 2027: **Sep-28E** (half FY28E, half FY29E). Rallis and the Tata-group shares are valued at their 30-Sep-2026 market prices less 20%. Because the model\'s net cash already contains all investments at March-2026 book value, we remove the quoted shares at book and add them back at market. JVs (IMACID, Tata Industries) and unquoted stakes stay at book.' },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Sep-28E EBITDA (₹ cr)', 'EV/EBITDA', 'Value (₹ cr)', '₹ / share', 'Basis'], wide: [5], rows: [
      ...partRows,
      { hl: true, cells: ['**Equity value / target (rounded)**', '', '', '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs price ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research' } },
    { h: `How we derive the multiples` },
    { p: `House rule: start from the stock's own one-year-forward multiple since Apr-2021, leaving out trough years. On P/E that leaves almost nothing: every forward year except FY28E is a trough year (${peFm.troughYears.join(', ')} against the FY20 demerger gain and the FY24-27 collapse; FY26-27 are losses), and the remaining median is ~${Math.round(peFm.median)}x (all dates ${Math.round(peFm.medianAll)}x): meaningless. So we apply the same trough rule to the stock's forward EV/EBITDA, and then check our segment multiples against it.` },
    { exhibit: { type: 'table', title: 'Deriving the multiples', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['1. Own forward P/E (house rule)', `Median since Apr-2021 ~${Math.round(peFm.median)}x after leaving out trough years ${peFm.troughYears.join(', ')} (FY26-27E are losses, also excluded); ${Math.round(peFm.medianAll)}x on all dates`, 'Not usable: earnings are too depressed'],
      ['2. Own forward EV/EBITDA (same trough rule)', `Median ${n1(evMed)}x since Apr-2021, leaving out ${evTroughYears.join(', ')} (forward EBITDA below half of FY23's); ${n1(evMedAll)}x on all dates. By forward year: ${Object.entries(evByFy).map(([k, v]) => `${k} ${v}x`).join(', ')}. ${n1(evAtClose)}x at the ${ASOF_TXT} close (FY28E)`, 'The market pays 6-8x on normal EBITDA and 10-12x on trough EBITDA'],
      ['3. Sector de-rating', `Indian commodity chemical peers' EV/EBITDA vs five-year medians: GHCL ${derate('GHCL')}%, Gujarat Alkalies ${derate('GUJALKALI')}%, DCM Shriram ${derate('DCMSHRIRAM')}% (median ${Math.round((sectorDerate - 1) * 100)}%)`, `${n1(evMed)}x × ${sectorDerate} ≈ ${n1(derivedGroup)}x for the group`],
      ['4. Growth', `Sep-28E EBITDA ₹${n0(ev.metric)} cr is still 22% below the FY22-24 average (₹2,995 cr); FY26-29E EBITDA CAGR ~11%, from a trough`, 'No premium: recovery is assumed, not peak'],
      ['5. Peers at 30-Sep-2026', `Trailing EV/EBITDA: GHCL ${n1(PEERS.GHCL.evEbitda)}x (Indian soda ash), Gujarat Alkalies ${n1(PEERS.GUJALKALI.evEbitda)}x, DCM Shriram ${n1(PEERS.DCMSHRIRAM.evEbitda)}x, Rallis ${n1(PEERS.RALLIS.evEbitda)}x`, 'India 8x (premium to GHCL for salt, bicarb, prebiotics); overseas 5-6x'],
      ['6. Returns', 'Group ROCE 3% (FY26) vs ~11% WACC; US goodwill written down', 'No premium to peers'],
      ['7. Street', 'India 7-9x, US 5-6.5x, UK 5-8x, Kenya 5-6.5x; Rallis and shares at −20% (Motilal Oswal, JM)', `Our multiples sit inside the range: operations blend ${n1(opsMult)}x`],
      [`**Result**`, `On the yardstick-2 basis our target implies ${n1(tpEvFy28)}x FY28E. That basis ignores ₹${n0(claimsTotal)} cr of claims the SOTP deducts (Rallis' 45% minority, ALCAD, pensions, holding-company discounts, the FY26 dividend): ${n1(claimsTurns)}x. Like for like, ${n1(tpEvFy28 + claimsTurns)}x`, `In line with the ${n1(derivedGroup)}x derived group multiple`],
    ], source: `Screener.in (prices, balance sheets, peer multiples to ${ASOF_TXT}), broker notes, GAM Research` } },
    { pair: [
      { type: 'line', title: 'Forward EV/EBITDA history and our derived multiple', unit: 'EV ÷ next full-year EBITDA (x)', x: evChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: evChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: evMed, text: `Median ex-trough: ${evMed}x` }, { v: derivedGroup, text: `De-rated: ${derivedGroup}x`, color: '#cf8f1f' }], source: 'Screener.in; EV = market value + borrowings − cash − all investments; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['Sum of the parts (target)', 'Group EV/EBITDA', 'Group EV/EBITDA after claims', 'DCF', 'Share price'], series: [{ name: 'Value', values: [Math.round(so.value), Math.round(ev.value), Math.round(ev.value - evClaimsPs), Math.round(dc.value), price], fmt: 'inr' }], labels: 'all', highlight: 'Sum of the parts (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**Sum of the parts**', '**Target**', 'Sep-28E unit EBITDA; shares and Rallis at market −20%', `India ${P[0].mult}x (bull ${VP[0].multiple.bull}x, bear ${VP[0].multiple.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['Group EV/EBITDA', 'Cross-check', `Sep-28E EBITDA ₹${n0(ev.metric)} cr`, `${ev.mult}x (bull ${ev.multiple.bull}x, bear ${ev.multiple.bear}x)`, '{{dcf.blend.methods.1.value|num}}', pctv(ev.vsTarget), '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', '15-year FCFF, WACC 11%, g 5%', `implies ${n1(V.intrinsicTp / F.eps[2])}x FY29E EPS`, '{{dcf.blend.methods.2.value|num}}', pctv(dc.vsTarget), '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs price', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks tell us.** Both are well above the SOTP, and for the same reasons: they count the Tata-group shares at book with no discount, ignore the ₹1,190 cr of pension provisions and (for EV/EBITDA) value 100% of Rallis and the US partnership although Tata Chemicals owns 55% and 50%. Deducting those claims (~₹${n0(evClaimsPs)} a share), the EV/EBITDA cross-check falls to ~₹${n0(ev.value - evClaimsPs)}, close to the share price. The DCF (₹${n0(dc.value)}) also assumes the EBITDA margin climbs back to 16% over 15 years: it pays for a full cycle recovery. Read together: the stock is priced for a recovery our base case does not yet see. At the market price, the operations are valued at ~${n1(impliedOpsMult)}x our Sep-28E EBITDA, against our ${n1(opsMult)}x.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs price', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Multiples: India ${VP[0].multiple.bull}x, US ${VP[1].multiple.bull}x; shares and Rallis at −10%.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', 'US EBITDA margin 2.5% / 7% / 9% (FY27-29E); India 21% / 19.5% / 20%; no value for the Tata Sons stake; India 8x, US 6x Sep-28E EBITDA.'] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Multiples: India ${VP[0].multiple.bear}x, US ${VP[1].multiple.bear}x; shares and Rallis at −30%.`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'The Tata Sons option (not in our base case)', head: ['Value of the 2.53% stake (₹ cr)', '₹ per share, gross', 'At a 50% discount', 'Target with it (base otherwise)'], rows: [10000, 15000, 25000].map(v => [n0(v), n0(v / sh), n0(v / 2 / sh), `₹${n0(Math.round((V.sotp.equity + v / 2) / sh / 10) * 10)}`]), source: 'Press estimates of the stake (Sep-2026); GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: model net cash at Mar-27E (all investments at book, net of debt)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research; tax line includes minorities (54% in FY29E and after)' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): WACC down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', '5-yr median EV/EBITDA', 'P/E (x)', 'ROE'], rows: PEER_SYMS.map(s => [s === 'TATACHEM' ? '**Tata Chemicals**' : PEERS[s].name.replace(/ Ltd$/, ''), n0(PEERS[s].mcapCr), n0(PEERS[s].revenue), PEERS[s].ebitdaMargin + '%', n1(PEERS[s].evEbitda), n1(peerMed[s].ev5y), PEERS[s].pe > 0 && PEERS[s].pe < 200 ? n1(PEERS[s].pe) : 'n.m.', PEERS[s].roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}; Rallis standalone; Tata Chemicals ROE on profit after minorities` } },
  ],
};

module.exports = { valuation };
