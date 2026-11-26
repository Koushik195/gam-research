// Concord Biotech report, part 3: the API business and formulations & injectables (plants and regulators in part3b).
const X = require('./CONCORDBIO.ctx2');
const { n0, n1, SA, SQ, LINES, YRS, FY26, FY25, Q1, C, mixPct } = X;
const P3b = require('./CONCORDBIO.part3b');
const apiG = SA.map((s, i) => (i ? Math.round((s.api / SA[i - 1].api - 1) * 1000) / 10 : null));

const api = {
  id: 'api', nav: 'APIs', kicker: 'Segment: APIs', title: 'APIs: ₹829 cr in FY26 (−12%), +42% in Q1FY27; growth is now coming from oncology and anti-infectives, and from lower prices',
  blocks: [
    { p: `API revenue grew from ₹761 cr (FY23) to ₹940 cr (FY25), then fell 12% to ₹${n1(FY26.api)} cr in FY26: management says volumes fell and prices were flat ("there has been no price growth for us... it has been primarily on the basis of volume", Q4FY26 call). Q1FY27 API revenue rose 42% to ₹${n1(Q1.api)} cr. The growth was "broad-based": every therapy grew by double digits, with oncology and anti-infectives "much, much more" than immunosuppressants, helped by new products (Nystatin, launched in FY25, and fusidic acid, launched in FY26), new customers and FY26 orders spilling over.` },
    { pair: [
      { type: 'column', title: 'API revenue: ₹761 cr (FY23) to ₹940 cr (FY25), ₹829 cr (FY26)', unit: 'API revenue (₹ crore)', x: [...SA.map(s => s.fy), ...YRS], series: [{ name: 'APIs', values: [...SA.map(s => s.api), ...LINES.api.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company decks; GAM estimates FY27-29E' },
      { type: 'column', title: 'Quarterly API revenue: Q4FY25 ₹362 cr, Q1FY26 ₹154 cr, Q1FY27 ₹219 cr', unit: 'API revenue (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'APIs', values: SQ.map(q => q.api), fmt: 'num' }], labels: 'all', source: 'Company decks and calls (Q2FY26 derived)' },
    ] },
    { h: 'Concentration: by therapy high, by customer moderate' },
    { p: `**By therapy**, Concord is concentrated: immunosuppressants were 74% of FY26 API revenue and 58% of total revenue (ICRA, 23-Sep-2026), and its key products are tacrolimus, mycophenolate mofetil and mycophenolate sodium (ICRA). At the IPO the top five molecules were a large share of revenue; management declined to update that figure on the Q4FY26 call ("last year would not be a right year to look into what the top 5 molecules has contributed"). **By customer**, it is diversified: 300+ customers, the top ten ${FY26.top10Pct}% of revenue (down from 48.2% in FY21) and none above 10%.` },
    { h: 'Price erosion: the honest picture' },
    { p: `Concord does not disclose prices by molecule, so we rely on management's words. On mature products "there is always a little bit of price that to certain customers could be there, which gets compensated by the newer regions" (Q4FY26 call). New products enter "as a second source" with "an aggressive price". And Q1FY27's wallet-share gains at existing customers were "primarily driven by pricing": Concord uses its scale (1,250 m³) to undercut competitors while "still able to maintain our healthy profitability margins". Gross margin (78.9% in Q1FY27, 76.7% in FY26) has not shown erosion yet; the rupee (~10-12% weaker) added ~3-5 points to Q1FY27 growth. Our reading: volume growth bought with price is a sound strategy for a low-cost producer, but it caps the margin upside.` },
    { exhibit: { type: 'table', title: 'API drivers in our forecast', head: ['Driver', 'FY26 / Q1FY27 evidence', 'Our assumption'], wide: [1, 2], rows: [
      ['Base immunosuppressants', 'Grew in Q1FY27 but slower than the rest; mature generics', 'Mid-to-high single-digit volume, flat to slightly lower prices'],
      ['Oncology, anti-infectives, antifungals', 'Faster growth; Nystatin and fusidic acid ramping (fusidic acid awaits an EU CEP)', 'The bulk of API growth'],
      ['Launches', '2-3 new products a year targeted; 8-10 in the pipeline, 2-3 in oncology', 'One or two a year, small at first'],
      ['CDMO (third-party IP)', '1-2% of revenue; aim for double digits; one more project expected in FY27', 'Not modelled separately; inside API growth'],
      ['Capacity', 'Unit I ~80%, Unit III ~55% utilised; ₹2,200-2,300 cr API potential', 'No API capacity constraint before FY29'],
    ], source: 'Q4FY26 and Q1FY27 calls; ICRA; GAM Research' } },
    { callout: `**Our forecast:** APIs +20% / +16% / +15% in FY27-29E to ₹${n0(LINES.api[2])} cr (~${Math.round(mixPct('api')[2])}% of revenue). FY27 needs Q2-Q4 API revenue of ₹${n0(X.apiQ2to4Need)} cr vs ₹${n0(X.apiQ2to4Prev)} cr a year earlier (+${Math.round((X.apiQ2to4Need / X.apiQ2to4Prev - 1) * 100)}%), after Q1's +42%. API growth was ${apiG.slice(1).map(g => `${g > 0 ? '+' : ''}${n1(g)}%`).join(', ')} in FY24-26.` },
  ],
};

const formulations = {
  id: 'formulations', nav: 'Formulations & injectables', kicker: 'Segment: formulations', title: 'Formulations: ₹226 cr in FY26 and −23% in Q1FY27; the injectable plant and the US front end are costs waiting for revenue',
  blocks: [
    { p: `Concord began making finished doses in FY2016 at Valthera to use its own APIs (backward integration). Formulation revenue grew from ₹92 cr (FY23) to ₹260 cr (FY25, +38%), then fell 13% to ₹${n1(FY26.formulations)} cr in FY26 and 23% to ₹${n1(Q1.formulations)} cr in Q1FY27. The fall is mostly geopolitics: a Middle East government tender (~₹25 cr of formulations) has been on hold since Q3FY26, the US Veterans Affairs tender (~₹25 cr) was not finalised, and some Middle East buyers switched to buying Concord's API (longer shelf life) instead of tablets. Management says that excluding the Middle East its domestic divisions (nephrology and critical care) grew by double digits.` },
    { exhibit: { type: 'table', title: 'The three new businesses', head: ['Business', 'Status at 30-Sep-2026', 'Cost / revenue', 'What has to happen'], wide: [1, 3], rows: [
      ['Injectables (Unit IV, Valthera)', 'Commercial since Mar-2025; WHO-GMP; ~5% utilised; own brands made in-house; third-party audits done', '~₹38-39 cr a year of costs (FY26); ₹600 cr peak revenue potential', 'Contract-manufacturing wins in H2FY27; emerging-market approvals (12-15 months); breakeven "probably in the next financial year"'],
      ['Stellon Biotech Inc. (USA, 75%)', 'Licences obtained; first US sales in Q1FY27; markets Concord and in-licensed products', '~₹10 cr of costs (FY26), loss ₹7.2 cr after tax', 'US ANDAs (7 approved, incl. mycophenolate mofetil and tofacitinib in Q1FY27) turn into sales'],
      ['Soft gel and topical lines', 'Soft gel commercialised in FY26; a small topical facility in FY27', 'Part of FY27 capex', 'Fill Unit II (25-30% utilised)'],
    ], source: 'Q4FY26 and Q1FY27 calls; AR FY26 AOC-1; Q3FY26 call' } },
    { pair: [
      { type: 'column', title: 'Formulations: ₹92 cr (FY23) to ₹260 cr (FY25), then ₹226 cr', unit: 'Formulation revenue (₹ crore)', x: [...SA.map(s => s.fy), ...YRS], series: [{ name: 'Formulations', values: [...SA.map(s => s.formulations), ...LINES.formulations.map(Math.round)], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company decks; GAM estimates FY27-29E' },
      { type: 'column', title: 'Quarterly formulations: ₹68 cr (Q4FY25) to ₹39 cr (Q1FY27)', unit: 'Formulation revenue (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'Formulations', values: SQ.map(q => q.formulations), fmt: 'num' }], labels: 'all', source: 'Company decks and calls (Q2FY26 derived)' },
    ] },
    { callout: `**Our forecast:** formulations +5% in FY27E (Q2-Q4 need ₹${n0(LINES.formulations[0] - Q1.formulations)} cr vs ₹${n0(FY26.formulations - 50.2)} cr a year earlier), then +20% / +18% as injectables and US products start to sell: ₹${n0(LINES.formulations[2])} cr in FY29E, still well below the ₹600-700 cr management sees. Management treats APIs and formulations as one pool ("best evaluated on the basis of its overall business growth"); we model them separately because their margins and risks differ.` },
  ],
};

module.exports = { api, formulations, capacity: P3b.capacity };
