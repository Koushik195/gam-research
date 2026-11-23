// Samvardhana Motherson report, part 3: the divisions (wiring harness, modules & polymers, vision + integrated
// assemblies, emerging businesses) with our forecasts, and the moat scorecard.
const X = require('./MOTHERSON.ctx');
const { C, D, SG, SQ, QL, SA, F, AS, n0, n1, pc, segRev, segE, segM, yr } = X;
const rup = t => String(t).replace(/Rs ?/g, '₹');
const segAS0 = k => AS.segments.find(s => s.key === k), segAS = k => { const o = segAS0(k); return { ...o, _why: rup(o._why), _marginWhy: rup(o._marginWhy) }; };
const fy = ['FY23', 'FY24', 'FY25', 'FY26'];
const histM = (k, f) => fy.map(l => { const a = yr(l); return a[k + 'Rev'] ? Math.round(a[k + 'Ebitda'] / a[k + 'Rev'] * 1000) / 10 : null; });
const yoy = (k, i) => (i >= 4 ? Math.round((SQ[i][k + 'Rev'] / SQ[i - 4][k + 'Rev'] - 1) * 1000) / 10 : null);
const qM = k => SQ.map(q => Math.round(q[k + 'Ebitda'] / q[k + 'Rev'] * 1000) / 10);
const fcRows = k => [
  ['Revenue (₹ cr)', ...fy.map(l => (yr(l)[k + 'Rev'] ? n0(yr(l)[k + 'Rev']) : '–')), ...segRev(k).map(n0)],
  ['growth', '–', ...fy.slice(1).map((l, i) => (yr(l)[k + 'Rev'] && yr(fy[i])[k + 'Rev'] ? pc((yr(l)[k + 'Rev'] / yr(fy[i])[k + 'Rev'] - 1) * 100) : '–')), ...segAS(k).growth.map(g => pc(g))],
  ['EBITDA (₹ cr)', ...fy.map(l => (yr(l)[k + 'Ebitda'] != null ? n0(yr(l)[k + 'Ebitda']) : '–')), ...segE(k).map(n0)],
  { hl: true, cells: ['**EBITDA margin**', ...histM(k).map(v => (v == null ? '–' : `**${n1(v)}%**`)), ...F.years.map((_, i) => `**${n1(segM(k, i))}%**`)] },
];
const HEAD = ['', ...fy, ...F.years];
const qpair = (k, nm, lo, hi) => ({ pair: [
  { type: 'column', title: `${nm}: quarterly revenue`, unit: '₹ crore (incl. 100% of JVs)', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q[k + 'Rev']), fmt: 'num' }], labels: 'ends', source: 'SAMIL presentations' },
  { type: 'line', title: `${nm}: EBITDA margin by quarter`, unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'Margin', values: qM(k), fmt: 'pct' }], labels: 'all', min: lo, max: hi, source: 'SAMIL presentations' },
] });

const wh = {
  id: 'wiring', nav: 'Wiring Harness', kicker: 'Division 1', title: `Wiring Harness: +31% in Q1FY27 on India, US trucks and copper; Nexans adds ~₹8,200 cr a year`,
  blocks: [
    { p: `Wiring harnesses are 25% of group revenue and the best-run division: ₹36,508 cr in FY26 at a 10.8% EBITDA margin (11.8% in FY25). It combines India (38% of Q1FY27 revenue, mostly through the 33.43%-owned MSWIL and the Kyungshin JV for Hyundai-Kia), PKC's truck harnesses in North America (29%) and Europe (17%), and China (9%). Copper is passed through to customers with a 3-6 month lag, so a copper spike first inflates revenue and dents the margin ("denominator effect"), then the margin recovers. Q1FY27 revenue rose ${pc(yoy('wh', 8))} with the margin at 11.1% despite copper +40%. From 3-Jul-2026 the division includes **Nexans Autoelectric** (EUR749 mn revenue and a 6.4% EBITDA margin in CY2024; ~13,000 people in 22 plants), bought for EUR207 mn, ~4x EBITDA.` },
    qpair('wh', 'Wiring Harness', 8, 14),
    { exhibit: { type: 'table', title: 'Wiring Harness: history and our forecast', head: HEAD, rows: fcRows('wh'), source: 'SAMIL presentations; GAM estimates. FY27E includes ~₹6,000 cr from Nexans (9 months).' } },
    { callout: `**Our assumptions:** ${segAS('wh')._why} ${segAS('wh')._marginWhy}` },
  ],
};

const mpp = {
  id: 'mpp', nav: 'Modules & Polymers', kicker: 'Division 2', title: 'Modules & Polymer Products: half the business, made mostly in Europe, margin 6-9%',
  blocks: [
    { p: `MPP (bumpers, door and instrument panels, sunroofs; the old SMP, SMRC and Yachiyo) earned ₹62,894 cr in FY26, 42% of divisional revenue, at an 8.1% EBITDA margin. 57% of it is made in Europe. Q1FY27 revenue rose ${pc(yoy('mpp', 8))} in rupees, but the euro was ~13% stronger than a year earlier: in euros the division shrank. The margin improved 50bp to 6.9% because European plants were merged and headcount cut ("breathe with the market"; ₹379 cr of exceptional costs in FY26). Polymer prices in Germany rose 55% in a year after the Middle East conflict; recoveries from customers are settled mostly in Q4, which is why the margin was 9.4% and 9.2% in Q3 and Q4 of FY26 against 6.4-6.9% in the two June quarters.` },
    qpair('mpp', 'Modules & Polymer Products', 4, 11),
    { exhibit: { type: 'table', title: 'Modules & Polymer Products: history and our forecast', head: HEAD, rows: fcRows('mpp'), source: 'SAMIL presentations; GAM estimates' } },
    { callout: `**Our assumptions:** ${segAS('mpp')._why} ${segAS('mpp')._marginWhy} **Each 1pp of MPP margin is worth ~₹${n0(segRev('mpp')[1] * 0.01)} cr of FY28E EBITDA, ~${n0(segRev('mpp')[1] * 0.01 * 0.71 / F.pat[1] * 100)}% of our EPS.**` },
  ],
};

const vsia = {
  id: 'vision', nav: 'Vision & Assemblies', kicker: 'Divisions 3 and 4', title: 'Vision Systems and Integrated Assemblies: steady, mid-single-digit growth in local currency',
  blocks: [
    { p: `**Vision Systems** (SMR mirrors and camera-monitoring systems; JV Ningbo SMR Huaxiang in China) made ₹21,001 cr in FY26 at 9.7% (10.3% in FY24). Q1FY27: ${pc(yoy('vs', 8))}, margin 9.2% (seasonal). Shenzhen Autocruis (digital mirrors, driver monitoring; USD6.8 mn revenue) adds technology for India's coming driver-monitoring rules. **Integrated Assemblies** (SAS, bought in 2023) assembles cockpits and front-ends inside or next to customers' plants, mostly in Europe (62%) and North America (27%); ₹11,035 cr of net revenue at 13.6% in FY26; Q1FY27 ${pc(yoy('ia', 8))} with "near-term demand headwinds" at its main customers but a full launch calendar in FY27.` },
    { pair: [
      { type: 'line', title: 'Vision Systems margin: 9-12%', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'Vision', values: qM('vs'), fmt: 'pct' }], labels: 'all', min: 6, max: 14, source: 'SAMIL presentations' },
      { type: 'line', title: 'Integrated Assemblies margin: 10-16% on net revenue', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'Integrated Assemblies', values: qM('ia'), fmt: 'pct' }], labels: 'all', min: 6, max: 18, source: 'SAMIL presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Vision Systems: history and our forecast', head: HEAD, rows: fcRows('vs'), source: 'SAMIL presentations; GAM estimates' } },
    { exhibit: { type: 'table', title: 'Integrated Assemblies: history and our forecast', head: HEAD, rows: fcRows('ia'), source: 'SAMIL presentations; GAM estimates. FY24: from the Nov-2023 acquisition; margin before customer forex compensation (normalised 8.7%).' } },
  ],
};

const EBv = SG.emergingFY;
const eb = {
  id: 'emerging', nav: 'Emerging Businesses', kicker: 'Division 5', title: 'Emerging Businesses: +50% in FY26, consumer-electronics glass and Yutaka Giken make it the growth engine',
  blocks: [
    { p: `Emerging Businesses grew from ₹6,844 cr (FY23) to ₹17,072 cr (FY26) and +30% in Q1FY27, but the margin fell from 13.5% (FY24) to 10.7% (FY26) and 8.4% in Q1FY27 as new plants started up and health & medical lost money. The headline is **consumer electronics**: a JV (SAMIL 90%, the partner 10% with an option to 49%) making precision glass parts for a customer management will not name. Revenue grew 7.5x in FY26 to ~₹1,300 cr at ~8% EBITDA; a third, much larger plant (40 mn units a year at full scale; "the size of thirty-three football fields") is to be commissioned in Q3FY27, inside a ~₹7,500 cr programme of which a third is spent. From Q2FY27 the division also houses **Yutaka Giken** (81%; Honda keeps 19%): exhaust systems, brake discs, drive systems and e-motor parts with JPY179 bn (~₹10,600 cr) of annual sales, taking the division to ~₹38,000 cr in FY28E.` },
    { exhibit: { type: 'table', title: EBv.note, head: EBv.head, rows: EBv.rows.map(r => [r[0], n0(r[1]), n0(r[2]), n0(r[3]), n0(r[4])]), source: 'Q4FY26 presentation slide 29' } },
    { exhibit: { type: 'table', title: 'Emerging Businesses: history and our forecast', head: HEAD, rows: fcRows('eb'), source: 'SAMIL presentations; GAM estimates. FY27E includes ~₹7,350 cr from Yutaka Giken (from 21-Jul-2026).' } },
    { callout: `**Our assumptions:** ${segAS('eb')._why} ${segAS('eb')._marginWhy} **The honest caveat:** ~₹5,000 cr of capex is still to go into a single-customer consumer-electronics programme whose revenue, pricing and contract length are not disclosed. Management asks for "another couple of quarters" of patience; we give it no value beyond the earnings in our forecast.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real scale and customer trust, but no pricing power',
  blocks: [
    { verdicts: D.moat, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls, broker notes to Sep-2026)' },
    { callout: '**Honest verdict:** SAMIL has an advantage, not a moat in the Buffett sense. Its breadth, low-cost footprint and record of rescuing suppliers make it the first call when a European car maker needs help, and that brings growth no rival in India can match. But customers keep the pricing power: commodity costs are passed on late, annual price-downs are normal, and a decade of 7-10% EBITDA margins and 13-16% ROCE says the advantage earns roughly the cost of capital. It is a **volume and access advantage**, not a returns advantage.' },
  ],
};

module.exports = { wh, mpp, vsia, eb, moat };
