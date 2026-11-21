// Aditya Birla Capital report, part 3: the NBFC — franchise and AUM mix, spread and NIM, asset quality and credit
// cost, funding, liquidity and capital.
const X = require('./ABCAPITAL.ctx3');
const { C, SG, F, n0, n1, n2 } = X;
const N = C.nbfc, AK = C.annualKpis, QK = C.quarterlyKpis;
const mix = SG.mix, keys = SG.lines.map(l => l.key), name = Object.fromEntries(SG.lines.map(l => [l.key, l.name]));
const SRCN = 'ABCL presentations Q4FY23-Q1FY27 (company basis: ratios on the average lending book, NIM incl. fees)';

const franchise = {
  id: 'franchise', nav: 'NBFC franchise & mix', kicker: 'NBFC', title: 'The NBFC: an MSME lender that is rebuilding its retail book',
  blocks: [
    { p: `The NBFC lends to small businesses (57% of AUM: ₹76,319 cr secured against property or receivables, ₹18,780 cr unsecured), to individuals (14%, mainly personal loans with an EIR of ~16.2%) and to mid-sized companies and developers (29%). About 72% of the book is secured. Disbursements were ₹21,201 cr in Q1FY27 (+34%), 72% of them to retail and SME. After 18-24 months of cutting riskier cohorts the personal-loan share fell from ~19% to 12.5% and is now climbing again (14%). Gold loans start in Q2FY27 with ~200 branches by March 2027.` },
    { pair: [
      { type: 'stacked', title: 'MSME loans drive growth; corporate loans grow slowest', unit: 'NBFC AUM by segment (₹ \'000 crore)', x: mix.map(m => m.q), series: keys.map(k => ({ name: name[k], values: mix.map(m => Math.round(m[k] / 100) / 10), fmt: 'n1' })), minLabel: 10, source: 'Q1FY27 presentation p19' },
      { type: 'column', title: 'Growth by segment, Jun-26 vs Jun-25', unit: 'YoY growth in AUM (%)', x: keys.map(k => name[k]), series: [{ name: 'YoY', values: keys.map(k => Math.round((mix[2][k] / mix[0][k] - 1) * 100)), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p19' },
    ] },
    { callout: `**So what:** growth is broad-based and mostly secured, which is why credit costs fell. The flip side is margin: secured MSME and corporate loans yield less, so a 28% larger book earned a flat NIM. The model assumes AUM growth of {{F.aumGrowth.0|pct}} in FY27E, slowing to {{F.aumGrowth.2|pct}} by FY29E.` },
  ],
};

const spread = {
  id: 'spread', nav: 'Spread & NIM', kicker: 'NBFC', title: 'Spread and NIM: yields fell as fast as funding costs, so margins stood still',
  blocks: [
    { pair: [
      { type: 'line', title: 'Company basis: NIM incl. fees ~6.1% for two years', unit: '% of average lending book', x: AK.map(a => a.fy), series: [{ name: 'Yield incl. fees', values: AK.map(a => a.nbfcYieldCo), fmt: 'pct' }, { name: 'Interest cost', values: AK.map(a => a.nbfcCofCo), fmt: 'pct' }, { name: 'NIM incl. fees', values: AK.map(a => a.nbfcNimCo), fmt: 'pct' }], labels: 'ends', min: 4, max: 15, source: SRCN },
      { type: 'line', title: 'Our basis: NIM ~5% of AUM, a little higher after the raise', unit: '% of average AUM (yield, NIM) or borrowings (cost of funds), standalone', x: 'fin.labels', from: 'FY25', to: 'FY29E', series: [{ name: 'Yield on AUM', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }, { name: 'NIM', ref: 'fin.nim', fmt: 'pct' }], labels: 'ends', min: 3, max: 13, source: 'Screener.in (standalone), Annual Reports; GAM estimates' },
    ] },
    { p: `Two bases are in play. The company quotes margins on the average lending book with fees included (NIM 6.06% in FY26, 6.07% in Q1FY27). Our model uses interest income ÷ average AUM and NII after interest expense (NIM {{fin.nim.11|pct}} in FY26). Both say the same thing: margins peaked in FY24 (6.90% company basis) and have drifted lower as the mix moved to secured MSME and corporate loans. The June raise replaces ~₹4,000 cr of borrowing with equity, worth ~15bp of NIM on our basis in FY27E ({{F.nim.0|pct}}). Beyond that we assume only 5bp a year of yield gain from mix; management's case for more rests on personal loans returning to 18-19% of AUM.` },
    { callout: '**The honest read:** margin expansion has been promised for several quarters and has not come (Motilal Oswal called it "contrary to earlier expectation"). We do not bank on it. Each 10bp of NIM is worth ~₹180-200 cr of pre-tax profit in FY27E, about 4% of standalone profit.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Asset quality', kicker: 'NBFC', title: 'Asset quality: the clean-up worked; Stage 3 is at a record low',
  blocks: [
    { exhibit: { type: 'table', title: 'NBFC asset quality by segment (gross Stage 2 / Stage 3 / Stage 3 cover)', head: ['Segment', 'Jun-25', 'Mar-26', 'Jun-26'], rows: [
      ['Personal & consumer', '2.2% / 2.5% / 67%', '1.3% / 1.3% / 77%', '1.1% / 1.3% / 82%'],
      ['Unsecured business', '1.8% / 5.4% / 36%', '0.8% / 1.5% / 48%', '0.9% / 1.2% / 52%'],
      ['Secured business', '2.1% / 1.6% / 30%', '1.8% / 1.0% / 36%', '1.9% / 1.1% / 33%'],
      ['Corporate / mid-market', '0.0% / 2.2% / 45%', '0.1% / 1.7% / 48%', '0.1% / 1.7% / 50%'],
      ['**Total**', '**1.4% / 2.3% / 41%**', '**1.1% / 1.3% / 48%**', '**1.1% / 1.3% / 48%**'],
    ], source: 'Q1FY27 presentation p24' } },
    { pair: [
      { type: 'column', title: 'Credit cost: 1.5% (FY24) to 1.0% (Q1FY27)', unit: 'Credit provisions ÷ average lending book (%), company basis; Q1FY27 annualised', x: [...AK.map(a => a.fy), 'Q1FY27'], series: [{ name: 'Credit cost', values: [...AK.map(a => a.nbfcCreditCostCo), 1.03], fmt: 'n2' }], labels: 'all', highlight: 'Q1FY27', source: SRCN },
      { type: 'line', title: 'Our forecast lets credit cost drift back up', unit: 'Provisions ÷ average AUM (%), standalone', x: 'fin.labels', from: 'FY25', to: 'FY29E', series: [{ name: 'Credit cost', ref: 'fin.creditCost', fmt: 'pct' }], labels: 'all', min: 0.6, max: 1.5, source: 'Annual Reports; GAM estimates' },
    ] },
    { p: 'Gross Stage 3 fell from 2.27% to 1.30% in a year and Stage 2+3 from 3.70% to 2.43%; 40% of unsecured-business Stage 3 is covered by government guarantee schemes. Coverage on Stage 3 (48%) is modest for a book with unsecured loans, but secured loans carry lower losses. We model credit cost of {{F.creditCost.0|pct}} of AUM in FY27E rising to {{F.creditCost.2|pct}} by FY29E: the benign phase of the cycle will not last for ever, and the book is shifting back to unsecured personal loans.' },
  ],
};

const funding = {
  id: 'funding', nav: 'Funding & capital', kicker: 'NBFC', title: 'Funding and capital: AAA-rated, well matched, and freshly capitalised',
  blocks: [
    { p: `Borrowings were ₹1,42,798 cr in June 2026: term loans, NCDs, commercial paper, ECBs and bank lines, with long-term debt rated AAA by CRISIL, ICRA and India Ratings. ₹9,280 cr of long-term money was raised in Q1FY27. The asset-liability profile shows a cumulative surplus in every bucket up to one year. About 30% of borrowings and 56% of loans are floating, so a rate rise reprices assets faster than liabilities. Capital: Tier 1 of 15.95% and CRAR of 18.82% after the June raise (regulatory minimum 10% / 15%); investments in subsidiaries are deducted from Tier 1.` },
    { pair: [
      { type: 'column', title: 'Tier 1 capital back to 16% after the raise', unit: 'Tier 1 ratio (%), standalone', x: ['Mar-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Tier 1', values: [15.93, 13.82, 15.95], fmt: 'n2' }], labels: 'all', source: 'Q4FY26 and Q1FY27 presentations p8' },
      { type: 'line', title: 'Leverage creeps up again from FY28E', unit: 'NBFC AUM ÷ standalone net worth (x)', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'AUM ÷ equity', ref: 'fin.leverage', fmt: 'n2' }], labels: 'all', min: 4, max: 8, source: 'Screener.in (standalone); GAM estimates' },
    ] },
    { callout: `**Our read:** funding is a strength (group parentage, AAA, diversified lenders) and capital is now comfortable. At our growth rates AUM ÷ equity goes from {{F.leverage.0|n2}}x in FY27E to {{F.leverage.2|n2}}x in FY29E, so the "no raise for three years" promise looks realistic, provided the subsidiaries do not need more from ABCL than the ~₹500 cr a year we assume.` },
  ],
};

module.exports = { franchise, spread, quality, funding };
