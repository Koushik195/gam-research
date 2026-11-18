// Authoring source for the Global Health (Medanta) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; profit attributable to owners,
// see MEDANTA.patch.js). Part B (MEDANTA.research.js + part2-6, shared MEDANTA.ctx.js) adds the research chapters.
// Usage: node tools/authoring/MEDANTA.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'MEDANTA', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8')).tables.ratios;
const RL = SCR.periods.map(p => 'FY' + p.slice(-2));
const SRC = { co: 'Company filings, Screener.in (consolidated, post-Ind AS 116; EBITDA after ESOP, before other income), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue doubled in four years; the FY26 margin dip was Noida, not the core',
  blocks: [
    { p: 'Medanta\'s revenue grew from ₹2,167 cr in FY22 to ₹4,410 cr in FY26 (19% a year): +25% in FY23 as Lucknow and Patna filled, +21% in FY24, a slower +13% in FY25 (PL cites issues at the Lucknow unit; Noida was not yet open) and +19% in FY26. Profit attributable to shareholders rose from ₹196 cr to ₹556 cr (30% a year), helped by interest on the IPO cash. The EBITDA margin (after ESOP cost, before other income) climbed from 21% in FY22 to 24.7% in FY24, held at 24.0% in FY25 and fell to 21.1% in FY26, when the new Noida hospital lost ₹78 cr before it filled. Without Noida the margin kept rising (company basis 25.7% in FY26 vs 25.4%).' },
    { pair: [
      { type: 'column', title: 'Revenue: 19% a year since FY22', unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Net profit to owners: almost tripled since FY22', unit: 'Net profit attributable to shareholders (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 24.7% peak in FY24, 21.1% in FY26 with Noida\'s start-up loss', unit: 'EBITDA margin, after ESOP, before other income (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 5, max: 30, source: SRC.co },
      { type: 'hbar', title: 'Staff and doctors are the biggest cost: 40% of revenue', unit: 'FY26 costs and EBITDA, % of revenue', x: ['Employees (ex ESOP)', 'Medicines and consumables (incl. pharmacy stock)', 'Other expenses', 'Retainer doctors\' fees', 'ESOP cost', 'EBITDA (after ESOP, ex other income)'], series: [{ name: 'Share', values: [24.0, 22.6, 16.8, 14.9, 0.9, 20.8], fmt: 'pct' }], labels: 'all', highlight: 'EBITDA (after ESOP, ex other income)', source: 'AR FY26 consolidated P&L and notes 29-35 (EBITDA ₹919 cr on the AR basis; Screener ₹930 cr)' },
    ] },
    { callout: '**Our view:** Medanta\'s core economics are good and improving: Lucknow and Patna earn ~32% (company basis) and the Gurugram-led cluster ~24% with all group overheads. The headline margin is a mix effect. Noida pulled it down in FY26 and will lift it in FY27-28 as it breaks even; then the next wave of hospitals (2,950 beds, from FY30) will pull it down again.' },
  ],
};

const noida = {
  id: 'noida', nav: 'Noida ramp-up', kicker: 'New hospital', title: 'Noida: from a ₹32 cr quarterly loss to almost breakeven in three quarters',
  blocks: [
    { p: 'Medanta Noida (550-bed capacity) opened in September 2025 and was formally inaugurated on 27-Nov-2025. Beds were opened floor by floor: 226 installed beds at Sep-2025, 328 at Dec-2025, 382 at Mar-2026 and 433 at Jun-2026 (323 census beds), with all 14 operating theatres, radiation oncology and robotics live from the start. The loss peaked at ₹32 cr in Q3FY26 and fell to ₹4.9 cr in Q1FY27 on ₹85.5 cr of income, after insurance, PSU and (in May-2026) CGHS empanelments. Management first guided breakeven in H2FY27 (15-May-2026), then said it would come "earlier than our previous expectations" (31-Jul-2026). Occupancy is still only 30-40%; hospitals of this kind break even at 40-45% (CEO).' },
    { pair: [
      { type: 'column', title: 'Noida income: ₹4 cr to ₹86 cr a quarter in a year', unit: 'Noida total income (₹ crore)', x: ['Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Income', values: [3.9, 34.3, 52.5, 85.5], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p.10' },
      { type: 'column', title: 'Noida EBITDA loss: peak in Q3FY26, nearly gone by Q1FY27', unit: 'Noida EBITDA, company basis (₹ crore)', x: ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'EBITDA', values: [-3.0, -19.7, -32.0, -23.6, -4.9], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 presentation p.10; Q4FY26 presentation p.13 (FY26 loss ₹78.3 cr)' },
    ] },
    { callout: '**Why it matters:** Noida is the swing factor for FY27-28. Going from a ₹78 cr loss in FY26 to breakeven adds ~1.8pp to the group margin on its own; we assume ₹5 cr of EBITDA in FY27E and ₹60 cr in FY28E (PL assumes ₹87 cr). Lucknow and Patna both broke even in their first full year, so the track record supports a fast ramp; the difference is that Noida competes with established NCR hospitals rather than filling a gap.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'The IPO cash is being spent: capex doubled in FY26 and stays ~₹1,000-1,400 cr a year',
  blocks: [
    { p: 'Medanta generated ₹624 cr of operating cash in FY25 and ₹714 cr in FY26, but spent ₹517 cr and ₹838 cr on hospitals and equipment plus ₹131 cr and ₹140 cr on land (Mumbai, Guwahati), so free cash flow turned negative in FY26 and debt rose ₹303 cr (Noida project loan). The company reported ₹940 cr of FY26 capex, ₹416 cr of it at Noida. Returns have dropped as capital went in ahead of profits: Screener ROCE fell from 20% (FY24-25) to 17% (FY26); the company\'s own consolidated ROCE fell from 18.1% to 14.9% (21.3% excluding Noida and projects). The next phase is bigger: ₹4,858 cr of project capex over five years plus ₹600 cr of maintenance over three, "funded by a combination of debt funding and internal accruals".' },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex', unit: '₹ crore (capex excludes land payments)', x: 'A.labels', from: 'FY19', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROCE: 20% in FY24-25, 17% in FY26', unit: 'Return on capital employed (%)', x: RL, series: [{ name: 'ROCE', values: SCR.rows['ROCE %'], fmt: 'pct0' }], labels: 'all', min: 0, max: 25, source: 'Screener.in (capital includes lease liabilities)' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY25', 'FY26', 'Two years'], rows: [
      ['Cash from operations', '{{A.cfo.8|num}}', '{{A.cfo.9|num}}', '1,338'],
      ['Capex (hospitals, equipment)', '{{A.capex.8|num}}', '{{A.capex.9|num}}', '1,355'],
      ['Land (Mumbai, Guwahati; right-of-use)', '131', '140', '271'],
      ['Lease payments (interest + principal)', '39', '47', '86'],
      ['Dividends', '0', '{{A.dividendsPaid.9|num}}', '13'],
      { hl: true, cells: ['**Left over before financing and interest income**', '**−63**', '**−324**', '**−387**'] },
      ['Memo: net new borrowings / interest received', '−34 / 67', '357 / 78', ''],
      ['Memo: company cash, end of year', '1,140', '1,222', ''],
    ], source: 'Screener.in cash flow; AR FY26 consolidated cash flow (land, leases, interest). Interest received sits in investing cash flow.' } },
    { callout: '**The capital question:** on our numbers operating cash (₹900-1,200 cr a year in FY27-29E) roughly matches capex, so net debt including leases moves from ~zero at Mar-2026 to ~₹280 cr by Mar-2029. The balance sheet can carry that easily. The issue is returns: ~₹3,650 cr of capex over FY27-29E, much of it for hospitals that open only from FY30, so ROE drifts from ~16% to ~15% before it can rise.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & leases', kicker: 'Balance sheet', title: 'Net cash of ₹591 cr before leases, about zero after them: a strong base for the build-out',
  blocks: [
    { p: 'At Mar-2026 Medanta had ₹631 cr of bank debt (₹303 cr more than a year earlier, mainly the Noida project loan), ₹1,222 cr of cash and deposits (company figure, incl. ₹89 cr of longer deposits outside Screener\'s cash line) and ₹559 cr of lease liabilities (hospital buildings, land and equipment under Ind AS 116; ₹216 cr of new leases in FY26). So the company has **net cash of ₹591 cr ignoring leases**, or **net cash of ~₹30 cr including them**. Rent is small (lease payments ₹47 cr a year, ~1% of revenue), so the choice of basis matters less than at peers that lease most of their hospitals, but we keep it consistent: post-Ind AS EBITDA with lease liabilities counted as debt. CRISIL upgraded the bank loans to AA/Stable in Dec-2025.' },
    { pair: [
      { type: 'column', title: 'Borrowings including leases: down after the IPO, up again with Noida', unit: 'Borrowings incl. lease liabilities (₹ crore)', x: 'A.labels', from: 'FY19', series: [{ name: 'Borrowings', ref: 'A.borrowings', fmt: 'num' }], labels: 'all', source: 'Screener.in (FY26: bank debt ₹631 cr + leases ₹559 cr)' },
      { type: 'line', title: 'Receivable days creeping up with insurers and CGHS', unit: 'Days', x: RL, series: [{ name: 'Receivable days', values: SCR.rows['Debtor Days'], fmt: 'num' }, { name: 'Payable days', values: SCR.rows['Days Payable'], fmt: 'num' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Balance sheet snapshot (₹ crore)', head: ['', 'Mar-23', 'Mar-24', 'Mar-25', 'Mar-26'], rows: [
      ['Net worth (owners)', '{{A.netWorth.6|num}}', '{{A.netWorth.7|num}}', '{{A.netWorth.8|num}}', '{{A.netWorth.9|num}}'],
      ['Bank debt (company)', '842', '419', '328', '631'],
      ['Lease liabilities', '280', '383', '390', '559'],
      ['Cash, deposits and investments (company)', '1,311', '1,191', '1,140', '1,222'],
      { hl: true, cells: ['**Net cash excl. leases**', '**469**', '**772**', '**812**', '**591**'] },
      { hl: true, cells: ['**Net cash incl. leases**', '**189**', '**389**', '**422**', '**32**'] },
      ['Net fixed assets (incl. right-of-use) + CWIP', '2,377', '2,624', '3,047', '3,927'],
    ], source: 'Q4FY26 presentation p.22 (debt, cash); Screener.in (leases, net worth, fixed assets); GAM Research' } },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: founder at 33%, Temasek at ~15%, and Indian funds buying',
  blocks: [
    { pair: [
      { type: 'line', title: 'DIIs up from 11% to 17%; FIIs down from 11% to 9%', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter steady at 33%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 25, max: 40, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials',
  blocks: [
    { statement: { title: 'Profit & loss, FY16–FY29E', rows: [
      { key: 'sales', name: 'Revenue', flag: { type: 'pct', th: 15 }, hl: true }, { key: 'ebitda', name: 'EBITDA (after ESOP, ex other income)', hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 200 } }, { key: 'dep', name: 'Depreciation (incl. right-of-use)' },
      { key: 'otherIncome', name: 'Other income' }, { key: 'pbt', name: 'Profit before tax' },
      { key: 'pat', name: 'Net profit (owners)', hl: true, flag: { type: 'pct', th: 25 } }, { key: 'eps', name: 'EPS (₹)', fmt: 'n1' },
      { key: 'cfo', name: 'Cash from operations' }, { key: 'capex', name: 'Capex (forecasts incl. new leases)' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L', rows: [
      { key: 'sales', name: 'Revenue', yoy: true, flag: { type: 'pct', th: 20 }, hl: true }, { key: 'ebitda', name: 'EBITDA' },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0' }, { key: 'otherIncome', name: 'Other income (Screener incl. exceptional items)' },
      { key: 'dep', name: 'Depreciation' }, { key: 'pat', name: 'Net profit (owners)', hl: true },
    ] } },
  ],
};

const statementNotes = {};
module.exports = { financials, noida, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'MEDANTA.research.js')) ? require('./MEDANTA.research') : null;
  const report = {
    symbol: 'MEDANTA', listing: 'NSE: MEDANTA · BSE: 543654', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, noida, capital, balance, ownershipBase, statements }) : [financials, noida, capital, balance, ownershipBase, statements],
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
