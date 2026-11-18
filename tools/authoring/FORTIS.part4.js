// Fortis report, part 4: Q1FY27 & guidance, earnings quality, ownership, management & governance.
const X = require('./FORTIS.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, b, shortDate } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +17.5%, margin down; the 25% FY28 target now has to absorb the ESOP',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Consolidated revenue', n0(Q1.consRevenuePrior), n0(Q1.consRevenue), pc(Q1.revenueYoYPct)],
      ['  Hospitals', n0(Q1.hospRevenuePrior), n0(Q1.hospRevenue), '+19%'],
      ['  Diagnostics (gross)', n0(Q1.diagGrossPrior), n0(Q1.diagGross), '+10%'],
      ['Occupied beds / occupancy', `${n0(Q1.occupiedBedsPrior)} / ${Q1.occupancyPriorPct}%`, `${n0(Q1.occupiedBeds)} / ${Q1.occupancyPct}%`, '+17% / −0.3pp'],
      ['ARPOB (₹ cr per year, gross)', Q1.arpobPriorCr.toFixed(2), Q1.arpobCr.toFixed(2), '+2.6%'],
      ['Hospital operating EBITDA (before ESOP)', n0(Q1.hospOpEbitdaPrior), n0(Q1.hospOpEbitda), '+16%'],
      ['  margin', `${Q1.hospOpMarginPriorPct}%`, `${Q1.hospOpMarginPct}%`, '−60bp'],
      ['Diagnostics operating EBITDA', n0(Q1.diagOpEbitdaPrior), n0(Q1.diagOpEbitda), '+14%'],
      ['  margin', `${Q1.diagOpMarginPriorPct}%`, `${Q1.diagOpMarginPct}%`, '+90bp'],
      ['ESOP charge (new)', '–', n0(Q1.esop), ''],
      ['Consolidated EBITDA after ESOP (Screener)', '491', '537', '+9%'],
      { hl: true, cells: ['**Net profit to owners**', `**${n1(Q1.patOwnersPrior)}**`, `**${n1(Q1.patOwners)}**`, '**+2%**'] },
    ], source: 'Q1FY27 presentation (6-Aug-2026) and call (7-Aug-2026); Screener.in' } },
    { bullets: [
      '**Why profit grew only 2%:** the first ESOP charge (₹31 cr for ~10 weeks), new units still below 10% margin (Yeshwanthpur, Manesar, Greater Noida; −0.4pp of margin), higher legal costs from the Delhi High Court hearings, more provisions for slow government and insurer payments, depreciation +20% and interest +16% after FY26\'s acquisitions.',
      '**Growth quality:** occupied beds +17% and ARPOB +2.6%; like-for-like hospital margin ~22%, flat. Oncology slowed to ~5% growth (share 14.4% vs 16.4%) because of the CGHS/ECHS chemotherapy price cap; renal +28%, neuro +27%, ortho +23%.',
      '**Agilus:** +10% with realisation per test +7% and tests +3%; margin 23.9%. New CEO from Jul-2026.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-Sep 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: rup(C.guidanceSrc) } },
    { callout: '**Why it matters:** in May the hospital margin was to rise 150-200bp in FY27 and reach 25% by FY28; in August the CFO said the 25% is now "after running the ESOP cost" (worth ~1.2pp in FY28). That makes the target harder, not easier: from 20.1% after ESOP in Q1FY27 to 25% in FY28 needs ~5pp in under two years. We assume 22.2% after ESOP in FY28E (23.4% before it).' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: cleaner than its history, but read the minority, ESOP and exceptional lines',
  blocks: [
    { bullets: [
      '**Three EBITDA numbers.** Company "operating EBITDA" (₹2,085 cr in FY26) excludes other income and, from Q1FY27, the ESOP charge; "reported EBITDA" in the P&L appendix includes other income, FX and one-offs (₹2,136 cr). Screener\'s operating profit equals revenue minus expenses, i.e. after ESOP. We model segments before ESOP and deduct the ESOP separately, so model EBITDA matches Screener.',
      '**Leases are small.** Post-Ind AS 116 rent sits in depreciation (₹85 cr right-of-use amortisation) and interest (₹41 cr); lease liabilities are ₹600 cr (₹616 cr at Jun-2026). Pre-Ind AS EBITDA would be ~₹100 cr (1.1pp of revenue) lower. Brokers use reported (post-Ind AS) EBITDA, as we do; leases sit in our net debt.',
      '**Minorities.** 11.68% of Agilus belongs to others: ₹22 cr of FY26 profit (₹235 cr in FY22, before the buyout). We use profit attributable to owners throughout (FORTIS.patch.js) and deduct the Agilus minority in the valuation.',
      '**Exceptional items every year.** FY25 −₹89 cr (associate and asset impairments, partly offset by the Richmond Road gain), FY26 −₹22 cr (Labour Codes ₹55 cr less a ₹33 cr reversal of an associate impairment), Q1FY27 +₹9.5 cr. Screener books them in other income; our forecasts assume none.',
      '**Doctor fees sit outside staff cost.** Professional fees to doctors were ₹1,950 cr (21.4% of revenue) in FY26, on top of ₹1,297 cr (14.2%) of employee cost.',
      `**Cash conversion.** Operating cash flow was ${Math.round(A.cfoToEbitda[b])}% of EBITDA in FY26 (${Math.round(A.cfoToEbitda[b - 1])}% in FY25); receivable days rose from 33 (FY24) to 42 (FY26) on slower government and insurer payments.`,
      '**Goodwill.** ₹4,722 cr (35% of capital employed) from the RHT buyback, SRL/Agilus and FY26 deals; tested every year (key audit matter). Impairments have hit associates (Lanka Hospitals, RHT), not the core.',
      '**Audit.** B S R & Co. (KPMG network); unqualified, with an Emphasis of Matter on the SFIO investigation and other legacy matters from the former promoters\' era.',
    ] },
    { callout: '**Accounting flag: AMBER.** The current numbers are well disclosed (segment and hospital-band KPIs every quarter) and cash-backed. Amber because of recurring exceptional items, a new non-cash ESOP charge excluded from the headline "operating EBITDA", a legacy SFIO investigation in the audit report, and rising receivable days.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `IHH Healthcare owns ${OH.categoriesPct.promoter}% through Northern TK Venture (Jun-2026), with no pledge; it has held exactly the shares it subscribed in 2018 because its open offer was frozen by the courts until 2025 and then priced at ₹170, far below the market. Indian institutions own ${OH.categoriesPct.dii}% (mutual funds ${OH.categoriesPct.mf}%, insurers ${OH.categoriesPct.insurance}%), up from 29.8% a year earlier; foreign investors ${OH.categoriesPct.fii}% (27.2% in Jun-2025); the public ${OH.categoriesPct.public}%. ${rup(OH.ihhPlan)}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake', 'Type'], wide: [0], rows: [
    [OH.promoter.name, OH.promoter.pct + '%', 'Promoter; no pledge'],
    ...OH.institutions.map(h => [h.name, h.pct.toFixed(2) + '%', h.type]),
  ], source: rup(OH.src) } },
  { callout: '**Our read:** a strategic parent with a minority stake (31%) but full board control (five of nine directors are IHH nominees) and stated ambitions to reach ~50%. Free float is ~69% and liquid, owned mostly by Indian mutual funds (HDFC and Kotak alone hold 12%). The big ownership question is how IHH gets to 50%: a preferential issue at market (neutral), a Gleneagles merger (depends on the swap ratio; minorities get a vote), or creeping purchases.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: professional management under IHH, but the legacy is not over',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Adequate', 'B S R & Co.; unqualified with an Emphasis of Matter on legacy SFIO matters; detailed segment and hospital-band disclosure.', 'Current numbers credible; legacy noise remains.'],
      ['Controlling shareholder', 'Mixed', 'IHH (31.17%, five of nine board seats) brought capital and governance since 2018; it also owns Gleneagles India, which Fortis manages (3% fee) and may merge with.', 'Aligned on growth; related-party terms need watching.'],
      ['Legal overhang', 'Weak', 'Delhi High Court forensic audit (31-Aug-2026) of the 2018 IHH deal, the RHT buyback and Fortis officers\' role; Supreme Court declined to interfere (25-Sep-2026); SFIO, EOW and ED probes of the former promoters\' era continue.', 'Six months or more of uncertainty; ~₹25 cr a year of legal costs.'],
      ['Board independence', 'Weak', '3 independent directors of 9 (one-third, the legal minimum with an independent chair); IHH nominees hold 5 seats.', 'Minority interests depend on the independent chair and audit committee.'],
      ['Management', 'Strong', 'MD & CEO Dr Ashutosh Raghuvanshi has led the IHH-era turnaround (margin 13% in FY20 → 23% in FY26); stable CFO. Pay ₹10.3 cr (216x median).', 'Credible operators; guidance has mostly been met until the ESOP change.'],
      ['Capital allocation', 'Watch', 'Agilus buyout at ~16x forward EBITDA (good price), two hospital buys (₹892 cr) and ~₹1,150-1,250 cr a year of capex; dividend only ₹1 a share.', 'Sensible so far; M&A "actively pursued".'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26; calls May-Sep 2026; court reports)' },
  ],
};

module.exports = { guidance, quality, ownership, governance };
