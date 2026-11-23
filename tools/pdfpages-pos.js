// Extract text for selected PDF pages, grouped into lines by y position (keeps table rows intact).
// Use it instead of reading a whole annual report or transcript at once.
//   node tools/pdfpages-pos.js <in.pdf> <firstPage> <lastPage> <out.txt>
// Needs Google Chrome (set CHROME_PATH if it is not in the usual Windows location). pdf.js is
// vendored in tools/vendor/pdfjs (Apache-2.0).
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const LIB = path.join(__dirname, 'vendor', 'pdfjs');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const [inp, a, b, out] = process.argv.slice(2);
  if (!inp || !out) { console.error('usage: node tools/pdfpages-pos.js <in.pdf> <firstPage> <lastPage> <out.txt>'); process.exit(1); }
  const b64 = fs.readFileSync(inp).toString('base64');
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', protocolTimeout: 600000 });
  const page = await browser.newPage();
  await page.goto('about:blank');
  await page.addScriptTag({ path: path.join(LIB, 'pdf.min.js') });
  const worker = fs.readFileSync(path.join(LIB, 'pdf.worker.min.js'), 'utf8');
  await page.evaluate(w => { const blob = new Blob([w], { type: 'text/javascript' }); window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob); }, worker);
  const text = await page.evaluate(async (b64, a, b) => {
    const bin = atob(b64); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const doc = await window.pdfjsLib.getDocument({ data: bytes }).promise;
    const pages = [];
    for (let p = a; p <= Math.min(b, doc.numPages); p++) {
      const tc = await (await doc.getPage(p)).getTextContent();
      const rows = {};
      for (const it of tc.items) { if (!it.str || !it.str.trim()) continue; const y = Math.round(it.transform[5] / 2) * 2; (rows[y] ||= []).push([it.transform[4], it.str]); }
      const lines = Object.keys(rows).map(Number).sort((x, y) => y - x).map(y => rows[y].sort((m, n) => m[0] - n[0]).map(x => x[1]).join(' | ').replace(/\s+/g, ' ').trim());
      pages.push(`=== PAGE ${p} ===\n` + lines.join('\n'));
    }
    return pages.join('\n');
  }, b64, +a, +b);
  fs.writeFileSync(out, text);
  await browser.close();
})();
