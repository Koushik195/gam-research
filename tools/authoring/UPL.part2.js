// UPL report, part B (2 of 4): industry, tailwind test, the four platforms, the reorganisation, moat.
const X = require('./UPL.common');
const { C, D, F, n0, n1, pc, SQ, QL, A25, A26, segE, segR, SRC } = X;
const qm = (e, r) => SQ.map(q => (q[e] != null && q[r] ? Math.round(q[e] / q[r] * 1000) / 10 : null));
const fc = k => `{{F.seg.${k}.revenue.0|num}} / {{F.seg.${k}.revenue.1|num}} / {{F.seg.${k}.revenue.2|num}}`;
const G = D.industry.globalPeers;

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Crop protection: a slow-growing, off-patent market that has just come out of a bust',
  blocks: [
    { p: 'Global crop protection is a ~$78 bn market growing only 1-3% a year. Most of it (78% in 2024) is off-patent ("post-patent") chemistry, where UPL competes with Chinese and Indian generic makers, ADAMA and Nufarm, and with the off-patent ranges of Syngenta, Bayer, BASF, Corteva and FMC. Prices spiked in 2021-22 (COVID, the Russia-Ukraine war), distributors stockpiled, and then everything reversed in FY24: Chinese producers flooded the market, prices fell and the channel ran down stock. UPL lost money that year. Since then volumes have recovered, but prices for key active ingredients remain low, and farmers are squeezed: soybean, wheat and corn prices are 33-55% below their Apr-2022 levels.' },
    { exhibit: { type: 'table', title: 'Market forces in 2026', head: ['Theme', 'Direction', 'What it means for UPL'], wide: [2], rows: [
      ['Channel destocking over; prices low but stable', 'Neutral', 'Volumes can grow; pricing power is limited.'],
      ['Chinese generic capacity', 'Headwind', 'Sets the floor price for off-patent molecules; a new price war is the main bear risk.'],
      ['West Asia conflict lifts energy and input costs', 'Mixed', 'UPL priced early in Q1FY27 (margins up); industry following with low-to-mid single-digit increases.'],
      ['Weak farm incomes (low grain prices)', 'Headwind', 'Growers buy late and cheaply; channel buys just in time.'],
      ['Biologicals ("biosolutions") growing 9-11% a year', 'Tailwind', 'UPL\'s NPP and ProNutiva ranges; ~$700 mn of sustainable-solutions revenue targeted for FY27.'],
      ['Ethanol demand for corn (India, Brazil)', 'Tailwind', 'Drives Advanta\'s field-corn seed growth.'],
      ['El Niño and a delayed Indian monsoon (2026)', 'Headwind', 'Shifted Q1FY27 demand in India and Europe into later quarters.'],
    ], source: D.industry.market.map(m => m.src).filter((v, i, a) => a.indexOf(v) === i).join('; ') } },
    { exhibit: { type: 'table', title: 'Global crop-protection peers (UPL\'s own comparison)', head: ['Company', 'FY25 crop-protection revenue (₹ cr)', 'Revenue growth, TTM Sep-25', 'EBITDA growth, TTM Sep-25', 'Note'], wide: [4], rows: G.map(g => [g.name, g.fy25RevCr ? n0(g.fy25RevCr) : 'n.d.', g.ttmSep25RevGrowth != null ? g.ttmSep25RevGrowth + '%' : 'n.d.', g.ttmSep25EbitdaGrowth != null ? g.ttmSep25EbitdaGrowth + '%' : 'n.d.', g.note]), source: `${D.industry.globalPeersSrc} (${D.industry.globalPeersPublished}). Global peers' valuation multiples at 30-Sep-2026 were not sourced.` } },
    { callout: '**So what:** this is not a growth industry. UPL\'s EBITDA grew 157% in the year to Sep-2025 only because FY24 was so bad; its revenue grew 3%, like everyone else\'s. From here, earnings growth has to come from mix (biologicals, new products, seeds, specialty chemicals), cost and lower interest, not from the market.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: UPL captures the recovery and seeds; pricing still belongs to China',
  blocks: [
    { verdicts: [
      ['Recovery from the FY24 destocking', 'Yes', 'Seven straight quarters of revenue and EBITDA growth; company EBITDA ₹5,515 cr (FY24) → ₹9,588 cr (FY26).', 'The rebound is largely done; growth now slows to guidance of +10-14%.'],
      ['Post-patent share of the market rising', 'Partly', 'UPL Corp volumes +7% in FY26 with prices −3%; Q1FY27 volume −7%.', 'More volume, but at Chinese-set prices.'],
      ['Biologicals / sustainable solutions', 'Partly', '~$700 mn targeted in FY27; NPP growing in LatAm, APAC, Africa; Europe hit by heat in Q1.', 'Real but still ~10% of UPL Corp revenue.'],
      ['Corn and ethanol demand', 'Yes', 'Advanta revenue +23% in FY26 and +26% in Q1FY27, led by field corn in India, LatAm and Indonesia.', 'The best-growing part of the group.'],
      ['Indian specialty chemicals / China+1', 'Yes', 'SUPERFORM\'s external specialty sales +20% in FY26 and +51% in Q1FY27.', 'Small today (₹2,894 cr), growing fast.'],
      ['Weaker rupee', 'Yes, for reported numbers', 'FX added +6% to FY26 revenue and +10% to Q1FY27 revenue.', 'Translation, not demand; it also raises dollar debt in rupees.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

const platformChapter = (k, id, nav, title, intro, bullets, callout, extra = []) => ({
  id, nav, kicker: 'Platform', title,
  blocks: [
    { p: intro },
    { pair: [
      { type: 'column', title: `${nav}: revenue by quarter`, unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'Revenue', values: SQ.map(q => q[k + 'Rev']), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: `${nav}: EBITDA margin by quarter`, unit: 'EBITDA margin, company basis (%)', x: QL, series: [{ name: 'EBITDA margin', values: qm(k + 'Ebitda', k + 'Rev'), fmt: 'pct' }], labels: 'all', source: SRC },
    ] },
    { bullets },
    ...extra,
    { exhibit: { type: 'table', title: `${nav}: our forecasts (₹ crore)`, head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue', n0(A25[k + 'Rev']), n0(A26[k + 'Rev']), `{{F.seg.${k}.revenue.0|num}}`, `{{F.seg.${k}.revenue.1|num}}`, `{{F.seg.${k}.revenue.2|num}}`],
      ['EBITDA', n0(A25[k + 'Ebitda']), n0(A26[k + 'Ebitda']), `{{F.seg.${k}.adjEbitda.0|num}}`, `{{F.seg.${k}.adjEbitda.1|num}}`, `{{F.seg.${k}.adjEbitda.2|num}}`],
      ['EBITDA margin', n1(A25[k + 'Ebitda'] / A25[k + 'Rev'] * 100) + '%', n1(A26[k + 'Ebitda'] / A26[k + 'Rev'] * 100) + '%', ...[0, 1, 2].map(i => n1(segE(k, F.years[i]) / segR(k, F.years[i]) * 100) + '%')],
    ], source: 'UPL presentations (FY25-26), GAM Research estimates' } },
    { callout },
  ],
});

const corp = platformChapter('corp', 'corp', 'UPL Corp', 'UPL Corp: two-thirds of the group, a generic business with a recovering margin',
  'UPL Corp is the international crop-protection business: ₹38,277 cr of revenue in FY26 (equal to 74% of group revenue) and ₹6,008 cr of EBITDA. Latin America is 45% of its revenue (Brazil above all), then Rest of World, Europe and North America. It buys most of its active ingredients from SUPERFORM, formulates and sells through distributors. Its margin collapsed to 6.8% in FY24 and has recovered to 15.7% (FY26) on lower input costs, better mix and fuller plants.',
  [
    '**FY26:** revenue +11% (volume +7%, price −3%, FX +7%), contribution margin up 260 bp to 35.1%, EBITDA +20%. SG&A rose 20%, including credit-loss provisions and FX.',
    '**Q1FY27 (the smallest quarter, ~15% of the year):** revenue +7% (volume −7%, price flat, FX +14%); EBITDA +38% to ₹532 cr, margin 8.4%. Europe\'s heatwave and a ~7% cut in sugar-beet area hit herbicides; UPL dropped low-margin business in Argentina; Colombia was weak. Brazil (acephate, clethodim) and North America (s-metolachlor, mancozeb) grew.',
    '**Pricing:** UPL raised prices early for Middle East-driven cost inflation; management sees "very low probability" of price declines this year. It expects global demand flat to slightly up and UPL to gain share, so FY27 growth should be "led by volume".',
    '**Innovation:** ~16% of sales from products launched in the last five years; ~$115 mn of FY27 revenue from new launches; peak pipeline value ~$4.4 bn (risk-adjusted).',
    '**Leadership:** CEO Mike Frank (also named CEO of UPL Global) leaves on 31-Aug-2026; Jai Shroff leads global crop protection directly.',
  ],
  `**Our view:** we model revenue of ${fc('corp')} (FY27-29E, ₹ cr) and margins of 16.2-17.2%, still below the 19-22% statutory EBITDA margin the whole group earned in FY21-23. This is a scale generic business: good at registrations, distribution and cost, but a price-taker against Chinese producers. 22.2% of it belongs to TPG, ADIA and Brookfield.`);

const sas = platformChapter('sas', 'sas', 'UPL SAS', 'UPL SAS: India crop protection, smaller than it used to be and more profitable',
  'UPL SAS is the India crop-protection business (₹3,212 cr of revenue in FY26 on the platform definition, which excludes the "Nurture" digital marketplace). About 65% of its revenue comes in April-September. Management has cut low-margin products and pushed big brands (Centurion EZ, Canora EZ, Harmetry), so revenue has been flat for two years while EBITDA rose from ₹130 cr (FY24) to ₹548 cr (FY26).',
  [
    '**FY26:** revenue flat (volume −1%, price +1%); contribution margin 32.2% (+540 bp); EBITDA +24% to ₹548 cr (17.1%). A weak Q2 monsoon and discontinued products held revenue back.',
    '**Q1FY27:** revenue ₹1,140 cr, flat (volume −8%, price +8%) on a delayed monsoon; EBITDA +34% to ₹340 cr, margin 29.8%. The CEO said part of the jump "will normalise": prices rose before higher-cost stock flowed through, and Q1 is the peak season.',
    '**Structure:** under the reorganisation UPL SAS merges into UPL Ltd and its business is demerged into UPL Global with UPL Corp. TPG, ADIA and Brookfield own 9.09%, bought for $200 mn in 2022 (a ~$2.2 bn valuation, a rich price against today\'s EBITDA).',
  ],
  `**Our view:** revenue of ${fc('sas')} (₹ cr) at a ~20% margin. Indian agrochemical demand is monsoon-driven and competitive; SAS is now a quality-over-volume business. It is small: ~6% of platform EBITDA.`);

const adv = platformChapter('adv', 'adv', 'Advanta', 'Advanta: the best business in the group, and the one being partly sold',
  'Advanta sells hybrid seeds (field corn 40% of FY26 revenue, grain and forage sorghum 16%, sunflower and canola 15%, vegetables 10%) and, since Q2FY26, Decco\'s post-harvest coatings (17%). It operates in Asia (mainly India), the Americas (Argentina, Brazil, US), Australia and Europe. Revenue rose 23% in FY26 to ₹6,837 cr and EBITDA 30% to ₹1,725 cr (25.2% margin). Seeds are a better business than generic chemicals: proprietary germplasm, fewer competitors, and farmers who pay for yield.',
  [
    '**Q1FY27:** revenue +26% (volume +12%, price +10%, FX +4%), EBITDA +24% to ₹359 cr; growth in field corn (India, LatAm, Indonesia), rice (India) and sunflower (Argentina). El Niño is a risk for H2.',
    '**Owners:** UPL group 78.21% (UPL Ltd ~64.3% plus ~13.9% through UPL Corporation Ltd, Mauritius, received for Decco); KKR and Alpha Wave the rest. Alpha Wave paid $350 mn for ~12.5% in Nov-2024 at an enterprise value of ~$2.8 bn.',
    '**IPO:** draft prospectus filed 19-Jan-2026; SEBI approval 3-Jun-2026. It is entirely an offer for sale: UPL sells 28.1 mn shares (7.8%) and KKR 8.0 mn (2.2%). Advanta raises no money; UPL gets cash to cut debt, and its stake falls to ~70.4%.',
  ],
  `**Our view:** revenue of ${fc('adv')} (₹ cr) with the margin rising to 26.5%. Advanta should list at a high multiple, which is good for UPL\'s sum of the parts. But each rupee of Advanta profit is now worth ~78 paise to UPL shareholders, ~70 paise after the IPO.`);

const sf = platformChapter('sf', 'superform', 'SUPERFORM', 'SUPERFORM: UPL\'s factory, turning into a specialty-chemicals business',
  'SUPERFORM owns UPL\'s Indian chemical plants. About 71% of its revenue is active ingredients sold to UPL Corp and UPL SAS (removed in consolidation); 29% is "super specialty chemicals" (SSC) sold to outsiders: zinc-based lubricant additives (contract manufacturing), cyanide derivatives for mining and pharma, and other chemistries. It is 100% owned by UPL.',
  [
    '**FY26:** revenue +1% to ₹10,298 cr (SSC +20% to ₹2,894 cr; active ingredients −5% to ₹7,403 cr on lower input-cost pass-through); EBITDA +10% to ₹1,258 cr (12.2%).',
    '**Q1FY27:** revenue +14% (SSC +51%, with volume +17% and price +34%; active ingredients +9%); EBITDA +7% to ₹358 cr as overheads rose ahead of growth.',
    '**Target:** an active-ingredient : SSC mix of ~55:45 in 3-4 years, from 71:29 now; capabilities in cyanation, phosgenation, flame retardants and battery chemicals. The reorganisation deck lists a "SUPERFORM capital raise" as a future deleveraging lever.',
  ],
  `**Our view:** revenue of ${fc('sf')} (₹ cr) and a margin rising to 13.5% as SSC grows. External specialty sales are the hidden growth asset; the captive part is a cost centre whose margin depends on what UPL Corp pays it.`);

module.exports = { sectionsA: () => [industry, tailwind, corp, sas, adv, sf, ...require('./UPL.part2b').sections()] };
