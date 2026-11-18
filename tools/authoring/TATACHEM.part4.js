// Tata Chemicals report, part B-4: UK/Kenya/Singapore, Rallis and the investment portfolio, moat,
// earnings quality.
const X = require('./TATACHEM.ctx');
const { SQ, QL, SA, A26, A23, n0, n1, SRC, F, sep28, quotedMV, rallisMcap, sh, price, mcap, C } = X;
const m = (e, r) => SA.map(a => Math.round(a[e] / a[r] * 1000) / 10);
const Qx = C.investments.quotedMar26;
const close = { TITAN: 4587, INDHOTEL: 728.65, TATASTEEL: 184.3, TMPV: 283.5, TMCV: 421.65, TATACAP: 327.95, ORIENTHOT: 142.36 };
const mv = q => (close[q.nse] ? q.shares * close[q.nse] / 1e7 : q.valueCr);

// ---------------------------------------------------------------- UK, Kenya, Singapore
const overseas = {
  id: 'overseas', nav: 'UK, Kenya, Singapore', kicker: 'Units', title: 'UK, Kenya and Singapore: small, and none of them earns its cost of capital',
  blocks: [
    { pair: [
      { type: 'line', title: 'Kenya margin: 50% in FY23, 17% in FY26; UK 23% to 6%', unit: 'EBITDA margin (%, annual)', x: 'R.segments.annual[].fy', series: [{ name: 'Kenya', values: m('kenEbitda', 'kenRev'), fmt: 'pct' }, { name: 'UK', values: m('ukEbitda', 'ukRev'), fmt: 'pct' }], labels: 'all', min: 0, max: 55, source: 'Q4 investor decks' },
      { type: 'column', title: 'Quarterly EBITDA: UK and Kenya both near zero in Q1FY27', unit: 'EBITDA (₹ crore)', x: QL, series: [{ name: 'UK', values: SQ.map(q => q.ukEbitda), fmt: 'num' }, { name: 'Kenya', values: SQ.map(q => q.kenEbitda), fmt: 'num' }], labels: 'none', source: SRC },
    ] },
    { bullets: [
      `**UK (Tata Chemicals Europe).** Soda ash at Lostock stopped in Jan-2025 after years of losses; the UK now makes salt (430 KTPA), pharma salt (70 KTPA, new) and bicarb (90 KTPA) from imported TCNA ash. FY26 revenue fell 27% to ₹${n0(A26.ukRev)} cr but EBITDA rose to ₹${n0(A26.ukEbitda)} cr on a lower cost base; it still lost ₹202 cr before tax. Q1FY27 EBITDA was −₹5 cr after ~GBP2.4 mn of one-offs; management expects a positive FY27 EBITDA. The UK also carries most of the group's pension deficit; a 2025-27 support agreement defers payments, and the sale of Winnington land after 2027 is meant to reduce it.`,
      `**Kenya (Magadi).** Natural soda ash, mostly exported to Asia. EBITDA fell from ₹${n0(A23.kenEbitda)} cr (FY23) to ₹${n0(A26.kenEbitda)} cr (FY26) and ₹1 cr in Q1FY27 as export prices fell and heavy fuel oil costs jumped (hedged only to October). A world-first 50 kt electric calciner started in FY26. A ₹891 cr land-rates claim by Kajiado County was rejected by Kenya's Court of Appeal in Oct-2025; the county has appealed to the Supreme Court.`,
      '**Singapore (Novabay).** A 60 KTPA pharma-grade bicarb plant bought in Mar-2026 (price not disclosed); Q1FY27 revenue ₹60 cr, EBITDA ₹5 cr. A 40 KTPA expansion is planned (no date).',
    ] },
    { callout: `**Our view:** together these three units should earn ~₹${n0(sep28('uk') + sep28('ken') + sep28('sg'))} cr of EBITDA on a Sep-28E basis, about 10% of the group. We value them at 5-8x EBITDA. The UK is now a stable, low-margin salt and bicarb business; Kenya swings with export prices and fuel.` },
  ],
};

// ---------------------------------------------------------------- Holding company: Rallis, shares, Tata Sons
const holdco = {
  id: 'holdco', nav: 'Rallis, investments & Tata Sons', kicker: 'The holding company', title: 'Half the market value is shares in other companies',
  blocks: [
    { p: `Tata Chemicals is partly a holding company. At the 30-Sep-2026 closes, its stakes in listed Tata companies were worth ~₹${n0(quotedMV)} cr (₹${n0(quotedMV / sh)} a share) and its 55.04% of Rallis India ₹${n0(rallisMcap * 0.5504)} cr (₹${n0(rallisMcap * 0.5504 / sh)} a share): together ₹${n0((quotedMV + rallisMcap * 0.5504) / sh)} a share, ${Math.round((quotedMV + rallisMcap * 0.5504) / mcap * 100)}% of the ₹${n0(price)} share price, before any holding-company discount. Titan alone is ₹${n0(6342 / sh)} a share. These stakes pay dividends (part of the ~₹300 cr of yearly other income) but are not part of the chemicals business.` },
    { exhibit: { type: 'table', title: 'Quoted investments (holdings as at Mar-26)', head: ['Company', 'Shares held', 'Mar-26 value (₹ cr)', '30-Sep-26 value (₹ cr)', '₹ per TCL share'], rows: [
      ...Qx.map(q => [q.name, n0(q.shares), n0(q.valueCr), n0(mv(q)), n1(mv(q) / sh)]),
      { hl: true, cells: ['**Total**', '', `**${n0(C.investments.quotedTotalMar26)}**`, `**${n0(quotedMV)}**`, `**${n0(quotedMV / sh)}**`] },
    ], source: 'AR FY26 note 9; NSE closes 30-Sep-2026 (Tata Investment at Mar-26 book; some shares were sold in Q1FY27, undisclosed)' } },
    { bullets: [
      `**Rallis India (55.04%, listed).** Crop protection and seeds. FY26 revenue ₹${n0(A26.ralRev)} cr, EBITDA ₹${n0(A26.ralEbitda)} cr; Q1FY27 EBITDA ₹185 cr (+23%). At ₹199.73 on 30-Sep-2026 Rallis was worth ₹${n0(rallisMcap)} cr. Its 44.96% minority took ₹82 cr of profit in FY26. We value the stake at market less 20%, as the street does.`,
      '**Joint ventures.** A third of IMACID (Moroccan phosphoric acid; carrying value ₹718 cr; it stopped production in Q1FY27 on sulphur costs) and 9.13% of Tata Industries (₹742 cr). Together they contributed ₹167 cr of profit in FY26 and −₹17 cr in Q1FY27. We keep them at book value.',
      '**Tata Sons (2.53%, unlisted).** 10,237 shares carried at only ₹57 cr. RBI\'s rejection of Tata Sons\' de-registration (11-Sep-2026) revived listing hopes and the stock rose 20% to ₹735 on 15-Sep-2026; on 29-Sep a Tata Trusts proposal that could avoid listing knocked it back to ~₹610. Press estimates put the stake at ₹10,000-25,000 cr (₹390-980 a share). With no listing date and the controlling shareholder opposed, we give it no value in the base case and ₹5,000 cr in the bull case.',
    ] },
    { callout: '**So what:** two things follow. First, on the street\'s method about ₹330 a share of value (after the 20% discount) comes from shares that Tata Chemicals does not control and will probably never sell; it moves with Titan\'s share price. Second, the Tata Sons stake is a free option at today\'s price: worth a lot if Tata Sons lists, nothing if it does not. Neither changes the fact that the chemicals business is earning very little.' },
  ],
};

// ---------------------------------------------------------------- Moat
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: low-cost assets, no pricing power',
  blocks: [
    { verdicts: [
      ['Natural soda ash (US, Kenya)', 'Advantage', 'Green River trona is among the cheapest soda ash in the world; Magadi is natural too.', 'Low cost, but it did not stop US EBITDA falling to US$1/t: export prices follow Chinese ash.'],
      ['Indian soda ash position', 'Advantage', '14% market share; integrated with salt, limestone and power at Mithapur; priced at import parity.', 'Earns 19-28% margins while overseas units earn ~0-10%.'],
      ['Pricing power in soda ash', 'Disadvantage', 'China has record inventory and sells near cash cost; TCL is a price-taker everywhere except, partly, India.', 'Profits follow the cycle; no moat on price.'],
      ['Living Essentials (salt, bicarb, prebiotics)', 'Partial', '32% Indian bicarb share; >90% of Indian scFOS; pharma/food grades need customer approval.', 'Stickier, but technical bicarb faces a new Indian competitor.'],
      ['Scale and geography', 'Neutral', 'Four continents, 3.9 mtpa of soda ash; but the UK soda ash plant had to close and the US goodwill was written down.', 'Diversity has not produced returns.'],
      ['Tata parentage and balance sheet', 'Advantage', 'AA+ ratings; large investment portfolio; access to cheap debt.', 'Can survive the downcycle; does not make it profitable.'],
      ['Innovation (sodium-ion, recycling, specialty silica)', 'Unproven', '472 patents filed, 182 granted; sodium-ion pilot under way.', 'Option value only.'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls to Sep-2026)' },
    { callout: '**Honest verdict:** Tata Chemicals has good assets but no moat that protects profits. Its US and Kenyan mines are low-cost, yet in a world of Chinese oversupply low cost only means losing less. India is the one market where it has structural advantages (scale, integration, import-parity pricing), and that is where it earns its money. Group ROCE of 3% in FY26 and a US goodwill write-down are the evidence.' },
  ],
};

// ---------------------------------------------------------------- Earnings quality
const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: minorities, other income and an exceptional item every year',
  blocks: [
    { bullets: [
      '**Minorities.** Screener\'s "net profit" is before minorities. Rallis (44.96%) and the ALCAD US partnership (50%) took ₹181 cr in FY26 and ₹77 cr in Q1FY27. In Q1FY27 the group made ₹60 cr before minorities and −₹17 cr after. This report always uses profit after minorities.',
      '**Other income carries the P&L.** FY26 pre-tax profit before exceptional items was ₹497 cr; other income and JV profit were ~₹483 cr of it (dividends from Titan and other Tata shares, interest, IMACID and Tata Industries). Operations alone roughly broke even after depreciation and interest.',
      '**An exceptional item every year.** FY24: ₹963 cr in the UK; FY25: ₹125 cr of Lostock closure costs; FY26: ₹1,956 cr (US goodwill ₹1,837 cr, labour codes ₹54 cr, UK ₹65 cr) plus a US deferred-tax write-off (₹182 cr in the deck, ₹159 cr on the call).',
      '**Smaller items.** Q1FY27 staff cost included a ~₹43 cr one-off benefit; US mining rights (Ind AS only) are amortised at ~₹100 cr a year; FX on overseas loans added ₹460 cr to debt in FY26.',
      '**Audit and disclosure.** B S R & Co. (KPMG network), clean opinion. Unit-wise P&L every quarter is better disclosure than most peers.',
    ] },
    { callout: '**Accounting flag: AMBER.** Nothing suggests aggressive accounting and disclosure is good, but reported profit is hard to read: minorities, JV income, dividends from strategic stakes and a large exceptional item every year sit between EBITDA and EPS. Investors should look at unit EBITDA and cash flow, not headline profit.' },
  ],
};

module.exports = { overseas, holdco, moat, quality };
