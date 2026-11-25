// ONGC report, part B-2: the story in charts, what ONGC owns, history and corporate actions.
const X = require('./ONGC.ctx');
const { C, F, V, SC, AS, SA, n0, n1, price, sh, mcap, ps, SOTP, CM, DISC, OVLPS, listedMv, stakeMv, UNL, OPAL, coreSep, coreNorm, CP, impl, implMed, implNow, current, build, medTp, CLOSE } = X;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const mlab = d => `${MON[+d.slice(5, 7) - 1]}-${d.slice(2, 4)}`;
const B = SOTP.base, wf = [B.core, listedMv, B.disc, B.ovl, B.unl].map(v => Math.round(ps(v)));
wf.push(Math.round(ps(B.total)));
const IQ = impl.filter((_, i) => i % 4 === 0), P = C.business.production, Q1 = C.q1fy27;
const NM = { HINDPETRO: 'HPCL', MRPL: 'MRPL', IOC: 'Indian Oil', GAIL: 'GAIL', PETRONET: 'Petronet LNG' };

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'waterfall', title: `Our target: the core business at ${CM.base}x normalised profit, plus the stakes`, unit: '₹ per share (base case)', x: ['ONGC core (E&P)', 'Listed stakes at market', `Holding discount (${DISC.base}%)`, 'ONGC Videsh', 'Other unlisted at cost', 'SOTP value'], series: [{ name: '₹/share', values: wf }], fmt: 'num', totalFmt: 'num', source: 'GAM Research; stakes at NSE closes on 30-Sep-2026' },
      { type: 'line', title: `The market has paid a median ${n1(implMed)}x for ONGC's core profit since 2021`, unit: 'Implied forward P/E on core profit (x)', x: IQ.map(r => mlab(r.d)), series: [{ name: 'Implied core P/E', values: IQ.map(r => Math.round(r.pe * 10) / 10), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: CM.base, text: `Our multiple ${CM.base}x (median ${n1(implMed)}x)`, color: '#cf8f1f' }], source: 'GAM Research: (market value − stakes at 80% − OVL − unlisted at cost) ÷ next full year\'s core profit' },
    ] },
    { pair: [
      { type: 'column', title: 'The Hormuz spike lifts FY27E; our Brent path falls back to ~US$70', unit: 'Brent (US$/bbl), fiscal-year average', x: ['FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Brent', values: [78.91, 70.45, ...AS.build.brent], fmt: 'n1' }], labels: 'all', source: 'ONGC AR FY26 (FY25-26); GAM assumptions from EIA STEO Sep-2026' },
      { type: 'column', title: 'Core profit: FY27E is a peak; Sep-28E is what we capitalise', unit: 'Core profit before dividends and one-offs (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Core profit', values: [...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(coreNorm[f])), ...CP.base.map(r => Math.round(r.core))], fmt: 'num' }], labels: 'all', source: 'Screener.in, ONGC AR; core = (PBT before exceptional items − dividends) × (1 − 25.17%); GAM estimates' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Gas: the cap holds old-field gas at US$7; new-well gas gets the upside', unit: 'US$/mmBtu', x: ['APM ceiling FY27', 'APM formula Sep-26', 'Own-field realisation Q1FY27', 'New-well gas Q1FY27'], series: [{ name: 'Price', values: [7.0, 9.0, Q1.gasOwnFieldsUsd, Q1.nwgUsd], fmt: 'n1' }], labels: 'all', source: 'PPAC notification (31-Aug-2026); Q1FY27 results; PL' },
      { type: 'column', title: 'Volumes have not grown in five years', unit: 'ONGC own-field production', x: P.years, series: [{ name: 'Crude (MMT)', values: P.crudeOwnMmt, fmt: 'n1' }, { name: 'Gas (BCM)', values: P.gasOwnBcm, fmt: 'n1' }], labels: 'all', source: 'ONGC AR FY26 MD&A' },
    ] },
    { pair: [
      { type: 'hbar', title: `ONGC's listed stakes are worth ₹${n0(ps(listedMv))} a share, ${Math.round(listedMv / mcap * 100)}% of its market value`, unit: '₹ crore at 30-Sep-2026 closes', x: Object.keys(stakeMv).map(s => NM[s]), series: [{ name: 'Stake value', values: Object.values(stakeMv).map(Math.round), fmt: 'num' }], labels: 'all', source: 'ONGC AR FY26 (shares held); NSE closes 30-Sep-2026' },
      { type: 'hbar', title: `Our {{dcf.tp|inr}} vs the street (median ₹${n0(medTp)})`, unit: `₹ per share; price ₹${n1(price)}`, x: [...current.map(s => `${s.short} (${MON[+s.date.slice(5, 7) - 1]})`), 'GAM bear', 'GAM base', 'GAM bull'], series: [{ name: 'Target', values: [...current.map(s => s.tp), SC.bear.tp, V.tp, SC.bull.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM base', lines: [{ v: 'P.last', axis: 'x', text: 'Price', color: '#b4232a' }], source: 'Broker notes and aggregator rows dated Jul-Sep 2026 (see Street view); GAM Research' },
    ] },
  ],
};

const business = {
  id: 'business', nav: 'What ONGC owns', kicker: 'The business', title: 'India\'s oil and gas producer, with a refining and marketing group attached',
  blocks: [
    { p: `Oil and Natural Gas Corporation (ONGC) finds and produces crude oil and natural gas in India: 73% of the country's crude and 57% of its gas in FY26. Most of its output comes from "nomination" fields given to it before the 1999 bidding regime (NELP) began (Mumbai High and the Western Offshore, Gujarat, Assam, the KG and Cauvery basins), where the government sets the gas price and takes royalty and a cess on crude; a smaller part comes from its share of blocks bid under later contract regimes. It sells crude to refiners at Brent-linked prices, gas to GAIL and city-gas companies, and LPG, naphtha and ethane-propane from its processing plants. Its 1P reserves were 518 MMtoe at March 2026 (about 13 years of output). Around this core sits a group: **ONGC Videsh** (100%: overseas fields in 14 countries), **HPCL** (54.9%) and **MRPL** (71.6%) in refining and fuel retail, stakes in **Indian Oil** (14.2%), **GAIL** (5%) and **Petronet LNG** (12.5%), the loss-making **OPaL** petrochemical plant, and **ONGC Green** (renewables).` },
    { exhibit: { type: 'table', title: 'What ONGC owns (values at 30-Sep-2026, base case)', head: ['Holding', 'What it does', 'Stake', 'Value (₹ cr)', '₹ / ONGC share', 'How we value it'], wide: [1, 5], rows: [
      ['**ONGC standalone (core)**', 'Domestic crude, gas and products; FY26 revenue ₹1,32,506 cr', '100%', n0(B.core), n0(ps(B.core)), `${CM.base}x Sep-28E core profit (₹${n0(coreSep('base'))} cr)`],
      ...Object.keys(stakeMv).map(s => [`**${NM[s]}**`, { HINDPETRO: 'Refining and fuel retail (subsidiary)', MRPL: 'Refinery at Mangaluru (subsidiary)', IOC: 'India\'s largest refiner and fuel retailer', GAIL: 'Gas transmission and marketing', PETRONET: 'LNG import terminals (associate)' }[s], `${C.stakes.listed[s].pct}%`, n0(stakeMv[s]), n0(ps(stakeMv[s])), `NSE close ₹${CLOSE[s].toFixed(2)}, less ${DISC.base}%`]),
      ['**ONGC Videsh**', 'Overseas E&P: Sakhalin-1, Mozambique LNG, Brazil, Venezuela and others; 9.67 MMTOE in FY26', '100%', n0(B.ovl), n0(OVLPS.base), 'Street values (JM ₹7, MOSL ₹23 a share): midpoint'],
      ['OPaL, ONGC Green, JVs, others', 'Petrochemicals (Dahej), renewables, power, gas grid, helicopters', 'various', n0(UNL.base), n0(ps(UNL.base)), `At cost (OPaL ₹${n0(OPAL)} cr)`],
      { hl: true, cells: ['**Value before the holding discount**', '', '', `**${n0(B.total - B.disc)}**`, `**${n0(ps(B.total - B.disc))}**`, `vs price ₹${n1(price)}`] },
    ], source: 'ONGC AR FY26 (note 11.1, MD&A), NSE closes on 30-Sep-2026, GAM Research' } },
    { p: `**Why we value the standalone company, not the group.** The consolidated accounts add HPCL and MRPL line by line: in FY26 consolidated revenue was ₹6,62,247 cr, five times standalone, and in Q1FY27 HPCL's ₹12,265 cr loss turned a ₹17,034 cr standalone profit into ₹6,554 cr for the group. Most brokers (JM, MOSL, PL, Geojit) value standalone earnings and add the stakes, and so do we; consolidated EPS appears only as context.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: a producer that the state uses as an instrument of policy',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['Jan-2018', 'Buys the government\'s controlling stake in HPCL (cost ₹36,915 cr; 54.9% today)', 'Borrowings rose; consolidated accounts now carry fuel retail'],
      ['FY20-FY21', 'Covid and the oil crash: Indian basket US$44.82 in FY21', 'EPS ₹8.94 in FY21 (a trough year under our rule)'],
      ['Apr-2023', 'Kirit Parikh gas formula: APM = 10% of the crude basket, floor US$4, ceiling US$6.50 (+US$0.25 a year from FY26)', 'Gas price stabilised but capped; new-well gas gets a 20% premium'],
      ['Jul-2022 to Dec-2024', 'Windfall tax (special additional excise duty) on domestic crude', '₹11,054 cr (FY23), ₹8,720 cr (FY24), ₹4,032 cr (FY25)'],
      ['FY23', 'Exceptional charge ₹9,235 cr (restated)', 'We exclude it from core profit'],
      ['By Mar-2026', 'OPaL (Dahej petrochemicals) is a subsidiary; ONGC\'s equity in it costs ₹21,181 cr and ONGC guarantees its debt', 'EBITDA ₹1,207 cr in FY26, −₹57 cr in Q1FY27 (feedstock costs after Hormuz)'],
      ['Dec-2025', 'Sakhalin-1 interest returned to OVL (accounted from Jan-2026)', 'OVL earns ~₹1,000 cr a quarter again'],
      ['Mar-2026', 'West Asia war; Strait of Hormuz disrupted', 'Brent to ~US$97-98 in Q1FY27; record ONGC profit; HPCL losses'],
      ['8-May / 4-Jun-2026', 'Royalty cut (offshore crude 9.09%->8%, gas 10%->8%); onland pre-NELP crude restored to 16.66%', 'Net realisation +US$2-3/bbl (CLSA)'],
      ['2025-26', 'Samudra Manthan deepwater mission approved (₹84,084 cr of government outlay)', 'More exploration capex, partly reimbursed'],
    ], source: 'ONGC AR FY26; Q1FY27 call; press (royalty notifications); GAM Research' } },
    { callout: '**Corporate actions:** a 1:2 bonus in FY17 (equity capital ₹4,278 cr to ₹6,417 cr; Screener history is adjusted) and a buyback in FY19 (to ₹6,290 cr) left 1,258 cr shares; no change since. The corporate actions that moved value were acquisitions the government asked for (HPCL, OPaL) and policy changes (windfall tax, gas formula, royalty), not share-capital moves.' },
  ],
};

module.exports = { narrative, business, history };
