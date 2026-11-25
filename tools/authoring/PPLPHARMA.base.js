// Piramal Pharma: shared helpers for the Part A files (PPLPHARMA.js, PPLPHARMA.partA2.js): the built model, Screener
// ratios frozen at the as-of date, formatting and small sums. No research inputs here.
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'PPLPHARMA', 'research');
const SCR = JSON.parse(fs.readFileSync(path.join(RD, '..', 'screener.json'), 'utf8'));
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'PPLPHARMA.json'), 'utf8'));
const A = M.annual, b = A.labels.length - 1, ix = l => A.labels.indexOf(l);
const RT = SCR.tables.ratios, keepR = RT.periods.map(p => `${p.slice(-4)}-05-30` <= '2026-09-30');
const RL = RT.periods.filter((_, i) => keepR[i]).map(p => 'FY' + p.slice(-2));
const RR = k => RT.rows[k].filter((_, i) => keepR[i]);
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const sum = (k, from, to) => { let s = 0; for (let i = ix(from); i <= ix(to); i++) s += A[k][i] || 0; return s; };
const SRC = { co: 'Company filings, Screener.in (consolidated), GAM Research' };
const nd = l => A.borrowings[ix(l)] - A.cash[ix(l)] - A.investments[ix(l)];
const FY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];

module.exports = { fs, path, RD, SCR, M, A, b, ix, RL, RR, n0, n1, sum, SRC, nd, FY };
