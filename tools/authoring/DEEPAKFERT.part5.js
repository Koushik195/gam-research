// Deepak Fertilisers report, part B (4/5): moat, earnings quality, ownership and governance. As of 30-Sep-2026.
const { ctx } = require('./DEEPAKFERT.ctx');
const { C, D, F, n0, n1, A26 } = ctx;
const OH = D.ownership;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real TAN position, no pricing power',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict, m.evidence, { Advantage: 'Real and hard to copy', Parity: 'Competitive, not decisive', Disadvantage: 'A drag on returns', Unproven: 'An option, not a moat' }[m.verdict]]), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (filings, calls, broker notes to Sep-2026)' },
    { callout: `**Honest verdict:** Deepak has a **position**, not a moat. In TAN it is the largest Indian producer with the widest product range, plants on both coasts from FY27 and growing mine-site services; in concentrated nitric acid it has most of the market and long contracts. That wins volume and customers. It does not set prices: TAN, nitric acid, IPA and ammonia follow global prices and imports, and fertiliser economics are set by the subsidy. Returns show it: ROCE ran 11-25% over FY22-26 and Chemicals segment pre-tax ROCE fell from 72% (FY23) to ${n1(A26.chemRoce)}% (FY26) as capital went into projects. We give no moat premium in the multiple.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but capitalised interest, state incentives and a convertible shown as equity flatter the picture',
  blocks: [
    { bullets: [
      `**Capitalised interest.** ₹116 cr of FY26 interest (₹41 cr in FY25) was added to the cost of Gopalpur and Dahej instead of the P&L (gross interest ₹425 cr vs ₹353 cr reported). It stops at start-up, so FY27-28 interest rises even if debt falls; we model ₹430 cr for FY27E.`,
      '**State incentives inside revenue.** Gujarat and Maharashtra investment incentives of ₹109 cr (FY26) and ₹204 cr (FY25) are booked as revenue, i.e. inside EBITDA; ₹403 cr was still receivable from the states at Mar-26. Emkay estimated the GST cut (18% → 5%) lowers the Maharashtra incentive by ₹120-140 cr a year.',
      '**Other income is not all recurring.** FY26 other income of ₹103 cr included ₹17 cr of interest on a tax refund, ₹20 cr of mutual-fund gains and ₹28 cr of hedging gains; we forecast only ₹30-40 cr.',
      '**A convertible shown as equity.** DMSL\'s ₹800 cr CCDs pay 8% in cash, target a 12.5% annual return and carry an investor put on specified events, yet ₹619 cr of them sits in equity (as minority interest) and only ₹181 cr in debt. Economically, net debt is understated by up to ~₹619 cr; we deduct that amount in our valuation.',
      '**Transfer prices hide where the profit is.** The ammonia subsidiary sells to group plants at internal prices and lost ₹257 cr in FY26; TAN and nitric acid show the benefit. The company does not report ammonia, TAN and industrial-chemical profit separately.',
      `**Cash conversion.** Operating cash flow was ₹206 cr in FY26 on EBITDA of ₹1,684 cr (₹1,880 cr in FY25), as receivables rose ₹728 cr (incl. subsidy ₹751 cr owed by the government) and inventory ₹669 cr. Management called it a temporary Kharif build-up.`,
      '**One-offs.** Q4FY26: ~₹70-75 cr ammonia turnaround and ₹20 cr labour-code charge. FY25: a one-time tax credit of ₹40 cr.',
    ] },
    { callout: '**Accounting flag: AMBER.** P G Bhagwat LLP gave an unmodified opinion with no emphasis of matter; key audit matters were the CCD accounting and contingent liabilities. Seven subsidiaries holding ₹10,613 cr of assets were audited by other firms, database-level audit trails ran only from Oct-2025, and CARO remarks cover cash losses at PCL. We see no sign of manipulation, but reported EBITDA includes state incentives, interest was capitalised during construction, and the CCD treatment makes leverage look lower than it is.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The Mehta family (promoter group) owns ${OH.jun26.promoters}% (Jun-2026), mainly through Nova Synthetic (34.5%) and Robust Marketing Services (8.8%); the stake has not changed since 2024. Domestic institutions own ${OH.jun26.dii}%, up from 3.5% in Dec-2023; foreign investors ${OH.jun26.fii}%, down from 13.2%. The number of shareholders fell from ~238,000 (Mar-2024) to ${n0(OH.jun26.shareholders)}.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns Deepak Fertilisers (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.named.map(h => [h.holder, n1(h.pct) + '%', 'Promoter group (entities per Annual Report 2025-26)']),
    ['Domestic institutions (mutual funds, insurers)', OH.jun26.dii + '%', 'Up from 13.2% (Mar-26)'],
    ['Foreign portfolio investors', OH.jun26.fii + '%', 'Down from 10.3% (Mar-26)'],
    ['Public and others', OH.jun26.public + '%', `${n0(OH.jun26.shareholders)} shareholders`],
  ], source: 'BSE shareholding pattern for the quarter ended 30-Jun-2026 (the latest public on 30-Sep-2026); Annual Report 2025-26; named non-promoter holders were not collected' } },
  { callout: '**Our read:** the family controls the company without a majority, and part of its stake was pledged in 2025 to fund a ₹300 cr investment in the mining subsidiary\'s convertibles (Emkay). That aligns the family with DMSL\'s value, but it also means the promoter group earns a contractual 12.5% return in the subsidiary that public shareholders do not get. Domestic funds have been the buyers; foreign funds have trimmed.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a capable operator with too much family-linked financing',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: [
      ['Sailesh C. Mehta', 'Chairman & Managing Director', 'Also CMD of DMSL from 1-Jun-2026; non-executive chairman of MAL. FY26 pay from DFPCL ₹31.3 cr'],
      ['Subhash Anand', 'President & CFO', 'Runs investor communication'],
      ['Tarun Sinha', 'President, TAN business', 'Leads the shift from selling TAN to mining solutions'],
      ['Parul S. Mehta', 'Non-executive director', 'Promoter family'],
      ['Yeshil S. Mehta', 'Non-executive director (from 1-Jul-2026)', 'Son of the CMD; Joint MD of MAL and DMSL; ex-Bain, Harvard MBA'],
    ], source: 'Q4FY26 board outcome (28-May-2026); Annual Report 2025-26; Q4FY26 call' } },
    { verdicts: [
      ['Audit and accounts', 'Moderate', 'P G Bhagwat LLP (second five-year term); unmodified opinion; KAMs on CCDs and contingencies; audit-trail gap until Oct-2025.', 'Clean, but watch the CCD and incentive accounting.'],
      ['Family-linked financing', 'Weak', 'SCM Growth LLP (promoter) holds ₹300 cr of DMSL CCDs (₹22 cr interest in FY26); SCM Commercial holds ₹151 cr of DFPCL OCDs (₹12 cr); MAL committed ₹75 cr to an AIF run by SCM Commercial.', 'Promoters earn fixed returns inside the group; conflicts need independent scrutiny.'],
      ['Pay', 'Weak', 'CMD ₹31.3 cr in FY26 (~4% of attributable profit), ₹20 cr of it outside salary and commission.', 'High for a ₹17,000 cr company with flat EPS.'],
      ['Capital allocation', 'Moderate', 'Built a world-scale ammonia plant and two growth projects; but the ammonia plant ran ~50% over its first budget (Emkay) and the projects slipped three times.', 'Assets are good; execution and timing are not.'],
      ['Disclosure', 'Moderate', 'Good volume and capacity data each quarter; no profit split between TAN, ammonia and industrial chemicals; CCD conversion terms undisclosed; Q1FY27 transcript hard to access.', 'Enough to model volumes, not margins by business.'],
      ['Balance sheet and ratings', 'Moderate', 'CRISIL AA-/Positive (May-2026); ICRA AA- on Watch with Developing Implications (Apr-2026) over gas supply; net debt 2.9x FY26 EBITDA, 1.4x on Q1FY27 annualised.', 'Investment grade with room; leverage falls if spreads hold.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (Annual Report 2025-26, calls, rating releases)' },
  ],
};

module.exports = { moat, quality, ownership, governance };
