// DMart report, part 3: the store engine (DMart stores, standalone), DMart Ready (subsidiaries) and the moat scorecard.
const X = require('./DMART.ctx');
const { C, SA, SQ, sa, n0, n1, build, BL, rpsBase, Q1 } = X;
const K = C.fy26.kpi, SUB = C.fy26.subsidiaries, QS = Q1.standalone, R = C.q1fy27.dmartReady;
const yrs = SA.filter(r => r.fy >= 'FY21');

const stores = {
  id: 'stores', nav: 'The store engine', kicker: 'DMart stores', title: 'The store engine: area grows ~15-20% a year, but each sq ft now earns less than it did in FY24',
  blocks: [
    { p: `DMart grows in clusters: it enters a state, builds density, then moves on (five new states in FY26, mostly in the north). Openings depend on land: DMart prefers to buy, takes 2-3 years from purchase to opening, and keeps a 2-3 year pipeline. Management's internal benchmark is to add ~15% of the store base a year, "a few percentages higher or lower" depending on approvals; FY26 was 20% (85 stores) because sites finished early, and 58 of them opened in Q4. Q1FY27 added only 3 (2 more by 28-Jul). Leasing is now used where land is hard to buy (NCR): 15 of FY26's 85 stores were leased.` },
    { p: `The other half of the equation is productivity. Our measure, standalone revenue per average sq ft, rose from ₹${n0(sa('FY21').revPerAvgSqft)} in FY21 (Covid) to ₹${n0(sa('FY24').revPerAvgSqft)} in FY24, then flattened: ₹${n0(sa('FY25').revPerAvgSqft)} in FY25 and ₹${n0(sa('FY26').revPerAvgSqft)} in FY26 (the company's own measure on year-end area fell from ₹${n0(K.revPerSqftCompanyFY25)} to ₹${n0(K.revPerSqftCompany)}). Three things drag it: like-for-like growth slowed from ~10% (FY24) to ${K.lflPct}% (FY26) and ${QS.lflPct}% in Q1FY27 as dense metro stores hit capacity and lose small baskets to quick commerce; DMart deliberately opens stores next to crowded ones, cannibalising them; and new stores in Tier 2-3 towns start well below the system average and take years to ramp (management did not disclose by how much).` },
    { pair: [
      { type: 'column', title: 'Retail area: 8.8 mn sq ft in FY21, 20.6 mn in FY26', unit: 'Retail business area at year end (mn sq ft)', x: [...C.annualKpis.map(r => r.fy), ...build.map(r => r.y)], series: [{ name: 'Area', values: [...C.annualKpis.map(r => r.areaMnSqft), ...build.map(r => Math.round(r.area * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'AR FY26; FY21 presentation; GAM estimates FY27-29E' },
      { type: 'line', title: 'Standalone revenue growth vs area growth', unit: 'Growth y/y (%)', x: yrs.slice(1).map(r => r.fy), series: [{ name: 'Standalone revenue', values: yrs.slice(1).map((r, i) => Math.round((r.standaloneRev / yrs[i].standaloneRev - 1) * 1000) / 10), fmt: 'pct' }, { name: 'Average retail area', values: yrs.slice(1).map((r, i) => Math.round((r.avgAreaMnSqft / yrs[i].avgAreaMnSqft - 1) * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Screener.in (standalone); AR FY26; GAM calculation' },
    ] },
    { exhibit: { type: 'table', title: 'Quarterly store business (standalone)', head: ['Quarter', 'Revenue (₹ cr)', 'y/y', 'EBITDA margin', 'Stores', 'Added', 'Area (mn sq ft)', 'LFL'], rows: SQ.map(q => [q.q, n0(q.standaloneRev), q.standaloneRevYoY != null ? q.standaloneRevYoY + '%' : '–', q.standaloneMarginPct + '%', String(q.stores), String(q.storeAdds), q.areaMnSqft != null ? n1(q.areaMnSqft) : '–', q.lflPct != null ? q.lflPct + '%' : '–']), source: 'Screener.in standalone quarterly results; company presentations; HSIE (store additions); LFL per broker notes (see segments.json)' } },
    { callout: `**What we assume:** ${BL.storeAdds.join(' / ')} openings in FY27-29E (the ~15% benchmark), effective area +${build.map((r, i) => Math.round((r.eff / X.effPrev[i] - 1) * 100)).join('% / +')}%, and revenue per effective sq ft ${BL.revPerSqftGrowth.map(g => (g > 0 ? '+' : '') + g + '%').join(' / ')} (from ₹${n0(rpsBase)} in FY26 to ₹${n0(build[2].rps)} in FY29E). That gives standalone revenue +${build.map((r, i) => Math.round(((r.st / (i ? build[i - 1].st : BL.base.standaloneRev)) - 1) * 1000) / 10).join('% / +')}%. The swing factor is productivity: each 1pp of revenue per sq ft growth is ~₹${n0(build[1].st / 100)} cr of FY28E revenue.` },
  ],
};

const ready = {
  id: 'ready', nav: 'DMart Ready', kicker: 'Online', title: 'DMart Ready: ₹4,094 cr of sales, a ₹307 cr loss and a retreat to 11 cities',
  blocks: [
    { p: `Avenue E-Commerce runs DMart Ready, an online grocery service built for large planned baskets: slotted delivery within six hours (and pick-up points, now de-emphasised) at DMart prices. Sales grew ${Math.round((SUB.dmartReady.sales / SUB.dmartReady.salesFY25 - 1) * 100)}% to ₹${n0(SUB.dmartReady.sales)} cr in FY26, but the loss widened: EBITDA −₹${-SUB.dmartReady.ebitda} cr (−₹${-SUB.dmartReady.ebitdaFY25} cr in FY25), net loss ₹${-SUB.dmartReady.pat} cr (₹${-SUB.dmartReady.patFY25} cr). DMart has injected ~₹1,488 cr of equity into it to date (HSIE). The CEO was blunt on 28-Jul-2026: as the business spread to more cities "our losses also grew quite significantly", so it has left 7 cities where order density was too low (25 cities in FY25, 18 in FY26, 11 now) and will try to prove a profitable six-hour model there first. It will not run a quick-commerce model and will not merge the online business into the stores.` },
    { p: `Q1FY27 shows the cost of the retreat: on the consolidated-less-standalone proxy, revenue grew ~${R.growthPct}% (vs ~20% a year earlier) and the loss rose to ~₹${n1(R.loss)} cr (₹${n1(R.lossQ1FY26)} cr in Q1FY26, ₹${n1(R.lossQ4FY26)} cr in Q4FY26; Nuvama, Citi). We assume the subsidiaries' revenue grows ${BL.subsGrowth.join('% / ')}% and their EBITDA improves from −₹66 cr in FY26 to ${BL.subsEbitda.map(v => (v < 0 ? '−₹' + -v : '₹' + v) + ' cr').join(' / ')} in FY27-29E.` },
    { callout: '**So what:** DMart Ready is ~6% of group sales and costs ~₹4-5 a share of profit a year. It is not a growth option the market should pay for until the 11-city model shows a path to break-even; it matters mainly as evidence of how hard it is for DMart to follow its customers online.' },
  ],
};

const moatRows = [
  ['Cost and price leadership', 'Strong', 'Gross margin ~14-15%, opex ~6.5% of revenue (standalone FY26); owned stores; 7-day vendor payment for better terms', 'Lets DMart undercut on a whole basket while earning ~8% EBITDA'],
  ['Scale with FMCG vendors', 'Strong', 'Often a vendor\'s largest single customer (CEO); vendors "doubling down" despite QC', 'Better terms and pack sizes; brands follow it'],
  ['Real estate and execution', 'Moderate', '500 stores, 84 DCs, cluster logistics; land bank 2-3 years ahead', 'A barrier to fast copying, but also DMart\'s own speed limit'],
  ['Convenience and online', 'Weak', 'DMart Ready loss-making, retreated to 11 cities; QC basket prices within 4-13% (Emkay)', 'No defence against convenience-led shopping in metros'],
  ['Category breadth', 'Weak', 'Covers ~50% of the retail wallet (Emkay); GM&A 22-23% by design', 'Limits the size of the prize per store'],
];
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a genuine cost moat in stores; no moat in convenience',
  blocks: [
    { verdicts: moatRows, head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'AR FY26; analyst meet (28-Jul-2026); Emkay initiation (12-Apr-2026); GAM Research' },
    { callout: '**Honest verdict:** DMart has a real, wide moat in what it does: running low-cost stores for planned grocery shopping. Nobody in India has matched its cost per rupee of sales, and its returns (~13% ROE with no leverage) are earned, not borrowed. The moat does not extend to convenience, which is where Indian grocery is shifting fastest in the big cities. The question for the stock is not whether DMart survives quick commerce (it will) but whether same-store growth settles at 5-8% instead of 10%+.' },
  ],
};

module.exports = { stores, ready, moat };
