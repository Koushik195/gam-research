// L&T Finance report, part 3: franchise and AUM mix, the rural franchise (group loans, farm, micro-LAP), the urban
// franchise (two-wheelers, personal loans, mortgages). Gold/SME/wholesale run-off are in part3b; spread/NIM and
// asset quality in part3c.
const X = require('./LTF.ctx');
const { C, SG, F, AS, n0, n1, pc, Q1, BUILD, SA26, GK, QN, QO, unsec } = X;
const SA = SG.annual, A25 = SA.find(a => a.fy === 'FY25');
const NAMES = Object.fromEntries(SG.lines.map(l => [l.key, l.name]));
const add26 = SG.lines.map(l => [NAMES[l.key], SA26[l.key] - A25[l.key]]).sort((a, c) => c[1] - a[1]);
const DS = Object.fromEntries(SG.disbursements.rows.map(r => [r[0], r])), DH = SG.disbursements.head;
const dsi = name => DH.indexOf(name), dg = (name) => pc((DS.Q1FY27[dsi(name)] / DS.Q1FY26[dsi(name)] - 1) * 100);
const RQ = SG.rbfQuality, CY = C.cyclops;
const yoy = k => pc((QN[k] / QO[k] - 1) * 100);

const franchise = {
  id: 'franchise', nav: 'Franchise & AUM mix', kicker: 'Franchise and growth', title: 'Book growth of 25-27% with every business growing, tilted towards personal loans, gold and property',
  blocks: [
    { p: `LTF disbursed ₹83,226 cr of loans in FY26 (+38%) and ₹23,852 cr in Q1FY27 (+36%), to a customer base of ~2.9 crore. The book grew 25% in FY26 to ₹1,21,728 cr and 27% in the year to Jun-2026, even though management says it turned away ₹1,000-1,200 cr of loans in Q1 by tightening credit rules. The mix is moving: personal loans, gold, LAP and micro-LAP added half of FY26's growth from a seventh of the opening book, while the wholesale book kept shrinking.` },
    { pair: [
      { type: 'hbar', title: `Where FY26's ₹${n0(SA26.total - A25.total)} cr of book growth came from`, unit: 'Change in book, Mar-25 to Mar-26 (₹ crore)', x: add26.map(r => r[0]), series: [{ name: 'Added', values: add26.map(r => r[1]), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p68' },
      { type: 'hbar', title: 'Growth by business, Jun-2026 year on year', unit: 'Book growth Jun-25 to Jun-26 (%); gold +182%, micro-LAP +169% (off small bases) not shown', x: SG.lines.filter(l => !['gold', 'mlap', 'whl', 'acq'].includes(l.key)).map(l => NAMES[l.key]), series: [{ name: 'Growth', values: SG.lines.filter(l => !['gold', 'mlap', 'whl', 'acq'].includes(l.key)).map(l => Math.round((QN[l.key] / QO[l.key] - 1) * 1000) / 10), fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 presentation p48' },
    ] },
    { exhibit: { type: 'table', title: 'Our book build by business (₹ crore)', head: ['Business', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Growth FY27-29E', 'Basis'], wide: [6], rows: [
      ...GK.map(k => [NAMES[k], n0(SA26[k]), ...BUILD.map(r => n0(r[k])), AS.aumBuild.growth[k].map(g => `${g}%`).join(' / '), { farm: 'Q1 +11%; monsoon-dependent', rgl: 'Q1 +18%; MFIN guardrails', mlap: '150-200 new branches in FY27', tw: 'Q1 +22%; disbursements +41%', pl: 'Q1 +80%; base effect fades (CEO)', hl: 'Q1 +14%', lap: 'Q1 +38%', sme: 'Q1 +28%; cautious on West Asia', acq: 'Bought pools; held flat' }[k]]),
      ['Gold loans', n0(SA26.gold), ...BUILD.map(r => n0(r.gold)), '₹ cr (GAM)', '~500 new branches in FY27; no AUM target given'],
      ['Wholesale (run-off)', n0(SA26.whl), ...BUILD.map(r => n0(r.whl)), '₹ cr (GAM)', 'No new lending; ₹2,098 cr in Jun-2026'],
      { hl: true, cells: ['**Total (build)**', `**${n0(SA26.total)}**`, ...BUILD.map(r => `**${n0(r.total)}**`), '', '**Guidance: over 20%**'] },
      ['Model book (one line)', '{{fin.aum.11|num}}', '{{F.aum.0|num}}', '{{F.aum.1|num}}', '{{F.aum.2|num}}', '{{F.aumGrowth.0|pct}} / {{F.aumGrowth.1|pct}} / {{F.aumGrowth.2|pct}}', ''],
      ['Unsecured share (group loans, PL, SME)', `${n1(unsec(SA26))}%`, ...BUILD.map(r => `${n1(unsec(r))}%`), '', ''],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls; GAM estimates. The build is illustrative and sums to the model book within 0.3%.' } },
    { callout: `**Our view:** we take {{F.aumGrowth.0|pct}} for FY27E, above the "over 20%" guidance, because Q1 grew 27% and Q4 is seasonally the strongest; FY26 itself landed at 25% against a 20%+ guide. Growth fades to {{F.aumGrowth.1|pct}} and {{F.aumGrowth.2|pct}} as personal loans lap a low base. Faster growth is possible (the bull case is 26%), but each extra point comes mostly from unsecured and gold loans, the products with the shortest record at LTF.` },
  ],
};

const rural = {
  id: 'rural', nav: 'Rural: group loans, farm, micro-LAP', kicker: 'Segment: rural finance (39% of the book)', title: 'Rural group loans: back to 99.8% collections after the 2024-25 crisis, and growing again',
  blocks: [
    { p: `LTF's rural franchise is ₹${n0(QN.rgl + QN.farm + QN.mlap)} cr: rural group loans and microfinance ₹${n0(QN.rgl)} cr (${yoy('rgl')}), farm-equipment loans ₹${n0(QN.farm)} cr (${yoy('farm')}) and micro-LAP ₹${n0(QN.mlap)} cr (${yoy('mlap')}). Group loans are made to women in joint-liability groups, in 17 states but concentrated in Bihar, Tamil Nadu and Karnataka. LTF's rules are tighter than the industry's: it lends only to borrowers who are current on every loan, caps them at three lenders including LTF (98.5% of the book), and runs a 700-person risk-control unit that reports to the chief risk officer. In FY27 it is buying government credit guarantees (CGFMU) on 35-40% of new microfinance loans, mainly new-to-credit borrowers and new states.` },
    { pair: [
      { type: 'stacked', title: 'Group-loan arrears: up in FY25, back down in FY26', unit: 'Portfolio at risk, rural group loans (% of book)', x: RQ.q, series: [{ name: '1-30 days', values: RQ.par1_30, fmt: 'n1' }, { name: '31-90 days', values: RQ.par31_90, fmt: 'n1' }], minLabel: 0.3, source: 'Q1FY27 presentation p34' },
      { type: 'column', title: 'Disbursements by rural business', unit: 'Disbursements (₹ crore)', x: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'], series: [{ name: 'Group loans & MFI', values: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'].map(p => DS[p][dsi('Rural group & MFI')]), fmt: 'num' }, { name: 'Farm equipment', values: ['FY25', 'FY26', 'Q1FY26', 'Q1FY27'].map(p => DS[p][dsi('Farm')]), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p67; Q1FY27 presentation p47' },
    ] },
    { exhibit: { type: 'table', title: 'Rural franchise in numbers', head: ['', 'Group loans & MFI', 'Farm equipment', 'Micro-LAP'], rows: [
      ['Book Jun-2026 (₹ cr)', n0(QN.rgl), n0(QN.farm), n0(QN.mlap)], ['Growth YoY', yoy('rgl'), yoy('farm'), yoy('mlap')],
      ['Q1FY27 disbursements (₹ cr)', n0(DS.Q1FY27[dsi('Rural group & MFI')]), n0(DS.Q1FY27[dsi('Farm')]), n0(DS.Q1FY27[dsi('Micro-LAP')])], ['Disbursement growth YoY', dg('Rural group & MFI'), dg('Farm'), dg('Micro-LAP')],
      ['Quality marker', `0-DPD ${RQ.zeroDpd.LTF}% vs industry ${RQ.zeroDpd.industry}%; 90+ PAR ${RQ.par90.at(-1)}%`, 'Collection efficiency 93.8% (Mar-2026); Cyclops for 18 months', 'Secured; new'],
      ['Reach', '2,184 meeting-centre branches; ~2 lakh villages', '2,750 dealers; top 5 tractor makers', '139 branches'],
    ], source: 'Q1FY27 presentation p26, p34-35, p44, p47-48, p55; Q4FY26 presentation p62-63; Q1FY27 call' } },
    { callout: '**Our view:** the microfinance book is LTF\'s highest-yielding large business and its biggest risk. It is in the "Goldilocks" phase the CEO describes (18-24 months after a crisis, when new loans are the cleanest), and the numbers bear that out. But this is the third loss cycle in a decade, 90+ arrears are still 2.6% of the book, and a weak monsoon would hit group loans and tractors together. We model group loans growing 17-18% and keep group-wide credit cost above guidance.' },
  ],
};

const urban = {
  id: 'urban', nav: 'Urban: 2W, personal loans, mortgages', kicker: 'Segment: urban finance (49% of the book)', title: 'Urban finance: Cyclops is working in two-wheelers; personal loans are the fastest-growing and least-tested book',
  blocks: [
    { p: `Urban finance is ₹${n0(QN.tw + QN.pl + QN.hl + QN.lap)} cr (+32%): two-wheelers ₹${n0(QN.tw)} cr (${yoy('tw')}), personal loans ₹${n0(QN.pl)} cr (${yoy('pl')}), home loans ₹${n0(QN.hl)} cr (${yoy('hl')}) and LAP ₹${n0(QN.lap)} cr (${yoy('lap')}). Two-wheelers are where LTF first used Project Cyclops, its in-house underwriting engine, and the only book with a two-year record under it. Personal loans have been rebuilt around salaried borrowers sourced through CRED, Google Pay, PhonePe and Amazon (DSAs are only ~10% of volume): average ticket ₹2.6-2.8 lakh, yield ~16% (12-13% through DSAs, ~19% on digital channels), no default guarantees from partners.` },
    { exhibit: { type: 'table', title: 'Cyclops in two-wheelers: Q1FY25 cohorts (before) vs Q1FY27 (after)', head: ['Marker', 'Before Cyclops', 'With Cyclops', 'What it means'], wide: [3], rows: [
      ['Quarterly disbursements', '₹2,621 cr', '₹3,006 cr', 'More volume, not less'], ['Prime customers', '52%', '90%', 'A safer customer mix'], ['Gross non-starters (first EMI bounced)', '13%', '8%', 'Fewer bad starts'],
      ['Net non-starters', '3.7%', '0.2%', 'Almost no first-EMI losses'], ['Average IRR', '17.6%', '17.5%', 'Pricing held'], ['30+ DPD at 10 months vs industry', '–', '2.8% vs 7.1%', 'Less than half the industry\'s arrears'],
    ], source: 'Q1FY27 presentation p15; Q4FY26 call (30+ DPD comparison)' } },
    { pair: [
      { type: 'column', title: 'Personal loans: disbursements doubled in a year', unit: 'Disbursements (₹ crore)', x: ['FY25', 'FY26', 'Q1FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Personal loans', values: ['FY25', 'FY26', 'Q1FY26', 'Q4FY26', 'Q1FY27'].map(p => DS[p][dsi('Personal loans')]), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Q4FY26 presentation p67; Q1FY27 presentation p47' },
      { type: 'stacked', title: 'Urban book by product', unit: 'Book at March (₹ \'000 crore); Q1FY27 = Jun-2026', x: [...SA.map(a => a.fy), 'Q1FY27'], series: ['tw', 'pl', 'hl', 'lap'].map(k => ({ name: NAMES[k], values: [...SA, QN].map(a => Math.round(a[k] / 100) / 10), fmt: 'n1' })), minLabel: 3, source: 'Company presentations' },
    ] },
    { callout: `**Our view:** two-wheelers are a genuine improvement: prime share up from 52% to 90% with no loss of yield. Mortgages are steady, low-loss and growing 14-38%. Personal loans are the bet: the book grew 80% to ~13% of the total in a year through four big-tech partners, and nothing in LTF's own history shows how it behaves in a downturn (CEO: "we will make those outcomes public as and when we cross the seasoning threshold of 24 months"). We model personal loans at 45% growth in FY27E, slowing to 25%, and budget for higher losses in the bear case.` },
  ],
};

module.exports = { franchise, rural, urban, ...require('./LTF.part3b'), ...require('./LTF.part3c') };
