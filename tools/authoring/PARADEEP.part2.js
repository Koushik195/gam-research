// Paradeep initiation, part 2: cover, the story in charts, the business and its history.
const X = require('./PARADEEP.ctx');
const { C, F, V, B, n0, n1, pctChg, SRC, SA, SQ, QL, price, mult, epsSep28, pe28, Q1, Y26, tpBrokers, PLE, ndLabels, ndVals, fwdAll, fwdMed, rating, dcfV, evV, sectorDerate, nd26 } = X;
const nbs = C.nbs.rows;

const cover = {
  headline: 'A good phosphate franchise with OCP behind it, a squeezed FY27 and a stretched balance sheet, priced for the integration payoff before it arrives',
  lead: `Paradeep is India's second-largest private phosphatic fertiliser maker: 3.7 mt of DAP, NPK and urea capacity at Paradeep (Odisha), Goa and Mangalore, with Morocco's OCP as co-promoter and main supplier. The MCFL merger (effective Oct-2025, 22.2 cr new shares) added the Mangalore plant and the south. Q1FY27 was a record (PAT ₹393 cr, EBITDA ~₹7,300/t) because the company had bought raw materials before the Middle East crisis; management itself calls ~₹5,000/t realistic for FY27, and rabi subsidy rates were unknown on 30-Sep. Net debt was ~₹6,500 cr at Mar-2026 with ₹3,600 cr of projects ahead. We value Paradeep the way the street now does, on **P/E: ${mult}x Sep-28E EPS of ₹${n1(epsSep28)}**, which gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** EV/EBITDA (₹${n0(evV)}) and DCF (₹${n0(dcfV)}) also sit below the ₹${n0(price)} share price. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Policy sets the margin, and FY27 is a squeeze year', p: `About 53% of FY26 revenue was government subsidy. Kharif 2026 NBS rates rose ~10% while sulphur went from ~$850/t (Q1 average) to $1,000+ and the phosphoric acid contract from ~$1,360 to $1,700/t. Q1's ₹7,309/t EBITDA came from cheap opening stock. We model ₹${n0(B.ebitdaPerTonne[0])}/t for FY27 (management: ~₹5,000), so EPS falls ${Math.abs(pctChg(F.eps[0], 9.6))}% to ₹${n1(F.eps[0])} even with Q1 banked.` },
    { h: 'Integration is the right plan, but it is debt-funded and keeps slipping', p: `The ₹3,600 cr programme (phosphoric acid 0.5 → 1.0 mt, more sulphuric acid, 1.0 mt granulation) should lift EBITDA per tonne by 30-35%. Timing moved from 'end-FY28' to 'around Q2FY29-FY30'. We model ~₹3,900 cr of capex in FY27-29E on top of working capital at 31% of revenue: net debt ~₹${n0(Math.round(-F.treasury[0] / 100) * 100)} cr at Mar-27E (${n1(-F.treasury[0] / F.ebitda[0])}x EBITDA). We credit ₹${n0(B.ebitdaPerTonne[1])} / ₹${n0(B.ebitdaPerTonne[2])} per tonne in FY28-29E, not management's ₹7,000+.` },
    { h: 'OCP is the real advantage; pricing power is not', p: 'OCP companies supplied ~₹8,200 cr of rock, acid, TSP and DAP in FY26 (about half of purchases): when sulphur and ammonia ran short in 2026, Paradeep still had rock and acid. It also outgrew the market (NPK +10% in FY26 vs industry −1%; farmer sales +15-16% in Q1FY27 vs ~1%). But the subsidy table and the ₹1,350 DAP price decide the margin, and half of the inputs are bought from a shareholder.' },
    { h: 'Valuation: the street pays 13x for a recovery we see only in part', p: `Prabhudas Lilladher values the stock at 13x FY28E EPS of ₹12.6; our FY28E EPS is ₹${n1(F.eps[1])} (${pctChg(F.eps[1], PLE.FY28E.eps)}%). Paradeep's one-year-forward P/E median since listing is ${n1(fwdMed)}x (on merger-consistent EPS, trough year excluded); fertiliser peers trade ${Math.abs(Math.round(sectorDerate))}% below their own medians, giving ~${mult}x. At ₹${n0(price)} the stock is on ${n1(pe28)}x our FY28E.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Balance sheet', v: 'RED' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Rabi 2026-27 NBS subsidy rates (not announced by 30-Sep-2026): the biggest swing factor for H2FY27 margins.',
    'Q2FY27 results (due by mid-November 2026): the first full quarter at $1,700/t phosphoric acid and $1,000+/t sulphur, without cheap stock.',
    'Phosphoric acid to 0.6 mt and granulation debottlenecking to 4.0 mt, both guided for December 2026.',
    'Contract award, cost and financing of the ₹3,600 cr programme (final commercial talks in July 2026).',
    'Subsidy receivable (₹4,600 cr at Jun-2026) and promoter pledges (15% of promoter shares at Jun-2026; a large release reported in August).',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `EBITDA per tonne: ₹5,245 in FY26; we model ₹${n0(B.ebitdaPerTonne[0])} for FY27`, unit: 'EBITDA per tonne sold (₹, Screener basis)', x: ['FY25', 'FY26', ...F.years], series: [{ name: 'EBITDA/t', values: [SA[6].ebitdaPerT, SA[7].ebitdaPerT, ...B.ebitdaPerTonne], fmt: 'num' }], labels: 'all', min: 0, max: 8000, lines: [{ v: 7000, text: 'Management: ₹7,000+ after integration', color: '#cf8f1f' }], source: 'Screener.in, company volumes; GAM estimates (FY25 restated incl. MCFL)' },
      { type: 'column', title: 'Quarterly EBITDA per tonne: Q1FY27 flattered by cheap stock', unit: 'EBITDA per tonne (₹, Screener basis)', x: QL, series: [{ name: 'EBITDA/t', values: SQ.map(q => q.ebitdaPerT), fmt: 'num' }], labels: 'all', source: 'Screener.in EBITDA ÷ company volumes (compiled by Prabhudas Lilladher)' },
    ] },
    { pair: [
      { type: 'stacked', title: 'Volumes: manufactured flat, trading fills the gaps', unit: 'Sales volume (\'000 tonnes)', x: QL, series: [{ name: 'Manufactured', values: SQ.map(q => Math.round(q.volMfd / 1000)), fmt: 'num' }, { name: 'Traded', values: SQ.map(q => Math.round(q.volTraded / 1000)), fmt: 'num' }], minLabel: 90, source: 'Company data compiled by Prabhudas Lilladher (31-Jul-2026)' },
      { type: 'column', title: 'The subsidy on phosphorus swings by policy', unit: 'NBS rate for P (₹ per kg)', x: nbs.map(r => r.period.replace(' (Kharif 2026)', '').replace(' (Rabi 2025-26)', '')), series: [{ name: 'P', values: nbs.map(r => r.P), fmt: 'num' }], labels: 'all', source: 'Coromandel Q2FY26 presentation (FY24-26 H1); Cabinet approval, Apr-2026 (FY26 H2 and Kharif 2026)' },
    ] },
    { pair: [
      { type: 'column', title: 'Net debt: up ₹2,700 cr in FY26; we see ~₹7,500-7,900 cr', unit: 'Net debt (₹ crore)', x: ndLabels, series: [{ name: 'Net debt', values: ndVals, fmt: 'num' }], labels: 'all', source: 'Screener.in (FY24 and earlier PPL alone); GAM Research estimates' },
      { type: 'column', title: 'The government owed ₹4,600 cr at Jun-2026', unit: 'Subsidy receivable (₹ crore)', x: ['Jun-25', 'Dec-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Subsidy due', values: [2200, 3780, 3847, 4600], fmt: 'num' }], labels: 'all', source: 'Earnings calls (Jul-2025, Feb-2026, Jul-2026); annual report FY26 (Mar-26)' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(pe28)}x our FY28E today`, unit: 'Price ÷ next full-year EPS (x)', x: fwdAll.filter(x => x[0] >= '2023-04-01').map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdAll.filter(x => x[0] >= '2023-04-01').map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(fwdMed * 10) / 10, text: `Median since listing (ex-trough): ${n1(fwdMed)}x` }, { v: mult, text: `Our target: ${mult}x`, color: '#cf8f1f' }], source: 'Screener.in prices; EPS on the merger-consistent basis; GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpBrokers.map(b => b.broker), 'GAM (base)'], series: [{ name: 'Target', values: [...tpBrokers.map(b => b.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes (May-Jul 2026), GAM Research' },
    ] },
  ],
};

const business = {
  id: 'business', nav: 'What Paradeep does', kicker: 'The business', title: 'Three port-based plants that turn imported rock, acid, sulphur and ammonia into DAP, NPK and urea',
  blocks: [
    { p: 'Paradeep makes and sells phosphatic fertilisers (DAP and NPK "complex" grades, led by NPK 20:20:0:13) and urea from three coastal plants, and imports DAP, TSP, MOP and ammonium sulphate to sell alongside. It reports a single segment. FY26: 3.67 mt produced (~100% of capacity), 4.21 mt sold (3.57 mt manufactured, 0.64 mt traded), of which NPK incl. TSP 2.46 mt, DAP 0.76 mt and urea 0.84 mt. It sells through ~7,000 dealers and ~1,00,000 retailers in 18 states under the Jai Kisaan Navratna and Mangala brands. Small industrial lines (phospho-gypsum, Zypmite soil conditioner, fluorosilicic acid, ammonium bicarbonate) round it out.' },
    { exhibit: { type: 'table', title: 'The three plants', head: ['Plant', 'Capacity', 'Products', 'Own inputs', 'Edge'], wide: [2, 4], rows: [
      ['**Paradeep, Odisha** (2,280 acres, one-third used)', '1.8 mt DAP/NPK', 'DAP, NPK 20:20:0:13, 12-32-16, 10-26-26, 14-35-14', 'Phosphoric acid 0.5 mt, sulphuric acid ~2.0 mt', 'Captive berth, 3.4 km conveyor and pipelines from the port; power from acid plants'],
      ['**Zuarinagar, Goa** (bought Jun-2022)', '0.8 mt NPK + 0.4 mt urea', 'NPK 10-26-26, 12-32-16, 19-19-19 (unique in India), 28-28-0, urea', 'Ammonia 290 kt', 'Near Mormugao port; west and south markets'],
      ['**Mangaluru, Karnataka** (MCFL, merged Oct-2025)', '0.3 mt NPK-20 + 0.4 mt urea', 'Urea, NPK 20:20:0:13', 'Ammonia 290 kt, sulphuric acid 0.13 mt', 'On the port; southern brand Mangala'],
    ], source: 'Q1FY27 presentation, annual report FY26, Prabhudas Lilladher initiation' } },
    { h: 'How it makes money' },
    { p: '**DAP and NPKs are a regulated conversion business.** Paradeep buys rock phosphate and phosphoric acid (mostly from OCP), sulphur and ammonia (imported), converts them and sells at a maximum retail price that is capped in practice: DAP at ₹1,350 a 50 kg bag, NPKs at ₹2,100-2,500 in mid-2026. The government pays a subsidy per kg of nitrogen, phosphorus, potash and sulphur (the Nutrient Based Subsidy, NBS), reset every kharif (Apr-Sep) and rabi (Oct-Mar) season, plus a special top-up on DAP. Profit per tonne = farm price + subsidy − raw-material and conversion cost. When raw materials jump faster than the subsidy, margins shrink; when policy catches up, they recover. **Urea** is fully controlled: the government pays cost plus a return under energy norms, so profit depends on plant efficiency, not prices (Goa improved from 6.4 to 6.1 Gcal/t). **Trading** imported DAP/TSP earns ~₹2,000/t against ₹6,000-7,000/t for integrated manufacturing (management).' },
    { pair: [
      { type: 'stacked', title: 'Product mix: DAP up 55% in Q1FY27 as policy favoured it', unit: 'Sales volume (\'000 tonnes)', x: QL, series: [{ name: 'DAP', values: SQ.map(q => Math.round(q.volDap / 1000)), fmt: 'num' }, { name: 'NPK 20:20:0:13', values: SQ.map(q => Math.round(q.volN20 / 1000)), fmt: 'num' }, { name: 'Other NPK & SSP', values: SQ.map(q => Math.round(q.volOtherNpk / 1000)), fmt: 'num' }, { name: 'Urea', values: SQ.map(q => Math.round(q.volUrea / 1000)), fmt: 'num' }], minLabel: 120, source: 'Company data compiled by Prabhudas Lilladher' },
      { type: 'column', title: 'Revenue per tonne: ₹62,165 in Q1FY27, up 30%', unit: 'Revenue ÷ tonnes sold (₹)', x: QL, series: [{ name: 'Revenue/t', values: SQ.map(q => q.rpt), fmt: 'num' }], labels: 'all', source: 'Screener.in, company volumes' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a state-owned plant to a three-site private group, built by deals',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, h.event, h.impact || '–']), source: 'Annual reports FY25-26, company calls, Prabhudas Lilladher initiation, Screener.in' } },
    { exhibit: { type: 'table', title: 'What the MCFL merger did to FY25 (₹ crore)', head: ['', 'PPL alone (as first reported)', 'Restated incl. MCFL', 'Difference'], rows: [
      ['Revenue', n0(C.fy25.revenueOriginal), n0(C.fy25.revenueRestated), n0(C.fy25.mcflRevenueImplied)],
      ['Net profit', n0(C.fy25.patOriginal), n0(C.fy25.patRestated), n0(C.fy25.mcflPatImplied)],
      ['Shares for EPS (crore)', '81.5', '103.7', '+22.2 (issued to MCFL holders)'],
      { hl: true, cells: ['**EPS (₹)**', `**${C.fy25.epsOriginal}**`, `**${C.fy25.epsRestated}**`, `**${Math.round((C.fy25.epsRestated / C.fy25.epsOriginal - 1) * 100)}%: dilutive**`] },
    ], source: 'Annual reports FY25 (original) and FY26 (restated, note 44(a))' } },
    { callout: `**Corporate actions:** ${C.corporateActions} The MCFL deal was all-stock (₹1,706 cr of PPL shares at ₹77, swap of 187 PPL shares per 100 MCFL shares) and diluted FY25 EPS by ~6%; it brought ~0.8 mt of volume, the Mangalore port site and southern distribution. Screener's own FY25 EPS (₹8.12) divides restated profit by the old share count; we use the company's ₹6.39.` },
  ],
};

module.exports = { cover, narrative, business, history };
