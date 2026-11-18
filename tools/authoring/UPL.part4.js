// UPL report, part B (4 of 4): valuation, risks & honest summary, glossary, statement notes.
const X = require('./UPL.common');
const { D, AS, F, V, n0, n1, price, mv, P, VP, epsSep28, fwdPe, fwdMed, fwdMedAll, troughYears, deRated, coromandelRatio, PEERS, PEER_SYMS, deRate, deRateMed, ASOF_TXT } = X;
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const pe = AS.valuation.blend.methods[0].multiple, sotpV = mv('sotp').value, dcfV = mv('dcf').value;
const ourAt = x => n0(x * epsSep28);
const partRows = P.map((p, i) => [`**${p.name}**`, VP[i].netCash ? '–' : `{{dcf.sotp.parts.${i}.metric|num}}`, VP[i].netCash ? '–' : `${p.mult}x`, `{{dcf.sotp.parts.${i}.value|num}}`, `{{dcf.sotp.parts.${i}.perShare|num}}`, VP[i].note || '']);

const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: 12x Sep-28E earnings gives {{dcf.tp|inr}}',
  blocks: [
    { h: 'How the street values UPL' },
    { p: 'After Q1FY27 most brokers value UPL on a single consolidated multiple. Of those whose method we could find, four use P/E (Motilal Oswal 12x, Jefferies 14x Jun-28E, Anand Rathi 15x and Antique 16x FY28E), two use EV/EBITDA (Elara 6.3x, Arihant 7.5x) and one, Nuvama, a platform sum of the parts less a 20% holding-company discount. We follow the majority: **P/E on Sep-28E EPS** (half FY28E, half FY29E), with a sum of the parts and a DCF as cross-checks. The last column applies each P/E broker\'s multiple to our Sep-28E EPS.' },
    { exhibit: { type: 'table', title: 'How the street values UPL (latest call standing on 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method', 'Multiple', 'On', 'At our EPS (₹)', 'Thesis'], wide: [8], rows: [
      ...D.street.brokers.map(b => [b[0], b[1], n0(b[2]), b[3], b[4], b[5], b[6], b[4] === 'P/E' || /^P\/E/.test(b[4]) ? ourAt(parseFloat(b[5])) : '–', b[7]]),
      { hl: true, cells: ['**GAM Research**', '**HOLD**', '**{{dcf.tp|num}}**', '30-Sep-26', '**P/E**', `**${pe.base}x**`, '**Sep-28E**', '**{{dcf.tp|num}}**', 'Recovery real, but little of it reaches EPS'] },
    ], source: `${D.street.src}. Calls dated before Aug-2026 may be stale; n.d. = not disclosed.` } },
    { h: `Why ${pe.base}x` },
    { exhibit: { type: 'table', title: 'Deriving the P/E multiple', head: ['Yardstick', 'Evidence', 'What it implies'], wide: [1, 2], rows: [
      ["1. UPL's own forward P/E since Apr-2021 (house rule)", `Median ${n1(fwdMed)}x on the house rule, which leaves out trough years: forward ${troughYears.join(' and ')} are excluded because forward EPS was below half of the previous three years' high (FY25 ₹11.5 and FY26 ₹22.8, both below half of FY23's ₹45.6); FY24, a loss year, drops out automatically. Including every date the median is ${n1(fwdMedAll)}x.`, `${n1(fwdMed)}x`],
      ['2. Sector de-rating by 30-Sep-2026', `Indian crop-protection peers trade at a median ${n1(deRateMed * 100)}% of their five-year median P/E: ${deRate.map(r => `${r[0]} ${n1(r[1])}x vs ${n1(r[2])}x`).join('; ')}. Coromandel, mainly a fertiliser company, is left out (it trades at ${n1(coromandelRatio * 100)}% of its median).`, `${n1(fwdMed)}x × ${deRateMed.toFixed(2)} ≈ ${n1(deRated)}x → ${Math.round(deRated)}x (nearest whole multiple)`],
      ['3. Growth vs what the multiple assumes', `Our EPS grows {{F.epsGrowth.1|chg}} and {{F.epsGrowth.2|chg}} in FY28-29E, but from a depressed base, with the minority share rising and FY24 showing how fast it can reverse.`, 'No premium for growth'],
      ['4. Peers', `Indian agrochemical peers trade at ${n1(PEERS.DHANUKA.pe)}-${n1(PEERS.SUMICHEM.pe)}x trailing P/E with ROE of ${PEERS.RALLIS.roe}-${PEERS.BAYERCROP.roe}%; UPL carries net debt and a ${PEERS.UPL.roe}% ROE (FY26).`, 'A large discount to Indian peers is justified'],
      ['5. Returns vs cost of capital', 'ROE {{F.roe.0|pct}} → {{F.roe.2|pct}} (FY27-29E) vs a ~13.7% cost of equity', `${pe.base}x; bull ${pe.bull}x (Jefferies' long-term average), bear ${pe.bear}x`],
    ], source: `Screener.in prices and EPS (forward P/E sampled weekly from Apr-2021 to ${ASOF_TXT}); peer multiples at the NSE close on ${ASOF_TXT}; GAM Research` } },
    { pair: [
      { type: 'line', title: 'Forward P/E since Apr-2021: our 12x vs history', unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(fwdMed), text: `Median excl. trough years: ${n1(fwdMed)}x (all dates ${n1(fwdMedAll)}x)` }, { v: pe.base, text: `Our target: ${pe.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['P/E 12x (target)', 'Sum of the parts', 'DCF', 'Share price'], series: [{ name: 'Value', values: [Math.round(mv('pe').value), Math.round(sotpV), Math.round(dcfV), price], fmt: 'inr' }], labels: 'all', highlight: 'P/E 12x (target)', source: 'GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Target price and cross-checks', head: ['Method', 'Role', 'Basis', 'Multiple', 'Value / share (₹)', 'vs target', 'Bull (₹)', 'Bear (₹)'], rows: [
      ['**P/E**', '**Target**', `Sep-28E EPS ₹${n1(epsSep28)}`, `${pe.base}x (bull ${pe.bull}x, bear ${pe.bear}x)`, '**{{dcf.blend.methods.0.value|num}}**', '–', '{{scen.bull.blend.methods.0.value|num}}', '{{scen.bear.blend.methods.0.value|num}}'],
      ['Sum of the parts', 'Cross-check', 'Sep-28E platform EBITDA, UPL\'s share', 'UPL Corp 7x, SAS 12x, Advanta 15x, SUPERFORM 10x', '{{dcf.blend.methods.1.value|num}}', `+${Math.round(mv('sotp').vsTarget)}%`, '{{scen.bull.blend.methods.1.value|num}}', '{{scen.bear.blend.methods.1.value|num}}'],
      ['DCF', 'Cross-check', '15-year FCFF, WACC 11.9%, g 4.5%', `implies ${n1(V.intrinsicTp / F.eps[1])}x FY28E`, '{{dcf.blend.methods.2.value|num}}', `+${Math.round(mv('dcf').vsTarget)}%`, '{{scen.bull.blend.methods.2.value|num}}', '{{scen.bear.blend.methods.2.value|num}}'],
      { hl: true, cells: ['**12-month target (rounded)**', '', '', '', '**{{dcf.tp|inr}}**', '{{dcf.upside|chg}} vs CMP', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: 'GAM Research' } },
    { callout: `**Why the cross-checks are so much higher, and why we do not use them for the target.** The sum of the parts (₹${n0(sotpV)}) values each platform as if listed on its own, with no holding-company discount; the market prices UPL ~${Math.round((1 - price / sotpV) * 100)}% below it, and Nuvama and Antique expect a 20-30% discount to persist after the reorganisation. The DCF (₹${n0(dcfV)}) assumes free cash flow of ₹3,600-4,400 cr a year arrives every year; in FY24 it was negative, and treating the ₹10,231 cr of factored receivables as debt would take ~₹120 a share off it. Both say UPL is cheap *if* the cycle holds and value reaches shareholders. The street prices it on earnings, and on earnings it is fairly valued.` },
    { h: 'Our sum of the parts (cross-check)' },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case, Sep-28E)', head: ['Part', 'Sep-28E EBITDA (₹ cr)', 'EV/EBITDA', 'Value (₹ cr)', '₹ / share', 'Why'], wide: [5], rows: [
      ...partRows,
      { hl: true, cells: ['**Equity value for UPL shareholders**', '', '', '**{{dcf.sotp.equity|num}}**', `**${n0(sotpV)}**`, 'No holding-company discount applied'] },
    ], source: 'GAM Research; minority stakes from the Feb-2026 reorganisation presentation' } },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} ${pe.bull}x Sep-28E EPS.`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +9% a year, statutory EBITDA margin 18-19.5%, finance costs down to ₹2,550 cr by FY29E, minorities 14-18.5% of profit; ${pe.base}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} ${pe.bear}x Sep-28E EPS.`],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Less: net debt at Mar-27E', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research. Tax line includes the minorities\' share, so FCFF approximates UPL\'s share; net debt is deducted in full.' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): WACC down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed Indian peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'EV/EBITDA (x)', 'ROE'], rows: PEER_SYMS.map(s => PEERS[s]).map(p => [p.symbol === 'UPL' ? '**UPL**' : p.name.replace(/ Ltd$/, '').replace(' Limited', ''), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), n1(p.evEbitda), p.roe + '%']), source: `Screener.in; trailing multiples at the NSE close on ${ASOF_TXT}. UPL's ROE and P/E use profit after minorities; its EV/EBITDA excludes minorities' value.` } },
  ],
};

module.exports = { sections: () => [valuation, ...require('./UPL.part4b').sections()], glossary: require('./UPL.part4b').glossary, statementNotes: require('./UPL.part4b').statementNotes };
