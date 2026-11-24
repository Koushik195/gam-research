// Info Edge report, part B-2: the story in charts, what Info Edge owns, history and corporate actions.
const X = require('./NAUKRI.ctx');
const { C, F, V, SC, SA, SQ, QL, ann, n0, n1, price, sh, ps, discHist, discNow, discMedAll, discMedRecent, DISC, SOTP, etMv, pbMv, listedMv, UNL, CASH, RECX, REX, OTHX, recPat, histRecPat, recPatSep, reSep, othSep, current, ltv, mcap } = X;

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const qlab = d => `${MON[+d.slice(5, 7) - 1]}-${d.slice(2, 4)}`;
const DH = [...discHist, discNow];
const B = SOTP.base, wf = [B.rec, B.re, B.oth, B.etMv, B.pbMv, B.disc, B.unl, B.cash].map(v => Math.round(ps(v)));
wf.push(wf.reduce((s, v) => s + v, 0));
const Q = q => SQ.find(x => x.q === q), yoy = (a, b) => Math.round((a / b - 1) * 1000) / 10;
const QY = ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], QP = ['Q1FY25', 'Q2FY25', 'Q3FY25', 'Q4FY25', 'Q1FY26'];
const recPatSeries = [...['FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(histRecPat(f))), ...[0, 1, 2].map(i => Math.round(recPat('base', i)))];
const mon = d => d.slice(5, 7) === '08' ? 'Aug' : 'Jul';

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'waterfall', title: 'Our target: Naukri plus the stakes at market less a small discount, plus cash', unit: '₹ per share (base case)', x: ['Recruitment', '99acres', 'Jeevansathi + Shiksha', 'Eternal stake', 'PB Fintech stake', 'Holdco discount', 'Unlisted at book', 'Cash', 'SOTP value'], series: [{ name: '₹/share', values: wf }], fmt: 'num', totalFmt: 'num', source: 'GAM Research; listed stakes at NSE closes on 30-Sep-2026' },
      { type: 'line', title: `The discount on the stakes: a premium until 2025, ${Math.round(discNow.disc)}% now`, unit: 'Discount on the Eternal + PB Fintech stakes (%)', x: DH.map(r => qlab(r.d)), series: [{ name: 'Discount', values: DH.map(r => Math.round(r.disc * 10) / 10), fmt: 'pct' }], labels: 'last', min: -300, max: 60, lines: [{ v: DISC.base, text: `Base ${DISC.base}%: median since Sep-25`, color: '#cf8f1f' }, { v: 0, text: 'No discount' }], source: `GAM Research (Recruitment at ${RECX.base}x forward profit; method in Valuation); Screener.in prices` },
    ] },
    { pair: [
      { type: 'column', title: 'The stakes are now 56% of Info Edge\'s market value', unit: '₹ crore at quarter-end', x: DH.map(r => qlab(r.d)), series: [{ name: 'Eternal + PB Fintech stakes at market', values: DH.map(r => Math.round(r.L)), fmt: 'num' }, { name: 'Info Edge market value', values: DH.map(r => Math.round(r.mc)), fmt: 'num' }], labels: 'none', source: 'Screener.in prices; Info Edge annual reports (shares held)' },
      { type: 'line', title: `What the market pays for Naukri fell from ~90x to ~${Math.round(discNow.impliedRecX)}x`, unit: 'Implied Recruitment P/E on next-year profit (stakes at a 25% discount)', x: DH.map(r => qlab(r.d)), series: [{ name: 'Implied P/E', values: DH.map(r => Math.round(r.impliedRecX * 10) / 10), fmt: 'x' }], labels: 'last', lines: [{ v: RECX.base, text: `Our multiple ${RECX.base}x`, color: '#cf8f1f' }], source: 'GAM Research: market value less stakes (25% discount, JM Financial\'s convention), cash, unlisted, 99acres and Jeevansathi/Shiksha at our EV/sales, ÷ next fiscal year\'s Recruitment profit' },
    ] },
    { pair: [
      { type: 'column', title: 'Recruitment billings accelerated to +17.5% in Q1FY27', unit: 'YoY growth (%)', x: QY, series: [{ name: 'Billings', values: QY.map((q, i) => yoy(Q(q).recBill, Q(QP[i]).recBill)), fmt: 'pct' }, { name: 'Revenue', values: QY.map((q, i) => yoy(Q(q).recRev, Q(QP[i]).recRev)), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 deck data sheet' },
      { type: 'column', title: '99acres is almost at break-even', unit: '99acres segment result (% of revenue)', x: QL, series: [{ name: 'Margin', values: SQ.map(q => Math.round(q.reRes / q.reRev * 1000) / 10), fmt: 'pct' }], labels: 'all', source: 'Q1FY27 deck data sheet (Q4FY26 includes a ₹20.5 cr one-off write-back)' },
    ] },
    { pair: [
      { type: 'column', title: 'Recruitment profit after corporate costs and tax', unit: '₹ crore', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Recruitment profit', values: recPatSeries, fmt: 'num' }], labels: 'all', source: 'Info Edge AR (segment result less unallocated costs, at 25.17% tax); GAM estimates' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; price ₹${n0(price)}`, x: [...current.map(s => `${s.short} (${mon(s.date)}-26)`), 'GAM bear', 'GAM base', 'GAM bull'], series: [{ name: 'Target', values: [...current.map(s => s.tp), SC.bear.tp, V.tp, SC.bull.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM base', lines: [{ v: 'P.last', axis: 'x', text: 'Price', color: '#b4232a' }], source: 'ICICI Securities and Motilal Oswal notes (10-11 Aug-2026); press reports (8-Jul-2026); GAM Research' },
    ] },
  ],
};

const business = {
  id: 'business', nav: 'What Info Edge owns', kicker: 'The business', title: 'India\'s job-classifieds monopoly, with a venture portfolio attached',
  blocks: [
    { p: 'Info Edge runs India\'s largest online classifieds businesses. **Naukri.com** is where Indian white-collar hiring happens: 118 mn resumes, ~6.97 lakh live jobs and ~1.46 lakh paying recruiters in FY26. Around it sit NaukriGulf (Gulf hiring), Job Hai (blue-collar), candidate services (Naukri 360, FastForward, AI resume and interview tools), AmbitionBox (company reviews), Hirist (tech hiring) and Zwayam/DoSelect (hiring software). **99acres.com** is the traffic leader in property classifieds; **Jeevansathi.com** a matrimony site (plus the Aisle dating app); **Shiksha.com** a college-discovery site. For many years Info Edge has also invested in start-ups from its balance sheet and through venture funds (AIFs) it manages; two of those investments, Zomato (now Eternal) and Policybazaar (PB Fintech), became large listed companies.' },
    { exhibit: { type: 'table', title: 'What Info Edge owns (values at 30-Sep-2026)', head: ['Holding', 'What it is', 'Stake', 'Value (₹ cr)', '₹ / share', 'How we value it'], wide: [1, 5], rows: [
      ['**Recruitment**', `Naukri and related brands; FY26 revenue ₹${n0(ann('FY26').recRev)} cr, segment result ₹${n0(ann('FY26').recRes)} cr (57%)`, '100%', n0(B.rec), n0(ps(B.rec)), `${RECX.base}x Sep-28E profit after corporate costs (₹${n0(recPatSep('base'))} cr)`],
      ['**99acres**', `Real-estate classifieds; FY26 revenue ₹${n0(ann('FY26').reRev)} cr, loss ₹${n0(-ann('FY26').reRes)} cr`, '100%', n0(B.re), n0(ps(B.re)), `${REX.base}x Sep-28E revenue (₹${n0(reSep('base'))} cr)`],
      ['**Jeevansathi + Shiksha**', `Matrimony and education; FY26 revenue ₹${n0(ann('FY26').othRev)} cr`, '100%', n0(B.oth), n0(ps(B.oth)), `${OTHX.base}x Sep-28E revenue`],
      ['**Eternal (Zomato, Blinkit)**', 'Food delivery and quick commerce; Info Edge is the largest shareholder', '12.43%', n0(etMv), n0(ps(etMv)), `Market price ₹${X.etPx.toFixed(2)}`],
      ['**PB Fintech (Policybazaar)**', 'Online insurance and credit marketplace', '12.12%', n0(pbMv), n0(ps(pbMv)), `Market price ₹${X.pbPx.toFixed(2)}`],
      ['Unlisted start-ups, AIFs, strategic subsidiaries', '~135 companies (Adda247, Shipsy, Unnati, NoPaperForms...); Aisle, Coding Ninjas, Zwayam, DoSelect', 'Various', n0(UNL), n0(ps(UNL)), 'Book value (Info Edge\'s share)'],
      ['Cash', 'Bank deposits and debt funds, incl. wholly owned subsidiaries (Jun-2026)', '–', n0(CASH), n0(ps(CASH)), 'At book'],
      { hl: true, cells: ['**Look-through value before any discount**', '', '', `**${n0(ltv)}**`, `**${n0(ps(ltv))}**`, `vs price ₹${n0(price)}`] },
    ], source: 'Info Edge AR FY26, Q1FY27 deck, NSE closes on 30-Sep-2026, GAM Research' } },
    { p: `Two numbers frame the stock. First, **the two listed stakes are worth ₹${n0(ps(listedMv))} a share, ${Math.round(listedMv / mcap * 100)}% of the ₹${n0(price)} price**, and cash adds ₹${n0(ps(CASH))}. Second, what is left for the operating businesses (~₹${n0(ps(mcap - listedMv - CASH - UNL))} a share, or ~${n1((mcap - listedMv - CASH - UNL - B.re - B.oth) / recPatSep('base'))}x our Sep-28E Recruitment profit if the stakes are at full market value) is low for a business with a 57% segment margin and no competitor of similar scale. The stock is cheap on Naukri only if the market should not discount the stakes, and the market has discounted them since early 2026.` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: from a job board to India\'s most successful internet investor',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['Nov-2006', 'Info Edge lists (company incorporated 1995)', 'Recruitment is still ~74% of standalone revenue; 99acres, Jeevansathi and Shiksha lost money for most of FY22-26'],
      ['Aug-2020', 'QIP: 60.7 lakh shares at ₹3,090 (pre-split), ₹1,875 cr', '₹1,007 cr still unused at Jun-2026, held in deposits and debt funds'],
      ['Jul-2021', 'Zomato IPO: Info Edge sells 4.93 cr shares for ₹375 cr; the rest is fair-valued', '₹8,941 cr exceptional gain (FY22); consolidated EPS ₹198 in FY22'],
      ['Nov-2021', 'PB Fintech IPO', 'Stake held directly and through the Makesense joint venture'],
      ['FY23', 'Write-downs of start-ups; Sunrise Mentors (Coding Ninjas) becomes a subsidiary', 'Consolidated loss in FY23; ₹673 cr written off or provided for by Mar-2023'],
      ['FY26', 'Five-for-one share split; Makesense merged into PB Fintech (NCLT approval 29-Aug-2025)', '₹5,200 cr exceptional fair-value gain (standalone PAT ₹5,536 cr); Info Edge holds 5.75 cr PB shares'],
      ['Jul-2026', 'Remaining 45.36% of Sunrise Mentors bought for ₹40 cr; Shopkirana stake swapped into Trustroot Internet shares', 'Coding Ninjas 100% owned'],
      ['7-8 Jul-2026', 'Q1FY27 business update: billings +14.4%', 'Share price +19% in two sessions; Citi upgrades to Buy, JM Financial to Buy'],
    ], source: 'Info Edge AR FY22, FY23, FY26; Q1FY27 results; press reports (8-Jul-2026)' } },
    { callout: '**Why this matters for the numbers:** every few years an investee lists, merges or is written down, and the accounts book a large gain or loss. Reported EPS has gone ₹22 (FY21) → ₹198 → loss → ₹8.9 → ₹14.9 → ₹22.4. None of that is the operating business. We forecast no fair-value gains and value the stakes at market instead.' },
  ],
};

module.exports = { narrative, business, history };
