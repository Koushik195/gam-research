// Lenskart report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, India, International, margins before and after rent, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in LENSKART.ctx.js; forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./LENSKART.ctx');
const { F, V, A, b, SQ, Q1, f26, f25, n0, n1, n2, pc1, price, mv, EVL, evSectorL, evMULT, ebitdaSep28, rating, post, medTp, preMultAt, preEbitda, preEbitda26, ISSUE, evSepNow, segM } = X;
const P2 = require('./LENSKART.part2'), P3 = require('./LENSKART.part3'), P4 = require('./LENSKART.part4'), P5 = require('./LENSKART.part5'), P6 = require('./LENSKART.part6');
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}`; };
const tpPre = preMultAt(V.tp);

const cover = {
  headline: 'India\'s eyewear category-builder: a better business every quarter, but the price already runs ahead of it',
  lead: `Lenskart designs, makes and sells glasses through 3,459 stores (2,725 in India) and an app, and owns Owndays (Japan) and Meller (Spain). It listed on 10-Nov-2025 at ₹${ISSUE}; the stock has risen 70% since. FY26 revenue grew 32.5% to ₹${n0(A.sales[b])} cr and EBITDA margin reached 19.9% (13.3% after rent in Q1FY27, against a ~25% long-term aim). We forecast EPS of ₹${n2(F.eps[0])} / ₹${n2(F.eps[1])} / ₹${n2(F.eps[2])} for FY27-29E, in the middle of the street. The street values Lenskart on **EV/EBITDA 1.5-2 years forward** (48-58x EBITDA after rent). The house rule (its own forward EV/EBITDA median since listing, ${n1(EVL.med)}x, adjusted by the retail peers' ${pc1(evSectorL)} move over the same ten months) gives **${evMULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** That is ≈${n1(tpPre)}x after-rent EBITDA on the street's basis. Cross-checks: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The business is creating its own market, and it shows in the numbers', p: `India revenue +${Q1.indiaGrowth}% in Q1FY27 with SSSG ${Q1.sssg}%, 63 lakh eye tests (+43%, half first-ever) and 116 net new stores; ~6,100 Indian pin codes still have no Lenskart store. Product margin crossed 70% as frames and lenses moved in-house. We model India +{{as.segments.0.growth.0|pct0}} / +{{as.segments.0.growth.1|pct0}} / +{{as.segments.0.growth.2|pct0}} on ~560 openings a year.` },
    { h: 'International has turned the corner', p: `International (41% of revenue) went from a 3.6% margin after rent in FY25 to 7.0% in FY26 and ${Q1.intlPreIndAsPct}% in Q1FY27, on same-store growth (+${Q1.intlGrowth}%, ~${Q1.intlCc}% in constant currency) with only 16 new stores. Meller is tracking towards ~US$70 mn. We take ${n1(segM('intl')[0])}% before rent and ESOP in FY27E (Q1 is the sunglasses season).` },
    { h: 'Read the margin after rent', p: `Reported EBITDA (${Q1.ebitdaMarginPct}% in Q1FY27) excludes rent under Ind AS 116; after rent the margin is ${Q1.preIndAsMarginPct}%. On our numbers after-rent EBITDA rises from ~₹${n0(preEbitda26)} cr in FY26 to ₹${n0(preEbitda[2])} cr in FY29E (~${n1(preEbitda[2] / F.sales[2] * 100)}% of revenue). Operating leverage is real, but SSSG is cooling (24% to 18% in two quarters) and openings move to smaller towns.` },
    { h: 'Valuation: the street pays for the next decade today', p: `At ₹${n2(price)} the stock trades at ${n1(evSepNow)}x Sep-28E EBITDA before rent and ${n1(price / F.eps[1])}x FY28E EPS, above its ${n1(EVL.med)}x forward median since listing, while retail peers trade ~12% below their own medians over the same months. The street's median target (₹${n0(medTp)}, ${post.length} post-results notes) needs 48-58x after-rent EBITDA. Pre-IPO funds (SoftBank, ADIA, Alpha Wave) have been selling into strength since May.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin (before rent)', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Governance', v: 'GREEN' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): India SSSG after 18.3% in Q1, International margin after the sunglasses season, store additions against the ~600 plan.',
    'Further block sales by pre-IPO holders (SoftBank 7.3%, ADIA, PI Opportunities Fund, Macritchie, Steadview): supply on rallies.',
    'Hyderabad plant (~18 months from May-2026): capex peak in FY27, then product-margin gains.',
    'Acquisitions funded from the ₹683 cr IPO allocation and the ₹4,104 cr net cash.',
    'Smart glasses (B by Lenskart): 80,000+ sign-ups by Aug-2026; no revenue in our model.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STL = post.slice().sort((a, c) => a.tp - c.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹3,788 cr (FY23) to ₹${n0(A.sales[b])} cr (FY26), ₹{{F.sales.2|num}} cr in FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY23', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'stacked', title: 'Stores: 1,959 (FY23) to 3,459 (Jun-26), India-led', unit: 'Stores (period end)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27'], series: [{ name: 'India', values: [...X.SA.map(a => a.indiaStores), 2725], fmt: 'num' }, { name: 'International', values: [...X.SA.map(a => a.intlStores), 734], fmt: 'num' }], minLabel: 400, source: 'RHP via ICICI Direct; shareholders\' letters' },
    ] },
    { pair: [
      { type: 'column', title: 'India and International both grew 30%+ in FY26 and Q1FY27', unit: 'Revenue growth (%)', x: ['India FY26', 'International FY26', 'India Q1FY27', 'International Q1FY27'], series: [{ name: 'Growth', values: [Math.round((f26.indiaRev / f25.indiaRev - 1) * 1000) / 10, Math.round((f26.intlRev / f25.intlRev - 1) * 1000) / 10, Q1.indiaGrowth, Q1.intlGrowth], fmt: 'pct' }], labels: 'all', source: 'AR FY26 note 41; Q1FY27 letter (proforma base)' },
      { type: 'column', title: 'Margin after rent: 9.1% to 13.3% in a year', unit: 'Pre-IndAS 116 EBITDA margin (%)', x: ['Q1FY26', 'Q1FY27'], series: [{ name: 'India', values: [13.3, Q1.indiaPreIndAsPct], fmt: 'pct' }, { name: 'International', values: [4.5, Q1.intlPreIndAsPct], fmt: 'pct' }, { name: 'Consolidated', values: [9.1, Q1.preIndAsMarginPct], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 shareholders\' letter' },
    ] },
    { pair: [
      { type: 'column', title: `EPS: ₹${n2(A.eps[b])} in FY26, ₹{{F.eps.2|n2}} in FY29E`, unit: 'EPS (₹)', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n2' }], labels: 'all', source: 'Screener.in (after minorities); GAM estimates FY27-29E' },
      { type: 'line', title: `Forward EV/EBITDA: ${n1(X.evNow)}x FY28E now vs a ${n1(EVL.med)}x median since listing`, unit: 'EV ÷ next full-year EBITDA (x)', x: X.fwdEv.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEv.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: evMULT.base, text: `Our multiple: ${evMULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in daily prices; FY27-28E EBITDA GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Share price: ₹${ISSUE} IPO, ₹${n2(price)} on 30-Sep-2026`, unit: '₹ per share (daily close)', x: X.px.map(x => x[0]), series: [{ name: 'Price', values: X.px.map(x => x[1]), fmt: 'inr', thin: true }], labels: 'last', lines: [{ v: ISSUE, text: `IPO ₹${ISSUE}`, color: '#8c8c8c' }], source: 'Screener.in; NSE close on 30-Sep-2026' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (post-results notes)', unit: `₹ per share; CMP ₹${n2(price)}`, x: [...STL.map(s => `${s.broker} (${sd(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STL.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Dated notes 12-Aug to 30-Sep-2026 (see the street table); median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.intl, P3.margins, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
