// Godrej Industries report, part B-3: industry, tailwind test, chemicals, Godrej Capital.
const X = require('./GODREJIND.ctx');
const { C, D, F, SA, SQ, QL, A26, A25, n0, n1, PEERS, peerHist, galaxyDerate, yi, chemSep28, pGc, gcBook, ps, HFC_PEERS } = X;
const G = C.godrejCapital;
const roe26 = G.patFy26 / ((G.netWorthMar25 + G.netWorthMar26) / 2) * 100;
const ch = F.seg.chem;

const industry = {
  id: 'industry', nav: 'Oleochemicals industry', kicker: 'Industry', title: 'Oleochemicals: a spread business on imported palm oil',
  blocks: [
    { p: D.industry.oleo },
    { p: 'For an Indian producer like GIL three things set profits: (1) the **spread** between product prices and palm, palm-kernel and rapeseed oil (GIL standalone spent ₹3,219 cr on materials against ₹4,105 cr of product sales in FY26, 78%; most feedstock is imported), (2) **capacity use** at its two large plants (Valia, Ambernath), and (3) **mix**: commodity fatty acids and alcohols earn thin, volatile margins; surfactants for multinational soap and detergent makers are steadier; specialty esters, food additives and biosurfactants earn more but are still small.' },
    { exhibit: { type: 'table', title: 'Who GIL competes with', head: ['Company', 'Listed?', 'What it makes', 'Size / profitability (latest)'], wide: [2, 3], rows: [
      ['**GIL Chemicals**', 'Inside GIL', 'Fatty acids, fatty alcohols, glycerine, surfactants, specialty', `FY26 revenue ₹${n0(A26.chemRev)} cr, EBITDA margin 8.7%`],
      ['VVF', 'No', 'Fatty acids, fatty alcohols, glycerine, contract personal care', 'Not public; the other large Indian maker'],
      ['Galaxy Surfactants', 'Yes', 'Surfactants and specialty care ingredients (a customer and competitor)', `FY26 revenue ₹${n0(PEERS.GALAXYSURF.revenue)} cr, EBITDA margin ${PEERS.GALAXYSURF.ebitdaMargin}%`],
      ['Fine Organic', 'Yes', 'Oleochemical-based additives for plastics, food, cosmetics', `FY26 revenue ₹${n0(PEERS.FINEORG.revenue)} cr, EBITDA margin ${PEERS.FINEORG.ebitdaMargin}%`],
      ['Wilmar, KLK (KLK OLEO), IOI, Musim Mas, Emery, Ecogreen', 'Mostly inside plantation or trading groups', 'Fatty acids, alcohols, glycerine at global scale, next to the plantations', 'KLK\'s manufacturing (mostly oleochemicals): pre-tax loss RM173.6 mn in FY2025, RM42.4 mn loss in Jan-Mar 2026'],
    ], source: 'Screener.in (FY26, at 30-Sep-2026), GIL AR FY26, The Borneo Post (29-Aug-2025), The Star (18-May-2026)' } },
    { callout: '**So what:** there is no listed Indian pure-play to benchmark against, the global leaders are integrated into plantations, and the biggest one we can see (KLK) barely made money in oleochemicals in 2025-26. GIL\'s own margins (8-17% PBIT over FY20-26) show it is a price-taker. We value it like a commodity chemical business with a specialty option, not like a specialty chemical company.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach GIL?', title: 'Tailwind test: the group grows fast; GIL\'s shareholders see it only through the share prices',
  blocks: [
    { exhibit: { type: 'table', title: 'The tailwinds and whether they reach GIL\'s shareholders', head: ['Tailwind', 'Evidence', 'Reaches GIL?'], wide: [1, 2], rows: [
      ['Indian housing upcycle', 'GPL bookings ₹34,171 cr in FY26 (+16%, 41% three-year CAGR); ₹8,651 cr in Q1FY27 (+22%)', 'Yes, through GPL\'s share price; no dividend reaches GIL (GPL pays none)'],
      ['Credit growth in housing and MSME loans', 'Godrej Capital AUM ₹27,867 cr at Mar-26 (+65%)', 'Partly: value grows, but GIL funds it with borrowed money and ROE is ~6%'],
      ['Consumer staples recovery', 'GCPL Q1FY27 sales +19%, volume +9%', 'Yes: GCPL dividends are GIL\'s main cash income (₹624 cr of dividends in FY26)'],
      ['Renewable surfactants / "green chemistry"', 'GIL specialty volumes +37% in FY26; biosurfactant launch due in Q2FY27', 'Small so far: specialty is ~11% of chemicals revenue'],
      ['Palm oil prices', 'Revenue +22% in FY26 and +31% in Q1FY27, partly price', 'No: higher feedstock prices lift revenue, not margins (FY26 margin fell to 8.7%)'],
    ], source: 'GIL decks, AR FY26, GAM Research' } },
    { callout: '**Verdict:** the strong tailwinds (housing, credit, staples) reach GIL only as market value of stakes it does not control the price of, and the market applies a discount to that. The tailwind that reaches GIL\'s own P&L (chemicals) is the weakest.' },
  ],
};

const chemicals = {
  id: 'chemicals', nav: 'Chemicals', kicker: 'Segment', title: 'Chemicals: more volume, not more profit',
  blocks: [
    { p: `Chemicals revenue went from ₹${n0(SA[1].chemRev)} cr (FY21) to ₹${n0(A26.chemRev)} cr (FY26), but segment PBIT went from ₹${n0(SA[1].chemPbit)} cr to ₹${n0(A26.chemPbit)} cr with a spike to ₹697 cr in FY23 and a collapse to ₹254 cr in FY24 in between. The PBIT margin has ranged from 7% to 17%. FY26 was a volume year (+9.4%) with poor margins: lower volumes of higher-margin fractionated fatty acids, costlier feedstock, US tariffs and more competition (AR FY26). Q1FY27 turned the other way: PBIT ₹159 cr on revenue ₹1,161 cr (13.7%), the best quarter since FY23.` },
    { pair: [
      { type: 'line', title: 'Chemicals PBIT margin: 7-17%, no trend', unit: 'Segment PBIT ÷ revenue (%)', x: SA.map(a => a.fy), series: [{ name: 'PBIT margin', values: SA.map(a => Math.round(a.chemPbit / a.chemRev * 1000) / 10), fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'GIL decks; AR FY26' },
      { type: 'column', title: 'Our forecast: revenue +15% / +10% / +10%', unit: '₹ crore', x: ['FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Revenue', values: [A25.chemRev, A26.chemRev, ...ch.revenue.map(Math.round)], fmt: 'num' }, { name: 'EBITDA', values: [A25.chemEbitda, A26.chemEbitda, ...ch.adjEbitda.map(Math.round)], fmt: 'num' }], labels: 'none', source: 'AR FY26; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'Chemicals by quarter (₹ crore)', head: ['', ...QL], rows: [
      ['Revenue', ...SQ.map(q => n0(q.chemRev))], ['PBIT', ...SQ.map(q => n0(q.chemPbit))], ['PBIT margin', ...SQ.map(q => q.chemPbitMargin + '%')],
    ], source: 'GIL quarterly decks' } },
    { p: `**What we assume.** EBITDA margin 11.5% in FY27E and FY28E and 12% in FY29E (FY25 12.2%, FY26 8.7%), so Sep-28E EBITDA is ₹${n0(chemSep28)} cr, against ₹${n0(A26.chemEbitda)} cr in FY26. That needs the Q1FY27 recovery to mostly hold, plus growth from the Kundaim expansion (+30% capacity), the Valia specialty plant and the food-additives business bought in April 2025. Segment capital employed was ~₹1,755 cr at Mar-26 (assets ₹2,745 cr less liabilities ₹991 cr), so FY26 PBIT earned ~17% pre-tax: decent in a weak year; in FY24 the same business earned PBIT of only ₹254 cr.` },
    { callout: '**Listing option.** Management named chemicals as one of two "front-runners" for a separate listing within five years (PTI, 22-Apr-2026). A listing would put a market price on it; it would not change the economics. We give it no premium.' },
  ],
};

const capital = {
  id: 'gcapital', nav: 'Godrej Capital', kicker: 'Segment', title: 'Godrej Capital: fast growth, thin returns, and GIL pays for it',
  blocks: [
    { p: `Godrej Capital lends to home buyers (Godrej Housing Finance) and to small businesses and individuals against property and other loans (Godrej Finance). AUM reached ₹${n0(G.aumMar26)} cr at March 2026 (+${G.aumGrowthFy26}%), total income ₹${n0(G.totalIncomeFy26)} cr (FY25 ₹${n0(G.totalIncomeFy25)} cr) and profit ₹${n0(G.patFy26)} cr (FY25 ₹${n0(G.patFy25)} cr). Net worth was ₹${n0(G.netWorthMar26)} cr, so ROE was only ~${n1(roe26)}%: the business is still building scale and its cost of funds is above that of bank-backed lenders.` },
    { exhibit: { type: 'table', title: 'Godrej Capital in numbers', head: ['', 'FY25', 'FY26', 'Note'], wide: [3], rows: [
      ['AUM (₹ cr)', '~16,900', n0(G.aumMar26), '+65% in FY26 (AR FY26); FY25 back-calculated'],
      ['Total income (₹ cr)', n0(G.totalIncomeFy25), n0(G.totalIncomeFy26), '+53%'],
      ['Profit after tax (₹ cr)', n1(G.patFy25), n1(G.patFy26), '+52%'],
      ['Net worth (₹ cr)', n0(G.netWorthMar25), n0(G.netWorthMar26), 'Includes equity infused by GIL'],
      ['ROE', '~4.5% (on year-end book)', `~${n1(roe26)}%`, 'vs 12-20% for listed affordable-housing lenders'],
      ['GIL\'s investment at cost (₹ cr)', '3,169', '3,913', '₹4,283 cr at Jun-26'],
    ], source: 'GIL AR FY26 (note 41, board report), GIL decks' } },
    { p: `**Value.** We value GIL's share of book (~₹${n0(gcBook)} cr: 91.11% of Mar-26 net worth plus the ₹370 cr put in during Q1FY27) at **2.0x**, or ₹${n0(pGc.value)} cr (₹${n0(ps(pGc.value))} a GIL share). Listed affordable-housing lenders traded at ${HFC_PEERS.map(s => `${({ AADHARHFC: 'Aadhar Housing', HOMEFIRST: 'Home First', APTUS: 'Aptus', BAJAJHFL: 'Bajaj Housing' })[s]} ${peerHist[s].pbNow}x`).join(', ')} book on 30-Sep-2026 with FY26 ROEs of ${HFC_PEERS.map(s => PEERS[s].roe + '%').join(', ')}. Godrej Capital earns half their ROE but grows much faster. GIL's own FY26 rights subscriptions were priced at about 1.8x Mar-26 book (a parent subscribing to its own subsidiary, not a market test). Bull 3.0x, bear 1.0x.` },
    { callout: `**The catch for GIL's shareholders.** Management says the group has put ₹5,000 cr into Godrej Capital and will put ₹5,000-7,000 cr more into its unlisted businesses over five years, with a listing once AUM reaches ₹1 lakh crore (PTI, 22-Apr-2026). If GIL funds that with debt, every rupee is value-neutral at 1x book and only creates value if Godrej Capital is worth more than book, while the holding company's interest bill keeps rising. An outside equity raise at a high valuation would be the single biggest positive catalyst for this stock; none had been announced by 30-Sep-2026.` },
  ],
};

module.exports = { industry, tailwind, chemicals, gcapital: capital };
