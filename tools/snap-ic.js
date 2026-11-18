// Dev tool: screenshot every page of an initiation report. Usage: node tools/snap-ic.js MARUTI <outDir>
const puppeteer = require('puppeteer-core');
const path = require('path');
(async () => {
  const [sym = 'MARUTI', out = '.'] = process.argv.slice(2);
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => ['error', 'warning'].includes(m.type()) && errors.push(m.text()));
  await page.goto(`http://localhost:5180/company/${sym}/initiation`, { waitUntil: 'networkidle0', timeout: 120000 });
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
