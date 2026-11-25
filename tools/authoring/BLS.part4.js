// BLS report, part 4: Q1FY27 & guidance, earnings quality, ownership, governance, forecasts vs the street.
const X = require('./BLS.ctx');
const { C, D, F, A, AS, A26, n0, n1, pc, pc1, b, shortDate, tre0, oi26, oiTreas, q, seg, ebitdaCo, marginCo, idbiInit, grossYield } = X;
const Q = C.q1fy27, OI = C.otherIncomeFY26;
const yoy = (a, p) => pc1((a / p - 1) * 100);
const q1 = q('Q1FY27'), q0 = q('Q1FY26');

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: record revenue (+25%) and EBITDA (+24%), but EPS +11% as tax, depreciation and minorities rose',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Revenue from operations', '710.6', n1(Q.revenue), yoy(Q.revenue, 710.6)],
      ['  Visa & Consular', n1(q0.visaRev), n1(q1.visaRev), yoy(q1.visaRev, q0.visaRev)],
      ['  Digital Services', n1(q0.digRev), n1(q1.digRev), yoy(q1.digRev, q0.digRev)],
      ['EBITDA', '204.2', n1(Q.ebitda), yoy(Q.ebitda, 204.2)],
      ['EBITDA margin: group / Visa / Digital', `28.7% / ${n1(q0.visaEbitda / q0.visaRev * 100)}% / ${n1(q0.digEbitda / q0.digRev * 100)}%`, `${Q.ebitdaMargin}% / ${Q.visaMargin}% / ${Q.digitalMargin}%`, ''],
      ['Depreciation and amortisation', '22.8', n1(Q.dep), yoy(Q.dep, 22.8)],
      ['Other income', '25.1', n1(Q.otherIncome), yoy(Q.otherIncome, 25.1)],
      ['Tax (rate)', '19.2 (9.6%)', `${n1(Q.tax)} (14.4%)`, yoy(Q.tax, 19.2)],
      ['Net profit (before minorities)', '181.0', n1(Q.pat), yoy(Q.pat, 181)],
      { hl: true, cells: ['**Owners\' profit / EPS (₹)**', '**171 / 4.15**', `**${Q.patOwners} / ${Q.eps}**`, `**${yoy(Q.eps, 4.15)}**`] },
      ['Visa applications (lakh) / net revenue per application (₹)', `${q0.apps} / ${n0(q0.nrpa)}`, `${q1.apps} / ${n0(q1.nrpa)}`, `${yoy(q1.apps, q0.apps)} / ${yoy(q1.nrpa, q0.nrpa)}`],
    ], source: 'Q1FY27 presentation (7-Aug-2026) and call (11-Aug-2026); Screener (owners\' profit, EPS)' } },
    { bullets: [
      '**What went right:** the highest revenue and EBITDA in BLS\'s history; Visa margin held at 40.3%; Digital margin up to 8.0%; Citizenship Invest +59% (Middle East residents seeking residency elsewhere); net cash up to ₹1,617 cr.',
      '**What did not:** visa applications flat in the seasonally strongest quarter despite new Slovakia and Cyprus contracts; D&A +39% (Aadhaar centres, leases); tax rate 14.4% (9.6%); EPS only +11%.',
      '**What changed after the quarter:** Atyati consolidated from 2-Jul-2026; BLS bought more BLS E-Services shares; the Board did not take up a buyback.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (May and Aug-2026)', head: ['Topic', 'What was said'], wide: [1], rows: C.guidance.map(g => [g.item, g.text]), source: 'Q4FY26 call (20-May-2026); Q1FY27 call (11-Aug-2026); AR FY26' } },
    { callout: 'Management\'s guidance has drifted down in tone: "20-25%" growth for FY27 in May became "15-20% organically for five years" in August, and "net revenue per application is now stabilising". Visa growth is now a price-and-mix story on flat volumes, plus contract wins we cannot forecast. We sit inside the guidance on visa (+13% ex-Aadhaar) and above it on reported group revenue because Atyati and Aadhaar are additions.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: strong cash conversion, but low tax, rising minorities and acquisition goodwill',
  blocks: [
    { bullets: [
      `**Cash conversion is strong.** Cash from operations was ₹${n0(A.cfo[b])} cr in FY26, ${Math.round(A.cfo[b] / A.pat[b] * 100)}% of owners' profit (${Math.round(A.cfo[b - 1] / A.pat[b - 1] * 100)}% in FY25); fees are collected in advance and receivables are 21 days.`,
      `**Other income is mostly interest.** FY26 other income of ₹${n1(oi26)} cr: deposits ₹${n1(OI.items.fdInterest)} cr, bonds ₹${n1(OI.items.bondInterest)} cr, debt-fund gains ₹${n1(OI.items.mfGains)} cr, FX gain ₹${n1(OI.items.fxGain)} cr (one-off), insurance/commission and misc. ₹${n1(OI.items.insuranceCommission + OI.items.misc)} cr. We build FY27E as ${AS.treasuryYield[0]}% on the engine's opening net treasury of ₹${n0(tre0)} cr (net of leases and minorities at book; ~${n1(grossYield[0])}% on gross cash and deposits) = ₹${n0(oiTreas[0])} cr, plus ₹${AS.otherIncome[0]} cr of other items: ₹{{F.otherIncome.0|num}} cr, vs ₹${n1(oi26)} cr in FY26 and ₹${n1(Q.otherIncome)} cr × 4 in Q1FY27.`,
      '**Tax is low and may rise.** The effective rate was 9.2% in FY26 (14.4% in Q1FY27): much of the visa profit is booked in a UAE free-zone subsidiary. Management guides ~12% for FY27; a UAE rate change or more profit in India (Aadhaar) would lift it.',
      '**Minorities take a growing share.** Owners\' profit was 95% of reported profit in FY26 (₹687 cr of ₹724 cr) and 94% in Q1FY27; outside shareholders own ~47% of BLS E-Services and 43% of Aadifidelis, the fastest-growing parts.',
      '**Goodwill is half of net worth** (₹1,213 cr), tested annually with no impairment so far. The auditor\'s opinion is unmodified, with an emphasis of matter on a dormant Punjab e-governance subsidiary.',
      '**Value-added services are the profit lever and a regulatory target:** the MEA order of Oct-2025 cited complaints about charging for optional services (the order was quashed on process).',
    ] },
    { callout: '**Accounting flag: AMBER.** Cash conversion is excellent and the audit opinion clean, but three things make reported EPS less solid than it looks: a tax rate that depends on the UAE structure, a growing minority share, and a balance sheet built increasingly on acquisition goodwill whose returns management could not quantify.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Aggarwal family and its investment companies own ${OH.categories.promoters}% (Jun-2026). ${OH.promoters} Foreign investors own ${OH.categories.fii}%, domestic institutions ${OH.categories.dii}%, other bodies corporate ${OH.categories.bodiesCorporate}% and individuals and others ${OH.categories.others}% (free float ~29.6%). ${OH.namedInstitutions} ${OH.trend}.` },
  ...base.blocks,
  { callout: '**Our read:** a tightly held, family-controlled company with a small free float (~₹3,000 cr at Jun-26 prices) and falling foreign ownership. Retail holders (2.24 lakh) have absorbed the foreign selling. The promoter stake fell from 74.4% (Mar-23) to 70.4% (Sep-24) while the share capital stayed at ~₹41 cr, so the family sold roughly 4% in that period; it has been steady since.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a family-run company with related-party rent, a large pay rise for the chairman, and a government client that tried to bar it',
  blocks: [
    { p: D.governance.board },
    { verdicts: [
      ['Audit and accounts', 'Moderate', 'Unmodified opinion on FY26 consolidated accounts; emphasis of matter on the Punjab e-governance subsidiary; goodwill ₹1,213 cr with no impairment.', 'No red flags; goodwill is the judgement area.'],
      ['Related parties', 'Watch', 'Rent paid to the chairman ₹8.41 cr in FY26 (₹4.49 cr in FY25) and smaller rents to other family members.', 'Small against profit, but rising and family-linked.'],
      ['Pay', 'Watch', 'Chairman became executive (Aug-2025): pay ₹4.56 cr vs ₹0.22 cr; managerial pay +18.3% vs +1.4% for the median employee; chairman at 109x the median employee.', 'Generous relative to the workforce.'],
      ['Client relations', 'Watch', 'MEA debarment (Oct-2025) quashed by the Delhi High Court (Dec-2025); the MEA may issue a fresh, specific notice on service quality.', 'Reputation with India\'s government is an open question.'],
      ['Capital allocation', 'Moderate', '~₹1,010 cr of acquisitions in FY23-26 plus ₹157 cr (Atyati) and ₹45 cr (BLS E-Services shares) in FY27; payout 15%; no buyback.', 'Returns on acquisitions asserted (17-20%), not shown.'],
      ['Disclosure', 'Moderate', 'Quarterly decks with segment, application and NRPA data; no country split; tax and minority details only in the annual report.', 'Better than most mid-caps; client concentration opaque.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'AR FY26 (related-party note, directors\' report, auditor\'s report); Delhi High Court judgment (18-Dec-2025); Q1FY27 call' },
  ],
};

const gap = (g, s) => Math.round((g / s - 1) * 100);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}}, growing ~{{F.epsGrowth.1|pct0}} a year after FY27',
  blocks: [
    { p: `We build each segment from business lines (visa ex-Aadhaar, Aadhaar, digital organic, Atyati): revenue grows {{F.salesGrowth.0|pct}} / {{F.salesGrowth.1|pct}} / {{F.salesGrowth.2|pct}} and company-basis EBITDA ₹${n0(ebitdaCo[0])} / ${n0(ebitdaCo[1])} / ${n0(ebitdaCo[2])} cr (margin ${n1(marginCo[0])}% → ${n1(marginCo[2])}%). Screener's annual EBITDA, which the model uses, adds back bank charges (1% of revenue) and puts them in interest. D&A ~₹{{F.dep.0|num}} cr in FY27E (6.7% of gross block); capex ₹190-220 cr; other income built from treasury yield plus ₹18-20 cr of other items; tax plus minorities ${AS.taxRate[0]}% then ${AS.taxRate[1]}% (tax ~12%, minorities ~5.5% of PBT); payout 15%. FY27E EPS grows only {{F.epsGrowth.0|pct}} because the tax-plus-minority leakage rises from 13.8% to ${AS.taxRate[0]}% and D&A jumps; after that EPS grows with EBITDA. We assume no new acquisitions, no buyback and no contract losses. Every assumption is in the Excel model's Assumptions sheet.` },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA (Screener basis)', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' }, { name: 'Depreciation', ref: 'fin.dep' },
      { name: 'Other income', ref: 'fin.otherIncome' },
      { name: 'Net profit to owners', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the only published street estimates', head: ['', 'GAM FY27E', 'IDBI FY27E (Dec-2025)', 'Gap'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', n0(idbiInit.revenue.FY27E), pc(gap(F.sales[0], idbiInit.revenue.FY27E))],
      ['EBITDA (₹ cr; IDBI on the company basis)', n0(ebitdaCo[0]), n0(idbiInit.ebitda.FY27E), pc(gap(ebitdaCo[0], idbiInit.ebitda.FY27E))],
      { hl: true, cells: ['**EPS (₹)**', '**{{F.eps.0|n1}}**', `**${n1(idbiInit.eps.FY27E)}**`, `**${pc(gap(F.eps[0], idbiInit.eps.FY27E))}**`] },
    ], source: 'IDBI Capital initiation (Dec-2025). IDBI cut its target twice since (Feb and May-2026) but its revised estimates are behind a login; no dated consensus standing on 30-Sep-2026 was found.' } },
    { callout: `We are below IDBI's Dec-2025 EPS mainly on tax and minorities (IDBI's FY27E net profit of ₹854 cr on similar EBITDA implies a lower leakage) and depreciation (Aadhaar centres and leases). IDBI's two target cuts since suggest its estimates have also come down. Our EPS compounds ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E, against ${Math.round(X.epsCagrHist)}% over FY23-26.` },
  ],
};

module.exports = { guidance, quality, ownership, governance, forecasts };
