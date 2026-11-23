// Hero MotoCorp report, part 3: moat, Q1FY27 & guidance, earnings quality, ownership, governance.
const X = require('./HEROMOTOCO.ctx');
const { C, D, A, n0, n1, pc, rup, Q1, FY26, b, SQ } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a deep moat in commuter bikes, little elsewhere',
  blocks: [
    { verdicts: D.moat.map(r => [...r.map(rup), r[1] === 'Strong' ? 'Protects volume and cash in the core' : 'Must be built, not inherited']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings, calls, SIAM/VAHAN data to Sep-2026)' },
    { callout: '**Honest verdict:** Hero has a real moat, but a narrow one. In 100-110cc motorcycles its brand, rural reach, service network, resale values and scale give it ~96% of the segment and the lowest cost per unit in the industry; nobody has dented that in 15 years. Outside that segment it has no structural advantage: in scooters, premium bikes, exports and EVs it is a late, small challenger that wins share only when it out-spends and out-launches rivals. Because its core segment is shrinking as a share of the market, the moat protects cash flow, not growth.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: volume +23%, revenue +36%; commodity costs cut the margin to 13.3%',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Dispatches (units)', '13,67,070', '16,77,278', pc(Q1.unitsYoYPct)],
      ['  of which VIDA (EV)', '22,655', n0(Q1.vidaUnits), '+151%'],
      ['Revenue per vehicle, standalone (₹)', '70,069', n0(Q1.aspRs), pc(Q1.aspYoYPct)],
      ['Standalone revenue', '9,579', n0(Q1.saRevenue), pc(Q1.saRevenueYoYPct)],
      ['Standalone EBITDA / margin', '1,382 / 14.4%', `${n0(Q1.saEbitda)} / ${Q1.saEbitdaMarginPct}%`, '+25% / −110bp'],
      ['  ICE margin / VIDA investment', '16.8% / n.d.', `${Q1.iceMarginPct}% / ₹${Q1.vidaInvestment} cr`, ''],
      ['Standalone net profit', '1,126', n0(Q1.saPat), pc(Q1.saPatYoYPct)],
      ['Consolidated revenue', '9,728', n0(Q1.consRevenue), '+35%'],
      ['Share of associates (Ather, Hero FinCorp, Euler)', '629 (incl. ₹722 cr gain)', n0(Q1.shareOfAssociates), ''],
      { hl: true, cells: ['**Consolidated net profit / EPS (₹)**', '**1,706 / 85.3**', `**${n0(Q1.consPat)} / ${Q1.consEps}**`, '**−17%**'] },
    ], source: 'Q1FY27 results, presentation and call (6-7 Aug 2026); Emkay Research for Q1FY26 standalone detail' } },
    { bullets: [
      'Revenue grew 13 points faster than volume: ~8 points from mix (scooters, VIDA, premium variants, exports, parts) and the rest from ~4.5% of price increases taken since end-February.',
      'Gross margin fell 300 bp quarter on quarter on ~4.5% net commodity inflation linked to the West Asia conflict (steel, aluminium, precious metals, freight, gas); other expenses were cut 14% and ICE margin held at 15.9%.',
      'Consolidated profit fell 17% only because Q1FY26 included a ₹722 cr one-time gain on the dilution of associates; on a like-for-like basis profit rose ~29% (standalone) and other income rose 45%.',
      'Demand: industry retail +14% in Q1 and +28% in July; Hero expects FY27 industry growth to approach double digits, positive in H2 despite the post-GST base.',
      'Capacity: EV 15k to ~30k a month (Aug-26) to ~45k by Q4FY27; Splendor +2,000 a day; Destini doubled; Xoom +50%; GPC 2.0 parts centre (₹750 cr).',
    ] },
    { exhibit: { type: 'table', title: 'What management guided (May to Aug 2026)', head: ['Topic', 'What was said', 'Source'], wide: [1], rows: C.guidance.map(g => g.map(rup)), source: 'Hero MotoCorp Q4FY26 (May-2026) and Q1FY27 (Aug-2026) calls' } },
    { callout: '**Since the call:** July dispatches rose 19% (5.33 lakh) but August only 2.7% (5.68 lakh), with motorcycles −1.5% and exports −24.5%; TVS out-sold Hero for the month and the stock fell 7% on 1-Sep. The monsoon then ended ~13% short. We take the guidance for "approaching double-digit" industry growth with caution: our FY27E volume growth is {{as.volume.growth.0|n1}}%, with September-March at only ~+3.5%.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean and cash-backed, but reported profit mixes in associates and one-offs',
  blocks: [
    { bullets: [
      `**Cash backs profit.** Operating cash flow was ${Math.round(A.cfoToPat[b])}% of reported profit in FY26 (₹2,375 cr working-capital inflow as payables rose), ${Math.round(A.cfoToPat[b - 1])}% in FY25 and ${Math.round(A.cfoToPat[b - 2])}% in FY24; over FY15-26 cash from operations (₹${n0(A.cumulative.cfo)} cr) exceeded profit (₹${n0(A.cumulative.pat)} cr).`,
      '**Associates sit inside consolidated profit.** Hero equity-accounts Hero FinCorp, Ather and Euler: their share of profit/loss was −₹120 cr (FY24), −₹161 cr (FY25) and +₹385 cr (FY26, including a ₹722 cr gain when Ather\'s IPO and a private placement diluted Hero\'s stake). Excluding them and the one-offs, FY26 EPS was ~₹283, not the reported ₹287. Our forecasts exclude associates and value the stakes separately.',
      '**Other income is sizeable and volatile.** ₹1,058 cr in FY26 (consolidated, 14% of pre-tax profit): ₹293 cr interest, ₹128 cr gains on sale and ₹533 cr fair-value gains on debt funds, net of a ₹222 cr write-down of the Zero Motorcycles stake after a dilutive round. Mark-to-market gains rise and fall with bond yields.',
      '**One-offs:** ₹119 cr labour-code charge (FY26), ₹160 cr VRS (FY24). Small.',
      '**Minorities and share count.** Screener\'s FY26 "Net Profit" (₹5,776 cr) is before ₹34 cr of minorities; EPS uses ₹5,742 cr. The engine\'s implied share count (20.13 cr) is 0.6% above the actual 20.01 cr; below our 1% threshold, so no adjustment.',
      '**Tax:** an income-tax demand from a 2022 search (₹178 cr in FY25, ₹27 cr outstanding) is under appeal with no provision; PLI incentives are booked as income (₹48 cr in Q1FY27, growing as the whole VIDA range qualifies).',
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit, strong cash conversion, negative working capital and a simple balance sheet. Two things to adjust for: associates (including one-off dilution gains) in consolidated profit, and mark-to-market treasury income. We strip out the first and normalise the second.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Munjal family owns ${OH.categoriesPct.Promoters}% (Jun-2026), mainly through Bahadur Chand Investments (20.0%) and the Brijmohan Lal Om Parkash partnership of Pawan, Renu and Suman Kant Munjal (14.0%); none of it is pledged. Foreign investors own ${OH.categoriesPct.FIIs}%, Indian institutions ${OH.categoriesPct.DIIs}% (mutual funds ${OH.mutualFundsPct}%) and the public ${OH.categoriesPct.Public}%. ${OH.stakeChanges}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ['Munjal family (promoters)', OH.categoriesPct.Promoters + '%', 'Jun-2026; Bahadur Chand Investments 20.01%, Brijmohan Lal Om Parkash 13.96% (Mar-2026)'],
    ['Life Insurance Corporation of India', OH.lic.pct + '%', 'Jun-2026 (5.40% at Mar-2026, 5.92% at Mar-2025)'],
    ...OH.namedMar26.slice(1).map(([n, p]) => [n, p + '%', 'At 31-Mar-2026']),
    ['Foreign portfolio investors (Jun-2026)', OH.categoriesPct.FIIs + '%', 'Mar-2025: 27.4%'],
    ['Domestic institutions (Jun-2026)', OH.categoriesPct.DIIs + '%', 'Mar-2025: 27.9%'],
  ], source: 'BSE shareholding pattern via Screener.in (Jun-2026 categories); AR FY26 (Mar-2026 names); Marketsmojo (LIC, Jun-2026). Other named holders at Jun-2026 were not available to us.' } },
  { callout: '**Our read:** a stable family owner with a minority stake (34.7%) and no pledges; foreign funds have been buyers in 2025-26 and LIC a steady seller. The family also controls Hero FinCorp and other Hero group companies, so related-party dealings deserve attention (next chapter).' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: clean accounts, but chairman pay and old investigations are real concerns',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => m.map(rup)), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Unqualified opinion; simple, cash-rich balance sheet.', 'No accounting red flags.'],
      ['Chairman pay', 'Weak', 'Dr. Pawan Munjal earned ₹122.31 cr in FY26 (+11.8%), 789x the median employee; ~20% of votes opposed his remuneration at the Aug-2026 AGM.', 'Very high by Indian standards; a cost to minorities.'],
      ['Investigations', 'Watch', 'DRI (customs, foreign currency) and ED (money laundering, ₹24.95 cr attached) cases against the chairman stayed by the Delhi High Court since Nov-2023; 2022 tax search led to small demands under appeal.', 'Not closed; the company reports no financial impact.'],
      ['Management depth', 'Moderate', 'Three CEOs since 2023; new CEO (Jan-2026), CTO (May-2026) and premium head (Aug-2026).', 'Fresh team, early results good; continuity risk.'],
      ['Capital allocation', 'Moderate', '70%+ payout and modest capex are shareholder-friendly; large minority stakes (Ather ₹2,700 cr in 2026, Hero FinCorp, Euler, Zero) are a mixed record.', 'Ather has worked; Zero (written down) and Hero FinCorp (loss) less so.'],
      ['Group links', 'Watch', 'Hero FinCorp (40% owned by Hero, a Munjal-family group company) provides retail finance to Hero buyers and dealers.', 'Normal for OEMs, but a related party to monitor.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY24-26, AGM results, court records, filings)' },
  ],
};

module.exports = { moat, guidance, quality, ownership, governance };
