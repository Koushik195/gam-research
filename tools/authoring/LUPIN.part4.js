// Lupin report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./LUPIN.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, ACC, b, YRS, BL, LK, LBL, lines, blTot, prodSales, fx26, marginOnSales, OI, treas26, oneOff26, netCash26, grossCash26, debt26, openCash, oiNet, oiDebt, oiVisu, MISC, VISU, yield26, ttmOiCompany, mosl, pl_, emkay, bob, CONS, shortDate, LIC, daBottom } = X;
const ch = (a, b2) => pc((a / b2 - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: a record quarter, and a guidance that says it will not last',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore unless stated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q1.revenuePrior), n0(Q1.revenue), ch(Q1.revenue, Q1.revenuePrior)],
      ['  United States (US$ mn)', Q1.usUsdPrior, Q1.usUsdMn, `+${Q1.usCcGrowthPct}% in $`],
      ['  India', n0(Q1.indiaPrior), n0(Q1.india), `+${Q1.indiaGrowthPct}%`],
      ['  Other developed / emerging markets', `${n0(Q1.odmPrior)} / ${n0(Q1.emPrior)}`, `${n0(Q1.odm)} / ${n0(Q1.em)}`, `+${Q1.odmGrowthPct}% / +${Q1.emGrowthPct}%`],
      ['Gross margin (on product sales)', `${Q1.grossMarginPriorPct}%`, `${Q1.grossMarginPct}%`, '+330bp'],
      ['R&D (% of sales)', '498 (8.1%)', `${n0(Q1.rdCr)} (${Q1.rdPct}%)`, '+22%'],
      ['EBITDA (excl. forex and other income)', n0(Q1.ebitdaExFxOiPrior), n0(Q1.ebitdaExFxOi), ch(Q1.ebitdaExFxOi, Q1.ebitdaExFxOiPrior)],
      ['  margin', `${Q1.ebitdaMarginPriorPct}%`, `${Q1.ebitdaMarginPct}%`, '+340bp'],
      ['Depreciation and amortisation', n0(Q1.depPrior), n0(Q1.dep), ch(Q1.dep, Q1.depPrior)],
      ['Tax rate', '13.7%', `${Q1.etrPct}%`, ''],
      { hl: true, cells: ['**Profit attributable to owners**', `**${n0(Q1.patPrior)}**`, `**${n0(Q1.pat)}**`, `**${ch(Q1.pat, Q1.patPrior)}**`] },
    ], source: 'Q1FY27 press release and call (6-7 Aug 2026)' } },
    { bullets: [
      '**Why profit grew only 16% when EBITDA grew 50%:** D&A rose 51% (amortisation of the Mirabegron licence and VISUfarma intangibles) and the tax rate more than doubled (13.7% to 29.8%) as incentives on some Indian plants ended.',
      '**What the guidance implies:** US $1.1-1.2bn for FY27 means $250-280mn a quarter after Q1\'s $366mn; ~25% EBITDA margin for the year means ~22-24% for the rest of it. Management also flagged higher raw-material and freight costs (West Asia) not yet in Q1 because of inventory.',
      '**What happened after the call (to 30-Sep-2026):** Citi downgraded to Sell (27-Aug); the Delaware court ruled for Lupin on ivacaftor (24-Aug); the FDA tentatively approved the apixaban oral suspension (25-Sep). The stock fell from ₹2,364 to ₹2,030.',
    ] },
    { exhibit: { type: 'table', title: 'What management said, and what happened (Feb-Aug 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome || '–')]), source: 'Q3FY26, Q4FY26 and Q1FY27 calls and releases' } },
    { callout: '**Credibility check:** Lupin has under-promised recently: FY26 margin guidance went from 25-26% to 27-28% and it delivered 29.7%; US sales beat "billion dollar plus" by 30%. That is why we sit in the upper half of the FY27 US range. But the direction is not in doubt: the company itself is telling investors that FY27 earnings fall.' },
  ],
};

const EX = ACC.exceptionals;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: one-off charges keep recurring, forex flatters the headline, licences sit below EBITDA',
  blocks: [
    { bullets: [
      `**"One-offs" that keep coming.** FY22: ₹1,878 cr Glumetza antitrust settlement and a ₹708 cr Solosec impairment. FY26: a net exceptional charge of ₹${n0(-ACC.exceptionalNetFy26Cr)} cr: ${EX.map(e => `${e.item.toLowerCase()} ${e.preTaxCr < 0 ? '−' : '+'}₹${n0(Math.abs(e.preTaxCr))} cr`).join('; ')}. The antitrust provision is not finished: one case settled for $30mn in Apr-2026 and the rest of the provision is held for others. We value on EPS before exceptional items (as the street does) but treat litigation as a recurring cost of the US business in our risks.`,
      `**Forex in the headline.** The company's headline EBITDA includes forex and other income: FY26 33.6% vs 29.7% without them; the FY26 forex gain was ₹${n0(FY26.forexGainCr)} cr (2.4% of sales) from a weaker rupee. Our EBITDA (and Screener's annual figure) excludes both; we forecast no forex gains.`,
      `**Costs below EBITDA.** The $75mn Mirabegron prepaid option was capitalised and is amortised to Sep-2027 (~₹${LIC[0]} cr in FY27E), so part of the cost of keeping Mirabegron on the market never touches EBITDA. EV/EBITDA comparisons flatter Lupin for that reason.`,
      `**Other income.** FY26 other income ₹${n0(OI.total)} cr: ₹${n0(treas26)} cr of treasury income on ~₹8,000 cr average gross cash, ₹${n0(oneOff26)} cr of one-offs (a business-divestment gain, asset-sale gains) and ₹${n0(OI.misc)} cr miscellaneous. We build it from these parts (see Forecasts).`,
      `**Tax.** ETR 22.1% in FY26 (incentives and deferred tax), 29.8% in Q1FY27, guided 27-28% for FY27: ~7% of EPS lost to tax alone.`,
      `**Cash conversion.** Operating cash flow ₹${n0(A.cfo[b])} cr in FY26 (${Math.round(A.cfoToEbitda[b])}% of EBITDA), helped by working capital falling from 110 to 87 days; free cash flow after capex (incl. the Mirabegron licence) ₹${n0(A.fcfCalc[b])} cr.`,
      '**Contingent items.** ₹635 cr of guarantees for subsidiaries, ₹150 cr of disputed tax demands, ₹68 cr of other claims (AR FY26 note 40), plus the open-ended US antitrust litigation (no estimate possible, per the company).',
      '**Minorities and audit.** Minorities are small (₹22.6 cr in FY26, mainly the Philippines); we use profit attributable to owners. Auditor B S R & Co. (KPMG network), unqualified; goodwill impairment testing is a key audit matter.',
    ] },
    { callout: '**Accounting flag: AMBER.** The accounts are audited cleanly and segment data is published every quarter, but reported profit has been hit by large litigation and impairment charges in four of the last seven years, the headline margin includes forex, and Screener misclassifies forex and exceptional items. Lupin does not disclose sales of its key US products, so investors cannot see the windfall directly.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Gupta family owns ${OH.categoriesPct.promoter}% (Jun-2026), almost all through Lupin Investments Pvt Ltd (${OH.promoters[0].pct}%), with no pledge; the holding has not moved in two years. Foreign investors own ${OH.categoriesPct.fpi}% (up from 20.5% in Sep-2025), Indian mutual funds ${OH.categoriesPct.mf}% (down from 20.6%: they sold into the rally) and insurers ${OH.categoriesPct.insurance}% (mostly LIC). The public holds ${OH.categoriesPct.public}%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoters.map(h => [h.name, h.pct.toFixed(2) + '%', 'Promoter group']),
    { hl: true, cells: ['**All promoters**', `**${OH.categoriesPct.promoter}%**`, 'No pledge'] },
    ...OH.institutions.map(h => [h.name, h.pct.toFixed(2) + '%', /Insurance|LIC|Life/.test(h.name) ? 'Insurer' : /NPS/.test(h.name) ? 'Pension fund' : 'Mutual fund']),
    ['Foreign portfolio investors (all)', OH.categoriesPct.fpi + '%', 'No single FPI above 1% named'],
  ], source: 'BSE shareholding pattern (Jun-2026) via Trendlyne; fund houses shown as one line' } },
  { callout: '**Our read:** a stable, controlling family with no pledge and no selling: aligned with minorities on value, but the family also holds the CEO, MD and chair roles, so outside shareholders rely on the independent directors. Mutual-fund selling in FY26-27 reflects valuation, not governance.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a family-run company with a strong board, a weak compliance record and an open antitrust file',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note || '')]), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'B S R & Co. (KPMG), unqualified; quarterly market-wise sales; detailed calls.', 'No accounting red flags; product-level US data is missing.'],
      ['Family control', 'Moderate', 'Chair (Manju Gupta) is the mother of the CEO (Vinita Gupta) and the MD (Nilesh Gupta); family owns 46.9%.', 'Long-term owners, but no independent check at the top.'],
      ['Board', 'Strong', '10 directors, 6 independent (60%) incl. former Pfizer CEO Jeffrey Kindler and ex-Lilly Alfonso Zulueta; 3 women.', 'Better than most Indian family companies.'],
      ['Pay', 'Watch', 'CEO ₹26.7 cr (428x median, paid by the US subsidiary), MD ₹12.8 cr (205x, raised from Oct-2025), CFO ₹10.6 cr; median pay +5.0%.', 'High; 20-30% performance-linked.'],
      ['Compliance (USFDA)', 'Weak', 'Warning letter 2017-2023 (Goa, Pithampur); open warning letters at Tarapur and Mandideep; Pithampur Unit-2 OAI since 2025.', 'The main operational governance risk; recent clearances help.'],
      ['Legal and antitrust', 'Weak', 'DoJ generic price-fixing investigation since 2017; state AG suit (2019); ₹1,878 cr Glumetza settlement (FY22); ₹582 cr provision (FY26).', 'Recurring cash costs; outcome cannot be estimated.'],
      ['Capital allocation', 'Moderate', 'Gavis ($880mn, FY16) led to impairments; Japan sold; VISUfarma (€190mn) cash-funded; dividend payout ~15%.', 'Disciplined balance sheet, mixed acquisition record.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, ICRA, exchange filings, company calls)' },
  ],
};

const g3 = arr => arr.map(v => n0(v));
const st = (o, y) => (o && o[y] != null ? n0(o[y]) : '–');
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}; a little below the street on FY27-28',
  blocks: [
    { p: `We build revenue by market and run the model on the resulting growth rate; the authoring script checks the build equals model revenue. US sales are built in dollars and converted at an assumed rupee rate (₹${BL.fx.join(' / ')} per $ for FY27-29E; FY26 ₹${n1(fx26)}). EBITDA margin follows guidance in FY27 and falls as the exclusivities fade. D&A is ${AS.depRateOnGrossBlock}% of gross block (bottom-up ₹${daBottom.map(n0).join(' / ')} cr: see Valuation for the sensitivity), capex ₹${AS.capex.map(n0).join(' / ')} cr (FY27E incl. VISUfarma ₹${n0(VISU)} cr), tax ${AS.taxRate.join(' / ')}%, payout ${AS.payout[0]}%. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet, which recalculates the target price.` },
    { exhibit: { type: 'table', title: 'Market build (₹ crore; checked to sum to model revenue)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['United States: US$ mn × ₹/$', `${FY26.usUsdMn} × ${n1(fx26)}`, ...YRS.map((_, i) => `${BL.usdMn[i]} × ${BL.fx[i]}`)],
      ['United States (₹ crore)', n0(BL.base.us), ...g3(lines.us)],
      ...['india', 'odm', 'em', 'api'].map(k2 => [`${LBL[k2]} (growth)`, n0(BL.base[k2]), ...YRS.map((_, i) => `${n0(lines[k2][i])} (+${BL.growth[k2][i]}%)`)]),
      ['Other operating income (export/PLI incentives)', n0(BL.base.otherOp), ...g3(lines.otherOp)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      ['  growth', `${n1(A.salesGrowth[b])}%`, '{{F.salesGrowth.0|pct}}', '{{F.salesGrowth.1|pct}}', '{{F.salesGrowth.2|pct}}'],
      ['EBITDA margin: model basis / on product sales (company basis)', `${n1(A.ebitdaMargin[b])}% / 29.7%`, ...YRS.map((_, i) => `${n1(F.ebitdaMargin[i])}% / ${n1(marginOnSales[i])}%`)],
    ], source: 'Q4FY26 press release; GAM estimates (assumptions.json businessLines)' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury income on opening net cash (yield × net cash)', '', ...g3(oiNet)],
      ['  basis', `${n1(yield26)}% on avg gross cash ~8,000`, ...YRS.map((_, i) => `${AS.treasuryYield[i]}% × ${n0(openCash[i])}`)],
      ['Treasury income on gross debt (cash held against borrowings)', '', ...g3(oiDebt)],
      ['Less: yield on the VISUfarma payment (2-Apr-2026)', '', ...g3(oiVisu)],
      { hl: true, cells: ['**Treasury income, total**', `**${n0(treas26)}**`, ...YRS.map((_, i) => `**${n0(oiNet[i] + oiDebt[i] + oiVisu[i])}**`)] },
      ['Recurring miscellaneous income', n0(OI.misc), `${MISC}`, `${MISC}`, `${MISC}`],
      ['One-offs (divestment and asset-sale gains, fair-value gain)', n0(oneOff26), '0', '0', '0'],
      { hl: true, cells: ['**Other income (excl. forex)**', `**${n0(OI.total)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: twelve months to Jun-26 (company) / FY26 forex gain (not forecast)', `${n0(ttmOiCompany)} / ${n0(FY26.forexGainCr)}`, '', '', ''],
    ], source: `AR FY26 note 31 and balance sheet (gross cash ₹${n0(grossCash26)} cr, borrowings incl. leases ₹${n0(debt26)} cr, opening net cash ₹${n0(netCash26)} cr); ICRA (repayments ~₹280 cr a year); GAM estimates` } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation & amortisation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (FY27E incl. VISUfarma)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net cash)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is Screener gross cash and investments in actual years and net cash (incl. leases as debt) in forecasts. Actual-year other income is Screener\'s (incl. forex, net of exceptional items).' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'MOSL / PL / Emkay / BOB FY27E', 'GAM FY28E', 'MOSL / PL / Emkay / BOB FY28E', 'Consensus FY27E / FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', [mosl, pl_, emkay, bob].map(s => st(s.sales, 'FY27E')).join(' / '), '{{F.sales.1|num}}', [mosl, pl_, emkay, bob].map(s => st(s.sales, 'FY28E')).join(' / '), '–'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', [mosl, pl_, emkay, bob].map(s => st(s.ebitda, 'FY27E')).join(' / '), '{{F.ebitda.1|num}}', [mosl, pl_, emkay, bob].map(s => st(s.ebitda, 'FY28E')).join(' / '), '–'],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${[mosl, pl_, emkay, bob].map(s => n1(s.eps.FY27E)).join(' / ')}**`, '**{{F.eps.1|n1}}**', `**${[mosl, pl_, emkay, bob].map(s => n1(s.eps.FY28E)).join(' / ')}**`, `**${CONS.FY27E} / ${CONS.FY28E}**`] },
    ], source: `MOSL (${shortDate(mosl.date)}), PL (${shortDate(pl_.date)}), Emkay (${shortDate(emkay.date)}; FY29E EPS ₹${emkay.eps.FY29E}), BOB Capital Markets (${shortDate(bob.date)}), all PDF; consensus = Bloomberg as printed by BOB. Broker revenue is total revenue from operations.` } },
    { callout: `Our FY27E EPS (₹${n1(F.eps[0])}) is ${Math.round((1 - F.eps[0] / CONS.FY27E) * 100)}% below consensus: our revenue follows guidance (+${n1(F.salesGrowth[0])}%) while most brokers model +10-14% after the Q1 beat. In FY28E (₹${n1(F.eps[1])}) we sit between Emkay (₹${n1(emkay.eps.FY28E)}) and PL (₹${n1(pl_.eps.FY28E)}) and well below MOSL and BOB (₹${n1(mosl.eps.FY28E)} / ₹${n1(bob.eps.FY28E)}), who expect the US to recover faster. The swing factor is the US in FY28: apixaban's size and how fast Tolvaptan and Mirabegron erode.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
