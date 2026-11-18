// GSFC initiation, part 3: industry, tailwind test, fertiliser products, industrial products, the portfolio.
const X = require('./GSFC.ctx');
const { C, D, F, n0, n1, SRC, SA, SQ, QL, FYS, ann, A26, A25, Q1, mcap, listedMv, unlistedV, pGnfc, pGas, pGipcl, pOth, fertPt, ipPt, AS } = X;
const fertF = F.years.map((_, i) => n1(F.seg.fert.adjEbitda[i] / F.seg.fert.revenue[i] * 100));
const ipF = F.years.map((_, i) => n1(F.seg.ip.adjEbitda[i] / F.seg.ip.revenue[i] * 100));
const NB = C.nbs.rows, IN = C.inputs;

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Fertilisers run on subsidy tables; caprolactam and melamine run on China',
  blocks: [
    { p: 'India sold a record 708.9 lakh t of fertilisers in FY26 (+2%): urea 396 lakh t, DAP ~94 lakh t, SSP 55 lakh t, with imports filling the gap (DAP +37% to 62.5 lakh t). For a producer like GSFC three things matter. **First, policy sets the price.** Urea is fully controlled (New Urea Policy: cost-plus, gas passed through). P&K fertilisers get a fixed subsidy per kg of nutrient (NBS) that the government resets every kharif and rabi season; in a cost spike it decides how much the industry absorbs. **Second, inputs are imported and volatile.** Sulphur rose 164% in FY26 (average $376/t) and spiked again in Q1FY27; P₂O₅ reached $1,700/t. **Third, for chemicals, China is the price setter**: caprolactam, nylon-6 chips and melamine prices fell 10-21% in FY26 on Chinese oversupply, then jumped in Q1FY27 when China curbed exports during the Middle East crisis.' },
    { pair: [
      { type: 'column', title: 'NBS rate for P has risen 84% in two years', unit: 'NBS subsidy (₹ per kg of nutrient)', x: NB.map(r => r.period.replace(' (Kharif 2026)', '')), series: [{ name: 'N', values: NB.map(r => r.N), fmt: 'n1' }, { name: 'P', values: NB.map(r => r.P), fmt: 'n1' }], labels: 'all', source: 'NBS notifications via Coromandel Q2FY26 deck; Kharif 2026 per Cabinet approval (Apr-2026). Rabi 2026-27 not announced by 30-Sep-2026' },
      { type: 'column', title: 'Sulphur +164% in FY26; ammonia doubled by Mar-26; benzene fell', unit: 'Average CFR price (US$ per tonne)', x: IN.rows.map(r => r[0].replace(' (P2O5)', '')), series: [{ name: 'FY25 avg', values: IN.rows.map(r => r[1]), fmt: 'num' }, { name: 'FY26 avg', values: IN.rows.map(r => r[2]), fmt: 'num' }, { name: '31-Mar-2026', values: IN.rows.map(r => r[3]), fmt: 'num' }], labels: 'none', source: 'AR FY26 (MD&A)' },
    ] },
    { exhibit: { type: 'table', title: 'Market forces at 30-Sep-2026', head: ['Theme', 'Direction', 'What it means for GSFC'], wide: [2], rows: [
      ['Middle East supply shock: sulphur +231%, ammonia +144%, P₂O₅ +30% YoY in Q1FY27; sulphur above ₹1.15 lakh/t in August', 'Headwind', 'APS and AS (13 lakh t of GSFC\'s 17.7 lakh t of manufactured sales) are sulphur-based; their margins collapse until NBS catches up.'],
      ['NBS Kharif 2026 +~10% for N, P, S; rabi 2026-27 not announced by 30-Sep', 'Pending', 'H2FY27 margins depend on the rabi rates.'],
      ['DAP special package (import parity + 4%); urea cost pass-through', 'Support', 'DAP (traded and Sikka-made) and urea are protected; this is why revenue rose 64% while fertiliser EBIT fell only 12%.'],
      ['China curbs chemical exports during the crisis; capro-benzene spread $816/t in Q1FY27 (FY26 avg $535)', 'Tailwind (temporary?)', 'IP EBIT ₹116 cr in Q1FY27 vs ₹200 cr in all of FY26; management expects "stable to soft" spreads.'],
      ['Chinese melamine imports', 'Headwind', 'GSFC stopped melamine output in Q1FY27 and asked for anti-dumping duty.'],
      ['Monsoon: weak June, July revival; season ended at 87% of normal', 'Mixed', 'Kharif demand intact (management); rabi depends on soil moisture and the subsidy.'],
    ], source: 'Q1FY27 media release and call (Aug-2026), AR FY26, Cabinet NBS approval (Apr-2026), IMD (30-Sep-2026)' } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: GSFC catches the price waves, not the structural shifts',
  blocks: [
    { verdicts: [
      ['Higher fertiliser prices and subsidy outlays', 'Partly', 'Revenue +15% (FY26) and +64% (Q1FY27); but fertiliser EBIT margin 4.1% in Q1FY27 vs 8.5%.', 'Under NBS, price spikes lift revenue, not profit.'],
      ['Import substitution (DAP, phosphoric acid)', 'Not yet', 'Sikka phosphoric acid plant at the tender / EPC-award stage; C-Train adds APS flexibility, not capacity.', 'Benefits from FY29 at the earliest.'],
      ['Shift to NPK/complex grades and balanced nutrition', 'Partly', 'APS 7.16 lakh t (record); NPK only 0.06 lakh t; no SSP or specialty franchise.', 'Narrow product range.'],
      ['China+1 in chemicals', 'No', 'Caprolactam capacity flat for a decade (~0.8 lakh t made); spreads follow China.', 'GSFC is a price-taker, not a beneficiary.'],
      ['Gujarat PSU capital policy (dividends, buybacks)', 'Not yet', 'Payout ~30% of profit; no buyback despite net worth > ₹12,000 cr.', 'The policy exists on paper.'],
    ], head: ['Industry tailwind', 'Captured?', 'Evidence', 'So what'], title: 'Tailwind test', source: SRC },
  ],
};

const fert = {
  id: 'fertiliser', nav: 'Fertilizer products', kicker: 'Segment', title: 'Fertilizer products: record volumes, thin margins, policy-dependent',
  blocks: [
    { pair: [
      { type: 'column', title: 'Fertiliser revenue by quarter (standalone)', unit: 'Revenue incl. subsidy (₹ crore)', x: QL, series: [{ name: 'Fertilizer products', values: SQ.map(q => q.fertRev), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Fertiliser EBIT: ₹121 cr in Q1FY27; Q4s often negative', unit: 'Segment EBIT (₹ crore)', x: QL, series: [{ name: 'EBIT', values: SQ.map(q => q.fertEbit), fmt: 'num' }], labels: 'all', source: SRC + '; Q4 = full year less nine months' },
    ] },
    { bullets: [
      `**Volumes are at records, profits are not.** Sales of 22.31 lakh t in FY26 (+12%; manufactured 17.68 lakh t, traded 4.63 lakh t); AS (5.76 lakh t) and APS (7.16 lakh t) were the highest ever. Q1FY27 5.26 lakh t (+17%), with traded P&K 1.31 lakh t. FY27 budget: "more than 22 lakh MT".`,
      `**Margins.** Segment EBITDA margin: ${SA.map(a => `${a.fertEbitdaPct}% (${a.fy})`).join(', ')}. Q1FY27 EBIT margin 4.09% (8.49%).`,
      '**What is protected, what is not.** Urea (3.25 lakh t sold) earns a regulated return with gas passed through; DAP has the special package. APS and AS, nearly three-quarters of manufactured sales, use sulphuric acid: with sulphur at ~₹82,000/t (Q1 average) rising above ₹1.15 lakh/t, management called them "a real uncomfort" and imported AS rather than make it.',
      '**Subsidy and cash.** Subsidy income ₹4,514 cr (41% of group revenue) in FY26; receivable ₹1,453 cr at Mar-26 and ~₹500 cr outstanding in August (dues received to the third week of July). The DAP package pays ~6 months after sale, which is why GSFC borrowed in Q1FY27.',
    ] },
    { pair: [
      { type: 'column', title: 'Sales mix: AS and APS dominate', unit: 'FY26 sales volume (lakh tonnes)', x: ['APS', 'AS', 'Urea (made)', 'DAP (made)', 'Traded urea', 'Traded P&K'], series: [{ name: 'FY26', values: [7.16, 5.76, 3.25, 1.46, 3.20, 1.43], fmt: 'n1' }], labels: 'all', source: 'Q4FY26 investor presentation' },
      { type: 'column', title: 'Our forecast: fertiliser EBITDA back to ~₹770 cr by FY29E', unit: 'Fertiliser EBITDA (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26', ...F.years], series: [{ name: 'EBITDA', values: [ann('FY23').fertEbitda, ann('FY24').fertEbitda, A25.fertEbitda, A26.fertEbitda, ...F.seg.fert.adjEbitda].map(v => Math.round(v)), fmt: 'num' }], labels: 'all', source: 'Company, GAM Research estimates' },
    ] },
    { callout: `**Our view:** a competent operator with no pricing power. We model revenue ${AS.segments[0].growth.map(g => (g > 0 ? '+' : '') + g + '%').join(' / ')} (FY27-29E: price up, then easing) and EBITDA margin ${fertF.join('% / ')}%. Every 1 point of fertiliser margin moves FY28E EPS by ~₹${n1(fertPt)} (${Math.round(fertPt / F.eps[1] * 100)}%). The Sikka acid plant would cut the sulphur and P₂O₅ exposure, but not before FY29.` },
  ],
};

const ip = {
  id: 'industrial', nav: 'Industrial products', kicker: 'Segment', title: 'Industrial products: a spread business that China switches on and off',
  blocks: [
    { pair: [
      { type: 'line', title: 'IP EBITDA margin: 1% to 21% and back', unit: 'Segment EBITDA margin (%)', x: FYS, series: [{ name: 'Industrial products', values: SA.map(a => a.ipEbitdaPct), fmt: 'pct' }], labels: 'all', min: 0, max: 24, source: 'Annual reports (segment note)' },
      { type: 'column', title: 'IP EBIT by quarter: ₹116 cr in Q1FY27', unit: 'Segment EBIT (₹ crore)', x: QL, series: [{ name: 'EBIT', values: SQ.map(q => q.ipEbit), fmt: 'num' }], labels: 'all', source: SRC + '; not disclosed for Q1, Q3, Q4 FY25' },
    ] },
    { bullets: [
      '**Products.** Caprolactam (~0.8 lakh t produced a year, ~55,000 t sold outside, the rest into nylon-6), nylon-6 chips and compounds (35,010 t sold in FY26), melamine (38,780 t), methanol, MEK oxime, HX crystal (new 20 TPD plant from Oct-2024), technical-grade urea and traded ammonia (imported through the Sikka jetty).',
      '**FY26: best EBIT in four years (₹200 cr)** on technical urea, HX crystal, traded ammonia and melamine exports, despite lower caprolactam and nylon realisations (spread $535/t vs $578/t).',
      `**Q1FY27: revenue ₹${Q1.ipRev} cr (+15%), EBIT ₹${Q1.ipEbit} cr (₹${Q1.ipEbitPrev} cr)** as the spread jumped to $${Q1.spread}/t ($${Q1.spreadPrev}/t) after China curbed exports. Melamine output was nil: cheap Chinese imports and a 38% higher gas price; GSFC has asked for anti-dumping duty.`,
      '**Outlook (management, Aug-2026):** spread "stable to soft"; melamine demand to improve; HX crystal exports steady.',
    ] },
    { callout: `**Our view:** the FY26-Q1FY27 profit jump is a cyclical windfall. Over FY19-26 the segment averaged a ~10% EBITDA margin with a range of 1-21%, and nothing about GSFC's capacity or costs has changed. We model revenue +10% / +2% / +4% and EBITDA margin ${ipF.join('% / ')}% (FY27-29E). Each point of IP margin is worth ~₹${n1(ipPt)} of FY28E EPS.` },
  ],
};

const IV = C.investments;
const portfolio = {
  id: 'portfolio', nav: 'The share portfolio', kicker: 'Investments', title: `The share portfolio: ~₹${n0(listedMv + unlistedV)} cr, ${Math.round((listedMv + unlistedV) / mcap * 100)}% of the market value`,
  blocks: [
    { p: `GSFC owns shares in other state-linked companies, built up over decades and never sold. At the ${X.ASOF_TXT} closes the listed holdings were worth ₹${n0(listedMv)} cr (₹${n0(listedMv / X.TRUE_SH)} a share) and the unlisted ones ₹${n0(unlistedV)} cr at the company's March valuation. They pay dividends (₹106 cr in FY26; ~₹130 cr expected in FY27 on GNFC's ₹21 and Gujarat Energy's ₹8.90 per share) but price changes never reach the P&L: they go to reserves through OCI. The listed portfolio rose ~26% between 31-Mar and 30-Sep 2026 (GNFC +65%) while GSFC's own share price rose 8%.` },
    { exhibit: { type: 'table', title: 'Holdings at 30-Sep-2026', head: ['Holding', 'Shares (lakh)', 'Mar-26 value (₹ cr)', '30-Sep close (₹)', '30-Sep value (₹ cr)', 'Note'], wide: [0, 5], rows: [
      ...IV.listed.map(h => [h.name, n1(h.shares / 1e5), h.mar26 ? n0(h.mar26) : '–', h.close.toFixed(2), n0(h.shares / 1e7 * h.close), h.note.replace(/Rs(?=\d)/g, '₹')]),
      { hl: true, cells: ['**Listed total**', '', n0(IV.listed.reduce((s, h) => s + h.mar26, 0)), '', `**${n0(listedMv)}**`, `${Math.round(listedMv / mcap * 100)}% of GSFC's market value`] },
      ...IV.unlisted.map(h => [h.name, '', n0(h.mar26), '', n0(h.mar26), h.note.replace(/Rs(?=\d)/g, '₹')]),
      { hl: true, cells: ['**All holdings**', '', '', '', `**${n0(listedMv + unlistedV)}**`, `vs market value ₹${n0(mcap)} cr`] },
    ], source: 'AR FY26 note 7 (holdings, Mar-26 values); NSE bhavcopy 30-Sep-2026; GSPC scheme (10:305) and GSPL Transmission demerger (1:3), GAM calculation' } },
    { pair: [
      { type: 'column', title: 'Quoted holdings at each March: ₹1,610 cr to ₹5,315 cr', unit: 'Fair value of quoted shares (₹ crore)', x: Object.keys(IV.quotedMar), series: [{ name: 'Quoted', values: Object.values(IV.quotedMar), fmt: 'num' }, { name: 'Unquoted', values: Object.values(IV.unquotedMar), fmt: 'num' }], labels: 'none', source: 'Annual reports FY20-26' },
      { type: 'hbar', title: 'Where the listed value sits (30-Sep-2026)', unit: '₹ crore', x: ['GNFC', 'Gujarat Energy + GSPL Transmission', 'GIPCL', 'Others'], series: [{ name: 'Value', values: [pGnfc.value, pGas.value, pGipcl.value, pOth.value].map(Math.round), fmt: 'num' }], labels: 'all', source: 'GAM Research' },
    ] },
    { callout: '**Why it matters and why it does not.** The holdings make GSFC look very cheap: its whole market value is about what the shares alone are worth. But the shares are stakes in sister state companies held for strategic reasons; GSFC has never sold one by choice (the GNFC shares it gave up went into GNFC\'s own buyback), selling would attract capital-gains tax on large unrealised gains, and the dividends they pay (~2.4% of their value) are modest. To a minority shareholder of GSFC they are worth only what GSFC chooses to pass on. That is the holding discount, and we value it explicitly in the SOTP.' },
  ],
};

module.exports = { industry, tailwind, fert, ip, portfolio };
