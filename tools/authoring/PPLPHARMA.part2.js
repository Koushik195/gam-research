// Piramal Pharma report, part 2: what the company does, history & corporate actions (industry and tailwind in part2b).
const X = require('./PPLPHARMA.ctx');
const { C, A, n0, n1, b, SA, rup } = X;
const sa26 = SA.find(a => a.fy === 'FY26');
const pct = k => Math.round(sa26[k] / (sa26.cdmo + sa26.chg + sa26.pch) * 100);

const business = {
  id: 'business', nav: 'What it does', kicker: 'The business', title: 'Three businesses under one roof: a global CDMO, a niche hospital-generics franchise and Indian consumer brands',
  blocks: [
    { p: `Piramal Pharma was carved out of Piramal Enterprises and listed on 19-Oct-2022. It has three businesses that share little beyond the name and a balance sheet. **CDMO** (Piramal Pharma Solutions, ₹${n0(sa26.cdmo)} cr in FY26, ${pct('cdmo')}% of business revenue) develops and manufactures drugs for ~500 pharma and biotech customers at 15 sites in India, the US, Canada and the UK: drug substances (APIs) including high-potency ones, peptides, antibody-drug conjugates (ADCs) and sterile injectables. About 47% of its revenue comes from innovation-related work (development, discovery and on-patent commercial supply); the other 53% is commercial supply of older products. **Complex Hospital Generics** (Piramal Critical Care, ₹${n0(sa26.chg)} cr, ${pct('chg')}%) sells inhaled anaesthetics (sevoflurane, isoflurane, desflurane; 64% of CHG), intrathecal baclofen and morphine for spasticity and pain (15%), injectable pain products (11%) and others to 6,000+ hospitals in 100+ countries; half of it is sold in the US. **Consumer Healthcare** (PCH, ₹${n0(sa26.pch)} cr, ${pct('pch')}%) sells over-the-counter brands in India: Little's (baby care), Lacto Calamine (skin), i-pill and i-range (women's health), Saridon, Polycrol, Tetmosol, CIR.` },
    { p: `On top of the three, Piramal owns **49% of AbbVie Therapeutics India**, which sells AbbVie's eye-care brands (Lumigan, Combigan, Alphagan, Refresh Tears, Pred Forte) in India: revenue ₹510 cr and profit ₹123 cr in FY26, ₹60 cr of it Piramal's share. It sits below EBITDA, in "share of associates". It also owns **33.33% of Yapan Bio**, a small loss-making vaccines and biologics manufacturer. About 77% of revenue is exported (CARE); by geography FY26 revenue was 40% North America, 21% Europe, 23% India and 5% Japan.` },
    { exhibit: { type: 'table', title: 'The three businesses at a glance (FY26)', head: ['', 'CDMO', 'Hospital generics (CHG)', 'Consumer (PCH)'], rows: [
      ['Revenue (₹ cr) and growth', `${n0(sa26.cdmo)} (−10%)`, `${n0(sa26.chg)} (+3%)`, `${n0(sa26.pch)} (+17%)`],
      ['Q1FY27 growth', '+19%', '+17%', '+15%'],
      ['What drives it', 'RFPs and orders from big pharma and biotech; on-patent molecules reaching market; utilisation of overseas plants', 'US hospital volumes and GPO contracts; ex-US tenders; new products (Kenalog)', 'Brand spend (~12% of sales), e-commerce (27-28% of sales), distribution reach'],
      ['EBITDA margin (not disclosed; GAM estimate)', `~${X.M26.cdmo}% ("high single digit")`, `~${Math.round(X.M26.chg)}% ("stable")`, `~${X.M26.pch}% ("low single digits")`],
      ['Market position', '"Top 3 in India, ~13th globally" (Screener summary of company material); 157 molecules in development, 25 in Phase III', '#1 in US sevoflurane (48%) and intrathecal baclofen', 'Fast-growing brands in large niches; ~2x market growth'],
      ['Capital intensity', 'High: ~₹8,700 cr of fixed assets group-wide, mostly CDMO', 'Medium: Bethlehem (US) and Digwal plants', 'Low: asset-light, outsourced manufacturing'],
    ], source: 'Q4FY26 and Q1FY27 presentations; CARE (17-Jul-2026); JM Financial (16-Apr-2026); GAM estimates for margins' } },
    { callout: '**Why it matters:** the three businesses deserve different valuations (the street gives CDMO 17-23x EBITDA, CHG 11-15x, PCH 13x EBITDA or 2x sales), but Piramal reports a single segment and no business-level profit. Every segment margin in this report, ours and the street\'s, is an estimate. That is a real disclosure weakness for a company asking to be valued as a CDMO.' },
  ],
};

const T = C.timeline;
const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'History: built by acquisitions, funded by Carlyle and debt, listed in 2022 into a downturn',
  blocks: [
    { p: rup('The Piramal group entered pharma in 1988 with Nicholas Laboratories and sold its Indian branded formulations to Abbott for US$3.7 bn in 2010, keeping contract manufacturing, critical care and consumer brands. In October 2020 Carlyle paid Rs3,523 cr for 20% of the pharma business, money that went into acquisitions (Hemmo peptides, Convergence Chemicals, a stake in Yapan Bio, the Riverview HPAPI site in the US) and capacity. The business was demerged from Piramal Enterprises and listed on 19-Oct-2022, just as post-Covid CDMO demand fell and new overseas capacity came on stream: FY23 EBITDA halved and the stock fell to ~Rs65 by March 2023. A Rs1,050 cr rights issue in August 2023 (Rs81 a share, promoters subscribing) cut debt. FY24-25 recovered, the September-2024 analyst day set FY30 targets and the stock reached ~Rs282, before the FY26 destocking sent it back to ~Rs138.') },
    { exhibit: { type: 'table', title: 'Timeline and what each event did to the numbers', head: ['Date', 'Event', 'Impact'], wide: [1, 2], rows: T.map(t => [t.date, rup(t.event), rup(t.impact)]), source: 'Company filings and presentations; AR FY26; Screener (about); CARE; press as cited in company.json' } },
    { callout: '**So what:** Piramal has never shown a full cycle as a listed company with steady profits; its record is FY23 loss, two near-zero years, FY26 loss. Management guidance missed in FY26 (cut from low single-digit growth to flat; the year ended −3%). That record is why we do not give credit for the FY30 targets in the base case.' },
  ],
};

const { industry, tailwind } = require('./PPLPHARMA.part2b');
module.exports = { business, history, industry, tailwind };
