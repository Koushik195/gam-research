// Solar Industries report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./SOLARINDS.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, A, n0, n1, price, H21, rating, buyBelow, sellAbove, b, A26, epsCagrFwd, defExports, omValue, peMult, epsSep28 } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: own the business on a pullback, not at ${Math.round(price / F.eps[1])}x FY28E earnings`,
  blocks: [
    { callout: `**What you are buying:** India's lowest-cost explosives maker with ~26% of the market, a fast-growing international business, and the most integrated private defence-energetics platform in India, with a ~₹18,000 cr defence order book, a ${n1(A.roe[b])}% ROE and a founder-owner who has executed well for 30 years.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS, for ~${Math.round(epsCagrFwd)}% EPS growth a year, with FY27 revenue lifted by input-price pass-through (18-20 points of explosives growth, per management). The price assumes defence (mostly exports we cannot see in detail) keeps compounding long after the current order book is delivered, and it ignores the debt and lower-margin earnings Omnia will bring. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low-Medium', 'Share price; it traded at ₹18,480 on 16-Sep-2026'],
      ['Large new defence orders (Pinaka Mk2/guided, Bhargavastra, 155 mm exports) that lift the order book above ~₹25,000 cr', 'Medium', 'Order announcements; defence book in quarterly fact sheets'],
      ['Working capital releases as promised, turning FY27 free cash flow positive', 'Medium', 'Inventory and receivable days at H1FY27'],
      ['Omnia closes with synergies visible (AN supply, initiating systems into BME)', 'Medium', 'Omnia margins after completion; funding cost'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Defence export orders slow or are delayed (licences, customer budgets, conflicts ending)', 'Medium', `~₹${n0(Math.round(defExports / 100) * 100)} cr of FY26 revenue is, we infer, defence exports; a pause would cut growth sharply`],
      ['Trial or qualification delays for Bhargavastra, 155 mm and Pinaka variants', 'Medium', 'FY28-29 defence growth below our 25-31%'],
      ['Ammonium nitrate falls and takes realisations with it, or spikes and squeezes margins', 'Medium', 'FY23-24 showed revenue swings of +75% and −12%'],
      ['Omnia: integration, agriculture cycle, South African and multi-country risk, ~₹11,000 cr of debt', 'Medium', 'EPS dilution in FY28 if synergies lag; lower multiple for a less defence-heavy group'],
      ['De-rating of defence stocks from today\'s above-median multiples', 'Medium', `At the bear multiple (${V.blend.methods[0].multiple.bear}x) on our base EPS the stock would be worth ~₹${n0(Math.round(V.blend.methods[0].multiple.bear * epsSep28 / 10) * 10)}`],
      ['Safety incident at an explosives or ammunition plant', 'Low', 'Shutdowns, penalties, reputational damage'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and are sellers above ~₹${n0(sellAbove)} on today's numbers, or sooner if new defence orders lift FY29 visibility (each ₹1,000 cr of extra FY29 defence revenue adds ~₹${n0(Math.round(1000 * 0.3 * 0.735 / F.shares / 2 * peMult / 10) * 10)} to our target at a 30% margin).`,
      `**Biggest swing factor:** the multiple. Each 5x on Sep-28E EPS is ~₹${n0(Math.round(5 * epsSep28 / 10) * 10)} a share; the gap between our ${peMult}x and the street's ~60x is worth ~₹${n0(Math.round((60 - peMult) * epsSep28 / 10) * 10)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Defence revenue, FY26', v: `₹${n0(A26.defence)} cr`, d: '+94%; ₹4,500 cr guided for FY27' },
      { k: 'Revenue billed outside India, FY26', v: `${Math.round(A26.geoOutside / (A26.geoIndia + A26.geoOutside) * 100)}%`, d: 'most defence growth is exports' },
      { k: 'Cash from operations ÷ profit, FY26', v: `${Math.round(A.cfoToPat[b])}%`, d: 'inventory build' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `median since 2021: ${n1(H21.med)}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Bulk / packaged explosives', 'Bulk: emulsion or ANFO explosives mixed and pumped into blast holes at the mine. Packaged: explosives in cartridges, sold through dealers.'],
      ['Initiating systems', 'Detonators, cords and boosters that set off the main charge; electronic detonators fire on a programmed delay. Electric (non-electronic) detonators were banned in India from Jul-2025.'],
      ['Ammonium nitrate (AN)', 'The main raw material for commercial explosives; its price follows gas and fertiliser markets.'],
      ['Overburden removal', 'Rock and soil removed to reach coal in open-cast mines; it drives explosives demand more than coal output does.'],
      ['CIL / SCCL', 'Coal India Ltd and Singareni Collieries, the state-owned coal miners; they buy explosives by tender.'],
      ['PESO', 'Petroleum and Explosives Safety Organisation, India\'s licensing regulator for explosives.'],
      ['HMX, RDX, TNT', 'Military high explosives used in warheads, shells and missiles; Solar makes all three.'],
      ['Pinaka', 'India\'s multi-barrel rocket launcher system; Solar makes the rockets (with state-owned Munitions India).'],
      ['Loitering munition (Nagastra)', 'A drone that circles a target area and then dives onto a target. Counter-drone (Bhargavastra): a system that shoots down drones.'],
      ['Order book', 'Value of signed orders not yet delivered and billed.'],
      ['Powder factor', 'Explosive used per unit of rock broken; some contracts adjust the price for the blast output achieved, settled after the sale.'],
      ['Hyperinflation accounting', 'Rules for subsidiaries in very high-inflation countries (here Turkey): results are restated, creating a loss on monetary assets.'],
      ['Minority (non-controlling) interest', 'The part of subsidiaries\' profit that belongs to outside shareholders; EPS excludes it.'],
      ['Omnia / BME', 'South African mining, agriculture and chemicals group Solar agreed to buy in Sep-2026; BME is its mining-explosives brand.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['DCF', 'Discounted cash flow valuation: future free cash flows discounted at the cost of capital (here 12.5%).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY22': '+57%: domestic tonnes +22% and realisations +45% as ammonium nitrate rose; exports & overseas +37%.',
  'sales@FY23': '+75%: domestic realisation +39% (AN spike after the Russia-Ukraine war); exports & overseas +95%.',
  'sales@FY24': '−12%: AN prices fell; domestic realisation −32% despite +20% volume.',
  'ebitdaMargin@FY24': '+510bp: cheaper inputs and a higher defence share (9% of sales).',
  'pat@FY24': '+8%: lower revenue, higher margin.',
  'sales@FY25': '+24%: defence +162% (Pinaka, exports); international +18%; domestic +6%.',
  'ebitdaMargin@FY25': '+250bp: defence 18% of sales from 9%.',
  'pat@FY25': '+47%: margin expansion and defence growth.',
  'sales@FY26': '+30%: defence +94%, international +32%, domestic +3% (weak coal overburden removal).',
  'pat@FY26': '+35%; minority share of profit fell to 3.4% from 6.1%.',
  'cfo@FY26': '₹621 cr, 36% of profit: inventory and receivables rose ~₹1,300 cr (deliberate stock-building for geopolitical risk).',
  'capex@FY26': '₹1,739 cr on Screener (company: ₹1,556 cr) for defence and explosives capacity.',
  'otherIncome@FY26': 'Net of a ₹94.5 cr hyperinflation loss on the Turkish subsidiary (₹128 cr reported other income).',
  'sales@Q2FY26': '+21%: domestic +2% in a heavy monsoon (CIL −8%), international +21%, defence +57%.',
  'sales@Q4FY26': '+41%: defence ₹1,008 cr (+134%) crossed ₹1,000 cr in a quarter for the first time.',
  'sales@Q1FY27': '+70%: defence +123%, international +65%, domestic +52% (includes AN price pass-through).',
  'opm@Q1FY27': '~28%: operating leverage on employee and other costs.',
  'sales@FY27E': 'GAM: management target ₹14,000 cr; defence ₹4,500 cr; explosives +30% incl. 18-20% price.',
  'ebitdaMargin@FY27E': 'GAM: near FY26; defence mix offsets AN price pass-through.',
  'sales@FY28E': 'GAM: +20%, in line with management\'s pre-Omnia +17-20%; Omnia excluded.',
  'capex@FY27E': 'GAM: management guidance ₹2,050 cr.',
};

module.exports = { risks, glossary, statementNotes };
