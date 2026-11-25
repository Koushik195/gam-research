// Urban Company report, part 2: history & corporate actions, industry & competition, tailwind test.
const C = require('./URBANCO.ctx');
const { n0, A25, A26, q1, D, SA } = C;
const IV = D.industryView;

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Eleven years to build trust in the home; a profitable core by FY26',
  blocks: [
    { p: 'Urban Company was set up in 2014 as UrbanClap, a marketplace that connected customers with local service providers. It found that listing providers was not enough: customers wanted a guaranteed standard. So it moved to a "full-stack" model in which it trains, equips, prices and rates its partners and stands behind the job. That model took a decade and ~₹1,400 cr of venture money in FY22 alone to scale, but by FY24 the India business was close to breakeven. Three recent events shape today\'s numbers: the 2025 launch of InstaHelp (a costly new category), the Sep-2025 IPO, and the Mar-2026 end of the pre-IPO lock-in.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: D.historyRows, source: D.historySource } },
    { pair: [
      { type: 'column', title: 'Group NTV: +31% in FY26', unit: 'Net transaction value (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'NTV', values: SA.map(a => a.ntv), fmt: 'num' }], labels: 'all', source: 'Q4FY26 shareholders\' letter' },
      { type: 'column', title: 'India services margin: from a loss to 4.1% of NTV in two years', unit: 'India services adjusted EBITDA, % of NTV', x: SA.map(a => a.fy), series: [{ name: 'Margin', values: SA.map(a => Math.round(a.icsAe / a.icsNtv * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q4FY26 shareholders\' letter' },
    ] },
    { h: 'Capital raised and what it cost shareholders' },
    { exhibit: { type: 'table', title: 'Corporate actions', head: ['Action', 'Date', 'Amount (₹ cr)', 'Effect on shareholders'], wide: [3], rows: [
      ['Venture rounds (Accel, Elevation, Bessemer, Tiger, VY Capital, Prosus, Steadview and others)', 'FY15-FY25', 'n.d.', 'Funded the losses to FY24; these funds still held ~40% at Mar-2026.'],
      ['Pre-IPO secondary sales (founders and early investors)', 'Sep-2024 to Mar-2025', '~1,400', 'Founders sold ~₹780 cr; Bessemer, Accel and Tiger ~₹615 cr (Entrackr). No cash to the company.'],
      ['KSA moved into a 50:50 JV with SMASCO', 'Jan-2025', '–', 'Deconsolidated: Saudi NTV and revenue leave the group; its loss shows as a share of JV loss.'],
      ['IPO at ₹103', '10-12 Sep 2025; listed 17-Sep-2025', '1,900 (472 fresh, 1,428 OFS)', '~4.6 cr new shares (~3% dilution); ₹469 cr net to the company; subscribed 104x.'],
      ['ESOP trust and options', 'Mar-2026', '–', '8.0 cr treasury shares held by the trust; 10.0 cr options outstanding at ₹1. We value on 156.2 cr diluted shares.'],
      ['Dividends / buybacks', 'Never', '–', 'All cash retained.'],
    ], source: 'FY26 annual report, IPO coverage (Inc42, Entrackr), Q4FY26 letter' } },
    { callout: `**What this means:** the venture-funded years are mostly over for the core, which now funds itself; the IPO added only ₹469 cr. The cash pile (₹${n0(q1.cash)} cr) is what pays for InstaHelp. The bigger cost to shareholders today is supply: the six-month lock-in ended on 17-Mar-2026, freeing ~66% of the shares, and venture funds have been sellers since.` },
  ],
};

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry & competition', kicker: 'Industry', title: 'A huge market that is still 99% offline; the only online rivals of size are in house help',
  blocks: [
    { p: IV.market },
    { p: IV.competition },
    { exhibit: { type: 'table', title: 'Who Urban Company competes with', head: ['Player', 'Owner', 'Model', 'What it means for Urban Company'], wide: [3], rows: [
      ['**Urban Company**', 'Listed (Sep-2025)', 'Full-stack marketplace; 51 cities; Native products', `${q1.atuMn} mn annual customers; NTV ₹${n0(A26.ntv)} cr in FY26`],
      ['Local, unorganised providers', '–', 'Word of mouth, cash, no warranty', 'The real competitor: >98% of the market; cheaper, but no quality guarantee'],
      ['NoBroker home services (Zivora)', 'NoBroker (unlisted)', 'Home services attached to a property platform', 'Smaller (~2 lakh requests a month); competes in cleaning, painting, beauty'],
      ['Snabbit', 'Venture-funded (unlisted)', 'On-demand house help', 'Raised US$56 mn (Apr-2026); ~1.85 mn orders in Jul-2026'],
      ['Pronto', 'Venture-funded (unlisted)', 'On-demand house help', 'Raised to ~US$200 mn valuation (May-2026); ~0.95 mn orders a month'],
      ['Kent RO, Aquaguard and others', 'Listed and unlisted', 'Water purifiers', 'Native\'s rivals; Kent withdrew disparaging ads after Urban Company sued (Aug-2026)'],
    ], source: 'Company filings, broker notes (JM Financial, Emkay), press (Entrackr, Enterprise, Inc42, Bar & Bench)' } },
    { exhibit: { type: 'table', title: 'Market facts', head: ['Measure', 'Value', 'Source'], rows: [
      ['India home-services market', 'US$59 bn (CY24) → ~US$97 bn (CY29)', 'Redseer, in the RHP'],
      ['Online share', '<1% of NTV; 0.8% (FY25) → 1.3% (FY30P)', 'Redseer; Ambit (Mar-2026)'],
      ['Online full-stack home services', '₹4,100-4,300 cr (FY25), +18-22% a year', 'MOSL (Mar-2026)'],
      ['Urban Company share of online full-stack', '~65-70%', 'MOSL (Mar-2026)'],
      ['InstaHelp TAM, top 15 cities', '₹7,000-12,000 cr of NTV', 'Company (Q1FY27 letter)'],
    ], source: 'As cited; all published on or before 30-Sep-2026' } },
  ],
};

// ---------------------------------------------------------------- Tailwind test
const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Urban Company captures the shift online, but slowly',
  blocks: [
    { p: 'A growing market does not guarantee a winner. The test is whether Urban Company captures each tailwind and turns it into profit.' },
    { verdicts: [
      ['Households moving from informal to trusted, online services', 'Yes', `Annual customers +${Math.round((A26.atuMn / A25.atuMn - 1) * 100)}% in FY26 to ${A26.atuMn} mn; 83% of FY26 India NTV from retained users.`, 'The core of the story; still under 2% of the market.'],
      ['Growth beyond the metros', 'Yes', 'Tier 2 cities NTV +36% in Q1FY27 vs +29% in the top 10.', 'A second growth engine, early.'],
      ['Premium beauty and wellness at home', 'Yes', 'Beauty "resurgence" over six months (Q1FY27 letter).', 'Highest-value category; quality matters.'],
      ['Quick, on-demand services ("instant")', 'Partly', 'UC Instant cuts waiting times; InstaHelp grew orders 43% QoQ but loses ₹346 an order.', 'Lifts frequency at a large cost.'],
      ['Gulf demand for organised home services', 'Yes', 'International NTV +75% in FY26; UAE and Singapore profitable.', 'A real second profit pool; Middle East risk.'],
      ['Gig-worker regulation', 'Headwind', 'Labour codes (21-Nov-2025): 1-2% of turnover to a welfare fund, capped at 5% of payouts.', 'A small permanent cost.'],
      ['Venture money in house help', 'Headwind', 'Snabbit and Pronto raised >US$100 mn in 2026.', 'Keeps InstaHelp prices and margins low.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: 'Urban Company Q4FY26 and Q1FY27 letters, broker notes and press (Jan-Sep 2026), GAM Research' },
  ],
};

module.exports = { history, industry, tailwind };
