// PDF export of an initiating-coverage report: renders the live report page in headless
// Chrome (print stylesheet) and prints A4 with a branded header (GAM logo) and page-numbered
// footer on every page. Output is cached in output/<SYM>-initiation.pdf until the model changes.
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => fs.existsSync(p));

const SCALE = 0.72; // A4 printable width (186mm ≈ 703px) / 0.72 ≈ 976 CSS px layout width
const LAYOUT_WIDTH = 976;

function headerFooter(meta, date) {
  const logo = fs.readFileSync(path.join(ROOT, 'assets', 'guardian-logo.png')).toString('base64');
  const base = 'font-family:Segoe UI,Arial,sans-serif;width:100%;margin:0 12mm;-webkit-print-color-adjust:exact;';
  return {
    headerTemplate: `<div style="${base}font-size:8px;color:#0d1f44;display:flex;justify-content:space-between;align-items:center;border-bottom:1.2px solid #c6a44e;padding-bottom:4px">
      <span style="display:flex;align-items:center;gap:7px"><img src="data:image/png;base64,${logo}" style="height:26px"><span><b style="font-family:Georgia,serif;font-size:11px">GAM Research</b><br><span style="color:#9a7b2c;letter-spacing:.12em;font-size:6.5px">GUARDIAN CAPITAL · INITIATING COVERAGE</span></span></span>
      <span style="text-align:right"><b>${meta.name}</b><br>${date}</span></div>`,
    footerTemplate: `<div style="${base}font-size:7px;color:#6b7280;display:flex;justify-content:space-between;border-top:0.6px solid #e7e2d3;padding-top:3px">
      <span>GAM Research · For internal use · Not investment advice. Sources: company filings, Screener.in, GAM Research estimates.</span>
      <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
  };
}

async function renderPdf(symbol, baseUrl) {
  if (!CHROME) throw new Error('No Chrome/Edge found for PDF export; set CHROME_PATH');
  const model = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', `${symbol}.json`), 'utf8'));
  const out = path.join(ROOT, 'output', `${symbol}-initiation.pdf`);
  const modelFile = path.join(ROOT, 'data', 'models', `${symbol}.json`);
  const sources = [modelFile, path.join(ROOT, 'public', 'initiation.js'), path.join(ROOT, 'public', 'initiation.css'), __filename];
  if (fs.existsSync(out) && sources.every(f => fs.statSync(f).mtimeMs < fs.statSync(out).mtimeMs)) return out;

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: LAYOUT_WIDTH, height: 1200 });
    await page.emulateMediaType('print');
    await page.goto(`${baseUrl}/company/${encodeURIComponent(symbol)}/initiation?pdf=1`, { waitUntil: 'networkidle0', timeout: 120000 });
    await page.waitForSelector('.page', { timeout: 120000 });
    await new Promise(r => setTimeout(r, 1500)); // let charts settle at print width
    const date = model.research?.initiation?.date || new Date().toLocaleDateString('en-IN');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await page.pdf({
      path: out, format: 'A4', printBackground: true, scale: SCALE, displayHeaderFooter: true,
      margin: { top: '22mm', bottom: '14mm', left: '12mm', right: '12mm' },
      ...headerFooter(model.meta, date),
    });
    return out;
  } finally {
    await browser.close();
  }
}

module.exports = { renderPdf };

if (require.main === module) {
  renderPdf((process.argv[2] || 'MARUTI').toUpperCase(), process.argv[3] || 'http://localhost:5180').then(f => console.log('wrote', f), e => { console.error(e); process.exit(1); });
}
