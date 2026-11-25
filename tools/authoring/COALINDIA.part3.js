// Coal India report, part 3: FSA (notified-price coal), e-auctions, the cost base, the subsidiaries and their listings,
// and the moat.
const X = require('./COALINDIA.ctx');
const { C, D, SG, AS, F, bld, n0, n1, pc, pc1, MULT, shares, mcap } = X;
const BL = AS.build, B0 = BL.base, SM = C.salesMix, f26 = C.fy26, Q = C.q1fy27;
const g = (a, b) => pc1((a / b - 1) * 100);
const perT = v => n0(v / 744.83 * 10);

const fsa = {
  id: 'fsa', nav: 'FSA coal (notified price)', kicker: 'Channel: fuel supply agreements', title: 'FSA coal: 87% of volume at notified prices unchanged from Apr-2025 to Sep-2026',
  blocks: [
    { p: `FSA sales were ${n1(SM[1].fsaMt)} MT in FY26 (${g(SM[1].fsaMt, SM[0].fsaMt)}) at ₹${n0(SM[1].fsaEx)} a tonne before other charges (${g(SM[1].fsaEx, SM[0].fsaEx)}), or ₹${n0(SM[1].fsaIncl)} including them. In Q1FY27 FSA volume was ${n1(SM[4].fsaMt)} MT (${g(SM[4].fsaMt, SM[2].fsaMt)}) but the realisation fell to ₹${n0(SM[4].fsaEx)} (${g(SM[4].fsaEx, SM[2].fsaEx)}) on grade mix, while the billed price including charges rose to ₹${n0(SM[4].fsaIncl)} (the Jharkhand mineral-bearing land cess is billed through). Notified prices are Coal India's decision in name and the Government's in practice: they protect power tariffs. We found no general increase announced from Apr-2025 to 30-Sep-2026; in 2026 Coal India chose to absorb higher diesel costs and some subsidiaries cut e-auction reserve prices.` },
    { exhibit: { type: 'table', title: 'Our channel build (volumes MT, prices ₹/t ex charges, revenue ₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Coal sold (MT)', n1(B0.qty), ...bld.map(r => n1(r.qty))],
      ['  FSA (MT)', n1(B0.fsa), ...bld.map(r => n1(r.fsa))],
      ['  E-auction (MT)', n1(B0.ea), ...bld.map(r => n1(r.ea))],
      ['  Washed coal and others (MT)', n1(B0.wash), ...bld.map(r => n1(r.wash))],
      ['FSA price', n0(B0.pFsa), ...BL.pFsa.map(n0)],
      ['E-auction price', n0(B0.pEa), ...BL.pEa.map(n0)],
      ['E-auction premium over FSA', pc((B0.pEa / B0.pFsa - 1) * 100), ...bld.map(r => pc(r.premium))],
      ['Coal revenue (ex charges)', n0(116880), ...bld.map(r => n0(r.coal))],
      ['Other charges and recoveries (₹/t)', n0(bld.otherPerT0), ...BL.otherChargesPerT.map(n0)],
      ['Other operating revenue (services, stripping-provision reversal)', n0(B0.otherOp), ...bld.map(r => n0(r.op))],
      { hl: true, cells: ['**Revenue (build)**', `**${n0(168400)}**`, ...bld.map(r => `**${n0(r.rev)}**`)] },
      ['Revenue in the model', '1,68,400', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['EBITDA per tonne (₹) / EBITDA', `${n0(B0.ebitda / B0.qty * 10)} / ${n0(B0.ebitda)}`, ...bld.map((r, i) => `${BL.ebitdaPerT[i]} / ${n0(r.ebitda)}`)],
    ], source: 'Q4FY26 and Q1FY27 decks; AR FY26; GAM estimates (assumptions.json "build"); model and build agree to within 0.1%' } },
    { callout: `**Our view:** we hold the FSA price flat in FY27 (₹${n0(BL.pFsa[0])}) and add ~1% a year after. A notified-price increase is the single biggest upside lever and the hardest to forecast: each 1% on FSA coal is ~₹${n0(bld[1].fsa * BL.pFsa[1] / 1000)} cr of FY28E EBITDA (~₹${n0(bld[1].fsa * BL.pFsa[1] / 1000 * MULT.base / shares)} a share at our multiple). The NCWA-XII wage talks, which have not started, are the obvious moment for one.` },
  ],
};

const eauction = {
  id: 'eauction', nav: 'E-auction', kicker: 'Channel: e-auctions', title: 'E-auctions: 11-13% of volume, about a quarter of EBITDA (PL), and the main swing factor',
  blocks: [
    { p: `E-auction sales were ${n1(SM[1].eaMt)} MT in FY26 (${g(SM[1].eaMt, SM[0].eaMt)}) at ₹${n0(SM[1].eaEx)} a tonne ex charges (${g(SM[1].eaEx, SM[0].eaEx)}). Q1FY27 volume jumped to ${n1(SM[4].eaMt)} MT (${g(SM[4].eaMt, SM[2].eaMt)}) at ₹${n0(SM[4].eaEx)} (${g(SM[4].eaEx, SM[2].eaEx)}). The premium over notified prices was 228% in FY23 and 99% in FY24, when imported coal was scarce after 2022; it fell to 36% in Q4FY26 and averaged 43% in Apr-Jul 2026 (Chairman, AGM). Management wants e-auctions at 15-20% of production and subsidiaries may offer up to 40%. Equirus (10-Sep-2026) sees premiums of 75-80%+ if power-plant stocks stay at ~8 days.` },
    { pair: [
      { type: 'column', title: 'E-auction volume: back above 80 MT, 26.5 MT in Q1FY27', unit: 'E-auction sales (million tonnes)', x: SG.annual.map(a => a.fy), series: [{ name: 'E-auction', values: SG.annual.map(a => Math.round(a.eaMt)), fmt: 'num' }], labels: 'all', source: 'PL 28-Jul-2026 (FY21-24); company decks (FY25-26)' },
      { type: 'column', title: 'E-auction price ex charges: ₹4,841/t in FY23, ₹2,260/t in FY26', unit: 'E-auction realisation (₹/t, ex other charges)', x: SG.annual.map(a => a.fy), series: [{ name: 'E-auction price', values: SG.annual.map(a => Math.round(a.eaEx)), fmt: 'num' }], labels: 'all', source: 'PL 28-Jul-2026 (FY21-24); company decks (FY25-26)' },
    ] },
    { callout: `**Sensitivity:** every ₹100 a tonne on ~${n0(bld[1].ea)} MT of FY28E e-auction volume is ~₹${n0(bld[1].ea * 10)} cr of EBITDA, ~₹${n0(bld[1].ea * 10 * MULT.base / shares)} a share at ${MULT.base}x. Going from our ~${n0(bld[1].premium)}% premium to Equirus's 75-80% would add roughly ₹${n0((75 - bld[1].premium) / 100 * BL.pFsa[1] * bld[1].ea / 10)}-${n0((80 - bld[1].premium) / 100 * BL.pFsa[1] * bld[1].ea / 10)} cr of FY28E EBITDA; back to Q4FY26's 36% would take away ~₹${n0((bld[1].premium - 36) / 100 * BL.pFsa[1] * bld[1].ea / 10)} cr. We build ~65% for FY27E (₹${n0(BL.pEa[0])}/t vs ₹${n0(BL.pFsa[0])}/t FSA).` },
  ],
};

const costs = {
  id: 'costs', nav: 'Costs & wages', kicker: 'The cost base', title: 'Costs: wages, contractors and materials take ~₹1,200 of the ~₹1,570 a tonne Coal India keeps from its coal',
  blocks: [
    { exhibit: { type: 'table', title: 'The FY26 cost base (₹ crore and ₹ per tonne of offtake)', head: ['Cost', 'FY26 (₹ cr)', '₹/t', 'Q1FY27 change', 'Driver'], wide: [4], rows: [
      ['Employee benefits', n0(f26.employee), perT(f26.employee), '+0.4%', '2.12 lakh employees; NCWA-XI to Jun-2026; executive pay upgrade ₹2,201 cr in Q3FY26'],
      ['Contractual (outsourced coal and overburden, transport)', n0(f26.contractual), perT(f26.contractual), '+11%', 'MDO and outsourcing rates; overburden up 47% since FY21'],
      ['Materials (diesel, explosives, spares)', n0(f26.materials), perT(f26.materials), '+27%', 'Diesel +₹435 cr and explosives +₹244 cr in Q1'],
      ['Power', n0(f26.power), perT(f26.power), 'n.d.', 'Mine electrification'],
      ['Other expenses (incl. rates, taxes and levies billed through)', n0(f26.otherExpenses), perT(f26.otherExpenses), '+14%', 'Mostly pass-through levies (Jharkhand land cess +₹1,246 cr in Q1)'],
      ['Stripping activity credit (capitalised overburden)', n0(f26.strippingAdjustment), perT(f26.strippingAdjustment), '−₹1,830 cr in Q1', 'Overburden above the mine-plan ratio is capitalised and amortised later'],
    ], source: 'AR FY26 consolidated P&L and notes; Q1FY27 deck' } },
    { p: `**Wages are the big unknown.** The non-executive wage pact NCWA-XI (19% minimum guaranteed benefit, 25% higher allowances) ran from Jul-2021 to 30-Jun-2026. Its successor needs a bipartite committee (JBCCI-12) that had not been constituted by 20-Sep-2026, so no number exists. Coal India did not appear to provide for it in Q1FY27 (employee costs +0.4%). We assume a ~10% rise on ~₹30,000 cr of non-executive pay from 1-Jul-2026, provided as it accrues: ~₹${n0(BL.wageProvision[0])} cr in FY27E and ~₹${n0(BL.wageProvision[1])} cr a year after, inside our EBITDA per tonne. That is our assumption, not guidance; a settlement like NCWA-XI could cost more, and arrears would come in one quarter.` },
    { callout: '**So what:** with ~85% of volume at fixed prices, every 1% of inflation on ~₹93,600 cr of wages, contractors, materials and power (FY26) is ~₹940 cr of EBITDA, about 2% of FY27E. Coal India\'s answer has been more outsourcing (MDOs, contractors) and more e-auction volume; the Government\'s answer has been not to raise notified prices.' },
  ],
};

const subsidiaries = {
  id: 'subsidiaries', nav: 'Subsidiaries & listings', kicker: 'Group structure', title: 'Listing the subsidiaries: value made visible, a little profit given away',
  blocks: [
    { exhibit: { type: 'table', title: 'Subsidiary listings (as of 30-Sep-2026)', head: ['Company', 'Status', 'Stake sold / to sell', 'What we know'], wide: [3], rows: [
      ['BCCL (coking coal)', 'Listed 19-Jan-2026', '10% at ₹23 (₹1,071 cr)', 'Listed ~97% above issue; subscribed ~144x; loss of ₹68 cr in Q1FY27'],
      ['CMPDI (planning, exploration)', 'Listed 30-Mar-2026', '10.71 crore shares at ₹163-172', 'Subscribed ~1x; listed at ₹162.80, below the issue price'],
      ['MCL (largest producer: 218 MT, PAT ₹10,698 cr)', 'DRHP filed 1-Sep-2026', '10% (66.18 crore shares)', 'Board approved up to 25% in principle; ~₹10,000 cr IPO mooted (Sahi, 31-Aug-2026)'],
      ['SECL', 'Planned in FY27', 'n.d.', 'Chairman at the AGM (31-Aug-2026)'],
    ], source: 'Business Today; Groww/Chittorgarh; Sahi news (AGM); Q1FY27 deck' } },
    { p: `A ₹10,000 cr IPO for 10% of MCL would value it at ~₹1 lakh cr (our arithmetic from the reported plan, not a disclosed price), ~9x its FY26 PAT and ~${n0(100000 / mcap * 100)}% of Coal India's ₹${n0(mcap)} cr market value at ₹${n0(X.price)}, for ~35% of the subsidiaries' FY26 PAT. The trade-off for Coal India's shareholders: ~₹10,000 cr of cash (~₹16 a share) against ~₹1,070 cr a year of MCL profit going to minorities (~3% of group profit). At our ${MULT.base}x EV/EBITDA that is roughly value-neutral, so we do not model the IPOs; they would lower reported EPS growth and raise net cash.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale and reserves, but no pricing power',
  blocks: [
    { verdicts: [
      ['Scale and reserves', 'Strong', D.moat.scale, 'Lowest-cost domestic supplier for most power plants; replacement would take a decade.'],
      ['Customer lock-in (FSAs, linkages)', 'Moderate', '~618 MTPA of power linkages; penalties only below 75% supply; buyers can import or source from captive mines', 'Volume is sticky, but buyers are not captive.'],
      ['Pricing power', 'Weak', D.moat.pricing, 'Costs rise every year; prices only when the Government agrees.'],
      ['Cost position', 'Moderate', 'Open-cast mines are cheap; ECL/BCCL underground mines are not; stripping ratio rising (2.3 → 2.6 m³/t since FY21)', 'Average cost rises faster than inflation unless output grows.'],
      ['Competition', 'Weakening', D.moat.threats, 'The incremental tonne is increasingly someone else\'s.'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'AR FY26; CARE 13-Apr-2026; ICICI Direct 30-Jul-2026; GAM Research' },
    { callout: `**Honest verdict:** ${D.moat.verdict} The returns are real (ROE 28% in FY26) but they are a policy outcome: the Government sets prices low enough to protect power tariffs and high enough to fund its dividends.` },
  ],
};

module.exports = { fsa, eauction, costs, subsidiaries, moat };
