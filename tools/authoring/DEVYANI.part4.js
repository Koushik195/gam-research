// Devyani report, part 4: Q1FY27 and guidance, earnings quality, ownership, governance, our forecasts vs the street.
const X = require('./DEVYANI.ctx');
const { C, D, F, A, b, Q1, FY26, n0, n1, n2, pc, medOf, latest } = X;
const L1 = 'Q1FY27 presentation and call (29-Jul-2026)', q0 = Q1.q1fy26;

const guidance = {
  id: 'q1', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: `Q1FY27: revenue +${Q1.revenueGrowthPct}%, record EBITDA after rent (+38%), profit ₹${n1(Q1.owners)} cr after minorities`,
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY27', 'Q1FY26', 'YoY', 'Comment'], wide: [4], rows: [
      ['Revenue from operations', n0(Q1.revenue), n0(q0.revenue), `+${Q1.revenueGrowthPct}%`, `India +${Q1.indiaGrowthPct}% (presentation basis), International +${Q1.intlGrowthPct}%`],
      ['  KFC India', n0(Q1.kfcRev), '613', `+${Q1.kfcGrowthPct}%`, `SSSG +${Q1.kfcSssg}%; 11 net new stores; dine-in ${Q1.kfcOnPremisePct}% of sales`],
      ['  Pizza Hut India', n0(Q1.phRev), '187', '-1.6%', `SSSG ${Q1.phSssg}%; 13 stores closed; brand contribution -₹3.6 cr`],
      ['Gross margin', `${Q1.grossMarginPct}%`, '68.2%', '+0.9 pts', 'Price increases, fewer delivery discounts; LPG and dairy inflation'],
      ['EBITDA (after Ind AS 116)', n0(Q1.ebitda), n0(q0.ebitda), `+${n0((Q1.ebitda / q0.ebitda - 1) * 100)}%`, `${Q1.ebitdaMarginPct}% (15.1%)`],
      ['EBITDA after rent (operating)', n0(Q1.preIndAsEbitda), n0(q0.preIndAs), `+${n0((Q1.preIndAsEbitda / q0.preIndAs - 1) * 100)}%`, `${Q1.preIndAsMarginPct}% (8.1%); highest ever`],
      ['Profit before tax', n1(Q1.pbt), '2.9', '–', 'Highest in eight quarters'],
      ['Net profit after minorities', n1(Q1.owners), n1(q0.owners), '–', `₹${n1(Q1.pat)} cr before minorities (Camas's share of Thailand)`],
    ], source: `${L1}; MOSL result update (30-Jul-2026) for the Q1FY26 brand figures` } },
    { bullets: C.guidance.map(g => `**${g.what}** (${g.src}).`) },
    { callout: `**What we take from it:** the best quarter in two years, and the improvement is broad (KFC, own brands, Costa, International). The weak spots are store openings (−1 net in Q1 against 200-225 for the year: the new business-development team reset the pipeline) and Pizza Hut. Management called demand "stable" but warned about a below-normal monsoon, El Niño, LPG and the rupee.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Clean audit; four things to adjust for: rent outside EBITDA, minorities, impairments and large intangibles',
  blocks: [
    { bullets: [
      `**EBITDA excludes rent.** Ind AS 116 moves ~₹404 cr of FY26 rent into depreciation and interest; operating cash flow (₹${n0(FY26.cash.cfo)} cr) therefore overstates cash earnings. We treat lease principal as capex in the forecasts and show EBITDA after rent.`,
      '**Minorities.** Camas (Temasek) owns 49% of the Thai holding company; FY26 profit attributable to minorities was −₹3.9 cr and +₹2.5 cr in Q1FY27. Screener\'s Net Profit row is before minorities; we use profit after minorities (DEVYANI.patch.js) and add ~7-21 points to the forecast tax rate for their share.',
      '**Exceptional items and impairments.** FY26 had a ₹21.5 cr exceptional charge (Labour Code gratuity and leave, ₹12.2 cr, and other items) and ₹15.8 cr of store impairments; FY24 had a ₹151 cr post-tax exceptional gain (Screener). Impairments recur with store closures; we keep ~₹15 cr a year inside other income.',
      '**Intangibles of ₹1,722 cr** (goodwill ₹683 cr, BBK brand ₹495 cr, Thai territory rights ₹413 cr, franchise rights ₹130 cr) exceed owners\' equity; the auditors\' key audit matter is their impairment test. The Thai unit showed an impairment indicator (performance below the acquisition case); no impairment was booked.',
      '**Deferred tax.** FY26 had a ₹23 cr deferred tax credit on losses; future profits will be taxed at ~25% from the first rupee only after these are used.',
      '**Options.** The Camas put is on the RJ Corp holding company and Devyani\'s call option on Camas\'s stake is not booked; if Devyani ever buys Camas out, it will be for cash at a price set in the agreement.',
    ] },
    { callout: '**Accounting flag: AMBER.** Joint auditors (Walker Chandiok, O P Bagla) gave an unmodified opinion and we found nothing improper. The amber reflects reported EBITDA that excludes the largest store cost, profit near zero after depreciation, and acquisition intangibles larger than equity that rest on management\'s projections.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `At Jun-2026 the promoters (RJ Corp and the Jaipuria family) held ${OH.promoterPct}% (pledge negligible: ${n0(OH.pledgedShares)} shares), mutual funds ${OH.mfPct}%, other domestic institutions ~${n1(OH.diiPct - OH.mfPct)}%, foreign investors ${OH.fiiPct}% and others ${OH.publicPct}%. Foreign holdings have halved since Dec-2023 while Indian funds doubled. After the merger the RJ Corp group would hold ${OH.postMerger.promoterGroupPct}% of ${n1(OH.postMerger.shares)} cr shares.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named shareholders above 1% (30-Jun-2026)', head: ['Holder', 'Type', '% of shares'], rows: OH.named.map(h => [h.name, h.type, n2(h.pct)]), source: OH.src } },
  { callout: '**Our read:** a promoter-controlled stock with a small free float (~39% before the merger). Temasek appears twice: as Dunearn (2.87% of Devyani, a pre-IPO holder) and as Camas (49% of the Thai holding company). Nippon India\'s 7.06% is the largest outside holding.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Promoter-run with a new professional CEO; related parties and the Temasek structure need watching',
  blocks: [
    { p: `Management: ${C.management.map(m => `${m.name} (${m.role})`).join('; ')}. Auditor: ${C.auditor.name}; ${C.auditor.opinion}.` },
    { verdicts: [
      ['Promoter alignment', 'Good', 'RJ Corp 57.98%; no meaningful pledge; group has a strong record with Varun Beverages', 'Promoters fund growth; minority holders ride along'],
      ['Related parties', 'Watch', 'Small in rupees: purchases from Varun Beverages ₹19.6 cr in FY26 (₹7.9 cr in FY25), rent to Global Health (Medanta) ₹6.4 cr; the Arctic International purchase of Sapphire shares (dropped Aug-2026) would have been a promoter-group deal', 'Read the related-party note each year'],
      ['Capital allocation', 'Mixed', 'Thailand bought with a Temasek partner (half the economics given away); BBK paid in shares at ₹176.78; Sapphire paid in shares', 'Acquisitions have added revenue faster than profit'],
      ['Pay', 'Watch', 'CEO pay ₹5.8 cr plus ₹26.9 cr of option gains in a loss-making year', 'Options were granted in 2021 at pre-IPO prices'],
      ['Disclosure', 'Good', 'Brand-level revenue, SSSG, ADS, brand contribution and pre-Ind AS EBITDA every quarter', 'Better than most QSR peers'],
      ['Audit', 'Good', 'Joint auditors Walker Chandiok & Co (Grant Thornton network) and O P Bagla & Co; unmodified opinion', 'Key audit matter on intangibles'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26; shareholding patterns; exchange filings; GAM Research' },
    { bullets: D.governance.points.map(t => t) },
    { callout: '**Overall: AMBER.** Nothing improper, good disclosure and a committed promoter. The amber is for structure: half of Thailand sits with Temasek under a put to the promoters\' holding company, acquisitions have been paid in shares, and the merger will cut the promoter group to ~42%.' },
  ],
};

const withEps = latest.filter(s => s.eps);
const medE = y => medOf(withEps.map(s => s.eps[y]).filter(v => v != null));
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EBITDA ₹{{F.ebitda.0|num}} / {{F.ebitda.1|num}} / {{F.ebitda.2|num}} cr; EPS ₹{{F.eps.0|n2}} / ₹{{F.eps.1|n2}} / ₹{{F.eps.2|n2}}',
  blocks: [
    { p: `India revenue +{{as.segments.0.growth.0|pct0}} / +{{as.segments.0.growth.1|pct0}} / +{{as.segments.0.growth.2|pct0}} and International +{{as.segments.1.growth.0|pct0}} / +{{as.segments.1.growth.1|pct0}} / +{{as.segments.1.growth.2|pct0}}: consolidated revenue +{{F.salesGrowth.0|pct0}} / +{{F.salesGrowth.1|pct0}} / +{{F.salesGrowth.2|pct0}}. EBITDA margin (after Ind AS 116) {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}}; after rent ${X.preEbitda.map((v, i) => n1(v / F.sales[i] * 100) + '%').join(' / ')}. Capex including lease principal ₹{{as.capex.0|num}} / {{as.capex.1|num}} / {{as.capex.2|num}} cr; depreciation {{as.depRateOnGrossBlock|n1}}% of gross block; other income ₹{{as.otherIncome.0|num}}-{{as.otherIncome.2|num}} cr (net of store impairments; FY26 company figure ₹45 cr, trailing four quarters on Screener's basis ₹${n0(X.ttmOI)} cr); finance cost ₹{{as.interest.0|num}}-{{as.interest.2|num}} cr (mostly leases); tax {{as.taxRate.0|num}}% / {{as.taxRate.1|num}}% / {{as.taxRate.2|num}}% including minorities; no dividend. Profit stays small because depreciation (~11% of revenue) and lease interest (~4%) take most of the 16-17% EBITDA margin.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (after Ind AS 116)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit (after minorities)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' },
      { name: 'Capex (forecast incl. lease principal)', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM', ...withEps.map(s => `${s.broker} (${s.date.slice(5, 7)}/${s.date.slice(2, 4)})`)], rows: [
      ['Revenue FY27E (₹ cr)', '{{F.sales.0|num}}', ...withEps.map(s => (s.revenue?.FY27E ? n0(s.revenue.FY27E) : '–'))],
      ['Revenue FY28E (₹ cr)', '{{F.sales.1|num}}', ...withEps.map(s => (s.revenue?.FY28E ? n0(s.revenue.FY28E) : '–'))],
      ['EBITDA FY28E, before rent (₹ cr)', '{{F.ebitda.1|num}}', ...withEps.map(s => (s.postEbitda?.FY28E ? n0(s.postEbitda.FY28E) : '–'))],
      ['EBITDA FY28E, after rent (₹ cr)', n0(X.preEbitda[1]), ...withEps.map(s => (s.preEbitda?.FY28E ? n0(s.preEbitda.FY28E) : '–'))],
      ['EPS FY27E (₹)', '{{F.eps.0|n2}}', ...withEps.map(s => n2(s.eps.FY27E))], ['EPS FY28E (₹)', '{{F.eps.1|n2}}', ...withEps.map(s => n2(s.eps.FY28E))],
      { hl: true, cells: ['**GAM vs street median, FY28E EPS**', `**${pc((F.eps[1] / medE('FY28E') - 1) * 100)}**`, ...withEps.map(() => '')] },
    ], source: 'Motilal Oswal and Emkay result updates (30-Jul-2026); GAM Research' } },
    { callout: `**Where we differ:** our FY28E EBITDA (₹{{F.ebitda.1|num}} cr) is ~${n0((1 - F.ebitda[1] / medOf(withEps.map(s => s.postEbitda.FY28E))) * 100)}% below Motilal Oswal and Emkay (₹1,218-1,220 cr) and our after-rent EBITDA ₹${n0(X.preEbitda[1])} cr vs Motilal's ₹746 cr: we assume KFC SSSG below the 5-6% guide and a slower Pizza Hut repair. Our EPS is therefore at the low end of a range that is anyway close to zero.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
