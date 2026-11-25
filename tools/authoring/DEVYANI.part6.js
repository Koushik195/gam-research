// Devyani report, part 6: risks and honest summary, glossary, statement notes.
const X = require('./DEVYANI.ctx');
const { ruleText } = require('../../src/ratings');
const { F, n0, n1, n2, price, shares, evMULT, HEV, rating, buyBelow, sellAbove, medTp, ebitdaSep28, Q1, evSepNow, preMultAt, V, mv, phiSep, sectorEv, PF } = X;
const tpPerPp = pp => evMULT.base * (F.sales[1] + F.sales[2]) / 2 * pp / 100 * (1 - phiSep) / shares; // TP change for 1pp of Sep-28E EBITDA margin

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: `Our honest summary: ${rating} on a recovering KFC and a low multiple, not on cash returns`,
  blocks: [
    { callout: `**What you are buying:** the largest Yum! franchisee in India, with exclusive KFC and Pizza Hut rights in its territories, 2,255 restaurants, a KFC business that has just returned to same-store growth (+${Q1.kfcSssg}% in Q1FY27) and record after-rent EBITDA (${Q1.preIndAsMarginPct}% margin), half of a growing KFC Thailand, and an option on the Sapphire merger. You are also buying a Pizza Hut business that loses money, thin profits after depreciation and rent, ~₹1,722 cr of acquisition intangibles and a promoter structure that has paid for deals in shares.` },
    { callout: `**What you are paying:** ₹${n2(price)} is ${n1(evSepNow)}x Sep-28E EBITDA (minorities grossed up) and ≈${n1(preMultAt(price))}x after-rent EBITDA on the street's basis, against a ${n1(HEV.med)}x forward median since listing; QSR peers are ${Math.abs(Math.round(sectorEv))}% below their five-year medians. On earnings (${n1(price / F.eps[1])}x FY28E EPS) and on cash flows (DCF ₹${n0(mv('dcf').value)} before minorities) the stock is not cheap. The rule gives ${rating} because the multiple, not the cash, is low.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['KFC SSSG reaches the 5-6% guide and ADS passes ₹105k', 'Medium', `SSSG +${Q1.kfcSssg}% and ADS ₹${Q1.kfcAdsK}k in Q1FY27`],
      ['Store openings back on the 200-225 plan', 'Medium', '−1 net in Q1FY27 after the business-development reset'],
      ['Pizza Hut brand contribution turns positive', 'Low-Medium', 'Brand contribution −1.9% in Q1FY27; the push comes after the merger'],
      ['Merger approved with synergies on track', 'Medium-High', `CCI, then NCLT; worth ₹${n0(PF.mktSyn)}-${n0(PF.oursSyn)} a share in our sensitivity if synergies are delivered`],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['KFC SSSG slips back to zero (aggregator value meals, new chicken chains, weak monsoon)', 'Medium', 'India margin flat; our bear case {{scen.bear.tp|inr}}'],
      ['LPG, dairy and wage inflation, and the Labour Codes', 'Medium', 'Gross margin and staff costs; price increases risk traffic'],
      ['Merger dilution without synergies', 'Medium', `46% more shares; if Sapphire is worth only its market price, ₹${n0(PF.mktNoSyn)} a merged share vs our ₹${n0(V.tp)} standalone`],
      ['Yum! terms', 'Low-Medium', 'Royalty ~6.5% of revenue; development agreements are renewed at Yum!\'s discretion; one-time ~₹320 cr merger fee'],
      ['Thailand underperforms the acquisition case', 'Medium', 'Impairment of territory rights and goodwill; half of any upside goes to Camas'],
      ['QSR multiples keep falling', 'Medium', `Each 1x of EV/EBITDA is ~₹${n0(ebitdaSep28 * (1 - phiSep) / shares)} a share`],
      ['Stronger rupee', 'Low-Medium', 'International (33% of revenue) translated at lower rupee values'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**We would move to HOLD above ~₹${n0(buyBelow)}** and to SELL above ~₹${n0(sellAbove)} on today's numbers.`,
      `**This is a multiple call more than an earnings call.** Our EBITDA is ~5% below the street for FY28E; our target is above the street's ₹${n0(medTp)} median because Devyani's own five-year history (median ${n1(HEV.med)}x forward) is richer than the 25-27x after-rent multiples brokers now use, and the sector move (${n1(sectorEv)}%) does not take all of that away.`,
      `**Biggest swing factors:** the multiple (each 1x of Sep-28E EBITDA is ~₹${n0(ebitdaSep28 * (1 - phiSep) / shares)} a share after minorities) and the margin (each point of Sep-28E EBITDA margin moves the target by ~₹${n0(tpPerPp(1))}).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'KFC India SSSG', v: `+${Q1.kfcSssg}%`, d: 'Q1FY27; negative for 13 quarters before Q4FY26' },
      { k: 'Margin after rent', v: `${Q1.preIndAsMarginPct}%`, d: 'Q1FY27; 8.1% a year earlier' },
      { k: 'Temasek\'s share of Thailand', v: '52.45%', d: `~${n1(phiSep * 100)}% of group EBITDA` },
      { k: 'EV ÷ Sep-28E EBITDA', v: `${n1(evSepNow)}x`, d: `median since listing: ${n1(HEV.med)}x forward` },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['QSR', 'Quick-service restaurant: fast food sold over the counter, for dine-in, takeaway or delivery.'],
      ['Franchisee', 'A company that runs restaurants under another company\'s brand (here Yum!\'s KFC and Pizza Hut) for a royalty and fees.'],
      ['Ind AS 116', 'The accounting rule for leases: store rent is booked as depreciation of a right-of-use asset plus interest on a lease liability, not as an operating cost.'],
      ['EBITDA (reported, post-Ind AS)', 'Earnings before interest, tax, depreciation and amortisation as reported; under Ind AS 116 it excludes rent.'],
      ['Operating EBITDA (pre-Ind AS 116)', 'EBITDA after deducting rent; the measure the street\'s multiples use.'],
      ['Brand contribution', 'Store-level profit of a brand after food, staff, rent, utilities, marketing and royalty, before head-office costs.'],
      ['SSSG', 'Same-store sales growth: revenue growth of stores open at least a year.'],
      ['ADS', 'Average daily sales per store.'],
      ['On-premise / off-premise', 'Dine-in and takeaway / delivery.'],
      ['Minorities (non-controlling interests)', 'Outside shareholders in a subsidiary; here mainly Camas (Temasek), with 49% of the company that owns KFC Thailand.'],
      ['SOTP', 'Sum of the parts: each part valued separately, then debt and minorities deducted.'],
      ['Swap ratio', 'Shares of the acquirer given for each share of the company merged into it (177 Devyani for 100 Sapphire).'],
      ['NCLT / CCI', 'National Company Law Tribunal (approves mergers) / Competition Commission of India (approves combinations).'],
      ['EV/EBITDA, P/E', 'Enterprise value (market value plus debt including leases and minorities, less cash) ÷ EBITDA; share price ÷ earnings per share.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['Sector move', 'How far comparable stocks trade above or below their own median multiple on the valuation date.'],
      ['DCF', 'Discounted cash flow valuation; here with lease payments in the cash flow.'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'sales@FY22': '+84%: recovery from Covid lockdowns (FY21 −25%); IPO in Aug-2021.',
  'ebitdaMargin@FY22': '22.8%: post-Covid delivery boom.',
  'pat@FY23': '₹265 cr: the peak; deferred tax credit and strong KFC.',
  'sales@FY24': '+19%: Thailand from 17-Jan-2024 (2½ months).',
  'pat@FY24': '₹47 cr after minorities; includes a ₹151 cr post-tax exceptional gain (Screener schedule).',
  'sales@FY25': '+39%: first full year of Thailand.',
  'pat@FY25': '₹9 cr after minorities (−₹6.9 cr before; minorities took −₹16 cr).',
  'ebitdaMargin@FY26': '15.3% (Screener): KFC SSSG −0.8%, Pizza Hut −5.3%, BBK consolidated.',
  'otherIncome@FY26': 'Net of ₹21.5 cr exceptional items (Labour Codes) and ₹15.8 cr impairment.',
  'pat@FY26': '−₹38.6 cr after minorities (−₹42.5 cr before).',
  'cfo@FY26': 'Before ₹180 cr of lease principal and ₹223 cr of lease interest (financing cash flow).',
  'capex@FY27E': 'Forecast capex includes lease principal (₹200 cr in FY27E).',
  'pat@Q4FY24': '−₹49 cr before minorities, −₹7 cr after (first quarter with Thailand).',
  'otherIncome@Q3FY26': 'Net of the ₹21.5 cr exceptional Labour Code charge.',
  'sales@Q1FY26': 'Sky Gate (BBK) from 10-Jun-2025.',
  'pat@Q1FY27': '₹17.1 cr before minorities; ₹14.6 cr to owners.',
  'opm@Q1FY27': '16.1% before rent; 9.6% after rent (8.1% a year earlier).',
};

module.exports = { risks, glossary, statementNotes };
