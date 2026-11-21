// Poonawalla Fincorp report, part 6b: risks and honest summary, glossary, statement notes.
const X = require('./POONAWALLA.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, fin, n0, n1, n2, pc, price, pbMult, bvSep28, fwdPbNow, PBX, rating, buyBelow, sellAbove, mv, Q1, cc10, NORAISE } = X;
const cof10 = F.avgBorrowings[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100; // 10bp cost of funds, % of FY28E PAT

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a BUY on the street\'s yardstick, with the fundamentals well behind the price',
  blocks: [
    { callout: `**What you are buying:** a promoter-backed, AAA-funded consumer and small-business lender that cleaned up a bad book in FY25, rebuilt itself around thirteen products under an experienced team, and has since tripled its quarterly ROA (0.68% → 1.98%) while growing AUM ~60% a year. Credit cost and early delinquencies are falling; the next leg of profit growth comes from scale.` },
    { callout: `**What you are paying:** ${n2(V.currentPb)}x Mar-26 book and ${n1(fwdPbNow)}x our FY28E book, for an ROE of ~6% in FY26 and {{F.roe.0|pct0}}-{{F.roe.2|pct0}} in our FY27-29E, below a ${n1(V.ke)}% cost of equity. On the street's P/B method, at ${pbMult}x Sep-28E book (below the stock's ${PBX.med}x ex-trough median), the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}) and the house rule gives a ${rating}. On returns it is expensive: justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}, and the price implies a ~{{dcf.impliedRoe|pct0}} ROE for ever. The upside exists only if the market keeps paying for management's ROA target before it is delivered.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Credit cost below 2.2% for two quarters with coverage stable (not falling)', 'Medium', 'Q2FY27 results (due by mid-November 2026) and Q3FY27'],
      ['ROA above 2.5% on a sustained basis', 'Low-Medium (FY28)', 'Quarterly ROA; opex/AUM after the gold-branch roll-out'],
      ['Next equity raise priced well above book, with the promoter participating', 'Medium', 'Board announcements under the ₹5,500 cr enabling approval'],
      ['New books (Prime PL, CD, CV, education) seasoning with low losses past 18-24 months', 'Medium', 'Early-delinquency curves and Stage 2/3 by product'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['A second credit event in unsecured loans (instant consumer, business, Prime PL) as books age', 'Medium', 'Bear case: credit cost ~3%, EPS FY28E ₹{{scen.bear.eps.1|n2}}, target {{scen.bear.tp|inr}}'],
      ['Growth outruns capital; raise priced near or below book', 'Medium', 'Book per share and multiple both lower; without a raise the base target is ~₹' + n0(NORAISE.tp)],
      ['ROA target slips again', 'Medium-High', 'Multiple compresses toward the bears\' ~1.9x FY28E book'],
      ['Funding costs rise (bond yields, rating outlook, liquidity)', 'Low-Medium', `Each 10bp of cost of funds is ~${n1(cof10)}% of FY28E profit; no deposit cushion`],
      ['Assignment (DA) gains dry up', 'Medium', '~30% of FY26 pre-tax profit came from selling loans'],
      ['Regulation: risk weights, revolving credit, insurance commissions', 'Low-Medium', 'More capital per loan; lower cross-sell income'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers we would stay buyers below ~₹${n0(buyBelow)} and turn sellers above ~₹${n0(sellAbove)}.** The rating sits just above the BUY line: at 2.3x Sep-28E book the target is ~₹${n0(Math.round(2.3 * bvSep28 / 10) * 10)} (HOLD), and without the FY28E raise ~₹${n0(NORAISE.tp)} (HOLD).`,
      `**Biggest swing factors:** credit cost (10bp ≈ ${n1(cc10)}% of FY28E profit) and the multiple (0.5x ≈ ₹${n0(0.5 * bvSep28)} a share). For a long-term holder, the credit performance of the new books as they season matters more than either.`,
      `**Portfolio fit:** a high-risk, high-beta financials position for investors who believe in the management team and the sponsor; not a quality compounder yet. Size it for a bear case near {{scen.bear.tp|inr}}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'ROA, Q1FY27', v: `${Q1.roaCo}%`, d: 'from 0.68% a year earlier; target 3-3.5%' },
      { k: 'Credit cost, Q1FY27', v: `${Q1.creditCostCo}%`, d: 'from ~3.1% in Q4FY25' },
      { k: 'ROE, FY27E', v: '{{F.roe.0|pct}}', d: `cost of equity ${n1(V.ke)}%` },
      { k: 'Price ÷ FY28E book', v: `${n1(fwdPbNow)}x`, d: `ex-trough median ${PBX.med}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['NBFC', 'Non-banking financial company: a lender regulated by the RBI. Poonawalla does not take public deposits.'],
      ['AUM', 'Assets under management: all loans the company manages, incl. small pools sold to banks.'],
      ['Disbursements', 'New loans paid out in a period.'],
      ['NII, NIM', 'Net interest income = interest earned − interest paid. NIM = NII ÷ average AUM (our basis, excl. fees; the company\'s "NIM" includes fees).'],
      ['Net total income (NTI)', 'NII plus fees and other operating income.'],
      ['Cost-to-income, opex/AUM', 'Operating expenses ÷ net total income; operating expenses ÷ average AUM.'],
      ['Credit cost', 'Provisions for bad loans plus losses on selling bad loans, ÷ average AUM.'],
      ['Stage 1 / 2 / 3, ECL', 'Ind AS 109 buckets: performing, under-performing (30-90 days overdue) and non-performing (90+ days) loans. ECL = expected credit loss provisions held against them.'],
      ['GNPA / NNPA, PCR', 'Gross / net non-performing loans (Stage 3) as % of loans; provision coverage = provisions on Stage 3 ÷ Stage 3 loans.'],
      ['6-MoB 30+', 'Share of loans made in a quarter that are 30+ days overdue six months later: an early warning of credit quality.'],
      ['Write-off', 'Removing a loan judged uncollectable from the books (it may still be pursued).'],
      ['STPL', 'Short-ticket (small) personal loans: the digital book whose losses caused the FY25 loss.'],
      ['LAP, Prime PL, CD, CV', 'Loan against property; personal loans to employees of large companies; consumer-durable EMI loans; commercial-vehicle loans.'],
      ['Assignment / derecognition gain', 'Profit booked when loans are sold to another lender (e.g. a bank) at a premium.'],
      ['CRAR, Tier 1', 'Capital ÷ risk-weighted assets (minimum 15% for NBFCs); Tier 1 is the core equity part.'],
      ['Leverage', 'AUM (or assets) ÷ net worth.'],
      ['ROA, ROE', 'Profit ÷ average assets (or AUM); profit ÷ average shareholders\' equity.'],
      ['P/B, justified P/B', 'Price ÷ book value per share. Justified P/B = (ROE − g) ÷ (cost of equity − g): the multiple a steady ROE and growth rate support.'],
      ['Residual income', 'Book value plus the present value of future profit above the cost of equity.'],
      ['Trough years', 'Years in which earnings collapsed (a loss, or under half the prior three-year peak); multiples on them are left out of history medians.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the book value (or EPS) the market will look at in September 2027.'],
      ['QIP / preferential issue', 'Qualified institutions placement (new shares sold to institutions) / new shares sold to named buyers such as the promoter.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'aum@FY24': '+55%: growth before the STPL problems surfaced.',
  'aum@FY25': '+43% despite cutting STPL from 21% to 8% of on-book AUM in two quarters.',
  'aum@FY26': '+69%: six new products and 400 gold branches; new products 14% of AUM by Mar-26.',
  'sales@FY24': 'Audited continuing-operations basis (Screener grossed the housing-sale gain into revenue; see POONAWALLA.patch.js).',
  'provisions@FY24': '₹72 cr: legacy write-backs; excludes the ₹1,473 cr exceptional provision and write-off netted with the ₹2,309 cr housing-sale gain.',
  'provisions@FY25': 'Incl. the ₹666 cr accelerated provision on the erstwhile STPL book (Q2FY25) and ₹94 cr loss on NPA sales.',
  'provisions@FY26': '₹1,104 cr impairment + ₹106 cr loss on selling NPAs; write-offs ₹975 cr net of recoveries.',
  'pat@FY24': '₹1,683 cr incl. the ₹816 cr net exceptional gain (pre-tax) and ₹32 cr from the discontinued housing arm; ₹1,045 cr before exceptional items.',
  'pat@FY25': 'Loss: STPL clean-up and investment in new businesses.',
  'pat@FY26': 'Recovery: ₹63 cr in Q1 to ₹255 cr in Q4.',
  'nim@FY25': '−170bp: STPL cut, LAP and mid-market grew, leverage rose.',
  'netWorth@FY26': '+₹1,500 cr preferential issue to the promoter (Sep-2025).',
  'aum@FY27E': 'GAM: +40%, top of the 35-40% guidance (Q1FY27 +11.1% QoQ).',
  'provisions@FY27E': 'GAM: 2.25% of average AUM vs 2.40% in Q1FY27 (company basis).',
  'netWorth@FY27E': 'Incl. the ₹2,500 cr QIP (Apr-2026; ₹2,454 cr net in the Jun-26 balance sheet).',
  'netWorth@FY28E': 'Incl. an assumed ₹3,000 cr raise at ₹443.85 (not announced).',
  'pat@FY27E': 'GAM: ₹345 cr a quarter needed for Q2-Q4 vs ₹308 cr in Q1.',
  'pat@Q2FY25': 'Loss of ₹471 cr on the ₹666 cr accelerated STPL provision.',
  'expenses@Q2FY25': 'Includes the ₹666 cr accelerated STPL provision.',
  'pat@Q3FY25': '₹19 cr: ₹520 cr of STPL write-offs in the quarter (incl. ₹163 cr accelerated).',
  'pat@Q2FY24': 'Incl. the ₹822 cr pre-tax exceptional net gain on the housing sale.',
  'pat@Q1FY27': '₹308 cr, ROA 1.98%: best quarter since the reset.',
  'sales@Q1FY27': '+77% YoY on AUM +62.5%.',
  // Magma era (before the Poonawalla takeover): Screener lines only; no detailed cause in our sources
  'pat@FY17': 'Magma era: revenue −5%, expenses incl. loan-loss provisions +17% (Screener); cause not detailed in our sources.',
  'pat@FY18': 'Rebound from FY17\'s low base: expenses −35% (Screener).',
  'pat@FY20': 'Magma era: expenses incl. provisions +26% (Screener); the year ended with the Covid lockdown.',
  'pat@FY21': 'Loss of ₹559 cr: Magma\'s provisions ₹1,319 cr (13.4% credit cost) before the Poonawalla takeover (Motilal Oswal history table).',
  'pat@FY22': 'First year under Poonawalla: incl. ₹139 cr after-tax exceptional items; consolidates the housing arm.',
  'pat@FY23': 'Incl. ₹212 cr after-tax exceptional items and provision write-backs (standalone credit cost −₹134 cr).',
  'roe@FY17': 'Profit collapse (see net profit).', 'roe@FY18': 'Recovery.', 'roe@FY20': 'Profit −91% (see net profit).', 'roe@FY21': 'Magma loss year.',
  'roe@FY22': 'Profit recovery, but ₹3,456 cr of new equity raised (2021) holds ROE down.',
  'roe@FY24': '22.4% incl. the net exceptional gain; ~14% before it.', 'roe@FY25': 'Loss year (STPL clean-up).', 'roe@FY26': 'Recovery; still ~6%.',
  'nii@FY26': '+43% on AUM +69%: margin fell as LAP and mid-market grew and leverage rose.',
  'nim@FY26': '−75bp: mix toward lower-yield secured and mid-market loans; borrowings rose from 3.2x to 4.7x equity.',
  'creditCost@FY25': '5.1% of average AUM incl. the ₹666 cr STPL clean-up and ₹520 cr of STPL write-offs in Q3.',
  'creditCost@FY26': '2.5%: STPL behind; new-loan delinquency falling; provision cover halved (see asset quality).',
  'sales@Q2FY26': '+56% YoY: AUM +68%.', 'sales@Q3FY26': '+72% YoY: AUM +78%.', 'sales@Q4FY26': '+81% YoY: AUM +69%; assignment income ₹78 cr.',
  'expenses@Q3FY25': '+255% YoY: credit cost ₹348 cr; ₹520 cr of STPL write-offs in the quarter.',
  'expenses@Q4FY25': '+155% YoY: credit cost ₹253 cr and investment in six new businesses.',
  'expenses@Q1FY26': '+143% YoY: credit cost ₹241 cr; opex ₹443 cr (4.8% of AUM) on new-business build-out.',
  'expenses@Q4FY26': '+48% YoY: opex ₹582 cr, credit cost ₹354 cr; growth slower than the book.',
  'expenses@Q1FY27': '+47% YoY: opex ₹631 cr (4.06% of AUM), credit cost ₹373 cr (2.40%).',
  'pat@Q4FY25': '₹62 cr: credit cost down 27% QoQ; no accelerated write-off.',
  'pat@Q1FY26': '₹63 cr: opex at its peak (4.8% of AUM).', 'pat@Q2FY26': '₹74 cr: credit cost 2.67%.',
  'pat@Q3FY26': '₹150 cr: opex/AUM down to 4.41%.', 'pat@Q4FY26': '₹255 cr: NIM 9.05% (incl. fees), ROA 1.81%.',
};

module.exports = { risks, glossary, statementNotes };
