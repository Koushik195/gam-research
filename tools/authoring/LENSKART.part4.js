// Lenskart report, part 4: Q1FY27 and guidance, earnings quality, ownership, governance, our forecasts vs the street.
const X = require('./LENSKART.ctx');
const { C, D, F, A, b, Q1, FY26, n0, n1, n2, pc, epsCagrFwd, withEps, medOf } = X;
const L1 = 'Q1FY27 shareholders\' letter and call (12-Aug-2026)';

const guidance = {
  id: 'q1', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: `Q1FY27: revenue +34% (proforma), EBITDA margin ${Q1.ebitdaMarginPct}%, profit ₹${n0(Q1.pat)} cr, and no change to the ~25% long-term margin aim`,
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY27', 'YoY', 'Comment'], wide: [3], rows: [
      ['Revenue from operations', n0(Q1.revenue), `+${Q1.revenueGrowthProforma}% proforma (+${Q1.revenueGrowthReported}% reported)`, 'Reported growth flattered by Dealskart/Meller consolidation'],
      ['  India', n0(Q1.indiaRev), `+${Q1.indiaGrowth}%`, `SSSG ${Q1.sssg}%, SPSG ${Q1.spsg}%, 116 net new stores`],
      ['  International', n0(Q1.intlRev), `+${Q1.intlGrowth}%`, `~${Q1.intlCc}% in constant currency; 16 net new stores`],
      ['EBITDA (after Ind AS 116)', n0(Q1.ebitda), '+61% proforma', `${Q1.ebitdaMarginPct}% (${Q1.ebitdaMarginLyPct}% a year ago)`],
      ['EBITDA pre-Ind AS 116 (after rent)', n0(Q1.preIndAsEbitda), '~2x', `${Q1.preIndAsMarginPct}% (${Q1.preIndAsMarginLyPct}%)`],
      ['Net profit (incl. minorities)', n0(Q1.pat), `+182% on proforma ₹${Q1.patProformaLy} cr`, `₹${Q1.patOwners} cr to owners; Q1 alone is 45% of FY26's profit`],
      ['Operating cash / capex', `${Q1.ocf} / ${Q1.capexStores + Q1.capexPlant}`, '', `Capex: stores ₹${Q1.capexStores} cr, plant (Hyderabad-led) ₹${Q1.capexPlant} cr; net cash ₹${n0(Q1.netCash)} cr at Jun-2026`],
    ], source: `${L1}; Screener.in` } },
    { bullets: C.guidance.map(g => `**${g.item}:** ${g.text}.`) },
    { callout: '**What we take from it:** a clean beat on margins, led by International (pre-IndAS margin 10.6% vs 4.5%) and product margin above 70%, with India growth still ~30%. The soft spots: India SSSG has come down from 24% to 18% in two quarters, and management is asking investors not to extrapolate any single quarter. Guidance is about volumes (~25%) and stores (~600), not profits.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Clean audit; three adjustments: proforma vs reported, rent outside EBITDA, and a one-off in FY25',
  blocks: [
    { bullets: [
      '**Two sets of numbers.** The letters quote "proforma" growth (Dealskart, GeoIQ and Meller consolidated in the base year); the audited accounts are "reported". From Q3FY26 the two are identical, but FY26 growth rates differ (Q1FY27 revenue +33.6% proforma, +43.3% reported). We use reported figures in the model and say when we quote proforma.',
      `**EBITDA excludes rent.** Ind AS 116 moves rent into depreciation (right-of-use ₹704 cr) and interest (₹163 cr) and the cash into financing (lease principal ₹620 cr). Operating cash flow (₹${n0(FY26.cfo)} cr) therefore overstates cash earnings; we treat lease principal as capex in the forecasts.`,
      '**FY25 one-off.** FY25 other income includes a ₹167 cr non-cash gain on the Owndays deferred consideration; FY26 includes ₹19 cr of liabilities written back and a call-option gain, and a ₹16 cr exceptional loss (investment impairment, IPO costs). Our forecasts carry none of these.',
      '**Minorities.** ₹7.3 cr of FY26 profit and ~₹6-7 cr in Q1FY27 belong to minority partners; we use profit after minorities (LENSKART.patch.js) and load ~1.5 points onto the tax rate in forecasts.',
      `**ESOP cost is small** (₹${FY26.esop} cr in FY26) because most options were granted before the IPO; grants at listed-market prices would raise it. We deduct ₹{{as.esop.0|num}}-{{as.esop.2|num}} cr a year.`,
      '**Goodwill** (₹2,198 cr) and brands (₹980 cr) from Owndays and Meller are tested for impairment yearly; no impairment of goodwill in FY26.',
    ] },
    { callout: '**Accounting flag: GREEN-AMBER (we show AMBER).** S.R. Batliboi (EY) audits the accounts and we found nothing improper. The amber reflects the short like-for-like history, the proforma presentation in the letters and a headline EBITDA that excludes the largest store cost.' },
  ],
};

const OH = D.ownership, J = OH.jun2026;
const ownership = base => ({ ...base, blocks: [
  { p: `At Jun-2026 the founders (promoters) held ${J.promoters}%, foreign institutions ${J.fiis}%, Indian institutions ${J.diis}% and others ${J.public}% (Screener's "public" includes the pre-IPO sovereign and venture holders). ${OH.trend}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest shareholders at 31-Mar-2026 (latest named list)', head: ['Holder', '% of shares'], rows: C.shareholders.top.map(([h, v]) => [h, n2(v)]), source: `${C.shareholders.src}. KKR (Birdseye View Holdings) held 1.92%. The Jun-2026 pattern by name was not available to us; category totals are from Screener.in.` } },
  { callout: `**Our read:** ${OH.read}` },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Founder-run, professionally audited; the founders own only ~17.5%',
  blocks: [
    { p: `Management: ${C.management.ceo}; ${C.management.executives}; CFO ${C.management.cfo}; Company Secretary ${C.management.cs}. Auditor: ${C.management.auditor}. The four promoters (Peyush Bansal, Neha Bansal, Amit Chaudhary, Sumeet Kapahi) held ~17.5% after the IPO; the rest is spread across sovereign, venture and mutual funds.` },
    { verdicts: D.governance.scorecard, head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; shareholders\' letters; exchange filings; GAM Research' },
    { callout: `**Overall:** ${D.governance.verdict}` },
  ],
};

const medE = y => medOf(withEps.map(s => s.eps[y]).filter(v => v));
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n2}} / ₹{{F.eps.1|n2}} / ₹{{F.eps.2|n2}} for FY27-29E',
  blocks: [
    { p: `India revenue +{{as.segments.0.growth.0|pct0}} / +{{as.segments.0.growth.1|pct0}} / +{{as.segments.0.growth.2|pct0}} and International +{{as.segments.1.growth.0|pct0}} / +{{as.segments.1.growth.1|pct0}} / +{{as.segments.1.growth.2|pct0}}: consolidated revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}}. EBITDA margin (after Ind AS 116) {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}; capex including lease principal ₹{{as.capex.0|num}} / {{as.capex.1|num}} / {{as.capex.2|num}} cr (Hyderabad peaks in FY27E); depreciation {{as.depRateOnGrossBlock|n1}}% of gross block; other income 6.5% on net cash plus ₹{{as.otherIncome.0|num}} cr (income on the cash netted against leases, and recurring items); finance cost ₹{{as.interest.0|num}}-{{as.interest.2|num}} cr (leases); tax {{as.taxRate.0|n1}}% including minorities; no dividend. EPS compounds ~${Math.round(epsCagrFwd)}% a year over FY26-29E from a low base (FY26 ₹${n2(A.eps[b])}).` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (after Ind AS 116)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (forecast incl. lease principal)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    ...(withEps.length ? [
      { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM', ...withEps.map(s => `${s.broker} (${s.date.slice(5, 7)}/${s.date.slice(2, 4)})`)], rows: [
        ['Revenue FY27E (₹ cr)', '{{F.sales.0|num}}', ...withEps.map(s => (s.revenue?.FY27E ? n0(s.revenue.FY27E) : '–'))],
        ['Revenue FY28E (₹ cr)', '{{F.sales.1|num}}', ...withEps.map(s => (s.revenue?.FY28E ? n0(s.revenue.FY28E) : '–'))],
        ['EPS FY27E (₹)', '{{F.eps.0|n2}}', ...withEps.map(s => (s.eps.FY27E ? n2(s.eps.FY27E) : '–'))],
        ['EPS FY28E (₹)', '{{F.eps.1|n2}}', ...withEps.map(s => n2(s.eps.FY28E))],
        { hl: true, cells: ['**GAM vs street median, FY28E EPS**', `**${pc((F.eps[1] / medE('FY28E') - 1) * 100)}**`, ...withEps.map(() => '')] },
      ], source: D.street.estimatesSource } },
      { callout: D.street.estimatesComment },
    ] : []),
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
