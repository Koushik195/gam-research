// TVS Motor report, part 6c: risks and honest summary, glossary, statement notes.
const X = require('./TVSMOTOR.ctx');
const { V, n0, n1, price, rating, buyBelow, sellAbove, MULT, PB, SOTP, FM, fwdNow } = X;
const { ruleText } = require('../../src/ratings');

const risks = {
  id: 'verdict', nav: 'Risks & verdict', kicker: 'Summary', title: 'What you buy, what you pay, and what would change our mind',
  blocks: [
    { exhibit: { type: 'table', title: 'The honest summary', head: ['Question', 'Answer'], wide: [1], rows: [
      ['What you buy', 'India\'s best-executing two-wheeler maker: share gains every year since FY21, #1 in EVs, a fast-growing export business, ~86% of a 16%-ROE lender. Also a set of overseas subsidiaries that lose ~₹1,300 cr a year.'],
      ['What you pay', `₹${n0(price)}: ${n1(fwdNow)}x our FY28E standalone EPS (median since 2021: ${n1(FM.median)}x), ~49x trailing standalone EPS (twelve months to Jun-26) and ~65x FY26 consolidated EPS (₹63.5).`],
      ['What the price assumes', 'That ~20% EPS growth lasts well beyond FY28 and that the market keeps paying a peak multiple; that TVS Credit is worth ~2x book and Norton costs nothing.'],
      ['Our value', `{{dcf.tp|inr}} = ${MULT.base}x Sep-28E standalone EPS (₹${n0(SOTP.base.standalone)}) + TVS Credit at ${PB.base}x book (₹${n0(SOTP.base.tvsCredit)}) − other subsidiaries (₹${n0(-SOTP.base.others)}).`],
      ['Rating', `**${rating}** ({{dcf.upside|chg}}). ${ruleText} At our target, the stock would be a BUY below ₹${n0(buyBelow)} and a SELL above ₹${n0(sellAbove)}.`],
    ], source: 'GAM Research' } },
    { h: 'Risks to our SELL (what could make the stock go up)' },
    { bullets: [
      '**Growth stays at 20%+ for longer:** if FY28-29E volumes grow 15% rather than 8-10% and margins reach 14%, EPS would be ~15% above ours; our bull case ({{scen.bull.tp|inr}}) roughly matches today\'s price.',
      `**TVS Credit separation:** a listing at the July-2026 deal multiple (${PB.bull}x book) would show ~₹${n0(SOTP.bull.tvsCredit)} a share; at a market premium it could be more.`,
      '**Norton works:** if the four new models sell well in Europe, India and the US, the subsidiary losses could fall faster than we assume and Norton could be worth something.',
      '**PLI renewal or a new EV incentive** would keep ~0.6-0.9% of revenue in the margin after FY28 (~+5% to FY29E EPS).',
      '**The premium persists:** quality compounders in India have kept high multiples for long periods; TVS traded at 37x+ forward in FY17-20.',
    ] },
    { h: 'Risks to the business (what could make it worse than our base)' },
    { bullets: [
      '**Demand after the GST bump:** from Q3FY27 the comparison base includes the post-GST surge; an El Niño year could hit rural demand.',
      '**Margins:** commodity costs (3-5% of revenue in H1FY27) and EV price competition; the PLI ends in Mar-2028.',
      '**Capital allocation:** more money into Norton, e-bikes or new ventures (management: "some new investments will be there").',
      '**EV policy and supply:** subsidies are small and time-bound; rare-earth magnets remain a single-country supply risk; a Delhi ICE ban would favour EV leaders but disrupt ICE volumes.',
      '**Credit cycle at TVS Credit:** ~4% credit cost on a largely unsecured book; a downturn would hit both the lender and TVS sales.',
    ] },
    { callout: `**How we would act.** At ₹${n0(price)} we would sell or underweight: the business is excellent but the price already discounts several years of outperformance and ignores the subsidiary drag. We would turn more positive on (1) a price nearer ₹${n0(buyBelow)}, (2) evidence that Norton and the e-bike group are cutting losses, or (3) a clean separation of TVS Credit that returns its value to shareholders.` },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [{ exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'Meaning'], wide: [1], rows: [
    ['2W / 3W', 'Two-wheelers (motorcycles, scooters, mopeds) / three-wheelers (auto-rickshaws, cargo carriers).'],
    ['ICE', 'Internal combustion engine: petrol (or CNG) vehicles, as opposed to electric (EV).'],
    ['Standalone vs consolidated', 'Standalone = TVS Motor Company alone (Indian operations); consolidated adds TVS Credit, Norton, PT TVS and the other subsidiaries.'],
    ['EBITDA / EBITDA margin', 'Operating profit before depreciation, interest and tax / as a % of revenue.'],
    ['EPS; P/E', 'Earnings per share; share price ÷ EPS. One-year-forward P/E uses the next full fiscal year\'s EPS.'],
    ['Sep-28E EPS', 'Half of FY28E plus half of FY29E: the earnings the market looks at in September 2027, our 12-month target date.'],
    ['SOTP', 'Sum of the parts: each business valued separately and added up.'],
    ['P/B; book value', 'Price ÷ book value (net worth) per share; the usual yardstick for lenders like TVS Credit.'],
    ['ROE / ROA', 'Return on equity / on assets: profit ÷ average equity / average assets (or loan book).'],
    ['NBFC; AUM; Stage 3', 'Non-bank finance company; assets under management (loan book); loans more than 90 days overdue.'],
    ['PLI', 'Production-Linked Incentive: a government payment to approved makers of advanced-technology and electric vehicles, as a % of eligible sales; scheme ends 31-Mar-2028.'],
    ['PM E-DRIVE', 'Central subsidy for electric vehicles; for e-2W ₹2,500/kWh capped at ₹5,000 per vehicle, to Mar-2028.'],
    ['GST 2.0', 'The September-2025 rate cut: two-wheelers up to 350cc from 28% to 18%, above 350cc to 40%.'],
    ['NCRPS', 'Non-convertible redeemable preference shares: TVS issued 4 per equity share (₹40/share) as a bonus in Sep-2025, repaid on 1-Sep-2026; treated as debt.'],
    ['Vahan / SIAM / FADA', 'Government vehicle-registration database (retail); manufacturers\' body (factory dispatches); dealers\' body (retail).'],
    ['DCF; WACC; Ke', 'Discounted cash flow; weighted average cost of capital; cost of equity.'],
    ['De-rating', 'A fall in the multiple investors pay; we measure it as peers\' P/E today vs their five-year median.'],
    ['PV of losses to breakeven', 'Present value of the losses a start-up business is expected to make before it breaks even; used instead of a multiple for loss-making subsidiaries.'],
  ], source: 'GAM Research' } }],
};

const statementNotes = {
  'sales@FY26': 'Volumes +24% to 5.89mn (domestic 2W +21%, exports +33%, EV +33%, 3W +63%); revenue per vehicle +5% on EV, export and premium mix; GST cut from 22-Sep-2025 lifted H2; PLI booked through the year (FY25 booked it in Q4).',
  'ebitda@FY22': 'Post-COVID recovery: revenue +24%, margin 8.5% → 9.4% on operating leverage and price increases despite commodity inflation.',
  'ebitda@FY23': 'Revenue +27% (EV volumes 11k → 97k, premium motorcycles), margin 9.4% → 10.1%.',
  'ebitda@FY26': 'Revenue +30% and margin +60bp to 12.9% (scale, mix, PLI); commodity inflation only began to bite in Q4FY26.',
  'ebitdaMargin@FY25': 'Material cost fell from 74% to 71% of sales; FY25 PLI recognised (government grants ₹488 cr in revenue); premium and export mix.',
  'dep@FY22': 'New products and capacity; higher amortisation of capitalised R&D.',
  'pat@FY22': 'EBITDA +37% with lower interest cost; exceptional charge ₹27 cr.',
  'pat@FY23': 'EBITDA +36%; other income back to +₹101 cr (−₹11 cr in FY22); exceptional gain ₹25 cr.',
  'capex@FY25': 'Capex up to ₹1,798 cr for EV and premium products and capacity; R&D spend ₹1,025 cr (₹645 cr in FY24).',
};

module.exports = { risks, glossary, statementNotes };
