// Bajaj Housing Finance report, part 5: ownership (Jun-2026), management and governance, forecasts vs the
// street, street view and critiques.
const X = require('./BAJAJHFL.ctx');
const { C, D, F, n0, n1, n2, pc, price, ST, CONS, SE, tpHi, tpLo, mosl, emkay, bvSep28 } = X;
const OW = D.ownership, GV = C.governance;

const ownership = base => ({
  ...base,
  blocks: [
    { p: `In Jun-2026 Bajaj Finance held ${OW.promoter}% (88.75% at listing). Foreign investors held ${OW.fii}% and domestic institutions ${OW.dii}%, very low for a company of its size. Retail and other public holders owned ${OW.public}% through ${(OW.shareholders / 1e5).toFixed(1)} lakh shareholders, a legacy of the record IPO; that count has fallen from 26.5 lakh in Dec-2024. The largest outside holders each own 0.1-0.2%: Catamaran Ventures, Tata AIG, Vanguard index funds, NPS pension schemes and Norway's sovereign fund.` },
    ...base.blocks,
    { exhibit: { type: 'table', title: 'Largest named shareholders, 30-Jun-2026', head: ['Holder', '% of shares'], rows: OW.holders.map(([h, v]) => [h, `${v.toFixed(2)}%`]), source: 'Q1FY27 presentation p20 (top-20 list)' } },
    { callout: '**So what:** the register is a parent plus retail. The natural long-term owners of a AAA mortgage lender (domestic mutual funds, insurers, foreign long-only funds) hold almost nothing yet, partly because the float is small. The parent\'s sell-down is the way they come in, and the price at which they are willing to buy ~₹8,000 cr of stock is the main question for the next three years.' },
  ],
});

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management and governance: a disciplined group operator; the parent sits on both sides of some deals',
  blocks: [
    { p: `BHFL is run by Atul Jain (MD) and Gaurav Kalani (CFO) and chaired by Sanjiv Bajaj (Bajaj Finserv), with Rajeev Jain (Bajaj Finance's MD) as non-executive vice chairman. ${GV.board.replace(/^8 directors at Mar-26: /, 'The board has eight directors: ')}. The joint auditors gave an unmodified opinion for FY26. Disclosure is good: a 9-year history, product-level asset quality, stage-wise provisions, a behavioural maturity table and an annual "management assessment" that it has met or beaten.` },
    { verdicts: [
      ['Promoter and group', 'Strong', 'Bajaj Finance (86.7%) and Bajaj Finserv: deep capital, the AAA rating and a shared risk culture.', 'The parent\'s support underpins the funding cost.'],
      ['Management execution', 'Strong', 'AUM ₹3,570 cr → ₹1.5 lakh cr in eight years with gross NPA ~0.3%; FY26 assessment met or beaten on every line.', 'Delivery is not the risk.'],
      ['Related-party dealings', 'Moderate', 'Loan sales to the parent (₹3,645 cr in FY26; omnibus approval up to ₹12,500 cr); ESOP cost reimbursed to BFL (₹10 cr); BFL services assigned loans.', 'Arm\'s length per the company, approved by independent directors; pricing not disclosed.'],
      ['Minority-shareholder alignment', 'Moderate', 'The parent must sell 11.7% by Sep-2029; it chooses timing and route and also shares BHFL gains with its own shareholders.', 'The parent\'s interest (price, capital timing) and minorities\' (no discount, no overhang) can diverge.'],
      ['Board independence', 'Moderate', 'Five of eight directors independent; chairman and vice chairman from the group.', 'Typical of Indian group subsidiaries.'],
      ['Pay', 'Strong', `MD pay ${n0(GV.mdPayRatio)}x the median employee (+${GV.mdPayIncreasePct}% fixed pay in FY26 vs +${GV.medianPayIncreasePct}% for the median); ESOP scheme via a trust.`, 'Restrained by Indian financial-sector standards.'],
      ['Dividends and capital', 'Moderate', 'No dividend since inception; ₹5,560 cr raised in FY25 still being deployed.', 'Sensible for growth; keeps ROE low.'],
    ], head: ['Area', 'Verdict', 'Evidence', 'So what'], title: 'Governance scorecard', source: 'Annual Report FY2025-26 (corporate information, directors\' report, remuneration annexure, AGM notice); company calls' },
    { callout: '**Our view:** governance is solid and disclosure is better than at most housing-finance companies. The structural issue is that BHFL is a subsidiary of a listed parent that buys its loans, cross-charges costs and decides when to sell its stake. None of this is improper; all of it means minority shareholders ride on the parent\'s priorities.' },
  ],
};

const cmpRow = (label, ours, street, src) => [label, ours, street, src];
const forecasts = {
  id: 'forecasts', nav: 'Our forecasts vs the street', kicker: 'Forecasts', title: 'Our forecasts: EPS +17-18% a year, ROE 12-13%; in line with the street for FY27, below it after',
  blocks: [
    { exhibit: { type: 'table', title: 'Key forecasts', x: 'fin.labels', from: 'FY25', to: 'FY29E', rowsRef: [
      { name: 'AUM (₹ cr)', ref: 'fin.aum', fmt: 'num' }, { name: 'AUM growth (%)', ref: 'fin.aumGrowth', fmt: 'pct' }, { name: 'Net interest income (₹ cr)', ref: 'fin.nii', fmt: 'num' },
      { name: 'Net total income ÷ avg AUM (%)', ref: 'fin.ntiPct', fmt: 'pct' }, { name: 'Cost-to-income (%)', ref: 'fin.costToIncome', fmt: 'pct' }, { name: 'Pre-provision profit (₹ cr)', ref: 'fin.ppop', fmt: 'num' },
      { name: 'Credit cost (% avg AUM)', ref: 'fin.creditCost', fmt: 'n2' }, { name: 'Net profit (₹ cr)', ref: 'fin.pat', fmt: 'num', hl: true },
      { name: 'EPS (₹)', ref: 'fin.eps', fmt: 'n2', hl: true }, { name: 'EPS growth (%)', ref: 'fin.epsGrowth', fmt: 'pct' }, { name: 'Book value per share (₹)', ref: 'fin.bvps', fmt: 'n1' },
      { name: 'ROA on total assets (%)', ref: 'fin.roa', fmt: 'pct' }, { name: 'ROE (%)', ref: 'fin.roe', fmt: 'pct', hl: true },
    ], source: 'Company, Screener.in; GAM estimates. No dividend assumed (none paid since inception).' } },
    { p: `FY27E profit of ₹{{F.pat.0|num}} cr (+{{F.patGrowth.0|pct}}) needs ~₹${n0((F.pat[0] - 715) / 3)} cr a quarter for the rest of the year against ₹715 cr in Q1, ${pc(((F.pat[0] - 715) / 3 / 715 - 1) * 100)} above Q1, as AUM keeps growing ~5% a quarter and loan losses normalise from Q1's 5bp. Our FY28-29E profit grows ~18%, slower than AUM, because margins keep slipping; the street (Emkay: NII +30% in FY28E) assumes they recover.` },
    { exhibit: { type: 'table', title: 'Our estimates vs the street (estimates standing on 30-Sep-2026)', head: ['Metric', 'GAM', 'Street', 'Source of street figure'], wide: [3], rows: [
      cmpRow('FY27E EPS (₹)', '{{F.eps.0|n2}}', `${SE.mosl.eps.FY27E}`, 'Motilal Oswal, Emkay, JM Financial (all ₹3.6)'),
      cmpRow('FY28E EPS (₹)', '{{F.eps.1|n2}}', `${SE.mosl.eps.FY28E}-${SE.emkay.eps.FY28E}`, 'Motilal Oswal ₹4.4, JM ₹4.4, Emkay ₹4.5'),
      cmpRow('FY29E EPS (₹)', '{{F.eps.2|n2}}', `${SE.emkay.eps.FY29E}`, 'Emkay'),
      cmpRow('FY28E BVPS (₹)', '{{F.bvps.1|n1}}', `${SE.mosl.bvps.FY28E}-${SE.emkay.bvps.FY28E}`, 'Motilal Oswal ₹35 (₹35.1 on its net worth), JM ₹35, Emkay ₹35.2'),
      cmpRow('FY28E ROE (%)', '{{F.roe.1|pct}}', `${SE.jm.roe.FY28E}-${SE.emkay.roe.FY28E}%`, 'JM 13.4%, Motilal Oswal 13.5%, Emkay 13.8%'),
      cmpRow('FY27E PAT (₹ cr)', '{{F.pat.0|num}}', `${n0(SE.emkay.pat.FY27E)}-${n0(SE.jm.pat.FY27E)}`, 'Emkay ₹2,986 cr, Motilal ₹3,009 cr, JM ₹3,030 cr'),
      cmpRow('AUM growth FY27E', '{{F.aumGrowth.0|pct}}', '22.3-25%', 'JM 22.3%, Emkay 23.5%, Motilal ~25%'),
    ], source: 'Motilal Oswal (29-Jul-2026), Emkay (30-Jul-2026), JM Financial (23-Mar-2026, latest estimates we have). No consensus EPS was available to us (gap).' } },
    { callout: '**Where we differ:** not on FY27 or on book value (our FY28E book is within 1% of the street), but on FY28-29E profit (4-9% below) and ROE (~0.5-1pp below). The street models margins stabilising and then rising as Sambhav grows and borrowing costs fall; we model a slow drift down, because banks set prime pricing and the old, higher-yield book is still running off. Since the stock is valued on book, the gap matters less for the target than for the case that ROE is heading to 14-15%.' },
  ],
};

const street = {
  id: 'street', nav: 'Street view', kicker: 'Street', title: `The street: split, targets ₹${n0(tpLo)}-${n0(tpHi)}, most of them close to the price`,
  blocks: [
    { p: `After Q1FY27 (29-Jul to 1-Aug 2026) 13 brokers had targets from ₹${tpLo} (HSBC, Reduce) to ₹${tpHi} (ICICI Securities, Buy); the average was ₹${CONS.avgTp} and the median ₹${CONS.medianTp}, ~${pc((CONS.medianTp / price - 1) * 100)} above the 30-Sep price. Seven say Buy or Add, three Neutral, three Sell or Reduce. Even the positive notes are lukewarm: Motilal Oswal (Neutral, ₹95, 2.7x FY28E book) says the valuation "largely factor[s] in medium-term growth and profitability potential"; JM Financial (Add, ₹95) says the current ~2.5x FY28E book "appears to adequately reflect these positives, limiting near-term upside"; Emkay (Add, ₹90) values it at 2.6x FY28E book.` },
    { exhibit: { type: 'table', title: 'Critiques we take seriously', head: ['Argument', 'Who', 'Our view'], wide: [0, 2], rows: [
      ['The valuation already prices in the growth and returns', 'Motilal Oswal, JM Financial, Emkay', 'Agree, and we go further: at a 12.5% cost of equity the price implies a ~19% long-run ROE.'],
      ['A prime HFC trading at 2.3-2.5x forward book while other prime HFCs trade at 0.5-0.9x', 'JM Financial (initiation, Mar-2026)', 'Agree; part of the gap is quality and growth, much of it is the Bajaj name.'],
      ['NIM pressure from banks and book run-off', 'ICICI Securities, Motilal Oswal, JM Financial', 'Agree; we model further drift beyond FY27, unlike most of the street.'],
      ['Growth is broad-based and asset quality pristine', 'ICICI Securities (Buy ₹125), Phillip Capital (Buy ₹110)', 'Agree on the facts; they do not change the return on equity.'],
      ['Parent stake sale overhang', 'Market reaction (Dec-2025), press', 'Agree; ~₹8,000 cr to place by Sep-2029.'],
    ], source: 'Broker notes and BusinessToday (29-Jul to 1-Aug 2026); JM Financial initiation (23-Mar-2026); GAM Research' } },
  ],
};

module.exports = { ownership, governance, forecasts, street };
