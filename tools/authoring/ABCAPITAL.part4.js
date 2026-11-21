// Aditya Birla Capital report, part 4: the businesses outside the lender model — housing finance, AMC, life
// insurance, health insurance (with our forecast and how each is valued in the sum of the parts).
const X = require('./ABCAPITAL.ctx3');
const { C, SG, S, n0, n1, n2, hAum, hPat, hBook, hRoe, ev, gwp, part, amcClose, amcMcap, adventPb, hfcDerived, hfcPbDr, LIFE, pevMed, lifeDr, lifeDerived, HEALTH, healthPeerPg, healthDerived, sharesNow, PEERS } = X;
const HF = C.hfc, LI = C.life, HE = C.health, AM = C.amc;
const yrs = ['FY26', 'FY27E', 'FY28E', 'FY29E'];

const hfc = {
  id: 'hfc', nav: 'Housing finance', kicker: 'Housing finance', title: 'Housing finance: from sub-scale to ₹50,000 crore in three years, now with Advent',
  blocks: [
    { p: `Aditya Birla Housing Finance (ABHFL) lends to prime and affordable home buyers and against property, with average tickets of ₹25-30 lakh. AUM grew 50% YoY to ₹51,833 cr in June 2026, disbursements 39%; Stage 3 is only 0.41%. Profit doubled to ₹647 cr in FY26 (ROA 1.88%, ROE 14.3%) as cost-to-income fell from 58% to 47%. On 17-Apr-2026 Advent International (through Indriya Ltd) bought 14.3% for ₹2,750 cr at ₹223.12 a share, valuing the company at ₹19,250 cr, ${n2(adventPb)}x its post-money book. The extra equity cut ROE to 11.3% in Q1; management expects ~13% by Q4FY27 and 15% in 6-8 quarters, with ₹1 lakh cr of AUM.` },
    { exhibit: { type: 'table', title: 'ABHFL: our forecast', head: ['₹ crore', ...yrs], rows: [
      ['AUM (year-end)', ...hAum.map(n0)], ['Net profit', ...hPat.map(n0)], ['Net worth (incl. Advent\'s ₹2,750 cr in FY27E)', ...hBook.map(n0)], ['ROE', `${HF.FY26.roe}%`, ...hRoe.map(v => `${n1(v)}%`)],
    ], source: 'Q1FY27 presentation p32 (FY26); GAM estimates (ROA 2.0% on average AUM)' } },
    { callout: `**Valuation:** ${part('hfc').mult}x Sep-28E book (₹${n0(part('hfc').metric)} cr) for ABCL's 85.5% = ₹${n0(part('hfc').perShare)} a share. Listed housing-finance companies trade at ~${n2(X.hfcPbPerRoe)}x book per point of ROE (Bajaj Housing, PNB Housing, Aavas, Aptus, Home First, Aadhar) and have de-rated ${n0(Math.abs(hfcPbDr))}% against their five-year median P/B; at ABHFL's ~15% FY28-29E ROE that is ~${n1(X.hfcTrailDer)}x trailing book, or ${hfcDerived}x on Sep-28E book. Advent's entry price, restated the same way, is ~1.8x. The street uses 1.8-2.2x Mar-28E book.` },
  ],
};

const amc = {
  id: 'amc', nav: 'Asset management', kicker: 'Asset management', title: 'The AMC: a cash cow that is losing ground',
  blocks: [
    { p: `Aditya Birla Sun Life AMC (listed, ABSLAMC) managed ₹4.28 lakh cr of mutual-fund assets in Q1FY27 (QAAUM +6% YoY, equity +10%, equity mix 46.5%) and, with mandates, over ₹10 lakh cr after winning a ~₹6 lakh cr EPFO mandate. FY26 PAT was ₹975 cr (+2%) on revenue of ₹1,845 cr; Q1FY27 PAT ₹309 cr (+12%). Its market share of MF assets is 3.97% and it has been losing equity share to faster-growing rivals. For ABCL it is the only business that sends cash up: a dividend of ₹311 cr in FY26.` },
    { pair: [
      { type: 'column', title: 'AMC profit has stalled near ₹1,000 cr', unit: 'ABSLAMC profit after tax (₹ crore); FY27-29E = GAM', x: yrs, series: [{ name: 'PAT', values: [S.amc.pat.FY26, S.amc.pat.FY27E, S.amc.pat.FY28E, S.amc.pat.FY29E], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation; GAM estimates' },
      { type: 'tiles', title: 'ABCL\'s AMC stake on 30-Sep-2026', tiles: [
        { k: 'ABSLAMC close', v: `₹${n1(amcClose)}`, d: `market value ₹${n0(amcMcap)} cr; P/E ${n1(PEERS.ABSLAMC.pe)}x` },
        { k: 'ABCL stake', v: '44.89%', d: '12.96 cr shares' },
        { k: 'Value to ABCL', v: `₹${n0(part('amc').value)} cr`, d: `₹${n0(part('amc').perShare)} a share` },
      ], source: 'NSE close 30-Sep-2026; Annual Report FY26 AOC-1' },
    ] },
    { callout: '**Valuation:** we take the stake at the 30-Sep market price (as for listed stakes in our other holding-company reports) rather than at a target multiple; the holding discount then applies to it like everything else. Brokers use 26-28x earnings, slightly above the 28.5x trailing P/E it already trades on only if earnings grow.' },
  ],
};

const life = {
  id: 'life', nav: 'Life insurance', kicker: 'Life insurance', title: 'Life insurance: margins finally rising, but returns on EV are still mid-pack',
  blocks: [
    { p: `Aditya Birla Sun Life Insurance (ABSLI, 51% with Sun Life) wrote ₹24,779 cr of gross premium in FY26 and has ₹1.17 lakh cr of policyholder assets. Individual first-year premium grew 20% in Q1FY27 (private sector 15%). The big change is margin: net VNB margin 15.1% in Q1FY27 vs 7.5% a year earlier (20.6% for FY26) as non-par, protection and annuity products and riders replaced ULIPs. Embedded value was ₹15,447 cr at March 2026 (+12%); operating return on EV was 13.2%, but a ₹934 cr negative economic variance (bond yields) and ₹750 cr of new capital sat in the walk. Management targets 20%+ growth in individual premium and >20% margins for three years, and to double VNB in that time.` },
    { pair: [
      { type: 'column', title: 'VNB: ₹369 cr (FY22) to ₹1,055 cr (FY26)', unit: 'Net value of new business (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'VNB', values: [369, 800, 697, 818, 1055], fmt: 'num' }], labels: 'all', source: 'Q4FY23-Q4FY26 presentations' },
      { type: 'hbar', title: 'Listed life insurers: price ÷ Mar-26 EV on 30-Sep-2026', unit: 'x; operating RoEV FY26 in brackets', x: [`SBI Life (${LIFE.SBILIFE.roev}%)`, `HDFC Life (${LIFE.HDFCLIFE.roev}%)`, `ICICI Pru Life (${LIFE.ICICIPRULI.roev}%)`, `ABSLI at our multiple (13.2%)`], series: [{ name: 'P/EV', values: [LIFE.SBILIFE.pev, LIFE.HDFCLIFE.pev, LIFE.ICICIPRULI.pev, S.life.multiple.base].map(v => Math.round(v * 100) / 100), fmt: 'x' }], labels: 'all', highlight: 'ABSLI at our multiple (13.2%)', source: 'Company EV disclosures (Apr-May 2026), NSE closes, GAM Research' },
    ] },
    { callout: `**Valuation:** ${S.life.multiple.base}x Mar-27E EV (₹${n0(ev[1])} cr, after 14% operating growth and July's ₹950 cr rights issue) for 51% = ₹${n0(part('life').perShare)} a share. The listed insurers trade at ${n2(X.pevPerRoev)}x EV per point of operating RoEV (median); at ABSLI's 13.2% that is ${lifeDerived}x. They have de-rated ${n0(Math.abs(lifeDr))}% against their five-year median P/EV (HDFC Life ${n1(pevMed.HDFCLIFE)}x, SBI Life ${n1(pevMed.SBILIFE)}x then). The street uses 1.3-1.5x Mar-28E EV.` },
  ],
};

const health = {
  id: 'health', nav: 'Health insurance', kicker: 'Health insurance', title: 'Health insurance: the fastest-growing SAHI, still not making money',
  blocks: [
    { p: `Aditya Birla Health Insurance (ABHI) is a standalone health insurer (SAHI) built around a "health first" model that rewards healthy behaviour with premium refunds. Sales GWP was ₹7,292 cr in FY26 (+39%) and ₹2,196 cr in Q1FY27 (+50%), taking its SAHI share to 16.2%. It moved to IFRS from April 2026: profit ₹61 cr in FY26 and ₹18 cr in Q1FY27, with a combined ratio of 105-106%. ABCL owns 45.9%; Momentum (MMI) 44.1% and ADIA 10.0% (ADIA paid ₹665 cr for 9.99% in 2022, a post-money value of ₹6,650 cr).` },
    { exhibit: { type: 'table', title: 'ABHI against listed health insurers', head: ['', 'GWP FY26 (₹ cr)', 'Combined ratio FY26', 'Price ÷ GWP (30-Sep-2026)'], rows: [
      ['Star Health', n0(HEALTH.STARHEALTH.gwp), `${HEALTH.STARHEALTH.cor}% (Ind AS)`, `${n2(HEALTH.STARHEALTH.pg)}x`],
      ['Niva Bupa', n0(HEALTH.NIVABUPA.gwp), `${HEALTH.NIVABUPA.cor}% (IFRS)`, `${n2(HEALTH.NIVABUPA.pg)}x`],
      ['**ABHI (our multiple)**', n0(gwp[0]), '105% (IFRS)', `**${S.health.multiple.base}x FY27E GWP**`],
    ], source: 'Star Health and Niva Bupa FY26 disclosures (Apr-Jul 2026); NSE closes; Q1FY27 presentation p65' } },
    { callout: `**Valuation:** listed SAHIs trade at ~${n2(healthPeerPg)}x premium; ABHI grows faster but loses money on underwriting, so we apply a one-third discount: ${healthDerived}x FY27E GWP (₹${n0(gwp[1])} cr) for 45.9% = ₹${n0(part('health').perShare)} a share. Motilal Oswal uses 1.0x GWP. Every 0.1x is ~₹${n1(gwp[1] * 0.1 * S.health.stake / 100 / sharesNow)} a share.` },
  ],
};

module.exports = { hfc, amc, life, health };
