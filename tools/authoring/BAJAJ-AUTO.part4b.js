// Bajaj Auto report, part 4b: risks & honest summary, glossary, statement notes.
const X = require('./BAJAJ-AUTO.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, n0, n1, price, SOTP, CORE, SAPE, SAEPS, SAF, rating, buyBelow, sellAbove, SH } = X;
const S = SOTP.base;
const perPp = SAF.base[1].rev * 0.01 * (1 - 0.252) / SH; // Rs/share of FY28E standalone EPS per 1pp of margin

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a quality franchise at a full price; ${rating} at ${n1(price / S.eps)}x Sep-28E standalone EPS`,
  blocks: [
    { callout: `**What you are buying:** India's most profitable two- and three-wheeler maker and its biggest vehicle exporter, with a real moat in emerging markets and three-wheelers, a growing and profitable EV business, ~₹20,000 cr of net cash outside the lender, a family owner that pays out most of its profit, plus a high-ROE captive lender and three-quarters of a recovering KTM.` },
    { callout: `**What you are paying:** ${n1(price / S.eps)}x Sep-28E standalone EPS (${n1((price - S.bacl - S.ktm) / S.eps)}x after taking out BACL and KTM at our values), above its ${n1(SAPE.med)}x median since 2021, at a time when margins are flattered by a ~10% weaker rupee and rising PLI income, and domestic motorcycle share is falling. On the street's method with our inputs the stock is worth {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. Our EPS is in line with the street; our multiple is not.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low-Medium', `The stock was at ₹${n0(price)} on 30-Sep-2026`],
      ['The Pulsar relaunch and new 125cc brands win back domestic share', 'Medium', 'Vahan registrations through the festive season and Q3FY27'],
      ['Exports hold 250k+ a month without a currency accident', 'Medium', 'Monthly sales; Nigeria after its early-2027 election; LatAm'],
      ['KTM reaches sustained profit sooner', 'Low-Medium', 'Bajaj Mobility H2 2026; free cash flow; covenants from Jun-2027'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Rupee strengthens while commodity inflation persists', 'Medium', `Each 1pp of standalone margin is ~₹${n1(perPp)} of FY28E EPS (~₹${n0(perPp * CORE.base)} a share at ${CORE.base}x)`],
      ['Export currency crisis (Nigeria 2023-24 repeat, or elsewhere)', 'Medium', 'Export volumes −20-40% in affected markets; FY23 export 2W fell 25%'],
      ['Domestic share keeps falling in 100-125cc', 'Medium-High', 'Domestic volumes flat while the market grows 5-7%'],
      ['PLI incentives end or shrink', 'Medium', '₹1,040 cr in FY26, ~9% of standalone EBITDA'],
      ['BACL credit losses rise in a rural or e-3W downturn', 'Low-Medium', 'Credit cost already ~3.9%; ₹16,000 cr of borrowings in the group'],
      ['KTM needs more money', 'Low-Medium', 'Net debt EUR827 m; covenants tighten from Jun-2027'],
      ['Auto sector de-rates further', 'Medium', `At the bear ${CORE.bear}x the SOTP is {{scen.bear.tp|inr}}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's target we would move to HOLD below ~₹${n0(sellAbove)}** (where the downside is under 5%) **and turn buyers below ~₹${n0(buyBelow)}**, or sooner if domestic share stabilises and margins hold above 20.5% after the rupee tailwind fades.`,
      `**Biggest swing factor:** the multiple. Each turn on the core is ~₹${n0(S.eps)} a share; the street's 23-25x versus our ${CORE.base}x is ₹${n0(5 * S.eps)}-${n0(7 * S.eps)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Exports, Apr-Aug 2026', v: '+50%', d: '12.7 lakh units; 44% of FY26 volume' },
      { k: 'Domestic motorcycle share', v: '15.6%', d: 'FY24 18.2%, FY25 16.6%' },
      { k: 'Standalone EBITDA margin, Q1FY27', v: '20.9%', d: 'Realised USD/INR 94.4 vs 85.6' },
      { k: 'Price ÷ Sep-28E standalone EPS', v: `${n1(price / S.eps)}x`, d: `median since 2021: ${n1(SAPE.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Standalone / consolidated', 'Standalone = Bajaj Auto Ltd on its own (the vehicle business, incl. exports and spares). Consolidated = the group incl. BACL, KTM (since Nov-2025), Brazil and other subsidiaries.'],
      ['2W / 3W / CV', 'Two-wheelers (motorcycles, scooters); three-wheelers (auto-rickshaws and small goods carriers, which Bajaj reports as "commercial vehicles").'],
      ['ICE / EV / e-3W L5 / L3', 'Internal-combustion engine / electric vehicle; L5 = electric autos (higher speed), L3 = e-rickshaws (low speed).'],
      ['Chetak', 'Bajaj\'s electric scooter brand.'],
      ['Vahan / wholesale', 'Vahan = government vehicle registrations (retail); wholesale = factory dispatches to dealers, which is what Bajaj reports monthly.'],
      ['Realisation', 'Revenue per vehicle sold. Export realisation depends on the dollar price and the rupee-dollar rate.'],
      ['GST', 'Goods and Services Tax; cut from 28% to 18% on motorcycles up to 350cc on 22-Sep-2025, raised to 40% above 350cc.'],
      ['PLI / PSI', 'Production-Linked Incentive (central government scheme rewarding advanced-technology vehicles such as EVs) / Package Scheme of Incentives (state government).'],
      ['BACL / NBFC / AUM', 'Bajaj Auto Credit Ltd, the captive non-bank lender; AUM = loans outstanding.'],
      ['BMAG / BAIH', 'Bajaj Mobility AG (formerly PIERER Mobility), KTM\'s listed parent; BAIH BV (Netherlands) and Bajaj Auto International Holdings AG are Bajaj\'s holding companies for it.'],
      ['Minorities', 'The ~25% of Bajaj Mobility owned by others; they share its losses and profits, so Bajaj\'s attributable profit differs from the consolidated total.'],
      ['Remeasurement gain', 'When Bajaj took control of KTM it had to revalue its old 49.9% stake to fair value; the gain (₹953 cr) is an accounting entry, not cash.'],
      ['P/E, EV/EBITDA, P/B', 'Price ÷ earnings per share; enterprise value (market value less net cash) ÷ EBITDA; price ÷ book value per share.'],
      ['SOTP', 'Sum of the parts: each business valued separately and added up.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Holding discount', 'A discount to the market value of a listed stake for illiquidity and the fact that the parent does not intend to sell.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '−7%: Covid lockdowns; exports held up better than domestic.',
  'sales@FY22': '+19%: exports at a record 2.5 mn units before the FY23 bust.',
  'otherIncome@FY22': 'Includes a ₹735 cr exceptional gain (Screener).',
  'sales@FY23': '+10%: domestic recovery offset an export collapse (export 2W −25%: Nigeria and other currency crises).',
  'ebitdaMargin@FY24': '+180bp to 19.5%: price, mix (3W, 150cc+) and lower commodities.',
  'sales@FY24': '+23%: domestic 2W +25% and 3W +54%; exports still down.',
  'otherIncome@FY25': 'After the −₹915 cr share of KTM\'s loss as an associate (moved here from expenses by our patch).',
  'pat@FY25': '−5%: KTM associate loss of ₹915 cr; standalone PAT +9%.',
  'sales@FY26': '+23%: standalone +17% (exports +21% in units) plus BACL (+212%) and six weeks of KTM (₹1,296 cr).',
  'ebitdaMargin@FY26': '−50bp to 19.4%: KTM\'s first six weeks lost money; standalone margin +30bp to 20.5%.',
  'otherIncome@FY26': 'Includes ₹561 cr net share of KTM as an associate (incl. ₹1,599 cr one-off gains) less ₹39 cr exceptional items.',
  'pat@FY26': '+47%: incl. ~₹1,599 cr of one-off gains on taking control of KTM; minorities absorbed ₹170 cr of KTM\'s loss.',
  'cfo@FY25': 'Negative: BACL\'s loan book grew ~₹9,000 cr inside operating cash flow.',
  'cfo@FY26': 'BACL\'s loans grew another ~₹9,000 cr; standalone FCF was >₹8,000 cr.',
  'sales@Q4FY26': '+41%: standalone +32% plus six weeks of KTM and BACL growth.',
  'opm@Q4FY26': '16%: KTM\'s first six weeks (loss before tax ₹872 cr incl. depreciation and interest).',
  'otherIncome@Q4FY26': 'Includes ₹1,195 cr net share of KTM as an associate: ₹953 cr remeasurement + ₹646 cr currency reserve − ₹413 cr loss + ₹9 cr.',
  'otherIncome@Q2FY26': 'After −₹634 cr share of KTM\'s Jan-Jun 2025 loss (moved here from expenses by our patch).',
  'sales@Q1FY27': '+65%: standalone +37% (volumes +29%, exports +54%), first full quarter of KTM, BACL +84%.',
  'opm@Q1FY27': '19%: standalone 20.9% despite ~4.5% commodity inflation; KTM line positive.',
  'pat@Q1FY27': '+46% to ₹3,226 cr attributable.',
  'sales@FY27E': 'GAM: standalone +24% (volumes +18.5%, exports +34%), full year of KTM (~₹14,000 cr), BACL +55%.',
  'ebitdaMargin@FY27E': 'GAM: standalone 20.6% (Q2 cost hit); KTM line ~9%; BACL after funding cost.',
  'pat@FY27E': 'GAM: no one-offs; KTM near break-even after minorities.',
  'sales@FY28E': 'GAM: standalone +11% (volumes +8.5%), KTM +14%, BACL +30%.',
};

module.exports = { risks, glossary, statementNotes };
