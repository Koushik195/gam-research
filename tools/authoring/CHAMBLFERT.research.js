// Chambal report, part B: merges CHAMBLFERT.part2-6.js (built on CHAMBLFERT.ctx.js) and adds the verdict,
// glossary and statement notes. Written as of 30-Sep-2026 (Q1FY27 basis). Prose numbers come from
// research/company.json, deep.json, segments.json and the built model; forecast and valuation figures are
// live tokens ({{...}}) that follow assumptions.json.
const X = require('./CHAMBLFERT.ctx');
const P2 = require('./CHAMBLFERT.part2'), P3 = require('./CHAMBLFERT.part3'), P4 = require('./CHAMBLFERT.part4'), P5 = require('./CHAMBLFERT.part5'), P6 = require('./CHAMBLFERT.part6');
const { F, SC, UB, n0, n1, pctChg, price, mult, pe28, peSep28, rating, buyBelow, sellAbove, ruleText, ureaPt, g3Annual, trueNc, epsSep28 } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good operator, a known earnings dip, and a fair price',
  blocks: [
    { callout: '**What you are buying:** India\'s most efficient private urea complex (3.4 mt, energy use below norms, ~25% segment ROCE), a farmer network that sells ₹8,200 cr a year of other fertilisers and agri-inputs, a third of a Moroccan phosphoric-acid maker, a new TAN plant, and a balance sheet with no long-term debt. Profit is set mostly by government formulas, and the most lucrative formula, Gadepan-III\'s NIP-2012 pricing, ends in December 2026.' },
    { callout: `**What you are paying:** ${n1(pe28)}x our FY28E EPS and ${n1(peSep28)}x Sep-28E, against a one-year-forward median of ${n1(X.FM.median)}x since 2021 and urea-heavy peers at ~${n1(X.ureaPe)}x trailing. On the street's own method with our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}). The stock has fallen ~41% from its May-2025 high (₹695 weekly close) to ₹${n0(price)}: the reset is largely priced, the TAN plant and a fourth urea plant are not, and neither is a worse reset.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (the BUY line on our target)`, 'Low-medium', 'Share price after the Gadepan-III decision and Q2FY27 results'],
      ['A Gadepan-III formula that recognises the plant\'s undepreciated cost (cut well below ₹3,000/t)', 'Medium', 'Department of Fertilizers notification; Matix/HURL treatment (same template)'],
      ['TAN at ₹12,000/t+ EBITDA with 80% utilisation', 'Medium', 'TAN revenue and segment disclosure from H2FY27; ammonium nitrate import prices'],
      ['Cash returned rather than spent (a buyback or higher payout)', 'Low', 'Board decision on the fourth urea plant'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Gadepan-III put on Gadepan-I/II-type economics (cut ~₹4,500/t)', 'Medium', `Bear-case FY28E EPS ₹${n1(SC.bear.eps[1])}, ${Math.abs(pctChg(SC.bear.eps[1], F.eps[1]))}% below our base (with weaker trading and TAN)`],
      ['Rabi NBS rates leave traded NPK/DAP loss-making (as in FY23)', 'Medium', 'Each 1 point of traded margin is ~₹1.4 of EPS'],
      ['Fourth urea plant approved at a 12-16% ROE band', 'Medium-high', '₹9,500-10,000 cr of capex (FY27-30), cash pile spent, returns near the cost of equity'],
      ['Subsidy payments slow in a high-price year', 'Medium', 'Receivables above ₹3,000 cr; more short-term debt and interest'],
      ['TAN market turns long as Deepak and others add capacity', 'Medium', 'TAN EBITDA/t below our ~₹9,500'],
      ['Promoter pledge (~23%) is called in a sell-off', 'Low', 'Forced selling pressure on the stock'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Turn positive (BUY) below ~₹${n0(buyBelow)}**, or on a Gadepan-III formula materially better than our ₹${n0(UB.g3CutPerT)}/t cut. **SELL above ~₹${n0(sellAbove)}** on unchanged numbers: the price is close to that line.`,
      `**Biggest swing factor:** the Gadepan-III formula. Every ₹1,000/t of difference moves FY28E EPS by ~₹${n1(UB.g3VolumeLakhT * 10 * 0.75 / F.shares)} (~${Math.round(UB.g3VolumeLakhT * 10 * 0.75 / F.shares / F.eps[1] * 100)}%); the full ₹${n0(UB.g3CutPerT)}/t is ~₹${n0(g3Annual)} cr of EBITDA a year.`,
      `**Second swing factor:** the multiple. The street pays 9.5-14x; at ${mult}x we pay the stock's own history less the sector de-rating. At 11x (bull) on our base EPS the value would be ~₹${n0(11 * epsSep28)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Urea EBITDA per tonne, FY26', v: '₹6,431', d: `₹${n0(UB.ebitdaPerT['FY28E'])} in FY28E after the reset` },
      { k: 'Gadepan-III EBITDA at risk', v: `~₹${n0(g3Annual)} cr`, d: 'a year, from December 2026' },
      { k: 'Subsidy receivable, Jun-2026', v: '₹2,462 cr', d: '₹1,326 cr a year earlier' },
      { k: 'Net cash ex-IMACID, Mar-28E', v: `₹${n0(Math.round(trueNc(1) / 100) * 100)} cr`, d: 'roughly nil at Mar-26' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'Company, GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Urea', 'The main nitrogen fertiliser (46% N), made from natural gas via ammonia; its farm price (MRP) is fixed by the government.'],
      ['NUP-2015 / Modified NPS-III', 'The pricing rules for older urea plants: gas cost passed through at normative energy use, fixed costs reimbursed at set rates.'],
      ['NIP-2012', 'New Investment Policy 2012 for new urea plants: an import-linked normative price, rising with gas, for eight years from start of production. Gadepan-III is the main beneficiary; its period ends in December 2026.'],
      ['NIPU-2026', 'National Investment Policy for Urea-2026 (approved 15-Jul-2026): support for 8-9 new gas-based plants with a 12-16% return-on-equity band.'],
      ['Energy norm', 'The gas use per tonne of urea (in Gcal) the government reimburses; a plant using less keeps the saving.'],
      ['RAC', 'Reassessed capacity: the official capacity of a urea plant. Output above it is paid at gas cost plus a fixed element, capped by the import price.'],
      ['IPP', 'Import parity price: what imported urea would cost delivered in India.'],
      ['Gas pooling / EPMC', 'Domestic and imported gas for urea plants is pooled to one price; the Empowered Pool Management Committee manages it.'],
      ['DAP / TSP / MOP / NPK', 'Di-ammonium phosphate (18-46-0), triple super phosphate, muriate of potash and multi-nutrient "complex" grades: the fertilisers Chambal imports and resells.'],
      ['NBS', 'Nutrient Based Subsidy: a fixed subsidy per kg of N, P, K and S for P&K fertilisers, set each season (Kharif April-September, Rabi October-March).'],
      ['TAN / WNA / HDAN', 'Technical ammonium nitrate (an explosives raw material), weak nitric acid (its intermediate), high-density ammonium nitrate (the solid prilled form).'],
      ['IMACID', 'Indo Maroc Phosphore S.A., Chambal\'s one-third phosphoric-acid joint venture in Morocco with OCP and Tata Chemicals; equity-accounted.'],
      ['CPC / SN', 'Crop protection chemicals (insecticides, fungicides, herbicides) and speciality nutrients (micronutrients, water-soluble fertilisers, biologicals).'],
      ['Segment PBIT / EBITDA', 'Profit of a segment before interest and tax (PBIT); EBITDA adds back the segment\'s depreciation.'],
      ['Net treasury', 'Cash and investments less borrowings; in this report\'s forecasts it includes the IMACID stake at book value.'],
      ['P/E; EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value − net cash) ÷ EBITDA.'],
      ['DCF / Ke', 'Discounted cash flow valuation; Ke is the cost of equity (here 11.9% = 6.5% risk-free + 0.9 × 6% equity risk premium).'],
      ['LPA', 'Long-period average rainfall, used by IMD to define a normal monsoon.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover: P2.cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.urea, P3.gadepan3, P4.traded, P4.cpc, P4.tan, P4.moat, p.financials, p.capital, P5.quality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P6.forecasts, P6.street, P6.valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY19': 'Gadepan-III started production in 2019 (Q4FY19).',
    'sales@FY20': 'First full year of Gadepan-III.',
    'pat@FY20': 'Gadepan-III\'s first full year; PBT +60%.',
    'sales@FY21': 'Higher traded DAP (12.8 lakh t) and record urea sales (33.8 lakh t).',
    'pat@FY21': 'Includes ₹338 cr of exceptional income in the exited software subsidiaries; finance cost fell as debt was repaid.',
    'ebitdaMargin@FY21': 'Peak margin (19%); no segment split before FY23 (single reported segment).',
    'sales@FY22': 'Revenue +26% on higher prices, although traded DAP fell to 6.9 lakh t (12.8) on availability.',
    'sales@FY23': 'Russia-Ukraine price spike: urea revenue ₹16,689 cr, traded ₹10,367 cr.',
    'ebitdaMargin@FY23': 'Traded fertilisers lost ₹419 cr (PBIT) as input costs outran the subsidy.',
    'pat@FY23': 'Traded-fertiliser loss; EPS ₹24.9.',
    'sales@FY24': 'Prices and subsidies fell back; traded volume down.',
    'pat@FY24': 'Traded business back to profit (₹160 cr PBIT); urea EBITDA/t ₹5,556.',
    'ebitdaMargin@FY25': 'Low traded volume (5.6 lakh t) lifts the group margin; urea EBITDA/t ₹6,228.',
    'pat@FY25': 'Urea PBIT ₹1,836 cr; finance cost down to ₹48 cr after debt prepayment.',
    'sales@FY26': 'Traded volume more than doubled to 12.3 lakh t; urea revenue −5% (lower gas pass-through, Gadepan-II breakdown).',
    'ebitdaMargin@FY26': 'More low-margin trading in the mix; urea margin up to 17.4%.',
    'pat@FY26': 'Record ₹1,953 cr: lower tax (25.17% regime) and finance cost ₹7 cr.',
    'dep@FY27': 'TAN plant capitalised (~₹75 cr a year).',
    'pat@FY28': 'First full year without Gadepan-III\'s NIP-2012 pricing.',
    'sales@Q1FY27': 'Urea −8% (bunched turnarounds: 6.10 lakh t vs 8.41); traded −18%.',
    'pat@Q1FY27': 'EBITDA +12% on pre-war traded stock, but IMACID loss (−₹25 cr) and higher finance cost: PAT −5%.',
    'pat@Q4FY26': 'Q4 is always weak (low season, turnarounds); urea EBIT margin 7.8%.',
    'sales@Q2FY26': 'Traded volume 4.5 lakh t (0.7 a year earlier).',
  },
};
