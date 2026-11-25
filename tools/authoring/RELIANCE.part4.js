// Reliance report, part 4: Retail, the new businesses (JioStar, RCPL, New Energy), competitive advantage, Q1FY27 and guidance.
const X = require('./RELIANCE.ctx');
const { C, D, SA, SQ, QL, A26, n0, n1, pc, rup, seg, E, MULT, AS, val, shares, NE } = X;
const Q = C.q1fy27, FYE = ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'];

const retail = {
  id: 'retail', nav: 'Retail', kicker: 'Segment: Retail', title: 'Retail: 20,000 stores turning into dark stores, and margins pay for it',
  blocks: [
    { p: `Reliance Retail Ventures (RRVL) is India's largest retailer: ${n0(Q.retail.stores)} stores, ${Q.retail.areaMnSqft} mn sq ft, FY26 gross revenue ₹3,70,026 cr (+12%) and EBITDA ₹27,034 cr; PAT ₹12,838 cr. Q1FY27: gross revenue ₹${n0(Q.retail.grossRev)} cr (+7.4%; +11.6% excluding the demerged consumer brands), EBITDA ₹${n0(Q.retail.ebitda)} cr (−1.1%), margin ${Q.retail.marginNet}% of net revenue (−80 bp), PAT ₹${n0(Q.retail.pat)} cr (−14%). JioMart grocery orders rose 116% as stores became hyper-local fulfilment points.` },
    { pair: [
      { type: 'column', title: 'Retail EBITDA: 2.7x in five years, then a pause', unit: '₹ crore', x: FYE, series: [{ name: 'Retail EBITDA', values: [...SA.map(a => a.retEbitda), ...seg('ret').adjEbitda.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'AR segment notes; presentations; GAM estimates' },
      { type: 'column', title: 'Quarterly retail gross revenue (₹ crore)', unit: '₹ crore', x: QL, series: [{ name: 'Gross revenue', values: SQ.map(q => q.retRev), fmt: 'num' }], labels: 'all', source: 'Quarterly presentations (Q4FY26 onward excludes consumer brands)' },
    ] },
    { p: 'Management\'s new plan (Q1FY27): **double operating EBITDA over FY27-FY29**, with FY27 a "foundation" year (scale online, more dark stores) and FY28-29 "value conversion" (repeat rates, own brands, marketplace income). On the call, Retail\'s Dinesh Taluja called it "a stretch" but one they feel confident about, and gave no margin target. The risk is that quick-commerce rivals keep the subsidy war going.' },
    { exhibit: { type: 'table', title: 'Our retail forecast vs the 2x ambition', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Gross revenue (₹ cr)', n0(A26.retRev), ...seg('ret').revenue.map(n0)], ['EBITDA (₹ cr)', n0(A26.retEbitda), ...seg('ret').adjEbitda.map(n0)],
      ['EBITDA margin on gross revenue', n1(A26.retEbitda / A26.retRev * 100) + '%', ...AS.segments.find(s => s.key === 'ret').marginPct.map(m => m + '%')],
      ['Management ambition (2x FY27-29)', '', '', '', '~2x the FY26-27 base'],
    ], source: 'GAM estimates. ' + rup(AS.segments.find(s => s.key === 'ret')._why) } },
    { callout: `**Our view:** we give management half the credit: EBITDA ~1.5x by FY29E. At ${MULT.ret.base}x Sep-28E EBITDA (₹${n0(E.ret)} cr), Retail is worth ₹${n0(E.ret * MULT.ret.base)} cr at 100%, ₹${Math.round((val(/^Retail/) + val(/16\.44%/)) / shares)} a share to RIL after the 16.44% held by QIA, KKR and others.` },
  ],
};

const newbiz = {
  id: 'newbiz', nav: 'New businesses', kicker: 'JioStar, consumer brands, New Energy', title: 'The option value: media, Campa and the giga-factories',
  blocks: [
    { p: `**JioStar** (Viacom18 merged with Disney's Star India in Nov-2024; RIL's economic interest ~49%, Disney 36.84%) had FY26 revenue ₹34,917 cr and net profit ₹3,434 cr; Q1FY27 revenue ₹${n0(Q.jiostar.rev)} cr (+14%) and EBITDA ₹${n0(Q.jiostar.ebitda)} cr, with ~${Q.jiostar.mauMn} mn monthly JioHotstar users. The merger valued it at ₹70,352 cr; we use that value (₹${Math.round(val(/^JioStar/) / shares)} a share for RIL's share).` },
    { p: `**Reliance Consumer Products** (Campa, Independence and other brands, demerged from Retail in Dec-2025) grew 2.1x to ₹${n0(Q.rcpl.grossRev)} cr of Q1FY27 sales (Campa ~₹2,900 cr, Independence ~₹3,200 cr), >80% through outside channels, while spending heavily on advertising (IPL's #1 TV advertiser). We use Motilal Oswal's ₹52,900 cr (2x FY28E sales, RIL share; ₹${Math.round(val(/^Reliance Consumer/) / shares)} a share), the only broker value we found.` },
    { p: `**New Energy:** ~1 GWp of heterojunction modules produced, scaling to 20 GWp; a 40 GWh battery line due this year (120 GWh planned); Kutch solar-plus-storage installation to start after the monsoon; a US$3 bn green-ammonia supply deal with Samsung C&T. No revenue yet. We carry it at the ₹75,000 cr the street uses as committed capital (1.0x, ₹${Math.round(NE / shares)} a share); BOBCAPS also uses 1.0x, Emkay and PL 2.0x, Morgan Stanley ~US$20 bn.` },
    { callout: '**So what:** together these are ~₹120 a share in our SOTP (~10% of the target). They are where RIL is spending: Others and unallocated capex was ₹55,918 cr in FY26, more than Jio\'s ₹33,101 cr. None earns its cost of capital yet.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Real scale advantages in O2C and Jio; Retail and New Energy still have to prove theirs',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard', head: ['Source', 'Strength', 'Evidence'], wide: [2], rows: D.moat.map(r => r.map(rup)), source: 'GAM Research; company presentations' } },
    { callout: '**Verdict:** RIL has two genuine moats (integrated, flexible refining at a scale few can match; India\'s largest, most modern telecom network) and one strong franchise under attack (Retail). New Energy is a bet, not a moat. The weakness is at group level: capital-heavy, returns ~9% on equity, and a growing share of the best businesses owned by others.' },
  ],
};

const q1 = {
  id: 'q1', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: record EBITDA, made in O2C and Jio; Retail missed',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 by segment (₹ crore)', head: ['Segment', 'Q1FY26', 'Q1FY27', 'YoY'], rows: [
      ...[['O2C', 'o2cEbitda'], ['Oil and gas', 'epEbitda'], ['Digital Services', 'jioEbitda'], ['Retail', 'retEbitda'], ['Others (Q1FY26 ex ₹8,924 cr gain)', 'othEbitda']].map(([n, k]) => { const a = SQ.find(q => q.q === 'Q1FY26')[k] - (k === 'othEbitda' ? 8924 : 0), b = SQ.at(-1)[k]; return [n, n0(a), n0(b), pc((b / a - 1) * 100)]; }),
      { hl: true, cells: ['**EBITDA (company basis, recurring)**', '**49,100**', '**54,067**', '**+10%**'] },
      ['Finance cost / depreciation', '7,036 / 13,842', '8,337 / 15,100', '+18% / +9%'], ['PAT before minorities (recurring)', '21,859', '23,196', '+6%'], ['PAT to RIL shareholders (reported)', '26,994', '20,946', '−22% (base had the gain)'],
    ], source: 'Q1FY27 presentation (17-Jul-2026); Screener.in' } },
    { exhibit: { type: 'table', title: 'What management guided (as of 30-Sep-2026)', head: ['Area', 'Guidance', 'Source'], wide: [1], rows: C.guidance.map(g => [g.item, rup(g.text), `${g.src} (${g.published})`]), source: 'Company presentations, calls and AGM coverage' } },
    { callout: '**Read-across:** consensus EBITDA was beaten by ~4-6% (Equirus, Nomura) thanks to O2C and upstream; Emkay raised FY27E EPS 2% and kept FY28-29E. Retail EBITDA missed by ~10% (Emkay). Our FY27E assumes the O2C run-rate holds for the rest of the year and Retail stays flat.' },
  ],
};

module.exports = { retail, newbiz, moat, q1 };
