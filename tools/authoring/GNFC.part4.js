// GNFC report, part B-4: fertilisers (policy), projects & capex, moat, earnings quality.
const X = require('./GNFC.ctx');
const { C, SA, SQ, QL, FYS, A26, A25, Q1, n0, n1, SRC, F, AS, sep28, A } = X;
const fy = SA.map(a => a.fy);

// ---------------------------------------------------------------- Fertilisers
const fertilisers = {
  id: 'fertilisers', nav: 'Fertilisers: the drag', kicker: 'Segment', title: 'Fertilisers: regulated, loss-making for six years, waiting on Delhi',
  blocks: [
    { p: `GNFC makes neem-coated urea (reassessed capacity 637 kt; ~620 kt sold in FY26) and ANP, a 20:20:0 nitrogen-phosphate fertiliser (172,995 t). Neither price is set by the market. Urea sells at a fixed farm price and the government pays the rest of a "normative" cost under the New Urea Policy: gas at the pooled price, energy up to a plant-specific norm (Gcal per tonne) and a fixed-cost element. ANP gets a per-kg Nutrient Based Subsidy (NBS) set each season. In FY26 the segment had revenue of ₹${n0(A26.fertRev)} cr, including ₹1,982 cr of subsidy, and lost ₹${n0(-A26.fertEbit)} cr: about ₹147 cr on urea and ₹40 cr on ANP.` },
    { pair: [
      { type: 'column', title: 'Fertiliser losses in every year since FY21', unit: 'Fertiliser segment result (₹ crore)', x: fy, series: [{ name: 'Fertilisers EBIT', values: SA.map(a => Math.round(a.fertEbit)), fmt: 'num' }], labels: 'all', source: 'GNFC annual reports' },
      { type: 'column', title: 'Quarterly: Q1 is the worst quarter; Q1FY27 −₹85 cr', unit: 'Fertiliser segment result (₹ crore)', x: QL, series: [{ name: 'Fertilisers EBIT', values: SQ.map(q => q.fertEbit), fmt: 'num' }], labels: 'all', source: 'GNFC investor decks' },
    ] },
    { exhibit: { type: 'table', title: 'Policy levers and where they stood on 30-Sep-2026', head: ['Lever', 'What happened', 'Effect on GNFC'], wide: [1, 2], rows: [
      ['Urea energy norm', 'Raised from 6.20 to 6.37 Gcal/t for 1-Apr-2025 to 31-Mar-2028 (DoF notification, 30-Jun-2026)', '~₹61 cr for Apr-25 to Jun-26, booked in Q2FY27; ~₹49 cr a year after'],
      ['Urea fixed cost', 'Revision "pursued with the Government at industry level"; no decision', 'The main reason urea loses money; not in our base case'],
      ['NBS, Kharif 2026 (Apr-Sep)', 'N ₹47.32/kg, P ₹52.76/kg (Rabi 2025-26: ₹43.02 / ₹47.96); outlay ₹41,534 cr (+12%) (8-Apr-2026)', 'ANP subsidy ~₹20,016/t vs ₹18,196/t (+10%), against higher ammonia and phosphoric acid costs'],
      ['NBS, Rabi 2026-27 (Oct-Mar)', 'Not announced by 30-Sep-2026', 'Unknown; we assume similar rates'],
      ['Subsidy budget, FY27', '~₹1.71 lakh cr (urea ~₹1.16 lakh cr, NBS ~₹0.54 lakh cr)', 'Adequate budgets keep subsidy receivables low (₹496 cr at Mar-26)'],
      ['New urea investment policy', 'Reported as under preparation (May-2026 call)', 'Management would compare it with unregulated chemical projects'],
    ], source: 'Q1FY27 deck p4 and call; Q4FY26 call; Free Press Journal (8-Apr-2026); AR FY26 MD&A' } },
    { callout: `**Our view:** we model a loss of ₹${n0(-F.seg.fert.adjEbitda[0])} cr in FY27E (including the ~₹61 cr energy arrears), ₹${n0(-F.seg.fert.adjEbitda[1])} cr in FY28E and ₹${n0(-F.seg.fert.adjEbitda[2])} cr in FY29E (−5.0% / −4.5% / −4.0% of revenue). A fixed-cost revision is the upside (our bull case halves the loss); a war-driven gas squeeze or a weak Rabi NBS is the downside. Management's own line, May-2026: until norms are revised "we see almost no chance in case of urea".` },
  ],
};

// ---------------------------------------------------------------- Projects & capex
const projects = {
  id: 'projects', nav: 'Projects & capex', kicker: 'Projects', title: 'Projects: ₹2,800 cr of sensible brownfield capex, and a much bigger idea on the table',
  blocks: [
    { p: 'For the first time since TDI-II, GNFC is spending real money. Four projects worth ~₹2,800 cr were under way at Q1FY27, of which ~₹1,300 cr had been spent; the company expects ₹1,500-1,800 cr of capex in FY27 and the remaining ~₹1,500 cr "over the next 2 years", plus a ₹480-500 cr boiler. All four are brownfield, built on GNFC\'s own ammonia and nitric acid, and sell into a market India imports (ammonium nitrate). Management\'s rough guide: +₹1,200-1,500 cr of revenue and +₹500-600 cr of contribution (revenue less variable costs) "at current prognosis", i.e. at war-time prices.' },
    { exhibit: { type: 'table', title: 'Projects (as stated by Sep-2026)', head: ['Project', 'Capacity', 'Capex (₹ cr)', 'Timing / purpose'], wide: [3], rows: C.projects, source: 'Q1FY27 deck p11 and call; Feb-2026 and Nov-2025 calls' } },
    { pair: [
      { type: 'column', title: 'Capex: from ~₹200 cr a year to ₹1,600 cr', unit: 'Capex (₹ crore)', x: 'fin.labels', from: 'FY19', series: [{ name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'all', source: 'Company; GAM Research estimates (FY27-29E)' },
      { type: 'column', title: 'Treasury dips as capex is paid, then rebuilds', unit: 'Treasury at year-end (₹ crore; FY27-29E net of debt)', x: ['FY25', 'FY26', ...F.years], series: [{ name: 'Treasury', values: [5051, Math.round(X.treasury26), ...F.treasury.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'AR FY25-26 (incl. ICDs); GAM Research estimates' },
    ] },
    { bullets: [
      '**Under consideration:** BPA (150 KTPA) and polyols (100 KTPA) at Dahej, and a 350 KTPA acetic acid plant at Bharuch (INEOS licensing instead of the earlier JV idea). In Nov-2025 the CFO put BPA plus an upstream phenol plant at "roughly ₹7,000-8,000 cr". Decisions are expected by the end of 2026.',
      '**Kearney:** the consultant identified ₹260-300 cr of yearly savings; by Feb-2026 only ₹5-7 cr had been realised, and management has not signed off a number. We include none of it beyond the CCPP.',
      '**GMDC:** an MoU for underground coal gasification is at study stage; no capex attached yet.',
    ] },
    { callout: `**Our view:** we include the ₹2,800 cr list and the boiler (capex ₹${n0(AS.capex[0])} / ${n0(AS.capex[1])} / ${n0(AS.capex[2])} cr in FY27-29E) and about ₹1,000 cr of extra chemicals revenue by FY29, a haircut to management's war-price estimate. We do not model BPA or phenol: at ₹7,000-8,000 cr it would absorb all the treasury and more, in a product (phenol/BPA) where Indian capacity is being added by others and Chinese supply sets the price. If approved, it is the single biggest risk to the cash that supports today's share price.` },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a protected TDI position, no pricing power',
  blocks: [
    { verdicts: [
      ['TDI position in India', 'Advantage', 'Only producer in South Asia; ~60% of Indian demand; anti-dumping duties of US$102-440/t on imports.', 'Gives GNFC first call on Indian buyers, at import-parity prices.'],
      ['Pricing power', 'Disadvantage', 'Prices are set at import parity every one to three months; Chinese capacity and the rupee decide them.', 'Margins follow the cycle: 12% to 37% chemicals EBIT in five years.'],
      ['Cost and scale vs China', 'Disadvantage', 'Chinese TDI, aniline and acetic acid plants are several times larger and coal-based; TDI-II has not covered its fixed costs at FY25-26 prices.', 'The CCPP helps; scale cannot be fixed.'],
      ['Integration on one site', 'Advantage', 'Own ammonia, nitric acids, CNA, syngas and power; fuel flexibility across oil, gas and coal.', 'Lets GNFC switch products as spreads move (e.g. TGU in Mar-2026).'],
      ['Fertilisers', 'Disadvantage', 'Regulated returns; fixed costs and energy norms lag reality; loss every year since FY21.', 'A drag, not a moat.'],
      ['Balance sheet', 'Advantage', '~₹5,200 cr treasury, no debt.', 'Survives any downturn; the state decides how the cash is used.'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** GNFC has a protected position in Indian TDI and the advantages of an integrated, debt-free complex, but no moat that protects profits. It is a price-taker against much larger Chinese producers in every chemical it sells, and its fertiliser business earns whatever the government allows. Pre-tax returns on operating capital of ~15% in FY26 (helped by the war) and ~6-9% in FY24-25 are the evidence.' },
  ],
};

// ---------------------------------------------------------------- Earnings quality
const q = C.fy26.otherIncomeNote;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean books, but other income is half of pre-tax profit',
  blocks: [
    { bullets: [
      `**Other income is half of pre-tax profit.** FY26 other income was ₹${n0(q.total)} cr against PBT of ₹1,065 cr: interest ₹${n0(q.interest)} cr, dividends ₹${n0(q.dividend)} cr, a non-cash government grant amortisation ₹${n0(q.grant)} cr (the deferred ASGP grant, ₹455 cr left), insurance ₹${n0(q.insurance)} cr, FX ₹${n0(q.fxGain)} cr and miscellaneous ₹${n0(q.misc)} cr. In FY24 and FY25 other income was 72% and 63% of PBT.`,
      '**One-offs every year.** Management counted ~₹80 cr of one-time income in FY26 (insurance, urea freight escalation, catalyst-dust sale, a penalty from the CCPP contractor) and ~₹38 cr in FY25. FY27 will include ~₹61 cr of energy-norm arrears for FY26 and Q1FY27.',
      '**Subsidy accounting.** Urea subsidy is booked on estimates of the normative cost and trued up later ("escalation/de-escalation"): +₹8 cr for earlier years in FY26, −₹35 cr in FY25.',
      '**Inventory timing.** In Q1FY27 production ran ahead of sales at record prices; ~15% of that stock was sold by end-July at "mixed" realisations.',
      '**Treasury classification.** ₹2,410 cr of ICDs with a state finance company sit in "loans and advances", so Screener\'s cash line understates treasury by that amount.',
      '**Audit.** Suresh Surana & Associates (statutory) and K. G. Goyal (cost); clean opinions; simple structure (one associate, no subsidiaries of size).',
    ] },
    { callout: '**Accounting flag: GREEN, with a quality caveat.** We found nothing aggressive. But headline EPS mixes three things: chemical spreads, treasury income and one-offs. Our estimates strip one-offs from other income (₹112 cr a year of non-treasury income, mostly the grant) and grow treasury income only with the cash balance.' },
  ],
};

module.exports = { fertilisers, projects, moat, quality };
