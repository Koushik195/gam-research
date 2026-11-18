// GAM Research app server. Zero-dependency HTTP server:
//   /                      stock picker (BSE-500)
//   /company/<SYMBOL>      the company story page
//   /api/universe          BSE-500 list + which companies are already built / researched
//   /api/model/<SYMBOL>    the analysed model; fetches + builds on first request or when stale
// Usage: node src/server.js   (PORT env, default 5180)
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { writeModel } = require('./model');
const { renderPdf } = require('./pdf');
const { buildWorkbook } = require('./excel');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ASSETS = path.join(ROOT, 'assets');
const DATA = path.join(ROOT, 'data');
const PORT = process.env.PORT || 5180;
const STALE_HOURS = 24; // re-fetch source data older than this

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const send = (res, code, type, body) => { res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(body); };
const sendJson = (res, code, obj) => send(res, code, TYPES['.json'], JSON.stringify(obj));
const validSymbol = s => /^[A-Z0-9&\-]{1,20}$/.test(s);

function serveFile(res, base, rel) {
  const file = path.normalize(path.join(base, rel));
  if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res, 404, 'text/plain', 'Not found');
  send(res, 200, TYPES[path.extname(file)] || 'application/octet-stream', fs.readFileSync(file));
}

const ageHours = file => (fs.existsSync(file) ? (Date.now() - fs.statSync(file).mtimeMs) / 36e5 : Infinity);
const runFetch = symbol => new Promise((resolve, reject) => {
  execFile(process.execPath, [path.join(__dirname, 'fetch-screener.js'), symbol], { cwd: ROOT, timeout: 120000 }, (err, stdout, stderr) => (err ? reject(new Error(stderr || err.message)) : resolve(stdout)));
});

// One build at a time per symbol; concurrent requests share the same promise.
const inflight = new Map();
async function getModel(symbol, refresh, opts = {}) {
  const raw = path.join(DATA, 'raw', symbol, 'screener.json');
  const model = path.join(DATA, 'models', `${symbol}.json`);
  const researchDir = path.join(DATA, 'raw', symbol, 'research');
  const researchMtime = fs.existsSync(researchDir) ? Math.max(0, ...fs.readdirSync(researchDir).map(f => fs.statSync(path.join(researchDir, f)).mtimeMs)) : 0;
  const needFetch = refresh || (!opts.noFetch && ageHours(raw) > STALE_HOURS);
  const needBuild = needFetch || !fs.existsSync(model) || fs.statSync(model).mtimeMs < Math.max(fs.statSync(raw).mtimeMs, researchMtime) || fs.statSync(model).mtimeMs < newestSourceMtime();
  if (!needBuild) return fs.readFileSync(model, 'utf8');
  if (inflight.has(symbol)) return inflight.get(symbol);
  const job = (async () => {
    if (needFetch) await runFetch(symbol);
    return JSON.stringify(writeModel(symbol));
  })().finally(() => inflight.delete(symbol));
  inflight.set(symbol, job);
  return job;
}
// Engine code changes invalidate cached models too.
function newestSourceMtime() {
  return Math.max(...['model.js', 'insights.js', 'forecast.js', 'coverage.js', 'ratings.js'].map(f => fs.statSync(path.join(__dirname, f)).mtimeMs));
}

// Coverage library: every company with a report, its published call and today's flags.
// Reads the models on disk and never fetches on its own (500 names); ?refresh=1 re-fetches each covered company first.
const readJsonSafe = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
async function coverage(refresh) {
  const syms = fs.readdirSync(path.join(DATA, 'raw')).filter(s => fs.existsSync(path.join(DATA, 'raw', s, 'research', 'initiation.json')));
  const companies = [], events = [];
  for (const sym of syms) {
    let M;
    try { M = JSON.parse(await getModel(sym, refresh, { noFetch: !refresh })); } catch (e) { companies.push({ symbol: sym, error: e.message }); continue; }
    const H = readJsonSafe(path.join(DATA, 'raw', sym, 'research', 'history.json'));
    const I = M.research?.initiation || {};
    const st = M.coverage || null;
    companies.push({
      symbol: sym, name: M.meta.name, sector: (M.meta.sectorPath || []).slice(-1)[0] || '', marketCap: M.meta.marketCap,
      published: !!st, status: st,
      draft: st ? null : { rating: I.rating, tp: M.forecast?.dcf?.tp, price: M.meta.livePrice ?? M.price?.last, upside: M.forecast?.dcf?.upside, date: I.date },
    });
    for (const e of H?.events || []) events.push({ symbol: sym, name: M.meta.name, ...e, estimates: undefined });
  }
  events.sort((a, b) => b.date.localeCompare(a.date));
  const { RULE } = require('./ratings');
  return { asOf: new Date().toISOString(), rule: RULE, companies, events };
}

function universe() {
  const u = JSON.parse(fs.readFileSync(path.join(DATA, 'universe.json'), 'utf8'));
  for (const c of u.companies) {
    c.built = fs.existsSync(path.join(DATA, 'models', `${c.symbol}.json`));
    c.researched = fs.existsSync(path.join(DATA, 'raw', c.symbol, 'research', 'initiation.json'));
    if (c.researched) {
      // published rating (coverage log) wins over the draft rating in the authoring output
      const H = readJsonSafe(path.join(DATA, 'raw', c.symbol, 'research', 'history.json'));
      const last = H?.events?.filter(e => e.rating).slice(-1)[0];
      c.rating = last?.rating || readJsonSafe(path.join(DATA, 'raw', c.symbol, 'research', 'initiation.json'))?.rating || null;
      c.published = !!last;
    }
  }
  return u;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = decodeURIComponent(url.pathname);
  try {
    if (p === '/' || p === '/index.html') return serveFile(res, PUBLIC, 'index.html');
    if (p === '/library' || p === '/library/') return serveFile(res, PUBLIC, 'library.html');
    if (p === '/api/coverage') return sendJson(res, 200, await coverage(url.searchParams.get('refresh') === '1'));
    if (/^\/company\/[^/]+\/initiation\/?$/.test(p)) return serveFile(res, PUBLIC, 'initiation.html');
    // Any other /company/<SYM> URL goes straight to the report.
    const co = p.match(/^\/company\/([^/]+)/);
    if (co) { res.writeHead(302, { Location: `/company/${co[1]}/initiation` }); return res.end(); }
    if (p === '/favicon.ico') return serveFile(res, ASSETS, 'guardian-logo.png');
    if (p.startsWith('/assets/')) return serveFile(res, ASSETS, p.slice(8));
    if (p.startsWith('/static/')) return serveFile(res, PUBLIC, p.slice(8));
    if (p === '/api/universe') return sendJson(res, 200, universe());
    const dl = p.match(/^\/api\/(pdf|excel)\/([^/]+)$/);
    if (dl) {
      const symbol = dl[2].toUpperCase();
      if (!validSymbol(symbol)) return sendJson(res, 400, { error: 'Bad symbol' });
      const M = JSON.parse(await getModel(symbol, false, { noFetch: true }));
      const stem = `${symbol}-${(M.meta.name || symbol).replace(/[^A-Za-z0-9]+/g, '-')}`;
      if (dl[1] === 'pdf') {
        const file = await renderPdf(symbol, `http://localhost:${PORT}`);
        res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${stem}-Initiating-Coverage-GAM.pdf"` });
        return fs.createReadStream(file).pipe(res);
      }
      const wb = await buildWorkbook(symbol);
      res.writeHead(200, { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': `attachment; filename="${stem}-Financial-Model-GAM.xlsx"` });
      return wb.xlsx.write(res).then(() => res.end());
    }
    const m = p.match(/^\/api\/model\/([^/]+)$/);
    if (m) {
      const symbol = m[1].toUpperCase();
      if (!validSymbol(symbol)) return sendJson(res, 400, { error: 'Bad symbol' });
      // No silent re-fetch on views: source data changes only on an explicit ?refresh=1, so data
      // cannot shift under an analyst mid-build. Use the library's Refresh to update prices.
      const refresh = url.searchParams.get('refresh') === '1';
      const body = await getModel(symbol, refresh, { noFetch: !refresh });
      return send(res, 200, TYPES['.json'], body);
    }
    send(res, 404, 'text/plain', 'Not found');
  } catch (e) {
    console.error(e);
    sendJson(res, 500, { error: e.message });
  }
});

server.listen(PORT, () => console.log(`GAM Research running at http://localhost:${PORT}`));
