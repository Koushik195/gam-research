// Samvardhana Motherson report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./MOTHERSON.ctx');
const { C, D, F, A, AS, n0, n1, n2, pc, pc1, b, shortDate, withEps, avgEps } = X;
const Q = C.q1fy27;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: record revenue, EBITDA +26%, profit doubled off a weak base',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q.revenuePrior), n0(Q.revenue), yoy(Q.revenue, Q.revenuePrior)],
      ['EBITDA (company basis)', n0(Q.ebitdaPrior), n0(Q.ebitda), yoy(Q.ebitda, Q.ebitdaPrior)],
      ['EBITDA margin', `${Q.ebitdaMarginPriorPct}%`, `${Q.ebitdaMarginPct}%`, '+60bp'],
      ['Depreciation', n0(Q.depPrior), n0(Q.dep), yoy(Q.dep, Q.depPrior)],
      ['Finance cost', n0(Q.financePrior), n0(Q.finance), yoy(Q.finance, Q.financePrior)],
      ['Profit before tax', n0(Q.pbtPrior), n0(Q.pbt), yoy(Q.pbt, Q.pbtPrior)],
      { hl: true, cells: ['**Net profit to owners / EPS (₹)**', `**${n0(Q.patPrior)} / ${n2(Q.epsPrior)}**`, `**${n0(Q.pat)} / ${n2(Q.eps)}**`, `**${yoy(Q.pat, Q.patPrior)}**`] },
      ['Normalised PAT (company)', n0(Q.patNormPrior), n0(Q.pat), yoy(Q.pat, Q.patNormPrior)],
      ['INR per EUR (average)', n1(Q.fx.inrEurQ1FY26), n1(Q.fx.inrEurQ1FY27), yoy(Q.fx.inrEurQ1FY27, Q.fx.inrEurQ1FY26)],
    ], source: 'Q1FY27 presentation and call (6-Aug-2026); Screener.in. Q1FY26 included a ₹136 cr exceptional restructuring charge.' } },
    { bullets: Q.callPoints },
    { exhibit: { type: 'table', title: 'What management has said (Sep-2025 to Aug-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, g.said, g.outcome || '–']), source: 'Investor Meet 2025, Q4FY26 and Q1FY27 calls' } },
    { callout: '**Why it matters:** SAMIL does not guide on revenue or margins beyond capex and leverage, and its five-year targets have been missed before (Vision 2025: USD36 bn revenue, 40% ROCE). The quarter was good, but Q1 is seasonally weak and the base was depressed by restructuring costs. The questions for FY27 are how much of copper and polymer inflation is recovered by Q4, how fast Nexans and Yutaka are fixed, and what the consumer-electronics plant actually earns.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: cash backs profit, but "exceptional" restructuring recurs and the JV and minority layers blur EPS',
  blocks: [
    { bullets: [
      `**Cash conversion is good.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26 against ₹${n0(A.pat[b])} cr of net profit to owners and ₹${n0(A.ebitda[b])} cr of EBITDA (Screener), helped by ₹6,075 cr more supplier credit; over FY21-26 CFO was ₹37,296 cr against cumulative owners' profit of ~₹${n0(A.pat.slice(b - 5).reduce((s, x) => s + x, 0))} cr. Payable days of ~150 mean suppliers fund the business: if that reverses, so does the cash.`,
      '**Exceptional items are not one-off.** ₹251 cr of exceptional costs in FY24 and ₹413 cr in FY26 (European restructuring, Labour Codes); management says more resizing will come with new acquisitions. The company\'s "normalised PAT" (₹4,258 cr in FY26 vs ₹3,860 cr reported) excludes them. We forecast none, which flatters our EPS slightly.',
      '**Two layers sit between EBITDA and EPS.** JV profits (₹583 cr in FY26, ~15% of owners\' profit) are below EBITDA; minorities took ₹226 cr in FY26 (₹343 cr in FY25) and Honda keeps 19% of Yutaka. Screener\'s "Net Profit" is before minorities; we use profit to owners throughout (MOTHERSON.patch.js).',
      '**Acquisition accounting.** Goodwill is ₹7,309 cr and the JV stakes carry ₹3,776 cr of goodwill from fair valuation; FY25 profit included a ₹178 cr fair-value gain on taking control of a JV. The auditor\'s key audit matter is impairment testing of ₹1,421 cr of plant at loss-making European sites.',
      '**Translation.** Most revenue is earned in euros and dollars; a ~10-13% weaker rupee added roughly that much to Q1FY27 rupee growth. It works in reverse too.',
      '**Disclosure is good on divisions** (revenue and EBITDA by division and region, every quarter), weaker on acquisitions (no revenue or margin for acquired units after closing) and on consumer electronics.',
    ] },
    { callout: '**Accounting flag: AMBER.** Unmodified audit by S.R. Batliboi & Co., strong cash flow and clear divisional disclosure; but recurring "exceptional" restructuring, a large goodwill and JV-goodwill stack, and non-disclosure of acquired-unit performance mean reported EPS needs reading with care.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Sehgal family (promoters) owned ${OH.categories.promoters}% at 30-Jun-2026, through V.C. Sehgal (12.49%), the Sehgal Family Trust (13.22%), the Renu Sehgal Trust (11.96%) and Singapore-based Radha Rani Holdings (7.33%, of which 12 cr shares, 1.14% of the company, are pledged). Sumitomo Wiring Systems, the founding partner, still owns 9.37% but was reclassified from promoter to public in the June-2025 quarter, which is why "promoter holding" fell from 58% to 48.6%. Mutual funds own ${OH.categories.mutualFunds}%, foreign portfolio investors ${OH.categories.fpi}%, insurers ${OH.categories.insurance}%; ${n0(OH.shareholders)} shareholders in all.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: OH.src } },
  { callout: '**Our read:** a founder-family group with a long-standing Japanese partner. The family\'s stake has not fallen through the deals (the Sep-2024 equity raise diluted everyone ~4%); the pledge is small. Indian funds have been the marginal buyers; foreign funds own only ~13%, low for a Nifty 50 company.' },
] });

const G = D.governance;
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: founder-led, a lean board, clean audit; capital allocation is the thing to watch',
  blocks: [
    { p: G.board },
    { verdicts: [
      ['Audit and accounts', 'Good', `${G.auditor}.`, 'No red flags; read the impairment and goodwill notes.'],
      ['Board', 'Moderate', 'Seven directors, four independent; the family holds the chair and a non-executive seat; one executive director.', 'Strategy rests with the Sehgal family.'],
      ['Promoters and pledges', 'Good', '48.6% plus Sumitomo Wiring 9.37%; 1.14% of equity pledged (Radha Rani).', 'Aligned owners; small pledge to monitor.'],
      ['Management and succession', 'Good', 'L.V. Sehgal leads strategy; Pankaj Mital President-SAMIL from Oct-2025; new Group CFO (Gandharv Tongia) from Nov-2025.', 'Next generation in place; CFO change mid-plan.'],
      ['Pay', 'Good', 'Chairman and L.V. Sehgal draw no remuneration from SAMIL; Mital 80x the median employee (+15%).', 'Modest for a group of this size.'],
      ['Related parties and JVs', 'Watch', G.relatedParty + '.', 'Many intra-group flows; MSWIL is both a JV and a listed sister company.'],
      ['Capital allocation', 'Moderate', G.capitalAllocation + '.', 'Growth first, returns later: ROCE 16% (company) against a 40% target.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (board\'s report, remuneration ratios, notes 15, 34, 48); calls; shareholding pattern' },
  ],
};

const st = nm => withEps.find(s => s.broker.startsWith(nm));
const mosl = st('Motilal'), emk = st('Emkay');
const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: EPS ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])}, 10-16% below the street`,
  blocks: [
    { p: 'We forecast each division\'s revenue and EBITDA margin (chapters above), deduct inter-segment sales and the equity-accounted JVs, and add the JV profit share back in other income (₹950-1,090 cr with ~₹300 cr of interest and other items). The two July acquisitions are in FY27E revenue, and their purchase price (~₹3,900 cr) is in FY27E capex because the engine has no acquisition line; depreciation is 6.7% of gross block (₹6,150 cr in FY27E incl. the acquired plants). Interest ₹1,750-1,850 cr. The tax line is 29% of PBT and carries minorities (28% tax on PBT excluding the JV share, plus ~5% of profit to minorities). Payout 18-22%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (incl. JV share)', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit to owners', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (FY27E incl. acquisitions)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), Motilal Oswal (6-Aug-26)', '{{F.eps.0|n2}}', n1(mosl.eps.FY27E), '{{F.eps.1|n2}}', n1(mosl.eps.FY28E)],
      ['EPS (₹), Emkay (7-Aug-26)', '{{F.eps.0|n2}}', n1(emk.eps.FY27E), '{{F.eps.1|n2}}', n1(emk.eps.FY28E)],
      ['Revenue (₹ cr), MOSL / Emkay', '{{F.sales.0|num}}', '1,52,623 / 1,46,501', '{{F.sales.1|num}}', '1,75,832 / 1,66,799'],
      ['EBITDA margin, MOSL / Emkay', '{{F.ebitdaMargin.0|pct}}', '9.4% / 9.4%', '{{F.ebitdaMargin.1|pct}}', '10.1% / 10.1%'],
      ['Depreciation (₹ cr), MOSL', '{{F.dep.0|num}}', '5,734', '{{F.dep.1|num}}', '6,284'],
      ['Finance cost (₹ cr), MOSL', '{{F.interest.0|num}}', '1,638', '{{F.interest.1|num}}', '1,667'],
    ], source: 'MOSL and Emkay Q1FY27 notes (PDFs). A post-results consensus dated before 30-Sep-2026 was not found.' } },
    { callout: `Our FY27E EPS is ${Math.abs(gap(F.eps[0], avgEps('FY27E')))}% ${F.eps[0] >= avgEps('FY27E') ? 'above' : 'below'} the average of the two brokers and FY28E ${Math.abs(gap(F.eps[1], avgEps('FY28E')))}% ${F.eps[1] >= avgEps('FY28E') ? 'above' : 'below'}. Revenue and EBITDA are close; the gap is below EBITDA: we carry the acquired plants' depreciation and the debt taken on to buy them (MOSL's FY28E depreciation is ₹${n0(F.dep[1] - 6284)} cr lower than ours), and we tax the JV share inside PBT at the group rate with minorities. Q1FY27 EPS was ₹${n2(Q.eps)}; Q1 was 26% of the full year in FY25 and 13% in FY26 (a restructuring charge), which brackets our ₹${n1(F.eps[0])}.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
