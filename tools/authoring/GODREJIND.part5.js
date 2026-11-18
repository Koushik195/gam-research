// Godrej Industries report, part B-5: ownership, management & governance, forecasts, street view.
const X = require('./GODREJIND.ctx');
const { C, D, F, AS, A, n0, n1, streetRows, price } = X;
const O = D.ownership.jun26;

const ownership = base => ({ ...base, blocks: [
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Who owns GIL (30-Jun-2026)', head: ['Holder', '% of shares', 'Note'], wide: [2], rows: [
    ['**Promoter group** (Godrej family members, trusts and family entities)', `${O.promoters}%`, 'Up from 67.2% in Jun-2021; just under the 75% maximum allowed for a listed company'],
    ['Godrej Foundation', `${O.godrejFoundation}%`, 'Family charitable foundation, counted as public; sold 3.33% to promoter entities in Nov-2025'],
    ['Foreign institutions', `${O.fii}%`, 'Named in the company\'s deck: 238 Plan Associates, First Sentier, Habrok, Scottish Oriental, SPDR, Vanguard'],
    ['Domestic institutions', `${O.dii}%`, 'Named: Bandhan MF, LIC, Tata MF'],
    ['Others (retail, corporates)', `${O.others}%`, `${n0(O.shareholders)} shareholders`],
  ], source: 'GIL Q1FY27 deck (shareholding at 30-Jun-2026); Screener.in; press (Nov-2025 block deal)' } },
  { callout: '**What it means:** outside the family and its foundation only ~15% of GIL trades. Institutions own ~8% and have been selling (FIIs 7.8% in Jun-2021, 4.6% in Jun-2026). Thin float and no index-heavy ownership help explain both the deep historical discount and how fast it closed in 2024-26: a small amount of buying moves the price.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a clean succession, a family-first capital policy',
  blocks: [
    { p: 'In April 2026 the board approved the next generation\'s takeover: Nadir Godrej retires as Chairman & Managing Director on 13-Aug-2026 and becomes Chairman Emeritus alongside Adi Godrej; **Pirojsha Godrej** (Executive Chairperson of Godrej Properties) becomes non-executive Chairperson of GIL and of the Godrej Industries Group from 14-Aug-2026; Burjis Godrej joins the board. Tanya Dubash (Chief Brand Officer) and Vishal Sharma (CEO, Chemicals; re-appointment to Mar-2030 proposed) are the executive directors; Clement Pinto is CFO.' },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Evidence', 'Score'], wide: [1], rows: [
      ['Board', '11 directors at 15-May-2026, 6 independent; family chair', 'GREEN'],
      ['Succession', 'Announced in April 2026 with a four-month transition; group vision published', 'GREEN'],
      ['Family settlement', '2024 split executed without litigation; brand shared royalty-free; Vikhroli land stayed with Godrej & Boyce', 'GREEN / neutral'],
      ['Minority returns', 'No dividend since FY20; promoters raised their stake to 74.64% through family transfers, purchases and a block deal from the family foundation', 'AMBER'],
      ['Capital allocation', 'Holding-company debt up from ~₹3,100 cr to ~₹9,800 cr (Mar-21 to Mar-26) to fund Godrej Capital and GPL raises', 'AMBER'],
      ['Related parties', 'Godrej Capital moved to Godrej Investment at cost (Jan-2026); material RPTs approved by shareholders', 'GREEN'],
      ['Disclosure', 'Quarterly deck is thin (no holding-company net debt, no Godrej Capital financials); no earnings-call transcripts in its filings list', 'AMBER'],
    ], source: 'GIL AR FY26 (board report, corporate governance report); decks' } },
    { callout: '**Verdict:** a well-governed family group by Indian standards, with a credible succession. But GIL is the group\'s funding vehicle: its job is to own, fund and control, not to pay its minority shareholders. That is the root of the holding-company discount.' },
  ],
};

const blk = k => AS.segments.find(s => s.key === k);
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Forecasts', title: 'Our forecasts: consolidated EPS ₹{{F.eps.0|n1}} / ₹{{F.eps.1|n1}} / ₹{{F.eps.2|n1}} (FY27-29E)',
  blocks: [
    { p: 'There is no consensus to compare with: we found no broker estimates for GIL published in the two years to 30-Sep-2026. Our consolidated forecasts matter for one cross-check (P/E); the target rests on the sum of the parts, where only the chemicals EBITDA comes from our model.' },
    { exhibit: { type: 'table', title: 'Forecast drivers by block', head: ['Block', 'Revenue growth FY27-29E', 'EBITDA margin FY27-29E', 'Why'], wide: [3], rows: ['chem', 'gavl', 'gpl', 'fin'].map(k => { const b = blk(k); return [`**${b.name}**`, b.growth.map(g => g + '%').join(' / '), b.marginPct.map(m => m + '%').join(' / '), (b._why.split('. ').slice(0, 2).join('. ') + '.').replace(/Rs(?=[0-9])/g, '₹')]; }), source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'Consolidated forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Revenue', n0(A.sales[A.sales.length - 1]), '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}'],
      ['EBITDA', n0(A.ebitda[A.ebitda.length - 1]), '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}'],
      ['Other income (incl. associates)', n0(A.otherIncome[A.otherIncome.length - 1]), '{{F.otherIncome.0|num}}', '{{F.otherIncome.1|num}}', '{{F.otherIncome.2|num}}'],
      ['Interest', n0(A.interest[A.interest.length - 1]), '{{F.interest.0|num}}', '{{F.interest.1|num}}', '{{F.interest.2|num}}'],
      ['Profit before tax', n0(A.pbt[A.pbt.length - 1]), '{{F.pbt.0|num}}', '{{F.pbt.1|num}}', '{{F.pbt.2|num}}'],
      { hl: true, cells: ['**Profit attributable to GIL**', `**${n0(A.pat[A.pat.length - 1])}**`, '**{{F.pat.0|num}}**', '**{{F.pat.1|num}}**', '**{{F.pat.2|num}}**'] },
      ['EPS (₹)', n1(A.eps[A.eps.length - 1]), '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}'],
    ], source: 'Screener.in (FY26); GAM estimates' } },
    { callout: '**What the engine can and cannot show.** Our model has no minority-interest line, so tax and minorities are combined in one "tax" rate (61% / 60% / 60%, against 63% in FY26). It projects the balance sheet with one working-capital ratio and puts GPL\'s inventory and Godrej Capital\'s loan book in the same pot, so model net debt and cash flow are not meaningful for GIL; we show the holding company\'s own net debt separately and use it in the valuation. Q1FY27 attributable profit was ₹284 cr (−19%); our FY27E needs a strong second half, which GPL\'s Q4-heavy handovers usually provide (Q4FY26 profit ₹444 cr).' },
  ],
};

const street = {
  id: 'street', nav: 'Street view & critiques', kicker: 'Street view', title: 'The street: one broker, last heard from in August 2024',
  blocks: [
    { p: D.street.coverage + ' ' + D.street.method },
    { exhibit: { type: 'table', title: 'Broker notes we found (all ICICI Securities)', head: ['Broker', 'Rating', 'Target (₹)', 'Method', 'Basis', 'Date', 'Headline'], wide: [6], rows: streetRows.map(r => [r[0], r[1], n0(r[2]), r[3], r[4], r[5], r[6]]), source: 'Trendlyne research-report records; target and price at the time of each note' } },
    { p: `I-Sec's last target (₹1,090) was set when GCPL traded near ₹1,400 and GPL near ₹3,000; both are far lower now. Its method, a 50% holding-company discount on listed stakes, applied to 30-Sep-2026 market prices gives ~₹${n0(X.listedMv * 0.5 / X.sh)} a share before chemicals, Godrej Capital and debt, below the ₹${n0(price)} share price.` },
    { h: 'What the bears and bulls argue' },
    { bullets: [
      ...D.critiques.map(c => `**Bear:** ${c}`),
      '**Bull:** the April-2026 plan to list Godrej Capital and chemicals gives the discount a path to close, the next generation has taken charge, and the stakes themselves are well below their mid-2024 levels (GCPL −38%, GPL −49% from June 2024).',
      '**Bull:** an outside equity raise in Godrej Capital would both stop the holding company\'s borrowing and put a market price on its biggest unlisted asset.',
    ] },
  ],
};

module.exports = { ownership, governance, forecasts, street };
