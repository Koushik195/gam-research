// TMPV report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./TMPV.ctx');
const { C, D, F, A, AS, n0, n1, pc1, rup, shortDate, withEps, coEbitda } = X;
const Q = C.q1fy27, QC = Q.cons;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: India volumes +46%, JLR EBIT 2.8%, group PBT down 59%',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore unless stated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(QC.revenuePrior), n0(QC.revenue), yoy(QC.revenue, QC.revenuePrior)],
      ['EBITDA (company, incl. grants)', n0(QC.ebitdaCoPrior), n0(QC.ebitdaCo), yoy(QC.ebitdaCo, QC.ebitdaCoPrior)],
      ['EBIT', n0(QC.ebitPrior), n0(QC.ebit), yoy(QC.ebit, QC.ebitPrior)],
      ['PBT before exceptional items', n0(QC.pbtBeiPrior), n0(QC.pbtBei), yoy(QC.pbtBei, QC.pbtBeiPrior)],
      ['JLR revenue (GBP m) / EBIT margin', `${n0(Q.jlr.revenueGbpPrior)} / ${Q.jlr.ebitPctPrior}%`, `${n0(Q.jlr.revenueGbp)} / ${Q.jlr.ebitPct}%`, yoy(Q.jlr.revenueGbp, Q.jlr.revenueGbpPrior)],
      ['JLR free cash flow (GBP m)', '−758', n0(Q.jlr.fcfGbp), ''],
      ['India PV revenue / EBITDA margin', `${n0(Q.pv.revenuePrior)} / ${Q.pv.ebitdaPctPrior}%`, `${n0(Q.pv.revenue)} / ${Q.pv.ebitdaPct}%`, yoy(Q.pv.revenue, Q.pv.revenuePrior)],
      { hl: true, cells: ['**Net profit to owners / EPS (₹)**', '**3,924 / 10.7 (incl. CV)**', `**${n0(QC.patAttrib)} / ${QC.eps}**`, '**not comparable**'] },
      ['Net debt (₹ thousand crore)', '11.4', `${QC.netDebtKcr}`, 'JLR GBP3.6bn'],
    ], source: 'Q1FY27 presentation and call (13-Aug-2026); Screener.in (profit to owners; Q1FY26 includes the CV business as discontinued operations)' } },
    { bullets: Q.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management guided (Jun-2026 to Aug-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'JLR Investor Day (17-Jun-2026), India Investor Day (23-Jun-2026), Q1FY27 call (13-Aug-2026)' } },
    { callout: '**Why it matters:** JLR has to deliver ~4.4% EBIT over the remaining nine months (GBP~0.87bn on ~GBP20bn of revenue) to meet its c.4% guidance, with Q2 carrying more commodity cost and the first EV launch. We assume it falls short (~3.5% for the year). In India the question is margin, not demand: Q2 is guided flat at ~4%, and the step-up depends on PLI certification of new models from Q3.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: complex, with one-offs every year and a big accounting gain in FY26',
  blocks: [
    { bullets: [
      '**FY26 profit is an accounting artefact.** ₹82,390 cr of attributable profit includes an ₹82,616 cr non-cash gain on distributing the CV business to shareholders (no effect on net worth); the continuing business lost ₹1,632 cr. The annual report\'s EPS is −₹0.61; Screener\'s ₹223.74 includes the gain.',
      '**Exceptional items recur.** FY26: ₹4,142 cr (cyber ₹2,786 cr, employee separation ₹1,044 cr, demerger costs ₹422 cr); JLR also ran a voluntary redundancy programme (~500 managers and staff, Q2FY26). We do not forecast exceptional items, so our EPS is "before exceptionals".',
      '**Grants are a large share of EBITDA.** ₹3,603 cr of grant income in FY26 (16% of company EBITDA), of which India PLI ₹1,044 cr; PLI ends after FY28.',
      '**Capitalised engineering.** JLR capitalised 64% of engineering spend in FY26 and 74% in Q1FY27 (₹76,154 cr of intangibles under development at Mar-26). Higher capitalisation flatters EBITDA; amortisation follows when the cars launch.',
      '**Currency and hedges.** JLR\'s EBITDA includes realised hedges; unrealised FX and commodity revaluations swing PBT by GBP100m+ a quarter.',
      '**Deferred tax.** A ₹14,976 cr deferred tax asset (Mar-26) on UK losses produced a tax credit in FY26; future tax will run near 30% once JLR is profitable.',
    ] },
    { callout: '**Accounting flag: AMBER.** Clean audit (B S R & Co.), transparent segment disclosure and reconciliations, but reported profit is hard to use: demerger gain, recurring exceptionals, grant-dependent India margins and high engineering capitalisation.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Tata group (Tata Sons and Tata Industries) owns ${OH.categories.promoters}% (Jun-2026), with no pledge disclosed. Foreign portfolio investors hold ${OH.categories.fii}%, Indian institutions ${OH.categories.dii}% and the public ${OH.categories.public}%: ${n0(OH.shareholders)} shareholders, one of India's largest retail bases (6.7 mn at the peak in Mar-2025). LIC is the largest outside holder (4.76% at Mar-2026).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (latest named list: 31-Mar-2026)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p.toFixed(2) + '%']), source: 'AR FY26 top-10 shareholders as on 31-Mar-2026 (by PAN). The 30-Jun-2026 filing on the company website could not be opened; categories above are from it (via Screener.in).' } },
  { callout: '**Our read:** a Tata Sons-controlled company with a professional management team; the Tata Sons chairman chairs the board. Retail investors are unusually important (23% of shares), which makes the stock sensitive to sentiment; foreign funds have trimmed (17.9% Dec-2025 to 17.1% Jun-2026).' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: Tata-group standards, a new team, and a related-party battery deal to watch',
  blocks: [
    { p: rup(D.governance.board) },
    { verdicts: [
      ['Audit and accounts', 'Moderate', 'B S R & Co. LLP, unqualified; detailed segment and net-debt disclosure.', 'Complex accounts (demerger, exceptionals, grants) but well explained.'],
      ['Board', 'Moderate', 'Chairman from Tata Sons; independents reshuffled after the demerger; JLR CEO on the board.', 'Group oversight is strong; independence is adequate.'],
      ['Promoter', 'Strong', 'Tata Sons 40.1% plus Tata Industries 2.0%; no pledge disclosed; chairman takes no commission.', 'Aligned and patient owner.'],
      ['Management', 'Moderate', 'New MD & CEO (Shailesh Chandra, Oct-2025), new CFO (Nov-2025), JLR CEO P B Balaji (former group CFO).', 'Experienced Tata insiders; JLR team must prove it can launch on time.'],
      ['Related parties', 'Watch', rup(D.governance.relatedParty), 'Battery supply from a Tata Sons company is strategic but must be priced at arm\'s length.'],
      ['Capital allocation', 'Moderate', 'Demerger and Tata Capital deal simplified the group; JLR investment GBP18bn over five years; dividend ₹3 a share.', 'Heavy reinvestment with returns still to be earned.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, AGM notice); company presentations' },
  ],
};

const isec = withEps.find(s => s.broker.startsWith('ICICI'));
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: EPS ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} in FY27-29E, from a near-zero base`,
  blocks: [
    { p: 'We forecast each segment on the company\'s EBITDA definition: JLR revenue in pounds times a rupee rate held at the Q1FY27 level (₹128.4 per pound), India PV as wholesales times revenue per car, and Tata Technologies plus unallocated items as "Others". Grant income is then moved to other income (Screener\'s basis). Depreciation is 6.1% of gross block, capex ₹41-42K cr a year, finance cost ₹3.3-3.5K cr, tax 30%, payout 15-20%. Exceptional items are not forecast. Every driver, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore; FY24 and earlier include CV)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (Screener basis)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (incl. grants)', ref: 'fin.otherIncome' },
      { name: 'Net profit to owners', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. FY26 profit includes the ₹82,616 cr demerger gain.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), ICICI Securities (14-Aug-26)', '{{F.eps.0|n1}}', n1(isec.eps.FY27E), '{{F.eps.1|n1}}', n1(isec.eps.FY28E)],
      ['EPS (₹), Motilal Oswal (23-Jun-26; FY27E raised 12% on 13-Aug)', '{{F.eps.0|n1}}', '15.9 (~17.8)', '{{F.eps.1|n1}}', '30.4'],
      ['Company EBITDA (₹ cr), GAM vs MOSL (Jun-26)', n0(coEbitda[0]), '30,465', n0(coEbitda[1]), '39,054'],
      ['India PV EBITDA (₹ cr), GAM vs MOSL (Jun-26)', n0(X.seg('pv').adjEbitda[0]), '4,606', n0(X.seg('pv').adjEbitda[1]), '5,457'],
      ['JLR EBIT margin, GAM vs Emkay (Jun-26)', '~3.5%', '4.0%', '~5.7%', '5.7%'],
    ], source: 'ICICI Direct Q1FY27 note (PDF); MOSL 23-Jun-2026 note (PDF) and 13-Aug-2026 update via Business Today; Emkay 17-Jun-2026 note. No post-results consensus dated before 30-Sep-2026 was found.' } },
    { callout: `Our FY27E EPS (₹${n1(F.eps[0])}) is close to ICICI Securities (₹${n1(isec.eps.FY27E)}) and above Motilal Oswal; our FY28E (₹${n1(F.eps[1])}) sits between them (₹${n1(isec.eps.FY28E)} / ₹30.4). The disagreement in the street is about JLR's recovery, and it is large: FY28E EPS estimates differ by ~40%. Each 1pp of JLR EBITDA margin in FY28E is ~₹${n0(F.sales[1] * 0.8 * 0.01)} cr of EBITDA, ~₹${n1(F.sales[1] * 0.8 * 0.01 * 0.7 / X.shares)} of EPS.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
