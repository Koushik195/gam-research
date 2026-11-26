// Poly Medicure report, part 5: street view and risks & honest summary (valuation is in part5b / part5c).
const X = require('./POLYMED.ctx');
const { ruleText } = require('../../src/ratings');
const { D, F, V, n0, n1, pc, price, mv, MULT, SECTOR, HB, epsU, epsSep, fwdNow, fwdNow27, trailPe, rating, buyBelow, sellAbove, ST, CONS, waya, iifl, shortDate, SHARES, Q1, ownMove, netCash, SENS } = X;
const fmtM = s => (s.method ? `${s.method} ${s.multiple || ''} ${s.on || ''}`.trim() : 'n.d.');

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: thin and split; targets from ₹${n0(iifl.tp)} (Reduce) to ₹${n0(waya.tp)} (Buy), consensus ~₹${n0(CONS.trendlyneTp)}`,
  blocks: [
    { p: `Polymed is thinly covered by brokers, and few notes are public. The ones standing on ${X.ASOF_TXT} that we could find: Waya Financial Buy ₹${n0(waya.tp)} (50x FY28E EPS of ₹${waya.eps.FY28E}, initiated 24-Dec-2025), IIFL Reduce ₹${n0(iifl.tp)} (downgraded from Add on 9-Feb-2026 after Q3FY26), Joindre Buy (₹1,489 target met in Mar-2026; results updates in Jun and Aug-2026) and Equirus Reduce (undated headline only). S&P Global's count in Aug-2026 was 2 Strong Buy, 2 Buy, 1 Hold and 1 Sell (six analysts); Trendlyne's consensus target rose from ₹${n0(CONS.trendlynePrev)} to ₹${n0(CONS.trendlyneTp)} after Q1FY27 (${shortDate(CONS.trendlyneDate)}). Older notes show how the street values the stock: every one that disclosed a method used P/E on forward EPS (IIFL 52x FY27 in Feb-2025, LKP ~50x FY27E, FundsIndia 61x FY26E) except ICICI Securities (EV/EBITDA, 30x FY26E). Notes from Kotak, Ambit, Investec, Nuvama, Motilal Oswal and Dolat, if any, could not be retrieved (gap).` },
    { exhibit: { type: 'table', title: 'The street (notes dated on or before 30-Sep-2026)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'Standing?', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, s.tp ? n0(s.tp) : '–', fmtM(s), s.standing === true ? 'Yes' : s.standing === false ? 'Stale' : '?', s.thesis]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E EPS**`, '–', 'A good core business in a costly transition; priced below its own history'] },
    ], source: D.street.note } },
    { p: `**Why we are a ${rating} with lower EPS than the bulls.** Our FY28E EPS (₹${n1(epsU[1])}) is below Waya's ₹${waya.eps.FY28E}, because we do not assume margins return to 28%. The rating comes from the price: after falling 46% from its Nov-2024 peak, the stock trades at ${n1(fwdNow)}x our FY28E EPS, below its ${n1(HB.med)}x median one-year-forward P/E since 2021, while healthcare multiples have re-rated (+${SECTOR}% for the pharma set). The bears (IIFL, Equirus) have a point on growth and returns; we think the price already reflects most of it.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [c]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026; GAM' } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a world-class disposables maker in an expensive transition; at ${n1(fwdNow)}x FY28E the price already discounts a lot of disappointment: ${rating}`,
  blocks: [
    { callout: '**What you are buying:** India\'s largest exporter of medical consumables: low-cost, highly automated plants, EU MDR approvals, 15-20-year distributor relationships, India growing ~20% a year on import substitution, and optionality in renal, cardiology, orthopaedics and the US. **What you are not buying:** pricing power, a proven US business, profitable acquisitions (yet) or free cash flow (negative for four years).' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS, ${n1(fwdNow27)}x our FY27E and ${n1(fwdNow)}x our FY28E EPS, against a ${n1(HB.med)}x median one-year-forward P/E since Apr-2021. Polymed's own trailing P/E is ${pc(ownMove)} vs its five-year median while the pharma set is +${SECTOR}%. On the street's method (P/E) and our derived ${MULT.base}x, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. EV/EBITDA (₹${n0(mv('ev').value)}) agrees; the DCF (₹${n0(mv('dcf').value)} at 12.2%) does not, because working capital and capex absorb most of the cash: the price, like the street's, rests on the multiple.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Middle East shipments resume and exports grow 15%+ organically', 'Medium', 'Quarterly RoW growth; management says orders are intact'],
      ['PendraCare and Citieffe reach mid-teens EBITDA margins', 'Medium', 'Consolidated vs standalone margin gap (Q1FY27: 24.1% vs 28.0%)'],
      ['Anti-dumping duty on Chinese and Malaysian dialysers', 'Medium', 'DGTR decision; renal growth'],
      ['US approvals turn into orders', 'Low-medium', 'New 510(k)s; US revenue (USD 3.5-4 mn in FY27)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Exports stay weak (West Asia, tariffs, Chinese pricing)', 'Medium', 'International organic growth of 5% instead of 12%: bear case {{scen.bear.tp|inr}}'],
      ['Acquisitions keep losing money or need more capital', 'Medium', 'Each 1pp of consolidated margin ≈ ₹1.9 of FY28E EPS'],
      ['Crude-linked costs and wages outrun price increases', 'Medium', 'Gross margin back to 66% (management\'s May-2026 worst case)'],
      ['A large acquisition paid from the ₹480 cr reserve or new equity', 'Medium', 'Treasury income lost; dilution risk'],
      ['Rupee strengthens', 'Low-medium', 'Forex gains (~₹30 cr a year in our numbers) disappear'],
      ['De-rating if growth disappoints again', 'Medium', `The 25th-percentile multiple (${MULT.bear}x) gives ~₹${n0(Math.round(MULT.bear * epsSep / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY below ~₹${n0(buyBelow)}** (where upside to our target reaches 15%); HOLD between that and ~₹${n0(sellAbove)}; SELL above it, on today's numbers.`,
      `**Biggest swing factors:** the multiple and the margin. Each 1x on the P/E is ~₹${n0(epsSep)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1((F.sales[1] + F.sales[2]) / 2 / 100 * 0.746 / SHARES)} of Sep-28E EPS (~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100 * 0.746 / SHARES * MULT.base)} a share). Starting the history in Apr-2022 (${SENS.from22}x) gives ~₹${n0(Math.round(SENS.from22 * epsSep / 10) * 10)}, still a BUY; the wider healthcare factor (${SENS.wide}x) ~₹${n0(Math.round(SENS.wide * epsSep / 10) * 10)}.`,
      '**What would change our mind:** two more quarters of flat organic exports, or acquisitions that stay loss-making into FY28.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Organic growth, Q1FY27', v: `+${Q1.organicGrowthPct}%`, d: `reported +${Q1.revenueGrowthPct}% with acquisitions` },
      { k: 'Standalone EBITDA margin, Q1FY27', v: `${Q1.standalone.opEbitdaMarginPct}%`, d: `consolidated ${Q1.opEbitdaMarginPct}%` },
      { k: 'Net cash, Mar-27E', v: `₹${n0(netCash[1])} cr`, d: 'after ~₹340 cr of borrowings' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; median since 2021 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, risks };
