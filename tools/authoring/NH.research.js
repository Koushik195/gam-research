// Narayana Hrudayalaya report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry,
// tailwind test, India hospitals, Cayman, UK, insurance & clinics, moat, Q1FY27, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in NH.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) or computed from the model. As of 30-Sep-2026.
const X = require('./NH.ctx');
const { F, V, A, n0, n1, SQ, QL, Q1, FY26, b, price, mv, peMult, IND_X, CAY_X, UK_X, ebitdaSep28, HEV, fwdEv, evNow28, rating, ST, pl, idir, sectorDrEv, impliedInd, blendX, segE, segR, ann, YRS } = X;
const P2 = require('./NH.part2'), P3 = require('./NH.part3'), P4 = require('./NH.part4'), P5 = require('./NH.part5'), P6 = require('./NH.part6');
const gap = (g, s) => `${Math.abs(Math.round((g / s - 1) * 100))}%`;

const cover = {
  headline: 'An excellent Indian hospital business inside a costlier, slower group: at ₹1,791 the market already pays the full price',
  lead: `Narayana Health runs India's lowest-cost large hospital network (5,461 operational beds; existing beds cost ~₹75 lakh each), a US-dollar hospital business in the Cayman Islands, and since Nov-2025 the UK's Practice Plus Group; it also funds two young insurers and a clinic chain. The India hospitals are the jewel: EBITDA +40% in Q1FY27 with no new beds, margin 24.8%. The rest of the group dilutes them: the UK earns ~9% on NHS work, and the insurers and clinics lost ₹139 cr in FY26 and ₹68 cr in Q1FY27 alone. The street values NH on a **sum of the parts on EV/EBITDA** (India 24-25x, Cayman/international 15-16x, FY28E). We forecast EBITDA of ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr and EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E, ${gap(F.eps[1], pl.eps.FY28E)} below PL for FY28E. Valuing India at **${IND_X}x**, Cayman at **${CAY_X}x** and the UK at **${UK_X}x** (at cost) on Sep-28E EBITDA, multiples derived from NH's own ${n1(HEV.med)}x forward EV/EBITDA history and the sector's ${Math.abs(Math.round(sectorDrEv))}% de-rating, and deducting the present value of the insurance and clinic losses until breakeven (₹${n0(-X.lossPvTot)} cr), gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'India: best-in-class cost, growth bought with price', p: `India hospital ARPOB rose from ₹14.0 mn (FY24) to ₹19.2 mn (Q1FY27) a year per occupied bed, and the margin from 19.9% to 24.8%. But occupied beds fell ~5% over FY24-26 (to ~2,650 on ~5,450 beds), and the next 2,035 beds cost ₹1.8-2.6 cr each, three times the old ones. We model India revenue +{{as.segments.0.growth.0|pct}} / +{{as.segments.0.growth.1|pct}} / +{{as.segments.0.growth.2|pct}}.` },
    { h: 'The group dilutes the jewel', p: `Cayman (~44% margin on PL's split) is slowing to single-digit growth; the UK (~9%, ~95% NHS-funded, £150 mn acquisition loan) is a turnaround bet with a heatwave-hit first full quarter; Cayman insurance lost US$${Math.abs(Q1.cayman.cihlEbitdaUsdMn)} mn and India clinics + insurance ₹${n0(Math.abs(SQ.at(-1).icEbitdaCo))} cr in Q1FY27. Group EBITDA margin {{F.ebitdaMargin.0|pct}} in FY27E vs India's ~24%.` },
    { h: 'Earnings below the street', p: `Our FY28E EPS of ₹${n1(F.eps[1])} is ${gap(F.eps[1], pl.eps.FY28E)} below PL (₹${n1(pl.eps.FY28E)}) and ${gap(F.eps[1], idir.eps.FY28E)} below ICICI Direct (₹${n1(idir.eps.FY28E)}): we keep depreciation and interest at the Q1FY27 run-rate, give the UK and Cayman insurer a slower turnaround, and assume clinic and India insurance losses of ₹120 cr in FY27E (as Kotak does).` },
    { h: 'Valuation: full on its own history', p: `At ₹${n0(price)} NH trades at ${n1(evNow28)}x our FY28E EV/EBITDA, right at its ${n1(HEV.med)}x forward median since Apr-2021, while listed hospitals had de-rated ~${Math.abs(Math.round(sectorDrEv))}%. Valuing Cayman and the UK at our multiples, today's price already pays ~${n1(impliedInd)}x for India. The DCF (₹${n0(mv('dcf').value)}) also says the price is ahead of the cash flows.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter of Cayman insurance repricing (July renewals), the UK after the heatwave, India margins with South-West Bengaluru opening at the end of Q2.',
    'Cayman insurance January renewals and the path to breakeven (Kotak: by end-FY28).',
    'Project milestones: HSR Bengaluru and Raipur (FY28), Rajarhat and Central Bengaluru (FY29), South Bengaluru (FY30) after a one-year slip in three of them.',
    'UK: software certification (4-6 months late), payer-mix shift away from ~95% NHS, first ROCE disclosure (management: about four quarters from Aug-2026).',
    'NCLT approval of the clinic demerger into the listed company; India insurance claims ratio (219% in Q1FY27).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const AK = X.C.annualKpis, q = SQ;
const segNames = ['India hospitals', 'Cayman hospitals', 'UK (PPG)', 'Cayman insurance', 'India clinics + insurance'], segKeys = ['ind', 'cay', 'uk', 'cihl', 'ic'];
const fy26e = segKeys.map(k => ann('FY26')[k + 'Ebitda']);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'India ARPOB: +37% in two years and a quarter', unit: 'India hospital ARPOB (₹ mn per occupied bed a year)', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'ARPOB', values: [...AK.map(k => k.arpobIndiaMn), Q1.indiaHospitals.arpobMn], fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations' },
      { type: 'line', title: 'But occupied beds fell ~5% over FY24-26', unit: 'Occupied beds = India hospital revenue ÷ ARPOB (annualised for Q1FY27)', x: [...AK.slice(1).map(k => k.fy), 'Q1FY27'], series: [{ name: 'Occupied beds', values: [...AK.slice(1).map(k => k.occBedsIndia), Math.round(Q1.indiaHospitals.revenueCr * 4 / Q1.indiaHospitals.arpobMn * 10)], fmt: 'num' }], labels: 'all', min: 2400, max: 2900, source: 'Company presentations; GAM Research (occupancy is not disclosed)' },
    ] },
    { pair: [
      { type: 'line', title: 'India hospital margin: 18% (FY23) to 25% (Q1FY27)', unit: 'India hospital EBITDA margin, company basis (%)', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Margin', values: [...AK.map(k => k.indHospMarginCo), Q1.indiaHospitals.marginPct], fmt: 'pct' }], labels: 'all', min: 10, max: 30, source: 'Company presentations (FY23 incl. Jammu)' },
      { type: 'hbar', title: 'FY26 EBITDA by business: two loss-makers', unit: 'EBITDA, FY26 (₹ crore; PL split, UK five months)', x: segNames, series: [{ name: 'EBITDA', values: fy26e.map(v => Math.round(v)), fmt: 'num' }], labels: 'all', highlight: 'India hospitals', source: 'PL Q1FY27 note; company presentations' },
    ] },
    { pair: [
      { type: 'column', title: 'Insurance and clinic losses: ₹68 cr in Q1FY27', unit: 'Quarterly EBITDA losses (₹ crore): Cayman insurer and India clinics + insurer', x: QL.slice(4), series: [{ name: 'Cayman insurance', values: q.slice(4).map(x => x.cihlEbitda), fmt: 'num' }, { name: 'India clinics + insurance', values: q.slice(4).map(x => x.icEbitdaCo), fmt: 'num' }], labels: 'all', source: 'Company presentations; PL Q1FY27 note' },
      { type: 'column', title: 'FY27E revenue: the UK is now almost a third of the group', unit: 'Revenue by business, FY27E (₹ crore)', x: segNames, series: [{ name: 'FY27E', values: segKeys.map(k => Math.round(segR(k)[0])), fmt: 'num' }], labels: 'all', highlight: 'UK (PPG)', source: 'GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(HEV.med)}x since Apr-21, ${n1(fwdEv.at(-1)[1])}x now`, unit: 'EV (incl. lease liabilities) ÷ next full-year EBITDA, post-Ind AS (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: Math.round(blendX * 10) / 10, text: `Our SOTP: ${n1(blendX)}x Sep-28E`, color: '#cf8f1f' }], source: 'Screener.in prices and balance sheets; GAM estimates FY27-29E; pre-deal points exclude the UK' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (calls standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker.replace(' (Institutional / PCG)', '')} (${X.shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press (Mar-2026 to Aug-2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.cayman, P3.uk, P3.insurance, P3.moat, p.financials, p.seasons, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
