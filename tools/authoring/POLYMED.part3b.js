// Poly Medicure report, part 3b: exports & regulation (incl. the US), capacity and the cost of expansion, moat scorecard.
const X = require('./POLYMED.ctx');
const { C, D, SQ, F, A, b, n0, n1 } = X;
const R = C.regulatory;

const exports_ = {
  id: 'exports', nav: 'Exports, approvals & the US', kicker: 'Markets', title: 'Exports and approvals: Europe is back, the Middle East is blocked and the US, the biggest prize, is still under USD 4 mn',
  blocks: [
    { p: `Two-thirds of revenue is exported. **Europe** (₹597 cr in FY26, +7%; Q1FY27 ₹187 cr, +44% reported and +17.6% organic) recovered after a year of customer de-stocking, helped by new distributors in Northern Europe, the UK and Germany. **Rest of world** (₹683 cr; Q1FY27 +4.0% organic) is hurt by the West-Asia war: the Middle East is 6-8% of revenue and fell 32% in Q1FY27 because ships are not calling at Gulf ports, though orders are intact. **The US** is the opportunity Polymed keeps promising: Polymed has ~4 FDA 510(k) clearances of its own (3-4 more pending), Citieffe 10 (8-10 pending), PendraCare its guiding catheter; the group counts 15 approvals and 11-13 in the pipeline, has signed group-purchasing (GPO) contracts and hired a US sales head. But US exports will be only USD 3.5-4 mn in FY27 (<2% of revenue), a 10% tariff applies and management calls the policy "fluid".` },
    { exhibit: { type: 'table', title: 'Regulatory position by market (Aug-2026)', head: ['Market', 'Approvals', 'What it means'], wide: [1, 2], rows: [
      ['European Union', 'All sites certified to EU MDR 2017/745; 82 CE approvals, 15 pending; ~25 CE markings due within 3-4 months', 'The base of the export business; MDR raises the bar for Chinese and small rivals'],
      ['United States', 'Group: 15 FDA approvals, 11-13 pending (Polymed ~4, Citieffe 10, PendraCare 1, P1H 1 via an OEM)', 'Too few products to sell a basket to US hospitals; years, not quarters'],
      ['Brazil / LatAm', 'Medyneo brings ANVISA and import licences; subsidiary and CEO in place', 'Direct sales of new products from FY27-28'],
      ['India', 'CDSCO import registrations for Citieffe/PendraCare products take 6-9 months; stents price-capped by NPPA', 'Cross-selling into India from FY28 (management)'],
    ], source: 'Q4FY26 PPT pp.38-39; Q1FY27 PPT p.11; Q4FY26 and Q1FY27 calls; AR FY26' } },
    { pair: [
      { type: 'column', title: 'Europe and rest of world by quarter', unit: 'Revenue (₹ crore), incl. acquisitions from Q2FY26', x: SQ.map(q => q.q), series: [{ name: 'Europe', values: SQ.map(q => q.europe), fmt: 'num' }, { name: 'Rest of world', values: SQ.map(q => q.row), fmt: 'num' }], labels: 'none', source: 'Q3FY26, Q4FY26 and Q1FY27 PPTs' },
      { type: 'hbar', title: 'Q1FY27 growth by region: organic vs reported', unit: 'YoY growth (%)', x: ['India', 'Europe (organic)', 'Europe (reported)', 'RoW (organic)', 'RoW (reported)', 'Middle East'], series: [{ name: 'Growth', values: [16.2, 17.6, 43.8, 4.0, 30.3, -32], fmt: 'pct' }], labels: 'all', highlight: 'Middle East', source: 'Q1FY27 PPT p.26' },
    ] },
    { callout: '**Our view:** we give the US almost nothing in our forecasts (it is inside international organic growth of 11.5-13%). That is the honest base case: the approvals are real but few, and building a US hospital business takes a product basket Polymed does not yet have. A visible US ramp (new 510(k)s turning into orders) is the main thing that would make our forecasts too low.' },
  ],
};

const capacity = {
  id: 'capacity', nav: 'Capacity & expansion', kicker: 'Capacity', title: 'Capacity: 15 plants, 65-70% used, two more coming; the expansion shows up as depreciation, wages and working capital before it shows up as profit',
  blocks: [
    { p: `Polymed has ~95,000 m² of plants and ~1.9 bn units a year of capacity (from ~1.0 bn and 63,000 m² in FY20), in Faridabad, Jaipur (two SEZ units) and Haridwar (two plants), plus Italy, the Netherlands, China and the Egyptian associate. Management says capacity built after the 2021 QIP is 65-70% used. Two more plants are under construction: **Palwal/Faridabad** (orthopaedics, transfusion and extra infusion capacity; online by Mar-2027) and **Noida/YEIDA medical-device park** (cardiology; commercial in Q1FY28). Capex was ₹${n0(C.capex.FY23)} / ${n0(C.capex.FY24)} / ${n0(C.capex.FY25)} / ${n0(C.capex.FY26)} cr in FY23-26; guidance is ₹200-225 cr for FY27. Management expects asset turns of 1.2-1.4x on new capacity.` },
    { exhibit: { type: 'table', title: 'The cost of the expansion phase (₹ crore)', head: ['Item', 'FY24', 'FY26', 'FY27E (GAM)', 'Comment'], wide: [4], rows: [
      ['Gross block (Screener)', n0(A.grossBlock[b - 2]), n0(A.grossBlock[b]), n0(F.grossBlock[0]), 'FY26 incl. ~₹274 cr goodwill and ~₹131 cr acquired intangibles'],
      ['Depreciation & amortisation', n0(A.dep[b - 2]), n0(A.dep[b]), n0(F.dep[0]), 'Q1FY27 ₹36.3 cr; two plants still to come'],
      ['Employee cost (% of revenue)', '18.0%', '21.6%', 'n.a.', 'Consolidated; standalone employee cost +28.5% in Q1FY27'],
      ['Working capital (engine, % of sales)', 'n.a.', '43.9%', '43.9%', 'Receivables 98 days, inventory ~150 days (standalone)'],
      ['ROCE (Screener)', `${A.roce[b - 2]}%`, `${A.roce[b]}%`, `${n1(F.roce[0])}% (incl. other income)`, 'Capital employed rose faster than profit'],
    ], source: 'Screener.in; Q4FY26 and Q1FY27 PPTs and calls; GAM' } },
    { callout: '**So what:** Polymed has already paid for most of its next leg of growth. If revenue grows 13-14% a year on today\'s capacity and two new plants, depreciation grows more slowly than revenue from FY28 and returns recover; if growth stays at FY26\'s organic 5%, the plants become a drag. Our forecasts sit in between: ROCE including other income only 11-12% by FY29E.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real cost and approvals edge in disposables; no moat yet in the new segments',
  blocks: [
    { exhibit: { type: 'table', title: 'Moat scorecard', head: ['Source', 'Score', 'Evidence'], wide: [2], rows: D.moat, source: 'GAM Research, from company presentations, calls and the annual reports' } },
    { callout: '**Verdict: a narrow edge, not a wide moat.** Polymed\'s advantages (scale, automation, approvals, long distributor relationships) are real and have produced a decade of 15-20% growth at ~25% EBITDA margins, better than any listed Indian peer. But they protect a commodity-like product line against other low-cost makers only partly (renal shows what Chinese pricing can do), and in the new segments (cardiology, orthopaedics, the US) Polymed is a small, late entrant against entrenched multinationals and Indian specialists such as Meril. The premium valuation assumes the new segments succeed.' },
  ],
};

module.exports = { exports_, capacity, moat };
