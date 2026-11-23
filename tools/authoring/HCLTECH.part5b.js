// HCL Technologies report, part 5b: risks & honest summary, glossary, statement notes.
const X = require('./HCLTECH.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, A, AS, n0, n1, pc, price, epsSep28, peMult, FM, rating, buyBelow, sellAbove, b, divYield, sectorDr, medTp } = X;
const ebitSens = F.sales[1] * 0.01 * (1 - AS.taxRate[1] / 100) / F.pat[1] * 100;
const fxSens = 1; // ~1% of revenue per 1% move in the rupee

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a quality company at a price that assumes AI is only a cycle; ${rating} at ${n1(price / F.eps[1])}x FY28E`,
  blocks: [
    { callout: `**What you are buying:** India's third-largest IT services company, best-in-class among tier-1s at winning large deals, with the deepest engineering franchise, a profitable (if shrinking) software arm, EBIT margins of ~18%, ROIC of ~40%, ₹26,900 cr of net cash and a policy of returning at least 75% of profit (90%+ in practice): a dividend yield of ~${n1(divYield)}% on our FY28E.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for a business growing ~3-4% in dollars, in a sector the market has de-rated by ~${Math.abs(Math.round(sectorDr))}% for reasons we think are mostly lasting. On the street's method, with the sector de-rating applied to HCLTech's own history, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): **${rating}**. Including the dividend, the expected total return is still negative (about {{dcf.upside|chg}} plus ~${n1(divYield)}%). The street's median target (₹${n0(medTp)}) is flat on the price.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD on our rule) or ~₹${n0(buyBelow)} (BUY)`, 'Medium', `The stock traded at ₹1,100-1,140 in Jun-Jul 2026; ${Math.round((1 - sellAbove / price) * 100)}% below today is ~₹${n0(sellAbove)}`],
      ['Services growth above 5% CC for two or three quarters with stable pricing', 'Low-Medium', 'Mega-deal ramp from H2FY27; telecom clients lapping cuts in FY28'],
      ['Advanced AI heading to ~10% of revenue while traditional revenue holds', 'Low (FY28)', 'Quarterly Advanced AI revenue (US$171 m, +62%)'],
      ['Sector re-rating as AI fears fade (the cyclical case)', 'Medium', 'Peers\' P/E vs history; client budgets for 2027'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['AI deflation faster than 2-3% a year (renewals re-priced 20-30% lower)', 'Medium', 'US$ growth near zero; bear case {{scen.bear.tp|inr}}'],
      ['Telecom/manufacturing cuts spread; Europe weakens further', 'Medium', 'FY27 at the bottom of the 1-4% guidance; FY28 below 3%'],
      ['Data-centre business needs more capital than guided, with low returns', 'Medium', 'Lower ROIC; a lower payout would remove a key support for the stock'],
      ['Rupee strengthens back towards ₹88-90 per US$', 'Low-Medium', `~${fxSens}% of revenue and ~2% of EPS per 1% move (our estimate; partly offset by hedges)`],
      ['HCLSoftware decline accelerates; impairment of acquired IP', 'Low-Medium', 'Software EBIT falls; goodwill and intangibles are ~₹29,000 cr'],
      ['US policy on visas and outsourcing; tariffs', 'Medium', 'Higher onshore costs; slower client decisions'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD below ~₹${n0(sellAbove)}** and to BUY below ~₹${n0(buyBelow)} on today's numbers, or sooner if Q2-Q3FY27 show Services growth re-accelerating above guidance without margin give-ups.`,
      `**Biggest swing factor:** the multiple. Each 1x of P/E on Sep-28E EPS of ₹${n1(epsSep28)} is ~₹${n0(epsSep28)} a share; the street's modal 15x FY28E on our EPS is ~₹${n0(15 * F.eps[1])}, still below the price. On earnings, each 1pp of EBIT margin is ~${Math.round(ebitSens)}% of FY28E EPS.`,
      '**What we could be wrong about:** if the 2025-26 slowdown is mostly cyclical (client budgets, tariffs, war), HCLTech\'s execution and payout would deserve something closer to its 2021-25 multiple (~20x), worth ~₹1,500-1,600. Our bull case (half the de-rating reversed) is ₹{{scen.bull.tp|num}}.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Constant-currency growth', v: '+3.9%', d: 'FY26; FY27 guidance 1-4%; Q1 +2.6%' },
      { k: 'AI deflation (management)', v: '2-3% a yr', d: 'on HCLTech\'s mix, mostly still to come' },
      { k: 'Advanced AI revenue, Q1FY27', v: 'US$171 m', d: '+62% YoY; ~4.7% of revenue' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `median since 2021: ${Math.round(FM.median)}x (forward)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Constant currency (CC)', 'Growth as if exchange rates had not changed: the measure of underlying business growth for a company that bills in dollars, euros and pounds.'],
      ['TCV, net new bookings', 'Total contract value of deals signed in the period (new work only, excluding renewals); spread over the contract life, often five years or more.'],
      ['Managed services / productivity give-backs', 'Long contracts to run a client\'s systems; they usually promise yearly cost cuts, so revenue on the same scope falls each year.'],
      ['ITBS, ERS, HCLSoftware', 'HCLTech\'s three segments: IT & Business Services, Engineering & R&D Services, and its owned software products.'],
      ['ARR', 'Annual recurring revenue: annualised value of active subscription, support and SaaS contracts at quarter end (HCLSoftware).'],
      ['Perpetual licence', 'Software sold once for permanent use (revenue booked upfront), as opposed to subscriptions billed over time.'],
      ['Advanced AI', 'HCLTech\'s label for AI-native work: AI factories and data centres, AI and custom-silicon engineering, physical AI, AI-led services and IP.'],
      ['AI-disrupted / AI-amplified / AI-native', 'Management\'s three buckets of IT spend: work AI shrinks, work AI grows, and work that exists because of AI.'],
      ['Attrition (LTM)', 'Share of employees who left voluntarily over the last twelve months.'],
      ['DSO', 'Days sales outstanding: receivables expressed in days of revenue (billed only, or including unbilled work).'],
      ['EBIT / segment result', 'Operating profit after depreciation and amortisation, before other income, interest and tax; HCLTech reports segment profit this way.'],
      ['Cash-flow hedge', 'Forward contracts that lock in a rupee rate for future dollar receipts; when the rupee falls below the locked rate the contracts lose value.'],
      ['Restructuring cost', 'Severance and exit costs of HCLTech\'s FY26-27 reorganisation, which management reports separately.'],
      ['Labour Codes', 'India\'s four consolidated labour laws, which took effect in FY26 and raised gratuity and leave liabilities: a one-time ₹956 cr charge for HCLTech.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the twelve-month-forward earnings the market will look at in September 2027.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, as HCLTech has net cash).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '+17%: first full year of the IBM software products (acquired Jun-2019).',
  'ebitdaMargin@FY21': '+210bp to a record 26.6%: Covid-era savings on travel and facilities, software margins.',
  'sales@FY22': '+14%: post-Covid digital demand; CC growth 13.7%.',
  'ebitdaMargin@FY22': '−260bp to 24.0%: wage inflation and attrition costs as demand boomed.',
  'sales@FY23': '+18.5%: 13.7% CC growth plus a weaker rupee (US$ +9.6%).',
  'ebitdaMargin@FY23': '−170bp to 22.3%: sub-contracting and wage costs.',
  'sales@FY24': '+8.3%: CC growth slowed to 5.4% as discretionary spend fell.',
  'otherIncome@FY25': 'Includes a Rs574 cr gain on divesting the State Street HCL Services JV.',
  'pat@FY25': '+11%: helped by the JV gain (~Rs430 cr after tax, our estimate).',
  'sales@FY26': '+11.2%: US$ +6.0% (CC +3.9%) plus the rupee (88.7 vs 84.6 per US$).',
  'ebitdaMargin@FY26': '−120bp to 20.6%: ~65bp restructuring, wage hikes, software timing.',
  'otherIncome@FY26': 'Rs1,530 cr reported less the Rs956 cr Labour Codes charge, which Screener nets here; forex −Rs241 cr.',
  'pat@FY26': '−4%: Labour Codes charge (Rs719 cr after tax); flat (−0.2%) before it, with ~49bp of restructuring still inside.',
  'sales@Q3FY26': '+13.3% YoY: software licence season (HCLSoftware +28% QoQ) and the rupee.',
  'otherIncome@Q3FY26': '−Rs571 cr: includes the Rs956 cr one-time Labour Codes charge.',
  'pat@Q3FY26': 'After the Labour Codes charge (Rs719 cr after tax).',
  'sales@Q4FY26': '+12.3% YoY in rupees but −3.3% QoQ CC: software seasonality, delayed deals, telecom cuts.',
  'sales@Q1FY27': '+13.9% YoY: CC +2.6%, rupee at 94.7 vs 85.6 a year earlier.',
  'opm@Q1FY27': '19.9%: EBIT 16.9% after 62bp of restructuring; forex +60bp, productivity give-backs −110bp.',
  'pat@Q1FY27': '+20% YoY to Rs4,624 cr: EBIT +18% (margin +56bp despite 62bp of restructuring) and the rupee.',
  'sales@FY27E': 'GAM: US$ +2.9% (CC +2.8% incl. Jaspersoft) at Rs95.5 per US$ (FY26 88.7).',
  'ebitdaMargin@FY27E': 'GAM: EBIT 17.7%, inside the 17.5-18.5% guidance; D&A includes acquired intangibles.',
  'pat@FY27E': 'GAM: +18%, mostly the rupee and the absence of FY26\'s Labour Codes charge.',
  'capex@FY27E': 'GAM: includes Jaspersoft, HPE Telco Solutions, the Sarvam stake and ~Rs1,000 cr of data-centre spend.',
  'sales@FY28E': 'GAM: US$ +3.9% with the mega-deal ramp; rupee flat at 95.8.',
};

module.exports = { risks, glossary, statementNotes };
