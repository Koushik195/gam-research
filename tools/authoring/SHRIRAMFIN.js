// Authoring source for the Shriram Finance initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Lender engine (src/forecast-lender.js). Part A (this file): chapters built on reported financials
// (Screener consolidated, FY25 patched to the audited continuing-operations basis by SHRIRAMFIN.patch.js).
// Part B (SHRIRAMFIN.research.js + part2-6, shared SHRIRAMFIN.ctx.js) adds the research chapters.
// Usage: node tools/authoring/SHRIRAMFIN.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'SHRIRAMFIN', 'research');
const SRC = { co: 'Company results and annual reports (STFC FY22, FY24-FY26), Screener.in (consolidated), GAM Research', est: 'Company, GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Profit up 3.7x since the merger year, but ROE has never been above ~18%, and the MUFG money pushes it down to ~13-14%',
  blocks: [
    { p: 'Before the merger, Shriram Transport Finance (STFC) was a steady, low-growth truck financier: net profit stayed between ₹2,500 cr and ₹2,720 cr from FY18 to FY22, AUM grew 5-9% a year and ROE sank from 20% (FY18) to 11% (FY22) as Covid-era loan losses ran at ~2.8-3.2% of AUM (FY21-FY22). The Dec-2022 merger with Shriram City Union Finance doubled the profit base (₹6,020 cr in FY23) and added small-business, gold, two-wheeler and personal loans. Since then profit has grown ~18% a year to ₹10,024 cr in FY26 (FY25\'s ₹9,576 cr included a ₹1,489 cr after-tax gain on selling Shriram Housing Finance; before it, FY26 grew ~21%). ROE was 16-18% throughout, good for a vehicle lender but well short of Bajaj Finance or Cholamandalam.' },
    { pair: [
      { type: 'column', title: 'Net profit: flat for five years, then the merger and steady growth', unit: 'Consolidated net profit (₹ crore); FY25 includes the SHFL gain', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'ends', source: SRC.est },
      { type: 'line', title: 'ROE: 16-18% after the merger, lower with the new equity', unit: 'Net profit ÷ average equity (%); FY27E averages opening and closing equity (13.2% time-weighted)', x: 'fin.labels', from: 'FY16', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 8, max: 22, source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'NII jumps in FY27E: ₹39,618 cr of equity replaces debt', unit: 'Net interest income (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'NII', ref: 'fin.nii', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'Cost-to-income ~30% until FY26; lower now only because income rose', unit: 'Operating expenses incl. depreciation ÷ net total income (%)', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'Cost-to-income', ref: 'fin.costToIncome', fmt: 'pct' }], labels: 'all', min: 20, max: 34, source: SRC.est },
    ] },
    { callout: '**Our view:** the earnings line is about to look better than the business. FY27E EPS rises {{F.epsGrowth.0|pct}} mostly because ₹39,618 cr of MUFG equity replaced 8.6%-cost debt (worth ~₹2,600 cr of post-tax profit a year), while 25% more shares and 60% more book dilute the returns on that money. We forecast EPS of {{F.eps.0|n2}} / {{F.eps.1|n2}} / {{F.eps.2|n2}} for FY27-29E (~16% a year) and ROE of only ~13-14% until leverage is rebuilt.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet', kicker: 'Balance sheet', title: 'A ₹3.5 lakh crore balance sheet that just swapped ₹18,000 cr of debt for equity',
  blocks: [
    { p: 'At Mar-2026 the group had ₹3.21 lakh cr of assets: ₹2.82 lakh cr of loans, ₹22,900 cr of cash and investments and ₹2,600 cr of fixed and intangible assets (₹1,189 cr of it goodwill from the merger). It was funded by ₹65,919 cr of equity, ₹2.51 lakh cr of borrowings (incl. ₹69,480 cr of public deposits, about the size of Bajaj Finance\'s deposit book) and ₹4,800 cr of other liabilities. Borrowings were 3.8x equity. Three months later, after MUFG\'s ₹39,618 cr arrived on 8-Apr-2026, equity was ₹1.08 lakh cr, borrowings had been cut to ₹2.33 lakh cr and leverage to 2.1x (company measure).' },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-22 (STFC)', 'Mar-24', 'Mar-25', 'Mar-26', 'Mar-27E'], rows: [
      ['AUM (incl. off-book)', '{{fin.aum.7|num}}', '{{fin.aum.9|num}}', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}', '{{F.aum.0|num}}'],
      ['Shareholders\' equity (net worth)', '{{fin.netWorth.7|num}}', '{{fin.netWorth.9|num}}', '{{fin.netWorth.10|num}}', '{{fin.netWorth.11|num}}', '{{F.netWorth.0|num}}'],
      ['Borrowings incl. deposits', '{{fin.borrowings.7|num}}', '{{fin.borrowings.9|num}}', '{{fin.borrowings.10|num}}', '{{fin.borrowings.11|num}}', '{{F.borrowings.0|num}}'],
      ['Cash and investments', '{{fin.liquidity.7|num}}', '{{fin.liquidity.9|num}}', '{{fin.liquidity.10|num}}', '{{fin.liquidity.11|num}}', '{{F.liquidity.0|num}}'],
      ['Total assets', '{{fin.totalAssets.7|num}}', '{{fin.totalAssets.9|num}}', '{{fin.totalAssets.10|num}}', '{{fin.totalAssets.11|num}}', '{{F.totalAssets.0|num}}'],
      ['Borrowings ÷ equity (x)', '{{fin.debtEquity.7|n2}}', '{{fin.debtEquity.9|n2}}', '{{fin.debtEquity.10|n2}}', '{{fin.debtEquity.11|n2}}', '{{F.debtEquity.0|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.7|pct}}', '{{fin.equityToAum.9|pct}}', '{{fin.equityToAum.10|pct}}', '{{fin.equityToAum.11|pct}}', '{{F.equityToAum.0|pct}}'],
    ], source: 'Screener.in (consolidated; Mar-24 includes Shriram Housing Finance), company AUM; GAM estimates for Mar-27E' } },
    { pair: [
      { type: 'stacked', title: 'Equity jumps in FY27E; borrowings pause, then grow again', unit: '₹ \'000 crore at March', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'Borrowings', ref: 'fin.borrowings', scale: 0.001, fmt: 'num' }, { name: 'Net worth', ref: 'fin.netWorth', scale: 0.001, fmt: 'num' }], minLabel: 40, source: SRC.est },
      { type: 'line', title: 'Operating cash flow is negative whenever loans grow', unit: 'Cash from operations (₹ crore)', x: 'A.labels', from: 'FY17', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }], labels: 'last', source: 'Screener.in cash flow (consolidated)' },
    ] },
    { callout: '**Read this right:** for a lender, new loans are an operating outflow, so cash flow from operations is negative in every growth year (−₹43,652 cr in FY25, −₹13,281 cr in FY26). What matters is whether equity keeps up with the loan book. Before MUFG, retained profit grew equity ~13-17% a year (FY24-FY26) against AUM growth of 15-21%, and leverage crept up to ~3.8x. The MUFG money resets that: management plans to take leverage back up to ~4.5x only over five to six years.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Shriram group and MUFG each hold ~20%; foreign funds own over half',
  blocks: [
    { pair: [
      { type: 'line', title: 'Foreign ownership jumps with MUFG\'s 20%', unit: '% of shares (MUFG counted with foreign investors)', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter stake diluted from 25.4% to 20.3% by the new shares', unit: 'Promoter group holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 15, max: 30, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials (lender format)',
  blocks: [
    { p: 'Screener\'s NBFC layout rebuilt into a lender income statement. Revenue = interest income + fees and other operating income; operating expenses include fee and commission expenses and depreciation; provisions = impairment on financial instruments. FY15-FY22 are Shriram Transport Finance; FY23 onward the merged Shriram Finance (FY23 ratios are distorted because FY22 AUM is STFC alone); FY23-FY24 include Shriram Housing Finance; FY25 is on the audited continuing-operations basis (our patch to Screener). The income split before FY21 is not in our sources.' },
    { statement: { title: 'Lender P&L and balance sheet, FY15–FY29E', rows: [
      { key: 'aum', name: 'AUM (year-end)', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'sales', name: 'Total income' },
      { key: 'interest', name: 'Interest expense' },
      { key: 'nii', name: 'Net interest income', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'feeIncome', name: 'Fees & other operating income' },
      { key: 'opex', name: 'Operating expenses (incl. depreciation)' },
      { key: 'ppop', name: 'Pre-provision operating profit' },
      { key: 'provisions', name: 'Impairment (loan losses & provisions)', flag: { type: 'pct', th: 20 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹, split-adjusted)', fmt: 'n2' },
      { key: 'bvps', name: 'Book value per share (₹)', fmt: 'n1' },
      { key: 'netWorth', name: 'Net worth' },
      { key: 'borrowings', name: 'Borrowings incl. deposits' },
      { key: 'nim', name: 'NIM (NII ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 50 } },
      { key: 'creditCost', name: 'Credit cost (provisions ÷ average AUM) %', fmt: 'pct', flag: { type: 'bps', th: 50 }, inverse: true },
      { key: 'roe', name: 'ROE %', fmt: 'pct', flag: { type: 'bps', th: 300 } },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (Screener NBFC layout)', rows: [
      { key: 'sales', name: 'Total income', yoy: true, flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'interest', name: 'Interest expense' },
      { key: 'expenses', name: 'Opex excl. depreciation + provisions', yoy: true, flag: { type: 'pct', th: 25 }, inverse: true },
      { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit', hl: true, yoy: true, flag: { type: 'pct', th: 25 } },
      { key: 'eps', name: 'EPS (₹)', fmt: 'n2' },
    ] } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'SHRIRAMFIN.research.js')) ? require('./SHRIRAMFIN.research') : null;
  const report = {
    symbol: 'SHRIRAMFIN', listing: 'NSE: SHRIRAMFIN · BSE: 511218', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Financials (NBFCs)',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
