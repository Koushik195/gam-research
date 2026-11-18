// Asian Paints report, part 3: moat, Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./ASIANPAINT.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, SA, A26, Q1, FY26, b, mosl, pl, isec, CONS, shortDate, avgEps } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: still the widest in Indian paints, but no longer unbreachable',
  blocks: [
    { verdicts: [...D.moat.map(r => r.map(rup))], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings, calls, Grasim disclosures and broker notes to Sep-2026)' },
    { callout: '**Honest verdict:** Asian Paints still has the strongest brand, the deepest dealer and tinting network, the lowest cost to serve and, from FY27, a backward-integration edge nobody else in India has. But the last two years proved that its biggest moat, the dealer network, can be copied by a rival willing to spend: Birla Opus built a national network and reached #3 in about two years by paying dealers and contractors more. The moat now protects **volume and leadership**, not **price**. A franchise that once set prices for the industry now has to match competitors\' discounts. That is a narrower moat than the one the 60x-80x multiples of 2021-24 were paying for.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: a strong quarter on cheap inventory; Q2 carries the higher costs',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Consolidated revenue from operations', n0(Q1.prior.consRevenue), n0(Q1.consRevenue), pc(Q1.consRevenueYoYPct)],
      ['  Decorative India volume / value growth', `${Q1.prior.decoVolumePct}% / ${Q1.prior.decoValuePct}%`, `${Q1.decoVolumePct}% / ${Q1.decoValuePct}%`, ''],
      ['  Standalone revenue', n0(Q1.prior.saRevenue), n0(Q1.saRevenue), pc(Q1.saRevenueYoYPct)],
      ['  International revenue', n0(Q1.prior.intlRevenue), n0(Q1.intlRevenue), pc(Q1.intlRevenueYoYPct)],
      ['Standalone gross margin', '43.2%', `${Q1.saGrossMarginPct}%`, `+${Q1.saGrossMarginChgBp}bp`],
      ['Consolidated EBITDA', n0(Q1.prior.consEbitda), n0(Q1.consEbitda), pc(Q1.consEbitdaYoYPct)],
      ['EBITDA margin', `${Q1.prior.consEbitdaMarginPct}%`, `${Q1.consEbitdaMarginPct}%`, `+${Q1.consEbitdaMarginChgBp}bp`],
      ['Net profit before minorities', n0(Q1.prior.consPatBeforeMi), n0(Q1.consPatBeforeMi), pc(Q1.consPatYoYPct)],
      { hl: true, cells: ['**Net profit attributable / EPS (₹)**', '**1,100 / 11.5**', `**${n0(Q1.consPatAttrib)} / 16.1**`, '**+40%**'] },
    ], source: 'Q1FY27 investor presentation (29-Jul-2026); Screener.in' } },
    { bullets: C.q1fy27.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (Nov-2025 to Jul-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'Asian Paints investor calls' } },
    { callout: '**Why it matters:** management has delivered on volume (8-10% guided, 8.7% in FY26, 9.0% in Q1FY27) and on the 18-20% margin band in FY26. The open question for FY27 is not demand but cost: with material inflation of ~25% against ~8-9% price, Q2 margins fall, and H2 depends on crude and TiO2. Our forecast ({{F.ebitdaMargin.0|pct}} for FY27E) assumes the band holds.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts, strong cash, recurring "one-off" impairments',
  blocks: [
    { bullets: [
      `**Cash backs profit.** Operating cash flow was ${Math.round(A.cfoToPat[b])}% of attributable profit in FY26 (helped by a ₹976 cr inventory release), ${Math.round(A.cfoToPat[b - 1])}% in FY25 and ${Math.round(A.cfoToPat[b - 2])}% in FY24; over FY15-26 cash from operations (₹${n0(A.cumulative.cfo)} cr) exceeded profit (₹${n0(A.cumulative.pat)} cr). FY22 (${Math.round(A.cfoToPat[7])}%) was the exception, when inventory was built during the input spike.`,
      `**"Exceptional" items keep recurring.** −₹363 cr in FY25 (Ethiopia devaluation, White Teak and Causeway impairments, Indonesia exit) and −₹158 cr in FY26 (White Teak intangibles ₹94 cr, new labour code ₹64 cr). Most of it is the cost of home-decor acquisitions that did not work. We treat them as real costs of capital allocation, not as noise.`,
      `**Other income is meaningful.** ₹${n0(A.otherIncome[b])} cr in FY26 on Screener's basis (after exceptional items), ${Math.round(A.otherIncomeShare[b])}% of pre-tax profit. It includes ₹287 cr of mark-to-market gains on funds, ₹181 cr of interest and ₹166 cr share of PPG Asian Paints' profit.`,
      '**Minorities.** Screener\'s consolidated "Net Profit" is before minorities (₹4,395 cr in FY26) while EPS is after (₹4,325 cr); we use the attributable figure throughout. Minorities (₹42-97 cr a year) are mainly PPG\'s half of Asian Paints PPG.',
      '**Revenue recognition.** Revenue is net of discounts and schemes; the auditor\'s key audit matter for the parent is revenue cut-off, the second is goodwill impairment (₹219 cr). Rising dealer schemes reduce reported revenue rather than appear as costs, which is why value growth trailed volume.',
      '**Disclosure.** No segment reporting; decorative revenue and margins are not disclosed. Volume growth is disclosed only as a percentage. Business-line PBT is given for the JVs, international and home decor.',
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit (Deloitte Haskins & Sells LLP; S R B C & Co proposed from the 2026 AGM under mandatory rotation), strong cash conversion and a simple balance sheet. The things to watch are the size of dealer schemes netted from revenue, and further impairments in home decor.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The founding Choksi, Dani and Vakil families and their relatives own ${OH.categoriesPct.promoter}% (Jun-2026) through ~80 family accounts and holding companies. Foreign investors own ${OH.categoriesPct.fii}%, Indian institutions ${OH.categoriesPct.dii}% and the public ${OH.categoriesPct.public}%. Indian institutions' share doubled from ~11% to ~21% in two years, partly because Reliance sold most of its 4.9% stake (3.64% to SBI Mutual Fund at ₹2,201 a share in Jun-2025, and a further ~85 lakh shares in a later block deal). Shareholders numbered ~${n1(OH.counts.shareholders / 1e5)} lakh at Jun-2026, down from ~${n1(OH.counts.shareholdersMar25 / 1e5)} lakh at Mar-2025.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ['Promoter families (Jun-2026)', OH.categoriesPct.promoter + '%', '42.1% via family companies (e.g. Sattva Holding, Smiti Holding, Geetanjali Trading, Elcid Investments), 10.5% as individuals (Mar-2026)'],
    ...OH.namedMar26.map(h => [h.name, h.pct + '%', 'At 31-Mar-2026']),
    ['Foreign portfolio investors (Jun-2026)', OH.categoriesPct.fii + '%', 'Mar-2026: 12.1%'],
    ['Domestic institutions (Jun-2026)', OH.categoriesPct.dii + '%', 'Mar-2026: mutual funds 11.4%, insurers 9.5%'],
  ], source: 'BSE shareholding pattern via Screener.in (Jun-2026 categories); Mar-2026 shareholding pattern (asianpaints.com) and India CSR (15-Jun-2026) for named holders. Named institutional holders at Jun-2026 were not available to us.' } },
  { callout: '**Our read:** a stable, long-standing family group with a professional CEO. Two things to watch. Some promoter holding companies have pledged shares (Smiti Holding ~3.6 cr shares, ~3.8% of equity, after a net release in June 2026; Sattva Holding ~0.6% at Mar-2026): small against a 52.6% stake but not nothing. And LIC (8.1%) and SBI MF (5.2%) are now large, concentrated holders.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a strong board and clean accounts; pay, pledges and a CCI probe to watch',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: C.managementSrc } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Deloitte (two terms to 2026), unqualified; S R B C & Co proposed from the 2026 AGM.', 'No accounting red flags.'],
      ['Board', 'Strong', 'Independent chairman (R Seshasayee); six of twelve directors independent; Sudhir Sitapati added May-2026.', 'Good separation of family and management.'],
      ['Promoters and pledges', 'Watch', '52.6% held by three founding families, unchanged for years; some holding companies have pledged shares (~4% of equity).', 'Aligned owners; pledges are a minor risk.'],
      ['Professional management', 'Strong', 'MD & CEO Amit Syngle (since Apr-2020, with the company since 1990); CFO R J Jeyamurugan.', 'Deep bench; current MD term end date not verified by us.'],
      ['Pay', 'Watch', 'MD paid ₹31.2 cr in FY26 (249x the median employee, +179%) in a year profit rose 18%; FY25 had only fixed pay.', 'High and volatile.'],
      ['Regulatory', 'Watch', 'CCI DG investigation (Jul-2025) into alleged abuse of dominance; an earlier JSW complaint was dismissed in 2022 (appeal pending).', 'Outcome open; penalty risk.'],
      ['Capital allocation', 'Moderate', 'Reliable 60% payout; heavy capex in backward integration; repeated impairments in home decor.', 'Core paints good; diversification poor.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, shareholding patterns, filings)' },
  ],
};

const segRow = (k, name, field, hist, fmt = 'num') => [name, hist == null ? '–' : n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|${fmt}}}`)];
const mg = i => AS.segments[i].marginPct.map(x => `${x}%`);
const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: FY27 boosted by price, then ~10% EPS growth',
  blocks: [
    { p: 'We forecast the two lines that reconcile to reported numbers: standalone (decorative India) and subsidiaries & consolidation. Capex is ₹1,400 cr a year; treasury income 7.5% on net cash plus ~₹420-480 cr of associate profit and other income; the tax line (26.6%) includes minorities; payout 60%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Business-line forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Standalone (decorative India, kitchen, bath)' }, segRow('sa', 'Revenue', 'revenue', A26.saRev), segRow('sa', 'EBITDA', 'adjEbitda', A26.saEbitda), ['Margin', `${n1(A26.saMarginPct)}%`, ...mg(0)],
      { sec: 'Subsidiaries & consolidation' }, segRow('subs', 'Revenue', 'revenue', A26.subRev), segRow('subs', 'EBITDA', 'adjEbitda', A26.subEbitda), ['Margin', `${n1(A26.subMarginPct)}%`, ...mg(1)],
      { hl: true, cells: ['**Group EBITDA**', `**${n0(A.ebitda[b])}**`, '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'Screener.in (FY26 standalone and consolidated), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (attributable)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of debt, incl. deposits)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years (excl. term deposits) and net of borrowings, incl. term deposits, in forecasts.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), Motilal Oswal (29-Jul-26)', '{{F.eps.0|n1}}', n1(mosl.eps.FY27E), '{{F.eps.1|n1}}', n1(mosl.eps.FY28E)],
      ['EPS (₹), Prabhudas Lilladher (29-Jul-26)', '{{F.eps.0|n1}}', n1(pl.eps.FY27E), '{{F.eps.1|n1}}', n1(pl.eps.FY28E)],
      ['EPS (₹), ICICI Securities (30-Jul-26)', '{{F.eps.0|n1}}', n1(isec.eps.FY27E), '{{F.eps.1|n1}}', n1(isec.eps.FY28E)],
      ['Revenue (₹ cr), MOSL / PL / I-Sec', '{{F.sales.0|num}}', `${n0(mosl.sales.FY27E)} / ${n0(pl.sales.FY27E)} / ${n0(isec.sales.FY27E)}`, '{{F.sales.1|num}}', `${n0(mosl.sales.FY28E)} / ${n0(pl.sales.FY28E)} / ${n0(isec.sales.FY28E)}`],
      ['EBITDA margin, MOSL / PL / I-Sec', '{{F.ebitdaMargin.0|pct}}', [mosl, pl, isec].map(s => n1(s.ebitda.FY27E / s.sales.FY27E * 100) + '%').join(' / '), '{{F.ebitdaMargin.1|pct}}', [mosl, pl, isec].map(s => n1(s.ebitda.FY28E / s.sales.FY28E * 100) + '%').join(' / ')],
    ], source: 'MOSL, PL and ICICI Direct Q1FY27 notes (PDFs). A post-results consensus dated before 30-Sep-2026 was not found; the pre-results consensus (35 analysts, 14-Jul-2026) expected FY27 revenue +14.4% and profit +14.5%.' } },
    { callout: `Our FY27E EPS is ${Math.abs(gap(F.eps[0], avgEps('FY27E')))}% ${F.eps[0] >= avgEps('FY27E') ? 'above' : 'below'} the average of the three brokers and FY28E ${Math.abs(gap(F.eps[1], avgEps('FY28E')))}% ${F.eps[1] >= avgEps('FY28E') ? 'above' : 'below'}: close to PL and below MOSL and I-Sec in FY28, because we assume prices partly reverse when inputs fall, which slows FY28 revenue growth to {{F.salesGrowth.1|pct}}. Our EPS still compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E (~${Math.round(X.epsCagr2829)}% over FY27-29E).` },
  ],
};

module.exports = { moat, guidance, quality, ownership, governance, forecasts };
