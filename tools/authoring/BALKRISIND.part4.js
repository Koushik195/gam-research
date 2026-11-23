// BKT report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./BALKRISIND.ctx');
const { C, D, F, A, AS, n0, n1, pc, pc1, rup, b, shortDate, mosl, idir, arathi, ttmOI, OI26, FY26, Q1, book26, yield26, treasInc26, OIB, STRAT } = X;
const QC = Q1.consolidated, QS = Q1.standalone;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: record volume, revenue +25%, profit +57% on a weak base; margin down 3pp',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['OHT volume (MT)', n0(QS.prior.volumeMt), n0(QS.volumeMt), yoy(QS.volumeMt, QS.prior.volumeMt)],
      ['Revenue, consolidated', n0(QC.prior.revenue), n0(QC.revenue), yoy(QC.revenue, QC.prior.revenue)],
      ['EBITDA, consolidated (Screener basis)', n0(QC.prior.ebitda), n0(QC.ebitda), yoy(QC.ebitda, QC.prior.ebitda)],
      ['EBITDA margin, consolidated', n1(QC.prior.ebitda / QC.prior.revenue * 100) + '%', n1(QC.ebitda / QC.revenue * 100) + '%', ''],
      ['EBITDA margin, standalone (company)', QS.prior.ebitdaMarginPct + '%', QS.ebitdaMarginPct + '%', '−320bp'],
      ['Realised FX on sales (standalone)', '−1', n0(QS.realisedFx), ''],
      ['Unrealised FX (standalone, below EBITDA)', '−154', '+' + QS.unrealisedFx, ''],
      ['Other income, consolidated', n0(QC.prior.otherIncome), n0(QC.otherIncome), yoy(QC.otherIncome, QC.prior.otherIncome)],
      { hl: true, cells: ['**Net profit, consolidated**', `**${n0(QC.prior.pat)}**`, `**${n0(QC.pat)}**`, `**${yoy(QC.pat, QC.prior.pat)}**`] },
      ['EPS, consolidated (₹)', n1(QC.prior.eps), n1(QC.eps), ''],
    ], source: 'Q1FY27 presentation p.8 (standalone); Screener.in (consolidated, as reported on 29/30-Jul-2026)' } },
    { bullets: Q1.callPoints.map(rup) },
    { exhibit: { type: 'table', title: 'What management said (May to Jul-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome || '–')]), source: 'Q4FY26 call (9-May-2026); Q1FY27 call (30-Jul-2026)' } },
    { callout: `**Why it matters:** the Q1 profit jump is mostly the base: Q1FY26 carried a ₹154 cr unrealised FX loss (standalone) that turned into a ₹57 cr gain. The operating margin fell ~3pp (standalone) on raw materials, India mix and higher staff costs, and management expects ~2pp more pressure in Q2. Our FY27E EBITDA margin of {{F.ebitdaMargin.0|pct}} assumes ~19.5-20% in Q2-Q3 and ~21% in Q4.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: real cash and a clean balance sheet, but currency and treasury gains move profit a lot',
  blocks: [
    { bullets: [
      `**Cash conversion is good.** Cash from operations was ${Math.round(A.cfoToPat[b - 1])}% of net profit in FY25 and ${Math.round(A.cfoToPat[b])}% in FY26 (₹${n0(A.cfo[b])} cr), helped by depreciation (₹775 cr) and lower working capital. Free cash flow was negative in FY26 (capex ₹3,003 cr) and will be again in FY27E.`,
      `**Currency moves the P&L in three places.** Realised hedge gains or losses sit in revenue, unrealised ones in other expenses (consolidated) or below EBITDA (standalone), and in FY25 a ₹267 cr FX gain sat in other income. Between FY25 and FY26 the standalone swing was ₹517 cr; a further ₹575 cr hedge loss went through OCI. Reported margins and EPS are therefore not comparable year to year.`,
      `**Half of other income is market-linked treasury gains.** FY26 other income of ₹${n0(OI26.total)} cr included ₹${n0(OI26.mtmGain)} cr of mark-to-market gains and ₹${n0(OI26.gainSaleNonCurrent + OI26.gainSaleCurrent)} cr of realised gains on investments; Screener tags ₹171 cr of such items as "exceptional". They recur while BKT holds a ~₹${n0(book26)} cr market-linked book (8.1% total return in FY26), but they fall as the book is run down for capex. We forecast ₹{{F.otherIncome.0|num}} cr in FY27E and ₹{{F.otherIncome.1|num}} cr in FY28E (twelve months to Jun-26: ₹${n0(ttmOI)} cr).`,
      `**Non-core investments.** ₹${n0(STRAT)} cr in strategic equity (₹593 cr NSE stake, start-up preference shares) and ₹424 cr in AIFs and real-estate debt funds. Small against net worth, but not what an industrial company needs, and the NSE stake's value is not cash.`,
      '**CWIP is large.** ₹2,472 cr at Mar-26 (Screener), up from ₹986 cr: carbon black, CV radial and PCR projects. Our model depreciates new capex at once and holds CWIP flat, which slightly overstates FY27E depreciation timing.',
    ] },
    { callout: '**Accounting flag: AMBER.** Clean audit, real cash, no related-party oddities found. The amber is for the hedging: large, volatile FX gains and losses spread across revenue, expenses, other income and OCI, which make the margin hard to read, plus market-linked treasury gains in other income. A second auditor (Deloitte, proposed May-2026) is a positive.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Poddar family owns ${OH.categories.promoters}% (Jun-2026): at Mar-2026 Rajiv Poddar held 27.71% directly, VKP Enterprises LLP 24.95%, Khushboo Poddar 3.93% and Rishabh Poddar 1.44%. Mutual funds own ${OH.categories.mutualFunds}% (HDFC Value Fund alone 9.18% at Mar-26), insurers ${OH.categories.insurance}%, foreign portfolio investors ${OH.categories.fpi}% and the public ${OH.categories.public}%. ${OH.trend}.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake'], wide: [0], rows: [...C.promoters.map(([h, p]) => [h + ' (promoter)', p + '%']), ...C.largeHolders.map(([h, p]) => [h, p + '%'])], source: 'AR FY26 note 17 (31-Mar-2026). Jun-2026 category totals from the shareholding pattern; Jun-2026 named holders were not available to us.' } },
  { callout: '**Our read:** a family-controlled company with a stable 58% stake and a large domestic-fund shareholder base. Foreign investors have been selling (FPIs down ~2.4pp since Dec-2023) as earnings stalled.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: founder-run and conservative, but generously paid and tight-lipped',
  blocks: [
    { p: rup(`${C.management.cmd}; ${C.management.jmd}; ${C.management.cfo}; ${C.management.strategy}. Auditor: ${C.management.auditor}.`) },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor + '.', 'No qualifications; a second auditor adds comfort.'],
      ['Board and control', 'Moderate', D.governance.board + '.', 'Family control of strategy and capital allocation.'],
      ['Related-party flows', 'Strong', rup(D.governance.relatedParty) + '.', 'Not a concern on what we read.'],
      ['Pay', 'Watch', rup(D.governance.pay) + '.', 'High for a company whose profit fell; commission-heavy.'],
      ['Capital allocation', 'Moderate', 'Funded a decade of growth from cash flow; now borrowing for a ₹6,800 cr plan aimed at new markets; dividend ₹16 a share (25% payout).', 'The OHT capex is sound; the on-highway bet is unproven.'],
      ['Disclosure', 'Weak', rup(D.governance.disclosure) + '.', 'Investors get less help than at most peers.'],
      ['Management depth', 'Moderate', 'New CFO (Q1FY27) after M.S. Bajaj moved to adviser; new carbon black head (Jul-2026).', 'Transition while capex peaks.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, note 17); Q4FY26 and Q1FY27 calls' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, below the street',
  blocks: [
    { p: `We forecast revenue from the business-line build (OHT volume and price, third-party carbon black, on-highway), an EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} on Screener's basis, capex of ₹{{F.capex.0|num}} / {{F.capex.1|num}} / {{F.capex.2|num}} cr and depreciation at ${AS.depRateOnGrossBlock}% of gross block. Other income is built: ${OIB.yieldPct}% on a ₹2,300-2,600 cr interest-bearing and market-linked book (FY26: ${n1(yield26)}% on ~₹2,680 cr, ₹${n0(treasInc26)} cr) plus ~₹${OIB.dividends} cr of dividends and ~₹${OIB.misc} cr of other items; FY27E also includes Q1's ₹100 cr. Interest of ₹{{F.interest.0|num}} / {{F.interest.1|num}} / {{F.interest.2|num}} cr follows debt, which peaks in FY27E. Tax 25%, payout 22%. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates. Forecast free cash flow excludes treasury income.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'ICICI Direct FY27E', 'MOSL FY27E', 'GAM FY28E', 'ICICI Direct FY28E', 'MOSL FY28E', 'Anand Rathi FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(idir.revenue.FY27E), '–', '{{F.sales.1|num}}', n0(idir.revenue.FY28E), '–', '–'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', idir.ebitdaMarginPct.FY27E + '% (standalone)', '–', '{{F.ebitdaMargin.1|pct}}', idir.ebitdaMarginPct.FY28E + '% (standalone)', '–', arathi.ebitdaMarginPct.FY28E + '%'],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(idir.eps.FY27E)}**`, `**~${n1(mosl.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(idir.eps.FY28E)}**`, `**~${n1(mosl.eps.FY28E)}**`, `**~${n1(arathi.eps.FY28E)}**`] },
      ['Gap (GAM vs broker)', '', pc(gap(F.eps[0], idir.eps.FY27E)), pc(gap(F.eps[0], mosl.eps.FY27E)), '', pc(gap(F.eps[1], idir.eps.FY28E)), pc(gap(F.eps[1], mosl.eps.FY28E)), pc(gap(F.eps[1], arathi.eps.FY28E))],
    ], source: 'ICICI Direct (31-Jul-2026, PDF); MOSL (30-Jul-2026; EPS implied from its 26.5x / 22.5x at ₹2,307); Anand Rathi (2-Aug-2026; EPS implied from ₹2,950 at 28x). No dated consensus before 30-Sep-2026 was found.' } },
    { callout: `We are in line with ICICI Direct for FY27E but ${Math.abs(gap(F.eps[1], mosl.eps.FY28E))}-${Math.abs(gap(F.eps[1], arathi.eps.FY28E))}% below MOSL and Anand Rathi for FY28E. The difference is the margin: we do not assume a return to 23%+ while raw materials, freight and the new businesses weigh, and we assume the euro tailwind is already in FY27. Our EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E from a depressed FY26 base, but only ~${Math.round(X.epsCagrFrom25)}% a year from FY25.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
