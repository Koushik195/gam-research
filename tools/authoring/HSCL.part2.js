// Himadri report, part B (1/3): shared context, cover, story in charts, business, history.
const fs = require('fs');
const path = require('path');
const { forwardMedian } = require('./valuation-blend');
const { ratingFor } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'HSCL', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'HSCL.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q), A26 = SA.find(a => a.fy === 'FY26');
const price = M.price.last, mcap = M.meta.marketCap, BM = V.blend.methods, mv = k => BM.find(m => m.key === k);
const epsSep28 = mv('pe').metric, rating = ratingFor(V.upside);
// EBITDA per tonne: consolidated core EBITDA / standalone volume (annual); standalone EBITDA / standalone volume (quarterly).
const ebt = SA.map(a => Math.round(a.coreEbitda * 1e7 / a.volume));
const qEbt = SQ.map(q => Math.round(q.saEbitda * 1e7 / q.saVolume)), qRpt = SQ.map(q => Math.round(q.saRev * 1e7 / q.saVolume));
const q1 = SQ.at(-1), q1Core = q1.cmcEbit + q1.powerEbit + 21.2, q1CoreEbt = Math.round(q1Core * 1e7 / q1.saVolume);
// Forward P/E history (house rule: median since Apr-2021 excluding trough years).
const FM = forwardMedian('HSCL', M), fwdMed = FM.median, fwdPe = FM.series;
const fwdSince24 = (() => { const v = fwdPe.filter(x => x[0] >= '2024-01-01').map(x => x[1]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; })();
const fwdTo23 = (() => { const v = fwdPe.filter(x => x[0] < '2023-07-01').map(x => x[1]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; })();
const PEER_SYMS = ['HSCL', 'PCBL', 'EPIGRAL', 'NEOGEN', 'FLUOROCHEM', 'HEGAM', 'GRAPHITE'];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
// Trailing P/E on the as-of date vs its own five-year median (sector de-rating test).
const derate = sym => { const S = JSON.parse(fs.readFileSync(path.join(RD, '..', '..', sym, 'screener.json'), 'utf8')); const pe = S.charts.pe['Price to Earning'].filter(([d, v]) => d <= ASOF && v > 0); const v = pe.filter(([d]) => d >= '2021-09-30').map(x => x[1]).sort((a, b) => a - b); const med = v[Math.floor(v.length / 2)]; return { now: pe.at(-1)[1], med, chg: (pe.at(-1)[1] / med - 1) * 100 }; };
const CHEM = ['SRF', 'NAVINFLUOR', 'PIIND', 'AARTIIND', 'DEEPAKNTR', 'VINATIORGA', 'CLEAN', 'ATUL'];
const DR = Object.fromEntries([...PEER_SYMS, ...CHEM].map(s => [s, derate(s)]));
const chemChg = CHEM.map(s => DR[s].chg).sort((a, b) => a - b), sectorDerate = chemChg[Math.floor(chemChg.length / 2)];
// What the price implies for the battery business: market value less core at 16x and Others at 10x Sep-28E EBITDA and Sep-27E net cash (model basis).
const segE = (k, i) => F.seg[k].adjEbitda[i], sep28 = k => (segE(k, 1) + segE(k, 2)) / 2;
const ndSep27 = (F.treasury[0] + F.treasury[1]) / 2, impliedNem = mcap - (16 * sep28('core') + 10 * sep28('oth') + ndSep27);
const ctx = { fs, path, C, D, SG, M, F, V, A, n0, n1, ASOF, ASOF_TXT, SA, SQ, QL, A26, price, mcap, mv, epsSep28, rating, ebt, qEbt, qRpt, q1Core, q1CoreEbt, FM, fwdMed, fwdPe, fwdSince24, fwdTo23, PEER_SYMS, PEERS, DR, CHEM, sectorDerate, segE, sep28, ndSep27, impliedNem };

const cover = {
  headline: 'A coal-tar champion priced as a battery-materials company: the profits have not caught up with the price',
  lead: `Himadri turns coal tar, a by-product of steel-making, into pitch for aluminium smelters and graphite electrodes, carbon black for tyres and plastics, naphthalene and speciality oils. It is India's largest pitch maker (65%+ share) and has quadrupled its EBITDA per tonne since FY22, taking net profit from ₹39 cr to ₹755 cr. Now it is spending ~₹2,000 cr on battery materials (LFP cathode, anode), carbon nanotubes and a revived tyre brand (Birla Tyres). The only institutional broker, ICICI Securities, values it on a sum of the parts with the core on EV/EBITDA; we use **P/E: 25x Sep-28E EPS of ₹${n1(epsSep28)}** (its own forward median since 2021), which gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**, so **we initiate with ${rating}.** EV/EBITDA (₹${n0(mv('ev').value)}) agrees; the DCF (₹${n0(mv('dcf').value)}) is lower still. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The core business has been transformed', p: `EBITDA per tonne rose from ~₹4,400 (FY22) to ₹${n0(A26.coreEbitda * 1e7 / A26.volume)} (FY26) and ~₹${n0(q1CoreEbt)} in Q1FY27, on speciality carbon black (now 130 kt), better pitch grades and cost control. ROE is ~18% and the company is net cash. This is a well-run, integrated business.` },
    { h: 'But growth was margin, not volume, and margins can turn', p: 'Revenue was flat from FY23 to FY26 and volume grew 2% in FY26; Q1FY27 volume fell 6% while prices rose 23% on costlier raw materials. We assume EBITDA per tonne eases to ~₹20,500 in FY27. The new capacity (pitch exports, anthraquinone, SSCB, CNT) is real but small next to a ₹4,400 cr core.' },
    { h: 'The new bets are early and capital-hungry', p: `LFP (₹1,125 cr) starts with a 2,000 t plant in Q3FY27 and has no disclosed orders; the company prices at par with China. Tyres absorbed ~₹490 cr of NCD funding for ₹187 cr of FY26 revenue at break-even. Free cash flow turns negative in FY27-28E on our numbers, and ROE dips to ~${Math.round(F.roe[1])}%.` },
    { h: 'The price already pays for success', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E EPS and ${n1(DR.HSCL.now)}x trailing (five-year median ${n1(DR.HSCL.med)}x), while listed chemical peers trade a median ${Math.abs(Math.round(sectorDerate))}% below their medians. Valuing the core at 16x EBITDA, the market implies ~₹${n0(Math.round(impliedNem / 100) * 100)} cr for battery materials that have yet to sell.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [{ k: 'Accounting', v: 'AMBER' }, { k: 'Predictability', v: 'AMBER' }, { k: 'Earnings momentum', v: 'GREEN' }, { k: 'Competitive position', v: 'GREEN' }, { k: 'Valuation', v: 'RED' }],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether volume returns (management promised growth "from both volume and value") and whether EBITDA per tonne holds near Q1\'s ~₹23,700.',
    'LFP: commissioning of the 2,000 tpa plant (Q3FY27) and the first customer approvals (sample stages C and D); any disclosed offtake.',
    'Anode: announcement of a commercial-scale plant and its capex; Sicona and IBC milestones (IBC\'s India gigafactory targeted for Q4FY27).',
    'Birla Tyres: EBITDA break-even in FY27 as guided; approvals for the scheme to demerge DBRL\'s tyre business into HSCL.',
    'Anthraquinone/carbazole Phase 1 (Q2FY27), CNT (Q4FY27); liquid pitch export volumes.',
    'Management\'s FY28 target of ₹1,100 cr+ PAT: we are at ~₹{{F.pat.1|num}} cr.',
  ],
};

module.exports = { ctx, cover };
