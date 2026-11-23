// Exide report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./EXIDEIND.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, MULT, coreMed, rating, buyBelow, sellAbove, medTp, epsSep, k, sectorDr, hdfcDivPS, shares, eesl, parts, oiB } = X;
const coreEps = epsSep.base - hdfcDivPS;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good battery business, a costly cell bet, and a price that already adds them up; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** India\'s leading lead-acid battery franchise (half of a duopoly, the biggest brand and distribution network, captive lead recycling), debt-free and cash-generative, in a good cycle (post-GST auto boom, inverters, solar, a replacement wave to come). Attached to it: an HDFC Life stake worth ~₹53 a share at market, and a lithium-ion cell plant that has absorbed ₹4,902 cr and is only now shipping samples. Margins are ordinary (~11-12%) and returns on equity are ~8% because of the investments.' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E standalone EPS. Net of the investments, the core trades at ${n1(X.coreNowSep)}x Sep-28E EPS vs a ${n1(coreMed)}x median since 2022, while auto-component stocks were ${Math.abs(sectorDr).toFixed(1)}% below their five-year medians on 30-Sep-2026. Our sum of the parts gives {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. The street's higher targets (median ₹${n0(medTp)}) need a 16-18x core and the plant at full book; we do not see why the core should get more than its own history, or the plant more than what has been put in, before it has sold a cell.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Cell plant ramps fast: approvals at 2W OEMs, 3W retrofit and telecom orders, yields toward 90%', 'Low-Medium', 'Commercial-production declaration; first cell revenue; EESL quarterly losses'],
      ['Government support for local cells (PLI tranche, approved-list rules, import duty on cells)', 'Medium', 'Re-opened 10 GWh PLI; duty on imported cells (5% today)'],
      ['Margin back to 13%+ as lead and sulphur ease', 'Low', 'Rupee lead prices; Q2-Q3FY27 gross margin'],
      ['HDFC Life stake sold to fund EESL', 'Low-Medium', 'Would turn a discounted asset into cash at market'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['EESL needs much more money (Phase 2 to 12 GWh, Hyundai-Kia line) before it earns', 'Medium', `Liquid funds and FY28-29E treasury income (₹${n0(oiB[2].treasury)} cr in FY29E) go to EESL; value only if returns beat 12.5%`],
      ['EESL losses larger or longer (yields, approvals, Chinese material curbs from November)', 'Medium', `Bear case: half of book and breakeven FY31E: EESL worth ~₹${n0(eesl.bear.value / shares)} a share vs ₹${n0(eesl.base.value / shares)}`],
      ['Auto-OEM growth reverses against the post-GST base from Q3FY27', 'Medium', 'FY28E EPS 5-10% below ours'],
      ['Rupee lead, sulphur and plastic costs outrun price increases', 'Medium', `Each 0.5pp of margin ≈ ₹${n1(F.sales[1] * 0.005 * (1 - X.TAX) / shares)} of FY28E EPS`],
      ['Lithium takes more of telecom, e-rickshaw and inverter batteries', 'Medium', 'Lower growth in industrial and home UPS'],
      ['HDFC Life share price falls', 'Medium', '~₹4 a share for each ₹50'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to BUY below ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers, or sooner if the cell plant shows real revenue and yields.`,
      `**This is a valuation call on the parts, not a call against the business.** Our FY28E EPS is in line with the street. We differ on the core multiple (${MULT.base}x: own core history ${n1(coreMed)}x × ${k.toFixed(3)} vs the street's 16-18x) and on EESL (₹${n0(eesl.base.value / shares)} vs ₹70-82 a share).`,
      `**Biggest swing factors:** each 1x on the core is ~₹${n0(coreEps)} a share; EESL at full invested capital instead of book less losses adds ~₹${n0((6202 - eesl.base.value) / shares)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 revenue growth', v: '+17.6%', d: 'EBITDA margin 12.4%' },
      { k: 'EBITDA margin', v: '11.3%', d: 'FY26; 13-15% in FY16-21' },
      { k: 'Equity in EESL', v: '₹4,902 cr', d: '₹58 a share; FY26 loss ₹248 cr' },
      { k: 'Core P/E (Sep-28E)', v: `${n1(X.coreNowSep)}x`, d: `median since 2022: ${n1(coreMed)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Lead-acid battery', 'The standard car starter, inverter and industrial battery: lead plates in sulphuric acid. Cheap, recyclable, heavy.'],
      ['Lithium-ion cell (NMC, LFP)', 'The battery cell used in EVs and modern storage. NMC (nickel-manganese-cobalt) is energy-dense, used in 2W; LFP (lithium iron phosphate) is cheaper and safer, used in 3W, buses, telecom and storage.'],
      ['Cylindrical / prismatic', 'Cell shapes: small round cans (cylindrical) or flat rectangular cases (prismatic).'],
      ['GWh', 'Gigawatt-hour: a measure of battery capacity. A two-wheeler pack is ~2-4 kWh; 1 GWh = 1,000,000 kWh.'],
      ['Yield / utilisation', 'Share of cells made that pass quality tests / share of plant capacity used.'],
      ['BESS', 'Battery energy storage system: large batteries for the power grid or solar plants.'],
      ['ACC PLI', 'The government\'s production-linked incentive for advanced chemistry cell plants; Exide is not in it.'],
      ['OEM / replacement', 'Batteries fitted in new vehicles / bought later to replace a worn-out battery.'],
      ['EESL', 'Exide Energy Solutions Ltd, Exide\'s 100% lithium-ion subsidiary.'],
      ['Standalone / consolidated', 'Accounts of Exide Industries alone (the lead-acid business) / of the whole group including EESL and Chloride Metals.'],
      ['Sum of the parts (SOTP)', 'Valuing each part separately (here core business, HDFC Life stake, EESL, other investments) and adding them up.'],
      ['Book value / PV of losses', 'Equity on the balance sheet / today\'s value of losses still to come, discounted at the cost of equity.'],
      ['Other comprehensive income', 'Gains and losses that go straight to equity, not the profit line (here the HDFC Life stake\'s value changes).'],
      ['P/E, core P/E', 'Share price ÷ EPS; core P/E strips the investments out of the price and their income out of EPS.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / cost of equity', 'Discounted cash flow valuation; the required annual return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '+2%: a Covid year; volumes recovered in H2.',
  'ebitdaMargin@FY22': '11.3% (13.5% in FY21): lead and other input costs rose faster than prices.',
  'otherIncome@FY22': '₹4,774 cr: includes the ₹4,694 cr exceptional gain on the Exide Life sale (closed 1-Jan-2022).',
  'pat@FY22': '₹4,684 cr reported; ~₹852 cr before the Exide Life gain.',
  'cfo@FY22': '₹20 cr: tax on the sale gain and a working-capital build.',
  'sales@FY23': '+18%: price increases and volume recovery.',
  'pat@FY23': '₹904 cr: back to normal after the FY22 gain.',
  'ebitdaMargin@FY24': '11.7%: the best margin since FY21.',
  'cfo@FY24': '₹1,997 cr: payables up sharply.',
  'sales@FY26': '+4%: a lost Q2 around the GST change (Q2FY26 −2%); exports and telecom down.',
  'pat@FY26': '₹1,111 cr after a ₹9 cr labour-code charge.',
  'cfo@FY26': '₹2,231 cr: inventory down ₹335 cr, payables up.',
  'sales@Q2FY26': '−2%: channel stopped buying between the GST announcement (mid-Aug) and the cut (22-Sep-2025).',
  'opm@Q2FY26': '9.5%: under-absorbed costs in the GST washout quarter.',
  'sales@Q1FY27': '+17.6%: double-digit volumes in most lines; prices +4-6% YoY.',
  'opm@Q1FY27': '12.3% (company 12.4%): price increases and cost programme offset input inflation.',
  'sales@FY27E': 'GAM: +{{F.salesGrowth.0|pct0}} from the five-line build.',
  'ebitdaMargin@FY27E': 'GAM: Q1 peak, then ~11.3% for Q2-Q4.',
  'otherIncome@FY27E': 'GAM: liquid funds fall to ~zero after the ₹1,400 cr EESL infusion.',
  'otherIncome@FY29E': 'GAM: interest on cash rebuilt from FY28E (no EESL infusion assumed).',
  'capex@FY27E': 'GAM: ~₹500 cr a year for lead-acid, as guided.',
};

module.exports = { risks, glossary, statementNotes };
