// VMM: in-memory fix applied by src/model.js on every build (patchRaw); idempotent.
// Share count. The engine fixes forecast shares at FY26 profit / FY26 EPS. Screener's FY26 EPS is basic, rounded to
// Rs1.80 on weighted-average shares (839 / 1.80 = 466.2 cr), while 467.31 cr shares were outstanding at Mar-2026
// (AR FY26 note 13A) and 468.43 cr at Jun-2026 after ESOP exercises (Emkay result update, 23-Jul-2026: 4,684.3 mn;
// HSIE 25-Sep-2026: 4,685 mn). 56.2 mn options were still outstanding at Mar-2026 (weighted exercise price Rs45).
// We restate FY26 EPS to Rs839 cr / 468.43 cr so every forecast EPS and the target are per share outstanding on the
// as-of date (diluted FY26 EPS was Rs1.79). Our forward-P/E history (VMM.ctx.js) uses only FY27-28E EPS, so it is
// on the same basis. Reported FY26 EPS (Rs1.80) is kept in the statement note.
const SHARES_JUN26 = 468.43; // crore

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j < 0) throw new Error('VMM patch: no Mar 2026 column');
  const keep = { note: 'FY26 EPS restated on 468.43 cr shares (Jun-2026). Original below.', fetchedAt: S.fetchedAt, original: { eps: pl.rows['EPS in Rs'].slice() } };
  pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES_JUN26 * 10000) / 10000;
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_JUN26 };
