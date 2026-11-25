// Piramal Pharma report, part 4: moat, anatomy of the FY26 loss, earnings quality (capital, ownership, governance in 4b).
const X = require('./PPLPHARMA.ctx');
const { C, D, A, F, n0, n1, b, rup, OIN } = X;
const LB = C.lossBridge;
const VMAP = { Strong: 'Strong', Moderate: 'Moderate', Weak: 'Weak' };

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Moat scorecard: strong in quality and hospital niches, weak in scale and returns',
  blocks: [
    { verdicts: D.moat.map(m => [m.factor, VMAP[m.score] || 'Moderate', rup(m.evidence)]), head: ['Factor', 'Score', 'Evidence'], title: 'Competitive advantage scorecard', source: 'Company calls and filings; AR FY26; CARE; GAM Research' },
    { callout: '**Honest verdict:** Piramal has narrow moats in two places, its regulatory record and its US hospital niches (sevoflurane, intrathecal baclofen), and neither shows up in group returns because the CDMO plant network is under-filled. In CDMO it competes on capability and reliability against well-funded Indian, Chinese and Western rivals that also added capacity; there is no evidence yet of pricing power (FY26 margins fell with one customer). We would call it a capable operator with a cost and scale problem, not a moat business.' },
  ],
};

const loss = {
  id: 'loss', nav: 'Why FY26 was a loss', kicker: 'The FY26 loss', title: 'Why FY26 turned to a loss: ~₹520 cr of lost operating profit, a tax bill that did not fall with profit, and ₹196 cr of one-offs',
  blocks: [
    { p: rup(`Profit went from Rs91 cr in FY25 to a loss of Rs326 cr in FY26, a Rs417 cr swing. ${LB.items}`) },
    { exhibit: { type: 'table', title: 'FY25 → FY26 profit bridge (₹ crore, company figures)', head: ['Step', '₹ crore', 'What happened'], wide: [2], rows: [
      ['FY25 net profit', '91', ''],
      ['EBITDA before other income', n0(LB.ebitdaBeforeOI), 'CDMO revenue −₹532 cr, mostly the destocked on-patent product; fixed costs kept rising (employees +4.7%, other expenses +5.8%, a ₹42 cr fire loss)'],
      ['Other income', `+${LB.otherIncome}`, 'Forex gains ₹50 cr, write-backs ₹56 cr'],
      ['Depreciation', n0(LB.dep), 'New capacity'],
      ['Interest', `+${LB.interest}`, 'Lower rates and refinancing'],
      ['Share of associates', n0(LB.associates), 'AbbVie JV profit −12%, Yapan loss'],
      ['Tax', `+${LB.tax}`, 'Fell far less than profit: India profits taxed, overseas losses not credited'],
      { hl: true, cells: ['**Loss before exceptional items**', '**−130**', ''] },
      ['Exceptional items', n0(LB.exceptional), 'Impairment ₹176 cr; labour codes ₹27 cr; customer settlement ₹15 cr; insolvency recovery +₹21 cr'],
      { hl: true, cells: ['**FY26 net loss**', '**−326**', ''] },
    ], source: 'Q4FY26 press release; AR FY26 notes 27, 32, 33, 34; Screener (EBITDA before other income); GAM' } },
    { pair: [
      { type: 'column', title: 'Tax vs profit before tax: 41-78% of PBT before FY26, 7.5x PBT in FY26', unit: '₹ crore', x: ['FY24', 'FY25', 'FY26'], series: [{ name: 'PBT after associates, before exceptionals', values: [179 + 59, 415, 20], fmt: 'num' }, { name: 'Tax', values: [Math.round(179 * 0.55), 324, 150], fmt: 'num' }], labels: 'all', source: 'Screener.in (FY24 PBT incl. ₹59 cr of exceptional items added back); company presentations' },
      { type: 'column', title: 'Operations vs one-offs in the FY26 swing', unit: '₹ crore (change vs FY25)', x: ['EBITDA', 'Other income', 'D&A + interest', 'Associates', 'Tax', 'Exceptional'], series: [{ name: 'Change', values: [LB.ebitdaBeforeOI, LB.otherIncome, LB.dep + LB.interest, LB.associates, LB.tax, LB.exceptional], fmt: 'num' }], labels: 'all', source: 'GAM, from company figures' },
    ] },
    { callout: '**So what:** the fall in EBITDA alone (₹523 cr) was bigger than the whole ₹417 cr swing; lower interest, higher other income and a smaller tax bill offset part of it, and one-offs added ₹196 cr (before them the swing was ₹221 cr). So the loss was mainly operating: lost CDMO profit on a fixed cost base. That is cyclical rather than structural if orders return, as Q1FY27 suggests, but it shows how much one customer can move the group, and the tax structure means even a full EBITDA recovery leaves modest profits until the overseas sites earn money.' },
  ],
};

const earnings = {
  id: 'earnings', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: amber. Other income, write-backs and tax swing reported profit; cash flow was flattered by suppliers in FY26',
  blocks: [
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Flag', 'Source'], wide: [0], rows: C.accounting.map(a => [rup(a.item), a.src]), source: 'AR FY26; Q1FY27 call; GAM' } },
    { exhibit: { type: 'table', title: 'Other income: what is in it (₹ crore)', head: ['', 'FY25', 'FY26', 'Recurring?'], rows: [
      ['Forex gains (net)', n1(OIN.FY25.forex), n1(OIN.FY26.forex), 'Follows the rupee'],
      ['Write-backs of liabilities / provisions', n1(OIN.FY25.writeBacks), n1(OIN.FY26.writeBacks), 'Partly; Q1FY27 again'],
      ['Miscellaneous incl. grant and deferred income', n1(OIN.FY25.misc), n1(OIN.FY26.misc), 'Mostly'],
      ['Interest, fund and investment gains', n1(OIN.FY25.interestDeposits + OIN.FY25.interestTaxRefund + OIN.FY25.fvtpl + OIN.FY25.investmentGain), n1(OIN.FY26.interestDeposits + OIN.FY26.interestTaxRefund + OIN.FY26.fvtpl + OIN.FY26.investmentGain), 'Yes, small'],
      ['Rent and asset-sale gains', n1(OIN.FY25.leaseRent + OIN.FY25.ppeGain), n1(OIN.FY26.leaseRent + OIN.FY26.ppeGain), 'Small'],
      { hl: true, cells: ['**Company other income**', `**${n1(OIN.FY25.total)}**`, `**${n1(OIN.FY26.total)}**`, 'In company EBITDA'] },
      ['Share of associates (AbbVie JV, Yapan)', '72.9', '57.2', 'Yes (JV)'],
    ], source: 'AR FY26 note 27 and note 36' } },
    { callout: `**Our approach:** we use EBITDA before other income (Screener basis) for valuation, build other income from its parts, value the AbbVie JV separately, and exclude exceptional items from the multiple history (Screener's operating profit already does). On the company's own definition, FY26 EBITDA (₹1,135 cr) was 23% higher than on ours (₹${n0(A.ebitda[b])} cr) because it includes other income.` },
  ],
};

const { capital, ownership, governance } = require('./PPLPHARMA.part4b');
module.exports = { moat, loss, earnings, capital, ownership, governance };
