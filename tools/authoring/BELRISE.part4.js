// Belrise Industries report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./BELRISE.ctx');
const { C, D, F, A, M, n0, n1, n2, pc, pc1, b, lines, streetEps28 } = X;
const Q = C.q1fy27, G = C.guidance;
const q = M.quarterly, qi = q.labels.indexOf('Q1FY27'), qp = q.labels.indexOf('Q1FY26'), q4 = q.labels.indexOf('Q4FY26');
const yoy = k => pc1((q[k][qi] / q[k][qp] - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: manufacturing +20%, trading −19%; margin down 90bp on steel, wages and new-plant costs',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'Change YoY'], rows: [
      ['Manufacturing revenue', n0(Q.q1fy26.manufacturing), n0(C.q4fy26.manufacturing), n0(Q.manufacturing), pc1(Q.mfgGrowth)],
      ['Trading of goods', n0(Q.q1fy26.trading), n0(C.q4fy26.trading), n0(Q.trading), pc1(Q.tradingGrowth)],
      ['Revenue', n0(q.sales[qp]), n0(q.sales[q4]), n0(q.sales[qi]), yoy('sales')],
      ['EBITDA', n0(q.ebitda[qp]), n0(q.ebitda[q4]), n0(q.ebitda[qi]), yoy('ebitda')],
      ['Manufacturing EBITDA margin', `${n1(Q.q1fy26.mfgEbitda / Q.q1fy26.manufacturing * 100)}%`, `${n1(C.q4fy26.mfgEbitda / C.q4fy26.manufacturing * 100)}%`, `${n1(Q.mfgMargin)}%`, `${Math.round((Q.mfgMargin - Q.q1fy26.mfgEbitda / Q.q1fy26.manufacturing * 100) * 100)}bp`],
      ['Employee cost', n0(Q.q1fy26.employeeCost), '–', n0(Q.employeeCost), pc1(Q.employeeGrowth)],
      ['Finance cost', n0(q.interest[qp]), n0(q.interest[q4]), n0(q.interest[qi]), yoy('interest')],
      { hl: true, cells: ['**Net profit**', `**${n0(q.pat[qp])}**`, `**${n0(q.pat[q4])}**`, `**${n0(q.pat[qi])}**`, `**${yoy('pat')}**`] },
    ], source: 'Q1FY27 deck p7, p11 (14-Aug-2026); Q4FY26 deck; Screener.in' } },
    { bullets: [
      `**Revenue +${Q.revenueGrowth}%:** manufacturing +${Q.mfgGrowth}% (2W/3W +18%, cars +22%, trucks +16%, others +69%), trading −19% on the Middle East disruption.`,
      `**Margin ${Q.margin}% (−90bp):** gross margin rose 60bp (less trading), but staff costs jumped ${Math.round(Q.employeeGrowth)}% (annual increments, minimum-wage rise, hiring ahead of four new plants) and other expenses +32%. Manufacturing margin ${Q.mfgMargin}% vs 13.8% a year earlier.`,
      `**Profit +${Q.patGrowth}%** helped by finance cost falling 42% (debt repaid from the IPO); other income fell to ₹${n0(Q.otherIncome)} cr from ₹29 cr.`,
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-2026 to Aug-2026)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['Revenue', G.revenue], ['Margin', G.margin], ['Capex', G.capex], ['Cars and trucks', G.fourWheelerCv], ['Aerospace', G.aerospace], ['QIP money', G.qip], ['Orders', G.orders],
    ], source: 'Q4FY26 call (25-May-2026); Q1FY27 deck and call (14/17-Aug-2026)' } },
    { callout: '**Why it matters:** "stable margins vs FY26" means 12.1% for the group; with Q1 at 11.5% the rest of the year needs ~12.3%. We assume {{F.ebitdaMargin.0|pct}} for FY27E (manufacturing {{as.lineBuild.mfgMargin.0|pct}}): a slightly weaker year than guided, because new plants and staff costs come before the new orders.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: acceptable, but acquisitions, a promoter merger and a trading arm make the numbers hard to read',
  blocks: [
    { bullets: [
      '**Comparability.** FY25 includes H-One only from 28-Mar-2025 (consolidated from FY26); Chester Hall and SDM join in Q4FY26; Hyva from Q3FY27; and the BAPL/EITSPL merger, once approved, will restate the numbers. Like-for-like growth is not disclosed.',
      `**Other income.** ₹${n0(C.otherIncomeFY26.total)} cr in FY26: interest ₹${n0(C.otherIncomeFY26.interest)} cr (IPO money before debt repayment), "miscellaneous" ₹${n0(C.otherIncomeFY26.misc)} cr (not explained in the notes) and FX gains ₹${n0(C.otherIncomeFY26.fx)} cr. Other income was 16% of FY26 pre-tax profit. Q1FY27 ₹18 cr.`,
      `**Cash conversion is fine.** Operating cash ₹${n0(A.cfo[b])} cr in FY26 against EBITDA of ₹${n0(A.ebitda[b])} cr (${Math.round(A.cfo[b] / A.ebitda[b] * 100)}%); receivables ~67 days.`,
      '**Exceptional items** are small (₹5 cr in FY26 for the new labour codes).',
      `**Related parties.** Material purchases from promoter-linked companies (AR FY26); MD pay ₹${C.remuneration.mdCr} cr. Auditor: ${C.auditors}.`,
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing we read suggests aggressive accounting, but four acquisitions in eighteen months, a related-party merger, unexplained "miscellaneous" other income and a low-margin trading line mean reported growth and margins need adjusting before they mean much.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Badve family owned ${OH.categories.promoters}% at Jun-2026: founder and MD Shrikant Badve ${OH.named[0][1]}%, Supriya Badve ${OH.named[1][1]}%, Sumedh Badve ${OH.named[2][1]}% and others ${OH.named[3][1]}%. Promoters held 73.0% after the IPO and sold ~6.5% of the company in the Dec-2025 quarter; the Jul-2026 QIP diluted them further to ~61% (the merger would add back ~2 points). Foreign funds owned ${OH.categories.fii}% and Indian institutions ${OH.categories.dii}% at Jun-2026, up from 6.8% and 7.1% a year earlier; ${n0(OH.categories.shareholders)} shareholders.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: OH.named.map(([h, p, nt]) => [h, p + '%', nt]), source: OH.src + '. Named institutional holders above 1% were not available to us.' } },
  { callout: '**Our read:** control is firmly with the family. In twelve months they have sold shares, diluted to raise ₹1,700 cr, and agreed to merge their private companies into Belrise for new shares; each is defensible, but minority holders should watch the terms of every related-party step.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: founder-led and ambitious; pay and related-party dealings need watching',
  blocks: [
    { p: `Board: ${D.governance.board} Management: ${C.management.map(m => `${m[0]} (${m[1]})`).join('; ')}. Pay: ${D.governance.pay}` },
    { verdicts: [
      ['Audit and accounts', 'Moderate', 'Mid-size auditor (GSA & Associates) in its second term; joint auditor proposed; no qualification seen', 'Adequate; a larger joint auditor would help as the group grows abroad.'],
      ['Board', 'Moderate', 'Majority independent (deck); founder MD and his wife executive directors', 'Typical family company.'],
      ['Related parties', 'Weak', 'Material purchases from promoter companies; merger of two promoter companies for 4.72 cr shares', 'The merger reduces the flows but is itself a related-party deal.'],
      ['Management pay', 'Weak', D.governance.pay, 'High for a ₹9,500 cr revenue company.'],
      ['Capital allocation', 'Moderate', 'IPO used to repay debt (good); QIP of ₹1,700 cr raised before a use was identified; acquisitions so far small and cheap', 'The QIP deployment is the test.'],
      ['Disclosure', 'Moderate', 'Manufacturing vs trading split and segment revenue given; acquisition numbers and facility utilisation not', 'Better than many mid-caps, short of what we would like.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (remuneration annexure, auditors, investments note); decks and calls; scheme filing' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n2}} / ₹{{F.eps.1|n2}} / ₹{{F.eps.2|n2}} on 96.7 cr shares, before the merger',
  blocks: [
    { p: `Manufacturing revenue +{{as.lineBuild.mfgGrowth.0|pct0}} / +{{as.lineBuild.mfgGrowth.1|pct0}} / +{{as.lineBuild.mfgGrowth.2|pct0}} at {{as.lineBuild.mfgMargin.0|pct}} / {{as.lineBuild.mfgMargin.1|pct}} / {{as.lineBuild.mfgMargin.2|pct}} EBITDA margin; trading ₹${n0(lines[0].trading)} / ${n0(lines[1].trading)} / ${n0(lines[2].trading)} cr at 4.5%: group revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}}, margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}. Capex ₹{{as.capex.0|num}} / {{as.capex.1|num}} / {{as.capex.2|num}} cr (6.25% of manufacturing revenue plus Hyva); depreciation 7% of gross block; finance cost ₹175 / 165 / 160 cr; other income ₹{{F.otherIncome.0|num}} / {{F.otherIncome.1|num}} / {{F.otherIncome.2|num}} cr, of which ~₹70 cr a year is 6.5% on the net cash left by the QIP; tax 25.5%; payout 10%. EPS grows ~${Math.round(X.epsCagrFwd)}% a year from the pro forma FY26 ₹${n2(A.eps[b])} (reported ₹5.58 on 89 cr shares). We do not model further acquisitions or the promoter merger.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY22', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates. FY24-25 EPS on pre-IPO shares; FY26 pro forma for the QIP.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM', 'JM Financial (May-26)', 'Jefferies (May-26)', 'Consensus (Centrum, May-26)'], rows: [
      ['Revenue growth FY27E', '{{F.salesGrowth.0|pct0}}', '16%', 'n.d.', '13% a year FY26-28E'],
      ['EBITDA margin FY27E', '{{F.ebitdaMargin.0|pct}}', '11.8%', 'n.d.', 'EBITDA +15% a year'],
      ['FY28E EPS (₹)', '{{F.eps.1|n2}}', `~${n2(streetEps28)} (implied)`, `~${n2(streetEps28)} (implied)`, 'EPS +27% a year'],
      ['FY28E EPS like-for-like: merger in, pre-QIP shares, no QIP interest (₹)', `${n2(X.lfl28.lo)}-${n2(X.lfl28.hi)}`, '', '', ''],
    ], source: 'Business Today (26-May-2026); Multibagg; GAM. Broker EPS implied as target ÷ 26x; the notes themselves were not available to us.' } },
    { callout: `Our FY28E EPS of ₹{{F.eps.1|n2}} is ~${Math.round((1 - F.eps[1] / streetEps28) * 100)}% below the ~₹${n2(streetEps28)} implied by the May-2026 targets. Part of the gap is definitional: the street\'s numbers predate the QIP (8.7% more shares, partly offset by ~₹${n0(X.qipIncome)} cr a year of after-tax interest on the cash) and appear to include the merger. On a like-for-like basis (merger in, pre-QIP shares, no QIP interest) our FY28E EPS would be ₹${n2(X.lfl28.lo)}-${n2(X.lfl28.hi)} (merged companies\' profit flat or +15% a year), still ${Math.round((1 - X.lfl28.hi / streetEps28) * 100)}-${Math.round((1 - X.lfl28.lo / streetEps28) * 100)}% below: we are a little more cautious on margins and on the trading arm.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
