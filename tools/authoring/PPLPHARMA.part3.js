// Piramal Pharma report, part 3: CDMO and Complex Hospital Generics chapters (consumer and quality in part3b).
const X = require('./PPLPHARMA.ctx');
const { C, AS, BL, LINES, LEB, SQ, SA, n0, n1, pc1, YRS, M26, EB26 } = X;
const CD = C.cdmo, CH = C.chg;
const g = k => BL.growth[k].map(v => `+${v}%`);

const cdmo = {
  id: 'cdmo', nav: 'CDMO', kicker: 'Segment: CDMO (55% of revenue)', title: 'CDMO: a good franchise in development work, an under-filled global plant network, and one customer that showed how fragile commercial supply is',
  blocks: [
    { p: `CDMO revenue was ₹5,447 cr in FY25 and ₹4,915 cr in FY26 (−10%). Management blames one "large on-patent commercial product" whose customer ran down excess stock (analysts on the Q4 call called it a migraine drug), weak early-stage orders in H1FY26 and slow biotech funding; excluding the destocked product, CDMO grew modestly and on-patent commercial revenue grew "nearly 50%" across 15-16 products (CEO). Revenue by service in FY26: discovery 2%, development 27%, on-patent commercial manufacturing ~18% (US$${CD.onPatentCommercialUsdMn} mn) and other commercial manufacturing 53%. "Differentiated" offerings (ADCs, high-potency APIs, sterile injectables, peptides, on-patent API) rose from 32% of CDMO revenue in FY22 to 44% (US$${CD.differentiatedUsdMn.FY26} mn) in FY26.` },
    { p: `Q1FY27 CDMO revenue rose 19% to ₹1,187 cr, "broad-based across India and overseas sites", with record RFPs, "a number of new logos", a Net Promoter Score of ~60 and margin gains "across most sites". The CFO says ~48% of CDMO revenue comes from overseas sites, whose gross margins are 75-85% against 55-65% in India; at scale EBITDA margins are similar, but today the US and UK plants are sub-scale. No revenue is expected from the destocked product in FY27. Management's FY30 goal is US$1.2 bn of CDMO revenue at ~25% EBITDA margin; FY26 was ~US$555 mn.` },
    { pair: [
      { type: 'column', title: 'CDMO revenue by year: the FY26 dip, then our recovery path', unit: 'CDMO revenue (₹ crore)', x: [...SA.map(a => a.fy), ...YRS], series: [{ name: 'CDMO', values: [...SA.map(a => a.cdmo), ...LINES.cdmo.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation; GAM estimates FY27-29E' },
      { type: 'column', title: 'Differentiated offerings: 32% → 44% of CDMO revenue', unit: 'US$ mn (FY22, FY24, FY26)', x: ['FY22', 'FY24', 'FY26'], series: [{ name: 'Differentiated revenue', values: [CD.differentiatedUsdMn.FY22, CD.differentiatedUsdMn.FY24, CD.differentiatedUsdMn.FY26], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation slide 16' },
    ] },
    { exhibit: { type: 'table', title: 'CDMO: what we assume (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [5], rows: [
      ['Revenue', n0(BL.base.cdmo), ...LINES.cdmo.map(n0), 'RFP conversion, ADC/HPAPI growth; FY27E incl. ~7 points of rupee'],
      ['  growth', '−9.8%', ...g('cdmo'), 'Q1FY27 +19%; no destocked-product sales assumed'],
      ['EBITDA margin (GAM estimate)', `~${M26.cdmo}%`, ...BL.margin.cdmo.map(v => `${n1(v)}%`), 'Operating leverage on fixed-cost overseas sites; FY30 goal ~25%'],
      ['EBITDA (GAM estimate)', n0(EB26.cdmo), ...LEB.cdmo.map(n0), 'Not disclosed by the company'],
      ['Memo: US$ mn (FY26 at ~88.5, forecasts at 95.8 Rs/$)', '~555', ...LINES.cdmo.map(v => n0(v / 95.81 * 10)), 'vs the US$1.2 bn FY30 goal'],
    ], source: 'Company presentations; JM Financial (16-Apr-2026) for the FY26 margin range; GAM estimates' } },
    { callout: `**Our read:** the CDMO capability set is genuinely good (ADC conjugation since the early 2000s, a clean regulatory record, an East-West network that big pharma uses), but the business is still mostly commercial supply of mature products plus development work, and its profits depend on filling plants in Lexington, Riverview, Sellersville, Aurora, Grangemouth and Morpeth. Our CDMO revenue of ~US$${n0(LINES.cdmo[2] / 95.81 * 10)} mn in FY29E is well short of management's US$1.2 bn for FY30: we would need to see order conversion, not RFP counts, before we modelled that path.` },
  ],
};

const chg = {
  id: 'chg', nav: 'Hospital generics', kicker: 'Segment: Complex Hospital Generics (30%)', title: 'Hospital generics: a cash-generating #1 in US sevoflurane, fighting Chinese prices abroad, with Kenalog as the new lever',
  blocks: [
    { p: `CHG revenue was ₹${n0(SA.find(a => a.fy === 'FY25').chg)} cr in FY25 and ₹${n0(BL.base.chg)} cr in FY26 (+3%). Inhalation anaesthesia is 64%: Piramal makes sevoflurane API and drug product in Bethlehem, Pennsylvania, from a key starting material made in Dahej, and holds 48% of the US sevoflurane market (IQVIA; 45% in Mar-24). Ex-US growth stalled in FY26 under Chinese competition; since FY26 a lower-cost line at Digwal (India) supplies price-sensitive markets (India, UAE, Cambodia, Kenya, Sri Lanka, Uganda, with Bangladesh, Brazil, Malaysia, Russia and South Africa next). Intrathecal therapy (baclofen, morphine; 15%) is #1 in the US and is about defending share; injectable pain (11%) has been limited by a third-party manufacturer's supply problems, with steady supply expected from FY28.` },
    { p: `Q1FY27 CHG revenue rose 17% to ₹743 cr on ex-US anaesthesia share gains. Kenalog (triamcinolone acetonide injection), bought from Bristol Myers Squibb for US$35 mn upfront plus up to US$65 mn contingent, starts supplying in Q2FY27; it has limited competition and CHG-like margins. Management describes CHG margins as "stable and will remain stable"; our estimate is ~${Math.round(M26.chg)}% EBITDA before other income in FY26.` },
    { pair: [
      { type: 'column', title: 'CHG by quarter: flat for five quarters, +17% in Q1FY27', unit: 'CHG revenue (₹ crore)', x: SQ.map(s => s.q), series: [{ name: 'CHG', values: SQ.map(s => s.chg), fmt: 'num' }], labels: 'all', source: 'Quarterly investor presentations' },
      { type: 'hbar', title: 'CHG mix FY26: anaesthesia is two-thirds', unit: '% of FY26 CHG revenue', x: ['Inhalation anaesthesia', 'Intrathecal therapy', 'Injectable pain', 'Other speciality'], series: [{ name: 'Share', values: [CH.mixFY26.inhalationAnaesthesia, CH.mixFY26.intrathecal, CH.mixFY26.injectablePain, CH.mixFY26.other], fmt: 'pct0' }], labels: 'all', source: 'Q4FY26 presentation slide 23' },
    ] },
    { exhibit: { type: 'table', title: 'CHG: what we assume (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [5], rows: [
      ['Revenue', n0(BL.base.chg), ...LINES.chg.map(n0), 'Kenalog from Q2FY27; ex-US sevoflurane'],
      ['  growth', '+2.7%', ...g('chg'), 'FY27E: ~6 points rupee, ~5-6 points Kenalog'],
      ['EBITDA margin (GAM estimate)', `~${n1(M26.chg)}%`, ...BL.margin.chg.map(v => `${n1(v)}%`), '"Stable"; Kenalog in line'],
      ['EBITDA (GAM estimate)', n0(EB26.chg), ...LEB.chg.map(n0), 'Not disclosed'],
    ], source: 'Company presentations and calls; GAM estimates' } },
    { callout: '**Our read:** CHG is the steadiest part of Piramal: a vertically integrated #1 in a mature, high-barrier niche. Its risks are price (Chinese sevoflurane abroad), one big product (anaesthesia is two-thirds) and supply partners. It probably deserves a lower multiple than CDMO but a higher one than its growth alone suggests, because its cash funds the CDMO build.' },
  ],
};

const { pch, quality } = require('./PPLPHARMA.part3b');
module.exports = { cdmo, chg, pch, quality };
