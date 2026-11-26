// Poly Medicure report, part 3: the therapy chapters (infusion & vascular access, renal care, cardiology & orthopaedics).
const X = require('./POLYMED.ctx');
const { C, SA, SQ, n0, n1 } = X;
const sa = fy => SA.find(a => a.fy === fy), AQ = C.acquisitions;
const QS = SQ.filter(q => q.infusion != null);

const infusion = {
  id: 'infusion', nav: 'Infusion & vascular access', kicker: 'Core business', title: 'Infusion therapy and vascular access: half of revenue, a global cost leader, but it did not grow in FY26',
  blocks: [
    { p: `Infusion therapy (₹${n0(sa('FY26').infusion)} cr, 53% of FY26 revenue) is the business Polymed was built on: IV cannulae (safety and standard), infusion sets, extension lines, stopcocks, needle-free connectors and, recently, prefilled saline syringes. Polymed says it is the world's third-largest IV cannula maker with ~11% of global volume (~600 mn pieces a year), and its 390+ patents are mostly safety features on these products. Vascular access and critical care (PICC lines, central venous catheters, ports, midlines, arterial catheters; much of it designed at Plan1Health in Italy) sits in "others" and is one of the faster-growing lines. **FY26 was flat:** infusion revenue fell 1.5% (restated basis) as European distributors worked down stock, US orders paused on tariffs and Middle-East shipments stopped. **Q1FY27: +11.1%**, with India infusion +20% (more value-added products and price increases) and exports recovering.` },
    { pair: [
      { type: 'column', title: 'Infusion therapy: ₹466 cr → ₹1,012 cr, then a flat FY26', unit: 'Revenue (₹ crore); FY23-26 restated', x: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Infusion therapy', values: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(sa(f).infusion)), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Q1FY27 PPT p.6; Q4FY26 PPT p.33' },
      { type: 'column', title: 'Quarterly: back to +11% in Q1FY27', unit: 'Infusion therapy revenue (₹ crore)', x: QS.map(q => q.q), series: [{ name: 'Infusion', values: QS.map(q => q.infusion), fmt: 'num' }], labels: 'all', source: 'Q4FY26 and Q1FY27 PPTs (restated basis; Q2-Q3FY26 not published on it)' },
    ] },
    { exhibit: { type: 'table', title: 'Why Polymed wins in disposables, and where it is exposed', head: ['Strength', 'Exposure'], rows: [
      ['Cost: automated moulding and assembly, in-house tooling and sterilisation, Indian wages', 'Haryana minimum wage +35% from Apr-2026; freight 2-3x in six months'],
      ['Approvals: EU MDR on every site, 82 CE approvals; registrations in 100+ countries', 'Only ~4 own FDA approvals: the largest market is barely open'],
      ['Customers: distributor and OEM relationships of 15-20 years', 'Buyers multi-source and tender; Chinese makers compete on price'],
      ['Gross margin ~68% standalone', 'Resin and packaging are crude-linked (+~20% in early 2026); 2.5-3 months of inventory only delays the hit'],
    ], source: 'Q4FY26 and Q1FY27 calls; AR FY26 directors\' report' } },
    { callout: '**Our view:** this is a good, cash-generative core with modest growth: we expect ~10-12% a year (India faster, exports slower). It is not a moat in the strict sense: the products are copied and the buyers are price-driven, but scale, approvals and cost give Polymed a durable edge over most Indian and Chinese rivals.' },
  ],
};

const renal = {
  id: 'renal', nav: 'Renal care', kicker: 'Segment', title: 'Renal care: ₹188 cr and the only Indian dialyser maker, but Chinese imports set the price',
  blocks: [
    { p: `Polymed was the first Indian company to make dialysis consumables (haemodialysers, blood lines, fistula needles, transducer protectors, peritoneal sets) and now sells its own dialysis machine (450 placed in FY26, ~1,100 installed by Jul-2026). Machines matter because each one pulls through a stream of consumables. Renal revenue grew from ₹26 cr (FY20) to ₹${n1(sa('FY26').renal)} cr (FY26; +24.5%), but fell 3.8% in Q1FY27: Chinese makers ship dialysers into India duty-free from ASEAN plants, while Polymed pays duty on imported raw materials ("cost inversion"). Polymed chose to raise prices rather than defend volume and asked the government for protection: an anti-dumping investigation into dialysers from China and Malaysia has been opened, with a 20% injury margin claimed. Management still targets 15-20% growth in FY27 and hired a renal head from Nipro/Fresenius/DaVita.` },
    { pair: [
      { type: 'column', title: 'Renal revenue: ₹26 cr to ₹188 cr in six years', unit: '₹ crore', x: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Renal', values: ['FY20', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(sa(f).renal)), fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Q1FY27 PPT p.6; Q4FY26 PPT p.33' },
      { type: 'column', title: 'Quarterly: Q1FY27 −3.8% on Chinese pricing', unit: 'Renal revenue (₹ crore)', x: QS.map(q => q.q), series: [{ name: 'Renal', values: QS.map(q => q.renal), fmt: 'num' }], labels: 'all', source: 'Q4FY26 and Q1FY27 PPTs' },
    ] },
    { callout: '**Our view:** renal is the clearest example of Polymed\'s strategy and its limits. The installed base of machines is a real annuity, but the consumable is a commodity and the price is set by Chinese imports. An anti-dumping duty (a decision is possible within months, per management) would help; without it we would expect 10-15% growth, not 20%+. We do not model a duty.' },
  ],
};

const newlines = {
  id: 'newlines', nav: 'Cardiology & orthopaedics', kicker: 'New segments', title: 'Cardiology and orthopaedics: ₹78 cr a quarter, mostly bought in 2025, loss-making so far; the "Polymed 3.0" bet',
  blocks: [
    { p: `**Cardiology** (Q1FY27 ₹28.6 cr vs ₹2.9 cr) has two parts. Home-grown: drug-eluting stents (launched 2025; ~13,000 deployed by Jul-2026, still only ~₹10-12 cr of revenue a year), PTCA and drug-coated balloons and intravascular lithotripsy, backed by a 2,000-patient registry (PACIFIER, 840+ enrolled). Bought: **PendraCare** (Netherlands, 90% from 22-Sep-2025, EV €${AQ.pendracare.evEurMn} mn), which makes guiding and diagnostic catheters, partly for two large OEMs. Its CY25 revenue was €8.2 mn with EBITDA of just €84k, it lost ₹${n1(-AQ.pendracare.fy26LossBeforeTax)} cr before tax in its first six months, and ~20% of its sales go to the Middle East, so it is not growing this year. **Orthopaedics** (Q1FY27 ₹49.2 cr) is **Citieffe** (Bologna; 100% from 6-Nov-2025, EV €${AQ.citieffe.evEurMn} mn): trauma implants, external fixators and a navigation system for nailing, sold directly in Italy, the US and Mexico (#2 in Italy and Mexico). CY25 revenue was flat at €17.7 mn (a LatAm tender was cancelled) with EBITDA of €3.15 mn (18%); management guides 10-12% growth in EUR for FY27 and plans to add plates (doubling its market).` },
    { exhibit: { type: 'table', title: 'The two acquisitions in numbers', head: ['', 'PendraCare', 'Citieffe (Medistream group)'], rows: [
      ['Closed / stake', '22-Sep-2025 / 90%', '6-Nov-2025 / 100%'],
      ['Enterprise value (company)', `€${AQ.pendracare.evEurMn} mn`, `€${AQ.citieffe.evEurMn} mn`],
      ['Cash paid / contingent (₹ cr)', `${n1(AQ.pendracare.cashPaid)} / ${n1(AQ.pendracare.contingent)}`, `${n1(AQ.citieffe.cashPaid)} / ${n1(AQ.citieffe.contingent)}; ₹${n1(AQ.citieffe.debtAssumed)} cr debt assumed`],
      ['Goodwill (₹ cr)', n1(AQ.pendracare.goodwill), n1(AQ.citieffe.goodwill)],
      ['CY25 revenue / EBITDA', '€8.2 mn / €0.08 mn', '€17.7 mn / €3.15 mn'],
      ['FY26 revenue in Polymed / profit before tax (₹ cr)', `${n1(AQ.pendracare.fy26Revenue)} / ${n1(AQ.pendracare.fy26LossBeforeTax)}`, `${n1(AQ.citieffe.fy26Revenue)} / ${n1(AQ.citieffe.fy26LossBeforeTax)}`],
      ['Implied EV / CY25 revenue', `~${n1(AQ.pendracare.evEurMn / 8.2)}x`, `~${n1(AQ.citieffe.evEurMn / 17.7)}x (EV/EBITDA ~${n1(AQ.citieffe.evEurMn / 3.15)}x)`],
    ], source: 'AR FY26 note 38; Q1FY27 PPT pp.13-14; Q4FY26 and Q1FY27 calls' } },
    { pair: [
      { type: 'column', title: 'New segments in Q1FY27: ₹78 cr, up from ₹3 cr', unit: 'Q1 revenue (₹ crore)', x: ['Cardiology Q1FY26', 'Cardiology Q1FY27', 'Orthopaedics Q1FY27'], series: [{ name: 'Revenue', values: [2.9, 28.6, 49.2], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 PPT p.27' },
      { type: 'column', title: 'Plan1Health: the template (revenue 3.2x, margin +970bp)', unit: 'Revenue (€ thousand)', x: ['CY20', 'CY22', 'CY24', 'CY25'], series: [{ name: 'Revenue', values: [3239, 4829, 8108, 10514], fmt: 'num' }], labels: 'all', source: 'Q1FY27 PPT p.12' },
    ] },
    { callout: '**Our view:** strategically sensible (higher-value devices, direct sales in the US and Europe, Indian manufacturing to cut cost), financially unproven. We model the two businesses at ₹292 cr of revenue in FY27E, +10% a year after, and assume consolidated margins rise only slowly. If they reach the 18-20% EBITDA management talks of by FY29, our EBITDA is ~₹20-30 cr too low; if PendraCare keeps losing money, too high.' },
  ],
};

module.exports = { infusion, renal, newlines };
