// Chambal initiation, part 4: complex fertilisers (traded), CPC & seeds, the TAN plant, competitive advantage.
const X = require('./CHAMBLFERT.ctx');
const { C, D, F, AS, n0, n1, SRC, SA, SQ, QL, SEGY, SEGL, A26, Q1, segF } = X;
const cfF = segF('cf'), cpcF = segF('cpc'), tanF = segF('tan');
const segAs = k => AS.segments.find(s => s.key === k);

const traded = {
  id: 'traded', nav: 'Complex fertilisers', kicker: 'Segment', title: 'Complex fertilisers: a big trading book with a thin, volatile margin',
  blocks: [
    { pair: [
      { type: 'column', title: 'Traded volumes by quarter: Kharif-heavy', unit: 'Sales volume (lakh tonnes)', x: QL, series: [{ name: 'DAP/TSP', values: SQ.map(q => q.dap), fmt: 'n1' }, { name: 'MOP', values: SQ.map(q => q.mop), fmt: 'n1' }, { name: 'NPK', values: SQ.map(q => q.npk), fmt: 'n1' }], labels: 'none', source: SRC },
      { type: 'column', title: 'Segment PBIT: ₹239 cr in Q1FY27 on cheap stock', unit: 'Segment PBIT (₹ crore)', x: QL, series: [{ name: 'PBIT', values: SQ.map(q => Math.round(q.cfEbit)), fmt: 'num' }], labels: 'all', source: SRC },
    ] },
    { bullets: [
      `**Volume came from NPK.** Sales rose from 5.64 lakh t (FY25) to 12.31 lakh t (FY26): DAP/TSP 1.86 → 5.13, NPK 2.13 → 5.83, MOP 1.65 → 1.35. Chambal imported 6.03 lakh t of NPK and 5.01 lakh t of DAP in FY26, largely Russian product. Revenue ₹${n0(A26.cfRev)} cr (+174%).`,
      `**Margin history: ${SEGY.map(a => `${a.cfEbitdaPct}% (${a.fy})`).join(', ')}.** DAP is effectively fixed-margin (management cites ~₹1,026/t, about 4% of the MRP); NPK prices are free but capped by what farmers pay relative to DAP. In FY23, when prices spiked, the segment lost ₹419 cr.`,
      `**Q1FY27 is not a run-rate.** PBIT rose 67% to ₹${n0(Q1.cfEbit)} cr (13.7% margin) because Chambal bought 8.5-9 lakh t from January, before the war lifted prices. Management: margins "will decline as the averaging of the prices happens". Rabi NBS rates were still pending on 30-Sep.`,
      '**Why do it at all?** It keeps dealers and farmers buying the full basket from Chambal ("protect dealer relationship and wallet share", AR FY26), and it uses a balance sheet that would otherwise sit in liquid funds. It is not a moat.',
    ] },
    { callout: `**Our view:** we model revenue ${segAs('cf').growth.map(g => (g >= 0 ? '+' : '') + g + '%').join(' / ')} (FY27-29E) at EBITDA margins of ${cfF.join('% / ')}%: FY27 keeps Q1's windfall but gives most of it back in H2; FY28-29 return to FY26's 4%. Every 1 point of margin on ~₹7,250 cr of FY28E revenue is ~₹${n1(7250 * 0.01 * 0.75 / F.shares)} of EPS.` },
  ],
};

const cpc = {
  id: 'cpc', nav: 'CPC, nutrients & seeds', kicker: 'Segment', title: 'CPC, speciality nutrients and seeds: the best margins in the group, on a small base',
  blocks: [
    { pair: [
      { type: 'column', title: 'Revenue: Q2 and Q3 are the seasons', unit: 'Revenue (₹ crore)', x: QL, series: [{ name: 'CPC, SN & seeds', values: SQ.map(q => Math.round(q.cpcRev)), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'line', title: 'PBIT margin above 20% outside Q4', unit: 'Segment PBIT margin (%)', x: QL, series: [{ name: 'PBIT margin', values: SQ.map(q => q.cpcEbitPct), fmt: 'pct' }], labels: 'all', min: 0, max: 32, source: SRC },
    ] },
    { bullets: [
      `**Growth from new products.** Revenue ₹${SA.filter(a => a.cpcRev).map(a => n0(a.cpcRev)).join(' → ')} cr (FY21-26). 17 launches in FY26, 14 planned for FY27 (7 done in Q1); biologicals +57% in FY26, Uttam Pranaam (biogenic nano-phosphorus) volumes up ~250% in 9MFY26; seeds (wheat, mustard, maize, bajra) since FY25.`,
      '**Asset-light by design.** Chambal owns no CPC plants: products come from partners (Nichino; long-term agreement with Nutrien; talks with Syngenta and Corteva) and white-label developers. The CFCL-TERI Centre of Excellence aims for 10 patented biological products over five years, the first in FY29.',
      `**Margins.** Segment EBITDA margin ${SEGY.map(a => `${a.cpcEbitdaPct}% (${a.fy})`).join(', ')}; Q1FY27 PBIT margin 25.2% even as revenue fell 6% on deferred farmer purchases. Segment capital employed is under ₹200 cr, so returns are very high but the business is only ~10% of segment EBITDA.`,
    ] },
    { callout: `**Our view:** a well-run distribution business riding Chambal's urea network. We model revenue ${segAs('cpc').growth.map(g => '+' + g + '%').join(' / ')} at ${cpcF.join('% / ')}% EBITDA margin, taking segment EBITDA from ₹${n0(A26.cpcEbitda)} cr to ₹{{F.seg.cpc.adjEbitda.2|num}} cr (FY29E). It grows, but it cannot offset the Gadepan-III reset alone.` },
  ],
};

const tan = {
  id: 'tan', nav: 'The TAN plant', kicker: 'Project', title: 'Technical ammonium nitrate: Chambal\'s first unregulated product arrives in a short market',
  blocks: [
    { p: 'The ₹1,645 cr plant at Gadepan (Casale technology, L&T turnkey contract) makes up to 2.4 lakh t a year of technical ammonium nitrate (TAN) and 2.1 lakh t of weak nitric acid (WNA), the intermediate. TAN goes into explosives for coal and metal mining and infrastructure; India uses ~1.2 mt a year, growing 6-7%, and has relied on imports, largely from Russia, which curbed exports in 2026. The plant uses Chambal\'s own ammonia (its three plants make a 3-5% surplus) and is close to mining hubs (Singrauli, Nagpur, Hyderabad). WNA and AN-solution production started in June 2026; the high-density AN unit was "very soon" to be commissioned on 31-Jul. Until the whole plant is declared commissioned, sales are credited to the project cost, so Q1FY27 shows no TAN revenue.' },
    { exhibit: { type: 'table', title: 'TAN: what management said and what we assume', head: ['Item', 'Company / market', 'GAM assumption'], wide: [1, 2], rows: [
      ['Capacity, cost', '2.4 lakh t TAN, 2.1 lakh t WNA; ₹1,645 cr (₹1,184 cr spent by Dec-2025)', 'Capitalised in FY27; ~₹75 cr a year of depreciation'],
      ['Utilisation', '"75-80%" in FY27 (May call); 1.6-1.7 lakh t over nine months', `~0.9 lakh t booked in FY27, 1.9 lakh t (79%) in FY28, 2.1 lakh t (88%) in FY29`],
      ['Price', 'Budget ₹37,000-38,000/t; market ~40% higher in May; "better than budgeted margins"', '₹40,000 (FY27), ₹38,000 (FY28), ₹37,500/t (FY29)'],
      ['Revenue', 'Systematix: ₹900-1,000 cr at full use', `₹{{F.seg.tan.revenue.0|num}} / ₹{{F.seg.tan.revenue.1|num}} / ₹{{F.seg.tan.revenue.2|num}} cr`],
      ['EBITDA', 'Not disclosed; Elara ~₹15,000/t (₹220 cr in FY27 at 63% use)', `${tanF.join('% / ')}% margin: ₹{{F.seg.tan.adjEbitda.0|num}} / ₹{{F.seg.tan.adjEbitda.1|num}} / ₹{{F.seg.tan.adjEbitda.2|num}} cr`],
      ['Competition', 'Deepak (Gopalpur) adding capacity; Coal India/BHEL coal-based plans (~4 years away); Reliance reportedly evaluating; market "short or slightly long... for not more than a year"', 'Prices fall back to budget by FY29'],
    ], source: 'Q3FY26, Q4FY26 and Q1FY27 calls; Annual Report 2025-26; Elara (15-May-2026), Systematix (3-Aug-2026); GAM Research' } },
    { callout: '**Our view:** a sensible use of surplus ammonia and the site, and the right kind of diversification (unregulated, industrial, close to customers). But it is small: ~₹180 cr of EBITDA in FY28E is under half of what the Gadepan-III reset takes away, and it diverts ammonia that was being sold at high prices. Management is already studying "horizontal and vertical" TAN expansion; nothing is approved.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: lowest-cost operator in a regulated industry, which is a narrow moat',
  blocks: [
    { verdicts: D.moat.map(m => [m.dimension, m.verdict[0].toUpperCase() + m.verdict.slice(1), m.evidence, m.verdict === 'advantage' ? 'Protects volume and cost.' : m.verdict === 'parity' ? 'Keeps Chambal competitive; does not set it apart.' : 'Caps margins and returns.']), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Chambal has a **narrow but real advantage**: three efficient plants on one site, energy use below the norms, a balance sheet that can absorb subsidy delays, and the strongest farmer network in its region. That makes it the lowest-risk urea producer and the natural candidate for new capacity. It does **not** have pricing power: the government sets the urea price and the return, and the NIP-2012 windfall on Gadepan-III was a policy gift with an end date. The trading and CPC businesses are distribution, not franchises. Expect high-teens ROE falling to ~14% after the reset, not a compounding story.' },
  ],
};

module.exports = { traded, cpc, tan, moat };
