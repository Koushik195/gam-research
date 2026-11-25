// Indian Oil report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./IOC.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, OWN, MULT, rating, buyBelow, sellAbove, medTp, ebSep, fwdEvNow, fwdPe, bld, shares } = X;
const perK = v => n1(v * MULT.base / shares); // ₹ a share per ₹v cr of Sep-28E EBITDA

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: India's best fuel franchise, priced about right for its earnings and too high for its risks; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** ~31% of India's refining, the largest pipeline network, 43,000+ fuel stations, ~₹90,000 cr of expansions about to start, stakes in ONGC, GAIL, Oil India and Petronet worth ₹${n0(X.listedMv)} cr, and a 51.5% state owner that decides retail prices. EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} in FY27-29E on our numbers.` },
    { callout: `**What you are paying:** ₹${n1(price)} is ${n1(fwdPe)}x FY28E EPS and ${n1(fwdEvNow)}x FY28E core EBITDA (after taking out all investments at book). That is about the stock's own history (${n1(OWN.med)}x median) and above it once the sector's discount to its averages is applied. Our ${MULT.base}x Sep-28E EBITDA (₹${n0(ebSep)} cr) gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street is more generous (median ₹${n0(medTp)}) because it pays 4.5-5.5x EBITDA AND adds the investments at market.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule) or ~₹${n0(sellAbove)} for HOLD`, 'Medium', `The stock would have to fall ~${Math.round((1 - sellAbove / price) * 100)}% for HOLD`],
      ['Retail prices move back to market (daily pricing) with crude', 'Low-Medium', 'Price changes after Q2; SAED and export duty reviews'],
      ['Full compensation of the ₹29,730 cr negative LPG buffer', 'Medium', `Each ₹10,000 cr is ~₹${n0(10000 * 0.75 / shares)} a share after tax`],
      ['Expansions ramp faster than 60/80/100% and lift GRM', 'Medium', 'Throughput vs 77 / 85 / 90 MMT guidance; distillate yield'],
      ['Independent directors appointed; audit committee restored', 'Medium', 'Board notices'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Crude stays above US$90 with retail prices frozen (elections, inflation)', 'Medium', `Each ₹500/t of petroleum EBITDA ≈ ₹${n0(500 * bld[1].vol / 10)} cr (₹${perK(500 * bld[1].vol / 10)} a share at ${MULT.base}x)`],
      ['LPG under-recoveries not compensated, or compensated late', 'Medium', 'Cash and debt; FY23 precedent'],
      ['Windfall/export duties on refining margins kept or raised', 'High', 'Caps the refining upside (US$36 → 15.6 GRM in Q1)'],
      ['Petchem capex (~₹1 lakh cr) earns 2-3% margins as in FY23-25', 'Medium', 'Low returns on a fifth of capital employed'],
      ['Working capital and debt spike with crude (+₹31,000 cr in Q1FY27)', 'High in a crisis', 'Interest cost; leverage magnifies equity value swings'],
      ['ONGC and other stakes fall in value', 'Medium', `Each 10% on the listed stakes ≈ ₹${n1(X.listedMv * 0.1 * 0.8 / shares)} a share`],
      ['Government offer for sale (above 51%) or policy-driven capex', 'Low-Medium', 'Supply overhang; lower returns'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD if the price fell below ~₹${n0(sellAbove)}**, and to BUY below ~₹${n0(buyBelow)}, on today's numbers.`,
      `**This is a multiple and policy call, not an earnings call.** Our FY28E EBITDA (₹${n0(F.ebitda[1])} cr) is in line with the street's. Each 0.5x on the EV/EBITDA multiple is ~₹${n0(0.5 * ebSep / shares)} a share; the bull multiple (${MULT.bull}x, no sector move) with stakes at market gives {{scen.bull.tp|inr}}.`,
      '**What would change our mind:** evidence that marketing margins are being protected in this cycle (a price path that follows crude, compensation paid on time), or a material fall in the price.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Share of India\'s refining', v: '~31%', d: '80.75 → ~98 MMTPA by FY28' },
      { k: 'Petroleum EBITDA per tonne', v: '₹3,800-8,600', d: 'trough vs good years, FY22-26' },
      { k: 'Q1FY27 profit to owners', v: '−₹1,631 cr', d: 'after a ~₹15,000 cr inventory gain' },
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
      ['Under-recovery', 'The loss on selling a product (mainly household LPG) below cost at the Government\'s request.'],
      ['LPG buffer', 'The running total of LPG under-recoveries not yet compensated (₹29,730 cr negative at Jun-2026).'],
      ['SAED', 'Special additional excise duty: on petrol and diesel sold in India (cut ₹10/litre on 27-Mar-2026) and, re-imposed in 2026, on exports of diesel and jet fuel.'],
      ['MMT / MMTPA', 'Million metric tonnes / million metric tonnes per year (capacity).'],
      ['Throughput', 'Crude processed by the refineries.'],
      ['Inventory gain/loss', 'Profit or loss from holding crude and products while prices move.'],
      ['Core EV/EBITDA', 'Market value plus debt, less cash and all investments, divided by EBITDA before other income.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade above or below their own five-year median multiple on the valuation date.'],
      ['SOTP', 'Sum of the parts: each business and stake valued separately, less net debt and minorities.'],
      ['Minorities', 'The share of a subsidiary owned by others (48.11% of Chennai Petroleum).'],
      ['Treasury shares', 'IOC\'s own 34.97 cr shares held by the IOC Shares Trust; excluded from EPS and from our share count.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended cost of debt and equity (9.6% here).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'pat@FY20': 'Loss to owners after a ₹11,305 cr exceptional charge (Screener).',
  'ebitda@FY21': 'Covid year: revenue −25%, EBITDA margin 11%.',
  'sales@FY22': '+62%: crude price recovery.',
  'ebitda@FY23': 'Retail prices held while crude spiked after the Ukraine war.',
  'pat@FY23': '₹9,792 cr: marketing losses.',
  'ebitda@FY24': 'Record: crude fell, retail prices did not.',
  'pat@FY24': '₹41,730 cr; GRM US$12.05/bbl.',
  'ebitda@FY25': 'GRM fell to US$4.80/bbl; LPG losses.',
  'pat@FY25': '₹13,598 cr incl. ₹1,945 cr of exceptional items (Screener adds them to other income).',
  'ebitda@FY26': '₹77,108 cr after ~₹8,300 cr of FX losses; ₹6,036 cr LPG compensation booked.',
  'pat@FY26': '₹42,096 cr to owners (₹43,677 cr before minorities).',
  'pat@Q2FY25': 'Loss: weak refining margins (GRM ~US$1.6/bbl per PL).',
  'pat@Q4FY26': '₹14,458 cr: inventory bought before the war.',
  'pat@Q1FY27': 'Loss of ₹1,631 cr at US$100 crude, after a ~₹15,000 cr finished-goods inventory gain.',
  'ebitda@FY27E': 'GAM: ₹3,800/t petroleum EBITDA (Q1 near zero).',
  'ebitda@FY28E': 'GAM: expansions add volume; ₹5,600/t.',
  'capex@FY27E': 'GAM: guidance ₹32,700 cr standalone.',
};

module.exports = { risks, glossary, statementNotes };
