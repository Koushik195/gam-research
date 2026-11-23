// Bajaj Auto report, part 3: moat, Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./BAJAJ-AUTO.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, b, STR, withEps, avgEps, avgOf, epsAdj, shortDate, SAF, SAEPS, BACLF, build, SH } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a genuine export and three-wheeler moat; none in commuter bikes',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (AR FY26, calls, sales data, Bajaj Mobility reports, broker notes to Sep-2026)' },
    { callout: '**Honest verdict:** Bajaj has two real moats. In emerging-market exports it has built distribution, brands (Boxer, Pulsar) and service that Chinese and Indian rivals have not matched in thirty years; in three-wheelers it owns three-quarters of the ICE market. Its cost and R&D discipline give it the best margins in the industry. But it has **no moat in the Indian commuter market** (share down 2.6 points in two years), EVs are a fight it is doing well in rather than one it owns, and KTM is a turnaround, not an advantage. A franchise this good deserves a premium to the auto sector; it does not deserve to be priced as if every engine keeps firing at once.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: a record quarter despite supply shocks; Q2 carries the broader inflation',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Volumes (units)', n0(Q1.volumesPy), n0(Q1.volumes), pc((Q1.volumes / Q1.volumesPy - 1) * 100)],
      ['  of which exports', '4,76,429', n0(Q1.exportUnits), pc((Q1.exportUnits / 476429 - 1) * 100)],
      ['Standalone revenue', n0(Q1.saRevenuePy), n0(Q1.saRevenue), pc((Q1.saRevenue / Q1.saRevenuePy - 1) * 100)],
      ['Standalone EBITDA / margin', `${n0(Q1.saEbitdaPy)} / ${Q1.saMarginPyPct}%`, `${n0(Q1.saEbitda)} / ${Q1.saMarginPct}%`, pc((Q1.saEbitda / Q1.saEbitdaPy - 1) * 100)],
      ['Standalone PAT', n0(Q1.saPatPy), n0(Q1.saPat), pc((Q1.saPat / Q1.saPatPy - 1) * 100)],
      ['Realised USD/INR', Q1.usdInrPy, Q1.usdInr, pc((Q1.usdInr / Q1.usdInrPy - 1) * 100)],
      ['Consolidated revenue', n0(Q1.consRevenuePy), n0(Q1.consRevenue), pc((Q1.consRevenue / Q1.consRevenuePy - 1) * 100)],
      { hl: true, cells: ['**Consolidated PAT attributable**', `**${n0(Q1.consPatAttribPy)}**`, `**${n0(Q1.consPatAttrib)}**`, `**${pc((Q1.consPatAttrib / Q1.consPatAttribPy - 1) * 100)}**`] },
    ], source: 'Q1FY27 results and call (21-Jul-2026), sales releases, Screener.in' } },
    { bullets: Q1.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (May-Jul 2026) and what happened', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'Bajaj Auto calls; sales releases to Aug-2026' } },
    { callout: '**Why it matters:** management has delivered on exports and margins through two shocks (rare-earth magnets in 2025, the West Asia conflict in 2026). The open questions for FY27 are the size of the Q2 cost hit, how long the rupee keeps cushioning it, and whether the festive Pulsar relaunch stops the domestic share slide.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: a clean core, but incentives, currency and KTM accounting need watching',
  blocks: [
    { bullets: [
      `**Incentives are a growing slice of profit.** Government incentives (PLI and state PSI) were ₹${n0(FY26.otherOpRev.pliPsi)} cr in FY26, up from ₹${n0(FY26.otherOpRev.pliPsiPy)} cr, and export incentives ₹${n0(FY26.otherOpRev.exportIncentives)} cr; together ~13% of standalone EBITDA, booked as revenue. PLI is time-bound.`,
      `**Currency.** Realised USD/INR rose ~10% in a year; with exports ~40% of revenue, that is the main reason margins held through 4.5% commodity inflation. It is earned, but it is not repeatable.`,
      `**KTM accounting.** FY25 includes a ₹915 cr share of KTM's loss; FY26 includes ₹1,599 cr of one-off gains (remeasuring the 49.9% stake to fair value and recycling the currency reserve) and KTM's loss for six weeks. KTM is consolidated one quarter in arrears, and Bajaj's Ind AS numbers for KTM differ from Bajaj Mobility's IFRS reports. A ₹21.8 cr bargain-purchase gain went to equity.`,
      `**Consolidated cash flow mixes in a lender.** BACL's loan growth is an operating outflow: consolidated CFO was −₹1,406 cr in FY25 and ₹2,597 cr in FY26 against profit of ₹7,325 cr and ₹10,744 cr. Standalone cash conversion is strong (FCF ~80% of PAT in Q1FY27; >₹8,000 cr in FY26).`,
      `**Other income** (₹${n0(A.otherIncome[b])} cr in FY26 on our basis) is ${Math.round(A.otherIncomeShare[b])}% of pre-tax profit: treasury income on ~₹20,000 cr of surplus funds plus the KTM items above.`,
      '**Disclosure.** Good on volumes and exports; no product-level revenue or margin (motorcycles vs 3W vs EV vs spares). The EV margin is given only as "double digit".',
    ] },
    { callout: '**Accounting flag: AMBER.** Unmodified audit (S R B C & Co LLP; key audit matters: the KTM business combination and BACL\'s expected credit loss). The core accounts are clean and cash-backed; the flag is for the group layer: KTM purchase accounting and lag, a fast-growing lender inside the consolidated cash flow, and incentive income.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Bajaj family group owns ${OH.categoriesPct.promoter}% (Jun-2026), mostly through Bajaj Holdings & Investment (34.19% at Mar-2026) and Jamnalal Sons (9.29%); no shares are pledged. Foreign investors own ${OH.categoriesPct.fii}% (12.45% in Dec-2024), Indian institutions ${OH.categoriesPct.dii}% and the public ${OH.categoriesPct.public}%. ${rup(OH.note)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.namedMar26.map(h => [h.name, h.pct + '%', 'At 31-Mar-2026']),
    ['Promoter group total (Jun-2026)', OH.categoriesPct.promoter + '%', 'No pledges'],
    ['Foreign portfolio investors (Jun-2026)', OH.categoriesPct.fii + '%', 'Dec-2024: 12.45%'],
    ['Domestic institutions (Jun-2026)', OH.categoriesPct.dii + '%', 'Dec-2024: 9.98%'],
  ], source: OH.src } },
  { callout: '**Our read:** a stable, long-term family owner with no pledges and a habit of returning cash (buybacks in FY23, FY24 and FY27; 100% payout of FY26 profit). The tender buyback lifts the promoter stake slightly. The shift from foreign to domestic holders says the stock is now owned by people who like its payout and quality more than its growth.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a capable owner-managed company; pay is high and KTM is the big judgement call',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: C.managementSrc } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'S R B C & Co LLP, unmodified opinion; KTM and BACL as key audit matters.', 'No red flags; complexity rising.'],
      ['Board', 'Adequate', `${C.governance.board} directors, ${C.governance.independent} independent; chairman is a promoter (Niraj Bajaj).`, 'Family-led board with a solid independent bench.'],
      ['Promoters', 'Strong', '55% held by the family group, no pledges, long record of returning cash.', 'Aligned owners.'],
      ['Management depth', 'Improving', 'Rakesh Sharma made Joint MD from 1-Jun-2026; Rajiv Bajaj re-appointed to Mar-2030.', 'Succession depth below the MD.'],
      ['Pay', 'Watch', 'MD paid ₹58.9 cr in FY26 (₹35.2 cr commission), 535x the median employee.', 'High, though tied to profit.'],
      ['Capital allocation', 'Mixed', 'Excellent payouts and frugal capex; but ~€880 m of support plus control of a loss-making KTM, and a fast-growing lender.', 'KTM must earn its keep.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (governance report, Annexure III, notes 13, 44, 46), Q4FY26 call' },
  ],
};

const segRow = (k, name, field, hist) => [name, hist == null ? '–' : n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|num}}`)];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: standalone EPS +25% in FY27E, then ~11% a year; consolidated lifted by BACL and KTM\'s recovery',
  blocks: [
    { p: 'We forecast three lines that add up to reported numbers: standalone (from a volume x realisation build), BACL (income and margin after its funding cost) and KTM with the other subsidiaries and eliminations. Treasury income is a yield on net cash excluding BACL\'s borrowings; the tax line carries minorities; payout counts buybacks. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet. The engine uses the FY26 share count (27.95 cr); the street and our valuation use the post-buyback ~27.48 cr.' },
    { exhibit: { type: 'table', title: 'Standalone build: volumes x realisation', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Domestic 2W (incl. Chetak)', n0(X.A26.dom2w), ...build.map(x => n0(x.dom2w))], ['Domestic 3W', n0(X.A26.dom3w), ...build.map(x => n0(x.dom3w))],
      ['Export 2W', n0(X.A26.exp2w), ...build.map(x => n0(x.exp2w))], ['Export 3W', n0(X.A26.exp3w), ...build.map(x => n0(x.exp3w))],
      { hl: true, cells: ['**Total units**', `**${n0(X.A26.units)}**`, ...build.map(x => `**${n0(x.units)}**`)] },
      ['Domestic revenue per unit (₹)', n0(AS.businessLines.fy26.domRevCr * 1e7 / (X.A26.dom2w + X.A26.dom3w)), ...build.map(x => n0(x.domPU))],
      ['Export revenue per unit (USD) / ₹ per $', `${n0(2253e6 / (X.A26.exp2w + X.A26.exp3w))} / 90.6`, ...build.map((x, i) => `${n0(x.expUsdPU)} / ${AS.businessLines.rsPerExportUsd[i]}`)],
      ['Domestic / export / other revenue (₹ cr)', '35,698 / 20,416 / 2,619', ...build.map(x => `${n0(x.domRev)} / ${n0(x.expRev)} / ${n0(x.oth)}`)],
      { hl: true, cells: ['**Standalone revenue (₹ cr)**', `**${n0(X.A26.saRev)}**`, ...build.map(x => `**${n0(x.rev)}**`)] },
      ['Standalone EBITDA margin', `${X.A26.saMarginPct}%`, ...AS.segments[0].marginPct.map(m => `${m}%`)],
      ['Standalone EPS (₹, post-buyback count)', '351.5', ...SAEPS.map(n1)],
    ], source: 'Sales releases, AR FY26, GAM estimates. Build checked against model revenue (difference < ₹5 cr).' } },
    { exhibit: { type: 'table', title: 'Business lines (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Bajaj Auto standalone' }, segRow('sa', 'Revenue', 'revenue', X.A26.saRev), segRow('sa', 'EBITDA', 'adjEbitda', X.A26.saEbitda),
      { sec: 'Bajaj Auto Credit' }, segRow('bacl', 'Income', 'revenue', X.A26.baclRev), segRow('bacl', 'EBITDA after funding cost', 'adjEbitda', X.A26.baclEbitda),
      { sec: 'KTM, other subsidiaries & consolidation' }, segRow('ktm', 'Revenue', 'revenue', X.A26.subRev), segRow('ktm', 'EBITDA', 'adjEbitda', X.A26.subEbitda),
      { hl: true, cells: ['**Group EBITDA**', `**${n0(A.ebitda[b])}**`, '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'Screener.in, BACL results, GAM estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' }, { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹, FY26 count)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of non-BACL debt)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of non-BACL borrowings in forecasts.' } },
    ...require('./BAJAJ-AUTO.part3b').vsStreet,
  ],
};

module.exports = { moat, guidance, quality, ownership, governance, forecasts };
