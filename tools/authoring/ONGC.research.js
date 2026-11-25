// ONGC report, part B: cover, risks & honest summary, glossary, statement notes, and the merge of ONGC.part2-6.js
// (built on ONGC.ctx.js). Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures are live tokens.
const X = require('./ONGC.ctx');
const P2 = require('./ONGC.part2'), P3 = require('./ONGC.part3'), P4 = require('./ONGC.part4'), P5 = require('./ONGC.part5'), P6 = require('./ONGC.part6');
const { n0, n1, price, sh, ps, mcap, rating, buyBelow, sellAbove, ruleText, listedMv, CM, DISC, OVLPS, implMed, implSepNow, sectorDr, coreSep, coreSepEps, medTp, CP, C, AS, F } = X;
const B = AS.build, Q1 = C.q1fy27;
const perHalfTurn = 0.5 * coreSep('base') / sh;
const verdict = { BUY: 'BUY', HOLD: 'HOLD', SELL: 'SELL' }[rating];

const cover = {
  headline: `A record year at the top of the oil cycle, priced above what the market has paid for ONGC's core since 2021: ${verdict}`,
  lead: `ONGC produces 73% of India's crude and 57% of its gas, and owns 54.9% of HPCL, 71.6% of MRPL, 14.2% of Indian Oil, 12.5% of Petronet, 5% of GAIL and all of ONGC Videsh. The Strait of Hormuz crisis gave it a record Q1FY27 (standalone profit ₹${n0(Q1.patCr)} cr, +112%) and no windfall tax followed. But FY27 is a peak: on the EIA's path Brent falls to ~US$70 by FY28E and our core profit (before dividends from the stakes) drops ~${Math.round((1 - CP.base[1].core / CP.base[0].core) * 100)}%. We value ONGC the way the street does, as a **sum of the parts**, but with a **derived** multiple: ${CM.base}x Sep-28E core profit (the market's own median since 2021, ${n1(implMed)}x, times the ${sectorDr >= 0 ? '+' : ''}${n1(sectorDr)}% sector move), plus the stakes at 30-Sep-2026 prices less a ${DISC.base}% holding discount, ONGC Videsh at ₹${OVLPS.base} a share and the unlisted holdings at cost. **Target {{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Bull {{scen.bull.tp|inr}}; bear {{scen.bear.tp|inr}}. The street (median ₹${n0(medTp)}) uses 6.3-8x on similar earnings.`,
  arguments: [
    { h: 'FY27 is a windfall, not a new level', p: `Q1FY27 crude realisation was US$${Q1.crudeRealisationUsd} vs US$${Q1.crudeRealisationPyUsd} a year earlier; volumes fell 5%. We assume Brent US$${B.brent[0]} in FY27E and US$${B.brent[1]} in FY28E (EIA, Sep-2026): EPS ₹{{F.eps.0|n1}} then ₹{{F.eps.1|n1}}. Every US$1/bbl is worth ~₹${n0(X.build[1].crude * (1 - B.cessPct[1] / 100 - B.royaltyPct[1] / 100) / B.brent[1])} cr of FY28E crude revenue after royalty and cess.` },
    { h: 'The market has rarely paid the street\'s multiple', p: `After deducting the stakes at 80% of market value, ONGC Videsh and the unlisted holdings, the market has paid a median ${n1(implMed)}x forward core profit since Apr-2021. On ${X.ASOF_TXT} it paid ${n1(implSepNow)}x on our Sep-28E core profit. The street's 6.3-8x was paid only briefly, in Mar-Sep 2024. Each half-turn on the core is ~₹${n1(perHalfTurn)} a share.` },
    { h: 'The stakes are real value, discounted for good reason', p: `The listed stakes are worth ₹${n0(ps(listedMv))} a share (${Math.round(listedMv / mcap * 100)}% of ONGC's market value). Two of them, HPCL and MRPL, are refiners whose profits fall when crude spikes (HPCL lost ₹${n0(Q1.hpclNetLossCr)} cr in Q1FY27). ONGC has never sold a share; we apply our house 20% discount for listed stakes inside an operating company (JM, BOB 20%; MOSL, PL 25%).` },
    { h: 'What could prove us wrong', p: 'Brent staying near US$80-90 (management expects US$75+ long term), a fast gas ramp-up at KG-98/2 and Daman, or a market that finally pays 6-8x for the core as the street expects. Against that: a windfall tax, pressure to share OMC losses, and more state-directed spending. Dividend yield at our payout: ~8% on FY27E DPS, ~6% on FY28E, which supports the share price on the way down.' },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'RED' },
    { k: 'Earnings momentum', v: 'AMBER' },
    { k: 'Competitive position', v: 'AMBER' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): the first quarter with Brent falling from the Q1 peak, and the post-monsoon survey and dry-well costs.',
    'Any windfall-tax or under-recovery-sharing decision while HPCL and the other fuel retailers lose money.',
    'KG-98/2 gas wells hooked up after the CPP (management: Oct-Nov 2026) and the Daman Upside ramp-up to ~3 mmscmd by Dec-2026.',
    'The first Mahanadi deepwater well under Samudra Manthan (spudded 25-Jul-2026, result expected about three months later).',
    'The APM gas ceiling for FY28 and the formula price as crude falls; any OFS by the government (none announced).',
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a good dividend, a peak year, and a fair price only on the street\'s multiple',
  blocks: [
    { callout: `**What you are buying:** India's dominant oil and gas producer, earning ~₹${n1(coreSepEps('base'))} a share of core profit at ~US$70 Brent (Sep-28E), plus listed stakes worth ₹${n0(ps(listedMv))} a share, ONGC Videsh and unlisted holdings. A peak FY27E (EPS ₹{{F.eps.0|n1}}) pays a large dividend.` },
    { callout: `**What you are paying:** ₹${n1(price)}, i.e. ${n1(implSepNow)}x our Sep-28E core profit after the stakes, above the ${n1(implMed)}x median the market has paid since 2021. Our target {{dcf.tp|inr}} ({{dcf.upside|chg}}). The street's ₹${n0(medTp)} median needs 6.5-8x.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Brent holds US$80+ into FY28', 'Medium', 'Hormuz flows; EIA and futures; each US$1/bbl ≈ ₹' + n1(X.build[1].crude * (1 - B.cessPct[1] / 100 - B.royaltyPct[1] / 100) / B.brent[1] * (1 - X.T) / sh) + ' of FY28E EPS'],
      ['Production finally grows', 'Medium', 'KG-98/2 gas to 6-7 mmscmd; DUDP; Mumbai High TSP; 40 MMTOE in FY28'],
      ['Policy stays producer-friendly', 'Medium', 'No windfall tax in the spike; royalty cut; Samudra Manthan cost sharing'],
      ['The market re-rates the core towards the street\'s 6.5-8x', 'Low-medium', `Implied core P/E (now ${n1(implSepNow)}x)`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Windfall tax re-imposed', 'Low-medium while Brent stays high', 'FY23-25 cost ₹23,806 cr; bear case'],
      ['Brent below US$60 (EIA sees a 2H2027 surplus)', 'Medium', 'Bear target {{scen.bear.tp|inr}}'],
      ['ONGC asked to share OMC losses or recapitalise HPCL', 'Medium', 'HPCL lost ₹' + n0(Q1.hpclNetLossCr) + ' cr in Q1FY27'],
      ['Volumes keep falling', 'Medium', 'Q1FY27 crude −5% YoY; KG-98/2 oil problems'],
      ['Contingent claims', 'Low-medium', 'Panna-Mukta-Tapti ~₹15,216 cr'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY below ~₹${n0(buyBelow)}; SELL above ~₹${n0(sellAbove)}** on our target.`,
      '**For income investors:** the FY27E dividend (~8% yield at a 40% payout) is the best part of the case; it falls with profit in FY28E.',
      `**Biggest swing factors:** the core multiple (each half-turn ~₹${n1(perHalfTurn)} a share) and Brent in FY28-29.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Implied core P/E, 30-Sep-2026', v: `${n1(implSepNow)}x`, d: `median since 2021 ${n1(implMed)}x` },
      { k: 'Listed stakes per share', v: `₹${n0(ps(listedMv))}`, d: `price ₹${n1(price)}` },
      { k: 'Q1FY27 crude realisation', v: `US$${Q1.crudeRealisationUsd}`, d: `FY28E Brent US$${B.brent[1]}` },
      { k: 'FY27E dividend per share', v: '₹{{F.dps.0|n1}}', d: 'FY26 ₹13.25' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Standalone / consolidated', 'ONGC\'s own business only / ONGC plus HPCL, MRPL, OVL, OPaL and others added line by line.'],
      ['Core profit', 'Standalone profit before exceptional items and before dividends from the stakes, taxed at 25.17%.'],
      ['Implied core P/E', '(ONGC market value − listed stakes at 80% of market − OVL − unlisted at cost) ÷ next full year\'s core profit.'],
      ['Sum of the parts (SOTP)', 'Valuing each business and stake separately and adding them up.'],
      ['Holding discount', 'How far below market value we count the listed stakes inside ONGC\'s value.'],
      ['Nomination fields', 'Fields given to ONGC by the government before competitive bidding; their gas is priced under APM.'],
      ['APM gas', 'Administered price mechanism: gas price set at 10% of the Indian crude basket, with a floor and a ceiling.'],
      ['New-well gas (NWG)', 'Gas from new wells in nomination fields; priced at 1.2x the APM formula price, without the ceiling.'],
      ['SAED (windfall tax)', 'Special additional excise duty on domestic crude, Jul-2022 to Dec-2024.'],
      ['Royalty / OIDB cess', 'Government levies on production value (royalty to the centre or states; cess to the Oil Industry Development Board).'],
      ['Dry-well write-off', 'Exploration well costs written off when no commercial oil or gas is found.'],
      ['1P reserves; MMTOE', 'Proved reserves; million tonnes of oil equivalent.'],
      ['mmscmd; BCM; mmBtu', 'Million standard cubic metres a day; billion cubic metres; million British thermal units.'],
      ['TSP', 'Technical services provider: BP\'s role on Mumbai High and the Western Offshore.'],
      ['OMC; under-recovery', 'Oil marketing company (HPCL, IOC, BPCL); selling fuel below cost when retail prices are held.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.crude, P3.gas, P3.ovl, P4.moat, p.financials, P4.guidance, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P6.valuation, risks, p.statements, glossary],
  statementNotes: {
    'sales@FY21': 'Covid and the oil crash: Indian basket US$44.82; EPS ₹8.94 (a trough year).',
    'pat@FY22': 'Tax only ₹734 cr (deferred-tax write-back on the new regime): profit flattered by ~₹9,600 cr.',
    'otherIncome@FY23': 'Screener nets the ₹9,235 cr exceptional charge (restated) against other income.',
    'sales@FY23': 'Net of ₹11,054 cr of windfall tax (SAED); Indian basket US$93.15.',
    'sales@FY24': 'Net of ₹8,720 cr of windfall tax.',
    'dep@FY24': 'Leases brought on the balance sheet (lease liabilities ₹8,883 cr to ₹29,030 cr) raise depreciation.',
    'pat@FY26': 'Brent US$70.45; dry-well write-offs ₹8,236 cr; exchange loss ₹2,699 cr.',
    'pat@FY27E': 'Q1FY27 profit ₹17,034 cr at ~US$97-98 Brent; rest of the year on the EIA path.',
    'pat@FY28E': 'Brent US$69.5: profit falls back towards the FY26 level despite more gas.',
  },
};
