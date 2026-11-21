// M&M Finance report, part 5: ownership (Jun-2026), management and governance, forecasts vs the street,
// street view and critiques.
const X = require('./M&MFIN.ctx');
const { C, D, F, A, fin, fi, n0, n1, n2, pc, price, ST, CONS, SE, tpHi, tpLo, feeCutEps28, b, Q1 } = X;
const OW = D.ownership, GV = C.governance, J = OW.jun25;

const ownership = base => ({
  ...base,
  blocks: [
    { p: `In Jun-2026 Mahindra & Mahindra held ${OW.promoterGroup}% (it took up more than its entitlement in the June-2025 rights issue, lifting its stake from 52.16%). Domestic institutions held ${OW.dii}% (mutual funds ${OW.mutualFunds}%, insurers and others ${OW.otherDii}%), foreign investors only ${OW.fii}%, and retail and others ${OW.public}%. The company names its ten largest public holders without stakes: ${OW.topPublic.replace(/^.*?: /, '')} The register is unusual for a large NBFC: foreigners own less than a tenth, so the marginal buyer is a domestic fund, and LIC sits on the board through a nominee director.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Shareholding, 30-Jun-2026 vs a year earlier', head: ['Holder', 'Jun-2025', 'Jun-2026', 'Change (pp)'], rows: [
      ['Promoter (Mahindra & Mahindra)', `${J.promoterGroup.toFixed(2)}%`, `${OW.promoterGroup.toFixed(2)}%`, n2(OW.promoterGroup - J.promoterGroup)],
      ['Foreign institutions', `${J.fii.toFixed(2)}%`, `${OW.fii.toFixed(2)}%`, n2(OW.fii - J.fii)],
      ['Domestic institutions', `${J.dii.toFixed(2)}%`, `${OW.dii.toFixed(2)}%`, n2(OW.dii - J.dii)],
      ['– of which mutual funds', 'n.d.', `${OW.mutualFunds.toFixed(2)}%`, '–'],
      ['Public and others', `${J.public.toFixed(2)}%`, `${OW.public.toFixed(2)}%`, n2(OW.public - J.public)],
      ['Number of shareholders', n0(OW.shareholders.jun25), n0(OW.shareholders.jun26), '–'],
    ], source: 'BSE shareholding pattern via Screener.in; Q1FY27 presentation p46; Prabhudas Lilladher (22-Jul-2026) for the mutual-fund split' } },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a strong parent and a new team, two conduct blots in four years',
  blocks: [
    { p: `M&M Finance is run by Raul Rebello (MD & CEO since 30-Apr-2024, succeeding Ramesh Iyer) with Pradeep Kumar Agrawal as CFO (since Mar-2025). The chairman is Dr Anish Shah, Group CEO of Mahindra & Mahindra, who draws no pay from the company. The board in FY26 had ten directors: the CEO, three M&M executives, an LIC nominee and five independent directors. ${GV.auditors}.` },
    { verdicts: [
      ['Promoter and group', 'Strong', 'Mahindra & Mahindra owns 52.5%, took up extra rights in 2025, and its name supports the AAA rating; M&M executives chair the board.', 'Funding and brand support; the group decides strategy.'],
      ['Management quality', 'Improving', 'Digital rebuild (Udaan) completed; credit cost inside the band for two years; Q1FY27 ROA 2.4%. New CEO and CFO since 2024-25.', 'Execution since 2024 has been good; the track record is short.'],
      ['Guidance reliability', 'Weak', 'Vision 2025 (2022) met one of four main targets; no annual guidance now, only bands and FY31 aims.', 'Discount long-term aims; watch the bands.'],
      ['Conduct and controls', 'Watch', 'RBI barred outsourced recovery in Sep-2022 after a death during a repossession; Aizawl branch fraud (FY24) through staff collusion.', 'Both fixed; both show the risk of a 1,300-branch rural network.'],
      ['Related parties', 'Moderate', `${Q1.mAndMShare}% of the book finances Mahindra vehicles; trade advances to dealers; MIBL sells motor insurance in the M&M ecosystem.`, 'Commercial terms, says management ("strategic partner", not captive); disclosed.'],
      ['Pay', 'Moderate', 'CEO pay 97.85x the median employee (+51% in FY26); CFO 106x incl. stock options; median pay +13%.', 'High rise in a year of 19% profit growth.'],
      ['Capital allocation', 'Mixed', 'Three equity raises since FY18 (₹8,196 cr); 36% payout; EPS only 17% above FY19.', 'Growth has been funded by shareholders more than by retained returns.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'Annual Report FY26 (directors\' report, remuneration annexure, corporate governance report); RBI press release (Sep-2022); company calls' },
    { callout: '**Our view:** governance risk is moderate. The Mahindra parent is a genuine strength (funding, brand, patient ownership) and the current team is competent and candid. The blots (the 2022 recovery incident and the 2024 fraud) are what a deep rural network can produce when controls lag growth; both led to fixes. We would not pay a governance premium, and we would not apply a discount.' },
  ],
};

const cmpRow = (...cells) => cells;
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ${pc(F.epsGrowth[0])} in FY27E, then ${pc(F.epsGrowth[1])} as fees and leverage bite; ROE ~12.5-13.4%`,
  blocks: [
    { exhibit: { type: 'table', title: 'Key forecasts (consolidated)', x: 'fin.labels', from: 'FY24', to: 'FY29E', rowsRef: [
      { name: 'Group AUM (₹ cr)', ref: 'fin.aum', fmt: 'num' }, { name: 'AUM growth (%)', ref: 'fin.aumGrowth', fmt: 'pct' }, { name: 'Net interest income (₹ cr)', ref: 'fin.nii', fmt: 'num' },
      { name: 'NIM on AUM (%)', ref: 'fin.nim', fmt: 'pct' }, { name: 'Fees & other operating income (₹ cr)', ref: 'fin.feeIncome', fmt: 'num' }, { name: 'Cost-to-income (%)', ref: 'fin.costToIncome', fmt: 'pct' },
      { name: 'Pre-provision profit (₹ cr)', ref: 'fin.ppop', fmt: 'num' }, { name: 'Credit cost (% avg AUM)', ref: 'fin.creditCost', fmt: 'pct' }, { name: 'Net profit (₹ cr)', ref: 'fin.pat', fmt: 'num', hl: true },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2', hl: true }, { name: 'EPS growth (%)', ref: 'fin.epsGrowth', fmt: 'pct' }, { name: 'DPS (₹)', ref: 'fin.dps', fmt: 'n2' }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' },
      { name: 'ROA on total assets (%)', ref: 'fin.roa', fmt: 'pct' }, { name: 'ROE (%)', ref: 'fin.roe', fmt: 'pct', hl: true },
    ], source: 'Company, Screener.in; GAM estimates. FY26 DPS ₹7.50; we model a 36% payout. FY26 EPS ₹20.54 consolidated (standalone ₹20.35).' } },
    { p: `FY27E EPS growth of {{F.epsGrowth.0|pct}} comes from a lower credit cost ({{fin.creditCost.11|pct}} → {{F.creditCost.0|pct}} of AUM; FY26 carried the ₹217 cr overlay), 14% AUM growth and a stable margin. It does not need Q1's pace: Q1 profit was ₹927 cr (consolidated), and our FY27E of ₹{{F.pat.0|num}} cr needs ~₹${n0((F.pat[0] - 927) / 3)} cr a quarter for the rest of the year (${pc(((F.pat[0] - 927) / 3 / 927 - 1) * 100)} vs Q1), allowing for monsoon-related losses in H2. FY28E growth slows to {{F.epsGrowth.1|pct}}: our IRDAI fee cut (~₹${n1(feeCutEps28)} of EPS), 10bp dearer funding and rising leverage squeeze the margin.` },
    { exhibit: { type: 'table', title: 'Our estimates vs the street (estimates standing on 30-Sep-2026)', head: ['Metric', 'GAM (consolidated)', 'Emkay (standalone)', 'Prabhudas Lilladher (standalone)', 'Motilal Oswal'], rows: [
      cmpRow('FY27E EPS (₹)', '{{F.eps.0|n2}}', n1(SE.emkay.eps.FY27E), n1(SE.pl.eps.FY27E), '–'),
      cmpRow('FY28E EPS (₹)', '{{F.eps.1|n2}}', n1(SE.emkay.eps.FY28E), n1(SE.pl.eps.FY28E), '–'),
      cmpRow('FY29E EPS (₹)', '{{F.eps.2|n2}}', n1(SE.emkay.eps.FY29E), '–', '–'),
      cmpRow('FY28E book per share (₹)', '{{F.bvps.1|n1}}', n1(SE.emkay.bvps.FY28E), `${n0(SE.pl.abv.FY28E)} (adjusted)`, '–'),
      cmpRow('FY28E ROE (%)', '{{F.roe.1|pct}}', `${n1(SE.emkay.roe.FY28E)}%`, `${n1(SE.pl.roe.FY28E)}%`, `${n1(SE.mosl.roe.FY28E)}%`),
      cmpRow('FY28E ROA (%)', '{{F.roa.1|pct}}', `${n1(SE.emkay.roa.FY28E)}%`, `${n1(SE.pl.roa.FY28E)}%`, `${n1(SE.mosl.roa.FY28E)}%`),
      cmpRow('FY27E / FY28E AUM growth', '{{F.aumGrowth.0|pct}} / {{F.aumGrowth.1|pct}}', `${SE.emkay.aumGrowth.FY27E}% / ${SE.emkay.aumGrowth.FY28E}%`, `${SE.pl.aumGrowth.FY27E}% / ${SE.pl.aumGrowth.FY28E}%`, SE.mosl.aumCagr),
      cmpRow('FY27E / FY28E credit cost', '{{F.creditCost.0|n2}}% / {{F.creditCost.1|n2}}% of AUM', `${SE.emkay.creditCost.FY27E}% / ${SE.emkay.creditCost.FY28E}%`, `${SE.pl.creditCost.FY27E}% / ${SE.pl.creditCost.FY28E}%`, '–'),
    ], source: 'Emkay (22-Jul-2026), Prabhudas Lilladher (22-Jul-2026), Motilal Oswal (22-Sep-2026). Brokers are standalone: FY26 standalone EPS ₹20.35 and book ₹178 vs consolidated ₹20.54 and ₹192. No consensus EPS available to us (gap).' } },
    { callout: `**Where we differ:** we are in line with the street on FY27E and well below it on FY28E (by ${pc((F.eps[1] / SE.pl.eps.FY28E - 1) * 100)} vs Prabhudas Lilladher and ${pc((F.eps[1] / SE.emkay.eps.FY28E - 1) * 100)} vs Emkay). Three reasons: the IRDAI fee cut (which came after every note in this table), a credit cost that stays ~1.75% of AUM through the monsoon damage, and margin pressure from rising leverage. Our book value is close to the street's because our base is consolidated; the gap is in ROE: {{F.roe.1|pct}} vs 13-15%.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: mostly Buy, targets ₹${n0(tpLo)}-${n0(tpHi)}, on hopes of a 15% ROE`,
  blocks: [
    { p: `After Q1FY27 (21-Jul-2026) brokers turned more positive: Emkay upgraded to Buy (₹450, 1.9x FY28E standalone book plus subsidiaries), HSBC upgraded to Buy (₹410, 1.8x FY28E book), Motilal Oswal kept Buy (₹405, then ₹430 at 2.0x Mar-28E book after a site visit on 22-Sep), ICICI Securities (₹415), Nomura (₹415), JM Financial (₹410, top pick) and IDBI Capital (₹404) are Buys, and Prabhudas Lilladher is Accumulate (₹380, sum of the parts). The sceptics are Jefferies (Hold, ₹365) and Macquarie (Underperform, ₹270). The median target was ₹${n0(CONS.medianTp)}, ${pc((CONS.medianTp / price - 1) * 100)} above the 30-Sep price. All targets except Motilal Oswal's and Emkay's reiteration predate the September sell-off, and all predate IRDAI's proposal and the end-of-season monsoon numbers. Five of the ten targets come from press reports rather than the notes themselves (see sources).` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: [
      ['A weak monsoon / El Niño is the key FY27 risk to growth and asset quality', 'Prabhudas Lilladher, Jefferies', 'Agree: the season ended ~13% short; we keep credit cost at 1.75% of AUM and do not assume the overlays are released.'],
      ['Wheels growth stuck at ~12% despite the tech spend', 'Citi analyst on the Q1 call', 'Agree: we model ~11% wheels growth and 14-15% for the group.'],
      ['End losses still 1.2-1.4% of assets; credit cost helped by provisioning', 'Kotak analyst on the Q1 call; GAM', 'Agree: overlays and ECL refreshes have moved profit in each of the last three years.'],
      ['Insurance commission at regulatory risk', 'Emkay analyst on the Q1 call; IRDAI (23-Sep)', `Agree: we take ~₹${n1(feeCutEps28)} off FY28E EPS.`],
      ['Udaan transformation drives productivity and growth', 'Motilal Oswal, ICICI Securities (Sep-2026)', 'Agree it is real (flat headcount, faster turnaround); it shows up in growth and opex, not yet in a step-change in ROE.'],
      ['Structurally low returns; stays an Underperform', 'Macquarie', 'Partly agree: returns are improving but around the cost of equity; at ~1.4x forward book the price is fair, not stretched.'],
    ], source: 'Broker notes, call transcript (21-Jul-2026) and press, 22-Jul to 24-Sep 2026; GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
