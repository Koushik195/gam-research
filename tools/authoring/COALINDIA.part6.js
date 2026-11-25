// Coal India report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./COALINDIA.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, price, MULT, evMed, rating, buyBelow, sellAbove, medTp, ebitdaSep, shares, evNowFy28, AS, bld } = X;
const perTurn = Math.round(ebitdaSep.base / shares / 10) * 10;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: a ~6.5% yield at fair value; ${rating}`,
  blocks: [
    { callout: '**What you are buying:** India\'s dominant coal miner: ~75% of domestic output, ~49% of proven reserves, cheap open-cast mines, ~618 MTPA of power linkages and a balance sheet with ~₹42,700 cr of net cash (Mar-26). It pays out about half its profit, and its owner wants it to keep doing so.' },
    { callout: `**What you are paying:** ${n1(evNowFy28)}x FY28E EV/EBITDA and ${n1(price / F.eps[1])}x FY28E EPS, for EPS growth of ~2-4% a year with no pricing power on ~85% of volume. Since 2021 the market has paid a median ${n1(evMed)}x forward EV/EBITDA; oil, gas and consumable-fuel peers were ${Math.abs(X.evMove).toFixed(1)}% ${X.evMove < 0 ? 'below' : 'above'} their five-year median EV/EBITDA on 30-Sep-2026. On the street's method and the house multiple the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): ${rating}. Add the ~{{F.divYield.0|n1}}% FY27E dividend yield and the expected 12-month return is ~8%, below our 12.5% cost of equity.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      [`Price below ~₹${n0(buyBelow)} (BUY on our rule)`, 'Low-Medium', `The stock would have to fall ~${Math.round((1 - buyBelow / price) * 100)}%; the May-2026 OFS floor was ₹412`],
      ['E-auction premium sustained at 75%+ through the winter', 'Medium', 'Monthly e-auction results; power-plant stocks (~8 days in Sep-2026)'],
      ['A notified (FSA) price increase alongside the wage settlement', 'Low-Medium', 'Coal India board decisions; Ministry of Coal'],
      ['Volume growth of 6%+ a year towards the 1 bn t plan', 'Low', 'Monthly offtake; captive-mine output; coal share of generation'],
      ['Subsidiary IPOs at rich prices (MCL, SECL) and a special dividend', 'Medium', 'MCL price band; FY27 interim dividends'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['NCWA-XII settles above our ~10% assumption, with arrears from Jul-2026', 'Medium', 'Each extra ₹1,000 cr a year of wages ≈ 2% of EBITDA; arrears hit one quarter'],
      ['E-auction premium back to ~35% (Q4FY26 level)', 'Medium', `~₹${n0((bld[1].premium - 36) / 100 * AS.build.pFsa[1] * bld[1].ea / 10)} cr of FY28E EBITDA (~${Math.round((bld[1].premium - 36) / 100 * AS.build.pFsa[1] * bld[1].ea / 10 / F.ebitda[1] * 100)}%)`],
      ['Renewables and captive mines take more of demand; volumes flat', 'Medium', 'Operating leverage works in reverse on a fixed wage bill'],
      ['Retrospective state mineral taxes (Supreme Court ruling)', 'Medium', '~₹6,000 cr net (~₹10 a share) per management; ~₹31,591 cr gross'],
      ['More Government OFS and subsidiary listings', 'High', 'Supply overhang; ~3% of profit to minorities per 10% of MCL sold'],
      ['Policy-directed capex (gasification, fertiliser, power, minerals) earns below the cost of capital', 'Medium', 'Lower returns on retained cash'],
    ], source: 'GAM Research; CARE 13-Apr-2026' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would turn buyers below ~₹${n0(buyBelow)}** on today's numbers, and sellers above ~₹${n0(sellAbove)}, unless e-auction premiums or a price increase lift FY28E EBITDA well above our ₹{{F.ebitda.1|num}} cr.`,
      `**This is a fair-value call with a yield.** Our EBITDA is below the street's (PL ₹47,798 cr, ICICI ₹52,442 cr for FY28E) because we provide for wages; at the street's 5-6x our target would be ₹${n0(X.evAt(5))}-${n0(X.evAt(6))}.`,
      `**Biggest swing factors:** the multiple (each 1x ≈ ₹${n0(perTurn)} a share) and the e-auction premium (each ₹100/t ≈ ₹${n0(bld[1].ea * 10)} cr of EBITDA).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'FY27E dividend yield', v: '{{F.divYield.0|n1}}%', d: 'FY26 DPS ₹26.50 (52.5% payout)' },
      { k: 'Offtake Apr-Aug 2026', v: '+6.7%', d: 'production −4.5% (stocks drawn down)' },
      { k: 'E-auction premium Apr-Jul', v: '43%', d: '228% in FY23; 57% in FY26' },
      { k: 'EV/EBITDA FY28E', v: `${n1(evNowFy28)}x`, d: `own forward median since 2021: ${n1(evMed)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['FSA', 'Fuel supply agreement: a long-term contract to supply coal (mostly to power plants) at Coal India\'s notified price; penalties apply if supply is below 75% of the contracted quantity.'],
      ['Notified price', 'The list price Coal India sets for each coal grade; changes need the owner\'s (Government\'s) blessing in practice.'],
      ['E-auction / premium', 'Coal sold online to the highest bidder; the premium is how far the winning price is above the notified price.'],
      ['Offtake', 'Coal dispatched to customers (sales volume), as opposed to production.'],
      ['Overburden (OB), stripping ratio', 'Rock and soil removed to reach coal in open-cast mines; cubic metres of overburden per tonne of coal.'],
      ['Stripping activity adjustment', 'Overburden removed above a mine\'s planned ratio is capitalised as an asset and amortised later; it is a credit inside costs.'],
      ['Other charges / levies', 'Royalty-linked charges, cesses (e.g. Jharkhand mineral-bearing land cess), transport and evacuation recoveries billed to customers; inside revenue since FY25.'],
      ['NCWA / JBCCI', 'National Coal Wage Agreement for non-executive coal workers (NCWA-XI: Jul-2021 to Jun-2026), negotiated by the Joint Bipartite Committee for the Coal Industry.'],
      ['MDO', 'Mine developer and operator: a contractor that develops and runs a mine for a fee or revenue share.'],
      ['OFS / DRHP', 'Offer for sale of existing shares (by the Government or by Coal India in a subsidiary IPO); draft red herring prospectus filed with SEBI before an IPO.'],
      ['EV/EBITDA', 'Enterprise value (market value less net cash) ÷ EBITDA (profit before interest, tax, depreciation and other income).'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade above or below their own five-year median multiple on the valuation date.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here the cost of equity, as Coal India has net cash).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'ebitdaMargin@FY17': '15.9%: margin fell sharply in FY17-18 (11% in FY18).',
  'ebitda@FY19': '₹25,007 cr: recovery from the FY18 low.',
  'ebitda@FY21': '₹18,628 cr: Covid year; offtake 574 MT.',
  'sales@FY22': '+22%: offtake +15% to 662 MT.',
  'ebitda@FY23': '+79%: e-auction premium 228% after the 2022 global coal spike.',
  'pat@FY23': '+83% to ₹31,763 cr on the e-auction windfall.',
  'ebitda@FY24': '₹47,971 cr, the peak: e-auction premium 99%, offtake 754 MT.',
  'sales@FY25': 'Restated: levies collected as principal now inside revenue (~₹29,000 cr); not comparable with FY24.',
  'ebitda@FY25': 'Includes the ₹4,103 cr stripping credit (moved back from Screener\'s other income).',
  'otherIncome@FY25': '₹9,934 cr incl. JV share; Screener showed ₹14,037 cr with the stripping credit.',
  'ebitda@FY26': '−13%: offtake −2.4%, e-auction prices −7%, ₹2,201 cr executive pay provision; includes ₹4,071 cr stripping credit.',
  'otherIncome@FY26': '₹12,033 cr: interest ₹6,238 cr (₹2,365 cr on tax refunds), write-backs ₹2,932 cr, misc ₹1,774 cr, JV share ₹758 cr.',
  'pat@FY26': '−17% to ₹31,094 cr (owners).',
  'cfo@FY26': '₹43,215 cr: working capital release and lower taxes paid (refunds).',
  'sales@Q1FY26': 'Year-on-year growth overstated: FY25 quarters on Screener are on the old net basis.',
  'ebitda@Q2FY26': '₹6,593 cr: monsoon quarter, offtake 166 MT.',
  'ebitda@Q3FY26': '₹9,331 cr after the ₹2,201 cr executive pay-scale provision.',
  'otherIncome@Q4FY26': '₹5,244 cr: year-end write-backs and tax-refund interest.',
  'ebitda@Q1FY27': '−4%: diesel, explosives and outsourcing; ₹1,418 cr inventory drawdown cost.',
  'sales@FY27E': 'GAM: coal sold +4.5% to ~777 MT; e-auction 13% of volume.',
  'ebitdaMargin@FY27E': 'GAM: ₹565 a tonne incl. our NCWA-XII wage provision (~₹2,300 cr).',
  'otherIncome@FY27E': 'GAM: lower tax-refund interest and write-backs than FY26.',
  'pat@FY28E': 'GAM: +3%: volume +3.5%, full-year wage provision.',
};

module.exports = { risks, glossary, statementNotes };
