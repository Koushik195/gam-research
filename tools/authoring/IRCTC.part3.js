// IRCTC report, part 3: internet ticketing, catering, tourism and Rail Neer, and the moat scorecard.
const X = require('./IRCTC.ctx');
const { C, D, SA, SQ, A26, Q1, F, seg, n0, n1, pc, rup, q } = X;
const L9 = SQ.slice(-9), mg = k => L9.map(x => x[k]);
const fy = (k, i) => Math.round(seg[k].revenue[i]), fm = (k, i) => n1(seg[k].adjEbitda[i] / seg[k].revenue[i] * 100);

const ticketing = {
  id: 'ticketing', nav: 'Internet ticketing', kicker: 'Segment', title: 'Internet ticketing: an 80%-margin monopoly whose price is set by its owner, and whose volume is already maxed out',
  blocks: [
    { p: `IRCTC sold 13.27 crore tickets in Q1FY27 and took 88.9% of reserved railway bookings. The segment earned ₹${n0(A26.itRev)} cr in FY26 (+${n1((A26.itRev / X.A25.itRev - 1) * 100)}%) at an ${n1(A26.itMargin)}% segment margin before exceptional items. About two-thirds is the convenience fee (₹248 cr in Q1FY27, +5%); the rest is advertising, agent fees, payment-gateway and loyalty income (₹113 cr, −8%). Three things cap growth: (1) **volume** grows only with reserved seats, and almost all are already booked online; (2) **price**: the fee (₹10/₹20 on UPI, ₹15/₹30 on cards) has not risen for about seven years (investor on the Q1FY27 call), and management will not "announce anything" until "it will pinch us"; (3) **mix**: UPI rose to 51% of tickets. Q1FY27 revenue grew 0.6%; an investor on the call noted it had barely grown for eight quarters.` },
    { pair: [
      { type: 'column', title: 'Ticketing revenue: ₹330-400 cr a quarter for two years', unit: 'Internet ticketing revenue (₹ crore)', x: L9.map(x => x.q), series: [{ name: 'Revenue', values: mg('itRev').map(Math.round), fmt: 'num' }], labels: 'all', source: 'Quarterly segment results (via PL Capital)' },
      { type: 'line', title: 'Segment margin: 84-85% at best, 76-80% in the last two quarters', unit: 'Segment result ÷ revenue (%)', x: L9.map(x => x.q), series: [{ name: 'Margin', values: mg('itMargin'), fmt: 'pct' }], labels: 'all', min: 70, max: 90, source: 'Quarterly segment results (incl. Q4FY26 CSR ₹17 cr and Q1FY27 maintenance ₹10 cr)' },
    ] },
    { bullets: [
      '**Margin pressure is partly self-inflicted and partly one-off.** Q4FY26 carried ₹17 cr of CSR and ₹8 cr of higher direct costs; Q1FY27 carried ₹10 cr of platform maintenance. The NGET hardware and software refresh (~₹150 cr invested; target capacity above 1 lakh tickets a minute from ~37,000) and an active-active disaster-recovery site at Secunderabad will add cost through FY27. Management\'s range is 80-85%.',
      '**Non-fee income fell for reasons IRCTC chose.** The new website (beta from 15-Jul-2026) has no ads, captcha or pop-ups; agents were restricted at peak booking hours; RailOne diverted some traffic. Management wants to get back to ₹150 cr a quarter via iPay, e-wallet loyalty (four banks) and a unified travel portal.',
      `**Our forecast:** +4% in FY27E and +6% a year after, margin 80-80.5%, no fee increase: ₹${n0(fy('it', 0))} / ₹${n0(fy('it', 1))} / ₹${n0(fy('it', 2))} cr. A 10% higher fee on all tickets would add ~₹100 cr of revenue and ~₹75 cr of net profit (~5% of EPS); a 50% fee share with the Railways (the Oct-2021 order) would remove ~₹500 cr of revenue and roughly a quarter of EPS.`,
    ] },
  ],
};

const catering = {
  id: 'catering', nav: 'Catering', kicker: 'Segment', title: 'Catering: the growth engine, at a tenth of ticketing\'s margin',
  blocks: [
    { p: `Catering revenue was ₹${n0(A26.catRev)} cr in FY26 (+${n1((A26.catRev / X.A25.catRev - 1) * 100)}%) and ₹732 cr in Q1FY27 (+33.9%). Management broke down Q1: onboard sales on prepaid trains ₹413 cr (₹301 cr a year earlier), licence fees from mobile units ₹224 cr (₹192 cr), static units ₹33 cr (₹20 cr), e-catering licence fees ₹22 cr (₹9 cr), election specials ₹41 cr (₹5 cr; state elections, will not recur in Q2). The model is mostly licensing: IRCTC tenders trains and stalls to caterers and earns a fee; on prepaid trains it books the full turnover, pays the caterer (₹222 per Vande Bharat meal in the example given) and pays 5% GST without input credit, so margins there are thinner. The segment margin was ${n1(A26.catMargin)}% in FY26 and 9.3% in Q1FY27 (₹10 cr of HR cost and ₹4 cr of proof-of-concept trains).` },
    { pair: [
      { type: 'column', title: 'Catering revenue: ₹482 cr (Q2FY25) to ₹732 cr (Q1FY27)', unit: 'Catering revenue (₹ crore)', x: L9.map(x => x.q), series: [{ name: 'Revenue', values: mg('catRev').map(Math.round), fmt: 'num' }], labels: 'all', source: 'Quarterly segment results (via PL Capital)' },
      { type: 'line', title: 'Margin: 12-14% a year ago, 6-10% in the last two quarters', unit: 'Segment result ÷ revenue (%)', x: L9.map(x => x.q), series: [{ name: 'Margin', values: mg('catMargin'), fmt: 'pct' }], labels: 'all', min: 0, max: 16, source: 'Quarterly segment results (Q4FY26: ECL ₹16 cr, CSR ₹5 cr; Q1FY27: HR ₹10 cr, POC ₹4 cr)' },
    ] },
    { bullets: [
      '**Drivers:** ~20 Vande Bharat sleeper trains over the next year (~₹6 cr of licence fee each, ~₹120 cr in total), ~8% passenger growth, e-catering (1.25 lakh to 1.69 lakh meals a day) and e-pantry ordering on 50+ trains (target ~100).',
      '**Constraints:** menu prices are administered by the Ministry (last raised in 2019, per an analyst on the Q4FY26 call); 25-30% of prepaid passengers opt out of meals; quality complaints keep branded caterers and centralised kitchens on the agenda; licence-fee enhancement under the CC-60 policy is in court.',
      `**Our forecast:** +19% in FY27E (Q2-Q4 ~+14% after Q1's +34%), +13% and +12% after; margin 10.0% then 10.5%: ₹${n0(fy('cat', 0))} / ₹${n0(fy('cat', 1))} / ₹${n0(fy('cat', 2))} cr of revenue, ₹${n0(seg.cat.adjEbitda[0])} / ₹${n0(seg.cat.adjEbitda[1])} / ₹${n0(seg.cat.adjEbitda[2])} cr of segment profit.`,
    ] },
  ],
};

const others = {
  id: 'others', nav: 'Tourism & Rail Neer', kicker: 'Segments', title: 'Tourism and Rail Neer: growing, seasonal, capacity-bound and low-margin',
  blocks: [
    { p: `**Tourism** (including State Teertha pilgrimage trains) earned ₹${n0(A26.tourRev)} cr in FY26 (+${n1((A26.tourRev / X.A25.tourRev - 1) * 100)}%) at a ${n1(A26.tourMargin)}% margin before exceptional items; Q1 is the weak quarter (₹168 cr, 11.5%) and Q3-Q4 the strong ones (16-19%). Management expects more than ₹1,000 cr in FY27. Bharat Gaurav trains are ~40% of the segment (Choice); two Tejas Express trains are run as corporate trains and have weaker margins (Q4FY26 call), but the first Tejas naming-rights deal was signed in Aug-2026. We assume +15% / +14% / +12% at a 13.5% margin.` },
    { p: `**Rail Neer** earned ₹${n0(A26.rnRev)} cr gross in FY26 (₹391 cr after sales to IRCTC's own catering) at a ${n1(A26.rnMargin)}% margin. It is bound by capacity: 17.77 lakh bottles a day after a plant closure, against supply of ~15.5 lakh and demand well above that, which unauthorised brands fill at stations. Ambernath (2 to 3 lakh a day) and Danapur (1 to 2 lakh) should be expanded in FY27; Prayagraj and Mysore have land, Ranchi has confirmation and Bhagalpur needs a better site. Resin costs (preforms, caps) rose with oil after the West Asia crisis and cut the Q1FY27 margin to 9.8%. We assume +4% / +8% / +12% at 11.5-12.5%.` },
    { pair: [
      { type: 'column', title: 'Tourism: strong second half, weak first quarter', unit: 'Tourism revenue (₹ crore)', x: L9.map(x => x.q), series: [{ name: 'Revenue', values: mg('tourRev').map(Math.round), fmt: 'num' }], labels: 'all', source: 'Quarterly segment results (via PL Capital)' },
      { type: 'line', title: 'Rail Neer margin swings with resin prices: 9-16%', unit: 'Segment result ÷ revenue (%)', x: L9.map(x => x.q), series: [{ name: 'Rail Neer margin', values: mg('rnMargin'), fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Quarterly segment results' },
    ] },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'A real monopoly, but a granted one: the grantor sets the price and can share the profit',
  blocks: [
    { verdicts: D.moat.map(([a, v, e, c]) => [a, v, rup(e), rup(c)]), head: ['Business', 'Verdict', 'Evidence', 'The catch'], title: 'Competitive advantage scorecard', source: 'Company calls; AR FY26; Business Today (29-Oct-2021); GAM Research' },
    { callout: '**Verdict:** IRCTC has the strongest position of any listed Indian consumer franchise in its niche: nobody else can sell an online reserved railway ticket. But the moat belongs to the Railways, which granted it, set its price, compete with it for the passenger front-end (RailOne books through IRCTC today) and once ordered half the fee to be shared. The moat protects volume, not pricing power. Catering and Rail Neer are mandates with administered prices; tourism has no moat.' },
  ],
};

module.exports = { ticketing, catering, others, moat };
