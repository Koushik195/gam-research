// Natco Pharma report, part 3b: India and international (the base business) and the Adcock Ingram associate.
const X = require('./NATCOPHARM.ctx2');
const { C, SA, SQ, QL, F, BL, OB, FY26, Q1, n0, n1, pc, assocPct, taxRows } = X;
const dom = SA.map(a => a.domestic), g = (a, b) => (b / a - 1) * 100;

const intl = {
  id: 'base-business', nav: 'India & international', kicker: 'The base business', title: 'The base business: Brazil is the star, India gets a semaglutide lift, Canada is steady; together ~₹1,900 cr growing mid-teens',
  blocks: [
    { p: `**India (domestic formulations).** ₹${n0(FY26.segments.domestic)} cr in FY26, +${n1(g(400, FY26.segments.domestic))}%; ₹${n0(Q1.domestic)} cr in Q1FY27 (+27%; the base runs ~₹107 cr a quarter, semaglutide and third-party orders did the rest). Natco is a pioneer in branded cancer generics in India (top 3 in the segments it operates in; 10 brands above ₹10 cr), plus hepatology (Velpanat), cardiology (Apigat close to #2 in prescriptions) and diabetology. It launched the first generic semaglutide vial in Mar-2026; the brand sells ~₹2 cr a month and, with partners Eris and Glenmark, adds ~₹4 cr a month to sales. The CEO: "As of now, it doesn't lose money, but it doesn't make much money either." We model +22% / +13% / +12%.` },
    { p: `**Brazil.** ₹${n0(FY26.segments.brazil)} cr in FY26 and ₹178 cr in Q1FY27 alone (+180%), from oncology launches (carfilzomib, eltrombopag, apixaban) and being the single source of everolimus in Brazil for the fourth year running. Management guided US$55-60 mn for FY27; we use ₹${n0(BL.brazil[0])} cr, then ₹${n0(BL.brazil[1])} / ${n0(BL.brazil[2])} cr. Brazil sales are tender-driven, so quarters swing; tax there is above 35%.` },
    { p: `**Canada.** ₹${n0(FY26.segments.canada)} cr in FY26 (the subsidiary alone ₹229 cr); a top-10 generic company in Canada with the highest market share in lenalidomide and oseltamivir; ₹56 cr in Q1FY27. Guided +10-15%, with "a couple of big launches" in FY28. We model ₹${n0(BL.canada[0])} / ${n0(BL.canada[1])} / ${n0(BL.canada[2])} cr. **Rest of world** (MENA tenders in Saudi Arabia, Algeria, Egypt; Asia; first launches in China): ~₹314 cr in FY26 by difference; we grow it 8-10% a year.` },
    { pair: [
      { type: 'column', title: 'India: flat for years, now growing with semaglutide', unit: 'Domestic formulations (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'Domestic formulations', values: dom, fmt: 'num' }], labels: 'all', source: 'AR FY24 segment table; Q1FY27 presentation' },
      { type: 'column', title: `Base exports (Brazil, Canada, RoW): ₹${n0(FY26.segments.brazil + FY26.segments.canada + 314.3)} cr in FY26, ₹${n0(BL.brazil[2] + BL.canada[2] + BL.row[2])} cr in FY29E`, unit: '₹ crore (FY26 actual; GAM estimates)', x: ['FY26', ...F.years], series: [{ name: 'Brazil', values: [FY26.segments.brazil, ...BL.brazil], fmt: 'num' }, { name: 'Canada', values: [FY26.segments.canada, ...BL.canada], fmt: 'num' }, { name: 'Rest of world', values: [314.3, ...BL.row], fmt: 'num' }], labels: 'none', source: 'AR FY26 MD&A; GAM estimates' },
    ] },
    { callout: `**So what:** India, Brazil, Canada and the rest of the world made ~₹${n0(FY26.segments.domestic + FY26.segments.brazil + FY26.segments.canada + 314.3)} cr of revenue in FY26 and should reach ~₹${n0(BL.domestic[2] + BL.brazil[2] + BL.canada[2] + BL.row[2])} cr by FY29E. That is the steady part of Natco. It is good growth, but at a mid-20s margin it earns perhaps ₹350-500 cr of EBITDA: far from the ₹2,196 cr of FY25.` },
  ],
};

const adcock = {
  id: 'adcock', nav: 'Adcock Ingram (49%)', kicker: 'The South African associate', title: `Adcock Ingram: ~₹3,140 cr for 49% of South Africa's #2 drug maker; ${n1(assocPct[0])}% of our FY27E profit, but not Natco's to control`,
  blocks: [
    { p: `${C.adcock.text}` },
    { exhibit: { type: 'table', title: 'The two Adcock purchases', head: ['', 'Nov-2025', 'Jul-2026', 'Total'], rows: [
      ['Stake bought', '34.88% (35.75% incl. existing 0.87%)', '13.25%', '49%'],
      ['Price', 'ZAR3,873 mn (₹1,991 cr) + ₹88 cr costs', 'ZAR1.81 bn (~US$111 mn, ~₹1,060 cr)', '~₹3,140 cr'],
      ['Implied value of 100%', 'US$618 mn (US$4.27 a share)', '~US$840 mn (our arithmetic)', ''],
      ['Funding', 'Cash; ₹400 cr term loan in FY26', 'Cash and loans (SBI, IndusInd, Bajaj Finance)', 'Rights issue to repay ₹810.5 cr'],
      ['Accounting', 'Associate (equity method) from 11-Nov-2025; goodwill ₹649 cr inside the ₹2,276 cr carrying value', 'Same; purchase-price amortisation ~₹10-15 cr a year', ''],
    ], source: 'AR FY26 note 41 and MD&A; Q1FY27 call and presentation; rights-issue terms (25-Sep-2026). Implied 100% value for July = US$111 mn / 13.25%.' } },
    { exhibit: { type: 'table', title: 'Adcock Ingram and Natco\'s share (₹ crore unless stated)', head: ['', 'FY24 (Jun YE)', 'FY25 (Jun YE)', 'FY26 (Jun YE)', 'Q1FY27 (Apr-Jun 26)', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Adcock revenue (US$ mn)', '531', '549', '592', `₹${n0(Q1.adcockRevenue)} cr`, '–', '–', '–'],
      ['Adcock profit after tax', 'US$45 mn', 'US$48 mn', 'US$57 mn', n0(Q1.adcockPat), n0(OB.adcockPat[0]), n0(OB.adcockPat[1]), n0(OB.adcockPat[2])],
      ['Natco stake', '–', '–', '35.75% from Nov-25', '35.75%', '35.75% → 49%', '49%', '49%'],
      { hl: true, cells: ['**Natco\'s share of profit**', '–', '–', '₹46.6 cr (FY26, Natco year)', `**${n1(Q1.assocShare)}**`, `**${OB.assoc[0]}**`, `**${OB.assoc[1]}**`, `**${OB.assoc[2]}**`] },
      ['Share of Natco PAT', '–', '–', '3%', '41%', `${n1(assocPct[0])}%`, `${n1(assocPct[1])}%`, `${n1(assocPct[2])}%`],
    ], source: 'Q1FY27 presentation (Adcock FY24-26 in US$), AR FY26 Chairman\'s message, Q1FY27 call (CFO: profit "normally... around INR 100 crores per quarter"), Q4FY26 call (FY27 guidance US$47-48 mn PAT); GAM estimates (otherIncomeBuild).' } },
    { p: 'Is it a good deal? On cost, Natco paid ~₹3,140 cr for a profit share we put at ₹215-235 cr a year from FY28E: about 14x earnings, or a ~7% return, which the CEO himself called "only slightly better than bank interest" (29-May-2026). The case rests on synergies: Natco\'s pipeline sold through Adcock\'s South African sales force (three dossiers filed; products ~2028) and Adcock\'s links into other African markets. The risks: Natco cannot set Adcock\'s dividend or strategy (Bidvest holds 51% and wants to keep it), the rand is volatile, and the second tranche was bought at a ~35% higher valuation than the first.' },
    { callout: '**Accounting note:** Adcock was delisted from the JSE in the scheme that let Natco in, so it is **not a listed stake** and the 30-Sep market-value-less-20% rule (PLAYBOOK §7c) does not apply. We value it through Natco\'s EPS (its profit share is in our P/E) and, in the EV/EBITDA and DCF cross-checks, at book value inside net cash.' },
  ],
};

module.exports = { intl, adcock };
