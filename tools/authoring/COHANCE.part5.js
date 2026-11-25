// Cohance Lifesciences report, part 5: Q1FY27 and the call, our forecasts vs the street, the street view and critiques.
const X = require('./COHANCE.ctx');
const { C, D, A, F, AS, n0, n1, n2, b, YRS, LINES, Q1, epsU, ST, withTp, medTp, bob, icici, jef, gs, mac, CONS, gapBob, rating, MULT, HB, k, shortDate, price, epsSep28, implPeAtPrice, oiBuild, intBuild, taxBuild, ent, eff26, GROSS0, TY, MISC, yld26, yldQ1 } = X;

const q1 = {
  id: 'q1fy27', nav: 'Q1FY27 and the call', kicker: 'Latest quarter', title: 'Q1FY27: the "lowest quarter ever", as guided: revenue −23%, adjusted EBITDA margin 2.2%, a ₹24 cr loss; recovery promised from H2',
  blocks: [
    { p: `Revenue was ₹${n1(Q1.revenue)} cr (−23% YoY): Pharma CDMO ₹${n1(Q1.pharmaCdmo)} cr (−39%; deliveries moved into Q2), API+ ₹${n1(Q1.apiPlus)} cr (−10%; order timing and a customer-site event) and Specialty Chemicals ₹${n1(Q1.specChem)} cr (−35%; agro shipments in H2). Gross margin was ${Q1.grossMarginPct}%. Reported EBITDA was ₹${n1(Q1.ebitdaReported)} cr; adding back ₹2.6 cr of one-time costs and ₹5.4 cr of FX gains gives the company's "adjusted" ₹${n1(Q1.ebitdaAdjusted)} cr (2.2%). Standalone adjusted EBITDA was ₹${n1(Q1.standaloneAdjEbitda)} cr (9.2%); NJ Bio lost ₹${n1(-Q1.njBioAdjEbitda)} cr; Sapala grew 2.5x. After ₹49.5 cr of D&A, the loss before minorities was ₹45 cr; owners' share −₹24.1 cr (EPS −₹0.63). Cash was the bright spot: free cash flow of ₹106 cr as receivables fell, net cash ₹${n0(Q1.netCash)} cr.` },
    { exhibit: { type: 'table', title: 'What management said on 5-Aug-2026, and what we take from it', head: ['Topic', 'What was said', 'Our read'], wide: [1, 2], rows: [
      ['FY27 shape', 'Q2 better than Q1; year-on-year comparability by end-H1; growth in H2', 'We model FY27 revenue −2%'],
      ['FY27 margin', '"Closer to previous year margin percentage" (FY26 adjusted 21%); acceleration from FY28', 'We model 15.5% reported (~17.5% adjusted)'],
      ['CDMO', 'Restocking order received for one molecule (Q4FY27-FY28); two new commercial molecules ship Q2-Q3; 10 Phase III', 'Recovery real but back-ended'],
      ['NJ Bio', 'FTE contract risk this year; cost to be matched to revenue; profitability "medium-term"', 'Losses ~₹150 cr pre-tax in FY27E'],
      ['Sapala', 'Path to full ownership by FY30; founder leads the nucleic-acid business', 'More cash out for minorities later'],
      ['US$1 bn FY30', '"An aspiration... we may be a little bit away from it"; update by December', 'Target effectively withdrawn'],
      ['Quality', 'Pashamylaram Form 483 with five observations, none on data integrity', 'Watch the response'],
      ['CFO', 'Himanshu Agarwal leaves on 13-Sep-2026; succession in progress', 'Another senior change'],
    ], source: 'Q1FY27 call transcript (5-Aug-2026, filed 11-Aug-2026) and deck' } },
  ],
};

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: revenue −2% / +16% / +13%, EBITDA margin ${AS.ebitdaMargin.join('% / ')}%, EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}: 14-23% below BOBCAPS`,
  blocks: [
    { p: `We build revenue from five lines (table below), margins from a cost base of ~₹300 cr a quarter against a ~71% gross margin, and attributable profit entity by entity: tax at 25.5% outside NJ Bio, no tax credit on NJ Bio's losses, and the minorities' share (44% of NJ Bio's losses, 32.5% of Sapala's profit) added back. Other income is built: ${TY}% on average cash and liquid funds (FY26 ${n1(yld26)}%; Q1FY27 ${n1(yldQ1)}% annualised) on ₹${n0(GROSS0)} cr at Mar-26 moving with our cash flow, plus ₹${MISC} cr of recurring items = ₹${oiBuild.map(n1).join(' / ')} cr (FY26 ₹34.1 cr incl. ₹5.5 cr FX and ₹1.8 cr asset-sale gains, which we leave out). Interest ₹${intBuild.map(n1).join(' / ')} cr (7% on ~₹225 cr of leases, 7.5% on borrowings). Tax plus minorities ${taxBuild.join('% / ')}% of PBT (FY26 ${n1(eff26)}%).` },
    { exhibit: { type: 'table', title: 'Revenue build (₹ crore)', head: ['Line', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [5], rows: [
      ['Small-molecule CDMO incl. ADC payloads', n0(AS.businessLines.base.smallMol), ...LINES.smallMol.map(n0), 'Q1 ~₹62 cr; restocking and new molecules from H2FY27-FY28'],
      ['NJ Bio', n0(AS.businessLines.base.njBio), ...LINES.njBio.map(n0), 'FTE risk in FY27; US facility for FY28'],
      ['Sapala', n1(AS.businessLines.base.sapala), ...LINES.sapala.map(n0), 'Q1 ₹27 cr (2.5x); orders in hand'],
      ['API+', n0(AS.businessLines.base.apiPlus), ...LINES.apiPlus.map(n0), 'Nacharam normalising; double-digit from FY28'],
      ['Specialty Chemicals', n1(AS.businessLines.base.specChem), ...LINES.specChem.map(n0), 'Qualification year; double-digit from FY28'],
      { hl: true, cells: ['**Total = model revenue**', `**${n0(A.sales[b])}**`, ...F.sales.map(v => `**${n0(v)}**`), 'Checked in COHANCE.ctx.js'] },
    ], source: 'GAM estimates; company decks and calls' } },
    { exhibit: { type: 'table', title: 'From EBITDA to EPS (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['EBITDA (reported basis)', '{{A.ebitda.7|num}}', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['Depreciation and amortisation', '{{A.dep.7|num}}', '{{F.dep.0|num}}', '{{F.dep.1|num}}', '{{F.dep.2|num}}'],
      ['Other income (built)', '34 (4.6 on Screener)', '{{F.otherIncome.0|num}}', '{{F.otherIncome.1|num}}', '{{F.otherIncome.2|num}}'],
      ['Interest', '{{A.interest.7|num}}', '{{F.interest.0|num}}', '{{F.interest.1|num}}', '{{F.interest.2|num}}'],
      ['Profit before tax', '{{A.pbt.7|num}}', '{{F.pbt.0|num}}', '{{F.pbt.1|num}}', '{{F.pbt.2|num}}'],
      ['Tax', '57', ...ent.map(e => n0(e.tax))],
      ['Minorities\' share (negative = losses absorbed)', '−29', ...ent.map(e => n0(e.nci))],
      { hl: true, cells: ['**Profit attributable to owners**', '**{{A.pat.7|num}}**', '**{{F.pat.0|num}}**', '**{{F.pat.1|num}}**', '**{{F.pat.2|num}}**'] },
      ['EPS (₹)', '4.68', ...epsU.map(n2)],
    ], source: 'AR FY26; GAM estimates (FY26 PBT is after ₹29.5 cr of exceptional items)' } },
    { exhibit: { type: 'table', title: 'Our forecasts vs the street (notes standing on 30-Sep-2026)', head: ['', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue: GAM / BOBCAPS (₹ cr)', `${n0(F.sales[0])} / ${n0(bob.sales.FY27E)}`, `${n0(F.sales[1])} / ${n0(bob.sales.FY28E)}`, `${n0(F.sales[2])} / ${n0(bob.sales.FY29E)}`],
      ['EBITDA: GAM / BOBCAPS (₹ cr)', `${n0(F.ebitda[0])} / ${n0(bob.ebitda.FY27E)}`, `${n0(F.ebitda[1])} / ${n0(bob.ebitda.FY28E)}`, `${n0(F.ebitda[2])} / ${n0(bob.ebitda.FY29E)}`],
      ['EPS: GAM / BOBCAPS (₹)', `${n2(epsU[0])} / ${n2(bob.eps.FY27E)}`, `${n2(epsU[1])} / ${n2(bob.eps.FY28E)}`, `${n2(epsU[2])} / ${n2(bob.eps.FY29E)}`],
      ['GAM vs BOBCAPS EPS', ...gapBob.map(v => `${Math.round(v)}%`)],
      ['Consensus EPS (S&P Global, 10 analysts)', `${n2(CONS.FY27E)} (range 3.40-5.83)`, 'n.a.', 'n.a.'],
    ], source: 'BOBCAPS 10-Aug-2026; S&P Global consensus (stockanalysis.com, targets last updated 6-Aug-2026); GAM' } },
    { callout: `**Why we are below the street:** a lower margin (we do not assume the guided ~21% adjusted FY27 margin after a 2.2% Q1) and NJ Bio losses that narrow only slowly. On revenue we are close to BOBCAPS in FY27 and a little above in FY28-29 on restocking. The swing factor is the second destocked molecule: if it returns in FY28, revenue and EPS could be 5-10% higher.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: targets ₹${n0(Math.min(...withTp.map(s => s.tp)))}-${n0(Math.max(...withTp.map(s => s.tp)))}, median ₹${n0(medTp)}; three Sells and two Buys in the notes we could read`,
  blocks: [
    { p: `Five notes we could read stood on 30-Sep-2026. After Q1FY27, BOBCAPS kept Sell at ₹${bob.tp} (40x Jun-28E EPS of ₹7.9, 10-Aug), ICICI Securities Sell at ₹${icici.tp} (6-Aug), Jefferies Underperform with its target raised to ₹${jef.tp} (6-Aug; downgraded from Hold in May), Goldman Sachs Buy at ₹${gs.tp} and Macquarie Outperform at ₹${n0(mac.tp)} (a target that looks unchanged since 2025). Only BOBCAPS discloses a method in what we could access: P/E. S&P Global's consensus of 10 analysts was Hold with an average target of ₹${CONS.tpAvg} and a median of ₹${CONS.tpMed}. The bears point to the API+-heavy mix, NJ Bio and only one of two molecules restocking; the bulls to a new chairman, a pipeline and a low base.` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY28E EPS (₹)', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method} ${s.multiple}x ${s.on}` : 'n.d.', s.eps?.FY28E ? n2(s.eps.FY28E) : '–', s.thesis]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E**`, `**${n2(epsU[1])}**`, 'Recovery is real but back-ended and smaller than the price assumes'] },
    ], source: D.street.note } },
    { p: `**Where we stand.** We are closest to BOBCAPS: our multiple (${MULT.base}x) is near its 40x and our EPS lower, so our target (₹{{dcf.tp|num}}) is close to its ₹${bob.tp}. Our multiple comes from the listed share's own forward P/E since Apr-2021 (${n1(HB.med)}x, trough years left out) × the pharma sector's +8.2%. The bulls' targets (₹${gs.tp}-${n0(mac.tp)}) need either a much faster recovery or the stock to keep a ~${Math.round(implPeAtPrice)}x multiple on Sep-28E EPS of ₹${n1(epsSep28)}.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [c]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

module.exports = { q1, forecasts, street };
