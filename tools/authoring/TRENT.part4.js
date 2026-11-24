// Trent report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./TRENT.ctx');
const { C, D, F, A, AS, SQ, n0, n1, pc1, b, OI26, FY26, Q1, BS, ST, sq } = X;
const QC = Q1.consolidated, QS = Q1.standalone, G = C.guidance, FC = FY26.consolidated, FN = C.financeCostFY26;
const yoy = (a, p) => pc1((a / p - 1) * 100);
const [q1a, q4, q1] = [sq('Q1FY26'), sq('Q4FY26'), sq('Q1FY27')];

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: `Q1FY27: revenue +${Math.round(QC.growthPct)}%, EBITDA +${Math.round((QC.ebitda / QC.ebitdaQ1FY26 - 1) * 100)}%, profit +${Math.round((QC.pat / QC.patQ1FY26 - 1) * 100)}%: margins beat, sales per sq ft fell again`,
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'y/y'], rows: [
      ['Revenue, consolidated', n0(q1a.consRev), n0(q4.consRev), n0(q1.consRev), yoy(q1.consRev, q1a.consRev)],
      ['EBITDA, consolidated', n0(q1a.consEbitda), n0(q4.consEbitda), n0(q1.consEbitda), yoy(q1.consEbitda, q1a.consEbitda)],
      ['EBITDA margin', q1a.consMarginPct + '%', q4.consMarginPct + '%', q1.consMarginPct + '%', ''],
      ['Depreciation', n0(QC.depQ1FY26), '377', n0(QC.dep), yoy(QC.dep, QC.depQ1FY26)],
      { hl: true, cells: ['**Net profit, consolidated**', `**${n0(q1a.consPat)}**`, `**${n0(q4.consPat)}**`, `**${n0(q1.consPat)}**`, `**${yoy(q1.consPat, q1a.consPat)}**`] },
      ['Standalone revenue (fashion)', n0(q1a.standaloneRev), n0(q4.standaloneRev), n0(q1.standaloneRev), yoy(q1.standaloneRev, q1a.standaloneRev)],
      ['Standalone EBITDA margin', q1a.standaloneMarginPct + '%', q4.standaloneMarginPct + '%', q1.standaloneMarginPct + '%', ''],
      ['Westside / Zudio stores', `${q1a.westside} / ${q1a.zudio}`, `${q4.westside} / ${q4.zudio}`, `${q1.westside} / ${q1.zudio}`, '+21% / +28%'],
      ['Fashion retail area (mn sq ft)', n1(q1a.areaMnSqft), n1(q4.areaMnSqft), n1(q1.areaMnSqft), '+33%'],
      ['Star revenue (JV, excl. GST)', n0(q1a.starRev), n0(q4.starRev), n0(q1.starRev), yoy(q1.starRev, q1a.starRev)],
    ], source: 'Screener.in (standalone and consolidated quarterly results); Q1FY26, Q4FY26 and Q1FY27 presentations' } },
    { bullets: [
      `**Growth:** standalone revenue +${QS.growthPct}% on ~33% more space: revenue per sq ft down ~10% (MOSL), revenue per store down ~5% (Business Today, 7-Jul-2026). Like-for-like growth "in the low single digits" (company). The stock fell 12% on the 7-Jul business update.`,
      `**Margins:** gross margin +149bp to ${QS.grossMarginPct}% (ICICI Direct, MOSL) on mix and inventory health; standalone EBITDA margin ${QS.marginPct}% (${QS.marginQ1FY26}% a year earlier); operating EBITDA before Ind AS 116 +${QS.opEbitdaGrowthPct}%. Depreciation +40% and finance cost +18% held profit growth to +22%.`,
      `**Guidance:** ${G.storeAdds}`,
      `**Costs:** ${Q1.context}`,
      `**Funding:** ${G.capitalRaise}`,
    ] },
    { callout: `**Why it matters:** Q1 confirmed the pattern of FY26: 18-20% revenue growth from ~30% more space, a better gross margin, and profit growing slower than EBITDA because leases and young stores add depreciation. We model FY27E profit growth of {{F.patGrowth.0|chg}}, close to Q1's +22%.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts, one big lease one-off in FY24; Ind AS 116 makes EBITDA look better than cash',
  blocks: [
    { bullets: [
      `**Cash conversion is good before rent, thin after it.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26 (${Math.round(A.cfo[b] / A.ebitda[b] * 100)}% of EBITDA); after cash capex (₹${n0(A.capex[b])} cr) and lease payments (₹${n0(FC.leasePayments)} cr) little was left (~₹${n0(A.cfo[b] - A.capex[b] - FC.leasePayments)} cr).`,
      `**One-offs:** FY24 included a ₹576 cr exceptional gain (₹439 cr after tax) from reassessing lease terms; FY26 a ₹26 cr labour-code charge. Our forward P/E median is ${n1(X.medExOneOff)}x on EPS before the FY24 gain and ${n1(X.HA.med)}x on reported EPS: the one-off does not move it.`,
      `**Other income is small.** FY26 ₹${n1(OI26.total)} cr: treasury income (deposits, bonds, fund gains and fair-value changes ~₹${n0(OI26.interestDeposits + OI26.interestBonds + OI26.gainOnInvestments + OI26.fairValueChanges)} cr), unwinding of security deposits ₹${n1(OI26.securityDepositUnwinding)} cr, write-backs ₹${n1(OI26.writeBacks)} cr; FY25 (₹${n1(OI26.totalFY25)} cr) included ₹${n1(OI26.profitOnSaleOfAssetsFY25)} cr of profit on asset sales. We forecast ₹{{F.otherIncome.0|num}} / {{F.otherIncome.1|num}} / {{F.otherIncome.2|num}} cr incl. the JV/associate share.`,
      `**Leases move rent below EBITDA.** Under Ind AS 116 rent on leased stores becomes depreciation and interest (lease interest ₹${n1(FN.leaseInterest)} cr in FY26). Trent itself points to operating EBITDA excluding Ind AS 116 (Q1FY27 standalone ₹${n0(QS.opEbitdaPreIndAs)} cr vs reported ₹${n0(QS.ebitda)} cr). Compare profit, not EBITDA, across years.`,
      `**Screener basis:** its FY26 other income (₹${n0(A.otherIncome[b])} cr) nets the exceptional and the JV share, and its finance cost includes ~₹64 cr of bank charges the company reports in other expenses; our forecasts follow that basis.`,
      '**Tax** is ~24-25% (new regime); the JV/associate share is post-tax. Minorities (Booker, 49% Tesco) are immaterial (₹1.7 cr in FY26).',
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit by Deloitte Haskins & Sells LLP, a single-segment business, clear disclosure of the JVs and associates. Watch the growing lease book and depreciation per rupee of sales, and the gap between standalone and consolidated profit (Star losses).' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Tata group owns ${OH.categories.promoters}% (Jun-2026) with no pledges: ${OH.promoters}. Foreign portfolio investors own ${OH.categories.fii}%, domestic institutions ${OH.categories.dii}% and the public ${OH.categories.public}%. ${OH.trend}.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Holders (promoters from AR FY26; categories at Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: [...Object.entries(C.governance.promoters).map(([h, p]) => [h + ' (promoter group)', p + '%']), ['Foreign portfolio investors (Jun-2026)', OH.categories.fii + '%'], ['Domestic institutions (Jun-2026)', OH.categories.dii + '%'], ['Public and others (Jun-2026)', (OH.categories.public + OH.categories.government).toFixed(2) + '%']], source: 'AR FY26 note 18 (Mar-2026); shareholding pattern for the quarter ended 30-Jun-2026 (Screener.in categories)' } },
  { callout: '**Our read:** a stable, well-capitalised parent that has not sold. The striking change is the swap of foreign for domestic owners: FIIs cut their stake from ~28% to ~15% in two years as the stock fell from its 2024 peak. The number of shareholders doubled (247k to 520k). A rights issue would test both.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a Tata company with a long-serving team; the chairman is due to retire in Nov-2026 (age-70 rule)',
  blocks: [
    { p: `${C.management.map(m => `${m.name}: ${m.role}`).join('; ')}. Auditor: ${C.governance.auditor}. ${C.governance.board}.` },
    { verdicts: [
      ['Audit and accounts', 'Strong', C.governance.auditor + '; no qualifications.', 'Low accounting risk.'],
      ['Board and control', 'Strong', 'Tata Sons 32.45% (37.01% with group companies); independent directors; group governance code.', 'Owner-aligned, professionally run.'],
      ['Succession', 'Moderate', 'Noel Tata (chairman) said the June-2026 AGM was his last as he turns 70 in November; Bahram Vakil joined the board in April-2026; P. Venkatesalu remains MD.', 'Operating team unchanged; a new chairman is due.'],
      ['Related-party flows', 'Moderate', C.governance.rpt + '.', 'Large but disclosed; Star JV transactions bear watching.'],
      ['Capital allocation', 'Moderate', 'Disciplined in fashion (high ROCE); Star still loss-making after a decade; ₹2,500 cr raise approved without a launch date.', 'The new money would go partly to Star and new brands, where returns are unproven.'],
      ['Disclosure', 'Moderate', 'Quarterly presentations, no earnings calls, no Westside/Zudio split, LFL only as "low single digits".', 'Investors see less than they would like for a ~₹1.4 lakh crore company.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; Q1FY27 presentation; Outlook Business (24-Jun-2026)' },
  ],
};

const ic = ST.find(s => s.broker === 'ICICI Direct');
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, consolidated; the street quotes standalone EPS',
  blocks: [
    { p: `We forecast the fashion business (effective area × revenue per sq ft, from ${AS.build.storeAdds.join(' / ')} net openings) and the subsidiaries separately, giving consolidated revenue growth of {{F.salesGrowth.0|chg}} / {{F.salesGrowth.1|chg}} / {{F.salesGrowth.2|chg}} and an EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}. Capex including lease payments is ₹{{F.capex.0|num}} / {{F.capex.1|num}} / {{F.capex.2|num}} cr, depreciation ${AS.depRateOnGrossBlock}% of gross block (${X.daPct.map(n1).join('% / ')}% of revenue vs ${n1(X.daPct26)}% in FY26), finance cost ₹{{F.interest.0|num}} / {{F.interest.1|num}} / {{F.interest.2|num}} cr, tax ${AS.taxRate[0]}%, payout ${AS.payout[0]}%. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (FY27E+ incl. lease payments)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', `${n0(ic.revenue.FY27E)} (ICICI Direct)`, '{{F.sales.1|num}}', n0(ic.revenue.FY28E)],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', n0(ic.ebitda.FY27E), '{{F.ebitda.1|num}}', n0(ic.ebitda.FY28E)],
      { hl: true, cells: ['**Net profit (₹ cr)**', '**{{F.pat.0|num}}**', `**${n0(ic.pat.FY27E)}** (likely standalone)`, '**{{F.pat.1|num}}**', `**${n0(ic.pat.FY28E)}**`] },
      ['EPS (₹)', '{{F.eps.0|n1}}', `~${n1(3200 / 72)} (Nuvama, implied by 72x at ~₹3,200)`, '{{F.eps.1|n1}}', `~${n1(3200 / 58)} (Nuvama 58x); ~${n1(3107 / 62)}-${n1(3200 / 62)} (MOSL 62x)`],
    ], source: 'ICICI Direct (7-Aug-2026, DSIJ summary); Nuvama and MOSL multiples at the CMP per Business Today (7-Aug-2026) and DSIJ (6-Aug-2026); implied EPS = price ÷ multiple. No dated consensus EPS before 30-Sep-2026 was found.' } },
    { callout: `Our revenue is close to the street for FY27E and ~3% below ICICI Direct for FY28E (we assume revenue per sq ft keeps falling in FY27). The bigger gap is in profit: the street's FY28E EPS of ~₹51-55 appears to be standalone (MOSL: 19% adjusted-PAT CAGR over FY26-29E on standalone FY26 profit of ₹1,968 cr gives ~₹52), i.e. without Star's losses and with Zara's dividends. On the same growth rate from consolidated FY26 profit we would be in line. EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E in our model: area-led, with depreciation rising faster than revenue.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
