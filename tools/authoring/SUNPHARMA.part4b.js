// Sun Pharma report, part 4b: earnings quality (exceptional items, forex, tax, other income), ownership, governance.
const X = require('./SUNPHARMA.ctx');
const { C, D, F, A, AS, SA, n0, n1, pc, rup, b, OI, OIN, ttmOiExFx, netCash26 } = X;
const EX = C.exceptionalItems, GV = D.governance, OW = D.ownership;
const fy26 = OIN.fy26, fy25 = OIN.fy25;

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: a charge every year, forex inside "EBITDA", a rising tax rate',
  blocks: [
    { p: 'Four things a reader of Sun\'s numbers should know. (1) **Exceptional items every year**: litigation (Ranbaxy-era US claims, Taro price-fixing, opioids), impairments of in-licensed assets and restructuring have cost ₹130-950 cr after tax in each of FY23-26 and ₹145 cr in Q1FY27; Organon will add deal and integration costs. The company\'s "adjusted" EPS excludes them. (2) **Forex gains inside company EBITDA**: Sun\'s headline FY26 EBITDA of ₹17,731 cr (30.3%) includes a ₹1,240 cr forex gain from the falling rupee; before it, EBITDA was ₹16,491 cr (28.2%). We forecast before forex. (3) **Tax**: the effective rate was 20.2% in FY25 and 23.5% in FY26 (AR note 49, both with one-off items) and 27.8% in Q1FY27 as India tax benefits run out. (4) **Other income** is large (₹1,972 cr in FY26 before forex, ~12% of PBT) and mostly treasury income that will shrink when ~$2.25 bn of cash goes into Organon.' },
    { exhibit: { type: 'table', title: 'Exceptional items, FY22-Q1FY27', head: ['Period', 'What', 'After tax (₹ cr)'], wide: [1], rows: EX.rows.map(r => [r[0], rup(r[1]), n0(r[2])]), source: 'Investor presentations (adjustment footnotes); AR FY26 note 61; Screener.in schedules (after-tax column)' } },
    { h: 'Other income: built from its parts, not plugged' },
    { exhibit: { type: 'table', title: 'Other-income build (₹ crore)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [6], rows: [
      ['Treasury income (deposits, bonds, funds, dividends)', n0(OIN.treasuryFy25), n0(OIN.treasuryFy26), n0(OI[0].treas), n0(OI[1].treas), n0(OI[2].treas), `Forecast: ${AS.treasuryYield[0]}% on opening net cash (₹${n0(OI[0].open)} / ${n0(OI[1].open)} / ${n0(OI[2].open)} cr); FY26 = 6.1% of opening`],
      ['Interest on income-tax refunds', n0(fy25.ofWhichTaxRefundInterest), n0(fy26.ofWhichTaxRefundInterest), '0', '0', '0', 'One-off: left out'],
      ['Recurring non-treasury (other interest, rent, insurance, misc.)', n0(fy25.loanInterest + fy25.otherInterest - fy25.ofWhichTaxRefundInterest + fy25.insurance + fy25.leaseRentals + fy25.misc), n0(fy26.loanInterest + fy26.otherInterest - fy26.ofWhichTaxRefundInterest + fy26.insurance + fy26.leaseRentals + fy26.misc), n0(OI[0].recurring), n0(OI[1].recurring), n0(OI[2].recurring), 'AR FY26 note 31 items; held at ₹150 cr'],
      ['Asset-sale gains, balances written back', n0(fy25.assetSaleGains + fy25.balancesWrittenBack), n0(fy26.assetSaleGains + fy26.balancesWrittenBack), '0', '0', '0', 'One-off: left out'],
      ['Forex gains (outside other income in the accounts)', n0(fy25.forexGainOutsideOtherIncome), n0(fy26.forexGainOutsideOtherIncome), n0(OI[0].forex), n0(OI[1].forex), n0(OI[2].forex), 'FY27E = Q1 actual only; no currency forecast'],
      ['Associates, JV and minorities (engine has no line)', '–', '–', n0(OI[0].assoc), n0(OI[1].assoc), n0(OI[2].assoc), 'FY26: associates −₹56 cr, minorities −₹29 cr after tax'],
      { hl: true, cells: ['**Other income in the model**', `**${n0(fy25.total + fy25.forexGainOutsideOtherIncome)}**`, `**${n0(fy26.total + fy26.forexGainOutsideOtherIncome)}**`, `**${n0(OI[0].total)}**`, `**${n0(OI[1].total)}**`, `**${n0(OI[2].total)}**`, 'Actuals incl. forex, before exceptional items'] },
    ], source: 'AR FY26 consolidated note 31 and P&L; Screener.in; GAM estimates' } },
    { p: `**Reconciliation.** FY27E other income of ₹${n0(OI[0].total)} cr compares with ₹${n0(fy26.total)} cr in FY26 before forex (₹${n0(fy26.total + fy26.forexGainOutsideOtherIncome)} cr with it) and ₹${n0(ttmOiExFx)} cr in the twelve months to Jun-26 before forex and exceptional items (Screener quarterly). The gap to the trailing figure is Q1FY27's unusually high ₹724 cr (+56% YoY; composition not disclosed, likely mark-to-market gains on funds) and FY26's ₹128 cr of tax-refund interest, neither of which we extrapolate, and the ₹100 cr deduction for associates and minorities. Treasury income then rises with the cash pile (standalone net cash ₹${n0(F.treasury[0])} cr by Mar-27E); after Organon it would fall sharply, a point the street's combined-entity EPS already reflects.` },
    { callout: `**Verdict: AMBER.** Revenue and cash conversion are sound (operating cash flow ₹12,419 cr in FY26; pre-tax operating cash was 89% of EBITDA on Screener's measure, 105% and 96% in FY24-25), the auditor is EY's Indian firm, and the adjustments are disclosed in detail. But "one-offs" that recur every year are a cost of doing business in US generics; they averaged ~₹2-4 a share in FY23-26 (4-8% of EPS). Our forecasts, like the street's, exclude them, so true earnings power is a little below our EPS.` },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The Shanghvi family and its companies own ${OW.categories.promoters}% (Jun-2026), mostly through Shanghvi Finance Pvt Ltd (40.3%) and Dilip Shanghvi directly (9.6%); nothing is pledged. Foreign portfolio investors hold ${OW.categories.fpi}% (down from 18.0% in Dec-2024), mutual funds ${OW.categories.mutualFunds}%, insurers ${OW.categories.insurance}% (LIC 5.5%), pension funds ${OW.categories.pension}% and retail and others ~${OW.categories.retailAndOthers}%. The free float is ~45%, so index and foreign-fund flows move the stock.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest named holders (30-Jun-2026)', head: ['Holder', '% of shares'], rows: OW.named.map(r => [r[0], `${r[1].toFixed(2)}%`]), source: 'Shareholding pattern 30-Jun-2026 (company website, filed Jul-2026)' } },
] });

const govRows = [
  ['Promoter alignment', 'Good', '54.5% family stake, no pledges, founder still executive chairman; pay modest by global standards'],
  ['Board independence', 'Adequate', 'Five of nine directors independent (Pawan Goenka lead); two new independents in May-2026; three family members on the board'],
  ['Succession', 'Watch', 'Founder (b.1955) moved to executive chairman in Sep-2025; professional MD (Kirti Ganorkar); son Aalok is COO and the best-paid executive'],
  ['Pay', 'Watch', 'Dilip Shanghvi ₹7.1 cr (+22%), Aalok Shanghvi ₹9.3 cr (+20%) in FY26 vs +0.66% for the median employee'],
  ['Regulatory record', 'Weak', 'Four Indian plants under US FDA action; Ranbaxy consent decree legacy at Mohali; US price-fixing and opioid settlements'],
  ['Capital allocation', 'Mixed', 'Cheap, well-integrated deals (Taro, DUSA, Concert); Ranbaxy dilution; Organon is the biggest and most leveraged bet yet'],
  ['Disclosure', 'Adequate', 'Detailed adjustments and FDA disclosures; no product-level specialty sales; no margin guidance'],
];
const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Management & governance', title: 'Founder-led, professionally managed; the FDA record is the weak point',
  blocks: [
    { p: `${rup(C.management.board)} ${rup(GV.related)}` },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Evidence'], wide: [2], rows: govRows, source: 'AR FY26 (Board\'s report, Annexure A, corporate governance report); shareholding pattern Jun-2026; FDA letters' } },
    { callout: '**Our view:** Dilip Shanghvi has one of the best capital-allocation records in Indian pharma, and the family\'s interests are aligned with minorities (no pledges, modest pay, cash deals). The weak spots are manufacturing quality, now a five-year problem across several plants, and the size of the Organon bet, which concentrates a decade of balance-sheet strength into one integration.' },
  ],
};

module.exports = { quality, ownership, governance };
