// Granules India report, part 2b: industry and the tailwind test.
const X = require('./GRANULES.ctx');
const { C, D, n1, pc1, SECTOR, ownMv } = X;
const I = D.industry;

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'The industry: US generics pay for reliability more than for low price; controlled substances and peptides are the few niches with real barriers',
  blocks: [
    { p: '**US generics.** Once a drug loses its patent, many makers file copies and the price falls every year; a few large wholesalers and retail chains buy most of the volume and squeeze suppliers. What has changed since 2022 is shortages: buyers now reward makers that supply on time, every time, and are consolidating purchases with fewer, dependable vendors (GPI\'s President, 29-Sep-2026). That suits a vertically integrated maker such as Granules, as long as its plants stay in good standing with the FDA. A warning letter, as Granules has at Gagillapur, does not stop existing supply but blocks new approvals from that site.' },
    { p: `**Controlled substances.** Schedule II drugs (ADHD stimulants such as amphetamine and methylphenidate; opioid combinations) are regulated by the US Drug Enforcement Administration as well as the FDA. Each maker gets a yearly quota, and both the API and the tablet must be made in the US. Quota cuts caused ADHD shortages after 2023, and wholesalers moved business to suppliers that kept shipping. The US ADHD market was ~USD10.7 bn and the controlled-substance market ~USD55 bn in CY25 (Elara, citing company data and Grand View Research). Few makers can scale these products consistently, which is why Granules calls this its moat.` },
    { p: '**Commodity APIs.** Paracetamol, metformin and ibuprofen are made in huge volumes by Chinese and Indian plants. Prices spiked during COVID and then fell: Granules\' own API revenue fell 54% from FY23 to FY25. In 2025-26 Chinese makers cut prices again (DCDA, the metformin starting material) and raw-material and freight costs rose with the West Asia conflict; Granules could not pass the increase on to long-term customers in Q1FY27. **Peptides.** GLP-1 drugs for diabetes and obesity have created a shortage of peptide manufacturing capacity; Indian CDMOs are small in this field, and Senn (~USD20 mn of revenue) is a niche player.' },
    { exhibit: { type: 'table', title: 'Granules\' markets: size, position and what sets the price', head: ['Market', 'Size / trend', 'Granules\' position', 'What sets the price'], wide: [1, 2, 3], rows: [
      ['US generic tablets (integrated: paracetamol, metformin, ibuprofen)', 'Volume grows with prescriptions; prices fall each year', 'One of two integrated US paracetamol suppliers; No.1 in 10 of 35 US products (IQVIA, May-2026)', 'Number of approved makers; Chinese API cost'],
      ['US controlled substances (ADHD, opioids)', 'ADHD ~USD10.7 bn, controlled ~USD55 bn (CY25)', '3rd largest by value (8th in Jul-2025); top-3 in 6 of 7 ADHD products', 'DEA quota, reliability, few competitors'],
      ['Complex generics and first-to-file', 'Brand + generic TAM of the 25 ANDAs awaiting approval ~USD40 bn (IQVIA)', '2 sole first-to-files (>USD350 mn market) in litigation', '180-day exclusivity, then normal erosion'],
      ['Commodity API and PFI', 'Flat to falling prices since FY23', 'Large scale (34,560 TPA API at Bonthapally)', 'Chinese prices'],
      ['Peptide CDMO', 'Fast-growing (GLP-1), capacity-short', '~USD20 mn revenue; liquid-phase specialist', 'Innovator contracts, technology, capacity'],
    ], source: `${I.src}; IQVIA data cited in the Q1FY27 deck` } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the sector tailwind reach Granules? The re-rating and the US supply-security theme do; price relief in its legacy molecules does not',
  blocks: [
    { p: `Indian pharma traded above its own history on 30-Sep-2026: the nine large peers' P/E was a median ${pc1(SECTOR)} above their five-year medians. Granules' own trailing P/E was ${pc1(ownMv)} above its five-year median, far more than the sector. The question for an investor is which parts of the sector story actually reach Granules' earnings.` },
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Does it reach Granules?', 'Evidence', 'Verdict'], wide: [2], rows: [
      ['Pharma re-rating', 'Yes, more than fully', `Granules ${pc1(ownMv)} vs its five-year median; sector ${pc1(SECTOR)}`, 'The price already carries it'],
      ['US supply security, "made in USA"', 'Yes, for GPI', 'Schedule II products must be US-made; Adderall XR share 5% (2024) → 29% (Aug-2026)', 'Real, but one plant and a handful of products'],
      ['US drug shortages', 'Yes', 'Wholesalers consolidating with reliable suppliers; near-100% service level (GPI)', 'Helps share gains in controlled substances'],
      ['GLP-1 and peptide demand', 'Barely, so far', 'Senn ~USD20 mn revenue, EBITDA loss ₹44.5 cr in FY26', 'An option, not yet earnings'],
      ['China+1 in APIs', 'No price benefit', 'No price increases in FY26 (CMD); Chinese DCDA price cuts hit the CZRO project', 'Legacy molecules stay price-takers'],
      ['Weaker rupee (~₹96 per USD in Jul-2026)', 'Mixed', '~96% of revenue outside India; FY26 forex gain ₹9.2 cr, but imported raw materials cost more', 'Small net positive'],
      ['FDA scrutiny of Indian plants', 'Headwind', 'Gagillapur under warning letter since Feb-2025; 9 approvals blocked', 'The main drag on FY27-28'],
    ], source: 'Screener.in P/E series (sector factor, PLAYBOOK §7c); company decks and calls; webinar 29-Sep-2026; Emkay (INR/USD, 22-Jul-2026)' } },
    { callout: '**Verdict:** the tailwind reaches Granules through its US controlled-substance franchise and the market\'s willingness to pay more for Indian pharma. It does not reach the larger legacy business, which remains a price-taker against China. The stock has captured the re-rating already; earnings have to catch up.' },
  ],
};

module.exports = { industry, tailwind };
