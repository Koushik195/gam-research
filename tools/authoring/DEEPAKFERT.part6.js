// Deepak Fertilisers report, part B (5/5): risks & honest summary, glossary and statement notes. As of 30-Sep-2026.
const { ctx } = require('./DEEPAKFERT.ctx');
const { F, V, S, n0, n1, price, rating, buyBelow, sellAbove, ruleText, CHEM_X, FERT_X, blendX, fwdMed, fwdEvMed, ndF } = ctx;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good franchise at a peak, with a price that assumes the peak lasts',
  blocks: [
    { callout: '**What you are buying:** India\'s largest maker of technical ammonium nitrate (~40% share, going to ~963 ktpa), its main concentrated nitric acid supplier, a 500 ktpa ammonia plant fed by a 15-year LNG contract, and a regional fertiliser brand (Mahadhan) whose margins depend on subsidy policy. The heavy spending is almost over; from FY28 the company should generate ₹1,200-1,400 cr of free cash a year in our base case.' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(price / F.eps[1])}x our FY28E EPS (₹${n1(F.eps[1])}) and ${n1(F.evEbitda[1])}x FY28E EV/EBITDA, against own one-year-forward medians of ${n1(fwdMed)}x P/E and ${n1(fwdEvMed)}x EV/EBITDA since Apr-2021. Our FY28E EBITDA (₹${n0(F.ebitda[1])} cr) already includes Gopalpur, Dahej and Equinor and still-elevated spreads; EPS is flat over FY27-29E because Q1FY27's windfall does not repeat. Our sum of the parts (Chemicals ${CHEM_X}x, Fertilisers ${FERT_X}x; ${n1(blendX)}x overall) gives {{dcf.tp|inr}}: **${rating}**.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY at our target)`, 'Low-medium', 'Share price after Q2FY27 results'],
      ['Ammonia stays above ~$550/t and TAN above ~₹55/kg into FY28 (our bull case)', 'Low-medium', 'Monthly ammonia and FGAN prices; Russian export policy'],
      ['Gopalpur above 80% utilisation by Q4FY27 at Taloja-like margins', 'Medium', 'Q3-Q4FY27 TAN volumes and segment EBIT'],
      ['Rabi 2026-27 NBS rates fully cover phosphoric acid and sulphur', 'Medium', 'Cabinet decision before the Rabi season; Q3FY27 fertiliser EBIT'],
      ['A clean, minority-friendly DMSL listing and CCD conversion', 'Low', 'Board decisions; conversion terms'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Spreads go back to pre-war levels faster (Russian supply, new Indian TAN capacity)', 'Medium', `Our bear case: FY28E EPS ~₹${n1(S.bear.eps[1])}, value {{scen.bear.tp|inr}}`],
      ['Gopalpur ramp-up slow or ammonia for it expensive', 'Medium', 'Each 100 kt of TAN ≈ ₹160 cr of EBITDA at ₹16,000/t'],
      ['Subsidies lag costs again; deficient monsoon hurts Rabi demand', 'Medium', 'Fertiliser EBITDA margin stays at ~4-5% (₹150-200 cr less than our FY28E)'],
      ['IPA feedstock (refinery propylene) stays curtailed', 'Medium', 'IPA volumes −76% in Q1FY27; IPA earned ~₹150 cr of EBITDA in FY25 (Emkay)'],
      ['Gas supply disruption (LNG shipping, the Middle East)', 'Low-medium', 'ICRA put the rating on watch in Apr-2026 for this reason'],
      ['New growth capex or acquisitions before debt falls; more promoter-linked financing', 'Medium', `Net debt stays above our ~₹${n0(ndF(2))} cr for Mar-29E`],
    ], source: 'GAM Research' } },
    { callout: `**How we would act.** Our rating follows the house rule (${ruleText}). At ₹${n0(price)} the target of {{dcf.tp|inr}} implies {{dcf.upside|chg}}: **${rating}**. At our target, the rating would move to HOLD if the price fell below ~₹${n0(sellAbove)} and to BUY below ~₹${n0(buyBelow)}; we would raise the target if Q2-Q3FY27 show spreads holding while Gopalpur fills. The bull case ({{scen.bull.tp|inr}}) is real: it needs war-time spreads to last another year. The bear case ({{scen.bear.tp|inr}}) is FY24 again with more capacity.` },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'Meaning'], wide: [1], rows: [
      ['TAN', 'Technical ammonium nitrate: ammonium nitrate for explosives (not fertiliser). LDAN/HDAN = low/high-density prills; AN melt = liquid form'],
      ['FGAN', 'Fertiliser-grade ammonium nitrate; its global price is a benchmark for TAN'],
      ['WNA / DNA / CNA', 'Weak (dilute) and concentrated nitric acid; made from ammonia, used for TAN, nitro-aromatics, pharma'],
      ['IPA', 'Isopropyl alcohol, a solvent made from refinery-grade propylene (RGP)'],
      ['Ammonia FOB Middle East', 'Price of ammonia loaded on a ship in the Middle East, in $/tonne: the benchmark Deepak shows'],
      ['Henry Hub', 'US natural gas price benchmark; the Equinor LNG price is linked to it'],
      ['NBS', 'Nutrient Based Subsidy: a per-kg subsidy on N, P, K and S in non-urea fertilisers, fixed by the government each season'],
      ['Kharif / Rabi', 'India\'s monsoon (Jun-Sep) and winter (Oct-Mar) crop seasons'],
      ['NP / NPK', 'Complex fertilisers containing nitrogen and phosphorus (and potassium); Croptek = Deepak\'s crop-specific blends; Bensulf = bentonite sulphur'],
      ['B2C (TAN)', 'Deepak\'s term for supplying explosives and services at the mine site rather than selling bags of TAN'],
      ['PESO', 'Petroleum and Explosives Safety Organisation, which licenses ammonium nitrate movement (its portal change cut Q1FY27 volumes)'],
      ['DMSL / MAL / PCL / PBS', 'Deepak Mining Solutions (TAN), Mahadhan AgriTech (fertilisers), Performance Chemiserve (ammonia), Platinum Blasting Services (Australia)'],
      ['CCD / OCD', 'Compulsorily / optionally convertible debentures: debt that converts (or may convert) into shares'],
      ['NCI', 'Non-controlling (minority) interest: the part of a subsidiary\'s equity owned by outsiders'],
      ['Capitalised interest', 'Interest on project loans added to the plant\'s cost instead of being expensed, until the plant starts'],
      ['CWIP', 'Capital work in progress: plants being built'],
      ['EBITDA / EBIT', 'Operating profit before / after depreciation (before interest and tax)'],
      ['EV/EBITDA', 'Enterprise value (market value + net debt) ÷ EBITDA'],
      ['SOTP', 'Sum of the parts: each business valued separately, then added up, less net debt'],
      ['ROCE / ROE', 'Return on capital employed / on shareholders\' equity'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the earnings year a 12-month target set in Sep-2026 looks to'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '+24%: Chemicals revenue +15%, fertilisers +38% after a weak FY20.',
  'ebitda@FY21': '+107%: Chemicals segment EBIT ₹744 cr (₹414 cr in FY20).',
  'sales@FY22': '+32%: Chemicals revenue +45% on higher ammonia-linked prices.',
  'sales@FY23': '+47%: Russia-Ukraine war prices; Chemicals revenue ₹6,411 cr.',
  'pat@FY23': 'Record ₹1,210 cr: Chemicals EBIT ₹1,992 cr.',
  'sales@FY24': '−23%: prices fell back; fertiliser EBIT almost nil (₹0.5 cr).',
  'pat@FY24': '−63%: Taloja ammonia plant capitalised; interest ₹404 cr, depreciation ₹334 cr.',
  'sales@FY25': '+18%: fertilisers +33% (incl. traded); TAN 519 kt.',
  'pat@FY25': '₹934 cr incl. a one-time tax credit of ~₹40 cr; fertiliser EBIT ₹425 cr.',
  'ebitda@FY26': '−13%: phosphoric acid and sulphur ahead of subsidies, weak IPA, ~₹75 cr ammonia turnaround.',
  'pat@FY26': '₹737 cr; ₹116 cr of interest capitalised into the projects.',
  'cfo@FY26': '₹206 cr: receivables +₹728 cr (subsidy due ₹751 cr), inventory +₹669 cr.',
  'capex@FY26': '₹1,570 cr: Gopalpur TAN and Dahej nitric acid.',
  'sales@FY27E': 'Q1 war-time prices plus H2 volumes from Gopalpur and Dahej.',
  'ebitda@FY27E': 'Q1 ₹845 cr actual + ~₹670 cr a quarter for Q2-Q4.',
  'pat@FY28E': 'Higher depreciation (new plants) and interest after capitalisation stops offset higher EBITDA.',
};

module.exports = { risks, glossary, statementNotes };
