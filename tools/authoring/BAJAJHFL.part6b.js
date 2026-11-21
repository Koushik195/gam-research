// Bajaj Housing Finance report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./BAJAJHFL.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, n0, n1, n2, pc, price, pbMult, bvSep28, fwdPbNow, trailPb, PB12, rating, buyBelow, sellAbove, mv, toSellCr } = X;
const nti5 = F.avgAum[1] * 0.0005 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 5bp of margin as % of FY28E profit

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a great lender, a full price, and a parent with stock to sell`,
  blocks: [
    { callout: `**What you are buying:** India's cleanest large mortgage book (gross NPA 0.29%, nil losses in lease-rental loans), 21-24% growth, opex at 20% of income, AAA funding, strong parentage and management that meets its guidance. Profit compounds at ~17-18% a year and book value at ~13-14%.` },
    { callout: `**What you are paying:** ${n1(trailPb)}x trailing book and ${n1(fwdPbNow)}x our FY28E book for a ${n1(F.roe[0])}-${n1(F.roe[2])}% ROE against a ${n1(V.ke)}% cost of equity. That is the highest P/B of any listed housing-finance company, with the lowest ROE. The street's method, at our derived multiple, gives {{dcf.tp|inr}} ({{dcf.upside|chg}}), a ${rating} at the edge of SELL; our justified P/B (₹${n0(mv('jpb').value)}) and residual income (₹${n0(mv('ri').value)}) are 35-45% below the price. On top, the parent must place ~₹${n0(toSellCr)} cr of stock by Sep-2029.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Margins stabilise: NIM holds at ~3.7% on loan assets into FY28 (Sambhav mix, cheaper funding)', 'Medium', 'Q2FY27 results (due by mid-November 2026) and the FY28 assessment'],
      ['ROE heads to 14%+ without new equity (leverage toward 7x)', 'Medium', 'Leverage and ROE each quarter'],
      ['The sell-down is placed with long-only institutions at or near the market price', 'Medium', 'Block/OFS pricing; FII and DII holdings'],
      [`A price fall to ~₹${n0(buyBelow)} or below (our buy-below level)`, 'Low-Medium', 'Price'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Banks cut prime home-loan rates further; balance-transfer attrition rises again', 'Medium', `Each 5bp of margin is ~${n1(nti5)}% of FY28E profit; bear case (yield −15bp, AUM growth −5pp) target {{scen.bear.tp|inr}}`],
      ['Parent sells in large, discounted blocks', 'Medium', 'Price resets lower at each tranche; Dec-2025 block cost 9% in a day'],
      ['Commercial-property downturn hits lease-rental or developer loans (₹137 cr / ₹59 cr average tickets)', 'Low-Medium', 'A few defaults lift credit cost from ~10bp to 30-50bp; bear case +10bp'],
      ['The Bajaj premium fades and BHFL trades like other HFCs (1.5-2.7x book)', 'Medium', `At ${AS.valuation.blend.methods[0].multiple.bear}x Sep-28E book: ~₹${n0(AS.valuation.blend.methods[0].multiple.bear * bvSep28)}`],
      ['Housing-share floor bites (individual home loans 50.45% vs 50%)', 'Medium', 'Slower commercial growth or more loan sales to the parent'],
      ['Sambhav (young near-prime/affordable book) seasons badly', 'Low-Medium', 'Credit cost up; yield gains offset'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would buy below ~₹${n0(buyBelow)} and turn sellers above ~₹${n0(sellAbove)}.** The 30-Sep price (₹${n0(price)}) is at the sell line. The rating is sensitive to the multiple: at 2.0x Sep-28E book the target is ~₹${n0(2.0 * bvSep28)} (SELL); at 2.5x (its 12-month median) ~₹${n0(2.5 * bvSep28)}.`,
      `**Biggest swing factors:** the multiple (0.1x ≈ ₹${n1(0.1 * bvSep28)} a share) and margin (5bp ≈ ${n1(nti5)}% of FY28E profit). Credit cost hardly matters unless the commercial book cracks.`,
      '**Portfolio fit:** a low-risk compounder for investors who want mortgage exposure and accept a premium valuation; not a value stock, and not a stock to chase while ~₹8,000 cr of supply is pending.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Gross NPA, Jun-2026', v: `${X.Q1.gnpa}%`, d: 'nil in lease-rental loans' },
      { k: 'ROE, FY27E', v: '{{F.roe.0|pct}}', d: `cost of equity ${n1(V.ke)}%` },
      { k: 'Price ÷ FY28E book', v: `${n1(fwdPbNow)}x`, d: `12-month median ${PB12.med}x (forward)` },
      { k: 'Parent stake to sell', v: `₹${n0(toSellCr)} cr`, d: '11.7% by 15-Sep-2029' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['HFC', 'Housing-finance company: a non-bank lender specialising in property loans, regulated by the RBI and supervised by the National Housing Bank (NHB).'],
      ['Upper-layer NBFC', 'The largest non-bank lenders under the RBI\'s scale-based regulation; they face bank-like rules and must be listed.'],
      ['AUM / AR (loan assets)', 'Assets under management: all loans BHFL manages, including those sold to other lenders that it still services. AR: loans on its own balance sheet (~88% of AUM).'],
      ['Assignment (direct assignment)', 'Selling a pool of loans to another lender (in FY26, ₹3,645 cr went to the parent) while continuing to collect the instalments for a fee.'],
      ['LAP, LRD, DF', 'Loan against property; lease rental discounting (a loan repaid from the rent of a leased building); developer finance (construction loans to builders).'],
      ['Sambhav', 'BHFL\'s near-prime and affordable home-loan unit (smaller tickets, higher yields).'],
      ['BT-out', 'Balance transfer: a borrower refinances an existing home loan with another lender at a lower rate.'],
      ['Repo-linked loan / PLR', 'A loan whose rate moves with the RBI\'s repo rate; prime lending rate, the lender\'s own reference rate for floating loans.'],
      ['NII, NTI, NIM', 'Net interest income; net total income (NII + fees); net interest margin (company: NTI ÷ average loan assets; our model: NII or NTI ÷ average AUM).'],
      ['Gross spread', 'Portfolio yield minus cost of funds.'],
      ['Credit cost', 'Loan losses and provisions ÷ average loans (company) or AUM (our model).'],
      ['Stage 1 / 2 / 3, ECL', 'Ind AS 109 buckets: performing, 30-90 days overdue, non-performing (90+ days). ECL = expected credit loss provisions.'],
      ['GNPA / NNPA, PCR', 'Gross / net non-performing assets (Stage 3) as % of loans; provision coverage = provisions on Stage 3 ÷ Stage 3 loans.'],
      ['CRAR, Tier 1', 'Capital ÷ risk-weighted assets (minimum 15% for HFCs); Tier 1 is the core equity part.'],
      ['PBC', 'Principal business criteria: an HFC must keep ≥60% of assets in housing finance and ≥50% in housing loans to individuals.'],
      ['MPS', 'Minimum public shareholding: at least 25% of a listed company\'s shares must be held by the public.'],
      ['OFS / block deal / QIP', 'Offer for sale through the exchange; a large negotiated trade; qualified institutions placement (new shares sold to institutions).'],
      ['Leverage', 'Total assets ÷ net worth.'],
      ['ROA, ROE', 'Profit ÷ average assets (company: average loan assets); profit ÷ average shareholders\' equity.'],
      ['P/B, justified P/B', 'Price ÷ book value per share. Justified P/B = (ROE − g) ÷ (cost of equity − g): the multiple a steady ROE and growth rate support.'],
      ['Residual income', 'Book value plus the present value of future profit above the cost of equity.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the book value (or EPS) the market will look at in September 2027.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY21': '+19%: Covid year; growth slowed from 86% in FY20.',
  'aum@FY22': '+37%: post-Covid rebound across home loans and the new commercial book.',
  'aum@FY23': '+30%: upper-layer classification; ₹2,500 cr of equity.',
  'aum@FY24': '+32%: lease-rental and developer loans scale up.',
  'nii@FY22': '+46%: AUM +37% and lower funding costs.',
  'nii@FY23': '+56%: AUM +30% and a wider margin (NIM peak).',
  'provisions@FY21': '+99%: Covid; 0.80% of loan assets.',
  'provisions@FY22': '−27%: Covid losses fading.',
  'provisions@FY23': '−37%: benign credit; 0.21% of loan assets.',
  'provisions@FY24': '−61%: 0.06% of loan assets, a record low.',
  'provisions@FY25': 'Includes a ₹60 cr overlay release (13bp without it).',
  'provisions@FY26': '+229%: stronger Stage 2 coverage for macro risks (10bp without it).',
  'pat@FY22': '+57%: recovery from Covid.', 'pat@FY23': '+77%: margin peak and low credit cost.', 'pat@FY24': '+38%: ROE peak (15.2%).',
  'netWorth@FY23': '+56%: ₹2,500 cr equity from the parent.',
  'netWorth@FY25': '+63%: ₹2,000 cr rights issue (Apr-2024) and ₹3,560 cr IPO fresh issue (Sep-2024).',
  'nim@FY23': 'Margin peak as funding costs lagged loan repricing.',
  'nim@FY24': 'Funding costs caught up.',
  'nim@FY27E': 'GAM: −20-25bp guided on loan assets (14bp in Q1FY27); we model ~−30bp on AUM including rising leverage.',
  'roe@FY24': 'Peak at 6.7x leverage.', 'roe@FY25': 'Diluted by ₹5,560 cr of new equity.', 'roe@FY26': 'Margin compression; capital still being deployed.',
  'aum@FY27E': 'GAM: +23%, top of the 21-23% assessment (record ₹8,918 cr added in Q1).',
  'provisions@FY27E': 'GAM: ~12bp of loan assets vs 10-15bp guidance.',
  'pat@FY27E': 'GAM: in line with the street (₹2,986-3,030 cr).',
  'creditCost@FY21': 'Covid.', 'creditCost@FY24': 'Record low.', 'creditCost@FY26': 'Stage 2 strengthening.',
  'pat@Q4FY25': 'Includes a ₹34 cr one-time tax benefit.',
  'pat@Q4FY26': '+14%: +20% excluding the prior-year tax benefit.',
  'pat@Q1FY27': '+23%: credit cost 5bp after a ~₹2,300 cr assignment released Stage 1 provisions.',
  'expenses@Q1FY27': 'Low loan losses (₹16 cr) after the assignment release.',
  'sales@Q1FY25': 'Total income +26%.',
  'nii@FY21': '+32%: AUM +19% while funding costs fell with the Covid-era rate cuts.',
  'nim@FY22': '+34bp: funding costs fell to a low (cost of funds ~5.9% on our basis) while loan yields lagged.',
  'creditCost@FY22': 'Covid losses fading.', 'creditCost@FY23': 'Benign credit; 0.21% of loan assets.',
  'roe@FY22': '+331bp: Covid recovery; leverage peaked at 7.2x.', 'roe@FY23': '+347bp: margin peak and low credit cost.',
  'sales@Q2FY25': '+26%: AUM growth in the mid-20s; IPO money (Sep-2024) earned interest income.',
  'sales@Q3FY25': '+26%: AUM growth in the mid-20s.', 'sales@Q4FY25': '+25%: AUM +25.5%.',
  'expenses@Q1FY26': '+44%: loan losses rose from a near-zero base (FY25 credit cost 7bp incl. a ₹60 cr overlay release) to 15bp; opex grew with the book.',
  'expenses@Q2FY26': '+37%: the same normalisation of loan losses from FY25\'s low base.',
  'pat@Q3FY25': '+25%: AUM growth plus income on the IPO capital raised in Sep-2024.',
};

module.exports = { risks, glossary, statementNotes };
