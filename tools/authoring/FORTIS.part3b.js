// Fortis report, part 3b: Agilus Diagnostics chapter and the competitive-advantage scorecard.
const X = require('./FORTIS.ctx');
const { C, D, F, AS, n0, n1, pc, rup, SA, SQ, QL, Q1, FY26, DG, diagM, YRS, P, shortName, AGILUS, buyoutFwd, diagMult, diagSep28, drEv, MED5EV } = X;

const agilus = {
  id: 'agilus', nav: 'Agilus Diagnostics', kicker: 'Diagnostics', title: 'Agilus: a national lab chain that lost three years; margins are back, growth is not yet',
  blocks: [
    { p: `Agilus (SRL until its 2024-25 rebranding) is the second business: pathology and some radiology through 4,493 customer touchpoints and a network of labs, half to consumers (B2C 53% in Q1FY27) and half to hospitals, labs and corporates (B2B). It had a Covid boom (FY22 gross revenue ₹1,605 cr, EBITDA ₹412 cr) and then a long hangover: FY23 revenue −16%, FY24 +2%, FY25 +3%, with the margin at 15-18% after rebranding costs and a contingent payment for an old lab acquisition. FY26 was the first good year (gross revenue +8.5% to ₹${n0(FY26.diagGross)} cr, operating margin 23.6%), and Q1FY27 grew 10.2% at 23.9%, but test volumes still rose only 3% (10.46 mn); most of the growth was realisation per test (+7% to ₹387). A new CEO, Vijender Singh, replaced Dr Anand K in Jul-2026 and guides 12-13% growth at 24-25% margins.` },
    { pair: [
      { type: 'column', title: 'Agilus revenue: below the FY22 Covid peak until FY26', unit: 'Gross revenue (₹ crore)', x: SA.map(r => r.fy), series: [{ name: 'Gross revenue', values: SA.map(r => r.diagRev), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'line', title: 'Margin recovered to ~24% (operating, before ESOP)', unit: 'Agilus operating EBITDA margin on gross revenue (%)', x: QL, series: [{ name: 'Margin', values: SQ.map(q => Math.round(q.diagEbitda / q.diagRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 10, max: 30, source: 'Company presentations (Q1FY25-Q3FY25 after rebranding one-offs)' },
    ] },
    { exhibit: { type: 'table', title: 'Agilus: what we model', head: ['', 'FY25', 'FY26', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Gross revenue (₹ cr)', n0(SA[3].diagRev), n0(SA[4].diagRev), n0(Q1.diagGross), ...DG.revenue.map(n0)],
      ['  growth', '+2.5%', '+8.5%', '+10.2%', ...AS.segments[1].growth.map(g => `+${g}%`)],
      ['Operating EBITDA (₹ cr)', n0(SA[3].diagEbitda), n0(SA[4].diagEbitda), n0(Q1.diagOpEbitda), ...DG.adjEbitda.map(n0)],
      ['  margin', '17.7%', '23.6%', `${Q1.diagOpMarginPct}%`, ...diagM.map(m => `${n1(m)}%`)],
      ['Tests (mn) / B2C share', '39.2 / 52%', '40.8 / 52%', `${Q1.agilusTestsMn} / ${Q1.agilusB2cPct}%`, '–', '–', '–'],
      ['Less: tests for Fortis hospitals (₹ cr)', '152', '171', '49', ...X.EL.revenue.map(v => n0(-v))],
    ], source: 'Company presentations; GAM estimates (FY25 margin after ₹61 cr of one-offs; FY26 incl. an ₹8 cr brand-fee write-back)' } },
    { exhibit: { type: 'table', title: 'What is Agilus worth? Four reference points', head: ['Reference', 'Multiple', 'Comment'], wide: [2], rows: [
      ['Fortis buys 31.21% from PE investors (FY25)', `~${n1(buyoutFwd)}x next-year EBITDA`, `₹${n0(AGILUS.buyoutCr)} cr for 31.21% = ~₹${n0(AGILUS.implied100)} cr for 100%; FY26 operating EBITDA excl. one-offs ₹352 cr`],
      ['Metropolis (30-Sep-2026)', `${n1(P.METROPOLIS.evEbitda)}x trailing`, `Similar margin (${P.METROPOLIS.ebitdaMargin}%), smaller; ${pc(drEv.METROPOLIS)} vs its five-year median (${n1(MED5EV.METROPOLIS)}x)`],
      ['Dr Lal PathLabs (30-Sep-2026)', `${n1(P.LALPATHLAB.evEbitda)}x trailing`, `Largest listed pathology chain by market value, ${P.LALPATHLAB.ebitdaMargin}% margin; ${pc(drEv.LALPATHLAB)} vs its median`],
      ['Street (Motilal Oswal, ICICI Securities)', '23-24x forward', 'Assumes Agilus re-rates towards listed peers'],
      { hl: true, cells: ['**GAM**', `**${diagMult}x Sep-28E**`, `**₹${n0(diagSep28)} cr Sep-28E EBITDA; a small premium to the buyout price, a discount to Metropolis for slower growth**`] },
    ], source: 'AR FY26 note 12(b); Screener.in (30-Sep-2026 close); broker notes; GAM Research' } },
    { callout: '**Our view:** the margin repair is real (B2C mix, test mix, lab rationalisation), but Agilus has not yet shown it can grow with the market (10-12%) against Dr Lal, Metropolis, hospital labs and online aggregators. The best evidence of its value is what Fortis itself paid minorities 18 months ago: ~16x forward EBITDA. Brokers at 23-24x are paying in advance for a recovery. A demerger or listing could unlock value, but management said in May-2026 it is "not the right time".' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: strong flagships and clusters, no network-wide moat',
  blocks: [
    { verdicts: [...D.moat.map(r => r.map(rup))], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Fortis has a real but narrow moat. FMRI and FEHI are destination hospitals with clinical reputations that take decades to build, and the NCR and Punjab clusters give it referral density and cheap brownfield growth. But most of its doctors are fee-for-service and can move (the ESOP is an admission of that), new hospitals in Noida and Gurugram compete for the same patients and doctors, a fifth of revenue comes from government payers who set prices, and Agilus has no edge it has been able to show in growth. Returns on capital (~13% ROCE) are only a little above its cost of capital, which is what a moderate moat looks like.' },
  ],
};

module.exports = { agilus, moat };
