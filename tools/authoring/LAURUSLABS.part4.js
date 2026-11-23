// Laurus Labs report, part 4: moat scorecard, quality and USFDA record, margins through the cycle, earnings quality,
// capital allocation and returns, ownership, management and governance.
const X = require('./LAURUSLABS.ctx');
const { C, D, A, F, AS, n0, n1, pc, b, ai, price, sep, SQ, Q1, FY26, OIN, divYield } = X;
const MG = C.management, PAY = MG.payFY26, OW = D.ownership, RG = C.regulatory;
const VMAP = { Strong: 'Strong', Moderate: 'Moderate', Weak: 'Weak', Unproven: 'Moderate' };
const ptEbitda = sep(F.sales) / 100, ptEps = ptEbitda * (1 - AS.taxRate[1] / 100) / X.sh;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real cost and scale moat in ARVs, a credible but young one in CDMO, and no pricing power',
  blocks: [
    { p: 'A moat is a lasting advantage that lets a company earn more than its cost of capital for longer than rivals. Laurus has one in ARVs, where scale and backward integration make it the lowest-cost supplier for a third of the world\'s HIV patients, and a younger one in CDMO, built on chemistry, fungible large-scale capacity and a clean regulatory record. Neither gives pricing power: ARV tenders and generic APIs are won on price, and CDMO customers can and do dual-source. Returns show it: ROE ranged from 4% to 45% in five years, and core return on capital was below the cost of capital in FY24-25.' },
    { verdicts: D.moat.map(m => [m.factor, VMAP[m.score] || 'Moderate', m.evidence, m.score]), head: ['Factor', 'Score', 'Evidence', 'Detail'], title: 'Moat scorecard: three strong, two moderate, one weak, one unproven', source: 'Company calls, presentations and AR FY26; CARE; GAM Research' },
    { callout: "**Verdict:** a genuine but narrow moat. Process chemistry, scale and regulatory reliability are hard to copy and explain why innovators keep adding projects; switching costs last only for the life of each molecule; ARVs and generic APIs have no pricing power; the new modalities are capabilities, not yet advantages. Divi's, Sai Life, Neuland, Syngene, Piramal Pharma and Chinese CDMOs compete for the same work. We would pay for the franchise, but not for a moat it has not yet proved through a cycle." },
  ],
};

const quality = {
  id: 'quality', nav: 'Quality & USFDA', kicker: 'Regulatory', title: 'Quality and USFDA status: a clean record across 21 USFDA inspections, no active warning letter or import alert, and no recalls in five years',
  blocks: [
    { p: `For a contract manufacturer the regulatory record is the licence to operate: innovators will not file a supplier that might draw a warning letter. Laurus's record is strong. Since inception its sites have had 21 USFDA inspections and 115 inspections by all regulators (WHO-Geneva, ANVISA, PMDA, European agencies), with establishment inspection reports (EIRs, the USFDA's closing document) at all key sites; CARE found no active USFDA warning letter or import alert at company-owned facilities as of June 2026. It reports zero product recalls in the last five years, 132 customer and regulatory audits in FY26 and 24 in Q1FY27 without critical findings. Seven of its fifteen sites are USFDA-approved. The one serious incident in our review was a December 2022 fire at a Vizag unit, after which process safety was upgraded; there were no reportable incidents in FY25-26 (CARE).` },
    { exhibit: { type: 'table', title: 'Last USFDA inspection by site (to Jun-2026)', head: ['Site', 'Last USFDA inspection', 'EIR', 'USFDA inspections since inception'], rows: RG.lastUsfda.map(([s, y, n]) => [s, y, 'Received', String(n)]), source: 'Q1FY27 presentation p.18; AR FY26 p.36-37' } },
    { callout: '**Our view:** quality is the strongest part of the Laurus case and a real reason customers award it commercial products. The risk is scale: capex will add several new blocks and sites in FY27-29, and every new facility must pass its first inspections. Unit 6 was last inspected by the USFDA in 2018 and Unit 5 in 2022, so routine re-inspections are due.' },
  ],
};

const gmY = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins through the cycle: 15% at the trough, 32% at the peak and in Q1FY27; we model 30-31%, in line with management',
  blocks: [
    { p: `Laurus's EBITDA margin (before other income) was 20% in FY20, 32% in the FY21 boom, 26-29% in FY22-23, 15.5% in the FY24 trough and 26.2% in FY26; Q1FY27 reached 31.5%. Two things drive it. **Gross margin** (revenue less materials) moved from ~52% (FY24) to 60.4% (FY26) and 62.7% (Q1FY27) on a richer CDMO mix, softer raw-material prices and process improvements (CFO, 30-Apr-2026). **Operating leverage**: employee and other costs are largely fixed, so they fell from 36% of revenue in FY24 to ~31% in Q1FY27 as revenue grew; the CEO says commercial CDMO supply earns more than development work at a similar gross margin because fewer scientists are needed. Against that, R&D rose to 5.8% of revenue in Q1FY27 (gene therapy and ADC build-out), solvent costs rose with the West Asia war, and each new plant adds people and overheads before it earns.` },
    { pair: [
      { type: 'line', title: 'Annual margins: a full cycle in six years', unit: '% of revenue', x: [...gmY, 'Q1FY27'], series: [{ name: 'Gross margin', values: [...gmY.map(y => A.grossMargin[ai(y)] != null ? Math.round(A.grossMargin[ai(y)] * 10) / 10 : null), Q1.grossMarginPct], fmt: 'pct' }, { name: 'EBITDA margin', values: [...gmY.map(y => Math.round(A.ebitdaMargin[ai(y)] * 10) / 10), Q1.ebitdaScreenerPct], fmt: 'pct' }], labels: 'all', min: 0, max: 70, source: 'Screener.in (gross margin = 100 − material cost %; EBITDA before other income)' },
      { type: 'column', title: 'Cost lines, % of revenue: materials and overheads fell, people did not', unit: '% of revenue', x: ['FY22', 'FY24', 'FY26', 'Q1FY27'], series: [{ name: 'Materials', values: [44.5, 48.3, 39.6, 37.3], fmt: 'pct' }, { name: 'Employees', values: [10.2, 12.7, 13.1, 12.8], fmt: 'pct' }, { name: 'Other costs', values: [16.6, 23.6, 21.1, 18.4], fmt: 'pct' }], labels: 'all', source: 'Screener.in expense schedules' },
    ] },
    { exhibit: { type: 'table', title: 'From FY26 to our FY27E margin', head: ['Step', 'EBITDA margin', 'Why'], wide: [2], rows: [
      ['FY26 reported (Screener basis)', `${n1(A.ebitdaMargin[b])}%`, 'Gross margin 60.4%; company basis 26.8% incl. other income'],
      ['Q1FY27 reported', `${Q1.ebitdaScreenerPct}%`, 'CDMO 41% of revenue; gross margin 62.7%'],
      ['Our Q2-Q4 FY27E', '~29.5%', 'CDMO ~₹720 cr a quarter, higher R&D, new-plant costs, solvent pressure'],
      { hl: true, cells: ['**Our FY27E**', '**{{F.ebitdaMargin.0|pct}}**', 'Management: ">30% from FY27+" (company basis, ~0.3pt higher); street 27.7-32.0%'] },
      ['Our FY28E / FY29E', '{{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}', 'More commercial CDMO; Unit 7 and fermentation absorb costs first'],
    ], source: 'Screener.in; company presentations and calls; broker notes; GAM estimates' } },
    { callout: `**Every point of margin** is ~₹${n0(ptEbitda)} cr of Sep-28E EBITDA, ~₹${n1(ptEps)} of EPS and ~₹${n0(ptEps * X.peMult)} a share at our ${X.peMult}x. Margin matters, but less than the multiple: the price implies ~${n1(X.impliedPeAtPrice)}x our Sep-28E EPS.` },
  ],
};

const cfoY = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const earnings = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audits and conservative tax, but definitions, one-offs, customer advances and capitalised R&D need watching',
  blocks: [
    { p: `Deloitte Haskins & Sells audits Laurus. We found no qualification. Cash conversion has improved (operating cash flow ${Math.round(A.cfo[b] / A.ebitda[b] * 100)}% of EBITDA in FY26 vs 47-85% in FY19-25) but was flattered by customer advances. Five items deserve attention.` },
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'What it is', 'Why it matters'], wide: [1, 2], rows: [
      ['EBITDA definitions', C.accounting[0].item, 'Company margins look ~0.3-0.7pt better than Screener\'s; FY25 company EBITDA included a land gain'],
      ['FY25 one-off', C.accounting[1].item, 'FY25 EPS was ₹6.64 reported, ~₹5.9 before it; we use EPS before exceptional items for the valuation history'],
      ['Customer advances', C.accounting[2].item, 'Advances fund capacity and lift cash flow; they can reverse if projects slip'],
      ['Doubtful debts', C.accounting[3].item, 'Rising provisions on a rising receivable book (₹2,155 cr, ~115 days)'],
      ['Capitalised R&D', C.accounting[4].item, 'Some advanced-biologics spend sits in capex, flattering EBITDA slightly'],
    ], source: 'AR FY26 (consolidated statements, notes 17, 18, 22); Q4FY26 presentation; Q1FY27 presentation and calls' } },
    { pair: [
      { type: 'column', title: 'Operating cash flow ÷ EBITDA: better in FY26, helped by advances', unit: '%', x: cfoY, series: [{ name: 'CFO / EBITDA', values: cfoY.map(y => Math.round(A.cfo[ai(y)] / A.ebitda[ai(y)] * 100)), fmt: 'pct0' }], labels: 'all', source: 'Screener.in' },
      { type: 'column', title: 'Other income: FY25 land gain, FY26 forex gains', unit: '₹ crore', x: ['FY25', 'FY26'], series: [{ name: 'Forex', values: [OIN.FY25.forex, OIN.FY26.forex], fmt: 'num' }, { name: 'Interest', values: [OIN.FY25.interest, OIN.FY26.interest], fmt: 'num' }, { name: 'Land/PPE gain', values: [OIN.FY25.ppeGain, OIN.FY26.ppeGain], fmt: 'num' }, { name: 'Misc. and write-backs', values: [OIN.FY25.misc + OIN.FY25.writeBacks, OIN.FY26.misc + OIN.FY26.writeBacks], fmt: 'num' }], labels: 'all', source: 'AR FY26 notes 18 and 23A' },
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing suggests aggressive accounting, and the tax rate (~25%) is ordinary. But reported profit carries items that will not repeat in the same way (the FY25 land sale, FY26 forex gains of ₹31 cr), customer advances flatter cash flow, and part of the R&D build-out is capitalised. We forecast no forex gains beyond Q1FY27 and no land sales.' },
  ],
};

const fcf5 = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], sum = k => fcf5.reduce((s, y) => s + (A[k][ai(y)] || 0), 0);
const intPaid = 85 + 140 + 174 + 209 + 171, invGrp = 28 + 22 + 80 + 105 + 49, netBorr = (438 - 168) + (468 - 247) + (758 - 217) + (503 - 316) + (273 - 572);
const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital allocation: reinvest almost everything, borrow the rest, pay a token dividend; returns are back above the cost of capital, but only just in core terms',
  blocks: [
    { p: `Laurus has put nearly all its operating cash into plants for five years. In FY22-26 it generated ₹${n0(sum('cfo'))} cr of operating cash flow, spent ₹${n0(sum('capex'))} cr on capex, ₹${n0(intPaid)} cr on interest, ₹${n0(sum('dividendsPaid'))} cr on dividends and ₹${n0(invGrp)} cr on stakes in associates and the JV (ImmunoACT, KRKA, Ethan Energy, Kurnool Renewables), and borrowed a net ₹${n0(netBorr)} cr. It has made one acquisition of note (Richcore, ₹245 cr in FY21) and issues shares only for ESOPs. The dividend is ₹2 a share (12% of FY26 EPS; yield ~${n1(divYield)}%). ROE recovered from 4% (FY24) to 18% (FY26) and return on operating capital (excluding cash) to ~18%. We forecast ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}}: above the ~${n1(X.V.ke)}% cost of capital, below the 45% of FY21.` },
    { pair: [
      { type: 'line', title: 'Returns: back above the cost of capital after FY24-25', unit: '%', x: 'fin.labels', from: 'FY17', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'Return on operating capital (ex cash)', ref: 'fin.coreRoce', fmt: 'pct' }], labels: 'last', min: 0, max: 50, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'Where the cash went in FY22-26', unit: '₹ crore (five years)', x: ['Operating cash flow', 'Capex', 'Interest paid', 'Dividends', 'Stakes in associates/JV', 'Net new borrowing'], series: [{ name: '₹ cr', values: [sum('cfo'), -sum('capex'), -intPaid, -sum('dividendsPaid'), -invGrp, netBorr], fmt: 'num' }], labels: 'all', source: 'Screener.in cash flow schedules' },
    ] },
    { callout: '**Our view:** management\'s willingness to keep investing through the FY24 trough is why Laurus has today\'s CDMO business; the CFO describes reading the Bhagavad Gita through "7 quarters" of poor results. The cost is a balance sheet that carries ~₹2,500-3,200 cr of loans, thin free cash flow and a token dividend. We do not expect buybacks or larger payouts while capex runs at 15-24% of sales.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `Promoters own ${OW.categories.Promoters}% (Jun-2026), mainly Dr. Satyanarayana Chava through NSN Holdings (22.99%, Mar-2026), with Dr. C. V. Lakshmana Rao (2.65%) and CFO V. V. Ravi Kumar's Leven Holdings (1.15%; it sold 0.5 mn shares in FY26). Individual promoters have pledged 4.0 mn shares (2.69% of the promoter holding, ~0.74% of the company), unchanged through Mar-2026. Foreign funds own ${OW.categories.FIIs}% (up from ~25.5% a year earlier) and domestic institutions ${OW.categories.DIIs}%, of which mutual funds 11.22% (Mar-2026). MSCI added Laurus to its India Standard index from 1-Sep-2026, bringing passive buying. ~${n0(OW.shareholders)} shareholders hold the rest.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', '% of shares', 'As of'], rows: OW.named.map(h => [h.holder, `${h.pct}%`, h.asOf]), source: 'AR FY26 note 11 (Mar-2026); SHP Mar-2026; Screener shareholding (Jun-2026)' } },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a founder-led company with a clean regulatory record and moderate pay, but a family-dominated executive bench and thin disclosure',
  blocks: [
    { p: `Dr. Satyanarayana Chava founded Laurus in 2005 and is Executive Director and CEO; on calls he leads on strategy, capex and new modalities. His son Krishna Chaitanya Chava heads CDMO and his daughter Soumya Chava heads generics and commercial (both executive directors); V. V. Ravi Kumar has been CFO since 2006 and Dr. C. V. Lakshmana Rao leads quality and regulatory. All five executive directors are in the promoter group. Five of ten directors are independent and the chairman, Dr. Ravindranath Kancherla (founder of Global Hospitals), is independent; he also sits on the board of ImmunoACT, Laurus's associate. Executive pay was ₹${n1(PAY.executiveTotal)} cr in FY26 (~${n1(PAY.executiveTotal / FY26.pbt * 100)}% of profit before tax), of which the CEO ₹${n1(PAY.ceo)} cr (${PAY.ceoRatioToMedian}x the median employee, +${PAY.ceoPayIncreasePct}% on a higher bonus, vs +${PAY.medianEmployeeIncreasePct}% for employees).` },
    { exhibit: { type: 'table', title: 'Executive pay, FY26 (₹ crore)', head: ['Director', 'Role', 'Salary', 'Bonus', 'Total'], rows: [
      ['Dr. Satyanarayana Chava', 'ED & CEO', '14.46', '10.08', '24.80'], ['Mr. V. V. Ravi Kumar', 'ED & CFO', '4.80', '1.68', '6.60'], ['Dr. C. V. Lakshmana Rao', 'ED (quality)', '3.19', '1.12', '4.56'], ['Mr. Krishna Chaitanya Chava', 'ED, Head CDMO', '1.73', '0.31', '2.20'], ['Mrs. Soumya Chava', 'ED, Generics', '1.11', '0.20', '1.35'],
      { hl: true, cells: ['**Total**', '', '', '', `**${PAY.executiveTotal}**`] },
    ], source: 'AR FY26 corporate governance report and Annexure 4 (totals include small perquisites)' } },
    { verdicts: [
      ['Founder and succession', 'Moderate', 'Founder-CEO with son and daughter as executive directors; no named successor process', 'Continuity is high; so is family control of execution'],
      ['Board independence', 'Moderate', '5 of 10 independent; independent chairman, who also sits on an associate\'s board', 'Adequate, not strong'],
      ['Pay', 'Strong', `₹${n1(PAY.executiveTotal)} cr for five executives, ~${n1(PAY.executiveTotal / FY26.pbt * 100)}% of PBT; CEO +${PAY.ceoPayIncreasePct}% on bonus`, 'Moderate by Indian pharma standards'],
      ['Promoter pledge and selling', 'Moderate', '~0.74% of equity pledged by individual promoters; small promoter-group sales', 'Not a red flag; worth tracking'],
      ['Related parties', 'Strong', 'Land sold to the KRKA JV at fair value (₹90.65 cr); guarantees for subsidiaries; small dealings', 'No sign of tunnelling'],
      ['Quality and compliance', 'Strong', '21 USFDA inspections, no active warning letter, zero recalls in five years; Deloitte as auditor', 'The core of the franchise'],
      ['Disclosure', 'Weak', 'No customers, molecules, pipeline phases or segment margins; constant-currency growth unclear', 'Investors must take the CDMO pipeline on trust'],
      ['Capital allocation', 'Moderate', 'Bold, debt-funded capex through the cycle; many early-stage bets', 'Right so far in CDMO; unproven elsewhere'],
    ], head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; SHP Mar-2026; earnings calls; GAM Research' },
    { callout: "**Our view:** Laurus is well run operationally, pays its executives moderately and has an excellent compliance record. The governance discount, if any, comes from family control of every executive seat, a chairman with a seat at an associate, and disclosure that is thin for a company asking to be valued as a premium CDMO. None of this changes our valuation." },
  ],
};

module.exports = { moat, quality, margins, earnings, capital, ownership, governance };
