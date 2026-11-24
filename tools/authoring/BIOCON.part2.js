// Biocon report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./BIOCON.ctx');
const { C, D, F, A, AS, n0, n1, pc, rup, b, rev, ebs, revTot, SEGH, BL } = X;
const sh = (k, i) => rev[k][i] / revTot[i] * 100;
const F26 = C.fy26;

const business = {
  id: 'business', nav: 'What Biocon does', kicker: 'The business', title: 'Three businesses: biosimilars make the money, generics fill the plants, Syngene is a listed stake',
  blocks: [
    { p: `Biocon has three operating businesses and a small investment. **Biosimilars** (Biocon Biologics; ₹${n0(F26.segExternal.biosimilars)} cr of FY26 external revenue, 61%) are near-copies of biologic drugs: insulins (glargine, aspart, human insulin), cancer antibodies (trastuzumab, bevacizumab, pegfilgrastim), immunology (adalimumab, etanercept, ustekinumab), bone health (denosumab) and eye care (aflibercept). About 40% of biosimilar sales are in North America, 35% in Europe and 25% in emerging markets (CFO, Q4FY26 call). **Generics** (₹${n0(F26.segExternal.generics)} cr, 17%) are mostly APIs (60-67%: statins, immunosuppressants, peptides) plus finished pills and injectables in the US, Europe and emerging markets, incl. the GLP-1 liraglutide. **Research services** are Syngene (₹${n0(F26.segExternal.services)} cr of external revenue, 22%), a listed contract research and manufacturing company in which Biocon owns 52.4%. Biocon also holds 5.52 mn shares (~10%) of Bicara Therapeutics, a Nasdaq-listed cancer-drug developer.` },
    { pair: [
      { type: 'hbar', title: 'FY26 revenue: biosimilars 61%', unit: '% of FY26 external revenue', x: ['Biosimilars', 'Research services (Syngene)', 'Generics'], series: [{ name: 'Share', values: [61.3, 21.8, 16.9], fmt: 'pct' }], labels: 'all', highlight: 'Biosimilars', source: 'AR FY26 note 40' },
      { type: 'hbar', title: 'FY26 revenue by geography: the US is 47%', unit: '% of FY26 revenue from operations', x: ['United States', 'European Union', 'Rest of world', 'India'], series: [{ name: 'Share', values: [47.2, 27.3, 20.1, 5.4], fmt: 'pct' }], labels: 'all', highlight: 'United States', source: 'AR FY26 note 40 (geographical segments)' },
    ] },
    { exhibit: { type: 'table', title: 'The businesses at a glance', head: ['Business', 'FY26 revenue', 'FY26 EBITDA before other income', 'Q1FY27', 'What drives it', 'Our FY27E-29E growth'], wide: [4], rows: [
      ['Biosimilars (BBL)', `₹${n0(F26.segExternal.biosimilars)} cr (+16%)`, `₹${n0(F26.segEbitdaExOI.biosimilars)} cr (24.7%)`, 'Revenue ₹2,855 cr (+16%); EBITDA ₹728 cr (25%, company basis)', 'Launches (aflibercept, denosumab, aspart, ustekinumab, bevacizumab), US payer contracts, Malaysia insulin capacity; price erosion on old products', BL.growth.biosimilars.map(g => `+${g}%`).join(' / ')],
      ['Generics', `₹${n0(F26.segExternal.generics)} cr (+17% like for like)`, `₹${n0(F26.segEbitdaExOI.generics)} cr (1.5%)`, 'Revenue ₹760 cr (+21%); EBITDA ₹56 cr (7%)', 'API pricing, utilisation of new plants (Vizag, Hyderabad, Bengaluru, Cranbury), GLP-1 launches', BL.growth.generics.map(g => `+${g}%`).join(' / ')],
      ['Research services (Syngene, 52.4%)', `₹${n0(F26.segExternal.services)} cr (+3%)`, `₹${n0(F26.segEbitdaExOI.services)} cr (24.9%)`, 'Revenue ₹736 cr (−16%); 12% operating margin', 'Discovery and development services for global pharma (BMS contract to 2035); one large biologics client cut offtake', BL.growth.services.map(g => `${g > 0 ? '+' : ''}${g}%`).join(' / ')],
      { hl: true, cells: ['**Group**', `**₹${n0(A.sales[b])} cr**`, `**₹${n0(A.ebitda[b])} cr (Screener)**`, '**Revenue ₹4,336 cr (+10%); EBITDA ₹847 cr**', 'Unallocated costs ~₹72 cr a year', `**${F.salesGrowth.map(g => `+${n1(g)}%`).join(' / ')}**`] },
    ], source: 'AR FY26 note 40 (external revenue; EBITDA = total revenue less segment costs); Q1FY27 press release and call; GAM estimates' } },
    { callout: `**So what:** Biocon is a biosimilars company with two attachments. Biosimilars earn ~90% of segment EBITDA after corporate costs in our FY28E build (₹${n0(ebs.biosimilars[1])} cr of ₹${n0(F.ebitda[1])} cr consolidated), generics only start to matter if their margins reach the low teens, and Syngene is best valued at its own share price. That is why the street, and we, value Biocon as a sum of the parts.` },
  ],
};

const HIST = [
  ['1978', 'Kiran Mazumdar-Shaw founds Biocon (enzymes) in Bengaluru with Biocon Biochemicals of Ireland.', 'Origins in fermentation: still the base of insulin, peptides and statins.'],
  ['2004', 'IPO; India\'s first recombinant human insulin (Insugen).', 'Start of the biologics journey.'],
  ['2009', 'Biosimilars partnership with Mylan (now Viatris) for insulins and antibodies.', 'Mylan sold, Biocon made: half the profit went to the partner.'],
  ['2015', 'Syngene listed; Biocon owned 74.5% at Mar-17 (52.4% now after sell-downs: 70.4% Mar-22, 54.9% Mar-23, 52.5% Mar-25).', 'Stake sales funded the biosimilars build-out.'],
  ['2017-21', 'First US biosimilar trastuzumab (Ogivri, approved 2017), pegfilgrastim (Fulphila, 2018), first interchangeable insulin glargine (Semglee, 2021).', 'US market share 20-25% in oncology biosimilars, held since.'],
  ['2021-22', 'Serum Institute Life Sciences, Tata Capital, Activ Pine and others take BBL shares; Goldman Sachs, Kotak and Edelweiss later fund structured instruments.', 'Minorities in BBL; structured instruments later to be redeemed.'],
  ['Nov-2022', 'BBL buys Viatris\'s biosimilars business: up to $3.335 bn ($2.335 bn cash + $1 bn BBL preference shares).', 'Revenue +37% in FY23 and +32% in FY24; $1.2 bn of debt; interest ₹68 cr (FY22) → ₹974 cr (FY24); Viatris owns part of BBL.'],
  ['FY24-25', 'Bicara Therapeutics raises capital and lists on Nasdaq (Sep-2024); Biocon sells its India branded formulations business (two units in FY24, the rest by slump sale in Q1FY25).', 'One-off gains: ₹530 cr (Bicara) and ₹350 cr in FY24; ₹1,057 cr in FY25. Reported EPS ₹8.5 / ₹8.4 flattered.'],
  ['Oct-2024', 'BBL refinances acquisition loans with $800 mn 6.67% notes and a $320 mn syndicated loan.', 'Maturities pushed to FY29-30; ₹122 cr write-off of old fees.'],
  ['Jun-2025', 'QIP: ₹4,500 cr at ₹330.', 'Structured debt (Goldman, Kotak, Edelweiss) retired; ~₹300 cr a year of interest saved; +11% shares.'],
  ['Dec-2025 to Jan-2026', 'Full integration of BBL: Viatris paid $400 mn cash + 9.2 cr Biocon shares; Serum, Tata Capital, Activ Pine swapped into 7.9 cr Biocon shares; QIP ₹4,150 cr at ₹368.35.', 'BBL 98.7% owned at Mar-26; minorities gone; shares 133.7 cr → 162.1 cr; FY26 exceptional costs ₹403 cr (pre-tax).'],
  ['Apr-2026', 'One company ("OneBiocon"): Shreehas Tambe (BBL CEO) becomes Biocon CEO; Siddharth Mittal moves to run Syngene.', 'Cost synergies visible in Q1FY27 opex; not yet quantified.'],
  ['May-2026', 'The founder names her niece Claire Mazumdar (Bicara CEO) as eventual successor as chair over ~5 years.', 'Succession clarity, but a family pick from outside the operating business.'],
  ['Jun-2026', 'Last 0.8% of BBL acquired for 8.79 mn shares; BBL wholly owned from 29-Jun-2026.', '162.97 cr shares; no minorities left outside Syngene.'],
];

const history = {
  id: 'history', nav: 'History', kicker: 'History & corporate actions', title: 'From enzymes to biosimilars, then a debt-funded leap (Viatris) and a share-funded clean-up (FY26)',
  blocks: [
    { p: 'Biocon\'s history has two halves. For 40 years it was an organic builder: fermentation, then insulin, then biosimilars developed with Mylan, which sold them in the West. In 2022 it bought Mylan\'s (Viatris\'s) biosimilars business to sell its own products, and paid for it with debt and with a stake in Biocon Biologics. FY26 undid the complexity: two share issues and a share swap retired the structured debt and bought out every minority investor in BBL. The business is now simpler and less leveraged, but shareholders own a 36% smaller slice of each rupee of profit than in March 2025.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: HIST, source: 'Company press releases and presentations; AR FY25/FY26 (Board\'s report, secretarial audit, notes 22, 32, 39); Fierce Pharma (9-Dec-2025); Business Standard (15-Jan-2026); Deccan Herald (5-May-2026)' } },
    { callout: '**The pattern to remember:** Biocon\'s value has been created in the labs and plants, and diluted in the capital structure. Each step (Syngene stake sales, BBL minority rounds, the Viatris debt, the QIPs) funded growth that per-share earnings have not yet shown. FY27 is the first year with no new layer of claims between the business and the shareholder.' },
  ],
};

const IND = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Biosimilars: a growing, regulated, deflating market where scale and reliability matter more than science',
  blocks: [
    { h: 'What makes biosimilars different from generics' },
    { p: rup(IND.biosimilars[0]) },
    { p: rup(IND.biosimilars[1]) },
    { h: 'The US: the prize, and the hardest market' },
    { p: `${rup(IND.biosimilars[4])} The US accounts for ~47% of Biocon's group revenue (AR FY26 note 40). Its biosimilars market has two channels: hospital ("Part B", medical-benefit) drugs such as oncology antibodies and denosumab, where prices are set by average selling prices and fall as competitors win share; and pharmacy drugs such as insulin, ustekinumab and adalimumab, where access depends on formularies run by three big benefit managers. Biocon's management says it prefers margin over share: "market share and ASP have always been inversely proportional" (CEO, Q4FY26 call).` },
    { exhibit: { type: 'table', title: 'US launch wave: Biocon\'s seven US growth products', head: ['Product', 'US addressable market (CY2025)', 'US launch', 'Status at 30-Sep-2026'], wide: [3], rows: [
      ['Ustekinumab (Yesintek)', '~$8 bn', 'Feb-2025', 'Close to a fifth of the US biosimilar segment (IQVIA, Feb-26); good formulary wins'],
      ['Denosumab (Bosaya / Aukelso)', '~$7 bn', 'Apr-2026', 'Launched in both channels (pharmacy and medical benefit); "ramping"'],
      ['Aflibercept (Yesafili)', '~$6 bn', 'Aug-2026', 'Interchangeable; launched under a settlement; one biosimilar already has high share'],
      ['Bevacizumab', '~$5 bn', 'Oct-2025', '>$100 mn globally before the US; Brazil leader'],
      ['Insulin aspart (Kirsty)', '~$3 bn', 'Sep-2025', '100% share in closed-door networks; commercial formularies from 2HFY27'],
      ['Liraglutide (generic)', '~$1 bn', 'H1 CY2026', 'Launched Q1FY27; "single digits" of generics revenue'],
      ['Semaglutide (generic)', '~$34 bn', 'DMF filed', 'US patents run into the 2030s; filed in Canada and Brazil'],
    ], source: 'June-2026 investor presentation slide 21 (market sizes and launch timing; product order as we read the slide); Q4FY26 and Q1FY27 calls' } },
    { h: 'Policy: friendlier rules, more competition' },
    { p: `${rup(IND.biosimilars[2])} ${rup(IND.biosimilars[3])}` },
    { h: 'Insulin, generics and research services' },
    { p: `${rup(IND.biosimilars[5])} ${rup(IND.generics[0])} ${rup(IND.generics[1])}` },
    { p: rup(IND.services[0]) },
    { callout: '**So what:** biosimilars are a better business than pill generics (fewer rivals, slower price falls, sticky hospital contracts) but not a monopoly: every big molecule now has five to ten biosimilars, and the FDA is making entry cheaper. The winners will be the companies that make reliably at low cost and launch early; Biocon is one of a handful with the scale to do both.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the biosimilar boom reach Biocon? Yes in volume, less in price, and not yet per share',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Is it real?', 'Does it reach Biocon?', 'Evidence'], wide: [3], rows: [
      ['Loss of exclusivity of big biologics (Stelara, Prolia/Xgeva, Eylea, Keytruda later)', 'Yes', 'Yes', 'Biocon launched ustekinumab (Feb-25), denosumab (2026) and aflibercept (Aug-26) in the US; pertuzumab filed; pembrolizumab and nivolumab in the pipeline (June-2026 presentation)'],
      ['US policy push for biosimilars (no phase-3, easier interchangeability)', 'Yes', 'Mixed', 'Halves Biocon\'s development cost (CEO) but lowers the barrier for rivals, incl. Chinese insulin makers'],
      ['Insulin access (CalRx, price caps)', 'Yes', 'Yes', 'Only US biosimilar insulin maker; glargine share ~11% and rising; Civica/CalRx partnership; Malaysia capacity doubling'],
      ['Weak rupee', 'Yes (FY27)', 'Yes, in rupees', 'Q1FY27 biosimilars +16% in rupees, ~+5% in constant currency; the dollar debt also costs more in rupees'],
      ['GLP-1 generics', 'Yes', 'Small so far', 'Liraglutide US launch; semaglutide filings outside the US; many rivals'],
      ['CRDMO outsourcing (China+1, US BIOSECURE debate)', 'Yes', 'Not now', 'Syngene revenue −16% in Q1FY27 on one client; FY27 a "transition year"'],
    ], source: 'Company calls and presentations to Aug-2026; GAM Research' } },
    { p: `The volume tailwind is real: biosimilar revenue grew from ₹${n0(SEGH.FY24.ext.biosimilars)} cr in FY24 to ₹${n0(SEGH.FY26.ext.biosimilars)} cr in FY26 and we forecast ₹${n0(rev.biosimilars[2])} cr in FY29E (${n1(sh('biosimilars', 2))}% of revenue). The price tailwind is not: management tells investors to "budget for some erosion" (CFO, Q4FY26) and will not chase share at the expense of margin. And the per-share tailwind has been absorbed by the capital structure (see History).` },
    { callout: '**Verdict:** the sector tailwind reaches Biocon\'s revenue and EBITDA; whether it reaches the shareholder depends on margins in the US launches and on debt repayment, both of which only start to show from the second half of FY27.' },
  ],
};

module.exports = { business, history, industry, tailwind };
