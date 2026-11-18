// Solar Industries report, part B: cover, story in charts, and the merger of part2-4 (business, history,
// industry, tailwind test, the three business lines, Omnia, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// SOLARINDS.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./SOLARINDS.ctx');
const { F, V, A, n0, n1, SA, SQ, QL, A26, A22, Q1, price, mv, epsSep28, peMult, H21, fwdPe, rating, ST, tpMed, b, defExports, BL, defShare, omPbt, omAccretion, omValue, epsCagrFwd } = X;
const P2 = require('./SOLARINDS.part2'), P3 = require('./SOLARINDS.part3'), P4 = require('./SOLARINDS.part4'), P5 = require('./SOLARINDS.part5'), P6 = require('./SOLARINDS.part6');
const OB = X.SG.orderBookHistory;

const cover = {
  headline: 'India\'s explosives leader turned defence exporter: the growth is real, but the price already pays for it, and Omnia adds debt rather than value',
  lead: `Solar makes a quarter of India's commercial explosives, runs plants in 11 countries and has built, in a decade, a defence business that sold ₹${n0(A26.defence)} cr in FY26 (from ₹${n0(A22.defence)} cr in FY22): explosives for missiles, propellants, Pinaka rockets, ammunition and drones. Q1FY27 was excellent: revenue +${Q1.revenueYoYPct}%, profit +${Q1.patYoYPct}%, with defence +${Q1.defenceYoYPct}%. Management targets ₹14,000 cr of revenue in FY27 (+42%) and ₹4,500 cr from defence. On 14-Sep-2026 it agreed to buy South Africa's Omnia for ₹12,951 cr in cash, which would double revenue at half the margin. The street values Solar on **P/E (50-70x FY28-Sep-28E EPS)**. We forecast organic EPS of ₹${n0(F.eps[0])} / ₹${n0(F.eps[1])} / ₹${n0(F.eps[2])} for FY27-29E, close to the street for FY27 and ~${Math.round((1 - F.eps[1] / X.pl.eps.FY28E) * 100)}-${Math.round((1 - F.eps[2] / X.pl.eps.FY29E) * 100)}% below PL for FY28-29. Applying **${peMult}x to Sep-28E EPS of ₹${n0(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The defence engine is real', p: `Defence revenue grew ~${Math.round((Math.pow(A26.defence / A22.defence, 1 / 4) - 1) * 100)}% a year over FY22-26 to ${Math.round(X.share(A26, 'defence'))}% of sales; the defence order book is ~₹18,000 cr (Pinaka ~₹6,000 cr, exports ~₹11,000 cr). The defence subsidiary earned a 30% pre-tax margin in FY26, which is why group EBITDA margin rose from 19% (FY23) to 28%. We model defence at ₹{{as.businessLines.FY27E.defence|num}} / {{as.businessLines.FY28E.defence|num}} / {{as.businessLines.FY29E.defence|num}} cr.` },
    { h: 'But it is mostly exports, and the book has stopped growing', p: `${Math.round(A26.geoOutside / (A26.geoIndia + A26.geoOutside) * 100)}% of FY26 revenue was billed outside India; after international explosives that leaves ~₹${n0(Math.round(defExports / 100) * 100)} cr, which we infer is mainly defence exports, ~${Math.round(defExports / A26.defence * 100)}% of defence. The defence order book was ~₹18,000 cr in both Mar-26 and Jun-26: execution now runs ahead of new orders. Exports are lumpy and policy-exposed.` },
    { h: 'Explosives: steady volumes, inflated by price in FY27', p: `Domestic explosives grew only 3% in FY26 as coal overburden removal fell; FY27's guided +30-33% for explosives is 18-20% price as ammonium nitrate costs are passed on. International grew 32% in FY26 and should grow ~30% in FY27 (Omnia excluded). Price pass-through lifts revenue, not profit: we hold EBITDA margin at {{F.ebitdaMargin.0|pct}}-{{F.ebitdaMargin.2|pct}}.` },
    { h: 'Valuation: above its own history; Omnia does not change the math', p: `At ₹${n0(price)} Solar trades at ${n1(price / F.eps[1])}x our FY28E EPS vs a ${n1(H21.med)}x median forward P/E since 2021. Our ${peMult}x gives {{dcf.tp|inr}}. Omnia, on a full year, would add ~₹${n0(Math.round(omPbt / 10) * 10)} cr of pre-tax profit (~${Math.round(omAccretion)}% of ours) for ~₹11,900 cr of net debt; at 6-10x EBITDA it is worth ${X.sgn(Math.round(omValue(6) / 10) * 10)} to ${X.sgn(Math.round(omValue(10) / 10) * 10)} a share to Solar.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'num'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): defence run-rate against the ₹4,500 cr target, working-capital release, margins as ammonium nitrate costs pass through.',
    'Omnia: shareholder vote, competition and regulatory approvals and the final funding structure; completion expected early-to-mid 2027.',
    'Defence orders: Pinaka follow-ons (Mk2, guided, replenishment), Bhargavastra counter-drone trials (management: complete in calendar 2026), 155 mm qualification, further export orders.',
    'Ammonium nitrate prices and coal overburden removal after a weak FY26; the new Dhule, Odisha and South India plants.',
    'Capex delivery (₹2,050 cr in FY27) and whether new capacity earns its cost while debt rises.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const k1 = v => Math.round(v / 100) / 10;
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Defence went from 5% to 27% of revenue in five years', unit: "Revenue by customer line (₹ '000 crore)", x: SA.map(a => a.fy), series: [{ name: 'Domestic explosives', values: SA.map(a => k1(a.domestic)), fmt: 'n1' }, { name: 'International', values: SA.map(a => k1(a.intl)), fmt: 'n1' }, { name: 'Defence', values: SA.map(a => k1(a.defence)), fmt: 'n1' }], minLabel: 0.5, source: 'Company fact sheets (customer split); others (<1%) not shown' },
      { type: 'column', title: 'Defence revenue by quarter: lumpy, and back-ended', unit: 'Defence revenue (₹ crore)', x: QL, series: [{ name: 'Defence', values: SQ.map(q => q.defence), fmt: 'num' }], labels: 'all', source: 'Company fact sheets' },
    ] },
    { pair: [
      { type: 'column', title: 'Defence order book: a jump in FY25, flat since', unit: "Order book (₹ '000 crore)", x: [...OB.fy, 'Jun-26'], series: [{ name: 'Defence', values: [...OB.defenceBn.map(v => v / 10), 18], fmt: 'n1' }, { name: 'Total', values: [...OB.totalBn.map(v => v / 10), 21.35], fmt: 'n1' }], labels: 'all', source: 'MOFSL (21-Sep-2026) from company data; Jun-26 from the Q1FY27 fact sheet and broker notes' },
      { type: 'stacked', title: 'Most revenue is now billed outside India', unit: "Revenue from external customers by location (₹ '000 crore)", x: ['FY25', 'FY26'], series: [{ name: 'India', values: [k1(X.A25.geoIndia), k1(A26.geoIndia)], fmt: 'n1' }, { name: 'Outside India', values: [k1(X.A25.geoOutside), k1(A26.geoOutside)], fmt: 'n1' }], minLabel: 0.5, source: 'AR FY26, consolidated note 32 (geographical information)' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: a defence-mix step-up, then held near 28%', unit: 'EBITDA margin (%, Screener basis)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 10, max: 32, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'FY26: profit up, cash from operations down', unit: '₹ crore', x: A.labels.slice(-6), series: [{ name: 'Net profit', values: A.pat.slice(-6), fmt: 'num' }, { name: 'Cash from operations', values: A.cfo.slice(-6), fmt: 'num' }], labels: 'none', source: 'Screener.in (consolidated)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~${Math.round(price / F.eps[1])}x now vs a ${n1(H21.med)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: [...fwdPe.map(x => x[0]), X.ASOF], series: [{ name: 'Forward P/E', values: [...fwdPe.map(x => x[1]), Math.round(price / F.eps[1] * 10) / 10], fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: H21.med, text: `Median since 2021: ${n1(H21.med)}x` }], source: 'Screener.in prices (monthly samples plus the 30-Sep-2026 close); actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker.replace(' Institutional Equities', ' IE').replace('Prabhudas Lilladher', 'PL').replace(' (PCG)', ' PCG')), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes and press reports (Jul-Sep 2026); median target ₹${n0(tpMed)}` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.domestic, P3.intl, P3.defence, P3.omnia, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
