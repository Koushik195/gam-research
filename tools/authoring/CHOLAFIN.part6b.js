// Cholamandalam report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./CHOLAFIN.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, fin, n0, n1, n2, pc, price, pbMult, bvSep28, fwdPbNow, PB21, rating, buyBelow, sellAbove, mv, Q1, cc10, feeCutEps28, insCom } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a ${rating} on the street's yardstick, by a thin margin`,
  blocks: [
    { callout: `**What you are buying:** a well-run, diversified small-town lender: eight businesses on one branch network, ROE of 19-21% in every normal year, profit growth of 23-28% for four years, mortgages (a third of the book) earning 4%+ pre-tax ROA, no need for new equity at ~20% growth, and a credit cycle that improved in Q1FY27 (loan losses 1.5% of assets, guidance met in the weakest quarter).` },
    { callout: `**What you are paying:** ${n1(fwdPbNow)}x our FY28E book and ${n1(price / F.eps[1])}x FY28E EPS, below the stock's ${PB21.med}x median forward P/B since 2021 after a ~12% fall in late September. On the street's method that gives {{dcf.tp|inr}} ({{dcf.upside|chg}}) and a ${rating}. It is not cheap on fundamentals: at a ${n1(V.ke)}% cost of equity the price already implies a ~{{dcf.impliedRoe|pct0}} ROE for ever, and our justified P/B (₹${n0(mv('jpb').value)}) and residual income (₹${n0(mv('ri').value)}) are both below the price. You are paying for growth to stay above 20% with ROE near 20%.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Stage 3 falls back below 3% and vehicle losses below 2% of assets', 'Medium', 'Q2FY27 results (due by mid-November 2026) and Q3'],
      ['IRDAI drops or softens the caps on loan-linked commission', 'Low-Medium', 'Final regulations after the 25-Oct-2026 comment deadline'],
      ['Mortgage disbursements re-accelerate (home loans stuck at ₹1,800-2,000 cr a quarter)', 'Medium', 'Quarterly disbursements after the cheque-clearance change'],
      ['Operating leverage: cost-to-income below 38%', 'Low (FY27)', 'Gold-branch break-even; opex ratio'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Vehicle and LAP asset quality keeps slipping (weak monsoon, diesel at $100+ crude)', 'Medium', `Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit; 2.0% (bear) cuts FY28E EPS to ₹{{scen.bear.eps.1|n2}}`],
      ['IRDAI caps cut most loan-linked commission', 'Medium', `Base already takes ~₹${n1(feeCutEps28)} off FY28E EPS; the bear case doubles the cut (₹${n0(insCom)} cr of FY26 commission at stake)`],
      ['Rate hikes: repo +25-50bp and tighter bank lending to NBFCs', 'Medium-High', 'Cost of funds +25bp in the bear case; Chola reprices faster than banks'],
      ['Related-party or governance controversy resurfaces', 'Low', 'Multiple compression toward the bear 2.7x'],
      ['Unsecured or new-business losses (CSEL, SME, SBPL) rise again', 'Low-Medium', 'Higher credit cost; growth slows'],
      ['Growth slows to the high teens', 'Low-Medium', 'Bear case: AUM +18/17/16%'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would stay buyers below ~₹${n0(buyBelow)} and turn sellers above ~₹${n0(sellAbove)}.** The 30-Sep price of ₹${n0(price)} sits just under the buy line; at 3.1x Sep-28E book the target is ~₹${n0(Math.round(3.1 * bvSep28 / 10) * 10)} (HOLD).`,
      `**Biggest swing factors:** credit cost (10bp ≈ ${n1(cc10)}% of FY28E EPS), the multiple (0.1x ≈ ₹${n0(0.1 * bvSep28)} a share) and the IRDAI outcome (~${n1(feeCutEps28 / F.eps[1] * 100)}% of FY28E EPS in our base).`,
      '**Portfolio fit:** a core financials holding for investors who want growth from the small-town economy with a secured book; not a value stock and not a high-dividend one. Size positions for a bear case near {{scen.bear.tp|inr}}.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Business AUM, Jun-2026', v: '₹2.34 lakh cr', d: '+22% YoY; eight businesses' },
      { k: 'Loan losses, Q1FY27', v: '1.5%', d: 'of assets; 1.7% in FY26 incl. overlay' },
      { k: 'ROE, FY27E', v: '{{F.roe.0|pct}}', d: 'Q1FY27 21.2%' },
      { k: 'Price ÷ FY28E book', v: `${n1(fwdPbNow)}x`, d: `median since 2021: ${PB21.med}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NBFC, upper layer', 'Non-banking financial company: an RBI-regulated lender that cannot take current or savings deposits. The "upper layer" is the RBI\'s tier for the largest NBFCs, with bank-like rules.'],
      ['Business AUM / total AUM', 'Business AUM: loans Chola manages, incl. small assigned pools (₹2,33,586 cr, Jun-2026). Total AUM adds cash and investments (₹2,54,392 cr). We use business AUM.'],
      ['VF, LAP, HL', 'Vehicle finance; loan against property (a business loan secured on a home or shop); home loans.'],
      ['CSEL, SBPL, SME', 'Consumer & small-enterprise loans (unsecured personal, business, professional and consumer-durable loans); secured business & personal loans (small loans against property); loans to small and medium enterprises.'],
      ['NII, NIM', 'Net interest income = interest earned − interest paid. Net interest margin = NII ÷ average AUM (our basis) or ÷ average assets (Chola\'s basis).'],
      ['Net total income, cost-to-income', 'NII plus fees and other operating income; operating expenses ÷ net total income.'],
      ['Credit cost / loan losses', 'Loan-loss provisions ÷ average AUM (our basis) or average assets (company basis).'],
      ['Stage 1 / 2 / 3, ECL', 'Ind AS buckets: performing, 30-90 days overdue, and 90+ days overdue loans; ECL = expected-credit-loss provisions held against them.'],
      ['GNPA / NNPA (RBI norms)', 'Gross / net non-performing assets on the RBI\'s definition, under which a loan stays NPA until all overdues are cleared; higher than Stage 3.'],
      ['Overlay', 'An extra provision booked on management\'s judgement (Chola: ₹200 cr for geopolitical risks, Q4FY26).'],
      ['CRAR, Tier 1', 'Capital ÷ risk-weighted assets (minimum 15% for NBFCs); Tier 1 is the core equity part (minimum 10%).'],
      ['ROTA, ROA, ROE', 'Chola\'s pre-tax return on total assets; profit ÷ average assets; profit ÷ average shareholders\' equity.'],
      ['CCD, QIP', 'Compulsorily convertible debentures (debt that must turn into shares); qualified institutions placement (shares sold to institutions).'],
      ['ALM, LCR', 'Asset-liability maturity profile; liquidity coverage ratio (high-quality liquid assets ÷ 30-day net outflows; minimum 100%).'],
      ['SARFAESI, ARC', 'The law that lets lenders seize secured assets without going to court (for larger loans); asset-reconstruction companies that buy bad loans.'],
      ['CGTMSE', 'Credit Guarantee Fund Trust for Micro and Small Enterprises: a government guarantee on small-business loans.'],
      ['IRDAI', 'Insurance Regulatory and Development Authority of India.'],
      ['P/B, justified P/B', 'Price ÷ book value per share. Justified P/B = (ROE − g) ÷ (cost of equity − g).'],
      ['Residual income', 'Book value plus the present value of future profit above the cost of equity.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the book value (or EPS) the market will look at in September 2027.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY19': '+26%: vehicle finance and LAP growth.',
  'aum@FY20': '+12%: growth slowed as the vehicle cycle turned and Covid hit in March.',
  'aum@FY21': '+16%: Covid year; moratorium.',
  'aum@FY22': '+10%: cautious post-Covid year.',
  'aum@FY23': '+38%: CSEL, SBPL and SME launched; vehicle finance +27%.',
  'aum@FY24': '+37%: all businesses; ₹4,000 cr composite QIP in Oct-2023.',
  'aum@FY25': '+27%: LAP, home loans and SBPL carried growth while vehicles slowed.',
  'aum@FY26': '+21%: vehicles back (+18%); gold loans launched.',
  'provisions@FY20': '+161%: Covid provisions.',
  'provisions@FY21': '+44%: Covid losses; 2.0% of assets.',
  'provisions@FY22': '−36%: normalising.',
  'provisions@FY24': '+55%: book +37% and rising vehicle stress.',
  'provisions@FY25': '+89%: vehicle down-cycle and fintech-sourced CSEL losses.',
  'provisions@FY26': '+42%: incl. ₹200 cr overlay for geopolitical risks.',
  'pat@FY20': '−12%: Covid provisions.', 'pat@FY21': '+44%.', 'pat@FY22': '+42%.', 'pat@FY23': '+24%.', 'pat@FY24': '+28%.', 'pat@FY25': '+25%.', 'pat@FY26': '+23%: higher credit cost offset by cheaper funding.',
  'nim@FY24': 'Funding costs rose faster than yields.', 'nim@FY26': 'Cost of funds −62bp (our measure) as the RBI cut rates.',
  'creditCost@FY21': 'Covid peak.', 'creditCost@FY23': 'Cycle low.', 'creditCost@FY26': 'Incl. ₹200 cr overlay (0.10pp).',
  'roe@FY20': 'Covid provisions and the FY20 equity raise.', 'roe@FY24': 'Diluted by the Oct-2023 QIP.',
  'aum@FY27E': 'GAM: +22% (upper half of 20-23% guidance).',
  'provisions@FY27E': 'GAM: 1.50% of average AUM (~1.4-1.5% of assets; guidance ~1.5%); overlay kept.',
  'pat@FY27E': 'GAM: lower credit cost and a slightly higher NIM.',
  'nim@FY27E': 'GAM: +12bp; funding flat for the year, up 5-10bp in H2.',
  'netWorth@FY27E': 'Incl. ₹630 cr CCD conversion (Jul and 30-Sep-2026).',
  'pat@FY28E': 'GAM: IRDAI haircut takes ~0.15% of AUM off fee income.',
  'pat@Q4FY26': '+31%: ₹200 cr overlay; ROE 23%.',
  'pat@Q1FY27': '+46%: credit cost 1.5% (1.8% a year earlier); NIM 8.2% of assets.',
  'expenses@Q2FY25': '+36%: vehicle and CSEL credit costs rising with a 27% larger book.',
  'expenses@Q3FY25': '+44%: same credit-cost upswing.',
  'expenses@Q4FY25': '+42%.',
  'sales@Q2FY24': 'Total income +53% YoY with AUM +37%.',
};

module.exports = { risks, glossary, statementNotes };
