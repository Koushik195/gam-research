// Syngene report, part 4: moat, margins, earnings quality, capital allocation (capex, Biocon's sales, ESOPs, dividends),
// ownership, management and governance.
const X = require('./SYNGENE.ctx2');
const { C, D, A, F, AS, n0, n1, b, ai, Q1, FY26, OIN, MULT, SHARES, cashPath, ptPerShare, SQ } = X;
const OW = D.ownership, MG = C.management;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in scale, the BMS model and regulatory record; weak in discovery pricing; the biologics edge is unproven without an anchor client',
  blocks: [
    { p: 'A moat is a lasting advantage that lets a company earn more than its cost of capital for longer than rivals. Syngene used to show one: ROE of 16-20% in FY19-21 on a net-cash balance sheet. It no longer does: ROE fell to 11% in FY25 and 6.6% in FY26, below a ~12% cost of equity. Part of that is cyclical (Librela, empty new plants), but part is structural: management itself says discovery has become commoditised. What remains durable is scale, the dedicated-centre model, and a clean regulatory record. Rivals for the same work include Sai Life, Aragen, Anthem, Jubilant Biosys and Piramal in India, and WuXi, Pharmaron and Samsung Biologics abroad.' },
    { verdicts: D.moat.map(m => [m.factor, m.score, m.why, m.score]), head: ['Factor', 'Score', 'Evidence', 'Detail'], title: 'Moat scorecard: two strong, two middling, one weak', source: 'AR FY26; company calls; GAM Research' },
    { callout: '**Verdict:** a narrow moat, narrower than three years ago. The BMS centre and the quality record are real advantages. Discovery FTE work has little pricing power, and the biologics manufacturing edge only becomes a moat if Syngene can win and keep commercial products other than Librela. We would not pay a premium for durability today; the target multiple is Syngene\'s own history, not a premium to it.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins', kicker: 'Profitability', title: 'Margins: 28-31% for six years, 24.6% in FY26, 12.4% in Q1FY27; we forecast 20.0% / 23.5% / 25.0%, below the mid-20s guide for FY27',
  blocks: [
    { p: `Syngene's margin (Screener basis = company operating EBITDA) held at 28-31% from FY19 to FY25. In FY26 it fell to ${n1(A.ebitdaMargin[b])}% and in Q1FY27 to ${n1(SQ.at(-1).ebitdaMarginPct)}%. Four things did it: (1) lost Librela volume on a fixed-cost biologics base; (2) staff costs up 14% in FY26 to ${FY26.staffPct}% of revenue, before cost cuts and severance (₹33 cr pre-tax in FY26, ₹13 cr in Q1FY27, booked as exceptional); (3) Unit 3 capitalised in Q1FY26, adding costs and depreciation; (4) forex hedge losses (₹61 cr in FY26, ₹50 cr in Q1FY27, i.e. 1.6 and 6.8 points of revenue) because forward contracts were struck at ~₹87/$ while the rupee fell past ₹89-95. Material costs are low and stable (~24-25% of revenue).` },
    { pair: [
      { type: 'line', title: 'Quarterly margins: material margin steady at 74-78%, EBITDA from 34% to 12%', unit: '% of revenue', x: SQ.map(q => q.q), series: [{ name: 'Material margin', values: SQ.map(q => q.materialMarginPct), fmt: 'pct' }, { name: 'EBITDA margin', values: SQ.map(q => q.ebitdaMarginPct), fmt: 'pct' }], labels: 'last', min: 0, max: 85, source: 'Screener.in (material margin = 100 − material cost %)' },
      { type: 'column', title: 'Cost lines, % of revenue: people costs drove the squeeze', unit: '% of revenue', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Materials', values: ['FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(A.materialPct[ai(f)] * 10) / 10), fmt: 'pct' }, { name: 'Employees', values: ['FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(A.employeePct[ai(f)] * 10) / 10), fmt: 'pct' }, { name: 'Other costs', values: ['FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(A.otherCostPct[ai(f)] * 10) / 10), fmt: 'pct' }], labels: 'all', source: 'Screener.in expense schedules' },
    ] },
    { exhibit: { type: 'table', title: 'From Q1FY27 to our FY27E margin', head: ['Step', 'EBITDA margin', 'Why'], wide: [2], rows: [
      ['FY26 reported', `${n1(A.ebitdaMargin[b])}%`, 'Incl. ₹61 cr hedge loss (1.6 points)'],
      ['Q1FY27 reported', `${n1(SQ.at(-1).ebitdaMarginPct)}%`, '₹50 cr hedge loss; 19% without it; revenue −16%'],
      ['Q2-Q4FY27 needed for our year', `~${n1((F.ebitda[0] - 91) / (F.sales[0] - Q1.revenue) * 100)}%`, 'Q2-Q4FY26 was ~25% with some Librela; cost cuts help, hedges still lose'],
      ['Management guide', 'mid-20s', 'Implies ~29% in Q2-Q4: Q4 seasonality, cost cuts, revenue uptick (CFO)'],
      { hl: true, cells: ['**Our FY27E**', '**{{F.ebitdaMargin.0|pct}}**', 'Below the guide: guidance was cut twice in six months'] },
      ['Our FY28E / FY29E', '{{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}', 'Hedges fade, revenue grows; Bayview costs enter the P&L in FY28'],
    ], source: 'Screener.in; company decks and calls; GAM estimates' } },
    { callout: `**Sensitivity:** each point of margin on Sep-28E revenue is ~₹${n0(X.ptEbitda)} cr of EBITDA, or ~₹${n0(ptPerShare)} a share at ${MULT.base}x. Getting back to FY25's 28.7% by FY29 would add ~₹${n0(ptPerShare * 3.7)} a share to our value; staying at 20% would take away ~₹${n0(ptPerShare * 4.25)}.` },
  ],
};

const earnings = {
  id: 'earnings', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: cash conversion is good, but exceptional items, hedge losses and capitalised costs need watching (AMBER)',
  blocks: [
    { exhibit: { type: 'table', title: 'Accounting checks', head: ['Item', 'What we found', 'Flag'], wide: [1], rows: [
      ['Cash conversion', `CFO ₹${n0(A.cfo[b])} cr vs EBITDA ₹${n0(A.ebitda[b])} cr in FY26 (FY25 ₹1,168 cr vs ₹1,045 cr); free cash ₹521 cr (company)`, 'GREEN'],
      ['Exceptional items', 'Every year since FY22 except FY25: FY26 −₹63 cr net (labour-code gratuity ₹38 cr, severance ₹25 cr); Q1FY27 −₹10 cr (more severance); FY25 +₹21 cr (insurance). Severance has been "exceptional" two quarters running', 'AMBER'],
      ['Forex hedge losses inside EBITDA', '₹61 cr FY26, ₹50 cr Q1FY27; cash-flow-hedge losses also in OCI (−₹196 cr FY26 total comprehensive loss items)', 'AMBER'],
      ['Capitalised pre-operating costs', '₹78.5 cr of Bayview pre-operating cost capitalised into CWIP in FY26; capitalisation timing is a judgement', 'AMBER'],
      ['Customer advances and deferred revenue', '₹915 cr of contract liabilities; customer-funded assets recognised as revenue over their life (part of ₹128 cr "other operating revenue")', 'GREEN'],
      ['Receivable write-off', '₹27.7 cr written off in Q2FY26 as unrecoverable balances due to cumulative FX changes (AR note 44)', 'AMBER'],
      ['ESOP cost', `₹${FY26.shareBasedComp} cr in FY26 (~1.1% of revenue), expensed`, 'GREEN'],
      ['Bill-and-hold revenue', 'A key audit matter for the auditor: some revenue is recognised before goods ship, when customers ask Syngene to hold delivery at period end; relevant when a commercial client is destocking', 'AMBER'],
      ['Related parties', 'The main campus sits in the Biocon SEZ; "other operating revenue" includes support-service and rental income linked to the Biocon Biologics SEZ developer', 'AMBER'],
    ], source: 'AR FY26 (consolidated statements, notes 18, 22, 36, 43, 44); company decks' } },
    { callout: '**Our view:** AMBER. The cash is real and the auditors (BSR & Co, KPMG network) signed clean, but "exceptional" severance two quarters running, large hedge losses and capitalised start-up costs all flatter one measure or another. We value on EBITDA before exceptional items and forecast no exceptional items; if severance continues, our EPS is too high.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital & Biocon', kicker: 'Capital allocation', title: `Capital allocation: ~₹${n0(Math.round((A.capex[ai('FY24')] + A.capex[ai('FY25')] + A.capex[ai('FY26')]) / 50) * 50)} cr of capex and acquisitions in FY24-26 while returns fell; small dividends; Biocon uses Syngene as a cash source`,
  blocks: [
    { exhibit: { type: 'table', title: 'Where the cash went (₹ crore)', head: ['', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Cash from operations', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => n0(A.cfo[ai(f)])), ...F.cfo.map(n0)],
      ['Capex (incl. acquisitions)', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => n0(A.capex[ai(f)])), ...F.capex.map(n0)],
      ['Free cash flow', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => n0(A.cfo[ai(f)] - A.capex[ai(f)])), ...F.fcf.map(n0)],
      ['ROE', ...['FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => n1(A.roe[ai(f)]) + '%'), ...F.roe.map(v => n1(v) + '%')],
    ], source: 'Screener.in (capex = CFO less free cash flow; FY24 includes part of Unit 3, FY25 Bayview); GAM estimates' } },
    { p: `**Capex and acquisitions.** Syngene spent ~₹${n0(A.capex[ai('FY24')] + A.capex[ai('FY25')] + A.capex[ai('FY26')])} cr in FY24-26, including Unit 3 (₹617 cr gross) and Bayview (US$36.5 mn), and its ROE fell from 13% to 6.6%. That is the honest scorecard of the biologics bet so far. We assume ₹400-500 cr a year in FY27-29E (no guidance found). **Dividends:** ₹1.25 a share for FY25 and FY26 (~₹50 cr, a 10-16% payout). **ESOPs:** ₹41 cr of share-based pay in FY26; the ESOP trust holds ~0.4% of shares. **Biocon:** it sold ~18 points of its stake between Sep-2022 and Dec-2024 for ~₹4,150 cr to fund its biosimilars expansion; at 52.4% it keeps control, and further sales are a supply risk for the stock rather than a governance one.` },
    { callout: `**So what:** the balance sheet gives the new management time (net cash ~₹${n0(X.NC_CO[1])} cr excluding leases at Mar-27E on our numbers). The risk is not leverage but more spending on capacity before the existing plants fill. We would like to see FY28 capex held near maintenance until Unit 3 and Bayview utilisation is visible.` },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `At Jun-2026 the Biocon group held ${OW.rows['Promoters (Biocon group)']}% (Biocon Ltd ${OW.named[0].pct}% at Mar-26), domestic institutions ${OW.rows.DIIs}%, foreign investors ${OW.rows.FIIs}% and the public ${OW.rows.Public}%. ${OW.trend}. Named holders above 1% at Mar-26: Nippon India mutual funds ${OW.named[1].pct}%, ICICI Prudential mutual funds ${OW.named[2].pct}%.` },
  ...base.blocks,
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a third CEO in 18 months, now run by Biocon\'s own team; competent people, but Syngene\'s independence from Biocon has narrowed (AMBER)',
  blocks: [
    { exhibit: { type: 'table', title: 'Who runs Syngene', head: ['Name', 'Role'], wide: [1], rows: MG.map(m => [m.name, m.role]), source: 'Q4FY26 deck p.5; Q1FY27 call; Reuters' } },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Test', 'Evidence', 'Score'], wide: [1], rows: [
      ['Leadership stability', 'Jonathan Hunt stepped down Feb-2025; Peter Bains (CEO-designate Feb-2025) left Jun-2026; Siddharth Mittal from 1-Jul-2026; Kiran Mazumdar-Shaw executive chair from Apr-2026', 'RED'],
      ['Independence from the parent', 'CEO, CCO and CHRO all from Biocon; the chair is Biocon\'s founder; Syngene describes itself as "operationally independent"', 'AMBER'],
      ['Related-party dealings', 'Campus and SEZ facilities shared with Biocon group; rent and support services disclosed', 'AMBER'],
      ['Disclosure', 'No rupee split of research vs CDMO; Librela revenue not disclosed; guidance given and cut openly', 'AMBER'],
      ['Audit and accounts', 'BSR & Co (KPMG network); no qualifications found', 'GREEN'],
      ['Minority treatment', 'Biocon sold shares through open-market and block deals at market prices; dividend paid', 'GREEN'],
    ], source: 'AR FY26; company decks and calls; GAM Research' } },
    { callout: '**Our view:** the new team has a track record of building partnerships at Biocon and says the right things (commercial focus, CDMO as the growth engine, cost discipline). But three CEOs in 18 months and a parent that both controls and periodically sells the stock make Syngene less independent than its peers. AMBER.' },
  ],
};

module.exports = { moat, margins, earnings, capital, ownership, governance };
