// Paradeep initiation, part 5: forecasts vs the street, street view, valuation.
const X = require('./PARADEEP.ctx');
const { streetBlocks } = require('./valuation-blend');
const { C, D, F, V, AS, B, SC, n0, n1, pctChg, r, Y26, price, mult, epsSep28, ebitdaSep28, pe28, peSep28, dcfV, evV, rating, PEERS, PEER_SYMS, FERT, sectorDerate, sectorDerateEv, derateExNfl, fertPe, PP, pname, FM, fwdKept, fwdMed, fwdMedAll, troughYears, fwdYear, derived, BR, PLE, ASOF_TXT, mv, nd, ndEbitda } = X;
const oi = Y26.otherIncomeItems;

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: a squeezed FY27, a partial recovery in FY28-29, below the street',
  blocks: [
    { p: `Paradeep reports one segment, so we forecast it the way management and the street talk about it: tonnes sold × revenue per tonne, and EBITDA per tonne (Screener basis, i.e. before other income, ~₹50-100/t below the company's figure). Below EBITDA: depreciation ~₹${n0(F.dep[0])} cr in FY27E (Q1 run-rate ₹424 cr) rising to ~₹${n0(F.dep[2])} cr; finance cost ₹${F.interest.map(n0).join(' / ₹')} cr as debt funds working capital and projects; tax 25.2%; payout 15%. Paradeep has no minorities after the merger (MCFL was absorbed, not held as a subsidiary), and the engine's share count (FY26 profit ÷ EPS = 103.75 cr) matches the actual 103.82 cr, so no adjustment is needed. Every assumption is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'table', title: 'The business build', head: ['', 'FY26A', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Volume sold (mt)', '4.21', ...B.volumeMt.map(v => v.toFixed(2))],
      ['of which manufactured', '3.57', ...B.manufacturedMt.map(v => v.toFixed(2))],
      ['of which traded', '0.64', ...B.tradedMt.map(v => v.toFixed(2))],
      ['Revenue per tonne (₹)', '51,845', ...B.revPerTonne.map(n0)],
      { hl: true, cells: ['**Revenue (₹ cr)**', '**21,826**', '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      ['EBITDA per tonne (₹, Screener basis)', '5,245', ...B.ebitdaPerTonne.map(n0)],
      { hl: true, cells: ['**EBITDA (₹ cr)**', '**2,208**', '**{{F.ebitda.0|num}}**', '**{{F.ebitda.1|num}}**', '**{{F.ebitda.2|num}}**'] },
      ['Net debt at year-end (₹ cr)', n0(X.nd26), ...[0, 1, 2].map(i => n0(nd(i)))],
      ['Net debt ÷ EBITDA (x)', n1(X.nd26 / 2208), ...[0, 1, 2].map(i => n1(ndEbitda(i)))],
    ], source: 'Company (FY26), GAM Research estimates; build in assumptions.json, checked against the model by the authoring script' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Profit before tax', ref: 'fin.pbt' },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1', hl: true }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates (FY24 PPL alone; FY25 restated)' } },
    { h: 'Other income: built, not plugged' },
    { exhibit: { type: 'table', title: 'Other income build (₹ crore)', head: ['Item', 'FY26 (annual report)', 'FY27E', 'Why'], wide: [3], rows: [
      ['Interest (bank deposits, tax refunds, others)', n1(oi.interestBank + oi.interestItRefund + oi.interestOthers), '20', 'Cash fell from ₹1,036 cr (Mar-25) to ₹392 cr (Mar-26); no treasury book in a net-debt company'],
      ['Gains on liquid mutual funds', n1(oi.mfGains), '30', 'Subsidy receipts parked briefly; smaller surpluses with debt up'],
      ['Rent and miscellaneous income', n1(oi.rent + oi.misc), '55', 'Recurring (rent, sale of power/scrap, services)'],
      ['Write-backs of provisions and loss allowances', n1(oi.provisionsWrittenBack + oi.lossAllowanceWrittenBack), '0', 'Not recurring'],
      ['Less: loss on discarded plant (Screener nets it here)', '−' + n1(Y26.lossOnDiscardPpe), '−20', 'Revamps continue; FY25 ₹24 cr, FY26 ₹56 cr'],
      { hl: true, cells: ['**Other income, Screener basis**', '**88** (Screener "normal"; reported ₹51 cr after the −₹39 cr exceptional)', `**${AS.otherIncome[0]}**`, `FY28E ₹${AS.otherIncome[1]} cr, FY29E ₹${AS.otherIncome[2]} cr`] },
    ], source: 'Annual report FY26 (notes 21, 27), Screener.in, GAM Research. Check: Q1FY27 normal other income ₹21.6 cr (×4 ≈ ₹86 cr); TTM (Q2FY26-Q1FY27) ₹134 cr before Screener\'s annual netting of discard losses (~₹58 cr in FY26), i.e. ~₹76 cr on the annual basis' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'FY26A', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', 'PL FY27E', 'PL FY28E'], rows: [
      ['Revenue (₹ cr)', '21,826', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', n0(PLE.FY27E.sales), n0(PLE.FY28E.sales)],
      ['EBITDA (₹ cr)', '2,208', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', `${n0(PLE.FY27E.ebitda)}*`, `${n0(PLE.FY28E.ebitda)}*`],
      ['Net profit (₹ cr)', '996', '{{F.pat.0|num}}', '{{F.pat.1|num}}', '{{F.pat.2|num}}', n0(PLE.FY27E.pat), n0(PLE.FY28E.pat)],
      ['EPS (₹)', '9.6', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', n1(PLE.FY27E.eps), n1(PLE.FY28E.eps)],
    ], source: 'Prabhudas Lilladher Q1FY27 update (31-Jul-2026); *PL EBITDA is the company basis before other income (FY26 ₹2,152 cr). Elara\'s estimates were not available. No dated consensus found.' } },
    { callout: `Our FY27E EPS (₹${n1(F.eps[0])}) is ${Math.abs(pctChg(F.eps[0], PLE.FY27E.eps))}% below PL's ₹${PLE.FY27E.eps} and ${Math.abs(pctChg(F.eps[0], 9.6))}% below FY26; our FY28E EPS (₹${n1(F.eps[1])}) is ${Math.abs(pctChg(F.eps[1], PLE.FY28E.eps))}% below PL's ₹${PLE.FY28E.eps}. The gaps: (1) volume: we have ${B.volumeMt[1]} mt in FY28 vs PL's ${PLE.FY28E.volumeMt} mt because we credit the 1.0 mt granulation train only from late FY29 (PL expects full integration by early FY29) and FY27 production is raw-material constrained; (2) EBITDA per tonne ~₹${n0(B.ebitdaPerTonne[1])} vs PL's ~₹5,500 (company basis); (3) other income ₹85 cr on Screener's basis vs PL's ₹166-172 cr (company basis, before netting plant-discard losses); (4) finance cost ~₹${n0(F.interest[1])} cr vs PL's ~₹488 cr, because our net debt rises with working capital rather than falling to PL's ₹6,100 cr gross.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: positive on the integration story, with only two published voices',
  blocks: [
    { p: `${D.street.split} Bulls argue that full acid integration, 1.3 mt of new granulation and MCFL synergies will take EBITDA towards ₹7,000/t by FY29-30, and that subsidy lags are temporary. We agree that the projects make sense and that policy usually catches up, but the timetable has slipped, the projects are debt-funded, and the working-capital cycle has turned every price spike into more borrowing. Coverage is thin: Prabhudas Lilladher has moved its multiple from 10x to 13x FY28E in four months while cutting EPS, and Elara cut its EV/EBITDA multiple from 11.5x to 8x for leverage.` },
    { exhibit: { type: 'table', title: 'Earlier calls (for context)', head: ['Broker', 'Rating', 'Target (₹)', 'Date', 'Method'], wide: [4], rows: D.street.older.map(o => [o.broker, o.rating, o.tp ? n0(o.tp) : '–', o.date, o.method || '–']), source: 'Prabhudas Lilladher notes (Mar-Jun 2026); Elara Capital via investmentguruindia.com (Feb-2026)' } },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(c => [c.argument, c.who]), source: 'Broker notes, earnings calls, shareholding pattern and annual report to 30-Sep-2026' } },
  ],
};

module.exports = { forecasts, street };
