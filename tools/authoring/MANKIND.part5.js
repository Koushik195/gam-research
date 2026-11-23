// Mankind Pharma report, part 5: street view and risks & honest summary (valuation is in MANKIND.part5b.js).
const X = require('./MANKIND.ctx');
const { ruleText } = require('../../src/ratings');
const { D, F, V, SC, n0, n1, pc, rup, price, mv, MULT, k, SECTOR, HB, HR, HB_post, adjSep, ownersSep, adjEps, ownersEps, fwdNowAdj, fwdNowRep, trailPe, rating, buyBelow, sellAbove, ST, mosl, jm, geo, hsie, withTp, medTp, moslAtOurs, shortDate, lev, ndCo, SHARES, Q1, jm22, drW } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}, mostly on P/E; the bulls and bears disagree about growth, not quality`,
  blocks: [
    { p: `Two houses published after the Q1FY27 results on 30-Jul-2026: Motilal Oswal reiterated Buy with ₹${n0(mosl.tp)} (40x 12-month-forward EPS; it cut FY27E EPS 4% for consumer health) and JM Financial kept Reduce with ₹${n0(jm.tp)} (22x Jun-28E EV/EBITDA; "execution intact, acceleration elusive"). Earlier notes still standing on 30-Sep-2026: Joindre Capital Buy ₹${n0(ST.find(s => s.broker === 'Joindre Capital').tp)} (initiation, 24-Jun), Geojit Accumulate ₹${n0(geo.tp)} (37x FY28E EPS, 16-Jun), HDFC Securities Add ₹${n0(hsie.tp)} (34x Q2FY28E EPS, 4-Feb; no later note found) and BP Wealth Buy ₹2,652 (Dec-2025 initiation). The median target is ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} from ₹${n0(price)}. Notes from the large foreign and domestic institutional brokers dated before 30-Sep could not be retrieved (gap); their later Q2FY27 notes are not used.` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY28E EPS (₹)', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method} ${s.multiple} ${s.on}` : 'n.d.', s.eps?.FY28E ? n1(s.eps.FY28E) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E EPS before BSV amortisation**`, `**${n1(ownersEps[1])}**`, 'Steady franchise; de-rated below its own history while the sector re-rated'] },
    ], source: rup(D.street.note) } },
    { p: `**Why we are above the street.** Our EPS is in the middle of the range (FY28E ₹${n1(ownersEps[1])} vs ₹${jm.eps.FY28E}-${mosl.eps.FY28E}); the difference is the multiple. The brokers that use P/E apply 34-40x to reported forward EPS. Mankind's own one-year-forward P/E since Nov-2023 has a median of ${n1(HR.med)}x on reported EPS and ${n1(HB.med)}x on EPS before exceptional items and the BSV amortisation, and the pharma sector has re-rated ${SECTOR}% above its medians over the same window; our ${MULT.base}x on adjusted EPS equals ~${n1(MULT.base * adjSep / ownersSep)}x reported Sep-28E EPS. In effect the street assumes the de-rating since mid-2025 (forward P/E ${n1(HB_post.med)}x since Oct-2025 on our basis) is permanent; our house method assumes it is not, and shows the alternative as a sensitivity.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good franchise at a fair-to-cheap price on its own history; the debate is whether growth returns to market-plus',
  blocks: [
    { callout: '**What you are buying:** India\'s #1 prescription franchise and #4 drug maker, 40% chronic and rising, consumer brands that lead their categories, and BSV\'s biologics; a balance sheet that will be net cash by FY28E; and management with a 30-year record. **What you are not buying:** a pipeline, pricing power, or a company growing faster than its market today.' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS, ${n1(fwdNowRep)}x our FY28E EPS (model) and ${n1(fwdNowAdj)}x FY28E EPS before the BSV amortisation, against a ${n1(HB.med)}x median on that basis since Nov-2023. The stock has de-rated (trailing P/E ${pc(drW.MANKIND)} vs its own median since Nov-2023) while pharma peers re-rated (+${SECTOR}%). On the street's method (P/E) and our house multiple (${MULT.base}x Sep-28E adjusted EPS) the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The EV/EBITDA cross-check (₹${n0(mv('ev').value)}) agrees; the DCF (₹${n0(mv('dcf').value)} at 11.3%) does not, which tells us the whole sector, Mankind included, prices in long, high growth.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Domestic prescription growth above 1.1x the market for 2-3 quarters (acute recovery holds)', 'Medium', 'IQVIA secondary growth vs IPM; acute growth; volume'],
      ['BSV keeps high-teens growth and Mankind discloses its margin', 'Medium', 'Foligraf, Anti-D, international approvals (Russia FSH)'],
      ['Gross margin holds above 72% despite West Asia costs', 'Low-medium', 'Q2-Q3 FY27 gross margin'],
      ['Net cash by FY28 and a higher payout', 'High (debt) / low (payout)', 'NCD repayment Oct-2026 and Nov-2027'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Acute growth falls back below the market (trade generics, e-pharmacy discounting)', 'Medium', 'Domestic growth 8-9%; bear case {{scen.bear.tp|inr}}'],
      ['GLP-1s reshape diabetes and cardiac prescribing while Mankind sits out the price war', 'Medium', 'Chronic growth slows; share loss in anti-diabetics'],
      ['Anti-D patent (India, 2028) and biosimilar or polyclonal competition', 'Medium (from FY29)', 'BSV\'s largest brand (₹200 cr+)'],
      ['Income-tax disallowances upheld (₹1,909 cr of adjustments; ₹1,113 cr of demands)', 'Low-medium', 'Up to ~₹27 a share of cash; reputational'],
      ['Raw-material and currency costs squeeze gross margin', 'Medium', 'Each 1pp of margin ≈ ₹3.2 of FY28E EPS'],
      ['A large new acquisition once net cash', 'Medium (FY28+)', 'Re-leveraging; another amortisation reset'],
      ['Marketing-practice regulation (UCPMP) tightens', 'Low-medium', 'Field-force-led model is most exposed'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY holds below ~₹${n0(buyBelow)}** (where upside to our target falls to 15%); between that and ~₹${n0(sellAbove)} the rule gives HOLD, and SELL above it, on today's numbers.`,
      `**Biggest swing factors:** the multiple and domestic growth. Each 1x on the P/E multiple is ~₹${n0(adjSep)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1((F.sales[1] + F.sales[2]) / 2 / 100 * 0.748 / SHARES)} of Sep-28E EPS, ~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100 * 0.748 / SHARES * MULT.base)} a share at ${MULT.base}x. If the de-rating since Oct-2025 is permanent (${n1(HB_post.med)}x × the sector factor), fair value is ~₹${n0(Math.round(X.half(HB_post.med * k) * adjSep / 10) * 10)}: still above today's price.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Domestic Rx growth, Q1FY27', v: `+${Q1.domesticRxGrowthPct}%`, d: 'IPM +13.0% (IQVIA secondary: Mankind +12.7%)' },
      { k: 'Chronic share (ex-BSV)', v: '40%', d: '28% in FY18; target 50% in 4-5 years' },
      { k: 'Net debt / EBITDA', v: `${lev[0].toFixed(1)}x → net cash`, d: `Mar-26 → Mar-28E (₹${n0(-ndCo[2])} cr net cash, GAM)` },
      { k: 'Forward P/E, adjusted', v: `${n1(fwdNowAdj)}x`, d: `FY28E; median since Nov-2023 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, risks };
