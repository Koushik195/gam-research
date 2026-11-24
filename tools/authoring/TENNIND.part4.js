// Tenneco Clean Air India report, part 4: Q1FY27 and guidance, earnings quality, ownership, governance, our forecasts vs the street.
const X = require('./TENNIND.ctx');
const { C, D, F, A, b, Q1, LB, n0, n1, n2, pc, feesPct, epsCagrFwd, epsCagrHist, withEps } = X;
const FY = C.fy26;

const guidance = {
  id: 'q1', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: VAR +18%, EBITDA +8%, profit −2%; capex guided up to ₹350-450 cr',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY27', 'YoY', 'Comment'], wide: [3], rows: [
      ['Revenue from operations', n0(Q1.revenue), `+${Q1.revenueGrowth}%`, 'Includes ₹163 cr of substrates'],
      ['Value-added revenue', n0(Q1.var), `+${Q1.varGrowth}%`, `Served market +${Q1.servedMarketGrowth}%`],
      ['  CA&PT VAR', n0(Q1.caVar), `+${Q1.caGrowth}%`, 'No EV content; absent at the largest PV maker'],
      ['  ART VAR', n0(Q1.artVar), `+${Q1.artGrowth}%`, 'Four new customers; >90% utilisation'],
      ['EBITDA', n0(Q1.ebitda), `+${Q1.ebitdaGrowth}%`, `${Q1.ebitdaVarPct}% of VAR (${Q1.ebitdaVarPctLy}% a year ago)`],
      ['Net profit', n0(Q1.pat), `${Q1.patGrowth}%`, 'Q1FY26 had a Motocare-related one-off and other one-off income'],
    ], source: 'Q1FY27 presentation and call (6-Aug-2026)' } },
    { bullets: [
      `**Capex:** ${Q1.capexGuidanceFy27}. FY26 cash capex was ₹115 cr.`,
      `**Utilisation:** ${Q1.utilisation}.`,
      `**Costs:** ${Q1.recoveries}.`,
      `**Order book:** ₹12,400 cr lifetime (Mar-2026), more than 100% of the FY28 revenue target; reported half-yearly, next with Q2. Exports are ${FY.orderBookExportPct}% of new orders.`,
      `**Exports:** ${Q1.exportsComment}.`,
      `**Cash:** ${Q1.cashUse}. No dividend declared since listing.`,
      `**Norms:** ${C.guidance[2].text}.`,
    ] },
    { callout: '**What we take from it:** demand is strong and the order book is real, but this is a margin-pressure year: a public-company cost base was added in a quarter when oil-linked inputs jumped. Management gives no margin guidance beyond "back to the same levels" as revenue grows.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Clean audit, but three things to adjust for: pooled history, VAR, and the Motocare cash',
  blocks: [
    { bullets: [
      '**Pooled history.** The FY23-26 accounts combine four companies that came under one roof only in Mar-2025 (Ind AS 103 common-control pooling). They are fair for trends, but the businesses were run as sister companies, with their own transfer prices and dividends, for most of that period.',
      '**VAR is a management measure.** It removes substrates from revenue. It is the right lens for margins, but it is not audited as a line item; we reconcile it to reported revenue every quarter (substrates = revenue less VAR, 6-12% of VAR).',
      '**FY26 cash flow is flattered.** Operating cash of ₹1,429 cr includes ~₹663 cr of the Motocare sale consideration (an intra-group sale booked in Mar-2025), shown in "other working-capital items". Without it, cash from operations was ~₹766 cr, 83% of EBITDA; the company\'s own adjusted FCF/EBITDA is 58%.',
      '**One-offs.** Q1FY26 profit included Motocare-related and other one-off income (size not disclosed; other income ₹31 cr that quarter); Q3FY26 carried a ₹27 cr labour-code charge (₹20 cr after tax). Our forecasts carry neither.',
      `**Related-party charges** (${n1(feesPct)}% of revenue) were restructured in the IPO year (network fees replaced management-support and corporate charges) and the transfer-pricing APA was withdrawn: watch the fee line.`,
      '**Minorities** are immaterial (~₹1 cr a year): net profit equals profit for EPS.',
    ] },
    { callout: '**Accounting flag: AMBER.** Deloitte audits the accounts and we found nothing improper. The amber reflects a short, reconstructed history, a non-GAAP headline metric and a cash-flow year inflated by an intra-group sale.' },
  ],
};

const OH = D.ownership, J = OH.jun2026;
const ownership = base => ({ ...base, blocks: [
  { p: `At Jun-2026 the promoter (${OH.promoterEntities}) held ${J.promoters}%, foreign investors ${J.fiis}%, Indian institutions ${J.diis}% and ${n0(J.shareholders)} other shareholders ${J.public}%. The IPO sold 22.5% of the company (anchor book ₹1,080 cr). On 12-Aug-2026 the promoter sold another 6.05 cr shares (15.0%) through a block; ${OH.afterBlock.replace(/^The 12-Aug-2026 sale of 6.05 cr shares \(15.0% of 40.36 cr\) implies /, 'that implies ')}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding (%)', head: ['', 'Dec-2025', 'Mar-2026', 'Jun-2026', 'After the Aug-2026 block (implied)'], rows: [
    ['Promoter (Tenneco)', OH.dec2025.promoters, OH.mar2026.promoters, J.promoters, '~59.8'], ['Foreign institutions', OH.dec2025.fiis, OH.mar2026.fiis, J.fiis, 'n.a.'], ['Indian institutions', OH.dec2025.diis, OH.mar2026.diis, J.diis, 'n.a.'], ['Public', OH.dec2025.public, OH.mar2026.public, J.public, 'n.a.'],
  ].map(r => r.map(String)), source: 'BSE shareholding patterns via Screener.in (to Jun-2026); block size from CNBC-TV18 (12-Aug-2026) and Khaitan & Co (23-Sep-2026); GAM arithmetic. Named holders above 1% were not available to us.' } },
  { callout: '**Our read:** this is a controlled company whose controller is a private-equity-owned group that has been raising cash: ₹1,037 cr of dividends, ₹3,600 cr at the IPO and ~₹3,200 cr in August (6.05 cr shares at ~₹525, our estimate). The overhang is the main stock-specific risk; the offset is a wider free float (~40%) and better liquidity.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: professional and audited by Deloitte, but run for a parent that is selling down',
  blocks: [
    { p: `Board: ${C.management.board} Management: ${C.management.ceo}; CFO ${C.management.cfo}; Company Secretary ${C.management.cs}. Auditor: ${C.management.auditor}.` },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Deloitte Haskins & Sells; audit and limited-review fees ₹2.3 cr in FY26', 'No accounting red flags.'],
      ['Board', 'Moderate', '3 of 8 independent (the legal minimum); four parent nominees incl. an Apollo Management director', 'Minority voice rests on three independents.'],
      ['Related-party flows', 'Moderate', `Royalty + network fees ${n1(feesPct)}% of revenue; royalty base includes substrates; APA withdrawn; ~70% of export orders intra-group`, 'The main structural risk to minorities.'],
      ['Capital allocation', 'Moderate', 'Pre-IPO payout 171% of FY26 profit to the parent; since listing no dividend, capex stepped up, M&A "options"', 'Unproven as a listed company; watch any group acquisition.'],
      ['Promoter behaviour', 'Weak', 'Pure-OFS IPO, then a 15% block nine months later', 'Overhang until the parent states its intent.'],
      ['Disclosure', 'Moderate', 'VAR and segment VAR every quarter; no segment margins; order book half-yearly', 'Adequate; segment margins would help.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; company calls; exchange news' },
  ],
};

const medE = y => X.medOf(withEps.map(s => s.eps[y]));
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n2}} / ₹{{F.eps.1|n2}} / ₹{{F.eps.2|n2}}, below the street',
  blocks: [
    { p: `VAR +${n1(X.varG[0])}% / +${n1(X.varG[1])}% / +${n1(X.varG[2])}% (ART +{{as.lineBuild.artGrowth.0|pct0}} / +{{as.lineBuild.artGrowth.1|pct0}} / +{{as.lineBuild.artGrowth.2|pct0}}, CA&PT +{{as.lineBuild.caGrowth.0|pct0}} / +{{as.lineBuild.caGrowth.1|pct0}} / +{{as.lineBuild.caGrowth.2|pct0}}); revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}}; EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} of revenue; capex ₹{{as.capex.0|num}} / {{as.capex.1|num}} / {{as.capex.2|num}} cr; depreciation 9% of gross block; other income = 6.5% on net cash plus ₹6 cr; tax 25.5%; payout 0% / 25% / 30%. EPS compounds ~${Math.round(epsCagrFwd)}% a year over FY26-29E (FY23-26: ${Math.round(epsCagrHist)}%). Net cash builds to ₹{{F.treasury.2|num}} cr by FY29E because we assume no acquisition.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin (on revenue)', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM', ...withEps.map(s => `${s.broker} (${s.date.slice(5, 7)}/${s.date.slice(2, 4)})`)], rows: [
      ['Revenue FY27E (₹ cr)', '{{F.sales.0|num}}', ...withEps.map(s => (s.revenue ? n0(s.revenue.FY27E) : '–'))],
      ['Revenue FY28E (₹ cr)', '{{F.sales.1|num}}', ...withEps.map(s => (s.revenue ? n0(s.revenue.FY28E) : '–'))],
      ['EPS FY27E (₹)', '{{F.eps.0|n2}}', ...withEps.map(s => n2(s.eps.FY27E))],
      ['EPS FY28E (₹)', '{{F.eps.1|n2}}', ...withEps.map(s => n2(s.eps.FY28E))],
      { hl: true, cells: ['**GAM vs JM Financial, FY28E EPS**', `**${pc((F.eps[1] / medE('FY28E') - 1) * 100)}**`, ...withEps.map(() => '')] },
    ], source: `JM Financial result update (3-Jun-2026; no post-Q1 JM note found). Motilal Oswal (15-Sep-2026): PAT ₹1,026 cr in FY29E (~₹25.4 EPS) vs our ₹${n0(F.pat[2])} cr. Citi and Axis estimates not published in the press.` } },
    { callout: `Our FY28E EPS is ${pc((F.eps[1] / medE('FY28E') - 1) * 100)} below JM Financial's. Revenue is similar (JM assumes VAR +22% in FY28E, we assume +${n1(X.varG[1])}%); the gap is margin (JM 18.1% of revenue in FY28E, we {{F.ebitdaMargin.1|pct}}) and depreciation, which we raise faster because capex triples.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
