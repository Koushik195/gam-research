// Dr. Reddy's report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./DRREDDY.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, BL, n0, n1, price, HA, MULT, epsSep, rating, buyBelow, sellAbove, medTp, peFY27, peFY28, peSep, taxRows, mv } = X;
const eps = epsSep.base;
const streetSep = (X.avgEps('FY28E') + X.avgEps('FY29E')) / 2, upPp = 2.5, epsUp = [1, 2].map(i => F.eps[i] + F.sales[i] * upPp / 100 * (1 - taxRows[i].rate / 100) / F.shares), tpUp = Math.round(MULT.base * (epsUp[0] + epsUp[1]) / 2 / 10) * 10;
const usdQ = 10 * 4 * BL.fx[1] / 10 * 0.5 * (1 - taxRows[1].rate / 100) / F.shares; // EPS per US$10 mn a quarter at ~50% contribution

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a good branded business between two windfalls, priced about right; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** a diversified generics company with a growing branded franchise in India, Russia and 40+ emerging markets, the #2 nicotine-replacement brand outside the US, in-house peptide chemistry, a first-to-file US pipeline, a biologics plant that has just passed its first FDA approval, net cash and a strong independent board. Also: a US base that has not grown in four years, a semaglutide launch that stumbled, abatacept that is still a regulatory event away, heavy working capital and recurring "one-off" charges.' },
    { callout: `**What you are paying:** ${n1(peFY27)}x our FY27E and ${n1(peFY28)}x FY28E EPS (${n1(peSep)}x Sep-28E). Dr. Reddy's own forward P/E since 2021 has a median of ${n1(HA.med)}x on EPS before one-offs; pharma trades ~8% above its five-year medians. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}), close to the post-Q1 street median of ₹${n0(medTp)}: ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low-Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%`],
      ['Semaglutide back on time with 6-7 mn pens in Nov-26 to Mar-27 and Brazil approved', 'Medium', 'Re-validation result (late Sep-2026), restart in Nov, Q3-Q4 pen volumes, Canada share vs Apotex'],
      ['Abatacept approved at the Dec-2026 goal date with no re-inspection', 'Medium', 'FDA action; first-quarter uptake; SC filing'],
      ['US base growing double digits ex-lenalidomide as guided', 'Medium', 'Quarterly US$ sales above US$250 mn after bosutinib exclusivity ends'],
      ['A value-accretive acquisition of the ~₹3,000 cr net cash', 'Low-Medium', 'Price paid vs the 11.6% cost of equity'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Semaglutide re-validation fails or slips again; Canada prices fall as generics multiply', 'Low-Medium (management: 10-20% failure odds)', `FY27E EPS ~₹${n1(BL.memo.semaglutideRs[0] * 0.6 * 0.76 / F.shares)} lower; our bear case`],
      ['Abatacept FDA queries, re-inspection or a slow launch', 'Medium', 'FY28-29E EPS 5-10% lower'],
      ['US price erosion and the tariff on generics', 'Medium', `Each US$10 mn a quarter of lost US sales at ~50% contribution is ~₹${n1(usdQ)} of FY28E EPS`],
      ['USFDA action at a key site (Bachupally biologics, Srikakulam, Vizag API)', 'Low-Medium', 'Launch delays; remediation costs'],
      ['Russia: sanctions, rouble, slower growth than the market', 'Medium', 'EM is 20% of revenue; Russia ~10% (₹3,480 cr in FY26)'],
      ['More write-offs of in-licensed or R&D assets; value-destroying M&A', 'Medium', 'Reported EPS below our before-one-offs base'],
      ['Pharma sector de-rates back to its medians', 'Medium', `At ${MULT.bear}x (bear multiple) on base EPS the stock is worth ~₹${n0(Math.round(MULT.bear * eps / 10) * 10)}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to SELL if the price rose above ~₹${n0(sellAbove)} (upside below −5%) and to BUY below ~₹${n0(buyBelow)}** on today's numbers, or sooner if semaglutide and abatacept both arrive on time and margins track management's guidance.`,
      `**This is mostly an earnings call, not a multiple call.** Our ${MULT.base}x is in line with the street's 20-23x; our FY28E EPS (₹${n1(F.eps[1])}) is ~12% below the post-Q1 average because we assume lower margins and later launches. On the street's average EPS (FY28E ₹${n1(X.avgEps('FY28E'))}, FY29E ₹${n1(X.avgEps('FY29E'))} from the ${X.nEps('FY29E')} notes that give it) and our multiple, the stock would be worth ~₹${n0(Math.round(MULT.base * streetSep / 10) * 10)}.`,
      `**Biggest swing factors:** the multiple (each 1x is ~₹${n0(eps)} a share), semaglutide volumes and abatacept timing. The bull-bear range ({{scen.bear.tp|inr}} to {{scen.bull.tp|inr}}) is wide because the history behind the multiple is wide (25th-75th percentile ${n1(HA.p25)}-${n1(HA.p75)}x).`,
      `**Where we could be wrong:** if the base business really runs at ~20% IFRS margin (management) rather than our ~17% equivalent, FY28E EPS would be ~₹${n1(epsUp[0])} and the target ~₹${n0(tpUp)} (${Math.round((tpUp / price - 1) * 100)}% upside), close to BUY territory.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'North America, Q1FY27', v: 'US$236 mn', d: 'US$400 mn a year earlier (lenalidomide)' },
      { k: 'India growth, Q1FY27', v: '+17%', d: 'IPM +13.5% (MQT); 15.5% organic' },
      { k: 'EBITDA margin, Q1FY27 (IFRS)', v: '12.5%', d: '15.4% before the semaglutide provision' },
      { k: 'Price ÷ our Sep-28E EPS', v: `${n1(peSep)}x`, d: `median since 2021: ${n1(HA.med)}x (forward, before one-offs)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Generic / gRevlimid', 'A copy of a drug whose patent has expired or been settled. gRevlimid = generic lenalidomide (Revlimid), sold under settlements that capped volumes until Jan-2026.'],
      ['Limited-competition windfall', 'Profits from a generic sold with only a few competitors, which disappear when competition arrives. Not a one-off accounting item, so it stays in the reported history (PLAYBOOK §7c).'],
      ['Shelf-stock adjustment (SSA)', 'A credit given to wholesalers for stock they hold when a product\'s price falls; Dr. Reddy\'s took ₹453 cr for lenalidomide in Q4FY26.'],
      ['ANDA / NDA / 505(b)(2) / Para IV / FTF', 'US filings: ANDA for a generic; NDA for a new drug; 505(b)(2) for a new form of an existing drug. Para IV challenges a patent; first-to-file (FTF) can earn 180 days of exclusivity.'],
      ['Biosimilar / BLA / PLI', 'A near-copy of a biological drug (e.g. abatacept, rituximab); approved through a Biologics Licence Application after a Pre-License Inspection of the plant.'],
      ['Semaglutide / GLP-1', 'Novo Nordisk\'s diabetes and obesity molecule (Ozempic, Wegovy, Rybelsus), part of the GLP-1 class; generic versions launched in India and Canada in 2026.'],
      ['API / PSAI / CDMO / DMF', 'Active pharmaceutical ingredient; Dr. Reddy\'s segment that sells APIs and services; contract development and manufacturing; Drug Master File (a filing that lets customers reference the API).'],
      ['NRT', 'Nicotine replacement therapy (gums, patches, lozenges): Nicotinell and other brands bought from Haleon.'],
      ['IPM / MAT / MQT', 'Indian pharmaceutical market; moving annual / quarterly total (IQVIA sales data).'],
      ['USFDA Form 483, VAI, OAI', 'A 483 lists inspection observations. VAI = voluntary action indicated (minor), OAI = official action indicated (can block approvals).'],
      ['IFRS vs Ind AS', 'Dr. Reddy\'s reports to investors under IFRS (EBITDA incl. other operating income and forex, before impairments); Indian statements and Screener use Ind AS (our model basis).'],
      ['EBITDA (our basis)', 'Screener\'s operating profit: revenue less operating costs including impairments, before all other income, interest, D&A and tax.'],
      ['One-offs / EPS before one-offs', 'Large unusual gains or charges (SSA, impairments, settlements, divestment gains). We derive the multiple on EPS before them (A18 practice).'],
      ['Forward P/E / Sep-28E', 'Share price ÷ next full year\'s EPS. Sep-28E = half FY28E + half FY29E, the earnings the market looks at in a year.'],
      ['Sector factor', 'How far pharma peers trade above or below their own five-year median P/E (+8.2% for Dr. Reddy\'s, PLAYBOOK §7c).'],
      ['EV/EBITDA, DCF, Ke', 'Enterprise value ÷ EBITDA; discounted cash flow; cost of equity (risk-free rate + beta × equity risk premium).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitdaMargin@FY20': '−643bp to 14.1%: ₹1,677 cr of impairments (IFRS five-year summary, AR FY24) inside Screener EBITDA.',
  'ebitdaMargin@FY17': '−561bp to 17.4%: US price erosion and the Nov-2015 USFDA warning letter on three plants held back launches (AR FY17); revenue −9%.',
  'pat@FY17': '−39%: the warning-letter years (AR FY17).',
  'pat@FY18': '−27%: US price erosion and channel consolidation; the warning letter still restricted launches (AR FY18).',
  'ebitdaMargin@FY19': '+411bp to 20.6%: cost and procurement savings and a recovery in launches (AR FY19).',
  'pat@FY19': '+106%: margin recovery off a low FY18.',
  'ebitdaMargin@FY21': '+620bp to 20.3%: impairments fell from ₹1,677 cr (FY20) to ₹859 cr (IFRS five-year summary, AR FY24) and costs were contained in the pandemic year.',
  'ebitdaMargin@FY22': '−285bp to 17.5%: price erosion in US and European generics, higher costs, ₹756 cr of impairments (AR FY22).',
  'sales@Q2FY25': '+16% YoY: gRevlimid at its peak and new launches.',
  'sales@Q3FY25': '+16% YoY: NRT consolidated from 1-Oct-2024 (completed 30-Sep-2024).',
  'sales@Q4FY25': '+20% YoY: NRT plus gRevlimid; the last strong US quarter before the cliff began.',

  'pat@FY22': '₹2,182 cr after ₹756 cr of impairments (IFRS five-year summary); ₹2,927 cr before one-offs (MOSL).',
  'sales@FY23': '+14.5%: generic Revlimid launched under volume-limited settlements; North America +36%.',
  'ebitdaMargin@FY23': '+870bp to 26.2%: the gRevlimid windfall.',
  'pat@FY23': '+107%: gRevlimid plus one-off gains (₹545 cr pre-tax, MOSL).',
  'ebitdaMargin@FY24': '28.3%: peak windfall margin.',
  'sales@FY25': '+16.5%: NRT from Oct-2024 and the last full gRevlimid year; North America US$1.72 bn.',
  'sales@FY26': '+3.2%: North America −22% (lenalidomide, ₹453 cr SSA) offset by Europe +55% (NRT), India +16%, EM +23%.',
  'ebitdaMargin@FY26': '19.2% after ₹1,106 cr of SSA, VAT, labour-code and impairment items (22.1% before them).',
  'otherIncome@FY26': '₹1,372 cr incl. ₹189 cr brand divestment gain, ₹140 cr litigation settlement and ₹177 cr forex gains.',
  'pat@FY26': '−26%: ₹4,196 cr attributable; Q4FY26 only ₹221 cr.',
  'sales@FY27E': '+4.2%: no lenalidomide; bosutinib and sugammadex launches; ~₹1,500 cr of semaglutide from Nov-2026; India +15%, EM +17%.',
  'ebitdaMargin@FY27E': 'Q1 10.6% (₹240 cr semaglutide provision, Middle East costs); recovery in H2 with semaglutide.',
  'pat@FY27E': `Down ~${Math.round((1 - F.pat[0] / X.A.pat[X.b]) * 100)}% on lower margins; Q1FY27 was ₹444 cr.`,
  'ebitdaMargin@FY28E': 'Full year of semaglutide; abatacept launch; SG&A flat in nominal terms.',
  'pat@FY28E': `+${Math.round((F.pat[1] / F.pat[0] - 1) * 100)}% off the FY27 trough.`,
  'otherIncome@FY28E': 'Rises with the cash the engine builds (no acquisitions modelled).',
  'pat@FY29E': 'Abatacept SC launch and semaglutide volumes; EPS back above FY26 but below FY25.',
};

module.exports = { risks, glossary, statementNotes };
