// Tube Investments of India report, part B: cover, risks & honest summary, glossary, statement notes, and the merge of
// TIINDIA.part2-6.js (built on TIINDIA.ctx.js). Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./TIINDIA.ctx');
const P2 = require('./TIINDIA.part2'), P3 = require('./TIINDIA.part3'), P4 = require('./TIINDIA.part4'), P5 = require('./TIINDIA.part5'), P6 = require('./TIINDIA.part6');
const { n0, n1, price, sh, ps, rating, buyBelow, sellAbove, ruleText, listedMv, cgMv, DISC, SAM, discNow, discMedRecent, saSepPat, saSepEps, sectorDr, preMed, TIC, OTHER_UNL, medTp, coreHist } = X;
const ltv = SAM.base * saSepPat('base') + listedMv + TIC.base + OTHER_UNL;
const per10 = listedMv * 0.1 * (1 - DISC.base / 100) / sh;

const cover = {
  headline: `You get TII's own business for free, and CG Power at a ${Math.round(discNow.disc)}% discount: BUY`,
  lead: `Tube Investments of India (TII) is the Murugappa group's engineering company: India's largest precision-tube maker, the leader in auto chains, the BSA and Hercules cycle brands, and the owner of 56.29% of CG Power, 70.46% of Shanthi Gears and a portfolio of start-ups led by TI Clean Mobility (electric commercial vehicles). On ${X.ASOF_TXT} TII's market value (₹${n0(price * sh)} cr) was ${Math.round((1 - price * sh / cgMv) * 100)}% **below the market value of its CG Power shares alone** (₹${n0(cgMv)} cr). We value TII the way the street does, as a **sum of the parts**: its own business at ${SAM.base}x Sep-28E core EPS (its own pre-CG forward P/E, ${n1(preMed)}x, cut by the ${Math.abs(sectorDr).toFixed(1)}% auto-component de-rating), the listed stakes at market less a **${DISC.base}% holding-company discount** (TII's own median since Sep-2024, a judgement: the 2021-26 median is a premium; ${Math.round(discNow.disc)}% today), and the unlisted ventures at cost. That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}} (today's discount persists and TICMPL's equity is worth nothing).`,
  arguments: [
    { h: 'The discount is the widest in TII\'s history', p: `From 2021 to mid-2024 TII traded at or above the value of what it owns. Since then CG Power kept rising and TII fell: on our convention the discount on the listed stakes went from ~0% (Jun-2024) to ${Math.round(discNow.disc)}% (Sep-2026). Our base case assumes only a return to the post-2024 median (${DISC.base}%, close to MOSL's 35%). Every 10% move in CG Power is ~₹${n0(per10)} a TII share at that discount.` },
    { h: 'The standalone business is a high-return compounder', p: `Precision tubes, chains and cycles earned ₹${n0(coreHist.FY26)} cr of core profit in FY26 (before CG dividends) at a 44% pre-tax ROIC, and generated ₹826 cr of free cash flow. Q1FY27 volumes grew 17%; margins dipped on steel costs that contracts pass through with a 2-3 quarter lag. At ${SAM.base}x Sep-28E core EPS of ₹${n1(saSepEps('base'))} it is worth ₹${n0(SAM.base * saSepEps('base'))} a share.` },
    { h: 'The ventures are the reason for the discount', p: `TII has put ~₹1,600 cr into TI Clean Mobility, TI Medical, 3xper and others since FY22, and the residual block lost ₹550 cr at EBITDA in FY26. TICMPL's revenue grew 77% in Q1FY27 and management says peak losses are behind it, but ₹500 cr more is committed. We value the ventures at cost (₹${n0(ps(TIC.base + OTHER_UNL))} a share): they are not the case for the stock.` },
    { h: 'Why not more upside, and what could go wrong', p: `TII's shareholders get CG Power's value only through a ~₹115 cr dividend; nothing forces the discount to close, and TII has never sold a CG share. CG Power itself trades at ~106x trailing earnings, so the stake's value can fall fast (at ₹650 a CG share our target falls by ~₹${n0((cgMv * (1 - 650 / X.cgPx)) * (1 - DISC.base / 100) / sh)}). Street targets standing on 30-Sep-2026: median ₹${n0(medTp)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit after minorities (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether steel-price recovery lifts standalone margins back towards 12%, and TICMPL\'s quarterly loss.',
    'CG Power\'s share price and results: the stake is ~85% of TII\'s look-through value.',
    'The second ₹250 cr tranche into TICMPL (planned for Q3FY27) and any update on an IPO or new outside capital.',
    'Break-even of the first EV business (guided for FY27); 3xper\'s regulatory inspection (expected FY28); TI Medical\'s IV-cannula plant.',
    'Any capital-return or restructuring step (higher dividend, buyback, CG Power share sale): none announced.',
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a cheap way to own CG Power, with a good tube business attached',
  blocks: [
    { callout: `**What you are buying:** ₹${n0(ps(cgMv))} a share of CG Power at market and ₹${n0(ps(X.sgMv))} of Shanthi Gears; a precision-tube, chain and cycle business earning ~₹${n0(coreHist.FY26 / sh)} of core EPS at a 44% ROIC; and ~₹${n0(ps(TIC.base + OTHER_UNL))} a share of loss-making ventures (at cost). Before any discount that is ~₹${n0(ps(ltv))} a share.` },
    { callout: `**What you are paying:** ₹${n0(price)}, less than the CG Power stake alone. Our ${DISC.base}% base-case discount (the median since Sep-2024) gives {{dcf.tp|inr}} ({{dcf.upside|chg}}). MOSL's ₹3,379 is lower mainly because it puts only 15x on the standalone business; its 35% discount is almost the same as ours. Geojit (₹3,131, May-2026) does not disclose its method in the sources we found.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['A capital-return or simplification step', 'Low-medium', 'Higher dividend, a buyback, or monetising part of the CG Power stake'],
      ['TICMPL break-even or outside capital at a higher valuation', 'Medium', 'Quarterly EV segment loss; IPO preparations'],
      ['Steel pass-through restores standalone margins to 12-13%', 'High', 'Q2-Q3FY27 segment PBIT margins'],
      ['CG Power keeps compounding', 'Medium', `~₹${n0(per10)} a TII share for every 10% move in CG Power`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['The discount stays at today\'s level', 'Medium', `Bear-case discount ${DISC.bear}%: target {{scen.bear.tp|inr}}`],
      ['CG Power de-rates (it trades at ~106x trailing earnings)', 'Medium', 'At ₹650 a CG share and a 34% discount the target falls ~₹' + n0((cgMv * (1 - 650 / X.cgPx)) * (1 - DISC.base / 100) / sh)],
      ['More cash into ventures that do not earn their cost of capital', 'Medium-high', 'TICMPL ₹500 cr still committed; ~₹300 cr a year into other subsidiaries'],
      ['Steel prices keep rising faster than contracts reset', 'Medium', 'Each 1 point of standalone EBITDA margin on Sep-28E revenue is ~₹' + n0(SAM.base * 0.01 * (X.saB.base[1].rev + X.saB.base[2].rev) / 2 * (1 - X.B.taxRate / 100) / sh) + ' a share'],
      ['Auto and industrial downturn', 'Low-medium', 'Volumes in tubes and chains; CG Power orders'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY below ~₹${n0(buyBelow)}; HOLD up to ~₹${n0(sellAbove)}** on our target.`,
      '**For investors who want CG Power:** TII is the cheaper way in on 30-Sep-2026 prices, with a good industrial business attached, but you give up control of the cash and take the venture risk.',
      `**Biggest swing factors:** the discount (each 5 points is ~₹${n0(listedMv * 0.05 / sh)} a share) and CG Power's share price.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Discount on the listed stakes', v: `${Math.round(discNow.disc)}%`, d: `${Math.round(discMedRecent)}% median since Sep-2024` },
      { k: 'CG Power stake per TII share', v: `₹${n0(ps(cgMv))}`, d: `price ₹${n0(price)}` },
      { k: 'Standalone pre-tax ROIC, FY26', v: '44%', d: 'FCF ₹826 cr' },
      { k: 'Venture EBITDA loss, FY26', v: '₹550 cr', d: 'EV segment loss ₹147 cr in Q1FY27' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Holding company (holdco) discount', 'How far below the market value of its listed stakes the market values them inside TII: 1 − (TII market value − standalone value − unlisted at cost) ÷ listed stakes at market.'],
      ['Look-through value', 'What TII\'s businesses and stakes are worth separately, before any discount.'],
      ['Sum of the parts (SOTP)', 'Valuing each business and stake separately and adding them up.'],
      ['Standalone / consolidated', 'TII\'s own businesses only / TII plus all the companies it controls (CG Power, Shanthi Gears, TICMPL and others) at 100%.'],
      ['Core profit / core EPS', 'TII standalone profit before the CCPS fair-value gains and before dividends from CG Power and Shanthi Gears.'],
      ['Minority (non-controlling) interest', 'The part of a subsidiary\'s profit or equity that belongs to its other shareholders (43.7% of CG Power).'],
      ['CCPS', 'Compulsorily convertible preference shares: they must turn into equity later; TICMPL\'s investors\' convert at an IPO.'],
      ['Fair value through profit or loss (FVTPL)', 'An accounting treatment where changes in an investment\'s estimated value go through the P&L.'],
      ['CDW / ERW tubes, CRSS', 'Cold-drawn welded and electric-resistance-welded steel tubes; cold-rolled steel strips.'],
      ['MFP', 'Metal formed products: chains, fine-blanked parts, door frames, railway sections.'],
      ['OSAT', 'Outsourced semiconductor assembly and test (CG Semi\'s Sanand plant).'],
      ['CDMO', 'Contract development and manufacturing organisation (3xper).'],
      ['e-SCV, e-3W, M&HCV', 'Electric small commercial vehicle; electric three-wheeler; medium and heavy commercial vehicle.'],
      ['ROIC', 'Return on invested capital: operating profit ÷ capital employed in the business (TII quotes it before tax).'],
      ['P/E, forward P/E', 'Price ÷ earnings per share; forward = on the next full year\'s EPS.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.standalone, P3.cgpower, P3.ventures, P4.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P6.valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY22': 'First full year with CG Power (subsidiary from 26-Nov-2020): revenue doubled.',
    'pat@FY24': 'Includes ~₹550 cr of CG Power exceptional gains (Dec-2023 quarter); EPS ₹62.1.',
    'pat@FY25': 'EV and venture losses (residual EBITDA −₹538 cr) and a ₹137 cr fair-value loss on TICMPL investors\' CCPS.',
    'pat@FY26': 'Minorities ₹481 cr; exceptional charges ₹68 cr; TICMPL CCPS reclassified to minority interest on 30-Mar-2026.',
    'otherIncome@FY24': 'Includes CG Power exceptional gains (Screener puts exceptional items in other income).',
    'capex@FY26': 'CG Power capacity (switchgear, CG Semi OSAT plant) and venture capex.',
    'pat@FY27E': 'Tax line includes minorities (62.5%); Q1FY27 attributable profit ₹169 cr.',
    'pat@FY28E': 'Venture losses narrow; standalone margin back to ~12.3% after steel pass-through.',
  },
};
