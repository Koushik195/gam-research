// Tata Chemicals report, part B: merges TATACHEM.part2-6.js (built on TATACHEM.ctx.js) and adds the
// cover, verdict, glossary and statement notes. Written as of 30-Sep-2026 (Q1FY27 basis). Prose numbers
// come from research/company.json, deep.json, segments.json and the built model; forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./TATACHEM.ctx');
const P2 = require('./TATACHEM.part2'), P3 = require('./TATACHEM.part3'), P4 = require('./TATACHEM.part4'), P5 = require('./TATACHEM.part5'), P6 = require('./TATACHEM.part6');
const { F, V, n0, n1, price, sh, rating, buyBelow, sellAbove, ruleText, quotedMV, rallisMcap, opsMult, impliedOpsMult, mv, sep28, A26 } = X;

const cover = {
  headline: 'Good assets in a bad cycle, and a share price propped up by Titan: SELL',
  lead: `Tata Chemicals is one of the world's largest soda ash makers outside China, with low-cost natural mines in the US and Kenya, an integrated Indian business, 55% of Rallis India and a portfolio of Tata-group shares. Chinese oversupply has pushed export prices to near cash cost: US EBITDA fell from ₹1,269 cr (FY23) to ₹3 cr in Q1FY27, the US goodwill was written down by ₹1,837 cr and FY26 ended in a loss after minorities. India is the only large unit earning well. We value the stock the way the street does, on the **sum of its parts (Sep-28E EV/EBITDA by geography, Rallis and the Tata-group shares at market less 20%)**. That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}})**: **we initiate with ${rating}.** About ₹330 a share of value is shares the company does not control; the operations are worth ~₹${n0(mv('sotp').value - 330)} a share after debt and pensions. Our EBITDA is far below the street because we do not assume Chinese capacity closes. Bull case {{scen.bull.tp|inr}} (soda ash recovery plus a Tata Sons listing); bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Soda ash: China sets the price and has too much', p: 'Chinese inventories are at a record 1.73 mt and export prices are US$160-180/t FOB, near cash cost. Management says US exports to South-East Asia will stay "breakeven or unremunerative" at least through FY27 and sees no uplift "unless some capacity rationalization happens in China". Volumes are fine; price is the problem.' },
    { h: 'India earns the money, but Q1 flattered it', p: `India made ₹${n0(A26.indiaEbitda)} cr of EBITDA in FY26 and a record 28% margin in Q1FY27 on import-parity pricing, salt volumes and cheap coal. Management itself calls ~18% sustainable. We use 19.5-20% for FY28-29E; the street uses ~24%.` },
    { h: 'Half the value is somebody else\'s business', p: `The Tata-group shares (Titan ₹6,342 cr, Indian Hotels, Tata Steel and others: ₹${n0(quotedMV)} cr) and the Rallis stake (₹${n0(rallisMcap * 0.5504)} cr) are worth ₹${n0((quotedMV + rallisMcap * 0.5504) / sh)} a share before any discount, over half the price. They move with Titan, not with soda ash. The 2.53% Tata Sons stake is a real option (₹390+ a share at press valuations) but has no listing date; we leave it out of the base case, as the street does.` },
    { h: 'Valuation: priced for a recovery we do not yet see', p: `At ₹${n0(price)} the market pays ~${n1(impliedOpsMult)}x our Sep-28E EBITDA for the operations; our multiples (India 8x, US 6x, others 5-8x, in the street's range) blend to ${n1(opsMult)}x. Our FY28E EPS of ₹{{F.eps.1|n1}} compares with Motilal Oswal's ₹43; P/E is meaningless. The DCF and a group EV/EBITDA cross-check are higher, but only because they ignore pensions, minorities and holding-company discounts.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA (₹ cr)', 'ebitda', 'num'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit after minorities (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): US EBITDA per tonne after the Searles Valley contracts; whether India\'s Q1 margin holds as costlier coal comes through.',
    'Indian safeguard duty on soda ash imports: DGTR investigation opened 16-Mar-2026; a decision would support domestic prices.',
    'Tata Sons: whether it lists (RBI rejected its de-registration on 11-Sep-2026) or restructures to avoid listing (Tata Trusts proposal reported 29-Sep-2026).',
    'Chinese soda ash capacity closures and export prices; Kenya\'s fuel hedge ends in October 2026.',
    'Non-core land sales from H2FY27; 82.5 KTPA IVSD salt plant at Mithapur due by end-FY27.',
  ],
};

// ---------------------------------------------------------------- Verdict
const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: buy Titan directly if you want Titan',
  blocks: [
    { callout: '**What you are buying:** low-cost natural soda ash mines in the US and Kenya that earn almost nothing while China floods the market; a solid Indian soda ash, salt and bicarb business; 55% of a mid-sized agrochemical company; and a portfolio of Tata-group shares dominated by Titan. Plus an option on a Tata Sons listing.' },
    { callout: `**What you are paying:** ₹${n0(price)}, of which ~₹330 is listed shares and Rallis at our 20% discount. The rest pays ~${n1(impliedOpsMult)}x our Sep-28E EBITDA for operations that earned a 3% ROCE in FY26. On the street's method with our estimates the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}).` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD) or ~₹${n0(buyBelow)} (BUY) on our target`, 'Medium', 'Share price around the Q2FY27 results'],
      ['Chinese soda ash capacity actually closes', 'Low-medium', 'Chinese inventory below ~1 mt; export prices above US$200/t FOB; US EBITDA back above US$20/t'],
      ['Tata Sons lists', 'Uncertain', 'Tata Sons board and RBI decisions; each ₹10,000 cr of stake value is ~₹196 a share at a 50% discount'],
      ['Safeguard duty in India', 'Medium', 'DGTR final findings and the government\'s decision'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['India margin falls to ~17-18% as coal, limestone and freight costs rise', 'Medium', '~₹100-150 cr less EBITDA a year; EPS near zero in FY28E'],
      ['Titan and other Tata shares fall', 'Medium', 'Every 10% fall in the portfolio is ~₹26 a share off our target'],
      ['US stays at break-even through FY29', 'Medium', 'Bear-case target {{scen.bear.tp|inr}}'],
      ['Debt rises with losses and FX', 'Medium', 'Net debt already ~4x EBITDA ex-Rallis; ratings pressure'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Turn more positive below ~₹${n0(sellAbove)}** (HOLD on our target), or on evidence of Chinese capacity cuts lifting US EBITDA per tonne.`,
      '**Biggest swing factors:** the soda ash export price (the US and Kenya) and the Tata Sons decision. Both are outside management\'s control.',
      '**For investors who want the Tata Sons option:** it is binary. At ₹611 the market gave back the whole 15-Sep rally by 30-Sep, so the option is cheap, but owning it means owning a soda ash downturn too.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'US EBITDA per tonne, Q1FY27', v: 'US$1', d: 'US$41 a year earlier' },
      { k: 'India EBITDA margin, Q1FY27', v: '28.4%', d: '"around 18%" sustainable' },
      { k: 'Listed shares + Rallis', v: `₹${n0((quotedMV + rallisMcap * 0.5504) / sh)}/sh`, d: 'before the 20% discount' },
      { k: 'Group ROCE, FY26', v: '3%', d: 'vs ~11% cost of capital' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

// ---------------------------------------------------------------- Glossary
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Soda ash (light, dense)', 'Sodium carbonate, used for glass, detergents, lithium carbonate and chemicals. Dense ash is the grade used by glass makers, including solar glass.'],
      ['Natural vs synthetic soda ash', 'Natural ash is refined from mined trona (US, Kenya, parts of China) and needs less energy; synthetic ash is made from salt and limestone (Solvay process) in India, Europe and much of China.'],
      ['Trona', 'The mineral from which natural soda ash is made; Wyoming\'s Green River basin has the world\'s largest deposits.'],
      ['Sodium bicarbonate (bicarb)', 'Baking soda; food, feed, pharma and technical (e.g. textile, flue-gas) grades.'],
      ['IVSD salt', 'Iodised vacuum-dried salt, the refined edible grade.'],
      ['scFOS / prebiotics', 'Short-chain fructo-oligosaccharides, a fibre used in food and nutrition.'],
      ['Precipitated silica', 'A white powder used mainly in tyres to cut rolling resistance.'],
      ['Import parity price', 'The price at which imports would land in India (world price + freight + duty); Indian soda ash prices follow it.'],
      ['Safeguard duty / quantity restriction', 'A temporary trade measure against a surge in imports, recommended by DGTR and decided by the government.'],
      ['EBITDA / EV/EBITDA', 'Operating profit before depreciation; enterprise value (market value plus net debt) divided by EBITDA.'],
      ['Sum of the parts (SOTP)', 'Valuing each business and asset separately and adding them up, less debt and other claims.'],
      ['Holding-company discount', 'A discount (here 20%) applied to shares a company holds in others, because its own shareholders cannot access that value directly.'],
      ['Minorities (non-controlling interests)', 'The share of a subsidiary\'s profit that belongs to its other owners: 44.96% of Rallis and 50% of the ALCAD partnership.'],
      ['Goodwill impairment', 'A write-down of the premium paid for an acquisition when the business is worth less than its book value.'],
      ['Deferred tax asset (DTA)', 'Future tax savings from past losses; written off when profits to use them look unlikely.'],
      ['Tata Sons / NBFC-UL / CIC', 'Tata Sons is the group holding company; RBI classes it as an upper-layer NBFC (core investment company), which brings a listing requirement.'],
      ['ROCE / WACC / DCF', 'Return on capital employed; weighted cost of capital (~11% here); discounted cash flow valuation.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.india, P3.us, P4.overseas, P4.holdco, P4.moat, p.financials, p.capital, P4.quality, p.balance, P5.ownership(p.ownershipBase), P5.governance, P5.forecasts, P5.street, P6.valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY22': 'Post-COVID soda ash upcycle: revenue +24%.',
    'ebitda@FY23': 'Record EBITDA: soda ash prices peaked; US ₹1,269 cr, UK ₹615 cr, Kenya ₹468 cr.',
    'pat@FY24': 'UK exceptional charge (₹963 cr in Q4); minorities ₹167 cr.',
    'ebitdaMargin@FY25': 'Chinese oversupply: US EBITDA −40%, UK near zero.',
    'pat@FY26': 'US goodwill impairment ₹1,837 cr, labour codes ₹54 cr, UK closure ₹65 cr and a US DTA write-off; minorities ₹181 cr.',
    'otherIncome@FY26': 'Other income ₹316 cr + JV profit ₹167 cr, less exceptional items (₹1,891 cr on Screener).',
    'otherIncome@FY27E': 'Engine workaround: ~₹350 cr of other income and JV profit, less ~₹122 cr of tax and ~₹217 cr of minorities.',
    'pat@FY27E': 'Loss after minorities: US near break-even (2.5% margin), depreciation up to ~₹1,350 cr.',
    'pat@FY28E': 'US margin 7%, Searles Valley volumes; tax line includes ~₹235 cr of minorities.',
    'pat@FY29E': 'US margin 9%; Valinokkam salt and silica start.',
  },
};
