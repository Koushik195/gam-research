// Syngene report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./SYNGENE.ctx2');
const { F, V, SC, n0, n1, pc, price, mv, MULT, EVH, SECTOR_EV, epsU, evNowFwd, fwdNow, trailEv, rating, ruleText, buyBelow, sellAbove, SHARES, gNeeded, ptPerShare, evVal, SENS, cashPath, LEASES } = X;
const perTurn = Math.round(mv('ev').metric / SHARES);

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a damaged but solvent franchise priced for no recovery; on the house method we initiate with ${rating}, and the case stands or falls on FY28 growth`,
  blocks: [
    { callout: '**What you are buying:** one of India\'s largest integrated CRDMOs: ~400 clients, 16 of the top 20 pharma companies, BMS\'s 700-scientist dedicated centre (India\'s first and largest) renewed to 2035, 5,778 scientists, biologics plants in India and the US that few Indian peers have, and ₹1,800 cr of net cash. **What you are not buying:** a growth company today. Revenue falls in FY27, ROE is ~6%, discovery is losing price-sensitive clients, the biologics plants lost their one large commercial product, and the CEO has changed twice in 18 months.' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(evNowFwd)}x our FY28E EBITDA (${n1(trailEv)}x trailing) and ${n1(fwdNow)}x our FY28E EPS. On the street's method (EV/EBITDA), Syngene's own ${n1(EVH.med)}x median since 2021 lifted by the sector's +${SECTOR_EV}% gives ${MULT.base}x Sep-28E EBITDA = {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating} under the house rule. The P/E cross-check (₹${n0(mv('pe').value)}) is lower but also well above the price; the DCF (₹${n0(mv('dcf').value)}) is below it. In plain words: the stock is cheap against its own history and its peers, and not cheap against a DCF. Most of the upside to our target is the re-rating; without any, the FY28-29 recovery and the cash build alone give ~₹${n0(SENS.at(-1).tp)}. Both need the recovery to happen.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['H2FY27 revenue growth turns positive and the margin gets back above 25%', 'Medium', 'Q2FY27 results (due by mid-November 2026), Q3 and Q4'],
      ['A commercial biologic signed for Unit 3 or Bayview', 'Low-medium', 'Contract announcements; CDMO share of revenue back towards 35%'],
      ['Zoetis restarts Librela orders for FY28', 'Low-medium', 'Zoetis\'s FY28 forecast to Syngene by end-FY27'],
      ['Discovery stabilises with new-modality and AI-led work', 'Medium', 'Research services growth back to high single digits'],
      ['BIOSECURE list names Chinese CDMOs', 'Low-medium', 'US list of companies of concern (due by Dec-2026)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['FY28 recovery slips again (guidance has missed twice)', 'Medium-high', 'Bear case {{scen.bear.tp|inr}}'],
      ['Bayview stays empty after capitalisation', 'Medium', '~₹25-30 cr of depreciation plus running costs with no revenue'],
      ['Discovery attrition spreads beyond commodity work', 'Medium', 'Research growth below 5%; margin stuck near 20%'],
      ['Hedge losses persist if the rupee keeps falling', 'Medium', '₹50 cr a quarter in Q1FY27 = ~6 points of margin'],
      ['BMS changes the scope of BBRC', 'Low', 'Largest single relationship'],
      ['Biocon sells more shares', 'Medium', 'Supply overhang; no change to the business'],
      ['De-rating persists (the market keeps ~15x)', 'Medium', `Each 1x on the multiple ≈ ₹${perTurn} a share; at today's ${n1(evNowFwd)}x the value is ~₹${n0(SENS.at(-1).tp)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}**, HOLD between that and ~₹${n0(sellAbove)}, and SELL above it, on today's numbers. At ₹${n0(price)} the stock is far inside the BUY zone.`,
      `**Biggest swing factors:** the multiple and FY28-29 margins. Each 1x on EV/EBITDA is ~₹${perTurn} a share; each point of Sep-28E margin is ~₹${n0(ptPerShare)} a share at ${MULT.base}x. Without any re-rating (today's ${n1(evNowFwd)}x FY28E) our numbers still give ~₹${n0(SENS.at(-1).tp)}.`,
      '**Position size should reflect the spread of outcomes:** bull {{scen.bull.tp|inr}}, bear {{scen.bear.tp|inr}}, DCF ₹' + n0(mv('dcf').value) + '. This is a recovery call on a company that has not yet shown the recovery.',
      '**We would reconsider** if H2FY27 does not improve, if Bayview has no customer by early FY28, or if management cuts FY28 hopes.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Librela lost', v: '~US$50 mn', d: 'a year of revenue (management)' },
      { k: 'Two customers', v: '37%', d: 'of FY26 revenue (41% in FY25)' },
      { k: 'Net cash', v: '₹1,800 cr', d: `Mar-26, excl. ₹${n0(LEASES)} cr leases` },
      { k: 'Forward EV/EBITDA', v: `${n1(evNowFwd)}x`, d: `FY28E; median since 2021 ${n1(EVH.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['CRDMO / CRO / CDMO', 'Contract research, development and manufacturing organisation; CRO = research for hire; CDMO = process development and manufacturing for hire'],
      ['Research services', 'Syngene\'s CRO arm: discovery services, dedicated R&D centres, translational and clinical research'],
      ['Dedicated R&D centre', 'A ring-fenced lab run by Syngene for one client only (e.g., BMS\'s BBRC), usually under a contract of five years or more'],
      ['FTE / fee-for-service', 'Paying for a team of scientists for a period (full-time equivalents) vs paying per project or result'],
      ['Small vs large molecules', 'Chemically made drugs (tablets, APIs) vs biologics made in living cells (antibodies, proteins)'],
      ['Single-use bioreactor', 'A disposable-bag reactor for growing cells to make biologics; flexible, quick to change between products'],
      ['Drug substance / drug product', 'The active ingredient vs the finished, filled dose'],
      ['ADC / bioconjugation', 'Antibody-drug conjugate: an antibody linked to a toxic payload; bioconjugation is the linking step'],
      ['Librela (bedinvetmab)', 'Zoetis\'s monthly antibody injection for osteoarthritis pain in dogs; Syngene made it commercially'],
      ['Destocking', 'A customer running down inventory, which cuts orders below real demand for a while'],
      ['Hedge loss', 'Loss on forward contracts that sold future dollars at a rate below the later spot rate'],
      ['Exceptional items', 'One-off gains or charges reported separately (here: labour-code gratuity, severance, an insurance settlement)'],
      ['BIOSECURE Act', 'US law (Dec-2025) restricting federal contracts involving "biotechnology companies of concern" (Chinese firms on government lists)'],
      ['Bill and hold', 'Revenue recognised before delivery when the customer asks the supplier to hold the goods'],
      ['Forward EV/EBITDA', 'Enterprise value (market value less net cash) ÷ next full fiscal year\'s EBITDA'],
      ['Sector factor', 'How far the nine pharma peers\' EV/EBITDA (or P/E) at the 30-Sep-2026 close sits above their five-year medians (+7.5% / +8.2%)'],
      ['Trough year', 'A forward year left out of the multiple history because earnings were negative or below half the best of the prior three years'],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the discount rate (12.2% here, the cost of equity; Syngene has net cash)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY23': '+23%: the fastest growth of the decade, with Librela commercial supply for Zoetis and discovery both growing.',
  'ebitdaMargin@FY22': '28.5%: input-cost and mix pressure; the margin otherwise held at 29-31% for six years.',
  'otherIncome@FY20': '₹153 cr incl. a ₹74 cr exceptional gain (Screener nets exceptional items into other income).',
  'capex@FY25': '₹770 cr incl. the Bayview (Baltimore) site, US$36.5 mn.',
  'otherIncome@FY25': '₹101 cr incl. the ₹32 cr insurance settlement (2016 fire).',
  'sales@FY26': '+3% (US$419 mn vs US$430 mn): Librela destocking; ex-Librela growth "high single digits".',
  'ebitdaMargin@FY26': '24.6%: Librela volume loss, staff +14%, Unit 3 costs, ₹61 cr hedge loss.',
  'otherIncome@FY26': '−₹9 cr: ₹71 cr of treasury income less ₹77 cr of pre-tax exceptional charges (labour codes, severance).',
  'pat@FY26': '₹317 cr reported; ₹380 cr before exceptional items (−20%).',
  'capex@FY26': '₹368 cr (Screener); guidance ~US$45 mn.',
  'otherIncome@Q3FY26': '−₹55 cr: ₹71 cr pre-tax labour-code gratuity charge netted by Screener.',
  'ebitdaMargin@Q4FY26': '29%: Q4 seasonality; 41% of revenue from CDMO.',
  'sales@Q1FY27': '−16%: almost no Librela; research clients lost on price.',
  'ebitdaMargin@Q1FY27': '12.4%: ₹50 cr hedge loss (19% without it).',
  'pat@Q1FY27': '−₹9 cr after ₹10 cr (net) of severance; ₹1 cr before.',
  'sales@FY27E': 'GAM build: research +0.5%, CDMO −21%.',
  'ebitdaMargin@FY27E': 'Below the mid-20s guide: hedge losses and empty biologics capacity.',
  'otherIncome@FY27E': `${X.TY.toFixed(2)}% on average gross treasury of ~₹${n0((X.GROSS[0] + X.GROSS[1]) / 2)} cr + ₹1 cr.`,
  'interest@FY27E': `Lease interest ~₹${n0(X.LEASE_INT)} cr + small bank debt and other.`,
  'dep@FY28E': 'Bayview capitalised.',
  'eps@FY29E': `₹${n1(epsU[2])}: back to roughly FY22-23 levels.`,
};

module.exports = { risks, glossary, statementNotes };
