// Motherson Sumi Wiring India report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./MSUMI.ctx');
const { C, D, F, A, M, RP, n0, n1, n2, pc, pc1, b, withEps, medEps, epsCagrFwd, epsCagrHist, feesPct } = X;
const Q = C.q1fy27, G = C.guidance, FY = C.fy26;
const q = M.quarterly, qi = q.labels.indexOf('Q1FY27'), qp = q.labels.indexOf('Q1FY26'), q4 = q.labels.indexOf('Q4FY26');
const yoy = k => pc1((q[k][qi] / q[k][qp] - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +37%, EBITDA +6%, profit +2%: copper and wages ate the growth',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'Change YoY'], rows: [
      ['Revenue', n0(q.sales[qp]), n0(q.sales[q4]), n0(q.sales[qi]), yoy('sales')],
      ['EBITDA', n0(q.ebitda[qp]), n0(q.ebitda[q4]), n0(q.ebitda[qi]), yoy('ebitda')],
      ['EBITDA margin', `${n1(q.ebitda[qp] / q.sales[qp] * 100)}%`, `${n1(q.ebitda[q4] / q.sales[q4] * 100)}%`, `${n1(q.ebitda[qi] / q.sales[qi] * 100)}%`, `${Math.round((q.ebitda[qi] / q.sales[qi] - q.ebitda[qp] / q.sales[qp]) * 10000)}bp`],
      ['Raw materials, % of revenue', '64.7%', '70.5%', '69.1%', '+440bp'],
      ['Employee cost, % of revenue', '19.1%', '15.5%', '17.7%', '−140bp (+26% in rupees)'],
      ['Depreciation', n0(q.dep[qp]), n0(q.dep[q4]), n0(q.dep[qi]), yoy('dep')],
      { hl: true, cells: ['**Net profit**', `**${n0(q.pat[qp])}**`, `**${n0(q.pat[q4])}**`, `**${n0(q.pat[qi])}**`, `**${yoy('pat')}**`] },
      ['Greenfield revenue (estimate)', '156', '443', '~452', '+189%'],
    ], source: 'Screener.in (as reported, 4-Aug-2026); Choice and MOSL Q1FY27 notes (cost ratios); Emkay Exhibit 4 (greenfield split)' } },
    { bullets: [
      `**Revenue +${Q.growth}%:** about ${Q.copperShareOfGrowth} points from copper, the rest volumes, content, premium models and new programmes; existing plants +26%. EV programmes ${Q.evShare}% of revenue. Industry passenger-vehicle volumes +${Q.pvIndustryGrowth}%.`,
      `**Margin ${Q.margin}%:** copper rose another ${Q.copperQoQ}% quarter on quarter (₹${n0(Q.copperInrKg)}/kg), so the lag still hurt, though less than in Q4 (7% vs 17% sequential rise); the NCR wage increase (35-40%) is fully in the quarter's numbers.`,
      `**Balance sheet:** external debt ₹${Q.externalDebt} cr and cash ₹${Q.cash} cr at Jun-2026 (net debt ₹${Q.netDebtExLeases} cr before ₹${Q.leaseLiabilities} cr of leases), after ₹56 cr of net cash at Mar-2026: working capital absorbed the copper increase.`,
    ] },
    { exhibit: { type: 'table', title: 'What management said (Apr-2026 to Aug-2026)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['Copper', G.copper], ['Wages', G.wages], ['Greenfields', G.greenfields], ['Margin', G.margin], ['Capex', G.capex], ['Expansion', G.expansion], ['New architectures', G.architecture],
    ], source: 'Q4FY26 call (28-Apr-2026); Q1FY27 presentation and call (4-Aug-2026)' } },
    { callout: '**Why it matters:** management gives no margin guidance and would not quantify how much of the wage increase customers will pay ("it\'s a matter which is between us and the customer"). Our FY27E margin of {{as.ebitdaMargin.0|pct}} needs ~8.5% in Q2-Q4: the copper lag closing and the greenfields turning positive, with little wage recovery. If customers pay for the wages too, FY27-28 margins would be ~0.5-1 point higher than we model.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: simple accounts and a clean audit; the related-party flows are the judgement call',
  blocks: [
    { bullets: [
      `**Simple accounts.** One company, no subsidiaries, no acquisitions, no goodwill; exceptional items only in FY22 (₹65 cr, reorganisation costs). Unmodified audit by S.R. Batliboi & Co. (EY network), whose one key audit matter is the related-party transactions.`,
      `**Cash conversion swings with copper.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26 (${Math.round(A.cfoToPat[b])}% of profit) but ₹${n0(A.cfo[b - 1])} cr in FY25 (${Math.round(A.cfoToPat[b - 1])}%), as receivables rose from 49 to 60 days. Payables owed to the JV partners (₹${n0(RP.payablesToJvPartnersMar26)} cr at Mar-2026) fund part of the inventory.`,
      `**Leases flatter EBITDA.** Most buildings are leased (₹223 cr of lease liabilities); under Ind AS 116 the ~₹115 cr a year of lease payments appears as depreciation and interest, not as an operating cost, so EBITDA is ~1 point of revenue higher than on a rent-paying basis. Peers with owned plants are not directly comparable on EBITDA margin.`,
      `**Related-party pricing.** ~${Math.round(X.rpPurchPct)}% of materials come from the promoters at "price lists in force and terms that would be available to third parties" (AR FY26); fees to them were ${n1(feesPct)}% of revenue. We cannot test the prices from outside; the audit committee approves them annually.`,
      '**Other income is negligible** (₹4 cr in FY26, ₹5 cr in Q1FY27); earnings are almost entirely operating.',
    ] },
    { callout: '**Accounting flag: AMBER.** The accounts are clean and simple, and cash conversion is good over time. The amber is for the size of the related-party flows (purchases, fees, leases) that set much of MSWIL\'s cost base: the margin minority shareholders see depends on prices agreed between related companies.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The two joint-venture partners hold 58.5%: SAMIL ${OH.named[0][1]}% and Sumitomo Wiring Systems ${OH.named[1][1]}% (25.34% with affiliates); the Sehgal family and other promoter-group holders another ${OH.named[2][1]}%, for a promoter total of ${OH.categories.promoters}% (Jun-2026), unchanged since listing. SAMIL is itself promoted by the Sehgal family. Indian institutions own ${OH.categories.dii}% (ICICI Prudential MF alone 5.36% at Mar-2026) and foreign investors ${OH.categories.fii}%, down from 14.9% at listing. ${n0(OH.categories.shareholders)} shareholders hold the rest.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: OH.named.map(([h, p, nt]) => [h, p + '%', nt]), source: 'AR FY26 note 11 (31-Mar-2026); Jun-2026 category totals from Screener.in. Named institutional holders above 1% for Jun-2026 were not available to us.' } },
  { callout: '**Our read:** control is shared and not contestable: neither partner can sell without changing the JV, and each earns more from supplying and charging fees to MSWIL than from its dividends alone. Foreign funds have been sellers for four years; Indian funds have been buyers.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professional board, but the company is run inside the Motherson group',
  blocks: [
    { p: `Board: ${D.governance.board} Management: ${C.management.map(m => `${m[0]} (${m[1]})`).join('; ')}. Pay: ${D.governance.pay}` },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Unmodified opinion; S.R. Batliboi (EY network); key audit matter = related-party transactions', 'No accounting red flags.'],
      ['Board', 'Moderate', 'Half independent; non-executive chairman is the group founder; two Sumitomo nominees', 'Balanced between the partners; minority voice limited to the independents.'],
      ['Related-party flows', 'Weak', `~${Math.round(X.rpPurchPct)}% of purchases from the promoters; royalty + equal management fee (₹122 cr), support fees ₹151 cr, leases; FY27 ceilings ₹${n0(RP.fy27ApprovedSamil)} cr (SAMIL) and ₹${n0(RP.fy27ApprovedSws)} cr (SWS)`, 'The main governance risk: the cost base is set between related parties.'],
      ['Customer allocation', 'Moderate', 'Hyundai/Kia served by another SAMIL JV; customers decide sourcing, but the group decides which entity bids', 'Limits MSWIL\'s addressable market.'],
      ['Management pay', 'Strong', D.governance.pay, 'Modest for a ₹11,000 cr company; most management sits in SAMIL and is paid through the fees.'],
      ['Capital allocation', 'Strong', 'No acquisitions; capex only against firm orders; ~62% payout; no equity raised', 'Disciplined and shareholder-friendly.'],
      ['Continuity', 'Moderate', 'CFO resigned Jun-2025, successor from Jul-2025; senior management shared with SAMIL', 'No sign of disruption.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, related-party notes, Rule 5 annexure, auditor\'s report, AGM notice)' },
  ],
};

const gap = (g, s) => (g / s - 1) * 100;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n2}} / ₹{{F.eps.1|n2}} / ₹{{F.eps.2|n2}}, below the street',
  blocks: [
    { p: `Revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}} (existing plants +${n1(X.exGrowth[0])}% / +${n1(X.exGrowth[1])}% / +${n1(X.exGrowth[2])}%, greenfields ₹{{as.lineBuild.greenfield.0|num}} / {{as.lineBuild.greenfield.1|num}} / {{as.lineBuild.greenfield.2|num}} cr); EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}; capex ₹{{as.capex.0|num}} / {{as.capex.1|num}} / {{as.capex.2|num}} cr (incl. ~₹40 cr a year of new leased plant); depreciation 13.5% of gross block; finance cost ₹34 cr a year (mostly lease interest); tax 25.2%; payout 62%. EPS compounds ~${Math.round(epsCagrFwd)}% a year over FY26-29E against ${Math.round(epsCagrHist)}% over FY22-26, because FY26-27 is a margin trough rather than a new normal.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY22', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (post-Q1FY27 estimates standing on 30-Sep-2026)', head: ['', 'GAM', ...withEps.map(s => s.broker)], rows: [
      ['Revenue FY27E (₹ cr)', '{{F.sales.0|num}}', ...withEps.map(s => n0(s.revenue.FY27E))],
      ['Revenue FY28E (₹ cr)', '{{F.sales.1|num}}', ...withEps.map(s => n0(s.revenue.FY28E))],
      ['EBITDA margin FY27E', '{{F.ebitdaMargin.0|pct}}', ...withEps.map(s => s.ebitdaMarginPct.FY27E + '%')],
      ['EBITDA margin FY28E', '{{F.ebitdaMargin.1|pct}}', ...withEps.map(s => s.ebitdaMarginPct.FY28E + '%')],
      ['EPS FY27E (₹)', '{{F.eps.0|n2}}', ...withEps.map(s => n2(s.eps.FY27E))],
      ['EPS FY28E (₹)', '{{F.eps.1|n2}}', ...withEps.map(s => n2(s.eps.FY28E))],
      ['EPS FY29E (₹)', '{{F.eps.2|n2}}', ...withEps.map(s => (s.eps.FY29E ? n2(s.eps.FY29E) : '–'))],
      { hl: true, cells: ['**GAM vs street median, FY28E EPS**', `**${pc(gap(F.eps[1], medEps('FY28E')))}**`, ...withEps.map(() => '')] },
    ], source: 'MOSL (4-Aug-2026), Choice and Emkay (5-Aug-2026) result updates; EPS = PAT / 663.2 cr shares. ICICI Securities\' estimates were not visible to us; JM Financial (28-Apr-2026, pre-Q1): FY27E/28E EPS ₹1.06/1.45.' } },
    { callout: `Our FY28E EPS is ${pc(gap(F.eps[1], medEps('FY28E')))} vs the post-Q1 street median (₹${n2(medEps('FY28E'))}). Revenue is in the street\'s range (Emkay is highest); the gap is margin: we assume {{F.ebitdaMargin.1|pct}} for FY28E against 9.5-10.5%, because we do not assume the NCR wage increase is fully recovered or that copper resets shorten.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
