// L&T Finance report, part 3c: spread and NIM (incl. fee income and the IRDAI exposure), asset quality and credit cost.
const X = require('./LTF.ctx');
const { C, SG, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, cc10, distInc, distPctAum, distPctPbt, IRDAI_CUT, feeCut28, feeCutEps28 } = X;
const QK = C.quarterlyKpis, AK = C.annualKpis.filter(k => k.fy >= 'FY22'), ST = SG.stages, FY = C.fy26;
const s23 = s => (s.s2 + s.s3) / (s.s1 + s.s2 + s.s3) * 100, s3 = s => s.s3 / (s.s1 + s.s2 + s.s3) * 100, ecl = s => (s.ecl1 + s.ecl2 + s.ecl3) / (s.s1 + s.s2 + s.s3) * 100;

const spread = {
  id: 'spread', nav: 'Spread & NIM', kicker: 'Margins', title: 'NIM plus fees is steady at ~10.5% of the book; a quarter of profit comes from selling insurance',
  blocks: [
    { p: `LTF guides on "NIM + fees" on its own basis: 10.67% in FY24, 10.59% in FY25, 10.33% in FY26 and 10.47% in Q1FY27, inside a 10-10.5% corridor it has held for three years. Underneath, the components move: core NIM fell 24bp in Q1 (to 8.54%) because leverage rose and LTF held ~₹4,200 cr of extra liquidity during the West Asia conflict, while fee and other income rose by the same amount (income on that liquidity is booked as "other income"). On our basis (accounts, simple-average book) NIM was {{fin.nim.10|pct}} in FY25 and {{fin.nim.11|pct}} in FY26, as funding costs fell faster than yields after the 2025 rate cuts.` },
    { exhibit: { type: 'table', title: 'Spread and margin: history and our forecast (% of average book or borrowings)', x: 'fin.labels', from: 'FY22', to: 'FY29E', rowsRef: [
      { name: 'Yield on average book (%)', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds on average borrowings (%)', ref: 'fin.costOfFunds', fmt: 'pct' },
      { name: 'Spread (pp)', ref: 'fin.spread', fmt: 'n2' }, { name: 'NIM: NII ÷ average book (%)', ref: 'fin.nim', fmt: 'pct', hl: true },
      { name: 'Fees & other income ÷ average book (%)', ref: 'fin.feePct', fmt: 'pct' }, { name: 'Net total income ÷ average book (%)', ref: 'fin.ntiPct', fmt: 'pct' },
    ], source: 'Annual reports (interest income, fees), Screener.in, company presentations; GAM estimates. Interest income includes treasury income on ~₹14-18k cr of cash and investments. Up to FY24 most insurance income sat in "other income", so FY22-FY24 fee ratios are understated.' } },
    { p: `**Fee income is the line to watch.** Fees and commission were ₹${n0(FY.feeCommission)} cr in FY26, of which distribution income (selling insurance) was ₹${n0(distInc)} cr: life insurance ₹${n0(FY.distLife)} cr (mostly credit-life cover sold with group, personal and two-wheeler loans), general insurance ₹${n0(FY.distGeneral)} cr and other products ₹${n0(FY.distOthers)} cr. That is ${n2(distPctAum)}% of the average book and ~${n0(distPctPbt)}% of pre-tax profit; IIFL ranks LTF the most exposed listed NBFC. IRDAI's 23-Sep-2026 paper would cap credit-life commission at 2% (28% now) and ban compulsory bundling. LTF has not said how much of its commission is loan-linked (gap), and on 13-Jul the CEO called it "an industry issue" that regulators and insurers would solve. We assume a third of distribution income is lost from FY28E net of mitigation (−${n2(IRDAI_CUT)}pp of the book): ₹${n0(feeCut28)} cr of pre-tax income in FY28E, ~₹${n1(feeCutEps28)} of EPS (${n0(feeCutEps28 / F.eps[1] * 100)}%). IIFL's estimate (12% of PBT after 50% mitigation) is worse than ours.` },
    { pair: [
      { type: 'line', title: 'NIM + fees held in the 10-10.5% corridor for three years', unit: 'Company basis (% of average book), quarterly', x: QK.map(k => k.q), series: [{ name: 'NIM + fees', values: QK.map(k => k.nimFeesCo), fmt: 'n2' }, { name: 'Opex', values: QK.map(k => k.opexCo), fmt: 'n2' }], labels: 'ends', min: 0, max: 12, source: 'Q1FY27 presentation p46' },
      { type: 'line', title: 'Fee yield: cut by our IRDAI haircut from FY28E', unit: 'Fees & other operating income ÷ average book (%), our basis', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Fee yield', ref: 'fin.feePct', fmt: 'pct' }], labels: 'all', min: 0, max: 1.6, source: 'Annual reports; GAM estimates' },
    ] },
    { callout: '**Our view:** we model yield broadly flat ({{F.yieldOnAum.0|pct}} → {{F.yieldOnAum.2|pct}}): personal loans, micro-LAP and gold lift it, the last of the 11-12% wholesale loans running off helps a little, and only mortgages reprice with rates. Cost of funds rises 10-20bp (FY27 WACB guidance 7.35-7.40%; an October hike was expected). NIM therefore eases from {{fin.nim.11|pct}} to ~{{F.nim.2|pct}}, and NIM + fees on our basis falls from {{F.ntiPct.0|pct}} in FY27E to {{F.ntiPct.1|pct}} in FY28E because of the fee haircut, below the company\'s corridor on a like-for-like basis.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Asset quality & credit cost', kicker: 'Asset quality', title: 'Credit cost: down from the microfinance peak, but 2.5% is still high, and the 2% target is unproven',
  blocks: [
    { p: `LTF's credit cost on its own basis was 3.44% in FY22, 2.77% in FY23, 2.45% in FY24, 2.50% in FY25 and 2.54% in FY26. The last two numbers flatter the year: before releasing ₹400 cr and ₹450 cr of macro-prudential provisions (a buffer built in better years) they were 2.93% and 2.95%. The quarterly path is better: 3.80% (Q4FY25, before releases) → 3.43% → 2.98% → 2.83% → 2.64% → 2.54% in Q1FY27 with no release, and slippages into Stage 3 fell from ₹944 cr in Q1FY26 to ₹402 cr in Q4FY26. Management guides to 2.0-2.2% by Q4FY27 and below 2% over Lakshya 2031.` },
    { pair: [
      { type: 'column', title: 'Slippages into Stage 3 more than halved in FY26', unit: 'Additions to gross Stage 3 before write-offs (₹ crore)', x: ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26'], series: [{ name: 'Slippages', values: QK.filter(k => k.slippages).map(k => k.slippages), fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation p15' },
      { type: 'line', title: 'Net Stage 3 at or below 1% for nine quarters', unit: 'Consolidated net Stage 3 (% of book), quarterly; provision cover 67-75% of gross Stage 3', x: QK.map(k => k.q), series: [{ name: 'Net Stage 3', values: QK.map(k => k.ns3), fmt: 'n2' }], labels: 'all', min: 0, max: 1.2, source: 'Q1FY27 presentation p46' },
    ] },
    { exhibit: { type: 'table', title: 'Retail book by stage (₹ crore) and provisions', head: ['', 'Jun-2025', 'Mar-2026', 'Jun-2026'], rows: [
      ['Stage 1 (performing)', n0(ST.q1fy26.s1), n0(ST.q4fy26.s1), n0(ST.q1fy27.s1)], ['Stage 2 (30-90 days)', n0(ST.q1fy26.s2), n0(ST.q4fy26.s2), n0(ST.q1fy27.s2)], ['Stage 3 (90+ days)', n0(ST.q1fy26.s3), n0(ST.q4fy26.s3), n0(ST.q1fy27.s3)],
      ['Stage 3 (% of book)', `${n2(s3(ST.q1fy26))}%`, `${n2(s3(ST.q4fy26))}%`, `${n2(s3(ST.q1fy27))}%`], ['Stage 2 + 3 (% of book)', `${n2(s23(ST.q1fy26))}%`, `${n2(s23(ST.q4fy26))}%`, `${n2(s23(ST.q1fy27))}%`],
      ['Stage 1 provision cover', '0.56%', '0.80%', '0.86%'], ['Stage 3 provision cover', '72.3%', '67.9%', '69.6%'], { hl: true, cells: ['Total provisions (% of book)', `${n2(ecl(ST.q1fy26))}%`, `${n2(ecl(ST.q4fy26))}%`, `${n2(ecl(ST.q1fy27))}%`] },
    ], source: 'Q1FY27 presentation p36 (retail book; consolidated GS3 2.86% and NS3 0.90% in Jun-2026 incl. one wholesale account)' } },
    { p: '**The March 2026 provision reshuffle.** In the annual model refresh LTF moved ₹301 cr of management overlays out of Stage 3 (and ₹11 cr out of Stage 2) into Stage 1, and folded the last ₹125 cr of macro-prudential provisions into the model. Stage 3 cover fell from 73% to 68% and Stage 1 cover rose from 0.52% to 0.80%, with no P&L effect. Management says every new loan now carries 0.80% from day one, twice the RBI\'s old 0.40% floor; that is prudent, but it also means the separate buffer that cushioned FY25-FY26 is gone for now (management plans to rebuild it from SR recoveries): the next shock goes more directly to the P&L.' },
    { callout: `**Our forecast:** credit cost of {{F.creditCost.0|n2}}% / {{F.creditCost.1|n2}}% / {{F.creditCost.2|n2}}% of the average book in FY27-29E (FY26 {{fin.creditCost.11|n2}}%), 10-15bp above the guided path. Cyclops and the microfinance recovery argue for lower; a fast-growing, unseasoned personal-loan book, resumed microfinance growth and no macro buffer argue for caution. Each 10bp is ~${n1(cc10)}% of FY28E profit. Bear case: ~3%, the FY25 level before releases.` },
  ],
};

module.exports = { spread, quality };
