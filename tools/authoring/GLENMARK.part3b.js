// Glenmark report, part 3b: Europe and emerging markets, ISB 2001 / IGI (the licensing deal and how we treat it), moat.
const X = require('./GLENMARK.ctx');
const { C, D, F, n0, n1, rup, Q1, FY26, SQ, QL, BL, lines, YRS, share, ISB, ISB_NPV_MOSL, price, isbRep } = X;
const EU = SQ.map(q => q.europe), EM = SQ.map(q => q.em);

const others = {
  id: 'others', nav: 'Europe & emerging markets', kicker: 'Segments: Europe (24%) and emerging markets (23%)', title: 'Europe and emerging markets: half of core revenue, branded, growing 8-15% a year',
  blocks: [
    { p: `**Europe** (₹${n0(FY26.europeCr)} cr in FY26, +9%) was Glenmark's fastest-growing region for four years (CMD). It sells generics in Western and Central-Eastern Europe and a growing branded list: Ryaltris (with partner Menarini in some markets), eight other respiratory products, and dermatology brands Winlevi (acne; launched in the UK in Q1FY26 and in the Nordics, CEE and Spain in Q1FY27) and Hilkota. Branded products are ~30% of European sales; the target is ~60% in five years. Growth slowed to ${n1((Q1.europe / Q1.europePrior - 1) * 100)}% in Q1FY27; management guides high single digits for FY27 and double digits from FY28 as 2-3 respiratory launches land.` },
    { p: `**Emerging markets** (₹${n0(FY26.emCr)} cr, +5%; Russia/CIS, Latin America, Middle East & Africa, Asia-Pacific) grew ${n1((Q1.em / Q1.emPrior - 1) * 100)}% in Q1FY27. Glenmark is No.8 in Russian dermatology (IQVIA), and Ryaltris is the leading allergy nasal spray in most markets where it is sold; it launches in Brazil in H2FY27 and was launched in China (Grand Pharma) and Thailand (Organon) in Q4FY26. EM is also where the in-licensed oncology drugs go first (Aumolertinib from H2FY27; Trastuzumab Rezetecan filings from Q2FY27; envafolimab in FY28), with commercial teams built ahead of launch, which is part of why the FY27 margin guide is 21-22% rather than 23%.` },
    { pair: [
      { type: 'column', title: 'Europe: a seasonal Q4 peak; +12% in Q1FY27', unit: 'Europe sales (₹ crore)', x: QL, series: [{ name: 'Europe', values: EU, fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company releases' },
      { type: 'column', title: 'Emerging markets: +28% in Q1FY27', unit: 'Emerging-market sales (₹ crore)', x: QL, series: [{ name: 'EM', values: EM, fmt: 'num' }], labels: 'all', highlight: 'Q1FY27', source: 'Company releases' },
    ] },
    { callout: `**Our view:** we model Europe +${BL.growth.europe.join(' / +')}% and emerging markets +${BL.growth.em.join(' / +')}% for FY27-29E: ₹${n0(lines.europe[0] + lines.em[0])} cr together in FY27E (${n1(share('europe', 0) + share('em', 0))}% of revenue). These are steady branded businesses, but many of the growth products are in-licensed or partnered (Winlevi from Cassiopea, oncology from Chinese originators), so Glenmark shares the margin. Currency is the swing factor: the rouble and Latin American currencies have hurt reported growth before.` },
  ],
};

const recog = ISB.recognitionUsdMn;
const igi = {
  id: 'igi', nav: 'ISB 2001 & IGI', kicker: 'Innovation: Ichnos Glenmark Innovation', title: 'ISB 2001: one US$700mn cheque, a US$70mn-a-year research bill, and milestones we do not count',
  blocks: [
    { p: `In July 2025 IGI licensed **ISB 2001** (now ABBV-2001), a trispecific antibody for multiple myeloma built on its BEAT platform, to AbbVie: **US$${ISB.upfrontUsdMn}mn upfront** (received in September 2025), **up to US$${n0(ISB.milestonesUsdMn)}mn** in development, regulatory and commercial milestones, and tiered double-digit royalties on sales. AbbVie has the main markets (North America, Europe, Japan, Greater China); Glenmark will sell it in emerging markets. More than 160 patients have been dosed in the Phase 1 TRIgnite study; no milestone had been received by August 2026 (CMD). IGI's next molecule, ISB 2301, is due to enter the clinic (IND) by the end of 2026, and IGI targets one IND a year.` },
    { pair: [
      { type: 'column', title: 'How the US$700mn upfront hits reported revenue', unit: 'ISB 2001 upfront recognised (US$ mn)', x: ['Q2FY26', 'H2FY26', 'FY27', 'FY28', 'FY29'], series: [{ name: 'Recognised', values: [recog.Q2FY26, recog.H2FY26, recog.FY27, recog.FY28, 0], fmt: 'num' }], labels: 'all', source: 'Q2FY26 presentation (company schedule); FY29 = nothing left' },
      { type: 'hbar', title: 'Upfront plus opening cash (₹7,655 cr): where it went in H1FY26', unit: '₹ crore (CFO, Nov-2025). Working capital: pre-collections stopped, inventory; one-time: IGI bonus, deal costs, Swiss closure; deficit: India destocking. Deal taxes (~US$90mn) mostly paid later', x: ['Gross debt repaid', 'Working capital', 'One-time costs', 'Capex', 'Operating cash deficit', 'Interest and tax', 'Legal settlements', 'Cash left at Sep-2025'], series: [{ name: '₹ crore', values: [ISB.debtRepaidCr, 1600, ISB.oneTimeCashCr, 500, 500, 225, 200, 2647], fmt: 'num' }], labels: 'all', highlight: 'Cash left at Sep-2025', source: 'Q2FY26 call (CFO cash reconciliation from the ₹1,705 cr opening cash plus ~₹5,950 cr received)' },
    ] },
    { exhibit: { type: 'table', title: 'How we treat the deal (and how the street does)', head: ['Item', 'What happened by 30-Sep-2026', 'Our treatment'], wide: [1, 2], rows: [
      ['**Upfront, Q2FY26 (US$525mn)**', 'Booked in revenue (₹4,500 cr, net of ₹830 cr of one-time charges = ₹3,670 cr in North America)', 'One-off: removed from the EPS history we use for the multiple (FY26 core EPS ₹7.2)'],
      ['**Upfront, deferred (US$175mn)**', `US$17.5mn a quarter from Q3FY26 to Q4FY28 (₹${n0(isbRep[0])} cr in FY27E, ₹${n0(isbRep[1])} cr in FY28E); cash already received`, 'One-off: excluded from our FY27-28E revenue and EPS. Brokers (MOSL, Choice) keep it in.'],
      ['**IGI research (~US$70mn a year)**', 'About half of group R&D; funded from the upfront for three years', 'Kept in our costs: it was in the FY22-25 history too'],
      ['**Milestones (up to US$1.225bn)**', 'None received; timing depends on AbbVie\'s trials', 'Not forecast; treated as one-offs if they come'],
      ['**Royalties (double-digit)**', 'Only after approval; ISB 2001 is still in Phase 1', 'Not forecast'],
      ['**Separate value for ISB 2001 / IGI**', `Motilal Oswal adds an NPV of ₹${ISB_NPV_MOSL} a share; Deven Choksey and the others we could read do not`, `Not in the base (one of two brokers that disclose a method); shown as a sensitivity (+₹${ISB_NPV_MOSL}, ${n1(ISB_NPV_MOSL / price * 100)}% of the share price)`],
    ], source: 'Q2FY26 presentation and call; Q4FY26 and Q1FY27 calls; AR FY26 notes 15, 17 and 19; broker notes as cited' } },
    { exhibit: { type: 'table', title: 'IGI pipeline (Q1FY27 presentation)', head: ['Asset', 'What it is', 'Stage', 'Partner'], wide: [1], rows: [
      ['ISB 2001 (ABBV-2001)', 'CD38 x BCMA x CD3 trispecific T-cell engager, multiple myeloma', 'Phase 1 (>160 patients); Phase 1/2 combination study started', 'AbbVie (Glenmark: emerging markets)'],
      ['ISB 2301', 'Multispecific immune-cell (NK/T) activator, solid tumours', 'IND planned by end-2026', 'None: partnering only after human data (CMD)'],
      ['ISB 2302 / ISB 2501', 'Bispecific immune modulator / trispecific T-cell engager', 'Preclinical', '–'],
      ['ISB 880 (LAD191)', 'IL-1RAP antagonist, hidradenitis suppurativa', 'Phase 2', 'Almirall'],
      ['ISB 830-X8 (STAR-0310)', 'OX40 antagonist, atopic dermatitis', 'Phase 1 completed', 'Astria, now BioCryst ("no visibility" on next steps)'],
    ], source: 'Q1FY27 presentation and call; Investor Day 2026' } },
    { callout: '**Our view:** ISB 2001 proved that IGI can create value, and the cheque repaired the balance sheet. But the reported earnings flatter Glenmark until March 2028, because part of AbbVie\'s 2025 cash is still being booked as revenue, in slices that roughly cancel IGI\'s spending. After that, IGI\'s ~US$70mn a year falls on Glenmark\'s P&L unless milestones arrive. We do not pay for milestones or royalties we cannot time; a buyer of the stock gets them as an option.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real brands in India and real respiratory skills; no moat in US generics; IGI is an option, not a moat',
  blocks: [
    { verdicts: D.moat.map(m => [m.area, m.verdict, rup(m.evidence), rup(m.soWhat)]), head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'GAM Research; company; IQVIA via company' },
    { callout: '**Honest verdict:** Glenmark\'s durable assets are its Indian dermatology, respiratory and cardiac brands and its respiratory development skills (Ryaltris is a genuine global product). Its US generics business has no advantage and a weak compliance record, its cost base earns lower margins than Sun, Cipla or Torrent, and IGI\'s value depends on trials it no longer controls. A good franchise inside a company that has repeatedly needed one-off money to fix its balance sheet.' },
  ],
};

module.exports = { others, igi, moat };
