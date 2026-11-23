// Asahi India Glass report, part 4: Q1FY27 momentum, earnings quality, ownership, governance, forecasts vs street.
const X = require('./ASAHIINDIA.ctx');
const { C, D, F, A, M, n0, n1, pc, pc1, b, q1Est, ebitdaCagrFwd, ebitdaCagrHist, epsCagrFwd, lev } = X;
const Q = C.q1fy27, G = C.guidance, FY = C.fy26, OI = C.otherIncomeFY26;
const q = M.quarterly, qi = q.labels.indexOf('Q1FY27'), qp = q.labels.indexOf('Q1FY26');
const yoy = k => pc1((q[k][qi] / q[k][qp] - 1) * 100);

const momentum = {
  id: 'momentum', nav: 'Q1FY27 & outlook', kicker: 'Momentum', title: 'Q1FY27: revenue +15%, EBITDA +69%, profit 2.7x: float glass did the heavy lifting',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, consolidated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(q.sales[qp]), n0(q.sales[qi]), yoy('sales')],
      ['EBITDA (excl. other income)', n0(q.ebitda[qp]), n0(q.ebitda[qi]), yoy('ebitda')],
      ['EBITDA margin', `${n1(q.ebitda[qp] / q.sales[qp] * 100)}%`, `${n1(q.ebitda[qi] / q.sales[qi] * 100)}%`, `+${Math.round((q.ebitda[qi] / q.sales[qi] - q.ebitda[qp] / q.sales[qp]) * 10000)}bp`],
      ['Depreciation', n0(q.dep[qp]), n0(q.dep[qi]), yoy('dep')],
      ['Finance cost', n0(q.interest[qp]), n0(q.interest[qi]), yoy('interest')],
      { hl: true, cells: ['**Net profit**', `**${n0(q.pat[qp])}**`, `**${n0(q.pat[qi])}**`, `**${yoy('pat')}**`] },
      ['Auto: gross revenue / segment EBIT', `${n0(Q.autoGrossQ1FY26)} / ${n0(Q.autoEbitQ1FY26)}`, `${n0(Q.autoGross)} / ${n0(Q.autoEbit)}`, `${pc((Q.autoGross / Q.autoGrossQ1FY26 - 1) * 100)} / ${pc((Q.autoEbit / Q.autoEbitQ1FY26 - 1) * 100)}`],
      ['Float: gross revenue / segment EBIT', `${n0(Q.floatGrossQ1FY26)} / ${n0(Q.floatEbitQ1FY26)}`, `${n0(Q.floatGross)} / ${n0(Q.floatEbit)}`, `${pc((Q.floatGross / Q.floatGrossQ1FY26 - 1) * 100)} / ${pc((Q.floatEbit / Q.floatEbitQ1FY26 - 1) * 100)}`],
    ], source: 'Q1FY27 results filing (5-Aug-2026); Screener.in' } },
    { bullets: [
      `**Where the profit came from:** segment EBIT rose by ₹${n0(Q.autoEbit + Q.floatEbit - Q.autoEbitQ1FY26 - Q.floatEbitQ1FY26)} cr, of which float ₹${n0(Q.floatEbit - Q.floatEbitQ1FY26)} cr and auto ₹${n0(Q.autoEbit - Q.autoEbitQ1FY26)} cr. Interest fell ~20% after the QIP repaid debt.`,
      `**Costs:** raw materials fell to ${Q.rawMaterialPct}% of revenue (Screener; ~35% in Q1FY26) because AIS now makes the float glass it used to buy; power and fuel rose to ₹255 cr (18% of revenue) as the third float line ran full.`,
      `**Margins by our estimate:** auto EBITDA ~${n1(q1Est.autoM)}%, float ~${n1(q1Est.floatM)}% (quarterly segment depreciation is not disclosed).`,
      `**Maruti:** sales to Maruti ₹${n0(Q.marutiSales)} cr in the quarter (21% of revenue), vs ₹${n0(FY.maruti)} cr in the whole of FY26.`,
    ] },
    { exhibit: { type: 'table', title: 'What management has said (Jan-2026 to Sep-2026)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['Capex', G.capex], ['Priorities', G.priorities], ['Float glass', G.float], ['Calls and guidance', G.noCalls],
    ], source: 'Q3FY26 results letter (30-Jan-2026); AR FY26 (28-Aug-2026); DGFT notification' } },
    { callout: `**Why it matters:** with no calls and no guidance, investors extrapolate quarters. Q1FY27 annualises to ~₹1,300 cr of EBITDA and ~₹600 cr of profit; our FY27E (₹${n0(F.ebitda[0])} cr and ₹${n0(F.pat[0])} cr) is close to that run-rate. The question for the valuation is not FY27 but whether float margins of ~28% last into FY28-29.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but grants in revenue, a weak cash year and a capitalisation-driven depreciation step-up',
  blocks: [
    { bullets: [
      `**Cash conversion was weak in FY26.** Cash from operations ₹${n0(A.cfo[b])} cr, ${Math.round(A.cfoToEbitda[b])}% of EBITDA (FY21-25: 51-119%), as inventories rose to ₹1,227 cr and receivables to ₹509 cr.`,
      `**Government grants sit in revenue.** ₹${n1(FY.grantsInRevenue)} cr in FY26 (₹${n1(FY.grantsInRevenueFY25)} cr in FY25): ₹34.7 cr of GST-linked state investment incentives plus ₹18.9 cr released from a ₹${n0(FY.deferredGrantRecognised)} cr capital grant booked in FY26 (balance ₹${n0(FY.deferredGrantClose)} cr). That is ~6% of FY26 EBITDA; the capital-grant release continues at ~₹18 cr a year.`,
      `**Other income includes one-offs.** FY26 ₹${n1(OI.total)} cr: interest ₹${n1(OI.interest)} cr, asset-sale gains ₹${n1(OI.assetSaleGain)} cr (incl. sales of assets to Maruti), write-backs ₹${n1(OI.writeBacks)} cr, miscellaneous ₹${n1(OI.misc)} cr. We forecast ₹25-26 cr without asset-sale gains.`,
      `**Exceptional items:** ${OI.exceptional}. We forecast none.`,
      '**Related-party sales are large.** Maruti (a promoter) is 17.5% of revenue; prices are set in arm\'s-length negotiations per the company and approved by shareholders, but outsiders cannot test them.',
      `**Depreciation and interest stepped up as projects were capitalised:** D&A ₹${n0(A.dep[b - 1])} cr → ₹${n0(A.dep[b])} cr and interest ₹${n0(A.interest[b - 1])} cr → ₹${n0(A.interest[b])} cr in FY26; Q1FY27 D&A ₹81 cr.`,
    ] },
    { callout: '**Accounting flag: AMBER.** Unmodified audit (VSSA & Associates) and simple accounts. The amber is for grants inside revenue, large related-party sales to a promoter-customer, asset-sale gains in other income and weak FY26 cash conversion.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Promoters hold ${OH.categories.promoters}% (Jun-2026): AGC Inc. 21.18%, CMD Sanjay Labroo 11.47%, Maruti Suzuki 10.59% and other Labroo family and promoter-group holders ~8.3% (Mar-2026 names). ${OH.qip} Foreign portfolio investors held ${OH.categories.fii}% and Indian institutions ${OH.categories.dii}% at Jun-2026; ~${n0(OH.categories.shareholders)} shareholders. ${OH.pledge}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: 'AR FY26 note 12 (31-Mar-2026); Jun-2026 category totals from Screener.in. Named holders for Jun-2026 were not available to us.' } },
  { callout: '**Our read:** three anchor owners with different interests: a Japanese technology partner, the founding family that runs the company, and the largest customer. Control is not contestable; free float is ~48% but institutions own only ~10%, so the stock trades on retail flows and is volatile.' },
] });

const GV = D.governance;
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a family-run JV with a customer on the register; competent, not shareholder-first',
  blocks: [
    { p: `Management: ${C.management.map(m => `${m[0]} (${m[1]})`).join('; ')}. Pay: ${C.remuneration.note}.` },
    { verdicts: GV.map(([a, v, e]) => [a, { GREEN: 'Strong', AMBER: 'Moderate', RED: 'Weak' }[v], e, { Board: 'Promoter and partner nominees dominate; independent oversight is adequate, not strong.', Pay: 'High for a company earning ROE ~10%, though within legal limits.', 'Related parties': 'The main related party is also the main customer: watch the annual approvals.', 'Capital raising': 'Equity raised twice in 13 years to fund capex; EPS diluted.', Disclosure: 'Thin for a ₹24,000 cr company: investors cannot track float prices or utilisation.', Auditor: 'No accounting red flags.' }[a] || '']), head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, AGM notice, auditor\'s report)' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EBITDA ₹{{F.ebitda.0|num}} / ₹{{F.ebitda.1|num}} / ₹{{F.ebitda.2|num}} cr; EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}',
  blocks: [
    { p: `Revenue and EBITDA come from the segment build (auto, float, consumer & unallocated, less eliminations; chapters above): revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}}, EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}. Capex ₹850 / 1,000 / 1,000 cr (brownfield plus the ₹2,000 cr greenfield plan); depreciation 5.1% of gross block (FY27E ₹{{F.dep.0|num}} cr); finance cost 8.3% on average debt (₹{{F.interest.0|num}} / {{F.interest.1|num}} / {{F.interest.2|num}} cr); other income ₹25-26 cr (interest on cash plus recurring items); tax 25.5%; payout 15%. Net debt/EBITDA ${lev.slice(1).map(x => x.toFixed(1) + 'x').join(' / ')}. EBITDA compounds ~${Math.round(ebitdaCagrFwd)}% a year over FY26-29E (FY21-26: ~${Math.round(ebitdaCagrHist)}%), EPS ~${Math.round(epsCagrFwd)}%. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (what was visible on 30-Sep-2026)', head: ['', 'GAM', 'Street'], rows: [
      ['FY27E revenue growth', '{{F.salesGrowth.0|pct0}}', '15.9% (Trendlyne consensus, one analyst, Jun/Jul-2026)'],
      ['FY27E profit growth', '{{F.patGrowth.0|pct0}}', '29.9% (same source)'],
      ['EBIT growth FY26-28E', `${Math.round((Math.pow((F.ebitda[1] - F.dep[1]) / (A.ebitda[b] - A.dep[b]), 1 / 2) - 1) * 100)}% a year`, '~10% a year (ICICI Securities, Jun-2026)'],
      ['FY28E EBITDA (₹ cr)', '{{F.ebitda.1|num}}', 'Not in our sources'],
    ], source: 'Trendlyne consensus page; ICICI Securities via Moneycontrol (Jun-2026). Both pre-date the Q1FY27 results.' } },
    { callout: 'Our estimates are **above** the street that was visible on 30-Sep-2026, because the only published numbers were set before Q1FY27 showed what Soniyana and better float prices could do. Our lower target is therefore not an earnings call: it is a multiple call. We apply the house EV/EBITDA multiple to higher earnings than the street had.' },
  ],
};

module.exports = { momentum, quality, ownership, governance, forecasts };
