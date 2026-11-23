// Tube Investments of India report, part B-4: competitive advantage, Q1FY27 and guidance, earnings quality, ownership,
// management & governance.
const X = require('./TIINDIA.ctx');
const { C, D, F, SQ, QL, n0, n1, price } = X;
const Q1 = C.q1fy27, O = D.ownership.jun26;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale in tubes and chains, and a capital-allocation edge; no moat in cycles or EVs',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard', head: ['Source', 'Evidence', 'Strength'], wide: [1], rows: [
      ['Scale and approvals in precision tubes', 'India\'s largest maker; plants next to auto clusters; 12-13% PBIT margin through the cycle', 'GREEN'],
      ['Leadership in auto chains and door frames', 'Market leader in drive and cam chains; preferred roll-formed door-frame supplier; aftermarket brands', 'AMBER: margin fell from 12% to 10% in three years'],
      ['Brands in cycles', 'BSA, Hercules, Montra, Mach City; 10,000+ dealers', 'RED: a ~2% margin business'],
      ['EV businesses', '28% share in e-trucks, 27% in e-SCVs, but 7-11 competitors in each and losses', 'RED: no moat yet'],
      ['Returns on capital', 'Pre-tax ROIC 44-55% in FY22-26 (standalone)', 'GREEN'],
      ['Capital allocation', 'CG Power: ₹806 cr cost, ~₹75,700 cr value; ventures since then unproven', 'GREEN for the record, AMBER for the current bets'],
    ], source: 'TII AR FY26, decks and calls; GAM Research' } },
    { callout: '**Verdict:** TII\'s standalone business has a narrow, real advantage (scale, approvals, high asset turns) that shows up in returns rather than in pricing power: steel costs pass straight through, and margins are capped at ~12-13%. The wider "moat" is the Murugappa team\'s record in buying and fixing businesses. That is valuable but cannot be underwritten forward; the EV, medical and CDMO ventures have to prove it again.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: volumes up 17%, margins squeezed by steel, EV losses past their peak',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Standalone revenue', n0(Q1.standalone.revenuePy), n0(Q1.standalone.revenue), `+${n1((Q1.standalone.revenue / Q1.standalone.revenuePy - 1) * 100)}%`],
      ['Standalone PBT', n0(Q1.standalone.pbtPy), n0(Q1.standalone.pbt), `${n1((Q1.standalone.pbt / Q1.standalone.pbtPy - 1) * 100)}%`],
      ['Standalone PAT', n0(Q1.standalone.patPy), n0(Q1.standalone.pat), `${n1((Q1.standalone.pat / Q1.standalone.patPy - 1) * 100)}%`],
      ['CG Power revenue (consolidated)', n0(Q1.cg.revenuePy), n0(Q1.cg.revenue), `+${n1((Q1.cg.revenue / Q1.cg.revenuePy - 1) * 100)}%`],
      ['CG Power PBT', n0(Q1.cg.pbtPy), n0(Q1.cg.pbt), `+${n1((Q1.cg.pbt / Q1.cg.pbtPy - 1) * 100)}%`],
      ['Shanthi Gears revenue', n0(Q1.sg.revenuePy), n0(Q1.sg.revenue), `${n1((Q1.sg.revenue / Q1.sg.revenuePy - 1) * 100)}%`],
      ['EV segment revenue / loss', `~135 / (${n0(C.ticmpl.evSegment.lossQ1FY26)})`, `${C.ticmpl.evSegment.revQ1FY27} / (${n0(C.ticmpl.evSegment.lossQ1FY27)})`, 'revenue +77%'],
      ['Consolidated revenue', n0(Q1.consolidated.revenuePy), n0(Q1.consolidated.revenue), `+${n1((Q1.consolidated.revenue / Q1.consolidated.revenuePy - 1) * 100)}%`],
      { hl: true, cells: ['**Profit attributable to TII**', `**${Q1.consolidated.patAttrPy}**`, `**${Q1.consolidated.patAttr}**`, `**${n1((Q1.consolidated.patAttr / Q1.consolidated.patAttrPy - 1) * 100)}%**`] },
    ], source: 'Q1FY27 call (17-Aug-2026) and deck; Screener (profit for EPS); Cofacto (EV segment, from the filed results)' } },
    { p: 'Management\'s message (17-Aug-2026 call): steel prices rose sharply in Q4FY26 and Q1FY27, contracts pass them on with a two-to-three-quarter lag, and TII expects to recover all of it, including Q1\'s shortfall; non-steel inflation (fuel, freight) is being negotiated. Demand for the next one or two quarters looks "bullish", exports grew double digits. TICMPL had its best quarter (revenue ~₹240 cr) and is past peak losses; one EV business should break even this year. Capex: ~₹350 cr in TII, ~₹100 cr in Shanthi Gears, ₹600-700 cr for the group excluding CG Power; ₹250 cr more into TICMPL in Q3FY27.' },
    { exhibit: { type: 'table', title: 'What management guided, and what we assume', head: ['Item', 'Guidance (source)', 'Our assumption'], wide: [1, 2], rows: C.guidance.map((g, i) => [['Steel pass-through', 'Capex', 'TICMPL funding', 'Cycles margin', 'TI Medical / 3xper', 'MFP and capacity'][i], g.t, ['Standalone EBITDA margin 11.5% in FY27E (Q1 ~10.4%), 12.3% in FY28E', 'Consolidated capex ₹1,800 cr FY27E incl. ~₹1,100 cr at CG (not guided)', 'Base: TICMPL at TII\'s cost; the ₹250 cr tranche is funded from standalone cash', 'Inside the standalone margin path', 'Residual revenue +40% FY27E; losses narrow', 'Standalone revenue +13% FY27E, +10% FY28-29E'][i]]), source: 'Q4FY26 and Q1FY27 calls; GAM Research' } },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean operating accounts; noisy consolidated profit',
  blocks: [
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'What happened', 'Effect on the numbers', 'Flag'], wide: [1, 2], rows: [
      ['CCPS fair-value gains and losses', 'Until Mar-2026 TICMPL\'s preference shares were fair-valued through profit: TII standalone booked a ₹569 cr gain in FY25 (₹6.8 cr in FY26); consolidated booked losses on the investors\' CCPS (₹137 cr FY25, ₹18 cr FY26)', 'Reported standalone PAT FY25 ₹1,297 cr vs ₹728 cr before the gain; we use the latter', 'AMBER'],
      ['Mar-2026 reclassification', 'Investors\' CCPS (₹2,405 cr) moved from liability to minority interest under the restated agreement', 'Removes future fair-value swings; minority interest jumps to ₹6,450 cr', 'GREEN (cleaner)'],
      ['Exceptional items', 'CG Power gains in FY24 (~₹550 cr in the Dec-2023 quarter); ₹68 cr of charges in FY26', 'FY24 EPS ₹62.1 is not a clean base', 'AMBER'],
      ['Subsidiary dividends in standalone profit', '₹142 cr a year from CG Power and Shanthi Gears in FY24-26', 'We strip them out of the profit we capitalise (core profit), since the stakes are valued at market', 'Neutral'],
      ['Cash conversion', 'Standalone FCF 100% of PAT in FY26, 51-55% in FY24-25; consolidated FCF negative in FY24-26 (CG and venture capex)', 'Core business converts well', 'GREEN'],
      ['Related parties', 'Murugappa group companies; investments into subsidiaries are the main related-party flows', 'Disclosed; approved', 'GREEN'],
    ], source: 'TII AR FY25-26 (notes 6a, 29, 62), Q4FY25 call, Screener' } },
    { callout: '**Our accounting flag is AMBER**, not because of anything hidden, but because reported profit at both levels has been moved by non-cash fair-value entries and one-offs: always ask which TII profit you are looking at. In this report "core profit" means standalone profit before the CCPS gains and before dividends from CG Power and Shanthi Gears.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns TII (30-Jun-2026)', head: ['Holder', '% of shares', 'Note'], wide: [2], rows: [
    ['**Promoter group** (Murugappa family and entities)', `${O.promoters}%`, 'Ambadi Investments ~36% (a Murugappa family holding company), others ~8%'],
    ['Foreign institutions', `${O.fii}%`, 'Up from 21.4% in Mar-2026'],
    ['Domestic institutions', `${O.dii}%`, 'Mutual funds and insurers; names above 1% not extracted (gap)'],
    ['Government', `${O.government}%`, ''],
    ['Public', `${O.public}%`, `${n0(O.shareholders)} shareholders`],
  ], source: 'BSE shareholding pattern (Screener.in); Q1FY27 deck p.10' } },
  { callout: '**What it means:** a widely held, institution-heavy register (43% FIIs and DIIs) with a stable family promoter at 44%. Unlike many holding companies, TII has a large free float and no thin-trading excuse for its discount: institutions are choosing to price the CG Power stake well below market.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a strong group culture; the next CG Power is the open question',
  blocks: [
    { p: `M.A.M. Arunachalam (Murugappa family) is Executive Chairman (FY26 pay ₹12.25 cr). Vellayan Subbiah, who led the CG Power turnaround and TII's new ventures, became non-executive Vice Chairman from 1-Apr-2025; Mukesh Ahuja is Managing Director and A.N. Meyyappan CFO; Jalaj Gupta runs TI Clean Mobility. Independent directors include Tejpreet Singh Chopra, V.S. Radhakrishnan and Shelina Parikh (from May-2025).` },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Evidence', 'Score'], wide: [1], rows: [
      ['Group culture', 'Murugappa group (125+ years), conservative balance sheets, transparent quarterly calls with divisional heads', 'GREEN'],
      ['Capital allocation', 'CG Power a huge success; ~₹1,600 cr into ventures since FY22 without returns yet', 'AMBER'],
      ['Minority returns', 'Dividend ₹3.50 a share every year (<10% payout); cash kept for ventures', 'AMBER'],
      ['Leadership transition', 'Architect of the CG turnaround moved to a non-executive role in Apr-2025', 'AMBER'],
      ['Disclosure', 'Segment PBIT, ROIC and FCF every quarter; little on TICMPL\'s own P&L', 'GREEN / AMBER'],
      ['Related parties and pay', 'Executive Chairman ₹12.25 cr; MD 81x median pay; RPTs mainly with subsidiaries', 'GREEN'],
    ], source: 'TII AR FY26 (corporate governance report); calls' } },
    { callout: '**Verdict:** well-governed, but run for long-term group building rather than for minority payouts. That is fine as long as the ventures earn their cost of capital; until they do, the market charges a discount.' },
  ],
};

module.exports = { moat, guidance, quality, ownership, governance };
