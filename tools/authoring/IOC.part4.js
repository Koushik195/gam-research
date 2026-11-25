// Indian Oil report, part 4: Q1FY27, earnings quality, ownership, governance, our forecasts vs the street.
const X = require('./IOC.ctx');
const { C, D, F, Q1, ST, n0, n1, medTp, epsSep, ebSep } = X;
const QS = C.q1fy27.standalone, QC = C.q1fy27.consolidated, CALL = C.q1fy27.call, qm = X.M.quarterly, qi = qm.labels.length - 1;
const qv = (k, lab) => qm[k][qm.labels.indexOf(lab)];

const quarter = {
  id: 'q1fy27', nav: 'Q1FY27 and what we know of FY27', kicker: 'Latest quarter', title: 'Q1FY27: a loss at US$100 crude, cushioned by a ~₹15,000 cr inventory gain',
  blocks: [
    { p: `In the Jun-2026 quarter the Indian crude basket averaged US$100.74/bbl (US$83.01 in Q4FY26) and retail prices rose only in tranches. Standalone EBITDA collapsed to ₹${n0(QS.ebitda)} cr (₹22,345 cr in Q4FY26) and IOC lost ₹${n0(-QS.pat)} cr; the group lost ₹${n0(-QC.patOwners)} cr for shareholders (EPS ₹${QC.eps}) after CPCL's refining profits (minorities took ₹${n0(QC.minorities)} cr). Without a ~₹15,000 cr gain on finished-goods inventory, the loss would have been several times larger. Refining was strong but taxed: GRM US$15.59/bbl after the export duty (US$36 before it). Volumes held: throughput 19.2 MMT (109% utilisation), sales 26.2 MMT, record pipeline throughput 28.5 MMT. Borrowings rose ₹${n0(QS.debt - QS.debtMar26)} cr in the quarter to ₹${n0(QS.debt)} cr.` },
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27'], rows: [
      ['Revenue, consolidated net (₹ cr)', n0(qv('sales', 'Q1FY26')), n0(qv('sales', 'Q4FY26')), n0(qm.sales[qi])],
      ['EBITDA, consolidated (₹ cr)', n0(qv('ebitda', 'Q1FY26')), n0(qv('ebitda', 'Q4FY26')), n0(qm.ebitda[qi])],
      ['Net profit to owners (₹ cr)', n0(qv('pat', 'Q1FY26')), n0(qv('pat', 'Q4FY26')), n0(qm.pat[qi])],
      ['Standalone EBITDA (₹ cr)', '–', '22,345', n0(QS.ebitda)],
      ['GRM (US$/bbl)', '2.2', 'not disclosed', '15.59 (36 before SAED)'],
      ['Refinery throughput (MMT)', '18.7', '19.7', '19.2'],
      ['Total sales (MMT)', '26.33', '27.34', '26.21'],
      ['Standalone borrowings, period end (₹ cr)', '–', n0(QS.debtMar26), n0(QS.debt)],
    ], source: 'Screener.in (consolidated); Q1FY27 presentation and call (1-Aug-2026); NSE iXBRL consolidated results (31-Jul-2026)' } },
    { exhibit: { type: 'table', title: 'What management said on 1-Aug-2026 (known by 30-Sep)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['LPG', CALL.lpg], ['Crude sourcing', CALL.crude], ['Inventory', CALL.inventory], ['Throughput', CALL.throughputGuide], ['Projects', CALL.projects], ['Capex', CALL.capexOutlook], ['Costs', CALL.sprint], ['Debt', CALL.borrowings],
    ], source: 'Q1FY27 earnings call transcript (1-Aug-2026)' } },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: inventory gains, compensation timing and FX move profit by thousands of crores',
  blocks: [
    { p: 'The accounts are audited by C&AG-appointed firms and are unqualified, but four items make reported profit a poor guide to the run-rate: (1) **inventory gains and losses**: IOC carries ~₹1.2 lakh cr of inventory, so a US$10/bbl move in crude swings profit by thousands of crores (Q1FY27: ~₹15,000 cr finished-goods gain, crude loss of US$3-4/bbl); (2) **LPG compensation**: the ₹14,486 cr approved in Oct-2025 is booked in monthly instalments (₹6,036 cr in FY26, ₹3,622 cr in Q1FY27) while the cumulative negative buffer of ₹29,730 cr is not on the balance sheet; (3) **exchange losses** of ₹8,331 cr in FY26 sit outside segment results; (4) Screener adds **exceptional items** (₹1,945 cr in FY25) to other income. Screener also shows profit before minorities; we use profit to owners and IOC\'s own share count (1,377.16 cr, excluding the 34.97 cr treasury shares in the IOC Shares Trust).' },
    { exhibit: { type: 'table', title: 'From Screener to our basis (FY26, ₹ crore)', head: ['', '₹ crore', 'Note'], wide: [2], rows: [
      ['Net profit (Screener, before minorities)', '43,677', 'Includes 100% of CPCL'],
      ['Less: minorities', '−1,581', '48.11% of CPCL, 25% of Lanka IOC'],
      { hl: true, cells: ['**Profit to owners**', '**42,096**', 'Our "net profit"'] },
      ['Shares (cr): in issue / outside the trust', '1,412.12 / 1,377.16', 'IOC reports EPS on 1,377.16 cr'],
      ['EPS: Screener / IOC / ours (₹)', '29.81 / 30.57 / 30.57', 'IOC.patch.js'],
      ['Capex FY26: Screener "fixed assets purchased" / incl. CWIP', '4,002 / 28,362', 'CWIP spending added back (IOC.patch.js)'],
    ], source: 'AR FY26 consolidated statements, EPS note; Screener.in; GAM' } },
    { callout: '**Our approach:** forecasts carry no inventory gains or losses, no exceptional items and ₹1,500 cr a year of FX losses; LPG compensation is assumed to continue to offset under-recoveries only partially (inside our ₹/tonne margin). We value the cycle, not a quarter.' },
  ],
};

const OH = D.ownership, CT = OH.categories;
const ownership = base => ({ ...base, blocks: [
  { p: `The Government of India (President of India) owns ${CT.promoters}% and has not sold since the bonus; ONGC (14.20%) and Oil India (5.16%), both government-controlled, bring state-related ownership to ~71% (Screener's "government" category ${CT.government}%). LIC owned 6.04% at Mar-2026. Foreign funds hold ${CT.fii}% and Indian institutions ${CT.dii}%; ${n0(OH.shareholders)} shareholders hold the rest. 2.48% sits in the IOC Shares Trust (treasury shares, no dividends). The free float in practice is ~23%. A Government offer for sale is possible (it has to keep 51%), but there is little room above that line.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding', head: ['Holder', 'Stake'], wide: [0], rows: [...OH.named.map(([h, p]) => [h, p.toFixed(2) + '%']), ['Foreign portfolio investors (Jun-26)', CT.fii + '%'], ['Domestic institutions (Jun-26)', CT.dii + '%'], ['Retail and others (Jun-26)', CT.public + '%']], source: 'BSE shareholding pattern via Screener.in (Jun-2026); named holders from AR FY26 (31-Mar-2026).' } },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: competent operators, but no independent directors and a controlling shareholder that sets prices',
  blocks: [
    { p: D.governance.board },
    { verdicts: [
      ['Board independence', 'Weak', D.governance.independentDirectors, 'A listed company without an audit committee is a basic failure; appointments are the Ministry\'s.'],
      ['Audit and accounts', 'Moderate', 'C&AG-appointed auditors; unqualified; complex consolidation (CPCL, ~30 JVs, treasury shares).', 'Clean, but inventory and compensation timing need adjusting.'],
      ['Minority alignment', 'Weak', D.governance.pricing, 'The state is both owner and price-setter.'],
      ['Related parties', 'Watch', D.governance.relatedParty, 'Large, but mostly JVs with other PSUs.'],
      ['Capital allocation', 'Moderate', 'Projects delivered close to schedule; but capex continues into petchem and renewables partly for policy reasons.', 'Growth over payouts.'],
      ['Disclosure', 'Moderate', 'Quarterly calls and presentations; GRM paused from Q4FY26; no refining/marketing split.', 'Less than investors need in a crisis.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; Q1FY27 results notes; calls' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: EPS ₹${n1(F.eps[0])} in FY27E, ₹${n1(F.eps[1])} in FY28E, ₹${n1(F.eps[2])} in FY29E`,
  blocks: [
    { p: 'We forecast three segments. Petroleum products = sales volume × realisation (revenue) and volume × EBITDA per tonne; petrochemicals and gas & other on revenue and margin. Capex ₹34,000 / 32,000 / 32,000 cr; depreciation at 5.7% of gross block; other income (dividends, interest, JV profits) ₹6,000-6,600 cr; finance cost ₹8,300-9,000 cr; tax plus minorities 27.5-29%; payout 30%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM', 'PL (1-Aug)', 'BOB Capital (1-Aug)', 'MOSL (1-Aug)', 'ICICI Sec (20-May)'], rows: [
      ['FY27E EPS (₹)', '{{F.eps.0|n1}}', '11.2', '10.5', '–', '−15.9'],
      ['FY28E EPS (₹)', '{{F.eps.1|n1}}', '21.4', '16.0', '20.8', '20.0'],
      ['FY27E EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '40,000', '42,582', '–', '−5,400'],
      ['FY28E EBITDA (₹ cr)', '{{F.ebitda.1|num}}', '61,100', '56,129', '–', '64,300'],
    ], source: 'Broker notes as cited in the street table; GAM Research. PL and ICICI Securities EPS are on 1,377 cr shares; consolidated.' } },
    { callout: `**Where we differ:** our earnings are close to the street; our valuation is not. Our Sep-28E EBITDA of ₹${n0(ebSep)} cr and EPS of ₹${n1(epsSep.base)} sit inside the range of the four notes. The gap to the street's targets (median ₹${n0(medTp)}) is the multiple and the treatment of investments and minorities (next chapters).` },
  ],
};

module.exports = { quarter, quality, ownership, governance, forecasts };
