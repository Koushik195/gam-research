// Glenmark report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance.
const X = require('./GLENMARK.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, ACC, CM, b, shortDate, litig, leases } = X;
const ch = (a, b2) => pc((a / b2 - 1) * 100);
const coreQ1 = Q1.ebitda - Q1.naDeferredCr, coreRevQ1 = Q1.revenue - Q1.naDeferredCr;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: sales +23% across every region, but core margin slipped to 16.6% and profit missed estimates',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore unless stated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q1.revenuePrior), n0(Q1.revenue), ch(Q1.revenue, Q1.revenuePrior)],
      ['  India', n0(Q1.indiaPrior), n0(Q1.india), ch(Q1.india, Q1.indiaPrior)],
      ['  North America (reported / core)', n0(Q1.naPrior), `${n0(Q1.na)} / ${n0(Q1.na - Q1.naDeferredCr)}`, `${ch(Q1.na, Q1.naPrior)} / +${Q1.naCoreGrowthPct}%`],
      ['  Europe / emerging markets', `${n0(Q1.europePrior)} / ${n0(Q1.emPrior)}`, `${n0(Q1.europe)} / ${n0(Q1.em)}`, `${ch(Q1.europe, Q1.europePrior)} / ${ch(Q1.em, Q1.emPrior)}`],
      ['R&D (% of revenue)', `${n0(Q1.rdPriorCr)} (7.1%)`, `${n0(Q1.rdCr)} (${Q1.rdPct}%)`, ch(Q1.rdCr, Q1.rdPriorCr)],
      ['EBITDA (company)', n0(Q1.ebitdaPrior), n0(Q1.ebitda), ch(Q1.ebitda, Q1.ebitdaPrior)],
      ['  margin', `${Q1.ebitdaMarginPriorPct}%`, `${Q1.ebitdaMarginPct}%`, '+220bp'],
      ['EBITDA excl. ISB 2001 deferred income (core)', n0(Q1.ebitdaPrior), n0(coreQ1), ch(coreQ1, Q1.ebitdaPrior)],
      ['  core margin', `${Q1.ebitdaMarginPriorPct}%`, `${n1(coreQ1 / coreRevQ1 * 100)}%`, `${Math.round((coreQ1 / coreRevQ1 * 100 - Q1.ebitdaMarginPriorPct) * 100)}bp`],
      ['Exceptional items (charge)', n0(Q1.exceptionalPrior), '0', ''],
      ['Profit before exceptional items (owners, Screener)', n0(Q1.patPriorExExc), n0(Q1.pat), ch(Q1.pat, Q1.patPriorExExc)],
      { hl: true, cells: ['**Reported profit (owners)**', `**${n0(Q1.patPrior)}**`, `**${n0(Q1.pat)}**`, '**10x**'] },
    ], source: 'Q1FY27 presentation (31-Jul-2026) and call (3-Aug-2026); Screener; GAM (core = excl. ₹165.5 cr of deferred ISB 2001 income)' } },
    { bullets: [
      `**Growth was real and broad:** every region grew double digits; North America core +${Q1.naCoreGrowthPct}% on gFlovent 44 (half a quarter) and nine launches; India +15.5% with secondary sales +${Q1.indiaSecondaryPct}%.`,
      `**Profit missed:** EBITDA was 7% and PAT 10% below MOSL's estimates; Choice was 5% and 11% above actuals. The CFO blamed freight and API costs from the West Asia conflict and reinvestment in launches, and expects pressure "at least 2 quarters".`,
      `**The headline flatters:** ₹${n0(Q1.naDeferredCr)} cr of the ₹${n0(Q1.ebitda)} cr EBITDA was AbbVie upfront being recognised; the core margin fell from ${Q1.ebitdaMarginPriorPct}% to ${n1(coreQ1 / coreRevQ1 * 100)}%.`,
      '**After the call (to 30-Sep-2026):** the Goa plant received an EIR with VAI after its June inspection (reported 23-Sep); MOSL (₹2,570), Choice (₹2,590) and Deven Choksey (₹2,563) stayed positive, ICICI Securities at Hold (₹2,100). The stock rose from ~₹2,230 to ₹2,515 (28-Aug) and closed at ₹2,334.7 on 30-Sep.',
    ] },
    { exhibit: { type: 'table', title: 'What management said, and what happened (2022-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome || '–')]), source: 'Investor Days 2022 and 2026; Q2FY26, Q4FY26 and Q1FY27 calls; AR FY26' } },
    { callout: '**Credibility check:** management delivered on the balance sheet (zero gross debt) and on India\'s recovery, but has repeatedly over-promised on margins: 23% by FY27 (2022), ~23% from H2FY26 (Nov-2025); the actual was 21.3% in H2FY26 and 20.0% in Q1FY27, both including deferred licensing income. We therefore sit at the bottom of the 21-22% FY27 guide.' },
  ],
};

const EX = C.exceptionals;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: "one-off" charges in five straight years, licensing income inside revenue, and provisions that can flow back',
  blocks: [
    { bullets: [
      `**Exceptional items every year.** FY22 ₹${n0(EX.FY22total)} cr, FY23 ₹${n0(EX.FY23total)} cr (Zetia settlement), FY24 ₹${n0(EX.FY24total)} cr, FY25 ₹${n0(EX.FY25total)} cr, FY26 ₹${n0(EX.FY26total)} cr: ${EX.FY26.map(e => `${e.item.toLowerCase()} ₹${n0(e.cr)} cr`).join('; ')}. More antitrust groups (end-payors and one other) are still open. We value on EPS before exceptional items, as the batch rule says, but treat litigation as a recurring cost of being in US generics.`,
      `**Licensing income inside revenue.** FY26 revenue includes ₹${n0(FY26.isbIncomeCr)} cr of ISB 2001 income, booked net of ₹${EX.oneTimeInRevenueQ2FY26Cr} cr of one-time charges (impairment and closure of the Swiss plant, R&D inventory, legal provisions) that therefore never appeared as expenses. The deferred part (US$17.5mn a quarter to Mar-2028) keeps lifting reported revenue and margin with no cash.`,
      `**Undisclosed one-time costs in operating lines.** The one-time IGI management bonus and the deal costs sat in employee and other expenses in Q2FY26 without a figure; our estimate from the cost lines is ~₹${n0(X.ONE_OPEX)} cr.`,
      `**Provisions that can reverse.** The FY26 charges include ₹${n0(EX.FY26[3].cr)} cr against inventory and ₹${n0(EX.FY26[4].cr)} cr against receivables and other assets; the company says any recovery "will add to profitability". Write-backs would flatter future earnings.`,
      `**Forex in other income.** FY26 other income of ₹${n0(FY26.otherIncomeCr)} cr included a ₹${n0(FY26.forexGainCr)} cr exchange gain; interest income was only ₹${n0(FY26.interestIncomeCr)} cr. We forecast no forex.`,
      `**Quasi-debt behind "zero debt".** A US$96mn (₹${n0(CM.customerAdvanceNc)} cr) customer advance received in March 2026, customer security deposits up from ₹${n0(CM.customerDepositsMar25)} cr to ₹${n0(CM.customerDeposits)} cr, and ₹${n0(litig)} cr of litigation payables, against ₹${n0(CM.companyNetCash)} cr of net cash.`,
      `**Cash conversion.** Operating cash flow was negative in FY24 and FY25; FY26 was positive only because of the upfront and the advance.`,
      '**Audit.** Walker Chandiok & Co (Grant Thornton network), unmodified opinion; revenue recognition is a key audit matter. Analysts on the Q4FY26 call asked for consistent disclosure of net debt, capex and R&D, which varies quarter to quarter.',
    ] },
    { callout: '**Accounting flag: RED.** Nothing here is illegal or hidden (it is all in the annual report), but a reader of Glenmark\'s headline numbers has to make five adjustments to see the business: exceptional items every year, licensing income and netted charges inside revenue, undisclosed one-time costs, possible provision write-backs and customer money that props up the cash figure. That is why our model and valuation use core numbers.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Saldanha family owns ${OH.categoriesPct.promoter}% (Jun-2026), almost all through the Saldanha Family Trust (${OH.promoters[0].pct}%), with no pledge; the holding has not moved in years. Indian mutual funds own ${OH.categoriesPct.mf}% (HDFC Mutual Fund alone ${OH.institutions[0].pct}%), up sharply since 2023; foreign investors ${OH.categoriesPct.fpi}% (Norway's Government Pension Fund Global ${OH.institutions[1].pct}%); insurers only ${OH.categoriesPct.insurance}%. The public holds ${OH.categoriesPct.public}%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoters.map(h => [h.name, h.pct.toFixed(2) + '%', 'Promoter group']),
    { hl: true, cells: ['**All promoters**', `**${OH.categoriesPct.promoter}%**`, 'No pledge'] },
    ...OH.institutions.map(h => [h.name, h.pct.toFixed(2) + '%', /Pension|Amansa/.test(h.name) ? 'Foreign investor' : 'Mutual fund']),
    ['Foreign portfolio investors (all)', OH.categoriesPct.fpi + '%', ''],
  ], source: 'BSE shareholding pattern (Jun-2026) via Trendlyne' } },
  { callout: '**Our read:** a controlling family with no pledge and no selling, and domestic funds that bought the turnaround. The family holds the chair, the MD role and an executive directorship, and the CMD\'s 86-year-old mother is on the board, so outside shareholders rely on five independent directors.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: family-run with a reasonable board, high CEO pay, and a weak compliance and litigation record',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Moderate', 'Unmodified audit (Walker Chandiok); but exceptional items five years running, charges netted inside revenue, inconsistent quarterly disclosure.', 'Readable only with adjustments (see Earnings quality).'],
      ['Family control', 'Moderate', 'Saldanha Family Trust 45.44%; CMD, his sister (executive director) and mother (non-executive) on a 9-member board.', 'Long-term owners; little independent check at the top.'],
      ['Board', 'Moderate', '5 of 9 independent (55.6%), average tenure 3.5 years; ex-Teva generics CEO, ex-Cabinet Secretary, ex-Bank of India CMD; 5 women.', 'Adequate; the independent bench was largely rebuilt recently.'],
      ['Pay', 'Watch', 'CMD ₹19.2 cr (277x the median employee); CFO ₹9.7 cr; one-time IGI bonus in FY26 not quantified.', 'High for the profits delivered.'],
      ['Compliance (USFDA)', 'Weak', 'Monroe recall (2021), warning letters at Goa (2022), Monroe (2023), Indore (2025); Monroe and Goa cleared in FY26-27.', 'Improving, but the record has cost years of US growth.'],
      ['Legal and antitrust', 'Weak', 'Zetia settlements (US$87.5mn class, US$7mn opt-outs, United Healthcare ₹98 cr); price-fixing MDL settlements with direct purchasers (₹323 cr) and state AGs (₹278 cr); two groups still open.', 'Recurring cash costs; ₹964 cr of litigation liabilities at Mar-26.'],
      ['Capital allocation', 'Moderate', 'Debt repaid with asset-sale and licensing money; two decades of R&D paid off once (ISB 2001); Monroe idle for four years; CFO changed in May-2025.', 'The balance sheet is now clean; the test is the next three years.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (board, remuneration annexure, note 40); FDA and company filings; GAM Research' },
  ],
};

module.exports = { guidance, quality, ownership, governance };
