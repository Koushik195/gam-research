// Abbott India report, part 2: what the company does, history & corporate actions, industry, tailwind test.
const X = require('./ABBOTINDIA.ctx');
const { C, D, F, A, n0, n1, SQ, QL, Q1, FY26, YRS, BL, LBL, build, ownShare } = X;
const BI = C.brandsIqvia.rows, TH = C.portfolio.therapyMixMatJul26;
const yoyQ = SQ.slice(4).map((q, i) => Math.round((q.revenue / SQ[i].revenue - 1) * 1000) / 10);

const business = {
  id: 'business', nav: 'What Abbott India does', kicker: 'The business', title: 'A 75%-owned Abbott subsidiary selling trusted brands in India: two-thirds its own portfolio, one-third Novo Nordisk\'s insulin',
  blocks: [
    { p: `Abbott India sells branded medicines in India (98.8% of revenue; exports to Sri Lanka, Nepal, Maldives and Bhutan are 1.2%). It is 75% owned by Abbott Laboratories of the US through three UK holding companies. Revenue was ₹${n0(FY26.revenue)} cr in FY26 and comes from three streams. **Own brands (~65%)**: 140+ brands across gastro and liver (Udiliv, Duphalac, Cremaffin, Digene, Creon), thyroid (Thyronorm), women's health (Duphaston, Femoston), the nervous system (Vertin, Prothiaden), vitamin D (Arachitol) and vaccines (Influvac). Several are Abbott global brands (Abbott Laboratories names Creon, Duphaston, Femoston and Influvac among its key established-pharma brands), sold under marketing rights from Abbott affiliates for which **no price or royalty is paid**. **Novo Nordisk partner brands (~35%)**: Abbott distributes Novo's insulins (Mixtard, Ryzodeg, Actrapid and others), oral semaglutide (Rybelsus) and, since Feb-2026, Extensior, a second brand of semaglutide, and keeps a distribution margin. **Services to Abbott affiliates** (₹81 cr). Abbott India owns one plant (Goa); most products are bought in, from Novo, from Abbott group companies and from contract manufacturers: traded goods were 46% of FY26 revenue.` },
    { pair: [
      { type: 'hbar', title: 'Own portfolio by therapy: gastro is almost half', unit: 'Share of own-brand secondary sales, MAT Jul-2026 (%), Pharmarack', x: ['Gastro and liver', 'Nervous system (CNS)', "Women's health", 'Thyroid, vitamins, vaccines and other'], series: [{ name: 'Share', values: [TH.gastroPct, TH.cnsPct, TH.womensHealthPct, 100 - TH.gastroPct - TH.cnsPct - TH.womensHealthPct], fmt: 'pct0' }], labels: 'all', highlight: 'Gastro and liver', source: 'BOBCAPS company update, 3-Sep-2026 (Pharmarack)' },
      { type: 'hbar', title: 'The ten largest brands it sells, three of them Novo\'s', unit: 'IQVIA MAT Jul-2026 sales at retail value (₹ crore)', x: BI.map(r => `${r.brand}${r.owner === 'Own' ? '' : ' (Novo)'}`), series: [{ name: 'MAT Jul-26', values: BI.map(r => r.jul26), fmt: 'num' }], labels: 'all', highlight: 'Thyronorm', source: 'ICICI Direct result update, 13-Aug-2026 (IQVIA)' },
    ] },
    { exhibit: { type: 'table', title: 'The franchises, and how they are doing', head: ['Franchise', 'Main brands', 'Size and growth', 'Position'], wide: [1, 2], rows: [
      ['Gastro and liver (46% of own sales)', 'Udiliv, Duphalac, Cremaffin / Cremaffin Plus, Digene, Creon, Ganaton, Colospa', `₹${n0(TH.gastroCr)} cr (Pharmarack), +${TH.gastroGrowthPct}%; Udiliv ₹759 cr IQVIA (+9%), Cremaffin Plus +20%, Ganaton +32%, but Udiliv +3% and Digene −1% on Pharmarack`, '#1 hepatoprotective (Udiliv), #4 in gastro; 7 GI brands above ₹100 cr'],
      ['Thyroid and metabolics', 'Thyronorm; Extensior (Novo\'s semaglutide, from Feb-2026)', 'Thyronorm ₹791 cr IQVIA, +12.7%', '#1 in hormones; Thyronorm range fully under price control'],
      ["Women's health (10%)", 'Duphaston, Femoston, Duvadilan, Estrabet', `₹${n0(TH.womensHealthCr)} cr, +${TH.womensHealthGrowthPct}%; Duphaston ₹421 cr IQVIA, +8.5%`, '#4 in gynaecology; dydrogesterone faces cheaper generics'],
      ['Nervous system (13%)', 'Vertin, Prothiaden, Inderal, Zolfresh', `₹${n0(TH.cnsCr)} cr, +${TH.cnsGrowthPct}%; Vertin ₹376 cr IQVIA, +18%`, '#4 in CNS; Vertin leads vertigo'],
      ['Multi-specialty and vaccines', 'Arachitol (vitamin D), Influvac, Pneumoshield 14, Havshield', 'Influvac ₹407 cr IQVIA, +25%', '#4 in vaccines; Influvac a top-50 IPM brand'],
      ['Novo Nordisk partner brands (~35% of revenue)', 'Mixtard, Ryzodeg, Actrapid, Insulatard, Novomix, Rybelsus, Extensior', 'Ryzodeg ₹738 cr (+13%); Mixtard ₹533 cr (−31%); Rybelsus ₹400 cr (−16%)', 'Distribution margin only; Novo decides the portfolio'],
    ], source: 'AR FY26 (IQVIA MAT Mar-2026 ranks); ICICI Direct 13-Aug-2026 (IQVIA MAT Jul-2026); BOBCAPS 3-Sep-2026 (Pharmarack MAT Jul-2026)' } },
    { callout: '**So what:** this is a brand-marketing company, not a drug-discovery or manufacturing one. Its edge is a set of decades-old brands that doctors trust, a field force of ~3,250 representatives (FY24) and access to Abbott\'s global portfolio at no cost. Its weak spot is that a third of revenue is someone else\'s product: Novo Nordisk is winding down older insulin formats in India and semaglutide went generic in Mar-2026, so that third is shrinking. Abbott does not split the two in its accounts, which hides how fast the own-brand business really grows (~10-11% on market data).' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From Boots (1944) to Knoll to Abbott: eight decades, one big merger (Solvay, 2011) and no dilution since',
  blocks: [
    { p: 'Abbott India began life as Boots Pure Drug Company (India) in 1944, became Knoll Pharmaceuticals when BASF bought Boots\' drug business (1995), and passed to Abbott when Abbott bought Knoll worldwide (2001; renamed in 2002). Its portfolio took its present shape in 2011, when Solvay Pharma India (bought by Abbott globally in 2010) was merged into it, bringing Duphaston, Duphalac, Creon and Influvac. Abbott\'s other big Indian purchase, Piramal\'s domestic formulations business (2010), went into Abbott Healthcare Pvt Ltd, which is unlisted and 100% owned by the parent, so Abbott runs two branded-medicine businesses in India, only one of them listed. The share count has been 2.12 cr since 2011.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.date, h.event, h.impact || '–']), source: 'Company history (goodreturns.in); AR FY26; results filing 12-Aug-2026; Medical Dialogues (Apr-2025); Abbott press release (27-Feb-2026)' } },
    { callout: '**Our read:** the listed company is a stable, slowly evolving franchise rather than a deal-maker. The structural question is the relationship with the parent and its other Indian arm: Abbott India rents offices from Abbott Healthcare (₹125 cr lease liability), provides it shared services (₹65 cr of income) and pays it conversion charges (₹69 cr). The terms are disclosed as arm\'s length, but minority holders have no say in which Abbott products go to which company.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'The Indian drug market: ₹2.57 lakh crore, growing ~10% with regulated prices; GLP-1 generics and insulin exits reshape diabetes',
  blocks: [
    { p: 'India\'s domestic formulations market was worth ₹2,565 bn at chemist prices in FY26, up 9.9% (IQVIA). Abbott\'s own description: the market "has historically delivered 8-9% growth", volume growth is "moderate at 5-6%" and pricing is "stable and regulated". Growth picked up in 2026 (Q1FY27 ~13%, partly GLP-1 launches). Three forces matter for Abbott. (1) **Price control:** medicines on the National List of Essential Medicines (NLEM) may raise prices only by the wholesale-price index each April: +0.65% from 1-Apr-2026. Others may rise up to 10% a year. (2) **Diabetes is being reshaped:** semaglutide (Ozempic, Rybelsus) went off patent on 20-Mar-2026; 20+ companies launched generics and Novo cut prices by up to 48%. Novo is also winding down cartridge and pen insulins in India, a gap Biocon, Wockhardt, Eris and Lupin are filling. (3) **Generics of old brands:** cheaper copies press on established molecules (Abbott names dydrogesterone, the molecule in Duphaston).' },
    { exhibit: { type: 'table', title: 'Industry forces and what they mean for Abbott India', head: ['Force', 'Evidence', 'Effect on Abbott'], wide: [1, 2], rows: [
      ['Market growth ~10%', 'IPM +9.9% in FY26; ~12% for Abbott\'s brands in the June quarter (IQVIA)', 'Own brands grow with the market (~10-11%), not ahead of it'],
      ['Chronic and sub-chronic shift', 'Thyroid, liver, diabetes, CNS grow faster than acute', 'Positive: Thyronorm +12.7%, Vertin +18%, Udiliv (MASLD/liver) a long runway'],
      ['Price control (NLEM/DPCO)', 'WPI-linked ceiling +0.65% in FY27; ~26% of Abbott\'s own portfolio is NLEM', 'Negative for Thyronorm\'s pricing; volume-led growth only'],
      ['GLP-1 generics', 'Semaglutide patent expiry 20-Mar-2026; Novo price cuts up to 48%', 'Rybelsus −16%; Extensior launched into a price war'],
      ['Novo insulin wind-down', 'Penfill/FlexPen formats discontinued (Apr-2025); Mixtard −31%', 'Partner revenue shrinks; low margin, so profit impact is small'],
      ['Adult vaccination and preventive care', 'Influvac +25%, a top-50 brand; low adult vaccination coverage', 'Positive, but seasonal and competitive (trivalent switch, pricing)'],
      ['Trade generics and e-pharmacy discounting', 'Generic dydrogesterone; Abbott is not in trade generics (MD, 2022)', 'Pressure on mature brands (Duphaston +6%, Digene −1%)'],
    ], source: 'IQVIA via Mankind AR FY26; AR FY26 MD&A; NPPA order S.O. 1575(E); Business Today (31-Mar-2026); Medical Dialogues (Apr-2025); ICICI Direct and BOBCAPS (Aug-Sep 2026)' } },
    { callout: '**So what:** Abbott India plays in the slow-but-steady part of Indian pharma: chronic and sub-chronic therapies with trusted brands. The market will keep growing ~10%. The two industry shifts that touch Abbott most, GLP-1 generics and Novo\'s insulin exit, both land on the partner third of its revenue, where Abbott has little control and earns little margin.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does market growth reach Abbott India? Its own brands grow with the market; reported revenue lags because of the Novo third',
  blocks: [
    { p: `For years Abbott grew at or above the market. FY26 revenue rose 8.1% against IPM growth of 9.9%, and Q1FY27 only 4.3% against ~12% IQVIA growth for its own brands. The difference is mostly the partner business: Novo's discontinued insulin formats and the fall in Rybelsus after semaglutide generics. The own portfolio is healthier: +10% on Pharmarack (MAT Jul-26) and ~+11% in Q1FY27, with CNS +15%, gastro +8% and women's health +8%. But that is market growth, not outperformance: the biggest brands (Udiliv, Digene, Duphaston) grow below the market.` },
    { pair: [
      { type: 'column', title: 'Reported revenue growth slowed to 4% in Q1FY27', unit: 'Revenue growth year on year (%), company', x: QL.slice(4), series: [{ name: 'Revenue growth', values: yoyQ, fmt: 'pct' }], labels: 'all', highlight: 'Q1FY27', source: 'Company results' },
      { type: 'column', title: 'Own portfolio by therapy: CNS accelerating, gastro slowing', unit: 'Secondary sales growth by MAT July (%), Pharmarack', x: ['Gastro', "Women's health", 'CNS'], series: [{ name: 'MAT Jul-24', values: [9.4, 0.5, 3.0], fmt: 'pct' }, { name: 'MAT Jul-25', values: [10.6, 6.5, 6.7], fmt: 'pct' }, { name: 'MAT Jul-26', values: [8.3, 7.6, 15.5], fmt: 'pct' }], labels: 'all', source: 'BOBCAPS company update, 3-Sep-2026 (Pharmarack; ₹ values give these growth rates)' },
    ] },
    { exhibit: { type: 'table', title: 'Tailwind scorecard', head: ['Tailwind', 'Reaches Abbott?', 'Evidence'], wide: [2], rows: [
      ['Market growth back in double digits', '**Partly**', 'Own brands ~+10-11%; reported revenue +4% because partner brands fell'],
      ['Chronic and sub-chronic therapies', '**Yes**', 'Thyronorm +12.7%, Vertin +18%, Ryzodeg +13%; CNS +15%'],
      ['GLP-1 / diabetes', '**Not yet**', 'Extensior launched one month before generics; Rybelsus −16%'],
      ['Preventive care and vaccines', '**Yes**', 'Influvac +25% (MAT Jul-26)'],
      ['Consumer / OTC switch', '**Weak**', 'Digene −1%, Cremaffin +7% (Pharmarack); Digene Insta launched FY26'],
      ['Pricing', '**No**', 'NLEM ceiling +0.65% for FY27; 26% of own portfolio controlled'],
      ['New launches', '**Partly**', '5 launches in FY26 (Combinorm Plus, Digene Insta, Duphalac Rapid, Extensior, Ezybixy); 75 planned over five years'],
    ], source: 'AR FY26; ICICI Direct 13-Aug-2026 (IQVIA); BOBCAPS 3-Sep-2026 (Pharmarack)' } },
    { callout: `**Verdict:** the market tailwind reaches the own-brand two-thirds at about market pace and misses the partner third. We model own brands at +${BL.growth.own.join('% / +')}% and partner brands at ${BL.growth.partner.map(g => (g > 0 ? '+' : '') + g + '%').join(' / ')} for FY27-29E, so total revenue grows +{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}} and own brands rise from ~65% to ~${Math.round(ownShare(2))}% of revenue. The street (+8% for FY27E) assumes the partner business stabilises sooner.` },
  ],
};

module.exports = { business, history, industry, tailwind };
