// M&M Finance report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./M&MFIN.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, A, AS, fin, n0, n1, n2, pc, price, pbMult, bvSep28, fwdPbNow, PB21, rating, buyBelow, sellAbove, mv, Q1, cc10, feeCutEps28, insCom, overlay, overlayEps } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a better lender, a ${rating} at this price`,
  blocks: [
    { callout: `**What you are buying:** India's largest tractor financier and Mahindra's in-house lender, with a 1,300-branch rural franchise, AAA funding and a strong parent; a book cleaned up to its best asset quality in eight years (Stage 3 ${Q1.gnpa}%, Stage 2+3 ${Q1.stage23}%, ₹${n0(overlay)} cr of overlays on top); a finished digital rebuild; and profit up 75% in Q1FY27. You are also buying a lender whose ROE has not beaten its cost of equity since FY19 and whose profit fell 28-42% in three of the last ten years.` },
    { callout: `**What you are paying:** ${n2(fwdPbNow)}x our FY28E book and ${n1(price / F.eps[1])}x FY28E EPS, in line with its ${PB21.med}x median forward P/B since 2021 after a 20% fall from the August high. On the street's method that gives {{dcf.tp|inr}} ({{dcf.upside|chg}}) and a ${rating}. It is not cheap on fundamentals: at a ${n1(V.ke)}% cost of equity a ~13% ROE lender is worth ~1.1x book (justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}), and the price implies a ~{{dcf.impliedRoe|pct0}} long-run ROE. You are paying for the turnaround to keep working through a drought year.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Credit cost stays at ~1.5% of assets through H2FY27 without using the overlays', 'Medium', 'Q2FY27 results (due by mid-November 2026) and Q3; tractor collections after the kharif harvest'],
      ['IRDAI drops or softens the caps on loan-linked commission', 'Low-Medium', 'Final regulations after the 25-Oct-2026 comment deadline'],
      ['Non-wheels growth of 30%+ with stable asset quality (mortgages after the MRHFL merger)', 'Medium', 'Quarterly non-wheels AUM and Stage 3; merger approvals'],
      ['A price below ~₹' + n0(buyBelow), 'n.a.', 'At today\'s target that would be 15%+ upside (our BUY line)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Drought damage: tractor and rural-transport borrowers miss payments after a ~13%-short monsoon; a second poor year', 'Medium', `Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit; the bear case (~2.35% of AUM) cuts FY28E EPS to ₹{{scen.bear.eps.1|n2}}`],
      ['IRDAI caps cut most loan-linked insurance commission', 'Medium', `Base already takes ~₹${n1(feeCutEps28)} off FY28E EPS; ₹${n0(insCom)} cr of FY26 commission at stake, plus some MIBL income`],
      ['Rate hikes: repo +25-50bp', 'Medium-High', '44% of borrowings floating; vehicle loans fixed-rate: margin squeeze for 2-3 quarters'],
      ['Bank competition in cars and trucks; more pressure on yields', 'Medium', 'NIM below our forecast; growth pushed toward riskier segments'],
      ['Control failures in a 1,300-branch network (frauds, collection conduct)', 'Low', 'One-off losses; regulatory action as in Sep-2022'],
      ['Growth slows to ~10% (wheels stall)', 'Low-Medium', 'Bear case: AUM +10/11/11%; lower operating leverage'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would buy below ~₹${n0(buyBelow)} and sell above ~₹${n0(sellAbove)}.** The 30-Sep price of ₹${n2(price)} sits in between; at 1.6x Sep-28E book the target would be ~₹${n0(Math.round(1.6 * bvSep28 / 5) * 5)} (a BUY).`,
      `**Biggest swing factors:** credit cost (10bp ≈ ${n1(cc10)}% of FY28E EPS), the multiple (0.1x ≈ ₹${n0(0.1 * bvSep28)} a share), the IRDAI outcome (~${n1(feeCutEps28 / F.eps[1] * 100)}% of FY28E EPS in our base) and the use of the overlays (~₹${n1(overlayEps)} a share if released in full).`,
      '**Portfolio fit:** a cyclical rural-recovery holding with a 2-3% dividend yield, not a compounder. Best bought after a credit-cost scare, when the stock has traded near 1.1x forward book; size positions for a bear case near {{scen.bear.tp|inr}}.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Group AUM, Jun-2026', v: '₹1.46 lakh cr', d: '+14% YoY; 83% vehicles' },
      { k: 'Stage 2+3, Jun-2026', v: `${Q1.stage23}%`, d: 'eight-year low; Stage 3 3.45%' },
      { k: 'ROE, FY27E', v: '{{F.roe.0|pct}}', d: 'vs 13.4% cost of equity' },
      { k: 'Price ÷ FY28E book', v: `${n2(fwdPbNow)}x`, d: `median since 2021: ${PB21.med}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NBFC, upper layer, deposit-taking', 'Non-banking financial company: an RBI-regulated lender without a banking licence. The "upper layer" is the RBI\'s tier for the largest NBFCs, with bank-like rules. A deposit-taking NBFC may accept public fixed deposits (not current or savings accounts).'],
      ['MMFSL, MRHFL, MIBL', 'Mahindra & Mahindra Financial Services (the listed lender); Mahindra Rural Housing Finance (98.43% housing subsidiary, merging in); Mahindra Insurance Brokers (100% insurance broker).'],
      ['Business assets / group AUM', 'MMFSL\'s loans including provisions (₹1,37,449 cr, Jun-2026); group AUM adds MRHFL\'s loans. Wheels = vehicle loans (cars, trucks, used vehicles, tractors, three-wheelers); non-wheels = SME, personal loans, leasing and housing.'],
      ['NII, NIM, gross spread', 'Net interest income = interest earned − interest paid. Our NIM = NII ÷ average AUM. The company\'s "NIM" is its gross spread: total income incl. fees, less interest, ÷ average assets.'],
      ['Net total income, cost-to-income', 'NII plus fees and other operating income; operating expenses ÷ net total income.'],
      ['Credit cost, end losses', 'Provisions ÷ average AUM (our basis) or average assets (company basis). End losses = loans written off; provisions = the change in the stock of expected-loss provisions.'],
      ['Stage 1 / 2 / 3, ECL', 'Ind AS buckets: performing, 30-90 days overdue and 90+ days overdue loans; ECL = expected-credit-loss provisions held against them. IRACP = the RBI\'s simpler minimum provisioning rules.'],
      ['ECL refresh, overlay', 'The annual re-estimation of default and loss rates (done in Q3); an overlay is an extra provision booked on management\'s judgement (₹852 cr in FY26).'],
      ['Collection efficiency', 'Collections of the month\'s dues plus overdues ÷ the month\'s dues.'],
      ['CRAR, Tier 1', 'Capital ÷ risk-weighted assets (minimum 15% for NBFCs); Tier 1 is the core equity part (minimum 10%).'],
      ['ROA, ROE', 'Profit ÷ average assets; profit ÷ average shareholders\' equity.'],
      ['Rights issue, QIP', 'New shares offered to existing shareholders pro rata; qualified institutions placement (shares sold to institutions).'],
      ['IRDAI', 'Insurance Regulatory and Development Authority of India.'],
      ['El Niño, LPA', 'A Pacific warming pattern that often weakens India\'s monsoon; long-period average rainfall (the IMD\'s "normal").'],
      ['P/B, justified P/B', 'Price ÷ book value per share. Justified P/B = (ROE − g) ÷ (cost of equity − g).'],
      ['Residual income', 'Book value plus the present value of future profit above the cost of equity.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the book value (or EPS) the market will look at in September 2027.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY19': '+23%: last pre-crisis growth year.',
  'aum@FY20': '+7%: IL&FS funding squeeze slowed lending.',
  'aum@FY21': '−6%: Covid year; disbursements fell 41%.',
  'aum@FY22': 'Flat: cautious post-Covid year.',
  'aum@FY23': '+24%: post-Covid recovery in vehicles.',
  'aum@FY24': '+22%.',
  'aum@FY25': '+16%: vehicle demand slowed.',
  'aum@FY26': '+13%: H1 flat, H2 boosted by GST cuts; tractors +49% disbursements.',
  'provisions@FY20': '3.2% of AUM: IL&FS-era stress and first Covid provisions.',
  'provisions@FY21': '5.4% of AUM: Covid peak; Stage 3 9.0%.',
  'provisions@FY23': '−56%: post-Covid provision releases.',
  'provisions@FY24': '+65%: incl. ₹136 cr Aizawl fraud provision.',
  'provisions@FY25': 'Incl. a ₹434 cr release from the Q3 ECL model refresh.',
  'provisions@FY26': 'Incl. ₹217 cr overlay (Q4); a ₹635 cr Q3 overlay offset an ECL-refresh release.',
  'pat@FY16': '−15%: rural downturn.', 'pat@FY17': '−33%: second year of the rural downturn.', 'pat@FY18': '+129%: recovery; equity raised.', 'pat@FY19': '+54%: record profit.',
  'pat@FY20': '−42%: IL&FS squeeze and Covid provisions.', 'pat@FY21': '−28%: Covid.', 'pat@FY22': '+47%.', 'pat@FY23': '+80%: provision releases.',
  'pat@FY24': '−6%: vehicle losses, Aizawl fraud.', 'pat@FY25': '+16%: helped by the ECL release.', 'pat@FY26': '+27%: after ₹133 cr labour-code charge and ₹217 cr overlay.',
  'nim@FY25': 'Low point: yields competed down, funding still dear.', 'nim@FY26': 'Cheaper funding and the June-2025 rights issue.',
  'roe@FY21': 'Covid year; rights issue doubled the share count.', 'roe@FY26': 'Diluted by the ₹2,996 cr rights issue.',
  'aum@FY27E': 'GAM: +14% (wheels ~11%, non-wheels ~29%).',
  'provisions@FY27E': 'GAM: 1.75% of average AUM; weak monsoon; overlays kept.',
  'pat@FY27E': 'GAM: lower credit cost than FY26, stable margin.',
  'pat@FY28E': 'GAM: IRDAI fee cut (~0.13% of AUM) and rising leverage.',
  'netWorth@FY27E': 'No equity raise; 36% payout.',
  'pat@Q2FY24': '−47% YoY: higher credit cost.',
  'pat@Q3FY25': '+47% YoY: ₹434 cr provision release from the ECL refresh.',
  'pat@Q4FY25': '−32% YoY.',
  'pat@Q3FY26': '+1% YoY: ₹133 cr labour-code charge; ECL-refresh release parked as a ₹635 cr overlay.',
  'pat@Q4FY26': '+106% YoY: credit cost 1.5% incl. ₹217 cr overlay.',
  'pat@Q1FY27': '+75% YoY: credit cost 1.5% (1.9% a year earlier); ROA 2.4%.',
  'expenses@Q3FY25': '−9% YoY: provision release.',
};

module.exports = { risks, glossary, statementNotes };
