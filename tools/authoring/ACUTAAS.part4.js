// Acutaas Chemicals report, part 4: moat, margins, earnings quality, capital allocation & returns, ownership, management and
// governance.
const X = require('./ACUTAAS.ctx');
const { C, D, A, F, AS, n0, n1, b, ai, SQ, Q1, FY26, OIN, divYield, ptEbitda, ptEps, MULT, cashPath, LINES } = X;
const MG = C.management, OW = D.ownership;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in process chemistry and in the darolutamide lock-in; weak in spread; unproven in the new businesses',
  blocks: [
    { p: 'A moat is a lasting advantage that lets a company earn more than its cost of capital for longer than rivals. Acutaas has two genuine ones and one big weakness. The first is chemistry: it makes hundreds of intermediates up to the step before the API, with 90%+ backward integration, and has won 50-90% shares in several molecules by entering early and doing difficult reactions cheaply. The second is regulatory lock-in on darolutamide: once an intermediate is in an innovator\'s approved process, switching suppliers takes years. The weakness is spread: one molecule now pays a large part of the bills, and the generic side competes on price with Indian and Chinese rivals. In batteries and semiconductors it has no record yet.' },
    { verdicts: D.moat.map(m => [m.factor, m.score, m.evidence, m.score]), head: ['Factor', 'Score', 'Evidence', 'Detail'], title: 'Moat scorecard: two strong, two moderate, one weak, one unproven', source: 'Corporate deck; AR FY26; PL initiation; calls; GAM Research' },
    { callout: '**Verdict:** a narrow moat, real but dated. The chemistry advantage explains why Acutaas earned ~20% margins on generic intermediates for years; the darolutamide lock-in explains the jump to 36%. The first is durable but modest; the second is strong but has an end date (2033-35) and sits with one customer. We would pay for the chemistry and for darolutamide\'s remaining patent life, not for a moat in batteries or chips that has not been shown.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: gross margin up 12 points in FY26 on CDMO mix; we model 35.5% falling to 34.5% as battery additives grow',
  blocks: [
    { p: `Acutaas's EBITDA margin was 17-24% from FY20 to FY25 and ${n1(A.ebitdaMargin[b])}% in FY26. The move is almost all gross margin (materials cost fell from 54.8% of sales in FY25 to 42.3% in FY26) as high-value darolutamide intermediates grew and low-margin generic products were dropped. Employee costs (8.8% of FY26 sales) and other costs (13.1%) are partly fixed, so quarters swing with revenue: 24.6% in Q1FY26, 42.4% in Q4FY26, ${Q1.ebitdaMarginPct}% in Q1FY27. Segment margins (CFO, unaudited): pharma ~44% and specialty ~29% in Q4FY26; ~36% and ~24% in Q1FY27. Management guides FY27 at a margin "similar" to FY26 because lower-margin battery revenue offsets CDMO growth.` },
    { pair: [
      { type: 'line', title: 'Quarterly margins: gross margin stepped up through FY26', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 70, source: 'Screener.in; company decks' },
      { type: 'column', title: 'Cost lines, % of revenue: materials down 12 points', unit: '% of revenue', x: ['FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Materials', values: [57.4, 54.8, 42.3, 42.1], fmt: 'pct' }, { name: 'Employees', values: [8.9, 8.4, 8.8, 12.0], fmt: 'pct' }, { name: 'Other costs', values: [15.8, 13.8, 13.1, 11.6], fmt: 'pct' }], labels: 'all', source: 'Screener.in expense schedules' },
    ] },
    { exhibit: { type: 'table', title: 'From FY26 to our FY29E margin: a mix build', head: ['Line', 'FY29E revenue (₹ cr)', 'Assumed EBITDA margin', 'Why'], wide: [3], rows: [
      ['Pharma intermediates (CDMO + generic)', n0(LINES.cdmo[2] + LINES.exCdmo[2]), '~38.5%', 'Q4FY26 44%, Q1FY27 36%; CDMO richer, generics leaner'],
      ['Battery additives', n0(LINES.battery[2]), '~15%', 'PL: ~15% at full use; HSIE 15-20%'],
      ['Semiconductor chemicals', n0(LINES.semis[2]), '~30%', 'BFC high-margin; Indichem in start-up'],
      ['Commodity & other', n0(LINES.commodity[2]), '~12%', '~10% historically (HSIE); new products better'],
      { hl: true, cells: ['**Blended (our FY29E)**', `**${n0(F.sales[2])}**`, '**{{F.ebitdaMargin.2|pct}}**', 'Build gives ~34%; FY27E {{F.ebitdaMargin.0|pct}}, FY28E {{F.ebitdaMargin.1|pct}}'] },
    ], source: 'CFO segment margins (calls); PL; HSIE; GAM estimates' } },
    { callout: `**Every point of margin** is ~₹${n0(ptEbitda)} cr of Sep-28E EBITDA, ~₹${n1(ptEps)} of EPS and ~₹${n0(ptEps * MULT.base)} a share at our ${MULT.base}x. The bigger swing is mix: if darolutamide volumes keep growing at Nubeqa's pace, margins stay near 36-40%; if they flatten while battery revenue grows, the group heads toward 30%.` },
  ],
};

const earnings = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audit and real cash, but FY26 profit had ₹32 cr of forex gains, cash conversion is ~60% of EBITDA, and acquisition accounting needs watching',
  blocks: [
    { p: `Maheshwari & Co., a mid-sized firm, audits Acutaas; we found no qualification. Operating cash flow was ₹${A.cfo[b]} cr in FY26 (${Math.round(A.cfo[b] / A.ebitda[b] * 100)}% of EBITDA) after ₹${A.cfo[ai('FY25')]} cr in FY25; over FY21-26 it was ₹${n0(X.cfo6)} cr against ₹${n0(['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].reduce((s, y) => s + A.pat[ai(y)], 0))} cr of attributable profit, because receivables and inventory grow with sales (credit terms of 90-360 days). Six items deserve attention.` },
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'Effect'], wide: [0, 1], rows: C.accounting.map(a => [a.item, a.effect]), source: 'AR FY26 (notes 27, 41, 43, 50, statement of changes in equity); Q4FY26 deck; Q4FY26 call' } },
    { exhibit: { type: 'table', title: 'Other income, FY25 and FY26 (₹ crore)', head: ['', 'FY25', 'FY26', 'Recurring?'], rows: [
      ['Interest income', n1(OIN.FY25.interest), n1(OIN.FY26.interest), 'Yes, with the cash balance'],
      ['Net forex gains', n1(OIN.FY25.forex), n1(OIN.FY26.forex), 'No: follows the rupee (Q1FY27 ₹0.1 cr)'],
      ['Asset sales, ECL reversal, other', n1(OIN.FY25.other), n1(OIN.FY26.assetSale + OIN.FY26.eclReversal), 'Small'],
      { hl: true, cells: ['**Total**', `**${n1(OIN.FY25.total)}**`, `**${n1(OIN.FY26.total)}**`, `${n1(OIN.FY26.total / FY26.pbt * 100)}% of FY26 PBT`] },
    ], source: 'AR FY26 consolidated note 27' } },
    { callout: '**Accounting flag: AMBER.** Nothing looks aggressive in revenue recognition or capitalisation, and tax is normal. But FY26 profit growth leaned on forex gains (₹32.5 cr vs ₹6.1 cr), the FY24 write-off and the Indichem goodwill show acquisitions that have not paid, and the pharma/specialty split and segment margins are management figures, not audited. We forecast no forex gains and treasury income at 3.5% on average net cash.' },
  ],
};

const capY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], sumY = key => capY.reduce((s, y) => s + (A[key][ai(y)] || 0), 0);
const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital allocation: ₹800 cr of equity raised, ~₹1,000 cr spent on plants and deals; ROCE ~32% in FY26, but working capital eats ~30% of sales',
  blocks: [
    { p: `In FY21-26 Acutaas generated ₹${n0(sumY('cfo'))} cr of operating cash flow and spent ₹${n0(sumY('capex'))} cr on capex (incl. the Indichem plant), plus ₹68 cr for 55% of BFC. It raised ~₹800 cr of equity (₹300 cr around the IPO, ₹37 cr in FY24, ₹499 cr in FY25) and ended FY26 with ₹198 cr of net cash. Return on capital employed was ${A.roce[b]}% in FY26 (Screener; the company's version excluding cash and CWIP: 39.3%) and ROE ${n1(A.roe[b])}%, up from 16-21% in FY23-25. Dividends are token: ₹2.50 a share for FY26 (~6% of EPS, ${n1(divYield)}% yield). Working capital (receivables + inventory − payables) was ₹440 cr at Mar-26, a third of sales, which is why only ~60% of EBITDA turned into operating cash.` },
    { pair: [
      { type: 'line', title: 'Returns: ROE back to 24%, core return on operating capital higher', unit: '%', x: 'fin.labels', from: 'FY21', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'Return on operating capital (ex cash)', ref: 'fin.coreRoce', fmt: 'pct' }], labels: 'last', min: 0, max: 50, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Where the cash went in FY21-26', unit: '₹ crore (six years)', x: ['Operating cash flow', 'Capex', 'BFC (55%)', 'Equity raised', 'Net debt → net cash'], series: [{ name: '₹ cr', values: [sumY('cfo'), -sumY('capex'), -68, 836, Math.round(-A.netDebt[b] + A.netDebt[ai('FY20')])], fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow; PL (BFC price)' },
    ] },
    { callout: `**Our view:** capital has been raised well (the QIP at ₹620 split-adjusted) and spent mostly on plants that now earn, but the acquisitions (US JV, BFC, the Indichem partner deal) have been poor value so far, and working capital is heavy. We forecast ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} as cash builds and new plants start; that is good but not exceptional for a stock on ~${Math.round(X.fwdNow)}x forward earnings.` },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The promoter group owned ${OW.promoters}% at Jun-2026, essentially the two founders: Naresh Patel 17.69% and Chetan Vaghasia 14.97% (Mar-2026). Each sold 13.49 lakh shares in FY26 (Jun-2025), cutting the group from 35.96% to 32.66%; nothing is pledged. Foreign investors own ${OW.fiis}% (Norway's Government Pension Fund Global 3.5%, Vanguard funds 1.8%, Singapore's GIC 0.8%), domestic institutions ${OW.diis}% (mutual funds ${OW.mutualFunds}%: Kotak Multicap 1.8%, SBI Healthcare Opportunities 1.1%) and ~${n0(OW.shareholders)} others ${OW.public}%, including one individual, Dhwani Chovatia, with 3.35%. Free float is ~67%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', '% of shares', 'As of'], rows: OW.named.map(h => [h.holder, `${h.pct}%`, h.asOf]), source: 'AR FY26 Corporate Governance Report (shareholding, top ten, directors\' holdings); Screener shareholding (Jun-2026)' } },
  { callout: '**Our read:** a widely held stock with low promoter ownership for an Indian mid-cap. The founders have been net sellers (in the IPO and in Jun-2025) while institutions bought; that is not a red flag on its own, but it means the founders\' economic interest is ~33%, not a majority, and further sales are possible after a 6x rise in the share price since the QIP.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: founder-run with a decent record; half-independent board, an executive chairman, modest pay, small related-party trades; partner deals to watch',
  blocks: [
    { p: `Acutaas is run by founder Naresh Patel (Chairman & MD), with co-founder Chetan Vaghasia and two other whole-time directors (Virendra Nath Mishra, Ram Mohan Lokhande); Abhishek Patel (President, Strategy) leads investor communication and Bhavin Shah is CFO. The board has eight directors, four of them independent (Girikrishna Maniar, Hetal Gandhi, Richa Goyal, Dr Anita Bandyopadhyay), with an executive chairman. The four executive directors were paid ₹16.7 cr in FY26 (₹6.4 cr each for the two founders), ~3.5% of pre-tax profit.` },
    { verdicts: [
      ['Founders and succession', 'Moderate', 'Founder-CMD since 2004; Abhishek Patel runs strategy and the calls; no named succession plan', 'Continuity high; key-person risk'],
      ['Board independence', 'Moderate', '4 of 8 independent with an executive chairman (the legal minimum); two independents hold many other boards', 'Adequate, not strong'],
      ['Audit', 'Moderate', 'Maheshwari & Co. (FRN 105834W), a mid-sized firm, for a ₹27,000 cr company', 'No qualification found'],
      ['Related parties', 'Strong', 'Purchases of ₹1.6 cr from firms linked to KMP relatives; no loans or guarantees to promoters found', 'Small'],
      ['Partner deals', 'Weak', 'Korean partner got 25% of Indichem for no cash (₹47.5 cr goodwill); ARZ got 10% of the battery subsidiary for business development; BFC partner keeps 45%', 'Value leaks to partners in the new businesses'],
      ['Promoter selling', 'Moderate', 'Promoter shares sold in the 2021 IPO and 3.3% in Jun-2025', 'Founders\' stake now ~33%'],
      ['Pay', 'Strong', '₹16.7 cr for four executive directors (~3.5% of PBT)', 'Reasonable for the profits'],
      ['Disclosure', 'Weak', 'No customer concentration note; refuses to split CDMO from generic revenue; segment margins only on calls', 'Investors cannot track the key molecule'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (Corporate Governance Report, notes 42, 50); calls; GAM Research' },
    { callout: '**Overall: AMBER.** We see no sign of minority abuse, pay is moderate and related-party trading is small. The issues are disclosure (the darolutamide dependence is not quantified by the company) and the habit of giving partners equity in new ventures for no cash, plus continued founder selling. None changes our valuation, but each lowers our confidence in what is not disclosed.' },
  ],
};

module.exports = { moat, margins, earnings, capital, ownership, governance };
