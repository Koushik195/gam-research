// Max Healthcare report, part 2: business, history, industry, tailwind test.
const fs = require('fs');
const path = require('path');
const X = require('./MAXHEALTH.ctx');
const { C, D, A, ROOT, n0, n1, rup, SRC, Q1, NP, AK, b } = X;
const RG = C.regionsQ1FY27, MEM = C.memorandumFY26;

// Peer growth from each company's Screener file: Jun-2026 quarter YoY and FY23-26 revenue CAGR.
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const q1g = sym => { const q = scr(sym).quarters, r = q.rows.Sales || q.rows.Revenue, i = q.periods.indexOf('Jun 2026'), j = q.periods.indexOf('Jun 2025'); return i >= 0 && j >= 0 ? Math.round((r[i] / r[j] - 1) * 1000) / 10 : null; };
const cagr3 = sym => { const t = scr(sym)['profit-loss'], r = t.rows.Sales || t.rows.Revenue, i = t.periods.indexOf('Mar 2026'), j = t.periods.indexOf('Mar 2023'); return Math.round((Math.pow(r[i] / r[j], 1 / 3) - 1) * 1000) / 10; };
const IND = ['MAXHEALTH', 'APOLLOHOSP', 'FORTIS', 'NH', 'MEDANTA', 'KIMS', 'RAINBOW', 'JLHL'];

const business = {
  id: 'business', nav: 'What Max does', kicker: 'The business', title: 'Big-city tertiary and quaternary hospitals: transplants, cancer, cardiac and neuro care, mostly in Delhi NCR',
  blocks: [
    { p: `Max runs large multi-specialty hospitals that treat complex cases: ~4,700 liver and ~6,000 kidney transplants and ~2,300 bone-marrow transplants to date, a cancer franchise that was a quarter of inpatient revenue until 2025, robotic surgery (18 robots) and cardiac, neuro and orthopaedic programmes. Of its 5,379 operational beds at Jun-2026, ${n0(RG[0].opBeds)} are in Delhi NCR (Saket, BLK-Max, Patparganj, Shalimar Bagh, Dwarka, Vaishali, Noida, Panchsheel), 590 in Maharashtra (Nanavati-Max in Mumbai, Nagpur), 488 in Punjab (Mohali, Bathinda), plus Lucknow, Dehradun, Gurugram and, since May-2026, Bhubaneswar. Revenue per occupied bed-day (ARPOB) is the highest of any listed chain (₹${n1(Q1.arpob / 1000)}k in Q1FY27) because most beds are in rich metros with high insurance cover and many international patients (~9% of hospital revenue, ₹${n0(AK[3].intlRevenue)} cr in FY26).` },
    { p: `**How it is organised matters.** Max owns most hospitals through MHIL and subsidiaries, runs others under long contracts as "managed facilities" (consolidated as silos), and operates three hospitals owned by charitable societies under medical-service agreements running to 2064-2105: Max Saket East (Devki Devi Society), Max Smart (Gujarmal Modi Society) and Max Patparganj (Balaji Society). These "Partner Healthcare Facilities" (PHFs) are not consolidated, but Max reports a "Network" P&L that includes them, and most KPIs and broker estimates are on that basis. In FY26 the PHFs added ₹${n0(MEM.netRevenue.balaji + MEM.netRevenue.gmModi + MEM.netRevenue.devkiDevi)} cr of revenue (₹${n0(-MEM.netRevenue.elim)} cr of which was paid to MHIL as fees and supplies) and ₹${n0(MEM.opEbitda.balaji + MEM.opEbitda.gmModi + MEM.opEbitda.devkiDevi)} cr of EBITDA. Two small businesses complete the group: Max Lab (pathology for outside patients, ₹201 cr) and Max@Home (home care, ₹263 cr gross).` },
    { exhibit: { type: 'table', title: 'The network by region (Q1FY27)', head: ['Region', 'Operational beds (Jun-26)', 'Occupancy', 'Gross revenue Q1FY27 (₹ cr)', 'Growth YoY'], rows: [
      ...RG.map(r => [r.region, n0(r.opBeds), `${r.occupancyPct}%`, n0(r.grossRevQ1FY27), `${Math.round((r.grossRevQ1FY27 / r.grossRevQ1FY26 - 1) * 100)}%`]),
      { hl: true, cells: ['**Total hospitals**', `**${n0(RG.reduce((s, r) => s + r.opBeds, 0))}**`, '**75%**', `**${n0(RG.reduce((s, r) => s + r.grossRevQ1FY27, 0))}**`, `**${Math.round((RG.reduce((s, r) => s + r.grossRevQ1FY27, 0) / RG.reduce((s, r) => s + r.grossRevQ1FY26, 0) - 1) * 100)}%**`] },
    ], source: 'Investor presentation, 17-Aug-2026 (p.24); revenue excludes Max Lab, Max@Home and other SBUs' } },
    { pair: [
      { type: 'hbar', title: 'Delhi NCR is ~half the beds and over half the revenue', unit: 'Operational beds, Jun-2026', x: RG.map(r => r.region.split(' (')[0]), series: [{ name: 'Beds', values: RG.map(r => r.opBeds), fmt: 'num' }], labels: 'all', highlight: 'Delhi NCR', source: 'Investor presentation, 17-Aug-2026' },
      { type: 'hbar', title: 'Specialty mix: oncology still the largest, now 22%', unit: 'Share of gross inpatient revenue, Q1FY27 (%)', x: ['Oncology (26% a year earlier)', 'Orthopaedics', 'Cardiac sciences', 'Renal (incl. dialysis)', 'Neurosciences', 'Gastroenterology', 'Internal medicine', 'OBGY & paediatrics', 'MAS & general surgery', 'Liver & biliary', 'Pulmonology', 'Others'], series: [{ name: 'Share', values: [22.2, 12.8, 10.1, 9.9, 9.8, 6.0, 5.8, 5.3, 5.0, 3.9, 3.9, 5.2], fmt: 'pct' }], labels: 'all', highlight: 'Oncology (26% a year earlier)', source: 'Q1FY27 earnings presentation (gross IP revenue ₹2,346 cr; excl. OP and day care)' },
    ] },
    { callout: '**Why the structure matters for investors:** the Network numbers the company headlines are ~18% bigger at the EBITDA level than what MHIL shareholders consolidate, and brokers\' EPS is Network profit divided by MHIL\'s shares. We model MHIL\'s consolidated accounts (what the shares legally own) and translate to the Network basis when comparing with the street.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From Max India\'s hospital arm to a KKR-backed merger and a buy-and-build machine',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: rup(C.historySrc) } },
    { callout: '**Corporate actions and per-share data:** no bonus, split or buyback since listing in Aug-2020; ~97.3 cr shares (a few ESOP allotments a year, ~0.1%). Screener\'s FY26 profit ÷ EPS gives 97.30 cr shares, matching the 97.33 cr outstanding; we only put profit on the attributable basis (Screener\'s "Profit for EPS"), which changes FY19 (₹0 → −₹3 cr) and Q1FY27 (₹323 → ₹322 cr). Minority interests appeared only in Q1FY27 (41.72% of Kalinga; YPPL\'s Class B holders) and are small. The 2020 merger was accounted for as a reverse acquisition at fair value: ~₹3,700 cr of asset uplift plus later acquisition goodwill means reported ROE (~14%) understates returns on cash invested.' },
  ],
};

const IN = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Too few good beds in rich cities, more insurance, and a building boom that raises the bar',
  blocks: [
    { p: `${rup(IN.beds)} ${rup(IN.metros)} The economics favour big-city hospitals with complex specialties: insurance and self-pay patients pay hospital tariffs, while government schemes (CGHS, ECHS, PSUs, state schemes) pay fixed package rates that Max says do not cover full costs. The risks are rising supply (every large chain is adding beds in NCR) and regulation of prices, especially drugs and consumables.` },
    { exhibit: { type: 'table', title: 'Forces acting on Max\'s market (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Max'], wide: [2], rows: IN.themes.map(r => r.map(rup)), source: IN.src } },
    { pair: [
      { type: 'hbar', title: 'Q1FY27 revenue growth: Max in the middle of the pack', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: IND.map(X.shortName), series: [{ name: 'Growth', values: IND.map(q1g), fmt: 'pct' }], labels: 'all', highlight: 'Max Healthcare', source: 'Screener.in quarterly results (acquisitions included)' },
      { type: 'hbar', title: 'Over three years Max grew fastest among the large chains', unit: 'Revenue growth, FY23-26, a year (%)', x: IND.map(X.shortName), series: [{ name: 'CAGR', values: IND.map(cagr3), fmt: 'pct' }], labels: 'all', highlight: 'Max Healthcare', source: 'Screener.in (consolidated; includes acquisitions)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Max captures insurance and metro demand; government payers are a headwind',
  blocks: [
    { verdicts: [
      ['Shortage of quality beds in metros', 'Yes', 'Occupancy ~75% for four years despite +13% beds in a year; Delhi NCR 79%; Smart\'s new beds ~80% full within weeks.', 'Brownfield beds fill fast; supports the build-out.'],
      ['Rising health insurance', 'Yes', 'Insurance & corporates 37.8% of revenue in Q1FY27 (35.8% a year earlier); ~6% price revision with insurers from Sep-Oct 2026.', 'Better pricing per patient.'],
      ['Medical value travel', 'Yes', 'International revenue ₹897 cr in FY26 (+20%), ₹247 cr in Q1FY27 (+18%), ~9% of hospital revenue.', 'High-ARPOB growth; Bangladesh/Africa flows can be volatile.'],
      ['Government schemes (CGHS, ECHS, PSU)', 'Headwind', 'High-value chemo drugs stopped for institutional patients after the Oct-2025 CGHS MoU: oncology from 26% to 22% of IP revenue; DSO 95 days on slow CGHS payments.', 'Max has the largest CGHS exposure (Delhi); a cost of being in Delhi.'],
      ['Drug and consumable pricing', 'Risk', 'Supreme Court remarks on hospital drug markups (30-Sep-2026); CGHS margin caps.', 'Pharmacy margin is part of ARPOB; any cap hits Max and Apollo most.'],
      ['Medical education opening to for-profits', 'Option', 'NMC draft rules; board approval in principle; ~₹300 cr per 150-seat college, 25-30% ROCE claimed.', 'Not in our numbers; capital-hungry.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

module.exports = { business, history, industry, tailwind };
