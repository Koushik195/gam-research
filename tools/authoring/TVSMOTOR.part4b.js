// TVS Motor report, part 4b: competitive advantage scorecard.
const X = require('./TVSMOTOR.ctx');
const { D, P, n1 } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong product and execution edge, but no cost moat',
  blocks: [
    { p: 'A moat is a lasting advantage that lets a company earn more than its cost of capital for longer than rivals. TVS has clear strengths in products, EVs and exports, and it has out-executed the market for five years. What it does not have is a cost or pricing advantage that shows up in margins: it earns about half of Bajaj\'s EBITDA margin and less than Hero\'s.' },
    { verdicts: D.moat, head: ['Source of advantage', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'Company, AR FY26, Vahan, Screener.in, Emkay (18-Aug-2026), GAM Research' },
    { pair: [
      { type: 'hbar', title: 'FY26 EBITDA margin: TVS is at the bottom of the listed 2W group', unit: 'EBITDA margin, FY26 (%)', x: ['Eicher Motors', 'Bajaj Auto', 'Hero MotoCorp', 'TVS Motor (standalone)'], series: [{ name: 'Margin', values: [P.EICHERMOT.ebitdaMargin, P['BAJAJ-AUTO'].ebitdaMargin, P.HEROMOTOCO.ebitdaMargin, P.TVSMOTOR.ebitdaMargin], fmt: 'pct' }], labels: 'all', highlight: 'TVS Motor (standalone)', source: 'Screener.in (consolidated for peers)' },
      { type: 'hbar', title: '…but the highest P/E by far', unit: 'Trailing P/E at the 30-Sep-2026 close (x)', x: ['TVS Motor', 'Eicher Motors', 'Maruti Suzuki', 'Bajaj Auto', 'Ashok Leyland', 'M&M (standalone)', 'Escorts Kubota', 'Hero MotoCorp'], series: [{ name: 'P/E', values: [P.TVSMOTOR.pe, P.EICHERMOT.pe, P.MARUTI.pe, P['BAJAJ-AUTO'].pe, P.ASHOKLEY.pe, P['M&M'].pe, P.ESCORTS.pe, P.HEROMOTOCO.pe], fmt: 'x' }], labels: 'all', highlight: 'TVS Motor', source: 'Screener.in, scaled to NSE closes' },
    ] },
    { callout: `**Verdict: a narrow moat, earned through execution.** TVS has the best product pipeline and the strongest EV and export positions among Indian two-wheeler makers, and it has gained share every year since FY21. But its returns rest on growth and negative working capital, not on unit profitability: EBITDA margin ${n1(P.TVSMOTOR.ebitdaMargin)}% vs ${n1(P['BAJAJ-AUTO'].ebitdaMargin)}% at Bajaj. An execution edge is real, but it is the kind of edge that has to be re-earned every year, and the market is paying for it as if it were permanent.` },
  ],
};

module.exports = { moat };
