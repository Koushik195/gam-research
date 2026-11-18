// GSFC report, part B: merges GSFC.part2-5.js (built on GSFC.ctx.js) and adds the verdict, glossary and
// statement notes. Written as of 30-Sep-2026 (Q1FY27 basis). Prose numbers come from research/company.json,
// deep.json, segments.json and the built model; forecast and valuation figures are live tokens ({{...}}).
const X = require('./GSFC.ctx');
const P2 = require('./GSFC.part2'), P3 = require('./GSFC.part3'), P4 = require('./GSFC.part4'), P5 = require('./GSFC.part5');
const { F, SC, n0, n1, pctChg, price, mcap, listedMv, unlistedV, rating, buyBelow, sellAbove, ruleText, derived, NOW, HH, K, fertPt, ipPt, pb, sh, nc } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: cheap on assets, fairly priced on its own history',
  blocks: [
    { callout: `**What you are buying:** a state-run maker of ammonium sulphate, APS, urea, DAP, caprolactam, nylon-6 and melamine whose margins are set by subsidy tables and Chinese prices, plus ~₹${n0(listedMv + unlistedV)} cr of shares in GNFC, Gujarat Energy, GSPL Transmission, GIPCL, Indian Potash and others, and little debt. EPS has been ₹14-17 outside the FY22-23 boom; ROE ~5%.` },
    { callout: `**What you are paying:** ₹${n0(mcap)} cr, about ${Math.round((listedMv + unlistedV) / mcap * 100)}% of the value of the holdings alone, ${pb.toFixed(2)}x book and ${n1(X.pe28)}x our FY28E EPS. That looks like a bargain, but GSFC has traded this way for five years: the discount to look-through value was ~${Math.round(NOW.disc)}% on 30-Sep against a ${Math.round(HH.medNormal)}% median in normal years. On the street's method with our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (the BUY line on our target)`, 'Medium', 'Share price; listed holdings\' value'],
      ['A dividend, buyback or stake sale that passes portfolio value to shareholders', 'Low', 'Board decisions under Gujarat\'s 2023 PSU capital policy; any GNFC/Gujarat Energy sale'],
      ['Rabi NBS rates that cover sulphur and ammonia', 'Medium', 'Per-kg N, P, S rates vs input costs; APS/AS margins in H2FY27'],
      ['A disclosed, sensible cost and return for the Sikka acid project', 'Medium', 'EPC award value; payback vs Coromandel\'s Kakinada plants'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Sulphur stays above $800/t without compensating NBS rates', 'Medium', `Bear-case FY28E EPS ₹${n1(SC.bear.eps[1])}, ${Math.abs(pctChg(SC.bear.eps[1], F.eps[1]))}% below our base`],
      ['Capro-benzene spread falls back to $500/t; melamine stays shut', 'Medium-high', `Each 1 point of IP margin ≈ ₹${n1(ipPt)} of FY28E EPS`],
      ['GNFC, Gujarat Energy or GIPCL shares fall', 'Medium', `A 10% fall in the listed holdings ≈ ₹${Math.round(listedMv * 0.1 * (1 - derived.base / 100) / sh)} off our target`],
      ['Capex overruns at Sikka or a large Dahej commitment', 'Medium', 'Net cash turns to debt; the holding discount widens towards its 46% full-period median'],
      ['Subsidy payments slow (fiscal pressure)', 'Medium', 'More borrowing (₹500 cr already at Jun-26); lower interest income'],
      ['Unexplained contingent claims (₹1,333 cr) crystallise', 'Low', 'Up to ~₹33 a share'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Turn positive (BUY) below ~₹${n0(buyBelow)}**, or on a capital-return decision that narrows the discount; turn negative (SELL) above ~₹${n0(sellAbove)}.`,
      `**Biggest swing factor:** the holding discount. Each 5 points on the discount moves the target by ~₹${Math.round(X.ltvBase * 0.05 / sh)}. Our ${derived.base}% sits between the ${derived.bull}% of the last two years and the ${derived.bear}% five-year median.`,
      `**Second swing factor:** the fertiliser margin. Every 1 point moves FY28E EPS by ~₹${n1(fertPt)} and the target by ~₹${Math.round(F.seg.fert.revenue[0] * 0.005 * K * (1 - derived.base / 100) / sh + F.seg.fert.revenue[1] * 0.005 * K * (1 - derived.base / 100) / sh)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Holdings / market value', v: `${Math.round((listedMv + unlistedV) / mcap * 100)}%`, d: `listed alone ${Math.round(listedMv / mcap * 100)}%` },
      { k: 'Fertiliser EBIT margin, Q1FY27', v: '4.1%', d: '8.5% a year earlier' },
      { k: 'Capro-benzene spread, Q1FY27', v: '$816/t', d: 'FY26 average $535/t' },
      { k: 'Discount to look-through, 30-Sep', v: `${Math.round(NOW.disc)}%`, d: `normal-year median ${Math.round(HH.medNormal)}%` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'Company, NSE, GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['AS / APS', 'Ammonium sulphate (21% N, 24% S) and ammonium phosphate sulphate (20:20:0:13), GSFC\'s two biggest products; both need sulphuric acid, made from sulphur.'],
      ['DAP / urea', 'Di-ammonium phosphate (18% N, 46% P₂O₅) and urea (46% N), India\'s most used fertilisers; their farm prices are effectively fixed by the government.'],
      ['NBS', 'Nutrient Based Subsidy: a fixed subsidy per kg of N, P, K and S in P&K fertilisers, reset each kharif (Apr-Sep) and rabi (Oct-Mar) season.'],
      ['New Urea Policy', 'The urea subsidy regime: the government pays the gap between a plant\'s assessed cost (incl. gas) and the fixed farm price.'],
      ['DAP special package', 'Extra support during the 2026 crisis that compensates DAP at import parity plus a 4% margin.'],
      ['P₂O₅ / phosphoric acid', 'The phosphate input for DAP and APS, mostly imported; priced per tonne of P₂O₅.'],
      ['Caprolactam / nylon-6', 'Caprolactam is made from benzene and polymerised into nylon-6 (fibres, engineering plastics). The capro-benzene spread is the price gap between the two, per tonne.'],
      ['Melamine', 'A urea-based chemical used in laminates and plywood resins.'],
      ['Look-through value (LTV)', 'What GSFC\'s parts are worth added up: the business at a multiple, the holdings at market or book, plus net cash.'],
      ['Holding discount', 'How far below its look-through value the market prices a company that holds shares it does not sell or pass on.'],
      ['SOTP', 'Sum of the parts: valuing each business and holding separately and adding them up.'],
      ['FVOCI', 'Fair value through other comprehensive income: investments marked to market through reserves, not the P&L.'],
      ['EV/EBITDA; P/E; P/B', 'Enterprise value ÷ EBITDA; price ÷ earnings per share; price ÷ book value per share.'],
      ['DCF / Ke', 'Discounted cash flow; Ke is the cost of equity (here 12.5% = 6.5% risk-free + 1.0 × 6% equity risk premium).'],
      ['PSU', 'Public-sector undertaking: a company controlled by the central or a state government.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover: P2.cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.fert, P3.ip, P3.portfolio, P4.moat, p.financials, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P5.valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY16': 'Revenue +15% (FY16 segment detail not reviewed).',
    'sales@FY18': 'Revenue +19% (FY18 segment detail not reviewed).',
    'sales@FY19': 'Revenue +36%: fertiliser revenue ₹6,314 cr and industrial products ₹2,176 cr (FY18 split not reviewed).',
    'sales@FY20': 'Industrial products revenue −28% to ₹1,560 cr.',
    'sales@FY22': 'Industrial products +66% to ₹2,933 cr (caprolactam, melamine boom); fertiliser +5%.',
    'sales@FY23': 'Fertiliser revenue +44% to ₹8,840 cr on record subsidy-backed prices.',
    'sales@FY24': 'Fertiliser revenue −23% as prices and subsidies fell; IP −8%.',
    'sales@FY26': 'Fertiliser +16% (volume +12% to 22.31 lakh t, traded urea 3.20 lakh t); IP +9%.',
    'ebitdaMargin@FY20': 'Industrial products EBITDA margin 1.1% (EBIT −₹69 cr); central costs ₹103 cr.',
    'ebitdaMargin@FY21': 'IP margin back to 12%; fertiliser 7.8%.',
    'ebitdaMargin@FY22': 'Both segments boomed: fertiliser 12.7%, IP 20.9%.',
    'ebitdaMargin@FY23': 'Fertiliser 17.6% (EBIT ₹1,460 cr); IP collapsed to 3.7% on Chinese supply.',
    'ebitdaMargin@FY24': 'Fertiliser margin back to 7.1%; IP 4.5%.',
    'ebitdaMargin@FY26': 'IP margin 12.1% (technical urea, HX crystal, traded ammonia, melamine exports); fertiliser 6.6% as sulphur rose 164%.',
    'pat@FY20': 'IP loss; profit ₹110 cr.',
    'pat@FY21': 'Includes a ₹32 cr exceptional gain after tax; finance cost fell as borrowings were repaid (₹1,559 cr to ₹37 cr).',
    'pat@FY22': 'EBITDA more than doubled.',
    'pat@FY23': 'Record EBITDA ₹1,588 cr; tax rate 18%.',
    'pat@FY24': 'EBITDA −68%; other income rose to ₹385 cr (interest on ~₹2,300 cr of cash, dividends ₹147 cr).',
    'pat@FY26': 'IP EBIT ₹200 cr (₹56 cr); includes a ₹34 cr earlier-year tax credit.',
    'otherIncome@FY24': 'Dividends ₹147 cr and interest on the cash pile.',
    'dep@FY26': 'Urea-II revamp, SA-V acid plant and solar capitalised (₹674 cr).',
    'sales@Q3FY24': 'Revenue −42% YoY as FY23 record prices and subsidies fell away (quarter detail not reviewed).',
    'opm@Q4FY24': 'EBITDA ₹26 cr (1.3% margin); quarter detail not reviewed.',
    'sales@Q3FY25': 'DAP trading revenues up; fertiliser revenue ₹2,172 cr.',
    'sales@Q2FY26': 'Fertiliser +21% (volume 6.08 lakh t, DAP trading); IP +13%.',
    'pat@Q2FY26': 'Fertiliser EBIT ₹224 cr; IP EBIT ₹54 cr; dividends arrive in Q2.',
    'opm@Q4FY26': 'Fertiliser EBIT −₹44 cr (derived) as the Hormuz closure lifted sulphur and ammonia; IP EBIT ₹112 cr.',
    'sales@Q4FY26': 'Record Q4 fertiliser revenue ₹1,985 cr (+43%; volume +49% YoY); IP ₹637 cr (derived).',
    'sales@Q1FY27': 'Fertiliser +82% (volume +17%, DAP special package, traded DAP); IP +15%.',
    'pat@Q1FY27': 'Fertiliser EBIT margin 4.1% (8.5%); IP EBIT ₹116 cr (₹25 cr) on a $816/t spread.',
  },
};
