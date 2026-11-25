// Reliance report, part 5: earnings quality, ownership, governance, our forecasts vs the street.
const X = require('./RELIANCE.ctx');
const { C, D, F, A, n0, n1, pc, rup, seg, coEbitda, ST, medOf } = X;
const O = D.ownership.categories;

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Clean audits, but three items need watching: Level-3 investments, off-net-debt spectrum dues, capitalised interest',
  blocks: [
    { exhibit: { type: 'table', title: 'Accounting flags', head: ['Item', 'Why it matters'], wide: [1], rows: [
      ...C.accounting.map(a => { const [h, ...rest] = rup(a).split(':'); return [h, rest.join(':').trim() || '–']; }),
      ['One-offs in FY26', '₹8,924 cr gain on Asian Paints shares inside EBITDA and other income (₹7,371 cr after tax): ~₹5.4 of FY26 EPS. Screener\'s "profit for EPS" keeps it; our forecasts carry no gains.'],
      ['Cash conversion', 'CFO/EBITDA above 100% in FY24-26 (Screener), helped by payables and advances; free cash flow after capex was thin, and net debt did not fall.'],
    ], source: 'AR FY26 (auditors\' key audit matters, notes 2, 17); Screener.in; GAM Research' } },
    { callout: '**Verdict: AMBER.** Nothing suggests misreporting; Deloitte and Chaturvedi & Shah sign off without qualification. But the headline net debt (₹1.23 lakh cr) leaves out ₹1 lakh cr of spectrum dues, the balance sheet carries ₹99K cr of preference shares valued on a model, and EBITDA includes treasury income. We deduct the spectrum dues and leases in the SOTP and count the investments at book.' },
  ],
};

const ownership = base => ({ ...base, blocks: [
  { p: `At 30-Jun-2026 the promoter group (the Ambani family entities) held ${O.promoters}%, Indian institutions ${O.dii}%, foreign investors ${O.fii}%, the government ${O.government}% and the public ${O.public}% (${n0(D.ownership.shareholders)} shareholders). ${rup(D.ownership.trend)} The shift from foreign to Indian institutions has been steady since 2024.` },
  ...base.blocks,
  { callout: '**So what:** with half the shares in family hands and a fifth with Indian funds (whose inflows have been steady), the free float is ~50% and foreign selling has been the marginal driver of the 2026 fall. The Jio IPO adds a listed vehicle that some investors may prefer to own directly.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'A founder-family company in transition to the next generation',
  blocks: [
    { exhibit: { type: 'table', title: 'Management and governance scorecard', head: ['Area', 'Assessment', 'Score'], wide: [1], rows: [
      ['Leadership', rup(`${C.management.chairman}; ${C.management.nextGen}; CFO ${C.management.cfo}.`), 'GREEN'],
      ['Board', rup(C.management.board), 'AMBER'],
      ['Capital allocation', 'Disciplined on leverage (net debt/EBITDA <1x, ratings above sovereign); but heavy capex for low group returns, small payout (~10%).', 'AMBER'],
      ['Minority investors', 'Selling stakes in Jio, Retail and RCPL to global investors funded growth without dilution at RIL; it also means a third of Jio and a sixth of Retail belong to others.', 'AMBER'],
      ['Disclosure', 'Detailed quarterly segment data and calls; net debt definition excludes spectrum dues; no segment balance sheets for RRVL.', 'AMBER'],
      ['Related parties / legal', 'The 2007 Reliance Petroleum share-trading SEBI order is on appeal before the Supreme Court (auditors\' key audit matter).', 'AMBER'],
    ], source: 'AR FY26; AGM notice (28-May-2026); presentations' } },
    { callout: '**Verdict:** competent, ambitious management with a long record of executing large projects (Jamnagar, Jio, KG-D6); governance is that of a family-controlled conglomerate: strategic decisions such as IPO timing are made for the group, not necessarily for RIL\'s minority shareholders.' },
  ],
};

const streetEps = ST.filter(s => s.eps && s.eps.FY27E);
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs street', kicker: 'Our forecasts', title: 'Our EPS is within the street range; we are more cautious on Retail and on tariffs',
  blocks: [
    { exhibit: { type: 'table', title: 'GAM forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['Company EBITDA (incl. other income)', n0(207911), ...coEbitda.map(n0)],
      ['of which O2C / E&P', '60,546 / 19,050', ...[0, 1, 2].map(i => `${n0(seg('o2c').adjEbitda[i])} / ${n0(seg('ep').adjEbitda[i])}`)],
      ['of which Jio / Retail', '76,560 / 27,034', ...[0, 1, 2].map(i => `${n0(seg('jio').adjEbitda[i])} / ${n0(seg('ret').adjEbitda[i])}`)],
      ['EBITDA (Screener basis)', n0(A.ebitda.at(-1)), ...F.ebitda.map(n0)],
      ['Depreciation / finance cost', `${n0(A.dep.at(-1))} / ${n0(A.interest.at(-1))}`, ...[0, 1, 2].map(i => `${n0(F.dep[i])} / ${n0(F.interest[i])}`)],
      ['Net profit to owners', n0(A.pat.at(-1)), ...F.pat.map(n0)],
      { hl: true, cells: ['**EPS (₹)**', `**${n1(A.eps.at(-1))}**`, ...F.eps.map(e => `**${n1(e)}**`)] },
    ], source: 'GAM estimates; FY26 actual (attributable; includes the Asian Paints gain)' } },
    { exhibit: { type: 'table', title: 'EPS vs brokers that publish it (₹)', head: ['Broker (date)', 'FY27E', 'FY28E', 'vs GAM FY28E'], rows: [
      ...streetEps.map(s => [`${s.broker} (${X.shortDate(s.date)})`, n1(s.eps.FY27E), n1(s.eps.FY28E), pc((s.eps.FY28E / F.eps[1] - 1) * 100)]),
      { hl: true, cells: ['**GAM**', `**${n1(F.eps[0])}**`, `**${n1(F.eps[1])}**`, ''] },
      ['Median of the three', n1(medOf(streetEps.map(s => s.eps.FY27E))), n1(medOf(streetEps.map(s => s.eps.FY28E))), pc((medOf(streetEps.map(s => s.eps.FY28E)) / F.eps[1] - 1) * 100)],
    ], source: 'MOSL (18-Jul), Emkay (20-Jul), BOBCAPS (18-Jul-2026) result notes; Nomura: stock at 17.7x FY28F P/E (no EPS disclosed)' } },
    { callout: '**Where we differ:** we assume no tariff increase in FY27 (the street assumes one from late 2026), Retail EBITDA ~1.5x by FY29 rather than 2x, and O2C fading in FY28 as the war premium in cracks eases. Our FY28E is above MOSL\'s and close to Emkay\'s because we keep more of FY27\'s O2C strength and assume no holding-company leakage in earnings.' },
  ],
};

module.exports = { quality, ownership, governance, forecasts };
