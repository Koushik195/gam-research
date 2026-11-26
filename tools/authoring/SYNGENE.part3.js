// Syngene report, part 3: research services; CDMO and the Zoetis/Librela contract; biologics and small-molecule capacity.
const X = require('./SYNGENE.ctx2');
const { C, AS, n0, n1, BL, LINES, YRS, mixPct, SQ } = X;
const CU = C.customers, CAP = C.capacity;

const research = {
  id: 'research', nav: 'Research services', kicker: 'Segment', title: 'Research services (~65%): the BMS centre is secure to 2035, but discovery has drifted into commodity work and is losing clients on price',
  blocks: [
    { p: `Research services earned about ₹${n0(BL.base.research)} cr in FY26 on management's ~65/35 split. The core is chemistry, with biology, biotherapeutics discovery, DMPK and safety assessment around it, sold to large pharma and to small biotechs. The **dedicated centres** are the stable part: BMS has worked with Syngene since 1998, now with 700+ scientists, and in Jan-2026 extended the collaboration to 2035 with a wider scope (discovery to clinical and manufacturing); management expects it to grow "around US inflation". The **discovery** part is the problem. In the Q1FY27 call the new leadership said Syngene had "drifted towards the larger share of commoditised research services where differentiation is limited, and pricing pressure is inevitable", and that a few clients left on cost. Q1FY27 research revenue was ~₹574 cr (78% of ₹736 cr), roughly −1.5% on our estimate for Q1FY26 despite a much weaker rupee.` },
    { pair: [
      { type: 'column', title: 'Research services: flat in FY27E, +7-8% after', unit: 'Revenue (₹ crore), GAM split', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'Research services', values: [X.SA[5].research, X.SA[6].research, ...LINES.research.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY27E', source: 'Company shares of revenue; GAM estimates' },
      { type: 'column', title: 'Research share of revenue: 65% (FY26) → 78% (Q1FY27) as CDMO shrank', unit: '% of revenue', x: ['FY25', 'FY26', 'Q4FY26', 'Q1FY27', ...YRS], series: [{ name: 'Research services', values: [65, 65, 59, 78, ...mixPct('research').map(v => Math.round(v))], fmt: 'pct' }], labels: 'all', min: 0, max: 100, source: 'Q3FY26, Q4FY26 and Q1FY27 calls; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'Research services: what we assume', head: ['', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ['Growth', ...BL.growth.research.map(g => `${g > 0 ? '+' : ''}${g}%`), 'Q1 ~−1.5%; rupee ~+6% in FY27; recovery in biotech funding with a lag; still below the ~11% market'],
      ['Revenue (₹ cr)', ...LINES.research.map(n0), 'GAM split; company does not disclose rupee figures'],
    ], source: 'GAM Research (assumptions.json businessLines)' } },
    { callout: '**Our view:** the dedicated-centre model (BMS and others) is the best business Syngene has: long contracts, client-funded infrastructure, low churn. Discovery FTE work is not: Indian and Chinese rivals sell chemistry hours more cheaply, and AI tools may reduce the hours needed per programme. Management\'s plan (AI-led, new modalities, integrated discovery-to-development) is sensible but unproven; we give research services almost no growth in FY27 and less than the market after.' },
  ],
};

const cdmo = {
  id: 'cdmo', nav: 'CDMO & the Zoetis contract', kicker: 'Segment', title: 'CDMO (~35%): Librela, the one large commercial product, has gone to near zero; we cut CDMO revenue 21% in FY27E and assume no replacement of similar size',
  blocks: [
    { p: `The CDMO business was about ₹${n0(BL.base.cdmo)} cr in FY26. Its largest piece was commercial manufacture of bedinvetmab, the antibody in **Librela** (Zoetis's monthly injection for osteoarthritis pain in dogs). Syngene signed the long-term Zoetis contract in 2018: a 10-year programme with potential of up to US$500 mn (CFO, Q3FY26 call), whose early years ran above the average as Zoetis filled its distribution channels. From the start of FY26 Zoetis cut orders to run down inventory, and the CFO also pointed to a "product issue" in public reports on the drug. Syngene cut its FY26 guidance in Jan-2026 to a 3-5% constant-currency decline because Librela volumes were slower than expected. In Q1FY27 there was "almost no Librela"; management sizes the impact at "nearly $50 million" a year, says Zoetis holds inventory for "the next couple of years", has only small delivery obligations in H2FY27, and does not expect volumes to be zero in FY28. Syngene has no commercial role in Zoetis's follow-on antibody Lenivia.` },
    { exhibit: { type: 'table', title: 'The Zoetis / Librela contract: what was said, when', head: ['Date', 'Source', 'What was said'], wide: [2], rows: [
      ['2018', 'Q1FY27 deck (history)', 'Long-term partnership with Zoetis for commercial-scale biologics manufacturing'],
      ['23-Jan-2026', 'Q3FY26 call', '10-year programme with potential to reach US$500 mn; early years above average; now inventory correction and "a product issue"; impact continues beyond Q4'],
      ['30-Apr-2026', 'Q4FY26 call', 'Q1 and Q2FY27 "almost no Librela"; minor volumes late in the year; no role in Lenivia beyond some clinical work'],
      ['30-Jul-2026', 'Q1FY27 call', '"Absence of offtake from Zoetis"; impact "nearly $50 million"; not zero in FY28; Zoetis to give FY28 forecast by year-end'],
    ], source: 'Company call transcripts and decks' } },
    { pair: [
      { type: 'column', title: 'CDMO revenue: ~₹1,309 cr (FY26) → ~₹1,034 cr (FY27E)', unit: 'Revenue (₹ crore), GAM split', x: ['FY25', 'FY26', ...YRS], series: [{ name: 'CDMO', values: [X.SA[5].cdmo, X.SA[6].cdmo, ...LINES.cdmo.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY27E', source: 'Company shares; GAM estimates' },
      { type: 'column', title: 'CDMO by quarter (GAM split of disclosed shares)', unit: 'Revenue (₹ crore)', x: SQ.filter(q => q.cdmo).map(q => q.q), series: [{ name: 'CDMO', values: SQ.filter(q => q.cdmo).map(q => q.cdmo), fmt: 'num' }], labels: 'all', source: 'Q3FY26, Q4FY26, Q1FY27 calls (shares); GAM' },
    ] },
    { exhibit: { type: 'table', title: 'CDMO: what we assume', head: ['', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [4], rows: [
      ['Growth', ...BL.growth.cdmo.map(g => `${g > 0 ? '+' : ''}${g}%`), 'Librela ~US$50 mn → minor; ex-Librela +13% in FY27 (Mangaluru lock-ins, Unit 3 batches); Bayview from FY28'],
      ['Revenue (₹ cr)', ...LINES.cdmo.map(n0), 'GAM split'],
      ['Two customers above 10% (BMS and Zoetis in our reading)', '–', '–', '–', `${CU.top.fy25Pct}% of revenue in FY25, ${CU.top.fy26Pct}% in FY26 (AR FY26 note 33); the Zoetis share falls sharply in FY27`],
    ], source: 'GAM Research (assumptions.json businessLines)' } },
    { callout: '**How the ramp-down shapes FY27-29:** the hit is front-loaded. Librela was ~US$50 mn of FY26 revenue on our estimate and is nearly gone in FY27, so FY27 carries the full drop (−21% for CDMO) while the plants that made it stay staffed. From FY28 the base is low: a renewal of Librela volumes would be upside (our bull case), not something we assume. The real test is whether Unit 3 and Bayview win commercial (not just clinical) molecules; biologics commercial supply takes years from first batch to validated supply.' },
  ],
};

const capacity = {
  id: 'capacity', nav: 'Biologics capacity', kicker: 'Capacity', title: 'Capacity: Unit 3 (₹617 cr, 20,000 L) and Bayview (US$36.5 mn, US) were bought to diversify; both are under-used and their costs land before their revenue',
  blocks: [
    { exhibit: { type: 'table', title: 'The manufacturing sites and where they stand (30-Sep-2026)', head: ['Site', 'What it is', 'Cost', 'Status', 'P&L effect'], wide: [1, 3], rows: [
      ['Bengaluru biologics (original)', 'Mammalian and microbial drug substance and product', 'Built 2019-23', 'Lost its anchor (Librela); spare capacity (CEO)', 'Fixed costs without the volume'],
      ['Unit 3, Bengaluru', '20,000 L drug-substance site acquired from Stelis Biopharma (Strides group); 8 kL line commissioned; ADC conjugation suite and bioassay lab added', 'Announced ₹702 cr (Jul-2023); closed at ₹617 cr (Dec-2023)', 'Licensed and capitalised in Q1FY26 after ~18 months; customers signed, mostly clinical/development batches; no large commercial molecule', 'Depreciation and staff from FY26; a margin drag (CFO)'],
      ['Bayview, Baltimore (US)', 'Biologics site bought from Emergent BioSolutions; 2 kL and 4 kL single-use bioreactors; takes group single-use capacity to 50,000 L', 'US$36.5 mn (Mar-2025) + ₹78.5 cr pre-operating cost in FY26; ~₹410 cr in CWIP and land', 'Qualification done (Jan-2026); operationalised later in FY27; one or two US projects converted; revenue from FY28', 'Not capitalised in FY27 (minimal P&L cost); ~₹25-30 cr a year of depreciation plus running costs from FY28'],
      ['Mangaluru', 'Commercial small-molecule API plant; sterile fill-finish line at the large-molecule unit', 'Built FY20-23', '"Very low utilisation in the past years"; lock-ins for commercial and clinical molecules; significant ramp-up in FY27-28', 'Operating leverage if it fills'],
    ], source: rupS(CAP.src) } },
    { p: `Capital work in progress was ₹${n0(CAP.cwipMar26)} cr at Mar-26 (₹1,261 cr a year earlier), most of it Bayview. The engine holds CWIP flat and depreciates new capex at once, so our depreciation (₹${n0(X.F.dep[0])} / ${n0(X.F.dep[1])} / ${n0(X.F.dep[2])} cr for FY27-29E) is set with Bayview's capitalisation in FY28 in mind (${AS.depRateOnGrossBlock}% of gross block).` },
    { callout: '**Our view:** the capacity is good capacity (single-use, US-inspected sites, a US footprint rivals lack) bought for a sound reason, but at the wrong time. Utilisation of the biologics network is the single biggest swing factor in FY28-29 margins. We assume Bayview and Unit 3 earn clinical and some commercial revenue from FY28 (CDMO +16-17%), not a Librela-sized contract.' },
  ],
};

function rupS(s) { return String(s).replace(/Rs ?(?=[0-9])/g, '₹'); }
module.exports = { research, cdmo, capacity };
