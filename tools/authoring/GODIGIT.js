// Authoring source for the Go Digit General Insurance initiating-coverage report.
// Writes data/raw/GODIGIT/research/initiation.json (rendered by public/initiation.js).
// Insurer-specific structure: premiums → claims & costs (combined ratio) → float → investment income.
// Usage: node tools/authoring/GODIGIT.js
const fs = require('fs');
const path = require('path');
const RD = path.join(__dirname, '..', '..', 'data', 'raw', 'GODIGIT', 'research');
const R = f => { try { return JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8')); } catch { return {}; } };
const C = R('company.json'), I = R('industry.json'), S = R('street.json'), P = R('products.json');
const short = (s, n = 160) => (s && s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : s || '–');
const n0 = v => (v == null ? '–' : Math.round(v).toLocaleString('en-IN'));
const SRC = { co: 'Company disclosures (investor presentations, IRDAI public disclosures), GAM Research', est: 'Company, GAM Research estimates', ind: 'GI Council, IRDAI, CareEdge, ICRA, GAM Research' };

// Quarterly KPI helper for annotated statements: value of field f for the quarter label in column i.
const qk = f => `(g('R.company.quarterlyKpis') || []).find(q => q.q === g('Q.labels')[i])?.${f} ?? null`;

const cover = {
  headline: 'A fast-growing insurer that has not yet learned to make money from insurance, priced as if it already has',
  lead: `Go Digit built India's fastest-growing private general insurer in eight years: ₹11,294 cr of premium in FY26, 2.9% of the market and 1.67 crore policies. But it has never made an underwriting profit. For every ₹100 of premium it earns, it pays out about ₹111 in claims and costs (combined ratio 110.7% in FY26, 112.3% in Q1FY27), and all of its profit comes from investing the float. Its costs are the second-highest of 27 general insurers, 40.5% of premium against a regulatory cap of 30%. At ₹{{P.last|num}} the market is pricing Go Digit as if it will permanently earn a ~{{dcf.impliedRoe|pct0}} return on equity (on the more generous Ind AS accounts), above what ICICI Lombard, the best-run listed peer, earns today. We see no evidence it will get there. **Initiate with SELL and a target price of {{dcf.tp|inr}} ({{dcf.upside|chg}}).**`,
  arguments: [
    { h: 'The business loses money on insurance; investments carry the profit', p: 'In FY26 Go Digit lost ₹866 cr on underwriting and earned ₹1,591 cr on investments. Its claims ratio (~73%) is in line with peers. The problem is costs: commissions and operating expenses take ~38% of premium vs ~31% at ICICI Lombard. The "digital means low cost" story is not visible in the numbers.' },
    { h: 'Growth has stalled and market share is slipping', p: 'Premiums fell 8.4% in Q1FY27, the first market-share loss since inception (motor share 6.25% → 5.6%). Management calls it deliberate ("soft by choice"), but it also shows Go Digit lacks pricing power in a competitive market. We forecast premiums flat in FY27.' },
    { h: 'Two sets of accounts tell different stories', p: 'Under the old Indian rules (IGAAP) FY26 profit was ₹544 cr and ROE 12.6%. Under the new Ind AS rules it was ₹764 cr and ROE 17.7%, mainly because commissions on multi-year policies are spread over time. We value the company on the fairer Ind AS book, and it still looks expensive.' },
    { h: 'The Fairfax–IDBI Bank move is the one genuine positive', p: 'Fairfax is acquiring ~61% of IDBI Bank and plans to move its Go Digit stake under the bank. That could give Go Digit a captive bank channel. It is not yet approved, and in our view one bank partner does not fix a cost problem. Our bull case ({{scen.bull.tp|inr}}) assumes it works and costs fall to ICICI Lombard levels; even then the upside is only {{scen.bull.upside|chg}}.' },
  ],
  keyRows: [['GWP (₹ cr)', 'kpi.gwp', 'num'], ['GWP growth', 'kpi.gwpGrowth', 'chg'], ['Combined ratio', 'kpi.combinedRatio', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n2'], ['ROE (IGAAP)', 'kpi.roe', 'pct'], ['Book value / share (₹)', 'bvps', 'n1']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'RED' },
    { k: 'Competitive position', v: 'WEAK' },
    { k: 'Change in position', v: 'RED' },
  ],
  catalysts: [
    'Q2FY27 results (due late Oct/early Nov 2026): does the combined ratio improve as management promised for motor own-damage claims?',
    'Fairfax–IDBI Bank: regulatory approvals, and whether minority shareholders get an open offer.',
    'IRDAI expense rules: the proposed ~1/3 cut in allowed expenses from Jan-2027 and commission caps.',
    'Motor third-party tariff: no increase since Jun-2022; a hike would help every motor insurer.',
  ],
};

// --------------------------------------------------------------------------------------
const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 10 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'column', title: 'Premiums grew 3.5x in five years, then stalled', unit: 'Gross written premium, GWP (₹ crore)', x: 'fin.labels', series: [{ name: 'GWP', ref: 'kpi.gwp', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'line', title: 'It has never made a profit from insurance itself', unit: 'Combined ratio, IGAAP (%): above 100% = loss on underwriting', x: 'fin.labels', series: [{ name: 'Combined ratio', ref: 'kpi.combinedRatio', fmt: 'pct' }], labels: 'all', min: 95, max: 116, lines: [{ v: 100, text: 'Break-even (100%)', color: '#1a7f4b' }], source: SRC.est },
    ] },
    { pair: [
      { type: 'column', title: 'All the profit comes from investing the float', unit: 'FY26, ₹ crore', x: ['Underwriting result', 'Investment income', 'Profit before tax'], series: [{ name: '₹ cr', values: [-866, 1591, 632], fmt: 'num' }], labels: 'all', highlight: 'Investment income', source: SRC.co },
      { type: 'hbar', title: 'Costs are the problem: 2nd-highest of 27 general insurers', unit: 'Expenses of management as % of gross premium, FY26 (cap: 30%)', x: ['Go Digit', 'Acko', 'HDFC Ergo', 'ICICI Lombard', 'Tata AIG', 'Bajaj General', 'SBI General'], series: [{ name: 'EoM %', values: [40.47, 38.69, 31.91, 31.7, 31.0, 27.99, 27.22], fmt: 'pct' }], labels: 'all', highlight: 'Go Digit', lines: [{ v: 30, axis: 'x', text: 'Cap 30%', color: '#b4232a' }], source: 'IRDAI data via Cafemutual, GAM Research' },
    ] },
    { pair: [
      { type: 'hbar', title: 'Priced above ICICI Lombard despite lower returns', unit: 'Price / book (x), IGAAP, Oct-2026', x: ['Go Digit', 'ICICI Lombard', 'Star Health', 'Niva Bupa', 'New India', 'GIC Re'], series: [{ name: 'P/B', values: [5.34, 4.3, 4.11, 3.52, 0.96, 0.83], fmt: 'x' }], labels: 'all', highlight: 'Go Digit', source: 'Company data, market prices 23-Oct-2026, GAM Research' },
      { type: 'hbar', title: '…while earning a lower return on equity', unit: 'ROE FY26 (%), IGAAP', x: ['ICICI Lombard', 'Bajaj General', 'Tata AIG', 'Go Digit', 'Niva Bupa', 'Star Health', 'New India'], series: [{ name: 'ROE', values: [17.8, 16, 15, 12.6, 10.7, 10, 6], fmt: 'pct' }], labels: 'all', highlight: 'Go Digit', source: 'Company data, GAM Research' },
    ] },
    { pair: [
      { type: 'line', title: 'Street FY27 EPS cut 17.5% in 12 months', unit: 'Consensus FY27E EPS (₹)', x: 'R.street.revisions.0.series[].ago', series: [{ name: 'FY27E EPS', ref: 'R.street.revisions.0.series[].value', fmt: 'n2' }], labels: 'ends', source: 'sharpely consensus, GAM Research' },
      { type: 'hbar', title: 'Our target vs the street and the scenarios', unit: '₹ per share', x: ['Bear case', 'GAM base', 'Street low', 'CMP', 'Bull case', 'Street mean', 'Street high'], series: [{ name: 'Value', fn: "[g('scen.bear.tp'), g('dcf.tp'), g('R.street.ratings.tpLow'), g('P.last'), g('scen.bull.tp'), g('R.street.ratings.tpMean'), g('R.street.ratings.tpHigh')][i]", fmt: 'inr' }], labels: 'all', highlight: 'GAM base', source: 'sharpely, Investing.com, GAM Research' },
    ] },
  ],
};

// --------------------------------------------------------------------------------------
const industry = {
  id: 'industry', nav: 'Industry: big, growing, loss-making', kicker: 'Industry', title: 'Indian general insurance: a large, growing market where most players lose money on insurance',
  blocks: [
    { p: `Indian general insurers collected ₹3.36 lakh crore of direct premium (GDPI) in FY26, up 9.3% (about 11% without the 1/n accounting change). Premiums have compounded at ~12% a year since FY15. India is badly under-insured: non-life premium is ~1% of GDP and US$25 per person, against a world average of 4.3% and US$555.` },
    { pair: [
      { type: 'column', title: 'Industry premium has quadrupled since FY15', unit: 'Gross direct premium, GDPI (₹ \'000 crore)', x: 'R.industry.industryGdpi[].fy', series: [{ name: 'GDPI', ref: 'R.industry.industryGdpi[].gdpi', scale: 0.001, fmt: 'num', growth: true }], source: SRC.ind },
      { type: 'hbar', title: 'India is one of the least-insured large economies', unit: 'Non-life premium as % of GDP, 2024', x: 'R.industry.penetration[].country', series: [{ name: 'Penetration', ref: 'R.industry.penetration[].penetrationPct', fmt: 'pct' }], labels: 'all', highlight: 'India', source: 'Swiss Re sigma 2/2025' },
    ] },
    { p: `The catch: **the industry as a whole loses money on insurance.** The combined ratio (claims plus costs as % of premium) was 113% in FY26, an underwriting loss of ₹45,279 cr, covered by investment income. Only a handful of players (ICICI Lombard, Bajaj General, and health specialists Star Health and Niva Bupa) run close to or below 100%. Go Digit is better than the industry average but clearly worse than the leaders.` },
    { pair: [
      { type: 'hbar', title: 'Combined ratio by insurer, FY26: Go Digit is mid-pack', unit: 'Combined ratio (%), IGAAP; below 100% = underwriting profit', x: ['Star Health', 'Niva Bupa', 'Bajaj General', 'ICICI Lombard', 'Go Digit', 'Tata AIG', 'Industry', 'HDFC Ergo', 'New India'], series: [{ name: 'CoR', values: [98.8, 101.4, 102.84, 103.4, 110.7, 112, 113, 117, 122.57], fmt: 'pct' }], labels: 'all', highlight: 'Go Digit', lines: [{ v: 100, axis: 'x', text: '100%', color: '#1a7f4b' }], min: 90, source: SRC.ind },
      { type: 'line', title: 'Market share: private insurers and health specialists gain', unit: 'Share of industry GDPI (%)', x: 'R.industry.marketShare[].fy', from: 'FY21', to: 'FY26', series: [{ name: 'ICICI Lombard', ref: 'R.industry.marketShare[].iciciLombard', fmt: 'pct' }, { name: 'Standalone health insurers', ref: 'R.industry.marketShare[].sahiTotal', fmt: 'pct' }, { name: 'Go Digit', ref: 'R.industry.marketShare[].goDigit', fmt: 'pct' }], labels: 'ends', source: SRC.ind },
    ] },
    { h: 'What is changing in the industry' },
    { bullets: [
      '**Health is the growth engine** (~41% of premium). Standalone health insurers went from 7.9% to 13.7% market share in five years. Go Digit has only ~18% of its premium in health.',
      '**Motor is in a volume up-cycle** (car sales +28% in H1FY27 after the GST cut), but the motor third-party tariff has not been raised since June 2022 while claim costs keep rising.',
      '**Expense rules are tightening.** IRDAI has proposed cutting allowed expenses by about a third from January 2027 and capping commissions. That helps low-cost insurers and hurts broker-dependent, high-cost ones like Go Digit.',
      '**100% foreign ownership is now allowed** (Insurance Laws Amendment Act, Dec-2025), which opens the door to more well-funded foreign entrants. A composite (life + non-life) licence was not included.',
      '**Ind AS accounting** (similar to global IFRS 17) is mandatory from April 2026. It recognises costs and revenue more evenly and will change how every insurer reports profit.',
    ] },
  ],
};

const tailwinds = {
  id: 'tailwinds', nav: 'Tailwind test', kicker: 'Does the tailwind reach Go Digit?', title: 'Tailwind test: which industry trends actually help Go Digit?',
  blocks: [
    { p: 'An industry tailwind only matters to a shareholder if the company captures it profitably. We score each trend.' },
    { verdicts: [
      ['Under-insurance / long growth runway', 'Partly', 'The whole industry benefits; Go Digit has grown share from 1.2% (FY21) to 2.9% (FY26).', 'Growth is real but has not produced underwriting profit.'],
      ['Motor volume boom after GST 2.0', 'Partly', 'Motor is ~66% of Go Digit\'s premium; 2W new business +26% in Q1FY27.', 'More volume, but multi-year 2W policies front-load commission costs under IGAAP, and TP pricing is frozen.'],
      ['Health insurance growth', 'No', 'Only ~18% of Go Digit\'s premium; standalone health insurers are taking most of the growth.', 'Under-exposed to the fastest-growing segment.'],
      ['Ind AS accounting', 'Yes', 'Ind AS shows higher profit and book (₹7,610 cr vs ₹4,586 cr) by deferring acquisition costs.', 'Optics improve; the cash economics do not change.'],
      ['Tighter expense / commission rules', 'No', 'Go Digit\'s expenses are 40.5% of premium vs a 30% cap; 58% of business comes via brokers.', 'Forces cost cuts but threatens the broker-led growth model.'],
      ['100% FDI', 'Partly', 'Lets Fairfax own Go Digit directly and inject capital.', 'Also invites new, deep-pocketed competitors.'],
      ['Bancassurance (IDBI Bank)', 'Partly', 'If Fairfax moves Go Digit under IDBI Bank, it gains a captive bank channel.', 'Not yet approved; benefit is years away and one bank is a small channel.'],
    ], head: ['Trend', 'Helps Go Digit?', 'Evidence', 'So what'], title: 'Tailwind scorecard: few trends help Go Digit profitably', source: SRC.ind },
    { callout: '**Our view:** India\'s insurance runway is long, but that runway is shared by 27 insurers. Go Digit is over-exposed to motor (low pricing power, frozen TP tariff), under-exposed to health (the growth engine), and its cost structure is on the wrong side of the coming regulation.' },
  ],
};

// --------------------------------------------------------------------------------------
const story = {
  id: 'story', nav: 'The Go Digit story', kicker: 'Company', title: 'From start-up to listed insurer in eight years',
  blocks: [
    { p: 'Go Digit was founded in 2016 by Kamesh Goyal (formerly of Allianz and Bajaj Allianz) with backing from Prem Watsa\'s Fairfax Financial. It sold through brokers and point-of-sale agents (POSPs) using a technology-first operating model, and grew from nothing to ~₹11,300 cr of premium. It listed in May 2024 at ₹272; the stock is now around that level after peaking at ~₹398.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['Date', 'Event', 'Impact'], wide: [1, 2], rows: (C.timeline || []).filter(t => t.date && /corporate|capital|regulation/.test(t.category)).map(t => [t.date, `**${t.title}**`, short(t.impact || t.detail, 150)]), source: SRC.co } },
    { pair: [
      { type: 'column', title: 'Market share tripled in five years', unit: 'Share of industry GDPI (%)', x: 'R.industry.marketShare[].fy', from: 'FY21', to: 'FY26', series: [{ name: 'Go Digit share', ref: 'R.industry.marketShare[].goDigit', fmt: 'pct' }], source: SRC.ind },
      { type: 'column', title: 'Policies in force: 5.6 million to 16.7 million', unit: 'Policies (million)', x: 'fin.labels', to: 'FY26', series: [{ name: 'Policies', ref: 'kpi.policiesMn', fmt: 'n1' }], source: SRC.co },
    ] },
  ],
};

const mix = {
  id: 'mix', nav: 'Where premiums come from', kicker: 'Segments & channels', title: 'Two-thirds motor, sold mostly through brokers',
  blocks: [
    { p: 'Motor insurance (own damage, OD, plus mandatory third-party, TP) is ~60% of Go Digit\'s gross premium and ~69% of direct premium. Health, travel and personal accident are ~18%, and fire/property ~10%. Brokers bring in 58% of direct premium and POSP agents another 13%; the company\'s own direct channel is ~12% and bank partners just 1%.' },
    { pair: [
      { type: 'stacked', title: 'Premium mix: motor-heavy, health under-weight', unit: '% of GWP', x: (C.segmentMix || []).filter(s => s.basis === 'GWP' && /^FY2[2-6]$/.test(s.fy)).map(s => s.fy), series: [
        { name: 'Motor OD', values: (C.segmentMix || []).filter(s => s.basis === 'GWP' && /^FY2[2-6]$/.test(s.fy)).map(s => s.motorOd), fmt: 'pct0' },
        { name: 'Motor TP', values: (C.segmentMix || []).filter(s => s.basis === 'GWP' && /^FY2[2-6]$/.test(s.fy)).map(s => s.motorTp), fmt: 'pct0' },
        { name: 'Health, travel & PA', values: (C.segmentMix || []).filter(s => s.basis === 'GWP' && /^FY2[2-6]$/.test(s.fy)).map(s => s.health), fmt: 'pct0' },
        { name: 'Fire & others', values: (C.segmentMix || []).filter(s => s.basis === 'GWP' && /^FY2[2-6]$/.test(s.fy)).map(s => (s.fireProperty || 0) + (s.others || 0)), fmt: 'pct0' },
      ], minLabel: 5, source: SRC.co },
      { type: 'stacked', title: 'Channel mix: broker-dependent, almost no bank distribution', unit: '% of direct premium (GDPI)', x: (C.channelMix || []).map(c => c.fy), series: [
        { name: 'Brokers', values: (C.channelMix || []).map(c => c.brokers), fmt: 'pct0' },
        { name: 'POSP & agents', values: (C.channelMix || []).map(c => (c.posp || 0) + (c.agents || 0)), fmt: 'pct0' },
        { name: 'Direct', values: (C.channelMix || []).map(c => (c.direct || 0) + (c.directOnline || 0)), fmt: 'pct0' },
        { name: 'Banks, OEMs & others', values: (C.channelMix || []).map(c => (c.banca || 0) + (c.oem || 0) + (c.corporateAgents || 0) + (c.other || 0)), fmt: 'pct0' },
      ], minLabel: 5, max: 105, source: 'IRDAI NL-36 disclosures, GAM Research' },
    ] },
    { callout: '**Our view:** ICICI Lombard (ICICI Bank), HDFC Ergo (HDFC Bank) and SBI General (SBI) each own a captive bank channel with low acquisition costs. Go Digit rents its customers from brokers, which is why its commission and expense ratios are structurally higher. The IDBI Bank plan addresses this only partly and only in future.' },
  ],
};

// --------------------------------------------------------------------------------------
const underwriting = {
  id: 'underwriting', nav: 'Underwriting: the core problem', kicker: 'Profitability', title: 'Underwriting: claims are fine, costs are not',
  blocks: [
    { p: 'An insurer\'s core profit is premium earned minus claims and costs. Go Digit\'s **loss ratio** (claims as % of earned premium) has been 70-73% for three years, in line with ICICI Lombard (70.7%) and better than the industry (81%). Its **expense ratio** (commissions plus operating costs as % of net premium) has been 36-40%, well above the leaders. Add them up and the **combined ratio** has stayed at 107-113% every year.' },
    { pair: [
      { type: 'stacked', title: 'Combined ratio = loss ratio + expense ratio', unit: '% (IGAAP)', x: 'fin.labels', series: [{ name: 'Loss ratio', ref: 'kpi.lossRatio', fmt: 'pct0' }, { name: 'Expense ratio', ref: 'kpi.expenseRatio', fmt: 'pct0' }], minLabel: 10, source: SRC.est },
      { type: 'column', title: 'Underwriting loss every year; widening again in FY27', unit: 'Underwriting result (₹ crore)', x: 'fin.labels', from: 'FY25', series: [{ name: 'UW result', ref: 'kpi.uwResult', fmt: 'num' }], labels: 'all', source: SRC.est },
    ] },
    { h: 'Quarter by quarter' },
    { exhibit: { type: 'line', title: 'Quarterly combined ratio: no sustained improvement', unit: 'Combined ratio (%), IGAAP', x: 'R.company.quarterlyKpis[].q', to: 'Q1FY27', series: [{ name: 'Combined ratio', ref: 'R.company.quarterlyKpis[].combinedRatio', fmt: 'pct' }, { name: 'Loss ratio', ref: 'R.company.quarterlyKpis[].lossRatio', fmt: 'pct' }], labels: 'ends', min: 60, source: SRC.co } },
    { p: '**What management says:** the expense ratio is inflated by IGAAP accounting. On multi-year two-wheeler policies, the full commission is expensed upfront while premium is earned over five years; this cost ~2-4 points of combined ratio in recent quarters. A further ~2 points come from the 1/n rule. On its preferred measure (combined ratio on earned premium, with deferred acquisition costs), FY26 was 105.7%. We accept part of this, but even 105-106% is worse than ICICI Lombard\'s 103% on a like-for-like IGAAP basis.' },
    { callout: '**Our view:** Go Digit\'s claims discipline is adequate. Its cost base is the problem, and that is structural: broker commissions, high-acquisition-cost multi-year motor policies, and no bank channel. The regulator\'s expense cap (30%) is a ceiling Go Digit has breached every year.' },
  ],
};

const float = {
  id: 'float', nav: 'Investments: the profit engine', kicker: 'The float', title: 'The investment book: where the profit really comes from',
  blocks: [
    { p: 'Insurers collect premiums before they pay claims. The money held in the meantime, the **float**, is invested. Go Digit\'s investment assets were ₹22,922 cr at FY26 (about 5x its net worth), earning ~7.4%. That produced ₹1,591 cr of investment income, enough to cover the ₹866 cr underwriting loss and leave a profit.' },
    { pair: [
      { type: 'column', title: 'Investment income: rising with the float', unit: 'Investment income (₹ crore)', x: 'fin.labels', series: [{ name: 'Investment income', ref: 'kpi.investmentIncome', fmt: 'num' }], source: SRC.est },
      { type: 'column', title: 'Investment assets: ~5x net worth', unit: 'Investment assets / AUM (₹ crore)', x: 'fin.labels', series: [{ name: 'AUM', ref: 'kpi.aum', fmt: 'num' }], source: SRC.est },
    ] },
    { callout: '**Why this matters:** a business that relies on investment income for 100%+ of profit is effectively a leveraged bond-and-equity portfolio with an insurance operation attached. Its earnings move with interest rates and markets. FY26 showed this: unrealised losses of ₹692 cr hit other comprehensive income when bond yields rose, and in Q1FY27 management chose not to book equity gains. A 1% lower yield would cut pre-tax profit by roughly ₹230 cr, about a quarter of FY27E PBT.' },
  ],
};

const twoBooks = {
  id: 'twobooks', nav: 'Two sets of accounts', kicker: 'Accounting', title: 'Two sets of accounts: IGAAP vs Ind AS',
  blocks: [
    { p: 'Indian insurers moved to Ind AS (similar to global IFRS 17) from April 2026. Go Digit has regulatory permission to keep IGAAP statutory books until March 2027 but already publishes Ind AS figures, and leads its investor communication with them. The difference is large.' },
    { exhibit: { type: 'table', title: 'FY26 on the two accounting bases', head: ['', 'IGAAP (statutory)', 'Ind AS', 'Why they differ'], wide: [3], rows: [
      ['Combined ratio', '110.7%', '103.0%', 'Ind AS defers acquisition costs (DAC) and discounts claim reserves for the time value of money.'],
      ['Profit before tax (₹ cr)', '632', '1,041', 'DAC +₹389 cr, discounting +₹234 cr.'],
      ['Net profit (₹ cr)', '544', '764–778', ''],
      ['Net worth (₹ cr)', '4,586', '7,610', 'Ind AS adds ~₹2,470 cr of deferred acquisition costs and reserve discounting to equity.'],
      ['ROE', '12.6%', '17.7%', 'Higher profit on a higher book.'],
      ['Price / book at ₹270', '~5.3x', '~3.3x', ''],
    ], source: 'Company Q4FY26 presentation & IGAAP–Ind AS reconciliation, GAM Research' } },
    { p: '**Which is right?** Ind AS is the better economic picture: a commission paid today on a five-year policy should be spread over five years. But two cautions apply. First, in a growth phase deferred costs build up and flatter profit; when growth slows (as now) they unwind and profit growth slows. Second, cash is the same under both: the commissions have already been paid. We therefore value Go Digit on the Ind AS book (being fair to the company), but on a conservative Ind AS ROE path because FY26\'s 17.7% was helped by rapid DAC build-up in a growth year.' },
  ],
};

// --------------------------------------------------------------------------------------
const moatRows = (P.moatEvidence || []).map(m => [m.dimension, m.verdict === 'advantage' ? 'Advantage' : m.verdict === 'disadvantage' ? 'Disadvantage' : 'Parity', short(m.evidence, 320)]);
const cnt = v => moatRows.filter(r => r[1] === v).length;
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: Go Digit does not have a durable one',
  blocks: [
    { p: `We tested every claimed advantage against data. The honest conclusion: **Go Digit does not have a durable competitive advantage.** Its technology and claims service are competent but not measurably better than incumbents. Its costs are higher, not lower. It has no captive distribution. What it does have is a strong, patient capital sponsor (Fairfax) and conservative reserving, which are real strengths but not moats.` },
    { verdicts: moatRows, head: ['Dimension', 'Verdict', 'Evidence'], title: `Moat scorecard: ${cnt('Advantage')} advantages, ${cnt('Parity')} at parity, ${cnt('Disadvantage')} disadvantages`, source: 'IRDAI, company disclosures, CRISIL, GAM Research' },
    { pair: [
      { type: 'hbar', title: 'Scale: ICICI Lombard is ~3x Go Digit\'s size', unit: 'Market share of industry GDPI, FY26 (%)', x: ['New India', 'ICICI Lombard', 'Bajaj General', 'Tata AIG', 'Star Health', 'HDFC Ergo', 'Go Digit', 'Niva Bupa'], series: [{ name: 'Share', values: [12.75, 8.55, 6.9, 5.97, 5.54, 4.47, 2.93, 2.56], fmt: 'pct' }], labels: 'all', highlight: 'Go Digit', source: SRC.ind },
      { type: 'hbar', title: 'Underwriting quality: behind the private leaders', unit: 'Combined ratio FY26 (%)', x: ['ICICI Lombard', 'Bajaj General', 'Go Digit', 'Tata AIG', 'HDFC Ergo'], series: [{ name: 'CoR', values: [103.4, 102.84, 110.7, 112, 117], fmt: 'pct' }], labels: 'all', highlight: 'Go Digit', min: 90, source: SRC.ind },
    ] },
    { callout: '**Bottom line on the moat:** Go Digit is a well-run, well-capitalised challenger in a crowded market of 27 insurers, with no structural cost, distribution or pricing advantage. Challengers without a moat can still grow, but they rarely earn returns well above their cost of capital for long. That is exactly what the current share price assumes.' },
  ],
};

// --------------------------------------------------------------------------------------
const sh = P.shareholders || {};
const ownership = {
  id: 'ownership', nav: 'Ownership & Fairfax–IDBI', kicker: 'Ownership', title: 'Who owns it, and the Fairfax–IDBI Bank question',
  blocks: [
    { p: 'Promoters hold ~73% through Go Digit Infoworks (GDISPL), a holding company owned by Fairfax (FAL Corporation) and Kamesh Goyal\'s entities. This structure existed because foreign ownership of insurers was capped. Now that 100% foreign ownership is allowed, GDISPL is being merged into Go Digit, which will make Fairfax a direct ~57% owner and Goyal\'s entities ~15%. Separately, in October 2026 Fairfax announced it will move its Go Digit stake under IDBI Bank, which it is acquiring.' },
    { pair: [
      { type: 'line', title: 'Mutual funds are buying; FIIs are selling', unit: '% of shares', x: (sh.trend || []).map(t => t.q), series: [{ name: 'Mutual funds', values: (sh.trend || []).map(t => t.mf), fmt: 'pct' }, { name: 'FIIs', values: (sh.trend || []).map(t => t.fii), fmt: 'pct' }], labels: 'ends', source: 'BSE shareholding patterns, sharpely' },
      { type: 'hbar', title: 'Named holders above 1% (Sep-2026)', unit: '% of equity', x: ['Mirae Asset MF', 'ICICI Prudential MF', 'Aditya Birla SL MF', 'A91 Partners', 'Faering Capital', 'Norges Bank'], series: [{ name: '% held', values: [4.71, 2.14, 1.6, 1.51, 1.31, 1.25], fmt: 'pct' }], labels: 'all', source: 'BSE shareholding pattern (Sep-2026), GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Notable ownership moves', head: ['Who', 'What happened', 'When'], wide: [1], rows: (sh.notableMoves || []).map(m => [`**${m.who}**`, short(m.action, 170), m.when || '']), source: 'BSE filings, block-deal data, GAM Research' } },
    { callout: '**Open question for minority shareholders:** if Fairfax moves its stake into IDBI Bank, does that count as an indirect change of control that requires an open offer to other shareholders under SEBI takeover rules? The company has not said. An open offer at or above the GDISPL merger price (₹375.10) would be a large upside event; no offer would leave minorities with a new bank promoter and no exit. We do not include either outcome in our target.' },
  ],
};

const governance = {
  id: 'governance', nav: 'Governance & accounting', kicker: 'Governance', title: 'Governance and accounting: reasonable, with four flags',
  blocks: [
    { verdicts: [
      ['Expense-of-management breaches', 'No', 'Expenses 40.5% of premium (FY26) vs 30% cap; breached again in Q1FY27; IRDAI show-cause notice (Oct-2024); forbearance sought. Shareholders absorbed ₹469 cr of excess expenses in FY26.', 'A repeated regulatory breach. The cap is not optional.'],
      ['Promoter-owned reinsurer (Valueattics)', 'Partly', 'Valueattics Re is promoted by Kamesh Goyal\'s and Fairfax\'s entities. Go Digit ceded ₹20.6 cr to it in FY26 and received ₹47 cr of inward premium from it in Q1FY27 alone. Arm\'s-length terms are not disclosed.', 'Small today but growing fast. Needs disclosure and board oversight.'],
      ['Holding-structure penalty', 'Partly', 'IRDAI fined Go Digit ₹1 cr (May-2024) for not filing a change in the holding company\'s preference-share conversion terms. Holding-company services were stopped at IRDAI\'s request.', 'Minor, but shows the complexity of the old structure.'],
      ['Brand licensing', 'Partly', 'The "Digit" brand is owned by a promoter-group company and licensed to the listed company.', 'A value-leakage risk if licence terms change.'],
      ['Reserving', 'Yes', 'Past claim reserves have consistently proved more than enough (motor TP accident years FY20-23 released 22-41%).', 'Conservative, a genuine positive, though releases have supported recent profits.'],
      ['Auditors & board', 'Yes', 'Joint auditors (Kirtane & Pandit; PKF Sridhar & Santhanam), no qualifications found; ~5 of 9 directors independent.', 'Adequate.'],
    ], head: ['Check', 'Clean?', 'Evidence', 'Our view'], title: 'Governance checklist: Accounting flag AMBER', source: 'IRDAI public disclosures (NL-21, NL-42), CRISIL, company filings, GAM Research' },
  ],
};

// --------------------------------------------------------------------------------------
const earnings = {
  id: 'earnings', nav: 'Earnings model', kicker: 'Forecasts', title: 'Earnings model: slower growth, slow cost improvement, below the street',
  blocks: [
    { p: 'We forecast premiums (GWP), net premium after reinsurance (NWP), earned premium (NEP), then claims and costs (combined ratio) and investment income on the float. All forecasts are on IGAAP, the current statutory basis, to compare with the street.' },
    { exhibit: { type: 'table', title: 'Key assumptions', head: ['', 'FY26A', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [5], rows: [
      ['GWP growth', '9.8%', '{{as.gwpGrowth.0|pct}}', '{{as.gwpGrowth.1|pct}}', '{{as.gwpGrowth.2|pct}}', 'Management is "soft by choice" until Mar-27 (Q1 −8.4%); market growth ~11-12% thereafter, some IDBI help.'],
      ['Loss ratio', '72.9%', '{{as.lossRatio.0|pct}}', '{{as.lossRatio.1|pct}}', '{{as.lossRatio.2|pct}}', 'Motor OD corrective actions vs frozen TP tariff and claims inflation.'],
      ['Expense ratio', '37.8%', '{{as.expenseRatio.0|pct}}', '{{as.expenseRatio.1|pct}}', '{{as.expenseRatio.2|pct}}', 'Slow decline under regulatory pressure; still well above ICICI Lombard.'],
      ['Combined ratio', '110.7%', '{{F.combinedRatio.0|pct}}', '{{F.combinedRatio.1|pct}}', '{{F.combinedRatio.2|pct}}', 'Emkay (the only full broker model): 108.9% / 106.5% / 105.0%.'],
      ['Investment yield', '7.4%', '{{as.investmentYield.0|pct}}', '{{as.investmentYield.1|pct}}', '{{as.investmentYield.2|pct}}', 'Reinvestment yield ~7.8%, but no capital gains assumed.'],
      ['Tax rate', '13.8%', '25.2%', '25.2%', '25.2%', 'Accumulated losses used up in FY26; full tax from FY27.'],
    ], source: SRC.est } },
    { pair: [
      { type: 'column', title: 'Net profit: modest growth from here', unit: 'Net profit (₹ crore), IGAAP', x: 'fin.labels', from: 'FY23', series: [{ name: 'PAT', ref: 'fin.pat', fmt: 'num', growth: true }], source: SRC.est },
      { type: 'line', title: 'ROE stays near or below the cost of equity', unit: 'ROE (%), IGAAP', x: 'fin.labels', from: 'FY23', series: [{ name: 'ROE', ref: 'kpi.roe', fmt: 'pct' }], labels: 'all', lines: [{ v: 'dcf.ke', text: 'Cost of equity {{dcf.ke|pct}}', color: '#b4232a' }], source: SRC.est },
    ] },
    { exhibit: { type: 'table', title: 'GAM vs street: we are below on profit', head: ['', 'FY27E GAM', 'FY27E Consensus', 'FY27E Emkay', 'FY28E GAM', 'FY28E Consensus', 'FY28E Emkay'], rows: [
      ['GWP (₹ cr)', '{{F.gwp.0|num}}', '–', '12,126', '{{F.gwp.1|num}}', '–', '14,135'],
      ['Combined ratio', '{{F.combinedRatio.0|pct}}', '–', '108.9%', '{{F.combinedRatio.1|pct}}', '–', '106.5%'],
      ['Net profit (₹ cr)', '{{F.pat.0|num}}', '~614', '619', '{{F.pat.1|num}}', '~833', '823'],
      ['EPS (₹)', '{{F.eps.0|n2}}', '{{R.street.consensus.0.eps|n2}}', '6.70', '{{F.eps.1|n2}}', '{{R.street.consensus.1.eps|n2}}', '8.90'],
    ], source: 'sharpely consensus (9 analysts), Emkay Global (24-Jul-2026), GAM Research' } },
  ],
};

const GSM = JSON.parse(fs.readFileSync(path.join(RD, 'street-methods.json'), 'utf8'));
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: 'Valuation: the price assumes a ~{{dcf.impliedRoe|pct0}} ROE forever',
  blocks: [
    ...require('./valuation-blend').streetBlocks('GODIGIT', {
      rating: 'SELL',
      streetIntro: 'Indian general insurers are valued almost universally on **one-year-forward P/E on Indian GAAP earnings**: ICICI Lombard at 28-30x FY28E, Star Health at 22-29x, Go Digit at 31-35x where the method is published. Price-to-book and ROE are shown as cross-checks; Emkay is the exception, using residual earnings. We follow the street: P/E is our target method; residual income and P/B are cross-checks.',
      street: GSM.brokers.filter(x => x.tp).map(x => [x.broker.replace(' (HSIE)', '').replace(' Institutional Equities', ''), x.rating, x.tp, x.method ? (/P\/E/.test(x.method) && !/Residual/.test(x.method) ? 'P/E' : /Residual/.test(x.method) ? 'Residual earnings' : x.method) : null, x.multiple && x.multiple.length < 12 ? x.multiple : /Residual/.test(x.method || '') ? '~31x implied' : null, x.basis && x.basis.length < 14 ? x.basis : /Residual/.test(x.method || '') ? 'FY28E EPS' : null, null]),
      ourThesis: 'Half ICICI Lombard\'s ROE; no underwriting profit',
      derivationIntro: 'We apply a one-year-forward P/E to the earnings the market will look at in October 2027: **Sep-28E EPS** (half FY28E, half FY29E, Indian GAAP).',
      derivation: [
        ['1. The sector leader', 'ICICI Lombard: 28-30x FY28E P/E on ~19% ROE, consistent underwriting profit, bank channel', 'Benchmark: ~29x'],
        ['2. Go Digit\'s returns', 'ROE ~12% (FY27-28E), combined ratio ~110%: no underwriting profit yet', 'Discount warranted'],
        ['3. Growth', 'Premium growth above ICICI Lombard\'s, but slowing (GWP −8% in Q1FY27)', 'Partly offsets the discount'],
        ['4. Our multiple', '~15% below ICICI Lombard', '**25x**'],
        ['5. Go Digit\'s own history', 'One-year-forward P/E 54x median since listing (May-2024); ~40x today', 'The market has already de-rated it; we expect more'],
        ['6. The street', '31-35x FY28E (HDFC Sec 31.7x, Emkay-implied ~31x)', 'We are below, because we see no path to ICICI Lombard-like ROE'],
      ],
      history: { field: 'eps', from: '2024-05-01', median: 53.8, label: 'Median since listing: 54x', title: 'One-year-forward P/E: de-rating, but still above our 25x', yearStep: 1, min: 20 },
      crossNote: 'Every method points below today\'s price. Residual income (₹180) and P/B (₹220) bracket the P/E target, so the SELL does not depend on one model: Go Digit is priced for ICICI Lombard-like returns it does not yet earn.',
    }),
    { h: 'Residual income in detail' },
    { p: 'Insurers are best valued on their book value and the return they can earn on it. We use a **residual-income model**: today\'s book value plus the present value of every future year\'s profit above the cost of equity. We use the fairer Ind AS book (₹{{dcf.book|num}} per share at March 2027E, vs ~₹58 on IGAAP), a cost of equity of {{dcf.ke|pct}} and an Ind AS ROE that recovers from ~10.5% in FY27E to a sustainable {{dcf.sustainableRoe|pct0}}, a level that needs Go Digit\'s combined ratio to fall to about 104%.' },
    { pair: [
      { type: 'table', title: 'Residual-income valuation', head: ['', 'Value'], rows: [
        ['Ind AS book value per share (Mar-27E)', '{{dcf.book|inr1}}'], ['PV of excess returns, FY28E–FY42E', '{{dcf.pvRi|inr1}}'], ['PV of terminal value', '{{dcf.pvTv|inr1}}'],
        { hl: true, cells: ['Value per share (Mar-27)', '{{dcf.perShare|inr1}}'] }, { hl: true, cells: ['12-month residual-income value', '{{dcf.intrinsicTp|inr}}'] },
        ['Implied P/B, Ind AS', '{{dcf.justifiedPb|x}}'], ['Current P/B, Ind AS', '{{dcf.currentPb|x}}'], ['Implied P/E FY28E at our target (IGAAP EPS)', '{{dcf.impliedPe|x}}'],
        { hl: true, cells: ['Sustainable ROE implied by today\'s price', '{{dcf.impliedRoe|pct}}'] },
      ], source: SRC.est },
      { type: 'table', grid: 'dcf.sens.grid', rowsRef: 'dcf.sens.waccs', colsRef: 'dcf.sens.gs', corner: 'Cost of equity ↓ / sustainable ROE →', title: 'Residual-income value sensitivity: what ROE do you believe?', source: SRC.est },
    ] },
    { callout: '**Read the sensitivity table this way:** to justify today\'s price you must believe Go Digit will sustainably earn ~19-20% on its Ind AS equity. That is better than ICICI Lombard\'s ~18% today, from a company with higher costs, no bank channel and no underwriting profit. Even at an 18% sustainable ROE our value is below the current price.' },
    { pair: [
      { type: 'line', title: 'P/B since listing: de-rated, but still high', unit: 'Price / book (x), IGAAP', x: 'V.pb.series[].0', series: [{ name: 'P/B', ref: 'V.pb.series[].1', fmt: 'x', thin: true }], labels: 'extremes', yearTicks: true, yearStep: 1, source: 'Screener.in, GAM Research' },
      { type: 'scatter', title: 'P/B vs ROE: Go Digit is priced above the line', points: [{ x: 17.8, y: 4.3, label: 'ICICI Lombard' }, { x: 10, y: 4.11, label: 'Star Health' }, { x: 10.7, y: 3.52, label: 'Niva Bupa' }, { x: 6, y: 0.96, label: 'New India' }, { x: 13.7, y: 0.83, label: 'GIC Re' }, { x: 12.6, y: 5.34, label: 'Go Digit', hl: true }], xtitle: 'ROE FY26 (%)', ytitle: 'Price / book (x)', xfmt: 'n1', yfmt: 'x', source: 'Company data, prices 23-Oct-2026, GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'FY27E EPS', 'FY28E EPS', 'FY29E EPS', 'Long-run ROE', 'Value / share', 'vs CMP', 'What has to happen'], wide: [7], rows: [
      ['**Bull**', '{{scen.bull.eps.0|n2}}', '{{scen.bull.eps.1|n2}}', '{{scen.bull.eps.2|n2}}', '20%', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', '{{as.scenarios.bull.narrative}}'],
      { hl: true, cells: ['**Base (GAM)**', '{{F.eps.0|n2}}', '{{F.eps.1|n2}}', '{{F.eps.2|n2}}', '16%', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', 'Slow cost improvement; combined ratio ~107% by FY29E and ~104% long term.'] },
      ['**Bear**', '{{scen.bear.eps.0|n2}}', '{{scen.bear.eps.1|n2}}', '{{scen.bear.eps.2|n2}}', '13%', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', '{{as.scenarios.bear.narrative}}'],
    ], source: SRC.est } },
  ],
};

const peers = {
  id: 'peers', nav: 'Peers', kicker: 'Relative valuation', title: 'Peers: Go Digit is the most expensive listed general insurer on book value',
  blocks: [
    { exhibit: { type: 'table', title: 'Listed general insurers (Oct-2026)', head: ['Company', 'Mcap (₹ cr)', 'P/B (x)', 'P/E trailing (x)', 'ROE (%)', 'Premium growth (%)', 'Combined ratio (%)'], rows: (I.peers || []).filter(p => p.pb).map(p => ({ hl: /Digit/.test(p.name), cells: [p.name, n0(p.mcapCr), p.pb?.toFixed(2), p.peTrailing?.toFixed(1) ?? '–', p.roe?.toFixed(1) ?? '–', p.gwpGrowth?.toFixed(1) ?? '–', p.combinedRatio?.toFixed(1) ?? '–'] })), source: 'Company data, market prices 23-Oct-2026, GAM Research (global peers indicative)' } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks to our SELL', kicker: 'Risks', title: 'What would make us wrong (upside risks to a SELL)',
  blocks: [
    { verdicts: [
      ['Open offer from the Fairfax–IDBI restructuring', 'Strong', 'If regulators treat the transfer as an indirect acquisition, an open offer could be priced near the ₹375 merger price.', 'SEBI/IRDAI approvals; company disclosures.'],
      ['Costs fall faster than we expect', 'Moderate', 'The DAC unwind and regulatory pressure could cut the expense ratio to ~33% by FY28; every 1 point is ~₹95 cr of PBT.', 'Quarterly expense ratio; EoM compliance.'],
      ['Motor TP tariff hike', 'Moderate', 'No hike since Jun-2022; management thinks 90-95% of segments need one. A hike would lift every motor insurer.', 'Ministry of Road Transport notification.'],
      ['IDBI bancassurance scales fast', 'Moderate', 'A captive bank channel lowers acquisition costs and adds health/retail business.', 'Premium sourced via IDBI; product launches.'],
      ['Market re-rates on Ind AS profits', 'Weak', 'Investors may anchor on Ind AS ROE (17.7% in FY26) rather than IGAAP.', 'Ind AS reporting from FY28 statutory accounts.'],
    ], head: ['Risk to our view', 'Severity', 'Impact', 'What to monitor'], title: 'Upside risks', source: 'GAM Research' },
    { verdicts: [
      ['Expense cap enforcement', 'Strong', 'IRDAI\'s proposed ~1/3 cut in allowed expenses and commission caps could force Go Digit to shrink broker business.', 'Final EoM regulation (Jan-2027).'],
      ['Motor TP claims inflation', 'Moderate', 'The Supreme Court\'s June-2026 Shishupal ruling raises compensation; management did not add reserves.', 'Reserve development in TP triangles.'],
      ['Investment markets', 'Moderate', 'Profit depends on investment income; bond/equity losses hit book value directly.', 'G-sec yields, equity markets.'],
    ], head: ['Further downside risk', 'Severity', 'Impact', 'What to monitor'], title: 'Downside risks', source: 'GAM Research' },
  ],
};

const verdict = {
  id: 'verdict', nav: 'Our honest summary', kicker: 'Summary', title: 'Our honest summary: SELL',
  blocks: [
    { callout: '**What you would be buying:** a well-capitalised, founder-led challenger with conservative reserves, a strong sponsor (Fairfax), a long industry runway and a possible bank channel via IDBI. It has grown fast and its claims discipline is sound.' },
    { callout: '**What you would actually be paying for:** a sustainable ~19-20% return on equity that Go Digit has never earned, from a business that loses money on every ₹100 of insurance it writes, has the second-highest costs in the industry, is breaching the regulator\'s expense cap, has just started losing market share, and whose earnings estimates have been cut every month for a year.' },
    { h: 'How we would act' },
    { bullets: [
      '**Rating: SELL, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** We see better risk-reward in ICICI Lombard, which already earns the returns Go Digit is priced for, at a lower price-to-book.',
      '**Existing holders:** we would exit or reduce. The bull case ({{scen.bull.tp|inr}}, {{scen.bull.upside|chg}}) needs everything to go right; the bear case is {{scen.bear.tp|inr}} ({{scen.bear.upside|chg}}).',
      '**What would make us change our mind:** a combined ratio below 105% for two consecutive quarters, the expense ratio inside the regulatory cap, or an open offer from the Fairfax–IDBI restructuring.',
      '**Price at which we would turn neutral:** around ₹200 (≈2.2x Ind AS book), where a 17-18% long-run ROE would be fairly priced.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Combined ratio FY26', v: '110.7%', d: 'Q1FY27: 112.3%' },
      { k: 'Expenses / premium', v: '40.5%', d: 'regulatory cap 30%' },
      { k: 'Profit from investments', v: '>100%', d: 'underwriting loss ₹866 cr' },
      { k: 'ROE implied by price', v: '{{dcf.impliedRoe|pct}}', d: 'ICICI Lombard earns ~18%' },
      { k: 'Target / downside', v: '{{dcf.tp|inr}}', d: '{{dcf.upside|chg}}' },
    ], source: 'GAM Research' } },
  ],
};

// ---------- annotated statements ----------
const statementNotes = {
  'gwp@FY22': 'Rapid scale-up through brokers and POSP agents; motor-led.',
  'gwp@FY23': 'Continued share gains; health and fire added.',
  'gwp@FY24': 'Growth slowed as the base grew; market share 2.7%.',
  'lossRatio@FY23': 'Benign claims year; favourable development on earlier motor TP years.',
  'lossRatio@FY24': 'Cyclone Michaung and other catastrophe claims; normalisation from FY23\'s low.',
  'lossRatio@FY25': 'Floods (Q2) and higher motor OD claims.',
  'expenseRatio@FY22': 'Investment in distribution and growth; commissions rose with broker share (60%).',
  'expenseRatio@FY24': 'Operating leverage as premium grew.',
  'expenseRatio@FY25': 'Operating leverage; but still above the regulatory cap.',
  'expenseRatio@FY26': 'Multi-year 2W policies: full commission expensed upfront (~2-4 points); health inward reinsurance not renewed.',
  'combinedRatio@FY22': 'Expense build-up during rapid growth.',
  'combinedRatio@FY23': 'Low claims year.',
  'combinedRatio@FY26': '110.7% (108.9% excluding the 1/n rule): front-loaded 2W commissions and motor OD claims.',
  'investmentIncome@FY22': 'Float grew with premiums.',
  'investmentIncome@FY23': 'Larger float and higher yields.',
  'investmentIncome@FY24': 'Larger float; yield 7.3%.',
  'investmentIncome@FY25': 'IPO proceeds (₹1,125 cr) and float growth.',
  'investmentIncome@FY26': 'Float growth; yield 7.4%.',
  'pat@FY23': 'First profit: investment income exceeded the underwriting loss.',
  'pat@FY24': 'Investment income growth; underwriting loss stable.',
  'pat@FY25': 'Investment income +26%; no tax (accumulated losses).',
  'pat@FY26': 'PBT +49%, but tax started (13.8%), so PAT +28%.',
  'pat@FY27E': 'Full 25% tax and flat premiums.',
  'solvency@FY25': 'IPO fresh issue lifted solvency from 1.61x to 2.24x.',
  // quarterly
  'combinedRatio@Q2FY24': 'Higher expenses before the IPO.',
  'combinedRatio@Q4FY24': 'Lower catastrophe losses than Q3.',
  'combinedRatio@Q1FY25': 'Benign claims; operating leverage.',
  'combinedRatio@Q2FY25': 'Flood claims; loss ratio excluding floods 68.8%.',
  'combinedRatio@Q3FY25': 'Lower catastrophe losses; first quarter of the 1/n rule.',
  'combinedRatio@Q4FY25': 'Higher motor OD claims; loss ratio 76.5%.',
  'combinedRatio@Q1FY26': 'Seasonally lower claims.',
  'combinedRatio@Q2FY26': 'Floods (~₹30 cr) and new-2W upfront commissions (~2 points).',
  'gwp@Q1FY27': 'Deliberate de-growth: commercial vehicle and crop/health inward reinsurance cut; GWP −8.4%, first market-share loss.',
  'pat@Q1FY27': 'PAT −38%: higher private-car OD and a large fire claim, full tax (25% vs 14%), no capital gains booked.',
  'pat@Q1FY26': 'First tax-paying quarter (~14%).',
  'pat@Q1FY25': 'First quarter after the IPO; higher investment income.',
};

const statements = {
  id: 'statements', nav: 'Annotated financials', kicker: 'Appendix', title: 'Annotated financials: what moved, and why',
  blocks: [
    { p: 'Highlighted cells moved materially versus the prior period (green = favourable, red = adverse) and are explained in the numbered notes. Insurance figures are from company disclosures on IGAAP; estimates are GAM Research\'s.' },
    { statement: { title: 'Insurance P&L and key ratios, FY21–FY29E', rows: [
      { key: 'gwp', name: 'Gross written premium (₹ cr)', src: 'kpi.gwp', flag: { type: 'pct', th: 20 }, hl: true },
      { key: 'gwpGrowth', name: '  growth %', fn: "(() => { const a = g('kpi.gwp'); return i && a[i] && a[i - 1] ? (a[i] / a[i - 1] - 1) * 100 : null; })()", fmt: 'pct' },
      { key: 'nep', name: 'Net earned premium (₹ cr)', src: 'kpi.nep' },
      { key: 'lossRatio', name: 'Loss (claims) ratio %', src: 'kpi.lossRatio', fmt: 'pct', flag: { type: 'bps', th: 200 }, inverse: true },
      { key: 'expenseRatio', name: 'Expense ratio %', src: 'kpi.expenseRatio', fmt: 'pct', flag: { type: 'bps', th: 150 }, inverse: true },
      { key: 'combinedRatio', name: 'Combined ratio %', src: 'kpi.combinedRatio', fmt: 'pct', flag: { type: 'bps', th: 150 }, inverse: true, hl: true },
      { key: 'uwResult', name: 'Underwriting result (₹ cr)', src: 'kpi.uwResult' },
      { key: 'investmentIncome', name: 'Investment income (₹ cr)', src: 'kpi.investmentIncome', flag: { type: 'pct', th: 20 } },
      { key: 'aum', name: 'Investment assets (₹ cr)', src: 'kpi.aum' },
      { key: 'pbt', name: 'Profit before tax (₹ cr)', src: 'fin.pbt' },
      { key: 'pat', name: 'Net profit (₹ cr)', src: 'fin.pat', flag: { type: 'pct', th: 25 }, hl: true },
      { key: 'eps', name: 'EPS (₹)', src: 'fin.eps', fmt: 'n2' },
      { key: 'roe', name: 'ROE % (IGAAP)', src: 'kpi.roe', fmt: 'pct' },
      { key: 'solvency', name: 'Solvency ratio (x)', src: 'kpi.solvency', fmt: 'n2', flag: { type: 'pct', th: 20 } },
      { key: 'bvps', name: 'Book value per share (₹, IGAAP)', src: 'fin.bvps', fmt: 'n1' },
    ] } },
    { statement: { quarterly: true, title: 'Quarterly insurance KPIs, Q1FY24–Q1FY27', rows: [
      { key: 'gwp', name: 'GWP (₹ cr)', fn: qk('gwp'), yoy: true, flag: { type: 'pct', th: 8 }, hl: true },
      { key: 'nep', name: 'NEP (₹ cr)', fn: qk('nep') },
      { key: 'lossRatio', name: 'Loss ratio %', fn: qk('lossRatio'), fmt: 'pct' },
      { key: 'expenseRatio', name: 'Expense ratio %', fn: qk('expenseRatio'), fmt: 'pct' },
      { key: 'combinedRatio', name: 'Combined ratio %', fn: qk('combinedRatio'), fmt: 'pct', flag: { type: 'bps', th: 250 }, inverse: true, hl: true },
      { key: 'investmentIncome', name: 'Investment income (₹ cr)', fn: qk('investmentIncome') },
      { key: 'pbt', name: 'PBT (₹ cr)', fn: qk('pbt') },
      { key: 'pat', name: 'Net profit (₹ cr)', fn: qk('pat'), yoy: true, flag: { type: 'pct', th: 30 }, hl: true },
      { key: 'solvency', name: 'Solvency (x)', fn: qk('solvency'), fmt: 'n2' },
    ] } },
    { h: 'Financial statements in insurance (IRDAI) format' },
    { p: 'Insurers report in a format set by the regulator: a revenue account (the insurance P&L, for policyholders\' funds), a shareholders\' profit & loss account, a balance sheet that separates policyholders\' and shareholders\' investments, and a direct-method cash flow. Figures below are transcribed from the company\'s results filings (₹ crore, IGAAP).' },
    ...stmtTables(),
  ],
};

// Statement tables (IRDAI format) from research/statements.json.
function stmtTables() {
  const ST = R('statements.json');
  if (!ST.annual) return [];
  const fmtv = v => (v == null ? '–' : v < 0 ? `(${Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })})` : v.toLocaleString('en-IN', { maximumFractionDigits: 0 }));
  const tbl = (title, block, periods) => ({ exhibit: { type: 'table', title, head: ['₹ crore', ...periods], rows: block.map(r => (r.section ? { sec: r.section } : { hl: !!r.bold, cells: [`${r.indent ? '  ' : ''}${r.label}`, ...r.values.map(fmtv)] })), source: 'Go Digit results filings (SEBI Reg-33), GAM Research' } });
  return [
    tbl('Revenue account (policyholders\' account), annual', ST.annual.revenueAccount, ST.annual.periods),
    tbl('Profit & loss (shareholders\' account), annual', ST.annual.profitLoss, ST.annual.periods),
    tbl('Balance sheet, annual', ST.annual.balanceSheet, ST.annual.periods),
    tbl('Cash flow (receipts & payments), annual', ST.annual.cashFlow, ST.annual.periods),
    tbl('Revenue account, quarterly', ST.quarterly.revenueAccount, ST.quarterly.periods),
    tbl('Profit & loss (shareholders\' account), quarterly', ST.quarterly.profitLoss, ST.quarterly.periods),
    { callout: `**Data notes:** ${ST.notes.join(' ')}` },
  ];
}

const financials = {
  id: 'financials', nav: 'Financials (estimates)', kicker: 'Appendix', title: 'Financials: standalone, IGAAP, with GAM estimates',
  blocks: [
    { exhibit: { type: 'rows', title: 'Insurance P&L, balance sheet and valuation', from: 'FY23', rowsRef: [
      { section: 'Premiums & underwriting (₹ crore)' }, { name: 'Gross written premium', ref: 'kpi.gwp', hl: true }, { name: 'Net written premium', ref: 'kpi.nwp' }, { name: 'Net earned premium', ref: 'kpi.nep' },
      { name: 'Loss ratio %', ref: 'kpi.lossRatio', fmt: 'pct' }, { name: 'Expense ratio %', ref: 'kpi.expenseRatio', fmt: 'pct' }, { name: 'Combined ratio %', ref: 'kpi.combinedRatio', fmt: 'pct', hl: true }, { name: 'Underwriting result', ref: 'kpi.uwResult' },
      { section: 'Investments & profit (₹ crore)' }, { name: 'Investment assets', ref: 'kpi.aum' }, { name: 'Investment income', ref: 'kpi.investmentIncome' }, { name: 'Profit before tax', ref: 'fin.pbt' }, { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2' }, { name: 'EPS growth %', ref: 'fin.epsGrowth', fmt: 'chg' },
      { section: 'Balance sheet & returns' }, { name: 'Net worth (₹ crore)', ref: 'fin.netWorth' }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' }, { name: 'ROE %', ref: 'kpi.roe', fmt: 'pct' }, { name: 'Solvency (x)', ref: 'kpi.solvency', fmt: 'n2' },
      { section: 'Valuation at CMP' }, { name: 'P/E (x)', fn: "g('P.last') / g('fin.eps')[i]", fmt: 'x' }, { name: 'P/B, IGAAP (x)', fn: "g('P.last') / g('fin.bvps')[i]", fmt: 'x' },
    ], source: SRC.est } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Insurance terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['GWP (gross written premium)', 'Total premium written in the year, including reinsurance accepted.'],
      ['GDPI (gross direct premium income)', 'Premium from policies sold directly to customers (excludes reinsurance accepted); used for market share.'],
      ['NWP (net written premium)', 'Premium kept after passing part of the risk (and premium) to reinsurers.'],
      ['NEP (net earned premium)', 'The part of net premium that relates to the cover already provided in the year; the rest is earned later.'],
      ['Retention ratio', 'NWP as a % of GWP: how much risk the insurer keeps.'],
      ['Loss (claims) ratio', 'Claims incurred as a % of earned premium.'],
      ['Expense ratio', 'Commissions plus operating expenses as a % of net written premium.'],
      ['Combined ratio', 'Loss ratio + expense ratio. Below 100% = profit from insurance; above 100% = loss, covered by investment income.'],
      ['Underwriting result', 'Profit or loss from insurance itself, before investment income.'],
      ['Float', 'Premiums collected but not yet paid out as claims; invested in the meantime.'],
      ['Solvency ratio', 'Available capital as a multiple of the regulatory minimum (minimum 1.5x).'],
      ['EoM (expenses of management)', 'IRDAI limit on commissions and operating costs as a % of premium (currently 30% for general insurers).'],
      ['1/n rule', 'IRDAI rule (Oct-2024): premium on multi-year policies is recognised one year at a time, lowering reported growth.'],
      ['Motor OD / TP', 'Own damage (cover for the customer\'s vehicle) and third party (mandatory liability cover, price set by the government).'],
      ['IGAAP vs Ind AS', 'Old Indian insurance accounting vs the new standard (similar to IFRS 17) mandatory from Apr-2026; Ind AS defers acquisition costs and discounts reserves.'],
      ['DAC (deferred acquisition cost)', 'Commissions and costs of selling a policy, spread over the policy term under Ind AS rather than expensed upfront.'],
      ['Reserve development', 'How actual claims compare with the reserves set aside earlier; favourable = reserves were more than enough.'],
      ['ROE (return on equity)', 'Net profit as a % of shareholders\' equity.'],
      ['Cost of equity', 'The return shareholders require (here 12.6%); returns below it destroy value.'],
      ['Residual-income valuation', 'Book value plus the present value of future profits above the cost of equity.'],
      ['P/B (price to book)', 'Share price divided by book value per share.'],
      ['Bancassurance', 'Selling insurance through a bank\'s branches and customers.'],
      ['POSP', 'Point-of-sale person: an individual licensed to sell simple insurance products.'],
      ['Open offer', 'An offer to buy shares from minority shareholders, required under SEBI rules when control of a listed company changes.'],
    ], source: 'GAM Research' } },
  ],
};

const report = {
  symbol: 'GODIGIT', listing: 'NSE: GODIGIT · BSE: 544179', date: '23 October 2026', rating: 'SELL', analysts: 'GAM Research — Financials (Insurance)',
  cover,
  sections: [narrative, industry, tailwinds, story, mix, underwriting, float, twoBooks, moat, ownership, governance, earnings, valuation, peers, risks, verdict, statements, financials, glossary],
  statementNotes,
};
const out = path.join(RD, 'initiation.json');
fs.writeFileSync(out, JSON.stringify(report, null, 1));
console.log(`wrote ${out}: ${report.sections.length} sections, ${JSON.stringify(report).match(/"type":/g).length} chart/table exhibits`);
