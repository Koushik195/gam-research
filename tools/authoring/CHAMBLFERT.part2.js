// Chambal initiation, part 2: cover, the story in charts, the business and its history.
const X = require('./CHAMBLFERT.ctx');
const { C, D, F, V, n0, n1, pctChg, SRC, SA, SQ, QL, SEGY, SEGL, A26, Q1, FY, UB, g3Annual, g3Eps, price, mult, epsSep28, pe28, BR, FM, rating, dcfV, evV, streetEps, fwd } = X;
const upt = SEGY.map(a => a.ureaEbitdaPerT), uptF = F.years.map(y => UB.ebitdaPerT[y]);
const tps = BR.filter(b => b.tp).sort((a, c) => c.tp - a.tp);

const cover = {
  headline: 'A low-cost urea maker about to lose the special pricing on its best plant: fairly valued, not cheap',
  lead: `Chambal is India's largest private-sector urea maker (3.4 mt a year at one site in Gadepan, Rajasthan; ~10% of national output) and sells imported DAP, MOP and NPK, crop-protection products and, from FY27, technical ammonium nitrate (TAN). Urea earned ~80% of segment EBITDA in FY26. Q1FY27 looked strong (EBITDA +12%) mainly because traded fertiliser bought before the West Asia war sold at a 13.7% margin; PAT fell 5% as the IMACID joint venture lost money. The fact that dominates the next three years is policy: Gadepan-III's NIP-2012 pricing ends in December 2026 and the follow-on formula was undecided on 30-Sep. We cut its EBITDA by ₹${n0(UB.g3CutPerT)} a tonne (~₹${n0(g3Annual)} cr a year), so EPS goes ₹48.8 (FY26) → ₹${n1(F.eps[0])} → ₹${n1(F.eps[1])} → ₹${n1(F.eps[2])} (FY27-29E). We value Chambal the way most of the street does, on **P/E: ${mult}x Sep-28E EPS of ₹${n1(epsSep28)}**, which gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** EV/EBITDA (₹${n0(evV)}) and DCF (₹${n0(dcfV)}) are higher; bull {{scen.bull.tp|inr}}, bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Urea is a cost-plus annuity, and Chambal runs it well', p: `The government fixes the farm price of urea and pays the rest as subsidy: gas is passed through, fixed costs are reimbursed and the producer keeps what it saves against energy norms. Chambal's Gadepan-I and II run 4-6% below their norms and Gadepan-III 2-3% below; the plants sell 32-35 lakh t a year. Urea EBITDA was ₹2,190 cr in FY26 (₹6,431/t, ROCE ~25% on segment capital). That is steady, but it cannot grow without new capacity.` },
    { h: 'The December 2026 reset is the story for FY28', p: `Gadepan-III (1.27 mt) is paid under the 2012 New Investment Policy: ~US$285/t at a base gas price plus ~US$20/t for each US$1/mmBtu rise in gas. That pricing lasts eight years and ends in December 2026. The government had not decided the replacement by 30-Sep; precedent uses net fixed assets and a return on net worth. Elara cuts the plant's EBITDA/t by about a third, IIFL its EBIT/t from ₹7,494 to ₹4,400. Our ₹${n0(UB.g3CutPerT)}/t cut costs ~₹${n1(g3Eps)} of EPS a year from FY28.` },
    { h: 'Traded fertilisers, CPC and TAN add revenue, not much margin', p: `Imported DAP/NPK earned 4.0% EBITDA margin in FY26 (−4.0% in FY23); Q1FY27's 13.7% was a one-off inventory gain. CPC and speciality nutrients earn ~23% on ₹1,203 cr of revenue. The ₹1,645 cr TAN plant started trial production in June 2026; we model ₹720 cr of revenue and ₹180 cr of EBITDA in FY28. Together they replace about half of the Gadepan-III loss: FY28E group EBITDA ₹{{F.ebitda.1|num}} cr vs ₹2,694 cr in FY26.` },
    { h: 'Valuation: cheap on the street\'s numbers, fair on ours', p: `Brokers' targets run from ₹${n0(tps.at(-1).tp)} to ₹${n0(tps[0].tp)}, all above the price, on FY28E EPS of ₹42.9-61.8 (median ₹${n1(streetEps('FY28E'))}). Our FY28E EPS is ₹${n1(F.eps[1])}. Chambal's one-year-forward P/E has had a median of ${n1(FM.median)}x since 2021; fertiliser peers trade ~12% below their own five-year medians, so we use ${mult}x. At ₹${n0(price)} the stock trades at ${n1(pe28)}x our FY28E EPS: it already prices the reset, but not more than that.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'GREEN' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'The government\'s pricing formula for Gadepan-III after its NIP-2012 period ends (December 2026): every ₹1,000/t of difference from our assumption moves FY28E EPS by ~₹2.4.',
    'Rabi 2026-27 NBS subsidy rates (pending on 30-Sep-2026): they decide whether traded NPK/DAP stays profitable in H2FY27.',
    'Q2FY27 results (due by mid-November 2026): first TAN revenue once the plant is declared commissioned, and how fast traded margins normalise.',
    'A Board decision on the fourth urea plant under NIPU-2026 (financial bids expected by mid-October 2026): ₹9,500-10,000 cr at returns management calls "dilutive".',
    'IMACID\'s return to profit after the sulphur-driven shutdown, and its expansion to 7 lakh t of P2O5 (April-June 2027).',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: `Urea still earns ~${Math.round(A26.ureaShareEbitda)}% of segment EBITDA`, unit: 'Segment EBITDA (₹ crore)', x: SEGL.slice(1), series: [{ name: 'Urea', values: SEGY.slice(1).map(a => Math.round(a.ureaEbitda)), fmt: 'num' }, { name: 'Complex fertilisers', values: SEGY.slice(1).map(a => Math.round(a.cfEbitda)), fmt: 'num' }, { name: 'CPC, SN & seeds', values: SEGY.slice(1).map(a => Math.round(a.cpcEbitda)), fmt: 'num' }], minLabel: 150, source: 'Annual reports FY24-26 (segment note); EBITDA = segment PBIT + segment D&A' },
      { type: 'column', title: 'Urea EBITDA per tonne steps down after the Gadepan-III reset', unit: 'Urea EBITDA (₹ per tonne sold)', x: [...SEGL, ...F.years], series: [{ name: 'EBITDA/t', values: [...upt, ...uptF], fmt: 'num' }], labels: 'all', source: 'Company (FY23-26), GAM Research estimates' },
    ] },
    { pair: [
      { type: 'line', title: 'Q1FY27: traded margin spiked on cheap stock', unit: 'Segment PBIT margin (%, quarterly)', x: QL, series: [{ name: 'Urea', values: SQ.map(q => q.ureaEbitPct), fmt: 'pct' }, { name: 'Complex fertilisers', values: SQ.map(q => q.cfEbitPct), fmt: 'pct' }, { name: 'CPC, SN & seeds', values: SQ.map(q => q.cpcEbitPct), fmt: 'pct' }], labels: 'last', min: -5, max: 30, source: SRC },
      { type: 'column', title: 'Subsidy owed by the government has almost doubled', unit: 'Receivables (₹ crore)', x: ['Jun-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Subsidy receivable', values: [1326, 1954, 2462], fmt: 'num' }, { name: 'Market debtors', values: [661, 121, 841], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation; Q4FY26 call' },
    ] },
    { pair: [
      { type: 'column', title: 'EPS: FY26\'s ₹48.8 is not regained by FY29E', unit: 'EPS (₹)', x: 'fin.labels', from: 'FY20', series: [{ name: 'EPS', ref: 'fin.eps', fmt: 'n1' }], labels: 'all', source: 'Company, GAM Research estimates' },
      { type: 'column', title: 'Traded volumes more than doubled in FY26', unit: 'Sales volume (lakh tonnes)', x: SA.map(a => a.fy), series: [{ name: 'Urea', values: SA.map(a => a.ureaSales), fmt: 'n1' }, { name: 'DAP/TSP + MOP + NPK', values: SA.map(a => a.cfVol), fmt: 'n1' }], labels: 'all', source: 'Annual reports FY21-26 (MD&A)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(pe28)}x our FY28E today`, unit: 'Price ÷ next full-year EPS (x)', x: fwd.filter(x => x[0] >= '2019-04-01').map(x => x[0]), series: [{ name: 'Forward P/E', values: fwd.filter(x => x[0] >= '2019-04-01').map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: FM.median, text: `Median since 2021: ${n1(FM.median)}x` }, { v: mult, text: `Our target: ${mult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS, GAM estimates for FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tps.map(b => b.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...tps.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes May-Aug 2026 (latest per broker), GAM Research' },
    ] },
  ],
};

const segCE = { urea: 8442.93 - 1078.70, cf: 2746.43 - 371.02, cpc: 247.29 - 69.54, tan: 1312.28 - 145.76 };
const business = {
  id: 'business', nav: 'What Chambal does', kicker: 'The business', title: 'A urea plant with a distribution business and a chemicals project attached',
  blocks: [
    { p: 'Chambal makes urea (and some surplus ammonia) at three plants on one site at Gadepan, near Kota in Rajasthan, and sells it across 14 states in north, central and west India. Through the same network of 4,918 dealers and 93,000+ retailers it sells imported fertilisers (DAP, TSP, MOP, NPK grades and, since Q1FY27, ammonium sulphate), and crop-protection chemicals, speciality nutrients, biologicals and seeds under the "Uttam" brand, all sourced from other manufacturers. It owns a third of IMACID, a Moroccan phosphoric-acid maker (with Tata Chemicals and OCP), and is commissioning a 2.4 lakh t technical ammonium nitrate plant for the mining and explosives market. The K K Birla family groups (Poddar, Bhartia and Nopany) own 61%.' },
    { exhibit: { type: 'table', title: 'The segments in FY26', head: ['Segment', 'What it sells', 'Revenue (₹ cr)', 'EBITDA (₹ cr)', 'EBITDA margin', 'Capital employed (₹ cr)', 'PBIT / capital'], wide: [1], rows: [
      ['**Urea (own manufactured)**', '34.06 lakh t of urea from Gadepan-I, II and III, plus surplus ammonia; most of the revenue is subsidy', n0(A26.ureaRev), n0(A26.ureaEbitda), A26.ureaEbitdaPct + '%', n0(segCE.urea), Math.round(A26.ureaEbit / segCE.urea * 100) + '%'],
      ['**Complex fertilisers**', 'Imported DAP/TSP 5.13, MOP 1.35, NPK 5.83 lakh t; NBS subsidy per kg of nutrient', n0(A26.cfRev), n0(A26.cfEbitda), A26.cfEbitdaPct + '%', n0(segCE.cf), Math.round(A26.cfEbit / segCE.cf * 100) + '%'],
      ['**CPC, speciality nutrients & seeds**', 'Sourced insecticides, fungicides, herbicides, biologicals, seeds', n0(A26.cpcRev), n0(A26.cpcEbitda), A26.cpcEbitdaPct + '%', n0(segCE.cpc), '>100%'],
      ['Others (TAN plant)', 'Under construction; trial production from June 2026', '–', '–', '–', n0(segCE.tan), '–'],
      { hl: true, cells: ['**Consolidated**', 'Plus 33.33% of IMACID (equity-accounted; ₹129 cr share of profit)', n0(FY.revenue), '2,694 (after ₹63 cr unallocated)', '13.0%', '', ''] },
    ], source: 'Annual Report 2025-26 (note 29); EBITDA = segment PBIT + segment D&A; capital employed = segment assets − segment liabilities; ~90% subsidy share is GAM\'s estimate from ₹13,830 cr of government revenue across urea and complex fertilisers' } },
    { h: 'How each business makes money' },
    { p: '**Urea is a regulated conversion business.** The government fixes the farm price (MRP) and pays the producer the difference between its assessed cost and the MRP as subsidy. Gas, the main input, is bought from a national pool and passed through at a normative consumption per tonne; fixed costs are reimbursed at set rates. Profit comes from (1) using less energy than the norm, (2) producing above "reassessed capacity", which is paid at gas cost plus a fixed element capped by the import price, and (3) for Gadepan-III until December 2026, a price formula that pays more when gas is dear. **Complex fertilisers are trading**: Chambal buys DAP, MOP and NPK abroad, the government pays a subsidy per kg of nutrient (NBS), and the margin depends on buying well relative to the subsidy and the price farmers will pay. **CPC and seeds** are branded distribution with no manufacturing. **TAN** will be Chambal\'s first unregulated manufactured product.' },
    { pair: [
      { type: 'column', title: 'Urea volumes are flat: the plants are full', unit: 'Urea (lakh tonnes)', x: SA.map(a => a.fy), series: [{ name: 'Production', values: SA.map(a => a.ureaProd), fmt: 'n1' }, { name: 'Sales', values: SA.map(a => a.ureaSales), fmt: 'n1' }], labels: 'all', min: 28, max: 36, source: 'Annual reports (MD&A)' },
      { type: 'column', title: 'CPC & speciality nutrients: ₹309 cr to ₹1,203 cr in five years', unit: 'Revenue (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'CPC, SN & seeds', values: SA.map(a => Math.round(a.cpcRev)), fmt: 'num' }], labels: 'all', source: 'Annual reports (MD&A; FY21 = agrochemicals net)' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a K K Birla conglomerate to a focused urea company with a balance sheet to spend',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, h.event, h.impact || '–']), source: 'Annual reports FY21-26, company presentations, press reports (shipping, textiles), Screener.in' } },
    { callout: `**Corporate actions:** ${C.corporateActions} The pattern: Chambal sold every non-core business (textiles, shipping, software) to fund and then de-lever Gadepan-III, and returned cash once the debt was gone. The fourth urea plant would reverse that: the balance sheet would carry project debt again.` },
  ],
};

module.exports = { cover, narrative, business, history };
