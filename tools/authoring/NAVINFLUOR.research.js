// Navin Fluorine International report, part B: story, business, history, industry, tailwind test, the three
// verticals (HPP, specialty, CDMO) and advanced materials, moat, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict and glossary. Prose numbers come from research/company.json,
// deep.json, segments.json and the built model; forecast and valuation figures are live tokens ({{...}}).
// Written as of 30-Sep-2026 (Q1FY27 basis): only facts published on or before that date.
const fs = require('fs');
const path = require('path');
const { streetBlocks, forwardSeries } = require('./valuation-blend');
const { ruleText, ratingFor, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { peersAsOf } = require('./asof-peers');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'NAVINFLUOR', 'research');
const rd = f => JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
const C = rd('company.json'), D = rd('deep.json'), SG = rd('segments.json'), AS = rd('assumptions.json');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'models', 'NAVINFLUOR.json'), 'utf8'));
const F = M.forecast.F, V = M.forecast.dcf, A = M.annual;
const n0 = v => Math.round(v).toLocaleString('en-IN');
const n1 = v => (Math.round(v * 10) / 10).toFixed(1);
const pc = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v))}%`;
const SRC = 'Navin Fluorine annual reports and investor presentations, GAM Research';
const ASOF = '2026-09-30', ASOF_TXT = '30-Sep-2026';

const SA = SG.annual, SQ = SG.quarterly, QL = SQ.map(q => q.q);
const A26 = SA.find(a => a.fy === 'FY26'), A25 = SA.find(a => a.fy === 'FY25'), A24 = SA.find(a => a.fy === 'FY24'), A23 = SA.find(a => a.fy === 'FY23');
const Q1 = SQ.find(q => q.q === 'Q1FY27'), Q1L = SQ.find(q => q.q === 'Q1FY26');
const price = M.price.last, mcap = price * F.shares;
const BM = V.blend.methods, mv = key => BM.find(m => m.key === key);
const epsSep28 = mv('pe').metric;

// Business-line build must add up to the model's revenue (assumptions.businessLines vs F.sales).
const BL = AS.businessLines, YRS = ['FY27E', 'FY28E', 'FY29E'];
const blSum = y => BL[y].hpp + BL[y].specialty + BL[y].cdmo;
YRS.forEach((y, i) => { if (Math.abs(blSum(y) / F.sales[i] - 1) > 0.005) throw new Error(`business-line build ${y} ${blSum(y)} ≠ model revenue ${F.sales[i]}`); });
const blG = (y, k) => (BL[y][k] / BL[YRS.indexOf(y) ? YRS[YRS.indexOf(y) - 1] : 'FY26'][k] - 1) * 100;

// Street (latest note per broker on or before 30-Sep-2026).
const SB = D.street.brokers;
const sb = name => SB.find(b => b.broker.startsWith(name));
const withEps = SB.filter(b => b.eps), med = a => { const s = a.slice().sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const stEps27 = med(withEps.map(b => b.eps.FY27E)), stEps28 = med(withEps.map(b => b.eps.FY28E));
const tps = SB.map(b => b.target), tpMed = med(tps), tpMean = tps.reduce((s, x) => s + x, 0) / tps.length;

// One-year-forward P/E history (actual EPS, then our estimates) and peers at the as-of close.
const fwdPe = forwardSeries('NAVINFLUOR', M, 'eps');
const since21 = fwdPe.filter(x => x[0] >= '2021-04-01').map(x => x[1]).sort((a, b) => a - b);
const fwdMed21 = since21[Math.floor(since21.length / 2)], fwdP25 = since21[Math.floor(since21.length / 4)], fwdP75 = since21[Math.floor(since21.length * 3 / 4)];
const PEER_SYMS = ['NAVINFLUOR', 'SRF', 'FLUOROCHEM', 'PIIND', 'AARTIIND', 'DEEPAKNTR', 'CLEAN', 'VINATIORGA', 'ANURAS', 'TATVA', 'DIVISLAB'];
const PEERS = peersAsOf(PEER_SYMS, ASOF), pk = s => PEERS.find(p => p.symbol === s);
// Each peer's trailing P/E on 30-Sep-2026 vs its own five-year median (sector de-rating test).
const peMed5 = sym => { const S = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', sym, 'screener.json'), 'utf8')); const v = (S.charts.pe?.['Price to Earning'] || []).filter(([d, x]) => d <= ASOF && d >= '2021-09-30' && x > 0).map(x => x[1]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
const DER = PEER_SYMS.filter(s => !['NAVINFLUOR', 'DIVISLAB'].includes(s)).map(s => ({ s, name: pk(s).name.replace(/ Ltd$| Limited$/, '').replace(/ International$| India$| Industries$| Chemicals$/, ''), pe: pk(s).pe, med: peMed5(s) })).map(o => ({ ...o, chg: (o.pe / o.med - 1) * 100 }));
const derMed = med(DER.map(o => o.chg));
const navMed5 = peMed5('NAVINFLUOR'), navPe = pk('NAVINFLUOR').pe;
const sName = s => ({ NAVINFLUOR: 'Navin Fluorine', SRF: 'SRF', FLUOROCHEM: 'Gujarat Fluorochem', PIIND: 'PI Industries', AARTIIND: 'Aarti Industries', DEEPAKNTR: 'Deepak Nitrite', CLEAN: 'Clean Science', VINATIORGA: 'Vinati Organics', ANURAS: 'Anupam Rasayan', TATVA: 'Tatva Chintan', DIVISLAB: "Divi's Labs" }[s] || s);
const pePeers = PEERS.filter(p => p.pe).sort((a, b) => b.pe - a.pe);

const high52 = M.price.high52, fromHigh = (price / high52 - 1) * 100;
const rating = ratingFor(V.upside);
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;
const peFY28 = price / F.eps[1], peFY27 = price / F.eps[0];
const epsCagr2628 = (Math.pow(F.eps[1] / A.eps.at(-1), 1 / 2) - 1) * 100;
const epsG29 = F.epsGrowth[2];
const cust3 = 545.03 + 390.61 + 341.72, cust3Pct = cust3 / A26.consRev * 100;
const r32Sens = 24000 * 1000 * 1 * 87 / 1e7; // ₹ cr of revenue per US$1/kg on ~24 kt of R32 (at ~₹87/US$)
const r32SensEps = r32Sens * (1 - 0.245) / F.shares;

const cover = {
  headline: 'Three engines firing at once, and a price that already assumes they keep firing',
  lead: `Navin Fluorine makes refrigerant gases and hydrofluoric acid (HPP, ${Math.round(A26.hppRev / A26.consRev * 100)}% of FY26 revenue), fluorinated intermediates for agrochemical and pharma innovators (specialty, ${Math.round(A26.specialtyRev / A26.consRev * 100)}%) and pharma ingredients under contract (CDMO, ${Math.round(A26.cdmoRev / A26.consRev * 100)}%). After two flat years, five years of capex started to pay in FY26: revenue +41%, net profit +130%, EBITDA margin 32.6%; Q1FY27 added +44% and +108%. The street values the stock on **P/E on FY28E earnings (34-45x)**. Applying **36x to Sep-28E EPS of ₹${n1(epsSep28)}** gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** The business is excellent; the price already pays for it. The cross-checks agree or are lower (EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}). Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'All three businesses are growing fast', p: `Q1FY27: HPP ₹${Q1.hppRev} cr (+${Math.round((Q1.hppRev / Q1L.hppRev - 1) * 100)}%), specialty ₹${Q1.specialtyRev} cr (+${Math.round((Q1.specialtyRev / Q1L.specialtyRev - 1) * 100)}%), CDMO ₹${Q1.cdmoRev} cr (+${Math.round((Q1.cdmoRev / Q1L.cdmoRev - 1) * 100)}%). New capacity arrives every quarter of FY27: AHF (Feb-2026), Dahej MPP debottleneck (29-Sep-2026), 15,000 t of R32 (Q3), Chemours (end-Q2), cGMP4 phase 2 (Q4).` },
    { h: 'The refrigerant boom has an expiry date', p: 'China\'s R32 price hit a decade high in Jun-2026 (CNY62,700-65,500/t) and India\'s HFC quotas freeze from Jan-2028 on 2024-26 output. But calendar 2027 is a "free year": anyone with capacity may sell, and ~81 kt of new Indian R32 capacity is coming (HSBC). Management itself says India will be "oversupplied for five years". We assume softer prices in FY28.' },
    { h: 'Great customers, but few of them', p: `Three customers were ${Math.round(cust3Pct)}% of FY26 revenue. The CDMO business rests on one molecule for one partner (the darolutamide intermediate for Fermion), Chemours has one plant (Navin's), and the Honeywell HFO contract runs to 2029. These contracts are the moat, and also the risk.` },
    { h: 'Valuation: fair, not cheap', p: `At ₹${n0(price)} the stock trades at ${n1(peFY28)}x our FY28E EPS, close to the street's 40x average and ${Math.abs(Math.round(fromHigh))}% below its record weekly close. Navin's one-year-forward P/E has a ~${Math.round(fwdMed21)}x median since 2021, and Indian chemical stocks have de-rated ~${Math.abs(Math.round(derMed))}%; 36x gives {{dcf.upside|chg}}. We would buy below ~₹${n0(buyBelow)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): margin after raw-material inflation; first months of the Dahej MPP debottleneck.',
    'Commissioning of the 15,000 t R32-equivalent plant (Q3FY27) and how much of it is sold on five-year contracts (target 35-45%).',
    'Chemours liquid-cooling plant start (end-Q2FY27) and early orders from data-centre customers.',
    'FDA read-outs on 3-4 CDMO molecules in the next 8-12 months; CDMO revenue against the US$100 mn FY27 target.',
    'India\'s final HFC quota rules (government view expected early 2027) and China\'s 2027 quota.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Revenue nearly tripled since FY21; all three engines grew', unit: 'Revenue by business (₹ crore)', x: 'R.segments.annual[].fy', series: [{ name: 'HPP (refrigerants, HFO, AHF)', ref: 'R.segments.annual[].hppRev', fmt: 'num' }, { name: 'Specialty chemicals', ref: 'R.segments.annual[].specialtyRev', fmt: 'num' }, { name: 'CDMO', ref: 'R.segments.annual[].cdmoRev', fmt: 'num' }, { name: 'Unallocated (old classification)', ref: 'R.segments.annual[].unallocatedRev', fmt: 'num' }], minLabel: 150, source: 'Annual reports FY21-FY26' },
      { type: 'stacked', title: 'Quarterly revenue doubled in two years', unit: 'Revenue by business, quarterly (₹ crore)', x: QL, series: [{ name: 'HPP', values: SQ.map(q => q.hppRev), fmt: 'num' }, { name: 'Specialty', values: SQ.map(q => q.specialtyRev), fmt: 'num' }, { name: 'CDMO', values: SQ.map(q => q.cdmoRev), fmt: 'num' }], minLabel: 90, source: 'Quarterly investor presentations' },
    ] },
    { pair: [
      { type: 'line', title: 'EBITDA margin: 19% in FY24, ~34% now; we assume ~32-33%', unit: 'EBITDA margin (%)', x: 'fin.labels', from: 'FY19', series: [{ name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 40, source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'CDMO: lumpy history, now scaling', unit: 'CDMO revenue (₹ crore); FY27E = GAM', x: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E'], series: [{ name: 'CDMO', values: [...SA.map(a => a.cdmoRev), BL.FY27E.cdmo], fmt: 'num' }], labels: 'all', source: 'Annual reports; GAM estimate (management target US$100 mn ≈ ₹870 cr)' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Indian R32 capacity is growing faster than demand', unit: 'R32 capacity, thousand tonnes a year (PL, May-2026); India demand ~17-18 kt', x: ['SRF (mid-point)', 'Navin after expansion', 'Gujarat Fluorochem', 'Navin today', 'Stallion India'], series: [{ name: 'Capacity', values: [27.5, 24, 10, 9, 4], fmt: 'n1' }], labels: 'all', highlight: 'Navin after expansion', lines: [{ v: 17.5, axis: 'x', text: 'India demand', color: '#b4232a' }], source: 'PL (25-May-2026); SRF CMD (Jan-2026) for demand' },
      { type: 'hbar', title: `Three customers = ${Math.round(cust3Pct)}% of FY26 revenue`, unit: 'Revenue from customers above 10% of sales, FY26 (% of revenue)', x: ['Customer A', 'Customer B', 'Customer C', 'All other customers'], series: [{ name: 'Share', values: [545.03, 390.61, 341.72, A26.consRev - cust3].map(v => Math.round(v / A26.consRev * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Annual report FY26, note 43 (names not disclosed)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~${Math.round(peFY28)}x now, ~${Math.round(fwdMed21)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.filter(x => x[0] >= '2019-04-01').map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.filter(x => x[0] >= '2019-04-01').map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(fwdMed21), text: `Median since 2021: ~${Math.round(fwdMed21)}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...SB.slice().sort((a, b) => b.target - a.target).map(b => b.broker.replace(' (ICICI Direct)', '').replace(' Institutional Equities', '').replace(' Capital', '').replace(' Securities', ' Sec.')), 'GAM (base)'], series: [{ name: 'Target', values: [...SB.slice().sort((a, b) => b.target - a.target).map(b => b.target), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press round-ups (Aug-2026), GAM Research' },
    ] },
  ],
};

// ---------------------------------------------------------------- Business
const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'One fluorine platform, three businesses that look nothing alike',
  blocks: [
    { p: 'Everything Navin makes starts with fluorine. It buys fluorspar (mostly imported), turns it into hydrofluoric acid (HF) at Surat and now Dahej, and uses that HF three ways. **HPP** sells HF itself, refrigerant gases (R22 and R32 under the Mafron brand), inorganic fluorides such as boron trifluoride, and an HFO (a new low-global-warming refrigerant/blowing agent) made only for Honeywell under a US$410 mn contract. **Specialty chemicals** makes fluorinated building blocks for agrochemical and pharma innovators, mostly as campaigns in multi-purpose plants (MPPs) plus one dedicated plant (Project Nectar) for a marquee customer. **CDMO** (Navin Molecular, Dewas) makes advanced intermediates for drug companies under contract, mainly for Fermion (part of Orion), which makes darolutamide, the active ingredient in Bayer\'s prostate-cancer drug Nubeqa. A fourth business, **advanced materials** (data-centre cooling fluid for Chemours, electronic-grade HF, defence materials), is being incubated.' },
    { exhibit: { type: 'table', title: 'The three verticals in FY26', head: ['Vertical', 'Revenue (₹ cr)', 'Share', 'Growth', 'Exports', 'What drives it'], wide: [5], rows: [
      ['**HPP**', n0(A26.hppRev), `${Math.round(A26.hppRev / A26.consRev * 100)}%`, pc((A26.hppRev / A25.hppRev - 1) * 100), `${Math.round(A26.hppExportPct)}%`, 'R32/R22 prices and volumes; HFO for Honeywell (contract to 2029, 3-year extension option); AHF sales from Feb-2026'],
      ['**Specialty chemicals**', n0(A26.specialtyRev), `${Math.round(A26.specialtyRev / A26.consRev * 100)}%`, pc((A26.specialtyRev / A25.specialtyRev - 1) * 100), `${Math.round(A26.specialtyExportPct)}%`, 'Agro innovators\' campaigns (13 new molecules in FY26); Project Nectar; MPP utilisation (~80% visibility for FY27)'],
      ['**CDMO**', n0(A26.cdmoRev), `${Math.round(A26.cdmoRev / A26.consRev * 100)}%`, pc((A26.cdmoRev / A25.cdmoRev - 1) * 100), `${Math.round(A26.cdmoExportPct)}%`, 'Fermion (darolutamide) on a dedicated cGMP4 block; ~50-55 molecules in work'],
      { hl: true, cells: ['**Consolidated**', n0(A26.consRev), '100%', pc((A26.consRev / A25.consRev - 1) * 100), `${Math.round(A26.exportPct)}%`, 'India ₹1,110 cr, USA ₹761 cr, rest of world ₹1,443 cr'] },
    ], source: 'Annual report FY26 (revenue mix p.178; segment note 43)' } },
    { exhibit: { type: 'table', title: 'Assets and capabilities', head: ['', 'Detail'], wide: [1], rows: [
      ['Plants', 'Surat (refrigerants, HF, BF3, specialty, R&D centre); Dahej via subsidiary NFASL (HFO for Honeywell, MPPs, Project Nectar, AHF 40,000 t); Dewas (CDMO cGMP1-4); Runcorn, UK (Manchester Organics research lab)'],
      ['HF capacity', '~60,000 t of anhydrous HF between Surat and Dahej: "good enough for us over the next four to five years" (CFO, Aug-2026)'],
      ['R32', '9,000-10,000 t today; +15,000 t R32-equivalent from Q3FY27 (₹236.5 cr)'],
      ['People and R&D', '1,498 employees (Mar-2025); R&D spend ₹48.7 cr in FY26 (1.5% of revenue); three R&D centres'],
      ['Customers', '900+ customers; but three were 38.5% of FY26 revenue'],
    ], source: 'Company presentations (Apr-2026, Aug-2026), annual report FY26, Q1FY27 call' } },
  ],
};

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From India\'s first refrigerant maker (1967) to a contract-led fluorine platform',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, h.event, h.impact || '–']), source: 'Annual reports FY21-FY26, investor presentations and calls, press' } },
    { callout: '**Corporate actions:** a 5-for-1 share split (₹10 to ₹2 face value, 2017); one equity raise in recent years, the ₹750 cr QIP at ₹4,680 a share in Jul-2025 (~3% dilution); no bonus issue or buyback. The dividend was ₹15.1 a share in FY26 (₹12 in FY25), but the payout is low (~12% of consolidated profit) because most cash goes into capex. Leadership: the MD resigned in 2023 days after being re-appointed; Nitin Kulkarni took over in Jun-2024, under Executive Chairman Vishad Mafatlal (the promoter).' },
  ],
};

// ---------------------------------------------------------------- Industry
const R = D.industry.refrigerants;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Refrigerants at a cyclical high, pharma outsourcing growing, agro still weak',
  blocks: [
    { p: 'Navin sells into three very different markets. **Refrigerants** are a regulated commodity: the Kigali Amendment to the Montreal Protocol caps production of HFCs (gases such as R32 used in air-conditioners) country by country. China, the biggest producer, has run on quotas since 2024, and its R32 price reached a decade high in mid-2026. India freezes HFC output from Jan-2028 at the 2024-26 average plus a share of old HCFC (R22) production, so producers raced to run plants flat out and add capacity before the freeze. **Pharma CDMO** grows with drug companies outsourcing and with "China plus one" sourcing, but each contract depends on one drug\'s success. **Agro intermediates** are recovering in volume after the 2023-25 destocking, but prices remain under Chinese pressure.' },
    { exhibit: { type: 'table', title: 'Refrigerants: the facts that matter', head: ['Theme', 'Fact', 'Source date'], wide: [1], rows: [
      ['India quota rules', 'Freeze from 1-Jan-2028 at the 2024-26 average plus 65% of the HCFC baseline; cuts of 10% by 2032 and 20% by 2037. New capacity must be up by 31-Dec-2027; calendar 2027 is a "free year".', 'Apr-2026'],
      ['China', '2026 HFC production quota 797,800 t (top six firms ~90%); draft 2027 quota keeps the framework. R32 CNY62,700-65,500/t in Jun-2026, a decade high; R32 exports Jan-Apr 2026 −50% YoY.', 'Jun-2026'],
      ['China exports', 'China cut R32 exports ~17 kt in Jan-Jul 2026, helping Indian producers (HSBC).', 'Sep-2026'],
      ['India supply', 'Capacity: SRF ~25-30 kt, Gujarat Fluorochemicals ~10 kt, Navin ~9 kt (+15 kt), Stallion ~4 kt (new); domestic demand ~17-18 kt. ~81 kt of new Indian capacity into 2027 (HSBC).', 'May-Sep 2026'],
      ['Price outlook', 'Navin: China R32 "close to about $9" a kg (Apr-2026); Sharekhan: R32 prices to ease in CY2027 as new supply arrives.', 'Apr / Sep 2026'],
      ['US and EU', 'US AIM Act: allowances 60% of baseline 2024-28, 30% from 2029. EU: HFC consumption phase-out by 2050. Long-run demand moves to HFOs and low-GWP blends (R32 is a blend component).', '2025'],
    ], source: 'MoEFCC, BigGo Finance/SunSirs (China prices), PL (25-May-2026), HSBC and Sharekhan (17-Sep-2026), Navin calls, US EPA' } },
    { pair: [
      { type: 'column', title: 'China R32 price: a decade high in 2026', unit: 'China R32 price, CNY per tonne', x: ['Dec-2025', 'Jun-2026 (E. China avg)', 'Jun-2026 (Zhejiang high)'], series: [{ name: 'R32', values: [63000, 62700, 65500], fmt: 'num' }], labels: 'all', min: 0, source: 'SunSirs (12-Dec-2025); BigGo Finance (12/16-Jun-2026)' },
      { type: 'hbar', title: 'What we pay for each kind of business', unit: `Trailing P/E at the ${ASOF_TXT} close (x)`, x: ['Divi\'s (pure CDMO)', 'Navin Fluorine', 'SRF (fluoro + films)', 'PI Industries (agro CSM)', 'Aarti Industries'], series: [{ name: 'P/E', values: [pk('DIVISLAB').pe, navPe, pk('SRF').pe, pk('PIIND').pe, pk('AARTIIND').pe], fmt: 'x' }], labels: 'all', highlight: 'Navin Fluorine', source: 'Screener.in at the NSE close' },
    ] },
    { callout: '**So what:** the refrigerant tailwind is real and has a regulatory floor from 2028, but the next 15 months are the riskiest: every Indian producer is adding capacity to secure quota, and those tonnes must be sold somewhere in 2027. Navin\'s answer is to lock 35-45% of the new plant into five-year contracts and to stay the lowest-cost producer via its own HF. We model softer R32 prices in FY28.' },
  ],
};

// ---------------------------------------------------------------- Tailwind test
const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Navin is catching most of the tailwinds',
  blocks: [
    { verdicts: [
      ['HFC phase-down / quota scarcity', 'Yes', `HPP revenue ₹${n0(A24.hppRev)} cr (FY24) to ₹${n0(A26.hppRev)} cr (FY26); Q1FY27 +33%; R32 plants run flat out to build quota history; +15 kt before the Dec-2027 deadline.`, 'The biggest profit driver today, and the most cyclical.'],
      ['China plus one in pharma (CDMO)', 'Yes', `CDMO ₹${n0(A24.cdmoRev)} cr (FY24) to ₹${n0(A26.cdmoRev)} cr (FY26); Q1FY27 +82%; dedicated cGMP4 block for Fermion; moving to API-minus-1.`, 'Real, but concentrated in one molecule.'],
      ['Agro innovators outsourcing fluorinated intermediates', 'Partly', `Specialty ₹${n0(A24.specialtyRev)} cr (FY24), ₹${n0(A25.specialtyRev)} cr (FY25, −6%), ₹${n0(A26.specialtyRev)} cr (FY26, +44%); management: "pricing pressure continues"; Nectar utilisation slower than hoped.`, 'Volume growth, no pricing power.'],
      ['AI data centres (immersion cooling)', 'Early', 'Chemours plant (₹120 cr) due end-Q2FY27; Navin is Chemours\' only site; Chemours booked only ~US$1 mn of sales in a quarter.', 'An option; not in our numbers in any size.'],
      ['Semiconductors / electronics (electronic-grade HF)', 'Not yet', 'Technology tie-up with Buss ChemTech (2025); ₹90 cr adoption plant (Q2FY28); 4-5 lab-approved products.', 'Long-dated; payback five to six years out (Kotak).'],
      ['Indian AC demand growth', 'Partly', 'HPP India share rose to 55% in Q4FY26 (46% in Q1FY27); domestic R32 demand only ~17-18 kt vs much larger capacity.', 'India alone cannot absorb the new tonnes.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

// ---------------------------------------------------------------- HPP
const hpp = {
  id: 'hpp', nav: 'HPP (refrigerants, HFO, HF)', kicker: 'Vertical 1', title: `HPP: ₹${n0(A26.hppRev)} cr of revenue riding the refrigerant cycle`,
  blocks: [
    { p: `HPP is half of Navin and the main reason for the FY26 profit jump. It has four parts: **R22 and R32 refrigerants** (sold in India and exported; R22 also feeds fluoropolymers), **HFO** made at Dahej only for Honeywell (commercialised Jul-2022, seven-year term plus a three-year option; running at ~80% of capacity), **anhydrous HF** (new 40,000 t Dahej plant commissioned Feb-2026, partly sold to outside customers until Navin's own downstream plants need it), and **inorganic fluorides** such as boron trifluoride, where Navin is one of the largest global producers. HPP revenue was flat at ~₹400 cr a quarter through FY26, then jumped to ₹${Q1.hppRev} cr in Q1FY27 on AHF sales, higher R32 prices and the summer air-conditioner season.` },
    { pair: [
      { type: 'column', title: 'HPP revenue: +34% in FY26; we expect +27% in FY27', unit: 'HPP revenue (₹ crore); FY27-29E = GAM', x: [...SA.map(a => a.fy), ...YRS], series: [{ name: 'HPP', values: [...SA.map(a => a.hppRev), ...YRS.map(y => BL[y].hpp)], fmt: 'num' }], labels: 'all', source: 'Annual reports (FY20-22 old classification); GAM estimates' },
      { type: 'column', title: 'Quarterly HPP: a step up in Q1FY27', unit: 'HPP revenue, quarterly (₹ crore)', x: QL, series: [{ name: 'HPP', values: SQ.map(q => q.hppRev), fmt: 'num' }], labels: 'all', source: 'Quarterly investor presentations' },
    ] },
    { exhibit: { type: 'table', title: 'The new R32 plant: what it could earn', head: ['', 'Value', 'Note'], wide: [2], rows: [
      ['Capacity added', '15,000 t a year (R32-equivalent)', 'Commissioning Q3FY27; capex ₹236.5 cr (internal accruals)'],
      ['Management "peak revenue"', '₹600-825 cr a year', 'The board\'s downside case: implies ~US$5-6/kg at full use'],
      ['At China\'s Apr-2026 price (~US$9/kg)', `~₹${n0(15000 * 1000 * 9 * 87 / 1e7)} cr a year`, 'GAM arithmetic: 15,000 t × US$9 × ₹87; not a forecast'],
      ['Contracted share', '35-45% on five-year contracts', '"A couple of contracts" signed by Aug-2026; ~30-40% of the new capacity contracted (PL, Aug-2026)'],
      ['Our FY28E assumption', `HPP +${Math.round(blG('FY28E', 'hpp'))}%`, 'New plant at ~60% use; legacy R32 prices lower in the 2027 free year'],
      ['Sensitivity', `~₹${n0(r32Sens)} cr of revenue (~₹${n0(r32SensEps)} of EPS) per US$1/kg`, 'On ~24 kt of total R32 at full use, if the whole price change reaches profit (GAM arithmetic)'],
    ], source: 'Q1FY27 presentation and call, Q4FY26 call, PL (21-Aug-2026), GAM Research' } },
    { callout: `**Our view:** HPP's FY26-27 growth is a mix of better plants (AHF, R32 phase 2) and a very strong price cycle. The quota from 2028 should keep prices from collapsing, but 2027 will test it: ~81 kt of new Indian capacity versus ~17-18 kt of domestic demand. Each US$1/kg on R32 moves our EPS by roughly ₹${n0(r32SensEps)} at full volumes, about ${Math.round(r32SensEps / F.eps[1] * 100)}% of FY28E EPS. That is why we do not pay a CDMO-style multiple for half of the business.` },
  ],
};

// ---------------------------------------------------------------- Specialty
const specialty = {
  id: 'specialty', nav: 'Specialty chemicals', kicker: 'Vertical 2', title: 'Specialty chemicals: volume up, prices flat, plants filling',
  blocks: [
    { p: `Specialty chemicals makes fluorinated intermediates (key starting materials) for global agrochemical companies and some pharma customers. It is a campaign business: a customer orders a few hundred tonnes of a molecule, Navin runs it in a multi-purpose plant for weeks, then switches to the next. Revenue fell 6% in FY25 as the global agro industry destocked, then rose 44% in FY26 to ₹${n0(A26.specialtyRev)} cr as the Dahej plants filled and 13 new molecules were added. Q1FY27 was ₹${Q1.specialtyRev} cr (+48%), below the ₹354-360 cr of the previous two quarters because of campaign timing.` },
    { pair: [
      { type: 'column', title: 'Specialty: a lost FY25, then +44%', unit: 'Specialty revenue (₹ crore); FY27-29E = GAM', x: [...SA.map(a => a.fy), ...YRS], series: [{ name: 'Specialty', values: [...SA.map(a => a.specialtyRev), ...YRS.map(y => BL[y].specialty)], fmt: 'num' }], labels: 'all', source: 'Annual reports; GAM estimates' },
      { type: 'column', title: 'Quarterly specialty: campaign-driven swings', unit: 'Specialty revenue, quarterly (₹ crore)', x: QL, series: [{ name: 'Specialty', values: SQ.map(q => q.specialtyRev), fmt: 'num' }], labels: 'all', source: 'Quarterly investor presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Growth blocks for FY27-29', head: ['Block', 'Status (to Sep-2026)', 'What it adds'], wide: [1, 2], rows: [
      ['Project Nectar (₹540 cr dedicated plant, Dahej)', 'Started Dec-2024; 50-60% utilisation in FY27; 75-80% by end-FY28 ("slower than we would have liked")', 'Contracted volumes for a marquee customer plus qualification for 2-3 others'],
      ['Dahej MPP debottleneck (₹75 cr)', 'Commissioned 29-Sep-2026; purchase order for CY26', '₹140-160 cr a year at peak (~2x asset turn)'],
      ['New agro molecules', 'Campaign orders for 4-5 molecules in FY27, three patented', 'Management: these are ~15% of the year\'s expanded revenue (Axis)'],
      ['Chemours (classified here until advanced materials is split out)', 'Plant due end-Q2FY27 (slipped from Q1)', 'Ramp-up over ~15 months; revenue confidential'],
      ['Pricing', '"While volume growth is recovering, pricing pressure continues to remain, particularly in the LatAm market"', 'No price tailwind in our model'],
    ], source: 'Q4FY26 and Q1FY27 calls and presentations; Dahej MPP filing (29-Sep-2026); Axis (21-Aug-2026)' } },
    { callout: `**Our view:** specialty is the least differentiated of the three: China makes the same intermediates at scale, and the CFO concedes the business will not return to the "old days of 30% EBITDA". Growth now comes from filling plants already built, which is good for returns. We assume +${Math.round(blG('FY27E', 'specialty'))}% in FY27 and mid-teens after.` },
  ],
};

// ---------------------------------------------------------------- CDMO
const cdmo = {
  id: 'cdmo', nav: 'CDMO (Navin Molecular)', kicker: 'Vertical 3', title: 'CDMO: one blockbuster drug, a US$100 mn target and a lot of concentration',
  blocks: [
    { p: `CDMO (contract development and manufacturing) means making drug intermediates to a pharma customer's recipe under strict quality rules (cGMP). Navin's CDMO revenue has swung wildly: ₹448 cr in FY23, ₹262 cr in FY24 (−42%), ₹${n0(A26.cdmoRev)} cr in FY26 (+59%) and ₹${Q1.cdmoRev} cr in Q1FY27 alone (+82%). The swing factor is a multi-year contract signed in FY24 with Fermion, Orion's API unit, for an intermediate of darolutamide (Bayer/Orion's Nubeqa), a prostate-cancer drug that the CFO says could reach ~US$5 bn of peak sales. Navin built a dedicated block in cGMP4 (₹288 cr approved Feb-2024; phase 1 running since Q3FY26) and has started phase 2 (₹125 cr, ready Q4FY27). It is also moving one step closer to the final drug (API-minus-1) and working on an early-stage molecule for the same customer.` },
    { pair: [
      { type: 'column', title: 'CDMO revenue: we assume ₹{{as.businessLines.FY27E.cdmo|num}} cr in FY27', unit: 'CDMO revenue (₹ crore); FY27-29E = GAM', x: [...SA.map(a => a.fy), ...YRS], series: [{ name: 'CDMO', values: [...SA.map(a => a.cdmoRev), ...YRS.map(y => BL[y].cdmo)], fmt: 'num' }], labels: 'all', source: 'Annual reports; GAM estimates' },
      { type: 'column', title: 'Quarterly CDMO: ₹180-186 cr a quarter now', unit: 'CDMO revenue, quarterly (₹ crore)', x: QL, series: [{ name: 'CDMO', values: SQ.map(q => q.cdmoRev), fmt: 'num' }], labels: 'all', source: 'Quarterly investor presentations' },
    ] },
    { exhibit: { type: 'table', title: 'The CDMO arithmetic', head: ['', 'Value', 'Note'], wide: [2], rows: [
      ['FY27 target', 'US$100 mn (~₹870 cr)', '"Very much on track" (Aug-2026); Q1 run-rate ₹720 cr a year'],
      ['Our FY27E', `₹${n0(BL.FY27E.cdmo)} cr (+${Math.round(blG('FY27E', 'cdmo'))}%)`, 'About 95% of the target'],
      ['cGMP4 at ~3x asset turn', `~₹${n0(288 * 3)} cr a year`, 'Management: by FY29 "maybe sooner"; on top of the older cGMP1-3 plants'],
      ['Pipeline', '30-40 molecules in work (50-55 in April), ~10 late stage', '3-4 FDA read-outs in the next 8-12 months; one recent read-out "didn\'t come quite well"'],
      ['Our FY28-29E', `₹${n0(BL.FY28E.cdmo)} cr / ₹${n0(BL.FY29E.cdmo)} cr`, 'Phase 2 for a full year; new molecules only if approved'],
    ], source: 'Q4FY26 and Q1FY27 calls; GAM Research' } },
    { callout: '**Our view:** this is the most valuable part of Navin and the hardest to forecast. A blockbuster drug on a dedicated block is about as good as Indian CDMO gets, and Navin\'s contract terms are not public (the CFO refused to discuss pricing). But one molecule and one customer drive most of the growth; the FY24 collapse shows how quickly CDMO revenue can fall when campaigns end. We do not give Navin a Divi\'s-like multiple for it.' },
  ],
};

// ---------------------------------------------------------------- Advanced materials
const advanced = {
  id: 'advanced', nav: 'Advanced materials', kicker: 'The option', title: 'Advanced materials: a good idea that will not move the numbers before FY29',
  blocks: [
    { p: 'Management wants a fourth vertical, as large as today\'s CDMO business by the end of the decade (~10-15% of revenue by FY30; ~₹1,400 cr of revenue by FY35, as reported from the Aug-2026 analyst meet). It rests on three projects: the **Chemours** plant for Opteon, a two-phase immersion cooling fluid for AI data centres (₹120 cr, 35% paid by Chemours, Navin the only manufacturing site, due end-Q2FY27); a **₹90 cr adoption plant** at Surat (Q2FY28) to take 4-5 lab-approved products to commercial-scale qualification for semiconductor, electronics and defence customers; and a **DRDO** technology-development project for an imported defence material (sodium borohydride, per ICICI Securities). Electronic-grade HF (with Buss ChemTech) would follow.' },
    { exhibit: { type: 'table', title: 'What is known and what is not', head: ['Item', 'Known (to Sep-2026)', 'Not known'], wide: [1, 2], rows: [
      ['Chemours', 'Plant due end-Q2FY27; a phase 2 could cost ~10x the first (~US$14 mn) (PL, May-2026); Chemours booked ~US$1 mn of sales in a quarter', 'Volumes, pricing, contract length; whether Chemours adds a second source'],
      ['Adoption plant (₹90 cr)', 'Two platforms; ~a dozen products in the basket; 4-5 lab-approved', 'Asset turn ("consciously not reflected"), customers'],
      ['DRDO', 'Indigenous process for a critical imported material; applications beyond defence', 'Commercial terms (confidential)'],
      ['Payback', 'CFO: "payback is going to be pretty soon" on the ₹90 cr', 'Kotak: significant Chemours revenue not before FY31-32'],
    ], source: 'Q1FY27 presentation and call; PL (25-May and 21-Aug-2026); ICICI Securities (07-Aug-2026); Trade Brains on Kotak (Aug-2026)' } },
    { callout: '**Our view:** this is the kind of niche, high-margin chemistry Navin is good at, and Chemours choosing it as sole supplier is a real endorsement. But revenue in FY27-29 will be small, so we include only modest amounts inside specialty and value nothing extra for it. It is the main upside to our bull case.' },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: contracts, fluorine know-how and a quota, but no pricing power in half the portfolio',
  blocks: [
    { verdicts: D.moat, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Navin has a **real but narrow moat**. Handling HF and fluorination safely at scale is hard, global innovators (Honeywell, Bayer\'s supply chain via Fermion, Chemours) have chosen it as a sole or main supplier, and from 2028 the HFC quota will keep new entrants out of refrigerants. But it has **no pricing power** in agro intermediates or in R32 during the 2027 free year, and its best contracts are concentrated in a handful of customers. That deserves a premium to commodity chemical makers, not a pharma-CDMO multiple across the whole business.' },
  ],
};

// ---------------------------------------------------------------- Earnings quality
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit and real cash, but too little disclosure by business',
  blocks: [
    { bullets: [
      '**No profit by business.** Navin reports one segment and discloses only revenue by vertical. Investors cannot see whether the FY26 margin jump came from refrigerant prices (cyclical) or CDMO (structural). The CFO\'s split (70% volumes, 30% pricing) is helpful but unaudited.',
      `**Customer concentration.** Three customers were ₹545 cr, ₹391 cr and ₹342 cr of FY26 revenue (${Math.round(cust3Pct)}% together); in FY25 one customer was 21%. Names are not disclosed.`,
      '**Cash conversion is good.** Operating cash flow ₹894 cr in FY26 (83% of EBITDA) and ₹173 cr in Q1FY27; net working capital fell to 74 days.',
      '**Exceptional items are small.** FY26: −₹20.5 cr Labour Codes charge in Q3 and +₹13.7 cr credit in Q4 (not explained in what we read); net −₹6.8 cr.',
      '**Customer-funded capex.** Contract liabilities of ₹212 cr are advances for the Chemours and Nectar plants: genuine commitment, but revenue still to be delivered.',
      '**Other income** (₹65 cr in FY26, ₹35 cr in Q1FY27) is mostly treasury income on the QIP money; it falls as debt is repaid.',
      '**FY20 profit (₹409 cr) was flattered by a negative tax charge** (tax rate −56% on Screener); it is not a comparable base.',
      '**Depreciation** is ~4.2% of gross block, similar to SRF (4.6%): no sign of under-depreciation.',
    ] },
    { callout: '**Accounting flag: AMBER.** The audit (Price Waterhouse Chartered Accountants LLP) is clean, there are no restatements and the business converts profit into cash. The amber is for disclosure: with one reported segment and three customers making up ~40% of revenue, outsiders have to take the mix of cyclical and structural profit on trust.' },
  ],
};

// ---------------------------------------------------------------- Ownership additions
const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Mafatlal family owns ${OH.categoriesPct.promoters}% (Jun-2026), almost all through Mafatlal Impex, with nothing pledged; its stake was 28.8% in Dec-2023 and was diluted mainly by the Jul-2025 QIP. Institutions own most of the rest: foreign investors ${OH.categoriesPct.fii}% and domestic institutions ${OH.categoriesPct.dii}% (mutual funds ${OH.categoriesPct.mutualFunds}%). Retail holders fell from ~173,000 to ~${Math.round(OH.shareholders / 1000)},000 over 2.5 years.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.named.map(h => [h.name, h.pct + '%', /Impex/.test(h.name) ? 'Promoter company; nil pledge' : /Life Insurance/.test(h.name) ? 'Down from 10.08% in Sep-2024' : /SBI/.test(h.name) ? 'Up from 3.91% in Jun-2025' : '']),
    ['All mutual funds', OH.categoriesPct.mutualFunds + '%', ''],
    ['Foreign portfolio investors', OH.categoriesPct.fii + '%', 'up from 15.9% in Dec-2023'],
  ], source: 'BSE shareholding pattern (quarter to Jun-2026, the latest public on 30-Sep-2026) via Screener.in; mutual-fund total from PL (06-Aug-2026)' } },
  { callout: '**Our read:** a 27% promoter is low for an Indian mid-cap and leaves room for institutions to drive the stock both ways. The clearest flows: LIC has sold steadily (10.1% to 3.6% in seven quarters) while SBI MF, Norges Bank and index funds bought. We found no stated reason for LIC\'s selling; it coincides with the stock\'s re-rating.' },
] });

// ---------------------------------------------------------------- Governance
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a capable team, a clean audit, and a pay bill that is high for the company\'s size',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note]), source: 'Annual reports FY24-FY26, Q1FY27 presentation' } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'Price Waterhouse Chartered Accountants LLP; no qualification or restatement; contingent liabilities tiny (~₹8 cr standalone).', 'No accounting concerns found.'],
      ['Board', 'Moderate', '10 directors, 6 independent, 1 woman; Executive Chairman is the promoter (re-appointed for five years from 20-Aug-2026).', 'Independent majority, but the promoter runs the company day to day.'],
      ['Pay', 'Weak', 'FY26: Executive Chairman ₹17.1 cr (+73%, 190x median employee), MD ₹12.5 cr (+83%, 139x); together 4.4% of net profit.', 'High for a ₹3,300 cr-revenue company; pay rose faster than the dividend.'],
      ['Leadership stability', 'Moderate', 'MD resigned in 2023 days after re-appointment; new MD since Jun-2024; CFO Anish Ganatra leads investor communication.', 'Current team has delivered; the 2023 exit is a reminder of key-person risk.'],
      ['Capital allocation', 'Moderate', '₹3,125 cr of capex FY22-26 earned little for three years, then ROCE 21%; QIP at ₹4,680 (stock ₹8,245 on 30-Sep-2026); stage-gated, partly customer-funded projects.', 'Disciplined lately; the next ₹2,500-3,500 cr must earn ~20% too.'],
      ['Disclosure', 'Moderate', 'Good quarterly decks and candid calls, but one segment, no vertical profit, customer names withheld, Fermion and Chemours terms confidential.', 'Investors must trust the mix of cyclical and structural profit.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

// ---------------------------------------------------------------- Forecasts
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: `Our forecasts: EPS +${Math.round(F.epsGrowth[0])}% in FY27, then ~16% a year`,
  blocks: [
    { p: 'Navin does not disclose profit by business, so the model runs on one revenue line and one EBITDA margin. We build revenue bottom-up from the three verticals (table below) and check that it adds up to the model. FY27 revenue grows ~30% on Q1\'s run-rate plus the new plants; FY28-29 slow to ~19% and ~14% as the R32 plant fills and prices soften in the 2027 free year. The EBITDA margin stays at 32-33%, inside management\'s 32-33% ±1% range. Capex follows guidance (₹700 cr in FY27, ₹850 cr a year after). Every assumption is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'table', title: 'Revenue build by vertical (₹ crore)', head: ['Vertical', 'FY26A', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [5], rows: [
      ['HPP', n0(BL.FY26.hpp), `${n0(BL.FY27E.hpp)} (${pc(blG('FY27E', 'hpp'))})`, `${n0(BL.FY28E.hpp)} (${pc(blG('FY28E', 'hpp'))})`, `${n0(BL.FY29E.hpp)} (${pc(blG('FY29E', 'hpp'))})`, 'AHF ramp and the new R32 plant; softer R32 prices in CY2027'],
      ['Specialty', n0(BL.FY26.specialty), `${n0(BL.FY27E.specialty)} (${pc(blG('FY27E', 'specialty'))})`, `${n0(BL.FY28E.specialty)} (${pc(blG('FY28E', 'specialty'))})`, `${n0(BL.FY29E.specialty)} (${pc(blG('FY29E', 'specialty'))})`, 'Nectar, MPP debottleneck, new molecules, Chemours'],
      ['CDMO', n0(BL.FY26.cdmo), `${n0(BL.FY27E.cdmo)} (${pc(blG('FY27E', 'cdmo'))})`, `${n0(BL.FY28E.cdmo)} (${pc(blG('FY28E', 'cdmo'))})`, `${n0(BL.FY29E.cdmo)} (${pc(blG('FY29E', 'cdmo'))})`, '~95% of the US$100 mn target; cGMP4 phase 2'],
      { hl: true, cells: ['**Total = model revenue**', n0(blSum('FY26')), '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ''] },
    ], source: 'Company (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (actual) / net cash (forecast)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ...withEps.map(b => [`EPS (₹), ${b.broker.replace(' (ICICI Direct)', '')} (${b.date.slice(5, 7) === '08' ? 'Aug' : b.date}-26)`, '{{F.eps.0|n1}}', n1(b.eps.FY27E), '{{F.eps.1|n1}}', n1(b.eps.FY28E)]),
      { hl: true, cells: ['**EPS (₹), median of the four**', '**{{F.eps.0|n1}}**', `**${n1(stEps27)}**`, '**{{F.eps.1|n1}}**', `**${n1(stEps28)}**`] },
      ...withEps.map(b => [`Revenue (₹ cr), ${b.broker.replace(' (ICICI Direct)', '')}`, '{{F.sales.0|num}}', n0(b.revenue.FY27E), '{{F.sales.1|num}}', n0(b.revenue.FY28E)]),
    ], source: 'Broker notes (Aug-2026): ICICI Securities 07-Aug, PL 21-Aug, Axis Securities 21-Aug (via DSIJ summary), MOFSL 05-Aug. No Bloomberg/Refinitiv consensus dated Jul-Sep 2026 found.' } },
    { callout: `We are in line with the street for FY27 (${pc((F.eps[0] / stEps27 - 1) * 100)} vs the median) and ${pc((F.eps[1] / stEps28 - 1) * 100)} for FY28: our FY28 margin (32%) is below PL's 33.6% because we expect softer R32 prices in the 2027 free year. Axis is the outlier at ₹267 FY28E EPS (revenue ₹5,862 cr). The real disagreement with the street is not earnings but what multiple a business with half its revenue in a regulated, cyclical commodity deserves.` },
  ],
};

// ---------------------------------------------------------------- Street
const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: mostly Buy, all on P/E, with a vocal group of sellers',
  blocks: [
    { p: `Coverage is wide. After the Q1FY27 results, 14 of 18 brokers reviewing them reiterated Buy, Add or Accumulate (Business Today, 06-Aug-2026); a later count showed 23 of 29 analysts at Buy, 2 Hold and 4 Sell. The 14 targets we could find have a median of ₹${n0(tpMed)} (range ₹${n0(Math.min(...tps))}-${n0(Math.max(...tps))}). Every disclosed method is P/E on FY28E or Jun-28E EPS at 34-45x. The bulls (ICICI Securities, Ambit, Elara, Nuvama, UBS) point to three engines growing at once and the advanced-materials option; the bears (Kotak, Morgan Stanley, Equirus, Citi) argue the price already discounts years of growth and that R32 is heading into oversupply.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, calls, filings and press to 30-Sep-2026' } },
  ],
};

// ---------------------------------------------------------------- Valuation
const streetRows = SB.map(b => [b.broker.replace(' (ICICI Direct)', ' (ICICI Direct)'), b.rating || 'n.d.', b.target, b.method || 'n.d.', b.multiple || '–', b.on || '–', b.thesis || '–']);
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: 36x Sep-28E earnings gives {{dcf.tp|inr}}',
  blocks: [
    ...streetBlocks('NAVINFLUOR', {
      rating,
      streetIntro: 'Every broker whose method we could find values Navin on **P/E**: ICICI Securities 45x, PL 41x, MOFSL 40x and Axis 34x FY28E EPS; Nuvama 40x Q1FY29E and JM 40x Jun-28E. We use the same method, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E). Our disagreement is about the multiple, not the method.',
      street: streetRows,
      ourThesis: 'Excellent execution, fully priced; R32 risk in 2027',
      streetSource: 'Broker notes (Aug-2026; ICICI Securities, PL, MOFSL read directly; Axis via DSIJ; others via Business Today 06-Aug-2026 and Trade Brains); "At our EPS" applies each broker\'s multiple to GAM EPS for the same year; n.d. = not disclosed',
      derivationIntro: 'We start from Navin\'s own one-year-forward P/E history, adjust for how far Indian chemical stocks had de-rated by 30-Sep-2026, and then test the result against growth, peers and returns.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E: median ~${Math.round(fwdMed21)}x since Apr-2021 (25th-75th percentile ${Math.round(fwdP25)}-${Math.round(fwdP75)}x); ~33-41x in 2026. Trailing P/E ${n1(navPe)}x vs a five-year median of ${n1(navMed5)}x`, `Starting point: ${Math.round(fwdMed21)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} Indian chemical peers traded a median ${Math.abs(Math.round(derMed))}% below their five-year median P/E: ${DER.filter(o => o.chg < 0).sort((a, b) => a.chg - b.chg).map(o => `${sName(o.s)} ${pc(o.chg)}`).join(', ')}; only those with depressed earnings were above (${DER.filter(o => o.chg >= 0).map(o => `${sName(o.s)} ${pc(o.chg)}`).join(', ')})`, `${Math.round(fwdMed21)}x × ${(1 + derMed / 100).toFixed(2)} ≈ **36x**`],
        ['3. Growth', `Street multiples come with ~26-29% a year EPS growth FY26-28 (MOFSL, PL); ours is ${Math.round(epsCagr2628)}% a year, similar, but slows to ~${Math.round(epsG29)}% in FY29 as the R32 and CDMO step-ups mature`, 'No premium or discount: 36x'],
        ['4. Peers', `SRF ${n1(pk('SRF').pe)}x, PI Industries ${n1(pk('PIIND').pe)}x, Aarti ${n1(pk('AARTIIND').pe)}x trailing; Divi's (pure CDMO) ${n1(pk('DIVISLAB').pe)}x; Gujarat Fluorochemicals ${n1(pk('FLUOROCHEM').pe)}x on depressed earnings`, '36x forward keeps a premium to SRF and PI for higher ROE (20% vs 12-14%) and the CDMO mix'],
        ['5. Returns', `ROE ~${Math.round(F.roe[1])}% vs a 12.5% cost of equity (ROE/Ke ~${(F.roe[1] / 12.5).toFixed(1)}x); but ₹700-1,000 cr a year of capex keeps free cash flow at only ${n1(F.fcf[1] / mcap * 100)}% of market value in FY28E`, 'Supports a premium multiple, not an unlimited one'],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}), broker notes, GAM Research`,
      history: { field: 'eps', from: '2019-04-01', median: Math.round(fwdMed21), label: `Median since 2021: ~${Math.round(fwdMed21)}x`, title: 'One-year-forward P/E: our 36x vs history', yearStep: 1 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (23x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}, ${Math.abs(mv('ev').vsTarget).toFixed(0)}% ${mv('ev').vsTarget < 0 ? 'below' : 'above'} the P/E target, so the two market methods agree. The DCF (₹${n0(mv('dcf').value)}) is far lower: at a 12.5% cost of capital, with ₹700-1,000 cr a year of capex and margins fading towards 30%, cash flows support only about half of today's price; ${Math.round(V.tvShare)}% of the DCF value sits in the terminal value. The market is paying for growth well beyond FY29 (CDMO approvals, advanced materials), which our DCF does not assume.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}} Multiple back to 42x (half the de-rating reverses; ICICI Securities uses 45x).'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', 'Revenue +30% / +19% / +14% (FY27-29E), EBITDA margin 32-33%; 36x Sep-28E EPS.'] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}} Multiple falls to 28x, close to the 2024-25 forward lows.'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed chemical and CDMO peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'NAVINFLUOR' ? '**Navin Fluorine**' : sName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), n1(p.evEbitda), p.roe + '%']), source: `Screener.in (consolidated), trailing multiples at the NSE close on ${ASOF_TXT}` } },
  ],
};

// ---------------------------------------------------------------- Verdict
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a top-quality business at a full price',
  blocks: [
    { callout: `**What you are buying:** India's most integrated fluorine platform, with sole-supplier contracts with Honeywell, Fermion (Bayer's Nubeqa) and Chemours, an HFC quota from 2028, a net-debt-free balance sheet, ROE of ~20% and three businesses all growing 30-80%.` },
    { callout: `**What you are paying:** ${n1(peFY27)}x our FY27E and ${n1(peFY28)}x our FY28E earnings, for a company where half the revenue rides a refrigerant price cycle that faces a supply wave in 2027, three customers are ~${Math.round(cust3Pct)}% of sales, and ₹700-1,000 cr a year of capex keeps free cash flow thin. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The DCF says the price needs growth well beyond FY29.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our current target)`, 'Medium', 'Share price; a market or sector sell-off'],
      ['R32 prices hold through 2027 and contracts cover most of the new plant', 'Medium', 'China/India R32 prices; contract announcements; Q3-Q4FY27 HPP revenue'],
      ['CDMO beats US$100 mn and wins new commercial molecules', 'Medium', 'FDA read-outs in the next 8-12 months; cGMP5/6 announcements'],
      ['Chemours / advanced materials scale early', 'Low-medium', 'Chemours data-centre orders; a phase-2 capex decision'],
      ['Profit disclosure by business', 'Low', 'Segment reporting in the FY27 annual report'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['R32 price falls towards the US$5-6/kg "downside case" in 2027', 'Medium', `~₹${n0(r32SensEps)} of EPS per US$1/kg at full volumes; bear case {{scen.bear.tp|inr}}`],
      ['CDMO: a campaign pause or a failed molecule', 'Medium', 'FY24 showed CDMO revenue can fall 42% in a year'],
      ['Loss or re-pricing of a top-three customer (HFO contract ends 2029, extendable)', 'Low-medium', 'Up to 10-16% of revenue each'],
      ['Raw-material and energy inflation (Middle East conflict, fluorspar, sulphur)', 'Medium', 'Gross margin fell ~100bp QoQ in Q1FY27'],
      ['Safety incident at an HF plant', 'Low', 'HF is highly hazardous; plant shutdowns'],
      ['Capex returns disappoint again (FY23-25 repeat)', 'Medium', 'ROCE back towards 11-15%'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to BUY below ~₹${n0(buyBelow)} and to SELL above ~₹${n0(sellAbove)}** (the stock's record weekly close, ₹${n0(high52)}, was above that line), or sooner if R32 prices or CDMO approvals change our earnings.`,
      '**Biggest swing factor:** R32 pricing in calendar 2027. The second is the CDMO pipeline beyond darolutamide.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Net profit, FY24 → FY26', v: `₹${n0(A.pat.at(-3))} → ₹${n0(A.pat.at(-1))} cr`, d: 'capacity plus the refrigerant cycle' },
      { k: 'Top three customers', v: `~${Math.round(cust3Pct)}%`, d: 'of FY26 revenue' },
      { k: 'New R32 capacity', v: '+15,000 t', d: 'vs India demand ~17-18 kt' },
      { k: 'Our FY28E EPS vs the street', v: `₹${n1(F.eps[1])}`, d: `street median ₹${n1(stEps28)}` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

// ---------------------------------------------------------------- Glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['HF / AHF', 'Hydrofluoric acid / anhydrous (water-free) hydrofluoric acid, made from fluorspar; the starting point for almost all fluorochemicals.'],
      ['HPP', 'High Performance Products: Navin\'s refrigerants, HFO, HF and inorganic fluorides business.'],
      ['R22, R32, HFC, HCFC', 'Refrigerant gases. R22 is an HCFC (being phased out, still used as a feedstock); R32 is an HFC used in modern air-conditioners and blends.'],
      ['HFO', 'Hydrofluoro-olefin: newer refrigerant / blowing agent with very low global-warming impact; Navin makes one for Honeywell.'],
      ['Kigali Amendment / quota', 'Global agreement to cut HFC production; India freezes output from 2028 at the 2024-26 average; producers get quotas based on past output.'],
      ['Free year', 'Calendar 2027 in India: after the baseline years and before the freeze, so anyone with capacity can sell.'],
      ['CDMO / cGMP', 'Contract development and manufacturing for drug companies / current Good Manufacturing Practice, the quality rules for pharma plants.'],
      ['API, API-minus-1', 'Active pharmaceutical ingredient / the step just before it in the chemical chain.'],
      ['MPP / campaign', 'Multi-purpose plant that can make many molecules; a campaign is one production run of one molecule for a customer.'],
      ['Specialty chemicals (here)', 'Fluorinated intermediates made for agrochemical and pharma innovators.'],
      ['Immersion cooling', 'Cooling servers by dipping them in a non-conductive fluid; Chemours\' Opteon two-phase fluid boils and condenses to carry heat away.'],
      ['QIP', 'Qualified institutional placement: a share sale to institutional investors.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ operating profit before depreciation.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, business, history, industry, tailwind, hpp, specialty, cdmo, advanced, moat, p.financials, p.capital, quality, p.balance, ownership(p.ownershipBase), governance, forecasts, street, valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY16': 'Growth years before the Dahej build-out; drivers not reviewed (pre-FY20 annual reports not read).',
    'sales@FY18': 'Drivers not reviewed (pre-FY20 annual reports not read).',
    'ebitdaMargin@FY16': 'Mix shift towards specialty and CRAMS; drivers not reviewed in detail (pre-FY20).',
    'ebitdaMargin@FY17': 'Drivers not reviewed in detail (pre-FY20 annual reports not read).',
    'ebitdaMargin@FY18': 'Drivers not reviewed in detail (pre-FY20 annual reports not read).',
    'ebitdaMargin@FY20': 'Drivers not reviewed in detail (FY20 annual report not read).',
    'pat@FY16': 'Drivers not reviewed (pre-FY20 annual reports not read).',
    'pat@FY17': 'Drivers not reviewed (pre-FY20 annual reports not read).',
    'pat@FY18': 'Drivers not reviewed (pre-FY20 annual reports not read).',
    'pat@FY21': '−37%: against an FY20 base inflated by a negative tax charge; FY21 tax rate normal (31%).',
    'sales@FY22': '+23%: specialty +25% (₹453 cr to ₹566 cr), inorganic fluorides +42%, CRAMS +6%; legacy refrigerants and inorganics +35% on better prices.',
    'pat@FY23': '+43%: HPP +64% on HFO supplies to Honeywell and better refrigerant prices.',
    'ebitdaMargin@FY24': '−716bp: refrigerant prices hit by Chinese material in the Middle East; CDMO −42%; agro destocking.',
    'ebitdaMargin@FY25': '+341bp: R32 volumes and better realisations (HPP +26%); CDMO +31% (Q4 +141%).',
    'sales@FY26': '+41%: HPP +34%, specialty +44%, CDMO +59%.',
    'sales@Q3FY25': '+21%: HPP +22%, specialty +26%, CDMO +8%.',
    'sales@Q1FY26': '+38%: HPP +45%, specialty +35%, CDMO +23%.',
    'sales@Q2FY26': '+46%: HPP +38%, specialty +39%, CDMO +98%.',
    'sales@Q3FY26': '+47%: HPP +35%, specialty +60% (highest-ever quarter), CDMO +61%.',
    'sales@Q4FY26': '+34%: HPP only +20% (planned shutdown, catalyst recharge, ~₹15-16 cr of Middle East shipments missed); specialty +39%, CDMO +61%.',
    'sales@Q1FY27': '+44%: HPP +33% (AHF, R32 price and volume), specialty +48%, CDMO +82%.',
    'sales@FY23': '+43%: HFO supplies to Honeywell began (Jul-2022) and refrigerant prices were strong; CDMO +29%.',
    'pat@FY20': 'Inflated by a negative tax charge (tax rate −56%); not a comparable base.',
    'sales@FY24': 'Flat: CDMO −42% (campaigns ended), R22 prices weak; specialty +14%.',
    'pat@FY24': '−28%: depreciation and interest on the new Dahej plants.',
    'sales@FY25': '+14%: HPP +26%, CDMO +31%, specialty −6% (agro destocking).',
    'ebitdaMargin@FY26': '+990bp: ~70% from volumes on new capacity, ~30% pricing (CFO).',
    'pat@FY26': '+130%: record; includes a net −₹6.8 cr exceptional charge.',
    'sales@FY27E': 'GAM: +30% (Q1 +44%); new R32, MPP debottleneck, Chemours, CDMO ~US$95 mn.',
    'ebitdaMargin@FY28E': 'GAM: 32%, softer R32 prices in India\'s 2027 free year.',
    'sales@FY28E': 'GAM: +19%; new R32 plant at ~60% use; cGMP4 phase 2.',
  },
};
