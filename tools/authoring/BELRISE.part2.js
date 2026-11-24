// Belrise Industries report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./BELRISE.ctx');
const { C, D, A26, A25, n0, n1, pc } = X;
const pctOf = (v, t) => `${n1(v / t * 100)}%`;
const g = (a, z) => pc((z / a - 1) * 100);

const business = {
  id: 'business', nav: 'What Belrise does', kicker: 'The business', title: 'A metal-bashing, robot-heavy supplier to two-wheeler makers, plus a trading arm',
  blocks: [
    { p: `Belrise cuts, bends, presses, welds, coats and assembles steel into parts that hold a vehicle together: two-wheeler chassis (frames), exhaust systems, fuel tanks, stands, body-in-white (BIW) panels, and for cars and trucks high-tensile chassis members and cross-car beams. It also moulds plastic parts (fenders, cowls), and has started proprietary products: shock absorbers and front forks, steering columns, brakes and filters. ${C.profile.facilities}. It sells to ${C.profile.customers.split(';')[0]}; exports are only ${C.profile.exportsPctMfg.FY26}% of manufacturing revenue. Management stresses that ${C.profile.powertrainAgnosticPct.FY26}% of manufacturing revenue is "powertrain-agnostic" (a chassis is needed whether the bike is petrol or electric); exhausts and fuel tanks (~25%) are not.` },
    { exhibit: { type: 'table', title: 'Where the FY26 revenue came from (₹ crore)', head: ['', 'FY25', 'FY26', 'Growth', 'Share of total'], rows: [
      ['Two- and three-wheelers', n0(A25.twoThreeW), n0(A26.twoThreeW), g(A25.twoThreeW, A26.twoThreeW), pctOf(A26.twoThreeW, A26.revenue)],
      ['Passenger vehicles', n0(A25.pv), n0(A26.pv), g(A25.pv, A26.pv), pctOf(A26.pv, A26.revenue)],
      ['Commercial vehicles', n0(A25.cv), n0(A26.cv), g(A25.cv, A26.cv), pctOf(A26.cv, A26.revenue)],
      ['Others (aerospace, defence, renewables, subsidy)', n0(A25.others), n0(A26.others), g(A25.others, A26.others), pctOf(A26.others, A26.revenue)],
      { hl: true, cells: ['**Manufacturing revenue**', `**${n0(A25.manufacturing)}**`, `**${n0(A26.manufacturing)}**`, `**${g(A25.manufacturing, A26.manufacturing)}**`, `**${pctOf(A26.manufacturing, A26.revenue)}**`] },
      ['Trading of goods', n0(A25.trading), n0(A26.trading), g(A25.trading, A26.trading), pctOf(A26.trading, A26.revenue)],
      { hl: true, cells: ['**Revenue from operations**', `**${n0(A25.revenue)}**`, `**${n0(A26.revenue)}**`, `**${g(A25.revenue, A26.revenue)}**`, '**100%**'] },
      ['EBITDA margin: manufacturing / trading', `${n1(A25.mfgEbitda / A25.manufacturing * 100)}% / ${n1(A25.tradingEbitda / A25.trading * 100)}%`, `${n1(A26.mfgEbitda / A26.manufacturing * 100)}% / ${n1(A26.tradingEbitda / A26.trading * 100)}%`, '', ''],
    ], source: 'Q4FY26 deck p8-10, 16; trading EBITDA = total less manufacturing EBITDA' } },
    { callout: '**What the trading arm is:** management describes it as business "largely from the African, Asian and Middle Eastern regions" (Q1FY27 call). It earns a ~5% EBITDA margin on ₹1,775 cr of revenue, needs working capital, and is not what investors are paying for; it is a fifth of revenue and ~8% of EBITDA. We keep it separate in our model.' },
  ],
};

const CA = C.corporateActions;
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Thirty years as a family supplier to one big customer; in eighteen months: IPO, five acquisitions, a promoter merger and a QIP',
  blocks: [
    { p: 'Shrikant Badve built the business (as Badve Engineering) around one large two-wheeler customer; the MD said on the Q4FY26 call that the company was once "almost entirely dependent on a single customer". Diversification came through new customers (four added in FY25-26), cars and trucks, and purchases. The pace has picked up sharply since the IPO: H-One India (Mar-2025), Chester Hall and SDM (aerospace, FY26), Hyva\'s tipper business (signed Aug-2026), and the merger of two promoter-owned companies that supply the same customers.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact'], wide: [1, 2], rows: [
      ...CA.map(([d, t]) => [d.length > 7 ? X.sd(d) : d, t.split(':')[0], t.includes(':') ? t.slice(t.indexOf(':') + 1).trim() : '']),
    ], source: 'Company decks and filings as listed in company.json (scheme filing 31-Jan-2026; QIP filing 17-Jul-2026; Hyva BTA 4-Aug-2026)' } },
    { callout: `**The merger, in numbers.** Belrise will issue 4.72 cr shares (4.9% of the post-QIP count) to the Badve family for Badve Autocomps (FY25 revenue ₹1,421 cr, EBITDA 13.2%, PAT ₹79 cr) and Eximius Infra Tech (₹696 cr incl. subsidy, PAT ₹33 cr). At ₹${n0(X.price)} a share that is ~₹${n0(X.MG.shares * X.price)} cr, ${n1(X.mergerPe)}x their FY25 profit, against Belrise\'s own ${n1(X.price / (X.trailEps))}x trailing P/E: cheap for minorities if the profit is real and arm\'s-length. It also ends related-party purchases from these companies. Exchanges gave no adverse observations on 4-Jul-2026; NCLT approval was pending on our date, so it is not in our base numbers (see valuation).` },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Two-wheelers: a mature market lifted by the GST cut; content per vehicle is where suppliers grow',
  blocks: [
    { p: D.industry.summary },
    { bullets: [
      `**Content per vehicle:** ${D.industry.contentPerVehicle}`,
      `**Competition:** ${D.industry.competition}`,
      '**Premiumisation and EVs:** premium bikes need costlier chassis and stainless exhausts; electric two-wheelers keep the chassis and suspension but drop the exhaust and fuel tank (~25% of Belrise\'s manufacturing revenue is ICE-only).',
      '**Pricing:** parts are made to the vehicle maker\'s drawing; steel is passed through "back to back" with a lag of a quarter or so (Q1FY27 call). Suppliers earn a conversion margin, not a material margin.',
      '**Cars and trucks:** lightweighting pushes high-tensile steel (H-One can press up to 1,470 MPa, ~3x what is common in India, per the Q1FY27 call); EV makers are localising body parts.',
    ] },
    { callout: '**So what:** the market Belrise mostly serves grows in single digits over a cycle. A supplier like Belrise grows faster only by adding parts per vehicle and new customers, which it has done; but its biggest customer\'s share of the two-wheeler market now matters as much as the market itself.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the two-wheeler upturn reach Belrise? Partly: it grew 18% in Q1FY27 when the industry grew 20-25%',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Reaches Belrise?', 'Evidence'], wide: [2], rows: [
      ['2W demand after the GST cut', 'Partly', 'Q1FY27 2W/3W revenue +18% vs industry production +20-25%: the OEMs gaining share are those where Belrise was small (Q1FY27 call)'],
      ['Premiumisation', 'Yes', 'Premium chassis ~2.2x the content of a commuter chassis; stainless-steel exhaust plating'],
      ['Electric two-wheelers', 'Mixed', 'Supplies chassis to EV makers (1 of the top 3 and 1 of the top 4, per the deck) but loses the exhaust and fuel tank on every bike that goes electric'],
      ['Car and truck lightweighting', 'Yes, small base', 'PV +37% and CV +35% in FY26; 59-assembly EV localisation order; but cars and trucks are only 13% of manufacturing revenue'],
      ['Defence and aerospace localisation', 'Not yet', 'Two small acquired units and an alliance; "Others" was ₹350 cr in FY26 (4.5% of manufacturing revenue) and includes subsidy income'],
      ['Renewables (solar trackers)', 'From Q4FY27', 'First order: up to ~₹150 cr a year at peak, ramping gradually'],
    ], source: 'Q4FY26 and Q1FY27 decks and calls; GAM Research' } },
    { callout: '**Verdict:** Belrise gets the content and premiumisation tailwinds, and is starting to win at the faster-growing two-wheeler makers. It does not get the full volume upturn while its largest customer loses share, and the newer themes (aerospace, defence, renewables) are too small to move the group for at least two years.' },
  ],
};

module.exports = { business, history, industry, tailwind };
