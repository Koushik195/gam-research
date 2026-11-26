// Poly Medicure report, part 4: Q1FY27 & guidance, earnings quality, ownership.
const X = require('./POLYMED.ctx');
const { C, D, n0, n1, Q1, OIN, epsBase, epsRepAll } = X;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +30% (organic +12%), standalone margin 28%, profit −8%; FY27 guidance of ₹2,300-2,400 cr kept',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, consolidated)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue', '403.2', n1(Q1.revenue), `+${Q1.revenueGrowthPct}%`],
      ['  of which organic / acquisitions', '403.2 / –', `${n1(Q1.organic)} / ${n1(Q1.acquisitions)}`, `organic +${Q1.organicGrowthPct}%`],
      ['  India / international', '125.7 / 275.1', `${n1(Q1.domestic)} / ${n1(Q1.international)}`, `+${Q1.domesticGrowthPct}% / +${Q1.internationalGrowthPct}%`],
      ['Gross margin', '68.4%', `${Q1.grossMarginPct}%`, '+495bp (price increases, inventory gains, acquired mix)'],
      ['Employee cost / other expenses', '74.4 / 88.0', `${n1(Q1.employee)} / ${n1(Q1.other)}`, '+71% / +43% (acquisitions; wages)'],
      ['Operating EBITDA (incl. associate)', '107.6', n1(Q1.opEbitda), '+17.7%'],
      ['  margin', '26.7%', `${Q1.opEbitdaMarginPct}%`, '−257bp (standalone 28.0%, +154bp)'],
      ['Other income / D&A / finance cost', '41.7 / 23.4 / 3.0', `${Q1.otherIncome} / ${Q1.dep} / ${Q1.financeCost}`, 'D&A +55%, interest +120%, other income −20%'],
      { hl: true, cells: ['**Profit (PAT)**', '**93.1**', `**${n1(Q1.pat)}**`, '**−8.4%**'] },
      ['EPS (₹)', '9.2', `${Q1.eps}`, '−7.6%'],
    ], source: 'Q1FY27 PPT pp.21-27 (7-Aug-2026); Q1FY27 call (10-Aug-2026)' } },
    { bullets: [
      '**Better than it looks at the top, worse at the bottom.** Organic growth of 12.4% was the best in a year, and the standalone business made a 28% EBITDA margin (guidance 25-27%). But profit fell 8% because the acquisitions add revenue with little EBITDA, depreciation and interest jumped, and other income fell as the QIP cash was spent.',
      '**One-offs in the margin:** standalone gross margin of 71.5% was helped by 4-5% price increases taken in Q1 and inventory bought before a ~20% rise in raw-material costs; management guides 68-69% for the rest of the year.',
      '**Headwinds named by management:** Middle East shipments stuck at ports (−32%); logistics costs up 2-3x in six months; Haryana minimum wage +35%; Chinese dialysers; US tariff policy.',
      `**Balance sheet:** cash ₹${n1(Q1.cash)} cr; ~₹250 cr of revolving working-capital debt in the parent and ~€9 mn at Citieffe; cash conversion cycle ~140 days (standalone, management basis).`,
    ] },
    { exhibit: { type: 'table', title: 'What management guided for FY27 (May and Aug-2026)', head: ['Guidance'], rows: C.guidance.fy27.map(g => [g]), source: 'Q4FY26 call (25-May-2026) and Q1FY27 call (10-Aug-2026)' } },
    { callout: `**Why it matters:** the guidance implies ~₹1,775-1,875 cr of revenue in Q2-Q4, i.e. ~21-27% growth on FY26's ₹1,472 cr for those quarters (which already included ~₹117 cr of acquired revenue), against 30% in Q1; the top of the range needs the Middle East reopens and the seasonal H2 pick-up repeats. We model {{F.sales.0|num}} cr (+{{F.salesGrowth.0|pct}}), just below the range, and a {{F.ebitdaMargin.0|pct}} margin (Screener basis, ex associate), inside the 23-25% guide. ${C.guidance.vision2030}.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts and a new auditor, but profit has not turned into free cash for four years, and a fifth of pre-tax profit is other income',
  blocks: [
    { bullets: [
      `**Other income is large:** ₹120 cr in FY26 (28% of PBT): treasury income on the QIP cash ₹${n1(X.T26)} cr (mostly mutual-fund gains, realised ₹${n1(OIN.FY26.mfRealised)} cr and unrealised ₹${n1(OIN.FY26.mfUnrealised)} cr), forex gains ₹${n1(OIN.FY26.forex)} cr, grants and miscellaneous ₹${n1(OIN.FY26.grants + OIN.FY26.misc)} cr. Screener labels the mutual-fund gains "exceptional"; they are not, but they shrink as the cash is spent and swing with bond markets.`,
      `**One-offs in FY26:** a ₹6.8 cr labour-code provision and ₹9.7 cr of acquisition costs (₹12.4 cr after tax). Our base EPS is ₹${n1(epsBase[2026])} vs ₹${n1(epsRepAll[2026])} reported. No exceptional items in FY21-25.`,
      '**Cash conversion:** cash from operations before tax was 71-102% of EBITDA in FY15-26 (Screener), 78% in FY26; working capital absorbed ₹146 cr in FY26 (receivables ₹99 cr). Free cash flow (Screener) was negative in FY23-26: capex and working capital have outrun profit.',
      '**Acquisition accounting:** PendraCare and Citieffe purchase-price allocations are provisional (AR FY26 note 38); ₹224 cr of goodwill and ~₹131 cr of intangibles were recognised, and contingent consideration (~₹39 cr) is a liability that can be revalued through profit.',
      '**Pay is profit-linked:** promoter directors\' commissions (₹11.2 cr each to the MD and JMD in FY26) rise with profit, a small but real cost to minorities.',
      '**Audit:** Doogar & Associates since the Sep-2024 AGM (replacing the previous auditor); we found no qualification in the FY26 report.',
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing looks wrong, but three things deserve attention: heavy other income that will decline, four years of negative free cash flow, and provisional acquisition accounting. We value on EPS before the FY26 one-offs and include forex gains at their three-year average, which is the least certain part of our forecast.' },
  ],
};

const OH = C.ownership.jun26;
const ownership = base => ({ ...base, blocks: [
  { p: `The Baid family (MD Himanshu Baid, Joint MD Rishi Baid, ED Vishal Baid, director Jugal Kishore Baid, their HUFs and family companies such as VCB Trading LLP and Jai Polypan) owns ${OH.promoters}% (Jun-2026). Mutual funds own ${OH.mutualFunds}%, FPIs ${OH.fpis}%, insurers ${OH.insurance}% and AIFs ${OH.aif}%. Foreign investors halved their stake from 12.4% (Dec-2024) to 5.6% as the stock fell; domestic institutions rose to 16%. The promoter group jumped from 53% to 66% in Jun-2024 on Screener's series (we could not find the reason, likely a reclassification) and was diluted to 62.4% by the Aug-2024 QIP; it has not sold since.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest named holders, Jun-2026 (%)', head: ['Promoter group', '%', 'Institutions', '%'], rows: C.ownership.promoterHolders.map((p, i) => [p[0], n1(p[1]), C.ownership.topInstitutions[i]?.[0] || '', C.ownership.topInstitutions[i] ? n1(C.ownership.topInstitutions[i][1]) : '']), source: 'AR FY26 note 14 (promoters, Mar-26; unchanged in Jun-26 in total); Q1FY27 PPT p.28 (institutions, Jun-26)' } },
  { callout: '**Our read:** a family-controlled company with a large, stable promoter stake and a shareholder base that has rotated from foreign to domestic money. The family runs the business and sets its own pay; minority shareholders rely on an independent board chaired by a former SEBI chairman (now 89).' },
] });

module.exports = { guidance, quality, ownership };
