// Abbott India report, part 3: own brands, Novo Nordisk partner brands, dealings with the parent, price control, moat.
const X = require('./ABBOTINDIA.ctx');
const { C, D, F, A, n0, n1, FY26, BL, build, ownShare, YRS } = X;
const BI = C.brandsIqvia.rows, RP = C.relatedParty, PO = C.portfolio, PR = C.pricing;
const own = BI.filter(r => r.owner === 'Own'), novo = BI.filter(r => r.owner !== 'Own');
const cg = r => Math.round((Math.pow(r.jul26 / r.jul23, 1 / 3) - 1) * 1000) / 10;
const partnerEbitda = [0.03, 0.05].map(m => BL.base.partner * m);

const ownBrands = {
  id: 'own', nav: 'Own brands', kicker: 'Own brands', title: 'The own-brand engine: ~₹4,500 cr growing 10-11% at a ~40% margin, led by thyroid, CNS and laxatives; Udiliv, Digene and Duphaston lag',
  blocks: [
    { p: `Abbott India's own portfolio (~65% of revenue, ~₹${n0(BL.base.own)} cr in FY26 on our split) is where the money is made: BOBCAPS estimates its EBITDA margin at 41.8% (Q4FY26), which means the own brands earn almost all of the company's ₹1,892 cr of EBITDA. On market data the portfolio grew ~10% in the year to Jul-2026 (Pharmarack ₹5,000 cr at retail value) and ~11% in Q1FY27. Growth is broad but uneven. Thyronorm (+12.7%), Cremaffin Plus (+20%), Vertin (+18%), Influvac (+25%) and Ganaton (+32%) are growing well. The three largest gastro and women's-health brands are not: Udiliv grew 3% on Pharmarack (9% on IQVIA) after years of mid-teens growth, Digene fell 1% and Duphaston grew 6% against cheaper dydrogesterone generics. Abbott launched five products in FY26 and plans 75 in five years, almost all line extensions and in-licensed molecules.` },
    { pair: [
      { type: 'hbar', title: 'Own brands: three-year growth, MAT Jul-23 to Jul-26 (IQVIA)', unit: 'Compound annual growth (%), IQVIA retail value; last year in the table below', x: [...own].sort((a, c) => cg(c) - cg(a)).map(r => r.brand), series: [{ name: 'CAGR', values: [...own].sort((a, c) => cg(c) - cg(a)).map(cg), fmt: 'pct' }], labels: 'all', highlight: 'Thyronorm', source: 'ICICI Direct result update, 13-Aug-2026 (IQVIA)' },
      { type: 'hbar', title: 'Pharmarack growth by brand, MAT Jun-2026: leaders and laggards', unit: 'Secondary sales growth year on year (%)', x: ['Ganaton', 'Evitol', 'Vertin', 'Cremaffin Plus', 'Creon', 'Inderal', 'Thyronorm', 'Prothiaden', 'Duphalac', 'Influvac Tetra', 'Zolfresh', 'Duphaston', 'Udiliv', 'Digene'], series: [{ name: 'Growth', values: [32, 30, 21, 15, 13, 13, 12, 12, 11, 10, 8, 5, 3, -2], fmt: 'pct0' }], labels: 'all', highlight: 'Udiliv', source: 'BOBCAPS company update, 3-Sep-2026, fig. 17 (Pharmarack)' },
    ] },
    { exhibit: { type: 'table', title: 'Own-brand watch list', head: ['Brand (therapy)', 'MAT Jul-26 (₹ cr, IQVIA)', 'Growth', 'What to watch'], wide: [3], rows: [
      ['Thyronorm (thyroid)', '791', '+12.7%', 'Volume-led: the whole range is under price control (+0.65% allowed in FY27)'],
      ['Udiliv (liver)', '759', '+8.9% IQVIA / +3% Pharmarack', 'Largest gastro brand (₹700 cr+); slowed from mid-teens; MASLD/MASH awareness is the long-term driver'],
      ['Cremaffin Plus (laxative)', '428', '+19.8%', 'Consumer-facing; strongest grower among the large brands'],
      ['Duphaston (pregnancy support)', '421', '+8.5%', 'Generic dydrogesterone at lower prices; Abbott defends with clinical engagement'],
      ['Duphalac (laxative)', '410', '+6.0%', 'Line extension Duphalac Rapid (FY26)'],
      ['Influvac (flu vaccine)', '407', '+25.2%', 'Seasonal; trivalent switch raised competition and price pressure'],
      ['Vertin (vertigo)', '376', '+18.3%', 'CNS franchise accelerating (+15% for CNS overall)'],
    ], source: 'ICICI Direct 13-Aug-2026 (IQVIA); BOBCAPS 3-Sep-2026 (Pharmarack); AR FY26 business reviews' } },
    { callout: '**So what:** the own-brand business is a high-margin, low-capital annuity growing at roughly market pace. It is not a growth story: no new molecules of its own, price control on its biggest brand, and generic pressure on two others. We model it at +11% / +10.5% / +10% for FY27-29E, in line with Q1FY27 and the IQVIA trend.' },
  ],
};

const partner = {
  id: 'partner', nav: 'Novo Nordisk brands', kicker: 'Partner brands', title: 'Novo Nordisk\'s brands: a third of revenue, a thin margin and a shrinking portfolio; Extensior arrived just before generics',
  blocks: [
    { p: `Abbott India has marketed Novo Nordisk's insulin in India for decades (the human-insulin pact with Novo and Torrent dates back to the Boots/Knoll era; sources give 1987 or 1998). The arrangement was ~35% of revenue in FY21-24 (company split published by BOBCAPS: ₹1,535 cr in FY21, ₹2,048 cr in FY24) and is still ~35% (BOBCAPS, Sep-2026). Abbott buys the products and resells them for a distribution margin: BOBCAPS' core-portfolio figures imply a partner EBITDA margin of only ~3-5%, i.e. ~₹${n0(partnerEbitda[0])}-${n0(partnerEbitda[1])} cr a year, 4-6% of EBITDA. Three things have changed since 2025. (1) In Apr-2025 Novo told Abbott it would discontinue Penfill and FlexPen insulins (Actrapid, Insulatard, Levemir, Xultophy) in India; Human Mixtard continues in vials. Mixtard fell 31% in the year to Jul-2026. (2) Semaglutide's patent expired on 20-Mar-2026: Rybelsus (oral semaglutide) fell 16% as generics arrived. (3) On 27-Feb-2026 Novo gave Abbott Extensior, a second brand of semaglutide (Ozempic) for diabetes, launched into the generic price war. Ryzodeg (+13%) is the one large Novo brand still growing.` },
    { pair: [
      { type: 'column', title: 'Novo brands Abbott sells: Ryzodeg up, Mixtard and Rybelsus down', unit: 'IQVIA sales at retail value, MAT July (₹ crore)', x: ['MAT Jul-23', 'MAT Jul-24', 'MAT Jul-25', 'MAT Jul-26'], series: novo.map(r => ({ name: r.brand, values: [r.jul23, r.jul24, r.jul25, r.jul26], fmt: 'num' })), labels: 'all', source: 'ICICI Direct result update, 13-Aug-2026 (IQVIA)' },
      { type: 'stacked', title: 'Our build: partner brands fall to ~29% of revenue by FY29E', unit: 'Revenue (₹ crore); FY27-29E = GAM', x: ['FY26', ...YRS], series: [{ name: 'Own brands', values: [BL.base.own, ...build.own], fmt: 'num' }, { name: 'Novo partner brands', values: [BL.base.partner, ...build.partner], fmt: 'num' }], minLabel: 1500, source: 'BOBCAPS (65/35 split); GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'What happens to Abbott if the partner business shrinks or ends', head: ['Case', 'Revenue effect', 'EBITDA effect', 'Comment'], wide: [3], rows: [
      ['Our base: partner −4% / +2% / +3% (FY27-29E)', `FY29E partner ₹${n0(build.partner[2])} cr (${n1(100 - ownShare(2))}% of revenue)`, 'Small', 'Extensior volume offsets insulin attrition from FY28'],
      ['Novo exits more formats; partner −15% a year', 'About −5% a year on total revenue', 'About −0.5% to −1% a year', 'Reported growth looks poor; margin rises on mix'],
      ['Novo ends the arrangement', 'About −35% of revenue', `−₹${n0(partnerEbitda[0])}-${n0(partnerEbitda[1])} cr (4-6%) plus shared costs`, 'Field-force and distribution overheads would need resizing'],
    ], source: 'BOBCAPS (split and core margin); GAM estimates' } },
    { callout: '**Our read:** the partner business matters far more for revenue than for profit. Its decline is the main reason reported growth (4% in Q1FY27) looks so much worse than the own-brand business (~11%), and also a reason margins keep rising. The real risk is not the lost margin but a weaker negotiating position with doctors and distributors if the diabetes bag shrinks, and the fact that Novo, not Abbott, decides what stays in it. The agreement\'s terms and duration are not disclosed.' },
  ],
};

const parent = {
  id: 'parent', nav: 'Dealings with the parent', kicker: 'Parent dealings', title: 'Dealings with Abbott: no royalty, ₹409 cr of purchases from a Swiss affiliate, and ₹757 cr of dividends a year to the parent',
  blocks: [
    { p: `Many Indian subsidiaries of foreign drug makers pay a royalty or brand fee to the parent. Abbott India does not: the FY26 annual report says it "has access to marketing rights with the affiliates of the parent company for which no price is paid or payable" (the note names Abbott Healthcare Products BV and Abbott Biologicals BV, Netherlands). The money flows to the parent through three other channels. **Purchases:** ₹${n0(RP.purchasesFy26.abbottProductsOperationsAgRawMaterials)} cr of raw materials and ₹${n0(RP.purchasesFy26.abbottProductsOperationsAgTradedGoods)} cr of finished goods from Abbott Products Operations AG (Switzerland) in FY26 (₹533 cr in FY25); related parties supplied ${RP.rptShareOfPurchasesPct.fy26}% of all purchases (${RP.rptShareOfPurchasesPct.fy25}% in FY25). **Services with Abbott Healthcare Pvt Ltd** (the parent's unlisted Indian arm): Abbott India paid ₹${n0(RP.expensesToAffiliatesFy26.ahplSharedServices)} cr for shared services, ₹${n0(RP.expensesToAffiliatesFy26.ahplConversionCharges)} cr of conversion (contract manufacturing) charges and ₹${n0(RP.expensesToAffiliatesFy26.ahplLeasePayments)} cr of office rent, and received ₹${n0(RP.incomeFromAffiliatesFy26.ahplSharedServices)} cr for services it provides. **Dividends:** ₹${n0(RP.dividendsToParentFy26.total)} cr in FY26 (75% of the dividend).` },
    { exhibit: { type: 'table', title: 'Related-party flows with the Abbott group (₹ crore)', head: ['Flow', 'Counterparty', 'FY25', 'FY26', 'Direction'], wide: [1], rows: [
      ['Royalty / brand fee', 'Abbott affiliates (marketing rights)', '0', '0', '–'],
      ['Raw materials purchased', 'Abbott Products Operations AG, Switzerland', n0(RP.purchasesFy25.abbottProductsOperationsAgRawMaterials), n0(RP.purchasesFy26.abbottProductsOperationsAgRawMaterials), 'Out'],
      ['Finished goods purchased', 'Abbott Products Operations AG; Abbott Healthcare', n0(RP.purchasesFy25.abbottProductsOperationsAgTradedGoods + RP.purchasesFy25.ahplTradedGoods), n0(RP.purchasesFy26.abbottProductsOperationsAgTradedGoods + RP.purchasesFy26.ahplTradedGoods), 'Out'],
      ['Shared services, conversion charges, rent and lease interest', 'Abbott Healthcare Pvt Ltd', '151', n0(RP.expensesToAffiliatesFy26.ahplSharedServices + RP.expensesToAffiliatesFy26.ahplConversionCharges + RP.expensesToAffiliatesFy26.ahplLeasePayments + RP.expensesToAffiliatesFy26.ahplFinanceCost), 'Out'],
      ['Restricted stock units and share purchase plan', 'Abbott Laboratories, USA', '20', n0(RP.expensesToAffiliatesFy26.rsuToParent + RP.expensesToAffiliatesFy26.espp), 'Out'],
      ['Services income, rent and sales', 'Abbott Healthcare and other affiliates', '141', n0(RP.incomeFromAffiliatesFy26.ahplSharedServices + RP.incomeFromAffiliatesFy26.otherAffiliatesServices + RP.incomeFromAffiliatesFy26.ahplRent + RP.incomeFromAffiliatesFy26.salesToAhpl), 'In'],
      { hl: true, cells: ['**Dividends to the promoter group**', '**Three UK holding companies**', '**653**', `**${n0(RP.dividendsToParentFy26.total)}**`, '**Out**'] },
    ], source: 'AR FY26 note 39 (related-party disclosures) and BRSR; FY25 service and income totals from the same note (comparatives)' } },
    { callout: '**Our read: GREEN on terms, AMBER on structure.** The absence of a royalty is a real plus for minority holders, and related-party purchases are falling as a share of the total. But the parent controls the brands (marketing rights can be withdrawn or priced), decides which new Abbott products go to the listed company or to its 100%-owned Abbott Healthcare, and sets the payout. A royalty, if introduced, would need approval by minority shareholders only above SEBI\'s materiality threshold (the lower of ₹1,000 cr or 10% of turnover a year). BOBCAPS lists "increase in royalty from the parent" as a key risk; we see no royalty today, but the risk is real.' },
  ],
};

const pricing = {
  id: 'pricing', nav: 'Price control', kicker: 'Policy', title: 'Price control: about a quarter of the own portfolio is under NLEM, including all of Thyronorm; FY27\'s allowed increase is 0.65%',
  blocks: [
    { p: `India caps the prices of medicines on the National List of Essential Medicines (NLEM) through the Drug Price Control Order (DPCO). The National Pharmaceutical Pricing Authority (NPPA) sets a ceiling for each formulation and lets it rise each April by the wholesale-price index: +${PR.wpiRevisionApr26Pct}% from 1-Apr-2026. Medicines outside the list may raise prices by up to 10% a year. At its last investor meet (Sep-2022) Abbott said ~${PR.nlemShareOwnPct}% of its own business by value is NLEM, and that its "entire range" of Thyronorm (12.5-150 mcg) is under price control. Human insulins (part of the Novo partner business) are also on the list. The only price-control liability on Abbott's books is a 1996 Drug Prices Equalisation Account claim (₹3.47 cr, under stay).` },
    { exhibit: { type: 'table', title: 'Price-control exposure (own portfolio; GAM illustration for FY27)', head: ['Bucket', 'Share of own sales', 'Allowed / assumed price rise', 'Contribution'], rows: [
      ['NLEM (scheduled) brands, incl. Thyronorm', `~${PR.nlemShareOwnPct}%`, `+${PR.wpiRevisionApr26Pct}% (WPI)`, `+${n1(PR.nlemShareOwnPct / 100 * PR.wpiRevisionApr26Pct)}pp`],
      ['Non-scheduled brands', `~${100 - PR.nlemShareOwnPct}%`, '~+5% (GAM assumption; up to 10% allowed)', `+${n1((100 - PR.nlemShareOwnPct) / 100 * 5)}pp`],
      { hl: true, cells: ['**Own-portfolio price growth**', '**100%**', '', `**~+${n1(PR.nlemShareOwnPct / 100 * PR.wpiRevisionApr26Pct + (100 - PR.nlemShareOwnPct) / 100 * 5)}%**`] },
    ], source: 'Investor meet transcript, 28-Sep-2022 (NLEM share); NPPA order S.O. 1575(E), 25-Mar-2026 (WPI +0.65%); GAM' } },
    { callout: '**So what:** price control caps the pricing of Abbott\'s largest own brand but has not stopped it growing: Thyronorm has compounded ~10% a year (IQVIA, MAT Jul-23 to Jul-26), mostly on volume. The risks are a new NLEM list adding more of Abbott\'s molecules (BOBCAPS flags it), a low WPI year (as now), and trade-margin rationalisation. With ~4% price growth on the own portfolio, the rest of the ~10-11% growth we model must come from volume and launches.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a real but narrow moat in trusted brands and Abbott\'s portfolio; no pipeline and little pricing power',
  blocks: [
    { exhibit: { type: 'table', title: 'Moat scorecard', head: ['Source of advantage', 'Score', 'Evidence'], wide: [2], rows: [
      ['Brand equity and prescriber trust', '**Strong**', '7 brands in the IPM top 100; #1 in hepatoprotectives and hormones; 12 brands #1 in their markets (BOBCAPS, FY24)'],
      ['Access to Abbott\'s global portfolio', '**Strong (at the parent\'s discretion)**', 'Duphaston, Creon, Influvac, Femoston under free marketing rights; Novo partnership'],
      ['Asset-light cost position', '**Strong**', 'Capex ~₹50 cr a year; traded goods 46% of revenue; operating capital tiny (working capital ~3% of revenue)'],
      ['Field force and reach', '**Medium**', '~3,250 representatives (FY24), 3,000+ stockists, 1.75 lakh pharmacies; productivity high but scale below the large Indian companies'],
      ['Innovation and pipeline', '**Weak**', 'No own R&D; launches are line extensions and in-licensed products (5 in FY26)'],
      ['Pricing power', '**Weak**', '~26% of own portfolio under NLEM (all of Thyronorm); dydrogesterone generics'],
      ['Control over the partner third', '**Weak**', 'Novo decides formats and launches; terms undisclosed'],
    ], source: 'GAM assessment from AR FY26, BOBCAPS (Apr-2025, Sep-2026), ICICI Direct (Aug-2026), investor meet (2022)' } },
    { p: 'The moat is in the brands: Thyronorm, Udiliv, Duphalac, Cremaffin and Vertin have held leadership for years because doctors trust them and patients repeat them, and Abbott can sell them with almost no capital. That is why the business earns a 34% return on equity even with ₹4,400 cr of low-yielding cash, and a return on operating capital that is extremely high. The moat does not protect prices (price control, generics) and does not create new products; growth depends on market growth and on what the parent chooses to give the listed company.' },
    { callout: '**Verdict:** narrow moat, wide returns. The brands justify a premium to generic-export pharma, but the absence of a pipeline and the dependence on the parent and Novo argue against paying for growth that is not there.' },
  ],
};

module.exports = { ownBrands, partner, parent, pricing, moat };
