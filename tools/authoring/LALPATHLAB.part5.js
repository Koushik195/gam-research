// Dr Lal PathLabs report, part 5: street view and risks & honest summary (valuation is in part5b / part5c).
const X = require('./LALPATHLAB.ctx');
const { ruleText } = require('../../src/ratings');
const { D, F, V, n0, n1, pc, rup, price, mv, MULT, SECTOR, HB, epsU, epsSep, fwdNow, fwdNow27, trailPe, rating, buyBelow, sellAbove, ST, emkay, nom, jm, kie, isec, one, hsie, postQ1, medPost, medTp, shortDate, SHARES, Q1, dr5, netCash, methodCount, mult22, multGrowth } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: six post-Q1 targets of ₹${n0(Math.min(...postQ1.map(s => s.tp)))}-${n0(Math.max(...postQ1.map(s => s.tp)))}; most say Buy, on 44-48x forward EPS or a DCF`,
  blocks: [
    { p: `After the Q1FY27 results (24-Jul-2026) and the SN Genelab deal (24-Sep-2026) six houses published targets we could retrieve: JM Financial Buy ₹${n0(jm.tp)} (48x Jun-28E EPS), Nomura Buy ₹${n0(nom.tp)} (P/E; 45x Mar-28E in its May note), Emkay Buy ₹${n0(emkay.tp)} (DCF, implying 48x FY28E), Kotak Institutional Equities Buy ₹${n0(kie.tp)}, 360 ONE Buy ₹${n0(one.tp)} and ICICI Securities Hold ₹${n0(isec.tp)} (downgraded on valuation). Their median is ₹${n0(medPost)}, ${pc((medPost / price - 1) * 100)} from ₹${n0(price)}. Older notes: HDFC Securities Buy ₹${n0(hsie.tp)} (44x Q3FY28E, Dec-2025), FundsIndia Buy ₹1,644 and Geojit Hold ₹1,577 (both "target met"). Bloomberg showed 25 of 31 analysts at Buy in late July. Of the four notes that disclose a method, ${methodCount['P/E']} use P/E and ${methodCount.DCF} a DCF; all value consolidated earnings after minorities. Notes from Motilal Oswal, Morgan Stanley, Goldman Sachs, Jefferies and others could not be retrieved (gap).` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY28E EPS (₹)', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method} ${s.multiple || ''} ${s.on || ''}`.trim() : 'n.d.', s.eps?.FY28E ? n1(s.eps.FY28E) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E EPS**`, `**${n1(epsU[1])}**`, 'A good franchise growing faster again; fairly priced'] },
    ], source: rup(D.street.note) } },
    { p: `**Why we are a HOLD when most of the street says Buy.** Our EPS is above Emkay's (FY28E ₹${n1(epsU[1])} vs ₹${emkay.eps.FY28E}) and our ${MULT.base}x is close to the 44-48x the P/E houses use, so our target (₹${n0(V.tp)}) sits at the top of the post-Q1 range. The difference is the starting price: after a ${Math.round(X.M.price.returns['1y'])}% rise in a year the stock already trades at ${n1(fwdNow)}x our FY28E EPS, close to its ${n1(HB.med)}x median one-year-forward P/E since 2021, so the upside left (${pc(V.upside)}) is below the 15% our rule needs for a BUY. Most of the Buy calls were set when the stock was ₹1,760-1,900 (late July); at the 30-Sep close the same ₹1,950-2,195 targets imply only −2% to +10% upside, i.e. HOLD territory on our rule too.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a high-quality, debt-free franchise growing faster again, at a price that already reflects it; HOLD',
  blocks: [
    { callout: '**What you are buying:** the leading diagnostics brand in North India, with dense networks that give the industry\'s best margins, ~75% B2C revenue, negative working capital, no debt and ₹1,700 cr of cash; growth back in the teens on volumes, bundles and a better test mix. **What you are not buying:** pricing power (no list-price increase in three years), a proven model outside the North (Suburban), or protection from aggregator and hospital-lab competition.' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS, ${n1(fwdNow27)}x our FY27E and ${n1(fwdNow)}x our FY28E EPS, against a ${n1(HB.med)}x median one-year-forward P/E since Apr-2021 (on EPS before exceptional items). The three diagnostics peers trade ${SECTOR}% vs their five-year P/E medians; Dr Lal ${dr5.LALPATHLAB}%. On the street's method (P/E) and our derived ${MULT.base}x, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. EV/EBITDA (₹${n0(mv('ev').value)}) is higher because the sector's EV/EBITDA move is +21.5%; the DCF (₹${n0(mv('dcf').value)} at 11.6%) says the price leans on the multiple, as it does for most Indian consumer-healthcare stocks.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Patient growth holds at 7-8% after the CGHS base effect, showing the network expansion works', 'Medium', 'Quarterly patients and samples; new-lab maturity'],
      ['A list-price increase in H2FY27 with no volume loss', 'Medium', 'Management decision after H1; competitor pricing'],
      ['A sensible acquisition that builds a South or West platform at a reasonable price', 'Medium', 'Price paid vs Dr Lal\'s own multiple; integration (the Suburban lesson)'],
      [`A price below ~₹${n0(buyBelow)}`, 'n.a.', 'Upside to our target would reach 15% (BUY on our rule)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Q1\'s pace fades as the CGHS benefit laps and the fever-season base normalises', 'Medium', 'Revenue growth back to 10-12%; bear case {{scen.bear.tp|inr}}'],
      ['Price competition from aggregators, hospital labs or a new entrant in Delhi NCR', 'Low-medium', 'Delhi NCR is 31% of revenue and the highest-margin market'],
      ['An expensive acquisition', 'Medium', 'Every ₹1,000 cr spent forgoes ~₹50 cr of post-tax treasury income'],
      ['Reagent costs rise with a weak rupee and West-Asia freight', 'Medium', 'Each 1pp of margin ≈ ₹1.6 of FY28E EPS'],
      ['Management reinvests the margin above 27-28%, as it says it will', 'Medium-high', 'Our margins (29-30%) would be too high by 1-2pp'],
      ['Regulation of test prices or accreditation', 'Low', 'Rate caps would hit B2C pricing'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY below ~₹${n0(buyBelow)}** (where upside to our target reaches 15%); between that and ~₹${n0(sellAbove)} the rule gives HOLD, and SELL above it, on today's numbers.`,
      `**Biggest swing factors:** the multiple and the margin. Each 1x on the P/E is ~₹${n0(epsSep)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1((F.sales[1] + F.sales[2]) / 2 / 100 * 0.74 / SHARES)} of Sep-28E EPS, ~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100 * 0.74 / SHARES * MULT.base)} a share at ${MULT.base}x. A 10% growth premium on the multiple (${multGrowth}x) would give ~₹${n0(Math.round(multGrowth * epsSep / 10) * 10)} (a BUY); starting the history in Apr-2022 to drop the COVID-boom prices (${mult22}x) would give ~₹${n0(Math.round(mult22 * epsSep / 10) * 10)}. We use neither, for the reasons in the valuation chapter.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Revenue growth, Q1FY27', v: `+${Q1.revenueGrowthPct}%`, d: 'patients +8.2%, revenue per patient +10%' },
      { k: 'EBITDA margin, Q1FY27', v: `${Q1.ebitdaMarginPct}%`, d: 'FY26 28.3%; guidance 27-28%' },
      { k: 'Net cash after leases, Mar-27E', v: `₹${n0(netCash[1])} cr`, d: 'before ~₹206 cr of acquisitions' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; median since 2021 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, risks };
