// Pidilite report, part 2: business, history, industry, tailwind test, Consumer & Bazaar, B2B.
const fs = require('fs');
const path = require('path');
const X = require('./PIDILITIND.ctx');
const { C, D, F, A, ROOT, n0, n1, pc, rup, SRC, SA, SQ, QL, A26, A25, A21, segM, Q1, b } = X;
const MX = C.revenueMixFy26Standalone, RS = C.revenueSplitFy26;

// Three-year revenue CAGR (FY23-26) for the industry chart, from each company's Screener file.
const cagr3 = sym => { const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables['profit-loss']; const r = S.rows.Sales, i = S.periods.indexOf('Mar 2026'), j = S.periods.indexOf('Mar 2023'); return Math.round((Math.pow(r[i] / r[j], 1 / 3) - 1) * 1000) / 10; };
const IND = ['PIDILITIND', 'ASTRAL', 'BERGEPAINT', 'KANSAINER', 'HINDUNILVR', 'ASIANPAINT'];
const q1g = D.peers.q1fy27SalesGrowthPct;

const business = {
  id: 'business', nav: 'What Pidilite does', kicker: 'The business', title: 'Glue, waterproofing and tile fixing: a brand house sold through India\'s tradesmen',
  blocks: [
    { p: `Pidilite makes the products India's carpenters, plumbers, masons, painters and households use to stick, seal and waterproof. Its **Consumer & Bazaar (C&B)** segment (${MX.cbPct}% of FY26 standalone sales) sells branded adhesives and sealants (Fevicol, Fevikwik, Fevistik, M-Seal, Araldite), construction and paint chemicals (Dr. Fixit waterproofing, Roff tile adhesives and grouts) and art and craft materials (Fevicryl). "Bazaar" means sales through dealers to tradesmen rather than to households. Its **Business to Business (B2B)** segment (${MX.b2bPct}%) sells industrial adhesives, resins, construction chemicals for projects and organic pigments to other companies. Management sorts the portfolio into **core** (established brands growing at 1-2x real GDP), **growth** (waterproofing, tile adhesives, projects, joineries: 2-4x GDP) and **pioneer** categories (new bets such as Unofin renders, Haisha paints and electronics adhesives), with core and the rest "nearly 50-50".` },
    { exhibit: { type: 'table', title: 'What Pidilite sells (FY26, standalone, % of sales)', head: ['Segment / category', 'Share', 'Main brands and products'], wide: [2], rows: [
      ['**Consumer & Bazaar**', `**${MX.cbPct}%**`, ''],
      ['  Adhesives & sealants', `${MX.adhesivesSealantsPct}%`, 'Fevicol (white glue, contact adhesives), Fevikwik, Fevistik, M-Seal, Araldite, Feviseal'],
      ['  Construction & paint chemicals', `${MX.constructionPaintChemPct}%`, 'Dr. Fixit waterproofing, Roff / Starlike / Tenax tile and stone care, WD-40, ICA wood finishes, Haisha paints'],
      ['  Art & craft and others', `${MX.artCraftOthersPct}%`, 'Fevicryl, Hobby Ideas'],
      ['**Business to Business**', `**${MX.b2bPct}%**`, ''],
      ['  Industrial resins, construction chemicals (projects)', `${MX.industrialResinsProjectsPct}%`, 'Pidilite Professional Solutions (systems for builders, metros, data centres), Nina Percept (waterproofing contracting)'],
      ['  Industrial adhesives', `${MX.industrialAdhesivesPct}%`, 'Packaging, footwear, joineries (Jowat hot-melts)'],
      ['  Pigments & preparations', `${MX.pigmentsPct}%`, 'Organic pigments for paints, inks and textiles; the main export line'],
      ['Others', `${MX.othersPct}%`, 'Raw-material sales, NBFC'],
    ], source: 'Q1FY27 earnings presentation (industry segment composition, FY26 standalone)' } },
    { exhibit: { type: 'table', title: 'Consolidated segments, FY26', head: ['Segment', 'Net revenue (₹ cr)', 'Share', 'Growth', 'Segment EBITDA (₹ cr)', 'Margin'], rows: [
      ['Consumer & Bazaar', n0(A26.cbRev), `${Math.round(A26.cbRev / A26.consRev * 100)}%`, pc((A26.cbRev / A25.cbRev - 1) * 100), n0(A26.cbEbitda), `${n1(segM(A26, 'cb'))}%`],
      ['Business to Business', n0(A26.b2bRev), `${Math.round(A26.b2bRev / A26.consRev * 100)}%`, pc((A26.b2bRev / A25.b2bRev - 1) * 100), n0(A26.b2bEbitda), `${n1(segM(A26, 'b2b'))}%`],
      ['Others', n0(A26.othRev), '0%', pc((A26.othRev / A25.othRev - 1) * 100), n0(A26.othEbitda), '–'],
      ['Less: corporate costs not allocated', '', '', '', `−${n0(X.unallocHist.at(-1).v)}`, ''],
      { hl: true, cells: ['**Group (Screener basis)**', `**${n0(A26.consRev)}**`, '**100%**', `**${pc((A26.consRev / A25.consRev - 1) * 100)}**`, `**${n0(A.ebitda[b])}**`, `**${n1(A.ebitdaMargin[b])}%**`] },
    ], source: 'AR FY26 note 46 (segment result + allocable depreciation); Screener.in; GAM Research' } },
    { pair: [
      { type: 'hbar', title: 'India standalone is 83% of revenue', unit: 'FY26 revenue by entity (₹ crore, before consolidation adjustments)', x: ['Standalone, India', 'Standalone exports', 'Domestic subsidiaries', 'International subsidiaries'], series: [{ name: 'Revenue', values: [RS.standaloneDomestic, RS.standaloneExport, RS.domesticSubsidiaries, RS.internationalSubsidiaries], fmt: 'num' }], labels: 'all', highlight: 'Standalone, India', source: 'Q1FY27 earnings presentation (company at a glance)' },
      { type: 'hbar', title: 'Adhesives & sealants still more than half of sales', unit: 'FY26 standalone sales mix (%)', x: ['Adhesives & sealants', 'Construction & paint chem.', 'Industrial resins, projects', 'Art & craft, others', 'Industrial adhesives', 'Pigments'], series: [{ name: 'Share', values: [MX.adhesivesSealantsPct, MX.constructionPaintChemPct, MX.industrialResinsProjectsPct, MX.artCraftOthersPct, MX.industrialAdhesivesPct, MX.pigmentsPct], fmt: 'pct' }], labels: 'all', highlight: 'Adhesives & sealants', source: 'Q1FY27 earnings presentation' },
    ] },
    { exhibit: { type: 'table', title: 'Reach and assets', head: ['', 'Detail'], wide: [1], rows: [
      ['Manufacturing', '33 plants (CRISIL); ~70 manufacturing units incl. co-makers and 50+ distribution centres (company); ₹3,300+ cr of capex over 10 years'],
      ['Distribution', '5,700+ distributors; Emerging India: ~2,000 stockists, ~3,300 sub-stockists, ~3.8 lakh dealers, 40,000+ rurban towns; 24,000+ Pidilite ki Duniya outlets; 1,700+ Dr. Fixit centres; e-commerce and quick commerce the fastest-growing channel over five years'],
      ['People and products', '8,835 permanent standalone employees; 840+ products, 6,000+ SKUs; R&D ~₹115 cr a year (0.8% of revenue)'],
      ['Partners', 'JVs and technology tie-ups with ICA (wood finishes), Litokol (grouts), Grupo Puma (tile adhesives, Unofin), Jowat (hot-melts), WD-40'],
      ['International', `Subsidiaries in the UAE, Bangladesh, Sri Lanka, Egypt, Kenya, Thailand; FY26 sales Asia ₹359 cr (EBITDA margin ~22%), Middle East & Africa ₹341 cr (~9%); Q1FY27 +${Q1.intlSubsGrowthPct}%`],
    ], source: 'Q1FY27 and Q4FY26 presentations, investor presentation (May-2026), AR FY26, CRISIL' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From one glue brand (1959) to a category creator',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.event), rup(h.impact) || '–']), source: 'Company presentations (May-2026), annual reports FY22-FY26, earnings calls' } },
    { callout: '**Corporate actions and per-share data:** the 1:1 bonus of Sep-2025 doubled the share count to 101.8 cr. Screener, and every per-share figure in this report, is restated for it: FY26 EPS of ₹24.06 equals ₹48 on the old share count. Broker targets from before the bonus (₹3,000-3,400) are not comparable with today\'s (₹1,350-1,890). No buyback or equity raise in the period; dividends are the main return of cash (₹1,526 cr paid in FY26 including the special).' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Under-penetrated categories, a volatile input-cost cycle and more competition',
  blocks: [
    { p: 'Pidilite\'s categories grow with home building, renovation and furniture making, and with the shift from crude methods (cement to fix tiles, no waterproofing) to branded chemicals. That shift has a long way to run: management puts tile-adhesive penetration at 20-30% of the ~₹6,500 cr tile & stone market, and waterproofing in small builders\' projects is still "not being done". Demand was strong into 2026: urban demand turned "buoyant" in Jan-Mar 2026 after the GST 2.0 rate cuts and income-tax relief, in the MD\'s view.' },
    { p: 'The cost side is a petrochemical cycle. Pidilite\'s key inputs (VAM, polymers, acrylates, resins) follow crude oil and supply shocks. Raw and packaging materials were ~45% of sales in FY26 (CRISIL). The West Asia conflict that started in early 2026 pushed the weighted raw-material basket up 40-50% at the peak; VAM more than doubled. Pidilite and its rivals raised prices together, and by August VAM had fallen back about half way. The other change is competition: paint majors are pushing into waterproofing (and one has built its own VAM/VAE plant), and cement and tile makers are entering tile adhesives.' },
    { exhibit: { type: 'table', title: 'Forces acting on Pidilite\'s markets (as of 30-Sep-2026)', head: ['Theme', 'Direction', 'What it means for Pidilite'], wide: [2], rows: D.industry.themes, source: D.industry.src } },
    { pair: [
      { type: 'hbar', title: 'Pidilite grew fastest of the building-material names in Q1FY27', unit: 'Consolidated revenue growth, Jun-2026 quarter, year on year (%)', x: ['Pidilite', 'Asian Paints', 'Astral', 'Berger Paints', 'Hindustan Unilever', 'Kansai Nerolac'], series: [{ name: 'Growth', values: [q1g.PIDILITIND, q1g.ASIANPAINT, q1g.ASTRAL, q1g.BERGEPAINT, q1g.HINDUNILVR, q1g.KANSAINER], fmt: 'pct' }], labels: 'all', highlight: 'Pidilite', source: 'Screener.in quarterly results' },
      { type: 'hbar', title: 'And over three years', unit: 'Revenue growth, FY23-26, a year (%)', x: IND.map(X.shortName), series: [{ name: 'CAGR', values: IND.map(cagr3), fmt: 'pct' }], labels: 'all', highlight: 'Pidilite', source: 'Screener.in (consolidated)' },
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: Pidilite captures the domestic tailwinds; the cost tailwind has turned',
  blocks: [
    { verdicts: [
      ['Urban consumption recovery (tax cuts, GST 2.0)', 'Yes', 'Q4FY26 UVG 15.3% (C&B 15.4%), Q1FY27 11.3% even with price rises; Fevicol grew double digit in Q4FY26.', 'Volumes are real, not just price.'],
      ['Housing, renovation and construction', 'Yes', 'Waterproofing back to "mid-teens plus" growth; domestic B2B (projects) UVG 21.5% in Q4FY26 and 10.4% in Q1FY27.', 'Growth categories are firing.'],
      ['Penetration of tile adhesives and waterproofing', 'Yes, but contested', 'Pidilite says it grows fastest in tile adhesives (~1.5-2x market); new entrants from cement, tiles and paints.', 'Share gains continue; pricing power is lower here than in Fevicol.'],
      ['Rural and rurban India', 'Partly', 'Rurban growth ahead of urban for years (company); the 2026 monsoon ended ~13% below normal.', 'A watch item for H2FY27.'],
      ['Input-cost cycle', 'Turned', 'Benign inputs lifted EBITDA margin from 17% (FY23) to 24% (FY26); the 2026 spike reversed it and prices had to rise.', 'The margin tailwind is behind us.'],
      ['Exports and global markets', 'No', `B2B export UVG −28.8%, −21.8%, ${Q1.b2bExportUvgPct}% in the last three quarters; exports ~7% of standalone sales.`, 'Small, but drags B2B.'],
      ['New categories (paints, electronics, Unofin)', 'Not yet', 'MD: still "refining" the urban playbook in paints; electronics and Unofin show "green shoots".', 'Options, not earnings.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

const cb = {
  id: 'cb', nav: 'Consumer & Bazaar', kicker: 'Segment', title: 'Consumer & Bazaar: the moat, now growing on price as well as volume',
  blocks: [
    { pair: [
      { type: 'column', title: 'C&B revenue by quarter (standalone)', unit: 'Segment revenue (₹ crore)', x: QL, series: [{ name: 'C&B', values: SQ.map(q => q.cbRev), fmt: 'num' }], labels: 'all', source: 'Company presentations (Q2FY26 derived from 9M less Q1 and Q3)' },
      { type: 'column', title: 'C&B volume growth stepped up from 6-8% to 9-15%', unit: 'C&B UVG, year on year (%)', x: QL, series: [{ name: 'C&B UVG', values: SQ.map(q => q.cbUvgPct), fmt: 'pct' }], labels: 'all', source: 'Company presentations' },
    ] },
    { bullets: [
      `**What it is.** Branded adhesives, sealants, waterproofing, tile adhesives and art materials sold through dealers to tradesmen and households: ₹${n0(A26.cbRev)} cr of consolidated net revenue in FY26 (${Math.round(A26.cbRev / A26.consRev * 100)}% of the group), growing ~${Math.round((A26.cbRev / A21.cbRev) ** (1 / 5) * 100 - 100)}% a year since FY21.`,
      `**Margins track inputs.** Consolidated C&B segment EBITDA margin: ${SA.map(a => `${a.fy} ${n1(segM(a, 'cb'))}%`).join(', ')}. The FY23 trough came when VAM and other inputs spiked; FY26 is a record.`,
      '**FY26-Q1FY27 acceleration.** C&B UVG rose from 7.2% in FY25 to 11.1% in FY26 and 12.2% in Q1FY27. Management credits urban buoyancy, more field marketing (standalone A&SP +19% in FY26, +37% in Q1FY27) and share gains in growth categories, and says it did not load the channel in March.',
      '**Pricing.** Fevicol prices rose ~5% in April and another 7-9% in May 2026 (12-15% in all); company-wide ~4-5% plus ~7-8%. Rivals followed. With VAM falling, management expects to give some back through rebates, "particularly in our Bazaar business".',
      '**Competition.** Pidilite is the leader in consumer adhesives; in tile adhesives the top 4-5 players hold 80-90%, and cement and tile makers are entering; Pidilite answers with more plants (Nio Pro now made in four), quality and "total delivered cost".',
    ] },
    { callout: `**Our view:** C&B is the best part of Pidilite and the reason it deserves a premium. We model C&B revenue {{as.segments.0.growth.0|chg}} in FY27E (UVG ~10.5% plus ~7.5% price after rebates), then +11% and +12%, with segment EBITDA margin of 32.2-32.4%, a little below FY26's ${n1(segM(A26, 'cb'))}%. The risk is not volume; it is that margins revert toward the 23-29% of FY22-24 if input costs spike again.` },
  ],
};

const b2b = {
  id: 'b2b', nav: 'Business to Business', kicker: 'Segment', title: 'B2B: projects are growing, pigment exports are not, and there is no moat',
  blocks: [
    { pair: [
      { type: 'column', title: 'B2B revenue by quarter (standalone)', unit: 'Segment revenue (₹ crore)', x: QL, series: [{ name: 'B2B', values: SQ.map(q => q.b2bRev), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'column', title: 'B2B volume growth fell as exports shrank', unit: 'UVG, year on year (%)', x: QL, series: [{ name: 'B2B UVG', values: SQ.map(q => q.b2bUvgPct), fmt: 'pct' }, { name: 'of which exports', values: SQ.map(q => q.b2bExportUvgPct ?? null), fmt: 'pct' }], labels: 'none', source: 'Company presentations (export UVG disclosed from Q3FY26)' },
    ] },
    { bullets: [
      `**What it is.** Industrial adhesives, resins, project construction chemicals and organic pigments: ₹${n0(A26.b2bRev)} cr of consolidated net revenue in FY26. CRISIL calls it "a bulk commodity business"; segment EBITDA margin has ranged from ${n1(segM(A21, 'b2b'))}% (FY21) to ${n1(segM(A25, 'b2b'))}% (FY25).`,
      '**Two halves.** Domestic B2B (Pidilite Professional Solutions selling waterproofing and construction systems to builders, metros, hotels and data centres; industrial adhesives for packaging, footwear, joineries) grew UVG 15.6%, 21.5% and 10.4% in the last three quarters. Exports (mainly pigments) fell each quarter, hit by the West Asia conflict from March 2026.',
      '**Subsidiaries.** Domestic B2B subsidiaries (incl. Nina Percept, waterproofing contracting) shrank 5% in FY26 to ₹359 cr; Nina\'s order book is "very, very healthy" but sites were shut by pollution curbs.',
    ] },
    { callout: 'B2B is a useful second leg (its revenue more than doubled since FY21) but it does not carry the brand premium. We model revenue {{as.segments.1.growth.0|chg}} in FY27E and +10-11% after, with segment EBITDA margin of 19.5-20%, close to FY25-26 and well above the 10-13% of FY21-23.' },
  ],
};

module.exports = { business, history, industry, tailwind, cb, b2b };
