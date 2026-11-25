// Granules India report, part 4: moat, margins, earnings quality.
const X = require('./GRANULES.ctx');
const { C, D, A, F, SQ, n0, n1, ai } = X;
const ACC = C.accounting, F26 = C.fy26;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat in US controlled substances; the rest is a well-run cost business without pricing power',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard', head: ['Source of advantage', 'Score', 'Evidence', 'Verdict'], wide: [2, 3], rows: D.moat.map(m => [m.item, m.score, m.evidence, m.verdict]), source: 'Company decks and calls; webinar 29-Sep-2026; GAM Research' } },
    { callout: `**Honest verdict:** ${D.moatVerdict} The controlled-substance franchise is hard to copy (DEA quota, US-made API and tablets, a record of supplying without shortages), and it is why the gross margin rose 15 points. But it rests on one US plant and a handful of molecules, and generic ADHD products still see price erosion as competitors catch up. The legacy molecules give scale, not pricing power, and the peptide business has no advantage yet.` },
  ],
};

const M = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const pctOf = k => M.map(y => Math.round(A[k][ai(y)] * 10) / 10);
const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Margins', title: 'Margins: a record 65-66% gross margin, but EBITDA stuck at 22-23% because tablets, R&D and the FDA problem cost more; FY27 gets ~2 points back from Senn and lower remediation',
  blocks: [
    { p: `Raw materials fell from 50% of sales in FY22 to 35% in FY26 as Granules sold more tablets and fewer bulk chemicals, and more complex tablets. Almost all of that was absorbed lower down: staff costs rose from 10.7% to 16.6% of sales (tablet plants, a larger US operation, Senn), other expenses from 20.0% to 26.3% (plant overheads, freight, consultants) and R&D to 5.3% (6.0% in Q1FY27). The FY26 EBITDA margin of 22.1% also carries Senn's ₹${F26.ascelisEbitdaLoss} cr loss (0.8 point) and ~₹60 cr of remediation (1.1 points). Management guides 22-23% for now; R&D at 5.5-6% of sales; raw-material, packing and freight inflation from West Asia that Q1 escaped thanks to US inventory.` },
    { pair: [
      { type: 'line', title: 'Cost structure: materials down 15 points, staff and overheads up 12', unit: '% of revenue', x: M, series: [{ name: 'Materials', values: M.map(y => Math.round(A.materialPct[ai(y)] * 10) / 10), fmt: 'pct' }, { name: 'Staff', values: M.map(y => Math.round(A.employeePct[ai(y)] * 10) / 10), fmt: 'pct' }, { name: 'Other expenses', values: M.map(y => Math.round(A.otherCostPct[ai(y)] * 10) / 10), fmt: 'pct' }, { name: 'EBITDA', values: pctOf('ebitdaMargin'), fmt: 'pct' }], labels: 'last', min: 0, max: 55, source: 'Screener.in cost schedules' },
      { type: 'line', title: 'Quarterly gross and EBITDA margin', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'Gross margin', values: SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 75, source: 'Company decks; Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'FY26 → FY27E EBITDA margin bridge (our estimate, % of sales)', head: ['Item', 'Points', 'Basis'], wide: [2], rows: [
      ['FY26 EBITDA margin (Screener basis)', n1(A.ebitdaMargin[ai('FY26')]), 'Reported'],
      ['Senn from a ₹44.5 cr loss to a small profit', '+0.9', 'PAT-positive target for FY27 (company)'],
      ['Remediation from ~₹60 cr to <USD1 mn a quarter', '+0.4 to +0.8', 'CFO, Apr and Jul-2026'],
      ['R&D from 5.3% to ~5.8% of sales', '−0.5', 'Guidance 5.5-6%'],
      ['Raw-material, packing and freight inflation not yet passed on', '−0.5 to −1.0', 'CMD/CFO: price increases with a lag'],
      ['Mix: complex generics, GLS absorption', '+0.3 to +0.5', 'Q1FY27 complex share 50%'],
      { hl: true, cells: ['**FY27E EBITDA margin**', `**${n1(F.ebitdaMargin[0])}**`, `FY28E ${n1(F.ebitdaMargin[1])}%, FY29E ${n1(F.ebitdaMargin[2])}%`] },
    ], source: 'GAM Research from company commentary' } },
  ],
};

const earnings = {
  id: 'earnings', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit and few one-offs, but large US chargeback estimates, heavy inventory and cash conversion of only two-thirds of EBITDA',
  blocks: [
    { exhibit: { type: 'table', title: 'Accounting checks', head: ['Check', 'Finding', 'Flag'], wide: [1], rows: [
      ['Auditor', 'S.R. Batliboi & Associates (EY network); unmodified opinion', 'GREEN'],
      ['Exceptional items', `FY25 +₹30.8 cr (insurance claim for the cyber incident); FY26 −₹10.0 cr (Senn deal costs, GPI litigation settlements, less a ₹26.3 cr gain on the US Pharma Ltd stake): 2-4% of profit`, 'GREEN'],
      ['Revenue deductions', ACC[0], 'AMBER'],
      ['Working capital', ACC[1], 'AMBER'],
      ['Other comprehensive income', ACC[2], 'GREEN'],
      ['EPS basis', ACC[3], 'GREEN'],
      ['Related parties / subsidiaries', 'All subsidiaries 100% owned (no minorities); CMD commission ₹26.0 cr in FY26', 'AMBER'],
    ], source: 'AR FY26 (P&L, notes 15, 16, 23, 31, statement of changes in equity); Screener.in' } },
    { pair: [
      { type: 'column', title: 'Operating cash flow (after tax) was 46-91% of EBITDA', unit: 'CFO ÷ EBITDA (%)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'CFO / EBITDA', values: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(A.cfo[ai(y)] / A.ebitda[ai(y)] * 100)), fmt: 'pct0' }], labels: 'all', source: 'Screener.in' },
      { type: 'column', title: 'Inventory: ₹782 cr (FY21) to ₹1,673 cr (FY26)', unit: 'Inventories (₹ crore)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Inventory', values: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(A.inventories[ai(y)])), fmt: 'num' }], labels: 'all', source: 'Screener.in' },
    ] },
    { callout: '**Verdict: AMBER.** Nothing suggests aggressive accounting, and one-offs are small. The watch points are structural to US generics: almost half of gross invoiced revenue is given back as chargebacks, rebates and returns (an estimate that can be revised), and Granules holds a lot of inventory, partly to protect supply (finished-goods inventory rose from ₹708 cr to ₹977 cr in FY26). Cash conversion was 67% of EBITDA in FY26 and recovered in Q1FY27 (₹387 cr) as US receivables fell.' },
  ],
};

module.exports = { moat, margins, earnings };
