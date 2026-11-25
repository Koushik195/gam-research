// URBANCO: in-memory fixes applied by src/model.js on every build (patchRaw); idempotent. Never edit screener.json.
// Share count. The engine fixes forecast shares at FY26 profit ÷ FY26 EPS. Screener's FY26 EPS (−₹1.52) implies ~154.6 cr
// shares. We value Urban Company on fully diluted shares: 146.22 cr outstanding at Mar-26 net of the 8.00 cr treasury
// shares held by the Urban Company ESOP Trust (FY26 annual report, note 14: 1,46,21,80,603 shares; founders' 9,77,62,500
// shares = 6.34% of 154.22 cr issued) + 9.9989 cr options outstanding at a ₹1 exercise price (note 32: 9,99,88,718),
// which the trust's shares and new issues will settle = 156.21 cr. FY26 EPS is restated: −₹234.8 cr ÷ 156.21 cr.
// The Nov-2026 QIP (16.02 cr shares at ₹156) was approved by the board only on 16-Oct-2026, after our as-of date, and
// is deliberately left out.
const SHARES_FD = 156.21; // crore, fully diluted at Mar-26
const ISSUED_PRE_QIP = 154.22; // crore, issued at Mar-26 incl. 8.0 cr ESOP-trust shares

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'URBANCO.patch.js: FY26 EPS on 156.21 cr fully diluted shares.', fetchedAt: S.fetchedAt };
  const pl = S.tables['profit-loss'], j = pl.periods.indexOf('Mar 2026');
  if (j < 0) throw new Error('URBANCO patch: no Mar 2026 column');
  keep.eps = pl.rows['EPS in Rs'][j];
  pl.rows['EPS in Rs'][j] = Math.round(pl.rows['Net Profit'][j] / SHARES_FD * 1e5) / 1e5;
  // Shareholding: Screener carries a "Nov 2026" column (the post-QIP pattern) that the engine's as-of freeze does not
  // recognise as a quarter end. Keep only patterns filed for quarters up to Jun-2026 (PLAYBOOK §1).
  const okP = p => { const m = /^(\w{3}) (\d{4})$/.exec(p); if (!m) return false; const mo = { Mar: 3, Jun: 6, Sep: 9, Dec: 12 }[m[1]]; return mo != null && (+m[2] * 100 + mo) <= 202606; };
  for (const part of ['quarterly', 'yearly']) {
    const t = S.shareholding?.[part]; if (!t) continue;
    const idx = t.periods.map((p, i) => (okP(p) ? i : -1)).filter(i => i >= 0);
    t.periods = idx.map(i => t.periods[i]);
    for (const r of Object.keys(t.rows)) t.rows[r] = idx.map(i => t.rows[r][i]);
  }
  // Market value: Screener's top ratios (fetched Nov-2026) already include the 16.02 cr QIP shares allotted on
  // 19-Nov-2026 (₹28,717 cr ÷ ₹169 = 169.9 cr shares). The engine scales that share count to the 30-Sep close, so we
  // restate it to the 154.22 cr shares in issue before the QIP (incl. the ESOP trust's 8.0 cr), and book value per share
  // to Mar-26 net worth (₹2,143 cr) on the same count. High/low are recomputed by the engine from the price series.
  const t = S.topRatios || {}, cp = Number(String(t['Current Price'] || '').replace(/[^0-9.]/g, ''));
  if (cp) { keep.topRatios = { ...t }; t['Market Cap'] = `₹ ${Math.round(ISSUED_PRE_QIP * cp)} Cr.`; t['Book Value'] = `₹ ${(2143 / ISSUED_PRE_QIP).toFixed(1)}`; t['High / Low'] = ''; }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SHARES_FD };
