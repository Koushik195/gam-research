// Bharat Petroleum report, part 4: Q1FY27, earnings quality, ownership, governance, our forecasts vs the street.
const X = require('./BPCL.ctx');
const { C, D, F, n0, n1, medTp, epsSep, ebSep } = X;
const QS = C.q1fy27.standalone, QC = C.q1fy27.consolidated, CALL = C.q1fy27.call, LPG = C.q1fy27.lpg, OP = X.SG.operating, qm = X.M.quarterly, qi = qm.labels.length - 1;
const qv = (k, lab) => qm[k][qm.labels.indexOf(lab)];

const quarter = {
  id: 'q1fy27', nav: 'Q1FY27 and what we know of FY27', kicker: 'Latest quarter', title: 'Q1FY27: refining earned US$41/bbl, marketing lost ₹5.4/litre, and the group lost money',
  blocks: [
    { p: `In the Jun-2026 quarter crude averaged ~US$100/bbl and retail prices rose only from the second half of May. Standalone EBITDA was a loss of ~₹4,080 cr (incl. a ₹346 cr FX gain and a ₹3,134 cr marketing inventory gain) and BPCL lost ₹${n0(-QS.pat)} cr (EPS ₹${QS.eps}). The group lost ₹${n0(-QC.pat)} cr (EPS ₹${QC.eps}) only because of a one-off ₹${n0(QC.exceptional)} cr gain when IBV Brasil became a subsidiary; without it the group loss was ~₹3,750 cr. Refining was very strong but taxed: GRM US$${QS.grm}/bbl before the special export duty, US$${QS.grmNetOfSaed} after. Throughput ${QS.throughput} MMT (−2.6% YoY), domestic sales ${QS.domesticSales} MMT (+0.3%), LPG sales −21%. Standalone debt rose from ₹${n0(QS.debtMar26)} cr to ₹${n0(QS.debt)} cr (excluding leases).` },
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27'], rows: [
      ['Revenue, consolidated net (₹ cr)', n0(qv('sales', 'Q1FY26')), n0(qv('sales', 'Q4FY26')), n0(qm.sales[qi])],
      ['EBITDA, consolidated (₹ cr)', n0(qv('ebitda', 'Q1FY26')), n0(qv('ebitda', 'Q4FY26')), n0(qm.ebitda[qi])],
      ['Net profit, consolidated (₹ cr)', n0(qv('pat', 'Q1FY26')), n0(qv('pat', 'Q4FY26')), n0(qm.pat[qi])],
      ['Standalone net profit (₹ cr)', '6,124', '3,191', n0(QS.pat)],
      ['GRM before SAED (US$/bbl)', String(OP.Q1FY26.grm), String(OP.Q4FY26.grm), `${QS.grm} (${QS.grmNetOfSaed} after SAED)`],
      ['Refinery throughput (MMT)', String(OP.Q1FY26.throughput), String(OP.Q4FY26.throughput), String(OP.Q1FY27.throughput)],
      ['Domestic sales (MMT)', String(OP.Q1FY26.domSales), String(OP.Q4FY26.domSales), String(OP.Q1FY27.domSales)],
      ['Marketing inventory gain/(loss) (₹ cr)', '(835)', '1,275', n0(QS.marketingInventoryGain)],
      ['Standalone debt excl. leases (₹ cr)', '10,709', n0(QS.debtMar26), n0(QS.debt)],
    ], source: 'Screener.in (consolidated); BPCL Q1FY27 handout (22-Jul-2026); PL (net GRM)' } },
    { exhibit: { type: 'table', title: 'What management said after Q1 (known by 30-Sep)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['Crude sourcing', CALL.crude], ['Refining', CALL.refining], ['Marketing', CALL.marketing], ['LPG', `Under-recovery ~₹510/cylinder in Q1 (₹${n0(LPG.underRecoveryGross)} cr gross), ₹490 in July, ~₹210 expected in August as Saudi CP fell; negative buffer ₹${n0(LPG.bufferJun26)} cr at Jun-26.`], ['Projects', CALL.projects], ['Upstream', CALL.upstream], ['Capex and debt', CALL.capex],
    ], source: 'PL and Motilal Oswal Q1FY27 notes (23-Jul-2026; BPCL published a call recording, not a transcript); Q4FY26 call (20-May-2026)' } },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: inventory gains, compensation timing, impairments and a one-off FCTR gain',
  blocks: [
    { p: 'The accounts are audited by C&AG-appointed firms and are unqualified, but five items make reported profit a poor guide to the run-rate: (1) **inventory gains and losses**: BPCL carries ~₹53,000 cr of inventory, so a big crude move swings profit by thousands of crores (marketing inventory gain ₹3,134 cr in Q1FY27; BPCL stopped disclosing refinery inventory effects years ago); (2) **LPG compensation**: the ₹7,594 cr approved in Oct-2025 is booked in monthly instalments while the ₹15,804 cr negative buffer is not on the balance sheet; (3) **upstream impairments**: ₹1,774 cr (FY25) and ₹4,349 cr (FY26) at standalone level; (4) **one-offs**: a ₹1,885 cr FCTR gain in Q1FY27 consolidated profit; a ₹3,783 cr after-tax exceptional gain in FY21; (5) Screener adds **exceptional items** to other income. We also use BPCL\'s own share count (427.26 cr, excluding the 6.59 cr treasury shares in the BPCL Trust for Investment in Shares).' },
    { exhibit: { type: 'table', title: 'From Screener to our basis', head: ['', 'Value', 'Note'], wide: [2], rows: [
      ['FY26 net profit (consolidated, no minorities)', '₹25,843 cr', 'Screener = company'],
      ['Shares (cr): in issue / outside the trust', '433.85 / 427.26', 'BPCL reports EPS on 427.26 cr'],
      ['FY26 EPS: Screener / BPCL / ours (₹)', '59.57 / 60.49 / 60.49', 'BPCL.patch.js'],
      ['Q1FY27 EPS: Screener / BPCL / ours (₹)', '−4.32 / −4.38 / −4.39', 'Rounding'],
      ['Q1FY27 other income incl. the FCTR gain', '₹3,535 cr', 'Of which ₹1,885 cr one-off'],
      ['FY26 standalone vs consolidated PAT', '₹23,303 cr vs ₹25,843 cr', 'Brazil impairment hits the standalone investment'],
    ], source: 'AR FY26 statements and EPS note; Screener.in; Q1FY27 results coverage; GAM' } },
    { callout: '**Our approach:** forecasts carry no inventory gains or losses, no exceptional items and no FX gains or losses; LPG compensation is assumed to offset under-recoveries only partially (inside our ₹/tonne margin). We value the cycle, not a quarter.' },
  ],
};

const OH = D.ownership, CT = OH.categories;
const ownership = base => ({ ...base, blocks: [
  { p: `The Government of India (President of India) owns ${CT.promoters}% and the Government of Kerala ${CT.government}%. In Jun-2026 foreign funds held ${CT.fii}% (19.6% in Mar-2026) and Indian institutions ${CT.dii}% (insurers 8.2% and mutual funds 8.1% at Mar-2026); ${n0(OH.shareholders)} shareholders hold the rest. 1.52% sits in the BPCL Trust for Investment in Shares (treasury shares). The free float is ~45%. A Government offer for sale is possible (it has to keep 51%), but there is little room above that line.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding', head: ['Holder', 'Stake'], wide: [0], rows: [...OH.named.map(([h, p]) => [h, p.toFixed(2) + '%']), ['Foreign portfolio investors (Jun-26)', CT.fii + '%'], ['Domestic institutions (Jun-26)', CT.dii + '%'], ['Retail and others (Jun-26)', CT.public + '%']], source: 'BSE shareholding pattern via Screener.in (Jun-2026); holder categories from AR FY26 (31-Mar-2026).' } },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: capable operators, but no independent directors and a controlling shareholder that sets prices',
  blocks: [
    { p: D.governance.board },
    { verdicts: [
      ['Board independence', 'Weak', D.governance.independentDirectors, 'A listed company without an audit committee is a basic failure; appointments are the Ministry\'s.'],
      ['Audit and accounts', 'Moderate', 'C&AG-appointed auditors; unqualified; upstream carried at book after two impairments.', 'Clean, but inventory, compensation timing and one-offs need adjusting.'],
      ['Minority alignment', 'Weak', D.governance.pricing, 'The state is both owner and price-setter.'],
      ['Related parties', 'Watch', D.governance.relatedParty, 'Large, but mostly JVs with other PSUs.'],
      ['Capital allocation', 'Moderate', 'IREP (Kochi) and Bina delivered returns; Brazil upstream impaired twice; a 12-15% portfolio IRR hurdle; net debt kept low in FY24-FY26.', 'Growth over payouts from FY27.'],
      ['Disclosure', 'Good for a PSU', 'Quarterly GRM, refinery-wise throughput, handout of key figures; no refining/marketing split; Q1FY27 call recording only.', 'Better than IOC on GRM.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; Q1FY27 results coverage; calls; July-2026 presentation' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: EPS ₹${n1(F.eps[0])} in FY27E, ₹${n1(F.eps[1])} in FY28E, ₹${n1(F.eps[2])} in FY29E`,
  blocks: [
    { p: 'We forecast two segments. Downstream = domestic sales volume × realisation (revenue) and volume × EBITDA per tonne; E&P at a flat ~₹400 cr a year of pre-production cost. Capex ₹26,000 / 30,000 / 30,000 cr; depreciation at 5.4% of gross block; other income (interest, dividends, JV profits) ₹4,800-5,200 cr; finance cost ₹3,000-3,800 cr; tax 26%; payout 40% in FY27E (the DIPAM floor of 4% of net worth binds), 30% after. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026; consolidated)', head: ['', 'GAM', 'PL (23-Jul)', 'MOSL (23-Jul)', 'JM (20-May)'], rows: [
      ['FY27E EPS (₹)', '{{F.eps.0|n1}}', '11.7', '33', '28.4'],
      ['FY28E EPS (₹)', '{{F.eps.1|n1}}', '27.7', '40', '35.3'],
      ['FY27E EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '11,700', '21,500', '24,460'],
      ['FY28E EBITDA (₹ cr)', '{{F.ebitda.1|num}}', '23,700', '27,600', '29,947'],
    ], source: 'Broker notes as cited in the street table; GAM Research. MOSL EPS on 427 cr shares; PL and JM on 433.85 cr.' } },
    { callout: `**Where we differ:** our FY28E EBITDA (₹${n0(F.ebitda[1])} cr) and EPS (₹${n1(F.eps[1])}) sit at the upper end of the three notes we read (EBITDA just above JM, EPS just below Motilal Oswal); PL is far lower on FY27E because it assumes weak marketing margins all year. Our Sep-28E downstream EBITDA of ₹${n0(ebSep)} cr and EPS of ₹${n1(epsSep.base)} are not the reason our target is near the price rather than at the street median (₹${n0(medTp)}): the multiple is (next chapters).` },
  ],
};

module.exports = { quarter, quality, ownership, governance, forecasts };
