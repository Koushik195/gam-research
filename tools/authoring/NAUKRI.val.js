// Info Edge (India): write the derived SOTP parts into assumptions.json. NAUKRI.ctx.js derives the Recruitment P/E (median of
// the current street multiples: JM Financial 30x and Motilal Oswal's DCF value implied on our Sep-28E profit; bull = JM's
// 30x, bear = IndiaMART's 20x), the 99acres and Jeevansathi/Shiksha EV/sales multiples, the holding-company discount on the
// Eternal and PB Fintech stakes (base = Info Edge's own median since Sep-2025; bull = the Sep-2021 to Jun-2026 median, a
// premium, floored at zero; bear = the widest quarter-end since Sep-2025), the stakes at the 30-Sep-2026 closes, unlisted
// investments at book and cash. Segment profit depends on the scenario deltas, not on these parts, so one pass converges;
// the next `node src/model.js NAUKRI` reproduces the target. Usage: node tools/authoring/NAUKRI.val.js (also run by NAUKRI.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'NAUKRI', 'research', 'assumptions.json');

function syncParts() {
  delete require.cache[require.resolve('./NAUKRI.ctx')];
  const X = require('./NAUKRI.ctx');
  const { SOTP, RECX, REX, OTHX, DISC, C, n0, n1, etPx, pbPx, listedMv, recPatSep, reSep, othSep, UNL, CASH, FM, PEM, sectorDr, moslRecX, RECENT_FROM } = X;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const r0 = v => Math.round(v), cases = ['base', 'bull', 'bear'], of = f => Object.fromEntries(cases.map(c => [c, r0(f(c))]));
  const ST = C.stakes, U = ST.unlisted;
  const next = [
    { name: 'Recruitment (Naukri): P/E on Sep-28E profit after corporate costs', adj: of(c => SOTP[c].rec),
      metricLabel: `₹${n0(recPatSep('base'))} cr × ${RECX.base}x (bull ${RECX.bull}x on ₹${n0(recPatSep('bull'))} cr, bear ${RECX.bear}x on ₹${n0(recPatSep('bear'))} cr)`,
      note: `Median of the two current street multiples: JM Financial 30x (Jul-2026) and Motilal Oswal's DCF value of Naukri (₹22,200 cr), ${n1(moslRecX)}x our Sep-28E profit. Profit = segment result less all corporate costs, taxed at 25.17%.` },
    { name: '99acres: EV/sales on Sep-28E revenue', adj: of(c => SOTP[c].re), metricLabel: `₹${n0(reSep('base'))} cr × ${REX.base}x (bull ${REX.bull}x, bear ${REX.bear}x)`, note: 'Median of JM Financial (4x Mar-28E sales) and Motilal Oswal (DCF value ₹2,500 cr, ~3.5x our Sep-28E revenue).' },
    { name: 'Jeevansathi + Shiksha: EV/sales on Sep-28E revenue', adj: of(c => SOTP[c].oth), metricLabel: `₹${n0(othSep('base'))} cr × ${OTHX.base}x (bear ${OTHX.bear}x)`, note: 'JM Financial\'s 2x; Motilal Oswal\'s 10x FY27E sales is an outlier for a 4%-margin business with a shrinking Shiksha (shown as a sensitivity).' },
    { name: 'Eternal: 12.43% stake at market', adj: of(() => SOTP.base.etMv), metricLabel: `${n1(ST.eternal.sharesGroup)} cr shares × ₹${etPx.toFixed(2)} (NSE close, 30-Sep-2026)`, note: 'Group holding 1,19,95,64,695 shares (AR FY26 consolidated investment note; unchanged since the Jul-2021 IPO).' },
    { name: 'PB Fintech: 12.12% stake at market', adj: of(() => SOTP.base.pbMv), metricLabel: `${ST.pbFintech.sharesGroup.toFixed(2)} cr shares × ₹${pbPx.toFixed(2)} (NSE close, 30-Sep-2026)`, note: '2.75 cr shares held since before Mar-2023 plus 2.99 cr received in Aug-2025 for the Makesense joint venture (AR FY26).' },
    { name: 'Less: holding-company discount on the listed stakes', adj: of(c => SOTP[c].disc), metricLabel: `Discount × listed stakes ₹${n0(listedMv)} cr (base ${DISC.base}%, bull ${DISC.bull}%, bear ${DISC.bear}%)`, note: `Derived from Info Edge's own discount at quarter-ends since Sep-2021 (base: median since ${RECENT_FROM.slice(0, 7)}; see Valuation).` },
    { name: 'Unlisted investments and strategic subsidiaries at book', adj: of(() => UNL), metricLabel: `Info Edge's share of unlisted investments ₹${n0(U.infoEdgeShare)} cr (consolidated unquoted ₹${n0(U.unquotedNonCurrentMar26)} cr less minorities ₹${n0(U.nciMar26)} cr, Mar-26) + strategic subsidiaries ₹${n0(U.strategicCarrying)} cr (Jun-26)`, note: 'AIF portfolios, balance-sheet start-up stakes and joint ventures (Adda247, Shipsy, Unnati, NoPaperForms); Aisle, Zwayam, DoSelect and Coding Ninjas at carrying value.' },
    { name: 'Cash (incl. wholly owned subsidiaries)', adj: of(() => CASH), metricLabel: `₹${n0(CASH)} cr at 30-Jun-2026`, note: 'Bank deposits and debt funds (Q1FY27 deck); no debt other than leases.' },
  ];
  const pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const peNext = { ...PEM }, peWhy = `Own one-year-forward P/E on consolidated EPS since Apr-2021: median ${n1(FM.median)}x (FY24-25 forward years left out as troughs), cut by the ${Math.abs(sectorDr).toFixed(1)}% sector move (IndiaMART): ${PEM.base}x. Rough: consolidated EPS carries only the treasury income of the cash and none of the value of the Eternal and PB Fintech stakes.`;
  const changed = JSON.stringify(as.valuation.parts) !== JSON.stringify(next) || JSON.stringify(pe.multiple) !== JSON.stringify(peNext) || pe.why !== peWhy;
  if (changed) {
    as.valuation.parts = next; pe.multiple = peNext; pe.why = peWhy;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`NAUKRI.val: updated. Rec ${JSON.stringify(RECX)}, discount ${JSON.stringify(DISC)}, P/E ${JSON.stringify(PEM)}. Re-run node src/model.js NAUKRI, then node tools/authoring/NAUKRI.js.`);
  } else console.log(`NAUKRI.val: unchanged. Rec ${JSON.stringify(RECX)}, discount ${JSON.stringify(DISC)}, P/E ${JSON.stringify(PEM)}`);
  return { changed };
}

module.exports = { syncParts };
if (require.main === module) syncParts();
