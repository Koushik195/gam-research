// OneSource report, part 6: risks & honest summary, glossary, statement notes.
const X = require('./ONESOURCE.ctx');
const { F, V, n0, n1, price, mv, EVM, EVH, SECTOR_EV, kev, epsU, rating, ruleText, buyBelow, sellAbove, SHARES, Q1, BS, ebitdaSep, ptShare, evNowFwd, evTrail, C, D } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: scarce GLP-1 capacity bought at a price that already assumes most of the ramp; BUY on our slower ramp, with governance the main reason not to pay more',
  blocks: [
    { callout: '**What you are buying:** the CDMO that fills every generic semaglutide approval in Canada and ~40% of India\'s generic pens, with capacity tripling by FY28, a clean regulatory record and options in biologics and tirzepatide. **What you are not buying:** a proven earnings stream (reported losses in FY25-26), independence from the founder\'s other companies (~28% of revenue), or a moat that survives once fill-finish capacity is plentiful.' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(evTrail)}x trailing EBITDA but ${n1(evNowFwd)}x our FY28E. On the street's method (EV/EBITDA), OneSource's own ${n1(EVH.med)}x median since the turnaround (13-May-2026), × ${kev.toFixed(3)} for the sector, gives ${EVM.base}x Sep-28E EBITDA of ₹${n0(ebitdaSep)} cr = {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating} under the house rule. P/E (₹${n0(mv('pe').value)}) and DCF (₹${n0(mv('dcf').value)}) agree within ~10%. The upside is the ramp being delivered, even a year late; it is not a re-rating.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Line 2 fills and Q4FY27 revenue runs at ~₹850-950 cr a quarter (the guidance path)', 'Medium', 'Q2FY27 results (due by mid-November 2026) and Q3'],
      ['Brazil and MENA approvals for several partners in H2FY27', 'Medium', 'ANVISA approvals; partner launches'],
      ["Dr Reddy's resumes supply quickly; batch sizes move to 500L", 'Medium-high', 'Dr Reddy\'s disclosures; management commentary'],
      ['Biologics MSAs convert to commercial contracts', 'Low-medium (FY29+)', 'New contract announcements'],
      ['Related-party revenue and promoter pledge fall', 'Low-medium', 'AR note 32; shareholding pattern'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Approvals slip again or a large partner\'s supply stays disrupted', 'Medium', 'FY27-28 EBITDA −20-30%; bear case {{scen.bear.tp|inr}}'],
      ['Generic semaglutide prices fall and partners cut volumes or renegotiate rates as capacity grows', 'Medium-high (from FY28)', 'Margin below 35%; multiple de-rates'],
      ['Prestige arbitration lost (US$136m claim)', 'Low-medium', `~₹${n0(BS.prestigeClaim / SHARES)} a share`],
      ['Related-party or promoter actions (pledge invocation, another group acquisition)', 'Medium', 'Overhang; minority value'],
      ['USFDA observation at the SPD site (inspected Jun-2026) or a quality failure', 'Low', 'Injectables delay; customer confidence'],
      ['Covenant breaches as debt peaks in FY27', 'Low-medium', 'Waivers needed again; refinancing cost'],
      ['Oral GLP-1s take more than the 25-33% of the market management expects', 'Low-medium', 'Lower long-term DDC volumes'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**The rule gives BUY below ~₹${n0(buyBelow)}** (where upside to our target is at least 15%), HOLD up to ~₹${n0(sellAbove)} and SELL above it, on today's numbers. At ₹${n0(price)} the stock is ~₹${n0(buyBelow - price)} below the BUY line.`,
      `**Biggest swing factors:** FY28-29E EBITDA and the multiple. Each 1x on EV/EBITDA is ~₹${n0(ebitdaSep / SHARES)} a share; each point of FY28-29E margin ~₹${n0(ptShare)}. On the street's FY28E EBITDA (ICICI ₹1,554 cr) our multiple would give ~₹${n0(Math.round((EVM.base * 1553.5 + F.treasury[1]) / SHARES / 10) * 10)}.`,
      '**We would add on weakness** caused by approval timing (a soft quarter, a partner\'s delay) and reassess if CDMO rates fall, if a large partner moves supply, or if the promoter group sells or pledges more.',
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Sterile production days', v: '225 → 675', d: 'FY26 → FY28 (three cartridge lines)' },
      { k: 'Q1FY27 revenue growth', v: `+${Q1.revenueGrowthPct}%`, d: `EBITDA margin ${Q1.ebitdaPct}%` },
      { k: 'Related-party revenue, FY26', v: `${C.relatedRevenue.FY26pct}%`, d: 'Strides-group entities' },
      { k: 'Promoter shares pledged', v: `${D.ownership.pledgedPctOfPromoter}%`, d: `of a ${D.ownership.promoters}% stake (Jun-2026)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['CDMO', 'Contract development and manufacturing organisation: develops and makes products other companies own and sell'],
      ['DDC (drug-device combination)', 'A medicine sold inside its delivery device, such as a pen injector or pre-filled syringe'],
      ['Fill-finish', 'Filling a sterile drug into vials, cartridges or syringes and sealing it'],
      ['Cartridge / PFS / vial', 'Glass containers for injectable drugs; a cartridge sits inside a pen, a PFS (pre-filled syringe) is ready to inject'],
      ['Sterile production days', 'Days a sterile line can run per year (~225 per line at OneSource); output also depends on batch size (200L vs 500L)'],
      ['GLP-1 / semaglutide / liraglutide / tirzepatide', 'Diabetes and obesity drugs (Ozempic/Wegovy, Victoza/Saxenda, Mounjaro); semaglutide loses patents market by market from 2026'],
      ['MSA / CSA', 'Master service agreement (development work before approval, billed as fees) / commercial supply agreement (per-unit manufacturing after approval)'],
      ['Take-or-pay / capacity reservation', 'The customer pays for reserved capacity whether or not it uses it'],
      ['First-to-file (FTF)', 'The first generic company to file for a US approval, which can earn 180 days of exclusivity'],
      ['Biologics / biosimilar / DS / DP', 'Medicines made by living cells; a biosimilar is a near-copy of an off-patent biologic; drug substance is the active protein, drug product the filled dose'],
      ['Soft gelatin capsule (soft gel)', 'A gelatin shell filled with a liquid drug'],
      ['Lyophilisation', 'Freeze-drying an injectable so it keeps longer'],
      ['Scheme amortisation', 'Write-down of intangibles (product portfolios, rights) created when the businesses merged in 2024: ₹137.8 cr a year, non-cash'],
      ['Adjusted PAT (company)', 'Profit before exceptional items and scheme amortisation, as OneSource reports it (no tax adjustment)'],
      ['Related party', 'A company owned or controlled by the same people (here, mainly the Strides / Arun Kumar group)'],
      ['Pledge', 'Shares given as security for a loan; a lender can sell them if the loan is not repaid'],
      ['EV / EBITDA', 'Enterprise value (market value plus net debt) ÷ operating profit before depreciation and amortisation'],
      ['Forward multiple', 'Price or EV ÷ the next full fiscal year\'s earnings'],
      ['Sector factor', `How far the nine pharma peers' multiples at the 30-Sep-2026 close sit from their own medians over OneSource's window (${X.pc1(SECTOR_EV)} on EV/EBITDA)`],
      ['DCF / WACC', 'Discounted cash flow value; WACC is the cost of capital used to discount (12.8% here)'],
      ['NCLT / scheme of arrangement', 'India\'s company-law tribunal / a court-approved merger or demerger'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitda@FY27E': 'GAM: margin 31.5%; lines 2-3 commissioned.',
  'sales@FY28E': 'Three lines; ~18% below the US$400m target.',
  'ebitdaMargin@FY29E': '39%: fourth line; below the guided 40%.',
  'capex@FY27E': 'Balance of the US$100m programme; injectables and soft-gel projects.',
  'eps@FY28E': `₹${n1(epsU[1])}; tax 15% on brought-forward losses.`,
};

module.exports = { risks, glossary, statementNotes };
