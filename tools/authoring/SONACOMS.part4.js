// Sona Comstar report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./SONACOMS.ctx');
const { C, D, F, A, AS, n0, n1, pc, pc1, b, tre0, oiCheck, BL, bld, epsSep, MULT, price, postQ1 } = X;
const Q = C.q1fy27, Q0 = Q.q1fy26, rup = s => String(s).replace(/Rs ?/g, '₹');
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +54%, BEV +107%, margin 23.1% as costs ran ahead of pass-through',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, company basis)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue (incl. forex gain)', n1(Q0.revenue), n1(Q.revenue), yoy(Q.revenue, Q0.revenue)],
      ['of which BEV revenue', '210.6', n1(Q.bev), yoy(Q.bev, 210.6)],
      ['EBITDA', n1(Q0.ebitda), n1(Q.ebitda), yoy(Q.ebitda, Q0.ebitda)],
      ['EBITDA margin', `${Q0.ebitdaMargin}%`, `${Q.ebitdaMargin}%`, '−70bp'],
      { hl: true, cells: ['**Net profit**', `**${n1(Q0.pat)}**`, `**${n1(Q.pat)}**`, `**${yoy(Q.pat, Q0.pat)}**`] },
      ['BEV share of automotive revenue', '26%', '44%', '+18 pts'],
      ['Net order book (₹ cr)', '–', n0(C.orderBook.Q1FY27), '₹1,800 cr added, ₹1,500 cr consumed'],
    ], source: 'Q1FY27 presentation (23-Jul-2026) slides 13, 16, 20, 26. Screener basis: revenue ₹1,301 cr, EBITDA ₹293 cr, PAT ₹180 cr.' } },
    { bullets: [
      '**The base was weak.** Q1FY26 had one month of railway revenue and BEV revenue had collapsed (customer model weakness, magnet curbs, tariffs). Excluding railway (~₹90 cr in Q1FY26, ~₹270 cr in Q1FY27 on our estimate) revenue grew ~35%.',
      '**Margin:** "April was tough, May was even tougher, but June showed improvement" as pass-through caught up; mix moved to lower-margin traction motors. Management expects recoveries to show "progressively more" from Q2.',
      '**Demand:** India strong (PV, e-2W), Europe growing, US improving through the quarter, China mixed but Sona\'s fastest-growing region (suspension motors). Eastern markets were 59% of revenue.',
      '**Wins:** a ₹640 cr hybrid differential programme from a North American OEM, two traction-motor programmes from a new Indian e-2W maker (₹90 cr), ₹250 cr of ICE differential-gear programmes, and ₹600 cr of robotics orders.',
      '**Cash:** "best quarter from an operational cash flow perspective" (lower debtor days); net debt still negative.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (Apr-2026 to Sep-2026)', head: ['When', 'Topic', 'What was said'], wide: [2], rows: [
      ['May-2026 (Q4 call)', 'Margin band', rup(C.guidance.margin)],
      ['May-2026 (Q4 call)', 'Costs', rup(C.guidance.costs)],
      ['Jul-2026 (Q1 call)', 'Ambition', rup(C.guidance.growth)],
      ['May/Jul-2026', 'New businesses', rup(C.guidance.newBusinesses)],
      ['Jul-2026 (Q1 call)', 'Capacity', '"We have enough and more capacity"; OEMs are constrained by other suppliers, not demand.'],
    ], source: 'Q4FY26 call (6-May-2026 transcript); Q1FY27 call (23-Jul-2026)' } },
    { callout: '**Why it matters:** Sona gives no revenue guidance; the only number it commits to is the 23-25% EBITDA band (company basis). Q1 was at the bottom of it. Our FY27E margin of {{F.ebitdaMargin.0|pct}} on Screener\'s basis (~23.3% on the company\'s) assumes only a modest recovery from Q2.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts and few one-offs; the weak spot is disclosure',
  blocks: [
    { bullets: [
      `**Cash conversion is good but slipped in FY26.** Cash from operations was ${Math.round(A.cfoToPat[b - 1])}% of net profit in FY25 and ${Math.round(A.cfoToPat[b])}% in FY26 (₹${n0(A.cfo[b])} cr) as receivables rose with the railway business; free cash flow after capex was ₹${n0(A.fcf[b])} cr (Screener).`,
      '**Few one-offs.** Exceptional items were small after listing: a ₹30 cr after-tax labour-code provision in Q3FY26 (company adjusted PAT ₹670 cr vs reported ₹641 cr) and minor items in other years. The ₹233 cr gain in FY20 was before listing. We use reported EPS.',
      `**Other income** (₹${n0(oiCheck.ttmNormal)} cr in the four quarters to Jun-26 before the labour-code charge) is treasury income plus forex gains; our FY27E ₹{{F.otherIncome.0|num}} cr sits between that and Q1 annualised (₹${n0(oiCheck.q1x4)} cr).`,
      '**Minorities:** NOVELIC\'s minority shareholders absorb part of its losses, so attributable profit is slightly above Screener\'s Net Profit row; we use attributable profit (EPS consistent with 62.2 cr shares).',
      '**PLI income** (auto PLI scheme, eight approved products) is booked in operating income; Q4FY25 carried a full year of it, which flattered that quarter\'s margin by ~1.9 pts (Q4FY26 call).',
      '**Disclosure:** no product or business-unit revenue, an order book that is a management estimate (10-year revenue, discounted), and margin claims for acquisitions ("~₹270 cr of profit at comparable margins") that cannot be checked.',
    ] },
    { callout: '**Accounting flag: GREEN.** Walker Chandiok audit without qualification, few exceptional items, modest goodwill from the railway deal and genuine cash generation. Our caution is about disclosure (and therefore predictability), not accounting.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The promoter is Aureus Investment Pvt Ltd (${OH.categories.promoters}%, Jun-2026), the Kapur family\'s holding company; nothing is pledged. Mutual funds own ${OH.categories.mutualFunds}%, insurers ${OH.categories.insurance}%, foreign portfolio investors ${OH.categories.fpi}% and retail and others ${OH.categories.retailAndOthers}%: institutions own about two-thirds of the company. Indian funds bought heavily in the FY26 sell-off while foreign funds sold (FPIs 33.3% in Dec-2024, 23.6% in Jun-2026).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: rup(OH.namedNote) + ' Sources: AR FY26 (top-10 public shareholders, note 13A), Trendlyne (Jun-2026 categories).' } },
  { callout: '**Our read:** a professionally managed company with a minority promoter. That is a strength (institutional ownership, independent board) and a risk: the Kapur family\'s dispute over Aureus (2025-26) and a promoter nominee on the audit committee from Jul-2026 are governance items to watch, though none has touched the company\'s operations.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: independent board and strong management; a family dispute above the promoter vehicle',
  blocks: [
    { p: rup(`${C.governance.board} MD & Group CEO Vivek Vikram Singh (since 2016) has led the company through the IPO, the EV build-out and the railway and DENSO deals; CFO Rohit Nanda. ${C.governance.promoterEvents}`) },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Walker Chandiok & Co, unqualified; few exceptional items', 'No accounting red flags'],
      ['Board', 'Strong', '6 of 9 independent; independent chairman (Jeffrey Mark Overly) since Jun-2025', 'Better than most promoter-led peers'],
      ['Promoter', 'Watch', 'Aureus (28%): chairman Sunjay Kapur died Jun-2025; his mother disputed control (Jul-2025, company called it baseless); family dispute continued into 2026; Priya Sachdev Kapur on the board and, from Jul-2026, the audit committee', 'Not an operating issue so far; could distract or lead to a stake sale'],
      ['Capital allocation', 'Moderate', 'Railway at ~1.8x revenue; QIP cash parked for nine months; DENSO deal at 4.5x sales', 'Disciplined by its own account ("evaluated 100 opportunities, acted on one"), but returns have halved'],
      ['Pay', 'Watch', 'MD pay ₹15.0 cr in FY26 (144x the median employee, +15%) when adjusted PAT rose 11%; a former holding company paid exit bonuses to some KMP', 'High for a ₹4,500 cr-revenue company'],
      ['Disclosure', 'Moderate', 'Generous on strategy and order wins; no business-unit numbers', 'Hard to verify mix and margin'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, remuneration annexure, board report); Outlook Business (29-Jul-2025); DENSO filing (22-Jul-2026)' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n2}} / ₹{{F.eps.1|n2}} / ₹{{F.eps.2|n2}}, +18% a year',
  blocks: [
    { p: `We forecast revenue from a two-line build: automotive and other (FY26 ~₹${n0(BL.base.auto)} cr on our railway estimate) growing ${BL.autoGrowth.join('% / ')}% and railway growing ${BL.railGrowth.join('% / ')}% (FY27E includes two extra months). EBITDA margins are ${BL.autoMargin.join('% / ')}% (automotive) and ${BL.railMargin.join('% / ')}% (railway), a blended {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} on Screener's basis. Capex ₹${AS.capex.join(' / ')} cr; depreciation ${AS.depRateOnGrossBlock}% of gross block; other income = ${AS.treasuryYield[0]}% on net treasury (₹${n0(tre0)} cr at Mar-26) plus ₹${AS.otherIncome.join('-')} cr of forex gains and other items; interest ₹${AS.interest[0]} cr; tax ${AS.taxRate[0]}%; payout ${AS.payout[0]}%. The DENSO deal is not modelled.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (actuals incl. exceptional items)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, Screener.in, GAM Research estimates. FY26 includes ten months of railway.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (what the targets standing on 30-Sep-2026 imply)', head: ['Broker', 'Target (₹)', 'Method', 'Implied P/E on our Sep-28E EPS', 'Implied P/E on our FY28E EPS'], rows: [
      ...postQ1.map(s => [`${s.broker} (${X.shortDate(s.date)})`, n0(s.tp), s.method, `${n1(s.tp / epsSep.base)}x`, `${n1(s.tp / F.eps[1])}x`]),
      ['Jefferies (28-Sep-2026)', 'n.d.', 'P/E 55x FY28E', '–', '55x (≈ ₹' + n0(55 * F.eps[1]) + ' on our EPS)'],
      { hl: true, cells: ['**GAM Research**', '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E**`, `**${MULT.base}x**`, `**${n1(X.V.tp / F.eps[1])}x**`] },
    ], source: 'Broker targets as in the street table; broker EPS estimates were not public (gap). GAM Research.' } },
    { callout: `Broker EPS estimates standing on 30-Sep-2026 were not available to us, so we compare targets instead. At our EPS the post-Q1 targets imply ${n1(Math.min(...postQ1.map(s => s.tp)) / epsSep.base)}-${n1(Math.max(...postQ1.map(s => s.tp)) / epsSep.base)}x Sep-28E; Jefferies' 55x FY28E would give ~₹${n0(55 * F.eps[1])}. Our EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E (FY22-26: ~${Math.round(X.epsCagrHist)}% a year). As with most of the street, the debate is the multiple.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
