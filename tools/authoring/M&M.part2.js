// M&M report, part 2: the story in charts, what M&M does, history and corporate actions. As of 30-Sep-2026.
const X = require('./M&M.ctx3');
const { n0, n1, SG, SB, sh, price, MULT, coreMed, coreNow, PE_CHART, PEERS, ST, streetRows, V, DISC, listedPs } = X;
const A = SG.annual, Q = SG.quarterly;
const SRC = 'M&M annual reports, quarterly results and sales releases; ICICI Direct (FY19-22 segment revenue); GAM Research';

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Revenue tripled since FY21, led by SUVs', unit: 'Standalone segment revenue (₹ \'000 crore)', x: A.map(a => a.fy), series: [{ name: 'Automotive', values: A.map(a => Math.round(a.autoRev / 100) / 10), fmt: 'n1' }, { name: 'Farm equipment', values: A.map(a => Math.round(a.farmRev / 100) / 10), fmt: 'n1' }], minLabel: 10, source: SRC },
      { type: 'line', title: 'Q1FY27: auto margin hit by commodities, tractors resilient', unit: 'Standalone segment PBIT margin (%)', x: Q.map(q => q.q), series: [{ name: 'Automotive', values: Q.map(q => Math.round(q.autoPbit / q.autoRev * 1000) / 10), fmt: 'pct' }, { name: 'Farm', values: Q.map(q => Math.round(q.farmPbit / q.farmRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 26, source: 'Quarterly results and press releases (Q3FY25-Q1FY27)' },
    ] },
    { pair: [
      { type: 'column', title: 'Vehicles: 3.5 lakh (FY21) to 11.2 lakh (FY26)', unit: 'Vehicles sold incl. LMM and MEAL (lakh)', x: A.map(a => a.fy), series: [{ name: 'Vehicles', values: A.map(a => a.vehicles), fmt: 'lakh', growth: true }], source: 'Company releases; ICICI Direct exhibit 2' },
      { type: 'column', title: 'Tractors: two record years in a row', unit: 'Tractors sold, domestic + exports (lakh)', x: A.map(a => a.fy), series: [{ name: 'Tractors', values: A.map(a => a.tractors), fmt: 'lakh', growth: true }], source: 'Company releases; ICICI Direct exhibit 2' },
    ] },
    { pair: [
      { type: 'line', title: `Core forward P/E: ${n1(coreNow)}x now vs a ${n1(coreMed)}x median since 2021`, unit: '(Price − stakes after 20% discount) ÷ next-year core EPS (x), weekly', x: PE_CHART.map(x => x[0]), series: [{ name: 'Core P/E', values: PE_CHART.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our ${MULT.base}x = median ${n1(coreMed)}x less ${Math.abs(X.derate).toFixed(1)}%`, color: '#cf8f1f' }], source: 'Screener.in prices; GAM core EPS (actuals to FY26, estimates FY27-28E)' },
      { type: 'hbar', title: `Sum of the parts: {{dcf.tp|inr}} a share`, unit: '₹ per share (base case)', x: ['Auto + farm (core)', 'Listed stakes at market', 'MEAL, LMM, others at cost', `Holding discount (${DISC.base}%)`, 'Value per share'], series: [{ name: '₹/share', values: [Math.round(SB.parts[0].ps), Math.round(listedPs), Math.round((SB.subsGross - X.SUBS_NOW.lv) / sh), -Math.round((SB.subsGross - SB.subsNet) / sh), Math.round(SB.perShare)], fmt: 'num' }], labels: 'all', highlight: 'Value per share', source: 'GAM Research' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Auto OEMs trade below their five-year P/E medians', unit: 'Trailing P/E at the 30-Sep-2026 close vs five-year median (%)', x: PEERS.filter(p => p.vs != null).map(p => p.symbol), series: [{ name: 'vs 5y median', values: PEERS.filter(p => p.vs != null).map(p => Math.round(p.vs * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'M&M', source: 'Screener.in; GAM Research' },
      { type: 'hbar', title: 'Our target vs the street', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => s.broker.replace(/ \(.*\)/, '')), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: price, axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes 30-Jul to 2-Aug-2026 (street chapter); GAM Research' },
    ] },
  ],
};

const business = {
  id: 'business', nav: 'What M&M does', kicker: 'Company', title: 'Two businesses inside the listed company, a dozen more around it',
  blocks: [
    { p: 'Mahindra & Mahindra (the listed company, "standalone") makes SUVs, pickups and small trucks (automotive: 75% of FY26 revenue) and tractors, farm machinery and engines (farm: 25%). It sells e-SUVs too, but those are built in M&M\'s Chakan plant for MEAL, a 92.45% subsidiary that sells them under the XEV and BE names; M&M books the vehicle at full price and earns a thin manufacturing margin. Around the listed company sits the wider group: Tech Mahindra (IT services, 25.3% held, an associate), M&M Finance (vehicle and rural loans, 52.5%), Mahindra Lifespaces, Logistics, Holidays, SML (trucks and buses), Swaraj Engines, and unlisted companies such as Last Mile Mobility (3-wheelers), Aerostructures, Accelo (steel processing) and Susten (renewables).' },
    { exhibit: { type: 'table', title: 'The two standalone businesses, FY26', head: ['', 'Automotive', 'Farm equipment'], rows: [
      ['Revenue (₹ crore)', n0(109355), n0(36409)],
      ['PBIT (₹ crore) and margin', `${n0(10141)} (9.3%)`, `${n0(7206)} (19.8%)`],
      ['Units (FY26)', 'UVs 6.60 lakh domestic (incl. 51,820 e-SUVs for MEAL); pickups and LCVs ~2.8 lakh; exports 40,990', 'Tractors 5.26 lakh (domestic 5.06 lakh, exports 20,473)'],
      ['Market share', 'SUV revenue share 25%, No.1; UVs 21.3% by volume; LCV <3.5T 52%', 'Domestic tractors 43.6% (FY26), 44.9% (Q1FY27)'],
      ['Main brands', 'Thar, Scorpio, XUV 7XO, XUV 3XO, Bolero; XEV 9e, 9S, BE 6 (for MEAL); Bolero Maxx, Jeeto (LMM)', 'Mahindra, Swaraj, Trakstar; farm machinery; Powerol engines'],
      ['Plants', 'Chakan, Nashik, Kandivali, Zaheerabad (and Nagpur from FY30)', 'Mohali (Swaraj), Kandivali, Jaipur, Zaheerabad, Rudrapur'],
    ], source: 'AR FY26 note 44 and MD&A; Q1FY27 deck; GAM Research' } },
    { exhibit: { type: 'table', title: 'The stakes around it (30-Sep-2026; M&M standalone holdings)', head: ['Company', 'How valued', 'Value (₹ cr)', '₹/share', '₹/share after 20%'], wide: [1], rows: X.stakeRows, source: 'AR FY26 note 8; NSE closes 30-Sep-2026; GAM Research' } },
    { callout: `**Why it matters:** the share price of ₹${n0(price)} pays for two things at once. About ₹${n0(SB.subsNet / sh)} a share is the stakes after a ${DISC.base}% discount; the remaining ~₹${n0(price - SB.subsNet / sh)} is what investors pay for the auto and farm businesses, ${n1(coreNow)}x their FY28E core earnings. That is the number the valuation chapter is about.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'Company', title: 'Four eras: diversification, write-offs, the SUV comeback, GST 2.0',
  blocks: [
    { p: 'The financial statements only make sense against four distinct periods. Each changed volumes, margins and, above all, how much the parent wrote off in group companies.' },
    { exhibit: { type: 'table', title: 'The four eras of M&M (FY15-FY27)', head: ['Era', 'What happened', 'What it did to the numbers'], wide: [1, 2], rows: [
      ['**FY15-19: diversification**', 'Tractors and utility vehicles fund global bets: SsangYong (Korea), Peugeot Motocycles, Sampo (Finland), Erkunt (Turkey), Mahindra USA, electric vehicles before the market existed.', 'Standalone revenue grows ~9% a year; margins 10-13%; ROE ~15%.'],
      ['**FY20-21: write-offs and reset**', 'COVID; SsangYong put into receivership; Anish Shah becomes MD (Apr-2021) with a rule: earn 18% ROE or exit.', 'Exceptional losses ₹2,014 cr (FY20) and ₹3,087 cr (FY21); EPS falls to ₹8-11.'],
      ['**FY22-25: the SUV comeback**', 'XUV700, Scorpio-N, Thar Roxx, XUV 3XO; INGLO e-SUVs (BE 6, XEV 9e) with BII and Temasek money in MEAL; LMM carved out.', 'Revenue +27% a year; core margin 12% to 15%; UV share 17.2% (FY24) to 19.7% (FY25); ROE above 20%.'],
      ['**FY26-27: GST 2.0, EVs, 2x capacity**', 'GST cut (Sep-2025); SML acquired; record UVs and tractors; MEAL profitable; Sampo and Erkunt exited; commodity shock in Q1FY27; truck and bus division to be sold to SML.', 'Revenue +25% in FY26; core margin 14.4% then 12.2% in Q1FY27; capex doubling.'],
    ], source: 'AR FY20-FY26; Q1FY27 deck and call; GAM Research' } },
    { pair: [
      { type: 'column', title: `Write-downs and one-offs: ₹${n0(-X.A.exceptional.slice(5, 12).reduce((a, b) => a + Math.min(b, 0), 0))} cr in FY20-FY26`, unit: 'Exceptional items + loss from investments in group companies (₹ crore)', x: 'fin.labels', from: 'FY17', to: 'FY26', series: [{ name: 'One-offs', ref: 'A.exceptional', fmt: 'num' }], labels: 'all', source: 'Screener.in schedules; AR FY24-FY26; GAM adjustments' },
      { type: 'column', title: 'Income from group companies: ~₹2,200 cr a year', unit: 'Dividends, interest and gains from group companies (₹ crore)', x: A.filter(a => a.invIncome).map(a => a.fy), series: [{ name: 'Group income', values: A.filter(a => a.invIncome).map(a => a.invIncome), fmt: 'num' }], labels: 'all', source: 'AR FY24 and FY26 (income from investments related to subsidiaries, associates and JVs)' },
    ] },
    { exhibit: { type: 'table', title: 'Corporate actions with an effect on the numbers', head: ['When', 'Action', 'Effect'], wide: [1, 2], rows: [
      ['Jul-2022 / Aug-2023', 'BII (₹1,850 cr) and Temasek (₹1,200 cr) invest in MEAL at headline valuations of ₹70,070 cr and ₹80,580 cr', 'CCPS converted on 1-May-2026 into 4.58% and 2.97%: an implied ~₹40,400 cr; M&M keeps 92.45%'],
      ['Mar-2023 / Jan-2024', 'IFC (₹600 cr) and India-Japan Fund (₹400 cr) invest in Last Mile Mobility', 'Converted in FY26; M&M 78.11%; listing targeted for calendar 2027'],
      ['Jun-2025', 'Rights issues in M&M Finance, Lifespaces and Logistics; M&M subscribes ₹2,967 cr', 'Stakes rise to 52.5%, 52.4% and 59.6%'],
      ['Aug-2025', 'SML Isuzu acquired (58.96%, ₹565 cr at cost) and renamed SML Mahindra', 'Trucks and buses No.2 in ILCV buses; M&M\'s own truck division to be sold to SML for ₹525 cr (FY27)'],
      ['Sep-2025', 'Sampo Rosenlew (Finland) sold; KG Mobility and RBL Bank stakes sold', 'Smaller losses abroad; ₹208 cr of gains in FY26'],
      ['Q1FY27', 'CIE stake sold (gain in consolidated profit); Erkunt Foundry (Turkey) exited with an impairment', 'Consolidated PAT +34% (+22% without the CIE gain)'],
    ], source: 'AR FY26; Q1FY27 deck; company press releases' } },
  ],
};

module.exports = { narrative, business, history };
