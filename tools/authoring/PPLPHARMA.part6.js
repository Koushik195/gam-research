// Piramal Pharma report, part 6: risks & honest summary, glossary (statement notes in part6b).
const X = require('./PPLPHARMA.ctx');
const { F, V, AS, n0, n1, price, mv, MULT, EVH_BASE, EVH, rating, ruleText, buyBelow, sellAbove, ytd, SENS, ebitdaSep28, sh, DCFV, K } = X;

const risks = {
  id: 'risks', nav: 'Risks & honest summary', kicker: 'Summary', title: 'Our honest summary: upside on the multiple the market has paid for Piramal, but a stock for those who can live with thin profits and high debt',
  blocks: [
    { callout: `**What you are buying:** a global CDMO with a rare regulatory record, ADC and high-potency capabilities and under-used plants in the US and UK that could earn a lot if filled; the US leader in inhaled anaesthetics with a new acquired brand (Kenalog); a fast-growing but barely profitable Indian consumer business; 49% of a profitable eye-care JV with AbbVie; and ₹4,140 cr of net debt. Revenue is growing again (+17% in Q1FY27) and we expect EBITDA to rise ~60% by FY28E.` },
    { callout: `**What you are paying:** ₹${n0(price)} is ~${n1(X.evNowSep)}x our Sep-28E EBITDA after net debt and the JV, ${n1(price / F.eps[1])}x FY28E EPS, after a ~${Math.round(ytd)}% rise in 2026. Our ${MULT.base}x is Piramal's own forward median since May-2023 (${n1(EVH_BASE.med)}x, every weekly point), lifted ${((K - 1) * 100).toFixed(1)}% for a sector trading above its history: {{dcf.tp|inr}} ({{dcf.upside|chg}}). Earnings-based and cash-flow checks are much lower (P/E ₹${n0(mv('pe').value)}, DCF ₹${n0(mv('dcf').value)}).` },
    { p: `**Why ${rating}, and how confident are we?** The rule compares the price with a target built on the street's method (a sum of the parts on EV/EBITDA) at the multiple Piramal itself has traded on since May-2023, and on our recovery numbers that is ~${Math.round(V.upside)}% above the price. We do not need the bulls' margins for it: ICICI Direct's 16-18% path would add another ~₹40-60 a share. But the call rests on the market paying its historical multiple again. That history includes Apr-24 to Mar-25, when EV/EBITDA reached ~33x on collapsing EBITDA; without those dates the target would be ₹${n0(SENS[1].tp)} (HOLD), and on earnings (₹${n0(mv('pe').value)}) or cash flows (₹${n0(mv('dcf').value)}) the stock looks expensive. **What would change our mind:** H2FY27 margins below ~12% (orders not converting), another customer destocking, or a CARE downgrade on leverage.` },
    { exhibit: { type: 'table', title: 'What would make us more positive', head: ['Trigger', 'Likelihood', 'What we watch'], wide: [2], rows: [
      ['CDMO orders convert at the US/UK sites; FY27 margin above 14%', 'Medium', 'H2FY27 margin; commentary on overseas utilisation'],
      ['The destocked on-patent product returns in FY28', 'Low-medium', 'Customer EXIM data; management comment'],
      ['Kenalog and ex-US sevoflurane lift CHG to double-digit growth', 'Medium', 'Q2-Q3FY27 CHG revenue'],
      ['Carlyle sells cleanly to long-only investors', 'Medium', 'Block deals; Sep-2026 shareholding (filed in October)'],
      ['Delivered H2FY27 margins at or above our 13% for the year', 'Medium', 'Would support the historical multiple the target uses'],
    ], source: 'GAM Research' } },
    { exhibit: { type: 'table', title: 'What could make it worse', head: ['Risk', 'Likelihood', 'Impact'], wide: [2], rows: [
      ['Biotech funding cools again; RFPs do not convert; overseas sites stay under-used', 'Medium', 'Margins stall near 10-12%; bear case {{scen.bear.tp|inr}}'],
      ['Another large customer destocks or switches supplier', 'Medium', 'FY26 showed one product can cut CDMO revenue 10%'],
      ['Chinese price pressure spreads to US anaesthesia', 'Low-medium', 'CHG margin falls from ~20%'],
      ['Leverage: CARE downgrade if net debt/PBILDT stays above 3.5x', 'Medium', 'Higher funding costs; Kenalog contingent payment (up to ~₹620 cr) adds debt'],
      ['Tax stays high as overseas losses persist', 'Medium-high', 'Each 10pp of FY28E tax rate is ~₹0.45 of EPS'],
      ['Rupee recovery', 'Low-medium', 'Removes 9-10 points of reported growth (Q1FY27)'],
      ['Regulatory: an adverse USFDA outcome at a key site', 'Low', 'The record so far is clean'],
    ], source: 'GAM Research' } },
    { h: 'How we would act' },
    { bullets: [
      `**Rating: ${rating}, target {{dcf.tp|inr}} ({{dcf.upside|chg}}).** ${ruleText}`,
      `**On today's numbers the rule says BUY below ~₹${n0(buyBelow)}**, HOLD up to ~₹${n0(sellAbove)} and SELL above it.`,
      `**Biggest swing factors:** the multiple (each 1x on Sep-28E EBITDA of ₹${n0(ebitdaSep28)} cr is ~₹${n0(ebitdaSep28 / sh)} a share; the EPS reading of the trough rule would take ~₹${n0(SENS[0].tp - SENS[1].tp)} off) and the margin (each point of FY28E margin is ~₹${n0(F.sales[1] / 100)} cr of EBITDA).`,
    ] },
    { exhibit: { type: 'tiles', title: 'The case in five numbers', tiles: [
      { k: 'Q1FY27 revenue growth', v: '+17%', d: '~9-10 points from the rupee' },
      { k: 'EBITDA margin', v: `10.4% → ${n1(AS.ebitdaMargin[1])}%`, d: 'FY26 → FY28E (Screener basis)' },
      { k: 'EPS', v: `₹${n1(F.eps[1])}`, d: 'FY28E, after D&A, interest and tax' },
      { k: 'Net debt', v: '₹4,140 cr', d: 'Mar-26; 3.6x company EBITDA' },
      { k: 'Target', v: '{{dcf.tp|inr}}', d: 'bull {{scen.bull.tp|inr}} · bear {{scen.bear.tp|inr}}' },
    ], source: 'GAM Research' } },
  ],
};

const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['CDMO', 'Contract development and manufacturing organisation: develops and makes medicines for other pharma companies to their designs.'],
      ['RFP', 'Request for proposal: a customer asks CDMOs to bid for a project; more RFPs usually mean more orders later.'],
      ['On-patent commercial manufacturing', 'Supplying a customer\'s patented, approved drug; usually the most profitable and longest-lasting CDMO work.'],
      ['Destocking', 'A customer uses up its inventory instead of ordering, so the supplier\'s sales fall even if end demand is unchanged.'],
      ['ADC / payload-linker / conjugation', 'Antibody-drug conjugate: an antibody carrying a potent drug (payload) attached by a linker; conjugation joins them.'],
      ['HPAPI', 'High-potency active ingredient: very strong drugs that need contained, specialised plants.'],
      ['Sevoflurane / inhalation anaesthesia', 'Gases breathed in to keep patients unconscious during surgery; sevoflurane is the most used.'],
      ['Intrathecal therapy', 'Drugs (e.g., baclofen) given into the spinal fluid, for severe spasticity or pain.'],
      ['USFDA inspection: EIR / VAI / OAI', 'Closure report (EIR); voluntary action indicated (minor issues, VAI); official action indicated (serious, OAI).'],
      ['EBITDA (Screener basis)', 'Operating profit before depreciation, interest, tax, other income and associates; Piramal\'s own EBITDA adds other income.'],
      ['Share of associates', 'Piramal\'s share of profit of companies it does not control (AbbVie JV 49%, Yapan Bio 33.33%).'],
      ['Net debt / EV', 'Borrowings (incl. leases) less cash and investments; enterprise value = market value + net debt.'],
      ['Forward EV/EBITDA', 'Enterprise value ÷ next full year\'s EBITDA.'],
      ['Sum of the parts (SOTP)', 'Valuing each part separately and adding them up, less net debt.'],
      ['Sep-28E', 'Half FY28E plus half FY29E: the earnings the market will look at in twelve months.'],
      ['Trough rule / sector factor', 'House rules: leave out years when earnings collapsed (forward EPS a loss or below half the recent peak); multiply the stock\'s own median by how far sector peers trade above or below theirs over the same window.'],
      ['DCF / WACC', `Discounted cash flow value; the blended return lenders and shareholders require (here ${n1(V.ke)}%).`],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { risks, glossary, statementNotes: require('./PPLPHARMA.part6b').statementNotes };
