// ONGC report, part B-4: competitive advantage, Q1FY27 and guidance, earnings quality, ownership, management & governance.
const X = require('./ONGC.ctx');
const { C, D, SQ, n0, n1, coreNorm, coreRep, EXC } = X;
const Q1 = C.q1fy27, G = C.guidance, O = D.ownership, Q = q => SQ.find(x => x.q === q);
const yoy = (a, b) => `${a >= b ? '+' : '−'}${n1(Math.abs(a / b - 1) * 100)}%`;

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: incumbency and acreage, not pricing power',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard', head: ['Source', 'Evidence', 'Strength'], wide: [1], rows: [
      ['Acreage and reserves', '518 MMtoe of 1P reserves (FY26) in nomination fields held for decades; 73% of India\'s crude', 'GREEN'],
      ['Offshore infrastructure and know-how', 'Platforms, pipelines and processing in the Western Offshore that no rival can replicate; BP as technical partner', 'GREEN'],
      ['Cost position', 'Opex ₹28,209 cr in FY26 on ~39 MMTOE: low cost per barrel, but rising with ageing fields and dollar-linked services', 'AMBER'],
      ['Pricing power', 'None on crude (Brent); capped on old-well gas; the state sets royalty, cess and windfall tax', 'RED'],
      ['Reserve replacement and growth', 'Own-field output flat or down since FY22; KG-98/2 oil below plan; growth relies on gas projects and deepwater exploration', 'AMBER'],
      ['Cost of capital', 'State-owned and debt-light (borrowings ₹7,823 cr against ₹28,660 cr of cash at Mar-2026)', 'GREEN'],
    ], source: 'ONGC AR FY26; Q1FY27 call; GAM Research' } },
    { callout: `**Verdict:** ${D.moat} We score the moat AMBER: durable assets, no control over the price of what they produce.` },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: a record quarter on price; volumes still slipping',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (standalone, ₹ crore)', head: ['', 'Q1FY26', 'Q4FY26', 'Q1FY27', 'YoY'], rows: [
      ['Revenue', n0(Q('Q1FY26').rev), n0(Q('Q4FY26').rev), n0(Q('Q1FY27').rev), yoy(Q('Q1FY27').rev, Q('Q1FY26').rev)],
      ['EBITDA', n0(Q('Q1FY26').ebitda), n0(Q('Q4FY26').ebitda), n0(Q('Q1FY27').ebitda), yoy(Q('Q1FY27').ebitda, Q('Q1FY26').ebitda)],
      ['EBITDA margin', `${n1(Q('Q1FY26').ebitda / Q('Q1FY26').rev * 100)}%`, `${n1(Q('Q4FY26').ebitda / Q('Q4FY26').rev * 100)}%`, `${n1(Q('Q1FY27').ebitda / Q('Q1FY27').rev * 100)}%`, ''],
      ['Crude realisation (US$/bbl)', Q1.crudeRealisationPyUsd, Q1.crudeRealisationPqUsd, Q1.crudeRealisationUsd, yoy(Q1.crudeRealisationUsd, Q1.crudeRealisationPyUsd)],
      ['New-well gas (US$/mmBtu)', Q1.nwgPyUsd, '–', Q1.nwgUsd, yoy(Q1.nwgUsd, Q1.nwgPyUsd)],
      ['Dry-well write-offs', '–', n0(Q1.dryWellWriteOffPqCr), n0(Q1.dryWellWriteOffCr), ''],
      { hl: true, cells: ['**Net profit**', `**${n0(Q('Q1FY26').pat)}**`, `**${n0(Q('Q4FY26').pat)}**`, `**${n0(Q('Q1FY27').pat)}**`, `**${yoy(Q('Q1FY27').pat, Q('Q1FY26').pat)}**`] },
      ['Memo: consolidated PAT (owners\' share)', '–', '–', `${n0(Q1.consolidatedPatCr)} (${n0(Q1.consolidatedPatOwnersCr)})`, 'HPCL lost ₹' + n0(Q1.hpclNetLossCr) + ' cr'],
    ], source: 'Screener.in (standalone); Q1FY27 results (4-Aug-2026), call (5-Aug-2026), JM and PL notes' } },
    { p: `Volumes went the other way: own-field crude ~${Q1.crudeProdOwnMmt} MMT (−5% YoY) and gas ~${Q1.gasProdOwnBcm} BCM (−2%), with gas sales only ${Q1.salesToProductionGasPct}% of production as some customers could not take gas. Management blamed temporary factors: reservoir problems at KG-98/2, monsoon swell delaying Western Offshore pipeline work, wells shut while new platforms were hooked up, and customer outages.` },
    { exhibit: { type: 'table', title: 'What management guided (5-Aug-2026 call), and what we assume', head: ['Item', 'Guidance', 'Our assumption'], wide: [1, 2], rows: [
      ['Production', G.production, 'Crude sold 18.4 / 18.9 / 19.1 MMT; gas sold 15.2 / 16.0 / 16.4 BCM (FY27-29E)'],
      ['Gas projects', G.gasProjects, 'Gas volumes +5% in FY28E'],
      ['KG-98/2 oil', G.kg982Oil, 'No recovery assumed'],
      ['Capex', G.capex, '₹35,000-37,500 cr of spend a year'],
      ['ONGC Videsh', G.ovl, 'Valued from broker values (₹7-23 a share)'],
      ['Oil price', G.longRunOil, 'Brent US$90.5 (FY27E), US$69.5 (FY28E), US$70 (FY29E), on the EIA path'],
    ], source: 'Q1FY27 call; GAM Research' } },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean, but full of one-offs the state creates',
  blocks: [
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'What happened', 'Effect on the numbers', 'Flag'], wide: [1, 2], rows: [
      ['Exceptional items', `FY23 ₹${n0(-EXC.FY23)} cr charge (restated); FY20 ₹${n0(-EXC.FY20)} cr charge; FY21 ₹${n0(EXC.FY21)} cr gain`, 'Excluded from core profit', 'AMBER'],
      ['FY22 tax', 'Tax of only ₹734 cr on ₹41,040 cr PBT (deferred-tax write-back on moving to the new tax regime)', `Reported FY22 core profit ₹${n0(coreRep.FY22)} cr vs ₹${n0(coreNorm.FY22)} cr at the 25.17% rate; we use the latter`, 'AMBER'],
      ['Windfall tax in revenue', 'Screener shows revenue net of SAED in FY23-25 (₹23,806 cr in total)', 'Revenue growth and margins in those years are understated', 'Neutral'],
      ['Dry-well write-offs', 'Exploration costs are capitalised, then written off when a well is dry: ₹5,110 cr in Q4FY26 alone', 'Lumpy quarterly profit; a real cost of staying in business', 'AMBER'],
      ['Dividends from stakes in other income', `₹${n0(C.otherIncomeFy26.dividendsCr)} cr in FY26, largely tax-free (s.80M)`, 'Stripped out of the core profit we capitalise (the stakes are valued separately)', 'Neutral'],
      ['Cash conversion', 'CFO ₹69,272 cr vs EBITDA ₹61,722 cr in FY26 (write-offs are non-cash)', 'Profit is cash', 'GREEN'],
      ['Contingent liabilities', 'Panna-Mukta-Tapti arbitration ~₹15,216 cr; ONGC did not join at the ministry\'s request', 'Not provided for', 'AMBER'],
    ], source: 'ONGC AR FY26 ten-year table and notes; Screener.in; Q1FY27 call' } },
    { callout: '**Our accounting flag is AMBER.** Nothing is hidden, but reported profit is regularly moved by policy (windfall tax, royalty), tax-regime effects and impairments. In this report "core profit" is standalone profit before exceptional items and before dividends from the stakes, taxed at 25.17%.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns ONGC (categories Jun-2026; named holders Mar-2026)', head: ['Holder', '% of shares', 'Note'], wide: [2], rows: [
    ['**President of India (promoter)**', `${O.promoter}%`, 'Ministry of Petroleum & Natural Gas'],
    ['LIC', '10.18%', 'State-owned insurer (Mar-2026)'],
    ['Indian Oil / GAIL', '7.84% / 2.45%', 'State-owned companies; Screener groups them as "Government" (10.3%)'],
    ['Domestic institutions (incl. LIC)', `${O.dii}%`, 'ICICI Prudential Value Fund 1.79%, SBI Nifty 50 ETF 1.79%, CPSE ETF 1.25%'],
    ['Foreign institutions', `${O.fii}%`, 'Up from 6.98% in Sep-2025'],
    ['Public', `${O.public}%`, '27.4 lakh shareholders'],
  ], source: 'BSE shareholding pattern via Screener.in (Jun-2026); ONGC AR FY26 (top ten, 31-Mar-2026)' } },
  { p: O.note },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: competent operators, short tenures, and the state as the real decision-maker',
  blocks: [
    { p: `${C.governance.cmd}. ${C.governance.cfo}. ONGC is a central public-sector enterprise: the Ministry of Petroleum appoints its board and its executives, and directives on investments (HPCL, OPaL), arbitration (Panna-Mukta-Tapti) and pricing come from government.` },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Evidence', 'Score'], wide: [1], rows: [
      ['Disclosure', 'Detailed quarterly volumes, realisations and a transcript; good AR data', 'GREEN'],
      ['Leadership continuity', 'Chairman on one-year contract extensions; Director (Finance) new from Jun-2026', 'AMBER'],
      ['Board independence', 'Directors appointed by the ministry; the AGM notice says the board recommended director reappointments "in the absence of" a Nomination and Remuneration Committee', 'RED'],
      ['Minority interests', 'State-directed acquisitions; ONGC stood aside from an arbitration worth ~₹15,216 cr at the ministry\'s informal request', 'RED'],
      ['Shareholder returns', 'Rising dividend every year since FY21; 51% payout in FY26', 'GREEN'],
      ['Accounting', 'Clean audits; one-offs clearly disclosed', 'GREEN'],
    ], source: 'ONGC AR FY26 (AGM notice, board report); Q1FY27 call' } },
    { callout: '**Verdict:** honest accounts and generous dividends, but minority shareholders should assume that when national and shareholder interests diverge (fuel prices, windfall taxes, rescues), the national interest wins. That is the core of the discount the market applies.' },
  ],
};

module.exports = { moat, guidance, quality, ownership, governance };
