// Max Healthcare report, part 5b: valuation tables (EV to target, street translation, scenarios, DCF, peers) and risks.
const X = require('./MAXHEALTH.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, A, n0, n1, pc, ASOF_TXT, price, mv, evMult, ebitdaSep28, treasurySep28, evTarget, HEV, evNow, peNow, FM, HPEA, PEERS, drEv, shortName, rating, buyBelow, sellAbove,
  pl, mosl, plNetDebt28, plEbitda28, plEv, plOnOurs, ourInPl, ourOnFy28, netEqEbitda, CONS_TO_NET, impliedWacc, ebitdaCagrFwd, Q1, NW, evBullAfter, evBearAfter } = X;

const valuationTail = [
  { exhibit: { type: 'table', title: 'From EV to target price (₹ crore unless stated)', head: ['', 'Base', 'Note'], wide: [2], rows: [
    ['Sep-28E EBITDA, consolidated, post-Ind AS', n0(ebitdaSep28), 'Half FY28E ({{F.ebitda.1|num}}) + half FY29E ({{F.ebitda.2|num}})'],
    ['× target multiple', `${evMult}x`, 'Own forward median since Apr-2021, less sector de-rating'],
    ['= Enterprise value', n0(evTarget), ''],
    ['Less: net debt incl. lease liabilities, Sep-28E', n0(-treasurySep28), 'Model; Mar-26 actual ₹2,772 cr. Loans to partner societies (₹746 cr at Mar-26) left out: ~₹8 a share of upside'],
    ['= Equity value', n0(evTarget + treasurySep28), ''],
    { hl: true, cells: ['**÷ shares (cr) = target (rounded)**', `**${n1(F.shares)} → {{dcf.tp|inr}}**`, `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
  ], source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Translating the street\'s Network multiple to our consolidated basis (FY28E)', head: ['', 'Prabhudas Lilladher (30x)', 'GAM target'], wide: [0], rows: [
    ['Network EBITDA FY28E (₹ cr)', n0(plEbitda28), `${n0(netEqEbitda[1])} (our consolidated ÷ ${n1(CONS_TO_NET * 100)}%)`],
    ['Enterprise value (₹ cr)', `${n0(plEv)} (30x)`, `${n0(evTarget)} (${evMult}x Sep-28E)`],
    ['Net debt used (₹ cr)', `${n0(plNetDebt28)} (FY28E, Network, excl. leases)`, `${n0(-treasurySep28)} (Sep-28E, consolidated, incl. leases)`],
    ['Equity value per share (₹)', n0((plEv - plNetDebt28) / F.shares), n0((evTarget + treasurySep28) / F.shares)],
    { hl: true, cells: ['**Implied EV/EBITDA on our FY28E consolidated EBITDA**', `**${n1(plOnOurs)}x**`, `**${n1(ourOnFy28)}x**`] },
    { hl: true, cells: ['**Implied EV/EBITDA on PL\'s FY28E Network EBITDA and net debt**', '**30.0x**', `**${n1(ourInPl)}x**`] },
  ], source: 'PL Q1FY27 note (16-Aug-2026); GAM Research. PL\'s FY28E net debt assumes debt falls to ₹1,924 cr despite ~₹2,300 cr of FY28 project outflow; ours rises.' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Revenue growth +3pp a year, margin +1pp; ${V.blend.methods[0].multiple.bull}x (75th percentile since Apr-2021, ${n1(HEV.p75)}x, after the sector de-rating).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; margin {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${evMult}x Sep-28E EBITDA.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Revenue growth −4pp a year, margin −1.5pp; ${V.blend.methods[0].multiple.bear}x (25th percentile, ${n1(HEV.p25)}x, after the de-rating).`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow (capex incl. new leases and partner-society funding)', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: net cash at Mar-27 (negative = net debt incl. lease liabilities)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ['Discount rate at which the DCF equals the share price', `${n1(impliedWacc)}%`],
  ], source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Listed hospital peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs 5-yr median', 'P/E (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'MAXHEALTH' ? '**Max Healthcare**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), n1(p.pe), p.roe + '%']), source: `Screener.in (consolidated, post-Ind AS EBITDA; EV includes lease liabilities), multiples scaled to the NSE close on ${ASOF_TXT}. Apollo's margin is lower because it includes pharmacy distribution.` } },
];

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a franchise worth owning at the right price; today\'s price is about right',
  blocks: [
    { callout: `**What you are buying:** India's highest-ARPOB, highest-occupancy large hospital network, concentrated in Delhi NCR and Mumbai, with a management team that has repeatedly turned around acquired hospitals, ~4,000 mostly brownfield beds coming by FY30, and a balance sheet (net debt ~1.2x EBITDA) that can fund them.` },
    { callout: `**What you are paying:** ${n1(evNow)}x our FY28E EV/EBITDA and ${n1(peNow)}x FY28E EPS, slightly below Max's own history (${n1(HEV.med)}x and ${n1(HPEA.med)}x forward medians since Apr-2021) for ~${Math.round(ebitdaCagrFwd)}% EBITDA growth. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The DCF (₹${n0(mv('dcf').value)}) is the warning: the price already assumes the expansion earns Max's historical returns for many years.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['EBITDA growing faster than revenue from Q2FY27 as the towers fill (management\'s own test)', 'Medium-high', 'Network margin back to 26-27%; EBITDA per bed above ₹73 lakh'],
      ['Oncology growth back from Q3FY27 and institutional share below 20%', 'Medium', 'Oncology share of IP revenue; payor mix'],
      ['Gurugram breaks even within a year with ~200 beds', 'Medium', 'Start-up losses; occupancy'],
      [`A share-price fall to ~₹${n0(buyBelow)} or below with estimates intact`, 'Possible', 'Buy-below level from our rule'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['A cap on drug and consumable margins (Supreme Court case, CGHS-style rules extended to insurers)', 'Medium', 'Pharmacy margin is part of ARPOB; bear case {{scen.bear.tp|inr}}'],
      ['NCR competition and doctor costs (every large chain is adding beds in Delhi NCR)', 'Medium', 'Clinician costs already +230bp YoY in Q4FY26'],
      ['Slow ramp at Gurugram, Zirakpur and the acquired hospitals; ARPOB dilution', 'Medium', 'Margins stuck near 25-26%'],
      ['Large debt-funded acquisition (management comfortable at up to 2.5x net debt/EBITDA)', 'Medium', 'More debt and integration risk; returns fall further'],
      ['Working capital: government-scheme receivables (DSO 95 days)', 'Medium', 'Lower free cash; more borrowing'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would become buyers below ~₹${n0(buyBelow)}** and sellers above ~₹${n0(sellAbove)} on today's numbers; we would raise the multiple if the new towers lift EBITDA per bed and returns stop falling.`,
      `**Biggest swing factors:** margin and the multiple. Each 1pp of FY28-29E EBITDA margin is ~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100)} cr of Sep-28E EBITDA, ~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100 * evMult / F.shares)} a share at ${evMult}x; each 1x on the multiple is ~₹${n0(ebitdaSep28 / F.shares)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Occupancy, Q1FY27', v: `${Q1.occupancyPct}%`, d: 'with beds +13% YoY' },
      { k: 'ARPOB, Q1FY27', v: `₹${n1(Q1.arpob / 1000)}k`, d: '+5% YoY; +9% ex-oncology' },
      { k: 'Beds: now → FY30 plan', v: '6,183 → ~10,200', d: '~₹7,000 cr of project outflow' },
      { k: 'Forward EV/EBITDA', v: `${n1(evNow)}x`, d: `median since Apr-2021 ${n1(HEV.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { valuationTail, risks };
