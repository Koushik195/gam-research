// Himadri report, part B (5/5): ownership, governance, forecasts, street.
const { ctx } = require('./HSCL.part2');
const { C, D, M, F, n0, n1, A26 } = ctx;
const OH = D.ownership, G = C.governance, ST = D.street, CS = ST.consensus;
const g2629 = (Math.pow(F.eps[2] / 14.89, 1 / 3) - 1) * 100;

const ownership = base => ({ ...base, blocks: [
  { p: `The Choudhary family owns ${OH.categoriesPct.promoters}% (Jun-2026), mostly through Modern Hi-Rise Pvt Ltd (36.75%) and CMD Anurag Choudhary (8.59%, Mar-2026). Its stake rose from 44.8% in Dec-2023 after it converted 1 cr warrants at ₹316 in Nov-2025; nothing is pledged. Institutions own little: foreign investors ${OH.categoriesPct.fpi}%, insurers ${OH.categoriesPct.insurance}% and mutual funds just ${OH.categoriesPct.mutualFunds}%. Retail investors (${n0(OH.shareholders)} shareholders) hold most of the rest, which makes the stock volatile (52-week range ₹438-790).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders (promoters at Mar-2026; categories at Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.named.map(h => [h.name, h.pct.toFixed(2) + '%', h.asOf]),
    ['Foreign portfolio investors', OH.categoriesPct.fpi + '%', 'Jun-2026, none named above 1%'],
    ['Insurance companies', OH.categoriesPct.insurance + '%', 'Jun-2026'],
    ['Mutual funds', OH.categoriesPct.mutualFunds + '%', 'Jun-2026'],
  ], source: 'FY26 annual report (note 17, promoter holdings at 31-Mar-2026); BSE shareholding pattern for Jun-2026 via Screener.in and Trendlyne. Named public holders for Jun-2026 not retrieved' } },
  { callout: '**Our read:** a family-controlled company with a rising, unpledged promoter stake, which is good alignment. The weak spots are thin institutional ownership (no large domestic fund has bought in) and the absence of a long-term outside anchor since Bain Capital left in FY2021-22.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: an execution-focused family company with some related-party loops',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note]), source: 'FY26 annual report, Q1FY27 call' } },
    { verdicts: [
      ['Promoter alignment', 'Good', `Promoters ${G.promoterHoldingJun26Pct}% (from 44.8% in Dec-2023), no pledge; bought 1 cr shares at ₹316 via warrants.`, 'Family money at stake alongside minorities.'],
      ['Related parties', 'Weak', '₹183 cr in preference shares of the promoter holding company; tyre business funded through DBRL NCDs; group-company stakes.', 'Capital that sits outside the operating business.'],
      ['Board', 'Moderate', 'Three promoter executives (father and two sons) and four independent directors; CMD is also chairman.', 'Family-dominated; independent majority only just.'],
      ['Pay', 'Moderate', 'KMP pay ₹15.0 cr in FY26 (2% of PAT); CMD 70x and each executive director 61x median pay.', 'Not excessive for the profit, but high multiples.'],
      ['Audit and disclosure', 'Moderate', 'Singhi & Co, unqualified; no product-wise volume, price or margin disclosure; no annual guidance except the FY28 PAT goal.', 'Hard to check the investment case from outside.'],
      ['Capital allocation', 'Moderate', 'Disciplined in FY22-25 (low capex, debt repaid, phased LFP build); now ~₹2,000 cr into new areas plus ~₹490 cr already in tyre NCDs.', 'The next two years decide the verdict.'],
      ['Credit', 'Good', G.credit.replace(/Rs /g, '₹'), 'Lenders see a strong balance sheet.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'FY26 annual report, ICRA (Jul-2026), GAM research compilation' },
  ],
};

const segRow = (k, name, hist) => [name, hist == null ? '–' : n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.revenue.${i}|num}}`)];
const segE = (k, name, hist) => [name, hist == null ? '–' : n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.adjEbitda.${i}|num}}`)];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: below management\'s FY28 goal and a little below the street',
  blocks: [
    { p: 'We forecast three business lines. The core (pitch, carbon black, chemicals and captive power) is built from volume and EBITDA per tonne; tyres and battery materials have their own revenue and margin paths. Other income falls as cash goes into capex and we assume no repeat of FY26\'s fair-value gains; capex follows management (~₹1,000 cr in each of FY27 and FY28). Every assumption, with its reasoning, is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'table', title: 'Business-line forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      segRow('core', 'Carbon materials & chemicals revenue', A26.coreRev), segRow('oth', 'Others (Birla Tyres, mining) revenue', A26.othersRev), segRow('nem', 'New energy materials revenue', 0),
      segE('core', 'Core EBITDA', A26.coreEbitda), segE('oth', 'Others EBITDA', A26.othersEbitda), segE('nem', 'New energy materials EBITDA', null),
      ['Sales volume, core (000 t)', '564', '600', '648', '680'],
      ['Core EBITDA per tonne (₹)', n0(A26.coreEbitda * 1e7 / A26.volume), ...[0, 1, 2].map(i => n0(F.seg.core.adjEbitda[i] * 1e7 / [600000, 648000, 680400][i]))],
      ['Net cash and investments, model basis (year end)', n0(-M.annual.netDebt.at(-1)), ...[0, 1, 2].map(i => n0(F.treasury[i]))],
    ], source: 'Company (FY26 segment note; company EBITDA before forex), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' }, { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income', ref: 'fin.otherIncome' }, { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates (history: Screener EBITDA after forex)' } },
    { exhibit: { type: 'table', title: 'GAM vs the street and management (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Management / street FY28E'], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', `~${n0(CS.fy27RevCrDerived)} (+${CS.fy27RevGrowthPct}%)`, '{{F.sales.1|num}}', 'n.a.'],
      ['Net profit (₹ cr)', '{{F.pat.0|num}}', `~${n0(CS.fy27PatCrDerived)} (+${CS.fy27PatGrowthPct}%)`, '{{F.pat.1|num}}', '1,100+ (management goal)'],
      ['EPS (₹)', '{{F.eps.0|n1}}', `~${n1(CS.fy27PatCrDerived / 50.46)}`, '{{F.eps.1|n1}}', `~${n1(1100 / 50.46)} at ₹1,100 cr`],
    ], source: `${CS.source}; growth rates applied to FY26 actuals by GAM. Management goal: Q4FY26 and Q1FY27 calls. No FY28E consensus EPS dated by 30-Sep-2026 was found` } },
    { callout: `For FY27 we are ~${Math.round((1 - F.pat[0] / CS.fy27PatCrDerived) * 100)}% below the only consensus figure we found, mainly because we assume EBITDA per tonne eases from Q1's peak and other income falls (no fair-value gains). Our revenue is lower too (+${Math.round(F.salesGrowth[0])}% vs +${CS.fy27RevGrowthPct}%), as we assume realisations soften. For FY28 our net profit of ₹{{F.pat.1|num}} cr is ~${Math.round((1 - F.pat[1] / 1100) * 100)}% below management's ₹1,100 cr+ goal: reaching it needs EBITDA per tonne near Q1's ~₹23,700 or a faster battery ramp. Our EPS grows ~${Math.round(g2629)}% a year over FY26-29E.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: one institutional broker, at HOLD, with targets chasing the price',
  blocks: [
    { p: 'Coverage is thin for a ₹34,000 cr company. ICICI Securities is the only institutional broker with a standing call on 30-Sep-2026: HOLD, target ₹720 (17-Jul-2026), raised from ₹550 (Apr) and ₹470 (Jan) as the share price rose; its method is a sum of the parts with the core on FY28E EV/EBITDA (12x in Jan, 15x in Apr; the July multiple is not public). Retail desks are more bullish: Mehta Equities (Feb, ₹571, buy on dips; battery business at 2.2x invested capital, 30x FY27E P/E as a check) and a technical call from IDBI Capital\'s derivatives desk (Jun, ₹900). The one consensus figure we found (Trendlyne, one analyst) expects FY27 revenue +35% and profit +24%. Bulls point to the speciality mix and the battery option; the brokers\' own caution is about valuation and the battery timeline.' },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: ST.critiques.map(r => r.map(c => c.replace(/Rs /g, '₹'))), source: 'Broker notes, press and calls to 30-Sep-2026; GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
