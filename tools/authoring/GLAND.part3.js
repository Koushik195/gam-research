// Gland report, part 3: base business and markets, Cenexi, CDMO and pipeline, capacity and USFDA.
const X = require('./GLAND.ctx');
const { C, A, F, AS, SA, SQ, n0, n1, pc, pc1, HB, LINES, LEB, BL, cenexiShare, Q1, FY26, capexPct26, assetTurn, ai } = X;
const CX = C.cenexi, PL = C.pipeline, FYH = ['FY24', 'FY25', 'FY26'];
const Hf = fy => HB.find(h => h.fy === fy);
const qB = SQ.map(q => Math.round(q.baseEbitda / q.baseRev * 1000) / 10);

const base = {
  id: 'base', nav: 'Base business & markets', kicker: 'Segment: base business', title: 'Base business: US launches and GPO wins took growth from −1% to +24% in a year, at 36-40% margins; rest of world and India lag',
  blocks: [
    { p: `The base business (Gland ex-Cenexi) is where the money is made. Revenue was ₹${n0(Hf('FY24').base)} cr in FY24, ₹${n0(Hf('FY25').base)} cr in FY25 and ₹${n0(Hf('FY26').base)} cr in FY26 (+11%), with EBITDA margins of 34%, 35% and 36.5%. In Q1FY27 it grew ~24% (19-20% in constant currency, CFO), led by the US (+32%): Dalbavancin (launched February 2026; the partner won a Vizient contract), the multivitamin infusion (April 2026; competitive generic therapy exclusivity, "a very difficult product to make") and Sugammadex (approved and launched 29-Jul-2026), plus volume gains in enoxaparin, vancomycin, chlorothiazide and heparin. Gland launched 31 products in the US in FY26 and four in Q1FY27.` },
    { pair: [
      { type: 'column', title: 'Base-business revenue: flat for two years, then up', unit: 'Base business revenue (₹ crore)', x: [...FYH, ...F.years], series: [{ name: 'Base business', values: [...FYH.map(y => Math.round(Hf(y).base)), ...LINES.base.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Investor presentations; GAM estimates FY27-29E' },
      { type: 'line', title: 'Base-business EBITDA margin: 29% to 40% in two years', unit: 'Base EBITDA margin (%)', x: SQ.map(q => q.q), series: [{ name: 'Base EBITDA margin', values: qB, fmt: 'pct' }], labels: 'all', min: 0, max: 50, source: 'Investor presentations (company EBITDA after ESOP); Q1FY27 GAM-derived' },
    ] },
    { h: 'Markets outside the US' },
    { p: `**Rest of world** (₹1,112 cr in FY26, 17%) is the weak spot: Saudi Arabia's NUPCO moved enoxaparin to a local partner in FY25, shipments stopped during the West Asia conflict in Q4FY26, and Q1FY27 revenue was flat (+2%) while tender awards were delayed. Management once said this business could double in 3-5 years (May-2025); it has not grown since. **Canada, Australia and New Zealand** fell 28% in Q1FY27 on lower volumes. **India** (₹267 cr in FY26, 4%) is small; the B2C branded business shrank 23% in FY26. **Europe** for the base business is mostly licensing and Gland products released through Cenexi (₹188 cr in FY26).` },
    { callout: `**Our view:** the base business is a high-quality generic-injectables franchise whose growth depends on a steady flow of launches to offset ~5% annual price erosion. FY27's +24% start owes much to three launches and the rupee; we model +${BL.growth.base[0]}% for FY27, +${BL.growth.base[1]}% and +${BL.growth.base[2]}% after, at a ${BL.ebitdaMargin.base[0]}-${BL.ebitdaMargin.base[2]}% margin (management guides 33-35%).` },
  ],
};

const cenexi = {
  id: 'cenexi', nav: 'Cenexi', kicker: 'Segment: Cenexi (Europe CDMO)', title: 'Cenexi: three years after the deal, a €200 mn business at breakeven; the turnaround is real but slower than every target set for it',
  blocks: [
    { p: `Gland agreed to buy Cenexi in November 2022 and completed on ${X.ACQ_TXT}, paying up to €120 mn for the equity (enterprise value €230 mn). The stated logic: a foothold in European contract manufacturing, technologies Gland lacked (hormones, controlled substances, vaccines, oral solids), Cenexi's customers, and a European release site for Gland's own products. The four sites (Fontenay and Osny near Paris, Hérouville in Normandy, Braine-l'Alleud in Belgium) carry high European labour costs. Cenexi lost money from the start: EBITDA of −€9 mn in its first eleven months (FY24) and −€19 mn in FY25, while management promised breakeven by December 2025 and a double-digit margin in FY27. In FY26 revenue rose 11% to €182 mn and EBITDA improved by €16 mn to −€3 mn (−1.8%), with three profitable quarters; Q1FY27 brought €48 mn of revenue and €2 mn of EBITDA (4%).` },
    { pair: [
      { type: 'column', title: 'Cenexi revenue: €164 mn to €182 mn, ~€200 mn guided', unit: 'Cenexi revenue (€ mn)', x: ['FY24*', 'FY25', 'FY26', 'FY27E'], series: [{ name: 'Revenue', values: [166, 164, 182, Math.round(LINES.cenexi[0] / 10.7)], fmt: 'num' }], labels: 'all', source: 'Investor presentations; *FY24 from 27-Apr-2023; FY27E GAM at ~₹107/€' },
      { type: 'column', title: 'Cenexi EBITDA margin: −12% to a small profit', unit: 'EBITDA margin (%)', x: [...CX.financials.map(f => f.fy), ...F.years], series: [{ name: 'EBITDA margin', values: [...CX.financials.map(f => f.marginPct), ...BL.ebitdaMargin.cenexi], fmt: 'pct' }], labels: 'all', source: 'Investor presentations; Q1FY27 call; GAM estimates FY27-29E' },
    ] },
    { exhibit: { type: 'table', title: 'Cenexi site by site (management, May-Aug 2026)', head: ['Site', 'What it does and where it stands'], wide: [1], rows: CX.sites, source: 'Q4FY26 call (utilisation), Q1FY27 call; AR FY26' } },
    { p: "**What is changing.** Contract renegotiations to pass on inflation, workforce cuts, two products launched at Hérouville in 2025 (an inactivated vaccine and a sterile ophthalmic gel), new ampoule capacity at Fontenay (one line ramping, a second high-capacity line from early 2027 adding ~30 mn ampoules), a vial/lyo block at Braine by end-2027, and new hormonal and orphan-drug syringe contracts. Gland also now uses Cenexi as the European arm of group deals: the 55-SKU agreement signed in August 2026 needed Cenexi for EU packaging and release (\"without Cenexi, this wouldn't have happened\")." },
    { callout: `**Our view:** Cenexi has stopped losing money, which removes a drag of ~₹176 cr of EBITDA (FY25) from the group. But on the capital invested (€230 mn of enterprise value, a ~€60 mn capex plan for 2025-27 and three years of losses) it still earns almost nothing; an investor on the May-2025 call called it poor capital allocation, and the CFO conceded it was "taking longer than what we estimated". We model ${BL.ebitdaMargin.cenexi[0]}% / ${BL.ebitdaMargin.cenexi[1]}% / ${BL.ebitdaMargin.cenexi[2]}% EBITDA margins and revenue +${BL.growth.cenexi[0]}% / +${BL.growth.cenexi[1]}% / +${BL.growth.cenexi[2]}% in rupees; the mid-teens margin management targets is our bull case.` },
  ],
};

const cdmo = {
  id: 'cdmo', nav: 'CDMO & pipeline', kicker: 'Growth drivers', title: 'CDMO and pipeline: contracts signed in 2026 are large, but their revenue mostly lands in FY29-31',
  blocks: [
    { p: `Contract manufacturing (CDMO, called tech transfer in the annual report) was ₹${n0(SA[2].model.techTransfer / 10)} cr in FY26 (46% of revenue, +29%), of which Cenexi ₹${n0(Hf('FY26').cenexi)} cr and Gland's own CDMO work ~₹1,071 cr (+33%). In Q1FY27 CDMO revenue grew 20% to ₹${n0(Q1.cdmo)} cr, half of the total. Management expects CDMO and B2B to stay ~50:50 for two years and CDMO to become the larger after CY2029. Gland is honest that this is mostly generic and specialty manufacturing: "we don't have any innovative products right now" (Srinivas Sadu, 10-Aug-2026); innovator work under discussion is on peptides.` },
    { exhibit: { type: 'table', title: 'Contracted and pipeline growth drivers (to 10-Aug-2026)', head: ['Driver', 'Status', 'Revenue timing (management)', 'In our forecasts?'], wide: [1, 2], rows: [
      ['55-SKU strategic CDMO agreement (global specialty pharma)', 'Signed 9-Aug-2026; tech transfer from Sep-2026 over 24 months; 60% US, 30-35% Europe', 'From CY2029; US$90-100 mn a year at peak (~12% of current revenue)', 'Almost nothing before FY30 (only Q4FY29)'],
      ['NDDS oncology CDMO (large pharma)', 'Filing FY28', 'Commercial FY29; US$25-30 mn a year', 'Partly in FY29E'],
      ['Base-business CDMO launches of FY26', 'Commercial', 'US$40-50 mn of extra revenue in FY27', 'Yes, in FY27E'],
      ['GLP-1 fill-finish (9 contracts: liraglutide, semaglutide, tirzepatide)', '140 mn cartridge capacity; exhibit batches; partner launches in Canada/US (liraglutide)', '"Very limited" until US volumes in FY30-31; excluded from guidance', 'No, beyond small tech-transfer fees'],
      ['Complex in-house (6 launched, 3 pending) and 15 co-developed products', 'Filed / in development', 'Co-developed launches from FY28; large microsphere products after FY29', 'Partly from FY28E'],
      ['Ready-to-use bags (21 filed, 18 approved, 11 in development)', 'New bag line awaiting USFDA approval', 'US market ~US$644 mn', 'Yes, modestly'],
      ['Liposomal in-licence (China-based developer)', 'Signed Aug-2026; US/EU rights; patent-protected', 'From FY30', 'No'],
      ['Neuland sterile-API collaboration (depot products)', 'New suite being built', 'Not disclosed', 'No'],
    ], source: 'Q4FY26 and Q1FY27 presentations and calls; AR FY26' } },
    { pair: [
      { type: 'column', title: 'US ANDA filings: 389 filed, 342 approved', unit: 'Cumulative US ANDAs (Jun-2026)', x: ['Filed', 'Approved', 'Pending'], series: [{ name: 'ANDAs', values: [389, 342, 47], fmt: 'num' }], labels: 'all', source: 'Q1FY27 investor presentation (incl. technology-transfer ANDAs)' },
      { type: 'column', title: 'R&D spend: ~4-5% of revenue', unit: 'R&D (₹ crore)', x: ['FY25', 'FY26', 'Q1FY27 x4'], series: [{ name: 'R&D', values: [192, 223, Math.round(Q1.rnd * 4)], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation (base business R&D ₹1,922 mn FY25, ₹2,230 mn FY26); Q1FY27 presentation' },
    ] },
    { callout: "**Our view:** the 2026 contract wins are the best evidence yet that big pharma will move sterile production to Gland, and they validate the Cenexi purchase as a door-opener. But the timing is long: the big contract, GLP-1 and the large complex products all fall in FY29-31, beyond the earnings the market will look at in twelve months. Management's ~20% four-year growth ambition needs most of them to arrive on time; we model ~14-16% and treat the rest as upside." },
  ],
};

const capY = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
const capacity = {
  id: 'capacity', nav: 'Capacity & USFDA', kicker: 'Capacity and compliance', title: 'Capacity and compliance: plants near full, a ~₹2,000 cr expansion, and a clean USFDA record',
  blocks: [
    { p: `Gland's Indian plants run at ~80-90% utilisation, with bag and ophthalmic lines the tightest; Fontenay is ~100% and Osny ~90%, while Hérouville and Braine have room (50-60%). Capex was ₹398 cr (FY24), ₹394 cr (FY25) and ₹494 cr (FY26, ${n1(capexPct26)}% of sales), low for a manufacturer because Gland built ahead in FY20-22. In May 2026 it announced a ~₹2,000 cr programme over 3-5 years (vial, BFS, ophthalmic and liposome lines at Pashamylaram Suite 10, a ₹165 cr oncology isolator line for the new CDMO contract, a sterile-API block, and Cenexi lines). FY27 capex is guided at ~₹550 cr. Revenue per rupee of gross block fell from ${n1(assetTurn('FY22'))}x (FY22) to ${n1(assetTurn('FY26'))}x (FY26), mostly because Cenexi's land, buildings and plants came onto the books in FY24.` },
    { exhibit: { type: 'table', title: 'Manufacturing footprint', head: ['Site', 'What it makes'], wide: [1], rows: C.capacity, source: 'AR FY26 (manufactured capital); Q1FY27 call' } },
    { exhibit: { type: 'table', title: 'USFDA inspection record (from 2023)', head: ['When', 'Site', 'Outcome'], wide: [2], rows: C.usfda.map(u => [u.date, u.site, u.outcome]), source: 'Company BSE filings via Medical Dialogues, Business Standard and Reuters; no warning letter or import alert on any Gland site' } },
    { pair: [
      { type: 'column', title: 'Capex vs depreciation: catching up after three light years', unit: '₹ crore', x: [...capY, ...F.years], series: [{ name: 'Capex', values: [...capY.map(y => A.capex[ai(y)]), ...F.capex], fmt: 'num' }, { name: 'Depreciation', values: [...capY.map(y => A.dep[ai(y)]), ...F.dep.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Screener.in; GAM estimates FY27-29E' },
      { type: 'line', title: 'Asset turn: diluted by Cenexi, now recovering', unit: 'Revenue ÷ gross block (x)', x: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Asset turn', values: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(y => Math.round(assetTurn(y) * 100) / 100), fmt: 'n2' }], labels: 'all', min: 0, max: 3, source: 'Screener.in (gross block)' },
    ] },
    { callout: `**Our view:** compliance is Gland's strongest asset: the September-2026 Visakhapatnam inspection ended with zero observations, and earlier Form 483s were procedural and closed. Capacity is the near-term constraint on growth, so the timing of the bag line approval and the new lines matters more than demand. We model capex of ₹${n0(F.capex[0])} / ${n0(F.capex[1])} / ${n0(F.capex[2])} cr.` },
  ],
};

module.exports = { base, cenexi, cdmo, capacity };
