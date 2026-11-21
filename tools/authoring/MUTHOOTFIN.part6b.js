// Muthoot Finance report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./MUTHOOTFIN.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, n0, n1, n2, pc, price, pbMult, bvSep28, fwdPbNow, trailPb, PB21, rating, buyBelow, sellAbove, mv, DEC, fallTo100 } = X;
const cc10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a ${rating} on the street's yardstick, and a bet that gold holds its value`,
  blocks: [
    { callout: `**What you are buying:** India's largest and most efficient gold lender: 5,029 branches, 6.6 million active customers, credit losses of 0.05-0.15% a year, cost-to-income ~25%, an ROE of 18-31% in every year since FY20, a 73% family owner that has not diluted shareholders since 2015, and a balance sheet secured by the most liquid collateral a household owns. What you are also buying is a gold-price derivative: ~${Math.round(DEC.fy20_26.sharePrice)}% of the growth in its gold book since FY20 came from the price of gold.` },
    { callout: `**What you are paying:** ${n1(fwdPbNow)}x our FY28E book and ${n1(price / F.eps[1])}x FY28E EPS, below the stock's ${PB21.med.toFixed(1)}x median forward P/B since 2021, after a 34% fall from January. Our ${pbMult}x on Sep-28E book gives {{dcf.tp|inr}} ({{dcf.upside|chg}}) and a ${rating}; the target implies ~${n1(V.tp / ((F.bvps[0] + F.bvps[1]) / 2))}x book at the target date, below today's ${n1(trailPb)}x trailing, so it needs book growth (~20%+ a year), not a re-rating. The market price implies a long-run ROE of only ~{{dcf.impliedRoe|pct0}}: it is already discounting part of a gold or competition shock.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['AUM guidance raised well above 15% with the yield holding at 18%+', 'Medium', 'Q2FY27 results (due by mid-November 2026)'],
      ['Gold holds or rises from the 30-Sep-2026 level', 'Unknowable', 'Domestic 22-carat rate; tonnes pledged per quarter'],
      ['New entrants slow their branch roll-outs or price rationally', 'Low-Medium', 'Bajaj Finance and others\' gold-loan growth and rates'],
      ['Stage 2 normalises as customers adapt to periodic servicing', 'Medium', 'Stage 2 / Stage 3 in Q2-Q3FY27'],
      ['Credit rating upgrade from AA+', 'Low-Medium', 'ICRA / CRISIL actions'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Gold falls 20%+ (rates rise, the dollar strengthens, the import duty is cut back)', 'Low-Medium', 'Growth stalls for 1-2 years, LTVs breach, yields fall: bear case {{scen.bear.tp|inr}}'],
      ['Rate war with banks and well-funded NBFCs', 'Medium', 'Each 10bp of yield ≈ ' + n1(cc10) + '% of FY28E profit; a FY23-style 300bp cut would take ROE toward the high teens'],
      ['Stage 2 loans roll into Stage 3 under borrower-wise classification', 'Low-Medium', 'Higher provisions and interest reversals; reputational hit'],
      ['Microfinance stress returns at Belstar', 'Medium', 'FY25: ~₹830 cr of subsidiary impairment; ~10% of group profit at risk'],
      ['Regulatory tightening (LTV, interest accrual, auction rules) or a rise in risk weights', 'Low-Medium', 'Slower growth; more capital per loan'],
      ['Fraud or operational lapse in branches handling gold', 'Low', 'Losses and RBI action'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would stay buyers below ~₹${n0(buyBelow)} and turn sellers above ~₹${n0(sellAbove)}.** The rating is close to the line: at 1.8x Sep-28E book the target is ~₹${n0(Math.round(1.8 * bvSep28 / 10) * 10)} (HOLD); at 2.1x (Jefferies' reference multiple) ~₹${n0(Math.round(2.1 * bvSep28 / 10) * 10)}.`,
      `**Biggest swing factors:** the gold price (it sets AUM growth and the multiple), the yield (10bp ≈ ${n1(cc10)}% of FY28E EPS) and the multiple (0.25x ≈ ₹${n0(0.25 * bvSep28)} a share). A 20% fall in gold would still leave a ~${Math.round(100 - X.ltvInt / 0.8)}-point cushion between the average loan (incl. interest) and its gold, so this is an earnings and multiple risk, not a solvency risk.`,
      '**Portfolio fit:** a high-return, low-multiple financial that doubles as a hedge-like exposure to the gold price. Size the position for the bear case ({{scen.bear.tp|inr}}), and treat gold-price weakness as the signal to reassess, not the Q2 headline.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Growth from the gold price, FY20-26', v: `~${Math.round(DEC.fy20_26.sharePrice)}%`, d: `tonnes +${Math.round(DEC.fy20_26.tn)}% in six years` },
      { k: 'Standalone yield, Q1FY27', v: '17.93%', d: '20.76% in Q4FY26; 18-18.5% guided' },
      { k: 'ROE, FY27E', v: '{{F.roe.0|pct}}', d: '31% in FY26 (windfall)' },
      { k: 'Price ÷ FY28E book', v: `${n1(fwdPbNow)}x`, d: `median since 2021: ${PB21.med.toFixed(1)}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NBFC', 'Non-banking financial company: a lender regulated by the RBI that cannot take current or savings deposits. "Upper layer" NBFCs (the largest) face bank-like rules.'],
      ['Gold loan', 'A loan secured by gold jewellery left with the lender; the borrower gets the jewellery back on repayment.'],
      ['AUM', 'Assets under management: the principal of all loans outstanding (₹ crore).'],
      ['LTV (loan-to-value)', 'Loan ÷ value of the gold pledged. The RBI caps it at 75-85% depending on loan size; for bullet loans the loan includes interest due at maturity.'],
      ['Book LTV / margin of safety', 'Gold-loan AUM ÷ market value of all gold pledged (our calculation, excl. accrued interest); margin of safety = 1 − book LTV.'],
      ['Tonnes pledged', 'Gold content of the jewellery held as security.'],
      ['Bullet loan', 'A loan where principal (and often interest) is repaid at the end of the term; now capped at 12 months.'],
      ['Top-up / renewal', 'Extra money lent against the same gold when its price rises / a new loan replacing a maturing one.'],
      ['Auction', 'Sale of pledged gold when a loan is not repaid; any surplus goes back to the borrower.'],
      ['Yield, NII, NIM', 'Interest income ÷ average loans; net interest income = interest earned − interest paid; NIM = NII ÷ average AUM.'],
      ['Cost-to-income', 'Operating expenses ÷ net total income (NII + fees).'],
      ['Credit cost', 'Impairment (loan-loss provisions and write-offs) ÷ average AUM.'],
      ['Stage 1 / 2 / 3, ECL', 'Ind AS 109 buckets: performing, 30-90 days overdue, 90+ days overdue (non-performing); ECL = expected credit loss provisions.'],
      ['Borrower-wise classification', 'If one loan of a borrower is non-performing, all that borrower\'s loans are classified non-performing (applied by Muthoot from Mar-2026).'],
      ['CRAR, Tier 1', 'Capital ÷ risk-weighted assets (minimum 15% for NBFCs); Tier 1 is the core equity part.'],
      ['ROA, ROE', 'Profit ÷ average assets; profit ÷ average shareholders\' equity (attributable to Muthoot shareholders).'],
      ['P/B, justified P/B', 'Price ÷ book value per share. Justified P/B = (ROE − g) ÷ (cost of equity − g).'],
      ['Residual income', 'Book value plus the present value of future profit above the cost of equity.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the book value (or EPS) the market will look at in September 2027.'],
      ['ARC', 'Asset reconstruction company: buys bad loans from lenders; later recoveries can flow back to the seller.'],
      ['SHG / MFI', 'Self-help group; microfinance institution (Belstar lends to women\'s groups without collateral).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY20': '+22%: gold price +36% (Muthoot rate, Mar-19 to Mar-20).',
  'aum@FY21': '+24%: Covid; gold peaked in Sep-2020 then fell 12% by March.',
  'aum@FY22': '+11%: gold +17%, but competition and LTV already high.',
  'aum@FY23': '+11%: gold +16%; industry-wide rate cuts; tonnes −4%.',
  'aum@FY24': '+25%: gold +13%, tonnes +4%; Belstar +62%.',
  'aum@FY25': '+37%: gold +33%, tonnes +11%.',
  'aum@FY26': '+49%: gold +65%; tonnes −6%; Muthoot Money +151%.',
  'nii@FY26': '+58%: yield 20.0% incl. one-off recoveries, ARC receipts, auction income and top-up charges.',
  'provisions@FY22': '+51%: Covid-era overdue loans.',
  'provisions@FY23': '−37%: benign gold-loan losses.',
  'provisions@FY24': '+128%: Belstar book +62%; microfinance stress starting.',
  'provisions@FY25': '+185%: microfinance stress at Belstar (~₹830 cr at subsidiaries); restated ₹1,576 cr (₹1,635 cr first reported).',
  'provisions@FY26': '−35%: Belstar recovery; standalone ₹470 cr.',
  'pat@FY20': '+51%: gold rally, NIM 15.5% (standalone).', 'pat@FY21': '+21%: Covid demand for secured credit.', 'pat@FY22': '+6%.', 'pat@FY23': '−9%: yield cut to 17.7% in a rate war; gold flat.',
  'pat@FY24': '+22%.', 'pat@FY25': '+20%: AUM +37% offset by Belstar provisions.', 'pat@FY26': '+98%: gold +65% and windfall yield; ROE 31%.',
  'nim@FY23': 'Rate war: standalone yield 17.7%.', 'nim@FY26': 'Windfall: standalone yield 20.2%.',
  'creditCost@FY25': 'Belstar microfinance stress.',
  'roe@FY23': 'Trough: slow growth, low yield.', 'roe@FY26': 'Peak: gold price and one-off income.',
  'aum@FY27E': 'GAM: +18% (Q1 +5.3%; gold flat at the 30-Sep level); guidance 15%, to be revised.',
  'nim@FY27E': 'GAM: yield 18.1% (Q1 annualised 18.3% consolidated).',
  'provisions@FY27E': 'GAM: 0.40% of average AUM vs 0.26% annualised in Q1 (Stage 2 bump, microfinance cycle).',
  'pat@FY27E': 'GAM: +10% on a larger book at a lower yield.',
  'pat@Q4FY26': 'Record ₹3,398 cr: yield 20.76% (incl. ~₹85 cr auction and ARC income).',
  'pat@Q1FY27': '−17% QoQ: yield 17.93% as one-offs ended and rates were cut; +43% YoY.',
  'pat@Q3FY26': 'Includes ~₹500 cr of interest written back on recovered NPAs (per Q4 call).',
  'sales@Q1FY27': '−7% QoQ despite AUM +5%: yield reset.',
  'expenses@Q1FY26': 'Belstar loss quarter (₹128 cr loss).',
};

module.exports = { risks, glossary, statementNotes };
