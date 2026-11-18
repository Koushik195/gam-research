// Bayer CropScience report, part B (1 of 4): shared data, rating, cover, story in charts, business, history.
// Parts 2-4 (BAYERCROP.part2.js ... part4.js) hold the other research chapters; prose numbers come from
// research/company.json, deep.json, segments.json and the built model; forecast and valuation figures are
// live tokens ({{...}}) that follow assumptions.json. Written as of 30-Sep-2026 (Q1FY27 basis).
const fs = require('fs');
const path = require('path');
const { forwardSeries } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'BAYERCROP', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'BAYERCROP.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual, AS = M.forecast.assumptions;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const SRC = 'Bayer CropScience annual reports, investor meet (Nov-2025) and results releases; GAM Research';

const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const MIX = SA.filter(a => a.cornSeeds != null);
const A21 = SA.find(a => a.fy === 'FY21'), A25 = SA.find(a => a.fy === 'FY25'), A26 = SA.find(a => a.fy === 'FY26');
const cagr = (a, b, y) => (Math.pow(b / a, 1 / y) - 1) * 100;
const cornCagr = cagr(A21.cornSeeds, A25.cornSeeds, 4), cpCagr = cagr(A21.cpExRoundup, A25.cpExRoundup, 4);
const price = M.price.last, mcap = M.meta.marketCap || price * F.shares;
const b = A.labels.length - 1;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, peMult = mv('pe').mult;
const Q1 = C.q1fy27, RP = C.relatedParty.fy26, TX = C.tax, CT = C.cashAndTreasury.mar26;
const cashNow = CT.total, cashShare = cashNow / mcap * 100;
const high52 = M.price.high52, fromHigh = (price / high52 - 1) * 100;
const divYield = F.dps[0] / price * 100;

// One-year-forward P/E history (actual EPS, our estimates for FY27-28E) and its statistics.
const fwdPe = forwardSeries('BAYERCROP', M, 'eps').filter(x => x[0] >= '2016-04-01');
const stat = from => { const v = fwdPe.filter(x => x[0] >= from).map(x => x[1]).sort((a, c) => a - c); return { med: v[Math.floor(v.length / 2)], p25: v[Math.floor(v.length * 0.25)], p75: v[Math.floor(v.length * 0.75)], min: v[0], max: v.at(-1) }; };
const H21 = stat('2021-04-01'), H16 = stat('2016-04-01');

// Peers at the 30-Sep-2026 close, and each one's P/E vs its own five-year median.
const PEER_SYMS = ['BAYERCROP', 'SUMICHEM', 'PIIND', 'DHANUKA', 'RALLIS', 'UPL', 'COROMANDEL'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), P = Object.fromEntries(PEERS.map(p => [p.symbol, p]));
const med5 = sym => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (S.charts?.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, c) => a - c); return v[Math.floor(v.length / 2)]; };
const derate = Object.fromEntries(PEER_SYMS.map(s => [s, P[s].pe && med5(s) ? (P[s].pe / med5(s) - 1) * 100 : null]));
const DOM = ['SUMICHEM', 'PIIND', 'DHANUKA', 'RALLIS'];
const domDr = DOM.map(s => derate[s]).sort((a, c) => a - c), domMed = (domDr[1] + domDr[2]) / 2;
const afterDerate = H21.med * (1 + domMed / 100);
const shortName = n => n.replace(/ Ltd\.?$/, '').replace(/ India$| International$/, '').replace('P I Industries', 'PI Industries').replace('Bayer Cropscience', 'Bayer CropScience');
const epsCagrHist = cagr(A.eps[b - 5], A.eps[b], 5), epsCagrFc = cagr(A.eps[b], F.eps[2], 3);

const rating = 'BUY';
const buyBelow = Math.round(buyAt(V.tp) / 5) * 5, sellAbove = Math.round(sellAt(V.tp) / 5) * 5;

const cover = {
  headline: 'A de-rated Bayer franchise with a corn-seed engine: cheap enough, just, despite a weak season',
  lead: `Bayer CropScience is the Indian listed arm of Bayer AG (71.4% owned): crop protection (~76% of FY26 turnover), DEKALB hybrid corn seed (~19%) and small exports. It has no debt, ₹${n0(cashNow)} cr of cash at Mar-2026 and pays out almost all its profit (₹150 a share for FY26). The shares have fallen ${Math.abs(Math.round(fromHigh))}% from their 52-week high to ₹${n0(price)}; Q1FY27 revenue fell 4% and the 2026 monsoon ended 12.6% below normal. The street values the stock on **P/E** (HSBC: 29x FY27E). We forecast EPS of ₹${n1(F.eps[0])} in FY27E (core profit down slightly; a one-off gain lifts the reported figure) and ₹${n1(F.eps[1])} in FY28E. Applying **${peMult}x to Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with BUY**, only just above our +15% line. The cross-checks are lower (EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}), so this is a valuation call, not a growth call. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The price already assumes little growth', p: `At ₹${n0(price)} the stock trades at ${n1(price / F.eps[1])}x our FY28E EPS, against a ${n1(H21.med)}x one-year-forward median since Apr-2021, and yields ~${n1(divYield)}% on our FY27E dividend. Even after cutting that median for the sector's ~${Math.abs(Math.round(domMed))}% de-rating and slightly lower growth, ${peMult}x leaves {{dcf.upside|chg}}.` },
    { h: 'Corn seed is the engine; crop protection is not', p: `Corn seed revenue grew from ₹${n0(A21.cornSeeds)} cr (FY21) to ₹${n0(A25.cornSeeds)} cr (FY25), ~${Math.round(cornCagr)}% a year, and reached ~19% of FY26 turnover; crop protection excluding Roundup grew ~${Math.round(cpCagr)}% a year. Corn earns more and its seed-production profit is taxed as exempt agricultural income (implied ~₹${n0(TX.impliedExemptAgriIncome.FY26)} cr in FY26).` },
    { h: 'The parent sets the margin', p: `Half of all purchases are from Bayer group companies; Bayer AG alone supplied ₹${n0(RP.purchasesFromBayerAG)} cr in FY26 (₹${n0(RP.purchasesFromBayerAGFY25)} cr in FY25). When imported input costs rose and Chinese generics capped prices, the EBITDA margin fell to 12.6% (FY25). More local sourcing is management's main margin lever, but the parent decides its pace.` },
    { h: 'The near term is weak, and the cross-checks are cautious', p: `Q1FY27 profit rose 15% only because of a ₹${n1(Q1.oneOffGain)} cr gain on selling the flubendiamide rights; core profit fell ~2%. The monsoon was deficient and El Niño threatens the rabi season. Our DCF (₹${n0(mv('dcf').value)}) is below the price: the upside depends on the market paying a de-rated, but still premium, multiple again.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): how much the deficient monsoon cut kharif sales, and the first FY27 interim dividend (₹90 a share last year).',
    'The rabi season (November-March) under El Niño: southern reservoirs were a third below normal in late September, which matters for rabi corn seed.',
    'New molecules: Xivana Smart (fruit and vegetables) and Plenexos (insecticide) registrations and launches; corn hybrids for new states.',
    'Glyphosate: the Delhi High Court case on restricting use; the paraquat ban (final order 22-Sep-2026) should help Roundup.',
    'Sourcing and transfer prices: purchases from Bayer AG, and the FY28 related-party limit (₹3,500 cr) approved at the August AGM.',
  ],
};

module.exports = { fs, path, ROOT, RD, C, D, SG, M, F, V, A, AS, n0, n1, pc, ASOF, ASOF_TXT, SRC, SA, SQ, QL, MIX, A21, A25, A26, cagr, cornCagr, cpCagr, price, mcap, b, BM, mv, epsSep28, peMult, Q1, RP, TX, CT, cashNow, cashShare, high52, fromHigh, divYield, fwdPe, H21, H16, PEERS, P, derate, DOM, domMed, afterDerate, shortName, epsCagrHist, epsCagrFc, rating, buyBelow, sellAbove, ruleText, cover };

// Assemble: parts 2-4 add the chapters; this file is required by BAYERCROP.js.
const P2 = require('./BAYERCROP.part2'), P3 = require('./BAYERCROP.part3'), P4 = require('./BAYERCROP.part4'), P5 = require('./BAYERCROP.part5');
module.exports.sections = p => [P2.narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.corn, P3.cropProtection, P3.parent, P3.moat, p.seasons, p.financials, P3.guidance, P5.quality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P4.forecasts, P4.street, P4.valuation, P4.risks, p.statements, P4.glossary];
module.exports.statementNotes = P4.statementNotes;
