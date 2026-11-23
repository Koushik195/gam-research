// Torrent Pharma report, part 5: street view and risks & honest summary (valuation is in TORNTPHARM.part5b.js).
const X = require('./TORNTPHARM.ctx');
const { ruleText } = require('../../src/ratings');
const { D, F, V, A, AS, SC, n0, n1, pc, pc1, rup, ASOF_TXT, price, mv, MULT, ENGINE, EPSC, tpAdj, repMultSens, adjSep, epsSep, adjEps, epsU, ppaPs, FM, FMA, FMA_P25, FMA_P75, FM_P25, FM_P75, medAdjFull, medExc, medPre, medPostRep, medPostAdj, fwdAdj, fwdRep, peNowAdj, peNowRep,
  EXC_P25, EXC_P75, EXC_AT, sExc, multAdjRep, PEERS, P, MED5, derate, USED, EXCL, sectorDrCalc, sectorDrAll, SECTOR_DR, k, shortName, half, fwdEv, HEV, HEVpre, HEVpost, EVM, ebitdaSep, evNow, treasSep, ndSepOwn, rating, buyBelow, sellAbove, ST, pl_, idir, mosl, avgPost, streetEvAt, moslAtOurs, shortDate, epsCagrAdj, lev, SHARES, PPA } = X;
const pe = (m, e) => n0(Math.round(m * e / 10) * 10);

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: two Buys on EV/EBITDA, three Holds; targets ₹4,730-5,920',
  blocks: [
    { p: `Four houses published after the Q1FY27 results on 30-Jul-2026: Prabhudas Lilladher Buy ₹5,500 (28x FY28E EV/EBITDA for the combined company, raised from ₹5,000), ICICI Direct Buy ₹5,920 (27x FY28E EBITDA of ₹7,594 cr), Motilal Oswal Neutral ₹4,730 (50x 12-month-forward EPS) and ICICI Securities Hold ₹4,925 (method not public); Geojit's Hold ₹4,898 (Jun-2026) also stood. The post-Q1 average is ~₹${n0(avgPost)}. The stock was ~₹4,870-5,120 when those notes came out and ended September at ₹${n0(price)}. Bulls argue Torrent will repeat its integration record and that synergies arrive early (PL: combined EBITDA ₹78-80 bn in FY28); the cautious view is that the valuation already reflects this (MOSL). No Sell call and no consensus estimate dated before 30-Sep-2026 were found.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a high-quality compounder priced above its own history; we would wait for a better entry',
  blocks: [
    { callout: '**What you are buying:** India\'s best-run branded-generics franchise (#1 in cardiac, 75% chronic, four successful brand acquisitions), now with JB\'s brands and CDMO, a Brazil business that keeps gaining share, and two generics businesses (US, Germany) that add little. Synergies are arriving early and debt should fall quickly.' },
    { callout: `**What you are paying:** ${n1(evNow)}x our FY28E EV/EBITDA against Torrent's ${n1(X.HEV.med)}x forward median since 2021, ${n1(peNowRep)}x FY28E reported EPS and ${n1(peNowAdj)}x EPS before the JB amortisation. On the street's majority method (EV/EBITDA, ${X.EVM.base}x Sep-28E) the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. The P/E cross-check on EPS before the JB amortisation (₹${n0(mv('pe').value)}) is kinder; the DCF (₹${n0(mv('dcf').value)}) is harsher. The price already assumes the merged company keeps the higher multiple it has traded on since the deal.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['JB India keeps double-digit growth through the brand transfers (Q2-Q3 FY27)', 'Medium', 'JB India growth; prescriber retention'],
      ['Synergies at the ₹450 cr run-rate by FY28 (year 2)', 'Medium', 'JB margin above 37%'],
      ['India base growth stays mid-teens after the 2026 market pick-up', 'Medium', 'IPM volume growth; semaglutide share'],
      ['Faster deleveraging (or a QIP used to repay debt)', 'Medium', 'Net debt/EBITDA below 1.5x by Mar-27'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['JB brands lose prescribers in the transfer (as smaller deals sometimes did)', 'Medium', 'JB India growth below 5%; bear case {{scen.bear.tp|inr}}'],
      ['India market growth reverts to ~8% and semaglutide prices collapse', 'Medium', 'India base +10-11% instead of 14-16%'],
      ['Germany keeps losing tenders; US price erosion', 'High', '~15% of revenue shrinking in local currency'],
      ['Rupee appreciation', 'Medium', 'Export revenue falls in rupees (hedges partly offset)'],
      ['A new large acquisition before debt is down', 'Low (12-18 months away)', 'Management caps leverage at 3-3.5x'],
      ['Price controls (NLEM) or trade-margin regulation', 'Low-medium', 'India price growth below 5%'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** and stay sellers above ~₹${n0(sellAbove)} on today's numbers; we would revisit the multiple if JB's brands come through the transfers intact and synergies reach the ₹450 cr run-rate early.`,
      `**Biggest swing factors:** JB's margin and India growth. Each 1pp of group EBITDA margin is ~₹${n0(F.sales[1] / 100)} cr of FY28E EBITDA, worth ~₹${n0(X.sep(F.sales) / 100 * X.EVM.base / SHARES)} a share at ${X.EVM.base}x Sep-28E EBITDA; each 1x on the multiple is ~₹${n0(X.ebitdaSep / SHARES)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'India base growth, Q1FY27', v: `+${X.Q1.indiaBaseYoYPct}%`, d: `market +${X.Q1.ipmGrowthPct}%` },
      { k: 'JB EBITDA margin, Q1FY27', v: `${X.Q1.jb.ebitdaMarginPct}%`, d: 'JB\'s own FY26: 26.7%' },
      { k: 'Net debt / EBITDA', v: `${lev[0].toFixed(1)}x → ${lev[3].toFixed(1)}x`, d: 'Mar-26 pro forma → FY29E (GAM)' },
      { k: 'Forward EV/EBITDA', v: `${n1(evNow)}x`, d: `FY28E; median since 2021 ${n1(X.HEV.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, risks };
