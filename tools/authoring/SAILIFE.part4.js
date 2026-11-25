// Sai Life Sciences report, part 4: moat, quality and regulatory record, margins, earnings quality, capital allocation,
// ownership, management and governance.
const X = require('./SAILIFE.ctx');
const { C, D, A, F, AS, n0, n1, b, ai, sep, Q1, FY26, OIN, MULT, SHARES, cashPath, ptEbitda, ptPerShare } = X;
const OW = D.ownership, MG = C.management;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in integration, large-pharma relationships and regulatory record; weak in scale and new modalities',
  blocks: [
    { p: 'A moat is a lasting advantage that lets a company earn more than its cost of capital for longer than rivals. Sai has a narrow one. It comes from being embedded with large pharma early (discovery and FTE development teams) and staying with a molecule through approval, backed by a clean inspection record. Customers rarely switch a filed supplier. What Sai lacks is scale (700 KL of reactors against several thousand at Divi\'s or Laurus), any biologics capability, and returns that clearly beat its cost of capital: ROE was 14% and ROCE 18% in FY26 against a ~12.5% cost of equity. Syngene, Anthem, Aragen, Cohance, Divi\'s and Laurus in India, and WuXi and other Chinese CDMOs, chase the same pharma work.' },
    { verdicts: D.moat.map(m => [m.factor, m.score, m.evidence, m.score]), head: ['Factor', 'Score', 'Evidence', 'Detail'], title: 'Moat scorecard: three strong, two moderate, one weak', source: 'AR FY26; Q4FY26 and Q1FY27 decks and call; HDFC Securities; GAM Research' },
    { callout: '**Verdict:** a genuine but narrow moat. Integration and large-pharma trust explain why Sai keeps 90%+ of revenue from repeat customers and why its margin has rebuilt to ~29%. But returns are only now clearing the cost of capital, the next ₹2,800 cr of capex has to earn them again, and the moat does not extend to biologics. We would pay a fair multiple for the franchise, not a premium for durability it has not yet shown at higher capital intensity.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Quality & regulatory', kicker: 'Regulatory', title: 'Quality and regulatory record: USFDA and PMDA inspections cleared across sites, no warning letter; one new environmental PIL at Bidar',
  blocks: [
    { p: 'For a contract manufacturer the regulatory record is the licence to operate. Sai says it has a "100% successful track record" in regulatory inspections across its R&D and manufacturing sites: USFDA, Japan\'s PMDA and Mexico\'s COFEPRIS, plus EMA audits and more than 30 PSCI (pharma supply-chain) audits in seven years. We found no warning letter, import alert or recall in the filings. The quality team (300+ QA/QC staff) reports to the CEO. The new Bidar blocks and the Choutuppal site will need their own inspections as commercial products move in.' },
    { exhibit: { type: 'table', title: 'Legal and compliance items disclosed', head: ['Matter'], rows: C.legal.map(l => [l]), source: 'AR FY26 notes 43 and 50' } },
    { callout: '**Our view:** quality is a strength and a reason large pharma awards commercial supply. The Bidar environmental PIL (Kolhar Industrial Area) is at a preliminary stage with no adverse order, but Bidar is Sai\'s only manufacturing site, so we flag it.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: rebuilt from 14% to 29% in three years, partly helped by a provision reversal; we model 28.0-29.0%, inside the company\'s 28-30% guide once forex is stripped out',
  blocks: [
    { p: `Sai's EBITDA margin (Screener basis, forex in other income) was 13.9% in FY23, 19.6% in FY24, 24.2% in FY25 and ${n1(A.ebitdaMargin[b])}% in FY26. Three things drove it: material margin rose from 65% to 74% as the mix moved to discovery and higher-value chemistry; people costs fell from 34% to 31% of sales as scientists became more productive; and other costs fell from 17% to 14%. FY25 also carried a ₹31 cr loss allowance (a commercial customer's destocking) that partly reversed in FY26, flattering FY26 by ~1.2 points. The company's own EBITDA adds forex gains (₹30 cr in FY26: 30.1% margin). Q1FY27 came in at ${Q1.ebitdaCompanyPct}% as new capacity and staff ran ahead of revenue.` },
    { pair: [
      { type: 'line', title: 'Quarterly margins: material margin steady at 71-77%; EBITDA 24-34%', unit: '% of revenue', x: X.SQ.map(q => q.q), series: [{ name: 'Material margin', values: X.SQ.map(q => q.materialMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: X.SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 85, source: 'Screener.in (material margin = 100 − material cost %; EBITDA before forex)' },
      { type: 'column', title: 'Cost lines, % of revenue: everything got leaner', unit: '% of revenue', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Materials', values: [34.7, 30.4, 27.5, 26.0], fmt: 'pct' }, { name: 'Employees', values: [34.3, 33.8, 32.4, 31.2], fmt: 'pct' }, { name: 'Other costs', values: [17.1, 16.2, 15.9, 13.9], fmt: 'pct' }], labels: 'all', source: 'Screener.in expense schedules' },
    ] },
    { exhibit: { type: 'table', title: 'From FY26 to our FY27E margin', head: ['Step', 'EBITDA margin', 'Why'], wide: [2], rows: [
      ['FY26 reported (Screener basis)', `${n1(A.ebitdaMargin[b])}%`, 'Company basis 30.1% incl. ₹30 cr forex gains'],
      ['Less the provision reversal', '~27.8%', '₹25 cr loss-allowance reversal (₹34 cr incl. contract assets) will not recur'],
      ['Q1FY27 reported', `${Q1.ebitdaCompanyPct}%`, 'Revenue +12%; employee cost 32.5% of sales'],
      ['Operating leverage in H2 as the Bidar block fills', '+0.5 to +1 pt', 'H2 historically ~60% of the year'],
      { hl: true, cells: ['**Our FY27E**', '**{{F.ebitdaMargin.0|pct}}**', 'HDFC Securities FY27E 28.1% (Jan-2026)'] },
      ['Our FY28E / FY29E', '{{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}', 'Utilisation rises from 65%; guide 28-30% incl. forex'],
    ], source: 'Screener.in; Q4FY26 deck p.32; company calls; HDFC Securities; GAM estimates' } },
    { callout: `**Every point of margin** is ~₹${n0(ptEbitda)} cr of Sep-28E EBITDA, worth ~₹${n0(ptPerShare)} a share at our ${MULT.base}x. The bigger swing is revenue timing: with ~45% of sales in people and other fixed costs, a slow quarter like Q1FY25 can take the margin into single digits.` },
  ],
};

const earnings = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: Big Four auditor and clean cash conversion, but FY26 profit had a provision reversal and forex help, and 57% of revenue is booked over time',
  blocks: [
    { p: `Deloitte Haskins & Sells audits Sai (second term FY23-FY28); we found no qualification. Operating cash flow was ₹${n0(A.cfo[b])} cr in FY26 (80% of EBITDA) and ₹${n0(X.cfo6)} cr over FY21-26 against ₹${n0(A.pat.slice(2).reduce((s, x) => s + x, 0))} cr of profit, a healthy ratio helped by depreciation on a capital-heavy base. Six items deserve attention.` },
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'Effect'], wide: [0, 1], rows: C.accounting.map(a => [a.item, a.effect]), source: C.accountingSrc } },
    { exhibit: { type: 'table', title: 'Other income, FY25 and FY26 (₹ crore)', head: ['', 'FY25', 'FY26', 'Recurring?'], rows: [
      ['Interest on deposits', n1(OIN.FY25.depositInterest), n1(OIN.FY26.depositInterest), 'Falls as the IPO cash is spent'],
      ['Forex gains (net)', n1(OIN.FY25.forex), n1(OIN.FY26.forex), 'No: follows the rupee (inside company EBITDA)'],
      ['Interest on tax refund, fund gains, other', n1(OIN.FY25.amortisedCostInterest + OIN.FY25.taxRefundInterest + OIN.FY25.other), n1(OIN.FY26.amortisedCostInterest + OIN.FY26.fvtplGain + OIN.FY26.other), 'Small'],
      { hl: true, cells: ['**Total**', `**${n1(OIN.FY25.total)}**`, `**${n1(OIN.FY26.total)}**`, `${n1(OIN.FY26.total / 474 * 100)}% of FY26 PBT before exceptional items`] },
    ], source: 'AR FY26 consolidated note 28' } },
    { callout: '**Accounting flag: AMBER.** Nothing looks aggressive: a Big Four auditor, small ESOP and exceptional items, and receivables down to 62 days. But FY26\'s profit jump leaned on a ₹34 cr provision reversal and ₹30 cr of forex gains (together ~15% of PBT), government incentives of ₹31 cr sit in revenue, and over-time revenue recognition has built ₹600+ cr of contract and other current assets. We forecast no forex gains and no reversals.' },
  ],
};

const capY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], sumY = key => capY.reduce((s, y) => s + (A[key][ai(y)] || 0), 0);
const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital allocation: capacity first, no dividend, IPO money used to repay debt; returns have only just cleared the cost of capital and will dip as capex doubles',
  blocks: [
    { p: `In FY21-26 Sai generated ₹${n0(sumY('cfo'))} cr of operating cash flow and spent ₹${n0(sumY('capex'))} cr on plant (Screener; company FY26 capex ₹633 cr), funding the gap with debt until the IPO's ₹950 cr repaid ₹720 cr of it. It has paid no dividend since listing and made no acquisitions. Management says new capacity must clear internal hurdle rates "higher than the ROCE, ROE" targets and that it has slowed capex before when demand softened. ROE was 14.0% and ROCE 18.2% in FY26 (company), up from 1% and 6% in FY23. We forecast ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} as capex runs ahead of revenue and interest rises.` },
    { pair: [
      { type: 'line', title: 'Returns: ROE and return on operating capital dip as capex runs ahead', unit: '%', x: 'fin.labels', from: 'FY22', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'Return on operating capital', ref: 'fin.coreRoce', fmt: 'pct' }], labels: 'last', min: 0, max: 25, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Where the cash went in FY21-26', unit: '₹ crore (six years)', x: ['Operating cash flow', 'Capex (plant)', 'IPO fresh issue', 'Debt repaid (net of new)'], series: [{ name: '₹ cr', values: [sumY('cfo'), -sumY('capex'), 950, -(A.borrowings[ai('FY21')] - A.borrowings[b])], fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow and balance sheet; AR FY26 note 49' },
    ] },
    { callout: '**Our view:** capital has gone where the demand is, and the FY26 returns show it can earn. The next three years test that: ₹2,800 cr of capex in FY27-29E is about 1.6x the previous six years combined, funded partly with debt, and the Choutuppal greenfield will not earn until FY29 or later. A modest dividend is unlikely before FY29.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The promoter group (the Kanumuri family, through partnership firms Marigold, Sunflower, Tulip and Lily, Sai Quest Syn and family members) owned ${OW.promoters}% at Jun-2026; no pledge is reported. Domestic institutions own ${OW.diis}% (Invesco MF 7.27% and Nippon India MF 6.16% at Mar-2026), foreign investors ${OW.fiis}% and ~${n0(OW.shareholders)} others ${OW.public}%. The free float is ~65% (~₹21,000 cr at the 30-Sep price), unusually high for an Indian founder-run company, because TPG's stake has passed to institutions.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who sold, and when', head: ['When', 'Seller', 'Stake', 'Value / price'], wide: [1], rows: [['18-Dec-24', 'TPG and other investors (IPO offer for sale)', '3.81 cr shares', '₹2,093 cr at ₹549'], ...OW.blocks.map(x => [X.shortDate(x.date), x.who, x.stake, x.value])], source: 'AR FY26 note 49; Business Standard (20-Jun-2025); PTI (26-Aug-2025)' } },
  { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', '% of shares', 'As of'], rows: OW.named.map(h => [h.holder, `${h.pct}%`, h.asOf]), source: 'AR FY26 note 17; Screener shareholding (Jun-2026)' } },
  { callout: '**Our read:** the private-equity overhang is gone: TPG sold 24.7% in two blocks at ₹722 and ₹871 and institutions took it. The promoters have not sold since listing, but at ~34.5% the family owns less than at most Indian founder-run companies, and the stock is now largely owned by mutual funds and foreign institutions that bought at half today\'s price.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a founder family with a professional CFO, a Big Four auditor and no PE nominee left; CEO pay doubled in the first listed year',
  blocks: [
    { p: `Sai is run by K Krishnam Raju (Krishna Kanumuri), MD & CEO, with Dr K Ranga Raju as Chairman and Siva Chittor as Whole-time Director and CFO (on the board from Apr-2025). The independent directors include Ramesh Ganesh Iyer, Suchita Sharma and Dr Dinesh V Patel; TPG's nominee left in Jun-2024. In FY26 the MD & CEO was paid ₹${MG.people[1].payFY26Cr} cr (+124%, 231 times the median employee), the Chairman ₹${MG.people[0].payFY26Cr} cr and the CFO ₹${MG.people[2].payFY26Cr} cr plus ₹15.8 cr of exercised ESOPs. Two relatives of key managers joined the payroll in Jul-2025. The calls are detailed on strategy and pipeline counts but give no business-level guidance.` },
    { verdicts: [
      ['Founders and succession', 'Moderate', 'Founder family in the chair and CEO roles; professional CFO on the board', 'Continuity high; key-person risk too'],
      ['Board independence', 'Moderate', 'Independent directors with pharma and finance backgrounds; executive chairman', 'Adequate'],
      ['Audit', 'Strong', 'Deloitte Haskins & Sells (Big Four), second term FY23-28; no qualification', 'Better than most mid-cap CDMOs'],
      ['Related parties', 'Strong', 'Small: KMP pay, two relatives employed (₹0.27 cr), director fees', 'Clean'],
      ['Pay', 'Weak', 'MD & CEO pay +124% to ₹13.1 cr (231x the median); KMP pay ₹20.2 cr + ₹16.0 cr ESOP perquisites', 'High for ₹349 cr of profit (~8% of PBT incl. ESOP perquisites)'],
      ['Promoter selling', 'Strong', 'No promoter sale since listing; holding diluted only by ESOPs', 'Aligned'],
      ['Disclosure', 'Moderate', 'Discloses CDMO/CRO revenue, molecule counts, capacity and capex; no customer or molecule names, no business-level guidance', 'Typical of CDMOs'],
      ['Legal and compliance', 'Moderate', 'Environmental PIL at Bidar (preliminary); clean inspection record', 'Watch'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (related-party note, Rule 5 annexure, directors\' report); GAM Research' },
    { callout: '**Overall: GREEN-AMBER.** We see no sign of minority abuse: a Big Four auditor, no pledges, no promoter selling and few related-party dealings. The flag is pay: the CEO\'s pay more than doubled in the first full listed year. None of it changes our valuation.' },
  ],
};

module.exports = { moat, quality, margins, earnings, capital, ownership, governance };
