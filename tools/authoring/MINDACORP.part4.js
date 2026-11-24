// Minda Corporation report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./MINDACORP.ctx');
const { C, D, F, A, n0, n1, pc, pc1, b, medEps, withEps, epsCagrFwd, epsBasic, SH_OUT, SH_DIL } = X;
const Q = C.q1fy27, G = C.guidance;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +33% (~24% organic), margin 11.5%, profit +54% before the Vast gain',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '1,386', n0(Q.sales), yoy(Q.sales, 1386)],
      ['of which Minda Vast (consolidated from Apr-2026)', '–', '~125', ''],
      ['EBITDA', '156', n0(Q.ebitda), yoy(Q.ebitda, 156)],
      ['EBITDA margin', '11.3%', `${Q.marginPct}%`, '+19bp'],
      ['Depreciation', '56', n0(Q.dep), yoy(Q.dep, 56)],
      ['Finance cost', '33', n0(Q.interest), yoy(Q.interest, 33)],
      ['Exceptional gain (Vast fair value)', '–', n0(Q.exceptional), ''],
      ['Share of associates and JVs', '13', n0(Q.associates), yoy(Q.associates, 13)],
      ['Reported net profit', '65', n0(Q.pat), yoy(Q.pat, 65)],
      { hl: true, cells: ['**Net profit before the Vast gain (₹106 cr after tax)**', '**65**', `**${n0(Q.patExExceptional)}**`, `**${yoy(Q.patExExceptional, 65)}**`] },
    ], source: 'Q1FY27 presentation p5-10 and call (13-Aug-2026); Screener.in' } },
    { bullets: [
      '**Verticals:** Mechatronics & aftermarket ₹863 cr (+33%, ~+14% without Vast); Information & Connected Systems ₹983 cr (+34%; harness >30%, clusters >35%). Product mix: harness 32%, vehicle access 25%, clusters 16%, die casting 15%. End markets: 2W/3W 46%, CV 27%, PV 19% (15% a year ago), aftermarket 8%.',
      '**Margin:** gross margin fell ~170bp yoy on copper, zinc and aluminium; employee costs +23% (wage increases, Vast); operating leverage held EBITDA margin at 11.5% (Q4FY26: 11.9%). Minda Vast earned 8.4% (6.5% a year ago).',
      '**Associates:** ₹18 cr vs ₹31 cr in Q4FY26: Flash ~₹18-19 cr (Q4: ~₹25 cr) as its margin fell to 15.4%, Furukawa ₹0.8 cr (Q4: ₹5 cr). Management calls both temporary.',
      '**Orders and capacity:** ₹2,500 cr of lifetime orders in the quarter (EV >15%); group utilisation 77-80%; sunroof customer trials approved; Turntide controllers SOP Oct-Nov 2026; ₹63 cr invested in group JVs and subsidiaries.',
    ] },
    { exhibit: { type: 'table', title: 'What management guided (May-2026 to Aug-2026)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['EBITDA margin', G.marginFY27], ['Growth', G.growth], ['Vision 2030', G.vision2030], ['Capex', G.capexFY27], ['Flash Electronics', G.flash],
    ], source: 'Q4FY26 call (22-May-2026); Q1FY27 call and presentation (13-Aug-2026); Vision 2030 deck (23-Sep-2025)' } },
    { callout: '**Why it matters:** Q1 was strong, but about a third of the revenue growth was the Vast consolidation, and Q1 is the last quarter before the GST-boosted base. Holding 11.5-12% margin for the year depends on customers resetting prices for commodities and wages; our FY27E margin of {{F.ebitdaMargin.0|pct}} assumes they mostly do.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit and good cash conversion, but one-offs in three of the last five years',
  blocks: [
    { bullets: [
      `**Cash conversion is good.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26, ${Math.round(A.cfo[b] / 360.3 * 100)}% of owners' profit and ${Math.round(A.cfoToEbitda[b])}% of EBITDA; operating cash has exceeded capex every year since FY22.`,
      '**One-offs are frequent.** FY22 and FY23 profit included exceptional gains and a one-time tax benefit (normalised PAT ₹137 cr and ₹219 cr vs ₹192 cr and ₹284 cr reported); FY20-21 had large exceptional losses; Q1FY27 has a ₹106 cr (after tax) fair-value gain on Minda Vast. We use the company\'s normalised profit in the valuation history and forecast no one-offs.',
      '**Associate profit is a growing share of EPS.** ₹81 cr in FY26 (22% of profit), rising to ~₹100 cr by FY28E. It is after Flash\'s acquisition-related depreciation (not disclosed separately), and the cash reaches Minda only as dividends.',
      '**The Pricol gain bypassed profit.** The ₹239 cr gain on the Pricol sale went through other comprehensive income (Ind AS 109), so it never inflated EPS; it did fund the Flash purchase.',
      '**Audit trail.** The auditor (S R Batliboi, EY) notes that some accounting software at the company and at several JVs/associates did not keep a complete audit trail: a process weakness, not a misstatement.',
      '**Vast changes the comparisons.** From FY27 revenue, EBITDA and minorities include Minda Vast; the associate line loses it. Year-on-year growth in FY27 is flattered by ~9 points.',
    ] },
    { callout: '**Accounting flag: AMBER.** Unqualified audit and solid cash conversion. The amber is for the run of one-offs (gains, a tax benefit, a fair-value gain), the growing associate line whose amortisation is not disclosed, and the audit-trail exceptions.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Ashok Minda family controls ${OH.categories.promoters}% (Jun-2026): Ashok Minda 34.19%, his promoter company Minda Capital 16.14% and Sarika Minda 13.97%. ${OH.pledge} ${OH.afterWarrants} Mutual funds own ${OH.categories.mutualFunds}% (21 schemes), insurers ${OH.categories.insurance}% and foreign portfolio investors ${OH.categories.fii}%, up from ~5% in early 2024. Individuals hold ~6%: the free float is ~35%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: 'Shareholding pattern for the quarter ended 30-Jun-2026 (via Trendlyne and Screener.in). Individual fund schemes above 1% are not named in our sources.' } },
  { callout: '**Our read:** a family-controlled company in which the promoter is putting in new money (₹421 cr of warrants at ₹550, below the as-of price), a sign of confidence but also a transfer of value if the price was low: the warrants were priced in Mar-2025, when the stock closed at ~₹539 (28-Mar-2025), and are worth ~₹143 each more at the as-of price. Control is not contestable.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: adequate, with a highly paid promoter CEO and a promoter warrant issue',
  blocks: [
    { p: `Board: ${D.governance.board}. Management: ${C.management.map(m => `${m[0]} (${m[1]})`).join('; ')}. Auditor: ${D.governance.auditor}.` },
    { verdicts: [
      ['Audit and accounts', 'Moderate', D.governance.auditor, 'Clean opinion; audit-trail gaps and frequent one-offs keep it from "strong".'],
      ['Board', 'Moderate', '4 of 7 directors independent (one woman, Lead Independent Director); 3 executives incl. the promoter and his son.', 'Meets the rules; the family sets strategy.'],
      ['Promoter pay', 'Watch', D.governance.pay, 'High: ~4% of owners\' profit to one executive, mostly as commission.'],
      ['Related parties and capital', 'Watch', D.governance.relatedParty, 'Small in money, but the warrant issue gives the promoter an 18-month option for 25% down.'],
      ['Capital allocation', 'Moderate', 'Pricol stake sold for ~₹250 cr more than it cost; 49% of Flash bought for ~7x its share of book value and ~33x its share of FY25 profit; payout ~9%.', 'Bold; Flash must grow 20%+ for years to earn its cost.'],
      ['Management depth', 'Moderate', D.governance.cfoChange, 'Group CFO changed in FY26; the next generation (Aakash Minda) is executive director.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, Annexure III, notes 2.4, 2.16.8, 2.48); shareholding pattern Jun-2026' },
  ],
};

const gap = (g, s) => (g / s - 1) * 100;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}} (fully diluted), 6-8% below the street',
  blocks: [
    { p: `Revenue comes from the vertical build (chapter "The two verticals"), EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} (guidance 11.5-12%), capex ₹450 cr a year, depreciation 9.5% of gross block (FY27E ₹{{F.dep.0|num}} cr), finance cost ₹118 / 100 / 85 cr, tax 27% and a 10% payout. Other income is built: recurring items ₹12-16 cr plus associate profit less minorities, grossed up for tax (chapter "Flash & the associates"). EPS is on ${n1(SH_DIL)} cr shares (${n1(SH_OUT)} cr outstanding plus 0.765 cr warrants); FY27E excludes the ₹106 cr Vast gain. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (forecast: incl. associates net of minorities, grossed up)', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹; FY26 onwards diluted)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street: EPS (₹, estimates standing on 30-Sep-2026)', head: ['', 'GAM (diluted)', 'GAM (23.91 cr shares)', ...withEps.map(s => s.broker)], rows: [
      ['FY27E', '{{F.eps.0|n1}}', n1(epsBasic[0]), ...withEps.map(s => n1(s.eps.FY27E))],
      ['FY28E', '{{F.eps.1|n1}}', n1(epsBasic[1]), ...withEps.map(s => n1(s.eps.FY28E))],
      ['FY29E', '{{F.eps.2|n1}}', n1(epsBasic[2]), ...withEps.map(s => (s.eps.FY29E ? n1(s.eps.FY29E) : '–'))],
      { hl: true, cells: ['**vs street median, FY28E**', `**${pc(gap(F.eps[1], medEps('FY28E')))}**`, `**${pc(gap(epsBasic[1], medEps('FY28E')))}**`, ...withEps.map(() => '')] },
    ], source: 'Emkay (16-Aug-2026), MNCL (15-Aug-2026), Choice (23-May-2026). Axis Securities\' estimates were not visible to us. Brokers use 23.91 cr shares.' } },
    { callout: `Our FY28E EPS is ${pc(gap(F.eps[1], medEps('FY28E')))} vs the street median (₹${n1(medEps('FY28E'))}); ${pc(gap(epsBasic[1], medEps('FY28E')))} on the same share count. The rest of the gap is a higher tax rate (27%, the FY24-26 average, vs ~25%), slightly higher depreciation and interest, and a 11.8% FY28E margin vs 11.9-12.0%. EPS compounds ~${Math.round(epsCagrFwd)}% a year over FY26-29E from the diluted FY26 base of ₹${n1(A.eps[b])}.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
