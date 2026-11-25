// Reliance report, part 3: segment chapters for O2C, Oil & gas (E&P) and Jio.
const X = require('./RELIANCE.ctx');
const { C, SA, SQ, QL, A26, n0, n1, pc, seg, sep, E, MULT, AS, F } = X;
const Q = C.q1fy27, FYE = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'];
const ser = (k, hk) => [...SA.map(a => a[hk]), ...seg(k)[hk.endsWith('Rev') ? 'revenue' : 'adjEbitda'].map(Math.round)];
const why = k => AS.segments.find(s => s.key === k)._why.replace(/Rs ?/g, '₹');

const o2c = {
  id: 'o2c', nav: 'O2C', kicker: 'Segment: Oil to Chemicals', title: 'O2C: record cracks, but the state, the shippers and the sellers of crude took a large share',
  blocks: [
    { p: `O2C is RIL's biggest business by revenue (₹${n0(A26.o2cRev)} cr in FY26, ~half of gross segment revenue) and its most volatile by profit. EBITDA fell from ₹62,393 cr in FY24 to ₹54,988 cr in FY25 as cracks normalised, recovered to ₹60,546 cr in FY26, and Q1FY27 made ₹${n0(Q.o2c.ebitda)} cr (+17% YoY), a four-year high, even with a planned crude-unit and coker shutdown (throughput ${Q.o2c.throughputMmt} vs ${Q.o2c.throughputPrev} MMT). ${Q.o2c.notes}` },
    { pair: [
      { type: 'column', title: `O2C EBITDA: ₹38K cr (FY21) to ₹60.5K cr (FY26); ₹${Math.round(seg('o2c').adjEbitda[0] / 1000)}K cr in FY27E`, unit: '₹ crore', x: FYE, series: [{ name: 'O2C EBITDA', values: ser('o2c', 'o2cEbitda'), fmt: 'num' }], labels: 'all', source: 'AR segment notes; presentations; GAM estimates' },
      { type: 'column', title: 'Quarterly O2C EBITDA: Q1FY27 the best in four years', unit: '₹ crore', x: QL, series: [{ name: 'O2C EBITDA', values: SQ.map(q => q.o2cEbitda), fmt: 'num' }], labels: 'all', source: 'Quarterly presentations' },
    ] },
    { p: 'Why the margin fell while cracks quadrupled: management listed crude premiums on Middle East grades of close to $20/bbl (normally a couple of dollars), freight up ~10x, higher insurance, the special additional excise duty and export duties on diesel and jet fuel, under-recoveries on fuel sold in India and to PSU marketers at frozen pump prices, and extra LPG sent to PSUs under a government order. On the other side: ethane cracking (US ethane −11% while naphtha +61%), more Russian and Latin American crude, and cargoes redirected to short markets (Singapore, Australia, Africa).' },
    { exhibit: { type: 'table', title: 'Our O2C forecast', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Gross revenue (₹ cr)', n0(A26.o2cRev), ...seg('o2c').revenue.map(n0)], ['EBITDA (₹ cr)', n0(A26.o2cEbitda), ...seg('o2c').adjEbitda.map(n0)],
      ['EBITDA margin', n1(A26.o2cEbitda / A26.o2cRev * 100) + '%', ...AS.segments[0].marginPct.map(m => m + '%')],
    ], source: 'GAM estimates. ' + why('o2c') } },
    { callout: `**Our view:** FY27 is a windfall year that the government is already taxing; we fade O2C EBITDA to ₹${n0(seg('o2c').adjEbitda[1])} cr in FY28E. Sep-28E EBITDA of ₹${n0(E.o2c)} cr at ${MULT.o2c.base}x gives ₹${n0(E.o2c * MULT.o2c.base)} cr, about ₹${Math.round(E.o2c * MULT.o2c.base / X.shares)} a share. Every 1x on the O2C multiple is worth ~₹${Math.round(E.o2c / X.shares)} a share.` },
  ],
};

const ep = {
  id: 'ep', nav: 'Oil & gas', kicker: 'Segment: Oil and gas', title: 'KG-D6: a cash cow in natural decline',
  blocks: [
    { p: `RIL's KG-D6 fields went from almost nothing in FY21 (EBITDA ₹258 cr) to ₹21,188 cr in FY25 as the new deep-water fields came on stream, and have started to decline: FY26 ₹19,050 cr, Q1FY27 ₹${n0(Q.ep.ebitda)} cr. Gas output fell to ${Q.ep.kgd6Mmscmd} MMSCMD (26.6 a year earlier) and the government-set ceiling price is $${Q.ep.ceilingH1fy27}/MMBtu for H1FY27, while oil and condensate earned $${Q.ep.oilPrice}/bbl. Margins are ~79%.` },
    { pair: [
      { type: 'column', title: 'E&P EBITDA: peaked in FY25, now declining', unit: '₹ crore', x: FYE, series: [{ name: 'E&P EBITDA', values: ser('ep', 'epEbitda'), fmt: 'num' }], labels: 'all', source: 'AR segment notes; presentations; GAM estimates' },
      { type: 'column', title: 'Quarterly E&P EBITDA', unit: '₹ crore', x: QL, series: [{ name: 'E&P EBITDA', values: SQ.map(q => q.epEbitda), fmt: 'num' }], labels: 'all', source: 'Quarterly presentations' },
    ] },
    { callout: `**Our view:** no new field is in our numbers; we let EBITDA decline ~8% a year to ₹${n0(seg('ep').adjEbitda[2])} cr in FY29E. We value it at ${MULT.ep.base}x Sep-28E EBITDA, the median of the three brokers that disclose a multiple (4.5-6x), because listed upstream peers (ONGC, Oil India) consolidate refineries and their multiples are not E&P multiples.` },
  ],
};

const jio = {
  id: 'jio', nav: 'Jio', kicker: 'Segment: Digital Services (Jio)', title: 'Jio: compounding without a tariff rise; the IPO will put a price on it',
  blocks: [
    { p: `Jio Platforms had ${Q.jio.subsMn} mn subscribers at Jun-2026 (${Q.jio.fiveGmn} mn on 5G), ${Q.jio.fbbMn} mn fixed-broadband homes (${Q.jio.airFiberMn} mn on AirFiber) and ARPU of ₹${Q.jio.arpu}. Q1FY27 gross revenue ₹${n0(Q.jio.grossRev)} cr (+12%), EBITDA ₹${n0(Q.jio.ebitda)} cr (+15%), margin ${Q.jio.margin}% of operating revenue, PAT ₹${n0(Q.jio.pat)} cr (+9%; finance cost +42% as 5G spectrum is capitalised). ${Q.jio.note} The Digital Services segment (Jio plus other digital businesses) made ₹76,560 cr of EBITDA in FY26, 2.2x FY21.` },
    { pair: [
      { type: 'column', title: 'Digital Services EBITDA: ₹34K cr (FY21) to ₹77K cr (FY26)', unit: '₹ crore', x: FYE, series: [{ name: 'Digital EBITDA', values: ser('jio', 'jioEbitda'), fmt: 'num' }], labels: 'all', source: 'AR segment notes; presentations; GAM estimates' },
      { type: 'line', title: 'Jio ARPU (₹/month) creeps up without tariff action', unit: '₹ per user per month', x: ['Q4FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'ARPU', values: [206.2, 208.8, 214.0, 215.6], fmt: 'n1' }], labels: 'all', min: 195, max: 220, source: 'Quarterly presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Jio Platforms in the DRHP (restated, ₹ crore)', head: ['', 'FY24', 'FY25', 'FY26'], rows: [['Revenue from operations', '1,09,558', '1,28,218', '1,46,885'], ['EBITDA', '54,959', '64,170', '76,255'], ['PAT', '21,423', '26,109', '30,049'], ['Net debt', '48,440', '45,273', '27,579']], source: 'Jio Platforms DRHP (filed 19-Jun-2026) as reported by 5paisa/Kotak Neo; Business Today reported a different revenue/EBITDA basis (see conflicts)' } },
    { p: `Our forecast: segment revenue +12% / +14% / +11% (a ~10% effective tariff increase in FY28E, none in FY27E) and EBITDA margin on gross revenue of 44.5% / 45.5% / 46%: EBITDA ₹${seg('jio').adjEbitda.map(v => n0(v)).join(' / ')} cr; Sep-28E ₹${n0(E.jio)} cr.` },
    { callout: `**The IPO question:** media reports around SEBI's nod put Jio's valuation at ~US$137 bn (₹12 lakh cr-plus). Our ${MULT.jio.base}x Sep-28E EBITDA (Bharti Airtel's forward history, adjusted for the sector move) gives an EV of ₹${n0(E.jio * MULT.jio.base)} cr. If the IPO prices Jio near the street's 12x, our target rises to ~₹${n0(X.sotpAt({ jio: 12 }))}: the single biggest swing factor in this report.` },
  ],
};

module.exports = { o2c, ep, jio };
