// Sona Comstar report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./SONACOMS.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, price, MULT, FM, rating, buyBelow, sellAbove, medTp, epsSep, k, sepNow, DN } = X;
const E = epsSep.base;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good engineering company priced at ${Math.round(sepNow)}x Sep-28E EPS; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** one of the few Indian component makers with a global EV franchise: 8.7% of the world\'s differential gears, EV differentials and traction motors, 69 EV programmes, a ₹24,000 cr order book, a railway business that diversifies away from US EV risk, a DENSO partnership for high-voltage and hybrid powertrains, and net cash. Management is capable, candid about bad quarters and allocates capital carefully.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[0])}x our FY27E and ${n1(price / F.eps[1])}x FY28E EPS for ~18% a year EPS growth, ~23% EBITDA margins and an ROE that only reaches ~14% by FY29E. That is the stock's own median multiple since mid-2022 (${n1(FM.median)}x) at a time when auto-component peers trade ~${Math.abs(X.sectorDr).toFixed(0)}% below theirs. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. Our bull case ({{scen.bull.tp|inr}}) needs both faster growth and no de-rating.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(sellAbove)} (HOLD) or ~₹${n0(buyBelow)} (BUY) on our rule`, 'Medium', `A fall of ~${Math.round((1 - sellAbove / price) * 100)}% / ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Margin back to 24-25% (company basis) as pass-through catches up', 'Medium', 'Q2FY27 results (due by mid-November 2026)'],
      ['BEV revenue sustains Q1\'s ₹436 cr a quarter and US EV demand recovers', 'Medium', 'BEV share, anchor-customer volumes, US tariffs'],
      ['Business-unit disclosure (railway, motors, driveline)', 'Low', 'Would let investors check the mix and margin story'],
      ['Robotics or DENSO JV2 revenue earlier than expected', 'Low-Medium', 'SOP of the three robotics orders; JV2 nominations'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Commodity inflation outruns pass-through; traction-motor mix keeps rising', 'Medium', 'Each 1pp of EBITDA margin ≈ 5% of EPS'],
      ['US EV slowdown and tariffs hit the anchor customer again (as in FY26)', 'Medium', 'BEV revenue fell 6% in FY26 and EPS grew 6%'],
      ['Programme delays: the order book converts more slowly', 'Medium', 'Revenue growth in single digits, as in FY25 (+11%)'],
      ['Promoter-family dispute escalates or Aureus sells', 'Low-Medium', 'Overhang; board or audit-committee changes'],
      ['More acquisitions at full prices', 'Medium', 'Returns stay near the cost of equity'],
      ['Auto sector de-rates further', 'Medium', `At the bear multiple (${MULT.bear}x) on base EPS: ~₹${n0(Math.round(MULT.bear * E / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The call is narrow.** We would move to HOLD below ~₹${n0(sellAbove)} and to BUY below ~₹${n0(buyBelow)} on today's numbers, or sooner if FY29 earnings move well above our ₹{{F.eps.2|n2}} (e.g. a margin back at 25% plus faster BEV growth).`,
      `**This is a valuation call, not a business call.** We like the company. But at ${n1(sepNow)}x Sep-28E EPS the stock already sits at its own post-IPO median while its sector trades ${Math.abs(X.sectorDr).toFixed(1)}% below; the house rule (× ${k.toFixed(3)}) gives ${MULT.base}x. The post-Q1 street median target was ₹${n0(medTp)}; Jefferies' 55x FY28E would be ~₹${n0(Math.round(55 * F.eps[1] / 10) * 10)} on our EPS.`,
      `**Biggest swing factor:** the multiple. Each 1x is ~₹${n1(E)} a share; each 1pp of EBITDA margin in FY28-29E is ~₹${n0(Math.round((F.sales[1] + F.sales[2]) / 2 * 0.01 * (1 - 0.255) / F.shares * MULT.base / 10) * 10)} at our multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'BEV revenue growth, Q1FY27', v: '+107%', d: '44% of automotive revenue' },
      { k: 'EBITDA margin (company basis)', v: '23.1%', d: 'Q1FY27; FY25 27.4%' },
      { k: 'ROE, FY26', v: '11%', d: 'FY24: 21% (Screener)' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(sepNow)}x`, d: `median since Jun-22: ${n1(FM.median)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Differential', 'The gear set that lets a vehicle\'s driven wheels turn at different speeds in a corner; "differential assembly" is the complete unit with its housing.'],
      ['e-axle', 'An integrated electric drive unit: motor, inverter and gearbox (including the differential) in one assembly.'],
      ['Traction motor / inverter', 'The electric motor that drives an EV\'s wheels, and the electronics that convert battery power to drive it.'],
      ['Starter motor / micro-hybrid', 'The motor that cranks an engine; micro-hybrid starters restart the engine repeatedly in stop-start systems.'],
      ['BEV / PHEV', 'Battery electric vehicle / plug-in hybrid electric vehicle.'],
      ['BEV share', 'BEV revenue as a share of Sona\'s automotive product revenue (excludes railway).'],
      ['Net order book', 'Management\'s estimate of revenue from awarded programmes over the next ten years that are not yet in production or not fully ramped up, net of programmes ending and discounted for delays.'],
      ['SOP', 'Start of production of a vehicle programme.'],
      ['Slump sale', 'Sale of a business as a going concern for a lump sum, without valuing each asset separately.'],
      ['Sona eDrive / JV1, JV2', 'Sona eDrive: the subsidiary taking Sona\'s 2W/3W EV business, 49% to DENSO. JV2: a new 51:49 DENSO-Sona company for high-voltage motors and inverters.'],
      ['Physical AI / AMR', 'Machines that sense, decide and act with AI (robots); AMR = autonomous mobile robot.'],
      ['QIP', 'Qualified institutional placement: a share sale to institutions (₹2,400 cr in Sep-2024).'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector de-rating', 'How far comparable stocks trade below their own five-year median P/E on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, as Sona has net cash).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '+48%: Comstar (starter motors) consolidated after the 2019 merger.',
  'otherIncome@FY20': '₹237 cr incl. a ₹233 cr exceptional gain (pre-listing).',
  'pat@FY20': 'Includes the ₹211 cr post-tax exceptional gain; FY21 is lower without it.',
  'sales@FY21': '+51%: EV differential assemblies and micro-hybrid starters ramp up despite Covid.',
  'ebitdaMargin@FY21': '28.2%: high-value EV differentials, operating leverage.',
  'sales@FY22': '+36%: listed Jun-2021; EV programmes ramp up.',
  'ebitdaMargin@FY24': '28.3%, the peak: mix and lower raw-material costs.',
  'sales@FY25': '+11%: US and European EV demand slows.',
  'otherIncome@FY25': '₹116 cr incl. ₹21 cr of exceptional items: treasury income on the ₹2,400 cr QIP cash (Sep-2024).',
  'sales@FY26': '+25%: railway business from 1-Jun-2025 (~₹900 cr, our estimate); automotive roughly flat; BEV −6%.',
  'ebitdaMargin@FY26': '24.3% (company 24.7%): railway and traction motors dilute; Q1FY26 hit by magnet curbs and one customer.',
  'pat@FY26': '+6%: lower margin, lower treasury income after the ₹1,643 cr railway purchase, ₹30 cr labour-code charge.',
  'cfo@FY26': '₹659 cr: receivables up with the railway business (debtor days 94).',
  'sales@Q2FY26': 'First full quarter of the railway business.',
  'otherIncome@Q3FY26': 'Negative: includes the ₹40 cr pre-tax labour-code provision (exceptional).',
  'sales@Q1FY27': '+52% (Screener; company +54%): BEV +107%, full quarter of railway vs one month.',
  'opm@Q1FY27': '22.5% (company 23.1%): input-cost inflation ahead of pass-through; traction-motor mix.',
  'sales@FY27E': 'GAM: +21%: automotive +21%, railway +23% (12 months vs 10).',
  'ebitdaMargin@FY27E': 'GAM: automotive 23.6%, railway 20.0% blended; lower half of the 23-25% band (company basis).',
  'pat@FY27E': `GAM: excludes the DENSO deal (completion by Mar-2027; ~₹${n0(DN.cash)} cr cash in, 49% of Sona eDrive out).`,
};

module.exports = { risks, glossary, statementNotes };
