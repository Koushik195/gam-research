// Hero MotoCorp report, part B: cover, story in charts, and the merger of part2-4b (business, history, industry,
// tailwind test, segments, moat, Q1FY27, earnings quality, stakes, ownership, governance, forecasts, street,
// valuation, verdict, glossary, statement notes). Shared inputs in HEROMOTOCO.ctx.js. Forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./HEROMOTOCO.ctx');
const { F, V, A, n0, n1, pc, SQ, QL, SG, price, mv, epsSep28, coreMult, stakePs, priceExStakes, medCore, sectorDr, rating, core, CMP, fwdCore, medTp, postQ1, b } = X;
const P2 = require('./HEROMOTOCO.part2'), P2b = require('./HEROMOTOCO.part2b'), P3 = require('./HEROMOTOCO.part3'), P3b = require('./HEROMOTOCO.part3b'), P4 = require('./HEROMOTOCO.part4');

const cover = {
  headline: 'You pay for the core and get the stakes free: a cheap, cash-rich leader whose home market is shrinking',
  lead: `Hero MotoCorp is the world's largest two-wheeler maker (64.69 lakh units in FY26) and owns India's 100-110cc motorcycle market (~96% of it). That segment is losing ground: commuter motorcycles fell from 42% to 32% of industry volume in five years and Hero's overall share from 31% to 23%. The GST cut of Sep-2025 and fast gains in scooters, 125cc and VIDA electric scooters lifted Q1FY27 volume 23% and revenue 36%, but August dispatches rose only 2.7%, commodity costs cut the margin to 13.3% and the 2026 monsoon ended ~13% short. Hero also owns ~32% of Ather Energy (worth ~₹${n0(core.v.atherGross)} cr at the 30-Sep close) and 40% of Hero FinCorp. The street values it on **P/E on FY28E core EPS (16-18x) plus the stakes**. We do the same: **${coreMult}x Sep-28E EPS of ₹${n1(epsSep28)} (₹${n0(core.coreValue)}) plus ₹${n0(stakePs)} a share for the stakes** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** Cross-checks: EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The core is priced like a business in decline', p: `Take out the stakes (₹${n0(stakePs)} a share after a 20% discount) and ₹${n0(price)} buys the core at ${n1(priceExStakes / F.eps[1])}x our FY28E EPS, against a ${n1(medCore)}x median forward multiple since 2021 on the same basis. Our ${coreMult}x already includes the ${Math.abs(Math.round(sectorDr))}% de-rating of auto stocks.` },
    { h: 'The franchise is not broken', p: `Record share in 100-110cc (96%), 125cc back to 18%, ICE scooters doubled to 7%, VIDA ~11% of e-scooters, parts +30% in Q1FY27, exports up 39% in FY26. 35% ROCE, negative working capital and a 70% payout (~4% yield at our FY28E DPS).` },
    { h: 'But growth is modest and fragile', p: `We forecast volume +{{as.volume.growth.0|n1}}% in FY27E and ~5% a year after; EPS ~${Math.round(X.epsCagrFwd)}% a year to FY29E. H2FY27 laps the post-GST surge, the monsoon was the weakest since 2015 and TVS out-sold Hero in August. The EV shift erodes the 100cc moat over time.` },
    { h: 'Ather is a big, volatile part of the value', p: `Ather is ~₹${n0(core.v.ather / F.shares)} a share of our target (${Math.round(core.v.ather / F.shares / V.tp * 100)}%) after a 20% discount; at ~15x trailing sales it can move 30% either way. Every ₹100 on Ather's price is ~₹${n0(12.7e7 * 100 * 0.8 / 1e7 / F.shares)} on our target. Hero FinCorp (₹${n0(core.v.hfcl / F.shares)}) made a loss in FY26.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Festive season (Navratri to Diwali falls in Oct-Nov 2026, later than 2025) and Q2FY27 results (due by mid-November 2026): whether retail holds up after a weak monsoon, and the margin after Q2\'s "marginal uptick" in input costs.',
    'Monthly dispatches: August was +2.7% with exports -24.5%; motorcycles need to grow again against the post-GST base from October.',
    'VIDA: capacity from ~30k to ~45k a month by Q4FY27, PLI on 100% of the range by Dec-2026, EBITDA-breakeven ambition by year-end.',
    'Premium launches over the next 12 months (new premium business head from Aug-2026); Harley-Davidson range.',
    'Ather: share price, conversion of the 76.19 lakh warrants (₹720 cr due within 18 months) and its own results; Hero FinCorp IPO, which SEBI approved in 2025 but which had not launched by Sep-2026.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const shareQ = ['FY22', 'FY23', 'FY24', ...QL];
const domShare = [...SG.annual.filter(a => ['FY22', 'FY23', 'FY24'].includes(a.fy)).map(a => a.shareDomPct), ...SQ.map(q => q.shareDomPct)];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'line', title: 'Commuter motorcycles: from 42% to 32% of the market', unit: 'Share of industry two-wheeler volume, domestic + exports (%)', x: SG.industryMix.periods, series: [{ name: 'Commuter motorcycles', values: SG.industryMix.commuterMcPct, fmt: 'pct' }, { name: 'Scooters (ICE + EV)', values: SG.industryMix.scooterPct, fmt: 'pct' }, { name: 'Exports', values: SG.industryMix.exportsPct, fmt: 'pct' }], labels: 'all', source: SG.industryMix.src },
      { type: 'line', title: 'Hero\'s domestic share: 34% to 27%, steady for two years', unit: 'Domestic two-wheeler market share, SIAM wholesale (%)', x: shareQ, series: [{ name: 'Domestic share', values: domShare, fmt: 'pct' }], labels: 'all', min: 20, max: 36, source: 'SIAM via Emkay Research (9-Aug-2026)' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 share: dominant in commuters, small where the market grows', unit: 'Hero share of each domestic segment, Q1FY27 (%)', x: ['100-110cc (Splendor, Passion)', 'Entry 100cc (HF Deluxe)', '125cc', 'Electric scooters', 'ICE scooters', 'Exports (share of Indian exports)', 'Premium >125cc'], series: [{ name: 'Share', values: [96.4, 55.4, 17.7, 11.1, 6.9, 6.8, 1.5], fmt: 'pct' }], labels: 'all', source: 'SIAM via Emkay Research' },
      { type: 'column', title: 'Volume: +23% in Q1FY27 after the GST cut', unit: "Dispatches per quarter ('000 units)", x: QL, series: [{ name: 'Units', values: SQ.map(q => Math.round(q.units / 1000)), fmt: 'num' }], labels: 'all', source: 'Company; Emkay Research' },
    ] },
    { pair: [
      { type: 'line', title: 'ICE margin ~16-17%; VIDA costs 2-2.6 points', unit: 'Standalone EBITDA margin (%)', x: QL, series: [{ name: 'ICE business', values: SQ.map(q => q.iceMarginPct), fmt: 'pct' }, { name: 'Reported (after VIDA)', values: SQ.map(q => q.saMarginPct), fmt: 'pct' }], labels: 'all', min: 12, max: 19, source: 'Company calls; Emkay Research' },
      { type: 'line', title: 'E-scooter retail: VIDA ~11%, behind TVS, Bajaj and Ather', unit: "Monthly VAHAN registrations ('000)", x: SG.evRetail.months, series: [{ name: 'TVS', values: SG.evRetail.tvs.map(v => Math.round(v / 100) / 10), fmt: 'n1' }, { name: 'Bajaj', values: SG.evRetail.bajaj.map(v => Math.round(v / 100) / 10), fmt: 'n1' }, { name: 'Ather', values: SG.evRetail.ather.map(v => Math.round(v / 100) / 10), fmt: 'n1' }, { name: 'Hero VIDA', values: SG.evRetail.hero.map(v => Math.round(v / 100) / 10), fmt: 'n1' }], labels: 'last', source: SG.evRetail.src },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E on core EPS: ${n1(medCore)}x median since 2021`, unit: 'Price ÷ next full-year EPS before associates and one-offs (x)', x: fwdCore.map(x => x[0]), series: [{ name: 'Forward P/E (core)', values: fwdCore.map(x => Math.round(x[1] * 10) / 10), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(medCore * 10) / 10, text: `Median ${n1(medCore)}x` }, { v: coreMult, text: `Our core multiple ${coreMult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company EPS adjusted by GAM; GAM estimates FY27-28E' },
      { type: 'hbar', title: `Target {{dcf.tp|inr}}: core ₹${n0(core.coreValue)} + stakes ₹${n0(stakePs)}`, unit: `₹ per share; CMP ₹${n0(price)}`, x: [`Core business (${coreMult}x Sep-28E EPS)`, 'Ather Energy (market less 20%)', 'Hero FinCorp (1.0x book less 20%)', 'Euler and other holdings (book)', 'GAM target', 'Street median (Aug-26)'], series: [{ name: 'Value', values: [Math.round(core.coreValue), Math.round(core.v.ather / F.shares), Math.round(core.v.hfcl / F.shares), Math.round(core.v.others / F.shares), V.tp, medTp], fmt: 'inr' }], labels: 'all', highlight: 'GAM target', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'GAM Research; broker notes (7-11 Aug 2026)' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P2b.core, P2b.scooters, P2b.growth, P3.moat, p.financials, P3.guidance, p.capital, P3.quality, P3b.stakes, p.balance, P3.ownership(p.ownershipBase), P3.governance, P3b.forecasts, P4.street, P4.valuation, P4.risks, p.statements, P4.glossary],
  statementNotes: P4.statementNotes,
};
