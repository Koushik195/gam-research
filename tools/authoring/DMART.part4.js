// DMart report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./DMART.ctx');
const { C, D, F, A, AS, SQ, n0, n1, pc, pc1, b, OI26, FY26, Q1, BS, ST } = X;
const QC = Q1.consolidated, QS = Q1.standalone, G = C.guidance;
const q = k => SQ.find(x => x.q === k);
const yoy = (a, p) => pc1((a / p - 1) * 100);
const [q1a, q4, q1] = [q('Q1FY26'), q('Q4FY26'), q('Q1FY27')];

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: `Q1FY27: revenue +${QC.growthPct}%, profit +${Math.round((QC.pat / QC.patQ1FY26 - 1) * 100)}%, like-for-like growth down to ${QS.lflPct}%`,
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'y/y'], rows: [
      ['Revenue, consolidated', n0(q1a.consRev), n0(q4.consRev), n0(q1.consRev), yoy(q1.consRev, q1a.consRev)],
      ['EBITDA, consolidated', n0(q1a.consEbitda), n0(q4.consEbitda), n0(q1.consEbitda), yoy(q1.consEbitda, q1a.consEbitda)],
      ['EBITDA margin', q1a.consMarginPct + '%', q4.consMarginPct + '%', q1.consMarginPct + '%', ''],
      { hl: true, cells: ['**Net profit, consolidated**', `**${n0(q1a.consPat)}**`, `**${n0(q4.consPat)}**`, `**${n0(q1.consPat)}**`, `**${yoy(q1.consPat, q1a.consPat)}**`] },
      ['Standalone revenue (DMart stores)', n0(q1a.standaloneRev), n0(q4.standaloneRev), n0(q1.standaloneRev), yoy(q1.standaloneRev, q1a.standaloneRev)],
      ['Standalone EBITDA margin', q1a.standaloneMarginPct + '%', q4.standaloneMarginPct + '%', q1.standaloneMarginPct + '%', ''],
      ['Subsidiaries (mainly DMart Ready): revenue / EBITDA', `${n0(q1a.subsRev)} / ${n0(q1a.subsEbitda)}`, `${n0(q4.subsRev)} / ${n0(q4.subsEbitda)}`, `${n0(q1.subsRev)} / ${n0(q1.subsEbitda)}`, yoy(q1.subsRev, q1a.subsRev)],
      ['Stores (added in quarter)', `${q1a.stores} (${q1a.storeAdds})`, `${q4.stores} (${q4.storeAdds})`, `${q1.stores} (${q1.storeAdds})`, ''],
      ['Like-for-like growth', q1a.lflPct + '%', q4.lflPct + '%', q1.lflPct + '%', ''],
    ], source: 'Screener.in (standalone and consolidated quarterly results); Q1FY27 presentation (11-Jul-2026); LFL per HDFC Securities, Citi, PL and MOSL' } },
    { bullets: [
      `**Growth:** standalone revenue +${QS.growthPct}% on ~19% more average selling area: revenue per sq ft fell ~3%. LFL ${QS.lflPct}% (7.1% a year earlier); older large-metro stores flat (Emkay, Goldman Sachs); bills per store −4.4%, average bill +1.5% (Elara); GM&A +19% (Emkay). March pantry-loading flattered Q4FY26 (LFL 10.8%) and spilled into Q1 (CEO).`,
      `**Margins:** gross margin up ~50bp y/y to a multi-quarter high, but staff cost +30%+ (capability build, the wage code from Dec-2025) left the EBITDA margin up only ~10bp (JPMorgan, Jefferies). Depreciation +24% and finance cost +86% (leases, commercial paper) held PBT growth to ~12%.`,
      `**Guidance (analyst meet, 28-Jul-2026):** ${G.storeAdds} ${G.margins} ${G.lfl}`,
      `**DMart Ready:** ${G.dmartReady}`,
      `**Funding:** ${G.debt}`,
    ] },
    { callout: `**Why it matters:** Q1 confirmed that DMart is now a ~15% grower, not a ~20% one: area growth of 15-20% minus a few points of productivity dilution. The margin is steady, but profit grows slower than revenue because of depreciation and interest. Our FY27E assumes ${AS.build.storeAdds[0]} openings, most in H2.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean, simple accounts; two small tax one-offs; profit converts well to cash',
  blocks: [
    { bullets: [
      `**Cash conversion is good.** Cash from operations (after tax) was ₹${n0(A.cfo[b])} cr in FY26 against EBITDA of ₹${n0(A.ebitda[b])} cr (${Math.round(A.cfo[b] / A.ebitda[b] * 100)}%), after ₹856 cr more inventory as distribution centres were added. Customers pay at the till (receivables ~1 day).`,
      `**One-offs are small and disclosed.** One-off tax benefits of ₹138.8 cr in FY23 and ₹36.0 cr in FY25 (prior-year tax); no exceptional items in FY26 or Q1FY27. Our forward P/E median on EPS before them is ${n1(X.medExOneOff)}x vs ${n1(X.HA.med)}x reported: immaterial.`,
      `**Other income is small and falling.** FY26 ₹${n1(OI26.total)} cr (interest on deposits ₹${n1(OI26.interestOnDeposits)} cr, FX ₹${n1(OI26.fxGain)} cr, rent ₹${n1(OI26.rent)} cr, gains on investments ₹${n1(OI26.gainOnInvestments)} cr), down from ₹${n1(OI26.totalFY25)} cr as cash was spent. We forecast ₹{{F.otherIncome.0|num}} / {{F.otherIncome.1|num}} / {{F.otherIncome.2|num}} cr.`,
      `**Leases move costs below EBITDA.** Under Ind AS 116 rent on the 68 leased stores is depreciation and interest, not opex (lease interest ₹${n1(C.financeCostFY26.leaseInterest)} cr in FY26). As leasing rises, EBITDA flatters slightly; PBT is the fairer comparison (CFO, 28-Jul-2026).`,
      `**Employee stock options** cost ₹${n1(C.fy26.consolidated.esop)} cr in FY26, charged to the P&L; dilution is ~0.2% a year (promoters 74.65% to 74.48% since Jun-2025).`,
      `**Tax** is ~25% on the store business and ~27% consolidated because DMart Ready's losses earn no tax credit.`,
    ] },
    { callout: '**Accounting flag: GREEN.** Unqualified audit by S R B C & Co (EY network), a simple single-segment business, full standalone and subsidiary disclosure, small related-party flows. Watch inventory days (up to ~33 from ~29) and the growing lease book.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Damani family owns ${OH.categories.promoters}% (Jun-2026) with no pledges: ${OH.promoters}. Because Indian rules require 25% public float, the promoters cannot buy more. Foreign portfolio investors own ${OH.categories.fii}%, domestic institutions ${OH.categories.dii}% and the public ${OH.categories.public}%. ${OH.trend}.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Holders (promoters from AR FY26; categories at Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: [...Object.entries(C.governance.promoterShareholders).map(([h, p]) => [h + ' (promoter group)', p + '%']), ['Foreign portfolio investors (Jun-2026)', OH.categories.fii + '%'], ['Domestic institutions (Jun-2026)', OH.categories.dii + '%'], ['Public and others (Jun-2026)', (OH.categories.public + OH.categories.government).toFixed(2) + '%']], source: 'AR FY26 notes 17 and 47 (Mar-2026); shareholding pattern for the quarter ended 30-Jun-2026 (Screener.in categories)' } },
  { callout: '**Our read:** a founder who has not sold a share and does not pledge. The flip side is a small free float (~25%), so index and fund flows move the stock more than earnings in the short run.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a quiet founder, a professional team, a planned CEO change',
  blocks: [
    { p: `${C.management.map(m => `${m.name}: ${m.role}`).join('; ')}. Auditor: ${C.governance.auditor}.` },
    { verdicts: [
      ['Audit and accounts', 'Strong', C.governance.auditor + '; no qualifications.', 'Low accounting risk.'],
      ['Board and control', 'Strong', 'Independent chairman (Chandrashekhar Bhave); founder not on the board; family holds 74.5%.', 'Owner-aligned, professionally run.'],
      ['Succession', 'Moderate', 'Noronha (on the board since 2006, MD & CEO until Jan-2026) handed over to Anshul Asawa on 1-Feb-2026 after a transition year; new CEO is investing in management depth and technology.', 'Execution risk is low but the strategy (leases, smaller stores, tech) is shifting at the margin.'],
      ['Related-party flows', 'Strong', C.governance.rpt + '.', 'Not a concern.'],
      ['Capital allocation', 'Moderate', 'All cash into stores; no dividends; DMart Ready absorbed ~₹1,488 cr of equity; borrowing again from FY26.', 'Disciplined on stores; the online bet has not paid.'],
      ['Disclosure', 'Moderate', 'Quarterly presentations and one analyst meet a year; no quarterly calls; store-level economics, DMart Ready KPIs not disclosed.', 'Investors see less than at most large Indian consumer companies.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (directors\' report, remuneration annexure, notes); analyst meet (28-Jul-2026); HSIE (investment in subsidiaries)' },
  ],
};

const hs = ST.find(s => s.broker === 'HDFC Securities'), mo = ST.find(s => s.broker === 'Motilal Oswal'), pl = ST.find(s => s.broker === 'Prabhudas Lilladher');
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, a little below the street',
  blocks: [
    { p: `We forecast the DMart stores (effective area × revenue per sq ft, each store year built from ${AS.build.storeAdds.join(' / ')} openings) and the subsidiaries separately, giving consolidated revenue growth of {{F.salesGrowth.0|chg}} / {{F.salesGrowth.1|chg}} / {{F.salesGrowth.2|chg}} and an EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}. Capex is ₹{{F.capex.0|num}} / {{F.capex.1|num}} / {{F.capex.2|num}} cr, depreciation ${AS.depRateOnGrossBlock}% of gross block, finance cost ₹{{F.interest.0|num}} / {{F.interest.1|num}} / {{F.interest.2|num}} cr (more leases and borrowings), tax ${AS.taxRate.join('% / ')}%, no dividend. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E', 'GAM FY29E', 'Street FY29E'], rows: [
      ['Revenue, consolidated (₹ cr)', '{{F.sales.0|num}}', `${n0(mo.revenue.FY27E)} (MOSL) / ${n0(pl.revenue.FY27E)} (PL)`, '{{F.sales.1|num}}', `${n0(mo.revenue.FY28E)} / ${n0(pl.revenue.FY28E)}`, '{{F.sales.2|num}}', `${n0(mo.revenue.FY29E)} (MOSL)`],
      ['EBITDA, consolidated (₹ cr)', '{{F.ebitda.0|num}}', `${n0(mo.ebitda.FY27E)} (MOSL)`, '{{F.ebitda.1|num}}', n0(mo.ebitda.FY28E), '{{F.ebitda.2|num}}', n0(mo.ebitda.FY29E)],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(hs.eps.FY27E)}** (HSIE, standalone)`, '**{{F.eps.1|n1}}**', `**${n1(hs.eps.FY28E)}**`, '**{{F.eps.2|n1}}**', `**${n1(hs.eps.FY29E)}**`] },
    ], source: 'MOSL and PL (28-Jul-2026, DSIJ summaries); HSIE company update (4-Aug-2026, standalone EPS). No dated consensus EPS before 30-Sep-2026 was found.' } },
    { callout: `Our consolidated revenue is ~2% below MOSL's and PL's because we assume a sharper productivity dilution from young stores (revenue per sq ft −2.5% in FY27E). HSIE's EPS is standalone, so it excludes DMart Ready's losses (~₹4.7 a share in FY26); allowing for that, we are still ~7-14% below it over FY27-29E, mainly on lower like-for-like growth (HSIE assumes 8.5% a year). EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E: area-led, with no margin help.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
