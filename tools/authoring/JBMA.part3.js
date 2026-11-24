// JBM Auto report, part 3: one chapter per segment (components, e-buses, tool room) and the competitive-advantage scorecard.
const X = require('./JBMA.ctx');
const { C, D, SA, SQ, BL, bld, n0, n1, yr, evShare } = X;
const rup = s => String(s).replace(/Rs ?/g, '₹');
const fy = SA.map(a => a.fy), r1 = v => Math.round(v * 10) / 10;
const y25 = yr('FY25'), y26 = yr('FY26'), q1 = SQ.find(q => q.q === 'Q1FY27');
const QL = SQ.map(q => q.q);
const segQ = key => SQ.map(q => q[key] ?? null);

const components = {
  id: 'components', nav: 'Components', kicker: 'Segment: components', title: 'Components: a steady sheet-metal supplier, growing with vehicle output at a 7-8% EBIT margin',
  blocks: [
    { p: `The component division is JBM Auto's original business and still most of its revenue: ₹${n0(y26.coRev)} cr in FY26 (+8%), ₹${n0(q1.coRev)} cr in Q1FY27 (+15.5%). It earns a thin but improving margin: segment EBIT was 3-6% in FY20-22 and ${n1(y25.coEbit / y25.coRev * 100)}% / ${n1(y26.coEbit / y26.coRev * 100)}% in FY25-26, with a return of ${n1(y26.coEbit / y26.coAssets * 100)}% on segment assets, the best capital return in the group after the tool room. Two customers each bought more than 10% of group revenue in FY26 (₹742 cr and ₹730 cr), most likely component customers (the note does not name them). Growth depends on Indian car, utility-vehicle and truck output and on winning parts on new models.` },
    { pair: [
      { type: 'column', title: `Component revenue: ₹1,455 cr (FY20) to ₹${n0(y26.coRev)} cr (FY26), ₹${n0(bld[2].co)} cr by FY29E`, unit: '₹ crore', x: [...fy, 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Revenue', values: [...SA.map(a => Math.round(a.coRev)), ...bld.map(r => Math.round(r.co))], fmt: 'num' }], labels: 'all', source: 'Annual reports (segment notes); GAM estimates' },
      { type: 'line', title: 'Component EBIT margin: 3.3% (FY21) to 7.9% (FY26)', unit: 'Segment EBIT margin (%)', x: [...fy, 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EBIT margin', values: [...SA.map(a => r1(a.coEbit / a.coRev * 100)), ...BL.coMargin], fmt: 'pct' }], labels: 'all', min: 0, max: 12, source: 'Annual reports; GAM estimates' },
    ] },
    { callout: `**Our forecast:** +${BL.coGrowth.join('% / +')}% in FY27-29E at ${BL.coMargin.join('% / ')}% EBIT. Q1FY27's +15.5% came after the Sep-2025 GST cut lifted car demand; we expect growth to slow as the base rises. This is a fair, unexciting business: it would justify a sector-average multiple on its own.` },
  ],
};

const ebus = {
  id: 'ebus', nav: 'E-buses', kicker: 'Segment: EV business', title: 'E-buses: revenue up ~10x in six years at an ~11% EBIT margin, but on a balance sheet that grew even faster',
  blocks: [
    { p: rup(`The EV business (the OEM division until Q1FY27) had revenue of ₹${n0(y26.evRev)} cr in FY26 (+16%) and ₹${n0(q1.evRev)} cr in Q1FY27 (+17%), and segment EBIT of ₹${n0(y26.evEbit)} cr (${n1(y26.evEbit / y26.evRev * 100)}%). Bus revenue is lumpy: ₹${n0(SQ.find(q => q.q === 'Q4FY26').evRev)} cr in Q4FY26 against ₹${n0(q1.evRev)} cr in Q1FY27, because it follows tender delivery schedules and is booked as buses are built (input method). Its segment assets rose from ₹${n0(y25.evAssets)} cr to ₹${n0(y26.evAssets)} cr in FY26, ₹${n0(y26.evAssets - y25.evAssets)} cr more for ₹${n0(y26.evRev - y25.evRev)} cr more revenue; segment liabilities (mostly suppliers) were ₹${n0(y26.evLiab)} cr. EBIT on segment assets was ${n1(y26.evEbit / y26.evAssets * 100)}% in FY26 (${n1(y25.evEbit / y25.evAssets * 100)}% in FY25), and ${n1(y26.evEbit / (y26.evAssets - y26.evLiab) * 100)}% on net segment assets.`) },
    { pair: [
      { type: 'column', title: `EV revenue: ₹239 cr (FY20) to ₹${n0(y26.evRev)} cr (FY26), ₹${n0(bld[2].ev)} cr by FY29E`, unit: '₹ crore', x: [...fy, 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Revenue', values: [...SA.map(a => Math.round(a.evRev)), ...bld.map(r => Math.round(r.ev))], fmt: 'num' }], labels: 'all', source: 'Annual reports (segment notes); GAM estimates' },
      { type: 'column', title: 'EV segment assets: ₹330 cr (FY20) to ₹5,129 cr (FY26)', unit: 'Segment assets (₹ crore)', x: fy, series: [{ name: 'Segment assets', values: SA.map(a => Math.round(a.evAssets)), fmt: 'num' }], labels: 'all', source: 'Annual reports (segment assets: receivables, unbilled revenue, inventories, plant, loans to the JV)' },
    ] },
    { pair: [
      { type: 'column', title: 'Quarterly EV revenue: lumpy, peaking in Q4', unit: '₹ crore', x: QL, series: [{ name: 'EV revenue', values: segQ('evRev'), fmt: 'num' }], labels: 'all', source: 'Exchange filings (XBRL); Q1-Q2FY26 derived (see segments.json)' },
      { type: 'line', title: `EV EBIT margin: ~11% since FY25; ${n1(BL.evMargin[2])}% by FY29E in our model`, unit: 'Segment EBIT margin (%)', x: [...fy, 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EBIT margin', values: [...SA.map(a => r1(a.evEbit / a.evRev * 100)), ...BL.evMargin], fmt: 'pct' }], labels: 'all', min: 0, max: 15, source: 'Annual reports; GAM estimates' },
    ] },
    { h: 'The JV that buys the buses' },
    { p: rup(`${C.structure.ecolife} ${C.structure.exposure} ${C.structure.jvLosses}`) },
    { bullets: [
      '**Why this matters for earnings.** JBM Auto books the profit on building a bus when it sells it to a GCC operator. When that operator is its own JV, the profit is real only if the JV is paid by the city and can pay JBM. Ecolife\'s losses come back to JBM through the equity-accounted share (₹32 cr in FY26), and its funding needs come back as loans, preference shares and guarantees.',
      '**What changed in 2025-26.** Outside money now funds Ecolife directly: IFC (US$100 mn, Sep-2025) and Motilal Oswal Alternates (₹750 cr of convertible and plain debentures, Jun-2026, of which ₹400-420 cr was used to repay JBM Auto). Crisil says funding responsibility has been "strategically shifted" from JBM Auto to the platform and expects receivables, investments and loans from JBM Auto to fall.',
      '**What could change next.** The press reported in Aug-2026 that Bain Capital was in talks to invest ~US$300 mn in the EV business; JBM said JBM Electric Vehicles evaluates fundraising options routinely and that nothing binding had been signed. A deal would put a price on the bus business but could also reduce JBM Auto\'s share of it (already 85%).',
    ] },
    { callout: `**Our forecast:** EV revenue +${BL.evGrowth.join('% / +')}% in FY27-29E at ${BL.evMargin.join('% / ')}% EBIT, taking buses to ~${Math.round(evShare[2])}% of revenue by FY29E (Crisil: above 40% within 1-2 years). The order pipeline (7,000-7,500 buses to execute over 2-3 years, Crisil) supports the volume; the constraint is funding at the operator, not demand.` },
  ],
};

const toolroom = {
  id: 'toolroom', nav: 'Tool room', kicker: 'Segment: tool room', title: 'Tool room: the best margin in the group (~20% EBIT), but only 6% of revenue',
  blocks: [
    { p: `The tool room designs and builds press tools, dies and moulds, for JBM's own presses and for outside customers. Revenue was ₹${n0(y26.trRev)} cr in FY26 (+11%) and ₹${n0(q1.trRev)} cr in Q1FY27 (+4%); EBIT ₹${n0(y26.trEbit)} cr (${n1(y26.trEbit / y26.trRev * 100)}%), down from 27% in FY20 as the business grew. Tooling revenue is also booked over time as tools are built. Segment assets jumped to ₹${n0(y26.trAssets)} cr in FY26 (₹${n0(y25.trAssets)} cr in FY25), so its return on assets fell to ${n1(y26.trEbit / y26.trAssets * 100)}%. We model +${BL.trGrowth.join('% / +')}% at ${BL.trMargin.join('% / ')}% EBIT.` },
    { exhibit: { type: 'line', title: 'Tool room EBIT margin: 27% (FY20) to 19.5% (FY26)', unit: 'Segment EBIT margin (%)', x: fy, series: [{ name: 'EBIT margin', values: SA.map(a => r1(a.trEbit / a.trRev * 100)), fmt: 'pct' }], labels: 'all', min: 0, max: 30, source: 'Annual reports (segment notes)' } },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale in e-buses, none in sheet metal',
  blocks: [
    { verdicts: [
      ['Scale and range in e-buses', 'Moderate', '~1,282 buses in FY26, ~20,000-bus capacity, full range', 'Helps win tenders; tenders are priced per km, so scale does not guarantee margin'],
      ['Integration with the operator', 'Double-edged', 'JBM Ecolife operates many of JBM\'s buses under GCC contracts', 'Wins orders; puts the customer\'s funding risk on the group'],
      ['Customer relationships in components', 'Weak-Moderate', 'Tata Motors, M&M, VECV; two customers >10% of revenue each', 'Sticky but build-to-print; prices set by the OEM'],
      ['Tooling know-how', 'Moderate', '~20% EBIT margin for 6+ years', 'Small business; mainly a cost advantage for components'],
      ['Cost of capital', 'Weak', 'Crisil A/Stable; debt/EBITDA 4.5x (FY26)', 'Funding is a constraint, not an advantage'],
    ], head: ['Source', 'Strength', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'AR FY26; Crisil (5-Aug-2026); GAM Research' },
    { callout: rup(`**Verdict:** ${D.moat.verdict} The returns say the same: ROCE has been 12-15% for five years (Screener), roughly the cost of capital.`) },
  ],
};

module.exports = { components, ebus, toolroom, moat };
