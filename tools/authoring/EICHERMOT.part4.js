// Eicher Motors report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./EICHERMOT.ctx');
const { C, D, F, A, AS, A26, n0, n1, pc, pc1, rup, b, shortDate, withEps, avgEps, tr, treasIncome26 } = X;
const Q = C.q1fy27, QK = C.quarterlyKpis;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: record volumes, flat margins, and a 40% jump in depreciation',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Royal Enfield volume (financial statements)', n0(QK[0].unitsPL), n0(QK[4].unitsPL), yoy(QK[4].unitsPL, QK[0].unitsPL)],
      ['Revenue from operations', n0(Q.revenuePrior), n0(Q.revenue), yoy(Q.revenue, Q.revenuePrior)],
      ['EBITDA', n0(Q.ebitdaPrior), n0(Q.ebitda), yoy(Q.ebitda, Q.ebitdaPrior)],
      ['EBITDA margin', '23.9%', `${Q.ebitdaMarginPct}%`, '+10bp'],
      ['Gross margin (PL basis)', '44.2%', `${Q.grossMarginPct}%`, '−270bp'],
      ['Depreciation', n0(Q.depPrior), n0(Q.dep), yoy(Q.dep, Q.depPrior)],
      ['Other income (treasury)', n0(Q.otherIncomePrior), n0(Q.otherIncome), yoy(Q.otherIncome, Q.otherIncomePrior)],
      ['Share of VECV profit', n0(Q.jvSharePrior), n1(Q.jvShare), yoy(Q.jvShare, Q.jvSharePrior)],
      { hl: true, cells: ['**Net profit / EPS (₹)**', `**${n0(Q.patPrior)} / 43.95**`, `**${n0(Q.pat)} / ${Q.eps}**`, `**${yoy(Q.pat, Q.patPrior)}**`] },
    ], source: 'Q1FY27 investor presentation and call (29-Jul-2026); PL Q1FY27 note (gross margin); Screener.in (EPS)' } },
    { bullets: Q.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (Feb-2026 to Jul-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'Eicher Motors calls (22-May-2026, 29-Jul-2026)' } },
    { callout: '**Why it matters:** Royal Enfield does not guide on volumes or margins, and it has delivered on what it does say (capacity modules on time, prices raised as promised). The open questions for FY27 are the base effect from Sep-2026 and costs: commodities, a stepped-up marketing budget in the 125th year, Flying Flea stores and higher depreciation. Our FY27E margin ({{F.ebitdaMargin.0|pct}}) assumes Q2-Q4 average ~24.3%, a little below FY26\'s 24.7%.' },
  ],
};

const vecv26 = A26.jvShare, tInc = treasIncome26;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts and strong cash, but a third of profit is not from motorcycles',
  blocks: [
    { bullets: [
      `**Cash backs profit once you strip out non-cash items.** Reported operating cash flow was ${Math.round(A.cfoToPat[b])}% of net profit in FY26 and ${Math.round(A.cfoToPat[b - 1])}% in FY25, because profit includes the VECV share (₹${n0(vecv26)} cr in FY26, of which only ₹218 cr came in as dividends) and treasury income (shown under investing). Against Royal Enfield's own after-tax profit (~₹${n0(A.pat[b] - vecv26 - tInc * 0.8)} cr), cash from operations of ₹${n0(A.cfo[b])} cr is ~${Math.round(A.cfo[b] / (A.pat[b] - vecv26 - tInc * 0.8) * 100)}%.`,
      `**Treasury income is large and partly mark-to-market.** FY26 other income of ₹1,487 cr included ₹746 cr of gains on debt mutual funds, ₹474 cr of interest and ₹140 cr of exchange gains. Fund gains rise when bond yields fall; a rate reversal would cut them. We forecast treasury income at ~6.5% of the true treasury (FY27E ₹${n0(tr[0].income)} cr).`,
      '**VECV is equity-accounted.** Eicher owns 54.4% but shares control with Volvo, so VECV\'s ₹27,077 cr of revenue and its debt-free balance sheet stay off Eicher\'s books; only the profit share appears. That is the correct accounting, but it makes Eicher\'s P/E a blend of a motorcycle company and a truck company.',
      '**Some losses bypass EPS.** The ₹302 cr fall in the value of the Stark Future stake (FY25) went through OCI; the Eicher Polaris JV loss (₹238 cr in FY18-19) was booked as exceptional. FY26 had a ₹55 cr exceptional charge for the new Labour Codes.',
      '**Related-party lending.** Eicher discounts bills for VECV\'s suppliers (₹451 cr at Mar-26, at 8.3-9.2%): a sensible use of cash, but a credit exposure to the JV\'s supply chain that sits inside "treasury".',
      '**Disclosure.** One reportable segment; model-wise volumes are not disclosed (only 350cc vs above in monthly releases); the domestic/international split of motorcycle revenue is not given. Volumes in the financial statements differ from the monthly releases (CKD counting).',
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit by S.R. Batliboi & Co., simple balance sheet, no debt, negative working capital and no aggressive capitalisation visible. The watch items are the size of mark-to-market treasury gains and the VECV-related bill discounting.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Lal family owns ${OH.categories.promoters}% (Jun-2026), almost all through The Simran Siddhartha Tara Benefit Trust (43.83%), with no shares pledged. Foreign portfolio investors own ${OH.categories.fpi}% (down from 27% in Dec-2025), mutual funds ${OH.categories.mutualFunds}%, insurers ${OH.categories.insurance}% and pension funds ${OH.categories.pension}%; ${n0(OH.shareholders)} shareholders in all. Foreign funds cut their holding by ~1.25 points in the June quarter while Indian funds added ~1.2 points.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: 'Shareholding pattern filed with BSE for 30-Jun-2026 (eicher.in). Foreign holders above 1% are not named in the filing.' } },
  { callout: '**Our read:** a family-controlled company with a professional management team and a founder-executive chairman who still drives strategy. The family\'s stake is held through a trust, unpledged and stable for years. Index funds (SBI and UTI Nifty ETFs) and LIC are among the largest outside holders: the stock is a Nifty 50 constituent, so passive flows matter.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: aligned owners and clean books; the cash pile is the main capital-allocation question',
  blocks: [
    { p: rup(D.governance.board) },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor + '; unqualified opinion; one segment, JV equity-accounted.', 'No accounting red flags.'],
      ['Board', 'Moderate', 'Five independent directors out of eight; executive chairman is the promoter.', 'Founder-led: strategy and capital allocation rest with one family.'],
      ['Promoters and pledges', 'Strong', '49.02% via family trusts; nil pledged; minimal ESOP dilution (~0.05% a year).', 'Aligned owners.'],
      ['Professional management', 'Strong', 'MD B. Govindarajan (CEO, Royal Enfield) and CFO Vidhya Srinivasan; VECV run by B. Srinivas since Mar-2026 after Vinod Aggarwal\'s 15 years.', 'Smooth succession at VECV; RE leadership stable.'],
      ['Pay', 'Moderate', `Siddhartha Lal ₹${D.governance.pay.siddharthaLalCr} cr in FY26 (${D.governance.pay.siddharthaLalRatio}x the median employee; incl. ₹8 cr commission), down 34%; MD ₹10.54 cr.`, 'High but falling and linked to profit.'],
      ['Related parties and JVs', 'Watch', rup(D.governance.relatedParty), 'Treasury is used for the group\'s JVs; small but growing.'],
      ['Capital allocation', 'Moderate', rup(D.governance.capitalAllocation), 'Core business excellent; side bets have not paid; payout could be higher.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, remuneration ratios, notes 8-11, 45); Q4FY26 call; shareholding pattern' },
  ],
};

const st = n => withEps.find(s => s.broker.startsWith(n));
const isec = st('ICICI'), pl = st('Prabhudas'), mosl = st('Motilal');
const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: ~12% EPS growth a year to FY29E, close to the street',
  blocks: [
    { p: 'We forecast Royal Enfield as volume × revenue per motorcycle (the build is in the Royal Enfield chapter), EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, capex of ₹1,700-1,800 cr and depreciation at 12.5% of gross block. Other income = treasury income (~6.5% of the true treasury) + Eicher\'s 54.4% of VECV profit (built separately) + ~₹100-120 cr of recurring items. Tax is 25.5% of profit excluding the VECV share (~22.7% of total PBT, because the VECV share is already taxed). Payout 41%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'RE volume (units)', ref: 'kpi.units' }, { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (treasury + VECV share)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), Motilal Oswal (29-Jul-26)', '{{F.eps.0|n1}}', n1(mosl.eps.FY27E), '{{F.eps.1|n1}}', n1(mosl.eps.FY28E)],
      ['EPS (₹), Prabhudas Lilladher (30-Jul-26)', '{{F.eps.0|n1}}', n1(pl.eps.FY27E), '{{F.eps.1|n1}}', n1(pl.eps.FY28E)],
      ['EPS (₹), ICICI Securities (30-Jul-26)', '{{F.eps.0|n1}}', n1(isec.eps.FY27E), '{{F.eps.1|n1}}', n1(isec.eps.FY28E)],
      ['Revenue (₹ cr), MOSL / PL / I-Sec', '{{F.sales.0|num}}', '28,846 / 27,596 / 27,381', '{{F.sales.1|num}}', 'n.d. / 31,628 / 30,717'],
      ['EBITDA margin, MOSL / PL / I-Sec', '{{F.ebitdaMargin.0|pct}}', '24.6% / 24.3% / 24.4%', '{{F.ebitdaMargin.1|pct}}', 'n.d. / 25.5% / 25.2%'],
      ['RE volume (lakh), MOSL / PL / I-Sec (monthly basis)', n1(F.volume[0] / 1e5) + ' (fin. statements)', '14.3 / 14.2 / 14.2', n1(F.volume[1] / 1e5), 'n.d. / 15.9 / 16.0'],
      ['VECV volume, MOSL / PL / I-Sec', n0(X.vb[0].vol), '109,959 / 112,529 / 112,432', n0(X.vb[1].vol), 'n.d. / 118,303 / 119,178'],
    ], source: 'MOSL, PL and ICICI Direct Q1FY27 notes (PDFs). A post-results consensus dated before 30-Sep-2026 was not found.' } },
    { callout: `Our FY27E EPS is ${Math.abs(gap(F.eps[0], avgEps('FY27E')))}% ${F.eps[0] >= avgEps('FY27E') ? 'above' : 'below'} the average of the three brokers and FY28E ${Math.abs(gap(F.eps[1], avgEps('FY28E')))}% ${F.eps[1] >= avgEps('FY28E') ? 'above' : 'below'}: our revenue is in line, but we carry higher depreciation (the capex step-up) and slightly lower margins (marketing, EV costs). Our EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E. Our disagreement with the street is about the multiple, not the earnings.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
