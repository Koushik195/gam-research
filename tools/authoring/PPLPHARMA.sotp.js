// Piramal Pharma: carry the sum of the parts into the engine. The street values Piramal on a sum of the parts built on
// EV/EBITDA (Motilal Oswal 30-Jul-2026: CDMO 23x, CHG 11x, ICH 13x 12-month-forward EBITDA; ICICI Direct 30-Jul-2026:
// CDMO 17x and CHG 15x FY28E EBITDA, PCH 2x sales, AbbVie JV 10x PAT; JM Financial's last disclosed method, Sep-2025,
// also SOTP); Choice (24x FY28E) and InCred (24.6x FY27F) use one consolidated EV/EBITDA. Piramal reports a single
// segment and no segment EBITDA, so a segment multiple cannot be derived from the stock's own history. Our parts are:
// the operating businesses (CDMO, CHG, PCH) on one EV/EBITDA derived the house way (PPLPHARMA.ctx.js: Piramal's own
// one-year-forward EV/EBITDA median since 1-May-2023, looked through the JV, leaving out the §4 trough year, x the pharma
// EV/EBITDA factor over the same window, +5.1%, nearest half-turn), the AbbVie JV (outside EBITDA: its share of profit
// sits in other income) at 10x its share of Sep-28E profit, and net debt at Sep-28E incl. leases with Yapan Bio and other
// investments at book. The engine's EV method is (EBITDA x multiple + net cash) / shares, so this script writes the
// IMPLIED EV/EBITDA per case ((sum of parts - Sep-28E net cash) / Sep-28E EBITDA) into the primary method, the P/E
// cross-check multiples (nine pharma peers' median P/E at the 30-Sep close, 75th / 25th percentiles), and the parts
// under assumptions.sotp. EBITDA does not depend on the multiples, so one pass converges; then run node src/model.js
// PPLPHARMA. Usage: node tools/authoring/PPLPHARMA.sotp.js   (also run by PPLPHARMA.js)
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'raw', 'PPLPHARMA', 'research', 'assumptions.json');

function syncSotp() {
  delete require.cache[require.resolve('./PPLPHARMA.ctx')];
  process.env.TP_NOCHECK = '1';
  const X = require('./PPLPHARMA.ctx');
  delete process.env.TP_NOCHECK;
  const as = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const ev = as.valuation.blend.methods.find(m => m.key === 'ev'), pe = as.valuation.blend.methods.find(m => m.key === 'pe');
  const r2 = v => Math.round(v * 100) / 100, n0 = X.n0, n1 = X.n1;
  const cases = Object.fromEntries(['base', 'bull', 'bear'].map(c => [c, { opsMultiple: X.MULT[c], sep28Ebitda: Math.round(X.SOTP[c].eb), sep28NetCash: Math.round(X.SOTP[c].tr), parts: Object.fromEntries(X.SOTP[c].parts.map(p => [p.key, Math.round(p.value)])), totalCr: Math.round(X.SOTP[c].total), perShare: r2(X.SOTP[c].perShare), impliedEvEbitda: X.EVM[c] }]));
  const sotp = { _why: as.sotp._why, window: X.WIN, sectorFactorEvPct: X.SECTOR_EV, troughYearsLeftOut: X.troughYears, troughTest: 'EBITDA (reviewer decision 25-Nov-2026)', epsTestMedian: r2(X.EVH_EX26.med), ownMedian: r2(X.EVH_BASE.med), ownP25: r2(X.EVH_BASE.p25), ownP75: r2(X.EVH_BASE.p75), points: X.EVH_BASE.n, jv: { multiple: X.JV_MULT, sep28Share: r2(X.jvShareSep28), value: Math.round(X.JV_VALUE), book: X.JV_BOOK }, ...cases };
  const evWhy = `How the street values Piramal Pharma: a sum of the parts on EV/EBITDA (Motilal Oswal 30-Jul-2026: CDMO 23x, CHG 11x, ICH 13x 12-month-forward EBITDA; ICICI Direct 30-Jul-2026: CDMO 17x, CHG 15x FY28E EBITDA, PCH 2x sales, AbbVie JV 10x PAT; JM Financial Sep-2025: SOTP); Choice (24x FY28E) and InCred (24.6x FY27F) use one consolidated multiple. Piramal reports one segment, so the operating businesses take one multiple derived the house way: ${X.MULT.base}x Sep-28E EBITDA (before other income) = Piramal's own one-year-forward EV/EBITDA median since ${X.WIN_TXT} (post-listing months skipped; EV = market value + net debt incl. leases, less the JV's value above book; ${X.EVH_BASE.n} weekly points) of ${n1(X.EVH_BASE.med)}x, with no trough years under the EBITDA version of the PLAYBOOK §4 test (house precedent for EV/EBITDA histories: NH, FORTIS, MAXHEALTH, TORNTPHARM; FY26 EBITDA fell 36%, above half its peak; the EPS reading would drop the Apr-2024 to Mar-2025 dates, median ${n1(X.EVH_BYFY.FY26.med)}x, and give ${n1(X.EVH_EX26.med)}x, a sensitivity row), x the nine pharma peers' EV/EBITDA move over the same window, +${X.SECTOR_EV}% (PLAYBOOK §7c; reproduced ${X.pc1(X.FW.ev)}), nearest half-turn. Plus the AbbVie Therapeutics India JV (49%; its profit share is in other income, not EBITDA) at ${X.JV_MULT}x its Sep-28E share of profit (Rs${n1(X.jvShareSep28)} cr; ICICI Direct basis) = Rs${n0(X.JV_VALUE)} cr, less net debt at Sep-28E incl. leases (Rs${n0(-X.SOTP.base.tr)} cr on Screener's basis, plus the JV's Rs${n1(X.JV_BOOK)} cr book value so it is not counted twice; Yapan Bio and other investments at book). Sum Rs${n0(X.SOTP.base.total)} cr = Rs${n1(X.SOTP.base.perShare)} a share = an implied ${X.EVM.base}x Sep-28E EBITDA after net debt. Bull ${X.MULT.bull}x / bear ${X.MULT.bear}x (75th / 25th percentile x the factor) on bull / bear EBITDA => implied ${X.EVM.bull}x / ${X.EVM.bear}x. No own-move blend, no growth uplift (sensitivities only). Written by PPLPHARMA.sotp.js.`;
  const peWhy = `Relative cross-check on earnings: the nine-name pharma set's median trailing P/E at the 30-Sep-2026 close (${X.PEM.base}x; 75th / 25th percentile ${X.PEM.bull}x / ${X.PEM.bear}x, nearest half-turn) on Sep-28E EPS. Piramal's own P/E history is not meaningful (losses in FY23 and FY26, EPS below Rs1 in FY24-25). It asks what the stock is worth if, in a year, the market paid a typical Indian pharma earnings multiple for Piramal's then-forward earnings.`;
  const same = (a, c) => ['base', 'bull', 'bear'].every(key => a?.[key] === c[key]);
  const changed = !same(ev.multiple, X.EVM) || !same(pe.multiple, X.PEM) || ev.why !== evWhy || pe.why !== peWhy || JSON.stringify(as.sotp) !== JSON.stringify(sotp);
  if (changed) {
    ev.multiple = { ...X.EVM }; pe.multiple = { ...X.PEM }; ev.why = evWhy; pe.why = peWhy; as.sotp = sotp;
    fs.writeFileSync(FILE, JSON.stringify(as, null, 1));
    console.log(`PPLPHARMA.sotp: updated. Operating ${JSON.stringify(X.MULT)}, implied EV/EBITDA ${JSON.stringify(X.EVM)}, P/E ${JSON.stringify(X.PEM)}. Re-run node src/model.js PPLPHARMA, then node tools/authoring/PPLPHARMA.js.`);
  } else console.log(`PPLPHARMA.sotp: unchanged. SOTP Rs${X.SOTP.base.perShare.toFixed(1)} (bull Rs${X.SOTP.bull.perShare.toFixed(1)}, bear Rs${X.SOTP.bear.perShare.toFixed(1)}); implied ${JSON.stringify(X.EVM)}`);
  return { changed };
}

module.exports = { syncSotp };
if (require.main === module) syncSotp();
