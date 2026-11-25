// Piramal Pharma report, part 2b: industry and the tailwind test.
const X = require('./PPLPHARMA.ctx');
const { D, n0, n1, rup, P, CTX, shortName } = X;
const I = D.industry;
const ctxRows = ['PPLPHARMA', ...CTX].map(s => P[s]).filter(p => p && !p.missing);

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Industry: CDMO demand is back with biotech money and on-shoring; anaesthesia is mature; Indian OTC grows ~8%',
  blocks: [
    { p: rup(`**CDMO.** ${I.cdmo.item}`) },
    { p: rup(`**ADCs.** ${I.adc.item}`) },
    { p: rup(`**Inhalation anaesthesia.** ${I.inhalationAnaesthesia.item}`) },
    { p: rup(`**Indian consumer health.** ${I.otc.item} **Costs.** ${I.westAsia.item}`) },
    { exhibit: { type: 'table', title: 'Indian CDMO and injectables names at the 30-Sep-2026 close (context, not the valuation peer set)', head: ['Company', 'Market value (₹ cr)', 'FY26 revenue (₹ cr)', 'EBITDA margin', 'EV/EBITDA trailing (x)', 'ROE'], rows: ctxRows.map(p => [p.symbol === 'PPLPHARMA' ? '**Piramal Pharma**' : shortName(p.symbol), n0(p.mcapCr), n0(p.revenue), `${p.ebitdaMargin}%`, n1(p.evEbitda), `${p.roe}%`]), source: 'Screener.in (consolidated), multiples scaled to the NSE close on 30-Sep-2026' } },
    { callout: `**Where Piramal stands:** it has the scale of the large Indian CDMOs (revenue near Divi's and Laurus) but the margins of none of them: ~10% EBITDA in FY26 against 25-40% at Divi's, Sai Life, Anthem and Laurus. The market already pays ~${n1(P.PPLPHARMA.evEbitda)}x trailing EBITDA for Piramal (on depressed FY26-27 numbers), so it is pricing in a large part of the margin catch-up.` },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Tailwind test: the sector tailwinds reach Piramal, but through its weakest asset (under-used overseas plants)',
  blocks: [
    { verdicts: [
      ['Biotech funding recovery → more CDMO RFPs', 'Yes', 'RFPs and orders up since Oct-2025; CDMO +19% in Q1FY27; 209 customer audits in FY26 (record). Conversion is slow: "customer decision-making timelines remain prolonged".'],
      ['On-shoring / supply diversification (tariffs, geopolitics)', 'Partly', 'US and UK sites are tariff-free and seeing "a particular spike in interest"; but those are exactly the sites with low utilisation and losses today, so the benefit shows up only as volume arrives. India-made innovator work depends on customer negotiations.'],
      ['ADC and high-potency demand', 'Yes', 'Grangemouth conjugation (~US$64 mn ADC revenue in FY26), new Riverview payload-linker suite, Lexington sterile expansion (H2 CY2027).'],
      ['On-patent launches of customers\' drugs', 'Partly', '25 Phase III molecules; on-patent commercial revenue only US$96 mn in FY26 and concentrated (one product\'s destocking cut FY26 CDMO revenue 10%).'],
      ['Hospital procedure growth', 'Yes', 'Sevoflurane volumes grow with surgeries; US share up from 45% (Mar-24) to 48%.'],
      ['Chinese competition in generics', 'Headwind', 'Ex-US sevoflurane prices pressured; Piramal answers with lower-cost Digwal supply.'],
      ['Indian consumer health growth (~8%) and quick commerce', 'Yes', 'PCH grows ~2x the market (+17% FY26, +15% Q1FY27); e-commerce 27-28% of sales; margin still low single digits.'],
      ['Weak rupee', 'Tailwind', '~77% of revenue exported; ~9-10 points of Q1FY27 growth was currency. It reverses if the rupee recovers.'],
    ], head: ['Tailwind', 'Reaches Piramal?', 'Evidence'], title: 'Does the sector tailwind reach Piramal Pharma?', source: 'Q4FY26 and Q1FY27 calls and presentations; CARE (17-Jul-2026); GAM Research' },
    { callout: '**Verdict:** the demand tailwind is real and it does reach Piramal, but its value depends on filling the overseas plants that cost the most to run. That makes Piramal a high-operating-leverage play on CDMO demand rather than a steady compounder: if orders convert, margins can rise fast; if they do not, depreciation and interest on the new capacity keep profits near zero.' },
  ],
};

module.exports = { industry, tailwind };
