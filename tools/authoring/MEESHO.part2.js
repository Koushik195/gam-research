// Meesho report, part 2: history & corporate actions, industry & competition, tailwind test.
const C = require('./MEESHO.ctx');
const { n0, n1, A25, A26, q1, D, SA } = C;
const IV = D.industryView;

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From reseller app to India\'s biggest marketplace by buyers, with an expensive move home',
  blocks: [
    { p: 'Meesho started in 2015 as an app for "resellers" who shared products on WhatsApp. It became a direct marketplace, cut seller commissions to zero (FY23) and built its own logistics platform, Valmo. Three corporate events shape today\'s numbers: the 2024-25 move of the parent company from the US to India (expensive: ~₹3,800 cr of one-off costs and tax); the Dec-2025 IPO; and the Jun-2026 end of the pre-IPO lock-in, which turned venture investors into steady sellers.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: D.historyRows, source: D.historySource } },
    { pair: [
      { type: 'column', title: 'NMV more than doubled in three years', unit: 'Net merchandise value (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'NMV', values: SA.map(a => a.nmv), fmt: 'num' }], labels: 'all', source: 'FY26 annual report' },
      { type: 'column', title: 'Contribution margin peaked in FY24 and fell as Valmo scaled', unit: 'Contribution margin, % of NMV', x: SA.map(a => a.fy), series: [{ name: 'Contribution margin', values: SA.map(a => a.cmPct), fmt: 'pct' }], labels: 'all', source: 'FY26 annual report' },
    ] },
    { h: 'Capital raised and what it cost shareholders' },
    { exhibit: { type: 'table', title: 'Corporate actions', head: ['Action', 'Date', 'Amount (₹ cr)', 'Effect on shareholders'], wide: [3], rows: [
      ['Venture rounds (SoftBank, Prosus, Fidelity, Elevation, Peak XV and others)', 'FY16-FY25', 'n.d.', 'Funded ~₹7,200 cr of cumulative net losses FY21-FY26 (excluding the re-domicile one-offs).'],
      ['Re-domicile: Meesho Inc. (US) merged into the Indian company', 'NCLT order 27-May-2025', '~3,800 (one-off)', '₹1,346 cr exceptional costs in FY25 (incl. ₹734 cr of perquisite tax paid on the founders\' behalf) and ₹2,487 cr tax; ₹2,780 cr paid in cash in FY26.'],
      ['Bonus issue and CCPS conversion before the IPO', 'FY26', '–', '~418 cr shares before the IPO; no economic effect.'],
      ['IPO at ₹111', '3-5 Dec 2025; listed 10-Dec-2025', '4,250 (fresh issue)', '38.3 cr new shares (~9% dilution); ₹4,125 cr net proceeds.'],
      ['Employee options outstanding', 'Mar-2026', '–', '17.9 cr shares (~3.9%) at ₹1 exercise price; we value on 474.3 cr fully diluted shares.'],
      ['Kirana Club acquisition (cash)', 'Approved 12-Jun-2026', '~202', 'B2B app for small retailers; paid in three tranches by Mar-2027.'],
      ['Dividends / buybacks', 'Never', '–', 'All cash retained.'],
    ], source: 'FY26 annual report, Q1FY27 letter, Upstox (12-Jun-2026)' } },
    { callout: `**What this means:** the venture-funded years are over: since FY24 Meesho has grown on its own cash, and the IPO money largely replaced the ₹3,344 cr spent on moving home. The four largest venture investors alone held 42% of the shares at Mar-2026, and pre-IPO holders have been selling since the lock-in ended; that supply, not dilution, is the near-term cost to shareholders.` },
  ],
};

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry & competition', kicker: 'Industry', title: 'A huge, under-served market, contested by the deepest pockets in Indian retail',
  blocks: [
    { p: IV.market },
    { p: IV.competition },
    { exhibit: { type: 'table', title: 'Who Meesho competes with for the value shopper', head: ['Player', 'Owner', 'Model', 'What it means for Meesho'], wide: [3], rows: [
      ['**Meesho**', 'Listed (Dec-2025)', 'Zero-commission marketplace; Valmo logistics; ads', `${q1.atuMn} mn annual buyers; NMV ₹${n0(A26.nmv)} cr in FY26`],
      ['Flipkart / Shopsy', 'Walmart (unlisted)', 'Horizontal marketplace plus a low-price, low-commission app', 'The largest rival; can subsidise value shoppers from its main business'],
      ['Amazon / Amazon Bazaar', 'Amazon (unlisted in India)', 'Low-price storefront for unbranded goods', 'Copies the zero-commission, low-AOV model'],
      ['Ajio, JioMart', 'Reliance Retail (unlisted)', 'Fashion and grocery e-commerce', 'Offline supply chain and brand reach'],
      ['Quick-commerce apps (Blinkit, Instamart, Zepto, Flipkart Minutes)', 'Eternal, Swiggy, private', '10-minute delivery from dark stores', 'Competes for everyday essentials and shopping time, mainly in big cities'],
    ], source: 'Company filings, press; GAM Research' } },
    { exhibit: { type: 'table', title: 'Market facts (Redseer, cited in the FY26 annual report)', head: ['Measure', 'Value'], rows: [
      ['E-commerce GMV', '~₹6 lakh crore (US$70 bn)'],
      ['E-commerce share of retail', '~7% (China 34%)'],
      ['Penetration: Tier 2+ towns vs top 8 / Tier 1 cities (FY25)', '~4% vs ~14%'],
      ['Unbranded and regional products, share of retail spend', '>70%'],
      ['Internet users', '818-853 mn (FY25) → ~1 bn by FY30'],
      ['Small sellers, mostly offline', '55-60 mn'],
    ], source: 'FY26 annual report (Redseer data)' } },
  ],
};

// ---------------------------------------------------------------- Tailwind test
const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Meesho captures the value-shopper boom, but not yet the profit',
  blocks: [
    { p: 'A growing market does not guarantee a winner. The test is whether Meesho captures each tailwind and turns it into profit.' },
    { verdicts: [
      ['First-time online shoppers in small towns', 'Yes', `Annual buyers +${Math.round((A26.atuMn / A25.atuMn - 1) * 100)}% in FY26 to ${A26.atuMn} mn; ~85% outside the top eight cities (Ambit).`, 'The core of the story; growth is slowing from 33% to 29%.'],
      ['Small sellers coming online', 'Yes', `Sellers +${q1.atsYoYPct}% to ${q1.atsMn} mn; Tier 4 sellers +125%.`, 'More sellers = more supply and more ad buyers.'],
      ['Digital advertising by small businesses', 'Partly', 'Two-thirds of sellers by GMV advertise; J.P. Morgan estimates ad take rate at 1.8% of NMV vs 3.7% globally.', 'The main margin lever, still early.'],
      ['Cheaper logistics at scale', 'Partly', 'Valmo cut delivery costs, but its FY26 scale-up cost 2pp of contribution margin; efficiencies are passed on to buyers by design.', 'Helps growth more than margin.'],
      ['Prepaid / UPI adoption', 'Yes', `Prepaid share of orders ~${q1.prepaidPct}%; fewer cancellations and returns.`, 'Lifts NMV conversion and cuts cost.'],
      ['Branded value goods (Meesho Mall)', 'Yes', `Mall NMV +${q1.mallNmvYoYPct}%; ~1,200 brands.`, 'Lower margin for now; adds ad revenue.'],
      ['Horizontal rivals copying the model', 'Headwind', 'Shopsy, Amazon Bazaar; Nomura flags quick commerce too.', 'Caps take-rate increases.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: 'Meesho Q1FY27 letter, broker notes (Jun-Sep 2026), GAM Research' },
  ],
};

module.exports = { history, industry, tailwind };
