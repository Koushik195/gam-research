// HCL Technologies report, part 2: what the company does, history & corporate actions, industry.
const X = require('./HCLTECH.ctx');
const { C, D, F, A, n0, n1, pc, rup, SRC, SA, SQ, A26, A25, A21, Q1, FY26, b, P, PEERS, shortName } = X;
const q1 = SQ.find(q => q.q === 'Q1FY27');

const business = {
  id: 'business', nav: 'What HCLTech does', kicker: 'The business', title: 'Three businesses: IT services, engineering services and a software portfolio bought mostly from IBM',
  blocks: [
    { p: `HCLTech sells technology work to large companies, mostly in the US (56% of Services revenue) and Europe (28%). It reports three segments. **IT & Business Services** (₹${n0(A26.itbsRev)} cr in FY26, 74% of revenue) runs and changes clients' systems: applications, cloud and data-centre infrastructure, digital workplace and networks, cybersecurity, back-office processes and, increasingly, AI and data work. It is strongest in long "managed services" contracts where HCLTech runs a client's infrastructure for five to ten years. **Engineering & R&D Services** (₹${n0(A26.ersRev)} cr, 17%) designs products for technology, telecom, auto, medical-device and semiconductor companies: software, embedded systems, chips. **HCLSoftware** (₹${n0(A26.swRev)} cr, 9.5%) owns software products, largely acquired (select IBM products in 2019, Actian, Zeenea, Jaspersoft), sold mostly as subscriptions and support.` },
    { exhibit: { type: 'table', title: 'The three segments, FY26', head: ['Segment', 'Revenue (₹ cr)', 'Share', 'CC growth FY26', 'EBIT margin', 'What drives it'], wide: [5], rows: [
      ['**IT & Business Services**', n0(A26.itbsRev), '73.8%', `${FY26.itbsCcGrowthPct}%`, `${n1(A26.itbsMarginPct)}%`, 'Large managed-services and transformation deals; financial services, manufacturing, retail, public services'],
      ['**Engineering & R&D Services**', n0(A26.ersRev), '17.0%', `${FY26.ersCcGrowthPct}%`, `${n1(A26.ersMarginPct)}%`, 'Tech and telecom R&D budgets; semiconductors, physical AI, medtech'],
      ['**HCLSoftware**', n0(A26.swRev), '9.5%', `${FY26.swCcGrowthPct}%`, `${n1(A26.swMarginPct)}%`, 'Renewals of subscription and support (85%), perpetual licences (9%, lumpy, government-heavy)'],
      ['Inter-segment', n0(A26.elimRev), '(0.3%)', '–', '–', 'HCLSoftware products used by Services'],
      { hl: true, cells: ['**HCLTech**', `**${n0(A26.consRev)}**`, '**100%**', `**${FY26.ccGrowthPct}%**`, `**${n1(A26.ebitMarginPct)}%**`, 'US$14,664 m; ex restructuring 17.9% EBIT'] },
    ], source: 'AR FY26 note 3.30; Q4FY26 investor release. EBIT margins exclude the Rs956 cr Labour Codes charge.' } },
    { pair: [
      { type: 'hbar', title: 'Financial services and manufacturing lead the vertical mix', unit: 'Share of Services revenue, Q1FY27 (%)', x: ['Financial Services', 'Manufacturing', 'Technology & Services', 'Life Sciences & Healthcare', 'Telecom & Media', 'Retail & CPG', 'Public Services'], series: [{ name: 'Share', values: [22.1, 18.7, 14.4, 14.0, 11.2, 10.3, 9.3], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 investor release' },
      { type: 'hbar', title: 'Vertical growth: Telecom shrinking 11%, Public Services +12%', unit: 'Growth, constant currency, YoY, Q1FY27 (%)', x: ['Public Services', 'Retail & CPG', 'Technology & Services', 'Financial Services', 'Manufacturing', 'Life Sciences & Healthcare', 'Telecom & Media'], series: [{ name: 'Growth', values: [12.0, 10.1, 7.3, 5.3, 3.7, 0.4, -10.9], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 investor release' },
    ] },
    { exhibit: { type: 'table', title: 'Scale and reach', head: ['', 'Detail'], wide: [1], rows: [
      ['People', `${n0(Q1.headcount)} at Jun-2026 (down ${n0(-Q1.netAdds)} in the quarter); LTM attrition ${Q1.attritionPct}%; revenue per employee US$${Q1.revPerEmpUsdK}k a year (+3.3% YoY)`],
      ['Clients', '23 clients above US$100 m a year, 60 above US$50 m, 987 above US$1 m (LTM, Jun-2026); top 5 clients 11.6% of revenue, top 20 28.0%'],
      ['Geography (Services, Q1FY27)', 'US 56.0%, Europe 27.6%, rest of world 13.1%, India 3.3%'],
      ['AI', `Advanced AI revenue US$${Q1.advAiUsd} m in Q1FY27 (+${Q1.advAiCcYoYPct}% YoY CC); AI Force platform in 92 accounts; 23 industry AI solutions; US$150 m stake in Sarvam AI; AI data-centre business announced`],
      ['HCLSoftware', 'HCL DX, Unica, Commerce, BigFix, AppScan, Workload Automation, UnO, Actian Ingres and data intelligence, Jaspersoft; ARR US$1,063 m'],
    ], source: 'Q1FY27 investor release and call' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Fifty years of the HCL group; the IBM software deal still shapes the numbers',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: C.historySrc } },
    { callout: '**Corporate actions and per-share data:** a 1:1 bonus in Dec-2019 doubled the share count to 271.37 cr; there have been no buybacks since FY19 and no bonus or split since. Screener\'s consolidated "Net Profit" is before a small minority interest (₹6-24 cr a year) while its EPS is after; we use the attributable figure (HCLTECH.patch.js), so the model\'s share count (271.35 cr) matches the 271.37 cr in issue. One-offs in the history: a ₹574 cr gain on selling the State Street JV stake (FY25, inside other income) and the ₹956 cr Labour Codes charge (FY26, which Screener nets into other income).' },
  ],
};

// Peer growth FY23-26 from each peer's Screener file (order of X.PEER_SYMS)
const fs = require('fs'), path = require('path');
const grow = (s, row) => { const T = JSON.parse(fs.readFileSync(path.join(X.ROOT, 'data', 'raw', s, 'screener.json'), 'utf8')).tables['profit-loss']; const i = p => T.periods.indexOf(p); return Math.round((Math.pow(T.rows[row][i('Mar 2026')] / T.rows[row][i('Mar 2023')], 1 / 3) - 1) * 1000) / 10; };
const REV3 = X.PEER_SYMS.map(s => grow(s, 'Sales')), EPS3 = X.PEER_SYMS.map(s => grow(s, 'EPS in Rs'));
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A mature, slowing market that generative AI is re-pricing',
  blocks: [
    { p: 'Indian IT services companies earn most of their money from large US and European companies, doing work that is cheaper to do from India: building and maintaining software, running data centres and networks, back-office processing and engineering. For two decades the industry grew with outsourcing, then cloud and "digital" (2020-22). Since FY23 growth has slowed to low single digits in dollars: clients cut discretionary projects after the post-Covid boom, and from 2025 generative AI began to change what clients buy. AI tools write and test code, answer support tickets and monitor systems, so the same work needs fewer people. Most Indian IT contracts are priced on effort (people x time) or on fixed fees renegotiated every few years, so productivity gains flow to clients as lower prices.' },
    { exhibit: { type: 'table', title: 'Forces acting on IT services (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for HCLTech'], wide: [2], rows: D.industry.themes.map(r => r.map(rup)), source: D.industry.src } },
    { pair: [
      { type: 'hbar', title: 'Three-year growth: HCLTech led the tier-1 names', unit: 'Revenue growth FY23-26, a year, in rupees (%)', x: X.PEER_SYMS.map(shortName), series: [{ name: 'CAGR', values: REV3, fmt: 'pct' }], labels: 'all', highlight: 'HCLTech', source: 'Screener.in (consolidated)' },
      { type: 'hbar', title: '...but its EPS grew only 3.9% a year, below TCS and Infosys', unit: 'EPS growth FY23-26, a year (%)', x: X.PEER_SYMS.map(shortName), series: [{ name: 'EPS CAGR', values: EPS3, fmt: 'pct' }], labels: 'all', highlight: 'HCLTech', source: 'Screener.in (consolidated, reported EPS)' },
    ] },
    { callout: '**So what:** HCLTech\'s three years of growth leadership came from engineering services, large managed-services deals and acquisitions, but its margins slipped, so shareholders saw little of it. The two mid-caps growing 20%+ (Persistent, Coforge) are where the market still pays for growth (40x+ trailing P/E); the tier-1 names are now priced at 12-18x as low-growth, high-dividend stocks.' },
  ],
};

module.exports = { business, history, industry };
