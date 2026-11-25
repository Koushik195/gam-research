// IndiaMART report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./INDIAMART.ctx');
const { C, D, F, A, AS, A26, Q1, Q1y, n0, n1, pc, pc1, b, tre0, OB, oi26, oi26ex, ttmOI, ttmEx, coMargin, coEbitda, ST, seg } = X;
const yoy = (a, p) => pc1((a / p - 1) * 100);
const MQ = X.M.quarterly, qi = MQ.labels.indexOf('Q1FY27'), qy = MQ.labels.indexOf('Q1FY26');

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +11%, margin 35%, profit +12% on treasury gains; paying suppliers down again',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q1y.sales), n0(Q1.sales), yoy(Q1.sales, Q1y.sales)],
      ['  IndiaMART standalone', n0(Q1y.imRev), n0(Q1.standalone.sales), yoy(Q1.standalone.sales, Q1y.imRev)],
      ['  Busy', n1(Q1y.busyRev), n0(Q1.busy.revenue), '+47%'],
      ['EBITDA (company basis, before associates)', n1(Q1y.ebitdaCo), n1(Q1.ebitdaCo), yoy(Q1.ebitdaCo, Q1y.ebitdaCo)],
      ['EBITDA margin (company basis)', `${Q1y.coMargin}%`, `${n1(Q1.ebitdaCo / Q1.sales * 100)}%`, ''],
      ['Share of associates\' losses', n1(Q1y.assoc), n1(Q1.assoc), ''],
      ['Other income (mostly treasury marks)', n1(Q1y.otherIncome), n1(Q1.otherIncome), yoy(Q1.otherIncome, Q1y.otherIncome)],
      { hl: true, cells: ['**Net profit**', `**${n0(MQ.pat[qy])}**`, `**${n0(MQ.pat[qi])}**`, `**${yoy(MQ.pat[qi], MQ.pat[qy])}**`] },
      ['Collections (consolidated)', n0(Q1y.collCons), n0(Q1.collections), yoy(Q1.collections, Q1y.collCons)],
      ['Deferred revenue (consolidated)', '', n0(Q1.deferredRevenue), '+16%'],
      ['Paying suppliers (000s) / ARPU (₹000)', `${Q1y.suppliersK} / ${Q1y.arpuK}`, `${Q1.standalone.payingSuppliersK} / ${Q1.standalone.arpuK}`, `0% / ${yoy(Q1.standalone.arpuK, Q1y.arpuK)}`],
    ], source: 'Q1FY27 investor presentation and webinar (21-Jul-2026); Q4FY26 presentation (Q1FY26 split); MOSL (21-Jul-2026) for associates' } },
    { bullets: C.q1fy27.call.map(s => s.replace(/Rs ?/g, '₹')) },
    { exhibit: { type: 'table', title: 'What management guided and where it stands', head: ['Guidance', 'Where / when', 'Our forecast'], wide: [0, 2], rows: [
      [C.guidance[0][0], C.guidance[0][1], `+{{F.salesGrowth.0|pct}} (IndiaMART +${AS.segments[0].growth[0]}%, Busy +${AS.segments[1].growth[0]}%)`],
      [C.guidance[1][0], C.guidance[1][1], `${n1(coMargin[0])}% company basis (Q1 35.4%)`],
      [C.guidance[2][0], C.guidance[2][1], 'Standalone collections +8% in Q1FY27, in line'],
      [C.guidance[3][0], C.guidance[3][1], 'We assume a flat-to-slightly-rising base'],
      [C.guidance[4][0], C.guidance[4][1], `+${AS.segments[1].growth.join('% / +')}%`],
    ], source: 'CNBC-TV18 via Angel One (4-May-2026); Q4FY26 and Q1FY27 calls' } },
    { callout: '**Read-across:** a clean quarter in profit terms (margin above guidance, other income up) and a weak one in the metric the market watches: paying suppliers fell for a third quarter and buyer enquiries stayed flat. The stock fell ~8% the next day and at least three brokers cut targets.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: cash-backed operating profit, but reported EPS is moved by bond marks and start-up revaluations',
  blocks: [
    { bullets: [
      `**Cash comes first.** Customers pay before revenue is booked: cash from operations was ₹${n0(A.cfo[b])} cr in FY26, ${Math.round(A.cfo[b] / A.ebitda[b] * 100)}% of (Screener) EBITDA and ${Math.round(A.cfo[b] / A.pat[b] * 100)}% of net profit; deferred revenue grew ₹287 cr in the year.`,
      `**Other income is half real return, half noise.** FY26 other income of ₹${n1(oi26)} cr = ₹${n1(OB.rows[0][4])} cr of treasury return (after a bond mark-to-market loss in Q4) + ₹${n1(OB.rows[1][4])} cr of interest + ₹${n1(OB.oneOffs[3])} cr of fair-value gains on start-ups + ₹${n1(OB.rows[4][4])} cr of write-backs. We build FY27E as ${AS.treasuryYield[0]}% on opening net treasury (₹${n0(tre0)} cr, incl. ₹763 cr of stakes) less ₹${-AS.otherIncome[0]} cr for the non-yielding stakes and write-backs = ₹{{F.otherIncome.0|num}} cr, against ₹${n0(oi26ex)} cr in FY26 and ₹${n0(ttmEx)} cr in the twelve months to Jun-26 before start-up gains (₹${n0(ttmOI)} cr reported). Q1FY27 alone gave ₹${n0(Q1.otherIncome)} cr as bond yields eased.`,
      `**Associates' losses sit inside EBITDA on Screener.** ₹${n1(C.fy26.assoc)} cr in FY26; the company reports EBITDA before them (₹530 cr) and Screener after (₹475 cr). Our model follows Screener; we quote both.`,
      `**ESOP cost is real and rising:** ₹${n1(C.fy26.esop)} cr in FY26 (₹18.7 cr in FY25), 2.3% of revenue; management highlights "adjusted EBITDA" before it. We deduct it.`,
      '**Tax:** 26.7% in FY26 vs 22.0% in FY25 (FY25 had lower-taxed capital gains); associates\' losses are not deductible.',
      '**Revenue recognition is conservative:** subscription fees are recognised over the period; ~62% of deferred revenue falls due within a year, the rest is multi-year.',
    ] },
    { callout: '**Accounting flag: GREEN, with a caveat on reported EPS.** Unqualified audit, no debt, cash ahead of revenue. The caveat is presentation: one-third of pre-tax profit is other income, and up to a fifth of EPS in a year has come from revaluing start-up stakes. Judge the company on operating profit plus a normal treasury return, which is what we forecast.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The two co-founders own ${OH.named[0][1]}% (Dinesh Agarwal) and ${OH.named[1][1]}% (Brijesh Agrawal); with family the promoter group holds ${OH.categories.promoters}% (Jun-2026). Foreign investors own ${OH.categories.fii}%, domestic institutions ${OH.categories.dii}% and the public ${OH.categories.public}%. ${OH.trend}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake'], wide: [0], rows: [...OH.named.map(([h, p]) => [h, p + '%']), ['Foreign portfolio investors (Jun-2026)', OH.categories.fii + '%'], ['Domestic institutions (Jun-2026)', OH.categories.dii + '%']], source: 'AR FY26 (promoters, Mar-2026); BSE shareholding pattern for Jun-2026 via Screener (categories). Named institutional holders not retrieved.' } },
  { callout: '**Our read:** founder control (47% between two people who run the company) aligns management with minorities on value, and the founders have not sold. The flip side is that strategy, including the start-up portfolio and the pace of capital returns, is theirs to set. The shift from foreign to domestic and retail holders since 2023 coincides with the de-rating.' },
] });

const GV = D.governance;
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: founder-run, cleanly audited, generous with dividends; the start-up portfolio is the debatable part',
  blocks: [
    { p: `${C.management.ceo}. ${C.management.wtd}. CFO: ${C.management.cfo}. ${GV.board}` },
    { verdicts: [
      ['Audit and accounts', 'Strong', GV.auditor + ' Revenue recognised over subscriptions; fair-value items disclosed.', 'No red flags.'],
      ['Founder alignment', 'Strong', '47% founder ownership; the founders\' share counts were unchanged through FY26 (AR FY26); the promoter percentage drifts down only as ESOP shares are issued.', 'Founders gain or lose with minorities.'],
      ['Pay', 'Moderate', GV.pay, 'High multiples of median pay, but small against profit (~3%).'],
      ['Capital returns', 'Strong', GV.capitalReturn, 'Cash is returned, not hoarded.'],
      ['Start-up portfolio', 'Watch', GV.relatedParty, 'Adds noise to EPS; value unproven.'],
      ['Disclosure', 'Strong', 'Detailed deck: KPIs, legal-entity P&L, functional P&L, cohort churn by tier on calls.', 'Better than most Indian internet peers.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; Q4FY26 and Q1FY27 calls and presentations' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const mo = ST.find(s => s.short === 'MOSL'), ch = ST.find(s => s.short === 'Choice');
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, in line with the street',
  blocks: [
    { p: `We forecast each legal entity, as the company reports it: IndiaMART standalone +${AS.segments[0].growth.join('% / +')}% at a ${AS.segments[0].marginPct[0]}% adjusted margin; Busy +${AS.segments[1].growth.join('% / +')}% at ${AS.segments[1].marginPct.join('% / ')}%; Others revenue only. We then deduct ESOP (₹${AS.esop.join(' / ')} cr) and an unallocated line (₹${AS.unallocated.join(' / ')} cr: associates' losses of ₹${AS.assocShare.join(' / ')} cr plus the other subsidiaries' losses). Revenue grows {{F.salesGrowth.0|pct}} / {{F.salesGrowth.1|pct}} / {{F.salesGrowth.2|pct}}; EBITDA on the company basis is ₹${coEbitda.map(n0).join(' / ')} cr (${coMargin.map(n1).join('% / ')}%), {{F.ebitdaMargin.0|pct}}-{{F.ebitdaMargin.2|pct}} after associates. Other income ${AS.treasuryYield[0]}% then ${AS.treasuryYield[1]}% on opening treasury; tax ${AS.taxRate[0]}%; payout ${AS.payout[0]}%; capex ₹10-12 cr. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (after associates)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (actuals incl. fair-value items)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Cash from operations', ref: 'fin.cfo' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'MOSL FY27E', 'Choice FY27E', 'GAM FY28E', 'MOSL FY28E', 'Choice FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(mo.revenue.FY27E), n0(ch.revenue.FY27E), '{{F.sales.1|num}}', n0(mo.revenue.FY28E), n0(ch.revenue.FY28E)],
      ['EBITDA margin (company basis)', n1(coMargin[0]) + '%', mo.ebitdaMarginPct.FY27E + '%', ch.ebitdaMarginPct.FY27E + '%', n1(coMargin[1]) + '%', mo.ebitdaMarginPct.FY28E + '%', ch.ebitdaMarginPct.FY28E + '%'],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(mo.eps.FY27E)}**`, `**${n1(ch.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(mo.eps.FY28E)}**`, `**${n1(ch.eps.FY28E)}**`] },
      ['Gap (GAM vs broker)', '', pc(gap(F.eps[0], mo.eps.FY27E)), pc(gap(F.eps[0], ch.eps.FY27E)), '', pc(gap(F.eps[1], mo.eps.FY28E)), pc(gap(F.eps[1], ch.eps.FY28E))],
    ], source: 'MOSL (21-Jul-2026) and Choice (22-Jul-2026) result updates; other brokers\' estimates not visible to us.' } },
    { callout: `Our EPS is within ~3% of MOSL and Choice. The differences are small: we have slightly higher revenue (Busy) and a similar margin. EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E from the FY26 base before start-up gains (₹${n1(X.epsClean[2026])}), helped by a normal treasury year after FY26's bond losses; on reported FY26 EPS (₹79) the growth looks faster. The biggest forecast risk is the paying-supplier base, not costs.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
