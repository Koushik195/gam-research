// Bharat Petroleum report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./BPCL.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, OWN, MULT, rating, buyBelow, sellAbove, medTp, ebSep, fwdEvNow, fwdPe, bld, shares, epInv } = X;
const perK = v => n1(v * MULT.base / shares); // ₹ a share per ₹v cr of Sep-28E EBITDA

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: the best-run PSU marketer, priced about right for a business whose margins the state sets; ${rating}`,
  blocks: [
    { callout: `**What you are buying:** three complex refineries (35.3 MMTPA) running above nameplate, India's most productive fuel-station network, ₹${n0(X.listedMv)} cr of listed stakes (Petronet, IGL, Oil India), ₹${n0(epInv + X.EPI.investees)} cr of upstream at book that earns nothing yet, a ₹1.7 lakh cr capex plan, and a 52.98% state owner that decides retail prices. EPS of ₹${n1(F.eps[0])} / ${n1(F.eps[1])} / ${n1(F.eps[2])} in FY27-29E on our numbers.` },
    { callout: `**What you are paying:** ₹${n1(price)} is ${n1(fwdPe)}x FY28E EPS and ${n1(fwdEvNow)}x FY28E core EBITDA (after taking out all investments at book), about the stock's own history (${n1(OWN.med)}x median) and above it once the sector's discount to its averages is applied. Our ${MULT.base}x Sep-28E downstream EBITDA (₹${n0(ebSep)} cr), with upstream at book and stakes at market less 20%, gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street is more generous (median ₹${n0(medTp)}) because it pays 5.5-6.5x EBITDA and adds investments on top.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low-Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Retail prices move back to market (daily pricing) with crude', 'Low-Medium', 'Price changes after Q2; SAED and export-duty reviews'],
      ['Compensation of the ₹15,804 cr negative LPG buffer', 'Medium', `Each ₹5,000 cr is ~₹${n0(5000 * 0.75 / shares)} a share after tax`],
      ['Mozambique LNG on time (mid-2028) and Brazil without more write-downs', 'Medium', 'Construction progress; BPRL impairments'],
      ['Independent directors appointed; audit committee restored', 'Medium', 'Board notices'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Crude stays above US$90 with retail prices frozen (elections, inflation)', 'Medium', `Each ₹500/t of downstream EBITDA ≈ ₹${n0(500 * bld[1].vol / 10)} cr (₹${perK(500 * bld[1].vol / 10)} a share at ${MULT.base}x)`],
      ['LPG under-recoveries not compensated, or compensated late', 'Medium', 'Cash and debt; the current package ends Oct-2026'],
      ['Export duties on refining margins kept or raised', 'High', 'Caps the refining upside (US$41.4 → 17.0 GRM in Q1)'],
      ['Capex overruns, or the Andhra refinery (~₹95,000 cr) sanctioned', 'Medium', 'Free cash flow negative for longer; leverage toward the 1x ceiling'],
      ['Upstream: Brazil delays, Mozambique security or cost issues', 'Medium', `Upstream is ₹${n0((epInv + X.EPI.investees) / shares)} a share at book`],
      ['Petrochemicals (Bina) earn 2-3% margins, as Indian peers did in FY23-25', 'Medium', 'Low returns on ~₹50,000 cr'],
      ['Government offer for sale (above 51%) or policy-driven capex', 'Low-Medium', 'Supply overhang; lower returns'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to BUY below ~₹${n0(buyBelow)} and to SELL above ~₹${n0(sellAbove)}**, on today's numbers.`,
      `**This is a multiple and policy call, not an earnings call.** Our FY28E EBITDA (₹${n0(F.ebitda[1])} cr) is in line with Motilal Oswal and JM. Each 0.5x on the EV/EBITDA multiple is ~₹${n0(0.5 * ebSep / shares)} a share; the bull multiple (${MULT.bull}x, no sector move) with stakes at market gives {{scen.bull.tp|inr}}.`,
      '**What would change our mind:** evidence that marketing margins are being protected in this cycle (a price path that follows crude, compensation paid on time), capital discipline on the Andhra refinery, or a material fall in the price.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Refinery utilisation FY26', v: '116%', d: '41.15 MMT on 35.3 MMTPA' },
      { k: 'Downstream EBITDA per tonne', v: '₹2,260-8,640', d: 'trough vs good years, FY22-26' },
      { k: 'Q1FY27 standalone profit', v: '−₹3,962 cr', d: 'GRM US$41.4 before export duty' },
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
      ['LPG buffer', 'The running total of LPG under-recoveries not yet compensated (₹15,804 cr negative at Jun-2026).'],
      ['SAED', 'Special additional excise duty: on petrol and diesel sold in India (cut ₹10/litre on 27-Mar-2026) and, re-imposed in 2026, on exports.'],
      ['Nelson complexity', 'A measure of how many secondary units a refinery has; higher means it can turn cheaper crude into more valuable products.'],
      ['MMT / MMTPA', 'Million metric tonnes / million metric tonnes per year (capacity).'],
      ['BPRL', 'Bharat PetroResources, BPCL\'s 100% upstream (exploration and production) subsidiary.'],
      ['FCTR', 'Foreign currency translation reserve: exchange gains on a foreign investment held in equity, released to profit when control changes.'],
      ['Core EV/EBITDA', 'Market value plus debt, less cash and all investments, divided by EBITDA before other income.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade above or below their own five-year median multiple on the valuation date.'],
      ['SOTP', 'Sum of the parts: each business and stake valued separately, less net debt.'],
      ['Invested value', 'What has been spent on an asset (its book value), used when it does not yet earn.'],
      ['Treasury shares', 'BPCL\'s own 6.59 cr shares held by the BPCL Trust for Investment in Shares; excluded from EPS and from our share count.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended cost of debt and equity (10.4% here).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'pat@FY20': '₹3,666 cr after a ₹1,602 cr exceptional charge (Screener).',
  'pat@FY21': 'Includes a ₹3,783 cr after-tax exceptional gain (the year the Numaligarh stake was sold).',
  'sales@FY22': '+51%: crude price recovery.',
  'ebitda@FY23': 'Retail prices held while crude spiked after the Ukraine war.',
  'pat@FY23': '₹2,131 cr: marketing losses.',
  'ebitda@FY24': 'Record: crude fell, retail prices did not; GRM US$14.1/bbl.',
  'ebitda@FY25': 'GRM fell to US$6.8/bbl; LPG losses.',
  'ebitda@FY26': '₹41,202 cr; GRM US$11.74/bbl; LPG compensation booked from Nov-2025.',
  'pat@FY26': '₹25,843 cr; standalone ₹23,303 cr after a ₹4,349 cr Brazil impairment.',
  'pat@Q4FY26': '₹5,625 cr; GRM US$17.5 helped by inventory gains.',
  'pat@Q1FY27': 'Loss of ₹1,873 cr after a ₹1,885 cr one-off FCTR gain (IBV Brasil); standalone loss ₹3,962 cr.',
  'otherIncome@Q1FY27': 'Includes the ₹1,885 cr FCTR gain.',
  'ebitda@FY27E': 'GAM: ₹3,600/t downstream EBITDA (Q1 about −₹2,800/t).',
  'ebitda@FY28E': 'GAM: ₹5,400/t, a little below the FY22-26 average.',
  'capex@FY27E': 'GAM: guidance ₹25,000 cr, possibly ₹26,000-27,000 cr.',
};

module.exports = { risks, glossary, statementNotes };
