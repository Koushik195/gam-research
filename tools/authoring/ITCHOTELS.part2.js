// ITC Hotels report, part 2: business, history and the demerger, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./ITCHOTELS.ctx');
const { C, D, ROOT, n0, n1, Q1, FY26, SA } = X;
const PF = C.portfolio, IN = D.industry || {};

const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const margin26 = sym => { const t = scr(sym)['profit-loss'], i = t.periods.indexOf('Mar 2026'); return Math.round(t.rows['Operating Profit'][i] / t.rows.Sales[i] * 1000) / 10; };
const IND = ['INDHOTEL', 'ITCHOTELS', 'EIHOTEL', 'CHALET', 'LEMONTREE'];
const marg = s => (s === 'ITCHOTELS' ? 34.4 : margin26(s)); // ITC Hotels on the audited split (Screener's annual row: 35.8%)

const business = {
  id: 'business', nav: 'What ITC Hotels does', kicker: 'The business', title: 'A luxury hotel owner with a growing fee business on the side, and a Colombo apartment project to sell down',
  blocks: [
    { p: `ITC Hotels earns money three ways. **It owns hotels** (~5,700 keys, ~40% of operating keys), mostly large luxury city hotels such as ITC Maurya and ITC Grand Bharat (Delhi), ITC Maratha and ITC Grand Central (Mumbai), ITC Grand Chola (Chennai), ITC Gardenia (Bengaluru), ITC Sonar and Royal Bengal (Kolkata), ITC Kohenur (Hyderabad), ITC Grand Goa and ITC Mughal (Agra), plus ITC Ratnadipa in Colombo. The large ITC hotels are franchised into Marriott's Luxury Collection for global distribution. These hotels make most of the revenue and EBITDA and carry almost all the capital. **It manages hotels for other owners** (~8,600 keys, 60%) under Welcomhotel, Fortune, Storii, Mementos and WelcomHeritage for a fee: ₹${FY26.streams.fees} cr in FY26, ~4% of hotel revenue. **It sells apartments** at Sapphire Residences in Colombo (₹${FY26.reRevenue} cr in FY26). At 30-Jun-2026 it had ${PF.jun26.operatingHotels} operating hotels with ${n0(PF.jun26.operatingKeys)} keys and ${PF.jun26.pipelineHotels} more (${n0(PF.jun26.pipelineKeys)} keys) signed; the goal is 250 hotels and 22,000+ keys by 2031.` },
    { exhibit: { type: 'table', title: 'Portfolio by brand (30-Jun-2026)', head: ['Brand', 'Operating hotels', 'Operating keys', 'Pipeline keys', 'Positioning'], rows: [
      ...PF.brands.map(([br, h, k, ph, pk]) => [br, n0(h), n0(k), n0(pk), { 'ITC Hotels': 'Luxury (large city hotels; Luxury Collection franchise)', Mementos: 'Luxury resorts', 'Epiq Collection': 'Luxury (new brand; Puri first)', Storii: 'Boutique leisure, managed', Welcomhotel: 'Upper upscale, owned and managed', Fortune: 'Midscale, managed (largest by count)', WelcomHeritage: 'Heritage forts and palaces, managed' }[br]]),
      { hl: true, cells: ['**Total**', `**${PF.jun26.operatingHotels}**`, `**${n0(PF.jun26.operatingKeys)}**`, `**${n0(PF.jun26.pipelineKeys)}**`, 'Owned / managed keys 40% / 60%'] },
    ], source: 'Q1FY27 deck slides 22, 40 (pipeline includes expansions at existing hotels)' } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 revenue growth: ITC Hotels in the middle of the pack', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: IND.map(X.shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'ITC Hotels', source: 'Screener.in quarterly results (Chalet\'s Q1FY26 base included residential flat sales)' },
      { type: 'hbar', title: 'FY26 EBITDA margin: luxury owners earn the most', unit: 'EBITDA margin, FY26 (%)', x: IND.map(X.shortName), series: [{ name: 'Margin', values: IND.map(marg), fmt: 'pct' }], labels: 'all', highlight: 'ITC Hotels', source: 'Screener.in (consolidated); ITC Hotels on the audited split' },
    ] },
    { callout: '**Why the mix matters:** the owned hotels are where the value, the capital and the returns problem sit (₹11,658 cr of equity earning ~7%); the managed hotels are where the growth sits (74 of 77 pipeline hotels are managed). The Colombo apartments are a one-off cash release, not a business.' },
  ],
};

const history = {
  id: 'history', nav: 'History & the demerger', kicker: 'History', title: 'Fifty years inside ITC, twenty months as a listed company: the demerger, the BAT sell-down and what it does to the numbers',
  blocks: [
    { p: `ITC ran its hotels as a division for fifty years (the company marked its 50th year in May-2026). In 2023 it decided to demerge them: ITC Hotels Ltd was incorporated on 28-Jul-2023, the demerger took effect on 1-Jan-2025, ITC kept 40% and ITC's shareholders received one ITC Hotels share for every ten ITC shares. The shares listed on 29-Jan-2025. For investors three things follow. **(1) A short history:** only two full years of accounts and ~20 months of prices, so our multiple history starts after listing (valuation chapter). **(2) Restated comparatives:** the FY25 accounts restate the hotels business only from incorporation, so Screener's "FY24" is ~8 months and is not used. **(3) A shifting register:** BAT's Tobacco Manufacturers (India), which received its shares as an ITC shareholder, has been selling (12.21% at Mar-25, 6.28% at Mar-26), and HCL Capital bought 7.08%.` },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: [...C.history.map(h => [h[0], h[1]]), ...(D.stockEvents || []).map(e => [e[0], e[1]])].sort((a, c) => (a[0] < c[0] ? -1 : 1)), source: `${C.historySrc}; ${D.stockEventsSrc || ''}` } },
    { callout: `**Corporate actions and per-share data:** 208.30 cr shares of ₹1 at Mar-2026 (208.12 cr at Mar-2025; the rise is employee options under the special-purpose scheme that replaced ITC options at the demerger). No split, bonus or buy-back. ITC Ltd holds 83.00 cr shares. Screener's consolidated "Net Profit" is before minorities (₹4 cr in FY26); ITCHOTELS.patch.js puts profit on the attributable basis and restores the audited split of costs, other income and finance costs (Screener moves ~₹40-50 cr a year into "interest").` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A fourth year of demand ahead of supply, but growth is slowing and the 2026 travel shock re-priced hotel stocks',
  blocks: [
    { p: `Indian hotels are in their best cycle in twenty years: since Covid, domestic travel, weddings, conferences and corporate demand have grown faster than new rooms, lifting occupancy and room rates. ${IN.icra ? `ICRA (${X.shortDate(IN.icra.published)}) expects FY27 industry revenue growth of ${IN.icra.fy27RevGrowth} (FY26 ~${IN.icra.fy26RevGrowthPct}%), with occupancy of ${IN.icra.fy27OccPct} and an average rate of ${IN.icra.fy27Arr}.` : ''} ${IN.hvs ? `HVS Anarock's July-2026 monitor put the Jun-2026 average rate at ${IN.hvs.jun26Arr} and occupancy at ${IN.hvs.jun26Occ}; branded signings (${n0(IN.hvs.h1cy26SigningsKeys)} keys in H1 CY26) run about four times openings (${n0(IN.hvs.h1cy26OpeningsKeys)}), so supply will pick up from 2027-28.` : ''} The shock of 2026 was the West Asia conflict: air travel disruption, weak foreign arrivals and higher fuel and food costs. ITC Hotels called April 2026 "broad-based demand softness"; May and June recovered.` },
    { pair: [
      { type: 'column', title: 'ITC Hotels\' owned RevPAR growth has slowed to high single digits', unit: 'RevPAR growth, owned hotels, year on year (%)', x: ['FY26', 'Q1FY27'], series: [{ name: 'RevPAR growth', values: [FY26.revparGrowthPct, Q1.revparGrowthPct], fmt: 'pct' }, { name: 'Rate growth', values: [FY26.arrGrowthPct, Q1.arrGrowthPct], fmt: 'pct' }], labels: 'all', source: 'Q4FY26 and Q1FY27 decks' },
      { type: 'hbar', title: 'Hotel stocks de-rated in 2026', unit: `Trailing EV/EBITDA on ${X.ASOF_TXT} vs median since Apr-2025 (%)`, x: X.PEER_SYMS.map(X.shortName), series: [{ name: 'Move', values: X.PEER_SYMS.map(s => Math.round(X.drEv[s] * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'ITC Hotels', source: 'Screener.in; GAM Research' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the hotel upcycle reach ITC Hotels? Yes for rooms and fees, less for rates; the Colombo exposure cuts both ways',
  blocks: [
    { exhibit: { type: 'table', title: 'Industry tailwinds and whether they reach ITC Hotels', head: ['Tailwind', 'Reaches ITC Hotels?', 'Evidence'], wide: [2], rows: [
      ['Demand ahead of supply in big cities', 'Yes', `RevPAR premium of ${FY26.revparPremiumPct}% (FY26) and ${Q1.revparPremiumPct}% (YTD May-26) to the luxury-upscale market; Q1 occupancy +${(Q1.occChangeBps / 100).toFixed(1)} pp`],
      ['Room-rate growth', 'Partly', `Rate +${FY26.arrGrowthPct}% in FY26 and +${Q1.arrGrowthPct}% in Q1FY27, below the industry's ~10%+ (HVS): the luxury base is already high`],
      ['Weddings, MICE and banqueting', 'Yes', `F&B +${Q1.streamGrowthPct.fnb}% in Q1FY27; MICE and weddings were up against a high base`],
      ['Asset-light expansion into tier-2/3 cities', 'Yes, slowly', `Fees +${Q1.streamGrowthPct.fees}% in Q1FY27, but only ~4% of hotel revenue`],
      ['Inbound and international travel', 'Hurt in 2026', 'West Asia conflict; Sri Lanka arrivals softened in Q1FY27 and the Sri Lankan rupee fell (Colombo is the largest single project)'],
    ], source: 'Company decks; CoStar via the company; HVS Anarock; GAM Research' } },
    { callout: '**Verdict:** the cycle reaches ITC Hotels through occupancy, F&B and fees, but its luxury rate growth is already slower than the market\'s and its earnings growth (~10-12% a year in our forecast) is ordinary. The stock is a quality-at-a-price story, not a growth story.' },
  ],
};

module.exports = { business, history, industry, tailwind };
