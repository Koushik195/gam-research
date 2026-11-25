// Natco Pharma report, part 4: Crop Health Sciences, API / plants / innovation bets, competitive-advantage scorecard.
const X = require('./NATCOPHARM.ctx2');
const { C, D, SA, F, BL, FY26, Q1, n0, n1 } = X;
const chsRows = SA.filter(a => a.chs > 0);

const chs = {
  id: 'crop-health', nav: 'Crop Health Sciences', kicker: 'Agrochemicals', title: 'Crop Health Sciences: ₹138 cr of sales after six years, a CTPR price war behind it, a demerger ahead',
  blocks: [
    { p: `${C.chs.text}` },
    { pair: [
      { type: 'column', title: 'Crop Health revenue: up, down, up', unit: 'Crop Health Sciences revenue (₹ crore)', x: chsRows.map(a => a.fy), series: [{ name: 'CHS revenue', values: chsRows.map(a => a.chs), fmt: 'num' }], labels: 'all', source: 'AR FY24 segment table; Q1FY27 presentation' },
      { type: 'column', title: 'Our CHS forecast: breakeven-ish growth', unit: '₹ crore (FY26 actual; GAM estimates)', x: ['FY26', ...F.years], series: [{ name: 'CHS revenue', values: [FY26.segments.chs, ...BL.chs], fmt: 'num' }], labels: 'all', source: 'GAM estimates' },
    ] },
    { p: '**Chlorantraniliprole (CTPR)** is a broad-spectrum insecticide. Natco launched CTPR products in India in 2022 using the same techno-legal approach as in pharma, and CHS sales jumped to ₹108 cr in FY24, then fell to ₹60 cr in FY25 (the CHS head calls those years "mostly learning in terms of how the market works"). The recovery to ₹138 cr in FY26 came from new products (the fungicide Glanz, cyantraniliprole) and more distributors: CTPR is now only ~30-35% of CHS sales. Q1FY27 (₹41 cr) still made an EBITDA loss because rains came late; the second quarter (kharif) is the biggest. Raw materials rose 25-30% after the West Asia war.' },
    { callout: '**So what:** CHS is ~4% of revenue and around breakeven, so it does not move the valuation either way. The demerger (shareholders get shares in Natco Crop Health Sciences Ltd; timing moved to ~Mar-2027) is value-neutral for a Natco shareholder; we keep CHS in the consolidated forecasts until it happens and do not assign it a separate value.' },
  ],
};

const plants = {
  id: 'plants-rnd', nav: 'Plants, API & innovation', kicker: 'Manufacturing, API and long shots', title: 'Plants are clean again (Kothur warning letter closed in Sep-2025); the API arm is small; the innovation bets are lottery tickets',
  blocks: [
    { exhibit: { type: 'table', title: 'USFDA status of the four US-approved plants (30-Sep-2026)', head: ['Plant', 'Makes', 'Status', 'So what'], wide: [2], rows: [
      ['Kothur, Telangana', 'Oral and injectable formulations incl. cytotoxics (the main US plant)', 'Warning letter dated 8-Apr-2024 (Oct-2023 inspection); reinspected Jun-2025; FDA close-out letter 25-Sep-2025', 'US approvals from Kothur can flow again; management expects "a lot more approvals"'],
      ['Visakhapatnam, Andhra Pradesh', 'Oral solids', 'Last inspected ~2.5-3 years ago; inspection due "sometime this year"', 'The one open item; a bad outcome would delay launches'],
      ['Mekaguda, Telangana', 'APIs (incl. high-potency, peptides)', 'Inspected in 2025; cleared, EIR received', 'Clean'],
      ['Chennai, Tamil Nadu', 'Cytotoxic APIs', 'Inspected in 2025; observations "procedural"; EIR received', 'Clean'],
    ], source: 'FDA warning letter 320-24-32 (8-Apr-2024) and close-out letter (25-Sep-2025); Q3FY26 and Q4FY26 calls; AR FY26 (manufactured capital: "All the observations were addressed")' } },
    { p: `**API.** ₹${n0(FY26.segments.api)} cr of third-party API sales in FY26 (₹${n0(Q1.api)} cr in Q1FY27), down from ₹512 cr in FY21: the business mainly supplies Natco's own formulations and 45 active US drug master files. It is strategic (backward integration for oncology and peptide products) rather than a profit driver.` },
    { p: `**Innovation bets.** ${C.innovation.text} The CEO calls eGenesis "the most exciting one" and "a binary event": the US$8 mn stake (₹72.5 cr in the books) could be worth much more if pig-kidney transplants work, or nothing. We put no value on any of these beyond book value inside net cash.` },
    { callout: '**So what:** the regulatory overhang that hung over Natco in 2024-25 is gone, which matters for the FY28 launches. The risk now is the Visakhapatnam inspection and the next Kothur inspection (Visakhapatnam has gone ~3 years without one; Kothur was last inspected in Jun-2025).' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real skill in picking patent fights, but no durable moat',
  blocks: [
    { verdicts: D.moat.rows.map(([area, score, evidence]) => [area, score, evidence, { Strong: 'An edge, but each win decays', Weak: 'No advantage', Moderate: 'Some advantage', Building: 'Promising, unproven', Mixed: 'Neutral now' }[score] || '']), head: ['Area', 'Score', 'Evidence', 'So what'], title: 'Competitive-advantage scorecard', source: 'Company calls and filings; GAM Research' },
    { callout: `**Verdict:** ${D.moat.verdict} We would not pay a premium multiple for the base business on moat grounds.` },
  ],
};

module.exports = { chs, plants, moat };
