// ITC Hotels report, part 4b: our forecasts vs the street (estimates standing on 30-Sep-2026).
const X = require('./ITCHOTELS.ctx');
const { F, AS, SEG, n0, n1, YRS, vsStreet, ests, stream } = X;
const pcs = v => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v * 100))}%`;
const m = (k, i) => n1(SEG[k].adjEbitda[i] / SEG[k].revenue[i] * 100);
const v27 = vsStreet('FY27E'), v28 = vsStreet('FY28E');

const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EBITDA ₹${n0(F.ebitda[0])} / ${n0(F.ebitda[1])} / ${n0(F.ebitda[2])} cr (FY27-29E), 3% below the street for FY27E and ~9% below for FY28E`,
  blocks: [
    { p: `We build the hotels from four streams (rooms, F&B, fees, others) and treat the Colombo apartments separately. Hotel revenue grows ${n1(AS.segments[0].growth[0])}% / ${n1(AS.segments[0].growth[1])}% / ${n1(AS.segments[0].growth[2])}% (FY27-29E): rooms +${AS.businessLines.hotel.growth.room.join('% / +')}%, F&B +${AS.businessLines.hotel.growth.fnb.join('% / +')}%, fees +${AS.businessLines.hotel.growth.fees.join('% / +')}%. The hotel margin rises from 34.6% (FY26) to ${m('hotel', 0)}% / ${m('hotel', 1)}% / ${m('hotel', 2)}%. Apartment revenue falls to ₹${n0(SEG.re.revenue[0])} cr in FY27E and ₹${n0(SEG.re.revenue[1])} cr a year after, at a 30% margin. Other income is built on the cash (~6.75-7% yield plus associates): ₹${AS.otherIncome.join(' / ')} cr. Tax and minorities ${AS.taxRate[0]}%. EPS ₹${F.eps.map(e => e.toFixed(2)).join(' / ')}.` },
    { exhibit: { type: 'table', title: 'GAM forecasts vs the two brokers that publish full estimates', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM vs street', 'GAM FY28E', 'Street FY28E', 'GAM vs street'], rows: [
      ...[['Revenue (₹ cr)', 'rev', 'sales'], ['EBITDA (₹ cr)', 'ebitda', 'ebitda'], ['EPS (₹)', 'eps', 'eps']].map(([lab, k, fk]) => [lab, fk === 'eps' ? F.eps[0].toFixed(2) : n0(F[fk][0]), v27[k].map(x => `${x[0]} ${fk === 'eps' ? x[1].toFixed(1) : n0(x[1])}`).join('; '), v27[k].map(x => pcs(x[2])).join(' / '), fk === 'eps' ? F.eps[1].toFixed(2) : n0(F[fk][1]), v28[k].map(x => `${x[0]} ${fk === 'eps' ? x[1].toFixed(1) : n0(x[1])}`).join('; '), v28[k].map(x => pcs(x[2])).join(' / ')]),
    ], source: `${ests.map(s => `${s.broker} (${X.shortDate(s.date)}, ${s.read})`).join('; ')}; GAM Research` } },
    { pair: [
      { type: 'column', title: 'EBITDA: we are below the street for FY28E', unit: '₹ crore', x: ['FY26', ...YRS], series: [{ name: 'GAM', values: [1424, ...F.ebitda.map(Math.round)], fmt: 'num' }, { name: 'ICICI Direct', values: [null, ests[0]?.est.FY27E.ebitda, ests[0]?.est.FY28E.ebitda, null], fmt: 'num' }, { name: 'Choice', values: [null, ests[1]?.est.FY27E.ebitda, ests[1]?.est.FY28E.ebitda, null], fmt: 'num' }], labels: 'all', source: 'Broker PDFs (Jul-2026); GAM estimates' },
      { type: 'column', title: 'Fees grow fastest but stay small', unit: 'Management fees (₹ crore)', x: ['FY26', ...YRS], series: [{ name: 'Fees', values: [173, ...stream.fees.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'GAM estimates' },
    ] },
    { callout: `**Why we are below the street for FY28E:** the street (ICICI Direct, Choice) has revenue rising ~15-16% in FY28E; we have ${n1(F.salesGrowth[1])}%. Room rates rose only 4% in Q1FY27 and Nomura already cut its rate growth assumption to ~7% a year; the acquisitions (Kumarakom 72 keys, Ahmedabad 130 keys) and Puri/Bhubaneswar add ~2-3% to revenue, not 5%. Our margins are close to the street's (FY28E ${n1(F.ebitdaMargin[1])}% vs 35.8-36.7%). If the street is right on revenue, our FY28E EBITDA is ~9% too low and our target ~₹${n0(Math.round((X.V.sotp.equity + 0.09 * X.hotelSep28 * X.hm.base) / X.sh / 5) * 5)} (same multiple).` },
  ],
};

module.exports = { forecasts };
