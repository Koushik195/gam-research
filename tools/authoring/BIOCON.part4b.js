// Biocon report, part 4b: earnings quality (one-offs, other income build, minorities, amortisation), ownership, management
// and governance.
const X = require('./BIOCON.ctx2');
const { C, D, F, A, AS, n0, n1, pc, rup, b, GROSS_OI, miPre, mi, oiBuild, synPat, YRS, ADJ_PAT, FM, PEADJ } = X;
const F26 = C.fy26, EX = F26.exceptionalPreTax, OI26 = F26.otherIncome, OW = D.ownership, GV = C.governance;

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: one-offs in five of the last five years, other income inside "EBITDA", minorities until 2026',
  blocks: [
    { p: 'Four things a reader of Biocon\'s numbers should know. (1) **One-off gains and charges every year.** FY24 profit included a ₹530 cr gain on Bicara (dilution and fair value) and ₹350 cr from selling two branded units; FY25 a ₹1,057 cr gain on selling the India branded business and one-time US lenalidomide (~₹281 cr of EBITDA); FY26 ₹403 cr of pre-tax exceptional costs (integration, transaction, labour codes, inventory write-downs, a litigation settlement) partly offset by a ₹184 cr derivative gain. These gains sit in other income, not in "exceptional items", so Screener\'s profit before exceptional items still includes them. (2) **Company "EBITDA" includes other income** (FY26 ₹3,798 cr vs ₹3,471 cr before it); we forecast before other income. (3) **Minorities**: until January 2026 a quarter of BBL belonged to others, so consolidated profit overstated what shareholders earned (FY25: ₹1,429 cr before minorities, ₹1,013 cr after). (4) **Amortisation and capitalisation**: Biocon capitalises development costs (intangibles under development ₹2,392 cr at Jun-26) and borrowing costs on projects (Screener flags it), which flatters EBITDA today and raises amortisation later (D&A +20% YoY in Q1FY27).' },
    { exhibit: { type: 'table', title: 'One-offs in reported profit (₹ crore, pre-tax unless stated)', head: ['Year', 'Item', 'Amount', 'Where it sits'], wide: [1], rows: [
      ['FY24', 'Bicara stake dilution and fair-value gain', '+530', 'Other income (Novels segment)'],
      ['FY24', 'Sale of two India branded formulation units', '+350', 'Other income'],
      ['FY25', 'Sale of the India branded formulations business (slump sale)', '+1,057', 'Other income (note 22)'],
      ['FY25', 'One-time US generic lenalidomide (EBITDA)', '~+281', 'Revenue / EBITDA (generics)'],
      ['FY25', 'Refinancing write-off of loan fees; inventory provision reversal; Viatris receivable settlement gain; Syngene insurance', '−122 / +89 / +114 / +32', 'Exceptional items'],
      ['FY26', 'Labour codes (gratuity)', `${EX.labourCode}`, 'Exceptional items'],
      ['FY26', 'Gain on remeasuring the Mylan derivative (BBL stake deal)', `+${EX.mylanDerivativeGain}`, 'Exceptional items'],
      ['FY26', 'Advisory, hedging, bridge financing, lender settlement, Mylan receivable write-off', `${EX.transactionCosts}`, 'Exceptional items'],
      ['FY26', 'BBL integration (severance, consultants, accelerated ESOPs)', `${EX.integration}`, 'Exceptional items'],
      ['FY26', 'BBL inventory provision; litigation settlement; Syngene severance; IFQM write-down', `${EX.bblInventory} / ${EX.litigation} / ${EX.syngeneTermination} / ${EX.ifqm}`, 'Exceptional items'],
      { hl: true, cells: ['**FY26**', '**Total exceptional items (pre-tax)**', `**${EX.total}**`, '**After tax and minorities: −₹50 cr (company)**'] },
      ['Q1FY27', 'Termination benefits', '−13', 'Exceptional items (−₹4 cr after tax and minorities)'],
    ], source: 'AR FY25/FY26 notes 22, 32 and 40; Q4FY26 and June-2026 presentations; Q1FY27 fact sheet' } },
    { p: `**Why this matters for valuation.** On reported EPS Biocon's forward P/E since Apr-2021 has a median of ${n1(FM.median)}x after the house rule drops FY26-27 as trough years (all dates: ${n1(FM.medianAll)}x). On EPS before one-offs (MOSL's adjusted profit: ₹${n0(ADJ_PAT[2023])} / ${n0(ADJ_PAT[2024])} / ${n0(ADJ_PAT[2025])} / ${n0(ADJ_PAT[2026])} cr in FY23-26) the median since Apr-2022 is ~${Math.round(PEADJ.med)}x, ranging ${Math.round(PEADJ.min)}-${Math.round(PEADJ.max)}x. Neither is a usable anchor, which is why the house excludes Biocon from the pharma P/E set (PLAYBOOK §7c) and why we, like the street, value it on EBITDA.` },
    { h: 'Other income: built from its parts, not plugged' },
    { exhibit: { type: 'table', title: 'Other-income build (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [5], rows: [
      ['Interest on deposits and other interest', n0(OI26.depositInterest + OI26.otherInterest), '155', '160', '165', '~5.5% on ~₹2,800-3,000 cr of cash and liquid investments (₹2,833 cr at Jun-26)'],
      ['Fund gains, fair-value gains and other non-operating income', n0(OI26.currentInvGains + OI26.fvtplGains + OI26.otherNonOp), '65', '70', '75', 'FY26 included ₹80 cr of fair-value gains we do not repeat; Q1FY27 total other income ₹55 cr'],
      { hl: true, cells: ['**Gross other income**', `**${n0(OI26.total)}**`, ...GROSS_OI.map(x => `**${n0(x)}**`), '**4 x Q1FY27 ≈ ₹220 cr**'] },
      ['Less: Syngene minorities, pre-tax equivalent', '–', ...miPre.map(x => `−${n0(x)}`), `47.6% of Syngene profit (₹${synPat.map(n0).join(' / ')} cr) = ₹${mi.map(n0).join(' / ')} cr after tax, grossed up at Biocon's tax rate`],
      { hl: true, cells: ['**Other income in the model**', '–', ...oiBuild.map(x => `**${n0(x)}**`), '**assumptions.otherIncome (checked in BIOCON.ctx.js)**'] },
    ], source: 'AR FY26 note 22; Q1FY27 fact sheet; GAM estimates' } },
    { p: `**Reconciliation.** Gross FY27E other income of ₹${GROSS_OI[0]} cr compares with ₹${n0(OI26.total)} cr reported in FY26 and ₹317 cr in the twelve months to Jun-26 (Screener quarterly, before exceptional items: ₹93 + 117 + 53 + 55 cr). We do not repeat FY26's ₹80 cr of fair-value gains or Q3FY26's unusually high ₹117 cr; Q1FY27's ₹55 cr annualises to ₹220 cr. Treasury income does not grow much because the cash balance stays flat while free cash repays debt. The engine has no minority line, so the deduction for Syngene's minorities sits here; it grows from ₹${n0(miPre[0])} cr to ₹${n0(miPre[2])} cr as Syngene's profit recovers, which is why "other income" turns slightly negative in FY29E.` },
    { callout: '**Verdict: AMBER.** Revenue recognition and cash conversion are sound (operating cash flow was 92-125% of EBITDA in FY24-25 and 57% in FY26 as inventory rose; KPMG-network auditor). But Biocon has had a one-off of some kind in every recent year, gains in other income have flattered reported EPS, capitalised development and interest flatter EBITDA, and the company\'s own "EBITDA" and "core EBITDA" definitions differ from ours. Our forecasts carry no one-offs.' },
  ],
};

const ownership = base => ({
  ...base,
  blocks: [
    { p: `On 30-Jun-2026 (latest pattern published by 30-Sep) Biocon had ${n0(OW.totalShares)} shares and ${n0(OW.shareholders)} shareholders. Kiran Mazumdar-Shaw holds 29.73% directly and 14.56% through Glentec International (Mauritius): the promoter group owns 44.68%, down from 60.64% a year earlier after two QIPs and the BBL share swap, with nothing pledged. Indian mutual funds own 15.5% (the QIPs went mostly to SBI and ICICI Prudential MF) and insurers 6.4% (LIC 3.73%). Foreign portfolio investors own only 8.1%. Mylan (Viatris) holds 5.64% from the swap; its six-month lock-up ran out in July 2026, so a block sale is possible at any time. Serum Institute Life Sciences (3.40%) and Activ Pine (1.08%) also came in through the swap. 12.5% of shares were locked in at 30-Jun.` },
    { exhibit: { type: 'table', title: 'Named holders, 30-Jun-2026', head: ['Holder', '% of shares'], rows: OW.named.map(([n, p]) => [rup(n), `${n1(p)}%`]), source: 'Shareholding pattern, Q1FY27 (biocon.com)' } },
    ...base.blocks,
    { callout: '**So what:** the free float is now large (55%) and dominated by Indian institutions that bought at ₹330-368 in the QIPs, a supportive base. The overhang is Viatris\'s 9.2 cr shares (₹3,400 cr at the 30-Sep price): Viatris is now a purely financial holder after ending the partnership, and a block sale would likely come at a discount.' },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'People and governance', title: 'Management and governance: a professional operating team under a founder-chair who has named a family successor',
  blocks: [
    { exhibit: { type: 'table', title: 'Who runs Biocon', head: ['Person', 'Role'], wide: [1], rows: C.management.map(m => [m.name, rup(m.role)]), source: 'AR FY26 (KMP list); shareholding pattern; Q1FY27 press release; Deccan Herald (5-May-2026)' } },
    { p: 'Kiran Mazumdar-Shaw, 73, founded Biocon in 1978 and remains executive chairperson; she has no children. In May 2026 she named her niece Claire Mazumdar, 37, founder-CEO of Bicara, as her eventual successor as chair over about five years, adding that she was "not hanging up her boots" (Deccan Herald, 5-May-2026). Day-to-day leadership was professionalised at the integration: Shreehas Tambe (who built BBL\'s commercial business) became CEO & MD of Biocon on 1-Apr-2026, Kedar Upadhye (BBL CFO, earlier Cipla) became CFO, and Siddharth Mittal moved to run Syngene. Two long-serving independent directors (Bobby Parikh, Nicholas Haggar) left the board in July-August 2026.' },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Evidence'], wide: [2], rows: [
      ['Capital allocation for minority shareholders', 'Weak', 'Five years of value moved to partners (BBL minority rounds, structured instruments at high cost) and then bought back with 36% dilution; ROCE 4-6% since FY23'],
      ['Disclosure', 'Average', 'Segment EBITDA and product bands given; no revenue or margin guidance; non-standard EBITDA definitions; frequent one-offs'],
      ['Board and succession', 'Mixed', 'Professional CEO and CFO; but succession to the chair is a family member running a related party (Bicara), and two independents left in 2026'],
      ['Related parties', 'Watch', 'Bicara (~10% held, CEO is the named successor); Biocon Foundation and Mazumdar Shaw Medical Foundation'],
      ['Regulatory conduct', 'Watch', 'June-2022 CBI case: a BBL executive and a drug-controller official arrested over an alleged bribe to waive a phase-3 trial for insulin aspart in India; the company denied wrongdoing; no outcome found by 30-Sep-2026. US FDA record clean (all key sites VAI)'],
      ['Promoter alignment', 'Good', '44.7% owned by the founder group, no pledge; its 72.8 cr shares are unchanged since Mar-2025 (diluted by the issues, not a seller)'],
    ], source: 'AR FY26; shareholding pattern Jun-2026; Scroll and The Print (21-Jun-2022); GAM Research' } },
    { callout: '**Verdict: AMBER.** A capable operating team and an aligned, unpledged founder, but a long record of financial engineering at the subsidiary level that cost minority shareholders, and a succession plan that keeps control in the family through someone outside the operating business. The simpler structure since FY26 is a genuine improvement.' },
  ],
};

module.exports = { quality, ownership, governance };
