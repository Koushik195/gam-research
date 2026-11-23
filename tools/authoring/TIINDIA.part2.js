// Tube Investments of India report, part B-2: the story in charts, what TII owns, history and corporate actions.
const X = require('./TIINDIA.ctx');
const { C, F, V, SC, SA, SQ, QL, ann, n0, n1, price, sh, ps, discHist, discNow, discMedAll, discMedRecent, DISC, SOTP, cgMv, sgMv, listedMv, TIC, OTHER_UNL, SAM, saSepPat, current, coreHist, saB } = X;

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const qlab = d => `${MON[+d.slice(5, 7) - 1]}-${d.slice(2, 4)}`;
const DH = [...discHist, discNow];
const B = SOTP.base, wf = [B.saV, B.cgMv, B.sgMv, B.disc, B.tic, B.oth].map(v => Math.round(ps(v)));
wf.push(wf.reduce((s, v) => s + v, 0));
const resH = ['FY23', 'FY24', 'FY25', 'FY26'].map(f => Math.round(ann(f).resEbitda));
const Q1 = C.q1fy27.standalone, Q = q => SQ.find(x => x.q === q), m = (p, r) => Math.round(p / r * 1000) / 10;

const narrative = {
  id: 'narrative', nav: 'The story in charts', kicker: 'The story in 8 exhibits', title: 'The story in charts',
  blocks: [
    { pair: [
      { type: 'waterfall', title: `Our target: CG Power at market less a ${DISC.base}% discount, plus TII's own business`, unit: '₹ per share (base case)', x: ['TII standalone', 'CG Power stake', 'Shanthi Gears stake', 'Holdco discount', 'TI Clean Mobility', 'Other unlisted', 'SOTP value'], series: [{ name: '₹/share', values: wf }], fmt: 'num', totalFmt: 'num', source: 'GAM Research; listed stakes at NSE closes on 30-Sep-2026' },
      { type: 'line', title: `TII's discount to its listed stakes: from a premium in 2021-23 to ${Math.round(discNow.disc)}% now`, unit: 'Discount on the listed stakes (%)', x: DH.map(r => qlab(r.d)), series: [{ name: 'Discount', values: DH.map(r => Math.round(r.disc * 10) / 10), fmt: 'pct' }], labels: 'last', min: -110, max: 80, lines: [{ v: Math.round(discMedRecent * 10) / 10, text: `Median since Sep-24: ${n1(discMedRecent)}%`, color: '#cf8f1f' }, { v: Math.round(discMedAll * 10) / 10, text: `Median Jun-21 to Jun-26: ${n1(discMedAll)}%` }], source: 'GAM Research (method in Valuation); Screener.in prices' },
    ] },
    { pair: [
      { type: 'column', title: 'TII is now worth less than its CG Power stake alone', unit: '₹ crore at quarter-end', x: DH.map(r => qlab(r.d)), series: [{ name: 'Listed stakes (CG Power, Shanthi Gears)', values: DH.map(r => Math.round(r.L)), fmt: 'num' }, { name: 'TII market value', values: DH.map(r => Math.round(r.mc)), fmt: 'num' }], labels: 'none', source: 'Screener.in prices; TII AR (shares held)' },
      { type: 'column', title: 'TII\'s own profit (before CG dividends): +9% a year since FY23', unit: 'Standalone core profit (₹ crore)', x: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'Core profit', values: [...Object.values(coreHist).map(Math.round), ...saB.base.map(r => Math.round(r.pat))], fmt: 'num' }], labels: 'all', source: 'TII AR (standalone PAT less subsidiary dividends after tax); GAM estimates' },
    ] },
    { pair: [
      { type: 'column', title: 'The new ventures\' EBITDA loss: ~₹550 cr a year, narrowing slowly', unit: 'EBITDA of the residual block (₹ crore)', x: ['FY23', 'FY24', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], series: [{ name: 'EV and new ventures', values: [...resH, ...F.seg.res.adjEbitda.map(Math.round)], fmt: 'num' }], labels: 'all', source: 'Consolidated less TII standalone, CG Power and Shanthi Gears; GAM estimates' },
      { type: 'column', title: 'Q1FY27: tube and chain margins down until steel prices are passed on', unit: 'Segment PBIT margin (%)', x: ['Engineering', 'Metal formed', 'Cycles', 'Others'], series: [{ name: 'Q1FY26', values: [m(153, 1298), m(37, 366), m(7, 198), m(17, 236)], fmt: 'pct' }, { name: 'Q1FY27', values: [m(Q1.engPbit, Q1.engRev), m(Q1.mfpPbit, Q1.mfpRev), m(Q1.mobPbit, Q1.mobRev), m(Q1.othPbit, Q1.othRev)], fmt: 'pct' }], labels: 'all', source: 'Q1FY27 earnings call; GAM Research' },
    ] },
    { pair: [
      { type: 'column', title: 'TI Clean Mobility: e-3W billing +64% q/q after the supply fix', unit: 'Vehicles billed', x: ['Heavy trucks', 'Small CVs', 'e-3-wheelers', 'e-tractors'], series: [{ name: 'Q4FY26', values: [87, 241, 1176, 0], fmt: 'num' }, { name: 'Q1FY27', values: [86, 347, 1924, 22], fmt: 'num' }], labels: 'all', source: 'Q4FY26 and Q1FY27 earnings calls' },
      { type: 'hbar', title: 'Our {{dcf.tp|inr}} vs the street (notes standing on 30-Sep-2026)', unit: `₹ per share; price ₹${n0(price)}`, x: [...current.map(s => `${s.broker} (${s.date.slice(5, 7) === '08' ? 'Aug' : 'May'}-26)`), 'GAM bear', 'GAM base', 'GAM bull'], series: [{ name: 'Target', values: [...current.map(s => s.tp), SC.bear.tp, V.tp, SC.bull.tp], fmt: 'inr' }], labels: 'all', highlight: 'GAM base', lines: [{ v: 'P.last', axis: 'x', text: 'Price', color: '#b4232a' }], source: 'Motilal Oswal (18-Aug-2026); Geojit (15-May-2026, Trendlyne); GAM Research' },
    ] },
  ],
};

const business = {
  id: 'business', nav: 'What TII owns', kicker: 'The business', title: 'A precision-engineering company that owns most of CG Power',
  blocks: [
    { p: 'Tube Investments of India (TII) is the Murugappa group\'s engineering company. It makes precision steel tubes and strips, automotive chains and car door frames, and bicycles, and it uses the cash from those businesses to build or buy new ones. Its biggest asset is not a factory but a stake: 56.29% of CG Power and Industrial Solutions, the motors, transformers and switchgear maker it took over in November 2020 and turned around. It also owns 70.46% of Shanthi Gears, and has started an electric commercial-vehicle business (TI Clean Mobility, brand Montra Electric), a medical-devices business (TI Medical), a contract drug-development and manufacturing business (3xper) and several smaller ventures.' },
    { exhibit: { type: 'table', title: 'What TII owns (values at 30-Sep-2026)', head: ['Holding', 'What it does', 'TII stake', 'Value (₹ cr)', '₹ / TII share', 'How we value it'], wide: [1, 5], rows: [
      ['**TII standalone**', 'Precision tubes and strips (65% of segment revenue), chains and door frames (19%), cycles (9%), industrial chains and new businesses (11%); FY26 revenue ₹8,556 cr', '100%', n0(B.saV), n0(ps(B.saV)), `${SAM.base}x Sep-28E core profit (₹${n0(saSepPat('base'))} cr)`],
      ['**CG Power**', 'Motors, drives, railway equipment, transformers, switchgear; semiconductors (CG Semi OSAT, Axiro); FY26 revenue ₹12,418 cr', '56.29%', n0(cgMv), n0(ps(cgMv)), `Market price ₹${X.cgPx.toFixed(2)}`],
      ['**Shanthi Gears**', 'Industrial gears and gearboxes; FY26 revenue ₹519 cr', '70.46%', n0(sgMv), n0(ps(sgMv)), `Market price ₹${X.sgPx.toFixed(2)}`],
      ['**TI Clean Mobility**', 'Electric 3-wheelers, tractors, small CVs (TIVOLT) and heavy trucks (IPLTech); EV segment revenue ₹683 cr in FY26, loss-making', '~100% of equity; outside investors hold CCPS', n0(TIC.base), n0(ps(TIC.base)), 'TII\'s cost'],
      ['TI Medical, 3xper, Kcaltech, Sedis', 'Sutures and surgical devices; CDMO/APIs; aluminium HVAC tubes; French industrial chains', '67% / 95% / 67% / 100%', n0(OTHER_UNL), n0(ps(OTHER_UNL)), 'TII\'s cost'],
      { hl: true, cells: ['**Look-through value before any discount**', '', '', `**${n0(B.saV + listedMv + B.tic + B.oth)}**`, `**${n0(ps(B.saV + listedMv + B.tic + B.oth))}**`, `vs price ₹${n0(price)}`] },
    ], source: 'TII AR FY26 (note 6a, AOC-1), Q1FY27 deck, NSE closes on 30-Sep-2026, GAM Research' } },
    { p: `Two things stand out. First, **the CG Power stake alone (₹${n0(ps(cgMv))} a share) is worth ${Math.round(cgMv / (price * sh) * 100 - 100)}% more than TII's whole market value**: the market gives TII's own ₹8,556 cr business, Shanthi Gears and the ventures a negative value, or applies a large discount to the stake. Second, TII's own business is good but ordinary in growth: revenue grew 7.6% a year in FY22-26, core profit ~9% a year in FY23-26, with a 12-13% EBITDA margin and a very high return on capital (pre-tax ROIC 44%).` },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: from tubes and cycles to a holding company in five years',
  blocks: [
    { exhibit: { type: 'table', title: 'Key events and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['Feb-2010 / Nov-2012', 'Financière C10 (Sedis, France) and Shanthi Gears become subsidiaries', 'Industrial chains in Europe; gears (70.46%)'],
      ['Nov-2017', 'TII\'s shares start trading (Screener price history from 3-Nov-2017)', 'Standalone forward P/E ~21x until Mar-2020 (our own-history anchor)'],
      ['26-Nov-2020', 'CG Power becomes a subsidiary (71.13 cr shares at Mar-2021)', 'Consolidated revenue doubles in FY22; minorities appear'],
      ['FY22-FY23', 'Warrants converted: 80.13 cr CG shares (Mar-22), 88.65 cr (Mar-23); cost ₹806 cr', 'Stake ~58%; worth ~₹75,700 cr on 30-Sep-2026'],
      ['12-Feb-2022', 'TI Clean Mobility incorporated; e-tractor maker Cellestial acquired (69.95%, merged into TICMPL in FY24); IPLTech (Sep-2022)', 'EV losses enter the consolidated P&L'],
      ['FY23-FY25', 'TICMPL raises ~₹1,200 cr from Multiples and ~₹580 cr from Temasek-group funds; TII puts in ₹750 cr', 'Investors\' CCPS fair-valued through P&L (consolidated loss ₹137 cr FY25); TII\'s own CCPS gain ₹569 cr (standalone FY25)'],
      ['May-2023', 'TI Medical (67%, ₹233 cr) bought; 3xper (CDMO) founded with N. Govindarajan', 'New ventures: ~₹1,600 cr invested by Mar-2026'],
      ['Dec-2023 quarter', 'CG Power books ~₹550 cr of exceptional gains', 'FY24 consolidated EPS ₹62.1 is not a clean base'],
      ['Jan-2025', 'Kcaltech (67%, ~₹62 cr)', 'Aluminium HVAC tubes'],
      ['1-Apr-2025', 'Vellayan Subbiah becomes non-executive Vice Chairman; Mukesh Ahuja MD', 'Leadership change at the operating level'],
      ['Jul-Sep 2025', 'CG Power raises equity (QIP); TII does not subscribe', 'Stake 58.05% -> 56.37% (promoter group)'],
      ['30-Mar-2026', 'Restated TICMPL shareholders\' agreement; TII invests ₹250 cr in Series C CCPS', 'Investors\' ₹2,405 cr CCPS moved from liability to minority interest; no more fair-value swings'],
      ['Mar-Apr 2026', 'TI Medical buys Medicura\'s plastic consumables assets (~₹34 cr); TII buys 76.24% of Orange Koi (metal injection moulding)', 'Small bolt-ons'],
      ['Jun-Jul 2026', 'CG Power commissions an EHV switchgear plant (4-Jun) and CG Semi\'s OSAT plant starts production (4-Jul)', 'Semiconductor start-up losses at CG (₹50 cr in Q1FY27)'],
    ], source: 'TII AR FY22, FY24, FY26 (AOC-1, notes 6, 29, 62); TII decks and calls; Screener.in' } },
    { callout: '**Corporate actions:** no bonus, split or buyback; the share count has stayed at ~19.35 cr (ESOP allotments only). Dividend ₹3.50 a share every year. The corporate actions that move value happen one level down: CG Power\'s equity raise diluted TII from ~58% to 56.3%, and TICMPL\'s investors will convert into an unknown stake at an IPO.' },
  ],
};

module.exports = { narrative, business, history };
