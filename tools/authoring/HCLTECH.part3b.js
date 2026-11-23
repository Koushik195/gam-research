// HCL Technologies report, part 3b: deals, people, productivity, currency (the IT KPIs) and the moat scorecard.
const X = require('./HCLTECH.ctx');
const { D, n0, n1, pc, rup, SQ, QL, Q1, FY26 } = X;
const L5 = SQ.slice(-5);
const row = (name, f, fmt = v => v == null ? '–' : String(v)) => [name, ...L5.map(q => fmt(f(q)))];

const kpis = {
  id: 'kpis', nav: 'Deals, people & currency', kicker: 'Operating metrics', title: 'Deals, people and currency: bookings up, headcount down, the rupee doing the heavy lifting',
  blocks: [
    { exhibit: { type: 'table', title: 'Operating dashboard, last five quarters', head: ['', ...L5.map(q => q.q)], rows: [
      row('Revenue, US$ m', q => n0(q.usdRev)),
      row('Growth, CC, YoY', q => `${q.ccYoYPct}%`),
      row('New deal wins (TCV), US$ m', q => q.tcvUsd ? n0(q.tcvUsd) : null),
      row('Advanced AI revenue, US$ m', q => q.advAiUsd ? n0(q.advAiUsd) : null),
      row('EBIT margin (incl. restructuring)', q => `${q.ebitPct}%`),
      ['  of which restructuring cost', '–', '55 bp', '81 bp', '122 bp', '62 bp'],
      row('Headcount (period end)', q => n0(q.headcount)),
      row('Attrition, LTM', q => `${q.attritionPct}%`),
      ['Revenue per employee, US$k (LTM)', '63.4', '63.9', '64.6', '65.1', '65.5'],
      row('DSO, billed (days)', q => q.dso),
      row('Average USD-INR', q => q.usdInr.toFixed(2)),
    ], source: 'HCLTech investor releases. Q3FY26 margin excludes the Rs956 cr Labour Codes charge. Advanced AI revenue was first disclosed as a number in Q3FY26 (Q2FY26: "crossed US$100 m"). Utilisation is not disclosed.' } },
    { pair: [
      { type: 'line', title: 'Attrition steady at 12.4-13.2%', unit: 'Attrition, LTM (%; voluntary, excl. digital process operations)', x: QL, series: [{ name: 'Attrition', values: SQ.map(q => q.attritionPct), fmt: 'pct' }], labels: 'all', min: 10, max: 15, source: 'Investor releases' },
      { type: 'line', title: 'The rupee: ₹83.4 to ₹94.7 per US$ in two years', unit: 'Average USD-INR in the quarter', x: QL, series: [{ name: 'USD-INR', values: SQ.map(q => q.usdInr), fmt: 'n1' }], labels: 'all', min: 80, max: 98, source: 'Investor releases; 30-Sep-2026 close ₹95.81 (PTI)' },
    ] },
    { bullets: [
      `**Bookings.** Net new TCV was US$9.3 bn in FY26, flat on FY25 despite AI deflation and ~US$1 bn of deals HCLTech walked away from (CEO); Q1FY27 US$${n0(Q1.tcvUsd)} m (+33% YoY), plus the US$1.14 bn mega deal signed in July. Book-to-bill on new deals is ~0.6-0.7x a year's revenue: most revenue still comes from renewals.`,
      `**People.** Headcount ${n0(Q1.headcount)} (Jun-2026), down ${n0(-Q1.netAdds)} in the quarter and only 0.3% above a year earlier while revenue grew 3% in dollars. Freshers added: 11,744 in FY26, ${n0(Q1.freshers)} in Q1FY27. Attrition ${Q1.attritionPct}%.`,
      '**Wage hikes.** FY26 increments hit Q3FY26 (~80 bp of margin) with a second cycle in Q4FY26 (~45 bp). The size and timing of FY27 increments had not been announced by 30-Sep-2026; we assume a similar pattern inside our margins.',
      '**Currency and hedges.** About 56% of Services revenue is billed in the US and 28% in Europe, while most delivery cost is in rupees, so a weaker rupee lifts margins (forex +60 bp in Q1FY27). HCLTech hedges forward: at Mar-2026 it had US$1.6 bn of USD/INR sell contracts (plus smaller GBP, EUR and other covers) designated as cash-flow hedges, with a mark-to-market liability of ₹1,466 cr and a hedging reserve of −₹1,062 cr after tax, as the rupee had fallen below the hedged rates. These losses show up in the forex line below EBIT (−₹241 cr in FY26, −₹38 cr in Q1FY27). We assume no forex gain or loss in our forecasts; further rupee weakness would add hedge losses.',
      '**Restructuring.** ~65 bp of margin in FY26 (Q2-Q4) and 62 bp in Q1FY27; FY27 guidance includes 40-50 bp. We assume none in FY28-29.',
    ] },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in execution and client relationships, eroding in the labour model',
  blocks: [
    { verdicts: [...D.moat.map(r => r.map(rup))], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings, calls and broker notes to Sep-2026)' },
    { callout: '**Honest verdict:** HCLTech has a moat in execution, not in price. Clients trust it with very large, long contracts (23 accounts above US$100 m a year, renewals of its largest clients, mega deals executed "to the planned business case"), and its engineering franchise is the deepest among Indian tier-1s. But the moat that earned 20x+ multiples, cheap skilled labour delivered at scale, is what generative AI attacks. HCLTech\'s response (sell the productivity first, build AI platforms, buy software, invest in AI data centres) is sensible and early, yet it means accepting lower revenue per contract for a few years. HCLSoftware is a moat of sorts (customers rarely switch core software) but it protects a shrinking revenue base. We score the overall moat as narrow and narrowing.' },
  ],
};

module.exports = { kpis, moat };
