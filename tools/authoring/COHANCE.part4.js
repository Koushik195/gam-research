// Cohance Lifesciences report, part 4: moat, margins (entity build), earnings quality, capital allocation & returns, ownership
// (Advent, the pledge), management and governance (the leadership churn).
const X = require('./COHANCE.ctx');
const { C, D, A, F, n0, n1, b, ai, SQ, Q1, OIN, MULT, YRS, LINES, NJ, spEbitda, standaloneEbitda, standaloneRev, sep, SHARES, AS } = X;
const OW = D.ownership, MG = C.management;
const ptEbitda = sep(F.sales) / 100, ptEps = ptEbitda * (1 - AS.taxRate[1] / 100) / SHARES;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real chemistry and innovator relationships, but narrow; the new platforms and the quality record have not earned a moat',
  blocks: [
    { p: 'A moat is an advantage that lets a company earn more than its cost of capital for longer than rivals. Cohance has two real ones. First, relationships: once an intermediate or API is in an innovator\'s approved process, switching takes years, and Suven had 30-year relationships with large drug companies. Second, chemistry and cost in niche APIs (controlled substances, CNS molecules, top-three global shares). Against that: the relationships did not widen for years, two big molecules destocked at once, the ADC and oligonucleotide platforms are small or loss-making, and the regulatory record took two hits in 2026. The new chairman\'s own words: Cohance "is getting onto that path" that Divi\'s and Laurus took years to build.' },
    { verdicts: D.moat.map(m => [m.factor, m.score, m.evidence, m.score]), head: ['Factor', 'Score', 'Evidence', 'Detail'], title: 'Moat scorecard: three moderate, three weak', source: 'AR FY26; Q4FY26 and Q1FY27 calls; GAM Research' },
    { callout: '**Verdict:** a narrow moat. Good enough to keep the niche-API franchise and the anchor innovator relationships; not enough to protect margins when a few molecules move against it, as FY26 showed. We would pay for the API+ franchise and for a CDMO recovery we can see in orders, not for a platform story that has yet to earn money.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: `Margins: gross margin held at ~71%; EBITDA fell from 31% to 19% (FY26) and 0.3% (Q1FY27) on fixed costs and NJ Bio; we model ${AS.ebitdaMargin[0]}% → ${AS.ebitdaMargin[2]}%`,
  blocks: [
    { p: `The margin collapse is an operating-leverage story, not a pricing one. Gross margin (after materials) was 68.7% in FY25, 70.8% in FY26 and 71.5% in Q1FY27. What changed is the cost base: employee costs rose from ₹448 cr to ₹508 cr and other costs from ₹547 cr to ₹671 cr in FY26 (incl. ₹45 cr of one-time items), while revenue fell ₹340 cr. In Q1FY27 the cost base was ~₹300 cr a quarter (employees ₹133 cr, manufacturing ₹93 cr, other ₹74 cr) against revenue of ₹422 cr. By entity, the standalone business made a 24.6% adjusted margin in FY26 and 9.2% in Q1FY27; NJ Bio lost ₹${n1(-Q1.njBioAdjEbitda)} cr at EBITDA in Q1; Sapala made a strong margin on a small base. The company does not disclose segment margins.` },
    { pair: [
      { type: 'line', title: 'Quarterly margins: gross margin steady, EBITDA margin down', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin (reported)', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 80, source: 'Screener.in' },
      { type: 'column', title: 'Cost lines, % of revenue: employees and other costs up', unit: '% of revenue', x: ['FY24 (Suven)', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Materials', values: [30.0, 31.3, 29.2, 28.5], fmt: 'pct' }, { name: 'Employees', values: [12.9, 17.2, 22.4, 31.5], fmt: 'pct' }, { name: 'Other costs', values: [18.5, 21.0, 29.6, 39.8], fmt: 'pct' }], labels: 'all', source: 'Screener.in expense schedules' },
    ] },
    { exhibit: { type: 'table', title: 'Our margin path by entity (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Standalone revenue (small molecules, API+, spec chem)', n0(C.fy26.standaloneRevenue), ...standaloneRev.map(n0)],
      ['Standalone EBITDA (margin)', `${n0(C.fy26.standaloneEbitda)} (22.4%)`, ...standaloneEbitda.map((e, i) => `${n0(e)} (${n1(e / standaloneRev[i] * 100)}%)`)],
      ['NJ Bio EBITDA', '−22 (with Sapala)', ...NJ.ebitda.map(n0)],
      ['Sapala EBITDA', 'in the line above', ...spEbitda.map(n0)],
      { hl: true, cells: ['**Consolidated EBITDA (margin)**', `**${n0(A.ebitda[b])} (${n1(A.ebitdaMargin[b])}%)**`, ...F.ebitda.map((e, i) => `**${n0(e)} (${n1(F.ebitdaMargin[i])}%)**`)] },
    ], source: 'AR FY26 (standalone and consolidated P&L, note 18(b)); Q1FY27 deck; GAM estimates. FY26 subsidiaries\' EBITDA = consolidated less standalone' } },
    { callout: `**Every point of margin** is ~₹${n0(ptEbitda)} cr of Sep-28E EBITDA, ~₹${n1(ptEps)} of EPS and ~₹${n0(ptEps * MULT.base)} a share at ${MULT.base}x. Management guides FY27 "closer to" FY26's 21% adjusted margin and acceleration from FY28; after a 2.2% Q1 that needs ~26% adjusted for nine months, which we do not assume. Street FY27E-29E: BOBCAPS 18 / 23 / 26%.` },
  ],
};

const earnings = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: a clean audit, but "adjusted" numbers, recurring one-offs, minorities that flatter the loss and ₹1,284 cr of goodwill',
  blocks: [
    { p: `Walker Chandiok & Co (Grant Thornton in India) audits Cohance; we found no qualification. Operating cash flow was ₹${A.cfo[b]} cr in FY26 (${Math.round(A.cfo[b] / A.ebitda[b] * 100)}% of EBITDA) and free cash ₹173 cr (company), helped in Q1FY27 by a ₹195 cr fall in receivables. Six items deserve attention.` },
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'Effect'], wide: [0, 1], rows: C.accounting.map(a => [a.item, a.effect]), source: C.accountingSrc } },
    { exhibit: { type: 'table', title: 'Other income, FY25 and FY26 (₹ crore)', head: ['', 'FY25', 'FY26', 'Recurring?'], rows: [
      ['Gains on liquid mutual funds', n1(OIN.FY25.mfGains), n1(OIN.FY26.mfGains), 'Yes, with the cash balance (~7% yield in FY26)'],
      ['Interest on deposits', n1(OIN.FY25.interest), n1(OIN.FY26.interest), 'Yes'],
      ['Net forex gains', n1(OIN.FY25.forex), n1(OIN.FY26.forex), 'No: follows the rupee'],
      ['Miscellaneous and write-backs', n1(OIN.FY25.misc + OIN.FY25.writeBacks), n1(OIN.FY26.misc + OIN.FY26.writeBacks), 'Partly (~₹3 cr a year)'],
      ['Asset sales, derivative and lease gains', n1(OIN.FY25.ppeGain + OIN.FY25.callOption + OIN.FY25.leaseGain), n1(OIN.FY26.ppeGain + OIN.FY26.callOption), 'No'],
      { hl: true, cells: ['**Total**', `**${n1(OIN.FY25.total)}**`, `**${n1(OIN.FY26.total)}**`, 'Screener nets exceptional items here (FY26 ₹4.6 cr)'] },
    ], source: 'AR FY26 consolidated note 27' } },
    { callout: '**Accounting flag: AMBER.** Nothing looks aggressive in revenue recognition, but the company leads with "adjusted" EBITDA that adds back ₹45-63 cr of "one-time" costs a year (ESOP, inventory provisions, customer adjustments, M&A), and exceptional charges recurred in FY25 and FY26. The minorities absorb 44% of NJ Bio\'s losses, which flatters attributable profit. Goodwill (₹1,284 cr) rests on optimistic NJ Bio assumptions. We forecast reported EBITDA, no exceptional items and no FX gains.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital allocation: ~₹1,500 cr committed to two bolt-ons that lose money in aggregate; ROE fell from 17% to under 5%',
  blocks: [
    { p: `In FY25-26 the merged company generated ₹${n0(A.cfo[ai('FY25')] + A.cfo[b])} cr of operating cash, spent ₹${n0(A.capex[ai('FY25')] + A.capex[b])} cr on capex and committed ~₹806 cr to the Sapala and NJ Bio stakes plus a ₹696 cr obligation to buy the rest. No dividend has been paid since the merger. Return on equity fell from 17.1% (FY25) to ${n1(A.roe[b])}% (FY26); the company's own adjusted ROCE (excluding goodwill) fell from 26.9% to 10.8%. FY27 capex is guided at ~₹300 cr (oligonucleotides, NJ Bio's US facility, high-potency upgrades).` },
    { pair: [
      { type: 'line', title: 'Returns: ROE from 45% (Suven) to under 5%, slow recovery', unit: '%', x: 'fin.labels', from: 'FY21', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'last', min: 0, max: 50, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Where the money went, FY25-26 (₹ crore)', unit: '₹ crore', x: ['Operating cash flow', 'Capex', 'NJ Bio 56%', 'Sapala 67.5%', 'Buy-out liability'], series: [{ name: '₹ cr', values: [A.cfo[ai('FY25')] + A.cfo[b], -(A.capex[ai('FY25')] + A.capex[b]), -548, -258, -696], fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow; AR FY26 notes 22, 43' },
    ] },
    { callout: `**Our view:** the capital deployed since the merger has not earned its cost yet. We forecast ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} for FY27-29E against a 12.8% cost of equity; even FY29E is well short.` },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `Advent International controls Cohance through two vehicles: **Berhyanda Ltd (33.34%)**, which bought Suven from the Jasti family, and **Jusmiral Holdings (24.15%)**, which received shares for Cohance in the merger; together ${OW.promoters}% at Jun-2026. Jusmiral sold 3,41,48,000 shares (8.92%) at ~₹906 on 18-Sep-2025 (₹3,094 cr, mainly to repay borrowings under a notes purchase agreement; HDFC MF and SBI MF bought 1.67%), with a 210-day lock-up that has expired. On 16-Jun-2026 the two vehicles refinanced that debt with a **US$285 mn term loan secured by a pledge of 20.8 cr shares, 54.36% of the company** (94.6% of their holding). The Jasti family still held 2.51% at Mar-2026 (9.90% of Suven before the merger). Domestic institutions own ${OW.diis}%, foreign investors ${OW.fiis}% and ~${n0(OW.shareholders)} others ${OW.public}%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', '% of shares', 'As of'], rows: OW.named.map(h => [h.holder, h.pct == null ? 'n.d.' : `${h.pct}%`, h.asOf]), source: OW.src } },
  { callout: '**Our read:** a private-equity owner with a leveraged holding company is a seller over time. Advent has already sold once (at roughly twice today\'s price) and has borrowed against most of its shares; a fall in the share price could force action under the loan, and any further block sale weighs on the stock. On the other side, Advent has hired a high-profile chairman and has every reason to rebuild value before it exits.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a strong new chairman after a year of churn; an Advent-controlled board with five independents; no CFO named by 30-Sep',
  blocks: [
    { p: `${MG.people[0][0]} became Executive Chairman on 1-May-2026 and Group CEO on 20-May-2026 after a decade as MD & Global CEO of Cipla. He replaced Vivek Sharma, who stepped down for personal reasons (he was paid 269x the median employee in FY26). Business heads: Yann D'Herve (Pharma CDMO), Gunjan Singh (API+), Amrit Singh (Specialty Chemicals). The year before was turbulent: ${MG.departures}. The board: ${MG.board}.` },
    { verdicts: [
      ['Leadership', 'Moderate', 'Umang Vohra is a proven operator (Cipla 2016-26); but four senior exits in eleven months and no CFO named by 30-Sep', 'Credibility up, continuity low'],
      ['Board independence', 'Moderate', '5 independent directors with 3 Advent nominees and an executive chairman', 'Adequate; Advent controls'],
      ['Audit', 'Strong', 'Walker Chandiok & Co LLP; no qualification found', 'Clean'],
      ['Promoter leverage', 'Weak', '54.36% of the company pledged for Advent\'s US$285 mn holdco loan (Jun-2026)', 'Overhang; forced-sale risk in a fall'],
      ['Related parties', 'Moderate', 'Fellow Advent companies; the merger itself was a related-party deal at 11:295', 'Fairness rests on the valuers\' reports'],
      ['Guidance record', 'Weak', 'US$1 bn / mid-30s by FY30 kept in Nov-2025, FY26 guidance cut twice, now "an aspiration"', 'Discount management targets'],
      ['Disclosure', 'Moderate', 'Segment revenue and entity data on calls; no segment margins, no molecule or customer concentration', 'Hard to track the key molecules'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (Board\'s report, remuneration annexure, notes 17, 35); calls; pledge disclosures; GAM Research' },
    { callout: '**Overall: AMBER.** We see no sign of minority abuse, the auditor is reputable and the new chairman is a clear upgrade. The issues are a leveraged private-equity owner, a record of missed targets and a year of leadership churn. None changes our valuation directly; each lowers the confidence we place on management\'s recovery path.' },
  ],
};

module.exports = { moat, margins, earnings, capital, ownership, governance };
