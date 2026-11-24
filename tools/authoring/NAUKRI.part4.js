// Info Edge report, part B-4: competitive advantage, earnings quality, ownership and governance.
const X = require('./NAUKRI.ctx');
const { C, D, A, SA, ann, n0, n1, price, sh } = X;
const O = D.ownership, Cat = O.categories, m = (a, b) => Math.round(a / b * 1000) / 10;
const b = A.labels.length - 1;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Naukri has a wide moat; the other verticals do not (yet)',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard', head: ['Source of advantage', 'Verdict', 'Evidence'], wide: [2], rows: D.moat.map(r => [r.item, `**${r.verdict}**`, r.evidence]), source: 'Q1FY27 deck and call; Info Edge AR FY23 and FY26; GAM Research' } },
    { p: `**Verdict.** Naukri has a real and wide moat: network effects (the most candidates attract the most recruiters, and the reverse), paid-in-advance subscriptions, a ${m(ann('FY26').recRes, ann('FY26').recRev)}% segment margin and no competitor of similar scale in Indian white-collar hiring after decades. LinkedIn is the closest threat at the premium end. 99acres has scale in traffic but not yet in profit; Jeevansathi is a distant challenger and Shiksha's model is being undermined by AI search. The moat is in one business, and that business is ~74% of standalone revenue and all of its profit.` },
    { callout: '**What would break the moat:** a shift in how hiring happens (AI agents sourcing candidates across the open web and social networks; companies hiring through their own platforms) rather than a rival job board. Management argues that owning both sides of the marketplace and the resume data makes Naukri stronger in an AI world, and so far the numbers agree: billings accelerated in Q1FY27 and AI products are selling.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean cash business, noisy reported profit (AMBER)',
  blocks: [
    { exhibit: { type: 'table', title: 'Accounting checks', head: ['Check', 'Finding', 'Flag'], wide: [1], rows: [
      ['Cash conversion', 'Consolidated CFO ₹1,076 cr vs EBITDA ₹1,186 cr in FY26 (91%); customers pay up front (deferred revenue ₹1,498 cr standalone)', 'GREEN'],
      ['Fair-value gains in profit', `Consolidated other income ₹1,099 cr in FY26 (Screener), of which ₹821 cr is classed as exceptional, mostly AIF fair-value gains; standalone exceptional gain ₹5,168 cr on the Makesense/PB Fintech merger`, 'AMBER'],
      ['Gains and losses through OCI', 'Eternal and PB Fintech changes go through other comprehensive income (OCI): +₹4,863 cr in Q1FY27, −₹6,986 cr in Q4FY26; they never pass the P&L', 'Note'],
      ['Write-downs', '₹72 cr provision on an investee in Q1FY27; ₹673 cr written off or provided for by Mar-2023', 'AMBER'],
      ['Minorities', 'Outside investors in the AIFs took ₹313 cr of FY26 profit; reported "Net Profit" on Screener is before them', 'Note'],
      ['Auditor', 'S.R. Batliboi & Associates (EY network); unmodified review report on Q1FY27', 'GREEN'],
      ['Tax', 'FY26 tax 33% of PBT incl. deferred tax on fair-value gains; standalone tax on operating profit ~25%', 'GREEN'],
    ], source: 'Q1FY27 results (notes 4, 7, 9); Info Edge AR FY23 and FY26; Screener.in' } },
    { callout: '**So what:** the operating business is as clean as Indian listed companies get: cash in advance, little capital, no debt. The noise comes from the investments. Use standalone EPS before exceptional items (₹17.04 in FY26) or our Recruitment profit, not reported consolidated EPS, and treat every fair-value gain as non-recurring.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns Info Edge (30-Jun-2026)', head: ['Holder', '% of shares', 'Note'], wide: [2], rows: [
    ['**Promoter group** (founders Sanjeev Bikhchandani and Hitesh Oberoi, family, Endeavour Holding Trust)', `${Cat.Promoters}%`, 'Sanjeev Bikhchandani 24.06%, Endeavour Holding Trust 6.22%, Hitesh Oberoi 4.94% (Mar-2026)'],
    ['Domestic institutions', `${Cat.DIIs}%`, 'Up from 18.4% in Jun-2025; ICICI Prudential Large & Mid Cap Fund 6.23%, LIC 3.75%, UTI Flexi Cap 2.33% (Mar-2026)'],
    ['Foreign institutions', `${Cat.FIIs}%`, 'Down from 33.0% in Jun-2025; Nalanda 2.83%, Government of Singapore 2.76%, Norway\'s GPFG 1.91% (Mar-2026)'],
    ['Public and others', `${n1(Cat.Public + Cat.Others)}%`, 'Incl. chairman Kapil Kapoor 1.78%, Anil Lall 2.42%, CFO Ambarish Raghuvanshi 1.05% (Mar-2026)'],
  ], source: `${O.src}; ${O.namedSrc}` } },
  { p: 'The register changed in FY26-27: foreign investors cut their holding by about nine points in a year and Indian mutual funds and insurers bought. The founders\' ~37.5% has barely moved. Long-standing executives own meaningful stakes, which aligns them with shareholders.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: founder-led, modestly paid, long-tenured (GREEN)',
  blocks: [
    { exhibit: { type: 'table', title: 'Who runs Info Edge', head: ['Name', 'Role'], wide: [1], rows: C.management.map(p => [p.name, p.role]), source: C.managementSrc } },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Verdict', 'Evidence'], wide: [2], rows: [
      ['Board and chair', 'Good', 'Non-executive chairman (Kapil Kapoor); the founder (Executive Vice-Chairman) and the CEO are executive directors (AR FY26)'],
      ['Pay', 'Good', `Founder and CEO paid ₹3.87 cr and ₹3.78 cr in FY26, ~0.7% of standalone profit before exceptional items`],
      ['Capital allocation', 'Good, with a tail', 'Zomato and Policybazaar created ~₹44,000 cr of value; many smaller bets written off'],
      ['Related parties and structure', 'Watch', 'Venture investing through AIFs that Info Edge controls, with outside investors; strategic subsidiaries consolidated; disclosure of the AIF portfolio is good (company lists and themes) but values are not split by holding'],
      ['Shareholder returns', 'Moderate', 'Dividend payout ~49% of standalone EPS; no buyback; no sale of listed stakes to return cash'],
      ['Accounting and audit', 'Good', 'S.R. Batliboi (EY network); unmodified opinions; separate disclosure of operating and exceptional items'],
    ], source: 'Info Edge AR FY26; Q1FY27 results; GAM Research' } },
    { callout: '**Our read:** a founder-led company (incorporated 1995, the founder still Executive Vice-Chairman), with modest pay, real skin in the game and a strong record of building and investing. The governance question is not integrity but focus: how much of Naukri\'s cash keeps going into new bets, and whether shareholders ever see the value of the stakes other than through the share price.' },
  ],
};

module.exports = { moat, quality, ownership, governance };
