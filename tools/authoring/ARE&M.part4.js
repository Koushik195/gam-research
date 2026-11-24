// Amara Raja report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./ARE&M.ctx');
const { C, D, F, A, n0, n1, pc, pc1, b, withEps, medEps, epsCagrFwd, epsCagrHist, oiB, ttmOI } = X;
const Q = C.q1fy27, G = C.guidance, FY = C.fy26, q0 = Q.q1fy26, QC = Q.consolidated;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +21%, EBITDA +5%, profit +5%: volumes boomed, margins did not',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, standalone)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(q0.revenue), n0(Q.revenue), yoy(Q.revenue, q0.revenue)],
      ['EBITDA', n0(q0.ebitda), n0(Q.ebitda), yoy(Q.ebitda, q0.ebitda)],
      ['EBITDA margin', `${q0.ebitdaMargin}%`, `${Q.ebitdaMargin}%`, '−140bp'],
      ['Depreciation', n0(q0.dep), n0(Q.dep), yoy(Q.dep, q0.dep)],
      ['Profit before tax', n0(q0.pbt), n0(Q.pbt), yoy(Q.pbt, q0.pbt)],
      { hl: true, cells: ['**Net profit**', `**${n0(q0.pat)}**`, `**${n0(Q.pat)}**`, `**${yoy(Q.pat, q0.pat)}**`] },
      ['Memo: consolidated revenue / net profit', `${n0(QC.q1fy26Revenue)} / ${n0(QC.q1fy26Pat)}`, `${n0(QC.revenue)} / ${n0(QC.pat)}`, `${yoy(QC.revenue, QC.q1fy26Revenue)} / ${yoy(QC.pat, QC.q1fy26Pat)}`],
      ['Memo: New Energy segment revenue (consolidated)', '~121', n0(QC.nebRevenue), '+70%+'],
    ], source: 'Q1FY27 presentation (10-Aug-2026) and call (11-Aug-2026); MOFSL and 360 ONE result notes (11-Aug-2026); Screener.in (standalone and consolidated)' } },
    { bullets: [
      `**Volumes:** ${Q.volumes}`,
      `**Margin:** ${Q.margin}`,
      '**Outlook:** no formal guidance; lead-acid can grow 9-10% a year (volume) over the medium term; the B2B price lag should be recovered "if not fully in Q2, in the next quarter"; the trading share falls as the tubular plant covers demand; exports should recover.',
      '**Lithium:** CQP inaugurated 15-Jul-2026; 2 GWh NMC equipment due in Q3FY27, production from Q2-CY2027; BESS from Q3FY27; ₹1,900 cr in ARACT by Aug-2026; the 16 GWh target is now an ambition, to be matched to demand.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-2026 to Aug-2026)', head: ['Topic', 'What was said'], wide: [1], rows: G.map(g => { const [t, ...r] = g.split(': '); return [t, r.join(': ')]; }), source: 'Q4FY26 call (26-May-2026); Q1FY27 call (11-Aug-2026)' } },
    { callout: '**Why it matters:** our FY27E needs revenue growth of ~13% and an ~11.0% margin for Q2-Q4 after a +21% / 10.1% Q1. The price increases of June and August should lift margins from Q2; the risk is that alloys, acid and plastics keep rising and the strategic spending does not fade. A Q2 margin below ~10.5% would put our FY27E at risk.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: cash-backed, but read FY25-26 profit before insurance income',
  blocks: [
    { bullets: [
      `**Cash conversion is good.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26 (${Math.round(A.cfoToPat[b])}% of reported profit, ${Math.round(A.cfoToEbitda[b])}% of EBITDA) and ₹${n0(A.cfo[b - 1])} cr in FY25 (${Math.round(A.cfoToPat[b - 1])}% of profit).`,
      '**One-offs are labelled but large.** FY26 PBT includes ₹259 cr of net exceptional income (insurance ₹303 cr less a ₹43.8 cr labour-code charge): 20% of PBT. FY25 includes ₹111 cr of insurance; FY23 a ₹47.65 cr fire charge. Screener adds these to other income. We value on EPS before them (FY26 ₹42.4, not ₹53.0).',
      `**Other income is small and mostly operating.** FY26 ₹${n1(C.otherIncomeFY26.total)} cr before exceptional items (company): foreign-exchange gains ₹42.8 cr, scrap ₹12.5 cr, mutual-fund gains ₹8.1 cr, interest ₹4.0 cr, other ₹24.7 cr. We forecast ₹${n0(oiB[0].oi)} cr for FY27E (TTM ₹${ttmOI} cr): the cash is gone and we do not assume FY26's FX gain repeats in full.`,
      '**Where the judgement sits:** warranty provisions (raised in Q1FY27 as product costs rose; their unwinding is ₹17 cr of finance cost); goodwill of ₹428 cr from the Mangal demerger, tested annually; the investments in subsidiaries carried at cost (₹2,234 cr) while ARACT\'s own book value is ₹1,431 cr; debottlenecking costs expensed, not capitalised (Q1FY27 call).',
      '**Related parties:** ARCSPL sells recycled lead to the company; ARPSL owes ₹120 cr; Mangal Industries (promoter group) was the plastics supplier before its battery-components business was folded in.',
    ] },
    { callout: '**Accounting flag: GREEN** for the standalone company (joint auditors Price Waterhouse and K.S. Rao & Co, unmodified opinions; exceptional items clearly shown). Investors should still read the consolidated accounts: consolidated profit was ₹74 cr below standalone in FY26 and that gap will widen while the cell plant starts.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Galla family controls the company through Amara Raja Enterprises Pvt Ltd (formerly RNGalla Family Pvt Ltd), which holds ${OH.categories.promoters}% (Jun-2026), up from 28.06% after the Mangal demerger shares in Feb-2024. ${OH.pledge} Foreign portfolio investors hold ${OH.categories.fii}% (24.5% at Mar-2024), Indian institutions ${OH.categories.dii}% and retail and others ${OH.categories.public}% across ${(OH.categories.shareholders / 100000).toFixed(1)} lakh shareholders, up from 4.7 lakh in Mar-2023. With a one-third promoter stake and two-thirds free float, this is a widely held stock.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: OH.src } },
  { callout: '**Our read:** a family-run company with a modest stake (33%) but full management control: the Chairman is also MD & CEO, and two family members are executive directors. Foreign funds have been selling for two years; the free float is large, so the stock moves with institutional sentiment on lithium and margins.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: clean audit and a half-independent board, but a family-run executive team that pays itself well',
  blocks: [
    { p: `Board: ${D.governance.board}. Auditor: ${D.governance.auditor}` },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor, 'Clean standalone accounts; exceptional items labelled.'],
      ['Board', 'Moderate', '6 directors, 3 independent (50%); the Chairman is also MD & CEO; three of six directors are from the promoter family.', 'Meets the rules; little separation between owner, board chair and management.'],
      ['Management', 'Moderate', 'Jayadev Galla (director since 1994) re-appointed CMD & CEO from 1-Sep-2025; Harshavardhana Gourineni (lead-acid) and Vikramadithya Gourineni (New Energy) since 2021; CFO Y. Delli Babu.', 'Experienced in lead-acid; lithium cells are new to everyone.'],
      ['Pay', 'Watch', 'Executive directors\' pay ₹39.4 cr in FY26 (Chairman ₹19.7 cr, each ED ₹9.9 cr), ~4% of standalone profit; down 6% YoY.', 'High for a ₹14,000 cr company; commission-linked.'],
      ['Related-party flows', 'Moderate', D.governance.relatedParty, 'Inside the group and disclosed.'],
      ['Regulators', 'Improving', 'AP Pollution Control Board closure order (Apr-2021) revoked on 18-Jul-2026; writ petition withdrawn.', 'A five-year overhang removed.'],
      ['Capital allocation', 'Watch', '₹1,900 cr into ARACT so far, more to come; Mangal business bought from a promoter-group company for shares (₹672.6 cr).', 'The test: whether ARACT earns its cost of capital.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (board, remuneration annexure, notes); AR FY24 (Mangal demerger); Q1FY27 call; shareholding pattern Jun-2026' },
  ],
};

const gap = (g, s) => (g / s - 1) * 100;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: standalone EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}',
  blocks: [
    { p: `Revenue comes from the three-line build, EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, lead-acid capex ₹400 / 450 / 500 cr, depreciation 7.7% of gross block (FY27E ₹{{F.dep.0|num}} cr), tax 25.5% and a 20% payout. Other income and finance cost are built from the parent's cash: it starts FY27 with ~₹156 cr of net debt, puts ₹${n0(X.BL.aract.infusion[0])} cr into ARACT (to the ~₹2,500 cr of risk capital) and is back in net cash during FY28E. So other income is ₹${n0(oiB[0].oi)} / ${n0(oiB[1].oi)} / ${n0(oiB[2].oi)} cr and finance cost ₹${n0(oiB[0].fin)} / ${n0(oiB[1].fin)} / ${n0(oiB[2].fin)} cr. ARACT's losses are not in these numbers (it is a subsidiary); they are valued separately. FY27E EPS is below FY26's reported ₹53.0 because FY26 included ₹10.6 a share of insurance income; against EPS before it (₹42.4), FY27E grows ~${Math.round((F.eps[0] / X.epsAdj[2026] - 1) * 100)}%.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore, standalone)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (actuals incl. exceptional items)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow (before ARACT infusions)', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street: standalone EPS (₹, estimates standing on 30-Sep-2026)', head: ['', 'GAM', ...withEps.map(s => s.broker)], rows: [
      ['FY27E', '{{F.eps.0|n1}}', ...withEps.map(s => n1(s.eps.FY27E))],
      ['FY28E', '{{F.eps.1|n1}}', ...withEps.map(s => n1(s.eps.FY28E))],
      ['FY27E revenue (₹ cr)', '{{F.sales.0|num}}', ...withEps.map(s => n0(s.revenue.FY27E))],
      ['FY27E / FY28E EBITDA margin', '{{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}}', ...withEps.map(s => `${s.ebitdaMarginPct.FY27E}% / ${s.ebitdaMarginPct.FY28E}%`)],
      { hl: true, cells: ['**GAM vs street median, FY28E EPS**', `**${pc(gap(F.eps[1], medEps('FY28E')))}**`, ...withEps.map(() => '')] },
    ], source: 'Result notes of 11/13-Aug-2026 (MOFSL, Nuvama, 360 ONE, Anand Rathi); Nomura and J.P. Morgan estimates were not visible to us' } },
    { callout: `Our FY28E EPS (₹${n1(F.eps[1])}) is close to MOFSL (₹56.8) and Nuvama (₹55.3) and below Anand Rathi (₹60.1) and 360 ONE (₹66.4, which assumes a 12.9% margin). EPS compounds ~${Math.round(epsCagrFwd)}% a year over FY26-29E from EPS before one-offs, against ~${Math.round(epsCagrHist)}% a year in FY21-26, on volume growth, a margin rebuild from 10.1% to 12% and (from FY28E) interest on cash that no longer goes to ARACT. If ARACT needs more equity in FY28-29E, FY29E EPS would be up to ~₹${n1(oiB[2].treasury * (1 - X.TAX) / X.shares)} lower (the treasury income).` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
