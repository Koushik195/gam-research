// Aditya Birla Capital report, part 6c: the holding-company discount — history, derivation and judgement
// (house method, as GODREJIND: ABCL's market value vs its look-through value at each quarter-end, on our SOTP
// conventions with constant base multiples).
const X = require('./ABCAPITAL.ctx3');
const { S, n0, n1, n2, discHist, discNow, discMedAll, discMedRecent, discMin, discMax, discSubsMedAll, discSubsNow, discRecent, mN, mH, mL, mG, derivedDisc } = X;
const pick = discHist.filter(r => /-(03|09)-/.test(r.d));
const chart = [...discHist.map(r => [r.d, Math.round(r.disc * 10) / 10]), ['2026-09-30', Math.round(discNow.disc * 10) / 10]];
const post = discHist.filter(r => r.d >= '2025-06-30'), medPost = X.med(post.map(r => r.disc));

const discountBlocks = [
  { h: `The holding discount: ${S.holdco.base}%, and why` },
  { p: `We measure ABCL's discount the way we did for Godrej Industries and GSFC: at every quarter-end since March 2022 (the first March after the AMC listed), ABCL's market value against the look-through value of its parts on our own conventions, with the multiples held at our base case: the NBFC at ${n2(mN)}x and the HFC at ${n2(mH)}x book at that date (our ${S.nbfc.multiple.base}x / ${S.hfc.multiple.base}x Sep-28E multiples restated on point-in-time book), the life insurer at ${mL}x its latest embedded value, the health insurer at ${mG}x its latest full-year premium, the AMC and broking stakes at that day's price, ARC at book. Book values and EV come from the company's March disclosures, interpolated between them; stakes and share counts change on the dates in the history chapter.` },
  { pair: [
    { type: 'line', title: `Discount to look-through value: median ${n0(discMedAll)}% since Mar-22, ${n0(discMedRecent)}% over two years, ${n0(discNow.disc)}% now`, unit: '1 − market value ÷ look-through value (%), quarter-ends and 30-Sep-2026', x: chart.map(x => x[0]), series: [{ name: 'Discount', values: chart.map(x => x[1]), fmt: 'pct' }], labels: 'last', lines: [{ v: discMedAll, text: `Median since Mar-22: ${n0(discMedAll)}%` }, { v: discMedRecent, text: `Two-year median: ${n0(discMedRecent)}%`, color: '#cf8f1f' }], source: 'Screener.in prices; ABCL disclosures; GAM Research' },
    { type: 'table', title: 'ABCL vs its look-through value (₹ per share)', head: ['Quarter-end', 'Share price', 'Look-through', 'Discount'], rows: [...pick.map(r => [r.d, n1(r.close), n0(r.ltvPs), `${n1(r.disc)}%`]), [`**${X.ASOF_TXT}**`, `**${n1(discNow.close)}**`, `**${n0(discNow.ltvPs)}**`, `**${n1(discNow.disc)}%**`]], source: 'GAM Research (March and September quarter-ends shown; the chart has every quarter)' },
  ] },
  { exhibit: { type: 'table', title: 'From history to the discount we use', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
    ['1. Full history', `Median ${n1(discMedAll)}% over ${discHist.length} quarter-ends (Mar-22 to Jun-26); range ${n1(discMin)}% to ${n1(discMax)}%. The widest discounts came in 2022 and at the Dec-24/Mar-25 low in the share price`, `Bear case: ${derivedDisc.bear}%`],
    ['2. Last two years', `Median ${n1(discMedRecent)}% over ${discRecent.length} quarter-ends since Sep-2024: the period that includes the merger, the HFC's scale-up and the re-rating`, `**Base case: ${derivedDisc.base}%**`],
    ['3. Since the merger', `Median ${n1(medPost)}% over ${post.length} quarter-ends since Jun-2025, when the NBFC stopped being a subsidiary (too few points to stand alone)`, 'Supports a lower discount than the long-run median'],
    ['4. Today', `${n1(discNow.disc)}% on ${X.ASOF_TXT}, near the bottom of the range (it briefly went negative in Dec-2025)`, `Bull case: ${derivedDisc.bull}%`],
    ['5. Subsidiaries only', `Treating the NBFC at our multiple and putting the whole gap on the subsidiaries: median ${n0(discSubsMedAll)}% since Mar-22, ${n0(discSubsNow)}% now (Emkay uses 20% on the subsidiaries)`, 'Same message: the discount is narrow today'],
  ], source: 'GAM Research' } },
  { callout: `**Our judgement.** The discount is structural, not a mistake the market will correct: the insurers and the AMC are shared with partners, pay ABCL little cash, and need capital; the free float is ~31%. It narrowed for good reasons (the merger, better NBFC returns, Advent's price for the HFC), which is why we use the two-year median (${S.holdco.base}%) rather than the full-period ${n0(discMedAll)}%. But at ~${n0(discNow.disc)}% today the market already gives ABCL most of that credit. A caveat on the method: holding multiples constant means part of the history reflects sector moods (life insurers traded at 3x EV in 2021-22), so we read the level with judgement, not as precise.` },
];

module.exports = { discountBlocks };
