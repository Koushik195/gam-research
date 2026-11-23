// TVS Motor report, part 6b: valuation (street table, SOTP, standalone multiple derivation, TVS Credit, cross-checks,
// sensitivities, scenarios, DCF detail, peers).
const X = require('./TVSMOTOR.ctx');
const { streetBlocks, forwardSeries } = require('./valuation-blend');
const { M, F, V, A, AS, b, n0, n1, pc, price, shares, EPS, FM, FMp25, FMp75, FMmin, FMmax, W, fwdNow, PEER_SYMS, PEERS, P, MED5, derate, EXCL, OTHERS, sectorDr, sectorDrAll, factor, MULT, shortName,
  PB, tcBook, stake, SOTP, OTH, evMed, ttmEbitda, ebitdaSep28, evMult, ST, rating, shortDate, deal, lenderMed, justPb } = X;
const B = SOTP.base, mv = k => V.blend.methods.find(m => m.key === k);
const fs = forwardSeries('TVSMOTOR', M, 'eps').filter(x => x[0] >= '2016-04-01');
const epsCagr = (Math.pow(F.eps[2] / A.eps[b], 1 / 3) - 1) * 100, epsHist = (Math.pow(A.eps[b] / A.eps[b - 5], 1 / 5) - 1) * 100;
const at = (mult, pbm = PB.base, oth = B.others) => Math.round((mult * EPS.base + pbm * tcBook * stake / shares + oth) / 10) * 10;
const drTxt = s => `${shortName(s)} ${pc(derate[s])}`;

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: a sum of the parts gives {{dcf.tp|inr}}, ${pc(V.upside)} from here`,
  blocks: [
    ...streetBlocks('TVSMOTOR', {
      rating, noOurEps: true,
      streetIntro: 'Brokers value TVS Motor as a sum of the parts: the standalone two-wheeler business on P/E (33-35x FY28E or Jun-28E EPS in most notes; Arihant 27x FY29E; Axis ~31x Mar-28E core EPS) plus TVS Credit on book value or as a rupee amount per share (₹93-426). We do the same, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). Because the engine cannot add parts to a P/E, the "multiple" in our row is the sum of the parts divided by standalone Sep-28E EPS.',
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method.replace(/ \(.*?\)/g, '').slice(0, 110), s.multiple || '–', s.on ? s.on.replace(/ \(.*\)/, '') : '–', s.thesis.slice(0, 150)]),
      ourThesis: 'A great franchise priced for permanent outperformance; subsidiaries destroy value',
      streetSource: 'Broker notes 21-24 Jul 2026 (PL, Nirmal Bang, BOBCAPS, Emkay, Arihant, MOSL, Choice, Axis, Kotak); ICICI Securities and LKP via Trendlyne/aggregators',
      derivationTitle: `The standalone multiple: ${MULT.base}x Sep-28E EPS`,
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E since April 2021 (the house rule, leaving out trough years) and cut it by how far auto-OEM peers had de-rated by 30-Sep-2026. Under the batch rule we add no growth or returns premium and do not blend in TVS\'s own re-rating; those views appear as sensitivities below.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E (price ÷ next full-year standalone EPS) since Apr-2021: median ${n1(FM.median)}x (25th-75th percentile ${n1(FMp25)}-${n1(FMp75)}x; range ${n1(FMmin)}-${n1(FMmax)}x); trough years: ${FM.troughYears.length ? FM.troughYears.join(', ') : 'none'}. On EPS before exceptional items also ${n1(FM.median)}x (one-offs are tiny). For context: ${n1(W.since16)}x since 2016, ${n1(W.since23)}x since 2023, ${n1(fwdNow)}x on ${X.ASOF_TXT} on our FY28E`, `Starting point: ${n1(FM.median)}x`],
        ['2. Sector de-rating', `On 30-Sep-2026 auto OEMs traded below their five-year median trailing P/E: ${OTHERS.map(drTxt).join(', ')} (median ${pc(sectorDr)}). Left out: ${Object.entries(EXCL).map(([s, w]) => `${shortName(s)} (${pc(derate[s])}): ${w}`).join('; ')}. With all seven peers the median is ${pc(sectorDrAll)}`, `${n1(FM.median)}x × ${factor.toFixed(3)} = ${n1(FM.median * factor)}x → **${MULT.base}x**`],
        ['3. Growth', `Standalone EPS grew ${n1(epsHist)}% a year in FY21-26; we forecast ${n1(epsCagr)}% a year for FY26-29E (PLI ends after FY28). Slower growth on a bigger base is the opposite of a case for a higher multiple`, 'No adjustment (batch rule); see sensitivities'],
        ['4. Peers', `Trailing P/E at 30-Sep-2026: Eicher ${n1(P.EICHERMOT.pe)}x, Maruti ${n1(P.MARUTI.pe)}x, Bajaj ${n1(P['BAJAJ-AUTO'].pe)}x, Hero ${n1(P.HEROMOTOCO.pe)}x; TVS ${n1(P.TVSMOTOR.pe)}x (standalone)`, `${MULT.base}x Sep-28E = ${n1(MULT.base * EPS.base / F.eps[1])}x our FY28E: still the second-highest after Eicher`],
        ['5. Returns', `Standalone ROE ${n1(A.roe[b])}% in FY26 (~${Math.round(F.roe[1])}% FY28E) flattered by ₹11,300 cr of subsidiaries at cost and negative working capital; cost of equity ${n1(V.ke)}%`, 'Supports a premium to Hero; not to Eicher'],
      ],
      derivationSource: 'Screener.in (P/E history to 30-Sep-2026), NSE closes, GAM Research',
      crossNote: `**What the cross-checks say.** EV/EBITDA (${evMult.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr, plus net cash that includes ~₹11,300 cr of subsidiaries at cost) gives ₹${n0(mv('ev').value)}: ${evMult.base}x is TVS's ${n1(evMed)}x median trailing EV/EBITDA since 2021, cut by the same ${pc(sectorDr)} and restated for Sep-28E EBITDA being ${Math.round((ebitdaSep28 / ttmEbitda - 1) * 100)}% above the twelve months to Jun-26 (₹${n0(ttmEbitda)} cr). It counts the subsidiaries at book, which is more generous than our SOTP. The DCF (₹${n0(mv('dcf').value)}) assumes 15 years of growth fading from ~11% to 9%, a 13.5% margin and 6% terminal growth at a 12.2% cost of equity. Both cross-checks are far below ₹${n0(price)}: the market price needs ~20% EPS growth for longer, or a permanent 35x+ multiple.`,
    }),
    { h: 'The sum of the parts' },
    { exhibit: { type: 'table', title: 'Sum of the parts (₹ per share)', head: ['Part', 'Basis', 'Base', 'Bull', 'Bear'], wide: [1], rows: [
      ['Standalone auto business', `P/E ${MULT.base}x (bull ${MULT.bull}x = 75th percentile, bear ${MULT.bear}x = 25th percentile, both × the de-rating) on Sep-28E EPS ₹${n1(EPS.base)} (bull ₹${n1(EPS.bull)}, bear ₹${n1(EPS.bear)})`, n0(B.standalone), n0(SOTP.bull.standalone), n0(SOTP.bear.standalone)],
      [`TVS Credit (${n1(stake * 100)}%)`, `P/B ${PB.base}x (bull ${PB.bull}x, bear ${PB.bear}x) on Sep-28E book ₹${n0(tcBook)} cr`, n0(B.tvsCredit), n0(SOTP.bull.tvsCredit), n0(SOTP.bear.tvsCredit)],
      ['Norton, e-bikes, DriveX and others', 'PV of losses to breakeven + PT TVS at 15x + Ultraviolette at cost', n0(B.others), n0(SOTP.bull.others), n0(SOTP.bear.others)],
      { hl: true, cells: ['**Value per share**', '', `**${n0(B.perShare)}**`, `**${n0(SOTP.bull.perShare)}**`, `**${n0(SOTP.bear.perShare)}**`] },
      ['Implied multiple of standalone Sep-28E EPS (engine input)', '', `${n1(B.implied)}x`, `${n1(SOTP.bull.implied)}x`, `${n1(SOTP.bear.implied)}x`],
      { hl: true, cells: ['**12-month target (rounded)**', '', '**{{dcf.tp|inr}}**', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research. Standalone net debt is inside the P/E (as the street treats it); the NCRPS was repaid on 1-Sep-2026.' } },
    { pair: [
      { type: 'line', title: `One-year-forward P/E: ${n1(fwdNow)}x now vs ${n1(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year standalone EPS (x)', x: fs.map(x => x[0]), series: [{ name: 'Forward P/E', values: fs.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, lines: [{ v: MULT.base, text: `Our standalone multiple ${MULT.base}x = median ${n1(FM.median)}x × ${factor.toFixed(3)}`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for forecast years' },
      { type: 'hbar', title: 'What would change the target', unit: '₹ per share (target under each alternative)', x: ['Our base', 'Own median, no de-rating', 'Median since 2023 × de-rating', 'TVS Credit at July-2026 deal (2.6x)', 'Street multiple (34x)', '20% holding discount on TVS Credit', 'History stripped of TVS Credit (~−8%)'], series: [{ name: '₹', values: [V.tp, at(Math.round(FM.median * 2) / 2), at(Math.round(W.since23 * factor * 2) / 2), at(MULT.base, PB.bull), at(34), at(MULT.base, PB.base * 0.8), at(Math.round(MULT.base * 0.92 * 2) / 2)], fmt: 'num' }], labels: 'all', highlight: 'Our base', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'GAM Research (sensitivities only; the batch rule fixes the base)' },
    ] },
    { p: `**Why we do not use 33-35x.** The street\'s multiples match TVS\'s best years, not its median. They are also applied to standalone EPS that leaves out ~₹1,300 cr of annual subsidiary losses, and then TVS Credit is added on top, although the stock\'s own P/E history already contains the market\'s value of TVS Credit (~8% of the price today; stripping it would cut our multiple by ~2 turns). Even on the street\'s 34x our target would be ~₹${n0(at(34))}, below today\'s price.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Standalone ${MULT.bull}x, TVS Credit ${PB.bull}x book.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Volumes +18%/+10%/+8%, EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}} (PLI ends), standalone ${MULT.base}x, TVS Credit ${PB.base}x, subsidiaries −₹${n0(-B.others)}.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Standalone ${MULT.bear}x, TVS Credit ${PB.bear}x.`],
    ], source: 'GAM Research. Scenario changes apply to all three forecast years.' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary (standalone)', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27E (incl. subsidiaries at cost)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: `GAM Research. Cost of equity ${n1(V.ke)}% (risk-free 6.5%, beta ${AS.dcf.beta}, premium 6%); terminal growth ${AS.dcf.terminalGrowth}%; margin fading to ${AS.dcf.fadeMarginTo}%, capex to ${AS.dcf.fadeCapexPctTo}% of revenue.` } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed auto peers at the 30-Sep-2026 close', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA (x)', 'ROE'], rows: PEER_SYMS.map(s => { const p = P[s]; return [s === 'TVSMOTOR' ? '**TVS Motor (standalone)**' : shortName(s) + (EXCL[s] && s !== 'TVSMOTOR' ? ' (excl.)' : ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), n1(MED5[s]), pc(derate[s]), n1(p.evEbitda), p.roe + '%']; }), source: 'Screener.in; trailing multiples scaled to NSE closes on 30-Sep-2026. M&M is its standalone series.' } },
  ],
};

module.exports = { valuation };
