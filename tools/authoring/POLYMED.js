// Authoring source for the Poly Medicure initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file): chapters built on reported financials (Screener, consolidated; Net Profit on the attributable basis,
// see POLYMED.patch.js). Part B (POLYMED.research.js + part2-6, shared POLYMED.ctx.js / POLYMED.base.js) adds the research.
// Usage: node tools/authoring/POLYMED.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'POLYMED', 'research');
const X = fs.existsSync(path.join(__dirname, 'POLYMED.ctx.js')) ? require('./POLYMED.ctx') : null;
const n0 = v => Math.round(v).toLocaleString('en-IN');

const FYS = ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const IX = l => X.A.labels.indexOf(l);
const financials = X && (() => {
  const { A, FY26, epsBase, epsRepAll, epsU, n1, epsCagr } = X;
  const sl = k => FYS.map(l => A[k][IX(l)]);
  const cost = v => Math.round(v / FY26.revenue * 1000) / 10;
  return {
    id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue ×3 since FY19 and EPS ×4.5 to FY25, then a stall: FY26 organic growth was 5%, margins fell 3pp and EPS slipped',
    blocks: [
      { p: `Polymed's revenue grew from ₹610 cr in FY19 to ₹1,875 cr in FY26 (17% a year) in three phases. **FY19-21: bootstrapped.** Growth of 13-18% a year funded from its own cash; EBITDA margin rose to 28% in FY21 on COVID-era demand for infusion and critical-care consumables. **FY22-25: the QIP-funded build-out.** Two share sales (₹400 cr in 2020, ₹1,000 cr in Aug-2024) paid for capacity, renal and new segments; revenue grew 17-23% a year and EPS rose from ₹15.3 to ₹33.4. **FY26: the stall.** Exports fell 3-4% outside the acquisitions (European customers' over-stocking, US tariffs, West-Asia shipping), so organic revenue grew only 5%; PendraCare and Citieffe added ₹117 cr of revenue but lost money; consolidated EBITDA margin fell from 27.3% to 23.8% (Screener) and EPS from ₹33.4 to ₹31.8 (₹${n1(epsBase[2026])} before ₹16.5 cr of labour-code and deal costs).` },
      { pair: [
        { type: 'column', title: 'Revenue: ₹610 cr to ₹1,875 cr; FY26 growth was mostly acquired', unit: 'Revenue (₹ crore), Screener basis', x: FYS, series: [{ name: 'Revenue', values: sl('sales'), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Screener.in (consolidated)' },
        { type: 'line', title: 'EBITDA margin: 27% in FY24-25, 24% since the acquisitions', unit: 'EBITDA margin (%), Screener basis (excludes the associate)', x: [...FYS, 'Q1FY27'], series: [{ name: 'EBITDA margin', values: [...sl('ebitdaMargin').map(v => Math.round(v * 10) / 10), 23.8], fmt: 'pct' }], labels: 'all', min: 18, max: 30, source: 'Screener.in; Q1FY27 results' },
      ] },
      { pair: [
        { type: 'hbar', title: 'Where each rupee of FY26 revenue went', unit: 'FY26, % of revenue from operations (company, consolidated)', x: ['Materials (COGS)', 'Employees', 'Other expenses', 'R&D', 'Operating EBITDA'], series: [{ name: 'Share', values: [cost(596.8), cost(402.3), cost(394.3), cost(29.9), cost(452.0)], fmt: 'pct' }], labels: 'all', highlight: 'Operating EBITDA', source: 'Q4FY26 PPT p.10 (₹1,875.3 cr revenue; EBITDA before the associate)' },
        { type: 'column', title: 'EPS: ₹7.4 to ₹33.4 in six years, then a dip', unit: 'EPS (₹, attributable profit on year-end shares)', x: FYS, series: [{ name: 'Reported', values: FYS.map(l => Math.round(epsRepAll[2000 + +l.slice(2)] * 10) / 10), fmt: 'n1' }, { name: 'Before FY26 one-offs', values: FYS.map(l => (l === 'FY26' ? Math.round(epsBase[2026] * 10) / 10 : null)), fmt: 'n1' }], labels: 'all', source: 'Screener.in; Q3-Q4FY26 PPTs; AR FY26' },
      ] },
      { exhibit: { type: 'table', title: 'FY24 → FY26: growth slowed, costs did not (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'Note'], wide: [4], rows: [
        ['Revenue', '{{A.sales.9|num}}', '{{A.sales.10|num}}', '{{A.sales.11|num}}', 'FY26 incl. ₹117 cr from PendraCare and Citieffe; organic +5.3%'],
        ['EBITDA (Screener)', '{{A.ebitda.9|num}}', '{{A.ebitda.10|num}}', '{{A.ebitda.11|num}}', 'Company operating EBITDA FY26 ₹457.7 cr incl. ₹5.7 cr associate, before the ₹6.8 cr labour-code charge'],
        ['Employee cost (% of revenue)', '18.0%', '18.2%', '21.6%', 'Acquired businesses are people-heavy; Haryana minimum wage +35% from Apr-2026'],
        ['Depreciation & amortisation', '{{A.dep.9|num}}', '{{A.dep.10|num}}', '{{A.dep.11|num}}', 'New plants (Haridwar, Faridabad) and acquisition intangibles'],
        ['Other income (Screener)', '{{A.otherIncome.9|num}}', '{{A.otherIncome.10|num}}', '{{A.otherIncome.11|num}}', 'Treasury income on the QIP cash plus forex gains; incl. the associate'],
        ['Finance cost', '{{A.interest.9|num}}', '{{A.interest.10|num}}', '{{A.interest.11|num}}', 'Working-capital lines and Citieffe\'s loans'],
        { hl: true, cells: ['**Profit to shareholders**', '**{{A.pat.9|num}}**', '**{{A.pat.10|num}}**', '**{{A.pat.11|num}}**', 'FY26 after ₹16.5 cr of one-offs (₹12.4 cr after tax)'] },
        ['EPS (₹)', '{{A.eps.9|n1}}', '{{A.eps.10|n1}}', '{{A.eps.11|n1}}', 'Company basic EPS: FY25 ₹34.1 (weighted shares after the QIP), FY26 ₹31.8'],
      ], source: 'Screener.in; Q4FY26 PPT pp.10-11; AR FY26' } },
      { callout: `**Our view:** this was a 20%-a-year compounder that hit an air pocket in FY26, partly bad luck (Europe de-stocking, tariffs, West Asia) and partly choices (two loss-making acquisitions, heavy hiring ahead of growth). FY27 starts better (Q1 organic +12.4%, standalone margin 28%), but depreciation, interest and lower treasury income absorb much of the EBITDA growth. We forecast EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])} for FY27-29E, a ${Math.round(epsCagr)}% CAGR from FY26's ₹${n1(epsBase[2026])}: good, but slower than the 20%+ the stock used to be priced for.` },
    ],
  };
})();

const capital = X && (() => {
  const { A, n1, SHR, C } = X;
  const U = SHR.qipUse;
  return {
    id: 'capital', nav: 'Capital allocation', kicker: 'Capital allocation', title: 'Capital allocation: ₹1,400 cr raised from shareholders, ₹1,155 cr of capex and ₹390 cr of acquisitions in four years; returns on capital have halved',
    blocks: [
      { p: `Polymed has turned from a self-funded company into a capital-hungry one. It raised ₹400 cr in a QIP in Sep-2020 and ₹1,000 cr in Aug-2024 (53.2 lakh shares at ₹1,880, +5.5% to the share count). In FY23-26 it spent ₹1,155 cr on capex (new plants at Haridwar and Faridabad, Jaipur SEZ, gamma sterilisation, the Noida medical park) and ~₹390 cr in cash on PendraCare and Citieffe, against ₹936 cr of operating cash flow; free cash flow was negative in every one of those years on Screener's numbers. The result: capacity ahead of demand (65-70% used), a bigger product range and a balance sheet that is still net cash, but Screener's ROCE fell from 24% (FY24) to 12% (FY26) and ROE to ~11%, below a ~12% cost of equity. The company prefers its own ROIC (21.4% standalone in FY26), which leaves out the cash, unused assets and the subsidiaries.` },
      { pair: [
        { type: 'column', title: 'Capex has run ahead of operating cash flow since FY22', unit: '₹ crore', x: FYS, series: [{ name: 'Cash from operations', values: FYS.map(l => A.cfo[IX(l)]), fmt: 'num' }, { name: 'Capex', values: FYS.map(l => A.capex[IX(l)]), fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow' },
        { type: 'line', title: 'ROCE: 30% a decade ago, 12% in FY26', unit: 'Return on capital employed (%), Screener', x: FYS, series: [{ name: 'ROCE', values: FYS.map(l => A.roce[IX(l)]), fmt: 'pct0' }], labels: 'all', min: 0, max: 35, source: 'Screener.in' },
      ] },
      { exhibit: { type: 'table', title: 'Where the Aug-2024 QIP money went, to Mar-2026 (₹ crore)', head: ['Use', 'Amount', 'Comment'], wide: [2], rows: [
        ['Issue expenses', n1(U.expenses), '1.5% of the issue'],
        ['Capex', n1(U.capex), 'Plants and machinery'],
        ['Acquisitions ("inorganic initiatives")', n1(U.inorganic), 'PendraCare and Citieffe'],
        ['General corporate purposes', n1(U.generalCorporate), 'Incl. repaying working-capital lines (₹107 cr by Mar-25)'],
        { hl: true, cells: ['**Still in mutual funds, deposits and PMS**', `**${n1(U.unutilisedInFunds)}**`, 'Earning ~6.3%; earmarked as a "strategic reserve"'] },
      ], source: 'AR FY25 note 50; AR FY26 note 52' } },
      { exhibit: { type: 'table', title: 'Acquisitions so far', head: ['Deal', 'Price', 'What it brought', 'Result so far'], wide: [2, 3], rows: [
        ['Plan1Health, Italy (2019, 100%)', 'EV ~€4.2 mn', 'Oncology ports, long-term implantables, pain pumps (Class III)', 'Revenue €3.2 mn → €10.5 mn (CY20-25), margin 3.7% → 13.4%: the model deal'],
        ['PendraCare, Netherlands (Sep-2025, 90%)', `EV €18.8 mn; ₹${n0(C.acquisitions.pendracare.cashPaid)} cr cash + ₹${n0(C.acquisitions.pendracare.contingent)} cr contingent`, 'Guiding and diagnostic catheters; OEM supplier; FDA-cleared guiding catheter', `CY25 EBITDA only €84k on €8.2 mn revenue; FY26 loss before tax ₹14.1 cr in six months; ~20% Middle East exposure`],
        ['Citieffe (Medistream SA), Italy (Nov-2025, 100%)', `EV €31.0 mn; ₹${n0(C.acquisitions.citieffe.cashPaid)} cr cash; ₹81 cr debt assumed`, 'Trauma and extremity implants; direct sales in Italy, the US and Mexico', 'CY25 revenue flat at €17.7 mn (EBITDA €3.15 mn, 18%); 10-12% growth in EUR guided for FY27'],
        ['Medyneo, Brazil (May-2026)', '~USD 40,000', 'ANVISA and import licences', 'Saves 18-24 months of approvals; a Brazil CEO hired'],
        ['Himalayan Mineral Water (IBC, FY26)', '₹33 cr', 'Not explained in the filings we read', 'Control pending at Mar-26'],
      ], source: 'Q1FY27 PPT pp.12-14; AR FY26 note 38; Q4FY26 and Q1FY27 calls' } },
      { callout: '**The acquisition arithmetic.** Polymed paid ~₹390 cr of cash (plus ~₹39 cr contingent and ₹81 cr of assumed debt) for two businesses with ~₹260 cr of revenue and almost no profit. Management says they can earn 12-14% EBITDA now and 18-20% in 2-3 years with Indian sourcing and production; on ₹290 cr that would be ₹35-58 cr of EBITDA, against ~₹25 cr a year of post-tax treasury income given up. The Plan1Health record says it can work; FY26 says it will take time.' },
    ],
  };
})();

const A2 = X ? require('./POLYMED.partA2') : {};
const { balance, ownershipBase, statements } = A2;
const statementNotes = {};
module.exports = { financials, capital, balance, ownershipBase, statements, statementNotes, RD };

if (require.main === module) {
  const B = fs.existsSync(path.join(__dirname, 'POLYMED.research.js')) ? require('./POLYMED.research') : null;
  const report = {
    symbol: 'POLYMED', listing: 'NSE: POLYMED · BSE: 531768', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Healthcare',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, capital, balance, ownershipBase, statements }) : [financials, capital, balance, ownershipBase, statements].filter(Boolean),
    statementNotes: { ...statementNotes, ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
