// Info Edge report, part B-3: industry, tailwind test, and one chapter per business (Recruitment, 99acres, Jeevansathi +
// Shiksha and the subsidiaries, the investment portfolio).
const X = require('./NAUKRI.ctx');
const { C, D, F, AS, SA, SQ, QL, ann, n0, n1, price, sh, ps, etMv, pbMv, etPx, pbPx, UNL, P, recPat } = X;
const Q = q => SQ.find(x => x.q === q), m = (a, b) => Math.round(a / b * 1000) / 10;
const QY = ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], QP = ['Q1FY25', 'Q2FY25', 'Q3FY25', 'Q4FY25', 'Q1FY26'];
const yoy = (k, i) => Math.round((Q(QY[i])[k] / Q(QP[i])[k] - 1) * 1000) / 10;
const seg = k => AS.segments.find(s => s.key === k);
const Q1 = C.q1fy27;

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Online classifieds: winner-takes-most markets, now tested by AI',
  blocks: [
    { p: `Classifieds are two-sided marketplaces: job-seekers go where the jobs are and recruiters pay to reach the most candidates, so the leader tends to keep winning. In Indian white-collar hiring that leader is Naukri. ${D.industry.recruitment}` },
    { p: `${D.industry.realEstate} ${D.industry.matrimony} ${D.industry.education}` },
    { exhibit: { type: 'table', title: 'Info Edge\'s position by vertical', head: ['Vertical', 'Position', 'Main rivals', 'FY26 revenue (₹ cr)', 'FY26 segment margin'], rows: [
      ['Recruitment', 'Dominant in white-collar hiring', 'LinkedIn, foundit, Indeed; Apna/WorkIndia (blue-collar)', n0(ann('FY26').recRev), `${m(ann('FY26').recRes, ann('FY26').recRev)}%`],
      ['99acres', 'Traffic leader (web 49%, app 55% time-share, Q1FY27)', 'Housing.com/PropTiger, MagicBricks, NoBroker', n0(ann('FY26').reRev), `${m(ann('FY26').reRes, ann('FY26').reRev)}%`],
      ['Jeevansathi + Shiksha', 'Number 2-3 in matrimony; Shiksha losing search traffic', 'BharatMatrimony, Shaadi.com; other college-discovery sites', n0(ann('FY26').othRev), `${m(ann('FY26').othRes, ann('FY26').othRev)}%`],
    ], source: 'Q1FY27 deck and call; Info Edge AR FY26' } },
    { callout: `**AI is the new question.** ${D.industry.ai} The bear case is different: AI may reduce white-collar hiring itself (IT services hire fewer freshers) and let recruiters source candidates from many places. Q1FY27 does not show that yet: IT/BPM billings grew 15% and GCC billings 31%.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does India\'s hiring and housing cycle reach Info Edge? Yes, with a lag and through pricing',
  blocks: [
    { exhibit: { type: 'table', title: 'The tailwind test', head: ['Tailwind', 'Does it reach Info Edge?', 'Evidence', 'Verdict'], wide: [2], rows: [
      ['White-collar hiring (IT, GCCs, BFSI)', 'Yes, directly: IT/BPM and GCCs were 49% of Recruitment India B2B billings in Q1FY27, other sectors 28%, consultants 24%', 'Billings +9% to +11% a quarter through FY26, +17.5% in Q1FY27 (GCCs +31%)', 'Yes'],
      ['Pricing and AI upsell', 'Yes: higher realisation per customer, AI-Rex, Talent Pulse, candidate services', 'Candidate billings +35% at a 63% margin; AI-Rex at 4,000+ enterprises', 'Yes'],
      ['Housing boom (new launches)', 'Partly: 99acres sells listings and leads to developers and brokers', 'Billings +16.5% in Q1FY27 after +1.9% in Q4FY26; enquiries +38%', 'Partly: monetisation lags traffic'],
      ['Digital advertising growth', 'Weakly: Shiksha depends on search traffic that AI is diverting', 'Shiksha billings −23% in Q1FY27', 'No'],
      ['Start-up valuations', 'Yes, through the stakes (56% of market value)', 'Eternal ₹320, PB Fintech ₹1,064 on 30-Sep-2026', 'Yes, but volatile'],
    ], source: 'Q1FY27 deck and call (14-Aug-2026)' } },
    { p: 'Billings lead revenue by about two quarters (Naukri sells annual subscriptions and recognises them over the year), so the Q1FY27 acceleration shows up in revenue through FY27. Deferred revenue for Recruitment was ₹1,145 cr at Jun-2026, 13% higher than a year earlier.' },
  ],
};

const recruitment = {
  id: 'recruitment', nav: 'Recruitment (Naukri)', kicker: 'Segment', title: 'Recruitment: a 58%-margin near-monopoly, growing faster again',
  blocks: [
    { p: `Recruitment earned a ₹${n0(ann('FY26').recRes)} cr segment result on ₹${n0(ann('FY26').recRev)} cr of revenue in FY26 (${m(ann('FY26').recRes, ann('FY26').recRev)}%). Growth slowed sharply after the FY22-23 IT hiring boom (revenue +46% in FY23, +7.5% in FY24) and recovered to +13.8% in FY26. Q1FY27 was better: billings +17.5%, revenue +${Math.round((Q1.segments.recRev / Q('Q1FY26').recRev - 1) * 100)}%, segment margin ${m(Q1.segments.recRes, Q1.segments.recRev)}% (52.5% a year earlier). By customer, GCCs (+31%) and IT/BPM (+15%) led; recruitment consultants (+1%) lagged. Management says hiring is still mostly replacement-led, with premium hiring growing 25-30% and mid-tier volumes weak.` },
    { pair: [
      { type: 'column', title: 'Billings growth turned up in Q1FY27', unit: 'Recruitment billings and revenue, YoY (%)', x: QY, series: [{ name: 'Billings', values: QY.map((_, i) => yoy('recBill', i)), fmt: 'pct' }, { name: 'Revenue', values: QY.map((_, i) => yoy('recRev', i)), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 deck data sheet' },
      { type: 'line', title: 'Segment margin: 58% in Q1FY27, the best first quarter in the data', unit: 'Recruitment segment result (% of revenue)', x: QL, series: [{ name: 'Margin', values: SQ.map(q => m(q.recRes, q.recRev)), fmt: 'pct' }], labels: 'all', min: 45, max: 65, source: 'Q1FY27 deck data sheet' },
    ] },
    { exhibit: { type: 'table', title: 'Recruitment forecasts', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue (₹ cr)', n0(ann('FY26').recRev), ...F.seg.rec.revenue.map(n0)],
      ['Growth', '13.8%', ...seg('rec').growth.map(g => `${g}%`)],
      ['Segment result (₹ cr)', n0(ann('FY26').recRes), ...F.seg.rec.adjEbitda.map(n0)],
      ['Margin', `${m(ann('FY26').recRes, ann('FY26').recRev)}%`, ...seg('rec').marginPct.map(x => `${x}%`)],
      ['Profit after all corporate costs and 25.17% tax (₹ cr)', n0((ann('FY26').recRes - ann('FY26').unalloc) * (1 - X.T)), ...[0, 1, 2].map(i => n0(recPat('base', i)))],
    ], source: 'Info Edge AR FY26; GAM estimates' } },
    { callout: '**Our view:** Naukri is the best business in Indian internet: a dominant marketplace, paid in advance, with margins that keep rising. The debate is growth, not quality. We assume 12-14.5% revenue growth (billings were +17.5% in Q1) and half a point of margin a year. The risk to that is AI shrinking white-collar hiring, not a competitor.' },
  ],
};

const acres = {
  id: 'acres99', nav: '99acres', kicker: 'Segment', title: '99acres: the traffic leader is finally close to making money',
  blocks: [
    { p: `99acres lost ₹${n0(-ann('FY24').reRes)} cr in FY24, ₹${n0(-ann('FY25').reRes)} cr in FY25 and ₹${n0(-ann('FY26').reRes)} cr in FY26 while Info Edge spent to become the clear traffic leader (web time-share 49%, app 55%, iOS 69% in Q1FY27). Q4FY26 showed a small profit, helped by a one-off ₹20.5 cr write-back; Q1FY27 was close to break-even (loss ₹2 cr against ₹19 cr a year earlier) with billings +16.5%. Management says the investment phase is behind it, expects the business to be cash-generative in FY27 and targets 25-30% margins in the long run. We assume 1.5% / 7% / 12% margins.` },
    { pair: [
      { type: 'column', title: '99acres revenue and billings by quarter', unit: '₹ crore', x: QL, series: [{ name: 'Billings', values: SQ.map(q => q.reBill), fmt: 'num' }, { name: 'Revenue', values: SQ.map(q => q.reRev), fmt: 'num' }], labels: 'none', source: 'Q1FY27 deck data sheet' },
      { type: 'column', title: 'Annual losses have shrunk; we expect profit from FY27E', unit: '99acres segment result (₹ crore)', x: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Segment result', values: [...SA.map(a => Math.round(a.reRes)), ...F.seg.re.adjEbitda.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Info Edge AR; GAM estimates' },
    ] },
  ],
};

const others = {
  id: 'others', nav: 'Jeevansathi, Shiksha, subsidiaries', kicker: 'Segments', title: 'Jeevansathi grows; Shiksha shrinks; the subsidiaries still lose money',
  blocks: [
    { p: `Jeevansathi (revenue ₹38.5 cr in Q1FY27, +14%) has turned profitable after years of losses and is growing billings ~14-28%; the Aisle dating app (a subsidiary) grew billings 44%. Shiksha (₹44 cr, −12%) is losing referred search traffic to AI answers; it stays slightly profitable but billings fell 23%. Outside the standalone company, the subsidiaries (Aisle, Coding Ninjas, Zwayam, DoSelect, 4B Networks) and the venture funds' running costs lost about ₹62 cr at EBITDA in FY26 and ~₹22 cr in Q1FY27. We value Jeevansathi and Shiksha at 2x sales and the subsidiaries at their carrying value; their losses are small next to Naukri's profit.` },
    { exhibit: { type: 'table', title: 'The smaller businesses (₹ crore)', head: ['', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Jeevansathi + Shiksha revenue', ...['FY24', 'FY25', 'FY26'].map(f => n0(ann(f).othRev)), ...F.seg.oth.revenue.map(n0)],
      ['Jeevansathi + Shiksha segment result', ...['FY24', 'FY25', 'FY26'].map(f => n0(ann(f).othRes)), ...F.seg.oth.adjEbitda.map(n0)],
      ['Subsidiaries & eliminations: revenue', ...['FY24', 'FY25', 'FY26'].map(f => n0(ann(f).resRev)), ...F.seg.res.revenue.map(n0)],
      ['Subsidiaries & eliminations: EBITDA', ...['FY24', 'FY25', 'FY26'].map(f => n0(ann(f).resEbitda)), ...F.seg.res.adjEbitda.map(n0)],
    ], source: 'Info Edge AR; Screener.in (consolidated); GAM estimates' } },
  ],
};

const investments = {
  id: 'investments', nav: 'The investment portfolio', kicker: 'Investments', title: `The portfolio: Eternal and PB Fintech are worth ₹${n0(ps(etMv + pbMv))} a share`,
  blocks: [
    { p: `Info Edge holds **119.96 cr Eternal shares (12.43% diluted)**, worth ₹${n0(etMv)} cr at ₹${etPx.toFixed(2)} on 30-Sep-2026 (cost ₹146 cr), and **5.75 cr PB Fintech shares (12.12%)**, worth ₹${n0(pbMv)} cr at ₹${pbPx.toFixed(2)} (cost ₹568 cr). It has not sold either since the IPOs, apart from the 4.93 cr Zomato shares in the 2021 offer for sale. Its nominee (founder Sanjeev Bikhchandani) sits on Eternal's board. The rest of the portfolio (~135 companies across AI, deep-tech, consumer and SaaS themes, ~₹4,900 cr invested including other investors' money in its AIFs) is carried at ₹${n0(UNL)} cr for Info Edge's share. We value it at book: it is ${Math.round(UNL / (price * sh) * 100)}% of the market value and has produced as many write-offs as winners.` },
    { exhibit: { type: 'table', title: 'Sensitivity: each 10% move in the stakes', head: ['', 'Value (₹ cr)', '₹ / Info Edge share', '10% move, ₹ / share (after our discount)'], rows: [
      ['Eternal', n0(etMv), n0(ps(etMv)), n0(ps(etMv) * 0.1 * (1 - X.DISC.base / 100))],
      ['PB Fintech', n0(pbMv), n0(ps(pbMv)), n0(ps(pbMv) * 0.1 * (1 - X.DISC.base / 100))],
    ], source: 'GAM Research; NSE closes on 30-Sep-2026' } },
    { p: 'We do not value Eternal or PB Fintech ourselves here: we take their market prices (we cover Eternal separately: HOLD, target ₹360 as of 30-Sep-2026). The question for Info Edge is the holding-company discount, which we derive in the Valuation chapter.' },
  ],
};

module.exports = { industry, tailwind, recruitment, acres, others, investments };
