// Torrent Pharma report, part 2: business, history & the JB deal, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./TORNTPHARM.ctx');
const { C, D, A, ROOT, n0, n1, rup, SRC, SA, Q1, FY26, DEAL, BL, LINES, LBL, shortName } = X;
const IN = C.india, INT = C.international;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY23-26 revenue CAGR
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales || q.rows.Revenue, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const cagr3 = sym => { const t = scr(sym)['profit-loss'], r = t.rows.Sales || t.rows.Revenue, i = t.periods.indexOf('Mar 2026'), j = t.periods.indexOf('Mar 2023'); return Math.round((Math.pow(r[i] / r[j], 1 / 3) - 1) * 1000) / 10; };
const IND = ['TORNTPHARM', 'SUNPHARMA', 'CIPLA', 'ZYDUSLIFE', 'ALKEM', 'MANKIND', 'IPCALAB', 'ABBOTINDIA'];

const business = {
  id: 'business', nav: 'What Torrent does', kicker: 'The business', title: 'A branded-generics company: India and Brazil brands carry the profits, US and German generics add scale',
  blocks: [
    { p: `Torrent sells prescription medicines under its own brand names to doctors (branded generics) and plain generic copies to insurers, pharmacies and wholesalers. **India** is the core: ₹${n0(FY26.geography.India)} cr in FY26, 55% of revenue, 75% of it in chronic and sub-chronic therapies (cardiac 31%, gastro 21%, CNS 12%), sold through ~7,000 medical representatives (9,300 with JB). Curatio, bought in 2022, adds cosmetic dermatology and consumer brands growing ~30% a year. **Brazil** (₹${n0(FY26.geography.Brazil)} cr, BRL 817 mn) is a second branded market where Torrent is the largest Indian company. **The US** (₹${n0(FY26.geography.USA)} cr, US$151 mn) and **Germany** (₹${n0(FY26.geography.Germany)} cr, EUR 121 mn) are generics businesses: price takers in tenders and wholesaler contracts. **Rest of world** (₹${n0(FY26.geography.Others)} cr) includes the Philippines, Russia, Mexico, Sri Lanka and, from 21-Jan-2026, JB's export and contract-manufacturing (CDMO) business.` },
    { p: `**J.B. Chemicals (JB)**, now merged, adds ₹4,148 cr of FY26 revenue (JB's own books; EBITDA ₹1,107 cr, 26.7%): about 61% India (Cilacar and Nicardia in hypertension, Metrogyl, Rantac, Sporlac; an in-licensed Novartis ophthalmology range; Azmarda in heart failure) and 39% international and CDMO (lozenges for multinational customers; Russia, South Africa, the US). JB's IQVIA sales were ₹2,749 cr in FY25, of which cardiac ₹1,214 cr. Together the two are #5 in the Indian market, #4 in chronic therapies and #1 in cardiac.` },
    { exhibit: { type: 'table', title: 'The merged company: FY26 pro forma revenue by line', head: ['Line', '₹ crore', 'Share', 'What drives it'], wide: [3], rows: [
      ...LINES.map(l => [LBL[l], n0(BL.base[l]), `${Math.round(BL.base[l] / A.sales[X.b] * 100)}%`, { indiaBase: 'Chronic brands, field-force expansion, Curatio, first-to-market launches (semaglutide)', jbIndia: 'Cardiac and gastro brands moving into Torrent divisions; cross-selling from FY28', brazil: 'Branded generics; 58 products awaiting ANVISA approval', us: '124 approved ANDAs; ~5% annual price erosion', germany: 'Insurer tenders; supplier failure hurt FY26-27', rowBase: 'Philippines, Russia, Mexico etc.; includes PLI and export incentives', jbIntl: 'Lozenge CDMO (+27% in Q1FY27), Russia, South Africa' }[l]]),
      { hl: true, cells: ['**Total (pro forma FY26)**', `**${n0(A.sales[X.b])}**`, '**100%**', 'Reported FY26 ₹13,980 cr (JB for 70 days)'] },
    ], source: 'AR FY26 MD&A; JB FY26 results (Screener); GAM split of JB (Q1FY27 mix)' } },
    { pair: [
      { type: 'stacked', title: 'India keeps getting bigger: 50% of revenue in FY22, 55% in FY26', unit: 'Revenue by geography (₹ crore), reported', x: SA.map(a => a.fy), series: [{ name: 'India', values: SA.map(a => a.india), fmt: 'num' }, { name: 'Brazil', values: SA.map(a => a.brazil), fmt: 'num' }, { name: 'US', values: SA.map(a => a.us), fmt: 'num' }, { name: 'Germany', values: SA.map(a => a.germany), fmt: 'num' }, { name: 'Others', values: SA.map(a => a.others), fmt: 'num' }], labels: 'none', source: 'Annual reports FY23-FY26 (MD&A)' },
      { type: 'hbar', title: 'India therapy mix: cardiac and gastro are half the business', unit: 'Share of Torrent India sales, FY26 (%)', x: Object.keys(IN.therapyMixPct), series: [{ name: 'Share', values: Object.values(IN.therapyMixPct), fmt: 'pct' }], labels: 'all', highlight: 'Cardiac', source: 'AR FY26 p.150 (AIOCD Pharmatrac, Mar-2026)' },
    ] },
  ],
};

const history = {
  id: 'history', nav: 'History & the JB deal', kicker: 'History', title: 'From a family company in Ahmedabad to India\'s #5: four brand acquisitions, the last one the biggest',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: rup(C.historySrc) } },
    { exhibit: { type: 'table', title: 'The JB transaction, step by step (as known on 30-Sep-2026)', head: ['Date', 'Step', 'Detail'], wide: [2], rows: [
      ['29-Jun-2025', 'Agreements signed', `46.39% from KKR (Tau Investment Holdings) at ₹1,600 (₹11,917 cr); up to 2.80% from employees at ₹1,600; mandatory open offer for 26% at ₹1,639.18; merger at 51 Torrent shares for 100 JB shares`],
      ['5-Dec-2025', 'Open offer', `Only ${n0(DEAL.openOffer.sharesAccepted)} shares tendered: JB traded above the offer price because the swap was worth more`],
      ['Jan-2026', 'Financing', '₹12,500 cr raised: ₹1,500 cr one-year CP, NCDs ₹2,000 / 2,500 / 3,000 / 3,500 cr for 2-5 years at 7.45-7.80%'],
      ['21-Jan-2026', 'Control', 'KKR stake bought; JB consolidated from this date (48.80% after the employee purchases of 23-Jan and 3-Feb), 51.20% minority interest'],
      ['23-Mar-2026 to May-2026', 'Shareholder approvals', 'NCLT Ahmedabad convened the meetings; both companies\' shareholders approved the scheme (incl. a majority of JB\'s minority)'],
      ['8-Jul-2026', 'Merger effective', 'NCLT sanction; appointed date 21-Jan-2026: Q1FY27 results show no minority interest'],
      ['20-Jul-2026', 'Shares allotted', `${n0(DEAL.allotment.newShares)} new shares (record date 17-Jul; trading from 28-Jul): ${(DEAL.allotment.sharesAfter / 1e7).toFixed(2)} cr shares in all; promoters 60.78%`],
    ], source: rup(DEAL.src) } },
    { callout: `**Why this matters for the model.** On 30-Sep-2026 the price of ₹4,800 is the price of the merged company, so we use the post-merger share count (38.04 cr, +12.4%), no minority interest from FY27, and a pro forma FY26 base with JB for the full year. Goodwill of ₹3,648 cr is not amortised; the ₹20,691 cr of acquired brands, customer relationships and licences are, at ~₹1,340 cr a year for ~15 years (non-cash and not tax-deductible; a deferred-tax credit of ~₹337 cr a year offsets part of it in the P&L). Reported EPS carries that charge; we show EPS both with and without it.` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'India is a branded, doctor-driven market growing ~10%; Torrent has grown faster for three years',
  blocks: [
    { p: `${rup(D.industry.ipm)} In India doctors choose the brand, so companies compete through field forces, brand recall and steady supply rather than price. Scale matters: bigger companies can afford more reps per doctor and can relaunch acquired brands through them, which is why the market keeps consolidating. Outside India the picture is different: US and German generics are commodity markets with steady price erosion, where only cost, supply reliability and new launches matter.` },
    { exhibit: { type: 'table', title: 'Forces acting on Torrent\'s markets (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Torrent'], wide: [2], rows: D.industry.themes.map(r => r.map(rup)), source: D.industry.src } },
    { pair: [
      { type: 'hbar', title: 'Jun-2026 quarter growth: Torrent +55% with JB', unit: 'Consolidated revenue growth, Jun-2026 quarter, YoY (%)', x: IND.map(shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'Torrent Pharma', source: 'Screener.in quarterly results (acquisitions included)' },
      { type: 'hbar', title: 'FY23-26: Torrent in the middle of the pack, India-focused peers ahead', unit: 'Revenue growth, FY23-26, a year (%)', x: IND.map(shortName), series: [{ name: 'CAGR', values: IND.map(cagr3), fmt: 'pct' }], labels: 'all', highlight: 'Torrent Pharma', source: 'Screener.in (consolidated; Abbott standalone)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Torrent captures the India tailwinds; the export markets offer none',
  blocks: [
    { verdicts: [
      ['Chronic-therapy growth in India', 'Yes', `75% of India sales are chronic/sub-chronic vs 56% for the market; India base +${Q1.indiaBaseYoYPct}% in Q1FY27 vs IPM +${Q1.ipmGrowthPct}%.`, 'The core engine; JB adds more cardiac.'],
      ['Volume pick-up in the IPM (2026)', 'Yes', `Q1FY27 split: volume ${Q1.indiaGrowthSplit.volume}%, price ${Q1.indiaGrowthSplit.price}%, new products ${Q1.indiaGrowthSplit.newProducts}% (market ${Q1.indiaGrowthSplit.ipmVolume}% / ${Q1.indiaGrowthSplit.ipmPrice}% / ${Q1.indiaGrowthSplit.ipmNew}%).`, 'Management cannot yet say if it lasts ("one quarter").'],
      ['Patent expiries (GLP-1s)', 'Partly', 'Semaglutide ₹50 cr in Q1FY27, 36% share, but an injectable supply failure in Jul-Aug and price cuts; Brazil approval still pending.', 'Adds 2-3 points of India growth, not a step change.'],
      ['Consolidation', 'Yes', 'JB makes Torrent #5 and #1 in cardiac; past deals grew faster after integration.', 'Torrent is a consolidator, not a target.'],
      ['Brazil market growth (~11%)', 'Yes', 'Q1FY27 +19% vs market +4% (IQVIA); FY26 +12% in BRL.', 'Durable but currency-exposed.'],
      ['US and German generics', 'No', 'US flat in dollars over a decade; Germany -3% in EUR in FY26 and -9% in Q1FY27.', 'A drag on group growth and margin.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, tailwind };
