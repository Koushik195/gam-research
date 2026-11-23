// Hyundai Motor India report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./HYUNDAI.ctx');
const { C, D, F, A, n0, n1, rup, b, shortDate, withEps, avgEps } = X;
const Q = C.q1fy27, QK = C.quarterlyKpis, FY = C.fy26;
const yoy = (a, p) => X.pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: a fire, a war and a 35% fall in profit; guidance kept',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Volume (domestic + exports)', n0(QK[0].units), n0(QK[4].units), yoy(QK[4].units, QK[0].units)],
      ['  domestic / exports', `${n0(QK[0].domestic)} / ${n0(QK[0].exports)}`, `${n0(QK[4].domestic)} / ${n0(QK[4].exports)}`, `${yoy(QK[4].domestic, QK[0].domestic)} / ${yoy(QK[4].exports, QK[0].exports)}`],
      ['Revenue from operations', n0(Q.revenuePrior), n0(Q.revenue), yoy(Q.revenue, Q.revenuePrior)],
      ['EBITDA', n0(Q.ebitdaPrior), n0(Q.ebitda), yoy(Q.ebitda, Q.ebitdaPrior)],
      ['EBITDA margin', `${Q.ebitdaMarginPriorPct}%`, `${Q.ebitdaMarginPct}%`, '−400bp'],
      ['Depreciation', n0(Q.depPrior), n0(Q.dep), yoy(Q.dep, Q.depPrior)],
      ['Other income', n0(Q.otherIncomePrior), n0(Q.otherIncome), yoy(Q.otherIncome, Q.otherIncomePrior)],
      { hl: true, cells: ['**Net profit / EPS (₹)**', `**${n0(Q.patPrior)} / ${Q.epsPrior}**`, `**${n0(Q.pat)} / ${Q.eps}**`, `**${yoy(Q.pat, Q.patPrior)}**`] },
    ], source: 'Q1FY27 investor presentation and call (30-Jul-2026); Screener.in' } },
    { bullets: Q.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (May-2026 to Jul-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome || '–')]), source: 'Hyundai Motor India calls (8-May-2026, 30-Jul-2026); Business Today, Autocar Pro' } },
    { callout: '**Why it matters:** management has a mixed record on guidance. It beat its FY26 export guide (+16.4% vs 7-8%) but missed on domestic volume (−2.3%) and has kept a wide 11-14% margin band that Q1FY27 fell below. To hit the bottom of the band, Q2-Q4 must average ~11.5%; our FY27E ({{F.ebitdaMargin.0|pct}}) assumes exactly that.' },
  ],
};

const RP = FY.relatedPartyPurchasesMn, rpTot = Object.entries(RP).filter(([k2]) => k2 !== 'totalPurchasesAll').reduce((s, [, v]) => s + v, 0);
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts and strong cash, but the parent takes its share first',
  blocks: [
    { bullets: [
      `**Cash backs profit.** Operating cash flow was ${Math.round(A.cfoToPat[b])}% of net profit in FY26 and ${Math.round(A.cfoToPat[b - 1])}% in FY25 (working capital and taxes); over FY21-FY26 it averaged well above 100% because suppliers fund inventory.`,
      `**Royalty.** HMIL paid HMC ₹${n0(FY.royaltyMn / 10)} cr in FY26 (₹${n0(FY.royaltyPriorMn / 10)} cr in FY25), ~2.8% of revenue and ~${Math.round(FY.royaltyMn / 10 / (A.pbt[b] + FY.royaltyMn / 10) * 100)}% of pre-royalty profit before tax. It rises with sales; its terms (rate base, duration) are not disclosed in the annual report.`,
      `**Related-party purchases.** ~₹${n0(rpTot / 10)} cr (${Math.round(rpTot / RP.totalPurchasesAll * 100)}% of purchases) came from group companies (Mobis India alone ₹${n0(RP['Mobis India'] / 10)} cr). Prices are said to be at arm's length and are approved by shareholders, but outsiders cannot test them.`,
      '**Incentives in revenue.** ₹1,372 cr of export and state incentives (duty drawback, RoDTEP, Tamil Nadu and Maharashtra schemes) sit in operating revenue: real cash, but policy-dependent (~16% of FY26 EBITDA).',
      '**Other income** is mostly interest on deposits (₹547 cr) plus exchange gains (₹133 cr in FY26) that we do not forecast.',
      `**Contingent liabilities.** ${rup(FY.contingent)} None is provided for; all are under appeal.`,
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit by BSR & Co. LLP, a simple balance sheet, net cash and no aggressive capitalisation visible. The watch items are governance, not accounting: the royalty, related-party purchases and old regulatory disputes.' },
  ],
};

const OH = D.ownership, CT = OH.categories;
const ownership = base => ({ ...base, blocks: [
  { p: `Hyundai Motor Company owns ${CT.promoters}% (Jun-2026), unpledged. The 17.5% float is held by mutual funds (${CT.mutualFunds}%), insurers (${CT.insurance}%), foreign portfolio investors (${CT.fpi}%, down from 7.3% in Sep-2025) and ${n0(OH.shareholders)} retail and other holders (${CT.retailAndOthers}%). Foreign funds have halved their stake in a year while Indian funds bought: the stock now trades on domestic flows.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: [...OH.named.map(([h, p]) => [h, p + '%']), ['Mutual funds (all)', CT.mutualFunds + '%'], ['Insurance companies', CT.insurance + '%'], ['Foreign portfolio investors', CT.fpi + '%'], ['Retail and others', CT.retailAndOthers + '%']], source: 'BSE shareholding pattern via Screener.in and Trendlyne. Holders above 1% other than HMC could not be retrieved for Jun-2026 (see gaps).' } },
  { callout: '**Our read:** HMC can sell down to 75% (minimum public float rules give it time) and has a history of taking cash out (FY24 dividends, the IPO). Any further sale is an overhang; any buyback or higher payout would be a positive. Neither was announced by 30-Sep-2026.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: professional and clean, but run for the parent as much as for minorities',
  blocks: [
    { p: rup(FY.board) },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor + '; one segment; simple balance sheet.', 'No accounting red flags.'],
      ['Board', 'Moderate', 'Four independent directors; four executive directors (MD & CEO, CFO, COO and Chief Manufacturing Officer; the CFO and COO are from HMC).', 'Independent, but HMC controls strategy.'],
      ['Parent and pledges', 'Moderate', '82.5% held by HMC, nil pledged; HMC sold 17.5% in the IPO and took ~₹15,400 cr of dividends in FY24.', 'Aligned on value, but the parent has shown it will extract cash.'],
      ['Management', 'Strong', 'Tarun Garg MD & CEO since 1-Jan-2026 (the first Indian MD); CFO Wangdo Hur.', 'Continuity; local leadership.'],
      ['Pay', 'Strong', rup(FY.pay), 'Modest by Indian standards.'],
      ['Related parties and royalty', 'Watch', rup(D.governance.relatedParty), 'The main governance risk for minority holders.'],
      ['Capital allocation', 'Moderate', rup(D.governance.capitalAllocation), 'Disciplined spending, but cash has gone to the parent first.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, notes 35 and 37); Business Standard (Mar-2025); shareholding pattern' },
  ],
};

const st = nm => withEps.find(s => s.broker.startsWith(nm));
const isec = st('ICICI'), jm = st('JM'), nb = st('Nirmal'), bob = st('BOB');
const gap = (g2, s) => Math.round((g2 / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: EPS back to ₹${Math.round(F.eps[2])} by FY29E, a little below the street`,
  blocks: [
    { p: 'We forecast volume (domestic + exports, built separately) × revenue per vehicle, an EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, capex of ₹7,500 / 8,500 / 8,500 cr with depreciation at 6.2% of gross block, other income of ~5.8% on net cash plus ~₹300 cr of royalty received, rent and other items, tax of 25.8% and a 32% payout. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Volume (vehicles)', ref: 'kpi.units' }, { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), ICICI Securities (31-Jul-26)', '{{F.eps.0|n1}}', n1(isec.eps.FY27E), '{{F.eps.1|n1}}', n1(isec.eps.FY28E)],
      ['EPS (₹), JM Financial (30-Jul-26)', '{{F.eps.0|n1}}', n1(jm.eps.FY27E), '{{F.eps.1|n1}}', n1(jm.eps.FY28E)],
      ['EPS (₹), BOB Caps (31-Jul-26)', '{{F.eps.0|n1}}', n1(bob.eps.FY27E), '{{F.eps.1|n1}}', n1(bob.eps.FY28E)],
      ['EPS (₹), Nirmal Bang (31-Jul-26)', '{{F.eps.0|n1}}', n1(nb.eps.FY27E), '{{F.eps.1|n1}}', n1(nb.eps.FY28E)],
      ['EPS (₹), Bloomberg consensus (via BOB Caps)', '{{F.eps.0|n1}}', n1(D.street.consensus.FY27E), '{{F.eps.1|n1}}', n1(D.street.consensus.FY28E)],
      ['Revenue (₹ cr), Nirmal Bang / BOB Caps', '{{F.sales.0|num}}', '79,212 / 73,640', '{{F.sales.1|num}}', '89,654 / 84,145'],
      ['EBITDA margin, Nirmal Bang / BOB Caps / Nomura', '{{F.ebitdaMargin.0|pct}}', '11.0% / 12.1% / 11.5%', '{{F.ebitdaMargin.1|pct}}', '11.4% / 13.3% / 12.7%'],
    ], source: 'ICICI Direct, JM Financial, BOB Caps and Nirmal Bang Q1FY27 notes (PDFs); Nomura via Aliceblue (24-Aug-2026)' } },
    { callout: `Our FY27E EPS is ${Math.abs(gap(F.eps[0], avgEps('FY27E')))}% ${F.eps[0] >= avgEps('FY27E') ? 'above' : 'below'} the average of the brokers that publish EPS and FY28E ${Math.abs(gap(F.eps[1], avgEps('FY28E')))}% ${F.eps[1] >= avgEps('FY28E') ? 'above' : 'below'}. Our revenue and margins are within the street's range; the gap is mostly depreciation: we charge the ₹7,500-8,500 cr a year of capex at once (6.2% of gross block), so FY28E depreciation is ~₹${n0(F.dep[1])} cr, a quarter above FY26.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
