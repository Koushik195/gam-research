// HPCL report, part 3: refining & marketing (the one reported segment), the JV refineries (HRRL, HMEL, MRPL), moat.
const X = require('./HINDPETRO.ctx');
const { C, SA, EPT, eptAvg, eptAvgX23, bld, F, n0, n1, PB, FYH } = X;
const fyH = ['FY21', ...FYH], CALL = C.q1fy27.call, HR = C.investments.hrrl, HM = C.investments.hmel;
const cell = (f, k, fmt) => { const v = SA.find(a => a.fy === f)?.[k]; return v == null ? '–' : fmt(v); };

const refmkt = {
  id: 'refmkt', nav: 'Refining & marketing', kicker: 'Segment: downstream petroleum', title: 'Refining and marketing: one segment, two margin pools, and the political one is bigger',
  blocks: [
    { p: `HPCL reports a single segment. Its EBITDA is the sum of a refining margin on ~26 MMT (GRM: product value less crude cost, US$/bbl), a marketing margin on ~51 MMT (retail price less the refinery-gate price, taxes and dealer commission), pipeline and terminal income and inventory gains or losses, less operating costs and exchange losses. HPCL reports its GRM every quarter but not the marketing margin; brokers back it out (PL: +₹6.3/litre in Q4FY26, −₹14.9/litre in Q1FY27).` },
    { exhibit: { type: 'table', title: 'Refining & marketing: the cycle in one table', head: ['', ...fyH, 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue, net of excise (₹ cr)', ...fyH.map(f => cell(f, 'dpRev', n0)), ...bld.map(r => n0(r.rev))],
      ['EBITDA (₹ cr)', ...fyH.map(f => cell(f, 'dpEbitda', n0)), ...bld.map(r => n0(r.ebitda))],
      ['Market sales incl. exports (MMT)', ...fyH.map(f => cell(f, 'dpVol', n1)), ...bld.map(r => n1(r.vol))],
      { hl: true, cells: ['**EBITDA per tonne sold (₹)**', ...fyH.map(f => (EPT[f] == null ? '–' : `**${n0(EPT[f])}**`)), ...bld.map(r => `**${n0(r.ept)}**`)] },
      ['Own refinery throughput (MMT)', ...fyH.map(f => cell(f, 'throughput', n1)), ...PB.throughput.map(n1)],
      ['Reported GRM (US$/bbl)', ...fyH.map(f => cell(f, 'grm', v => v.toFixed(2))), '–', '–', '–'],
    ], source: 'Screener.in (consolidated revenue, EBITDA); AR FY26 performance profile and MD&A; FY23-FY24 GRM = average of PL\'s quarterly chart; GAM estimates' } },
    { pair: [
      { type: 'column', title: `EBITDA per tonne: FY22-26 average ₹${n0(eptAvg)} (₹${n0(eptAvgX23)} without FY23); ours ₹700 → 4,500`, unit: '₹ per tonne', x: [...FYH, ...F.years], series: [{ name: '₹/t', values: [...FYH.map(f => EPT[f]), ...bld.map(r => r.ept)].map(Math.round), fmt: 'num' }], labels: 'all', lines: [{ v: Math.round(eptAvgX23), text: 'FY22-26 average without FY23' }], source: 'GAM from Screener and AR volumes' },
      { type: 'column', title: 'Volumes: +2% in FY27E, then +3% a year', unit: 'Market sales incl. exports (MMT)', x: [...FYH, ...F.years], series: [{ name: 'MMT', values: [...FYH.map(f => SA.find(a => a.fy === f).dpVol), ...bld.map(r => r.vol)].map(v => Math.round(v * 10) / 10), fmt: 'n1' }], labels: 'all', source: 'AR FY26; GAM estimates' },
    ] },
    { h: 'Refining: Visakh is bigger and more complex; the upgrade still has to prove itself' },
    { p: `The Visakh Refinery Modernisation lifted capacity from 8.3 to 15 MMTPA (throughput 8.4 MMT in FY22, 16.0 MMT in FY26), and the 3.55 MMTPA Residue Upgradation Facility (the world's first and largest LC-Max unit, converting ~93% of bottom-of-the-barrel residue into distillates; Nelson complexity 11.6) was commissioned in Dec-2025. It did not run stably in Q1FY27 (pressure, temperature and catalyst issues); management expects stability in Q2-Q3FY27 and BOB sees ~US$2.5/bbl more GRM at Visakh once it does. GRM was US$5.74/bbl in FY25 and US$8.79 in FY26 (Mumbai 8.04, Visakh 9.26), then US$23.8 in Q1FY27 before the export duty as diesel cracks reached ~US$50/bbl. In Mumbai a lube and bitumen upgrade (lube base oil 475 → 764 KTPA) is under way.` },
    { h: 'Marketing: volumes grow, margins are decided elsewhere' },
    { p: `${CALL.underRecovery} The negative LPG buffer reached ₹16,410 cr at Jun-2026 even after ₹1,980 cr of compensation in the quarter. The Government cut excise by ₹10/litre in Mar-2026 and allowed price rises in tranches from May, and JPMorgan noted that petrol and diesel margins were back to pre-conflict levels by late June. HPCL is not compensated for petrol and diesel losses at all; it waits for crude to fall while prices are held.` },
    { callout: `**Our forecast:** EBITDA of ₹${n0(bld[0].ebitda)} / ${n0(bld[1].ebitda)} / ${n0(bld[2].ebitda)} cr (₹${PB.ebitdaPerTonne.join(' / ')} per tonne). FY27E assumes Q2-Q4 average ~₹5,000/t after Q1's −₹12,300/t. FY28-29E sit at the FY22-26 average without the FY23 loss year (₹${n0(eptAvgX23)}/t), with the residue upgrade and HRRL supply offsetting the risk of another squeeze. Each ₹500/t is ~₹${n0(500 * bld[1].vol / 10)} cr of FY28E EBITDA (~₹${n1(500 * bld[1].vol / 10 * 0.748 / X.shares)} of EPS).` },
  ],
};

const jv = {
  id: 'jv', nav: 'HRRL, HMEL & MRPL', kicker: 'Joint-venture refineries', title: `HRRL, HMEL and MRPL: ₹${n0(C.investments.hrrl.carrying + HM.carrying + C.investments.listed[0].carrying)} cr at book, with their debt outside HPCL's balance sheet`,
  blocks: [
    { p: `**HPCL Rajasthan Refinery (HRRL, 74%; Rajasthan 26%).** A 9 MMTPA refinery with 2.4 MMTPA of petrochemicals at Pachpadra, Barmer, the first integrated greenfield refinery-cum-petrochemical complex in India (26% petchem intensity). Approved at ₹43,129 cr, its cost was raised to ₹${n0(HR.projectCost)} cr in Apr-2026 and HPCL's equity commitment to ₹${n0(HR.hpclEquityCommitment)} cr. Crude went into the CDU in Feb-2026; commercial operation followed in end-June/July 2026 (dates differ by source). ${HR.rampUp}. HPCL has invested ₹${n0(HR.equityInvested)} cr of equity (book ₹${n0(HR.carrying)} cr) and lent ₹${n0(HR.subDebt)} cr as a subordinated loan to be converted into equity. If HPCL's ₹19,600 cr is 74% of the equity, total equity is ~₹26,500 cr and the rest of the cost (~₹53,000 cr, our estimate; HRRL's accounts are not published in what we read) is debt, which is not on HPCL's balance sheet. HRRL will add a refining and petchem margin through HPCL's share of JV profit and cut HPCL's third-party purchases; in the ramp-up its depreciation and interest will likely make it loss-making.` },
    { p: `**HPCL-Mittal Energy (HMEL, 48.99%).** An 11.3 MMTPA refinery and petrochemicals at Bathinda, run with the Mittal group. Net assets ₹${n0(HM.netAssets)} cr, net debt ~₹${n0(HM.netDebtMar26)} cr; profit ₹${n0(HM.patFY26)} cr in FY26 after a ₹${n0(-HM.patFY25)} cr loss in FY25. HPCL bought ₹${n0(HM.purchasesFromHmelFY26)} cr of product from it in FY26. **MRPL (16.96%)**, listed, 15 MMTPA at Mangalore, is ONGC's subsidiary; HPCL's ${n1(C.investments.listed[0].shares)} cr shares were worth ₹${n0(X.STK[0].mv)} cr at the 30-Sep close.` },
    { exhibit: { type: 'table', title: 'How we value the stakes', head: ['Stake', 'Book, Mar-26 (₹ cr)', 'Our base', 'Street'], wide: [2, 3], rows: [
      ['HRRL (74%) equity', n0(HR.carrying), 'At book, inside net debt', 'MOSL 0.8x equity invested; BOB, Emkay nil'],
      ['HRRL subordinated loan', n0(HR.subDebt), 'At book, separate line (bear: HRRL at 0.8x invested)', '—'],
      ['HMEL (48.99%)', n0(HM.carrying), 'At book, inside net debt', 'MOSL 6x FY24 profit; Emkay nil'],
      ['MRPL (16.96%), listed', n0(C.investments.listed[0].carrying), `30-Sep market value less 20% (₹${n0(X.STK[0].mv * 0.8)} cr)`, 'MOSL less 25%; Emkay less 30%; BOB at market'],
      ['Oil India (4.01 cr shares), listed', n0(C.investments.listed[1].carrying), `30-Sep market value less 20% (₹${n0(X.STK[1].mv * 0.8)} cr)`, 'Emkay less 30%; BOB at market'],
      ['Other JVs and associates', n0(C.investments.otherEquityAccounted), 'At book, inside net debt', 'Mostly ignored'],
    ], source: 'AR FY26 notes 6, 7, 61; broker notes as cited; GAM Research' } },
    { callout: `**So what:** the JVs are worth something, but probably less than their headline cost. HRRL took about twice its budget and four extra years; HMEL has swung between a ₹348 cr loss and a ₹1,717 cr profit. Carrying HRRL (equity and loan) and HMEL at book, rather than at zero like BOB and Emkay, adds ~₹${n0((HR.carrying + HR.subDebt + HM.carrying) / X.shares)} a share to our value: a judgement in HPCL's favour.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a dense network in the west and south, no pricing power; the moat protects volumes, not returns',
  blocks: [
    { verdicts: [
      ['Marketing network', 'Strong', '25,098 fuel stations (third-largest), 6,389 LPG distributors (second-largest LPG marketer), pipelines and terminals; volumes grew faster than the industry in Q1FY27.', 'Volume share is safe.'],
      ['Pricing power', 'None', 'Retail prices set with the Government; Q1FY27 marketing under-recoveries above ₹26,000 cr; LPG losses compensated late and partly.', 'Returns cannot be defended in a spike; worst hit of the three OMCs.'],
      ['Refining quality', 'Moderate, improving', 'Visakh at 11.6 Nelson complexity after the residue upgrade; 106% utilisation; GRMs historically below peers (PL).', 'Upgrade still has to run stably.'],
      ['Integration', 'Weak-moderate', 'Own refineries cover ~half of sales; HRRL lifts JV cover to ~40% next year.', 'Better supply security; margin earned partly inside JVs.'],
      ['Regulatory position', 'Mixed', 'State ownership brings LPG compensation and cheap funding, but price controls, windfall/export duties and directed capex.', 'A two-way street.'],
    ], head: ['Source', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'AR FY26; Q1FY27 call (PL, Emkay); GAM' },
    { callout: `**Honest verdict:** HPCL has a valuable network and nobody will take its volumes. But a moat that does not let you set prices does not earn excess returns through the cycle: consolidated ROE was ${X.A.roe.slice(-5).map(v => `${v < 0 ? '−' : ''}${Math.abs(Math.round(v))}%`).join(', ')} in FY22-FY26, an average of ~${Math.round(X.A.roe.slice(-5).reduce((s, v) => s + v, 0) / 5)}% that hides a loss year, and the next squeeze arrived within a quarter of the record.` },
  ],
};

module.exports = { refmkt, jv, moat };
