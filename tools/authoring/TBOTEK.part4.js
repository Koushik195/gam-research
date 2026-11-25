// TBO Tek report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./TBOTEK.ctx');
const { C, D, F, A, AS, A26, Q1, n0, n1, pc, pc1, b, tre0, oiTreas, oi26, oiQ1x4, choice, mosl, gp, ebitdaToGp, take } = X;
const yoy = (a, p) => pc1((a / p - 1) * 100);
const FY = C.fy26, OI = FY.otherIncomeDetail;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: GTV +37% (+15% organic in constant currency), EBITDA +84%, profit +32%',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change', 'of which organic (Q1FY27)'], rows: [
      ['GTV', n0(Q1.gtvPrior), n0(Q1.gtv), yoy(Q1.gtv, Q1.gtvPrior) + ' (+30% CC)', `${n0(Q1.gtvOrganic)} (${yoy(Q1.gtvOrganic, Q1.gtvPrior)}; +15% CC)`],
      ['Revenue from operations', n0(Q1.revenuePrior), n0(Q1.revenue), yoy(Q1.revenue, Q1.revenuePrior), `${n0(Q1.revenueOrganic)} (${yoy(Q1.revenueOrganic, Q1.revenuePrior)})`],
      ['Gross profit', n0(Q1.gpPrior), n0(Q1.gp), yoy(Q1.gp, Q1.gpPrior), `${n0(Q1.gpOrganic)} (${yoy(Q1.gpOrganic, Q1.gpPrior)})`],
      ['SG&A before ESOP (organic)', n0(Q1.organicSgaPrior), n0(Q1.organicSgaExEsop), yoy(Q1.organicSgaExEsop, Q1.organicSgaPrior) + ' (+4% CC)', ''],
      ['EBITDA (company definition)', n0(Q1.ebitdaPrior), n0(Q1.ebitda), yoy(Q1.ebitda, Q1.ebitdaPrior), ''],
      ['Adjusted EBITDA (before ESOP)', '84.7', n1(Q1.adjEbitda), yoy(Q1.adjEbitda, 84.7), `${n1(Q1.adjEbitdaOrganic)} (+25%); Classic ${n1(Q1.adjEbitdaCV)}`],
      ['Depreciation / finance cost', '14.0 / 5.3', `${n1(Q1.dep)} / ${n1(Q1.finance)}`, 'acquisition', ''],
      { hl: true, cells: ['**Net profit**', `**${n1(Q1.patPrior)}**`, `**${n1(Q1.pat)}**`, `**${yoy(Q1.pat, Q1.patPrior)}**`, ''] },
      ['Monthly transacting buyers', n0(Q1.mtbPrior), n0(Q1.mtb), yoy(Q1.mtb, Q1.mtbPrior), `${n0(Q1.mtbOrganic)} (${yoy(Q1.mtbOrganic, Q1.mtbPrior)})`],
    ], source: 'Q1FY27 shareholders\' letter (revised, 29-Jul-2026); call (30-Jul-2026); constant-currency consolidated GTV per MOSL (30-Jul-2026)' } },
    { bullets: [
      '**What went right:** Europe (+37%, +24% CC), APAC (+56%, +41% CC) and LATAM (+20%) more than offset a flat Middle East; organic SG&A rose only 4% in constant currency (hosting −13.7%), so organic EBITDA grew 25%; Classic Vacations had its seasonal peak; cash rose ₹392 cr to ₹1,984 cr as working capital reversed.',
      '**What went wrong:** hotel GP/GTV fell (5.2% vs 5.5% in Q4FY26 for H&A) as the Middle East shrank in the mix and TBO cut prices; India hotel GTV fell 2%; a ₹5.5 cr FX loss; depreciation and interest more than doubled with the acquisition.',
      '**Flattered by the rupee:** constant-currency growth was ~11 points lower for hotels (38.9% vs 49.8% consolidated) and SG&A growth 8 points lower. TBO now reports both, at investors\' request.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May to Jul-2026)', head: ['Topic', 'What was said', 'Source'], wide: [1], rows: C.guidance, source: 'Q4FY26 call (29-May-2026); Q1FY27 letter and call (29/30-Jul-2026)' } },
    { callout: 'Management gives no numeric revenue or margin guidance and says it has "given up on predicting" the Middle East. It anchors on two things: year-on-year and quarter-on-quarter growth (Q2 should beat Q1), and a rising EBITDA/GP ratio. We take both at face value but model a slow Middle East recovery.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts, but profit is flattered by currency, amortisation is rising, and cash flow swings with the float',
  blocks: [
    { bullets: [
      `**Cash conversion is lumpy.** Cash from operations was ₹${n0(A.cfo[b - 2])} cr (FY24), ₹${n0(A.cfo[b - 1])} cr (FY25) and ₹${n0(A.cfo[b])} cr (FY26) against net profit of ₹${n0(A.pat[b - 2])} / ${n0(A.pat[b - 1])} / ${n0(A.pat[b])} cr. In FY26 receivables rose ₹726 cr: TBO stopped discounting Brazilian card instalments for a few months (an experiment reversed in mid-December, unwinding by Q2FY27), war-related collection delays and supplier incentives accrued through the year. The CFO calls it timing and expects historical (100%+) EBITDA-to-cash conversion again; Q1FY27 reversed part of it. Over FY22-26 operating cash flow (₹929 cr) was ~1.1x cumulative profit (₹857 cr).`,
      `**Other income is small and partly non-cash.** FY26 other income of ₹${n1(oi26)} cr = interest ₹${n1(OI.interestFinancialAssets)} cr, liquid-fund income ₹${n1(OI.shortTermInvestments)} cr, liabilities written back ₹${n1(OI.liabilitiesWrittenBack)} cr and other items. We build FY27E as ${AS.treasuryYield[0]}% on opening net treasury (₹${n0(tre0)} cr) = ₹${n0(oiTreas[0])} cr plus ₹${AS.otherIncome[0]} cr of other items = ₹{{F.otherIncome.0|num}} cr, against ₹${n1(oi26)} cr in FY26 and ₹${n1(oiQ1x4)} cr annualising Q1FY27.`,
      `**One-offs:** acquisition costs of ₹${FY.acqCost} cr (FY26), FX losses of ₹${FY.fxLoss} cr (FY26) and ₹${Q1.fxLoss} cr (Q1FY27), exceptional gains of ₹${FY.exceptional} cr (FY26). ESOP cost (₹${FY.esop} cr in FY26) is a real cost; the company's "adjusted EBITDA" adds it back, our EBITDA does not.`,
      '**Amortisation of acquired intangibles** (Classic Vacations customer and brand assets) more than doubled quarterly depreciation (₹14 cr to ₹33 cr); goodwill of ₹555 cr is tested yearly, not amortised.',
      '**Engine note:** our model scales working capital with revenue (−34% of FY26 revenue), so forecast operating cash flow (₹{{F.cfo.0|num}} cr in FY27E) is higher than profit and the cash pile grows fast. Real working capital moves with GTV, supplier terms and the season; treat forecast cash and the DCF as generous by ~₹300 cr a year.',
    ] },
    { callout: '**Accounting flag: AMBER.** The audit (S.R. Batliboi, EY network) is unmodified and the disclosure is unusually rich (constant-currency, regional and organic splits). We flag AMBER for three things: profit is translated from many currencies at a time of sharp rupee moves; working capital is large relative to profit and swings by several hundred crore; and an open FEMA show-cause notice (₹49 cr of transactions; penalty of up to three times) is not provided for.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Promoters own ${OH.categories.promoters}% (Jun-2026): LAP Travel ${OH.named[0][1]}%, co-founder Gaurav Bhatnagar ${OH.named[1][1]}%, Manish Dhingra ${OH.named[4][1]}% and co-founder Ankush Nijhawan ${OH.named[11][1]}%. Pre-IPO financial investors still hold 22.3%: General Atlantic ${OH.named[2][1]}%, Augusta TBO ${OH.named[3][1]}% and TBO Korea Holdings ${OH.named[7][1]}%. Mutual funds own ${OH.categories.mutualFunds}%, insurers ${OH.categories.insurance}%, individuals ~${OH.categories.public}%. ${OH.trend}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: 'Shareholding pattern for the quarter ended 30-Jun-2026 (via Trendlyne)' } },
  { callout: '**Our read:** founders with ~44% and long tenure align well with minorities. The overhang is the 22% still held by pre-IPO funds, which can sell in blocks at a discount; the free float held by the public is only ~4%, so the stock depends on institutional flows.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: founder-run with a strong board and auditor; one open foreign-exchange case and rich pay for the Joint MDs',
  blocks: [
    { p: `Board: ${D.governance.board}. Auditor: ${D.governance.auditor}. Key managers: ${C.management.map(([n, r]) => `${n} (${r})`).join('; ')}.` },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor + '; detailed organic, regional and constant-currency disclosure every quarter.', 'No accounting red flags.'],
      ['Founders and alignment', 'Strong', 'Co-founders run the company since 2006 and the promoter group holds 44.4%; no reduction since listing.', 'Key-person risk sits with two founders.'],
      ['Regulatory', 'Watch', D.governance.regulatory, 'Size is small against ₹1,984 cr of cash, but the case is open and not provided for.'],
      ['Pay', 'Moderate', D.governance.pay, 'High relative to the median employee, but rises were below the staff average.'],
      ['Capital allocation', 'Moderate', D.governance.capitalAllocation, 'Earlier deals (Bookabed, Jumbonline) needed no goodwill impairment in FY25-26; Classic Vacations is the first large one.'],
      ['Board independence', 'Strong', 'Independent chairman and four of eight directors independent (ex-PepsiCo, Microsoft, RBS executives).', 'Nominee director from a pre-IPO investor.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (board, remuneration annexure, secretarial audit report); Jun-2026 investor deck' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}; below the street in FY27E, close by FY29E',
  blocks: [
    { p: `We forecast GTV, take rate and gross profit for organic hotels (GTV +${AS.segments[1].growth.join('% / +')}%), organic air (+${AS.segments[0].growth.join('% / +')}%) and Classic Vacations (a full year in FY27E, then +8%), and subtract SG&A and ESOP cost to reach EBITDA. Consolidated GTV ₹${gp.map((_, i) => n0(X.gtv[i])).join(' / ')} cr; take rate ${take.map(n1).join('% / ')}%; gross profit ₹${gp.map(n0).join(' / ')} cr; EBITDA/GP ${ebitdaToGp.map(n1).join('% / ')}%; EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} of revenue. Depreciation and amortisation ~₹135-150 cr; finance cost ₹${AS.interest.join(' / ')} cr as the acquisition loan amortises; tax ${AS.taxRate.join('% / ')}%; no dividend. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY22', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation and amortisation', ref: 'fin.dep' },
      { name: 'Other income (actuals incl. exceptional items)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'MOSL FY27E', 'Choice FY27E', 'GAM FY28E', 'MOSL FY28E', 'Choice FY28E', 'GAM FY29E', 'Choice FY29E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(mosl.revenue.FY27E), n0(choice.revenue.FY27E), '{{F.sales.1|num}}', n0(mosl.revenue.FY28E), n0(choice.revenue.FY28E), '{{F.sales.2|num}}', n0(choice.revenue.FY29E)],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(mosl.ebitda.FY27E), n0(choice.ebitda.FY27E), '{{F.ebitda.1|num}}', n0(mosl.ebitda.FY28E), n0(choice.ebitda.FY28E), '{{F.ebitda.2|num}}', n0(choice.ebitda.FY29E)],
      ['Net profit (₹ cr)', '{{F.pat.0|num}}', n0(mosl.pat.FY27E), n0(choice.pat.FY27E), '{{F.pat.1|num}}', n0(mosl.pat.FY28E), n0(choice.pat.FY28E), '{{F.pat.2|num}}', n0(choice.pat.FY29E)],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(mosl.pat.FY27E / C.shares.count * 1e7)}**`, `**${n1(choice.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(mosl.pat.FY28E / C.shares.count * 1e7)}**`, `**${n1(choice.eps.FY28E)}**`, '**{{F.eps.2|n1}}**', `**${n1(choice.eps.FY29E)}**`] },
      ['GAM EPS vs Choice', pc(gap(F.eps[0], choice.eps.FY27E)), '', '', pc(gap(F.eps[1], choice.eps.FY28E)), '', '', pc(gap(F.eps[2], choice.eps.FY29E)), ''],
    ], source: 'MOSL Q1FY27 update (30-Jul-2026, via DSIJ; EPS = PAT ÷ 10.86 cr shares); Choice initiation (22-Sep-2026). Anand Rathi and I-Sec absolute estimates not visible to us.' } },
    { callout: `We are below the street for FY27E (EBITDA ₹{{F.ebitda.0|num}} cr vs ~₹625 cr) because we assume the Middle East stays subdued and hotel GP/GTV recovers only partly; Q1FY27 EPS of ₹${n1(Q1.eps)} annualises to ~₹31. By FY29E we are close to Choice because we let SG&A grow well below gross profit (EBITDA/GP to ~${n0(ebitdaToGp[2])}%). EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E, from a depressed FY26 base.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
