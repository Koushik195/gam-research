// Minda Corporation report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./MINDACORP.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, MULT, adjMed, rating, buyBelow, sellAbove, medTp, epsSep, k, sectorDr, TAX } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a better business than five years ago, priced at ${n1(X.sepNow)}x Sep-28E EPS; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** a promoter-run Indian auto-parts maker that has re-built itself since FY21 (revenue 2.6x, margin 9% to 12%), with a strong position in two-wheeler and truck wiring harnesses, clusters and locks, a 49% stake in a fast-growing EV electronics maker (Flash), and new JVs in switches, sunroofs and EV motors. Revenue should grow ~15% a year after FY27 and EPS ~23% a year to FY29E. Margins are tier-1 margins (~12%) and returns on equity are middling (14-16%) because of the price paid for Flash.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS (fully diluted). Since 2021 the market has paid a median ${n1(adjMed)}x forward for Minda Corp, and auto-component stocks were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. On the street's own method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street gets to ₹815-867 by paying 32-34x (above the stock's own median) on EPS that is undiluted and ~5% above ours.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low-Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      [`Price below ~₹${n0(sellAbove)} (HOLD on our rule)`, 'Medium', `A ~${Math.round((1 - sellAbove / price) * 100)}% fall, or EPS upgrades of a similar size`],
      ['Margin reaches 12%+ in FY27 as commodity costs are passed on', 'Medium', 'Q2-Q3FY27 margins; gross margin trend'],
      ['Flash back to a 17%+ margin with 20%+ growth', 'Medium', 'Flash quarterly revenue and EBITDA in the presentations'],
      ['Organic growth stays above 15% against the GST base', 'Medium', 'Growth ex-Vast vs SIAM production'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Two-wheeler and truck volumes slow against the GST-boosted base', 'Medium', 'Three-quarters of revenue; FY28E EPS 10%+ below ours'],
      ['Commodity and wage inflation recovered late or partly', 'Medium', `Each 0.5pp of margin ≈ ₹${n1(F.sales[1] * 0.005 * (1 - TAX) / F.shares)} of FY28E EPS (~${Math.round(F.sales[1] * 0.005 * (1 - TAX) / F.pat[1] * 100)}%)`],
      ['EV makers in-source motors and controllers; Flash margin stays ~15%', 'Medium', 'Associate profit below our ₹100 cr FY28E'],
      ['New JVs (sunroof, switches, Turntide) lose money for longer', 'Medium', 'Start-up losses in the associate line and minorities'],
      ['Another large acquisition (Vision 2030 is partly inorganic)', 'Medium', 'More debt or equity; returns diluted again'],
      ['Auto sector de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(Math.round(MULT.bear * epsSep.base / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD below ~₹${n0(sellAbove)} and to BUY below ~₹${n0(buyBelow)}** on today's numbers, or sooner if margins and Flash recover faster than we assume.`,
      `**This is a valuation call, not a business call.** The stock trades at ${n1(X.sepNow)}x Sep-28E EPS; its own history (${n1(adjMed)}x) less the sector de-rating (× ${k.toFixed(3)}) supports ${MULT.base}x. At Emkay's 33x our target would be ~₹${n0(Math.round(33 * epsSep.base / 10) * 10)}, below the post-Q1 street median of ₹${n0(medTp)}, because our EPS is diluted and lower.`,
      `**Biggest swing factor:** the multiple. Each 1x is ~₹${n0(epsSep.base)} a share; each 0.5pp of EBITDA margin is ~₹${n0(Math.round(F.sales[1] * 0.005 * (1 - TAX) / F.shares * MULT.base / 10) * 10)} at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 revenue growth', v: '+33%', d: '~24% organic; production +22%' },
      { k: 'EBITDA margin FY21 → FY26', v: '9.3% → 11.7%', d: 'Q1FY27: 11.5%' },
      { k: 'Associates in FY28E profit', v: `${Math.round(X.assocShareOfPat[1])}%`, d: 'mostly 49% of Flash' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(X.sepNow)}x`, d: `median since 2021: ${n1(adjMed)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Tier-1 supplier / OEM', 'A company selling parts directly to vehicle makers / the vehicle maker itself (original equipment manufacturer).'],
      ['Wiring harness / HV harness', 'The bundle of cables and connectors that carries power and signals in a vehicle / high-voltage version for electric vehicles.'],
      ['Instrument cluster / TFT', 'The dashboard display of speed and vehicle data / thin-film-transistor colour screen replacing analogue dials.'],
      ['Vehicle access', 'Locks, handles, latches, immobilisers and keyless-entry systems.'],
      ['Kit value / premiumisation', 'The value of all the parts a supplier can sell into one vehicle / selling more advanced, higher-priced versions.'],
      ['SOP', 'Start of production of a new programme.'],
      ['Associate / equity method', 'A company in which Minda holds 20-50% (or significant influence); it books its share of after-tax profit as one line, not the revenue.'],
      ['Minority interests', 'The part of a subsidiary\'s profit that belongs to other shareholders (e.g. VAST\'s 50% of Minda Vast).'],
      ['PPA / acquisition depreciation', 'Purchase-price allocation: part of the price paid is assigned to intangible assets and depreciated, which lowers the reported share of profit.'],
      ['Warrants', 'Rights to buy new shares at a fixed price (here ₹550, 25% paid up front, balance within 18 months).'],
      ['Fully diluted shares', 'Shares outstanding plus those that will be issued on conversion of warrants.'],
      ['Normalised profit', 'Profit before exceptional gains/losses and one-time tax items.'],
      ['OCI', 'Other comprehensive income: gains recorded in equity, not in profit (e.g. the Pricol sale).'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'pat@FY20': '−₹200 cr: ₹196 cr exceptional loss after tax (Screener).',
  'sales@FY21': '−16%: Covid year.',
  'pat@FY22': '₹192 cr reported incl. a ₹33 cr exceptional gain and a 12% tax rate; normalised ₹137 cr (company).',
  'sales@FY23': '+44%: recovery plus content gains.',
  'pat@FY23': '₹284 cr reported incl. a one-time tax benefit (KTSN write-off allowed); normalised ₹219 cr; tax rate 1%.',
  'pat@FY24': '−20% reported; +4% on normalised FY23. The Pricol gain (₹239 cr) went through OCI, not profit.',
  'interest@FY26': '₹123 cr: a full year of debt taken for Flash (Jan-2025).',
  'sales@FY26': '+22%: harness and clusters +29% (ICS), mechatronics +15%.',
  'pat@FY26': '+41%: associates ₹81 cr (Flash ~₹70 cr) vs ₹16 cr in FY25.',
  'eps@FY26': 'Pro forma ₹14.59 on 24.67 cr fully diluted shares (warrants treated as converted); reported ₹15.07.',
  'sales@Q1FY27': '+33%: ~₹125 cr from Minda Vast (consolidated from Apr-2026); ~+24% organic.',
  'otherIncome@Q1FY27': 'Includes a ₹124 cr exceptional gain on consolidating Minda Vast.',
  'pat@Q1FY27': '₹206 cr incl. ₹106 cr gain after tax; ~₹100 cr before it (+54%).',
  'sales@FY27E': 'GAM: +{{F.salesGrowth.0|pct0}} incl. ~₹560 cr from Minda Vast (organic ~+16%).',
  'ebitdaMargin@FY27E': 'GAM: guidance 11.5-12%; Vast dilutes.',
  'otherIncome@FY27E': 'GAM: recurring ₹12 cr + (associates ₹77 cr − minorities ₹6 cr) ÷ (1 − 27%); excludes the Q1 Vast gain.',
  'capex@FY27E': 'GAM: ₹450 cr (guided ~₹400-450 cr).',
  'pat@FY28E': 'GAM: Flash ~₹100 cr share; switch JV ramp-up.',
};

module.exports = { risks, glossary, statementNotes };
