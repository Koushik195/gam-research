// Uno Minda report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./UNOMINDA.ctx');
const { C, D, F, A, n0, n1, pc, pc1, b, ST, medEps, withEps, epsCagrFwd, epsCagrHist } = X;
const Q = C.q1fy27, G = C.guidance, FY = C.fy26;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +26% (normalised), margin 10.3%, owners\' profit +24%',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26 (normalised)', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '4,420', n0(Q.revenue), yoy(Q.revenue, 4420)],
      ['EBITDA', '474', n0(Q.ebitda), yoy(Q.ebitda, 474)],
      ['EBITDA margin', '10.7%', `${Q.ebitdaMargin}%`, '−44bp'],
      ['Depreciation', '159', n0(Q.dep), yoy(Q.dep, 159)],
      ['Finance cost', '44', n0(Q.interest), yoy(Q.interest, 44)],
      ['Share of JV profit', '47', n0(Q.jvShare), yoy(Q.jvShare, 47)],
      ['Minority interests', '18', n0(Q.minorities), yoy(Q.minorities, 18)],
      { hl: true, cells: ['**Net profit to owners**', '**239**', `**${n0(Q.patOwners)}**`, `**${yoy(Q.patOwners, 239)}**`] },
      ['Memo: reported Q1FY26 (incl. ₹69 cr prior-period income)', 'Revenue 4,489; PAT 291', '', 'Revenue +24%; PAT +2%'],
    ], source: 'Q1FY27 presentation p18 and call (4-Aug-2026); Screener.in' } },
    { bullets: [
      `**Divisions:** switches ₹1,335 cr (+20%), lighting ₹1,153 cr (+14%), castings ₹1,090 cr (+32%), Green Mobility ₹542 cr (+78%), seating ₹408 cr (+28%), others ₹1,029 cr (+21%). ${Q.detail}`,
      `**Margin:** ${Q.marginDrivers}`,
      `**Industry:** ${Q.industry}`,
      '**New business:** entry into PV seating (₹320 cr plant, anchor customer); a new global OEM for 4W lighting in India; second 4W-lamp customer in Indonesia (SOP Q2FY28); sunroof order book >₹500 cr; Indian approval for the Inovance JV, Chinese approval pending.',
    ] },
    { exhibit: { type: 'table', title: 'What management guided (May-2026 to Aug-2026)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['EBITDA margin', G.ebitdaMargin], ['Capex', G.capexFY27], ['Growth', G.growth], ['Exports', G.exports], ['EV powertrain', G.evPowertrain], ['Orders', G.orders],
    ], source: 'Q4FY26 call (18-May-2026); Q1FY27 call and presentation (4-Aug-2026)' } },
    { callout: '**Why it matters:** Q1 margin was 70bp below the guided midpoint; holding the year at 11% needs ~11.2% for Q2-Q4, which depends on customers resetting prices for commodities and wages (some have moved to monthly price adjustments). Our FY27E margin of {{F.ebitdaMargin.0|pct}} assumes they do, in line with the guidance; the bear case assumes they do not.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit and decent cash conversion; watch incentives, one-off income and the JV line',
  blocks: [
    { bullets: [
      `**Cash conversion is adequate.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26, ${Math.round(A.cfoToPat[b])}% of owners' profit and ${Math.round(A.cfoToEbitda[b])}% of EBITDA (57-65% in FY23-25, when working capital absorbed cash). Capex took it all.`,
      `**State incentives are in revenue.** FY26 revenue includes ₹${n0(FY.governmentGrantsInRevenue)} cr of government grants (₹112 cr in FY25), of which ₹${n0(FY.stateIncentivesAccrued)} cr is industrial promotion subsidy under Maharashtra's PSI 2013 and Gujarat's 2015 policy: ~7% of EBITDA. They are earned on investment, but they are finite and accrued before cash arrives (₹175 cr receivable at Mar-26).`,
      '**One-off income in Q1FY26.** ₹69 cr of prior-period income (customer price settlements) was booked in revenue and EBITDA; the company itself reports "normalised" numbers without it. FY26 EBITDA margin: 11.5% reported, 11.1% normalised.',
      '**Exceptional items are small.** A ₹27.6 cr labour-code charge in FY26 and small remeasurement gains in FY24-25: after tax, 1-3% of profit. We forecast none.',
      `**The JV line is profit, but not all of it is cash.** The ₹249 cr share of JV profit compared with ₹137 cr of JV dividends received; it is 21% of owners' profit and growing.`,
      '**Related parties.** Services bought from promoter-linked entities (Paripal Advisory, Minda Investments, Minda Advisory: ~₹17 cr) and dealings with JVs are disclosed and small relative to revenue.',
    ] },
    { callout: '**Accounting flag: AMBER.** Unqualified audit by S.R. Batliboi & Co. (EY), modest exceptional items and positive cash conversion. The amber is for the size of state incentives inside revenue, the prior-period income that flattered FY26, and the growing share of profit that comes from JVs whose cash reaches Uno Minda only as dividends.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Minda family controls ${OH.categories.promoters}% (Jun-2026): Nirmal K Minda 20.83%, Suman Minda 13.85%, and family companies led by Minda Investments (23.77% at Mar-2026). ${OH.pledge} Indian institutions own ${OH.categories.dii}% (the NPS Trust's SBI pension fund alone 3.07%; Canara Robeco, Kotak, DSP and Axis mid-cap funds 1-2% each) and foreign portfolio investors ${OH.categories.fii}%, down from ~10% in 2025. Resident individuals hold under 6%: the free float is ~32%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: 'Shareholding pattern for the quarter ended 30-Jun-2026 (unominda.com); promoter companies at Mar-2026 (AR FY26 note 13). Foreign holders above 1% are not named in our sources.' } },
  { callout: '**Our read:** a family-controlled company with a professional management layer (Managing Director Ravi Mehra since Apr-2025, a group CFO) and long-standing Japanese partners who watch the JVs closely. Minority shareholders get steady growth and modest dividends; control is not contestable.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: competent and well audited, with a generously paid promoter chairman',
  blocks: [
    { p: `Board: ${D.governance.board}. Management: ${C.management.map(m => `${m[0]} (${m[1]})`).join('; ')}. Auditor: ${D.governance.auditor}.` },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor, 'No accounting red flags; see earnings quality for the judgement calls.'],
      ['Board', 'Moderate', '6 of 11 directors independent; promoter family holds the chair and two non-executive seats.', 'Meets the rules; the family sets strategy.'],
      ['Promoter pay', 'Watch', D.governance.pay, 'High for an Indian mid-cap: ~3% of owners\' profit to one executive, mostly as commission.'],
      ['Related-party flows', 'Moderate', D.governance.relatedParty, 'Small and disclosed; JVs are arm\'s-length with listed Japanese partners.'],
      ['Capital allocation', 'Moderate', 'ROCE 18-20% through a heavy capex cycle; buy-outs of partners at sensible prices (FRIWO stake ₹141 cr); payout 12-14%.', 'Disciplined so far; the EV powertrain bet is the big test.'],
      ['Promoter and pledges', 'Strong', `68.4% held; ${D.governance.pledge.toLowerCase()}.`, 'Aligned, long-term owners.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, Rule 5(1) annexure, related-party note); shareholding pattern Jun-2026' },
  ],
};

const gap = (g, s) => (g / s - 1) * 100;
const streetRow = (lab, f) => [lab, ...withEps.map(s => f(s))];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, a little below the street',
  blocks: [
    { p: `Revenue comes from the six-division build (chapters above), EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} (guidance 11% ±50bp), capex ₹1,750 / 1,600 / 1,500 cr, depreciation 7.8% of gross block (FY27E ₹{{F.dep.0|num}} cr), finance cost ₹200-215 cr, tax 24.5% and a 13% payout. Other income is built: recurring items ~₹30 cr, plus the share of JV profit less minorities, grossed up for tax (chapter "JVs & minorities"). Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (forecast: incl. JV share net of minorities, grossed up)', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street: EPS (₹, estimates standing on 30-Sep-2026)', head: ['', 'GAM', ...withEps.map(s => s.broker)], rows: [
      ['FY27E', '{{F.eps.0|n1}}', ...withEps.map(s => n1(s.eps.FY27E))],
      ['FY28E', '{{F.eps.1|n1}}', ...withEps.map(s => n1(s.eps.FY28E))],
      ['FY29E', '{{F.eps.2|n1}}', ...withEps.map(s => (s.eps.FY29E ? n1(s.eps.FY29E) : '–'))],
      { hl: true, cells: ['**GAM vs street median, FY28E**', `**${pc(gap(F.eps[1], medEps('FY28E')))}**`, ...withEps.map(() => '')] },
    ], source: 'Broker result updates, 4/5-Aug-2026 (MOSL, ICICI Direct, Axis Securities, Emkay, Choice). Jefferies\' estimates were not visible to us.' } },
    { callout: `Our FY28E EPS is ${pc(gap(F.eps[1], medEps('FY28E')))} vs the street median (₹${n1(medEps('FY28E'))}) and ${pc(gap(F.eps[0], medEps('FY27E')))} for FY27E: we are a touch more cautious on the margin recovery and on depreciation from the new plants. EPS compounds ~${Math.round(epsCagrFwd)}% a year over FY26-29E (FY21-26: ~${Math.round(epsCagrHist)}% off a Covid base). Like most of the street, we see strong growth; the disagreement is about how much to pay for it.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
