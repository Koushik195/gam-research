// HDB Financial Services report, part 4: funding and liquidity, capital and leverage, the ROA → ROE tree.
const X = require('./HDBFS.ctx');
const { C, F, A, fin, fi, n0, n1, n2, Q1, F26 } = X;
const QK = C.quarterlyKpis;
const crarProxy = i => F26.crar * fin.equityToAum[i] / fin.equityToAum[fi('FY26')]; // CRAR scaled by equity ÷ AUM (risk weights unknown)

const funding = {
  id: 'funding', nav: 'Funding & liquidity', kicker: 'Funding', title: 'Funding: AAA, diversified and in surplus in every maturity bucket up to five years',
  blocks: [
    { p: `HDB borrows like a top-rated corporate. In Jun-2026 its ₹1.02 lakh cr of borrowings were 45.5% bank term and working-capital loans, 29.4% bonds (NCDs), 12.3% foreign-currency loans (ECBs, hedged), 5.3% subordinated debt, 4.1% securitisation, 1.9% commercial paper and 1.5% perpetual debt. HDFC Bank itself lent ₹8,767 cr (Mar-2026), ~9% of borrowings. Long-term debt is rated AAA by CRISIL and CARE. Assets mature ahead of liabilities: the cumulative gap is positive in every bucket up to five years, and the liquidity coverage ratio was ${Q1.lcr}% in Q1FY27 (daily average). The cost of borrowings was ${Q1.costOfBorrowings}% in Q1FY27, down from 7.57% a year earlier. The CFO keeps commercial paper under 2% as "dry powder".` },
    { pair: [
      { type: 'hbar', title: 'Borrowing mix: bank loans and bonds, little short-term paper', unit: 'Share of borrowings, Jun-2026 (%)', x: ['Bank term and working-capital loans', 'Bonds (NCDs)', 'Foreign-currency loans (ECB)', 'Subordinated debt', 'Securitisation', 'Commercial paper', 'Perpetual debt'], series: [{ name: 'Share', values: [45.5, 29.4, 12.3, 5.3, 4.1, 1.9, 1.5], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 presentation p35' },
      { type: 'column', title: 'Cost of funds on loans: down 60bp in a year, to 5.84%', unit: 'Finance cost ÷ average gross loans (%), company, quarter', x: QK.map(q => q.q), series: [{ name: 'Cost of funds', values: QK.map(q => q.cofLoansPct), fmt: 'n2' }], labels: 'all', min: 4, max: 7, source: 'Q4FY26 and Q1FY27 presentations' },
    ] },
    { callout: '**Why it matters:** NBFCs fail on funding before they fail on credit. HDB\'s funding is as good as a non-bank\'s gets, and the HDFC Bank name is a real cost advantage over stand-alone lenders to the same customers. It is still not a bank: it cannot take deposits, and 46% of its borrowings reprice with bank lending rates.' },
  ],
};

const capital = {
  id: 'capital', nav: 'Capital & leverage', kicker: 'Capital', title: 'Capital: 21% CRAR after the IPO; ROE rises only if leverage does',
  blocks: [
    { p: `Capital adequacy was ${Q1.crar}% in Jun-2026 (Tier 1 ${Q1.tier1}%) against a 15% minimum; debt was ${Q1.debtEquity}x equity. The IPO added ₹2,500 cr in Jun-2025, which is one reason ROE fell to 13.9% in FY26. HDB pays out ~13% of profit as dividends (₹4 a share for FY26) and keeps the rest. With equity growing ~13-14% a year and AUM 14-17%, leverage rises only slowly and CRAR stays above 19% on our rough proxy: no new equity is needed in our forecast, and any equity from HDFC Bank would now need RBI approval under the Dec-2025 directions.` },
    { exhibit: { type: 'table', title: 'Capital path in our model (no new equity)', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Net worth (₹ cr)', '{{fin.netWorth.4|num}}', '{{fin.netWorth.5|num}}', '{{F.netWorth.0|num}}', '{{F.netWorth.1|num}}', '{{F.netWorth.2|num}}'],
      ['Total assets ÷ equity (x)', '{{fin.assetsToEquity.4|n2}}', '{{fin.assetsToEquity.5|n2}}', '{{F.assetsToEquity.0|n2}}', '{{F.assetsToEquity.1|n2}}', '{{F.assetsToEquity.2|n2}}'],
      ['Equity ÷ AUM (%)', '{{fin.equityToAum.4|pct}}', '{{fin.equityToAum.5|pct}}', '{{F.equityToAum.0|pct}}', '{{F.equityToAum.1|pct}}', '{{F.equityToAum.2|pct}}'],
      ['CRAR (%): reported, then our proxy', '19.2', `${F26.crar}`, n1(crarProxy(fi('FY27E'))), n1(crarProxy(fi('FY28E'))), n1(crarProxy(fi('FY29E')))],
      ['Dividend per share (₹)', '1.0', '4.0', '{{F.dps.0|n1}}', '{{F.dps.1|n1}}', '{{F.dps.2|n1}}'],
      ['ROE (%)', '{{fin.roe.4|pct}}', '{{fin.roe.5|pct}}', '{{F.roe.0|pct}}', '{{F.roe.1|pct}}', '{{F.roe.2|pct}}'],
    ], source: 'Company; GAM estimates. CRAR proxy = FY26 CRAR scaled by equity ÷ AUM (risk weights by product are not disclosed).' } },
    { pair: [
      { type: 'line', title: 'Leverage: 7.4x in FY21, 6.0x after the IPO, edging back up', unit: 'Total assets ÷ net worth (x)', x: 'fin.labels', from: 'FY21', to: 'FY29E', series: [{ name: 'Assets ÷ equity', ref: 'fin.assetsToEquity', fmt: 'n2' }], labels: 'all', min: 4, max: 8, source: 'Company, Screener.in; GAM estimates' },
      { type: 'column', title: 'CRAR: 18-21% for a decade', unit: 'CRAR at March (%); regulatory minimum 15%', x: C.annualKpis.map(k => k.fy), series: [{ name: 'CRAR', values: C.annualKpis.map(k => k.crar), fmt: 'pct' }], labels: 'all', min: 0, max: 25, lines: [{ v: 15, text: 'Minimum 15%', color: '#b4232a' }], source: 'Q1FY27 presentation p32' },
    ] },
    { callout: '**Our view:** capital is ample and is not the constraint on growth. The flip side is that ROE is capped: at ~6x leverage and a 2.4-2.5% ROA, HDB earns 14-15%. Getting back to FY24\'s 19.5% would need both FY24-like loan losses (1.3%) and FY24-like leverage (6.7x); we assume neither.' },
  ],
};

// ROA tree on average AUM, built from the model
const cols = ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'].map(fi);
const r2 = v => (v == null ? '–' : (Math.round(v * 100) / 100).toFixed(2));
const lineOf = (name, fn, hl) => ({ hl, cells: [hl ? `**${name}**` : name, ...cols.map(i => { const v = fn(i); return hl ? `**${r2(v)}**` : r2(v); })] });
const tax = i => (fin.ppopPct[i] - fin.creditCost[i]) * fin.taxRate[i] / 100;
const roaTree = {
  id: 'roatree', nav: 'ROA → ROE tree', kicker: 'Returns', title: 'From ROA to ROE: ~10% of net income on AUM shrinks to ~2.5% after costs and losses, levered ~6x',
  blocks: [
    { p: 'A lender\'s return on equity is its return on assets times leverage. HDB\'s tree shows the shape of a high-yield retail lender: a large margin (NIM ~8%, plus ~2% of fees incl. BPO revenue), large costs (~4.6% incl. BPO) and large losses (~2.3%). The tree is on average AUM; fees and costs include the BPO business, which adds ~0.1pp to ROA.' },
    { exhibit: { type: 'table', title: 'ROA tree, % of average AUM', head: ['', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      lineOf('Interest income (yield)', i => fin.yieldOnAum[i]),
      lineOf('− Interest expense', i => fin.yieldOnAum[i] - fin.nim[i]),
      lineOf('= Net interest margin', i => fin.nim[i], true),
      lineOf('+ Fees and other income (incl. BPO revenue)', i => fin.feePct[i]),
      lineOf('− Operating expenses (incl. BPO costs)', i => fin.opexPct[i]),
      lineOf('= Pre-provision profit', i => fin.ppopPct[i], true),
      lineOf('− Loan losses (credit cost)', i => fin.creditCost[i]),
      lineOf('− Tax (approx.)', tax),
      lineOf('= ROA on AUM', i => fin.roaAum[i], true),
      lineOf('× Average AUM ÷ average equity (x)', i => fin.roe[i] / fin.roaAum[i]),
      lineOf('= ROE (%)', i => fin.roe[i], true),
    ], source: 'Company, Screener.in; GAM estimates. FY23-FY24 fee and opex ratios are higher because BPO revenue was then ₹2,000-2,600 cr.' } },
    { callout: '**What changes:** FY27E ROA on AUM rises to {{F.roaAum.0|pct}} (from {{fin.roaAum.5|pct}}) on a full year of the wider margin and slightly lower losses. It then slips to {{F.roaAum.2|pct}} by FY29E as the insurance-commission cut and a flat BPO business dilute fees and the margin drifts to 8%; ROE holds at ~{{F.roe.2|pct}} only because leverage edges up. Management\'s 2.5% ROA target (on total assets) needs roughly 0.25pp more margin, or 0.25pp less credit cost, than we model for FY29E.' },
  ],
};

module.exports = { funding, capital, roaTree, ...require('./HDBFS.part4b') };
