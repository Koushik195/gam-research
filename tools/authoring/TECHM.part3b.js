// Tech Mahindra report, part 3b: other income and FX hedges (why Screener shows negative other income, and
// our build), and earnings quality.
const X = require('./TECHM.ctx');
const { C, F, A, AS, M, n0, n1, pc, SQ, b } = X;
const OI = C.otherIncomeNote, f26 = OI.fy26, f25 = OI.fy25, fxq = OI.fxByQuarterUsd;
// Quarterly: reported other income (Rs cr, ex the Rs272 cr exceptional in Q3FY26), FX (USD mn x average rate), ex-FX
const QQ = [['Q1FY26', 218.8, 85.3], ['Q2FY26', 40.0, 88.2], ['Q3FY26', -20.8, 89.4], ['Q4FY26', -204.7, 92.6], ['Q1FY27', -106.4, 94.6]].map(([q, oi, r]) => ({ q, oi, fx: fxq[q] * r / 10, exFx: oi - fxq[q] * r / 10 }));
const ttm = QQ.slice(1), sum = (a, k) => a.reduce((s, x) => s + x[k], 0);
const trOpen = (A.cash[b] || 0) + (A.investments[b] || 0) - (A.borrowings[b] || 0);
const tre = [trOpen, F.treasury[0], F.treasury[1]].map((t, i) => t * AS.treasuryYield[i] / 100);
const fxF = [-400, -100, -50], misc = [190, 200, 210];
const rs = v => (v < 0 ? `−₹${n0(-v)}` : `₹${n0(v)}`);

const otherIncome = {
  id: 'otherincome', nav: 'Other income & FX', kicker: 'Other income', title: 'Why "other income" turned negative: rupee hedge losses, not a hidden problem, and they are shrinking',
  blocks: [
    { p: `Screener shows other income of −₹240 cr for FY26 and −₹564 cr for the twelve months to Jun-2026. Three things are netted in. (1) **FX losses:** Tech Mahindra sells dollars forward to protect its rupee margins; when the rupee fell from ~85 to ~95 per dollar, the old hedges lost money. Its own accounts put FX losses (incl. mark-to-market on derivatives) at ₹${n0(-f26.fxLoss)} cr in FY26 and ~₹218 cr in Q1FY27 alone. (2) **An exceptional charge:** ₹272 cr for the new Labour Codes (Q3FY26), which Screener adds to other income. (3) **Associates:** −₹1.5 cr. Before FX, other income was a steady ₹${n0(f26.total - f26.fxLoss)} cr in FY26. The same rupee fall that caused the hedge losses lifted revenue and EBIT, so the two partly offset: the hedges did their job.` },
    { exhibit: { type: 'table', title: 'Other income, as reported (₹ crore)', head: ['', 'FY25', 'FY26', 'Note'], wide: [3], rows: [
      ['Interest income', n0(f25.interest), n0(f26.interest), 'FY25 includes interest on a property-sale receivable'],
      ['Gains on mutual funds (FVTPL) + dividends', n0(f25.fvtplGain + f25.dividend), n0(f26.fvtplGain + f26.dividend), 'Treasury income'],
      ['Gain on sale of property and assets', n0(f25.ppeGain), n0(f26.ppeGain), '**FY25 one-off: ₹450 cr land and building sale**'],
      ['Rental and miscellaneous income', n0(f25.rental + f25.misc), n0(f26.rental + f26.misc), 'Incl. fair-value changes of acquisition earn-outs'],
      ['Foreign-exchange loss (incl. derivative MTM)', n0(f25.fxLoss), n0(f26.fxLoss), 'Rupee 84→86 in FY25, 86→95 in FY26'],
      { hl: true, cells: ['**Other income (company)**', `**${n0(f25.total)}**`, `**${n0(f26.total)}**`, ''] },
      ['Associates and exceptional items (Screener nets them in)', '+9', '−274', 'FY26: Labour Code charge ₹272 cr'],
      { hl: true, cells: ['**Other income (Screener)**', `**${n0(A.otherIncome[b - 1])}**`, `**${n0(A.otherIncome[b])}**`, ''] },
    ], source: 'Annual report FY26, consolidated note 29 (₹ mn converted); Screener.in' } },
    { exhibit: { type: 'table', title: 'By quarter: FX is the whole swing (₹ crore)', head: ['', ...QQ.map(x => x.q), 'TTM to Jun-26'], rows: [
      ['Other income (ex exceptional)', ...QQ.map(x => n0(x.oi)), n0(sum(ttm, 'oi'))],
      ['of which FX gain / (loss)', ...QQ.map(x => n0(x.fx)), n0(sum(ttm, 'fx'))],
      { hl: true, cells: ['**Other income before FX**', ...QQ.map(x => `**${n0(x.exFx)}**`), `**${n0(sum(ttm, 'exFx'))}**`] },
      ['Hedge book (USD bn, period end)', '–', '–', '1.05', '0.75', '0.72', 'Mar-25: 1.96'],
    ], source: 'Company presentations (FX in USD mn x the quarter\'s average rate) and calls; GAM Research' } },
    { exhibit: { type: 'table', title: 'Our other-income build (₹ crore)', head: ['', 'FY26A', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Treasury income', n0(f26.interest + f26.fvtplGain + f26.dividend), ...tre.map(n0), `${AS.treasuryYield[0]}% on net treasury after leases (opening ₹${n0(trOpen)} cr); FY26 = 4.2% of average net treasury`],
      ['Miscellaneous and rental', n0(f26.rental + f26.misc + f26.ppeGain), ...misc.map(n0), 'FY26 ₹260 cr incl. ₹8 cr asset gains; FY25 ₹311 cr ex the property gain'],
      ['FX gain / (loss)', n0(f26.fxLoss), ...fxF.map(n0), 'Q1FY27 −₹218 cr actual; hedge book cut to USD 0.72 bn, one-year tenor; we assume ~1.5% rupee depreciation a year'],
      { hl: true, cells: ['**Other income**', `**${n0(f26.total)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**', 'Engine: treasury yield x net treasury + the two lines below it'] },
    ], source: 'GAM Research estimates' } },
    { callout: `**Reconciliation.** FY27E other income of ₹{{F.otherIncome.0|num}} cr compares with ₹${n0(f26.total)} cr in FY26 (company basis) and ${rs(sum(ttm, 'oi'))} cr over the twelve months to Jun-2026 (ex the exceptional). Before FX our FY27E is ₹${n0(tre[0] + misc[0])} cr: equal to Q1FY27 annualised (₹${n0(QQ[4].exFx)} cr x 4) and below FY26 (₹${n0(f26.total - f26.fxLoss)} cr). The whole gap to the TTM is FX: we assume ₹${n0(-fxF[0])} cr of losses in FY27E against ₹${n0(-sum(ttm, 'fx'))} cr in the TTM, because most hedges written before the rupee's fall have matured (book down 63% since Mar-2025, tenor halved). If the rupee falls faster than the ~1.5% a year we assume, FX losses rise again but so does EBIT. The FY25 property gain (₹450 cr) and FY26 Labour Code charge (₹272 cr) are one-offs and are not in our forecasts.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: strong cash conversion, but goodwill, unbilled revenue and a 13-year-old Satyam overhang',
  blocks: [
    { bullets: [
      `**Cash backs profit.** Cash from operations was ${Math.round(A.cfoToPat[b])}% of attributable profit in FY26, ${Math.round(A.cfoToPat[b - 1])}% in FY25 and ${Math.round(A.cfoToPat[b - 2])}% in FY24; company free cash flow was 115% of PAT in FY26 and 108% in Q1FY27. Over FY15-26 operating cash (₹${n0(A.cumulative.cfo)} cr) exceeded profit (₹${n0(A.cumulative.pat)} cr).`,
      '**Unbilled revenue is large.** ₹5,821 cr of the ₹13,358 cr of receivables at Mar-2026 was unbilled (work done, not yet invoiced), typical of fixed-price contracts but a judgement area; DSO 84-95 days is long against Tier-1 peers.',
      '**Goodwill and acquired intangibles** of ₹10,426 cr (35% of net worth) come mostly from acquisitions; impairment testing is a key audit matter. Small impairments (₹27 cr in FY25) and liquidations of failed units show some buys did not work.',
      '**One-offs in history:** a ₹450 cr property-sale gain (FY25) and a ₹272 cr Labour Code charge (FY26). We show our P/E history on both reported EPS and EPS before them.',
      '**Two EPS figures circulate.** Reported basic EPS (FY26 ₹54.28) excludes the 9.42 cr treasury shares held by the TML Benefit Trust; Screener divides by all ~98 cr issued shares (₹49.10). We use the reported basis, as the company and brokers do.',
      '**Contingent liabilities** are material: income-tax disputes ₹985 cr (mostly transfer pricing), a ₹1,275 cr service-tax demand on onsite services (2008-13) before the Supreme Court, and ₹624 cr of other claims not acknowledged.',
      '**Satyam legacy:** ₹1,230 cr of "alleged advances" claimed by 37 companies from the old Satyam sits in a suspense account outside equity and liabilities by court order; the auditor (B S R & Co.) has repeated an emphasis of matter on it every year. Management expects nothing to be payable.',
    ] },
    { callout: '**Accounting flag: AMBER (mild).** Unmodified audit opinion, cash conversion above 100% and transparent disclosure of FX and exceptional items. We stop short of green because of the size of goodwill and unbilled revenue, the earn-out fair-value gains that pass through other income, the long-running Satyam emphasis of matter and ₹2,900 cr of tax and other contingent claims (~10% of net worth).' },
  ],
};

module.exports = { otherIncome, quality };
