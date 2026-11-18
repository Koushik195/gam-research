// Maruti initiation, part 4: chapters built from the deep-dive research files
// (products.json, governance.json). Tables are generated from the research so they
// refresh when the research is re-run; the judgement calls are written here.
const fs = require('fs');
const path = require('path');
const R = f => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'MARUTI', 'research', f), 'utf8')); } catch { return null; } };
const P = R('products.json') || {};
const G = R('governance.json') || {};
const n0 = v => (v == null ? '–' : Math.round(v).toLocaleString('en-IN'));
const short = (s, n = 140) => (s && s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : s || '–');

// ---------- star products & where growth comes from ----------
const stars = (P.starProducts || []).filter(s => s.fy26Units || s.h1fy27Units);
const segG = (P.segmentGrowth || []).filter(s => !/TOTAL|Mid-size|^Mini|^Compact/.test(s.segment));
const growthMix = {
  id: 'growth', nav: 'Star products & growth', kicker: 'Products & segments', title: 'Star products, and where growth really comes from',
  blocks: [
    { p: "Six of India's ten best-selling cars in FY26 were Marutis, led by the Dzire (#1, 2.29 lakh units). The volume drivers are the Dzire, Ertiga, Swift, WagonR and Baleno. The profit drivers are the SUVs sold through Nexa showrooms (Fronx, Grand Vitara and now Victoris) and the Ertiga/XL6 MPVs (multi-purpose vehicles). Note what is missing from the top of the list: **no Maruti SUV leads its segment.** Brezza and Fronx sit behind the Tata Punch and Nexon in SUVs under 4m. In mid-size SUVs, the Grand Vitara is outsold by its own Toyota-badged twin, the Hyryder." },
    { pair: [
      { type: 'hbar', title: "The volume drivers: six of India's top-10 cars", unit: "FY26 domestic units ('000)", x: stars.filter(s => s.fy26Units).map(s => s.model), series: [{ name: 'FY26 units', values: stars.filter(s => s.fy26Units).map(s => s.fy26Units), fmt: 'k' }], labels: 'all', source: 'Autopunditz, Rushlane, company, GAM Research' },
      { type: 'hbar', title: 'H1FY27: GST 2.0 lifted hatchbacks; Victoris is the new SUV', unit: "H1FY27 domestic units ('000)", x: stars.filter(s => s.h1fy27Units).map(s => s.model), series: [{ name: 'H1FY27 units', values: stars.filter(s => s.h1fy27Units).map(s => s.h1fy27Units), fmt: 'k' }], labels: 'all', highlight: 'Victoris', source: 'Autopunditz, Rushlane, company, GAM Research' },
    ] },
    { exhibit: { type: 'table', title: 'Star products: role, momentum and rank', head: ['Model', 'Segment', 'FY26 units', 'H1FY27 units', 'Momentum', 'India rank', 'Role'], wide: [4, 5], rows: (P.starProducts || []).map(s => [`**${s.model}**`, s.segment, n0(s.fy26Units), n0(s.h1fy27Units), short(s.yoy, 90), short(s.indiaRank, 80), s.role]), source: 'Autopunditz, Rushlane, V3Cars, company, GAM Research' } },
    { h: 'Growth by segment: FY26 came from exports; H1FY27 from small cars and SUVs' },
    { pair: [
      { type: 'hbar', title: "FY26: exports delivered 61% of Maruti's volume growth", unit: 'Contribution to FY26 volume growth (%)', x: segG.map(s => s.segment.replace(/ \(.*\)/, '')), series: [{ name: 'FY26', values: segG.map(s => s.contribFY26Pct), fmt: 'pct0' }], labels: 'all', source: 'Company monthly sales, GAM Research' },
      { type: 'hbar', title: 'H1FY27: small cars and UVs ~46% each; exports only 8%', unit: 'Contribution to H1FY27 volume growth (%)', x: segG.map(s => s.segment.replace(/ \(.*\)/, '')), series: [{ name: 'H1FY27', values: segG.map(s => s.contributionToGrowthPct), fmt: 'pct0' }], labels: 'all', source: 'Company monthly sales, GAM Research' },
    ] },
    { exhibit: { type: 'table', title: "Maruti's share in each segment: dominant in hatchbacks and MPVs, losing in SUVs, absent in EVs", head: ['Segment', 'Maruti share now', 'Earlier', 'Who is taking share'], wide: [1, 2, 3], rows: (P.segmentShares || []).map(s => [`**${s.segment}**`, short(s.marutiShareNow, 110), short(s.marutiShare3yAgo, 90), short(s.keyRivals, 120)]), source: 'Autopunditz, SIAM, FADA, company, GAM Research' } },
    { callout: "**Our view:** the H1FY27 growth is real. But half of it comes from small cars, revived by a one-time tax cut, in a hatchback segment that is shrinking over time. SUVs are ≈68% of the market and earn most of its profit. There, Maruti's share is ~20%, half its overall share, and it is falling in the under-4m class it once led. Maruti leads in hatchbacks, sedans and MPVs. In the segment that matters most, it is just one of five players." },
  ],
};

// ---------- pipeline ----------
const pipeline = {
  id: 'pipeline', nav: 'Product pipeline', kicker: 'Pipeline', title: 'Pipeline: many launches, but delays and a smaller EV plan',
  blocks: [
    { p: 'Management targets ~28 models by FY31 (from 17) and a return to 50% market share. Two things make us more cautious. (1) In its Feb-2025 mid-term plan, Suzuki **cut its India BEV (battery electric vehicle) plan from 6 to 4 models by FY30, and its FY30 India volume outlook to 2.54mn units** (from 3mn). (2) The most important launches (the in-house Fronx strong hybrid and the 3-row Grand Vitara) are one to two quarters later than earlier reports said. Most of the launch dates below come from press reports, not the company.' },
    { exhibit: { type: 'table', title: 'Launch pipeline FY26–FY31: what each launch has to win', head: ['Model', 'Timing', 'Segment', 'Powertrain', 'Price (₹ lakh)', 'Gap it fills', 'Collides with', 'Status'], wide: [1, 3, 5, 6], rows: (P.pipeline || []).map(s => [`**${s.model}**`, short(s.timing, 70), s.segment, short(s.powertrain, 80), s.priceLakh || '–', short(s.gapFilled, 120), short(s.collidesWith, 90), s.confidence]), source: 'Company, Suzuki mid-term plan, Autocar, Moneycontrol, CarLelo, GAM Research' } },
    { callout: "**What has to go right:** for market share to rise well above 42%, two of Maruti's next five SUV launches must become top-3 sellers in their segments. Its record is mixed. Brezza, Fronx and Victoris worked; Jimny and Invicto did not; and Grand Vitara is losing to its Toyota twin. Our base case assumes no share gain after FY27. The 3-row SUV (against the XUV700 and Safari) is the launch to watch. It is Maruti's first entry into India's most profitable type of SUV." },
  ],
};

// ---------- competitive advantage ----------
const moatRows = (P.moatEvidence || []).map(m => [m.dimension.replace(/^Technology - /, 'Technology: '), m.verdict === 'advantage' ? 'Advantage' : m.verdict === 'disadvantage' ? 'Disadvantage' : 'Parity', short(m.evidence, 330)]);
const count = v => moatRows.filter(r => r[1] === v).length;
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: strong in reach, resale and CNG; not in cost or product',
  blocks: [
    { p: "We test every claimed advantage against hard numbers. Our conclusion: Maruti's moat (lasting competitive advantage) is **distribution and trust**. It has 4,601 outlets and 5,926 service points (roughly 3x Hyundai or Tata), the best resale values in its segments, and ~70% of India's factory-fitted CNG market. This moat protects volumes in entry cars, sedans and MPVs, and generates cash through good and bad years. What it no longer has is a **cost or margin advantage**. Its Q1FY27 EBIT margin of 5.1% was below M&M's auto PBIT of 7.1% and Hyundai's EBITDA margin of ~9.3%. And it never had a product or technology lead in SUVs and EVs." },
    { verdicts: moatRows.map(r => [r[0], r[1], r[2]]), head: ['Dimension', 'Verdict', 'Evidence'], title: `Moat scorecard: ${count('Advantage')} advantages, ${count('Parity')} at parity, ${count('Disadvantage')} disadvantages`, source: 'Company, FADA, Autocar-Spinny Used Car Study 2026, Global/Bharat NCAP, GAM Research' },
    { pair: [
      { type: 'hbar', title: 'Reach: Maruti has ~3x the outlets of its nearest rivals', unit: 'Sales outlets', x: ['Maruti Suzuki', 'Tata PV', 'Hyundai'], series: [{ name: 'Sales outlets', values: [4601, 1669, 1500], fmt: 'num' }], labels: 'all', highlight: 'Maruti Suzuki', source: 'Company disclosures (FY26 / May-2026), GAM Research' },
      { type: 'hbar', title: 'Margin: no longer the most profitable mass-market car maker', unit: 'Q1FY27 margin (%); EBITDA except M&M (auto PBIT); definitions differ', x: ['Hyundai India (EBITDA)', 'Maruti (EBITDA)', 'M&M auto (PBIT)', 'Maruti (EBIT)', 'Tata PV domestic (EBITDA)'], series: [{ name: 'Margin', values: [9.25, 8.6, 7.1, 5.1, 4.3], fmt: 'pct' }], labels: 'all', highlight: 'Maruti (EBIT)', source: 'Company results, GAM Research' },
    ] },
    { h: 'What critics say, and whether we agree' },
    { exhibit: { type: 'table', title: 'The bear points we take seriously', head: ['Criticism', 'Source', 'Our view'], wide: [0, 2], rows: (P.critiques || []).slice(0, 8).map((c, i) => [short(c.point, 230), short(c.who, 50), [
      'Agree. The 13-year low in market share in FY26 is the clearest evidence that the old moat has narrowed.',
      'Partly agree. The GST cut is one-off. But it restarts first-time buying, and those buyers later upgrade within the Maruti network.',
      'Agree; this is a real brand risk. Newer models are safer (Dzire and Victoris have 5-star Bharat NCAP crash ratings), but older high-volume models lag.',
      "Agree. EVs are Maruti's biggest strategic gap. CNG and hybrids buy time but are not a substitute.",
      'Agree. Reliance on China for magnets is a risk across the sector, and Maruti has not solved it.',
      'Agree. A lower FY30 Suzuki outlook caps the long-term volume story.',
      'Agree on the facts, but we think ~60% of the hit will reverse (see the margins chapter).',
      'Agree. The Toyota alliance gives Maruti extra volume (cars it supplies to Toyota), but it also strengthens a competitor in its own segments.',
    ][i] || '']), source: 'Media and analyst sources as cited, GAM Research' } },
    { callout: "**Bottom line on the moat:** Maruti is a high-reach, high-trust volume business. It resembles Toyota in Japan (a long-standing leader with ~30% share) more than a premium compounder. That earns a steady 10-12% EBITDA margin and strong cash flow, but not monopoly-level profits. **Today it has no competitive advantage in SUVs, EVs or cost per car**, and investors should not pay for one." },
  ],
};

// ---------- ownership ----------
const sh = P.shareholders || {};
const ownership = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Who owns the stock: foreign investors sold, LIC bought',
  blocks: [
    { p: `Suzuki Motor Corp owns {{SH.rows.Promoters.11|pct}} and has been quietly buying (+1.4mn shares since Dec-25). This signals the parent's own view on value. The shareholder register explains why the valuation fell. **FIIs (foreign institutional investors) cut their stake from 20.6% (Dec-23) to 12.4% (Sep-26)**. There were 86 fewer foreign holders in the last quarter alone. The main buyer has been **LIC (4.3% → 5.85% in nine months)**, along with NPS (the National Pension System). Mutual funds were net sellers in the Sep-26 quarter (ICICI Pru, Kotak and UTI down; HDFC up). Nippon and PPFAS fell below the 1% level at which holdings must be disclosed. Retail shareholders rose by ~65,000 to 4.3 lakh, buying the fall.` },
    { pair: [
      { type: 'hbar', title: 'Named holders above 1% (Sep-2026)', unit: '% of equity', x: (sh.holdersAbove1 || []).map(h => h.name.replace(/ \(.*\)/, '')), series: [{ name: '% held', values: (sh.holdersAbove1 || []).map(h => h.pct), fmt: 'pct' }], labels: 'all', source: 'BSE shareholding pattern (Sep-2026), Trendlyne, GAM Research' },
      { type: 'line', title: 'Foreign investors out, insurers in, mutual funds flat', unit: '% of shares', x: (sh.trend || []).map(t => t.q), series: [{ name: 'FIIs', values: (sh.trend || []).map(t => t.fii), fmt: 'pct' }, { name: 'Mutual funds', values: (sh.trend || []).map(t => t.mf), fmt: 'pct' }, { name: 'Insurance', values: (sh.trend || []).map(t => t.insurance), fmt: 'pct' }], labels: 'ends', source: 'BSE, Trendlyne, Screener.in' },
    ] },
    { pair: [
      { type: 'table', title: 'Mutual fund houses: who is adding, who is trimming', head: ['Fund house', 'Value (₹ cr)', '% of equity', 'Recent change'], wide: [3], rows: (sh.topMf || []).map(m => [m.fund, n0(m.valueCr), typeof m.pctOfStock === 'number' ? `${m.pctOfStock}%` : (m.pctOfStock || '<1%'), short(m.change, 110)]), source: 'BSE, AMFI disclosures, Trendlyne; values at CMP' },
      { type: 'table', title: 'Notable moves in the last three quarters', head: ['Who', 'What they did'], wide: [1], rows: (sh.notableMoves || []).map(m => [`**${m.who}**`, short(m.action, 160)]), source: 'BSE shareholding patterns, GAM Research' },
    ] },
    { callout: '**Why this matters for the stock:** foreign investors hold ~12% of the shares, near a decade low. In the past, their return after earnings cuts ended has been the main driver of a higher valuation for Maruti. Domestic insurers buying the dip provide support for the price, not a trigger for a rise.' },
  ],
};

// ---------- governance & Suzuki ----------
const F = G.forensic || [];
const gov = {
  id: 'governance', nav: 'Governance & accounting', kicker: 'Governance', title: 'Governance and the Suzuki relationship: mostly clean, three flags',
  blocks: [
    { p: "Maruti is a Suzuki subsidiary. It has a Japanese MD & CEO (Hisashi Takeuchi), a non-executive Indian chairman (R.C. Bhargava, chairman for over two decades) and 7 Japanese nationals on a 12-member board. Related-party transactions (payments between Maruti and Suzuki) are large, but they have become cheaper for minority shareholders. **Royalty fell from ~4.8% to ~3.1% of sales**, as new models moved to a lower royalty paid in rupees. Minority votes against Suzuki-related resolutions have been small (1.8-3.2% against the 2023 SMG deal). The exception was the 2015 vote on Gujarat contract manufacturing (10.3% against)." },
    { pair: [
      { type: 'column', title: 'Royalty to Suzuki: rising in rupees, falling as a share of sales', unit: 'Royalty paid (₹ crore, standalone)', x: F.map(f => f.fy), series: [{ name: 'Royalty', values: F.map(f => f.royaltyCr), fmt: 'num' }], source: 'Annual reports (related-party note), GAM Research' },
      { type: 'column', title: 'Contingent liabilities (possible claims) fell to 18% of net worth', unit: 'Contingent liabilities as % of net worth', x: F.map(f => f.fy), series: [{ name: '% of net worth', values: F.map(f => f.contingentPctNetWorth), fmt: 'pct0' }], source: "Annual reports, GAM Research (~80% are income-tax disputes; the Income Tax Appellate Tribunal (ITAT) ruled largely in Maruti's favour in Oct-2026)" },
    ] },
    { verdicts: [
      ['Auditor change', 'Partly', 'Deloitte resigned in May 2025, two years into its second 5-year term, right after signing the FY25 accounts. PwC was appointed. No reason was disclosed, and the outgoing auditor reported no concerns.', 'A yellow flag, not a red one. We would ask management directly.'],
      ['Audit trail / restatement', 'Partly', 'FY24: the auditor flagged that accounting software lacked an audit trail (edit log). FY26: the auditor highlighted the SMG restatement and end-of-life-vehicle obligations that cannot yet be measured (EPR: extended producer responsibility).', 'Process issues, not problems with the quality of earnings.'],
      ['Related-party terms', 'Yes', 'Royalty down to ~3.1% of sales. Purchases from Suzuki are ~6.8-8.9% of sales after the SMG merger. Related-party resolutions passed with <2% opposition from public institutions (2025).', 'Fair to minority shareholders today. Watch the royalty on new EV and hybrid platforms.'],
      ['Contingent liabilities', 'Yes', '₹19,000 cr, 18% of net worth (from 32% in FY22), mostly tax claims. A favourable tax tribunal (ITAT) order in Oct-2026 removes ~₹6,300 cr.', 'Declining risk.'],
      ['Board independence', 'Partly', '4 of 12 directors are independent (33%, the regulatory minimum). There are 3 women directors. A 2024 appointment of a Suzuki nominee drew 18.8% opposition from public institutions.', "Suzuki's control is total. Minority shareholders rely on SEBI's related-party rules."],
      ['Cash conversion', 'Yes', 'Operating cash flow was 124% of PAT over 12 years. Suppliers fund its working capital, and it has no debt.', 'Reported profits turn into real cash.'],
    ], head: ['Check', 'Clean?', 'Evidence', 'Our view'], title: 'Accounting and governance checklist: Accounting flag AMBER (from GREEN) after the unexplained auditor exit', source: 'Annual reports FY21–FY26, BSE voting results, GAM Research' },
    { exhibit: { type: 'table', title: 'Accounting checks, FY21–FY26 (standalone)', head: ['FY', 'Contingent liabilities (₹ cr)', '% of net worth', 'Royalty (₹ cr)', 'Purchases from Suzuki group (₹ cr)', 'Key management pay (₹ cr)', 'Audit / non-audit fees (₹ cr)', 'Auditor'], wide: [7], rows: F.map(f => [f.fy, n0(f.contingentLiabCr), `${f.contingentPctNetWorth}%`, n0(f.royaltyCr), n0(f.purchasesFromSuzukiCr), f.kmpRemunCr, `${f.auditFeesCr} / ${f.nonAuditFeesCr}`, short(f.auditor, 60)]), source: 'Annual reports, GAM Research' } },
  ],
};

// ---------- global analogues: how far can penetration go? ----------
const pen = (G.globalAnalogues?.penetration || []).map(p => ({ x: p.gdpPerCapitaPpp, y: p.carsPer1000, label: p.country, hl: p.country === 'India' }));
const china = G.globalAnalogues?.chinaSales || [];
const analogues = {
  id: 'analogues', nav: 'Global analogues', kicker: 'Long view', title: 'How big can India get? Lessons from China and Toyota in Japan',
  blocks: [
    { p: "India has ~38 cars per 1,000 people at ~US$9,400 GDP per capita (PPP, adjusted for local prices). Indonesia (~100) and China (~333) show where markets go as incomes cross US$10-15k. **China's car sales grew ~12x between 2002 and 2016** (1.1mn → 24.4mn) once incomes crossed this zone. India will not repeat China's boom, which was driven by credit and infrastructure. But even a third of that path would double India's market within a decade." },
    { pair: [
      { type: 'scatter', title: 'Cars per 1,000 people vs income: India is at the start of the curve', points: pen, xtitle: 'GDP per capita, PPP (US$)', ytitle: 'Cars per 1,000 people', xfmt: 'num', yfmt: 'num', source: 'World Bank, OICA, national sources, GAM Research' },
      { type: 'column', title: 'China car sales: the rapid growth phase India has not had yet', unit: 'Annual sales (mn units)', x: china.map(c => String(c.year)), series: [{ name: 'China PV sales', values: china.map(c => c.units / 1e6), fmt: 'n1' }], labels: 'ends', source: 'CAAM, OICA, GAM Research' },
    ] },
    { callout: "**The lesson for market leaders:** in mature markets, the largest volume player keeps a lasting but lower share. Toyota has held ~30% of Japan's market for five decades. Hyundai-Kia held ~70-80% of Korea behind import barriers. India is neither protected nor brand-loyal. Our base case is that Maruti settles at **38-42% share of a much larger market**, not that it returns to 50%." },
  ],
};

// ---------- peer valuation ----------
const peersTbl = (G.peers || []).filter(p => p.pe1);
const peers = {
  id: 'peers', nav: 'Peer valuation', kicker: 'Relative valuation', title: 'Peer valuation: priced like a mature global car maker, with Indian growth',
  blocks: [
    { p: 'Among Indian auto stocks, Maruti trades at a discount to Hyundai India, Eicher and TVS, and in line with M&M. This is despite lower ROE and slower recent EPS growth than M&M. Against global car makers (Toyota, Suzuki, Hyundai and Kia at 5-10x) it is still expensive, but those markets no longer grow. We think a 25-28x forward P/E (price ÷ next year\'s earnings) is fair for an Indian volume leader with net cash and ~10% earnings growth.' },
    { exhibit: { type: 'table', title: 'Peer valuation (Oct-2026)', head: ['Company', 'Country', 'Mcap (US$ bn)', 'P/E yr 1', 'P/E yr 2', 'EV/EBITDA', 'EBITDA margin', 'ROE', 'EPS CAGR'], rows: peersTbl.map(p => ({ hl: /Maruti/.test(p.name), cells: [p.name, p.country, p.mcapUsdBn?.toFixed(1), p.pe1?.toFixed(1), p.pe2?.toFixed(1) ?? '–', p.evEbitda?.toFixed(1) ?? '–', p.ebitdaMargin != null ? `${p.ebitdaMargin.toFixed(1)}%` : '–', p.roe != null ? `${p.roe.toFixed(1)}%` : '–', p.epsCagr != null ? `${p.epsCagr.toFixed(1)}%` : '–'] })), source: 'stockanalysis.com, companiesmarketcap, GAM Research (consensus-based; indicative)' } },
    { pair: [
      { type: 'hbar', title: 'Indian autos: P/E (year 1)', unit: 'x', x: peersTbl.filter(p => p.country === 'India').map(p => p.name.replace(/ \(.*\)/, '')), series: [{ name: 'P/E', values: peersTbl.filter(p => p.country === 'India').map(p => p.pe1), fmt: 'x' }], labels: 'all', highlight: 'Maruti Suzuki', source: 'stockanalysis.com, GAM Research' },
      { type: 'hbar', title: 'Indian autos: ROE', unit: '%', x: peersTbl.filter(p => p.country === 'India').map(p => p.name.replace(/ \(.*\)/, '')), series: [{ name: 'ROE', values: peersTbl.filter(p => p.country === 'India').map(p => p.roe), fmt: 'pct' }], labels: 'all', highlight: 'Maruti Suzuki', source: 'stockanalysis.com, GAM Research' },
    ] },
  ],
};

module.exports = { growthMix, pipeline, moat, ownership, gov, analogues, peers };
