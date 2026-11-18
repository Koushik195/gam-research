// Dev tool: screenshots each chapter of a company page with the installed Chrome.
// Usage: node tools/snap.js MARUTI <outDir>
const puppeteer = require('puppeteer-core');
const path = require('path');
(async () => {
  const [sym = 'MARUTI', out = '.'] = process.argv.slice(2);
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`http://localhost:5180/company/${sym}`, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForSelector('section.ch', { timeout: 120000 });
  await new Promise(r => setTimeout(r, 1500));
  const ids = await page.$$eval('section.ch', s => s.map(x => x.id));
  await page.screenshot({ path: path.join(out, `00-hero.png`) });
  for (const [i, id] of ids.entries()) {
    const el = await page.$(`#${id}`);
    await el.screenshot({ path: path.join(out, `${String(i + 1).padStart(2, '0')}-${id}.png`) });
  }
  console.log('chapters:', ids.join(', '));
  console.log('errors:', errors.length ? errors : 'none');
  await browser.close();
})();
