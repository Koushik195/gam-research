// Jubilant FoodWorks report, part 4: Q1FY27 and guidance, earnings quality, ownership, governance, our forecasts vs the street.
const X = require('./JUBLFOOD.ctx');
const { C, D, F, A, b, Q1, CO, n0, n1, n2, pc, medOf, ST, epsBei, preEbitda } = X;
const L1 = 'Q1FY27 letter and call (13-Aug-2026)', QQ = C.quarters;
const yoy = (a, c) => `${a >= c ? '+' : '−'}${Math.abs((a / c - 1) * 100).toFixed(1)}%`;

const guidance = {
  id: 'q1', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: `Q1FY27: revenue +${Q1.revenueGrowth}%, EBITDA +${Q1.ebitdaGrowth}%, profit flat; cost inflation of ~200 bp held to ~20 bp`,
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, continuing operations)', head: ['', 'Q1FY27', 'YoY', 'Comment'], wide: [3], rows: [
      ['Revenue from operations', n0(Q1.revenue), `+${Q1.revenueGrowth}%`, `System sales ₹${n0(Q1.systemSales)} cr; ${Q1.netAdds} net new stores (${n0(Q1.storesTotal)} in all)`],
      ['  Standalone (India)', n0(Q1.standalone.revenue), `+${Q1.standalone.revenueGrowth}%`, 'Domino\'s +7.4% (LFL 2.5%, orders +6.5%); Popeyes +97%'],
      ['  International (consolidated less standalone)', n0(Q1.revenue - Q1.standalone.revenue), yoy(Q1.revenue - Q1.standalone.revenue, QQ.Q1FY26.revenue - QQ.Q1FY26.saRevenue), 'DP Eurasia +28.2% in rupees; Domino\'s Turkey LFL −1.3% after inflation'],
      ['EBITDA (after Ind AS 116)', n0(Q1.ebitda), `+${Q1.ebitdaGrowth}%`, `${Q1.ebitdaMargin}% (19.6% a year ago); standalone ${Q1.standalone.ebitdaMargin}% (19.3%), gross margin ${Q1.standalone.grossMargin}% (+133 bp)`],
      ['Depreciation / finance cost', `${n0(Q1.depreciation)} / ${n0(Q1.financeCost)}`, '+18.8% / +9.2%', 'Mumbai commissary in for a full quarter'],
      ['PAT, continuing operations', n0(Q1.patContinuing), '−0.8%', 'Lower IAS 29 monetary gain and tax on Turkish dividends; Q1FY26 had a one-off tax set-off'],
      ['Net profit to owners (after Dunkin\' loss ₹3 cr)', n0(Q1.patOwners), '+5.4%', `EPS ₹${n2(Q1.eps)}; after-rent PAT margin ${Q1.preIndAsPatMargin}%`],
    ], source: `${L1}; Screener.in (profit for EPS)` } },
    { bullets: C.guidance.map(g => `**${g.item}:** ${g.text}.`) },
    { callout: '**What we take from it:** a quarter of better orders and well-managed costs, not yet of better LFL. The parts that matter for FY27 are the Q2 LFL (management: better than Q1), whether the 140 bp of price sticks without hurting orders, and the size of the Turkish monetary gain. Management did not change any guidance.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Clean audit; four things to adjust for: rent outside EBITDA, Turkey\'s inflation accounting, one-offs and minorities',
  blocks: [
    { bullets: [
      `**EBITDA excludes rent.** Ind AS 116 moves rent into depreciation and interest (lease interest ₹337 cr in FY26) and the cash into financing (₹641 cr of lease payments). Operating cash flow (₹1,894 cr) therefore overstates cash earnings; we treat lease principal as capex in the forecasts and show EBITDA after rent separately.`,
      '**Hyperinflation (IAS 29).** DP Eurasia\'s results are restated to the latest Turkish price level each period, include a monetary gain or loss on net monetary items inside EBITDA, and are translated at the closing lira rate. Quarterly International margins and DP Eurasia\'s PAT are therefore noisy; management asks investors to judge them on a full year.',
      `**One-offs.** FY24: ₹170 cr gain on remeasuring the old DP Eurasia stake. FY25: ₹4.5 cr associate write-down; Dunkin' and Russia losses (₹33 cr) in discontinued operations. FY26: ₹33.7 cr Labour Code charge; discontinued operations +₹58 cr (Russia gain ₹82 cr less Dunkin' ₹24 cr). EPS before these: ₹${n2(epsBei[2024])} (FY24), ₹${n2(epsBei[2025])} (FY25), ₹${n2(epsBei[2026])} (FY26) vs reported ₹6.05, ₹3.19, ₹6.49. Our forecasts carry none of them; Screener's annual "other income" includes them, so its FY24 and FY26 profit look better than the business.`,
      `**Minorities.** ₹15.8 cr of FY26 profit (₹3 cr in Q1FY27) belongs to DP Eurasia's 6.35% outside holders and the Bangladesh partner; we use profit after minorities (JUBLFOOD.patch.js), add ~2.5-3 points to the tax rate in forecasts and deduct their share of value in the SOTP.`,
      '**Screener vs company EBITDA.** Screener\'s FY26 EBITDA (₹1,902 cr) is ₹14 cr above the company\'s (₹1,888 cr) because it shows losses on store discards below EBITDA; we forecast on the company basis. Screener\'s Q1-Q2FY26 quarters still include Dunkin\'.',
      '**Intangibles.** Goodwill ₹799 cr and other intangibles ₹1,355 cr (mostly DP Eurasia\'s brand and master-franchise rights, indefinite-life, tested yearly; no impairment in FY26).',
    ] },
    { callout: '**Accounting flag: AMBER.** Deloitte Haskins & Sells gives a clean opinion and we found nothing improper. The amber reflects how much judgement sits between reported and underlying profit: hyperinflation restatement, two years of re-presented discontinued operations, and a headline EBITDA that leaves out the largest store cost.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `At Jun-2026 the promoter group held ${OH.categories.promoters}%, foreign institutions ${OH.categories.fii}%, Indian institutions ${OH.categories.dii}% and the public ${OH.categories.public}%. ${OH.trend} ${OH.mar26Detail}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest named shareholders at 31-Mar-2026 (latest named list)', head: ['Holder', '% of shares'], rows: OH.named.map(h => [h.holder, n2(h.pct)]), source: 'AR FY26 note 13; Jun-2026 category totals from Screener.in (the Jun-2026 pattern by name was not available to us)' } },
  { callout: '**Our read:** a stable promoter with a long record, and a shift from foreign to Indian funds that has matched the de-rating: foreign holders more than halved their stake over 2½ years. A one-off 1.7% promoter sale in mid-2025 was not repeated by Jun-2026.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Promoter-controlled, professionally run; small but recurring related-party purchases',
  blocks: [
    { p: `Management: ${C.management.map(m => `${m.name} (${m.role})`).join('; ')}. Auditor: ${C.auditor}. ${D.governance.board}` },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Deloitte; clean opinion; discontinued operations and IAS 29 explained in detail', 'No accounting red flags; complexity is the issue, not honesty'],
      ['Related parties', 'Moderate', D.governance.relatedParty.replace(/Rs ?/g, '₹'), 'Small (~1% of costs) but worth watching'],
      ['Capital allocation', 'Moderate', D.governance.capitalAllocation.replace(/Rs ?/g, '₹'), 'Turkey earns its keep in cash; returns on the whole group are ~15% ROCE'],
      ['Disclosure', 'Strong', 'Shareholder letters with Q&A, LFL, ADS, store counts by brand and market, pre-Ind AS margins for India', 'Better than most consumer peers; Popeyes revenue and DP Eurasia\'s monetary gain still not quantified'],
      ['Promoter alignment', 'Strong', '40.27% held via Jubilant Consumer Pvt Ltd (Bhartia family); 1.7% sold in the Jun-2025 quarter', 'Long-term owner'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; shareholder letters; GAM Research' },
    { callout: '**Overall: GREEN.** Governance is sound. The decisions to exit Dunkin\', stop funding Hong\'s and sell Russia show willingness to cut losers; the Turkey deal (₹770 cr for control) has so far paid back in cash dividends and growth, at the cost of complexity.' },
  ],
};

const withEps = ST.filter(s => s.eps && s.eps.FY28E), medE = y => medOf(withEps.map(s => s.eps[y]).filter(v => v));
const withEb = withEps.filter(s => s.postEbitda?.FY28E), cagr = (Math.pow(F.eps[2] / epsBei[2026], 1 / 3) - 1) * 100;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n2}} / ₹{{F.eps.1|n2}} / ₹{{F.eps.2|n2}} for FY27-29E, in line with consensus',
  blocks: [
    { p: `India revenue +{{as.segments.0.growth.0|pct0}} / +{{as.segments.0.growth.1|pct0}} / +{{as.segments.0.growth.2|pct0}} and International +{{as.segments.1.growth.0|pct0}} / +{{as.segments.1.growth.1|pct0}} / +{{as.segments.1.growth.2|pct0}}: consolidated revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}}. EBITDA margin (after Ind AS 116) {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}; after rent ${preEbitda.map((v, i) => n1(v / F.sales[i] * 100) + '%').join(' / ')}. Capex including lease principal ₹{{as.capex.0|num}} / {{as.capex.1|num}} / {{as.capex.2|num}} cr; depreciation {{as.depRateOnGrossBlock|n1}}% of gross block; other income ₹{{as.otherIncome.0|num}}-{{as.otherIncome.2|num}} cr (incl. associates); finance cost ₹{{as.interest.0|num}}-{{as.interest.2|num}} cr; tax incl. minorities {{as.taxRate.0|n1}}% / {{as.taxRate.1|n1}}%; payout {{as.payout.0|pct0}}. EPS compounds ~${Math.round(cagr)}% a year over FY26-29E from ₹${n2(epsBei[2026])} before one-offs (reported ₹${n2(A.eps[b])}), driven by EBITDA growth of ~14% a year and slower growth in depreciation and interest.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY22', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (after Ind AS 116)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (forecast incl. lease principal)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM', ...withEps.map(s => `${s.broker} (${s.date.slice(8, 10)}-${s.date.slice(5, 7)})`), 'Consensus'], rows: [
      ['Revenue FY28E (₹ cr)', '{{F.sales.1|num}}', ...withEps.map(s => (s.revenue?.FY28E ? n0(s.revenue.FY28E) : '–')), '–'],
      ['EBITDA FY28E, after Ind AS 116 (₹ cr)', '{{F.ebitda.1|num}}', ...withEps.map(s => (s.postEbitda?.FY28E ? n0(s.postEbitda.FY28E) : '–')), '–'],
      ['EPS FY27E (₹)', '{{F.eps.0|n2}}', ...withEps.map(s => (s.eps.FY27E ? n2(s.eps.FY27E) : '–')), '7.30'],
      ['EPS FY28E (₹)', '{{F.eps.1|n2}}', ...withEps.map(s => n2(s.eps.FY28E)), '9.10'],
      { hl: true, cells: ['**GAM vs broker median, FY28E EPS**', `**${pc((F.eps[1] / medE('FY28E') - 1) * 100)}**`, ...withEps.map(() => ''), ''] },
    ], source: 'Broker notes 13-14 Aug-2026 (ICICI Securities: 21-May-2026 forecasts); Prabhudas Lilladher is standalone; consensus = Bloomberg as cited by BOB Capital Markets (13-Aug-2026)' } },
    { callout: `**Where we differ:** hardly at all on earnings. Our FY28E EBITDA (₹${n0(F.ebitda[1])} cr) sits between BOB Capital Markets (₹${n0(withEb.find(s => /BOB/.test(s.broker))?.postEbitda.FY28E || 0)} cr) and Emkay (₹${n0(withEb.find(s => /Emkay/.test(s.broker))?.postEbitda.FY28E || 0)} cr) and matches Motilal Oswal; our EPS is within 2% of consensus. The difference in our call is the multiple, not the numbers.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
