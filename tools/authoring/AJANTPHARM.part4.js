// Ajanta Pharma report, part 4: Q1FY27 and guidance, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./AJANTPHARM.ctx');
const { C, D, F, A, AS, n0, n1, pc, SQ, QL, Q1, FY26, YRS, BL, build, ALL_LINES, LBL, base26, epsU, epsRep, epsExc, EXC_AT, TY, OI_BOOK, MISC, nc0, openCash, oiIncr, oi26exFx, ttmOiExFx, ttmOiRep, YIELD26, MF_YIELD, mosl, bob, plb, idir, CONS, b, ix } = X;
const gp = (a, z) => `${z >= a ? '+' : '−'}${Math.abs(Math.round((z / a - 1) * 100))}%`;

const guidance = {
  id: 'guidance', nav: 'Q1FY27 and guidance', kicker: 'Latest quarter', title: 'Q1FY27: revenue +25%, profit +31%, a beat everywhere but Asia; guidance of high-teens growth and a 27% margin held',
  blocks: [
    { p: `Ajanta reported Q1FY27 on 30-Jul-2026. Revenue rose 25% to ₹${n0(Q1.revenue)} cr: India +24%, US +57%, Africa branded +29%, institutional +84%, Asia −16%. Gross margin reached ${Q1.grossMarginPct}% (+100bp). EBITDA before FX losses rose 21% to ₹${Q1.adjEbitda} cr (${Q1.adjEbitdaMarginPct}%, −100bp) as staff costs grew ${gp(Q1.staffCostPrev, Q1.staffCost)} and other expenses ${gp(Q1.otherExpensesPrev, Q1.otherExpenses)}. Other income was ₹${n1(Q1.otherIncome)} cr including a ₹${n1(Q1.fxGain)} cr FX gain (the ₹${n1(Q1.fxLoss)} cr hedge loss sits in expenses), so profit rose 31% to ₹${n0(Q1.pat)} cr (EPS ₹${Q1.eps}) despite a 25.2% tax rate. Revenue beat MOSL by 7%, BOBCAPS by 11% and PL by 6%. The Board declared a first interim dividend of ₹32 a share (₹400 cr).` },
    { pair: [
      { type: 'column', title: 'Quarterly revenue: ₹1,626 cr in Q1FY27, +25%', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company; Screener.in' },
      { type: 'column', title: 'Quarterly EPS: ₹26.75 in Q1FY27', unit: 'EPS (₹), reported', x: 'Q.labels', series: [{ name: 'EPS', ref: 'Q.eps', fmt: 'n1' }], labels: 'all', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Q1FY27 in one table (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'YoY', 'Comment'], wide: [4], rows: [
      ['India branded', Q1.indiaPrev, Q1.india, gp(Q1.indiaPrev, Q1.india), '8 launches; IQVIA quarter ~18%'],
      ['Asia branded', Q1.asiaPrev, Q1.asia, gp(Q1.asiaPrev, Q1.asia), 'Shipments delayed by the Middle East war; expected in Q2'],
      ['Africa branded', Q1.africaPrev, Q1.africa, gp(Q1.africaPrev, Q1.africa), '3 launches; to moderate'],
      ['US generics', Q1.usPrev, Q1.us, gp(Q1.usPrev, Q1.us), 'US$51 mn, −7% QoQ in dollars; 2 launches'],
      ['Africa institutional', Q1.instPrev, Q1.inst, gp(Q1.instPrev, Q1.inst), 'Lumpy tenders'],
      { hl: true, cells: ['**Revenue**', n0(Q1.revenuePrev), n0(Q1.revenue), gp(Q1.revenuePrev, Q1.revenue), 'Incl. other operating revenue'] },
      ['EBITDA before FX losses (margin)', `${Q1.adjEbitdaPrev} (${Q1.adjEbitdaMarginPrevPct}%)`, `${Q1.adjEbitda} (${Q1.adjEbitdaMarginPct}%)`, gp(Q1.adjEbitdaPrev, Q1.adjEbitda), 'Guidance 27% ±1pp'],
      ['Other income (incl. FX gain)', n1(Q1.otherIncomePrev), n1(Q1.otherIncome), gp(Q1.otherIncomePrev, Q1.otherIncome), `FX gain ₹${n1(Q1.fxGain)} cr vs ₹9.4 cr`],
      { hl: true, cells: ['**Net profit**', n0(Q1.patPrev), n0(Q1.pat), gp(Q1.patPrev, Q1.pat), `EPS ₹${Q1.eps}; tax ${Q1.etrPct}%`] },
    ], source: 'Q1FY27 press release, results and presentation (30-Jul-2026)' } },
    { exhibit: { type: 'table', title: 'What management guided (by 30-Sep-2026)', head: ['Item', 'Guidance', 'Source'], wide: [1], rows: C.guidance, source: C.guidanceSrc } },
    { callout: '**Our read:** a strong quarter with two caveats. The US number was helped by the rupee and is already falling in dollars; management guided growth to slow to mid-single digits. And the beat was partly a net FX gain (₹20 cr). The branded engines (India, Africa) are the real news; Asia\'s recovery is the swing factor for the year.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean audit, no exceptional items, little capitalised spending; but cash conversion halved and FX is booked gross',
  blocks: [
    { p: `B S R & Co. (KPMG) gave an unmodified opinion on FY26. The company reports no exceptional items, expenses all R&D (intangibles only ₹38 cr) and has almost no contingent liabilities (₹8 cr). We flag three things. (1) **Cash conversion:** operating cash flow was ₹${n0(FY26.cfo)} cr in FY26, ${Math.round(FY26.cfo / FY26.pat * 100)}% of profit (FY25: ${Math.round(A.cfo[ix('FY25')] / A.pat[ix('FY25')] * 100)}%), because the US subsidiary stopped factoring receivables and funded them with ₹212 cr of loans. Factoring pulled cash forward in earlier years; FY26 is closer to the underlying cash cycle (receivables 125 days). (2) **FX presentation:** gains in other income, hedge losses in expenses, both gross (margins chapter); Screener calls the FY26 hedge loss an "exceptional item", the company does not. (3) **Tax:** a 23% rate helped by tax-exempt plants, rising to ~26% in FY27, and an income-tax search (Aug-2025) whose outcome is pending; the company filed its block-period return without undisclosed income.` },
    { exhibit: { type: 'table', title: 'Screener\'s "exceptional items" and why we ignore them in the base', head: ['Year', 'Screener exceptional after tax (₹ cr)', 'EPS reported (₹)', 'EPS ex Screener exceptional (₹)', 'What it is'], wide: [4], rows: [2022, 2023, 2024, 2025, 2026].map(y => [`FY${String(y).slice(2)}`, n0(EXC_AT[y]), n1(epsRep[y]), n1(epsExc[y]), y === 2026 ? 'The ₹103 cr hedge loss, net of tax; the ₹97 cr FX gain it hedged stays in profit' : 'Small FX/other reclassifications']), source: 'Screener.in schedules; Q1FY27 results ("profit before and after exceptional items"); AR FY26 note 38' } },
    { exhibit: { type: 'table', title: 'Accounting checklist', head: ['Test', 'Result', 'Flag'], wide: [1], rows: [
      ['Audit opinion (B S R & Co., KPMG network)', 'Unmodified, FY26', 'GREEN'],
      ['Cash conversion (CFO / profit)', `FY26 ${Math.round(FY26.cfo / FY26.pat * 100)}% (factoring stopped); FY20-25 average ${Math.round(['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25'].reduce((s, f) => s + A.cfo[ix(f)], 0) / ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25'].reduce((s, f) => s + A.pat[ix(f)], 0) * 100)}%`, 'AMBER'],
      ['Exceptional items', 'None reported by the company', 'GREEN'],
      ['Other income share of PBT', `FY26 ${Math.round(FY26.otherIncome.total / FY26.pbt * 100)}% reported, ${Math.round(oi26exFx / FY26.pbt * 100)}% excluding FX`, 'GREEN'],
      ['FX presentation', 'Gross gains/losses; reported EBITDA moves ±2pp with the rupee', 'AMBER'],
      ['Capitalised R&D / intangibles', 'None material', 'GREEN'],
      ['Tax', 'Income-tax search pending; exemption ending', 'AMBER'],
      ['Related parties', 'No royalty; small purchases (₹11 cr); family pay ₹60 cr', 'AMBER'],
    ], source: 'AR FY26; Screener.in; GAM' } },
    { callout: '**Overall: GREEN-AMBER (we show AMBER on the cover).** The profits are real and simple: no exceptional charges, no capitalised development, no minorities. The two things to monitor are working capital (whether 125 receivable days really is the new normal) and the income-tax search.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The Agrawal family owned ${D.ownership.jun2026.promoter}% at Jun-2026, through family trusts, Gabs Investments and Ganga Exports. ${C.governance.pledge}. Domestic institutions held ${D.ownership.jun2026.dii}% (mutual funds ${D.ownership.jun2026.mf}%), foreign institutions ${D.ownership.jun2026.fii}% and the public ${D.ownership.jun2026.public}% (${n0(D.ownership.jun2026.shareholders)} shareholders). The free float is small (~37%). ${D.ownership.blockBuyers}.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Promoter entities (Mar-2026; Ravi Agrawal Trust after the Jun-2026 sale)', head: ['Holder', '% of shares'], rows: D.ownership.promoterEntities.map(([h, p]) => [h, p.toFixed(2) + '%']), source: D.ownership.promoterEntitiesSrc } },
  { callout: `**Our read:** the executives' branch (Yogesh and Rajesh Agrawal, 28.9% through their trusts, no pledges) is stable. The overhang is the non-executive branch (Ravi and Aayush Agrawal trusts, ~21.5%): it sold 4.3% in Dec-2022 and 2.76% in Jun-2026, and, per the CFO, the pledged shares are theirs. More sales are possible; so far domestic funds have absorbed them.` },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a capable second-generation family team; high pay, promoter pledges and an income-tax search keep it AMBER',
  blocks: [
    { exhibit: { type: 'table', title: 'Who runs Ajanta', head: ['Name', 'Role', 'Note'], wide: [1, 2], rows: C.management, source: C.managementSrc } },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Assessment', 'Score'], wide: [1], rows: [
      ['Board', C.governance.board, 'AMBER'],
      ['Succession', C.governance.succession, 'AMBER'],
      ['Pay', C.governance.pay, 'RED'],
      ['Pledges and promoter sales', `${C.governance.pledge}. ${C.governance.promoterSales}`, 'AMBER'],
      ['Tax and conduct', C.governance.incomeTax, 'AMBER'],
      ['Related parties', C.governance.relatedParty, 'GREEN'],
      ['Auditor, disclosure, credit', `${C.governance.auditor}; sales by market every quarter; ${C.governance.credit}`, 'GREEN'],
      ['Capital allocation', 'Organic growth, high ROCE, five buybacks; no value-destroying M&A', 'GREEN'],
    ], source: C.governance.src } },
    { callout: '**Verdict: AMBER.** The operating record is excellent and the capital allocation shareholder-friendly. Against it: ₹55 cr a year for the MD and JMD (476x the median employee, 5% of profit), a Board where the four independents are all two years old, a non-executive family branch that sells and pledges, no visible succession plan, and an income-tax search still open. None of this has hurt minority shareholders so far; it is why the stock deserves no governance premium.' },
  ],
};

const STREET_F = [['Motilal Oswal', mosl], ['BOBCAPS', bob], ['PL', plb], ['ICICI Direct', idir]];
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}, below the street from FY28 because we expect the US to stall`,
  blocks: [
    { p: `We forecast revenue of ₹{{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), EBITDA margin (before FX) of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, tax of ${AS.taxRate.join(' / ')}% and EPS of ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}. FY27E revenue growth is below management's 16-18% because we assume Asia recovers only partly (+${BL.growth.asia[0]}%); FY27E EPS is ${pc((epsU[0] / CONS.FY27E - 1) * 100)} vs the Bloomberg consensus (₹${CONS.FY27E}). From FY28 the gap widens (FY28E ${pc((epsU[1] / CONS.FY28E - 1) * 100)} vs ₹${CONS.FY28E}): we have US sales +${BL.growth.us[1]}% where brokers have high single to double digits.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', ...STREET_F.map(s => s[0]), 'Consensus'], wide: [0], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', ...STREET_F.map(([, s]) => Object.values(s.sales).map(n0).join(' / ')), '–'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', ...STREET_F.map(([, s]) => Object.values(s.ebitda).map(n0).join(' / ')), '–'],
      ['EPS (₹)', n1(epsU[0]), n1(epsU[1]), n1(epsU[2]), ...STREET_F.map(([, s]) => Object.values(s.eps).map(n1).join(' / ')), `${CONS.FY27E} / ${CONS.FY28E}`],
    ], source: 'GAM; MOSL (30-Jul-2026), BOBCAPS (30-Jul-2026), PL (31-Jul-2026), ICICI Direct (3-Aug-2026); Bloomberg consensus as printed by BOBCAPS. Street columns show FY27E / FY28E. BOBCAPS and ICICI Direct EBITDA are after FX losses' } },
    { pair: [
      { type: 'hbar', title: 'FY28E EPS: GAM at the low end', unit: 'FY28E EPS (₹)', x: ['GAM', 'Consensus', 'Motilal Oswal', 'PL', 'BOBCAPS', 'ICICI Direct'], series: [{ name: 'FY28E EPS', values: [Math.round(epsU[1] * 10) / 10, CONS.FY28E, mosl.eps.FY28E, plb.eps.FY28E, bob.eps.FY28E, idir.eps.FY28E], fmt: 'n1' }], labels: 'all', highlight: 'GAM', source: 'Broker notes; GAM' },
      { type: 'stacked', title: 'Our revenue build by market', unit: 'Revenue (₹ crore); FY26 actual, FY27-29E GAM', x: ['FY26', ...YRS], series: [['India', ['india']], ['Asia', ['asia']], ['Africa (branded + institutional)', ['africa', 'inst']], ['US', ['us']], ['Other operating revenue', ['otherOp']]].map(([nm, ls], j) => ({ name: nm, values: [ls.reduce((s, l) => s + base26[l], 0), ...YRS.map((_, i) => ls.reduce((s, l) => s + build[l][i], 0))].map(Math.round), fmt: 'num', ...(j === 4 ? { grey: true } : {}) })), labels: 'none', source: 'Company; GAM (AJANTPHARM.ctx.js checks the sum against the model)' },
    ] },
    { exhibit: { type: 'table', title: 'Our main assumptions and why', head: ['Driver', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ['India growth', ...BL.growth.india.map(v => v + '%'), 'Q1 +24%; mid-teens guided; IQVIA 1.4x IPM'],
      ['Asia growth', ...BL.growth.asia.map(v => v + '%'), 'Q1 −16%; war not over; guidance mid-to-high teens'],
      ['Africa branded growth', ...BL.growth.africa.map(v => v + '%'), 'Q1 +29%; high double digit guided'],
      ['US growth (₹)', ...BL.growth.us.map(v => v + '%'), 'Mid-single digit CC guided + weaker rupee; erosion from FY28'],
      ['Africa institutional growth', ...BL.growth.inst.map(v => v + '%'), 'Lumpy; Q1 strong'],
      ['EBITDA margin (before FX)', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', '27% ±1pp guided; mix shifts to branded'],
      ['Capex (₹ cr)', ...AS.capex.map(n0), '~₹400 cr guided for FY27'],
      ['Tax rate', ...AS.taxRate.map(v => v + '%'), '~26% guided (exemption ends)'],
      ['Dividend payout', ...AS.payout.map(v => v + '%'), 'FY27 first interim ₹32 already declared'],
    ], source: 'GAM Research (assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Other income: built from its parts (₹ crore)', head: ['', 'FY26 actual', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Treasury income on the Mar-26 book (₹665 cr of cash and current investments)', n1(OI_BOOK), n1(OI_BOOK), n1(OI_BOOK), n1(OI_BOOK), `FY26 interest ₹51.6 cr + redemption gains ₹10.3 cr, held flat (realised ${n1(YIELD26)}% on average year-end balances; not split from other interest)`],
      ['Yield on net cash added after Mar-26', '–', ...oiIncr.map(n1), `${TY}% on engine net cash above ₹${n0(nc0)} cr (opening ₹${openCash.map(n0).join(' → ')} cr); debt funds earned ~${n1(MF_YIELD)}% in FY26`],
      ['Miscellaneous income', n1(MISC), n1(MISC), n1(MISC), n1(MISC), 'FY26 (FY25 ₹4.1 cr)'],
      ['FX gains', n1(FY26.otherIncome.fx), '0', '0', '0', 'Not forecast: offset by hedge losses in expenses, which our margin also excludes'],
      { hl: true, cells: ['**Total other income**', `**${n1(FY26.otherIncome.total)}**`, ...F.otherIncome.map(v => `**${n1(v)}**`), `FY26 excl. FX ₹${n1(oi26exFx)} cr; twelve months to Jun-26 excl. FX ₹${n1(ttmOiExFx)} cr (₹${n1(ttmOiRep)} cr reported)`] },
    ], source: 'AR FY26 note 38; Q1FY27 results note 5; Screener.in quarterly schedules; GAM (checked in AJANTPHARM.ctx.js)' } },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
