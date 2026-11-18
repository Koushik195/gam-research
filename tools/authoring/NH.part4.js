// Narayana Hrudayalaya report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const X = require('./NH.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, b, YRS, BL, FX, RENT, preEbitda, preMargin, pl, idir, kotak, shortDate, segE, segR, SQ } = X;
const q1 = SQ.at(-1), q1p = SQ.at(-5);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: India +40% EBITDA, group margin down 5pp on the UK heatwave and insurance losses',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(Q1.revenuePriorCr), n0(Q1.revenueCr), pc(Q1.revenueYoYPct)],
      ['  India hospitals (company basis)', n0(q1p.indHospRevCo), n0(q1.indHospRevCo), pc((q1.indHospRevCo / q1p.indHospRevCo - 1) * 100)],
      ['  Cayman hospitals / insurer (US$ mn)', `${q1p.cayUsdMn} / ${q1p.cihlUsdMn}`, `${q1.cayUsdMn} / ${q1.cihlUsdMn}`, '+5% / +193%'],
      ['  UK (£ mn; not owned a year ago)', '–', n1(q1.ukGbpMn), '+5% like-for-like'],
      ['EBITDA, excl. other income', n1(Q1.ebitdaPriorCr), n1(Q1.ebitdaCr), pc((Q1.ebitdaCr / Q1.ebitdaPriorCr - 1) * 100)],
      ['  margin', `${n1(Q1.ebitdaPriorCr / Q1.revenuePriorCr * 100)}%`, `${Q1.ebitdaMarginPct}%`, '−490bp'],
      ['  India hospital EBITDA / margin (company basis)', `${n1(q1p.indHospEbitdaCo)} / ${q1p.indHospMarginCo}%`, `${n1(q1.indHospEbitdaCo)} / ${q1.indHospMarginCo}%`, `${pc((q1.indHospEbitdaCo / q1p.indHospEbitdaCo - 1) * 100)} / +420bp`],
      ['  Cayman insurer + India clinics/insurer EBITDA', n1(q1p.cihlEbitda + q1p.icEbitdaCo), n1(q1.cihlEbitda + q1.icEbitdaCo), 'losses x2.4'],
      ['  UK EBITDA (post-IFRS 16, £ mn)', '–', n1(q1.ukEbitdaGbpMn), '8.8% margin'],
      ['Other income', n1(Q1.otherIncomePriorCr), n1(Q1.otherIncomeCr), pc((Q1.otherIncomeCr / Q1.otherIncomePriorCr - 1) * 100)],
      ['Depreciation / interest', '84.3 / 45.2', `${n1(Q1.depCr)} / ${n1(Q1.interestCr)}`, 'UK, PPA, acquisition loan'],
      { hl: true, cells: ['**Net profit**', `**${n1(Q1.patPriorCr)}**`, `**${n1(Q1.patCr)}**`, `**${pc((Q1.patCr / Q1.patPriorCr - 1) * 100)}**`] },
    ], source: 'Q1FY27 presentation (3-Aug-2026) and call; PL Q1FY27 note (segment losses)' } },
    { bullets: [
      '**India did the heavy lifting:** India hospital EBITDA +40% with no new beds, on ARPOB +9% and, for the first time in a while, volumes (IP +8%, OP +9%). Management: core margin expansion continues because no meaningful beds arrive for 2-3 years.',
      '**Everything else disappointed:** the UK lost theatre days in a heatwave (some spilled into Q2), India insurance had a 219% claims ratio on a few large claims, clinics lost ~₹15 cr, and Cayman hospital revenue grew only 5% in dollars in its seasonally weakest quarter. Cayman insurance losses did narrow (US$3.7 mn vs US$5.2 mn in Q4).',
      '**PL\'s estimate was 9% too high:** EBITDA ₹470 cr vs PL\'s ₹513 cr; PAT ₹207 cr (+6%). The stock fell ~5% on the day.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (Nov-2025 to Aug-2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), g.outcome || '–']), source: rup(C.guidanceSrc) } },
    { callout: '**Why it matters:** Narayana gives no formal guidance, but the direction is clear: India margins up, insurance losses down "over a period of time", the UK improving "in the medium term". The record so far is mixed: India has beaten, while greenfield capex in FY26 was a quarter of plan, three projects slipped a year, Cayman insurance losses ran above the early hopes of breakeven by Q1FY27, and the UK\'s first full quarter went backwards.' },
  ],
};

const AC = C.accounting;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: cash-generative, but four businesses, two EBITDA definitions and an acquisition make the numbers hard to read',
  blocks: [
    { bullets: [
      `**Which EBITDA?** Narayana's own "EBITDA" includes other income (FY26 ₹1,717 cr; adjusted for one-time UK costs ₹1,793 cr). Screener's (and our model's) excludes it: ₹1,641 cr in FY26, which still contains the ₹76 cr one-time acquisition cost and ~₹24 cr moved from finance cost. Brokers mostly use the company's ex-other-income figure (PL FY26 ₹1,693 cr).`,
      '**Segment opacity.** The company reports India hospital EBITDA but not Cayman ("it is possible for you to work that number"). The India figure includes ~₹66-79 cr a year of income that is eliminated on consolidation, so India looks better and Cayman worse than PL\'s split; we use PL\'s split, which adds up.',
      `**Ind AS 116.** Lease liabilities rose to ₹991 cr (₹708 cr from PPG). Rent of ~₹160 cr a year is therefore below EBITDA (depreciation and interest): pre-Ind AS margin ~{{F.ebitdaMargin.0|pct}} less ~1.5pp. In the UK the gap is ~£2.4 mn a quarter (post- vs pre-IFRS 16 EBITDA).`,
      '**Purchase accounting.** Of the ₹2,201 cr PPG price, ₹1,181 cr is goodwill and ₹883 cr customer and brand intangibles (amortised; ~£2.3 mn in five months). Amortisation and acquisition interest turned a £2.7 mn UK hospital profit into a £1.9 mn loss in FY26.',
      '**One-offs in FY26:** ₹51 cr labour-code charge (exceptional), ₹76 cr UK acquisition costs (in other expenses), ₹6.2 cr Jammu write-down (discontinued). Q4FY26 reclassified Cayman doctor fees between cost lines (professional fees looked negative that quarter).',
      `**Cash conversion.** Operating cash flow was ${Math.round(A.cfoToEbitda[b])}% of EBITDA in FY26 (${Math.round(A.cfoToEbitda[b - 1])}% in FY25); suppliers fund working capital (payable days ~250). Government scheme receivables are slow (AR FY26).`,
      '**Tax.** 15-16% effective in FY25-26 because Cayman profits are untaxed locally; 20.4% in Q1FY27. A Cayman tax regime change or dividend withholding would raise it.',
      '**Audit.** Deloitte Haskins & Sells LLP; unqualified opinion.',
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing suggests aggressive accounting, and cash generation is real. But the reported numbers mix four businesses, two EBITDA definitions, purchase accounting and frequent reclassifications, and the company declines to report Cayman profit. Investors should rebuild the segments (as we do) rather than read the headline margin.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The founder's family owns ${OH.categoriesPct.promoter}% (Jun-2026) with no pledge reported: Mrs Shakuntala Shetty 34.80%, Dr Devi Shetty 11.66%, and their sons Viren, Varun and Anesh 5.00% each (Viren and Anesh are executives), plus a family company (1.81%). Foreign investors own ${OH.categoriesPct.fii}% (11.5% in Dec-2023), Indian institutions ${OH.categoriesPct.dii}% (mutual funds ${OH.categoriesPct.mf}%), and ${n0(OH.counts.shareholders)} retail and other holders ${OH.categoriesPct.public}% (up from 120,506 holders in Dec-2023). Mrs Shetty sold 0.58% in the Dec-2025 quarter.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoterVehicles.map(h => [h.name, h.pct.toFixed(2) + '%', 'Promoter group (31-Mar-2026)']),
    ['All promoters (Jun-2026)', OH.categoriesPct.promoter + '%', 'No pledge reported'],
    ['Key domestic institutions', '–', OH.keyInstitutions.dii.join(', ')],
    ['Key foreign institutions', '–', OH.keyInstitutions.fii.join(', ')],
    ['ESOP trust', OH.esopTrustPct + '%', 'Treasury shares, excluded from the company\'s EPS'],
  ], source: rup(OH.src) + '. Individual institutional stakes were not available to us.' } },
  { callout: '**Our read:** a founding family with nearly two-thirds of the shares and two sons in management: aligned on the long term, but the free float is only ~37% and institutional ownership (~18%) is low for a ₹36,600 cr company, which limits liquidity and market discipline on capital allocation.' },
] });

const GV = C.governance;
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professional CEO and clean audits, but high founder pay and a family-run capital-allocation agenda',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note || '']), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Moderate', 'Deloitte; unqualified. But Cayman EBITDA is not reported, and FY26 had several reclassifications between cost lines and quarters.', 'Transparency could be better.'],
      ['Promoter', 'Mixed', `Family at 63.27%, no pledge; founder's FY26 pay ₹23.8 cr (incl. ₹5.9 cr performance pay), ~3% of PAT.`, 'Aligned owner, generous pay.'],
      ['Management depth', 'Good', 'MD & Group CEO Dr Emmanuel Rupert (with NH since 2000), CFO Sandhya Jayaraman, COO R. Venkatesh; family members run international (Dr Anesh Shetty) and strategy (Viren Shetty).', 'Stretched across three countries and two insurers.'],
      ['Related parties', 'Minor', rup(GV.relatedParties), 'Small vs ₹7,896 cr revenue; purchases from a KMP-linked supplier are rising.'],
      ['Capital allocation', 'Watch', 'A UK leveraged buyout at 9.2x EBITDA, two start-up insurers and ₹3,000 cr of India beds at ~3x the old cost per bed, all at once; ROCE fell from 32% (FY23) to 16% (FY26).', 'The key test of the next three years.'],
      ['Credit', 'Strong', 'ICRA AA (Stable) / A1+; net debt ~1x forward EBITDA; UK debt ring-fenced in the UK business.', 'Balance sheet is not the risk.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26, calls)' },
  ],
};

const g3 = arr => arr.map(v => n0(v));
const gapTxt = (g, s) => `${Math.round((g / s - 1) * 100)}%`;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue +42% in FY27 (full UK year), then ~9% a year; EPS ~20% a year, below the street',
  blocks: [
    { p: 'We forecast each business separately (the Excel model\'s Assumptions sheet holds every driver with our reasoning, and recalculates the target): India hospitals from occupied beds × ARPOB; Cayman and CIHL in US dollars at ₹94.7; the UK in pounds at ₹127; India clinics and insurance from clinic and premium growth with an absolute loss; an eliminations line. EBITDA is post-Ind AS 116 (rent excluded), so lease liabilities count as debt and new leases are added to capex. Depreciation is 6.1% of gross block (the Q1FY27 run-rate), interest stays near the Q1 run-rate as debt-funded India capex offsets UK repayments, tax rises from 18.5% to 19.5% as India\'s share of profit grows, and payout is 11%.' },
    { exhibit: { type: 'table', title: 'Segment build (₹ crore; checked to sum to model revenue)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      { sec: 'Revenue' },
      ...[['India hospitals', 'ind'], ['Cayman hospitals', 'cay'], ['UK (PPG)', 'uk'], ['Cayman insurance', 'cihl'], ['India clinics + insurance', 'ic'], ['Eliminations & other', 'elim']].map(([nm, k]) => [nm, n0(X.ann('FY26')[k + 'Rev']), ...g3(segR(k))]),
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      { sec: 'EBITDA (margin)' },
      ...[['India hospitals', 'ind'], ['Cayman hospitals', 'cay'], ['UK (PPG)', 'uk']].map(([nm, k]) => [nm, `${n0(X.ann('FY26')[k + 'Ebitda'])} (${n1(X.ann('FY26')[k + 'Ebitda'] / X.ann('FY26')[k + 'Rev'] * 100)}%)`, ...YRS.map((_, i) => `${n0(segE(k)[i])} (${n1(segE(k)[i] / segR(k)[i] * 100)}%)`)]),
      ['Cayman insurance', n0(X.ann('FY26').cihlEbitda), ...g3(segE('cihl'))],
      ['India clinics + insurance', n0(X.ann('FY26').icEbitda), ...g3(segE('ic'))],
      ['One-time costs and Screener reclassification', '−56', '0', '0', '0'],
      { hl: true, cells: ['**EBITDA (model)**', `**${n0(A.ebitda[b])}**`, '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
    ], source: 'Company, PL Q1FY27 split (FY26), GAM estimates (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income, built (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Treasury: deposit interest + amortised-cost interest + fund gains', '66.8', '100', '84', '72'],
      ['  basis: 4.0% × average gross cash and investments', '~3.0% on ~₹2,200 cr', '₹2,500 cr', '₹2,100 cr', '₹1,800 cr'],
      ['Recurring non-treasury (other interest, grant income, misc.)', '32.1', '28', '29', '30'],
      ['Share of associate/JV losses', '−5.6', '−8', '−8', '−8'],
      ['One-offs (write-backs)', '1.2', '0', '0', '0'],
      { hl: true, cells: ['**Other income (model)**', '**94.5**', '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Memo: company FY26 / twelve months to Jun-26 / Q1FY27', `100.2 / ~112 / ${n1(Q1.otherIncomeCr)}`, '', '', ''],
      ['Memo: Screener FY26 / TTM (nets the ₹51 cr labour-code charge)', `${n0(A.otherIncome[b])} / ${n0(A.ttm.otherIncome)}`, '', '', ''],
    ], source: 'AR FY26 note 24; company cash figures (Mar-26 ₹2,702 cr, Jun-26 ₹2,817 cr); GAM estimates. Built on gross cash because the model\'s net cash is after debt and leases.' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (post-Ind AS)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (forecasts incl. new leases)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of debt and leases)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of borrowings and lease liabilities in forecasts (negative = net debt).' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'PL FY27E', 'ICICI Direct FY27E', 'GAM FY28E', 'PL FY28E', 'ICICI Direct FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(pl.sales.FY27E), n0(idir.sales.FY27E), '{{F.sales.1|num}}', n0(pl.sales.FY28E), n0(idir.sales.FY28E)],
      ['EBITDA (₹ cr, excl. other income)', '{{F.ebitda.0|num}}', n0(pl.ebitda.FY27E), n0(idir.ebitda.FY27E), '{{F.ebitda.1|num}}', n0(pl.ebitda.FY28E), n0(idir.ebitda.FY28E)],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', `${n1(pl.ebitda.FY27E / pl.sales.FY27E * 100)}%`, `${n1(idir.ebitda.FY27E / idir.sales.FY27E * 100)}%`, '{{F.ebitdaMargin.1|pct}}', `${n1(pl.ebitda.FY28E / pl.sales.FY28E * 100)}%`, `${n1(idir.ebitda.FY28E / idir.sales.FY28E * 100)}%`],
      ['EPS (₹)', '{{F.eps.0|n1}}', n1(pl.eps.FY27E), n1(idir.eps.FY27E), '{{F.eps.1|n1}}', n1(pl.eps.FY28E), n1(idir.eps.FY28E)],
      ['Pre-Ind AS EBITDA (GAM: less rent of ₹162 / 175 cr)', n0(preEbitda[0]), '–', '–', n0(preEbitda[1]), '–', '–'],
    ], source: `PL Q1FY27 note (${shortDate(pl.date)}); ICICI Direct Q4FY26 note (27-May-26; target raised 29-Jun-26). Consensus (14 analysts) was not available by year.` } },
    { callout: `Our revenue is close to the street (FX at ₹94.7/US$ and ₹127/£ helps us), but our EBITDA is ${gapTxt(F.ebitda[1], pl.ebitda.FY28E)} vs PL and ${gapTxt(F.ebitda[1], idir.ebitda.FY28E)} vs ICICI Direct for FY28E, and our EPS ${gapTxt(F.eps[1], pl.eps.FY28E)} and ${gapTxt(F.eps[1], idir.eps.FY28E)}. Three reasons: (1) slower UK and Cayman insurance turnarounds (UK 11% margin in FY28E, CIHL still loss-making); (2) India clinic and insurance losses of ₹120 / 95 / 70 cr (Kotak: ₹120 cr in FY27E); (3) depreciation and interest at the Q1FY27 run-rate (PL has FY27E depreciation of ₹587 cr and interest of ₹305 cr, both below Q1×4). EPS still grows ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
