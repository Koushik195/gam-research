// Tech Mahindra report, part 4: moat scorecard, Q1FY27 and the turnaround scorecard, ownership, governance.
const X = require('./TECHM.ctx');
const { C, D, F, A, n0, n1, pc, pc1, Q1, FY26, SQ } = X;
const T = C.turnaroundPlan;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real telecom depth, no scale edge, and the wrong kind of work for an AI world',
  blocks: [
    { verdicts: [
      ['Scale', 'Weak', 'USD 6.4 bn revenue against TCS ~USD 30 bn, Infosys ~USD 20 bn, HCLTech ~USD 15 bn (FY26 rupee revenue at ~89/USD); operating margin ~11 points below TCS', 'No cost or bidding advantage on mega-deals'],
      ['Domain depth (telecom)', 'Strong', '32% of revenue; OSS/BSS, network services, own software (Comviva); wins with Telefonica Germany, an African telecom group, a NZ operator', 'A genuine niche, but in a client industry that is cutting IT budgets'],
      ['Domain depth (other verticals)', 'Building', 'Payments, wealth, insurance, aerospace, life sciences; Avant acquisition; 63 "must-have" clients added in FY26', 'Promising; one year of evidence'],
      ['Switching costs', 'Moderate', 'Multi-year run and managed-services contracts; top-10 clients 24% of revenue', 'Sticky, but run work is where AI pass-backs hit first'],
      ['Brand / client satisfaction', 'Improving', 'Management claims industry-leading NPS; 182 clients added in FY26', 'Helps win deals; not a pricing moat'],
      ['Parentage', 'Helpful', 'Mahindra group: captive IT work, credibility in manufacturing and auto', 'Support, not a moat'],
      ['AI exposure', 'Negative', 'BPS (16%), testing and infrastructure admin are among the most automatable services; IT headcount −7% YoY', 'Higher deflation risk than peers with more consulting or products'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings, calls and broker notes to Sep-2026)' },
    { callout: '**Honest verdict: no durable moat.** Tech Mahindra has one real specialism (telecom) and a credible plan to build others, but it is a price-taker in most of what it sells, has no scale advantage and is more exposed than the leaders to the kinds of work AI automates first (BPS, testing, infrastructure operations). Its edge today is execution and agility under a strong CEO, which is valuable but not a moat. That matters for the multiple: the market should not pay a Tier-1 quality premium for it.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & the turnaround', kicker: 'Momentum', title: 'Q1FY27 beat on growth and margin; two of the four FY27 targets are already met',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'Change YoY'], rows: [
      ['Revenue (USD mn)', '1,564', '1,625', n0(Q1.usdRevenue), pc1(Q1.yoyPct)],
      ['  constant-currency growth YoY', '−1.0%', '+2.4%', pc1(Q1.ccYoyPct), ''],
      ['Revenue (₹ cr)', '13,351', '15,076', n0(Q1.inrRevenue), pc1(Q1.inrYoyPct)],
      ['EBIT (USD mn) / margin', '172 / 11.1%', '223 / 13.8%', `${Q1.ebitUsd} / ${Q1.ebitPct}%`, '+330 bp'],
      ['Other income (₹ cr; FX loss inside)', '219', '−205', n0(Q1.otherIncomeInr), ''],
      ['Net profit attributable (₹ cr)', '1,141', '1,354', n0(Q1.patInr), '+28%'],
      { hl: true, cells: ['**Basic EPS (₹)**', '**12.87**', '**15.27**', `**${Q1.epsBasic}**`, '**+28%**'] },
      ['Deal wins (USD mn) / free cash flow (USD mn)', '809 / 86', '1,073 / 99', `${n0(Q1.tcvUsd)} / ${Q1.fcfUsd}`, ''],
    ], source: 'Q1FY27 results and presentation (16-Jul-2026); Screener.in. Street expected ~1% CC growth QoQ and a 14.1% EBIT margin' } },
    { bullets: C.q1fy27Call.map(c => `**${c.topic[0].toUpperCase() + c.topic.slice(1)}:** ${c.fact}`) },
    { exhibit: { type: 'table', title: 'The three-year plan: scorecard at 30-Sep-2026', head: ['FY27 target (set Apr-2024)', 'Where it stands', 'Verdict'], wide: [1], rows: [
      ['EBIT margin 15%', `6.1% (FY24) → 9.7% → 12.6% (FY26) → ${Q1.ebitPct}% (Q1FY27); Q4FY27 "upwards of 15%"`, 'Likely; FY27 average ~14.8% on our numbers'],
      ['Revenue growth above peer average', `Q1FY27 +${Q1.ccYoyPct}% CC YoY vs Tier-1 peers guiding 1-4%`, 'Very likely for FY27'],
      ['ROCE above 30%', `22.6% (Q4FY25) → 26.2% (Q4FY26) → ${Q1.roce}% (Q1FY27)`, 'Possible by Q4FY27'],
      ['Return more than 85% of FCF', 'FY26: 91% of FCF (₹51 a share, 94% of EPS)', 'Met'],
      ['Beyond FY27', '"For beyond FY27, we will have to spell out a path" (CEO, Jul-2026)', 'Not set: the key gap'],
    ], source: 'Analyst Day deck (22-Apr-2026), Q1FY27 call transcript' } },
    { callout: '**Why it matters:** the plan has been delivered almost exactly as promised, which is rare in Indian IT and is the main reason the stock held up in 2026. But a delivered plan is a known plan: the market already pays ~18x our FY28E EPS for it. What would move the stock now is a credible FY28-30 roadmap (margins above 16%, growth sustained above 5%) at the Q4FY27 results or a later analyst day.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Promoters held ${OH.jun26.promoters}% at Jun-2026: Mahindra & Mahindra 25.3% plus the TML Benefit Trust's 9.6% (treasury shares from the Satyam merger, eliminated in the consolidated accounts). Indian institutions owned ${OH.jun26.diis}% (Life Insurance Corporation alone 11.4% at Mar-2026, up from 10.1% a year earlier), foreign investors ${OH.jun26.fiis}% (24.2% in Dec-2024) and the public ${OH.jun26.public}%. Foreign funds sold through the 2026 IT sell-off while domestic funds bought.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ['Mahindra & Mahindra Ltd', '25.31%', 'Mar-2026; unchanged for years'],
    ['TML Benefit Trust', '9.62%', 'Treasury shares (Satyam merger); excluded from EPS and from our share count'],
    ['Life Insurance Corporation of India', '11.44%', 'Mar-2026 (10.14% Mar-2025)'],
    ['Foreign portfolio investors (Jun-2026)', OH.jun26.fiis + '%', 'Down from 24.2% (Dec-2024)'],
    ['Domestic institutions (Jun-2026)', OH.jun26.diis + '%', 'Up from 30.7% (Dec-2024)'],
  ], source: 'BSE shareholding pattern via Screener.in (Jun-2026 categories); annual report FY26 (named holders at Mar-2026). Named holders at Jun-2026 were not available to us.' } },
  { callout: '**Our read:** a stable anchor owner (M&M) that does not run the company day to day, and a register that has become more domestic. The TML Benefit Trust\'s 9.4 cr shares (~₹14,400 cr at ₹1,524) are a latent asset: any sale would bring in cash; we value the company on the 88.6 cr shares outside the trust, which treats them as cancelled.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a capable CEO and a strong board; generous pay and the Satyam legacy to watch',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.pay || '']), source: 'Annual report FY26; Q1FY27 call' } },
    { verdicts: [
      ['Delivery against promises', 'Strong', 'Margin, growth and payout targets set in Apr-2024 met or on track', 'Credibility is high'],
      ['Board', 'Strong', 'Chaired by Anand Mahindra; independent directors include Shikha Sharma, Haigreve Khaitan, Tarun Bajaj, Neelam Dhawan, Penelope Fowler, Mukti Khaire', 'Experienced, majority-independent board'],
      ['Audit', 'Watch', 'B S R & Co. LLP, unmodified opinion with an emphasis of matter on the Satyam alleged advances (₹1,230 cr) every year', 'Legacy issue; no new red flags'],
      ['Pay', 'Watch', 'CEO paid GBP 5.4 mn in FY26 (salary 1.36, ESOP perquisite 2.93, bonus 1.11), 1,085x the median employee; CFO pay +88% excluding ESOPs', 'High even by Indian IT standards; mostly ESOPs and bonus tied to targets'],
      ['Related parties', 'Moderate', 'Mahindra group companies are clients (e.g. M&M\'s enterprise data and AI programme) as well as the anchor shareholder', 'Normal for a group company; watch the pricing of group work'],
      ['Capital allocation', 'Improving', '85%+ of FCF returned; FY21-23 acquisitions destroyed value; now tuck-ins only', 'Discipline under the new team'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, results, calls)' },
  ],
};

module.exports = { moat, guidance, ownership, governance };
