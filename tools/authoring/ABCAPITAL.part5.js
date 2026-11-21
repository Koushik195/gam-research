// Aditya Birla Capital report, part 5: group returns and capital allocation (ROA → ROE tree), moat scorecard, Q1FY27
// and guidance, earnings quality, ownership, management and governance.
const X = require('./ABCAPITAL.ctx3');
const { C, D, SG, F, V, CONS, n0, n1, n2, nbfcRoe, consPatG } = X;
const Q1 = C.consolidated.Q1FY27, sq = SG.segPbt;

const groupReturns = {
  id: 'returns', nav: 'Returns & capital', kicker: 'Returns', title: 'Where the return on equity leaks: the lender earns ~16%, the group ~13%',
  blocks: [
    { exhibit: { type: 'table', title: 'From NBFC ROA to group ROE (FY27E-FY29E)', head: ['', 'FY27E', 'FY28E', 'FY29E', 'What it means'], wide: [4], rows: [
      ['Standalone ROA (on total assets)', '{{F.roa.0|pct}}', '{{F.roa.1|pct}}', '{{F.roa.2|pct}}', 'Lending profit plus the AMC dividend, on all standalone assets'],
      ['Standalone assets ÷ equity (x)', '{{F.assetsToEquity.0|n2}}', '{{F.assetsToEquity.1|n2}}', '{{F.assetsToEquity.2|n2}}', 'Lower in FY27E after the June raise'],
      ['Standalone ROE', '{{F.roe.0|pct}}', '{{F.roe.1|pct}}', '{{F.roe.2|pct}}', 'Held down by ~₹10,000 cr of subsidiaries at cost'],
      ['NBFC-only ROE (ex dividend, ex investments)', `${n1(nbfcRoe[0])}%`, `${n1(nbfcRoe[1])}%`, `${n1(nbfcRoe[2])}%`, 'Company basis 15.1% (FY26), 16.2% (Q1FY27)'],
      ['Consolidated ROE (GAM rebuild)', `${n1(CONS[0].roe)}%`, `${n1(CONS[1].roe)}%`, `${n1(CONS[2].roe)}%`, `Cost of equity ${n1(V.ke)}%`],
    ], source: 'GAM Research; company basis from Q4FY26 and Q1FY27 presentations p7' } },
    { pair: [
      { type: 'column', title: 'Consolidated profit by source, FY27E', unit: 'ABCL\'s share of each business\'s profit (₹ crore), GAM rebuild', x: ['NBFC (ex dividend)', 'Housing finance', 'AMC (44.9%)', 'Life (51%)', 'Health (45.9%)', 'Others'], series: [{ name: 'FY27E', values: Object.values(CONS[0].parts).map(Math.round), fmt: 'num' }], labels: 'all', source: 'GAM Research' },
      { type: 'line', title: 'Group ROE edges up only slowly', unit: 'Consolidated ROE (%), FY27-29E = GAM rebuild', x: ['FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'ROE', values: [14, 12, 12, ...CONS.map(c => Math.round(c.roe * 10) / 10)], fmt: 'pct' }], labels: 'all', min: 8, max: 18, source: 'Screener.in consolidated ROE (FY24-26, incl. one-offs); GAM estimates' },
    ] },
    { p: `**Capital allocation.** In five years ABCL has raised ₹7,000 cr of equity (2023, 2026), sold ~5% of the AMC, brought ADIA into health insurance and Advent into housing finance, and put ₹2,369 cr into subsidiaries in FY26 alone. The money went where returns are highest (the NBFC and HFC); the insurers have absorbed capital for a decade with little cash back. The result is a group ROE stuck near 12-13% while the NBFC earns ~16%. Our FY27-29E consolidated ROE of ${n1(CONS[0].roe)}-${n1(CONS[2].roe)}% assumes the insurers' profits rise and the digital platform's losses shrink.` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a strong parent, a broad shelf, no wide moat',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive advantage scorecard', head: ['Source', 'Score (0-5)', 'Evidence'], wide: [2], rows: [
      ['Funding cost (parentage, AAA)', '4', 'AAA from three agencies; interest cost 6.5% of the lending book, among the lowest for diversified NBFCs'],
      ['Underwriting / asset quality', '3', 'Stage 3 1.3%, credit cost ~1%, but the unsecured book needed an 18-24-month clean-up in FY24-26'],
      ['Distribution and cross-sell', '3', '1,759 branches across businesses, ABG ecosystem, 33% of credit life from group lenders; ABCD app still loss-making (₹264 cr)'],
      ['Scale', '3', 'Top-10 NBFC by AUM, but mid-sized in life insurance and asset management'],
      ['Brand / trust', '4', 'Aditya Birla group name; strong with mass-affluent customers'],
      ['Pricing power', '1', 'NIM flat while the book grew 28%; AMC losing equity share; health insurer still prices below cost'],
    ], source: 'GAM Research' } },
    { callout: '**Verdict:** no wide moat. ABCL\'s edges are cheap funding and the group name; neither stops banks or larger NBFCs from competing on price. The breadth of the shelf is useful for cross-selling but has not yet shown up in returns.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Latest quarter', title: 'Q1FY27: growth everywhere, margins nowhere new',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 by business (₹ crore, PBT at 100% of each business)', head: ['Business', 'Q1FY26', 'Q1FY27', 'YoY'], rows: [
      ...['lending', 'hfc', 'amc', 'life', 'health', 'others'].map(k => [{ lending: 'NBFC', hfc: 'Housing finance', amc: 'AMC', life: 'Life insurance', health: 'Health insurance', others: 'Others' }[k], n0(sq.Q1FY26[k]), n0(sq.Q1FY27[k]), sq.Q1FY26[k] > 0 && sq.Q1FY27[k] > 0 ? `${Math.round((sq.Q1FY27[k] / sq.Q1FY26[k] - 1) * 100)}%` : 'n.m.']),
      ['**Consolidated PAT after minorities**', n0(sq.Q1FY26.pat), n0(sq.Q1FY27.pat), `${Math.round((sq.Q1FY27.pat / sq.Q1FY26.pat - 1) * 100)}%`],
    ], source: 'Q1FY27 presentation p6' } },
    { exhibit: { type: 'table', title: 'What management guided (31-Jul-2026 call)', head: ['Who', 'Guidance'], wide: [1], rows: C.guidance.map(g => [g.who, g.what]), source: 'Q1FY27 earnings call transcript' } },
    { p: `**How our forecasts compare.** We take management at its word on capital (no raise for three years) and on HFC scale (AUM ₹${n0(X.hAum[3])} cr by FY29E), but not on margins: we assume NBFC yields rise only 5bp a year. Our consolidated profit grows ${n1(consPatG)}% in FY27E (Q1 +40% off a low base), helped by the June raise and the HFC.` },
  ],
};

const earningsQuality = {
  id: 'earnings-quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: clean lending profits, noisy group profits',
  blocks: [
    { bullets: [
      '**One-off gains inflate history.** Group profit included a ₹2,739 cr fair-value gain in FY23 (ABHI became a joint venture after ADIA invested) and gains on selling AMC shares of ₹433 cr (FY24) and ₹191 cr (FY25, net of tax). The company\'s "excluding one-offs" profit is ₹2,057 cr / ₹2,902 cr / ₹3,142 cr / ₹3,797 cr for FY23-26; we use these in the P/E history.',
      '**Two accounting bases in insurance.** ABSLI reports statutory (IGAAP) profit, tiny relative to its embedded value; ABHI moved to IFRS from April 2026 and restated FY26. Neither is a good guide to value, which is why we use EV and premium multiples.',
      '**Restated standalone history.** The merger was accounted from 1-Apr-2024 (FY24 restated); standalone figures before FY24 are the old holding company.',
      '**Screener EPS vs reported EPS.** Screener\'s consolidated EPS (₹14.75 for FY26) divides profit including minorities by shares; the reported basic EPS is ₹14.41. Our consolidated forecasts are on the owners\' basis.',
      '**Fee income is partly insurance commission** on loans, exactly what IRDAI\'s September proposal would cap; we cut fees by ~6bp of AUM from FY28E.',
      '**Provisioning looks adequate, not generous:** Stage 3 cover of 48%, no management overlay disclosed.',
    ] },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `Promoters held ${D.ownership.promoterGroup}% at June 2026 (Grasim 53.1%, other Birla entities 15.7%), foreign investors ${D.ownership.fii}%, domestic institutions ${D.ownership.dii}% and the public ${D.ownership.public}%. ${D.ownership.note}` },
  ...base.blocks,
  { callout: '**What it means:** the free float is only ~31%, and the controlling shareholder (Grasim) is itself listed: ABCL is Grasim\'s largest financial-services investment, and Grasim has funded both recent raises. That makes a takeover or break-up unlikely and capital support likely.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: professional, group-controlled, with related-party ties',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role'], rows: C.management.map(m => [m.name, m.role]), source: 'Q1FY27 call; Annual Report FY26' } },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Comment'], wide: [2], rows: [
      ['Board and management', 'GREEN', 'MD & CEO Vishakha Mulye and a separate CEO for each business; the NBFC CEO sits on the board'],
      ['Capital raising', 'AMBER', 'Two preferential issues to promoters in three years: supportive, but priced at the regulatory floor and dilutive'],
      ['Related parties', 'AMBER', 'Transactions with group companies (Grasim, UltraTech and others appear in the FY26 related-party note); material ones need shareholder approval'],
      ['Disclosure', 'GREEN', 'Business-level P&Ls, EV walk, asset quality by segment every quarter'],
      ['Minority-partner structure', 'AMBER', 'Sun Life, Momentum, ADIA, Advent each hold big stakes; value is shared and exits need partner consent'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { groupReturns, moat, guidance, earningsQuality, ownership, governance };
