// Kansai Nerolac report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./KANSAINER.ctx');
const { D, F, V, n0, n1, price, cashMar26, cashPerShare, peFY28, peExCash, divYield, rating, ruleText, buyBelow, sellAbove, multForBuy, peMult, epsSep28, HA, UE, landGains, BL, mv } = X;
const BO = D.industry.birlaOpus;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a value stock with a value trap inside it',
  blocks: [
    { callout: `**What you are buying:** India's automotive-paint leader (~61% OEM share) and powder-coatings leader, with Kansai Paint's technology behind it, attached to a decorative business that is losing ground; no debt, ₹${n0(cashMar26)} cr of cash and investments (₹${n0(cashPerShare)} a share net), a ~${n1(divYield)}% dividend yield and an ROE of ~10%.` },
    { callout: `**What you are paying:** ${n1(peFY28)}x our FY28E EPS (~${n1(peExCash)}x after net cash), against ${n1(HA.med)}x on average since 2021 on underlying earnings and 43-47x for Asian Paints and Berger. On the street's method and our inputs the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}), but the DCF (₹${n0(mv('dcf').value)}) says the price is roughly fair. The case is a partial re-rating as industrial grows to ~58% of sales, not a turnaround in decorative.` },
    { p: '**Value or trap?** A value trap is a stock that looks cheap because its earnings are about to shrink. Nerolac\'s are not: we expect ~11% EPS growth a year to FY29E from price, auto and industrial. But the decorative half has the hallmarks of a trap: three years of no growth, two richer rivals adding capacity, and a management goal of holding share rather than winning it. The cheap multiple is partly deserved. We think the market is pricing the whole company as if it were all decorative; that gap is the opportunity, and it is not large.' },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Decorative volume growth back to market level (high single digit) without margin loss', 'Low-medium', 'Quarterly decorative volume commentary; dealer additions; Birla Opus growth'],
      ['Industrial keeps growing double digit as auto, powder and resin capacity comes on stream', 'Medium', 'Auto production after the GST base effect; capex progress; non-auto share gains'],
      ['Margin reaches the 13-14% guidance on a consolidated basis', 'Medium', 'Gross margin; price pass-through to OEMs; Bangladesh losses'],
      ['A buyback, higher payout or a decision on decorative by the parent', 'Low', 'Board and Kansai Paint announcements; the next India strategy briefing'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      [`Birla Opus (target ₹10,000 cr of paint revenue, break-even by FY28E) and JSW Dulux keep spending on dealers and price`, 'High', 'Decorative flat or down; margin back to 11-11.5%; bear case {{scen.bear.tp|inr}}'],
      ['Auto output slows sharply once the post-GST surge is in the base (from Oct-2026); OEMs resist price rises', 'Medium', 'Industrial growth halves: FY28E EPS ~3-5% below ours (GAM rough estimate)'],
      ['Crude and the rupee spike again (West Asia)', 'Medium', 'Gross margin down again for a quarter or two (Q1FY27: −110bp); industrial price lag'],
      ['Treasury income falls with rates, or cash is spent on an acquisition', 'Low-medium', 'Other income is ~15% of pre-exceptional profit'],
      ['Bangladesh needs more money', 'Medium', 'Small (revenue ₹91 cr, loss ₹28 cr in FY26)'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**Where the rating would change:** at our target the rating would turn to HOLD above ~₹${n0(buyBelow)} and to SELL above ~₹${n0(sellAbove)}. On our Sep-28E EPS of ₹${n1(epsSep28)}, any multiple below ~${n1(multForBuy)}x (instead of our ${peMult}x) would also make it a HOLD.`,
      '**Biggest swing factors:** how fast decorative loses share to Birla Opus and JSW Dulux (long term) and the auto cycle after the GST-cut surge (near term).',
      '**Portfolio fit:** a cheap, cash-rich way to own India\'s auto-paint leader with some re-rating potential; not a quality compounder and not a decorative recovery play. Size it accordingly.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Auto OEM paint share, FY24', v: '~61%', d: '58% in FY22' },
      { k: 'Decorative share of revenue', v: '~45%', d: '~55% in FY24 (management)' },
      { k: 'Birla Opus revenue, Q1FY27', v: `₹${n0(BO.q1fy27RevenueCr)} cr`, d: `+${BO.q1fy27GrowthPct}% YoY; Nerolac total ₹2,374 cr` },
      { k: 'EPS before exceptional items', v: `₹${n1(UE.FY24)} / ${n1(UE.FY25)} / ${n1(UE.FY26)}`, d: 'FY24 / FY25 / FY26: flat' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Decorative paint', 'House paint for walls, wood and metal in homes and buildings, sold through dealers to painters and owners.'],
      ['Industrial coatings', 'Paint sold to manufacturers and projects: automotive, powder, general industrial and protective (performance) coatings, auto refinish.'],
      ['OEM', 'Original equipment manufacturer: here, vehicle makers who paint cars and bikes on the assembly line.'],
      ['Powder coating', 'Dry paint powder applied electrostatically and baked; used on appliances, furniture, auto parts. No solvents.'],
      ['CED (electrocoat)', 'The first anti-corrosion coat on a car body, applied by electric deposition in a dip tank.'],
      ['Auto refinish', 'Paint used by body shops to repair vehicles.'],
      ['Emulsion; economy / premium / super-premium', 'Water-based wall paint; price tiers from cheapest to most expensive.'],
      ['Waterproofing, construction chemicals', 'Coatings and additives that stop leaks and protect concrete (Nerolac\'s Perma range).'],
      ['Projects business', 'Selling paint directly to builders, government and institutions rather than through dealers.'],
      ['Price vs volume growth', 'Revenue growth split into higher prices and more litres sold; "value growth" includes both.'],
      ['Gross margin', 'Revenue less material costs, as % of revenue.'],
      ['Exceptional items', 'One-off gains or charges (land sales, impairments, Wage Code costs) shown separately in the accounts.'],
      ['Impairment', 'Writing down an asset (here, investments in subsidiaries) because it is worth less than its book value.'],
      ['Minority (non-controlling) interest', 'The part of a subsidiary owned by outside partners (45% of the Bangladesh unit).'],
      ['Royalty', 'A fee paid to the parent for using its technology and brands.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; enterprise value (market value less net cash) ÷ operating profit before depreciation.'],
      ['Forward P/E', 'Price ÷ the next full year\'s EPS.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['De-rating', 'A fall in the multiple investors pay for the same earnings.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY18': '+15% as reported (Screener); drivers before FY21 were not analysed for this initiation.',
  'sales@FY19': '+16% as reported (Screener); drivers before FY21 were not analysed for this initiation.',
  'ebitdaMargin@FY16': 'As reported (Screener); not analysed for this initiation.',
  'ebitdaMargin@FY17': 'Peak margin of the decade (18.2%), as reported; not analysed for this initiation.',
  'ebitdaMargin@FY19': 'As reported (Screener); not analysed for this initiation.',
  'pat@FY16': 'Includes ~₹428 cr of exceptional gains after tax (Screener).',
  'pat@FY17': '−44%: the FY16 base included the exceptional gain; profit before exceptionals was flat at ~₹473 cr (Screener).',
  'pat@FY22': '−32%: margin collapse on raw-material inflation; EPS before exceptionals ₹4.3 (₹6.4 in FY21).',
  'pat@FY23': '+32%: revenue +18% on price rises; margin 10.8% (10.2%).',
  'ebitdaMargin@FY24': '+2.3 pts: input costs eased after the FY22-23 spike; some of the gain was passed back in price cuts during FY24 (Q2FY25 call).',
  'otherIncome@FY16': 'Includes a ₹542 cr exceptional gain (Screener; profit ₹902 cr).',
  'capex@FY19': 'Capacity build-out: ₹1,113 cr of capex in FY18-20.',
  'sales@FY20': '−3%: demand slowdown; Covid lockdown from late March 2020.',
  'sales@FY21': '−4%: Covid lockdown in Q1FY21.',
  'sales@FY22': '+26%: recovery plus price rises to pass on a raw-material spike.',
  'ebitdaMargin@FY22': '−680bp: raw-material costs rose faster than prices.',
  'cfo@FY22': '₹25 cr: inventory up ₹432 cr at peak input prices.',
  'sales@FY23': '+18%: price rises carried through the year.',
  'otherIncome@FY24': 'Includes ₹661 cr pre-tax gain on selling the Kavesar (Thane) property (Screener books exceptionals in other income).',
  'pat@FY24': '₹1,185 cr incl. ~₹529 cr of exceptional gains after tax; EPS before exceptionals ₹8.1. 1:2 bonus in the year.',
  'otherIncome@FY25': 'Includes ₹665 cr gain on the Lower Parel land sale less ₹36 cr of subsidiary impairments (consolidated exceptional ₹630 cr).',
  'pat@FY25': 'EPS before exceptional items ~₹8.0 (reported ₹14.1).',
  'ebitdaMargin@FY25': '−120bp: mix shift to industrial, raw-material inflation in H1, decorative weakness.',
  'otherIncome@FY26': '₹146 cr of other income less ₹63 cr of exceptional charges (Wage Code ₹45 cr, Ghaziabad warehouse fire ₹13 cr, Bangladesh impairment ₹6 cr).',
  'pat@FY26': '−48%: no land gain. EPS before exceptional items ₹7.9.',
  'cfo@FY26': '₹894 cr: inventory down ₹135 cr and payables up ₹64 cr.',
  'otherIncome@Q3FY25': 'Includes the Lower Parel land gain (₹665 cr) less impairments.',
  'pat@Q3FY25': '₹681 cr incl. the land gain; ~₹187 cr before exceptionals (Screener).',
  'opm@Q2FY25': '10.9%: mix moved to industrial; material cost 66% of revenue.',
  'otherIncome@Q3FY26': 'Includes a −₹45 cr Wage Code charge (exceptional).',
  'sales@Q1FY27': '+9.8%: ~5% price; decorative value high single digit (volume low single digit), industrial double digit.',
  'opm@Q1FY27': '13.8%: material cost up 110bp to 65.0%, offset by lower overheads.',
  'sales@FY27E': 'GAM: +10.2%: price (~7-8%) plus industrial volume.',
  'ebitdaMargin@FY27E': 'GAM 12.4%: below the 13-14% guidance.',
  'capex@FY27E': 'Normal ₹150-200 cr plus the ₹601 cr expansion phased over FY27-29E.',
  'sales@FY28E': 'GAM: +7.2%: decorative +5%, industrial +9%.',
};

module.exports = { risks, glossary, statementNotes };
