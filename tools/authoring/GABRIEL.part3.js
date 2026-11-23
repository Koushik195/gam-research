// Gabriel India report, part 3: the standalone ride-control and fluids business, the subsidiaries, the JVs and associates
// (the profit-share build), and the moat scorecard.
const X = require('./GABRIEL.ctx');
const { D, SA, SQ, AS, F, BL, bld, jv, jvTot, n0, n1, R26, jvPctPbt } = X;
const y = fy => SA.find(a => a.fy === fy), y26 = y('FY26');
const q = k => SQ.find(r => r.q === k);

const ride = {
  id: 'ride', nav: 'Ride control (standalone)', kicker: 'Core business', title: 'Ride control and fluids: ~87% of revenue, a 8-9% EBITDA margin, growing with production',
  blocks: [
    { p: `The standalone company (ride control plus, since the scheme, Anchemco's fluids) had restated FY26 revenue of ₹${n0(y26.standaloneRev)} cr (₹4,233 cr before Anchemco) and EBITDA of ~₹409 cr (8.9%). In Q1FY27 revenue rose 18.9% to ₹1,274 cr on strong two-wheeler and truck production and a jump in aftermarket sales, but the EBITDA margin fell to 8.4% (company: ₹107 cr vs ₹100 cr) as commodity costs rose with the West Asia conflict and OEM recoveries lagged. Car revenue grew only ~5.5% against industry production +15%, because Gabriel is not on some of the fastest-growing UV platforms and its largest customer lost share (call). Capex is modest: ~₹190 cr in FY26 and ₹160-190 cr guided for FY27, for expansions at Hosur, Khandsa and Sanand.` },
    { pair: [
      { type: 'column', title: 'Standalone revenue: ₹864 cr (Q1FY25) to ₹1,274 cr (Q1FY27)', unit: 'Standalone revenue (₹ crore)', x: SQ.filter(r => r.standaloneRev).map(r => r.q), series: [{ name: 'Standalone revenue', values: SQ.filter(r => r.standaloneRev).map(r => r.standaloneRev), fmt: 'num' }], labels: 'all', source: 'Screener.in standalone; Q1FY27 results (Q1FY26 and Q4FY26 restated incl. Anchemco; Q2-Q3FY26 not restated, not shown)' },
      { type: 'column', title: `Our build: standalone +${BL.saGrowth.join('% / +')}% at ${BL.saMargin.join('% / ')}% EBITDA`, unit: 'Standalone revenue (₹ crore)', x: ['FY26', ...bld.map(r => r.y)], series: [{ name: 'Revenue', values: [y26.standaloneRev, ...bld.map(r => Math.round(r.sa))], fmt: 'num' }, { name: 'EBITDA', values: [409, ...bld.map(r => Math.round(r.se))], fmt: 'num' }], labels: 'all', source: 'Q1FY27 results (restated FY26 standalone); GAM estimates' },
    ] },
    { callout: '**Our read:** a good, steady franchise: leadership in trucks and electric two-wheelers, wide coverage of two-wheelers, a growing aftermarket. But margins have stayed in a 6-10% band for two decades; customers reset prices and pass commodity costs through with a lag. We model margins back to {{as.build.saMargin.2|n1}}% by FY29E, close to the 8.7-8.9% of FY24-26 (ICICI Securities table, before Anchemco).' },
  ],
};

const subs = {
  id: 'subs', nav: 'Sunroofs and subsidiaries', kicker: 'Subsidiaries', title: 'Sunroofs, forgings and fasteners: ~13% of revenue at a higher margin, with dilution ahead',
  blocks: [
    { p: `Consolidated revenue less standalone was ₹${n0(y26.consRev - y26.standaloneRev)} cr in restated FY26 with ~₹93 cr of EBITDA (13.9%): mainly **IGSS** (sunroofs with Inalfa, ₹434 cr revenue, 15.1% EBITDA margin in FY26) and **ACYM** (76%; synchroniser rings and aluminium forgings, ₹235 cr, 10.2%), plus the new fastener JV with Jinhap (51%) and the Belgian R&D centre. In Q1FY27 the subsidiaries had ~₹151 cr of revenue and ~11% margin: a supplier problem at Hyundai Mobis stopped Creta production and cost IGSS 15,000-20,000 sunroofs, which management expects to recover in Q2-Q3. Under a revised agreement (board, 12-Nov-2025) Inalfa will subscribe new shares for 35% of IGSS once the government approves (Press Note 3), cutting Gabriel to 65%; we have not modelled the dilution (timing unknown).` },
    { exhibit: { type: 'table', title: 'Subsidiaries and consolidation (₹ crore)', head: ['', 'FY26 (restated)', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue', n0(BL.base.sub), '151', ...bld.map(r => n0(r.sub))],
      ['EBITDA', '93', '17', ...bld.map(r => n0(r.ue))],
      ['EBITDA margin', '13.9%', '11.2%', ...BL.subMargin.map(m => `${m}%`)],
    ], source: 'Consolidated less standalone results (Q1FY27 filing); GAM estimates' } },
    { callout: '**So what:** the subsidiaries add growth and margin, but the best of them (sunroofs) is a technology licence from Inalfa, which is about to take a third of it. Their contribution to Gabriel\'s value is real but small next to the minority stakes.' },
  ],
};

const jvRows = jv.map(j => { const it = AS.jvBuild.items.find(i => i.key === j.key);
  return [j.name, it.basePat ? n0(it.basePat) : '–', it.abs ? 'start-up' : `+${it.growth.join('% / +')}%`, ...j.share.map(n1)]; });
const jvs = {
  id: 'jvs', nav: 'JVs and associates', kicker: 'The stakes', title: `JVs and associates: from 0% to ~${Math.round(jvPctPbt[1])}% of profit before tax in three years`,
  blocks: [
    { p: `Gabriel's share of the profit of companies it does not control was ₹${n1(R26.jv)} cr in restated FY26 (Dana Anand ~₹88 cr, Henkel Anand ~₹70 cr): ${n1(R26.jv / R26.pbt * 100)}% of profit before tax. Project Jupiter adds 28.99% of **HL Mando Anand** (brakes, steering and suspension for Hyundai, Kia, Mahindra, Maruti, Tata; FY26 revenue ₹5,886 cr, PAT ₹358 cr, net worth ₹1,924 cr) from 11-Sep-2026 and ~30% of **HL Klemove India** (ADAS radar and cameras; FY26 revenue ₹1,049 cr, adjusted EBITDA ~₹129 cr). We build the share line by line: in FY28E it is ₹${n0(jvTot[1])} cr, ${Math.round(jvPctPbt[1])}% of our profit before tax. These profits are already taxed in the JVs; Gabriel receives cash only as dividends.` },
    { exhibit: { type: 'table', title: 'Share of JV / associate profit (₹ crore, Gabriel\'s share)', head: ['Company', 'FY26 PAT (100%)', 'Our PAT growth FY27-29E', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ...jvRows,
      { hl: true, cells: ['**Total share of profit**', '', '', ...jvTot.map(v => `**${n1(v)}**`)] },
      ['Recurring other income (interest, rent, misc.)', '', '', ...AS.recurringOI.map(String)],
      { hl: true, cells: ['**Model other income**', '', '', ...F.otherIncome.map(v => `**${n1(v)}**`)] },
    ], source: 'Company decks and KPMG/BDO report (FY26 PAT); GAM estimates. HL Mando Anand from 11-Sep-2026 (6.6 months of FY27), HL Klemove from mid-Sep-2026; HL Klemove PAT not disclosed: we assume 55% of adjusted EBITDA (₹71 cr).' } },
    { pair: [
      { type: 'column', title: 'Dana Anand: PAT ₹228 cr (FY23) to ₹352 cr (FY26), ROE 33%', unit: 'PAT, 100% (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26'], series: [{ name: 'Dana Anand', values: ['FY23', 'FY24', 'FY25', 'FY26'].map(f => y(f).danaPat), fmt: 'num' }, { name: 'Henkel Anand', values: ['FY23', 'FY24', 'FY25', 'FY26'].map(f => y(f).henkelPat), fmt: 'num' }], labels: 'all', source: 'Q1FY27 deck slides 21-22' },
      { type: 'hbar', title: 'Gabriel paid ~21.5x FY26 earnings for HL Mando Anand', unit: 'Price ÷ FY26 PAT (x)', x: ['HL Mando Anand (deal)', 'Gabriel at issue price', 'Gabriel now (Sep-28E)'], series: [{ name: 'P/E', values: [21.5, Math.round(1305.89 / 24.29 * 10) / 10, Math.round(X.sepNow * 10) / 10], fmt: 'x' }], labels: 'all', source: 'KPMG/BDO valuation report; Q1FY27 results; GAM Research. Gabriel at issue price = ₹1,305.89 ÷ restated FY26 EPS ₹24.29; now = 30-Sep close ÷ our Sep-28E EPS.' },
    ] },
    { callout: `**What to watch:** (1) the partners control these companies: Dana (74.9%), Henkel (51%) and HL (71%) set strategy, capex and dividends, and Dana\'s parent is combining with Eaton\'s mobility business; (2) Gabriel booked the Jupiter stakes at fair value, so a purchase-price allocation may add amortisation inside the share of profit; (3) the share of profit is not cash. A 20% shortfall in our FY28E share of profit would cut FY28E EPS by ~₹${n1(jvTot[1] * 0.2 / X.shares)}, ~₹${n0(jvTot[1] * 0.2 / X.shares * X.MULT.base)} a share at our multiple.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat in ride control; the new stakes bring better businesses but not control',
  blocks: [
    { verdicts: [
      ...D.moat.map(([dim, ev, v]) => [dim, v === 'GREEN' ? 'Strong' : v === 'AMBER' ? 'Moderate' : 'Weak', ev, { 'Scale and share in ride control': 'Protects volumes, not prices', 'Customer stickiness': 'Revenue is sticky per programme; share can slip with model mix', 'Technology': 'Competitive, not proprietary', 'Pricing power': 'Margins follow commodities and customer resets', 'Portfolio after Rise and Jupiter': 'Higher-return earnings Gabriel does not control' }[dim] || '']),
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (annual report, decks and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Gabriel has a narrow moat: scale, approvals and decades of supply in a product every vehicle needs, strongest in trucks and electric two-wheelers. It has no pricing power. The stakes it has bought are better businesses (ROE 30-60% at Dana and Henkel), but Gabriel owns 25-49% of them, does not run them and depends on partners for technology. That is a reasonable portfolio, not a moat.' },
  ],
};

module.exports = { ride, subs, jvs, moat };
