// UPL report, part B (3 of 4): earnings quality, ownership, governance, forecasts vs street, street view.
const X = require('./UPL.common');
const { C, D, F, A26, n0, n1, price, PLAT, coEbitda, SRC } = X;
const O = D.ownership, S = D.street, E = S.estimates;

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: two EBITDAs, factored receivables, credit losses and minorities',
  blocks: [
    { bullets: [
      '**Two EBITDA numbers.** UPL\'s own EBITDA (₹9,588 cr in FY26) leaves out exchange losses on trade receivables and payables (₹316 cr) and its share of losses in associates and joint ventures (₹194 cr). The statutory/Screener figure that this report models is ₹9,078 cr. In Q1FY27 the gap was ₹133 cr (₹1,500 cr vs ₹1,367 cr). Guidance and the street use the company number.',
      '**Receivables sold to banks.** UPL factors receivables without recourse: ₹10,231 cr at Mar-26 (₹8,875 cr a year earlier), ₹6,755 cr at Jun-26. This is legitimate and common in agrochemicals, but it lowers reported receivables and net debt, and the discount cost sits in finance costs. If banks stopped buying, UPL would need ~₹10,000 cr of extra funding.',
      '**Credit losses.** Impairment of financial assets was ₹750 cr in FY26 (₹240 cr in FY25), including a ₹350 cr group-level provision in Q4FY26 "as a prudent measure" for the credit environment. Latin American distributors are the main exposure.',
      '**Minorities.** Group profit was ₹2,220 cr in FY26 but ₹298 cr belonged to minority partners; in Q1FY27 minorities absorbed ₹84 cr of losses. Our EPS is on profit after minorities, and we expect their share to rise (Advanta).',
      '**One-offs.** FY25 profit included a ₹592 cr tax reversal after an appellate order; FY26 had an exceptional gain of ₹61 cr; associate losses (Brazilian JV, ₹83 cr in Q1FY27) recur.',
      '**Proforma platforms.** Platform figures are management numbers, before eliminations; UPL SAS excludes "Nurture"; Advanta was restated for Decco. They reconcile to the group within ~₹50 cr.',
      '**Audit.** B S R & Co. (KPMG network); related-party transactions are a key audit matter given inter-platform supply contracts; no qualification found.',
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing we found suggests misstatement, and disclosure has improved (platform P&Ls, net-debt bridges, factoring footnotes). But reported profit depends on several management choices (factoring, credit provisions, what sits above or below EBITDA), and cash flow swings by ₹8,000 cr within a year. Investors should look at March and June balance sheets together.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `The Shroff family owns ${O.jun2026.promoter}% (mainly through Nerka Chemicals, 21.41%, and Uniphos Enterprises, 4.94%) with nothing pledged since Dec-2024. Foreign investors own ${O.jun2026.fii}%, up from 34% in Dec-2023; Indian institutions have sold (LIC from 4.51% to 3.48% in the June quarter), though mutual funds bought (7.2% to 8.6%).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders above 1% (Jun-2026)', head: ['Holder', 'Stake'], rows: O.named.map(([h, p]) => [h, p + '%']), source: `${O.src} (${O.published})` } },
  { callout: `**Our read:** a third-owned family company with a large, mostly foreign institutional base. No pledge is a positive (${O.pledgeHistory}). Inside the platforms, the private-equity partners (TPG, ADIA, Brookfield, KKR, Alpha Wave) are effectively co-owners of the best assets; the scheme and the IPO give them exits.` },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a capable family-run group with a complex structure',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note]), source: 'UPL FY26 and Q1FY27 presentations, Q1FY27 call' } },
    { verdicts: [
      ['Board', 'Moderate', C.governance.board, 'Reasonable independence; platform boards add PE oversight.'],
      ['Promoter and pledge', 'Strong', C.governance.promoter, 'No pledge; family aligned as shareholders.'],
      ['Structure and related parties', 'Weak', 'Four platforms with outside owners in three; Cayman/Mauritius holding chain; inter-platform supply contracts; related-party transactions are the auditor\'s key audit matter.', 'Value can leak between entities; hard for outsiders to check.'],
      ['Promoter pay disclosure', 'Weak', C.governance.pay, 'Executive chairmen\'s pay is not visible in UPL Ltd\'s disclosures.'],
      ['Management continuity', 'Weak', 'UPL Corp CEO (and UPL Global CEO-designate) Mike Frank and Group COO Toshan Tamhane both left on 31-Aug-2026.', 'Execution risk during the reorganisation.'],
      ['Capital allocation', 'Moderate', 'The Arysta deal (FY19) left the group levered for seven years; since FY24 the focus is deleveraging (rights issue, perpetual bond repaid, $850 mn of gross debt cut in FY26).', 'Better recently; history is mixed.'],
      ['Credit standing', 'Improving', C.governance.ratings, 'Outlooks upgraded in 2025-26.'],
      ['Disclosure', 'Strong', 'Quarterly platform P&Ls, net-debt and working-capital bridges, factoring footnotes, guidance tracked against delivery.', 'Better than most Indian peers.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: C.governance.src },
  ],
};

// ---------------------------------------------------------------- Forecasts
const segRow = (k, name, field, hist) => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.${field}.${i}|num}}`)];
const coE = [0, 1, 2].map(coEbitda);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EBITDA in line with guidance, EPS below the street',
  blocks: [
    { p: 'We forecast revenue and EBITDA margin for each platform (company basis), subtract eliminations, and then deduct exchange losses on trade balances, associate losses and group items to get statutory EBITDA. Below EBITDA we model depreciation, finance costs, tax and the minority partners\' share. The Excel model\'s Assumptions sheet carries every driver with our reasoning and recalculates this report\'s target.' },
    { exhibit: { type: 'table', title: 'Platform forecasts (₹ crore, company basis)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...PLAT.flatMap(([k, nm]) => [{ sec: nm }, segRow(k, 'Revenue', 'revenue', A26[k + 'Rev']), segRow(k, 'EBITDA', 'adjEbitda', A26[k + 'Ebitda'])]),
      { sec: 'Group' },
      ['Eliminations (revenue)', n0(A26.elimRev), '{{F.seg.elim.revenue.0|num}}', '{{F.seg.elim.revenue.1|num}}', '{{F.seg.elim.revenue.2|num}}'],
      ['Sum of platform EBITDA', n0(9539), ...coE.map(n0)],
      ['Group items, FX on trade, associates', '−461', '{{F.unalloc.0|num}}', '{{F.unalloc.1|num}}', '{{F.unalloc.2|num}}'],
      ['Statutory EBITDA', n0(9078), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
    ], source: 'UPL presentations (FY26), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow (₹ crore; profit after minorities)', from: 'FY24', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (statutory)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Net profit after minorities', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs broker estimates standing on 30-Sep-2026', head: ['', 'GAM FY27E', 'Arihant FY27E', 'GAM FY28E', 'Arihant FY28E', 'Anand Rathi FY28E'], rows: [
      ['EBITDA, company basis (₹ cr)', n0(coE[0] - 50), n0(E.arihant.fy27Ebitda), n0(coE[1] - 50), n0(E.arihant.fy28Ebitda), 'n.d.'],
      ['Profit after minorities (₹ cr)', '{{F.pat.0|num}}', n0(E.arihant.fy27PatAdj), '{{F.pat.1|num}}', n0(E.arihant.fy28PatAdj), '4,350'],
      ['EPS (₹)', '{{F.eps.0|n1}}', '40.3*', '{{F.eps.1|n1}}', n1(E.arihant.fy28Eps), n1(E.anandRathi.fy28Eps)],
    ], source: 'Arihant Capital (3-Aug-2026), Anand Rathi (22-Feb-2026), GAM Research. *Arihant prints 45.2; ₹40.3 = its adjusted PAT on 84.4 cr shares. GAM company-basis EBITDA = platforms less ~₹50 cr of group items. No FY27-28 consensus dated Jul-Sep 2026 was found; implied FY28E EPS behind post-Q1 targets is ~₹50-51 (Motilal Oswal 12x → ₹600; Jefferies 14x Jun-28E → ₹715).' } },
    { callout: `**Where we differ:** our EBITDA is close to guidance (FY27E company EBITDA +${n1((coE[0] - 50) / 9588 * 100 - 100)}% vs +10-14% guided) and to Arihant. Our EPS is lower because we assume (1) finance costs fall only gradually (₹3,401 cr → ₹2,550 cr by FY29E) given factoring costs and dollar debt; (2) exchange losses and associate losses continue (₹380-520 cr a year); and (3) minorities take 14% → 18.5% of profit as Advanta grows and UPL sells 7.8% of it. Each ₹100 cr of lower finance cost adds ~₹0.7 to EPS.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: mostly Buy, but targets have been cut all year',
  blocks: [
    { p: `Seven brokers published calls around the Q1FY27 results: four Buys (Jefferies ₹715, Elara ₹783, Arihant ₹748, DAM Capital ₹870), one Accumulate (Deven Choksey ₹688, a preview), one Hold (Systematix ₹670) and one Neutral (Motilal Oswal ₹600). Targets have come down through 2026 (Elara ₹980 → ₹783; Jefferies ₹810 → ₹715; Motilal Oswal ₹730 → ₹600). Kotak (Reduce, ₹650) and Nuvama (Hold, ₹816) were the sceptics around the reorganisation. ${S.reaction}.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker notes and press to 30-Sep-2026; company disclosures' } },
  ],
};

module.exports = { sectionsA: () => [quality], ownership, sectionsB: () => [governance, forecasts, street] };
