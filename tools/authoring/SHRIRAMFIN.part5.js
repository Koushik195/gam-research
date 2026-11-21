// Shriram Finance report, part 5: ownership (Jun-2026), management and governance, forecasts vs the street,
// street view and critiques.
const X = require('./SHRIRAMFIN.ctx');
const { C, D, F, A, fin, fi, n0, n1, n2, pc, price, sharesNow, ST, CONS, IB, tpHi, tpLo, tpAvg, streetEps, Q1, bvSep28, roeTw27 } = X;
const OW = D.ownership, GV = C.governance;

const ownership = base => ({
  ...base,
  blocks: [
    { p: `In Jun-2026 the Shriram promoter group held ${OW.promoterGroup}% (Shriram Capital Pvt Ltd 14.27%, Shriram Value Services 5.68%, Sanlam Life 0.33%, Shriram Ownership Trust 0.01%), unchanged in shares but diluted from 25.38% by the 47.1 cr new shares issued to MUFG Bank, which now owns 20.02% and is classed as a public shareholder. Foreign investors including MUFG held ${OW.fii}%, domestic institutions ${OW.dii}% and retail ${OW.public}%. Apart from MUFG, the biggest move in the quarter was the Government of Singapore selling 12.7 mn shares (4.47% to 3.04%), while Motilal Oswal MF and New World Fund added. The result is an unusual register: two anchor holders of ~20% each, neither with a majority, and a free float of ~60% that is mostly institutional.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Largest named shareholders, 30-Jun-2026', head: ['Holder', '% of shares'], rows: OW.holders.map(([h, v]) => [h, `${v.toFixed(2)}%`]), source: 'Q1FY27 investor update p30-31 (key shareholders); categories from Screener (BSE pattern)' } },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: insiders run it well, and MUFG now watches from the board',
  blocks: [
    { p: 'Shriram Finance is run by career Shriram executives. Umesh Revankar (Executive Vice Chairman) leads strategy and the investor calls; Parag Sharma, CFO for many years, became MD & CEO on 5-Dec-2025 when Y. S. Chakravarti completed his term, and the board has recommended him for five more years from 13-Dec-2026; S. Sunder became Joint MD & CFO. The board has 12 members: an independent chairman (J. K. Mohapatra) and four other independent directors, three executives, and four non-executive nominees (one from the Shriram group, one from Sanlam and two from MUFG).' },
    { verdicts: [
      ['Promoter and anchor holders', 'Moderate', 'Shriram group 20.3% through Shriram Capital and Shriram Value Services; MUFG 20.0% with two board seats and a 24-month standstill; Sanlam a long-time minority partner.', 'Two anchors and no majority owner: stable today, but a change in MUFG\'s role would change the company.'],
      ['Management quality and succession', 'Strong', 'Long-tenured insiders; an orderly CEO handover in Dec-2025; credible guidance (FY26 growth 14.85% vs ~15%).', 'Low key-person risk; culture is the operating model.'],
      ['Board independence', 'Moderate', `5 of 12 directors independent (incl. the chairman); 4 nominee directors.`, 'Adequate, not strong; nominee directors bring oversight from MUFG and Sanlam.'],
      ['Disclosure', 'Strong', 'Stage-wise provisions and Stage 3 by product, ALM, borrowing mix, disbursements by product on calls.', 'Missing: new vs used vehicle split, product yields (requested on the Q1 call).'],
      ['Pay', 'Moderate', `Executive Vice Chairman ${n0(GV.payRatios.revankar)}x the median employee; MD & CEO and Joint MD ${n0(GV.payRatios.sharma)}x; median pay +${GV.payRatios.medianPayIncreasePct}% vs managerial +${GV.payRatios.managerialIncreasePct}% in FY26.`, 'Modest by Indian financial-sector standards.'],
      ['Capital allocation', 'Moderate', 'Exited housing finance at a gain (FY25); sold 20% to MUFG at a market price; but raised far more equity than it needs for years.', 'Good for safety and funding; dilutive for ROE until it is levered up.'],
      ['Group structure', 'Weak (opaque)', 'Promoter shares sit with Shriram Capital Pvt Ltd and Shriram Value Services; the ownership chain up to Shriram Ownership Trust is not set out in the filings we read.', 'Related-party flows with group companies (brand, services) not quantified in our sources.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'Annual report FY2025-26 (board, remuneration annexure); Q4FY26 and Q1FY27 investor updates and calls' },
    { callout: '**Our view:** governance is sound and management is credible, conservative and stable, a real asset in a business that runs on field discipline. The open questions are structural: how the Shriram group and MUFG will share influence over time, and whether MUFG eventually wants more than 20% (it is barred from buying in the market until about April 2028). Either could re-rate or de-rate the stock; neither is predictable from public filings.' },
  ],
};

const cmpRow = (label, ours, street, src) => [label, ours, street, src];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: 'Our forecasts: EPS +16% a year to FY29E, ROE only 13-14%, in the middle of the street',
  blocks: [
    { exhibit: { type: 'table', title: 'Key forecasts (consolidated)', x: 'fin.labels', from: 'FY24', to: 'FY29E', rowsRef: [
      { name: 'AUM (₹ cr)', ref: 'fin.aum', fmt: 'num' }, { name: 'AUM growth (%)', ref: 'fin.aumGrowth', fmt: 'pct' }, { name: 'Net interest income (₹ cr)', ref: 'fin.nii', fmt: 'num' },
      { name: 'NIM on average AUM (%)', ref: 'fin.nim', fmt: 'pct' }, { name: 'Cost-to-income (%)', ref: 'fin.costToIncome', fmt: 'pct' }, { name: 'Pre-provision profit (₹ cr)', ref: 'fin.ppop', fmt: 'num' },
      { name: 'Credit cost (% avg AUM)', ref: 'fin.creditCost', fmt: 'pct' }, { name: 'Net profit (₹ cr)', ref: 'fin.pat', fmt: 'num', hl: true },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2', hl: true }, { name: 'EPS growth (%)', ref: 'fin.epsGrowth', fmt: 'pct' }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' },
      { name: 'ROA on total assets (%)', ref: 'fin.roa', fmt: 'pct' }, { name: 'ROE (%)', ref: 'fin.roe', fmt: 'pct', hl: true },
    ], source: `Company, Screener.in; GAM estimates. FY25 profit includes the ₹1,489 cr SHFL gain. FY27E ROE averages opening and closing equity (${n1(roeTw27)}% time-weighted). DPS: ₹10.80 for FY26; we model a 20% payout (₹${n2(F.dps[0])} for FY27E).` } },
    { p: `FY27E EPS growth of {{F.epsGrowth.0|pct}} comes from a {{F.niiGrowth.0|pct}} rise in NII on the MUFG money, partly offset by 25% more shares. It needs ~₹${n0((F.pat[0] - Q1.pat) / 3)} cr of profit a quarter for the rest of the year (Q1: ₹${n0(Q1.pat)} cr). After FY27, EPS grows {{F.epsGrowth.1|pct}} and {{F.epsGrowth.2|pct}}: AUM +18%, a slowly falling margin and stable credit cost.` },
    { exhibit: { type: 'table', title: 'Our estimates vs the street (estimates standing on 30-Sep-2026)', head: ['Metric', 'GAM', 'Street', 'Source of street figure'], wide: [3], rows: [
      cmpRow('FY27E EPS (₹)', '{{F.eps.0|n2}}', `${n1(streetEps.plFY27)}-${n1(streetEps.emkayFY27)}`, `PL ₹58.2; ICICI Direct ₹${n1(streetEps.idirectFY27)} (PAT ₹14,071 cr ÷ 235.3 cr shares); Emkay ₹61.9 (25-27 Jul)`),
      cmpRow('FY28E EPS (₹)', '{{F.eps.1|n2}}', `${n1(streetEps.plFY28)}-${n1(streetEps.emkayFY28)}`, `PL ₹62.3; ICICI Direct ₹${n1(streetEps.idirectFY28)}; Motilal Oswal ~₹${n1(streetEps.moslFY28)} (29% PAT CAGR FY26-28E); Emkay ₹78.7`),
      cmpRow('FY28E book value per share (₹)', '{{F.bvps.1|n1}}', `${n0(IB.plMar28Abv)}-${n0(IB.emkayFY28)}`, 'PL ₹521 adjusted (₹1,250 ÷ 2.4x); ICICI Direct ₹519 adjusted; Motilal Oswal ₹555 (₹1,220 ÷ 2.2x); Emkay ₹560'),
      cmpRow('FY28E ROE (%)', '{{F.roe.1|pct}}', '11.7-14.9%', 'PL 11.7%; ICICI Direct 12.3%; Motilal Oswal 13.5%; Emkay 14.9%'),
      cmpRow('Credit cost FY27E / FY28E', '{{F.creditCost.0|pct}} / {{F.creditCost.1|pct}}', '1.9-2.1%', 'PL 2.0% / 1.9%; Motilal Oswal 2.1% / 2.1% (bases differ)'),
      cmpRow('AUM growth FY27E / FY28E', '{{F.aumGrowth.0|pct}} / {{F.aumGrowth.1|pct}}', '17% / 18%', 'PL, Emkay; Motilal Oswal ~18% CAGR FY26-28E'),
    ], source: 'Broker notes dated 25-Jul to 29-Sep-2026; implied figures are our arithmetic on published targets and multiples. No consensus EPS dated on or before 30-Sep-2026 was available to us (gap).' } },
    { callout: '**Where we differ:** not on earnings. Our EPS and book are inside the street\'s range (above PL, below Emkay), and our ROE is in line. The whole difference with the street is the multiple: brokers apply 2.1-2.4x to FY28E book, the stock\'s own five-year peak; we derive 1.5x from its history, the sector and the lower ROE the new capital brings.' },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: unanimously Buy, targets ₹${n0(tpLo)}-${n0(tpHi)}, all on 2.1-2.4x book`,
  blocks: [
    { p: `After Q1FY27 every broker we found stayed at Buy: Prabhudas Lilladher ₹1,250 (2.4x Mar-28 adjusted book), Axis Direct ₹1,230, ICICI Securities ₹1,225, ICICI Direct ₹1,200 (~2.1x FY28E book), Emkay ₹1,200 (2.1x FY28E), IDBI Capital ₹1,200. On 29-Sep-2026, after the stock had fallen ~11% in a month, Motilal Oswal reiterated Buy at ₹1,220 (2.2x FY28E book), calling the fall "cyclical and macro-driven". The average of these seven targets is ₹${n0(tpAvg)}, ${pc((tpAvg / price - 1) * 100)} above the 30-Sep close. Consensus Q1 profit had been ₹${n0(CONS.q1PatConsensusCr)} cr; the actual ₹3,445 cr beat it by ~10%.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: [
      ['The stock is cheap at ~2x book for 18% growth and a 4% ROA', 'Motilal Oswal, PL, Emkay', 'Disagree on the multiple: book has just jumped 32% through a share issue at market price; ROE is 13-14%, not 16-18%.'],
      ['ROE dilution from the MUFG capital', 'ICICI Direct, Emkay (ROE 12-13% FY27E)', 'Agree; it lasts until leverage is rebuilt (5-6 years on management\'s own plan).'],
      ['NIM guidance of 8.5% is too conservative', 'Autonomous (Q1 call), Emkay', 'Partly agree: our FY29E NIM is above guidance on the company\'s basis, but yields will fall as funding savings are passed on.'],
      ['Monsoon, El Nino, crude and West Asia are temporary', 'Motilal Oswal (29-Sep)', 'Possibly, but they hit exactly Shriram\'s borrowers; in our bear case.'],
      ['Opex stays elevated with 150 new branches', 'PL', 'Agree: we hold opex at ~2.75% of AUM.'],
      ['Stage 3 is stuck at ~4.6% and rising in the newer books', 'GAM', 'Our main operating concern; the provision cushion (~6% of loans) limits the P&L damage.'],
    ], source: 'Broker notes and press, 25-Jul to 30-Sep 2026; Q1FY27 call; GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
