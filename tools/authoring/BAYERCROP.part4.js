// Bayer CropScience report, part B (4 of 4): forecasts, street, valuation, verdict, glossary, statement notes.
const S = require('./BAYERCROP.research');
const { streetBlocks } = require('./valuation-blend');
const { C, D, AS, F, V, A, b, n0, n1, pc, price, mv, peMult, epsSep28, H21, H16, PEERS, P, derate, DOM, domMed, afterDerate, shortName, epsCagrHist, epsCagrFc, rating, buyBelow, sellAbove, ruleText, cashNow, divYield, ASOF_TXT, Q1 } = S;
const { lines } = require('./BAYERCROP.part3');
const ST = D.street.brokers, shortD = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}-${y.slice(2)}`; };

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: core profit flat in FY27, then ~10% a year, below management\'s aspiration',
  blocks: [
    { p: 'We forecast revenue as one line (the company reports one segment) and check it against a corn vs crop-protection build. FY27 falls ~3% after a deficient monsoon and the flubendiamide sale; FY28-29 assume normal monsoons, corn +13% a year and crop protection +6-7%. The EBITDA margin rises from 15.4% to 17% as local sourcing and launches help, still below FY20-24\'s ~19%. Other income follows the cash pile (net of leases) at 4.5% plus ~₹23 cr of rent and penal interest; tax stays at ~20%; we assume a 95% payout. Every assumption is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Business-line build (₹ crore; FY26 split approximate)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Corn seed', n0(AS.businessLines.base.corn), ...lines.corn.map(n0)],
      ['  growth', '', ...AS.businessLines.cornGrowth.map(pc)],
      ['Crop protection and other', n0(AS.businessLines.base.cropProtectionAndOther), ...lines.cp.map(n0)],
      ['  growth', '', ...AS.businessLines.cropProtectionAndOtherGrowth.map(g => `${g >= 0 ? '+' : '−'}${Math.abs(g).toFixed(1)}%`)],
      { hl: true, cells: ['**Revenue (model)**', '**5,675**', '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'Annual report FY26 BRSR (FY26 split), GAM estimates; the build sums to model revenue' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (net of leases in forecasts)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs management and the street (as of 30-Sep-2026)', head: ['', 'FY27E', 'FY28E', 'FY29E', 'Comment'], wide: [4], rows: [
      ['GAM revenue growth', '{{F.salesGrowth.0|chg}}', '{{F.salesGrowth.1|chg}}', '{{F.salesGrowth.2|chg}}', 'Management aspiration: high-single to low-double digit a year (Nov-2025)'],
      ['GAM EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', 'Management: about +100bp a year from FY25 (12.6%) for 2-3 years'],
      ['GAM EPS (₹)', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', `FY27E includes ~₹${n1(Q1.oneOffGain * 0.748 / F.shares)} a share from the flubendiamide gain`],
      ['GAM dividend per share (₹)', '{{F.dps.0|n1}}', '{{F.dps.1|n1}}', '{{F.dps.2|n1}}', 'Declared: ₹125 (FY25), ₹150 (FY26); we assume a 95% payout'],
      ['Street EPS (₹)', 'n.a.', 'n.a.', 'n.a.', 'No broker or consensus estimates dated Jul-Sep 2026 were found (see gaps)'],
    ], source: 'GAM Research; investor meet (Nov-2025)' } },
    { callout: `**Where we could be wrong:** our FY26-29E EPS growth is ~${n1(epsCagrFc)}% a year (~7% excluding one-offs), about what the company delivered in FY21-26 (${n1(epsCagrHist)}%). If management's aspiration came true (revenue +9-11% and +100bp a year), FY29E EPS would be ~₹{{scen.bull.eps.2|n1}}, ~16% above ours: that is our bull case.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: thin coverage, mostly positive, and targets drifting down',
  blocks: [
    { p: `Coverage is thin and mostly not public. S&P Global's poll counted eight analysts in Aug-2026: three strong buy, two buy, three hold, no sell (May-2026: two, two, four). We found two named calls with targets: **Kotak Institutional Equities, Buy, ₹${n0(ST[0].tp)}** (${shortD(ST[0].date)}, after Q1FY27; cut from ₹5,220 in Nov-2025) and **HSBC, Buy, ₹${n0(ST[1].tp)}** (upgrade on ${shortD(ST[1].date)}, at 29x FY27E EPS versus a 10-year average of 32x). We found no later HSBC note, so its target may be stale. The bulls' case is the corn opportunity, launches and margin recovery; the doubts are weather, pricing and dependence on the parent.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques.map(r => r.map(s => String(s).replace(/Rs /g, '₹'))), source: 'Investor meet questions (Nov-2025), filings and press to 30-Sep-2026' } },
  ],
};

const drRow = s => `${shortName(P[s].name)} ${pc(derate[s])}`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E earnings gives {{dcf.tp|inr}}`,
  blocks: [
    ...streetBlocks('BAYERCROP', {
      rating,
      streetIntro: `The only broker method we could find is **P/E**: HSBC values the stock at 29x FY27E EPS. Kotak does not disclose its method in the sources we saw. We use P/E too, applied to the earnings the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E), so our target is comparable. Coverage is thin, so the derivation below leans on the stock's own history and peers rather than on broker multiples.`,
      street: [
        [`Kotak Institutional Equities (${shortD(ST[0].date)})`, 'Buy', ST[0].tp, null, null, null, ST[0].thesis],
        [`HSBC (${shortD(ST[1].date)})`, 'Buy', ST[1].tp, 'P/E', '29x', 'FY27E EPS', 'Worst behind it; corn, launches, sourcing'],
        [`Kotak Institutional Equities (${shortD(ST[2].date)}, superseded)`, 'Buy', ST[2].tp, null, null, null, 'Earlier target'],
      ],
      ourThesis: 'De-rated franchise; corn growth offsets an ex-growth crop-protection book',
      streetSource: 'Investing.com (Kotak), Whalesbook (HSBC, 27-Nov-2025); n.d. = not disclosed in the sources we saw',
      derivationIntro: 'We start from the stock\'s own one-year-forward P/E since Apr-2021, cut it for the de-rating of listed domestic crop-protection stocks by 30-Sep-2026, and then for the growth we expect.',
      derivation: [
        ['1. Its own history', `One-year-forward P/E: median ${n1(H21.med)}x since Apr-2021 (25th-75th percentile ${n1(H21.p25)}-${n1(H21.p75)}x; low ${n1(H21.min)}x in Sep-2026); ${n1(H16.med)}x since 2016`, `Starting point: ${n1(H21.med)}x`],
        ['2. Sector de-rating', `On ${ASOF_TXT} domestic crop-protection peers traded at ${DOM.map(drRow).join(', ')} vs their five-year median P/E (median ${pc(domMed)}); Bayer itself ${pc(derate.BAYERCROP)}. UPL and Coromandel excluded (global/fertiliser businesses with depressed or re-rated earnings)`, `${n1(H21.med)}x × ${(1 + domMed / 100).toFixed(2)} ≈ ${n1(afterDerate)}x`],
        ['3. Growth', `The ${n1(H21.med)}x came with ${n1(epsCagrHist)}% a year EPS growth (FY21-26); we forecast ${n1(epsCagrFc)}% (FY26-29E), ~7% excluding one-offs`, `A small ~5% discount: **${peMult}x**`],
        ['4. Peers', `Trailing P/E: Sumitomo ${n1(P.SUMICHEM.pe)}x, PI ${n1(P.PIIND.pe)}x, Rallis ${n1(P.RALLIS.pe)}x, Dhanuka ${n1(P.DHANUKA.pe)}x; Bayer ${n1(P.BAYERCROP.pe)}x`, `${peMult}x forward sits between Indian generic makers and the MNC peer`],
        ['5. Returns', `ROE ~${Math.round(F.roe[1])}% but ~95% paid out, so value = yield + growth. At an ${n1(V.ke)}% cost of equity and ~6% growth, a dividend-discount P/E is ~18-20x`, `${peMult}x already holds a premium to that; we do not go higher`],
      ],
      derivationSource: `Screener.in (P/E history to ${ASOF_TXT}), broker notes, GAM Research`,
      history: { field: 'eps', from: '2016-04-01', median: Math.round(H21.med * 10) / 10, label: `Median since 2021: ${n1(H21.med)}x`, title: `One-year-forward P/E: our ${peMult}x vs history`, yearStep: 2 },
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (16x Sep-28E EBITDA plus net cash) gives ₹${n0(mv('ev').value)}, ${Math.abs(Math.round(mv('ev').vsTarget))}% below the P/E target: cash is a small part of the value (~${Math.round(cashNow / (price * F.shares) * 100)}% of market value). The DCF (₹${n0(mv('dcf').value)}) is ${Math.abs(Math.round(mv('dcf').vsTarget))}% lower: at an ${n1(V.ke)}% cost of capital, ~7% growth and a full payout, cash flows alone support roughly today's price. The upside therefore rests on the market paying ${peMult}x, a de-rated version of the premium Bayer has long enjoyed. That is why we call this a low-conviction BUY.`,
    }),
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}} Multiple 28x (its 25th percentile since 2021).'],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `Revenue −3% / +8% / +7.5% (FY27-29E), EBITDA margin 16-17%; ${peMult}x Sep-28E EPS.`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}} Multiple 19x (dividend-discount value).'],
    ], source: 'GAM Research' } },
    { h: 'The DCF cross-check in detail' },
    { exhibit: { type: 'table', title: 'DCF summary', head: ['', '₹ crore / ₹ per share'], rows: [
      ['Present value of FY28-42E free cash flow', '{{dcf.pvExplicit|num}}'], ['Present value of terminal value', '{{dcf.pvTv|num}}'], ['Enterprise value', '{{dcf.ev|num}}'],
      ['Add: net cash at Mar-27 (after leases)', '{{dcf.netCash|num}}'], ['Equity value', '{{dcf.equity|num}}'], ['Value per share (Mar-27)', '{{dcf.perShare|num}}'],
      { hl: true, cells: ['**12-month DCF value (rounded)**', '**{{dcf.intrinsicTp|inr}}**'] }, ['Terminal value share of EV', '{{dcf.tvShare|pct}}'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'DCF value sensitivity (₹): cost of capital down the side, terminal growth across', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'WACC \\ g', source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Listed crop-protection peers', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'P/E (x)', 'vs 5-yr median P/E', 'EV/EBITDA (x)', 'ROE'], rows: PEERS.map(p => [p.symbol === 'BAYERCROP' ? '**Bayer CropScience**' : shortName(p.name), n0(p.mcapCr), n0(p.revenue), p.ebitdaMargin + '%', n1(p.pe), pc(derate[p.symbol]), n1(p.evEbitda), p.roe + '%']), source: `Screener.in, trailing multiples at the NSE close on ${ASOF_TXT} (Bayer, Dhanuka, Rallis standalone)` } },
  ],
};

module.exports = { forecasts, street, valuation, ...require('./BAYERCROP.part6') };
