// Caplin Point report, part 5: street view and critiques; risks & honest summary (valuation is in CAPLIPOINT.part5b.js).
const X = require('./CAPLIPOINT.ctx');
const { D, F, V, SC, AS, n0, n1, pc, price, mv, MULT, SECTOR, HB, H24, epsSep, epsU, peFy28, peTtm, rating, ruleText, buyBelow, sellAbove, ST, icici, atOurs, shortDate, SHARES, Q1, FY26, derate, SENS, val, valCcps, CC, ccpsEpsSep } = X;
const mPp = (F.sales[1] + F.sales[2]) / 2 / 100 * (1 - AS.taxRate[1] / 100) / SHARES; // Sep-28E EPS per 1pp of margin

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: one broker, Buy, ₹${n0(icici.tp)} on 26x FY28E EPS; we are below on the multiple, not on earnings`,
  blocks: [
    { p: `Caplin is thinly covered. On ${X.ASOF_TXT} the only standing note we found with a target and method was ICICI Securities' retail research (13-Aug-2026, after Q1FY27): **Buy, ₹${n0(icici.tp)}, 26x FY28E EPS of ₹${icici.eps.FY28E}**, citing LatAm tender wins, Chile, the US pipeline and the internally funded capex, with US regulatory exposure and slow ramps in larger LatAm markets as risks. ICICI valued Caplin on EV/EBITDA until Feb-2026 (17x FY28E EBITDA, ₹2,155; 20x FY27E in Nov-2025) and switched to P/E in August as the stock re-rated; its 15-May-2026 note (₹2,320) was not retrievable. FundsIndia (Buy, ₹2,499, Aug-2025) and Asit C Mehta (Accumulate, ₹1,675, Apr-2024) are stale. Trendlyne's consensus target was ₹2,765 on 7-Sep-2026. Earnings calls are hosted by Dolat Capital and 360 ONE, but we found no public note from either. **Where we differ:** our FY27E EPS is within 1% of ICICI's and FY28E ${pc((epsU[1] / icici.eps.FY28E - 1) * 100)} (other income, depreciation); the real gap is the multiple: 26x FY28E vs our ${MULT.base}x Sep-28E (${n1(MULT.base * epsSep / epsU[1])}x FY28E). ICICI's 26x on our FY28E EPS is ₹${n0(atOurs.icici)}.` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY27E / FY28E EPS (₹)', 'Standing?', 'Thesis'], wide: [7], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method}${s.multiple ? ' ' + s.multiple : ''}${s.on ? ' ' + s.on : ''}` : 'n.d.', s.eps ? `${n1(s.eps.FY27E)} / ${n1(s.eps.FY28E)}` : '–', s.standing ? 'Yes' : 'No', s.thesis]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E EPS**`, `**${n1(epsU[0])} / ${n1(epsU[1])}**`, '–', 'Good franchise; slow LatAm dollar growth, single-site US with a fresh 483, CCPS claim; price far above its own history'] },
    ], source: 'ICICI Direct PDFs (13-Aug-2026, 6-Feb-2026, 10-Nov-2025); Trendlyne research listing (dates and targets of older notes); n.d. = method not disclosed' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Critique'], rows: D.critiques.map(c => [c]), source: 'Filings, calls and broker notes to 30-Sep-2026; GAM' } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good, frugal business priced as if the US story were already delivered and the 483 did not exist',
  blocks: [
    { h: 'What you buy' },
    { p: `A debt-free, founder-run generics company with a distribution franchise in Central America and the Caribbean that earns ~45% pre-tax margins, a US injectables arm growing 25-30% a year, ₹${n0(FY26.treasury.gross)} cr of cash and investments and an unbroken record of rising EPS.` },
    { h: 'What you pay' },
    { p: `₹${n0(price)} is ${n1(peTtm)}x trailing and ${n1(peFy28)}x our FY28E EPS. Caplin's own one-year-forward P/E has had a median of ${n1(HB.med)}x since Apr-2021 and ${n1(H24.med)}x even since the Apr-2024 re-rating; its trailing P/E is ${n1(derate.CAPLIPOINT)}% above its five-year median while pharma peers are ${SECTOR}% above theirs. The price implies the US business keeps compounding at 25%+ for years and that Latin America re-accelerates; our numbers have neither, and the CCPS holders' claim on Caplin Steriles (≥${CC.minStakePct}%) would take another ₹${n0(V.tp - valCcps)} a share off our target.` },
    { h: 'What could go wrong (and right)' },
    { exhibit: { type: 'table', title: 'Risk register', head: ['Risk', 'Likelihood', 'What it would do'], wide: [2], rows: [
      ['USFDA escalates the Aug-2026 Form 483 (OAI, warning letter, import alert)', 'Medium', 'Stops new US approvals and line transfers; US is ~22% of revenue and most of the growth'],
      ['Latin American tenders lapse after FY27; dollar growth stays at ~3%', 'Medium', 'Rest of World growth falls to mid-single digits in rupees once the currency effect fades'],
      ['Rupee strengthens or LatAm currencies weaken', 'Low-medium', 'Rupee revenue and the FY26 translation gains reverse'],
      ['Receivables stretch (government markets, Chile, Mexico)', 'Medium', 'Weaker cash conversion; possible provisions'],
      ['New plants start late or run below break-even longer', 'Medium', 'Margin below our 35%; depreciation without revenue'],
      ['A large acquisition (distributor, ANDAs) at a full price', 'Medium', 'Dilutes returns on the cash pile; integration risk in new countries'],
      ['Upside: Mexico and Chile scale faster; US capacity and own label beat targets', 'Medium', 'Bull case {{scen.bull.tp|inr}}'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY below ~₹${n0(buyBelow)}** (upside to our target ≥15%); HOLD between that and ~₹${n0(sellAbove)}; SELL above it, on today's numbers. At ₹${n0(price)} the stock is ~₹${n0(price - sellAbove)} above the SELL line.`,
      `**Biggest swing factors:** the multiple and the US. Each 1x on the P/E is ~₹${n0(epsSep)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1(mPp)} of Sep-28E EPS (~₹${n0(mPp * MULT.base)} on the target).`,
      `**Honest caveat:** this is a call on price, not on a weak business. The post-re-rating window (since Apr-2024, ${n1(H24.med)}x × the same-window peer move = ${SENS.w24}x) would give ₹${n0(val(SENS.w24))}, still ${pc((val(SENS.w24) / price - 1) * 100)} vs the price; Caplin's own five-year re-rating (${SENS.own}x) would give ₹${n0(val(SENS.own))}. We would turn more positive on a clean FDA outcome plus evidence that Latin American dollar growth is back above 10%, or on a price nearer ₹${n0(buyBelow)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'LatAm growth in dollars, FY26', v: '+3%', d: '$150 mn → $155 mn; Central America +7%' },
      { k: 'US growth, Q1FY27', v: '+26%', d: 'Guided 25-30% for FY27; plant full till ~Feb-2027' },
      { k: 'USFDA, Aug-2026', v: '10 obs.', d: 'Form 483 at the only US site (procedural, per company)' },
      { k: 'Forward P/E', v: `${n1(peFy28)}x`, d: `FY28E; median since Apr-2021 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, risks };
