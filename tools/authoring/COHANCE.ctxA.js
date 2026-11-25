// Cohance Lifesciences initiation, shared context part A: loads the research JSONs and the built model and computes the five-line
// revenue build (checked against model revenue), the entity build for tax plus minorities (standalone + NJ Bio 56% + Sapala 67.5%;
// the engine has no minority line, so assumptions.taxRate carries tax PLUS minorities, APOLLOHOSP precedent), the other-income
// build (6.5% on average cash and liquid funds + Rs3.0 cr), the interest build and the cash paths. Part B (COHANCE.ctxB.js) does
// the valuation. Both are merged by COHANCE.ctx.js.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'COHANCE', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'COHANCE.json'), 'utf8'));
const RAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'COHANCE', 'screener.json'), 'utf8')); // unpatched
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions, SC = M.forecast.scenarios;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const pc1 = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const half = x => Math.round(x * 2) / 2; // PLAYBOOK §7c: nearest half-turn
const cagr = (a, z, y) => (Math.pow(z / a, 1 / y) - 1) * 100;
const medOf = arr => { const s = [...arr].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const pctl = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = d => { if (!d) return 'undated'; const [y, m, dd] = d.split('-'); return dd ? `${+dd}-${MON[+m - 1]}-${y.slice(2)}` : `${MON[+m - 1]}-${y.slice(2)}`; };
const b = A.labels.length - 1, ai = fy => A.labels.indexOf(fy);
const YRS = F.years, sep = a => (a[1] + a[2]) / 2; // Sep-28E = ½ FY28E + ½ FY29E
const price = M.price.last, SHARES = F.shares, mcap = price * SHARES;
const SA = SG.annual, SQ = SG.quarterly, Q1 = C.q1fy27, FY26 = C.fy26, TRE = C.treasury;

// 1) Five-line build (assumptions.businessLines) must sum to model revenue
const BL = AS.businessLines, KEYS = ['smallMol', 'njBio', 'sapala', 'apiPlus', 'specChem'];
const LBL = { smallMol: 'Small-molecule CDMO incl. ADC payloads (standalone)', njBio: 'NJ Bio (US ADC bioconjugation, 56%)', sapala: 'Sapala (oligonucleotide building blocks, 67.5%)', apiPlus: 'API+ (APIs, pellets, formulations)', specChem: 'Specialty Chemicals (agrochemical CDMO, performance materials)' };
const LINES = Object.fromEntries(KEYS.map(k => { if (BL.levels?.[k]) return [k, BL.levels[k].slice()]; let v = BL.base[k]; return [k, YRS.map((_, i) => (v *= 1 + BL.growth[k][i] / 100))]; }));
const buildTot = YRS.map((_, i) => KEYS.reduce((s, k) => s + LINES[k][i], 0));
const baseTot = KEYS.reduce((s, k) => s + BL.base[k], 0);
if (Math.abs(baseTot / A.sales[b] - 1) > 0.001) throw new Error(`COHANCE build base ${baseTot} != FY26 ${A.sales[b]}`);
YRS.forEach((y, i) => { if (Math.abs(buildTot[i] / F.sales[i] - 1) > 0.003) throw new Error(`COHANCE build ${y}: ${n0(buildTot[i])} != model ${n0(F.sales[i])}`); });
const cdmoTot = YRS.map((_, i) => LINES.smallMol[i] + LINES.njBio[i] + LINES.sapala[i]);
const standaloneRev = YRS.map((_, i) => LINES.smallMol[i] + LINES.apiPlus[i] + LINES.specChem[i]);
const growthOf = k => YRS.map((_, i) => (LINES[k][i] / (i ? LINES[k][i - 1] : BL.base[k]) - 1) * 100);

// 2) Entity build: NJ Bio and Sapala P&L (our estimates), tax at 25.5% outside NJ Bio, minorities' share; effective (tax + NCI) / PBT
const NJ = { ebitda: [-95, -55, -25], da: 44, fin: 18, nci: 0.44 };      // Q1FY27 adj EBITDA -Rs32.8 cr; subsidiaries' D&A ~Rs15 cr and finance ~Rs4.5 cr a quarter
const SP = { margin: [30, 31, 32], da: 6, nci: 0.325, tax: 25 };          // 'strong EBITDA margin' (q1call); Q1FY27 residual ~Rs8.8 cr on Rs27.4 cr
const TAXR = 25.5;
const njPbt = YRS.map((_, i) => NJ.ebitda[i] - NJ.da - NJ.fin);
const spEbitda = YRS.map((_, i) => LINES.sapala[i] * SP.margin[i] / 100), spPbt = spEbitda.map(e => e - SP.da), spPat = spPbt.map(p => p * (1 - SP.tax / 100));
const ent = YRS.map((_, i) => { const pbt = F.pbt[i], tax = TAXR / 100 * (pbt - njPbt[i]), nci = NJ.nci * njPbt[i] + SP.nci * spPat[i]; return { pbt, tax, nci, owners: pbt - tax - nci, eff: (tax + nci) / pbt * 100 }; });
const taxBuild = ent.map(e => Math.round(e.eff * 10) / 10);
const taxOk = YRS.every((y, i) => Math.abs(taxBuild[i] - AS.taxRate[i]) <= 0.15);
const standaloneEbitda = YRS.map((_, i) => F.ebitda[i] - NJ.ebitda[i] - spEbitda[i]);
const nci26 = { pbt: 207.04, tax: 56.92, nci: -29.11, owners: 179.23 }, eff26 = (nci26.tax + nci26.nci) / nci26.pbt * 100;

// 3) Cash paths. Engine net cash (Screener cash + investments - borrowings incl. leases - the Rs695.5 cr minority buy-out liability);
//    gross liquid funds (cash, bank, current investments) move with the engine's net cash, borrowings and leases follow our path.
const ND0 = (A.cash[b] || 0) + (A.investments[b] || 0) + (AS.otherTreasury?.base || 0) - (A.borrowings[b] || 0);
const cashPath = [ND0, ...F.treasury];
const BORR = [TRE.mar26.borrowings, 190, 170, 150], LEASE = 225;
const GROSS0 = TRE.mar26.cash + TRE.mar26.otherBank + TRE.mar26.currentInv;   // Rs325.98 cr
const grossPath = cashPath.map((c, i) => GROSS0 + (c - ND0) + (BORR[i] - BORR[0]));
const coNC0 = GROSS0 - TRE.mar26.borrowings;                                   // company basis Rs156 cr (deck Rs152.7 cr)

// 4) Other income: 6.5% on average liquid funds + Rs3.0 cr recurring (checked against assumptions)
const TY = 6.5, MISC = 3.0;
const oiTreas = YRS.map((_, i) => TY / 100 * (grossPath[i] + grossPath[i + 1]) / 2);
const oiBuild = YRS.map((_, i) => Math.round((oiTreas[i] + MISC) * 10) / 10);
const oiOk = YRS.every((y, i) => Math.abs(oiBuild[i] - AS.otherIncome[i]) <= 0.5);
const OIN = C.otherIncomeNote, gross25 = TRE.mar25.cash + TRE.mar25.otherBank + TRE.mar25.currentInv;
const yld26 = (OIN.FY26.interest + OIN.FY26.mfGains) / ((gross25 + GROSS0) / 2) * 100;
const yldQ1 = OIN.Q1FY27.exFx * 4 / ((GROSS0 + Q1.cash) / 2) * 100;
const ttmOi = M.quarterly.otherIncome.slice(-4).reduce((s, x) => s + x, 0);

// 5) Interest: 7.0% on ~Rs225 cr of leases + 7.5% on average borrowings + Rs1.0 cr other (checked against assumptions)
const KL = 7.0, KD = 7.5, OTHER_FIN = 1.0;
const intBuild = YRS.map((_, i) => KL / 100 * LEASE + KD / 100 * (BORR[i] + BORR[i + 1]) / 2 + OTHER_FIN);
const intOk = YRS.every((y, i) => Math.abs(intBuild[i] - AS.interest[i]) <= 0.6);

module.exports = { fs, path, ROOT, RD, C, D, SG, M, RAW, F, V, A, AS, SC, n0, n1, n2, pc, pc1, half, cagr, medOf, pctl, MON, shortDate, b, ai, YRS, sep, price, SHARES, mcap, SA, SQ, Q1, FY26, TRE,
  BL, KEYS, LBL, LINES, buildTot, cdmoTot, standaloneRev, growthOf, NJ, SP, TAXR, njPbt, spEbitda, spPbt, spPat, ent, taxBuild, taxOk, standaloneEbitda, nci26, eff26,
  ND0, cashPath, BORR, LEASE, GROSS0, grossPath, coNC0, TY, MISC, oiTreas, oiBuild, oiOk, OIN, yld26, yldQ1, ttmOi, KL, KD, OTHER_FIN, intBuild, intOk };
