// Cholamandalam report, part 3: franchise and AUM mix, vehicle finance, mortgages (LAP + home loans).
// New businesses are in part3b; spread/NIM and asset quality in part3c.
const X = require('./CHOLAFIN.ctx');
const { C, SG, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, G27, BUILD, SA26 } = X;
const SA = SG.annual, QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q1FY26'), A25 = SA.find(a => a.fy === 'FY25');
const NAMES = Object.fromEntries(SG.lines.map(l => [l.key, l.name]));
const add26 = SG.lines.map(l => [NAMES[l.key], SA26[l.key] - A25[l.key]]).sort((a, c) => c[1] - a[1]);
const SP = Object.fromEntries(SG.segmentPl.rows.map(r => [r[0], r])), S3 = Object.fromEntries(SG.stage3.rows.map(r => [r[0], r]));
const DS = Object.fromEntries(SG.disbursements.rows.map(r => [r[0], r]));
const keys = Object.keys(AS.aumBuild.growth);

const franchise = {
  id: 'franchise', nav: 'Franchise & AUM mix', kicker: 'Franchise and growth', title: 'Growth now comes from eight engines, and the mix is tilting away from vehicles',
  blocks: [
    { p: `Chola disbursed ₹1,11,642 cr of loans in FY26 (+11%) and ₹29,612 cr in Q1FY27 (+22%), to 5.2 million customers through 1,820 branches. Business AUM grew 21% in FY26 to ₹2,24,334 cr and 22% in the year to Jun-2026. The shape of growth has changed: in FY25 three engines (LAP, home loans, SBPL) carried the company while vehicles slowed; in FY26 vehicles came back, and by Q1FY27 every business was growing. New businesses (CSEL, SME, SBPL, gold) are 13.6% of AUM, up from 2% in FY22.` },
    { pair: [
      { type: 'hbar', title: 'Where FY26\'s ₹39,588 cr of AUM growth came from', unit: 'Increase in business AUM, Mar-25 to Mar-26 (₹ crore)', x: add26.map(r => r[0]), series: [{ name: 'Added', values: add26.map(r => r[1]), fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation p13' },
      { type: 'hbar', title: 'Growth by business, Jun-2026 year on year', unit: 'Business AUM growth Jun-25 to Jun-26 (%); gold n.m. (₹97 cr to ₹2,143 cr)', x: SG.lines.filter(l => l.key !== 'gold').map(l => NAMES[l.key]), series: [{ name: 'Growth', values: SG.lines.filter(l => l.key !== 'gold').map(l => Math.round((QN[l.key] / QO[l.key] - 1) * 1000) / 10), fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation p13' },
    ] },
    { exhibit: { type: 'table', title: 'Our AUM build by business (₹ crore) vs guidance', head: ['Business', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Growth FY27-29E', 'FY27 guidance'], wide: [6], rows: [
      ...keys.map(k => [NAMES[k], n0(SA26[k]), ...BUILD.map(r => n0(r[k])), AS.aumBuild.growth[k].map(g => `${g}%`).join(' / '), { vf: '~18%', lap: '25-30%', hl: '25-30%', sme: '30%+', sbpl: '30%+', csel: '~20% by Q4 (May-2026)' }[k]]),
      ['Gold loans', n0(SA26.gold), ...BUILD.map(r => n0(r.gold)), '₹ cr target', '~₹5,000 cr by Mar-27'],
      { hl: true, cells: ['**Total (build)**', `**${n0(SA26.total)}**`, ...BUILD.map(r => `**${n0(r.total)}**`), '', '**20-23%**'] },
      ['Model AUM (one line)', '{{fin.aum.11|num}}', '{{F.aum.0|num}}', '{{F.aum.1|num}}', '{{F.aum.2|num}}', '{{F.aumGrowth.0|pct}} / {{F.aumGrowth.1|pct}} / {{F.aumGrowth.2|pct}}', ''],
    ], source: 'Q1FY27 presentation; Q4FY26 call (4-May-2026) and Q1FY27 call (28-Jul-2026); GAM estimates. The build is illustrative and sums to the model AUM within 0.2%.' } },
    { callout: `**Our view:** we take 22% for FY27E, the upper half of the 20-23% guidance, because Q1 grew 22% and July was "better" per management; FY26 itself landed at 21% against a 20-25% guide. Growth fades 1pp a year after that as vehicles (still ~${n0(BUILD[2].vf / BUILD[2].total * 100)}% of AUM in FY29E in our build, from 53%) grow in the high teens. Faster growth is possible (the bull case is 24%), but it would need more equity sooner and a benign credit cycle in the riskiest lines.` },
  ],
};

const vf = SP['Vehicle finance'];
const vehicle = {
  id: 'vehicle', nav: 'Vehicle finance', kicker: 'Segment: vehicle finance (53% of AUM)', title: 'Vehicle finance: back in growth, still the biggest source of losses',
  blocks: [
    { p: `Vehicle finance is the core: ₹${n0(QN.vf)} cr of AUM in Jun-2026 (+19%), ₹62,123 cr of disbursements in FY26 (+15%) and ₹16,503 cr in Q1FY27 (+21%). Chola sits in the middle of the market: new and used light and small commercial vehicles for small road-transport operators, cars and utility vehicles for taxi and self-employed buyers, tractors, two- and three-wheelers and construction equipment. Heavy trucks, where large fleet owners and banks dominate, are only 5-7% of the book. Used vehicles carry the highest yields.` },
    { exhibit: { type: 'table', title: 'Vehicle finance economics (% of segment assets)', head: ['', 'FY26', 'Q1FY26', 'Q1FY27'], rows: [
      ['Income (yield)', '15.1%', '15.0%', '15.1%'], ['Cost of funds', '7.0%', '7.2%', '6.9%'], ['Net income margin', '8.1%', '7.8%', '8.2%'], ['Operating expenses', '3.3%', '3.2%', '3.1%'],
      ['Loan losses', '1.9%', '2.2%', '2.0%'], { hl: true, cells: ['**Pre-tax ROA**', '**2.9%**', '**2.4%**', '**3.1%**'] }, ['PBT (₹ cr)', n0(vf[4]), '628', '945'], ['Stage 3 (period end)', '3.84%', '3.89%', `${S3['Vehicle finance'][3]}%`],
    ], source: 'Q1FY27 presentation p40-41 (managed P&L), p22; Q1FY27 call (Stage 3 Jun-25)' } },
    { pair: [
      { type: 'column', title: 'Vehicle AUM: ₹44k cr to ₹1.24 lakh cr', unit: 'Vehicle-finance AUM (₹ \'000 crore), March; Q1FY27 = Jun-2026', x: [...SA.map(a => a.fy), 'Q1FY27'], series: [{ name: 'VF AUM', values: [...SA, QN].map(a => Math.round(a.vf / 100) / 10), fmt: 'n1' }], labels: 'all', highlight: 'Q1FY27', source: 'Q4FY24 and Q1FY27 presentations' },
      { type: 'column', title: 'Vehicle Stage 3 keeps rising, even after seasonality', unit: 'Vehicle-finance Stage 3 (% of segment assets)', x: ['Mar-25', 'Jun-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Stage 3', values: [3.52, 3.89, 3.84, 4.05], fmt: 'n2' }], labels: 'all', min: 0, max: 5, source: 'Q1FY27 call (MD) and presentation p22' },
    ] },
    { callout: `**Our view:** vehicles are the swing factor. The segment earned a 2.9% pre-tax ROA in FY26, below the company's 3.3%, because loan losses (1.9-2.2%) are the highest of any large business. Management says the three-year "down cycle" ended in Q4FY26, and Q1 PBT rose 50%. But Stage 3 rose from 3.52% to 4.05% over five quarters, and Nomura notes Jun-2026 was the worst first quarter since Covid. We model vehicles growing ~18% and do not assume their losses fall much: a weak monsoon or a diesel spike would land here first.` },
  ],
};

const lap = SP['of which LAP'], hlp = SP['of which home loans'];
const mortgages = {
  id: 'mortgages', nav: 'Mortgages: LAP & home loans', kicker: 'Segment: mortgages (33% of AUM)', title: 'Loans against property and home loans: the quiet profit engine',
  blocks: [
    { p: `Loans against property (LAP, ₹${n0(QN.lap)} cr, +23%) and affordable home loans (₹${n0(QN.hl)} cr, +22%) are a third of the book and, by our arithmetic on the segment P&Ls, 42% of FY26 segment profit (39% of company PBT). LAP lends to small businesses against their home or shop; home loans go to self-employed and salaried buyers in small towns. Both are secured on property, so losses are low (LAP 0.3% of assets in FY26, home loans 1.0%), and both earn more on assets than vehicles (pre-tax ROA 3.9% and 4.2%). The CFO said LAP alone is ~30% of company PBT and should stay there.` },
    { exhibit: { type: 'table', title: 'Mortgage economics: LAP vs home loans', head: ['', 'LAP FY26', 'LAP Q1FY27', 'Home loans FY26', 'Home loans Q1FY27'], rows: [
      ['AUM (₹ cr)', n0(SA26.lap), n0(QN.lap), n0(SA26.hl), n0(QN.hl)], ['Disbursements (₹ cr)', n0(DS.FY26[2]), n0(DS.Q1FY27[2]), n0(DS.FY26[5]), n0(DS.Q1FY27[5])],
      ['Income (yield)', '13.0%', '13.3%', '16.0%', '15.9%'], ['Net income margin', '6.0%', '6.3%', '8.7%', '8.9%'], ['Operating expenses', '1.8%', '1.7%', '3.6%', '3.6%'], ['Loan losses', '0.3%', '0.4%', '1.0%', '0.6%'],
      { hl: true, cells: ['**Pre-tax ROA**', '**3.9%**', '**4.3%**', '**4.2%**', '**4.7%**'] }, ['Stage 3', `${S3['Loan against property'][2]}% (Mar)`, `${S3['Loan against property'][3]}%`, `${S3['Home loans'][2]}% (Mar)`, `${S3['Home loans'][3]}%`],
    ], source: 'Q1FY27 presentation p55, p71 (managed P&Ls), p22' } },
    { p: `Two things to watch. First, **disbursement growth is weak**: home-loan disbursements have sat at ₹1,800-2,000 cr a quarter for two years and grew 2% in Q1FY27 (LAP +2%), partly because Chola now books a loan only when the cheque clears (like-for-like ~20%, CFO). AUM still grows 22-23% because loans run off slowly, but that gap cannot last for ever; guidance is 12-15% disbursement growth in home loans. Second, **LAP Stage 3 rose** from 2.24% to 2.58% in the quarter, the largest sequential rise of any segment (Nomura). Management says LAP losses will stay ~0.3% a year because property collateral can be enforced under SARFAESI (for loans above ₹20 lakh).` },
    { callout: '**Our view:** mortgages are Chola\'s best business and the reason we expect ROE to hold even as vehicle growth slows. We model LAP and home loans growing 23-25% a year (guidance 25-30%), with almost no margin pressure. The risk is competition: banks and housing-finance companies price LAP and home loans aggressively, and Chola\'s edge is distribution in towns banks do not serve, not cheaper money.' },
  ],
};

module.exports = { franchise, vehicle, mortgages, ...require('./CHOLAFIN.part3b'), ...require('./CHOLAFIN.part3c') };
