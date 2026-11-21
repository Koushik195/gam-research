// Shriram Finance report, part B: cover, story in charts, and the merger of part2-6 (business, history,
// industry, tailwind test, franchise and AUM mix, spread and NIM, asset quality, funding, capital and MUFG,
// ROA tree, moat, Q1FY27 and guidance, earnings quality, ownership, governance, forecasts, street, valuation,
// verdict, glossary, statement notes). Shared inputs in SHRIRAMFIN.ctx.js. Forecast and valuation figures are
// live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./SHRIRAMFIN.ctx');
const { F, V, A, C, SG, n0, n1, pc, price, pbMult, bvSep28, PB21, PB23, fwdPb, fwdPbNow, fwdPeNow, PE21, rating, ST, Q1, b, mv, roeTw27, epsEx27, bvps26, bvProForma, sectorPbDr, tpAvg } = X;
const P2 = require('./SHRIRAMFIN.part2'), P3 = require('./SHRIRAMFIN.part3'), P4 = require('./SHRIRAMFIN.part4'), P5 = require('./SHRIRAMFIN.part5'), P6 = require('./SHRIRAMFIN.part6');

const cover = {
  headline: 'MUFG made Shriram safer and cheaper to fund, not more profitable per share; at the top of its valuation range, the stock already pays for the upgrade',
  lead: `Shriram Finance is India's largest used-truck financier and, since the 2022 merger, a ₹3.1 lakh crore retail lender (47% commercial vehicles, 22% passenger vehicles, 13% small business, the rest two-wheelers, personal, gold and equipment loans) with 3,225 branches and ~1 crore customers. In April 2026 MUFG Bank paid ₹39,618 cr for 20% in new shares, the ratings went to AAA and Q1FY27 profit rose 60%. The street values it on **P/B (2.1-2.4x FY28E book; all Buy, targets ₹1,200-1,250)**. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E but ROE of only ~13-14%, because the new equity takes five to six years to put to work. Applying **${pbMult}x to Sep-28E book of ₹${n0(bvSep28)}** (its own ${PB21.med}x median forward P/B since 2021, ${PB23.med}x since the merger, less the sector's ${pc(sectorPbDr)} move) gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Every cross-check is also below the price: justified P/B ₹${n0(mv('jpb').value)}, residual income ₹${n0(mv('ri').value)}, P/E ₹${n0(mv('pe').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'MUFG\'s money lowers risk, not EPS', p: `The ₹39,618 cr issue at ₹840.93 lifted book per share from ₹${n0(bvps26)} (Mar-26) to ₹${n0(bvProForma)} pro forma and cut leverage from 3.8x to 2.1x. But it is earning only the interest it saves (~8.6% pre-tax): our FY27E EPS of ₹${n1(F.eps[0])} compares with ~₹${n1(epsEx27)} without the deal, and FY27E ROE drops to ~${n1(roeTw27)}% (time-weighted) from 16-18% before. Management plans to re-lever to ~4.5x only over five to six years.` },
    { h: 'A real franchise in used trucks', p: `Forty-seven years of lending to small truck owners, valuers in every district, the Shriram Automall auction network and 2,042 rural and semi-urban branches give it an edge in lending against used vehicles that is hard to copy. Loan losses have held at ~1.9% of average AUM through FY26 and Q1FY27. AAA ratings bring new borrowing down to 7.77%, which it uses to win back new-vehicle customers.` },
    { h: 'But asset quality and margins are not improving', p: `Gross Stage 3 loans are stuck at ${Q1.gnpa}% (4.53% a year earlier), high for a large NBFC (Bajaj Finance: 0.96%); MSME (5.2%), construction equipment (7.1%) and gold (2.6%) worsened in the year. Management guides NIM back to ~8.5% over two to three years from 9.04%, as cheaper funding is passed to new-vehicle buyers. A deficient monsoon and the West Asia oil shock are live risks to rural and transporter cash flows.` },
    { h: 'Priced for a re-rating it has already had', p: `At ₹${n0(price)} the stock trades at ${n1(fwdPbNow)}x our FY28E book and ${n1(fwdPeNow)}x FY28E EPS, against medians of ${PB21.med}x and ${PE21.med}x since 2021. That is close to its Feb-2026 peak while listed lenders have de-rated. The price implies a long-run ROE of ~{{dcf.impliedRoe|pct0}}; we forecast 13-14% to FY29E and 16% at best once re-levered. The street's ₹${n0(tpAvg)} average target needs 2.1-2.4x book, a multiple the stock has touched only briefly (2.1x forward in Feb-2026).` },
  ],
  keyRows: [['AUM (₹ cr)', 'aum', 'num'], ['AUM growth', 'aumGrowth', 'chg'], ['NII (₹ cr)', 'nii', 'num'], ['NIM (on AUM)', 'nim', 'pct'], ['Credit cost', 'creditCost', 'pct'], ['PAT (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['BVPS (₹)', 'bvps', 'n1'], ['ROA (on assets)', 'roa', 'pct'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Asset quality', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): management will reassess its ~18% FY27 AUM growth guidance once the monsoon\'s effect on rural cash flows is known.',
    'Monsoon and kharif output: rainfall was ~12% below normal by late September; a weak rabi season would hit truck utilisation and collections.',
    'Deployment of the last of the surplus liquidity and the first large borrowings at AAA rates (incremental cost 7.77% in Q1; bank money ~8%).',
    'Reappointment of MD & CEO Parag Sharma for five years from 13-Dec-2026 (recommended by the board).',
    'MUFG\'s 24-month standstill on market purchases runs to around April 2028; any change in its role (more board seats, co-lending, a higher stake) would move the multiple.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const QN = SG.quarterly.find(q => q.q === 'Q1FY27'), keys = SG.lines.map(l => l.key);
const nm = Object.fromEntries(SG.lines.map(l => [l.key, l.name.replace(/ \(.*\)$/, '')]));
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'AUM: the 2022 merger doubled the base; ~17-18% growth since', unit: 'AUM at March (₹ \'000 crore); FY18-FY22 Shriram Transport Finance alone', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'AUM', ref: 'fin.aum', scale: 0.001, fmt: 'num' }], labels: 'all', source: 'STFC FY22 and SFL FY26 annual reports; GAM estimates FY27-29E' },
      { type: 'hbar', title: 'Still a vehicle lender: 80% of AUM is wheels or equipment', unit: 'Share of AUM, Jun-2026 (%)', x: keys.map(k => nm[k]), series: [{ name: 'Share', values: keys.map(k => Math.round(QN[k] / QN.total * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 investor update p7' },
    ] },
    { pair: [
      { type: 'column', title: 'Loan losses: from ~3% in the Covid years to ~1.9%', unit: 'Impairment ÷ average AUM (%); FY23 distorted by the merger; FY27-29E GAM', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Credit cost', ref: 'fin.creditCost', fmt: 'pct' }], labels: 'all', min: 0, max: 3.5, source: 'Company, Screener.in; GAM estimates' },
      { type: 'line', title: 'Equity in place of debt lifts NIM in FY27E; yields then drift down', unit: '% of average AUM (yield, NIM) or average borrowings (cost)', x: 'fin.labels', from: 'FY24', to: 'FY29E', series: [{ name: 'Yield on AUM', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds', ref: 'fin.costOfFunds', fmt: 'pct' }, { name: 'NIM', ref: 'fin.nim', fmt: 'pct' }], labels: 'ends', min: 6, max: 18, source: 'Company, Screener.in; GAM estimates. FY24 includes Shriram Housing Finance' },
    ] },
    { pair: [
      { type: 'column', title: 'Book per share jumps 42% in FY27E on MUFG\'s premium issue', unit: 'Book value per share at March (₹)', x: 'fin.labels', from: 'FY20', to: 'FY29E', series: [{ name: 'BVPS', ref: 'fin.bvps', fmt: 'num' }], labels: 'all', highlight: 'FY27E', source: 'Screener.in; GAM estimates' },
      { type: 'line', title: 'ROE: 16-18% after the merger, ~13-14% with the new equity', unit: 'ROE and ROA on total assets (%); FY27E ROE on opening/closing equity (13.2% time-weighted)', x: 'fin.labels', from: 'FY18', to: 'FY29E', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }, { name: 'ROA', ref: 'fin.roa', fmt: 'pct' }], labels: 'ends', min: 0, max: 22, source: 'Screener.in; GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/B: from ~1x in 2022 to ${n1(fwdPbNow)}x, near its peak`, unit: `Price ÷ next full-year book value per share (x), book adjusted for the MUFG issue before it was announced; orange line = our ${pbMult.toFixed(1)}x`, x: fwdPb.map(x => x[0]), series: [{ name: 'Forward P/B', values: fwdPb.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 2, min: 0, lines: [{ v: PB21.med, text: `Median since 2021: ${PB21.med}x` }, { v: pbMult, text: '', color: '#cf8f1f' }], source: 'Screener.in prices; book value per share; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (Jul-Sep 2026)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker.replace(/ \(.*\)$/, '')), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and Trendlyne (25-Jul to 29-Sep 2026), GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.franchise, P3.spread, P3.quality, P4.funding, P4.capital, P4.roaTree, p.financials, P4.moat, P4.guidance, P4.earningsQuality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
