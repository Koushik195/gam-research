// Dev tool: screenshot every page of an initiation report. Usage: node tools/snap-ic.js MARUTI <outDir>
// The app's port follows PORT (default 5180), like src/server.js; Chrome follows CHROME_PATH.
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 5180;
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const [sym = 'MARUTI', out = '.'] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => ['error', 'warning'].includes(m.type()) && errors.push(m.text()));
  await page.goto(`http://localhost:${PORT}/company/${encodeURIComponent(sym)}/initiation`, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForSelector('.page', { timeout: 120000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.addStyleTag({ content: 'header.site{position:static!important}' });
  const ids = await page.$$eval('.page', s => s.map(x => x.id));
  for (const [i, id] of ids.entries()) {
    const el = await page.$(`#${id}`);
    await el.screenshot({ path: path.join(out, `${String(i).padStart(2, '0')}-${id}.png`) });
  }
  console.log('pages:', ids.join(', '));
  console.log('errors:', errors.length ? errors.slice(0, 15) : 'none');
  await browser.close();
})();
