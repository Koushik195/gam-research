// Chambal initiation, part 6: forecasts vs the street, street view, valuation.
const X = require('./CHAMBLFERT.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, A, AS, SC, n0, n1, pc, b, A26, FY, price, mult, evMult, epsSep28, ebitdaSep28, pe28, peSep28, dcfV, evV, rating, FM, fwdYear, fwdMin, fwdMax, fwdAdjMed, PEERS, PEER_SYMS, OTHERS, UREA, sectorDerate, sectorDerateEv, fertPe, ureaPe, CF, BR, br, jvBook, trueNc, epsCagr, ASOF_TXT, mv, segF, pname } = X;
const r = v => Math.round(v);
const segRow = (k, name, field, hist) => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|num}}`)];
const ty = AS.treasuryYield[0] / 100, open = [A.cashAndInvestments[b] - A.borrowings[b], F.treasury[0], F.treasury[1]];
const tInc = open.map(o => Math.max(o, 0) * ty), jv = [65, 130, 145], rec = 15, jvY = jvBook * ty;
const bvps28 = F.netWorth[1] / F.shares, roe = (F.roe[1] + F.roe[2]) / 2, jPb = (roe - 5) / (V.ke - 5), jPe = jPb * bvps28 / F.eps[1];
const E = n => br(n).eps, Eb = n => br(n).ebitda;
const fmtE = (o, y) => (o[y] != null ? n1(o[y]) : '–');

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS slips for two years as the Gadepan-III reset bites',
  blocks: [
    { p: `We forecast each segment's revenue and EBITDA margin (segment PBIT plus its D&A) and deduct ~₹70 cr of unallocated items. Urea is built from volume, realisation and EBITDA per tonne (see the Urea chapter); TAN starts from a notional ₹1 cr base because the engine needs one. Depreciation rises to ~₹${n0(F.dep[0])} cr in FY27E as the TAN plant is capitalised (we use 4.75% of gross block because the engine holds capital work-in-progress flat). Finance cost is ₹${n0(F.interest[0])} cr in FY27E (working-capital loans against subsidy receivables), then ₹15 cr. Tax 26% / 25% / 25%; payout 25%. The model's share count (40.05 cr, FY26 profit ÷ EPS) matches the actual 40.07 cr, and minorities are negligible, so EPS needs no adjustment. Every assumption is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Urea' }, segRow('urea', 'Revenue', 'revenue', A26.ureaRev), segRow('urea', 'EBITDA', 'adjEbitda', A26.ureaEbitda),
      { sec: 'Complex fertilisers' }, segRow('cf', 'Revenue', 'revenue', A26.cfRev), segRow('cf', 'EBITDA', 'adjEbitda', A26.cfEbitda),
      { sec: 'CPC, speciality nutrients & seeds' }, segRow('cpc', 'Revenue', 'revenue', A26.cpcRev), segRow('cpc', 'EBITDA', 'adjEbitda', A26.cpcEbitda),
      { sec: 'TAN' }, ['Revenue', '–', '{{F.seg.tan.revenue.0|num}}', '{{F.seg.tan.revenue.1|num}}', '{{F.seg.tan.revenue.2|num}}'], ['EBITDA', '–', '{{F.seg.tan.adjEbitda.0|num}}', '{{F.seg.tan.adjEbitda.1|num}}', '{{F.seg.tan.adjEbitda.2|num}}'],
      ['Unallocated items', '−63', '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
      { hl: true, cells: ['**Group EBITDA (Screener basis)**', '**2,694**', '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'Company (FY26 segment note), GAM Research estimates; FY26 unallocated = segment EBITDA ₹2,757 cr less Screener EBITDA ₹2,694 cr' } },
    { exhibit: { type: 'table', title: 'Other income, built rather than plugged (₹ crore)', head: ['', 'FY26A', 'TTM Jun-26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury income (FY27-29E: 6.5% on opening net treasury)', '69', 'n.a.', ...tInc.map(n0)],
      ['IMACID share of profit', '129', '68', ...jv.map(n0)],
      ['Recurring non-treasury items (interest, rent, scrap, misc.)', '11', 'n.a.', ...[0, 1, 2].map(() => n0(rec))],
      ['One-offs (insurance claims, derivative gains, tax-refund interest)', '46', 'n.a.', '–', '–', '–'],
      ['Less: yield on IMACID book value inside the engine\'s treasury', '–', '–', ...[0, 1, 2].map(() => '−' + n0(jvY))],
      { hl: true, cells: ['**Total (Screener basis)**', '**240**', '**178**', '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
    ], source: 'Annual Report FY26 note 18 (FY26 items), quarterly results (TTM: company other income ₹110 cr + IMACID ₹68 cr); GAM Research. Screener\'s FY26 other income (₹240 cr) differs from company other income plus IMACID (₹256 cr) by ~₹16 cr of items it counts in EBITDA' } },
    { p: `FY27E other income (~₹${n0(F.otherIncome[0])} cr) is well below FY26 because net cash fell from ~₹965 cr to roughly nil as subsidy receivables rose, IMACID lost money in Q1, and we leave out one-offs. The engine credits interest only on the opening balance, so it gives no FY27 credit for the ~₹1,500 cr of free cash flow we expect during the year (~₹40-50 cr, ~₹1 of EPS): a deliberate conservative bias in FY27 only.` },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income (incl. IMACID)', ref: 'fin.otherIncome' }, { name: 'Profit before tax', ref: 'fin.pbt' },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1', hl: true }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (history gross; forecasts net of debt, incl. IMACID at book)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['EPS (₹)', 'FY27E', 'FY28E', 'FY29E', 'FY28E EBITDA (₹ cr)', 'Date'], rows: [
      { hl: true, cells: ['**GAM Research**', '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', '**{{F.eps.2|n1}}**', '**{{F.ebitda.1|num}}**', '30-Sep-26'] },
      ...['Elara Securities', 'IIFL Capital', 'SKP Securities', 'Systematix', 'JRK Group'].map(n => [n, fmtE(E(n), 'FY27E'), fmtE(E(n), 'FY28E'), fmtE(E(n), 'FY29E'), n0(Eb(n).FY28E), br(n).date]),
      ['Consensus implied by IIFL\'s "vs consensus"', n1(D.street.consensus.impliedEps.FY27E), n1(D.street.consensus.impliedEps.FY28E), n1(D.street.consensus.impliedEps.FY29E), '–', '31-Jul-26'],
    ], source: 'Broker notes as dated (Valorem Advisors research page, JRK website); GAM Research' } },
    { callout: `Our FY28E EPS of ₹${n1(F.eps[1])} is close to IIFL (₹42.9), below Elara (₹49.5) and SKP (₹46.8), and far below Systematix and JRK, whose published estimates show no reset. The gaps: (1) **Gadepan-III**: we cut ₹3,000/t, Systematix and JRK nothing; (2) **TAN**: we assume ~₹9,500/t of EBITDA vs Elara's ~₹15,000/t; (3) **other income**: we start from nil net cash and exclude one-offs; Elara has ₹213 cr of FY28E company other income on top of IMACID. Our EPS falls ~1% a year from FY26 to FY29E (${n1(epsCagr)}%).` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: all targets above the price, but the honest notes already model the reset',
  blocks: [
    { p: `${D.street.split} The bull case is that urea is a safe annuity, the TAN plant and CPC add growth, a fourth plant could lift capacity by ~40% by 2030, and the stock is cheap at 9-10x earnings with a dividend. The bear case is the Gadepan-III reset and a cash pile about to be committed to a lower-return plant. The brokers who model the reset (Elara, IIFL, SKP) cut FY28 earnings below FY26 and still say Buy because the multiple is low; we agree it is low, but it has always been low.` },
    { exhibit: { type: 'table', title: 'Earlier calls (for context)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Basis'], wide: [4], rows: D.street.older.map(o => [o.broker, o.rating, o.tp ? n0(o.tp) : '–', o.date, o.method || '–']), source: 'Broker notes (Valorem Advisors research page; Elara sector preview via ET)' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.argument, c.who]), source: 'Broker notes and earnings calls to 30-Sep-2026' } },
  ],
};

const derivation = [
  ['1. The street', `P/E: IIFL 14x Jun-28E, Elara 11x Jun-28E, JRK 9.5x FY28E. EV/EBITDA: SKP 8x, Systematix 5.6x FY28E`, 'P/E range 9.5-14x'],
  ['2. Chambal\'s own history', `One-year-forward P/E median since Apr-2021: ${n1(FM.median)}x; no trough years (FY23's ₹24.9 EPS was above half the FY21 peak); yearly medians ${Object.entries(fwdYear).map(([y, v]) => `${y} ${n1(v)}x`).join(', ')}; range ${n1(fwdMin)}-${n1(fwdMax)}x. On EPS before Screener's exceptional tags: ${n1(fwdAdjMed)}x. Trailing P/E five-year median ${n1(CF.pe5)}x`, `Starting point: ${n1(FM.median)}x (house rule, reported EPS)`],
  ['3. Sector de-rating', `On ${ASOF_TXT} the median of seven listed fertiliser peers traded ${Math.abs(r(sectorDerate))}% below its five-year median P/E (${OTHERS.map(s => `${pname(s)} ${pc(PEERS[s].peVs)}`).join(', ')}). Chambal itself trades ${Math.abs(r(CF.peVs))}% below its own`, `${n1(FM.median)}x × ${(1 + sectorDerate / 100).toFixed(2)} ≈ **${mult}x**`],
  ['4. Growth vs the street', `Our EPS: ₹48.8 (FY26) → ₹${n1(F.eps[2])} (FY29E), ${n1(epsCagr)}% a year; the street's 9.5-14x come with FY28E EPS of ₹42.9-61.8`, 'No upward adjustment'],
  ['5. Peers', `Trailing P/E on ${ASOF_TXT}: seven fertiliser peers' median ${n1(fertPe)}x (lifted by Coromandel's and Deepak's non-urea stories); urea-heavy RCF, NFL, GSFC and GNFC ~${n1(ureaPe)}x`, `${mult}x forward is in line with urea peers`],
  ['6. Returns', `ROE ~${r(roe)}% in FY28-29E vs ${n1(V.ke)}% cost of equity; with 5% growth that justifies ~${jPb.toFixed(1)}x FY28E book, i.e. ~${n1(jPe)}x FY28E EPS`, 'Supports a high-single-digit multiple'],
];

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${mult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('CHAMBLFERT', {
      rating,
      streetIntro: 'Three of the five brokers covering Chambal value it on **P/E on FY28 or June-2028 earnings** (IIFL, Elara, JRK); SKP and Systematix use EV/EBITDA on FY28E. We follow the majority. "At our EPS" applies each P/E broker\'s multiple to our EPS for the same period.',
      street: BR.map(x => [x.broker, x.rating, x.tp, x.method, x.multiple, x.on, `${x.thesis} (${x.date})`]),
      streetSource: 'Broker notes to 30-Sep-2026 (latest call per broker); JRK predates Q1FY27',
      ourThesis: 'Gadepan-III reset in FY28; TAN and CPC offset about half',
      derivationIntro: `The target is a 12-month price, so we apply a one-year-forward multiple to the earnings the market will look at in September 2027: **Sep-28E EPS of ₹${n1(epsSep28)}** (half FY28E, half FY29E).`,
      derivation,
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}; peers' trailing P/E vs five-year medians), broker notes, GAM Research`,
      history: { field: 'eps', from: '2019-04-01', median: FM.median, label: `Median since 2021: ${n1(FM.median)}x`, title: `One-year-forward P/E: ${mult}x vs history`, yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA at ${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr (the ${n1(CF.ev5)}x five-year median less the peers' ${Math.abs(r(sectorDerateEv))}% de-rating) gives ₹${n0(evV)}, and the DCF ₹${n0(dcfV)}. Both are well above the P/E value, for three reasons: EBITDA ignores the TAN plant's depreciation; both count the cash we expect Chambal to accumulate (net treasury ~₹${n0(F.treasury[1])} cr by Mar-28E, incl. IMACID at book) at full value; and the DCF assumes 5% growth for ever. The market has never paid that: Chambal's forward P/E has stayed at ${n1(fwdMin)}-${n1(fwdMax)}x since 2021. The gap says the stock is not expensive; it does not tell us the market will close it, especially if the cash goes into a ₹10,000 cr plant.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} FY28E EPS ₹${n1(SC.bull.eps[1])}; 11x Sep-28E EPS (the five-year median trailing P/E).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Gadepan-III EBITDA −₹3,000/t from Dec-2026; urea EBITDA ${segF('urea').map(v => v.toFixed(1)).join('% / ')}%; traded ${segF('cf').join('% / ')}%; CPC +15-18% at 22.5-23%; TAN ₹720 cr revenue in FY28E; ${mult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} FY28E EPS ₹${n1(SC.bear.eps[1])}; 7x Sep-28E EPS (the Apr-2023 to Mar-2024 forward level).`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { p: `FCFF from FY28E to FY37E: explicit FY28-29E, then revenue growth fading to 5.5%, EBITDA margin to 10.5% and capex to 2% of revenue, depreciation at 1.9% of revenue, terminal growth 5%, discounted at the cost of equity of ${n1(V.ke)}% (6.5% + 0.9 × 6%). Chambal has no long-term debt, so the engine's use of the cost of equity is appropriate. Net treasury at Mar-27E (₹${n0(F.treasury[0])} cr) is added; it includes IMACID at its ₹${n0(jvBook)} cr book value (~₹${n0(jvBook / F.shares)} a share), a conservative value for a stake earning ₹130-150 cr a year.` },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-37E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net treasury at Mar-27E (incl. IMACID at book)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed fertiliser peers (trailing multiples at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE', 'P/E (x)', '5-yr median P/E (x)', 'vs median', 'EV/EBITDA (x)'], rows: PEER_SYMS.map(s => PEERS[s]).map(p => [p.symbol === 'CHAMBLFERT' ? '**Chambal**' : `${pname(p.symbol)}${UREA.includes(p.symbol) ? ' (U)' : ''}`, n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.roe + '%', n1(p.pe), n1(p.pe5), pc(p.peVs), n1(p.evEbitda)]), source: `Screener.in: trailing P/E and EV/EBITDA at the NSE close on ${ASOF_TXT}; five-year median of weekly trailing P/E (Oct-2021 to Sep-2026); (U) urea-heavy; FACT excluded (P/E not meaningful)` } },
  ],
};

module.exports = { forecasts, street, valuation };
