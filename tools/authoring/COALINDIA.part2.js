// Coal India report, part 2: what the company does, history and corporate actions, industry, tailwind test.
const X = require('./COALINDIA.ctx');
const { C, D, n0, n1, pc } = X;
const SUB = C.subsidiariesFY26, K = C.annualKpis;

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'What Coal India does: digs ~770 MT of coal a year and sells 80% of it to power plants',
  blocks: [
    { p: `Coal India (CIL) is a holding company whose seven coal-mining subsidiaries produced 768 MT in FY26, about three-quarters of India's coal. Almost all of it (97%) comes from open-cast mines, where overburden (rock and soil) is stripped by contractors and the company's own machines; underground mines (25.6 MT) are small and old. It sold 745 MT: ~646 MT under fuel supply agreements (FSAs) at notified prices, mostly to power utilities with ~618 MTPA of linkages; ~84 MT through e-auctions, where buyers bid a premium over the notified price; and ~14 MT of washed coal and other products. About 79% of offtake goes to the power sector. Customers pay in advance for e-auction coal and largely for FSA coal, so receivables are only ~28 days. Revenue also carries ~₹650 a tonne of pass-through charges (royalty-linked levies, cesses, transport and evacuation recoveries).` },
    { exhibit: { type: 'table', title: 'The subsidiaries (FY26)', head: SUB.head, rows: SUB.rows.map(r => [r[0], r[1] != null ? n1(r[1]) : '–', r[2] != null ? n1(r[2]) : '–', n0(r[3]), n0(r[4]), n0(r[5])]), source: 'AR FY26 directors\' report (section 8); Q1FY27 deck. CMPDI is the planning and exploration arm (listed Mar-2026).' } },
    { p: 'Profit is concentrated: MCL (Odisha) and NCL (Singrauli, supplying pithead power stations) earned ₹21,355 cr of the subsidiaries\' FY26 PAT; SECL ₹4,755 cr on more volume. ECL and BCCL, with older, deeper and partly underground mines in West Bengal and Jharkhand, barely break even or lose money (ECL −₹966 cr in FY26; BCCL −₹68 cr in Q1FY27). The group also owns stakes in fertiliser plants (HURL 30%, Talcher Fertilisers ~40%), coal gasification JVs with BHEL and GAIL (51%), solar plants (100 MW commissioned at Bhadramali, 200 MW of 300 MW at Khavda in Jul-2026) and rail-corridor companies.' },
    { callout: '**The model in one line:** EBITDA ≈ tonnes sold × (FSA price for ~85% of volume + e-auction price for ~12%) − the cost of digging (wages ~₹46,400 cr, contractors ~₹32,200 cr, materials and power ~₹15,000 cr in FY26). With prices largely fixed, profit swings with volume, the e-auction premium and wage settlements.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: a Government cash cow, now selling down itself and listing its subsidiaries',
  blocks: [
    { exhibit: { type: 'table', title: 'Corporate actions and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['Nov-2010', 'Listed on NSE and BSE through a Government sale', 'The Government has sold down several times since (63.13% by Jun-2023, 61.13% by Jun-2026)'],
      ['FY17, FY19', 'Share buybacks', 'Equity capital cut from ₹6,316 cr to ₹6,163 cr (616.27 crore shares)'],
      ['Jun-2023', 'Government OFS', 'Government holding 63.13% from then to Mar-2026'],
      ['2023', 'NCWA-XI wage pact (Jul-2021 to Jun-2026): 19% minimum guaranteed benefit, 25% higher allowances', 'Employee cost ~₹46,000-49,000 cr a year since FY24; the next pact (NCWA-XII) is due from 1-Jul-2026'],
      ['FY25', 'Revenue presentation changed (levies collected as principal inside revenue); FY25 restated', 'Revenue +~₹29,000 cr and costs by the same; EBITDA unchanged, margin lower'],
      ['Sep-2025', 'GST on coal 5% → 18%; ₹400/t compensation cess abolished', 'Lets Coal India use ~₹17,006 cr of accumulated input tax credit over FY26-27 (CARE)'],
      ['Q3FY26', 'Executive pay-scale upgradation (court order, retrospective from Aug-2023)', '₹2,201 cr expensed in Q3FY26 (CARE; AR cites ₹1,458 cr)'],
      ['Jan-2026', 'BCCL IPO: 10% sold at ₹23 (₹1,071 cr), listed at ~97% premium', 'First subsidiary listing; minorities in BCCL'],
      ['Mar-2026', 'CMPDI IPO: OFS of 10.71 crore shares at ₹163-172', 'Second listing; weak demand (~1x subscribed), listed below issue'],
      ['May-2026', 'Government OFS of 2% at a ₹412 floor (~10% discount)', 'Government 61.13%; FIIs up to 10.4%'],
      ['Sep-2026', 'MCL files DRHP: Coal India to sell 10% (66.18 crore shares)', 'If done, ~10% of MCL\'s ~₹10,700 cr PAT goes to minorities (~3% of group profit) in exchange for the IPO cash'],
    ], source: 'AR FY26; CARE 13-Apr-2026; offer-document coverage (Business Today, Groww); IndianPSU (NCWA)' } },
    { callout: '**Why it matters:** each listing and OFS is cash for the Government (directly, or via Coal India\'s dividends). For minority shareholders the subsidiary IPOs are roughly value-neutral (cash in, a slice of profit out) but they show what the market pays for the parts: BCCL listed at ~97% above its issue price, CMPDI below its own.' },
  ],
};

const IND = D.industry;
const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: coal demand still grows with power, but Coal India gets a shrinking share of it',
  blocks: [
    { bullets: [`**Demand.** ${IND.demand}`, `**Supply.** ${IND.supply}`, `**Pricing.** ${IND.pricing}`, `**Policy.** ${IND.policy}`] },
    { pair: [
      { type: 'line', title: 'Coal India production and offtake, FY17-FY26', unit: 'Million tonnes', x: K.map(k => k.fy), series: [{ name: 'Production', values: K.map(k => Math.round(k.coalProductionMt)), fmt: 'num' }, { name: 'Offtake', values: K.map(k => Math.round(k.offtakeMt)), fmt: 'num' }], labels: 'last', source: 'AR FY26 operational statistics' },
      { type: 'column', title: 'Overburden removed: +47% since FY21 for 29% more coal', unit: 'Overburden removal (million cubic metres)', x: K.map(k => k.fy), series: [{ name: 'Overburden', values: K.map(k => Math.round(k.overburdenMcum)), fmt: 'num' }], labels: 'all', source: 'AR FY26 operational statistics' },
    ] },
    { callout: '**So what:** the stripping ratio (rock moved per tonne of coal) has risen from ~2.3 to ~2.6 cubic metres per tonne since FY21, which is a structural cost headwind paid mostly to contractors. At the same time the market Coal India serves is no longer its own: captive and commercial mines grew ~10% in FY26 while Coal India\'s output fell 1.6%.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the power-demand tailwind reach Coal India? Partly, and mostly through volume',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Tailwind', 'Does it reach Coal India?', 'Evidence'], wide: [2], rows: [
      ['Power demand grows ~5-6% a year', 'Partly', 'Thermal generation +9.9% in Apr-Aug 2026, but renewables took coal\'s share of generation from ~71% (FY25) to ~68% (FY26)'],
      ['~45 GW of new coal power capacity over 5-6 years', 'Yes, from FY28-29', 'Kotak (28-Jul-2026): supports demand, not growth beyond low single digits'],
      ['Tight power-plant stocks (~8 days in Sep-2026)', 'Yes, via e-auctions', 'Equirus: premiums could rise from ~45-50% to 75-80%+; Apr-Aug offtake +6.7%'],
      ['Import substitution (~243 MT of substitutable imports)', 'Slowly', 'Depends on Coal India\'s grade and logistics; captive mines compete for the same buyers'],
      ['Higher global coal prices (2026)', 'Only through e-auctions', 'FSA prices are notified, not linked to imports; Jefferies cites global prices as a positive'],
      ['GST 2.0 on coal', 'Cash, not profit', 'Unlocks ~₹17,006 cr of input tax credit over FY26-27'],
    ], source: 'ICICI Direct 30-Jul-2026; Kotak Neo 28-Jul-2026; Business Today 10-Sep-2026; Sahi/AGM 31-Aug-2026; CARE 13-Apr-2026' } },
    { callout: '**Verdict:** the tailwind is real for volume (low to mid single digits) and occasionally for price (e-auction spikes), but not for the notified price on 85% of volume. Coal India grows like the residual supplier it is becoming, not like the power sector.' },
  ],
};

module.exports = { business, history, industry, tailwind };
