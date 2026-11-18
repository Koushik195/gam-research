// Deepak Fertilisers report, part B (1/5): cover and the story in eight exhibits. As of 30-Sep-2026 (Q1FY27 basis).
const { ctx } = require('./DEEPAKFERT.ctx');
const { C, F, V, A, S, n0, n1, ai, SA, SQ, A26, A25, Q1, price, mv, rating, PE_X, epsSep28, CHEM_X, FERT_X, blendX, fwdEv, fwdEvMed, fwdMed, troughTxt, ndE, ndF, ST, EMK, KEY } = ctx;
const yrs = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const AMM = { x: ['Apr-24', 'Jun-24', 'Aug-24', 'Oct-24', 'Dec-24', 'Feb-25', 'Apr-25', 'Jun-25', 'Aug-25', 'Oct-25', 'Dec-25', 'Feb-26', 'Apr-26', 'May-26', 'Jun-26'], v: [299, 353, 362, 430, 420, 328, 294, 298, 333, 430, 528, 484, 707, 801, 777] };
const QT = SQ.filter(q => q.tanRealisation);
// FY26 -> FY28E EBITDA bridge (GAM estimates; the last step is the balance)
const br = { start: 1684, shut: 75, gop: 480, dahej: 180, gas: 300 };
br.other = Math.round(F.ebitda[1] - br.start - br.shut - br.gop - br.dahej - br.gas);

const cover = {
  headline: 'India\'s TAN leader is about to get much bigger, but a war-time windfall is being priced as if it will last',
  lead: `Deepak Fertilisers makes ~40% of India's technical ammonium nitrate (TAN, the base of mining explosives), most of its concentrated nitric acid, its own ammonia (500 ktpa at Taloja) and Mahadhan fertilisers. Two projects worth ~₹4,650 cr (Gopalpur TAN, Dahej nitric acid) are due to start in Q2FY27 (we assume output from Q3), and a 15-year Equinor gas contract began in May-2026. Q1FY27 was a record (EBITDA ₹845 cr, 26% margin) because the Middle East war pushed ammonia to ~$800/t and TAN to ~₹70/kg. Those prices were already falling by end-September. We forecast EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E: higher volumes roughly offset fading spreads. The street (Emkay) values the stock on a **sum of the parts on EV/EBITDA**; we do the same on Sep-28E: Chemicals at **${CHEM_X}x** and Fertilisers at **${FERT_X}x** (from the stock's own forward-multiple history, de-rated with the sector), less corporate costs, the DMSL convertible holders' claim and net debt. That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** P/E (₹${n0(mv('pe').value)} at ${PE_X}x) and DCF (₹${n0(mv('dcf').value)}) bracket it. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'A real TAN franchise that grows 64% in capacity', p: `TAN volumes rose from 519 kt (FY25) to 577 kt (FY26) at ~98% utilisation; Gopalpur adds 376 ktpa on the east coast, next to the coal belt, taking capacity to ~963 ktpa. Deepak is the only Indian maker of low- and high-density AN, sells 17% of TAN revenue through mine-site services (B2C) and has bought an explosives unit (Chardham, ₹121 cr). Dahej adds 450 ktpa of nitric acid, 65% of the concentrated grade pre-sold for 20 years.` },
    { h: 'Q1FY27 was a windfall, not a run-rate', p: `Chemicals EBIT was ₹${n0(Q1.chemEbit)} cr in Q1FY27, 70% of the segment's full-year FY26 EBIT (₹${n0(A26.chemEbit)} cr). Ammonia (bulk FOB Middle East) went from ~$300/t in mid-2025 to $801/t in May-2026; it was ~$600 by end-July and Tampa ammonia fell for a fourth month in September. We put Chemicals EBITDA margins at 37.5% in FY27E and 32% in FY28E (47% in Q1), still above FY25's 33% thanks to cheaper Equinor gas.` },
    { h: 'Debt falls from FY28, with strings attached', p: `Net debt was ₹4,719 cr at Jun-26 (company measure). Capex drops from ~₹950 cr (FY27E) to ~₹500-600 cr and we see net debt at ~₹${n0(ndF(2))} cr by Mar-29E (Screener basis). But the ₹800 cr of DMSL convertibles carry a 12.5% yield and will take ~6-7% of the mining subsidiary; a promoter LLP bought ₹300 cr of them partly with money borrowed against pledged DFPCL shares; and the ammonia subsidiary lost ₹257 cr in FY26.` },
    { h: 'The price already pays for the good news', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E EPS and ${n1(F.evEbitda[1])}x FY28E EV/EBITDA. Its own one-year-forward medians since Apr-2021 are ${n1(fwdMed)}x P/E (ex-${troughTxt} trough) and ${n1(fwdEvMed)}x EV/EBITDA, and fertiliser and chemical peers sit below their five-year medians. Our sum of the parts implies ${n1(blendX)}x Sep-28E EBITDA. Upside needs the war-time spreads to last.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Balance sheet', v: 'AMBER' },
    { k: 'Governance', v: 'RED' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): commissioning of Gopalpur and Dahej (guided for Q2FY27, after three slips) and how far spreads fell from Q1.',
    'Rabi 2026-27 nutrient-based subsidy rates (not announced by 30-Sep-2026): whether they cover phosphoric acid at ~$1,360/t and sulphur.',
    'Ammonia and TAN prices: Russian supply (export ban lifted in May-2026; analysts flagged a possible ammonia export ban from October-2026) and Middle East shipping.',
    'Gopalpur ramp-up: management targets ~80% utilisation by Q4FY27; ammonia for Gopalpur is bought, not made.',
    'DMSL listing (IPO or demerger, no decision yet) and the CCD conversion (by mutual agreement after ~30 months, i.e. from late 2027; mandatory at 48 months).',
  ],
};

// ---------------------------------------------------------------- story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Chemicals earns most of the profit; fertilisers are thin', unit: 'Segment EBIT (₹ crore)', x: [...yrs, 'Q1FY27'], series: [{ name: 'Chemicals', values: [...yrs.map(y => Math.round(ctx.ann(y).chemEbit)), Math.round(Q1.chemEbit)], fmt: 'num' }, { name: 'Fertilisers', values: [...yrs.map(y => Math.round(ctx.ann(y).fertEbit)), Math.round(Q1.fertEbit)], fmt: 'num' }], labels: 'none', source: 'Annual reports FY21-FY26 (segment notes); Q1FY27 results' },
      { type: 'column', title: 'TAN revenue per kg: ₹43-48 for a year, then ₹70', unit: 'TAN revenue ÷ volume (₹/kg)', x: QT.map(q => q.q), series: [{ name: 'TAN ₹/kg', values: QT.map(q => q.tanRealisation), fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', source: 'GAM calculation from company presentations (TAN revenue and volume)' },
    ] },
    { pair: [
      { type: 'line', title: 'Ammonia: from ~$300/t to $801/t in a year', unit: 'Ammonia bulk FOB Middle East ($/t, monthly)', x: AMM.x, series: [{ name: 'Ammonia', values: AMM.v, fmt: 'num' }], labels: 'ends', min: 0, source: 'Company presentations (May-2026, Jul-2026); ~$600 at end-July per management; Tampa $555 for Sep-2026 (Fertilizer Daily)' },
      { type: 'column', title: 'Capacity: TAN +64%, nitric acid +40% in FY27', unit: 'Capacity (ktpa)', x: ['TAN', 'Weak nitric acid', 'Concentrated nitric acid'], series: [{ name: 'Before', values: [587, 885, 231], fmt: 'num' }, { name: 'After Gopalpur and Dahej', values: [963, 1185, 381], fmt: 'num' }], labels: 'all', source: 'Company presentations (Q1FY27: capacities by site; Gopalpur 376 ktpa TAN, Dahej 300 ktpa WNA + 150 ktpa CNA)' },
    ] },
    { pair: [
      { type: 'waterfall', title: `EBITDA bridge FY26 → FY28E: capacity and gas, not spreads`, unit: 'EBITDA, ₹ crore (GAM estimates)', x: ['FY26', 'No ammonia shutdown', 'Gopalpur TAN', 'Dahej nitric acid', 'Equinor gas', 'Spreads, mix, fertilisers, other', 'FY28E'], series: [{ name: 'EBITDA', values: [br.start, br.shut, br.gop, br.dahej, br.gas, br.other, Math.round(F.ebitda[1])] }], fmt: 'num', totalFmt: 'num', source: 'GAM estimates: Gopalpur ~300 kt × ~₹16,000/t; Equinor ~₹300 cr a year (management, Q1FY27 call)' },
      { type: 'line', title: 'Net debt / EBITDA: 3.0x in FY26, ~0.9x by FY29E in our base case', unit: 'Net debt ÷ EBITDA (x); FY27-29E GAM', x: [...A.labels.slice(ai('FY19')), ...F.years], series: [{ name: 'Net debt / EBITDA', values: [...ndE.slice(ai('FY19')), ...F.years.map((_, i) => Math.round(ndF(i) / F.ebitda[i] * 10) / 10)], fmt: 'x' }], labels: 'all', min: 0, source: 'Screener.in (borrowings incl. leases less cash and investments); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward EV/EBITDA: median ${n1(fwdEvMed)}x since 2021; our SOTP implies ${n1(blendX)}x`, unit: 'EV ÷ next full-year EBITDA (x)', x: fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(blendX * 10) / 10, text: `SOTP: ${n1(blendX)}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EBITDA and net debt; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [`${KEY.broker} (Jun-26)`, `${EMK.broker} (Nov-25)`, 'GAM (base)'], series: [{ name: 'Target', values: [KEY.tp, EMK.tp, V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes as cited in the street chapter; GAM Research' },
    ] },
  ],
};

module.exports = { cover, narrative };
