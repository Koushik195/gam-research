// Dev tool: rasterise selected pages of a PDF to PNG (via pdf.js inside headless Chrome).
// Usage: node tools/pdf-preview.js <file.pdf> <outDir> 1,2,5
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
(async () => {
  const [file, out, pages = '1,2'] = process.argv.slice(2);
  const b64 = fs.readFileSync(file).toString('base64');
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const page = await browser.newPage();
  await page.setContent('<html><body style="margin:0"><canvas id="c"></canvas></body></html>');
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js' });
  const n = await page.evaluate(async (b64) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    window.doc = await pdfjsLib.getDocument({ data: Uint8Array.from(atob(b64), c => c.charCodeAt(0)) }).promise;
    return window.doc.numPages;
  }, b64);
  console.log('pages', n);
  for (const p of pages.split(',').map(Number).filter(p => p <= n)) {
    const dim = await page.evaluate(async (p) => {
      const pg = await window.doc.getPage(p); const vp = pg.getViewport({ scale: 1.4 });
      const c = document.getElementById('c'); c.width = vp.width; c.height = vp.height;
      await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise; return [vp.width, vp.height];
    }, p);
    await page.setViewport({ width: Math.ceil(dim[0]), height: Math.ceil(dim[1]) });
    await (await page.$('#c')).screenshot({ path: path.join(out, `pdf-p${p}.png`) });
  }
  await browser.close();
})();
