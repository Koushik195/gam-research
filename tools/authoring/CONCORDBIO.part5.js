// Concord Biotech report, part 5: Q1FY27 results and our forecasts vs the street (street view and critiques in part5c).
const X = require('./CONCORDBIO.ctx2');
const { F, A, b, n0, n1, Q1, FY26, epsU, epsRep, LINES, choice, antique, AS, q1Share, q2to4Need, q2to4Prev } = X;
const P5c = require('./CONCORDBIO.part5c');

const q1 = {
  id: 'q1', nav: 'Q1FY27', kicker: 'Latest quarter', title: 'Q1FY27: revenue +26%, EBITDA +34%, PAT +31%; APIs +42% and exports +46%, formulations −23%',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 vs Q1FY26 (₹ crore)', head: ['', 'Q1FY27', 'Q1FY26', 'Change'], rows: [
      ['Revenue', n1(Q1.revenue), '204.0', `+${n1(Q1.revenueYoy)}%`],
      ['  APIs', n1(Q1.api), '153.8', `+${Q1.apiYoy}%`],
      ['  Formulations', n1(Q1.formulations), '50.2', `${Q1.formulationsYoy}%`],
      ['  India', n1(Q1.domestic), '121.0', `+${Q1.domesticYoy}%`],
      ['  Exports', n1(Q1.exports), '83.0', `+${Q1.exportsYoy}%`],
      ['Gross margin', `${Q1.grossMarginPct}%`, '77.9%', '+100 bp'],
      ['EBITDA', n1(Q1.ebitda), '61.4', '+34%'],
      ['EBITDA margin (ex injectables and Stellon)', `${Q1.ebitdaMarginPct}% (${Q1.ebitdaExNewPct}%)`, '30.1%', '+190 bp'],
      { hl: true, cells: ['**PAT**', `**${n1(Q1.pat)}**`, '**44.1**', `**+${Q1.patYoy}%**`] },
      ['Capex / cash and equivalents', `${Q1.capex} / >${Q1.cash}`, '', 'No debt'],
    ], source: 'Q1FY27 investor presentation pp.6-9; Q1FY27 call (3-Aug-2026)' } },
    { bullets: [
      '**Broad-based growth:** every therapy grew double digits; oncology and anti-infectives fastest; Nystatin and fusidic acid called out; new customers onboarded and "advanced discussions with several large customers".',
      '**Price-led share gains:** management said the wallet-share gains were "primarily driven by pricing" on existing products, made possible by Concord\'s scale.',
      `**Currency helped:** the rupee was ~10-12% weaker than a year earlier; net of input costs ~3-5 points flowed to EBITDA (CFO).`,
      '**Formulations fell** because Middle East buyers bought API instead of tablets; ex-Middle East, both Indian divisions grew double digits.',
      `**Utilisation:** Unit I ~${Q1.utilisation.unit1}%, Unit III ~${Q1.utilisation.unit3}%, Unit II ~${Q1.utilisation.unit2}%, injectables ~${Q1.utilisation.injectables}%. CDMO ~1-2% of revenue.`,
      '**Guidance:** FY27 growth "better than our historical growth rates" (~18%); EBITDA to grow faster than sales; ~40% margin "more towards FY28".',
      '**Regulators:** ANVISA (Brazil) inspected Limbasi; Kenya and Uganda inspected Valthera; USFDA approved two ANDAs (mycophenolate mofetil, tofacitinib tablets); Stellon started US sales.',
    ] },
    { callout: `**What it means:** a good recovery quarter from a weak base (Q1FY26 was the low point of FY26), helped by the rupee and price-led volume. Q1 is ${n1(q1Share)}% of our FY27 revenue; Q2-Q4 need ₹${n0(q2to4Need)} cr vs ₹${n0(q2to4Prev)} cr a year earlier (+${Math.round((q2to4Need / q2to4Prev - 1) * 100)}%). ICRA, a week before our as-of date, still expected only 14-15% growth for FY27.` },
  ],
};

const fy27Ct = (1 + 0.145) * A.sales[b];
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs street', kicker: 'Forecasts', title: `Our forecasts: revenue +17% a year, EBITDA margin back to 38%, EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}; below Choice, above ICRA on revenue`,
  blocks: [
    { exhibit: { type: 'table', title: 'GAM forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue', n0(A.sales[b]), '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['  APIs', n1(FY26.api), ...LINES.api.map(n0)],
      ['  Formulations', n1(FY26.formulations), ...LINES.formulations.map(n0)],
      ['Growth', '−12%', '{{F.salesGrowth.0|chg}}', '{{F.salesGrowth.1|chg}}', '{{F.salesGrowth.2|chg}}'],
      ['EBITDA margin', `${n1(A.ebitdaMargin[b])}%`, '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}'],
      ['EBITDA', n0(A.ebitda[b]), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['Other income', n0(A.otherIncome[b]), '{{F.otherIncome.0|num}}', '{{F.otherIncome.1|num}}', '{{F.otherIncome.2|num}}'],
      ['Depreciation', n0(A.dep[b]), '{{F.dep.0|num}}', '{{F.dep.1|num}}', '{{F.dep.2|num}}'],
      { hl: true, cells: ['**Net profit**', `**${n0(A.pat[b])}**`, '**{{F.pat.0|num}}**', '**{{F.pat.1|num}}**', '**{{F.pat.2|num}}**'] },
      ['EPS (₹, pre-bonus)', String(epsRep[2026]), '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}'],
      ['Capex', n0(A.capex[b]), ...AS.capex.map(String)],
      ['ROE', `${n1(A.roe[b])}%`, '{{F.roe.0|pct}}', '{{F.roe.1|pct}}', '{{F.roe.2|pct}}'],
    ], source: 'Screener.in (FY26); GAM estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street and the company (as of 30-Sep-2026)', head: ['Item', 'GAM', 'Others', 'Comment'], wide: [3], rows: [
      ['FY27E revenue growth', '{{F.salesGrowth.0|pct}}', `ICRA 14-15% (~₹${n0(fy27Ct)} cr); management "slightly better" than ~18%; Choice ~15% a year FY26-29E`, 'We sit between ICRA and management'],
      ['FY27E EBITDA margin', '{{F.ebitdaMargin.0|pct}}', 'Choice: +100-150 bp on FY26 (~36%); management: EBITDA growth above sales growth', 'In line with Choice'],
      ['FY28E EBITDA margin', '{{F.ebitdaMargin.1|pct}}', 'Management ~40% "more towards FY28"', 'We stay 2 points below'],
      ['FY28E EPS (₹, pre-bonus)', '{{F.eps.1|n1}}', `Choice ₹${n1(choice.eps.FY28E)} (implied by 40x = ₹1,645, Aug-2026); Antique ₹${n1(antique.eps.FY28E)} (25x = ₹1,520, Jan-2026, before the FY26 miss)`, `We are ${Math.round((1 - epsU[1] / choice.eps.FY28E) * 100)}% below Choice`],
      ['FY27E capex', `₹${AS.capex[0]} cr`, 'Management ₹20-30 cr maintenance + topical block; ICRA ₹120-130 cr', 'Between the two'],
    ], source: 'ICRA (23-Sep-2026); Q4FY26 and Q1FY27 calls; Business Today (Choice 4-Aug-2026, Antique 6-Jan-2026); investmentguruindia (Choice 2-Jun-2026)' } },
    { callout: `**Why we are below Choice on FY28E EPS:** mostly margin. Choice's 40x on ₹${n1(choice.eps.FY28E)} implies ~₹${n0(choice.eps.FY28E * X.SHARES_PRE)} cr of FY28E profit, which needs a margin near management's 40% on similar revenue; we use {{F.ebitdaMargin.1|pct}} because the injectable ramp has slipped before and price is being traded for volume. We also forecast no forex gains (₹16 cr in FY26). Consensus EPS standing on 30-Sep-2026 was not readable without a subscription.` },
  ],
};

module.exports = { q1, forecasts, street: P5c.street };
