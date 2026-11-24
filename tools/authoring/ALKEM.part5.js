// Alkem Laboratories report, part 5: street view and critiques; risks & honest summary (valuation is in ALKEM.part5b.js).
const X = require('./ALKEM.ctx');
const { D, F, V, SC, n0, n1, pc, price, mv, MULT, k, SECTOR, HB, HR, ownersSep, ownersEps, peFy28, peSep28, peTtm, rating, ruleText, buyBelow, sellAbove, ST, mosl, bob, choice, isec, nuv, withTp, medTp, atOurs, jun28, shortDate, SHARES, Q1, FY26, derate, ndCo } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}, all P/E where disclosed; the debate is the multiple, not the earnings`,
  blocks: [
    { p: `Three houses published after the Q1FY27 results (14-Aug-2026). Motilal Oswal kept Neutral with ₹${n0(mosl.tp)} (27x 12-month-forward EPS; it expects EPS to fall ~10% in FY27 and revive from FY28 as new-business spending is front-loaded). BOB Capital Markets kept Sell with ₹${n0(bob.tp)} (21x Jun-28E EPS, "in line with domestic-focused acute companies"; US challenging, tax rising, valuation expensive). Choice kept Add with ₹${n0(choice.tp)} (25x FY28E EPS set in May; it raised FY28E EPS to ₹${choice.eps.FY28E} in Aug but kept the target, i.e. 22.5x). ICICI Securities' last note before our date (28-May-2026) was a Buy at ₹${n0(isec.tp)}, method not public. Nuvama's last public note (Nov-2025) was Reduce at ₹${n0(nuv.tp)} on a sum of the parts. The median target of the five is ₹${n0(medTp)}, ${pc(medTp / price * 100 - 100)} from ₹${n0(price)}.` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY27E / FY28E EPS (₹)', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method}${s.multiple ? ' ' + s.multiple : ''}${s.on ? ' ' + s.on : ''}` : 'n.d.', s.eps ? `${n1(s.eps.FY27E)} / ${n1(s.eps.FY28E)}` : '–', s === mosl ? `${n0(atOurs.mosl)} (on Sep-28E)` : s === bob ? n0(atOurs.bob) : s === choice ? n0(atOurs.choice) : '–', s.thesis]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E EPS to shareholders**`, `**${n1(ownersEps[0])} / ${n1(ownersEps[1])}**`, '**{{dcf.tp|num}}**', 'A steady acute franchise; EPS resets on tax in FY27; the sector re-rating has not reached Alkem'] },
    ], source: `${D.street.methodCount} Sources: ${ST.map(s => s.broker).join(', ')} notes as cited in deep.json; n.d. = method not disclosed` } },
    { p: `**Why we are above the street.** Our EPS is at the low end (FY28E ₹${n1(ownersEps[1])} vs ₹${bob.eps.FY28E}-${choice.eps.FY28E}); the difference is the multiple and the year. The P/E houses apply 21-27x to EPS one year forward from today. The house method applies Alkem's own median one-year-forward P/E since Apr-2021 (${n1(HB.med)}x before exceptional items, ${n1(HR.med)}x reported) to EPS one year forward from the target date (Sep-28E), lifted ${SECTOR}% because pharma peers trade above their own five-year medians. Alkem itself trades ${Math.abs(derate.ALKEM).toFixed(1)}% below its five-year median trailing P/E: the market has not given it the sector's re-rating. If that discount persists, the value is closer to MOSL's (₹${n0(atOurs.mosl)} at 27x on our Sep-28E EPS) than to ours; see the sensitivity table in the valuation chapter.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who makes it'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls and filings to 30-Sep-2026; GAM' } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good, slow business whose value hinges on getting the sector\'s multiple; the tax reset and Daman are the near-term tests',
  blocks: [
    { callout: `**What you are buying:** India's #1 anti-infectives franchise and #6 drug maker, a 14,500-strong field force, brands that doctors keep prescribing, a US generics business that is flat in dollars, ₹${n0(Q1.netCashCompany)} cr of net cash (~9% of market value), and three options (Enzene biosimilars and CDMO, MedTech/Occlutech, semaglutide) that cost money today. **What you are not buying:** a fast-growing chronic franchise, pricing power in the US, a low tax rate (gone from FY27) or a professional CEO (the seat was empty on 30-Sep-2026).` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(peTtm)}x trailing EPS, ${n1(peFy28)}x our FY28E EPS to shareholders and ${n1(peSep28)}x Sep-28E, against a ${n1(HB.med)}x median one-year-forward P/E since Apr-2021. Pharma peers trade ${SECTOR}% above their five-year medians; Alkem ${Math.abs(derate.ALKEM).toFixed(1)}% below. Our target assumes Alkem simply returns to its own median plus the sector's move: ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}} ({{dcf.upside|chg}}). The DCF (₹${n0(mv('dcf').value)}) says cash flows alone do not support even today's price; the target, like the sector's prices, rests on the multiple.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Daman OAI resolved within 6-12 months (management\'s hope)', 'Medium', 'USFDA re-inspection; new approvals from the site'],
      ['India growth ≥ 12% with trade generics back to high single digit', 'Medium', 'Quarterly India growth; IQVIA vs IPM; trade-generics commentary'],
      ['A credible CEO hire with authority over the pharma business', 'Medium', 'Board announcement; organisation chart'],
      ['US CDMO wins commercial contracts; Enzene listing or new round at a higher value', 'Low-medium', 'CDMO revenue run-rate vs $25-30mn breakeven; filings'],
      ['Cash returned (higher payout or buyback) rather than new verticals', 'Low', 'Payout above 30%; capital-allocation statements'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Daman OAI escalates to a warning letter (45% of US sales; ~9% of group revenue)', 'Medium', 'No new approvals from the site; remediation costs; bear case {{scen.bear.tp|inr}}'],
      ['Tax rate stays at 32%+ (start-up losses do not shrink)', 'Medium', 'Each 1pp of tax ≈ ₹3 of FY28E EPS (~₹90 a share at our multiple)'],
      ['The sector premium does not reach Alkem (own de-rating persists)', 'Medium', `${n0(X.val(X.SENS.own))} at ${X.SENS.own}x (own move) instead of {{dcf.tp|inr}}`],
      ['API and packaging inflation (West Asia logistics) squeezes gross margin', 'Medium', 'Each 1pp of EBITDA margin ≈ ₹11 of FY28E EPS'],
      ['Trade generics stay flat; acute categories keep growing 4-6%', 'Medium', 'India growth ~9%; consensus downgrades'],
      ['New-business losses last longer (US CDMO, Occlutech)', 'Medium', 'Margin stuck near 20%; ROE ~15%'],
      ['Price controls and UCPMP enforcement tighten; tax disputes re-open', 'Low-medium', 'Pricing of scheduled acute drugs; field-force model; MAT credit value'],
      ['More promoter selling', 'High', 'Supply overhang caps rallies'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY holds below ~₹${n0(buyBelow)}** (where upside to our target falls to 15%); between that and ~₹${n0(sellAbove)} the rule gives HOLD, and SELL above it, on today's numbers.`,
      `**Biggest swing factors:** the multiple, tax and margin. Each 1x on the P/E multiple is ~₹${n0(ownersSep)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1((F.sales[1] + F.sales[2]) / 2 / 100 * 0.705 / SHARES)} of Sep-28E EPS (~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100 * 0.705 / SHARES * MULT.base)} a share at ${MULT.base}x).`,
      '**Honest caveat:** most of the upside comes from applying the sector\'s re-rating to a stock the market has de-rated. We follow the house rule (no blend with Alkem\'s own move), but a reader who believes the discount is deserved (tax reset, Daman, governance) should treat the HOLD-range sensitivities as the realistic case.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'India growth, Q1FY27', v: `+${Q1.indiaGrowthPct}%`, d: `Branded ~12%; IQVIA +${Q1.iqvia.alkem}% vs IPM +${Q1.iqvia.ipm}%` },
      { k: 'Tax rate', v: `${FY26.etrPct}% → ~31%`, d: 'FY26 → FY27E: the Sikkim holiday ends' },
      { k: 'US sales from Daman (OAI)', v: '~45%', d: 'Supplies continue; resolution hoped in 6-12 months' },
      { k: 'Forward P/E', v: `${n1(peFy28)}x`, d: `FY28E; median since Apr-2021 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, risks };
