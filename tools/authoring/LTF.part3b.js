// L&T Finance report, part 3b: the newer and legacy books: gold loans, SME finance, and the wholesale run-off with
// its security receipts ("how much of the old LTF is left").
const X = require('./LTF.ctx');
const { C, SG, F, A, fin, fi, n0, n1, pc, Q1, QN, QO, AS } = X;
const GD = C.gold, SR = C.srs, AK = C.annualKpis;
const DS = Object.fromEntries(SG.disbursements.rows.map(r => [r[0], r])), DH = SG.disbursements.head, dsi = n => DH.indexOf(n);
const legacyNow = QN.whl + AK.find(k => k.fy === 'FY26').netSr;

const newbiz = {
  id: 'newbiz', nav: 'Gold, SME & the wholesale run-off', kicker: 'Newer and legacy books', title: 'Gold and SME are the new growth bets; the wholesale legacy is down to ~5% of the book',
  blocks: [
    { h: 'Gold loans: bought in, then built out fast' },
    { p: `LTF entered gold loans on 9-Jun-2025 by buying Paul Merchants Finance's gold business as a slump sale: a ₹${n0(GD.bookAcquired)} cr book, ${GD.branchesAcquired} branches and ${GD.employees} staff for ₹${n0(GD.consideration)} cr in cash (net assets ₹${n0(GD.netAssets)} cr, goodwill ₹${n0(GD.goodwill)} cr). It has since added ~200 branches (343 in Jun-2026), built its own loan-origination system ("Project Canyon") in four months, and grown the book to ₹${n0(QN.gold)} cr (+182%). It plans ~500 more branches in FY27, about 1.4 a day. Q1FY27 disbursements fell 31% from Q4 as the RBI's new gold-loan rules took effect in April; management expects normal growth from Q2.` },
    { pair: [
      { type: 'column', title: 'Gold book: ₹1,360 cr to ₹3,829 cr in a year', unit: 'Gold-loan book (₹ crore), quarter-end; FY27-29E = our build (March)', x: ['Q1FY26', 'Q4FY26', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Gold book', values: [1360, QN && SG.quarterly.find(q => q.q === 'Q4FY26').gold, QN.gold, ...AS.aumBuild.goldCr], fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Q1FY27 presentation p48; GAM estimates' },
      { type: 'column', title: 'Gold branches: 130 acquired, 343 now, ~840 planned by Mar-27', unit: 'Dedicated gold branches; Mar-27 = 343 + ~500 planned (management)', x: ['Q1FY26', 'Q4FY26', 'Q1FY27', 'Mar-27 plan'], series: [{ name: 'Branches', values: [GD.branches.Q1FY26, GD.branches.Q4FY26, GD.branches.Q1FY27, GD.branches.Q1FY27 + 500], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation p25; Q1FY27 call' },
    ] },
    { p: 'What we do not know matters: LTF does not disclose gold yields, losses or branch-level profitability, and the business competes with Muthoot, Manappuram and banks that have run gold branches for decades. New branches take time to fill; until they do, gold adds cost (part of FY27\'s opex) before it adds profit. We assume ₹7,500 cr of gold book by Mar-27 and ₹20,500 cr by Mar-29 (~9% of the book), a GAM estimate.' },
    { h: 'SME finance: deliberately slower' },
    { p: `SME finance (₹${n0(QN.sme)} cr, +28%) lends to self-employed professionals, traders and supply-chain participants, mostly unsecured. Disbursements fell 15% QoQ in Q1FY27 (₹${n0(DS.Q1FY27[dsi('SME')])} cr) because management cut lending to sectors exposed to the West Asia conflict. Cyclops sorts SME borrowers into "premium", "core" and "value" segments; LTF now buys CGTMSE guarantees on the value segment and launched an AI fraud-screening tool ("Argus") in the quarter.` },
    { h: 'The wholesale legacy: how much of the old LTF is left' },
    { p: `At its peak the wholesale book (infrastructure, real-estate and "defocused" loans) was ₹63,052 cr (FY19, 64% of the book). It is now ₹${n0(QN.whl)} cr (infrastructure ₹1,257 cr, real estate ₹841 cr), all standard except one real-estate account (Supertech, ~61% provided). Much of the rest was sold to asset-reconstruction companies in FY23 for security receipts (SRs): net SRs were ₹${n0(SR.netSrFY24)} cr in FY24, ₹${n0(SR.netSrFY25)} cr in FY25 and ₹${n0(SR.netSrFY26)} cr in FY26, held at a 68% provision cover. Together, ~₹${n0(legacyNow)} cr (~${n1(legacyNow / QN.total * 100)}% of the book) of legacy money earns little or nothing; the CFO expects most of it to resolve over "three to four years", and the CEO puts the ROA drag at ~20bp.` },
    { pair: [
      { type: 'column', title: 'Wholesale loans: ₹63k cr to ₹2k cr', unit: 'Wholesale book at March (₹ \'000 crore); Q1FY27 = Jun-2026', x: [...AK.map(k => k.fy), 'Q1FY27'], series: [{ name: 'Wholesale', values: [...AK.map(k => Math.round(k.wholesaleBook / 100) / 10), Math.round(QN.whl / 100) / 10], fmt: 'n1' }], labels: 'all', source: 'Company presentations' },
      { type: 'column', title: 'Net security receipts: down ₹1,000 cr a year', unit: 'Net SRs at March (₹ crore)', x: ['FY24', 'FY25', 'FY26'], series: [{ name: 'Net SRs', values: [SR.netSrFY24, SR.netSrFY25, SR.netSrFY26], fmt: 'num' }], labels: 'all', source: 'Q4FY25 presentation p6; Q4FY26 presentation p16' },
    ] },
    { callout: '**Our view:** the wholesale clean-up is essentially finished; what is left is a slow cash release, not a credit risk. Management has promised to use SR recoveries to build provisions rather than book them as profit, so we model no gains, only the run-off (liquidity falls ~1pp of the book a year as SRs resolve, cutting borrowings). The upside, if resolutions come faster, is to capital and to the ~20bp ROA drag, not to reported earnings.' },
  ],
};

module.exports = { newbiz };
