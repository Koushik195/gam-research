// Coal India report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, FSA, e-auction, costs, subsidiaries, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in COALINDIA.ctx.js; forecast and valuation figures are
// live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./COALINDIA.ctx');
const { C, SG, F, V, n0, n1, pc, price, mv, MULT, evMed, evMove, ebitdaSep, ncSep, rating, postQ1, medTp, bld, evSeries, AS } = X;
const P2 = require('./COALINDIA.part2'), P3 = require('./COALINDIA.part3'), P4 = require('./COALINDIA.part4'), P5 = require('./COALINDIA.part5'), P6 = require('./COALINDIA.part6');
const K = C.annualKpis, yld = F.dps[0] / price * 100;

const cover = {
  headline: 'A cash machine priced about right: ~6.5% yield, little growth, no pricing power',
  lead: `Coal India mines ~75% of India's coal and sells most of it to power plants at prices the Government effectively sets. After the FY23-24 e-auction windfall, EBITDA fell from ₹47,971 cr (FY24) to ₹41,243 cr (FY26); Q1FY27 EBITDA fell another 4% on diesel and contractor costs, but offtake rose 6.7% in Apr-Aug as power plants ran down their stocks. We forecast EPS of ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}} for FY27-29E. The street values Coal India on **EV/EBITDA on FY28E** (4.5-6x). Our multiple is derived, not picked: the stock's own one-year-forward EV/EBITDA median since Apr-2021 (${n1(evMed)}x), moved by the oil, gas and consumable-fuel peers' ${pc(evMove)} against their five-year medians, gives **${MULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep.base)} cr plus ₹${n0(ncSep)} cr of net cash = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The dividend is real and well covered', p: `Coal India paid ₹26.50 a share for FY26 (52.5% of EPS) and declared ₹5.50 as the first FY27 interim. At our 52% payout the FY27E dividend is ~₹{{F.dps.0|n1}} (${n1(yld)}% at ₹${n0(price)}), paid from ₹${n0(C.treasuryMar26.cashAndEquivalents + C.treasuryMar26.otherBankBalances + C.treasuryMar26.currentInvestments)} cr of cash and current investments (~₹92 a share) and free cash flow of ~₹{{F.fcf.0|num}} cr. The Government owns 61% and needs the cash, which keeps the payout high.` },
    { h: 'Volume is back, but growth is capped', p: `Offtake fell 2.4% in FY26 to 745 MT; Apr-Aug 2026 offtake rose 6.7% to 322.9 MT while production fell 4.5% as pithead stocks were drawn down from 130 MT. Power demand grows, but captive and commercial mines (+10% to 210 MT in FY26) and renewables (coal's share of generation ~68% in FY26, from ~71%) take much of the increment. We assume +${AS.build.qtyGrowth[0]}% in FY27 and +${AS.build.qtyGrowth[1]}% a year after, against a 815 MT production target and a 1 bn t FY30 plan.` },
    { h: 'Prices: e-auctions swing, FSA does not', p: `Over 85% of volume goes at notified FSA prices (₹1,444/t ex charges in FY26, ₹1,435 in Q1FY27) that did not rise from Apr-2025 to 30-Sep-2026 while diesel, explosives and outsourcing costs did. E-auctions (11-13% of volume) are the swing factor: premiums of 228% (FY23) and 99% (FY24) fell to 57% (FY26) and ~43% in Apr-Jul 2026. Low power-plant stocks (~8 days in September) could lift them again; the NCWA-XII wage settlement due from Jul-2026 is the cost on the other side.` },
    { h: 'Valuation: cheap on paper, fair on its own history', p: `At ₹${n0(price)} Coal India trades at ${n1(X.evNowFy28)}x FY28E EV/EBITDA (net cash at Mar-26) and ${n1(price / F.eps[1])}x FY28E EPS: cheap against the market, but in line with what investors have paid for it since 2021 (median ${n1(evMed)}x forward, 2-6x range). The street's 5-6x needs either a re-rating or EBITDA ~10% above ours (ICICI Direct's FY28E is ₹52,442 cr vs our ₹{{F.ebitda.1|num}} cr). We see fair value, a high yield and two-sided risk.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the monsoon quarter, e-auction premiums and whether a wage-revision provision starts.',
    'NCWA-XII: constitution of JBCCI-12 and the size of the non-executive wage settlement due from 1-Jul-2026.',
    'Winter e-auction premiums with power-plant stocks at ~8 days, and any notified (FSA) price revision.',
    'MCL IPO (DRHP filed 1-Sep-2026; Coal India selling 10%) and a planned SECL listing: cash in, minority share of profit out.',
    'Further Government stake sales (2% sold in May-2026 at a ₹412 floor) and the FY27 interim dividends.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const offFy = K.map(k => k.fy), offV = K.map(k => k.offtakeMt);
const prem = SG.annual.map(a => a.eaPremiumPct), premFy = SG.annual.map(a => a.fy);
const eptFy = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], ept = eptFy.map(f => Math.round(X.A.ebitda[X.fyIdx(f)] / K.find(k => k.fy === f).offtakeMt * 10));
const DPS = [['FY17', 19.9], ['FY18', 16.5], ['FY19', 13.1], ['FY20', 12.0], ['FY21', 16.0], ['FY22', 17.0], ['FY23', 24.25], ['FY24', 25.5], ['FY25', 26.5], ['FY26', 26.5]];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Offtake: 745 MT in FY26, ~${n0(bld[0].qty)} MT in FY27E`, unit: 'Coal sold / offtake (million tonnes)', x: [...offFy, ...F.years], series: [{ name: 'Offtake', values: [...offV.map(v => Math.round(v)), ...bld.map(r => Math.round(r.qty))], fmt: 'num' }], labels: 'all', source: 'AR FY26 operational statistics; GAM estimates FY27-29E (sales quantity)' },
      { type: 'column', title: 'E-auction premium over FSA: windfall in FY23-24, back to ~57%', unit: 'E-auction realisation vs FSA realisation, ex charges (%)', x: premFy, series: [{ name: 'Premium', values: prem, fmt: 'pct0' }], labels: 'all', source: 'PL 28-Jul-2026 (FY21-24); company decks (FY25-26)' },
    ] },
    { pair: [
      { type: 'column', title: 'EBITDA per tonne: ₹637 at the peak, ₹554 in FY26', unit: 'EBITDA per tonne of offtake (₹)', x: [...eptFy, ...F.years], series: [{ name: 'EBITDA/t', values: [...ept, ...AS.build.ebitdaPerT], fmt: 'num' }], labels: 'all', source: 'Screener.in (patched), AR FY26; GAM estimates per tonne sold' },
      { type: 'column', title: 'Q1FY27: ₹609 a tonne, down from ₹661 a year ago', unit: 'EBITDA per tonne sold, by quarter (₹)', x: SG.quarterly.map(q => q.q), series: [{ name: 'EBITDA/t', values: SG.quarterly.map(q => q.ebitdaPerT), fmt: 'num' }], labels: 'all', source: 'Company decks; Screener.in quarterly EBITDA' },
    ] },
    { pair: [
      { type: 'column', title: 'Dividend per share: ₹26.50 for FY25 and FY26', unit: 'Dividend per share (₹)', x: DPS.map(d => d[0]), series: [{ name: 'DPS', values: DPS.map(d => d[1]), fmt: 'n1' }], labels: 'all', source: 'AR FY26 ten-year ratios (interim + final)' },
      { type: 'hbar', title: 'Where the FY26 profit came from: MCL and NCL', unit: 'PAT FY26 by subsidiary (₹ crore)', x: C.subsidiariesFY26.rows.map(r => r[0]), series: [{ name: 'PAT', values: C.subsidiariesFY26.rows.map(r => r[4]), fmt: 'num' }], labels: 'all', source: 'AR FY26 directors\' report' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: ${n1(X.evNowFy28)}x FY28E now vs a ${n1(evMed)}x median since 2021`, unit: 'EV ÷ next full-year EBITDA (x)', x: evSeries.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: evSeries.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; realised EBITDA, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-Q1 notes)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...postQ1.map(s => s.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...postQ1.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes and roundups, 27-Jul to 10-Sep-2026; median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.fsa, P3.eauction, P3.costs, P3.subsidiaries, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
