// Solar Industries report, part 3: domestic explosives, international, defence, the Omnia deal, moat.
const X = require('./SOLARINDS.ctx');
const { C, D, F, A, n0, n1, pc, rup, SA, SQ, QL, A26, A25, A21, Q1, OM, BL, YRS, defExports, fx, omEbitda, omNetCash, omDa, omInterest, omPbt, omValue, omAccretion, pl, b } = X;
const vs = SA.filter(a => a.domVolT);
const k1 = v => Math.round(v / 100) / 10;

const domestic = {
  id: 'domestic', nav: 'Domestic explosives', kicker: 'Business line', title: 'Domestic explosives: the market leader in a tender-driven, low-growth market',
  blocks: [
    { pair: [
      { type: 'column', title: 'Domestic explosives revenue by quarter', unit: 'Revenue (₹ crore); Q1FY27 includes ammonium-nitrate price pass-through', x: QL, series: [{ name: 'Domestic', values: SQ.map(q => q.domestic), fmt: 'num' }], labels: 'all', source: 'Company fact sheets' },
      { type: 'stacked', title: 'Flat for three years after the FY23 price spike', unit: "Domestic revenue by customer (₹ '000 crore)", x: SA.map(a => a.fy), series: [{ name: 'Coal India', values: SA.map(a => k1(a.cil)), fmt: 'n1' }, { name: 'Non-CIL & institutional', values: SA.map(a => k1(a.nonCil)), fmt: 'n1' }, { name: 'Housing & infra', values: SA.map(a => k1(a.housingInfra)), fmt: 'n1' }], minLabel: 0.6, source: 'Company fact sheets' },
    ] },
    { exhibit: { type: 'table', title: 'Volume vs price: FY23 was price, FY24-25 was volume', head: ['', ...vs.map(a => a.fy)], rows: [
      ['Domestic explosives volume (tonnes)', ...vs.map(a => n0(a.domVolT))],
      ['Realisation (₹ per tonne)', ...vs.map(a => n0(a.domRateRsT))],
      ['India production (\'000 t, PESO)', ...vs.map(a => n0(a.industryKt))],
      ['Solar volume share', ...X.volShare.map(v => `${n1(v.pct)}%`)],
    ], source: 'Company year-end decks (FY26 volumes not disclosed); PESO via MOFSL; GAM calculation' } },
    { bullets: [
      `**What it is.** Bulk and packaged explosives and detonators for Indian mines and construction: ₹${n0(A26.domestic)} cr in FY26 (${Math.round(X.share(A26, 'domestic'))}% of revenue), ~${Math.round((Math.pow(A26.domestic / A21.domestic, 1 / 5) - 1) * 100)}% a year since FY21. Coal India alone bought ₹${n0(A26.cil)} cr; Solar supplies ~20-23% of CIL's explosives.`,
      '**Price, not volume, drives the big years.** FY23 realisation jumped 39% as ammonium nitrate spiked; FY24 it fell 32% and revenue with it. Volumes grew ~7-22% a year in FY22-25, faster than the market, so share rose to ~26%.',
      '**FY26 was flat** (+3%): heavy monsoons cut CIL and Singareni output and overburden removal "was on a negative side" (MD). **Q1FY27 rebounded +52%**, helped by new plants near customers (Dhule, North India) and AN price pass-through (management: 18-20% of FY27 explosives growth is price).',
      '**Competition:** a price-led tender market with established rivals and a possible new entrant (Kalyani group); management: "we cannot say that we will have 100% market share".',
    ] },
    { callout: `**Our view:** a solid, cash-generating base with real scale advantages, but not where the growth or the premium comes from. We model ₹{{as.businessLines.FY27E.domestic|num}} cr in FY27E (+${Math.round((BL.FY27E.domestic / BL.FY26.domestic - 1) * 100)}%, mostly price), then +${Math.round((BL.FY28E.domestic / BL.FY27E.domestic - 1) * 100)}% and +${Math.round((BL.FY29E.domestic / BL.FY28E.domestic - 1) * 100)}% as prices normalise and volumes grow high single digits.` },
  ],
};

const intl = {
  id: 'intl', nav: 'International', kicker: 'Business line', title: 'International: a decade of plant-building in Africa and Turkey is now paying off',
  blocks: [
    { pair: [
      { type: 'column', title: 'International revenue by quarter', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'International', values: SQ.map(q => q.intl), fmt: 'num' }], labels: 'all', source: 'Company fact sheets' },
      { type: 'column', title: 'Five times FY20 in six years', unit: 'International (exports & overseas) revenue (₹ crore)', x: SA.map(a => a.fy), series: [{ name: 'International', values: SA.map(a => a.intl), fmt: 'num' }], labels: 'all', source: 'Company fact sheets' },
    ] },
    { bullets: [
      `**What it is.** Explosives exported from India plus output of plants in Zambia, South Africa (Middelburg, Problast services), Nigeria, Ghana, Tanzania, Zimbabwe, Turkey, Kazakhstan, Thailand and Indonesia: ₹${n0(A26.intl)} cr in FY26 (+${Math.round((A26.intl / A25.intl - 1) * 100)}%), ${Math.round(X.share(A26, 'intl'))}% of revenue. Africa brings ~US$300 mn a year (MD, Sep-2026).`,
      '**Why it took off.** Exports and overseas stalled at ~₹800 cr in 2018-21 while plants were built and customers qualified them; revenue reached ~₹1,400 cr in FY22 and ₹3,815 cr in FY26 (MD).',
      '**Growth outlook.** Management: world mining-explosives demand grows 2-3% a year, Solar ~10% in volume and ~15% in value; FY27 ~+30% (price helps). Q1FY27 +65%.',
      `**Profitability is uneven.** South Africa earned ₹83 cr on ₹1,083 cr of turnover, Ghana ₹83 cr on ₹413 cr, but Turkey (₹994 cr turnover) was at a small loss and its hyperinflation accounting cost ₹94.5 cr in FY26 (₹65 cr in FY25). Subsidiaries' margins were "subdued" in H1FY26 and improved from Q3 (MD).`,
    ] },
    { callout: `**Our view:** a genuine growth engine where Solar is gaining share against much larger global players (Orica, Dyno Nobel, Enaex). We model ₹{{as.businessLines.FY27E.intl|num}} / {{as.businessLines.FY28E.intl|num}} / {{as.businessLines.FY29E.intl|num}} cr for FY27-29E, organic only. Omnia would add ~₹13,000-15,000 cr a year, mostly in Africa, at about half Solar's margin.` },
  ],
};

const defYears = [...SA.map(a => a.fy), ...YRS];
const defence = {
  id: 'defence', nav: 'Defence', kicker: 'Business line', title: 'Defence: from 5% to 27% of revenue in five years, and the reason for the premium',
  blocks: [
    { pair: [
      { type: 'column', title: 'Defence revenue: we expect ₹4,500 cr in FY27, as guided', unit: 'Defence revenue (₹ crore); FY27-29E = GAM', x: defYears, series: [{ name: 'Defence', values: [...SA.map(a => a.defence), ...YRS.map(y => BL[y].defence)], fmt: 'num' }], labels: 'all', source: 'Company fact sheets; GAM estimates' },
      { type: 'column', title: 'Order book covers ~4 years of FY27 defence revenue', unit: 'Defence order book ÷ that year\'s defence revenue (x)', x: ['FY24', 'FY25', 'FY26', 'Jun-26 (on FY27E)'], series: [{ name: 'Cover', values: [Math.round(26000 / 517) / 10, Math.round(152000 / 1355) / 10, Math.round(180000 / 2634) / 10, Math.round(180000 / BL.FY27E.defence) / 10], fmt: 'x' }], labels: 'all', source: 'MOFSL order-book series; company revenue; GAM calculation' },
    ] },
    { bullets: [
      '**What it is.** Energetic materials (HMX, RDX, TNT and their compounds), composite propellants for Akash, Pinaka and BrahMos, complete Pinaka rockets, warheads, mines, bombs, 30/81/155 mm ammunition, multi-mode hand grenades, Nagastra loitering munitions, MALE-class UAV and counter-drone programmes. Most sits in Solar Defence and Aerospace, which earned ₹474 cr pre-tax on ₹1,577 cr of turnover in FY26.',
      `**Orders.** Defence order book ~₹18,000 cr at Mar-26 and Jun-26: ~₹6,000 cr Pinaka (Feb-2025 MoD contract) and ~₹11,000 cr international (MOFSL); export wins include ₹1,076 cr (29-May-2026) and ₹830 cr and ₹589 cr (Jan-2026), each over three to four years.`,
      `**Exports dominate.** Revenue billed outside India was ₹${n0(A26.geoOutside)} cr in FY26 vs ₹${n0(A26.intl)} cr of international explosives; the ~₹${n0(Math.round(defExports / 100) * 100)} cr difference is, we think, mainly defence exports (~${Math.round(defExports / A26.defence * 100)}% of defence revenue). Solar does not disclose the split.`,
      '**Pipeline.** Pinaka follow-ons (guided, Mk2, replenishment, Armenia exports), Bhargavastra trials "in this calendar year", 155 mm complete rounds after a coupling facility, medium-calibre ammunition in qualification; Project Kusha and MALE UAVs are longer-dated (PL, MOFSL).',
      '**What can go wrong.** Trials take "longer time than what we expect" (MD); export orders depend on governments, conflicts and Indian export licences; the defence order book was flat between Mar-26 and Jun-26 after revenue doubled in FY26.',
    ] },
    { callout: `**Our view:** this is the best business in the group and the reason the stock trades at 60x. We model ₹{{as.businessLines.FY27E.defence|num}} cr in FY27E (guidance), then +${Math.round((BL.FY28E.defence / BL.FY27E.defence - 1) * 100)}% and +${Math.round((BL.FY29E.defence / BL.FY28E.defence - 1) * 100)}%, which the existing book can cover; PL and MOFSL are 3-5% higher for FY28. Defence reaches ${Math.round(X.defShare('FY29E'))}% of revenue in FY29E. Upside needs new platform orders; downside is execution slippage on lumpy export contracts.` },
  ],
};

const omnia = {
  id: 'omnia', nav: 'The Omnia deal', kicker: 'Acquisition', title: 'Omnia: a large, cheap, low-margin business bought with debt; roughly value-neutral at the price paid',
  blocks: [
    { p: rup(`On 14-Sep-2026 Solar agreed to buy 100% of Johannesburg-listed Omnia Holdings for ZAR 134.5 a share in cash: about US$1.355 bn or ₹12,951 cr, Solar's largest deal by far. ${OM.business} Completion needs Omnia shareholders, competition and other regulators, and is expected in early-to-mid 2027. Solar's stock fell ~17% in two days. We keep Omnia **out of our forecasts and target** until it closes and the funding is fixed, as PL and Goldman Sachs do (MOFSL includes it), and show its effect here.`) },
    { exhibit: { type: 'table', title: 'What management said about FY28 with Omnia (15-Sep-2026 call)', head: ['', 'Solar alone', 'Omnia', 'Combined'], rows: [
      ['Revenue (₹ cr)', '~16,500', '15,000+', '31,000-32,000'],
      ['EBITDA (₹ cr)', '~4,800 (29%)', 'US$180 mn (~₹1,700 cr) before synergies', '6,800-7,000 (22-23%)'],
      ['EBIT / interest / PBT (₹ cr)', '', '', 'EBIT 6,200-6,300 / interest 1,000-1,100 / PBT 5,000+'],
      ['Total debt (₹ cr)', '', '', '10,000-11,000 by FY28; net debt below 2x EBITDA'],
    ], source: 'Solar business update call transcript (15-Sep-2026, filed 17-Sep)' } },
    { exhibit: { type: 'table', title: 'Our simple pro forma for a full year of Omnia (FY28, before synergies)', head: ['', '₹ crore', 'Basis'], wide: [2], rows: [
      ['Omnia EBITDA', n0(omEbitda), `US$180 mn (management) at ₹${n1(fx)}/US$ (the deal's own rate)`],
      ['Less depreciation', `−${n0(omDa)}`, 'Combined D&A ~₹700 cr implied by management\'s EBITDA-EBIT gap, less our organic FY28E'],
      ['Less interest on acquisition debt', `−${n0(omInterest)}`, 'Management and Kotak: ₹1,000-1,100 cr a year'],
      { hl: true, cells: ['**Omnia pre-tax profit added**', `**${n0(omPbt)}**`, `**~${Math.round(omAccretion)}% of our organic FY28E pre-tax profit (₹{{F.pbt.1|num}} cr)**`] },
      ['Net debt taken on', n0(12951 - omNetCash), 'Price ₹12,951 cr less Omnia\'s ~US$110 mn net cash (PL)'],
      ['Value per Solar share at 6x / 8x / 10x EV/EBITDA', `${X.sgn(omValue(6))} / ${X.sgn(omValue(8))} / ${X.sgn(omValue(10))}`, 'Omnia EBITDA × multiple less net debt taken on, ÷ 9.05 cr shares'],
    ], source: 'GAM Research arithmetic on management and broker inputs; global explosives peers trade at ~6-8x EV/EBITDA (PL, Bloomberg)' } },
    { bullets: [
      `**Street pro formas differ widely.** PL: EPS +2% in FY28E (half-year consolidation) and +9% in FY29E, with EBITDA margin falling from ~27.5% to ~19-20%, and Omnia worth ~₹754 a share at 12x/10x EV/EBITDA. Goldman Sachs: +11-25% to FY28 EPS. Kotak: accretion depends on synergies and funding.`,
      '**The strategic case is real.** Omnia owns the region\'s largest ammonium nitrate and nitric acid plants (Solar\'s key input), the BME mining brand with AXXIS electronic detonators, and a footprint in 23 countries including Canada, Australia and Indonesia; manufacturing would rise from 11 to ~25 countries.',
      '**The costs are also real.** 54% of Omnia\'s revenue is agriculture (fertilisers, biostimulants), a business Solar does not know; chemicals is being restructured; group margins halve; Solar\'s debt rises about seven-fold; and integration spans two continents.',
    ] },
    { callout: '**Our view:** at ~8x EBITDA Solar is not overpaying for a business that trades at 4-8x, but it is buying lower-quality earnings with debt. Value per share is close to zero at the price paid (± a few hundred rupees, ~1-3% of the share price) unless synergies come through. The bigger effect may be on the multiple: half of revenue would come from a ~13%-margin mining and agri business, and the market should not pay defence multiples for that.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a cost moat in explosives, a capability lead in defence, no pricing power',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings, calls and broker notes to Sep-2026)' },
    { callout: '**Honest verdict:** Solar has a real but narrow moat. In explosives it is the scale, low-cost, licensed incumbent close to the mines, which wins tenders and share, but tender buyers set the price and ammonium nitrate is bought in. In defence it has a genuine capability lead among Indian private firms (integrated from energetic materials to complete rockets), which is why defence margins are higher; but that lead is being contested by well-funded groups, it depends on government trials and export licences, and it is young. The premium the market pays assumes the defence lead converts into a decade of large orders. That is possible, not proven.' },
  ],
};

module.exports = { domestic, intl, defence, omnia, moat };
