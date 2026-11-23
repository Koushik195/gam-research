// Aurobindo Pharma report, part 6: our forecasts (business-line build, other income and interest builds, the street
// comparison) and the street view with critiques.
const X = require('./AUROPHARMA.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, Q1, FY26, b, YRS, BL, lines, blTot, OB, IB, grossCash, oiTreas, oiMisc, oiQ1, oiBuild, avgDebt, intBuild, yield26, netCashCo, epsPost, SH_POST, SH_ADJ,
  idir, mosl, pl_, moslEps, postQ1, avgTp, medTp, tpLo, tpHi, buys, price, ASOF_TXT, shortDate, fxPp27, lannett27 } = X;
const g3 = arr => arr.map(v => n0(v));
const wcArtefact = F.owcPct / 100 * (fxPp27 / 100 * A.sales[b] + lannett27); // FX translation + Lannett's acquired working capital (non-cash in the engine's FY27 owc build)
const ownNet27 = netCashCo[0] + wcArtefact;
const OI = C.accounting.otherIncomeFy26;

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: revenue +17% in FY27E (mostly rupee and Lannett), EPS ₹77 → ₹96; in line with PL and Motilal Oswal',
  blocks: [
    { p: `We build revenue by business: US, Growth Markets and ARV in US dollars, Europe in euros, APIs in rupees, each converted at an assumed rate (₹${BL.fxUsd.join(' / ')} per $ and ₹${BL.fxEur.join(' / ')} per euro for FY27-29E; Q1FY27 actual ₹${Q1.fxAvg} and ~₹110). The model runs on the resulting growth rate and the authoring script checks that the build equals model revenue. EBITDA margin follows guidance (${AS.ebitdaMargin.join('% / ')}%). Depreciation is ${AS.depRateOnGrossBlock}% of gross block; capex ₹${AS.capex.map(n0).join(' / ')} cr (FY27E includes Lannett, US$247mn, because the engine has no acquisitions line); tax ${AS.taxRate.join('% / ')}%; the FY27E payout (${AS.payout[0]}%) includes the ₹800 cr buyback. EPS below is per post-buyback share (${SH_POST.toFixed(2)} cr); the engine's EPS uses the FY26 count and is ${((SH_ADJ - 1) * 100).toFixed(1)}% lower. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'table', title: 'Business-line build (₹ crore; checked to sum to model revenue)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['US: US$ mn × ₹/$', `${FY26.usUsdMn} × ${FY26.fxAvg}`, ...YRS.map((_, i) => `${BL.usUsdMn[i]} × ${BL.fxUsd[i]}`)],
      ['US (₹ crore)', n0(BL.base.us), ...g3(lines.us)],
      ['Europe: EUR mn × ₹/EUR', `${FY26.europeEurMn} × ${n1(BL.base.europe / FY26.europeEurMn * 10)}`, ...YRS.map((_, i) => `${BL.europeEurMn[i]} × ${BL.fxEur[i]}`)],
      ['Europe (₹ crore)', n0(BL.base.europe), ...g3(lines.europe)],
      ['Growth Markets (US$ mn → ₹ crore)', `${FY26.gmUsdMn} → ${n0(BL.base.gm)}`, ...YRS.map((_, i) => `${BL.gmUsdMn[i]} → ${n0(lines.gm[i])}`)],
      ['ARV (US$ mn → ₹ crore)', `${FY26.arvUsdMn} → ${n0(BL.base.arv)}`, ...YRS.map((_, i) => `${BL.arvUsdMn[i]} → ${n0(lines.arv[i])}`)],
      ['APIs (growth)', n0(BL.base.api), ...YRS.map((_, i) => `${n0(lines.api[i])} (+${BL.apiGrowth[i]}%)`)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
      ['  growth', `${n1(A.salesGrowth[b])}%`, '{{F.salesGrowth.0|pct}}', '{{F.salesGrowth.1|pct}}', '{{F.salesGrowth.2|pct}}'],
    ], source: 'Q4FY26 presentation; GAM estimates (assumptions.json businessLines)' } },
    { exhibit: { type: 'table', title: 'Other income and interest, built (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Q1 actual (company)', '–', n0(oiQ1[0]), '–', '–'],
      ['Treasury: yield × average company gross cash', `${n0(OB.treasury26)} (${yield26.toFixed(1)}%)`, `${n0(oiTreas[0])} (Q2-Q4)`, n0(oiTreas[1]), n0(oiTreas[2])],
      ['  gross cash at year-end (engine net cash + basis + gross debt)', n0(OB.grossCashMar26), ...g3(grossCash)],
      ['Miscellaneous income (recurring, not broken down)', n0(OB.misc26), `${n0(oiMisc[0])} (Q2-Q4)`, n0(oiMisc[1]), n0(oiMisc[2])],
      ['Lease-receivable interest; write-backs (end / one-off)', `${n0(OB.leaseInterest26)} + ${n0(OB.oneOff26)}`, '0', '0', '0'],
      { hl: true, cells: ['**Other income**', `**${n0(OI.total)}**`, '**{{F.otherIncome.0|num}}**', '**{{F.otherIncome.1|num}}**', '**{{F.otherIncome.2|num}}**'] },
      ['Interest: average gross debt × 4.7% + lease interest', `${n0(A.interest[b])} (Screener)`, `${n0(avgDebt[0])} → ${n0(intBuild[0])}`, `${n0(avgDebt[1])} → ${n0(intBuild[1])}`, `${n0(avgDebt[2])} → ${n0(intBuild[2])}`],
    ], source: `AR FY26 note 25; Q1FY27 and Q4FY26 presentations (gross cash and debt); GAM estimates. Company other income: ₹599 cr in the twelve months to Jun-26 (Q1FY27 ₹212 cr); FY27E is lower because the lease interest has ended, gross cash fell by ~₹1,900 cr after Lannett and the buyback, and we forecast no forex gains (Screener counts them: ₹${n0(X.ttmOi)} cr incl. forex).` } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Depreciation & amortisation', ref: 'fin.dep' }, { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (owners)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹, FY26 share count)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex (FY27E incl. Lannett)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net cash)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is Screener gross cash and investments in actual years and engine net cash (Screener basis) in forecasts.' } },
    { callout: `**Engine note on cash:** the engine charges working capital at ${n1(F.owcPct)}% of incremental revenue, so in FY27E it also "spends" cash on the rupee's translation of foreign working capital and on Lannett's working capital (already inside the US$250mn price): ~₹${n0(wcArtefact)} cr that is not a real outflow. Our own estimate of company net cash at Mar-27 is ~₹${n0(ownNet27)} cr vs the engine's ₹${n0(netCashCo[0])} cr (company basis). This affects only the DCF and EV/EBITDA cross-checks (by ~₹${n0(wcArtefact / SH_POST)} a share), not the P/E target.` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'ICICI Direct / MOSL / PL FY27E', 'GAM FY28E', 'ICICI Direct / MOSL / PL FY28E', 'GAM FY29E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', `${n0(idir.sales.FY27E)} / ${n0(mosl.sales.FY27E)} / ${n0(pl_.sales.FY27E)}`, '{{F.sales.1|num}}', `${n0(idir.sales.FY28E)} / ${n0(mosl.sales.FY28E)} / ${n0(pl_.sales.FY28E)}`, '{{F.sales.2|num}}'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', `${n0(idir.ebitda.FY27E)} / ${n0(mosl.ebitda.FY27E)} / ${n0(pl_.ebitda.FY27E)}`, '{{F.ebitda.1|num}}', `${n0(idir.ebitda.FY28E)} / ${n0(mosl.ebitda.FY28E)} / ${n0(pl_.ebitda.FY28E)}`, '{{F.ebitda.2|num}}'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', [idir, mosl, pl_].map(s => `${n1(s.ebitda.FY27E / s.sales.FY27E * 100)}%`).join(' / '), '{{F.ebitdaMargin.1|pct}}', [idir, mosl, pl_].map(s => `${n1(s.ebitda.FY28E / s.sales.FY28E * 100)}%`).join(' / '), '{{F.ebitdaMargin.2|pct}}'],
      { hl: true, cells: ['**EPS (₹, post-buyback shares)**', `**${n1(epsPost[0])}**`, `**${n1(idir.eps.FY27E)} / ${n1(moslEps('FY27E'))} / ${n1(pl_.eps.FY27E)}**`, `**${n1(epsPost[1])}**`, `**${n1(idir.eps.FY28E)} / ${n1(moslEps('FY28E'))} / ${n1(pl_.eps.FY28E)}**`, `**${n1(epsPost[2])}**`] },
    ], source: `ICICI Direct, Motilal Oswal and Prabhudas Lilladher Q1FY27 notes (all ${shortDate(idir.date)}); MOSL EPS = its PAT ÷ 57.54 cr shares. No consensus dated on or before 30-Sep-2026 was found.` } },
    { callout: `Our revenue is within ~5% of the street (we are lowest for FY28E). Our FY28E EPS (₹${n1(epsPost[1])}) is in line with PL (₹${n1(pl_.eps.FY28E)}) and ${Math.round((1 - epsPost[1] / moslEps('FY28E')) * 100)}% below Motilal Oswal, but ${Math.round((1 - epsPost[1] / idir.eps.FY28E) * 100)}% below ICICI Direct, whose FY28E assumes revenue of ₹${n0(idir.sales.FY28E)} cr, a 22.3% margin and ₹1,312 cr of other income (we model ₹{{F.otherIncome.1|num}} cr): a big step-up in US and biosimilar revenue that management has not guided to. We think the burden of proof sits with the US base and Eugia.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street after Q1: ${buys} of ${postQ1.length} positive, targets ₹${n0(tpLo)}-${n0(tpHi)}, valued on P/E`,
  blocks: [
    { p: `Six houses published after the Q1FY27 results (6 Aug-1 Sep 2026). ${buys} are positive: ICICI Direct ₹1,970 (18x FY28E EPS of ₹109.4), HSBC ₹1,900, Motilal Oswal ₹1,860 (20x 12-month-forward EPS), ICICI Securities' institutional desk ₹1,830 and HDFC Securities ₹1,730 (Add). Prabhudas Lilladher is Hold at ₹1,600 (18x FY28E). Before the results, Macquarie was Sell at ₹1,300 (Jul-2026) and Nuvama Buy at ₹1,753 (Jun-2026). The post-Q1 average target is ₹${n0(avgTp)} (median ₹${n0(medTp)}), ${pc((avgTp / price - 1) * 100)} from the ₹${n0(price)} close on ${ASOF_TXT}; the stock was ~₹1,590-1,634 when the notes came out. Bulls point to several earnings levers (Lannett, Pen-G, China, Europe, biosimilars, the MSD plant) at a P/E below the sector; the sceptics note that the Q1 beat was partly currency and that Eugia's approvals are stuck. Every broker that discloses a method uses P/E.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls, FDA and filings to 30-Sep-2026' } },
  ],
};

module.exports = { forecasts, street, wcArtefact, ownNet27 };
