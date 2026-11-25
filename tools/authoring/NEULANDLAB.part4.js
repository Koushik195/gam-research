// Neuland Laboratories report, part 4: moat, margins, earnings quality, capital allocation & returns, ownership, management and
// governance.
const X = require('./NEULANDLAB.ctx2');
const { C, D, A, F, AS, n0, n1, b, ai, SQ, SA, Q1, FY26, OIN, divYield, ptEbitda, ptEps, MULT, LINES } = X;
const MG = C.management, OW = D.ownership;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in complex chemistry, regulatory record and CMS lock-in; weak in generic pricing and diversification; unproven in peptides',
  blocks: [
    { p: 'A moat is a lasting advantage that lets a company earn more than its cost of capital for longer than rivals. Neuland has three genuine ones. First, chemistry: four decades of difficult reactions (deuterated molecules, chiral and cryogenic chemistry, peptide fragments) let it win development work that turns into exclusive supply. Second, a clean regulatory record over three USFDA-inspected plants, which innovators value above price. Third, lock-in: once its API is in an approved drug\'s filing, switching takes years. Its weaknesses are just as clear: generic Prime APIs are a price game, and in CMS the business rests on a few molecules owned by a few customers. Peptides are a bet, not yet an advantage.' },
    { verdicts: D.moat.map(m => [m.factor, m.score, m.evidence, m.score]), head: ['Factor', 'Score', 'Evidence', 'Detail'], title: 'Moat scorecard: two strong, one moderate, two weak, one unproven', source: 'Decks; AR FY26; CRISIL; calls; GAM Research' },
    { callout: '**Verdict:** a narrow moat, mostly molecule-specific. Neuland earns its returns where it is written into an innovator\'s filing, and those advantages last as long as each drug sells and stays on patent. The chemistry and regulatory record let it win the next molecules, but nothing guarantees it wins enough of them in time. We would pay for the existing commercial molecules and the funnel, not for a peptide franchise that has not yet sold a kilogram commercially.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins follow volume and mix: 22% in FY25, 29% in FY26, 35% in Q1FY27; we model 31% easing to 30.5% as new plants add fixed costs',
  blocks: [
    { p: `Neuland's EBITDA margin (before other income) was 15% in FY22, 30% in FY24, 22% in FY25 and ${n1(A.ebitdaMargin[b])}% in FY26. Two forces drive it. **Mix:** CMS molecules and Specialty APIs earn more than Prime APIs (management's ranking; segment margins are not disclosed), and material costs fell from ${SA[0].materialPct}% of revenue in FY22 to ${SA[4].materialPct}% in FY26 as CMS grew. **Volume:** employees (~17% of revenue) and manufacturing and other costs (~17-18%) are largely fixed, so a ₹776 cr quarter earns 40% and a ₹293 cr quarter 12%. The company gross margin (after manufacturing costs) was 61.2% in Q1FY27 vs 55.3% a year earlier. Management plans on "25% plus" and calls anything above it "a bonus"; it also says FY26 was helped by exchange rates.` },
    { pair: [
      { type: 'line', title: 'Quarterly margins and the CMS share move together', unit: '%', x: SQ.map(q => q.q), series: [{ name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct0' }, { name: 'CMS share of revenue', values: SQ.map(q => q.cmsPct), fmt: 'pct0' }], labels: 'last', min: 0, max: 80, source: 'Screener.in; company decks' },
      { type: 'column', title: 'Cost lines, % of revenue', unit: '% of revenue', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Materials', values: [37.3, 40.0, 37.6, 34.5], fmt: 'pct' }, { name: 'Employees', values: [16.7, 18.5, 17.0, 16.6], fmt: 'pct' }, { name: 'Other costs (incl. manufacturing)', values: [16.4, 19.0, 16.8, 14.2], fmt: 'pct' }], labels: 'all', source: 'Screener.in expense schedules' },
    ] },
    { exhibit: { type: 'table', title: 'From FY26 to our FY29E margin', head: ['Driver', 'Effect on margin', 'Why'], wide: [2], rows: [
      ['CMS share 61% → ~69%', 'Up', `CMS ₹${n0(LINES.cms[2])} cr of ₹${n0(F.sales[2])} cr in FY29E; richer than Prime`],
      ['Operating leverage on fixed costs', 'Up', 'Revenue +17% a year on a base of ~45% fixed costs'],
      ['Peptide plant and R&D centre', 'Down', 'Fixed costs (people, depreciation, lease) before peptide revenue (FY28+)'],
      ['Exchange rate', 'Down', 'FY26 had ₹10.6 cr of forex gains and a favourable rupee'],
      ['GDS pricing', 'Down', 'Prime APIs under price pressure'],
      { hl: true, cells: ['**Our EBITDA margin**', '**{{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}**', 'Above management\'s 25%+ plan, below Q1FY27\'s 34.7%; Nuvama (Dec-2025) 32%'] },
    ], source: 'Screener.in; calls; GAM estimates' } },
    { callout: `**Every point of margin** is ~₹${n0(ptEbitda)} cr of Sep-28E EBITDA, ~₹${n1(ptEps)} of EPS and ~₹${n0(ptEps * MULT.base)} a share at our ${MULT.base}x. A year like FY25 (22%) would cut our Sep-28E EPS by roughly a quarter.` },
  ],
};

const earnings = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audit and real profits, but a one-off property gain in FY25, forex help in FY26, ₹279 cr of merger goodwill and weak cash conversion in FY26',
  blocks: [
    { p: `MSKA & Associates audits Neuland; we found no qualification. Operating cash flow was ₹${A.cfo[b]} cr in FY26 (${Math.round(A.cfo[b] / A.ebitda[b] * 100)}% of EBITDA) after ₹${A.cfo[ai('FY25')]} cr in FY25; over FY21-26 it was ₹${n0(X.cfo6)} cr against ₹${n0(['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].reduce((s, y) => s + A.pat[ai(y)], 0))} cr of net profit, a healthy ratio. FY26 was the weak year: receivables jumped ₹226 cr and inventory ₹125 cr with the Q4 rush, and free cash flow was −₹49 cr; Q1FY27 reversed part of it. Six items deserve attention.` },
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'Effect'], wide: [0, 1], rows: C.accounting.map(a => [X.rup(a.item), X.rup(a.effect)]), source: C.accountingSrc } },
    { exhibit: { type: 'table', title: 'Other income, FY25 and FY26 (₹ crore)', head: ['', 'FY25', 'FY26', 'Recurring?'], rows: [
      ['Interest (deposits, security deposits, tax refunds)', n1(OIN.FY25.interestFd + OIN.FY25.interestDeposits + OIN.FY25.interestTaxRefund), n1(OIN.FY26.interestFd + OIN.FY26.interestDeposits), 'Yes, with cash balances'],
      ['Gains on mutual funds (fair value / redemption)', n1(OIN.FY25.mfGain), n1(OIN.FY26.mfGain), 'Part of treasury return; funds redeemed in FY26'],
      ['Net forex gains', n1(OIN.FY25.forex), n1(OIN.FY26.forex), 'No: follows the rupee'],
      ['Write-backs and claims', n1(OIN.FY25.writeBacks + OIN.FY25.insurance), n1(OIN.FY26.writeBacks), 'Small'],
      { hl: true, cells: ['**Total (company)**', `**${n1(OIN.FY25.total)}**`, `**${n1(OIN.FY26.total)}**`, `${n1(OIN.FY26.total / FY26.pbt * 100)}% of FY26 PBT`] },
      ['Screener basis (net of asset-sale losses; FY25 incl. the ₹76.4 cr gain)', '89.6', '24.9', 'Used in the model\'s history'],
    ], source: 'AR FY26 consolidated notes 21 and 28' } },
    { callout: '**Accounting flag: AMBER.** Revenue recognition, capitalisation and tax look normal and there are no minorities. But FY25 profit included a ₹76 cr property gain, FY26 benefited from forex, goodwill from a 2017 merger with promoter-linked entities is 15% of net worth, and the company discloses neither segment margins nor molecule names. A dispute over an edited call transcript (see governance) did not involve the accounts.' },
  ],
};

const capY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], sumY = key => capY.reduce((s, y) => s + (A[key][ai(y)] || 0), 0);
const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital allocation: self-funded, no dilution since 2018, ROCE 26% in FY26; now entering a heavier capex cycle that management says will lower returns',
  blocks: [
    { p: `In FY21-26 Neuland generated ₹${n0(sumY('cfo'))} cr of operating cash flow and spent ₹${n0(sumY('capex'))} cr on capex, raised no equity and went from net debt to net cash. Return on capital employed was ${A.roce[b]}% in FY26 (company: 26.1%) and ROE ${n1(A.roe[b])}%, against 2-11% in FY18-22 when Unit III was idle. Dividends rose to ₹34 a share for FY26 (12% payout, ${n1(divYield)}% yield). The next phase is different: ₹1,460 cr of projects approved in 13 quarters, "much higher" capex to come, and possibly overseas investment or acquisitions for new modalities. The CEO: "you should see maybe a dip in ROCE, but not necessarily a dip in margins".` },
    { pair: [
      { type: 'line', title: 'Returns: ROE and return on operating capital', unit: '%', x: 'fin.labels', from: 'FY18', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'Return on operating capital (ex cash)', ref: 'fin.coreRoce', fmt: 'pct' }], labels: 'last', min: 0, max: 40, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Where the cash went in FY21-26', unit: '₹ crore (six years)', x: ['Operating cash flow', 'Capex', 'Dividends', 'Net debt → net cash'], series: [{ name: '₹ cr', values: [sumY('cfo'), -sumY('capex'), -Math.round(capY.reduce((s, y) => s + (A.dividendsPaid?.[ai(y)] || 0), 0)), Math.round(-A.netDebt[b] + A.netDebt[ai('FY20')])], fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow' },
    ] },
    { callout: `**Our view:** capital allocation has been sound since FY21: plants filled, no dilution, debt repaid. The risk is the next cycle. We forecast ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} as capex runs at ₹${AS.capex.join('/')} cr; free cash flow is ~₹${n0(F.fcf[0])} cr in FY27E before rising. Overseas acquisitions in new modalities would be a new risk for a company that has grown organically.` },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The promoter group owned ${OW.promoters}% at Jun-2026, unchanged within half a point since 2023. Most of it (25.98%) sits in the Davuluri Ownership Trust, set up in FY25 from the founder's and his wife's shares; the founder Dr. D. R. Rao holds 1.63% directly, Sucheth Rao 2.01% and Saharsh Rao 1.52%. Nothing is pledged. Foreign investors own ${OW.fiis}% (Malabar India Fund 5.65% at Mar-2026), domestic institutions ${OW.diis}% (up from 6.0% in Dec-2023) and ~${n0(OW.shareholders)} others ${OW.public}%, including investor Mukul Agrawal with ~3.1%. Free float is ~67%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', '% of shares', 'As of'], rows: OW.named.map(h => [h.holder, `${h.pct}%`, h.asOf]), source: OW.src } },
  { callout: '**Our read:** a family-controlled company with a minority stake (~33%) that has neither sold nor bought meaningfully. The rise of domestic funds (6% to 16.5%) explains part of the re-rating; a stake this widely held can also move quickly the other way.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: an able founder family with a clean regulatory record, but high promoter pay (8.6% of PBT), thin disclosure and a transcript dispute',
  blocks: [
    { p: `Neuland is run by the founder's family: Dr. D. R. Rao (Executive Chairman), Saharsh Rao (CEO & MD from 1-Apr-2026, builder of the CMS business) and Sucheth Rao (Executive Vice Chairman). CFO Abhijit Majumdar and strategy head Sajeev Medikonda handle investors. Five independent directors sit on the board with a non-independent non-executive director (Dr. Mauricio Futran, from May-2026) and the three promoters. The three promoters were paid ₹42.3 cr in FY26 (₹30.2 cr in FY25), ~8.6% of pre-tax profit and 209-222x the median employee, and the company also pays rent to two of them and to a relative.` },
    { verdicts: [
      ['Founders and succession', 'Strong', 'Second generation in charge; a pre-planned role split from 1-Apr-2026', 'Continuity high'],
      ['Board independence', 'Moderate', '5 independent of 9; executive chairman; one director died in Feb-2026', 'Adequate'],
      ['Audit', 'Moderate', 'MSKA & Associates LLP, Chartered Accountants', 'No qualification found'],
      ['Promoter pay', 'Weak', '₹42.3 cr for three promoters in FY26 (+40%), ~8.6% of PBT, 209-222x the median employee', 'High for a ₹2,000 cr-revenue company'],
      ['Related parties', 'Moderate', 'Rent ~₹3.5 cr to promoters/relative; CSR via the promoter-linked Neuland Foundation; 2017 merger of promoter entities', 'Small but present'],
      ['Disclosure', 'Weak', 'No segment margins, no molecule names; good funnel and concentration data', 'Investors cannot track the key molecules'],
      ['Investor communication', 'Moderate', 'Full call audio published; an investor alleged an edited transcript (Q3FY26); CFO: "no change in this section"', 'Watch'],
      ['Regulatory compliance', 'Strong', 'No OAI, warning letter or import alert ever (CRISIL)', 'A real strength'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (board report pp.87, 114; notes 37, 39); calls; CRISIL; GAM Research' },
    { callout: '**Overall: AMBER.** We see a capable, long-term owner family and an excellent compliance record. The issues are pay (a large and rising share of profit), limited disclosure of what drives the business, and related-party habits that are small but persistent. None changes our valuation; each lowers our confidence in what is not disclosed.' },
  ],
};

module.exports = { moat, margins, earnings, capital, ownership, governance };
