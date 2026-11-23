// Apollo Tyres report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./APOLLOTYRE.ctx');
const { C, D, F, A, AS, n0, n1, pc, pc1, rup, b, shortDate, mosl, emkay, idir, ttmOI, ttmExc, OI26, FY26, Q1, BS } = X;
const QC = Q1.consolidated, QS = Q1.standalone, QE = Q1.europe;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: India revenue +16%, EBITDA flat, margin down 150bp; Europe at 8.9%',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue, consolidated', n0(QC.prior.revenue), n0(QC.revenue), yoy(QC.revenue, QC.prior.revenue)],
      ['EBITDA, consolidated', n0(QC.prior.ebitda), n0(QC.ebitda), yoy(QC.ebitda, QC.prior.ebitda)],
      ['EBITDA margin, consolidated', QC.prior.ebitdaMarginPct + '%', QC.ebitdaMarginPct + '%', '−150bp'],
      ['India (standalone) revenue', n0(QS.prior.revenue), n0(QS.revenue), yoy(QS.revenue, QS.prior.revenue)],
      ['India EBITDA margin', QS.prior.ebitdaMarginPct + '%', QS.ebitdaMarginPct + '%', '−160bp'],
      ['Europe revenue (EUR mn, excl. ReifenCom)', QE.priorEurMn, QE.revenueEurMn, yoy(QE.revenueEurMn, QE.priorEurMn)],
      ['Europe EBITDA margin', QE.priorMarginPct + '%', QE.ebitdaMarginPct + '%', '−190bp'],
      ['Other income (company basis)', n0(QC.prior.otherIncome), n0(QC.otherIncome), ''],
      ['Exceptional items (− = charge)', n0(QC.prior.exceptional), '+' + QC.exceptionalGain, 'IL&FS recovery'],
      { hl: true, cells: ['**Net profit, consolidated**', `**${n0(QC.prior.pat)}**`, `**${n0(QC.pat)}**`, 'n.m.'] },
      ['EPS, consolidated (₹)', '0.2', n1(QC.eps), ''],
    ], source: 'Q1FY27 presentation pp.9-10 (7-Aug-2026); Screener.in' } },
    { bullets: Q1.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (Feb to Aug-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome || '–')]), source: 'Q3FY26 call (Feb-2026); Q4FY26 call (May-2026); Q1FY27 call (7-Aug-2026)' } },
    { callout: `**Why it matters:** Q1 profit (₹${n0(QC.pat)} cr) looks like a recovery only because Q1FY26 carried ₹370 cr of Enschede charges. The operating picture is a margin squeeze: EBITDA flat on revenue +13%. Q2 brings ~8% more raw-material inflation against 3-4% of extra price; our FY27E EBITDA margin of {{F.ebitdaMargin.0|pct}} assumes ~12% in Q2 and ~13.5-14.5% in H2 as price increases, OEM pass-through, lower rubber and Enschede savings arrive.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: real cash, but every year since FY24 has carried one-offs',
  blocks: [
    { bullets: [
      `**Cash conversion is strong.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26 against EBITDA of ₹${n0(A.ebitda[b])} cr (${Math.round(A.cfo[b] / A.ebitda[b] * 100)}%), and ₹${n0(A.cfo[b - 2] + A.cfo[b - 1] + A.cfo[b])} cr over FY24-26. FY27E free cash flow turns negative on capex; FY27 also pays ~EUR55 mn of Enschede cash costs provided in FY26.`,
      `**Exceptional items every year.** FY24 ₹77 cr, FY25 ₹169 cr, FY26 ₹1,034 cr (Enschede ₹1,000 cr, labour codes ₹26 cr, VRS ₹7 cr), Q1FY27 a ₹23.5 cr gain. Screener nets them into "other income" (FY26: −₹900 cr), so its EPS history is noisy. We use EPS before one-offs (MOSL basis) for the valuation history and forecast none.`,
      `**A tax write-back flatters FY26.** Moving to the 25% regime wrote back ~₹570 cr of deferred tax in Q4FY26; reported FY26 tax was −5% and EPS ₹21.6 (₹26.7 before one-offs on MOSL's basis).`,
      `**Other income is small but mixed.** FY26 ₹${n1(OI26.total)} cr: interest ₹${n1(OI26.interestDeposits + OI26.interestOther)} cr, FX gains ₹${n1(OI26.fxGain)} cr, asset-sale gains ₹${n1(OI26.assetSaleGain)} cr, other ₹${n1(OI26.misc + OI26.mfGains + OI26.dividends)} cr. We forecast ₹{{F.otherIncome.0|num}} / {{F.otherIncome.1|num}} / {{F.otherIncome.2|num}} cr.`,
      '**Europe\'s other operating income is falling.** Hungary state aid was amortised over ten years; as TBR assets moved to India part of it had to be reversed (−2pp of Europe revenue growth in Q4FY26). Non-cash, but it lowers reported Europe revenue and margin for a few quarters.',
      `**Impairment judgement.** The Enschede impairment used fair value less costs of disposal (Level 3, independent valuer); some plant expected to be redeployed was not impaired. Goodwill ₹${n0(BS.goodwill)} cr at Mar-26.`,
    ] },
    { callout: '**Accounting flag: AMBER.** Clean audit (S.R. Batliboi), strong cash conversion, but recurring "exceptional" items (Europe restructuring in FY21, FY25 and FY26), a large tax write-back and FX gains in other income make reported EPS a poor guide. Investors should use profit before one-offs and watch FY27 cash flow for the closure payments.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Kanwar family's companies own ${OH.categories.promoters}% (Jun-2026): Sunrays Properties and Investment 31.85%, Classic Industries and Exports 2.94% and PTL Enterprises 1.69%; pledges are negligible (0.01%). Emerald Sage Investment, a foreign company, holds 9.93%. Mutual funds own ${OH.categories.mutualFunds}% (HDFC schemes 9.19%, Kotak 4.95%), insurers ${OH.categories.insurance}% (LIC schemes 6.57%), foreign portfolio investors ${OH.categories.fpi}% and the public ${OH.categories.public}%. ${OH.trend}.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: [...C.promoters.map(([h, p]) => [h + ' (promoter)', p + '%']), ...C.largeHolders.map(([h, p]) => [h, p + '%'])], source: 'Shareholding pattern for the quarter ended 30-Jun-2026 (Trendlyne; scheme labels as shown there); Screener.in category totals' } },
  { callout: '**Our read:** a family-controlled company with a minority promoter stake (37%) and a large, concentrated institutional base: four holders (Emerald Sage, HDFC, LIC, Kotak) own ~31%. Foreign portfolio investors have cut their stake by ~8pp since Dec-2023 while Indian funds bought.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: family-run, well audited, but the MD\'s pay is out of line and the CFO has left',
  blocks: [
    { p: rup(`${C.management.chair}; ${C.management.md}; ${C.management.cfo}. Board: ${C.management.board}. Auditor: ${C.management.auditor}.`) },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor + '.', 'No qualifications.'],
      ['Board and control', 'Moderate', 'Family chairman and MD; independent majority, refreshed in 2026 (two new directors).', 'Family control of strategy with a 37% stake.'],
      ['Related-party flows', 'Moderate', rup(D.governance.relatedParty) + '.', 'Not a concern on what we read; the Kalamassery lease is a long-standing promoter-group arrangement.'],
      ['Pay', 'Weak', rup(D.governance.pay) + '.', 'Commission-heavy; doubled in a year when operating profit rose 16%.'],
      ['Capital allocation', 'Moderate', rup(D.governance.capitalAllocation) + '.', 'Deleveraging was well done; the FY17-21 build-out was not, and Europe has destroyed value.'],
      ['Disclosure', 'Strong', 'Quarterly calls and presentations with India and Europe KPIs, raw-material prices and capex guidance.', 'Better than most Indian tyre peers (MRF holds no calls).'],
      ['Management depth', 'Watch', 'CFO and whole-time director Gaurav Kumar resigned (announced 7-Aug-2026) after 22 years, having run the Enschede project; the MD missed the Q1 call.', 'A finance transition during the capex peak.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, related-party note); Q1FY27 call' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, in line with the street',
  blocks: [
    { p: `We forecast each segment's external revenue and EBITDA margin (APMEA, Europe, Others; segment EBITDA includes the other income allocated to segments, which we move below EBITDA), giving a consolidated EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}. Capex is ₹{{F.capex.0|num}} / {{F.capex.1|num}} / {{F.capex.2|num}} cr (guidance ₹3,000-3,500 cr in FY27; ₹5,800 cr AP plan to FY29), depreciation ${AS.depRateOnGrossBlock}% of gross block, interest ₹{{F.interest.0|num}} / {{F.interest.1|num}} / {{F.interest.2|num}} cr as Apollo borrows again, tax ${AS.taxRate[0]}% (India 25%, Europe ~20%), payout ${AS.payout[0]}%. No exceptional items are forecast; the ~EUR55 mn Enschede cash outflow in FY27 is not in our cash flow (an engine limit; ~₹9-10 a share of value). Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (actuals net of exceptional items)', ref: 'fin.otherIncome' }, { name: 'Interest', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates. FY27E EPS growth is against reported FY26 EPS (₹21.6), which carried ₹1,034 cr of exceptional items and a ~₹570 cr tax write-back.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'MOSL', 'Emkay', 'ICICI Direct', 'GAM FY28E', 'MOSL', 'Emkay', 'ICICI Direct'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(mosl.revenue.FY27E), n0(emkay.revenue.FY27E), n0(idir.revenue.FY27E), '{{F.sales.1|num}}', n0(mosl.revenue.FY28E), n0(emkay.revenue.FY28E), n0(idir.revenue.FY28E)],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', mosl.ebitdaMarginPct.FY27E + '%', emkay.ebitdaMarginPct.FY27E + '%', idir.ebitdaMarginPct.FY27E + '%', '{{F.ebitdaMargin.1|pct}}', mosl.ebitdaMarginPct.FY28E + '%', emkay.ebitdaMarginPct.FY28E + '%', idir.ebitdaMarginPct.FY28E + '%'],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(mosl.eps.FY27E)}**`, `**${n1(emkay.eps.FY27E)}**`, `**${n1(idir.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(mosl.eps.FY28E)}**`, `**${n1(emkay.eps.FY28E)}**`, `**${n1(idir.eps.FY28E)}**`] },
      ['Gap (GAM vs broker)', '', pc(gap(F.eps[0], mosl.eps.FY27E)), pc(gap(F.eps[0], emkay.eps.FY27E)), pc(gap(F.eps[0], idir.eps.FY27E)), '', pc(gap(F.eps[1], mosl.eps.FY28E)), pc(gap(F.eps[1], emkay.eps.FY28E)), pc(gap(F.eps[1], idir.eps.FY28E))],
    ], source: 'MOSL (7-Aug-2026), Emkay (9-Aug-2026), ICICI Direct (10-Aug-2026) result notes (PDF). No dated consensus EPS before 30-Sep-2026 was found.' } },
    { callout: `We sit within the street's range: FY27E EPS ₹${n1(F.eps[0])} vs ₹${n1(idir.eps.FY27E)}-${n1(emkay.eps.FY27E)}, FY28E ₹${n1(F.eps[1])} vs ₹${n1(mosl.eps.FY28E)}-${n1(emkay.eps.FY28E)}. Our FY28E margin ({{F.ebitdaMargin.1|pct}}) is below Emkay's ${emkay.ebitdaMarginPct.FY28E}% and MOSL's ${mosl.ebitdaMarginPct.FY28E}% because we assume Europe reaches only 14% and India stops short of the FY24 peak. EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E from EPS before one-offs (₹${C.adjEps.FY26}).` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
