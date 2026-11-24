// BSE-500 benchmark series. Long daily history comes from the investing.com export
// (data/benchmark/bse500-investing.csv, same format the PMS app uses); Screener's weekly
// index series (data/benchmark/bse500-screener.json, written by refreshBenchmark) tops it up
// to the latest week.
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'data', 'benchmark');
const CSV = path.join(DIR, 'bse500-investing.csv');
const SCREENER = path.join(DIR, 'bse500-screener.json');
const SCREENER_INDEX_ID = 1272601; // Screener's internal id for the BSE 500 index

function loadCsv() {
  if (!fs.existsSync(CSV)) return [];
  const lines = fs.readFileSync(CSV, 'utf8').replace(/^﻿/, '').split(/\r?\n/).slice(1);
  const out = [];
  for (const line of lines) {
    const cells = line.match(/"([^"]*)"/g);
    if (!cells) continue;
    const [d, m, y] = cells[0].replace(/"/g, '').split('-');
    const px = Number(cells[1].replace(/[",]/g, ''));
    if (y && Number.isFinite(px)) out.push([`${y}-${m}-${d}`, px]);
  }
  return out.sort((a, b) => a[0].localeCompare(b[0]));
}

function loadBenchmark() {
  const csv = loadCsv();
  let scr = [];
  try { scr = JSON.parse(fs.readFileSync(SCREENER, 'utf8')).values; } catch {}
  const last = csv.length ? csv[csv.length - 1][0] : '';
  return csv.concat(scr.filter(([d]) => d > last));
}

async function refreshBenchmark() {
  const r = await fetch(`https://www.screener.in/api/company/${SCREENER_INDEX_ID}/chart/?q=Price-DMA50-DMA200-Volume&days=10000`, {
    headers: { 'User-Agent': require('./http-identity').UA },
  });
  if (!r.ok) throw new Error(`benchmark ${r.status}`);
  const j = await r.json();
  const values = j.datasets.find(d => d.metric === 'Price').values.map(([d, v]) => [d, Number(v)]);
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(SCREENER, JSON.stringify({ fetchedAt: new Date().toISOString(), values }));
  return values.length;
}

module.exports = { loadBenchmark, refreshBenchmark };

if (require.main === module) refreshBenchmark().then(n => console.log(`BSE 500: ${n} weekly points; merged ${loadBenchmark().length}`));
