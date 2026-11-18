// Bayer CropScience report, part B (extra): risks & honest summary, glossary, statement notes.
const S = require('./BAYERCROP.research');
const { F, A, b, n0, n1, price, cashNow, divYield, rating, buyBelow, sellAbove, ruleText, RP, TX, A21, A25, cornCagr, cpCagr } = S;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good franchise at a fair-to-cheap price, bought for the multiple, not the growth',
  blocks: [
    { callout: `**What you are buying:** India's leading corn-seed breeder (DEKALB), first access to Bayer's new crop-protection chemistry, premium brands, no debt, ₹${n0(cashNow)} cr of cash at the March peak, ROE ~24% and a ~${n1(divYield)}% dividend yield on our FY27E payout.` },
    { callout: `**What you are paying:** ${n1(price / F.eps[1])}x our FY28E EPS, against a 31.7x forward median since 2021, for a company growing ~6-7% a year whose crop-protection book only keeps pace with the market and whose margin depends on its parent's transfer prices. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}), just above our +15% BUY line; the DCF says the price is roughly fair. This is a low-conviction BUY.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['A normal rabi despite El Niño, and a normal 2027 monsoon', 'Medium', 'Rabi sowing, reservoir levels, IMD forecast for 2027'],
      ['Corn keeps growing at ~15% with new states and hybrids', 'Medium', 'Corn share in the annual report; seed-grower payments'],
      ['Local sourcing lifts the margin towards 18%', 'Medium', 'Purchases from Bayer AG; gross margin each half-year'],
      ['New molecules (Plenexos, Xivana Smart) launched at scale', 'Low-medium', 'Registrations and launch commentary at the next investor meet'],
      ['GM or short-stature corn approved', 'Low', 'Government policy on GM crops'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['El Niño hurts the rabi and the 2027 kharif', 'Medium', 'FY27-28E EPS 10-15% below ours; multiple towards 19x'],
      ['Transfer prices or currency raise the cost of goods again (as in FY25)', 'Medium', 'Margin back to 13%; EPS −20%'],
      ['Dealer credit losses return in a bad season', 'Medium', 'ECL charges of ₹50-80 cr (FY25: ₹78 cr)'],
      ['The agricultural-income tax exemption is lost', 'Low', `Tax rate up ~5 points (~₹${n0(-TX.fy26.agriIncomeTaxEffect)} cr a year) plus ₹233 cr of past demands`],
      ['Glyphosate restricted; US corn imports or GM rules hurt seed demand', 'Low-medium', 'Revenue loss in Roundup and corn'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The call is close to the line:** at our target the rating would turn to HOLD above ~₹${n0(buyBelow)} and to SELL above ~₹${n0(sellAbove)}. A small cut to our earnings or multiple would also make it a HOLD.`,
      '**Biggest swing factors:** the rabi season under El Niño (near term) and the margin the parent leaves in India through transfer prices and sourcing (long term).',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Corn seed growth, FY21-25', v: `~${Math.round(cornCagr)}% a year`, d: `crop protection ex-Roundup ~${Math.round(cpCagr)}%` },
      { k: 'Purchases from Bayer AG, FY26', v: `₹${n0(RP.purchasesFromBayerAG)} cr`, d: `₹${n0(RP.purchasesFromBayerAGFY25)} cr in FY25` },
      { k: 'Dividend, FY26', v: '₹150 a share', d: `~${Math.round(150 / A.eps[b] * 100)}% of EPS` },
      { k: 'Forward P/E', v: `${n1(price / F.eps[1])}x`, d: 'median since 2021: 31.7x' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Crop protection / agrochemicals', 'Insecticides, herbicides (weedkillers), fungicides and other products that protect crops.'],
      ['Hybrid seed', 'Seed from crossing two parent lines; it yields more but farmers must buy new seed every season.'],
      ['Germplasm', 'The stock of plant genetic material a breeder uses to develop new hybrids.'],
      ['DEKALB / Xellano', 'Bayer\'s corn-seed brands in India.'],
      ['Roundup / glyphosate', 'A non-selective weedkiller (glyphosate) sold by Bayer as Roundup.'],
      ['Technical / formulation', 'Technical = the pure active ingredient; formulation = the product mixed for farmers to spray.'],
      ['Generic', 'A molecule whose patent has expired; many companies can make it, so it competes on price.'],
      ['Kharif / rabi', 'India\'s monsoon (June-October) and winter (November-March) cropping seasons.'],
      ['El Niño', 'A warming of the Pacific Ocean that often weakens India\'s monsoon and raises drought risk.'],
      ['Direct-seeded rice (DSR)', 'Sowing rice seed directly in the field instead of transplanting seedlings; saves water and labour but needs better weed control.'],
      ['Transfer price', 'The price at which a subsidiary buys from (or sells to) its parent group.'],
      ['Related-party transaction', 'A deal between the company and its parent, group companies or directors.'],
      ['Agricultural income', 'Income from farming (here, producing seed), exempt from Indian income tax.'],
      ['ECL', 'Expected credit loss: a provision for dealer bills that may not be paid.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ operating profit before depreciation.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY20': '+14%: Monsanto India (DEKALB corn seed, Roundup) merged into the company in Sep-2019.',
  'pat@FY20': 'Includes a ₹96 cr after-tax exceptional charge (Screener).',
  'sales@FY21': '+18%: good monsoon; corn ₹514 cr, crop protection ex-Roundup ₹2,904 cr.',
  'pat@FY22': '+31%: includes ₹44 cr of exceptional gains after tax (Screener); glyphosate shortage lifted "Others".',
  'pat@FY23': 'Record ₹758 cr incl. ₹80 cr of exceptional gains after tax (Screener).',
  'sales@FY24': '−1%: global destocking and Chinese price cuts; corn +19%.',
  'ebitdaMargin@FY25': '−620bp: input costs up, prices capped by Chinese generics, ₹78 cr receivable provision, restructuring costs.',
  'pat@FY25': '−23%: EPS ₹126; dividend held at ₹125.',
  'cfo@FY25': 'Inventory up ₹821 cr.',
  'sales@FY26': '+4%: corn ~19% of turnover; Q2 −11% on excess rain.',
  'ebitdaMargin@FY26': '+280bp: input costs stabilised; purchases from Bayer AG ₹1,341 cr (₹2,421 cr in FY25).',
  'cfo@FY26': 'Inventory released, payables up: ₹1,078 cr.',
  'sales@Q2FY26': '−11% YoY: relentless rain, missed sprays; Bayer avoided overloading dealers.',
  'ebitda@Q3FY25': 'Margin 1.9%; FY25 carried ₹78 cr of receivable provisions and restructuring costs (quarterly split not disclosed).',
  'otherIncome@Q1FY27': 'Includes ₹63.9 cr gain on selling the flubendiamide marketing rights to Tagros.',
  'sales@Q1FY27': '−4% YoY: late, weak monsoon; corn held up.',
  'sales@FY27E': 'GAM: −3%; deficient monsoon, El Niño risk to rabi, flubendiamide sold.',
  'otherIncome@FY27E': 'Includes the ₹63.9 cr Q1 one-off gain.',
  'sales@FY28E': 'GAM: normal monsoon; corn +13%, crop protection +7%.',
};

module.exports = { risks, glossary, statementNotes };
