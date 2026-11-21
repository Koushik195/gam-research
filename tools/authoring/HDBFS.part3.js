// HDB Financial Services report, part 3: franchise and loan mix (growth by product, our AUM build), the three
// verticals, spread and NIM.
const X = require('./HDBFS.ctx');
const { C, SG, F, n0, n1, n2, pc, Q1, GD, SE } = X;
const PR = SG.products.rows, VB = SG.verticalBook, VJ = VB.find(v => v.q === 'Jun-26'), VJ0 = VB.find(v => v.q === 'Jun-25'), VM = VB.find(v => v.q === 'Mar-26');
const gr = r => (r[4] / r[2] - 1) * 100;
const byGrowth = [...PR].filter(r => r[2] > 1000).sort((a, c) => gr(c) - gr(a));
const add = [...PR].map(r => [r[0], r[4] - r[2]]).sort((a, c) => c[1] - a[1]);

const franchise = {
  id: 'franchise', nav: 'Franchise & loan mix', kicker: 'Growth', title: 'Growth: 11% for two years while HDB cleaned up; consumer loans and gold are growing, trucks and business loans are not',
  blocks: [
    { p: `Gross loans grew ${Q1.loanGrowth}% in the year to Jun-2026 (₹${n0(VJ0.total)} cr → ₹${n0(VJ.total)} cr) and 2.8% in the quarter. The split is stark. Consumer finance grew ${pc((VJ.cf / VJ0.cf - 1) * 100)}, led by consumer durables (+51%) and car loans (+21%); gold loans doubled from a small base. Asset finance grew ${pc((VJ.af / VJ0.af - 1) * 100)} after HDB walked away from high-value, low-return truck products, and unsecured business loans shrank 8% as HDB tightened after the FY25 stress. Management says the cleanup is done: "a large part of that work has been done… you should start to see growth coming through" (CFO, Q1FY27 call), with business loans growing again from Q3FY27.` },
    { pair: [
      { type: 'hbar', title: 'Growth by product, Jun-25 to Jun-26', unit: 'Year-on-year growth in gross loans (%); products above ₹1,000 cr', x: byGrowth.map(r => r[0]), series: [{ name: 'Growth', values: byGrowth.map(r => Math.round(gr(r))), fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation p24' },
      { type: 'hbar', title: 'Where the last year\'s ₹12,504 cr of growth came from', unit: 'Increase in gross loans, Jun-25 to Jun-26 (₹ crore)', x: add.map(r => r[0]), series: [{ name: 'Added', values: add.map(r => r[1]), fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation p24' },
    ] },
    { exhibit: { type: 'table', title: 'Our AUM build vs guidance and the street', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['AUM (₹ cr)', '{{fin.aum.4|num}}', '{{fin.aum.5|num}}', '{{F.aum.0|num}}', '{{F.aum.1|num}}', '{{F.aum.2|num}}'],
      ['Growth', '{{fin.aumGrowth.4|pct}}', '{{fin.aumGrowth.5|pct}}', '{{F.aumGrowth.0|pct}}', '{{F.aumGrowth.1|pct}}', '{{F.aumGrowth.2|pct}}'],
      ['Company aim', 'n.d.', 'n.d.', 'Nominal GDP + 6-7% (~16-18%) over three years', '', ''],
      ['Street (Motilal / Emkay / Jefferies)', '', '', `~15% / ${SE.emkay.aumGrowth.FY27E}% / ${SE.jefferies.aumGrowth.FY27E}%`, `~17% / ${SE.emkay.aumGrowth.FY28E}% / ${SE.jefferies.aumGrowth.FY28E}%`, `– / ${SE.emkay.aumGrowth.FY29E}% / ${SE.jefferies.aumGrowth.FY29E}%`],
    ], source: 'Company presentations and calls; Motilal Oswal (28-Aug-2026, AUM ₹1,36,419 cr / ₹1,58,935 cr), Emkay (15-Jul-2026), Jefferies (15-Apr-2026); GAM estimates. n.d. = not disclosed' } },
    { callout: `**Our view:** we take 14% for FY27 (Q2-Q4 need ~3.5% a quarter after Q1's 2.8%; disbursements are already up 16%) and 16% and 17% after, short of the 18% management hopes for. Consumer finance can keep growing at 20%; the open question is asset finance (37% of loans), which has grown 9-10% for a year. The street (15-18%) gives HDB more credit for the turn than we do.` },
  ],
};

const S3 = k => SG.verticalStage3[k];
const verticals = {
  id: 'verticals', nav: 'The three verticals', kicker: 'Segments', title: 'Three verticals: steady mortgages, cyclical trucks, fast but short-dated consumer loans',
  blocks: [
    { p: `**Enterprise lending (₹${n0(VJ.el)} cr, 38%).** Mostly loans against property (₹26,422 cr; average ticket ₹47 lakh, ~10-year tenor) and secured business loans, plus ₹11,497 cr of unsecured business loans (₹3 lakh tickets), salaried personal loans and a young gold-loan book (₹1,874 cr, offered in ~500 branches). Mortgages are the steady part: LAP grew 13% and Stage 3 in the vertical is ${(S3('Jun-26').el[0] / VJ.el * 100).toFixed(1)}%. Unsecured business loans were the problem in FY25-FY26 and are only now being grown again.` },
    { p: `**Asset finance (₹${n0(VJ.af)} cr, 37%).** Loans for commercial vehicles (₹29,503 cr, new and used), construction equipment (₹12,444 cr) and tractors (₹3,062 cr), mainly to owner-drivers, small fleets and contractors; HDB says it has little exposure to large fleets on fixed contracts. This is where losses concentrate: Stage 3 rose from ${(S3('Mar-25').af[0] / VB[0].af * 100).toFixed(1)}% (Mar-25) to ${(S3('Dec-25').af[0] / VB[2].af * 100).toFixed(1)}% (Dec-25) and is back to ${(S3('Jun-26').af[0] / VJ.af * 100).toFixed(1)}%. HDB has refocused on used vehicles and dropped high-value, low-return products; volumes in the products it wants are at records (May-2026), but the book grew only ${pc((VJ.af / VJ0.af - 1) * 100)}.` },
    { p: `**Consumer finance (₹${n0(VJ.cf)} cr, 25%).** Consumer-durable loans (₹6,759 cr; average ₹18,000, ~1 year), car loans (₹10,584 cr), two-wheelers (₹3,747 cr), relationship personal loans to existing customers (₹9,448 cr) and a small microfinance pilot (₹558 cr). It grew ${pc((VJ.cf / VJ0.cf - 1) * 100)} and has the best asset quality (Stage 3 ${(S3('Jun-26').cf[0] / VJ.cf * 100).toFixed(1)}%, cover ${S3('Jun-26').cf[1]}%), helped by short tenors and high provisioning. It is also the main source of new customers (23.9 mn, +19%), whom HDB then cross-sells.` },
    { exhibit: { type: 'table', title: 'Stage 3 by vertical (% of the vertical\'s loans) and provision cover', head: ['Vertical', 'Mar-25', 'Jun-25', 'Dec-25', 'Mar-26', 'Jun-26', 'Cover Jun-26'], rows: SG.verticals.map(v => [v.name, ...['Mar-25', 'Jun-25', 'Dec-25', 'Mar-26', 'Jun-26'].map(q => `${(S3(q)[v.key][0] / VB.find(x => x.q === q)[v.key] * 100).toFixed(2)}%`), `${S3('Jun-26')[v.key][1]}%`]), source: 'Q4FY26 presentation p32; Q1FY27 presentation p31' } },
    { callout: '**So what:** the mix is drifting toward consumer loans (25.5% of the book from 23.5% a year ago), which lifts yields and fees but shortens the book and raises the unsecured share. If asset finance does not turn, HDB grows ~12-13% with a richer but riskier mix; if it does, 16-18% is reachable. Our base case sits between.' },
  ],
};

const spread = {
  id: 'spread', nav: 'Spread & NIM', kicker: 'Margins', title: 'NIM: up to 8.35% as funding got cheaper; management\'s floor is 8%, and a rate hike is the threat',
  blocks: [
    { p: `HDB's reported NIM (net interest income ÷ average gross loans) rose from 7.55% in Q4FY25 to ${Q1.nimLoans}% in Q1FY27. Yields barely moved (13.9-14.2%); the gain came from funding: the RBI's 2025 rate cuts reached bank loans (46% of borrowings), and the cost of borrowings fell from 7.57% to ${Q1.costOfBorrowings}% in a year. Management's line: NIM of "8%+ is a non-negotiable" (Q4FY26 call); yields have been held and the mix (more consumer loans) helps. The risk runs the other way now. Vehicle and consumer instalment loans, most of HDB's book, are typically fixed-rate, so when rates rise its funding cost moves first; by late September 2026 most economists expected a 25bp hike.` },
    { exhibit: { type: 'table', title: 'Spread and margin on AUM: history and our forecast', x: 'fin.labels', from: 'FY22', to: 'FY29E', rowsRef: [
      { name: 'Interest income ÷ average AUM (%)', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds on average borrowings (%)', ref: 'fin.costOfFunds', fmt: 'pct' },
      { name: 'Spread (pp)', ref: 'fin.spread', fmt: 'n2' }, { name: 'NIM: NII ÷ average AUM (%)', ref: 'fin.nim', fmt: 'pct', hl: true },
      { name: 'Fees & other income ÷ average AUM (%), incl. BPO', ref: 'fin.feePct', fmt: 'pct' }, { name: 'Net total income ÷ average AUM (%)', ref: 'fin.ntiPct', fmt: 'pct', hl: true },
    ], source: 'Company, Screener.in; GAM estimates. Fees include BPO revenue (₹1,224 cr in FY26, ~1.1% of AUM), which is why the fee ratio falls as the loan book outgrows the flat BPO business.' } },
    { pair: [
      { type: 'line', title: 'Cost of funds fell 70bp in a year; yields held at ~14%', unit: 'Company yield and cost of funds, both ÷ average gross loans (%)', x: C.quarterlyKpis.map(q => q.q), series: [{ name: 'Yield', values: C.quarterlyKpis.map(q => q.yieldLoansPct), fmt: 'n2' }, { name: 'Cost of funds', values: C.quarterlyKpis.map(q => q.cofLoansPct), fmt: 'n2' }], labels: 'ends', min: 4, max: 15, source: 'Q4FY26 and Q1FY27 presentations' },
      { type: 'column', title: 'NII growth has run ahead of AUM growth for two years', unit: 'Growth (%)', x: 'fin.labels', from: 'FY23', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct0' }, { name: 'NII growth', ref: 'fin.niiGrowth', fmt: 'pct0' }], labels: 'all', source: 'Company, Screener.in; GAM estimates' },
    ] },
    { callout: `**Our forecast:** NIM on AUM of {{F.nim.0|pct}} / {{F.nim.1|pct}} / {{F.nim.2|pct}} for FY27-29E (FY26 {{fin.nim.5|pct}}), i.e. at management's 8% floor by FY29E: yields drift down 5bp a year as safer products (gold, LAP) grow, funding stays near Q1's level (+5bp in FY29E) and leverage edges up. Each 10bp of NIM is ~${n1(F.avgAum[1] * 0.001 * 0.748 / F.pat[1] * 100)}% of FY28E profit. Motilal Oswal (8.5% / 8.4%) and Emkay (8.2% / 8.2%) are higher.` },
  ],
};

module.exports = { franchise, verticals, spread, ...require('./HDBFS.part3b') };
