// Hyundai Motor India report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./HYUNDAI.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, PE12, MULT, rating, buyBelow, sellAbove, medTp, epsSep, A26 } = X;
const r10 = v => Math.round(v / 10) * 10;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a recovery we expect, at a price that already expects it; ${rating} at ${n1(price / F.eps[1])}x FY28E`,
  blocks: [
    { callout: `**What you are buying:** India's #4 carmaker and largest car exporter, backed by one of the world's biggest car groups, with ~12.6% of the domestic market, a 12-13% EBITDA margin in normal years, net cash of ~₹9,500 cr, negative working capital, a new plant at Pune and two all-new SUVs arriving in H2FY27.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS, after two years of falling share and profit. The market has paid a median ${n1(PE12.med)}x forward over the last year and auto stocks were below their own recent medians on 30-Sep-2026. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Bayon and the EV lift domestic share back above 13.5%', 'Medium', 'Monthly domestic sales vs SIAM; Vahan registrations; waiting periods'],
      ['Margins back at 13%+ in FY28 (utilisation, lower discounts, commodities easing)', 'Medium', 'Quarterly EBITDA margin; discount levels; commodity prices'],
      ['Exports back to 50k+ a quarter as West Asia shipping normalises', 'Medium', 'Monthly exports; Middle East orders'],
      ['Higher payout or buyback, or a clear royalty cap', 'Low', 'Board decisions; AGM notices'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Share keeps falling as M&M, Tata, Maruti and Kia launch more SUVs', 'Medium-High', 'Domestic growth below the industry; FY28E EPS 10-15% below ours'],
      ['Industry slows sharply after the post-GST base (H2FY27 onward)', 'Medium', 'Volume and discount pressure; operating deleverage on the new capacity'],
      ['Commodity inflation persists (precious metals, copper, steel)', 'Medium', 'Each 1pp of EBITDA margin ≈ ₹8-9 a share of FY28E EPS'],
      ['West Asia conflict keeps exports down', 'Medium', 'Exports are a quarter of volume and earn higher prices'],
      ['Parent extracts more value (royalty, parts prices, stake sales)', 'Low-Medium', 'Lower margins or a share overhang'],
      ['Capex overruns: the full ₹45,000 cr plan by FY30', 'Medium', 'Depreciation up faster; free cash flow negative; ROE toward 20%'],
      ['Old disputes crystallise (CCI ₹420 cr, GST cess and excise demands)', 'Low', 'One-off charges of a few hundred crore'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to BUY below ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers, or sooner if Bayon and the EV clearly lift share and margins.`,
      `**This is an earnings call more than a multiple call.** Our ${MULT.base}x is close to the street's 24-30x; our Sep-28E EPS (₹${n1(epsSep.base)}) is below the street's FY28E (~₹86-90) because we charge more depreciation and expect a slower export recovery. At the street's median target (₹${n0(medTp)}) the stock would be on ~${n1(medTp / epsSep.base)}x our Sep-28E EPS.`,
      `**Biggest swing factor:** margins. Each 1pp of EBITDA margin in FY28-29E is ~₹${n0(r10(F.sales[1] * 0.01 * 0.742 / F.shares * MULT.base))} a share at our multiple; each 1x on the multiple is ~₹${n0(epsSep.base)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Domestic market share, FY26', v: `${n1(A26.domestic / A26.industry * 100)}%`, d: 'FY24 14.6%; now #4 behind M&M and Tata' },
      { k: 'EBITDA margin, Q1FY27', v: '9.3%', d: 'guide 11-14%; FY24 13.0%' },
      { k: 'Royalty to the parent, FY26', v: '₹1,975 cr', d: '2.8% of revenue' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `12-month forward median ${n1(PE12.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['PV, SUV, MPV', 'Passenger vehicles (cars, SUVs, vans); sport-utility vehicles; multi-purpose vehicles. SUVs and MPVs together are "utility vehicles".'],
      ['Wholesales vs retail', 'Wholesales are factory dispatches to dealers (what companies and SIAM report); retail is sales to customers (registrations).'],
      ['SIAM', 'Society of Indian Automobile Manufacturers: publishes industry wholesale data.'],
      ['HMC / HMIL', 'Hyundai Motor Company (South Korea, the parent, 82.5%) / Hyundai Motor India Ltd (the listed company).'],
      ['Royalty', 'A fee HMIL pays HMC for using its designs, technology and brand, charged on sales.'],
      ['Related-party transactions', 'Deals with companies of the same group (here HMC, Kia, Mobis and others); they need audit-committee and often shareholder approval.'],
      ['GST 2.0', 'India\'s Sep-2025 goods and services tax reform: small cars from 28% plus cess to 18%; larger cars to a flat 40%; EVs 5%.'],
      ['CAFE', 'Corporate average fuel efficiency norms: limits on the average CO2 emissions of a maker\'s fleet, with penalties.'],
      ['PLI', 'Production-linked incentive: government payments for local manufacturing of advanced vehicles that meet local value-addition rules.'],
      ['CNG, EV, LHD', 'Compressed natural gas cars; electric vehicles; left-hand-drive versions for export markets.'],
      ['Offer for sale (OFS)', 'An IPO in which existing shareholders sell shares; the company raises no money.'],
      ['Revenue per vehicle', 'Revenue from operations ÷ vehicles sold (domestic + exports); includes parts, services and incentives.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move / de-rating', 'How far comparable stocks trade below their own median P/E over the same window, on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, as Hyundai has net cash).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '−5% (consolidated from FY21): Covid lockdowns.',
  'sales@FY23': '+27%: volumes +18% to 7.21 lakh as chip supply returned; SUV mix rose.',
  'pat@FY23': '+62%: operating leverage; margin 12.5%.',
  'sales@FY24': '+16%: volumes 7.78 lakh (Exter launched); revenue per vehicle +7%.',
  'ebitdaMargin@FY24': '13.0%, the peak: mix, softer commodities.',
  'pat@FY24': '+29% to ₹6,060 cr (EPS ₹74.6); ~₹15,400 cr of dividends paid to HMC before the IPO.',
  'sales@FY25': '−1%: domestic volume −2.6%; exports flat.',
  'pat@FY25': '−7%: lower volume, higher costs; listed on 22-Oct-2024.',
  'cfo@FY25': '−53%: working capital (customer advances fell by ~₹860 cr) and taxes.',
  'sales@FY26': '+2%: domestic −2.3%, exports +16.4%; GST 2.0 lifted H2.',
  'ebitdaMargin@FY26': '−80bp to 12.1%: commodities, Pune start-up costs, Labour Codes.',
  'dep@FY26': '+4%: Pune plant capitalised from Oct-2025 (₹6,986 cr).',
  'sales@Q2FY26': 'Exports a record 51,400.',
  'opm@Q4FY26': '10.4%: commodities (~120bp, half one-off), Labour Codes, Pune costs.',
  'sales@Q1FY27': '−0.5%: supplier fire cost ~13,900 vehicles; exports −20%.',
  'opm@Q1FY27': '9.3%: lost volume, commodities (~100bp QoQ), weak exports.',
  'pat@Q1FY27': '−35% YoY to ₹889 cr.',
  'sales@FY27E': 'GAM: volume +6.8% (domestic +9%, exports flat), revenue per vehicle +2.5%.',
  'ebitdaMargin@FY27E': 'GAM: 11.0%: Q1 9.3%, ~11.5% for Q2-Q4; bottom of the 11-14% guide.',
  'capex@FY27E': 'Guided ~₹7,500 cr (Pune Phase 2, Chennai upgrades, launches).',
  'pat@FY28E': 'GAM: +25%: volume +10%, margin 12.3%, two new SUVs for a full year.',
};

module.exports = { risks, glossary, statementNotes };
