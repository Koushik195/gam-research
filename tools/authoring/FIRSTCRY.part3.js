// FirstCry report, part 3: India multi-channel, International, Globalbees & Others, competitive advantage.
const C = require('./FIRSTCRY.ctx');
const { n0, n1, QL, qv, Q5, A24 = C.SA.find(a => a.fy === 'FY24'), A25, A26, q1, q1y, D, SEG, segM, F, NCI, C: CO } = C;
const SRC = 'FirstCry investor presentations (Q1FY26-Q1FY27), GAM Research';
const fy = i => F.years[i];
const segTable = (k, rows) => ({ exhibit: { type: 'table', title: rows.title, head: ['', 'FY24', 'FY25', 'FY26', 'Q1FY27', 'FY27E', 'FY28E', 'FY29E'], rows: rows.body, source: `${SRC}; GAM estimates` } });

// ---------------------------------------------------------------- India multi-channel
const imc = {
  id: 'imc', nav: 'India multi-channel', kicker: 'Segment', title: 'India multi-channel: growth is back; the gross margin is not yet',
  blocks: [
    { p: `India multi-channel is FirstCry: the app and website (78% of GMV) and 1,188 stores (22%), selling 2.1 mn products from 7,900+ brands, with its own BabyHug and other home brands at more than half of GMV. It made ₹${n0(A26.imcAe)} cr of adjusted EBITDA in FY26 (${A26.imcAePct}% of revenue) and is profitable after tax. Growth slowed to 7.5-9% in the first three quarters of FY26 as third-party couriers let customers down, stores carried too wide a range and quick-commerce apps cut diaper prices. The company built its own delivery network (RocketBees, 72 cities, >50% of shipments), a 2-3 hour service (FirstCry Qwik, 12 cities) and re-assorted its stores toward fewer, cheaper lines. Revenue growth recovered to ${q1.imcRevYoYPct}% in Q1FY27. But gross margin fell ~280bp YoY in Q4FY26 and ~260bp in Q1FY27, and adjusted EBITDA dropped to ${q1.imcAePct}% of revenue.` },
    { pair: [
      { type: 'line', title: 'India revenue growth has risen for five quarters', unit: 'India multi-channel revenue growth, YoY %', x: QL, series: [{ name: 'Revenue growth', values: qv('imcRevYoY'), fmt: 'pct' }, { name: 'GMV growth', values: qv('indiaGmvYoY'), fmt: 'pct' }], labels: 'all', source: SRC },
      { type: 'column', title: `...but the margin fell to ${q1.imcAePct}% in Q1FY27`, unit: 'India multi-channel adjusted EBITDA, % of revenue', x: QL, series: [{ name: 'Margin', values: qv('imcAePct'), fmt: 'pct' }], labels: 'all', source: SRC },
    ] },
    segTable('imc', { title: 'India multi-channel by year (₹ crore)', body: [
      ['GMV', '–', n0(A25.indiaGmv), n0(A26.indiaGmv), n0(q1.indiaGmv), ...[0, 1, 2].map(i => `{{F.seg.imc.driver.${i}|num}}`)],
      ['Revenue', n0(A24.imcRev), n0(A25.imcRev), n0(A26.imcRev), n0(q1.imcRev), ...[0, 1, 2].map(i => `{{F.seg.imc.revenue.${i}|num}}`)],
      ['Adjusted EBITDA', n0(A24.imcAe), n0(A25.imcAe), n0(A26.imcAe), n0(q1.imcAe), ...[0, 1, 2].map(i => `{{F.seg.imc.adjEbitda.${i}|num}}`)],
      ['Margin, % of revenue', `${A24.imcAePct}%`, `${A25.imcAePct}%`, `${A26.imcAePct}%`, `${q1.imcAePct}%`, ...segM('imc').map(v => `${n1(v)}%`)],
    ] }),
    { bullets: [
      '**Diapers (~15% of GMV) are the battleground.** Quick-commerce apps and horizontals with new capital used them to win young parents from Q3FY26. Management says intensity eased in Jul-Aug 2026 and compares it with 2015-17, when a similar war ended and margins rebuilt; it expects 4-6 quarters to normalise from Q3FY26.',
      '**Manufacturing input costs** (rupee depreciation, crude-linked materials) hit home-brand margins; price increases should pass them on by end-Q2FY27.',
      '**The other 85% of GMV** (fashion, toys, gear, nursery) grows and holds margin; fashion and home brands lift gross margin over time.',
      `**Stores:** expansion paused in FY26 (1,156 → 1,190); ~90-100 net additions planned for FY27. Offline GMV grew 15% in Q4FY26 and Q1FY27 after the re-assortment.`,
      `**Customers:** ${q1.indiaAutcMn} mn annual customers (+10%) and ${q1.indiaOrdersMn} mn orders in Q1FY27 (+12%); AOV flat at ₹${n0(q1.aovIndia)}. GMV from new customers grew only 2% in FY26.`,
    ] },
    { callout: `**Our view:** the growth fixes are real and within FirstCry's control; the margin is not. We assume India adjusted EBITDA of {{F.seg.imc.adjEbitda.0|num}} cr in FY27E (${n1(segM('imc')[0])}% of revenue), recovering to ${n1(segM('imc')[2])}% by FY29E, still below FY25's ${A25.imcAePct}%, with GMV +13% a year. If quick commerce keeps diapers as a loss-leader, the recovery stalls; that is our bear case.` },
  ],
};

// ---------------------------------------------------------------- International
const intl = {
  id: 'intl', nav: 'International', kicker: 'Segment', title: 'International: a big prize in the Gulf, still losing money after six years',
  blocks: [
    { p: `FirstCry sells online in the UAE (since 2019) and Saudi Arabia (since 2022), where parents spend 7-18 times more per child than in India and average orders are 4.1x India's. Revenue was ₹${n0(A26.intlRev)} cr in FY26 (+10%) and ₹${n0(q1.intlRev)} cr in Q1FY27 (+12%). Two horizontal players entered in 2024 and kept promotions high, so GMV grew only 5% in FY26. FirstCry chose margin over growth: gross margin rose to 27.7% in Q1FY27 and the adjusted EBITDA loss fell from ₹140 cr in FY25 to ₹91 cr in FY26 (−7% of revenue in Q1FY27, −25% in FY23). Management gives no breakeven date.` },
    { pair: [
      { type: 'column', title: 'International revenue by quarter', unit: '₹ crore', x: QL, series: [{ name: 'Revenue', values: qv('intlRev'), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Losses are shrinking, slowly', unit: 'International adjusted EBITDA, % of revenue', x: [...QL, fy(0), fy(1), fy(2)], series: [{ name: 'Margin', values: [...qv('intlAePct'), ...segM('intl').map(v => Math.round(v * 10) / 10)], fmt: 'pct' }], labels: 'all', source: `${SRC}; FY27-29E are full years` },
    ] },
    { callout: `**Our view:** we assume losses fall to ${n1(-segM('intl')[2])}% of revenue by FY29E (breakeven around FY30E) and value International at the same sales multiple as the rest, as JM Financial does (1x sales). That is generous for a loss-making business; valuing it only at the present value of its losses would cut more than ₹${n0(C.PX.perShare)} a share from our target (a sensitivity, not our base).` },
  ],
};

// ---------------------------------------------------------------- Globalbees & Others
const gb = {
  id: 'gb', nav: 'Globalbees & preschools', kicker: 'Segment', title: 'Globalbees: profitable at last, but half of it belongs to others',
  blocks: [
    { p: `Globalbees bought stakes in D2C brands (home improvement, appliances, health and personal care, lifestyle) in FY22-FY23 and has grown organically since its last deal in Sep-2022. Revenue was ₹${n0(A26.gbRev)} cr in FY26 (+20%; core brands +28%) and flat in Q1FY27 (a planned warehouse move at one core brand and a change in Flipkart's settlement model). Adjusted EBITDA turned from −₹45 cr (FY23) to ₹${n0(A26.gbAe)} cr (FY26) and ${q1.gbAe} cr in Q1FY27 (3.9%). The catches: FirstCry owns only 51.68% (minorities absorbed ₹63 cr of FY26 losses and will take 48% of any profit), Globalbees owes ₹388 cr to its brand founders, and impairments and inventory write-offs have recurred (₹208 cr in FY25 and ₹55 cr in FY26, before gains on remeasuring earn-outs).` },
    { p: `**Others** is FirstCry's preschool franchise (FirstCry Intellitots): more than double the 208 preschools of FY24 across 190+ cities, revenue ₹${n0(A26.othRev)} cr in FY26 and ₹${n0(q1.othRev)} cr in Q1FY27 (+47%) at a ~26% margin. Small, but profitable and growing.` },
    { pair: [
      { type: 'column', title: 'Globalbees adjusted EBITDA by quarter', unit: '₹ crore', x: QL, series: [{ name: 'Adj. EBITDA', values: qv('gbAe'), fmt: 'num' }], labels: 'all', source: SRC },
      { type: 'column', title: 'Globalbees revenue growth stalled in Q1FY27', unit: 'Revenue growth, YoY %', x: QL, series: [{ name: 'Growth', values: qv('gbRevYoY'), fmt: 'pct' }], labels: 'all', source: SRC },
    ] },
    { callout: `**Our view:** we assume Globalbees revenue +10% in FY27E and +16% after, with margins of 4.5-6.5%. In the sum of the parts it is worth {{dcf.sotp.parts.2.perShare|n1}} a share at 100%, less {{dcf.sotp.parts.5.perShare|n1}} for the minorities and ₹${n1(CO.fy26.considerationPayable * (1 - NCI) / C.shares)} for earn-outs.` },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat in India, none elsewhere',
  blocks: [
    { verdicts: D.moat.map(([a, v, e]) => [a, v, e, /^Weak/.test(v) ? 'Not a source of excess returns' : /strong/i.test(v) ? 'Hard to copy quickly' : 'Helps, can be matched']), head: ['Source of advantage', 'Strength', 'Evidence', 'So what'], title: 'Competitive advantage scorecard', source: 'Company filings, JM Financial, GAM Research' },
    { callout: `**Verdict:** ${D.moatVerdict}` },
  ],
};

module.exports = { imc, intl, gb, moat };
