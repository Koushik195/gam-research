// Info Edge report, part B-6: valuation (street method, SOTP, Recruitment multiple, holding-company discount from Info
// Edge's own history, cross-checks, scenarios, sensitivity, peers).
const X = require('./NAUKRI.ctx');
const { M, F, V, AS, n0, n1, price, sh, ps, mv, med, RECX, REX, OTHX, DISC, SOTP, recPatSep, reSep, othSep, sectorDr, derate, MED5, PR, PEERS, discHist, discNow, discMedAll, discMedRecent,
  discRecent, RECENT_FROM, discMax, listedMv, UNL, CASH, FM, PEM, impMed25, impMed0, moslRecX, moslReX, moslOthX, fwd, fyOf, ASOF_TXT, medTp, recPat } = X;
const { streetBlocks } = require('./valuation-blend');
const { ratingFor, ruleText } = require('../../src/ratings');
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const qlab = d => `${MON[+d.slice(5, 7) - 1]}-${d.slice(2, 4)}`;
const pctv = v => `${v >= 0 ? '+' : ''}${Math.round(v)}%`;
const VP = AS.valuation.parts, B = SOTP.base, pe = mv('pe'), dc = mv('dcf');
const other = B.re + B.oth + UNL + CASH;
const tpAt = (d, x) => Math.round((x * recPatSep('base') + other + listedMv * (1 - d / 100)) / F.shares / 10) * 10;
const discAt = x => med(discRecent.map(r => (1 - (r.mc - (r.core + (x - RECX.base) * fwd(fyOf(r.d)).pat) - r.cash - UNL) / r.L) * 100));
const DSENS = [[`Sep-21 to Jun-26 median (${n1(discMedAll)}%), floored at 0% (bull)`, DISC.bull], [`Median since ${qlab(RECENT_FROM)} (our base)`, DISC.base], [`Level on ${ASOF_TXT}`, Math.round(discNow.disc)], ['JM Financial (May-2026)', 25], [`Widest since ${qlab(RECENT_FROM)}, Jun-26 (bear)`, DISC.bear]];
const discRows = discHist.map(r => [qlab(r.d), n0(r.nPx), n0(r.mc), n0(r.L), n0(r.core), n0(r.cash + UNL), n0(r.implied), `${n1(r.disc)}%`]);
const yrs = (recPatSep('base') / recPat('base', 0));

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: Naukri at ${RECX.base}x, the stakes at market less ${DISC.base}%, gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('NAUKRI', {
      rating: X.rating, noOurEps: true,
      streetIntro: 'Brokers value Info Edge **part by part (sum of the parts)**: Recruitment on P/E (JM Financial) or a DCF (Motilal Oswal), 99acres on EV/sales or DCF, Jeevansathi and Shiksha on EV/sales, Eternal and PB Fintech at market (JM less a 25% holding-company discount; Motilal Oswal with none), other investments at book, plus cash. Consolidated P/E is not how the stock is priced: reported EPS mixes fair-value gains, write-offs and minorities, and carries none of the stakes\' value.',
      street: X.STR.filter(s => /^Current/.test(s.standing)).map(s => [s.broker, s.rating, s.tp, s.method, s.multiple.length > 60 ? s.multiple.slice(0, 57) + '...' : s.multiple, s.earningsYear, s.thesis]),
      ourThesis: `Recruitment ${RECX.base}x Sep-28E; 99acres ${REX.base}x sales; stakes at market less ${DISC.base}%; cash and unlisted at book`,
      streetSource: 'Broker notes and press reports published on or before 30-Sep-2026; n.d. = not disclosed',
      derivationTitle: `Our Recruitment multiple: ${RECX.base}x Sep-28E profit, and why`,
      derivation: [
        ['1. Own forward P/E (house starting point)', `Consolidated one-year-forward P/E since Apr-2021: median ${n1(FM.median)}x (FY24-25 forward years left out as troughs)`, 'Not usable for Naukri: it prices the stakes and fair-value gains; kept only as a cross-check'],
        ['2. Own implied Recruitment P/E', `Market value less the stakes, cash, unlisted, 99acres and Jeevansathi/Shiksha, ÷ next-year Recruitment profit, quarter-ends Sep-21 to Jun-26: median ${n1(impMed25)}x with the stakes at JM's 25% discount (${n1(impMed0)}x at none); ${n1(discNow.impliedRecX)}x / ${n1(discNow.impliedRecX0)}x on ${ASOF_TXT}`, 'The market paid 40-90x for Naukri until mid-2025; 19-37x since'],
        ['3. Sector move (§7c)', `Internet peers with a five-year P/E history, excluding Info Edge: IndiaMART only, ${pctv(derate.INDIAMART)} vs its median (${n1(PR.INDIAMART.pe)}x vs ${n1(MED5.INDIAMART)}x). Eternal, Swiggy, Paytm, PB Fintech (losses) and Nykaa (P/E above 1,000x) excluded`, `${n1(impMed25)}x × ${n1(1 + sectorDr / 100)} = ${n1(impMed25 * (1 + sectorDr / 100))}x: consistent with step 4; not applied again to current street multiples (Eternal precedent)`],
        ['4. The street on Naukri (current)', `JM Financial 30x (Jul-2026); Motilal Oswal's DCF value of Naukri (₹22,200 cr) = ${n1(moslRecX)}x our Sep-28E Recruitment profit`, `Median ${n1(med([30, moslRecX]))}x → **${RECX.base}x** (nearest half-turn)`],
        ['5. Peer level', `IndiaMART ${n1(PR.INDIAMART.pe)}x trailing on ${ASOF_TXT}: a smaller, slower-growing B2B classifieds business with lower margins`, `A floor: bear case ${RECX.bear}x`],
        ['6. Growth and returns', `Recruitment profit grows ~${Math.round((Math.pow(recPat('base', 2) / X.histRecPat('FY26'), 1 / 3) - 1) * 100)}% a year FY26-29E; capital employed is negative (customers pay in advance), so returns are effectively unlimited`, `${RECX.base}x Sep-28E = ${n1(RECX.base * yrs)}x FY27E: no premium added (§7c); bull ${RECX.bull}x (JM)`],
        ['99acres and Jeevansathi/Shiksha', `99acres: JM 4x Mar-28E sales, Motilal Oswal's DCF ${n1(moslReX)}x our Sep-28E sales. Jeevansathi/Shiksha: JM 2x sales; Motilal Oswal 10x FY27E sales (${n1(moslOthX)}x ours)`, `99acres **${REX.base}x** (median); Jeevansathi/Shiksha **${OTHX.base}x** (JM; Motilal Oswal's 10x is an outlier for a 4%-margin business with a shrinking Shiksha, worth ~₹${n0((10 - OTHX.base) * othSep('base') / sh)} a share more)`],
      ],
      crossNote: `Cross-checks: the DCF (consolidated, ${n1(V.ke)}% cost of equity, ${AS.dcf.terminalGrowth}% terminal growth) gives ₹${n0(dc.value)} (${pctv(dc.vsTarget)}), because it adds the stakes at their Mar-2026 book value net of deferred tax (Eternal ₹229 a share, against ₹320 on ${ASOF_TXT}). P/E at ${PEM.base}x Sep-28E consolidated EPS gives ₹${n0(pe.value)} (${pctv(pe.vsTarget)}): consolidated EPS carries only the cash's interest and none of the stakes' value, so it is not a useful check for a holding structure.`,
    }),
    { h: 'Sum of the parts in detail' },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case)', head: ['Part', 'Value (₹ cr)', '₹ / share', 'Basis'], wide: [3], rows: [
      ...VP.map((p, i) => [`**${p.name}**`, `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`, p.metricLabel]),
      { hl: true, cells: ['**Equity value / target (rounded)**', '**{{dcf.sotp.equity|num}}**', '**{{dcf.tp|num}}**', 'vs price ₹{{P.last|num}}: {{dcf.upside|chg}}'] },
    ], source: 'GAM Research; NSE closes on 30-Sep-2026; Info Edge AR FY26 and Q1FY27 deck' } },
    { bullets: VP.map(p => `**${p.name}:** ${p.note}`) },
    { h: 'The holding-company discount: derived from Info Edge\'s own history' },
    { p: `House method (as in our Godrej Industries and Tube Investments reports): at every quarter-end since Eternal listed (first quarter-end Sep-2021) we compare Info Edge's market value with what it owns on the same conventions as our SOTP: Recruitment at ${RECX.base}x the next fiscal year's profit after corporate costs (actual, our estimates for FY27-28), 99acres at ${REX.base}x and Jeevansathi/Shiksha at ${OTHX.base}x the next year's revenue, cash at the preceding March and unlisted investments at book. What is left of the market value is what the market pays for the two stakes; the **discount** is how far that falls short of their market value.` },
    { exhibit: { type: 'table', title: 'Info Edge\'s discount on its Eternal and PB Fintech stakes at each quarter-end (₹ crore)', head: ['Quarter-end', 'Price (₹)', 'Market value', 'Stakes at market', `Operating businesses (${RECX.base}x)`, 'Cash + unlisted', 'Left for the stakes', 'Discount'], rows: [
      ...discRows,
      { hl: true, cells: [`**${ASOF_TXT}**`, `**${n0(price)}**`, `**${n0(discNow.mc)}**`, `**${n0(discNow.L)}**`, `**${n0(discNow.core)}**`, `**${n0(discNow.cash + UNL)}**`, `**${n0(discNow.implied)}**`, `**${n1(discNow.disc)}%**`] },
      { hl: true, cells: [`**Median, Sep-21 to Jun-26 (${discHist.length} quarters)**`, '', '', '', '', '', '', `**${n1(discMedAll)}%**`] },
      { hl: true, cells: [`**Median since ${qlab(RECENT_FROM)} (${discRecent.length} quarters): our base, a judgement (see text)**`, '', '', '', '', '', '', `**${n1(discMedRecent)}%**`] },
    ], source: 'Screener.in weekly closes (quarter-ends; 30-Sep-2026 NSE close), Info Edge annual reports (shares held, cash), GAM Research. Negative = the market paid a premium.' } },
    { p: `**Judging the median against today.** On this convention Info Edge traded at a large *premium* to its look-through value for most of the window (median ${n1(discMedAll)}%). That is not a holding-company premium: until mid-2025 the market paid 40-90x for Naukri's profit (step 2 above), far more than the ${RECX.base}x we and the street use today, and the gap shows up as a negative "discount". Naukri's own re-rating ran through 2025: by Sep-2025 the implied multiple was ~37x and from Mar-2026 it has been 19-28x, inside today's street range. Only the quarter-ends since then measure a discount on a like-for-like basis: ${discRecent.map(r => `${qlab(r.d)} ${n1(r.disc)}%`).join(', ')}, median **${n1(discMedRecent)}%**, against **${n1(discNow.disc)}%** on ${ASOF_TXT}. So our base ${DISC.base}% is a judgement on a short window, close to today's level and well below JM's 25%. The bull case uses the full-window median floored at zero (no discount, as Motilal Oswal assumes); the bear case the widest quarter-end since Sep-2025 (${DISC.bear}%, Jun-2026). The tables below show what each choice does to the target and the rating.` },
    { pair: [
      { type: 'line', title: 'Discount on the stakes since Sep-2021 (negative = premium)', unit: 'Discount (%)', x: [...discHist.map(r => qlab(r.d)), 'Sep-26'], series: [{ name: 'Discount', values: [...discHist.map(r => Math.round(r.disc * 10) / 10), Math.round(discNow.disc * 10) / 10], fmt: 'pct' }], labels: 'last', min: -300, max: 60, lines: [{ v: DISC.base, text: `Base ${DISC.base}%`, color: '#cf8f1f' }, { v: 0, text: 'No discount' }], source: 'GAM Research (method above)' },
      { type: 'hbar', title: 'What each discount implies for the target', unit: '₹ per share (base-case parts)', x: DSENS.map(([l, d]) => `${d}%`), series: [{ name: 'Target', values: DSENS.map(([, d]) => tpAt(d, RECX.base)), fmt: 'inr' }], labels: 'all', highlight: `${DISC.base}%`, lines: [{ v: 'P.last', axis: 'x', text: 'Price', color: '#b4232a' }], source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'The discount decides the call: target and rating under each discount', head: ['Discount basis', 'Discount', 'Target (₹)', 'vs price', 'Rating under the rule'], rows: DSENS.map(([lab, d]) => { const tp = tpAt(d, RECX.base), up = (tp / price - 1) * 100; return [d === DISC.base ? `**${lab}**` : lab, `${d}%`, n0(tp), pctv(up), ratingFor(up)]; }), source: `GAM Research; other parts at base. ${ruleText}` } },
    { exhibit: { type: 'table', title: 'Target by Recruitment multiple and discount (₹ per share)', head: ['Recruitment P/E', ...[0, DISC.base, 25, DISC.bear].map(d => `${d}% discount`), 'Discount re-derived at this multiple'], rows: [20, RECX.base, 27, 30].map(x => { const d = Math.round(discAt(x)); return [`${x}x${x === RECX.base ? ' (ours)' : x === 30 ? ' (JM)' : x === 20 ? ' (IndiaMART)' : ''}`, ...[0, DISC.base, 25, DISC.bear].map(dd => n0(tpAt(dd, x))), `${d}% → ₹${n0(tpAt(d, x))}`]; }), source: 'GAM Research; other parts at base. Last column: the median discount since Sep-2025 measured with that multiple, and the target it gives' } },
    { callout: `**Read the last column first.** A higher Naukri multiple, measured consistently, also means a wider measured discount, so the target moves much less than the multiple: from ₹${n0(tpAt(Math.round(discAt(20)), 20))} at 20x to ₹${n0(tpAt(Math.round(discAt(30)), 30))} at 30x. Every 5 points of discount is ~₹${n0(listedMv * 0.05 / sh)} a share; every 10% move in Eternal ~₹${n0(X.etMv * 0.1 * (1 - DISC.base / 100) / sh)}.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Value / share', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}}'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Recruitment grows 12-14.5% at a 59-60% margin and earns ${RECX.base}x; 99acres reaches a 12% margin by FY29E; the stakes at market less ${DISC.base}%.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}}'],
    ], source: 'GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'Internet peers at the 30-Sep-2026 close', head: ['Company', 'Market value (₹ cr)', 'Trailing P/E', 'Trailing EV/EBITDA', 'FY26 revenue (₹ cr)', 'FY26 EBITDA margin'], rows: ['NAUKRI', ...X.PEER_SYMS].map(s => { const p = PR[s]; return [s === 'NAUKRI' ? '**Info Edge**' : p.name.replace(/ (India )?Ltd$/, ''), n0(p.mcapCr), p.pe ? `${n1(p.pe)}x` : 'loss', p.evEbitda > 0 ? `${n1(p.evEbitda)}x` : 'n.m.', n0(p.revenue), `${p.ebitdaMargin}%`]; }), source: `Screener.in data at the NSE close on ${ASOF_TXT}, GAM Research. Info Edge's trailing P/E is on consolidated profit incl. fair-value gains.` } },
  ],
};

module.exports = { valuation, tpAt, discAt };
