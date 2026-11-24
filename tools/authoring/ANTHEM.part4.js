// Anthem Biosciences report, part 4: moat, quality and regulatory record, margins, earnings quality, capital allocation,
// ownership, management and governance.
const X = require('./ANTHEM.ctx');
const { C, D, A, F, AS, n0, n1, b, ai, sep, SQ, Q1, FY26, OIN, divYield, ptEbitda, ptEps, MULT, SHARES, cashPath } = X;
const MG = C.management, OW = D.ownership;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in technology, integration and regulatory record; weak in scale and customer spread',
  blocks: [
    { p: 'A moat is a lasting advantage that lets a company earn more than its cost of capital for longer than rivals. Anthem has one, of a particular kind. Its returns (ROE ~20-22%, EBITDA margins near 40% before other income) come from doing complex chemistry and biology cheaply and reliably for clients who cannot easily switch once a molecule is filed. What it lacks is scale (425 KL of reactors against several thousand at Divi\'s or Laurus) and spread (three customers are 57% of revenue). Indian rivals (Syngene, Sai Life, Divi\'s, Laurus, Cohance, Aragen) and Chinese CDMOs compete for the same biotech work.' },
    { verdicts: D.moat.map(m => [m.factor, m.score, m.evidence, m.score]), head: ['Factor', 'Score', 'Evidence', 'Detail'], title: 'Moat scorecard: three strong, one moderate, two weak', source: 'AR FY26; RHP; calls; JM, Jefferies and Nomura notes; GAM Research' },
    { callout: '**Verdict:** a genuine but narrow moat. The integration from discovery to commercial supply, the process technology and the clean regulatory record explain the margins and why biotechs keep molecules with Anthem. But switching costs protect a molecule only while its owner stays loyal, and an acquirer can move supply; size limits the commercial volumes Anthem can win. We would pay a premium for the economics, not for durability it has not yet shown at scale.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Quality & regulatory', kicker: 'Regulatory', title: 'Quality and regulatory record: four USFDA approvals at Unit I, clean audits at Unit II, no warning letter; old Drugs & Cosmetics Act cases are stayed',
  blocks: [
    { p: 'For a contract manufacturer the regulatory record is the licence to operate. Anthem\'s Unit I has four USFDA approvals and Unit II has passed two USFDA audits, plus Japan\'s PMDA, Australia\'s TGA, Brazil\'s ANVISA (first audit in 2024) and EU qualified-person certification; we found no warning letter, import alert or recall in the filings. Unit III (NeoAnthem) is new and will need its first inspections as commercial work moves in, and Unit IV after FY28.' },
    { exhibit: { type: 'table', title: 'Outstanding legal matters disclosed in the RHP', head: ['Matter'], rows: C.litigation.map(l => [l]), source: 'Abridged prospectus (outstanding litigation summary, Jul-2025)' } },
    { callout: '**Our view:** quality is a strength and a reason clients award commercial supply. The legal cases date from the 2016-2021 sale of clomiphene and enclomiphene citrate by an erstwhile subsidiary (Anthem Cellutions, since merged), including a complaint naming Ajay Bhardwaj; all are stayed by High Courts. They are small in money terms, but they concern selling a drug ingredient without the right licence, so we flag them under governance.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: gross margin up ~6 points since backward integration; we model a 40-40.5% EBITDA margin, in line with the street',
  blocks: [
    { p: `Anthem's EBITDA margin before other income was 40.8% in FY23, fell to 35.7-36.4% in FY24-25 and recovered to ${n1(A.ebitdaMargin[b])}% in FY26. The swing is mostly gross margin. In FY24-25 one large client product depended on an intermediate Anthem bought (largely from China), pushing material costs up; during FY26 Anthem started making it in-house, and gross margin moved from 57-59% in Q1-Q2FY26 to 64.7-66.3% from Q3FY26 (Q1FY27: 65.0%; CRDMO 68%, specialty ingredients 51%). Employee costs (~13% of sales) and other expenses (~9-10%) are largely fixed, so margins move with revenue in a given quarter (Q1FY27: 36.1% on a 23% revenue fall). Company-reported EBITDA adds all other income (FY26: 43.4%); we use the Screener basis throughout.` },
    { pair: [
      { type: 'line', title: 'Quarterly margins: gross margin stepped up from Q3FY26', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 20, max: 75, source: 'Screener.in (gross margin = 100 − material cost %; EBITDA before other income)' },
      { type: 'column', title: 'Cost lines, % of revenue: materials down, people up', unit: '% of revenue', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Materials', values: [42.2, 40.3, 38.2, 35.0], fmt: 'pct' }, { name: 'Employees', values: [12.9, 14.1, 13.3, 18.9], fmt: 'pct' }, { name: 'Other costs', values: [9.3, 9.1, 9.2, 10.2], fmt: 'pct' }], labels: 'all', source: 'Screener.in expense schedules' },
    ] },
    { exhibit: { type: 'table', title: 'From FY26 to our FY27E margin', head: ['Step', 'EBITDA margin', 'Why'], wide: [2], rows: [
      ['FY26 reported (Screener basis)', `${n1(A.ebitdaMargin[b])}%`, 'Gross margin 61.8% for the year; ~65% in H2 after backward integration'],
      ['Q1FY27 reported', `${Q1.ebitdaScreenerPct}%`, 'Revenue −23%; employee cost 18.9% of sales on the lower base'],
      ['Full-year gross margin ~64%', '+2 to +3 pts', 'Backward integration for the whole year; mix of SI and development batches dilutes a little'],
      ['Employee and other costs ~23.5% of sales', '−0.5 pt', 'Management: ~13% and 9-10%; Unit IV hiring starts'],
      { hl: true, cells: ['**Our FY27E**', '**{{F.ebitdaMargin.0|pct}}**', 'Street FY27E: BOBCAPS 38.1%, PL 39.6%'] },
      ['Our FY28E / FY29E', '{{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}', 'Operating leverage in FY28; Unit IV costs ahead of volumes in FY29'],
    ], source: 'Screener.in; company calls; broker notes; GAM estimates' } },
    { callout: `**Every point of margin** is ~₹${n0(ptEbitda)} cr of Sep-28E EBITDA, ~₹${n1(ptEps)} of EPS and ~₹${n0(ptEps * MULT.base)} a share at our ${MULT.base}x. The bigger risk is not a cost overrun but a revenue shortfall: with ~23% of sales in fixed costs, a quarter like Q1FY27 takes 3-4 points off the margin.` },
  ],
};

const oiY = [['Interest on deposits and bonds', 'interest'], ['Capital and fair-value gains on funds', null], ['Forex gains (net)', 'forex'], ['Export incentives (RoDTEP)', 'rodtep'], ['Grants, lease rent and other', null]];
const earnings = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean cash conversion in FY26, but other income is 18% of PBT and partly forex; definitions and one-offs need watching',
  blocks: [
    { p: `K.P. Rao & Co., a Bengaluru firm, audits Anthem; we found no qualification. Operating cash flow was ₹844 cr in FY26 (101% of EBITDA) after two weak years (₹140 cr in FY24, ₹271 cr in FY25) in which inventory and receivables absorbed cash; over FY21-26 operating cash flow was ₹${n0(X.cfo6)} cr against ₹${n0(A.pat.slice(1).reduce((s, x) => s + x, 0))} cr of profit. Six items deserve attention.` },
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'Effect'], wide: [0, 1], rows: C.accounting.map(a => [a.item, a.effect]), source: 'AR FY26 (notes 23, 24, 30, 43, NeoAnthem accounts); Q1FY27 deck and call' } },
    { exhibit: { type: 'table', title: 'Other income, FY25 and FY26 (₹ crore)', head: ['', 'FY25', 'FY26', 'Recurring?'], rows: [
      ['Interest on deposits, bonds and advances', n1(OIN.FY25.interest), n1(OIN.FY26.interest), 'Yes, with the cash pile; yields falling'],
      ['Capital and fair-value gains on funds', n1(OIN.FY25.capitalGains + OIN.FY25.fvGainFunds), n1(OIN.FY26.capitalGains + OIN.FY26.fvGainFunds), 'Partly (market-linked)'],
      ['Forex gains (net)', n1(OIN.FY25.forex), n1(OIN.FY26.forex), 'No: follows the rupee'],
      ['Export incentives (RoDTEP)', n1(OIN.FY25.rodtep), n1(OIN.FY26.rodtep), 'Yes, while the scheme lasts'],
      ['Grants, lease rent and other', n1(OIN.FY25.grant + OIN.FY25.other + OIN.FY25.leaseRent), n1(OIN.FY26.grant + OIN.FY26.other + OIN.FY26.leaseRent), 'Small'],
      { hl: true, cells: ['**Total**', `**${n1(OIN.FY25.total)}**`, `**${n1(OIN.FY26.total)}**`, `${n1(OIN.FY26.total / FY26.pbtPreExc * 100)}% of FY26 PBT before exceptional items`] },
    ], source: 'AR FY26 consolidated note 24' } },
    { callout: '**Accounting flag: AMBER.** Nothing looks aggressive in revenue or costs, and the tax rate is ordinary. But reported growth in FY26 leaned on forex gains (₹58 cr vs ₹7 cr), a falling ESOP charge and a treasury book of NBFC bonds and market-linked debentures; the company\'s EBITDA includes all of it; and FY26 sales returns rose to ₹59 cr. We forecast no forex gains and treasury income at 6.0% on average net cash.' },
  ],
};

const capY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], sumY = key => capY.reduce((s, y) => s + (A[key][ai(y)] || 0), 0);
const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital allocation: modest capex, a pre-IPO buy-back, a first dividend and a growing cash pile; returns ~20-22% but diluted by idle cash',
  blocks: [
    { p: `In FY21-26 Anthem generated ₹${n0(sumY('cfo'))} cr of operating cash flow and spent ₹${n0(sumY('capex'))} cr on capex (Screener's plant purchases; the AR also shows CWIP of ₹264-345 cr in FY24-26), bought back ₹149 cr of shares (Dec-2023), raised ₹248 cr of equity in FY22 and repaid most of its debt; the rest became a ₹1,374 cr net cash pile by Mar-26. It made no acquisitions and says it is looking ("we will not do an acquisition for the sake of an acquisition", CEO). The first dividend, ₹2 a share (~19% of FY26 EPS, ~${n1(divYield)}% yield), came after the IPO. ROE was ${n1(A.roe[b])}% in FY26; excluding the treasury book the return on operating capital is far higher. We forecast ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} as Unit IV absorbs cash before it earns.` },
    { pair: [
      { type: 'line', title: 'Returns: ROE ~20-22%; core return on operating capital much higher', unit: '%', x: 'fin.labels', from: 'FY21', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'Return on operating capital (ex cash)', ref: 'fin.coreRoce', fmt: 'pct' }], labels: 'last', min: 0, max: 60, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Where the cash went in FY21-26', unit: '₹ crore (six years)', x: ['Operating cash flow', 'Capex (plant)', 'Buy-back', 'Equity raised (FY22)', 'Increase in net cash'], series: [{ name: '₹ cr', values: [sumY('cfo'), -sumY('capex'), -149, 248, Math.round(-A.netDebt[b] - (-A.netDebt[0]))], fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow; AR FY26 note 15 (buy-back)' },
    ] },
    { callout: '**Our view:** capital has been allocated conservatively and well: high-return plants, no debt, no empire-building. The next three years test it: ₹1,900 cr of capex in FY27-29E is ~3x the FY24-26 run-rate (~₹200 cr a year), and the cash pile invites an acquisition. Shareholders would benefit from a clearer payout policy while Unit IV is built.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The promoter group owned ${OW.promoters}% at Jun-2026: Ajay Bhardwaj 42.53%, his son Ishaan 10.16%, co-founders Ganesh Sambasivam 8.13% and K Ravindra Chandrappa 7.77% (Mar-2026), and family members ~2.9%. No pledge is reported. Domestic institutions own ${OW.diis}% (mutual funds ${OW.mutualFunds}%), foreign investors ${OW.fiis}% and ~${n0(OW.shareholders)} others ${OW.public}%. The free float is ~29% (~₹14,000 cr at the 30-Sep price).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who sold, and when', head: ['When', 'Seller', 'Stake', 'Value / price'], wide: [1], rows: OW.blocks.map(x => [X.shortDate(x.date), x.who, x.stake, x.value]), source: 'AR FY26 notes 15, 48; The Week/PTI (9-Mar-2026); Medical Dialogues (22-Jun-2026)' } },
  { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', '% of shares', 'As of'], rows: OW.named.map(h => [h.holder, `${h.pct}%`, h.asOf]), source: 'AR FY26 note 15; Screener shareholding (Jun-2026); PL (22-Jul-2026)' } },
  { callout: `**Our read:** the PE overhang is gone (True North fully out by Mar-2026) and institutions absorbed ₹2,537 cr of blocks in 2026 at ₹621-745. But two of four promoters sold in the IPO and a promoter-group member exited in Jun-2026; the promoters' 18-month minimum-contribution lock-in ends around Jan-2027. More promoter-group selling is plausible; we would read it as liquidity-seeking, not a signal, unless Ajay Bhardwaj sells.` },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a capable founder team with a long record; family control, a small audit firm, legacy drug-law cases and promoter selling to watch',
  blocks: [
    { p: `Anthem is run by its three founders: Ajay Bhardwaj (Chairman, MD & CEO; ex-Biocon), Ganesh Sambasivam (Whole-time Director & CSO; ex-Syngene) and K Ravindra Chandrappa (Whole-time Director & COO), with CFO Gawir Baig. Each founder was paid ~₹6.6 cr in FY26 (₹6.1 cr in FY25); the three together ~2.4% of pre-tax profit. Ishaan Bhardwaj (VP, promoter) and the daughters of the other two founders are employees. The board has eight directors: three executive promoters, one nominee director and four independents (Ramesh Ramadurai, Ravikant Uppal, S. Madhavan, Shubha Kulkarni), with an executive chairman. ~40% of employees held ESOPs when the scheme was announced (CEO).` },
    { verdicts: [
      ['Founders and succession', 'Moderate', 'Three founders in their roles for 20 years; no named succession plan', 'Continuity high; key-person risk too'],
      ['Board independence', 'Moderate', '4 of 8 independent with an executive chairman (the legal minimum)', 'Adequate, not strong'],
      ['Audit', 'Moderate', 'K.P. Rao & Co. (Bengaluru), not a large network firm, for a ₹48,000 cr company', 'No qualification; a rotation to a bigger firm would help'],
      ['Related parties', 'Moderate', `Anthem Biopharma Pvt Ltd (common directors): loan ₹7.8 cr, dues ₹3.1 cr, guarantee ₹7.5 cr`, 'Small, but unnecessary for a listed company'],
      ['Legal and compliance', 'Moderate', 'Drug-licence complaints over clomiphene/enclomiphene (2016-21), one naming the CEO; all stayed', 'Legacy, but about compliance'],
      ['Promoter selling', 'Moderate', 'Two founders sold ₹700 cr in the IPO; a promoter-group member sold 3.05% in Jun-2026', 'Ajay Bhardwaj has not sold'],
      ['Pay', 'Strong', '~₹20 cr for three founder-directors (~2.4% of PBT); CFO ₹3.1 cr', 'Moderate for the profits earned'],
      ['Disclosure', 'Moderate', 'Discloses customer shares, pipeline counts, utilisation and mix; no customer, molecule or segment-profit names; quarterly guidance avoided', 'Better than most CDMOs; still thin on molecules'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (note 45, CARO annexure); abridged prospectus; block-deal reports; GAM Research' },
    { callout: '**Overall: AMBER.** We see no sign of minority abuse, the founders own two-thirds of the company and the calls are unusually candid. The issues are structural (family control, an executive chairman, a small auditor) and historical (the drug-licence cases), plus continuing promoter-group selling. None changes our valuation.' },
  ],
};

module.exports = { moat, quality, margins, earnings, capital, ownership, governance };
