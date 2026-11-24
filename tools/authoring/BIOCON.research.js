// Biocon report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// biosimilars, generics, Syngene and Bicara, moat, Q1FY27 and guidance, earnings quality, ownership, management and
// governance, forecasts, street, valuation, risks and verdict, glossary, statement notes). Shared inputs in BIOCON.ctx.js and
// BIOCON.ctx2.js; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./BIOCON.ctx2');
const { F, V, A, SC, n0, n1, pc, price, SOTP, MBS, MGEN, HBS, LOOK, EVM, rating, mv, ST, withTp, medTp, dcfLessMi, SEGH, rev, ebs, corp, ndOwn, ND26, lev, YRS, SG, peNowSep, kev, SECTOR_EV, AUD, SYN_MV } = X;
const P2 = require('./BIOCON.part2'), P3 = require('./BIOCON.part3'), P3b = require('./BIOCON.part3b'), P4 = require('./BIOCON.part4'), P4b = require('./BIOCON.part4b'), P5 = require('./BIOCON.part5'), P5b = require('./BIOCON.part5b'), P6 = require('./BIOCON.part6');
const S0 = SOTP.base, part = k => S0.parts.find(p => p.key === k);

const cover = {
  headline: 'The heavy lifting is done; now five launches have to earn back the dilution',
  lead: `Biocon is India's biosimilars champion: copies of insulins and cancer and immunology antibodies sold in 120 countries, 61% of FY26 revenue, plus a small generics arm and 52.4% of the listed research firm Syngene. In FY26 it bought out every minority partner in Biocon Biologics and retired its structured debt, so from 29-Jun-2026 it owns 100% of its main business and pays ~₹300 cr a year less interest; the price was 43 cr new shares (+36%). The street values Biocon on a **sum of the parts**. Ours: biosimilars at **${MBS.base}x Sep-28E EBITDA** (Biocon's own look-through forward multiple since FY24, ${n1(HBS.med)}x, × the +${SECTOR_EV}% pharma factor), generics at ${MGEN.base}x (Aurobindo's history × the same factor), Syngene and Bicara at market less 20%, less ₹${n0(-part('nd').value)} cr of net debt: **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Bull {{scen.bull.tp|inr}}, bear {{scen.bear.tp|inr}}. Our EPS (₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E) is below the street, and both cross-checks sit below the target: this is a call on biosimilar value, not on near-term earnings.`,
  arguments: [
    { h: 'A real biosimilars franchise entering its launch year', p: `Biosimilars EBITDA before other income rose from ₹${n0(SEGH.FY25.biosimilars)} cr in FY25 to ₹${n0(SEGH.FY26.biosimilars)} cr in FY26 (24.7% margin). FY27 brings five growth products in the US and Europe: aflibercept (Yesafili, US launch Aug-2026, interchangeable), denosumab (US launch Apr-2026), insulin aspart (moving to commercial US channels), ustekinumab and bevacizumab, plus a second insulin line in Malaysia. Old products hold up: US pegfilgrastim and trastuzumab still have 23-25% shares years after launch. We forecast biosimilars EBITDA of ₹${n0(ebs.biosimilars[1])} cr in FY28E.` },
    { h: 'The structure is finally simple, and the debt is falling', p: `No more minorities in BBL, no more structured instruments, one board. Interest fell 23% YoY to ₹213 cr in Q1FY27. On our numbers net debt falls from ₹${n0(ND26)} cr (Mar-26, ${n1(lev[0])}x EBITDA) to ₹${n0(ndOwn[1])} cr by Mar-28 (${n1(lev[2])}x), because capex is past its peak and free cash goes to debt. The cost: shares went from 120 cr to 163 cr in a year, so FY28E EPS of ₹${n1(F.eps[1])} is still below FY24's reported ₹8.5.` },
    { h: 'But the rest of the group is a drag, and the second half has to deliver', p: `Q1FY27 biosimilars grew 16% in rupees but only ~5% in constant currency; generics made 1.5% EBITDA margin in FY26 (before other income) despite new plants; Syngene's revenue fell 16% after a big client cut orders. Management has promised a stronger second half before. Our FY27E EBITDA of ₹${n0(F.ebitda[0])} cr needs ~₹970 cr a quarter in Q2-Q4 vs ₹847 cr in Q1. We are ${Math.round((1 - F.eps[1] / 8.4) * 100)}% below MOSL on FY28E EPS (₹${n1(F.eps[1])} vs ₹8.4).` },
    { h: 'Valuation: the SOTP says cheap, the cross-checks say fair', p: `At ₹${n0(price)} the market pays ~${n1(LOOK.at(-1).mult)}x forward EBITDA for the biosimilars business on our look-through, below its ${n1(HBS.med)}x median since FY24 and below the street's 20-22x. Our SOTP gives {{dcf.tp|inr}}. On P/E the stock is expensive (${n1(peNowSep)}x Sep-28E EPS), and consolidated EV/EBITDA (₹${n0(mv('ev').value)}) and the DCF (₹${n0(mv('dcf').value)}, ₹${n0(dcfLessMi)} after Syngene's minorities) sit near the price. The upside needs the biosimilar multiple to hold while EBITDA grows ~15% a year.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Balance sheet', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first test of the promised second-half acceleration (the first weeks of aflibercept, the Malaysia line, generics margins, Syngene).',
    'US payer contracts for calendar 2027 (negotiated July-September each year): formulary positions for aspart, ustekinumab, denosumab and aflibercept.',
    'FDA classification of the April-2026 pre-licence inspection at Biocon Park (five procedural observations) and the pending biosimilar pertuzumab filing.',
    'BBL\'s $800 mn 6.67% notes become callable from October 2026: a refinancing at a lower rate would cut interest further; rating upgrades in FY26 help.',
    'Mylan (Viatris) owns 5.6% of Biocon and its six-month lock-up ended in July 2026: a possible block sale is an overhang.',
    'Syngene\'s recovery (FY27 a "transition year", growth from FY28) and any move to monetise the Bicara stake (~₹985 cr at 30-Sep).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const FYS = ['FY24', 'FY25', 'FY26'], ALL = [...FYS, ...YRS];
const segRevAll = k => [...FYS.map(y => Math.round(SEGH[y].ext[k])), ...rev[k].map(Math.round)];
const segEbAll = k => [...FYS.map(y => Math.round(SEGH[y][k])), ...ebs[k].map(Math.round)];
const QS = SG.quarterly || [];
const look = LOOK.filter((_, i) => i % 2 === 0 || i === LOOK.length - 1);
const ndPath = [['Mar-23', 13550], ['Mar-24', 13018], ['Mar-25', 13115], ['Mar-26', ND26], ...YRS.map((y, i) => [`Mar-${27 + i}E`, ndOwn[i]])];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Biosimilars are 61% of revenue and carry the growth', unit: 'External revenue by segment (₹ crore); FY27-29E GAM', x: ALL, series: [{ name: 'Biosimilars', values: segRevAll('biosimilars'), fmt: 'num' }, { name: 'Generics', values: segRevAll('generics'), fmt: 'num' }, { name: 'Research services (Syngene)', values: segRevAll('services'), fmt: 'num' }], minLabel: 2500, source: 'AR FY25/FY26 note 40; GAM estimates' },
      { type: 'stacked', title: 'Biosimilars make ~75% of segment EBITDA; generics barely break even', unit: 'Segment EBITDA before other income (₹ crore); FY27-29E GAM', x: ALL, series: [{ name: 'Biosimilars', values: segEbAll('biosimilars'), fmt: 'num' }, { name: 'Generics', values: segEbAll('generics'), fmt: 'num' }, { name: 'Syngene', values: segEbAll('services'), fmt: 'num' }], minLabel: 300, source: 'AR FY25/FY26 note 40 (total revenue less segment costs); GAM estimates. FY25 generics include one-time US lenalidomide' },
    ] },
    { pair: [
      { type: 'column', title: 'Biosimilars revenue per quarter: +16% YoY in Q1FY27, much of it the rupee', unit: 'Biosimilars segment revenue (₹ crore per quarter)', x: QS.map(q => q.q), series: [{ name: 'Biosimilars', values: QS.map(q => q.biosimRev), fmt: 'num' }], labels: 'all', source: 'Company presentations and press releases' },
      { type: 'line', title: 'Biosimilars margin 21% to 25-28% (company basis); generics 0-9%', unit: 'Segment EBITDA incl. other income, % of segment revenue', x: QS.map(q => q.q), series: [{ name: 'Biosimilars', values: QS.map(q => Math.round(q.biosimEbitda / q.biosimRev * 1000) / 10), fmt: 'pct' }, { name: 'Generics', values: QS.map(q => Math.round(q.genEbitda / q.genRev * 1000) / 10), fmt: 'pct' }], labels: 'last', min: -5, max: 35, source: 'Company presentations and press releases (Q4FY25 generics incl. one-time lenalidomide)' },
    ] },
    { pair: [
      { type: 'column', title: 'Net debt: ₹13,550 cr after the Viatris deal, ~₹5,300 cr by Mar-29E', unit: 'Net debt (₹ crore), Screener basis; FY27-29E GAM path', x: ndPath.map(x => x[0]), series: [{ name: 'Net debt', values: ndPath.map(x => Math.round(x[1])), fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates (incl. the working capital the engine misses)' },
      { type: 'column', title: `EPS: ₹8.5 in FY24-25 (with one-offs), ₹2.4 in FY26, ₹${n1(F.eps[2])} in FY29E`, unit: 'EPS (₹; FY26 on 162.97 cr shares)', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in (attributable); GAM estimates FY27-29E (no exceptional items)' },
    ] },
    { pair: [
      { type: 'line', title: `What the market pays for biosimilars: ${n1(HBS.min)}-${n1(HBS.max)}x forward EBITDA since FY24`, unit: 'Look-through EV ÷ next full-year biosimilars EBITDA (x)', x: look.map(r => r.d), series: [{ name: 'Biosimilars, look-through', values: look.map(r => Math.round(r.mult * 10) / 10), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, min: 10, lines: [{ v: Math.round(HBS.med * 10) / 10, text: `Median ${n1(HBS.med)}x` }, { v: MBS.base, text: `Our multiple: ${MBS.base}x`, color: '#cf8f1f' }], source: 'GAM Research from Screener.in prices (Biocon, Syngene), balance sheets and segment data; see the valuation chapter' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (latest notes found by 30-Sep-2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...withTp.map(s => s.broker.replace(' (retail)', '')), 'GAM (base)'], series: [{ name: 'Target', values: [...withTp.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Broker notes Nov-2025 to Sep-2026 (median ₹${n0(medTp)}); GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.biosimilars, P3.plants, P3b.generics, P3b.syngene, P4.moat, p.financials, P4.guidance, p.capital, P4b.quality, p.balance, P4b.ownership(p.ownershipBase), P4b.governance, P5.forecasts, P5.street, P5b.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
