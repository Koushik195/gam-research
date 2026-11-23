// Hero MotoCorp report, part 3b: the stakes (Ather, Hero FinCorp, Euler) and our forecasts vs the street.
const X = require('./HEROMOTOCO.ctx');
const { C, F, A, AS, n0, n1, pc, lakh, b, ST8, CMP, core, stakePs, BUILD, TOT, PARTS, OTHER, pl, emk, M, price } = X;
const fy = C.fy26, as = fy.associates, sk = C.stakes, v = core.v, sh = F.shares;
const atherMcap = sk.atherSharesOutstanding.shares * ST8.ather.price / 1e7;
const ps = x => n0(x / sh);
const atherAt = px => ({ ...ST8, ather: { ...ST8.ather, price: px } });
const { stakeValues } = require('./HEROMOTOCO.stakes');

const stakes = {
  id: 'stakes', nav: 'Ather, Hero FinCorp & other stakes', kicker: 'Stakes', title: `The stakes: ~₹${n0(stakePs)} a share after a 20% discount, over 80% of it in Ather`,
  blocks: [
    { p: `Hero owns three large minority stakes, all **equity-accounted**: the consolidated accounts carry them at cost plus Hero's share of their profits or losses (₹${n0(as.carryingHfcl + as.carryingAther + as.carryingEuler)} cr at Mar-2026: Hero FinCorp ₹${n0(as.carryingHfcl)} cr, Ather ₹${n0(as.carryingAther)} cr, Euler ₹${n0(as.carryingEuler)} cr), and one line in the P&L, "share of profit/loss of associates", carries Hero's share of their results: +₹${n0(fy.shareOfAssociates)} cr in FY26 (Hero FinCorp +₹${n0(as.hfclShare)} cr, Ather +₹${n0(as.atherShare)} cr including the ₹722 cr dilution gain, Euler −₹${n0(-as.eulerShare)} cr) and −₹44 cr in Q1FY27. Book value says nothing about what the stakes are worth, and the P&L line is mostly noise (Ather's losses, one-off gains). So, like the street, we take them out of EPS and value them separately at the 30-Sep-2026 market price or on book.` },
    { exhibit: { type: 'table', title: 'What the stakes are worth (30-Sep-2026)', head: ['Stake', 'Hero\'s holding', 'Basis', 'Gross value (₹ cr)', 'Discount', 'Value (₹ cr)', '₹ / share', 'Street (₹ / share)'], rows: [
      ['Ather Energy (listed)', `${(ST8.ather.shares / 1e7).toFixed(2)} cr shares (~32% of basic shares; ~32.8% fully diluted) + ${(ST8.ather.warrants / 1e5).toFixed(1)} lakh warrants`, `NSE close ₹${n0(ST8.ather.price)}; warrants at intrinsic value (₹${ST8.ather.warrantBalancePerShare} a share still to pay)`, n0(v.atherGross), `${ST8.ather.discount.base}%`, n0(v.ather), ps(v.ather), '429-786'],
      ['Hero FinCorp (unlisted NBFC)', `${ST8.hfcl.stakePct}% (${(sk.hfcl.sharesHeld / 1e7).toFixed(2)} cr shares)`, `${ST8.hfcl.pb.base}x Mar-26 book (net assets ₹${n0(ST8.hfcl.bookMar26)} cr)`, n0(v.hfclGross), `${ST8.hfcl.discount.base}%`, n0(v.hfcl), ps(v.hfcl), '55-215'],
      ['Euler Motors, Zero Motorcycles, BSE, Gogoro', 'Euler ~34-37%; others small', 'Mar-26 carrying value', n0(v.others), '–', n0(v.others), ps(v.others), 'not valued'],
      { hl: true, cells: ['**Total**', '', '', `**${n0(v.atherGross + v.hfclGross + v.others)}**`, '', `**${n0(v.total)}**`, `**${n0(stakePs)}**`, '**484-1,001**'] },
    ], source: 'AR FY26 note 9A/9B; Hero and Ather filings (25 and 28 Aug 2026); NSE bhavcopy (30-Sep-2026); broker notes (PL, Choice, MOSL, Emkay; Aug-2026). Per share on the model share count (20.13 cr).' } },
    { p: `**Ather Energy.** Hero has backed Ather since 2016 and owned 39.6% before its May-2025 IPO at ₹321; the IPO and later issues diluted it to 30.07% (Mar-2026) and 29.48% (Jun-2026). In 2026 Hero bought back in: 76.19 lakh warrants at ₹1,260 (₹960 cr, 25% paid, allotted 25-Aug-2026) and 1.188 cr shares from GIC at ₹1,480 (₹1,758 cr, 28-Aug-2026), taking it to ~32.8% fully diluted. At ₹${n0(ST8.ather.price)} Ather is worth ~₹${n0(atherMcap)} cr, ~${Math.round(atherMcap / as.atherRevenue)}x its FY26 revenue of ₹${n0(as.atherRevenue)} cr (net loss ₹${n0(-as.atherLoss)} cr): a growth valuation that can swing hard. We apply a 20% holding discount (no control, tax on any sale, Hero is a long-term holder), as the street (Motilal Oswal, Emkay) and our own Tata Chemicals report do.` },
    { p: `**Hero FinCorp** lends to two-wheeler buyers, MSMEs and individuals (FY26 total income ₹${n0(as.hfclRevenue)} cr). It lost ₹${n0(-as.hfclPat)} cr in FY26 on high credit costs, paid Hero only ₹6 cr of dividends, and its IPO (approved by SEBI in 2025, ~₹3,668 cr) had not launched by Sep-2026. We value Hero's 40.45% at 1.0x Mar-26 book less 20% (₹${ps(v.hfcl)} a share), inside the street's ₹55-215 range; book is generous for a loss-making lender and our bear case uses 0.7x.` },
    { exhibit: { type: 'table', title: 'Sensitivity: stake value per Hero share (₹) to Ather\'s price and the holding discount', head: ['Ather price', '₹1,000', '₹1,200', `₹${n0(ST8.ather.price)} (30-Sep)`, '₹1,650', '₹1,850'], rows: [0, 20, 30].map(d => [`${d}% discount on Ather`, ...[1000, 1200, ST8.ather.price, 1650, 1850].map(px => { const s = atherAt(px); s.ather.discount = { base: d }; return n0(stakeValues(s).total / sh); })]), source: 'GAM Research. Hero FinCorp and other holdings held at base values.' } },
    { callout: `**So what:** at ₹${n0(price)} the market pays ₹${n0(price - stakePs)} a share for Hero's own business once the stakes are counted, ~${n1((price - stakePs) / F.eps[1])}x our FY28E EPS. That is the main reason we see value. But note that our core multiple comes from Hero's own price history, and that price always included some value for these stakes: if history is adjusted for them, the core multiple would be lower (see Valuation). Ather alone is ~₹${ps(v.ather)} of our target, so a 30% fall in Ather's price would cut our target by ~₹${n0(v.ather * 0.3 / sh)}.` },
  ],
};

const segRows = keys => keys.map(k => { const s = BUILD.find(x => x.key === k); return [s.name.replace(/^Domestic motorcycles: /, 'Motorcycles: '), ...s.units.map(u => lakh(u)), pc(Math.pow(s.units[3] / s.units[0], 1 / 3) * 100 - 100)]; });
const oiTtm = M.quarterly.otherIncome.slice(-4).reduce((t, x) => t + x, 0);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: volume +{{as.volume.growth.0|n1}}% in FY27E, then ~5%; EPS ~9% a year',
  blocks: [
    { p: 'We build revenue from volume and net realisation for seven lines (entry, deluxe, 125cc and premium motorcycles, ICE scooters, VIDA, exports) plus parts and services; the build reproduces the model revenue to within 0.01%. The margin is set for the group; capex follows guidance (₹1,500 cr in FY27); other income is built from an 8-8.5% yield on earning treasury, with no yield on the stakes; associates are excluded; tax 25%; payout 70%. Every assumption and its reasoning is in the Excel model\'s Assumptions sheet, which recalculates the target price.' },
    { exhibit: { type: 'table', title: 'Volume build (lakh units)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'CAGR FY26-29E'], rows: [
      ...segRows(['entry', 'deluxe', 'm125', 'premium', 'scooter', 'ev', 'exports']),
      { hl: true, cells: ['**Total**', ...TOT.map(t => `**${lakh(t.units)}**`), `**${pc(Math.pow(TOT[3].units / TOT[0].units, 1 / 3) * 100 - 100)}**`] },
    ], source: 'FY26: SIAM via Emkay; GAM estimates. Segment reasoning in the segment chapters and the Assumptions sheet.' } },
    { exhibit: { type: 'table', title: 'Revenue build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Vehicles (units x net realisation)', ...TOT.map(t => n0(t.veh))],
      ['Spare parts', ...PARTS.map(n0)], ['Services and other operating revenue', ...OTHER.map(n0)],
      { hl: true, cells: ['**Build total**', ...TOT.map(t => `**${n0(t.rev)}**`)] },
      ['Model revenue (engine)', n0(A.sales[b]), '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['Revenue per vehicle incl. parts (₹)', ...TOT.map(t => n0(t.rev * 1e7 / t.units))],
    ], source: 'AR FY26 note 27 (FY26); GAM estimates. FY26 build differs from reported revenue by ₹7 cr (export volume basis).' } },
    { exhibit: { type: 'table', title: 'Other income: built, not plugged (₹ crore)', head: ['', 'FY26', 'Last 12 months (to Jun-26)', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Reported other income (consolidated, excl. associates and exceptional items)', n0(fy.consOtherIncome), n0(oiTtm + 119), '', '', ''],
      ['Add back Zero Motorcycles write-down; less FX gains and BSE share gain', '+89', '~+89', '', '', ''],
      ['Normalised treasury income', '~1,147', '~1,297', '', '', ''],
      ['Yield on model treasury (cash + investments − debt)', '', '', '{{F.otherIncome.0|num}}', '{{F.otherIncome.1|num}}', '{{F.otherIncome.2|num}}'],
      ['  of which: yield (8.5% / 8% / 8%) x opening model treasury', '', '', n0(8.5 / 100 * (A.cash[b] + A.investments[b] - A.borrowings[b])), '', ''],
      ['  of which: no yield on the stakes (incl. ₹1,998 cr into Ather in Aug-26)', '', '', n0(AS.otherIncome[0]), n0(AS.otherIncome[1]), n0(AS.otherIncome[2])],
    ], source: 'AR FY26 note 28; Screener quarterly other income (last 12 months shown before the ₹119 cr labour-code exceptional that Screener nets into Q3FY26); GAM estimates. FY27E sits below the last twelve months because ~₹2,000 cr of treasury went into Ather in Aug-2026 (~₹100 cr of lost yield in FY27) and Q1FY27\'s unusually high ₹460 cr (breakdown not disclosed) is not extrapolated.' } },
    { exhibit: { type: 'rows', title: 'P&L and cash-flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income (actuals incl. associates)', ref: 'fin.otherIncome' },
      { name: 'Net profit (forecasts before associates)', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts: net of debt; incl. stakes at book)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. FY26 reported EPS includes ₹722 cr of one-off associate gains (~₹283 before associates and one-offs).' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), Prabhudas Lilladher (7-Aug-26)', '{{F.eps.0|n1}}', n1(pl.eps.FY27E), '{{F.eps.1|n1}}', n1(pl.eps.FY28E)],
      ['EPS (₹), Emkay (9-Aug-26)', '{{F.eps.0|n1}}', n1(emk.eps.FY27E), '{{F.eps.1|n1}}', n1(emk.eps.FY28E)],
      ['Revenue (₹ cr), PL / Emkay (standalone)', '{{F.sales.0|num}}', `${n0(pl.sales.FY27E)} / ${n0(emk.sales.FY27E)}`, '{{F.sales.1|num}}', `${n0(pl.sales.FY28E)} / ${n0(emk.sales.FY28E)}`],
      ['EBITDA margin, PL / Emkay', '{{F.ebitdaMargin.0|pct}}', [pl, emk].map(s => n1(s.ebitda.FY27E / s.sales.FY27E * 100) + '%').join(' / '), '{{F.ebitdaMargin.1|pct}}', [pl, emk].map(s => n1(s.ebitda.FY28E / s.sales.FY28E * 100) + '%').join(' / ')],
      ['Volume (lakh), Emkay', lakh(TOT[1].units), '68.6', lakh(TOT[2].units), '71.8'],
    ], source: 'PL and Emkay Q1FY27 notes (PDFs). Brokers forecast the standalone company (~₹580 cr less revenue than consolidated); our EPS is consolidated before associates on 20.13 cr shares. Other houses\' estimates dated before 30-Sep-2026 were not available to us.' } },
    { callout: `Our FY27E EPS is close to Emkay and ~${Math.abs(Math.round((F.eps[0] / pl.eps.FY27E - 1) * 100))}% below PL; FY28E sits between them. We have more volume and revenue than both (scooters, VIDA, parts) but a lower FY28E margin than PL ({{F.ebitdaMargin.1|pct}} vs ${n1(pl.ebitda.FY28E / pl.sales.FY28E * 100)}%), because VIDA stays loss-making longer and commodity costs stay high. EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E on reported FY26 EPS (~${Math.round((Math.pow(F.eps[2] / X.EPS_CORE[2026], 1 / 3) - 1) * 100)}% on FY26 EPS before associates and one-offs).` },
  ],
};

module.exports = { stakes, forecasts };
