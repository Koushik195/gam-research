// Sun Pharma report, part 3b: Emerging Markets, Rest of World and API; the pending Organon acquisition.
const X = require('./SUNPHARMA.ctx');
const { C, F, SA, SQ, QL, n0, n1, pc, rup, usdBuild, OG, fx, ORG, PF, cashUsedCr, cashUsedPs, cashIncPs, dealMult, synergyPs, shortfallPs, MULT, epsSep, pfEbitdaCr, evPaidCr, equityPaidCr, shares, V } = X;
const OR = C.organon;

const emrow = {
  id: 'emrow', nav: 'EM, RoW & API', kicker: 'Segments: Emerging Markets, Rest of World, API', title: 'EM and RoW: a third of sales, growing high single digits in dollars; currency flatters the rupee numbers',
  blocks: [
    { p: `**Emerging Markets** (₹11,187 cr, 19% of FY26 sales) are branded generics sold by ~3,300 reps in 80+ countries, with local plants in Bangladesh, South Africa, Malaysia, Romania, Egypt, Nigeria, Morocco and Russia. FY26 sales were $1,265 mn (+13.6%; +8.2% in constant currency); Q1FY27 $311 mn, only +4.2%, which management put down to "geopolitical issues and difficult macroeconomic conditions in certain countries". Ilumya is now sold in several EMs (Romania, Brazil) and semaglutide is approved in South Africa (launched) and Brazil (partner launch due). **Rest of World** (₹8,568 cr, 15%) covers Western Europe, Canada, Japan, Australia and Israel: $969 mn in FY26 (+14.4%, led by Ilumya and Odomzo), but flat at $218 mn for two quarters. **API** (₹2,185 cr, 4%) supplies Sun's own formulations and third parties from 13 sites.` },
    { pair: [
      { type: 'stacked', title: 'EM + RoW: ₹3,951 cr a quarter in Q1FY25, ₹5,014 cr in Q1FY27', unit: '₹ crore per quarter (EM and RoW split from Q4FY25)', x: QL.slice(3), series: [{ name: 'Emerging Markets', values: SQ.slice(3).map(q => Math.round(q.em)), fmt: 'num' }, { name: 'Rest of World', values: SQ.slice(3).map(q => Math.round(q.row)), fmt: 'num' }], minLabel: 1500, source: 'Company presentations; Emkay Q4FY26 note; PL Q1FY27 note' },
      { type: 'column', title: 'Our dollar build: EM +6-7%, RoW +3-6% a year', unit: '$ mn, GAM estimates', x: ['FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Emerging Markets', values: usdBuild.em.map(Math.round), fmt: 'num' }, { name: 'Rest of World', values: usdBuild.row.map(Math.round), fmt: 'num' }], labels: 'all', source: 'GAM estimates' },
    ] },
    { callout: '**Our view:** good, profitable businesses that diversify Sun away from the US, but their rupee growth in FY26-27 is half currency (the rupee fell from ~85 to ~96 per dollar). We assume dollar growth of +6% / +7% / +7% (EM) and +3% / +6% / +6% (RoW), a flat rupee after Sep-2026, and no Leqselvi or Unloxcyt sales outside the US in FY27 (management).' },
  ],
};

const organon = {
  id: 'organon', nav: 'The Organon deal', kicker: 'Pending acquisition', title: `Organon: Sun doubles in size for $11.75 bn; cheap on earnings, expensive on what it does to the balance sheet`,
  blocks: [
    { p: `On 27-Apr-2026 Sun signed a definitive agreement to buy **Organon & Co.** (NYSE: OGN), the women's-health, biosimilars and established-brands company spun out of Merck in 2021, for **$14.00 a share in cash: equity value $3.99 bn, enterprise value $11.75 bn**. Organon's shareholders approved it in July 2026; regulatory filings were complete and some approvals received by 31-Jul-2026; closing is guided for Q4FY27 (Jan-Mar 2027). Sun will pay $2.0-2.5 bn from its own cash and the rest with committed bank debt, and inherit Organon's ~$8.5 bn of debt. ${rup(OR.organonFacts)}` },
    { pair: [
      { type: 'table', title: 'Deal terms', head: ['', 'Value'], rows: [
        ['Price per Organon share', '$14.00 cash'], ['Equity value', `$3.99 bn (₹${n0(equityPaidCr)} cr)`], ['Enterprise value', `$11.75 bn (₹${n0(evPaidCr)} cr)`],
        ['EV / 2025 adjusted EBITDA ($1,907 mn)', `${n1(dealMult)}x`], ['Equity / 2025 adjusted net income ($954 mn)', `${n1(3990 / 954)}x`],
        ['Funding', '$2.0-2.5 bn Sun cash + bank debt'], ['Pro-forma net debt / EBITDA', '~2.3x'], ['Cost synergies', '~$350 mn in 2-4 years'], ['Expected closing', 'Q4FY27'],
      ], source: `Sun investor call (27-Apr-2026); Organon 8-K (12-Feb-2026); rupee at ${fx} (30-Sep-2026)` },
      { type: 'hbar', title: "Organon 2025 revenue: 59% established brands", unit: 'Organon FY2025 revenue by franchise ($ mn)', x: ['Established brands', "Women's health (Nexplanon $921 mn)", 'Biosimilars', 'Other'], series: [{ name: 'Revenue', values: [3691, 1752, 691, 82], fmt: 'num' }], labels: 'all', source: 'Organon 8-K, 12-Feb-2026' },
    ] },
    { exhibit: { type: 'table', title: 'What the combined company looks like (management, 27-Apr-2026)', head: ['', 'Sun today', 'Sun + Organon'], rows: [
      ['Revenue', '~$6.2 bn', '~$12.4 bn'], ['Innovative medicines share', '~20%', '~27%'], ['Established brands + branded generics', '—', '~51%'], ['Generics / biosimilars', '—', '~15% / ~6%'],
      ['Geography', 'India 33%, US 29%, EM 19%, RoW 15%', 'US 27%, EM 29%, RoW incl. Europe 28%, India 17%'], ['Markets above $100 mn', '—', '18 (incl. China >$800 mn for Organon)'],
      ['Front-line staff', 'India 16,767 + EM ~3,300 reps (+ US specialty)', '~24,000'], ['Balance sheet', '$3.4 bn net cash (Jun-26)', '~2.3x net debt / EBITDA'], ['Organic growth', '~10% (FY26)', 'Mid-single digit (HDFC Securities)'],
    ], source: 'Sun Organon investor call (27-Apr-2026); HDFC Securities via Business Today (28-Apr-2026)' } },
    { h: 'Accretive? Yes. Value-creating? Not yet' },
    { p: `Because Sun pays only ~${n1(dealMult)}x EBITDA and ~4x earnings while its own shares trade at ~${n1(X.fwdNow)}x forward earnings, almost any financing makes the deal EPS-accretive: management says "from day one", Nuvama put pro-forma accretion at over 40% of FY28E, ICICI Securities forecasts FY28E EPS of ₹89.1 including Organon, and Prabhudas Lilladher values Sun at 25x "combined entity" FY28E EPS (~₹86). Our own illustration (below) gives ~₹${n1(PF.eps)} a share of extra FY28E EPS before purchase-price amortisation (+${Math.round(PF.accretion)}% on our standalone EPS), and less after it (ICICI's depreciation jumps by ~₹6,500 cr in FY28E). But accretion is not value: the earnings come with ~$9.5 bn of net debt, revenue that fell 3% in 2025 and again in H1-2026, a key product (Nexplanon, 15% of sales) under pressure, China volume-based procurement and patent expiries. Only a third of Organon (women's-health innovation and biosimilars) grows (ICICI Securities).` },
    { exhibit: { type: 'table', title: 'Illustrative pro-forma FY28E contribution of Organon (₹ crore)', head: ['Item', 'FY28E', 'Basis'], wide: [2], rows: [
      ['Organon EBITDA + 1/3 of synergies', n0(PF.ebitda), `$1.9 bn guidance held flat + $117 mn; ₹${fx}/$`],
      ['Depreciation (ex purchase-price amortisation)', `−${n0(PF.dep)}`, '~$75 mn, implied by Organon\'s 2025 adjusted net income'],
      ['Interest on ~$9.5 bn of net debt at ~5.5%', `−${n0(PF.int)}`, 'Organon debt cost (Sun call); ICICI Securities: $9.25-9.75 bn assumed'],
      ['Treasury income Sun gives up on $2.25 bn', `−${n0(PF.lost)}`, `${X.AS.treasuryYield[1]}% (our model yield)`],
      { hl: true, cells: ['**Profit after tax added**', `**${n0(PF.pat)}**`, `Tax at ${X.AS.taxRate[1]}%; = ₹${n1(PF.eps)} a share, +${Math.round(PF.accretion)}% on our standalone FY28E`] },
      ['Purchase-price amortisation', 'not estimated', 'Not disclosed until closing; could absorb a large part of the accretion in reported EPS'],
    ], source: 'GAM Research illustration from Organon 8-K (12-Feb-2026), Sun investor call (27-Apr-2026), ICICI Direct (2-Aug-2026). Not in our forecasts.' } },
    { h: 'How we treat Organon in the valuation' },
    { p: `Our forecasts are **standalone Sun**: the deal had not closed by ${X.ASOF_TXT}, management gives no Organon guidance, and the multiple we derive comes from Sun's own history and pharma peers, so applying it to Organon's earnings would be wrong (it would capitalise earnings bought at ~4x at ~${MULT.base}x). We add Organon as a separate part of the sum: **valued at what Sun pays** (${n1(dealMult)}x EBITDA, close to ICICI Securities' 6x), so the deal itself creates or destroys nothing in our base case. One adjustment remains: the ~$2.25 bn of cash that leaves Sun earns interest that sits inside our standalone EPS (₹${n1(cashIncPs)} a share after tax), and the P/E multiple values it at ₹${n0(MULT.base * cashIncPs)} a share, while it is worth only its face value of ₹${n0(cashUsedPs)}. The difference, **−₹${n1(Math.abs(ORG.base.adj))} a share**, comes off. In the bull case we add the $350 mn of cost synergies at the deal multiple, discounted two years (₹${n1(synergyPs)} a share); in the bear case we take off a 10% shortfall in Organon's $1.9 bn EBITDA at the same multiple (₹${n1(shortfallPs)} a share).` },
    { exhibit: { type: 'table', title: 'Organon in the sum of the parts (₹ per share)', head: ['', 'Base', 'Bull', 'Bear'], rows: [
      ['Standalone Sun (multiple × Sep-28E EPS)', `${MULT.base}x × ₹${n1(epsSep.base)} = ${n0(ORG.base.standalone)}`, `${MULT.bull}x × ₹${n1(epsSep.bull)} = ${n0(ORG.bull.standalone)}`, `${MULT.bear}x × ₹${n1(epsSep.bear)} = ${n0(ORG.bear.standalone)}`],
      ['Cash used for Organon: face value less capitalised income', n1(ORG.base.cashAdj), n1(ORG.bull.cashAdj), n1(ORG.bear.cashAdj)],
      ['Organon at cost (EV paid = EV received)', '0', '0', '0'],
      ['Synergies (bull) / EBITDA shortfall (bear)', '0', `+${n1(ORG.bull.extra)}`, n1(ORG.bear.extra)],
      { hl: true, cells: ['**Sum of the parts**', `**${n0(ORG.base.total)}**`, `**${n0(ORG.bull.total)}**`, `**${n0(ORG.bear.total)}**`] },
      ['Implied P/E on standalone Sep-28E EPS (carried in the model)', `${n1(ORG.base.implied)}x`, `${n1(ORG.bull.implied)}x`, `${n1(ORG.bear.implied)}x`],
    ], source: 'GAM Research (SUNPHARMA.sotp.js). Transaction and integration costs (₹167 cr booked in Q1FY27, more "back-ended") are not estimated.' } },
    { callout: '**Our view:** strategically logical (scale in Europe, China and EMs, a women\'s-health and biosimilar platform, a home for Sun\'s own specialty products abroad) and financially cheap on paper, but it turns a net-cash compounder with ~10% organic growth into a leveraged company growing mid-single digits, and asks a management team that took five years to fix Ranbaxy to fix a company of the same size. We give it no credit until it closes and the synergies show, and no penalty beyond the cash adjustment. Two things would change our mind: evidence that Organon\'s revenue decline stops (Nexplanon stabilisation was expected in H2-2026), and financing well below Organon\'s ~5.5% cost.' },
  ],
};

module.exports = { emrow, organon };
