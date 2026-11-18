// Kansai Nerolac report, part 4: Q1FY27 & guidance, earnings quality, capital allocation, ownership, governance.
const X = require('./KANSAINER.ctx');
const { C, D, A, F, n0, n1, pc, pc1, rup, b, ai, Q1, FY, UE, landGains, cashMar26, mcap, price } = X;
const Qd = Q1.consolidated, Qs = Q1.standalone, CO = FY.consolidated;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27 and guidance: growth is back, mostly on price; the margin promise is the same as every year',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (consolidated, ₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Net revenue', n0(Qd.revenueQ1FY26), n0(Qd.revenue), pc1(Qd.growthPct)],
      ['Material cost, % of revenue', `${n1(Qd.materialPctQ1FY26)}%`, `${n1(Qd.materialPct)}%`, `+${Math.round((Qd.materialPct - Qd.materialPctQ1FY26) * 100)}bp`],
      ['EBITDA (PBDIT)', n0(Qd.pbditQ1FY26), n0(Qd.pbdit), pc1((Qd.pbdit / Qd.pbditQ1FY26 - 1) * 100)],
      ['EBITDA margin', `${n1(Qd.pbditMarginQ1FY26Pct)}%`, `${n1(Qd.pbditMarginPct)}%`, `${Math.round((Qd.pbditMarginPct - Qd.pbditMarginQ1FY26Pct) * 100)}bp`],
      ['Profit before tax', n0(Qd.pbtQ1FY26), n0(Qd.pbt), pc1((Qd.pbt / Qd.pbtQ1FY26 - 1) * 100)],
      { hl: true, cells: ['**Net profit (before minorities)**', `**${n0(Qd.patQ1FY26)}**`, `**${n0(Qd.pat)}**`, `**${pc1((Qd.pat / Qd.patQ1FY26 - 1) * 100)}**`] },
      ['EPS, attributable (₹)', '2.73', Qd.epsScreener.toFixed(2), pc1((Qd.epsScreener / 2.73 - 1) * 100)],
      ['Memo: standalone revenue / EBITDA margin', '₹2,087 cr / 14.9%', `₹${n0(Qs.revenue)} cr / ${n1(Qs.pbditMarginPct)}%`, pc1(Qs.growthPct)],
    ], source: 'Q1FY27 investor presentation (3-Aug-2026); Screener (EPS)' } },
    { bullets: Q1.call.map(rup) },
    { exhibit: { type: 'table', title: 'What management said vs what happened', head: ['Topic', 'What was said', 'Outcome (to 30-Sep-2026)'], wide: [1, 2], rows: C.guidance.map(g => [g.item, rup(g.said), rup(g.outcome)]), source: C.guidanceSrc } },
    { callout: '**Why it matters:** Q1FY27 was the best quarter in two years, but the drivers are borrowed: ~5% price (taken to recover a cost spike), a booming auto market and low-cost inventory. Gross margin still fell 110bp. Management has promised a 13-14% EBITDA margin every year and delivered 12-13% consolidated; we give that guidance part credit (12.4% in FY27E) and the "14%+" medium-term aim none.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: a clean audit and good cash, but reported EPS has been a poor guide for three years',
  blocks: [
    { bullets: [
      `**Exceptional items every year.** FY24: +₹661 cr Kavesar land gain; FY25: +₹665 cr Lower Parel land gain less ₹186 cr of subsidiary impairments (standalone); FY26: −₹63 cr (Wage Code ₹45 cr, warehouse fire ₹13 cr, Bangladesh ₹6 cr). Screener books exceptionals inside "other income", so its EPS history (₹14.7 and ₹14.1 in FY24-25) roughly doubles the underlying ₹8.1 and ₹8.0. Our forward P/E work uses EPS before exceptional items for that reason.`,
      `**Treasury income is a sixth of profit.** Of ₹${n0(CO.otherIncome)} cr of FY26 other income, ₹${n0(CO.treasuryIncome)} cr came from the cash pile: interest ₹11 cr, profit on selling mutual-fund units ₹71 cr and fair-value gains ₹47 cr (marked to market). That was ${Math.round(CO.treasuryIncome / CO.pbtBeforeExceptional * 100)}% of profit before tax and exceptional items; it falls if rates fall or the cash is spent.`,
      `**Rebates and discounts.** Revenue is shown after ₹${n0(CO.discountsRebates)} cr of discounts, rebates and incentives (${n1(CO.discountsRebates / CO.grossContractRevenue * 100)}% of the ₹${n0(CO.grossContractRevenue)} cr contract price; ₹${n0(CO.discountsRebatesFY25)} cr in FY25). The ratio is lower than at decorative-heavy peers because of the industrial mix (MD). The auditor lists the estimate of this "variable consideration" as a key audit matter.`,
      `**Minorities.** The 45% partner in Bangladesh absorbs part of its losses, so attributable profit (₹${n0(CO.patOwners)} cr in FY26) is above group profit (₹${n0(CO.pat)} cr). Screener's "Net Profit" row is the group figure; our model uses the attributable one (KANSAINER.patch.js), otherwise the share count would be 2% too low.`,
      `**Subsidiaries.** ~₹211 cr of impairments in FY24-26 (standalone) on Sri Lanka and Bangladesh; Sri Lanka sold for ~₹5 lakh; Bangladesh's revenue fell 36% in FY26 to ₹91 cr with a ₹27.6 cr loss.`,
      `**Cash conversion is good.** Operating cash flow of ₹${n0(A.cfo[ai('FY24')] + A.cfo[ai('FY25')] + A.cfo[b])} cr in FY24-26 compares with ~₹1,944 cr of profit before exceptional items (~127%), helped by lower inventory. Contingent tax claims are small (₹29 cr standalone).`,
    ] },
    { callout: '**Accounting flag: GREEN.** S R B C & Co\'s opinion on the FY26 accounts is unmodified, the only key audit matter is the usual one on rebates, and profits convert to cash. The distortions (land gains, impairments, minorities, treasury gains) are all disclosed; investors just need to strip them out. We do.' },
  ],
};

const s = (k, y0, y1) => A[k].slice(ai(y0), ai(y1) + 1).reduce((t, v) => t + (v || 0), 0);
const capital = {
  id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Capital allocation: cash piles up, subsidiaries lost money, and the new ₹601 cr capex is the first big bet in years',
  blocks: [
    { p: `Over FY21-26 Kansai Nerolac generated ₹${n0(s('cfo', 'FY21', 'FY26'))} cr of operating cash, spent ₹${n0(s('capex', 'FY21', 'FY26'))} cr on capex and paid ₹${n0(s('dividendsPaid', 'FY21', 'FY26'))} cr of dividends. Add ₹${n0(landGains)} cr of pre-tax land gains in FY24-25 and the cash pile rose to ₹${n0(cashMar26)} cr at Mar-2026, ${Math.round(cashMar26 / mcap * 100)}% of the market value at ₹${n0(price)}. Regular dividends stayed at ₹2.50 a share (about a third of underlying EPS); the land sales funded only two ₹1.25 specials (~₹200 cr). Overseas expansion (Sri Lanka, Bangladesh) destroyed value. ROE before exceptionals was ~10% in FY26 (company: 10.3% standalone), dragged down by cash earning ~6%.` },
    { pair: [
      { type: 'column', title: 'Operating cash vs capex and dividends', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }, { name: 'Dividends paid', ref: 'A.dividendsPaid', fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow (consolidated)' },
      { type: 'line', title: 'Core return on capital (ex-cash) ~16-17%; group ROE ~9-10%', unit: '%', x: 'A.labels', from: 'FY19', series: [{ name: 'Core ROCE (ex-cash)', ref: 'A.coreRoce', fmt: 'pct' }, { name: 'ROE (reported)', ref: 'A.roe', fmt: 'pct' }], labels: 'last', min: 0, max: 30, source: 'Screener.in; GAM (core ROCE = EBIT less other income ÷ capital employed less cash)' },
    ] },
    { callout: `**The capital question:** the ₹601 cr expansion (auto, powder, resin) goes where KNPL is strongest, and management expects 15-18% ROCE on it. That is the right place to invest. But even after it, our model has net cash rising to ~₹${n0(F.treasury[2])} cr by FY29E with a 33% payout. A higher payout or a buyback would lift ROE; a higher payout is the simpler route, because with the parent at the 75% ceiling a buyback would need Kansai Paint to tender its own shares. Neither has been announced.` },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Kansai Paint owned ${OH.categoriesPct.promoter}% in Jun-2026, unpledged. Of the ~25% free float, insurers held ${OH.categoriesPct.insurance}% (LIC alone ${OH.named[1].pct}%), mutual funds ${OH.categoriesPct.mutualFunds}% (Nippon Life India ${OH.named[2].pct}%), foreign portfolio investors ${OH.categoriesPct.fii}% and retail investors ~${n1(OH.categoriesPct.retailSmall + OH.categoriesPct.retailLarge)}%. Foreign funds cut their stake from ~5.4% (Jun-2025) to ~4%; shareholder numbers fell to ${n0(OH.counts.shareholdersJun26)}.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Holders above 1% and categories (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.named.map(h => [h.name, h.pct + '%', h.note || 'Jun-2026']),
    ['All mutual funds', OH.categoriesPct.mutualFunds + '%', 'Jun-2026'],
    ['Insurance companies', OH.categoriesPct.insurance + '%', 'Jun-2026'],
    ['Foreign portfolio investors', OH.categoriesPct.fii + '%', 'Jun-2026'],
    ['Retail (individuals)', n1(OH.categoriesPct.retailSmall + OH.categoriesPct.retailLarge) + '%', 'Jun-2026'],
  ], source: 'BSE shareholding pattern (Jun-2026, the latest public on 30-Sep-2026) via Trendlyne and Screener' } },
  { callout: '**Our read:** the stock is owned mainly by the parent and Indian insurers; with only ~25% float and little foreign interest it is thinly traded. The parent cannot buy more without breaching the 75% public-shareholding rule, so a stake increase would need a delisting offer; we found no sign of one.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a clean, professionally run subsidiary with a new MD and CFO',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people (as of 30-Sep-2026)', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note)]), source: C.managementSrc } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'S R B C & Co LLP; unmodified opinion; key audit matter on rebates only.', 'No red flags.'],
      ['Board', 'Moderate', 'Six directors from Apr-2026: three independent (incl. the chairman), two Kansai Paint nominees, the MD.', 'Independent chair; the parent holds the real power.'],
      ['Related parties', 'Strong', `Royalty ₹${n1(FY.royaltyPaidToParent)} cr (~0.4% of revenue); trade with the group negligible.`, 'Not milked by the parent.'],
      ['Pay', 'Strong', 'MD ₹2.96 cr (30x the median employee) in FY26; previous MD ₹13.4 cr in FY25.', 'Reasonable.'],
      ['Capital allocation', 'Weak', 'Cash 18% of market value; ~33% regular payout; ~₹211 cr written off on overseas subsidiaries.', 'Too conservative at home, poor abroad.'],
      ['Disclosure', 'Moderate', 'Quarterly calls and presentations; parent\'s strategy briefings; but one segment, no decorative/industrial split or margins.', 'The key numbers have to be estimated.'],
      ['Management stability', 'Moderate', 'New MD (Apr-2025) and CFO (Aug-2025); whole-time director left Mar-2026.', 'A new team still to prove its decorative plan.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (annual report FY26, CRISIL, calls to Sep-2026)' },
  ],
};

module.exports = { guidance, quality, capital, ownership, governance };
