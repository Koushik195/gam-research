// TVS Motor report, part 4: TVS Credit Services; Norton and the other subsidiaries. Moat in part4b.
const X = require('./TVSMOTOR.ctx');
const { C, n0, n1, TC, T25, T26, TCF, tcBook, stake, PB, LPB, lenderMed, lenderFwdMed, deal, justPb, tcKe, tcG, tcRoe, roa26, OTH, LOSS, ptTvs, uv, shares, ke, SOTP } = X;
const Q1 = TC.q1fy27, avg26 = (T25.aum + T26.aum) / 2;
const r = v => n1(v / avg26 * 100);
const IC = C.investmentsAtCost, SQ = C.subsidiaryLossQuarterly;
const P4B = require('./TVSMOTOR.part4b');

const tvsCredit = {
  id: 'tvscredit', nav: 'TVS Credit', kicker: 'Subsidiary: TVS Credit Services', title: `TVS Credit: a ₹32,000 cr lender earning ~16% ROE, worth ~₹${n0(SOTP.base.tvsCredit)} a share to TVS Motor`,
  blocks: [
    { p: `TVS Credit Services is an NBFC that finances TVS two-wheelers and three-wheelers, used cars and tractors, consumer durables, and personal and gold loans, mostly for self-employed and new-to-credit borrowers in semi-urban and rural India (2.6 crore customers, ~62,000 touch points). In FY26 its book grew 15% to ₹${n0(T26.aum)} cr, disbursements 26% to ₹33,018 cr, and profit 19% to ₹${n0(T26.pat)} cr on net worth of ₹${n0(T26.netWorth)} cr (ROE ~${n1(T26.pat / ((T26.netWorth + T25.netWorth) / 2) * 100)}%). In Q1FY27 the book reached ₹${n0(Q1.aum)} cr (+19%) and profit ₹${n1(Q1.pat)} cr (+15%); gross Stage 3 fell to ${Q1.gnpa}% (3.0% a year earlier); capital adequacy ${Q1.crar}% (Tier 1 ${Q1.tier1}%).` },
    { exhibit: { type: 'table', title: 'TVS Credit: a high-yield, high-cost, high-credit-cost lender (FY26)', head: ['Line', '₹ crore', '% of average book', 'Comment'], wide: [3], rows: [
      ['Interest income', '6,213', `${r(6213.35)}%`, 'Consumer and two-wheeler loans price at 20%+'],
      ['Fees, commission and fair-value gains', '978', `${r(977.79)}%`, 'Insurance and other fees'],
      ['Finance cost', '(1,934)', `(${r(1934.29)}%)`, 'Debt ÷ equity 4.6x; rated AA+'],
      ['Operating costs (staff, other, fees paid, depreciation)', '(2,858)', `(${r(2858.19)}%)`, 'Branch- and agent-heavy model'],
      ['Impairment (credit cost)', '(1,157)', `(${r(1156.59)}%)`, 'High: unsecured consumer loans'],
      { hl: true, cells: ['**Profit before tax (before exceptional)**', '**1,247**', `**${r(1246.93)}%**`, 'PAT ₹913 cr; ROA ~' + n1(roa26) + '% on the book'] },
    ], source: 'TVS Credit audited FY26 results (NSE debt filing, 20-Jul-2026); AR FY26' } },
    { pair: [
      { type: 'column', title: 'Book: ₹26,647 cr (FY25) to ~₹49,000 cr (FY29E)', unit: 'TVS Credit AUM at March (₹ crore); FY27-29E = GAM', x: ['FY25', 'FY26', ...TCF.map(t => t.fy)], series: [{ name: 'AUM', values: [T25.aum, T26.aum, ...TCF.map(t => Math.round(t.aum))], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'Company; GAM estimates (AUM +18/17/16%, ROA 3.2%, no dividend)' },
      { type: 'column', title: 'Profit: ₹767 cr (FY25) to ~₹1,450 cr (FY29E)', unit: 'TVS Credit PAT (₹ crore); FY27-29E = GAM', x: ['FY25', 'FY26', ...TCF.map(t => t.fy)], series: [{ name: 'PAT', values: [Math.round(T25.pat), Math.round(T26.pat), ...TCF.map(t => Math.round(t.pat))], fmt: 'num' }], labels: 'all', highlight: 'FY26', source: 'AR FY25-26 (AOC-1); GAM estimates' },
    ] },
    { h: 'What it is worth, and who owns it' },
    { p: `TVS Motor owned 80.76% directly (plus 0.42% through a subsidiary) at March 2026; Premji Invest bought 9.7% in 2023 for ₹737 cr. On 27-Jul-2026 TVS Motor bought another 4.39% from external holders for ₹711 cr, lifting its stake to 85.15% (fully diluted), which values all of TVS Credit at ~₹${n0(deal.value)} cr: ${n1(deal.pbTrail)}x the June-2026 book, ${n1(deal.pe)}x trailing profit and ${n1(deal.pbSep28)}x our Sep-28E book. At the AGM a week earlier the chairman said the group is evaluating options "including a possible separation of the financial services business", in stages.` },
    { exhibit: { type: 'table', title: `Valuing TVS Credit: ${PB.base}x Sep-28E book`, head: ['Yardstick', 'Evidence', 'Implied P/B'], wide: [1], rows: [
      ['House targets for listed retail lenders', LPB.map(l => `${l.sym} ${l.tpMult}x`).join(', ') + ' (Sep-28E book, our published reports)', `Median **${n1(lenderMed)}x** → our base`],
      ['Market multiples of the same lenders', `Price ÷ FY27E book at 30-Sep-2026: median ${n1(lenderFwdMed)}x`, 'On Sep-28E book ~1.7-1.9x'],
      ['The July-2026 transaction', `₹711 cr for 4.39%: ${n1(deal.pbTrail)}x Jun-26 book`, `${n1(deal.pbSep28)}x Sep-28E book; bull case ${PB.bull}x trailing`],
      ['Justified P/B', `(ROE ${tcRoe}% − growth ${tcG}%) ÷ (cost of equity ${tcKe}% − ${tcG}%)`, `${n1(justPb)}x → bear case`],
      ['Street', 'PL ₹93/share, Choice ₹101, BOBCAPS ₹133; Nirmal Bang and Axis 1.5x book, Arihant 1.3x, Emkay 2.0x FY28E book (₹426)', '1.3-2.0x'],
    ], source: 'GAM Research; broker notes Jul-Aug 2026; Autocar Pro (27-Jul-2026)' } },
    { callout: `**Our value:** ${PB.base}x × Sep-28E book of ₹${n0(tcBook)} cr × ${n1(stake * 100)}% = ₹${n0(PB.base * tcBook * stake)} cr, or **₹${n0(SOTP.base.tvsCredit)} per TVS Motor share** (bull ${PB.bull}x ₹${n0(SOTP.bull.tvsCredit)}, bear ${PB.bear}x ₹${n0(SOTP.bear.tvsCredit)}). No holding-company discount, because a separation would hand the stake to shareholders; a 20% discount would cut ~₹${n0(SOTP.base.tvsCredit * 0.2)} a share. Risks: credit cost of ~4% of the book is high, the book depends on TVS sales, and the separation might need fresh capital.` },
  ],
};

const subsidiaries = {
  id: 'subsidiaries', nav: 'Norton & other subsidiaries', kicker: 'Capital allocation', title: 'Norton and the e-bike group: ₹7,000 cr invested, ~₹1,300 cr a year of losses',
  blocks: [
    { p: `TVS Motor's investment in TVS Motor (Singapore), the holding company for Norton, the Swiss/German/UK e-bike businesses, TVS Digital and Engines Engineering (Italy), rose from ₹${n0(IC.fy25.singapore)} cr to ₹${n0(IC.fy26.singapore)} cr in FY26 alone (US$222m added). Norton has absorbed over £250m since its purchase in FY21 and lost ₹723 cr in FY26; TVS EBike, which bought the Swiss E-Mobility Group and EGO Movement, lost ₹${n0(416.59 + 14.83)} cr on CHF 56m of revenue in a European market with "excess inventory and excessive discounting". Together with the holding company, DriveX and Ultraviolette, the subsidiaries other than TVS Credit cost TVS shareholders ~₹1,350 cr in FY26, about ₹28 a share, and Q1FY27 was no better.` },
    { pair: [
      { type: 'column', title: 'Investment in the Singapore holding company: +38% in a year', unit: 'TVS Motor\'s investments at cost (₹ crore)', x: ['Singapore holdco', 'TVS Credit', 'DMCC (Dubai)', 'PT TVS', 'DriveX'], series: [{ name: 'Mar-25', values: [IC.fy25.singapore, IC.fy25.tvsCredit, IC.fy25.dmcc, IC.fy25.ptTvs, IC.fy25.driveX], fmt: 'num', grey: true }, { name: 'Mar-26', values: [IC.fy26.singapore, IC.fy26.tvsCredit, IC.fy26.dmcc, IC.fy26.ptTvs, IC.fy26.driveX], fmt: 'num' }], labels: 'all', source: 'AR FY26 standalone note 4' },
      { type: 'column', title: 'Subsidiaries ex-TVS Credit: ~₹300 cr of losses every quarter', unit: 'Consolidated attributable PAT − standalone PAT − TVS share of TVS Credit PAT (₹ crore, derived)', x: ['Q1FY26', 'Q2FY26', 'Q3FY26', 'Q4FY26', 'Q1FY27'], series: [{ name: 'Loss', values: [SQ.q1fy26, SQ.q2fy26, SQ.q3fy26, SQ.q4fy26, SQ.q1fy27], fmt: 'num' }], labels: 'all', source: 'Screener.in (consolidated and standalone); TVS Credit results; GAM Research' },
    ] },
    { p: 'Management argues FY27 is the "turnaround year" for Norton: Manx and Manx R (1200cc) are built at Solihull, Atlas and Atlas GT (600cc) at Hosur since June 2026, sold in the UK, Europe and India, with the US due in summer FY27. It has not disclosed a volume target or a break-even year ("an internal strategy"), and guided FY27 investment in subsidiaries at ~70% of FY26\'s ₹2,400 cr. Kotak estimated the subsidiaries\' EBIT loss (ex-TVS Credit) at ₹380 cr in Q1FY27 vs ₹230 cr a year earlier.' },
    { exhibit: { type: 'table', title: 'How we value the other subsidiaries: present value of losses to breakeven', head: ['Case', 'Assumed losses (₹ cr)', 'PV at Sep-27 (Ke ' + n1(ke) + '%)', '+ PT TVS & Ultraviolette', 'Value (₹ cr)', '₹ / share'], rows: ['base', 'bull', 'bear'].map(k => [
      `**${k[0].toUpperCase() + k.slice(1)}**`, LOSS[k].map((l, i) => `FY${28 + i}E ${n0(l)}`).join(', ') + ', then breakeven', n0(OTH[k].pvLoss), n0(ptTvs + uv), n0(OTH[k].value), n0(OTH[k].value / shares)]),
      source: 'GAM Research. PT TVS at 15x FY26 profit (₹32 cr); Ultraviolette at cost (₹121 cr). No value after breakeven (house rule: no perpetuity multiple on start-up losses).' } },
    { callout: '**Brutal truth:** the street mostly ignores these businesses or adds them at book value. We think that flatters the stock. Until Norton and the e-bikes show a path to profit, each year of losses is shareholders\' money: consolidated FY26 EPS was ₹63.5 against ₹76.1 standalone, a 17% gap, even after a profitable TVS Credit.' },
  ],
};

module.exports = { tvsCredit, subsidiaries, moat: P4B.moat };
