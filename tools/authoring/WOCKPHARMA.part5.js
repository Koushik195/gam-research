// Wockhardt report, part 5: street view and valuation. P/E primary on Sep-28E EPS; multiple from Wockhardt's own one-year-
// forward P/E since the earnings break (1-Oct-2025) x the nine pharma peers' move over the same window (PLAYBOOK §7c
// turnaround rule); EV/EBITDA and DCF cross-checks. Factor table, sensitivities, NPV, scenarios, DCF and peers in part5c;
// risks in part5b.
const X = require('./WOCKPHARMA.ctx');
const { streetBlocks } = require('./valuation-blend');
const { D, F, V, n0, n1, pc, pc1, ASOF_TXT, price, mv, peMult, epsSep28, evMult, ebitdaSep28, OWN, OWN27, OWN28, S21, TROUGH21, FY26PTS, FM, ALTW, HEV, FAC, k, kev, derived, SENS, peSep28, fwdNow28, P, PEER_SET, shortName, rating, ST, shortDate, epsExc } = X;
const P5B = require('./WOCKPHARMA.part5b'), P5C = require('./WOCKPHARMA.part5c');

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: almost no coverage, no disclosed method, and no published estimates on 30-Sep-2026',
  blocks: [
    { p: `${D.street.coverageNote} The stock nevertheless rose from ₹1,460 (3-Oct-2025) to ₹${n0(price)} on ${ASOF_TXT}, driven by the NDA acceptance (Dec-2025) and the approvals (May-2026), so the price has been set by investors who own the Zaynich story rather than by published models.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: D.critiques, source: 'Broker summaries, press, filings and GAM Research to 30-Sep-2026' } },
  ],
};

const winTxt = `the 52 weekly closes from 1-Oct-2025 to 25-Sep-2026`;
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: ${peMult}x Sep-28E EPS gives {{dcf.tp|inr}} (${rating}); every cross-check sits lower`,
  blocks: [
    ...streetBlocks('WOCKPHARMA', {
      rating, noOurEps: true,
      streetIntro: `${D.street.methodNote} We apply P/E to the EPS the market will look at in September 2027 (Sep-28E: half FY28E, half FY29E).`,
      street: ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, s.tp, s.method || 'n.d.', s.multiple || '–', s.on || '–', s.thesis]),
      ourThesis: 'Approved antibiotic, slow launch; earnings to FY28 are the base business; price already discounts more than management\'s peak',
      streetSource: 'Trendlyne (Deven Choksey, Axis Securities); Investment Guru India (Axis summary); Business Today (Jul-2026). n.d. = not disclosed',
      derivationTitle: `Our target multiple: ${peMult}x, from the turnaround window`,
      derivationIntro: `Wockhardt lost money before exceptional items in every year from FY17 to FY25, so its since-2021 history mixes loss years (left out as troughs) with a transition year. Under the PLAYBOOK §7c turnaround rule we start its own window at the earnings break: **1-Oct-2025**, the day after the first profitable quarter of the new regime closed (Jul-Sep 2025, PBT ₹91 cr; every quarter since has been profitable) and the day after the Zaynich NDA was filed (30-Sep-2025). We pair it with the nine pharma peers' P/E move over the same window and show the since-2021 median as a sensitivity.`,
      derivation: [
        ['1. Own window from the break', `One-year-forward P/E on ${winTxt}: median ${n1(OWN.med)}x (25th-75th ${n1(OWN.p25)}-${n1(OWN.p75)}x; range ${n1(OWN.min)}-${n1(OWN.max)}x). Forward EPS is our FY27E (₹${n1(F.eps[0])}) for Oct-25 to Mar-26 dates (median ${n1(OWN27.med)}x) and FY28E (₹${n1(F.eps[1])}) for Apr-26 to Sep-26 (median ${n1(OWN28.med)}x). No exceptional items in forecasts, so the base and reported-EPS medians are the same; no trough year in the window`, `Starting point: ${n1(OWN.med)}x`],
        ['2. Peers over the same window', `Nine-name pharma set's trailing P/E at the ${ASOF_TXT} close vs its own median since 1-Oct-2025 (table below): median ${pc1(FAC.pe)} (sector-factor.js reproduces +17.2%). Wockhardt is outside the set`, `${n1(OWN.med)}x × ${k.toFixed(3)} = ${n1(derived)}x → **${peMult}x**`],
        ['3. Since-2021 (sensitivity)', `Since Apr-2021 on the house grid, EPS before exceptional items: median ${n1(S21.med)}x after leaving out the trough years ${TROUGH21.join(', ')} (losses); FY26-forward dates (Apr-24 to Mar-25) trade at ${n1(FY26PTS.med)}x FY26 EPS before exceptional items of ₹${n1(epsExc[2026])}. Reported-EPS house median ${n1(FM.median)}x. Paired with the five-year factor (+8.2%)`, `${SENS.since21}x (reported ${SENS.since21rep}x): sensitivity only`],
        ['4. Growth', `EPS ₹${n1(F.eps[0])} → ₹${n1(F.eps[2])} (FY27-29E); Zaynich earnings start after FY29E`, 'Argues higher later; no uplift in the base (§7c)'],
        ['5. Peers today', `Nine-peer median trailing P/E ${n1(X.medOf(PEER_SET.map(s => P[s].pe)))}x; Wockhardt ${n1(P.WOCKPHARMA.pe)}x trailing and ${n1(fwdNow28)}x FY28E`, `${peMult}x is ${n1(peMult / X.medOf(PEER_SET.map(s => P[s].pe)))}x the peer median: the market is paying for Zaynich`],
        ['6. Returns', `ROE ${n1(F.roe[0])}% / ${n1(F.roe[1])}% / ${n1(F.roe[2])}% vs a ${n1(V.ke)}% cost of equity`, 'Argues far lower: sensitivity only (§7c)'],
      ],
      derivationSource: `Screener.in weekly prices to ${ASOF_TXT}; Screener "Profit for PE" (EPS before exceptional items); AR FY21/FY26; peersAsOf at the NSE close; sector-factor.js; GAM estimates`,
      crossNote: `**What the cross-checks tell us.** EV/EBITDA (${evMult}x Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr less model net debt) gives ₹${n0(mv('ev').value)}, ${pc(mv('ev').vsTarget)} vs the target: ${evMult}x is Wockhardt's own forward EV/EBITDA median since 1-Oct-2025 (${n1(HEV.med)}x) × the peers' EV/EBITDA move over the same window (+${FAC.ev}%). The DCF (₹${n0(mv('dcf').value)}, ${pc(mv('dcf').vsTarget)}) uses our base case: at a ${n1(V.ke)}% cost of equity, revenue growth fading from ~16% to 7%, a margin fading to 26% and working capital at ~34% of sales, the cash flows support only a third of the price; it would need Zaynich far above our base. Both sit below the target; we do not average them in (§4).`,
    }),
    ...P5C.blocks,
  ],
};

module.exports = { street, valuation, risks: P5B.risks };
