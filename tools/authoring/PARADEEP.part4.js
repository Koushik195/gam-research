// Paradeep initiation, part 4: competitive advantage, earnings quality, ownership, governance.
const X = require('./PARADEEP.ctx');
const { C, D, F, n0, n1 } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: OCP supply and port logistics, but no pricing power and a weaker balance sheet',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict[0].toUpperCase() + m.verdict.slice(1), m.evidence, m.verdict === 'advantage' ? 'Protects volume and cost in a supply shock.' : m.verdict === 'parity' ? 'Keeps Paradeep competitive; does not set it apart.' : 'Caps margins and returns.']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Paradeep has a **narrow but real advantage in supply**: OCP, the world\'s largest phosphate producer, is a co-promoter and its biggest supplier, and its main plant sits on a port with its own berth and pipelines. In 2026 that kept rock and acid flowing when peers cut output, and it has let Paradeep gain share in NPKs. It does **not** give pricing power (the government sets the subsidy and, in effect, the price), its acid integration is still partial, and it carries ~₹6,500 cr of net debt where Coromandel and Chambal hold net cash. Expect mid-teens ROE through the cycle at best, with big swings, not a compounding franchise.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: a clean audit, but subsidy-heavy, restated, and with big related-party flows',
  blocks: [
    { bullets: [
      '**Subsidy is 53% of revenue.** ₹11,625 cr of FY26 revenue (incl. ₹2,088 cr on traded goods) is government subsidy, booked at notified rates on sale; the auditor (B S R & Co., KPMG network) makes it a key audit matter. Cash lags: ₹3,847 cr owed at Mar-2026 and ₹4,600 cr at Jun-2026, funded with short-term debt.',
      '**FY25 is restated, and the merger was not accounted the usual way.** The NCLT scheme set the appointed date at 1-Apr-2024, so FY25 includes MCFL; the auditor\'s emphasis of matter notes that Ind AS 103 alone would have consolidated MCFL only from 16-Oct-2025. The purchase-price allocation is still provisional (goodwill ₹139 cr). Comparisons with FY24 and earlier are not like-for-like.',
      '**Exchange losses sit in finance cost.** ₹145 cr of FY26 finance cost (₹46 cr in FY25) is exchange loss on dollar buyer\'s credit for imports, plus ₹50 cr of other exchange loss in other expenses. A weaker rupee hits profit below EBITDA, where EBITDA-per-tonne comparisons miss it.',
      '**One-offs both ways.** FY26: −₹39 cr Labour Code charge (exceptional) and a ₹56 cr loss on discarded plant (Screener nets it in other income); Q1FY27: +₹21.8 cr reversal of part of the Labour Code charge. FY26 other income included ₹59 cr of mutual-fund gains on parked subsidy cash.',
      '**Inventory gains flatter good quarters.** Q1FY27 EBITDA of ~₹7,300/t was "mainly on account of the stock" bought before prices rose (management). These gains reverse when prices fall.',
      '**Related-party purchases.** OCP group companies supplied ~₹8,200 cr in FY26 (~half of purchases) and Zuari FarmHub (Adventz) bought ₹309 cr of fertilisers; the Goa plant (2022), MCFL (2025) and the Mahad SSP plant (2025) were all bought from group companies. Pricing is at contract terms, but minority holders depend on these being arm\'s length.',
      '**Cash conversion is weak.** Operating cash over FY19-26 totalled ~₹1,500 cr against ~₹3,000 cr of cumulative net profit (plus ~₹1,450 cr of depreciation); FY26 was −₹1,012 cr.',
    ] },
    { callout: '**Accounting flag: AMBER.** The audit is clean (Big-4-network auditor, contingent liabilities ~₹160 cr, no qualification), and the restatement is disclosed in detail. But half of revenue is a policy payment, FY25 is restated under an NCLT override, exchange losses and inventory gains move profit, cash conversion is poor, and the biggest supplier is a shareholder.' },
  ],
};

const OW = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Zuari Maroc Phosphates (ZMPPL), a 50:50 joint venture of the Adventz group (K.K. Birla/Poddar family) and OCP of Morocco, owns ${OW.named[0].pct}%; Zuari Agro Chemicals, which received shares for its MCFL stake, owns ${OW.named[1].pct}%; other group entities and family members ${OW.named[2].pct}%: promoters ${OW.pattern.promoters}% in Jun-2026. Mutual funds held ${OW.pattern.mutualFunds}% (small-cap and multicap funds of Nippon, SBI, ICICI Prudential, Bandhan, Invesco), while foreign investors cut their holding from 15.0% (Sep-2025) to ${OW.pattern.fiis}%. The number of shareholders rose from ~2.45 lakh to ~3.29 lakh as MCFL holders received Paradeep shares.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Type'], rows: OW.named.map(h => [h.name, h.pct.toFixed(2) + '%', h.type]), source: 'Shareholding pattern (30-Jun-2026) and Screener.in shareholder lists; fund holdings shown by scheme' } },
  { callout: '**Our read:** two strong sponsors are a plus: OCP brings raw materials and the Adventz group runs the business. But the structure has costs. Minority holders sit below a 50:50 JV, so strategy depends on two partners agreeing; the group has sold Paradeep two assets (Goa, Mahad) and merged a third (MCFL) into it; and promoters had pledged 9.21 cr shares (15% of their stake; 41% of Zuari Agro\'s) at Jun-2026. ZMPPL reported a release of ~6.5 cr pledged shares in August 2026 (secondary report of the filing). Free float is ~42%.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professional team and an independent-majority board; related-party dependence and pledges are the soft spots',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: 'Annual report FY26, earnings calls' } },
    { verdicts: [
      ['Board', 'Adequate', '11 directors, 6 independent (55%) incl. two added in FY26; two OCP nominees.', 'Independent majority; sponsor nominees present.'],
      ['Promoters and pledge', 'Weak', `${OW.pattern.promoters}% promoter, but 15% of promoter shares pledged at Jun-2026 (part released Aug-2026).`, 'A sharp fall in the price could force sales.'],
      ['Related parties', 'Weak', '~Half of purchases from OCP group; three acquisitions from Adventz group companies.', 'Value depends on fair transfer pricing.'],
      ['Pay', 'Adequate', 'MD paid 67.8x the median employee in FY26 (+16%) in a year profit rose 50%.', 'Not excessive for the results.'],
      ['Disclosure', 'Moderate', 'Good volume data and frank calls; no product-level or manufactured-vs-traded profit, no project-by-project costs; volumes given only in presentations.', 'Hard to test the ₹7,000/t target.'],
      ['Execution', 'Moderate', 'Sulphuric acid plants and Goa energy phase 1 delivered; the big programme slipped from end-FY28 to around Q2FY29-FY30.', 'Watch contract award and cost.'],
      ['Balance-sheet policy', 'Moderate', 'Says gross debt ~0.75x equity and long-term debt <30% of net worth; actual gross debt ~1.0x equity at Mar-2026.', 'Policy and practice diverge in a cost spike.'],
      ['Audit and legal', 'Strong', 'B S R & Co.; emphasis of matter on the merger accounting only; contingent liabilities ~₹160 cr.', 'Clean.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

module.exports = { moat, quality, ownership, governance };
