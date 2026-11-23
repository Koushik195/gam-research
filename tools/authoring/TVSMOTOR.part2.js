// TVS Motor report, part 2: what the company does, history and corporate actions, industry.
const X = require('./TVSMOTOR.ctx');
const { C, D, SG, n0, n1, stake } = X;
const A26 = SG.annual.find(a => a.fy === 'FY26'), CA = C.corporateActions, IND = D.industry;
const SRC = 'Company releases, AR FY26, earnings calls; GAM Research';

const business = {
  id: 'business', nav: 'What TVS does', kicker: 'Company', title: 'A two-wheeler maker with four engines: domestic scooters and bikes, EVs, exports and a lender',
  blocks: [
    { p: `${C.profile.what} In FY26 it sold ${n0(A26.units)} vehicles: ${n1(A26.mc / A26.units * 100)}% motorcycles, ${n1(A26.scooter / A26.units * 100)}% scooters (including ${n0(A26.ev)} electric), ${n1(A26.moped / A26.units * 100)}% mopeds and ${n1(A26.threeW / A26.units * 100)}% three-wheelers. ${n1(A26.exports / A26.units * 100)}% of units (and ~24% of revenue) went abroad, mainly to Africa, South Asia and Latin America.` },
    { pair: [
      { type: 'column', title: 'FY26 units by product: scooters are now almost as big as motorcycles', unit: "Units ('000), incl. exports", x: ['Motorcycles', 'Scooters (ICE)', 'Electric scooters', 'Mopeds', 'Three-wheelers'], series: [{ name: 'Units', values: [A26.mc, A26.scooter - A26.ev, A26.ev, A26.moped, A26.threeW].map(v => Math.round(v / 1000)), fmt: 'num' }], labels: 'all', source: 'Sum of monthly sales releases; Q4FY26 presentation' },
      { type: 'column', title: 'Domestic two-wheelers by product, FY25 vs FY26', unit: "Domestic units ('000)", x: ['Motorcycles', 'Scooters incl. EV', 'Mopeds'], series: [{ name: 'FY25', values: [1200, 1810, 502], fmt: 'num', grey: true }, { name: 'FY26', values: [1418, 2303, 523], fmt: 'num' }], labels: 'all', source: 'Autocar Pro (16-Apr-2026), SIAM data; FY25 rounded' },
    ] },
    { exhibit: { type: 'table', title: 'Revenue per vehicle by business (FY26, standalone)', head: ['Business', 'Units', 'Revenue (₹ cr)', '₹ per vehicle', 'How we know'], wide: [4], rows: [
      ['Exports (2W + 3W)', '15.85 lakh', '11,280', '~71,200', 'Sum of the four FY26 calls; AR export sales ₹10,936 cr (incentives excluded)'],
      ['Electric two-wheelers (iQube, Orbiter)', '3.71 lakh', '~5,000', '~1,34,600', 'Q4FY26 call ("about ₹5,000 crores")'],
      ['Domestic ICE 2W, domestic 3W and spares', '39.3 lakh', '~30,016', '~76,300', 'Residual; product split not disclosed'],
      ['Government incentives (PLI + export incentives)', '–', '974', '–', 'AR FY26 note 21'],
      { hl: true, cells: ['**Total**', '**58.89 lakh**', '**47,270**', '**80,267**', ''] },
    ], source: SRC } },
    { h: 'The group: one listed parent, one valuable lender, several cash-hungry bets' },
    { exhibit: { type: 'table', title: 'Group structure and what each part is worth to the shareholder', head: ['Entity', 'Stake', 'What it does', 'FY26 profit (₹ cr)', 'How we value it'], wide: [2, 4], rows: [
      ['TVS Motor (standalone)', '–', 'All Indian manufacturing, domestic sales and exports from India', '3,615', `P/E on Sep-28E EPS (${X.MULT.base}x)`],
      ['TVS Credit Services', `${n1(stake * 100)}% (after Jul-2026)`, 'NBFC: two-wheeler, used car, consumer durable and personal loans; ₹32,053 cr book', '913', `P/B on Sep-28E book (${X.PB.base}x)`],
      ['TVS Motor (Singapore) → Norton (UK)', '100%', 'British super-premium motorcycles; relaunch in FY27', '(723); holding company (118)', 'PV of losses to breakeven'],
      ['→ TVS EBike (Switzerland, Germany, UK)', '100%', 'E-bikes in Europe (Swiss E-Mobility, EGO, EBCO)', '(432)', 'PV of losses to breakeven'],
      ['PT TVS Motor Company Indonesia', '100% (direct + indirect)', 'Scooters and 3W for ASEAN; 0.20mn 2W in FY26', '32', '~15x earnings'],
      ['TVS Motor DMCC (Dubai), DriveX (92.2%), Ultraviolette (associate), Engines Engineering (Italy)', 'various', 'Distribution hub, pre-owned bikes, electric motorcycles, engineering', '(106)', 'Inside the losses; Ultraviolette at cost'],
    ], source: 'AR FY26 notes 4 and 49; company announcements' } },
    { callout: '**The right way to read TVS:** the listed share is a claim on a very good Indian two-wheeler business, ~86% of a profitable lender, and a portfolio of overseas bets that has absorbed ~₹2,000 cr a year. The auto business pays for the bets. The valuation has to treat these separately.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'Company', title: 'Four eras: commuter maker, COVID reset, the premium and EV climb, and GST 2.0',
  blocks: [
    { exhibit: { type: 'table', title: 'How TVS got here (FY20-FY27)', head: ['Era', 'What happened', 'Volumes', 'EBITDA margin', 'What it did to the numbers'], wide: [1, 4], rows: [
      ['**FY20-21: Reset**', 'BS-VI emission norms (Apr-2020), COVID lockdowns; Norton Motorcycles acquired (FY21).', '3.26mn → 3.05mn', '8.2% → 8.5%', 'Revenue flat at ~₹16,500 cr; PAT ~₹600 cr. The low base for the next five years.'],
      ['**FY22-24: Premium and EV climb**', 'iQube scaled from 11k to 194k; Apache, Raider, Jupiter 125, Ronin; European e-bike acquisitions; exports peaked at 12.5 lakh then slipped on African currency crises.', '3.31mn → 4.19mn', '9.4% → 11.1%', 'Revenue +24%/+27%/+20%; PAT tripled to ₹2,083 cr; material cost 76% → 74% of sales.'],
      ['**FY25-26: Scale**', 'EV share to 24%; exports +18% then +33%; GST 2.0 (22-Sep-2025) cut tax on bikes up to 350cc from 28% to 18%; Sundaram Auto Components merged; NCRPS bonus.', '4.74mn → 5.89mn', '12.3% → 12.9%', 'Revenue +30% in FY26 to ₹47,270 cr; PAT ₹3,615 cr; R&D ₹1,254 cr; ₹2,400 cr into subsidiaries.'],
      ['**FY27: Capacity and capital**', 'Capacity to 8.3mn; commodity spike from the West Asia conflict; Norton launches; NCRPS redeemed; TVS Credit stake raised to ~86% and a separation explored.', 'Q1: 1.63mn (+28%)', 'Q1: 12.8%', 'Q1 PAT +51% incl. ₹150 cr fair-value gain; ₹1,900 cr returned via NCRPS.'],
    ], source: SRC } },
    { h: 'Corporate actions and their effect on the numbers' },
    { exhibit: { type: 'table', title: 'Corporate actions, 2025-2026', head: ['Date', 'Action', 'Effect'], wide: [1, 2], rows: CA.map(a => [a.date, a.t,
      /NCRPS/.test(a.t) ? 'Debt of ₹1,899 cr at Mar-26 (6% coupon in finance cost); equity count unchanged at 47.51 cr shares; cash out on redemption.'
        : /Sundaram Auto/.test(a.t) ? 'FY25 restated; small revenue and profit addition (components).'
          : /TVS Credit/.test(a.t) ? 'Raises the share of TVS Credit value attributable to TVS Motor shareholders.'
            : /Rapido/.test(a.t) ? 'One-off cash inflow; gain mostly through reserves.'
              : /dividend/i.test(a.t) ? '16% payout.' : /Chairman/.test(a.t) ? 'Generational handover in the founding family.' : /CARE/.test(a.t) ? 'Lower borrowing cost.' : '–']), source: 'AR FY26; company announcements; Autocar Pro (27-Jul-2026)' } },
    { callout: '**Share count:** 47.51 crore shares of ₹1 throughout; no equity issue, split or bonus equity since FY21. The 2025 bonus was in preference shares (debt), so per-share history is clean.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Two-wheelers are back above the 2019 peak; scooters, premium bikes and EVs lead',
  blocks: [
    { p: `India's domestic two-wheeler market took seven years to get back to its FY19 peak of 21.2mn. It fell to 13.5mn in FY22 (BS-VI price increases, COVID, higher insurance costs) and recovered to 21.7mn in FY26, helped in H2 by the September-2025 GST cut. The mix changed on the way: scooters grew 18.5% in FY26 to 8.1mn while motorcycles grew 6.6% to 13.5mn, and premium motorcycles reached 1.83mn. Electric two-wheelers were ~${n1(IND.ev2W.fy26.penetration)}% of registrations in FY26 and ${n1(IND.ev2W.aug26.penetrationAug)}-${n1(IND.ev2W.aug26.penetrationJul)}% in Jul-Aug 2026.` },
    { pair: [
      { type: 'column', title: 'Domestic two-wheelers: a seven-year round trip to a new high', unit: 'Domestic 2W wholesale (mn units)', x: IND.domestic2W.map(r => r.fy), series: [{ name: 'Domestic 2W', values: IND.domestic2W.map(r => Math.round(r.units / 1e4) / 100), fmt: 'n2' }], labels: 'all', source: 'PwC for ACMA (SIAM data, FY20-24); TVS AR FY25-26 (FY19 peak, FY25-26)' },
      { type: 'column', title: 'EV penetration of two-wheelers: 5.8% → 10.5%', unit: 'Electric share of 2W registrations (%)', x: ['FY25', 'FY26', 'Jul-26', 'Aug-26'], series: [{ name: 'EV share', values: [5.8, 6.5, 11.1, 10.5], fmt: 'pct' }], labels: 'all', source: 'Autocar Pro / Vahan (13-Apr and 1-Sep-2026)' },
    ] },
    { pair: [
      { type: 'hbar', title: 'FY24 domestic market shares: TVS was #3', unit: 'Share of domestic 2W wholesale, FY24 (%)', x: ['Hero MotoCorp', 'Honda', 'TVS Motor', 'Bajaj Auto', 'Others'], series: [{ name: 'Share', values: [30.16, 25.20, 17.56, 12.45, 14.63], fmt: 'pct' }], labels: 'all', highlight: 'TVS Motor', source: 'PwC for ACMA (SIAM data)' },
      { type: 'hbar', title: 'E-2W registrations Apr-Aug 2026: TVS leads, Bajaj close', unit: "Registrations, FY27 to date ('000)", x: ['TVS', 'Bajaj', 'Ather', 'Hero Vida', 'Ola'], series: [{ name: 'Units', values: [235, 205, 148, 99, 72], fmt: 'num' }], labels: 'all', highlight: 'TVS', source: 'Vahan via Nuvama, Autocar Pro (1-Sep-2026)' },
    ] },
    { h: 'What drives the next three years' },
    { bullets: [
      '**GST 2.0 (from 22-Sep-2025):** an ~8% price cut on bikes and scooters up to 350cc; bikes above 350cc moved to 40%. Industry H2FY26 growth was ~20%+; TVS passed the full cut to customers.',
      '**FY27 so far:** TVS says the industry grew 13% (domestic ICE) in Q1 and will grow "double digits" in FY27; CRISIL (quoted in the AR) expected 7-9% including exports. From Q3FY27 the comparison base includes the GST jump.',
      '**EVs:** PM E-DRIVE support was extended to Mar-2028 but is small (₹2,500/kWh, ₹5,000 cap). Rare-earth magnet curbs (from Apr-2025) showed the supply risk. A draft Delhi policy would stop ICE two-wheeler sales from 2028.',
      '**Exports:** India shipped 4.2mn two-wheelers in FY25 (+22%); Africa recovered from its 2022-24 currency crises; TVS grew 31% in FY26 vs 12% for the industry.',
      '**Headwinds:** commodity costs (3-5% of revenue in early FY27), an El Niño risk to rural incomes, and rising competition in EVs and 125cc+ scooters.',
    ] },
  ],
};

module.exports = { business, history, industry };
