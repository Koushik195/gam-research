// BKT report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./BALKRISIND.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, price, MULT, FM, rating, buyBelow, sellAbove, medTp, epsSep, k, sectorDr } = X;
const r10 = v => Math.round(v / 10) * 10;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good niche business at a fair price; ${rating}, on the edge of BUY`,
  blocks: [
    { callout: `**What you are buying:** the world's leading specialist in replacement off-highway tyres outside the global majors, with ~5-6% of the global market, Indian costs, its own carbon black and power, and an 18-31% EBITDA margin over a decade. It is recovering from a currency-and-tariff year (FY26 EPS −25%) with record volumes, and spending ₹6,800 cr to enter carbon black and Indian on-highway tyres, which takes it from net cash to ~₹2,000 cr of net debt at the peak.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS. BKT's own forward P/E has a median of ${n1(FM.median)}x since 2021; Indian tyre stocks were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026, which gives ${MULT.base}x Sep-28E EPS and {{dcf.tp|inr}} ({{dcf.upside|chg}}). That is ${rating} on our rule, just short of the +15% BUY line; the EV/EBITDA and DCF cross-checks (₹${n0(X.mv('ev').value)} and ₹${n0(X.mv('dcf').value)}) are below the price, so we do not stretch for a BUY.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', `Only ~${Math.max(0, Math.round((1 - buyBelow / price) * 100))}% below the 30-Sep close: a small fall would make it a BUY on today's numbers`],
      ['Margin back to 23%+ (management\'s 23-25% target) by FY28', 'Low-Medium', 'Q2-Q3FY27 margins after the raw-material hit; hedge rates; freight'],
      ['US back to 15-16% of revenue and tariff refunds paid', 'Medium', 'US volumes; refund disclosures'],
      ['On-highway revenue disclosed and growing towards ₹1,000 cr+ with small losses', 'Low-Medium', 'First disclosure; PCR pilot from Q3FY27'],
      ['Capex falls and free cash flow is returned (higher payout)', 'Medium (FY28-29)', 'FY28 capex guidance; dividend policy'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Rupee strengthens against the hedge book (the FY26 swing in reverse)', 'Low-Medium', 'Each 1% on EUR/USD realisation ≈ ~₹85 cr of revenue and ~4-5% of EPS'],
      ['European farm downturn (weather, farm incomes, dealer destocking)', 'Medium', 'Europe ~40% of volume; FY23-type margin (18%)'],
      ['Crude-linked raw materials and freight keep rising (Middle East conflict)', 'Medium', 'Margin stays near 19-20%; FY28E EPS 10-15% lower'],
      ['US trade policy turns again', 'Low-Medium', 'Americas 12-13% of volume; US shipments stopped at 50% duty'],
      ['On-highway losses and carbon black pricing dilute returns for longer', 'Medium-High', 'ROE stays ~12-13%; multiple compresses'],
      ['Tyre sector de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(r10(MULT.bear * epsSep.base))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to BUY below ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers, or sooner if Q2-Q3 margins hold above 21% despite the raw-material increase.`,
      `**This is mainly an earnings call.** Our multiple (${MULT.base}x) is close to the street's range (22-28x); our FY28E EPS (₹${n1(F.eps[1])}) is 6-17% below the brokers', because we do not assume a quick return to a 23%+ margin. At the street's median multiple (27x) our target would be ~₹${n0(r10(27 * epsSep.base))}, close to the post-Q1 street median of ₹${n0(medTp)}.`,
      `**Biggest swing factor:** the margin. Each 1pp of EBITDA margin is ~₹${n0(F.sales[1] * 0.01 * 0.75 / F.shares)} of FY28E EPS and ~₹${n0(r10(F.sales[1] * 0.01 * 0.75 / F.shares * MULT.base))} a share at our multiple; each 1x of multiple is ~₹${n0(epsSep.base)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 OHT volume', v: '93,770 MT', d: '+16%, a record' },
      { k: 'FY26 FX swing (standalone)', v: '₹517 cr', d: 'more than the fall in profit' },
      { k: 'Capex plan to FY29', v: '₹6,800 cr', d: '~₹3,000 cr still to spend (Jun-26)' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(price / epsSep.base)}x`, d: `own median since 2021: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['OHT', 'Off-highway tyres: tyres for tractors and farm machines (agricultural), and for construction, mining, port and industrial machines (OTR, "off the road").'],
      ['Replacement / OEM', 'Tyres sold to users through dealers to replace worn ones / tyres sold to equipment makers for new machines.'],
      ['TBR, PCR, 2W', 'Truck and bus radial tyres; passenger-car radial tyres; two-wheeler tyres. BKT\'s new "on-highway" range for India.'],
      ['Carbon black', 'A fine black powder made from oil feedstock that strengthens rubber; BKT makes its own and sells the surplus.'],
      ['Realised / unrealised FX', 'Gains or losses on currency contracts that have settled (shown in revenue) / that are still open and marked to market (shown in expenses or below EBITDA).'],
      ['Hedge (forward contract)', 'An agreement to sell euros or dollars later at a fixed rupee rate; protects against a stronger rupee but forgoes gains when the rupee weakens.'],
      ['MTPA / MT', 'Metric tonnes per annum (capacity) / metric tonnes (sales volume). BKT reports OHT volume in tonnes, not units.'],
      ['CWIP', 'Capital work in progress: plants being built, not yet in use or depreciated.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, as net debt is small).'],
      ['ROCE / ROE', 'Return on capital employed (operating profit ÷ debt plus equity) / return on equity (profit ÷ net worth).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '−8%: lower sales in the year to Mar-2020.',
  'pat@FY20': '+23% despite lower sales: lower corporate tax rate (16% effective).',
  'ebitdaMargin@FY21': '31%, the peak of the decade.',
  'sales@FY22': '+43%: post-Covid demand recovery and the Bhuj brownfield plant (50,000 MTPA).',
  'ebitdaMargin@FY22': '24% (−7pp).',
  'sales@FY23': '+18%.',
  'ebitdaMargin@FY23': '18%, the low point of the decade.',
  'pat@FY23': '−26%: margin squeeze.',
  'ebitdaMargin@FY24': '24%: back to the FY22 level.',
  'otherIncome@FY25': '₹539 cr incl. a ₹267 cr foreign-exchange gain.',
  'pat@FY26': '−25%: FX losses (realised ₹164 cr in revenue, unrealised in expenses) vs gains in FY25, and US shipments stopped at a 50% duty in H2FY26.',
  'otherIncome@FY26': '₹252 cr: treasury income incl. ₹131 cr of realised and MTM gains; no FX gain.',
  'capex@FY26': '₹3,003 cr: carbon black, power, CV radial phase 1, PCR (₹6,800 cr plan to FY29).',
  'sales@Q2FY26': '−1%: US duty raised to 50% mid-quarter; BKT stopped US shipments; volume −4%.',
  'otherIncome@Q4FY26': 'Negative: market-linked and FX items.',
  'sales@Q1FY27': '+25%: record volume 93,770 MT (+16%), ~5% price increase, EUR ~₹102.',
  'pat@Q1FY27': '+57%: the Q1FY26 base carried a ₹154 cr unrealised FX loss (standalone).',
  'sales@FY27E': 'GAM: OHT +19% (volume +11%, price/mix +7%), carbon black +38%, on-highway ₹200 cr.',
  'ebitdaMargin@FY27E': 'GAM: Q2-Q3 hit by ~5% raw-material inflation (~2pp, management), partly offset by price and hedges.',
  'capex@FY27E': 'GAM: ₹2,800 cr (company: ₹1,000 cr in Q1 plus ₹1,500-2,000 cr).',
  'pat@FY28E': 'GAM: +19%: margin recovery and on-highway scale-up; depreciation and interest up.',
};

module.exports = { risks, glossary, statementNotes };
