// IRCTC report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./IRCTC.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, pc, price, MULT, SENS, MV, FM, rating, buyBelow, sellAbove, medTp, epsSep, at, mv, sepNow } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a monopoly at ${n1(sepNow)}x Sep-28E EPS; ${rating}, if the multiple recovers part of its de-rating`,
  blocks: [
    { callout: '**What you are buying:** the Railways\' sole online ticket seller (89% of reserved tickets, 80%+ segment margin), its mandated caterer, its water supplier and its pilgrim-train operator. No debt, ~₹2,870 cr of cash and deposits, ROE ~35%, a 52% payout, and growth of ~11% a year in revenue from catering and tourism.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(sepNow)}x Sep-28E EPS for ~${Math.round(X.epsCagrFwd)}% a year EPS growth, a fee set by the controlling shareholder and a ~5% government sale still to come. Since 2021 the market has paid a median ${n1(FM.median)}x forward for IRCTC. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. With no sector move it would be ~₹${n0(at(SENS.none))}; with the internet platforms' move alone ~₹${n0(at(SENS.net))}; the DCF says ~₹${n0(mv('dcf').value)}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['A convenience-fee revision, or UPI tickets moved to the card fee', 'Low-Medium', 'Ministry or Railway Board orders; each 10% on the fee adds ~5% to EPS'],
      ['Non-fee income back to ₹150 cr a quarter (iPay licence, loyalty, unified portal)', 'Medium', 'RBI decision within FY27; Q2-Q3 non-convenience income'],
      ['Catering margin back to 11-12% as one-offs and POC trains end', 'Medium', 'Q2FY27 segment margin (due by mid-November 2026)'],
      ['OFS completed and a regular CMD appointed', 'Medium-High', 'Removes the supply overhang and leadership gap'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['The Railways take a share of the convenience fee (as ordered in Oct-2021)', 'Low', 'A 50% share would cut EPS by roughly a quarter'],
      ['RailOne or another Railways channel books tickets without IRCTC\'s fee', 'Low-Medium', 'Ticketing is ~75% of segment profit'],
      ['UPI keeps rising and the fee stays flat', 'High', 'Ticketing revenue flat in real terms; margin mix keeps falling'],
      ['Catering margins stay at 9-10% (prepaid trains, GST without credit, branded-catering trials)', 'Medium', 'EBITDA margin towards 27%'],
      ['OFS at a discount; PSU and platform stocks de-rate further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS the stock is worth ~₹${n0(at(MULT.bear))}`],
      ['A reconciliation or court ruling on balances with the Railways (CC-60 licence fees)', 'Low-Medium', 'One-off profit swing; size not disclosed'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**This is a multiple call, and we say so.** Our EPS is 2-3% below PL's. The house rule takes IRCTC's own forward P/E median (${n1(FM.median)}x) and applies the five-name sector move (${pc(MV.all)}): ${MULT.base}x. Without a sector move the target would be ~₹${n0(at(SENS.none))}; with the two internet names alone (${pc(MV.net)}) ~₹${n0(at(SENS.net))} (a HOLD); with the railway PSUs alone (${pc(MV.rail)}) ~₹${n0(at(SENS.rail))}.`,
      `**We would move to HOLD above ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers, or sooner if ticketing revenue keeps falling in real terms.`,
      `**Biggest swing factors:** the multiple (each 1x is ~₹${n0(epsSep.base)} a share) and the convenience fee (each 10% is ~5% of EPS).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Share of reserved tickets online', v: '88.9%', d: 'Q1FY27' },
      { k: 'Ticketing revenue growth, Q1FY27', v: '+0.6%', d: 'catering +33.9%' },
      { k: 'EBITDA margin', v: '28.2%', d: 'Q1FY27; 36.0% in FY23' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `own median since 2021: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Convenience fee', 'The fee IRCTC adds to each online railway ticket: ₹10 (non-AC) / ₹20 (AC) when paid by UPI, ₹15 / ₹30 by card or credit line.'],
      ['Non-convenience income', 'Ticketing income other than the fee: advertising, agent fees, payment-gateway and e-wallet income, iPay commissions.'],
      ['Prepaid trains', 'Trains whose fare includes food (Vande Bharat, Rajdhani, Shatabdi, Duronto, Tejas); IRCTC books the turnover and pays the caterer.'],
      ['Licence fee', 'What a private caterer or stall pays IRCTC for the right to serve a train or station.'],
      ['E-catering / e-pantry', 'Meals ordered online from restaurants for delivery at stations / ordered from the train\'s own pantry by app or QR code.'],
      ['Rail Neer', 'IRCTC\'s packaged drinking water brand; profit is shared with the Railways.'],
      ['State Teertha, Bharat Gaurav', 'Pilgrimage and theme tourist trains run for state governments or as packages.'],
      ['RailOne', 'The Railways\' own passenger app (built by CRIS); reserved tickets are still booked through IRCTC\'s system.'],
      ['iPay', 'IRCTC Payments Ltd, a subsidiary seeking an RBI payment-aggregator licence.'],
      ['OFS', 'Offer for sale: the government sells existing shares through the stock exchanges, usually at a floor price below the market.'],
      ['CPSE / Navratna / DIPAM', 'Central public-sector enterprise / a status giving more financial autonomy / the finance ministry department that manages government shareholdings, dividends and stake sales.'],
      ['Segment result', 'A segment\'s profit as the company reports it: after its own costs and depreciation, before unallocated income, costs and tax.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade below (or above) their own five-year median P/E on the valuation date.'],
      ['DCF', 'Discounted cash flow valuation; future free cash flow discounted at the cost of equity (no debt here).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '+21%: last pre-Covid year.',
  'sales@FY21': '−66%: Covid; trains and catering suspended for much of the year.',
  'pat@FY21': '−64%: ticketing kept the company profitable.',
  'sales@FY22': '+142%: trains back; catering still recovering (segment margin 5%, corporate presentation Sep-2023).',
  'ebitdaMargin@FY22': '46.5%, a mix peak: ticketing recovered before low-margin catering.',
  'sales@FY23': '+88%: first full normal year, catering fully back.',
  'ebitdaMargin@FY23': '36.0%: catering share back up.',
  'otherIncome@FY24': '₹106 cr after ₹59 cr of exceptional charges.',
  'otherIncome@FY25': '₹276 cr incl. ₹48 cr of legacy write-backs (exceptional).',
  'pat@FY25': '+18% reported; +11% before exceptional items.',
  'ebitdaMargin@FY26': '31.9%: catering and tourism grew faster; Q4 carried a full year of CSR (₹31 cr) and ₹16 cr of ECL.',
  'cfo@FY26': '₹1,273 cr: 91% of net profit (63% in FY25).',
  'opm@Q4FY26': '27%: CSR ₹31 cr and ECL ₹16 cr booked in the quarter.',
  'sales@Q1FY27': '+18%: catering +34% (incl. ₹41 cr of election specials), tourism +14%, ticketing +0.6%.',
  'opm@Q1FY27': '28%: ~₹20 cr one-time HR cost, ₹4 cr POC trains, ₹10 cr IT maintenance, resin costs.',
  'sales@FY27E': 'GAM: catering +19%, ticketing +4%, tourism +15%, Rail Neer +4%.',
  'ebitdaMargin@FY27E': 'GAM: segment margins 10% / 80% / 13.5% / 11.5%.',
  'otherIncome@FY27E': 'GAM: 6.75% on ₹2,868 cr of opening net treasury plus ₹80 cr of fines, deposit amortisation and rent.',
};

module.exports = { risks, glossary, statementNotes };
