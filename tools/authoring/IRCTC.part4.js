// IRCTC report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./IRCTC.ctx');
const { C, D, F, A, AS, A26, T, n0, n1, pc, pc1, rup, b, shortDate, tre0, ttmOI, ttmExc, oi26, oiTreas, pl26, q, seg } = X;
const Q = C.q1fy27, OI = C.otherIncomeFY26;
const yoy = (a, p) => pc1((a / p - 1) * 100);
const q1 = q('Q1FY27'), q0 = q('Q1FY26');

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +18% on catering, EBITDA −2.7%, profit flat',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q.revenuePrior), n0(Q.revenue), yoy(Q.revenue, Q.revenuePrior)],
      ['  Catering', n0(q0.catRev), n0(q1.catRev), yoy(q1.catRev, q0.catRev)],
      ['  Internet ticketing', n0(q0.itRev), n0(q1.itRev), yoy(q1.itRev, q0.itRev)],
      ['  Tourism', n0(q0.tourRev), n0(q1.tourRev), yoy(q1.tourRev, q0.tourRev)],
      ['  Rail Neer (gross)', n0(q0.rnRev), n0(q1.rnRev), yoy(q1.rnRev, q0.rnRev)],
      ['Employee cost', n0(Q.employeePrior), n0(Q.employeeCost), yoy(Q.employeeCost, Q.employeePrior)],
      ['EBITDA', n0(Q.ebitdaPrior), n0(Q.ebitda), yoy(Q.ebitda, Q.ebitdaPrior)],
      ['EBITDA margin', `${Q.ebitdaMarginPriorPct}%`, `${Q.ebitdaMarginPct}%`, '−610bp'],
      ['Other income', n0(Q.otherIncomePrior), n0(Q.otherIncome), yoy(Q.otherIncome, Q.otherIncomePrior)],
      { hl: true, cells: ['**Net profit**', `**${n0(Q.patPrior)}**`, `**${n0(Q.pat)}**`, `**${yoy(Q.pat, Q.patPrior)}**`] },
      ['Segment margins: catering / ticketing / tourism / Rail Neer', `${q0.catMargin}% / ${q0.itMargin}% / ${q0.tourMargin}% / ${q0.rnMargin}%`, `${q1.catMargin}% / ${q1.itMargin}% / ${q1.tourMargin}% / ${q1.rnMargin}%`, ''],
    ], source: 'Q1FY27 results and call (12/13-Aug-2026); PL Capital result update (14-Aug-2026)' } },
    { bullets: [
      `**What went wrong:** ~₹20 cr of one-time HR cost (gratuity ceiling raised to ₹25 lakh and post-retirement benefits; ₹10 cr in catering), ~₹4 cr of proof-of-concept catering trains, ₹10 cr of ticketing-platform maintenance and higher resin costs at Rail Neer. Without the HR and POC items the EBITDA margin would have been ~30%.`,
      '**What went right:** catering (+34%: prepaid-train sales, licence fees, e-catering and ₹41 cr of election specials) and tourism (+14%, margin 11.5% vs 8.7%).',
      '**What was flat:** ticketing (+0.6%): convenience fee +5% to ₹248 cr, non-fee income −8% to ₹113 cr.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May to Aug-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome || '–')]), source: 'Q4FY26 call (27-May-2026); Q1FY27 call (13-Aug-2026)' } },
    { callout: 'IRCTC gives no numeric guidance beyond segment growth aspirations, and its management changed between the two calls: the CMD who spoke in May resigned with effect from 20-Jul-2026, and the Director (Tourism & Marketing) now holds the CMD charge. We give most weight to what is visible in the numbers: catering momentum, flat ticketing and margin pressure.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean cash conversion and small one-offs, but large balances with the Railways',
  blocks: [
    { bullets: [
      `**Cash conversion is good.** Cash from operations was ${Math.round(A.cfo[b] / A.pat[b] * 100)}% of net profit in FY26 (₹${n0(A.cfo[b])} cr) and ${Math.round(A.cfo[b - 1] / A.pat[b - 1] * 100)}% in FY25; working capital absorbs cash as catering grows (receivables ₹${n0(T.tradeReceivables)} cr, 132 days).`,
      '**One-offs are small.** Exceptional items were +₹27 cr (FY23), −₹59 cr (FY24), +₹48 cr (FY25, legacy write-backs) and +₹17 cr (FY26): 1-5% of profit. Q4FY26 also carried a full year of CSR (₹31 cr) and a ₹16 cr ECL provision inside EBITDA. We forecast no exceptional items.',
      `**Other income is real interest.** FY26 other income of ₹${n1(oi26)} cr was ₹${n1(OI.interestTotal)} cr of deposit interest plus ₹${n1(OI.nonOperatingTotal)} cr of fines and penalties from caterers (₹${n1(OI.finesPenalties)} cr), deposit amortisation, rent and miscellaneous income. We build FY27E as ${AS.treasuryYield[0]}% on opening net treasury (₹${n0(tre0)} cr) = ₹${n0(oiTreas[0])} cr plus ₹${AS.otherIncome[0]} cr of other items = ₹{{F.otherIncome.0|num}} cr, against ₹${n0(ttmOI - ttmExc)} cr in the twelve months to Jun-26 (before exceptional items).`,
      '**Balances with the Railways are large and "subject to reconciliation".** The Railways are customer (receivables), supplier (licence and revenue shares booked gross as expenses) and banker of last resort; Rail Neer profit is shared 15:85 or 40:60 depending on the plant. A reconciliation or policy change can move a year\'s profit.',
      '**Litigation:** the licence-fee enhancement for prepaid and postpaid trains (CC-60) is sub judice; management would not quantify it.',
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit (CAG-appointed auditor), no debt, little capex, small one-offs and cash from operations at 91% of profit in FY26 (63% in FY25, when receivables rose). The watch-points are the size of receivables from the Railways and the related-party nature of almost every revenue line, not the accounting itself.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The President of India (Government of India) owns ${OH.categories.promoters}% (Jun-2026). LIC owns ${OH.named[1][1]}%, ICICI Prudential Large & Mid Cap Fund ${OH.named[2][1]}%, all mutual funds ${OH.categories.mutualFunds}%, insurers ${OH.categories.insurance}%, foreign portfolio investors ${OH.categories.fpi}% and small individual holders ${OH.categories.individualsSmall}% (~19.5 lakh shareholders). ${OH.trend}. Nothing is pledged.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: 'Shareholding pattern for the quarter ended 30-Jun-2026 (via Trendlyne)' } },
  { callout: '**Our read:** the government is the controlling shareholder and a regular seller (Oct-2019 IPO, Dec-2020 and Dec-2022 OFS; ~5% more planned in FY27, which would take it to ~57%). It also decides IRCTC\'s fees, prices and dividends. Retail holders now own more of the free float than foreign funds; an OFS floor price is usually set at a discount to the market.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a clean, well-audited PSU whose owner is also its regulator and main customer',
  blocks: [
    { p: rup(`Board: ${D.governance.board}. ${C.management.cmd}; ${C.management.cfo}; ${C.management.catering}. Auditor: ${C.management.auditor}.`) },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor + '.', 'No accounting red flags.'],
      ['Leadership', 'Watch', 'CMD resigned (personal reasons) with effect from 20-Jul-2026; charge held by a functional director; CFO changed between the May and Aug calls.', 'Leadership in transition during an OFS year.'],
      ['Owner = regulator = customer', 'Watch', rup(D.governance.relatedParty), 'The single biggest governance issue: fees, prices and shares are set by the controlling shareholder.'],
      ['Policy record', 'Moderate', 'Oct-2021 order to share 50% of convenience fees, withdrawn within a day; licence-fee dispute (CC-60) in court.', 'Policy risk is real but has been reversed when it hurt minorities.'],
      ['Capital allocation', 'Moderate', rup(D.governance.capitalAllocation), 'Little capital needed; payout set by DIPAM rules; cash builds up.'],
      ['Disclosure', 'Moderate', 'No investor presentation; KPIs (tickets, fees, UPI share) given only on calls; segment margins explained in the Q&A.', 'Analysts asked for a KPI deck twice in 2026.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; Q4FY26 and Q1FY27 calls; Business Today (29-Oct-2021); sahi.com (13-Aug-2026)' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, 2-3% below the street',
  blocks: [
    { p: `We forecast each segment's revenue and segment result (as the company reports it, after depreciation) and subtract a small unallocated line to reach EBITDA: catering +19% / +13% / +12% at 10.0-10.5%; ticketing +4% / +6% / +6% at 80-80.5%; tourism +15% / +14% / +12% at 13.5%; Rail Neer +4% / +8% / +12% at 11.5-12.5%. Revenue grows {{F.salesGrowth.0|pct}} / {{F.salesGrowth.1|pct}} / {{F.salesGrowth.2|pct}}, but the EBITDA margin drifts down to {{F.ebitdaMargin.2|pct}} as catering gains share. Capex ₹120-150 cr; depreciation 4% of gross block; other income built from a ${AS.treasuryYield[0]}% then ${AS.treasuryYield[1]}% yield on opening net treasury plus ₹80-90 cr of fines, deposit amortisation and rent; tax 25.5%; payout 52%. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (actuals incl. exceptional items)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'PL FY27E', 'GAM FY28E', 'PL FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(pl26.revenue.FY27E), '{{F.sales.1|num}}', n0(pl26.revenue.FY28E)],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(pl26.ebitda.FY27E), '{{F.ebitda.1|num}}', n0(pl26.ebitda.FY28E)],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', pl26.ebitdaMarginPct.FY27E + '%', '{{F.ebitdaMargin.1|pct}}', pl26.ebitdaMarginPct.FY28E + '%'],
      ['Other income (₹ cr)', '{{F.otherIncome.0|num}}', n0(pl26.otherIncome.FY27E), '{{F.otherIncome.1|num}}', n0(pl26.otherIncome.FY28E)],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(pl26.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(pl26.eps.FY28E)}**`] },
      ['Gap (GAM vs PL)', pc(gap(F.eps[0], pl26.eps.FY27E)), '', pc(gap(F.eps[1], pl26.eps.FY28E)), ''],
    ], source: 'PL Capital Q1FY27 result update (14-Aug-2026, standalone). IDBI Capital and Choice estimates were not visible to us; no dated consensus standing on 30-Sep-2026 was found.' } },
    { callout: `We are slightly below PL because we take a lower EBITDA margin (catering one-offs aside, prepaid trains and ticketing costs keep pressure on) and only 4% ticketing growth in FY27E. Our EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E, down from 11.5% over FY23-26. Like the street, we assume no change in the convenience fee or catering prices; a fee change in either direction would move EPS more than any other assumption.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
