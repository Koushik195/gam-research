// Apollo Tyres report, part 3: the India (APMEA) segment, the Europe segment and the moat.
const X = require('./APOLLOTYRE.ctx');
const { C, D, SA, SQ, F, AS, n0, n1, rup, sa, segMargin, Q1, FY26 } = X;
const yrs = SA.map(r => r.fy), E = C.enschede, QS = Q1.standalone, QE = Q1.europe, RM = Q1.rm, PR = Q1.pricing;
const AP = AS.segments[0], EU = AS.segments[1];

const india = {
  id: 'india', nav: 'India (APMEA)', kicker: 'Segment: APMEA', title: 'India: share gains, full plants and a raw-material squeeze; margins should recover with a lag',
  blocks: [
    { p: `APMEA external revenue grew from ₹${n0(sa('FY20').apmeaRev)} cr (FY20) to ₹${n0(sa('FY26').apmeaRev)} cr (FY26). The India business (standalone) did ₹${n0(FY26.india.revenue)} cr in FY26 (+${n1((FY26.india.revenue / FY26.india.prior.revenue - 1) * 100)}%) at a ${FY26.india.ebitdaMarginPct}% EBITDA margin (${FY26.india.prior.ebitdaMarginPct}% in FY25), and accelerated through the year on the GST cut and the BCCI sponsorship: +${n1((SQ.find(q => q.q === 'Q3FY26').indiaRev / SQ.find(q => q.q === 'Q3FY25').indiaRev - 1) * 100)}% in Q3FY26, +${n1((SQ.find(q => q.q === 'Q4FY26').indiaRev / SQ.find(q => q.q === 'Q4FY25').indiaRev - 1) * 100)}% in Q4 and +${n1((QS.revenue / QS.prior.revenue - 1) * 100)}% in Q1FY27, with volume up ~12% (replacement +${QS.volumeGrowth.replacement}%, OEM +${QS.volumeGrowth.oem}%, exports +${QS.volumeGrowth.exports}%). The margin fell to ${QS.ebitdaMarginPct}% in Q1FY27 (${QS.prior.ebitdaMarginPct}%) as raw materials rose ~${RM.qoqPct}% q/q: natural rubber ~₹${RM.naturalRubberQ1}/kg, synthetic rubber ₹${RM.syntheticRubber}, carbon black ₹${RM.carbonBlack}, steel cord ₹${RM.steelCord}. Apollo cut advertising ~50% after the Q4 jersey activation to defend it.` },
    { pair: [
      { type: 'column', title: 'India revenue: +15.6% in Q1FY27, the fastest in 14 quarters', unit: 'Standalone revenue (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'India revenue', values: SQ.map(q => Math.round(q.indiaRev)), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'line', title: 'APMEA segment margin: 11-19% since FY20; we assume ~14-15%', unit: 'Segment EBITDA ÷ external revenue (%)', x: [...yrs, ...F.years], series: [{ name: 'APMEA', values: [...yrs.map(y => +n1(segMargin('apmea', y))), ...AP.marginPct], fmt: 'pct' }], labels: 'all', min: 5, max: 22, source: 'Annual reports (segment notes); GAM estimates FY27-29E' },
    ] },
    { exhibit: { type: 'table', title: 'The price-cost race in India (Q1FY27 call, 7-Aug-2026)', head: ['', 'What management said'], wide: [1], rows: [
      ['Raw-material inflation', `+${RM.qoqPct}% q/q in Q1; +${RM.q2ExpectedQoqPct}% more expected in Q2 (rubber ₹${RM.naturalRubberQ2}/kg); ~${RM.importedSharePct}% of inputs imported; rupee effect ${RM.rupeeEffectPct}%`],
      ['Price increase needed', `${PR.neededQ1Pct}% for Q1's costs ("two-thirds" rule); ${PR.neededTotalPct}% including Q2`],
      ['Price increase taken', `${PR.takenQ1Pct}; now ${PR.currentPct}; July +${PR.julyPct}%, August ${PR.augustPct}%`],
      ['OEMs', 'Formula pricing with a one-quarter lag for many; negotiated for truck OEMs, rolling in from Q2-Q3'],
      ['Competition', 'Followed with increases of similar magnitude; demand strong enough to absorb them (mid-to-high-teens growth in key categories)'],
      ['Outlook', 'Rubber to cool from Q3 (not affected by West Asia); best margins come when raw materials fall; prices may be cut in Q4 if costs fall sharply'],
    ], source: 'Q1FY27 earnings call transcript (filed 11-Aug-2026)' } },
    { callout: `**Our view:** we model APMEA revenue +${AP.growth.join('% / +')}% for FY27-29E and a segment margin of ${AP.marginPct.join('% / ')}% (FY26 ${n1(segMargin('apmea', 'FY26'))}%; FY20-26 average ~15%). That assumes standalone margins of ~12% in H1FY27, ~13.5% in H2 and 13.5-14% in FY28-29: a recovery with a lag, as in FY23-24, but not to the FY24 peak. The extra capacity from Andhra Pradesh (+10,500 PCR and +3,600 TBR tyres a day) matters for FY28-29 volume; until then growth is capped by utilisation in the 90s.` },
  ],
};

const europe = {
  id: 'europe', nav: 'Europe (Vredestein)', kicker: 'Segment: Europe', title: 'Europe: flat sales, a high-cost plant closed, and a margin target the company has missed for years',
  blocks: [
    { p: `Europe was ₹${n0(sa('FY26').eurRev)} cr of external revenue in FY26 (29% of the group), of which the manufacturing and sales business (Vredestein and Apollo brands) was EUR${FY26.europe.revenueEurMn} mn at a ${FY26.europe.ebitdaMarginPct}% EBITDA margin and ReifenCom (a German tyre distributor) EUR40-43 mn a quarter at a 2-3% margin (Q4FY26, Q1FY27). In euros the business has been flat for two years (EUR674 mn in FY25, EUR678 mn in FY26): the European replacement market has been "flattish to negative", while Dutch wages rose 12-13% over two to three years and energy stayed expensive (CFO, May-2026). The margin slid from 16%+ ("our earlier normal") to 14-15% in FY25-26 and ${QE.ebitdaMarginPct}% in Q1FY27. Premium mix is high: ultra-high-performance tyres were 50-52% of Europe's mix in Q3-Q4FY26.` },
    { pair: [
      { type: 'line', title: 'Europe margin: 8.9% in Q1FY27 with closure overlap costs', unit: 'EBITDA margin, excl. ReifenCom (%)', x: SQ.map(q => q.q), series: [{ name: 'Europe', values: SQ.map(q => q.europeMarginPct), fmt: 'pct' }], labels: 'all', min: 5, max: 20, source: 'Company presentations' },
      { type: 'line', title: 'Europe segment margin: we assume 12% / 14% / 15%', unit: 'Segment EBITDA ÷ external revenue (%)', x: [...yrs, ...F.years], series: [{ name: 'Europe', values: [...yrs.map(y => +n1(segMargin('eur', y))), ...EU.marginPct], fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Annual reports (segment notes); GAM estimates FY27-29E' },
    ] },
    { exhibit: { type: 'table', title: 'The Enschede closure', head: ['', 'Detail'], wide: [1], rows: [
      ['Timeline', rup(E.timeline)],
      ['Scale', rup(E.volume) + '; agri tyres ' + rup(E.agriShare)],
      ['Charges', rup(E.charges)],
      ['Cash', rup(E.cash)],
      ['Why', rup(E.why)],
      ['Benefit', rup(E.benefit)],
    ], source: 'AR FY26 note C18(d); Q4FY26 and Q1FY27 calls' } },
    { callout: `**Our view:** closing Enschede removes the highest-cost plant, but it also removes the only capacity for high-end farm tyres (now bought from two offtake partners) and some OE business. We model Europe revenue +${EU.growth.join('% / +')}% in rupees (mostly the euro and the Hungary ramp-up) and margins of ${EU.marginPct.join('% / ')}%. That is a recovery to roughly the FY24 level, not management's "high teens". Every 1pp of Europe margin is ~₹${n0(F.seg.eur.revenue[1] * 0.01)} cr of FY28E EBITDA, ~₹${n1(F.seg.eur.revenue[1] * 0.01 * (1 - AS.taxRate[1] / 100) / F.shares)} of EPS.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: brand and scale in Indian truck and car tyres; no cost moat; Europe still a weakness',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual reports, presentations and calls to Aug-2026)' },
    { callout: '**Honest verdict:** Apollo has a real franchise in India: the top-two position in truck radials, a strong replacement brand and dealer network, and scale that lets it add capacity when demand is there. That is a moat against new entrants, not against the cycle: it earns industry margins that rise and fall with rubber, and it has no cost advantage over MRF, CEAT or JK. Europe has a good brand (Vredestein) but has not earned a good return; the closure is an admission of that.' },
  ],
};

module.exports = { india, europe, moat };
