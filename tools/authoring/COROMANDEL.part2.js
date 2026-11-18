// Coromandel initiation, part 2: cover, the story in charts, the business and its history.
const X = require('./COROMANDEL.ctx');
const { C, D, F, V, n0, n1, pctChg, SRC, SA, SQ, QL, FYS, A26, A25, A21, price, mult, epsSep28, pe28, peSep28, Q1, tpBrokers, moslEps, ncLabels, ncVals, fwd, fwdMed21, rating, dcfV, evV } = X;

const cover = {
  headline: 'A well-run fertiliser leader in a subsidy squeeze, priced as if the squeeze were over',
  lead: `Coromandel is India's largest private phosphatic fertiliser maker (Nutrient & allied, ~87% of revenue and ~84% of segment EBITDA in FY26) with a fast-growing crop protection arm that now includes 53%-owned NACL Industries. Q1FY27 showed both sides: crop protection had a record quarter (standalone EBIT +44%), but fertiliser profit fell 24% as Middle East-driven ammonia, sulphur and phosphoric acid costs ran ahead of a 10% subsidy increase. The 2026 monsoon ended at 87% of normal (76% in the south, Coromandel's core market), and rabi subsidy rates were still unannounced on 30-Sep. We value Coromandel the way the street does, on **P/E: ${mult}x Sep-28E EPS of ₹${n1(epsSep28)}**. That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** EV/EBITDA (₹${n0(evV)}) and DCF (₹${n0(dcfV)}) are higher but also below the share price. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Fertiliser margins are set in Delhi, not Chennai', p: `About 77% of Q1FY27 revenue was subsidised fertiliser. The government fixes the subsidy per kg of nutrient (NBS) and, in practice, the farm-gate price. Kharif 2026 rates rose ~10% while phosphoric acid rose from $1,360 to $1,700 a tonne; Nutrient PBIT fell 24% to ₹479 cr (6.9% margin vs 9.9%). Rabi rates were unknown on 30-Sep. Manufactured EBITDA was "₹5,000 plus" per tonne in FY26 and below ₹3,500 in Q4.` },
    { h: 'Backward integration helps, but adds costs first', p: `The new Kakinada sulphuric and phosphoric acid plants (60% of acid needs), the Senegal rock mine and a 7.5 lakh t granulation train (Q4FY27) should lift EBITDA per tonne towards management's ₹6,500 target. But D&A jumped to ₹${n0(SQ.at(-1).depreciation)} cr in Q1FY27 (₹121 cr a year earlier) from the acid plants, mine amortisation and NACL intangibles, so EPS lags EBITDA. We model fertiliser EBITDA margins of 9.2% / 11.0% / 11.2% (FY27-29E): back to FY25 levels, not above.` },
    { h: 'Crop protection is the growth engine, but still small', p: `Crop protection revenue rose 50% to ₹${n0(A26.cpRev)} cr in FY26 (NACL from Aug-2025) and standalone EBIT margin is ~19%. We model +30% / +14% / +12% at a 15.5-16.5% EBITDA margin; NACL earns ~11% and 46% of it belongs to minorities. Even by FY29E, crop protection is only ~22% of segment EBITDA: not enough to make Coromandel an "agrochemical" stock.` },
    { h: 'Valuation: the street pays for a recovery we cannot yet see', p: `Brokers use 25-30x FY28E EPS (Motilal Oswal 25x on ~₹${n1(moslEps)} implied). Our FY28E EPS of ₹${n1(F.eps[1])} is ${Math.abs(pctChg(F.eps[1], moslEps))}% lower because we charge the higher D&A and finance cost and assume only partial subsidy relief. The stock's one-year-forward P/E median since 2021 is ${n1(fwdMed21)}x; fertiliser and agrochemical peers trade ~14% below their own medians. At ₹${n0(price)} it trades at ${n1(pe28)}x our FY28E.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Rabi 2026-27 NBS subsidy rates (due before the October-March season): the single biggest swing factor for H2FY27 fertiliser margins.',
    'Q2FY27 results (due by mid-November 2026): Kharif-season margins at a $1,700/t phosphoric acid price; subsidy receivables.',
    'Rabi demand in Andhra Pradesh, Telangana and Karnataka after a monsoon at 76% of normal in the south peninsula and low reservoirs.',
    'Commissioning of the 7.5 lakh t granulation train (Q4FY27) and stable running of the new phosphoric acid plant.',
    'Clarity on the government\'s "reasonable margin" guidelines for P&K fertilisers (a possible profit cap).',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: `Fertilisers still earn ~${Math.round(A26.nutEbitda / (A26.nutEbitda + A26.cpEbitda) * 100)}% of segment EBITDA`, unit: 'Segment EBITDA (₹ crore)', x: FYS, series: [{ name: 'Nutrient & allied', values: SA.map(a => Math.round(a.nutEbitda)), fmt: 'num' }, { name: 'Crop protection', values: SA.map(a => Math.round(a.cpEbitda)), fmt: 'num' }], minLabel: 300, source: 'Annual reports (segment note); EBITDA = segment PBIT + D&A, ex-impairments' },
      { type: 'line', title: 'Fertiliser margin has drifted down since FY21', unit: 'Segment EBITDA margin (%)', x: FYS, series: [{ name: 'Nutrient & allied', values: SA.map(a => a.nutEbitdaPct), fmt: 'pct' }, { name: 'Crop protection', values: SA.map(a => a.cpEbitdaPct), fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Annual reports, GAM calculation' },
    ] },
    { pair: [
      { type: 'line', title: 'Q1FY27: fertiliser margin squeezed, crop protection firm', unit: 'Segment PBIT margin (%, quarterly)', x: QL, series: [{ name: 'Nutrient & allied', values: SQ.map(q => q.nutEbitPct), fmt: 'pct' }, { name: 'Crop protection', values: SQ.map(q => q.cpEbitPct), fmt: 'pct' }], labels: 'last', min: 0, max: 18, source: SRC },
      { type: 'column', title: 'The NBS subsidy on phosphorus swings by policy', unit: 'NBS rate for P (₹ per kg)', x: C.nbs.rows.map(r => r.period.replace(' (Kharif 2026)', '')), series: [{ name: 'P', values: C.nbs.rows.map(r => r.P), fmt: 'num' }], labels: 'all', source: 'Q2FY26 presentation; Kharif 2026 per Cabinet approval (Apr-2026)' },
    ] },
    { pair: [
      { type: 'column', title: 'Depreciation has stepped up with the new assets', unit: 'D&A (₹ crore, quarterly)', x: 'Q.labels', series: [{ name: 'D&A', ref: 'Q.dep', fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated)' },
      { type: 'column', title: 'Net cash: spent on NACL and capex, rebuilding from FY27E', unit: 'Net cash incl. ICDs (₹ crore)', x: ncLabels, series: [{ name: 'Net cash', values: ncVals, fmt: 'num' }], labels: 'all', source: 'Company (FY20-26; ICDs from FY25), GAM Research estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(pe28)}x our FY28E today`, unit: 'Price ÷ next full-year EPS (x)', x: fwd.filter(x => x[0] >= '2019-04-01').map(x => x[0]), series: [{ name: 'Forward P/E', values: fwd.filter(x => x[0] >= '2019-04-01').map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(fwdMed21 * 10) / 10, text: `Median since 2021: ${n1(fwdMed21)}x` }, { v: mult, text: `Our target: ${mult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS, GAM estimates for FY27-29E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpBrokers.map(b => b.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...tpBrokers.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press reports (Jul-2026), GAM Research' },
    ] },
  ],
};

const business = {
  id: 'business', nav: 'What Coromandel does', kicker: 'The business', title: 'A phosphatic fertiliser franchise with a crop protection business attached',
  blocks: [
    { p: 'Coromandel makes and sells phosphatic fertilisers (DAP and NPK "complex" grades) from two large complexes at Visakhapatnam and Kakinada, sells single super phosphate (SSP) from eight smaller plants, and trades imported DAP, urea and potash. Around this core it sells specialty and organic nutrients, nano DAP, drone spraying and ~1,200 own retail stores, mostly in Andhra Pradesh, Telangana and Karnataka. The crop protection segment makes technicals (mancozeb is the largest) and branded formulations, sells B2B and exports, and since August 2025 consolidates NACL Industries. It is a Murugappa group company: E.I.D. Parry owns 55.6%.' },
    { exhibit: { type: 'table', title: 'The two segments in FY26', head: ['Segment', 'What it sells', 'Revenue (₹ cr)', 'EBITDA (₹ cr)', 'EBITDA margin', 'PBIT (₹ cr)', 'Capital employed (₹ cr)'], wide: [1], rows: [
      ['**Nutrient & allied**', 'DAP/NPK (4.3 mt sold, 17.5% share), SSP (8.4 lakh t, #1), traded urea/MOP, specialty and organic nutrients, nano, retail, drones, Senegal rock. Subsidy = ₹11,139 cr of revenue', n0(A26.nutRev), n0(A26.nutEbitda), A26.nutEbitdaPct + '%', n0(A26.nutEbit), n0(15478.87 - 9017.72)],
      ['**Crop protection**', 'Technicals (mancozeb etc.), domestic formulations, exports/B2B, bio-pesticides; NACL Industries (53.7%) from 8-Aug-2025', n0(A26.cpRev), n0(A26.cpEbitda), A26.cpEbitdaPct + '%', n0(A26.cpEbit), n0(4516.87 - 1167.39)],
      ['Less inter-segment', '', '−' + n0(A26.interSeg), '', '', '', ''],
      { hl: true, cells: ['**Consolidated**', '', n0(A26.consRev), '3,232 (after ₹343 cr central costs)', '10.3%', '', ''] },
    ], source: 'Integrated Report 2025-26 (note 31); EBITDA = segment PBIT + D&A, excluding the ₹70.56 cr drone goodwill impairment; capital employed = segment assets − segment liabilities' } },
    { h: 'How each business makes money' },
    { p: '**Fertilisers are a regulated conversion business.** Coromandel buys phosphoric acid, ammonia, sulphur and rock phosphate (largely imported), converts them into DAP and NPK, and sells at a maximum retail price that is effectively capped. The government pays a subsidy per kg of nitrogen (N), phosphorus (P), potash (K) and sulphur (S) under the Nutrient Based Subsidy (NBS) scheme, revised every season. Profit per tonne = MRP + subsidy − raw-material cost − conversion cost. When global raw materials jump and the subsidy lags (FY23, Q4FY26-Q1FY27), margins compress; when policy catches up, they recover. **Crop protection is a chemistry and brands business**: technicals compete on cost with China, branded formulations on distribution and new products. It is not subsidised and can pass on costs, which is why its margins are steadier.' },
    { pair: [
      { type: 'line', title: 'Crop protection: ~13% of revenue, ~16% of segment EBITDA', unit: 'Crop protection share (%)', x: FYS, series: [{ name: 'Share of segment revenue', values: SA.map(a => a.cpShareRev), fmt: 'pct' }, { name: 'Share of segment EBITDA', values: SA.map(a => Math.round(a.cpEbitda / (a.nutEbitda + a.cpEbitda) * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 25, source: 'Annual reports (segment note), GAM calculation' },
      { type: 'column', title: 'DAP + NPK volumes: +36% in six years', unit: 'Company sales volume (lakh tonnes)', x: FYS, series: [{ name: 'DAP + NPK', values: SA.map(a => a.volNpkDap), fmt: 'n1' }, { name: 'SSP', values: SA.map(a => a.volSsp), fmt: 'n1' }], labels: 'all', source: 'Integrated Report 2025-26 (MD&A)' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a 1961 joint venture to an integrated agri-inputs group',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, h.event, h.impact || '–']), source: 'Integrated Report 2025-26 (legacy and milestones), annual reports, company calls, Screener.in' } },
    { callout: `**Corporate actions:** ${C.corporateActions} Growth since FY21 has been funded from internal cash: the company had net cash of ~₹4,570 cr (incl. ICDs) at Mar-2025 before buying NACL and building the acid plants.` },
  ],
};

module.exports = { cover, narrative, business, history };
