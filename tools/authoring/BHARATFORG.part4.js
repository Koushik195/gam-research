// Bharat Forge report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./BHARATFORG.ctx');
const { C, D, F, A, AS, A26, n0, n1, pc, pc1, rup, b, shortDate, withEps, streetEps, dil, adj27, EXC27, taxChk } = X;
const Q = C.q1fy27, QC = Q.consolidated, QS = Q.standalone, G = C.governance;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +19%, a cost-hit margin, a ₹358 cr CDP charge and a loss',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Consolidated revenue', n0(QC.revenuePrior), n0(QC.revenue), yoy(QC.revenue, QC.revenuePrior)],
      ['Consolidated EBITDA (company definition)', n0(QC.ebitdaCoPrior), n0(QC.ebitdaCo), yoy(QC.ebitdaCo, QC.ebitdaCoPrior)],
      ['  margin', '17.4%', `${QC.ebitdaMarginPct}%`, '−120bp'],
      ['Standalone revenue', n0(QS.revenuePrior), n0(QS.revenue), yoy(QS.revenue, QS.revenuePrior)],
      ['Standalone EBITDA margin', `${QS.ebitdaMarginPriorPct}%`, `${QS.ebitdaMarginPct}%`, '−170bp (~160bp from costs)'],
      ['KSSL revenue / EBITDA', '247 / 17', `${n0(Q.subsidiaries.kssl[0])} / ${n0(Q.subsidiaries.kssl[1])}`, '+71% / 4.3x'],
      ['Exceptional items (CDP redundancy, consultancy)', '–', n0(QC.exceptional), ''],
      ['Exchange gain / (loss)', '−9', n0(QC.forex), ''],
      { hl: true, cells: ['**Net profit (reported / before exceptional items)**', `**${n0(QC.patPrior)} / ${n0(QC.adjPatPrior)}**`, `**${n0(QC.pat)} / ${n0(QC.adjPat)}**`, `**${yoy(QC.adjPat, QC.adjPatPrior)} (adjusted)**`] },
    ], source: 'Q1FY27 analyst update (10-Aug-2026); Emkay (adjusted profit, 10-Aug-2026); Screener.in' } },
    { bullets: Q.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (Feb-2026 to Aug-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(x => [shortDate(x.date), x.item, rup(x.said), rup(x.outcome || '–')]), source: 'Bharat Forge calls (12-Feb, 7-May, 10-Aug-2026)' } },
    { callout: '**Track record:** management guides with confidence and the timing often slips: overseas recoveries were promised for years, ATAGS deliveries have moved from FY26 to H2FY27, and the 25% FY27 India growth guide became 20-25% in August. We haircut the guidance rather than reject it: our India manufacturing growth for FY27E is ~20% (low end).' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audits, but recurring "exceptional" charges, no tax shield on losses and weak cash conversion',
  blocks: [
    { bullets: [
      `**"Exceptional" items recur.** ₹12 cr in FY24, ₹157 cr in FY25, ₹154 cr in FY26 and ₹${n0(EXC27)} cr in Q1FY27 (e-mobility write-downs, labour codes, CDP closure). Investors who use "adjusted" EPS should remember the charges are real cash or capital losses. Our FY27E reported EPS (₹${n1(F.eps[0])}) includes the Q1 charge; before it, ₹${n1(adj27)}.`,
      '**Tax.** The group pays 35-37% of reported PBT because overseas and e-mobility losses earn no tax credit (India pays ~25%). We model 36% / 28% / 27%; our check gives ~25.5-26% on profit excluding the loss-making units every year.',
      `**Cash conversion is weak.** Operating cash flow was ₹${n0(A.cfo[b])} cr in FY26 on EBITDA of ₹${n0(A.ebitda[b])} cr (${Math.round(A.cfo[b] / A.ebitda[b] * 100)}%), as receivables rose ₹709 cr. Working capital is ~28% of revenue; inventories ~195 days.`,
      '**Hedge losses in OCI.** USD329 mn and EUR95 mn of forward contracts hedge export sales; a ₹457 cr unrealised hedge loss sat in other comprehensive income at Mar-2026 and flows into revenue as the contracts mature.',
      '**Related-party steel.** Bharat Forge buys special steel from promoter-group Kalyani Steels and Saarloha Advanced Materials (approved limits ₹1,800 cr and ₹3,450 cr a year). Prices are declared at arm\'s length; it is still a large flow to entities the family owns more of.',
      '**Segment disclosure.** Useful management tables (standalone, KSSL, K Drive, castings, Europe, US) but no CDP-only profit figure and no order-book breakdown by programme.',
    ] },
    { callout: '**Accounting flag: AMBER.** Unqualified audit by B S R & Co. (KPMG network), no aggressive capitalisation visible; the amber is for recurring exceptional charges, weak cash conversion and large related-party steel purchases.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Kalyani family owns ${OH.categories.promoters}% (Jun-2026), almost all through investment companies (Kalyani Investment, Sundaram Trading, KSL Holdings, BF Investment, Ajinkya Investment), with nothing pledged. Mutual funds own ${OH.categories.mutualFunds}%, insurers ${OH.categories.insurance}%, the NPS (SBI pension fund) ${OH.categories.pension}%, foreign portfolio investors ${OH.categories.fpi}% and retail ~${OH.categories.retailAndOthers}%; ${n0(OH.shareholders)} shareholders. ${rup(OH.afterQip)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p.toFixed(2) + '%']), source: 'Shareholding pattern filed for 30-Jun-2026 via Trendlyne. No individual foreign holder above 1%.' } },
  { callout: '**Our read:** Indian institutions hold almost a third of the company, much of it in defence-themed funds (HDFC Defence Fund 3.99%, Motilal Oswal defence index fund 1.04%): the stock trades as a defence proxy as much as an auto-component maker. Thematic money flows both ways.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a family-run group with high pay, related-party steel and a mixed capital-allocation record',
  blocks: [
    { p: rup(G.board) },
    { verdicts: [
      ['Audit and accounts', 'Strong', G.auditor + '; segment tables for each unit.', 'No accounting red flags.'],
      ['Board', 'Moderate', 'Half independent; Chairman & MD and Vice-Chairman & Joint MD are promoters; four executive directors.', 'Strategy and capital allocation rest with the family.'],
      ['Pay', 'Weak', `B.N. Kalyani ₹${n1(G.pay.bnKalyaniCr)} cr in FY26 (${G.pay.bnKalyaniRatio}x the median employee); Amit Kalyani ₹${n1(G.pay.amitKalyaniCr)} cr. Together ~4.5% of standalone profit before exceptional items.`, 'High for a ₹1,080 cr consolidated profit.'],
      ['Related parties', 'Watch', rup(G.relatedParty), 'Large flows to promoter-group steel makers.'],
      ['Capital allocation', 'Mixed', 'JS Autocast and K Drive bolt-ons sensible; overseas plants and e-mobility destroyed value; two QIPs in 21 months.', 'Good in India, poor abroad.'],
      ['Promoter pledges', 'Strong', 'Nil pledged (Jun-2026).', 'No forced-selling risk.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, related-party note, remuneration ratios); shareholding pattern Jun-2026' },
  ],
};

const em = withEps.find(s => s.broker.startsWith('Emkay')), mo = withEps.find(s => s.broker.startsWith('Motilal'));
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS roughly doubles by FY28E, but ~10% below the street',
  blocks: [
    { p: 'We forecast each unit separately (revenue growth and EBITDA margin; segment chapters), capex of ₹1,700 / 1,600 / 1,200 cr with depreciation at 6.6% of gross block, interest of ₹330-360 cr, other income of ~₹200 cr a year plus interest on the QIP cash, less the Q1FY27 charge and minority interests, and tax of 36% / 28% / 27%. EPS is on 48.87 cr shares (after the Sep-2026 QIP). Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (after exceptional items)', ref: 'fin.otherIncome' }, { name: 'Interest', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), Emkay (10-Aug-26)', `${n1(adj27)} adj. (${n1(F.eps[0])} rep.)`, n1(em.eps.FY27E), '{{F.eps.1|n1}}', n1(em.eps.FY28E)],
      ['EPS (₹), Motilal Oswal (10-Aug-26, implied)', `${n1(adj27)} adj.`, n1(mo.eps.FY27E), '{{F.eps.1|n1}}', n1(mo.eps.FY28E)],
      ['Street EPS on 48.87 cr post-QIP shares', '', n1(streetEps('FY27E') * dil), '', n1(streetEps('FY28E') * dil)],
      ['Revenue (₹ cr), Emkay', '{{F.sales.0|num}}', n0(em.revenue.FY27E), '{{F.sales.1|num}}', n0(em.revenue.FY28E)],
      ['EBITDA margin, Emkay', '{{F.ebitdaMargin.0|pct}}', em.ebitdaMargin.FY27E + '%', '{{F.ebitdaMargin.1|pct}}', em.ebitdaMargin.FY28E + '%'],
    ], source: 'Emkay result update (PDF, 10-Aug-2026); MOSL EPS implied from its stated 64x FY27E and 44x FY28E P/E at ₹2,093. Brokers\' EPS is on 47.81 cr pre-QIP shares and before exceptional items. A post-results consensus dated before 30-Sep-2026 was not found.' } },
    { callout: `Our FY28E EPS (₹${n1(F.eps[1])}) is ~${Math.round((1 - F.eps[1] / (streetEps('FY28E') * dil)) * 100)}% below the street even after adjusting the street for the QIP dilution. The gap: lower group revenue (we take CDP's ~₹1,600 cr out of Europe), defence margins of 17% rather than 20%+, and a slower US recovery. Our view is that the earnings will roughly double from FY26, but the street is already there.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
