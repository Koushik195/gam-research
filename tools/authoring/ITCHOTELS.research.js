// ITC Hotels report, part B: cover, story in charts, and the merger of part2-6 (business, history and demerger, industry, tailwind
// test, owned hotels, managed growth, Colombo, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation,
// verdict, glossary, statement notes). Shared inputs in ITCHOTELS.ctx.js / ctx2.js. Forecast and valuation figures are live tokens
// ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./ITCHOTELS.ctx');
const { C, F, V, n0, n1, pc, Q1, FY26, price, mv, hm, HEV, evNow, rating, ST, sectorDrEv, drEv, medAll, impliedHotelMult, impliedWacc, fwdEvChart, shortDate, epsCagrFwd, SEG, YRS, stream, INV } = X;
const P2 = require('./ITCHOTELS.part2'), P3 = require('./ITCHOTELS.part3'), P4 = require('./ITCHOTELS.part4'), P4b = require('./ITCHOTELS.part4b'), P5 = require('./ITCHOTELS.part5'), P6 = require('./ITCHOTELS.part6');
const PF = C.portfolio, ann = fy => X.SA.find(a => a.fy === fy);

const cover = {
  headline: 'Trophy hotels, a pile of cash and Colombo apartments, at a price that already assumes the worst of 2026',
  lead: `ITC Hotels, demerged from ITC in Jan-2025, owns some of India's best city luxury hotels and manages ~8,600 more keys for others: ${PF.jun26.operatingHotels} hotels and ${n0(PF.jun26.operatingKeys)} keys in all, plus ITC Ratnadipa and the Sapphire Residences apartments in Colombo. Q1FY27 revenue rose ${Q1.revenueGrowthPct}% (hotels +${Q1.revenueExReGrowthPct}%) and EBITDA ${Q1.ebitdaGrowthPct}% despite the West Asia shock. The street values it on **EV/EBITDA of the hotels on FY28E (22-25x)** plus cash and the apartments; all twelve standing views are Buy (median target ₹${n0(medAll)}). We are more cautious on growth (FY28E EBITDA ~9% below the two published estimates) but the stock has fallen further than its peers: it trades at ${n1(evNow.hot)}x our FY28E hotel EBITDA against a post-listing median of ${n1(HEV.med)}x, while hotel peers sit ${Math.abs(Math.round(sectorDrEv))}% below theirs. Applying the house rule gives **${hm.base}x Sep-28E hotel EBITDA** and a sum of the parts of **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** The P/E cross-check agrees (₹${n0(mv('pe').value)}); the DCF (₹${n0(mv('dcf').value)}) does not. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'Assets nobody can rebuild', p: `ITC Maurya, ITC Grand Chola, ITC Maratha, ITC Gardenia and their peers earn a RevPAR ${FY26.revparPremiumPct}% above the luxury-upscale market (FY26) and ~35% hotel margins; the restaurants (Bukhara, Dum Pukht, Avartana) make F&B ~39% of hotel revenue.` },
    { h: 'Growth is ordinary, fees are small', p: `Hotels grew 10% in FY26 and in Q1FY27; room rates only +${FY26.arrGrowthPct}% and +${Q1.arrGrowthPct}%. Fees (₹${FY26.streams.fees} cr, +28%) are ~4% of hotel revenue. We model revenue +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}} and EPS growth of ~${Math.round(epsCagrFwd)}% a year (FY26-29E, before one-offs).` },
    { h: 'Rich balance sheet, poor returns', p: `~₹3,175 cr of net cash and ₹${n0(INV)} cr of unsold Colombo apartments (~13% of the market value together), no debt. But ROE is ~7% and pre-tax ROCE ~11%: the moat protects margins, not returns. BAT still holds 6.28% after selling ~9% in Dec-2025.` },
    { h: 'Valuation: the stock de-rated more than the sector', p: `At ₹${n0(price)} the market pays ~${n1(impliedHotelMult)}x Sep-28E hotel EBITDA once cash and the apartments are valued our way; ITC Hotels' trailing multiple is ${Math.abs(Math.round(drEv.ITCHOTELS))}% below its post-listing median vs ${Math.abs(Math.round(sectorDrEv))}% for IHCL, EIH and Lemon Tree. Our ${hm.base}x is still below the street's 22-25x. We would buy below ~₹${n0(X.buyBelow)}.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth (FY25 vs an ~8-month FY24)', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'GREEN' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter without the April shock; watch room rates, the Kumarakom renovation and the Ahmedabad (GHK) integration.',
    'The Oct-Mar peak season: weddings, MICE and inbound travel after the West Asia conflict.',
    'Sapphire Residences handovers and Sri Lankan property taxes; the Sri Lankan rupee.',
    'BAT\'s remaining 6.28%: a further sale would add supply; a clean exit would remove the overhang.',
    'Use of the cash: more acquisitions (management calls itself well placed for value-accretive deals), a higher dividend, or more owned builds.',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Six in ten keys are managed; almost all new keys will be', unit: 'Keys (30-Jun-2026)', x: ['Operating', 'Pipeline'], series: [{ name: 'Owned', values: [5750, Math.max(0, PF.jun26.pipelineKeys - PF.jun26.managedPipelineKeys)], fmt: 'num' }, { name: 'Managed / franchised', values: [PF.jun26.operatingKeys - 5750, PF.jun26.managedPipelineKeys], fmt: 'num' }], labels: 'all', source: 'Q1FY27 deck slides 12, 22-23, 35 (owned "5,700+" shown as ~5,750; pipeline incl. expansions)' },
      { type: 'stacked', title: 'Hotel revenue: rooms and food, fees still small', unit: 'Hotels ex-real estate revenue (₹ crore); FY27E-29E GAM', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'Rooms', values: [ann('FY25').room, ann('FY26').room, ...stream.room.map(Math.round)], fmt: 'num' }, { name: 'Food & beverage', values: [ann('FY25').fnb, ann('FY26').fnb, ...stream.fnb.map(Math.round)], fmt: 'num' }, { name: 'Fees', values: [ann('FY25').fees, ann('FY26').fees, ...stream.fees.map(Math.round)], fmt: 'num' }, { name: 'Others', values: [ann('FY25').others, ann('FY26').others, ...stream.others.map(Math.round)], fmt: 'num' }], minLabel: 300, source: 'Company decks; GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'Apartment sales made a third of FY26 growth', unit: 'Revenue growth FY26 by source (₹ crore)', x: ['Hotels', 'Sapphire Residences'], series: [{ name: 'Added revenue', values: [ann('FY26').hotelRev - ann('FY25').hotelRev, ann('FY26').reRev], fmt: 'num' }], labels: 'all', source: 'AR FY26 note 31; Q4FY26 deck' },
      { type: 'line', title: 'Rate growth is slowing', unit: 'Owned hotels, year on year (%)', x: ['FY26', 'Q1FY27'], series: [{ name: 'Average room rate', values: [FY26.arrGrowthPct, Q1.arrGrowthPct], fmt: 'pct' }, { name: 'RevPAR', values: [FY26.revparGrowthPct, Q1.revparGrowthPct], fmt: 'pct' }], labels: 'all', min: 0, max: 12, source: 'Q4FY26 and Q1FY27 decks' },
    ] },
    { pair: [
      { type: 'hbar', title: 'ITC Hotels fell further than its peers', unit: `Trailing EV/EBITDA on ${X.ASOF_TXT} vs median since Apr-2025 (%)`, x: X.PEER_SYMS.map(X.shortName), series: [{ name: 'Move', values: X.PEER_SYMS.map(s => Math.round(drEv[s] * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'ITC Hotels', source: 'Screener.in; GAM Research' },
      { type: 'hbar', title: 'Returns are low for a moat business', unit: 'FY26 (%)', x: ['ROE (Screener)', 'Pre-tax ROCE (Screener)', 'Cost of equity (GAM)'], series: [{ name: '%', values: [Math.round(X.A.roe[X.b] * 10) / 10, X.A.roce[X.b], V.ke], fmt: 'pct' }], labels: 'all', source: 'Screener.in; GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: `Forward hotel EV/EBITDA: median ${n1(HEV.med)}x since Apr-25, ${n1(evNow.hot)}x now`, unit: 'EV (less net cash and 80% of apartment inventory) ÷ next full-year hotel EBITDA (x)', x: fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: HEV.med, text: `Median: ${n1(HEV.med)}x` }, { v: hm.base, text: `Our target: ${hm.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; AR FY25-26; GAM estimates FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (views standing on 30-Sep-26)', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...ST.map(s => `${s.broker} (${shortDate(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...ST.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes, roundups and aggregators (May-Sep 2026)' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.hotels, P3.fees, P3.colombo, P4.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4b.forecasts, P5.street, P5.valuation, P5.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
