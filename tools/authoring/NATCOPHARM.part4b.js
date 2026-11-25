// Natco Pharma report, part 4b: margins, earnings quality, ownership, management and governance.
const X = require('./NATCOPHARM.ctx2');
const { C, D, F, A, FY26, Q1, OB, n0, n1, b, ix, taxRows } = X;
const R = (k, l) => A[k][ix(l)];
const costs = { fy25: { mat: 536.2 + 166.1 - 12.5, emp: 594.5, oth: 949.2, rev: 4429.5 }, fy26: { mat: 593.5 + 203.2 - 106.2, emp: 687.2, oth: 1264.1, rev: 4078.3 } };
const pctOf = (x, r) => `${n1(x / r * 100)}%`;
const own = D.ownership, cat = own.categories;

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: 50% was the windfall; the business without it earns about 25% before other income',
  blocks: [
    { p: `Natco reports "EBITDA including other income" (39.6% in FY26, 30.9% in Q1FY27). We use Screener's basis, which excludes other income: ${n1(R('ebitdaMargin', 'FY25'))}% in FY25, ${n1(R('ebitdaMargin', 'FY26'))}% in FY26, 25.3% in Q1FY27. The gap matters at Natco because other income (interest on ~₹2,000-3,000 cr of cash, forex, licensing) is large. Gross margin is unusually high because profit-share revenue carries no material cost: materials were ${pctOf(costs.fy25.mat, costs.fy25.rev)} of revenue in FY25 and ${pctOf(costs.fy26.mat, costs.fy26.rev)} in FY26. The fixed costs did not shrink with the windfall: employee costs rose 16% to ₹${n0(costs.fy26.emp)} cr and other expenses (incl. ₹408 cr of R&D, freight, legal) 33% to ₹${n0(costs.fy26.oth)} cr in FY26.` },
    { exhibit: { type: 'table', title: 'Cost structure (₹ crore, % of revenue from operations)', head: ['', 'FY25', '% rev', 'FY26', '% rev', 'FY27E (GAM)', '% rev'], rows: [
      ['Revenue from operations', n0(costs.fy25.rev), '100%', n0(costs.fy26.rev), '100%', n0(F.sales[0]), '100%'],
      ['Materials (net of inventory change)', n0(costs.fy25.mat), pctOf(costs.fy25.mat, costs.fy25.rev), n0(costs.fy26.mat), pctOf(costs.fy26.mat, costs.fy26.rev), '–', '–'],
      ['Employee costs', n0(costs.fy25.emp), pctOf(costs.fy25.emp, costs.fy25.rev), n0(costs.fy26.emp), pctOf(costs.fy26.emp, costs.fy26.rev), '–', '–'],
      ['Other expenses (incl. R&D)', n0(costs.fy25.oth), pctOf(costs.fy25.oth, costs.fy25.rev), n0(costs.fy26.oth), pctOf(costs.fy26.oth, costs.fy26.rev), '–', '–'],
      { hl: true, cells: ['**EBITDA (Screener basis)**', `**${n0(R('ebitda', 'FY25'))}**`, `**${n1(R('ebitdaMargin', 'FY25'))}%**`, `**${n0(R('ebitda', 'FY26'))}**`, `**${n1(R('ebitdaMargin', 'FY26'))}%**`, `**${n0(F.ebitda[0])}**`, `**${n1(F.ebitdaMargin[0])}%**`] },
    ], source: 'AR FY26 consolidated P&L and notes 24-28 (FY25 comparatives); Screener.in; GAM estimates. Screener moves a ₹23 cr FY26 write-down from expenses into other income, so its EBITDA is slightly higher than the AR lines imply.' } },
    { callout: `**Our margin path:** {{F.ebitdaMargin.0|pct}} in FY27E (the Q1 level, with R&D guided at 7-9% of sales vs 10.5% in FY26), {{F.ebitdaMargin.1|pct}} in FY28E as limited-competition US launches arrive and {{F.ebitdaMargin.2|pct}} in FY29E. A single sole-FTF launch can add several points for two quarters, so actual quarters will be far more volatile than this.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: AMBER: profit-share accruals, a ₹494 cr refund liability, one-off tax credits and a large non-cash associate line',
  blocks: [
    { verdicts: [
      ['Profit-share revenue', 'Watch', 'US revenue is mostly a share of partners\' profits, booked on estimates: unbilled revenue was ₹833.8 cr at Mar-25 and ₹150.7 cr at Mar-26.', 'Revenue can be trued up later; disclosure of partner terms is thin.'],
      ['Refund liability', 'Watch', 'Price protection and returns provision of ₹494.5 cr at Mar-26 (₹16.8 cr at Mar-25): lenalidomide channel inventory repriced after full generic entry.', 'Already charged to FY26 revenue; paid out in FY27, so FY27 cash flow will lag profit.'],
      ['One-offs in reported profit', 'Small', 'FY26: ₹115 cr one-time deferred-tax credit (new regime) = 8% of PAT; FY25: ₹90.1 cr gain on sale of land/PPE; Q4FY26: ₹20-30 cr engineering-spares write-down; litigation provisions ₹55.9 cr in FY26.', 'Below 10% of profit in any year; we keep reported EPS in the multiple and show EPS before one-offs as a sensitivity.'],
      ['Associate profit', 'Watch', `Adcock share ₹46.6 cr in FY26 and ₹84.3 cr in Q1FY27 (41% of PAT); dividends received ₹36.9 cr in FY26. We forecast ₹${OB.assoc[0]}-${OB.assoc[2]} cr a year.`, 'A third of profit will be equity-accounted, not cash, and not controlled.'],
      ['Tax rate', 'Volatile', 'Effective 8% in FY26 (deferred-tax credit), 34% in Q1FY27 (Brazil); new regime from FY27 (25.17% statutory, ~27% effective in India).', `We use 28% / 27% / 27% before the associate share (engine rates ${taxRows.map(r => n1(r.rate)).join(' / ')}% on PBT incl. it).`],
      ['Cash conversion', 'Good', 'CFO/EBITDA 94% in FY25 and 148% in FY26 as receivables unwound and provisions rose.', 'FY27 conversion will be weaker (refund-liability payout).'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Earnings-quality scorecard', source: 'AR FY26 notes 12, 19(e), 22-23, 29, 41; Q4FY26 and Q1FY27 calls; Screener.in' },
    { callout: '**Accounting flag: AMBER.** Nothing looks wrong, but three things make reported profit harder to read than at most peers: estimates in profit-share revenue, the size of the price-protection provision, and the move of a third of profit into an equity-accounted associate.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The Nannapaneni family controls Natco with ${cat.promoters}% (Jun-2026): founder-chairman V.C. Nannapaneni holds 15.66% directly, and family companies and trusts (Time Cap Pharma Labs 9.59%, Natsoft Information Systems 8.81%, V.S. Swathi Kantamani 8.90%, Neelima Nannapaneni Trust 2.28%) most of the rest. Foreign portfolio investors held ${cat.fii}% and domestic institutions only ${cat.dii}% (mutual funds 1.92%, insurers 3.64%). ${own.trend}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest shareholders (31-Mar-2026) and categories (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: [
    ...own.promoterHolders.map(([h, s]) => [h, `${s.toFixed(2)}%`]),
    ['**Categories at 30-Jun-2026**', ''],
    ['Promoter group', `${cat.promoters}%`], ['Foreign portfolio investors', `${cat.fii}%`], ['Domestic institutions (MFs 1.92%, insurers 3.64%)', `${cat.dii}%`], ['Public and others', `${cat.public}%`], ['Shareholders (number)', n0(cat.shareholders)], ['Promoter pledge', own.pledge],
  ], source: `${own.promoterSrc}; Q1FY27 investor presentation (categories at 30-Jun-2026); Screener.in` } },
  { callout: '**So what:** a family-controlled company with a big retail base and few domestic institutions. The rights issue (record date 1-Oct-2026) will show whether the promoters put in more money at ₹750; the terms set on 25-Sep-2026 do not say.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: candid founders with a strong patent record; capital allocation is the question',
  blocks: [
    { p: `${C.management.text} Statutory auditor: B S R and Co (KPMG network), appointed in Sep-2024 for five years. Board: nine directors, five of them independent.` },
    { verdicts: [
      ['Board independence', 'Moderate', 'Five of nine directors independent; lead independent director; four executive directors incl. the two promoters.', 'Meets the rules; the founder family runs the company.'],
      ['Promoter alignment', 'Strong', `${cat.promoters}% family stake (pledge status at Jun-2026 not checked); small family sales in FY26 (Satya Vani and Sanjay Nannapaneni).`, 'Owners think long term (CEO: "8 to 10 year cycle").'],
      ['Executive pay', 'Moderate', 'Chairman ₹7.60 cr and CEO ₹7.39 cr in FY26 (112x and 109x the median employee), both down 24% with profit.', 'About 1% of PAT; linked to profit.'],
      ['Disclosure and candour', 'Moderate', 'Gives annual PAT guidance and frank answers ("roller coaster"); but does not disclose lenalidomide sales, partner terms or the names of upcoming exclusivities.', 'Investors cannot size the pipeline.'],
      ['Capital allocation', 'Weak-Moderate', 'Buyback in FY23-FY24; then ~₹3,140 cr on a 49% stake earning ~7%, part-funded by loans now repaid with a ₹1,279 cr rights issue; buybacks ruled out; "another very large transaction" sought.', 'The next deal will define the record.'],
      ['Regulatory and legal', 'Moderate', 'Kothur warning letter (2024) closed Sep-2025; Mekaguda and Chennai cleared; litigation provisions ₹63 cr at Mar-26; 15-20% of the land bank tied up in disputes (CEO).', 'Clean today; Visakhapatnam inspection pending.'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (Board\'s report, corporate governance report, remuneration annexure, note 19); company calls' },
  ],
};

module.exports = { margins, quality, ownership, governance };
