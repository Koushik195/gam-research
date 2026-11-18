// PCBL report, part B (1/3): cover and the story in eight exhibits. As of 30-Sep-2026 (Q1FY27 basis).
const { ctx } = require('./PCBL.ctx');
const { C, D, F, V, A, S, n0, n1, pc, ai, SA, A26, A25, price, mv, epsSep28, rating, PE_X, ndE, fwdPe, fwdMed, preDeal, postDeal, fwdPeNow, troughTxt, ST, stAvg, ndEngine, PL, IDIR } = ctx;
const SRC = 'PCBL presentations, calls and Integrated Report FY26; GAM Research';
const yrs = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const peNow28 = price / F.eps[1];

const cover = {
  headline: 'A sound carbon black franchise carrying a debt-funded detour, priced as if the detour has already paid off',
  lead: `PCBL is India's largest carbon black maker (900 kt, ~6th globally) with a growing specialty-black business and 122 MW of free co-generated power. In Jan-2024 it bought Aquapharm, a phosphonates maker, for ₹3,800 cr, almost all with debt. Two years on, Aquapharm earns ₹${A26.aqEbitda} cr of EBITDA against ₹417 cr before the deal, carbon black EBITDA per tonne fell from ~₹19,200 (FY25) to ~₹14,200 (FY26), net borrowings are ₹4,536 cr (5.0x EBITDA on CARE's measure) and all three rating agencies have a Negative outlook. Q1FY27 was a record, but ~₹70 cr of it was cheap inventory. We forecast EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} for FY27-29E, below the street. The street values PCBL on **P/E**; at ₹${n1(price)} the stock trades at ${n1(price / epsSep28)}x our Sep-28E EPS. Our **${PE_X}x** (the stock's own history, re-weighted for today's specialty mix, no premium while ROE trails the cost of equity) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** EV/EBITDA (₹${n0(mv('ev').value)}) and DCF (₹${n0(mv('dcf').value)}) agree. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}: leverage makes the range wide.`,
  arguments: [
    { h: 'Carbon black: real scale, borrowed pricing power', p: `Volumes rose from 389 kt (FY21) to 619 kt (FY26) and capacity is now 900 kt. But rubber black is priced off crude through formulas with tyre majors and off Russian and Chinese imports in the spot market. EBITDA per tonne swung from ~₹19,200 (FY25) to ~₹14,200 (FY26) to ₹22,900 in Q1FY27 (incl. ~₹70 cr of inventory gains). Guidance for FY27 is ₹16,500-17,000. Specialty blacks (+23% in Q1) and power are the steady profit pools.` },
    { h: 'Aquapharm has been a costly mistake so far', p: `₹3,800 cr was paid for a business that made ₹417 cr of EBITDA in FY23; it made ₹194 cr in FY25 and ₹162 cr in FY26, and the Chemicals segment earned ₹17 cr of operating profit on ₹4,226 cr of assets. Management missed its FY26 target (₹300 cr) by 46% and its ₹75 cr exit-quarter target by 61%; a new CEO arrived in Jul-2026 and declined to repeat it.` },
    { h: 'Leverage and governance cap the multiple', p: `Debt has barely moved since the deal (₹4,825 cr gross at Mar-26), the Andhra Pradesh plant (Phase I ~₹1,100 cr) will be debt-funded, and we see net debt still ~${n1(ndEngine(2) / F.ebitda[2])}x EBITDA in FY29E against a Vision 2030 target of below 1x. PCBL also gave ₹35 cr to political parties in FY26 (18% of net profit), holds ₹464 cr of RPSG group-company shares and paid 119% of FY26 EPS as dividend.` },
    { h: 'The price assumes Vision 2030 will be delivered', p: `At ₹${n1(price)}, PCBL trades at ${n1(peNow28)}x our FY28E EPS. Its forward P/E was ${n1(preDeal)}x in the commodity years (2021-23) and ${n1(postDeal)}x after the Aquapharm deal; the house median since Apr-2021 (ex-${troughTxt}) is ${n1(fwdMed)}x. The gap is the market paying for ₹4,000 cr of FY30 EBITDA, including ₹1,400 cr from battery materials that have no revenue yet. Upside needs proof, not promises.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Balance sheet', v: 'RED' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): how much of Q1\'s ~₹70 cr inventory gain reverses (management: ₹40-50 cr) and whether volumes dip as guided.',
    'Aquapharm: the new CEO\'s plan, promised for the next call; oil & gas recovery; green-chelate approvals with P&G, Reckitt and Henkel.',
    'Capex decisions: coal-tar distillation (approval expected in Q2FY27) and the Andhra Pradesh greenfield (Phase I 150 kt, ~₹1,100 cr), and how they are funded.',
    'Credit: CRISIL\'s downgrade trigger is debt/EBITDA above 3-3.25x; CARE\'s is debt/PBILDT above 4x (5.0x in FY26).',
    'Nanovace: customer sampling of nano-silicon from Aug-2026; management expects commercial volumes in FY28.',
  ],
};

// ---------------------------------------------------------------- story in charts
const vis = { x: ['FY25 EBITDA', 'Cost & efficiency', 'Carbon black capacity', 'Battery materials', 'Aquapharm', 'Specialty black', 'FY30 target'], v: [1400, 150, 400, 1400, 600, 100, 4000] };
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Carbon black volume: 389 kt to 619 kt in five years', unit: 'Carbon black sales volume (kt)', x: yrs, series: [{ name: 'Volume', values: yrs.map(y => Math.round(ctx.ann(y).cbVol / 1000)), fmt: 'num' }], labels: 'all', source: 'ICICI Direct (company data, FY21-24); company presentations (FY25-26)' },
      { type: 'column', title: 'EBITDA per tonne: up to ~₹19,300, then back to ~₹14,200', unit: 'Carbon black incl. power: EBITDA ÷ tonnes (₹, Screener basis)', x: [...yrs, 'Q1FY27'], series: [{ name: 'EBITDA/t', values: [...yrs.map(y => ctx.ann(y).cbEbitdaPerT), Math.round((396 - 47) * 1e7 / 153513)], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'GAM calculation from company data; Q1FY27 includes ~₹70 cr inventory gain' },
    ] },
    { pair: [
      { type: 'column', title: 'Aquapharm EBITDA: ₹417 cr before the deal, ₹162 cr in FY26', unit: 'Aquapharm EBITDA (₹ crore)', x: ['FY23 (pre-deal)', 'FY25', 'FY26', 'FY27E (GAM)'], series: [{ name: 'EBITDA', values: [417, A25.aqEbitda, A26.aqEbitda, Math.round(F.seg.aq.adjEbitda[0])], fmt: 'num' }], labels: 'all', source: 'PTI (Nov-2023) for FY23; company presentations; GAM estimate' },
      { type: 'line', title: 'Net debt / EBITDA: under 1x before the deal, ~3.5-4x since', unit: 'Net debt ÷ EBITDA (x); FY27-29E GAM', x: [...A.labels.slice(ai('FY19')), ...F.years], series: [{ name: 'Net debt / EBITDA', values: [...ndE.slice(ai('FY19')), ...F.years.map((_, i) => Math.round(ndEngine(i) / F.ebitda[i] * 10) / 10)], fmt: 'x' }], labels: 'all', min: 0, lines: [{ v: 3.25, text: 'CRISIL trigger: 3-3.25x' }, { v: 1, text: 'Vision 2030: <1x', color: '#16a08a' }], source: 'Screener.in (net of cash and group-company shares); CRISIL; GAM estimates' },
    ] },
    { pair: [
      { type: 'waterfall', title: 'Vision 2030: ₹1,400 cr of the ₹4,000 cr target is battery materials', unit: 'EBITDA build-up FY25 → FY30, ₹ crore (company; parts sum to ₹4,050 cr)', x: vis.x, series: [{ name: 'EBITDA', values: vis.v }], fmt: 'num', totalFmt: 'num', source: 'RPSG Investor Day (8-Sep-2025)' },
      { type: 'column', title: 'Specialty blacks: the part of carbon black that is growing fastest', unit: 'Specialty black sales volume (tonnes)', x: yrs, series: [{ name: 'Specialty', values: yrs.map(y => ctx.ann(y).specVol), fmt: 'num' }], labels: 'all', source: 'ICICI Direct (company data, FY21-24); company presentations' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~${Math.round(preDeal)}x as a commodity stock, ~${Math.round(postDeal)}x after the deal`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: PE_X, text: `Our target: ${PE_X}x (house median ex-${troughTxt}: ${n1(fwdMed)}x)`, color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates FY27-29E. FY26 (EPS ₹5.0) is a trough year' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n1(price)}`, x: [...ST.map(s => `${s.broker} (${s.date.slice(5, 7) === '09' ? 'Sep' : 'Jul'})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes standing on 30-Sep-2026; GAM Research' },
    ] },
  ],
};

module.exports = { cover, narrative };
