// Bharat Forge report, part 3: segment chapters (standalone forgings, KSSL defence, overseas, other India) and moat.
const X = require('./BHARATFORG.ctx');
const { C, D, SA, SQ, QL, A26, A25, F, AS, n0, n1, pc, pc1, rup, segRev, segE } = X;
const Q1 = C.q1fy27, yrs = ['FY24', 'FY25', 'FY26'];
const g = (a, p) => pc1((a / p - 1) * 100);
const segRows = (key, hr, he) => [
  ['Revenue', ...yrs.map(y => n0(X.yr(y)[hr])), ...segRev(key).map(n0)],
  ['  growth', ...yrs.map((y, i) => (i ? g(X.yr(y)[hr], X.yr(yrs[i - 1])[hr]) : '–')), ...segRev(key).map((v, i) => g(v, i ? segRev(key)[i - 1] : A26[hr]))],
  ['EBITDA', ...yrs.map(y => n0(X.yr(y)[he])), ...segE(key).map(n0)],
  { hl: true, cells: ['**EBITDA margin**', ...yrs.map(y => `**${n1(X.yr(y)[he] / X.yr(y)[hr] * 100)}%**`), ...segE(key).map((e, i) => `**${n1(e / segRev(key)[i] * 100)}%**`)] },
];
const HEAD = ['₹ crore', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'];
const segWhy = k => AS.segments.find(s => s.key === k);

const forgings = {
  id: 'forgings', nav: 'Forgings (standalone)', kicker: 'Segment: standalone forgings', title: 'Standalone forgings: a 27% margin business coming out of a US truck downturn',
  blocks: [
    { p: `Standalone revenue fell 5% in FY26 to ₹${n0(A26.bflRev)} cr as exports dropped 15% (North American truck destocking, tariffs), while domestic sales rose 6.5%. Tonnage fell 8.5% to 2.38 lakh tonnes. The margin held at ${n1(A26.bflEbitda / A26.bflRev * 100)}%. Q1FY27 was the second quarter of recovery: revenue ₹${n0(Q1.standalone.revenue)} cr (+11.5%), exports +12% (Americas ${g(Q1.exportsByMarket.americas, Q1.exportsByMarket.americasPrior)}), tonnage +8%, but EBITDA margin ${Q1.standalone.ebitdaMarginPct}% after ~${Q1.standalone.costHitBp}bp of energy and input costs not yet passed on.` },
    { pair: [
      { type: 'column', title: 'Standalone revenue per quarter: the trough was Q2FY26', unit: '₹ crore', x: QL, series: [{ name: 'Domestic', values: SQ.map(q => q.bflDomRev), fmt: 'num' }, { name: 'Exports', values: SQ.map(q => q.bflExpRev), fmt: 'num' }], labels: 'none', source: 'Quarterly analyst updates' },
      { type: 'line', title: 'Standalone EBITDA margin: 28-29% to 26%', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'Standalone', values: SQ.map(q => Math.round(q.bflEbitda / q.bflRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 24, max: 30, source: 'Quarterly analyst updates' },
    ] },
    { exhibit: { type: 'table', title: 'Standalone forgings: history and our forecast', head: HEAD, rows: segRows('bfl', 'bflRev', 'bflEbitda'), source: `Analyst updates; GAM estimates. ${rup(segWhy('bfl')._why)}` } },
    { callout: '**Our view:** the business is sound - few companies can make a 30-tonne crankshaft and a 0.2 kg aerospace part in one group - but it is a supplier to cyclical customers. Our +15-16% growth already assumes the US truck recovery, aerospace doubling and CDP work moving to India; the margin returns to ~27.5%, not the 28.5% of FY25.' },
  ],
};

const defence = {
  id: 'defence', nav: 'Defence (KSSL)', kicker: 'Segment: defence', title: 'Defence: a ₹11,196 cr order book, but revenue was flat for three years and margins were thin',
  blocks: [
    { p: `KSSL's revenue jumped to ₹${n0(X.yr('FY24').ksslRev)} cr in FY24 on artillery-shell exports and then stalled (₹${n0(A25.ksslRev)} cr in FY25, ₹${n0(A26.ksslRev)} cr in FY26). Margins were 4.7%, 6.3% and 10.1%. Q1FY27 was the best quarter yet: ₹${n0(Q1.subsidiaries.kssl[0])} cr revenue (+71%) and a 17.2% margin. The order book rose to ₹${n0(Q1.orders.defenceOrderBook)} cr (Jun-26), with ₹${n0(Q1.orders.defence)} cr won in Q1 including 12 naval gas-turbine generator sets. The next steps are deliveries of ATAGS (towed artillery, co-developed with DRDO) and CQB carbines from the new defence plant, which wait for a final production approval (FOPM).` },
    { pair: [
      { type: 'column', title: 'KSSL revenue per quarter: lumpy', unit: '₹ crore', x: QL, series: [{ name: 'KSSL revenue', values: SQ.map(q => q.ksslRev), fmt: 'num' }], labels: 'all', source: 'Quarterly analyst updates' },
      { type: 'column', title: 'Defence order book doubled in two years', unit: 'Order book, ₹ crore (approx.)', x: QL, series: [{ name: 'Order book', values: SQ.map(q => q.defenceOrderBook), fmt: 'num' }], labels: 'all', source: 'Analyst updates; Emkay (10-Aug-2026) chart, rounded' },
    ] },
    { exhibit: { type: 'table', title: 'KSSL: history and our forecast', head: HEAD, rows: segRows('kssl', 'ksslRev', 'ksslEbitda'), source: `Analyst updates; GAM estimates. ${rup(segWhy('kssl')._marginWhy)}` } },
    { callout: `**Our view:** this is a real defence franchise with its own designs (10 artillery platforms developed), and India's procurement is shifting to private firms. But the order book is government-paced: approvals slip, deliveries are lumpy, and margins have averaged ~7% over FY24-FY26 against a 22-23% target. We model ₹${n0(segRev('kssl')[2])} cr of revenue in FY29E at 18%; even then KSSL is ~${Math.round(segE('kssl')[2] / F.ebitda[2] * 100)}% of group EBITDA.` },
  ],
};

const overseas = {
  id: 'overseas', nav: 'Overseas & other units', kicker: 'Segments: overseas, castings, axles, EV', title: 'Overseas: ₹5,400 cr of revenue earning ~4%; CDP closing; India subsidiaries growing at thin margins',
  blocks: [
    { p: `The European plants earned EBITDA of ₹${n0(A26.euEbitda)} cr on ₹${n0(A26.euRev)} cr in FY26 (${n1(A26.euEbitda / A26.euRev * 100)}%) and lost ₹195 cr before tax; the US plants ₹${n0(A26.usEbitda)} cr on ₹${n0(A26.usRev)} cr and lost ₹133 cr. In Q1FY27 Europe made 2.8% and the US −0.8% (presses down). CDP Bharat Forge (₹${n0(A26.cdpRev)} cr revenue, ~41% of Europe) will be wound down and liquidated by end-CY2027; ₹358 cr was provided in Q1FY27. In India, K Drive (axles, 3-5% margin) and JS Autocast (castings, 11-14%) grow fast but earn far less than the forging business.` },
    { pair: [
      { type: 'line', title: 'Overseas EBITDA margins: between −4% and +6% for nine quarters', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'Europe', values: SQ.map(q => Math.round(q.euEbitda / q.euRev * 1000) / 10), fmt: 'pct' }, { name: 'US', values: SQ.map(q => Math.round(q.usEbitda / q.usRev * 1000) / 10), fmt: 'pct' }], labels: 'last', source: 'Quarterly analyst updates' },
      { type: 'column', title: 'Overseas revenue in our forecast: CDP exit cuts Europe by a third', unit: 'Revenue (₹ crore)', x: ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Europe', values: [...yrs.map(y => X.yr(y).euRev), ...segRev('eu')].map(Math.round), fmt: 'num' }, { name: 'US', values: [...yrs.map(y => X.yr(y).usRev), ...segRev('us')].map(Math.round), fmt: 'num' }], labels: 'none', source: 'Analyst updates; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'Europe, US and other Indian units: our forecast (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Europe revenue', n0(A26.euRev), ...segRev('eu').map(n0), 'CDP runs FY27, ~60% of FY28, nil FY29'],
      ['Europe EBITDA margin', n1(A26.euEbitda / A26.euRev * 100) + '%', ...segE('eu').map((e, i) => n1(e / segRev('eu')[i] * 100) + '%'), 'Post-CDP margin assumed (not disclosed)'],
      ['US revenue', n0(A26.usRev), ...segRev('us').map(n0), 'Aluminium ramp-up'],
      ['US EBITDA margin', n1(A26.usEbitda / A26.usRev * 100) + '%', ...segE('us').map((e, i) => n1(e / segRev('us')[i] * 100) + '%'), 'Target 12-16% "hopefully next year"; 50% aluminium tariff'],
      ['K Drive + JS Autocast revenue', n0(A26.othIndRev), ...segRev('othInd').map(n0), 'Full year of K Drive; castings +20%'],
      ['K Drive + JS Autocast margin', n1(A26.othIndEbitda / A26.othIndRev * 100) + '%', ...segE('othInd').map((e, i) => n1(e / segRev('othInd')[i] * 100) + '%'), ''],
      ['E-mobility EBITDA', n0(A26.emobEbitda), ...segE('emob').map(n0), 'After the ₹450 cr write-down'],
    ], source: 'Analyst updates; AR FY26; GAM estimates (assumptions.json)' } },
    { callout: '**Our view:** the best thing that can happen to the overseas business is that it gets smaller. Management has promised better overseas results several times; we give credit for the CDP exit and a partial US recovery, but not for the 12-16% US margins management hopes for while US aluminium tariffs stand.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real moat in heavy forging and qualification; none overseas; defence still being proven',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (filings, calls and broker notes to Sep-2026)' },
    { callout: '**Honest verdict:** Bharat Forge has a narrow but genuine moat in India: scale, metallurgy and decades of qualification with global truck and engine makers. It has no pricing power over those customers, and no advantage in its European and US plants. Defence could become a second moat - own artillery designs are rare - but the evidence so far is orders, not profits.' },
  ],
};

module.exports = { forgings, defence, overseas, moat };
