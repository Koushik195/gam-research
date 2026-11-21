// Shriram Finance report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./SHRIRAMFIN.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, fin, n0, n1, n2, pc, price, pbMult, bvSep28, fwdPbNow, fwdPeNow, PB21, PB23, rating, buyBelow, sellAbove, mv, Q1, roeTw27, tpAt } = X;
const cc10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better company than five years ago, priced as if it were a better business than it is',
  blocks: [
    { callout: `**What you are buying:** India's leading used-vehicle financier: ₹3.1 lakh cr of AUM, 3,225 mostly rural branches, ~1 crore customers, 47 years of underwriting used trucks most lenders avoid, losses steady at ~1.9% of AUM, provisions of ~6% of loans, and now AAA ratings, a 34% capital ratio and MUFG Bank as a 20% shareholder. EPS grows ~16% a year to FY29E in our model (profit ~25%, on 25% more shares).` },
    { callout: `**What you are paying:** ${n1(fwdPbNow)}x our FY28E book and ${n1(fwdPeNow)}x FY28E EPS, against ${PB21.med}x and ${X.PE21.med}x medians since 2021 and ${PB23.med}x book since the merger. For that you get ROE of ~${n1(roeTw27)}-14% to FY29E, because the MUFG equity earns only the interest it saves until it is levered up over five to six years. Our ${pbMult}x Sep-28E book gives {{dcf.tp|inr}} ({{dcf.upside|chg}}), hence ${rating}; justified P/B (₹${n0(mv('jpb').value)}), residual income (₹${n0(mv('ri').value)}) and P/E (₹${n0(mv('pe').value)}) all sit below the price. The street is unanimously Buy; the gap is entirely the multiple.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Faster re-levering: AUM growth sustained at 20%+ with credit cost below 2% of AUM', 'Low-Medium', 'Q2FY27 results (due by mid-November 2026) and the reassessed guidance'],
      ['NIM holding above 9% (company basis) as funding costs fall faster than yields', 'Medium', 'Quarterly NIM, incremental borrowing cost, new-vehicle share of disbursements'],
      ['Stage 3 falling toward 4% with MSME and gold stabilising', 'Low-Medium', 'Product-wise Stage 3 each quarter'],
      ['A deeper role for MUFG (co-lending, cheaper yen funding, a larger stake after the standstill)', 'Low', 'Board announcements; the standstill runs to about April 2028'],
      ['A fall in the share price toward ~₹' + n0(buyBelow), '–', 'The rule turns BUY below that level on today\'s numbers'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Deficient monsoon and El Nino hit rural incomes and truck freight', 'Medium', `Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit; ~2.6% (bear) cuts FY28E EPS to ₹{{scen.bear.eps.1|n2}}`],
      ['Oil shock from the West Asia war squeezes small truck operators', 'Medium', 'Higher Stage 2/3 in commercial vehicles (46.9% of AUM)'],
      ['Yields fall faster than funding costs as cheaper money is passed to new-vehicle buyers', 'Medium', 'NIM toward management\'s ~8.5%: bear-case yield −30bp'],
      ['Newer books (MSME, gold, personal loans) keep deteriorating', 'Medium', 'Stage 3 above 5%; higher credit cost and slower growth'],
      ['Rates rise with inflation (RBI CPI forecast 5.1%)', 'Low-Medium', 'Funding 30bp dearer in the bear case'],
      ['The multiple reverts toward its pre-merger range', 'Medium', `At 1.2x Sep-28E book, ~₹${n0(tpAt(1.2))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would turn buyers below ~₹${n0(buyBelow)} and stay sellers above ~₹${n0(sellAbove)}.** The rating is sensitive to the multiple: at 1.7x Sep-28E book (the last two years' median) the target is ~₹${n0(tpAt(1.7))} (HOLD); at 2.0x ~₹${n0(tpAt(2.0))} (BUY).`,
      `**Biggest swing factors:** the multiple (0.1x ≈ ₹${n0(0.1 * bvSep28)} a share) and credit cost (10bp ≈ ${n1(cc10)}% of FY28E EPS). Over three to five years, the pace at which the MUFG equity is levered up matters more than either.`,
      '**Portfolio fit:** for investors who want Indian rural credit exposure, Shriram is the quality way to own it; we would wait for a better price. Holders should size for a bear case near {{scen.bear.tp|inr}}.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'AUM, Jun-2026', v: '₹3.14 lakh cr', d: '+15.3% YoY; ~18% guided for FY27' },
      { k: 'Gross Stage 3, Q1FY27', v: `${Q1.gnpa}%`, d: '4.53% a year earlier' },
      { k: 'ROE, FY27E (time-weighted)', v: `${n1(roeTw27)}%`, d: '16-18% before the MUFG money' },
      { k: 'Price ÷ FY28E book', v: `${n1(fwdPbNow)}x`, d: `median since 2021: ${PB21.med}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NBFC', 'Non-banking financial company: a lender regulated by the RBI that cannot offer current or savings accounts. A few, like Shriram, may take fixed deposits from the public.'],
      ['AUM', 'Assets under management: all loans the company manages, including loans sold to banks through securitisation or direct assignment.'],
      ['NII, NIM', 'Net interest income = interest earned − interest paid. Net interest margin = NII ÷ average AUM (our basis) or ÷ average total assets (company basis, which reads ~0.8-1pp lower).'],
      ['Net total income (NTI)', 'NII plus fees and other operating income: the lender\'s "revenue" after funding costs.'],
      ['Cost-to-income', 'Operating expenses ÷ net total income.'],
      ['Credit cost', 'Impairment (loan-loss provisions and write-offs) ÷ average AUM (our basis) or ÷ average total assets (company basis).'],
      ['Stage 1 / 2 / 3, ECL', 'Ind AS 109 buckets: performing, under-performing (30-90 days overdue) and non-performing (90+ days) loans. ECL = expected credit loss provisions held against them.'],
      ['Gross / net Stage 3, coverage', 'Non-performing loans before / after provisions, as % of loans; coverage = Stage 3 provisions ÷ Stage 3 loans.'],
      ['CRAR, Tier 1', 'Capital ÷ risk-weighted assets (minimum 15% for NBFCs); Tier 1 is the core equity part.'],
      ['Leverage', 'Total assets (or borrowings, or AUM) ÷ net worth.'],
      ['ROA, ROE', 'Profit ÷ average assets (or AUM); profit ÷ average shareholders\' equity. Time-weighted ROE weights equity by the days it was in place (the MUFG money arrived on 8-Apr-2026).'],
      ['P/B, justified P/B', 'Price ÷ book value per share. Justified P/B = (ROE − g) ÷ (cost of equity − g): the multiple a steady ROE and growth rate support.'],
      ['Residual income', 'Book value plus the present value of future profit above the cost of equity.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the book value (or EPS) the market will look at in September 2027.'],
      ['Preferential issue', 'New shares sold to a named investor (here MUFG Bank) at a price set by SEBI rules.'],
      ['Securitisation / direct assignment (DA)', 'Selling pools of loans to banks: securitised loans stay on the balance sheet (on-book), DA loans leave it (off-book).'],
      ['ECB', 'External commercial borrowings: foreign-currency loans and bonds, usually hedged into rupees.'],
      ['ALM, LCR', 'Asset-liability maturity profile; liquidity coverage ratio = liquid assets ÷ 30-day stressed outflows (100% minimum).'],
      ['STFC, SCUF, SHFL, SAMIL', 'Shriram Transport Finance (the pre-merger company), Shriram City Union Finance (merged in 2022), Shriram Housing Finance (sold in 2024), Shriram Automall India (vehicle-auction associate).'],
      ['CV, PV, CE, MSME, 2W, PL', 'Commercial vehicles, passenger vehicles, construction equipment, micro, small and medium enterprises, two-wheelers, personal loans.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY19': '+8.6% (STFC alone).', 'aum@FY20': '+5.0%: slowdown, then Covid in Mar-2020.', 'aum@FY21': '+6.8%: Covid year.', 'aum@FY22': '+8.4%: recovery.',
  'aum@FY23': '+46%: merger with Shriram City Union Finance (appointed date 1-Apr-2022).', 'aum@FY24': '+21%: strong vehicle and MSME demand.', 'aum@FY25': '+17%.', 'aum@FY26': '+14.85% vs ~15% guided; construction equipment shrank 26%.',
  'sales@FY23': '+58%: merger.', 'nii@FY23': 'Merger; FY23 ratios distorted (FY22 AUM is STFC alone).',
  'provisions@FY21': 'Covid: ~2.8% of average AUM.', 'provisions@FY22': '+24%: Covid second wave (Apr-Jun 2021); ~3.2% of average AUM.', 'provisions@FY23': 'Merged entity; includes SHFL.', 'provisions@FY24': 'Includes SHFL; ~2.2% of AUM.', 'provisions@FY25': 'Continuing operations; ~2.2% of AUM.', 'provisions@FY26': '+0.5% on AUM +15%: credit cost down to 1.89%.',
  'pat@FY18': '+101% (STFC alone).', 'pat@FY21': 'Covid; rights issue (₹1,492 cr).', 'pat@FY22': 'Covid provisions; QIP (₹1,999 cr).', 'pat@FY23': '+121%: merger.',
  'pat@FY25': 'Includes ₹1,489 cr after-tax gain (standalone) on selling Shriram Housing Finance; ~₹8,268 cr before it.', 'pat@FY26': '+5% reported, +21% before the FY25 gain.',
  'eps@FY25': '₹50.81 incl. the SHFL gain; ~₹44 before it.', 'netWorth@FY23': '+67%: merger (shares issued to SCUF holders).',
  'roe@FY22': 'Covid-era low.', 'roe@FY25': 'Includes the SHFL gain (~15.7% before it).',
  'aum@FY27E': 'GAM: +17% (guidance ~18%, to be reassessed after Q2).', 'nii@FY27E': 'GAM: +32% as ₹39,618 cr of MUFG equity replaces debt.', 'provisions@FY27E': 'GAM: 1.95% of average AUM (≈1.7% of total assets) vs ~2% guided.',
  'pat@FY27E': 'GAM: +45% profit, EPS +16% (25% more shares).', 'netWorth@FY27E': 'GAM: includes the ₹39,619 cr MUFG issue (8-Apr-2026).', 'eps@FY27E': 'On 235.3 cr year-end shares.', 'roe@FY27E': 'Engine averages opening and closing equity; ~13.2% time-weighted.',
  'pat@Q3FY25': 'Includes the gain on selling Shriram Housing Finance (exceptional ₹1,567 cr in Screener).',
  'expenses@Q3FY26': 'Includes most of the ₹197 cr Labour Code charge (staff cost ₹1,237 cr).', 'pat@Q4FY26': '+41%: NIM 8.61%, lower opex.',
  'pat@Q1FY27': '+60%: ~₹500 cr of NII from the MUFG capital; EPS +29% on 25% more shares.', 'interest@Q1FY27': 'Down 4% YoY: borrowings repaid with the MUFG money.',
};

module.exports = { risks, glossary, statementNotes };
