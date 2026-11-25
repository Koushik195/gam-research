// EIH report, part 4: Q1FY27 & outlook, earnings quality, ownership, governance.
const X = require('./EIHOTEL.ctx');
const { C, D, n0, n1, Q1, FY26 } = X;
const G = C.guidance, AC = C.accounting, MN = C.management, MI = C.minorities;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & outlook', kicker: 'Momentum', title: 'Q1FY27: revenue +15%, operating EBITDA +4%, margin down 2.5 points; no guidance, but Q2 bookings "very positive"',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, consolidated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '574', n0(Q1.revenueOp), `+${Q1.revenueGrowthPct}%`],
      ['  of which flight catering (OFS)', 'n.d.', String(Q1.ofsRev), '"very healthy"'],
      ['Operating EBITDA / margin', `${Q1.opEbitdaPy} / 27.9%`, `${Q1.opEbitda} / ${Q1.opEbitdaMarginPct}%`, `+${Math.round((Q1.opEbitda / Q1.opEbitdaPy - 1) * 100)}% / −2.5 pp`],
      ['Company "EBITDA" (incl. other income)', String(Q1.ebitdaCompanyPy), String(Q1.ebitdaCompany), '+6%'],
      ['Share of associates and JVs', '8', String(Q1.associates), ''],
      ['Exceptional items (Mashobra)', '(110)', '–', ''],
      ['Profit before tax / tax', '54 / 17', `${Q1.pbt} / ${Q1.tax}`, ''],
      { hl: true, cells: ['**Profit attributable to owners / EPS (₹)**', '**34 / 0.54**', `**${Q1.patAttributable} / ${Q1.eps}**`, '**3.4x (last year had the Mashobra charge)**'] },
      ['Owned-hotel RevPAR (₹)', n0(Q1.ownedRevparPy), n0(Q1.ownedRevpar), `+${Math.round((Q1.ownedRevpar / Q1.ownedRevparPy - 1) * 100)}%`],
      ['Surplus funds (₹ cr)', '1,335 (Mar-26)', n0(Q1.surplusFunds), `CFO ₹${Q1.cfo} cr, capex ₹${Q1.capex} cr`],
    ], source: 'Q1FY27 deck (12-Aug-2026) slides 8, 16-19; Q1FY27 call; Screener.in (n.d. = not disclosed)' } },
    { bullets: [
      `**What went right:** occupancy and rates both rose; owned RevPAR +${Math.round((Q1.ownedRevpar / Q1.ownedRevparPy - 1) * 100)}%; Trident +${Q1.tridentRevparGrowthPct}% (Mumbai MICE); RGI ${Q1.rgi} vs ${Q1.rgiPy}; flight catering grew on new domestic and direct international flights; domestic demand offset a ~10% fall in foreign guests.`,
      `**What went wrong:** operating margin ${Q1.opEbitdaMarginPct}% vs 27.9%. Management listed Rajgarh's summer ramp-up (like-for-like margin ex-Rajgarh ${Q1.lflMarginExRajgarhPct}% on its basis), ~₹${Q1.extraMarketing} cr of extra marketing, IT spending, ₹${Q1.renovationWriteOff} cr of renovation write-offs, higher power and fuel costs (Hormuz), and higher staff costs (headcount, increments, the labour codes and a deliberate cut in working hours). Hotel F&B grew only ~6-7%.`,
      `**Outlook (12-Aug-2026):** ${G.outlook} ${G.margins}`,
    ] },
    { exhibit: { type: 'table', title: 'What management said (May-Aug 2026)', head: ['Topic', 'What was said'], wide: [1], rows: [
      ['Demand and FY27', G.outlook], ['Margins and renovations', G.margins], ['Capex', G.capex], ['Rajgarh', G.rajgarh], ['Pipeline', G.pipeline],
      ['The Oberoi Grand', C.portfolio.grandReopening],
      ['Wildflower Hall', 'Qualifying-bid date moved from 26-Aug to 10-Sep-2026, then a live auction; no other comment (12-Aug-2026 call).'],
    ], source: 'Q4FY26 call (29-May-2026); Q1FY27 call (12-Aug-2026); CARE (15-Dec-2025)' } },
    { callout: '**Why it matters:** Q1 is EIH\'s smallest quarter (~20% of the year), so a 2.5-point margin miss costs ~₹16 cr. The test is H2, when renovations are done, Rajgarh has its first full winter and, management hopes, foreign guests return. Our FY27E margin of {{F.ebitdaMargin.0|pct}} assumes H2 margins close to last year\'s; a repeat of Q1\'s miss in the peak quarters would cut FY27E EBITDA by ~₹60-80 cr.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: real cash and clean debt, but one-offs almost every year and an "EBITDA" that includes other income',
  blocks: [
    { bullets: [
      `**Exceptional items.** ${AC.exceptional} FY26 reported attributable profit ₹${n0(FY26.patAttributable)} cr vs ₹${n0(FY26.patBeiAttributable)} cr before exceptional items (Screener) or ₹${n0(FY26.patBeiCompany)} cr before minorities on the company's own measure. We value and forecast before exceptional items.`,
      `**Definitions.** ${AC.ebitdaDefinition} We use operating EBITDA throughout, as Screener and the peers do.`,
      `**Political donation.** ${AC.donation}`,
      `**Minorities.** Small: ₹${MI.fy26} cr in FY26 (${MI.pctOfProfitFy26}% of profit before minorities), ₹${MI.q1fy27} cr in Q1FY27; partners hold 40% of Svara Hotels (Amarvilas, Agra), 20% of Oberoi Kerala Hotels and 10-40% of the Indonesian companies.`,
      `**Renovations.** ${AC.renovation}`,
      `**Cash conversion.** Operating cash ${Math.round(X.A.cfoToEbitda[X.b])}% of operating EBITDA in FY26 (${Math.round(X.A.cfoToEbitda[X.b - 1])}% in FY25); company surplus funds up ₹284 cr in FY26 after ₹680 cr of capex and ₹97 cr of dividends.`,
    ] },
    { callout: '**Accounting flag: AMBER.** The cash is real (no bank debt, ~₹1,340 cr net cash, AA+), and nothing in the accounts is aggressive. But exceptional items appear in five of the last six years, the company headlines an EBITDA that includes other income (16% higher than operating EBITDA in FY26), the FY26 profit before exceptional items differs by ₹64 cr between the company and Screener (tax on the Mashobra items), and a ₹30 cr political donation sits inside operating costs.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Oberoi family owns ${OH.categoriesPct.promoter}% through four private companies and two family members (Jun-2026); no pledge. Two strategic shareholders hold another 35%: **Reliance Strategic Business Ventures** (Reliance Industries) ${OH.strategic[0][1]}% and **ITC Ltd** ${OH.strategic[1][1]}%; both are classified as public. Mutual funds own ${OH.categoriesPct.mf}% (Nippon India Multi Cap alone 5.0%), foreign investors ${OH.categoriesPct.fii}%, insurers ${OH.categoriesPct.insurance}%; ${n0(OH.shareholders)} shareholders in all. The truly tradable float is therefore only ~32% of the company.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (Jun-2026)', head: ['Holder', 'Type', '% of shares'], rows: [
    ...OH.promoterVehicles.map(h => [h[0], 'Promoter group', h[1] + '%']),
    ...OH.strategic.map(h => [h[0], 'Strategic (public category)', h[1] + '%']),
    ...OH.institutions.map(h => [h[0], 'Institution', h[1] + '%']),
  ], source: OH.src } },
  { callout: '**Our read:** an unusual register. Three large holders (the family, Reliance, ITC) own ~68%, which makes the stock less liquid and gives any change in the strategic stakes outsized weight. CARE noted media reports of a dispute over the promoter shareholding within the family (under legal consideration); nothing in the filings to 30-Sep-2026 changes the 32.85% holding, but it is a monitorable.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: an excellent operator run by the family; pay, a promoter royalty, a political donation and a succession dispute need watching',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role'], rows: [...MN.board, ...MN.kmp], source: 'AR FY26' } },
    { verdicts: [
      ['Board and promoter', 'Mixed', 'Executive Chairman and MD & CEO are both Oberois; five independent directors and a Reliance-linked director (Nita M. Ambani); P.R.S. Oberoi\'s succession in 2023; family dispute reported (CARE).', 'Family control is long-term but concentrated.'],
      ['Pay', 'Watch', `Executive Chairman ₹${MN.pay.chairmanCr} cr and MD & CEO ₹${MN.pay.ceoCr} cr in FY26 (${MN.pay.chairmanToMedian}:1 and ${MN.pay.ceoToMedian}:1 to the median employee, whose pay fell ${Math.abs(MN.pay.medianPayChangePct)}%).`, 'High for a ₹2,940 cr revenue company.'],
      ['Related parties', 'Watch', MN.royalty, 'Brand value partly paid to the family outside EIH.'],
      ['Political donation', 'Watch', '₹30 cr to a political party in FY26 (AR note 36), ~5% of FY26 reported profit.', 'Legal, disclosed, but shareholders\' money.'],
      ['Balance sheet discipline', 'Strong', 'No bank debt since FY24; CARE AA+ (Stable); capex funded from cash flow.', 'Room to build without diluting.'],
      ['Execution', 'Average', 'Gandikota delayed two years (site change), the Grand restoration delayed by structural work and a Kolkata construction halt, managed openings slipping to 2029-30; Rajgarh and the Delhi renovation done well.', 'Pipeline dates need a discount.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; company calls; CARE (15-Dec-2025); GAM Research' },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts: require('./EIHOTEL.part4b').forecasts };
