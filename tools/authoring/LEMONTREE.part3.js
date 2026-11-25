// Lemon Tree report, part 3: owned hotels (brands, regions, renovation), the fee business, the Fleur scheme, moat.
const X = require('./LEMONTREE.ctx');
const { C, F, SQ, n0, n1, pc, Q1, FY26, MIN_PCT, schemeUpliftPs, wpPre, wpPost, minPs } = X;
const K = C.kpis, PF = C.portfolio, PR = C.proforma, SCH = C.scheme;
const gr = (a, b) => `${a >= b ? '+' : '−'}${Math.abs(Math.round((a / b - 1) * 100))}%`;

const hotels = {
  id: 'hotels', nav: 'The owned hotels', kicker: 'Core business: owned hotels', title: 'The owned hotels: 76% occupancy and ~52% hotel margins, but rates stalled in Q1FY27 and renovation is still running',
  blocks: [
    { p: `Lemon Tree's ${PF.owned.hotels} owned and leased hotels (${n0(PF.owned.rooms)} rooms) earned RevPAR of ₹${n0(Q1.revpar)} in Q1FY27 (${gr(Q1.revpar, Q1.revparPy)}): occupancy rose to ${Q1.occPct}% from ${Q1.occPyPct}%, but ARR only to ₹${n0(Q1.arr)} (${gr(Q1.arr, Q1.arrPy)}), because the company filled rooms through online travel agents and retail channels when corporate demand dropped. Hotel-level EBITDAR margin (before renovation) was 52% (53% a year earlier). Delhi (+13%), Bengaluru (+13%) and Pune (+13%) were strong; Mumbai (−1%) and Gurugram (−3%) were weak, the first because ~2,000 new rooms opened near the airport in two years. The Keys hotels, two-thirds renovated, grew RevPAR 19%; management targets ~₹60 cr of EBITDA from Keys (₹115-120 cr of revenue) once the work is done.` },
    { pair: [
      { type: 'column', title: 'Q1FY27 RevPAR by city: Delhi, Bengaluru and Pune up 13%; Mumbai and Gurugram down', unit: 'RevPAR, owned and leased hotels, Q1 (₹)', x: ['Delhi', 'Gurugram', 'Hyderabad', 'Bengaluru', 'Mumbai', 'Pune', 'Rest of India'], series: [{ name: 'Q1FY26', values: [5203, 3987, 5468, 3623, 6876, 4333, 3201], fmt: 'num' }, { name: 'Q1FY27', values: [5880, 3866, 5691, 4109, 6781, 4905, 3553], fmt: 'num' }], labels: 'none', source: 'Q1FY27 deck slide 14' },
      { type: 'column', title: 'Quarterly revenue: winter is the season', unit: 'Revenue from operations, consolidated (₹ crore)', x: SQ.map(q => q.q), series: [{ name: 'Revenue', values: SQ.map(q => q.consRev), fmt: 'num' }], labels: 'all', source: 'Screener.in' },
    ] },
    { exhibit: { type: 'table', title: 'What weighs on the owned-hotel margin, and when it should fade', head: ['Item', 'FY26', 'Q1FY27', 'What management said'], wide: [3], rows: [
      ['Renovation (expensed)', '~4.2% of revenue', '~₹10 cr for 300 rooms', 'High-value work (₹10-12 lakh a key) mostly done; ~300 rooms left (~₹13-14 cr); opex + capex towards ~1% of revenue from FY28'],
      ['GST: lost input credit below ₹7,500', '~1.0% (half year)', '2.3% of revenue', '~2% in FY27, ~1.7% in FY28 as ARR rises and Aurika grows'],
      ['Technology', '~0.6% of revenue', 'n.d.', 'Generative search, distribution and loyalty'],
      ['Stock appreciation rights (cash-settled)', 'provision', '0.8% of revenue', 'Marked to the share price'],
      { hl: true, cells: ['**Total of renovation, technology and GST**', '**5.8% of revenue**', '**~3.1% (GST + SAR)**', '**~3.7% from FY28 (Q1FY27 deck slide 21)**'] },
    ], source: 'Q4FY26 call; Q1FY27 deck slides 16, 21; Q1FY27 call (10-Aug-2026); ICICI Direct (11-Aug-2026); n.d. = not disclosed' } },
    { callout: '**So what:** the owned hotels are a good mid-market business that has been over-spending on itself for two years. If renovation spend does fall to ~1% of revenue and more rooms sell above ₹7,500, ~2-3 points of margin come back without any growth. The risk is the rate: in Q1FY27 Lemon Tree bought occupancy with price, and mid-market rates depend on corporate budgets and local supply.' },
  ],
};

const fees = {
  id: 'fees', nav: 'The fee business', kicker: 'The growth engine', title: 'The fee business: ₹74 cr of third-party fees growing 23-42% a year, a signed pipeline almost twice today\'s managed rooms',
  blocks: [
    { p: `Lemon Tree charges hotel owners fees for its brands, reservations, loyalty programme (2.5 m members; 45% of demand is repeat) and management. Fees from third-party hotels were ₹${n1(K.FY26.fees3p)} cr in FY26 (+23%) and ₹${Q1.fees3p} cr in Q1FY27 (+42%); fees from Fleur were ₹${n1(K.FY26.feesFleur)} cr and ₹${Q1.feesFleur} cr. Network revenue (all hotels under its brands) was ₹${Q1.networkRevenue} cr in Q1FY27 (+${Math.round((Q1.networkRevenue / Q1.networkRevenuePy - 1) * 100)}%), with managed hotels +29% and owned +6%. Signings have run ahead of openings for three years (~2,000 rooms, then ~3,500, then ${n0(PF.fy26Signings.rooms)} in FY26), and hotels open ~30-36 months after signing, so management expects openings of ~${n0(PF.openingsTargetFy27Keys)} keys in FY27 and ~5,000 around FY29. Lemon Tree on its own (pro-forma) earned a 58.1% EBITDA margin in Q1FY27 before stock-appreciation rights; the long-term target is 75-80%.` },
    { pair: [
      { type: 'column', title: 'Third-party fees: ₹60 cr to ₹160 cr in four years (GAM)', unit: 'Fees from third-party managed and franchised hotels (₹ crore)', x: ['FY25', 'FY26', ...F.years], series: [{ name: 'Fees', values: [K.FY25.fees3p, K.FY26.fees3p, ...X.stream.fees.map(v => Math.round(v))], fmt: 'num' }], labels: 'all', source: 'Q4FY26 call; GAM estimates (+30% / +28% / +30%)' },
      { type: 'column', title: 'Pro-forma Lemon Tree (asset-light) grew 22% in Q1FY27', unit: 'Pro-forma Lemon Tree, Q1 (₹ crore)', x: ['Revenue Q1FY26', 'Revenue Q1FY27', 'EBITDA* Q1FY26', 'EBITDA* Q1FY27', 'PAT Q1FY26', 'PAT Q1FY27'], series: [{ name: '₹ cr', values: [PR.q1fy27.lthRevenuePy, PR.q1fy27.lthRevenue, PR.q1fy27.lthEbitdaPreSarPy, PR.q1fy27.lthEbitdaPreSar, 27.5, PR.q1fy27.lthPat], fmt: 'n1' }], labels: 'all', source: 'Q1FY27 deck slide 47 (*before stock-appreciation rights; includes two leased hotels that stay in Lemon Tree, ~₹20 cr EBITDA a year)' },
    ] },
    { callout: '**So what:** the fee line is small today (~5% of consolidated revenue) but it is the part of Lemon Tree that deserves a high multiple: almost no capital, high margins and visible growth from signed contracts. Our forecasts (+28-30% a year) assume openings broadly on plan. Two cautions: fees per room are lower in tier-3 towns where many new hotels are, and some contracts end (Tarudhan Valley, 70 rooms, terminated in Q1FY27; Nestor, 130 rooms, removed and taken to the NCLT).' },
  ],
};

const scheme = {
  id: 'scheme', nav: 'The Fleur split', kicker: 'Corporate structure', title: 'The Fleur split: Warburg owns 41% of the hotels today; after the scheme Lemon Tree holders own ~74% of Fleur and Lemon Tree is debt-free',
  blocks: [
    { p: `${SCH.steps} ${SCH.status}` },
    { exhibit: { type: 'table', title: 'Who owns Fleur Hotels (the asset owner), before and after the scheme', head: ['Holder', 'Today (since 22-May-2026)', 'After the scheme (before Warburg\'s ₹960 cr)', 'Note'], wide: [3], rows: [
      ['Lemon Tree Hotels', `${SCH.post.before.lthInFleurPct}%`, `${SCH.post.lthInFleurPct}%`, 'Stake falls, but Lemon Tree transfers its own 15 hotels and 2 projects in exchange'],
      ['Lemon Tree\'s shareholders directly', '–', `${SCH.post.publicDirectInFleurPct}%`, '20 Fleur shares for every 311 Lemon Tree shares'],
      ['Warburg Pincus (Coastal Cedar Investments)', `${SCH.post.before.wpInFleurPct}%`, `${SCH.post.wpInFleurPct}%`, 'Rises again if it invests the ₹960 cr (Q1 call: ~36% on a 110-share base)'],
      { hl: true, cells: ['**Lemon Tree shareholders, direct + via Lemon Tree**', `**${SCH.post.before.lthInFleurPct}%**`, `**${(SCH.post.lthInFleurPct + SCH.post.publicDirectInFleurPct).toFixed(2)}%**`, '**Company: attributable EBITDA +8% (₹402 cr → ₹434 cr on FY26)**'] },
    ], source: 'Scheme deck (10-Jan-2026) slides 6-9, 27-28; Q4FY26 call; Q1FY27 deck slide 52; Q1FY27 call' } },
    { exhibit: { type: 'table', title: 'FY26 on the old and new structure (₹ crore)', head: ['', 'Revenue', 'EBITDA', 'Basis'], rows: [
      ['Lemon Tree consolidated (today)', n0(PR.fy26.consRevenue), n0(PR.fy26.consEbitda), 'Company EBITDA incl. other income'],
      ['Fleur Hotels today (58.91% Lemon Tree)', n0(PR.fy26.fleurPreRevenue), n0(PR.fy26.fleurPreEbitda), 'Pre-scheme, after fees to Lemon Tree'],
      ['Fleur Hotels after the scheme', n0(PR.fy26.fleurRevenue), n0(PR.fy26.fleurEbitda), 'Adds 17 hotels; carries all the group\'s debt'],
      ['Lemon Tree after the scheme (asset-light)', n0(PR.fy26.lthRevenue), n0(PR.fy26.lthEbitda), 'Fees + two leased hotels; no debt'],
    ], source: 'Q1FY27 deck slide 52 (FY26 pre-demerger and pro-forma financials)' } },
    { callout: `**How we treat it:** we value the group as it stands on ${X.ASOF_TXT}, because the scheme still needs SEBI, NCLT, shareholder and creditor approval: consolidated EBITDA, less minorities at ${MIN_PCT}% of the equity value (₹${n0(minPs)} a share), less net debt. On its announced terms the scheme cuts Warburg's claim on FY26 EBITDA from ~₹${n0(wpPre)} cr (41.09% of ₹443 cr) to ~₹${n0(wpPost)} cr (26.01% of ₹554 cr) before its primary investment; scaling our minority deduction by that ratio adds ~₹${n0(schemeUpliftPs)} a share. We show it as a sensitivity, not in the target. Warburg's ₹960 cr at "fair value" and Fleur's acquisitions are value-neutral until we know their price and returns.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Moat: cost and distribution leadership in the mid-market; no pricing moat',
  blocks: [
    { verdicts: [
      ['Cost of building and running', 'Strong', 'Hotel-level EBITDAR ~52% at ARR ~₹6,400 (Q1FY27); FY26 operating margin 47.8%, the highest of the listed hotel groups.', 'Earns well even at mid-market rates.'],
      ['Brand and distribution', 'Good', '~6% of India\'s branded rooms (AR FY26); 2.5 m loyalty members, 45% repeat demand; 4,912 rooms signed in FY26.', 'Owners want the brand: the fee pipeline.'],
      ['Scale', 'Good', `${n0(PF.operational.rooms)} operating rooms, ${n0(PF.pipeline.rooms)} signed; largest mid-market chain.`, 'Purchasing, reservations and loyalty spread over more rooms.'],
      ['Pricing power', 'Weak', `ARR +${Math.round((Q1.arr / Q1.arrPy - 1) * 100)}% in Q1FY27; retail discounting to hold occupancy; Mumbai rates fell with new supply.`, 'Mid-market rates follow local supply and corporate budgets.'],
      ['Balance sheet', 'Weak (improving)', 'Net debt incl. leases 2.6x EBITDA; CRISIL A+ on watch; peers net cash.', 'Fleur, not Lemon Tree, will carry this after the scheme.'],
    ], head: ['Source', 'Verdict', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'Q1FY27 deck and call; AR FY26; CRISIL (17-Jul-2026); GAM Research' },
    { callout: '**Honest verdict:** Lemon Tree has a real cost and distribution advantage in a fragmented segment, and its brands are what owners sign for. That is a moat in the fee business. In the owned hotels there is no pricing moat: Q1FY27 showed that when corporate demand weakens, rates give way. The value of the franchise will show up in fee growth, not in rates.' },
  ],
};

module.exports = { hotels, fees, scheme, moat };
