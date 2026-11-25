// Caplin Point report, part 4: Q1FY27 and guidance, earnings quality, ownership, management and governance (incl. the CCPS).
const X = require('./CAPLIPOINT.ctx');
const { C, D, A, b, ix, n0, n1, pc, Q1, FY26, CC, SHARES, ccpsEps26, epsRep, OIN } = X;
const g = (a, z) => pc((z / a - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: revenue +20%, profit +16%; cash flow weak on a deliberate stock build; no numeric guidance beyond the US',
  blocks: [
    { p: `Q1FY27 (reported 12-Aug-2026): revenue ₹${n0(Q1.revenue)} cr (${g(Q1.revenuePrev, Q1.revenue)} YoY, ${g(Q1.revenueQ4, Q1.revenue)} QoQ); Rest of World ₹${n0(Q1.row)} cr (${g(Q1.rowPrev, Q1.row)}), USA ₹${n0(Q1.us)} cr (${g(Q1.usPrev, Q1.us)}). Gross margin ${Q1.grossMarginPct}% (−190bp YoY; the US carries lower gross margins) but operating costs fell to 23.6% of sales, so EBITDA before other income rose ~20% to ₹${n1(Q1.ebitdaScreener)} cr (${Q1.ebitdaMarginPct}%). Other income +45% to ₹${n1(Q1.otherIncome)} cr; depreciation +33% (oncology plant, Line 6, Vizag); tax ${Q1.etrPct}%. Profit ₹${n1(Q1.pat)} cr (+19%), ₹${n1(Q1.patOwners)} cr to shareholders (+16%; minorities swung from −₹2.0 cr to +₹2.2 cr); EPS ₹${Q1.eps}. **Cash:** operating cash flow ₹${Q1.cfo} cr (₹118 cr a year earlier) after inventory rose ₹76 cr to ₹${Q1.inventory} cr ("at least 2.5x" a quarter's sales, a buffer against the Middle East war) and receivables ₹46 cr (government supplies, to be collected by Q3FY27); capex ₹${Q1.capex} cr, free cash flow ₹${Q1.fcf} cr. Free cash ₹${n0(Q1.freeCash)} cr (₹${n0(Q1.freeCashPrev)} cr a year earlier).` },
    { exhibit: { type: 'table', title: 'What management said (no formal guidance)', head: ['What was said', 'Who / when'], wide: [0], rows: C.guidance.map(gd => [gd.what, `${gd.who}, ${gd.published.split('-').reverse().join('-')}`]), source: 'Q4FY26 call (14-May-2026), Q1FY27 call and results (12-Aug-2026), ICICI Direct Q3FY26 call notes (6-Feb-2026)' } },
    { pair: [
      { type: 'column', title: 'Q1FY27 vs Q1FY26 (₹ crore)', unit: '₹ crore', x: ['Revenue', 'Gross profit', 'EBITDA (pre-OI)', 'Other income', 'PBT', 'Profit to owners'], series: [{ name: 'Q1FY26', values: [Q1.revenuePrev, 315.0, 177.8, Q1.otherIncomePrev, Q1.pbtPrev, Q1.patOwnersPrev].map(Math.round), fmt: 'num' }, { name: 'Q1FY27', values: [Q1.revenue, 365.2, Q1.ebitdaScreener, Q1.otherIncome, Q1.pbt, Q1.patOwners].map(Math.round), fmt: 'num' }], labels: 'all', source: 'Q1FY27 results and presentation; ICICI Direct' },
      { type: 'column', title: 'Operating cash flow dipped on the stock build', unit: '₹ crore', x: ['Q1FY26', 'Q1FY27'], series: [{ name: 'CFO', values: [118, Q1.cfo], fmt: 'num' }, { name: 'Capex', values: [65, Q1.capex], fmt: 'num' }, { name: 'FCF', values: [53, Q1.fcf], fmt: 'num' }], labels: 'all', source: 'Q1FY27 press release' },
    ] },
    { callout: '**Read-across:** a clean quarter on growth, a soft one on cash. Two quarters matter next: Q2 (whether receivables start coming back and Rest of World growth holds after the tender) and Q4 (Line 7). The US growth guidance (25-30%) is the only number management commits to; everything else is aspiration ("top 20 companies of the country").' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean P&L, but cash conversion of ~80%, rising working capital and a CCPS that reported EPS ignores',
  blocks: [
    { p: `Caplin's P&L is simple: no exceptional items, no capitalised interest, modest capitalised R&D (₹${n1(FY26.rndCapex)} cr in FY26). Four things deserve attention. **(1) Cash conversion:** operating cash flow was ₹${FY26.cfo} cr in FY26 against ₹${n0(FY26.pat)} cr of profit (80%, management's own figure); over FY22-26, CFO was ${Math.round(['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].reduce((s, f) => s + A.cfo[ix(f)], 0) / ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].reduce((s, f) => s + A.pat[ix(f)], 0) * 100)}% of attributable profit. Receivables rose from 91 to 138 days (Screener) and inventory from 149 to 181 days over FY22-26. **(2) Currency:** a ₹${n0(FY26.balance.fctrGain)} cr translation gain went straight to reserves in FY26 (net worth +₹${FY26.balance.netWorthIncrease} cr); 11 of 136 receivable days were translation. FX gains in the P&L were ₹${n1(OIN.fx)} cr. **(3) Other income:** ₹${n1(OIN.total)} cr in FY26 (15% of PBT), of which ₹${n1(OIN.realisedGain)} cr were realised gains on investments (₹${n1(OIN.prev.realisedGain)} cr in FY25). **(4) The CCPS:** Caplin Steriles' CCPS (₹${n1(CC.total)} cr from Eight Roads and F-Prime) are shown as Caplin Point's own equity and receive no share of profit in the accounts, yet convert into at least ${CC.minStakePct}% of Caplin Steriles. At the minimum stake, ₹${n1(FY26.lines.cslPat * CC.minStakePct / 100)} cr of FY26 profit (₹${n1(ccpsEps26)} a share, ${n1(ccpsEps26 / epsRep[2026] * 100)}% of EPS) economically belongs to the holders; the share grows as the US grows.` },
    { exhibit: { type: 'table', title: 'Earnings-quality checklist', head: ['Test', 'FY26', 'Verdict'], wide: [1], rows: [
      ['CFO / attributable profit', `${Math.round(FY26.cfo / FY26.patOwners * 100)}%`, 'Below 100% for five years: working capital absorbs cash'],
      ['Receivable days (Screener)', `${A.debtorDays[b]}`, 'Rising (91 in FY22); government tenders'],
      ['Inventory days (Screener)', `${A.inventoryDays[b]}`, 'High by design (stock-and-sale)'],
      ['Other income / PBT', `${n1(OIN.total / FY26.pbt * 100)}%`, 'Material; FX and fund gains vary'],
      ['Exceptional items', 'None reported', 'Screener tags ~₹13 cr of FY26 other income as exceptional'],
      ['Capitalised R&D', `₹${n1(FY26.rndCapex)} cr`, 'Small (21% of R&D)'],
      ['Minorities / unattributed claims', `₹${n1(FY26.nci)} cr NCI; CCPS claim ≥₹${n1(FY26.lines.cslPat * CC.minStakePct / 100)} cr`, 'The CCPS claim is not in reported EPS'],
      ['Auditor', 'Brahmayya & Co. (Chennai)', 'Unmodified; relies on other auditors for subsidiaries with ₹591.5 cr of Q1FY27 revenue (before eliminations)'],
    ], source: 'AR FY26; Screener.in; Q1FY27 auditor review report; GAM' } },
    { callout: '**Accounting flag: AMBER.** Nothing looks manipulated, but reported profit runs ahead of cash, currency moves flatter both revenue and net worth, and the CCPS treatment overstates the shareholders\' slice of Caplin Steriles.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `At Jun-2026 the founder's family held ${D.ownership.promoters}% (unchanged for three years and no pledges disclosed): ${D.ownership.promoterNames.map(([nm, s]) => `${nm} ${s}%`).join(', ')}. Foreign investors held ${D.ownership.fii}% (${D.ownership.fpiCount} FPIs), domestic institutions ${D.ownership.dii}% (mutual funds ${D.ownership.mf}% across ${D.ownership.mfSchemes} schemes; UTI Multi Cap Fund ${D.ownership.others[0][1]}% and PineBridge India Equity Fund ${D.ownership.others[1][1]}% at Mar-2026) and ${n0(D.ownership.holders)} other shareholders ${D.ownership.public}%. The free float is under 30%, so the stock is thinly held by institutions and can move sharply. Separately, Eight Roads Ventures (70%) and F-Prime Capital (30%) own the CCPS in Caplin Steriles, not shares of Caplin Point.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholders (Jun-2026; named promoters at Mar-2026)', head: ['Holder', '% of shares'], rows: [...D.ownership.promoterNames.map(([nm, s]) => [nm, s + '%']), ['**Promoter group**', `**${D.ownership.promoters}%**`], ['Foreign portfolio investors', D.ownership.fii + '%'], ['Domestic institutions (MFs 2.03%)', D.ownership.dii + '%'], ['Public and others', D.ownership.public + '%']], source: D.ownership.src } },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a frugal, founder-run family company; modest pay, few related-party dealings, but an awkward CCPS and little disclosure',
  blocks: [
    { p: `C.C. Paarthipan (founder, Chairman) draws no salary; his sons Ashok (Latin America) and Vivek (US) are non-executive vice-chairmen paid nothing by the company (Ashok received ₹2.65 cr as a related party through the group; Vivek ₹0.12 cr as COO until Nov-2025). The professional team is small and long-serving: Dr Sridhar Ganesan (MD since 2014, reappointed for two years from 25-Aug-2026, ₹0.57 cr) and D. Muralidharan (CFO since 2016, made Whole-Time Director on 12-Aug-2026, ₹0.60 cr). Related-party dealings are small (rent and consultancy to promoter-linked Ashvich Infotek and Ashvich Properties, ~₹3.7 cr; CSR trust ₹1 cr). The board has six independent directors. **The flags:** the CCPS in Caplin Steriles (₹${n1(CC.total)} cr; at least ${CC.minStakePct}% of the US business on conversion in ~2038, with exit and anti-dilution rights) are presented as Caplin Point's own equity, which flatters both book value and EPS; disclosure is thin (no country revenue, no capacity data, no guidance); calls are dominated by the Chairman's philosophy; the Guatemala distributor is only 69% owned; and the US plant now carries a 10-observation Form 483.` },
    { verdicts: [
      ['Founder and family', 'Moderate', 'Founder chairs; two sons run the two businesses as non-executive vice-chairmen', 'Continuity; key-person and succession questions'],
      ['Pay', 'Strong', 'Chairman nil; MD ₹0.57 cr; CFO ₹0.60 cr; managerial pay unchanged in FY26', 'Unusually frugal'],
      ['Related parties', 'Strong', 'Rent and consultancy ~₹3.7 cr; CSR trust ₹1 cr (₹12.2 cr in FY25)', 'Small'],
      ['Capital structure / CCPS', 'Weak', `₹${n1(CC.total)} cr CCPS in Caplin Steriles shown as owners' equity; ≥${CC.minStakePct}% of CSL on conversion; no profit attributed`, 'Overstates shareholders\' economic share'],
      ['Audit', 'Moderate', 'Brahmayya & Co.; subsidiaries with ₹591.5 cr of Q1FY27 revenue (before eliminations) reviewed by other auditors', 'Adequate; not a Big Four'],
      ['Disclosure', 'Weak', 'No country or product revenue, no capacity data, no numeric guidance except US growth', 'Hard to model the core'],
      ['Promoter selling / pledge', 'Strong', '70.6% for three years; no pledge disclosed', 'Aligned'],
    ], head: ['Factor', 'Score', 'Evidence', 'So what'], title: 'Governance scorecard: three strong, two moderate, two weak', source: 'AR FY26 (Annexure V, notes 15-16, 43); AR FY19 note 13; Q1FY27 board outcome' },
    { exhibit: { type: 'table', title: 'Board and key managers', head: ['Name', 'Role', 'Note'], wide: [1, 2], rows: C.management, source: C.managementSrc } },
  ],
};

module.exports = { guidance, quality, ownership, governance };
