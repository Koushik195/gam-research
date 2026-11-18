// Linde India report, part B (3 of 6): Gases, Project Engineering, the parent and Praxair India, moat.
const X = require('./LINDEINDIA.ctx');
const { C, D, F, AS, n0, n1, pc, SA, SQ, QL, A24, A25, A26, segM, pbitM, Q1, FY, RP, PJ, PED, SEG, SRC } = X;
const rup = s => String(s).replace(/Rs /g, '₹');
const G = AS.segments.find(s => s.key === 'gas'), PD = AS.segments.find(s => s.key === 'ped');
const yrs = SA.map(a => a.fy);

const gases = {
  id: 'gases', nav: 'Gases', kicker: 'Segment', title: 'Gases: 84% of revenue, a 36% EBITDA margin, and four big plants on the way',
  blocks: [
    { pair: [
      { type: 'column', title: 'Gases revenue: flat in FY24-26, growth resumes as plants start', unit: 'Gases segment revenue (₹ crore; FY23 = 15 months)', x: [...yrs, ...F.years], series: [{ name: 'Gases', values: [...SA.map(a => Math.round(a.gasRev)), ...SEG.gas.revenue.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Segment notes; GAM estimates for FY27-29E' },
      { type: 'column', title: 'Gases segment EBITDA margin: ~36% underlying', unit: 'Segment EBITDA as % of revenue (FY26u = without the ₹90 cr reversal)', x: ['FY24', 'FY25', 'FY26', 'FY26u', ...F.years], series: [{ name: 'Margin', values: [segM(A24, 'gas'), segM(A25, 'gas'), segM(A26, 'gas'), A26.gasEbitdaExOneOff / A26.gasRev * 100, ...G.marginPct].map(v => Math.round(v * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: 'AR segment notes (result + segment D&A); GAM estimates' },
    ] },
    { bullets: [
      `**On-site.** Plants inside Tata Steel (Jamshedpur 2,550 tpd and 1,290 tpd; Kalinganagar), SAIL Rourkela, JSL Jajpur, ITC Bhadrachalam and IOCL Panipat. Capitalised in FY26: ${PJ.capitalisedFY26.slice(0, 2).join('; ')}. Under construction (Aug-2026): ${PJ.underConstruction.slice(0, 3).join('; ')}. Lease rentals from dedicated plants were ₹127 cr in FY26, with ₹677 cr of minimum future receipts.`,
      '**Merchant.** Record liquid loading in FY25 and again in FY26; merchant deliveries rose from 2,107 to 2,360 tonnes a day (+12%). Liquid nitrogen outgrew liquid oxygen for a second year (solar PV, semiconductor packaging, food), argon grew with stainless steel and electronics. The 250 tpd Dahej ASU (FY24) ramped up faster than planned and the 250 tpd Ludhiana ASU (FY25) loaded well; a third Dahej ASU (245 TPD liquid + 100 TPD gaseous oxygen, anchored by an Asian Paints pipeline contract) starts in FY27.',
      '**Packaged, special gases and healthcare.** Argon mixes (in-house Linde Mixer), Entonox and liquid medical oxygen, a high-purity N2O unit at Hyderabad (Aug-2025) for solar and electronics, ₹37 cr of silane, ammonia and N2O trailers in FY26, an ammonia purification project in Gujarat (FY27) and the largest medical-gas pipeline order in India (DRFMS hospital, Mumbai).',
      `**Costs.** Power and fuel was ₹415 cr in FY26 (₹521 cr in FY25); on-site power is passed through, so lower power lifted the margin but cut revenue. In Q1FY27 the Gases PBIT margin slipped to ${n1(Q1.gasPbitMarginPct)}% from ${n1(Q1.gasPbitMarginQ1FY26Pct)}% (higher power tariffs, overheads and depreciation on new plants).`,
    ] },
    { callout: `**Our view:** a high-quality, contract-heavy business, now growing again. We model Gases revenue ${pc(G.growth[0])} / ${pc(G.growth[1])} / ${pc(G.growth[2])} in FY27-29E as the new plants start, and segment EBITDA margin of ${G.marginPct.join('% / ')}%: a little below FY26's underlying 36.3% at first (Q1FY27 ran at ~35%), then rising as fixed facility fees come in. That takes Gases EBITDA from ~₹${n0(A26.gasEbitdaExOneOff)} cr (FY26 underlying) to ₹${n0(SEG.gas.adjEbitda[2])} cr in FY29E. The risk is timing: a plant that starts a year late moves its facility fee and volumes a year out, and plant-level economics are not disclosed, so we cannot size each one.` },
  ],
};

const ped = {
  id: 'ped', nav: 'Project Engineering', kicker: 'Segment', title: 'Project Engineering: a ₹2,000 cr third-party order book, lumpy revenue, and margins flattered by in-house work',
  blocks: [
    { pair: [
      { type: 'column', title: 'External PED revenue swings with project timing', unit: 'PED external revenue (₹ crore; FY23 = 15 months)', x: [...yrs, ...F.years], series: [{ name: 'External revenue', values: [...SA.map(a => Math.round(a.pedExt)), ...SEG.ped.revenue.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Segment notes; GAM estimates' },
      { type: 'line', title: 'PED margin: 11-14% for years, then 22-30% when own-plant work was large', unit: 'PED segment result as % of external revenue', x: yrs, series: [{ name: 'PBIT margin', values: SA.map(a => Math.round(pbitM(a, 'ped') * 10) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 35, source: 'Segment notes' },
    ] },
    { bullets: [
      `**Order book.** Total backlog ₹${n0(PED.orderBacklogMar26)} cr at Mar-2026 (₹${n0(PED.orderBacklogMar25)} cr a year earlier), including plants for Linde India itself; third-party order book ~₹2,000 cr (AGM, Aug-2026). FY26 order intake: ₹${n0(PED.orderIntakeFY26ThirdParty)} cr third-party, ₹${n0(PED.orderIntakeFY26InHouseInterco)} cr in-house and inter-company.`,
      `**What is being built.** ${PED.keyProjects}.`,
      `**Execution.** External revenue was ₹${n0(A25.pedExt)} cr in FY25 and ₹${n0(A26.pedExt)} cr in FY26 (project timing), then ₹${n0(Q1.pedExt)} cr in Q1FY27 alone, more than double Q1FY26. FY26 commissioning: ${PED.commissionedFY26}.`,
      `**Margins.** On external revenue the segment earned 11-14% (PBIT) in CY18-FY24, then 22% in FY25 and 30% in FY26, years when it also built ₹${n0(A25.pedInter)} cr and ₹${n0(A26.pedInter)} cr of plants for Linde India "at cost". That in-house work absorbs engineering overheads, so external margins look better than they would on a stand-alone basis. In Q1FY27, with in-house work down to ₹75 cr, the margin was ~16%.`,
      '**Accounting.** Revenue is booked on percentage of completion; the auditor lists cost-to-complete estimates as a key audit matter.',
    ] },
    { callout: `**Our view:** PED is a useful but unpredictable business. We model external revenue of ₹${n0(SEG.ped.revenue[0])} cr in FY27E as the semiconductor and refinery orders are executed, then ₹${n0(SEG.ped.revenue[1])} cr and ₹${n0(SEG.ped.revenue[2])} cr, at ${PD.marginPct.join('% / ')}% EBITDA margins, close to the long-run level rather than FY26's 31%. PED adds ~₹${n0(SEG.ped.adjEbitda[1])} cr of EBITDA in FY28E, about a tenth of the total.` },
  ],
};

const parent = {
  id: 'parent', nav: 'Linde plc & Praxair India', kicker: 'The parent', title: 'Linde plc owns 75% of Linde India and 100% of Praxair India, a sister company of the same size: that is the core governance problem',
  blocks: [
    { p: `The BOC Group (UK), part of Linde plc, owns 75.00% of Linde India, with nothing pledged. When Linde AG and Praxair merged in 2018, Linde plc also acquired Praxair India Pvt Ltd, which it owns 100% and which is about the same size as Linde India: FY25 turnover ₹${n0(RP.praxairIndia.fy25Turnover)} cr, profit ₹${n0(RP.praxairIndia.fy25Pat)} cr, net worth ₹${n0(RP.praxairIndia.fy25NetWorth)} cr (Linde India FY25: ₹2,485 cr, ₹455 cr, ~₹3,780 cr). On 24-Mar-2020 the two companies signed a JV agreement: a 50:50 services company (LSAS) that provides procurement, safety, HR, finance, IT, legal, sales and plant-management services to both, and a protocol for dividing future business. The protocol: ${rup(RP.businessAllocation.split('): ').slice(1).join('): '))}` },
    { exhibit: { type: 'table', title: 'Money flowing between Linde India and the Linde group, FY26 (₹ crore)', head: ['Flow', 'FY26', 'FY25', 'Note'], wide: [3], rows: [
      ['Sales to Praxair India', n0(RP.fy26.salesToPraxair), n0(RP.fy26.salesToPraxairFY25), 'Gases, recharges; RPTs with Praxair were 27.9% of revenue in CY21 and 15.8% in FY25'],
      ['Purchases from Praxair India', n0(RP.fy26.purchasesFromPraxair), n0(RP.fy26.purchasesFromPraxairFY25), 'Gases bought where the sister company has the nearer plant'],
      ['Royalty to Linde GmbH group', n1(RP.fy26.royaltyToParent), n1(FY.royaltyFY25), '2.8% of FY26 revenue'],
      ['Support services from LSAS (50:50 JV)', n0(RP.fy26.supportServicesToLSAS), n0(RP.fy26.supportServicesToLSASFY25), 'Procurement, HR, finance, IT, legal, sales, plant management'],
      ['Plant and equipment bought from group companies', n0(RP.fy26.ppePurchasesFromGroup), n0(RP.fy26.ppePurchasesFromGroupFY25), 'Equipment for new ASUs'],
      { hl: true, cells: ['**Dividend to the promoter**', `**${n1(RP.fy26.dividendToPromoter)}**`, '76.8', '75% of ₹102 cr'] },
    ], source: 'Annual report FY26, related-party note 43; EGM notice (Feb-2026)' } },
    { exhibit: { type: 'table', title: 'The SEBI, SAT and Supreme Court matter', head: ['When', 'What happened'], wide: [1], rows: RP.regulatory.map(r => [r.when, rup(r.what)]), source: 'Annual report FY26 notes 50-51; Q1FY27 results note (iii); LiveLaw (Dec-2025)' } },
    { bullets: [
      '**The votes.** In June 2021, 93.94% of votes cast rejected an omnibus approval for dealings with Praxair India and LSAS. The company then treated each contract separately so that none crossed the 10%-of-turnover threshold for a vote; SEBI (Jul-2024) and SAT (Dec-2025) said all dealings with one party must be added up. At an EGM on 5-Mar-2026 the company asked for a ₹417.7 cr FY26 limit; 89.24% of votes cast were against (the promoter could not vote), and it stopped trading with Praxair India for the rest of the year.',
      '**The company\'s case.** Dealings are at arm\'s length (an annual EY certificate), margins on Praxair sales exceed 30%, and sourcing from the nearer group plant saves freight; the allocation is "transparent and equitable". It expects to win in the Supreme Court and says the impact of the valuer\'s report cannot be estimated.',
      '**The open question.** The NSE-appointed valuer reported (16-Mar-2026) on business "allegedly foregone" and "allegedly gained"; the numbers have not been disclosed. SEBI said it will decide further action, including on directors and officers, after the valuation.',
    ] },
    { callout: '**Our view:** this is the single most important fact about the stock. A parent that owns 100% of one company and 75% of another has a reason to put growth in the first. The allocation is not obviously unfair (Linde India keeps the steel-heavy East, its engineering monopoly within the group and its incumbent customers), but minorities were not asked and were not compensated, and every regulator so far has agreed with them. Possible outcomes range from compensation to Linde India (positive) to a merger of the two companies or a delisting offer (positive for the price) to years of litigation and restricted dealings (negative). We do not put a value on any of them.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in on-site contracts and local density; fenced in by its own parent',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (filings and AGM deck to Sep-2026)' },
    { callout: '**Honest verdict:** Linde India has a **narrow-to-moderate moat**. Long on-site contracts and dense plant clusters in the East and North are real advantages that rivals cannot copy quickly, and Linde plc\'s technology helps. But it has no cost edge, merchant pricing is cyclical, and its parent has given the South, Central India, hydrogen and CO2 to a sister company. A narrow moat deserves a premium to the market, not four times Linde plc\'s multiple.' },
  ],
};

module.exports = { gases, ped, parent, moat };
