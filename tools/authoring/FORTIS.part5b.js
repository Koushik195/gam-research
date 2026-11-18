// Fortis report, part 5b: SOTP build, scenarios, DCF detail, peers; risks & honest summary.
const X = require('./FORTIS.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, A, n0, n1, pc, ASOF_TXT, price, mv, pHosp, pEsop, pDiag, pMin, pNet, hospMult, diagMult, hospSep28, diagSep28, esopSep28, HEV, evNow, peNow, FM, PEERS, DPEERS, drEv, shortName, rating, buyBelow, sellAbove, Q1, netOcc, isecOnOurs } = X;
const ps = p => n0(p.value / F.shares);

const sotpBlocks = [
  { exhibit: { type: 'table', title: 'Sum of the parts (₹ crore unless stated)', head: ['Part', 'Sep-28E metric', 'Multiple', 'Value', '₹ / share', 'Basis'], wide: [5], rows: [
    ['Hospitals', n0(hospSep28), `${hospMult}x`, n0(pHosp.value), ps(pHosp), `Operating EBITDA before ESOP, half FY28E (${n0(X.HS.adjEbitda[1])}) + half FY29E (${n0(X.HS.adjEbitda[2])})`],
    ['Less: ESOP charge, capitalised', n0(-esopSep28), `${hospMult}x`, n0(pEsop.value), ps(pEsop), 'Recurring cost of retaining doctors (₹120 cr FY28E, ₹100 cr FY29E)'],
    ['Diagnostics (Agilus, 100%)', n0(diagSep28), `${diagMult}x`, n0(pDiag.value), ps(pDiag), 'Operating EBITDA on gross revenue'],
    ['Less: Agilus minority (11.68%)', '', '', n0(pMin.value), ps(pMin), 'Others\' share of the Agilus value'],
    { hl: true, cells: ['**Enterprise value attributable to Fortis**', '', '', `**${n0(pHosp.value + pEsop.value + pDiag.value + pMin.value)}**`, `**${n0((pHosp.value + pEsop.value + pDiag.value + pMin.value) / F.shares)}**`, ''] },
    ['Less: net debt incl. ₹600-616 cr of leases, Sep-27E', '', '', n0(pNet.value), ps(pNet), 'Model: half Mar-27E + half Mar-28E; associates at book'],
    { hl: true, cells: ['**Equity value ÷ 75.5 cr shares = target (rounded)**', '', '', `**${n0(V.sotp.equity)}**`, '**{{dcf.tp|inr}}**', `vs CMP ₹${n0(price)}: {{dcf.upside|chg}}`] },
  ], source: 'GAM Research (assumptions.json valuation parts; live in the Excel SOTP sheet)' } },
  { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
    ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} Hospital growth +2pp a year and margin +1.2pp; Agilus +2pp and +1pp; ${X.AS.valuation.parts[0].multiple.bull}x hospitals, ${X.AS.valuation.parts[2].multiple.bull}x Agilus (Fortis's own 75th percentile, near the street).`],
    { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}; EBITDA margin after ESOP {{F.ebitdaMargin.0|pct}} → {{F.ebitdaMargin.2|pct}}; ${hospMult}x hospitals, ${diagMult}x Agilus.`] },
    ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} Hospital and Agilus growth −3pp a year, margins −1.5pp; ${X.AS.valuation.parts[0].multiple.bear}x hospitals, ${X.AS.valuation.parts[2].multiple.bear}x Agilus.`],
  ], source: 'GAM Research' } },
  { h: 'The DCF cross-check in detail' },
  { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
    ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
    ['Add: net cash at Mar-27E (negative = net debt incl. leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
    { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
  ], source: 'GAM Research (minorities via the tax line; no separate deduction)' } },
  { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
  { exhibit: { type: 'table', title: 'Listed hospital and diagnostics peers (trailing, at the 30-Sep-2026 close)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA (x)', 'vs 5-yr median', 'P/E (x)', 'ROE'], rows: [...PEERS, ...DPEERS].map(p => [p.symbol === 'FORTIS' ? '**Fortis**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.evEbitda), pc(drEv[p.symbol]), n1(p.pe), p.roe + '%']), source: `Screener.in (post-Ind AS EBITDA incl. other income; EV includes lease liabilities), multiples scaled to the NSE close on ${ASOF_TXT}. Fortis ROE on reported (pre-minority) profit.` } },
];

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better company than in 2018, but the price already assumes the best case',
  blocks: [
    { callout: `**What you are buying:** a national hospital network (₹${n0(X.FY26.hospRevenue)} cr of hospital revenue in FY26), with flagship hospitals in NCR, 68-70% occupancy, a 22% hospital margin, ~1,800 brownfield beds to add by FY30 that its own cash can fund, a controlling shareholder with deep pockets, and an 88% stake in a national lab chain whose margins have recovered.` },
    { callout: `**What you are paying:** ${n1(evNow)}x our FY28E EV/EBITDA and ${n1(peNow)}x FY28E EPS: above Fortis's own forward medians since 2021 (${n1(HEV.med)}x and ${n1(FM.median)}x) and above the peer median, for ~15% EBITDA growth and a ~12-13% ROE, just as the 2018 deal goes back under a court-ordered forensic audit and the Supreme Court questions hospital drug margins. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): **${rating}**. P/E (₹${n0(mv('pe').value)}) and DCF (₹${n0(mv('dcf').value)}) agree that the price is ahead of the fundamentals.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Hospital margin after ESOP heads to 25% by FY28 (our FY28E 22.2%)', 'Low-medium', 'Quarterly hospital margin, ramp-up units reaching mid-teens'],
      ['Forensic audit closes with no finding against Fortis or IHH', 'Medium', 'Auditor\'s report (due ~6 months after the 31-Aug-2026 order); next court steps'],
      ['IHH injects equity at or above market, or merges Gleneagles on fair terms', 'Medium', 'Terms, swap ratio, majority-of-minority vote'],
      ['Agilus grows 12%+ with test volumes, not just price', 'Medium', 'Tests per quarter, B2C share'],
      ['A price fall to below ~₹' + n0(buyBelow), '–', 'At that level the stock would be a Buy on our numbers'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Drug and consumable margins capped (Supreme Court, CGHS/ECHS)', 'Medium', 'Pharmacy is a large part of hospital profit; a cap on mark-ups would hit margins across the sector'],
      ['Forensic audit drags on or makes adverse findings', 'Low-medium', 'Delays IHH\'s stake increase and capital; management distraction; legal costs (~₹25 cr a year)'],
      ['Doctor poaching and new supply in NCR and Bengaluru', 'Medium', 'Higher doctor costs, lower occupancy (BG Road already ~55%)'],
      ['Tower delays (Shalimar Bagh already slipped a year)', 'Medium', 'Growth falls toward ~10% in FY28'],
      ['A large acquisition or a related-party merger on poor terms', 'Low-medium', 'Dilution of returns; goodwill already ₹4,722 cr'],
      ['Upside risk to our call: the market keeps paying 27-30x', 'Medium', 'Bull case {{scen.bull.tp|inr}}'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and stay sellers above ~₹${n0(sellAbove)} on today's numbers; we would raise the hospital multiple if the audit closes cleanly and margins after ESOP reach 23% (our FY28E 22.2%).`,
      `**Biggest swing factor:** the hospital multiple. Each 1x on Sep-28E hospital EBITDA after ESOP is ~₹${n0((hospSep28 - esopSep28) / F.shares)} a share; at ~20x Sep-28E (≈ 21.5x FY28E) the target would be ~₹${n0(V.tp + 1.5 * (hospSep28 - esopSep28) / F.shares)}, a Hold.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Occupancy, Q1FY27', v: `${Q1.occupancyPct}%`, d: 'flat YoY on +17% occupied beds' },
      { k: 'Beds, Mar-26 → FY30 plan', v: '4,968 → 6,774', d: 'plus ~1,200 O&M beds' },
      { k: 'Hospital margin, Q1FY27', v: `${Q1.hospOpMarginPct}%`, d: 'before ESOP; target 25% after ESOP by FY28' },
      { k: 'Forward EV/EBITDA', v: `${n1(evNow)}x`, d: `median since 2021 ${n1(HEV.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { sotpBlocks, risks };
