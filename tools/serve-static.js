// Preview the static export exactly as GitHub Pages serves it: site/ at http://localhost:5190/gam-research/
//   node tools/serve-static.js [port] [base]
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = +process.argv[2] || 5190;
const BASE = process.argv[3] || '/gam-research/';
const SITE = path.join(__dirname, '..', 'site');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.pdf': 'application/pdf' };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') { res.writeHead(302, { Location: BASE }); return res.end(); }
  if (!p.startsWith(BASE)) { res.writeHead(404); return res.end('Not found'); }
  let f = path.join(SITE, p.slice(BASE.length));
  if (!f.startsWith(SITE)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) {
    if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' }); return res.end(); } // GitHub Pages does the same
    f = path.join(f, 'index.html');
  }
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log(`Static preview at http://localhost:${PORT}${BASE}`));
