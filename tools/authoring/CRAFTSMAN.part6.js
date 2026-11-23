// Craftsman Automation report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./CRAFTSMAN.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, AS, n0, n1, price, shares, MULT, FM, rating, buyBelow, sellAbove, medTp, epsSep, k, sepNow, nd0 } = X;
const E = epsSep.base;
const marginRs = Math.round((F.sales[1] + F.sales[2]) / 2 * 0.01 * (1 - AS.taxRate[1] / 100) / shares * MULT.base / 10) * 10;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good machinist in a capital-hungry business, priced at ${Math.round(sepNow)}x Sep-28E EPS; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** a founder-run engineering group with real machining know-how, 31 plants, a growing aluminium business (~95,000 tonnes), a new large-engine castings line with orders from global customers, and an industrial arm that is turning up. Revenue has grown ~39% a year since FY21, Q1FY27 was strong and the Jun-2026 QIP has repaired the balance sheet.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for a business with a ~16% EBITDA margin, ROE of 11-14% in our forecasts and negative free cash flow in FY25-27E. That is well above the stock's own ${n1(FM.median)}x forward-P/E median since listing, at a time when auto-component peers trade ~${Math.abs(X.sectorDr).toFixed(0)}% below theirs. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. Even our bull case ({{scen.bull.tp|inr}}) is only {{scen.bull.upside|chg}} above the price.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD) or ~₹${n0(buyBelow)} (BUY) on our rule`, 'Medium', `A fall of ~${Math.round((1 - sellAbove / price) * 100)}% / ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Sunbeam at mid-teens EBITDA by Q4FY27 and aluminium EBIT above 12%', 'Medium', 'Q2-Q4FY27 segment results'],
      ['Capex falls below ₹1,000 cr a year and free cash flow turns positive', 'Low-Medium', 'FY28 capex plan; half-year balance sheets'],
      ['Large-engine castings approved and ramping faster (more than 30% of US$100 mn in FY28)', 'Medium', 'Customer approvals; Kothavadi utilisation'],
      ['Gurgaon land sale (~₹400 cr implied) used to cut debt', 'Medium', 'Exchange filing'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Truck and tractor downturn (powertrain is ~27% of revenue and ~40% of segment EBIT)', 'Medium', 'Powertrain EBIT fell from 25% to 14% in FY23-25'],
      ['Aluminium price swings passed through late; customers resist resets', 'Medium', `Each 1pp of FY28-29E EBITDA margin ≈ ₹${n0(marginRs)} a share at our multiple`],
      ['New plants fill slowly (Hosur, Sriperumbudur, large-engine lines)', 'Medium', 'Depreciation and interest arrive before revenue'],
      ['Labour-cost inflation (~20% a year in places, per the CMD) not passed on', 'Medium', 'Margin pressure across segments'],
      ['More acquisitions or another equity raise', 'Low-Medium', 'Management says no more equity is needed'],
      ['Customer concentration (one customer 24% of standalone revenue)', 'Low-Medium', 'Loss of a programme hits powertrain or aluminium'],
      ['Diesel-engine exposure as trucks and gensets electrify', 'Low (5+ years)', 'Long-term demand for blocks and heads'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The gap is mostly the multiple, partly earnings.** The stock trades at ${n1(sepNow)}x our Sep-28E EPS against a house multiple of ${MULT.base}x (${n1(FM.median)}x median × ${k.toFixed(3)}). Our FY28E EPS is ~14% below the street's; on Emkay's EPS our multiple would still give less than the share price. The post-Q1 street median target was ₹${n0(medTp)}.`,
      `**We would move to HOLD below ~₹${n0(sellAbove)}** and to BUY below ~₹${n0(buyBelow)} on today's numbers, or sooner if Sunbeam and the new plants lift FY29 EPS well above our ₹{{F.eps.2|n0}}.`,
      `**Biggest swing factor:** the multiple. Each 1x is ~₹${n0(E)} a share; each 1pp of EBITDA margin in FY28-29E is ~₹${n0(marginRs)} at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Revenue CAGR, FY21-26', v: '39%', d: 'aluminium 21% → 59% of revenue' },
      { k: 'EBITDA margin', v: '15.3%', d: 'FY26; FY21 28%' },
      { k: 'Capex, FY24-26', v: '₹2,811 cr', d: 'plus ~₹800 cr of acquisitions' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `median since Apr-21: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Cylinder block / head', 'The main cast body of an engine (block) and the part bolted on top that holds the valves (head); both must be machined to tight tolerances.'],
      ['Machining', 'Cutting a cast or forged part to its final shape and size on lathes, milling and boring machines.'],
      ['Die-casting (HPDC, LPDC, gravity, sand)', 'Pouring or injecting molten metal into a mould; high-pressure (HPDC) for thin, complex aluminium parts, low-pressure (LPDC) for wheels and structural parts, gravity and sand casting for heavier parts.'],
      ['Build to print', 'Making a part to the customer\'s design: the supplier sells process skill and capacity, not its own product.'],
      ['Special-purpose machine (SPM)', 'A machine built for one job or part, often by Craftsman itself.'],
      ['Large / stationary engines', 'Big diesel and gas engines for generator sets (e.g. data-centre back-up power) and industrial use.'],
      ['Segment EBIT', 'Segment profit before corporate costs, other income, interest and tax, as the company reports it.'],
      ['QIP', 'Qualified institutional placement: a share sale to institutions (₹1,200 cr in Jun-2024, ₹2,000 cr in Jun-2026).'],
      ['OCD', 'Optionally convertible debenture: how Craftsman paid for and funded Sunbeam.'],
      ['Pro forma', 'Restated as if an event (here, the Jun-2026 QIP) had already happened at Mar-2026.'],
      ['Net debt / EBITDA', 'Borrowings less cash, divided by a year\'s EBITDA: how many years of operating profit would repay the debt.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value plus net debt) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitdaMargin@FY20': '+231bp despite revenue −18% (CV downturn, Covid lockdown in Mar-2020): employee costs fell from 13% to 10% of revenue (Screener).',
  'otherIncome@FY20': 'Includes a −₹5.7 cr exceptional item.',
  'pat@FY20': '−59%: revenue −18%, interest ₹149 cr (net debt ~₹980 cr before the IPO).',
  'otherIncome@FY21': '₹9.7 cr of normal other income plus ₹0.6 cr exceptional; FY20 was cut by the exceptional charge.',
  'pat@FY21': '+142%: 28% EBITDA margin and interest down to ₹107 cr as IPO money and cash flow repaid debt.',
  'ebitdaMargin@FY22': '−399bp: material costs rose from 43% to 47% of revenue (metal inflation); industrial & engineering EBIT margin fell from 19% to 11%.',
  'pat@FY22': '+68%: revenue +42%, interest down to ₹84 cr.',
  'ebitdaMargin@FY23': '−260bp: aluminium (lower margin) grew 112% and DR Axion joined in Feb-2023; material costs 51% of revenue.',
  'otherIncome@FY23': 'Small amounts (₹13 cr vs ₹8 cr).',
  'pat@FY23': '+52% (attributable ₹248 cr after DR Axion\'s 24% minority): revenue +44%.',
  'sales@Q3FY25': '+39%: Sunbeam consolidated from 9-Oct-2024 (aluminium revenue ₹916 cr vs ₹583 cr in Q2).',
  'sales@Q4FY25': '+58%: first full quarter of Sunbeam.',
  'sales@Q1FY26': '+55%: Sunbeam not in the Q1FY25 base; aluminium +103%.',
  'sales@Q2FY26': '+65%: Sunbeam not in the Q2FY25 base; aluminium +106%.',
  'sales@Q3FY26': '+31%: like-for-like (Sunbeam in both quarters); aluminium +31%, industrial +57%.',
  'sales@Q4FY26': '+27%: powertrain +20%, aluminium +30%, industrial +30%.',
  'sales@FY21': '+5%: Covid year; powertrain-led; IPO in Mar-2021.',
  'ebitdaMargin@FY21': '28%, the peak: powertrain-heavy mix (52% of revenue).',
  'sales@FY22': '+42%: recovery in CVs and tractors; storage and engineering +49%.',
  'sales@FY23': '+44%: DR Axion consolidated from Feb-2023 (76%).',
  'sales@FY24': '+40%: first full year of DR Axion; aluminium +130%.',
  'ebitdaMargin@FY24': '20%: aluminium now 48% of revenue; powertrain EBIT margin down from 25% to 19%.',
  'sales@FY25': '+28%: Sunbeam from Oct-2024 (₹585 cr in H2FY25).',
  'ebitdaMargin@FY25': '15%: Sunbeam losses, new aluminium plants at low utilisation.',
  'otherIncome@FY25': 'Includes −₹25.7 cr of exceptional items.',
  'pat@FY25': '−36% (attributable ₹195 cr): Sunbeam\'s losses, higher interest and depreciation; QIP diluted EPS 43%.',
  'sales@FY26': '+42%: full year of Sunbeam, aluminium +58%, powertrain +20%.',
  'pat@FY26': '+97% (₹384 cr). EPS shown on 2.6154 cr post-QIP shares (₹146.8); reported ₹161.0.',
  'cfo@FY26': '₹522 cr after ₹598 cr of working-capital build (inventory +₹411 cr).',
  'capex@FY26': '₹1,188 cr, a record; plus ₹134 cr of other investing (land companies).',
  'sales@Q1FY27': '+36%: powertrain +26%, aluminium +38%, industrial +53%.',
  'pat@Q1FY27': '+116% on a weak Q1FY26 (₹8 cr exceptional charge); QIP cash from 18-Jun-2026.',
  'sales@FY27E': 'GAM: segment build (powertrain +15%, aluminium +28%, industrial +25%).',
  'ebitdaMargin@FY27E': 'GAM: Sunbeam improving to mid-teens EBITDA by Q4; new plants dilute.',
  'pat@FY27E': `GAM: on 2.6154 cr shares; net debt rises from ~₹${n0(nd0)} cr (pro forma) as capex of ₹1,500 cr runs ahead of cash flow.`,
};

module.exports = { risks, glossary, statementNotes };
