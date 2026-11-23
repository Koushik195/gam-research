// Tech Mahindra report, part 6b: risks & honest summary, glossary, statement notes.
const X = require('./TECHM.ctx');
const { F, V, A, AS, n0, n1, pc, price, epsSep28, peMult, rating, ruleText, buyBelow, sellAbove, FMR, epsCagr2729, sectorDr, b, Q1 } = X;
const M1 = AS.valuation.blend.methods[0];
const ppEps = F.sales[1] * 0.01 * (1 - AS.taxRate[1] / 100) / F.pat[1] * 100;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a well-run turnaround, fully priced; ${rating} at ${n1(price / F.eps[1])}x FY28E`,
  blocks: [
    { callout: `**What you are buying:** a mid-tier IT services firm whose new management has done what it promised: EBIT margin from 6.1% to ${Q1.ebitPct}%, growth back to ~6% in dollars, USD 4 bn of deals a year, ~₹6,300 cr of net cash after leases, 85%+ of free cash flow paid out (yield ~4% on FY27E) and EPS rising ~{{F.epsGrowth.0|n1}}% in FY27E.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS, a 20-35% premium to Tier-1 peers on brokers' estimates (BOB Capital, HDFC Securities), for a company with no scale advantage, a third of revenue from telecom, high exposure to the work AI automates first, and ~${Math.round(epsCagr2729)}% EPS growth once the margin catch-up is done. On the street's own method, with the sector's de-rating applied, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}, just past the line.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD) or ~₹${n0(buyBelow)} (BUY) on our rule`, 'Medium', `The stock is only ~${Math.round((price / sellAbove - 1) * 100)}% above the HOLD line`],
      ['A credible FY28-30 plan: margin above 16%, growth above 5%', 'Medium', 'Q4FY27 results (usually in April) / next analyst day'],
      ['Large-deal ramps lift FY27 growth towards 8% without margin cost', 'Low-Medium', 'Q2-Q3 QoQ growth after the auto reversal'],
      ['The sector re-rates as AI services revenue outgrows legacy erosion', 'Low', 'Peer guidance upgrades; AI revenue disclosures'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['AI deflation hits run contracts and BPS at renewal', 'Medium-High', 'USD growth ~2% after FY27 (our bear case): EPS ~16% below ours by FY29'],
      ['A large US telecom client cuts spend further', 'Medium', 'Communications (32%) shrinks; 1-2% off group growth'],
      ['15% margin missed (wage hikes, onsite-heavy deals, pricing)', 'Medium', `Each 1 pp of margin ≈ ${Math.round(ppEps)}% of FY28E EPS`],
      ['Rupee falls faster than ~1.5% a year', 'Medium', 'Helps EBIT, but hedge losses rise again below EBIT'],
      ['US policy: H-1B fee, proposed HIRE Act outsourcing tax', 'Low-Medium', 'Higher onsite costs; client hesitation'],
      ['Sector de-rating deepens', 'Medium', `At ${M1.multiple.bear}x Sep-28E (our bear multiple) on our EPS the stock is worth ~₹${n0(Math.round(M1.multiple.bear * epsSep28 / 10) * 10)}`],
      ['Large acquisition to buy growth', 'Low', 'Repeat of FY21-23; goodwill already 29% of net worth'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**This is a valuation call, not a business call.** Our earnings are in line with consensus; we pay ${peMult}x (the stock's ${n1(FMR.median)}x median after the sector's ${Math.abs(Math.round(sectorDr))}% de-rating) where the bulls pay 20x. We would move to HOLD below ~₹${n0(sellAbove)} and to BUY below ~₹${n0(buyBelow)} on today's numbers, or sooner on a credible post-FY27 plan.`,
      `**Biggest swing factor:** the multiple. Each 1x on Sep-28E EPS is ~₹${n0(Math.round(epsSep28 / 10) * 10)} a share; at the street's 18-20x our EPS supports ₹${n0(Math.round(18 * epsSep28 / 10) * 10)}-${n0(Math.round(20 * epsSep28 / 10) * 10)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'EBIT margin, Q1FY27', v: `${Q1.ebitPct}%`, d: 'FY24 6.1%; FY27 target 15%' },
      { k: 'USD growth, Q1FY27 (CC YoY)', v: `${Q1.ccYoyPct}%`, d: 'peers guide 1-4% for FY27' },
      { k: 'Deal wins, last twelve months', v: 'USD 4.1 bn', d: '+37.5% YoY' },
      { k: 'Price ÷ our FY28E EPS', v: `${n1(price / F.eps[1])}x`, d: `median since 2021: ${Math.round(FMR.median)}x; target ${peMult}x Sep-28E` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['IT services / BPS', 'Building and running software and IT systems for clients / running business processes (customer support, back office) for them.'],
      ['Constant currency (CC)', 'Revenue growth with exchange rates held at last year\'s levels, so that currency moves do not distort it.'],
      ['TCV / deal wins', 'Total contract value of new deals signed: revenue expected over the life of the contract (often 3-7 years).'],
      ['EBIT (company definition)', 'Operating profit after depreciation and amortisation, before other income, finance costs and tax. Our model uses EBITDA (before depreciation); EBIT = EBITDA − depreciation.'],
      ['Other income', 'Treasury income, rental and miscellaneous income, and gains or losses on foreign exchange and hedges.'],
      ['Hedge book / MTM', 'Forward contracts that lock in a rupee rate for future dollar receipts; mark-to-market (MTM) is their gain or loss as the rupee moves.'],
      ['Utilisation', 'Share of billable IT staff working on paid client projects.'],
      ['Attrition (LTM)', 'Share of IT staff who left over the last twelve months.'],
      ['Onsite / offshore', 'Staff working at the client\'s location (expensive) vs in India (cheaper).'],
      ['Pyramid / N-1', 'The mix of junior to senior staff; "N-1" means staffing a role one grade lower to cut cost.'],
      ['Subcontracting', 'Work done by outside contractors, usually costlier than own staff.'],
      ['DSO', 'Days sales outstanding: receivables (billed and unbilled) in days of revenue.'],
      ['Unbilled revenue', 'Work done and recognised as revenue but not yet invoiced.'],
      ['AI deflation / pass-back', 'Clients asking for lower prices or smaller contracts because AI tools make the same work cheaper to deliver.'],
      ['Run vs change work', 'Maintaining existing systems (run) vs building new ones (change).'],
      ['Project Fortius / Helix', 'Tech Mahindra\'s margin-improvement programme / its AI programme.'],
      ['TML Benefit Trust', 'A trust holding 9.42 cr Tech Mahindra shares (9.6%) left over from the Satyam merger; treated as treasury shares and excluded from EPS.'],
      ['Forward P/E', 'Share price ÷ next full financial year\'s EPS.'],
      ['Sector de-rating', 'How far peers\' P/E multiples have fallen below their own five-year medians.'],
      ['Justified P/E', 'The P/E implied by payout, growth and cost of equity: payout x (1 + g) / (Ke − g).'],
      ['ROCE / ROE', 'Return on capital employed / return on shareholders\' equity.'],
      ['Ke', 'Cost of equity: risk-free rate + beta x equity risk premium (here 6.5% + 1.0 x 6% = 12.5%).'],
      ['Tier-1', 'The largest Indian IT firms: TCS, Infosys, HCLTech, Wipro (and Tech Mahindra by some definitions).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY22': '+18%: post-Covid demand boom plus acquisitions (Com Tec Co, Allyis, Activus Connect and others).',
  'sales@FY23': '+19%: full year of acquisitions and a weaker rupee.',
  'ebitdaMargin@FY23': '−340bp to 14.6%: wage inflation, subcontracting and loss-making acquired units.',
  'sales@FY24': '−2%: telecom and hi-tech clients cut spending; USD revenue flat at USD 6.3 bn.',
  'ebitdaMargin@FY24': '−590bp to 8.7%: the trough; company EBIT 6.1%.',
  'pat@FY24': '−51%: EPS ₹26.7; the trough year excluded from our P/E history.',
  'pat@FY25': '+80%: margin recovery (Project Fortius) plus a ₹450 cr property-sale gain in other income.',
  'otherIncome@FY25': 'Includes the ₹450 cr property-sale gain; FX loss ₹238 cr.',
  'ebitdaMargin@FY25': '+440bp to 13.1%: subcontractor cuts, offshoring, portfolio-company integration.',
  'otherIncome@FY26': 'Negative on Screener: FX/hedge loss ₹480 cr and the ₹272 cr Labour Code charge (company other income +₹32 cr).',
  'ebitdaMargin@FY26': '+280bp to 15.9%: company EBIT 12.6%; rupee tailwind in H2.',
  'pat@FY26': '+13%: EBIT +39% offset by FX losses and the Labour Code charge.',
  'sales@FY27E': '+13.8%: USD +6.1% plus the weaker rupee (89.0 to 95.5).',
  'pat@FY27E': '+37%: EBIT margin to 14.8% and FX losses halve.',
  'otherIncome@FY27E': 'Treasury ₹254 cr + misc ₹190 cr − FX ₹400 cr.',
};

module.exports = { risks, glossary, statementNotes };
