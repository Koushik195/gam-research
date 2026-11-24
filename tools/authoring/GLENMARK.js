// Authoring source for the Glenmark initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to owners, see
// GLENMARK.patch.js). Part B (GLENMARK.research.js + part2-6, shared GLENMARK.ctx.js) adds the research chapters, cover,
// rating and statement notes. Forecasts are CORE (no ISB 2001 licensing income). Usage: node tools/authoring/GLENMARK.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'GLENMARK', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research', est: 'Company, GAM Research estimates (FY27-29E core, excl. ISB 2001 income)' };
const SG = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8'));
const SA = SG.annual, SQ = SG.quarterly;
const cr = v => Math.round(v).toLocaleString('en-IN');

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Ten years of volatility: profit peaked in FY17, hit a ₹1,502 cr loss in FY24, and FY26\'s ₹1,362 cr rests on a one-off licensing deal',
  blocks: [
    { p: 'Glenmark\'s reported revenue grew from ₹6,563 cr in FY15 to ₹16,983 cr in FY26, but the headline hides three breaks. First, the API business (Glenmark Life Sciences, ₹1,271 cr of FY22 sales) was sold to Nirma in March 2024, so FY23 onward is restated without it. Second, FY26 includes ₹3,982 cr of income from licensing ISB 2001 to AbbVie: without it FY26 revenue was ₹13,002 cr. Third, India sales collapsed twice when distributors cut stock (Q3FY24 and Q2FY26). Profit has swung even harder: ₹1,109 cr in FY17 (the generic Zetia exclusivity), ₹297 cr in FY23 (a ₹766 cr Zetia antitrust settlement), a ₹1,502 cr loss in FY24, ₹1,047 cr in FY25 and ₹1,362 cr in FY26, which nets the licensing income against ₹2,266 cr of exceptional charges.' },
    { pair: [
      { type: 'column', title: 'Revenue: FY26 inflated by ₹3,982 cr of licensing income; FY27E is lower on paper', unit: 'Revenue from operations (₹ crore); FY27-29E core', x: 'fin.labels', from: 'FY17', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'column', title: 'EPS: a loss in FY24, a licensing-boosted FY26, core growth after', unit: 'EPS, reported (₹); FY27-29E core', x: 'fin.labels', from: 'FY17', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.est },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 10% in FY24; FY26\'s 27% is mostly the licensing income', unit: 'EBITDA margin (%); FY27-29E core', x: 'fin.labels', from: 'FY17', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.est },
      { type: 'stacked', title: 'Where revenue comes from (FY26: licensing income shown separately)', unit: 'Revenue by region (₹ crore); FY22 incl. API; FY23 onward continuing operations', x: SA.map(r => r.fy).concat(['Q1FY27 x4']), series: [{ name: 'India', values: [...SA.map(r => r.india), SQ.at(-1).india * 4], fmt: 'num' }, { name: 'North America (core)', values: [...SA.map(r => r.naCore ?? r.na), SQ.at(-1).naCore * 4], fmt: 'num' }, { name: 'Europe', values: [...SA.map(r => r.europe), SQ.at(-1).europe * 4], fmt: 'num' }, { name: 'Emerging markets', values: [...SA.map(r => r.em), SQ.at(-1).em * 4], fmt: 'num' }, { name: 'API / ISB 2001 income', values: [...SA.map(r => (r.api || 0) + (r.isb || 0)), SQ.at(-1).isb * 4], fmt: 'num' }], minLabel: 900, source: 'Company presentations and AR FY26; Q1FY27 annualised' },
    ] },
    { callout: '**Our view:** strip out the licensing income and the one-offs and Glenmark is a ~₹13,000-16,000 cr business that has earned a 15-19% EBITDA margin in good years, below its large peers. Our core FY27E EPS (₹{{F.eps.0|n1}}) looks lower than FY26\'s reported ₹48.3 only on paper; it is ~8x FY26\'s core ₹7.2. FY28-29E (₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}) assume India 13% growth, US respiratory launches and a margin near 19-20%.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: core EBITDA margin was 16.6% in Q1FY27; the 20% headline includes deferred licensing income',
  blocks: [
    { p: 'Glenmark\'s headline EBITDA margin was 20.0% in Q1FY27 (₹805 cr). But ₹166 cr of that was ISB 2001 income recognised from the upfront AbbVie paid in September 2025: US$17.5mn a quarter until March 2028, with no new cash attached. It roughly matches what IGI spends on research (the CFO says Glenmark gets "a revenue item of $70 million every year and corresponding expenses"). Without it, the core margin was 16.6%, after 19.0% in Q3FY26 and 16.8% in Q4FY26. Management guides 21-22% for FY27 on the reported basis, which is ~17.5-18.5% core. Gross margin held at ~69% despite higher API and freight costs from the West Asia conflict; R&D was ₹249 cr (6.2% of sales; guided 7-8%), about half of it IGI.' },
    { pair: [
      { type: 'line', title: 'Quarterly EBITDA margin: reported vs core (excl. ISB 2001 income)', unit: 'EBITDA margin (%)', x: SQ.filter(q => q.q !== 'Q2FY26').map(q => q.q), series: [{ name: 'Reported', values: SQ.filter(q => q.q !== 'Q2FY26').map(q => Math.round(q.ebitda / q.revenue * 1000) / 10), fmt: 'pct' }, { name: 'Core', values: SQ.filter(q => q.q !== 'Q2FY26').map(q => Math.round((q.ebitdaCore ?? q.ebitda) / (q.revenue - (q.isb || 0)) * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 10, max: 25, source: 'Company releases; Screener; GAM (Q2FY26 left out: licensing upfront)' },
      { type: 'line', title: 'Material cost and staff cost as a share of revenue', unit: '% of revenue (Screener; FY26 denominator includes licensing income)', x: 'A.labels', from: 'FY17', series: [{ name: 'Material cost', ref: 'A.materialPct', fmt: 'pct' }, { name: 'Employee cost', ref: 'A.employeePct', fmt: 'pct' }], labels: 'last', min: 15, max: 45, source: 'Screener.in' },
    ] },
    { pair: [
      { type: 'column', title: 'North America core sales: flat for two years, +20% in Q1FY27', unit: 'North America excl. ISB 2001 income (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'NA core', values: SQ.map(q => q.naCore), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company releases (core growth rates); GAM' },
      { type: 'column', title: 'R&D: ₹225-290 cr a quarter, about half of it IGI', unit: 'R&D spend (₹ crore)', x: SQ.filter(q => q.rdCr).map(q => q.q), series: [{ name: 'R&D', values: SQ.filter(q => q.rdCr).map(q => q.rdCr), fmt: 'num' }], labels: 'all', source: 'Company calls and presentations (Q3FY26: ~50% IGI)' },
    ] },
    { callout: '**Why we model {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} (core):** FY27E equals 21.0% on the reported basis, the bottom of guidance, because Q1 came in at 20.0% and input costs are still rising. FY28E adds management\'s ~1pp from operating leverage, US respiratory products and Monroe injectables. FY29E is the first year without the deferred income, so reported and core margins meet: if no milestone arrives, the reported margin falls from ~22% to ~20% that year. Each 1pp of FY28E margin is ~₹183 cr of EBITDA, ~6% of EPS.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Cash & returns', kicker: 'Capital allocation', title: 'Cash: operating cash flow was negative in FY24 and FY25; FY26 was rescued by the AbbVie upfront',
  blocks: [
    { p: 'Glenmark\'s cash record is its weakest point. Operating cash flow was ₹1,109 cr in FY22, ₹625 cr in FY23, then −₹265 cr in FY24 (₹1,047 cr of taxes paid in the year of the GLS sale) and −₹828 cr in FY25 (₹2,494 cr into working capital). FY26 showed +₹3,445 cr, but that includes the ~₹5,950 cr AbbVie upfront and a ₹879 cr customer advance received in March 2026 for supplies over the next 3.3 years; without them it would again have been negative, as receivables rose ₹1,751 cr when Glenmark stopped taking costly "pre-collections" from distributors. Debt was repaid twice with one-off money: the GLS sale (₹5,651 cr, FY24) and the AbbVie upfront (₹1,300 cr of gross debt repaid in FY26).' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore (FY26 CFO includes the AbbVie upfront)', x: 'fin.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'fin.cfo', fmt: 'num' }, { name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'none', source: SRC.est },
      { type: 'line', title: 'ROE: negative in FY24; FY26 helped by the upfront', unit: 'ROE (%); FY27-29E core', x: 'fin.labels', from: 'FY17', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: -20, max: 25, source: SRC.est },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Three years'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '2,352'],
      ['  of which: ISB 2001 upfront and customer advance (approx.)', '–', '–', '~6,830', '~6,830'],
      ['Capex (fixed assets purchased; excl. most in-licensing)', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '3,007'],
      ['Dividends', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '329'],
      { hl: true, cells: ['**Left over (before interest and asset sales)**', '**(1,281)**', '**(1,649)**', '**1,946**', '**(984)**'] },
      ['Memo: GLS sale proceeds / company net debt at year-end', '5,651 / (668)', '– / 489', '– / (1,176)', ''],
    ], source: 'Screener.in cash flow; AR FY26 five-year scorecard (net debt, negative = net cash); Q2FY26 call (upfront ~₹5,950 cr); AR FY26 note 15 (US$96mn advance)' } },
    { callout: '**The capital question:** the money is now in, and management promises to stay net cash, spend ~₹900 cr a year on capex and in-licensing, and fund IGI\'s ~US$70mn a year from the upfront for three years. Its record with big bets is mixed (Monroe, its US injectables plant, made nothing for sale between the 2021 recall and 2026), and in-licensing deals for Chinese oncology drugs are a new bet. We model no acquisitions, an 8% payout and IGI\'s cost inside our EBITDA.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Balance sheet: "zero gross debt", but ₹1,843 cr of debt-like items; we model net debt of ₹1,219 cr at Mar-26',
  blocks: [
    { p: 'Glenmark met its promise of zero bank debt at March 2026 and reports net cash of ₹1,176 cr. Look closer and the cushion is thin. It owes ₹594 cr of leases, ₹964 cr of litigation settlements and provisions (US antitrust cases, payable over about two years), and it holds a ₹879 cr advance from a customer for supplies over 3.3 years (US$96mn, received in March 2026), which will be "repaid" in product without new cash. Treating those as debt, the opening net position in our model is −₹1,219 cr. A further ₹1,314 cr of ISB 2001 income received in advance is not debt (it will be booked as revenue with no cash), and customer security deposits rose from ₹132 cr to ₹535 cr. Receivables jumped from ₹3,342 cr to ₹4,963 cr in FY26 after pre-collections stopped; the CFO puts net working capital at ~107 days against a 115-120 day ceiling.' },
    { pair: [
      { type: 'column', title: 'Company net debt: repaid twice with one-off money', unit: 'Company net debt (₹ crore; negative = net cash; excl. leases)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Net debt', values: [2260, 3189, -668, 489, -1176], fmt: 'num' }], labels: 'all', source: 'AR FY26 five-year scorecard' },
      { type: 'line', title: 'Working capital: receivables back up after pre-collections stopped', unit: 'Days (Screener)', x: 'A.labels', from: 'FY17', series: [{ name: 'Inventory days', ref: 'A.inventoryDays', fmt: 'num' }, { name: 'Receivable days', ref: 'A.debtorDays', fmt: 'num' }, { name: 'Payable days', ref: 'A.payableDays', fmt: 'num' }], labels: 'last', source: 'Screener.in (inventory and payable days on cost of materials)' },
    ] },
    { exhibit: { type: 'table', title: 'From reported net cash to our model\'s opening net debt (Mar-26, ₹ crore)', head: ['', '₹ crore', 'Source'], rows: [
      ['Cash and bank balances (company net cash; no borrowings)', cr(1176.3), 'AR FY26 balance sheet; five-year scorecard'],
      ['Less: lease liabilities', `(${cr(593.5)})`, 'Notes 14 and 16'],
      ['Less: litigation liabilities and provisions', `(${cr(963.6)})`, 'Notes 14, 16, 18 (settlements payable over ~2 years)'],
      ['Less: customer advance (US$96mn, 3.3-year supply contract)', `(${cr(879.2)})`, 'Note 15'],
      ['Add: non-current investments', cr(42.4), 'Balance sheet'],
      { hl: true, cells: ['**Model opening net cash / (net debt)**', '**(1,218)**', 'Engine: ₹1,176 + 42 − 594 − 1,843 = −1,219 (rounding)'] },
      ['Memo: ISB 2001 income received in advance (non-cash, not debt)', cr(1314.1), 'Notes 15 and 17'],
    ], source: 'AR FY26 notes 14-18; GAM Research' } },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['Cash and investments (Screener)', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      ['Net fixed assets incl. intangibles', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
    ], source: 'Screener.in (consolidated)' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Saldanha family at 46.65%, unchanged and unpledged; domestic funds doubled their stake',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs (mostly mutual funds) from 11% to ~19%; FIIs down to 21%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 46.65%, no pledge', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 40, max: 50, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E (FY27-29E core, excl. ISB 2001 income)', rows: [
      { key: 'sales', name: 'Revenue from operations', flag: { type: 'pct', th: 12 }, hl: true }, { key: 'ebitda', name: 'EBITDA', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation, amortisation & impairment', flag: { type: 'pct', th: 30 } },
      { key: 'otherIncome', name: 'Other income (Screener: net of exceptional items)', flag: { type: 'pct', th: 60 } }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 30 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex', flag: { type: 'pct', th: 60 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (Screener)' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (net of exceptional items)' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (owners)', hl: true, yoy: true, flag: { type: 'pct', th: 30 } },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, margins, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'GLENMARK.research.js')) ? require('./GLENMARK.research') : null;
  const report = {
    symbol: 'GLENMARK', listing: 'NSE: GLENMARK · BSE: 532296', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, margins, capital, balance, ownershipBase, statements }) : [financials, margins, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
}
