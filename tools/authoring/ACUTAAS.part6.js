// Acutaas Chemicals report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./ACUTAAS.ctx');
const { n0, n1, price, mv, MULT, HB, k, SECTOR, epsU, epsSep28, fwdNow, trailPe, rating, ruleText, buyBelow, sellAbove, Q1, gNeeded, ptEps, implPeAtPrice, cdmoShare26, SENS, medTp } = X;
const brk = SENS.find(r => /earnings break/.test(r.name)), plRow = SENS.find(r => /PL 56x/.test(r.name));

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a real step-change in a good chemistry business, priced as if it were permanent; the rule says ${rating}`,
  blocks: [
    { callout: `**What you are buying:** a strong process-chemistry company (90%+ backward integration, dominant shares in several generic intermediates) that became a 36%-margin business when its darolutamide contract scaled (~${Math.round(cdmoShare26)}% of FY26 revenue), with net cash (₹${n0(Q1.netCash)} cr at Jun-2026), growth of 59% in Q1FY27 and new battery and semiconductor plants starting. **What you are not buying:** diversification (one molecule, one customer), disclosure of that dependence, or a proven record in batteries and chips.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS, ${n1(fwdNow)}x our FY28E and ${n1(implPeAtPrice)}x Sep-28E. On the street's method (P/E), Acutaas's own ${n1(HB.med)}x median since Apr-2022 lifted by the pharma sector's +${SECTOR}% gives ${MULT.base}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating} under the house rule. The EV/EBITDA cross-check (₹${n0(mv('ev').value)}) agrees and the DCF (₹${n0(mv('dcf').value)}) is far lower. Even the most generous rule-based variant (window from the earnings break: ${brk.mult}x, ₹${n0(brk.tp)}) is below the price; only the street's own multiple (PL's 56x: ₹${n0(plRow.tp)}) justifies it. The street median target (₹${n0(medTp)}) implies little upside too.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['FY27 revenue growth well above 25% with margins held near 36%', 'Medium-high', 'Q2FY27 results (due by mid-November 2026); Q3-Q4 seasonality'],
      ['The four new CDMO molecules approved and ramping; disclosure of CDMO share', 'Medium', 'H2FY27 revenue; customer-concentration disclosure in the FY27 AR'],
      ['Apixaban generic launches lift the base business above ₹600 cr', 'Medium', 'Pharma ex-CDMO growth; generic launch timing'],
      ['Battery additives at full use with margins above 15%', 'Medium', 'Quarterly specialty margin; third and fourth additive contracts'],
      ['A lower share price', 'n.a.', `The rule gives HOLD below ~₹${n0(sellAbove)} and BUY below ~₹${n0(buyBelow)}`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Darolutamide orders flatten (destocking, a second source at Fermion, slower label growth)', 'Medium', 'A large part of profit; bear case {{scen.bear.tp|inr}}'],
      ['Generic darolutamide from 2033 (US) / 2035 (EU); UK from 2029', 'Certain, later', 'The anchor contract\'s economics end; the DCF fades margins to 30%'],
      ['Battery additives meet Chinese pricing; ramp slower than contracted', 'Medium', 'Revenue and margin below our ₹280 cr / ~15% for FY29E'],
      ['Indichem and BFC fail to win customers', 'Medium', 'Semiconductor revenue below ₹115 cr; more goodwill at risk'],
      ['Forex: no repeat of FY26\'s ₹32.5 cr gains (already assumed); a strong rupee hurts exports (77% of sales)', 'Medium', 'Not quantified by the company; exports are 77% of product sales, partly hedged by imported raw materials'],
      ['Further founder selling or more equity given to partners', 'Medium', 'Sentiment; value leakage'],
      ['Pharma or chemicals de-rating (pharma trades 7.8% above its window median)', 'Medium', `Each 1x on the multiple ≈ ₹${n0(epsSep28)} a share`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}** (upside to our target of at least 15%), HOLD between that and ~₹${n0(sellAbove)}, and SELL above it, on today's numbers. At ₹${n0(price)} the stock is ~${Math.round((price / sellAbove - 1) * 100)}% above the SELL line.`,
      `**Biggest swing factors:** the multiple and darolutamide. Each 1x on the P/E is ~₹${n0(epsSep28)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1(ptEps)} of Sep-28E EPS (~₹${n0(ptEps * MULT.base)} a share at ${MULT.base}x). Without the sector factor the value is ~₹${n0(Math.round(X.half(HB.med) * epsSep28 / 10) * 10)}.`,
      '**We would revisit** if the company disclosed and diversified its customer concentration, or if the new CDMO molecules and battery business showed group margins holding at ~36% at much larger revenue; both would argue for starting the history window at the FY26 break.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'CDMO share of FY26 revenue', v: `~${Math.round(cdmoShare26)}%`, d: '8% in FY24 (PL, company data)' },
      { k: 'EBITDA margin, FY26', v: '35.9%', d: '23.0% in FY25; Q1FY27 34.3%' },
      { k: 'Net cash, Jun-2026', v: `₹${n0(Q1.netCash)} cr`, d: 'After ₹800 cr of equity since 2021' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; median since Apr-2022 ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['API / intermediate / KSM', 'Active pharmaceutical ingredient (the chemical that does the work); intermediates and key starting materials are the earlier steps. "N-1" is the step just before the API'],
      ['CDMO', 'Contract development and manufacturing organisation: makes molecules to an innovator\'s specification under contract'],
      ['Innovator / generic', 'The company that owns a new drug / a company that copies it after its patent expires'],
      ['Darolutamide (Nubeqa)', 'Bayer\'s prostate-cancer drug; Orion\'s Fermion makes the API from intermediates supplied by Acutaas'],
      ['Apixaban (Eliquis), rivaroxaban', 'Blood-thinning drugs; apixaban\'s patents expire from 2026-28'],
      ['DMF', 'Drug master file: the regulatory dossier that names a supplier\'s process; changing it takes years'],
      ['Backward integration', 'Making inputs in-house instead of buying them'],
      ['Electrolyte additives (VC, FEC)', 'Vinylene carbonate and fluoroethylene carbonate: small amounts added to lithium-ion battery electrolyte to extend life'],
      ['Photoresist chemicals', 'Light-sensitive chemicals used to print circuit patterns on silicon wafers'],
      ['ECMS', 'India\'s Electronics Components Manufacturing Scheme (capital incentives)'],
      ['QIP / OFS', 'Qualified institutional placement (new shares sold to institutions) / offer for sale (existing holders sell)'],
      ['Exceptional item', 'A one-off gain or loss outside normal operations (here the FY24 JV write-off)'],
      ['Minority interest (NCI)', 'The share of a subsidiary\'s profit or equity owned by outside partners'],
      ['Forward P/E', 'Share price ÷ next full fiscal year\'s EPS'],
      ['EV / EBITDA', 'Enterprise value (market value less net cash) ÷ operating profit before depreciation'],
      ['Sector factor', 'How far the nine pharma peers\' P/E at the 30-Sep-2026 close sits above their own medians since 1-Apr-2022 (+7.8%)'],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (12.5%, equal to the cost of equity as Acutaas has no net debt)'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY22': '+53%: Gujarat Organics\' Ankleshwar and Jhagadia units added specialty/commodity chemicals.',
  'ebitdaMargin@FY24': '17.9%: low-margin generics and Ankleshwar start-up costs.',
  'otherIncome@FY24': 'Net of the ₹32 cr exceptional loss: full impairment of the 50% US JV Ami Oncotheranostics LLC (Screener nets it here).',
  'pat@FY24': 'Attributable ₹43 cr after ~₹6 cr to BFC\'s partner; ₹75 cr before the impairment.',
  'sales@FY25': '+40%: darolutamide CDMO revenue ₹57 cr → ₹282 cr (PL).',
  'cfo@FY24': '₹125 cr: receivables fell ₹30 cr.',
  'sales@FY26': '+33%: CDMO ~₹635 cr; base intermediates flat as low-margin products were dropped.',
  'ebitdaMargin@FY26': '+12.8pp: gross margin 45% → 58% on CDMO mix.',
  'otherIncome@FY26': 'Interest ₹8.5 cr and forex gains ₹32.5 cr.',
  'pat@FY26': '+124%: margin and forex gains; tax 26.2%.',
  'capex@FY26': 'Includes the Indichem plant in Korea (₹190 cr invested in FY26).',
  'sales@Q1FY27': '+59% YoY, −24% QoQ: Q1 is seasonally the weakest quarter.',
  'otherIncome@Q1FY27': '₹1.8 cr: forex gains only ₹0.1 cr (vs ~₹10 cr in Q4FY26).',
  'sales@FY27E': 'GAM build: CDMO +35%, ex-CDMO +15%, battery ₹50 cr, semiconductor ₹25 cr, commodity −20%.',
  'otherIncome@FY27E': '3.5% on average net cash + ₹0.5 cr; no forex gains.',
  'capex@FY27E': '~₹95 cr guided + Indichem completion + first year of the ₹212 cr electronics plant.',
  'eps@FY29E': `₹${n1(epsU[2])}; battery and semiconductor revenue ~₹400 cr.`,
};

module.exports = { risks, glossary, statementNotes };
