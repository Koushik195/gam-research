// Craftsman Automation report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./CRAFTSMAN.ctx');
const { C, D, F, A, AS, n0, n1, pc1, b, oiCheck, nd0, BL, bld, epsSep, MULT, postQ1, SQ } = X;
const Q = C.q1fy27, rup = s => String(s).replace(/Rs ?/g, '₹');
const yoy = (a, p) => pc1((a / p - 1) * 100);
const q1 = SQ.find(r => r.q === 'Q1FY27'), q0 = SQ.find(r => r.q === 'Q1FY26');

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +36%, PAT +116%, every segment up, margin held at ~16%',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue', n0(Q.revenueQ1FY26), n0(Q.revenue), yoy(Q.revenue, Q.revenueQ1FY26)],
      ['Powertrain revenue / EBIT', `${q0.ptRev} / ${q0.ptEbit}`, `${q1.ptRev} / ${q1.ptEbit}`, `${yoy(q1.ptRev, q0.ptRev)} / ${yoy(q1.ptEbit, q0.ptEbit)}`],
      ['Aluminium revenue / EBIT', `${n0(q0.alRev)} / ${q0.alEbit}`, `${n0(q1.alRev)} / ${q1.alEbit}`, `${yoy(q1.alRev, q0.alRev)} / ${yoy(q1.alEbit, q0.alEbit)}`],
      ['Industrial & eng. revenue / EBIT', `${q0.ieRev} / ${q0.ieEbit}`, `${q1.ieRev} / ${q1.ieEbit}`, `${yoy(q1.ieRev, q0.ieRev)} / ${yoy(q1.ieEbit, q0.ieEbit)}`],
      ['EBITDA (Screener basis)', n0(Q.ebitdaScreenerQ1FY26), n0(Q.ebitdaScreener), yoy(Q.ebitdaScreener, Q.ebitdaScreenerQ1FY26)],
      ['EBITDA margin', `${n1(Q.ebitdaScreenerQ1FY26 / Q.revenueQ1FY26 * 100)}%`, `${n1(Q.ebitdaScreener / Q.revenue * 100)}%`, `+${Math.round((Q.ebitdaScreener / Q.revenue - Q.ebitdaScreenerQ1FY26 / Q.revenueQ1FY26) * 10000)}bp`],
      { hl: true, cells: ['**Net profit**', `**${Q.patQ1FY26}**`, `**${Q.pat}**`, `**${yoy(Q.pat, Q.patQ1FY26)}**`] },
    ], source: 'Q1FY27 presentation (30-Jul-2026) slides 8-13; Screener.in. Company EBITDA incl. other income: ₹408 cr (Q1FY26 ₹270 cr).' } },
    { bullets: [
      '**A beat.** Revenue was 9% above Emkay\'s estimate and 12% above the street\'s (Emkay, 31-Jul-2026); PAT doubled on a weak Q1FY26 base (₹8 cr exceptional charge, early Sunbeam).',
      '**Aluminium** grew 38%: capacity is still being added and "some capacities are still not matured" (CMD); new orders start in FY28-29. Part of the growth is metal-price inflation passed through.',
      '**Powertrain** grew 26%, which the CMD called a return to "a normal situation" after a muted period rather than a strong trend.',
      '**Industrial & engineering** grew 53% with a 9% EBIT margin on material-handling and storage demand.',
      '**Sunbeam** is 90% restructured by Dec-2026; mid-teens EBITDA margin targeted by Q4FY27.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-2026 to Sep-2026)', head: ['When', 'Topic', 'What was said'], wide: [2], rows: [
      ['May-2026 (Q4 call)', 'Growth', rup(C.guidance.growthFY27)],
      ['May-2026 (Q4 call)', 'Aluminium', rup(C.guidance.aluminium)],
      ['May/Jul-2026', 'Large engines', rup(C.guidance.largeEngines)],
      ['Jul-2026 (Q1 call)', 'Capex', rup(C.guidance.capex)],
      ['May/Jul-2026', 'Leverage', rup(C.guidance.leverage)],
      ['May/Jul-2026', 'Utilisation', rup(C.guidance.utilisation)],
    ], source: 'Q4FY26 call (8-May-2026; transcript 13-May-2026); Q1FY27 call (30-Jul-2026; transcript 4-Aug-2026)' } },
    { callout: '**Why it matters:** management gives directions, not numbers, and asked analysts not to treat the ₹6,500 cr aluminium figure as guidance. The "mid-teens" growth guidance of May-2026 was overtaken by Q1\'s +36%. Our FY27E (+{{F.salesGrowth.0|n1}}%) assumes growth slows from Q2 as the base rises (Q3-Q4FY26 were ₹2,057-2,226 cr) and Sunbeam sheds revenue.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean audit, good cash conversion before capex; the issues are capital intensity and disclosure',
  blocks: [
    { bullets: [
      `**Cash conversion before capex is good.** Cash from operations (before interest, as Indian accounts show it) was ${Math.round(A.cfoToPat[b - 1])}% of net profit in FY25 and ${Math.round(A.cfoToPat[b])}% in FY26 (₹${n0(A.cfo[b])} cr), even after working capital absorbed ₹428 cr and ₹598 cr. Free cash flow after capex was ₹${n0(A.fcf[b - 1])} cr and ₹${n0(A.fcf[b])} cr: negative for two years.`,
      `**Other income has one-offs.** FY26 other income of ₹61 cr (AR) included a ₹14.3 cr gain on asset sales and a ₹27.4 cr forex gain as the rupee fell; only ~₹20 cr is recurring. Exceptional charges were ₹25.5 cr (FY25) and ₹13.0 cr (FY26). Our FY27E other income of ₹{{F.otherIncome.0|num}} cr leans on interest on the QIP cash (Q1FY27 ₹24 cr; four quarters to Jun-26 ₹${n0(oiCheck.ttm)} cr).`,
      '**Minorities:** until Jun-2024 Screener\'s Net Profit row included DR Axion\'s 24% minority; we use attributable profit ("Profit for EPS"), so FY24 profit is ₹304 cr, not ₹337 cr.',
      '**Capitalisation:** the auditors list capitalisation of property, plant and equipment as a key audit matter. With ₹1,000-1,500 cr of capex a year, what is capitalised versus expensed (trial runs, pre-operative costs, borrowing costs) moves profit; disclosure is standard, not detailed.',
      '**Disclosure:** segment EBIT and segment assets are reported, but not segment depreciation, entity results (Sunbeam, DR Axion), an order book or volumes outside aluminium tonnes.',
    ] },
    { callout: '**Accounting flag: GREEN.** Unmodified audit opinion (Sharp & Tannan), modest exceptional items, cash conversion before capex above 100%. The weakness is economic, not accounting: the business needs a lot of capital, and free cash flow has been negative for two years.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The founder and CMD, Srinivasan Ravi, owns 38.1% and the promoter group 42.4% in all (Jun-2026). Mutual funds own ${OH.categories.mutualFunds}%, foreign portfolio investors ${OH.categories.fpi}%, insurers ${OH.categories.insurance}% and retail and others ${OH.categories.retailAndOthers}%. ${rup(OH.trend)} The two QIPs went mainly to Indian funds and insurers (HDFC Flexi Cap took 16.5% of the 2026 issue).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders we can name', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p != null ? p + '%' : 'n.d.']), source: rup(OH.namedNote) } },
  { callout: '**Our read:** a founder-run company with a large and growing institutional base. Two points to watch: the founder sold ~2% (₹486 cr) at ~₹9,250 five days after the company issued shares at ₹8,700, and promoter ownership has fallen 12.6 points in just over two years. Neither is a red flag on its own (estate and diversification needs are common), but they sit awkwardly next to the "we will not need to come to the market again" message.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a capable founder-CEO, a small board and generous pay',
  blocks: [
    { p: rup(`${C.management.cmd} ${C.management.wtd} ${C.management.cfo} ${C.management.board} ${C.management.pay}`) },
    { verdicts: [
      ['Audit and accounts', 'Good', 'Sharp & Tannan; unmodified opinion; KAM on capitalisation of PPE', 'No accounting red flags'],
      ['Board', 'Moderate', '4 of 6 directors independent, but the CMD is also chairman and his son is a whole-time director', 'Typical promoter-led board'],
      ['Capital allocation', 'Watch', 'Sunbeam bought loss-making (₹232 cr pro forma pre-tax loss); ROCE down from ~20% to 12-14%; two QIPs in two years', 'Growth first, returns later'],
      ['Pay', 'Watch', 'CMD ₹11.9 cr (+112%, 169x the median employee) and WTD ₹4.0 cr in FY26, when PAT rose 97% from a depressed FY25', 'High for the profit level; commission-linked'],
      ['Promoter conduct', 'Watch', 'CMD block sale of 2% at ~₹9,250 on 23-Jun-2026, after the QIP at ₹8,700', 'Legal and disclosed; optics poor'],
      ['Disclosure', 'Moderate', 'Candid calls; segment data; no entity or order-book data', 'Turnaround claims hard to verify'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (corporate governance report, remuneration annexure, auditors\' report); exchange filings (Jun-2026)' },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n0}} / ₹{{F.eps.1|n0}} / ₹{{F.eps.2|n0}} on post-QIP shares, below the street',
  blocks: [
    { p: `We build revenue and EBIT by segment (see the segment chapters) and add back depreciation to reach EBITDA: powertrain +${BL.ptGrowth.join('% / +')}% at ${BL.ptMargin.join('% / ')}% EBIT; aluminium +${BL.alGrowth.join('% / +')}% at ${BL.alMargin.join('% / ')}%; industrial +${BL.ieGrowth.join('% / +')}% at ${BL.ieMargin.join('% / ')}%; unallocated costs ₹${BL.unallocated.join(' / ')} cr. Capex ₹${AS.capex.join(' / ')} cr; depreciation ${AS.depRateOnGrossBlock}% of gross block (~₹{{F.dep.0|num}} cr in FY27E); interest ₹${AS.interest.join(' / ')} cr; other income ₹${AS.otherIncome.join(' / ')} cr; tax ${AS.taxRate.join(' / ')}%; payout ${AS.payout[0]}%. All per-share numbers use the 2.6154 cr shares outstanding after the Jun-2026 QIP (FY26 pro forma EPS ₹146.8; reported ₹161.0).` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (actuals incl. exceptional items)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹; FY26 pro forma)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, Screener.in, GAM Research estimates. FY26 EPS and net worth pro forma for the Jun-2026 QIP.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'Revenue FY27E', 'Revenue FY28E', 'EBITDA FY28E', 'EPS FY27E (₹)', 'EPS FY28E (₹)', 'EPS FY29E (₹)'], rows: [
      ['Emkay (31-Jul-2026)', '9,734', '11,144', '1,966', '252.3', '348.9', '422.7'],
      ['Motilal Oswal (30-Jul-2026)', '9,990', '11,760', 'n.d.', '250.7', '346.4', 'n.d.'],
      { hl: true, cells: ['**GAM Research**', '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.eps.0|n1}}**', '**{{F.eps.1|n1}}**', '**{{F.eps.2|n1}}**'] },
    ], source: 'Emkay result note (31-Jul-2026, ₹ mn converted); DSIJ summary of the MOSL note (30-Jul-2026); GAM Research' } },
    { callout: `**Where we differ:** our revenue is close to the street, our EPS is ~${Math.round((1 - F.eps[1] / 347.6) * 100)}% lower for FY28E. Three reasons: (1) EBITDA margin: we model {{F.ebitdaMargin.1|pct}} for FY28E vs Emkay's 17.6%, because new plants and large-engine lines will run below capacity; (2) depreciation: ₹1,500 cr of capex lifts it to ~₹{{F.dep.1|num}} cr in FY28E; (3) interest: we keep ₹${AS.interest[1]} cr as capex keeps net debt at ~₹2,200-2,500 cr, while the street's EPS implies lower depreciation and interest than ours (its notes do not show the split). On Emkay's EPS (Sep-28E ₹${n1((348.9 + 422.7) / 2)}) our ${MULT.base}x would give ~₹${n0(Math.round(MULT.base * (348.9 + 422.7) / 2 / 10) * 10)}: still below the share price.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
