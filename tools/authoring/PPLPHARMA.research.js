// Piramal Pharma report, part B: cover, story in charts, and the merger of part2-6 (business, history, industry, tailwind
// test, CDMO, hospital generics, consumer, plants and quality, moat, FY26 loss anatomy, earnings quality, capital, ownership,
// governance, forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in PPLPHARMA.ctx.js.
// Forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./PPLPHARMA.ctx');
const { F, V, A, AS, n0, n1, price, mv, rating, MULT, EVH_BASE, EVH, K, SECTOR_EV, ebitdaSep28, JV_VALUE, ytd, px, Q1, DCFV, troughYears } = X;
const P2 = require('./PPLPHARMA.part2'), P3 = require('./PPLPHARMA.part3'), P4 = require('./PPLPHARMA.part4'), P5 = require('./PPLPHARMA.part5'), P6 = require('./PPLPHARMA.part6');
const N = require('./PPLPHARMA.narrative');

const cover = {
  headline: 'A real recovery in a capital-heavy business; its own EV/EBITDA history says there is upside, its cash flows say be careful',
  lead: `Piramal Pharma runs three businesses: a global contract development and manufacturing business (CDMO, 55% of FY26 revenue of ₹8,869 cr), hospital generics led by inhaled anaesthetics (CHG, 30%) and Indian consumer brands (PCH, 15%), plus 49% of an ophthalmology JV with AbbVie. FY26 was a bad year: revenue −3%, a ₹326 cr loss, as one large on-patent CDMO customer stopped ordering to use up stock. Q1FY27 turned: revenue +17% (about 9-10 points from the rupee), EBITDA +72%, guidance of early-to-mid-teens growth kept. The stock rose ~${Math.round(ytd)}% in 2026 to ₹${n0(price)} on 30-Sep-2026. Most brokers value it on a **sum of the parts built on EV/EBITDA** (Motilal Oswal, ICICI Direct; Choice and InCred on one consolidated EV/EBITDA); profits are too small for P/E. Piramal reports one segment, so we value the three businesses together at **${MULT.base}x Sep-28E EBITDA** (its own one-year-forward median since May-2023, ${n1(EVH_BASE.med)}x, × the pharma peers' +${SECTOR_EV}% move), add the AbbVie JV at 10x its profit share and deduct net debt: **{{dcf.tp|inr}} ({{dcf.upside|chg}}); we initiate with ${rating}**. Cross-checks are far lower: P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The operating recovery is real', p: `Every business grew 15-19% in Q1FY27, CDMO for the first time in five quarters, on better biotech funding, more RFPs and a bigger sales team. We forecast revenue +${n1(AS.revenueGrowth[0])}% / +${n1(AS.revenueGrowth[1])}% / +${n1(AS.revenueGrowth[2])}% and an EBITDA margin rising from 10.4% to ${n1(AS.ebitdaMargin[0])}% / ${n1(AS.ebitdaMargin[1])}% / ${n1(AS.ebitdaMargin[2])}% (FY27-29E), below ICICI Direct's 16.4% / 17.9%.` },
    { h: 'But EBITDA is not profit here', p: `Depreciation (~₹1,000 cr), interest (~₹400 cr) and a tax bill that runs ahead of profit (overseas losses earn no credit) absorb most of EBITDA: we forecast EPS of ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}} for FY27-29E. At ₹${n0(price)} that is ${n1(price / F.eps[1])}x FY28E earnings. The DCF (₹${n0(DCFV.engine)}; ₹${n0(DCFV.both)} with a 25% tax rate and 25% margins) does not support the price.` },
    { h: 'The upside rests on the multiple, not on our estimates', p: `Our EBITDA is below the bulls', yet our target is above theirs because Piramal's own forward EV/EBITDA median (${n1(EVH.med)}x since May-2023, every weekly point: FY26 EBITDA fell 36%, not below half its peak, so the EBITDA trough test excludes nothing) is higher than the street's blended segment multiples (₹${n0(X.SENS[9].tp)}-${n0(X.SENS[8].tp)} on our numbers). That median includes Apr-24 to Mar-25, when the multiple reached ~33x on collapsing EBITDA; leaving those dates out (the EPS reading of the trough rule) gives ${X.SENS[1].mult}x and ₹${n0(X.SENS[1].tp)}.` },
    { h: 'Three things to watch', p: 'Conversion of RFPs into orders at the under-used US and UK sites (the margin lever); Kenalog and ex-US sevoflurane in CHG; and supply: Carlyle (CA Alchemy, ~18%) has twice tried to sell and stopped. Net debt (₹4,140 cr) is above CARE\'s 3.5x trigger and rises in FY27.' },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Balance sheet', v: 'RED' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first Kenalog quarter, CDMO order conversion, and a possible guidance upgrade (management said it would revisit after the September quarter).',
    'Lexington sterile fill-finish expansion (H2 CY2027) and ADC orders at Riverview and Grangemouth; any return of the destocked on-patent product (not in FY27 guidance).',
    'Carlyle (CA Alchemy, 17.95%): a block sale was planned and called off in August 2026; a completed sale would add supply but remove the overhang.',
    'US tariff and trade terms for India-made innovator work (generics are excluded; US and UK plants are not affected).',
    'CARE\'s leverage trigger (net debt/PBILDT 3.5x): a downgrade risk if FY27 EBITDA disappoints.',
  ],
};

module.exports = {
  rating, cover,
  sections: p => [N.narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.cdmo, P3.chg, P3.pch, P3.quality, P4.moat, p.seasons, p.financials, P4.loss, P4.earnings, p.balance, P4.capital, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
