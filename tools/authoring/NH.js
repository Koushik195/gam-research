// Authoring source for the Narayana Hrudayalaya initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated, post-Ind AS 116). Part B
// (NH.research.js + part2-6, shared NH.ctx.js) adds the research chapters.
// Shares: Screener's FY26 Net Profit ÷ EPS = 20.45 cr = the 20.44 cr shares outstanding, so no patch file is needed.
// Usage: node tools/authoring/NH.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'NH', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SGQ = JSON.parse(fs.readFileSync(path.join(RD, 'segments.json'), 'utf8')).quarterly;
const grpMargin = SGQ.map(q => Math.round(q.consEbitda / q.consRev * 1000) / 10);
const SRC = { co: 'Company filings, Screener.in (consolidated, post-Ind AS 116), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue tripled since FY20, but the jump in FY26 was bought: the UK added 16% of revenue at a 10% margin',
  blocks: [
    { p: 'Narayana\'s revenue grew from ₹3,128 cr in FY20 to ₹7,896 cr in FY26 (17% a year). Strip out the two step-changes and the organic story is steadier: FY21 fell 17% in the Covid lockdowns; FY22-25 grew 43%, 22%, 8% and 12% as India recovered and the Cayman Islands business doubled; FY26 grew 44% because the UK\'s Practice Plus Group (PPG) was consolidated from 6-Nov-2025 (₹1,299 cr in five months) and Cayman grew 60% in rupees (new Camana Bay hospital plus its own insurer). Without the UK, revenue grew ~20%. Profit tells a less flattering story: net profit was ₹790 cr in FY24, ₹791 cr in FY25 and ₹806 cr in FY26, flat for three years, because interest, depreciation and the losses of new businesses (clinics, two insurers) absorbed the EBITDA growth.' },
    { pair: [
      { type: 'column', title: 'Revenue: 17% a year since FY20, with an acquisition in FY26', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit: flat at ~₹800 cr for three years', unit: 'Net profit attributable to shareholders (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 24% peak in FY24-25, 21% after the UK', unit: 'EBITDA margin, post-Ind AS 116, excl. other income (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: SRC.co },
      { type: 'hbar', title: 'Staff and doctors are half of costs; consumables a fifth', unit: 'FY26 costs and EBITDA, % of revenue (company; one-time PPG cost excluded)', x: ['Employees (excl. doctors)', 'Consumables', 'Other expenses', 'Doctors (professional fees)', 'EBITDA (excl. other income)'], series: [{ name: 'Share', values: [22.8, 19.2, 22.6, 13.9, 21.4], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA (excl. other income)', source: 'Q4FY26 presentation p. 21; AR FY26' },
    ] },
    { callout: '**Our view:** the India hospitals are a high-quality, price-led business (EBITDA +23% in FY26 with no new beds). The group numbers are now a blend of four businesses with very different economics: India (~23% margin), Cayman (~44%), the UK (~9%) and two loss-making insurers. Group margin and ROCE will look worse than India alone for years, and the FY27 growth rate (+42% on our numbers) is mostly the full-year UK, not organic momentum.' },
  ],
};

const seasons = {
  id: 'seasons', nav: 'Quarterly pattern', kicker: 'Quarterly trend', title: 'Quarterly: India margins rising for five quarters, group margin falling as the UK and insurers dilute it',
  blocks: [
    { p: 'The quarterly numbers since Q3FY26 include the UK, so group revenue jumped from ₹1,644 cr (Q2FY26) to ₹2,684 cr (Q1FY27). Underneath, the India hospital margin (company basis) rose from 20.6% in Q1FY26 to 25.1% in Q4FY26 and 24.8% in Q1FY27. Group EBITDA margin fell from 24% to 17.5% over the same period, because the UK earns 9-10%, Cayman insurance lost US$3.7-5.1 mn a quarter and India clinics plus insurance lost ₹33 cr in Q1FY27 alone. Q1 is seasonally soft for Cayman (US holidays) and was hit by a UK heatwave.' },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: the UK doubled the run-rate from Q3FY26', unit: 'Revenue (₹ crore)', x: 'Q.labels', series: [{ name: 'Revenue', ref: 'Q.sales', fmt: 'num' }], labels: 'all', source: SRC.co },
      { type: 'line', title: 'India hospital margin up, group margin down', unit: 'EBITDA margin (%): India hospitals (company basis) and group (Screener, excl. other income)', x: 'R.segments.quarterly[].q', series: [{ name: 'India hospitals', ref: 'R.segments.quarterly[].indHospMarginCo', fmt: 'pct' }, { name: 'Group', values: grpMargin, fmt: 'pct' }], labels: 'last', min: 10, max: 30, source: 'Company presentations; Screener.in' },
    ] },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'From no new beds to ₹3,000 cr of new hospitals and a UK buyout: returns fall before they can rise',
  blocks: [
    { p: 'For a decade Narayana grew without adding beds in India; management says it is "the only listed group that has not added a single bed from the time of listing". Its spending went to Cayman (Camana Bay), refurbishment and technology. That has changed. In FY26 it bought the UK\'s Practice Plus Group for ₹2,201 cr (£188.8 mn), financed with a £150 mn seven-year loan housed in the UK business, and it has committed ~₹3,000 cr to six India projects (2,035 beds) to be completed in FY27-FY30. ROCE (Screener) fell from 32% (FY23) to 16% (FY26); management itself says it is "diluting ROCE for growth".' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore (FY26 capex excludes the ₹2,155 cr UK acquisition)', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 32% in FY23, 16% in FY26', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 35, source: 'Screener.in (capital includes lease liabilities and acquisition goodwill)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26', 'Two years'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}', '2,607'],
      ['Capex (Screener)', '{{A.capex.10|num}}', '{{A.capex.11|num}}', '1,957'],
      ['UK acquisition, net of ₹46 cr cash acquired (AR note 46)', '0', '2,155', '2,155'],
      ['Lease payments (AR note 18)', '53', '128', '181'],
      ['Dividends', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}', '172'],
      { hl: true, cells: ['**Funding gap**', '**−230**', '**−1,628**', '**−1,858**'] },
      ['Memo: borrowings, year end (excl. leases)', '2,213', '4,866', '+2,653'],
    ], source: 'Screener.in cash flow; AR FY26 notes 17, 18, 46. Interest paid and treasury income are not in the gap; borrowings include US$ and GBP loans revalued at year-end rates.' } },
    { callout: '**The capital question:** the six India projects cost ₹1.8-2.6 cr per owned bed against ~₹0.75 cr for the beds Narayana runs today (management: construction costs are 60% higher than five years ago). On our numbers operating cash (~₹1,700-2,100 cr a year) covers capex of ₹950-1,350 cr, so net debt falls even as the programme runs, but each new bed must earn about three times the profit of an old one to keep returns where they are. The UK was bought at 9.2x pre-IFRS EBITDA with a 20-22% ROCE target "by FY29-30".' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & debt', kicker: 'Balance sheet', title: 'Net debt of ₹2,000-2,200 cr ex-leases, about 1x forward EBITDA: comfortable, but much of the debt is in pounds and dollars',
  blocks: [
    { p: 'Borrowings were ₹4,866 cr at Mar-2026 (₹2,213 cr a year earlier): ₹1,893 cr in India (bank loans and ₹800 cr of NCDs) and US$368 mn at Health City Cayman Islands and its UK subsidiary, including the £150 mn PPG acquisition loan. Against this the group held ₹2,129 cr of cash and bank balances and ₹573 cr of investments. The company reports net debt (excluding leases) of ₹2,240 cr at Mar-26 and ₹1,967 cr at Jun-26 (0.42x equity). Under Ind AS 116 it also carries ₹991 cr of lease liabilities (₹708 cr came with PPG), which Screener includes in borrowings. Our model uses that broader basis (post-Ind AS EBITDA with leases as debt): net debt ₹{{A.netDebt.11|num}} cr at Mar-26. ICRA rates the company AA (Stable).' },
    { pair: [
      { type: 'column', title: 'Borrowings incl. leases jumped with the UK deal', unit: 'Borrowings incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in' },
      { type: 'line', title: 'Suppliers fund the working capital', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}', '{{A.netWorth.10|num}}', '{{A.netWorth.11|num}}'],
      ['Borrowings incl. leases (Screener)', '{{A.borrowings.8|num}}', '{{A.borrowings.9|num}}', '{{A.borrowings.10|num}}', '{{A.borrowings.11|num}}'],
      ['  of which lease liabilities (AR)', '–', '183', '215', '991'],
      ['Cash, bank balances and investments', '{{A.cashAndInvestments.8|num}}', '{{A.cashAndInvestments.9|num}}', '{{A.cashAndInvestments.10|num}}', '{{A.cashAndInvestments.11|num}}'],
      { hl: true, cells: ['**Net debt incl. leases (model basis)**', '**{{A.netDebt.8|num}}**', '**{{A.netDebt.9|num}}**', '**{{A.netDebt.10|num}}**', '**{{A.netDebt.11|num}}**'] },
      ['Net fixed assets (incl. right-of-use and PPG intangibles)', '{{A.fixedAssets.8|num}}', '{{A.fixedAssets.9|num}}', '{{A.fixedAssets.10|num}}', '{{A.fixedAssets.11|num}}'],
      ['Memo: goodwill (PPG ₹1,181 cr)', '–', '–', '119', '1,391'],
    ], source: 'Screener.in; AR FY25 and FY26 notes 17-18 and 46. Company net debt excludes leases and counts some other deposits: ₹2,240 cr (Mar-26), ₹1,967 cr (Jun-26).' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Shetty family owns 63%; institutions own less than a fifth',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down from 11.5% to 9.4%; DIIs ~9%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters steady at ~63%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 55, max: 70, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY15–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (post-Ind AS)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation & amortisation' },
      { key: 'otherIncome', name: 'Other income' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex (forecasts incl. new leases)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, seasons, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'NH.research.js')) ? require('./NH.research') : null;
  const report = {
    symbol: 'NH', listing: 'NSE: NH · BSE: 539551', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, seasons, capital, balance, ownershipBase, statements }) : [financials, seasons, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
