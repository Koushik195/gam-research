// Bharat Forge report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./BHARATFORG.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, price, adjMed, MULT, rating, buyBelow, sellAbove, medTp, epsSep, adj27, segE, Q1 } = X;
const r10 = v => Math.round(v / 10) * 10;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good Indian business and a real defence option, fully priced; ${rating} at ${n1(price / epsSep.base)}x Sep-28E`,
  blocks: [
    { callout: '**What you are buying:** India\'s largest forger with a 27% margin core, a defence arm with a ₹11,196 cr order book and its own artillery designs, a growing aerospace and power-gen business, and an overseas drag that should shrink as the German steel plant closes by end-2027.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[1])}x our FY28E and ${n1(price / epsSep.base)}x Sep-28E EPS, after seven years of flat EPS (FY19-FY26). Our EPS roughly doubles by FY28E and we are still ~10% below the street. The stock's own forward P/E median since 2021 is ${n1(adjMed)}x on clean EPS; auto-component stocks were below their five-year medians on 30-Sep-2026. That gives ${MULT.base}x and {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['ATAGS FOPM approval and first deliveries; carbines in serial production', 'Medium', 'KSSL revenue above ₹600 cr a quarter with 18%+ margins'],
      ['US truck orders and Class 8 production rising through 2027', 'Medium', 'Standalone exports; Americas export revenue back above ₹800 cr a quarter'],
      ['Overseas losses end: CDP closed on time, US margins at high single digits', 'Medium', 'Overseas PBT (−₹120 cr in Q1FY27 before forex and exceptional items)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Defence execution slips again (approvals, lumpy exports); margins stay near 10%', 'Medium', `KSSL EBITDA ~₹${n0(segE('kssl')[1] * 0.55)} cr in FY28E instead of ₹${n0(segE('kssl')[1])} cr`],
      ['US truck cycle stalls under tariffs and energy prices', 'Medium', 'Standalone growth single-digit; margin toward 26%'],
      ['More overseas restructuring or acquisitions that do not earn their cost', 'Medium', 'Further exceptional charges; equity raises'],
      ['Energy and raw-material inflation not passed on in time', 'Medium', `Each 1pp of standalone margin ≈ ₹${n0(X.segRev('bfl')[1] / 100)} cr of FY28E EBITDA, ~₹${n1(X.segRev('bfl')[1] / 100 * (1 - X.AS.taxRate[1] / 100) / F.shares)} of EPS`],
      ['Defence-theme de-rating (thematic funds own a large slice)', 'Medium', `At our bear multiple (${MULT.bear}x) on base EPS: ~₹${n0(r10(MULT.bear * epsSep.base))}`],
      ['Export currency and hedge losses (₹457 cr unrealised in OCI at Mar-26)', 'Low-Medium', 'Revenue and margin hit as hedges mature'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn BUY below ~₹${n0(buyBelow)}** and SELL above ~₹${n0(sellAbove)} on today's numbers, or earlier if defence deliveries start on time and overseas losses visibly shrink in H2FY27.`,
      `**This is mostly a valuation call.** The street median target is ₹${n0(medTp)}; our EPS is lower, and our multiple is derived from the stock's own history rather than from the defence theme.`,
      `**Biggest swing factor:** each 1x of P/E is ~₹${n0(epsSep.base)} a share; each 1pp of standalone EBITDA margin is ~₹${n0(X.segRev("bfl")[1] / 100)} cr of FY28E EBITDA, ~₹${n0(X.segRev("bfl")[1] / 100 * (1 - X.AS.taxRate[1] / 100) / F.shares * MULT.base)} a share at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Standalone EBITDA margin, FY26', v: '27.5%', d: 'Q1FY27 26.2% (cost hit)' },
      { k: 'Defence order book, Jun-2026', v: '₹11,196 cr', d: '7x KSSL FY26 revenue' },
      { k: 'Overseas EBITDA margin, FY26', v: '3.8%', d: 'CDP (₹1,595 cr revenue) closing by end-CY27' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(price / epsSep.base)}x`, d: `own median ${n1(adjMed)}x (forward, clean EPS)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Forging', 'Shaping hot metal by pressing or hammering it in dies; gives stronger parts than casting or machining from bar.'],
      ['Standalone / consolidated', 'Standalone = Bharat Forge Ltd alone (Indian forging plants). Consolidated = the group, incl. KSSL, K Drive, JS Autocast and the overseas plants.'],
      ['KSSL', 'Kalyani Strategic Systems Ltd: the wholly owned defence subsidiary.'],
      ['ATAGS', 'Advanced Towed Artillery Gun System: a 155mm howitzer developed in India with DRDO.'],
      ['FOPM', 'Final production approval needed before ATAGS serial deliveries can start.'],
      ['CQB carbine', 'Close-quarter battle carbine: a small arm ordered by the armed forces.'],
      ['CDP', 'CDP Bharat Forge GmbH: the German steel forging subsidiary being wound down by end-CY2027.'],
      ['Class 8', 'The heaviest North American truck class; Bharat Forge\'s largest export end-market.'],
      ['HHP engines', 'High-horsepower engines (500-5,000 hp) for power generation, data-centre back-up, mining and marine.'],
      ['QIP', 'Qualified institutional placement: new shares sold to institutions (₹2,000 cr in Sep-2026).'],
      ['Exceptional items', 'Charges or gains the company reports separately (write-downs, restructuring, labour-code costs).'],
      ['Adjusted EPS', 'EPS before exceptional items; the basis for our multiple history and target.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['P/E, EV/EBITDA', 'Share price ÷ EPS; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['DCF / WACC / Ke', 'Discounted cash flow; weighted cost of capital; cost of equity (the engine discounts at Ke).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY17': '−6%: oil & gas and US truck downturn.',
  'sales@FY19': '+21%: peak of the US truck cycle.',
  'sales@FY20': '−21%: US and Indian truck downturn.',
  'pat@FY20': '−66%: volumes and overseas losses.',
  'sales@FY21': '−21%: Covid.',
  'pat@FY21': 'Loss after a ₹247 cr exceptional charge.',
  'sales@FY22': '+65%: recovery; exports at a record.',
  'pat@FY22': 'Includes a ₹205 cr exceptional gain.',
  'ebitdaMargin@FY23': '13.5%: overseas losses (US aluminium start-up), energy costs in Europe.',
  'pat@FY23': '−51%: overseas losses; KSSL tiny.',
  'sales@FY24': '+21%: defence shell exports (KSSL ₹1,422 cr).',
  'sales@FY25': '−4%: European trucks weak, US destocking began.',
  'pat@FY25': 'After ₹157 cr of exceptional items (e-mobility).',
  'sales@FY26': '+11%: K Drive consolidated from Jul-2025 (₹958 cr); standalone −5%.',
  'eps@FY26': 'Reported ₹22.58; shown pro forma ₹22.10 on the 48.87 cr shares in issue after the Sep-2026 QIP (forecasts use the same count).',
  'otherIncome@FY26': 'Net of ₹154 cr exceptional charges (labour codes, e-mobility, CDP costs).',
  'otherIncome@Q1FY27': `Net of the ₹${n0(-Q1.consolidated.exceptional)} cr exceptional charge (CDP redundancy and consultancy).`,
  'pat@Q1FY27': 'Loss: exceptional charge with no tax shield (tax ₹133 cr on PBT of ₹44 cr).',
  'opm@Q1FY27': 'Energy, input and logistics costs (~160bp at standalone); forex loss of ₹42 cr in expenses.',
  'sales@FY27E': 'GAM: standalone +15%, KSSL +35%, full year of K Drive.',
  'pat@FY27E': `GAM: reported; ₹${n0(adj27 * F.shares)} cr before the Q1 charge.`,
  'pat@FY28E': 'GAM: CDP losses fall away, defence and US margins improve.',
  'sales@FY29E': 'GAM: Europe −26% as CDP exits; standalone +15%.',
};

module.exports = { risks, glossary, statementNotes };
