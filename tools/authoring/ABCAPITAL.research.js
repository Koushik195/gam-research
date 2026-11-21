// Aditya Birla Capital report, part B: cover, the story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, NBFC chapters, HFC, AMC, life, health, group returns, moat, Q1FY27 and guidance, earnings
// quality, ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in
// ABCAPITAL.ctx.js / ctx2 / ctx3. Forecast and valuation figures are live tokens where the engine has them. As of 30-Sep-2026.
const X = require('./ABCAPITAL.ctx3');
const { F, V, SB, SOTP, n0, n1, pc, pc1, price, rating, ST, CONS, discNow, discMedRecent, discMedAll, discMin, discMax, discHist, cPbChart, CPB, cFwdPbNow, S, part, nbfcDerived, SG, C } = X;
const P2 = require('./ABCAPITAL.part2'), P3 = require('./ABCAPITAL.part3'), P4 = require('./ABCAPITAL.part4'), P5 = require('./ABCAPITAL.part5'), P6 = require('./ABCAPITAL.part6');

const cover = {
  headline: 'A better-run financial conglomerate, but the discount that made it cheap has mostly closed',
  lead: `Aditya Birla Capital (ABCL) is the Birla group's financial-services arm: since April 2025 it is itself a ₹1.67 lakh crore NBFC (ROA 2.4%, Stage 3 1.3%), and it owns 86% of a fast-growing housing-finance company, 51% of a life insurer (with Sun Life), 45% of the listed Aditya Birla Sun Life AMC and 46% of a health insurer. Q1FY27 was strong: group profit +40% to ₹1,175 cr, NBFC AUM +28%, housing loans +50%, life-insurance margin doubled to 15%. The street values ABCL on a **sum of the parts** (₹390-500, all Buy). We do the same: NBFC ${S.nbfc.multiple.base}x Sep-28E book, HFC ${S.hfc.multiple.base}x, the AMC stake at market, the life insurer ${S.life.multiple.base}x embedded value and the health insurer ${S.health.multiple.base}x premium give ₹${n0(SB.grossPs)} a share before any discount. Since 2022 ABCL has traded anywhere between a ${n0(-discMin)}% premium and a ${n0(discMax)}% discount to that look-through value (median ${n0(discMedRecent)}% over the last two years, ~${n0(discNow.disc)}% today). Applying the two-year median gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}**. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The NBFC has become a good lender', p: `AUM grew 27% in FY26 and 28% in Q1FY27 with credit cost down to ~1.0% of the book, Stage 2+3 down 127bp in a year to 2.43% and ROA up to 2.39%. The June ₹4,000 cr raise (promoters ₹3,080 cr, IFC ₹920 cr) funds three years of growth. We model AUM +{{F.aumGrowth.0|pct}} / +{{F.aumGrowth.1|pct}} / +{{F.aumGrowth.2|pct}}. What has not come is margin: NIM incl. fees 6.22% (FY25) → 6.07% (Q1FY27).` },
    { h: 'The rest of the group is improving from a low base', p: `Housing finance: ROA 2.1%, AUM +50%, Advent paid 2.2x post-money book for 14% in April. Life insurance: VNB margin 7.5% → 15.1% YoY, target >20%. Health insurance: profitable under IFRS in Q1 but still a 106% combined ratio. The AMC (${n1(part('amc').perShare / SB.grossPs * 100)}% of our gross value) grows slowly and keeps losing equity share.` },
    { h: 'Returns are still the catch', p: `Our consolidated rebuild gives ROE of ${n1(CONS[0].roe)}% / ${n1(CONS[1].roe)}% / ${n1(CONS[2].roe)}% for FY27-29E against a ${n1(V.ke)}% cost of equity; standalone ROE is ~{{F.roe.0|pct}} because ₹9,000 cr sits in subsidiaries at cost. Equity was raised in FY24 and again in June 2026, and partners own 49-54% of the insurers.` },
    { h: 'Valuation: the re-rating has happened', p: `At ₹${n0(price)} the stock trades at ${n1(cFwdPbNow)}x our FY28E consolidated book against a ${n1(CPB.med)}x median forward P/B since 2021, and the holding discount has narrowed from ~${n0(discMedAll)}% (median since 2022) to ~${n0(discNow.disc)}%. If the discount stayed at today's ~${n0(discNow.disc)}%, our value would be ~₹${n0(Math.round(SB.grossPs * (1 - discNow.disc / 100) / 10) * 10)}; at the two-year median it is {{dcf.tp|inr}}, a ${rating}. The street's ₹390-500 mostly assumes no discount or a small one.` },
  ],
  keyRows: [['NBFC AUM (₹ cr)', 'aum', 'num'], ['AUM growth', 'aumGrowth', 'chg'], ['Standalone NII (₹ cr)', 'nii', 'num'], ['NIM (on AUM)', 'nim', 'pct'], ['Credit cost', 'creditCost', 'pct'], ['Standalone PAT (₹ cr)', 'pat', 'num'], ['Standalone EPS (₹)', 'eps', 'n2'], ['Standalone BVPS (₹)', 'bvps', 'n1'], ['ROA (standalone)', 'roa', 'pct'], ['ROE (standalone)', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Capital & dilution', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): first quarter with the full benefit of the June raise; gold loans go live; management expects NBFC margins to rise "in a few more quarters".',
    'IRDAI\'s insurance-distribution reforms (consultation of 23-Sep-2026, comments due 25-Oct-2026): caps of ~2-5% on loan-linked commission would hit NBFC fee income and change ABSLI\'s credit-life economics.',
    'RBI\'s October 2026 policy: most economists polled expected a 25bp repo hike; ~30% of ABCL\'s borrowings are floating.',
    'Housing finance: ₹1 lakh crore AUM targeted in 6-10 quarters and ROE back to ~13% by Q4FY27 after the Advent dilution.',
    'Health insurance: management aims for a 100% combined ratio (IFRS) in FY27, from 106% in Q1.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const nbfcHist = [48689, 55180, 80556, 105639, 126351, 159916];
const mixQ = SG.mix.find(m => m.q === 'Jun-26'), mixKeys = SG.lines.map(l => l.key), mixName = Object.fromEntries(SG.lines.map(l => [l.key, l.name]));
const seg26 = SG.segPbt.FY26;
const discChart = [...discHist.map(r => [r.d, Math.round(r.disc * 10) / 10]), ['2026-09-30', Math.round(discNow.disc * 10) / 10]];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'NBFC AUM: ₹0.49 to ₹1.60 lakh crore in five years', unit: 'NBFC AUM at March (₹ \'000 crore); FY27-29E = GAM', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'AUM', values: [...nbfcHist, ...F.aum].map(v => Math.round(v / 100) / 10), fmt: 'n1' }], labels: 'all', highlight: 'FY26', source: 'Q4FY21-Q4FY26 presentations; GAM estimates' },
      { type: 'hbar', title: 'Secured MSME loans are almost half the NBFC book', unit: 'Share of NBFC AUM, Jun-2026 (%)', x: mixKeys.map(k => mixName[k]), series: [{ name: 'Share', values: mixKeys.map(k => Math.round(mixQ[k] / mixQ.total * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p19' },
    ] },
    { pair: [
      { type: 'hbar', title: 'FY26 pre-tax profit by business: lending is two-thirds', unit: 'Segment PBT at 100% of each business, FY26 (₹ crore)', x: ['NBFC', 'Housing finance', 'AMC', 'Life insurance', 'Health insurance', 'Others (digital, broking, ARC, costs)'], series: [{ name: 'PBT', values: [seg26.lending, seg26.hfc, seg26.amc, seg26.life, seg26.health, seg26.others], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p6' },
      { type: 'hbar', title: `Our sum of the parts: ₹${n0(SB.grossPs)} gross, {{dcf.tp|inr}} after the discount`, unit: '₹ per share (base case)', x: [...SB.parts.map(p => p.name), 'Holding discount', 'Value per share'], series: [{ name: '₹ / share', values: [...SB.parts.map(p => Math.round(p.perShare)), -Math.round(SB.discValue / X.sharesNow), Math.round(SB.perShare)], fmt: 'num' }], labels: 'all', highlight: 'Value per share', source: 'GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `ABCL's discount to look-through value: ${n0(discNow.disc)}% now, ${n0(discMedRecent)}% two-year median`, unit: '1 − market value ÷ look-through value at our base multiples (%), quarter-ends', x: discChart.map(x => x[0]), series: [{ name: 'Discount', values: discChart.map(x => x[1]), fmt: 'pct' }], labels: 'last', lines: [{ v: discMedRecent, text: `Two-year median ${n0(discMedRecent)}%`, color: '#cf8f1f' }, { v: discMedAll, text: `Since Mar-22: ${n0(discMedAll)}%` }], source: 'Screener.in prices; ABCL disclosures; GAM Research' },
      { type: 'line', title: `Group forward P/B: ${n1(cFwdPbNow)}x vs a ${n1(CPB.med)}x median since 2021`, unit: 'Price ÷ next full-year consolidated book value per share (x)', x: cPbChart.map(x => x[0]), series: [{ name: 'Forward P/B', values: cPbChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: CPB.med, text: `Median since Apr-2021: ${n1(CPB.med)}x` }], source: 'Screener.in (consolidated) prices and book; GAM estimates FY27-28E' },
    ] },
    { pair: [
      { type: 'column', title: 'Life insurer: embedded value up 2.4x in five years, margins back above 20%', unit: 'ABSLI embedded value at March (₹ crore)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'EV', values: [6441, 7609, 9014, 11539, 13812, 15447], fmt: 'num' }], labels: 'all', source: 'Q4FY21-Q4FY26 presentations' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Apr-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker.replace(/ \(.*\)/, '')), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and headlines dated 12-Apr to 30-Sep-2026 (see the street chapter), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.franchise, P3.spread, P3.quality, P3.funding, P4.hfc, P4.amc, P4.life, P4.health, P5.groupReturns, p.financials, P5.moat, P5.guidance, P5.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P6.forecasts, P6.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
