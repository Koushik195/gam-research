// Gland report, part 4: moat scorecard, margins, earnings quality, capital allocation and returns, ownership,
// management and governance.
const X = require('./GLAND.ctx');
const { C, D, A, F, V, AS, BL, n0, n1, pc, Q1, FY26, b, ai, price, divYield, OIN, cashPctNw, LEB, LINES } = X;
const MG = C.management, PAY = MG.pay, RP = MG.relatedParty, OW = D.ownership;
const VMAP = { Strong: 'Strong', 'Moderate-strong': 'Strong', Moderate: 'Moderate', Unproven: 'Moderate', Weak: 'Weak' };

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real cost-and-compliance moat in sterile manufacturing; no pricing power, and partners own the customer',
  blocks: [
    { p: "A moat is a lasting advantage that lets a company earn more than its cost of capital for longer than rivals. Gland's is the hardest kind to build in generics: low-cost, high-quality sterile manufacturing at scale, across almost every injectable format, with a clean regulatory record. It shows in 35-40% base-business margins against ~20% for most generic peers and in big pharma choosing Gland for transfers. It does not show in pricing, which keeps falling, or in control of the end customer, which sits with partners." },
    { verdicts: D.moat.map(m => [m.factor, VMAP[m.score] || 'Moderate', m.evidence, m.score]), head: ['Factor', 'Score', 'Evidence', 'Detail'], title: 'Moat scorecard: two strong, four moderate or unproven, pricing weak', source: 'Company calls and filings; AR FY26; GAM Research' },
    { callout: "**Verdict:** a genuine but narrow moat. Sterile capacity, compliance and cost are hard to copy and are why Gland wins share; but Aurobindo's Eugia, Caplin Steriles and many US and Chinese makers compete in the same molecules, and partners can re-source a product after a re-filing. Cenexi adds European access but no cost advantage. The group returns (ROE ~10%) are below its cost of equity today, so the moat has yet to show up for shareholders." },
  ],
};

const gmY = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: base business at 36-40%, Cenexi near zero; we model 27.3% for FY27E rising to 30% by FY29E, management\'s near-term target',
  blocks: [
    { p: `Before Cenexi, Gland's EBITDA margin ran at 34-42% (FY17-22) and fell to 28% in FY23 with the customer losses. Cenexi changed the shape of the P&L: it has a ~76-80% gross margin (contract manufacturing uses customers' materials) but very high European labour costs, so group employee costs jumped from 11% of sales (FY23) to 22-25% (FY24-26) and the EBITDA margin fell to 23-24%. FY26 recovered to 25.3% (base 36.5%, Cenexi −1.8%) and Q1FY27 to 27.2% (base ~36.6%, Cenexi 4%). Gross margin (revenue less materials) has risen from 53.5% (FY23) to 65.1% (FY26) on Cenexi, mix, yields and procurement.` },
    { pair: [
      { type: 'line', title: 'Gross margin up, EBITDA margin only now recovering', unit: '% of revenue', x: [...gmY, 'Q1FY27'], series: [{ name: 'Gross margin', values: [...gmY.map(y => Math.round(A.grossMargin[ai(y)] * 10) / 10), Q1.grossMarginPct], fmt: 'pct' }, { name: 'EBITDA margin', values: [...gmY.map(y => Math.round(A.ebitdaMargin[ai(y)] * 10) / 10), Q1.ebitdaMarginPct], fmt: 'pct' }], labels: 'all', min: 0, max: 75, source: 'Screener.in (gross margin = 100 − material cost %)' },
      { type: 'column', title: 'Cost lines: Cenexi swapped materials for people', unit: '% of revenue', x: ['FY22', 'FY23', 'FY24', 'FY26', 'Q1FY27'], series: [{ name: 'Materials', values: [47.9, 46.5, 38.4, 34.9, 34.7], fmt: 'pct' }, { name: 'Employees', values: [7.7, 11.1, 22.2, 25.3, 24.7], fmt: 'pct' }, { name: 'Other costs', values: [10.1, 14.1, 15.9, 14.5, 13.5], fmt: 'pct' }], labels: 'all', source: 'Screener.in expense schedules' },
    ] },
    { exhibit: { type: 'table', title: 'From FY26 to our FY27-29E margin', head: ['Step', 'EBITDA margin', 'Why'], wide: [2], rows: [
      ['FY26 reported', `${n1(A.ebitdaMargin[b])}%`, 'Base 36.5%, Cenexi −1.8%; ESOP and one-off GST costs ₹53 cr'],
      ['Q1FY27 reported', `${Q1.ebitdaMarginPct}%`, 'Base ~36.6% on three launches and the rupee; Cenexi 4% despite the heat wave'],
      [`Base business FY27E / FY28E / FY29E`, `${BL.ebitdaMargin.base.join('% / ')}%`, 'Management guides 33-35%; utilisation and CDMO mix up, price erosion and higher ESOP cost down'],
      [`Cenexi FY27E / FY28E / FY29E`, `${BL.ebitdaMargin.cenexi.join('% / ')}%`, 'Summer-shutdown Q2 drags FY27; guidance high single digit, mid-teens in the medium term'],
      { hl: true, cells: ['**Our consolidated FY27E**', '**{{F.ebitdaMargin.0|pct}}**', 'Weighted; street 26.3-26.6% (Elara pre-Q1, ICICI Direct)'] },
      ['Our FY28E / FY29E', '{{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}', 'Near management\'s 30% (adjusted, before ESOP) near-term target; no move to its 35% goal'],
    ], source: 'Investor presentations; Q4FY26 and Q1FY27 calls; GAM estimates' } },
    { callout: `**Every point of consolidated margin** is ~₹${n0(F.sales[1] / 100)} cr of FY28E EBITDA, ~₹${n1(F.sales[1] / 100 * (1 - AS.taxRate[1] / 100) / X.sh)} of EPS and ~₹${n0(F.sales[1] / 100 * (1 - AS.taxRate[1] / 100) / X.sh * X.peMult)} a share at our multiple. Cenexi alone moves the group margin by ~0.3 points for each point of its own margin.` },
  ],
};

const cfoY = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audits and real cash, but forex gains, inventory write-downs, "adjusted" EBITDA and untested Cenexi goodwill need watching',
  blocks: [
    { p: `Gland reports conservatively in most respects: no debt beyond Cenexi's, no capitalised R&D of note, and cash conversion that has improved (operating cash flow ₹${n0(A.cfo[b])} cr in FY26, ${Math.round(A.cfo[b] / A.ebitda[b] * 100)}% of EBITDA after tax). But FY26 profit carried items that will not repeat in the same way, and the company leans on "adjusted" measures. It also stopped splitting the P&L between the base business and Cenexi from Q1FY27, just as Cenexi turned profitable, which makes the turnaround harder to track.` },
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'What it is', 'Why it matters'], wide: [1, 2], rows: [
      ['Forex gains in other income', C.accounting[1].item, `₹${n1(OIN.FY26.forex)} cr was ~6% of FY26 PBT; we forecast none`],
      ['Inventory write-downs', C.accounting[0].item, 'Rising write-downs (short-dated or slow-moving stock) are a cost of a broad portfolio; they hit gross margin'],
      ['Adjusted EBITDA and exceptionals', C.accounting[2].item, 'Management\'s 30%/35% targets are on adjusted EBITDA (before ESOP); our model and Screener include ESOP cost'],
      ['Revenue over time', C.accounting[3].item, 'Service revenue (tech transfer/CDMO) is booked as work progresses; lumpy if programmes slip'],
      ['Cenexi goodwill', C.accounting[4].item, 'An impairment would not hit cash but would show the acquisition\'s economics'],
    ], source: 'AR FY26 notes 11, 24, 25, 49; Q4FY26 and Q1FY27 presentations' } },
    { pair: [
      { type: 'column', title: 'Operating cash flow ÷ EBITDA: recovered since FY24', unit: '%', x: cfoY, series: [{ name: 'CFO / EBITDA', values: cfoY.map(y => Math.round(A.cfo[ai(y)] / A.ebitda[ai(y)] * 100)), fmt: 'pct0' }], labels: 'all', source: 'Screener.in (after tax)' },
      { type: 'column', title: 'Forex gains: from almost nil to ₹92 cr', unit: 'Net forex gain in other income (₹ crore)', x: ['FY25', 'Q1FY26', 'Q2-Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Forex gain', values: [OIN.FY25.forex, OIN.quarterlyForex.Q1FY26, OIN.quarterlyForex.Q2Q3FY26, OIN.quarterlyForex.Q4FY26, OIN.quarterlyForex.Q1FY27], fmt: 'n1' }], labels: 'all', source: 'AR FY26 note 25; Q1FY27 call (Q1FY27 loss booked in other expenses)' },
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing suggests aggressive accounting, and cash backs the profits. The flags are presentation (adjusted EBITDA, the end of the Cenexi split), one-offs (forex) and the untested goodwill. We forecast no forex gains and use reported EBITDA after ESOP cost.' },
  ],
};

const cfo3 = A.cfo[ai('FY24')] + A.cfo[ai('FY25')] + A.cfo[b], cx3 = A.capex[ai('FY24')] + A.capex[ai('FY25')] + A.capex[b], acq = A.acquisitions[ai('FY24')], dv3 = (A.dividendsPaid[ai('FY25')] || 0) + (A.dividendsPaid[b] || 0);
const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital allocation: one large, slow-paying acquisition, a cash pile worth a third of equity, and returns still below the cost of equity',
  blocks: [
    { p: `Gland has made one acquisition (Cenexi: ₹${n0(acq)} cr paid in FY24, plus ₹777 cr of Cenexi debt repaid and a ~€60 mn Cenexi capex plan for 2025-27) and started paying dividends in FY25 (₹18 and ₹20 a share; ~₹300-330 cr a year; yield ~${n1(divYield)}% at ₹${n0(price)}). It has not bought back shares. Net cash is ~${Math.round(cashPctNw)}% of shareholders' equity and earns ~6.5% before tax. The result: ROE fell from ~21-24% (FY20-21) to 7.8% (FY25) and 10.5% (FY26), below our ${n1(V.ke)}% cost of equity; return on operating capital (excluding cash) recovered to ~17%. We forecast ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}}: only in FY29E does Gland clear its cost of equity.` },
    { pair: [
      { type: 'line', title: 'Returns: above the cost of capital before Cenexi, below it since', unit: '%', x: 'fin.labels', from: 'FY18', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'Return on operating capital (ex cash)', ref: 'fin.coreRoce', fmt: 'pct' }], labels: 'last', min: 0, max: 45, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Where the cash went in FY24-26', unit: '₹ crore (three years)', x: ['Operating cash flow', 'Capex', 'Cenexi purchase', 'Dividends'], series: [{ name: '₹ cr', values: [cfo3, -cx3, -acq, -dv3], fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow' },
    ] },
    { callout: "**Our view:** organic capital allocation is disciplined (capex ~7-8% of sales, no leverage) but the one big decision, Cenexi, has so far destroyed value, and the cash pile dilutes returns. The new ₹2,000 cr capex programme is better targeted (contracted CDMO demand). A clearer payout policy or buyback would help minorities; Fosun's own capital needs (it sold stakes to fund a buyback at home) make that less likely." },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `Fosun Pharma Industrial Pte (Singapore), a subsidiary of Shanghai Fosun Pharmaceutical, owned 51.83% at March 2026 (${OW.categories.Promoters}% of the larger June-2026 share count). On 4-Sep-2026 it sold 9.897 mn shares (6.0%) at an average ₹2,828.78 (~₹2,800 cr) through block and open-market trades, taking it to ~45.8%; the proceeds fund an HK$1 bn H-share buyback in Hong Kong, R&D and debt repayment. Fosun says it remains the controlling shareholder. It had sold 6% in June 2024 too. Domestic institutions owned ${OW.categories.DIIs}% at June 2026 (Mirae, HDFC, Nippon, SBI and ICICI Prudential funds above 3% each at March 2026), foreign funds ${OW.categories.FIIs}%. Kotak, Axis and ICICI Prudential funds were the largest buyers of the September block. Shareholders numbered ${n0(OW.shareholders)}. Nothing is pledged.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', '% of shares', 'As of'], rows: OW.named.map(h => [h.holder, `${h.pct}%`, h.asOf]), source: 'AR FY26 (shareholders above 1%, Mar-2026); Fosun filing (Sep-2026) via Yicai' } },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: strong compliance, but a selling parent, CEO churn and a sharp rise in executive pay',
  blocks: [
    { p: `Srinivas Sadu, who joined from Natco and ran Gland as MD & CEO, became Executive Chairman in January 2025 and chairs the board. Shyamakant Giri served as CEO from January 2025 until he resigned with effect from 30-Apr-2026; Deepak Sapra, formerly CEO of Dr. Reddy's API and services business, was appointed in August 2026 and joins on 16-Nov-2026. Ravi Mitra is CFO and Alain Kirchmeyer runs Cenexi. The board has eight members: Sadu, three Fosun nominees and four independents (Naina Lal Kidwai chairs the nomination and risk committees); there is no independent chair.` },
    { exhibit: { type: 'table', title: 'Executive pay, FY26', head: ['Item', 'Detail'], wide: [1], rows: [
      ['Srinivas Sadu, Executive Chairman', `₹${PAY.sadu} cr, incl. ESOP perquisite ₹${PAY.saduEsop} cr, variable pay ₹${PAY.saduVariable} cr and ₹${PAY.saduSingapore} cr from the Singapore subsidiary; ${PAY.saduRatioMedian}x the median employee; +${PAY.saduIncreasePct}%`],
      ['Key managerial personnel (Executive Chairman, CEO, CFO, CS)', `₹${PAY.kmpTotalFY26} cr vs ₹${PAY.kmpTotalFY25} cr in FY25`],
      ['Pay growth', `Managerial pay +${PAY.managerialIncreasePct}% (ex ESOP perquisites) vs ${PAY.employeeIncreasePct}% for other employees; median employee +26%`],
      ['ESOP Scheme 2025', PAY.esop2025],
    ], source: 'AR FY26 corporate governance report, board report annexure I.1, note 36' } },
    { verdicts: [
      ['Parent and control', 'Weak', 'Fosun sold 6% in Jun-2024 and 6% in Sep-2026 for its own needs; no disclosed lock-up; now below 50% but in control', 'Supply overhang; strategy shaped by a parent with its own balance-sheet priorities'],
      ['Leadership continuity', 'Weak', 'Three people in the CEO role in two years (Sadu, Giri, Sapra from Nov-2026)', 'Execution risk while the new CEO settles in'],
      ['Executive pay and ESOPs', 'Weak', `Chairman's pay +${PAY.saduIncreasePct}% to ₹${PAY.sadu} cr; options granted at ₹773 and ₹1 against a ~₹1,600-1,900 market price`, 'Large transfer to management in a year when employee pay was flat'],
      ['Related parties', 'Moderate', `Sales to Fosun Pharma USA ₹${n0(RP.salesFosunUsa)} cr; heparin-chain raw materials from Fosun Wanbang ₹${n0(RP.purchasesFosunWanbang)} cr`, 'Disclosed and modest; pricing not independently verifiable'],
      ['Board independence', 'Moderate', 'Four of eight independent; executive chairman', 'Adequate, not strong'],
      ['Quality and compliance', 'Strong', 'No warning letters or import alerts; zero-observation USFDA inspection at Visakhapatnam (Sep-2026)', 'The core of the franchise'],
      ['Disclosure', 'Moderate', 'Detailed segment and market data, but the base/Cenexi split ended in Q1FY27; GLP-1 volumes undisclosed', 'A step back just as Cenexi turns'],
      ['Capital allocation', 'Moderate', 'Disciplined organically; Cenexi value-destructive so far; idle cash', 'See the capital chapter'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; company filings; Yicai; GAM Research' },
    { callout: "**Our view:** operations and compliance are well run, and the appointment of an experienced CEO from Dr. Reddy's is welcome. The governance discount comes from three things: a controlling parent that sells stock to fund itself, leadership churn, and FY26's jump in executive pay and deep-discount options. None threatens the business; together they are why we apply no premium to the sector-based multiple." },
  ],
};

module.exports = { moat, margins, quality, capital, ownership, governance };
