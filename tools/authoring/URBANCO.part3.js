// Urban Company report, part 3: India services, International & Native, InstaHelp, competitive advantage.
const C = require('./URBANCO.ctx');
const { n0, n1, A24, A25, A26, q1, q1y, QL, qv, SA, D, SEG, PH, IHF, ihPvBase, shares, ntvG } = C;
const SRC = 'Urban Company shareholders\' letters (Q4FY26, Q1FY27), GAM Research';
const pctOf = (a, b) => (a != null && b ? Math.round(a / b * 1000) / 10 : null);

// ---------------------------------------------------------------- India consumer services
const ics = {
  id: 'ics', nav: 'India services', kicker: 'Segment: India consumer services', title: `The core: growth accelerating to ${q1.icsNtvYoYPct}%, margin at ${q1.icsAePct}% of NTV and rising`,
  blocks: [
    { p: `India consumer services (excluding InstaHelp) is ${Math.round(A26.icsNtv / A26.ntv * 100)}% of group NTV and the source of nearly all profit. Customers book a job (a facial, a deep clean, an AC repair) at a fixed price; a trained partner arrives with Urban Company\'s tools and products; Urban Company keeps ~34% of what the customer pays as commission, fees and product sales to the partner. NTV grew ${q1.icsNtvYoYPct}% in Q1FY27 to ₹${n0(q1.icsNtv)} cr: users +21% to 8.2 mn, spend per user +7%. Growth has accelerated for four quarters (10% → 19% → 21% → 26% → 29%), partly because Q1FY26 was hit by unseasonal rain.` },
    { pair: [
      { type: 'column', title: 'India services NTV: ₹1,000 cr in a quarter for the first time', unit: 'NTV by quarter (₹ crore)', x: QL, series: [{ name: 'NTV', values: qv('icsNtv'), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'Margins rise each year; Q1 is the seasonal high', unit: '% of NTV', x: QL, series: [{ name: 'Contribution profit', values: Q5m('icsCp', 'icsNtv'), fmt: 'pct' }, { name: 'Adjusted EBITDA', values: qv('icsAePct'), fmt: 'pct' }], labels: 'all', source: SRC },
    ] },
    { exhibit: { type: 'table', title: 'India services by year (₹ crore; margins % of NTV)', head: ['', 'FY24', 'FY25', 'FY26', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['NTV', n0(A24.icsNtv), n0(A25.icsNtv), n0(A26.icsNtv), n0(q1.icsNtv), ...[0, 1, 2].map(i => `{{F.seg.ics.driver.${i}|num}}`)],
      ['NTV growth', '–', `+${Math.round((A25.icsNtv / A24.icsNtv - 1) * 100)}%`, `+${Math.round((A26.icsNtv / A25.icsNtv - 1) * 100)}%`, `+${q1.icsNtvYoYPct}%`, ...[0, 1, 2].map(i => `+${Math.round(ntvG('ics', i))}%`)],
      ['Revenue, % of NTV', `${pctOf(A24.icsRev, A24.icsNtv)}%`, `${pctOf(A25.icsRev, A25.icsNtv)}%`, `${pctOf(A26.icsRev, A26.icsNtv)}%`, `${pctOf(q1.icsRev, q1.icsNtv)}%`, ...[0, 1, 2].map(i => `${n1(SEG.ics.revenue[i] / SEG.ics.driver[i] * 100)}%`)],
      ['Contribution profit', `${A24.icsCpPct}%`, `${A25.icsCpPct}%`, `${A26.icsCpPct}%`, `${pctOf(q1.icsCp, q1.icsNtv)}%`, '–', '–', '–'],
      { hl: true, cells: ['Adjusted EBITDA', `${pctOf(A24.icsAe, A24.icsNtv)}%`, `${pctOf(A25.icsAe, A25.icsNtv)}%`, `${pctOf(A26.icsAe, A26.icsNtv)}%`, `${q1.icsAePct}%`, ...[0, 1, 2].map(i => `${n1(SEG.ics.adjEbitda[i] / SEG.ics.driver[i] * 100)}%`)] },
    ], source: 'Q4FY26 and Q1FY27 letters; GAM Research estimates' } },
    { p: '**How the margin keeps rising.** The +170 bp YoY in Q1FY27 came in equal parts from contribution margin (AI tools cut customer and partner support costs) and operating leverage (revenue grew faster than salaries and overheads). Partners work more hours as density rises (59 a month in FY22, 90 in FY26), which raises their earnings and cuts churn and onboarding costs. Management targets 9-10% of NTV "over the next few years" and says it will not "squeeze all the margins out overnight". We assume ~120 bp a year: 5.6% / 6.8% / 7.8% for FY27-29E.' },
    { callout: '**Our view:** this is a good business: a decade of operating data, a trusted brand and density that rivals cannot buy quickly. Growth near 20% and margins rising toward 9-10% of NTV are credible. The risks are the partners (pay, social-security rules, protests) and disintermediation (customers rebooking the same partner offline).' },
  ],
};
function Q5m(a, b) { return C.Q5.map(q => pctOf(q[a], q[b])); }

// ---------------------------------------------------------------- International & Native
const intlNative = {
  id: 'intlnative', nav: 'International & Native', kicker: 'Segments: International and Native', title: 'International is a second profit engine; Native is close to breakeven',
  blocks: [
    { p: `**International** (UAE and Singapore, wholly owned) runs the India playbook for local customers and the diaspora. NTV grew ${Math.round((A26.intlNtv / A25.intlNtvExKsa - 1) * 100)}% in FY26 (ex-KSA) to ₹${n0(A26.intlNtv)} cr and ${Math.round((q1.intlNtv / q1y.intlNtv - 1) * 100)}% in Q1FY27 (58% in constant currency); adjusted EBITDA turned positive in FY26 (₹${A26.intlAe} cr) and was ₹${q1.intlAe} cr in Q1FY27. The Middle East conflict cut UAE demand 15-20% in late March 2026, without a lasting fall in frequency. In Saudi Arabia Urban Company runs **Yammak**, a 50:50 JV with SMASCO: NTV ₹${q1.ksaNtv} cr in Q1FY27 (+135%), loss narrowing to ₹${-q1.ksaAe} cr (100% basis).` },
    { p: `**Native** sells Urban Company\'s own water purifiers (sold with long service plans) and electronic door locks, on the app, on marketplaces and in stores. NTV grew 122% in FY26 to ₹${n0(A26.nativeNtv)} cr and ${Math.round((q1.nativeNtv / q1y.nativeNtv - 1) * 100)}% in Q1FY27; the loss narrowed from −25.1% of NTV (FY25) to −8.9% (FY26) and −7.3% (Q1FY27). More than half of FY26 purifier buyers were new to Urban Company. Management targets a ₹1,000 cr revenue business and sees profit "over the next few quarters"; the weaker rupee and commodity prices are a near-term cost headwind.` },
    { pair: [
      { type: 'column', title: 'International NTV +76% in Q1FY27', unit: 'International (ex-KSA) NTV by quarter (₹ crore)', x: QL, series: [{ name: 'NTV', values: qv('intlNtv'), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Native: loss stable at ~₹9 cr a quarter as NTV grows', unit: 'Native adjusted EBITDA by quarter (₹ crore)', x: QL, series: [{ name: 'Adj. EBITDA', values: qv('nativeAe'), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { callout: `**Our view:** both are real businesses, not options. We forecast International NTV +50% / 35% / 28% at margins rising to 4.5% of NTV, and Native +45% / 35% / 30%, breaking even in FY28E. Together they add ₹{{dcf.sotp.parts.1.perShare|n1}} and ₹{{dcf.sotp.parts.2.perShare|n1}} a share to our sum of the parts.` },
  ],
};

// ---------------------------------------------------------------- InstaHelp
const instahelp = {
  id: 'instahelp', nav: 'InstaHelp', kicker: 'Segment: InstaHelp', title: `InstaHelp: from 72,000 to 3.8 mn orders a quarter, at a loss of ₹${-q1.ihLossPerOrder} an order`,
  blocks: [
    { p: `InstaHelp sends a house-help professional on demand for daily cleaning and housekeeping, booked by the hour. It started in 2025 and grew from 72,000 orders in Q1FY26 to ${(q1.ihOrdersK / 1000).toFixed(1)} mn in Q1FY27. It is the most frequent service Urban Company offers: weekly or daily, against monthly or quarterly for the core. But it is in a price war: the average order fell from ₹172 (Q3FY26) to ₹${q1.ihAov}, venture-funded Snabbit and Pronto subsidise orders too, and InstaHelp lost ₹${-q1.ihAe} cr in Q1FY27 (₹235 cr in FY26). Management says the category needs ~₹200 an hour to break even (~₹150 covers only the partner and gross costs) and that getting there could take "a couple of years" or, in the worst case, five.` },
    { pair: [
      { type: 'column', title: 'InstaHelp orders: +43% QoQ in Q1FY27', unit: 'Fulfilled orders (thousand)', x: QL, series: [{ name: 'Orders', values: qv('ihOrdersK'), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'InstaHelp loss: ₹132 cr a quarter and still rising', unit: 'Adjusted EBITDA (₹ crore)', x: [...QL, 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Adj. EBITDA', values: [...qv('ihAe'), ...SEG.ih.adjEbitda.map(v => Math.round(v))], fmt: 'num' }], labels: 'all', source: `${SRC}; FY27-29E are full years` },
    ] },
    { exhibit: { type: 'table', title: 'InstaHelp unit economics', head: ['', 'Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], rows: [
      ['Orders (thousand)', ...qv('ihOrdersK').map(n0)], ['NTV (₹ cr)', ...qv('ihNtv').map(v => n1(v))], ['Average order (₹)', ...qv('ihAov').map(n0)],
      ['Adjusted EBITDA (₹ cr)', ...qv('ihAe').map(n0)], ['Loss per order (₹)', '−1,374', '−760', '−381', '−447', `−${-q1.ihLossPerOrder}`],
    ], source: 'Q1FY27 shareholders\' letter' } },
    { callout: `**Our view:** we value InstaHelp at the present value of the losses still to fund after Mar-2027 (−₹${n0(ihPvBase)} cr, ~₹${n0(ihPvBase / shares)} a share; factor ${IHF.base} on our FY28E loss), not at an option value. The strategic case is real (frequency, a "volume moat" around the core), and it could become valuable if rivals run out of money. But today each order loses more than twice what it brings in, and the street's positive values for InstaHelp (Emkay ₹28 a share, MOSL ₹10) assume an outcome that is not yet visible.` },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real moat in trust and density, weaker on price',
  blocks: [
    { verdicts: D.moat.map(([a, v, e]) => [a, v, e, /^Weak/.test(v) ? 'Not a source of excess returns' : /Strong/.test(v) ? 'Hard to copy quickly' : 'Helps, can be matched']), head: ['Source of advantage', 'Strength', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'Company filings, broker notes (MOSL, JM Financial, Emkay), GAM Research' },
    { callout: '**Verdict: a narrow but real moat in the core.** In beauty, cleaning and repairs, no online rival of size has emerged in a decade: the hard part (training, quality control, local density, trust inside the home) is what Urban Company has built. The moat is weaker against the informal market (customers can rebook a partner directly) and in InstaHelp, where the product is simpler and venture money can buy share. Pricing power exists in premium beauty, less so elsewhere.' },
  ],
};

module.exports = { ics, intlNative, instahelp, moat };
