// Ramkrishna Forgings report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./RKFORGE.ctx');
const { C, D, F, A, b, n0, n1, pc, pc1, ST, CONS, shares } = X;
const Q = C.q1fy27, QC = Q.consolidated, QS = Q.standalone, G = C.guidance, OH = D.ownership;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +20%, margin 18%, profit 4x; management\'s targets move out a year',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Consolidated revenue', n0(QC.revenuePrior), n0(QC.revenue), yoy(QC.revenue, QC.revenuePrior)],
      ['Consolidated EBITDA (before other income)', n0(QC.ebitdaPrior), n0(QC.ebitda), yoy(QC.ebitda, QC.ebitdaPrior)],
      ['  margin', '14.6%', `${QC.ebitdaMarginPct}%`, '+330bp'],
      ['Standalone domestic revenue', '611', n0(QS.domestic), '+20.3%'],
      ['Standalone export revenue', '319', n0(QS.exports), '+11.0%'],
      ['Standalone EBITDA margin', '14.4%', `${QS.ebitdaMarginPct}%`, '+320bp'],
      ['Profit before tax', n1(QC.pbtPrior), n1(QC.pbtPreEx), yoy(QC.pbtPreEx, QC.pbtPrior)],
      { hl: true, cells: ['**Net profit**', `**${n1(QC.patPrior)}**`, `**${n1(QC.pat)}**`, `**${yoy(QC.pat, QC.patPrior)}**`] },
      ['Net debt (company)', '1,990 (Mar-26)', '1,900 (Jun-26)', '−90'],
    ], source: 'Q1FY27 investor presentation and call (24-Jul-2026)' } },
    { bullets: [
      `**Gross margin 54%** (49% in FY26): better mix and steel pass-through; EBITDA margin rose only ~85bp quarter on quarter because energy, gas and freight costs were not passed on (West Asia conflict).`,
      '**Utilisation 68%** (press 60%, casting 79%, ring rolling 127%): new press and casting capacity added in Q4FY26 diluted it; management expects improvement every quarter.',
      '**Orders:** ₹278 cr of domestic auto orders (82% PV/EV, 18% two-wheeler) and ₹15 cr from metro rail.',
      '**Subsidiaries:** depreciation up after Q4 capitalisation; margins ~50-100bp better quarter on quarter per the CFO.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May and Jul-2026) and what has happened', head: ['When', 'Topic', 'What was said', 'Outcome / our view'], wide: [2, 3], rows: [
      ['Jul-26', 'Revenue', G.revenueFY29, 'The target was FY28 until this call. We model ~₹6,630 cr in FY29E'],
      ['Jul-26', 'Exports', G.exportsFY27, 'Q1 +11%; we model +18%'],
      ['Jul-26', 'Margin', G.margin, 'We model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}'],
      ['Jul-26', 'ROCE', G.roce, 'Our ROE {{F.roe.1|pct}} in FY28E'],
      ['Jul-26', 'Net debt', G.netDebt, 'Jun-26 −₹90 cr; our working-capital assumption gives slower deleveraging'],
      ['Jul-26', 'Capex', G.capexFY27, 'We model ₹350 / 350 / 450 cr'],
      ['May / Jul-26', 'Wheel JV', G.wheels, 'Commercial production was promised for Q1FY27 in May; now Sep/Oct-2026'],
      ['May-26', 'Utilisation', G.utilisation, 'Q1FY27: press 60%, casting 79%'],
    ], source: 'Q4FY26 call (May-2026) and Q1FY27 call (Jul-2026)' } },
    { callout: '**Track record:** management is confident and specific, and dates slip. The ₹8,000 cr revenue target moved from FY28 to FY29; wheel production moved by a quarter; the FY25 inventory problem was found only at the year-end count. We haircut guidance: our FY29E revenue is ~17% below management\'s target and our margins stop ~2pp short of the FY22-24 levels it wants back.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: a restatement, one-off tax credits and a convenient provision',
  blocks: [
    { bullets: [
      '**Inventory overstatement (FY24-25).** ₹220.5 cr at Mar-25 (~5.5% of FY25 revenue), ₹50.2 cr at Mar-24; FY24 restated. Found by the physical count, quantified by independent agencies, booked in FY25. Controls (SAP access, manual entries) were tightened in FY26.',
      '**One-off tax and gains.** FY25 profit included a ₹187 cr deferred-tax asset on ACIL\'s losses and an ₹83 cr discontinued-operations profit (travel unit sold for ₹128 cr). FY26 book tax was 14.5% of PBT. We tax forecasts at 25.5-26%; cash tax will stay lower while ACIL\'s losses are used, which helps cash flow, not EPS.',
      '**A matched provision in Q4FY26.** A ₹42 cr refund of excess electricity duty was booked as exceptional income and a ₹42 cr expected-credit-loss provision on export receivables as an exceptional charge in the same quarter. The CFO said the company "did not want to carry it into our profit", that the amount is "totally receivable", and that it "will help us in future": a write-back later would flatter a future quarter.',
      `**Cash conversion swings.** Operating cash flow was ₹33 cr in FY25 (working capital absorbed ₹362 cr) and ₹${n0(A.cfo[b])} cr in FY26 (₹237 cr released). Inventory still runs at ~210 days on Screener's measure.`,
      '**JV accounting.** The 51% wheel JV is equity-accounted (joint control): its revenue, capex and debt stay off RKFL\'s balance sheet; only the profit share shows (−₹18 cr in FY26).',
    ] },
    { callout: '**Accounting flag: RED.** The overstatement was errors, not fraud, and it has been booked; but it lasted a full year, ratings were cut or put on negative outlook, FY24 had to be restated, and the Q4FY26 provision shows management managing the profit line. We would move to AMBER after a clean FY27 audit with stable inventory days.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `Promoters held ${OH.categories.promoters}% at Jun-2026, mostly through Riddhi Portfolio (34.7%); ${OH.pledge.pctOfPromoter}% of promoter shares (${OH.pledge.pctOfTotal}% of the company) were pledged (${OH.pledge.detail}). Foreign portfolio investors held ${OH.categories.fpi}%, led by Smallcap World Fund (5.96%); Indian mutual funds only ${OH.categories.mutualFunds}% and other domestic institutions ~${OH.categories.otherDii}%; ${n0(OH.shareholders)} shareholders. ${OH.after}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p.toFixed(2) + '%']), source: 'Shareholding pattern for the quarter ended Jun-2026 (company website). Holders above 1%.' } },
  { callout: '**Our read:** Indian mutual funds have largely stayed away (1.9%); the stock is owned by the family, a handful of foreign funds and wealthy individuals. A promoter group that bought ₹405 cr of warrants (₹205 cr of it at 3.6x the market price) has skin in the game; the pledge and the request by one promoter-group company to be reclassified as public are the watch points.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a committed family, weak controls in FY25, a pledge to watch',
  blocks: [
    { p: `Management: ${C.management.map(([n, r]) => `${n} (${r})`).join('; ')}. ${C.auditors}.` },
    { verdicts: [
      ['Audit and controls', 'Weak', 'Inventory overstated by ₹220.5 cr at Mar-25 through erroneous SAP entries and unrecorded rejections; found only at the year-end count; FY24 restated.', 'The basic control over stock failed; FY26-27 must show it is fixed.'],
      ['Promoter support', 'Strong', 'Riddhi Portfolio paid ₹2,100 a warrant (₹205 cr) to restore net worth; Chaitanya Jalan ₹588 (₹200 cr); all converted by 24-Sep-2026.', 'Rare and shareholder-friendly.'],
      ['Promoter pledge', 'Watch', `${OH.pledge.pctOfPromoter}% of promoter shares pledged (Jun-2026).`, 'Forced-selling risk in a sharp fall.'],
      ['Capital allocation', 'Mixed', 'Large capex and acquisitions in FY24-26 before demand; a travel business inside the group (sold FY25); Mexico bought for ₹3.5 cr and loss-making.', 'Growth first, returns later; ROCE 6% in FY26.'],
      ['Disclosure', 'Good', 'Quarterly utilisation, revenue mix, export geography and net debt; calls answer questions.', 'Better than most mid-cap auto-component peers.'],
      ['Credit standing', 'Watch', 'CRISIL AA-/Negative (Dec-2025); India Ratings cut to AA-/Stable (May-2026).', 'Lenders want deleveraging.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; shareholding pattern Jun-2026; rating rationales; press reports on the fact-finding study' },
  ],
};

const DB = ST[0], dil = 18.17 / shares; // street EPS on ~18.17 cr pre-conversion shares
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ~₹21 in FY28E, below the street on revenue and below-EBITDA costs',
  blocks: [
    { p: 'We build revenue from three lines (standalone domestic, standalone exports, subsidiaries net of eliminations), apply a company-basis EBITDA margin (before the JV share), depreciate a gross block of ~₹5,400 cr at 7.2% with capex of ₹350 / 350 / 450 cr, take interest of ₹214 / 180 / 165 cr, other income of ₹12-14 cr plus the JV share, and tax of 26% / 25.5%. EPS is on 18.557 cr shares (after the Sep-2026 warrant conversion). Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (incl. JV share in forecasts)', ref: 'fin.otherIncome' }, { name: 'Interest', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. FY25 reported EPS includes ~₹17 of one-offs (tax credit, discontinued profit); FY26 shown pro forma on 18.557 cr shares.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), Dalal & Broacha (1-Jun-26)', '{{F.eps.0|n1}}', n1(DB.eps.FY27E), '{{F.eps.1|n1}}', n1(DB.eps.FY28E)],
      ['EPS (₹), S&P consensus (Jul-26)', '{{F.eps.0|n1}}', n1(CONS.eps.FY27E), '{{F.eps.1|n1}}', n1(CONS.eps.FY28E)],
      ['Street EPS on 18.557 cr shares (D&B / consensus)', '', `${n1(DB.eps.FY27E * dil)} / ${n1(CONS.eps.FY27E * dil)}`, '', `${n1(DB.eps.FY28E * dil)} / ${n1(CONS.eps.FY28E * dil)}`],
      ['Revenue (₹ cr), D&B / consensus', '{{F.sales.0|num}}', `${n0(DB.revenue.FY27E)} / ${n0(CONS.revenue.FY27E)}`, '{{F.sales.1|num}}', n0(DB.revenue.FY28E)],
      ['EBITDA margin, D&B', '{{F.ebitdaMargin.0|pct}}', `${n1(DB.ebitda.FY27E / DB.revenue.FY27E * 100)}%`, '{{F.ebitdaMargin.1|pct}}', `${n1(DB.ebitda.FY28E / DB.revenue.FY28E * 100)}%`],
    ], source: 'Dalal & Broacha management-meet note (PDF, 1-Jun-2026); S&P Global consensus via StockAnalysis (4 analysts, Jul-2026). Street EPS is on ~18.17 cr shares, before the Jun/Sep-2026 conversions.' } },
    { callout: `Our FY28E EPS (₹${n1(F.eps[1])}) is ${Math.round((1 - F.eps[1] / (DB.eps.FY28E * dil)) * 100)}% below Dalal & Broacha's and ${Math.round((1 - F.eps[1] / (CONS.eps.FY28E * dil)) * 100)}% below the consensus on the same share count. We have higher margins than D&B (they model ~17%) but ~7% less revenue (exports and new units ramp more slowly), and higher depreciation and interest (D&B's FY28E net profit is ₹446 cr on similar EBITDA; ours ₹${n0(F.pat[1])} cr). The gap to the street is in earnings, not just the multiple.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
