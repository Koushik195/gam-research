// PCBL report, part B: risks & honest summary, glossary and statement notes. As of 30-Sep-2026.
const { ctx } = require('./PCBL.ctx');
const { ruleText } = require('../../src/ratings');
const { F, V, A, n0, n1, ai, price, epsSep28, PE_X, rating, buyBelow, sellAbove, CBA, A26, ndEngine } = ctx;
const volSep28 = (CBA.volumeT[1] + CBA.volumeT[2]) / 2;
const perEpt = Math.round(1000 * volSep28 / 1e7 * (1 - 0.25) / F.shares * PE_X); // ₹/share per ₹1,000/t of EBITDA/t

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good core business, a poor acquisition, a stretched balance sheet and a full price',
  blocks: [
    { callout: '**What you are buying:** India\'s largest carbon black maker (900 kt, port-side plants, 40% exported), a fast-growing specialty-black line, 122 MW of by-product power, the world\'s #3 phosphonate maker (Aquapharm) and an early-stage battery-materials option, run by the RP-Sanjiv Goenka group.' },
    { callout: `**What you are paying:** ${n1(price / F.eps[1])}x our FY28E EPS and ${n1(F.evEbitda[1])}x FY28E EV/EBITDA for a company with ROE of 5% (FY26) rising to ~${Math.round(F.roe[2])}% (FY29E), net debt of ~4x EBITDA, three Negative rating outlooks and a record of missing its own targets. On the street's P/E method and our numbers the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY at our target)`, 'Low-medium', 'Share price after Q2FY27 results'],
      ['Carbon black EBITDA/t holds above ₹17,000 after the inventory reversal', 'Medium', 'Q2-Q4FY27 company EBITDA/t'],
      ['Aquapharm back to ₹60-75 cr a quarter of EBITDA', 'Low-medium', 'New CEO\'s plan; oil & gas and green-chelate volumes'],
      ['Net debt below 2.5x EBITDA without new equity', 'Low', 'Half-yearly balance sheet; Andhra Pradesh funding'],
      ['A named battery-material customer and a commercial plant decision', 'Low', 'Nanovace qualification updates'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Crude falls: Q1\'s inventory gains reverse and formula prices lag down', 'Medium-high', 'FY27E EBITDA −₹50-100 cr'],
      ['Russian supply returns or Indian overcapacity reasserts itself', 'Medium', 'EBITDA/t back to ~₹14,000-15,000 (FY26); our bear case'],
      ['Aquapharm keeps shrinking; another goodwill impairment', 'Medium', 'EBITDA −₹30-50 cr; book value hit'],
      ['Debt-funded Andhra Pradesh plant and coal-tar project, plus dividends', 'Medium', 'Net debt stays ~3x; downgrade if CRISIL\'s 3-3.25x trigger is breached'],
      ['Freight or tariff shocks on exports (~40% of volume)', 'Medium', 'Lower volume and realisations'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**At our target the stock is a HOLD between ~₹${n0(buyBelow)} and ~₹${n0(sellAbove)} and a BUY below ~₹${n0(buyBelow)}.** We would raise the target on proof that EBITDA/t holds above ₹17,000 after the Q2 reversal and that Aquapharm is recovering.`,
      `**Biggest swing factor:** EBITDA per tonne. Each ₹1,000/t on ~${Math.round(volSep28 / 1000)} kt moves our target by ~₹${perEpt} a share; each 1x of P/E by ~₹${n0(epsSep28)}.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Aquapharm EBITDA, FY23 → FY26', v: `₹417 → ${A26.aqEbitda} cr`, d: 'bought for ₹3,800 cr' },
      { k: 'Carbon black EBITDA/t, FY25 → FY26', v: '₹19,170 → 14,230', d: 'guidance FY27 ₹16,500-17,000 (company basis)' },
      { k: 'Net debt / EBITDA (FY26)', v: `${n1(A.netDebt[ai('FY26')] / A.ebitda[ai('FY26')])}x`, d: `GAM FY29E ${n1(ndEngine(2) / F.ebitda[2])}x; target <1x` },
      { k: 'P/E on our Sep-28E EPS', v: `${n1(price / epsSep28)}x`, d: `history ${n1(ctx.preDeal)}x (2021-23) / ${n1(ctx.fwdMed)}x (house median)` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Carbon black', 'Fine carbon powder made by burning heavy oil with limited air; reinforces tyres and rubber, colours and conducts in plastics, inks and batteries.'],
      ['Rubber black / performance / specialty blacks', 'Tyre grades; grades for belts, hoses and other rubber goods; high-value grades for plastics, inks, coatings, cables and conductive uses.'],
      ['CBFS / CBO', 'Carbon black feedstock (a heavy oil from refining, crude-linked) / coal-tar-based oil, an alternative feedstock used mainly in China.'],
      ['EBITDA per tonne', 'Operating profit before depreciation, interest and tax divided by tonnes sold; PCBL\'s figure covers carbon black, power, corporate costs and other income.'],
      ['Formula pricing / spot', 'Contract prices that move with feedstock costs after a lag (one month or one quarter) / prices agreed deal by deal at market rates.'],
      ['Inventory gain', 'Extra profit when cheap raw material bought earlier is sold at prices that already reflect a higher crude price; it reverses when crude falls.'],
      ['Co-generation (MU)', 'Electricity made from the hot tail gas of carbon black reactors; MU = million units (kWh).'],
      ['Phosphonates / green chelates', 'Chemicals that stop scale and corrosion in water systems and detergents / biodegradable alternatives (e.g. MGDA, GLDA).'],
      ['Nano-silicon anode', 'Silicon particles added to a lithium-ion battery\'s graphite anode to raise energy density and charging speed.'],
      ['Goodwill impairment / DTL reversal', 'Write-down of the premium paid in an acquisition / release of a deferred-tax liability; in FY25 the two offset each other.'],
      ['Section 182 contribution', 'A donation to a political party allowed under the Companies Act, 2013.'],
      ['TD/PBILDT', 'Total debt ÷ EBITDA (CARE\'s term); a leverage measure.'],
      ['P/E, EV/EBITDA', 'Share price ÷ earnings per share; (market value + net debt) ÷ EBITDA.'],
      ['ROE / ROCE', 'Net profit ÷ equity; operating profit ÷ (equity + debt).'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the blended required return on equity and debt used as the discount rate.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY21': '−18%: Covid; volume 389 kt at ~₹68/kg.',
  'sales@FY22': '+67%: crude-linked prices (~₹98/kg) and volume +17% (454 kt).',
  'sales@FY23': '+30%: realisation ~₹130/kg on high crude; volume flat (445 kt).',
  'ebitda@FY24': '+42%: EBITDA/t ~₹19,300, Chennai ramp-up, specialty mix; Aquapharm consolidated from Jan-2024.',
  'pat@FY24': 'Record ₹491 cr; interest ₹181 cr after the acquisition debt.',
  'sales@FY25': '+31%: first full year of Aquapharm (₹1,420 cr); volume 596 kt.',
  'pat@FY25': 'Interest ₹461 cr and depreciation ₹346 cr (deal intangibles) cut profit despite EBITDA +29%.',
  'ebitda@FY26': '−22%: carbon black EBITDA/t ~₹14,200 (from ~₹19,200); Aquapharm EBITDA ₹162 cr.',
  'pat@FY26': '₹198 cr; includes −₹25 cr labour-code exceptional and ₹35 cr of political donations in costs.',
  'cfo@FY26': '₹1,576 cr incl. ₹529 cr working-capital release as crude fell.',
  'capex@FY26': 'Tamil Nadu 90 kt line (~₹450 cr) and Mundra specialty line.',
  'sales@FY27E': 'GAM: +18%; carbon black ~650 kt at ~₹125/kg (Q1 ₹135/kg on $97 crude).',
  'ebitda@FY27E': 'GAM: EBITDA/t ₹16,400 (≈₹16,900 company basis, within guidance); Aquapharm ~₹180 cr.',
  'capex@FY28E': 'Andhra Pradesh greenfield Phase I (~₹1,100 cr) and coal-tar project start.',
  'sales@Q1FY27': '+17%: realisation up ~₹27,000/t QoQ on $97 Brent; volume flat.',
  'ebitda@Q1FY27': 'Record ₹396 cr incl. ~₹70 cr low-cost inventory gain; power ₹5.39/kWh.',
  'pat@Q3FY26': '₹2 cr: weakest quarter; tax rate 80%.',
};

module.exports = { risks, glossary, statementNotes };
