// GSK India report, part 4: Q1FY27 & momentum, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./GLAXO.ctx');
const { C, D, F, AS, n0, n1, Q1, FY26, TR, BL, LBL, oiTreas, openCash, oi26, treas26, recur26, yieldOpen26, yieldAvg, ttmOi, netCash26, mosl, nb, SQ, PATCH, debtLikePs } = X;
const q0 = SQ.find(q => q.q === 'Q1FY26'), q1 = SQ.find(q => q.q === 'Q1FY27');
const g = (a, c) => `${c >= a ? '+' : '−'}${Math.abs((c / a - 1) * 100).toFixed(1)}%`;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & momentum', kicker: 'Momentum', title: 'Q1FY27: revenue +16.5% (9-10% underlying), EBITDA +18%, margin 31.6% with promotion front-loaded; launches next',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, consolidated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(q0.revenue), n0(q1.revenue), g(q0.revenue, q1.revenue)],
      ['Gross margin', `${q0.grossMarginPct}%`, `${q1.grossMarginPct}%`, `+${Math.round((q1.grossMarginPct - q0.grossMarginPct) * 100)}bp`],
      ['Employee cost', n0(q0.employee), n0(q1.employee), g(q0.employee, q1.employee)],
      ['Other expenses', n0(q0.otherExp), n0(q1.otherExp), g(q0.otherExp, q1.otherExp)],
      ['EBITDA (before other income)', n0(q0.ebitda), n0(q1.ebitda), g(q0.ebitda, q1.ebitda)],
      ['  margin', `${q0.ebitdaMarginPct}%`, `${q1.ebitdaMarginPct}%`, `+${Math.round((q1.ebitdaMarginPct - q0.ebitdaMarginPct) * 100)}bp`],
      ['Other income', n0(q0.otherIncome), n0(q1.otherIncome), g(q0.otherIncome, q1.otherIncome)],
      ['Depreciation / finance cost', `${q0.dep} / ${q0.interest}`, `${q1.dep} / ${q1.interest}`, ''],
      { hl: true, cells: ['**Net profit**', `**${n0(q0.pat)}**`, `**${n0(q1.pat)}**`, `**${g(q0.pat, q1.pat)}**`] },
      ['EPS (₹)', n1(q0.eps), n1(q1.eps), g(q0.eps, q1.eps)],
      ['Memo: standalone revenue / PAT', '~804 / 204', `${Q1.revenueStandalone} / ${Q1.standalonePat}`, `+${Q1.revenueStandaloneGrowthPct}% / +${Q1.standalonePatGrowthPct}% (+${Q1.standalonePatExDividendGrowthPct}% ex the Biddle Sawyer dividend)`],
    ], source: 'Screener.in quarterly results (consolidated, results filed 3-Aug-2026); Q1FY27 deck (standalone); Motilal Oswal (3-Aug-2026)' } },
    { bullets: [
      `**Revenue beat.** Motilal Oswal had expected ₹880 cr (actual 7% higher). Of the 15% standalone growth, 4-5 points came from the fire-hit base; underlying growth was 9-10%, with ~4 points from innovation (7% of sales vs 4%). Volume +3-3.5%, price ~6%, the rest new introductions.`,
      '**Margin slightly below expectations.** EBITDA margin 31.6% (Motilal Oswal expected 32.6%): gross margin rose on price and mix, but GSK "deliberately" front-loaded promotion (3,800 doctor events, international speaker meetings) before the September-quarter peak season; operating expenses rose 36%. Management expects selling costs to normalise and the full-year margin to be "in 34% kind of range".',
      '**Brands and products.** Augmentin +12.8%, T-Bact +17.9%, Calpol +8.1%, Ceftum +7.6%; Shingrix +65% (₹100 cr+ a year); Nucala ~600 patients on treatment; oncology 263 patients in the quarter.',
      '**Since the quarter:** the FY26 dividend (₹57 a share, ₹966 cr) was paid in Aug-2026; MD Bhushan Akshikar was re-appointed (3-Aug-2026); the stock rallied to ₹3,106 (weekly close, 28-Aug) and closed at ₹2,769 on 30-Sep.',
    ] },
    { exhibit: { type: 'table', title: 'What management says about the future (Q4FY26 and Q1FY27 calls)', head: ['Statement'], rows: [
      ['"I don\'t generally give forward-looking guidance" (MD), but: base business to grow "anywhere between 8% to 10%"; general medicines "6% to 8%"; vaccines "strong high double-digit numbers"'],
      ['"This organization has to grow in the range of 12% to 13% annually over the next five years so that we can double the business ... to the point of becoming an INR8,000 crores business" (Feb-2026); "the 2x vision still remains intact" (Aug-2026)'],
      ['Innovation ("freshness index") 10-15% of sales targeted for FY27; ~20-25% over five to seven years'],
      ['Margins: "our objective will be to maintain the margins ... we would love to reinvest in the business"; FY27 EBITDA margin "in 34% kind of range" (CFO)'],
      ['Launches: Blenrep within two to three months (Q2 or Q3FY27); Arexvy authorised; bepirovirsen in three to four quarters'],
    ], source: 'Q3FY26 (9-Feb-2026), Q4FY26 (13-May-2026) and Q1FY27 (3-Aug-2026) call transcripts' } },
    { callout: '**Why it matters:** unlike some MNC subsidiaries, GSK India holds quarterly calls and discloses innovation\'s share of sales, so the debate is about delivery, not opacity. Management has promised double-digit growth for three years and delivered 7%, 8% and 2% (FY24-26). Q1FY27 is the first quarter that looks like the plan, flattered by the base. Q2FY27 (the peak acute season, a normal base) is the real test.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts and good cash conversion, but frequent one-offs and ₹719 cr of tax and legal provisions to watch',
  blocks: [
    { bullets: [
      '**One-offs are frequent and large.** In six of the last seven years exceptional items or discontinued operations moved EPS by more than 5%: a land gain and plant write-off (FY20), more write-offs (FY21), the ₹1,314 cr brand-sale profit (FY22), a voluntary retirement scheme (FY24), property gains (FY25-26). We value and forecast on EPS before them (FY26: ₹60.1 vs ₹61.2 reported).',
      `**Other income is ${Math.round(oi26.total / FY26.pbtBeforeExceptional * 100)}% of profit before tax** (FY26: ₹${n0(oi26.total)} cr, of which ₹${n0(treas26)} cr from deposits and liquid funds). Screener classifies the ₹${n0(oi26.mfGains)} cr of fund gains as exceptional; they are recurring treasury income and we treat them so.`,
      `**Labour codes.** The new labour codes added ₹${FY26.labourCodeCharge} cr to Q3FY26 employee costs, booked as an operating cost, not an exceptional item.`,
      `**Cash conversion.** Operating cash flow was ₹${n0(FY26.cfo)} cr in FY26 (${Math.round(FY26.cfo / FY26.pat * 100)}% of profit) after ₹${n0(FY26.taxesPaid)} cr of tax, lower than FY25's ₹1,290 cr because payables fell ₹139 cr and FY25 had benefited from low tax payments (₹82 cr). Before tax, cash from operations was 93% of EBITDA (Screener).`,
      `**Tax and legal provisions.** ₹${n0(PATCH.NONWC.taxLiab)} cr of current tax liabilities (net), provisions for an old price-control dispute (₹${n0(PATCH.NONWC.pricing)} cr) and indirect-tax matters (₹${n0(PATCH.NONWC.others)} cr): ₹${n0(PATCH.X)} cr net of tax assets, ~₹${n0(debtLikePs)} a share. Contingent liabilities not provided: ₹266 cr plus ₹248 cr of disputed income tax.`,
      '**Auditor:** Deloitte Haskins & Sells LLP, unmodified opinion; the only key audit matter is revenue cut-off. Sales are booked net of ₹401 cr of trade discounts and a ₹54 cr provision for expected returns.',
    ] },
    { callout: '**Accounting flag: GREEN.** The accounts are conventional and conservative: no debt, no capitalised development costs, no acquisitions, and exceptional items are disclosed separately. What needs reading is outside the operating line: the history of one-offs, the treasury share of profit (which falls if payouts rise or rates fall) and the provisions for long-running tax and pricing disputes.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `GSK plc owns ${OH.promoters.toFixed(2)}% through four companies: ${OH.promoterEntities}. That is the most a promoter may hold under the 25% minimum public shareholding rule, so the free float is ${OH.freeFloatPct}% (~₹${n0(X.mcap * OH.freeFloatPct / 100)} cr at the 30-Sep close). Indian institutions hold ${OH.diis}%, foreign portfolio investors ${OH.fiis}% and individuals and others ${OH.public}% (${n0(OH.shareholders)} shareholders, Jun-2026). There is no pledge.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns GSK India (Jun-2026)', head: ['Holder', 'Stake', 'Comment'], wide: [2], rows: [
    ['Glaxo Group Ltd, UK', '35.99%', 'GSK plc subsidiary (AR FY26 note 17)'],
    ['GlaxoSmithKline Pte Ltd, Singapore', '28.10%', 'GSK plc subsidiary'],
    ['Eskaylab Ltd, UK', '6.94%', 'GSK plc subsidiary'],
    ['Burroughs Wellcome International Ltd, UK', '3.97%', 'GSK plc subsidiary'],
    { hl: true, cells: ['**Promoter group**', `**${OH.promoters.toFixed(2)}%**`, 'At the 75% cap; unchanged for years'] },
    ['Domestic institutions (mutual funds, insurers)', `${OH.diis}%`, 'Down from 8.6% (Dec-2023)'],
    ['Foreign portfolio investors', `${OH.fiis}%`, 'Up from 2.9% (Dec-2023)'],
    ['Individuals and others', `${OH.public}%`, `${n0(OH.shareholders)} shareholders`],
  ], source: 'BSE shareholding pattern via Screener.in (Jun-2026); AR FY26 note 17' } },
  { callout: `**Liquidity: modest.** Average daily trading is ~₹24 cr (~US$2.7mn; Motilal Oswal), about 0.05% of the market value, so a ₹100 cr position is roughly four days of normal volume. The parent cannot buy more without a delisting offer or an open offer; with 75% held by one owner, the stock trades on domestic institutional and retail demand, and the late-August 2026 spike (₹2,600 to ₹3,106 on heavy volume, then back) shows how thin the float can be.` },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: an MNC subsidiary that communicates well and pays out, but a parent that decides strategy, assets and routing',
  blocks: [
    { p: 'GSK India is run by a team appointed through GSK\'s global structure: Managing Director Bhushan Akshikar (since 2022, re-appointed in Aug-2026; 15+ years at GSK after 15 at Johnson & Johnson) and CFO Ronojit Biswas (from 1-Apr-2026, succeeding Juby Chandy). At 31-Mar-2026 the board had seven members: the MD, four independent directors and two non-executive non-independent directors, Chairperson Renu Karnad and a GSK nominee; the CFO joined as a whole-time director in April. Glaxo Group has rights in the Articles of Association relating to board appointments. The company holds quarterly earnings calls, publishes transcripts and decks, and disclosed innovation\'s share of sales.' },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Evidence'], wide: [2], rows: [
      ['Control and board', 'AMBER', '75% parent control; 4 of 7 directors independent (Mar-26); non-independent chair with a non-retiring seat under the Articles'],
      ['Related parties', 'GREEN', 'No royalty disclosed; purchases from GSK Biologicals and GSK Pharma India Pvt Ltd disclosed; RPTs put to shareholders'],
      ['Asset transactions with the group', 'AMBER', 'Iodex/Ostocalcium sold to a GSK group company (₹1,649 cr, FY22), approved by minorities'],
      ['Disclosure and communication', 'GREEN', 'Quarterly calls, transcripts and decks; innovation % disclosed; no segment or brand revenue'],
      ['Capital allocation and minorities', 'AMBER', '89-99% payouts and specials; but ~₹890 cr written off on Vemgal (FY20-21)'],
      ['Accounts and audit', 'GREEN', 'Deloitte Haskins & Sells; unmodified opinion; key audit matter: revenue cut-off'],
      ['Management stability', 'GREEN', 'MD in place since 2022 and re-appointed; new CFO from within GSK (Apr-2026)'],
      ['Pay', 'AMBER', 'MD ₹8.27 cr (+19.6%) plus ₹3.10 cr of long-term incentives; 58.9x the median employee (median pay +8.6%)'],
    ], source: 'AR FY26 (board, corporate governance report, remuneration annexure, note 50); Q1FY27 deck; scanx.trade (3-Aug-2026)' } },
    { callout: '**Overall: AMBER.** Minority holders get the cash (high payouts, no royalty) and better communication than at many MNC subsidiaries. But they are passengers: GSK plc decides which products come to India and through which entity, how much to pay out, and whether to sell assets, and has used the listed company for large one-off transactions with group companies.' },
  ],
};

const SF = [['Motilal Oswal (3-Aug-26)', mosl], ['Nirmal Bang (29-Aug-25)', nb]];
const est = (s, k2, f) => (s?.[k2] ? Object.values(s[k2]).map(f).join(' / ') : '–');
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])}, ${Math.abs(Math.round((F.eps[1] / mosl.eps.FY28E - 1) * 100))}% below Motilal Oswal for FY28E; a little less growth, lower margins`,
  blocks: [
    { p: `We forecast revenue of ₹{{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} (+{{F.epsGrowth.0|pct}} / +{{F.epsGrowth.1|pct}} / +{{F.epsGrowth.2|pct}} on reported FY26 EPS of ₹61.2; +11% a year on EPS before one-offs of ₹60.1). Against Motilal Oswal, the only house with estimates standing on 30-Sep-2026 that we could read, we are ~1% lower on FY27E revenue and ~3% lower on FY28E, and lower on margin (34.5% vs 37.0% in FY28E): we take management's "hold margins and reinvest" at its word. That leaves our FY28E EPS ${Math.abs(Math.round((F.eps[1] / mosl.eps.FY28E - 1) * 100))}% below theirs (₹${n1(mosl.eps.FY28E)}). We found no consensus figure published by 30-Sep-2026.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', ...SF.map(s => s[0])], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ...SF.map(([, s]) => est(s, 'sales', n0))],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', ...SF.map(([, s]) => est(s, 'ebitda', n0))],
      ['EPS (₹)', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', ...SF.map(([, s]) => est(s, 'eps', n1))],
    ], source: 'GAM; Motilal Oswal results update (3-Aug-2026; FY27E / FY28E); Nirmal Bang monthly pick (29-Aug-2025; FY27E only, stale)' } },
    { exhibit: { type: 'column', title: 'FY27E-28E EPS: GAM below Motilal Oswal', unit: 'EPS (₹)', x: ['FY27E', 'FY28E'], series: [{ name: 'GAM', values: [Math.round(F.eps[0] * 10) / 10, Math.round(F.eps[1] * 10) / 10], fmt: 'n1' }, { name: 'Motilal Oswal', values: [mosl.eps.FY27E, mosl.eps.FY28E], fmt: 'n1' }], labels: 'all', source: 'Motilal Oswal (3-Aug-2026); GAM' } },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      [`${LBL.base} growth`, ...BL.growth.base.map(x => x + '%'), 'Management 8-10% (general medicines 6-8%, vaccines double digit); FY27 adds back ₹100 cr+ lost to the fire'],
      [`${LBL.innovation} growth`, ...BL.growth.innovation.map(x => x + '%'), '7% of sales in Q1FY27 vs 4%; Shingrix +65%; Blenrep, Arexvy launches'],
      ['Revenue growth', '{{F.salesGrowth.0|pct}}', '{{F.salesGrowth.1|pct}}', '{{F.salesGrowth.2|pct}}', 'Sum of the two (checked in GLAXO.ctx.js)'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'FY27 guided "34% kind of range"; launch reinvestment caps the rise'],
      ['Capex incl. leases (₹ cr)', ...AS.capex.map(n0), 'FY25-26 ₹23-55 cr plus lease additions'],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'FY26 26.3%, Q1FY27 ~26%'],
      ['Payout', ...AS.payout.map(t => t + '%'), 'FY23-26: 89-99% of EPS'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Opening treasury (cash, deposits, liquid funds; less leases in forecasts)', n0(TR.mar25.total), ...openCash.map(n0), 'FY26: Mar-25 treasury. FY27E: Mar-26 company ₹2,755 cr less ₹33 cr of leases; then the model\'s year-end net cash (after each year\'s dividend)'],
      ['Treasury yield on opening balance', `${yieldOpen26.toFixed(2)}%`, ...AS.treasuryYield.map(x => x.toFixed(2) + '%'), `Average-balance yield ${yieldAvg.FY24.toFixed(1)}% (FY24), ${yieldAvg.FY25.toFixed(1)}% (FY25), ${yieldAvg.FY26.toFixed(1)}% (FY26) as repo fell to 5.25%; FY27E opening still holds the ₹966 cr dividend paid in Aug-2026`],
      ['Treasury income (deposit interest + liquid-fund gains)', n0(treas26), ...oiTreas.map(n0), 'Yield × opening balance'],
      ['Other recurring income', n1(recur26), ...AS.otherIncome.map(n0), 'Other interest and miscellaneous (₹5.5 cr FY25, ₹9.6 cr FY26)'],
      ['Property gains (booked as exceptional)', '20.6', '0', '0', '0', 'Not forecast'],
      { hl: true, cells: ['**Total other income (model)**', `**${n0(oi26.total)}**`, ...F.otherIncome.map(v => `**${n0(v)}**`), `Twelve months to Jun-26: ₹${n0(ttmOi)} cr; Q1FY27 ₹44 cr (before the Aug-2026 dividend)`] },
    ], source: 'AR FY23-FY26 consolidated notes (cash, deposits, current investments, note 27); Screener.in quarterly schedules; RBI (5-Aug-2026); GAM (checked in GLAXO.ctx.js)' } },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
