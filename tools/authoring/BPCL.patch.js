// BPCL: one in-memory fix applied by src/model.js on every build (patchRaw); idempotent.
// Share count net of treasury shares. BPCL has 433.85 cr shares in issue (after the Jun-2024 1:1 bonus), of which
// 6.59 cr (1.52%) sit in the "BPCL Trust for Investment in Shares" (the erstwhile Kochi Refineries' holding,
// AR FY26 note 45). BPCL computes EPS on the 427.26 cr shares outside the trust (AR FY26 EPS note: FY26 consolidated
// EPS ₹60.49), but Screener's EPS divides by all 433.85 cr (₹59.57). The engine infers shares as Net Profit ÷ EPS,
// so we restate every annual and quarterly EPS onto BPCL's basis (× 433.85 / 427.26): FY26 ₹60.49, Q1FY27 ₹−4.38
// (both as reported). Market value and every per-share figure are then on 427.26 cr shares. Screener's Net Profit
// already equals profit to owners (no minority interests since BORL became 100% owned; Profit for EPS = Net Profit).
// Capex needs no fix: Screener's "Fixed assets purchased" (FY26 ₹19,425 cr) is close to segment capex (₹20,053 cr).
const SH_ISSUED = 433.8505488, SH_TRUST = 6.5920614, SH_NET = SH_ISSUED - SH_TRUST; // crore shares (AR FY26 note 23)
const K = SH_ISSUED / SH_NET;

function patchRaw(S) {
  if (S._gamPatch && S._gamPatch.fetchedAt === S.fetchedAt) return S;
  const keep = { note: 'EPS restated to 427.26 cr shares (net of the BPCL Trust for Investment in Shares). Originals below.', fetchedAt: S.fetchedAt, original: {} };
  for (const tab of ['profit-loss', 'quarters']) {
    const T = S.tables[tab];
    if (!T) throw new Error(`BPCL patch: no ${tab} table`);
    const eps = T.rows['EPS in Rs'];
    keep.original[tab] = { eps: eps.slice() };
    T.rows['EPS in Rs'] = eps.map(v => (typeof v === 'number' ? Math.round(v * K * 1e4) / 1e4 : v));
  }
  S._gamPatch = keep;
  return S;
}

module.exports = { patchRaw, SH_ISSUED, SH_TRUST, SH_NET };
