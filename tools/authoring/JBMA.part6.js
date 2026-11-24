// JBM Auto report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./JBMA.ctx');
const { ruleText } = require('../../src/ratings');
const { F, AS, n0, n1, price, shares, MULT, FM, rating, buyBelow, sellAbove, epsSep, k, sepNow, nd0, SENS, mv } = X;
const E = epsSep.base;
const marginRs = Math.round((F.sales[1] + F.sales[2]) / 2 * 0.01 * (1 - AS.taxRate[1] / 100) / shares * MULT.base / 10) * 10;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a real e-bus franchise with weak cash flow, at ${Math.round(sepNow)}x Sep-28E EPS; ${rating} on the house multiple`,
  blocks: [
    { callout: '**What you are buying:** India\'s largest or second-largest e-bus maker (~24% share, ~20,000-bus plant), a pipeline of 7,000-7,500 buses backed by national schemes, outside investors in the operating JV, and a steady sheet-metal and tooling business that grew 15.5% in Q1FY27. EPS should grow ~20-30% a year for three years as revenue grows and interest falls.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for a business with an 11% EBITDA margin, ROE of 16-19% in our forecasts, free cash flow near zero and net debt of ~₹${n0(nd0)} cr. That is cheap against the stock's own ${n1(FM.median)}x forward-P/E median since Apr-2021, which is why our rule gives ${rating} with a target of {{dcf.tp|inr}} ({{dcf.upside|chg}}). It is not cheap against cash: the DCF says ₹${n0(mv('dcf').value)} and EV/EBITDA ₹${n0(mv('ev').value)}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Receivables and unbilled revenue fall (Crisil: gross current assets ~250 days by Mar-27)', 'Medium', 'Half-year balance sheets (Sep-2026, Mar-2027)'],
      ['Debt falls to ₹2,500 cr or below and interest to ~₹65 cr a quarter', 'Medium', 'Quarterly finance costs'],
      ['An EV-business deal at a value that covers JBM Auto\'s market value of the bus business', 'Low-Medium', 'Exchange filings on JBM Electric Vehicles'],
      ['Private and export bus sales above 25% of bus revenue at better margins', 'Medium', 'EV segment EBIT margin above 12%'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['City or state payments slow; Ecolife cannot fund new fleets', 'Medium', 'JBM Auto funds its JV again: receivables, debt and interest rise; EPS falls'],
      ['Tender prices per km fall as competition intensifies', 'Medium', `Each 1pp of FY28-29E EBITDA margin ≈ ₹${n0(marginRs)} a share at our multiple`],
      ['Revenue recognised before delivery is reversed or delayed', 'Low-Medium', 'Contract assets of ₹1,511 cr at Mar-26'],
      ['Dilution: a QIP under the ₹1,500 cr authority, or a stake sale in the EV subsidiary at a low value', 'Medium', 'Lower EPS or a lower share of bus profits'],
      ['Vehicle downturn hits components (57% of revenue)', 'Low-Medium', 'Component EBIT margin fell to 3% in FY21'],
      ['Sentiment: a retail-owned stock that fell 50% from its 2024 peak', 'Medium', 'The multiple can fall well below our bear case'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The case rests on the multiple.** ${MULT.base}x Sep-28E EPS (${n1(FM.median)}x median × ${k.toFixed(3)}) is what the house rule gives; the same rule without the 2023-24 re-rating gives ${SENS.exHype}x (~₹${n0(Math.round(SENS.exHype * E / 10) * 10)}). Investors who doubt that the market will again pay ~50x for this business should treat the target as the top of a range.`,
      `**We would move to HOLD above ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers.`,
      `**Biggest swing factor:** working capital. If receivables fall as Crisil expects, cash flow, interest and the DCF all improve; if they rise again, the P/E case weakens fast. Each 1x of multiple is ~₹${n1(E)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'E-buses in revenue', v: '38%', d: 'FY26; 12% in FY20' },
      { k: 'Receivables + unbilled revenue', v: '₹3,696 cr', d: '~61% of FY26 revenue' },
      { k: 'Operating cash flow FY26', v: '−₹60 cr', d: 'net profit ₹219 cr' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `median since Apr-21: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Gross cost contract (GCC)', 'A private operator buys, runs and maintains buses; the city pays it a fixed fee per kilometre for 10-12 years and keeps the fares.'],
      ['STU', 'State transport undertaking: a state-owned bus company, the main buyer of e-bus services.'],
      ['PM e-Bus Sewa / PM E-DRIVE', 'Central government schemes that support e-bus deployment in smaller cities (10,000 buses) and in nine large cities (14,028 buses).'],
      ['Joint venture, equity method', 'A company controlled jointly with other investors; only the share of its profit or loss appears in JBM\'s accounts, not its revenue or debt.'],
      ['Minority interest', 'The share of a subsidiary\'s profit that belongs to outside holders (15% of JBM Electric Vehicles).'],
      ['Contract assets (unbilled revenue)', 'Revenue booked for work done (buses or tools partly built) that has not yet been invoiced.'],
      ['Input method', 'Recognising revenue in proportion to costs incurred on a contract, before delivery.'],
      ['CCD / NCD', 'Compulsorily convertible debentures (turn into shares later) and non-convertible debentures (plain debt).'],
      ['Segment EBIT', 'Segment profit before interest and tax, as the company reports it.'],
      ['Net debt / EBITDA', 'Borrowings less cash and investments, divided by a year\'s EBITDA.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended required return on debt and equity used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '−12%: auto downturn and the Covid lockdown in Mar-2020; e-bus revenue ₹239 cr.',
  'pat@FY21': '−29%: Covid year; component EBIT margin 3.3%.',
  'sales@FY22': '+61%: components +73% as vehicle output recovered; e-buses ₹704 cr.',
  'pat@FY22': '+218% from a Covid base; tax rate 16% (AR FY23 comparatives).',
  'sales@FY23': '+21%: components +36%; e-buses fell to ₹550 cr between tender waves.',
  'pat@FY23': '−20%: interest up from ₹76 cr to ₹126 cr; e-bus EBIT margin 5%.',
  'sales@FY24': '+30%: e-buses ₹1,741 cr (3.2x) as city orders were delivered.',
  'interest@FY24': '+56%: working capital for buses.',
  'sales@FY25': '+9%: components +7%, e-buses +14%.',
  'otherIncome@FY25': '₹52 cr, ~1.7x FY24: interest income rose to ₹44 cr (AR FY25 segment note).',
  'sales@FY26': '+11%: components +8%, e-buses +16%, tool room +11%.',
  'otherIncome@FY26': '₹126 cr after a ₹13 cr exceptional charge: interest ₹92 cr (incl. on the ₹336 cr loan to JBM Ecolife at 10.5%), miscellaneous ₹36 cr.',
  'interest@FY26': '₹318 cr (+29%): receivables doubled as JBM Auto funded the JV\'s fleets.',
  'pat@FY26': '+8% (₹219 cr attributable; ₹19 cr to minorities).',
  'cfo@FY26': '−₹60 cr: receivables +₹1,573 cr.',
  'sales@Q4FY26': '+13%: e-buses ₹831 cr in the quarter (Q3 ₹632 cr).',
  'interest@Q4FY26': '₹108 cr, the peak, before the Jun-2026 repayment.',
  'sales@Q1FY27': '+15%: components +15.5%, e-buses +17%, tool room +4%.',
  'pat@Q1FY27': '+16% (₹42 cr): interest down to ₹83 cr; JV losses ₹8 cr.',
  'sales@FY27E': 'GAM: segment build (components +12%, tool room +7%, e-buses +20%).',
  'interest@FY27E': 'GAM: lower after ~₹410 cr of debt was repaid with JV money in Jun-2026.',
  'pat@FY27E': `GAM: +${Math.round(F.patGrowth[0])}%; tax rate ${AS.taxRate[0]}% includes the minority share.`,
};

module.exports = { risks, glossary, statementNotes };
