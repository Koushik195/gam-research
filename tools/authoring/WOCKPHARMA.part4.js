// Wockhardt report, part 4: Q1FY27 and guidance, earnings quality, ownership, management and governance.
const X = require('./WOCKPHARMA.ctx');
const { C, D, A, n0, n1, pc, Q1, FY26, shortDate, b } = X;
const ch = (a, b2) => pc((a / b2 - 1) * 100);
const rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: sales +26% and a ₹106 cr profit, but margin and profit fell from Q4',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore unless stated)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'YoY'], rows: [
      ['Revenue', n0(Q1.revenuePrior), '965', n0(Q1.revenue), ch(Q1.revenue, Q1.revenuePrior)],
      ['  India branded', n0(Q1.indiaBrandedPrior), '112', n0(Q1.indiaBranded), ch(Q1.indiaBranded, Q1.indiaBrandedPrior)],
      ['  Emerging markets', n0(Q1.emPrior), '320', n0(Q1.em), ch(Q1.em, Q1.emPrior)],
      ['  UK (GBP mn)', String(Q1.ukGbpMnPrior), '29', String(Q1.ukGbpMn), '0%'],
      ['  Biotech (insulin)', n0(Q1.biotechPrior), '252', n0(Q1.biotech), ch(Q1.biotech, Q1.biotechPrior)],
      ['EBITDA before R&D', '128', '224', n0(Q1.ebitdaPreRd), ch(Q1.ebitdaPreRd, 128)],
      ['R&D expensed', n0(Q1.rdPrior), '28', n0(Q1.rd), ch(Q1.rd, Q1.rdPrior)],
      ['EBITDA (company)', n0(Q1.ebitdaCoPrior), '196', n0(Q1.ebitdaCo), ch(Q1.ebitdaCo, Q1.ebitdaCoPrior)],
      ['  margin', '13.7%', '20.3%', '20.2%', '+650bp'],
      ['Exceptional items', n0(Q1.exceptionalPrior), '22', '0', ''],
      { hl: true, cells: ['**Profit after tax (Screener owners)**', '**(90)**', '**166**', `**${n0(Q1.patOwners)}**`, '**turn**'] },
    ], source: 'Q1FY27 press release (10-Aug-2026); Q4FY26 press release; Screener (owners)' } },
    { bullets: [
      '**Growth came from insulin and India:** emerging markets +64% and biotech +112%; India branded +21% (Emrok +29%); Ireland +28%. The UK was flat in sterling (GBP 27mn).',
      '**Margin slipped from Q4:** EBITDA margin 20.2% vs 20.3% in Q4FY26 on the company basis (Screener 20.7% vs 23.3%), with seasonality and Zaynich pre-launch costs; profit fell from ₹166 cr to ₹106 cr partly because Q4 included a ₹22 cr exceptional gain and ₹45 cr of other income (₹31 cr in Q1). The stock fell ~4% after the results.',
      '**No earnings call:** Wockhardt did not hold a Q1 call; the last Q&A was the 4-Jun-2026 investor meet after the approvals.',
      '**After the results (to 30-Sep-2026):** the AGM (10-Aug-2026) took up the ₹3,000 cr fund-raise enabler and a higher pay ceiling for the chairman; no new shares were issued. The stock closed at ₹2,116.3 on 30-Sep.',
    ] },
    { exhibit: { type: 'table', title: 'What management and the rating agency said before 30-Sep-2026', head: ['When', 'Topic', 'What was said'], wide: [2], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said)]), source: 'Investor meet transcript (4-Jun-2026); ICRA (21-May-2026); Business Today (7-Jul-2026)' } },
    { callout: '**Credibility check:** management delivered what it promised on survival and profitability (EBITDA margin 5.4% to 18.6% in three years, debt down, Zaynich filed and approved on time). Its record on launch timing is weaker: Zaynich was once targeted for "early FY26" (2024 press), and the press-reported ₹6,000 cr revenue ambition for FY28 is a third above our ₹4,500 cr. We take management\'s slow-ramp warning at face value and ignore the peak-sales number.' },
  ],
};

const AC = C.accounting;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: most R&D is capitalised, exceptional items every year, and a Swiss subsidiary with outside shareholders',
  blocks: [
    { bullets: [
      `**Capitalised R&D.** ${rup(AC.rdCapitalisation)} Intangibles under development reached ₹${n0(AC.intangiblesUnderDevelopment.mar26)} cr (Zaynich ₹1,055 cr, Foviscu ₹350 cr, Miqnaf ₹201 cr), a key audit matter. If Zaynich disappoints, an impairment would hit book value directly.`,
      `**Exceptional items in five of the last six years.** FY21 −₹142 cr (continuing), FY22 −₹183 cr, FY23 −₹295 cr, FY24 −₹66 cr, FY26 −₹85 cr: ${FY26.exceptionals.map(e => `${e.item.toLowerCase()} ₹${n0(e.cr)} cr`).join('; ')}. We value on EPS before exceptional items (none forecast).`,
      `**Other income included one-offs.** FY26 other income of ₹${FY26.otherIncome.total} cr included ₹${FY26.otherIncome.assetSaleProfit} cr of profit on asset sales and ₹${FY26.otherIncome.writeBacks} cr of liabilities written back; interest income was only ₹${FY26.otherIncome.interestIncome} cr.`,
      '**Minorities.** 14.15% of Wockhardt Bio AG (which holds the UK, Irish and EU businesses and the Zaynich US NDA) belongs to outside shareholders whom the annual report does not name. Bio AG lost ₹97 cr in FY26, so minorities absorbed ₹14 cr; once Zaynich earns money in the US, 14.15% of it leaks out. We forecast no minorities (≈₹1 of FY29E EPS).',
      `**Tax.** FY26 tax was 16.3% because ₹118 cr of tax losses were used without a deferred tax asset; Q1FY27 was ~8%. The remaining loss pool is not disclosed; our 12% / 18% / 22% path is a judgement.`,
      `**Related-party flows.** ${rup(C.governance.relatedParty)}`,
      `**Audit.** ${AC.auditor}`,
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing is hidden (it is all in the annual report), but reported EBITDA understates the true R&D cost, exceptional charges recur, and the IP sits in a subsidiary with unnamed minority holders and FEMA-overdue intra-group balances. The profit turn itself is real: four quarters of profit before exceptional items, positive operating cash flow in FY26 and an upgraded credit rating.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Khorakiwala family owns ${OH.categoriesPct.promoter}% (Jun-2026), mostly through Humuza Consultants (${OH.promoters[0].pct}%), down from 74% in 2017 after four equity raises. At Mar-2026, ${n0(OH.pledge.shares)} shares (${OH.pledge.pctOfPromoter}% of the promoters' holding, ${OH.pledge.pctOfTotal}% of the company) were pledged, mainly as security for the company's own NBFC loans; the pledge was ${OH.pledge.peakPctOfPromoter}% of their holding in Mar-2024. Domestic institutions hold ${OH.categoriesPct.dii}% (mutual funds ${OH.categoriesPct.mf}%, down from 8.1% in Mar-2026), foreign investors ${OH.categoriesPct.fpi}%, and ${n0(OH.shareholders)} mostly retail shareholders ${OH.categoriesPct.public}%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoters.map(h => [h.name, h.pct.toFixed(2) + '%', 'Promoter group']),
    { hl: true, cells: ['**All promoters (Jun-2026)**', `**${OH.categoriesPct.promoter}%**`, `${OH.pledge.pctOfPromoter}% of it pledged (Mar-2026)`] },
    ...OH.institutions.map(h => [h.name, h.pct.toFixed(2) + '%', /AIF/.test(h.name) ? 'Alternative fund (Mar-2026)' : 'Fund (Mar-2026)']),
  ], source: 'Shareholding pattern 31-Mar-2026 (company/BSE); Screener (Jun-2026 categories). The Jun-2026 named list was not retrievable.' } },
] });

const G = C.governance;
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a founder-led family company with a long regulatory and financial rap sheet',
  blocks: [
    { exhibit: { type: 'table', title: 'Who runs Wockhardt', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '–']), source: 'AR FY26; investor meet (4-Jun-2026); AGM notice 2026' } },
    { verdicts: true, title: 'Governance scorecard', head: ['Test', 'Verdict', 'Evidence'], verdicts: [
      ['Board independence', 'Partly', G.board],
      ['Promoter alignment', 'Partly', `49.1% stake but ${G.promoterHolding.pledgedPctOfPromoter}% pledged; promoters also lend ~₹950 cr to the company (${rup(G.promoterLoans)})`],
      ['Manufacturing compliance', 'No', rup(G.plants)],
      ['Capital allocation record', 'Partly', 'Survived 2018-23 by selling the India brands and raising ₹2,216 cr of equity; antibiotic bet now approved; France acquisition admitted to be a mistake (chairman)'],
      ['Related parties and subsidiaries', 'Partly', 'IP transfers with 85.85%-owned Bio AG at independent valuation; FEMA-overdue receivables; Bio AG minority holders not named; family member appointed Bio AG co-chair at US$250k'],
      ['Pay', 'Partly', 'Chairman at 79x the median employee; 2026 AGM lifts his ceiling to ₹10-15 cr a year'],
      ['Disclosure', 'Partly', 'No quarterly earnings calls; regional data in press releases; no segment margins'],
      ['Audit and rating', 'Yes', 'MSKC & Associates, unmodified opinion; ICRA upgraded to A- (Stable) in May 2026'],
    ], source: 'AR FY26; ICRA; USFDA import alert 66-40; GAM Research' },
    { callout: '**Our verdict:** governance is improving from a low base, not good. The family kept the antibiotic programme alive through near-insolvency, which is why Zaynich exists; but minority shareholders have paid for it through dilution, and promoter loans, pledges and Swiss-subsidiary structures need watching as Zaynich profits arrive.' },
  ],
};

module.exports = { guidance, quality, ownership, governance };
