// Coromandel initiation, part 5: forecasts vs the street, street view, valuation.
const X = require('./COROMANDEL.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, AS, n0, n1, pctChg, A26, price, mult, epsSep28, pe28, peSep28, ownersPat, nc, dcfV, evV, dcfAdj, rating, PEERS, PEER_SYMS, FERT, AGRO, sectorDerate, sectorDerateEv, fertPe, agroPe, CI, pname, fwdMed21, fwdYear, BR, moslEps, shkE, ASOF_TXT, mv } = X;
const segRow = (k, name, field, hist) => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|num}}`)];
const r = v => Math.round(v);

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: a weak FY27, a recovery in FY28, still well below the street',
  blocks: [
    { p: `We forecast each segment's revenue and EBITDA margin (segment PBIT plus its D&A), remove inter-segment sales and deduct central costs (~₹360-400 cr). Below EBITDA, depreciation rises to ~₹${n0(F.dep[0])} cr in FY27E (Q1 run-rate ₹812 cr) and finance cost stays ~₹370-400 cr because acceptances fund costlier imported raw materials. Tax is 26%. **Engine note:** the model has no minority-interest line and derives its share count from FY26 total profit ÷ EPS (28.62 cr vs 29.50 cr actual); we carry minorities and that difference in the tax line, so model EPS equals profit attributable to shareholders ÷ 29.50 cr shares. Every assumption is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Nutrient & allied' }, segRow('nut', 'Revenue', 'revenue', A26.nutRev), segRow('nut', 'EBITDA', 'adjEbitda', A26.nutEbitda),
      { sec: 'Crop protection' }, segRow('cp', 'Revenue', 'revenue', A26.cpRev), segRow('cp', 'EBITDA', 'adjEbitda', A26.cpEbitda),
      ['Inter-segment eliminations (revenue)', '−' + n0(A26.interSeg), '{{F.seg.elim.revenue.0|num}}', '{{F.seg.elim.revenue.1|num}}', '{{F.seg.elim.revenue.2|num}}'],
      ['Central costs', '−343', '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
    ], source: 'Company (FY26), GAM Research estimates; FY26 central costs = segment EBITDA ₹3,575 cr less EBITDA ₹3,232 cr' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Profit before tax', ref: 'fin.pbt' },
      { name: 'EPS (₹, attributable)', ref: 'fin.eps', fmt: 'n1', hl: true }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'FY26A', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', 'MOSL FY28E', 'Sharekhan FY28E (Dec-25)'], rows: [
      ['EBITDA (₹ cr)', '3,232', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', '~4,500 (implied by 18% CAGR)', n0(shkE.FY28E.sales * shkE.FY28E.opm / 100)],
      ['Profit to shareholders (₹ cr)', '1,956', n0(ownersPat(0)), n0(ownersPat(1)), n0(ownersPat(2)), '~2,870-2,970 (21% CAGR)', n0(shkE.FY28E.pat)],
      ['EPS (₹)', '66.3', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', '~' + n1(moslEps) + ' (₹2,530 ÷ 25x)', n1(shkE.FY28E.eps)],
    ], source: 'Motilal Oswal (25-Jul-2026: FY26-28 EBITDA CAGR 18%, PAT CAGR 21%, TP ₹2,530 at 25x FY28E), Sharekhan (3-Dec-2025, before the Middle East shock), GAM Research. No dated consensus found for Jul-Sep 2026.' } },
    { callout: `Our FY27E EPS (₹${n1(F.eps[0])}) is 14% below FY26 because Q1 fertiliser profit fell 24% and H2 depends on rabi subsidy rates not yet announced. Our FY28E EPS (₹${n1(F.eps[1])}) is ${Math.abs(pctChg(F.eps[1], moslEps))}% below Motilal Oswal's implied ~₹${n1(moslEps)} and ${Math.abs(pctChg(F.eps[1], shkE.FY28E.eps))}% below Sharekhan's pre-crisis ₹${n1(shkE.FY28E.eps)}. The gap is mostly (1) fertiliser margin: we assume 11.0% in FY28E, i.e. back to FY25 levels, not a step-up to the ₹6,500/t target; (2) depreciation (~₹${n0(F.dep[1])} cr) and finance cost (~₹${n0(F.interest[1])} cr), which the Q1FY27 run-rate shows are structurally higher; (3) minorities' share of NACL's profit.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: uniformly positive, on earnings set before the cost shock',
  blocks: [
    { p: `${D.street.split} Bulls argue that crop protection, backward integration and NACL make Coromandel an "agri-solutions" company worth 25-30x earnings, and that subsidy lags are temporary. We agree the lags are temporary in principle (policy envisages compensating input costs over time), but the fertiliser margin has been on a downward trend since FY21, and the street's FY28 earnings still look closer to the pre-crisis numbers than to the Q1FY27 run-rate.` },
    { exhibit: { type: 'table', title: 'Earlier calls (for context)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Note'], wide: [4], rows: D.street.older.map(o => [o.broker, o.rating, o.tp ? n0(o.tp) : '–', o.date, o.method || '–']), source: 'Trendlyne research-report list, Sharekhan note (3-Dec-2025), Business Standard (Dec-2025)' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.argument, c.who]), source: 'Broker notes, earnings calls and IMD data to 30-Sep-2026' } },
  ],
};

const derivation = [
  ['1. The street', 'Motilal Oswal 25x FY28E (Jul-2026); Sharekhan 26x FY28E and Nuvama 30x Q2FY28E (Dec-2025, before the cost shock); DAM Capital n.d.', 'Range 25-30x'],
  ['2. Coromandel\'s own history', `One-year-forward P/E median since Apr-2021: ${n1(fwdMed21)}x (2025-26 points use our depressed FY27-28E EPS; yearly medians ${Object.entries(fwdYear).map(([y, v]) => `${y} ${n1(v)}x`).join(', ')}); trailing P/E five-year median ${n1(CI.pe5)}x`, `Starting point: ${n1(fwdMed21)}x (house window)`],
  ['3. Sector de-rating', `On ${ASOF_TXT} the median of 11 fertiliser and agrochemical peers traded ${Math.abs(r(sectorDerate))}% below its five-year median P/E (Chambal ${r(PEERS.CHAMBLFERT.peVs)}%, Paradeep ${r(PEERS.PARADEEP.peVs)}%, PI ${r(PEERS.PIIND.peVs)}%, Bayer ${r(PEERS.BAYERCROP.peVs)}%, Rallis ${r(PEERS.RALLIS.peVs)}%). Coromandel itself trades ${r(CI.peVs)}% above its own median`, `${n1(fwdMed21)}x × ${(1 + sectorDerate / 100).toFixed(2)} ≈ **${mult}x**`],
  ['4. Growth vs the street', `Our EPS: ₹66.3 (FY26) → ₹${n1(F.eps[2])} (FY29E), ~12% a year, with FY27 a trough; the street's 25-30x come with FY28E EPS of ~₹100-117`, 'No upward adjustment'],
  ['5. Peers', `Trailing P/E on ${ASOF_TXT}: fertiliser peers' median ${n1(fertPe)}x, agrochemical peers' median ${n1(agroPe)}x; weighted by our FY29E EBITDA mix (~78/22) ≈ ${n1(fertPe * 0.78 + agroPe * 0.22)}x trailing`, `${mult}x forward is consistent`],
  ['6. Returns', `ROE ~${r(F.roe[1])}-${r(F.roe[2])}% in FY28-29E vs a 11.9% cost of equity; a fertiliser maker earning a modest spread over its cost of capital`, 'Supports a mid-teens multiple'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${mult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('COROMANDEL', {
      rating,
      streetIntro: 'Brokers value Coromandel on **P/E on FY28E earnings**: Motilal Oswal (25x, after Q1FY27), and before the cost shock Sharekhan (26x) and Nuvama (30x Q2FY28E). We set our target the same way. The differences are in the inputs: our EPS is lower and our multiple is anchored on the stock\'s own history. "At our EPS" applies each broker\'s multiple to our FY28E EPS.',
      street: BR.map(b => [b.broker, b.rating, b.tp, b.method, b.multiple, b.on, `${b.thesis} (${b.date})`]),
      streetSource: 'Broker notes and press reports to 30-Sep-2026 (latest call per broker after Q1FY27); n.d. = method not disclosed',
      ourThesis: 'Subsidy squeeze in FY27; integration benefits from FY28 at FY25-level margins',
      derivationIntro: `The target is a 12-month price, so we apply a one-year-forward multiple to the earnings the market will look at in September 2027: **Sep-28E EPS of ₹${n1(epsSep28)}** (half FY28E, half FY29E).`,
      derivation,
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}; 11 peers' trailing P/E vs five-year medians), broker notes, GAM Research`,
      history: { field: 'eps', from: '2019-04-01', median: Math.round(fwdMed21 * 10) / 10, label: `Median since 2021: ${n1(fwdMed21)}x`, title: `One-year-forward P/E: ${mult}x vs history`, yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA at ${mv('ev').mult}x Sep-28E (the 11.8x five-year median less the peers' ${Math.abs(r(sectorDerateEv))}% EV/EBITDA de-rating) gives ₹${n0(evV)}, and the DCF ₹${n0(dcfV)}: both above our P/E target, because EBITDA-based methods do not charge the step-up in depreciation and both count the growing net cash at full value. Both overstate slightly: the engine divides by 28.62 cr shares (29.50 cr actual) and ignores minorities; on actual shares and after deducting minorities at book value the DCF is ~₹${n0(dcfAdj)}. All three methods sit below the ₹${n0(price)} share price.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} FY28E EPS ₹${n1(X.SC.bull.eps[1])} (≈ the street); 19x Sep-28E EPS.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Nutrient revenue +10% / +8% / +7% at 9.2% / 11.0% / 11.2% EBITDA margin; crop protection +30% / +14% / +12% at 15.5-16.5%; ${mult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} FY28E EPS ₹${n1(X.SC.bear.eps[1])}; 12x Sep-28E EPS (the 2021 level).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { p: `FCFF from FY28E to FY38E: explicit FY28-29E, then revenue growth fading to 8%, EBITDA margin to 11% (the FY22-26 range) and capex to 2.5% of revenue, depreciation at 2.0% of revenue, terminal growth 6%, discounted at the cost of equity of 11.9% (6.5% + 0.9 × 6%). Coromandel is net cash, so the engine's use of the cost of equity as the discount rate is appropriate. Net cash at Mar-27E (₹${n0(nc(0))} cr incl. ICDs) is added.` },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-38E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27E (incl. ICDs)', '{{dcf.netCash|num}}'], ['Equity value (before minorities)', '{{dcf.equity|num}}'], ['Value per share (Mar-27; 28.62 cr model shares)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['On 29.50 cr shares, less minorities at book (₹575 cr)', `₹${n0(dcfAdj)}`], ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers (trailing multiples at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE', 'P/E (x)', '5-yr median P/E (x)', 'vs median', 'EV/EBITDA (x)'], rows: PEER_SYMS.map(s => PEERS[s]).map(p => [p.symbol === 'COROMANDEL' ? '**Coromandel**' : `${pname(p)}${FERT.includes(p.symbol) ? ' (F)' : AGRO.includes(p.symbol) ? ' (CP)' : ''}`, n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.roe + '%', n1(p.pe), n1(p.pe5), `${p.peVs > 0 ? '+' : ''}${r(p.peVs)}%`, n1(p.evEbitda)]), source: `Screener.in: trailing P/E and EV/EBITDA at the NSE close on ${ASOF_TXT}; five-year median of weekly trailing P/E (Oct-2021 to Sep-2026); (F) fertiliser, (CP) crop protection` } },
  ],
};

module.exports = { forecasts, street, valuation };
