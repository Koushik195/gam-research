// Lemon Tree report, part 4: Q1FY27 & outlook, earnings quality, ownership, governance.
const X = require('./LEMONTREE.ctx');
const { C, D, n0, n1, Q1, FY26 } = X;
const G = C.guidance, AC = C.accounting, MN = C.management, MI = C.minorities;
const g = (a, b) => `${a >= b ? '+' : '−'}${Math.abs(Math.round((a / b - 1) * 100))}%`;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & outlook', kicker: 'Momentum', title: 'Q1FY27: revenue +9%, operating EBITDA +7%, ARR +2%; management promises double-digit growth from Q2 and a 50% margin in FY28',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, consolidated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n1(Q1.revenueOpPy), n1(Q1.revenueOp), g(Q1.revenueOp, Q1.revenueOpPy)],
      ['  of which fees from third-party hotels', n1(Q1.fees3pPy), n1(Q1.fees3p), g(Q1.fees3p, Q1.fees3pPy)],
      ['Company net EBITDA (incl. other income) / margin', `${n1(Q1.netEbitdaPy)} / ${Q1.marginPyPct}%`, `${n1(Q1.netEbitda)} / ${Q1.marginPct}%`, `${g(Q1.netEbitda, Q1.netEbitdaPy)} / −1.0 pp`],
      ['  adjusted for GST impact and SAR provision', n1(Q1.netEbitdaPy), n1(Q1.adjNetEbitda), g(Q1.adjNetEbitda, Q1.netEbitdaPy)],
      ['Finance cost (bank + leases)', '47.9', n1(Q1.bankInterest + Q1.leaseInterest), '−15%'],
      ['Profit before tax / tax', `62.9 / 14.8`, `${Q1.pbt} / ${Q1.tax}`, ''],
      ['Profit after tax / minorities', `48.1 / ~9.8`, `${Q1.pat} / ${Q1.minorities}`, g(Q1.pat, Q1.patPy)],
      { hl: true, cells: ['**Profit attributable to owners / EPS (₹)**', '**38.3 / 0.48**', `**${Q1.patAttributable} / 0.58**`, '**+20%**'] },
      ['Owned hotels: ARR (₹) / occupancy', `${n0(Q1.arrPy)} / ${Q1.occPyPct}%`, `${n0(Q1.arr)} / ${Q1.occPct}%`, `${g(Q1.arr, Q1.arrPy)} / +314 bps`],
      ['Gross debt (₹ cr) / cost', `${n0(Q1.grossDebtPy)} / 8.0%`, `${n0(Q1.grossDebt)} / ${Q1.costOfDebtPct}%`, '−11% / −53 bps'],
    ], source: 'Q1FY27 deck (7-Aug-2026) slides 8-12; Q1FY27 call; PL (11-Aug-2026) for minorities and attributable profit; Screener.in' } },
    { bullets: [
      `**What went right:** occupancy +314 bps to ${Q1.occPct}%; third-party fees ${g(Q1.fees3p, Q1.fees3pPy)}; Keys RevPAR ${g(Q1.keysRevpar, Q1.keysRevparPy)} after renovation; finance cost down 15% as debt fell; attributable profit +20%.`,
      `**What went wrong:** ARR only ${g(Q1.arr, Q1.arrPy)} because rooms were sold through retail channels when corporate travel fell (West Asia); Mumbai and Gurugram RevPAR fell; the GST input-credit loss (2.3% of revenue) and the SAR provision (0.8%) cut the margin by ~1 point; six managed hotels opened (334 rooms) against a 2,000-key target for the year.`,
      `**Outlook (10-Aug-2026):** ${G.demand} ${G.margin}`,
    ] },
    { exhibit: { type: 'table', title: 'What management said (Jan-Aug 2026)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['Demand and FY27', G.demand], ['Margins', G.margin], ['Fees and openings', G.fees], ['Keys', G.keys], ['Capex', G.capex], ['Debt', G.debt],
      ['Scheme timing', C.scheme.status],
    ], source: 'Q4FY26 call (29-May-2026); Q1FY27 call (10-Aug-2026); scheme call (Jan-2026); CRISIL (17-Jul-2026)' } },
    { callout: '**Why it matters:** Q1 is a lean quarter (~20% of the year), so the test is the October-March season. Our FY27E operating margin of {{F.ebitdaMargin.0|pct}} needs H2 margins close to last year\'s ~51-52% with GST still costing ~2%; the company\'s own "well better than 47%" is on a measure that includes other income. FY28E ({{F.ebitdaMargin.1|pct}}) needs the renovation spend to fall as promised.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: real cash and conservative renovation accounting, but a fifth of the profit is the minority\'s and debt is still high',
  blocks: [
    { bullets: [
      `**Renovation is expensed.** ${AC.renovation} That flatters nothing: it depresses today's margin and should reverse.`,
      `**Definitions.** ${AC.ebitdaDefinition} We use operating EBITDA throughout, as Screener and the peers do.`,
      `**Exceptional items.** ${AC.exceptional} FY26 attributable profit ₹${n0(FY26.patAttributable)} cr reported, ₹245 cr before the exceptional charge (Screener "Profit for PE").`,
      `**Minorities.** Large: ₹${MI.fy26} cr in FY26 (${MI.pctOfProfitFy26}% of profit after tax; ${MI.pctOfProfitFy25}% in FY25), ₹${MI.q1fy27} cr in Q1FY27. ${MI.holder}.`,
      `**Stock appreciation rights.** ${AC.sar}`,
      `**Cash conversion.** Operating cash ${Math.round(X.A.cfoToEbitda[X.b])}% of operating EBITDA in FY26 (${Math.round(X.A.cfoToEbitda[X.b - 1])}% in FY25); free cash flow ₹${n0(X.A.fcf[X.b])} cr went to debt repayment.`,
    ] },
    { callout: '**Accounting flag: AMBER.** The cash is real and the renovation accounting is conservative. But headline "EBITDA" and "PAT" are before a minority that takes ~21% of profit, the company\'s EBITDA includes other income, the GST and SAR adjustments in the "adjusted" figures are recurring costs, not one-offs, and the scheme will soon make the consolidated history hard to compare.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The founder, Patanjali Keswani, holds ${OH.promoterVehicles[0][1]}% through Spank Management Services; the promoter group ${OH.categoriesPct.promoter}% in all (Jun-2026); no pledge reported. APG, the Dutch pension investor that owned 41% of Fleur until May-2026, holds ${OH.strategic[0][1]}% of Lemon Tree and has told management it does not plan to sell. Foreign investors own ${OH.categoriesPct.fii}% (27.6% in Jun-2024), mutual funds ${OH.categoriesPct.mf}% (Franklin India Flexi Cap alone 5.3% at Mar-26) and retail and others ${OH.categoriesPct.public}%; ${n0(OH.shareholders)} shareholders, up from ~3.3 lakh in Mar-2024.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (31-Mar-2026; categories at Jun-2026 in the text)', head: ['Holder', 'Type', '% of shares'], rows: [
    ...OH.promoterVehicles.map(h => [h[0], 'Promoter group', h[1] + '%']),
    ...OH.strategic.map(h => [h[0], 'Financial investor (public category)', h[1] + '%']),
    ...OH.institutions.map(h => [h[0], 'Mutual fund', h[1] + '%']),
  ], source: OH.src } },
  { callout: '**Our read:** a low promoter stake (22%) and a large financial holder (APG, 15%) whose exit from Fleur raises the question of its Lemon Tree stake; institutions have been selling for two years and retail has been buying. An orderly APG sale would be an overhang; a disorderly one a risk. Nothing in the filings to 30-Sep-2026 shows a sale.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a founder-led group with a professional bench; the founder\'s move to Fleur and related-party flows between the two companies need watching',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role'], rows: [...MN.board, ...MN.kmp], source: 'AR FY26; Q4FY26 and Q1FY27 calls' } },
    { verdicts: [
      ['Board and succession', 'Good', 'Neelendra Singh (MD) and Kapil Sharma (ED & CFO) took executive roles on 1-Oct-2025; the founder moves to non-executive chair at Lemon Tree from Mar-2027 and stays Executive Chairman of Fleur.', 'A planned handover, but the founder\'s focus shifts to the owner, not the manager.'],
      ['Pay', 'Reasonable', `Executive Chairman ₹${n1(MN.pay.chairmanLakh / 100)} cr from Lemon Tree in FY26 (incl. a one-time ex-gratia) plus ₹${n1(MN.pay.chairmanFromFleurLakh / 100)} cr from Fleur; ${MN.pay.chairmanToMedian}x the median employee, whose pay fell ${Math.abs(MN.pay.medianPayChangePct)}%.`, 'Modest next to the luxury peers.'],
      ['Related parties after the scheme', 'Watch', 'Fleur will pay Lemon Tree management fees on long-term contracts; the founder chairs both and owns shares in both; Warburg checked the contracts against peers (Q4FY26 call).', 'Arm\'s-length fees matter for minority holders of both companies.'],
      ['Capital discipline', 'Mixed', 'Borrowings incl. leases cut from ₹2,336 cr (FY24) to ₹2,004 cr (FY26); but Fleur plans ₹2,500-3,000 cr of deployment "with a full focus on return on capital" at what management calls mid-cycle.', 'Returns on new capital will decide Fleur\'s value.'],
      ['Execution', 'Average', 'Aurika Mumbai ramped well; Aurika Shimla: two of three blocks were to open by Q2FY27 (29-May call), still "opening shortly" in August; Nehru Place still awaits approvals (DDA extended the letter of award by a year); renovation runs into FY27.', 'Project dates need a discount.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; company calls; CRISIL (17-Jul-2026); GAM Research' },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts: require('./LEMONTREE.part4b').forecasts };
