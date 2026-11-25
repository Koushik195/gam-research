// Natco Pharma report, part 5: our forecasts vs guidance and the street (build, other income, tax) and the street view.
const X = require('./NATCOPHARM.ctx2');
const { C, D, F, A, AS, BL, bld, OB, oiRows, TB, taxRows, n0, n1, pc, ST, medTp, tpLo, tpHi, price, ASOF_TXT, shortDate, b, FY26, Q1, epsSep, SHARES } = X;
const guidEps = 750 / SHARES, isecCore28 = (1000 - 100) / 18;

const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs street', kicker: 'Our numbers', title: `Our forecasts: EPS ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])}: a little below guidance in FY27, growth of ~${Math.round((F.pat[1] / F.pat[0] - 1) * 100)}% and ~${Math.round((F.pat[2] / F.pat[1] - 1) * 100)}% after`,
  blocks: [
    { exhibit: { type: 'table', title: 'Revenue build by business (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['US (profit shares, Natco Pharma USA)', n0(BL.base.us), ...bld.map(r => n0(r.us))],
      ['Brazil', n0(BL.base.brazil), ...bld.map(r => n0(r.brazil))],
      ['Canada', n0(BL.base.canada), ...bld.map(r => n0(r.canada))],
      ['Rest of world', n0(BL.base.row), ...bld.map(r => n0(r.row))],
      ['= Export formulations', n0(BL.base.us + BL.base.brazil + BL.base.canada + BL.base.row), ...bld.map(r => n0(r.exports))],
      ['Domestic formulations', n0(BL.base.domestic), ...bld.map(r => n0(r.domestic))],
      ['API', n0(BL.base.api), ...bld.map(r => n0(r.api))],
      ['Crop Health Sciences', n0(BL.base.chs), ...bld.map(r => n0(r.chs))],
      ['Other operating revenue', n0(BL.base.otherOp), ...bld.map(r => n0(r.otherOp))],
      { hl: true, cells: ['**Revenue from operations (= model)**', `**${n0(BL.base.total)}**`, ...bld.map(r => `**${n0(r.model)}**`)] },
      ['Growth', '−8%', ...F.salesGrowth.map(g => pc(g))],
    ], source: 'Q1FY27 presentation and AR FY26 MD&A (FY26); GAM estimates, checked against model revenue in NATCOPHARM.ctx.js' } },
    { exhibit: { type: 'table', title: 'Other income, finance cost and tax: built, not plugged (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Engine treasury at the start of the year (net cash + Adcock at book)', '–', ...oiRows.map(r => n0(r.open))],
      ['less: Adcock stake at book (non-yielding; grows with retained profit)', '–', ...oiRows.map(r => `(${n0(r.adcockBook)})`)],
      ['less: FY27 working-capital release we expect to be absorbed by the refund-liability payout', '–', ...oiRows.map(r => r.refund ? `(${n0(r.refund)})` : '–')],
      ['= Yield-earning net cash', '~2,392 (Mar-26)', ...oiRows.map(r => n0(r.yielding))],
      ['6.5% on yield-earning net cash', '–', ...oiRows.map(r => n0(r.onNet))],
      [`6.5% on cash funded by ~₹${n0(OB.grossBorrowings)} cr of borrowings`, '–', ...oiRows.map(r => n0(r.carry))],
      ['= Treasury income (FY26: interest income)', n1(FY26.otherIncomeNote.interest), ...oiRows.map(r => n0(r.treas))],
      ['Forex gains', n1(FY26.otherIncomeNote.forex), ...oiRows.map(r => n0(r.forex))],
      ['Miscellaneous, wind power, investment gains', n1(FY26.otherIncomeNote.misc + FY26.otherIncomeNote.wind + FY26.otherIncomeNote.investmentGains), ...oiRows.map(r => n0(r.misc))],
      ['= Other income before the associate', n1(FY26.otherIncomeNote.total), ...oiRows.map(r => n0(r.exAssoc))],
      ['Share of Adcock profit (below tax in the accounts)', n1(FY26.assocShare), ...oiRows.map(r => n0(r.assoc))],
      { hl: true, cells: ['**Engine other income (incl. the associate)**', `**${n0(FY26.otherIncomeNote.total + FY26.assocShare)}**`, ...oiRows.map(r => `**${n0(r.tot)}**`)] },
      ['Finance cost', n1(36.7), ...AS.interest.map(n0)],
      ['Tax on PBT before the associate share', '8.0% (incl. ₹115 cr credit)', ...TB.taxOnPbtExAssoc.map(v => `${v}%`)],
      ['= Engine tax rate on PBT incl. the associate', '—', ...taxRows.map(r => `${n1(r.rate)}%`)],
    ], source: 'AR FY26 notes 23, 27, 29, 41; Q1FY27 call; GAM estimates (otherIncomeBuild, taxBuild in assumptions.json)' } },
    { exhibit: { type: 'table', title: 'Our forecasts vs guidance and the street', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue from operations (GAM)', n0(A.sales[b]), ...F.sales.map(n0)],
      ['Guidance: "gross sales" (Aug-2026) / revenue (May-2026)', '–', '₹3,300-3,400 cr / ₹3,400-3,500 cr', '–', '–'],
      ['EBITDA (GAM, Screener basis)', n0(A.ebitda[b]), ...F.ebitda.map(n0)],
      ['Net profit (GAM)', n0(A.pat[b]), ...F.pat.map(n0)],
      ['Guidance: PAT incl. associate', '–', '~₹750 cr (14-Aug-2026)', '+15-25% a year from FY28', '+15-25%'],
      { hl: true, cells: ['**EPS (GAM, ₹)**', `**${n1(A.eps[b])}**`, ...F.eps.map(e => `**${n1(e)}**`)] },
      ['EPS at guidance (₹750 cr / 179.11 mn shares)', '–', n1(guidEps), `${n1(guidEps * 1.15)}-${n1(guidEps * 1.25)}`, '–'],
      ['ICICI Securities core EPS implied by its target (31-May-2026)', '–', '–', `~${n1(isecCore28)}`, '–'],
    ], source: 'Company guidance (29-May and 14-Aug-2026 calls); ICICI Securities (Moneycontrol summary, Jun-2026): target ₹1,000 = 18x FY28E core EPS + ₹100 NPV, so core EPS ≈ (1,000 − 100) ÷ 18; GAM estimates' } },
    { callout: `**Where we differ:** we are ~${Math.abs(Math.round((F.pat[0] / 750 - 1) * 100))}% below the ~₹750 cr FY27 profit guidance because we do not assume the jump in second-half sales that the ₹3,300-3,400 cr sales guidance needs (Q1 was ₹735 cr). Our FY28E EPS of ₹${n1(F.eps[1])} is ~${Math.abs(Math.round((F.eps[1] / isecCore28 - 1) * 100))}% ${F.eps[1] < isecCore28 ? 'below' : 'above'} ICICI Securities' implied core EPS; FY28E growth of ${pc((F.pat[1] / F.pat[0] - 1) * 100)} sits inside management's 15-25%. We found no other broker estimates standing on ${ASOF_TXT} that we could read.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view & critiques', kicker: 'The street', title: `The street: Hold-to-Buy, targets ₹${n0(tpLo)}-${n0(tpHi)}, all set before the Q1 results; ~18x core earnings is the going multiple`,
  blocks: [
    { p: `The notes we could read that stood on ${ASOF_TXT} were all written before the Q1FY27 results (14-Aug-2026): ICICI Securities (Hold, ₹1,000, 31-May-2026), Investec (Buy, ₹1,220, 2-Jun-2026) and Geojit BNP Paribas (Accumulate, ₹1,058, 18-Mar-2026). ICICI Securities had been at **Sell, ₹750** in Nov-2025 ("Earnings hiccups imminent") and moved to Hold after the stock fell ~20% in two days on the Q4 results and the ₹700-750 cr FY27 guidance. Only ICICI Securities discloses its method: **18x FY28E core EPS plus an NPV of ₹100 a share for exclusive products**. Median target ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the 30-Sep close of ₹${n0(price)}.` },
    { exhibit: { type: 'table', title: 'What the street says (notes standing on 30-Sep-2026)', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Thesis'], wide: [4], rows: ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.thesis]), source: 'Moneycontrol/TradingView summary of ICICI Securities (Jun-2026); Trade Brains (3-Jun-2026) for Investec; Trendlyne post summaries. Full PDFs need a login; Business Standard refused our tool (HTTP 403) and was not bypassed.' } },
    { h: 'Critiques we take seriously' },
    { bullets: D.critiques.map(c => `**${c.who}:** ${c.text}`) },
    { callout: '**Where we stand:** the street\'s ~18x core multiple is a judgement that the base business deserves a sector-like multiple. Our house rule derives the multiple from Natco\'s own history, which is dominated by years when the market paid 7-8x for windfall earnings. That, not the earnings forecast, is why our target is far below the street\'s. We show the street\'s method on our numbers in the valuation chapter.' },
  ],
};

module.exports = { forecasts, street };
