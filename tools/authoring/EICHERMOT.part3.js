// Eicher Motors report, part 3: Royal Enfield (volume x realisation build), VECV (the 54.4% JV) and the moat.
const X = require('./EICHERMOT.ctx');
const { C, D, SG, SA, SQ, QL, A26, A25, F, AS, bld, vb, real26, n0, n1, pc, pc1, rup, vecvSep28, SOTP, MULT } = X;
const MO = C.monthly, Q1 = C.q1fy27;
const pctG = (a, b) => pc1((a / b - 1) * 100);

const re = {
  id: 're', nav: 'Royal Enfield', kicker: 'Segment: Royal Enfield', title: 'Royal Enfield: volume-led growth, a cheaper mix, and margins a notch lower',
  blocks: [
    { p: `Royal Enfield sold ${n0(A26.units)} motorcycles in FY26 (+22.4%): ${n0(A26.domesticUnits)} in India (+23%) and ${n0(A26.internationalUnits)} abroad (+20%). Q1FY27 was its best quarter ever at ${n0(C.quarterlyKpis[4].unitsPL)} (+27%; India 301,174, abroad 31,766). Momentum held into the festive build-up: +34% in July and +11% in August against a stronger base (Apr-Aug ${n0(MO.ytd.total)}, +${Math.round((MO.ytd.total / MO.ytd.totalPrior - 1) * 100)}%; domestic +28%, exports −9%). The 350s carry the growth: ~93% of Q1FY27 domestic volume (280,136 of 301,174). Above 350cc, the Guerrilla 450 (~2,500 a month) and the 650 twins (~4,000-4,200) only got back to their pre-GST run-rate in July; the Himalayan, Super Meteor and Shotgun were still weak.` },
    { p: `Revenue per motorcycle tells the mix story. Two-wheeler revenue per unit rose only 1.7% in FY26 to ₹${n0(real26)}, despite price rises, because the cheaper 350s grew fastest. Total revenue per unit (incl. allied) was ₹190,621; Q1FY27's ₹199,207 (+3.2% YoY) was helped by price (+1.2% QoQ), a higher international share (15.3% of revenue) and allied growth (+23%). Allied revenue (spares, accessories, apparel, service) was ₹${n0(A26.spares + A26.accessories + A26.warranties + A26.otherOperating)} cr in FY26 (+${Math.round(((A26.spares + A26.accessories + A26.warranties + A26.otherOperating) / (A25.spares + A25.accessories + A25.warranties + A25.otherOperating) - 1) * 100)}%): steady, recurring, and in our view higher-margin than motorcycles (the company does not disclose its margin).` },
    { pair: [
      { type: 'column', title: 'Quarterly volumes: above 3 lakh for four quarters running', unit: 'Royal Enfield dispatches (monthly-release basis)', x: QL, series: [{ name: 'Units', values: SQ.map(q => q.units), fmt: 'num' }], labels: 'all', source: 'Monthly releases; MOSL (Q2-Q3FY26, rounded to thousands)' },
      { type: 'line', title: 'Standalone EBITDA margin 26.6% in Q3FY26, 24.3% in Q1FY27', unit: 'EBITDA margin (%)', x: QL, series: [{ name: 'Royal Enfield standalone', values: SQ.map(q => q.saMarginPct), fmt: 'pct' }, { name: 'Consolidated', values: SQ.map(q => q.consMarginPct), fmt: 'pct' }], labels: 'all', min: 20, max: 28, source: 'MOSL Q1FY27 results update; Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'Our Royal Enfield build: volume × realisation + allied (₹ crore unless stated)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Domestic volume', n0(A26.domesticUnits), ...bld.map(r => n0(r.dom))],
      ['International volume', n0(A26.internationalUnits), ...bld.map(r => n0(r.intl))],
      { hl: true, cells: ['**Total volume**', `**${n0(A26.units)}**`, ...bld.map(r => `**${n0(r.units)}**`)] },
      ['  growth', '+22.4%', ...bld.map((r, i) => pctG(r.units, i ? bld[i - 1].units : A26.units))],
      ['Motorcycle realisation (₹ per bike)', n0(real26), ...bld.map(r => n0(r.real))],
      ['Motorcycle revenue', n0(A26.motoRevenue), ...bld.map(r => n0(r.moto))],
      ['Allied revenue (spares, accessories, apparel, services)', n0(A26.reRevenue - A26.motoRevenue), ...bld.map(r => n0(r.allied))],
      { hl: true, cells: ['**Revenue (build)**', `**${n0(A26.reRevenue)}**`, ...bld.map(r => `**${n0(r.rev)}**`)] },
      ['Revenue in the model (volume × revenue per unit)', n0(A26.reRevenue), ...bld.map(r => n0(r.model))],
      ['EBITDA margin', '24.7%', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}'],
    ], source: 'AR FY26 notes 28 and 44; Q4FY26 call; GAM estimates (assumptions.json "build"); the model and build agree within 0.1%' } },
    { exhibit: { type: 'table', title: 'Monthly dispatches standing on 30-Sep-2026', head: ['Month', 'Total', 'YoY', 'Domestic', 'Exports', 'Up to 350cc', 'Above 350cc'], rows: [
      ...MO.rows.map(r => [r.m, n0(r.total), r.totalPrior ? pctG(r.total, r.totalPrior) : `+${r.yoyPct}%`, r.domestic ? n0(r.domestic) : 'n.d.', r.exports ? n0(r.exports) : 'n.d.', r.upTo350 ? `${n0(r.upTo350)} (${pctG(r.upTo350, r.upTo350Prior)})` : 'n.d.', r.above350 ? `${n0(r.above350)} (${pctG(r.above350, r.above350Prior)})` : 'n.d.']),
      { hl: true, cells: ['**Apr-Aug 2026**', `**${n0(MO.ytd.total)}**`, `**${pctG(MO.ytd.total, MO.ytd.totalPrior)}**`, `**${n0(MO.ytd.domestic)}**`, `**${n0(MO.ytd.exports)} (${pctG(MO.ytd.exports, MO.ytd.exportsPrior)})**`, '', ''] },
    ], source: 'Monthly sales releases via Rushlane and Autocar Pro. Sep-2026 sales are released in early October, after our as-of date.' } },
    { callout: `**Our view:** we expect volumes of {{F.volume.0|num}} in FY27E (+{{as.volume.growth.0|n1}}%), then ~10% and ~9% growth, with motorcycle realisation up only 2% a year and allied revenue growing 13-20%. That is ~11-12% volume CAGR, close to Kotak (11%) and below Nuvama and MOSL (14-15%). The upside risk is that the GST step-up keeps going; the downside risk is that it was a one-off and the festive base from Sep-2026 bites harder than we assume.` },
  ],
};

const VS = SG.vecvSegments;
const vecv = {
  id: 'vecv', nav: 'VECV (trucks & buses)', kicker: 'Segment: VECV (54.4%)', title: 'VECV: a well-run #1 in light trucks, cyclical, ~10% of our valuation',
  blocks: [
    { p: `VECV sold ${n0(A26.vecvVolume)} vehicles in FY26 (+14.7% vs ~13% for the industry), its first year above 1 lakh, with revenue of ₹${n0(A26.vecvRevenue)} cr and net profit of ₹${n0(A26.vecvPat)} cr (₹${n0(A26.vecvPatPreExceptional)} cr before a labour-code charge). It leads light and medium trucks (34.9% share), is #3 in heavy trucks (9.1%) and buses, and entered small trucks with the Eicher Pro X (2,452 in FY26, a third electric). Q1FY27: ${n0(Q1.vecv.volume)} vehicles (+14.8%), revenue ₹${n0(Q1.vecv.revenue)} cr (+16.6%), EBITDA margin ${Q1.vecv.ebitdaMarginPct}% (commodities), PAT ₹${n0(Q1.vecv.pat)} cr (+6.5%); Eicher's share ₹167.5 cr. VECV's margins are thin (8-10% EBITDA) and its profits swing with the truck cycle: Eicher's share was ₹60 cr in FY22 and ₹798 cr in FY26.` },
    { exhibit: { type: 'table', title: 'VECV by segment: volumes and market share', head: VS.head, rows: VS.rows.map(r => r.map((x, i) => (i === 0 ? x : x == null ? '–' : i === 3 || i === 6 ? `${x}%` : n0(x)))), source: 'Q4FY26 and Q1FY27 investor presentations' } },
    { exhibit: { type: 'table', title: 'VECV P&L and Eicher\'s share (₹ crore)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Volume', ...SA.slice(1).map(a => n0(a.vecvVolume)), ...vb.map(r => n0(r.vol))],
      ['Revenue', ...SA.slice(1).map(a => n0(a.vecvRevenue)), ...vb.map(r => n0(r.rev))],
      ['EBITDA (revenue less operating costs)', ...SA.slice(1).map(a => n0(a.vecvEbitda)), ...vb.map(r => n0(r.ebitda))],
      ['  margin', ...SA.slice(1).map(a => n1(a.vecvEbitda / a.vecvRevenue * 100) + '%'), ...vb.map(r => n1(r.margin) + '%')],
      ['Net profit', ...SA.slice(1).map(a => n0(a.vecvPat)), ...vb.map(r => n0(r.pat))],
      { hl: true, cells: ['**Eicher\'s 54.4% share**', ...SA.slice(1).map(a => `**${n0(a.jvShare)}**`), ...vb.map(r => `**${n0(r.share)}**`)] },
      ['  per Eicher share (₹)', ...SA.slice(1).map(a => n1(a.jvShare / 27.4)), ...X.vecvShareEps.map(n1)],
    ], source: 'Investor presentations (FY26 PAT after a ₹58.8 cr exceptional charge; company-quoted FY26 EBITDA ₹2,563 cr); GAM estimates (assumptions.json "vecv")' } },
    { pair: [
      { type: 'column', title: 'VECV volumes are seasonal: Q4 is the big quarter', unit: 'VECV vehicles per quarter', x: QL, series: [{ name: 'VECV', values: SQ.map(q => q.vecvVolume), fmt: 'num' }], labels: 'all', source: 'Investor presentations; MOSL' },
      { type: 'line', title: 'VECV EBITDA margin 7.8-10.4%', unit: 'VECV EBITDA margin (%)', x: QL, series: [{ name: 'EBITDA margin', values: SQ.map(q => q.vecvMarginPct), fmt: 'pct' }], labels: 'all', min: 5, max: 12, source: 'MOSL Q1FY27 results update' },
    ] },
    { callout: `**How we value it:** ${MULT.vecv.base}x Eicher's share of Sep-28E VECV profit (₹${n1(vecvSep28)} a share) = ₹${n0(SOTP.base.ve)} a share, ~${Math.round(SOTP.base.ve / SOTP.base.perShare * 100)}% of our SOTP. The multiple is Ashok Leyland's own forward P/E median since 2021 cut by the auto-sector de-rating (Ashok is the closest listed truck maker). The street uses 10-13x EV/EBITDA (PL, MOSL, JM, Elara) or 18-25x P/E (Kotak, ICICI, Nuvama). Our forecast has VECV profit growing ~11% a year from FY26 to FY29E; in a CV downturn it can collapse (VECV earned only ₹57 cr in FY21 and ₹111 cr in FY22).` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real moat in 350cc, a weaker one above it, unproven in EVs',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls, SIAM via the company, Rushlane, broker notes to Sep-2026)' },
    { callout: '**Honest verdict:** Royal Enfield has one of the few genuine moats in Indian manufacturing: a brand that defines its category, a cost position from running one engine platform at ~1 mn units a year, and a community and service network rivals have not copied in a decade of trying. But the moat is narrower than the market share suggests. It is strongest in 350cc commuter-upgrade bikes, where price matters; above 350cc the GST rise showed buyers are price-sensitive; and in electric motorcycles RE starts from zero. The moat protects **volume and share**, not an ever-rising margin.' },
  ],
};

module.exports = { re, vecv, moat };
