// HPCL report, part 4: Q1FY27, earnings quality, ownership, governance, our forecasts vs the street.
const X = require('./HINDPETRO.ctx');
const { C, D, F, ST, n0, n1, medTp, epsSep, ebSep } = X;
const QS = C.q1fy27.standalone, QC = C.q1fy27.consolidated, CALL = C.q1fy27.call, qm = X.M.quarterly, qi = qm.labels.length - 1;
const qv = (k, lab) => qm[k][qm.labels.indexOf(lab)];

const quarter = {
  id: 'q1fy27', nav: 'Q1FY27 and what we know of FY27', kicker: 'Latest quarter', title: 'Q1FY27: a ₹12,265 cr loss, the first in 14 quarters, as retail prices lagged US$100 crude',
  blocks: [
    { p: `In the Jun-2026 quarter Brent averaged ~US$105/bbl (US$76 in Q4FY26) and retail prices rose only in tranches. Refining boomed (GRM US$${QS.grm}/bbl before the export duty, from US$3.1 a year earlier), but marketing lost far more: the implied marketing margin was −₹${Math.abs(QS.impliedGmm)}/litre (PL), and under-recoveries topped ₹26,000 cr. Standalone EBITDA was −₹${n0(-QS.ebitda)} cr and the standalone loss ₹${n0(-QS.pat)} cr after a tax credit; the consolidated loss was ₹${n0(-QC.pat)} cr (EPS −₹${Math.abs(QC.eps)}), with only ₹${QS.jvShare} cr from the JVs. Inventory write-downs on crude deliberately stocked up to keep the refineries running added to the loss. Volumes held: throughput ${QS.throughput} MMT, sales ${QS.salesTotal} MMT (exports ${QS.exports} MMT, +54% QoQ). Gross debt rose from ₹${n0(QS.debtMar26)} cr to ₹${n0(QS.debt)} cr in the quarter.` },
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27'], rows: [
      ['Revenue, consolidated net (₹ cr)', n0(qv('sales', 'Q1FY26')), n0(qv('sales', 'Q4FY26')), n0(qm.sales[qi])],
      ['EBITDA, consolidated (₹ cr)', n0(qv('ebitda', 'Q1FY26')), n0(qv('ebitda', 'Q4FY26')), n0(qm.ebitda[qi])],
      ['Net profit, consolidated (₹ cr)', n0(qv('pat', 'Q1FY26')), n0(qv('pat', 'Q4FY26')), n0(qm.pat[qi])],
      ['Standalone EBITDA (₹ cr)', n0(QS.ebitdaQ1FY26), n0(QS.ebitdaQ4FY26), n0(QS.ebitda)],
      ['GRM (US$/bbl)', '3.1', '14.3', `${QS.grm} (before export duty)`],
      ['Implied marketing margin (₹/litre, PL)', '7.0', '6.3', String(QS.impliedGmm)],
      ['Refinery throughput (MMT)', '6.7', '6.4', String(QS.throughput)],
      ['Market sales incl. exports (MMT)', '13.0', '13.0', String(QS.salesTotal)],
      ['Gross debt, period end (₹ cr)', '–', n0(QS.debtMar26), n0(QS.debt)],
    ], source: 'Screener.in (consolidated); PL (24-Jul-2026), BOB (23-Jul-2026), Emkay (24-Jul-2026)' } },
    { exhibit: { type: 'table', title: 'What management said on the Q1 call (22-23 Jul-2026; known by 30-Sep)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['Under-recoveries', CALL.underRecovery], ['LPG buffer', CALL.lpgBuffer], ['Inventory', CALL.inventory], ['Crude', CALL.crude], ['HRRL', CALL.hrrl], ['Vizag upgrade', CALL.rug], ['Sourcing', CALL.sourcing], ['Capex', CALL.capex], ['Costs', CALL.samriddhi], ['Balance sheet', CALL.balanceSheet],
    ], source: 'Q1FY27 call as reported by PL and Emkay (24-Jul-2026), MOSL (23-Jul-2026) and sahi.com' } },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: inventory swings, an off-balance-sheet LPG buffer and JV debt',
  blocks: [
    { p: 'The accounts are audited by C&AG-appointed firms and are unqualified, but four items make reported profit a poor guide to the run-rate: (1) **inventory gains and losses**: HPCL carries ~₹40,000 cr of inventory (₹39,584 cr at Mar-26), so a sharp move in crude swings profit by thousands of crores (Q1FY27 had write-downs on deliberately high crude stocks); (2) **LPG compensation**: the ₹7,920 cr conveyed in Oct-2025 is booked in monthly instalments (₹3,300 cr in FY26) while the negative buffer (₹16,410 cr at Jun-2026) is not recognised; (3) **exchange losses** (₹2,490 cr in FY26 per PL) sit inside EBITDA; (4) **equity-accounted JVs**: HRRL, HMEL and MRPL reach the P&L as one line of "share of profit" (inside Screener\'s other income) while their debt (HRRL ~₹53,000 cr, HMEL ~₹38,100 cr net) stays off HPCL\'s balance sheet.' },
    { exhibit: { type: 'table', title: 'Reconciling FY26 (₹ crore)', head: ['', '₹ crore', 'Note'], wide: [2], rows: [
      ['Segment EBIT, downstream petroleum', n0(C.business.segmentFY26.dpEbit), 'AR consolidated note 60'],
      ['Add: segment depreciation', n0(C.business.segmentFY26.dpDa), ''],
      ['Other segments and adjustments (EBIT)', n0(C.business.segmentFY26.othEbit + C.business.segmentFY26.unallocAdj), 'E&P, biofuels, eliminations'],
      { hl: true, cells: ['**Screener EBITDA (our basis)**', `**${n0(X.A.ebitda[X.b])}**`, 'Excludes other income (~₹524 cr of dividends etc. sit in segment EBIT)'] },
      ['Interest income', n0(C.business.segmentFY26.interestIncome), 'Inside Screener other income'],
      ['Share of JV and associate profit', n0(C.business.segmentFY26.jvShare), 'HMEL, MRPL, HRRL and others'],
      ['Capex FY26: Screener "fixed assets purchased" / company (standalone)', `${n0(X.A.capex[X.b])} / ${n0(C.business.fy26.capexStandalone)}`, 'Capital advances not in Screener\'s line; total capex incl. JVs ₹15,705 cr'],
    ], source: 'AR FY26 consolidated statements and note 60; Screener.in; GAM' } },
    { callout: '**Our approach:** forecasts carry no inventory gains or losses and no exceptional items; FX losses and LPG compensation are inside our ₹/tonne margin; JV profits are in other income (₹500-1,200 cr a year as HRRL ramps up). Engine limit: the model books no tax credit on a loss (Q1 had a ₹5,905 cr credit), so we set the FY27E tax rate at 0% (keeping the report and the Excel model identical); FY27E net profit is ~₹1,400 cr worse than a 25% credit would give and Sep-27E net debt ~₹1,370 cr higher (~₹6 a share on the target).' },
  ],
};

const OH = D.ownership, CT = OH.categories;
const ownership = base => ({ ...base, blocks: [
  { p: `ONGC owns ${CT.promoters}% and has not sold since it bought the Government's stake in 2018; the Government controls HPCL through ONGC. Domestic institutions (mainly mutual funds) hold ${CT.dii}% and foreign funds ${CT.fii}% (Jun-2026; they had raised their stake to 17.3% in Mar-2026, then sold during the war); ${n0(OH.shareholders)} shareholders hold the rest. The free float is ~45%. ONGC has no reason to sell, but HPCL's losses weigh on ONGC (the ONGC initiation treats HPCL as a listed stake at market less a holding discount).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding', head: ['Holder', 'Stake'], wide: [0], rows: [...OH.named.map(([h, p]) => [h, p.toFixed(2) + '%']), ['Foreign portfolio investors (Jun-26)', CT.fii + '%'], ['Domestic institutions (Jun-26)', CT.dii + '%'], ['Retail and others (Jun-26)', CT.public + '%']], source: 'BSE shareholding pattern via Screener.in (Jun-2026); categories at 31-Mar-2026 from AR FY26.' } },
] });

const G = C.governance;
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: an experienced team, one independent director, and two state owners above it',
  blocks: [
    { p: `${G.board} ${G.cfoChange}` },
    { verdicts: [
      ['Board independence', 'Weak', G.independence, 'One independent director on an 8-member board; appointments are the Ministry\'s.'],
      ['Audit and accounts', 'Moderate', G.auditCag, 'Clean opinion; inventory, LPG and JV accounting need adjusting.'],
      ['Minority alignment', 'Weak', 'Retail prices set with the Government; ONGC (the parent) is itself state-controlled; minority shareholders bear under-recoveries until compensated.', 'The state is owner, price-setter and taxer.'],
      ['Related parties', 'Watch', `₹${n0(C.investments.hmel.purchasesFromHmelFY26)} cr of product bought from HMEL in FY26; loans to HRRL; transactions with ONGC/MRPL.`, 'Large, mostly with JVs and group companies.'],
      ['Capital allocation', 'Weak-moderate', 'HRRL cost nearly doubled and came ~4 years late; Visakh delivered; FY27 capex capped at ₹9,700 cr to protect the balance sheet.', 'Policy-driven projects; returns unproven.'],
      ['Disclosure', 'Moderate', 'Quarterly GRM, calls and presentations; no refining/marketing split; HRRL accounts not consolidated.', 'Investors must back out the marketing margin.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (board report, secretarial audit); Q1FY27 call; GAM' },
  ],
};

const by = b => ST.find(s => s.broker.startsWith(b));
const est = (b, k, fy) => { const v = by(b)?.[k]?.[fy]; return v == null ? '–' : k === 'eps' ? v.toFixed(1) : n0(v); };
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: EPS ₹${n1(F.eps[0])} in FY27E, ₹${n1(F.eps[1])} in FY28E, ₹${n1(F.eps[2])} in FY29E`,
  blocks: [
    { p: 'We forecast one segment: revenue = market sales × realisation, EBITDA = market sales × EBITDA per tonne. Capex ₹9,000 / 11,000 / 11,000 cr; depreciation at 5.4% of gross block; other income (interest, dividends, JV profits) ₹2,600-3,200 cr; finance cost ₹3,800-3,400 cr; tax 25.2% from FY28E (none booked on the FY27E loss); no FY27E dividend, then 30% payout. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM', 'PL (24-Jul)', 'BOB (23-Jul)', 'Emkay (24-Jul, standalone)', 'MOSL (23-Jul)'], rows: [
      ['FY27E EPS (₹)', '{{F.eps.0|n1}}', est('Prabhudas', 'eps', 'FY27E'), est('BOB', 'eps', 'FY27E'), est('Emkay', 'eps', 'FY27E'), `${n1(by('Motilal').pat.FY27E / X.shares)} (PAT ₹${n0(by('Motilal').pat.FY27E)} cr)`],
      ['FY28E EPS (₹)', '{{F.eps.1|n1}}', est('Prabhudas', 'eps', 'FY28E'), est('BOB', 'eps', 'FY28E'), est('Emkay', 'eps', 'FY28E'), `${n1(by('Motilal').pat.FY28E / X.shares)} (PAT ₹${n0(by('Motilal').pat.FY28E)} cr)`],
      ['FY27E EBITDA (₹ cr)', '{{F.ebitda.0|num}}', est('Prabhudas', 'ebitda', 'FY27E'), est('BOB', 'ebitda', 'FY27E'), est('Emkay', 'ebitda', 'FY27E'), est('Motilal', 'ebitda', 'FY27E')],
      ['FY28E EBITDA (₹ cr)', '{{F.ebitda.1|num}}', est('Prabhudas', 'ebitda', 'FY28E'), est('BOB', 'ebitda', 'FY28E'), est('Emkay', 'ebitda', 'FY28E'), est('Motilal', 'ebitda', 'FY28E')],
    ], source: 'Broker notes as cited in the street table; GAM Research. Consolidated except Emkay; MOSL EPS = PAT ÷ 212.78 cr shares.' } },
    { callout: `**Where we differ:** our earnings are inside the street's range; our valuation is not. Our Sep-28E EBITDA of ₹${n0(ebSep)} cr and EPS of ₹${n1(epsSep.base)} sit between Emkay/BOB and PL/MOSL. The gap to the street's targets (median ₹${n0(medTp)}) is the multiple: 6x standalone EBITDA vs our ${X.MULT.base}x derived from HPCL's own history and the sector (next chapters).` },
  ],
};

module.exports = { quarter, quality, ownership, governance, forecasts };
