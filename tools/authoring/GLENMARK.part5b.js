// Glenmark report, part 5b: risks and honest summary (what you buy, what you pay, triggers, how we would act).
const X = require('./GLENMARK.ctx');
const { F, V, SC, n0, n1, price, mv, peMult, epsSep28, HA, peFY28, peSep28, peSep28Rep, rating, ruleText, buyBelow, sellAbove, Q1, BL, val, SHARES, sellLineTp, CM, litig, avgTp, FM, SENS } = X;
const coreQ1m = (Q1.ebitda - Q1.naDeferredCr) / (Q1.revenue - Q1.naDeferredCr) * 100;
const perPp = (F.sales[1] + F.sales[2]) / 2 / 100 * (1 - 0.26) / SHARES * peMult;
const per25 = 25 * BL.fx[1] / 10 * 0.5 * (1 - 0.26) / SHARES * peMult;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better Glenmark than in 2023, priced as if the Investor Day plan has already worked',
  blocks: [
    { callout: `**What you are buying:** India's No.13 drug maker with leading dermatology, respiratory and cardiac brands growing 12-15% a year; branded Europe and emerging-market businesses (half of core revenue); a US generics arm that finally grew again in Q1FY27 on respiratory launches, with Monroe and Goa cleared; a real global brand in Ryaltris; and IGI, whose ISB 2001 could still pay up to US$1.225bn in milestones. The balance sheet has no bank debt, but ₹${n0(litig)} cr of litigation payables and a ₹${n0(CM.customerAdvanceNc)} cr customer advance sit against ₹${n0(CM.companyNetCash)} cr of net cash.` },
    { callout: `**What you are paying:** ₹${n0(price)}, ${n1(peFY28)}x our FY28E core EPS and ${n1(peSep28)}x Sep-28E (${n1(peSep28Rep)}x on the street's reported basis), against a ${n1(HA.med)}x median on comparable EPS since 2021. On the street's method and our numbers the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. EV/EBITDA (₹${n0(mv('ev').value)}) and the DCF (₹${n0(mv('dcf').value)}) agree the price is ahead of the fundamentals. The strongest case against us: on reported EPS the house median is ${n1(FM.median)}x, which would give ~₹${n0(val(SENS.reported))} (a HOLD).` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['An ISB 2001 milestone (AbbVie moving to registration trials) or a new IGI deal', 'Low-medium in 12 months', 'AbbVie disclosures; ISB 2301 IND by end-2026'],
      ['US respiratory approvals and the two first-to-files on time', 'Medium', 'North America core above ~US$110mn a quarter by Q4FY27'],
      ['Core EBITDA margin back above 19% in H2FY27 despite freight and API costs', 'Medium', 'Q2-Q3FY27 results (due by mid-November 2026 and mid-February 2027)'],
      ['Indore warning letter lifted', 'Low-medium', 'USFDA re-inspection and classification'],
      ['Price below ~₹' + n0(buyBelow), 'n.a.', 'BUY threshold on today\'s target'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Another India channel disruption (three-tier distribution)', 'Low-medium', 'Q3FY24 and Q2FY26 each cost ~₹1,000 cr of sales and an inventory charge'],
      ['New USFDA action, or more antitrust settlements (end-payor and other groups still open)', 'Medium', 'Delayed launches; cash charges (₹964 cr of litigation liabilities already)'],
      ['Freight and API inflation persists (West Asia)', 'Medium', `Each 1pp of FY28-29E core margin ≈ ₹${n0(perPp)} a share at ${peMult}x`],
      ['US respiratory approvals slip into FY28', 'Medium', `Every US$25mn of US sales ≈ ₹${n0(per25)} a share; bear case {{scen.bear.tp|inr}}`],
      ['IGI needs more money after the three-year budget, with no milestones', 'Medium', '~US$70mn a year on Glenmark\'s P&L once the deferred income stops (Mar-2028)'],
      ['Pharma re-rating reverses (peers back to their five-year medians)', 'Medium', `At ${n1(HA.med)}x (no factor) the target would be ~₹${n0(val(Math.round(HA.med * 2) / 2))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would buy below ~₹${n0(buyBelow)}** and stay sellers above ~₹${n0(sellAbove)} on today's numbers. We would raise our view if North America core sales reach ~US$110mn a quarter with the respiratory approvals, the core margin holds above 19%, or an ISB 2001 milestone lands.`,
      `**Why we differ from the street (post-Q1 average target ₹${n0(avgTp)}):** brokers value reported EPS that includes ~₹18 a share of deferred licensing income in FY27-28 and use 25x; one adds ₹290 for ISB 2001. We value core EPS at Glenmark's own history (${peMult}x).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Revenue growth, Q1FY27', v: `+${n1((Q1.revenue / Q1.revenuePrior - 1) * 100)}%`, d: 'every region double digit' },
      { k: 'Core EBITDA margin, Q1FY27', v: `${n1(coreQ1m)}%`, d: `reported ${Q1.ebitdaMarginPct}% incl. deferred income` },
      { k: 'India secondary sales, Q1FY27', v: `+${Q1.indiaSecondaryPct}%`, d: `market +${Q1.ipmPct}%` },
      { k: 'P/E on Sep-28E core EPS', v: `${n1(peSep28)}x`, d: `median ${n1(HA.med)}x ex-trough` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { risks };
