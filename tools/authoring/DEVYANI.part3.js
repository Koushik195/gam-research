// Devyani report, part 3: India, International, margins before and after rent, the Sapphire merger, competitive advantage.
const X = require('./DEVYANI.ctx');
const { F, SQ, SA, n0, n1, n2, pc, Q1, f26, f25, segM, indiaRows, rps26, BL, AS, rent, rent26, preEbitda, preEbitda26, PF, V, price, shares, evMULT, phiSep, C } = X;
const P4 = 'Q4FY26 presentation (15-May-2026)', P1 = 'Q1FY27 presentation and call (29-Jul-2026)', AR = 'AR FY26 note 49';
const QL = SQ.map(q => q.q), pct = (a, c) => Math.round(a / c * 1000) / 10;

const india = {
  id: 'india', nav: 'India', kicker: 'Segment 1', title: `India: KFC back to growth (+${Q1.kfcGrowthPct}% in Q1FY27), Pizza Hut still shrinking, own brands the new leg`,
  blocks: [
    { p: `India revenue rose from ₹${n0(f25.indiaRev)} cr in FY25 to ₹${n0(f26.indiaRev)} cr in FY26 (+${n1((f26.indiaRev / f25.indiaRev - 1) * 100)}%) and ₹${n0(SQ.at(-1).indiaRev)} cr in Q1FY27 (+${n1((SQ.at(-1).indiaRev / SQ[0].indiaRev - 1) * 100)}%, ~8% without the Biryani By Kilo base effect). **KFC** (₹${n0(f26.kfcRev)} cr, ${f26.kfcStores} stores at Mar-2026) grew ${n1((f26.kfcRev / f25.kfcRev - 1) * 100)}% in FY26 on 87 net new stores while same-store sales fell 0.8%; in Q1FY27 revenue rose ${Q1.kfcGrowthPct}% with SSSG +${Q1.kfcSssg}%, daily sales per store flat at ₹${Q1.kfcAdsK}k, dine-in up to ${Q1.kfcOnPremisePct}% of sales and gross margin up 2.3 points to 69.4% as discounts on delivery were cut. **Pizza Hut** (₹${n0(f26.phRev)} cr) fell 1.6% in FY26 and Q1FY27 (SSSG ${Q1.phSssg}%), closed 13 stores in Q1 and lost ₹3.6 cr at brand level; management will push it only after the merger simplifies decisions with Yum! and Sapphire. **Own brands** (₹${n0(Q1.ownBrandsRev)} cr in Q1FY27) and **Costa** (SSSG +${Q1.costaSssg}%) are growing fastest.` },
    { pair: [
      { type: 'column', title: 'India EBITDA margin after rent: 7.1% (Q1FY26) to 8.1% (Q1FY27)', unit: 'India operating EBITDA, pre-Ind AS 116 (% of India revenue)', x: QL, series: [{ name: 'After rent (pre-Ind AS)', values: SQ.map(q => pct(q.indiaPreIndAs, q.indiaRev)), fmt: 'pct' }, { name: 'Before rent (post-Ind AS)', values: SQ.map(q => (q.indiaEbitda ? pct(q.indiaEbitda, q.indiaRev) : null)), fmt: 'pct' }], labels: 'all', source: `${P4}; ${P1}; MOSL 30-Jul-2026. India revenue = consolidated less International. Q1FY27 India EBITDA before rent not disclosed.` },
      { type: 'column', title: 'Our KFC India store build: ~115 net new stores a year', unit: 'KFC India stores at year end', x: ['FY25', 'FY26', ...indiaRows.map(r => r.y)], series: [{ name: 'KFC stores', values: [BL.kfcStoresMar25, BL.kfcStoresMar26, ...indiaRows.map(r => r.stores)], fmt: 'num' }], labels: 'all', source: 'Company (FY25-26); GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'India build: KFC stores x revenue per store, plus the other brands (our forecast, ₹ crore)', head: ['', 'FY25', 'FY26', ...indiaRows.map(r => r.y)], rows: [
      ['KFC net new stores', '–', '87', ...indiaRows.map(r => n0(r.adds))], ['KFC stores at year end', n0(BL.kfcStoresMar25), n0(BL.kfcStoresMar26), ...indiaRows.map(r => n0(r.stores))],
      ['KFC revenue per average store (₹ cr)', '–', n2(rps26), ...indiaRows.map(r => n2(r.rps))], ['KFC India revenue', n0(f25.kfcRev), n0(f26.kfcRev), ...indiaRows.map(r => n0(r.kfc))],
      ['Pizza Hut', n0(f25.phRev), n0(f26.phRev), ...indiaRows.map(r => n0(r.ph))], ['Own brands (Vaango, BBK)', n0(f25.ownRev), n0(f26.ownRev), ...indiaRows.map(r => n0(r.own))],
      ['Costa and other franchisee brands', n0(f25.franchRev), n0(f26.franchRev), ...indiaRows.map(r => n0(r.fr))],
      ['Food courts, other, eliminations', n0(f25.indiaRev - f25.kfcRev - f25.phRev - f25.ownRev - f25.franchRev), n0(BL.otherRevFY26), ...indiaRows.map(r => n0(r.ot))],
      { hl: true, cells: ['**India revenue**', `**${n0(f25.indiaRev)}**`, `**${n0(f26.indiaRev)}**`, ...indiaRows.map(r => `**${n0(r.rev)}**`)] }, ['growth', '–', `+${n1((f26.indiaRev / f25.indiaRev - 1) * 100)}%`, ...indiaRows.map(r => `+${n1(r.g)}%`)],
      ['India EBITDA margin (after Ind AS 116)', `${f25.indiaMarginPct}%`, `${f26.indiaMarginPct}%`, ...segM('india').map(v => `${n1(v)}%`)],
    ], source: `${AR}; ${P4}; GAM estimates. The build reproduces the model's India growth within 0.3 points (checked in DEVYANI.ctx.js).` } },
    { callout: `**Our view:** India is a KFC story. We assume revenue per KFC store dips ${Math.abs(BL.revPerStoreGrowth[0])}% in FY27E (new stores open below the ₹3.2 cr average) and rises ~0.5-1% after, i.e. SSSG of ~3-5%, below management's 5-6%. Margins rise ~0.6 points a year (to {{as.segments.0.marginPct.2|pct}} before rent in FY29E, still below FY25's ${f25.indiaMarginPct}%): KFC operating leverage, partly spent on Pizza Hut, LPG and wages. No merger synergies.` },
  ],
};

const intl = {
  id: 'international', nav: 'International', kicker: 'Segment 2', title: 'International: Thailand is a third of revenue, growing on stores and currency, and Temasek owns half of it',
  blocks: [
    { p: `International revenue rose from ₹${n0(f25.intlRev)} cr (FY25) to ₹${n0(f26.intlRev)} cr (FY26, +${n1((f26.intlRev / f25.intlRev - 1) * 100)}%) and ₹${n0(Q1.intlRev)} cr in Q1FY27 (+${Q1.intlGrowthPct}%). Thailand (₹${n0(f26.thailandRev)} cr in FY26, ${n0(C.business.storesJun26.thailand)} KFC stores) is 91% of it; KFC Thailand's daily sales per store have stayed at THB 54-57k for two years, so growth is new stores (24 added in FY26 across Thailand and Nepal) and a weaker rupee. Nepal (38 stores) is small but profitable (₹7 cr of profit in FY26); Nigeria (39 stores) lost money and has negative net worth. Brand contribution rose to ${Q1.intlBrandContributionPct}% in Q1FY27 (+1.5 points) and EBITDA after rent to ${n1(Q1.intlPreIndAs / Q1.intlRev * 100)}%.` },
    { pair: [
      { type: 'column', title: `International margin after rent: ${n1(pct(SQ[0].intlPreIndAs, SQ[0].intlRev))}% (Q1FY26) to ${n1(pct(Q1.intlPreIndAs, Q1.intlRev))}% (Q1FY27)`, unit: 'International operating EBITDA, pre-Ind AS 116 (% of revenue)', x: QL, series: [{ name: 'After rent', values: SQ.map(q => pct(q.intlPreIndAs, q.intlRev)), fmt: 'pct' }], labels: 'all', source: `${P4}; ${P1}` },
      { type: 'line', title: 'Segment EBITDA margins (before rent): ours for FY27-29E', unit: 'Segment EBITDA ÷ revenue (%), after Ind AS 116', x: ['FY25', 'FY26', ...F.years], series: [{ name: 'India', values: [f25.indiaMarginPct, f26.indiaMarginPct, ...segM('india').map(v => Math.round(v * 10) / 10)], fmt: 'pct' }, { name: 'International', values: [f25.intlMarginPct, f26.intlMarginPct, ...segM('intl').map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', min: 10, max: 20, source: `${P4}; GAM estimates` },
    ] },
    { exhibit: { type: 'table', title: 'Who owns what outside India', head: ['Business', 'Holding structure', 'Devyani\'s economic share', 'FY26 revenue (₹ cr)', 'FY26 profit (₹ cr)'], wide: [1], rows: [
      ['KFC Thailand (Restaurants Development Co.)', 'Devyani International DMCC (Dubai): 51% Devyani, 49% Camas (Temasek); Thai holding companies below', '47.55% (minorities 52.45%)', n0(f26.thailandRev), '12.5 (DMCC level)'],
      ['Nigeria (KFC, Pizza Hut)', 'RV Enterprizes (Singapore) 87.31%; it owns 68.75% of the Nigerian company', '~60%', '88', '-0.6'],
      ['Nepal (KFC, Pizza Hut)', 'Devyani International (Nepal), 100%', '100%', `${n0(f26.rowRev - 87.8)}`, '7.0'],
    ], source: 'AR FY26 notes 2 (subsidiaries), 51 (non-controlling interests) and 52' } },
    { callout: `**Our view:** we model International +{{as.segments.1.growth.0|pct0}} / +{{as.segments.1.growth.1|pct0}} / +{{as.segments.1.growth.2|pct0}} with margins rising to {{as.segments.1.marginPct.2|pct}} before rent. The valuation point matters more than the forecast: about ${n1(phiSep * 100)}% of the group's Sep-28E EBITDA belongs to Camas, so we deduct it in the SOTP. The AR also flags that Thailand is running below the acquisition business case (an impairment indicator, though no impairment was booked).` },
  ],
};

const margins = {
  id: 'margins', nav: 'Rent: two EBITDAs', kicker: 'Unit economics', title: `Two EBITDAs: ${Q1.ebitdaMarginPct}% before rent, ${Q1.preIndAsMarginPct}% after rent in Q1FY27`,
  blocks: [
    { p: `Under Ind AS 116, store rent is not an operating expense: it becomes depreciation of a "right-of-use" asset plus interest on a lease liability. Devyani's reported EBITDA (${Q1.ebitdaMarginPct}% in Q1FY27) therefore excludes rent; its "operating EBITDA" (${Q1.preIndAsMarginPct}%) deducts it. In FY26 the gap was ₹${n0(rent26)} cr (lease principal ₹${n0(AS.rentBuild.fy26.leasePrincipal)} cr + lease interest ₹${n0(AS.rentBuild.fy26.leaseInterest)} cr), 7.2% of revenue. The street values Devyani on the after-rent number; we value reported EBITDA with leases as debt (same economics, consistent with the stock's own history and the peers' Screener multiples).` },
    { exhibit: { type: 'table', title: 'From EBITDA before rent to EBITDA after rent (₹ crore)', head: ['', 'FY25', 'FY26', ...F.years], rows: [
      ['EBITDA (after Ind AS 116, before rent)', n0(f25.ebitda), n0(f26.ebitda), ...F.ebitda.map(n0)], ['Less: rent (lease principal + interest)', n0(AS.rentBuild.fy25.leasePrincipal + AS.rentBuild.fy25.leaseInterest), n0(rent26), ...rent.map(n0)],
      { hl: true, cells: ['**EBITDA after rent (pre-Ind AS 116)**', `**${n0(f25.preIndAsEbitda)}**`, `**${n0(preEbitda26)}**`, ...preEbitda.map(v => `**${n0(v)}**`)] },
      ['margin after rent', `${n1(f25.preIndAsEbitda / f25.revenue * 100)}%`, `${n1(preEbitda26 / f26.revenue * 100)}%`, ...preEbitda.map((v, i) => `${n1(v / F.sales[i] * 100)}%`)],
    ], source: 'AR FY26 cash flow (lease payments); presentations (operating EBITDA); GAM estimates (rent grows with stores)' } },
    { bullets: [
      `**Gross margin** ${Q1.grossMarginPct}% in Q1FY27 (+0.9 points): price increases at KFC and Pizza Hut, fewer delivery discounts; LPG and dairy costs rose.`,
      '**Brand contribution** (store profit after rent, staff, utilities, marketing, royalty) 14.2% consolidated in Q1FY27 (KFC 17.0%, Pizza Hut -1.9%, own brands 10.2%, Costa and others 15.1%, International 18.2%).',
      '**Head office** ~4.6% of revenue (brand contribution 14.2% less operating EBITDA 9.6%), down ~0.4 points in a year.',
      '**Royalty** to Yum! and other franchisors ~6.5% of revenue: a permanent cost the owner-operators (Jubilant\'s Hong\'s, Devyani\'s BBK) do not pay.',
    ] },
    { callout: '**So what:** after rent, Devyani earns under 10 paise per rupee of sales and depreciation of owned fit-outs takes most of that. A one-point gain in after-rent margin is worth ~₹60 cr of EBITDA a year, which is why ADS (daily sales per store) is the number to watch.' },
  ],
};

const merger = {
  id: 'merger', nav: 'The Sapphire merger', kicker: 'Corporate action', title: 'The Sapphire merger: 46% more shares for a business of ~55% of Devyani\'s size; pending on 30-Sep-2026, so not in our base',
  blocks: [
    { p: `On 1-Jan-2026 the boards agreed to merge Sapphire Foods (KFC and Pizza Hut in south and west India and Sri Lanka; FY26 revenue ₹3,125 cr, EBITDA ₹474 cr, Screener) into Devyani at 177 Devyani shares for every 100 Sapphire shares: ${n1(PF.newShares)} cr new shares, ${n0(PF.dilution)}% of Devyani's ${n1(shares)} cr. Yum! supports the deal (new development agreements; Devyani to run Pizza Hut fully, buy 19 Yum!-run KFC stores in Hyderabad and pay a one-time fee of ~₹320 cr). Management claims ₹210-225 cr a year of net synergies (~60% in year one, all within two years). The appointed date is 1-Apr-2026. The exchanges cleared the scheme on 12-Jun-2026; on 26-Aug-2026 the planned purchase of 18.5% of Sapphire by Arctic International (an RJ Corp company) was dropped, so Sapphire's promoter takes Devyani shares instead. **On 30-Sep-2026 CCI and NCLT approvals were still pending** (management: completion by end-FY27). The merged company would have ${n1(PF.total)} cr shares with the RJ Corp group at 41.99%.` },
    { exhibit: { type: 'table', title: 'What the merger could be worth to a Devyani share (sensitivity, not in the target)', head: ['Case', 'How Sapphire is valued', 'Synergies', 'Value per merged share (₹)', 'vs our standalone target'], wide: [1], rows: [
      ['Standalone (our base)', '–', '–', '{{dcf.tp|num}}', '–'],
      ['A. Sapphire at market', `₹${n0(PF.sapMkt)} cr (30-Sep-2026 market value)`, 'None', n0(PF.mktNoSyn), pc((PF.mktNoSyn / V.tp - 1) * 100)],
      ['B. Sapphire at market, full synergies', 'As A', `₹217.5 cr x ${evMULT.base}x less the ₹320 cr Yum! fee`, n0(PF.mktSyn), pc((PF.mktSyn / V.tp - 1) * 100)],
      ['C. Sapphire at our multiple', `${evMULT.base}x its FY26 EBITDA grown at our Devyani rate to Sep-28E (₹${n0(PF.sapEbSep)} cr) less ₹${n0(PF.sapNd26)} cr net debt incl. leases`, 'None', n0(PF.oursNoSyn), pc((PF.oursNoSyn / V.tp - 1) * 100)],
      ['D. As C, full synergies', 'As C', 'As B', n0(PF.oursSyn), pc((PF.oursSyn / V.tp - 1) * 100)],
    ], source: `Merger presentation (1-Jan-2026) and call (13-Jan-2026); Screener.in (Sapphire FY26, Mar-2026 balance sheet); NSE close ${X.ASOF_TXT}; GAM Research. Devyani at our base SOTP equity value.` } },
    { callout: `**Our read:** at the 30-Sep close Sapphire traded at ${n2(PF.swapMkt)} Devyani shares against the 1.77 swap ratio, a ${n0((1 - PF.swapMkt / 1.77) * 100)}% discount for time and deal risk. Whether the deal adds value depends on two things the market cannot yet see: Sapphire's worth (its shares have traded at lower multiples than Devyani's) and delivery of the synergies, which are management's estimate. If Sapphire is worth its market price, the swap alone dilutes our standalone value and the synergies must make up the gap; at our multiple it adds value even without them. Per PLAYBOOK §1 and the BELRISE precedent we keep a deal that needed regulatory approvals on 30-Sep-2026 out of the base and show it here.` },
  ],
};

const moatV = X.D.moat;
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'A rented moat: exclusive Yum! territories and a strong KFC brand, but no pricing power and no ownership of the brands',
  blocks: [
    { verdicts: moatV.scores.map(([f, ev, s]) => [f, ['None', 'Weak', 'Moderate', 'Strong'][s] || 'Moderate', ev, s >= 3 ? 'Supports growth and site access' : s === 2 ? 'Promising, not proven' : 'Limits margins']), head: ['Factor', 'Score', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: `${P1}; AR FY26; GAM Research` },
    { callout: `**Verdict:** ${moatV.verdict}` },
  ],
};

module.exports = { india, intl, margins, merger, moat };
