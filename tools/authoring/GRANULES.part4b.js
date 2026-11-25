// Granules India report, part 4b: capital allocation & returns, ownership, management & governance.
const X = require('./GRANULES.ctx');
const { C, D, A, F, n0, n1, ai, capex5, cfo5, divYield } = X;
const PR = C.promoter, GV = C.governance, OW = D.ownership;

const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital and returns: ROCE 16-18% and ROE 13-14%; FY22-26 capex roughly equalled operating cash flow, and growth was funded with ₹1,762 cr of new equity',
  blocks: [
    { p: `Over FY22-FY26 Granules generated ₹${n0(cfo5)} cr of operating cash and spent ₹${n0(capex5)} cr on capex (Screener basis), plus ~₹200 cr of equity for Senn, ~₹36 cr a year of dividends and ₹100-115 cr a year of interest. Free cash flow after all of that was thin, so debt stayed at ₹1,100-1,500 cr until the Feb-2026 preferential issue. Returns were acceptable, not high: ROCE (company definition) 16.5-17.6% in FY24-FY26 and 18.0% in Q1FY27, ROE 13-14% against a 12.5% cost of equity. Genome Valley and Senn are still in ramp-up and earn little; the CFO expects "very healthy" percentage-point gains in ROCE as they fill (29-Sep-2026). The new equity lowers ROE further until it is deployed: we forecast ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} for FY27-29E on the larger equity base.` },
    { pair: [
      { type: 'column', title: 'Capex vs operating cash flow (₹ crore)', unit: '₹ crore', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'Operating cash flow', values: [...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(A.cfo[ai(y)])), ...F.cfo], fmt: 'num' }, { name: 'Capex', values: [...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(A.capex[ai(y)])), ...F.capex], fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates (engine CFO excludes treasury income)' },
      { type: 'line', title: 'ROE: 27% in FY21, ~12-13% ahead on the larger equity', unit: '%', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'ROE', values: [...['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(A.roe[ai(y)] * 10) / 10), ...F.roe.map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Screener.in; GAM estimates (FY26 on pro forma equity)' },
    ] },
    { callout: `**Dividends and the cash pile.** Granules pays ₹1.50 a share (~6% of profit; yield ~${n1(divYield)}% on our FY27E payout of 7%). With net cash of ~₹${n0(F.treasury[0])} cr by Mar-27E in our model, the question is use: the CFO lists capex, working capital, R&D and acquisitions. A large acquisition is possible ("very actively looking", CMD, 29-Sep-2026) and is not in our numbers.` },
  ],
};

const ownership = base => ({
  ...base,
  blocks: [
    { p: `At ${OW.date} the promoter family owned ${OW.promoters}%, foreign investors ${OW.fiis}%, domestic institutions ${OW.diis}% and the public ${OW.public}% (${OW.shareholders.toLocaleString('en-IN')} shareholders). The founder and CMD, Dr Krishna Prasad Chigurupati, held 30.99% at Mar-2026. ${PR.sep26}. Pledges: ${PR.pledge}.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Named holders', head: ['Holder', '% of shares', 'As of / note'], wide: [2], rows: OW.named.map(h => [h.holder, `${h.pct}%`, h.asOf]), source: 'AR FY26 note 8.3-8.4; BSE filings' } },
    { exhibit: { type: 'table', title: 'Promoter transactions since 2024', head: ['When', 'What', 'Effect'], wide: [1, 2], rows: [
      ['May-2024', 'CMD sold 75 lakh shares (3.09%) for ₹304 cr to repay personal debt and release pledged shares', 'Promoters 42.0% → 38.9%; pledge released'],
      ['Feb-2026', 'Promoter group took most of 2.5 cr warrants at ₹585 (25% paid, ₹365.6 cr in all); 51 lakh shares went to eight outside investors', 'Promoters 38.8% → 38.0% (dilution by the new shares)'],
      ['11-Sep-2026', 'CMD sold ~1.72 cr shares (~₹1,500 cr, ~₹870 a share) in block and market trades', 'Group 38.0% → 31.1% of 24.78 cr shares'],
      ['16-Sep-2026', 'Group paid ₹1,093 cr and converted 2,49,14,530 warrants', 'Back to ~37.4% of 27.28 cr shares (our arithmetic)'],
    ], source: 'BSE filings (summaries); Business Standard (May-2024); Screener shareholding' } },
    { callout: '**What it means:** the family is still the anchor owner (~37%), and the warrants raised fresh equity for the company. But the sequence is worth noting: warrants struck at ₹585 in Feb-2026 were converted in Sep-2026 when the stock was ~₹870, and the cash came from selling existing shares at that higher price. Over the whole transaction the family paid ~₹1,457 cr for 2.49 cr new shares and received ~₹1,500 cr for 1.72 cr existing ones: roughly cash-neutral, with ~0.77 cr more shares, bought at ₹585.' },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: an able founder-led team with a much better compliance push, but a family board, high CMD pay and generous promoter warrants',
  blocks: [
    { exhibit: { type: 'table', title: 'Management', head: ['Name', 'Role', 'FY26 pay'], wide: [1], rows: C.management.map(m => [m.name, m.role, m.pay || '–']), source: 'AR FY26 (directors\' report, corporate governance report); Q1FY27 call; webinar 29-Sep-2026' } },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Test', 'Finding', 'Score'], wide: [1], rows: [
      ['Board independence', GV.board, 'AMBER'],
      ['Promoter pay', GV.flags[0], 'RED'],
      ['Succession / professional management', GV.flags[1], 'AMBER'],
      ['Treatment of minorities in capital raising', GV.flags[2], 'AMBER'],
      ['Pledges', PR.pledge, 'GREEN'],
      ['Related-party dealings', GV.relatedParties, 'GREEN'],
      ['Quality and compliance systems', `${GV.flags[3]}; since then 7 of 8 sites clean, digital quality systems, >330 audits without a critical observation in two years`, 'AMBER'],
      ['Auditor and credit', `${GV.auditor}; ${GV.credit}`, 'GREEN'],
      ['Disclosure', 'Quarterly division and region split, complex-generics share, ROCE and net debt; no division margins, no molecule data', 'AMBER'],
    ], source: 'AR FY26; BSE filings; GAM Research' } },
    { callout: '**Verdict: AMBER.** The founder built a world-scale paracetamol business and has steered it toward harder products; the 2024-25 regulatory failure appears to have been taken seriously. Against that, the CMD took ₹28.4 cr (4.8% of profit) in FY26, the board\'s executive seats are all family, the professional CEO left in 2025, and the warrant structure favoured the promoter group. None of this is unusual in Indian mid-caps; none of it deserves a premium either.' },
  ],
};

module.exports = { capital, ownership, governance };
