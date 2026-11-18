// GSFC initiation, part 5: forecasts, street view, valuation (SOTP with a derived holding discount).
const X = require('./GSFC.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, AS, SC, n0, n1, pctChg, A26, price, sh, mcap, K, coreEb27, P, VP, pDisc, listedMv, unlistedV, coreV, ncSep27, ltvBase, HH, NOW, derived, conv, fm, peDerate, evDerate, PEERS, PEER_SYMS, FERT, pname, dcfV, peV, dcfAdj, rating, mv, ASOF_TXT, BR, nc, epsSep28, pb, ttmEb } = X;
const r = v => Math.round(v);
const segRow = (k, name, field, hist) => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|num}}`)];
const OI = { div: [106, 130, 130, 130], int: [143, 67, 42, 37], rec: [27, 27, 27, 27], assoc: [11, 11, 11, 11] };
const oiSum = i => OI.div[i] + OI.int[i] + OI.rec[i] + OI.assoc[i];
for (let i = 1; i <= 3; i++) if (oiSum(i) !== AS.otherIncome[i - 1]) console.warn(`GSFC: other-income build ${oiSum(i)} differs from assumptions ${AS.otherIncome[i - 1]} (year ${i})`);

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: flat EPS of ~₹16-17 as chemicals fade and fertilisers recover',
  blocks: [
    { p: `We forecast each segment's revenue and EBITDA margin (segment result plus segment depreciation) and deduct central costs (~₹75-80 cr). Below EBITDA, depreciation rises from ₹202 cr to ~₹${n0(F.dep[2])} cr by FY29E with the new plants; finance cost rises to ₹35-50 cr as working capital and the Sikka project use cash; tax is 24%. Other income is built line by line (below). The model's share count (39.87 cr, from FY26 profit ÷ EPS) is within 0.1% of the actual 39.85 cr, so no adjustment is needed. Every assumption is on the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Fertilizer products' }, segRow('fert', 'Revenue', 'revenue', A26.fertRev), segRow('fert', 'EBITDA', 'adjEbitda', A26.fertEbitda),
      { sec: 'Industrial products' }, segRow('ip', 'Revenue', 'revenue', A26.ipRev), segRow('ip', 'EBITDA', 'adjEbitda', A26.ipEbitda),
      ['Central costs', '−' + n0(A26.centralCosts), '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
    ], source: 'Company (FY26 consolidated segment note), GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26A', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Dividends from holdings', ...OI.div.map(n0), 'GNFC ₹21 × 2.92 cr sh (₹61 cr) + Gujarat Energy ₹8.90 × 4.77 cr sh (₹42 cr) + others at the FY26 level (₹26 cr); flat after FY27'],
      ['Interest (deposits, advances, other)', ...OI.int.map(n0), `~6.5% on average net cash ex-investments (₹1,333 cr Mar-26 → ~₹${n0(nc(0))} cr Mar-27E), lower as the Sikka project uses cash`],
      ['Recurring items (scrap, rent, insurance, write-backs)', ...OI.rec.map(n0), 'Held at FY26'],
      ['Share of associates', ...OI.assoc.map(n0), 'Held at FY26 (Screener counts it in other income)'],
      { hl: true, cells: ['**Total other income**', '**287**', ...[0, 1, 2].map(i => `**{{F.otherIncome.${i}|num}}**`), 'TTM to Q1FY27: ₹277 cr'] },
    ], source: 'AR FY26 note 30; GNFC and Gujarat Energy dividend announcements (May-2026); GAM Research' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Profit before tax', ref: 'fin.pbt' },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1', hl: true }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Operating cash', ref: 'fin.cfo' }, { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { callout: `**No street numbers to compare with.** We found no broker estimate for FY27-29 dated by ${ASOF_TXT} (one aggregator shows a single unnamed analyst expecting FY27 profit to fall ~33%, undated). Our FY27E EPS of ₹${n1(F.eps[0])} is ${Math.abs(pctChg(F.eps[0], 16.88))}% below FY26 (₹16.88): chemicals and volumes add EBITDA, but interest income falls by ~₹76 cr as deposits go into working capital. FY28E (₹${n1(F.eps[1])}) trades a weaker chemical spread for a fertiliser margin recovery; FY29E ₹${n1(F.eps[2])}. EPS stays ~₹16-17, around the FY24-26 level and half the FY23 peak.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: effectively no coverage since 2019',
  blocks: [
    { p: D.street.split },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.argument, c.who]), source: 'Broker notes, company calls and GAM research to 30-Sep-2026' } },
  ],
};

const hr = HH.rows;
const derivation = [
  ['1. The street', 'No current coverage. Emkay (2018-19), the last full series, valued GSFC on a sum of the parts (business plus investments at a discount); IIFL (Apr-2023) ADD ₹140, method not given', 'SOTP is the method; no usable street discount'],
  ['2. GSFC\'s own history', `Discount to look-through value at 21 quarter-ends, Jun-2021 to Jun-2026 (business at ${K}x trailing EBITDA, holdings at market, net cash): median ${n1(HH.medAll)}%, range ${r(Math.min(...hr.map(x => x.disc)))}-${r(Math.max(...hr.map(x => x.disc)))}%`, `Full-period median ${r(HH.medAll)}% (our bear case)`],
  ['3. Leave out abnormal earnings', `In the FY22-23 boom (Jun-22 to Sep-23, trailing EBITDA ₹1,205-1,705 cr, >1.5x the ₹${n0(HH.ebMed)} cr median) the market did not capitalise peak EBITDA: discounts ${r(Math.min(...hr.filter(x => !x.normal && x.ebitda > HH.ebMed).map(x => x.disc)))}-${r(Math.max(...hr.map(x => x.disc)))}%. In the FY25 trough (Jun-Sep 2024, ₹481-513 cr) they were ${r(Math.min(...hr.map(x => x.disc)))}-25%. The ${HH.nNormal} normal quarters: median ${n1(HH.medNormal)}%`, `**Base: ${derived.base}%** (same idea as the house rule that drops trough years from P/E medians)`],
  ['4. Judge against today', `On ${ASOF_TXT}: ${n1(NOW.disc)}% (trailing EBITDA ₹${n0(ttmEb)} cr; net cash interpolated, as in the history). On the actual Jun-26 net debt (~₹500 cr, a seasonal peak) it would be ${n1(NOW.discJunCash)}%`, 'Today is within the normal range; no reason to assume it narrows'],
  ['5. The re-rating since late 2024', `Since Sep-2024 the median has been ${n1(HH.medRecent)}% (PSU re-rating, lower earnings base)`, `Bull: ${derived.bull}%`],
  ['6. The business multiple', `${K}x trailing EBITDA at the target date (Sep-27E). Peers on ${ASOF_TXT}: Chambal ${PEERS.CHAMBLFERT.evEbitda}x, NFL ${PEERS.NFL.evEbitda}x, RCF ${PEERS.RCF.evEbitda}x, Paradeep ${PEERS.PARADEEP.evEbitda}x; fertiliser peers trade a median ${Math.abs(r(evDerate))}% below their five-year EV/EBITDA. GSFC's core pre-tax return on capital is ~8%`, 'Low end of the peer range'],
  ['7. Does the convention matter?', `Re-deriving the discount with the business at 5x / 6x / 7x gives normal-quarter medians of ${conv.map(c => n1(c.d) + '%').join(' / ')} and targets of ₹${conv.map(c => r(c.ps)).join(' / ₹')}`, 'Target is robust to the multiple'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: sum of the parts, less a ${derived.base}% holding discount, gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('GSFC', {
      rating, noOurEps: true,
      streetIntro: 'No broker publishes regular research on GSFC. The last full series (Emkay, 2018-19) valued it as a **sum of the parts**: the operating business on a multiple plus the investments at a discount. That is also how the stock trades: its market value has followed its holdings for five years. We use the same method, with every input dated to 30-Sep-2026.',
      street: BR.map(b => [b.broker, b.rating, b.tp, b.method, b.multiple, b.on, `${b.thesis} (${b.date})`]),
      streetSource: 'Trendlyne research-report list (Emkay, SPA), IIFL via IndiaInfoline (27-Apr-2023); all stale; n.d. = not disclosed',
      ourThesis: 'Business at 6x Sep-27E EBITDA; holdings at 30-Sep prices; 41% holding discount (own history)',
      derivationTitle: `Our holding discount: ${derived.base}%, and why`,
      derivationTableTitle: 'Deriving the holding discount',
      derivationIntro: `The target is a 12-month price. We value the business on trailing EBITDA at the target date (Sep-27E = half FY27E, half FY28E: ₹${n0(coreEb27)} cr), the holdings at their ${ASOF_TXT} prices, and net cash at Sep-27E, then deduct the discount the market has applied to that sum in the past. The discount history uses the same conventions (trailing EBITDA, ${K}x), so the two are consistent.`,
      derivation,
      derivationSource: `NSE bhavcopies (quarter-end closes since Jun-2021), annual reports FY21-26 (holdings, net cash), Screener.in (EBITDA, peers at the ${ASOF_TXT} close), GAM Research`,
      crossNote: `**What the cross-checks tell us.** P/E at ${mv('pe').mult}x Sep-28E EPS of ₹${n1(epsSep28)} (the stock's ${fm.median}x one-year-forward median since Apr-2021, with FY24-25 left out as trough years, less the ${Math.abs(r(peDerate))}% P/E de-rating of fertiliser peers) gives ₹${n0(peV)}: the P/E already carries the market's usual discount, because EPS includes only the dividends from the holdings. The DCF gives ₹${n0(dcfV)}, but only because it adds the investments at their full Mar-26 book (₹4,610 cr) with no discount; the operating business alone is worth ~₹${n0(V.ev)} cr on our cash flows, and with the holdings at our ${derived.base}% discount the DCF would be ~₹${n0(dcfAdj)}. Both cross-checks bracket the SOTP target.`,
    }),
    { exhibit: { type: 'table', title: 'Sum of the parts (₹ crore)', head: ['Part', 'Basis', 'Base', 'Bull', 'Bear', '₹/share (base)'], wide: [1], rows: [
      ...VP.map((p, i) => [p.name, p.metricLabel.replace(/Rs(?=\d)/g, '₹'), `{{dcf.sotp.parts.${i}.value|num}}`, p.adj ? n0(p.adj.bull ?? p.adj.base) : 'model', p.adj ? n0(p.adj.bear ?? p.adj.base) : 'model', n1(P[i].perShare)]),
      { hl: true, cells: ['**Equity value**', '', `**${n0(V.sotp.equity)}**`, '', '', `**${n1(V.sotp.equity / sh)}**`] },
      { hl: true, cells: ['**12-month target (rounded to ₹5)**', '', '**{{dcf.tp|inr}}**', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}', '{{dcf.upside|chg}} vs CMP'] },
    ], source: `GAM Research. Look-through value before the discount ₹${n0(ltvBase)} cr; the business is ${r(coreV / ltvBase * 100)}% of it, the holdings ${r((listedMv + unlistedV) / ltvBase * 100)}%. "model" = varies with the scenario's forecasts` } },
    { exhibit: { type: 'table', title: 'GSFC vs its look-through value at each quarter-end', head: ['Quarter-end', 'Close (₹)', 'Market value', 'Listed holdings', 'Unlisted (book)', 'Net cash', 'Trailing EBITDA', 'Discount', 'Normal?'], rows: hr.map(x => [x.d.slice(0, 7), x.close.toFixed(1), n0(x.mcap), n0(x.listed), n0(x.unlisted), n0(x.nc), n0(x.ebitda), n1(x.disc) + '%', x.normal ? 'yes' : 'no']), source: 'NSE closes; annual reports; Screener.in; net cash interpolated between March balance sheets; ₹ crore' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} FY28E EPS ₹${n1(SC.bull.eps[1])}; discount ${derived.bull}%.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Fertiliser EBITDA margin 5.0% / 6.5% / 7.0%, IP 13.5% / 11% / 11%; business at ${K}x Sep-27E EBITDA; holdings at 30-Sep prices; discount ${derived.base}%.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} FY28E EPS ₹${n1(SC.bear.eps[1])}; discount ${derived.bear}%.`],
    ], source: 'GAM Research. Holdings are held at 30-Sep-2026 prices in every case: a 10% move in the listed holdings moves the target by ~₹' + r(listedMv * 0.1 * (1 - derived.base / 100) / sh) } },
    { h: 'The DCF cross-check in detail' },
    { p: `FCFF of the operating business from FY28E to FY37E: explicit FY28-29E, then revenue growth fading to 6%, EBITDA margin to 7.5% (FY19-26 average 8.6%, inflated by the boom) and capex to 3% of revenue; depreciation 2% of revenue; terminal growth 5%; discounted at the cost of equity of 12.5% (6.5% + 1.0 × 6%). GSFC has net cash, so discounting at the cost of equity is appropriate. The engine then adds the model's net cash at Mar-27E (₹${n0(F.treasury[0])} cr), which includes the ₹4,610 cr investment book at full value.` },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value (operating business)', '{{dcf.ev|num}}'],
      ['Add: net cash incl. investments at book, Mar-27E', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, [`With holdings at 30-Sep prices less the ${derived.base}% discount`, `₹${n0(dcfAdj)}`], ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers (trailing multiples at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE', 'P/E (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA (x)', '5-yr median EV/EBITDA'], rows: PEER_SYMS.map(s => PEERS[s]).map(p => [p.symbol === 'GSFC' ? '**GSFC**' : pname(p), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.roe + '%', n1(p.pe), n1(p.pe5), `${p.peVs > 0 ? '+' : ''}${r(p.peVs)}%`, n1(p.evEbitda), n1(p.ev5)]), source: `Screener.in: trailing P/E and EV/EBITDA at the NSE close on ${ASOF_TXT}; five-year medians of weekly values (Oct-2021 to Sep-2026). Screener's EV/EBITDA for GSFC and GNFC includes other income and ignores their investments, so it flatters both; FACT is excluded (tiny free float, P/E >1,000x)` } },
  ],
};

module.exports = { forecasts, street, valuation };
