// Concord Biotech report, part 4b: capital allocation & returns, ownership and governance.
const X = require('./CONCORDBIO.ctx2');
const { D, C, A, F, n0, n1, ai, b, ke, TRE } = X;
const yrs = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const OW = D.ownership;

const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital & returns: ROE fell from 22% to 14% as profit dropped and cash piled up; we see it back at ~17% only by FY29E',
  blocks: [
    { pair: [
      { type: 'line', title: 'ROE and ROCE: low 20s to FY25, 14-17% in FY26', unit: '%', x: [...yrs, ...F.years], series: [{ name: 'ROE', values: [...yrs.map(y => Math.round(A.roe[ai(y)] * 10) / 10), ...F.roe.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }, { name: 'ROCE (Screener)', values: [...yrs.map(y => A.roce[ai(y)]), null, null, null], fmt: 'pct' }], labels: 'last', min: 0, max: 40, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Where FY21-26 cash went (₹ crore, cumulative)', unit: '₹ crore', x: ['Operating cash flow', 'Capex', 'Dividends', 'Added to cash and funds'], series: [{ name: '₹ crore', values: [Math.round(A.cfo.slice(-6).reduce((s, x) => s + x, 0)), -Math.round(A.capex.slice(-6).reduce((s, x) => s + x, 0)), -Math.round(A.dividendsPaid.slice(-6).reduce((s, x) => s + (x || 0), 0)), Math.round(A.cashAndInvestments[b] - A.cashAndInvestments[ai('FY20')])], fmt: 'num' }], labels: 'all', source: 'Screener.in cash-flow statements' },
    ] },
    { p: `Concord funded Limbasi, the injectable plant and the new subsidiaries from its own cash flow, paid ~30% of profit as dividends since listing (FY26: ₹7.55 a share, 30%) and parked the rest in debt funds. That kept the balance sheet debt-free but diluted returns: cash and funds were ~${Math.round(A.cashAndInvestments[b] / A.netWorth[b] * 100)}% of FY26 net worth. ROE was ${n1(A.roe[b])}% in FY26 against a ${n1(ke)}% cost of equity. On our forecasts ROE recovers to {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} in FY27-29E, still below FY23-25's 20-22%, because cash keeps building (₹${n0(F.treasury[2])} cr by Mar-29E) and working capital stays at ~61% of sales.` },
    { callout: '**Capital allocation risk:** management is "looking at different inorganic growth strategies" in fermentation adjacencies (peptides, veterinary) and has started small (Celliimune, Stellon, Palvella). A large acquisition in an unfamiliar field is the main way this clean balance sheet could go wrong; a higher payout or buyback would be the shareholder-friendly alternative, and management mentions dividends only as "historically" paid.' },
  ],
};

const ownership = base => ({ ...base, title: base.title, blocks: [
  { p: `**Who owns Concord (Jun-2026).** The Vaid family holds ${OW.categories.promoters}%: chairman and MD Sudhir Vaid 28.84%, his wife Manju Vaid 9.55%, Sudman Consultants LLP 4.54%, JMD and CEO Ankur Vaid 0.56%. The three Jhunjhunwala family discretionary trusts (Rekha Jhunjhunwala, trustee) hold 24.09% between them (8.03% each); they are public, not promoter, shareholders. Foreign institutions hold ${OW.categories.fiis}%, domestic institutions ${OW.categories.diis}% and ~${n0(OW.categories.shareholders)} shareholders the rest. The IPO (Aug-2023) was a 100% offer for sale by Helix Investment Holdings (Quadria Capital), which sold its entire 20% at ₹741 a share (₹1,550.5 cr); anchor investors took ₹465 cr.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', '% of shares', 'Type'], rows: OW.named.map(h => [h.holder, `${h.pct}%`, h.type]), source: 'AR FY26 note 16 (Mar-26; promoter total unchanged at Jun-26); Business Today (trusts at 30-Jun-2026); Screener.in' } },
  { callout: '**Our read:** a closely held stock: promoters and the Jhunjhunwala trusts own 68%, institutions ~17%. The trusts\' lock-in ended in Feb-2024 and their stake has been 24.09% in every disclosure we found, but any sale of a 24% block would weigh on the price. The family has not sold or bought since listing.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a capable founder family and a clean regulatory record; some related-party habits and a CEO-chairman structure',
  blocks: [
    { p: `Concord is run by its founder, Sudhir Vaid (chairman and MD, ~five decades in biotechnology; he took over the loss-making unit in 2000), and his son Ankur Vaid (joint MD and CEO, who leads the calls). A new CFO, Raviraj Karia, joined in Q3FY26. The board has nine directors: the two Vaids, two non-independent non-executives (Ravi Kapoor, Rajiv Agarwal) and five independents. The two executive promoters were paid ₹11.0 cr in FY26 (₹7.07 cr and ₹3.91 cr, 111.9x and 66.3x the median employee), 4.2% of attributable profit, with no increase while profit fell 30%.` },
    { verdicts: [
      ['Founder and succession', 'Strong', 'Founder still chairman; son already CEO; long tenure', 'Continuity high'],
      ['Board independence', 'Moderate', '5 of 9 independent; executive promoter as chairman', 'Adequate'],
      ['Audit', 'Strong', C.governance.auditor, 'No qualification found'],
      ['Promoter pay', 'Moderate', '₹11.0 cr for two promoters, 4.2% of FY26 profit; flat in FY26', 'Reasonable'],
      ['Related parties', 'Moderate', 'Office rent to Sudhir Vaid; professional fees to a director\'s firm; Celliimune (₹66 lakh) bought from director Ravi Kapoor', 'Small but present'],
      ['Disclosure', 'Weak', 'No molecule or therapy split, no customer names, no regulated/emerging split; FY26 deck mislabelled domestic vs exports', 'Investors cannot track price erosion'],
      ['Investor communication', 'Strong', 'Candid explanations of FY26; full call audio and transcripts', 'Better than most mid-caps'],
      ['Regulatory compliance', 'Strong', 'No warning letter found; USFDA inspections in 2024-26 ended with procedural observations only', 'A real strength'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (Directors\' report, remuneration annexure, related parties); calls; ICRA; GAM Research' },
    { callout: '**Overall: AMBER.** A competent, long-term owner family with a strong compliance record and fair pay. The weaknesses are thin disclosure of what drives the business and small related-party dealings (the Celliimune purchase from a director is trivial in size but avoidable). None changes our valuation.' },
  ],
};

module.exports = { capital, ownership, governance };
