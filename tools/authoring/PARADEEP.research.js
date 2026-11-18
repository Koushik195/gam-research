// Paradeep report, part B: merges PARADEEP.part2-6.js (built on PARADEEP.ctx.js) and adds the verdict,
// glossary and statement notes. Written as of 30-Sep-2026 (Q1FY27 basis). Prose numbers come from
// research/company.json, deep.json, segments.json and the built model; forecast and valuation figures are
// live tokens ({{...}}) that follow assumptions.json.
const X = require('./PARADEEP.ctx');
const P2 = require('./PARADEEP.part2'), P3 = require('./PARADEEP.part3'), P4 = require('./PARADEEP.part4'), P5 = require('./PARADEEP.part5'), P6 = require('./PARADEEP.part6');
const { F, B, SC, n0, n1, pctChg, price, mult, pe28, peSep28, rating, buyBelow, sellAbove, ruleText, nd, ndEbitda, fwdMed, epsSep28 } = X;
const eps500 = B.volumeMt[1] * 500 / 10 * (1 - 0.252) / 103.75;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good operator in a policy squeeze, with more debt than the price allows for',
  blocks: [
    { callout: '**What you are buying:** India\'s second-largest private phosphatic fertiliser maker, with three port-based plants, OCP of Morocco as co-promoter and main supplier, share gains in NPKs and a plan to make all its own acid. Its profit depends on subsidy rates set by the government each season, on imported sulphur, ammonia and acid, on the monsoon, and on how fast the government pays (₹4,600 cr owed at Jun-2026).' },
    { callout: `**What you are paying:** ${n1(pe28)}x our FY28E EPS and ${n1(peSep28)}x Sep-28E, against a one-year-forward median of ${n1(fwdMed)}x since listing and fertiliser peers that mostly trade at 8-9x trailing. On the street's own method with our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}). The price assumes the integration payoff (₹7,000/t) arrives roughly on time and that the balance sheet does not matter.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (the HOLD line on our target) or ~₹${n0(buyBelow)} (BUY)`, 'Medium', 'Share price after the rabi subsidy decision and Q2FY27'],
      ['Rabi NBS rates that fully cover the Middle East cost spike', 'Medium', 'Per-kg N and P rates vs input costs; any extra DAP or NPK package'],
      ['EBITDA per tonne holds above ₹5,500 without inventory gains', 'Low-medium', 'Q2-Q4FY27 EBITDA/t; trading share of volume'],
      ['Big project awarded at or below ₹3,600 cr with a firm date', 'Medium', 'Contract award, financing, interest capitalised'],
      ['Subsidy receivable and net debt fall', 'Low-medium', 'Receivable below ₹3,000 cr; net debt below 2.5x EBITDA'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Rabi rates stay inadequate; sulphur stays above $1,000/t', 'Medium', `Bear-case FY28E EPS ₹${n1(SC.bear.eps[1])}, ${Math.abs(pctChg(SC.bear.eps[1], F.eps[1]))}% below our base`],
      ['Weak rabi in the east and south after a 74-76%-of-normal monsoon there', 'Medium', 'Lower volumes, higher inventory and interest'],
      ['Subsidy payments slow (fiscal pressure in a high-price year)', 'Medium', 'Every ₹1,000 cr of extra receivable adds ~₹70-80 cr of interest a year (at 7-8%)'],
      ['Big project cost overrun or further delay', 'Medium', 'More debt and depreciation before the EBITDA/t benefit'],
      ['Rupee depreciation', 'Medium', 'FY26 had ₹145 cr of exchange loss in finance cost'],
      ['Promoter pledge or related-party issues', 'Low', '15% of promoter shares pledged at Jun-2026; half of purchases from OCP group'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Turn neutral (HOLD) below ~₹${n0(sellAbove)}**, and positive below ~₹${n0(buyBelow)}, or on evidence that rabi subsidies and phase-1 acid hold EBITDA above ₹5,500/t while net debt falls.`,
      `**Biggest swing factor:** EBITDA per tonne. Every ₹500/t moves FY28E EPS by ~₹${n1(eps500)} (≈${Math.round(eps500 / F.eps[1] * 100)}%).`,
      `**Second swing factor:** the multiple. At the street's 13x on our Sep-28E EPS the value would be ~₹${n0(13 * epsSep28)}, about today's price: the market is already paying the street's multiple on our (lower) earnings. The bull case (management's path, 13x) gives {{scen.bull.tp|inr}}.`,
      `**Third:** the balance sheet. We model net debt of ~₹${n0(Math.round(nd(0) / 100) * 100)} cr at Mar-27E (${n1(ndEbitda(0))}x EBITDA); a quicker subsidy cycle would cut it by up to ~₹2,000 cr.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'EBITDA per tonne, Q1FY27', v: '₹7,309', d: 'cheap stock; FY27E ₹' + n0(B.ebitdaPerTonne[0]) },
      { k: 'Sulphur, end-July 2026', v: '$1,000+', d: '~$850 Q1 average; ~$350 a year earlier' },
      { k: 'Subsidy owed, Jun-2026', v: '₹4,600 cr', d: '₹3,847 cr at Mar-2026' },
      { k: 'Net debt, Mar-27E', v: `₹${n0(Math.round(nd(0) / 100) * 100)} cr`, d: `${n1(ndEbitda(0))}x EBITDA; ₹6,489 cr at Mar-26` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'Company, GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['DAP', 'Di-ammonium phosphate (18% N, 46% P₂O₅): the most used phosphatic fertiliser; its farm price is held at ₹1,350 a 50 kg bag.'],
      ['NPK / complex fertilisers', 'Granular fertilisers combining nitrogen (N), phosphorus (P) and potash (K), e.g. 20:20:0:13 (with 13% sulphur), Paradeep\'s lead grade.'],
      ['TSP / SSP / MOP', 'Triple super phosphate (46% P₂O₅, imported), single super phosphate (16%), muriate of potash.'],
      ['Urea', 'The main nitrogen fertiliser; price and cost are controlled by the government (cost plus a return under energy norms).'],
      ['NBS', 'Nutrient Based Subsidy: a fixed subsidy per kg of N, P, K and S in each P&K fertiliser, reset every season (kharif Apr-Sep, rabi Oct-Mar).'],
      ['Phosphoric / sulphuric acid', 'Phosphoric acid (from rock phosphate and sulphuric acid) is the main input for DAP/NPK; sulphuric acid is made by burning sulphur.'],
      ['Ammonia', 'The nitrogen input for DAP, NPKs and urea; India imports most of it.'],
      ['OCP', 'Office Chérifien des Phosphates, Morocco\'s state phosphate group, co-owner of Paradeep\'s promoter (ZMPPL) and its main supplier.'],
      ['MCFL', 'Mangalore Chemicals & Fertilizers, merged into Paradeep (effective Oct-2025, appointed date 1-Apr-2024).'],
      ['Appointed date / restatement', 'The date from which a merger takes effect in the accounts; Paradeep restated FY25 to include MCFL.'],
      ['Backward integration', 'Making one\'s own raw materials (here phosphoric and sulphuric acid) instead of buying them.'],
      ['EBITDA per tonne', 'EBITDA ÷ tonnes sold. Screener basis excludes other income; the company\'s figure includes it.'],
      ['Buyer\'s credit', 'Short-term foreign-currency loans from banks to pay for imports; exchange moves on them are booked in finance cost.'],
      ['Pledge', 'Shares given as security for a loan; lenders can sell them if the loan is not repaid.'],
      ['P/E; EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value + net debt) ÷ EBITDA.'],
      ['DCF / WACC', 'Discounted cash flow; WACC is the weighted cost of equity and debt (here 11%).'],
      ['LPA', 'Long-period average rainfall used by IMD to define a normal monsoon.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover: P2.cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.phos, P3.urea, P3.projects, P4.moat, p.financials, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P6.valuation, risks, p.statements, glossary],
  statementNotes: require('./PARADEEP.notes'),
};
