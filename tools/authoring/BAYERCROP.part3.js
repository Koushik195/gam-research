// Bayer CropScience report, part B (3 of 4): corn seed, crop protection, the parent, moat, Q1FY27 & guidance.
const S = require('./BAYERCROP.research');
const { C, D, AS, F, MIX, A21, A25, n0, n1, pc, cornCagr, cpCagr, RP, TX, Q1, SRC } = S;
const BL = AS.businessLines;
const rup = s => String(s).replace(/Rs /g, '₹');
// Business-line build (assumptions.json) must sum to model revenue.
const lines = { corn: [], cp: [] }; let cn = BL.base.corn, cp = BL.base.cropProtectionAndOther;
for (let i = 0; i < 3; i++) { cn *= 1 + BL.cornGrowth[i] / 100; cp *= 1 + BL.cropProtectionAndOtherGrowth[i] / 100; lines.corn.push(cn); lines.cp.push(cp); }
lines.corn.forEach((x, i) => { const gap = (x + lines.cp[i]) / F.sales[i] - 1; if (Math.abs(gap) > 0.005) throw new Error(`Business-line build off model revenue by ${(gap * 100).toFixed(2)}% in ${F.years[i]}`); });

const corn = {
  id: 'corn', nav: 'Corn seed (DEKALB)', kicker: 'Business line', title: 'Corn seed: the growth engine, with higher margins and tax-free seed income',
  blocks: [
    { pair: [
      { type: 'column', title: `Corn seed revenue: ~${Math.round(cornCagr)}% a year since FY21`, unit: 'Corn seed revenue (₹ crore)', x: [...MIX.map(a => a.fy), 'FY26 (~)', ...F.years], series: [{ name: 'Corn seed', values: [...MIX.map(a => a.cornSeeds), BL.base.corn, ...lines.corn.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Investor meet (FY21-25); FY26 from the BRSR 19% share (approximate); GAM estimates' },
      { type: 'column', title: 'Seed income claimed as tax-exempt agricultural income', unit: 'Implied exempt agricultural income (₹ crore)', x: ['FY25', 'FY26'], series: [{ name: 'Implied income', values: [TX.impliedExemptAgriIncome.FY25, TX.impliedExemptAgriIncome.FY26], fmt: 'num' }], labels: 'all', source: 'GAM: tax effect of agricultural income (AR FY26 note 32) ÷ 25.17% tax rate' },
    ] },
    { bullets: [
      '**Market position.** "We are the main breeders in the country," says the MD; DEKALB and Xellano hybrids came with the Monsanto India merger (2019). FY26 brought five new hybrids (DKC9256, DKC8174, 9243C, DKC9248 for spring, DKC9247), four hybrids notified by the national maize programme and eight plant-variety certificates.',
      `**Growth.** Corn revenue rose from ₹${n0(A21.cornSeeds)} cr to ₹${n0(A25.cornSeeds)} cr in FY21-25 with both volume and price (a "nearly double-digit" price increase in H1FY26). Management expects it to double again as corn demand doubles by 2030. In Q1FY27 corn "held up well" though kharif maize area was ~4% lower.`,
      `**Profitability.** Corn seed has "a slightly higher margin than the CP portfolio and carries a lower cost to serve" and is fully backward integrated except licence costs (royalty to Monsanto Technology ₹${n1(RP.royaltyMonsantoTechnology)} cr in FY26). The tax note implies ~₹${n0(TX.impliedExemptAgriIncome.FY26)} cr of income treated as agricultural in FY26, a rough proxy for seed profit (~24% of our ~₹${n0(BL.base.corn)} cr corn revenue estimate).`,
      '**Costs and risks.** Seed-grower payments doubled to ~₹541 cr in FY25 and stayed there in FY26 as more companies compete for professional growers; Bayer holds more safety stock. Duty-free US corn imports for ethanol, a GM-corn decision that favours rival trait owners, or a bad rabi season (southern reservoirs ~33% below normal) would hit this business.',
    ] },
    { callout: `**Our view:** corn is the best thing in Bayer CropScience, and the main reason we expect profit growth after FY27. We model corn revenue +${BL.cornGrowth[0]}% in FY27 (weather) and +${BL.cornGrowth[1]}% a year after; it rises to ~${Math.round(lines.corn[2] / F.sales[2] * 100)}% of revenue by FY29E. At ~19% of revenue, even 15% growth adds only ~3 points to group growth.` },
  ],
};

const cropProtection = {
  id: 'cropprotection', nav: 'Crop protection', kicker: 'Business line', title: 'Crop protection: three-quarters of revenue, market-rate growth, and a pruned portfolio',
  blocks: [
    { pair: [
      { type: 'column', title: `Crop protection ex-Roundup: ~${Math.round(cpCagr)}% a year`, unit: 'Revenue (₹ crore)', x: MIX.map(a => a.fy), series: [{ name: 'Crop protection ex-Roundup', values: MIX.map(a => a.cpExRoundup), fmt: 'num', growth: true }], source: 'Investor meet presentation (Nov-2025)' },
      { type: 'column', title: 'Dealer discounts: ~14% of the list price', unit: 'Discounts as % of contracted price', x: ['FY25', 'FY26'], series: [{ name: 'Discounts', values: [Math.round(C.fy26.revenueAdjustments.fy25.discounts / C.fy26.revenueAdjustments.fy25.contractedPrice * 1000) / 10, Math.round(C.fy26.revenueAdjustments.discounts / C.fy26.revenueAdjustments.contractedPrice * 1000) / 10], fmt: 'pct' }], labels: 'all', source: 'Annual report FY26, note 24(c)' },
    ] },
    { bullets: [
      '**Portfolio.** Insecticides, herbicides and fungicides for rice, vegetables, cotton, wheat, soybean and sugarcane; top brands named in Nov-2025: Roundup, Nativo, Laudis, Council Activ. Products launched in the last three years were ~one-sixth of FY25 crop-protection sales; Council Activ (FY23) is a top-2/3 product.',
      `**Launches.** FY26: ${C.launches.fy26CropProtection.slice(0, 6).join('; ')}. Pipeline: ${C.launches.pipeline.slice(0, 2).join('; ')}.`,
      `**Pruning.** Bayer is selling older products to focus on margin: profit on divestments ₹27 cr (FY25) and ₹22 cr (FY26), and the flubendiamide marketing rights went to Tagros Chemicals for a ₹${n1(Q1.oneOffGain)} cr gain in Q1FY27. Each sale lifts margin but shrinks revenue.`,
      '**Pricing.** In FY25 input costs rose while Chinese supply stopped Bayer raising prices ("a perfect storm"); in FY26 input prices stabilised and gross margin rose by more than 100bp in H1. Q1FY27 gained from price increases and mix.',
      '**Go-to-market.** In rice-growing eastern states, partners (Better Life Farming centres, FPOs) now serve farmers instead of Bayer\'s own field force; sales commission rose to ₹89 cr (₹21 cr in FY25) while employee costs fell.',
    ] },
    { callout: `**Our view:** this is a solid, branded, market-rate business, not a growth story. Crop protection ex-Roundup grew ~${Math.round(cpCagr)}% a year in FY21-25, in line with the market, and the company is deliberately giving up revenue for margin. We model crop protection and other revenue ${pc(BL.cropProtectionAndOtherGrowth[0])} in FY27 and ${pc(BL.cropProtectionAndOtherGrowth[1])}/${pc(BL.cropProtectionAndOtherGrowth[2])} after.` },
  ],
};

const RPA = C.relatedParty.approvalFY28;
const parent = {
  id: 'parent', nav: 'The parent', kicker: 'Parent', title: 'Bayer AG: source of the products, the margin and most of the dividend',
  blocks: [
    { p: `Six Bayer entities own 71.43%: Bayer Vapi (17.89%), Bayer Investments India (15.04%), Bayer SAS (14.73%), Bayer CropScience AG (11.91%), Bayer AG (8.43%) and Monsanto Company (3.44%); nothing is pledged. The listed company depends on the parent for new molecules, many technical ingredients, IT and regulatory support, and corn germplasm licences. Half of all purchases were from related parties in FY26 (58% in FY25). In return, the group received ₹${n0(RP.dividendsToPromoterGroup)} cr of the ₹562 cr of dividends paid in FY26.` },
    { exhibit: { type: 'table', title: 'Money flowing between BCSL and the Bayer group, FY26 (₹ crore)', head: ['Flow', 'FY26', 'Note'], wide: [2], rows: [
      ['Purchases from Bayer AG', n0(RP.purchasesFromBayerAG), `₹${n0(RP.purchasesFromBayerAGFY25)} cr in FY25; technicals and finished products, priced under Bayer's transfer-pricing policy`],
      ['Purchases from Bayer CropScience LLC (US)', n0(RP.purchasesFromBayerCropScienceLLC), `₹${n0(RP.purchasesFromBayerCropScienceLLCFY25)} cr in FY25`],
      ['Purchases from Bayer BioScience (agency sales)', n0(RP.purchasesFromBayerBioScienceGross), 'Gross; BCSL books only its margin as revenue'],
      ['Professional and support charges (Bayer AG)', n0(RP.professionalSupportChargesBayerAG), 'IT, regulatory, management services'],
      ['Royalty (Monsanto Technology, Bayer CropScience AG)', n1(RP.royaltyMonsantoTechnology + RP.royaltyBayerCropScienceAG), 'Mostly corn germplasm/technology; 0.4% of revenue'],
      ['Sales to Bayer AG and Bangladesh affiliate', n0(RP.salesToBayerAG + RP.salesToBangladeshAffiliate), 'Exports at cost plus a mark-up'],
      { hl: true, cells: ['**Dividends to the promoter group**', `**${n0(RP.dividendsToPromoterGroup)}**`, '71.4% of ₹562 cr paid (₹90 interim FY26 + ₹35 final FY25)'] },
    ], source: 'Annual report FY26, related-party note 42' } },
    { bullets: [
      `**A bigger limit for FY28.** The August 2026 AGM approved transactions with Bayer AG of up to ₹${n0(RPA.limit)} cr for FY28 (${n1(RPA.pctOfFY26Turnover)}% of FY26 turnover), including ₹${n0(RPA.purchaseOfGoods)} cr of purchases; the previous limit was ₹3,000 cr a year. The notice says the know-how and patented formulations "cannot be procured from any third party", so no bids were sought.`,
      '**Sourcing.** Management admits it buys "over-proportionally" from strong-currency countries and wants to move crop-protection sourcing towards ~50:50 India/Asia over time, but source changes need new registrations and take years.',
      '**Pipeline.** Plenexos (a new insecticide Bayer calls a "global blockbuster") and Xivana Smart are coming from the parent; short-stature corn (Preceon) waits for regulatory approval.',
      '**Parent priorities.** Bayer Crop Science\'s five-year framework asks every country to grow sales but expand margins and cash "over-proportionally"; India, a top-5/6 Crop Science country, "cannot lag behind" (MD, Nov-2025).',
    ] },
    { callout: '**Our view:** the parent is the moat and the main risk at once. Its molecules and germplasm give BCSL products Indian generic makers cannot sell, and its ~100% dividend policy returns cash to minorities too. But transfer prices decide the margin, the parent sets the pace of local sourcing, and minorities have no say on either. FY26\'s margin recovery came with purchases from Bayer AG falling 45%; whether that continues is the swing factor for our forecasts.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in corn and in the parent\'s chemistry; none on cost',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and investor meet to Sep-2026)' },
    { callout: '**Honest verdict:** Bayer CropScience has a **narrow moat**. In corn it has the best germplasm and brand in India, a lead that takes rivals years of breeding to close. In crop protection it has premium brands and first access to Bayer\'s new chemistry, but most revenue is in molecules that generics can copy, its cost base is tied to imports from the parent, and growth has only matched the market. Its high ROE comes from paying out all profit, not from compounding. That deserves a premium to Indian generic makers, not the 30x+ the stock used to command.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27 and guidance: profit up on a one-off; revenue down; the 3-5 year aspiration intact',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue', n0(Q1.revenueQ1FY26), n0(Q1.revenue), pc(Q1.revenueYoYPct)],
      ['EBITDA (Screener)', n0(Q1.ebitdaQ1FY26), n0(Q1.ebitdaScreener), pc((Q1.ebitdaScreener / Q1.ebitdaQ1FY26 - 1) * 100)],
      ['EBITDA margin', '18.2%', `${n1(Q1.ebitdaMarginScreenerPct)}%`, '+180bp'],
      ['Other income', n1(Q1.otherIncomeQ1FY26), n1(Q1.otherIncome), `incl. ₹${n1(Q1.oneOffGain)} cr one-off`],
      ['Depreciation', n0(Q1.depreciationQ1FY26), n0(Q1.depreciation), 'reason not disclosed'],
      { hl: true, cells: ['**Net profit (reported)**', '**279**', `**${n0(Q1.pat)}**`, `**${pc(Q1.patYoYPct)}**`] },
      ['Net profit excl. the one-off (GAM)', '279', n0(Q1.patExOneOff), pc((Q1.patExOneOff / 278.7 - 1) * 100)],
    ], source: 'Screener (standalone); company release (Aug-2026); GAM adjustment at 25.2% tax on the gain' } },
    { exhibit: { type: 'table', title: 'What management said (Nov-2025 investor meet) vs what happened', head: ['Topic', 'What was said', 'Outcome'], wide: [1, 2], rows: C.guidance.map(g => [g.item, rup(g.said), rup(g.outcome)]), source: C.guidanceSrc } },
    { callout: '**Why it matters:** management\'s aspiration (high-single to low-double digit growth, ~100bp a year of margin) would mean EPS growing in the low-to-mid teens. Its record is ~6% revenue growth a year since FY21, and FY27 starts with a revenue decline. We give the margin guidance credit (it was already beaten in FY26) but not the growth guidance.' },
  ],
};

module.exports = { corn, cropProtection, parent, moat, guidance, lines };
