// Godrej Industries report, part B-2: the story in charts, what GIL owns, history and the 2024 settlement.
const X = require('./GODREJIND.ctx');
const { C, SA, SQ, QL, A26, n0, n1, price, sh, ps, P, pChem, pGcpl, pGpl, pGavl, pGc, pOth, pNd, pDisc, listedMv, ltvBase, discHist, discNow, discMedAll, discMedRecent, V, SC } = X;

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const qlab = d => `${MON[+d.slice(5, 7) - 1]}-${d.slice(2, 4)}`;
const DH = [...discHist, discNow];
const wf = [pChem, pGcpl, pGpl, pGavl, pGc, pOth, pNd, pDisc].map(p => Math.round(ps(p.value)));
wf.push(wf.reduce((s, v) => s + v, 0));
const gcCost = C.godrejCapital.gilInvestedCostCr;

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'waterfall', title: `Our target: three listed stakes, less debt, less a ${X.derived.base}% discount`, unit: '₹ per share (base case)', x: ['Chemicals', 'Godrej Consumer', 'Godrej Properties', 'Godrej Agrovet', 'Godrej Capital', 'Other', 'Holdco net debt', 'Holdco discount', 'SOTP value'], series: [{ name: '₹/share', values: wf }], fmt: 'num', totalFmt: 'num', source: 'GAM Research; listed stakes at NSE closes on 30-Sep-2026' },
      { type: 'line', title: `The discount to look-through value: ${Math.round(discMedAll)}% median, ${Math.round(discNow.disc)}% on 30-Sep-2026`, unit: 'Discount to look-through value (%)', x: DH.map(r => qlab(r.d)), series: [{ name: 'Discount', values: DH.map(r => Math.round(r.disc * 10) / 10), fmt: 'pct' }], labels: 'last', min: 0, max: 80, lines: [{ v: Math.round(discMedAll * 10) / 10, text: `Median Jun-21 to Jun-26: ${n1(discMedAll)}%` }, { v: Math.round(discMedRecent * 10) / 10, text: `Median since Sep-24: ${n1(discMedRecent)}%`, color: '#cf8f1f' }], source: 'GIL decks (stake values), NSE bhavcopies, GAM Research (method in Valuation)' },
    ] },
    { pair: [
      { type: 'column', title: 'GIL\'s market value vs the value of its listed stakes', unit: '₹ crore at quarter-end', x: DH.map(r => qlab(r.d)), series: [{ name: 'Listed stakes (GCPL, GPL, GAVL)', values: DH.map(r => Math.round(r.listed)), fmt: 'num' }, { name: 'GIL market value', values: DH.map(r => Math.round(r.mcap)), fmt: 'num' }], labels: 'none', source: 'GIL decks; NSE bhavcopies' },
      { type: 'column', title: 'GIL\'s money in Godrej Capital: ₹662 cr to ₹4,283 cr in five years', unit: 'GIL investment at cost (₹ crore)', x: Object.keys(gcCost), series: [{ name: 'Invested', values: Object.values(gcCost), fmt: 'num' }], labels: 'all', source: 'GIL decks; AR FY26' },
    ] },
    { pair: [
      { type: 'column', title: 'Chemicals: revenue up 2.5x since FY21; profit is no higher than in FY22', unit: '₹ crore', x: SA.map(a => a.fy), series: [{ name: 'Revenue', values: SA.map(a => a.chemRev), fmt: 'num' }, { name: 'Segment PBIT', values: SA.map(a => a.chemPbit), fmt: 'num' }], labels: 'none', source: 'GIL decks; AR FY26 note 47' },
      { type: 'column', title: 'Chemicals PBIT by quarter: ₹40 cr in Q4FY26, ₹159 cr in Q1FY27', unit: 'Segment PBIT (₹ crore)', x: QL, series: [{ name: 'PBIT', values: SQ.map(q => q.chemPbit), fmt: 'num' }], labels: 'all', source: 'GIL quarterly decks' },
    ] },
    { pair: [
      { type: 'column', title: 'Holding-company net debt: ₹3,131 cr to ₹9,787 cr', unit: 'GIL standalone net debt (₹ crore)', x: Object.keys(C.holdco.netDebtHistory).filter(k => /Mar/.test(k)), series: [{ name: 'Net debt', values: Object.entries(C.holdco.netDebtHistory).filter(([k]) => /Mar/.test(k)).map(([, v]) => v), fmt: 'num' }], labels: 'all', source: 'AR FY26, Screener standalone, GAM Research (approximate before FY25)' },
      { type: 'hbar', title: `Our {{dcf.tp|inr}} vs the price and the last broker target`, unit: `₹ per share; price ₹${n0(price)}`, x: ['GAM bear', 'GAM base', 'GAM bull', 'I-Sec (Aug-2024, stale)', 'Look-through value, no discount'], series: [{ name: '₹/share', values: [SC.bear.tp, V.tp, SC.bull.tp, 1090, Math.round(ltvBase / sh)], fmt: 'inr' }], labels: 'all', highlight: 'GAM base', lines: [{ v: 'P.last', axis: 'x', text: 'Price', color: '#b4232a' }], source: 'GAM Research; ICICI Securities note of 14-Aug-2024 (Trendlyne)' },
    ] },
  ],
};

const business = {
  id: 'business', nav: 'What GIL owns', kicker: 'The business', title: 'A holding company with a chemicals plant attached',
  blocks: [
    { p: 'Godrej Industries (GIL) is the holding company of the Godrej Industries Group, the half of the Godrej family business that Adi and Nadir Godrej\'s branch kept in the 2024 settlement. It owns stakes in three listed companies, one fast-growing unlisted lender and runs one business of its own: oleochemicals, which it started in India in 1963.' },
    { exhibit: { type: 'table', title: 'What GIL owns (30-Sep-2026 values)', head: ['Holding', 'What it does', 'GIL stake', 'Value (₹ cr)', '₹ / GIL share', 'How we value it'], wide: [1, 5], rows: [
      ['**Godrej Consumer Products**', 'Soaps (Cinthol), hair colour, household insecticides (Good Knight), fabric care (Godrej Fab), air fresheners; India, Indonesia, Africa', '23.7%', n0(pGcpl.value), n0(ps(pGcpl.value)), 'Market price ₹850'],
      ['**Godrej Properties**', 'Residential developer; FY26 bookings ₹34,171 cr', '44.8%', n0(pGpl.value), n0(ps(pGpl.value)), 'Market price ₹1,628.50'],
      ['**Godrej Agrovet**', 'Animal feed, oil palm, crop protection (Astec), dairy (Creamline), poultry', '65.1%', n0(pGavl.value), n0(ps(pGavl.value)), 'Market price ₹623.55'],
      ['**Godrej Capital** (via Godrej Investment)', 'Housing finance (Godrej Housing Finance) and MSME / retail loans (Godrej Finance); AUM ₹27,867 cr', '~91%', n0(pGc.value), n0(ps(pGc.value)), '2.0x GIL\'s share of book'],
      ['**Chemicals** (in GIL itself)', 'Fatty acids, fatty alcohols, glycerine, surfactants, specialty; plants at Valia, Ambernath, Kundaim, Kheda', '100%', n0(pChem.value), n0(ps(pChem.value)), `${X.chemMult.base}x Sep-28E EBITDA (₹${n0(X.chemSep28)} cr)`],
      ['Investment property and other', 'Godrej One / estate management, Godrej International trading entities', '–', n0(pOth.value), n0(ps(pOth.value)), 'Book value'],
      { hl: true, cells: ['**Gross asset value**', '', '', `**${n0(ltvBase - pNd.value)}**`, `**${n0(ps(ltvBase - pNd.value))}**`, ''] },
      ['Less: holding-company net debt', 'Jun-26E', '', n0(pNd.value), n0(ps(pNd.value)), 'AR FY26 + Q1 infusion'],
      { hl: true, cells: ['**Look-through value**', '', '', `**${n0(ltvBase)}**`, `**${n0(ps(ltvBase))}**`, `vs price ₹${n0(price)}: ${Math.round((1 - price * sh / ltvBase) * 100)}% below (${Math.round(discNow.disc)}% on the trailing basis of our discount history)`] },
    ], source: 'GIL Q1FY27 deck, AR FY26, NSE closes on 30-Sep-2026, GAM Research' } },
    { p: `Two things stand out. First, **listed shares are ${Math.round(listedMv / (ltvBase - pNd.value) * 100)}% of gross assets**: GIL is mostly a basket of Godrej Consumer, Godrej Properties and Godrej Agrovet, each of which an investor can buy directly. Second, the holding company's debt (₹${n0(-pNd.value)} cr, ~₹${n0(-ps(pNd.value))} a share) uses up most of the value we put on the chemicals business and Godrej Capital together (₹${n0(pChem.value + pGc.value)} cr). Buying GIL is buying the three listed stakes at a discount, with a leveraged bet on Godrej Capital and an oleochemicals business attached.` },
    { h: 'Chemicals in one paragraph' },
    { p: `Revenue ₹${n0(A26.chemRev)} cr in FY26 (+22%), volumes +9.4%, exports ₹1,145 cr (28%). Fatty acids (~35% of revenue) and fatty alcohols (~21%) are commodities priced off palm and palm-kernel oil; surfactants (~22%) sell to home and personal care makers; specialty (~11%, volumes +37% in FY26) and biosurfactants are the growth bets. Segment EBITDA was ₹${n0(A26.chemEbitda)} cr (8.7% margin) in FY26 and segment assets ₹2,745 cr. Q1FY27 was the best quarter in three years: revenue ₹1,161 cr (+31%), PBIT ₹159 cr (+86%).` },
  ],
};

const history = {
  id: 'history', nav: 'History & the 2024 split', kicker: 'History', title: 'History: the 2024 family settlement and what GIL ended up with',
  blocks: [
    { p: 'On 30 April 2024 the Godrej family signed a settlement that split the 127-year-old group in two. The **Godrej Industries Group (GIG)**, controlled by Adi Godrej\'s family with Nadir Godrej, kept the listed companies: Godrej Industries, Godrej Consumer, Godrej Properties, Godrej Agrovet and Astec LifeSciences. The **Godrej Enterprises Group (GEG)**, under Jamshyd Godrej and Nyrika Holkar, kept unlisted Godrej & Boyce and its affiliates, including the large Vikhroli land bank in Mumbai. Both sides keep using the Godrej brand under a separate brand and non-compete agreement, with no royalty.' },
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['1963', 'Starts oleochemicals in India', 'Still GIL\'s only operating business'],
      ['FY21-22', 'GPL stake 49.4% -> 44.8% (GPL raises equity) -> 47.3% (GIL invests ~₹1,000 cr)', 'Holding-company debt starts rising'],
      ['Sep-2021', 'Pyxis Holdings, later Godrej Capital, starts (₹662 cr invested)', 'A new capital sink: ₹4,283 cr by Jun-2026'],
      ['FY23 / FY24', 'Chemicals record (PBIT ₹697 cr), then a collapse (₹254 cr)', 'Consolidated EPS ₹29.0 (FY23) -> ₹1.8 (FY24)'],
      ['30-Apr-2024', 'Family settlement: GIG vs GEG', 'Clear control of GIL\'s companies; Vikhroli land stays with G&B (GPL can be development manager)'],
      ['Sep-2024', 'Stock +44% in a quarter', 'Discount to look-through value falls from ~66% to ~52%'],
      ['Dec-2024', 'GPL raises equity; GIL invests ~₹950 cr', 'GIL\'s stake falls to 44.8%; more holdco debt'],
      ['Nov-2025', 'Godrej Foundation sells 3.33% to promoter entities', 'Promoter group 74.64%; free float shrinks'],
      ['Jan-2026', 'Godrej Capital moved under Godrej Investment Ltd (100% owned)', 'Ring-fences the lender for outside investors or a listing'],
      ['Apr-2026', 'Pirojsha Godrej named chairperson (from 14-Aug-2026); group targets ₹5 lakh cr market value and two listings (Godrej Capital, chemicals) in five years', 'Stock +57% in Apr-Jun 2026; discount 52% -> 32%'],
    ], source: 'GIL decks and AR FY26; Godrej Industries Reg-30 filing (30-Apr-2024); PTI (22-Apr-2026); press (Nov-2025 block deal)' } },
    { callout: '**Corporate actions:** no bonus, split or buyback in the period; the share count is ~33.68 cr (a few ESOP allotments). No dividend since FY20. The relevant "corporate actions" happen one level down: GPL\'s equity raises (GIL\'s stake fell from 49.4% to 44.8%) and GIL\'s rights subscriptions in Godrej Capital.' },
  ],
};

module.exports = { narrative, business, history };
