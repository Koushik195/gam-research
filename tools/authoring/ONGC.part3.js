// ONGC report, part B-3: industry, tailwind test, crude, gas, and ONGC Videsh and the stakes.
const X = require('./ONGC.ctx');
const { C, AS, SA, n0, n1, price, sh, ps, build, stakeMv, listedMv, DISC, OVLPS, CP } = X;
const B = AS.build, Q1 = C.q1fy27, P = C.business.production, POL = C.policy;
const fy27 = build[0], fy28 = build[1];
const perUsd = (i) => { const r = build[i]; return (r.crude * (1 - B.cessPct[i] / 100 - B.royaltyPct[i] / 100)) / B.brent[i]; }; // net crude revenue per US$1 of Brent
const usd1 = perUsd(1) * (1 - 0.2517) / sh; // EPS per US$1/bbl in FY28E

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A crude price set in the Gulf; a gas price set in Delhi',
  blocks: [
    { p: `${X.D.industry.crude} ${X.D.industry.india}` },
    { p: X.D.industry.policy },
    { exhibit: { type: 'table', title: 'How ONGC is paid, and who takes a share', head: ['Product', 'Share of FY26 revenue', 'Price basis', 'Government share'], wide: [2, 3], rows: [
      ['Crude oil', '63%', 'Brent-linked (contracts with refiners at a small premium to Brent)', 'Royalty (offshore 8% from May-2026, onland pre-NELP 16.66%) + OIDB cess (15.6% of crude revenue in FY26) + windfall tax when imposed'],
      ['Gas from old (nomination) wells', '27% for all gas', 'APM: 10% of the Indian crude basket, capped at US$7.00/mmBtu in FY27', 'Royalty (8% from May-2026); the cap itself transfers the upside to gas users'],
      ['New-well gas', '(38% of gas revenue in Q1FY27)', '1.2x the APM formula price, not capped (US$13.31 in Q1FY27)', 'Royalty'],
      ['LPG, naphtha, ethane-propane', '9%', 'Import-parity and contract prices', '–'],
    ], source: 'ONGC AR FY26; Q1FY27 call; PPAC; royalty notifications (May/Jun-2026)' } },
    { callout: '**So what:** ONGC is a price-taker on crude and a price-controlled seller of most of its gas. Its earnings respond to Brent with a lever the government holds at both ends: it cut royalty in May-2026 to encourage exploration, and it taxed windfalls in 2022-24. The share price on 30-Sep-2026 reflects the market\'s doubt about which hand will act next.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the oil-price tailwind reach ONGC\'s shareholders? Mostly, this time; not durably',
  blocks: [
    { exhibit: { type: 'table', title: 'The tailwind test', head: ['Tailwind', 'Does it reach ONGC?', 'Evidence'], wide: [2], rows: [
      ['Brent spike after the Hormuz crisis', '**Yes, for now**', `Crude realisation US$${Q1.crudeRealisationUsd} in Q1FY27 vs US$${Q1.crudeRealisationPyUsd} a year earlier; record standalone PBT ₹${n0(Q1.pbtCr)} cr; no windfall tax by 30-Sep-2026`],
      ['Higher gas prices', '**Partly**', `APM capped at US$7.00 while the formula was US$9.00 (Sep-2026); only new-well gas (24% of sales volume) gets the formula price x 1.2`],
      ['Royalty cut (May-2026)', '**Yes**', 'Offshore crude 9.09%->8%, gas 10%->8%; CLSA: +US$2.4-3/bbl net realisation'],
      ['Energy-security push (Samudra Manthan)', '**Mixed**', 'Government shares exploration cost, but ONGC must drill more high-risk deepwater wells (₹800-1,000 cr each)'],
      ['Higher fuel prices for its OMC holdings', '**No: it hurts**', `HPCL lost ₹${n0(Q1.hpclNetLossCr)} cr in Q1FY27 on under-recoveries; consolidated PAT fell to ₹${n0(Q1.consolidatedPatCr)} cr`],
      ['Volume growth', '**Not yet**', `Own-field crude 19.5 MMT (FY22) -> 19.3 MMT (FY26), Q1FY27 −5% YoY; guidance 39 MMTOE (FY27) and 40 (FY28)`],
    ], source: 'Q1FY27 results and call; PPAC; press; GAM Research' } },
    { p: `Every US$1/bbl on Brent is worth ~₹${n0(perUsd(1))} cr of crude revenue after royalty and cess in FY28E, or ~₹${n1(usd1)} of EPS. Our FY28E Brent of US$${B.brent[1]} versus FY27E's US$${B.brent[0]} explains most of the fall in EPS from ₹{{F.eps.0|n1}} to ₹{{F.eps.1|n1}}. **Verdict: the 2026 windfall is reaching shareholders, but it is a one-year gift, not a re-rating of the business.**` },
  ],
};

const crude = {
  id: 'crude', nav: 'Crude oil', kicker: 'Segment: crude oil', title: 'Crude: two-thirds of revenue from fields that need ever more capex to stand still',
  blocks: [
    { p: `ONGC sold ${SA[6].crudeSold} MMT of crude in FY26 (incl. its JV share), against ${SA[0].crudeSold} MMT in FY20. The old giants of the Western Offshore (Mumbai High and its satellites) decline ~5-6% a year naturally; ONGC fights that with infill drilling, water injection and a technical-services partnership (TSP) with BP on Mumbai High, now extended to the whole Western Offshore, which management says now produces 107% of the contractual baseline for oil and 113% for gas. KG-DWN-98/2, the deepwater block that was meant to add growth, has disappointed on oil (~21,000 bbl/d; reservoir connectivity problems; each well re-entry costs >₹500 cr). Management guides oil about flat in FY27 and ~+0.5 MMT in FY28.` },
    { pair: [
      { type: 'column', title: 'Crude sold (incl. JV share): down 12% since FY20; we assume a small recovery', unit: 'MMT', x: [...SA.map(a => a.fy), 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Crude sold', values: [...SA.map(a => a.crudeSold), ...B.crudeSoldMmt], fmt: 'n1' }], labels: 'all', source: 'ONGC AR FY26; GAM estimates' },
      { type: 'column', title: 'Crude revenue per tonne follows the basket and the rupee', unit: '₹ per tonne sold', x: SA.map(a => a.fy), series: [{ name: '₹/tonne', values: SA.map(a => Math.round(a.crudeRev * 1e7 / (a.crudeSold * 1e6))), fmt: 'num' }], labels: 'all', source: 'ONGC AR FY26 ten-year table' },
    ] },
    { exhibit: { type: 'table', title: 'Our crude build', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Crude sold (MMT)', SA[6].crudeSold, ...B.crudeSoldMmt],
      ['Brent (US$/bbl)', B.base.brent, ...B.brent],
      ['INR / US$', B.base.inrUsd, ...B.inrUsd],
      { hl: true, cells: ['**Crude revenue (₹ cr)**', `**${n0(B.base.crudeRev)}**`, ...build.map(r => `**${n0(r.crude)}**`)] },
      ['OIDB cess (₹ cr)', n0(SA[6].cess), ...build.map(r => n0(r.cess))],
    ], source: 'ONGC AR FY26; GAM estimates (Brent path from EIA STEO Sep-2026)' } },
  ],
};

const gas = {
  id: 'gas', nav: 'Natural gas', kicker: 'Segment: natural gas', title: 'Gas: the growth engine, priced by formula and capped',
  blocks: [
    { p: `Gas was 27% of FY26 revenue (₹${n0(SA[6].gasRev)} cr) and is where ONGC's volume growth will come from: Daman Upside (+2 mmscmd by Dec-2026), the East Coast CPP (1.3 mmscmd), Tapti/Daman wells (0.5) and KG-98/2 gas (from 1.5-1.7 to ~3 mmscmd by Q4FY27 and 6-7 by Q4FY28). ${POL.apm} In Q1FY27 the formula price was well above the cap, so old-well gas earned US$${Q1.gasOwnFieldsUsd} while new-well gas earned US$${Q1.nwgUsd} (₹${n0(Q1.nwgRevenueCr)} cr of revenue, ₹${n0(Q1.nwgPremiumOverApmCr)} cr above the APM price). New-well gas was ${Q1.nwgShareOfSalesQtyPct}% of sales volume (17% a year earlier) and ${Q1.nwgShareOfGasRevenuePct}% of gas revenue.` },
    { pair: [
      { type: 'column', title: 'Gas sold: down a fifth since FY20; new projects turn it up from FY28E', unit: 'BCM', x: [...SA.map(a => a.fy), 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Gas sold', values: [...SA.map(a => a.gasSold), ...B.gasSoldBcm], fmt: 'n1' }], labels: 'all', source: 'ONGC AR FY26; GAM estimates' },
      { type: 'column', title: 'Average gas realisation: our path', unit: 'US$/mmBtu (blended)', x: ['FY26', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Gas price', values: [B.base.gasUsd, 9.2, ...B.gasUsd], fmt: 'n1' }], labels: 'all', source: 'JM (FY26, Q1FY27 blended); GAM estimates' },
    ] },
    { callout: `**So what:** at ~US$70 crude the APM formula (~US$7.0) falls to or below the ceiling (US$7.25 in FY28 if the US$0.25 a year step continues), so the cap stops costing ONGC much, but new-well gas also loses its Q1FY27 premium. Our FY28E gas revenue (₹${n0(fy28.gas)} cr) is below FY27E (₹${n0(fy27.gas)} cr) even with 5% more volume.` },
  ],
};

const ovl = {
  id: 'stakes', nav: 'OVL and the stakes', kicker: 'ONGC Videsh and the stakes', title: `ONGC Videsh is recovering; the listed stakes are worth ₹${n0(ps(listedMv))} a share`,
  blocks: [
    { p: `**ONGC Videsh (OVL)** holds 29 projects in 14 countries and produced 9.67 MMTOE in FY26 (crude 6.91 MMT, gas 2.76 BCM: down from 8.10 MMT and 4.23 BCM in FY22: Sakhalin-1, its most important asset, was out of OVL's hands for about four years after Russia took the project over). The stake was restored in Dec-2025 and OVL now earns ~₹1,000-1,140 cr a quarter (₹2,260 cr in Q4FY26 before impairment), though price caps cut the realisation on Russian barrels. Mozambique LNG (first gas end-FY28/early FY29, ~3 MMTPA share), Brazil's BM-SEAL (first oil 2030) and Venezuela (OFAC licence obtained) are the options. We do not have OVL's audited book value in our sources, so we use the two broker values: JM (7x FY28E EPS, ₹${OVLPS.bear} a share) and MOSL (0.5x FY25 book, ₹${OVLPS.bull}); base = midpoint ₹${OVLPS.base}.` },
    { exhibit: { type: 'table', title: 'The listed stakes at 30-Sep-2026', head: ['Company', 'ONGC stake', 'Shares held (cr)', 'Close (₹)', 'Value (₹ cr)', '₹ / ONGC share', `After ${DISC.base}% discount`], rows: [
      ...Object.keys(stakeMv).map(s => [{ HINDPETRO: 'HPCL', MRPL: 'MRPL', IOC: 'Indian Oil', GAIL: 'GAIL', PETRONET: 'Petronet LNG' }[s], `${C.stakes.listed[s].pct}%`, C.stakes.listed[s].sharesCr.toFixed(2), X.CLOSE[s].toFixed(2), n0(stakeMv[s]), n0(ps(stakeMv[s])), n0(ps(stakeMv[s]) * (1 - DISC.base / 100))]),
      { hl: true, cells: ['**Total**', '', '', '', `**${n0(listedMv)}**`, `**${n0(ps(listedMv))}**`, `**${n0(ps(listedMv) * (1 - DISC.base / 100))}**`] },
    ], source: 'ONGC AR FY26 note 11.1; NSE closes on 30-Sep-2026' } },
    { p: `The stakes pay ONGC dividends (₹${n0(C.otherIncomeFy26.dividendsCr)} cr in FY26, of which HPCL ₹${n0(C.otherIncomeFy26.dividendHpclCr)} cr), but ONGC has never sold them, and two (HPCL, MRPL) are refiners whose profits move opposite to ONGC's when crude spikes. That is a natural hedge for the group and a reason the market discounts them inside ONGC: an investor who wants HPCL can buy HPCL.` },
  ],
};

module.exports = { industry, tailwind, crude, gas, ovl };
