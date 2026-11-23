// Mahindra & Mahindra report, part B: cover, verdict, glossary, statement notes, and the merger of part2-6. Shared
// inputs in M&M.ctx.js / ctx2 / ctx3. Forecast and valuation figures are live tokens where the engine has them.
// Written as of 30-Sep-2026 (Q1FY27 basis).
const X = require('./M&M.ctx3');
const { n0, n1, price, sh, SB, SOTP, MULT, DISC, coreMed, coreNow, derate, rating, buyBelow, sellAbove, ruleText, listedPs, subsPs, dcfAdj, evAdj, tpMean, ST, SENS, coreEps, c28 } = X;
const P2 = require('./M&M.part2'), P3 = require('./M&M.part3'), P4 = require('./M&M.part4'), P5 = require('./M&M.part5'), P6 = require('./M&M.part6');
const tpLo = Math.min(...ST.map(s => s.tp)), tpHi = Math.max(...ST.map(s => s.tp));

const cover = {
  headline: 'A great franchise priced for a re-rating that its own history does not support: SELL',
  lead: `M&M is India's No.1 SUV maker by revenue (25% share), its largest tractor maker (44%) and the leader in small pickups (52%); it also owns 25% of Tech Mahindra, 52% of M&M Finance and 92% of its electric-SUV company, MEAL. The business has never been better run: standalone revenue tripled in five years and ROE is above 20%. But growth is slowing (we forecast EPS +{{F.epsGrowth.0|n1}}% in FY27 after +32% in FY26), a weak monsoon (87% of normal) threatens the tractor cycle, and EVs made for MEAL dilute margins. The street values M&M on a **sum of the parts**, and so do we: the auto and farm business at ${MULT.base}x Sep-28E core EPS (M&M's own median since 2021, ${n1(coreMed)}x, cut ${Math.abs(derate).toFixed(1)}% for the sector's de-rating) plus the stakes (listed at the 30-Sep price, unlisted at cost) less a ${DISC.base}% holding discount. **That gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Every broker we found rates it Buy or Hold (₹${n0(tpLo)}-${n0(tpHi)}). Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The franchise is excellent, and capacity will double', p: 'SUV revenue share 25%, e-SUV revenue share 44%, LCV <3.5T share 52%, tractor share 44.9% in Q1FY27. SUV capacity goes from 64.5k units a month at FY26 exit to 92k by FY28 and ~130k by FY31 (Nagpur). Management says demand, not supply, is the constraint today. We model domestic UVs +16% in FY27 and tractors +4%.' },
    { h: 'But profit growth is slowing to ~13% a year', p: 'Q1FY27 core EBITDA margin fell to 12.2% (14.3% a year earlier) on 400-500bp of commodity inflation. Price increases (1.5% + 2.7%) help, but e-SUVs built for MEAL at a ~0.4% margin rise from 11% to ~20% of auto revenue, tractors face a weak-monsoon year, and capex doubles. We forecast EBITDA margins of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS of {{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} for FY27-29E.' },
    { h: 'The stock still prices the 2024-25 re-rating', p: `Strip out the stakes and M&M's core business traded at 8-12x forward earnings in 2021-23 and 18-21x in 2024-25. Today it is ${n1(coreNow)}x FY28E, above the ${n1(coreMed)}x median since 2021, while auto-OEM peers trade ${Math.abs(derate).toFixed(1)}% below their own five-year medians. The street's 22-26x multiples assume the re-rating is permanent; our rule does not.` },
    { h: 'The stakes are a cushion, not hidden upside', p: `Listed stakes are worth ₹${n0(listedPs)} a share at the 30-Sep prices (Tech Mahindra ₹${n0(SB.parts.find(p => p.key === 'TECHM').gross / sh)}, M&M Finance ₹${n0(SB.parts.find(p => p.key === 'M&MFIN').gross / sh)}); with MEAL and other unlisted companies at cost the stakes add ₹${n0(subsPs)} gross, ₹${n0(SB.subsNet / sh)} after a ${DISC.base}% discount. MEAL's investors converted at ~₹40,400 cr in May-2026, half the ₹80,580 cr headline of 2023; valuing MEAL there adds only ~₹${n0(SENS[4].v - SB.perShare)} a share.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'STRONG' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether auto margins recover from 12.2% as guided; tractor margins under steel and rubber inflation.',
    'Festive season (Navratri from 11-October 2026) and rabi sowing after a monsoon at 87% of normal: the first read on tractor demand for H2FY27 and FY28.',
    'Commodities and West Asia: every 100bp of standalone EBITDA margin is ~₹1,970 cr of FY28E EBITDA, ~7% of EPS.',
    'Capacity: 68k SUVs a month from September 2026, 82k by March 2027; first NU_IQ and new INGLO models in FY28.',
    'Group: truck and bus sale to SML (₹525 cr, FY27), Last Mile Mobility listing targeted for calendar 2027, MEAL investors\' exit window from November 2027.',
  ],
};

const verdict = {
  id: 'verdict', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: own the business, not at this price',
  blocks: [
    { callout: `**What you are buying:** India's best-placed SUV and tractor maker, with net cash of ~₹31,000 cr, capacity doubling by FY31 and the e-SUV lead; plus ₹${n0(subsPs)} a share of group companies (Tech Mahindra and M&M Finance are ${n0((SB.parts.find(p => p.key === 'TECHM').gross + SB.parts.find(p => p.key === 'M&MFIN').gross) / SB.subsGross * 100)}% of it). Management has a credible record since 2021: exits from loss-makers, ROE above 20%.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(coreNow)}x FY28E core earnings after deducting the stakes, against ${n1(coreMed)}x over five years; the whole company is {{V.pe.current|x}} trailing standalone earnings. EPS growth of ~13% a year from here does not need a 22-26x multiple. Our sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD on our target) or ~₹${n0(buyBelow)} (BUY)`, 'Medium', 'A sector sell-off that takes the core multiple back to its median'],
      ['Margins back to 14%+ in H2FY27', 'Medium', `Commodities easing and the July price increase sticking: each 100bp is ~₹${n0(0.01 * (X.F.sales[1] + X.F.sales[2]) / 2 * (1 - X.t) / sh * MULT.base)} a share on our target`],
      ['Tractors hold up despite the monsoon', 'Medium', 'Rabi sowing, reservoir levels and festive retail in October-November'],
      ['A listing that crystallises value (Last Mile Mobility, MEAL)', 'Medium', 'Board decisions; MEAL investors can seek an exit from November 2027'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['El Nino year hits rabi income and FY28 tractors', 'Medium-high', 'Bear case: tractor volumes and farm margins fall, core multiple at its 25th percentile: {{scen.bear.tp|inr}}'],
      ['Commodity inflation returns with West Asia', 'Medium', 'Each 100bp of margin is ~7% of FY28E EPS'],
      ['Competition in SUVs: Maruti, Tata, Hyundai, Kia, European imports after the India-EU deal', 'Medium', 'Share gains needed to fill a 2x capacity'],
      ['More money into group companies', 'High', '₹8,975 cr still to go into MEAL alone; write-downs averaged ~₹600 cr a year in FY24-26'],
      ['EV incentives (PLI) taper', 'Medium', 'Management says MEAL is EBITDA positive without PLI; margins would still fall'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Turn more positive below ~₹${n0(sellAbove)}** (HOLD on our target), or if the core multiple history is reset by a lasting step-up in growth (our since-2023 sensitivity gives ₹${n0(SENS[1].v)}).`,
      '**For investors who want exposure to Indian SUVs and tractors:** M&M is the best operator; the issue is price. The cross-checks that ignore its own history (DCF ₹' + n0(dcfAdj) + ', peer EV/EBITDA ₹' + n0(evAdj) + ') show why the street is bullish.',
      `**Biggest swing factors:** the core multiple (each 1x is ~₹${n0(c28)} a share) and margins (100bp ≈ ₹${n0(0.01 * (X.F.sales[1] + X.F.sales[2]) / 2 * (1 - X.t) / sh * MULT.base)} a share).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Core P/E, FY28E (ex stakes)', v: `${n1(coreNow)}x`, d: `${n1(coreMed)}x median since Apr-2021` },
      { k: 'SUV revenue share, Q1FY27', v: '25.0%', d: 'No.1; e-SUV share 44%' },
      { k: 'Q1FY27 core EBITDA margin', v: '12.2%', d: '14.3% a year earlier' },
      { k: 'Stakes per share (net of 20%)', v: `₹${n0(SB.subsNet / sh)}`, d: `₹${n0(listedPs)} listed at market` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Standalone vs consolidated', 'Standalone = the listed company M&M Ltd only (auto and farm businesses). Consolidated adds subsidiaries such as M&M Finance, MEAL and Lifespaces, and the share of associates such as Tech Mahindra.'],
      ['Sum of the parts (SOTP)', 'Valuing each business and stake separately and adding them up.'],
      ['Holding discount', 'A cut applied to stakes in other companies, because shareholders of the parent cannot sell them or receive all their cash.'],
      ['Core EPS', 'Standalone earnings per share before one-offs and excluding dividends and other income from group companies (which are valued in the SOTP).'],
      ['Forward P/E', 'Share price divided by next financial year\'s earnings per share.'],
      ['EBITDA, PBIT', 'Operating profit before depreciation; profit before interest and tax (M&M reports segments on PBIT).'],
      ['SUV, UV, LCV', 'Sport-utility vehicle; utility vehicle (SIAM\'s category incl. SUVs and MUVs); light commercial vehicle (pickups under 3.5 tonnes).'],
      ['e-SUV, BEV, MEAL', 'Battery-electric SUV; Mahindra Electric Automobile Ltd, the EV subsidiary (92.45% M&M) that sells the XEV/BE models M&M builds for it.'],
      ['INGLO, NU_IQ', 'M&M\'s electric skateboard platform; its new multi-energy platform for smaller SUVs, launching from FY28.'],
      ['PLI', 'Production-linked incentive: a government subsidy per EV produced with local content.'],
      ['LPA, El Nino', 'Long-period average monsoon rainfall; a Pacific warming pattern that tends to weaken India\'s monsoon.'],
      ['GST 2.0', 'The September 2025 reset of goods-and-services tax rates (SUVs 40%, small cars and CVs 18%).'],
      ['CCPS', 'Compulsorily convertible preference shares: how BII and Temasek invested in MEAL.'],
      ['DCF, WACC, Ke', 'Discounted cash flow; weighted cost of capital; cost of equity.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P4.auto, P4.farm, P4.ev, P4.stakes, P5.moat, p.financials, P5.quarter, P5.quality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.peers, verdict, p.statements, glossary],
  statementNotes: require('./M&M.notes'),
};
