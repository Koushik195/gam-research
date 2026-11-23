// Torrent Pharma report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./TORNTPHARM.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, DEAL, YRS, LINES, LBL, BL, build, buildTot, oiTreas, FX, MISC, GROSS_CASH, TY, adjEps, epsU, ppaPat, pl_, idir, mosl, shortDate, SHARES, intBuild } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +55%, base business +17%, JB margin 35%; EPS down 8% on the new share count',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '3,178', n0(Q1.revenue), `+${Q1.revenueYoYPct}%`],
      ['  Torrent base business', '3,178', n0(Q1.base.revenue), `+${Q1.base.revenueYoYPct}%`],
      ['  JB (first full quarter)', '–', n0(Q1.jb.revenue), `+${Q1.jb.revenueYoYPct}% vs JB a year ago`],
      ['  India / Brazil / US / Germany / others', '1,811 / 218 / 308 / 308 / 533', '2,890 / 277 / 418 / 318 / 1,018', '+60% / +27% / +36% / +3% / +91%'],
      ['EBITDA', '1,032', n0(Q1.ebitda), `+${Q1.ebitdaYoYPct}%`],
      ['  margin: group / Torrent base / JB', '32.5% / 32.5% / 28.8%', `${Q1.ebitdaMarginPct}% / ${Q1.base.ebitdaMarginPct}% / ${Q1.jb.ebitdaMarginPct}%`, ''],
      ['Depreciation & amortisation (incl. ~₹335 cr JB brands)', '201', n0(Q1.dep), '×3'],
      ['Interest', '56', n0(Q1.interest), '×5'],
      ['Other income / exceptional items', '−37 / 0', `${Q1.otherIncome} / ${Q1.exceptional}`, ''],
      ['Tax rate', '25.7%', `${Q1.taxPct}%`, ''],
      { hl: true, cells: ['**Profit to shareholders**', '**548**', `**${Q1.pat}**`, `**+${Q1.patYoYPct}%**`] },
      ['EPS (₹; Q1FY27 on the post-merger share count)', '16.19', `${Q1.eps}`, '−8%'],
    ], source: 'NSE results filing (30-Jul-2026); Q1FY27 call; PL and ICICI Direct result notes (31-Jul-2026)' } },
    { bullets: [
      '**India +19% organic** (₹2,157 cr; market +12%): volume, price and new launches all ahead of the market; semaglutide ~₹50 cr with 36% share; Curatio +34%.',
      '**Brazil +3% in BRL** (+27% in rupees): a one-off channel destocking; underlying 15-18% and IQVIA +19% vs market +4%.',
      `**US +${Q1.usCcPct}% in dollars** ($${Q1.usUsdMn} mn) with one-offs; **Germany ${Q1.germanyCcPct}%** in EUR (supplier failure, lost tenders).`,
      `**Leverage** fell to ${Q1.netDebtToEbitda}x net debt/EBITDA on combined underlying EBITDA (2.3x at Mar-26).`,
      '**Why EPS fell:** JB brand amortisation (~₹335 cr a quarter) and interest on the acquisition debt (~₹250 cr a quarter) cost more than JB\'s EBITDA adds, and the share count rose 12.4%.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (Jun-2025 to Jul-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: rup(C.guidanceSrc) } },
    { callout: '**Why it matters:** management has under-promised on JB (synergies ahead, merger six months early) and delivered on India. The two soft spots are outside its control in the short run: German supply and Brazil\'s regulator. The CFO declined to give full-year margin guidance until the merged company "settles"; Q2FY27, the first quarter of JB brand transfers, is the test.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: good cash conversion, but read four things carefully after the deal',
  blocks: [
    { bullets: [
      `**Acquisition amortisation.** JB's brands (₹19,627 cr), customer relationships (₹940 cr) and licences (₹124 cr) are amortised over up to 15 years: ~₹1,340 cr a year, ₹257 cr in the 70 days of FY26 and ~₹335 cr in Q1FY27. It is not tax-deductible; a deferred-tax credit of ~₹337 cr a year offsets part of it, so it costs ~₹1,000 cr a year of reported profit (~₹26 a share) but no cash. Torrent's older brand amortisation (~₹543 cr a year in FY24-25) was already in its history.`,
      '**Three EPS bases.** FY26 reported EPS ₹63.92 is on 33.84 cr shares with a 51.2% minority in JB; Q1FY27 EPS ₹14.87 is on the post-merger count (Screener shows ₹16.72); our FY26 pro forma (₹35.0) has JB for a full year with a full year of amortisation and deal interest. Growth rates across these bases mean little.',
      `**Hedging losses in other income.** Forward contracts lost ₹183 cr in FY26 as the rupee fell (₹45 cr in Q3FY26 alone), while revenue gained from the same move; other income was −₹94 cr. Earlier years: +₹170 cr (FY22), −₹18 cr, −₹4 cr, −₹17 cr.`,
      '**Exceptional items and EBITDA definitions.** FY26 exceptional costs of ₹89 cr (₹70 cr deal costs, ₹19 cr JB distributor severance) and ₹21 cr in Q1FY27 (integration). The Q4FY26 press-release EBITDA excluded JB ESOP charges (CFO). PLI income of ₹147 cr is in revenue.',
      `**Cash conversion.** Operating cash flow was ${Math.round(A.cfoToEbitda[A.labels.indexOf('FY25')])}% of EBITDA in FY25 and 66% of reported EBITDA in FY26 (inventory and receivables built up; JB working capital came in); FY24 was ${Math.round(A.cfoToEbitda[A.labels.indexOf('FY24')])}%. Inventory days are high (~330) because Torrent supplies many export markets.`,
      '**Audit.** B S R & Co. (KPMG network), unmodified; the JB purchase-price allocation was done by an independent valuer.',
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing aggressive, but the deal makes the numbers hard to read: non-cash amortisation that will last ~15 years, a pro forma base, hedging losses in other income and EBITDA "before ESOP". We show reported and amortisation-adjusted EPS side by side; our primary method (EV/EBITDA) is unaffected by the charge, and our P/E cross-check uses the adjusted figure because the P/E history never carried it.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Mehta family owns Torrent through Torrent Investments Ltd: 23.12 cr shares, ${OH.jun2026.promoter}% at Jun-2026 and 60.78% after the 4.19 cr merger shares were allotted on 20-Jul-2026; no pledge is reported. The promoters sold ~2.9% in the Dec-2024 quarter. At Jun-2026 foreign investors held ${OH.jun2026.fii}%, Indian institutions ${OH.jun2026.dii}% and the public ${OH.jun2026.public}% (${n0(OH.jun2026.shareholders)} shareholders); the pattern filed after the allotment showed FIIs 18.0%, DIIs 12.8% and others 8.5%, as JB's other shareholders received Torrent shares.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Shareholding (%)', head: ['Holder', 'Jun-2026 (33.84 cr shares)', 'Jul-2026, after allotment (38.04 cr)', 'Note'], wide: [3], rows: [
    ['Promoters (Torrent Investments Ltd)', OH.jun2026.promoter, OH.postAllotmentJul2026.promoter, 'Mehta family holding company; no pledge'],
    ['Foreign investors', OH.jun2026.fii, OH.postAllotmentJul2026.fii, ''],
    ['Indian institutions (mutual funds, insurers)', OH.jun2026.dii, OH.postAllotmentJul2026.dii, ''],
    ['Public and others', (OH.jun2026.public + OH.jun2026.govt).toFixed(2), OH.postAllotmentJul2026.others, ''],
  ], source: rup(OH.src) } },
  { callout: '**Our read:** a family-controlled company with a long record of treating minorities fairly (no pledges, steady dividends, merger swap ratio fixed at announcement). The free float rose from 32% to 39% with the merger, which should help liquidity and index weights. Named institutional holders above 1% were not retrieved (gap).' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a family-run board with a strong execution record; promoter pay is high',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Good', 'B S R & Co. (KPMG), unmodified; detailed deal accounting (note 42).', 'The deal adds complexity, not red flags.'],
      ['Promoter', 'Strong', 'Torrent Investments 60.78% after the merger; no pledge; minorities kept whole in every deal (JB swap fixed at announcement; 51:100).', 'Aligned owner.'],
      ['Promoter pay', 'Weak', 'Executive Chairman Samir Mehta ₹36 cr (+20%), 493x the median employee; MD Aman Mehta ₹18.8 cr (+149%; 80% excl. one-time reward).', '~2.5% of FY26 profit to two promoter executives.'],
      ['Board', 'Moderate', '7 directors, 4 independent (lead ID Manish Choksi; 2 women); 3 family members.', 'Adequate; family dominates.'],
      ['Related parties', 'Minor', 'Sale of plant to group company Torrent Electricals ₹40.9 cr; donation to UNM Foundation ₹9.9 cr; power bought from Torrent Power at regulated tariffs.', 'Small relative to ₹13,980 cr revenue.'],
      ['Capital allocation', 'Good, but stretched', 'Four debt-funded acquisitions that worked; JB at ~23x EBITDA with 2.3x leverage; ₹5,000 cr QIP enabling resolution (Jun-2026).', 'The JB outcome decides this verdict.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, AGM notice, deal filings)' },
  ],
};

const g3 = arr => arr.map(v => n0(v));
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue ~11-12% a year like-for-like, EBITDA margin to 35%, EPS before JB amortisation +22% a year',
  blocks: [
    { p: 'We forecast revenue by line (Torrent base India, JB India, Brazil, US, Germany, rest of world, JB international and CDMO) from the pro forma FY26 base and run the model on the resulting growth rate (the authoring script checks the build equals model revenue). EBITDA margin is the weighted result of Torrent base +50bp a year and JB rising with synergies. Depreciation includes ₹1,340 cr a year of JB brand amortisation; interest follows our debt path; other income is built from treasury income, hedging losses and small recurring items; tax 25-25.5%; no minorities; payout 50%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates the target price.' },
    { exhibit: { type: 'table', title: 'Revenue build (₹ crore; checked to sum to model revenue)', head: ['Line', 'FY26 PF', 'Growth FY27-29E', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...LINES.map(l => [LBL[l], n0(BL.base[l]), BL.growth[l].map(v => `${v}%`).join(' / '), ...g3(build[l])]),
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[X.b])}**`, '', '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'Company (FY26 split, Q1FY27); GAM estimates (assumptions.json businessLines)' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury: interest + fund gains', '69.4', ...oiTreas.map(v => n1(v))],
      [`  basis: ${TY}% × average gross cash and funds`, '~₹1,100 cr avg', ...YRS.map((_, i) => `₹${n0((GROSS_CASH[i] + GROSS_CASH[i + 1]) / 2)} cr`)],
      ['Foreign exchange and hedging', '−183.4', ...FX.map(v => n1(v))],
      ['Asset-sale gains (one-off)', '17.7', '0', '0', '0'],
      ['Other non-operating', '2.8', ...YRS.map(() => n1(MISC))],
      { hl: true, cells: ['**Other income (model)**', '**−93.6**', '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: twelve months to Jun-26, before exceptional items (Screener) / Q1FY27', '−69 / −12', '', '', ''],
    ], source: 'AR FY26 note 29 (and FY23/FY25 notes for the FX history); GAM. Exceptional items (FY26 −₹89 cr, Q1FY27 −₹21 cr) are not forecast.' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore; FY26 = pro forma)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation & amortisation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Net debt is in the Debt & deleveraging chapter.' } },
    { exhibit: { type: 'table', title: 'Reported EPS and EPS before the JB amortisation', head: ['', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Net profit, reported (₹ cr)', '{{F.pat.0|num}}', '{{F.pat.1|num}}', '{{F.pat.2|num}}'],
      ['Add: JB brand amortisation after its deferred-tax credit', ...ppaPat.map(n0)],
      ['Net profit before JB amortisation', ...YRS.map((_, i) => n0(F.pat[i] + ppaPat[i]))],
      ['EPS reported / before JB amortisation (₹, 38.04 cr shares)', ...YRS.map((_, i) => `${n1(epsU[i])} / ${n1(adjEps[i])}`)],
    ], source: 'GAM Research (₹1,340 cr a year × (1 − model tax rate))' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026; EPS on 38.04 cr shares)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      [`Revenue: PL (${shortDate(pl_.date)}) / ICICI Direct`, '{{F.sales.0|num}}', `${n0(pl_.sales.FY27E)} / ${n0(idir.sales.FY27E)}`, '{{F.sales.1|num}}', `${n0(pl_.sales.FY28E)} / ${n0(idir.sales.FY28E)}`],
      ['EBITDA: PL / ICICI Direct', '{{F.ebitda.0|num}}', `${n0(pl_.ebitda.FY27E)} / ${n0(idir.ebitda.FY27E)}`, '{{F.ebitda.1|num}}', `${n0(pl_.ebitda.FY28E)} / ${n0(idir.ebitda.FY28E)}`],
      ['EPS: PL / ICICI Direct / MOSL (May-26)', '{{F.eps.0|n1}}', `${n1(pl_.eps.FY27E)} / ${n1(idir.eps.FY27E)} / ${n1(mosl.eps.FY27E)}`, '{{F.eps.1|n1}}', `${n1(pl_.eps.FY28E)} / ${n1(idir.eps.FY28E)} / ${n1(mosl.eps.FY28E)}`],
    ], source: 'PL and ICICI Direct notes (PDF, 31-Jul-2026; their EPS restated from 33.84 cr to 38.04 cr shares using their PAT); MOSL 23-May-2026 summary. No consensus dated before 30-Sep-2026 was found.' } },
    { callout: `Our revenue is in line with the street for FY27 and 1-5% lower for FY28 (we are more cautious on Germany and JB's transfers). Our FY28E EBITDA is close to ICICI Direct and ~4% below PL. Our FY27E EPS is inside the street range, but our FY28E EPS is 7-12% below all three, mainly because we carry more interest (₹${n0(AS.interest[1])} cr in FY28E vs PL's ~₹825 cr: we assume dividends continue at half of profit, so debt falls more slowly) and a full ₹1,340 cr of JB amortisation.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
