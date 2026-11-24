// Emcure report, part 5: street view and risks & honest summary (valuation is in EMCURE.part5b.js).
const X = require('./EMCURE.ctx');
const { ruleText } = require('../../src/ratings');
const { D, F, V, SC, n0, n1, pc, rup, price, mv, MULT, k, SECTOR, HB, HR, epsSep, epsU, fwdNow, fwdNowSep, trailPe, rating, buyBelow, sellAbove, ST, icici, mosl, fb, bob, jm, withTp, medTp, recentTp, medRecent, moslAtOurs, iciciAtOurs, shortDate, lev, ndCo, SHARES, Q1, drW, marginPt, moslEps } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: all Buys, targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}, all on P/E; the bulls assume faster international growth than we do`,
  blocks: [
    { p: `After the Q1FY27 results Motilal Oswal reiterated Buy with ₹${n0(mosl.tp)} (28x 12-month-forward EPS; up from ₹2,260 on 20-Jul) and ICICI Direct made Emcure a conviction Buy on 4-Sep with ₹${n0(icici.tp)} (30x FY28E EPS of ₹76.8). Earlier notes still standing on ${'30-Sep-2026'}: a foreign brokerage (unnamed in the source; summaries suggest Jefferies) Buy ₹${n0(fb.tp)} (23-Jun, method not disclosed), BOB Capital Markets Buy ₹${n0(bob.tp)} (25x Mar-28E EPS, 6-May) and JM Financial Buy ₹${n0(jm.tp)} (24x Sep-27E EPS; Nov-2025, the latest JM note we found). The median target is ₹${n0(medTp)} (${pc((medTp / price - 1) * 100)}); the three notes since June have a median of ₹${n0(medRecent)} (${pc((medRecent / price - 1) * 100)}). Every broker that discloses a method uses P/E, at 24-30x. Notes from Kotak, Axis Capital, Nuvama and Jefferies dated before 30-Sep-2026 could not be retrieved (gap); later notes are not used.` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY28E EPS (₹)', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method} ${s.multiple} ${s.on}` : 'n.d.', s.eps?.FY28E ? n1(s.eps.FY28E) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E EPS**`, `**${n1(epsU[1])}**`, 'Good chemistry, mid-sized India franchise, growth led by generics and tenders; fairly priced after a 16% sector re-rating'] },
    ], source: rup(D.street.note) } },
    { p: `**Why we are below the bulls.** The difference is mostly earnings, not the multiple. Our FY28E EPS (₹${n1(epsU[1])}) is ~4% below ICICI Direct's ₹${icici.eps.FY28E} and ~6% below Motilal Oswal's ₹${n1(moslEps.FY28E)} (on the same share count) because we model international growth slowing to ~12% in FY28E without a currency tailwind, against ~15-17% for the brokers (ICICI Direct: 17% international CAGR FY26-28E). On multiples we are in the same place: our ${MULT.base}x Sep-28E sits between Motilal Oswal's 28x 12-month-forward and BOB's 25x; applied to our EPS, Motilal Oswal's method gives ₹${n0(Math.round(moslAtOurs / 10) * 10)} and ICICI Direct's ₹${n0(Math.round(iciciAtOurs / 10) * 10)}.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026; GAM' } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a better business than its #13 rank suggests, priced for it; we would buy below ~₹${n0(buyBelow)}`,
  blocks: [
    { callout: '**What you are buying:** real chemistry and complex-product skills (chiral molecules, iron, liposomal injectables, biologics), category-leading brands in women\'s health and stroke, a distribution platform MNCs want to partner with, and generics front ends in Europe and Canada growing 20%; a balance sheet that will be close to net cash by FY28E. **What you are not buying:** a top-10 India franchise, owned brands for most of the recent India growth, or a business with high, stable margins (19-20% EBITDA, gross margin falling with mix).' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS and ${n1(fwdNow)}x our FY28E EPS (${n1(fwdNowSep)}x Sep-28E), against a ${n1(HB.med)}x median one-year-forward P/E since Jan-2025. The stock has re-rated with the sector: its trailing P/E is ${pc(drW.EMCURE)} vs its own median since Jan-2025, the nine pharma peers ${'+'}${SECTOR}%. On the street's method (P/E) with our derived ${MULT.base}x Sep-28E EPS, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The EV/EBITDA cross-check (₹${n0(mv('ev').value)}) agrees; the DCF (₹${n0(mv('dcf').value)} at 11.9%) does not, as for most of the sector: the price assumes long, high growth.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['India growth above the market for 2-3 quarters (Zuventus recovers; Poviztra scales)', 'Medium', 'Quarterly India growth vs IPM; organic growth ex-in-licensing'],
      ['A second wave of complex launches abroad (amphotericin B tenders, semaglutide in Canada, lenacapavir)', 'Medium', 'Europe and RoW growth in constant currency; approvals'],
      ['Cash conversion back above 75% of EBITDA', 'Low-medium', 'Inventory and receivable days; H2FY27 cash flow'],
      ['Promoter stake sale done cleanly (MPS) and the Avet receivable reduced', 'Medium', 'Exchange filings; AR FY27 related-party note'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Zuventus keeps losing people and share; India grows below the market', 'Medium', 'India growth 6-8%; bear case {{scen.bear.tp|inr}}'],
      ['ARV tenders turn (prices, donor budgets) after an exceptional FY26-27', 'Medium', 'RoW (20% of revenue) flat or down for a year'],
      ['Rupee strengthens; European generic prices fall', 'Medium', 'International growth halves; exchange gains reverse'],
      ['Sanofi cardiac distribution (initial five years from Mar-2024) renegotiated or not renewed', 'Low-medium (FY29+)', 'A large share of India cardiac sales'],
      ['Promoter selling to meet the 25% public-float rule (~2.8% of equity)', 'High (by ~Jul-2027)', 'Supply overhang; possible discount'],
      ['Related-party and acquisition decisions that favour insiders', 'Low-medium', 'Multiple discount; cash leakage'],
      ['Gross margin keeps falling as mix shifts abroad', 'Medium', `Each 1pp of EBITDA margin ≈ ₹${n1(marginPt)} of Sep-28E EPS`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY below ~₹${n0(buyBelow)}** (where upside to our target reaches 15%); between that and ~₹${n0(sellAbove)} the rule gives HOLD, and SELL above it, on today's numbers.`,
      `**Biggest swing factors:** the multiple and international growth. Each 1x on the P/E multiple is ~₹${n0(epsSep)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1(marginPt)} of Sep-28E EPS, ~₹${n0(marginPt * MULT.base)} a share at ${MULT.base}x. Without the sector re-rating (own median ${n1(HB.med)}x only), fair value would be ~₹${n0(Math.round(X.half(HB.med) * epsSep / 10) * 10)}, below today's price.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'India growth, Q1FY27', v: `+${Q1.indiaGrowthPct}%`, d: '6-7% excluding in-licensed Sanofi diabetes and Roche brands' },
      { k: 'International share of revenue', v: '58%', d: `Q1FY27; +${Q1.internationalGrowthPct}% YoY incl. ~12pp currency` },
      { k: 'Net debt / EBITDA', v: `${lev[0].toFixed(1)}x → ${lev[3].toFixed(1)}x`, d: `Mar-26 → Mar-29E (GAM; net cash ₹${n0(-ndCo[3])} cr)` },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; median since Jan-2025 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, risks };
