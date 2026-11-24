// Biocon report, part 3: biosimilars (portfolio, launches, regions, margins, our build) and plants / US FDA status.
const X = require('./BIOCON.ctx2');
const { C, F, AS, n0, n1, pc, rup, rev, ebs, SEGH, BL, MG, SG, MBS } = X;
const QS = SG.quarterly || [];
const BS = C.biosimilars;

const biosimilars = {
  id: 'biosimilars', nav: 'Biosimilars', kicker: 'Segment: biosimilars (61% of revenue)', title: `Biosimilars: twelve products, five launches, and a margin that has to hold through US price erosion`,
  blocks: [
    { p: `Biocon Biologics sells 12 commercial biosimilars and has 20+ in development (Q1FY27 press release). Revenue grew from ₹${n0(SEGH.FY24.ext.biosimilars)} cr in FY24 (incl. the India branded business sold in FY25) to ₹${n0(SEGH.FY26.ext.biosimilars)} cr in FY26 (+16%; ~+7% in dollars per the CFO's rule of thumb that 3-4 points of rupee growth is currency) and ₹2,855 cr in Q1FY27 (+16%). EBITDA before other income went from ₹${n0(SEGH.FY25.biosimilars)} cr (21.3%) in FY25 to ₹${n0(SEGH.FY26.biosimilars)} cr (24.7%) in FY26 as North America's share rose and the Viatris integration costs fell away. The legacy portfolio is the cash engine: insulins above $300 mn a year, adalimumab above $250 mn, pegfilgrastim and trastuzumab ~$200 mn each and bevacizumab above $100 mn (CFO, Q4FY26 call).` },
    { exhibit: { type: 'table', title: 'The portfolio: what Biocon sells and where it stands', head: ['Molecule', 'Brand / status', 'Where it stands (30-Sep-2026)'], wide: [2], rows: BS.portfolio.map(p => [p.molecule, rup(p.brand), rup(p.status)]), source: 'Q4FY26 and Q1FY27 calls and presentations; June-2026 investor presentation' } },
    { pair: [
      { type: 'column', title: 'Biosimilars revenue: ~₹2,450-2,850 cr a quarter, rising', unit: 'Segment revenue (₹ crore per quarter)', x: QS.map(q => q.q), series: [{ name: 'Biosimilars', values: QS.map(q => q.biosimRev), fmt: 'num' }], labels: 'all', source: 'Company presentations and press releases' },
      { type: 'column', title: 'Biosimilars EBITDA: ₹469 cr in Q2FY25, ₹728 cr in Q1FY27', unit: 'Segment EBITDA incl. other income (₹ crore per quarter)', x: QS.map(q => q.q), series: [{ name: 'EBITDA', values: QS.map(q => q.biosimEbitda), fmt: 'num' }], labels: 'all', source: 'Company presentations and press releases' },
    ] },
    { h: 'The launches that matter for FY27-29' },
    { p: 'Management names five growth products: aflibercept, denosumab, aspart, ustekinumab and bevacizumab (CEO, Q1FY27 call). Three facts frame them. **Aflibercept** (Yesafili, eye injections for macular degeneration) launched in the US in August 2026 as an interchangeable biosimilar under a confidential settlement with the originator; one biosimilar already sells with a high share, which proves doctors will switch but also means Biocon is not first. **Denosumab** (Bosaya for osteoporosis in pharmacies, Aukelso for cancer in hospitals) launched in the US after the Q4FY26 close, behind several rivals. **Aspart** (Kirsty, the only interchangeable aspart in the US) is sold only in closed-door networks so far; the move to commercial formularies is planned for the second half of FY27. Ustekinumab (Yesintek) is the success story of FY26 (close to a fifth of the US biosimilar segment), and bevacizumab is being added in the US. July-September is when US payers sign contracts for the next calendar year; management says it is "in a good place" (Q1FY27 call).' },
    { h: 'Regions and margins' },
    { p: 'Roughly 40% of biosimilar revenue is North America (46% in Q4FY26), 35% Europe (incl. Japan and Australia) and 25% emerging markets (CFO, Q4FY26 call). Europe is "very steady" and tender-led (adalimumab is the largest product there); North America carries the margin; emerging markets add volume (insulin shares above 50% in several countries, bevacizumab leadership in Brazil). Management guides to a "mid-20s" EBITDA margin rising with launches, and asks investors to normalise FY26\'s 27% (company basis) to 24-25% because Q3FY26 had an unusually North America-heavy allocation (Q1FY27 call). US price erosion is "real" and the company prefers margin to share.' },
    { exhibit: { type: 'table', title: 'Our biosimilars build (₹ crore)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Basis'], wide: [6], rows: [
      ['External revenue', n0(SEGH.FY25.ext.biosimilars), n0(SEGH.FY26.ext.biosimilars), ...rev.biosimilars.map(n0), `Growth ${BL.growth.biosimilars.map(g => `+${g}%`).join(' / ')}: ~8 points of rupee in FY27E, then flat rupee`],
      ['EBITDA before other income', n0(SEGH.FY25.biosimilars), n0(SEGH.FY26.biosimilars), ...ebs.biosimilars.map(n0), `Margin ${MG.biosimilars.map(m => `${n1(m)}%`).join(' / ')}`],
      ['Margin', `${n1(SEGH.FY25.biosimilars / SEGH.FY25.ext.biosimilars * 100)}%`, `${n1(SEGH.FY26.biosimilars / SEGH.FY26.ext.biosimilars * 100)}%`, ...MG.biosimilars.map(m => `${n1(m)}%`), 'Management: "mid-20s", rising with launches'],
    ], source: 'AR FY25/FY26 note 40; GAM estimates. MOSL models biosimilars revenue of ~₹14,000 cr in FY28E (16% CAGR); Nuvama ~21% CAGR FY26-28E' } },
    { callout: `**So what:** our FY28E biosimilars revenue (₹${n0(rev.biosimilars[1])} cr) is ~2% below MOSL and well below Nuvama, because Q1FY27's constant-currency growth was only ~5% and three of the five launches are against established rivals. Each 1pp of biosimilars margin is ~₹${n0(rev.biosimilars[1] / 100)} cr of FY28E EBITDA and, at our ${MBS.base}x multiple, ~₹${n0(rev.biosimilars[1] / 100 * MBS.base / F.shares)} a share of target.` },
  ],
};

const plants = {
  id: 'plants', nav: 'Plants & FDA', kicker: 'Manufacturing and regulators', title: 'Plants and the FDA: all key US-facing sites cleared (VAI); one pre-licence inspection pending',
  blocks: [
    { p: 'Biocon\'s biosimilars are made in Bengaluru (monoclonal antibodies at Biocon Park and Biocon Campus, incl. the B3 and B5 drug-substance units) and Johor Bahru, Malaysia (insulins), with partner plants for adalimumab, etanercept and part of human insulin. It has 300+ kilolitres of biosimilar drug-substance capacity and 100 mn+ units of injectable capacity (June-2026 presentation). The capacity build is "substantially complete": the second drug-product line in Malaysia was approved by the EMA and started supplying in Q2FY27, the Malaysia drug-substance doubling completes towards the end of FY27, and Bengaluru needs only debottlenecking (CFO, Q4FY26 call). No new US plant is planned; the company will use partners if tariffs require local supply (chairperson, Q1FY27 call).' },
    { exhibit: { type: 'table', title: 'US FDA and other regulatory status of key sites', head: ['Site', 'Latest event', 'Date', 'What it means'], wide: [1, 3], rows: C.usfda.map(u => [u.site, rup(u.event), u.date.slice(0, 7), /pending/.test(u.event) ? 'Watch: an adverse outcome would delay new US approvals from the site' : /EMA/.test(u.event) ? 'Capacity for insulin growth' : 'Cleared for US supply']), source: 'Company statements and press coverage as listed in our research file (biocon.com, Indian Pharma Post, Q3FY26 presentation)' } },
    { callout: '**So what:** unlike several Indian peers, Biocon has no plant under a warning letter or import alert on 30-Sep-2026. That matters more for biosimilars than for pills: a biologic plant cannot be replaced quickly. The open item is the Biocon Park pre-licence inspection (five procedural observations, April 2026), which gates new product approvals from that site.' },
  ],
};

module.exports = { biosimilars, plants };
