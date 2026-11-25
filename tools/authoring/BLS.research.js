// BLS report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// Visa & Consular, Digital, moat, Q1FY27, earnings quality, ownership, governance, forecasts, street, valuation, verdict,
// glossary, statement notes). Shared inputs in BLS.ctx.js; forecast and valuation figures are live tokens ({{...}}) that
// follow assumptions.json. As of 30-Sep-2026.
const X = require('./BLS.ctx');
const { F, A, SA, SQ, n0, n1, pc, price, mv, FM, MV, MULT, SENS, epsSep, at, rating, idbi, sepNow, fwdNow, A26, Q1, seg, b, AS } = X;
const P2 = require('./BLS.part2'), P3 = require('./BLS.part3'), P4 = require('./BLS.part4'), P5 = require('./BLS.part5'), P6 = require('./BLS.part6');
const L8 = SQ.slice(-8), yoy = (k, qq) => { const i = SQ.indexOf(qq); return i >= 4 ? Math.round((qq[k] / SQ[i - 4][k] - 1) * 1000) / 10 : null; };
const epsH = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(l => A.eps[A.labels.indexOf(l)]);

const cover = {
  headline: 'A 40%-margin visa franchise at under 10x earnings: cheap, but volumes have stalled, growth now comes at thin margins and the sector has de-rated by 40%',
  lead: `BLS International runs visa centres for 46 governments (Spain, Italy, Germany via iDATA, India's missions) and a listed digital arm (BLS E-Services, ~53%). Q1FY27 revenue rose 25% and EBITDA 24%, but visa applications were flat and EPS rose only 11% as tax, depreciation and minorities took more. We forecast EPS of ₹${n1(F.eps[0])} / ₹${n1(F.eps[1])} / ₹${n1(F.eps[2])} for FY27-29E. The street (IDBI Capital, the only active broker: Buy, ₹${n0(idbi.tp)}) values BLS on **P/E**. On the house rule we start from its own one-year-forward P/E median since Apr-2021 (${n1(FM.median)}x) and apply the sector move of the travel + internet set used for TBO Tek (IRCTC, Thomas Cook, Info Edge, IndiaMART vs five-year medians, ${pc(MV.set)}). **${MULT.base}x Sep-28E EPS of ₹${n1(epsSep.base)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** The result sits just below the BUY line and the peer set matters: with IRCTC's five-name set the value is ₹${n0(at(SENS.irctc))}, with no sector move ₹${n0(at(SENS.none))}; the DCF (Ke 12.5%) says ₹${n0(mv('dcf').value)}. Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}.`,
  arguments: [
    { h: 'The visa business is excellent, but its margin gain is over', p: `Visa & Consular earns ~90% of group EBITDA at a ${n1(A26.visaMargin)}% margin (14.6% in FY22) after BLS took its centres in-house and sold more value-added services. Management now guides "maintain ~40%" and says net revenue per application is "stabilising". Applications were flat at 11.3 lakh in Q1FY27; growth is price, mix and contract wins.` },
    { h: 'New growth earns a fraction of the visa margin', p: `Aadhaar Seva Kendras (₹2,055 cr UIDAI order) add ~₹400 cr a year of revenue by FY28E at 10-15%; Digital (39% of revenue) earns ~8% and ~47% of it belongs to outside shareholders; Atyati (₹157 cr, Jul-2026) adds ₹275 cr of revenue at 7.5%. So revenue grows {{F.salesGrowth.0|pct0}} in FY27E but EPS only {{F.epsGrowth.0|pct0}}.` },
    { h: 'Government and tender risk is real, as 2025 showed', p: 'The MEA barred BLS from new Indian-mission tenders for two years on 9-Oct-2025 (complaints including charging for optional services); the Delhi High Court quashed the order on 18-Dec-2025 on process, leaving the MEA free to issue a fresh, specific notice. Contracts are re-tendered every 3-10 years and country revenue is not disclosed.' },
    { h: 'Valuation: cheap against its history and its cash, less so against its peers', p: `At ₹${n0(price)} BLS trades at ${n1(fwdNow)}x FY28E and ${n1(sepNow)}x Sep-28E EPS vs a ${n1(FM.median)}x forward median since 2021; net cash is ₹1,617 cr (~₹39 a share). But its travel and internet peers trade ${Math.abs(Math.round(MV.set))}% below their own medians, and foreign funds cut their stake from 10.9% to 4.1% in eighteen months. We need visa volumes or a contract win to be more positive.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Policy & governance', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): visa applications after the West Asia war, Atyati\'s first quarter, the Aadhaar ramp and D&A.',
    'New global tenders (management cites a US$1-2 bn pipeline over the next one to two years) and renewals of existing European contracts.',
    'Any fresh MEA show-cause notice, or new Indian-government awards now that the debarment is quashed.',
    'Capital allocation: further acquisitions (~₹2,000 cr budget over four to five years) or a buyback (not under consideration as of Aug-2026).',
    'UAE corporate-tax changes affecting the free-zone subsidiary (management: ~1 point on the group rate).',
  ],
};

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'stacked', title: 'Digital has grown to 39% of revenue', unit: 'Segment revenue (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Visa & Consular', values: SA.map(a => Math.round(a.visaRev)), fmt: 'num' }, { name: 'Digital Services', values: SA.map(a => Math.round(a.digRev)), fmt: 'num' }], minLabel: 200, source: 'Company investor presentations' },
      { type: 'column', title: 'But visa still makes ~90% of the profit', unit: 'FY26 segment EBITDA (₹ crore)', x: ['Visa & Consular', 'Digital Services'], series: [{ name: 'EBITDA', values: [Math.round(A26.visaEbitda), Math.round(A26.digEbitda)], fmt: 'num' }], labels: 'all', source: 'Q4FY26 investor presentation' },
    ] },
    { pair: [
      { type: 'line', title: 'Visa margin: 15% to 40% in three years, now flat', unit: 'Visa & Consular EBITDA margin (%)', x: SA.map(a => a.fy), series: [{ name: 'Visa margin', values: SA.map(a => a.visaMargin), fmt: 'pct' }], labels: 'all', min: 0, max: 45, source: 'Company investor presentations' },
      { type: 'line', title: 'Applications flat year on year in Q1FY27', unit: 'Year-on-year change (%)', x: L8.map(x => x.q), series: [{ name: 'Applications', values: L8.map(x => yoy('apps', x)), fmt: 'pct' }, { name: 'Net revenue per application', values: L8.map(x => yoy('nrpa', x)), fmt: 'pct' }], labels: 'last', source: 'Company quarterly presentations' },
    ] },
    { pair: [
      { type: 'column', title: `EPS growth slows to ~${Math.round(X.epsCagrFwd)}% a year (FY26-29E) from ${Math.round(X.epsCagrHist)}% (FY23-26)`, unit: 'EPS to owners (₹)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EPS', values: [...epsH, ...F.eps.map(e => Math.round(e * 10) / 10)], fmt: 'n1' }], labels: 'all', source: 'Screener.in; GAM estimates' },
      { type: 'column', title: 'Tax and minorities take a bigger bite', unit: 'Tax + minorities, % of profit before tax', x: ['FY24', 'FY25', 'FY26', 'Q1FY27', 'FY27E', 'FY28E'], series: [{ name: 'Leakage', values: [Math.round((1 - A.pat[b - 2] / A.pbt[b - 2]) * 1000) / 10, Math.round((1 - A.pat[b - 1] / A.pbt[b - 1]) * 1000) / 10, Math.round((1 - A.pat[b] / A.pbt[b]) * 1000) / 10, Math.round((1 - Q1.patOwners / Q1.pbt) * 1000) / 10, AS.taxRate[0], AS.taxRate[1]], fmt: 'pct' }], labels: 'all', source: 'Screener.in (owners\' profit); GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Forward P/E: ${n1(fwdNow)}x FY28E now vs a ${n1(FM.median)}x median since 2021`, unit: 'Price ÷ next full-year EPS (x)', x: FM.series.map(x => x[0]), series: [{ name: 'Forward P/E', values: FM.series.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', yearTicks: true, yearStep: 1, lines: [{ v: MULT.base, text: `Our multiple: ${MULT.base}x`, color: '#cf8f1f' }, { v: SENS.none, text: `Own median: ${SENS.none}x` }], source: 'Screener.in prices; actual EPS, GAM estimates for FY27-28E' },
      { type: 'hbar', title: 'Our target vs the street and the sensitivities', unit: `₹ per share; CMP ₹${n0(price)}`, x: ['IDBI Capital', 'DCF', 'No sector move', 'IRCTC five-name set', 'GAM (base)'], series: [{ name: 'Value', values: [idbi.tp, Math.round(mv('dcf').value), at(SENS.none), at(SENS.irctc), X.V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: 'IDBI Capital (21-May-2026); GAM Research' },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.visa, P3.digital, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
