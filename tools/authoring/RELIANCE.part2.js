// Reliance report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./RELIANCE.ctx');
const { C, D, SA, A26, n0, n1, pc, rup, seg, F } = X;
const st = C.profile.stakes;

const business = {
  id: 'business', nav: 'What it does', kicker: 'The company', title: 'Four businesses, three of them with outside shareholders',
  blocks: [
    { p: `Reliance Industries (RIL) earned ₹2,07,911 cr of EBITDA in FY26 on ₹11.76 lakh cr of gross revenue. **O2C** (oil-to-chemicals: the Jamnagar refineries, petrochemicals, fuel exports and domestic fuel sales; retail fuel stations sit in Jio-bp, a joint venture with BP) made ₹60,546 cr. **Oil and gas** (the KG-D6 deep-water gas fields and coal-bed methane) ₹19,050 cr. **Digital Services** (Jio Platforms: mobile, home broadband, enterprise and digital apps) ₹76,560 cr. **Retail** (Reliance Retail Ventures: grocery, electronics, fashion, JioMart) ₹27,034 cr. **Others** (JioStar, consumer brands, treasury income, unallocated items) the rest. **New Energy** (solar modules, batteries, green hydrogen and ammonia at Jamnagar and Kutch) has no revenue yet.` },
    { exhibit: { type: 'table', title: 'Segments in FY26 (₹ crore)', head: ['Segment', 'Gross revenue', 'EBITDA', 'Margin', 'Share of EBITDA', 'RIL owns'], rows: [
      ['O2C', n0(A26.o2cRev), n0(A26.o2cEbitda), n1(A26.o2cEbitda / A26.o2cRev * 100) + '%', Math.round(A26.o2cEbitda / A26.coEbitda * 100) + '%', '100%'],
      ['Oil and gas', n0(A26.epRev), n0(A26.epEbitda), n1(A26.epEbitda / A26.epRev * 100) + '%', Math.round(A26.epEbitda / A26.coEbitda * 100) + '%', '100% of the segment'],
      ['Digital Services (Jio)', n0(A26.jioRev), n0(A26.jioEbitda), n1(A26.jioEbitda / A26.jioRev * 100) + '%', Math.round(A26.jioEbitda / A26.coEbitda * 100) + '%', `${st[0].ril}%`],
      ['Retail', n0(A26.retRev), n0(A26.retEbitda), n1(A26.retEbitda / A26.retRev * 100) + '%', Math.round(A26.retEbitda / A26.coEbitda * 100) + '%', `${st[1].ril}%`],
      ['Others (incl. treasury, ₹8,924 cr gain)', n0(A26.othRev), n0(A26.othEbitda), '–', Math.round(A26.othEbitda / A26.coEbitda * 100) + '%', `JioStar ~${st[3].ril}% economic; RCPL ${st[2].ril}%`],
      { hl: true, cells: ['**Group**', '**11,75,919**', `**${n0(A26.coEbitda)}**`, '', '100%', ''] },
    ], source: 'AR FY26 segment note (value of sales and services, before inter-segment eliminations of ₹1,38,114 cr); Q4FY26 presentation (EBITDA); Jio DRHP (stake)' } },
    { exhibit: { type: 'table', title: 'Who else owns the subsidiaries', head: ['Company', 'RIL', 'Other shareholders'], wide: [2], rows: st.map(s => [s.entity, s.ril + '%', rup(s.others)]), source: 'Jio Platforms DRHP (as reported, Jun-2026); RIL filings on the RCPL demerger (Dec-2025); RIL/Disney merger release (Nov-2024)' } },
    { callout: '**So what:** a rupee of Jio EBITDA is worth only 66 paise to RIL shareholders, a rupee of Retail EBITDA 84 paise. The minority share of profit (₹14,979 cr in FY26, 16% of PAT) is why the group\'s EPS grows more slowly than its EBITDA, and why we value each business separately and deduct what belongs to others.' },
  ],
};

const history = {
  id: 'history', nav: 'History', kicker: 'History & corporate actions', title: 'From refiner to conglomerate: each pivot was funded by selling minority stakes',
  blocks: [
    { exhibit: { type: 'table', title: 'Milestones and what they did to the numbers', head: ['When', 'Event'], wide: [1], rows: C.history.map(([a, b]) => [a, rup(b)]), source: 'Company filings and releases; press (dates as shown)' } },
    { p: 'Three corporate actions matter for reading the numbers. **The 1:1 bonus (Oct-2024)** doubled the share count to 1,353.2 cr; Screener and we show all history on the new count. **The Asian Paints sale (Q1FY26)** put a ₹8,924 cr gain into FY26 EBITDA and other income (₹7,371 cr after tax); FY26 EPS of ₹59.69 is ~₹54 without it. **The consumer-brands demerger (1-Dec-2025)** moved Campa, Independence and the other brands from Retail to a new RIL subsidiary (RCPL, same 83.56% ownership), so Retail\'s reported growth from Q4FY26 understates the like-for-like (Q1FY27: +7.4% reported, +11.6% adjusted).' },
    { callout: '**The Jio IPO (pending at 30-Sep-2026):** a fresh issue of up to 27 crore shares, no offer for sale, up to ₹27,500 cr to repay Jio\'s debt. RIL\'s 66.43% would fall by ~2 points (27 cr shares are ~2.9% of the enlarged equity, per Bloomberg/TNW); RIL shareholders get a reserved quota, not cash. SEBI issued its observations on 28-Aug-2026; the price band was not announced by our as-of date.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A war-time oil market, a three-player telecom market, and retail moving online',
  blocks: [
    { h: 'Oil and refining: the Hormuz shock' },
    { p: rup(D.industry.refining) },
    { p: rup(D.industry.policy) },
    { h: 'Telecom' }, { p: rup(D.industry.telecom) },
    { h: 'Retail' }, { p: rup(D.industry.retail) },
    { callout: '**So what:** RIL\'s FY27 profits are being made in an abnormal oil market. The cracks that drove Q1 depend on how long Middle East supply stays disrupted, and the government is taking a share through export duties that it reviews every fortnight. We treat FY27 O2C earnings as above-normal and fade them in FY28.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the tailwind reach RIL? Partly in O2C, fully in Jio, not yet in Retail',
  blocks: [
    { exhibit: { type: 'table', title: 'Sector tailwind vs what reaches RIL', head: ['Tailwind', 'Reaches RIL?', 'Evidence'], wide: [2], rows: [
      ['Diesel/jet cracks at 4x last year', 'Partly', 'Q1FY27 O2C EBITDA +17% on +30% revenue: margin fell to 8.4% from 9.4% as export duties, under-recoveries, crude premiums (~$20/bbl) and freight (~10x) took the rest'],
      ['Ethane vs naphtha cracking', 'Yes', 'US ethane −11% YoY while naphtha +61%: RIL\'s ethane crackers gain; 3 more ethane carriers coming'],
      ['India data growth and 5G', 'Yes', 'Data traffic +27%, 285 mn 5G users, ARPU +₹7 without a tariff increase; Jio EBITDA +15%'],
      ['Tariff repair', 'Not yet', 'No tariff increase in the last 12 months; street assumes ~15% in FY27-28'],
      ['Consumption growth (GST cuts, monsoon)', 'Slowly', 'Retail like-for-like +11.6% but EBITDA −1%: the gain goes into building quick commerce'],
      ['Energy transition', 'Not yet', 'Giga-factories pre-revenue; ~1 GWp of modules produced; batteries 40 GWh due this year'],
    ], source: 'Q1FY27 presentation and call (17-Jul-2026)' } },
    { callout: `**Verdict:** the oil shock reaches RIL, but net of a heavy toll; Jio converts India's data growth into profit at ~53% margins; Retail has not yet turned growth into earnings. Our FY27E EBITDA of ₹${n0(X.coEbitda[0])} cr (company basis) is +6% on FY26 (+11% ex the Asian Paints gain).` },
  ],
};

module.exports = { business, history, industry, tailwind };
