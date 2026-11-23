// Torrent Pharma report, part 3: India (Torrent base + JB brands), the JB acquisition and synergies, international
// (Brazil, US, Germany), moat.
const X = require('./TORNTPHARM.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, SRC, SA, SQ, QL, Q1, FY26, DEAL, YRS, build, jbTot, JB_M, BASE_M, baseBiz } = X;
const IN = C.india, INT = C.international, JB = C.jbStandalone;
const cg = (a, b, y) => `${(Math.pow(a / b, 1 / y) * 100 - 100).toFixed(1)}%`;

const india = {
  id: 'india', nav: 'India', kicker: 'India (55% of revenue)', title: 'India: growing faster than the market for four years, and Q1FY27 was the best quarter yet',
  blocks: [
    { p: `Torrent's own India business grew from ₹4,286 cr (FY22) to ~₹7,207 cr (FY26, ex-JB), 14% a year, against a market growing 8-10%: +16% in FY23, +14% in FY24, +13% in FY25 and FY26, and +19% in Q1FY27 (₹2,157 cr) against the market's +12%. Management splits Q1 into volume +5.1%, price +7.7% and new products ~6% (market: 2.0% / 5.8% / 3.3%); semaglutide added ~3 points. The drivers are the ones Torrent has used for a decade: chronic brands (cardiac, diabetes, CNS, gastro), steady field-force expansion (~600 reps added in FY26 to ~7,000; 9,400 with JB in June, to be trimmed to ~9,000 as JB divisions are merged) with productivity above ₹10 lakh per rep per month, Curatio's consumer-dermatology brands (+27% in FY26, +34% in Q1FY27, helped by TV advertising), and first-to-market launches.` },
    { pair: [
      { type: 'column', title: 'India quarterly: base business plus JB from Q4FY26', unit: 'India revenue (₹ crore)', x: QL, series: [{ name: 'India', values: SQ.map(q => q.india), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company results (PL tables); Q4FY26 includes JB for 70 days, Q1FY27 for the full quarter (~₹733 cr)' },
      { type: 'column', title: 'Torrent base India growth: double-digit every year', unit: 'Growth of Torrent\'s own India business (%)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'Q1FY27', ...YRS], series: [{ name: 'Growth', values: [16.3, 13.7, 12.8, 12.7, 19.1, ...AS.businessLines.growth.indiaBase], fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'Annual reports; Q1FY27 call; GAM estimates FY27-29E' },
    ] },
    { exhibit: { type: 'table', title: 'India scorecard (combined with JB unless stated)', head: ['Measure', 'Value', 'Source / note'], wide: [2], rows: [
      ['Rank in the Indian pharma market', `#${IN.rankIpm} (#7 before JB)`, 'AIOCD Pharmatrac, Mar-2026'],
      ['Rank in chronic + sub-chronic / cardiac / CNS / gastro', `#${IN.rankChronic} / #${IN.cardiacRank} / #${IN.cnsRank} / #${IN.giRank}`, 'AR FY26; Q1FY27 call (#1 in cardiac with JB)'],
      ['Chronic share of sales', `${IN.chronicSharePct}% (market ${IN.ipmChronicSharePct}%)`, 'AR FY26 p.150'],
      ['Brands above ₹100 cr a year', `${IN.motherBrands100cr} mother brands (28 brands in Q1FY27)`, 'AR FY26; Q1FY27 call'],
      ['Field force', '7,200 Torrent + 2,200 JB = 9,400 (Jun-2026) → ~9,000', 'Q1FY27 call'],
      ['Semaglutide (launched Mar-2026)', '₹50 cr in Q1FY27, 36% share; injectable SKUs (~20% of monthly sales) out of stock Jul-Aug', 'Q1FY27 call; FY27 target of ₹200-250 cr withdrawn for a quarter'],
      ['Next first-to-market launches', 'Brexpiprazole (Apr-2026); resmetirom (NASH) within 12-18 months of May-2026, after patent expiry', 'Q4FY26 call'],
    ], source: 'Company filings and calls as noted' } },
    { callout: `**Our assumptions:** Torrent base India +${AS.businessLines.growth.indiaBase.join('% / +')}% in FY27-29E (mid-teens guided for FY27; we fade as the 2026 market pick-up normalises and semaglutide prices fall) and JB India +${AS.businessLines.growth.jbIndia.join('% / +')}% (brand transfers disrupt FY27; cross-selling from FY28). Combined India revenue rises from ₹${n0(AS.businessLines.base.indiaBase + AS.businessLines.base.jbIndia)} cr (FY26 pro forma) to ₹${n0(build.indiaBase[2] + build.jbIndia[2])} cr in FY29E.` },
  ],
};

const jb = {
  id: 'jb', nav: 'The JB acquisition', kicker: 'J.B. Chemicals', title: 'JB: a good franchise bought at a full price; synergies are arriving early, the brand transfers are the test',
  blocks: [
    { p: `JB grew revenue 17% a year from FY22 to FY25 under KKR (₹2,424 cr → ₹3,918 cr; FY23 alone +30%) and margins from 22% to 26%; FY26 slowed to +6% (₹4,148 cr, EBITDA 26.7%) as the change of control unsettled the field force (attrition ~30%) and Torrent reset distribution in the March quarter (revenue −5%, margin 22% in JB's own books; ₹19 cr of distributor severance). Under Torrent the June quarter rebounded: revenue ₹1,201 cr (+10%; India +13%, international and CDMO +12%), EBITDA ₹424 cr and a 35.3% margin (28.8% a year earlier). Management attributes "largely" all of the margin jump to cost synergies taken earlier than planned (overlapping field-force structures, distribution, overheads), with attrition down to 16%.` },
    { pair: [
      { type: 'column', title: `JB revenue: ₹4,148 cr in FY26; our ₹${n0(jbTot[2])} cr in FY29E`, unit: 'JB revenue (₹ crore): JB\'s books FY22-26; GAM FY27-29E', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'JB revenue', values: [2424, 3149, JB.revenue.FY24, JB.revenue.FY25, JB.revenue.FY26, ...jbTot.map(v => Math.round(v))], fmt: 'num' }], labels: 'all', source: 'Screener JBCHEPHARM; GAM' },
      { type: 'column', title: `JB EBITDA: synergies take it to ~₹${n0(jbTot[2] * JB_M[2] / 100)} cr by FY29E`, unit: 'JB EBITDA (₹ crore): JB\'s books FY24-26; GAM FY27-29E', x: ['FY24', 'FY25', 'FY26', ...YRS], series: [{ name: 'JB EBITDA', values: [JB.ebitda.FY24, JB.ebitda.FY25, JB.ebitda.FY26, ...jbTot.map((v, i) => Math.round(v * JB_M[i] / 100))], fmt: 'num' }], labels: 'all', source: 'Screener JBCHEPHARM; GAM' },
    ] },
    { exhibit: { type: 'table', title: 'What Torrent paid and what it booked (₹ crore)', head: ['Item', 'Amount', 'Note'], wide: [2], rows: [
      ['Cash for 48.80% (KKR ₹11,917 cr + employees ₹620 cr)', n0(DEAL.cashConsideration), 'Plus 1,317 shares in the open offer'],
      ['Minority interest at fair value (51.20%)', n0(DEAL.ppa.nci), 'Later bought out with 4.19 cr Torrent shares (~₹20,100 cr at ₹4,800)'],
      ['Brands / customer relationships / licences', `${n0(DEAL.ppa.brands)} / ${n0(DEAL.ppa.customerRelationships)} / ${n0(DEAL.ppa.productLicences)}`, 'Amortised over up to 15 years: ~₹1,340 cr a year'],
      ['Deferred tax liability on the step-up', n0(DEAL.ppa.dtl), 'Unwinds ~₹337 cr a year (book tax credit)'],
      ['Goodwill', n0(DEAL.ppa.goodwill), 'Not amortised; tested for impairment'],
      ['Deal costs (exceptional, FY26)', n0(DEAL.acquisitionCosts), 'Plus ₹19 cr of JB distributor severance'],
    ], source: 'AR FY26 note 42; Q4FY26 call' } },
    { exhibit: { type: 'table', title: 'Synergies: guidance and our assumption', head: ['', 'FY27', 'FY28', 'FY29'], rows: [
      ['Guidance (Feb-2026): share of ₹400-450 cr', '~20% (₹90 cr)', '~60%', '~20% (full run-rate)'],
      ['Latest (Jul-2026)', '"Definitely above ₹100 cr"', 'Year-3 level possibly in year 2', '–'],
      ['GAM: JB EBITDA margin (FY26 own books 26.7%)', `${JB_M[0]}%`, `${JB_M[1]}%`, `${JB_M[2]}%`],
      ['GAM: Torrent base margin (FY26 32.8%)', `${BASE_M[0]}%`, `${BASE_M[1]}%`, `${BASE_M[2]}%`],
      ['GAM: JB EBITDA (₹ cr)', ...jbTot.map((v, i) => n0(v * JB_M[i] / 100))],
    ], source: 'Q3FY26, Q4FY26 and Q1FY27 calls; GAM. Synergy guidance excludes the Novartis ophthalmology and Azmarda gross-margin gains.' } },
    { callout: '**Honest view:** the first quarter is better than anyone modelled, but two things deserve caution. Some of the margin jump is cost taken out of a business whose own growth slowed to 6% in FY26; and the hard part, moving JB\'s big brands into Torrent divisions with new reps, began only in July. Torrent\'s record (Unichem, Curatio) says it can do this; management itself says revenue may dip for 2-3 quarters. We model JB India +10% in FY27, below the "double-digit possible" guidance.' },
  ],
};

const international = {
  id: 'international', nav: 'Brazil, US, Germany', kicker: 'International', title: 'Outside India: Brazil is a real franchise; US and German generics are price-taking businesses',
  blocks: [
    { p: `**Brazil** (₹1,362 cr in FY26; BRL 817 mn, +12% in local currency) is a branded-generics market like India: Torrent is the largest Indian company, 19th in retail, with 33 branded and 27 generic products and 58 awaiting ANVISA approval. Q1FY27 sales rose only 3% in BRL (+27% in rupees) because distributors asked for longer credit as interest rates rose and Torrent cut channel stock; IQVIA shows Torrent +19% against the market's +4%, and management expects mid-teens growth from Q2. It lost the first-mover slot in generic semaglutide (five rival approvals in July). **The US** (US$151 mn in FY26; $44 mn in Q1FY27, +23% with one-offs) has 124 approved products, 17 launches in 30 months worth $20-25 mn, and is expected to turn profitable in FY27 after years of losses; management guides single-digit dollar growth. **Germany** (EUR 121 mn, −3% in FY26; EUR 29 mn in Q1FY27, −9%) is a tender market where a key supplier (10-15% of revenue) went out of business and Torrent is "sometimes outbid"; management: "in the middle of the woods".` },
    { pair: [
      { type: 'column', title: 'Brazil and the US grew in rupees; Germany barely', unit: 'Revenue (₹ crore), reported', x: SA.map(a => a.fy), series: [{ name: 'Brazil', values: SA.map(a => a.brazil), fmt: 'num' }, { name: 'US', values: SA.map(a => a.us), fmt: 'num' }, { name: 'Germany', values: SA.map(a => a.germany), fmt: 'num' }], labels: 'none', source: 'Annual reports FY23-FY26' },
      { type: 'column', title: 'Quarterly: Brazil is seasonal (Q1 low, Q4 high)', unit: 'Revenue (₹ crore), quarterly', x: QL, series: [{ name: 'Brazil', values: SQ.map(q => q.brazil), fmt: 'num' }, { name: 'US', values: SQ.map(q => q.us), fmt: 'num' }, { name: 'Germany', values: SQ.map(q => q.germany), fmt: 'num' }], labels: 'none', source: 'Company results (PL tables)' },
    ] },
    { exhibit: { type: 'table', title: 'Export markets: history and our forecast (₹ crore)', head: ['', 'FY22', 'FY26', 'Growth a year', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Brazil', '742', '1,362', cg(1362, 742, 4), ...build.brazil.map(n0)],
      ['United States', '1,067', '1,363', cg(1363, 1067, 4), ...build.us.map(n0)],
      ['Germany', '966', '1,249', cg(1249, 966, 4), ...build.germany.map(n0)],
      ['JB international and CDMO (pro forma FY26)', '–', n0(AS.businessLines.base.jbIntl), '–', ...build.jbIntl.map(n0)],
    ], source: 'Annual reports; GAM estimates (rupee growth includes currency)' } },
    { callout: '**So what:** these businesses are ~45% of pro forma revenue but grow mid-single digits in local currency, and their reported growth in FY26-27 was flattered by a weak rupee (which also produced ₹183 cr of hedging losses in other income). We model Brazil +16% / +13% / +12%, the US +12% / +6% / +5% and Germany +4% a year in rupees.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong India brand moat and a repeatable deal playbook; none in generics',
  blocks: [
    { verdicts: [...D.moat.map(r => r.map(rup))], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Torrent has a genuine moat in India: doctors\' prescription habits for its chronic brands are sticky, its scale lets it out-promote smaller owners of the same brands, and four acquisitions show it can buy brands and grow them faster. That moat covers ~55% of revenue (56% with JB). Brazil is a smaller version of the same model. The US and Germany have no moat at all: they are cost-and-supply businesses that have not grown in a decade in local currency. The JB deal deepens the moat (#1 in cardiac) but was paid for with debt and a full price, so returns on capital stay below FY25 levels until FY29E.' },
  ],
};

module.exports = { india, jb, international, moat };
