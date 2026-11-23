// Dr. Reddy's report, part 5: our forecasts vs the street (build, other income, tax) and the street view.
const X = require('./DRREDDY.ctx');
const { C, D, F, A, AS, BL, bld, ifrsRev, OB, oiRows, oiFy26Comp, TB, taxRows, n0, n1, pc, rup, ST, postQ1, medTp, tpLo, tpHi, avgEps, nEps, price, ASOF_TXT, shortDate, b } = X;
const br = n => ST.find(s => s.broker === n);
const streetRow = s => [`${s.broker.replace(' (ICICI Securities retail)', '')} (${shortDate(s.date)})`, s.sales?.FY27E ? n0(s.sales.FY27E) : '–', s.sales?.FY28E ? n0(s.sales.FY28E) : '–', s.ebitda?.FY27E ? n0(s.ebitda.FY27E) : '–', s.ebitda?.FY28E ? n0(s.ebitda.FY28E) : '–', s.eps?.FY27E != null ? n1(s.eps.FY27E) : '–', s.eps?.FY28E != null ? n1(s.eps.FY28E) : '–'];
const withEst = ['Motilal Oswal', 'Prabhudas Lilladher', 'Elara Securities', 'Emkay Global', 'ICICI Direct (ICICI Securities retail)', 'BOB Capital Markets'].map(br);
const avgOf = (f, y) => { const a = withEst.filter(s => s[f]?.[y] != null); return a.reduce((t, s) => t + s[f][y], 0) / a.length; };

const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs street', kicker: 'Our numbers', title: `Our forecasts: EPS ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])}, below the street on margins`,
  blocks: [
    { exhibit: { type: 'table', title: 'Revenue build by market (₹ crore; North America in US$ mn)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['North America (US$ mn)', n0(BL.base.naUsdMn), ...bld.map(r => n0(r.usd))],
      ['Rs per US$', n1(BL.base.fx), ...bld.map(r => n1(r.fx))],
      ['North America (₹ cr)', n0(BL.base.na), ...bld.map(r => n0(r.na))],
      ['Europe (incl. NRT)', n0(BL.base.europe), ...bld.map(r => n0(r.europe))],
      ['India', n0(BL.base.india), ...bld.map(r => n0(r.india))],
      ['Emerging Markets', n0(BL.base.em), ...bld.map(r => n0(r.em))],
      ['PSAI', n0(BL.base.psai), ...bld.map(r => n0(r.psai))],
      ['Others', n0(BL.base.others), ...bld.map(r => n0(r.others))],
      ['= Revenue, IFRS', n0(BL.base.revenueIfrs), ...ifrsRev.map(n0)],
      ['+ IFRS to Ind AS reconciliation', n0(BL.base.indasRecon), ...bld.map(r => n0(r.recon))],
      { hl: true, cells: ['**Revenue, Ind AS (= model)**', `**${n0(BL.base.revenueIndas)}**`, ...bld.map(r => `**${n0(r.model)}**`)] },
      ['Memo: semaglutide (all markets, GAM)', '~0', ...BL.memo.semaglutideRs.map(n0)],
      ['Memo: abatacept (US$ mn, GAM)', '–', ...BL.memo.abataceptUsdMn.map(n0)],
    ], source: 'AR FY26 MD&A table 1; GAM estimates (checked against model revenue in DRREDDY.ctx.js)' } },
    { exhibit: { type: 'table', title: 'Other income, finance cost, tax and minorities: built, not plugged (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['6.5% on opening net cash (engine)', '–', ...oiRows.map(r => n0(r.onNet))],
      ['6.5% on borrowing-funded cash (₹7,200 cr less ₹880 cr of equity stakes)', '–', ...oiRows.map(r => n0(r.carry))],
      ['= Treasury income (FY26: interest ₹373 cr + mutual-fund gains ₹236 cr)', '609', ...oiRows.map(r => n0(r.treas))],
      ['Forex gains', '177', ...oiRows.map(r => n0(r.forex))],
      ['Recurring miscellaneous and disposal income', '244', ...oiRows.map(r => n0(r.misc))],
      ['Share of JV profit', '13', ...oiRows.map(r => n0(r.jv))],
      { hl: true, cells: ['**Other income (comparable; FY26 excl. ₹189 cr divestment and ₹140 cr settlement)**', `**${n0(oiFy26Comp)}**`, ...oiRows.map(r => `**${n0(r.tot)}**`)] },
      ['Memo: gross yield-earning cash and investments, opening', '~8,400 avg', ...oiRows.map(r => n0(r.gross))],
      ['Finance cost', '374', ...AS.interest.map(n0)],
      ['Tax on PBT', '22.5% (IFRS)', ...TB.taxOnPbt.map(v => `${v}%`)],
      ['Minority share of the Nestle JV (negative = loss)', '(38)', ...TB.minorities.map(v => `(${-v})`)],
      ['= Model tax line (tax + minority, % of PBT)', '—', ...taxRows.map(r => `${n1(r.rate)}%`)],
    ], source: 'AR FY26 notes 2.16, 2.20, 2.39; Q1FY27 release (net cash reconciliation); GAM estimates' } },
    { p: `**Reconciliation.** FY27E other income of ₹${n0(oiRows[0].tot)} cr compares with ₹${n0(oiFy26Comp)} cr in FY26 and ~₹1,040 cr in the twelve months to Jun-26 on the same basis (excluding the brand divestment and the litigation settlement): lower because we assume smaller forex gains (₹${OB.forex[0]} cr vs ₹177 cr) and a 6.5% yield (7.2% in FY26). It then rises with the cash the engine builds (₹{{F.treasury.0|num}} cr / ₹{{F.treasury.1|num}} cr / ₹{{F.treasury.2|num}} cr of net cash at Mar-27/28/29E), because we model no acquisitions. If management spends ~₹3,000 cr on deals, other income falls by ~₹200 cr a year and the deal must earn more than that.` },
    { exhibit: { type: 'table', title: 'Our forecasts vs the street (notes to 30-Sep-2026; ₹ crore, EPS ₹)', head: ['', 'Revenue FY27E', 'Revenue FY28E', 'EBITDA FY27E', 'EBITDA FY28E', 'EPS FY27E', 'EPS FY28E'], rows: [
      { hl: true, cells: ['**GAM Research (Ind AS; EBITDA on Screener basis)**', `**${n0(F.sales[0])}**`, `**${n0(F.sales[1])}**`, `**${n0(F.ebitda[0])}**`, `**${n0(F.ebitda[1])}**`, `**${n1(F.eps[0])}**`, `**${n1(F.eps[1])}**`] },
      ['GAM EPS before the Q1 semaglutide provision', '', '', '', '', n1(F.eps[0] + X.SEMA_AT), n1(F.eps[1])],
      ...withEst.map(streetRow),
      ['Post-Q1 average (six notes above)', n0(avgOf('sales', 'FY27E')), n0(avgOf('sales', 'FY28E')), n0(avgOf('ebitda', 'FY27E')), n0(avgOf('ebitda', 'FY28E')), n1(avgEps('FY27E')), n1(avgEps('FY28E'))],
    ], source: 'Broker notes as dated (MOSL, PL, Elara, Emkay, BOB: IFRS revenue and EBITDA incl. other operating income; ICICI Direct: Ind AS). Brokers\' EPS are "adjusted" on their own definitions.' } },
    { callout: `**Why we are below the street:** our revenue is in line (FY28E ${pc((F.sales[1] / avgOf('sales', 'FY28E') - 1) * 100)} vs the average), but (1) our EBITDA basis excludes the other operating income that brokers' IFRS EBITDA includes (~1-2 points); (2) on a like-for-like basis our FY28E margin (~20.5% IFRS) is below MOSL (21.6%) and ICICI Direct (21.5% Ind AS), close to PL (20.1%) and Emkay (20.3%), above Elara (17.4%); (3) we assume ~5 mn semaglutide pens in FY27E, not 6-7 mn, and a slow abatacept ramp. Our FY28E EPS of {{F.eps.1|inr}} is ${pc((F.eps[1] / avgEps('FY28E') - 1) * 100)} vs the post-Q1 average of ₹${n1(avgEps('FY28E'))} (range ₹50-66).` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split down the middle, targets ₹${n0(tpLo)}-${n0(tpHi)}, all disclosed methods on P/E`,
  blocks: [
    { p: `${postQ1.length} houses published targets after the Q1FY27 results (22-24 Jul-2026), from ₹${n0(tpLo)} (Citi, Jefferies) to ₹${n0(tpHi)} (Nomura): median ₹${n0(medTp)}, ${pc((medTp / price - 1) * 100)} vs the ${ASOF_TXT} close of ₹${n0(price)}. Ratings split roughly evenly between Buy (ICICI Direct, BOB, Nuvama, and by target Investec and Nomura), Hold/Neutral (MOSL, Macquarie, Morgan Stanley) and Sell/Reduce (Elara, Emkay, Goldman Sachs, JPMorgan, Citi). Every note that discloses a method uses **P/E on one-year-forward EPS** (20-23x FY28E or 12-month-forward EPS; Elara 28x FY28E "core" EPS plus cash). The stock fell ~9% the day after the results. No broker values Dr. Reddy's as a sum of parts or on EV/EBITDA.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => [rup(r[0]), r[1]]), source: 'Broker notes and call transcripts to 30-Sep-2026' } },
    { callout: '**Bulls vs bears, in one line each.** Bulls (ICICI Direct, BOB, Nuvama): look through FY27; semaglutide, abatacept and branded markets restore ~20%+ margins and ~₹65-80 of EPS by FY29. Bears (Elara, Emkay, Goldman, JPMorgan, Citi): the US base is smaller than thought, margins have reset structurally lower and the big launches are already in the price. We sit in the middle on earnings and with the house multiple the stock looks fairly priced.' },
  ],
};

module.exports = { forecasts, street };
