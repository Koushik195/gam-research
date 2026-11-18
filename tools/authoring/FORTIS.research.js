// Fortis Healthcare report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, KPIs, margin matrix, bed pipeline, Agilus, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary). Shared inputs in FORTIS.ctx.js / ctx2.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const fs = require('fs');
const path = require('path');
const X = require('./FORTIS.ctx');
const { F, V, A, n0, n1, SA, SQ, QL, Q1, FY26, b, price, mv, hospMult, diagMult, HEV, fwdEv, evNow, rating, ST, avgPost, hospM, postEsopHospM, pl, mosl, pHosp, pEsop, pDiag, pMin, pNet, ROOT, ASOF, shortName, isecOnOurs, moslOnOurs, pfCore } = X;
const P2 = require('./FORTIS.part2'), P3 = require('./FORTIS.part3'), P4 = require('./FORTIS.part4'), P4b = require('./FORTIS.part4b'), P5 = require('./FORTIS.part5'), P6 = require('./FORTIS.part6');
const epsGap = Math.round((1 - F.eps[1] / pl.eps.FY28E) * 100);

const cover = {
  headline: 'A good hospital chain at a full price, with the 2018 deal back in court: we initiate with a Sell',
  lead: `Fortis runs 36 facilities with ~6,150 operational beds (incl. ~1,200 managed for others), led by FMRI Gurugram and a dense NCR-Punjab network, and owns 88% of Agilus Diagnostics. Under IHH (31%) it has turned around: operating EBITDA ₹1,101 cr → ₹2,085 cr in FY23-26, margin 17.5% → 22.8%. But growth now depends on new beds (ARPOB +2.6% in Q1FY27, occupancy flat at ~69%), a new ESOP costs ~₹150 cr in FY27, and on 31-Aug-2026 the Delhi High Court ordered a forensic audit of the 2018 IHH deal (the Supreme Court declined to interfere on 25-Sep). The street values Fortis on a **sum of the parts (hospitals 27-30x, diagnostics 23-24x EV/EBITDA)**. We forecast EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E, below the street on margins. Applying **${hospMult}x to Sep-28E hospital EBITDA and ${diagMult}x to Agilus** (Fortis's own forward median since 2021, less the sector's de-rating), less ESOP, the Agilus minority and net debt incl. leases, gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Good hospitals, mostly fixed already', p: `14 of 24 facilities earn above 20% (70% of revenue) at 74% occupancy; FMRI runs at 85-90%. The turnaround gains are in the numbers; the remaining lever is six ramp-up units with ~10% of revenue and new beds in full hospitals (~1,800 by FY30, only 173 in FY28).` },
    { h: 'Margins: the target moved, the numbers did not', p: `Hospital margin before ESOP was 21.5% in Q1FY27 (22.1% a year earlier); the 25% FY28 target now has to absorb ~₹120 cr of ESOP. We model ${n1(hospM[0])}% / ${n1(hospM[1])}% / ${n1(hospM[2])}% before ESOP ({{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} group after it): FY28E EPS ${epsGap}% below Prabhudas Lilladher.` },
    { h: 'Overhangs are back', p: 'A forensic audit (report due ~6 months after the 31-Aug-2026 order) re-examines the 2018 IHH investment and the RHT buyback; the Supreme Court questioned hospital drug mark-ups on 29-Sep-2026; CGHS/ECHS drug caps have already cut oncology growth to ~5%. IHH\'s plans to go to ~50%, inject capital and merge Gleneagles wait on the courts.' },
    { h: 'Valuation: above peers and its own history', p: `At ₹${n0(price)} Fortis trades at ${n1(evNow)}x our FY28E EV/EBITDA vs a ${n1(HEV.med)}x forward median since 2021 and a ~${n1(pfCore)}x peer median. The street's ₹1,030-1,150 targets rest on 27-30x hospital multiples: on our estimates those multiples alone give ₹${n0(isecOnOurs)}-${n0(moslOnOurs)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): first full quarter of the ~₹40 cr ESOP charge; whether the FMRI tower (~200 beds) has opened; hospital margin vs the 25%-by-FY28 path.',
    'The forensic auditor\'s questionnaire (due ~4 weeks after the 31-Aug-2026 order) and report (~6 months); any appeal or further court steps.',
    'The Supreme Court hearing on hospital drug pricing (adjourned at the 29-Sep-2026 hearing): any move towards a margin cap on medicines.',
    'IHH: terms of any equity infusion, stake increase or Gleneagles merger (needs a majority-of-minority vote).',
    'Agilus under its new CEO (from Jul-2026): test volumes and the 12-13% growth guidance; Manesar oncology (by Nov-2026) and Greater Noida reaching mid-teens margins by end-FY27.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const K = SA, closes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'market', 'closes', `${ASOF}.json`), 'utf8')).closes;
const pxAt = (s, d) => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', s, 'screener.json'), 'utf8')).charts.price.Price.filter(([q]) => q <= d); return S.at(-1)[1]; };
const MOVE = ['FORTIS', 'APOLLOHOSP', 'MAXHEALTH', 'NH', 'MEDANTA', 'RAINBOW', 'JLHL'].map(s => [shortName(s), Math.round((closes[s] / pxAt(s, '2026-07-31') - 1) * 1000) / 10]);
const perSh = p => Math.round(p.value / F.shares);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Occupied beds: +28% since FY23, with occupancy held at ~68-69%', unit: 'Average occupied beds; Q1FY27 = Jun-26 quarter', x: [...K.slice(1).map(k => k.fy), 'Q1FY27'], series: [{ name: 'Occupied beds', values: [...K.slice(1).map(k => k.occupiedBeds), Q1.occupiedBeds], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
      { type: 'column', title: 'ARPOB growth has slowed from 11% to 3%', unit: 'ARPOB growth, year on year (%)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'ARPOB growth', values: [11.5, 10.8, 9.0, 3.4, 2.6], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations (gross ARPOB)' },
    ] },
    { pair: [
      { type: 'line', title: 'Hospital margin: big gains done; ESOP takes ~1.5pp from FY27', unit: 'Hospital operating EBITDA margin (%): before and after ESOP', x: [...K.map(k => k.fy), ...F.years], series: [{ name: 'Before ESOP', values: [...K.map(k => Math.round(k.hospEbitda / k.hospRev * 1000) / 10), ...hospM.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }, { name: 'After ESOP', values: [null, null, null, null, 22.2, ...postEsopHospM.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', min: 10, max: 28, source: 'Company presentations; GAM estimates FY27-29E (management target: 25% after ESOP by FY28)' },
      { type: 'column', title: 'Agilus: revenue back above the Covid peak only in FY27E', unit: 'Agilus gross revenue (₹ crore)', x: [...K.map(k => k.fy), ...F.years], series: [{ name: 'Gross revenue', values: [...K.map(k => k.diagRev), ...X.DG.revenue.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Company presentations; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since 2021, ${n1(evNow)}x now`, unit: 'EV (incl. leases and minorities) ÷ next full-year EBITDA (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hospMult, text: `Hospitals target: ${hospMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; AR FY26; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${X.shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and aggregators (Feb-2026 to Sep-2026), GAM Research' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Fortis fell 19% after July, more than Apollo, Max or Narayana', unit: 'Share price change, 31-Jul to 30-Sep-2026 (%)', x: MOVE.map(m => m[0]), series: [{ name: 'Change', values: MOVE.map(m => m[1]), fmt: 'pct' }], labels: 'all', highlight: 'Fortis', source: 'Screener.in weekly prices; NSE closes on 30-Sep-2026' },
      { type: 'hbar', title: 'Where our target comes from', unit: '₹ per share (base case, Sep-28E)', x: ['Hospitals', 'Less: ESOP', 'Agilus (100%)', 'Less: Agilus minority', 'Less: net debt incl. leases', 'Target'], series: [{ name: '₹/share', values: [perSh(pHosp), perSh(pEsop), perSh(pDiag), perSh(pMin), perSh(pNet), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'Target', source: 'GAM Research' },
    ] },
  ],
};

const valuation = { ...P5.valuation, blocks: [...P5.valuation.blocks, ...P5.sotpBlocks] };
module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hospitals, P3.matrix, P3.expansion, P3.agilus, P3.moat, p.financials, p.seasons, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4b.forecasts, P5.street, valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
