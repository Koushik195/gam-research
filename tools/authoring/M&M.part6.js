// M&M report, part 6: valuation (street method, multiple derivation, history charts, sum of the parts, cross-checks,
// scenarios, sensitivities, DCF detail) and peers. As of 30-Sep-2026.
const X = require('./M&M.ctx3');
const { n0, n1, F, V, AS, SC, price, sh, SOTP, SB, MULT, DISC, coreMed, coreP25, coreP75, coreNow, derate, derateAll, DR_SET, PEERS, EXCLUDE, tataNote, HEAD, headPe, dcfAdj, evAdj, ev27, liq27, PE_CHART, HEAD_CHART, SENS, DCF_GRID, dcfShift, peerRows, KEPT, byYear, evPeerMed, c28, rating, ruleText, since23 } = X;
const pcs = v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(0)}%`;
const vs = v => pcs((v / SB.perShare - 1) * 100);
const partPs = (k, key) => SOTP[k].parts.filter(p => (key === 'listed' ? p.listed : p.key === key)).reduce((s, p) => s + p.net, 0) / sh;

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: sum of the parts, ${MULT.base}x core earnings: {{dcf.tp|inr}}`,
  blocks: [
    { h: 'How the street values M&M, and how we do' },
    { p: `${X.D.street._method} We use the same structure: (1) the standalone auto and farm business, including its own cash, on P/E on Sep-28E core EPS (₹${n1(c28)}: standalone EPS excluding one-offs and the dividends and other income from group companies); (2) listed stakes at the 30-Sep-2026 close; (3) unlisted group companies at M&M's investment (cost net of write-downs), plus new investment to Sep-27E; (4) a ${DISC.base}% holding discount on (2) and (3). The engine carries the result as an implied ${n1(SB.implied)}x standalone Sep-28E EPS so that the Excel model reproduces the target.` },
    { h: `The core multiple: ${MULT.base}x, and why` },
    { exhibit: { type: 'table', title: 'Deriving the core multiple (house rule: own forward median since Apr-2021 x sector de-rating)', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ['Own one-year-forward core P/E, Apr-2021 to 30-Sep-2026', `${KEPT.length} weekly points; no trough years (core EPS never fell below half its prior peak); price less stakes on the same basis as our SOTP (listed at market, unlisted at cost, after ${DISC.base}%); EPS before one-offs and excluding group income. By year: ${byYear.map(r => `${r.y} ${n1(r.med)}x`).join(', ')}`, `Median **${n1(coreMed)}x** (25th percentile ${n1(coreP25)}x, 75th ${n1(coreP75)}x)`],
      ['Sector de-rating at the 30-Sep close', `Median of ${DR_SET.length} auto-OEM peers' trailing P/E vs their five-year medians: ${DR_SET.map(p => `${p.symbol} ${p.vs >= 0 ? '+' : ''}${p.vs.toFixed(1)}%`).join(', ')}. Excluded: M&M itself; Bajaj Auto (${EXCLUDE['BAJAJ-AUTO']}); Tata Motors (demerged in 2025, see peers). With Bajaj Auto the median is ${derateAll.toFixed(1)}%`, `**${derate.toFixed(1)}%**`],
      ['Base multiple', `${n1(coreMed)}x x (1 ${derate.toFixed(1)}%) = ${n1(coreMed * (1 + derate / 100))}x, rounded to the nearest half-turn`, `**${MULT.base}x Sep-28E core EPS**`],
      ['Where the core trades today', `₹${n0(price)} less ₹${n0(SB.subsNet / sh)} of stakes after ${DISC.base}%, over FY28E core EPS of ₹${n1(X.coreEps.FY28E)}`, `${n1(coreNow)}x: above the median, below the 2025 peak (${n1(byYear[4].med)}x)`],
      ['House headline check (forwardMedian)', `Price ÷ next-year standalone EPS (incl. group dividends) since Apr-2021: median ${HEAD.median}x. Not used for the SOTP because the stakes are inside the price, so it would count them twice`, `${HEAD.median}x x (1 ${derate.toFixed(1)}%) → 16x x Sep-28E EPS = ₹${n0(headPe.val)}`],
      ['Growth and returns (sensitivity only, PLAYBOOK §7c)', 'EPS CAGR ~13% FY26-29E; ROE ~21% vs a 12.2% cost of equity. Both were also true in 2024-25, when the core traded at 18-21x', `No uplift in the base; since-2023 median (${n1(since23)}x) shown as a sensitivity`],
    ], source: 'Screener.in prices; GAM core EPS and stake values; peers from Screener.in at the 30-Sep-2026 close' } },
    { pair: [
      { type: 'line', title: `Core forward P/E: median ${n1(coreMed)}x, today ${n1(coreNow)}x`, unit: '(Price − stakes after 20%) ÷ next-year core EPS (x), weekly', x: PE_CHART.map(x => x[0]), series: [{ name: 'Core P/E', values: PE_CHART.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our ${MULT.base}x = median ${n1(coreMed)}x less ${Math.abs(X.derate).toFixed(1)}%`, color: '#cf8f1f' }], source: 'Screener.in; GAM Research' },
      { type: 'line', title: `Headline forward P/E: median ${HEAD.median}x`, unit: 'Price ÷ next-year standalone EPS incl. group dividends (x), weekly', x: HEAD_CHART.map(x => x[0]), series: [{ name: 'Headline P/E', values: HEAD_CHART.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEAD.median, text: `Median ${HEAD.median}x` }], source: 'Screener.in; GAM estimates for FY27-28E' },
    ] },
    { h: 'The sum of the parts' },
    { exhibit: { type: 'table', title: 'Sum of the parts (₹ per share)', head: ['Part', 'Basis (base case)', 'Base', 'Bull', 'Bear'], wide: [1], rows: [
      ['Auto + farm (core, incl. its cash)', `${MULT.base}x Sep-28E core EPS ₹${n1(c28)} (bull ${MULT.bull}x, bear ${MULT.bear}x)`, n0(partPs('base', 'core')), n0(partPs('bull', 'core')), n0(partPs('bear', 'core'))],
      ['Listed stakes', `Tech Mahindra, M&M Finance, SML, Lifespaces, Holidays, Logistics, Swaraj, FirstCry at the 30-Sep close, less ${DISC.base}% (bull 10%, bear 30%)`, n0(partPs('base', 'listed')), n0(partPs('bull', 'listed')), n0(partPs('bear', 'listed'))],
      ['MEAL (EVs)', `At cost ₹${n0(X.SUBS_NOW.meal)} cr (bull: 92.45% of the ₹40,400 cr conversion value)`, n0(partPs('base', 'meal')), n0(partPs('bull', 'meal')), n0(partPs('bear', 'meal'))],
      ['Last Mile Mobility', 'At cost (bull: 78.11% of the IJF conversion value ₹4,849 cr)', n0(partPs('base', 'lmm')), n0(partPs('bull', 'lmm')), n0(partPs('bear', 'lmm'))],
      ['Other unlisted + new investment', `At cost (₹${n0(X.SUBS_NOW.oth)} cr + ₹${n0(X.NEWINV)} cr to Sep-27E)`, n0(partPs('base', 'oth') + partPs('base', 'new')), n0(partPs('bull', 'oth') + partPs('bull', 'new')), n0(partPs('bear', 'oth') + partPs('bear', 'new'))],
      { hl: true, cells: ['**Value per share**', '', `**${n0(SB.perShare)}**`, n0(SOTP.bull.perShare), n0(SOTP.bear.perShare)] },
      { hl: true, cells: ['**12-month target (rounded)**', `vs ₹${n0(price)}`, '**{{dcf.tp|inr}}** ({{dcf.upside|chg}})', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
      ['Implied P/E on standalone Sep-28E EPS (engine)', 'What the Excel model uses', `${n1(SB.implied)}x`, `${n1(SOTP.bull.implied)}x`, `${n1(SOTP.bear.implied)}x`],
    ], source: 'GAM Research' } },
    { h: 'Cross-checks (not weighted)' },
    { exhibit: { type: 'table', title: 'Target and cross-checks', head: ['Method', 'Basis', 'Value / share (₹)', 'vs target'], wide: [1], rows: [
      ['**SOTP (target)**', `${MULT.base}x core + stakes less ${DISC.base}%`, `**${n0(SB.perShare)}**`, '–'],
      ['DCF', `Standalone FCFF, Ke ${n1(V.ke)}%, g ${V.terminalGrowth}%, 15 years; + liquid cash; stakes at SOTP value`, n0(dcfAdj), vs(dcfAdj)],
      ['EV/EBITDA', `${evPeerMed.toFixed(1)}x peer median → 14x Sep-27E EBITDA ₹${n0(ev27)} cr + liquid cash ₹${n0(liq27)} cr + stakes at SOTP value`, n0(evAdj), vs(evAdj)],
      ['Headline P/E (house tool)', `16x Sep-28E standalone EPS incl. group dividends; no separate stakes`, n0(headPe.val), vs(headPe.val)],
      ['Engine checks (Excel)', 'Same DCF and EV/EBITDA but with group companies at cost: floors, not fair values', `${n0(V.blend.methods.find(m => m.key === 'dcf').value)} / ${n0(V.blend.methods.find(m => m.key === 'ev').value)}`, '–'],
    ], source: 'GAM Research' } },
    { callout: `**What the cross-checks say.** Methods that ignore M&M's own valuation history (DCF ₹${n0(dcfAdj)}, peer EV/EBITDA ₹${n0(evAdj)}) sit 35-45% above our target: they say the business can justify today's price if it compounds cash at ~11% for 15 years and if sector multiples hold. The house rule anchors instead to what investors actually paid for M&M's core over five years (8-12x in 2021-23, 18-21x in 2024-25). The headline check (₹${n0(headPe.val)}) lands close to the SOTP. We follow the rule and flag the gap: if the 2024-25 re-rating is permanent, the since-2023 sensitivity gives ₹${n0(SENS[1].v)}.` },
    { h: 'Scenarios and sensitivities' },
    { exhibit: { type: 'table', title: 'Bull, base and bear', head: ['Case', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Core ${MULT.bull}x (75th percentile x de-rating).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}; core ${MULT.base}x; ${DISC.base}% discount.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Core ${MULT.bear}x (25th percentile x de-rating).`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Sensitivity rows (views we do not put in the base case)', head: ['Change', 'How', 'Value / share (₹)', 'vs CMP'], wide: [1], rows: SENS.map(s => [s.k, s.how, n0(s.v), pcs(s.up)]), source: 'GAM Research' } },
    { p: `**DCF detail.** Fifteen-year standalone free cash flow at a ${n1(V.ke)}% cost of equity (no net debt), growth fading to ${AS.dcf.fadeGrowthTo}% and margin to ${AS.dcf.fadeMarginTo}%, terminal growth ${V.terminalGrowth}% (terminal value ${n1(V.tvShare)}% of enterprise value). The engine adds cash and group investments at cost (₹${n0(V.blend.methods.find(m => m.key === 'dcf').value)} a share); replacing the investments at cost with their SOTP value adds ₹${n0(dcfShift)} a share.` },
    { exhibit: { type: 'table', title: 'DCF value per share (₹, stakes at SOTP value): cost of equity x terminal growth', head: ['Ke \\ g', ...(V.sens?.gs || []).map(g => `${n1(g)}%`)], rows: (V.sens?.waccs || []).map((w, i) => [`${n1(w)}%`, ...DCF_GRID[i].map(n0)]), source: 'GAM Research' } },
    { p: `**Rating.** ${ruleText} Our target of {{dcf.tp|inr}} is {{dcf.upside|chg}} from ₹${n0(price)}: **${rating}**.` },
  ],
};

const peers = {
  id: 'peers', nav: 'Peers', kicker: 'Peers', title: 'Peers: the sector has de-rated ~7%; M&M\'s headline P/E is 15% below its own five-year median',
  blocks: [
    { exhibit: { type: 'table', title: 'Auto OEMs at the 30-Sep-2026 close', head: ['Company', 'Mcap (₹ cr)', 'P/E (trailing)', 'P/E 5y median', 'vs median', 'EV/EBITDA', 'EBITDA margin (FY26)', 'ROE (FY26)', 'De-rating set'], rows: peerRows, source: 'Screener.in (Maruti, Bajaj, Eicher, Hero, Ashok Leyland, Escorts consolidated; TVS and M&M standalone); 30-Sep-2026 NSE closes' } },
    { p: `${tataNote} Escorts Kubota's trailing EPS at 30-Sep no longer includes the June-2025 gain on selling its railway business, so we keep it (its de-rating, −39%, is the market's view of the tractor cycle). M&M's own headline P/E (price ÷ trailing standalone EPS) is 15% below its five-year median, but that comparison flatters it: trailing EPS includes ~₹2,000 cr a year of dividends from group companies and the stakes themselves are worth ~₹${n0(SB.subsNet / sh)} a share.` },
    { callout: `**So what:** the sector is ~7% cheaper than usual, Maruti (−17%) and Escorts (−39%) most. That is the de-rating we apply. M&M's core is not cheap on its own history (${n1(coreNow)}x vs ${n1(coreMed)}x); it only looks cheap against peers' absolute multiples, which is why the street's 22-26x targets come from comparisons with Maruti and Eicher rather than with M&M's past.` },
  ],
};

module.exports = { valuation, peers };
