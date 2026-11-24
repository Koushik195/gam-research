// Ipca Laboratories report, part 5: street view and risks & honest summary (valuation is in IPCALAB.part5b.js).
const X = require('./IPCALAB.ctx');
const { ruleText } = require('../../src/ratings');
const { D, F, V, SC, n0, n1, pc, rup, price, mv, MULT, k, SECTOR, HB, HR, epsU, epsSep, fwdNow, fwdNow27, trailPe, rating, buyBelow, sellAbove, ST, mosl, pl_, idir, emkay, choice, jm, nuv, nom, axis, hsie, withTp, postQ1, medPost, shortDate, SHARES, Q1, dr5, stakeMv, UD, netCashOwn, methodCount } = X;

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: eight post-Q1 targets of ₹${n0(Math.min(...postQ1.map(s => s.tp)))}-${n0(Math.max(...postQ1.map(s => s.tp)))}, mostly on ~25-30x P/E; nearly everyone says Buy`,
  blocks: [
    { p: `After the Q1FY27 results (13-Aug-2026) eight houses published: Motilal Oswal Buy ₹${n0(mosl.tp)} (30x 12-month-forward EPS), Prabhudas Lilladher Buy ₹${n0(pl_.tp)} (30x FY28E), ICICI Direct Buy ₹${n0(idir.tp)} (18x FY28E EV/EBITDA), Emkay Buy ₹${n0(emkay.tp)} (Sep-28E EPS, Unichem at its own multiple), Choice Add ₹${n0(choice.tp)} (25x FY28E), JM Financial Buy ₹${n0(jm.tp)}, Nuvama Buy ₹${n0(nuv.tp)} and Nomura Buy ₹${n0(nom.tp)}. Their median target is ₹${n0(medPost)}, ${pc((medPost / price - 1) * 100)} from ₹${n0(price)}. Older notes still standing: HDFC Securities Buy ₹${n0(hsie.tp)} (28x Q3FY28E, Feb-2026), Sharekhan Buy ₹1,726 (Feb-2026), PhillipCapital Hold ₹1,480 (Dec-2025) and the only Sell, Axis Capital ₹${n0(axis.tp)} (May-2026). Of the seven notes that disclose a method, ${methodCount['P/E']} use P/E and ${methodCount['EV/EBITDA']} EV/EBITDA; all value consolidated earnings after minorities (Emkay values Unichem separately within its P/E). Notes from Kotak, Jefferies, Morgan Stanley and other institutional brokers dated before 30-Sep could not be retrieved (gap).` },
    { exhibit: { type: 'table', title: 'The street on 30-Sep-2026', head: ['Broker', 'Date', 'Rating', 'Target (₹)', 'Method', 'FY28E EPS (₹)', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [s.broker, shortDate(s.date), s.rating, n0(s.tp), s.method ? `${s.method} ${s.multiple} ${s.on}` : 'n.d.', s.eps?.FY28E ? n1(s.eps.FY28E) : '–', rup(s.thesis)]),
      { hl: true, cells: ['**GAM Research**', '30-Sep-26', `**${rating}**`, '**{{dcf.tp|num}}**', `**P/E ${MULT.base}x Sep-28E EPS**`, `**${n1(epsU[1])}**`, 'A good franchise in a good phase, fairly priced after a 47% rise'] },
    ], source: rup(D.street.note) } },
    { p: `**Why we are a HOLD when the street says Buy.** Our EPS is at the top of the range (FY28E ₹${n1(epsU[1])} vs ₹${emkay.eps.FY28E}-${idir.eps.FY28E}); the difference is the multiple. The P/E houses apply 25-30x to forward EPS (MOSL and PL 30x), close to our ${MULT.base}x, so our target (₹${n0(V.tp)}) sits inside the street's range (₹1,935-2,190). What we do not share is the urgency: at ₹${n0(price)} the stock already trades at ${n1(fwdNow)}x our FY28E EPS, above Ipca's ${n1(HB.med)}x median one-year-forward P/E since the Unichem deal, after rising 47% in twelve months. The upside left (${pc(V.upside)}) is below the 15% our rule requires for a BUY.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument'], rows: D.critiques.map(c => [rup(c)]), source: 'Broker notes, earnings calls and filings to 30-Sep-2026' } },
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a better business than three years ago at a price that already says so; HOLD',
  blocks: [
    { callout: '**What you are buying:** India\'s leading pain and rheumatology franchise with market-plus growth; an integrated API base that keeps gross margin ~71%; branded emerging-market and regulated-generics businesses growing double digit; clean USFDA status regained after nine years; a net-cash balance sheet; and 52.67% of a recovering Unichem. **What you are not buying:** pricing power, a proprietary pipeline (biosimilars are FY29-30 at the earliest) or a business free of cycles: anti-malarials, tenders, APIs and currency can swing a year by 20-40%.' },
    { callout: `**What you are paying:** ₹${n0(price)} is ${n1(trailPe)}x trailing EPS, ${n1(fwdNow27)}x our FY27E and ${n1(fwdNow)}x our FY28E EPS, against a ${n1(HB.med)}x median one-year-forward P/E since the Unichem deal (on EPS before exceptional items). Pharma peers trade ${SECTOR}% above their five-year medians; Ipca's trailing P/E is ${Math.abs(Math.round(dr5.IPCALAB))}% below its own. On the street's method (P/E) and our derived ${MULT.base}x, the target is {{dcf.tp|inr}} ({{dcf.upside|chg}}): a ${rating}. EV/EBITDA (₹${n0(mv('ev').value)}) agrees; the DCF (₹${n0(mv('dcf').value)} at 11.6%) says the price leans on the multiple, as it does for most of the sector.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Standalone margin moves toward 28-30% and Unichem to mid-teens (consolidated 25%+ by FY28)', 'Medium', 'Quarterly margins; Unichem\'s US and Europe growth; Ipca APIs approved in Unichem products'],
      ['US and Europe generics keep 20%+ growth with new launches', 'Medium', 'Launch count (7-8 a year), UK/EU sales, Pisgah plant start-up'],
      ['Clean outcome at Unichem Goa (VAI) and Kolhapur', 'Medium-high', 'EIRs; any OAI or warning letter'],
      ['A price fall to below ~₹' + n0(buyBelow), 'n.a.', 'Upside to our target would reach 15% (BUY on our rule)'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Freight, solvent and packaging costs stay high (West Asia) and generics contracts reprice slowly', 'Medium', 'Each 1pp of margin ≈ ₹3.5 of FY28E EPS; bear case {{scen.bear.tp|inr}}'],
      ['USFDA setback at Unichem Goa or an Ipca plant', 'Low-medium', 'US growth stalls; a repeat of 2015 would hit regulated-market revenue (~₹1,500 cr in the US alone)'],
      ['Institutional anti-malarial tenders shrink further as donor funding falls', 'Medium', '₹270 cr business; low margin impact but lumpy'],
      ['Rupee strengthens', 'Low-medium', '~5pp of Q1 growth was currency; ~25% of costs are dollar-linked'],
      ['Price controls widen (NLEM revision) or trade generics pressure pain brands', 'Low-medium', 'Pain is 53% of domestic sales'],
      ['Another acquisition or group rescue (Krebs, Lyka) of uncertain return', 'Medium', 'Capital allocation record is mixed'],
      ['Unichem minority buy-out on generous terms (share issue)', 'Low', 'Dilution of Ipca shareholders'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY below ~₹${n0(buyBelow)}** (where upside to our target reaches 15%); between that and ~₹${n0(sellAbove)} the rule gives HOLD, and SELL above it, on today's numbers.`,
      `**Biggest swing factors:** the multiple and margins. Each 1x on the P/E is ~₹${n0(epsSep)} a share; each 1pp of FY28-29E EBITDA margin is ~₹${n1((F.sales[1] + F.sales[2]) / 2 / 100 * 0.70 / SHARES)} of Sep-28E EPS, ~₹${n0((F.sales[1] + F.sales[2]) / 2 / 100 * 0.70 / SHARES * MULT.base)} a share at ${MULT.base}x. On the full-window history including the pre-deal year (${X.mult22}x), value would be ~₹${n0(Math.round(X.mult22 * epsSep / 10) * 10)}: a BUY. That is the main judgment call in this report, and we explain in the valuation chapter why we leave it out.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Domestic growth, Q1FY27', v: `+${Q1.domesticGrowthPct}%`, d: 'IQVIA +11.7%; chronic +17.2% vs market +15.2%' },
      { k: 'EBITDA margin, Q1FY27', v: `${Q1.ebitdaMarginCompanyPct}%`, d: 'FY26 20.7%; guidance ~23% for FY27' },
      { k: 'Net cash, Mar-27E', v: `₹${n0(netCashOwn[0])} cr`, d: 'ex associate stakes, incl. Unichem\'s debt' },
      { k: 'Forward P/E', v: `${n1(fwdNow)}x`, d: `FY28E; median since the Unichem deal ${n1(HB.med)}x` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

module.exports = { street, risks };
