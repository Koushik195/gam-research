// Himadri report, part B (4/5): Birla Tyres, new energy materials, moat, earnings quality.
const { ctx } = require('./HSCL.part2');
const { C, D, F, n0, n1, SQ, A26, mcap, segE, sep28, impliedNem, ndSep27 } = ctx;
const SQo = SQ.filter(q => q.othersRev > 0);

const tyres = {
  id: 'tyres', nav: 'Birla Tyres', kicker: 'Segment', title: 'Birla Tyres: revenue is coming back, profit is not here yet',
  blocks: [
    { p: 'Birla Tyres was a well-known bias-tyre brand that went bankrupt. In Oct-2023 Himadri and Dalmia Bharat Refractories (DBRL) won it in insolvency; the plant restarted on 29-May-2025. The structure is complicated: the manufacturing undertaking sits in DBRL, funded by NCDs that Himadri holds (₹487 cr at Mar-26, up from ₹187 cr); Himadri owns the brand company (Birla Tyres Ltd, 100%) and 49%, with control, of the selling company. On 21-Sep-2026 the boards approved a scheme to demerge DBRL\'s tyre business into HSCL (1 HSCL share per 260 DBRL shares; FY26 turnover of that business ₹149 cr), which would simplify this. The focus is agri, off-the-road (OTR) and truck-bus bias tyres, with a radial car-tyre (PCR) plant for EVs and SUVs planned by FY28.' },
    { pair: [
      { type: 'column', title: 'Others segment: from ₹47 cr to ₹144 cr a quarter', unit: 'Revenue (₹ crore)', x: SQo.map(q => q.q), series: [{ name: 'Revenue', values: SQo.map(q => Math.round(q.othersRev)), fmt: 'num' }], labels: 'all', source: 'Quarterly segment results (Q2FY26 derived)' },
      { type: 'column', title: 'Segment EBIT: mining profit in Q4, ~nil without it', unit: 'Others segment EBIT (₹ crore)', x: SQo.map(q => q.q), series: [{ name: 'EBIT', values: SQo.map(q => Math.round(q.othersEbit * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'Quarterly segment results; Q1FY27 call (no mining in Q1)' },
    ] },
    { exhibit: { type: 'table', title: 'What has been promised, and what has happened', head: ['Item', 'Plan / guidance', 'Status at Sep-2026'], wide: [1, 2], rows: [
      ['Revenue', '₹3,000 cr in 4-5 years (Q1FY27 call)', 'FY26 ₹187 cr; Q1FY27 ~₹127 cr'],
      ['Profitability', 'EBITDA break-even in FY27, cash positive', 'Others EBIT ₹1 cr in Q1FY27 (no mining)'],
      ['Distribution', 'Deeper network, exports', '49 distributors (40 India, 9 abroad), 1,000+ dealers; 145+ SKUs, ~400 in development'],
      ['Capacity', 'Convert truck-bus bias capacity to OTR over 3 years; PCR plant by FY28', '~₹500 cr of capex planned in FY27'],
      ['Structure', 'Demerge DBRL tyre business into HSCL', 'Board approval 21-Sep-2026; needs SEBI, exchanges, NCLT, shareholders'],
    ], source: 'Q4FY26 and Q1FY27 calls, Jul-2026 presentation, board outcome 21-Sep-2026, FY26 annual report' } },
    { callout: `**Our view:** we model Others (tyres plus mining) at ₹{{F.seg.oth.revenue.0|num}} cr / ₹{{F.seg.oth.revenue.1|num}} cr / ₹{{F.seg.oth.revenue.2|num}} cr (FY27-29E) at 2% / 5% / 7% EBITDA margins: about half of management\'s revenue path. Bias tyres are a shrinking, competitive product in India; a sub-scale re-entrant will struggle to match the 12-15% margins of the large tyre makers. By FY28 Himadri will have put ~₹1,000 cr (NCDs plus capex) into a business earning perhaps ₹50 cr of EBITDA.` },
  ],
};

const battery = {
  id: 'battery', nav: 'Battery materials', kicker: 'Segment', title: 'Battery materials: a ₹1,245 cr bet on beating China at its own game',
  blocks: [
    { p: 'Himadri has worked on battery chemistry for over a decade and is building three things. (1) **Anode material** from its own specially engineered pitch: a 200 tpa plant started on 23-Apr-2026 (₹120 cr), revenue potential ₹120-130 cr, samples at stage B of a four-stage approval that takes 1.5-2 years; a commercial-scale plant is still to be announced. (2) **LFP cathode** (lithium iron phosphate, the chemistry of most EV and grid-storage batteries): 2,000 tpa in Q3FY27, then the rest of a 40,000 tpa Phase 1 (₹1,125 cr) over about 12 months, with FY29 the first full year; management says ~₹3,000 cr of revenue at full use, a 2x asset turn, and a long-term goal of 200,000 tpa (₹4,800 cr). It claims to be the first commercial LFP plant outside China. (3) **Partnerships**: a licence for Sicona\'s silicon-carbon anode (Australia), 19.44% of International Battery Company (US cell maker with a Korean plant and an Indian gigafactory planned for Q4FY27), and 40% of Invati.' },
    { exhibit: { type: 'table', title: 'The risks management did not answer', head: ['Question', 'What management said', 'Our read'], wide: [1, 2], rows: [
      ['Who will buy the LFP?', 'Samples encouraging; IBC a partner; MoUs under NDA', 'No binding offtake disclosed; approvals take 1.5-2 years'],
      ['Can it make money at Chinese prices?', 'Prices at par with China; cost edge from non-Chinese raw materials and an Indian base; sources confidential', 'An analyst on the Q1 call calculated a negative spread; Chinese LFP makers earn thin margins'],
      ['How big is anode?', 'Capex to be announced once approvals progress', 'No anode revenue in our numbers beyond samples'],
      ['What is it worth today?', '₹30,000 cr battery-materials revenue ambition over 5-6 years (100 GWh)', 'An ambition, not a plan with funding'],
    ], source: 'Q4FY26 and Q1FY27 calls, Jul-2026 presentation' } },
    { exhibit: { type: 'table', title: 'What is the battery business worth? Three yardsticks', head: ['Yardstick', 'Value (₹ cr)', '₹ per share', 'Comment'], wide: [3], rows: [
      ['Capital committed (LFP Phase 1 + anode plant)', '1,245', n0(1245 / F.shares), 'What has been or will soon be spent; a floor only if the plants work'],
      ['What the share price implies', n0(Math.round(impliedNem / 100) * 100), n0(impliedNem / F.shares), `Market value ₹${n0(mcap)} cr less core at 16x and Others at 10x Sep-28E EBITDA (₹${n0(sep28('core'))} cr and ₹${n0(sep28('oth'))} cr) and net cash and investments at Sep-27E (₹${n0(ndSep27)} cr, model basis)`],
      ['Our FY29E battery EBITDA at 16x', n0(segE('nem', 2) * 16), n0(segE('nem', 2) * 16 / F.shares), `FY29E revenue ₹{{F.seg.nem.revenue.2|num}} cr at 8%; anything more must come from the multiple`],
    ], source: 'GAM Research' } },
    { callout: '**Our view:** the battery push is credible in intent (in-house R&D, own pitch for anodes, a phased build that waits for approvals) but unproven commercially, and it enters a market where China sets prices and cell-component prices have halved. We model ₹20 cr / ₹350 cr / ₹1,000 cr of revenue (FY27-29E), about a third of Phase 1 by FY29, with losses in FY27 and an 8% margin in FY29. The bull case lifts FY29 revenue to ~₹1,300 cr at a 14% margin.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in coal tar and pitch; narrow in carbon black; none yet in batteries or tyres',
  blocks: [
    { verdicts: D.moat, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Himadri has a **narrow moat in coal tar processing and pitch**: scale, integration and customer approvals that a new entrant cannot copy quickly, in a market where supply is tied to steel. In carbon black it has a cost edge from its own feedstock but competes with global majors on quality. It has **no moat yet in battery materials or tyres**, where most of the new capital is going. Margins in the core still move with raw-material spreads, as FY21-22 showed.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but other income and cash conversion need watching',
  blocks: [
    { bullets: C.accounting.map(a => `**${a.item}.** ${a.fact.replace(/Rs /g, '₹')}`) },
    { bullets: [
      '**Related parties.** Himadri carries ₹183 cr of optionally convertible preference shares in Modern Hi-Rise, its own promoter holding company (a 1% non-cumulative instrument from a 2018 amalgamation; the issuer decides on conversion or redemption). Small stakes in group companies Himadri Credit & Finance and Himadri e-Carbon.',
      '**Tyre funding off the operating line.** The Birla Tyres plant is funded through ₹487 cr of DBRL NCDs shown as investments, not capex; the demerger will bring the assets onto Himadri\'s balance sheet.',
    ] },
    { callout: '**Accounting flag: AMBER.** The audit (Singhi & Co) is unqualified and segment data reconcile. The amber is for the size of other income (17% of FY26 pre-tax profit, over half of it fair-value gains), cash from operations at only 40% of EBITDA in FY26, a sizeable investment in the promoter\'s holding company, and tyre funding routed through investments.' },
  ],
};

module.exports = { tyres, battery, moat, quality };
