// Info Edge (India) report, part B: cover, risks & honest summary, glossary, statement notes, and the merge of
// NAUKRI.part2-6.js (built on NAUKRI.ctx.js). Written as of 30-Sep-2026 (Q1FY27 basis). Forecast and valuation figures
// are live tokens ({{...}}) that follow assumptions.json.
const X = require('./NAUKRI.ctx');
const P2 = require('./NAUKRI.part2'), P3 = require('./NAUKRI.part3'), P4 = require('./NAUKRI.part4'), P5 = require('./NAUKRI.part5'), P6 = require('./NAUKRI.part6');
const { n0, n1, price, sh, ps, rating, buyBelow, sellAbove, ruleText, listedMv, etMv, pbMv, DISC, RECX, REX, SOTP, recPatSep, discNow, discMedRecent, impMed25, sectorDr, UNL, CASH, medTp, mcap, ltv } = X;
const B = SOTP.base, per10 = etMv * 0.1 * (1 - DISC.base / 100) / sh;
const opsPs = ps(B.rec + B.re + B.oth);

const cover = {
  headline: `The best franchise in Indian internet, priced about right: HOLD`,
  lead: `Info Edge owns **Naukri.com**, India's dominant jobs marketplace (FY26 Recruitment revenue ₹2,256 cr at a 57% segment margin), the property site 99acres, Jeevansathi and Shiksha, and **12.4% of Eternal and 12.1% of PB Fintech**. On ${X.ASOF_TXT} those two stakes were worth ₹${n0(ps(listedMv))} a share, ${Math.round(listedMv / mcap * 100)}% of the ₹${n0(price)} price, and cash another ₹${n0(ps(CASH))}. We value the company the way the street does, as a **sum of the parts**: Recruitment at **${RECX.base}x** Sep-28E profit (the median of the current street multiples), 99acres at ${REX.base}x sales, the stakes at market less a **${DISC.base}% holding-company discount** (Info Edge's own median since Sep-2025: the full Sep-2021 to Jun-2026 median is a large premium, because the market paid 40-90x for Naukri until mid-2025), unlisted investments at book and cash. That gives **{{dcf.tp|inr}} ({{dcf.upside|chg}}): we initiate with ${rating}.** Bull {{scen.bull.tp|inr}} (Naukri at 30x, no discount); bear {{scen.bear.tp|inr}} (AI slows hiring, Naukri at IndiaMART's 20x, a ${DISC.bear}% discount).`,
  arguments: [
    { h: 'Naukri is growing faster again', p: `Recruitment billings rose 17.5% in Q1FY27 (GCCs +31%, IT/BPM +15%) after ~10% a year in FY26, and the segment margin reached 58.3%. AI products (AI-Rex at 4,000+ enterprises, candidate services +35%) are adding revenue, not taking it. We forecast Recruitment revenue +14.5% / +13% / +12% and profit after corporate costs of ₹${n0(recPatSep('base'))} cr on a Sep-28E basis.` },
    { h: 'The market has already re-priced Naukri', p: `With the stakes at JM Financial's 25% discount, the price implied ~${Math.round(impMed25)}x next-year Recruitment profit over 2021-26 (median) and ~${Math.round(discNow.impliedRecX)}x on ${X.ASOF_TXT}. IndiaMART, the only other classifieds stock with a long history, trades ${Math.abs(Math.round(sectorDr))}% below its own five-year median P/E. At ${RECX.base}x the operating businesses are worth ₹${n0(opsPs)} a share in our SOTP.` },
    { h: 'More than half of what you buy is Eternal and PB Fintech', p: `The stakes (₹${n0(ps(etMv))} + ₹${n0(ps(pbMv))} a share) dominate the value and the share price follows them: every 10% move in Eternal is ~₹${n0(per10)} a share. Info Edge has not sold a share of either since the IPOs. Since early 2026 the market has applied a discount (${Math.round(discNow.disc)}% on ${X.ASOF_TXT} on our convention); we assume ${DISC.base}%.` },
    { h: 'Why HOLD, not BUY', p: `The street (median ₹${n0(medTp)}) is more positive mostly because it uses a higher Naukri multiple (JM 30x) or no discount (Motilal Oswal). Measured consistently, a higher Naukri multiple also means a wider measured discount, so the target barely moves (₹${n0(P6.tpAt(Math.round(P6.discAt(30)), 30))} at 30x). The stock needs either faster Naukri growth or a rally in Eternal to offer 15%.` },
  ],
  keyRows: [['Revenue (₹ cr)', 'sales', 'num'], ['growth', 'salesGrowth', 'chg'], ['EBITDA margin', 'ebitdaMargin', 'pct'], ['Net profit after minorities (₹ cr)', 'pat', 'num'], ['EPS (₹)', 'eps', 'n1'], ['EPS growth', 'epsGrowth', 'chg']],
  flags: [
    { k: 'Accounting', v: 'AMBER' },
    { k: 'Predictability', v: 'AMBER' },
    { k: 'Earnings momentum', v: 'GREEN' },
    { k: 'Competitive position', v: 'GREEN' },
    { k: 'Valuation', v: 'AMBER' },
  ],
  catalysts: [
    'Q2FY27 results (due by mid-November 2026): whether Recruitment billings hold above 15% and 99acres turns profitable for a full quarter.',
    'Eternal\'s and PB Fintech\'s share prices: together ~56% of Info Edge\'s market value.',
    'The pre-results business update for Q2FY27 (Info Edge publishes standalone billings within about ten days of the quarter-end).',
    'Any sale of Eternal or PB Fintech shares, a buyback or a special dividend: none announced.',
    'AI products (AI-Rex, Talent Pulse) moving from pilots to scaled revenue; price increases in Naukri.',
  ],
};

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: a great business at a fair price, with a portfolio attached',
  blocks: [
    { callout: `**What you are buying:** ₹${n0(ps(etMv))} a share of Eternal and ₹${n0(ps(pbMv))} of PB Fintech at market; ₹${n0(ps(CASH))} of cash and ₹${n0(ps(UNL))} of other investments at book; and India's best classifieds business, Naukri, which earns ~57% segment margins and is growing faster again, plus a 99acres close to profit. Before any discount, ~₹${n0(ps(ltv))} a share on our numbers.` },
    { callout: `**What you are paying:** ₹${n0(price)}. Our ${DISC.base}% base-case discount (the median since Sep-2025) gives {{dcf.tp|inr}} ({{dcf.upside|chg}}). Motilal Oswal (₹1,250, Neutral) is close to us; ICICI Securities (₹1,600) and JM Financial (₹1,350) are higher mainly on the Naukri multiple and, for MOSL and ICICI, no discount on the stakes.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['Recruitment billings stay above 15% for several quarters', 'Medium', 'Quarterly billings update; GCC and IT hiring'],
      ['99acres reaches double-digit margins', 'Medium', 'Segment result; management says cash-generative in FY27'],
      ['A capital-return step on the stakes', 'Low', 'Partial sale of Eternal or PB Fintech shares, a buyback or special dividend'],
      ['Eternal and PB Fintech keep rising', 'Medium', `~₹${n0(per10)} a share for every 10% move in Eternal`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What would make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['AI reduces white-collar hiring or recruiters\' reliance on Naukri', 'Medium', `Bear case: Recruitment +10%, margin −2.5 points, ${RECX.bear}x: target {{scen.bear.tp|inr}}`],
      ['The discount widens again (40% in Jun-2026)', 'Medium', `Each 5 points ~₹${n0(listedMv * 0.05 / sh)} a share`],
      ['Eternal or PB Fintech fall (both trade at high multiples)', 'Medium', `~₹${n0(per10)} a share for each 10% fall in Eternal`],
      ['More cash into start-ups that get written off', 'Medium', '₹673 cr written off or provided for by Mar-2023; ₹72 cr provision in Q1FY27'],
      ['99acres losses return in a property slowdown', 'Low-medium', 'FY26 loss ₹59 cr; competition from Housing.com and MagicBricks'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**BUY below ~₹${n0(buyBelow)}; HOLD up to ~₹${n0(sellAbove)}** on our target.`,
      '**For investors who want Naukri:** Info Edge is the only way to own it, but most of the money buys Eternal and PB Fintech; own it if you are also happy owning those two at today\'s prices.',
      `**Biggest swing factors:** Eternal's share price and the discount (each 5 points ~₹${n0(listedMv * 0.05 / sh)}); then Naukri's multiple.`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Stakes as % of market value', v: `${Math.round(listedMv / mcap * 100)}%`, d: `₹${n0(ps(listedMv))} a share` },
      { k: 'Discount on the stakes', v: `${Math.round(discNow.disc)}%`, d: `${Math.round(discMedRecent)}% median since Sep-2025` },
      { k: 'Recruitment billings growth, Q1FY27', v: '+17.5%', d: 'segment margin 58.3%' },
      { k: 'Implied Naukri P/E (stakes at 25%)', v: `${Math.round(discNow.impliedRecX)}x`, d: `${Math.round(impMed25)}x median 2021-26` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Holding company (holdco) discount', 'How far below their market value the market values the listed stakes inside Info Edge: 1 − (Info Edge market value − operating businesses − cash − unlisted) ÷ stakes at market.'],
      ['Look-through value', 'What Info Edge\'s businesses and stakes are worth separately, before any discount.'],
      ['Sum of the parts (SOTP)', 'Valuing each business and stake separately and adding them up.'],
      ['Standalone / consolidated', 'Info Edge (India) Ltd alone (Naukri, 99acres, Jeevansathi, Shiksha) / plus its subsidiaries, venture funds and joint ventures.'],
      ['Billings', 'The value of contracts sold in a period; revenue is recognised over the subscription, so billings lead revenue.'],
      ['Segment result', 'A segment\'s profit before tax, after its own costs, depreciation and lease interest, before corporate costs and other income.'],
      ['Recruitment profit', 'Our valuation base: Recruitment segment result less all corporate costs, taxed at 25.17%.'],
      ['AIF', 'Alternative investment fund: Info Edge\'s venture funds, part-owned by outside investors (the minorities in the accounts).'],
      ['Fair value / OCI', 'Investments marked to market; changes go through profit (FVTPL) or other comprehensive income (OCI), not cash.'],
      ['GCC', 'Global capability centre: an in-house technology or service centre of a multinational in India.'],
      ['EV/sales', 'Enterprise value ÷ revenue; used for businesses that make little or no profit yet.'],
      ['P/E, forward P/E', 'Price ÷ earnings per share; forward = on the next full year\'s EPS.'],
      ['Sep-28E', 'The average of FY28E and FY29E: the twelve months forward from our target date.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = {
  rating, cover,
  sections: p => [P2.narrative, P2.business, P2.history, P3.industry, P3.tailwind, P3.recruitment, P3.acres, P3.others, P3.investments, P4.moat, p.financials, p.capital, P4.quality, p.balance, P4.ownership(p.ownershipBase), P4.governance, P5.forecasts, P5.street, P6.valuation, risks, p.statements, glossary],
  statementNotes: {
    'pat@FY22': 'Includes the ₹8,941 cr fair-value gain on Zomato at its listing (exceptional item); EPS ₹198.',
    'pat@FY23': 'Loss after write-downs and provisions on start-up investments and losses of consolidated start-ups.',
    'otherIncome@FY22': 'Includes the Zomato listing gain (Screener puts exceptional items in other income).',
    'otherIncome@FY25': 'Includes fair-value gains of the venture funds (AIFs); ₹948 cr classed as exceptional by Screener.',
    'otherIncome@FY26': 'Includes ~₹821 cr of exceptional items and AIF fair-value gains; standalone also booked a ₹5,200 cr Makesense/PB Fintech gain, which does not appear in the consolidated P&L.',
    'pat@FY26': 'Attributable profit after ₹313 cr of minorities (outside investors in the AIFs).',
    'pat@FY27E': 'No fair-value gains forecast, so profit falls from FY26 even though EBITDA rises ~25%.',
    'ebitda@FY24': 'Losses of consolidated start-ups narrowed (subsidiaries and eliminations EBITDA −₹244 cr vs −₹436 cr in FY23).',
  },
};
