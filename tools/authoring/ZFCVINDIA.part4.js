// ZF CV India report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./ZFCVINDIA.ctx');
const { C, D, F, A, AS, A26, T, OI26, RP, n0, n1, pc, pc1, rup, b, shortDate, tr, ttmOI, tre0, yld26, arn } = X;
const Q = C.q1fy27;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +9%, margin 12.9% on metal costs; profit −15% only because of last year\'s FX gain',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q.revenuePrior), n0(Q.revenue), yoy(Q.revenue, Q.revenuePrior)],
      ['EBITDA (excl. other income)', n0(Q.ebitdaPrior), n0(Q.ebitda), yoy(Q.ebitda, Q.ebitdaPrior)],
      ['EBITDA margin', `${Q.ebitdaMarginPriorPct}%`, `${Q.ebitdaMarginPct}%`, '−50bp'],
      ['Other income (incl. FX)', n0(Q.otherIncomePrior), n0(Q.otherIncome), yoy(Q.otherIncome, Q.otherIncomePrior)],
      ['Profit before tax', '164', n1(Q.pbt), yoy(Q.pbt, 164)],
      ['PBT excl. FX and one-offs', '120', n1(Q.pbtExFxOneOffs), `+${Q.pbtExFxOneOffsGrowthPct}%`],
      { hl: true, cells: ['**Net profit**', `**${n1(Q.patPrior)}**`, `**${n1(Q.pat)}**`, `**${yoy(Q.pat, Q.patPrior)}**`] },
      ['EPS (₹, post-bonus)', n1(Q.epsPrior), n1(Q.eps), ''],
      ['Domestic OEM / aftermarket / exports', `${n0(464)} / 137 / 245`, `~${Q.oemDerived} / ${Q.aftermarket} / ${Q.exportsGoods}`, `+${Q.oemGrowthPct}% / +${Q.aftermarketGrowthPct}% / +${Q.exportsGrowthPct}%`],
    ], source: 'Screener.in (as reported, 24-Jul-2026); Q1FY27 call (28-Jul-2026); Q4FY26 presentation (Q1FY26 lines). Q1FY26 PBT excl. FX and one-offs = ₹164 cr less ₹43.7 cr.' } },
    { bullets: Q.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (May to Sep-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'Q4FY26 call (15-May-2026); Q1FY27 call (28-Jul-2026)' } },
    { callout: '**Why it matters:** management does not give numbers and its May outlook was cautious; Q1 revenue beat it, but the margin did not. The questions for the rest of FY27 are whether OEMs pay for the aluminium and energy inflation ("over the next quarter"), how strong the festive and post-monsoon truck season is against a record Q4FY26 base, and whether US truck production keeps recovering. Our FY27E EBITDA margin of {{F.ebitdaMargin.0|pct}} assumes ~15.7% for Q2-Q4.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit and real cash, but FX gains and group pricing blur the picture',
  blocks: [
    { bullets: [
      `**Cash conversion is lumpy, not weak.** Cash from operations was ${Math.round(A.cfoToPat[b - 2])}% of net profit in FY24, ${Math.round(A.cfoToPat[b - 1])}% in FY25 and ${Math.round(A.cfoToPat[b])}% in FY26 (₹${n0(A.cfo[b])} cr): receivables from ZF CV Systems Global rose to ₹437 cr at Mar-25 and fell to ₹192 cr at Mar-26. Over FY22-26 cash from operations was ~94% of cumulative net profit.`,
      `**FX gains inflate some years.** FY26 other income of ₹${n0(OI26.total)} cr included ₹${n0(OI26.fxGain)} cr of FX gains (₹39 cr in Q1FY26 alone, on services billed in euros at an old rate) and a ₹${n0(OI26.eclReversal)} cr reversal of credit-loss provisions. We forecast neither; that is why our FY27E EPS (₹{{F.eps.0|n1}}) is slightly below FY26's ₹45.4.`,
      `**Treasury income is a fifth of profit.** Interest and fund gains were ₹${n0(OI26.treasuryIncome)} cr in FY26 (${n1(yld26)}% on the average net treasury). We build FY27E other income as 6% of the opening ₹${n0(tre0)} cr plus ₹4 cr of other items: ₹{{F.otherIncome.0|num}} cr, against ₹${n0(ttmOI)} cr in the twelve months to Jun-26.`,
      `**Transfer pricing with the parent.** ₹${n0(RP.zfGlobalTotal)} cr of FY26 transactions (sales, services, purchases) were with one group company at cost-plus mark-ups, plus royalty of ₹${n0(RP.royalty)} cr (+12%) and IT charges of ₹${n0(RP.itFromZfAg)} cr (+31%). These are approved by minority shareholders but set within the group.`,
      '**One-offs are small.** The only exceptional item in five years is the ₹7.9 cr labour-code charge (Q3FY26). Screener\'s "profit excluding exceptional items" differs from reported profit by 1-3% a year; we value on reported EPS and show the adjusted series as a sensitivity.',
      '**Contingent liabilities** are ₹64 cr, mostly a new ₹57 cr GST claim the company contests.',
    ] },
    { callout: '**Accounting flag: GREEN-AMBER (we show AMBER).** Unmodified audit by B S R & Co. (KPMG), no debt, few one-offs. The amber is for the share of revenue and receivables with the parent at prices the parent helps set, and for FX gains that flatter some years; neither is improper, but both make reported margins a weaker guide than at a stand-alone supplier.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `WABCO Asia Pvt Ltd, Singapore, a ZF Friedrichshafen company, owns ${OH.categories.promoters.toFixed(2)}% (Jun-2026); nothing is pledged. It sold 15 percentage points between Jun-2024 and Jun-2025 (75% to 60%). Indian mutual funds took most of it: they owned ${OH.categories.mutualFunds}% at Jun-2026 (domestic institutions ${OH.categories.dii}% in all, insurers ${OH.categories.insurance}%); foreign portfolio investors held ${OH.categories.fpi}% and the public ${OH.categories.public}%. Shareholders rose to ${n0(OH.shareholders)} after the bonus. The stock is in the Nifty Smallcap 250 and Nifty 500, so index funds are part of the institutional holding.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Promoter stake over time', head: ['Quarter', 'WABCO Asia (ZF)'], rows: OH.promoterPath.map(([q, v]) => [q, v.toFixed(2) + '%']), source: 'BSE shareholding patterns (Screener.in); AR FY26 secretarial audit (6-Jun-2025 sale of 600,133 shares). Named non-promoter holders for Jun-2026 were not available to us.' } },
  { callout: '**Our read:** this is a subsidiary, not an owner-run company. ZF controls the board, the technology, the export and services pricing and the cash. It has also shown it is willing to sell: another sale down towards the 51% control threshold is possible, and would weigh on the stock for weeks around it. Minority shareholders have related-party votes and four independent directors, not control.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: professional and well audited; the issues are related-party pricing and idle cash',
  blocks: [
    { p: rup(`Board: ${C.management.board}. ${C.management.md}. CFO: ${C.management.cfo}. Auditor: ${C.management.auditor}.`) },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor + '.', 'No accounting red flags.'],
      ['Board', 'Moderate', D.governance.board + '.', 'Independent at the legal minimum; the parent sets strategy.'],
      ['Related-party flows', 'Watch', rup(D.governance.relatedParty), 'A third of revenue and most of the export margin are set within the group.'],
      ['Capital allocation', 'Weak', rup(D.governance.capitalAllocation), 'Cash earns ~6% pre-tax inside a business with ~20% ROCE; minorities get a 0.2% yield.'],
      ['Management continuity', 'Moderate', 'New MD from Jul-2025; CFO changed in Sep-2026; company secretary changed in Mar-2026.', 'Turnover at the top in a year of cost pressure.'],
      ['Pay', 'Strong', `${C.management.pay}.`, 'Moderate for the company\'s size.'],
      ['Promoter and pledges', 'Moderate', '60.00% held by WABCO Asia (ZF); no pledges; 15% sold in 2024-25.', 'A long-term owner, but also a seller.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (directors\' report, AOC-2, note 35.2, secretarial audit, remuneration annexure); Q1FY27 call; shareholding patterns' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, below the last visible street numbers',
  blocks: [
    { p: 'We forecast revenue from the business-line build (domestic OEM, aftermarket, exports of goods, services), a company-wide EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, capex of ₹185-215 cr and depreciation at 8.5% of gross block. Other income is built: 6.0% on opening net treasury plus ₹4 cr; no FX gains. Tax 25.5%; payout 10%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates. EPS after the 5:1 bonus.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (latest visible estimates)', head: ['', 'GAM FY27E', 'Anand Rathi FY27E', 'GAM FY28E', 'Anand Rathi FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(arn.revenue.FY27E), '{{F.sales.1|num}}', n0(arn.revenue.FY28E)],
      { hl: true, cells: ['**EPS (₹, post-bonus)**', '**{{F.eps.0|n1}}**', `**${n1(arn.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(arn.eps.FY28E)}**`] },
      ['Gap (GAM vs Anand Rathi)', pc(gap(F.eps[0], arn.eps.FY27E)), '', pc(gap(F.eps[1], arn.eps.FY28E)), ''],
    ], source: 'Anand Rathi company update (13-Feb-2026; pre-bonus EPS ₹318.7 / ₹375.5 ÷ 6). The post-Q1 ICICI Securities and ICICI Direct estimates were not visible to us; no dated consensus before 30-Sep-2026 was found.' } },
    { callout: `Our revenue is close to Anand Rathi's for FY27E and ~5% lower for FY28E, but our EPS is ${Math.abs(gap(F.eps[0], arn.eps.FY27E))}% / ${Math.abs(gap(F.eps[1], arn.eps.FY28E))}% lower: its February estimates predate the metal-cost squeeze (Q1FY27 margin 12.9%), and we forecast no FX gains. EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E (FY21-26: ~${Math.round(X.epsCagrHist)}% from a Covid trough), almost all of it in FY28-29E when truck ESC arrives.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
