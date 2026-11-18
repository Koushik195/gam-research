// Deepak Nitrite report, part B: story, business, history, industry, tailwind test, Phenolics,
// Advanced Intermediates, the polycarbonate programme, moat, earnings quality, ownership,
// governance, forecasts, street, valuation, verdict, glossary. Written as of 30-Sep-2026
// (Q1FY27 basis). Prose numbers come from research/company.json, deep.json, segments.json and the
// built model; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const fs = require('fs');
const path = require('path');
const { streetBlocks, forwardSeries } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const ROOT = path.join(__dirname, '..', '..');
const RD = path.join(ROOT, 'data', 'raw', 'DEEPAKNTR', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json');
const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'models', 'DEEPAKNTR.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, AS = M.forecast.assumptions;
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pctChg = (a, b) => Math.round((a / b - 1) * 100);
const SRC = 'Deepak Nitrite results presentations, calls and annual reports, GAM Research';

const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const ann = fy => SA.find(a => a.fy === fy);
const A26 = ann('FY26'), A25 = ann('FY25'), A22 = ann('FY22');
const S2 = SA.filter(a => a.aiRev != null), FY2 = S2.map(a => a.fy);
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric, ebitdaSep28 = mv('ev').metric;
const pe28 = price / F.eps[1], peSep28 = price / epsSep28;
const nd = i => -F.treasury[i];
const nd100 = i => Math.round(nd(i) / 100) * 100;
const Q1 = C.q1fy27;
const phPt = F.seg.ph.revenue[1] * 0.01 * (1 - AS.taxRate[1] / 100) / F.shares; // EPS per 1pt of Phenolics margin, FY28E

// Peers as of the 30-Sep-2026 close, with each peer's five-year median trailing P/E (Screener).
const PEER_SYMS = ['DEEPAKNTR', 'AARTIIND', 'ATUL', 'VINATIORGA', 'NAVINFLUOR', 'CLEAN', 'SRF', 'HSCL', 'EPIGRAL'];
const PEERS = Object.fromEntries(peersAsOf(PEER_SYMS, ASOF).map(p => [p.symbol, p]));
const median = a => { const v = a.filter(x => x != null).slice().sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : null; };
const med5 = (sym, chart, key) => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')); return median((S.charts[chart]?.[key] || []).filter(([d, v]) => d >= '2021-09-30' && d <= ASOF && v > 0 && v < 300).map(x => x[1])); };
for (const s of PEER_SYMS) { PEERS[s].pe5 = med5(s, 'pe', 'Price to Earning'); PEERS[s].ev5 = med5(s, 'evEbitda', 'EV Multiple'); PEERS[s].peVs = PEERS[s].pe5 ? (PEERS[s].pe / PEERS[s].pe5 - 1) * 100 : null; }
const sectorDerate = median(PEER_SYMS.map(s => PEERS[s].peVs));
const DN = PEERS.DEEPAKNTR;
const pname = p => p.name.replace(/ Ltd$/, '').replace(' International', '').replace(' Speciality Chemical', ' Speciality').replace(' & Technology', '');

// One-year-forward P/E history (actual EPS, then our estimates).
const fwd = forwardSeries('DEEPAKNTR', M, 'eps');
const fwd19 = fwd.filter(x => x[0] >= '2019-04-01'), fwd21 = fwd.filter(x => x[0] >= '2021-04-01');
const fwdMed21 = median(fwd21.map(x => x[1])), fwdMed19 = median(fwd19.map(x => x[1]));

// Street (each broker's latest note by 30-Sep-2026).
const BR = D.street.brokers;
const tpBrokers = BR.filter(b => b.tp);
const plE = D.street.estimates.pl;
const rating = 'SELL';
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const dcfV = mv('dcf').value;

// Net debt path (actual, then model).
const ndLabels = ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years];
const ndVals = [...['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => M.annual.netDebt[M.annual.labels.indexOf(l)]), ...F.years.map((_, i) => Math.round(nd(i)))];

// ---------------------------------------------------------------- Cover
const cover = {
  headline: 'A record quarter on a war-time phenol spike, a ₹8,600 cr capex bill ahead: the price assumes too much',
  lead: `Deepak Nitrite makes phenol, acetone and IPA (Phenolics, ~70% of revenue) and nitration-based chemical intermediates (Advanced Intermediates, ~30%). Q1FY27 was its best quarter ever (net profit ₹345 cr, +207%) because the Middle East war widened phenol spreads. We think that spike fades: spreads were already easing in August, and a new 345 ktpa domestic phenol plant (Haldia Petrochemicals) is due to start in October 2026. Meanwhile ~₹8,600 cr of capex over FY27-29 for a propylene-to-polycarbonate chain adds depreciation, interest and debt well before it adds revenue. We value Deepak Nitrite the way the street does, on **P/E: 25x Sep-28E EPS of ₹${n1(epsSep28)}**. That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with SELL.** EV/EBITDA (₹${n0(mv('ev').value)}) confirms it; our DCF (₹${n0(dcfV)}) says today's cash flows support far less. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Q1 was a spike, not a new base', p: `Phenolics EBIT jumped to ₹418 cr (23.5% margin) in Q1FY27 from ₹118 cr a year earlier, on war-time spreads (PL: "amid supply disruptions caused by the West Asia crisis"). Phenolics margins have swung from 28% (FY21) to ~14% (FY23-26) with the global cycle. PL notes spreads were already moderating week by week in August, and Haldia's 345 ktpa plant (close to Deepak's own ~350-400 ktpa) is due within weeks. We model Phenolics EBITDA margin 17.5% in FY27 and 14% after.` },
    { h: 'Advanced Intermediates: new plants, old problem', p: `AI EBIT fell from ₹596 cr (FY22) to ₹107 cr (FY26) as Chinese pricing hit; the segment earned a 4.8% pre-tax return on capital in FY26 after ₹1,004 cr of new plants. Q1FY27 recovered to an 8.3% EBIT margin. China's curbs on nitration help, but the new nitric acid plant ran at ~45% in Q4FY26 and two plants slipped. We assume margins recover to 15.5% EBITDA by FY29, still well below FY22-24.` },
    { h: 'The polycarbonate bet: big, late and debt-funded', p: `The ₹11,500 cr propylene-to-polycarbonate programme (plus a ₹2,500 cr BPA plant approved in August) is the long-term story. But the start date has slipped twice (Dec-2027 → Jun-2028 → H2 FY28-29), its returns are undisclosed and global PC capacity is growing. Net debt rises from ₹1,156 cr to ~₹${n0(nd100(2))} cr by FY29 in our model; ROE falls to ~${Math.round(F.roe[2])}%, below the 12.5% cost of equity.` },
    { h: 'Valuation: the street\'s own yardstick says too expensive', p: `Brokers use 24-29x FY28E EPS. Our FY28E EPS (₹${n1(F.eps[1])}) is ${Math.abs(pctChg(F.eps[1], plE.FY28E.eps))}% below PL and ${Math.abs(pctChg(F.eps[1], D.street.estimates.mosl.FY28E.eps))}% below Motilal Oswal because we assume normal spreads and charge the project's depreciation and interest. At ₹${n0(price)} the stock trades at ${n1(pe28)}x our FY28E; our 25x (the ~36x one-year-forward median since 2021, cut by the sector's ~30% de-rating) gives {{dcf.tp|inr}}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due Oct/Nov-2026): how far Phenolics margins fall after the war-time peak; first MIBK/MIBC sales.',
    'Start-up of Haldia Petrochemicals\' 345 ktpa phenol plant (due to start in October 2026) and its effect on Indian phenol prices.',
    'Commissioning of the multipurpose agro-intermediates and alkylation plants (commercial volumes from January 2027) and stable running of the nitric acid plant.',
    'Polycarbonate milestones: relocation of the Stade (Germany) equipment, civil works, any further slip beyond H2 FY28-29; firm cost of the BPA plant.',
    'Funding: drawdown of the tied-up project debt; any equity raise (management: "if at all required, we\'ll approach the market").',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: `Phenolics now earns ~${Math.round(A26.phEbit / A26.consEbit * 100)}% of segment profit`, unit: 'Segment EBIT (₹ crore)', x: FY2, series: [{ name: 'Phenolics', values: S2.map(a => Math.round(a.phEbit)), fmt: 'num' }, { name: 'Advanced Intermediates', values: S2.map(a => Math.round(a.aiEbit)), fmt: 'num' }], minLabel: 60, source: 'Company annual reports (segment note); FY22 restated' },
      { type: 'line', title: 'Phenolics margin follows the global cycle', unit: 'Phenolics EBITDA margin (%, annual)', x: SA.map(a => a.fy), series: [{ name: 'Phenolics', values: SA.map(a => a.phEbitdaPct), fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: 'Company annual reports; EBITDA = segment EBIT + segment depreciation' },
    ] },
    { pair: [
      { type: 'line', title: 'Q1FY27: a war-time spike in Phenolics', unit: 'Segment EBIT margin (%, quarterly)', x: QL, series: [{ name: 'Phenolics', values: SQ.map(q => q.phEbitPct), fmt: 'pct' }, { name: 'Advanced Intermediates', values: SQ.map(q => q.aiEbitPct), fmt: 'pct' }], labels: 'last', min: 0, max: 30, source: SRC },
      { type: 'line', title: 'AI returns collapsed as capital went in', unit: 'Segment pre-tax ROCE (%)', x: FY2, series: [{ name: 'Phenolics', values: S2.map(a => a.phRoce), fmt: 'pct0' }, { name: 'Advanced Intermediates', values: S2.map(a => a.aiRoce), fmt: 'pct0' }], labels: 'all', source: 'Company annual reports; GAM calculation (segment EBIT ÷ segment assets less liabilities)' },
    ] },
    { pair: [
      { type: 'column', title: 'The capex wave: ₹8,600 cr in FY27-29E', unit: '₹ crore', x: 'fin.labels', from: 'FY20', series: [{ name: 'Cash from operations', ref: 'fin.cfo', fmt: 'num' }, { name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'none', source: 'Company, GAM Research estimates' },
      { type: 'column', title: 'Net debt: from net cash to ~₹7,500 cr', unit: 'Net debt (₹ crore; negative = net cash)', x: ndLabels, series: [{ name: 'Net debt', values: ndVals, fmt: 'num' }], labels: 'all', source: 'Company (FY20-26), GAM Research estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${Math.round(pe28)}x our FY28E today`, unit: 'Price ÷ next full-year EPS (x)', x: fwd19.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwd19.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(fwdMed21), text: `Median since 2021: ${Math.round(fwdMed21)}x` }, { v: 25, text: 'Our target: 25x', color: '#cf8f1f' }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpBrokers.map(b => b.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...tpBrokers.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press reports (May-Aug 2026), GAM Research' },
    ] },
  ],
};

// ---------------------------------------------------------------- Business
const business = {
  id: 'business', nav: 'What Deepak Nitrite does', kicker: 'The business', title: 'Two businesses: a phenol commodity plant and a nitration chemistry house',
  blocks: [
    { p: 'Deepak Nitrite was founded in 1970 to make sodium nitrite. It grew into a maker of chemical intermediates (nitro-toluidines, xylidines, oximes, optical brighteners) for dyes, agrochemicals, pharma and rubber, and in FY19-20 its subsidiary Deepak Phenolics started a world-scale cumene-phenol-acetone complex at Dahej. Phenolics now brings ~70% of revenue and ~85% of segment profit. A second subsidiary, Deepak Chem Tech (DCTL), is the growth vehicle: nitric acid, nitration, hydrogenation, fluorination, MIBK/MIBC and the polycarbonate programme. Seven plants at five locations, 36+ products, 1,500+ customers; 85% of Q1FY27 revenue was domestic.' },
    { exhibit: { type: 'table', title: 'The two segments in FY26', head: ['Segment', 'What it makes', 'Revenue (₹ cr)', 'EBITDA margin', 'EBIT (₹ cr)', 'Capital employed (₹ cr)', 'Pre-tax ROCE'], wide: [1], rows: [
      ['**Phenolics** (Deepak Phenolics)', 'Cumene, phenol, acetone, isopropyl alcohol (IPA); MIBK/MIBC and acetophenone from Q2FY27. >50% India share in phenol and acetone; almost all sold in India', n0(A26.phRev), A26.phEbitdaPct + '%', n0(A26.phEbit), n0(A26.phCapEmployed), A26.phRoce + '%'],
      ['**Advanced Intermediates**', 'Sodium nitrite (India #1), nitro-toluidines, xylidines and oximes (global top-3), cumidines, OBA/DASDA, fuel additives; nitric acid, nitration, hydrogenation and fluorination products (DCTL). ~50% exported', n0(A26.aiRev), A26.aiEbitdaPct + '%', n0(A26.aiEbit), n0(A26.aiCapEmployed), A26.aiRoce + '%'],
      ['Less inter-segment', '', '−' + n0(A26.interSeg), '', '', '', ''],
      { hl: true, cells: ['**Consolidated**', '', n0(A26.consRev), '', n0(A26.consEbit), '', ''] },
    ], source: 'Annual report FY26 (note 43); EBITDA = segment EBIT + segment depreciation; ROCE = segment EBIT ÷ (segment assets − liabilities), GAM' } },
    { h: 'How each business makes money' },
    { p: '**Phenolics is a spread business.** Benzene and propylene make cumene, which splits into phenol and acetone (roughly 1 tonne of phenol gives ~0.6 tonne of acetone); acetone is also turned into IPA, and from FY27 into MIBK/MIBC. Profit depends on the gap between product prices and feedstock costs (the "spread"), which is set by global supply: Indian prices track import parity. Deepak\'s edge is scale, logistics and reliability for thousands of Indian buyers (laminates, plywood, pharma, agrochemicals) who prefer not to import. **Advanced Intermediates is a chemistry business**: nitration, reduction and diazotization of aromatics, sold to dye, agro and pharma makers worldwide. It competes head-on with Chinese producers, which is why its margins collapsed in FY24-26.' },
    { pair: [
      { type: 'stacked', title: 'Revenue mix: Phenolics ~2/3', unit: 'Segment revenue (₹ crore)', x: FY2, series: [{ name: 'Phenolics', values: S2.map(a => Math.round(a.phRev)), fmt: 'num' }, { name: 'Advanced Intermediates', values: S2.map(a => Math.round(a.aiRev)), fmt: 'num' }], minLabel: 400, source: 'Company annual reports' },
      { type: 'column', title: 'Exports have shrunk to 15% of revenue', unit: 'Revenue outside India (% of total)', x: SA.filter(a => a.exportPct != null).map(a => a.fy), series: [{ name: 'Exports', values: SA.filter(a => a.exportPct != null).map(a => a.exportPct), fmt: 'pct' }], labels: 'all', source: 'Annual reports (geographical segment note)' },
    ] },
  ],
};

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From sodium nitrite (1970) to a phenol and polycarbonate bet',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, h.event, h.impact || '–']), source: 'Company filings, annual reports, Screener.in' } },
    { callout: `**Corporate actions:** ${C.corporateActions} The capital story is self-funded expansion: the Dahej phenol plant in FY17-20, then DCTL from FY24, now moving to large-scale borrowing for polycarbonate.` },
  ],
};

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Phenol is a global commodity; India is short, but not for long',
  blocks: [
    { p: 'India consumes more phenol and acetone than it makes, so Deepak Phenolics sells at import parity and earns whatever the Asian spread allows. In FY26 Chinese and Korean additions "caused margins to collapse in the Asian market" (DPL\'s chairman). Then the Middle East war disrupted feedstock and freight in Q4FY26-Q1FY27; India even waived import duty on phenol from 2-Apr to 30-Jun-2026, yet spreads widened sharply "amid supply disruptions caused by the West Asia crisis" (PL), and domestic suppliers earned record margins. Two things now work against Deepak: global capacity remains ample, and **Haldia Petrochemicals\' ₹6,000 cr phenol-acetone complex (345 ktpa phenol, close to Deepak\'s own capacity) was due to start in October 2026.** In the August call the Group CFO said "no new capacities are coming up". We disagree.' },
    { exhibit: { type: 'table', title: 'Market forces', head: ['Theme', 'Direction', 'What it means for Deepak'], wide: [2], rows: [
      ['Middle East war (Feb-Jun 2026)', 'Tailwind, fading', 'Record Phenolics spreads in Q4FY26-Q1FY27; PL saw spreads moderating week by week in August.'],
      ['Haldia Petrochemicals\' new phenol plant (345 ktpa)', 'Headwind', 'A second large domestic producer from Q3FY27; takes import share first, but caps Indian prices and Deepak\'s premium.'],
      ['Chinese phenol and nitration capacity', 'Headwind', 'Kept Asian spreads and AI realisations low through FY24-26.'],
      ['China\'s curbs on hazardous chemistries (Dec-2025)', 'Tailwind', 'Supports nitration product prices; management says it has "already started happening".'],
      ['Phenol import duty', 'Mixed', 'Nil duty 2-Apr to 30-Jun-2026 (Notification 12/2026-Customs), reimposed after.'],
      ['US trade (sodium nitrite)', 'Tailwind', 'US anti-dumping duty cut from ~45-48% to ~zero and reciprocal tariff to 18% (early 2026).'],
      ['Indian polycarbonate demand', 'Tailwind', 'Imports >300,000 t a year of PC resin, no local maker; but global PC capacity is growing (PL downgrade, Apr-2026).'],
    ], source: 'Company calls, annual report FY26, PL, Notification 12/2026-Customs, press (to 30-Sep-2026)' } },
    { exhibit: { type: 'table', title: 'Where phenol supply in India comes from', head: ['Source', 'Capacity / volume', 'Note'], wide: [2], rows: [
      ['Deepak Phenolics (Dahej)', 'Licensed ~300 ktpa; run-rate close to 400 ktpa (Q1FY27)', '>50% market share; ~₹70 cr to debottleneck to ~400 ktpa'],
      ['Haldia Petrochemicals / Adperma (Haldia)', '345 ktpa phenol, 215 ktpa acetone', 'Due to start in October 2026; first producer on the east coast'],
      ['Hindustan Organic Chemicals (HOCL)', 'Small', 'The only other domestic producer named by management (Aug-2026)'],
      ['Imports', 'Balance of demand', 'Asian and European suppliers; nil duty 2-Apr to 30-Jun-2026'],
      ['DCTL phenol-2 (planned)', '300 ktpa phenol, 185 ktpa acetone, 100 ktpa IPA', '₹3,500 cr; timed with Petronet LNG\'s propylene; mostly for captive BPA/PC'],
    ], source: 'Annual report FY26, Q1FY27 call, Hydrocarbon Processing (20-Aug-2026), Digital Refining (14-Nov-2024)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Deepak captures the shocks, not (yet) the structural shifts',
  blocks: [
    { verdicts: [
      ['Supply shock from the Middle East war', 'Yes', 'Phenolics EBIT ₹287 cr (Q4FY26) and ₹418 cr (Q1FY27) vs ₹118 cr a year earlier.', 'Real, but temporary by nature.'],
      ['Import substitution in phenol and acetone', 'Yes', '>50% share; record production in FY26; 2-millionth tonne in Feb-2026.', 'Already in the base; Haldia now competes for the same imports.'],
      ['China+1 and Chinese curbs in nitration chemistry', 'Partly', 'AI revenue +33% in Q1FY27, but EBIT margin only 8.3% vs 20%+ in FY22-23.', 'Volumes back; pricing power not yet.'],
      ['Import substitution in polycarbonate', 'No (not yet)', 'PC plant targeted H2 FY28-29; ~₹1,200 cr spent by Aug-2026.', 'An option with large capital at risk.'],
      ['Specialty chemistries (fluorination, photochlorination)', 'No (not yet)', 'Ramp-up from FY27; management declines to quantify revenue.', 'Cannot be valued today.'],
      ['US tariff and anti-dumping relief', 'Partly', 'Sodium nitrite duty gap down from ~106%; ~5,000 t a year to the US historically.', 'Small in group terms.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ---------------------------------------------------------------- Phenolics
const phenolics = {
  id: 'phenolics', nav: 'Phenolics', kicker: 'Segment', title: 'Phenolics: a well-run plant, priced by the world, with a new rival next door',
  blocks: [
    { pair: [
      { type: 'column', title: 'Phenolics revenue by quarter', unit: 'Phenolics revenue (₹ crore)', x: QL, series: [{ name: 'Phenolics', values: SQ.map(q => q.phRev), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Phenolics EBIT: ₹418 cr in Q1FY27', unit: 'Phenolics EBIT (₹ crore)', x: QL, series: [{ name: 'EBIT', values: SQ.map(q => q.phEbit), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { bullets: [
      `**Volumes are not the issue.** DPL runs at ~165% of the plant's original capacity after ₹80-100 cr of debottlenecking, hit record production in FY26 and is spending ~₹70 cr more to approach 400 ktpa of phenol. Management will not disclose volumes or spreads.`,
      `**Margins are the issue.** Segment EBITDA margin: 12.5% (FY20), 28.1% (FY21), 22.6% (FY22), 13.8-14.9% (FY23-26). Excluding the Gujarat GST incentive (₹161 cr in FY25, ₹102 cr in FY26), FY25-26 margins were only ${A25.phEbitdaExIncPct}% and ${A26.phEbitdaExIncPct}%. Q1FY27's 23.5% EBIT margin (22.6% excluding a ₹21.5 cr incentive) came from war-time spreads.`,
      `**Downstream additions** (MIBK, MIBC, acetophenone, commissioning from August 2026) add value to acetone. Management says pre-commissioning met design norms and MIBC exceeded design capacity, but declined to quantify revenue. China is oversupplied in MIBK (Feb-2026 call).`,
      `**Competition**: Haldia's 345 ktpa plant targets the same Indian buyers from Q3FY27. Deepak's answer is reliability and just-in-time supply ("Depend on Deepak"); that protects volume, not price.`,
    ] },
    { pair: [
      { type: 'line', title: 'Without the state incentive, margins were ~12-13%', unit: 'Phenolics EBITDA margin (%)', x: ['FY25', 'FY26'], series: [{ name: 'Reported', values: [A25.phEbitdaPct, A26.phEbitdaPct], fmt: 'pct' }, { name: 'Excluding Gujarat GST incentive', values: [A25.phEbitdaExIncPct, A26.phEbitdaExIncPct], fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Annual report FY26 (note 34, segment note), GAM calculation' },
      { type: 'column', title: 'Our Phenolics forecast: margin back to ~14%', unit: 'Phenolics EBITDA (₹ crore)', x: ['FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'EBITDA', values: [ann('FY24').phEbitda, A25.phEbitda, A26.phEbitda, ...F.seg.ph.adjEbitda].map(v => Math.round(v)), fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
    ] },
    { callout: `**Our view:** Phenolics is a good asset with high returns on depreciated capital (pre-tax ROCE ${A26.phRoce}% in FY26), but it has no pricing power. We model revenue +17% in FY27 (Q1 plus ~₹1,500 cr a quarter), +2% in FY28 as prices normalise against more volume and MIBK/MIBC, and +10% in FY29; EBITDA margin 17.5% then 14%, i.e. mid-cycle including the incentive.` },
  ],
};

// ---------------------------------------------------------------- Advanced Intermediates
const intermediates = {
  id: 'intermediates', nav: 'Advanced Intermediates', kicker: 'Segment', title: 'Advanced Intermediates: ₹1,000 cr of new plants, a 5% return so far',
  blocks: [
    { pair: [
      { type: 'column', title: 'AI revenue by quarter: +33% in Q1FY27', unit: 'AI revenue (₹ crore)', x: QL, series: [{ name: 'Advanced Intermediates', values: SQ.map(q => q.aiRev), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'AI EBITDA margin: from 27% to 9%', unit: 'AI EBITDA margin (%, annual)', x: [...FY2, ...F.years], series: [{ name: 'AI EBITDA margin', values: [...S2.map(a => a.aiEbitdaPct), ...F.years.map((_, i) => Math.round(F.seg.ai.adjEbitda[i] / F.seg.ai.revenue[i] * 1000) / 10)], fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Company annual reports, GAM Research estimates (FY27-29E)' },
    ] },
    { bullets: [
      '**What went wrong.** Chinese oversupply in nitration chemistries cut prices: AI revenue fell from ₹3,034 cr (FY23) to ~₹2,400 cr a year, "a substantial amount… because of pricing" (Feb-2026). Management chose to push volume into the market ahead of its new nitric acid plant "even if it comes at a short-term impact on price".',
      '**New plants.** DCTL commissioned hydrogenation-I (Sep-2025, ₹115 cr), nitration + hydrogenation-II (Jan-2026, ₹85 cr) and a ₹515 cr nitric acid plant (Dec-2025), completing "ammonia-to-amines" integration. Nitric acid is captive (no external revenue); it ran at ~45% in Q4FY26 on technical problems, forcing purchases at high prices. These plants pushed FY26 AI capex to ₹1,004 cr and segment capital employed to ₹2,215 cr.',
      '**What should improve.** China\'s curbs on hazardous chemistries; lower US duty on sodium nitrite; multipurpose agro-intermediates and alkylation plants (commercial volumes from January 2027); fluorination and photochlorination products. Management: new products are "in line or better" than AI\'s average margin, but it will not size them.',
    ] },
    { exhibit: { type: 'table', title: 'AI segment: capital in, returns out (₹ crore)', head: ['', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], rows: [
      ['Revenue', ...S2.map(a => n0(a.aiRev))],
      ['EBIT', ...S2.map(a => n0(a.aiEbit))],
      ['Capex', ...S2.map(a => n0(a.aiCapex))],
      ['Capital employed (closing)', ...S2.map(a => n0(a.aiCapEmployed))],
      { hl: true, cells: ['**Pre-tax ROCE**', ...S2.map(a => `**${a.aiRoce}%**`)] },
    ], source: 'Annual reports (segment note), GAM calculation' } },
    { callout: '**Our view:** the integration logic is sound, but the evidence so far is poor: returns fell as capital rose. We model AI revenue +18% / +12% / +10% (FY27-29E) and EBITDA margin 12.5% / 14.5% / 15.5%, so AI EBITDA roughly doubles from FY26 to FY29 but stays below FY23-24 levels.' },
  ],
};

// ---------------------------------------------------------------- Projects
const projects = {
  id: 'projects', nav: 'Capex programme & polycarbonate', kicker: 'Projects', title: 'The polycarbonate programme: India\'s first, but late, large and debt-funded',
  blocks: [
    { p: 'DCTL is building an integrated chain at Dahej: propylene and benzene → cumene → phenol and acetone → bisphenol-A (BPA) → polycarbonate (PC) resin → compounds. It bought Trinseo\'s 165,000 tpa PC plant at Stade, Germany (with technology and the CALIBRE™ brand), which is being dismantled and shipped to India. India imports more than 300,000 tonnes of PC resin a year and has no local maker. The programme is costed at ₹11,500 cr, funded 60:40 debt to equity with all debt tied up; a ₹2,500 cr BPA plant (up to 240 ktpa) was approved on 4-Aug-2026, and it is not confirmed whether that is inside the ₹11,500 cr.' },
    { exhibit: { type: 'table', title: 'Projects under way (as stated by Sep-2026)', head: ['Project', 'Cost (₹ cr)', 'Status / timing'], wide: [0, 2], rows: C.capex.projects.map(p => [p.project, p.cost ? n0(p.cost) : 'n.d.', p.status]), source: 'Annual report FY26, Q4FY26 and Q1FY27 presentations and calls, press (Aug-2026); n.d. = not disclosed' } },
    { exhibit: { type: 'table', title: 'The PC timeline keeps moving', head: ['When said', 'Commissioning target', 'Source'], rows: [
      ['Earlier guidance', 'Dec-2027', 'PL (18-May-2026)'],
      ['18-May-2026 (Q4FY26 call)', 'June 2028', 'Management'],
      ['6-Aug-2026 (Q1FY27 call)', 'H2 FY28-29 (PL: H2FY29); BPA a few months later', 'Management, PL'],
    ], source: 'Company calls, PL notes' } },
    { pair: [
      { type: 'column', title: 'Capex: ~₹8,600 cr in FY27-29E', unit: 'Capex (₹ crore)', x: 'fin.labels', from: 'FY20', series: [{ name: 'Capex', ref: 'fin.capex', fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
      { type: 'line', title: 'ROE falls below the cost of equity', unit: 'Return on equity (%)', x: 'fin.labels', from: 'FY20', series: [{ name: 'ROE', ref: 'fin.roe', fmt: 'pct' }], labels: 'all', lines: [{ v: 12.5, text: 'Cost of equity 12.5%', color: '#b4232a' }], source: 'Company, GAM Research estimates' },
    ] },
    { callout: `**Our view:** the project is strategically logical (import substitution, integration into its own phenol) and could transform the company in the 2030s. But (1) its returns are undisclosed; (2) global PC capacity is growing (PL downgraded the stock for this reason in April); (3) the start has slipped twice; (4) depreciation and interest arrive before revenue. In our model net debt reaches ~₹${n0(nd100(2))} cr at Mar-29 and EPS falls in FY28-29. We include no meaningful PC profit before FY30, so PC upside is the main thing a buyer at today's price is paying for.` },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale and reliability, but no pricing power',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict[0].toUpperCase() + m.verdict.slice(1), m.evidence, m.verdict === 'advantage' ? 'Supports volume and share.' : m.verdict === 'parity' ? 'Keeps Deepak competitive; does not set it apart.' : 'Limits margins and returns.']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Deepak has a **scale and service advantage**, not a moat in the pricing sense. In phenol it is the biggest local supplier to thousands of small buyers who value reliable, just-in-time supply; that protects volume. But the price is set by global spreads, and a second domestic producer arrives in Q3FY27. In intermediates its know-how is real, yet Chinese pricing took AI margins from 27% to 9% in four years. A business like this earns high returns at the top of the cycle (ROE 46% in FY20, 38% in FY22) and below its cost of capital at the bottom; it does not compound steadily.' },
  ],
};

// ---------------------------------------------------------------- Earnings quality
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, but state incentives and timing items to strip out',
  blocks: [
    { bullets: [
      '**Gujarat GST incentive inside revenue.** Deepak Phenolics books a state incentive (scheme "Incentive to Industries (General) 2016-2021") as revenue: ₹161 cr in FY25 (all in Q4), ₹102 cr in FY26 (₹68 cr in Q4) and ₹21.5 cr in Q1FY27. That was ~15% of FY26 Phenolics EBIT. Its remaining life is not disclosed; a lumpy Q4 booking flatters the March quarter.',
      '**Feedstock timing.** In May management said it had bought benzene, toluene and xylene "at every dip" and held "a much larger inventory" at "enviable prices" into mid-Q2FY27; in August it said there was no inventory benefit in Q1. Both cannot be fully true; we assume some of Q1\'s margin was timing.',
      '**Capitalised interest.** Borrowing costs on the PC project are capitalised until commissioning (Ind AS 23), so P&L interest understates the true cost of the debt in FY27-28 and jumps after start-up.',
      '**Ramp-up losses in DCTL** depressed AI EBIT in FY26 (company disclosure) and the nitric acid plant ran at ~45%; FY26 also had a ₹12.8 cr Labour Code exceptional charge.',
      '**Definitions.** The company\'s EBITDA includes other income (FY26: ₹1,041 cr); Screener\'s and ours exclude it (₹987 cr).',
      '**Audit.** Deloitte Haskins & Sells: clean opinion, no key audit matters, audit trail operated throughout FY26. Contingent liabilities negligible (₹0.5 cr).',
    ] },
    { callout: '**Accounting flag: AMBER.** The books are clean and the auditor is a Big-4 firm. But reported Phenolics profit includes a state incentive worth ₹100-160 cr a year with no disclosed end-date, management\'s messages on inventory gains conflict, and capitalised interest will flatter FY27-28 profit. Investors should look at margins excluding the incentive.' },
  ],
};

// ---------------------------------------------------------------- Ownership additions
const OW = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Mehta family (Chairman Deepak C. Mehta and his son, CEO Maulik Mehta) and family investment companies own ${OW.pattern.promoters}% (Jun-2026), with no pledge reported. Indian institutions own ${OW.pattern.diis}%, led by LIC (9.5%); foreign investors only ${OW.pattern.fiis}%. The number of shareholders fell from 4.51 lakh to 3.83 lakh in two years as retail investors left after the fall from the Aug-2024 peak.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Type'], rows: OW.named.map(h => [h.name, h.pct.toFixed(2) + '%', h.type]), source: 'BSE shareholding pattern via Screener.in (Jun-2026 quarter)' } },
  { callout: '**Our read:** a stable, unpledged promoter is a strength. The ownership risk is dilution: the project is 40% equity-funded and management says it will approach the market "if at all required".' },
] });

// ---------------------------------------------------------------- Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a capable family-run company; disclosure is the weak spot',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: 'Annual report FY26, company filings' } },
    { verdicts: [
      ['Board', 'Moderate', '12 directors: 6 independent; 4 executives incl. the CMD and his son; 2 more family members as non-executive directors. Audit committee chair (Dileep Choksi) completed his second term on 6-Aug-2026.', 'Adequate; family-heavy.'],
      ['Promoter and pledge', 'Strong', '49.34% with no pledge reported; small creeping additions, no sales.', 'Aligned with minorities.'],
      ['Pay', 'Moderate', 'CMD 107.9x, Group CFO 81.7x and CEO 67.3x the median employee in FY26, while profit fell 21%.', 'High for a falling-profit year.'],
      ['Disclosure', 'Weak', 'No volumes, utilisation, spreads, project returns or new-product revenue; conflicting comments on inventory gains and on new phenol capacity.', 'Hard to model; raises the risk premium.'],
      ['Execution', 'Moderate', 'Phenol debottlenecking excellent; nitric acid teething issues; agro and alkylation plants slipped ~2 months; PC slipped twice.', 'Big projects run late.'],
      ['Audit and legal', 'Strong', 'Deloitte, no key audit matters; contingent liabilities ₹0.5 cr; ICRA AA (Stable).', 'Clean.'],
      ['Capital allocation', 'Moderate', 'Phenol plant (FY17-20) earned 30-60% pre-tax; FY22-26 AI capex earned <5%; PC returns undisclosed.', 'One great project, one poor one, one unknown.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

// ---------------------------------------------------------------- Forecasts
const segRow = (k, name, field, hist, fmt = 'num') => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|${fmt}}}`)];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: in line for FY27, well below the street for FY28',
  blocks: [
    { p: 'We forecast each segment\'s revenue and EBITDA margin (segment EBIT plus its depreciation), remove inter-segment sales, and deduct central costs. Capex follows guidance (~₹2,500 cr in FY27, ~₹3,300 cr in FY28, ~₹2,800 cr in FY29), so depreciation and interest rise ahead of polycarbonate revenue. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Segment forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Phenolics' }, segRow('ph', 'Revenue', 'revenue', A26.phRev), segRow('ph', 'EBITDA', 'adjEbitda', A26.phEbitda),
      { sec: 'Advanced Intermediates' }, segRow('ai', 'Revenue', 'revenue', A26.aiRev), segRow('ai', 'EBITDA', 'adjEbitda', A26.aiEbitda),
      ['Inter-segment eliminations (revenue)', '−' + n0(A26.interSeg), '{{F.seg.elim.revenue.0|num}}', '{{F.seg.elim.revenue.1|num}}', '{{F.seg.elim.revenue.2|num}}'],
      ['Central costs', '−39', '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
    ], source: 'Company (FY26), GAM Research estimates; FY26 central costs = segment EBITDA ₹1,026 cr less EBITDA ₹987 cr' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs broker estimates after Q1FY27', head: ['', 'GAM FY27E', 'PL FY27E', 'GAM FY28E', 'PL FY28E', 'MOSL FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(plE.FY27E.sales), '{{F.sales.1|num}}', n0(plE.FY28E.sales), 'n.d.'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(plE.FY27E.ebitda), '{{F.ebitda.1|num}}', n0(plE.FY28E.ebitda), 'n.d.'],
      ['Net profit (₹ cr)', '{{F.pat.0|num}}', n0(plE.FY27E.pat), '{{F.pat.1|num}}', n0(plE.FY28E.pat), 'n.d.'],
      ['EPS (₹)', '{{F.eps.0|n1}}', n1(plE.FY27E.eps), '{{F.eps.1|n1}}', n1(plE.FY28E.eps), '~' + n1(D.street.estimates.mosl.FY28E.eps) + ' (implied)'],
    ], source: 'Prabhudas Lilladher (6-Aug-2026), Motilal Oswal (6-Aug-2026; EPS implied by ₹1,500 ÷ 24x), GAM Research. No dated FY27-28 consensus was published in Jul-Sep 2026.' } },
    { callout: `For FY27 we are in line with PL (EPS ~₹${n1(F.eps[0])} vs ₹${n1(plE.FY27E.eps)}): Q1 already delivered ₹25.3. For FY28 we are ${Math.abs(pctChg(F.eps[1], plE.FY28E.eps))}% below PL and ~${Math.abs(pctChg(F.eps[1], D.street.estimates.mosl.FY28E.eps))}% below Motilal Oswal because (1) we assume Phenolics revenue grows only 2% and the margin returns to 14% as Haldia's new plant and global capacity cap spreads; (2) depreciation (~₹${n0(F.dep[1])} cr) and interest (~₹${n0(F.interest[1])} cr) rise with the capex. FY29 EPS dips again as polycarbonate depreciation and interest start before its revenue: that is the J-curve of the project.` },
  ],
};

// ---------------------------------------------------------------- Street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: mostly negative already; we are more negative still',
  blocks: [
    { p: `${D.street.split} Bulls (Emkay) point to the AI recovery, favourable spreads and phenol-2 revenue from FY29. Bears point to normalising spreads, global phenol and polycarbonate overcapacity, and rising leverage. Our target is the lowest because our FY28E earnings are lower (we assume spreads normalise and charge the project costs) and because we apply a de-rated multiple.` },
    { exhibit: { type: 'table', title: 'Earlier calls (for context)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Note'], wide: [4], rows: D.street.older.map(o => [o.broker, o.rating, o.tp ? n0(o.tp) : '–', o.date, o.method || '–']), source: 'Trendlyne research-report list, PL notes, press (to 30-Sep-2026)' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.argument, c.who]), source: 'Broker notes, press and earnings calls to 30-Sep-2026' } },
  ],
};

// ---------------------------------------------------------------- Valuation
const derivation = [
  ['1. The street', 'Motilal Oswal 24x and Prabhudas Lilladher 29x FY28E EPS (Aug-2026); Emkay and HDFC Securities do not disclose a method', 'Range 24-29x'],
  ['2. Deepak\'s own history', `Trailing P/E five-year median ${n1(DN.pe5)}x; one-year-forward P/E median ${Math.round(fwdMed21)}x since 2021 (${Math.round(fwdMed19)}x since 2019)`, `Starting point: ${Math.round(fwdMed21)}x (forward, since 2021: our house window)`],
  ['3. Sector de-rating', `On ${ASOF_TXT} Deepak traded at ${n1(DN.pe)}x trailing, ${Math.abs(Math.round(DN.peVs))}% below its median; the median of nine Indian chemical stocks was ${Math.abs(Math.round(sectorDerate))}% below its own five-year median (Atul ${Math.round(PEERS.ATUL.peVs)}%, Vinati ${Math.round(PEERS.VINATIORGA.peVs)}%, SRF ${Math.round(PEERS.SRF.peVs)}%, Navin ${Math.round(PEERS.NAVINFLUOR.peVs)}%)`, `${Math.round(fwdMed21)}x × ${n1(1 + sectorDerate / 100)} ≈ **25x**`],
  ['4. Growth and returns', `Our EPS is flat from FY26 (₹40) to FY29E (₹${n1(F.eps[2])}) and ROE falls to ~${Math.round(F.roe[2])}% (cost of equity 12.5%); but Sep-28E EPS is depressed by project costs before PC revenue`, 'No further cut: the two effects offset'],
  ['5. Peers', `Trailing P/E on ${ASOF_TXT}: Atul ${n1(PEERS.ATUL.pe)}x, Vinati ${n1(PEERS.VINATIORGA.pe)}x, Aarti ${n1(PEERS.AARTIIND.pe)}x, SRF ${n1(PEERS.SRF.pe)}x, Epigral ${n1(PEERS.EPIGRAL.pe)}x`, '25x on forward earnings is within the peer range'],
];
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: 25x Sep-28E earnings gives {{dcf.tp|inr}}',
  blocks: [
    ...streetBlocks('DEEPAKNTR', {
      rating,
      streetIntro: 'Brokers value Deepak Nitrite on **P/E on FY28E earnings**: both brokers whose method we could find (Motilal Oswal 24x, Prabhudas Lilladher 29x) use it. We set our target the same way so it is comparable; the differences are in the inputs. The "At our EPS" column applies each broker\'s multiple to our own FY28E EPS.',
      street: BR.map(b => [b.broker, b.rating, b.tp, b.method, b.multiple, b.on, `${b.thesis} (${b.date})`]),
      streetSource: 'Broker notes and press reports to 30-Sep-2026 (latest call per broker); n.d. = method not disclosed',
      ourThesis: 'Spreads normalise; capex costs come before PC revenue',
      derivationIntro: `The target is a 12-month price, so we apply a one-year-forward multiple to the earnings the market will look at in September 2027: **Sep-28E EPS of ₹${n1(epsSep28)}** (half FY28E, half FY29E).`,
      derivation,
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}; nine peers' trailing P/E vs five-year medians), broker notes, GAM Research`,
      history: { field: 'eps', from: '2019-04-01', median: Math.round(fwdMed21), label: `Median since 2021: ${Math.round(fwdMed21)}x`, title: 'One-year-forward P/E: 25x vs history', yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA at 15x Sep-28E (the ~23x five-year median less the same de-rating) lands ${Math.abs(Math.round(mv('ev').vsTarget))}% below the P/E target: it charges the project debt explicitly. The DCF is far lower (₹${n0(dcfV)}): even with polycarbonate lifting revenue ~14% a year to FY31 and the margin to 18%, the ~₹8,600 cr of FY27-29 capex earns less than a 12.5% cost of equity. In other words, today's price already assumes polycarbonate returns well above anything management has disclosed.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}} 32x Sep-28E EPS.'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', 'Phenolics revenue +17% / +2% / +10% (FY27-29E) at 17.5% then 14% EBITDA margin; AI +18% / +12% / +10% at 12.5-15.5%; 25x Sep-28E EPS.'] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}} 20x Sep-28E EPS (the 2020 level).'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { p: 'The engine fades capex in a straight line from the last forecast year. With the usual 15-year horizon that would keep capex at 15-25% of revenue for a decade and give a negative value, which is meaningless. We therefore use a two-stage DCF: explicit FY28-29, a transition year (FY30) with BPA and phenol-2 spend still running, a steady state from FY31 (18% EBITDA margin, capex 5% of revenue, revenue up ~14% as polycarbonate ramps), then 6% growth for ever. The engine discounts at the cost of equity (12.5%), which is harsh for a company funding ~60% of its project with debt; the sensitivity table shows lower discount rates.' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-31E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): discount rate down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Ke \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed peers (trailing multiples at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'ROE', 'P/E (x)', '5-yr median P/E (x)', 'vs median', 'EV/EBITDA (x)'], rows: PEER_SYMS.map(s => PEERS[s]).map(p => [p.symbol === 'DEEPAKNTR' ? '**Deepak Nitrite**' : pname(p), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', p.roe + '%', n1(p.pe), n1(p.pe5), `${p.peVs > 0 ? '+' : ''}${Math.round(p.peVs)}%`, n1(p.evEbitda)]), source: `Screener.in: trailing P/E and EV/EBITDA at the NSE close on ${ASOF_TXT}; five-year median of weekly trailing P/E (Oct-2021 to Sep-2026)` } },
  ],
};

// ---------------------------------------------------------------- Verdict
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good operator at the top of a spread cycle, priced for a project not yet built',
  blocks: [
    { callout: '**What you are buying:** India\'s largest phenol and acetone producer (a well-run, high-return plant with no pricing power), a nitration intermediates business still recovering from Chinese competition, and a large option on India\'s first integrated polycarbonate chain, funded with debt and due in H2 FY28-29.' },
    { callout: `**What you are paying:** ${n1(pe28)}x our FY28E EPS and ${n1(peSep28)}x Sep-28E, against 24-29x that even the brokers use on higher earnings. On the street's own method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}). Q1FY27's record profit came from a war-time spread that is already fading, while ₹8,600 cr of capex adds costs before revenue.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (the HOLD line on our target)`, 'Medium', 'Share price after Q2FY27'],
      ['Spreads hold up after Haldia starts', 'Low-medium', 'Phenolics EBIT margin above 15% in Q3-Q4FY27'],
      ['AI margins rebuild', 'Medium', 'AI EBIT margin back above 12%; nitric acid at full rates; new plants\' sales from Jan-2027'],
      ['Polycarbonate economics disclosed and on time', 'Low-medium', 'Project IRR, offtake (anchor customer), commissioning date holding'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Spreads fall back to the FY25-26 trough', 'Medium', `Phenolics margin ~11.5%; bear-case FY28E EPS ₹${n1(M.forecast.scenarios.bear.eps[1])}, ${Math.abs(pctChg(M.forecast.scenarios.bear.eps[1], F.eps[1]))}% below our base`],
      ['Polycarbonate slips again or costs overrun', 'Medium', 'More capitalised interest and debt; equity raise'],
      ['Haldia prices aggressively for share', 'Medium', 'Lower domestic premium and volumes for Deepak'],
      ['Further Chinese pressure in intermediates', 'Medium', 'AI margin stuck near 9-10%'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: SELL, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Turn neutral (HOLD) below ~₹${n0(sellAbove)}**, and positive below ~₹${n0(buyBelow)}, or on proof that spreads and AI margins hold up once Haldia's plant is running.`,
      `**Biggest swing factor:** the phenol-acetone spread. Every one-point change in the Phenolics EBITDA margin moves FY28E EPS by ~₹${n1(phPt)} (≈${Math.round(phPt / F.eps[1] * 100)}%).`,
      '**Second swing factor:** the polycarbonate project\'s timing and returns, which the market is pricing ahead of any disclosure.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Phenolics EBIT margin, Q1FY27', v: '23.5%', d: 'FY26: 12.9%; FY23-26 range 12-14%' },
      { k: 'AI pre-tax ROCE, FY26', v: `${A26.aiRoce}%`, d: '44% in FY22' },
      { k: 'Capex, FY27-29E', v: '₹8,600 cr', d: '1.6x the previous ten years' },
      { k: 'Net debt, Mar-29E', v: `₹${n0(nd100(2))} cr`, d: '₹1,156 cr at Mar-26' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'Company, GAM Research' } },
  ],
};

// ---------------------------------------------------------------- Glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Phenol / acetone', 'Two basic chemicals made together from cumene. Phenol goes into resins (laminates, plywood), pharma, agrochemicals and bisphenol-A; acetone into solvents, IPA, MIBK and BPA.'],
      ['Cumene', 'Made from benzene and propylene; split into phenol and acetone.'],
      ['IPA', 'Isopropyl alcohol: a solvent and disinfectant, made by Deepak from acetone.'],
      ['MIBK / MIBC', 'Methyl isobutyl ketone / carbinol: solvents made from acetone; India imports them.'],
      ['BPA', 'Bisphenol-A: made from phenol and acetone; the main raw material for polycarbonate.'],
      ['Polycarbonate (PC)', 'A tough, clear engineering plastic used in cars, electronics, construction and medical devices.'],
      ['Spread', 'The gap between the selling price of a product and the cost of its feedstock; the main driver of Phenolics profit.'],
      ['Nitration / hydrogenation / diazotization', 'Chemical reactions Deepak specialises in: adding a nitro group, adding hydrogen (making amines), and turning amines into reactive intermediates (e.g. for fluorination).'],
      ['Sodium nitrite, xylidines, oximes, OBA, DASDA', 'Advanced Intermediates products used in dyes, agrochemicals, rubber, paper and detergents (OBA = optical brightening agent; DASDA is its key intermediate).'],
      ['PDH', 'Propane dehydrogenation: makes propylene from propane (Petronet LNG will supply Deepak\'s phenol-2 by pipeline).'],
      ['CWIP', 'Capital work in progress: money spent on plants not yet running; not depreciated until commissioned.'],
      ['Capitalised interest', 'Interest on loans for a plant under construction, added to the plant\'s cost instead of the P&L until it starts.'],
      ['Segment EBIT / EBITDA', 'Operating profit of a business before (EBIT) or before and after adding back (EBITDA) its depreciation, excluding head-office costs and other income.'],
      ['P/E; EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value + net debt) ÷ EBITDA.'],
      ['DCF / Ke', 'Discounted cash flow valuation; Ke is the cost of equity (here 12.5% = 6.5% risk-free + 1.0 × 6% equity risk premium).'],
      ['ROCE / ROE', 'Return on capital employed / on shareholders\' equity.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, business, history, industry, tailwind, phenolics, intermediates, projects, moat, p.financials, p.capital, quality, p.balance, ownership(p.ownershipBase), governance, forecasts, street, valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY18': 'Growth in the legacy nitrite and intermediates businesses, before the phenol plant (FY17-18 segment detail not reviewed).',
    'ebitdaMargin@FY17': 'Lower margin in the legacy businesses (FY17 segment detail not reviewed).',
    'ebitdaMargin@FY18': 'Recovery in the legacy businesses ahead of the phenol plant.',
    'ebitdaMargin@FY19': 'Phenol plant starts; higher-margin product mix.',
    'ebitdaMargin@FY20': 'Performance Products (OBA/DASDA) EBIT ₹419 cr on Chinese supply disruption, plus the first full year of phenol.',
    'ebitdaMargin@FY22': 'Phenolics EBIT margin eased from 24.7% to 20.1% as spreads came off the Covid peak.',
    'sales@FY22': 'Phenolics revenue ₹4,303 cr (+68%) on Covid-era phenol prices; AI ₹2,511 cr (restated).',
    'sales@FY23': 'AI revenue peaked at ₹3,034 cr (+21%); Phenolics +15% to ₹4,970 cr.',
    'pat@FY17': 'Includes ₹80 cr of other income.',
    'pat@FY19': 'Deepak Phenolics starts production; revenue +64%.',
    'pat@FY20': 'First full year of phenol and a strong year for Performance Products.',
    'pat@FY21': 'Phenolics EBIT ₹633 cr (24.7% margin) in the Covid phenol shortage.',
    'pat@FY23': 'Phenolics EBIT −31% to ₹594 cr as spreads normalised.',
    'sales@Q1FY27': 'Phenolics +36% (war-time spreads amid West Asia supply disruptions); AI +33% (better prices, new plants).',
    'sales@FY19': 'Deepak Phenolics\' Dahej phenol complex starts up.',
    'sales@FY20': 'First full year of the phenol plant (Phenolics revenue ₹2,001 cr).',
    'ebitdaMargin@FY21': 'Covid-era phenol shortage: Phenolics EBIT margin 24.7%.',
    'pat@FY22': 'Peak profit; AI EBIT ₹596 cr and Phenolics ₹867 cr.',
    'ebitdaMargin@FY23': 'Phenol spreads normalise; Phenolics EBITDA margin falls to 13.8%.',
    'pat@FY25': 'AI EBIT down to ₹176 cr on Chinese pricing; includes ₹161 cr Gujarat incentive.',
    'pat@FY26': 'AI EBIT ₹107 cr (DCTL ramp-up losses); ₹12.8 cr Labour Code charge.',
    'sales@FY27E': 'GAM: Q1 +36% (war-time spreads); ~₹1,500 cr a quarter in Phenolics thereafter.',
    'pat@FY28E': 'Spreads normalise (Haldia plant, global capacity); depreciation and interest rise.',
    'pat@FY29E': 'PC depreciation and interest start before meaningful PC revenue.',
  },
};
