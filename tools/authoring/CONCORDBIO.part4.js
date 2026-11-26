// Concord Biotech report, part 4: moat scorecard, margins and earnings quality (capital, ownership, governance in part4b).
const X = require('./CONCORDBIO.ctx2');
const { D, A, F, n0, n1, ai, b, OIN, FY26, Q1, epsRep, exPs, PFE, PEX } = X;
const P4b = require('./CONCORDBIO.part4b');
const yrs = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Moat scorecard: strong in fermentation scale and regulatory record, weak in product breadth and the new formulation businesses',
  blocks: [
    { verdicts: D.moat.map(m => [m.factor, m.score, m.why, m.score]), head: ['Factor', 'Score', 'Evidence', 'Verdict'], title: 'Competitive advantage scorecard', source: 'Company decks; AR FY26; ICRA; calls; GAM Research' },
    { callout: '**Honest verdict: a narrow but real moat.** Few companies can make these molecules at this scale and pass USFDA, EU and Japanese inspections, and 74-79% gross margins prove it. But the moat protects old molecules, not growth: Concord must keep cutting prices to win share and launching niche products to replace erosion, and the businesses it is adding (formulations, injectables, US marketing) have no moat of their own beyond owning the API.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Margins', title: 'Margins: gross margin stable at ~77%; EBITDA margin down from 42% to 35% because ~₹48 cr of new-business costs arrived with lower revenue',
  blocks: [
    { pair: [
      { type: 'line', title: 'Gross margin held; EBITDA margin fell in FY26', unit: '% of revenue', x: yrs, series: [{ name: 'Gross margin (Screener: 100 − material cost %)', values: yrs.map(y => Math.round((100 - A.materialPct[ai(y)]) * 10) / 10), fmt: 'pct' }, { name: 'EBITDA margin', values: yrs.map(y => Math.round(A.ebitdaMargin[ai(y)] * 10) / 10), fmt: 'pct' }], labels: 'last', min: 0, max: 100, source: 'Screener.in' },
      { type: 'column', title: 'Employee cost: 12% of revenue (FY24-25) to 17% (FY26)', unit: '% of revenue', x: yrs, series: [{ name: 'Employees', values: yrs.map(y => Math.round(A.employeePct[ai(y)] * 10) / 10), fmt: 'pct' }, { name: 'Other costs', values: yrs.map(y => Math.round(A.otherCostPct[ai(y)] * 10) / 10), fmt: 'pct' }], labels: 'all', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'FY25 → FY26 EBITDA bridge (₹ crore, company basis)', head: ['', '₹ crore', 'Note'], wide: [2], rows: [
      ['FY25 EBITDA', '506.3', '42.2% margin'],
      ['Lower revenue at FY25 gross margin', `${n1(-(1200.1 - 1054.9) * 0.745)}`, '−₹145 cr of revenue × 74.5%'],
      ['Higher gross margin (74.5% → 76.7%)', `+${n1(1054.9 * (0.767 - 0.745))}`, 'Mix; lower raw-material cost'],
      ['Employee cost', `${n1(-(176.9 - 138.9))}`, 'Injectable plant, Stellon and US hires; +27%'],
      ['Other expenses', `${n1(-(264.9 - 249.3))}`, 'Power, plant running costs'],
      { hl: true, cells: ['**FY26 EBITDA**', '**367.4**', '**34.8% margin; ~38.8% before injectables and Stellon (company)**'] },
    ], source: 'Q4FY26 deck p.11 (P&L); GAM arithmetic' } },
    { p: `**What comes back, and what does not.** Management says all costs of the two new units are "fully booked" in FY26, so every rupee of their revenue lifts margins; solar power from the Clean Max associate should add 1-1.5 points; and FY28 should approach 40%. Against that: Q1FY27's EBITDA margin was ${Q1.ebitdaMarginPct}% (37% ex-new units) despite 26% growth, fuel costs rose, wallet-share gains came with lower prices, and gross margin is guided "in line with historical". We assume {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} for FY27-29E: a recovery, but short of both FY25's 42% and management's 40%.` },
    { callout: `**Sensitivity:** each point of FY28-29E EBITDA margin is ~₹${n1(X.sep(F.sales) / 100 * (1 - X.AS.taxRate[1] / 100) / X.SHARES)} of Sep-28E EPS, ~₹${n0(X.sep(F.sales) / 100 * (1 - X.AS.taxRate[1] / 100) / X.SHARES * X.MULT.base)} a share at our ${X.MULT.base}x.` },
  ],
};

const earnings = {
  id: 'earnings', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts and cash-backed profits; watch inventory, forex in other income and an OCI-only investment gain',
  blocks: [
    { exhibit: { type: 'table', title: 'Profit and cash, FY21-FY26 (₹ crore)', head: ['', ...yrs], rows: [
      ['Net profit (attributable)', ...yrs.map(y => n0(A.pat[ai(y)]))],
      ['Cash from operations', ...yrs.map(y => n0(A.cfo[ai(y)]))],
      ['CFO ÷ profit', ...yrs.map(y => `${Math.round(A.cfo[ai(y)] / A.pat[ai(y)] * 100)}%`)],
      ['Capex', ...yrs.map(y => n0(A.capex[ai(y)]))],
      ['Other income ÷ profit before tax', ...yrs.map(y => `${Math.round(A.otherIncome[ai(y)] / A.pbt[ai(y)] * 100)}%`)],
    ], source: 'Screener.in (consolidated)' } },
    { bullets: [
      `**Cash conversion is good.** Operating cash flow was ₹${n0(A.cfo[b])} cr in FY26, ${Math.round(A.cfo[b] / A.pat[b] * 100)}% of profit, and ~${Math.round(A.cfo.slice(-6).reduce((s, x) => s + x, 0) / A.pat.slice(-6).reduce((s, x) => s + x, 0) * 100)}% over FY21-26, despite rising working capital.`,
      `**Other income is ${Math.round(A.otherIncome[b] / A.pbt[b] * 100)}% of FY26 pre-tax profit**: treasury gains ₹${n1(X.tr26)} cr, forex ₹${n1(OIN.FY26.forex)} cr (₹${n1(OIN.FY25.forex)} cr in FY25), Gujarat incentives ₹${n1(OIN.FY26.subsidy)} cr. We forecast no forex gains. Screener treats ₹${n1(PFE[2026] - PEX[2026])} cr after tax of FY26 profit as "exceptional" (EPS ₹${n1(exPs(2026))}); the company's only exceptional item is the ₹3.3 cr labour-code charge.`,
      `**The Palvella gain bypasses profit.** Concord's shares in Palvella Therapeutics rose from ₹17.3 cr to ₹84.1 cr in FY26; the gain went to other comprehensive income (FY26 OCI ₹55.2 cr), so it does not flatter EPS, but it is also volatile and unhedged.`,
      '**Inventory needs watching.** Inventory rose 36% to ₹326 cr while revenue fell 12%; management says it is API stock for staggered orders, not formulations, and sees "very low" write-off risk. Work in progress (₹194 cr) is the bulk of it (AR FY26 note 27).',
      `**Minority and EPS basis.** Stellon's loss is shared with a 25% partner; we use profit attributable to owners (₹${n1(FY26.patOwners)} cr, ₹${epsRep[2026]} a share). The AR's EPS of ₹${FY26.epsAr} divides total profit by shares.`,
      '**Auditor and segments.** B S R & Co. LLP (KPMG network), unqualified; one reported segment, so API and formulation margins are not disclosed.',
    ] },
    { callout: '**Accounting flag: GREEN.** Simple accounts, real cash; intangible assets under development are only ₹1.2 cr, so R&D is expensed. The judgement calls are working capital and how much of other income is market gains.' },
  ],
};

module.exports = { moat, margins, earnings, capital: P4b.capital, ownership: P4b.ownership, governance: P4b.governance };
