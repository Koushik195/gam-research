// Meesho report, part 3: marketplace economics, logistics (Valmo) and ads, new initiatives, competitive advantage.
const C = require('./MEESHO.ctx');
const { n0, n1, A24, A25, A26, q1, q1y, QL, qv, SA, D, MP, NI, F } = { ...C, A24: C.SA.find(a => a.fy === 'FY24') };
const SRC = 'Meesho shareholders\' letters and FY26 annual report, GAM Research';
const gap = Math.round((q1.growthSpendPct + q1.serverPct + q1.otherCostPct) * 10) / 10;

// ---------------------------------------------------------------- Marketplace economics
const economics = {
  id: 'economics', nav: 'Marketplace economics', kicker: 'Segment: marketplace', title: `Each order makes money; the fixed costs still eat it (gap: ${n1(-q1.mpAePct)}% of NMV)`,
  blocks: [
    { p: `The marketplace is 99.9% of revenue. Its economics are simple. **Contribution margin** is what is left from Meesho's revenue after the costs of each order (delivery, payment gateway, customer support): ${q1.cmPct}% of NMV in Q1FY27, ₹${q1.cm} cr. From that Meesho pays costs that do not rise with each order: growth spending (marketing and user acquisition, ${q1.growthSpendPct}% of NMV), servers and software (${q1.serverPct}%) and staff and other costs (${q1.otherCostPct}%), together 5.8% (flat on the quarter, down 0.37pp in a year). The difference is the marketplace adjusted EBITDA: ${q1.mpAePct}% of NMV.` },
    { pair: [
      { type: 'column', title: 'Contribution in rupees: back to a record ₹531 cr', unit: 'Contribution margin, marketplace (₹ crore)', x: QL, series: [{ name: 'Contribution', values: qv('cm'), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Marketplace loss: Q3FY26 was the low point', unit: 'Marketplace adjusted EBITDA (₹ crore)', x: QL, series: [{ name: 'Adj. EBITDA', values: qv('mpAdjEbitda'), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { exhibit: { type: 'table', title: 'Marketplace margins by year (% of NMV)', head: ['', 'FY24', 'FY25', 'FY26', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['NMV (₹ cr)', n0(A24.nmv), n0(A25.nmv), n0(A26.nmv), n0(q1.nmv), '{{F.seg.mp.driver.0|num}}', '{{F.seg.mp.driver.1|num}}', '{{F.seg.mp.driver.2|num}}'],
      ['NMV growth', '+21%', `+${Math.round((A25.nmv / A24.nmv - 1) * 100)}%`, `+${Math.round((A26.nmv / A25.nmv - 1) * 100)}%`, `+${q1.nmvYoYPct}%`, ...MP.driver.map((d, i) => `+${Math.round((d / (i ? MP.driver[i - 1] : A26.nmv) - 1) * 100)}%`)],
      ['Revenue, % of NMV', '–', `${n1(A25.mpRev / A25.nmv * 100)}%`, `${n1(A26.mpRev / A26.nmv * 100)}%`, `${n1(q1.mpRev / q1.nmv * 100)}%`, ...MP.revenue.map((r, i) => `${n1(r / MP.driver[i] * 100)}%`)],
      ['Contribution margin', `${A24.cmPct}%`, `${A25.cmPct}%`, `${A26.cmPct}%`, `${q1.cmPct}%`, '–', '–', '–'],
      { hl: true, cells: ['Marketplace adj. EBITDA', `${n1(A24.mpAdjEbitda / A24.nmv * 100)}%`, `${n1(A25.mpAdjEbitda / A25.nmv * 100)}%`, `${n1(A26.mpAdjEbitda / A26.nmv * 100)}%`, `${q1.mpAePct}%`, ...MP.adjEbitda.map((e, i) => `${n1(e / MP.driver[i] * 100)}%`)] },
    ], source: 'FY26 annual report, Q1FY27 letter; GAM Research estimates' } },
    { p: '**How the gap closes.** Management names two levers: (1) ads, which cost almost nothing to serve, so every rupee of ad revenue lifts contribution margin; and (2) restoring the logistics margin that fell in FY26 (Meesho charges sellers more for delivery than it pays partners), after which logistics savings are passed on as lower prices. On the cost side, AI tools have "more than doubled" engineering productivity (Q1FY27 letter) and fixed costs fell 0.4pp of NMV in a year. We assume break-even in FY28E and 1.3% of NMV in FY29E; Citi has 2.1% in FY29E, Jefferies and Axis Capital ~3% only by FY30E, MOFSL 3.75% by FY31E.' },
    { callout: '**Our view:** the unit economics work (FY24 showed a 5.6% contribution margin and positive free cash flow at a smaller scale), but Meesho chooses to reinvest efficiency gains in lower prices and user acquisition. That is a sound strategy for a market leader in a land grab, but it means margins will rise slowly. The bull case needs ads to scale toward the 3-4% of NMV that global marketplaces earn; J.P. Morgan puts Meesho\'s ad take rate at ~1.8%.' },
  ],
};

// ---------------------------------------------------------------- Logistics & ads
const logistics = {
  id: 'logistics', nav: 'Valmo & ads', kicker: 'Logistics and advertising', title: 'Valmo makes Meesho the cheapest place to sell; ads must make it profitable',
  blocks: [
    { p: '**Valmo** is Meesho\'s logistics platform. It does not own trucks or warehouses: it pools thousands of small first-mile, sorting, line-haul and last-mile operators and assigns each order to the cheapest reliable route. Sellers pay a delivery fee, which is most of Meesho\'s revenue. In Q2-Q3FY26, when India\'s third-party courier market consolidated, Meesho moved volume onto Valmo very quickly; the new partners and sort nodes ran inefficiently, and contribution margin fell from 4.4% to 2.3% of NMV without fees being raised. By Q4FY26 it was back to 4.0%, and to 4.6% in Q1FY27. Cost per delivered order fell another ~₹1 in Q1FY27 even after fuel and minimum-wage increases, which were passed through.' },
    { p: `**Tax structure under scrutiny.** Much of Valmo now runs through Valmo Transportation Pvt Ltd, registered as a Goods Transport Agency (GTA) under GST, which lets freight recovered from customers carry 5% GST rather than 18%. On 22-Jul-2026 the proxy adviser InGovern wrote to SEBI asking whether the risk and any contingent liability were properly disclosed. Meesho says it took legal and accounting opinions, that other horizontal platforms use the same model, and that no tax authority or SEBI has raised it. No amount was quantified; we flag it as a risk, not a cost.` },
    { p: '**Advertising** is the profit engine still to come. About two-thirds of sellers by GMV already advertise (Q1FY27 call). Ads lift contribution margin almost one for one because they cost little to serve, and more sellers (+81% in a year) means more bidders. Meesho Mall (~1,200 brands, NMV +93%) brings brands with bigger ad budgets, though Mall orders carry a lower contribution margin for now.' },
    { callout: '**Why it matters:** Valmo is what makes zero commission possible: Meesho delivers cheaper than anyone, so sellers can price lower. But management passes logistics savings to buyers, so Valmo is a growth tool, not a margin tool. The margin case rests on ads. Track contribution margin each quarter: a move back below 4% would mean either logistics trouble or ads not scaling.' },
  ],
};

// ---------------------------------------------------------------- New initiatives
const newBets = {
  id: 'newbets', nav: 'New initiatives', kicker: 'Segment: new initiatives', title: 'New initiatives: small bets with a hard ₹200 cr annual loss cap',
  blocks: [
    { p: `Meesho reports a second segment, **new initiatives** (its "Horizon 2" bets): a low-cost local logistics network for daily essentials, digital financial services (partner NBFCs lend to sellers and buyers; Meesho gives them a first-loss default guarantee) and AI services. Revenue was only ₹${n1(A26.niRev)} cr in FY26 against a loss of ₹${n0(-A26.niAdjEbitda)} cr; the Q1FY27 loss was ₹${-q1.niAdjEbitda} cr. In Jun-2026 the board approved buying **Kirana Club**, an app that connects FMCG brands and distributors with small retailers in Tier 2+ towns ("Meesho for retailers"), for ~₹202 cr in cash. Management caps total new-initiative losses at ~₹200 cr a year and says the local-logistics bet is still "pre product-market fit".` },
    { pair: [
      { type: 'column', title: 'New-initiative losses: small and capped', unit: 'Adjusted EBITDA, new initiatives (₹ crore)', x: ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Adj. EBITDA', values: [A24.niAdjEbitda, A25.niAdjEbitda, A26.niAdjEbitda, ...NI.adjEbitda.map(v => Math.round(v))], fmt: 'num' }], labels: 'all', source: 'Q1FY27 letter (FY24-26), GAM Research estimates' },
      { type: 'hbar', title: 'Value: the cost of losses still to come, ~₹1-2 a share', unit: '₹ per share', x: [C.PN.name, 'Kirana Club purchase price'], series: [{ name: '₹/share', values: [Math.round(C.PN.perShare * 10) / 10, Math.round(C.SO.parts.find(p => /Kirana/.test(p.name)).perShare * 10) / 10], fmt: 'n1' }], labels: 'all', source: 'GAM Research estimates' },
    ] },
    { callout: '**Our view:** we value the new initiatives at the present value of the losses still to come (about four more years at the ₹200 cr cap), not at an option value. Valmo and content commerce both began as Horizon 2 bets and became core, so success would be upside; but the first-loss guarantees in financial services add credit risk that the segment numbers do not yet show.' },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real cost moat, but no pricing power',
  blocks: [
    { verdicts: D.moat.map(([a, v, e]) => [a, v, e, /Weak/.test(v) ? 'Not a source of excess returns' : /Strong/.test(v) ? 'Hard to copy quickly' : 'Helps, can be matched']), head: ['Source of advantage', 'Strength', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'Company filings, broker notes (Axis Capital, J.P. Morgan), GAM Research' },
    { callout: '**Verdict: a narrow moat built on cost, not on customer captivity.** Meesho is the low-cost operator in Indian e-commerce, with the largest buyer base and the longest tail of unbranded sellers. Neither buyers nor sellers are locked in, and Flipkart and Amazon have copied the zero-commission, low-price format. The moat is real as long as Meesho stays the cheapest, which is why it keeps passing savings on rather than banking them. That limits how high margins can go.' },
  ],
};

module.exports = { economics, logistics, newBets, moat };
