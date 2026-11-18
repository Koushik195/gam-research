// Godrej Industries report, part B: merges GODREJIND.part2-6.js (built on GODREJIND.ctx.js) and adds the
// cover, verdict, glossary and statement notes. Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and
// valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./GODREJIND.ctx');
const P2 = require('./GODREJIND.part2'), P3 = require('./GODREJIND.part3'), P4 = require('./GODREJIND.part4'), P5 = require('./GODREJIND.part5'), P6 = require('./GODREJIND.part6');
const { n0, n1, price, sh, ps, rating, buyBelow, sellAbove, ruleText, listedMv, ltvBase, derived, discNow, discMedAll, discMedRecent, pNd, pGc, pChem, A26, chemSep28 } = X;
const per10 = listedMv * 0.1 * (1 - derived.base / 100) / sh;

const cover = {
  headline: 'A basket of Godrej stocks at a discount that has already halved: SELL',
  lead: `Godrej Industries (GIL) is the holding company of the Godrej Industries Group: 23.7% of Godrej Consumer, 44.8% of Godrej Properties, 65.1% of Godrej Agrovet, ~91% of the unlisted lender Godrej Capital, and an oleochemicals business of its own. At ${X.ASOF_TXT} prices its stakes and businesses are worth ~₹${n0(ps(ltvBase))} a share after ₹${n0(-pNd.value)} cr of holding-company debt. The market price (₹${n0(price)}) is ${Math.round((1 - price * sh / ltvBase) * 100)}% below that; on the trailing basis we use to track the discount over time it is ${Math.round(discNow.disc)}%, against a ${Math.round(discMedAll)}% median since 2021 and ${Math.round(discMedRecent)}% since the stock re-rated in 2024. We value GIL the way the street does, as a **sum of the parts less a holding-company discount**, and derive the discount from GIL's own history: **${derived.base}%**, which gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** The listing plans for Godrej Capital and chemicals are real options, but they are already in the price; the holding company still pays no dividend and borrows ~₹700 cr a year. Bull case {{scen.bull.tp|inr}} (today's discount holds, Godrej Capital at 3x book); bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'You are buying three listed stocks, mostly', p: `GCPL, GPL and GAVL are worth ₹${n0(listedMv)} cr (₹${n0(ps(listedMv))} a GIL share) at market, ${Math.round(listedMv / (ltvBase - pNd.value) * 100)}% of gross assets. Each can be bought directly, with dividends (GCPL, GAVL) and without a holding company's debt.` },
    { h: 'The discount has done the work already', p: `GIL traded at a 57-70% discount to its look-through value from 2021 to mid-2024. It is ${Math.round(discNow.disc)}% now, after a 57% share-price rise in Apr-Jun 2026 on the group's listing plans while GCPL and GPL fell. Our base (${derived.base}%) is the median of the post-2024 regime, not a return to the old one.` },
    { h: 'The holding company is a funding vehicle', p: `Net debt rose from ~₹3,100 cr (Mar-21) to ₹${n0(-pNd.value)} cr (Jun-26E) to fund Godrej Capital (₹4,283 cr invested) and GPL's equity raises. Interest (₹839 cr in FY26) now exceeds dividends received (₹624 cr). No dividend since FY20; promoters own 74.6%.` },
    { h: 'Chemicals and Godrej Capital are options, not anchors', p: `Chemicals (₹${n0(pChem.value)} cr at ${X.chemMult.base}x Sep-28E EBITDA of ₹${n0(chemSep28)} cr) is a cyclical oleochemicals business with 7-17% PBIT margins. Godrej Capital (₹${n0(pGc.value)} cr at 2x book) grows 65% a year at ~6% ROE. Together they are worth ₹${n0(pChem.value + pGc.value)} cr, little more than the holding company's ₹${n0(-pNd.value)} cr of net debt.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit after minorities (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): chemicals margins after the strong Q1; Godrej Capital funding needs; GPL handovers.',
    'Any outside equity raise or listing step for Godrej Capital: management targets a listing once AUM reaches ₹1 lakh crore and plans ₹5,000-7,000 cr of group investment in unlisted businesses over five years.',
    'New chairperson Pirojsha Godrej (from 14-Aug-2026): capital allocation, dividend policy, any simplification of the structure.',
    'GCPL and GPL share prices: ~₹' + n0(per10) + ' a GIL share for every 10% move in the three stakes.',
    'First biosurfactant launch (due Q2FY27) and the Kundaim capacity expansion in chemicals.',
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: own the stakes directly unless you are paid for the discount',
  blocks: [
    { callout: `**What you are buying:** ₹${n0(ps(listedMv))} a share of Godrej Consumer, Godrej Properties and Godrej Agrovet at market; a fast-growing but low-return lender that needs more capital; a cyclical oleochemicals business; and ₹${n0(-ps(pNd.value))} a share of holding-company debt that grows every year. Control sits with a family that owns ~85% including its foundation.` },
    { callout: `**What you are paying:** ₹${n0(price)}, a ${Math.round(discNow.disc)}% discount to look-through value. For most of the last five years GIL traded at 57-70%. Our ${derived.base}% base-case discount (the median since the 2024 re-rating) gives {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD) or ~₹${n0(buyBelow)} (BUY) on our target`, 'Medium', 'The discount widening back towards 45-50% with stakes unchanged'],
      ['Outside equity into Godrej Capital at a high valuation', 'Medium', 'Stops the holding company\'s borrowing and marks the asset to market; each 1x of book is ~₹' + n0(X.gcBook * (1 - derived.base / 100) / sh) + ' a share on our target'],
      ['A dividend or buyback policy at GIL', 'Low', 'The new chairperson\'s first capital-allocation decisions'],
      ['GCPL and GPL recover', 'Medium', `~₹${n0(per10)} a share for every 10% move in the three stakes`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Listing plans slip; discount returns to the five-year median', 'Medium', `Bear-case discount ${derived.bear}%: target {{scen.bear.tp|inr}}`],
      ['GPL needs more equity again', 'Medium', 'GIL either subscribes with more debt or is diluted further (it already fell from 49.4% to 44.8%)'],
      ['Credit costs rise at Godrej Capital', 'Low-medium', 'Book value and the P/B both fall; more capital needed'],
      ['Refinancing: ₹4,505 cr of CP and NCDs due within a year', 'Low', 'Cost of debt rises; depends on GCPL and GPL share prices'],
      ['Chemicals margins fall back to FY24-26 levels', 'Medium', `Each 1 point of margin on Sep-28E revenue is ~₹${n0(X.chemMult.base * 0.01 * (X.F.seg.chem.revenue[1] + X.F.seg.chem.revenue[2]) / 2 * (1 - derived.base / 100) / sh)} a share`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Turn more positive below ~₹${n0(sellAbove)}** (HOLD on our target), or on outside capital for Godrej Capital at a valuation well above book.`,
      '**For investors who want the Godrej stocks:** buying GCPL, GPL and GAVL directly gives the same exposure with dividends and no holding-company debt. GIL only makes sense when the discount is wide (as it was at 60-70% in 2022-24) or a listing is imminent.',
      '**Biggest swing factors:** the discount (each 5 points is ~₹' + n0(ltvBase * 0.05 / sh) + ' a share) and the value of Godrej Capital.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Discount to look-through value', v: `${Math.round(discNow.disc)}%`, d: `${Math.round(discMedAll)}% median since 2021` },
      { k: 'Listed stakes per GIL share', v: `₹${n0(ps(listedMv))}`, d: 'at 30-Sep-2026 closes' },
      { k: 'Holding-company net debt', v: `₹${n0(-pNd.value)} cr`, d: '~₹3,100 cr in Mar-2021' },
      { k: 'Godrej Capital ROE, FY26', v: '~6%', d: 'AUM +65%' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Holding company (holdco)', 'A company whose main assets are shares in other companies; GIL owns stakes in GCPL, GPL, GAVL and Godrej Capital.'],
      ['Look-through value / NAV', 'What the holding company\'s stakes and businesses are worth, less its own net debt.'],
      ['Holding-company discount', 'How far below its look-through value the holding company trades: 1 − market value ÷ look-through value.'],
      ['Sum of the parts (SOTP)', 'Valuing each stake and business separately and adding them up.'],
      ['Associate / subsidiary', 'A company GIL significantly influences (GCPL, 23.7%: only its profit share is consolidated) / controls (GPL, GAVL, Godrej Capital: 100% consolidated, others\' share shown as minorities).'],
      ['Minority (non-controlling) interest', 'The part of a subsidiary\'s profit that belongs to its other shareholders.'],
      ['Oleochemicals', 'Chemicals made from vegetable oils: fatty acids, fatty alcohols and glycerine.'],
      ['Fatty alcohol / fatty acid / glycerine', 'Building blocks for soaps, detergents, cosmetics, tyres, lubricants and food; glycerine is the by-product of splitting oils.'],
      ['Surfactants (SLES, SLS, AOS)', 'Cleaning agents made mainly from fatty alcohols, used in shampoos and detergents.'],
      ['Biosurfactants', 'Surfactants made by fermentation; GIL\'s first launch is due in Q2FY27.'],
      ['AUM', 'Assets under management: a lender\'s total loans.'],
      ['P/B, ROE', 'Price to book value; return on equity (profit ÷ shareholders\' funds).'],
      ['EBITDA, PBIT', 'Operating profit before depreciation; profit before interest and tax (GIL reports segments on PBIT).'],
      ['Commercial paper (CP), NCD', 'Short-term (under a year) and longer-term bonds a company sells to raise debt.'],
      ['Free float', 'Shares not held by the promoter family and related entities.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.chemicals, P3.gcapital, P4.stakes, P4.moat, p.financials, p.capital, P4.quality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, risks, p.statements, glossary],
  statementNotes: {
    'pat@FY21': 'COVID year: GPL loss, chemicals PBIT ₹119 cr.',
    'sales@FY22': 'Revenue +51%: chemicals revenue +83% on higher palm-oil-linked prices; GPL revenue more than doubled.',
    'pat@FY23': 'Chemicals record PBIT ₹697 cr.',
    'pat@FY24': 'Chemicals PBIT −64% to ₹254 cr; minorities ₹535 cr; attributable profit only ₹60 cr.',
    'otherIncome@FY25': 'GPL interest from JV partners and JV profits; GCPL associate share.',
    'pat@FY26': 'Attributable ₹1,241 cr after ₹1,171 cr of minorities; chemicals PBIT ₹307 cr.',
    'interest@FY26': '~₹1,356 cr is Godrej Capital\'s cost of funds; ₹839 cr GIL standalone.',
    'pat@FY27E': 'Tax line includes minorities (61%); Q1FY27 was ₹284 cr.',
    'ebitda@FY28E': 'Godrej Capital growth and GPL margins turning less negative.',
  },
};
