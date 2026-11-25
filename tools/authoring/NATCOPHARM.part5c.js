// Natco Pharma report, part 5c: the rest of the valuation chapter (views not in the base, post-rights view, scenarios,
// DCF detail, peers). Appends to the blocks in NATCOPHARM.part5b.js.
const X = require('./NATCOPHARM.ctx2');
const P5b = require('./NATCOPHARM.part5b');
const { F, V, n0, n1, pc, pc1, price, mv, FM, HR, HALL, exWind, keepFY28, HA, MULT, SENS, epsSep, val, k, sectorCalcAll, derate, PEERS, EXCL_SYMS, MED5, shortName, rating, ASOF_TXT, epsCagr, RI, HEVALL, evMULT } = X;
const { ratingFor } = require('../../src/ratings');
const rt = v => ratingFor((v / price - 1) * 100);

const more = [
  { exhibit: { type: 'table', title: 'Views we did not put in the base (sensitivity rows only)', head: ['View', 'What it changes', 'Value / share (₹)', 'Rating it would give'], wide: [0, 1], rows: [
    ['All forward years since Apr-2021 (no trough years dropped)', `${n1(HALL.med)}x × ${k.toFixed(3)} → ${SENS.all}x`, n0(val(SENS.all)), rt(val(SENS.all))],
    ['Ex-windfall: only forward years without gRevlimid in the denominator (FY27-FY28)', `${n1(exWind.med)}x (${exWind.n} points) → ${SENS.exWind}x`, n0(val(SENS.exWind)), rt(val(SENS.exWind))],
    ['FY28 not treated as a trough (if FY28E EPS were above ₹52.2)', `${n1(keepFY28.med)}x → ${SENS.keepFY28}x`, n0(val(SENS.keepFY28)), rt(val(SENS.keepFY28))],
    ['EPS before one-offs (FY25 land gain, FY26 tax credit)', `${n1(HA.med)}x → ${SENS.adj}x (troughs ${X.troughA.join(', ')})`, n0(val(SENS.adj)), rt(val(SENS.adj))],
    ['No sector factor', `${SENS.noFactor}x`, n0(val(SENS.noFactor)), rt(val(SENS.noFactor))],
    ['All 15 pharma names excl. Natco as the factor', `${pc1(sectorCalcAll)} → ${SENS.all15}x`, n0(val(SENS.all15)), rt(val(SENS.all15))],
    ['Own re-rating (trailing P/E vs own five-year median)', `${pc1(derate.NATCOPHARM)}: trailing EPS still contains gRevlimid quarters; not meaningful`, 'not applied', '–'],
    ['Street method on our EPS (ICICI Securities)', '18x FY28E EPS + ₹100 a share NPV of exclusive products', n0(P5b.isec), rt(P5b.isec)],
    ['Growth premium', `EPS ${pc(epsCagr)} a year FY26-29E (from a windfall base): no case for a premium`, 'not applied', '–'],
  ], source: 'GAM Research. Per PLAYBOOK §7c, growth, returns, own-history and alternative-window views are shown, not added to the base multiple. Ratings from src/ratings.js at the ₹827.5 close.' } },
  { callout: `**Why we still use ${MULT.base}x.** The house rule exists so that we do not pick the multiple we like. Applied as written, it drops the two forward years that reflect Natco without gRevlimid (their EPS is below half the windfall peak) and keeps the four years when the market priced windfall profits at 7-8x. The result is harsh, and we say so: the all-years median (${SENS.all}x), the ex-windfall years (${SENS.exWind}x) and the street (~18x core) all point higher. A reviewer who decides the trough rule should not apply to the end of a limited-competition windfall would move the target to ₹${n0(val(SENS.all))}-${n0(val(SENS.exWind))}. We would rather show that clearly than tune the multiple.` },
  { h: 'The rights issue: what changes per share' },
  { exhibit: { type: 'table', title: 'Post-rights view (not in the base)', head: ['', 'Base (179.11 mn shares)', 'After the rights issue'], rows: [
    ['Shares (mn)', n1(F.shares * 10), n1(RI.shPost * 10)],
    ['Share price', `₹${n1(price)} (30-Sep, cum-rights)`, `₹${n1(RI.terp)} (theoretical ex-rights)`],
    ['Cash in / loans repaid', '–', `₹${n0(RI.net)} cr net / ₹${n1(RI.repay)} cr`],
    ['Sep-28E EPS', `₹${n1(epsSep.base)}`, `₹${n1(RI.epsSep)} (${pc1(RI.epsDil)}; interest saved and yield on the rest, after tax)`],
    [`Value at ${MULT.base}x`, '{{dcf.tp|inr}}', `₹${n0(RI.tpPe)} (${pc(RI.upPe)} vs ex-rights price)`],
    ['Value by equity arithmetic ((target × old shares + cash) ÷ new shares)', '–', `₹${n0(RI.tpEq)}`],
  ], source: 'Rights terms (board, 25-Sep-2026): 17,058,082 shares at ₹750, 2 for 21, ₹1,279.36 cr; up to ₹810.5 cr to repay loans. GAM estimates (6.5% on the cash; 27% tax).' } },
  { p: `The rights price (₹750) is only ~9% below the 30-Sep close, so the issue barely changes value per share: EPS dilution of ${pc1(RI.epsDil)} is mostly offset by interest saved. The rating is the same on either basis.` },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +4 points a year, margin +2 points; ${MULT.bull}x (75th percentile of the kept history).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue {{as.revenueGrowth.0|n1}}% / +{{as.revenueGrowth.1|n1}}% / +{{as.revenueGrowth.2|n1}}%; EBITDA margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${MULT.base}x Sep-28E.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4 points a year, margin −3 points; ${MULT.bear}x.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: engine treasury at Mar-27 (net cash, deposits, Adcock at book ~₹3,340 cr)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: 'GAM Research. The engine treasury includes ~₹385 cr of FY27 working-capital release that we expect the refund-liability payout to absorb (worth ~₹21 a share); we leave it in rather than override the engine.' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Listed pharma peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', '5-yr median P/E', 'vs median', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'NATCOPHARM' ? '**Natco Pharma**' : shortName(p.symbol) + (EXCL_SYMS.includes(p.symbol) ? ' (excluded)' : ''), n0(p.symbol === 'NATCOPHARM' ? price * F.shares : p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), n1(MED5[p.symbol]), derate[p.symbol] == null ? '–' : pc1(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT}. Natco: market value on the 179.11 mn shares in issue on 30-Sep-2026; its trailing P/E uses the four quarters to Jun-2026 (₹63.3 EPS), which still include gRevlimid.` } },
];

const valuation = { ...P5b.valuation, blocks: [...P5b.valuation.blocks, ...more] };
module.exports = { valuation };
