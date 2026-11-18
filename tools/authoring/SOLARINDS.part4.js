// Solar Industries report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./SOLARINDS.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, SA, SQ, A26, Q1, b, pl, mosl, ST, shortDate, nciShare, BL, YRS, blSum } = X;
const q0 = SQ.find(q => q.q === 'Q1FY26'), q1 = SQ.find(q => q.q === 'Q1FY27');
const yo = k => pc((q1[k] / q0[k] - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: a blow-out quarter, a quarter of the way to an ambitious FY27 target',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue', n0(q0.total), n0(q1.total), yo('total')],
      ['  Domestic explosives', n0(q0.domestic), n0(q1.domestic), yo('domestic')],
      ['  International', n0(q0.intl), n0(q1.intl), yo('intl')],
      ['  Defence', n0(q0.defence), n0(q1.defence), yo('defence')],
      ['Material cost, % of revenue', '50.8%', `${Q1.materialPct}%`, '−17bp'],
      ['Employee cost, % of revenue', '8.5%', `${Q1.employeePct}%`, '−156bp'],
      ['EBITDA (company basis, incl. other income)', n0(q0.ebitda), n0(q1.ebitda), yo('ebitda')],
      ['EBITDA margin', '26.2%', `${Q1.ebitdaMarginCompanyPct}%`, '+173bp'],
      { hl: true, cells: ['**Net profit (incl. minority)**', `**${n0(q0.pat)}**`, `**${n0(q1.pat)}**`, `**${yo('pat')}**`] },
      ['Memo: Bloomberg consensus profit / revenue', '', `${n0(Q1.consensusPat)} / ${n0(Q1.consensusRevenue)}`, 'Beat by ~26% / ~22%'],
    ], source: 'Q1FY27 fact sheet (13-Aug-2026); consensus via Business Today (13-Aug-2026)' } },
    { bullets: [
      `**Broad-based beat.** All three lines grew 50%+; operating leverage on employee and other costs lifted the margin. Attributable profit was ₹${n0(Q1.patAttrib)} cr (EPS ₹${n1(Q1.eps)}).`,
      `**Against the FY27 targets.** Q1 revenue is ${Math.round(Q1.revenue / 14000 * 100)}% of the ₹14,000 cr target and defence ${Math.round(Q1.defence / 4500 * 100)}% of the ₹4,500 cr target. Defence is usually back-ended (FY26: ₹418 cr in Q1, ₹1,008 cr in Q4), so the defence target needs ~₹1,190 cr a quarter for the rest of the year.`,
      '**No earnings call.** Solar filed only the fact sheet for Q1FY27; the 15-Sep Omnia call excluded questions on current operations. Order book ₹21,350 cr (defence ~₹18,000 cr); ~₹450 cr of the ₹2,050 cr capex spent in Q1 (ICICI Direct).',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-Sep 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome) || '–']), source: 'Q4FY26 call (15-May-2026), AR FY26 (Jul-2026), Omnia call (15-Sep-2026)' } },
    { callout: '**Why it matters:** management has a good recent record (FY26 revenue +30% and a margin above its own guidance), and Q1 suggests FY27 revenue of ₹14,000 cr is within reach; we model ₹{{F.sales.0|num}} cr. The less certain part is FY28-29: the defence order book has stopped growing and FY27 is inflated by input-price pass-through, which reverses if ammonium nitrate falls.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: profits are real, but cash lagged badly in FY26 and the definitions need care',
  blocks: [
    { bullets: [
      `**Cash lagged profit in FY26.** Operating cash flow was ${Math.round(A.cfoToPat[b])}% of net profit in FY26 (₹${n0(A.cfo[b])} cr vs ₹${n0(A.pat[b])} cr), after ${Math.round(A.cfoToPat[b - 1])}% in FY25 and ${Math.round(A.cfoToPat[b - 2])}% in FY24. Over FY15-26 operating cash (₹${n0(A.cumulative.cfo)} cr) slightly exceeded profit (₹${n0(A.cumulative.pat)} cr). The FY26 gap is inventory (₹1,742 cr vs ₹1,040 cr) and receivables (₹1,858 cr vs ₹1,239 cr); management says the inventory build was deliberate.`,
      '**A recurring "below-the-line" loss.** Turkey is accounted for as a hyperinflationary economy; the restatement cost ₹94.5 cr in FY26 and ₹65 cr in FY25 (in other expenses). Other income of ₹128 cr includes a ₹68 cr foreign-exchange gain. Screener moves the Turkish loss out of operating profit, so its EBITDA margin (27.6%) is a little flattering; the company\'s own EBITDA (₹2,750 cr) includes other income.',
      `**Minority interest.** ₹${n0(C.fy26.nci)} cr in FY26 (${n1(nciShare)}% of profit) and ₹${n0(C.fy26.nciFy25)} cr in FY25; EPS uses attributable profit (₹${n0(C.fy26.patAttrib)} cr). Our model carries profit including minorities and divides by Screener's implied share count (${n1(F.shares)} cr), which keeps EPS on an attributable basis.`,
      '**Estimates in revenue.** The auditors\' key audit matters are the "powder factor" provision (₹37 cr: a deduction from sales based on blast output achieved at customer sites, settled later) and the Level-3 fair value of ₹135 cr of unlisted equity and preference-share investments.',
      '**Currency.** A weaker rupee lifted reported profit (export receivables) and added ₹276 cr of translation gains to equity in FY26; the reverse can happen.',
      '**Disclosure gaps.** One reported segment, no EBITDA by line, no split of defence between India and exports, no Q1FY27 call. Investors are asked to trust a defence story they can only see in aggregate.',
    ] },
    { callout: '**Accounting flag: AMBER.** Audits are clean (S R B C & Co jointly with Gandhi Rathi & Co) and profits are cash-backed over time. The flag is for FY26\'s weak cash conversion, a recurring hyperinflation charge outside "EBITDA", and thin disclosure on the defence business that carries the valuation.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Nuwal family owns ${OH.categoriesPct.promoter}% (Jun-2026), unchanged for years, with no shares pledged: Managing Director Manish Nuwal holds 38.93% directly, a family trust (Sohan Devi Nand Lal Nuwal Family Trust) 29.23% and Chairman Satyanarayan Nuwal 3.58% (Mar-2026). The trust received the 29.2% held by Kailashchandra Nuwal and his wife during FY26, after the Supreme Court disposed of his long-running case against the company. Mutual funds and AIFs own ${OH.categoriesPct.mfAif}%, foreign investors ${OH.categoriesPct.fpi}% and the public ${OH.categoriesPct.public}%. Shareholders numbered ~${Math.round(OH.shareholders / 1000)},000 at Jun-2026, double the Dec-2023 count.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', 'Stake', 'Date'], wide: [0], rows: [
    ...C.promoterHoldingMar26.filter(h => h.name !== 'Others').map(h => [h.name + ' (promoter)', h.pct + '%', 'Mar-2026']),
    ...OH.namedMf.map(([n, p]) => [n, p + '%', 'Jun-2026']),
    ...OH.namedFpiMar26.map(([n, p]) => [n, p + '%', 'Mar-2026']),
    ['All foreign portfolio investors', OH.categoriesPct.fpi + '%', 'Jun-2026'],
  ], source: rup(OH.src) } },
  { callout: '**Our read:** a committed founding family with 73% and no pledge, and a free float of only ~27%, most of it in Indian mutual funds (SBI, Kotak, Axis). That makes the stock sensitive to domestic fund flows into defence themes; foreign ownership is low at ~6%.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: founder-run and capable, with high pay and one past related-party episode',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: 'AR FY26 (board report, note 31)' } },
    { verdicts: [
      ['Audit and accounts', 'Good', 'Joint auditors (S R B C & Co, Gandhi Rathi & Co); unqualified FY26 opinion.', 'No red flags.'],
      ['Promoter and pledge', 'Strong', '73.15% held by the Nuwal family, nil pledged.', 'Aligned, long-term owners.'],
      ['Execution record', 'Strong', 'Built international and defence businesses from scratch; FY26 beat its own guidance.', 'Management credibility is an asset.'],
      ['Pay', 'Weak', 'MD ₹50.5 cr (₹30.0 cr in FY25; 780x the median employee), Chairman ₹24.5 cr in FY26; directors\' and KMP pay +54%.', 'About 4.5% of attributable profit to two family executives.'],
      ['Related parties', 'Watch', 'In 2019 a then-Vice Chairman was found to have facilitated an unapproved related-party rent agreement and vacated office; litigation ended Aug-2025.', 'Handled through the board and courts; no repeat seen.'],
      ['Capital allocation', 'Watch', 'High-return organic capex so far; Omnia is a ₹12,951 cr, debt-funded move into agriculture and chemicals.', 'The biggest test of judgement yet.'],
      ['Disclosure', 'Moderate', 'Customer-line revenue each quarter; no segment margins; no Q1FY27 call; defence export split not disclosed.', 'Below what a 60x stock should offer.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

const gapTxt = (g, x) => `${Math.abs(Math.round((g / x - 1) * 100))}%`;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: FY27 at guidance, then ~18% growth; EPS ~27% a year (organic)',
  blocks: [
    { p: 'We forecast revenue by customer line, then a group EBITDA margin (Solar does not report margins by line), depreciation on the gross block, interest, tax at 26.5% and a 6% payout. Omnia is excluded until it closes. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Revenue build by line (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...[['domestic', 'Domestic explosives'], ['intl', 'International (organic)'], ['defence', 'Defence'], ['others', 'Others']].map(([k, n]) => [n, n0(BL.FY26[k]), ...YRS.map(y => n0(BL[y][k]))]),
      { hl: true, cells: ['**Total revenue**', `**${n0(blSum('FY26'))}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      ['Defence share of revenue', `${Math.round(X.share(A26, 'defence'))}%`, ...YRS.map(y => `${Math.round(X.defShare(y))}%`)],
    ], source: 'Q4FY26 fact sheet; GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Net profit (incl. minority)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of debt)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years; forecasts show net cash (negative = net debt).' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E', 'GAM FY29E', 'Street FY29E'], rows: [
      [`EPS (₹), PL (${shortDate(pl.date)}, excl. Omnia)`, '{{F.eps.0|num}}', n0(pl.eps.FY27E), '{{F.eps.1|num}}', n0(pl.eps.FY28E), '{{F.eps.2|num}}', n0(pl.eps.FY29E)],
      [`EPS (₹), MOFSL (${shortDate(mosl.date)}, Omnia from FY28)`, '{{F.eps.0|num}}', n0(mosl.eps.FY27E), '{{F.eps.1|num}}', `${n0(mosl.eps.FY28E)}*`, '{{F.eps.2|num}}', `${n0(mosl.eps.FY29E)}*`],
      ['EPS (₹), Nuvama (14-Aug-26, derived)', '{{F.eps.0|num}}', '~290', '{{F.eps.1|num}}', '~383', '{{F.eps.2|num}}', 'n.a.'],
      ['Revenue (₹ cr), PL', '{{F.sales.0|num}}', n0(pl.sales.FY27E), '{{F.sales.1|num}}', n0(pl.sales.FY28E), '{{F.sales.2|num}}', n0(pl.sales.FY29E)],
      ['EBITDA margin, PL (excludes the ~1pp of costs Screener moves below EBITDA)', '{{F.ebitdaMargin.0|pct}}', `${n1(pl.ebitda.FY27E / pl.sales.FY27E * 100)}%`, '{{F.ebitdaMargin.1|pct}}', `${n1(pl.ebitda.FY28E / pl.sales.FY28E * 100)}%`, '{{F.ebitdaMargin.2|pct}}', `${n1(pl.ebitda.FY29E / pl.sales.FY29E * 100)}%`],
    ], source: 'PL and MOFSL initiation PDFs (Sep-2026); Nuvama via Business Today (EPS derived by GAM from its stated P/E). * includes Omnia, not comparable.' } },
    { callout: `We are ${gapTxt(F.eps[0], pl.eps.FY27E)} from PL for FY27, ${gapTxt(F.eps[1], pl.eps.FY28E)} below for FY28 and ${gapTxt(F.eps[2], pl.eps.FY29E)} below for FY29. The gap is revenue: we follow management's FY28 indication (~₹16,500 cr) and assume no unannounced defence platform orders, while PL has ₹${n0(pl.sales.FY28E)} cr for FY28. Our EPS still compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
