// Abbott India report, part 4: Q1FY27 & momentum, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./ABBOTINDIA.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, TR, YRS, BL, LBL, build, oiTreas, openCash, oi26, oi25, recur26, oneOff26, yield26, ttmOi, netCash26, bob, idir, CONS, shortDate, SQ } = X;
const q0 = SQ.find(q => q.q === 'Q1FY26'), q1 = SQ.find(q => q.q === 'Q1FY27');
const g = (a, c) => `${c >= a ? '+' : '−'}${Math.abs((c / a - 1) * 100).toFixed(1)}%`;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & momentum', kicker: 'Momentum', title: 'Q1FY27: revenue +4% (Novo brands fell), EBITDA +17% and margin 28.8%; no call, no guidance',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n1(q0.revenue), n1(q1.revenue), g(q0.revenue, q1.revenue)],
      ['Gross margin', `${q0.grossMarginPct}%`, `${q1.grossMarginPct}%`, `+${Math.round((q1.grossMarginPct - q0.grossMarginPct) * 100)}bp`],
      ['Employee cost', n1(q0.employee), n1(q1.employee), g(q0.employee, q1.employee)],
      ['Other expenses', n1(q0.otherExp), n1(q1.otherExp), g(q0.otherExp, q1.otherExp)],
      ['EBITDA (before other income)', n1(q0.ebitda), n1(q1.ebitda), g(q0.ebitda, q1.ebitda)],
      ['  margin', `${q0.ebitdaMarginPct}%`, `${q1.ebitdaMarginPct}%`, `+${Math.round((q1.ebitdaMarginPct - q0.ebitdaMarginPct) * 100)}bp`],
      ['Other income', n1(q0.otherIncome), n1(q1.otherIncome), g(q0.otherIncome, q1.otherIncome)],
      ['Depreciation / finance cost', `${q0.dep} / ${q0.interest}`, `${q1.dep} / ${q1.interest}`, ''],
      ['Tax rate', '25.8%', `${Q1.taxRatePct}%`, ''],
      { hl: true, cells: ['**Net profit**', `**${n1(q0.pat)}**`, `**${n1(q1.pat)}**`, `**${g(q0.pat, q1.pat)}**`] },
      ['EPS (₹)', '172.2', n1(Q1.eps), '+17.1%'],
    ], source: 'Results filing, 12-Aug-2026; ICICI Direct quarterly table (13-Aug-2026)' } },
    { bullets: [
      '**Revenue missed, profit beat.** BOBCAPS had expected revenue of ₹1,912 cr (actual 5.2% lower) but EBITDA 5.9% higher than it forecast; ICICI Direct called the 4.3% growth "a negative surprise" against ~12% IQVIA growth and suspects some timing difference.',
      '**Why revenue was weak:** Novo Nordisk brands declined (Rybelsus, Human Mixtard, Novomix); Novo stopped supplying cartridge-based insulins. The own portfolio grew ~11% (Pharmarack, BOBCAPS).',
      '**Why margins rose:** materials and traded goods fell to 51.4% of revenue (54.2% a year earlier) as low-margin partner sales shrank; staff and other costs grew only 4% and 1%.',
      '**Since the quarter:** the FY26 dividend (₹1,394 cr) was paid from 18-Aug-2026; Sudarshan Jain became the first independent chairman (13-Aug-2026); BOBCAPS cut its target to ₹30,839 on slower growth (3-Sep-2026).',
    ] },
    { exhibit: { type: 'table', title: 'What management says about the future (no numbers are guided)', head: ['Statement (AR FY26, published Jul-2026)'], rows: [
      ['"We remain committed to sustaining market-aligned growth while continuing to strengthen profitability and operating efficiency" (Managing Director)'],
      ['Priorities: market-beating growth in focus therapies; building large brands; chronic and sub-chronic care, preventive health, metabolic, women\'s health, gastro, liver and CNS'],
      ['"Build and partner approach": organic brands, lifecycle management, "selective partnerships and potential acquisitions"'],
      ['Risks named: price controls, competition in mature therapies, portfolio concentration, "margin pressure arising from necessary reinvestment"'],
    ], source: 'AR FY26 (MD\'s message, MD&A outlook, pp. 17, 39-40)' } },
    { callout: '**Why it matters:** Abbott India does not hold earnings calls (the last investor meet was in Sep-2022) and does not split its revenue, so the market reads it through IQVIA and Pharmarack. That makes quarters like Q1FY27 confusing: the headline growth is driven by a partner business Abbott does not control, while the own brands, which make the profit, grow ~11%. "Market-aligned growth" with better margins is the only guidance; our forecasts follow it.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts and strong cash conversion; watch sales-return provisions and the interest share of profit',
  blocks: [
    { bullets: [
      '**Revenue and returns.** Distributors may return goods that expire in the supply chain, so revenue is booked net of an estimated return provision: sales returns of ₹133 cr in FY26 (₹154 cr in FY25), 1.9% of contracted sales. The auditor (Walker Chandiok, Grant Thornton network) names this provision as the only key audit matter.',
      `**Other income is ${Math.round(FY26.otherIncome / FY26.pbt * 100)}% of profit before tax.** ₹${n0(oi26.fdInterest)} cr of the ₹${n0(oi26.total)} cr is deposit interest; ₹${n1(oneOff26)} cr was one-off in FY26 (tax-refund interest, gain on selling two offices, exchange gain). We forecast only recurring items.`,
      `**Labour codes.** The new labour codes (notified 21-Nov-2025) added ₹${FY26.labourCodeCharge} cr to FY26 employee costs (gratuity ₹15.7 cr, leave ₹2.4 cr), booked in operating costs, not as an exceptional item; Q3FY26's margin (26.9%) carried it.`,
      '**Exceptional items** are immaterial (₹5 cr after tax in FY26 per Screener), so reported EPS is a fair basis for history and forecasts.',
      `**Cash conversion.** Operating cash flow was ₹${n0(FY26.cfo)} cr in FY26 (${Math.round(FY26.cfo / FY26.pat * 100)}% of profit) after ₹540 cr of tax; interest received sits in investing cash flow. Before tax, cash from operations was ~98% of EBITDA (Screener). FY25 (86%) was lower because inventory rose ₹262 cr.`,
      '**Share-based pay** is in Abbott Laboratories shares (₹12.7 cr charged in FY26); no dilution of Abbott India shares.',
      '**Contingent liabilities** are small (₹114 cr: income tax ₹86 cr, sales tax ₹17 cr, customs ₹11 cr).',
    ] },
    { callout: '**Accounting flag: GREEN.** Conservative, simple accounts: no debt, no capitalised costs of note, no acquisitions, small contingencies, and profit that turns into cash. The two things to read carefully are the return provision (judgemental) and the large interest component of profit, which falls if the payout rises or deposit rates fall.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Abbott Laboratories owns ${OH.promoters}% through three UK companies: ${OH.promoterEntities.split(' (')[0]}. That is the most a promoter may hold under the 25% minimum public shareholding rule, so the free float is ${OH.freeFloatPct}% (~₹${n0(X.mcap * OH.freeFloatPct / 100)} cr at the 30-Sep close). Indian institutions hold ${OH.diis}%, foreign portfolio investors only ${OH.fiis}% and individuals ${OH.public}% (${n0(OH.shareholders)} shareholders, Jun-2026). There is no pledge.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns Abbott India (Jun-2026)', head: ['Holder', 'Stake', 'Comment'], wide: [2], rows: [
    ['Abbott Capital India Ltd, UK', '50.45%', 'Holding company (AR FY26 BRSR)'],
    ['Abbott Healthcare Products Ltd, UK', '17.62%', 'Fellow subsidiary; stake implied by FY26 dividends (₹177.89 cr ÷ ₹475)'],
    ['British Colloids Ltd, UK', '6.92%', 'Fellow subsidiary; implied by FY26 dividends (₹69.83 cr ÷ ₹475)'],
    { hl: true, cells: ['**Promoter group**', `**${OH.promoters}%**`, 'At the 75% cap; unchanged for years'] },
    ['Domestic institutions (mutual funds, insurers)', `${OH.diis}%`, 'Steady at 8.7-9.2% since Dec-2023'],
    ['Foreign portfolio investors', `${OH.fiis}%`, 'Up from 0.16% (Mar-2025), still negligible'],
    ['Individuals and others', `${OH.public}%`, `${n0(OH.shareholders)} shareholders`],
  ], source: 'BSE shareholding pattern via Screener.in (Jun-2026); AR FY26 note 39 and BRSR' } },
  { callout: `**Liquidity: thin.** Average daily trading is ~US$3mn (BOBCAPS, Sep-2026), about 0.05% of the market value, so a ₹100 cr position is roughly four days of normal volume. With foreign investors almost absent and the parent unable to buy more without a delisting or open offer, the stock trades on domestic institutional demand. That partly explains why it can stay de-rated for long periods.` },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: an MNC subsidiary with clean terms, but a parent that decides everything and says very little',
  blocks: [
    { p: 'Abbott India is run by a professional team appointed through Abbott\'s global structure: Managing Director Kartik Rajendran (from 14-Jun-2025, succeeding Swati Dalal), CFO Maithilee Mistry (from 6-May-2025). The board has eight members after the Aug-2026 AGM: the MD, four non-executive (non-independent) directors and three independent directors, one of whom, Sudarshan Jain, became chairman on 13-Aug-2026 after Munir Shaikh\'s 25 years. Board turnover was high in 2025-26 (four departures, four arrivals).' },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Evidence'], wide: [2], rows: [
      ['Control and board', 'AMBER', '75% parent control; 3 of 8 directors independent; first independent chairman from Aug-2026'],
      ['Related parties', 'GREEN', 'No royalty or brand fee; related-party purchases 12.4% of total (15.6% in FY25); disclosed at arm\'s length'],
      ['Structure', 'AMBER', 'Abbott also owns an unlisted Indian pharma arm (Abbott Healthcare) that shares services and offices; allocation of new products is the parent\'s choice'],
      ['Disclosure and investor communication', 'RED', 'No earnings calls or presentations since Sep-2022; no split of own vs partner revenue or by therapy'],
      ['Capital allocation and minority treatment', 'GREEN', '71-90% payouts; no dilution since 2011; no acquisitions; no pledges'],
      ['Accounts and audit', 'GREEN', 'Walker Chandiok (Grant Thornton network); one key audit matter (return provisions); contingencies ₹114 cr'],
      ['Management stability', 'AMBER', 'New MD (Jun-2025), new CFO (May-2025), new chairman (Aug-2026)'],
      ['Pay', 'GREEN', 'MD paid 57.4x the median employee; independent directors ₹0.15 cr commission plus fees'],
    ], source: 'AR FY26 (board, corporate governance report, note 39, Annexure IV); results filing 12-Aug-2026; GAM assessment' } },
    { callout: '**Overall: AMBER.** Minority holders are treated fairly on the numbers (no royalty, high payouts, clean books), but they are passengers: the parent decides brands, payout and strategy, and the company explains itself less than almost any large listed Indian drug maker. Better disclosure would itself be a re-rating trigger.' },
  ],
};

const STREET_F = [['BOB Capital Markets (3-Sep)', bob], ['ICICI Direct (13-Aug)', idir]];
const est = (s, k2, f) => (s?.[k2] ? Object.values(s[k2]).map(f).join(' / ') : '–');
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n0(F.eps[0])} / ${n0(F.eps[1])} / ${n0(F.eps[2])}, ${Math.abs(Math.round((F.eps[1] / CONS.epsFY28E - 1) * 100))}% below consensus for FY28E; slower revenue, higher margins`,
  blocks: [
    { p: `We forecast revenue of ₹{{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} (+{{F.epsGrowth.0|pct}} / +{{F.epsGrowth.1|pct}} / +{{F.epsGrowth.2|pct}}). Against the street we are lower on revenue (the partner business keeps shrinking in FY27; BOBCAPS and ICICI Direct model ~8% growth), higher on margin (mix), and ${Math.abs(Math.round((F.eps[1] / CONS.epsFY28E - 1) * 100))}% below Bloomberg consensus on FY28E EPS (₹${n1(CONS.epsFY28E)}).` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', ...STREET_F.map(s => s[0]), 'Consensus'], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ...STREET_F.map(([, s]) => est(s, 'sales', n0)), '–'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', ...STREET_F.map(([, s]) => est(s, 'ebitda', n0)), '–'],
      ['EPS (₹)', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', ...STREET_F.map(([, s]) => est(s, 'eps', n1)), `${n1(CONS.epsFY27E)} / ${n1(CONS.epsFY28E)}`],
    ], source: 'GAM; BOBCAPS company update (3-Sep-2026); ICICI Direct result update (13-Aug-2026); Bloomberg consensus as printed by BOBCAPS (3-Sep-2026). Street columns show FY27E / FY28E (/ FY29E)' } },
    { exhibit: { type: 'column', title: 'FY28E EPS: GAM below the street', unit: 'FY28E EPS (₹)', x: ['GAM', 'BOB Capital Markets', 'ICICI Direct', 'Consensus'], series: [{ name: 'FY28E EPS', values: [Math.round(F.eps[1] * 10) / 10, bob.eps.FY28E, idir.eps.FY28E, CONS.epsFY28E], fmt: 'n1' }], labels: 'all', highlight: 'GAM', source: 'Broker notes; Bloomberg consensus via BOBCAPS; GAM' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      [`${LBL.own} growth`, ...BL.growth.own.map(x => x + '%'), 'Q1FY27 ~+11% (Pharmarack); IQVIA ~12%; price growth ~4% (NLEM +0.65%)'],
      [`${LBL.partner} growth`, ...BL.growth.partner.map(x => x + '%'), 'Insulin formats discontinued; Rybelsus −16%; Extensior from Mar-2026'],
      ['Revenue growth', '{{F.salesGrowth.0|pct}}', '{{F.salesGrowth.1|pct}}', '{{F.salesGrowth.2|pct}}', 'Sum of the two (checked in ABBOTINDIA.ctx.js)'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Q1FY27 28.8%; mix shift to own brands; reinvestment caps the rise'],
      ['Capex incl. leases (₹ cr)', ...AS.capex.map(n0), 'FY25-26 ₹41-53 cr plus lease additions'],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'FY26 25.4%, Q1FY27 25.1%'],
      ['Payout', ...AS.payout.map(t => t + '%'), 'FY21-26 average 77%; FY26 90% incl. special'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Opening net cash (all deposits less leases)', n0(TR.mar25.total - 197), ...openCash.map(n0), 'Mar-26 ₹4,410 cr of cash and deposits less ₹172 cr of leases; then the model\'s year-end net cash'],
      ["Treasury yield", `${yield26.toFixed(2)}%`, ...AS.treasuryYield.map(x => x.toFixed(2) + '%'), 'FY26: deposit interest ÷ average deposits; repo rate 5.25% (held on 5-Aug-2026; 6.5% in early 2025), so the yield drifts down as deposits roll over'],
      ['Treasury income', n0(oi26.fdInterest), ...oiTreas.map(n0), 'Yield × opening net cash'],
      ['Recurring non-treasury items', n1(recur26), ...AS.otherIncome.map(n0), 'Deposit and rent ~₹3 cr plus half the lumpy write-backs and claims'],
      ['One-offs (tax-refund interest, office sale, FX)', n1(oneOff26), '0', '0', '0', 'Not forecast'],
      { hl: true, cells: ['**Total other income (model)**', `**${n0(oi26.total)}**`, ...F.otherIncome.map(v => `**${n0(v)}**`), `Twelve months to Jun-26: ₹${n0(ttmOi)} cr; Q1FY27 ₹75 cr (before the Aug-2026 dividend)`] },
    ], source: 'AR FY26 notes 6, 10-12, 25; Screener.in quarterly schedules; RBI (5-Aug-2026); GAM (checked in ABBOTINDIA.ctx.js)' } },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
