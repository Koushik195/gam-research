// Granules India report, part 5: Q1FY27, our forecasts vs the street, the street view and critiques.
const X = require('./GRANULES.ctx');
const { C, D, F, A, b, n0, n1, pc, shortDate, epsSep28, icici, emkay, mosl, choice, patGap, ST, medTp, medTpQ1, price } = X;
const Q = C.q1fy27;

const q1 = {
  id: 'q1', nav: 'Q1FY27', kicker: 'Latest quarter', title: 'Q1FY27: strongest first quarter ever (+22% revenue, +37% EBITDA, +60% profit), but flat on Q4 and helped by cheap US inventory',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 results (₹ crore, company)', head: ['', 'Q1FY27', 'Q1FY26', 'YoY', 'Q4FY26', 'QoQ'], rows: [
      ['Revenue', '1,476.8', '1,210.1', '+22%', '1,470.6', '+0%'],
      ['Gross margin', '65.6%', '64.9%', '+74 bp', '65.7%', '−11 bp'],
      ['Staff cost', '254.6', '202.8', '+26%', '240.4', '+6%'],
      ['R&D', '88.0 (6.0%)', '67.8 (5.6%)', '+30%', '78.1 (5.3%)', '+13%'],
      ['EBITDA', '338.9', '246.7', '+37%', '352.1', '−4%'],
      ['EBITDA margin', '22.9%', '20.4%', '+256 bp', '23.9%', '−99 bp'],
      ['PBT before exceptional items', '240.4', '170.4', '+41%', '246.4', '−2%'],
      { hl: true, cells: ['**Net profit**', '**180.0**', '112.6', '**+60%**', '201.6', '−11%'] },
      ['Peptide CDMO revenue / EBITDA', '60.0 / −12.4', '29.1 / n.d.', '+106%', '69.9 / +1.5', '−14%'],
      ['Net debt (company) / CFO', `${Q.netDebtCompany} / ${Q.cfo}`, '948.0 / 280.6', '', '402.1 / 100.3', ''],
    ], source: 'Q1FY27 deck pp.6-11 (Q1FY26 net profit after a ₹25.9 cr exceptional charge); Screener.in' } },
    { bullets: [
      `**Growth was broad:** FD +${Q.divisions.fdYoY}%, API +${Q.divisions.apiYoY}%, PFI +${Q.divisions.pfiYoY}%, CDMO +${Q.divisions.cdmoYoY}%; North America +${Q.regions.naYoY}%, Europe +${Q.regions.europeYoY}%, rest of world +${Q.regions.rowYoY}%.`,
      `**Mix:** complex generics ${Q.complexShareOfFd}% of FD (39% a year earlier) lifted the gross margin; integrated (legacy) generics ${Q.integratedShareOfFd}%.`,
      '**Costs ahead:** Q1 gross margin was "largely insulated" by US inventory bought before the West Asia-led rise in raw-material, packing and freight costs; Granules is pursuing price increases with customers and held back some legacy supply in Europe.',
      '**Cash:** operating cash ₹387 cr on lower US receivables; capex only ₹89 cr (FY27 guidance ~₹600 cr); net debt ₹101 cr before the Sep-2026 warrant money.',
      '**Guidance:** growth "will continue"; EBITDA margin 22-23%; R&D 5.5-6%; Senn PAT positive in FY27; GLS >50% utilised by year-end; ~9 US launches in FY27 if the FDA approves.',
    ] },
  ],
};

const yrs = ['FY27E', 'FY28E'];
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(X.epsU[0])} / ${n1(X.epsU[1])} / ${n1(X.epsU[2])} for FY27-29E, close to Emkay but ${Math.round(-patGap(icici, 'FY27E', 0))}-${Math.round(-patGap(icici, 'FY28E', 1))}% below ICICI Securities on profit; the gap is margin and Gagillapur timing`,
  blocks: [
    { exhibit: { type: 'table', title: 'GAM forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue', '{{A.sales.11|num}}', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['growth', '{{A.salesGrowth.11|chg}}', '{{F.salesGrowth.0|chg}}', '{{F.salesGrowth.1|chg}}', '{{F.salesGrowth.2|chg}}'],
      ['EBITDA', '{{A.ebitda.11|num}}', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['EBITDA margin', '{{A.ebitdaMargin.11|pct}}', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}'],
      ['Depreciation', '{{A.dep.11|num}}', '{{F.dep.0|num}}', '{{F.dep.1|num}}', '{{F.dep.2|num}}'],
      ['Other income', '{{A.otherIncome.11|num}}', '{{F.otherIncome.0|num}}', '{{F.otherIncome.1|num}}', '{{F.otherIncome.2|num}}'],
      ['Interest', '{{A.interest.11|num}}', '{{F.interest.0|num}}', '{{F.interest.1|num}}', '{{F.interest.2|num}}'],
      { hl: true, cells: ['**Net profit**', '**{{A.pat.11|num}}**', '**{{F.pat.0|num}}**', '**{{F.pat.1|num}}**', '**{{F.pat.2|num}}**'] },
      ['EPS (₹; 27.28 cr shares; FY26 pro forma)', '{{A.eps.11|n1}}', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}'],
      ['ROE', '–', '{{F.roe.0|pct}}', '{{F.roe.1|pct}}', '{{F.roe.2|pct}}'],
      ['Net cash, year-end (engine incl. leases)', n0(X.cashPath[0]), '{{F.treasury.0|num}}', '{{F.treasury.1|num}}', '{{F.treasury.2|num}}'],
    ], source: 'GAM Research; FY26 Screener.in (Mar-26 net cash and EPS pro forma for the Sep-2026 conversion)' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (₹ crore; brokers\' latest notes standing on 30-Sep-2026)', head: ['', 'GAM', 'ICICI Securities (24-Jul)', 'Emkay (22-Jul)', 'MOSL (21-Jul)', 'GAM vs ICICI / Emkay'], wide: [4], rows: [
      ...yrs.map((y, i) => [`Revenue ${y}`, n0(F.sales[i]), n0(icici.sales[y]), n0(emkay.sales[y]), i === 1 ? `~${n0(A.sales[b] * 1.17 * 1.17)} (~17% CAGR)` : '–', `${pc(F.sales[i] / icici.sales[y] * 100 - 100)} / ${pc(F.sales[i] / emkay.sales[y] * 100 - 100)}`]),
      ...yrs.map((y, i) => [`EBITDA margin ${y}`, `${n1(F.ebitdaMargin[i])}%`, `${n1(icici.ebitda[y] / icici.sales[y] * 100)}%`, `${n1(emkay.ebitda[y] / emkay.sales[y] * 100)}%`, i === 1 ? '~24.2% (+205 bp FY26-28)' : '–', '']),
      ...yrs.map((y, i) => [`Net profit ${y}`, n0(F.pat[i]), n0(icici.pat[y]), n0(emkay.pat[y]), i === 1 ? '~1,000 (~30% CAGR)' : '–', `${pc(patGap(icici, y, i))} / ${pc(patGap(emkay, y, i))}`]),
      ['Net profit FY29E', n0(F.pat[2]), '–', n0(emkay.pat.FY29E), '–', `– / ${pc(patGap(emkay, 'FY29E', 2))}`],
      ['EPS FY28E (₹)', n1(F.eps[1]), `${icici.eps.FY28E} (27.3 cr shares)`, `${emkay.eps.FY28E} (26.2 cr wtd)`, '–', ''],
    ], source: 'Broker notes as cited in deep.json (ICICI Securities and Emkay original PDFs; MOSL from DSIJ/InvestmentGuru summaries: growth rates only). Choice (22-Jul, 25x FY28E for ₹1,110) implies FY28E EPS ~₹44' } },
    { callout: `**Where we differ.** Revenue: we are ~3% below ICICI Securities and in line with Emkay for FY28E; we assume Gagillapur approvals help only from FY28 and legacy prices stay soft. Margin: we have 23.0% / 23.5% / 24.0% against 23.6-24.3% (ICICI) and 22.9-25.9% (Emkay): management guides 22-23% and cost inflation is still to come through. FY29E: Emkay's ₹1,230 cr profit needs a 25.9% margin and +17% revenue growth; ours is ₹${n0(F.pat[2])} cr. Choice's ₹1,110 target implies FY28E EPS of ~₹44, 30% above ours.` },
  ],
};

module.exports = { q1, forecasts };
