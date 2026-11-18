// Coromandel report, part B: merges COROMANDEL.part2-5.js (built on COROMANDEL.ctx.js) and adds the
// verdict, glossary and statement notes. Written as of 30-Sep-2026 (Q1FY27 basis). Prose numbers come
// from research/company.json, deep.json, segments.json and the built model; forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./COROMANDEL.ctx');
const P2 = require('./COROMANDEL.part2'), P3 = require('./COROMANDEL.part3'), P4 = require('./COROMANDEL.part4'), P5 = require('./COROMANDEL.part5');
const { F, M, n0, n1, pctChg, price, mult, pe28, peSep28, rating, buyBelow, sellAbove, ruleText, nutPt, A26, SC, nc } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good company in a squeeze, priced for the recovery',
  blocks: [
    { callout: '**What you are buying:** India\'s largest private phosphatic fertiliser maker, with the best distribution in the south, a net-cash balance sheet and newly integrated acid and rock supply; plus a crop protection business growing 20%+ (with a half-owned, low-margin NACL attached). Its profits depend on subsidy rates set by the government each season, on imported raw materials and on the monsoon.' },
    { callout: `**What you are paying:** ${n1(pe28)}x our FY28E EPS and ${n1(peSep28)}x Sep-28E, against a one-year-forward median of ${n1(X.fwdMed21)}x since 2021 and fertiliser peers on ~${n1(X.fertPe)}x trailing. On the street's own method with our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}). The stock already fell ~10% in the last three trading days of September, but it still prices a fast return to pre-crisis margins.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (the HOLD line on our target)`, 'Medium', 'Share price after the rabi subsidy decision and Q2FY27'],
      ['Rabi NBS rates that compensate the Middle East cost spike', 'Medium', 'Per-kg rates for N and P vs the six-month average input cost; any special package'],
      ['Fertiliser EBITDA/t back above ₹5,500 with own acid running fully', 'Medium', 'Nutrient PBIT margin above 9% in H2FY27; phosphoric acid utilisation'],
      ['Crop protection keeps compounding at 20%+', 'Medium-high', 'Standalone CP EBIT; NACL margin above 11%; CDMO orders'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Rabi subsidy stays inadequate; sulphur and ammonia stay high', 'Medium', `Bear-case FY28E EPS ₹${n1(SC.bear.eps[1])}, ${Math.abs(pctChg(SC.bear.eps[1], F.eps[1]))}% below our base`],
      ['Weak southern rabi after a 76%-of-normal monsoon in the south', 'Medium', 'Lower volumes in AP, Telangana and Karnataka; higher inventory and finance cost'],
      ['Reasonable-margin guidelines cap fertiliser profit', 'Low-medium', 'Removes the upside from backward integration'],
      ['Subsidy payments slow (fiscal pressure)', 'Medium', 'Receivables above ₹3,000 cr absorb cash; higher interest'],
      ['NACL stalls or needs more capital', 'Medium', 'More minority losses and goodwill risk (₹386 cr)'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Turn neutral (HOLD) below ~₹${n0(sellAbove)}**, and positive below ~₹${n0(buyBelow)}, or on evidence that the rabi subsidy and own acid restore fertiliser EBITDA to ₹5,500-6,500/t.`,
      `**Biggest swing factor:** the subsidy-adjusted fertiliser margin. Every 1 point of Nutrient & allied EBITDA margin moves FY28E EPS by ~₹${n1(nutPt)} (≈${Math.round(nutPt / F.eps[1] * 100)}%).`,
      `**Second swing factor:** the multiple. The street pays 25-30x for the agri-solutions story; at ${mult}x we pay the stock's own history less the sector de-rating. At 19x (bull) on our base EPS the value would be ~₹${n0(19 * X.epsSep28)}, still below the share price.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Nutrient PBIT margin, Q1FY27', v: '6.9%', d: '9.9% a year earlier' },
      { k: 'D&A, Q1FY27', v: '₹203 cr', d: '₹121 cr a year earlier' },
      { k: 'Monsoon, south peninsula', v: '76% of normal', d: 'All-India 87% (2026 season)' },
      { k: 'Net cash, Mar-27E', v: `₹${n0(Math.round(nc(0) / 100) * 100)} cr`, d: 'incl. ICDs; ₹2,596 cr at Mar-26' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'Company, IMD, GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['DAP', 'Di-ammonium phosphate (18% N, 46% P₂O₅): the most used phosphatic fertiliser; its farm price is held at ₹1,350 a 50 kg bag.'],
      ['NPK / complex fertilisers', 'Granular fertilisers that combine nitrogen (N), phosphorus (P) and potash (K) in set grades, e.g. 20:20:0:13.'],
      ['SSP', 'Single super phosphate: a low-cost phosphatic fertiliser (16% P₂O₅) made from rock phosphate and sulphuric acid.'],
      ['Urea / MOP', 'Urea is the main nitrogen fertiliser (price fully controlled); MOP is muriate of potash. Coromandel trades both.'],
      ['NBS', 'Nutrient Based Subsidy: the government pays a fixed subsidy per kg of N, P, K and S in each P&K fertiliser, revised every season (kharif: Apr-Sep; rabi: Oct-Mar).'],
      ['MRP', 'Maximum retail price; for DAP effectively fixed by the government, for NPKs in practice constrained.'],
      ['Phosphoric / sulphuric acid', 'Phosphoric acid (from rock phosphate and sulphuric acid) is the main input for DAP/NPK; sulphuric acid is made by burning sulphur.'],
      ['Ammonia', 'The nitrogen input for DAP and NPKs; India imports most of it.'],
      ['Backward integration', 'Making one\'s own raw materials (here acid and rock) instead of buying them.'],
      ['Reasonable-margin guidelines', 'Government rules capping the profit companies may earn on subsidised P&K fertilisers.'],
      ['Technical / formulation', 'In crop protection: the active ingredient (technical) and the ready-to-use product sold to farmers (formulation).'],
      ['CDMO', 'Contract development and manufacturing for other companies.'],
      ['ICDs', 'Inter-corporate deposits: here, deposits placed with Bajaj Finance, counted as cash.'],
      ['Acceptances', 'Bank-backed credit from suppliers (usually for imported raw materials), shown within trade payables.'],
      ['Minorities (NCI)', 'The share of a subsidiary\'s profit that belongs to its other shareholders (46% of NACL, 28.5% of BMCC).'],
      ['Segment PBIT / EBITDA', 'Profit of a segment before interest, tax and central costs (PBIT); EBITDA adds back the segment\'s depreciation.'],
      ['P/E; EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value − net cash) ÷ EBITDA.'],
      ['DCF / Ke', 'Discounted cash flow valuation; Ke is the cost of equity (here 11.9% = 6.5% risk-free + 0.9 × 6% equity risk premium).'],
      ['LPA', 'Long-period average rainfall used by IMD to define a normal monsoon.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover: P2.cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.nutrient, P3.projects, P3.crop, P4.moat, p.financials, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5.valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY19': 'Higher fertiliser revenue (FY19 segment detail not reviewed).',
    'ebitdaMargin@FY17': 'EBITDA +28% on flat-to-lower revenue (FY17 detail not reviewed).',
    'ebitdaMargin@FY18': 'EBITDA +28% again (FY18 detail not reviewed).',
    'ebitdaMargin@FY20': 'Nutrient EBITDA margin 14.1%, crop protection 15.3% (first year of our segment series; drivers not reviewed).',
    'pat@FY17': 'EBITDA +28% (FY17 detail not reviewed).',
    'pat@FY18': 'EBITDA +28% and lower finance cost (₹224 cr → ₹178 cr).',
    'pat@FY20': 'PBT +26% (EBITDA +20%); the rest from a lower tax charge (FY20 tax detail not reviewed).',
    'pat@FY21': 'EBITDA +15%; finance cost fell from ₹235 cr to ₹106 cr as borrowings were cut from ₹2,019 cr to ₹385 cr.',
    'pat@FY23': 'Record prices; Nutrient PBIT +46% to ₹2,594 cr.',
    'sales@Q3FY25': 'Recovery in fertiliser volumes and prices after the weak FY24 (Q3FY24 segment detail not reviewed); Nutrient ₹6,367 cr.',
    'sales@Q4FY25': 'Nutrient ₹4,321 cr, crop protection ₹699 cr (Q4FY24 segment detail not reviewed).',
    'sales@Q1FY26': 'Nutrient +51% (DAP+NPK volume 8.4 → 11.0 lakh t); crop protection +31%.',
    'sales@Q2FY26': 'Nutrient +28% (DAP+NPK volume +7%, imports +49%); crop protection +42% with NACL from 8-Aug-2025.',
    'sales@Q3FY26': 'Nutrient +22% (traded urea 9.3 vs 4.2 lakh t); crop protection +73% with NACL.',
    'sales@Q4FY26': 'Nutrient +15% despite DAP+NPK volume −7%; crop protection +54% with NACL.',
    'sales@FY22': 'Global fertiliser prices rose after Covid; Nutrient revenue +37% to ₹16,714 cr.',
    'sales@FY23': 'Russia-Ukraine war: record prices and subsidy (₹14,488 cr); revenue +55%.',
    'sales@FY24': 'Prices and subsidy fell back (subsidy ₹8,175 cr); revenue −26%.',
    'sales@FY26': 'Nutrient revenue +28% (volume +7%, higher subsidy and prices); crop protection +50% with NACL from Aug-2025.',
    'ebitdaMargin@FY21': 'Peak margin: low input costs and strong rabi demand; crop protection EBITDA margin 18.7%.',
    'ebitdaMargin@FY22': 'Input costs rose faster than subsidies; Nutrient margin 14.8% → 11.4%.',
    'ebitdaMargin@FY23': 'Record prices inflate revenue; Nutrient margin 10.1%.',
    'ebitdaMargin@FY24': 'Prices normalised; Nutrient margin recovered to 11.8%.',
    'ebitdaMargin@FY26': 'Middle East crisis squeezed Q4 (manufactured EBITDA <₹3,500/t); NACL\'s lower margin consolidated.',
    'pat@FY24': 'Lower subsidy and prices: Nutrient PBIT −16%.',
    'pat@FY25': 'Includes a ₹397.71 cr gain on assignment of leasehold land rights and a ₹50.94 cr impairment.',
    'pat@FY26': 'Includes a ₹70.56 cr drone goodwill impairment; minorities absorbed ₹58 cr of losses (profit to shareholders ₹1,956 cr).',
    'dep@FY26': 'BMCC (Senegal mine) and NACL consolidated; acquisition intangibles amortised.',
    'sales@Q1FY27': 'Nutrient +9% (prices up 25-30%, volumes −9%); crop protection +73% with NACL.',
    'pat@Q1FY27': 'Fertiliser PBIT −24% as inputs outran the 10% NBS increase; D&A ₹203 cr vs ₹121 cr.',
    'pat@Q4FY26': 'Annual maintenance, compressed fertiliser margins and the ₹71 cr drone impairment.',
  },
};
