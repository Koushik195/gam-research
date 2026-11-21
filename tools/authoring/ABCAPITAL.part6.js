// Aditya Birla Capital report, part 6: our forecasts vs the street, street view and critiques, and valuation (street
// table, sum of the parts, multiple derivations, holding-discount history, cross-checks, scenarios, sensitivity, peers).
// Risks, glossary and statement notes are in part6b.
const X = require('./ABCAPITAL.ctx3');
const { D, F, V, S, SB, SOTP, CONS, n0, n1, n2, pc, pc1, price, rating, ST, shortDate, discHist, discNow, discMedAll, discMedRecent, discMin, discMax, discSubsMedAll, discSubsNow, sharesNow, CROSS, CPB, CPE, CPB2y, cFwdPbNow, cFwdPeNow,
  PEERS, DR, sectorPbDr, pbPerRoe, nbfcRoeFwd, nbfcTrailDer, nbfcDerived, hfcPbPerRoe, hfcRoeFwd, hfcDerived, hfcPbDr, adventPb, LIFE, pevPerRoev, lifeDr, lifeDerived, HEALTH, healthPeerPg, healthDerived, C } = X;
const P6b = require('./ABCAPITAL.part6b');
const E = D.street.estimates, cs = k => SOTP[k].perShare;
const ps = v => n0(v / sharesNow);

const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs street', kicker: 'Forecasts', title: 'Our forecasts vs the street: in line on profit, the debate is about value',
  blocks: [
    { exhibit: { type: 'table', title: 'GAM vs street (standing on 30-Sep-2026)', head: ['', 'FY27E GAM', 'FY27E street', 'FY28E GAM', 'FY28E street', 'Street source'], rows: [
      ['Consolidated PAT after minorities (₹ cr)', n0(CONS[0].pat), n0(E.mosl.pat[0]), n0(CONS[1].pat), n0(E.mosl.pat[1]), 'Motilal Oswal, 2-Aug-2026'],
      ['Consolidated EPS (₹)', n2(CONS[0].eps), n2(E.mosl.eps[0]), n2(CONS[1].eps), n2(E.mosl.eps[1]), 'Motilal Oswal'],
      ['Consolidated ROE (%)', n1(CONS[0].roe), n1(E.mosl.roe[0]), n1(CONS[1].roe), n1(E.mosl.roe[1]), 'Motilal Oswal'],
      ['Consolidated BVPS (₹)', n1(CONS[0].bvps), n1(404 / 2.6), n1(CONS[1].bvps), n1(404 / 2.3), 'Motilal Oswal (implied by P/B 2.6x / 2.3x at ₹404)'],
      ['Standalone EPS (₹)', '{{F.eps.0|n2}}', n2(E.hsieStandalone.eps[0]), '{{F.eps.1|n2}}', n2(E.hsieStandalone.eps[1]), 'HDFC Securities, 3-Aug-2026'],
    ], source: 'GAM Research; broker notes as cited' } },
    { p: `We are close to the street on profit: consolidated EPS of ₹${n2(CONS[0].eps)} / ₹${n2(CONS[1].eps)} against Motilal Oswal's ₹${E.mosl.eps[0]} / ₹${E.mosl.eps[1]}. Our standalone EPS is above HDFC Securities' mainly because we include the June raise (less interest) and the AMC dividend; their per-share figures look based on the pre-issue share count. The disagreement is not about earnings but about what to pay for them: we apply a holding discount the market itself has applied for most of the last four years.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view & critiques', kicker: 'The street', title: 'The street is unanimously positive; the sceptics\' points are worth hearing',
  blocks: [
    { p: `Every broker we found rates ABCL a buy or add, with targets of ₹${n0(Math.min(...ST.map(s => s.tp)))}-${n0(Math.max(...ST.map(s => s.tp)))} (consensus ~₹435 from 14 analysts at end-July). The bull case is simple: a 25%+ growth lender at a 2.3-2.4% ROA, an HFC scaling fast, insurers with rising margins, and consolidated profit growth of ~28% a year. Motilal Oswal's ₹480 has no holding discount; Emkay's ₹400-440 deducts 20% on the subsidiaries.` },
    { exhibit: { type: 'table', title: 'Critiques of the bull case, and our view', head: ['Critique', 'Our view'], wide: [0, 1], rows: D.critiques.map((c, i) => [c, ['Valid: we apply a holding discount and value the AMC at market, not on a target multiple.', 'Valid: dilution is why per-share value grows slower than group profit.', 'Valid: we assume only 5bp a year of yield gain.', 'Valid: we value ABCD at zero and keep "others" losses at ~₹300 cr a year.', 'Partly: the AMC is under 10% of our gross value.', 'Valid: fees cut ~6bp of AUM from FY28E; the bear case doubles that.'][i] || '–']), source: 'GAM Research' } },
  ],
};

// SOTP sensitivity: NBFC multiple × holding discount (₹ per share)
const nbfcP = SB.parts[0], mults = [-0.4, -0.2, 0, 0.2, 0.4].map(x => Math.round((S.nbfc.multiple.base + x) * 10) / 10), discs = [5, Math.round(discNow.disc), S.holdco.base, Math.round(discMedAll), 25];
const grid = mults.map(m => discs.map(dc => Math.round((SB.gross - nbfcP.value + nbfcP.metric * m) * (1 - dc / 100) / sharesNow / 10) * 10));
const histRows = discHist.filter((_, i) => i % 2 === 0 || i === discHist.length - 1);
const valuation = {
  id: 'valuation', nav: 'Valuation', kicker: 'Valuation', title: `Valuation: sum of the parts gives {{dcf.tp|inr}}, a ${rating}`,
  blocks: [
    { h: 'How the street values ABCL' },
    { p: 'Every broker that discloses a method uses a sum of the parts on Mar-28E: the NBFC on price to book (2.0-2.3x), the housing-finance company on price to book (1.8-2.2x), the AMC stake at 26-28x earnings, the life insurer on price to embedded value (1.3-1.5x) and the health insurer on ~1.0x premium or its last deal value. Emkay deducts a 20% holding discount on the subsidiaries; Motilal Oswal shows none. We use the same structure.' },
    { exhibit: { type: 'table', title: 'How the street values the stock (standing on 30-Sep-2026)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Multiples', 'On', 'Thesis'], wide: [6], rows: [
      ...ST.map(s => [`${s.broker} (${shortDate(s.date)})`, s.rating, n0(s.tp), s.method || 'n.d.', s.multiple || 'n.d.', s.on || '–', s.thesis]),
      { hl: true, cells: ['**GAM Research**', `**${rating}**`, '**{{dcf.tp|num}}**', '**SOTP**', `NBFC ${S.nbfc.multiple.base}x, HFC ${S.hfc.multiple.base}x book; AMC at market; life ${S.life.multiple.base}x EV; health ${S.health.multiple.base}x GWP; ${S.holdco.base}% holding discount`, 'Sep-28E book; Mar-27E EV; FY27E GWP', 'A good lender; the discount has already narrowed'] },
    ], source: 'Motilal Oswal, Emkay (InvestmentGuru India PDFs); HDFC Securities (Results Daily); ICICI Securities, BofA, Macquarie, Investec, Morgan Stanley (Investing.com headlines); Kotak Neo. n.d. = not disclosed in the sources we saw' } },
    { h: 'Our sum of the parts' },
    { exhibit: { type: 'table', title: 'Sum of the parts (base case; bull and bear per share)', head: ['Business', 'Method', 'Metric (₹ cr, 100%)', 'Multiple', 'ABCL stake', 'Value to ABCL (₹ cr)', '₹ / share', 'Bull', 'Bear'], rows: [
      ...SB.parts.map((p, i) => [p.name, p.method, n0(p.metric), p.mult === 1 ? '–' : `${p.mult}x`, `${n1(p.stake)}%`, n0(p.value), n0(p.perShare), n0(SOTP.bull.parts[i].perShare), n0(SOTP.bear.parts[i].perShare)]),
      { hl: true, cells: ['**Look-through value**', '', '', '', '', `**${n0(SB.gross)}**`, `**${n0(SB.grossPs)}**`, n0(SOTP.bull.grossPs), n0(SOTP.bear.grossPs)] },
      ['Holding discount', 'ABCL\'s own history', '', `${SB.disc}%`, '', `−${n0(SB.discValue)}`, `−${ps(SB.discValue)}`, `−${SOTP.bull.disc}%`, `−${SOTP.bear.disc}%`],
      { hl: true, cells: ['**Value per share → 12-month target**', '', '', '', '', `**${n0(SB.equity)}**`, '**{{dcf.tp|inr}}**', '{{scen.bull.tp|inr}}', '{{scen.bear.tp|inr}}'] },
    ], source: `GAM Research. Shares ${n1(sharesNow)} cr after the June allotment. Lending businesses on Sep-28E book (the house 12-month-forward basis); insurers on Mar-27E EV and FY27E premium (trailing multiples applied at the target date); listed stakes at the 30-Sep close.` } },
    { h: `Deriving each multiple` },
    { exhibit: { type: 'table', title: 'Deriving the multiples', head: ['Part', 'Evidence', 'Multiple'], wide: [1], rows: [
      ['NBFC P/B', `No listed history of its own (it was a subsidiary until 2025). Diversified lenders (Bajaj Finance, Chola, Shriram, L&T Finance, M&M Finance, HDB) trade at a median ${n2(pbPerRoe)}x trailing book per point of ROE on ${X.ASOF_TXT}; ABCL's NBFC earns ~${n1(nbfcRoeFwd)}% (FY28-29E, ex dividend, on equity net of investments in subsidiaries) → ${n1(nbfcTrailDer)}x Mar-27E book at the target date, ${nbfcDerived}x on Sep-28E book. Sector move: nine lenders ex ABCL ${pc1(sectorPbDr)} vs five-year median P/B (already in today's peer multiples). Justified P/B at 16% ROE, 13.4% Ke, 10% growth ≈ 1.8x trailing book: the market pays a premium over fundamentals across the sector. Street 2.0-2.3x Mar-28E.`, `**${S.nbfc.multiple.base}x** (bull ${S.nbfc.multiple.bull}x, bear ${S.nbfc.multiple.bear}x)`],
      ['HFC P/B', `Listed HFCs ${n2(hfcPbPerRoe)}x book per point of ROE × ABHFL's ~${n1(hfcRoeFwd)}% ROE (FY28-29E) → ${hfcDerived}x Sep-28E book. HFCs ${pc1(hfcPbDr)} vs five-year median P/B. Advent paid ${n2(adventPb)}x post-money book in April (≈1.8x on our basis). Street 1.8-2.2x.`, `**${S.hfc.multiple.base}x** (${S.hfc.multiple.bull}x / ${S.hfc.multiple.bear}x)`],
      ['Life P/EV', `HDFC Life ${n2(LIFE.HDFCLIFE.pev)}x, SBI Life ${n2(LIFE.SBILIFE.pev)}x, ICICI Pru ${n2(LIFE.ICICIPRULI.pev)}x Mar-26 EV: median ${n2(pevPerRoev)}x per point of operating RoEV × ABSLI's 13.2% → ${lifeDerived}x. Listed insurers ${pc1(lifeDr)} vs five-year median P/EV. Street 1.3-1.5x Mar-28E EV.`, `**${S.life.multiple.base}x** (${S.life.multiple.bull}x / ${S.life.multiple.bear}x)`],
      ['Health P/GWP', `Star Health ${n2(HEALTH.STARHEALTH.pg)}x, Niva Bupa ${n2(HEALTH.NIVABUPA.pg)}x FY26 GWP; ABHI's combined ratio (105%) is 4-6 points worse, so one-third off → ${healthDerived}x. ADIA's 2022 entry was ~2.4x the following year's premium. Motilal Oswal 1.0x.`, `**${S.health.multiple.base}x** (${S.health.multiple.bull}x / ${S.health.multiple.bear}x)`],
      ['AMC, broking', 'Listed: market value on 30-Sep-2026 (ABSLAMC ₹995.30, Aditya Birla Money ₹114.78).', 'Market'],
    ], source: 'Screener.in and NSE closes on 30-Sep-2026; insurer EV disclosures (Apr-May 2026); Advent and ADIA transaction filings; GAM Research' } },
    ...require('./ABCAPITAL.part6c').discountBlocks,
    { h: 'Cross-checks' },
    { pair: [
      { type: 'hbar', title: 'Target and cross-checks vs the share price', unit: '₹ per share (base case)', x: ['SOTP (target)', ...CROSS.map(c => c.name), 'Share price 30-Sep'], series: [{ name: 'Value', values: [Math.round(SB.perShare), ...CROSS.map(c => Math.round(c.value)), price], fmt: 'inr' }], labels: 'all', highlight: 'SOTP (target)', source: 'GAM Research' },
      { type: 'table', title: 'Cross-checks', head: ['Method', 'Basis', 'Multiple', '₹ / share', 'vs target'], rows: CROSS.map(c => [c.name, c.basis, c.mult, n0(c.value), pc(c.vsTarget)]), source: 'GAM Research' },
    ] },
    { callout: `**What the cross-checks say.** On its own history the group looks expensive: ${n1(cFwdPbNow)}x forward consolidated book vs a ${n1(CPB.med)}x median since April 2021 (${n1(CPB2y.med)}x over the last two years), and ${n1(cFwdPeNow)}x forward EPS vs ${n1(CPE.med)}x before one-offs. Applying those medians gives ₹${n0(CROSS[0].value)} and ₹${n0(CROSS[1].value)}. Without any holding discount the parts are worth ₹${n0(SB.grossPs)}. Justified P/B on a 14% long-run group ROE is only ₹${n0(CROSS[3].value)}: at ₹${n0(price)} the market already prices a long-run consolidated ROE of ~${n1(X.cImpliedRoe)}%. The engine's standalone checks (₹${n0(CROSS[4].value)} and ₹${n0(CROSS[5].value)}) carry the subsidiaries at cost and are floors, not fair values.` },
    { exhibit: { type: 'table', title: 'Scenarios', head: ['Scenario', 'Target', 'vs CMP', 'What has to happen'], wide: [3], rows: [
      ['**Bull**', '{{scen.bull.tp|inr}}', '{{scen.bull.upside|chg}}', `{{as.scenarios.bull.narrative}} NBFC ${S.nbfc.multiple.bull}x, HFC ${S.hfc.multiple.bull}x, life ${S.life.multiple.bull}x, health ${S.health.multiple.bull}x; discount ${S.holdco.bull}% (today's level).`],
      { hl: true, cells: ['**Base (GAM)**', '{{dcf.tp|inr}}', '{{dcf.upside|chg}}', `NBFC AUM +{{F.aumGrowth.0|pct}} / +{{F.aumGrowth.1|pct}} / +{{F.aumGrowth.2|pct}}, credit cost {{F.creditCost.0|pct}}-{{F.creditCost.2|pct}}; consolidated EPS ₹${n2(CONS[0].eps)} / ₹${n2(CONS[1].eps)} / ₹${n2(CONS[2].eps)}; holding discount ${S.holdco.base}% (two-year median).`] },
      ['**Bear**', '{{scen.bear.tp|inr}}', '{{scen.bear.upside|chg}}', `{{as.scenarios.bear.narrative}} NBFC ${S.nbfc.multiple.bear}x, HFC ${S.hfc.multiple.bear}x, life ${S.life.multiple.bear}x, health ${S.health.multiple.bear}x; discount ${S.holdco.bear}% (median since Mar-22).`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Value per share (₹): NBFC P/B × holding discount', head: ['NBFC P/B \\ discount', ...discs.map(d => `${d}%`)], rows: mults.map((m, i) => [`${m}x`, ...grid[i].map(n0)]), source: 'GAM Research; other parts at base multiples' } },
    { p: `**How sensitive the rating is.** Each 0.1x on the NBFC multiple moves value by ~₹${n0(nbfcP.metric * 0.1 * (1 - SB.disc / 100) / sharesNow)} a share; each 5 points of holding discount by ~₹${n0(SB.grossPs * 0.05)}. A BUY needs a target of ~₹${n0(price * 1.15)} (15% above the 30-Sep price): the discount held near today's ~${n0(discNow.disc)}% with the NBFC at ~2.6x, or our base multiples with only a ~5% discount. A SELL needs a target below ~₹${n0(price * 0.95)}: a ~25% discount at our base multiples, or the long-run median with lower multiples.` },
    { p: '**Engine note.** Our lender model covers the standalone company only, and the lender engine values lenders on P/E, P/B, justified P/B or residual income, not on a sum of the parts. The SOTP value per share is therefore carried into the engine and the Excel model as an implied multiple of standalone Sep-28E book ({{dcf.blend.methods.0.mult|n2}}x base). In the Excel file the target moves with the NBFC\'s book; the other parts are fixed inputs from this chapter.' },
    { exhibit: { type: 'table', title: 'Listed peers at the 30-Sep-2026 close', head: ['Company', 'P/B (x)', 'vs 5-yr median P/B', 'P/E (x)', 'ROE FY26', 'P/B per ROE point'], rows: [...X.LENDERS, ...X.HFCS].map(s => PEERS[s]).map(p => [p.symbol, p.pb != null ? n1(p.pb) : 'n.a.', p.pbVs != null && !['BAJAJHFL', 'AADHARHFC', 'HDBFS'].includes(p.symbol) ? pc(p.pbVs) : 'n.m.', p.pe != null ? n1(p.pe) : 'n.a.', p.roe != null ? `${n1(p.roe)}%` : 'n.a.', p.pbPerRoe != null ? n2(p.pbPerRoe) : '–']), source: 'Screener.in (latest basis on file), trailing multiples scaled to the NSE close on 30-Sep-2026. HDB Financial (listed Jul-2025), Bajaj Housing (Sep-2024) and Aadhar (May-2024) have no five-year median; ABCL excluded from the de-rating set.' } },
  ],
};

module.exports = { forecasts, street, valuation, ...P6b };
