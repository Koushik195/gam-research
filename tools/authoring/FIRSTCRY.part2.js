// FirstCry report, part 2: history & corporate actions, industry & competition, tailwind test.
const C = require('./FIRSTCRY.ctx');
const { n0, n1, A25, A26, q1, D, C: CO, SA } = C;
const IV = D.industry;

// ---------------------------------------------------------------- History
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Sixteen years to build India\'s baby-products leader; a roll-up and an IPO along the way',
  blocks: [
    { p: 'FirstCry started in Pune in 2010 as an online shop for baby products. It added stores (company-owned and franchised), its own BabyHug and other home brands, a parenting app and community, and its own manufacturing. It took the model to the UAE (2019) and Saudi Arabia (2022) and built Globalbees, a roll-up of direct-to-consumer brands, in FY22-FY23. Venture investors, led by SoftBank, and Mahindra & Mahindra funded years of losses; the IPO in Aug-2024 raised ₹1,666 cr of new money and let early holders sell ₹2,528 cr of shares. There is no promoter: the company is "professionally managed" and the founder holds 5.2%.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: CO.history, source: 'FY26 annual report, investor presentations, Screener.in' } },
    { pair: [
      { type: 'column', title: 'GMV: growth slowed from 26% (FY24) to 10% (FY26)', unit: 'GMV, India + International (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'GMV', values: SA.map(a => a.gmv), fmt: 'num' }], labels: 'all', source: 'Investor presentations (FY23-FY26)' },
      { type: 'column', title: 'Adjusted EBITDA has risen six-fold since FY23', unit: 'Group adjusted EBITDA, before ESOP and rent (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Adj. EBITDA', values: SA.map(a => a.adjEbitda), fmt: 'num' }], labels: 'all', source: 'Investor presentations (FY23-FY26)' },
    ] },
    { h: 'Capital raised and what it cost shareholders' },
    { exhibit: { type: 'table', title: 'Corporate actions', head: ['Action', 'Date', 'Amount (₹ cr)', 'Effect on shareholders'], wide: [3], rows: [
      ['Venture and strategic rounds (SoftBank, Mahindra, Premji Invest and others)', 'To FY24', 'n.d.', 'Funded the losses; SoftBank (19.8%) and Mahindra (8.6%) were still the largest holders at Mar-2026.'],
      ['Globalbees brand acquisitions', 'FY22 to Sep-2022', 'n.d.', 'Added ~₹1,900 cr of revenue by FY26 but 48% minorities, brand amortisation (₹88 cr in FY26), impairments and ₹388 cr of earn-outs still owed.'],
      ['IPO at ₹465', 'Listed 13-Aug-2024', '4,194 (1,666 new, 2,528 OFS)', '35.8 mn new shares (~7% dilution); SoftBank and others sold 54.4 mn.'],
      ['ESOP trust and options', 'Ongoing', '–', '36.5 mn shares held by the trust; 10.3 mn options outstanding (9.8 mn performance-based, linked to market value). We value on 532.4 mn diluted shares.'],
      ['Variation of IPO objects', 'AGM 22-Sep-2026', '–', 'Unspent IPO money re-directed to new warehouses and buying more of Globalbees\' subsidiaries; deadline extended to FY2028-29.'],
      ['Dividends / buybacks', 'Never', '–', 'All cash retained.'],
    ], source: 'FY26 annual report (notes 22, 41; AGM notice), Q1FY27 presentation' } },
    { callout: `**What this means:** the IPO cash (₹${n0(CO.fy26.cash + CO.fy26.bankBalances + CO.fy26.ncDeposits)} cr of cash and deposits at Mar-26) means FirstCry does not need new equity. The costs of the past are in the accounts instead: brand amortisation and impairments from the Globalbees deals, earn-outs still to pay, and minorities that will take almost half of any Globalbees profit. Selling by pre-IPO holders helped push the stock ~73% below its first-week level.` },
  ],
};

// ---------------------------------------------------------------- Industry
const industry = {
  id: 'industry', nav: 'Industry & competition', kicker: 'Industry', title: 'A large, fast-growing market where quick commerce now fights for the daily basket',
  blocks: [
    { p: IV.market },
    { p: IV.competition + ' ' + IV.gst },
    { exhibit: { type: 'table', title: 'Who FirstCry competes with', head: ['Player', 'Model', 'What it means for FirstCry'], wide: [2], rows: [
      ['**FirstCry**', 'Specialist omnichannel: app + 1,188 stores, home brands, 2-3 hour Qwik in 12 cities', `India GMV ₹${n0(A26.indiaGmv)} cr in FY26; ${q1.indiaAutcMn} mn annual customers`],
      ['Amazon, Flipkart, Myntra, AJIO, Meesho', 'Horizontal marketplaces', 'Price competition in branded items and kids\' fashion; Meesho at low price points'],
      ['Blinkit (Eternal), Instamart (Swiggy), Zepto, Flipkart Minutes', 'Quick commerce (10-30 minutes)', 'Took share in diapers and baby essentials with aggressive pricing from Q3FY26'],
      ['Pharmacy chains (Apollo, MedPlus)', 'Own-label diapers in neighbourhood stores', 'Cheaper own-label diapers; retention risk for FirstCry\'s third-party diaper sales'],
      ['Unorganised kids\' stores', 'Local shops', 'Still most of the market; lose share to organised players after the GST cut'],
      ['Amazon.ae/.sa, Noon (Gulf)', 'Horizontals', 'Promotions since 2024 slowed FirstCry\'s International growth'],
    ], source: 'Q1FY27 call (13-Aug-2026), JM Financial (May-2026), FY26 annual report' } },
    { exhibit: { type: 'table', title: 'Market facts', head: ['Measure', 'Value', 'Source'], rows: [
      ['India childcare market growth', '12-14% a year (projected)', 'RedSeer (Jul-2024), in the FY26 annual report'],
      ['Childcare products market, FY29', 'India ₹5,150-5,450 bn; KSA ₹640-680 bn; UAE ₹240-280 bn', 'RedSeer, Q1FY27 presentation'],
      ['Spend per child on childcare products (FY24)', 'India ₹9,280-9,350; KSA ₹61,000-71,000; UAE ₹160,000-170,000', 'RedSeer, Q1FY27 presentation'],
      ['Birth rate per 1,000 (CY22)', 'India 16.3; KSA 17.0; UAE 9.9', 'RedSeer, Q1FY27 presentation'],
      ['Share of population aged 0-12', '~21%', 'FY26 annual report'],
      ['Diapers in FirstCry India GMV', '~15%', 'Q1FY27 call'],
    ], source: 'As cited; all published on or before 30-Sep-2026' } },
  ],
};

// ---------------------------------------------------------------- Tailwind test
const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: the market grows, but FirstCry has not kept pace',
  blocks: [
    { p: 'A growing market does not guarantee a winner. The test is whether FirstCry captures each tailwind and turns it into profit.' },
    { verdicts: [
      ['Childcare spending growing 12-14% a year', 'Partly', `India GMV +${n1(A26.indiaGmvYoY)}% in FY26 and +${q1.indiaGmvYoYPct}% in Q1FY27, below the market's projected pace.`, 'FirstCry has been losing share, at least in FY26.'],
      ['Shift from unorganised to organised and branded', 'Yes', 'Home brands >58% of India GMV (37% in FY20); GST cut to 5% helps organised retail.', 'Supports gross margin over time.'],
      ['Faster delivery as the new norm', 'Partly', 'RocketBees >50% of shipments; Qwik 125,000 orders in Jun-26 in 12 cities.', 'Defends the basket, but adds logistics cost (~30bp in Q1).'],
      ['Quick commerce in essentials', 'Headwind', 'Diaper price war from Q3FY26; India gross margin −260bp YoY in Q1FY27.', 'The main reason margins fell.'],
      ['Gulf demand (high spend per child)', 'Partly', 'International GMV +5% in FY26, +9% in Q1FY27; losses narrowing.', 'Large market, still loss-making for FirstCry.'],
      ['D2C brands selling online', 'Weak', 'Globalbees revenue flat in Q1FY27; repeated impairments.', 'Low-margin business, half owned by others.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: 'Investor presentations and calls (FY26-Q1FY27), FY26 annual report, GAM Research' },
  ],
};

module.exports = { history, industry, tailwind };
