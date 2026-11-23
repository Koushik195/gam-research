// Infosys report, part 4b: risks & honest summary, glossary and statement notes (explain every big change).
const X = require('./INFY.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, A, n0, n1, pc, price, epsSep28, peMult, FM, rating, buyBelow, sellAbove, impliedG, Q1, b, divYield } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a cash machine that has stopped growing, priced as one; ${rating} at ${n1(price / F.eps[1])}x FY28E`,
  blocks: [
    { callout: `**What you are buying:** India's second-largest IT services company, with ~2,000 large clients, a ~21% operating margin held for four years, free cash flow above profit, no debt, ~₹37,000 cr of cash and a policy of returning ~85% of free cash flow (a ~${n1(divYield)}% dividend yield on FY27E at ₹${n0(price)}, plus buybacks). AI services are 8.2% of revenue and growing fast.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for a business whose organic growth is ~0.5% this year and ~3% in our later years, and whose core work is being repriced by AI. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. Most of the upside is the multiple: we need the market to pay ${peMult}x Sep-28E EPS - the IT sector's median de-rating applied to Infosys's own history - against ~${n1(price / epsSep28)}x today. On the large incumbents' deeper de-rating alone the target would be ~₹${n0(Math.round(Math.round(X.afterInc) * epsSep28 / 10) * 10)}. On our cash flows the price already assumes long-run growth of about ${X.sg1(impliedG)}% a year.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['AI-first revenue outgrows deflation: organic growth back above 3%', 'Low-Medium', 'AI share of revenue (8.2% in Q1FY27), organic QoQ growth, revenue per employee'],
      ['Large deals convert faster (US$14.7 bn LTM TCV, 61% net new in Q1)', 'Medium', 'Sequential growth in H2FY27 and the FY28 guidance in April 2027'],
      ['A new buyback or special dividend while the shares are near 12x', 'Medium', 'Board announcements; FY25-26 payout at 82.1% of FCF vs the 85% policy'],
      ['New CEO keeps the margin discipline and sharpens the AI strategy', 'Medium', 'Ashiss Dash\'s first guidance and any reorganisation from April 2027'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['AI deflation accelerates at renewals; clients insource with AI tools', 'Medium', 'US$ revenue flat to down; our bear case (~11x, {{scen.bear.tp|inr}})'],
      ['Further guidance cuts (third in a row) as Q1\'s soft volumes cascade', 'Medium', 'FY27 growth at the 1.5% floor; EPS 2-3% below ours'],
      ['Rupee strengthens back towards ₹88-90 per US$', 'Low-Medium', 'Each 1% costs ~1% of rupee revenue and 15-17 bp of margin; our FY27-29E assume ₹95.5-99.5'],
      ['Pricing war with peers and AI-native firms; margin falls below 20%', 'Low-Medium', 'Each 1 point of EBIT margin is ~5% of our FY28E EPS'],
      ['US policy: visa fees, DOJ outcome, tariffs on services', 'Low-Medium', 'Higher onsite costs; reputational damage'],
      ['A large, expensive AI acquisition', 'Low', 'Dilutes returns; cash diverted from the payout'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The price (₹${n0(price)}) is well below our BUY line of ~₹${n0(buyBelow)}.** We would turn neutral above ~₹${n0(buyBelow)} and sellers above ~₹${n0(sellAbove)} on today's numbers, or sooner if Q2-Q3FY27 show organic growth staying negative or the sector de-rates further.`,
      `**Biggest swing factor:** the multiple, not the earnings. Each 1x on Sep-28E EPS of ₹${n1(epsSep28)} is ~₹${n0(epsSep28)} a share (~${Math.round(epsSep28 / price * 100)}% of the price); a return to the five-year median forward P/E (${Math.round(FM.median)}x) would be worth ~₹${n0(Math.round(FM.median * epsSep28 / 10) * 10)}, which we do not assume.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Organic growth, FY27 guidance midpoint', v: '~0.5%', d: 'reported 1.5-3.0% incl. 1.7% acquisitions' },
      { k: 'AI-first services, Q1FY27', v: `${Q1.aiRevPct}%`, d: 'of revenue; 5.5% in Q3FY26' },
      { k: 'Operating (EBIT) margin, Q1FY27', v: `${Q1.opMarginPct}%`, d: 'guidance 20-22%' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `median forward P/E since 2021: ${Math.round(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Constant currency (cc)', 'Growth with this year\'s revenue converted at last year\'s exchange rates: strips out currency moves. Infosys guides in cc.'],
      ['Organic growth', 'Growth excluding revenue from companies acquired during the period.'],
      ['TCV / large deal / net new', 'Total contract value: the full value of a contract over its life (usually 3-5 years). Infosys reports deals above US$50 mn as "large"; "net new" is the part that is new work rather than a renewal.'],
      ['Utilisation', 'Share of billable employees\' time actually billed to clients.'],
      ['Attrition', 'Employees who leave voluntarily over the last twelve months, as a % of headcount.'],
      ['Onsite / offshore', 'Work done at the client\'s location (mostly US/Europe, expensive) vs from India (cheaper). A lower onsite mix lowers revenue but raises margins.'],
      ['AI-led deflation', 'Clients paying less for the same work because AI tools make it faster; it shows up at contract renewals and, increasingly, mid-contract.'],
      ['AI-first revenue', 'Infosys\'s own measure of revenue from its six AI service areas ("Hexagon"); excludes existing work that merely uses AI tools.'],
      ['GCC', 'Global capability centre: a client\'s own captive IT or operations centre, usually in India.'],
      ['Project Maximus', 'Infosys\'s margin programme: value-based pricing, utilisation, automation and portfolio pruning.'],
      ['EBIT (operating) margin / EBITDA', 'Profit before other income, interest and tax, after (EBIT) or before (EBITDA) depreciation and amortisation, as % of revenue. Infosys guides on EBIT; our model drives EBITDA.'],
      ['EURS', 'Energy, Utilities, Resources & Services, one of Infosys\'s eight verticals.'],
      ['Labour Codes', 'India\'s new labour laws (notified Nov-2025) that widened the wage base for gratuity and leave; Infosys took a one-time ₹1,289 cr charge.'],
      ['Buyback / ADR', 'The company buying its own shares (cancelling them); American Depositary Receipts, Infosys shares traded on the NYSE.'],
      ['Free cash flow (FCF)', 'Cash from operations less capex.'],
      ['P/E, EV/EBITDA, justified P/E', 'Price ÷ EPS; (market value less net cash) ÷ EBITDA; the P/E a company deserves given its payout, growth and cost of equity: payout × (1 + g) ÷ (Ke − g).'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['DCF / WACC / reverse DCF', 'Discounted cash flow valuation; the required annual return used to discount (here the cost of equity: no debt); reverse DCF = the long-run growth the current price implies.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY19': '+17%: dollar growth plus a weaker rupee (~₹70 per US$ on the company\'s conversion).',
  'ebitdaMargin@FY19': '−230bp: higher people costs; company operating margin 22.8%.',
  'sales@FY21': '+11%: Covid year; US$ +6.1%, cc +5.0%; digital deals.',
  'ebitdaMargin@FY21': '+330bp to 27.8%: Covid-era cost savings (no travel) and high utilisation (87.7% in Q4).',
  'sales@FY22': '+21%: post-Covid digital boom; US$ +20.3%, cc +19.7%.',
  'ebitdaMargin@FY22': '−190bp: wage inflation and subcontractor costs as attrition hit 27.7%.',
  'sales@FY23': '+21%: US$ +11.7% plus a ~8% weaker rupee.',
  'ebitdaMargin@FY23': '−200bp: fresher hiring, lower utilisation (80%), wage hikes.',
  'sales@FY24': '+5%: demand slump; cc growth 1.4%.',
  'otherIncome@FY24': 'Includes ₹1,933 cr of interest on income-tax refunds (one-off).',
  'pat@FY24': '+9%; ₹4.76 of EPS from tax-refund interest and provision reversals.',
  'cfo@FY25': '+42%: lower tax payments (₹5,602 cr vs ₹9,231 cr in FY24) and steady working capital.',
  'sales@FY26': '+10%: US$ +4.6% (cc +3.1%) plus a ~5% weaker rupee.',
  'otherIncome@FY26': 'Screener nets the ₹1,289 cr Labour Codes charge here; the AR shows ₹4,322 cr (incl. ₹421 cr tax-refund interest).',
  'pat@FY26': '+10%; tax reversals (₹774 cr) and refund interest offset the Labour Codes charge.',
  'otherIncome@Q4FY24': 'Includes ₹1,933 cr of interest on income-tax refunds (one-off).',
  'otherIncome@Q3FY26': 'Negative: Labour Codes charge of ₹1,289 cr netted here by Screener.',
  'pat@Q3FY26': 'After the Labour Codes charge (₹888 cr after tax on Screener\'s basis).',
  'pat@Q4FY26': '+21%: ₹774 cr of tax-provision reversals and ₹381 cr of refund interest.',
  'sales@Q1FY27': '+14%: US$ +2.8% (cc +2.4%) plus a ~11% weaker rupee; acquisitions added ~1.1% QoQ.',
  'sales@FY27E': 'GAM: US$ +2.0% (half from Optimum and Stratus) at ₹95.5 per US$ (FY26: 88.6).',
  'ebitdaMargin@FY27E': 'GAM: EBIT ~21.0%; rupee and Maximus offset wage hikes and acquisition costs.',
  'capex@FY27E': 'GAM: ~₹2,900 cr of capex plus ~₹4,400 cr for the Optimum and Stratus acquisitions (no acquisition line in the engine).',
  'otherIncome@FY27E': 'GAM: 9.0% on opening net cash (~6.7% on average gross cash) + ₹650 cr; no tax-refund interest.',
  'sales@FY28E': 'GAM: US$ +3.0%, rupee ~2% weaker.',
};

module.exports = { risks, glossary, statementNotes };
