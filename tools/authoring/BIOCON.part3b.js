// Biocon report, part 3b: generics (APIs, formulations, GLP-1s) and research services (Syngene) plus Bicara.
const X = require('./BIOCON.ctx');
const { C, F, AS, n0, n1, pc, rup, rev, ebs, SEGH, BL, MG, SG, SY, synRev, synEb, synPat, mi, P } = X;
const QS = SG.quarterly || [];

const generics = {
  id: 'generics', nav: 'Generics', kicker: 'Segment: generics (17% of revenue)', title: 'Generics: new plants, thin margins; profitable growth depends on utilisation and GLP-1s',
  blocks: [
    { p: `The generics business sells APIs (about 60% of the segment in Q1FY27, two-thirds historically) and finished generics (pills from Cranbury, New Jersey and Bengaluru; injectables and peptides) in the US, Europe and emerging markets. External revenue was ₹${n0(SEGH.FY26.ext.generics)} cr in FY26 (+17% like for like after the one-time US lenalidomide sales of Q4FY25), but EBITDA before other income was only ₹${n0(SEGH.FY26.generics)} cr (1.5%): new API plants at Vizag and Hyderabad, peptide and injectable capacity in Bengaluru and the Cranbury expansion carry costs before they carry volume ("margins reflect higher costs from recently commissioned facilities", Q4FY26 presentation). Gross margin is in the "early 40s" (CFO). Q1FY27 improved: revenue ₹760 cr (+21%), EBITDA ₹56 cr (7%, company basis), helped by API pricing premiums, R&D pruning and opex cuts after the integration (CFO, Q1FY27 call).` },
    { pair: [
      { type: 'column', title: 'Generics revenue per quarter: ₹620-850 cr (Q4FY25 incl. lenalidomide)', unit: 'Segment revenue (₹ crore per quarter)', x: QS.map(q => q.q), series: [{ name: 'Generics', values: QS.map(q => q.genRev), fmt: 'num' }], labels: 'all', source: 'Company presentations and press releases (Q1FY27 on the new, lower-inter-segment basis)' },
      { type: 'column', title: 'Generics EBITDA: near zero for a year, ₹56-75 cr lately', unit: 'Segment EBITDA incl. other income (₹ crore per quarter)', x: QS.map(q => q.q), series: [{ name: 'EBITDA', values: QS.map(q => q.genEbitda), fmt: 'num' }], labels: 'all', source: 'Company presentations and press releases' },
    ] },
    { p: '**GLP-1s are the story management tells; they are not yet the numbers.** Biocon was first to win approval for a generic liraglutide in a major regulated market (UK, 2024), followed by the EU, Australia and in Q4FY26 the US (copies of Victoza and Saxenda); the US launch came in Q1FY27, but liraglutide was "in single digits" of segment revenue that quarter (CFO). GLP-1s were less than 10% of the segment in FY26. Semaglutide (the $34 bn US market of Ozempic/Wegovy) is filed in Canada and Brazil and its US DMF is filed; US patents run well into the 2030s. Other launches named in the June-2026 presentation include everolimus, tacrolimus, dasatinib, sitagliptin, apixaban and dalbavancin.' },
    { exhibit: { type: 'table', title: 'Our generics build (₹ crore)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [6], rows: [
      ['External revenue', n0(SEGH.FY25.ext.generics), n0(SEGH.FY26.ext.generics), ...rev.generics.map(n0), `Growth ${BL.growth.generics.map(g => `+${g}%`).join(' / ')}`],
      ['EBITDA before other income', `${n0(SEGH.FY25.generics)} (incl. ~281 lenalidomide)`, n0(SEGH.FY26.generics), ...ebs.generics.map(n0), `Margin ${MG.generics.map(m => `${n1(m)}%`).join(' / ')}`],
    ], source: 'AR FY25/FY26 note 40; Q4FY26 presentation (FY25 ex-lenalidomide EBITDA); GAM estimates' } },
    { callout: '**So what:** generics are worth little today (₹43 cr of FY26 EBITDA before other income) and their value in our SOTP (~₹23 a share at 9.5x Sep-28E EBITDA) assumes margins reach 9-11% as plants fill. That is plausible, since Q1FY27 is already at 7% on the company basis, but it is a recovery, not a franchise: API prices are set globally and Chinese competition is intense. The upside case is GLP-1 peptides, where fermentation-based capacity gives Biocon a cost edge.' },
  ],
};

const syngene = {
  id: 'syngene', nav: 'Syngene & Bicara', kicker: 'Listed stakes: Syngene (52.4%) and Bicara (~10%)', title: 'Syngene and Bicara: worth ~₹43 a share at market less 20%; both fell hard in 2025-26',
  blocks: [
    { p: `**Syngene** is a contract research, development and manufacturing company with ~400 clients (BMS, GSK, Zoetis, Merck KGaA; the BMS partnership runs to 2035). FY26 revenue was ₹3,739 cr (+3%) with a 24.6% operating EBITDA margin. Then one large biologics client cut its offtake: Q1FY27 revenue fell 16% to ₹736 cr, the operating margin was 12% and Syngene lost ₹9 cr. Management calls FY27 a "transition year" with a single-digit rupee decline and a return to growth from FY28; Siddharth Mittal, Biocon's former CEO, now runs it (Q1FY27 call). Biocon owns 52.4% (AR FY26). At ₹${SY.price} on 30-Sep-2026 Syngene was worth ₹${n0(SY.price * SY.shares)} cr, so Biocon's stake was ₹${n0(SY.price * SY.shares * SY.stake / 100)} cr, ₹${n1(SY.price * SY.shares * SY.stake / 100 / F.shares)} a share. Syngene traded near ₹700 in 2024.` },
    { exhibit: { type: 'table', title: 'Syngene: what we assume (used only for the minority deduction; the stake is valued at market)', head: ['₹ crore', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue', '3,739', ...synRev.map(n0)],
      ['Operating EBITDA', '921', ...synEb.map(n0)],
      ['Margin', '24.6%', ...MG.services.map(m => `${n1(m)}%`)],
      ['Net profit', '317', ...synPat.map(n0)],
      ['Minorities\' share (47.6%), deducted from Biocon\'s profit', '151', ...mi.map(n0)],
    ], source: 'Syngene (Screener, consolidated); GAM estimates' } },
    { p: `**Bicara Therapeutics** (Nasdaq: BCAX) is a US biotech developing ficerafusp alfa, a two-in-one antibody for head and neck cancer that has FDA Breakthrough Therapy designation (AR FY26). Biocon incubated it; its CEO is Claire Mazumdar, the chairperson's niece and named successor. Biocon holds 5,523,897 shares (AR FY26 note 5), ~10% of the company: at $18.61 on 30-Sep-2026 and ₹95.81/$, ₹${n0(5523897 * 18.61 * 95.81 / 1e7)} cr (₹${n1(5523897 * 18.61 * 95.81 / 1e7 / F.shares)} a share). The chairperson called it "no longer a significant investment" to be monetised "at the right time" (Q1FY27 call). Bicara's losses are not in Biocon's P&L (it is a fair-value investment), so no start-up losses need to be valued: its share price already reflects them.` },
    { callout: '**So what:** we value both stakes at their 30-Sep market value less 20% (house precedent for listed stakes; MOSL uses 15% for Syngene): ₹6,171 cr for Syngene and ₹788 cr for Bicara, ~₹43 a share in total. Each ₹100 move in Syngene\'s share price changes our target by ~₹10. Selling down Syngene further (as Biocon did in FY23 and FY25) would turn the discount into cash and cut debt.' },
  ],
};

module.exports = { generics, syngene };
