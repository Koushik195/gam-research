// UPL report, part B (1 of 4): cover, story in charts, business, history, industry, tailwind test.
// Parts 2-4 (UPL.part2.js, part3.js, part4.js) hold the platform, moat, quality, ownership, governance,
// forecast, street, valuation, verdict and glossary chapters. Figures come from research/*.json and the
// built model; forecast and valuation figures are live tokens ({{...}}) that follow assumptions.json.
const X = require('./UPL.common');
const { C, D, SG, F, V, n0, n1, pc, SA, SQ, QL, A25, A26, Q1, price, mv, epsSep28, PLAT, fwdPe, fwdMed, fwdMedAll, deRated, coEbitda, SRC } = X;
const P2 = require('./UPL.part2'), P3 = require('./UPL.part3'), P4 = require('./UPL.part4');
const rating = 'HOLD';
const sotpV = mv('sotp').value, dcfV = mv('dcf').value, disc = Math.round((1 - price / sotpV) * 100);
const tpB = D.street.brokers.filter(b => /Aug-26/.test(b[3]) && b[2]);

const cover = {
  headline: 'A big, recovering agrochemical group with a thin slice of profit for its shareholders: HOLD',
  lead: `UPL is one of the world's largest makers of off-patent crop-protection products, with a fast-growing seeds business (Advanta) and its own chemical plants (SUPERFORM). EBITDA has grown for seven quarters and rose 18% in FY26 to ₹9,588 cr (company basis). But depreciation, interest, exchange losses, tax and UPL's private-equity partners, who own 9-22% of three of the four platforms, take most of it: profit for UPL shareholders was ₹1,922 cr in FY26 and ₹10 cr in Q1FY27. We value UPL as most of the street does, on **P/E: 12x Sep-28E EPS of ₹${n1(epsSep28)}**, which gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with HOLD.** Our EPS is ~15-25% below the street's because we keep finance costs, exchange losses and a rising minority share in the numbers. The platforms are worth far more on paper (sum of the parts ₹${n0(sotpV)}, DCF ₹${n0(dcfV)}), but that value only reaches UPL shareholders if the reorganisation and the Advanta IPO close the holding-company discount. Bull case {{scen.bull.tp|inr}}; bear case {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The recovery is real, but it is EBITDA, not yet earnings', p: `Revenue +11% and company EBITDA +18% in FY26; Q1FY27 revenue +10% and EBITDA +15%. Yet Q1 volumes fell 3% and currency added 10%: growth is helped by a weaker rupee. FY27 guidance is revenue +7-11% and EBITDA +10-14%. Statutory profit for shareholders is still half of FY22-23.` },
    { h: 'Too many claims on each rupee of EBITDA', p: `In FY26 depreciation and amortisation (₹3,244 cr) and finance costs (₹3,401 cr) took 73% of statutory EBITDA. Minority partners took ₹298 cr, and their share rises as Advanta (21.8% outside owners, ~29.6% after UPL sells 7.8% in the IPO) grows fastest. Receivables of ₹10,231 cr were sold to banks at March 2026, which flatters reported net debt.` },
    { h: 'Reorganisation: value discovery, or a holding-company discount?', p: 'From Feb-2026 UPL is merging UPL SAS and UPL Corp into a listed "UPL Global" and floating Advanta. Each platform gets its own market price, and private-equity partners get an exit. But UPL Ltd becomes a parent of listed subsidiaries, which Indian markets usually value at a discount; and UPL Global\'s CEO-designate and the group COO left in August.' },
    { h: `Valuation: cheap against the parts, fair on earnings`, p: `At ₹${n0(price)} the stock trades at ~${n1(price / F.eps[1])}x FY28E EPS and ~${disc}% below our sum of the parts. Brokers use 12-16x P/E; our 12x is the stock's forward P/E median since 2021 excluding trough years (${n1(fwdMed)}x) less the ~25% de-rating of Indian crop-protection stocks (${n1(deRated)}x, rounded). On that basis the upside is small.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin (statutory)', 'ebitdaMargin', 'pct'], ['Net profit after minorities (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg'], ['ROE', 'roe', 'pct']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Balance sheet', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): Latin American volumes, working capital and whether FY27 guidance holds.',
    'Advanta IPO: SEBI approved it on 3-Jun-2026 (pure offer for sale; UPL sells 7.8%). Size and price not yet set.',
    'Reorganisation: public-shareholder vote and NCLT approval; UPL guided ~12-15 months from Feb-2026 to the listing of UPL Global.',
    '$500 mn loan due Dec-2026 (repay or refinance); medium-term net debt/EBITDA target below 1.5x.',
    'A new head for global crop protection after Mike Frank\'s exit (Jai Shroff leads it directly for now).',
  ],
};

// ---------------------------------------------------------------- Story in charts
const fy26Bridge = [['EBITDA (company)', 9588], ['FX on trade + associates', -510], ['Depreciation & amortisation', -3244], ['Net finance costs', -2677], ['Tax', -937], ['Minority partners', -298], ['Profit for UPL shareholders', 1922]];
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'UPL Corp earns ~63% of platform EBITDA; Advanta grows fastest', unit: 'Platform EBITDA, company basis (₹ crore)', x: PLAT.map(p => p[1]), series: [{ name: 'FY25', values: PLAT.map(([k]) => A25[k + 'Ebitda']), fmt: 'num' }, { name: 'FY26', values: PLAT.map(([k]) => A26[k + 'Ebitda']), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'hbar', title: 'FY26: ₹9,588 cr of EBITDA became ₹1,922 cr of profit for shareholders', unit: '₹ crore', x: fy26Bridge.map(b => b[0]), series: [{ name: '₹ cr', values: fy26Bridge.map(b => b[1]), fmt: 'num' }], labels: 'all', highlight: 'Profit for UPL shareholders', source: 'UPL FY26 presentation and annual report; GAM grouping' },
    ] },
    { pair: [
      { type: 'column', title: 'Seven quarters of EBITDA growth, but a very seasonal year', unit: 'Company EBITDA by quarter (₹ crore)', x: QL, series: [{ name: 'EBITDA', values: SQ.map(q => q.companyEbitda), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Profit for shareholders: Q4 carries the year', unit: 'PATMI by quarter (₹ crore)', x: QL, series: [{ name: 'PATMI', values: SQ.map(q => q.patmi), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'column', title: 'Net debt swings ₹8,000 cr within the year', unit: 'Net debt, company basis (₹ crore)', x: SQ.filter(q => q.netDebt).map(q => q.q), series: [{ name: 'Net debt', values: SQ.filter(q => q.netDebt).map(q => q.netDebt), fmt: 'num' }], labels: 'all', source: 'UPL presentations' },
      { type: 'column', title: 'Platform margins: Advanta 25%, UPL Corp 16%, SUPERFORM 12%', unit: 'EBITDA margin, company basis (%)', x: PLAT.map(p => p[1]), series: ['FY25', 'FY26'].map(y => ({ name: y, values: PLAT.map(([k]) => { const a = SA.find(r => r.fy === y); return Math.round(a[k + 'Ebitda'] / a[k + 'Rev'] * 1000) / 10; }), fmt: 'pct' })), labels: 'all', source: SRC },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ~13x today vs a ${n1(fwdMed)}x median outside trough years`, unit: 'Price ÷ next full-year EPS (x)', x: fwdPe.map(x => x[0]), series: [{ name: 'Forward P/E', values: fwdPe.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: Math.round(fwdMed), text: `Median excl. trough years: ${n1(fwdMed)}x (all dates ${n1(fwdMedAll)}x)` }, { v: 12, text: 'Our target: 12x', color: '#cf8f1f' }], source: 'Screener.in prices; reported EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs post-Q1 broker targets', unit: `₹ per share; CMP ₹${n0(price)}`, x: [...tpB.map(b => b[0]), 'GAM (base)'], series: [{ name: 'Target', values: [...tpB.map(b => b[2]), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'Broker notes and press reports (Aug-2026), GAM Research' },
    ] },
  ],
};

// ---------------------------------------------------------------- Business
const geo = C.fy26.regions, geoRows = [['Latin America', geo.latam], ['Rest of world', geo.row], ['Europe', geo.europe], ['North America', geo.nam], ['India', geo.india]];
const business = {
  id: 'business', nav: 'What UPL does', kicker: 'The business', title: 'Four platforms: global generics, Indian brands, seeds and a chemical factory',
  blocks: [
    { p: 'UPL sells crop-protection products (herbicides, fungicides, insecticides and biological "natural plant protection") in more than 140 countries, mostly off-patent molecules sold under its own brands. It ranks #5 in global agrochemicals and #10 in seeds by its own count. Since 2022 it has run the business as four "platforms", three of which have private-equity partners. Latin America (mainly Brazil) is the biggest market; India is only 12% of revenue.' },
    { exhibit: { type: 'table', title: 'The four platforms in FY26 (company basis, before group eliminations)', head: ['Platform', 'What it does', 'Revenue (₹ cr)', 'EBITDA (₹ cr)', 'Margin', 'UPL stake', 'Outside owners'], wide: [1, 6], rows: [
      ...C.platforms.map(p => [`**${p.name.replace(/ \(.*\)/, '')}**`, p.what, n0(p.fy26Rev), n0(p.fy26Ebitda), n1(p.fy26Ebitda / p.fy26Rev * 100) + '%', p.uplStake + '%', p.minority]),
      ['Eliminations & group', 'Mainly SUPERFORM\'s active ingredients sold to UPL Corp and UPL SAS', n0(A26.elimRev), '+49', '', '', ''],
      { hl: true, cells: ['**UPL Ltd (consolidated)**', '', '**51,839**', '**9,588**', '**18.5%**', '', ''] },
    ], source: 'UPL FY26 presentation (11-May-2026), reorganisation presentation (20-Feb-2026), FY26 annual report; KKR/Alpha Wave split in Advanta derived by GAM' } },
    { pair: [
      { type: 'hbar', title: 'Latin America is 37% of revenue; India 12%', unit: 'FY26 revenue by region (₹ crore)', x: geoRows.map(g => g[0]), series: [{ name: 'Revenue', values: geoRows.map(g => g[1]), fmt: 'num' }], labels: 'all', highlight: 'India', source: 'UPL FY26 presentation' },
      { type: 'column', title: 'Statutory segments: crop protection is 81% of revenue', unit: 'FY26 segment revenue (₹ crore)', x: ['Crop protection', 'Seeds & post-harvest', 'Non-agro (specialty)'], series: [{ name: 'Revenue', values: [A26.cpRev, A26.seedsRev, A26.nonAgroRev], fmt: 'num' }, { name: 'Segment result', values: [A26.cpResult, A26.seedsResult, A26.nonAgroResult], fmt: 'num' }], labels: 'all', source: 'UPL FY26 annual report, note 47 (Ind AS 108)' },
    ] },
    { callout: '**Why we model platforms, not the statutory segments:** the audited segments lump UPL Corp, UPL SAS and SUPERFORM\'s captive active ingredients into "crop protection" and show only external specialty-chemical sales as "non-agro". UPL\'s quarterly presentations give revenue, contribution and EBITDA for each platform, which is also how the businesses will be listed and how investors value them. We add a negative "eliminations" line and an "unallocated" line so the platforms reconcile to the statutory accounts.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From an Indian phosphorus maker to a leveraged global group, now splitting into platforms',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.date, h.event, h.impact]), source: C.historySrc } },
    { callout: '**Corporate actions since FY20:** ₹3,027 cr of share proceeds in FY20 (cash-flow statement), a ₹3,378 cr rights issue in Nov-2024 at ₹360 (share count +12.5% to 84.4 cr, fully paid by Aug-2025), stakes sold in three platforms to private equity (2022-24), redemption of the $400 mn perpetual bond (May-2025), the Advanta IPO filing (Jan-2026) and the reorganisation scheme (Feb-2026). Dividends were cut from ₹10 a share (FY21-23) to ₹1 (FY24) and ₹6 (FY25-26).' },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, business, history, ...P2.sectionsA(), p.financials, p.capital, ...P3.sectionsA(), p.balance, P3.ownership(p.ownershipBase), ...P3.sectionsB(), ...P4.sections(), p.statements, P4.glossary],
  statementNotes: P4.statementNotes,
};
