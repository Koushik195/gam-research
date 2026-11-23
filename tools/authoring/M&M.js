// Authoring source for the Mahindra & Mahindra initiating-coverage report (as of 30-Sep-2026, Q1FY27 basis).
// The engine models the STANDALONE company (auto + farm; Screener standalone after M&M.patch.js, which moves income
// from group companies out of revenue); the group stakes are valued in a sum of the parts (M&M.ctx.js / ctx2), and
// M&M.sotp.js carries that SOTP into the engine as an implied multiple of standalone Sep-28E EPS.
// Part A (this file): chapters on reported financials + the writer. Part B: M&M.research.js + M&M.part2-6.js.
// Usage: node "tools/authoring/M&M.js"   (run node src/model.js "M&M" before and after)
const fs = require('fs');
const path = require('path');
const { syncSotp } = require('./M&M.sotp');
const SYM = 'M&M';
const RD = path.join(__dirname, '..', '..', 'data', 'raw', SYM, 'research');
const SRC = { co: 'M&M annual reports FY24-FY26, quarterly results, Screener.in (standalone, investment income moved to other income), GAM Research', est: 'Company, Screener.in (standalone); GAM Research estimates (FY27-29E)' };

const financials = {
  id: 'trajectory', nav: 'Financial trajectory', kicker: 'Financials', title: 'Five years of 25% compounding, now slowing to ~13%',
  blocks: [
    { p: 'Standalone M&M (the auto and farm businesses, without the group companies) earned ₹{{fin.pat.5|num}} cr in FY20 and ₹{{fin.pat.11|num}} cr in FY26. The early years are distorted by write-downs of group companies (SsangYong in FY20-21, trucks in FY23), so the cleaner comparison is revenue and operating profit. Revenue went from ₹{{fin.sales.6|num}} cr in FY21 to ₹{{fin.sales.11|num}} cr in FY26 (27% a year), as SUVs (XUV700, Scorpio-N, Thar Roxx, XUV 3XO) and a GST-cut tractor boom arrived on top of each other. EBITDA (operating profit) margin, measured without dividends from group companies, rose from 12.2% in FY22 to {{fin.ebitdaMargin.10|pct}} in FY25 and {{fin.ebitdaMargin.11|pct}} in FY26, then fell to 12.2% in Q1FY27 when commodities jumped.' },
    { pair: [
      { type: 'column', title: 'Revenue tripled in five years; growth slows from here', unit: 'Standalone revenue from operations (₹ crore)', x: 'fin.labels', from: 'FY19', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'line', title: 'Operating margin: 14-15% at best, 12-13% in our forecasts', unit: 'Core EBITDA margin (%), excluding investment income', x: 'fin.labels', from: 'FY17', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 8, max: 18, source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: write-downs hid the earnings power until FY23', unit: 'Standalone EPS on 124.35 cr shares (₹)', x: 'fin.labels', from: 'FY17', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: SRC.est },
      { type: 'line', title: 'ROE above 20% since FY24, helped by cash and dividends', unit: 'Return on average standalone equity (%)', x: 'fin.labels', from: 'FY17', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', min: 0, max: 26, source: SRC.est },
    ] },
    { callout: '**Our view:** the FY22-26 jump was real: M&M\'s share of utility vehicles went from 17.2% (FY24) to 21.3% (FY26), and tractors had two record years. But FY27 is the first year of slower profit growth: we forecast EPS of {{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} for FY27-29E ({{F.epsGrowth.0|chg}}, {{F.epsGrowth.1|chg}}, {{F.epsGrowth.2|chg}}), with revenue growth of {{F.salesGrowth.0|pct}} in FY27 falling to ~11% by FY29 and EBITDA margins of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}. EVs made for MEAL (near-zero margin in M&M) and a weaker tractor cycle keep margins below the FY25-26 peak.' },
  ],
};

const balance = {
  id: 'balance', nav: 'Balance sheet & cash', kicker: 'Balance sheet', title: 'Net cash of ~₹31,000 cr, plus ₹27,500 cr of group companies at cost',
  blocks: [
    { p: 'At Mar-2026 standalone M&M had ₹32,965 cr of liquid funds (bank deposits ₹17,719 cr, cash ₹761 cr, mutual funds and bonds ₹14,485 cr) against ₹1,653 cr of debt (incl. ₹597 cr of leases): net cash ~₹31,300 cr, ~₹252 a share. It also carried ₹27,547 cr of investments in group companies at cost after ₹7,101 cr of cumulative write-downs; their market value is far higher (the listed ones alone were worth ₹70,476 cr at Mar-2026). Working capital is negative: suppliers fund M&M (payables ₹29,500 cr vs inventory ₹10,306 cr and receivables ₹6,486 cr). The engine\'s "cash + investments − debt" line below adds the group investments at cost; in our sum of the parts they are valued separately.' },
    { pair: [
      { type: 'column', title: 'Free cash flow ~₹16,000 cr in FY26; capex now rising', unit: 'Operating cash flow less capex (₹ crore)', x: 'fin.labels', from: 'FY19', series: [{ name: 'FCF', ref: 'fin.fcf', fmt: 'num' }], labels: 'all', source: SRC.est },
      { type: 'column', title: 'Capex doubles from FY24 to FY29E for 2x SUV capacity', unit: 'Capex (₹ crore)', x: 'fin.labels', from: 'FY19', series: [{ name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'all', source: SRC.est },
    ] },
    { exhibit: { type: 'table', title: 'Where the cash goes: FY26 sources and uses (standalone, ₹ crore)', head: ['Item', '₹ crore', 'Comment'], wide: [2], rows: [
      ['Operating cash flow', '22,758', 'After tax and working capital (payables +₹6,094 cr)'],
      ['Capex (fixed assets)', '−6,308', 'Chakan capacity, NU_IQ and INGLO platforms, tractors'],
      ['Investments in group companies', '−6,398', 'MEAL ₹1,496 cr, SML ₹565 cr, rights issues in M&M Finance (₹1,653 cr), Lifespaces (₹835 cr), Logistics (₹479 cr), others'],
      ['Dividends paid', '−3,937', '₹25.30 a share for FY25'],
      ['Dividends and interest received', '+3,012', 'Mostly Tech Mahindra and M&M Finance dividends'],
      ['Net increase in liquid funds and others', 'balance', 'Liquid funds rose from ₹23,880 cr to ₹32,965 cr'],
    ], source: 'AR FY26 standalone cash flow and note 8; Screener.in cash-flow schedules' } },
    { callout: '**Read this right:** M&M is a cash machine in its core businesses, but the parent keeps sending money to group companies: ₹6,398 cr in FY26 and ₹8,975 cr more already approved for MEAL. We assume ₹3,000 cr a year of such investment and take it out of the cash that earns interest; in the sum of the parts it comes back at cost.' },
  ],
};

const ownershipBase = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Ownership: the Mahindra family holds 18%, domestic funds have replaced foreign ones',
  blocks: [
    { pair: [
      { type: 'line', title: 'FIIs down 7 points in two years, DIIs up 6', unit: '% of shares', x: 'SH.periods', series: [{ name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }, { name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }], labels: 'last', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Promoter group steady near 18.4%', unit: 'Promoter holding (%)', x: 'SH.periods', series: [{ name: 'Promoters', ref: 'SH.rows.Promoters', fmt: 'pct' }], labels: 'ends', min: 17, max: 20, source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

const statements = {
  id: 'statements', nav: 'Annotated statements', kicker: 'Appendix', title: 'Financial statements (standalone): what moved, and why',
  blocks: [
    { p: 'Standalone M&M, Screener.in data adjusted by GAM: from FY23 the company reports dividends and other income from group companies ("income from investments related to subsidiaries, associates and JVs") inside revenue and write-downs of group companies inside expenses; we move both to other income (FY23-FY26 and every quarter from Q2FY24), so revenue and EBITDA show the auto and farm businesses only. Profit is unchanged. Before FY23 the same items already sat in other income and exceptional items. Thresholds: revenue ±15%, EBITDA/PAT ±20%, margins ±100bp, other income ±25%, capex/operating cash flow ±30%.' },
    { statement: { title: 'Profit & loss, FY15-FY29E', source: SRC.est, rows: [
      { key: 'sales', name: 'Revenue from operations', flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'salesGrowth', name: '  growth %', fmt: 'pct' },
      { key: 'materialPct', name: 'Material cost % of revenue', src: 'A.materialPct', fmt: 'pct', flag: { type: 'bps', th: 200 }, inverse: true },
      { key: 'ebitda', name: 'EBITDA (core)', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'ebitdaMargin', name: 'EBITDA margin %', fmt: 'pct', flag: { type: 'bps', th: 100 } },
      { key: 'dep', name: 'Depreciation & amortisation', flag: { type: 'pct', th: 20 }, inverse: true },
      { key: 'otherIncome', name: 'Other income (treasury + group income − write-downs)', flag: { type: 'pct', th: 25 } },
      { key: 'pbt', name: 'PBT' },
      { key: 'pat', name: 'Net profit', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'eps', name: 'EPS (₹, 124.35 cr shares)', fmt: 'n1' },
    ] } },
    { statement: { title: 'Balance sheet & cash flow, FY15-FY29E', source: SRC.est, rows: [
      { section: 'Balance sheet' },
      { key: 'netWorth', name: 'Net worth', hl: true },
      { key: 'treasury', name: 'Cash + all investments − debt (incl. group companies at cost)' },
      { key: 'investments', name: 'Investments (group companies at cost + mutual funds)', src: 'A.investments', flag: { type: 'pct', th: 25 } },
      { key: 'payables', name: 'Trade payables', src: 'A.payables', flag: { type: 'pct', th: 25 } },
      { section: 'Cash flow' },
      { key: 'cfo', name: 'Operating cash flow', flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'capex', name: 'Capex', flag: { type: 'pct', th: 30 }, inverse: true },
      { key: 'fcf', name: 'Free cash flow', hl: true },
      { section: 'Returns' },
      { key: 'roe', name: 'ROE %', fmt: 'pct' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly P&L (standalone, investment income in other income)', source: 'Screener.in (standalone) adjusted with reported revenue from operations (M&M.patch.js); GAM Research', rows: [
      { key: 'sales', name: 'Revenue from operations', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
      { key: 'ebitda', name: 'EBITDA (core)', yoy: true, flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'opm', name: 'EBITDA margin %', fmt: 'pct0', flag: { type: 'bps', th: 150 } },
      { key: 'otherIncome', name: 'Other income (incl. group dividends)', flag: { type: 'pct', th: 50 } },
      { key: 'pat', name: 'Net profit', yoy: true, flag: { type: 'pct', th: 15 }, hl: true },
    ] } },
  ],
};

module.exports = { financials, balance, ownershipBase, statements, RD, SRC };

if (require.main === module) {
  syncSotp(); // keeps the engine's implied SOTP multiple in step with the built model
  const B = fs.existsSync(path.join(__dirname, 'M&M.research.js')) ? require('./M&M.research') : null;
  const report = {
    symbol: SYM, listing: 'NSE: M&M · BSE: 500520', date: '30 September 2026', rating: B?.rating || 'HOLD', analysts: 'GAM Research — Auto & Auto Components',
    cover: B?.cover || { headline: 'Draft', lead: 'Research in progress.', arguments: [], flags: [], catalysts: [] },
    sections: B ? B.sections({ financials, balance, ownershipBase, statements }) : [financials, balance, ownershipBase, statements],
    statementNotes: B?.statementNotes || {},
  };
  fs.mkdirSync(RD, { recursive: true });
  fs.writeFileSync(path.join(RD, 'initiation.json'), JSON.stringify(report, null, 1));
  console.log(`wrote initiation.json: ${report.sections.length} sections`);
}
