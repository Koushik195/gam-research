// Sai Life Sciences report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./SAILIFE.ctx');
const { F, V, SC, n0, n1, pc, price, mv, MULT, EVH, kev, SECTOR_EV, epsU, sep, evNowFwd, fwdNow, trailPe, rating, ruleText, buyBelow, sellAbove, SHARES, Q1, FY26, gNeeded, ptPerShare, evVal } = X;
const perTurn = Math.round(mv('ev').metric / SHARES);

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good CRDMO franchise at a price that has run ahead of its own history and of the sector; we initiate with SELL',
  blocks: [
    { callout: '**What you are buying:** one of India\'s few scaled integrated CRDMOs: discovery for 300+ customers, 33 commercial and 14 late-phase molecules, 19 of the top 25 pharma companies as clients, repeat business over 90% of revenue, no customer above ~12%, a clean USFDA/PMDA record and an EBITDA margin rebuilt to ~29%. **What you are not buying:** cheap growth. Capex doubles to ₹1,100-1,300 cr in FY27, the balance sheet goes back to net debt, and EPS grows far more slowly than EBITDA for three years.' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(evNowFwd)}x our FY28E EBITDA and ${n1(fwdNow)}x our FY28E EPS (${n1(trailPe)}x trailing). On the street's method (EV/EBITDA), Sai's own ${n1(EVH.med)}x median since Jul-2025 lifted by the sector's +${SECTOR_EV}% move gives ${MULT.base}x Sep-28E EBITDA = {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating} under the house rule. The P/E cross-check (₹${n0(mv('pe').value)}) agrees and the DCF (₹${n0(mv('dcf').value)}) is far lower. The stock has re-rated ~36% above its own window median while the sector moved ~9%; we do not assume that gap persists.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Q2-Q4FY27 revenue up ~20%+ with CDMO recovering, as management\'s H2 guide implies', 'Medium', 'Q2FY27 results (due by mid-November 2026); Bidar block start in Q3'],
      ['Two late-phase molecules approved in FY27 and ramping as commercial supply', 'Medium', 'Regulatory milestones flagged for FY27; CDMO growth'],
      ['Margin at the top of the 28-30% guide without forex help', 'Low-medium', 'Screener-basis margin above 29%'],
      ['Capex trimmed or phased, keeping net debt below ~₹600 cr', 'Low', 'FY28 capex guidance'],
      ['A share-price fall to below ~₹' + n0(buyBelow), 'n.a.', 'The rule turns BUY there on our numbers'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['A large commercial customer destocks again (as in Q1FY25)', 'Medium', 'A loss-making quarter; bear case {{scen.bear.tp|inr}}'],
      ['New capacity fills slowly (utilisation 65% in Q1FY27)', 'Medium', 'Margin −1-2pp; ROE stays ~13%'],
      ['Capex overruns or Choutuppal accelerates', 'Medium', 'Net debt above ₹1,500 cr; interest +₹30-40 cr'],
      ['Biotech funding stays weak and hits discovery growth', 'Low-medium', 'CRO growth below 15%'],
      ['Sector de-rating (pharma trades ~9% above its window median on EV/EBITDA)', 'Medium', `Each 1x on the multiple ≈ ₹${perTurn} a share`],
      ['Bidar environmental PIL escalates', 'Low', 'Bidar is the only manufacturing site'],
      ['Upside risk: BIOSECURE lists Chinese CDMOs and transfers accelerate', 'Low-medium', 'Higher growth and multiple; bull case {{scen.bull.tp|inr}}'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}** (where upside to our target is at least 15%), HOLD between that and ~₹${n0(sellAbove)}, and SELL above it, on today's numbers. At ₹${n0(price)} the stock is ~₹${n0(price - sellAbove)} above the SELL line.`,
      `**Biggest swing factors:** the multiple and FY28-29 EBITDA. Each 1x on EV/EBITDA is ~₹${perTurn} a share; each 1pp of FY28-29E margin is ~₹${n0(ptPerShare)} a share at ${MULT.base}x. If Sai held its current ${n1(evNowFwd)}x FY28E multiple on Sep-28E EBITDA, the value would be ~₹${n0(evVal(Math.round(evNowFwd * 2) / 2))}; at HDFC Securities' 29x it is the same as our target.`,
      '**We would reconsider** on a sharp fall in the price that leaves the franchise intact, on evidence that the new capacity fills faster than we assume, or on a BIOSECURE-driven transfer of commercial molecules from China.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Repeat customers', v: '>90%', d: 'of FY25-26 revenue; top customer 12.2%' },
      { k: 'Late-phase molecules', v: '14', d: '33 commercial; two milestones in FY27' },
      { k: 'FY27 capex', v: '₹1,100-1,300 cr', d: '~2x FY26; net debt returns' },
      { k: 'Forward EV/EBITDA', v: `${n1(evNowFwd)}x`, d: `FY28E; median since Jul-2025 ${n1(EVH.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['CRDMO / CDMO / CRO', 'Contract research, development and manufacturing organisation: does discovery research (CRO work), process development and manufacturing (CDMO work) for drug innovators'],
      ['CMC', 'Chemistry, manufacturing and controls: Sai\'s name for its development and manufacturing (CDMO) business'],
      ['Innovator / biotech / large pharma', 'Companies that own new drugs; biotechs are small, often venture-funded, and usually own no plants; large pharma = revenue above USD10 bn'],
      ['NCE / API / intermediate', 'New chemical entity (a new small-molecule drug); active pharmaceutical ingredient (the chemical that does the work); intermediates are the steps before it'],
      ['Phase I / II / III, pre-registration', 'Stages of clinical trials; Phase III is the last before a drug is filed for approval'],
      ['Commercial molecule', 'A client drug that is approved and sold, for which Sai supplies API or intermediates'],
      ['FTE model', 'Full-time-equivalent: a client pays for a dedicated team of Sai scientists for a period, rather than per result'],
      ['DMPK', 'Drug metabolism and pharmacokinetics: how a drug is absorbed, distributed, broken down and cleared'],
      ['KL (kilolitre) / production block / train', 'Reactor capacity is measured in kilolitres; a block is a building of reactor trains; a train is a set of linked reactors for one process'],
      ['HPAPI', 'Highly potent API (e.g., cancer drugs), needing contained plants'],
      ['Peptides / ADC / XDC / oligonucleotides', 'Newer drug types: short protein chains (e.g., GLP-1 drugs), antibody- or other carrier-drug conjugates, short DNA/RNA chains'],
      ['Destocking', 'Customers running down their inventories, which cuts orders below their real usage for a while'],
      ['BIOSECURE Act', 'US law (Dec-2025) restricting federal contracts and grants involving "biotechnology companies of concern" (Chinese firms on government lists)'],
      ['China+1', 'Innovators adding a non-Chinese supplier to reduce dependence on China'],
      ['Offer for sale (OFS) / fresh issue', 'In an IPO, existing shareholders sell shares (OFS; the company gets nothing) or the company issues new shares (fresh issue; it gets the money)'],
      ['Ind AS 116 / pre-Ind AS EBITDA', 'Lease accounting: lease costs move from operating expenses to depreciation and interest; "pre-Ind AS" EBITDA deducts lease rent'],
      ['Forward EV/EBITDA', 'Enterprise value (market value plus net debt) ÷ next full fiscal year\'s EBITDA'],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS'],
      ['Sector factor', 'How far the nine pharma peers\' EV/EBITDA (or P/E) at the 30-Sep-2026 close sits above their own medians since 1-Jul-2025 (+9.1% / +18.5%)'],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (12.5% here, the cost of equity)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitdaMargin@FY22': '14.5%: margin halves as Sai hires scientists and adds biology, DMPK, Boston and Manchester ahead of revenue.',
  'pat@FY22': '₹6 cr: interest on ~₹750 cr of debt and depreciation absorb almost all operating profit.',
  'sales@FY23': '+40%: commercial and clinical volumes; HPAPI facility at Bidar commissioned.',
  'interest@FY23': '₹81 cr: borrowings peak at ₹933 cr.',
  'ebitdaMargin@FY24': '+570bp: material margin 65% → 70%; operating leverage.',
  'sales@FY25': '+16%: CDMO growth slows to ~8% as a commercial customer destocks; CRO +26%.',
  'interest@FY25': '₹78 cr; ₹720 cr repaid from IPO proceeds in Dec-2024.',
  'otherIncome@FY25': 'Deposit interest ₹17 cr on IPO cash, forex ₹19 cr.',
  'sales@FY26': '+29%: CDMO +33%, CRO +24%.',
  'ebitdaMargin@FY26': '28.9%: includes a ~₹25 cr loss-allowance reversal (₹34 cr incl. contract assets); company basis 30.1% incl. forex.',
  'interest@FY26': '₹41 cr: debt repaid; leases ₹23 cr of it.',
  'otherIncome@FY26': 'Deposit interest ₹18 cr, forex ₹30 cr, less the ₹9 cr labour-code charge (Screener nets it here).',
  'pat@FY26': '+105%: margin, lower interest, forex gains.',
  'capex@FY26': '₹593 cr (Screener; company ₹633 cr vs ₹700 cr budget).',
  'sales@Q1FY25': '−36% QoQ: a commercial customer destocks; loss-making quarter.',
  'otherIncome@Q3FY26': 'Net of the ₹8 cr labour-code exceptional charge.',
  'ebitdaMargin@Q3FY26': '33.8%: rich mix (material margin 77%).',
  'sales@Q1FY27': '+12%: CRO +24%, CDMO +6%; H2 guided stronger.',
  'sales@FY27E': 'GAM build: CDMO +14%, CRO +22%.',
  'interest@FY27E': 'Built: 8.5% on average bank debt (~₹95 cr → ~₹740 cr), leases ~₹21 cr, other ~₹3 cr.',
  'otherIncome@FY27E': `${X.TY.toFixed(1)}% on average gross cash of ~₹236 cr + ₹0.5 cr; no forex.`,
  'capex@FY27E': 'Guided ₹1,100-1,300 cr: two 225 KL blocks at Bidar, R&D, Choutuppal start.',
  'eps@FY28E': `₹${n1(epsU[1])}: depreciation and interest grow faster than EBITDA.`,
};

module.exports = { risks, glossary, statementNotes };
