// Alkem Laboratories report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./ALKEM.ctx');
const { C, D, F, A, n0, n1, SA, SQ, QL, Q1, FY26, YRS, LINES, LBL, BL, build, base26, mixPct } = X;
const IR = D.industry.alkemRanks, TH = D.industry.therapy;

const business = {
  id: 'business', nav: 'What Alkem does', kicker: 'The business', title: 'India\'s #6 drug maker: an acute-medicine franchise (antibiotics, antacids, pain, vitamins) with a US generics arm and three new bets',
  blocks: [
    { p: `Alkem sells medicines. Two-thirds of revenue (₹${n0(FY26.india)} cr of ₹${n0(FY26.revenue)} cr in FY26) comes from India, where it is the 6th-largest company by value (~4.1% market share), 3rd by number of prescriptions and #1 in anti-infectives (antibiotics) for more than 15 years. Its biggest brands treat short, common illnesses: Pan (pantoprazole for acidity; the IPM's #2 brand family), Clavam and Taxim (antibiotics), A to Z (vitamins), Pan-D. These are "acute" therapies: patients take them for days, not years. About 22-23% of branded sales are "chronic" (diabetes, nerves, skin, breathing), where Alkem is a mid-ranked player. It also sells unbranded "trade generics" through distributors to chemists at low prices (it is #1 or #2 in that channel; moved into a subsidiary, Alkem Wellness, in FY26). Outside India, the US is 20% of revenue (192 generic applications filed, two plants in India and one API plant in California serve it), and other international markets (Australia, Chile, Germany, the UK, the Philippines and others) are 12%. On top sit three new bets, all loss-making or small today: Enzene (biosimilars and contract manufacturing of antibodies), Alkem MedTech (orthopaedic implants; 55% of Occlutech, a German heart-device maker, from Jul-2026) and generic semaglutide.` },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue by business: two-thirds India', unit: 'FY26 revenue (₹ crore)', x: ['India (branded + trade generics)', 'United States', 'Other international', 'Other operating income'], series: [{ name: 'FY26', values: [FY26.india, FY26.us, FY26.row, FY26.otherOp].map(Math.round), fmt: 'num' }], labels: 'all', highlight: 'India (branded + trade generics)', source: 'Q4FY26 investor presentation' },
      { type: 'stacked', title: 'Mix over time: India ~65-70%, the US ~20%, the rest rising', unit: 'Revenue by business (₹ crore); FY20-24 India/US from MOSL exhibits', x: SA.map(s => s.fy), series: [{ name: 'India', values: SA.map(s => s.india), fmt: 'num' }, { name: 'US', values: SA.map(s => s.us), fmt: 'num' }, { name: 'Other intl + other income', values: SA.map(s => s.rowOther), fmt: 'num' }], labels: 'none', source: 'Company presentations; MOSL (15-Aug-2026)' },
    ] },
    { exhibit: { type: 'table', title: 'Five engines and how big each is', head: ['Engine', 'What it sells', 'FY26 size', 'Recent growth', 'Position'], wide: [1, 4], rows: [
      ['India branded acute (~77% of branded)', 'Anti-infectives (Clavam, Taxim), gastro (Pan, Pan-D), pain, vitamins (A to Z), derma', '~77% of branded India sales (IQVIA domestic sales ₹8,832 cr at retail prices, MAT Mar-26)', 'Acute +12.3% in Q1FY27 vs IPM +10.1% (IQVIA)', '#1 anti-infectives (13.3%), #2 VMN, #3 pain, #4 gastro'],
      ['India branded chronic (~22-23% of branded)', 'Anti-diabetic (empagliflozin combos, semaglutide), CNS, derma, urology, respiratory', '~22-23% of branded India sales (CEO, May-2026)', 'Chronic +17.9% in Q1FY27 vs IPM +15.4%', '#13 anti-diabetic, #8 CNS, #14 respiratory, #19 derma'],
      ['India trade generics (Alkem Wellness)', 'Unbranded generics sold to distributors and chemists', 'Not disclosed', '~4% in FY26; flat in Q1FY27', '#1-2 in the channel; competition rising'],
      ['United States', 'Oral solid generics (192 ANDAs filed, 170 approved), API from California, Enzene US CDMO', `₹${n0(FY26.us)} cr`, '+20% FY26 (sacubitril-valsartan launch); +6.5% Q1FY27', 'Price-taker; Daman (45% of US sales) under OAI'],
      ['Other international and new businesses', 'Australia, Chile, Germany, UK, Asia; Enzene biosimilars; MedTech; Occlutech from Jul-2026', `₹${n0(FY26.row)} cr`, '+27% FY26; +34.5% Q1FY27', 'Small markets growing fast from a low base'],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls; AR FY26 p. 85; IQVIA via company. the branded/trade-generics split is not disclosed (gap noted)' } },
    { callout: '**So what:** Alkem is a distribution and brand company built on acute medicines, sold by 14,500+ representatives and a large trade-generics network. That is a solid, cash-generative core, but acute is the slow half of the Indian market. The strategic question for the next five years is whether the chronic push and the new bets (biosimilars, CDMO, MedTech) can add growth faster than they absorb capital and management attention.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a 1973 Mumbai start-up to ₹14,700 cr of revenue: a family company that diversified late',
  blocks: [
    { p: 'Brothers Samprada Singh and Basudeo Narain (B.N.) Singh, from Bihar, founded Alkem in Mumbai in 1973 as a distributor-turned-manufacturer. It built its name on antibiotics (Taxim was the first Indian anti-infective brand to cross ₹100 cr, in 2006) and on a wide rural and semi-urban reach. It went abroad in 2007-12 (first US filing 2007; Ascend Laboratories in the US and Pharmacor in Australia, 2010; a US API plant, 2012) and bought Enzene Biosciences (2011) as a biosimilars start-up. The Dec-2015 IPO at ₹1,050 was an offer for sale: the company raised nothing. Samprada Singh died in 2019; B.N. Singh, now in his mid-80s, is still Executive Chairman, and the next generations of both branches sit on the Board. The last three years brought the biggest strategic shift since the 2010s: a US biologics plant, a MedTech arm, the trade-generics carve-out and the Occlutech purchase.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.date, h.event, h.impact || '–']), source: `${C.historySrc}; GAM` } },
    { callout: '**Our read:** for 45 years Alkem was a focused, conservative, family-run acute franchise. Since FY24 it has diversified into three capital-hungry adjacencies at once (US CDMO, MedTech, Occlutech) while the founder generation hands over and the first professional CEO has left. None of the new pieces is big enough yet to change the numbers, but together they explain why EBITDA margins did not expand in Q1FY27 despite a record gross margin.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'The Indian drug market: ~₹2.15 lakh crore, growing 9-12%, but Alkem\'s four big therapies grew only 4-9% in FY26',
  blocks: [
    { p: `${D.industry.ipm} Growth comes from three parts that move differently: price (Alkem: ~6% in Q1FY27; scheduled drugs under the Drug Price Control Order can rise only with wholesale inflation), new products (~3%) and volume (~2%). The mix is shifting to chronic therapies (cardiac, diabetes, respiratory, nerves) as lifestyle diseases rise and diagnosis improves. Policy pushes the other way on old acute molecules: price caps, the 2024 Uniform Code for Pharmaceutical Marketing Practices (UCPMP: no gifts, travel or cash to doctors), and government generic stores (Jan Aushadhi) and trade generics that undercut branded prices.` },
    { exhibit: { type: 'table', title: 'The IPM by therapy (FY26): Alkem is strong where growth is slow', head: ['Therapy', 'Market (₹ cr)', 'Share of IPM', 'FY26 growth', 'Alkem rank (Jun-26 qtr)'], rows: TH.map(([t, s, sh, g]) => { const r = IR.find(x => t.toLowerCase().startsWith(x[0].toLowerCase().slice(0, 6))); return [t, n0(s), `${sh}%`, `${g}%`, r ? `#${r[1]} (${r[2]} share)` : '–']; }), source: `${D.industry.therapySrc}; ${D.industry.alkemRanksSrc}` } },
    { exhibit: { type: 'table', title: 'Industry themes and what they mean for Alkem', head: ['Theme', 'For Alkem', 'Evidence'], wide: [2], rows: D.industry.themes, source: D.industry.src } },
    { callout: '**So what:** the market Alkem serves grows high-single to low-double digits with little cyclicality, but the value is moving to chronic and specialty, where Alkem is a mid-ranked player. Its leadership is in anti-infectives and gastro, categories that grew 4-6% in FY26. Beating the market by 100-200bp in those lanes still means low-teens growth at best.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the market\'s growth reach Alkem? In branded India, yes (slightly ahead of the market); in trade generics and the US, no',
  blocks: [
    { p: `In FY26 Alkem grew 9.2% in India on IQVIA data against a market growing 9.0%: acute 8.5% (market 6.8%), chronic 12.6% (12.5%). In Q1FY27 it grew 13.2% vs 12.2% (acute 12.3% vs 10.1%; chronic 17.9% vs 15.4%) and beat the market in seven focus therapies (pain 1.8x, respiratory and derma 1.6x, VMN and anti-diabetic 1.4x, gastro 1.2x, anti-infectives 1.1x). Reported India sales grew only 10.3% because trade generics, which IQVIA does not track, were flat (Alkem cut credit days and raised prices after API inflation). Branded generics grew ~12%. The field force grew by ~1,450 people in FY26 (AR), mostly in chronic divisions, with attrition at 18-19%.` },
    { pair: [
      { type: 'column', title: 'India sales: back to double-digit growth in FY26-27', unit: 'India revenue (₹ crore), quarterly', x: QL, series: [{ name: 'India', values: SQ.map(q => q.india), fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company presentations; MOSL/Choice notes' },
      { type: 'hbar', title: 'Q1FY27 growth vs the market, by therapy (IQVIA)', unit: 'Secondary sales growth, Jun-26 quarter (%)', x: IR.map(r => r[0]).concat(['Alkem overall', 'IPM']), series: [{ name: 'Alkem', values: IR.map(r => parseFloat(r[3])).concat([Q1.iqvia.alkem, Q1.iqvia.ipm]), fmt: 'pct' }, { name: 'IPM (therapy)', values: IR.map(r => parseFloat(r[4])).concat([Q1.iqvia.ipm, Q1.iqvia.ipm]), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation (IQVIA SSA Jun-26)' },
    ] },
    { exhibit: { type: 'table', title: 'Tailwind scorecard', head: ['Tailwind', 'Reaches Alkem?', 'Evidence'], wide: [2], rows: [
      ['Market growth (IPM 9-12%)', '**Yes, slightly ahead**', 'Branded +12% in Q1FY27; IQVIA growth 100bp above the market; FY26 only 20bp above'],
      ['Chronic shift', '**Partly**', 'Chronic +17.9% vs market 15.4%, but chronic is only ~22-23% of branded sales (+1pp a year)'],
      ['Semaglutide / GLP-1', '**Not yet**', 'Day-one launch, top-3 among generics, ~11% unit share early on, but "very small" in rupees (MD)'],
      ['Trade generics / rural reach', '**No**', 'Flat in Q1FY27, ~4% in FY26; bigger rivals have entered the channel'],
      ['US generics', '**No**', 'No volume growth in new launches; Daman OAI; growth comes from the rupee'],
      ['Biologics CDMO / BIOSECURE', '**Not yet**', 'US plant open since Sep-2025, below $25-30mn breakeven; big clients slow to move'],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls; AR FY26' } },
    { callout: `**Verdict:** the sector tailwind reaches Alkem's branded India business, which grows a little faster than the market, but not its trade-generics and US businesses. We model India growth of ${BL.growth.india.join(' / ')}% for FY27-29E: above FY26's 9.7%, below management's ~12% for FY27, because trade generics have not recovered yet.` },
  ],
};

module.exports = { business, history, industry, tailwind };
