// Piramal Pharma report, part 4b: capital allocation and returns, ownership, management & governance.
const X = require('./PPLPHARMA.ctx');
const { C, D, A, F, V, n0, n1, b, ai, rup, roce } = X;
const sumA = (k, f, t) => { let s = 0; for (let i = ai(f); i <= ai(t); i++) s += A[k][i] || 0; return s; };
const RL = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const OW = D.ownership;

const capital = {
  id: 'capital', nav: 'Capex & returns', kicker: 'Capital allocation', title: 'Capital allocation: ₹4,700 cr of capex and ₹1,000 cr of acquisitions in six years for a 3% return on capital',
  blocks: [
    { p: `Over FY21-26 Piramal generated ₹${n0(sumA('cfo', 'FY21', 'FY26'))} cr of operating cash and spent ₹${n0(sumA('capex', 'FY21', 'FY26'))} cr on fixed assets and ₹1,002 cr on acquisitions (FY21-22), funded by Carlyle's ₹3,523 cr (FY21), the ₹1,050 cr rights issue (FY24) and debt. ROCE on Screener's basis was 7% in FY22, 2% in FY23, 5-6% in FY24-25 and ${roce.at(-1)}% in FY26, against a cost of capital of ~12%. FY27 capex is guided at US$120-135 mn plus Kenalog; management says growth capex continues after Lexington. Its FY30 goals include a high-teens ROCE and net debt/EBITDA of ~1x; on our numbers ROE reaches only {{F.roe.2|pct}} in FY29E.` },
    { pair: [
      { type: 'column', title: 'Operating cash flow vs capex: free cash flow positive only since FY24', unit: '₹ crore', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Cash from operations', values: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => A.cfo[ai(l)]), fmt: 'num' }, { name: 'Capex', values: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => A.capex[ai(l)]), fmt: 'num' }], labels: 'none', source: 'Screener.in cash flow (consolidated)' },
      { type: 'line', title: 'ROCE: never above 7% since listing', unit: 'Return on capital employed (%), Screener basis', x: RL, series: [{ name: 'ROCE', values: roce.slice(1), fmt: 'pct0' }], labels: 'all', min: 0, max: 15, source: 'Screener.in' },
    ] },
    { callout: '**The capital question:** management has built the plants; the next three years are about filling them. We would judge capital allocation on two numbers: whether FY27-28 capex falls towards maintenance levels as CARE expects, and whether net debt starts falling from FY28. Further acquisitions like Kenalog (small, accretive, already on the market) are fine; a large one before the existing capacity earns its keep would not be.' },
  ],
};

const ownership = base => ({
  ...base,
  blocks: [
    { p: rup(`At June 2026 the Piramal family held ${OW.categories.promoters}% (34.85% at Mar-26; it subscribed to the 2023 rights issue and has not pledged shares). The largest outside holder is CA Alchemy Investments, a Carlyle affiliate, with 17.95% (23.87 cr shares at Mar-26), the remainder of the 20% bought for Rs3,523 cr in October 2020. Carlyle has twice prepared to sell: a ~10% block was reported in July 2025, and a 6-10% sell-down (Rs1,750-2,700 cr) was reported cancelled on 14-Aug-2026 (IFR). At Mar-26, mutual funds held 14.12%, other foreign portfolio investors 12.23%, insurers 1.24% and individuals ~14%. ${OW.reclassNote}`) },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Named holders and categories', head: ['Holder', '%', 'As of'], wide: [0, 2], rows: OW.named.map(h => [rup(h.holder), n1(h.pct), rup(h.asOf)]), source: OW.src } },
    { callout: '**So what:** with ~18% in the hands of a private-equity holder that has tried to sell twice, there is a known overhang: any rally may meet supply. A clean block to long-only funds would remove it; another cancelled attempt would keep it.' },
  ],
});

const MG = C.management;
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a family-run professional team, a clean audit record, but pay rose sharply in a loss year and guidance has slipped',
  blocks: [
    { exhibit: { type: 'table', title: 'Who runs Piramal Pharma', head: ['Name', 'Role', 'Notes'], wide: [2], rows: MG.people.map(r => r.map(rup)), source: MG.src } },
    { p: rup(MG.board) },
    { verdicts: [
      ['Alignment', 'Partly', 'Promoters hold 34.8%, unpledged, and put money into the 2023 rights issue; but the CEO and chairperson are family and the board is family-led.'],
      ['Pay vs performance', 'No', 'Executive pay rose 125-126% (chairperson 74x and CEO 73x the median employee) and 67% (CFO) in FY26, a loss year (AR FY26). Likely ESOP/LTIP accounting, but the optics are poor.'],
      ['Guidance credibility', 'Partly', 'FY25 broadly met; FY26 missed (guided low single-digit growth, cut to flat, delivered −3% and a loss); FY27 on track after Q1.'],
      ['Disclosure', 'Partly', 'Good on quality, capex and business revenue; no segment EBITDA, no utilisation data, no Kenalog revenue.'],
      ['Regulatory and audit', 'Yes', 'No OAI in 49 USFDA inspections since FY12; statutory auditors Suresh Surana & Associates LLP (FY26 accounts signed 28-Apr-2026).'],
      ['Related parties', 'Yes', 'AbbVie JV and Yapan dealings are disclosed; the company states it has given no loans or advances to firms in which its directors are interested (AR FY26).'],
      ['Board stability', 'Partly', 'An independent director (S. Ramadorai) retired and the company secretary resigned in Feb-2026; replacements appointed.'],
    ], head: ['Area', 'Verdict', 'Evidence'], title: 'Governance scorecard', source: 'AR FY26; Q4FY26 and Q1FY27 calls; GAM Research' },
    { callout: '**Our verdict: AMBER.** Nothing we found suggests minority shareholders are at risk, and the quality record is excellent. The concerns are execution credibility (two misses in four years of listed life) and pay that rose while shareholders lost money.' },
  ],
};

module.exports = { capital, ownership, governance };
