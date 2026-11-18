// Coromandel initiation, part 4: competitive advantage, earnings quality, ownership, governance.
const X = require('./COROMANDEL.ctx');
const { C, D, F, n0, n1 } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale, distribution and integration, but no pricing power',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict[0].toUpperCase() + m.verdict.slice(1), m.evidence, m.verdict === 'advantage' ? 'Protects volume, cost and share.' : m.verdict === 'parity' ? 'Keeps Coromandel competitive; does not set it apart.' : 'Caps margins and returns.']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Coromandel has a **real but narrow advantage**: the best distribution and brand in South Indian phosphatics, the largest NPK and SSP volumes, a net-cash balance sheet that can carry ₹3,000+ cr of subsidy receivables, and now partial ownership of its raw materials. That makes it the most resilient producer in a downturn (it kept producing in Q1FY27 while the industry cut output by a fifth). It does **not** give pricing power: the government sets the subsidy and, in effect, the price, and reasonable-margin rules cap the upside. In crop protection it is a solid generic player, not an innovator. Expect high-teens ROE through the cycle, not a compounding franchise that re-rates for ever.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: a clean audit, but one-offs, subsidies and minorities to strip out',
  blocks: [
    { bullets: [
      '**Subsidy income is 35% of revenue.** ₹11,139 cr of FY26 revenue is government subsidy, recognised on notified NBS rates and DBT sales; the auditor (S.R. Batliboi, EY network) makes its recognition and recoverability a key audit matter. Cash lags: ₹2,168 cr owed at Mar-26 and ₹3,254 cr at Jun-26.',
      '**One-offs in both directions.** FY25 profit includes a ₹397.71 cr gain on assigning leasehold land rights (exceptional) and a ₹50.94 cr asset impairment; FY26 includes a ₹70.56 cr goodwill impairment on the drone subsidiary Dhaksha, booked inside segment profit. Underlying FY25 EPS was therefore lower than reported, and FY26 higher.',
      '**Minorities now matter.** NACL (46% minority) and BMCC (28.5%) are consolidated. In FY26 minorities absorbed ₹58 cr of losses, so profit attributable to shareholders (₹1,956 cr) exceeded total profit (₹1,898 cr). As NACL improves this reverses: minorities will take a share of profit.',
      '**Acquisition and mine amortisation below EBITDA.** ~₹21 cr a quarter of NACL intangibles and ~₹30 cr of Senegal mine overburden run through D&A (Q1FY27). EBITDA growth therefore overstates growth in earnings: Q1FY27 EBITDA −3%, PAT −24%.',
      '**Working capital is funded by suppliers\' banks.** ₹5,022 cr of the ₹8,827 cr of trade payables are acceptances (bank-backed credit for imported raw materials); their cost sits in finance cost, which rose from ₹262 cr (FY25) to ₹343 cr (FY26).',
      '**Reasonable-margin guidelines.** The company says it awaits clarity on new government guidelines limiting profit on subsidised P&K fertilisers (note 31.6). A binding cap would make part of today\'s profit, and of the integration upside, temporary.',
      '**Definitions.** Company EBITDA (₹3,232 cr in FY26) excludes exceptional items and JV share and equals Screener\'s; the annual report\'s other income (₹348 cr) includes ~₹16 cr Screener counts as operating.',
    ] },
    { callout: '**Accounting flag: AMBER.** The books are clean (Big-4-network auditor, contingent liabilities only ₹189 cr) and cash conversion over time is reasonable. But a third of revenue is a government payment at policy-set rates, recent years carry one-offs either way, minorities and acquisition amortisation now separate EBITDA from EPS, and a pending profit cap hangs over the fertiliser margin.' },
  ],
};

const OW = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `E.I.D. Parry (India) Ltd, the Murugappa group's listed agri company, owns ${OW.named[0].pct}% and other family members and trusts ${OW.named[1].pct}%: promoters ${OW.pattern.promoters}% in Jun-2026, with no pledge. Foreign investors cut their holding from 14.5% (Sep-2025) to ${OW.pattern.fiis}% while Indian institutions rose from 15.8% to ${OW.pattern.diis}%, led by Kotak, DSP, HDFC and Axis mutual funds; no single foreign institution held 1%. Groupe Chimique Tunisien, Coromandel's partner in the TIFERT phosphoric acid JV, holds ${OW.named[5].pct}%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Type'], rows: OW.named.map(h => [h.name, h.pct.toFixed(2) + '%', h.type]), source: 'BSE shareholding pattern via Screener.in (Jun-2026 quarter); fund-house holdings aggregated by Screener under one scheme name' } },
  { callout: '**Our read:** a stable group promoter with a long record and no pledge is a strength. Note the structure: minority shareholders of Coromandel sit below E.I.D. Parry, which itself is controlled by the Murugappa family; decisions such as the NACL purchase are taken at group level. Free float is ~44%.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: professional and group-backed; pay and disclosure are the soft spots',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: 'Integrated Report 2025-26, company filings' } },
    { verdicts: [
      ['Board', 'Strong', '50% independent directors; >92% average attendance (FY26).', 'Adequate oversight.'],
      ['Promoter and pledge', 'Strong', `${OW.pattern.promoters}% promoter, no pledge; group company with AAA ratings.`, 'Aligned and stable.'],
      ['Pay', 'Moderate', 'Executive Chairman paid 177.5x the median employee in FY26 (+26%) while profit fell 8%.', 'High for a down year.'],
      ['Disclosure', 'Moderate', 'Good segment and volume data; no split of manufactured vs traded EBITDA, specialty, retail, nano or BMCC profit; project costs not given.', 'Hard to test management\'s ₹6,500/t target.'],
      ['Execution', 'Strong', 'Acid plants commissioned on schedule (Mar-2026); record production in FY26; granulation on track.', 'Delivers projects.'],
      ['Capital allocation', 'Moderate', 'Integration projects logical; NACL bought at a ₹386 cr goodwill premium and earns ~11% EBITDA margin; drone goodwill impaired (₹71 cr).', 'Mixed record on acquisitions.'],
      ['Audit and legal', 'Strong', 'S.R. Batliboi; contingent liabilities ₹189 cr; no qualifications.', 'Clean.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

module.exports = { moat, quality, ownership, governance };
