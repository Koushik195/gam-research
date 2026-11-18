// Authoring source for the KIMS (Krishna Institute of Medical Sciences) initiating-coverage report (as of 30-Sep-2026, Q1FY27).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to owners and Mar-26
// pro forma for the Jun-2026 QIP and Aug-2026 warrants, see KIMS.patch.js). Part B (KIMS.research.js + part2-6, shared
// KIMS.ctx.js) adds the research chapters. Usage: node tools/authoring/KIMS.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'KIMS', 'research');
const RAW = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')); // unpatched: reported balance sheet
const SCR = RAW.tables.ratios, RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated, post-Ind AS 116; profit attributable to owners), GAM Research' };
const n0 = v => Math.round(v).toLocaleString('en-IN');
const bsT = RAW.tables['balance-sheet'], sb = RAW.schedules['balance-sheet'];
const bs = (row, p) => bsT.rows[row][bsT.periods.indexOf(p)], sc = (par, item, p) => sb[par][item][p] || 0;
const YS = ['Mar 2023', 'Mar 2024', 'Mar 2025', 'Mar 2026'];
const nw = p => bs('Equity Capital', p) + bs('Reserves', p), bank = p => sc('Borrowings', 'Long term Borrowings', p) + sc('Borrowings', 'Short term Borrowings', p);
const lease = p => sc('Borrowings', 'Lease Liabilities', p), nci = p => sc('Other Liabilities', 'Non controlling int', p);
const cashInv = p => sc('Other Assets', 'Cash Equivalents', p) + bs('Investments', p);
const nd = p => bank(p) + lease(p) + nci(p) - cashInv(p);
const EB = { 'Mar 2023': 611, 'Mar 2024': 648, 'Mar 2025': 793, 'Mar 2026': 815 };
const PFCASH = 2076.45;

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue tripled since FY21, but profit fell in FY26 as ten new hospitals opened',
  blocks: [
    { p: 'KIMS grew revenue from ₹1,330 cr in FY21 to ₹3,905 cr in FY26 (24% a year), with acquisitions (Sunshine and Nagpur in 2022, Vizag QNRI in 2024) and a five-state building programme. Margins tell the other half of the story: EBITDA was 32% of revenue in FY22 (a Covid-era peak), 26% in FY24-25 and only 20.9% in FY26, when Thane, two Bengaluru hospitals, Kerala and several O&M units opened in the same year and lost ₹128 cr of EBITDA between them. Profit attributable to shareholders fell 37% to ₹241 cr in FY26 because depreciation and interest on the new hospitals arrived before their revenue: depreciation rose from ₹177 cr to ₹283 cr and interest from ₹100 cr to ₹215 cr.' },
    { pair: [
      { type: 'column', title: 'Revenue: 24% a year since FY21', unit: 'Revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Profit to shareholders: down 37% in FY26', unit: 'Net profit attributable to owners (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 32% in FY22, 21% in FY26', unit: 'EBITDA margin, post-Ind AS, before other income (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: SRC.co },
      { type: 'hbar', title: 'Doctors are the biggest cost: a quarter of revenue', unit: 'FY26 costs and EBITDA, % of revenue from operations', x: ['Doctors (consultancy charges)', 'Medicines and consumables', 'Employees (nurses, staff)', 'Other expenses', 'EBITDA (company, before other income)'], series: [{ name: 'Share', values: [25.8, 20.7, 17.5, 15.5, 20.5], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA (company, before other income)', source: 'AR FY26 consolidated statement of profit and loss and notes 2.19-2.23' },
    ] },
    { callout: '**Our view:** KIMS\'s mature hospitals in Telangana and Andhra Pradesh still earn 25-30% margins; the group margin fell because a third of its beds are now in hospitals less than two years old. FY27 is the test of whether those hospitals fill: Q1FY27 revenue rose 35% but EBITDA only 16%, and profit fell 47%.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Expansion paid for with debt, then with new shares: ₹2,400 cr of capex in two years',
  blocks: [
    { p: 'Over FY25-26 KIMS generated ₹1,093 cr of operating cash but spent ₹2,437 cr on capex, ₹176 cr on acquisitions and O&M deals, ₹250 cr buying out doctor-partners (mainly Sunshine), and ₹363 cr on interest and lease interest. The gap, ₹2,123 cr, was borrowed: bank debt rose from ₹1,047 cr (Mar-24) to ₹3,244 cr (Mar-26). Returns fell with it: ROCE (Screener) was 34% in FY22, 17% in FY24 and 10% in FY26. In June 2026 KIMS raised ₹1,500 cr in a QIP and in August its promoters subscribed to ₹600 cr of warrants; ₹1,125 cr of debt was repaid by early July. Management says the next three to four years of operating cash (₹2,000-2,500 cr) will go into new greenfield and brownfield hospitals in its existing states.' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex: capex 2-3x cash flow since FY23', unit: '₹ crore', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 34% in FY22, 10% in FY26', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 40, source: 'Screener.in (capital includes lease liabilities)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26', 'Two years'], rows: [
      ['Cash from operations', '582', '511', '1,093'],
      ['Capex', '−1,009', '−1,428', '−2,437'],
      ['Acquisitions and O&M deals (QNRI ₹112 cr; Kerala O&M ₹63 cr)', '−176', '0', '−176'],
      ['Buying out minority partners (Sunshine and others)', '−94', '−156', '−250'],
      ['Interest paid, incl. lease interest', '−150', '−213', '−363'],
      ['Lease principal', '−13', '−69', '−82'],
      { hl: true, cells: ['**Funding gap**', '**−860**', '**−1,355**', '**−2,215**'] },
      ['Net new borrowings', '794', '1,329', '2,123'],
      ['Memo: June-2026 QIP (net) and promoter warrants (₹150 cr paid, ₹450 cr due)', '', '', '1,476 + 600'],
    ], source: 'AR FY26 consolidated cash flow statement; CARE monitoring agency report; NSE warrant filing. The gap left after borrowings came from mutual funds, deposits and minority partners\' contributions.' } },
    { callout: '**The capital question:** KIMS has built ~3,500 beds since FY24 with debt; the QIP and warrants (7% dilution) repaired the balance sheet. On our numbers free cash flow after interest turns positive in FY27-29E only because capex falls to ₹460-650 cr a year. Management has already said it will announce new greenfields next year: returns (ROE ~10% in FY28E on our numbers) do not yet cover the cost of equity, so each new project has to earn its keep before the next is started.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & leases', kicker: 'Balance sheet', title: 'Net debt peaked at 5.4x EBITDA in March 2026; the QIP and warrants cut it to ~2.8x',
  blocks: [
    { p: `At March 2026 KIMS owed ₹${n0(bank('Mar 2026'))} cr to banks, had ₹${n0(lease('Mar 2026'))} cr of lease liabilities (leased hospitals in Kerala, Thane and Bengaluru, and right-of-use assets under the Kerala O&M agreements) and ₹${n0(nci('Mar 2026'))} cr of minority partners' equity in its subsidiaries, against only ₹${n0(cashInv('Mar 2026'))} cr of cash, funds and investments (including ₹88 cr in the associate that owns the new Kondapur building). That is net debt of ₹${n0(nd('Mar 2026'))} cr on our basis, 5.4x FY26 EBITDA. Adding the QIP proceeds (₹1,476 cr net) and all ₹600 cr of the warrant money gives a pro forma ₹${n0(nd('Mar 2026') - PFCASH)} cr, 2.8x FY26 and ~2.2x our FY27E EBITDA. The company reported debt of ₹2,570 cr at June 2026 and ~₹2,400 cr in early August (excluding leases), and targets ~2x net debt/EBITDA.` },
    { pair: [
      { type: 'column', title: 'Borrowings including leases: four-fold in three years', unit: 'Bank borrowings plus lease liabilities, reported (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Borrowings incl. leases', values: ['Mar 2022', ...YS].map(p => bs('Borrowings', p)), fmt: 'num' }], labels: 'all', source: 'Screener.in (borrowings schedule incl. lease liabilities)' },
      { type: 'line', title: 'Receivable days have nearly doubled since FY22', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26', 'Mar-26 pro forma'], rows: [
      ['Net worth (owners)', ...YS.map(p => n0(nw(p))), n0(nw('Mar 2026') + PFCASH)],
      ['Bank borrowings', ...YS.map(p => n0(bank(p))), n0(bank('Mar 2026'))],
      ['Lease liabilities', ...YS.map(p => n0(lease(p))), n0(lease('Mar 2026'))],
      ['Minority interests (book)', ...YS.map(p => n0(nci(p))), n0(nci('Mar 2026'))],
      ['Cash, funds and investments (incl. associate)', ...YS.map(p => n0(cashInv(p))), n0(cashInv('Mar 2026') + PFCASH)],
      { hl: true, cells: ['**Net debt incl. leases and minorities**', ...YS.map(p => `**${n0(nd(p))}**`), `**${n0(nd('Mar 2026') - PFCASH)}**`] },
      ['Net debt ÷ EBITDA of the year (x)', ...YS.map(p => (nd(p) / EB[p]).toFixed(1)), (nd('Mar 2026') - PFCASH) / 815 > 0 ? ((nd('Mar 2026') - PFCASH) / 815).toFixed(1) : '–'],
      ['Net fixed assets + work in progress', ...YS.map(p => n0(bs('Fixed Assets', p) + bs('CWIP', p))), n0(bs('Fixed Assets', 'Mar 2026') + bs('CWIP', 'Mar 2026'))],
    ], source: 'Screener.in (reported, before our adjustments); AR FY26; pro forma adds the QIP (net ₹1,476 cr) and the promoter warrants (₹600 cr) to cash, GAM Research' } },
    { callout: '**How we treat it in the model:** the engine starts from the pro forma March 2026 balance sheet (shares 42.77 cr fully diluted) and counts leases and minorities (at book) as debt. The reported March 2026 figures are as above; the model\'s "net worth" and "cash" for FY26 are pro forma.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: founder family at 32.5% after the QIP, Indian funds the largest holders',
  blocks: [
    { pair: [
      { type: 'line', title: 'Domestic institutions hold a third; foreign investors ~15%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoters: 38.8% → 34.1% (reclassification) → 32.5% (QIP)', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 25, max: 42, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY16–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA (post-Ind AS, before other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 300 } }, { key: 'dep', name: 'Depreciation (incl. right-of-use)' },
      { key: 'otherIncome', name: 'Other income' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹; FY26 pro forma 42.77 cr shares)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex (forecasts incl. new leases)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 25 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income' }, { key: 'interest', name: 'Interest' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'KIMS.research.js')) ? require('./KIMS.research') : null;
  const report = {
    symbol: 'KIMS', listing: 'NSE: KIMS · BSE: 543308', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
