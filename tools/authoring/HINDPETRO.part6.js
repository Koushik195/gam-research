// HPCL report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./HINDPETRO.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, OWN, MULT, rating, buyBelow, sellAbove, medTp, ebSep, fwdEvNow, fwdPe, bld, shares } = X;
const perK = v => n1(v * MULT.base / shares); // ₹ a share per ₹v cr of Sep-28E EBITDA

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good network carrying the most policy risk and the most debt of the OMCs; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** 25,098 fuel stations and India's second-largest LPG business, two refineries (24.5 MMTPA, Visakh newly upgraded), 74% of the just-started HRRL, 48.99% of HMEL, MRPL and Oil India stakes worth ₹${n0(X.listedMv)} cr, and ONGC as parent. EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} in FY27-29E on our numbers.` },
    { callout: `**What you are paying:** ₹${n1(price)} is ${n1(fwdPe)}x FY28E EPS and ${n1(fwdEvNow)}x FY28E core EBITDA (after taking out all investments at book). That is about the stock's own history (${n1(OWN.med)}x median, trough years out) and above it once the sector's discount to its averages is applied. Our ${MULT.base}x Sep-28E EBITDA (₹${n0(ebSep)} cr) gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street is more generous (median ₹${n0(medTp)}) because it pays 6x EBITDA and adds investments on top.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD on our rule) or ~₹${n0(buyBelow)} (BUY)`, 'Medium', `The stock would have to fall ~${Math.round((1 - sellAbove / price) * 100)}% for HOLD`],
      ['Retail prices move back to market with crude; marketing margin ₹4-5/litre held', 'Low-Medium', 'Q2-Q3FY27 implied marketing margins; SAED and export duty reviews'],
      ['Compensation of the ₹16,410 cr negative LPG buffer', 'Medium', `Each ₹5,000 cr is ~₹${n0(5000 * 0.75 / shares)} a share after tax`],
      ['HRRL at full capacity on time and profitable; Vizag upgrade stable', 'Medium', 'Utilisation 80-85% in Q3, 100% in Q4FY27; GRM uplift at Visakh'],
      ['Debt back below ₹50,000 cr', 'Medium', 'Quarterly gross debt (₹72,600 cr at Jun-26)'],
      ['Independent directors appointed', 'Medium', 'Board notices'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Crude stays above US$90 with retail prices frozen (elections, inflation)', 'Medium', `Each ₹500/t of EBITDA ≈ ₹${n0(500 * bld[1].vol / 10)} cr (₹${perK(500 * bld[1].vol / 10)} a share at ${MULT.base}x)`],
      ['LPG under-recoveries compensated late or partly', 'Medium', 'Cash, debt and interest; FY23 precedent'],
      ['HRRL ramp-up slips or loses money on ~₹53,000 cr of debt', 'Medium', 'JV losses through other income; more equity from HPCL; the bear case values HRRL at 0.8x invested'],
      ['Export duties or windfall taxes cap refining gains', 'High', 'Took a large part of Q1FY27\'s GRM; caps the upside'],
      ['Working capital and debt spike with crude (+₹25,000 cr in Q1FY27)', 'High in a crisis', 'Interest cost; leverage magnifies equity swings (bear {{scen.bear.tp|inr}})'],
      ['MRPL and Oil India fall in value', 'Medium', `Each 10% on the listed stakes ≈ ₹${n1(X.listedMv * 0.1 * 0.8 / shares)} a share`],
      ['ONGC or the Government directs capital to policy projects', 'Medium', 'Lower returns; HRRL precedent'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD if the price fell below ~₹${n0(sellAbove)}**, and to BUY below ~₹${n0(buyBelow)}, on today's numbers.`,
      `**This is a multiple and leverage call, not an earnings call.** Our FY28E EBITDA (₹${n0(F.ebitda[1])} cr) is inside the street's range (₹21,700-25,300 cr). Each 0.5x on the EV/EBITDA multiple is ~₹${n0(0.5 * ebSep / shares)} a share; the bull multiple (${MULT.bull}x, no sector move) with stakes at market gives {{scen.bull.tp|inr}}.`,
      '**What would change our mind:** evidence that marketing margins are protected in this cycle (prices that follow crude, LPG compensation on time), HRRL running profitably, or a material fall in the price.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Sales ÷ own refining', v: '~2x', d: '51.45 MMT sold vs 26.04 MMT refined (FY26)' },
      { k: 'EBITDA per tonne', v: '−₹1,655 to ₹5,956', d: 'FY23 vs FY26' },
      { k: 'Q1FY27 net loss', v: '−₹12,265 cr', d: 'under-recoveries above ₹26,000 cr' },
      { k: 'Price ÷ FY28E core EBITDA', v: `${n1(fwdEvNow)}x`, d: `own forward median ${n1(OWN.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['OMC', 'Oil marketing company: here the three state-owned fuel retailers IOC, BPCL and HPCL.'],
      ['GRM', 'Gross refining margin: value of products made less the cost of crude, in US$ per barrel.'],
      ['Marketing margin (GMM)', 'Retail price less the refinery-gate price, taxes and dealer commission, in ₹ per litre.'],
      ['Under-recovery', 'The loss on selling a product below cost because retail prices were held.'],
      ['LPG buffer', 'The running total of household-LPG under-recoveries not yet compensated (₹16,410 cr negative at Jun-2026); not on the balance sheet.'],
      ['SAED', 'Special additional excise duty: on petrol and diesel sold in India and, re-imposed in 2026, on exports of diesel and jet fuel.'],
      ['HRRL / HMEL / MRPL', 'HPCL Rajasthan Refinery (74%), HPCL-Mittal Energy (48.99%), Mangalore Refinery & Petrochemicals (16.96%): equity-accounted refineries.'],
      ['RUF', 'Residue Upgradation Facility at Visakh: turns heavy residue into diesel and other distillates.'],
      ['MMT / MMTPA', 'Million metric tonnes / million metric tonnes per year (capacity).'],
      ['Throughput', 'Crude processed by the refineries.'],
      ['Core EV/EBITDA', 'Market value plus debt, less cash and all investments, divided by EBITDA before other income.'],
      ['Trough year', 'A year whose EBITDA (or EPS) is a loss or below half the best of the previous three years; left out of the history median.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade above or below their own five-year median multiple on the valuation date.'],
      ['SOTP', 'Sum of the parts: each business and stake valued separately, less net debt.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended cost of debt and equity (9.4% here).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitda@FY21': 'Covid year: revenue −13%, EBITDA margin 7.0%.',
  'ebitda@FY22': 'Crude recovered; Visakh ran only 8.41 MMT during its modernisation (total 13.97 MMT).',
  'ebitda@FY23': 'Loss: retail prices held while crude spiked after the Ukraine war.',
  'pat@FY23': 'Net loss ₹6,980 cr: marketing losses.',
  'ebitda@FY24': 'Crude fell, retail prices did not: ₹5,324/t.',
  'ebitda@FY25': 'Weak cracks (GRM US$5.74/bbl) and LPG losses.',
  'ebitda@FY26': 'Record ₹30,645 cr: GRM US$8.79/bbl, strong marketing; ₹3,300 cr LPG compensation booked.',
  'pat@FY26': '₹18,047 cr, a record.',
  'pat@Q2FY25': '₹143 cr: GRM US$3.1/bbl.',
  'pat@Q4FY26': '₹6,065 cr: GRM US$14.3/bbl as the war began.',
  'ebitda@Q1FY27': 'Marketing under-recoveries above ₹26,000 cr; inventory write-downs.',
  'pat@Q1FY27': 'Loss of ₹12,265 cr, the first in 14 quarters.',
  'ebitda@FY27E': 'GAM: ₹700/t (Q1 −₹12,300/t, Q2-Q4 ~₹5,000/t).',
  'pat@FY27E': 'GAM: loss; no tax credit modelled (engine limit).',
  'ebitda@FY28E': 'GAM: ₹4,300/t, the FY22-26 average without FY23.',
  'capex@FY27E': 'GAM: guidance capped at ₹9,700 cr.',
};

module.exports = { risks, glossary, statementNotes };
