// Vishal Mega Mart report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./VMM.ctx');
const { C, D, F, A, AS, SQ, n0, n1, n2, pc1, b, OI26, FY26, Q1, BS, ST, sq } = X;
const G = C.guidance, q = sq, yoy = (a, p) => pc1((a / p - 1) * 100);
const [q1a, q4, q1] = [q('Q1FY26'), q('Q4FY26'), q('Q1FY27')];
const QM = X.M.quarterly, qi = l => QM.labels.indexOf(l), qv = (k, l) => QM[k][qi(l)];

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: `Q1FY27: revenue +${Q1.growthPct}%, SSSG ${Q1.sssgPct}%, profit +${Math.round((Q1.pat / Q1.patQ1FY26 - 1) * 100)}%; minimum wages held the margin flat`,
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'y/y'], rows: [
      ['Revenue from operations', n0(q1a.revenue), n0(q4.revenue), n0(q1.revenue), yoy(q1.revenue, q1a.revenue)],
      ['Same-store sales growth (adjusted)', q1a.sssgPct + '%', q4.sssgPct + '%', q1.sssgPct + '%', ''],
      ['Gross margin', q1a.grossMarginPct + '%', q4.grossMarginPct + '%', q1.grossMarginPct + '%', ''],
      ['EBITDA (reported, after Ind AS 116)', n0(qv('ebitda', 'Q1FY26')), n0(qv('ebitda', 'Q4FY26')), n0(qv('ebitda', 'Q1FY27')), yoy(qv('ebitda', 'Q1FY27'), qv('ebitda', 'Q1FY26'))],
      ['Operating EBITDA (pre-Ind AS 116, pre-ESOP)', n0(q1a.operatingEbitda), n0(q4.operatingEbitda), n0(q1.operatingEbitda), yoy(q1.operatingEbitda, q1a.operatingEbitda)],
      ['  margin', q1a.operatingMarginPct + '%', q4.operatingMarginPct + '%', q1.operatingMarginPct + '%', ''],
      { hl: true, cells: ['**Net profit**', `**${n0(qv('pat', 'Q1FY26'))}**`, `**${n0(qv('pat', 'Q4FY26'))}**`, `**${n0(qv('pat', 'Q1FY27'))}**`, `**${yoy(qv('pat', 'Q1FY27'), qv('pat', 'Q1FY26'))}**`] },
      ['Stores at quarter end (net added)', `${q1a.stores} (${q1a.netAdds})`, `${q4.stores} (${q4.netAdds})`, `${q1.stores} (${q1.netAdds})`, ''],
      ['Retail area (mn sq ft)', n1(q1a.areaMnSqft), n1(q4.areaMnSqft), n1(q1.areaMnSqft), yoy(q1.areaMnSqft, q1a.areaMnSqft)],
    ], source: 'Q1FY27 and Q4FY26 presentations; Screener.in (reported EBITDA and profit)' } },
    { bullets: [
      `**Growth:** SSSG ${Q1.sssgPct}% from 7-8% more customers and ~3% more spend per existing customer; fashion price points +13.9%. All three categories grew 18-19%. The CEO expects the inflation drag on demand to "taper down" in later quarters.`,
      `**Margins:** gross margin +30bp (fewer promotions, no significant price increases); employee cost +${Math.round((Q1.employee / Q1.employeeQ1FY26 - 1) * 100)}% on minimum-wage rises in Haryana, UP, Telangana and Karnataka ("a structural change", CFO); ESOP cost fell to ₹${Q1.esop} cr (₹${Q1.esopQ1FY26} cr). Operating margin ${Q1.operatingMarginPct}% (10.3%).`,
      `**Guidance (analyst meet, Sep-2026):** ${G.stores}`,
      `**Growth and margins:** ${G.growth} ${G.margins}`,
      `**Inflation:** ${G.inflation}`,
    ] },
    { callout: '**Why it matters:** Q1 showed the model working under stress: double-digit SSSG and a stable margin while inputs and wages inflated. The festival shift (Durga Puja in Q3FY27 vs Q2 last year) will make Q2 look weak and Q3 strong; judge H1 and H2 together.' },
  ],
};

const leasePay = FY26.leasePrincipal + FY26.leaseInterest;
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean accounts, no one-offs; watch the lease accounting, the ESOP charge and the promoter\'s logistics contracts',
  blocks: [
    { bullets: [
      `**Rent is below EBITDA.** Under Ind AS 116 the ₹${n0(FY26.rentIndAs116)} cr FY26 rent bill becomes depreciation and interest, so reported EBITDA (${FY26.ebitdaMarginPct}% company basis) is far above the company's own operating EBITDA (${FY26.operatingEbitdaMarginPct}%). PBT is the fair yardstick; we treat new leases as capex.`,
      `**Cash conversion is good after rent.** CFO ₹${n0(FY26.cfo)} cr less rent paid (₹${n0(leasePay)} cr) = ₹${n0(FY26.cfo - leasePay)} cr, ${Math.round((FY26.cfo - leasePay) / FY26.operatingEbitda * 100)}% of operating EBITDA after tax; customers pay at the till and suppliers fund most inventory.`,
      `**No one-offs.** No exceptional items in FY22-26 or Q1FY27. Other income (₹${n1(OI26.total)} cr in FY26) is mostly gains on liquid funds (₹${n1(OI26.mfSaleGains + OI26.mfFairValueGains)} cr) and deposit interest, and rises as cash builds: we forecast ₹{{F.otherIncome.0|num}} / {{F.otherIncome.1|num}} / {{F.otherIncome.2|num}} cr.`,
      `**ESOPs are a real cost.** ₹${n0(FY26.esop)} cr in FY26 (₹${n0(C.fy25.esop)} cr in FY25), ~4.5% of PBT, charged in employee cost; 5.6 cr options (1.2% of shares, average exercise price ₹45) were outstanding at Mar-26. The company's "adjusted PAT" adds the charge back; we do not.`,
      `**Related parties.** The promoter, Samayat Services LLP, billed ₹72 cr of transport and ₹31 cr of warehousing in FY26 (₹87 cr in FY25): ~0.8% of revenue paid to the controlling shareholder for logistics.`,
      `**Classification.** Screener puts bank and card charges (₹32 cr) in finance cost, so its FY26 EBITDA (₹${n0(A.ebitda[b])} cr) is ₹34 cr above the company's (₹${n0(FY26.ebitda)} cr); the model uses Screener's basis consistently.`,
    ] },
    { callout: '**Accounting flag: GREEN.** Unmodified audit by Walker Chandiok (Grant Thornton network), one reporting segment, quarterly presentations with SSSG, area and category data. The ₹4,284 cr goodwill is the main balance-sheet judgement; an impairment would hit book value, not cash.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `At Jun-2026 the promoter, Samayat Services LLP (controlled by Kedaara Capital, with Partners Group), owned ${OH.categories.promoters}% with no pledge. Domestic institutions owned ${OH.categories.dii}%, foreign portfolio investors ${OH.categories.fii}% and the public ${OH.categories.public}%. ${OH.trend}. The board proposed, for the 18-Sep-2026 AGM, a 49.99% cap on total foreign ownership so that the subsidiary Airplaza's multi-brand business stays Indian-owned and controlled.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Holders (named holders above 5% at Mar-2026; categories at Jun-2026)', head: ['Holder', 'Stake'], wide: [0], rows: [['Samayat Services LLP (promoter; Kedaara Capital and Partners Group), Mar-2026', '40.12%'], ['HDFC Large and Mid Cap Fund, Mar-2026', '9.25%'], ['Domestic institutions (Jun-2026)', OH.categories.dii + '%'], ['Foreign portfolio investors (Jun-2026)', OH.categories.fii + '%'], ['Public and others (Jun-2026)', OH.categories.public + '%']], source: 'AR FY26 note 13A (Mar-2026); shareholding pattern for the quarter ended 30-Jun-2026 (Screener.in categories)' } },
  { callout: '**Our read:** a private-equity owner in exit mode. Samayat sold ~19% in Jun-2025 and 14% in Feb-2026 (at ~₹117, 8% below the market); management says the sponsors are long-term holders with no immediate plan to sell (HSIE), but 40% is a lot of stock, and each block has come at a discount.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a strong operator kept to 2031, a PE-shaped board, and a sponsor that is selling',
  blocks: [
    { p: `${C.management.map(m => `${m.name}: ${m.role}`).join('; ')}. Auditor: ${C.governance.auditor}. Board: ${C.governance.board}.` },
    { verdicts: [
      ['Audit and accounts', 'Strong', C.governance.auditor + '.', 'Low accounting risk.'],
      ['Board and control', 'Moderate', 'Two independent directors of six; three non-executive directors linked to the sponsors; independent chair re-appointed for one year only (to Sep-2027).', 'Board independence will need to rise as the sponsor exits.'],
      ['Succession', 'Moderate', 'Gunender Kapur (65) re-appointed MD & CEO to Aug-2031 (board, Aug-2026); COO Manoj Kumar left in Jul-2026 (Sashi Gumma replaced him).', 'Near-term key-man risk eased; long-term succession open.'],
      ['Related-party flows', 'Moderate', C.governance.rpt + '.', 'Small, disclosed, but paid to the controlling shareholder.'],
      ['Capital allocation', 'Strong', 'Leased stores, no debt, cash capex ~2.5% of revenue; no acquisitions; no dividend yet despite rising cash.', 'Disciplined; payout policy undecided.'],
      ['Disclosure', 'Strong', 'Quarterly calls and presentations with SSSG, stores, area, categories and own-brand share; annual analyst meet.', 'Better than most Indian retailers.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (notice, directors\' report, notes 13A and 35); Q1FY27 call; Business Today (24-Aug-2026); HSIE (25-Sep-2026)' },
  ],
};

const hs = ST.find(s => s.broker === 'HDFC Securities'), em = ST.find(s => s.broker === 'Emkay');
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n2}} / ₹{{F.eps.1|n2}} / ₹{{F.eps.2|n2}}, ~5% below the street',
  blocks: [
    { p: `We forecast revenue from the store build (${AS.build.netAdds.join(' / ')} net stores, revenue per sq ft +${AS.build.revPerSqftGrowth.join('% / +')}%): growth of {{F.salesGrowth.0|chg}} / {{F.salesGrowth.1|chg}} / {{F.salesGrowth.2|chg}}. Reported EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} (Screener basis; company basis ~0.25pp lower). Capex including new leases ₹{{F.capex.0|num}} / {{F.capex.1|num}} / {{F.capex.2|num}} cr, D&A ₹{{F.dep.0|num}} / {{F.dep.1|num}} / {{F.dep.2|num}} cr, finance cost ₹{{F.interest.0|num}} / {{F.interest.1|num}} / {{F.interest.2|num}} cr (lease interest and bank charges), other income built from treasury yield on rising cash, tax ${AS.taxRate[0]}%, no dividend. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Finance cost', ref: 'fin.interest' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (incl. new leases in forecasts)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Historical capex is cash capex only; forecast capex adds new right-of-use assets.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E', 'GAM FY29E', 'Street FY29E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', `${n0(hs.revenue.FY27E)} (HSIE) / ${n0(em.revenue.FY27E)} (Emkay)`, '{{F.sales.1|num}}', `${n0(hs.revenue.FY28E)} / ${n0(em.revenue.FY28E)}`, '{{F.sales.2|num}}', `${n0(hs.revenue.FY29E)} / ${n0(em.revenue.FY29E)}`],
      ['EBITDA, reported (₹ cr)', '{{F.ebitda.0|num}}', `${n0(em.ebitda.FY27E)} (Emkay)`, '{{F.ebitda.1|num}}', n0(em.ebitda.FY28E), '{{F.ebitda.2|num}}', n0(em.ebitda.FY29E)],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n2}}**', `**${n1(hs.eps.FY27E)} / ${n1(em.eps.FY27E)}**`, '**{{F.eps.1|n2}}**', `**${n1(hs.eps.FY28E)} / ${n1(em.eps.FY28E)}**`, '**{{F.eps.2|n2}}**', `**${n1(hs.eps.FY29E)} / ${n1(em.eps.FY29E)}**`] },
    ], source: 'HSIE company update (25-Sep-2026); Emkay result update (23-Jul-2026). Brokers publish EPS to one decimal. Our EBITDA is on Screener\'s basis (~₹35-50 cr higher than the company basis because bank charges sit in finance cost).' } },
    { callout: `Our revenue is in line with HSIE and ~1-3% below Emkay; our EPS is ~5% below both because we assume less margin gain (company-basis EBITDA margin ~14.55% / 14.75% / 14.95%, close to Emkay's 14.5% / 14.9% / 15.1%) and slightly higher D&A as leases grow. EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E: area plus productivity plus modest operating leverage.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
