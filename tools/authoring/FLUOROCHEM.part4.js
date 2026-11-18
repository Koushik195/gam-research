// GFL report, part B (3/3): ownership, governance, forecasts, street, valuation, verdict, glossary, statement notes.
const { ctx } = require('./FLUOROCHEM.part2');
const { streetBlocks } = require('./valuation-blend');
const { ruleText, buyBelow: buyAt, sellAbove: sellAt } = require('../../src/ratings');
const { buildForecast } = require('../../src/forecast');
const { C, D, M, F, V, n0, n1, A26, price, mv, epsSep28, rating, chemE, impliedEvBiz, fwdMed, PEER_SYMS, PEERS, DR, sectorDerate, ASOF_TXT } = ctx;
const OH = D.ownership, G = C.governance;
// What-if (text only): DCF if working capital were 41% of revenue (149 days, Q1FY27) instead of the FY26 ratio the model uses.
const dcfWc41 = buildForecast(M, { ...M.forecast.assumptions, owcPctOfSales: 41 }).dcf.blend.methods.find(m => m.key === 'dcf').value;
const g2628 = (Math.pow(F.eps[1] / 52.56, 0.5) - 1) * 100, g2629 = (Math.pow(F.eps[2] / 52.56, 1 / 3) - 1) * 100;
const buyBelow = Math.round(buyAt(V.tp) / 10) * 10, sellAbove = Math.round(sellAt(V.tp) / 10) * 10;

const ownership = base => ({ ...base, blocks: [
  { p: `The Jain family owns ${OH.categoriesPct.promoters}% (Jun-2026), mostly through Inox Leasing and Finance (52.6%). Its stake has fallen from 68.4% in Mar-2020 as two family LLPs sold shares (Devansh Trademart's holding fell from 4.84% to 3.65% in FY26). Indian mutual funds own ${OH.categoriesPct.mutualFunds}%, insurers ${OH.categoriesPct.insurance}% and foreign investors only ~${OH.categoriesPct.fpi}%.` },
  ...base.blocks,
  { exhibit: { type: 'table', title: 'Named holders above 1% (Jun-2026)', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
    ...OH.named.map(h => [h.name, h.pct + '%', /Devansh/.test(h.name) ? '74% of its shares pledged' : /Aryavardhan/.test(h.name) ? '19% of its shares pledged' : /Inox Leasing/.test(h.name) ? 'To merge into GFL under a pending scheme' : '']),
    ['All mutual funds', OH.categoriesPct.mutualFunds + '%', ''], ['Foreign portfolio investors', OH.categoriesPct.fpi + '%', 'none above 1%'],
  ], source: 'BSE shareholding pattern for the quarter to Jun-2026 (latest public on 30-Sep-2026), via Trendlyne' } },
  { callout: '**Our read:** a pledge on 5.97% of promoter shares (Jun-2026) and steady selling by family entities are amber flags. The scheme to merge Inox Leasing and Finance into GFL would leave the family holding GFL directly; it needs further approvals and we do not expect it to change minority holdings.' },
] });

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Governance: a family company where value can leak to the subsidiary level',
  blocks: [
    { exhibit: { type: 'table', title: 'Key people', head: ['Name', 'Role', 'Note'], wide: [2], rows: C.management.map(m => [m.name, m.role, m.note]), source: 'Annual report FY26, Q1FY27 call' } },
    { verdicts: [
      ['Promoter and pledge', 'Weak', `Promoters ${G.promoterHoldingJun26Pct}% (from ${G.promoterHoldingMar20Pct}% in Mar-2020); ${G.pledgeJun26}.`, 'Selling plus pledging is a warning sign.'],
      ['Subsidiary-level dealings', 'Weak', 'Promoter family bought GFCL EV shares/warrants at ₹35 (₹200 cr); key managers got GFCL EV options at ₹1; IFC holds convertibles; outsiders own 26% of the Oman unit.', 'The growth asset is being shared outside GFL.'],
      ['Related parties', 'Moderate', 'Guarantees for group companies ₹498 cr (Mar-2026; ₹1,521 cr released in FY25); ₹177 cr in preference shares of group power companies that sell GFL power.', 'Smaller than before, but still exposure to Inox group entities.'],
      ['Audit and disclosure', 'Moderate', 'Patankar & Associates, unqualified. No capacity, volume or margin data by business; company ROCE/ROE exclude new capital.', 'Hard to check the investment case from outside.'],
      ['Board and succession', 'Moderate', 'Founder D.K. Jain died Dec-2025; Vivek Jain is chairman and MD; Dr. Bir Kapoor (DMD/CEO) runs operations; four whole-time plant directors.', 'Continuity, but a family-dominated board.'],
      ['Capital allocation', 'Moderate', '₹4,510 cr capex in FY22-26 with ROE at ~8%; battery plan cut back in Oman and moved to India; low payout (~6%).', 'The battery bet decides the verdict.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'GAM research compilation' },
  ],
};

const segRow = (k, name, hist) => [name, n0(hist), ...[0, 1, 2].map(i => `{{F.seg.${k}.revenue.${i}|num}}`)];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts', kicker: 'Earnings model', title: 'Our forecasts: below the street for FY27, in line for FY28',
  blocks: [
    { p: 'We forecast revenue by business line. The company discloses profit only for Chemicals and for battery materials, so the three chemical lines share one Chemicals EBITDA margin (29-29.5%, close to Q1FY27\'s 29.1%, with no forex gains), and battery materials carries its own margin. Capex follows the plan (₹3,150 cr in FY27, ~₹2,400 cr in FY28), so depreciation and interest rise before the battery plants earn. Every assumption is in the Excel model\'s Assumptions sheet.' },
    { exhibit: { type: 'table', title: 'Business-line forecasts (₹ crore)', head: ['', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      segRow('fp', 'Fluoropolymers', A26.fpRev), segRow('fc', 'Fluorochemicals', A26.fcRev), segRow('bulk', 'Bulk chemicals', A26.bulkRev), segRow('oth', 'Other operating revenue', A26.othOpRev), segRow('ev', 'Battery materials', A26.battRev),
      ['Chemicals EBITDA (ex forex)', n0(A26.chemEbitda - A26.forexGain), ...[0, 1, 2].map(i => n0(chemE(i)))],
      ['Battery-materials EBITDA', n0(A26.evEbitda), '{{F.seg.ev.adjEbitda.0|num}}', '{{F.seg.ev.adjEbitda.1|num}}', '{{F.seg.ev.adjEbitda.2|num}}'],
      ['Net debt (year end)', n0(M.annual.netDebt.at(-1)), ...[0, 1, 2].map(i => n0(-F.treasury[i]))],
    ], source: 'Company (FY26; Chemicals EBITDA less ₹88.6 cr forex gains), GAM Research estimates' } },
    { exhibit: { type: 'rows', title: 'P&L and cash flow summary (₹ crore)', from: 'FY23', rowsRef: [
      { name: 'Revenue', ref: 'fin.sales', hl: true }, { name: 'growth', ref: 'fin.salesGrowth', fmt: 'chg' }, { name: 'EBITDA', ref: 'fin.ebitda', hl: true }, { name: 'EBITDA margin', ref: 'fin.ebitdaMargin', fmt: 'pct' },
      { name: 'Net profit', ref: 'fin.pat', hl: true }, { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n1' }, { name: 'EPS growth', ref: 'fin.epsGrowth', fmt: 'chg' },
      { name: 'Capex', ref: 'fin.capex' }, { name: 'Free cash flow', ref: 'fin.fcf' }, { name: 'ROE', ref: 'fin.roe', fmt: 'pct' },
    ], source: 'Company, GAM Research estimates' } },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'Street FY27E', 'GAM FY28E', 'Street FY28E'], rows: [
      ['EPS (₹), Prabhudas Lilladher (13-Aug)', '{{F.eps.0|n1}}', '79.9', '{{F.eps.1|n1}}', '86.5'], ['EPS (₹), ICICI Direct (13-Aug)', '{{F.eps.0|n1}}', '86.3', '{{F.eps.1|n1}}', '106.4'],
      ['EPS (₹), JM Financial (12-Feb)', '{{F.eps.0|n1}}', '81.0', '{{F.eps.1|n1}}', '99.6'], ['EPS (₹), Elara (26-May)', '{{F.eps.0|n1}}', '88.6', '{{F.eps.1|n1}}', '122.5'],
      ['EPS (₹), consensus (Simply Wall St, 17-Aug)', '{{F.eps.0|n1}}', '87.1', '{{F.eps.1|n1}}', 'n.a.'],
      ['Revenue (₹ cr), PL / ICICI Direct', '{{F.sales.0|num}}', '6,475 / 6,309', '{{F.sales.1|num}}', '7,478 / 7,595'], ['EBITDA (₹ cr), PL / ICICI Direct', '{{F.ebitda.0|num}}', '1,822 / 1,861', '{{F.ebitda.1|num}}', '2,177 / 2,317'],
    ], source: 'Broker notes as dated; Simply Wall St (15 analysts). No consensus FY28E EPS dated by 30-Sep-2026 was found.' } },
    { callout: `For FY27 we are ${Math.round((1 - F.eps[0] / 87.08) * 100)}% below consensus EPS, mainly because we assume battery materials still lose ~₹${n0(-F.seg.ev.adjEbitda[0])} cr at the EBITDA level (Q1 alone lost ₹30 cr) rather than breaking even, and because interest rises with net debt. Our FY27 revenue is close to the street. For FY28 our revenue is above Prabhudas Lilladher's and ICICI Direct's (it includes ~₹1,000 cr of battery sales), but our EPS is in line with PL and below ICICI Direct, JM and Elara because we assume a thin battery margin (5%) and interest of ~₹${n0(M.forecast.assumptions.interest[1])} cr on rising debt. Our EPS grows ~${Math.round(g2628)}% a year over FY26-28E and ~${Math.round(g2629)}% over FY26-29E.` },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: 'The street: mostly positive after Q1, but targets sit close to the price',
  blocks: [
    { p: 'Five houses published after the Q1FY27 results (13-Aug-2026): ICICI Direct BUY ₹5,800, ICICI Securities ₹5,050, Axis Capital BUY ₹4,800 (from SELL ₹3,400 in May), DRChoksey ₹4,612 (rated negative on valuation) and Prabhudas Lilladher HOLD ₹4,498. Older standing calls: Elara BUY ₹4,698 (May), AMSEC BUY ₹3,817 (Mar) and JM Financial REDUCE ₹3,505 (Feb). Simply Wall St counted 15 analysts with an average target of ₹4,624 after Q1, only ~5% above the 30-Sep price. Bulls point to fluoropolymer share gains, R32 and the battery ramp; bears to valuation and battery delays.' },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who'], wide: [0], rows: [
      ['At ~53x FY28E EPS the stock is fairly priced; batteries may take longer to matter (only LiPF6 in FY27)', 'Prabhudas Lilladher (HOLD, 13-Aug-2026)'],
      ['Battery approvals and ramp-up could slip, the key risk to FY28E', 'JM Financial (REDUCE, Feb-2026)'],
      ['FY27 battery revenue was guided at ₹500-700 cr with break-even, yet Q1 was ₹14 cr with a ₹30 cr loss', 'IDBI Capital visit note (Jul-2026) vs Q1 results'],
      ['Capex of ~₹3,100 cr in FY27 takes debt/equity from 0.3x to ~0.6x', 'ICICI Direct (13-Aug-2026)'],
      ['The Oman project is on hold and its sovereign funding cannot move to India', 'Q1FY27 call'],
      ['P/E ~89x trailing vs a five-year average of ~36x', 'Kotak Neo (11-Sep-2026)'],
      ['Returns: ROE ~8% for three years; company metrics leave out new capital', 'GAM Research'],
    ], source: 'Broker notes, press and calls to 30-Sep-2026' } },
  ],
};

module.exports = { ownership, governance, forecasts, street, dcfWc41, buyBelow, sellAbove };
