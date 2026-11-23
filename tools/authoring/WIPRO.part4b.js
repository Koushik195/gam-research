// Wipro report, part 4b: risks & honest summary, glossary and statement notes.
const X = require('./WIPRO.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, A, n0, n1, price, epsSep28, peMult, FM, rating, buyBelow, sellAbove, b, impliedG, usdGrowth, incDr } = X;
const dy = F.dps[0] / price * 100;
const ncPs = F.treasury[0] / F.shares;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a value stock, not a turnaround; ${rating} at ${n1(price / F.eps[1])}x FY28E`,
  blocks: [
    { callout: `**What you are buying:** a $10.5 bn IT services firm whose dollar revenue has shrunk for three years and will shrink again organically in FY27 on our numbers, with margins below management's own band and no disclosed AI offset. In exchange you get ~${n1(dy)}% FY27E dividend yield, net cash of ~₹${n0(ncPs)} a share by Mar-27 (~${Math.round(ncPs / price * 100)}% of the price), ~17% ROE, clean accounts and an owner that returns 70-90% of profit.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS, near the bottom of its forward-P/E range since 2016 (lows of ~10x in 2016-20 and 8.4x in the Covid crash). The price implies rupee cash flows falling ~${Math.abs(Math.round(impliedG))}% a year forever. On the street's method and the house's derivation the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): **${rating}**, on valuation and yield, not on a turnaround. Most brokers are Reduce or Sell at 10-13x; our multiple is higher because we measure Wipro against its own history and the sector's de-rating, not against its recent momentum.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Organic growth turns positive (Americas 2 stabilises, large deals ramp)', 'Low-Medium', 'QoQ CC growth ex-acquisitions; Americas 2 YoY; bookings above ~$4 bn a quarter'],
      ['Margin back in the 17-17.5% band', 'Medium', 'Q2-Q4FY27 IT Services margin; utilisation; AI-native unit spending'],
      ['Wipro starts disclosing AI revenue that grows fast', 'Low-Medium', 'Quarterly disclosures, Reimagine AI wins'],
      ['Another buyback or higher dividends', 'Medium', 'January interim dividend; capital allocation policy (70%+ over three years)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['AI deflation accelerates: 10-15% pass-throughs spread across the run book', 'Medium', `Dollar revenue −3% a year; bear case {{scen.bear.tp|inr}}`],
      ['More client losses or ramp-down at top accounts ($100 mn+ clients 22 → 16 in two years)', 'Medium', 'Revenue below our FY28E; margin pressure'],
      ['Value trap: the multiple keeps falling with the incumbents', 'Medium', `At ${V.blend.methods[0].multiple.bear}x (the incumbents' ${Math.abs(Math.round(incDr))}% de-rating) on our EPS the stock is worth ~₹${n0(Math.round(V.blend.methods[0].multiple.bear * epsSep28 / 5) * 5)}`],
      ['Stronger rupee', 'Low-Medium', '~2.5% of EPS per 1% move'],
      ['US policy: H-1B costs, an outsourcing tax, visa curbs', 'Medium', 'Higher onsite costs; client hesitation'],
      ['Another costly acquisition or CEO change', 'Low-Medium', 'Goodwill already ~52% of equity; strategy reset'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would stay buyers below ~₹${n0(buyBelow)}** and turn sellers above ~₹${n0(sellAbove)} on today's numbers. We would cut our forecasts, and move towards the bear case, if Q2-Q3FY27 show organic decline worse than ~1% a quarter or margins below 16%.`,
      `**Position size:** this is a cheap, cash-rich, shrinking business. It suits investors who want yield and mean reversion; it is not a growth or AI play. The bear case (₹{{scen.bear.tp|num}}) is a real possibility.`,
      `**Biggest swing factor:** the margin. Each 1pp of EBITDA margin is ~${Math.round(F.sales[1] * 0.01 * 0.767 / F.pat[1] * 100)}% of our FY28E EPS and ~₹${n0(Math.round(F.sales[1] * 0.01 * 0.767 / F.shares * peMult / 5) * 5)} a share at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'IT Services revenue, constant currency', v: '−1.6%', d: 'FY26; FY24 −4.4%, FY25 −2.3%' },
      { k: 'IT Services EBIT margin, Q1FY27', v: '16.0%', d: 'band 17-17.5%; no timeline' },
      { k: 'FY27E dividend yield', v: `${n1(dy)}%`, d: 'plus ₹15,000 cr buyback in Jun-2026' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `median since 2021: ${Math.round(FM.median)}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['IT Services', 'Wipro\'s main segment: building, running and maintaining software and IT systems for companies. Reported in US dollars.'],
      ['Constant currency (CC)', 'Growth with exchange rates held at the earlier period\'s level, so it shows the business, not currency moves.'],
      ['SMU', 'Strategic Market Unit: Wipro\'s four client groups (Americas 1, Americas 2, Europe, APMEA).'],
      ['BFSI / EMR', 'Banking, financial services and insurance / energy, manufacturing and resources.'],
      ['Bookings / TCV / large deals', 'Total contract value signed in a period; large deals are contracts of $30 mn or more. Revenue from them comes over several years.'],
      ['Book-to-bill', 'Bookings divided by revenue in the same period; above 1x means more work signed than delivered.'],
      ['Utilisation / attrition', 'Share of billable staff working on client projects; share of employees who leave voluntarily over twelve months.'],
      ['Run work, cost take-out, vendor consolidation', 'Maintaining existing systems; contracts in which the vendor promises to cut the client\'s costs; a client giving more work to fewer vendors.'],
      ['AI deflation / forward productivity', 'Clients asking the vendor to pass on the savings AI makes possible, so the same work earns less revenue over time.'],
      ['GCC', 'Global capability centre: a client\'s own offshore centre in India, doing work it would otherwise outsource.'],
      ['Capco, DTS, Mindsprint', 'Wipro\'s banking consultancy (acquired 2021); Harman\'s engineering-services unit (acquired Dec-2025); Olam Group\'s IT arm (acquired May-2026).'],
      ['EBIT margin (IT Services)', 'Segment result ÷ segment revenue, as Wipro reports it (after depreciation and amortisation, including FX gains).'],
      ['EBITDA', 'Operating profit before depreciation, interest, tax and other income (Screener basis).'],
      ['Pro-forma FY26', 'FY26 restated as if the June-2026 buyback (60 cr shares) and acquisitions had already happened: EPS on 990.4 cr shares, cash reduced by the money paid out.'],
      ['P/E, EV/EBITDA, Sep-28E', 'Price ÷ EPS; enterprise value (market value less net cash) ÷ EBITDA; half of FY28E plus half of FY29E, the earnings the market will look at in September 2027.'],
      ['DCF / reverse DCF', 'Discounted cash flow valuation; a reverse DCF finds the growth rate at which the DCF value equals today\'s price.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY22': '+28%: Capco consolidated, India state-run business added back to IT Services, and the post-Covid demand boom.',
  'ebitdaMargin@FY21': '+360bp to 23.8%: Covid-era savings on travel and facilities.',
  'ebitdaMargin@FY22': '−280bp as costs returned after the Covid year and wages rose; Capco consolidated.',
  'ebitdaMargin@FY23': '−240bp to 18.6%: wage hikes and subcontracting costs while revenue growth slowed.',
  'sales@FY24': '−0.8%: IT Services −4.4% in constant currency; the rupee cushioned rupee revenue.',
  'pat@FY24': '−3%: lower revenue and margins.',
  'sales@FY25': '−0.7%: IT Services −2.3% CC.',
  'ebitdaMargin@FY25': '+150bp to 20.2%: cost cuts and higher utilisation (85.6% vs 84.8%).',
  'otherIncome@FY25': '+49%: higher treasury balances and yields, a ₹230 cr dividend from a strategic investment, fair-value gains.',
  'pat@FY25': '+19%: margin gains and higher other income.',
  'sales@FY26': '+4%: dollar revenue −0.3% (−1.6% CC) plus a weaker rupee (realised ₹87.9/$) and DTS from Dec-2025.',
  'eps@FY26': 'Pro-forma: attributable profit ÷ 990.4 cr post-buyback shares. Reported EPS ₹12.58 (IFRS ₹12.60).',
  'pat@FY26': '+0.5%: restructuring (Q1, Q3) and labour-code charges (Q4) absorbed.',
  'cfo@FY24': '+35% to ₹17,622 cr: working capital released.',
  'cfo@FY26': '−12%: trade receivables +15% on 4% revenue growth.',
  'sales@Q3FY26': '+6% YoY: DTS consolidated from 1-Dec-2025; rupee.',
  'sales@Q1FY27': '+11% YoY in rupees but only +1.0% in dollars (+0.9% CC): realised rate ₹93.53 vs ₹85.34; Mindsprint for two months.',
  'opm@Q1FY27': 'IT Services margin 16.0% (−130bp QoQ): wage hike, large-deal ramp-ups, AI-native unit, acquisitions.',
  'pat@Q1FY27': '+0.6% YoY to ₹3,352 cr; EPS ₹3.20 on weighted shares (₹3.38 on the post-buyback count).',
  'sales@FY27E': 'GAM: dollar revenue −0.5% (incl. ~3 pp from DTS and Mindsprint) × ₹94.3/$ (+7%).',
  'otherIncome@FY27E': 'GAM: −₹730 cr vs FY26 as ₹19,435 cr of cash left in June (buyback, acquisitions).',
  'sales@FY28E': 'GAM: dollar revenue +1.7%, rupee +2%.',
  'ebitdaMargin@FY28E': 'GAM: IT Services EBIT ~16.6%, still below the 17-17.5% band.',
};

module.exports = { risks, glossary, statementNotes };
