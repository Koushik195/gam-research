// Wockhardt report, part 5b: risks and the honest summary (what you buy, what you pay, triggers, how we would act).
const X = require('./WOCKPHARMA.ctx'), Y = require('./WOCKPHARMA.ctx2');
const { F, V, SC, n0, n1, price, peMult, epsSep28, peSep28, buyBelow, sellAbove, ruleText, mv } = X;

const risks = {
  id: 'risks', nav: 'Risks & summary', kicker: 'Risks', title: 'Risks and the honest summary: a good drug, an ordinary business, a full price',
  blocks: [
    { exhibit: { type: 'table', title: 'Risks that would change our view', head: ['Risk', 'Direction', 'What would show it', 'Size'], wide: [2], rows: [
      ['Zaynich US launch slower than our US$1 / 10 / 25mn', 'Down', 'Few formulary wins in 2027; launch costs above ~₹80-90 cr a quarter', `Each US$10mn of FY29E US sales ≈ ₹${n0(10 * 94 / 10 * 0.8 * 0.78 / X.SHARES)} of EPS`],
      ['Zaynich faster (compassionate-use awareness, HAP/VAP data, UK subscription)', 'Up', 'Hospital uptake in academic centres; NHS award; EU approval early 2027', 'Bull case {{scen.bull.tp|inr}}'],
      ['Earlier or faster amortisation of the ₹1,055 cr Zaynich intangible', 'Down', 'Depreciation step-up in H2FY27', `Target range ₹${n0(Math.min(...Y.AMORT_CASES.map(c => c.tp)))}-${n0(Math.max(...Y.AMORT_CASES.map(c => c.tp)))} across paths`],
      ['Impairment of capitalised NCE costs (₹1,708 cr)', 'Down', 'Weak Zaynich uptake; Foviscu/Miqnaf disappointment', `₹${n0(1708 / X.SHARES)} a share of book value`],
      ['Equity dilution (₹3,000 cr enabler)', 'Down', 'QIP announcement', '~9% more shares at ₹2,100'],
      ['Insulin tender slippage in emerging markets', 'Down', 'Quarterly EM sales below ₹250 cr', 'EM is ~28% of revenue'],
      ['Promoter loans (~₹950 cr) and pledges (18.8%)', 'Down', 'Renewal terms in Jun-2027; pledge creeping up', 'Governance, refinancing'],
      ['Regulatory: import alerts, a new warning letter at Wrexham or the European CMO', 'Down', 'USFDA/MHRA inspection outcomes', 'Zaynich supply'],
      ['Sector de-rating (pharma trades ~17% above its one-year median)', 'Down', 'Peer multiples revert', `Without the factor: ${X.SENS.noFactor}x → ₹${n0(X.val(X.SENS.noFactor))}`],
    ], source: 'GAM Research' } },
    { h: 'The honest summary' },
    { bullets: [
      `**What you buy:** a ₹3,900 cr (FY27E) generics-and-insulin company with a 21-22% EBITDA margin and single-digit ROE, plus Zaynich: a genuinely novel, approved antibiotic with patents to 2038, launching into a hard US hospital market through a team that has never sold a branded drug there.`,
      `**What you pay:** ₹${n0(price)}, or ${n1(peSep28)}x Sep-28E EPS, ${n1(price / F.eps[1])}x FY28E and ~40x trailing EV/EBITDA. Valuing the base business at the peers' multiples, the price implies Zaynich peak sales of ~US$${(Y.PEAK_IMPLIED / 1000).toFixed(1)}bn, above management's own US$1.5-2bn. On our base peak (US$${Y.PEAK_GAM}mn) Zaynich is worth ~₹${n0(Y.Z_GAM.perShare)} a share.`,
      `**Our target:** ${peMult}x Sep-28E EPS of ₹${n1(epsSep28)} = {{dcf.tp|inr}} ({{dcf.upside|chg}}). The multiple comes from the stock's own year since the break, so it embeds the market's current enthusiasm; the cross-checks (EV/EBITDA ₹${n0(mv('ev').value)}, DCF ₹${n0(mv('dcf').value)}, sum of the parts ₹${n0(Y.sotpTp)}) are all lower.`,
      '**Triggers to watch:** the first two quarters of Zaynich sales in India and the US (H1CY27), the EMA decision, a HAP/VAP trial start, insulin capacity coming on stream, the use of the fund-raise enabler and the promoter-loan renewal in June 2027.',
      `**How we would act:** ${ruleText} On our target that means buying below ~₹${n0(buyBelow)} and selling above ~₹${n0(sellAbove)}. We would turn more positive on evidence of US hospital uptake ahead of the US$30-50mn three-year norm, not on approvals or peak-sales talk.`,
    ] },
    { callout: `**Bottom line:** Wockhardt deserves credit for Zaynich: it is the rare Indian new drug that cleared the FDA, and the base business has genuinely turned. But earnings to FY28 are the old business, and the share price already discounts a blockbuster. Our rule gives ${X.rating}.` },
  ],
};

module.exports = { risks };
