// Authoring source for the EIH Ltd (Oberoi group) initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// Part A (this file + EIHOTEL.partA2.js): chapters built on reported financials (Screener, consolidated; EIHOTEL.patch.js puts
// Net Profit on the attributable basis, so Screener's FY26 profit ÷ EPS = 62.49 cr shares vs the actual 62.54 cr).
// Part B (EIHOTEL.research.js + part2-6, shared EIHOTEL.ctx.js / ctx2.js) adds the research chapters.
// Usage: node tools/authoring/EIHOTEL.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'EIHOTEL', 'research');
const SRC = { co: 'Company filings, Screener.in (consolidated, post-Ind AS 116; profit attributable to owners), GAM Research' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Revenue 1.8x pre-Covid and margins up from ~20% to ~35%; but growth slowed to 7-9% in FY25-26 and margins slipped',
  blocks: [
    { p: 'Consolidated revenue was ₹1,596 cr in FY20, collapsed to ₹494 cr in FY21 (Covid) and reached ₹2,940 cr in FY26. The rebound was fast (FY23 ₹2,019 cr, FY24 ₹2,511 cr, +24%) and then slowed to +9% in FY25 and +7% in FY26, because EIH added almost no rooms: The Oberoi Grand Kolkata (209 keys) and Trident Jaipur (132 keys) closed for renovation, Wildflower Hall passed to the Himachal government, and only Rajgarh (65 keys, Nov-2025) and Vindhyavilas (21 keys) opened. Operating EBITDA margin rose from 18% (FY20) to 37% in FY24-25 as room rates outran costs, then slipped to 34.8% in FY26 (flight-catering mix with a higher airport levy, a ₹30 cr political donation, higher repairs and CSR). Attributable profit was ₹739 cr in FY25 and ₹628 cr in FY26; before exceptional items (Mashobra, labour codes) it was ₹768 cr and ₹715 cr.' },
    { pair: [
      { type: 'column', title: 'Revenue: ₹1,596 cr pre-Covid, ₹2,940 cr in FY26', unit: 'Revenue from operations, consolidated (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.co },
      { type: 'column', title: 'Attributable profit: losses in FY21-22, a peak of ₹739 cr in FY25', unit: 'Net profit attributable to owners, reported (₹ crore)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: SRC.co },
    ] },
    { pair: [
      { type: 'line', title: 'Operating EBITDA margin: ~20% before Covid, 37% at the peak, 35% now', unit: 'Operating EBITDA margin, consolidated (%)', x: 'fin.labels', from: 'FY19', to: 'FY26', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', source: SRC.co },
      { type: 'hbar', title: '"Other expenses" (power, repairs, commissions, airport levy) are the biggest cost', unit: 'FY26 costs and EBITDA, % of consolidated revenue (₹2,940 cr)', x: ['Food and materials', 'Employees', 'Other expenses (incl. ₹30 cr donation)', 'Operating EBITDA'], series: [{ name: 'Share', values: [9.4, 20.6, 35.1, 34.8], fmt: 'pct' }], labels: 'all', highlight: 'Operating EBITDA', source: 'Screener.in cost schedule (FY26); AR FY26 note 36' },
    ] },
    { callout: '**Our view:** EIH runs some of the best hotels in the world and its post-Covid profit recovery is real: margins are 15 points above FY20 and bank debt is gone. But the growth engine has stalled for two years, because the company grows by owning and building, and its next owned rooms (the Grand, Goa, London, Tirupati, Hebbal) arrive from FY29 onwards. Until then growth is almost all room rate.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Cash covers capex, dividends and a growing cash pile; returns are good on the old hotels, the new money earns later',
  blocks: [
    { p: 'EIH turned 97% of FY26 operating EBITDA into operating cash (₹993 cr of ₹1,024 cr). Capex was ₹222 cr in FY24, ₹485 cr in FY25 and ₹696 cr in FY26 (Screener; ₹680 cr on the company\'s measure, of which ~₹330 cr bought the freehold of the Mumbai hotel land, ~₹125 cr went into Rajgarh and ~₹100 cr into renovations). Dividends are modest: ₹1.50 a share for FY26 (15% of EPS). Surplus funds rose from ₹1,051 cr (Mar-25) to ₹1,335 cr (Mar-26) and ₹1,368 cr (Jun-26). Management guides capex of ₹600-700 cr a year for the next one or two years, rising towards FY29-30 for the bigger projects (Hebbal: two hotels and ~7.6 lakh sq ft of commercial space). Screener ROCE was 24% in FY24 and 21% in FY26.' },
    { pair: [
      { type: 'column', title: 'Operating cash has covered capex every year since FY23', unit: '₹ crore', x: 'A.labels', from: 'FY21', series: [{ name: 'Cash from operations', ref: 'A.cfo', fmt: 'num' }, { name: 'Capex', ref: 'A.capex', fmt: 'num' }], labels: 'none', source: SRC.co },
      { type: 'line', title: 'ROE 17% at the peak, 13% in FY26 (exceptional items, cash pile)', unit: 'ROE and ROCE, consolidated (%)', x: 'A.labels', from: 'FY19', series: [{ name: 'ROE', ref: 'A.roe', fmt: 'pct' }, { name: 'ROCE (Screener)', ref: 'A.roce', fmt: 'pct' }], labels: 'last', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26'], rows: [
      ['Cash from operations (Screener)', '{{A.cfo.9|num}}', '{{A.cfo.10|num}}', '{{A.cfo.11|num}}'],
      ['Capex (fixed assets)', '{{A.capex.9|num}}', '{{A.capex.10|num}}', '{{A.capex.11|num}}'],
      ['Dividends paid', '{{A.dividendsPaid.9|num}}', '{{A.dividendsPaid.10|num}}', '{{A.dividendsPaid.11|num}}'],
      { hl: true, cells: ['**Free cash flow after dividends**', '**413**', '**257**', '**191**'] },
      ['Memo: company surplus funds at year end', '744', '1,051', '1,335'],
      ['Memo: Mashobra compensation and Wildflower Hall settlement', '–', '–', 'shares transferred Dec-2025'],
    ], source: 'Screener.in cash flow; Q4FY26 deck slides 18-19 and call (29-May-2026); AR FY26 note 47A' } },
    { callout: '**The capital question:** EIH can fund ₹650-800 cr of capex and its dividend from cash flow and still add to its cash. The question is returns, not money. A new owned luxury hotel takes years to build (Gandikota moved from 2028 to 2030 after a site change; the Grand, shut for renovation, now reopens ~Sep-2028 after unplanned structural and fire-safety work) and ~3 years to stabilise (Rajgarh). Each year of delay is a year of capital earning nothing, and the managed pipeline that could lift returns without capital is small (1,833 keys) and back-ended.' },
  ],
};

module.exports = { financials, capital, RD, SRC };
Object.assign(module.exports, require('./EIHOTEL.partA2'));

if (require.main === module) {
  const P = module.exports;
  const B = fs.existsSync(path.join(__dirname, 'EIHOTEL.research.js')) ? require('./EIHOTEL.research') : null;
  const parts = { financials: P.financials, capital: P.capital, balance: P.balance, ownershipBase: P.ownershipBase, statements: P.statements };
  const report = {
    symbol: 'EIHOTEL', listing: 'NSE: EIHOTEL · BSE: 500840', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Consumer services',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections(parts) : Object.values(parts),
    statementNotes: { ...(B?.statementNotes || {}) },
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
