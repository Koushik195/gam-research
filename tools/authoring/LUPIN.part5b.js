// Lupin report, part 5b: risks and honest summary (what you buy, what you pay, triggers, how we would act).
const X = require('./LUPIN.ctx');
const { F, V, SC, n0, n1, price, mv, peMult, epsSep28, HA, peFY28, peSep28, rating, ruleText, buyBelow, sellAbove, Q1, BL, val, SHARES, sellLineTp } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better company than the FY23 Lupin, at a price that already assumes FY28 goes well',
  blocks: [
    { callout: `**What you are buying:** India's No.8 drug maker with a chronic-heavy franchise growing 1.1-1.3x the market, a fast-growing Europe and emerging-markets business (now a quarter of sales), net cash of ~₹${n0(Q1.netCashCr)} cr, and a US generics business that proved it can win hard products (first generic Spiriva, Tolvaptan, Mirabegron) but is now losing the pricing on two of them. A deep pipeline (apixaban oral suspension, biosimilars, inhalers, nasal sprays) should rebuild US earnings from FY28.` },
    { callout: `**What you are paying:** ₹${n0(price)}, ${n1(peFY28)}x our FY28E EPS and ${n1(peSep28)}x Sep-28E, above the ${n1(HA.med)}x forward median Lupin has traded on since 2021 (trough left out). On the street's method and our numbers the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}, only ~1% above the SELL line (a target below ₹${n0(sellLineTp)}). The DCF (₹${n0(mv('dcf').value)}) agrees the price is full; EV/EBITDA (₹${n0(mv('ev').value)}) is the counter-argument.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Apixaban oral suspension launches on time with a Tolvaptan-sized first year', 'Medium', 'Final approval; launch by summer 2027; channel access'],
      ['Tolvaptan holds share longer than feared (REMS, specialty pharmacies)', 'Medium', 'US quarterly sales above $280mn in H2FY27'],
      ['Biosimilars ramp (pegfilgrastim, ranibizumab, aflibercept)', 'Medium', 'US and European launches; "couple of hundred million dollars" in three years'],
      ['Pithampur Unit-2 cleared; warning letters at Tarapur and Mandideep lifted', 'Low-medium', 'USFDA re-inspections and classifications'],
      ['Price below ~₹' + n0(buyBelow), 'n.a.', 'BUY threshold on today\'s target'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Faster erosion: four Tolvaptan generics, early Mirabegron entry, a generic Spiriva', 'Medium', 'US nearer Citi\'s $975mn; bear case {{scen.bear.tp|inr}}'],
      ['FY27 margin below ~25% (Tolvaptan pricing, raw materials, freight)', 'Medium', `Each 1pp ≈ ₹${n0(F.sales[0] / 100)} cr of EBITDA in FY27E`],
      ['More antitrust settlements or a DoJ outcome', 'Medium', 'Cash charges; FY22 cost ₹1,878 cr'],
      ['New USFDA action at a key site (Nagpur, Somerset, Pithampur)', 'Low-medium', 'Delays launches (apixaban is made at Somerset)'],
      ['A large specialty acquisition at a high price', 'Medium', 'Dilutes returns; Gavis precedent'],
      ['Pharma re-rating reverses (peers back to five-year medians)', 'Medium', `At ${n1(HA.med)}x (no factor) the target would be ~₹${n0(val(Math.round(HA.med * 2) / 2))}`],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would buy below ~₹${n0(buyBelow)}** and turn sellers above ~₹${n0(sellAbove)} on today's numbers; we would raise the multiple only if the US is back above $300mn a quarter on new launches (not Tolvaptan) by Q2FY28.`,
      `**Biggest swing factors:** US sales in FY28 and the margin. Every $50mn of US sales at ~60% incremental margin is ~₹${n0(50 * BL.fx[1] / 10 * 0.6 * 0.73 / SHARES * peMult)} a share at ${peMult}x; every 1pp of FY28-29E margin ~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100 * 0.73 / SHARES * peMult)} a share.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'US sales, Q1FY27', v: `$${Q1.usUsdMn}mn`, d: 'guided $250-280mn a quarter next' },
      { k: 'EBITDA margin, Q1FY27', v: `${Q1.ebitdaMarginPct}%`, d: '~25% guided for FY27' },
      { k: 'India Rx growth, Q1FY27', v: `+${Q1.indiaRxGrowthPct}%`, d: `market +${Q1.ipmGrowthPct}%` },
      { k: 'Forward P/E (FY28E)', v: `${n1(peFY28)}x`, d: `median ${n1(HA.med)}x ex-trough` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { risks };
