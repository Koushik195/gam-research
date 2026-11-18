// Aster DM Quality Care report, part B: cover, story in charts, and the merger of part2-6 (business, history & merger,
// industry, tailwind test, beds & KPIs, maturity, expansion, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in ASTERDM.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) in text; titles and sources are built in JS. As of 30-Sep-2026.
const X = require('./ASTERDM.ctx');
const { F, V, A, n0, n1, SA, SQ, Q1, b, price, mv, evMult, evAttrMult, ebitdaSep28, HEV, fwdEv, evNowAttr, rating, ST, sectorDrEv, avgTp, MIN, salValue } = X;
const P2 = require('./ASTERDM.part2'), P3 = require('./ASTERDM.part3'), P4 = require('./ASTERDM.part4'), P5 = require('./ASTERDM.part5'), P6 = require('./ASTERDM.part6');
const PQ = Q1.proForma;

const cover = {
  headline: 'India\'s third-largest hospital chain is born: the merger is accretive on paper, but at ₹697 the price already assumes the synergies arrive',
  lead: `On 1-Jul-2026 Quality Care India (Blackstone's CARE Hospitals, KIMSHEALTH and Evercare) merged into Aster DM Healthcare, which had sold its Gulf business in 2024. The new **Aster DM Quality Care** runs 39 hospitals with 10,898 beds, two-thirds of them outside metros, and is jointly controlled by the Moopen family (~24%) and Blackstone (~31%). We value the **merged company**, because that is what each of the 87.17 cr shares now owns; standalone Aster is a scenario. Pro-forma revenue rose 20% and operating EBITDA 30% in Q1FY27 before any synergies, and management targets a 24-25% margin by FY28-29. We forecast EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E (pro-forma, full years), below most of the street on revenue. The street values the stock on **EV/EBITDA on FY28E**; applying **${evAttrMult}x to Sep-28E EBITDA after minorities (${evMult}x consolidated EBITDA of ₹${n0(ebitdaSep28)} cr)**, net of debt and leases, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A bigger, better-balanced company', p: `Aster brought Kerala and Bengaluru (Medcity, CMI, MIMS); QCIL brought Hyderabad, Trivandrum, central and eastern India and Bangladesh. Kerala is still 43% of beds, but no state is a majority. Q1FY27 pro-forma: occupancy ${PQ.occupancyPct}% (+5.1pp), ARPP IP ₹${n0(PQ.arppIp)} (+10%), payor mix 87% cash and insurance.` },
    { h: 'Accretive at equal multiples, but QCIL\'s numbers are thin', p: 'QCIL contributed 53% of FY26 operating EBITDA for 42.7% of the shares, so pro-forma EPS rises from ₹7.49 (Aster) to ₹8.94. But QCIL\'s interest, depreciation and minorities are not published, its numbers are unaudited, and ~11% of combined EBITDA belongs to minority partners.' },
    { h: 'Growth is visible; synergies are a promise', p: `Bed plan +4,179 to 15,077 by FY30 (53% brownfield) for ~₹4,700 cr of project capex; synergy target ₹150-200 cr. We model revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}} and a post-Ind AS margin of {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}, the low end of guidance.` },
    { h: 'Fair value, not cheap', p: `At ₹${n0(price)} the stock trades at ${n1(evNowAttr)}x our FY28E EBITDA after minorities, close to its ${n1(HEV.med)}x median since the deal; peers had de-rated ${Math.round(-sectorDrEv)}% by 30-Sep-2026, giving ${evAttrMult}x and {{dcf.tp|inr}}. The street (₹855-920, average ₹${n0(avgTp)}) pays ~27-31x; our DCF (₹${n0(mv('dcf').value)}) says even today's price needs the expansion to work.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first accounts with QCIL consolidated, showing the real interest, depreciation, minorities and pooling adjustments behind our pro-forma estimates.',
    'Synergy delivery: management targets ₹150-200 cr (10-15% of FY24 pro-forma EBITDA), starting in FY27 and meaningful from FY28.',
    'Openings: Aster Capital, Trivandrum (454 beds, ~Jan-2027), Hyderabad women & children (300, ~Apr-2027), Sarjapur phase I (460, H2FY28), and QCIL brownfield blocks by 2028.',
    'Regulation: follow-up to the Supreme Court\'s 30-Sep-2026 remarks on drug mark-ups by corporate hospitals (a uniform 16% trade margin was suggested).',
    'Share supply: TPG (~3% left after its August sale) and, over time, Blackstone (~31%) are financial owners that will sell.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const plan = [10898, 10898 + 634, 10898 + 634 + 1190, 10898 + 634 + 1190 + 1555, 15077];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Beds: 10,898 today, ~15,000 planned by FY30', unit: 'Capacity beds (company plan, cumulative)', x: ['Jun-26', 'FY27', 'FY28', 'FY29', 'FY30+'], series: [{ name: 'Capacity beds', values: plan, fmt: 'num' }], labels: 'all', highlight: 'Jun-26', source: 'Q1FY27 presentation pp.5, 17' },
      { type: 'column', title: 'Occupancy up 5pp in a year at both halves', unit: 'Occupancy, census beds (%)', x: ['Aster', 'Quality Care', 'Combined'], series: [{ name: 'Q1FY26', values: [SQ[0].asterOccPct, SQ[0].qcilOccPct, SQ[0].pfOccPct], fmt: 'pct' }, { name: 'Q1FY27', values: [SQ[4].asterOccPct, SQ[4].qcilOccPct, SQ[4].pfOccPct], fmt: 'pct' }], labels: 'all', min: 40, max: 70, source: 'Q1FY27 presentation pp.8, 21, 28' },
    ] },
    { pair: [
      { type: 'column', title: 'Combined revenue: ₹7,314 cr (FY24) → ₹14,383 cr (FY29E)', unit: 'Revenue (₹ crore): company pro-forma FY24-26, GAM FY27-29E', x: [...SA.map(s => s.fy), ...F.years], series: [{ name: 'Revenue', values: [...SA.map(s => s.pfRev), ...F.sales], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company pro-forma (unaudited); GAM estimates' },
      { type: 'line', title: 'Margin: 19% → ~24%, the low end of the 24-25% target', unit: 'EBITDA margin (%): company operating FY24-26; GAM post-Ind AS FY27-29E', x: [...SA.map(s => s.fy), ...F.years], series: [{ name: 'Margin', values: [...SA.map(s => s.pfMarginPct), ...F.ebitdaMargin], fmt: 'pct' }], labels: 'all', min: 15, max: 27, lines: [{ v: 24.5, text: 'Guidance 24-25% (FY28-29)', color: '#cf8f1f' }], source: 'Company pro-forma; Q1FY27 call; GAM estimates (post-Ind AS is ~0.5pp below operating)' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Payor mix: 87% cash and insurance', unit: 'Share of Q1FY27 hospital revenue, pro-forma (%)', x: ['Walk-in (cash)', 'Corporate & insurance', 'Government schemes', 'International (MVT)'], series: [{ name: 'Share', values: [53, 34, 9, 4], fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation p.10' },
      { type: 'hbar', title: 'Mature hospitals: 65% of beds, 86% of EBITDA', unit: 'Q1FY27 share of operational beds vs hospital EBITDA (%)', x: Q1.maturity.map(m => m.bucket.split(' (')[0]), series: [{ name: 'Beds', values: Q1.maturity.map(m => m.opBedsPct), fmt: 'pct0' }, { name: 'EBITDA', values: Q1.maturity.map(m => m.ebitdaPct), fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation p.12' },
    ] },
    { pair: [
      { type: 'line', title: `Look-through forward EV/EBITDA: median ${n1(HEV.med)}x since the deal`, unit: 'EV (87.17 cr shares, net debt incl. leases) ÷ next-year EBITDA after minorities (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: evAttrMult, text: `Our target: ${evAttrMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company pro-forma net debt and EBITDA; GAM estimates FY27-29E' },
      { type: 'hbar', title: `Our ₹${n0(V.tp)} vs the street (notes standing on 30-Sep-26)`, unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${X.shortDate(s.date)})`), 'Aster alone (GAM scenario)', 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), Math.round(salValue / 10) * 10, V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes (6-Aug to 28-Sep-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.merger, P2.industry, P2.tailwind, P3.hospitals, P3.maturity, P3.expansion, P3.moat, p.financials, p.quarters, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
