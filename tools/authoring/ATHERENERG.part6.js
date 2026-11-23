// Ather Energy report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./ATHERENERG.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, shares, EVS, MULT, rating, buyBelow, sellAbove, medTp, salesSep, evSep, impliedMult, atMult } = X;
const r10 = v => Math.round(v / 10) * 10;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a business we like, at a price that already assumes it wins; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** India's most premium e-scooter brand, ~16-17% of a market growing ~70% in 2026, a software and charging ecosystem rivals have not matched, gross margins (21% without subsidy) that no longer depend on Delhi, ~₹4,400 cr of pro forma net cash and a plant that more than doubles capacity from January 2027. Q1FY27 was its first EBITDA-positive quarter on its own measure.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(evSep)}x Sep-28E revenue, against a ${n1(EVS.med)}x median over the past 12 months; the multiple doubled in five months as brokers raised targets. To justify today's price on our ${MULT.base}x the company would need Sep-28E revenue of ~₹${n0(r10((price * shares - (F.treasury[1] + F.treasury[2]) / 2) / MULT.base))} cr, ~${Math.round(((price * shares - (F.treasury[1] + F.treasury[2]) / 2) / MULT.base / salesSep.base - 1) * 100)}% above ours. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low-Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%; it traded there in July 2026`],
      ['AURIC at 42,000 a month by Q1FY28 and share back above 18%', 'Medium', 'Monthly Vahan registrations; SIAM production; Q3-Q4 calls'],
      ['Konarc sells without hurting revenue per scooter or the software attach rate', 'Medium', 'Konarc share of volume; AtherStack Pro attach (guided 75%+)'],
      ['EBITDA margin above 5% before FY28 (commodities ease, operating leverage)', 'Medium', 'Quarterly margin before other income'],
      ['AURIC Phase 2 committed with demand visibility', 'Medium', 'Capex announcements; pre-order run-rate'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['TVS, Bajaj and Hero keep taking share as supply catches up; price competition returns', 'Medium-High', 'Volume and price below ours; margins stay near breakeven'],
      ['AURIC ramp slips by a quarter or more', 'Medium', '~40-50k fewer scooters across FY27-28E; fixed costs before volume'],
      ['Commodities (lithium, copper, rare earths) rise further', 'Medium', `Each 1pp of gross margin ≈ ₹${n0(F.sales[1] * 0.01)} cr of FY28E EBITDA`],
      ['PM E-DRIVE ends in Mar-2028 without a successor; state policies stall', 'Medium', '₹5,000 a scooter of realisation; demand pull-forward then a gap'],
      ['Fuel shock fades and e-2W adoption slows back to FY26 rates', 'Medium', 'Industry growth halves; the multiple de-rates'],
      ['More equity raised to fund Phase 2 or new platforms (motorcycles)', 'Medium', 'Dilution; equity has been issued every year since FY23'],
      ['Short-term: the multiple returns to its 12-month median', 'Medium', `At ${n1(EVS.med)}x Sep-28E revenue the stock is worth ~₹${n0(atMult(EVS.med))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's target we would move to HOLD below ~₹${n0(sellAbove)} and to BUY below ~₹${n0(buyBelow)}**, or raise the target if AURIC and Konarc deliver volumes and margins above ours.`,
      `**This is a multiple call more than an earnings call.** Our revenue is close to the street for FY27 and below Nomura for FY28-29; but even at the street's revenue the house multiple (${MULT.base}x) gives far less than the price. The street's median target (₹${n0(medTp)}) implies ~${n1(impliedMult(medTp))}x our Sep-28E revenue.`,
      `**Biggest swing factor:** the multiple. Each 0.5x on EV/Sales is ~₹${n0(r10(0.5 * salesSep.base / shares))} a share; each 10% on Sep-28E revenue is ~₹${n0(r10(0.1 * salesSep.base * MULT.base / shares))}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Scooters sold, Q1FY27', v: '83,173', d: '+81%; Hosur at its ~35,000/month ceiling' },
      { k: 'E-2W market share, Aug-2026', v: '15.9%', d: '18.6% in Q4FY26 (Vahan)' },
      { k: 'EBITDA margin before other income, Q1FY27', v: '−2.7%', d: 'FY25 −26%, FY26 −11%' },
      { k: 'EV ÷ Sep-28E revenue', v: `${n1(evSep)}x`, d: `12-month forward median ${n1(EVS.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['E-2W, ICE', 'Electric two-wheeler (scooter or motorcycle); internal-combustion-engine (petrol) vehicle.'],
      ['Penetration', 'Electric two-wheelers as a share of all two-wheelers sold.'],
      ['Wholesale vs registrations', 'Wholesale = dispatches from the factory to dealers (what Ather reports as "units sold"); registrations = vehicles registered on the government Vahan portal (retail sales).'],
      ['Vahan', 'The government\'s national vehicle-registration database, the usual source for e-2W market shares.'],
      ['PM E-DRIVE, FAME, EMPS', 'Central-government EV subsidy schemes: FAME-II (2019-24), EMPS (2024), PM E-DRIVE (from Oct-2024; e-2W subsidy ₹5,000 a vehicle, extended to Mar-2028).'],
      ['PLI', 'Production-linked incentive: payments for local manufacturing of advanced vehicles and components that meet local value-addition rules.'],
      ['AURIC', 'Aurangabad Industrial City in Chhatrapati Sambhaji Nagar, Maharashtra: site of Ather\'s second plant ("Factory 3.0").'],
      ['EL platform, Konarc', 'Ather\'s new low-cost scooter platform and its first model (launched 29-Aug-2026 from ₹99,999).'],
      ['AtherStack Pro', 'Ather\'s paid software pack (navigation, safety and ride features, updates); "attach rate" = share of buyers who take it.'],
      ['LECCS', 'Light Electric Combined Charging System: the charging connector Ather developed, now an Indian standard.'],
      ['AGM', 'Adjusted gross margin: total income less materials and stock changes, as % of total income (company definition).'],
      ['EBITDA (two definitions)', 'Company: profit before tax, interest and depreciation, including other income. Ours (Screener): excluding other income.'],
      ['QIP, warrants', 'Qualified institutional placement: a share sale to institutions. Warrants: rights to buy shares later at a fixed price (here ₹1,260, 25% paid up front, within 18 months).'],
      ['EV/Sales', 'Enterprise value (market value less net cash) ÷ revenue. Used for loss-making growth companies.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward figure the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade below (or above) their own median P/E over the same window, on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return (here the cost of equity, as Ather has net cash).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY22': '+410%: 450X volumes scale up with FAME-II subsidies.',
  'sales@FY23': '+336%: first full year at scale; Hosur plant.',
  'sales@FY24': '−2%: FAME-II subsidy cut (Jun-2023); volumes 1.10 lakh.',
  'pat@FY24': 'Loss ₹1,060 cr incl. ₹174 cr exceptional charge.',
  'sales@FY25': '+29%: Rizta (Apr-2024); volumes +42% to 1.55 lakh.',
  'sales@FY26': '+63%: volumes +69% to 2.63 lakh; first consolidated year.',
  'ebitdaMargin@FY26': '−11%: operating leverage; COGS per unit −9%.',
  'eps@FY26': 'Pro forma: −₹517 cr on 40.41 cr fully diluted shares (QIP, IJF shares and warrants of Jul/Aug-2026). Reported −₹13.51 (Screener) / −₹13.99 (AR, standalone).',
  'cfo@FY26': '+₹32 cr (AR FY26): first positive year; Screener\'s cash-flow rows are one year late and were realigned.',
  'capex@FY26': 'AURIC factory and EL platform development.',
  'sales@Q2FY26': 'Volumes +42% to 65,595.',
  'sales@Q3FY26': 'Derived: FY26 less Q1, Q2 and Q4 (Screener omits the quarter).',
  'opm@Q1FY27': '−2.7% before other income; +0.8% on the company\'s definition.',
  'sales@Q1FY27': '+89%: volumes +81%, revenue per unit +4.6%.',
  'sales@FY27E': 'GAM: 4.3 lakh units (+64%); AURIC from Q4.',
  'ebitdaMargin@FY27E': 'GAM: near breakeven; AURIC costs from Q4.',
  'capex@FY27E': 'GAM: AURIC Phase 1 completion and EL capitalisation.',
  'sales@FY28E': 'GAM: 7 lakh units (+63%); Konarc 43% of volume.',
  'pat@FY28E': 'GAM: first annual profit; no tax (carried-forward losses).',
  'pat@FY29E': 'GAM: full 25.17% tax charged (conservative).',
};

module.exports = { risks, glossary, statementNotes };
