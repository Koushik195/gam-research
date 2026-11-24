// CEAT report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./CEATLTD.ctx');
const { C, D, F, A, AS, n0, n1, pc, pc1, b, mosl, emkay, OI26, FY26, Q1, BS } = X;
const QC = Q1.consolidated, QS = Q1.standalone, G = Q1.guidance;
const yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +22%, EBITDA −4%, profit ₹4 cr',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, company basis)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'y/y'], rows: [
      ['Revenue, consolidated', n0(QC.prior.revenue), n0(QC.q4.revenue), n0(QC.revenue), yoy(QC.revenue, QC.prior.revenue)],
      ['Gross margin', '36.8%', '39.7%', QC.grossMarginPct + '%', '−287bp'],
      ['EBITDA (incl. JV share)', n0(QC.prior.ebitda), n0(QC.q4.ebitda), n0(QC.ebitda), yoy(QC.ebitda, QC.prior.ebitda)],
      ['EBITDA margin', QC.prior.ebitdaMarginPct + '%', QC.q4.ebitdaMarginPct + '%', QC.ebitdaMarginPct + '%', '−238bp'],
      ['Finance cost', '82', '85', n0(QC.interest), `incl. ₹${QC.lkrLoss} cr LKR loss`],
      ['Depreciation', '151', '184', n0(QC.dep), ''],
      ['Exceptional items (VRS)', '3', '10', n0(QC.exceptional), ''],
      { hl: true, cells: ['**Net profit, consolidated**', `**${n0(QC.prior.pat)}**`, `**${n0(QC.q4.pat)}**`, `**${n0(QC.pat)}**`, '**−96%**'] },
      ['Standalone revenue / EBITDA margin', '3,521 / 11.1%', '4,036 / 14.6%', `${n0(QS.revenue)} / ${QS.ebitdaMarginPct}%`, yoy(QS.revenue, 3521)],
      ['Standalone net profit', '135', '284', n0(QS.pat), '−27%'],
    ], source: 'Q1FY27 investor presentation pp.10-11 (16-Jul-2026); Q1FY27 call' } },
    { bullets: [
      `**Demand:** replacement mid-teens, OEM low teens, international ~30%; standalone volume +13-14%. Management expects mid-single-digit replacement growth for truck and car tyres and high single digits for two-wheelers, double-digit OEM car and two-wheeler demand; "some moderation" in Q2 but "not going to fall off the cliff".`,
      `**Costs and prices:** raw materials +16-18% q/q in Q1 and +8-10% expected in Q2; ~11% of replacement price increases by mid-July with 4-6% more planned; OEM double-digit index increase from 1-Jul. If raw materials fall, CEAT intends to hold prices until the gross margin is back at 40-41%.`,
      `**Camso:** EBITDA negative in Q1 (start-up costs), ~60% of customers moved by June, ~90% by September; upstream by Q4FY27; FY28 the first full year of control.`,
      `**Finance cost and debt:** ₹146 cr incl. a ₹48 cr Sri Lankan-rupee loss; underlying ~₹98 cr, guided ~5% higher for the next one or two quarters. Debt ₹${n0(QC.debt)} cr (₹${n0(QC.debtMar26)} cr at Mar-26), D/E ${QC.debtToEquity}x, debt/EBITDA ${QC.debtToEbitda}x; working capital +₹${QC.nwcIncrease} cr (more raw-material stock, GST credits).`,
      `**Capex:** ₹${QS.capex} cr in Q1; FY27 guidance ${G.capexFY27} cr; ₹1,205 cr approved for 53,000 more two-wheeler tyres a day by FY31. Credit rating: ${G.rating}.`,
    ] },
    { callout: `**Why it matters:** Q1 was the bottom of the margin cycle on management's own description, and two items made profit look worse than operations: the ₹48 cr currency loss and Camso's start-up costs. Even so, Q2 will be weak (more cost inflation, the OEM increase arriving only in July). Our FY27E EBITDA margin of {{F.ebitdaMargin.0|pct}} assumes ~9% standalone in Q2, ~11.5% in Q3 and ~13% in Q4.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts and good cash conversion; currency and acquisition noise in FY26-27',
  blocks: [
    { bullets: [
      `**Cash conversion is strong.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26 against EBITDA of ₹${n0(A.ebitda[b])} cr (${Math.round(A.cfo[b] / A.ebitda[b] * 100)}%), helped by supplier credit and dealer deposits (negative working capital). It dipped to ₹${n0(A.cfo[b - 1])} cr in FY25 when receivables and inventories rose.`,
      `**Exceptional items are small but recurring.** ₹${n0(FY26.exceptional)} cr in FY26 (labour codes ₹${n0(FY26.labourCode)} cr, VRS ₹${n0(FY26.vrs)} cr), ₹30 cr in FY25, ₹58 cr in FY24, ₹7 cr in Q1FY27 (VRS). Screener nets them into other income. Reported FY26 EPS ₹${n1(FY26.eps)} vs MOSL adjusted ₹${C.adjEps.FY26}: a 7% gap.`,
      `**Acquisition accounting.** Camso's ₹${n0(C.camso.consideration)} cr was allocated mostly to plant (₹${n0(C.camso.ppa.ppe)} cr) and know-how and licences (₹${n0(C.camso.ppa.technicalKnowhow + C.camso.ppa.camsoBrandLicence + C.camso.ppa.haulerBrand)} cr, amortised), with only ₹${n1(C.camso.ppa.goodwill)} cr of goodwill (independent valuer; key audit matter). ₹${n1(C.camso.acquisitionCosts)} cr of deal costs went through other expenses in FY26. The USD44 mn brand payment is a disclosed commitment, not a liability.`,
      `**Currency in finance cost.** The ₹48 cr Sri Lankan-rupee loss in Q1FY27 sits in finance cost, not in exceptional items; it can reverse if the rupee recovers. We assume no further loss.`,
      `**Other income is small.** FY26 ₹${n1(OI26.total)} cr (interest ₹${n1(OI26.interestBank + OI26.interestOther)} cr, FX gains ₹${n1(OI26.fxGain)} cr, other ₹${n1(OI26.otherNonOperating + OI26.investmentGains)} cr) plus the JV share ₹${n1(OI26.jvShare)} cr. We forecast ₹{{F.otherIncome.0|num}} / {{F.otherIncome.1|num}} / {{F.otherIncome.2|num}} cr including the JV.`,
      `**Tax.** The consolidated rate (28.6% in FY26, 103% in Q1FY27) is above the standalone ~25% because Camso and Sri Lankan losses get no tax credit.`,
    ] },
    { callout: '**Accounting flag: GREEN.** Clean audit (B S R & Co.), small exceptional items, strong cash conversion and full standalone/consolidated disclosure every quarter. Watch the Camso amortisation, the brand commitment and the Sri Lankan currency line.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The RPG group (Goenka family) owns ${OH.categories.promoters}% (Jun-2026), mainly through Instant Holdings (29.5%) and Swallow Associates LLP (11.1%), with no pledges. Domestic institutions (mutual funds and insurers) own ${OH.categories.dii}%, foreign portfolio investors ${OH.categories.fii}% and the public ${OH.categories.public}%. ${OH.trend}. Shareholders numbered ${n0(OH.shareholders)}.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Promoter holdings (AR FY26) and Jun-2026 categories', head: ['Holder', 'Stake'], wide: [0], rows: [...C.promoters.holdings.map(([h, p]) => [h + ' (promoter group)', p + '%']), ['Domestic institutions (Jun-2026)', OH.categories.dii + '%'], ['Foreign portfolio investors (Jun-2026)', OH.categories.fii + '%'], ['Public and others (Jun-2026)', (OH.categories.public + OH.categories.others).toFixed(2) + '%']], source: 'AR FY26 note 17 (promoter entities, Mar-2026); shareholding pattern for the quarter ended 30-Jun-2026 (Screener.in categories)' } },
  { callout: '**Our read:** a stable promoter with just under half the company and no pledges. The register has rotated from foreign to Indian funds since 2023 (FIIs −6pp, DIIs +8pp), which made domestic flows the marginal buyer.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a professional management team in a family group; promoter pay rose sharply in FY26',
  blocks: [
    { p: `${C.management.chairman}; ${C.management.viceChairman}; ${C.management.md}; ${C.management.cfo}. Auditor: ${C.management.auditor}.` },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor + '.', 'No qualifications.'],
      ['Board and control', 'Moderate', D.governance.board + '.', 'Group strategy set by the family; day-to-day run by professionals.'],
      ['Pay', 'Weak', D.governance.pay + '.', 'Large increases in a year when profit rose 48%; the non-executive family directors earn as much as the MD.'],
      ['Related-party flows', 'Moderate', D.governance.relatedParty + '.', 'Normal for an RPG company; not a concern on what we read.'],
      ['Capital allocation', 'Moderate', 'Steady capex at ~8% of revenue; dividend payout ~20%; Camso bought with debt for ~1x revenue.', 'Sensible but return-dilutive for two to three years.'],
      ['Disclosure', 'Strong', D.governance.disclosure + '.', 'Better than MRF, which holds no calls.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (remuneration annexure, corporate governance report); Q1FY27 call' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, close to MOSL, below Emkay',
  blocks: [
    { p: `We forecast the standalone company (replacement, OEM and export build) and the subsidiaries (Camso) separately, each with a revenue path and an EBITDA margin, giving a consolidated EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} (excluding the JV share, which we put in other income). Capex is ₹{{F.capex.0|num}} / {{F.capex.1|num}} / {{F.capex.2|num}} cr (FY29E includes ~₹420 cr for the Camso brand), depreciation ${AS.depRateOnGrossBlock}% of gross block, finance cost ₹{{F.interest.0|num}} / {{F.interest.1|num}} / {{F.interest.2|num}} cr (FY27E includes Q1's ₹48 cr currency loss), tax ${AS.taxRate.join('% / ')}%, payout ${AS.payout[0]}%. No exceptional items are forecast. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income (actuals net of exceptional items)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'MOSL', 'Emkay', 'GAM FY28E', 'MOSL', 'Emkay'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(mosl.revenue.FY27E), n0(emkay.revenue.FY27E), '{{F.sales.1|num}}', n0(mosl.revenue.FY28E), n0(emkay.revenue.FY28E)],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', mosl.ebitdaMarginPct.FY27E + '%', emkay.ebitdaMarginPct.FY27E + '%', '{{F.ebitdaMargin.1|pct}}', mosl.ebitdaMarginPct.FY28E + '%', emkay.ebitdaMarginPct.FY28E + '%'],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(mosl.eps.FY27E)}**`, `**${n1(emkay.eps.FY27E)}**`, '**{{F.eps.1|n1}}**', `**${n1(mosl.eps.FY28E)}**`, `**${n1(emkay.eps.FY28E)}**`] },
      ['Gap (GAM vs broker)', '', pc(gap(F.eps[0], mosl.eps.FY27E)), pc(gap(F.eps[0], emkay.eps.FY27E)), '', pc(gap(F.eps[1], mosl.eps.FY28E)), pc(gap(F.eps[1], emkay.eps.FY28E))],
    ], source: 'MOSL (17-Jul-2026) and Emkay (18-Jul-2026) result notes (PDF). No dated consensus EPS before 30-Sep-2026 was found.' } },
    { callout: `We are close to MOSL (FY27E ₹${n1(mosl.eps.FY27E)}, FY28E ₹${n1(mosl.eps.FY28E)}) and well below Emkay (₹${n1(emkay.eps.FY27E)} / ₹${n1(emkay.eps.FY28E)}), whose FY27E assumes an 11.5% margin and lower interest. FY27E EPS falls ${pc((F.eps[0] / A.eps[b] - 1) * 100)} on the margin squeeze and the currency loss; FY28E roughly doubles as margins normalise and Camso breaks even. EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E, almost all of it margin recovery.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
