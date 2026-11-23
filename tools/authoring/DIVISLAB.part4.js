// Divi's report, part 4: moat scorecard, margins, earnings quality, capital allocation and returns, ownership,
// management and governance.
const X = require('./DIVISLAB.ctx');
const { C, D, A, F, AS, n0, n1, pc, rup, QH, Q1, FY26, b, ai, price, mcap, divYield, ttmOi, OIN } = X;
const MG = C.management, PAY = MG.pay, RP = MG.relatedParty, OW = D.ownership;
const VMAP = { Strong: 'Strong', 'Moderate-strong': 'Strong', Moderate: 'Moderate', Unproven: 'Moderate', 'Weak in generics': 'Weak', Unknown: 'Weak' };

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real moat in process chemistry, reliability and customer trust; no pricing power in generics',
  blocks: [
    { p: "A moat is a lasting advantage that lets a company earn more than its cost of capital for longer than rivals. Divi's has one, but of a particular kind: it is the lowest-cost, most reliable supplier for chemistry it chooses to do, and innovators trust it with their filings. That shows up in decades-long customer relationships, prepaid capacity and a 12-29% ROE through the cycle, not in the ability to raise prices." },
    { verdicts: D.moat.map(m => [m.factor, VMAP[m.score] || 'Moderate', m.evidence, m.score]), head: ['Factor', 'Score', 'Evidence', 'Detail'], title: "Moat scorecard: four strong, three moderate or unproven, pricing weak", source: 'Company calls and filings; AR FY26; GAM Research' },
    { callout: "**Verdict:** a genuine but narrow moat. Process cost and regulatory reliability are hard to copy and explain why big pharma keeps coming back; switching costs exist only for the life of each molecule; generic APIs have no pricing power; peptides are a capability, not yet an advantage. Indian rivals (Laurus, Neuland, Sai Life, Piramal Pharma, Cohance) and Chinese CDMOs compete for the same projects. We would pay a premium for the franchise, but not an unlimited one." },
  ],
};

const gmY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: Q1FY27\'s 41% came from inventory, mix and the rupee; we model 35.5% for FY27, still above management\'s "similar to last year"',
  blocks: [
    { p: `Divi's gross margin (revenue less materials) ran at 59-66% for a decade; the EBITDA margin at 28-43%. The FY23-24 fall came from lost Covid volumes, generic price erosion and expensive raw materials; FY25-26 recovered to ~32-33% as custom synthesis grew. Q1FY27 jumped to a 68% gross and 40.7% EBITDA margin. Three things drove it: (1) a ~₹500 cr rise in inventory booked through the P&L, from a rolling three-month raw-material stockpile bought at war-inflated solvent prices and validation-batch work in progress (an analyst estimated the gross margin at 55-58% without it; management says no inventory gain was booked); (2) mix, with custom synthesis at 60%; and (3) the rupee.` },
    { pair: [
      { type: 'line', title: 'Annual margins: Q1FY27 is far above the recent band', unit: '% of revenue', x: [...gmY, 'Q1FY27'], series: [{ name: 'Gross margin', values: [...gmY.map(y => Math.round(A.grossMargin[ai(y)] * 10) / 10), Q1.grossMarginPct], fmt: 'pct' }, { name: 'EBITDA margin', values: [...gmY.map(y => Math.round(A.ebitdaMargin[ai(y)] * 10) / 10), Q1.ebitdaMarginPct], fmt: 'pct' }], labels: 'all', min: 0, max: 75, source: 'Screener.in (gross margin = 100 − material cost %)' },
      { type: 'column', title: 'Cost lines, % of revenue: materials fell, people and overheads did not', unit: '% of revenue', x: ['FY22', 'FY24', 'FY26', 'Q1FY27'], series: [{ name: 'Materials', values: [33.8, 40.7, 39.5, 32.0], fmt: 'pct' }, { name: 'Employees', values: [10.6, 14.0, 13.7, 13.2], fmt: 'pct' }, { name: 'Other costs', values: [12.3, 17.2, 14.2, 14.0], fmt: 'pct' }], labels: 'all', source: 'Screener.in expense schedules; PL Q1FY27 note' },
    ] },
    { h: 'How much does the rupee add?' },
    { p: "Exports are ~89% of revenue, while imports are ~40% of a ₹4,000-5,000 cr raw-material bill (CFO, 23-May-2026). On FY26's cost structure, a 10% weaker rupee would lift rupee revenue by ~9% and costs by only ~1.6% of sales, adding roughly 4 points to the EBITDA margin before hedges and price pass-through (GAM illustration). That is why FY26's margin edged up with a ~6% currency tailwind (12.8% reported growth vs 6.8% constant currency) and why Q1FY27 looked so strong. It works in reverse if the rupee recovers." },
    { exhibit: { type: 'table', title: 'From FY26 to our FY27E margin', head: ['Step', 'EBITDA margin', 'Why'], wide: [2], rows: [
      ['FY26 reported', `${n1(A.ebitdaMargin[b])}%`, 'Gross margin 60.5%; custom synthesis 55%'],
      ['Q1FY27 reported', `${Q1.ebitdaMarginPct}%`, 'Inventory build, 60% custom synthesis, weak rupee'],
      ['Q1FY27 at a normal ~61% gross margin', '~34%', 'Employee and other costs unchanged (GAM)'],
      ['Our Q2-Q4 FY27E', '~34%', 'FY26 Q2-Q4 averaged 33.3%; currency help offsets solvent costs and the stockpile unwinding'],
      { hl: true, cells: ['**Our FY27E**', `**{{F.ebitdaMargin.0|pct}}**`, 'Q1 actual + ~34% for nine months; management: "similar as last year"; street 35.5-38.3%'] },
      ['Our FY28E / FY29E', '{{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}', 'Custom synthesis to ~62-64% of sales; no return to the 37-38% pre-Covid level'],
    ], source: 'Screener.in; Q1FY27 call; GAM estimates' } },
    { callout: '**Every point of margin** is ~₹146 cr of FY28E EBITDA, or ~₹4.1 of EPS and ~₹240 a share at our multiple. Margin is the biggest swing factor after the timing of the dedicated projects.' },
  ],
};

const cfoY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audits and no debt, but three things to watch: over-time revenue, customer advances and the inventory build',
  blocks: [
    { p: `Price Waterhouse audits Divi's; there are no qualifications, no debt and small related-party dealings. Cash conversion is decent over time (operating cash flow ₹${n0(A.cfo[b])} cr in FY26, ${Math.round(A.cfo[b] / A.ebitda[b] * 100)}% of EBITDA) but swings with inventory. FY26 brought new accounting that investors should understand, because it moves revenue between years.` },
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'What it is', 'Why it matters'], wide: [1, 2], rows: [
      ['Revenue recognised over time', C.accounting[0].item, 'Revenue booked before shipment (₹236 cr, ~2% of FY26 revenue); the auditor made it a key audit matter. Lumpy if contracts change'],
      ['Customer advances', C.accounting[1].item, 'Customers fund capacity; part of revenue is the release of deferred reservation fees. Cash is flattered by advances that may be repayable'],
      ['Inventory build', C.accounting[4].item, 'Absorbs fixed costs into inventory and lifts the reported gross margin until the stock is sold'],
      ['Forex in other income', C.accounting[3].item, `FY26 profit included ₹${OIN.FY26.forex} cr of forex gains (~6% of PBT); we forecast none`],
      ['Exceptional item', C.accounting[2].item, 'Small and one-off; EPS before it ₹98.8 in FY26 vs ₹96.7 reported'],
    ], source: 'AR FY26 notes 10, 14-17, 31 and auditor\'s report; Q1FY27 call' } },
    { pair: [
      { type: 'column', title: 'Operating cash flow ÷ EBITDA: swings with inventory', unit: '%', x: cfoY, series: [{ name: 'CFO / EBITDA', values: cfoY.map(y => Math.round(A.cfo[ai(y)] / A.ebitda[ai(y)] * 100)), fmt: 'pct0' }], labels: 'all', source: 'Screener.in' },
      { type: 'column', title: 'Forex gains: from ₹48 cr to ₹211 cr of profit', unit: 'Net forex gain in other income (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Forex gain', values: [130, 30, 48, 211, -7], fmt: 'num' }], labels: 'all', source: 'Q4 calls FY23-FY26; Q1FY27 call' },
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing suggests aggressive accounting, but FY26-27 earnings carry items that will not repeat in the same way (forex gains, the Q1 inventory effect) and a new layer of contract accounting. We forecast no forex gains and fade the Q1 margin.' },
  ],
};

const cfo3 = A.cfo[ai('FY24')] + A.cfo[ai('FY25')] + A.cfo[b], cx3 = A.capex[ai('FY24')] + A.capex[ai('FY25')] + A.capex[b], dv3 = 796 + 796 + 797, dc3 = Math.round(A.cash[b] - A.cash[ai('FY23')]);
const CF3 = [cfo3, -cx3, -dv3, dc3 - (cfo3 - cx3 - dv3), dc3];
const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital allocation: no debt, no acquisitions, no dilution, a flat ₹30 dividend, and returns that have halved from the peak while the plants are built',
  blocks: [
    { p: `Divi's has never bought a company and has not issued shares since the FY16 bonus. It reinvests most of its cash in plants and pays a fixed ₹30 a share (~₹797 cr, ${Math.round(797 / A.pat[b] * 100)}% of FY26 profit; yield ~${n1(divYield)}% at ₹${n0(price)}). ROE fell from 28% (FY22) to 12% (FY24) and recovered to 16% (FY26); return on operating capital (excluding cash) from 40% to 22%. Cash of ~₹3,400 cr earns ~7-8% and dilutes ROE by ~2 points. We forecast ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}}: comfortably above the ${n1(X.V.ke)}% cost of equity, far below the 28% of FY22.` },
    { pair: [
      { type: 'line', title: 'Returns: below the peak, above the cost of capital', unit: '%', x: 'fin.labels', from: 'FY17', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'Return on operating capital (ex cash)', ref: 'fin.coreRoce', fmt: 'pct' }], labels: 'last', min: 0, max: 45, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Where the cash went in FY24-26', unit: '₹ crore (three years)', x: ['Operating cash flow', 'Capex', 'Dividends', 'Interest received & other', 'Change in cash'], series: [{ name: '₹ cr', values: CF3, fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow; AR FY26 (dividends)' },
    ] },
    { callout: "**Our view:** disciplined and conservative: organic growth, no leverage, no empire-building. The cost is a lazy balance sheet and a dividend that has not grown in five years. With capex running at 15-24% of sales, cash will not build much until the projects pay back; we do not expect a buyback or special dividend." },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The Divi family owns ${OW.categories.Promoters}% (Jun-2026). Dr. Kiran S. Divi (CEO) and Ms. Nilima Prasad Divi (commercial head), the founder's children, hold 20.34% each; Mrs. Swarnalatha Divi 5.27%, Divi's Biotech 3.01% and Dr. Murali K. Divi 2.85% (Mar-2026). Nothing is pledged. Foreign funds own ${OW.categories.FIIs}% (up from ~15% in early 2024) and domestic institutions ${OW.categories.DIIs}%, of which mutual funds ${OW.categories['of which mutual funds']}%; LIC cut its stake from 5.63% to 2.79% in FY26. The number of shareholders fell from 3.5 lakh (Dec-2023) to ${n0(OW.shareholders)}.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', '% of shares', 'As of'], rows: OW.named.map(h => [h.holder, `${h.pct}%`, h.asOf]), source: 'AR FY26 note 11 (Mar-2026); BSE shareholding pattern (Jun-2026)' } },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a founder-led family firm with a clear succession and a clean record, but promoter pay of ₹224 cr is excessive',
  blocks: [
    { p: "Dr. Murali K. Divi founded the company in 1990 and is still Managing Director (re-appointed from Oct-2024 for five years). The next generation is already running it: Dr. Kiran S. Divi is CEO (re-appointed from April 2025) and leads customers, technology and peptides on calls; Ms. Nilima Prasad Divi heads commercial and presents the financials. Long-serving N. V. Ramana (Executive Director since 1994) and Dr. S. Devendra Rao (manufacturing, since 2024) complete the executive side. Five of ten directors are independent and the chairman, Dr. Ramesh B. V. Nimmagadda, is independent. The CFO changed in August 2025 for the first time in decades, when L. Kishore Babu retired and V. P. Pasumarthy took over." },
    { exhibit: { type: 'table', title: 'Executive pay, FY26', head: ['Director', 'Role', 'Pay (₹ cr)', 'of which profit commission', 'Times median employee'], rows: [
      ['Dr. Murali K. Divi', 'Managing Director', '100.26', '99.90', '1,692x'],
      ['Mr. N. V. Ramana', 'Executive Director', '51.20', '49.95', '864x'],
      ['Dr. Kiran S. Divi', 'WTD & CEO', '34.84', '33.30', '588x'],
      ['Ms. Nilima Prasad Divi', 'WTD (Commercial)', '34.78', '33.30', '587x'],
      ['Dr. S. Devendra Rao', 'WTD (Manufacturing)', '3.26', '–', '55x'],
      { hl: true, cells: ['**Total**', '', `**${PAY.FY26}**`, `**${PAY.commissionFY26}**`, `~${PAY.pctOfStandalonePbt}% of standalone PBT`] },
    ], source: 'AR FY26 corporate governance report and Annexure II' } },
    { verdicts: [
      ['Succession', 'Strong', 'CEO and commercial head are the founder\'s children, in role for years; the founder remains MD', 'Continuity is high; key-person risk sits with the family, not one individual'],
      ['Board independence', 'Moderate', '5 of 10 independent; independent chairman; executives dominate the board', 'Adequate, not strong'],
      ['Promoter pay', 'Weak', `₹${PAY.FY26} cr in FY26 (+13% vs ₹${PAY.FY25} cr), ~96% of it profit commission; managerial pay +12.9% vs +6.8% for the median employee`, 'A large, profit-linked transfer to the family: ~6% of what shareholders would otherwise earn after tax'],
      ['Related parties', 'Strong', `Small: ₹${RP.leaseRentDiviProperties} cr lease rent to a family company, ₹${RP.csrToDiviFoundation} cr CSR via a family foundation`, 'No sign of tunnelling'],
      ['Quality and compliance', 'Strong', 'Clean USFDA outcomes since 2017; EHS and safety awards; PwC as auditor', 'The core of the franchise'],
      ['Disclosure', 'Weak', 'No product, customer, capacity or order-book data; few numbers beyond the two-way split', 'Investors must trust management on the pipeline'],
      ['Capital allocation', 'Strong', 'No debt, no M&A, no dilution, steady dividend', 'Conservative, sometimes to a fault'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; earnings calls; GAM Research' },
    { callout: "**Our view:** Divi's is well run operationally and the succession is settled, which matters for a family company. The flaw is pay: the founder alone took ~₹100 cr in FY26, and executive commission rises automatically with profit. It does not threaten the business, but it is a real cost to minority shareholders and one reason we would not pay any premium for governance." },
  ],
};

module.exports = { moat, margins, quality, capital, ownership, governance };
