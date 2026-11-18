// GNFC report, part B: merges GNFC.part2-6.js (built on GNFC.ctx.js) and adds the cover, verdict,
// glossary and statement notes. Written as of 30-Sep-2026 (Q1FY27 basis). Prose numbers come from
// research/company.json, deep.json, segments.json and the built model; forecast and valuation figures
// are live tokens ({{...}}) that follow assumptions.json.
const X = require('./GNFC.ctx');
const P2 = require('./GNFC.part2'), P3 = require('./GNFC.part3'), P4 = require('./GNFC.part4'), P5 = require('./GNFC.part5'), P6 = require('./GNFC.part6');
const { F, V, A, n0, n1, price, sh, rating, buyBelow, sellAbove, ruleText, FM, peMult, epsSep28, treasury26, tps, sectorDrPe, mv, Q1, A26, b, impliedOpsPe } = X;

const cover = {
  headline: 'A war windfall priced as if it will last: initiate with SELL',
  lead: `GNFC is India's only TDI maker and a debt-free state company with ~₹${n0(treasury26)} cr of treasury (₹${n0(tps(treasury26))} a share). Since the US-Iran war began in late February 2026, chemical prices have spiked: chemicals EBIT was ₹463 cr in Q4FY26 and ₹${n0(Q1.segments.chem[1])} cr in Q1FY27, against ~₹150 cr a quarter before, and the stock is up ~65% from its March low. We think most of that is a windfall: GNFC itself says global TDI capacity exceeds demand and that the war "can go either side". We value GNFC the way the street does, on **P/E of Sep-28E earnings**, at **${peMult}x** (its own ${n1(FM.median)}x ex-trough forward median cut by the ${Math.abs(Math.round(sectorDrPe))}% sector de-rating). That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** The cash is real, but the market has never given GNFC full credit for it, and the state decides how it is spent. Bull case {{scen.bull.tp|inr}} (the war premium lasts into FY28); bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The war is doing the work', p: `TDI rose from ₹168k a tonne (Q3FY26) to ₹255k (Q1FY27) and every spread GNFC tracks widened. The same war lifted fuel oil (+76% QoQ) and gas (+64%) costs and forced acetic acid, ethyl acetate and part of TDI to shut. Chemicals margin was 13% in the nine months before the war and 27-31% since. We assume it fades to 16-17%.` },
    { h: 'Strip out the war and earnings are flat', p: `Our Sep-28E EPS of ₹${n1(epsSep28)} equals FY26's ₹${n1(A.eps[b])} and is well below the TTM ₹${n1(A.ttm.eps)}. New ammonium nitrate and nitric acid capacity (mid-2027) and a coal-fired steam plant help; prices normalising, a planned April-2027 shutdown and lower treasury income hurt. FY24-25 EPS was ₹34-41.` },
    { h: 'Fertilisers still lose money', p: `The segment lost ₹${n0(-A26.fertEbit)} cr in FY26 and ₹85 cr in Q1FY27. A higher urea energy norm adds ~₹49 cr a year (plus ~₹61 cr of arrears in Q2FY27), but the fixed-cost revision has not come and management sees "almost no chance" of urea profits without it. We model losses of ₹120-150 cr a year.` },
    { h: 'The cash is real, but it is not yours', p: `₹2,410 cr of the treasury is lent to a state finance company at ~7.25%; a ₹7,000-8,000 cr BPA/phenol idea is under study; GNFC has had four MDs since Feb-2025. At ₹${n0(price)} the market pays ${n1(impliedOpsPe)}x operating earnings net of cash; at the March-2026 low it paid almost nothing. Our DCF (₹${n0(mv('dcf').value)}) is the value only if the cash came back to shareholders.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): chemical margins after the July shutdowns, the ~₹61 cr energy-norm arrears and how much of the Q1 inventory was sold at war-time prices.',
    'The Middle East conflict and oil (Brent ~US$103 on 29-Sep-2026): a ceasefire would cut both GNFC\'s prices and its fuel costs, and probably the former faster.',
    'Rabi 2026-27 NBS rates (not announced by 30-Sep-2026) and any urea fixed-cost revision.',
    'Board decision on BPA, polyols and the 350 KTPA acetic acid plant, expected by end-2026.',
    'WNA-III, AN melt-II and the ammonia loop around mid-2027; planned Bharuch shutdown in April 2027; China/Japan/Korea TDI anti-dumping duty expires in September 2027.',
  ],
};

// ---------------------------------------------------------------- Verdict
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a decent business at a war-time price',
  blocks: [
    { callout: '**What you are buying:** India\'s only TDI plant (~60% of the market) inside an integrated, debt-free Gujarat chemical complex, a loss-making regulated urea and ANP business, a small IT division, ₹5,200 cr of treasury and ₹2,800 cr of sensible brownfield projects that add ammonium nitrate capacity from mid-2027. All run by rotating state-appointed managers.' },
    { callout: `**What you are paying:** ₹${n0(price)}, or ${n1(price / A.ttm.eps)}x war-time TTM EPS but ${n1(price / epsSep28)}x our Sep-28E EPS, against an ${n1(FM.median)}x ex-trough history. On the street's method and our numbers the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD) or ~₹${n0(buyBelow)} (BUY) on our target`, 'Medium', 'The stock was ₹365 in March 2026'],
      ['War premium lasts into FY28 (our bull case)', 'Low-medium', 'TDI above ₹230k/t and AN prices holding after any ceasefire; Chinese TDI exports'],
      ['Cash returned: a second buyback or a higher payout', 'Low', 'Board decisions after the projects; management said in May-2026 nothing was "in the pipeline"'],
      ['Urea fixed-cost revision', 'Medium', 'DoF notification; each ₹50 cr of relief is ~₹2.6 of EPS'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Risks to our SELL (upside) and what would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Upside: chemical prices stay at Q1FY27 levels for another year', 'Medium', 'FY28E EPS ₹70+; bull case {{scen.bull.tp|inr}}'],
      ['Upside: the market keeps valuing GNFC on TTM earnings', 'Medium', `At 8.5x TTM EPS of ₹${n1(A.ttm.eps)} the stock is "fair" at today's price`],
      ['Downside: ceasefire; Chinese TDI and acetic acid flood Asia again', 'Medium', 'Margins back to FY24-25; bear case {{scen.bear.tp|inr}}'],
      ['Downside: ₹7,000-8,000 cr BPA/phenol project approved', 'Medium', 'Treasury consumed; returns uncertain against Chinese and new Indian phenol capacity'],
      ['Downside: China/Japan/Korea TDI duty lapses in Sep-2027', 'Low-medium', 'Lower Indian TDI prices in FY28-29'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn neutral below ~₹${n0(sellAbove)}** and buyers below ~₹${n0(buyBelow)} on today's numbers, or sooner on evidence that the war premium is lasting (our bull case) or that cash is coming back to shareholders.`,
      `**Biggest swing factor:** the chemicals margin. Each 1 point is ~₹${n0(F.seg.chem.revenue[1] / 100)} cr of EBIT in FY28E, ~₹${n1(F.seg.chem.revenue[1] / 100 * 0.748 / sh)} of EPS and ~₹${n0(F.seg.chem.revenue[1] / 100 * 0.748 / sh * peMult)} a share at ${peMult}x.`,
      '**Why not HOLD on the cash?** Because the treasury has been building for five years and the market has rarely paid for it (ex-trough, the operations have traded at ~2x EBITDA net of cash); our P/E derivation already reflects that history.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'TDI price, Q1FY27', v: '₹255k/t', d: '₹168k/t in Q3FY26' },
      { k: 'Chemicals EBIT margin', v: '27.1%', d: '13.2% in 9MFY26' },
      { k: 'Treasury per share', v: `₹${n0(tps(treasury26))}`, d: '₹2,410 cr with a state finance company' },
      { k: 'Sep-28E EPS', v: `₹${n1(epsSep28)}`, d: `TTM ₹${n1(A.ttm.eps)}; FY26 ₹${n1(A.eps[b])}` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

// ---------------------------------------------------------------- Glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['TDI (toluene di-isocyanate)', 'A chemical made from toluene and nitric acid, used to make flexible polyurethane foam (mattresses, furniture, car seats) and coatings.'],
      ['Aniline / nitrobenzene', 'Made from benzene and nitric acid; used for MDI (rigid foam), rubber chemicals and dyes.'],
      ['Acetic acid / ethyl acetate', 'Acetic acid is made from methanol and carbon monoxide ("carbonylation"); ethyl acetate is a solvent made from it.'],
      ['WNA / CNA', 'Weak and concentrated nitric acid, made from ammonia; inputs for TDI, aniline and ammonium nitrate.'],
      ['AN melt', 'Ammonium nitrate solution, mainly for mining explosives.'],
      ['TGU / DEF', 'Technical-grade urea; used to make diesel exhaust fluid (DEF) for BS6 trucks, plywood resins and cattle feed.'],
      ['Neem-coated urea (NCU)', 'Fertiliser urea coated with neem oil; sold at a government-fixed price.'],
      ['ANP (20:20:0)', 'Ammonium nitro-phosphate: a fertiliser with 20% nitrogen and 20% phosphate.'],
      ['New Urea Policy / NIP', 'The government schemes that pay urea makers a normative cost (gas, energy up to a norm, fixed costs) above the fixed farm price.'],
      ['Energy norm (Gcal/t)', 'The energy per tonne of urea the government reimburses; energy used above it is the producer\'s loss.'],
      ['NBS (Nutrient Based Subsidy)', 'A per-kg subsidy on N, P, K and S for complex fertilisers such as ANP, reset each Kharif (Apr-Sep) and Rabi (Oct-Mar) season.'],
      ['Import parity', 'The landed price of imports (world price + freight + duties); GNFC prices its chemicals off it.'],
      ['Anti-dumping duty (ADD)', 'An extra import duty on goods sold below fair value; India levies it on TDI from the EU, Saudi Arabia, China, Japan and Korea.'],
      ['ICD / GSFS', 'Inter-corporate deposit: a loan to another company. GSFS = Gujarat State Financial Services, a state finance company.'],
      ['CCPP', 'GNFC\'s coal-based captive steam and power plant at Dahej, replacing gas for TDI-II.'],
      ['Segment result', 'Segment profit before interest, unallocated items and tax (EBIT), including other income booked in the segment.'],
      ['Treasury', 'Cash, deposits, ICDs, G-secs and equity investments, less borrowings.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['P/E, EV/EBITDA, DCF', 'Price ÷ EPS; enterprise value (market value less net treasury) ÷ EBITDA; discounted cash flow value.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.chemicals, P4.fertilisers, P4.projects, P4.moat, p.financials, p.capital, P4.quality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, risks, p.statements, glossary],
  statementNotes: {
    'pat@FY18': '+50%: EBITDA nearly quadrupled; interest halved as debt was repaid.',
    'sales@FY22': '+69%: post-COVID chemical boom; Chinese supply disrupted.',
    'ebitdaMargin@FY22': 'Record 28%: chemicals EBIT ₹2,263 cr (37% margin).',
    'pat@FY22': 'Record ₹1,710 cr; EPS ₹110.',
    'sales@FY23': '+18%: high gas prices raised urea subsidy revenue; chemical prices still high.',
    'sales@FY24': '−22%: Chinese oversupply; TDI, aniline and acetic acid prices fell.',
    'pat@FY24': '−66%: chemicals EBIT ₹543 cr; fertiliser loss ₹244 cr; buyback in Dec-2023.',
    'ebitdaMargin@FY25': '8%: TDI-II shut four months (~₹100 cr of profit lost).',
    'pat@FY26': '+35%: lower input costs and the war-time Q4 (₹396 cr); ~₹80 cr of one-offs.',
    'cfo@FY24': 'Only ₹31 cr: working capital and tax.',
    'capex@FY26': '₹546 cr: CCPP, WNA-III and AN melt-II under way.',
    'opm@Q1FY26': '1.9%: Bharuch turnaround (~₹375 cr revenue, ~₹148 cr PBT lost).',
    'pat@Q4FY26': '₹396 cr: war lifted TDI, AN and TGU prices; ~₹30 cr one-offs.',
    'pat@Q1FY27': '₹312 cr: record prices despite plants shut for viability; fertiliser loss ₹85 cr.',
    'pat@FY27E': 'GAM: Q1 war prices, ~₹15 EPS a quarter after; ~₹61 cr energy arrears.',
    'pat@FY28E': 'GAM: prices normalise; April-2027 shutdown; lower treasury income.',
    'pat@FY29E': 'GAM: first full year of AN melt-II and WNA-III.',
    'capex@FY27E': 'GAM: ₹1,600 cr (guided ₹1,500-1,800 cr).',
  },
};
