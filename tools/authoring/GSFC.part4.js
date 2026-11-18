// GSFC initiation, part 4: competitive advantage, earnings quality, ownership, governance.
const X = require('./GSFC.ctx');
const { C, D, F, n0, n1, A26 } = X;
const OW = D.ownership;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: integration and a balance sheet, but no moat in the products',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict[0].toUpperCase() + m.verdict.slice(1), m.evidence, m.verdict === 'advantage' ? 'Keeps GSFC running through cycles.' : m.verdict === 'parity' ? 'Competitive, not distinctive.' : 'Caps margins and returns.']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual reports and calls to Sep-2026)' },
    { callout: '**Honest verdict: no moat.** GSFC has real operating assets: an integrated Vadodara complex where ammonia, sulphuric acid, steam and caprolactam feed each other, a jetty at Sikka that lets it import ammonia and DAP cheaply, and one of only two caprolactam plants in India. It has a strong balance sheet. None of this gives it pricing power: the government sets the economics of urea and DAP, farmers\' budgets cap APS and AS, and China sets caprolactam, nylon and melamine prices. Returns show it: ROE of ~5% (4.6-5.5% in FY24-26) outside the FY22-23 boom. What GSFC owns is a cyclical business and a portfolio, not a franchise.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean books, but a third of profit comes from the portfolio and cash conversion is weak',
  blocks: [
    { bullets: [
      `**Other income is a third of pre-tax profit.** ₹287 cr in FY26 (Screener; ₹276 cr in the AR plus ~₹11 cr associates): interest ₹143 cr (mostly on deposits that were spent on working capital in Q1FY27) and dividends ₹106 cr. Operating EBITDA was ₹790 cr. As the deposits are used, interest income falls: we model ₹235 cr of other income in FY27E.`,
      '**Fair-value accounting keeps portfolio gains out of profit.** Listed and unlisted shares are at fair value through OCI. Indian Potash (unlisted) was revalued from ₹723 cr to ₹1,275 cr in FY26 on a level-3 valuation; reserves move with GNFC and Gujarat Energy prices. Book value (₹308 a share) therefore swings with markets.',
      '**Subsidy is 41% of revenue.** ₹4,514 cr of subsidy income in FY26, recognised at notified rates; the receivable (₹1,453 cr at Mar-26) is a key audit matter. Delays in payment show up as borrowings, as in Q1FY27.',
      '**Profit has not turned into cash since FY24.** Operating cash −₹268 cr (FY24), ₹83 cr (FY25) and ₹136 cr (FY26) against profit of ₹564-673 cr, as subsidy receivables, inventory and traded stock rose.',
      '**Contingent liabilities jumped.** "Other" claims not acknowledged as debt rose from ₹765 cr to ₹1,333 cr in FY26 with no breakdown in the notes; ~11% of net worth.',
      '**Past write-offs.** Karnalyte Resources (Canadian potash, impaired ₹36 cr of ₹60 cr) and TIFERT (Tunisia, carried at nil, shares pledged to its lenders): GSFC\'s record on investing outside Gujarat is poor.',
      '**Definitions.** Screener EBITDA (₹790 cr FY26) excludes other income; the company\'s "operating EBITDA" (₹781 cr standalone) is on the same basis. Segment results include ~₹24 cr of other income.',
    ] },
    { callout: '**Accounting flag: AMBER.** The audit is clean and the definitions are standard. But profit leans on portfolio dividends and interest, the unlisted holdings are valued by the company, subsidy income is a policy number paid with a lag, contingent claims rose 74% without explanation, and three years of weak cash conversion mean reported profit has overstated the cash available to shareholders.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The Government of Gujarat controls GSFC through Gujarat State Investments Ltd (${OW.named[0].pct}%, unchanged, no pledge); a further ${OW.pattern.government}% sits in a government category. Foreign investors have been sellers: ${OW.trend} Indian small-cap funds are the largest outside holders: Quant Small Cap Fund ${OW.named[1].pct}% and ICICI Prudential Small Cap ${OW.named[2].pct}% at Jun-2026. Retail shareholders now number ~3 lakh.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding, Jun-2026', head: ['Holder / category', 'Stake', 'Type'], rows: [...OW.named.map(h => [h.name, h.pct.toFixed(2) + '%', h.type]), ['Foreign institutions (all)', OW.pattern.fiis.toFixed(2) + '%', 'Category'], ['Domestic institutions (all)', OW.pattern.diis.toFixed(2) + '%', 'Category'], ['Government (public category)', OW.pattern.government.toFixed(2) + '%', 'Category'], ['Public', OW.pattern.public.toFixed(2) + '%', 'Category']], source: 'BSE shareholding pattern via Screener.in and Trendlyne (Jun-2026 quarter); Q1FY27 investor presentation' } },
  { callout: '**Our read:** a state promoter with ~38% plus a further government block gives stability and access to gas, land and approvals, but it also means minority shareholders cannot force the portfolio to be unlocked. Free float is ~56%, held mostly by retail and small-cap funds that can move the price quickly.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a state company run by rotating civil servants',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: 'Annual Report 2025-26' } },
    { verdicts: [
      ['Board', 'Moderate', C.governance.board + '.', 'Independent half, but the state appoints the chair and the MD.'],
      ['Management continuity', 'Weak', 'Three managing directors in FY26 (Jul-2025, Jan-2026 changes) and a new Chairman (Nov-2025); IAS officers rotate.', 'Long projects outlast their sponsors.'],
      ['Promoter and pledge', 'Strong', '37.84% held by Gujarat State Investments; no pledge.', 'Stable control.'],
      ['Capital allocation', 'Weak', 'ROE ~5%; portfolio never monetised; payout ~30% of profit vs a 5%-of-net-worth policy floor (which allows less with Finance Department approval); Karnalyte and TIFERT write-offs; new capex without disclosed costs.', 'The main reason for the holding discount.'],
      ['Pay', 'Strong', C.governance.kmpPay + ' for the MD, CFO and CS.', 'No excess.'],
      ['Disclosure', 'Moderate', 'Good volume and spread data in decks; no quarterly segment depreciation, no breakdown of ₹1,333 cr contingent claims, no project costs.', 'Hard to test capex returns.'],
      ['Audit', 'Moderate', C.governance.auditor + '.', 'Clean opinion; mid-size firm.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

module.exports = { moat, quality, ownership, governance };
