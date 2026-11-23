// TVS Motor report, part 5: Q1FY27 and guidance, earnings quality, ownership (named holders), governance.
const X = require('./TVSMOTOR.ctx');
const { C, D, SG, n0, n1, pc } = X;
const Q1 = C.q1fy27, QQ = SG.quarterly, q = k => QQ.find(x => x.q === k), O = D.ownership;
const SRCQ = 'Q1FY27 press release and presentation (21-Jul-2026), call transcript (filed 28-Jul-2026)';
const MON = { m: ['Apr', 'May', 'Jun', 'Jul', 'Aug'], y26: [473970, 566585, 590003, 629675, 616540], y25: [443716, 431275, 402001, 456350, 509536] };

const q1 = {
  id: 'q1fy27', nav: 'Q1FY27 and guidance', kicker: 'Latest results', title: 'Q1FY27: record quarter, a 10% beat on EBITDA, and July-August even stronger',
  blocks: [
    { p: `Q1FY27 (reported 21-Jul-2026) was TVS's biggest quarter: ${n0(Q1.units)} vehicles (+${Q1.unitsGrowth}%), revenue ₹${n0(Q1.revenue)} cr (+${Q1.revenueGrowth}%), EBITDA ₹${n0(Q1.ebitda)} cr (+41%) at a ${Q1.ebitdaMargin}% margin (${Q1.ebitdaMarginPrev}% a year earlier), and profit ₹${n0(Q1.pat)} cr (+${Q1.patGrowth}%). Consensus had expected revenue of ~₹13,470-13,490 cr, EBITDA of ~₹1,610-1,620 cr and profit of ~₹990 cr, so EBITDA beat by ~10%. Two caveats: profit included a ₹${Q1.fairValueGain} cr fair-value gain on investments (₹28 cr a year earlier), so profit before it rose ~${n0((1174 - 150 * 0.74) / (776 - 28 * 0.74) * 100 - 100)}%; and gross margin fell ~130bp quarter on quarter as commodity costs rose ~3.5% of revenue, offset by ~1.5% of price increases and lower other expenses (April production was disrupted).` },
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (standalone)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'YoY'], rows: [
      ['Vehicles sold', n0(q('Q1FY26').units), n0(q('Q4FY26').units), n0(q('Q1FY27').units), pc((q('Q1FY27').units / q('Q1FY26').units - 1) * 100)],
      ['of which electric two-wheelers', n0(q('Q1FY26').ev), n0(q('Q4FY26').ev), n0(q('Q1FY27').ev), pc((q('Q1FY27').ev / q('Q1FY26').ev - 1) * 100)],
      ['of which international business', n0(q('Q1FY26').exports), n0(q('Q4FY26').exports), n0(q('Q1FY27').exports), pc((q('Q1FY27').exports / q('Q1FY26').exports - 1) * 100)],
      ['Revenue (₹ cr)', n0(10081), n0(12808), n0(13896), pc(37.8)],
      ['Revenue per vehicle (₹)', n0(q('Q1FY26').realisation), n0(q('Q4FY26').realisation), n0(q('Q1FY27').realisation), pc((q('Q1FY27').realisation / q('Q1FY26').realisation - 1) * 100)],
      ['EBITDA (₹ cr) / margin', '1,260 / 12.5%', '1,679 / 13.1%', '1,779 / 12.8%', pc(41.2)],
      ['International business revenue (₹ cr)', '2,487', '2,999', '3,634', pc((3634 / 2487 - 1) * 100)],
      ['Net profit (₹ cr)', '779', '998', '1,174', pc((1174 / 779 - 1) * 100)],
    ], source: SRCQ + '; Screener.in (standalone); sum of monthly sales releases' } },
    { pair: [
      { type: 'column', title: 'Monthly sales, FY27 vs FY26: +28% so far', unit: "Total vehicles sold ('000)", x: MON.m, series: [{ name: 'FY26', values: MON.y25.map(v => Math.round(v / 1000)), fmt: 'num', grey: true }, { name: 'FY27', values: MON.y26.map(v => Math.round(v / 1000)), fmt: 'num' }], labels: 'all', source: 'TVS monthly sales releases (2-May to 1-Sep-2026)' },
      { type: 'column', title: 'Revenue per vehicle up 8% YoY in Q1FY27', unit: "Revenue per vehicle (₹ '000), standalone", x: QQ.map(x => x.q), series: [{ name: '₹ per vehicle', values: QQ.map(x => Math.round(x.realisation / 100) / 10), fmt: 'n1' }], labels: 'all', source: 'Company, GAM Research' },
    ] },
    { h: 'What management said (Q4FY26 call on 13-May and Q1FY27 call on 21-Jul-2026)' },
    { bullets: [...Q1.call.slice(0, 7).map(c => c.t), ...C.q4fy26Guidance.slice(1, 3).map(c => c.t)] },
    { callout: '**Our read:** demand is not the issue; July and August were the two biggest months in TVS\'s history (630k and 617k vehicles). The questions are margin (commodities and the end of PLI), the high base from Q3FY27, and how much more cash goes into Norton.' },
  ],
};

const earningsQuality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: good cash conversion, but watch incentives, fair-value marks and the subsidiary carrying value',
  blocks: [
    { p: 'TVS converts profit into cash well: operating cash flow was 114% of EBITDA (before tax) in FY26 and dealers pay up front. We flag AMBER for four reasons that do not change the picture today but matter for what the earnings are worth.' },
    { verdicts: [
      ['Government incentives in revenue', 'Partly', `₹974 cr in FY26 (₹488 cr in FY25): PLI plus export incentives, ~16% of EBITDA. ~₹600 cr of PLI was still receivable at the Q1 call.`, 'PLI (~0.6-0.9% of revenue) ends after FY28; we remove it from FY29E.'],
      ['Fair-value marks in other income', 'Partly', 'Losses of ₹78 cr (FY25) and ₹88 cr (FY26) on investments carried at fair value, then a ₹150 cr gain in Q1FY27 (9% of Q1 PBT).', 'Not recurring; we include Q1\'s gain in FY27E but forecast none after.'],
      ['Subsidiaries at cost', 'No', '₹7,172 cr invested in TVS Motor (Singapore) with no impairment, while Norton and the e-bike group lost ~₹1,150 cr in FY26.', 'Standalone book value overstates what these investments are worth; our SOTP gives them negative value.'],
      ['Supplier finance and working capital', 'Partly', '₹946 cr of payables under supplier-finance schemes at Mar-26; cash conversion cycle −56 days.', 'Cash flow flatters if suppliers or banks tighten terms.'],
      ['Standalone vs consolidated gap', 'No', 'FY26 EPS ₹76.1 standalone vs ₹63.5 consolidated; the street quotes standalone.', 'The reported "P/E" hides ~₹1,350 cr of subsidiary losses.'],
      ['One-offs', 'Yes', 'Exceptional items small: ₹41 cr Labour Code gratuity charge (FY26), ₹148 cr gain (FY24).', 'Clean.'],
    ], head: ['Item', 'Clean?', 'Evidence', 'What we do'], title: 'Earnings-quality checklist', source: 'AR FY26 notes 17, 21, 22 and 49; Q1FY27 call; GAM Research' },
    { pair: [
      { type: 'column', title: 'Government incentives doubled to ₹974 cr in FY26', unit: 'Government grants in revenue (₹ crore) and as % of EBITDA', x: ['FY25', 'FY26'], series: [{ name: '₹ cr', values: [488.5, 973.6], fmt: 'num' }], labels: 'all', source: 'AR FY26 note 21' },
      { type: 'column', title: 'Cash conversion has stayed above 100% of EBITDA', unit: 'Operating cash flow before tax ÷ EBITDA (%)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'CFO/EBITDA', values: [193, 92, 93, 120, 115, 114], fmt: 'pct0' }], labels: 'all', source: 'Screener.in (standalone)' },
    ] },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `TVS Holdings Ltd (formerly Sundaram-Clayton), an RBI-registered core investment company controlled by the Venu Srinivasan family, owns 50.26%; the promoter stake has not changed in three years and nothing is pledged. In the June 2026 quarter foreign investors cut their holding from ${O.mar2026.fii}% to ${O.jun2026.fii}% while domestic institutions rose from ${O.mar2026.dii}% to ${O.jun2026.dii}% (mutual funds ${O.mar2026.mf}% → ${O.jun2026.mf}%).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders above 1% (30-Jun-2026)', head: ['Holder', 'Jun-2026 %', 'Mar-2026 %'], rows: O.jun2026.holders.map(h => [h[0], n1(h[1]), (O.mar2026.holders.find(m => m[0].split(' ')[0] === h[0].split(' ')[0]) || [null, null])[1] != null ? n1(O.mar2026.holders.find(m => m[0].split(' ')[0] === h[0].split(' ')[0])[1]) : '–']), source: 'TVS Motor shareholding pattern (SEBI Reg. 31) for Jun-2026 and Mar-2026' } },
  { callout: 'ICICI Prudential Mutual Fund is the largest outside holder (6.8%, up a point in a quarter). The Sep-2026 pattern is not used (filed after our as-of date).' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: an able family-run company, with high pay and a habit of funding overseas bets',
  blocks: [
    { p: 'Sudarshan Venu took over as Chairman & Managing Director on 25-Aug-2025; his father Venu Srinivasan, who built the company, is Chairman Emeritus & Managing Director. Day-to-day operations are run by K N Radhakrishnan (Director & CEO). The track record under this team is very good: share gains every year since FY21, the Deming Prize heritage, and the EV and export build-outs. The weak spots are pay and capital allocation.' },
    { verdicts: [
      ['Execution and strategy', 'Strong', 'Volumes doubled FY21-26; margin 8.5% → 12.9%; #1 in EVs.', 'Management has earned trust on operations.'],
      ['Capital allocation', 'Weak', '~₹2,400 cr into subsidiaries in FY26; Norton (£250m+), Swiss e-bikes, DriveX, Ultraviolette; no break-even targets disclosed.', 'The main governance risk for minority holders.'],
      ['Pay', 'Weak', `CMD paid 436x the median employee (+46% in FY26); CEO 197x (+33%); KMP short-term pay ₹106 cr plus ₹61 cr share-based; managerial pay +44% vs employees +13%.`, 'High even for a large Indian company.'],
      ['Board', 'Moderate', 'Independent directors include Shailesh Haribhakti, Vijay Sankar, B Sriram; two added in Dec-2025 and May-2026; Sir Ralf Speth left in Aug-2025.', 'Adequate.'],
      ['Disclosure', 'Moderate', 'Excellent monthly volume data; no EV margin, Norton revenue or break-even disclosure; segment note only "automotive vs financial services".', 'We had to infer subsidiary losses.'],
      ['Balance sheet and credit', 'Strong', 'CARE AAA (upgraded Jul-2026); promoter shares not pledged; NCRPS redeemed on schedule.', 'Low financial risk at the parent.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Management and governance scorecard', source: 'AR FY26 (remuneration annexure, related-party note), Q1FY27 call, GAM Research' },
  ],
};

module.exports = { q1, earningsQuality, ownership, governance };
