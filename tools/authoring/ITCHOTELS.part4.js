// ITC Hotels report, part 4: moat scorecard, Q1FY27 and guidance, earnings quality, ownership (named holders), governance.
const X = require('./ITCHOTELS.ctx');
const { C, D, F, n0, n1, Q1, FY26, SQ } = X;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'A narrow moat: irreplaceable luxury hotels and a strong food brand, but a small fee business and ordinary returns',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard', head: ['Source of advantage', 'Score (1-5)', 'Evidence'], wide: [2], rows: [
      ['Irreplaceable assets', '4', 'Large city-centre luxury hotels in Delhi, Mumbai, Chennai, Bengaluru, Kolkata and Hyderabad built decades ago at old land costs; new supply in these micro-markets is slow (~5% a year in key markets, Horwath HTL via IHCL)'],
      ['Brand and pricing power', '3', `RevPAR ${FY26.revparPremiumPct}% above the luxury-upscale market (FY26) but room rates rose only ${FY26.arrGrowthPct}% (FY26) and ${Q1.arrGrowthPct}% (Q1FY27); the "ITC" name is licensed from ITC Ltd for a royalty`],
      ['Food and beverage', '4', `F&B is ~${Math.round(FY26.streams.fnb / (FY26.revenueExRe) * 100)}% of hotel revenue (Bukhara, Dum Pukht, Avartana, Peshawri): a draw for weddings and banquets that rivals cannot copy quickly`],
      ['Scale and distribution', '3', 'Luxury Collection franchise (Marriott) for global distribution; Club ITC loyalty; but ~14,400 keys vs IHCL\'s ~33,600'],
      ['Asset-light fee engine', '2', `Fees ₹${FY26.streams.fees} cr (FY26), ~4% of hotel revenue; mostly midscale Fortune and Welcomhotel contracts`],
      ['Returns on capital', '2', 'Pre-tax ROCE ~11%, ROE ~7% (Screener, FY26): the asset base is large relative to profit'],
    ], source: 'Company decks and AR FY26; Screener.in; GAM Research' } },
    { callout: '**Verdict: a narrow moat.** Nobody can rebuild ITC Maurya or ITC Grand Chola at today\'s land and construction costs, and the food franchise is real. But a moat should show up in returns, and here it does not yet: ~7% ROE on book equity. The moat protects margins; it has not produced high returns on the capital tied up in it.' },
  ],
};

const guidance = {
  id: 'q1', nav: 'Q1FY27 and guidance', kicker: 'Latest quarter', title: `Q1FY27: revenue +${Q1.revenueGrowthPct}% (hotels +${Q1.revenueExReGrowthPct}%), EBITDA +${Q1.ebitdaGrowthPct}%, profit +${Q1.patGrowthPct}% in a quarter hit by West Asia`,
  blocks: [
    { p: `Results on 16-Jul-2026: consolidated revenue ₹${Q1.revenueOp} cr (+${Q1.revenueGrowthPct}%), of which hotels ₹${Q1.revenueExRe} cr (+${Q1.revenueExReGrowthPct}%) and Sapphire Residences ₹${Q1.reRevenue} cr; EBITDA ₹${Q1.ebitda} cr (+${Q1.ebitdaGrowthPct}%), hotel margin ${Q1.marginExRePct}% (+${Q1.marginExReChangeBps} bps); other income ₹${Q1.otherIncome} cr; profit ₹${Q1.pat} cr (+${Q1.patGrowthPct}%). ${Q1.context}. The company does not give numerical revenue or margin guidance and, as far as we could find, holds no earnings calls; its stated targets are 2.5x FY25 management fees by FY30, 250 hotels and 22,000+ keys by 2031, and capex of 10-12% of cumulative revenue.` },
    { pair: [
      { type: 'column', title: 'Quarterly revenue and EBITDA: Q3-Q4 are the peak season', unit: '₹ crore, consolidated', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }, { name: 'EBITDA', values: SQ.map(q => q.consEbitda), fmt: 'num' }], labels: 'none', source: 'Company decks; Screener.in' },
      { type: 'hbar', title: 'Q1FY27 growth by stream', unit: 'Year on year (%)', x: ['Rooms', 'Food & beverage', 'Management fees', 'Others', 'Hotels total'], series: [{ name: 'Growth', values: [Q1.streamGrowthPct.room, Q1.streamGrowthPct.fnb, Q1.streamGrowthPct.fees, Q1.streamGrowthPct.others, Q1.revenueExReGrowthPct], fmt: 'pct' }], labels: 'all', highlight: 'Hotels total', source: 'Q1FY27 deck slide 9' },
    ] },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean accounts, but watch apartment sales, treasury income and Sri Lankan currency moves',
  blocks: [
    { exhibit: { type: 'table', title: 'Accounting checks', head: ['Check', 'Finding', 'Flag'], wide: [1], rows: [
      ['Cash conversion', `Cash from operations ₹${n0(FY26.cfo)} cr = ${Math.round(FY26.cfo / FY26.ebitda * 100)}% of EBITDA in FY26 (FY25 66%, as the cash flows were set up after the demerger)`, 'GREEN'],
      ['One-offs', `FY26 exceptional loss ₹80 cr (${C.fy26.exceptionalNote}); none in FY25. Our forecasts carry none`, 'GREEN'],
      ['Non-recurring revenue', 'Sapphire Residences apartment sales (₹211 cr revenue, ₹64 cr EBITDA in FY26) inflate growth and are not hotel profit; we strip them out of the multiple', 'AMBER'],
      ['Treasury income', 'Other income rose from ₹66 cr to ₹192 cr on the cash ITC handed over; it is ~15% of FY26 profit before tax and depends on rates', 'AMBER'],
      ['Currency', 'Colombo assets are translated at the Sri Lankan rupee: +₹134 cr OCI in FY26, −₹210 cr in Q1FY27; no effect on our EBITDA, but on book value', 'AMBER'],
      ['Data quirks', C.accounting.screenerReclass, 'AMBER'],
      ['Auditor', `${C.management.auditor}; no qualifications in our reading of AR FY26`, 'GREEN'],
    ], source: 'AR FY26; Q1FY27 deck; Screener.in; GAM Research' } },
  ],
};

const OW = D.ownership || {};
const ownership = base => ({ ...base, blocks: [
  { p: OW.text || 'Ownership detail to follow.' },
  ...(OW.holders ? [{ exhibit: { type: 'table', title: `Largest named holders (${OW.holdersAsOf})`, head: ['Holder', '% of shares', 'Note'], wide: [2], rows: OW.holders.map(h => [h[0], h[1] != null ? `${h[1]}%` : 'n.d.', h[2] || '']), source: OW.src } }] : []),
  ...base.blocks,
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: an ITC-run board and ITC-style discipline; the questions are ITC\'s control and related-party dealings',
  blocks: [
    { exhibit: { type: 'table', title: 'Board (AR FY26)', head: ['Director', 'Role'], wide: [1], rows: C.management.board, source: C.management.src } },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Comment'], wide: [2], rows: [
      ['Board independence', 'AMBER', 'Chaired by ITC\'s Chairman (Sanjiv Puri); five of nine directors independent (56%); three non-executive non-independent directors incl. the Chairperson; Audit Committee chaired by an independent director (P. R. Ramesh)'],
      ['Parent control and conflicts', 'AMBER', 'ITC holds 39.85% and supplies the chairman, shared services (software, legal, HR) and the "ITC" trademark for a royalty (the AR FY25 lists these related-party dealings, at prices benchmarked to unrelated-party deals). We did not find the royalty amount: it deserves scrutiny each year'],
      ['Capital allocation', 'AMBER', 'Conservative (no debt, first dividend) but ~₹3,100 cr of cash earns ~7%; first acquisitions (Kumarakom, Ahmedabad) are small'],
      ['Disclosure', 'AMBER', 'Clear quarterly decks with KPIs, but no earnings calls or numerical guidance that we could find'],
      ['Management depth', 'GREEN', 'MD Anil Chadha and the team ran the hotels inside ITC; CFO Ashish Thakar'],
    ], source: 'AR FY26; GAM Research' } },
  ],
};

module.exports = { moat, guidance, quality, ownership, governance };
