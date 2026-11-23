// Endurance Technologies report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./ENDURANCE.ctx');
const { C, D, F, A, M, n0, n1, pc, pc1, b, withEps, medEps, epsCagrFwd, epsCagrHist } = X;
const Q = C.q1fy27, G = C.guidance, FY = C.fy26, OI = C.otherIncomeFY26;
const q = M.quarterly, qi = q.labels.indexOf('Q1FY27'), qp = q.labels.indexOf('Q1FY26');
const yoy = k => pc1((q[k][qi] / q[k][qp] - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +30%, EBITDA +21%, profit +8%: growth outran price resets',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, consolidated, Screener basis)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(q.sales[qp]), n0(q.sales[qi]), yoy('sales')],
      ['EBITDA (excl. other income)', n0(q.ebitda[qp]), n0(q.ebitda[qi]), yoy('ebitda')],
      ['EBITDA margin', q.opm[qp] + '%', `${n1(q.ebitda[qi] / q.sales[qi] * 100)}%`, `${Math.round((q.ebitda[qi] / q.sales[qi] - q.ebitda[qp] / q.sales[qp]) * 10000)}bp`],
      ['Other income', n0(q.otherIncome[qp]), n0(q.otherIncome[qi]), yoy('otherIncome')],
      ['Depreciation', n0(q.dep[qp]), n0(q.dep[qi]), yoy('dep')],
      ['Finance cost', n0(q.interest[qp]), n0(q.interest[qi]), yoy('interest')],
      { hl: true, cells: ['**Net profit**', `**${n0(q.pat[qp])}**`, `**${n0(q.pat[qi])}**`, `**${yoy('pat')}**`] },
      ['By entity: India / Maxwell / Europe total income', '2,351 / 31 / 1,007', '3,194 / 57 / 1,146', '+36% / +85% / +14%'],
      ['By entity: EBITDA incl. other income (margin)', '306 (13.0%) / 1 / 174 (17.3%)', '358 (11.2%) / 4 / 208 (18.2%)', '+17% / – / +19%'],
    ], source: 'Screener.in (as reported, 13-Aug-2026); Q1FY27 presentation p22 and call (14-Aug-2026)' } },
    { bullets: [
      `**India:** income +35.9% (about 12.9 points from metal pass-through); motorcycles ~70% of standalone income, scooters 14.3%. EV sales ₹${Q.standalone.evSales} cr (+88%). Margin 11.2%: Q1 billed on Q4 metal rates; gas, fuel and wages up; Bidkin wheels and the battery-pack plant still ramping. ₹35 cr of state incentives booked.`,
      '**Europe:** EUR104.3 mn (+1.1%), EBITDA 18.2%, profit −31% in euros on accelerated depreciation (EUR11.6 mn vs EUR8.5 mn). Orders EUR13.9 mn (Mercedes hybrid, Stellantis); stake in Stöferle raised to 68%; Veicoli Srl sold.',
      `**Industry:** ${Q.industry}`,
      '**Orders:** India ₹391.6 cr in Q1 (excl. Bajaj; ₹336 cr from Honda, incl. a ₹220 cr higher-margin suspension facelift); ₹10.5 cr more from the US EV maker (now ₹223 cr a year); RFQs ₹4,526 cr.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-2026 to Aug-2026)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['Margin', G.margin], ['Capex', G.capex], ['Orders', G.orders], ['New plants', G.newPlants], ['Four-wheelers', G.fourWheeler], ['Incentives', G.incentives], ['M&A', G.mna],
    ], source: 'Q4FY26 call (15-May-2026); Q1FY27 presentation and call (13/14-Aug-2026)' } },
    { callout: '**Why it matters:** Endurance gives no margin guidance, only direction ("better Q2 and Q3"). Our FY27E India margin of {{as.segments.0.marginPct.0|pct}} needs ~12.3% for Q2-Q4, i.e. most of the Q1 shortfall recovered; the street (MOSL 11.3-12.1% for Q2-Q4 standalone ex other income) is similar. The bear case assumes metal and energy stay high and customers pay late.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit and strong cash conversion; incentives and acquisition accounting to watch',
  blocks: [
    { bullets: [
      `**Cash conversion is strong.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26, ${Math.round(A.cfoToPat[b])}% of profit and ${Math.round(A.cfoToEbitda[b])}% of EBITDA (FY21-25: 60-99%). Suppliers fund working capital (payables ~100 days).`,
      `**State incentives sit in revenue.** ₹${FY.incentivesBooked} cr of Maharashtra PSI incentives were booked in FY26 revenue (~6% of EBITDA) and ₹35 cr in Q1FY27; the entitlement (₹858 cr) is finite and paid as state-GST refunds over ~7 years. Q4FY26's India margin fell 190bp partly because incentive bookings were 110bp lower.`,
      `**Other income is mostly treasury and miscellaneous items.** FY26 ₹${n0(OI.total)} cr: income from liquid/debt funds ₹${n0(OI.currentInvestments)} cr (incl. ₹24 cr fair-value gains), interest ₹${n0(OI.depositInterest + OI.otherInterest)} cr, foreign-exchange gain ₹${n0(OI.fxGain)} cr and ₹${n0(OI.misc)} cr of "miscellaneous income" (₹${n0(C.otherIncomeFY26.fy25.misc)} cr in FY25) that is not explained further. We forecast ₹115-125 cr without currency gains.`,
      '**Acquisition accounting.** Stöferle is consolidated at 100% with a ₹246 cr liability for the 40% Endurance does not yet own; its value depends on Stöferle\'s future EBITDA (assumed EUR18-21 mn) and is re-measured each year, which can move profit. Goodwill (Stöferle ₹349 cr, Maxwell ₹104 cr) is tested for impairment; the auditor flagged both as key audit matters.',
      '**Exceptional items are small.** ₹21 cr labour-code charge in FY26; small gains in FY24-25. We forecast none.',
      '**Depreciation choices move Europe\'s profit.** The accelerated write-off of ICE-programme assets (~EUR3 mn a quarter) lowers FY27-28 profit and raises it after; EBITDA is unaffected.',
    ] },
    { callout: '**Accounting flag: AMBER.** Unmodified audit by S R B C & Co. (EY network), strong cash conversion and no material related-party dealings with the promoters. The amber is for incentives inside revenue, a large unexplained "miscellaneous" other-income line, and the Stöferle put/call liability whose re-measurement can move profit.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Jain family holds ${OH.categories.promoters}% (Jun-2026), the maximum allowed for a listed company: Managing Director Anurang Jain 30.9% and the promoter group 44.1% (Mar-2026). ${OH.pledge} Foreign portfolio investors own ${OH.categories.fii}% (up from ~8% in 2024) and Indian institutions ${OH.categories.dii}% (down from ~15%); mutual funds held 6.1% at Mar-2026. With a 25% free float and ~90,000 shareholders, the stock is less liquid than its market value suggests.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: 'AR FY26 distribution of shareholding (31-Mar-2026); Jun-2026 category totals from Screener.in. Named institutional holders above 1% for Jun-2026 were not available to us.' } },
  { callout: '**Our read:** a promoter-run company with a professional European management (CEO Massimo Venuti) and a strong board. Minority shareholders get steady growth and a ~17% payout; control is not contestable, and the 75% cap means the promoters cannot buy more.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a clean, conservative company with a strong board',
  blocks: [
    { p: `Board: ${D.governance.board}. Management: ${C.management.map(m => `${m[0]} (${m[1]})`).join('; ')}. Auditor: ${D.governance.auditor}.` },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor, 'No accounting red flags; see earnings quality for the judgement calls.'],
      ['Board', 'Strong', 'Non-executive chairman (Soumendra Basu); independent directors with industry and audit backgrounds (incl. a former Deloitte India chairman).', 'Better than most promoter-run mid-caps.'],
      ['Promoter pay', 'Moderate', D.governance.pay, 'Reasonable for the size of the company.'],
      ['Related-party flows', 'Strong', D.governance.relatedParty, 'Nothing material.'],
      ['Capital allocation', 'Moderate', 'Net cash throughout; capex ~9% of revenue; Stöferle at ~3.5x its FY26 EBITDA (EUR37.7 mn for 60%); Maxwell bought out; payout 16-21%.', 'Disciplined; ROE has drifted down to ~15% as cash builds and Europe absorbs capital.'],
      ['Promoter and pledges', 'Strong', `75% held; ${D.governance.pledge.toLowerCase()}.`, 'Aligned, long-term owners.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, Rule 5(1) annexure, auditor\'s report)' },
  ],
};

const gap = (g, s) => (g / s - 1) * 100;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, below the street',
  blocks: [
    { p: 'Revenue and EBITDA come from the entity build (India, Maxwell, Europe, adjustments, less other income; chapters above): revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}}, EBITDA margin (excl. other income) {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}. Capex ₹1,200 / 1,250 / 1,300 cr; depreciation 8.2% of gross block (FY27E ₹{{F.dep.0|num}} cr, incl. Europe\'s accelerated write-offs); finance cost ₹60-70 cr; tax 25.5%; payout 17%. Other income is built from treasury income (~₹40 cr) and recurring items (₹75-85 cr). Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM', ...withEps.map(s => s.broker)], rows: [
      ['Revenue FY27E (₹ cr)', '{{F.sales.0|num}}', ...withEps.map(s => n0(s.revenue.FY27E))],
      ['Revenue FY28E (₹ cr)', '{{F.sales.1|num}}', ...withEps.map(s => n0(s.revenue.FY28E))],
      ['EBITDA margin FY28E', '{{F.ebitdaMargin.1|pct}}', ...withEps.map(s => s.ebitdaMarginPct.FY28E + '%')],
      ['EPS FY27E (₹)', '{{F.eps.0|n1}}', ...withEps.map(s => n1(s.eps.FY27E))],
      ['EPS FY28E (₹)', '{{F.eps.1|n1}}', ...withEps.map(s => n1(s.eps.FY28E))],
      ['EPS FY29E (₹)', '{{F.eps.2|n1}}', ...withEps.map(s => (s.eps.FY29E ? n1(s.eps.FY29E) : '–'))],
      { hl: true, cells: ['**GAM vs street median, FY28E EPS**', `**${pc(gap(F.eps[1], medEps('FY28E')))}**`, ...withEps.map(() => '')] },
    ], source: 'MOSL and Choice result updates (14-Aug-2026). Geojit (Jun-2026) and Axis (May-2026) estimates were not visible to us.' } },
    { callout: `Our FY28E EPS is ${pc(gap(F.eps[1], medEps('FY28E')))} vs the street median (₹${n1(medEps('FY28E'))}); revenue is close, so the gap is margin (we assume {{F.ebitdaMargin.1|pct}} in FY28E vs 13.7-13.9%) and depreciation (MOSL has FY28E EPS +35%, which needs Europe's accelerated write-offs to stop and margins to jump). EPS compounds ~${Math.round(epsCagrFwd)}% a year over FY26-29E (FY21-26: ~${Math.round(epsCagrHist)}%).` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
