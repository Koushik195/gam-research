// HCL Technologies report, part 2b: the central question (is the 2025-26 IT de-rating a cycle or a lasting AI
// re-pricing?) and the tailwind test.
const X = require('./HCLTECH.ctx');
const { D, F, n0, n1, pc, rup, SRC, SQ, Q1, derate, sectorDr, tier1Dr, FM, peMult } = X;
const RPE = [['Q1FY26', 63.4], ['Q2FY26', 63.9], ['Q3FY26', 64.6], ['Q4FY26', 65.1], ['Q1FY27', 65.5]];

const aiQuestion = {
  id: 'ai', nav: 'The AI question', kicker: 'The central question', title: 'Cycle or lasting de-rating? Mostly lasting: AI is shrinking the work HCLTech is paid for, faster than new AI work replaces it',
  blocks: [
    { p: `This is the question that decides the stock, and the whole sector. Indian IT shares fell hard in 2025-26: the Nifty IT index was ~25% down in 2026 by early June and ~29% below its late-2025 high (Analytics India Magazine, 9-Jun-2026). By ${X.ASOF_TXT} eight listed IT peers traded a median ${Math.abs(Math.round(sectorDr))}% below their own five-year median P/E (TCS ${pc(derate.TCS)}, Infosys ${pc(derate.INFY)}, Wipro ${pc(derate.WIPRO)}); HCLTech ${pc(derate.HCLTECH)}. Two explanations compete. The **cyclical** one: clients froze discretionary budgets because of tariffs, war in West Asia and an uncertain US economy, and spending will come back as it did after 2009 and 2020. The **structural** one: generative AI lets clients do the same work with far fewer people, and because Indian IT is paid largely for people and time, its revenue pool shrinks for good.` },
    { exhibit: { type: 'table', title: 'What happened, and what it points to', head: ['When', 'What happened', 'Source', 'Points to'], wide: [1], rows: D.sectorEvidence.map(r => r.map(rup)), source: 'As cited; GAM Research' } },
    { exhibit: { type: 'table', title: 'Management\'s own framework (Apr-2026): three kinds of IT spend', head: ['Bucket', 'Share of industry spend today', 'Expected growth', 'Examples', 'What it implies'], wide: [3, 4], rows: [
      ['**AI-disrupted**', '~40%', 'Shrinks 3-5% a year; ~25% of spend eventually', 'Application development and support, traditional infrastructure operations, customer support', 'For HCLTech\'s mix: 2-3% a year of deflation, "very little" of it in reported numbers yet; expected from FY27'],
      ['**AI-amplified**', '~55%', '~10%+ a year', 'Data, cybersecurity, cloud', 'The middle that must carry growth; HCLTech\'s Financial Services (+7.5% in FY26) is the best example'],
      ['**AI-native**', '~5%', '~30% a year; 20%+ of spend in five years', 'AI factories and data centres, AI and custom-silicon engineering, physical AI', 'HCLTech\'s Advanced AI: US$171 m a quarter, +62% YoY, ~4.7% of revenue'],
    ], source: 'HCLTech Q4FY26 earnings call (21-Apr-2026), CEO C Vijayakumar' } },
    { pair: [
      { type: 'column', title: 'Fewer people: headcount fell 3,292 in Q1FY27', unit: 'Headcount, period end', x: SQ.map(q => q.q), series: [{ name: 'People', values: SQ.map(q => q.headcount), fmt: 'num' }], labels: 'ends', min: 200000, source: 'Investor releases' },
      { type: 'line', title: '...and more revenue per person: +3.3% in a year', unit: 'Revenue per employee, US$ thousand a year (LTM)', x: RPE.map(r => r[0]), series: [{ name: 'Revenue per employee', values: RPE.map(r => r[1]), fmt: 'n1' }], labels: 'all', min: 60, max: 67, source: 'Investor releases' },
    ] },
    { exhibit: { type: 'table', title: 'The evidence for HCLTech, weighed', head: ['Evidence', 'Cyclical or structural?', 'Our reading'], wide: [0, 2], rows: [
      ['Two large US telecom clients cut CY2026 discretionary spend; SAP programmes cancelled; a manufacturing and a retail client scaled down', 'Cyclical', 'Client-specific budget decisions (CEO); worth ~0.5-1 pt of FY27 growth; should lap in FY28.'],
      ['Tariffs, West Asia, US government shutdown delayed software deals in March 2026', 'Cyclical', 'Hit HCLSoftware\'s Q4FY26 (-28% QoQ); timing, not lost demand.'],
      ['"A US$100 million deal would be ... maybe 80 million" for the same scope; TCV flat at US$9.3 bn with 25-30% more effort', 'Structural', 'Price per unit of work is falling; this is the AI deflation, already in bookings.'],
      ['Annual productivity give-backs in managed-services contracts (-110 bp of margin in Q1FY27 with the ERS decline)', 'Structural', 'Built into HCLTech\'s biggest business; AI makes the promised productivity larger.'],
      ['Headcount down while revenue per employee rises for five quarters', 'Structural', 'Revenue is decoupling from people: good for margins, bad for the size of the revenue pool.'],
      ['Record Q1 bookings (US$2.4 bn) plus a US$1.14 bn mega deal', 'Cyclical (positive)', 'Real share gains; but mega deals are cost take-outs that ramp slowly and re-price lower over time.'],
      ['Advanced AI revenue +62% YoY; AI Factory deals of US$100-180 m with tech majors', 'Structural (positive)', 'A genuine new pool, but ~4.7% of revenue: at 30% growth it adds ~1.4 pts a year, about half the 2-3% deflation.'],
      ['Sector P/E ~34% below five-year medians; brokers cutting multiples for "cannibalisation risk"', 'Structural (market view)', 'The market has decided; it needs earnings evidence to change its mind.'],
    ], source: 'HCLTech calls (Apr/Jul-2026), investor releases, broker notes; GAM Research' } },
    { callout: `**Our verdict: mostly lasting.** The client-specific cuts are cyclical and should fade by FY28. But three things are structural: (1) AI deflation is now visible in deal values (~20% smaller for the same scope) and in productivity give-backs, before most of it has reached revenue; (2) the AI-native work that grows fast is ~5% of revenue and adds ~1.4 pts of growth a year against 2-3 pts of deflation; (3) the people-based model that earned premium multiples for two decades is what AI compresses. We therefore forecast US$ growth of only ~3-4% a year even with the mega deal, hold EBIT margins flat near 18% (productivity goes to clients), and do **not** assume the sector re-rates: our ${peMult}x target multiple keeps the full ${Math.abs(Math.round(sectorDr))}% sector de-rating on HCLTech's ${n1(FM.median)}x median. What would change our mind: two or three quarters of Services growth above 5% CC with stable pricing, or Advanced AI reaching ~10% of revenue while traditional revenue holds.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: HCLTech catches the AI-native and rupee tailwinds; the software and discretionary ones have stalled',
  blocks: [
    { verdicts: [
      ['AI-native spend (AI factories, data centres, chip and physical-AI engineering)', 'Yes, small', `Advanced AI US$${Q1.advAiUsd} m in Q1FY27 (+62% YoY); AI Factory programmes worth US$100 m+ and US$180 m+ with tech majors; Gartner "Market Shaper" in physical AI.`, 'Fastest-growing pool, ~4.7% of revenue.'],
      ['Vendor consolidation and mega deals', 'Yes', 'Record Q1 TCV US$2.4 bn plus a US$1.14 bn mega deal (Fortune Global 50, digital workplace and networks).', 'Supports FY28; productivity-led pricing caps the revenue per deal.'],
      ['Weaker rupee', 'Yes (translation)', `Q1FY27 revenue +13.9% in rupees vs +3.0% in dollars; forex added 60 bp to EBIT. INR/USD 94.73 in Q1, 95.81 at 30-Sep.`, 'Lifts FY27 EPS; management is reinvesting part of it in sales and AI.'],
      ['Data and AI preparation in banks', 'Yes', 'Financial Services +7.5% CC in FY26 and +5.3% in Q1FY27, "highest in the industry" (CEO).', 'The AI-amplified bucket working.'],
      ['Engineering and R&D outsourcing', 'Partly', 'ERS +9.8% in FY26 but +0.3% YoY and -3.7% QoQ in Q1FY27 (telecom and tech cuts).', 'Cyclical; the HPE Telco Solutions buy adds scale in telecom.'],
      ['Software and IP (non-linear revenue)', 'No', 'HCLSoftware -4.1% CC in FY26 and -5.3% YoY in Q1FY27; perpetual licences -29%; ARR flat near US$1.05 bn.', 'A cash generator, not a growth engine.'],
      ['Sovereign AI and India demand', 'Early', 'India revenue +16.9% in Q1FY27 but 3.3% of Services; US$150 m in Sarvam; data-centre plan.', 'Optionality, with capital risk.'],
      ['Discretionary spending recovery', 'Not yet', 'Guidance unchanged in July; macro "the same" as in March (CEO).', 'Upside if it comes in FY28.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { aiQuestion, tailwind };
