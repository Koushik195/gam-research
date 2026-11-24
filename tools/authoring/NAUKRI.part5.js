// Info Edge report, part B-5: our forecasts vs the street, and the street's view and critiques.
const X = require('./NAUKRI.ctx');
const { C, D, F, AS, A, SA, ann, n0, n1, price, sh, STR, medTp, P, recPat, T, listedMv, CASH, UNL } = X;
const b = A.labels.length - 1;
const blk = k => AS.segments.find(s => s.key === k);
const rup = s => s.replace(/Rs(?=[0-9])/g, '₹');
// Standalone forecast (for comparison with brokers, who forecast the standalone company)
const SAOI = [375, 405, 435]; // standalone treasury income (the consolidated line adds ~₹5 cr of subsidiaries' income)
const saRev = [0, 1, 2].map(i => P.base.rec[i].rev + P.base.re[i].rev + P.base.oth[i].rev);
const saOp = [0, 1, 2].map(i => P.base.rec[i].res + P.base.re[i].res + P.base.oth[i].res - AS.saBuild.unalloc[i]);
const saEbitda = saOp.map((v, i) => v + AS.saBuild.dep[i] + AS.saBuild.fin[i]);
const saPat = saOp.map((v, i) => (v + SAOI[i]) * (1 - T)), saEps = saPat.map(v => v / sh);
const JM = { rev: [3338.8, 3689.3], ebitda: [1378.1, 1527.1], eps: [18.0, 20.1] }; // JM Financial 23-May-2026 (pre-Q1, standalone)
const a26 = ann('FY26');

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Forecasts', title: 'Our forecasts: standalone EPS ₹' + n1(saEps[0]) + ' / ₹' + n1(saEps[1]) + ' / ₹' + n1(saEps[2]) + ' (FY27-29E)',
  blocks: [
    { p: 'We forecast the consolidated P&L from four blocks that add up to reported revenue and EBITDA: the three standalone segments (Recruitment, 99acres, Jeevansathi + Shiksha, each on its segment result) and a residual for the subsidiaries and eliminations. A small reconciling line turns segment results into EBITDA (segment results are already after their own depreciation and lease interest). Forecasts carry no fair-value gains, no exceptional items and no minorities of note, so FY27E consolidated profit is below FY26 reported profit even though standalone EBITDA grows ~25%.' },
    { exhibit: { type: 'table', title: 'Forecast drivers by block', head: ['Block', 'Revenue growth FY27-29E', 'Margin FY27-29E', 'Why'], wide: [3], rows: ['rec', 're', 'oth', 'res'].map(k => { const s = blk(k); return [`**${s.name}**`, s.growth.map(g => g + '%').join(' / '), `${s.marginPct.map(m => m + '%').join(' / ')} (${s.marginLabel.toLowerCase()})`, rup(s._why.split('. ').slice(0, 2).join('. ') + '.')]; }), source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Consolidated forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue', n0(A.sales[b]), '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['EBITDA', n0(A.ebitda[b]), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['EBITDA margin', `${n1(A.ebitda[b] / A.sales[b] * 100)}%`, '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}'],
      ['Other income (FY26 incl. fair-value gains and exceptional items)', n0(A.otherIncome[b]), '{{F.otherIncome.0|num}}', '{{F.otherIncome.1|num}}', '{{F.otherIncome.2|num}}'],
      ['Profit before tax', n0(A.pbt[b]), '{{F.pbt.0|num}}', '{{F.pbt.1|num}}', '{{F.pbt.2|num}}'],
      ['Tax rate (FY26: tax + minorities)', `${n1((A.pbt[b] - A.pat[b]) / A.pbt[b] * 100)}%`, `${AS.taxRate[0]}%`, `${AS.taxRate[1]}%`, `${AS.taxRate[2]}%`],
      { hl: true, cells: ['**Profit attributable to Info Edge**', `**${n0(A.pat[b])}**`, '**{{F.pat.0|num}}**', '**{{F.pat.1|num}}**', '**{{F.pat.2|num}}**'] },
      ['Consolidated EPS (₹)', n1(A.eps[b]), '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}'],
    ], source: 'Screener.in (FY26, after minorities); GAM estimates' } },
    { exhibit: { type: 'table', title: 'Standalone forecasts and the street (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'JM Financial FY27E / FY28E (May-2026)'], rows: [
      ['Revenue', n0(a26.saRev), ...saRev.map(n0), `${n0(JM.rev[0])} / ${n0(JM.rev[1])}`],
      ['EBITDA', n0(a26.saEbitda), ...saEbitda.map(n0), `${n0(JM.ebitda[0])} / ${n0(JM.ebitda[1])}`],
      ['Operating PBT (before other income)', n0(a26.saOpPbt), ...saOp.map(n0), '–'],
      ['Profit before exceptional items', n0(C.standalone.epsPreExc[4] * sh), ...saPat.map(n0), '–'],
      { hl: true, cells: ['**EPS before exceptional items (₹)**', `**${C.standalone.epsPreExc[4]}**`, ...saEps.map(v => `**${n1(v)}**`), `${JM.eps[0]} / ${JM.eps[1]}`] },
      ['Memo: Recruitment profit after corporate costs and tax', n0((a26.recRes - a26.unalloc) * (1 - T)), ...[0, 1, 2].map(i => n0(recPat('base', i))), '–'],
    ], source: 'Info Edge AR FY26; JM Financial result update (23-May-2026, before Q1FY27); GAM estimates (standalone other income ₹375 / 405 / 435 cr)' } },
    { p: `**Against the street.** We are above JM Financial's May-2026 standalone numbers (revenue +${Math.round((saRev[0] / JM.rev[0] - 1) * 100)}%, EBITDA +${Math.round((saEbitda[0] / JM.ebitda[0] - 1) * 100)}% for FY27E), but JM's note pre-dates the Q1FY27 billings acceleration; it upgraded to Buy in July and Motilal Oswal raised its FY27-28E estimates ~4% in August. Our FY27E standalone revenue growth (${Math.round((saRev[0] / a26.saRev - 1) * 100)}%) is close to Q1's 12% plus the billings lead; our EBITDA margin (${n1(saEbitda[0] / saRev[0] * 100)}%) is close to Q1FY27's 44% (MOSL).` },
    { callout: `**What the engine can and cannot show.** The consolidated model has no line for fair-value gains or minorities; we forecast neither. Model cash is the consolidated treasury line, which includes the Eternal and PB Fintech stakes at their Mar-2026 book value net of deferred tax and minorities; the SOTP uses the stakes at 30-Sep-2026 market prices instead.` },
  ],
};

const streetRows = STR.map(s => [s.broker, s.rating, n0(s.tp), s.method, s.multiple, s.date.split('-').reverse().join('-'), s.standing]);
const street = {
  id: 'street', nav: 'Street view & critiques', kicker: 'Street view', title: `The street: mostly Buy after the Q1 update; median target ₹${n0(medTp)}`,
  blocks: [
    { p: D.street.coverage + ' ' + D.street.method },
    { exhibit: { type: 'table', title: 'Broker notes we found', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Basis', 'Date', 'Standing on 30-Sep-2026'], wide: [4], rows: streetRows, source: 'ICICI Direct PDF (11-Aug-2026), Motilal Oswal PDF (10-Aug-2026), JM Financial PDFs (9-Apr and 23-May-2026), Business Today and Equentis (8-Jul-2026)' } },
    { p: `The median of the six notes standing on 30-Sep-2026 is ₹${n0(medTp)} (range ₹1,250-1,600); S&P Global's 21-analyst average in June was ₹1,300. The swing between brokers is mostly two things: what Naukri is worth (JM's 30x against Motilal Oswal's DCF, worth ~${n1(X.moslRecX)}x our Sep-28E Recruitment profit) and whether the stakes deserve a discount (JM 25%, Motilal Oswal none). At JM's 25% the two stakes are worth ₹${n0(listedMv * 0.75 / sh)} a share; at Motilal Oswal's none, ₹${n0(listedMv / sh)}. The share price fell from ~₹1,363 after the results (11-Aug) to ₹${n0(price)} on 30-Sep-2026, below every target.` },
    { h: 'What the bears and bulls argue' },
    { bullets: [
      ...D.critiques.map(c => `**Bear:** ${c}`),
      '**Bull:** Q1FY27 Recruitment billings (+17.5%) grew at almost twice the FY26 pace (+10%) and lead revenue by about two quarters; AI products are adding price, not taking volume.',
      '**Bull:** 99acres is turning profitable after years of investment; at 25-30% long-run margins it becomes a second profit pool.',
      `**Bull:** stakes and cash alone are ₹${n0((listedMv + CASH + UNL) / sh)} a share before any discount; the market pays little for the best classifieds business in India.`,
    ] },
  ],
};

module.exports = { forecasts, street, saEps, saPat, saRev, saEbitda };
