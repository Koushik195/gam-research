// Aurobindo Pharma report, part 4: Europe; Growth Markets, ARV and APIs (incl. the Pen-G/PLI plant and the China plant);
// biosimilars (CuraTeQ) and the biologics CMO (TheraNym).
const X = require('./AUROPHARMA.ctx');
const { C, F, n0, n1, rup, Q1, FY26, SQ, QL, BL, lines, YRS, share } = X;
const BETA = [791, 837, 722, 789, 633, 668, 686, 772, 800], NONBETA = [301, 319, 284, 280, 283, 292, 277, 436, 250]; // API split by quarter (presentations)

const europe = {
  id: 'europe', nav: 'Europe', kicker: 'Segment: Europe formulations (31% of revenue)', title: `Europe: EUR1bn, growing ~10% a year, margin now above 20%`,
  blocks: [
    { p: `Europe is the part of Aurobindo that has improved most. Built from Actavis's Western European businesses (2014), Generis in Portugal (2017) and Apotex's businesses in five countries (2019), it passed EUR1bn of sales in FY26 (EUR${FY26.europeEurMn}mn, +9% in euros) and grew 11% in constant currency in Q1FY27 to EUR${Q1.europeEurMn}mn. Management says its EBITDA margin has risen from single digits three to four years ago to above 20%, by replacing third-party suppliers with Aurobindo's own plants in India and, increasingly, China (10+ products already transferred) and by cutting costs. Europe is also the first market for Aurobindo's biosimilars, sold directly and through STADA and Orion. Antibiotics, a large part of the basket, sell more in the autumn-winter flu season.` },
    { pair: [
      { type: 'column', title: 'Europe in euros: EUR221mn to EUR267mn a quarter in two years', unit: 'Europe formulations revenue (EUR mn)', x: QL, series: [{ name: 'Europe', values: SQ.map(q => q.europeEur), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'column', title: 'In rupees Europe grew 26% in Q1FY27: the euro did more than half the work', unit: 'Europe formulations revenue (₹ crore)', x: QL, series: [{ name: 'Europe', values: SQ.map(q => q.europe), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
    ] },
    { callout: `**Our view:** we model EUR${BL.europeEurMn.join(' / ')}mn for FY27-29E (+10% / +8.5% / +7.5%), in line with management's double-digit FY27 guidance and slowing as the low-hanging captive-supply gains are used up; at an assumed ₹${BL.fxEur.join(' / ')} per euro that is ₹${lines.europe.map(n0).join(' / ')} cr, ~${n1(share('europe', 2))}% of FY29E revenue. Europe is the steadiest earnings stream in the group: tender prices are low but rarely collapse the way US prices do.` },
  ],
};

const growth = {
  id: 'growth', nav: 'Growth Markets, ARV, APIs', kicker: 'Segments: Growth Markets (10%), ARV (4%) and APIs (12%)', title: 'Growth Markets, ARV and APIs: the Pen-G plant and the China plant are finally earning',
  blocks: [
    { p: `**Growth Markets** ($${FY26.gmUsdMn}mn in FY26, $${Q1.gmUsdMn}mn in Q1FY27) covers Canada, Brazil, South Africa, Indonesia, China and India; Q1 grew 38% in rupees, helped by the Khandelwal brands bought for ₹325 cr in Jan-2026 (India) and new markets such as Indonesia and China. India is still tiny (₹104 cr of sales in Q1). **ARV** ($${FY26.arvUsdMn}mn in FY26, $${Q1.arvUsdMn}mn in Q1) sells HIV medicines into donor-funded tenders; FY26 was boosted by tender wins and Q1 was flat. **APIs** (₹${n0(FY26.api)} cr in FY26, ₹${n0(Q1.api)} cr in Q1, +${Q1.apiGrowthPct}%) are mostly penicillin and cephalosporin ingredients (beta-lactams, ₹800 cr in Q1).` },
    { pair: [
      { type: 'column', title: 'Growth Markets: $85mn to $113mn a quarter', unit: 'Growth Markets revenue (US$ mn)', x: QL, series: [{ name: 'Growth Markets', values: SQ.map(q => q.gmUsd), fmt: 'num' }], labels: 'all', source: 'Company presentations' },
      { type: 'stacked', title: 'APIs: beta-lactams recovering as Pen-G output rises', unit: 'API revenue (₹ crore)', x: QL, series: [{ name: 'Beta-lactam', values: BETA, fmt: 'num' }, { name: 'Non beta-lactam', values: NONBETA, fmt: 'num' }], minLabel: 200, source: 'Company presentations' },
    ] },
    { h: 'The Pen-G plant: India\'s bet on penicillin self-reliance' },
    { p: 'Aurobindo spent ₹3,058 cr on a fermentation plant at Kakinada (Lyfius Pharma, with 6-APA at Qule Pharma) to make Penicillin-G and 6-APA, the starting materials for amoxicillin and other penicillins that India imported almost entirely from China. It runs under the government\'s PLI scheme, which pays ₹240 cr for every 10,000 t produced, on 15,000 t of capacity. After a slow start (42% average utilisation in FY25, an EBITDA loss of ₹200 cr+ in FY26) output reached ~11,300 t annualised in March-2026 and 800-900 t a month since; the business turned EBITDA positive in Q4FY26 and gross margin rose as Aurobindo stopped importing. On 29-Jan-2026 India set a one-year minimum import price on Pen-G (₹2,216/kg), amoxicillin and 6-APA, and imports have dropped. Management says it aims to be profitable "irrespective of the MIP or PLI".' },
    { exhibit: { type: 'table', title: 'Pen-G and China: from losses to profits', head: ['', 'Pen-G / 6-APA (Kakinada)', 'China OSD (Taizhou)'], wide: [1, 2], rows: [
      ['Investment', '₹3,058 cr (AR FY26)', 'Not disclosed separately'],
      ['Capacity / output', '15,000 t; 800-900 t a month (~10,000-11,000 t annualised)', '2bn+ tablets; ~500mn+ in FY26, doubled in Q1FY27'],
      ['FY26 EBITDA', 'Loss of ₹200 cr+ (FY26); positive in Q4FY26', 'Loss of ~US$7mn'],
      ['FY27 outlook', 'PLI ₹240 cr per 10,000 t (claim filed); MIP to Jan-2027; external 6-APA sales started', 'EBITDA positive; low double-digit margin targeted; 10 EU and 3 local approvals; US supplies starting'],
      ['Risk', 'MIP lapses and Chinese prices fall; PLI paid late', 'Geopolitics; slow approvals'],
    ], source: 'AR FY26; Q3FY26, Q4FY26 and Q1FY27 calls; DGFT notification 56/2025-26' } },
    { callout: `**Our view:** these three businesses are where the FY27 margin improvement comes from. We model Growth Markets at $${BL.gmUsdMn.join(' / ')}mn, ARV at $${BL.arvUsdMn.join(' / ')}mn (tenders drift lower) and APIs at +${BL.apiGrowth.join(' / +')}%. The risk is policy: if the minimum import price is not renewed in Jan-2027 and Chinese penicillin prices fall again, Pen-G profits would shrink to the PLI subsidy.` },
  ],
};

const BS = C.biosimilars, TN = C.theranym;
const biosimilars = {
  id: 'biosimilars', nav: 'Biosimilars & biologics CMO', kicker: 'Option: biosimilars (CuraTeQ) and biologics manufacturing (TheraNym)', title: 'Biosimilars and the MSD plant: real progress, small revenue before FY29',
  blocks: [
    { p: rup(`**Biosimilars (CuraTeQ).** Aurobindo has invested ~US$450mn since 2018 (capex and R&D). Approved: ${BS.approved}. Filed: ${BS.filed}. Later: ${BS.later}. Partners: ${BS.partners}. Guidance: ${BS.guidance}. The CEO describes the start as "modest, steady and measured": European oncology biosimilars are sold through tenders with 10-11 competitors, so Aurobindo aims for small shares at low cost rather than 15-20% of a market; omalizumab (a ~$4bn molecule with three serious rivals) is the first product where it expects to be in the first wave.`) },
    { p: rup(`**Biologics contract manufacturing (TheraNym).** ${TN.text}`) },
    { exhibit: { type: 'table', title: 'CuraTeQ biosimilar pipeline (Q1FY27)', head: ['Product', 'Molecule (reference drug)', 'Area', 'Stage'], rows: [
      ['Dyrupeg', 'Pegfilgrastim (Neulasta)', 'Oncology support', 'Launched: EMA, MHRA, Health Canada'],
      ['Zefylti', 'Filgrastim (Neupogen)', 'Oncology support', 'Launched: EMA, MHRA'],
      ['Bevqolva', 'Bevacizumab (Avastin)', 'Oncology', 'Launched: MHRA, Health Canada, CDSCO; EMA review'],
      ['Dazublys', 'Trastuzumab (Herceptin)', 'Oncology', 'Launched: EMA, MHRA, CDSCO'],
      ['Filvizy / Fugevy', 'Denosumab (Prolia / Xgeva)', 'Bone health', 'Filed: EMA, CDSCO'],
      ['Omazijev', 'Omalizumab (Xolair)', 'Respiratory', 'Phase 3 met endpoints; EMA filing Q3 2026; US filing 2026'],
      ['BP08 / BP05 / BP58', 'Tocilizumab / ranibizumab / trastuzumab SC', 'Immunology / eye / oncology', 'Filing 2027 / phase 3 / phase 1 in 2026'],
    ], source: 'Q1FY27 presentation (5-Aug-2026)' } },
    { callout: '**Our view:** both are genuine capabilities that few Indian companies have, and the MSD contract gives TheraNym an anchor customer. But they are not in our numbers in a meaningful way: biosimilar sales sit inside Europe and Growth Markets and stay small, US biosimilar revenue does not start before FY29, and the MSD plant earns from calendar 2028. Meanwhile they cost money: biosimilar R&D was ~35% of group R&D a year ago, and TheraNym Unit 2 needs US$150-180mn of capex. We treat them as upside in the bull case, not as a reason to pay a higher multiple today.' },
  ],
};

module.exports = { europe, growth, biosimilars };
