// OneSource report, part 4: moat, margins, earnings quality, capital and returns, ownership, management and governance.
const X = require('./ONESOURCE.ctx');
const { C, D, A, F, AS, n0, n1, b, FY26, BS, OIN, AMORT, epsU, epsAdj, ptEbitda, ptShare, EVM, SHARES, cashPath } = X;
const MG = C.management, OW = D.ownership, RC = C.relatedCosts.FY26;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a head start in GLP-1 fill-finish and a clean regulatory record; no scale advantage and a moat that narrows as capacity arrives',
  blocks: [
    { p: 'A moat is a lasting advantage that lets a company earn more than its cost of capital for longer than rivals. OneSource has a lead, which is not quite the same thing. It built GLP-1 cartridge and pen capacity before the rush, qualified it with regulators (USFDA, EU, Health Canada, ANVISA) and got its customers\' products filed on its site; switching a filed product costs a customer time and new filings. But fill-finish and assembly are not secret technology, generic majors are building their own lines, and management itself says the supply gap lasts "at least for next 2 years".' },
    { verdicts: D.moat.map(m => [m.factor, m.score, X.rup(m.evidence), m.score]), head: ['Factor', 'Score', 'Evidence', 'Detail'], title: 'Moat scorecard: two strong, two moderate, two weak', source: 'AR FY26; decks and calls FY26-27; CARE; GAM Research' },
    { callout: '**Verdict:** a narrow, time-limited moat. It is strong enough to fill three lines through FY28 and to win development work in biologics; it is not yet strong enough to protect prices once capacity is plentiful. We would pay for the head start, not for durability.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: the cost base is built for three lines; every quarter of delay costs margin. We model 31.5% → 39%, below the guided 40%',
  blocks: [
    { p: `Gross margin is high (63-74% in the last nine quarters) because customers supply the expensive active ingredient and OneSource bills conversion. What moves the EBITDA margin is fixed cost: employee costs rose from ₹215 cr to ₹242 cr in FY26 (380+ hires for the new lines) and other expenses from ₹328 cr to ₹430 cr, including legal and professional fees of ₹148 cr. With revenue flat, the margin fell from 32% to 21%; at ₹290 cr of revenue in Q3FY26 it was 6%. Q1FY27 was 27.5% on line 1 at full revenue while the costs of lines 2-3 were already incurred.` },
    { pair: [
      { type: 'line', title: 'Quarterly margins: gross 63-74%, EBITDA 6-43%', unit: '% of revenue', x: X.SQ.map(q => q.q), series: [{ name: 'Gross margin', values: X.SQ.map(q => q.grossMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: X.SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 80, source: 'Screener.in (gross margin = 100 − material cost %); company decks' },
      { type: 'column', title: 'Costs, % of revenue: people and overheads rose in FY26', unit: '% of revenue', x: ['FY25', 'FY26', 'Q1FY27'], series: [{ name: 'Materials', values: [30.1, 31.3, 31.7], fmt: 'pct' }, { name: 'Employees', values: [14.9, 17.0, 15.3], fmt: 'pct' }, { name: 'Other costs', values: [22.7, 30.3, 25.5], fmt: 'pct' }], labels: 'all', source: 'Screener.in expense schedules' },
    ] },
    { exhibit: { type: 'table', title: 'From Q1FY27 to our margins', head: ['Step', 'EBITDA margin', 'Why'], wide: [2], rows: [
      ['FY26 reported', `${n1(A.ebitdaMargin[b])}%`, `Includes a ₹${n1(FY26.forexGainInOpex)} cr forex gain (~2 points)`],
      ['Q1FY27 reported', `${C.q1fy27.ebitdaPct}%`, 'Line 1 full; opex for lines 2-3 already in'],
      { hl: true, cells: ['**Our FY27E**', '**{{F.ebitdaMargin.0|pct}}**', 'Quarterly margin rising to ~36% by Q4; injectables shutdown in Q2-Q3'] },
      ['Our FY28E / FY29E', '{{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}', 'Three then four lines; guided ~40% steady state; price competition'],
      ['Street FY28E', '40.0-41.3%', 'SBICAP, JM, ICICI Securities'],
    ], source: 'Screener.in; company calls; broker notes; GAM estimates' } },
    { callout: `**Every point of margin** in FY28-29E is ~₹${n0(ptEbitda)} cr of Sep-28E EBITDA and ~₹${n0(ptShare)} a share at our ${EVM.base}x.` },
  ],
};

const earnings = {
  id: 'quality-earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: amber-to-red. A flattering "adjusted PAT", forex inside EBITDA, very high legal fees, receivables at 177 days and an unprovided US$136m claim',
  blocks: [
    { p: `Deloitte audited FY26 without qualification (rotation to BSR/KPMG is under way). The key audit matters were the impairment test of the ₹${n0(BS.goodwill)} cr of goodwill (value in use at a 16.3% pre-tax discount rate; headroom: the rate would have to reach 34.6%) and revenue recognised near the year-end. Operating cash flow was −₹${n0(-A.cfo[1])} cr in FY25 and ₹${n0(A.cfo[2])} cr in FY26 against EBITDA of ₹${n0(A.ebitda[1])} cr and ₹${n0(A.ebitda[2])} cr.` },
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'Effect'], wide: [0, 1], rows: [
      [`Company "adjusted PAT" adds back the full ₹${n0(AMORT)} cr of scheme amortisation and exceptional items, but not the deferred-tax credit that comes with the amortisation`, `FY26 adjusted PAT ₹74 cr vs reported −₹74 cr. Our 'before amortisation' EPS uses the after-tax add-back (FY28E ₹${n1(epsAdj[1])} vs ₹${n1((F.pat[1] + AMORT) / SHARES)} on the company's method)`],
      [`Forex gain of ₹${n1(FY26.forexGainInOpex)} cr inside other expenses`, '~10% of FY26 EBITDA; we forecast none'],
      [`Legal and professional fees ₹${n0(FY26.legalProfessional)} cr (10% of revenue); support services ₹${n0(FY26.supportServices)} cr`, 'Not explained in the AR; part paid to promoter-group companies (Arcolab ₹36 cr, Strides ₹25 cr support services)'],
      ['Receivables 177 days; inventory ₹439 cr; ₹12.6 cr loss allowance and ₹13.1 cr of sales returns in FY26', 'Cash conversion weak until the ramp; management: inventory is customer-funded'],
      [`Prestige claim US$${n1(BS.prestigeClaimUsd)}m (₹${n0(BS.prestigeClaim)} cr) at SIAC, not provided`, `~₹${n0(BS.prestigeClaim / SHARES)} a share if lost in full; legal costs booked as exceptional (₹4.5 cr FY26, ₹4.3 cr Q1FY27)`],
      [`₹${n0(BS.iaudSuspended)} cr of intangible projects 'temporarily suspended' for 3+ years`, 'Possible write-off; not in our forecasts'],
      [`₹${n0(BS.unrecognisedDta)} cr of unrecognised deferred tax assets on losses`, 'Low tax while used (10% / 15% in FY27-28E); full rate from FY29E'],
    ], source: 'AR FY26 (auditor report, notes 4F, 4G, 20, 21, 26-28, 32, 34); Q4FY26 call' } },
    { exhibit: { type: 'table', title: 'Other income (₹ crore)', head: ['', 'FY25', 'FY26', 'Recurring?'], rows: [
      ['Interest on deposits and receivables', n1(OIN.FY25.interest), n1(OIN.FY26.interest), 'Yes, on a smaller cash balance'],
      ['Unwinding of deposits; scrap', n1(OIN.FY25.depositUnwind + OIN.FY25.scrap), n1(OIN.FY26.depositUnwind + OIN.FY26.scrap), 'Yes'],
      ['Support-service income (promoter-group entities)', n1(OIN.FY25.supportServices), n1(OIN.FY26.supportServices), 'Yes, related party'],
      ['Investment and lease gains; tax-refund interest', n1(OIN.FY25.investmentGains + OIN.FY25.leaseGain), n1(OIN.FY26.investmentGains + OIN.FY26.taxRefundInterest), 'No'],
      { hl: true, cells: ['**Total**', `**${n1(OIN.FY25.total)}**`, `**${n1(OIN.FY26.total)}**`, 'Small against EBITDA'] },
    ], source: 'AR FY26 note 21' } },
    { callout: '**Accounting flag: RED.** No single item is aggressive accounting, but together they mean reported profit understates (amortisation) while the company\'s adjusted profit overstates (tax), cash conversion has been poor, a large claim sits off balance sheet, and the cost lines with the most related-party content are also the least explained.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital & returns', kicker: 'Capital allocation', title: 'Capital allocation: equity raised, then debt-funded capex; returns are negative on the merger equity and guided to >50% only on operating capital',
  blocks: [
    { p: `Since the merger OneSource has raised ₹801 cr of equity (Nov-2024), spent ₹${n0(A.capex[1] + A.capex[2])} cr on capex in FY25-26 and borrowed the rest; it pays no dividend. ROE was ${n1(A.roe[2])}% in FY26 because equity includes ₹${n0(BS.goodwill + BS.otherIntangibles)} cr of merger goodwill and intangibles; the company's ">50% ROCE" target excludes them. We forecast ROE of {{F.roe.0|pct}} / {{F.roe.1|pct}} / {{F.roe.2|pct}} and return on operating capital (engine, ex goodwill) of {{F.coreRoce.0|pct}} / {{F.coreRoce.2|pct}} in FY27E / FY29E. Net debt peaks at ~₹${n0(-cashPath[1])} cr at Mar-27E in our model.` },
    { callout: '**Our view:** the capex is well aimed (sold-out capacity) and funded within the 1.5x net debt/EBITDA guide, but two capital decisions worry us: the promoter group sold heavily after listing, and the board proposed buying promoter-owned businesses with shares at a valuation minorities rejected. Shareholders should expect more capex (biologics, soft-gel greenfield, a fourth line) before any payout.' },
  ],
};

module.exports = { moat, margins, earnings, capital };
