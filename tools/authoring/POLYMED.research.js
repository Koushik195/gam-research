// Poly Medicure report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry,
// tailwind, infusion, renal, cardiology & orthopaedics, exports & the US, capacity, moat, Q1FY27, earnings quality,
// ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes).
// Shared inputs in POLYMED.ctx.js. Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./POLYMED.ctx');
const { V, n0, n1, pc, SQ, QL, price, mv, MULT, HB, SECTOR, rating, YRS, fwdNow, epsU, epsSep, epsBase, epsRepAll, sBase, PE5, PHARMA, shortName, waya, iifl, joindre, CONS, Q1, SA } = X;
const P2 = require('./POLYMED.part2'), P3 = require('./POLYMED.part3'), P3b = require('./POLYMED.part3b'), P4 = require('./POLYMED.part4'), P4b = require('./POLYMED.part4b'), P5 = require('./POLYMED.part5'), P5b = require('./POLYMED.part5b'), P6 = require('./POLYMED.part6');

const cover = {
  headline: `India's medical-consumables champion is paying for its next leg of growth: exports stalled, two acquisitions lose money and returns have halved; but at ${n1(fwdNow)}x FY28E earnings, below its own history, the price discounts much of it. On the street's P/E method we see {{dcf.upside|chg}}`,
  lead: `Poly Medicure makes ~1.9 bn single-use devices a year (it is the world's third-largest IV cannula maker) and exports two-thirds of them. After a decade of 15-20% growth, FY26 stalled: organic revenue +5%, exports down outside two European acquisitions (PendraCare, Citieffe) that added ₹117 cr of revenue and a ₹14 cr loss, and EBITDA margin down from 27% to 24%. Q1FY27 was better (organic +12.4%, standalone margin 28%) and management kept FY27 guidance of ₹2,300-2,400 cr. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E. The brokers that disclose a method use **P/E**, and so do we: **${MULT.base}x Sep-28E EPS (₹${n1(epsSep)})**, i.e. Polymed's ${n1(HB.med)}x median one-year-forward P/E since Apr-2021 (market value at each date, so the 2024 QIP is handled) adjusted +${SECTOR}% for the healthcare re-rating, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}; DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A world-class core business', p: 'Highly automated plants, EU MDR approvals on every site, ~68% standalone gross margin and 15-20-year distributor relationships make Polymed the low-cost, quality-approved supplier of IV cannulae, infusion sets and vascular-access devices to 125+ countries. India (31% of revenue) grows ~20% a year on import substitution.' },
    { h: 'A costly transition', p: 'Two QIPs (₹1,400 cr), ₹1,155 cr of capex in four years and ~₹390 cr for PendraCare and Citieffe have built capacity (65-70% used) and new segments (cardiology, orthopaedics, dialysis machines), but ROCE fell to 12%, free cash flow has been negative for four years and FY27E EPS grows only ~3% as D&A, interest and lower treasury income absorb the EBITDA gain.' },
    { h: 'Our numbers are below the bulls\'', p: `We keep consolidated margins near 24% (guidance 23-25%) rather than the ~28% older notes assumed, and include forex gains only at their three-year average. FY28E EPS ₹${n1(epsU[1])} is ~${Math.round((1 - epsU[1] / waya.eps.FY28E) * 100)}% below Waya's; EPS still compounds ~${Math.round(X.epsCagr)}% a year to FY29E as the acquisitions and new plants contribute.` },
    { h: 'Valuation: the price did the de-rating', p: `The stock is down 46% from its Nov-2024 peak and trades at ${n1(fwdNow)}x FY28E vs a ${n1(HB.med)}x median since 2021, while healthcare multiples re-rated. Our ${MULT.base}x gives {{dcf.tp|inr}} (${pc(V.upside)}): a BUY on our rule, with a wide range (bear {{scen.bear.tp|inr}}) and a DCF that says the price rests on the multiple.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Balance sheet', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): organic export growth, whether Middle East shipments resume, and the gap between standalone (28%) and consolidated (24%) margins.',
    'Anti-dumping decision on dialysers from China and Malaysia (management expects one "between now and end of the year").',
    'New plants: Palwal/Faridabad online by Mar-2027; Noida/YEIDA commercial in Q1FY28.',
    'Integration: production transfer to India and CDSCO registrations for PendraCare and Citieffe products (benefits from FY28, per management).',
    'US: new FDA 510(k) clearances and first meaningful orders; any change to the 10% tariff.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const ACQ = SQ.map(q => q.acqRev ?? (q.q === 'Q3FY26' ? Math.round((116.7 - 65) * 10) / 10 : 0));
const STREET = [['Waya (Dec-25)', waya.tp], ['IIFL (Feb-26)', iifl.tp], ['Joindre (Mar-26)', joindre.tp], ['Consensus (Trendlyne, Aug-26)', Math.round(CONS.trendlyneTp)]];
const sortedPh = [...PHARMA].sort((a, c) => PE5[c].move - PE5[a].move);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Quarterly revenue: acquisitions now add ~₹70 cr a quarter', unit: 'Revenue (₹ crore); Q2FY26\'s few days of PendraCare are inside Q3FY26', x: QL, series: [{ name: 'Organic', values: SQ.map((q, i) => Math.round((q.consRev - ACQ[i]) * 10) / 10), fmt: 'num' }, { name: 'PendraCare + Citieffe', values: ACQ, fmt: 'num' }], minLabel: 40, source: 'Company presentations; AR FY26 note 38; GAM' },
      { type: 'hbar', title: 'Two-thirds exported: FY26 revenue by region', unit: 'FY26 revenue (%)', x: ['India', 'Europe', 'Rest of world'], series: [{ name: 'FY26', values: [31, 32, 37], fmt: 'pct0' }], labels: 'all', highlight: 'India', source: 'Q4FY26 PPT p.33' },
    ] },
    { pair: [
      { type: 'line', title: 'Margins: standalone ~27-28%, consolidated down to 21-24%', unit: 'Operating EBITDA margin (%), company basis', x: QL, series: [{ name: 'Consolidated', values: SQ.map(q => q.opEbitdaMarginPct), fmt: 'pct' }, { name: 'Standalone', values: SQ.map(q => q.standaloneEbitdaMarginPct ?? null), fmt: 'pct' }], labels: 'all', min: 18, max: 30, source: 'Company presentations (standalone margin not given for Q3FY25, Q2-Q3FY26)' },
      { type: 'column', title: 'Gross cash: the QIP pile is a third smaller', unit: '₹ crore (cash, deposits and funds)', x: ['Mar-24', 'Mar-25', 'Dec-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Cash', values: [314, 1227, 839.8, 842.2, Q1.cash], fmt: 'num' }], labels: 'all', highlight: 'Mar-25', source: 'Screener.in; Q3FY26, Q4FY26 and Q1FY27 PPTs' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: ×2.4 in FY21-25, a dip in FY26, ~18% a year from FY28E', unit: 'EPS (₹); FY27-29E = GAM', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'EPS (FY26 before one-offs)', values: [2021, 2022, 2023, 2024, 2025, 2026].map(y => Math.round(epsBase[y] * 10) / 10).concat(epsU.map(v => Math.round(v * 10) / 10)), fmt: 'n1' }], labels: 'all', source: 'Screener.in; AR FY26; GAM Research' },
      { type: 'line', title: `Forward P/E since 2021: ${n1(fwdNow)}x now vs a ${n1(HB.med)}x median`, unit: 'Market value ÷ next full-year profit (x)', x: sBase.map(x => x[0]), series: [{ name: 'Forward P/E', values: sBase.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Target ${MULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in weekly prices; GAM' },
    ] },
    { pair: [
      { type: 'hbar', title: `Pharma peers vs their five-year P/E: median +${SECTOR}%`, unit: 'P/E at the 30-Sep-2026 close vs five-year median (%)', x: [...sortedPh.map(shortName), 'Poly Medicure'], series: [{ name: 'vs median', values: [...sortedPh.map(s => PE5[s].move), PE5.POLYMED.move], fmt: 'pct' }], labels: 'all', highlight: 'Poly Medicure', source: 'Screener.in P/E series; asof-peers.js; sector-factor.js' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...STREET.map(s => s[0]), 'GAM (base)'], series: [{ name: 'Target', values: [...STREET.map(s => s[1]), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and Trendlyne (Dec-2025 to Aug-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.infusion, P3.renal, P3.newlines, P3b.exports_, P3b.capacity, P3b.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4b.governance, P4b.forecasts, P5.street, P5b.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
