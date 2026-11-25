// BLS report, part 3: Visa & Consular (incl. Aadhaar), Digital Services, and the moat scorecard.
const X = require('./BLS.ctx');
const { D, SQ, SA, A26, F, BL, lines, seg, n0, n1, pc } = X;
const Lq = SQ.map(x => x.q), mg = (e, r) => SQ.map(x => Math.round(x[e] / x[r] * 1000) / 10);
const yoy = (k, i) => (i >= 4 ? Math.round((SQ[i][k] / SQ[i - 4][k] - 1) * 1000) / 10 : null);

const visa = {
  id: 'visa', nav: 'Visa & Consular', kicker: 'Segment', title: 'Visa & Consular: a 40% margin business whose volumes have stopped growing; Aadhaar adds revenue at a third of the margin',
  blocks: [
    { p: `The segment earned ₹${n0(A26.visaEbitda)} cr of EBITDA on ₹${n0(A26.visaRev)} cr of revenue in FY26 (${n1(A26.visaMargin)}%), ~90% of group EBITDA. Revenue grew 11% in FY26 and 22% in Q1FY27, but the Q1 growth was not from visas: applications were flat at 11.3 lakh (West Asia war; new Slovakia and Cyprus volumes offset losses elsewhere). Net revenue per application rose 11% to ₹3,521 on newer, better-priced contracts and more value-added services; Citizenship Invest earned ₹17.5 cr (₹11 cr), the UK hotel ₹16 cr (₹2.5 cr) and the new Aadhaar centres ₹17.5 cr. Excluding Aadhaar and the hotel, segment revenue grew ~15%. Management says net revenue per application is now "stabilising" because almost all centres are already self-managed, and guides 10-15% growth for the business.` },
    { pair: [
      { type: 'column', title: 'Visa & Consular revenue: ₹414 cr (Q1FY25) to ₹560 cr (Q1FY27)', unit: 'Segment revenue (₹ crore)', x: Lq, series: [{ name: 'Revenue', values: SQ.map(x => Math.round(x.visaRev)), fmt: 'num' }], labels: 'all', source: 'Company quarterly presentations' },
      { type: 'line', title: 'Segment margin: 29% to 40-42% in two years, now flat', unit: 'EBITDA ÷ revenue (%)', x: Lq, series: [{ name: 'Margin', values: mg('visaEbitda', 'visaRev'), fmt: 'pct' }], labels: 'all', min: 20, max: 45, source: 'Company quarterly presentations' },
    ] },
    { pair: [
      { type: 'column', title: 'Applications: growth has stopped (11.3 lakh, flat)', unit: 'Visa applications (lakh)', x: Lq, series: [{ name: 'Applications', values: SQ.map(x => x.apps), fmt: 'n1' }], labels: 'all', source: 'Company quarterly presentations' },
      { type: 'line', title: 'Net revenue per application: growth down to ~10% a year', unit: '₹ per application (revenue less cost of services)', x: Lq, series: [{ name: 'NRPA', values: SQ.map(x => x.nrpa), fmt: 'num' }], labels: 'all', source: 'Company quarterly presentations (Q4: net revenue ÷ applications)' },
    ] },
    { h: 'The Aadhaar Seva Kendras: big revenue, small margin' },
    { p: `UIDAI awarded BLS a ₹2,055 cr work order to set up and run Aadhaar Seva Kendras (enrolment and update centres) across India for six years, paid per transaction like a visa centre; Bihar added a ₹100 cr enrolment project. Capex is ~₹125 cr in three phases (₹75 cr spent by Aug-2026), which is why D&A rose 39% in Q1FY27. Management expects ~₹2,500 cr of revenue over six years, full run-rate from Q4FY27-Q1FY28, at a 10-15% EBITDA margin (it said 15-20% in May). We model ₹${BL.aadhaar.revenue[0]} / ${BL.aadhaar.revenue[1]} / ${BL.aadhaar.revenue[2]} cr for FY27-29E at ${BL.aadhaar.margin[0]}%: by FY28E Aadhaar is ~${Math.round(BL.aadhaar.revenue[1] / seg.visa.revenue[1] * 100)}% of segment revenue but ~${Math.round(lines.aadE[1] / seg.visa.adjEbitda[1] * 100)}% of its EBITDA, and it pulls the segment margin from 40% to ~36%.` },
    { exhibit: { type: 'table', title: 'Our Visa & Consular build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Visa & consular ex-Aadhaar: revenue', n0(BL.visaCore.base), ...lines.core.map(n0)],
      ['  growth', '+11%', ...BL.visaCore.growth.map(g => `+${g}%`)],
      ['  EBITDA (margin)', `${n0(A26.visaEbitda)} (${n1(A26.visaMargin)}%)`, ...lines.coreE.map((e, i) => `${n0(e)} (${BL.visaCore.margin[i]}%)`)],
      ['Aadhaar Seva Kendras: revenue', 'start-up', ...BL.aadhaar.revenue.map(n0)],
      ['  EBITDA (margin)', '–', ...lines.aadE.map((e, i) => `${n0(e)} (${BL.aadhaar.margin[i]}%)`)],
      { hl: true, cells: ['**Segment revenue**', `**${n0(A26.visaRev)}**`, ...seg.visa.revenue.map(v => `**${n0(v)}**`)] },
      { hl: true, cells: ['**Segment EBITDA (margin)**', `**${n0(A26.visaEbitda)} (${n1(A26.visaMargin)}%)**`, ...seg.visa.adjEbitda.map((e, i) => `**${n0(e)} (${n1(e / seg.visa.revenue[i] * 100)}%)**`)] },
    ], source: 'Company; GAM Research estimates (assumptions.json, businessLines)' } },
  ],
};

const digital = {
  id: 'digital', nav: 'Digital Services', kicker: 'Segment', title: 'Digital Services: 39% of revenue, ~10% of EBITDA, and ~47% owned by outside shareholders',
  blocks: [
    { p: `BLS E-Services (listed; BLS ~53%) runs ~1.58 lakh banking-correspondent and citizen-service touchpoints: cash deposits and withdrawals for SBI and other banks (GTV ₹29,500 cr in Q1FY27, +13%), assisted e-government services, insurance and, through Aadifidelis (57%, bought Nov-2024), loan distribution, where BLS earns 2-2.5% of each loan and passes most of it to agents (4-5% EBITDA margin). Aadifidelis contributed ~₹225 cr of the ₹330 cr Q1FY27 segment revenue. Revenue more than doubled in FY26 (₹${n0(A26.digRev)} cr) and grew 32% in Q1FY27, but the margin is ${n1(A26.digMargin)}% (8.0% in Q1). Atyati Technologies (bought 2-Jul-2026 for ₹156.82 cr; ~₹275 cr revenue, ₹20-21 cr EBITDA) adds a BC network for non-SBI banks and banking software from Q2FY27.` },
    { pair: [
      { type: 'column', title: 'Digital revenue: ₹79 cr (Q1FY25) to ₹330 cr (Q1FY27)', unit: 'Segment revenue (₹ crore)', x: Lq, series: [{ name: 'Revenue', values: SQ.map(x => Math.round(x.digRev)), fmt: 'num' }], labels: 'all', source: 'Company quarterly presentations' },
      { type: 'line', title: 'Margin: 15% before Aadifidelis, 6-8% since FY26', unit: 'EBITDA ÷ revenue (%)', x: Lq, series: [{ name: 'Margin', values: mg('digEbitda', 'digRev'), fmt: 'pct' }], labels: 'all', min: 0, max: 18, source: 'Company quarterly presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Our Digital build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Organic (incl. Aadifidelis): revenue', n0(BL.digitalOrganic.base), ...lines.org.map(n0)],
      ['  growth', '+114%', ...BL.digitalOrganic.growth.map(g => `+${g}%`)],
      ['  EBITDA (margin)', `${n0(A26.digEbitda)} (${n1(A26.digMargin)}%)`, ...lines.orgE.map((e, i) => `${n0(e)} (${BL.digitalOrganic.margin[i]}%)`)],
      ['Atyati (from 2-Jul-2026): revenue', '–', ...BL.atyati.revenue.map(n0)],
      { hl: true, cells: ['**Segment revenue**', `**${n0(A26.digRev)}**`, ...seg.dig.revenue.map(v => `**${n0(v)}**`)] },
      { hl: true, cells: ['**Segment EBITDA (margin)**', `**${n0(A26.digEbitda)} (${n1(A26.digMargin)}%)**`, ...seg.dig.adjEbitda.map((e, i) => `**${n0(e)} (${n1(e / seg.dig.revenue[i] * 100)}%)**`)] },
    ], source: 'Company; GAM Research estimates (assumptions.json, businessLines)' } },
    { callout: `**So what:** Digital doubles group revenue growth but adds little to BLS shareholders' EPS. In FY28E we expect it to earn ~₹${n0(seg.dig.adjEbitda[1])} cr of EBITDA, of which outside shareholders own roughly half. The segment matters more as a source of cash-hungry acquisitions (Aadifidelis, Atyati) than as a profit engine.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'A narrow moat: scale and track record in a two-player niche, but every contract is re-tendered',
  blocks: [
    { verdicts: [
      ['Scale and track record', 'Moderate', D.moat.scale, 'Wins eligibility in technical scoring; does not decide price.'],
      ['Contract length and exclusivity', 'Moderate', D.moat.switching, 'Visibility for 3-10 years, then a re-tender.'],
      ['Pricing power', 'Weak-Moderate', D.moat.pricing, 'Further gains depend on value-added services, which regulators and governments watch (the MEA order cited them).'],
      ['Client concentration', 'Weak', 'Spain and Indian government work are large (Indian missions ~12% of revenue in Q1FY26); country revenue is not disclosed', 'One lost tender can take a visible slice of profit.'],
      ['Digital Services', 'None', 'BC banking, assisted services and loan distribution are open, low-margin markets (4-8% EBITDA margins)', 'Growth without a moat.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'Company decks and calls; AR FY26; Delhi High Court judgment (18-Dec-2025); GAM Research' },
    { callout: `**Verdict:** ${D.moat.verdict}` },
  ],
};

module.exports = { visa, digital, moat, yoy };
