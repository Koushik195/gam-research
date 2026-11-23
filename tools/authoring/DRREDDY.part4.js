// Dr. Reddy's report, part 4: margins, earnings quality, ownership, management and governance.
const X = require('./DRREDDY.ctx');
const { C, D, SA, SQ, QL, Q1, FY26, F, A, AS, BL, n0, n1, pc, rup, b, ix } = X;
const fi = FY26.ifrs, fa = FY26.indas, q = Q1.ifrs;
const oneOffInEbitda = fi.ssa + 184 + 117 + fi.impairment; // SSA (revenue), VAT, labour codes, impairments: all inside Screener EBITDA
const adj26 = (A.ebitda[b] + oneOffInEbitda) / (A.sales[b] + fi.ssa) * 100;
const semaProvPp = q.semaProvision / F.sales[0] * 100, mePp = 0.75, semaContribPp = BL.memo.semaglutideRs[0] * 0.6 / F.sales[0] * 100;
const resid = F.ebitdaMargin[0] - adj26 + semaProvPp + mePp - semaContribPp;
const r1 = v => Math.round(v * 10) / 10;

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: 26-28% was gRevlimid; the base business earns mid-teens on our basis',
  blocks: [
    { p: `A word on bases first. Dr. Reddy's reports and guides on **IFRS EBITDA**, which includes other operating income (brand divestment gains, settlements, licence income) and forex, and excludes impairments: ${n1(fi.ebitdaPct)}% in FY26 (${n1(fi.ebitdaAdjPct)}% before the specific items) and ${n1(q.ebitdaPct)}% in Q1FY27 (${n1(q.ebitdaExSemaPct)}% before the semaglutide provision). Our model uses Screener's **Ind AS operating profit**, which is after impairments and before all other income: ${n1(A.ebitdaMargin[b])}% in FY26 and 10.6% in Q1FY27. The gap is 1.5-3.5 points. Management's "neighbourhood of 20%" for the base business is the IFRS number; ~18% on our basis, and Q1FY27 delivered 13.6% before the provision.` },
    { exhibit: { type: 'table', title: 'FY26 EBITDA: from the company\'s IFRS number to our Ind AS basis (₹ crore)', head: ['', '₹ crore', '% of revenue'], rows: [
      ['IFRS EBITDA as reported', n0(fi.ebitda), `${n1(fi.ebitdaPct)}%`],
      ['Less: impairments (inside Ind AS expenses)', `(${n0(fi.impairment)})`, ''],
      ['Less: other operating income and forex (Ind AS other income)', `(${n0(fi.ebitda - fi.impairment - fa.ebitda)})`, ''],
      { hl: true, cells: ['**Ind AS operating profit (Screener, our basis)**', `**${n0(fa.ebitda)}**`, `**${n1(A.ebitdaMargin[b])}%**`] },
      ['Add back: SSA, VAT, labour codes, impairments', n0(oneOffInEbitda), ''],
      { hl: true, cells: ['**FY26 on our basis before specific items**', `**${n0(A.ebitda[b] + oneOffInEbitda)}**`, `**${n1(adj26)}%**`] },
    ], source: 'AR FY26 (IFRS MD&A and five-year summary; Ind AS P&L); Q4FY26 call; GAM Research' } },
    { pair: [
      { type: 'waterfall', title: `From ${n1(adj26)}% (FY26 before specific items) to ${n1(F.ebitdaMargin[0])}% in FY27E`, unit: 'EBITDA margin on our basis, FY26 to FY27E (percentage points; GAM estimates from company data)', x: ['FY26 adj.', 'Lenalidomide gone, erosion, mix (net)', 'Q1 semaglutide provision', 'Middle East costs (~1pt, Apr-Dec)', 'Semaglutide contribution (H2)', 'FY27E'], series: [{ name: 'pp', values: [adj26, resid, -semaProvPp, -mePp, semaContribPp, F.ebitdaMargin[0]].map(r1), fmt: 'n1' }], fmt: 'n1', totalFmt: 'pct', min: 0, max: 26, source: 'Q4FY26 and Q1FY27 calls (Middle East ~1 point of margin "at least up till December"); GAM estimates (semaglutide ~₹1,500 cr at ~60% contribution; residual)' },
      { type: 'line', title: 'Quarterly margin: 23-27% in H1FY26, 13% in Q4FY26 and Q1FY27', unit: 'IFRS EBITDA margin (%): reported vs before specific items', x: QL, series: [{ name: 'Reported', values: SQ.map(s => s.ebitdaMarginPct), fmt: 'pct' }, { name: 'Before specific items', values: SQ.map(s => s.ebitdaAdjPct ?? s.ebitdaMarginPct), fmt: 'pct' }], labels: 'all', min: 5, max: 30, source: 'Company releases and presentations (Q3FY26 before specific items 24.8%)' },
    ] },
    { p: `**Where we land:** {{F.ebitdaMargin.0|pct}} in FY27E, {{F.ebitdaMargin.1|pct}} in FY28E (a full year of semaglutide and the first year of abatacept, with SG&A held near FY26's ₹10,435 cr in nominal terms) and {{F.ebitdaMargin.2|pct}} in FY29E. That is ~20-21.5% on the company's IFRS basis in FY28-29E, below the 25% aspiration. The cost structure explains why: SG&A was 35.7% of revenue in Q1FY27 (30% a year earlier) because the branded businesses need field forces and the NRT brands need advertising; R&D is 7-8% of revenue; gross margin ex-semaglutide was 49.4% in Q1FY27 (56.9% a year earlier with lenalidomide).` },
    { callout: `**Every 100bp of EBITDA margin is ~₹${n0(F.sales[1] / 100)} cr of FY28E EBITDA, ~₹${n1(F.sales[1] / 100 * (1 - X.taxRows[1].rate / 100) / F.shares)} of EPS (~${Math.round(F.sales[1] / 100 * (1 - X.taxRows[1].rate / 100) / F.pat[1] * 100)}%).** Each ₹1 move in the rupee against the dollar shifts FY28E North America revenue by ~₹${n0(BL.naUsdMn[1] / 10)} cr.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: AMBER. Clean books, but "one-offs" recur and the company\'s EBITDA flatters',
  blocks: [
    { exhibit: { type: 'table', title: "What to adjust for when reading Dr. Reddy's numbers", head: ['Item', 'FY26 / Q1FY27', 'Treatment', 'Our view'], wide: [1, 3], rows: [
      ['Specific items', `₹${n0(981)} cr in FY26 (SSA ₹453 cr, VAT ₹184 cr, CAR-T ₹135 cr, Eftilagimod ₹93 cr, labour codes ₹117 cr); ₹240 cr in Q1FY27 (semaglutide API)`, 'Excluded from the company\'s "underlying" EBITDA and PBT', 'Most are genuinely unusual, but one-off items appear in every year from FY21 to Q1FY27 (impairments ₹859 cr in FY21 and ₹756 cr in FY22). We use EPS before one-offs for the multiple (A18 practice) and show reported EPS too.'],
      ['Other operating income', `₹${n0(fi.otherOpIncome)} cr in FY26 (₹436 cr FY25): ₹189 cr brand divestments, ₹140 cr litigation settlement income, licence income`, 'Inside IFRS EBITDA; in Ind AS other income', 'We forecast none of the divestment or settlement income; the company\'s ~20% margin includes some.'],
      ['Impairments of R&D and in-licensed assets', `₹${n0(fi.impairment)} cr FY26, ₹169 cr FY25`, 'Below IFRS EBITDA; inside Screener EBITDA', 'A recurring cost of an in-licensing strategy; we include none in forecasts (a risk).'],
      ['Shelf-stock adjustment (SSA)', '₹453 cr (US$50 mn) reduced Q4FY26 revenue', 'Specific item', 'The last bill of the gRevlimid windfall; does not recur.'],
      ['Working capital', `Operating working capital ₹${n0(FY26.balance.opWorkingCapital)} cr (~43% of revenue); receivables 110 days`, '—', 'Heavy for a generics company; our engine holds working capital at 34% of revenue (Screener basis).'],
      ['Tax rate', 'FY26 22.5% (Q4 −10.8% on deferred tax assets); Q1FY27 21.3% (provision reversal)', 'Guidance 24-25%', 'We use 24% / 25% / 25%.'],
      ['Treasury carry', `Short-term borrowings ₹${n0(q.shortTermBorrowings)} cr held alongside ₹${n0(q.cashAndInvestments)} cr of cash and investments (Jun-26)`, 'Interest in finance cost; yield in other income', 'We model both gross (finance cost ~₹480 cr, treasury income ~₹600-800 cr).'],
      ['Minority interest', '49% of the Nestle nutraceutical JV: ₹38 cr loss to minority in FY26', 'Screener "Net Profit" is before minorities', 'We use attributable profit (DRREDDY.patch.js).'],
    ], source: 'AR FY26 (notes 2.16, 2.20, 2.39; five-year summary); Q4FY26 and Q1FY27 calls and releases' } },
    { callout: '**Verdict: AMBER.** The auditor (S.R. Batliboi, an EY member firm) is clean, the company reports under both IFRS and Ind AS, files a US Form 20-F and explains each specific item. But headline "underlying" EBITDA leaves out charges that recur in some form most years and includes one-off income, and working capital ties up ~43% of revenue. Read the company\'s margin guidance as 1.5-3 points above what reaches our P&L basis.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `Dr. Reddy's is one of India's more widely held pharma companies. The promoter families (of chairman K Satish Reddy and co-chairman G V Prasad) own ${D.ownership.categories.promoters}%, mostly through two family trusts into which their holdings moved in FY26 (GVP Family Trust 11.51%, VSD Family Trust 9.06%), with no pledge. Life Insurance Corporation alone owns 12.16%, and 11.94% sits in NYSE-listed ADRs (held by J P Morgan as depository). At Jun-2026 foreign portfolio investors held ${D.ownership.categories.fii}% (excluding ADRs), domestic institutions ${D.ownership.categories.dii}% (mutual funds 13.2%), across ${n0(D.ownership.shareholders)} shareholders.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest shareholders (31-Mar-2026) and categories (30-Jun-2026)', head: ['Holder', 'Stake / note'], wide: [1], rows: [
    ...D.ownership.named,
    ['**Categories at 30-Jun-2026**', ''],
    ['Promoter group', `${D.ownership.categories.promoters}%`],
    ['Foreign portfolio investors (excl. ADRs)', `${D.ownership.categories.fii}%`],
    ['Domestic institutions', `${D.ownership.categories.dii}%`],
    ['Public, ADRs and others', `${n1(D.ownership.categories.public + D.ownership.categories.others)}%`],
    ['Promoter pledge', D.ownership.pledge],
  ], source: D.ownership.src } },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: an independent board and US-grade disclosure; execution is the weak spot',
  blocks: [
    { p: rup(`${C.management.chairman}. ${C.management.md}. CEO: ${C.management.ceo}. CFO: ${C.management.cfo}. Board: ${C.management.board}. Auditor: ${C.management.auditor}.`) },
    { verdicts: [
      ['Board independence', 'Strong', '8 of 10 directors independent incl. a lead independent director; audit committee chaired by Arun M Kumar; NYSE listing brings US governance rules.', 'Among the better boards in Indian pharma.'],
      ['Promoter alignment', 'Moderate', '26.6% stake, now held via family trusts; no pledge; the founder families hold the chairman and MD roles.', 'Low stake for an Indian promoter; professional CEO runs the business.'],
      ['Executive pay', 'Moderate', 'MD ₹15.8 cr (202x median) and chairman ₹10.1 cr in FY26, both down ~15% as profit-linked commission fell; CEO fixed pay ₹7.3 cr plus variable and ₹15.3 cr of LTIs.', 'High in absolute terms but tied to profit.'],
      ['Disclosure', 'Strong', 'IFRS and Ind AS, quarterly calls with transcripts, US 20-F, specific items itemised, a same-day call on the semaglutide API issue (9-Jul-2026).', 'Lenalidomide sales were never disclosed.'],
      ['Capital allocation', 'Moderate', 'NRT (GBP458 mn) working; CAR-T and Eftilagimod written off (₹228 cr); biologics capacity built ahead of revenue; ~₹3,000 cr earmarked for deals.', 'The next deal will define the record.'],
      ['Legal and compliance', 'Moderate', 'The FCPA inquiry that began with an anonymous complaint in Sep-2020 (Ukraine and other markets) was closed by the SEC (Feb-2026) and DOJ (Mar-2026) without action; still a defendant in US Revlimid antitrust suits and the Zantac (ranitidine) MDL.', 'The largest overhang is gone; no provisions disclosed for the pending suits.'],
      ['Execution and quality', 'Weak-Moderate', 'Semaglutide API scale-up failed validation; CEO admits US complex-generics R&D misses; Form 483s at Bachupally (7) and Srikakulam (3) in 2026, no OAI.', 'Repeated slips on the products that matter most.'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate information, governance report Table 5, Annexure V, shareholder information); company calls' },
  ],
};

module.exports = { margins, quality, ownership, governance };
