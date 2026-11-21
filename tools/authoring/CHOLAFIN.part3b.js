// Cholamandalam report, part 3b: the new businesses (CSEL, SME, SBPL, gold loans).
const X = require('./CHOLAFIN.ctx');
const { C, SG, n0, n1, pc, BUILD } = X;
const QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q1FY26');
const SP = Object.fromEntries(SG.segmentPl.rows.map(r => [r[0], r])), S3 = Object.fromEntries(SG.stage3.rows.map(r => [r[0], r]));
const newKeys = ['csel', 'sme', 'sbpl', 'gold'];
const newTot = a => newKeys.reduce((s, k) => s + (a[k] || 0), 0);

const newbiz = {
  id: 'newbiz', nav: 'New businesses', kicker: 'Segment: new businesses (14% of AUM)', title: 'The new businesses: high yields, one costly lesson (fintech loans), and gold as the next bet',
  blocks: [
    { p: `In FY22-23 Chola launched three businesses at once: **CSEL** (consumer and small-enterprise loans: unsecured personal, business and professional loans plus consumer-durable finance), **SBPL** (small secured loans to micro-merchants) and **SME** (loans to small manufacturers and traders). Gold loans followed in FY26. Together they were ₹${n0(newTot(QN))} cr in Jun-2026, ${n1(newTot(QN) / QN.total * 100)}% of AUM. They were meant to lift returns above the company average; so far that has worked in SBPL, is starting to work in CSEL, and is not yet visible in SME or gold.` },
    { exhibit: { type: 'table', title: 'New businesses at a glance (Jun-2026; ratios as % of segment assets)', head: ['', 'CSEL', 'SME', 'SBPL', 'Gold'], rows: [
      ['AUM (₹ cr)', n0(QN.csel), n0(QN.sme), n0(QN.sbpl), n0(QN.gold)],
      ['Growth YoY', pc((QN.csel / QO.csel - 1) * 100), pc((QN.sme / QO.sme - 1) * 100), pc((QN.sbpl / QO.sbpl - 1) * 100), '₹97 cr a year ago'],
      ['Yield (Q1FY27)', '20.2%', '13.2%', '25.2%', '15-17% (call)'],
      ['Loan losses FY26 → Q1FY27', '6.3% → 4.7%', '1.2% → 1.3%', '2.9% → 2.3%', 'nil'],
      ['Pre-tax ROA FY26 → Q1FY27', '1.6% → 3.3%', '2.1% → 2.3%', '7.4% → 7.9%', 'loss (~₹99 cr FY26, derived)'],
      ['Stage 3, Jun-2026', `${S3.CSEL[3]}%`, `${S3.SME[3]}%`, `${S3.SBPL[3]}%`, `${S3.Gold[3]}%`],
      ['FY26 PBT (₹ cr)', n0(SP['of which CSEL'][4]), n0(SP['of which SME'][4]), n0(SP['of which SBPL'][4]), '≈ −99'],
    ], source: 'Q1FY27 presentation p22, p57-58, p73; Q1FY27 call; gold PBT = consumer ecosystem less home loans and CSEL (GAM arithmetic)' } },
    { pair: [
      { type: 'stacked', title: 'New businesses: ₹1,600 cr to ₹31,700 cr in four years', unit: 'AUM (₹ \'000 crore), March; Q1FY27 = Jun-2026', x: [...SG.annual.filter(a => a.fy >= 'FY22').map(a => a.fy), 'Q1FY27'], series: newKeys.map(k => ({ name: { csel: 'CSEL', sme: 'SME', sbpl: 'SBPL', gold: 'Gold' }[k], values: [...SG.annual.filter(a => a.fy >= 'FY22'), QN].map(a => Math.round((a[k] || 0) / 100) / 10), fmt: 'n1' })), minLabel: 1.5, source: 'Q4FY24 and Q1FY27 presentations' },
      { type: 'column', title: 'CSEL: loan losses falling after the fintech exit', unit: 'CSEL loan losses (% of assets)', x: ['FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Loan losses', values: [6.3, 5.2, 4.7], fmt: 'n1' }], labels: 'all', min: 0, max: 7, source: 'Q1FY27 presentation p73; Q4FY26 call (Q4 5.2%)' },
    ] },
    { h: 'CSEL: the lesson' },
    { p: 'CSEL grew fast in FY23-FY24 partly through fintech partnerships, and those loans went bad: CSEL lost 6.3% of its assets in FY26 and earned a pre-tax ROA of only 1.6%. Chola shut the partnership channel (the fintech book was 1.5% of Chola\'s loans in May-2025 and ₹300-400 cr was left to run off in May-2026), tightened its scorecards and now covers ~80% of its ~₹5,000 cr business-loan book with CGTMSE, the government credit guarantee (₹38 cr of guarantee fees in Q4FY26). The result: CSEL AUM grew only 4% in FY26, but losses fell to 4.7% and ROA rose to 3.3% in Q1FY27. Management expects ROA above 3% this year and ~20% asset growth by Q4FY27.' },
    { h: 'SBPL and SME: high returns, unproven through a cycle' },
    { p: 'SBPL lends under ₹20 lakh to micro-merchants against property, at ~25% yields; it earns a 7-8% pre-tax ROA even with 2-3% loan losses. Its weakness is collections: loans this small cannot be enforced under SARFAESI, so Chola sells bad loans to asset-reconstruction companies, and Stage 3 swings with those sales (4.70% in Jun-2026, from 3.53% in March). SME is the opposite: low yields (13%) and a thin 2.1-2.3% ROA, with Stage 3 rising from 3.22% to 3.83% in the quarter. Both businesses are less than four years old; neither has been through a downturn.' },
    { h: 'Gold loans: a fast start, a long payback' },
    { p: `Gold loans reached ₹${n0(QN.gold)} cr in Jun-2026 from 171 stand-alone branches (119 in March). Chola plans 360 more in FY27 and targets ~₹5,000 cr of AUM by Mar-27 (we build ₹${n0(BUILD[0].gold)} cr, then ₹${n0(BUILD[2].gold)} cr in FY29E). The average loan is ~₹2 lakh, 90% of customers are new to Chola, branches hold ₹12-15 cr each, and management expects this year's branches to break even by the end of next year. It is a sensible use of the brand in a market dominated by Muthoot and Manappuram and by banks, but at <1% of AUM it will not move group profit until FY28-29, and the branch build adds to costs now.` },
    { callout: '**Our view:** the new businesses are doing what they were designed to do, raising the blended yield, but the CSEL episode shows the cost of growing unsecured loans through partners. We model them growing faster than the group (15-30% a year, gold faster) and treat their credit cost as structurally higher, which is why our group credit cost edges up to {{F.creditCost.2|pct}} in FY29E even as vehicles stabilise.' },
  ],
};

module.exports = { newbiz };
