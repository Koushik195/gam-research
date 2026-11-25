// IRCTC report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./IRCTC.ctx');
const { C, D, SA, A26, A25, n0, n1, pc, rup } = X;
const I = D.industry;
const share = (x, t) => n1(x / t * 100) + '%';

const business = {
  id: 'business', nav: 'What IRCTC does', kicker: 'The business', title: 'Four businesses granted by one owner: tickets, food, water and pilgrim trains',
  blocks: [
    { p: 'IRCTC is a Navratna central public-sector enterprise under the Ministry of Railways, 62.4% owned by the Government of India. Almost everything it does depends on a mandate from the Railways. **Internet ticketing**: it is the only authorised online seller of reserved railway tickets and earns a convenience fee per e-ticket (₹10 non-AC / ₹20 AC when paid by UPI, ₹15 / ₹30 by card) plus advertising, agent, payment-gateway and loyalty income. **Catering**: under the 2017 catering policy it runs food on trains and at stations, mostly by licensing the work to private caterers; on prepaid trains (Vande Bharat, Rajdhani, Shatabdi) food is in the fare and IRCTC books the turnover. **Rail Neer**: packaged drinking water at ₹14 a bottle from its own and PPP plants (15 operational in FY22), with profit shared with the Railways. **Tourism**: Bharat Gaurav and state pilgrimage (State Teertha) trains, luxury trains, two Tejas Express trains, packages and air/hotel booking.' },
    { exhibit: { type: 'table', title: 'The businesses, FY26 (₹ crore)', head: ['Business', 'Revenue', 'Share', 'Segment result (margin)', 'How it earns'], wide: [4], rows: [
      ['**Catering**', `**${n0(A26.catRev)}**`, share(A26.catRev, A26.segRev), `${n0(A26.catEbitEx)} (${n1(A26.catMargin)}%)`, 'Licence fees from caterers and stalls; turnover on prepaid trains (paid by the Railways from fares); e-catering commissions'],
      ['**Internet ticketing**', n0(A26.itRev), share(A26.itRev, A26.segRev), `${n0(A26.itEbitEx)} (${n1(A26.itMargin)}%)`, 'Convenience fee (~₹990 cr a year at Q1FY27 run-rate) plus ~₹450-500 cr of non-fee income'],
      ['**Tourism (incl. State Teertha)**', n0(A26.tourRev), share(A26.tourRev, A26.segRev), `${n0(A26.tourEbitEx)} (${n1(A26.tourMargin)}%)`, 'Bharat Gaurav and pilgrimage trains (~40% of tourism), luxury trains, packages, travel bookings'],
      ['**Rail Neer**', n0(A26.rnRev), share(A26.rnRev, A26.segRev), `${n0(A26.rnEbitEx)} (${n1(A26.rnMargin)}%)`, 'Water sold on trains and stations (incl. to IRCTC\'s own catering); profit shared with the Railways'],
      { hl: true, cells: ['**IRCTC (revenue from operations)**', `**${n0(A26.sales)}**`, '', `EBITDA 1,666 (31.9%)`, `After ₹${n0(-A26.elim)} cr of inter-segment sales`] },
    ], source: 'Quarterly segment results summed (via PL Capital); segment results before exceptional items (AR FY26 note 53); Q1FY27 call; Choice (Bharat Gaurav share)' } },
    { exhibit: { type: 'table', title: 'Scale and reach', head: ['', 'Detail'], wide: [1], rows: [
      ['Tickets', '13.27 crore tickets in Q1FY27 (14.58 lakh a day); 88.9% of reserved tickets booked online; ~53-54% via the RailConnect app, ~17% the website, ~28% agents and OTAs'],
      ['Meals', '~18 lakh meals a day; e-catering ~1.7 lakh a day; catering on all 81 Vande Bharat trains'],
      ['Water', 'Installed capacity 17.77 lakh bottles a day; supply ~15.5 lakh; demand above that'],
      ['New lines', 'iPay (payment aggregator; RBI licence pending), unified travel portal, e-pantry (50+ trains), Tejas naming rights, e-ticketing for Lakshadweep, Andaman and the Char Dham helicopter service'],
    ], source: 'Q1FY27 and Q4FY26 calls' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'From a railway department to a listed monopoly: IPO, Covid, two OFS sales and one fee scare',
  blocks: [
    { p: 'IRCTC was set up in 1999 to take catering, tourism and online ticketing out of the Railways. The government sold 12.6% in the Oct-2019 IPO, 20% in Dec-2020 and 5% in Dec-2022, and plans ~5% more in FY27. Each sale and each policy move mattered more to the share price than the quarterly numbers: the stock rose ~17x from its split-adjusted IPO price (₹64) to its Oct-2021 peak (~₹1,100), fell ~29% intraday when the Railways ordered a fee share, and has de-rated steadily since FY25.' },
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'What', 'Impact'], wide: [1, 2], rows: C.history.map(h => [h.when, rup(h.what), rup(h.impact)]), source: 'Company filings and press as cited in the research file (Business Standard, Business Today, Free Press Journal, sahi.com)' } },
    { exhibit: { type: 'table', title: 'Reported EPS and exceptional items (₹)', head: ['', 'FY23', 'FY24', 'FY25', 'FY26'], rows: [
      ['Reported EPS', '12.57', '13.89', '16.44', '17.42'],
      ['Exceptional items (₹ crore, pre-tax)', '+27', '−59', '+48', '+17'],
      ['EPS before exceptional items (approx.)', ...[2023, 2024, 2025, 2026].map(y => n1(X.epsClean[y]))],
    ], source: 'Screener.in; Q4FY26 call (FY25 ₹48 cr legacy write-back); AR FY26' } },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Rail travel grows ~8% a year; online booking is already saturated; the money is in what passengers eat and where they go',
  blocks: [
    { p: rup(`${I.railways} ${I.passengers}`) },
    { bullets: [
      `**RailOne.** ${rup(I.railOne)}`,
      `**Catering.** ${rup(I.catering)}`,
      `**Travel and pilgrimage.** ${rup(I.travel)}`,
      '**Payments.** UPI is now 51% of IRCTC tickets (48.7% a year earlier). It is cheaper for passengers, so each shift lowers the fee IRCTC earns per ticket; iPay is IRCTC\'s attempt to keep payment economics in-house.',
    ] },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does India\'s rail-travel boom reach IRCTC? In revenue, yes; in profit, much less',
  blocks: [
    { exhibit: { type: 'table', title: 'Four tailwinds, tested', head: ['Tailwind', 'Evidence it is real', 'Does it reach IRCTC?', 'Catch'], wide: [1, 3], rows: [
      ['More passengers and premium trains', '~8% passenger growth; 81 Vande Bharat trains, ~20 sleepers coming', 'Yes: catering +34% in Q1FY27, licence fee ~₹6 cr per new train', 'Prepaid catering earns ~10% and pays GST without input credit'],
      ['Digital ticketing', '89% of reserved tickets online', 'Already captured', 'No more share to gain; fee not raised for ~seven years; UPI lowers it'],
      ['Domestic and pilgrimage tourism', 'Tourism +19.5% in FY26; Bharat Gaurav trains', 'Yes: target >₹1,000 cr in FY27', '11-14% margins; lumpy state contracts'],
      ['Digital payments and platforms', 'iPay, unified portal, loyalty cards (+200%)', 'Not yet: non-fee income fell 8% in Q1FY27', 'Needs an RBI licence and a better app; RailOne competes for the front-end'],
    ], source: 'Company calls; GAM Research' } },
    { callout: `**Verdict:** the tailwind is real and IRCTC is its gatekeeper, but it reaches the low-margin businesses. From FY23 to FY26 segment revenue grew ${pc((A26.segRev / SA[0].segRev - 1) * 100)} while segment profit before exceptional items grew ${pc((A26.segEbitEx / SA[0].segEbitEx - 1) * 100)}; ticketing, the high-margin part, grew ${pc((A26.itRev / SA[0].itRev - 1) * 100)}. Unless the Railways raise the fee, more travel mostly means more catering turnover.` },
  ],
};

module.exports = { business, history, industry, tailwind };
