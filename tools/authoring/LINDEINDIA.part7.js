// Linde India report, part B (7 of 7): risks & honest summary, glossary, statement notes.
const X = require('./LINDEINDIA.ctx');
const { F, V, A, n0, n1, price, mv, peMult, peFY28, rating, buyBelow, sellAbove, ruleText, RP, PED, H, b } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a business worth owning at the right price, and this is not it',
  blocks: [
    { callout: `**What you are buying:** India's leading listed industrial-gas company, owned and run by the global leader; long take-or-pay contracts with Tata Steel, SAIL, JSL and IOCL; dense plant clusters in the East and North; four large plants under construction; a ~₹${n0(PED.thirdPartyOrderBookAug26)} cr third-party engineering order book; almost no debt today.` },
    { callout: `**What you are paying:** ${n1(peFY28)}x our FY28E EPS for a company whose underlying profit has been flat for three years, whose ROE is heading to ~${Math.round(F.roe[1])}%, whose parent has reserved new merchant business in South and Central India for a sister company it owns outright, and whose public shareholders vote against the board. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}); the DCF is ₹${n0(mv('dcf').value)}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Linde plc merges Praxair India into Linde India, or compensates it for the allocation', 'Low-medium', 'Supreme Court outcome; SEBI action on the valuer\'s report; any group restructuring'],
      ['A delisting or open offer by the parent', 'Low', 'Parent statements; the 75% cap means any increase needs an offer'],
      ['Plants start early and merchant prices stay high: Gases EBITDA margin near 38%', 'Medium', 'Gases segment margin each quarter; commissioning news'],
      ['PED margins hold near FY26\'s 31% on external work', 'Low-medium', 'PED segment result vs external revenue'],
      ['Better disclosure (volumes, project returns, calls)', 'Low', 'Next AGM presentation'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['SEBI acts on the valuation report (penalties, directions on directors, restrictions)', 'Medium', 'Sentiment; possible restrictions on dealings with Praxair India'],
      ['Plant start-ups slip a year; steel capex slows', 'Medium', 'FY28E EPS 10-15% below ours'],
      ['Merchant liquid prices fall as INOX, Air Liquide and Air Water add capacity', 'Medium', 'Gases margin back to ~33%; bear case'],
      ['Multiple compresses towards listed gas peers (~40x)', 'Medium', `Bear case {{scen.bear.tp|inr}}`],
      ['PED cost overruns on fixed-price projects', 'Low-medium', 'One-off losses; the auditor already flags cost-to-complete estimates'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Price levels:** at our target the rating would become HOLD below ~₹${n0(sellAbove)} and BUY below ~₹${n0(buyBelow)}.`,
      `**This is a valuation call, with a risk we cannot model:** the stock has traded above 100x forward earnings for most of the last three years (median ${n1(H.med)}x), and a corporate action by Linde plc could re-price it overnight. Investors who own it for that option should size it as an option, not as a compounder.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'P/E on FY28E', v: `${n1(peFY28)}x`, d: `our target multiple ${peMult}x` },
      { k: 'Underlying EPS, FY24-FY26', v: '₹51 → ~₹52', d: 'flat for three years' },
      { k: 'Capex, FY25-26', v: '₹2,097 cr', d: 'cash fell from ₹980 cr to ₹112 cr' },
      { k: 'Public votes against (Mar-2026 EGM)', v: `${n1(RP.egm2026.againstPct)}%`, d: 'Praxair India dealings' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Air separation unit (ASU)', 'A plant that cools air until it liquefies and separates it into oxygen, nitrogen and argon.'],
      ['TPD', 'Tonnes per day of gas a plant can produce.'],
      ['On-site / tonnage', 'A gas plant built at a customer\'s site and dedicated to it, usually on a 15-20 year contract.'],
      ['Merchant / bulk', 'Liquid gas delivered by cryogenic tanker to many customers.'],
      ['Packaged', 'Gas sold in cylinders.'],
      ['LOX, LIN, LAR, LMO', 'Liquid oxygen, liquid nitrogen, liquid argon, liquid medical oxygen.'],
      ['Take-or-pay', 'A contract where the customer pays a minimum (facility fee) whether or not it takes the gas.'],
      ['De-captivation', 'A steel maker selling or outsourcing its own (captive) ASUs to a gas company, which then supplies it.'],
      ['BOO', 'Build-own-operate: the gas company owns and runs the plant at the customer\'s site.'],
      ['HyCO', 'Hydrogen and carbon monoxide, used in refineries and chemicals.'],
      ['PED', 'Project Engineering Division: designs and builds ASUs and nitrogen plants.'],
      ['Inter-segment revenue', 'Plants PED builds for Linde India\'s own Gases business; removed from reported revenue.'],
      ['Percentage of completion', 'Booking project revenue in proportion to cost incurred against total estimated cost.'],
      ['Related-party transaction (RPT)', 'A deal between the company and its parent, sister companies, joint ventures or directors.'],
      ['Business allocation', 'The 2020 agreement dividing future business between Linde India and Praxair India by region and product.'],
      ['SEBI / SAT', 'Securities and Exchange Board of India / Securities Appellate Tribunal (hears appeals against SEBI).'],
      ['Qualified opinion', 'An audit opinion that the accounts are fair except for a specified matter.'],
      ['P/E, EV/EBITDA', 'Share price ÷ EPS; enterprise value (market value plus net debt) ÷ operating profit before depreciation.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@Dec19': '−20%: South Region business (Bellary ASU, Hyderabad and Chennai cylinder stations) sold to Air Water India in Dec-2019 on CCI orders; Ind AS 115 adopted.',
  'pat@Dec19': 'Includes ₹611 cr of exceptional gains after tax (₹841 cr pre-tax gain on the South Region sale).',
  'pat@Dec18': '+63% from a tiny base (₹26 cr): interest (₹103 cr) and depreciation (₹199 cr) absorbed most of EBITDA.',
  'ebitdaMargin@Dec19': '+870bp after the CCI-ordered South Region sale; Gases segment PBIT margin rose from 9% (CY18) to 19%.',
  'pat@Dec20': '−79%: CY19 included ₹611 cr of exceptional gains; profit before exceptional items rose from ₹122 cr to ₹150 cr.',
  'sales@Dec20': '−16%: full year without the South Region business; Covid lockdowns.',
  'sales@Dec21': '+44%: recovery; PED revenue ₹451 cr; medical oxygen demand in the second Covid wave.',
  'pat@Dec21': 'Includes ~₹226 cr of exceptional gains after tax (Bellary Oxygen JV sold its 855 tpd ASU to JSW Steel).',
  'sales@FY23': '15 months (Jan-2022 to Mar-2023): year-end moved to March. PED external revenue ₹921 cr.',
  'sales@FY24': 'Not comparable with the 15-month FY23; PED external revenue ₹768 cr; Dahej 250 tpd ASU commissioned.',
  'sales@FY25': '−10%: PED external revenue fell to ₹445 cr; Gases +2%.',
  'ebitdaMargin@FY25': '+540bp: less low-margin project revenue; merchant liquid pricing; Ludhiana ASU.',
  'cfo@FY25': 'Capex ₹1,331 cr (Tata Kalinganagar ASUs, advances) took free cash flow to −₹747 cr; cash fell from ₹980 cr to ₹147 cr.',
  'ebitda@FY26': 'Includes a ₹90 cr reversal of liabilities (Q2FY26, Gases); ~₹819 cr without it.',
  'ebitdaMargin@FY26': '+510bp reported; ~+160bp without the ₹90 cr reversal (merchant volumes, lower power cost).',
  'pat@FY26': '+21% reported; ~₹444 cr underlying after removing the reversal and ~₹49 cr from the Bellary Oxygen JV (Q3FY26).',
  'sales@Q3FY26': '+16% YoY: PED external revenue ₹157 cr (₹97 cr); Gases +7%.',
  'ebitda@Q2FY26': 'Includes the ₹90 cr reversal of liabilities ("change in certain contractual arrangements").',
  'otherIncome@Q3FY26': 'Includes ~₹51 cr share of profit from the Bellary Oxygen JV (being wound up).',
  'pat@Q4FY26': '−35% YoY: higher tax rate (33%), PED result only ₹13 cr.',
  'sales@Q1FY27': '+22% YoY: PED external revenue ₹150 cr (₹71 cr); Gases +9%.',
  'pat@Q1FY27': '−2% YoY: OPM 29% vs 34%; depreciation and finance cost higher.',
  'sales@FY27E': 'GAM: Gases +11% (new plants), PED external ~₹644 cr.',
  'eps@FY27E': 'GAM: −22% on FY26 one-offs, depreciation and interest; about 3% lower than FY26 underlying EPS.',
  'sales@FY28E': 'GAM: SAIL Rourkela and Electrosteel ASUs ramp up; Gases +12%.',
};

module.exports = { risks, glossary, statementNotes };
