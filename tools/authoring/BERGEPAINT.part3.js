// Berger Paints report, part 3: competition, moat, Q1FY27 & guidance, earnings quality, ownership, governance, forecasts.
const fs = require('fs');
const path = require('path');
const X = require('./BERGEPAINT.ctx');
const { C, D, F, A, AS, ROOT, n0, n1, pc, rup, SQ, Q1, FY26, b, ix, BL, isec, equ, nom, mncl, shortDate, impliedEps } = X;

// Peer growth and margins from each company's Screener file (consolidated)
const scr = sym => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', sym, 'screener.json'), 'utf8')).tables;
const yr = (sym, p) => { const T = scr(sym)['profit-loss'], i = T.periods.indexOf(p), j = T.periods.indexOf(`Mar ${+p.slice(-4) - 1}`); return { g: (T.rows.Sales[i] / T.rows.Sales[j] - 1) * 100, m: T.rows['Operating Profit'][i] / T.rows.Sales[i] * 100 }; };
const q1 = sym => { const T = scr(sym).quarters, i = T.periods.indexOf('Jun 2026'), j = T.periods.indexOf('Jun 2025'); return { g: (T.rows.Sales[i] / T.rows.Sales[j] - 1) * 100, m: T.rows['Operating Profit'][i] / T.rows.Sales[i] * 100 }; };
const row = (sym, k) => [X.shortName(sym), ...['Mar 2024', 'Mar 2025', 'Mar 2026'].map(p => `${n1(yr(sym, p)[k])}%`), `${n1(q1(sym)[k])}%`];

const competition = {
  id: 'competition', nav: 'The new competition', kicker: 'The central question', title: 'Birla Opus and JSW: Berger is holding volume share, but paying for it',
  blocks: [
    { p: 'Grasim launched Birla Opus in 2024 with large new plants and generous dealer terms; by Q1FY27 it was selling ₹1,661 cr of paint a quarter (+64% year on year), about half of Berger India\'s quarterly sales, and calls itself the No.3 organised decorative player. Investec estimates it took ~3-4% of the market in two years. In Dec-2025 JSW Paints took control of Akzo Nobel India (Dulux), creating a second well-funded challenger. Berger\'s own numbers show what that did. Volume kept growing (standalone 4-12% a quarter) and its share of the five listed players\' sales rose to a company-estimated 20.3% in FY25 and 21.2% in Q1FY26, because Asian Paints lost more. But value growth collapsed to −0.4% to +6.7%, and in Feb-2026 the MD conceded a small loss: share "was at 19.5, 19.6, it would have probably gone down to 19.4", gone "mostly to Birla". In Aug-2026 he said Berger had regained "a little bit" in Q1FY27.' },
    { exhibit: { type: 'table', title: 'Revenue growth: Berger beat the leader through the shock (consolidated, year on year)', head: ['Company', 'FY24', 'FY25', 'FY26', 'Q1FY27'], rows: ['BERGEPAINT', 'ASIANPAINT', 'KANSAINER', 'INDIGOPNTS'].map(s => row(s, 'g')), source: 'Screener.in (consolidated). Birla Opus is inside Grasim; JSW Dulux not on file' } },
    { exhibit: { type: 'table', title: 'EBITDA margin: everyone gave some back (consolidated)', head: ['Company', 'FY24', 'FY25', 'FY26', 'Q1FY27'], rows: ['BERGEPAINT', 'ASIANPAINT', 'KANSAINER', 'INDIGOPNTS'].map(s => row(s, 'm')), source: 'Screener.in (consolidated)' } },
    { h: 'Have margins reset lower?' },
    { p: `Partly. Berger's gross margin did not fall: the standalone figure was 41.2% and 42.3% in Q3-Q4FY26, the best in three years, helped by cheaper inputs, mix and the end of the anti-dumping duty on titanium dioxide. The money went below the gross line. In FY26 consolidated other expenses (which include advertising and selling costs) rose to 19.4% of revenue from 18.3%, and staff costs to 7.7% from 7.1%, so EBITDA margin fell from 16.1% to 15.4% even as gross margin rose. Management keeps guiding to 15-17% and Q1FY27 came in at 16.9%. Our read: the band has not moved, but Berger now needs a good gross margin just to stay in the middle of it, and any price give-back in FY28 lands on a cost base that has been raised for good.` },
    { bullets: [
      '**What the challenger is doing now (MD, 5-Aug-2026):** its dealer price list was ~5% below Berger\'s and has been raised to match; rebates to bigger dealers went up; "10% free material continues in most of the packs"; painter spends normalised. Intensity "reduced, but it still remains at an elevated level".',
      '**Other entrants:** smaller and foreign players together cut industry growth by "1-1 and a half percent" (MD, Feb-2026); Pidilite\'s Haisha is entering East India, Berger\'s home market.',
      '**Berger\'s response:** 11,100+ dealers added and 10,000+ tinting machines in FY26, 700 new stores, a corporate-brand campaign, new products (Kolor Plus, Roof Kool & Seal, Dampshield), and ad spend "on par" with its share while the challenger spends far above its share (MD).',
      '**The bull case on competition:** Investec (May-2026) thinks "peak competitive intensity may be over" and sees Opus\'s further gains at ~1.5-2%; ICICI Securities notes Birla Opus raised prices more than peers in 2026.',
    ] },
    { callout: '**Verdict:** Berger is not losing the volume war; three-year revenue growth of 4% a year beat Asian Paints\' 1% and Kansai\'s 2%. It has lost the pricing it used to enjoy, and it now spends more on dealers and brand to stand still. The 2026 price rises were an industry event caused by crude, not proof that discipline is back. We assume the 15-17% margin band holds, but at {{F.ebitdaMargin.1|pct}} in FY28E, not the top of it.' },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: a narrow moat in decorative, a real one in protective coatings',
  blocks: [
    { verdicts: D.moat.map(r => r.map(rup)), head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'GAM research compilation (company filings and calls, CRISIL, broker notes to Sep-2026)' },
    { callout: '**Honest verdict:** in decorative paints Berger has scale, a dense dealer and tinting network and a known brand, but not a wide moat. The last two years proved it: a new entrant with money built a No.3 position in about two years, and Berger had to cut prices in economy products and spend more to keep its share. The moat protects **volume share**, not **price**. The one place it is genuinely hard to dislodge is industrial (No.1 in protective coatings, JVs with Nippon Paint and Becker), and that is under a fifth of sales. Net: a well-run No.2 in an industry that has become more competitive for good; it does not deserve the premium multiple it carried in 2021.' },
  ],
};

const guidance = {
  id: 'guidance', nav: 'Q1FY27 & guidance', kicker: 'Momentum', title: 'Q1FY27: double-digit growth, mostly price, and margin up 40bp',
  blocks: [
    { exhibit: { type: 'table', title: 'Q1FY27 at a glance (₹ crore)', head: ['', 'Q1FY26', 'Q1FY27', 'Change'], rows: [
      ['Consolidated revenue', n0(Q1.consRevenuePrior), n0(Q1.consRevenue), pc(Q1.consRevenueYoYPct)],
      ['  Standalone revenue', n0(Q1.saRevenuePrior), n0(Q1.saRevenue), pc(Q1.saRevenueYoYPct)],
      ['  Standalone volume growth', '5.6% (decorative)', `${Q1.saVolumePct}%`, `price/mix ~${Q1.saPriceMixPct}%`],
      ['  Subsidiaries (consolidated less standalone)', n0(Q1.subsRevenuePrior), n0(Q1.subsRevenue), pc((Q1.subsRevenue / Q1.subsRevenuePrior - 1) * 100)],
      ['Material cost, % of revenue (consolidated)', `${Q1.consMaterialPctPrior}%`, `${Q1.consMaterialPct}%`, '+50bp'],
      ['Standalone gross margin', `${Q1.saGrossMarginPctPrior}%`, `${Q1.saGrossMarginPct}%`, '−80bp'],
      ['Consolidated EBITDA', n0(Q1.consEbitdaPrior), n0(Q1.consEbitda), pc(Q1.consEbitdaYoYPct)],
      ['EBITDA margin', `${Q1.consEbitdaMarginPctPrior}%`, `${Q1.consEbitdaMarginPct}%`, '+40bp'],
      ['Other income + JV share', n0(Q1.consOtherIncomePrior + Q1.consJvSharePrior), n0(Q1.consOtherIncome + Q1.consJvShare), pc(((Q1.consOtherIncome + Q1.consJvShare) / (Q1.consOtherIncomePrior + Q1.consJvSharePrior) - 1) * 100)],
      ['Exceptional items', n1(Q1.consExceptionalPrior), '–', 'warehouse fire in Q1FY26'],
      { hl: true, cells: ['**Net profit**', `**${n0(Q1.consPatPrior)}**`, `**${n0(Q1.consPat)}**`, `**${pc(Q1.consPatYoYPct)}**`] },
    ], source: 'Q1FY27 investor presentation (5-Aug-2026); call transcript' } },
    { bullets: [
      '**Decorative led:** value ~13.5%, the best in 12 quarters, operating profit ~+20%; exterior emulsions and Kolor Plus did well; construction chemicals and wood coatings grew strongly.',
      '**Industrial lagged:** protective, GI and powder grew less because price rises came at the end of the quarter; automotive grew double digits. Gross margin slipped because of this lag, not decorative.',
      '**Net cash rose** to ₹1,424 cr at Jun-2026 (₹1,198 cr at Mar-2026); most of it is earmarked for the Panagarh and Odisha plants.',
      '**Why profit grew 29% while EBITDA grew 15%:** Q1FY26 carried a ₹36.8 cr fire charge (later recovered from insurers), and other income rose with the cash pile. Adjusted for the charge, PAT grew ~15%.',
    ] },
    { exhibit: { type: 'table', title: 'What management said (Feb-Aug 2026)', head: ['When', 'Topic', 'What was said', 'Outcome so far'], wide: [2, 3], rows: C.guidance.map(g => [shortDate(g.date), g.item, rup(g.said), rup(g.outcome) || '–']), source: rup(C.guidanceSrc) } },
    { callout: '**Why it matters:** management\'s record on the 15-17% margin band is good (FY24-26 all inside it). Its volume calls are reasonable. The open question is price: the 7.5-8.5% realisation guided for Q2 depends on mix, and the MD himself flagged that a price cut in H2 is possible if raw materials fall "substantially, and there is peace". We assume most of the price holds in FY27 and some is given back in FY28.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Earnings quality', kicker: 'Earnings quality', title: 'Earnings quality: clean and cash-backed, with thin disclosure on the business lines',
  blocks: [
    { bullets: [
      `**Cash backs profit.** Operating cash flow was ${Math.round(A.cfoToPat[b])}% of net profit in FY26, ${Math.round(A.cfoToPat[b - 1])}% in FY25 and ${Math.round(A.cfoToPat[b - 2])}% in FY24; over FY15-26 cash from operations (₹${n0(A.cumulative.cfo)} cr) exceeded net profit (₹${n0(A.cumulative.pat)} cr). FY22 (68%) was the exception, when inventory was built as input prices rose.`,
      '**One-offs are small and explained.** FY26: a ₹53.3 cr Labour Code charge (Q3) and a ₹36.8 cr warehouse fire (Q1) offset by an insurance claim receivable (Q4). Adding back the Labour Code charge, FY26 profit was roughly ₹1,170 cr, about flat on FY25.',
      `**Other income is modest.** Screener's other income (₹${n0(A.otherIncome[b])} cr in FY26, ${Math.round(A.otherIncomeShare[b])}% of pre-tax profit) is the company's other income (₹106.7 cr: treasury ₹61.8 cr, recurring items such as discounts and miscellaneous income ₹33.5 cr, one-offs ₹11.4 cr; AR note 36) plus the share of JV profit (₹${n0(FY26.consJvShare)} cr) less the ₹53.3 cr exceptional charge.`,
      '**Revenue is net of dealer schemes.** Rebates, discounts and free material are deducted from revenue; rising schemes show up as weaker value growth, which is what happened in FY25-26.',
      '**Disclosure.** One reported segment; decorative vs industrial only as growth rates and an annual share; volume growth every quarter but no tonnage or realisation; market-share figures on a changing basket (21.2% in a company chart, "~20%" and "19.4%" elsewhere).',
      '**Auditor change.** B S R & Co. LLP replaced S. R. Batliboi & Co. LLP from the 2025 AGM at the end of its term; FY26 opinion unqualified.',
    ] },
    { callout: '**Accounting flag: GREEN.** Strong cash conversion, small and explained one-offs, a simple balance sheet and a Big-Four auditor. The weaknesses are disclosure (no segment margins) and the dependence of reported revenue on scheme accounting in a price war.' },
  ],
};

const OH = D.ownership;
const ownership = base => ({ ...base, blocks: [
  { p: `The Dhingra family owns ${OH.categoriesPct.promoter}% (Jun-2026), mostly through U K Paints (India) Pvt Ltd (${OH.promoterVehicles[0].pct}%), at the 75% maximum allowed for a listed company. Foreign investors own only ${OH.categoriesPct.fii}% (down from 10.7% in Dec-2023), Indian institutions ${OH.categoriesPct.dii}% (mutual funds ${OH.categoriesPct.mutualFunds}%, insurers ${OH.categoriesPct.insurance}%) and the public ${OH.categoriesPct.public}%. The number of shareholders fell from ~${Math.round(OH.counts.shareholdersDec23 / 1000)},000 (Dec-2023) to ~${Math.round(OH.counts.shareholders / 1000)},000 (Jun-2026).` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Largest holders (30-Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.promoterVehicles.map(h => [h.name, h.pct + '%', 'Promoter group']),
    ['All promoters', OH.categoriesPct.promoter + '%', 'At the 75% ceiling'],
    ...OH.institutions.map(h => [h.name, h.pct + '%', /Insurance/.test(h.name) ? 'Insurer' : /Fund$/.test(h.name) && /SBI/.test(h.name) ? 'Mutual fund' : 'Foreign fund']),
    ['Foreign portfolio investors (all)', OH.categoriesPct.fii + '%', ''],
    ['Mutual funds (all)', OH.categoriesPct.mutualFunds + '%', ''],
  ], source: rup(OH.src) + '. Promoter pledge data were not checked.' } },
  { callout: '**Our read:** a stable family owner with a professional MD. The free float is only 25% and three holders (SBI Large & Midcap Fund, LIC, Nalanda) own ~11% of the company, so the stock is thinly traded; foreign funds have been sellers for two years.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a family board, a long-serving professional CEO',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, rup(m.note) || '']), source: rup(C.managementSrc) } },
    { verdicts: [
      ['Audit and accounts', 'Strong', 'B S R & Co. LLP (since the 2025 AGM), previously S. R. Batliboi; unqualified opinions.', 'No accounting red flags.'],
      ['Promoter', 'Strong', '75% held by the Dhingra family since 1991; Dec-2025 restructuring moved shares inside the group (U K Paints (India) now 64.56%).', 'Aligned, patient owner.'],
      ['Professional management', 'Strong', 'Abhijit Roy MD & CEO since 2012 (with Berger since 1996), re-appointed to Jun-2031; revenue up 4x and profit 6x during his tenure.', 'Continuity; succession not yet visible.'],
      ['Board', 'Moderate', 'Four promoter-family directors (incl. the non-executive Chairman and Vice Chairman) and five non-family non-executive directors (₹8.25 lakh each in FY26).', 'Family influence is high.'],
      ['Pay', 'Moderate', 'MD ₹10.55 cr in FY26 (110x the median employee, +13%) in a year profit fell 5%; family Chairman and Vice Chairman ₹0.79 cr each in commission.', 'High in a weak year.'],
      ['Capital allocation', 'Moderate', 'Dividends ~35-40% of profit; ₹1,800-2,000 cr of new plants into an industry adding capacity; small acquisitions only; no buyback.', 'Returns on the new plants are the test.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation (AR FY26)' },
  ],
};

const gapTxt = (g, ...xs) => { const v = xs.filter(Boolean).map(x => Math.round((g / x - 1) * 100)); const lo = Math.min(...v), hi = Math.max(...v); return lo === hi ? `${lo >= 0 ? '+' : '−'}${Math.abs(lo)}%` : `${lo >= 0 ? '+' : '−'}${Math.abs(lo)}% to ${hi >= 0 ? '+' : '−'}${Math.abs(hi)}%`; };
const blRow = (name, base, arr) => [name, n0(base), ...arr.map(v => n0(v))];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: a price-led FY27, then ~9-10% growth; EPS ~10% a year after FY27',
  blocks: [
    { p: 'Berger reports one segment, so our model runs on consolidated revenue growth and EBITDA margin, cross-checked against a build of the two business lines the company describes (decorative ~82%, industrial ~18% of FY26 sales). Depreciation is 7% of gross block (the model expenses capex at once, so the rate is set to match the Q1FY27 run-rate); other income is 7% on opening net cash, plus the share of JV profit and only the recurring non-treasury items in the FY26 accounts (note 36), giving {{F.otherIncome.0|num}} / {{F.otherIncome.1|num}} / {{F.otherIncome.2|num}} cr; tax 25%; payout 40%. Every assumption, with our reasoning, is in the Excel model\'s Assumptions sheet, which recalculates this report\'s target price.' },
    { exhibit: { type: 'table', title: 'Business-line build (₹ crore; checked to sum to model revenue)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      blRow('Decorative', BL.base.deco, X.decoF), ['  growth', '', ...BL.growth.deco.map(g => `+${g}%`)],
      blRow('Industrial', BL.base.industrial, X.indF), ['  growth', '', ...BL.growth.industrial.map(g => `+${g}%`)],
      { hl: true, cells: ['**Revenue (model)**', `**${n0(A.sales[b])}**`, '**{{F.sales.0|num}}**', '**{{F.sales.1|num}}**', '**{{F.sales.2|num}}**'] },
    ], source: 'AR FY26 (82/18 split); GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'Group P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' },
      { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Other income (incl. JV share)', ref: 'fin.otherIncome' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'Cash & investments (forecasts net of debt)', ref: 'fin.treasury' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates. Cash is gross in actual years and net of borrowings (~₹635 cr) in forecasts.' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      [`EPS (₹), ICICI Securities (${shortDate('2026-05-13')})*`, '{{F.eps.0|n1}}', n1(isec.eps.FY27E), '{{F.eps.1|n1}}', n1(isec.eps.FY28E)],
      [`EPS (₹), Equirus (${shortDate(equ.date)})`, '{{F.eps.0|n1}}', n1(equ.eps.FY27E), '{{F.eps.1|n1}}', n1(equ.eps.FY28E)],
      [`EPS (₹), Nomura (${shortDate(nom.date)}), implied by ₹${nom.tp} at ${nom.multiple}`, '{{F.eps.0|n1}}', 'n.a.', '{{F.eps.1|n1}}', n1(impliedEps(nom))],
      [`EPS (₹), Monarch Networth (${shortDate(mncl.date)}), implied by ₹${mncl.tp} at ${mncl.multiple}`, '{{F.eps.0|n1}}', 'n.a.', '{{F.eps.1|n1}}', n1(impliedEps(mncl))],
      ['Revenue (₹ cr), ICICI Securities / Equirus', '{{F.sales.0|num}}', `${n0(isec.sales.FY27E)} / ${n0(equ.sales.FY27E)}`, '{{F.sales.1|num}}', `${n0(isec.sales.FY28E)} / ${n0(equ.sales.FY28E)}`],
      ['EBITDA margin, ICICI Securities / Equirus', '{{F.ebitdaMargin.0|pct}}', `${n1(isec.ebitdaMarginPct.FY27E)}% / ${n1(equ.ebitdaMarginPct.FY27E)}%`, '{{F.ebitdaMargin.1|pct}}', `${n1(isec.ebitdaMarginPct.FY28E)}% / ${n1(equ.ebitdaMarginPct.FY28E)}%`],
    ], source: 'ICICI Securities and Equirus result reviews (13-May-2026, PDFs); Nomura via Business Standard (6-Aug-2026); Monarch Networth (5-Aug-2026). * ICICI raised its target after Q1 (₹575); revised EPS not seen. Implied EPS = target ÷ multiple (GAM).' } },
    { callout: `Our FY28E EPS is ${gapTxt(F.eps[1], isec.eps.FY28E, equ.eps.FY28E, impliedEps(nom), impliedEps(mncl))} versus the four street figures we could find (₹${n1(Math.min(isec.eps.FY28E, equ.eps.FY28E, impliedEps(nom), impliedEps(mncl)))}-${n1(Math.max(isec.eps.FY28E, equ.eps.FY28E, impliedEps(nom), impliedEps(mncl)))}): in the middle. We are above Equirus because we assume more of the 2026 price rise sticks in FY27; below ICICI Securities and Nomura because we assume part of the price is given back in FY28. EPS grows ~${Math.round(X.epsCagrFwd)}% a year over FY26-29E, but only ~${Math.round(X.epsCagr2729)}% a year after FY27.` },
  ],
};

module.exports = { competition, moat, guidance, quality, ownership, governance, forecasts };
