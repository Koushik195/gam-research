// Exide report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs street.
const X = require('./EXIDEIND.ctx');
const { C, D, F, A, n0, n1, pc, pc1, b, ST, medEps, withEps, epsCagrFwd, epsCagrHist, oiB, ttmOI, SQ } = X;
const Q = C.q1fy27, G = C.guidance, FY = C.fy26;
const q0 = SQ.find(q => q.q === 'Q1FY26'), yoy = (a, p) => pc1((a / p - 1) * 100);

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: revenue +17.6%, EBITDA +19.5%, profit +27%: the best quarter in years',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore, standalone)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', n0(q0.sales), n0(Q.revenue), yoy(Q.revenue, q0.sales)],
      ['EBITDA (company)', '548', n0(Q.ebitda), yoy(Q.ebitda, 548)],
      ['EBITDA margin (company)', '12.2%', `${Q.ebitdaMargin}%`, '+20bp'],
      ['Depreciation', '128', n0(Q.dep), yoy(Q.dep, 128)],
      ['Profit before tax', '430', n0(Q.pbt), yoy(Q.pbt, 430)],
      { hl: true, cells: ['**Net profit**', `**${n0(q0.pat)}**`, `**${n0(Q.pat)}**`, `**${yoy(Q.pat, q0.pat)}**`] },
      ['Memo: consolidated revenue / net profit', `${n0(q0.consSales)} / ${n0(q0.consPat)}`, `${n0(Q.consolidated.revenue)} / ${n0(Q.consolidated.pat)}`, `${yoy(Q.consolidated.revenue, q0.consSales)} / ${yoy(Q.consolidated.pat, q0.consPat)}`],
    ], source: 'Q1FY27 presentation (1-Aug-2026) and call (3-Aug-2026); Screener.in (standalone and consolidated)' } },
    { bullets: [
      `**Volumes and prices:** ${Q.volumes}`,
      '**Margin:** up 20bp YoY and ~70bp QoQ despite rupee lead, sulphur and polypropylene costs: price increases, a cost-excellence programme and supply-chain savings (CEO). Q1 is seasonally the best quarter (inverter season), and last year\'s early monsoon made the base easy for inverters.',
      '**Outlook:** no full-year guidance; growth lower in percentage terms in H2 against the post-GST auto base; government tenders to pick up in H2; further price increases "as and when" costs rise.',
      `**Lithium:** all four lines installed; NMC cylindrical samples dispatched, LFP prismatic samples to 3W and telecom; revenue "during FY27"; ₹4,902 cr invested at 31-Jul-2026; ₹1,400 cr approved for FY27.`,
    ] },
    { exhibit: { type: 'table', title: 'What management guided (May-2026 to Aug-2026)', head: ['Topic', 'What was said'], wide: [1], rows: G.map(g => { const [t, ...r] = g.split(': '); return [t, r.join(': ')]; }), source: 'Q4FY26 call (6-May-2026); Q1FY27 call (3-Aug-2026)' } },
    { callout: '**Why it matters:** our FY27E needs revenue growth of ~11% and a ~11.3% margin for Q2-Q4 after a +17.6% / 12.4% Q1. Q2 has an easy base (the GST washout), H2 a hard one. The risk is margins: if rupee lead and sulphur keep rising faster than prices, FY27E margin slips toward 11%.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean and cash-backed; the issues sit in the subsidiaries, not the core',
  blocks: [
    { bullets: [
      `**Cash conversion is good.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26 (${Math.round(A.cfoToPat[b])}% of profit, ${Math.round(A.cfoToEbitda[b])}% of EBITDA) as payables rose; ₹${n0(A.cfo[b - 1])} cr in FY25 (${Math.round(A.cfoToPat[b - 1])}% of profit).`,
      '**One large one-off, clearly labelled.** FY22 profit includes the ₹4,694 cr pre-tax Exide Life gain; FY26 a ₹9 cr labour-code charge. We value on EPS before both.',
      `**Other income is small and mostly real.** FY26 ₹${n0(C.otherIncomeFY26.total)} cr (company): mutual-fund gains ₹30.6 cr, dividends ₹20.5 cr, foreign-exchange gains ₹27.9 cr, guarantee commission from EESL ₹5.6 cr, other ₹8.4 cr. We forecast ₹${n0(oiB[0].gross)} cr for FY27E (TTM ₹${n0(ttmOI)} cr): less cash after the EESL infusion and no repeat of FY26's foreign-exchange gain.`,
      '**Where the judgement sits:** the HDFC Life stake is marked to market through other comprehensive income (−₹834 cr in FY26), so balance-sheet equity swings with HDFC Life\'s price; EESL is carried at cost in the standalone accounts (₹4,802 cr) although its own book value is ₹4,025 cr after losses; Exide guarantees EESL\'s borrowings.',
      '**Related parties:** Chloride Metals sells recycled lead to Exide; EESL pays a guarantee fee; both are disclosed.',
    ] },
    { callout: '**Accounting flag: GREEN** for the standalone company (B S R & Co., unqualified, no material exceptional items outside FY22). Investors should still read the consolidated accounts: the gap between consolidated and standalone profit (₹251 cr in FY26) is the cost of the lithium bet, and it will grow before it shrinks.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `Chloride Eastern Ltd (UK) holds ${OH.categories.promoters}% and is treated as the holding company by de facto control; the stake has not changed in years. Indian institutions own ${OH.categories.dii}% (Jun-2026), up from ~17% a year earlier; LIC alone held 5.27% at Mar-2026. Foreign portfolio investors hold ${OH.categories.fii}%, down from ~14% in 2024. Retail and others hold ${OH.categories.public}% across ${(OH.categories.shareholders / 100000).toFixed(1)} lakh shareholders: Exide is a widely held retail stock. ${OH.pledge}` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders', head: ['Holder', 'Stake'], wide: [0], rows: OH.named.map(([h, p]) => [h, p + '%']), source: OH.src } },
  { callout: '**Our read:** a professionally managed company with a passive foreign promoter holding company and a broad institutional base. Control is not contestable, but management, not a founding family, runs the business; capital allocation (the lithium bet) is the board\'s call.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: professional management and a clean audit; capital allocation is the open question',
  blocks: [
    { p: `Board: ${D.governance.board}. Auditor: ${D.governance.auditor}` },
    { verdicts: [
      ['Audit and accounts', 'Strong', D.governance.auditor, 'Clean standalone accounts; exceptional items labelled.'],
      ['Board', 'Moderate', '9 directors, 4 independent (44%); independent chairman; promoter-linked vice-chairman.', 'Meets the rules; audit and risk committees chaired by independents.'],
      ['Management', 'Moderate', 'MD & CEO Avik Roy since 2019; CFO since 2023; EESL run by an executive director since Oct-2024.', 'Experienced operators; lithium is new to all of them.'],
      ['Related-party flows', 'Moderate', D.governance.relatedParty, 'Inside the group and disclosed.'],
      ['Capital allocation', 'Watch', '₹4,902 cr into EESL with no cell revenue yet; ROE down to ~8%; dividends flat at ₹2 a share.', 'The big test: whether EESL earns its cost of capital.'],
      ['Promoter and pledges', 'Moderate', `Chloride Eastern 45.99%, unchanged. ${OH.pledge}`, 'A stable, passive promoter.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (board, committees, notes); shareholding pattern Jun-2026' },
  ],
};

const gap = (g, s) => (g / s - 1) * 100;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: standalone EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}',
  blocks: [
    { p: `Revenue comes from the five-line build, EBITDA margin {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}, lead-acid capex ₹500 / 525 / 550 cr, depreciation 7.0% of gross block (FY27E ₹{{F.dep.0|num}} cr), finance cost ~₹35 cr (leases), tax 25.3% and a 15% payout. Other income is built: 7% on liquid funds after the ₹1,400 cr FY27 EESL infusion, plus dividends, guarantee fees, ₹10 cr of foreign-exchange gains and other items (₹${n0(oiB[0].gross)} / ${n0(oiB[1].gross)} / ${n0(oiB[2].gross)} cr). EESL's losses are not in these numbers (it is a subsidiary); they are valued separately. Every assumption, with our reasoning, is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore, standalone)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow (before EESL infusions)', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street: standalone EPS (₹, estimates standing on 30-Sep-2026)', head: ['', 'GAM', ...withEps.map(s => s.broker)], rows: [
      ['FY27E', '{{F.eps.0|n1}}', ...withEps.map(s => n1(s.eps.FY27E))],
      ['FY28E', '{{F.eps.1|n1}}', ...withEps.map(s => n1(s.eps.FY28E))],
      ['FY27E revenue (₹ cr)', '{{F.sales.0|num}}', ...withEps.map(s => n0(s.revenue.FY27E))],
      ['FY27E / FY28E EBITDA margin', '{{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}}', ...withEps.map(s => `${s.ebitdaMarginPct.FY27E}% / ${s.ebitdaMarginPct.FY28E}%`)],
      { hl: true, cells: ['**GAM vs street median, FY28E EPS**', `**${pc(gap(F.eps[1], medEps('FY28E')))}**`, ...withEps.map(() => '')] },
    ], source: 'MOFSL (3-Aug-2026) and ICICI Securities (4-Aug-2026) result notes; other brokers\' estimates were not visible to us' } },
    { callout: `Our FY28E EPS (₹${n1(F.eps[1])}) sits between MOFSL (₹18.2) and ICICI Securities (₹20.0); FY27E (₹${n1(F.eps[0])}) likewise. EPS compounds ~${Math.round(epsCagrFwd)}% a year over FY26-29E, twice the ~${Math.round(epsCagrHist)}% of FY21-26, on volume growth, a margin recovery from 11.3% to 12% and (from FY28E) interest on cash that no longer goes to EESL. If EESL needs more equity (Phase 2), FY29E EPS would be ~₹${n1((oiB[2].treasury) * (1 - X.TAX) / X.shares)} lower at most (all of the treasury income).` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
