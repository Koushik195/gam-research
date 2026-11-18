// Export the published library as a static website (for GitHub Pages: no server needed).
// It reads everything from the running app (http://localhost:5180), so start the app first.
//   node tools/export-static.js [--base /gam-research/] [--out site] [--no-pdf]
// Output: <out>/index.html (all companies), library/, company/<SYM>/initiation/, api/*.json|xlsx|pdf,
// static/ (page code, rewritten to static paths), assets/. Only published reports are exported.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const APP = 'http://localhost:5180';
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const B = arg('--base', '/gam-research/');
const OUT = path.resolve(ROOT, arg('--out', 'site'));
const PDF = !process.argv.includes('--no-pdf');
const stamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const write = (rel, data) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
async function get(p, binary) {
  const r = await fetch(APP + p);
  if (!r.ok) throw new Error(`${p}: HTTP ${r.status}`);
  return binary ? Buffer.from(await r.arrayBuffer()) : r.text();
}

// Rewrite the app's absolute server URLs to static files under the base path.
function rewrite(src, name) {
  let s = src;
  const rep = (from, to) => { if (!s.includes(from)) return; s = s.split(from).join(to); };
  s = s.replace(/(["'`(])\/(static|assets)\//g, `$1${B}$2/`);
  rep('href="/favicon.ico"', `href="${B}assets/guardian-logo.png"`);
  rep('href="/library"', `href="${B}library/"`);
  rep('href="/"', `href="${B}"`);
  // GitHub Pages lets browsers cache files for 10 minutes; 'no-cache' makes the page re-check the data
  // (a cheap 304 when unchanged), so a new export shows up on the next page load.
  const NC = ", { cache: 'no-cache' }";
  rep("fetch('/api/universe')", `fetch('${B}api/universe.json'${NC})`);
  rep("fetch('/api/coverage' + (refresh ? '?refresh=1' : ''))", `fetch('${B}api/coverage.json'${NC})`);
  rep("fetch(`/api/model/${encodeURIComponent(SYMBOL)}${refresh ? '?refresh=1' : ''}`)", `fetch(\`${B}api/model/\${encodeURIComponent(SYMBOL)}.json\`${NC})`);
  rep('fetch(`/api/model/${encodeURIComponent(SYMBOL)}`)', `fetch(\`${B}api/model/\${encodeURIComponent(SYMBOL)}.json\`${NC})`);
  for (const [kind, ext] of [['excel', 'xlsx'], ['pdf', 'pdf']]) {
    rep(`\`/api/${kind}/\${encodeURIComponent(SYMBOL)}\``, `\`${B}api/${kind}/\${encodeURIComponent(SYMBOL)}.${ext}\``);
    rep(`"/api/${kind}/\${c.symbol}"`, `"${B}api/${kind}/\${c.symbol}.${ext}"`);
  }
  s = s.replace(/(["'`])\/company\/(\$\{[^}]+\})(\/initiation)?/g, (_, q, sym) => `${q}${B}company/${sym}/initiation/`);
  rep("location.pathname.split('/')[2]", `location.pathname.slice(${B.length - 1}).split('/')[2]`);
  // Nothing may still point at the live server.
  const left = s.match(/["'`(]\/(api|company|library|static|assets)\b[^"'`)]{0,40}/g);
  if (left) throw new Error(`${name}: unrewritten server URLs: ${left.join(' | ')}`);
  if (name.endsWith('.html')) {
    const css = '<style>#refresh{display:none!important}.snapnote{position:fixed;right:10px;bottom:8px;font:11px system-ui,sans-serif;color:#6b7280;background:#fffc;padding:3px 8px;border-radius:6px;z-index:50}@media print{.snapnote{display:none}}</style>';
    s = s.replace('</head>', `${css}\n</head>`).replace('</body>', `<div class="snapnote">Snapshot exported ${stamp} · prices as of export</div>\n</body>`);
  }
  return s;
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  const cov = JSON.parse(await get('/api/coverage'));
  const rows = (cov.rows || cov.companies || cov).filter(r => r.published);
  const syms = rows.map(r => r.symbol);
  if (Array.isArray(cov)) write('api/coverage.json', JSON.stringify(rows));
  else write('api/coverage.json', JSON.stringify({ ...cov, [cov.rows ? 'rows' : 'companies']: rows }));
  const uni = JSON.parse(await get('/api/universe'));
  write('api/universe.json', JSON.stringify({ ...uni, companies: uni.companies.filter(c => syms.includes(c.symbol)) }));

  const PUB = path.join(ROOT, 'public');
  for (const f of fs.readdirSync(PUB)) {
    const txt = fs.readFileSync(path.join(PUB, f), 'utf8');
    const out = /\.(js|html)$/.test(f) ? rewrite(txt, f) : txt;
    if (f === 'index.html') write('index.html', out);
    else if (f === 'library.html') write('library/index.html', out);
    else if (f === 'initiation.html') { for (const s of syms) write(`company/${s}/initiation/index.html`, out); }
    write(`static/${f}`, out);
  }
  fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
  for (const f of fs.readdirSync(path.join(ROOT, 'assets'))) fs.copyFileSync(path.join(ROOT, 'assets', f), path.join(OUT, 'assets', f));
  write('.nojekyll', '');

  let n = 0;
  for (const s of syms) {
    write(`api/model/${s}.json`, await get(`/api/model/${s}`));
    write(`api/excel/${s}.xlsx`, await get(`/api/excel/${s}`, true));
    if (PDF) { try { write(`api/pdf/${s}.pdf`, await get(`/api/pdf/${s}`, true)); } catch (e) { console.warn(`PDF ${s}: ${e.message}`); } }
    console.log(`${++n}/${syms.length} ${s}`);
  }
  console.log(`Exported ${syms.length} published reports to ${OUT} (base ${B})`);
})().catch(e => { console.error(e.message); process.exit(1); });
