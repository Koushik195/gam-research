// Chambal initiation, part 5: earnings quality, ownership, governance.
const X = require('./CHAMBLFERT.ctx');
const { C, D, F, n0, n1 } = X;
const OW = D.ownership;

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean books; the judgement sits in the subsidy line',
  blocks: [
    { bullets: [
      '**Two-thirds of revenue is a government payment.** ₹13,830 cr of FY26 revenue came from the government at notified rates; the auditor (Price Waterhouse) makes its recognition and recoverability a key audit matter. The receivable is the swing item: ₹368 cr of total receivables at Mar-25, ₹2,075 cr at Mar-26 (adjustments of provisional prices paid on a higher gas cost), ₹3,302 cr at Jun-26.',
      '**No exceptional items.** The FY24-26 consolidated accounts carry none. Screener tags ₹34-99 cr a year of gains on liquid funds as "exceptional"; they are ordinary treasury income, and we keep reported EPS in the valuation history (the forward-P/E median is 10.1x on reported EPS and 10.3x excluding those tags).',
      '**IMACID flatters standalone profit, not consolidated.** The parent books IMACID\'s dividend (₹155 cr in Q1FY27) as other income and pays tax on it; consolidated accounts replace it with the share of IMACID\'s profit (−₹25 cr in Q1FY27 after a sulphur-driven shutdown). Hence Q1FY27 standalone PAT +10% but consolidated −5%, and a 29% consolidated tax rate. We use consolidated numbers throughout.',
      '**Tax rate fell structurally.** Chambal moved to the 25.17% regime from FY26 after using up its MAT credit; FY25\'s 32.7% will not recur.',
      '**TAN pre-commissioning sales are capitalised.** Sales of nitric acid and AN solution since June reduce the project cost instead of appearing as revenue until the plant is declared commissioned. Normal practice, but FY27 TAN revenue will start partway through the year.',
      '**Policy can rewrite past profit.** Subsidy rates and gas pass-through are finalised with a lag (escalation/de-escalation); the Gadepan-III reset will change profit per tonne prospectively, and NBS rates are set after costs are incurred.',
    ] },
    { callout: '**Accounting flag: GREEN.** A simple group (no minorities of note, no acquisitions, no impairments), a Big-4-network auditor, contingent liabilities of only ₹177 cr, and cash conversion that is lumpy only because of subsidy timing (operating cash ₹6,944 cr in FY21 when arrears were cleared, ₹138 cr in FY26 when receivables rose). The risks are policy risks, not accounting risks.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The founding K K Birla family's three branches control Chambal through equal-sized blocks: The Hindustan Times Ltd (Bhartia) ${OW.named[0].pct}%, Zuari Industries (Poddar, Adventz group) ${OW.named[1].pct}% and SIL Investments (Nopany) ${OW.named[2].pct}%, with related trusts and companies taking promoters to ${OW.pattern.promoters}% in Jun-2026. Promoters have been buying (60.40% at Mar-2025). About ${n0(OW.pattern.pledgedOfPromoter)}% of promoter shares were pledged in Jun-2026, a level that has been stable at 22-24% for a year. Foreign investors cut their stake from 20.18% (Mar-2025) to ${OW.pattern.fiis}%; no foreign fund held 1%. HDFC Mutual Fund (${OW.named[5].pct}%) and Nippon India (1.08%) are the largest outside holders.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Type'], rows: OW.named.map(h => [h.name, h.pct.toFixed(2) + '%', h.type]), source: 'BSE shareholding pattern via Screener.in (Jun-2026 quarter); pledge from Trendlyne and broker notes (Jul-2026)' } },
  { callout: '**Our read:** a three-family promoter group with 61% and a professional MD is stable, and the creeping purchases show the families think the shares are cheap. Two cautions: the ~23% pledge (the pledging entities and purpose are not disclosed in our sources) and the fact that big capital decisions, such as a ₹10,000 cr urea plant, rest with a promoter-dominated board. Free float is ~39%.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: modest pay, a clean audit, family control and a pledge to watch',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: 'Annual Report 2025-26, Annual Report 2024-25, earnings calls' } },
    { verdicts: [
      ['Board', 'Adequate', '8 directors, 4 independent (50%); three promoter non-executives incl. the chairman; an independent director past 75 continued by special resolution.', 'Meets the rules; promoter-led.'],
      ['Promoter and pledge', 'Moderate', `${OW.pattern.promoters}% promoter, buying; ~23% of promoter shares pledged.`, 'Aligned, but the pledge is a risk in a sell-off.'],
      ['Pay', 'Strong', 'MD paid 23.3x the median employee (₹15.4 lakh) in FY26 (+18.7%); non-executive commission ₹17.5 lakh each.', 'Restrained.'],
      ['Disclosure', 'Moderate', 'Good segment, volume and subsidy data; no plant-wise EBITDA, no TAN economics, no quantified view of the Gadepan-III reset.', 'The biggest number in the case is undisclosed.'],
      ['Execution', 'Strong', 'Gadepan-III built and run efficiently; TAN broadly on schedule (completion targeted 30-Apr-2026, trial production June).', 'Delivers projects.'],
      ['Capital allocation', 'Moderate', 'Non-core exits, debt repaid, ₹700 cr buyback at ₹450 (above today\'s price); next up a ₹10,000 cr plant at "dilutive" returns.', 'Good record; the next decision is the test.'],
      ['Audit and legal', 'Strong', 'Price Waterhouse; contingent liabilities ₹177 cr; no qualifications.', 'Clean.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

module.exports = { quality, ownership, governance };
