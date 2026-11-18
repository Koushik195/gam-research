// Maruti initiation, part 3: chapters that depend on the deep-dive research
// (products, pipeline, moat, exports/EV, ownership, governance, peers, verdict).
const fs = require('fs');
const path = require('path');
const R = f => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'raw', 'MARUTI', 'research', f), 'utf8')); } catch { return null; } };

const exportsEv = {
  id: 'exports', nav: 'Exports & EVs', kicker: 'Growth engines', title: 'Exports are a real second engine; in EVs Maruti is catching up',
  blocks: [
    { p: "Exports are the clearest structural improvement in Maruti's business in a decade. Volumes rose from ~96k units in FY21 to {{kpi.exports.11|num}} in FY26. That is 18.5% of Maruti's total volume and ~49% of all passenger vehicles India exports (55% in Q1FY27). Three things changed. First, Suzuki moved global sourcing of small cars and the Jimny and Fronx to India. Second, India's rupee cost base became competitive in Africa, Latin America and the Middle East. Third, from Aug-2025 India became the global production base for Suzuki's first EV, the e-Vitara, which ships to Europe and Japan." },
    { pair: [
      { type: 'line', title: 'Exports as a share of Maruti volume: 8% → 18% in five years', unit: 'Exports as % of total units', x: 'fin.labels', from: 'FY15', to: 'FY26', series: [{ name: 'Export share', fn: "g('kpi.exports')[i] / g('kpi.units')[i] * 100", fmt: 'pct' }], labels: 'all', min: 0, source: 'Company, GAM Research' },
      { type: 'column', title: 'Maruti\'s share of India\'s PV exports', unit: '% of India PV exports', x: ['FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY26', 'Q1FY27'], series: [{ name: 'Share', values: [16.1, 15.1, 23.8, 41.3, 39.1, 42.1, 49.2, 55], fmt: 'pct0' }], highlight: 'Q1FY27', source: 'SIAM, company, GAM Research (FY25 not disclosed on a comparable basis)' },
    ] },
    { p: '**A caveat:** export growth stalled in Jul-Aug 2026 (−5% YoY). The West Asia conflict hurt freight and key Middle-East and African markets. Management declined to give FY27 export guidance ("help me predict the war"). Maruti earns more per car on exports than at home, so this affects mix as well as volume. We model flat to modest export growth in FY27-28.' },
    { h: 'EVs: late, export-first, and not yet a factor at home' },
    { p: "EVs reached ~7.6% of India's retail car sales in Aug-2026. Tata leads (~39% of EVs), followed by M&M (~24%) and JSW MG (~20%). Maruti's e-Vitara launched in Aug-2025 for export and in Feb-2026 in India. Only ~2,000-2,500 a month go to the domestic market, giving Maruti ~4% of India's EV market (#4). In Feb-2025 Suzuki cut its India BEV (battery electric vehicle) plan from 6 to 4 models by FY30. So Maruti is entering a segment where three rivals have a 4-5 year head start in product, charging partnerships and brand. In our base case Maruti wins a below-fair share of EVs (~15-20%). We assume the shift to EVs stays gradual through FY30, and that Maruti's CNG and hybrid range protects it in the meantime." },
    { verdicts: [
      ['Product', 'Disadvantage', "One EV (e-Vitara) vs Tata's 5+ and M&M's BE/XEV range.", 'Second EV comes only in CY27.'],
      ['Cost', 'Parity', 'Battery cells are imported. The TDSG (Toshiba-Denso-Suzuki) plant in Gujarat makes hybrid and EV batteries, but no scale advantage is visible yet.', 'Watch for local production of cells.'],
      ['Distribution & service', 'Advantage', 'Largest service network; Battery-as-a-Service pricing, where the battery is rented separately (e-Vitara from ₹10.99 lakh).', 'Helps only if the product is competitive.'],
      ['Alternative path (CNG/hybrid)', 'Advantage', '~40% CNG mix; strong hybrids with Toyota technology; CAFE-III credits.', 'The hedge that buys Maruti time.'],
    ], head: ['EV dimension', 'Verdict', 'Evidence', 'So what'], title: 'EV readiness: our scorecard', source: 'Company, FADA, Vahan, GAM Research' },
  ],
};

// ---------- where growth comes from ----------
// Q1FY27 vs Q1FY26 incremental units by segment (company disclosure; Q1FY26 backed out from reported YoY).
const growthMix = {
  id: 'growth', nav: 'Where growth comes from', kicker: 'Segments', title: 'Where the growth is coming from: small cars first, SUVs second, exports third',
  blocks: [
    { p: 'Maruti added ~1.55 lakh units in Q1FY27 versus Q1FY26 (+29%). Breaking that down by segment shows how unusual this cycle is: **46% of the increment came from mini and compact cars**, the segment that shrank for five years before GST 2.0, with SUVs contributing 37% and exports 18%. Supply to Toyota fell.' },
    { pair: [
      { type: 'hbar', title: 'Q1FY27: small cars delivered almost half of incremental volume', unit: "Incremental units vs Q1FY26 ('000)", x: ['Mini + compact', 'Utility vehicles', 'Exports', 'Vans (Eeco)', 'LCV (Super Carry)', 'Supply to Toyota'], series: [{ name: 'Change in units', values: [71122, 56988, 27764, 3444, 1072, -5615], fmt: 'k' }], labels: 'all', source: 'Company Q1FY27 segment disclosure, GAM Research' },
      { type: 'stacked', title: 'Domestic mix: small cars ~48%, UVs ~39% after GST', unit: '% of domestic volume', x: ['FY26', 'Q1FY27'], series: [{ name: 'Mini + compact', values: [46.6, 48.3], fmt: 'pct0' }, { name: 'Utility vehicles', values: [38.5, 39.2], fmt: 'pct0' }, { name: 'Vans + LCV', values: [9.1, 8.3], fmt: 'pct0' }, { name: 'Supply to Toyota', values: [5.7, 4.2], fmt: 'pct0' }], minLabel: 4, source: 'Company, GAM Research' },
    ] },
    { pair: [
      { type: 'column', title: "CNG went from 12% to 40% of Maruti's volume", unit: 'CNG share of Maruti sales (%)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', '9MFY26', 'Q1FY27'], series: [{ name: 'CNG', values: [12, 17, 20, 27, 35, 39, 40], fmt: 'pct0' }], source: 'Company presentations, GAM Research' },
      { type: 'column', title: "But Maruti's share of the SUV segment is only ~20%", unit: 'Maruti share of India SUV segment (%)', x: ['FY20', 'Q1FY24', 'Q2FY24', 'FY26 (Apr-Feb)'], series: [{ name: 'SUV share', values: [16.8, 20, 23, 19.6], fmt: 'pct' }], source: 'Company presentations, GAM Research' },
    ] },
    { callout: "**Brutal read:** the growth is real but it is coming from the lowest-margin part of the portfolio. Small cars and CNG are Maruti's home turf, and GST 2.0 made them grow again, but they carry roughly half the per-car profit of an SUV. Maruti's share of SUVs (~20%) is half its overall share (~41%). In the segment where India's profit pool is moving, Maruti is one of five serious players, not the leader." },
  ],
};

// ---------- pipeline ----------
const pipeline = {
  id: 'pipeline', nav: 'Product pipeline', kicker: 'Products', title: 'Star products today, and the pipeline that has to close the SUV gap',
  blocks: [
    { p: "Maruti's volume engines remain the WagonR, Swift, Dzire, Baleno and Ertiga; its profit engines are the SUVs sold through Nexa (Brezza, Fronx, Grand Vitara) and now the Victoris. Management has committed to taking the line-up from 17 to 27-28 models by FY31, including 6 EVs and 7-8 new SUVs, with a target of regaining 50% share. The pipeline is the single biggest swing factor for share." },
    { exhibit: { type: 'table', title: 'Announced pipeline and what each launch has to do', head: ['Launch', 'Timing', 'Segment', 'Powertrain', 'Gap it fills', 'Collides with'], wide: [4, 5], rows: [
      ['Victoris', 'Launched Sep-2025', 'Mid-SUV', 'Petrol / CNG / strong hybrid', 'Second mid-SUV under Arena; underbody CNG', 'Creta, Seltos, Hyryder'],
      ['e-Vitara', 'Launched Aug-2025 (exports first)', 'Mid-SUV EV', 'BEV 49/61 kWh', 'First EV; Japan/EU exports', 'Creta EV, Curvv EV, BE 6, ZS EV'],
      ['3-row SUV (Grand Vitara-based)', 'FY27 (reported)', 'Large SUV', 'Petrol / strong hybrid', "Absent from the 7-seat SUV, India's most profitable segment", 'XUV700, Safari, Alcazar'],
      ['Second EV', 'Display early CY27', 'Compact EV', 'BEV', 'Affordable EV for India', 'Punch EV, Nexon EV, Windsor'],
      ['In-house series hybrid', 'FY27-28 (reported)', 'Compact (Fronx/Baleno/Swift)', 'Low-cost series hybrid', 'Cheaper hybrid for CAFE-III', 'Diesel compact SUVs; CNG rivals'],
      ['Further SUVs & EVs to 27-28 models', 'FY28-FY31', 'Across', 'EV (6), hybrid, CNG, flex-fuel', '50% share target by FY31', 'Every major OEM'],
    ], source: 'Company guidance (Q4FY26/Q1FY27 calls), Suzuki mid-term plan, media reports, GAM Research' } },
    { callout: "**What has to go right:** Maruti needs two of its next five SUV launches to become segment top-3 sellers for share to move meaningfully above 42%. Its record is mixed: Brezza, Fronx and Grand Vitara succeeded; Jimny and Invicto did not. We do not build share gains into our base case beyond FY27." },
  ],
};

// ---------- competitive advantage ----------
const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: real in cost and reach, absent in product and technology',
  blocks: [
    { p: 'We score Maruti on the five sources of advantage that matter in Indian autos. The honest conclusion: Maruti has a **durable cost and distribution advantage** that protects its volume share in entry and mid segments and generates cash through cycles. It does **not** have a product, technology or pricing-power advantage, and it has demonstrably lost the premium end of the market.' },
    { verdicts: [
      ['Scale & cost', 'Advantage', '~2.4mn units on few platforms; deepest localised supplier base clustered around Gurugram/Manesar/Hansalpur; lowest cost per car among Indian OEMs.', 'Lets it win price-sensitive segments and survive discount wars. The core of the moat.'],
      ['Distribution & service', 'Advantage', '4,000+ sales outlets and 5,000+ service workshops, larger than the next two OEMs combined; ~45% of sales from rural India.', 'Hard to replicate; matters most for first-time and rural buyers.'],
      ['Brand & resale', 'Advantage', 'Highest resale values in mass-market cars; trusted for low running cost.', 'Supports volumes, not premium pricing.'],
      ['Product & design', 'Disadvantage', '<3% of Maruti sales are above ~US$15.5k vs >21% for the rest of the industry; late to SUVs, sunroofs, ADAS; historically weak crash-test ratings.', "Cedes the industry's profit pool to M&M, Tata, Hyundai, Kia, Toyota."],
      ['Technology (EV/software)', 'Disadvantage', 'One EV vs multi-model rivals; relies on Suzuki/Toyota for hybrid technology.', 'Structural risk if EV adoption accelerates.'],
      ['Pricing power', 'Parity', 'Price hikes stick in entry segments; in SUVs it prices at or below rivals and discounts more.', 'Margins move with commodities, not with brand.'],
    ], head: ['Source of advantage', 'Verdict', 'Evidence', 'What it means for shareholders'], title: 'Moat scorecard: 3 advantages, 1 parity, 2 disadvantages', source: 'Company, industry data, media, GAM Research' },
    { pair: [
      { type: 'hbar', title: "Margins vs peers: Maruti's old profitability edge has gone", unit: 'Q1FY27 EBITDA or auto PBIT margin (%), definitions differ', x: ['Maruti (EBITDA)', 'Hyundai India (EBITDA)', 'Tata PV incl. JLR (EBITDA)', 'M&M auto (PBIT)'], series: [{ name: 'Margin', values: [8.6, 9.3, 7.4, 7.1], fmt: 'pct' }], highlight: 'Maruti (EBITDA)', source: 'Company results, GAM Research (indicative only)' },
      { type: 'column', title: 'Maruti vs M&M: domestic market share', unit: 'Domestic PV share (%)', x: 'R.industry.oemShare[].fy', series: [{ name: 'Maruti', ref: 'R.industry.oemShare[].maruti', fmt: 'pct0' }, { name: 'M&M', ref: 'R.industry.oemShare[].mm', fmt: 'pct0' }], labels: 'all', source: 'FADA, SIAM, GAM Research' },
    ] },
    { callout: '**Bottom line on the moat:** Maruti is a low-cost, high-reach volume franchise, closer to Toyota in Japan than to a premium compounder. That earns a steady 10-13% EBITDA margin and strong cash flow, but not monopoly economics. Investors who owned it in FY15-19 for a 50%+ share and expanding margins should not expect that again.' },
  ],
};

// ---------- ownership ----------
const ownership = {
  id: 'ownership', nav: 'Who owns it', kicker: 'Ownership', title: 'Who owns the stock: foreign money has left, domestic funds have bought',
  blocks: [
    { p: 'Suzuki Motor Corp owns {{SH.rows.Promoters.11|pct}} (up from 56.5% before the SMG share swap). The rest of the register tells the story of the de-rating: **FIIs cut their holding from 20.6% to 12.4% over three years** while domestic institutions (mutual funds, LIC and other insurers) rose from 17.6% to 25.3%. Domestic money has been the marginal buyer through the fall; FII re-entry is the most obvious re-rating trigger.' },
    { pair: [
      { type: 'line', title: 'FIIs out, DIIs in', unit: '% of shares', x: 'SH.periods', series: [{ name: 'DIIs', ref: 'SH.rows.DIIs', fmt: 'pct' }, { name: 'FIIs', ref: 'SH.rows.FIIs', fmt: 'pct' }], labels: 'ends', source: 'BSE shareholding pattern, Screener.in' },
      { type: 'column', title: 'Retail shareholders are rising as the price falls', unit: "Number of shareholders ('000)", x: 'SH.periods', series: [{ name: 'Shareholders', ref: 'SH.rows.No. of Shareholders', fmt: 'k' }], labels: 'ends', source: 'BSE shareholding pattern, Screener.in' },
    ] },
  ],
};

// ---------- verdict ----------
const verdict = {
  id: 'verdict', nav: 'Our honest summary', kicker: 'Summary', title: 'Our honest summary: what you own, and how to size it',
  blocks: [
    { callout: "**What you are buying:** India's most trusted volume car maker, with the widest reach (4,601 outlets, six of the top-10 models, best resale values). It has ~₹{{fin.treasury.11|num}} cr of net cash and pays out 30%+ of profit as dividends. It has a lasting export business and the most direct exposure to GST 2.0 and first-time car buyers. And it trades at {{V.pe.current|x}} trailing earnings, the cheapest in a decade." },
    { callout: '**What you are not buying:** a monopoly, a technology leader or a premium brand that compounds for decades. Maruti lost ~10 points of market share in the SUV decade and has no lead in EVs. Its margins depend more on commodity prices and the yen than on its own decisions. Earnings have been flat for two years and analysts are still cutting forecasts. It is no longer the most profitable mass-market OEM (car maker). And an unexplained auditor resignation (2025) is a governance question worth asking.' },
    { h: 'How we would use it in a portfolio' },
    { bullets: [
      '**Role:** a value and cash-flow holding within consumer discretionary. It is a cyclical recovery play with balance-sheet support, not a long-term compounder.',
      '**Expected return:** base-case target {{dcf.tp|inr}} ({{dcf.upside|chg}}) plus ~1.3% dividend yield. Bear case: {{scen.bear.tp|inr}} ({{scen.bear.upside|chg}}).',
      '**Sizing:** the upside outweighs the downside, but the stock is not risk-free. Earnings momentum is RED, so we would build the position in stages around the Q2/Q3FY27 results rather than all at once.',
      '**What would make us buy more:** EBITDA margin back above 10.5% in Q2/Q3FY27; FII (foreign institutional investor) holding starting to rise; a successful 3-row SUV launch.',
      '**What would make us sell:** margins stuck below 9.5% through FY27; domestic share back below 39%; evidence that GST demand was a one-off pull-forward.',
    ] },
    { exhibit: { type: 'tiles', title: 'The investment case in five numbers', tiles: [
      { k: 'Trailing P/E', v: '{{V.pe.current|x}}', d: '10y median {{V.pe.windows.10y.median|x}}' },
      { k: 'Net cash', v: '₹{{fin.treasury.11|num}} cr', d: '~23% of market cap' },
      { k: 'FY27E EPS', v: '{{F.eps.0|inr}}', d: 'consensus {{R.street.consensus.0.eps|inr}}' },
      { k: 'FY27-29E EPS CAGR', v: '~21%', d: 'off a depressed FY27 base' },
      { k: 'Target / upside', v: '{{dcf.tp|inr}}', d: '{{dcf.upside|chg}}; bear {{scen.bear.upside|chg}}' },
    ], source: 'GAM Research' } },
  ],
};

// ---------- glossary ----------
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { p: 'Plain-English definitions of the technical terms used in this report.' },
    { exhibit: { type: 'table', title: 'Glossary of terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['EBITDA / EBITDA margin', 'Earnings before interest, tax, depreciation and amortisation: operating profit before non-cash charges. The margin is EBITDA as a % of sales.'],
      ['EBIT / PBIT', 'Operating profit after depreciation (EBIT), or profit before interest and tax (PBIT). Some companies report one, some the other.'],
      ['PAT / PBT', 'Profit after tax (net profit) and profit before tax.'],
      ['EPS', 'Earnings per share: net profit divided by the number of shares.'],
      ['P/E', 'Price-to-earnings ratio: share price divided by EPS. "Trailing" uses the last 12 months of earnings.'],
      ['EV/EBITDA', 'Enterprise value (market value plus debt, minus cash) divided by EBITDA. It compares companies regardless of how much cash or debt they hold.'],
      ['DCF', 'Discounted cash flow: valuing a company on the cash it will generate in future, converted into today\'s money.'],
      ['FCF / FCFF', 'Free cash flow: operating cash flow minus capex. FCFF (free cash flow to the firm) is the cash available to all investors before financing.'],
      ['Cost of equity / WACC', 'The annual return shareholders require (cost of equity). WACC (weighted average cost of capital) blends this with the cost of debt; for a debt-free company like Maruti they are the same.'],
      ['Beta / equity risk premium', 'Beta measures how much a stock moves with the market. The equity risk premium is the extra return investors demand for owning shares instead of government bonds.'],
      ['Terminal growth / terminal value', 'The growth rate assumed for every year after the forecast period, and the value of all those later cash flows.'],
      ['ROE', 'Return on equity: net profit as a % of shareholders\' funds.'],
      ['Return on operating capital', 'Return earned on the money used in the car business itself, excluding surplus cash and investments.'],
      ['Operating leverage', 'When sales rise, fixed costs are spread over more units and margins rise faster; when sales fall, the reverse happens.'],
      ['Basis points (bp) / ppt', '100bp = 1 percentage point (ppt). A margin moving from 10.0% to 11.5% is a 150bp rise.'],
      ['MTM (mark-to-market)', 'Valuing investments at today\'s market price. Gains or losses flow through other income even if nothing is sold.'],
      ['Percentile / standard deviation (σ)', 'A 2nd-percentile valuation is cheaper than 98% of past readings. Standard deviation measures how far a value usually swings from its average.'],
      ['CAGR', 'Compound annual growth rate: the steady yearly growth that turns a starting value into an ending value.'],
      ['OEM', 'Original equipment manufacturer: here, a car maker such as Maruti, Hyundai, Tata or M&M.'],
      ['PV / UV / SUV', 'Passenger vehicles (cars, utility vehicles and vans). Utility vehicles (UVs) are mostly SUVs, sport utility vehicles.'],
      ['Wholesale vs retail', 'Wholesale is cars dispatched from the factory to dealers. Retail is cars sold by dealers to customers. A gap means dealer stock is building or falling.'],
      ['CNG', 'Compressed natural gas: a cheaper fuel than petrol; Maruti sells factory-fitted CNG cars.'],
      ['BEV / HEV / EV', 'Battery electric vehicle (runs only on a battery) and hybrid electric vehicle (combines a petrol engine with a battery and electric motor). EV covers electric cars in general.'],
      ['BS-VI', 'Bharat Stage VI: India\'s emission norms, introduced in April 2020, which raised the cost of cars, especially diesel cars.'],
      ['CAFE-III', 'Corporate Average Fuel Efficiency norms, phase III: limits on the average fuel use and emissions across a car maker\'s range.'],
      ['PGMs', 'Platinum-group metals (platinum, palladium, rhodium) used in catalytic converters that clean exhaust gases.'],
      ['GST 2.0', 'The September 2025 GST revision, which cut the tax on small cars from 28% plus cess to 18%.'],
      ['SMG / common-control pooling', 'Suzuki Motor Gujarat, the plant Maruti bought from Suzuki in 2023. Because both are controlled by Suzuki, past figures were restated as if the two had always been combined.'],
      ['Royalty / related-party transactions', 'Fees Maruti pays Suzuki for technology and brand. Related-party transactions are dealings with the parent or group companies, disclosed in the annual report.'],
      ['Contingent liabilities', 'Possible future payments, such as disputed tax claims, that depend on the outcome of a case.'],
      ['ITAT', 'Income Tax Appellate Tribunal: the body that hears appeals in tax disputes.'],
      ['EPR', 'Extended producer responsibility: rules that make manufacturers responsible for recycling or disposing of products at end of life.'],
      ['FII / FPI / DII', 'Foreign institutional (or portfolio) investors and domestic institutional investors such as mutual funds and insurers.'],
      ['Consensus / the street', 'The average forecast of analysts who cover the stock.'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { exportsEv, growthMix, pipeline, moat, ownership, verdict, glossary, R };
