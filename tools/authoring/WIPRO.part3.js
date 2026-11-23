// Wipro report, part 3: moat, Q1FY27 & guidance, earnings quality, ownership, governance. Forecasts in part3b.
const X = require('./WIPRO.ctx');
const { C, D, F, A, n0, n1, pc, rup, Q1, FY26, b, shortDate } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: sticky clients and a strong balance sheet, but no edge that shows up in growth or margins',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings, datasheets, calls and broker notes to Sep-2026; Screener.in for peers\' margins)' },
    { callout: '**Honest verdict: no moat beyond switching costs.** Clients rarely fire an incumbent IT vendor mid-contract, so 97-99% of Wipro\'s revenue repeats each year, and that is real. But every large Indian IT firm has the same advantage, and Wipro has none of the extras that make the leaders worth more: it is smaller than TCS and Infosys, earns 1-8 points lower EBITDA margins than HCLTech, Infosys and TCS, has lost six of its $100 mn+ clients in two years, and cannot yet show that its AI platforms win work. Its best assets are Capco and the balance sheet; neither has produced growth.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: growth only from acquisitions and the rupee; margin down 120 bp YoY; Q2 guide implies organic decline',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations (₹ cr)', n0(Q1.revenuePriorM / 10), n0(Q1.revenueIfrsM / 10), pc((Q1.revenueIfrsM / Q1.revenuePriorM - 1) * 100)],
      ['IT Services revenue ($ mn)', '2,587.4', '2,614.5', `+${Q1.yoyPct}% (CC +${Q1.yoyCcPct}%)`],
      ['Realised INR per $', '85.34', String(Q1.realisedInrUsd), pc((Q1.realisedInrUsd / 85.34 - 1) * 100)],
      ['IT Services EBIT margin', '17.3%', `${Q1.itsMarginPct}%`, `${Q1.marginChgYoyBp}bp`],
      ['EBITDA, Screener basis (₹ cr)', '4,233', '4,633', '+9%'],
      ['Net profit attributable (₹ cr)', n0(Q1.netIncomePriorM / 10), n0(Q1.netIncomeM / 10), pc((Q1.netIncomeM / Q1.netIncomePriorM - 1) * 100)],
      ['EPS, company basis (₹, weighted shares)', String(Q1.epsPriorRs), Q1.epsRs.toFixed(2), '+1%'],
      ['Total bookings / large deals ($ mn)', '4,971 / 2,666', `${n0(Q1.bookingsUsdM)} / ${n0(Q1.largeDealsUsdM)}`, '−32% / −39%'],
      ['Headcount / utilisation', '233,232 / 85.0%', `${n0(Q1.headcount)} / ${Q1.utilisationPct}%`, '+4% (Mindsprint, DTS)'],
      { hl: true, cells: ['**Q2FY27 guide**', '', `**$${n0(Q1.q2Guide.lowUsdM)}-${n0(Q1.q2Guide.highUsdM)} mn**`, '**−1.5% to +0.5% QoQ CC**'] },
    ], source: 'Wipro Q1FY27 press release, datasheet and call (16-Jul-2026); Screener.in' } },
    { bullets: Q1.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said and what happened (Apr-Jul 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: 'Wipro Q4FY26 and Q1FY27 calls' } },
    { callout: '**Why it matters:** Wipro guides one quarter at a time and usually lands inside the range, so the guide is a good read on demand. The Q2 midpoint (−0.5% QoQ CC) includes a full quarter of Mindsprint (two months were in Q1), which means the rest of the business is expected to shrink ~1% in the quarter (ICICI Securities estimates −1.3% organic). There is no sign yet of the turnaround that would justify a higher multiple; our base case assumes none.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean, cash-backed accounts; a fifth of profit is treasury income',
  blocks: [
    { bullets: [
      `**Cash backs profit.** Operating cash flow was ${Math.round(A.cfoToPat[b])}% of attributable profit in FY26, ${Math.round(A.cfoToPat[b - 1])}% in FY25 and ${Math.round(A.cfoToPat[b - 2])}% in FY24; over FY15-26 it was ₹${n0(A.cumulative.cfo)} cr against ₹${n0(A.cumulative.pat)} cr of profit. Capex is only 1.5-2% of revenue. FY26 conversion fell because trade receivables rose 15% on 4% revenue growth (AR FY26), which is worth watching.`,
      `**Other income is large.** ₹${n0(A.otherIncome[b])} cr in FY26, ${Math.round(A.otherIncomeShare[b])}% of pre-tax profit: interest ₹2,837 cr, fair-value gains on funds and start-up stakes ₹812 cr, FX gains ₹185 cr (AR FY26 note 23). It falls by ~₹1,300 cr a year after the June-2026 buyback and acquisitions, which is why our FY27E EPS barely grows despite a weaker rupee.`,
      '**Restructuring is a habit.** Reconciling items (outside the IT Services segment) cost ₹795 cr in FY26: restructuring charges in Q1 and Q3 and the new labour codes in Q4. Management treats them as one-offs; we treat severance as a recurring cost of shrinking the workforce.',
      '**Goodwill is half of equity.** Goodwill was ₹40,436 cr at Jun-26 (from Capco, Rizing, DTS, Mindsprint and others) against attributable equity of ₹77,471 cr. No impairment so far; a write-down would not affect cash but would show that acquisitions destroyed value.',
      '**Disclosure is good.** Wipro files with the SEC (NYSE: WIT), reports under IFRS and Ind AS, discloses dollar revenue, constant-currency growth, SMU and sector splits, bookings, utilisation and attrition every quarter. It does not disclose organic growth after the first quarter of an acquisition, or AI revenue.',
      '**Minorities and put options.** Minorities are tiny (₹68 cr of FY26 profit); written put options to buy out partners in some acquisitions carry a ₹59 cr finance cost.',
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit (Deloitte Haskins & Sells LLP), SEC-level disclosure, strong cash conversion and a simple, cash-rich balance sheet. Watch receivables, recurring "one-off" restructuring and the goodwill from acquisitions that have not produced growth.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Premji family and its philanthropic entities own ${OH.categoriesPctJun26.promoter}% (Jun-2026), mainly through three partnership firms (Zash, Prazim and Hasham Traders, ~60% between them), the Azim Premji Trust (6.5%) and Azim Premji personally (4.1%). Much of the dividend and buyback cash flows to the Azim Premji Foundation's work. Foreign investors own ${OH.categoriesPctJun26.fii}%, Indian institutions only ${OH.categoriesPctJun26.dii}% (7.9% in Mar-2026) and the public ${OH.categoriesPctJun26.public}%. The free float is small (~27%), which limits index weights; Wipro left the Nifty 50 on 30-Sep-2026. Shareholder numbers jumped 17% to ${n1(OH.shareholdersJun26 / 1e5)} lakh in the June quarter as retail investors bought around the buyback.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    [`Promoter group (Jun-2026)`, OH.categoriesPctJun26.promoter + '%', 'Tendered ~42.8 cr shares into the Jun-2026 buyback (72.52% before, 72.59% after)'],
    ...OH.promoterEntitiesMar26.map(([n, p]) => [n, p.toFixed(2) + '%', 'Promoter group, 31-Mar-2026']),
    ...OH.topPublicMar26.map(([n, p]) => [n, p.toFixed(2) + '%', 'Public shareholder, 31-Mar-2026']),
  ], source: OH.src } },
  { callout: `**Our read:** an aligned, patient owner that takes its returns as cash, which is why Wipro pays out 70-90% of profit. Two caveats. The family tendered ~₹10,700 cr into the buyback at ₹250, well above the 30-Sep price, so minority holders who stayed in did worse than the promoter. And with only ~27% free float and domestic funds selling (DIIs ${OH.categoriesPctJun26.dii}%), the stock depends on foreign and retail buyers.` },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: clean accounts and an aligned owner; too many strategy resets',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: C.managementSrc } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Deloitte Haskins & Sells, unqualified; SEC filer; IFRS and Ind AS.', 'No accounting red flags.'],
      ['Board', 'Moderate', 'Executive chairman from the family (Rishad Premji); five independent directors; two long-serving independents retired Mar-2026, one added.', 'Family-led board, competent independents.'],
      ['Promoter alignment', 'Strong', '72.6% owned by the founder\'s family and philanthropy; takes returns as dividends and buybacks.', 'Interests aligned on cash; minority gets the same per-share price.'],
      ['Management stability', 'Weak', 'Three CEOs since 2016 (Abidali Neemuchwala, Thierry Delaporte, Srini Pallia); repeated reorganisations of the go-to-market structure (latest Apr-2026).', 'Strategy resets every few years; growth has not followed.'],
      ['Pay', 'Watch', 'CEO paid ₹49.6 cr in FY26 (524x the median employee), down 7%, in a year of −1.6% CC revenue.', 'High for a shrinking business.'],
      ['Capital allocation', 'Moderate', 'Generous, consistent cash returns; acquisitions (Capco, DTS, Mindsprint) have not lifted organic growth.', 'Returns good, M&A mixed.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, filings, calls)' },
  ],
};

module.exports = { moat, guidance, quality, ownership, governance, forecasts: require('./WIPRO.part3b').forecasts };
