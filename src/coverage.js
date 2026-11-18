// Coverage library: a permanent, dated record of every report GAM publishes on a company.
//   data/raw/<SYM>/research/history.json   events: initiation, results-update, rating/target change
//   data/raw/<SYM>/research/versions/      full snapshot of each published report (never overwritten)
// The published rating and target live here, not in the authoring files; the report cover and the
// library read them from the latest event. status() compares the published call with today's
// price (rating band breached?) and with the latest reported quarter (results update due?).
const fs = require('fs');
const path = require('path');
const { ratingFor, RANK, RULE } = require('./ratings');

const RAW = path.join(__dirname, '..', 'data', 'raw');
const researchDir = sym => path.join(RAW, sym, 'research');
const historyFile = sym => path.join(researchDir(sym), 'history.json');
const r1 = v => (typeof v === 'number' && isFinite(v) ? Math.round(v * 10) / 10 : null);

function readHistory(sym) {
  try { return JSON.parse(fs.readFileSync(historyFile(sym), 'utf8')); } catch { return { symbol: sym, events: [] }; }
}

// 'Q2FY27' → sortable number
const qNum = q => { const m = /^Q([1-4])FY(\d{2})$/.exec(q || ''); return m ? +m[2] * 4 + +m[1] : null; };

// Price on (or the last close before) a date, from the model's price series.
function priceOn(M, date) {
  if (!date || date >= M.price.lastDate) return { price: M.price.last, priceDate: M.price.lastDate };
  const s = M.price.series.filter(([d]) => d <= date);
  const p = s.length ? s[s.length - 1] : M.price.series[0];
  return { price: p[1], priceDate: p[0] };
}

// The quarter the report was written on: the latest quarterly result reported by `date`.
function basisQuarterOn(M, date) {
  const L = M.quarterly.labels, P = M.quarterly.periods || [];
  if (!date || M.meta.asOf) return L[L.length - 1]; // frozen model: its last quarter is the basis
  // A quarter's results are normally out within ~45 days of quarter-end (60 days for Q4).
  const out = L.filter((l, i) => { const p = P[i] && new Date(`1 ${P[i]}`); if (!p || isNaN(p)) return true; const end = new Date(p.getFullYear(), p.getMonth() + 1, 0); end.setDate(end.getDate() + 45); return end.toISOString().slice(0, 10) <= date; });
  return out.length ? out[out.length - 1] : L[L.length - 1];
}

// Record a published report. opts: { type, date, rating (override), reason, note, basisQuarter }
function publish(M, opts = {}) {
  const sym = M.meta.symbol;
  const H = readHistory(sym);
  const date = opts.date || new Date().toISOString().slice(0, 10);
  // Default: an initiation unless an earlier-dated initiation already exists.
  const type = opts.type || (H.events.some(e => e.type === 'initiation' && e.date < date) ? 'results-update' : 'initiation');
  const V = M.forecast.dcf, F = M.forecast.F, S = M.forecast.scenarios || {};
  const { price, priceDate } = priceOn(M, date);
  const upside = (V.tp / price - 1) * 100;
  const ruleRating = ratingFor(upside);
  const rating = opts.rating || ruleRating;
  if (rating !== ruleRating && !opts.reason) throw new Error(`${sym}: rule gives ${ruleRating} at ${r1(upside)}% upside; a ${rating} override needs --reason`);
  const prev = H.events.filter(e => e.rating && e.date < date).slice(-1)[0];
  const change = !prev ? { rating: 'initiated' } : {
    rating: RANK[rating] > RANK[prev.rating] ? 'upgrade' : RANK[rating] < RANK[prev.rating] ? 'downgrade' : 'maintained',
    from: prev.rating, tpFrom: prev.tp, tpChangePct: r1((V.tp / prev.tp - 1) * 100),
  };
  const pick = k => (Array.isArray(F[k]) ? F[k].map(r1) : null);
  const ev = {
    date, type, basisQuarter: opts.basisQuarter || basisQuarterOn(M, date),
    rating, ruleRating, ...(rating !== ruleRating ? { override: true, reason: opts.reason } : {}),
    tp: V.tp, bull: S.bull?.tp ?? null, bear: S.bear?.tp ?? null, price, priceDate, upside: r1(upside),
    method: V.method || null, rule: { buy: RULE.buy, sell: RULE.sell },
    estimates: { years: F.years, sales: pick('sales'), ebitda: pick('ebitda'), pat: pick('pat'), eps: pick('eps') },
    change, note: opts.note || '',
  };
  // Full snapshot of what was published, so later edits never overwrite history.
  const vdir = path.join(researchDir(sym), 'versions');
  fs.mkdirSync(vdir, { recursive: true });
  const vname = `${date}-${type}.json`;
  const read = f => { try { return JSON.parse(fs.readFileSync(path.join(researchDir(sym), f), 'utf8')); } catch { return null; } };
  fs.writeFileSync(path.join(vdir, vname), JSON.stringify({ symbol: sym, event: ev, initiation: read('initiation.json'), assumptions: read('assumptions.json'), update: opts.updateFile ? read(opts.updateFile) : undefined }));
  ev.version = `versions/${vname}`;
  H.events = H.events.filter(e => e.date !== date); // re-publishing on the same as-of date replaces that day's entry
  H.events.push(ev);
  H.events.sort((a, b) => a.date.localeCompare(b.date));
  fs.writeFileSync(historyFile(sym), JSON.stringify(H, null, 1));
  return ev;
}

// Where a covered company stands today against its published call.
function status(M, H = M.research?.history) {
  const evs = (H?.events || []).filter(e => e.rating);
  if (!evs.length) return null;
  const last = evs[evs.length - 1];
  const changes = evs.filter(e => e.change && ['upgrade', 'downgrade'].includes(e.change.rating));
  const lastChange = changes[changes.length - 1] || null;
  // Live price and latest reported quarter (the report itself may be frozen at an earlier as-of date)
  const price = M.meta.livePrice ?? M.price.last, upside = (last.tp / price - 1) * 100, ruleNow = ratingFor(upside);
  const latestQuarter = M.meta.liveQuarter || M.quarterly.labels[M.quarterly.labels.length - 1];
  const updateDue = (qNum(latestQuarter) ?? 0) > (qNum(last.basisQuarter) ?? 0);
  const modelTp = M.forecast?.dcf?.tp ?? null;
  const flags = [];
  if (updateDue) flags.push({ k: 'update', t: `${latestQuarter} results out; report written on ${last.basisQuarter}` });
  if (ruleNow !== last.rating) flags.push({ k: 'band', t: `Upside now ${r1(upside)}%: the rule says ${ruleNow}` });
  if (modelTp != null && modelTp !== last.tp) flags.push({ k: 'draft', t: `Model target ₹${modelTp} differs from published ₹${last.tp} (unpublished changes)` });
  return {
    rating: last.rating, tp: last.tp, bull: last.bull, bear: last.bear, type: last.type, date: last.date, publishedPrice: last.price,
    price, priceDate: M.meta.livePriceDate || M.price.lastDate, upside: r1(upside), ruleRating: ruleNow, asOf: M.meta.asOf || null,
    basisQuarter: last.basisQuarter, latestQuarter, updateDue, modelTp,
    initiated: evs[0].date, events: evs.length,
    previous: evs.length > 1 ? { rating: evs[evs.length - 2].rating, tp: evs[evs.length - 2].tp, date: evs[evs.length - 2].date } : null,
    lastChange: lastChange ? { date: lastChange.date, kind: lastChange.change.rating, from: lastChange.change.from, to: lastChange.rating } : null,
    flags,
  };
}

module.exports = { readHistory, publish, status, priceOn, basisQuarterOn, qNum };
