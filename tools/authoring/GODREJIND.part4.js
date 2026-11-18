// Godrej Industries report, part B-4: the listed stakes, earnings quality, competitive advantage.
const X = require('./GODREJIND.ctx');
const { A, PEERS, n0, n1, sh, ps, pGcpl, pGpl, pGavl, listedMv, derived, C, D } = X;
const per10 = listedMv * 0.1 * (1 - derived.base / 100) / sh;
const cfo = A.cfo[A.cfo.length - 1];

const stakes = {
  id: 'stakes', nav: 'The listed stakes', kicker: 'What drives the value', title: 'Three listed stakes are ~₹1,500 of value per GIL share before any discount',
  blocks: [
    { p: 'GIL\'s share price moves with Godrej Consumer and Godrej Properties far more than with chemicals. We do not form our own view of these companies here (each has its own coverage); we take their market prices on 30-Sep-2026, as the street does, and ask what GIL adds or subtracts.' },
    { exhibit: { type: 'table', title: 'The listed stakes at 30-Sep-2026', head: ['Company', 'Price (₹)', 'Market value (₹ cr)', 'Trailing P/E', 'FY26 revenue (₹ cr)', 'GIL stake', 'Stake value (₹ cr)', '₹ / GIL share'], rows: [
      ['**Godrej Consumer**', '850.00', n0(PEERS.GODREJCP.mcapCr), n1(PEERS.GODREJCP.pe) + 'x', n0(PEERS.GODREJCP.revenue), '23.7%', n0(pGcpl.value), n0(ps(pGcpl.value))],
      ['**Godrej Properties**', '1,628.50', n0(PEERS.GODREJPROP.mcapCr), n1(PEERS.GODREJPROP.pe) + 'x', n0(PEERS.GODREJPROP.revenue), '44.8%', n0(pGpl.value), n0(ps(pGpl.value))],
      ['**Godrej Agrovet**', '623.55', n0(PEERS.GODREJAGRO.mcapCr), n1(PEERS.GODREJAGRO.pe) + 'x', n0(PEERS.GODREJAGRO.revenue), '65.1%', n0(pGavl.value), n0(ps(pGavl.value))],
      { hl: true, cells: ['**Total**', '', '', '', '', '', `**${n0(listedMv)}**`, `**${n0(ps(listedMv))}**`] },
    ], source: 'NSE closes on 30-Sep-2026; Screener.in (trailing P/E, FY26 revenue); GIL Q1FY27 deck and AR FY26 (stakes)' } },
    { exhibit: { type: 'table', title: 'What each stake brings to GIL', head: ['Stake', 'Latest operating news (to 30-Sep-2026)', 'Cash to GIL', 'What to watch'], wide: [1, 3], rows: [
      ['Godrej Consumer', 'Q1FY27 sales +19%, underlying volume +9%, net profit +11%; home care +12%, personal care +11%', 'Dividends: the bulk of GIL\'s ₹624 cr FY26 dividend income', 'Volume growth in India and Indonesia; margins'],
      ['Godrej Properties', 'FY26 bookings ₹34,171 cr (+16%), 18 new projects (₹42,100 cr potential), 12.1 mn sq ft delivered; Q1FY27 bookings ₹8,651 cr (+22%); FY26 PAT ₹1,850 cr', 'None (no dividend); GIL has had to subscribe to its equity raises', 'Bookings, land additions, any further equity raise'],
      ['Godrej Agrovet', 'FY26 total income ₹10,339 cr, PAT ₹473 cr; Q1FY27 cattle-feed volumes ~+15%, crop protection weaker', 'Dividends (GAVL paid ₹74 cr to its minorities in FY26)', 'Oil-palm prices, feed margins, crop protection recovery'],
    ], source: 'GIL Q1FY27 and Q4FY26 decks; AR FY26 note 41' } },
    { callout: `**Sensitivity:** every 10% move in the three stakes changes our target by ~₹${n0(per10)} a share (after our ${derived.base}% discount). Godrej Properties fell 49% between June 2024 and September 2026 (₹3,208 to ₹1,628.50) and Godrej Consumer 38% (₹1,376 to ₹850): GIL's look-through value fell with them, yet GIL's share price rose. That is the discount narrowing, not value being created.` },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Accounting', title: 'Earnings quality: consolidated profit is real but mostly not distributable',
  blocks: [
    { exhibit: { type: 'table', title: 'Accounting and earnings-quality checks', head: ['Check', 'Finding', 'Flag'], wide: [1], rows: [
      ['Control of GPL at 44.77%', 'GIL consolidates GPL on "de facto" control although it owns less than half (AR FY26). Consolidated revenue, debt and inventory therefore include 100% of GPL.', 'AMBER: presentation, not substance'],
      ['Other income', `₹4,123 cr in FY26, larger than EBITDA (₹2,242 cr): mostly GPL's interest from JV partners and JV profits, plus the GCPL associate share (₹445 cr).`, 'AMBER: accrual-heavy'],
      ['Operating cash flow', `Consolidated CFO was −₹${n0(-cfo)} cr in FY26 (GPL inventory build and Godrej Capital loan growth both sit in operating cash flow).`, 'AMBER: by business model'],
      ['Minorities', 'Minorities took ₹1,171 cr of FY26 profit (49% of profit before minorities). Screener\'s "Net Profit" row is before minorities: we use profit attributable (see Annotated financials).', 'Watch'],
      ['Standalone revenue', 'Dividend income (₹624 cr) is reported inside revenue because "Finance & Investments" is a segment; standalone EBITDA is therefore not a chemicals number.', 'Watch'],
      ['Auditor', 'Kalyaniwalla & Mistry LLP (standalone and consolidated); no qualification found in the FY26 report.', 'GREEN'],
      ['Related parties', 'Shareholder approval taken for material related-party transactions in FY26, mainly within the group (Godrej Capital transfer to Godrej Investment at cost).', 'GREEN'],
    ], source: 'GIL AR FY26; Screener.in' } },
    { callout: '**Overall: AMBER.** Nothing suggests the numbers are wrong. The problem is that consolidated profit is the wrong measure for GIL: a holding company is worth its stakes, and its own cash flow (dividends in, interest out) is negative after funding Godrej Capital.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: in the stakes, not in GIL',
  blocks: [
    { exhibit: { type: 'table', title: 'Competitive-advantage scorecard', head: ['Source of advantage', 'Chemicals', 'Godrej Capital', 'GIL as a holding company'], wide: [1, 2, 3], rows: [
      ['Brand', 'Weak: sells to manufacturers on specification and price', 'Moderate: Godrej name helps funding costs and trust', 'Strong, but shared royalty-free with Godrej Enterprises Group since 2024'],
      ['Cost / scale', 'Moderate: one of two large Indian producers; no feedstock ownership, unlike South-East Asian rivals', 'Weak so far: sub-scale vs bank-backed lenders', 'Access to cheap holding-company debt'],
      ['Customer lock-in', 'Some: multinational approvals in surfactants', 'Low: loans refinance easily', 'n.a.'],
      ['Returns record', 'PBIT margin 7-17%; FY24 collapse', 'ROE ~6% after five years', 'No dividend since FY20; net debt tripled'],
      ['Verdict', '**No moat**: a well-run cyclical business', '**Not yet**: a growth bet', '**The moat is in GCPL and GPL**, which investors can own directly'],
    ], source: 'GAM Research' } },
    { callout: '**Honest verdict:** GIL has no competitive advantage of its own that minority shareholders are paid for. Its value is the value of its stakes, controlled by a family that owns ~85% of GIL, run for the group\'s long-term goals (funding Godrej Capital, keeping control of GPL) rather than for GIL\'s minority shareholders\' cash returns.' },
  ],
};

module.exports = { stakes, quality, moat };
