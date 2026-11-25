// Devyani report, part B: cover, the story in charts, and the merger of part2-6 (business, history, industry, tailwind test,
// India, International, rent and margins, the Sapphire merger, moat, Q1FY27, earnings quality, ownership, governance,
// forecasts, street, valuation, verdict, glossary, statement notes). Shared inputs in DEVYANI.ctx.js; forecast and valuation
// figures are live tokens ({{...}}) that follow assumptions.json. As of 30-Sep-2026.
const X = require('./DEVYANI.ctx');
const { F, V, A, b, Q1, f26, f25, n0, n1, n2, pc1, price, mv, HEV, sectorEv, evMULT, ebitdaSep28, rating, post, medTp, preMultAt, preEbitda, preEbitda26, evSepNow, phiSep, PF, streetAtOurs } = X;
const P2 = require('./DEVYANI.part2'), P3 = require('./DEVYANI.part3'), P4 = require('./DEVYANI.part4'), P5 = require('./DEVYANI.part5'), P6 = require('./DEVYANI.part6');
const sd = d => { const [y, m, dd] = d.split('-'); return `${+dd}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]}`; };
const tpPre = preMultAt(V.tp);

const cover = {
  headline: 'KFC is growing again and the stock trades well below its own history; the Sapphire merger is upside we do not pay for',
  lead: `Devyani runs 2,255 restaurants: KFC and Pizza Hut for Yum! in north, east and central India, KFC in Thailand (with Temasek as a 49% partner), Nigeria and Nepal, plus Costa Coffee, Biryani By Kilo and Vaango. FY26 revenue was ₹${n0(A.sales[b])} cr (+13%), EBITDA (before rent) ₹${n0(f26.ebitda)} cr, and the owners lost ₹38.6 cr. KFC same-store sales turned positive in Q4FY26 (+4.9%) and Q1FY27 (+${Q1.kfcSssg}%), and Q1FY27 EBITDA after rent rose 38%. We forecast EBITDA of ₹{{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr for FY27-29E. The street values Devyani on **EV/EBITDA** (after rent, 25-27x Mar/Jun-28E). The house rule (its own forward EV/EBITDA median since listing, ${n1(HEV.med)}x, adjusted by the QSR peers' ${pc1(sectorEv)} move against their five-year medians) gives **${evMULT.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr, less Temasek's share of Thailand (~${n1(phiSep * 100)}% of the value) = {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** That is ≈${n1(tpPre)}x after-rent EBITDA on the street's basis. Cross-checks are far lower (DCF ₹${n0(mv('dcf').value)}, P/E ₹${n0(mv('pe').value)}). Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}. The Sapphire merger (CCI and NCLT approvals pending on 30-Sep-2026) is not in the base.`,
  arguments: [
    { h: 'KFC has turned, and KFC is the business', p: `KFC India is 63% of India revenue. After 13 quarters of falling same-store sales, SSSG was +4.9% in Q4FY26 and +${Q1.kfcSssg}% in Q1FY27, dine-in rose to ${Q1.kfcOnPremisePct}% of sales and brand contribution reached 17%. Management guides 5-6% SSSG and 100-120 new KFC stores a year; it says KFC brand margins pass 20% at ₹105-110k of daily sales per store (₹${Q1.kfcAdsK}k now). We model KFC India revenue +${n0(X.indiaRows[0].kfcG)}% / +${n0(X.indiaRows[1].kfcG)}% / +${n0(X.indiaRows[2].kfcG)}% (stores +110 / 115 / 120).` },
    { h: 'Operating leverage is visible after rent', p: `Q1FY27 EBITDA after rent was ₹${n0(Q1.preIndAsEbitda)} cr (${Q1.preIndAsMarginPct}% of revenue, +1.5 points), the highest ever, despite LPG and wage inflation. On our numbers after-rent EBITDA rises from ₹${n0(preEbitda26)} cr in FY26 to ₹${n0(preEbitda[2])} cr in FY29E. But profit stays thin (EPS ₹{{F.eps.0|n2}} / ₹{{F.eps.1|n2}} / ₹{{F.eps.2|n2}}): depreciation and lease interest absorb most of the EBITDA, so the P/E is meaningless.` },
    { h: 'Half of Thailand is not Devyani\'s', p: `Thailand (₹1,692 cr of revenue, 30% of the group) is held through a company that is 49% owned by Camas, a Temasek affiliate; the effective minority is 52.45%. We deduct ~₹${n0(-X.spart(/minorities/).value)} cr for it (₹${n0(-X.spart(/minorities/).value / X.shares)} a share). Brokers who value consolidated EBITDA without this overstate the equity.` },
    { h: 'Valuation: cheap against its own past, not against cash flows', p: `At ₹${n2(price)} the stock trades at ${n1(evSepNow)}x Sep-28E EBITDA (grossed up for minorities), against a ${n1(HEV.med)}x forward median since listing; QSR peers trade ${Math.abs(Math.round(sectorEv))}% below their own five-year medians. The street's median target is ₹${n0(medTp)} (${post.length} post-results notes, all Buy). The DCF (₹${n0(mv('dcf').value)}) says cash flows do not yet support the price: the rating rests on the multiple.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin (before rent)', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Governance', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): KFC SSSG after +3.3% in Q1, store openings against the 200-225 plan (only -1 net in Q1), Pizza Hut losses.',
    'Sapphire merger: CCI approval, then the NCLT petition (the exchange letters of Jun-2026 allow six months to file), creditor and shareholder meetings; management targets completion by end-FY27.',
    'Yum! development agreements for the merged company, Pizza Hut waivers and the 19 Hyderabad KFC stores to be bought from Yum!.',
    'KFC global initiatives in India (Kwench beverages, sauces, boneless) and the BBK dine-in and Express formats.',
    'Rupee and baht: International (33% of revenue) gains when the rupee weakens.',
  ],
};

// ---------------------------------------------------------------- Story in charts
const STL = X.latest.slice().sort((a, c) => a.tp - c.tp);
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: `Revenue: ₹2,084 cr (FY22) to ₹${n0(A.sales[b])} cr (FY26), ₹{{F.sales.2|num}} cr in FY29E`, unit: 'Revenue (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Revenue', ref: 'fin.sales', fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'column', title: 'KFC India same-store sales: negative for 13 quarters, positive since Q4FY26', unit: 'KFC India SSSG (%)', x: ['Q1FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'KFC SSSG', values: [-0.7, 4.9, Q1.kfcSssg], fmt: 'pct' }, { name: 'Pizza Hut SSSG', values: [-4.2, -3.7, Q1.phSssg], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation (29-Jul-2026)' },
    ] },
    { pair: [
      { type: 'column', title: `EBITDA after rent: ${n1(Q1.q1fy26.preIndAs / Q1.q1fy26.revenue * 100)}% to ${Q1.preIndAsMarginPct}% of revenue in a year`, unit: 'Operating EBITDA, pre-Ind AS 116 (₹ crore)', x: X.SQ.map(q => q.q), series: [{ name: 'EBITDA after rent', values: X.SQ.map(q => q.preIndAs), fmt: 'num' }], labels: 'all', source: 'Company presentations; MOSL 30-Jul-2026 (Q2-Q3FY26)' },
      { type: 'donut', title: 'Where the revenue comes from (FY26)', unit: '% of FY26 revenue', x: ['KFC India', 'Pizza Hut India', 'Other India brands', 'Thailand', 'Nigeria and Nepal'], series: [{ name: 'Share', values: [f26.kfcRev, f26.phRev, f26.indiaRev - f26.kfcRev - f26.phRev, f26.thailandRev, f26.rowRev].map(v => Math.round(v / f26.revenue * 1000) / 10), fmt: 'pct' }], source: 'AR FY26 note 49; Q4FY26 presentation' },
    ] },
    { pair: [
      { type: 'column', title: `Net profit after minorities: ₹265 cr (FY23), −₹39 cr (FY26), ₹{{F.pat.2|num}} cr in FY29E`, unit: 'Net profit after minorities (₹ crore)', x: 'fin.labels', from: 'FY22', to: 'FY29E', series: [{ name: 'Net profit', ref: 'fin.pat', fmt: 'num' }], labels: 'all', source: 'Screener.in (after minorities); GAM estimates FY27-29E' },
      { type: 'line', title: `Forward EV/EBITDA: ${n1(X.evNow)}x FY28E now vs a ${n1(HEV.med)}x median since listing`, unit: 'EV (incl. leases, minorities grossed up) ÷ next full-year EBITDA (x)', x: X.fwdEvChart.map(x => x[0]), series: [{ name: 'Forward EV/EBITDA', values: X.fwdEvChart.map(x => x[1]), fmt: 'x', thin: true }], labels: 'last', lines: [{ v: evMULT.base, text: `Our multiple: ${evMULT.base}x`, color: '#cf8f1f' }], source: 'Screener.in prices; company EBITDA; FY27-28E GAM estimates' },
    ] },
    { pair: [
      { type: 'line', title: `Share price: ₹90 IPO (Aug-2021), ₹${n2(price)} on 30-Sep-2026`, unit: '₹ per share (weekly close)', x: X.M.price.series.filter(([d]) => d <= X.ASOF).map(x => x[0]), series: [{ name: 'Price', values: X.M.price.series.filter(([d]) => d <= X.ASOF).map(x => x[1]), fmt: 'inr', thin: true }], labels: 'last', lines: [{ v: 90, text: 'IPO ₹90', color: '#8c8c8c' }], source: 'Screener.in; NSE close on 30-Sep-2026' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (latest dated note per broker)', unit: `₹ per share; CMP ₹${n2(price)}`, x: [...STL.map(s => `${s.broker} (${sd(s.date)})`), 'GAM (base)'], series: [{ name: 'Target', values: [...STL.map(s => s.tp), V.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM (base)', lines: [{ v: 'P.last', axis: 'x', text: 'CMP', color: '#b4232a' }], source: `Dated notes Feb to Jul-2026 (see the street table); post-results median ₹${n0(medTp)}; GAM Research` },
    ] },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [narrative, P2.business, P2.history, P2.industry, P2.tailwind, P3.india, P3.intl, P3.margins, P3.merger, P3.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P4.forecasts, P5.street, P5.valuation, P6.risks, p.statements, P6.glossary],
  statementNotes: P6.statementNotes,
};
