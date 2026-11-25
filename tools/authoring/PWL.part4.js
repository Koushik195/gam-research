// Physicswallah report, part 4: earnings quality, ownership, governance, our forecasts vs the street.
const X = require('./PWL.ctx');
const { F, D, AS, f26, q1, n0, n1, pc, preIndAs, segM, ST } = X;
const JM = { sales: [5015, 6255, 7491], ebitda: [770, 1182, 1631], pre: [646, 1038, 1449], pat: [359, 600, 887], eps: [1.2, 2.01, 2.97] };
const dv = (a, b) => pc((a / b - 1) * 100);

const earnings = {
  id: 'earnings', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Four EBITDA numbers, upfront fees and a big ESOP bill: read the profit carefully',
  blocks: [
    { p: 'PW publishes four versions of EBITDA, and they differ by more than the profit itself. The cleanest is **pre-IndAS EBITDA**: revenue less all cash operating costs including rent, before share-based pay and other income: ₹300 cr in FY26 (7.7%). **Adjusted EBITDA** (₹784 cr) adds back rent and other income; **EBITDA** (₹549 cr) deducts ESOP and exceptional items but keeps other income. Our model (Screener basis) uses revenue less operating costs including ESOP, before rent and other income: ₹370 cr. Two further points: ESOP cost was ₹171 cr in FY26 (4.4% of revenue, up from 3.2%), a real cost paid in shares; and other income (₹232 cr, mostly interest on the IPO cash) was larger than FY26 profit before tax (₹10 cr).' },
    { exhibit: { type: 'table', title: 'From revenue to profit: the company\'s EBITDA ladder (₹ crore)', head: ['', 'FY25', 'FY26', 'Q1FY26', 'Q1FY27'], rows: [
      ['Revenue', '2,887', '3,900', '847', '1,054'],
      { hl: true, cells: ['**Pre-IndAS EBITDA** (after rent, before ESOP and other income)', '**94**', '**300**', '**(89)**', '**(44)**'] },
      ['+ Lease payments (rent)', '186', '252', '60', '71'], ['+ Other income', '152', '232', '55', '109'],
      ['= Adjusted EBITDA', '432', '784', '26', '135'], ['− Share-based pay (ESOP)', '(91)', '(171)', '(42)', '(39)'], ['− Exceptional and one-time items', '(147)', '(63)', '(6)', '(44)'],
      ['= Company "EBITDA"', '193', '549', '(21)', '52'], ['Memo: model EBITDA (Screener: excl. other income, after ESOP)', '{{A.ebitda.3|num}}', '{{A.ebitda.4|num}}', '(76)', '(57)'],
      ['Profit before tax', '(259)', '10', '(152)', '(84)'],
    ], source: 'AR FY26 MD&A reconciliation; Q1FY27 letter Appendix A. The model\'s Q1FY27 EBITDA includes the ₹44 cr Sarrthi fair-value charge.' } },
    { exhibit: { type: 'table', title: 'Earnings-quality checklist', head: ['Test', 'Finding', 'Flag'], wide: [1], rows: [
      ['Cash vs profit', 'Operating cash ₹833 cr in FY26 vs EBITDA ₹370 cr: fees are collected upfront (contract liabilities ₹1,149 cr, +33%). Good, but cash flatters in a growing year and rent sits in financing', 'GREEN'],
      ['Share-based pay', `₹171 cr (4.4% of revenue); options at ₹1 exercise price; we forecast ₹${AS.esop.join(' / ')} cr`, 'AMBER'],
      ['Other income', 'Interest on IPO cash was 23x FY26 PBT; FY27E PBT still ~70% other income in our model', 'AMBER'],
      ['One-offs', 'Exceptional items every year: impairment of Bothra and Etoos goodwill, IPO costs, labour codes, Sarrthi fair-value charge (Q1FY27)', 'AMBER'],
      ['Segment disclosure', 'Channel EBITDA auditor-reviewed only from Q1FY27; FY26 channel figures were "management estimates"; Q1FY26 restated', 'AMBER'],
      ['Acquisition accounting', 'Put options on minority stakes create fair-value swings (₹115 cr loss in FY25, ₹11 cr in FY26) and a redemption liability', 'AMBER'],
      ['Tax', 'FY26 tax ₹34 cr on PBT ₹10 cr; loss-making subsidiaries cannot offset', 'AMBER'],
    ], source: 'AR FY26; company letters' } },
    { callout: '**Our view:** the accounting is conventional and EY-audited, but the presentation leans on flattering EBITDA definitions. We value on EBITDA after ESOP (a real cost) and treat rent as debt, which is consistent with the stock\'s own history. On the company\'s "adjusted EBITDA" the group looks twice as profitable as it is.' },
  ],
};

const ownership = base => ({ ...base, blocks: [...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns PW', head: ['Holder', 'Stake', 'Date', 'Note'], wide: [3], rows: [
    ...D.ownershipView.named.map(h => [h.holder, `${h.pct}%`, h.date, /Pandey|Boob/.test(h.holder) ? 'Founder; promoter' : 'Early investor (board nominee Sandeep Singhal)']),
    ['Promoters (total)', `${D.ownershipView.jun26.promoters}%`, 'Jun-26', 'Founders sold ₹380 cr in the IPO offer for sale'],
    ['Foreign institutions', `${D.ownershipView.jun26.fii}%`, 'Jun-26', 'Incl. anchor investors from the IPO'], ['Domestic institutions', `${D.ownershipView.jun26.dii}%`, 'Jun-26', 'Incl. WestBridge AIF and mutual funds'],
    ['Public', `${D.ownershipView.jun26.public}%`, 'Jun-26', `${n0(D.ownershipView.jun26.shareholders)} shareholders`],
  ], source: 'AR FY26 note 9 (holders above 5% at 31-Mar-2026); BSE shareholding pattern Jun-2026 via Screener. Named holders at Jun-2026 not read (gap).' } },
  { callout: '**Supply and float:** the two founders hold ~71%, so free float is under 30% and the stock is sensitive to institutional flows. Pre-IPO investors\' six-month lock-in ended in May-2026; the founders\' minimum-contribution shares are locked until May-2027. Founder control cuts both ways: a long-term owner, but minority shareholders have little say on capital allocation, which is why the FinZ and schools decisions mattered to investors.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Founder-led and founder-controlled; disclosure improving under listed-company pressure',
  blocks: [
    { exhibit: { type: 'table', title: 'Management and governance scorecard', head: ['Area', 'Assessment', 'Score'], wide: [1], rows: [
      ['Founders', 'Alakh Pandey (CEO; the brand and a teacher) and Prateek Boob (operations) own 36% each; both cut their pay by 84% and 61% in FY26', 'GREEN'],
      ['Board', 'Six directors: three independent (chair Deepak Amitabh), two founders, one WestBridge nominee', 'AMBER'],
      ['Auditor', 'S.R. Batliboi & Associates (EY); no qualifications noted', 'GREEN'],
      ['Disclosure', 'Detailed letters and KPIs; channel EBITDA now auditor-reviewed; but four EBITDA definitions, restated segments and Q1 results filed on the last permitted day', 'AMBER'],
      ['Capital allocation', 'Lending arm launched then exited; ₹400 cr school company; acquisitions with put options; ₹2,332 cr of IPO money unspent at Mar-26', 'AMBER'],
      ['Related parties', 'Loan of ₹44 cr to the Gurukulam Education Trust (schools partner) at 10.6%; disclosed in AR FY26', 'AMBER'],
      ['Key-person risk', 'The brand rests on Alakh Pandey and a few star teachers', 'RED'],
    ], source: 'AR FY26 (directors\' report, remuneration annexure, notes); company letters' } },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: 'Our forecasts are close to JM Financial\'s and below management\'s FY27 guidance',
  blocks: [
    { p: `We forecast revenue of ₹{{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|n1}}% in FY27E, below the ~30% guided because Q1 grew 24%), EBITDA after ESOP of ₹{{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr and net profit of ₹{{F.pat.0|num}} / {{F.pat.1|num}} / {{F.pat.2|num}} cr. Pre-IndAS EBITDA (company basis) is ₹${preIndAs.map(n0).join(' / ')} cr: FY27E is about double FY26's ₹300 cr, in line with guidance. JM Financial is the only broker whose full post-Q1 forecasts we have; we are within ~5% on revenue and 7-9% lower on EBITDA (we assume offline breaks even a year later).` },
    { exhibit: { type: 'table', title: 'GAM vs JM Financial (14-Aug-2026)', head: ['₹ crore', 'FY27E GAM', 'FY27E JM', 'FY28E GAM', 'FY28E JM', 'FY29E GAM', 'FY29E JM'], rows: [
      ['Revenue', '{{F.sales.0|num}}', n0(JM.sales[0]), '{{F.sales.1|num}}', n0(JM.sales[1]), '{{F.sales.2|num}}', n0(JM.sales[2])],
      ['EBITDA (after ESOP, Ind AS)', '{{F.ebitda.0|num}}', n0(JM.ebitda[0]), '{{F.ebitda.1|num}}', n0(JM.ebitda[1]), '{{F.ebitda.2|num}}', n0(JM.ebitda[2])],
      ['Pre-IndAS EBITDA', n0(preIndAs[0]), n0(JM.pre[0]), n0(preIndAs[1]), n0(JM.pre[1]), n0(preIndAs[2]), n0(JM.pre[2])],
      ['Net profit (JM: adjusted, after minorities)', '{{F.pat.0|num}}', n0(JM.pat[0]), '{{F.pat.1|num}}', n0(JM.pat[1]), '{{F.pat.2|num}}', n0(JM.pat[2])],
      ['EPS (₹)', '{{F.eps.0|n2}}', JM.eps[0].toFixed(2), '{{F.eps.1|n2}}', JM.eps[1].toFixed(2), '{{F.eps.2|n2}}', JM.eps[2].toFixed(2)],
      ['GAM vs JM: EBITDA', dv(F.ebitda[0], JM.ebitda[0]), '', dv(F.ebitda[1], JM.ebitda[1]), '', dv(F.ebitda[2], JM.ebitda[2]), ''],
    ], source: 'JM Financial, "Decent quarter despite NEET disruption; upgrade to BUY", 14-Aug-2026; GAM Research' } },
    { exhibit: { type: 'table', title: 'Key assumptions', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ['Online revenue growth', ...AS.segments[0].growth.map(g => g + '%'), 'Q1 +33% despite NEET; broadening categories'],
      ['Online channel EBITDA (Ind AS, pre-ESOP)', ...segM('online').map(m => n1(m) + '%'), '~27% after rent in FY26, rising with scale'],
      ['Offline revenue growth', ...AS.segments[1].growth.map(g => g + '%'), 'Fewer new centres; fuller centres and fees'],
      ['Offline channel EBITDA (Ind AS, pre-ESOP)', ...segM('offline').map(m => n1(m) + '%'), 'After rent: −6% / −3% / −1%'],
      ['ESOP (₹ cr)', ...AS.esop.map(n0), '₹171 cr in FY26'], ['Capex incl. lease principal (₹ cr)', ...AS.capex.map(n0), 'Slower centre openings'],
      ['Tax rate', ...AS.taxRate.map(t => t + '%'), 'Loss-making subsidiaries'],
    ], source: 'GAM Research; assumptions.json' } },
  ],
};

const statementNotes = {
  'ebitda@FY27E': 'Channels: online ~28.5%, offline ~6.5% (Ind AS, before ESOP); ESOP ₹170 cr.',
  'otherIncome@FY27E': '6.5% on treasury (net of leases) plus 6.5% on the lease-funded part of gross treasury.',
  'pat@FY27E': 'First full year of profit; ~70% of PBT is other income.',
  'capex@FY27E': 'Cash capex ~₹300 cr plus lease principal ~₹200 cr (new right-of-use assets).',
};

module.exports = { earnings, ownership, governance, forecasts, statementNotes };
