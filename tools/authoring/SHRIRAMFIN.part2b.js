// Shriram Finance report, part 2b: industry (vehicle finance, macro, listed lenders) and the tailwind test.
const X = require('./SHRIRAMFIN.ctx');
const { n0, n1, pc, P, PEERS, shortName, Q1, ASOF_TXT, SG } = X;
const LEND = PEERS.filter(p => p.roe != null);
const QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q1FY26');
const g = k => pc((QN[k] / QO[k] - 1) * 100);

const industry = {
  id: 'industry', nav: 'Industry: vehicles and the rural economy', kicker: 'Industry', title: 'Vehicle finance: demand is strong after the GST cut, but the rural economy faces a weak monsoon and an oil shock',
  blocks: [
    { p: 'Shriram\'s business follows the truck cycle and the rural economy. Both were healthy going into FY27. Vehicle sales jumped after the GST rate cuts: in Q1FY27 (Apr-Jun 2026) commercial-vehicle sales rose 14.1% to 2.65 lakh units (heavy trucks +18.3%, light +20.8%), passenger vehicles +25.9%, two-wheelers +20.3%, tractors +21.6%, and construction equipment returned to growth (+8.8%) after four quarters of decline (Q1 call). Management said truck operators had passed higher fuel costs on to their customers and saw no idle vehicles: "If the utilization levels were a little lower, then sales would not have gone up by 20%".' },
    { p: 'The risks are macro. The West Asia war pushed up fuel and wholesale prices (WPI 9.87% in June), the RBI cut its FY27 growth forecast to 6.6% and raised its inflation forecast to 5.1%, keeping the repo rate at 5.25%. The IMD cut its monsoon forecast to 90% of normal as El Nino strengthened; rainfall was 24% below normal from 4-Jun to 16-Jul and ~12% below normal by late September. A poor harvest hits Shriram twice: rural borrowers repay less, and truckers carry less freight.' },
    { exhibit: { type: 'table', title: 'The operating backdrop on 30-Sep-2026', head: ['Indicator', 'Latest', 'What it means for Shriram'], wide: [2], rows: [
      ['Commercial-vehicle sales, Q1FY27', '+14.1% (2.65 lakh units)', 'New and used truck demand strong; CV AUM +19.4% YoY'],
      ['Passenger-vehicle sales, Q1FY27', '+25.9%', 'PV AUM +21.2% YoY'],
      ['Construction-equipment sales, Q1FY27', '+8.8% after four quarters of decline', 'CE book still shrinking (−25% YoY); Stage 3 7.1%'],
      ['RBI repo rate / CPI', '5.25% (neutral) / 4.38% in June; RBI forecast 5.1%', 'No rate cuts to help funding costs; risk of increases'],
      ['Monsoon', 'IMD forecast 90% of normal; ~12% below normal year to date (late Sep)', 'Rural cash flows and collections in Q2-Q3 are the main risk'],
      ['Fuel / West Asia', 'Prices up; operators passing costs on so far', 'A further fuel shock would squeeze small truck operators'],
    ], source: 'Q1FY27 call (24-Jul-2026); BusinessToday (30-Sep-2026); company AUM data' } },
    { p: `Among listed lenders Shriram is the second largest by market value (₹${(P.SHRIRAMFIN.mcapCr / 1e5).toFixed(2)} lakh crore on ${ASOF_TXT}) after Bajaj Finance, and the most valuable vehicle financier. Its FY26 returns sit in the middle of the pack: ROE ${n1(P.SHRIRAMFIN.roe)}% (below Bajaj Finance, Cholamandalam and Muthoot, well above M&M Financial and L&T Finance) and ROA ${n1(P.SHRIRAMFIN.roa)}% (above Cholamandalam: higher yields and less debt per rupee of assets). In new vehicles it competes with banks, captive and dealer-linked NBFCs (Cholamandalam, M&M Financial); in used trucks, its home turf, competition is thinner because the work is local and labour-intensive.` },
    { pair: [
      { type: 'hbar', title: 'ROE, FY26: Shriram mid-table among listed lenders', unit: 'Net profit ÷ average net worth, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROE', values: LEND.map(p => Math.round(p.roe * 10) / 10), fmt: 'pct' }], labels: 'all', highlight: 'Shriram Finance', source: 'Screener.in (consolidated), GAM Research' },
      { type: 'hbar', title: 'ROA, FY26: high for a vehicle lender', unit: 'Net profit ÷ average total assets, FY26 (%)', x: LEND.map(p => shortName(p.symbol)), series: [{ name: 'ROA', values: LEND.map(p => Math.round(p.roa * 100) / 100), fmt: 'n2' }], labels: 'all', highlight: 'Shriram Finance', source: 'Screener.in (consolidated), GAM Research' },
    ] },
    { callout: '**Our view:** demand is not Shriram\'s constraint; it grows 15-20% whenever trucks sell. The constraints are the rural economy (a weak monsoon in 2026 is the near-term test), credit discipline in the newer books (MSME, gold, personal loans) and price: as funding gets cheaper, it is choosing to compete for new-vehicle borrowers, where yields are lower.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Does the tailwind reach Shriram?', title: 'Tailwind test: which trends actually lift Shriram\'s returns?',
  blocks: [
    { p: 'A trend only matters to a shareholder if the company turns it into profit per share. We score each one.' },
    { verdicts: [
      ['Vehicle demand after the GST cut', 'Yes', `CV and PV sales +14-26% in Q1FY27; Shriram's CV AUM ${g('cv')}, PV ${g('pv')}, disbursements +19.5%.`, 'Drives our 17-18% AUM growth.'],
      ['Cheaper funding (AAA ratings, MUFG)', 'Partly', `Incremental borrowing cost 7.77% vs 8.56% on the book; but management is passing part of it to new-vehicle borrowers and guides NIM back to ~8.5% over 2-3 years.`, 'Cost of funds falls ~30bp in our model; yields fall too.'],
      ['Equity in place of debt', 'Partly', '₹39,618 cr of equity cut interest costs by ~₹500 cr in Q1 alone.', 'Lifts profit, but per share and per rupee of equity returns fall (ROE ~13%).'],
      ['Gold-price boom', 'Partly', `Gold loans ${g('gold')} YoY but only ${n1(QN.gold / QN.total * 100)}% of AUM; Stage 3 in gold rose to 2.57% from 2.06%.`, 'Small; target is 5% of AUM in three years.'],
      ['Infrastructure spending', 'No', `Construction-equipment AUM ${g('ce')} YoY; Stage 3 7.1% and rising.`, 'Still a drag; management expects growth from Q2.'],
      ['MSME formalisation and credit', 'Partly', `MSME AUM ${g('msme')} after a cautious FY26 (US tariffs); expanding beyond the South; Stage 3 5.2% (4.1% a year ago).`, 'Higher yield, higher losses; target 20% of AUM.'],
      ['Rural economy and monsoon', 'No', 'Monsoon forecast 90% of normal, El Nino; rainfall ~12% short by late September.', 'The main near-term risk to collections; in our bear case.'],
      ['EVs and E20 fuel', 'Unclear', 'EV sales rising fast; questions over older cars\' durability on E20 (Q1 call).', 'Could weaken used-vehicle values over 5-6 years; not in our numbers.'],
    ], head: ['Trend', 'Helps?', 'Evidence', 'So what'], title: 'Tailwind scorecard: demand and funding help; the rural cycle and mix push back', source: 'Q1FY27 investor update and call; GAM Research' },
    { callout: '**Our view:** the biggest change in FY27, the MUFG money, is a balance-sheet tailwind, not an operating one. It makes Shriram safer and lets it grow faster, but each rupee of it earns only the ~8.6% interest it replaces until it is lent out with more debt on top. The operating tailwinds (vehicle demand, cheaper funding) are real but partly competed away; the headwinds (monsoon, mix, sticky Stage 3) are cyclical. That is why we forecast ROE of 13-14%, not a return to 17-18%, through FY29E.' },
  ],
};

module.exports = { industry, tailwind };
