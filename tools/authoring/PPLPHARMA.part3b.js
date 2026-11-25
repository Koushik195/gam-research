// Piramal Pharma report, part 3b: consumer healthcare, and plants / USFDA / associates.
const X = require('./PPLPHARMA.ctx');
const { C, BL, LINES, LEB, SQ, SA, n0, n1, YRS, M26, EB26, rup, JVPAT, OB } = X;
const PC = C.pch, J = C.associates.abbvie;
const g = k => BL.growth[k].map(v => `+${v}%`);

const pch = {
  id: 'pch', nav: 'Consumer healthcare', kicker: 'Segment: Consumer Healthcare (15%)', title: 'Consumer healthcare: brands growing 15-24% a year, profits still close to nil after heavy advertising',
  blocks: [
    { p: `PCH revenue grew from ₹874 cr in FY23 to ₹${n0(BL.base.pch)} cr in FY26 (+17% in FY26, ~2x its markets). Six "power brands" (Little's, Lacto Calamine, CIR, the i-range and others) grew from ₹370 cr to ₹664 cr (22% a year) and are now 52% of sales; e-commerce grew 48% in FY26 to 27% of sales, half of it through quick commerce. Piramal spends ~12% of PCH sales on media and trade promotion (₹148 cr in FY26). It owns no factories here: production is outsourced. Q1FY27: +15% to ₹347 cr, power brands +23% (53% of sales), e-commerce +40% (28%), price increases to offset input inflation, and a new women's-care master brand (i-choose).` },
    { p: 'Profitability is the weak point. CARE (17-Jul-2026) says the business\'s margins "remain in the low single digits", and management talks of margin expansion from premiumisation, fewer but bigger launches and e-commerce profitability rather than of a number. We assume the EBITDA margin rises from ~3% to 7.5% by FY29E.' },
    { pair: [
      { type: 'column', title: 'Consumer revenue: +13% a year since FY23', unit: 'PCH revenue (₹ crore)', x: [...SA.map(a => a.fy), ...YRS], series: [{ name: 'PCH', values: [...SA.map(a => a.pch), ...LINES.pch.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation; GAM estimates FY27-29E' },
      { type: 'column', title: 'Power brands: ₹370 cr → ₹664 cr in three years', unit: 'Power-brand revenue (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Power brands', values: [PC.powerBrandsRevenue.FY23, PC.powerBrandsRevenue.FY24, PC.powerBrandsRevenue.FY25, PC.powerBrandsRevenue.FY26], fmt: 'num' }], labels: 'all', source: 'Q4FY26 presentation slide 29' },
    ] },
    { exhibit: { type: 'table', title: 'Consumer healthcare: what we assume (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Why'], wide: [5], rows: [
      ['Revenue', n0(BL.base.pch), ...LINES.pch.map(n0), 'Power brands, e-commerce, distribution'],
      ['  growth', '+16.6%', ...g('pch'), 'Q1FY27 +15%; guidance mid-teens'],
      ['EBITDA margin (GAM estimate)', `~${M26.pch}%`, ...BL.margin.pch.map(v => `${n1(v)}%`), 'Premiumisation; ad spend held ~12%'],
      ['EBITDA (GAM estimate)', n0(EB26.pch), ...LEB.pch.map(n0), 'Not disclosed'],
    ], source: 'Company presentations; CARE (17-Jul-2026); GAM estimates' } },
    { callout: '**Our read:** a good brand-building engine without proof yet that it can make money. ICICI Direct values it at 2x sales and Motilal Oswal at 13x EBITDA; on our ~6% FY28E margin those two give very different answers (₹3,300 cr vs ~₹1,300 cr), which shows how much of PCH\'s value is a bet on future margins.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Plants, USFDA & the JV', kicker: 'Plants and quality', title: 'Plants and quality: 17 sites, 49 USFDA inspections since FY12 and no OAI. The quality record is the best part of the CDMO pitch',
  blocks: [
    { p: rup('Piramal runs 15 CDMO sites (nine in India: two in Ahmedabad, Pithampur, Dahej, Digwal, Mahad, Turbhe, Ennore, Rabale R&D; four in North America: Lexington, Riverview, Sellersville, Aurora; two in the UK: Grangemouth and Morpeth), the Bethlehem (US) anaesthesia plant and, through Yapan Bio, a Hyderabad biologics site. Since FY12 it has cleared 415 regulatory inspections including 49 by the USFDA without a single "Official Action Indicated" outcome, and 2,120 customer audits (209 in FY26 alone). Five CDMO sites making ~40% of FY26 CDMO revenue (Digwal, Riverview, Sellersville, Lexington, Aurora) passed USFDA inspections between Sep-2024 and Mar-2026 with zero observations or VAI status; Sellersville received another EIR in Q1FY27.') },
    { exhibit: { type: 'table', title: 'USFDA status of the key sites (as disclosed to 30-Sep-2026)', head: ['Site', 'Outcome', 'When', 'Source'], wide: [1], rows: C.usfda.map(u => [rup(u.site), rup(u.outcome), u.date, u.src]), source: 'Company presentations, AR FY26, CARE (17-Jul-2026)' } },
    { p: `**Capacity projects.** The US$90 mn US programme adds a commercial payload-linker suite at Riverview (done; "single to low double-digit" US$ mn revenue potential, CEO) and commercial sterile fill-finish at Lexington (104 to 240+ batches a year; H2 CY2027). NewAmsterdam's obicetrapib/ezetimibe suite at Sellersville was customer-funded. CARE notes API sites run at 70-80% utilisation while several formulation sites are under-used; capital turnover (revenue ÷ capital employed) has been 0.60-0.66x since FY22, against 0.74x in FY21.` },
    { p: `**The AbbVie JV.** AbbVie Therapeutics India (49%) earned ₹${n1(J.patFY26)} cr on ₹${n0(J.revenueFY26Stat)} cr of revenue in FY26 (₹${n1(J.patFY25)} cr in FY25), paid Piramal ₹${n1(J.dividendsFY26)} cr of dividends and is carried at ₹${n1(J.carrying)} cr. Its profit share (₹${n1(J.shareFY26)} cr) is in other income, outside EBITDA, so we value it separately: ${OB.abbvieGrowth[0]}% a year growth gives a Sep-28E share of ~₹${n1(X.jvShareSep28)} cr, worth ₹${n0(X.JV_VALUE)} cr (~₹${n1(X.JV_VALUE / X.sh)} a share) at 10x, ICICI Direct's basis. Yapan Bio (33.33%, carrying ₹122 cr) lost money in FY26; we keep it at book.` },
    { callout: '**So what:** in a CDMO, a clean regulatory record is a precondition for winning big-pharma commercial supply, and Piramal\'s is better than most Indian peers\'. It reduces one tail risk in our bear case; it does not by itself fill the plants.' },
  ],
};

module.exports = { pch, quality };
