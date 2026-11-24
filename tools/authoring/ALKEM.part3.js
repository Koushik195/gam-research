// Alkem Laboratories report, part 3: India, US generics, international + new businesses (Enzene, MedTech/Occlutech), moat.
const X = require('./ALKEM.ctx');
const { C, D, F, n0, n1, SQ, QL, Q1, FY26, YRS, BL, build, mixPct } = X;
const EZ = C.enzene, OC = C.occlutech;

const india = {
  id: 'india', nav: 'India: acute leader, chronic challenger', kicker: 'Segment: India (67% of sales)', title: 'India: #1 in antibiotics for 15 years, #6 overall; growth is market-plus in branded and flat in trade generics',
  blocks: [
    { p: `India brought in ₹${n0(FY26.india)} cr in FY26 (+9.7%) and ₹${n0(Q1.india)} cr in Q1FY27 (+10.3%). It has three parts. (1) **Branded acute medicines** (~77% of branded sales): anti-infectives, gastro, pain and vitamins, where Alkem ranks #1, #4, #3 and #2. Its 17 brands above ₹100 cr make up 52% of domestic sales; Pan is the IPM's #2 brand family and Clavam rose to #9 in FY26. Leadership is real but the lanes are slow: the anti-infectives market grew 4% in FY26. (2) **Branded chronic** (~22-23%, rising ~1pp a year): anti-diabetic (empagliflozin combinations after their FY25 patent expiry, where Alkem is top-four; semaglutide since Mar-2026), CNS, derma, urology and inhaled respiratory. Alkem grows 1.4-1.6x the market here but ranks only #8-#19. (3) **Trade generics**: unbranded medicines sold to distributors at low prices. Alkem is #1 or #2, but "a lot of big guys have entered" (MD); growth was ~4% in FY26 after the carve-out into Alkem Wellness and flat in Q1FY27, when Alkem cut credit days and raised prices for API inflation. The MD would be "happy with late single digits" there.` },
    { pair: [
      { type: 'line', title: 'IQVIA growth vs the market: ahead again since Q4FY26', unit: 'Secondary sales growth (%), IQVIA', x: ['FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Alkem', values: [9.2, 11.1, Q1.iqvia.alkem], fmt: 'pct' }, { name: 'IPM', values: [9.0, 10.0, Q1.iqvia.ipm], fmt: 'pct' }, { name: 'Alkem chronic', values: [12.6, 16.1, Q1.iqvia.chronic], fmt: 'pct' }, { name: 'Alkem acute', values: [8.5, 10.0, Q1.iqvia.acute], fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Q4FY26 and Q1FY27 presentations and calls (IQVIA SSA)' },
      { type: 'column', title: 'India sales growth by quarter: low in FY25, ~10% now', unit: 'India revenue growth YoY (%)', x: QL.slice(4), series: [{ name: 'India growth', values: SQ.slice(4).map((q, i) => Math.round((q.india / SQ[i].india - 1) * 1000) / 10), fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations; MOSL/Choice notes' },
    ] },
    { exhibit: { type: 'table', title: 'Price, volume, launches: what drove Q1FY27 branded growth', head: ['Driver', 'Q1FY27', 'Comment'], wide: [2], rows: [
      ['Price', '~6%', 'Annual price increases; scheduled drugs follow WPI (NLEM/DPCO); API inflation passed through'],
      ['New launches', '~3%', 'Empagliflozin combos, vonoprazan, Pulmosmart G, semaglutide (small); Alkem is top-four by new-introduction share'],
      ['Volume', '~2%', 'Low, as across the industry; trade generics flat'],
      { hl: true, cells: ['**Branded growth / reported India**', '**~12% / 10.3%**', 'Trade generics (not in IQVIA) dragged reported growth'] },
      ['Field force', '14,500+ reps', '+1,450 in FY26, mostly chronic; attrition 18-19%'],
    ], source: 'Q1FY27 call (CFO, 14-Aug-2026); Q4FY26 call; AR FY26 pp. 85-89' } },
    { callout: `**Our view:** Alkem's India business is a steady compounder, not a fast grower. We model ${BL.growth.india.join(' / ')}% growth in FY27-29E (₹${n0(build.india[0])} cr → ₹${n0(build.india[2])} cr): branded growth of ~12% with trade generics recovering only to mid-single digits. Upside would come from semaglutide and the oral version (in trials) and from chronic divisions maturing; downside from more price controls on old acute molecules and the UCPMP limiting promotion.` },
  ],
};

const us = {
  id: 'us', nav: 'US generics & USFDA', kicker: 'Segment: United States (20% of sales)', title: 'US generics: growth from the rupee and one launch a year; the Daman OAI puts 45% of US sales under a cloud',
  blocks: [
    { p: `The US brought in ₹${n0(FY26.us)} cr in FY26 (+20.3%, lifted by the limited-competition launch of generic sacubitril-valsartan in Q2FY26) and ₹${n0(Q1.us)} cr in Q1FY27 (+6.5%). Underneath, the business is ex-growth: Alkem has filed 192 ANDAs and won 170 approvals (18 tentative), launched 11 products in Q1FY27, but "we really don't have volume growth" in recent launches (MD); price erosion has "bottomed out" at close to flat. FY27 guidance is "high single digit to mid", helped by the weaker rupee, with generic tolvaptan (a four-player market) launching in Q2. The bigger issue is quality: the USFDA inspected the Amaliya, Daman formulations plant from 20-Apr to 1-May-2026, issued a Form 483 with seven observations and classified the site **Official Action Indicated (OAI)** in Aug-2026. About 45% of US sales come from Daman. Supplies continue and management hopes to clear it in 6-12 months, but an OAI usually means no new approvals from the site until it is resolved, and it can escalate to a warning letter.` },
    { pair: [
      { type: 'column', title: 'US sales by quarter: a step-up in FY26, flat since', unit: 'US revenue (₹ crore)', x: QL, series: [{ name: 'US', values: SQ.map(q => q.us), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations; MOSL/Choice notes' },
      { type: 'column', title: 'US filings and approvals: ~5 approvals a quarter', unit: 'Cumulative ANDAs (Jun-26)', x: ['Filed', 'Approved (final)', 'Tentative', 'Pending'], series: [{ name: 'ANDAs', values: [192, 152, 18, 22], fmt: 'num' }], labels: 'all', source: 'Q1FY27 presentation; MOSL exhibit 4' },
    ] },
    { exhibit: { type: 'table', title: 'USFDA status of plants supplying the US (as of 30-Sep-2026)', head: ['Site', 'What it makes', 'Last inspection', 'Status'], wide: [3], rows: C.plants, source: C.plantsSrc } },
    { callout: `**Our view:** we model US sales of ₹${n0(build.us[0])} / ${n0(build.us[1])} / ${n0(build.us[2])} cr in FY27-29E (+${BL.growth.us.join(' / +')}%), i.e. low single digits in dollars once the rupee effect fades, with tolvaptan offsetting erosion. We do not model a warning letter at Daman; it is the main item in our bear case (45% of US sales, ~9% of group revenue, and new launches from the site would stop).` },
  ],
};

const newbiz = {
  id: 'newbiz', nav: 'International, Enzene & MedTech', kicker: 'Segments: other international and new businesses', title: 'Other markets grow 25-35%; Enzene and MedTech are options that lose money today',
  blocks: [
    { p: `**Other international** (₹${n0(FY26.row)} cr in FY26, +26.7%; ₹${n0(Q1.row)} cr in Q1FY27, +34.5%): branded and generic sales in Australia (Pharmacor), Chile, Germany (+35-40%), the UK, France, Mexico, South Africa and Asia through Ascend and Pharmacor subsidiaries, plus biosimilar partner supplies. Management guides higher-teens growth; the base is small and the rupee helps. **Enzene Biosciences** (Alkem 88.99% fully diluted) has two arms: biosimilars (eight products in India, ~₹150 cr a year, profitable; denosumab approved in Europe through partner Theramex; the US denosumab approval missed its goal date after a 6-observation pre-approval inspection at Chakan in Feb-2026) and a monoclonal-antibody CDMO in Pune and Hopewell, New Jersey. ${EZ.fy26}. The US plant costs ~₹60 cr a quarter and needs $25-30mn of annual sales to break even, which the MD now expects in FY28, not within 12 months. In Feb-2026 outside investors (F-Prime, ERVI) put ₹26 cr into Enzene at ₹468.60 a share, which values 100% of it at ~₹${n0(EZ.impliedValue)} cr (GAM calculation). ${EZ.listing}. **Alkem MedTech**: orthopaedic implants (Bombay Ortho, Adroit; ~₹50 cr of sales, small losses) and, from mid-Jul-2026, 55% of **Occlutech**. ${OC.financials}. Management targets ~₹400 cr of sales in FY27 at breakeven EBITDA, then +7-8pp of margin a year.` },
    { pair: [
      { type: 'column', title: 'Other international sales: +27% in FY26, +34.5% in Q1FY27', unit: 'Other international revenue (₹ crore), quarterly', x: QL.slice(4), series: [{ name: 'Other international', values: SQ.slice(4).map(q => q.row), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations; MOSL note' },
      { type: 'column', title: 'New businesses in our build: Occlutech 2.4% → 3.7% of sales', unit: 'Occlutech revenue (₹ crore), GAM', x: YRS, series: [{ name: 'Occlutech', values: build.occlutech, fmt: 'num' }], labels: 'all', source: 'Q1FY27 call (FY27 target); GAM' },
    ] },
    { exhibit: { type: 'table', title: 'The three bets: what they are worth today and what they cost', head: ['Business', 'FY26 / latest', 'Drag or contribution', 'What would make it pay', 'Our assumption'], wide: [3], rows: [
      ['Enzene biosimilars (India + partners)', '~₹150 cr India sales; EMA approval (denosumab)', 'Profitable (teens EBITDA, MD)', 'US/EU approvals and partner milestones', 'Inside India and international growth'],
      ['Enzene CDMO (Pune + New Jersey)', 'US CDMO revenue < ₹100 cr in FY26; Enzene loss ₹150 cr', '~₹240 cr a year of US opex', '$25-30mn US revenue (FY28) and commercial-scale contracts', 'Loss narrows from FY28 (margin +80bp in FY28E)'],
      ['Occlutech (55%)', 'CY25E €49mn revenue, €2mn EBITDA', 'Breakeven EBITDA in FY27; 45% of losses to minorities', '23-24% EBITDA margin in 3-4 years', '₹400 / 650 / 750 cr sales; margin dilution ~50bp in FY27E'],
      ['Semaglutide (India; oral in trials)', '~11% unit share early on', 'Very small', 'Oral launch; US filing in ~1.5 years', 'Inside India growth'],
    ], source: 'Q4FY26 and Q1FY27 calls; AR FY26 pp. 89-93 and note 3.37; Reg 30 filing 13-Feb-2026; MOSL company update 18-Feb-2026; GAM' } },
    { callout: `**Our view:** none of the three bets changes Alkem's numbers before FY28, and two of them depress margins today. The cleanest marker of value is Enzene's Feb-2026 private round (~₹${n0(EZ.impliedValue)} cr for 100%, ~₹${n0(EZ.impliedValue * 0.8899 / X.SHARES)} a share for Alkem's stake): small against Alkem's ₹${n0(X.mcap)} cr market value. A listing of Enzene could crystallise that, but none had been announced by 30-Sep-2026.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real but narrow moat in Indian acute brands and reach; none in US generics',
  blocks: [
    { exhibit: { type: 'table', title: 'Moat scorecard', head: ['Source', 'Strength', 'Evidence', 'So what'], wide: [2, 3], rows: D.moat.map(([s, g, e, w]) => [s, `**${g}**`, e, w]), source: 'GAM Research, from company filings, IQVIA via company presentations and calls' } },
    { callout: '**Verdict:** Alkem has a narrow moat: prescriber habits for its big acute brands and a distribution reach that few can match make its India franchise durable and cash-generative. But the moat protects slow-growing categories, it is not deep in chronic, and the US business is a price-taker with a live regulatory problem. The tax advantage that flattered returns for a decade is gone. This is a good business priced as a growth business only if the sector premium applies to it.' },
  ],
};

module.exports = { india, us, newbiz, moat };
