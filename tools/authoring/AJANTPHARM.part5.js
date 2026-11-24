// Ajanta Pharma report, part 5: street view and critiques; risks & honest summary (valuation is in AJANTPHARM.part5b.js).
const X = require('./AJANTPHARM.ctx');
const { D, F, V, SC, AS, n0, n1, pc, price, mv, MULT, k, SECTOR, HB, epsSep, epsU, peFy27, peFy28, peSep28, peTtm, rating, ruleText, buyBelow, sellAbove, ST, mosl, bob, plb, isec, jef, idir, withTp, medTp, atOurs, shortDate, SHARES, Q1, FY26, derate, CONS, SENS, val } = X;
const consSep = (CONS.FY28E + CONS.FY28E * epsU[2] / epsU[1]) / 2, consVal = Math.round(MULT.base * consSep / 10) * 10;
const px0731 = 3436.4; // NSE close on 31-Jul-2026 (Trendlyne price at reco)
const brokGap = [mosl, plb, bob, idir].map(s => (1 - epsU[1] / s.eps.FY28E) * 100);
const holdAt = Math.ceil(price * 0.95 / 10) * 10 - 5, needEps = (holdAt / (MULT.base * epsSep) - 1) * 100;
const ours = s => (s === mosl ? `${n0(atOurs.mosl)} (Sep-28E)` : s === plb ? n0(atOurs.pl) : s === idir ? n0(atOurs.idir) : s === bob ? n0(atOurs.bob) : s === isec ? n0(atOurs.isec) : '–');

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}, all P/E where disclosed; two of six moved to Hold after Q1 on valuation`,
  blocks: [
    { p: `Six houses published between 30-Jul and 3-Aug-2026, after Q1FY27. Four are positive: Motilal Oswal (Buy, ₹${n0(mosl.tp)}, 32x 12-month-forward EPS, raised from 30x), Jefferies (Buy, ₹${n0(jef.tp)}), ICICI Direct (Buy, ₹${n0(idir.tp)}, 32x FY28E) and PL (Buy, ₹${n0(plb.tp)}, 32x FY28E). Two downgraded to Hold on valuation: BOBCAPS (₹${n0(bob.tp)}, 30x Jun-28E: "higher earnings growth factored in to current valuations") and ICICI Securities (₹${n0(isec.tp)}, 28x FY28E). The median target is ₹${n0(medTp)}, ${pc(medTp / price * 100 - 100)} from ₹${n0(price)}; the stock then rose a further ${pc((price / px0731 - 1) * 100)} to ₹${n0(price)} by 30-Sep. Bloomberg consensus EPS is ₹${CONS.FY27E} for FY27E and ₹${CONS.FY28E} for FY28E.` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY27E / FY28E EPS (₹)', 'At our EPS (₹)', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method}${s.multiple ? ' ' + s.multiple : ''}${s.on ? ' ' + s.on : ''}` : 'n.d.', s.eps ? `${n1(s.eps.FY27E)} / ${n1(s.eps.FY28E)}` : '–', ours(s), s.thesis]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E EPS**`, `**${n1(epsU[0])} / ${n1(epsU[1])}**`, '**{{dcf.tp|num}}**', 'A high-quality branded-generics compounder whose US earnings have peaked; the price already discounts more than its own history'] },
    ], source: `${D.street.methodCount} ${D.street.older} n.d. = method not disclosed` } },
    { p: `**Why we are below the street.** Two reasons, roughly equal. (1) **Earnings:** our FY28E EPS (₹${n1(epsU[1])}) is ${Math.abs(Math.round((epsU[1] / CONS.FY28E - 1) * 100))}% below consensus and ${Math.round(Math.min(...brokGap))}-${Math.round(Math.max(...brokGap))}% below the four brokers who publish estimates, because we model US sales +${AS.businessLines.growth.us[1]}% in FY28 (they have high single to double digits) and a slower Asia recovery. (2) **Multiple and year:** the brokers apply 28-32x to EPS roughly one year forward from today; the house method applies Ajanta's own ${n1(HB.med)}x median one-year-forward P/E since Apr-2021, lifted ${SECTOR}% for the pharma re-rating, to Sep-28E EPS. Ajanta already trades ${n1(derate.AJANTPHARM)}% above its own five-year median trailing P/E, more than the sector's +${SECTOR}%. On the street's multiples and our EPS the value is ₹${n0(atOurs.isec)}-${n0(atOurs.mosl)}; on our multiple and consensus EPS it is ~₹${n0(consVal)} (valuation sensitivities).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Evidence', 'Where we address it'], wide: [1], rows: D.critiques, source: 'Broker notes, earnings calls and filings to 30-Sep-2026; GAM' } },
  ],
};

const mPp = (F.sales[1] + F.sales[2]) / 2 / 100 * (1 - AS.taxRate[1] / 100) / SHARES; // Sep-28E EPS per 1pp of margin
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a very good business at a full price; the US normalisation is not in the street\'s numbers',
  blocks: [
    { callout: `**What you are buying:** a branded-generics company with ~80% gross margins, 27-28% EBITDA margins, ROCE above 30%, net cash and no exceptional charges; leadership in Indian eye-care and skin niches; a rare African field-force franchise growing 20-30%; and a US generics business that just had its best year. **What you are not buying:** a large Indian franchise (it is #24), pricing power in the US, a hedge against Middle East disruption (Asia is 22% of sales) or a widely held, unpledged shareholder base.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(peTtm)}x trailing EPS, ${n1(peFy27)}x our FY27E, ${n1(peFy28)}x FY28E and ${n1(peSep28)}x Sep-28E, against a ${n1(HB.med)}x median one-year-forward P/E since Apr-2021. The stock rose ~50% in the year to 30-Sep-2026 and trades ${n1(derate.AJANTPHARM)}% above its own five-year median trailing P/E (pharma peers +${SECTOR}%). On the house method, ${MULT.base}x Sep-28E EPS gives {{dcf.tp|inr}} ({{dcf.upside|chg}}). The DCF (₹${n0(mv('dcf').value)}) is lower still.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['US holds near the Q1FY27 run-rate (~US$50 mn a quarter) through FY28 with Q4FY27 launches', 'Low-medium', 'Quarterly US sales in dollars; approvals; price erosion commentary'],
      ['Asia rebounds as guided (mid-to-high teens) once shipping normalises', 'Medium', 'Q2FY27 Asia sales (deferred shipments); freight costs'],
      ['India sustains 15%+ with cardiology catching up on IQVIA', 'Medium', 'IQVIA MAT growth by therapy; new-therapy scale-up'],
      ['Semaglutide approvals in Asia/Africa (Biocon licence) on time', 'Medium (FY29+)', 'Approvals in key markets; launch pricing'],
      ['A price correction toward our target', '–', `BUY below ~₹${n0(buyBelow)} on our numbers`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Sharp US price erosion on the FY25-26 launches; no new approvals', 'Medium', `US −10% instead of +${AS.businessLines.growth.us[1]}% in FY28 ≈ −₹${n1(0.14 * X.build.us[0] * F.ebitdaMargin[1] / 100 * (1 - AS.taxRate[1] / 100) / SHARES)} of FY28E EPS at our margin; bear case {{scen.bear.tp|inr}}`],
      ['Middle East war persists (Asia flat; freight and API costs up)', 'Medium', 'Each 1pp of EBITDA margin ≈ ₹' + n1(mPp) + ' of Sep-28E EPS (₹' + n0(mPp * MULT.base) + ' a share)'],
      ['US FDA action at Paithan or Dahej (both supply the US)', 'Low', 'Approvals halt; remediation cost'],
      ['Income-tax search leads to a demand', 'Low-medium', 'One-off cash cost; governance questions'],
      ['Donor-funded anti-malarial tenders shrink', 'Medium', 'Africa institutional ~3% of sales; lumpy'],
      ['More promoter selling or pledge enforcement', 'Medium', 'Supply overhang; 14.3% of equity pledged'],
      ['Working capital keeps rising (receivables beyond 125 days)', 'Low-medium', 'Cash conversion; lower payouts'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY below ~₹${n0(buyBelow)}** (upside to our target ≥15%); HOLD between that and ~₹${n0(sellAbove)}; SELL above it, on today's numbers. At ₹${n0(price)} the stock is only ₹${n0(price - sellAbove)} above the SELL line: the call is marginal and would flip to HOLD with ~${n1(needEps)}% higher Sep-28E EPS or half a turn more on the multiple.`,
      `**Biggest swing factors:** the US and the multiple. Each 1x on the P/E is ~₹${n0(epsSep)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1(mPp)} of Sep-28E EPS (~₹${n0(mPp * MULT.base)} a share); on consensus FY28E EPS our multiple gives ~₹${n0(consVal)} (HOLD).`,
      `**Honest caveat:** this is not a call on a weak business; it is a call on price. Ajanta's own five-year move (${n1(derate.AJANTPHARM)}%, ${SENS.own}x) would give ₹${n0(val(SENS.own))} (HOLD). We follow the house rule, which uses the sector's move, and accept a SELL that rests on a ${Math.abs(Math.round(V.upside))}% gap.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'India growth, Q1FY27', v: '+24%', d: `IQVIA +${Q1.iqvia.ajanta}% vs IPM +${Q1.iqvia.ipm}%` },
      { k: 'US growth, FY26', v: `+${n1(FY26.growth.us)}%`, d: 'Guidance FY27: mid-single digit (constant currency)' },
      { k: 'Gross margin', v: `${Q1.grossMarginPct}%`, d: 'Q1FY27; EBITDA before FX 27.9%' },
      { k: 'Forward P/E', v: `${n1(peFy28)}x`, d: `FY28E; median since Apr-2021 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, risks };
