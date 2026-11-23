// Torrent Pharma report, part 6: glossary and statement notes.
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Branded generics', 'Off-patent medicines sold under the company\'s own brand name and promoted to doctors (India, Brazil). Prices and loyalty are higher than for plain generics.'],
      ['Generics (US, Germany)', 'Unbranded copies sold on price to wholesalers, pharmacy chains or insurers (German tenders); prices fall every year.'],
      ['IPM', 'Indian pharmaceutical market (retail prescription sales tracked by AIOCD Pharmatrac / IQVIA).'],
      ['Chronic / sub-chronic / acute', 'Medicines taken for years (cardiac, diabetes, CNS), for weeks to months (gastro, pain, VMN), or for days (antibiotics). Chronic sales are steadier.'],
      ['Field force, MR, PCPM', 'Medical representatives who visit doctors; PCPM = sales per rep per month (Torrent ~₹10 lakh).'],
      ['Mother brand', 'A brand family including all its strengths and combinations; Torrent has 27 above ₹100 cr a year.'],
      ['CDMO', 'Contract development and manufacturing for other pharma companies (JB makes lozenges for multinationals).'],
      ['NCLT, scheme of amalgamation, appointed date', 'The National Company Law Tribunal approves mergers; the appointed date (21-Jan-2026) is when the merger takes effect in the accounts; the effective date (8-Jul-2026) is when it became legally complete.'],
      ['Swap ratio', 'Shares of the acquirer given per share of the target: 51 Torrent shares for every 100 JB shares.'],
      ['Minority (non-controlling) interest', 'The part of a subsidiary owned by outsiders (51.2% of JB from Jan to Jul-2026); eliminated when the merger shares were issued.'],
      ['Purchase-price allocation (PPA), brand amortisation', 'On an acquisition, the price is allocated to the target\'s assets at fair value, including brands (₹19,627 cr for JB), which are then expensed over their useful life (up to 15 years): ~₹1,340 cr a year, non-cash.'],
      ['Deferred tax liability (DTL)', 'Tax the accounts set aside because the book value of the brands exceeds their tax value; it unwinds as the brands are amortised, lowering book tax (~₹337 cr a year).'],
      ['EPS before JB amortisation', 'Reported EPS plus the JB brand amortisation net of its deferred-tax credit, per share: the basis on which we compare the forward P/E with Torrent\'s pre-deal history.'],
      ['Pro forma FY26', 'FY26 restated as if JB had been owned 100% from 1-Apr-2025, with a full year of brand amortisation and acquisition interest, on 38.04 cr shares.'],
      ['NCD, CP', 'Non-convertible debentures (bonds) and commercial paper (short-term debt) used to fund the deal.'],
      ['Net debt / EBITDA', 'Borrowings (incl. leases) less cash and liquid investments, divided by a year\'s EBITDA: a leverage measure.'],
      ['Constant currency (cc)', 'Growth in local currency, removing the effect of exchange-rate moves on rupee revenue.'],
      ['ANVISA, USFDA, ANDA', 'Brazil\'s and the US drug regulators; an ANDA is a US generic-drug approval.'],
      ['EV/EBITDA, P/E', 'Enterprise value (market value plus net debt) ÷ EBITDA; share price ÷ earnings per share.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required return on all capital (here 11.2%).'],
    ], source: 'GAM Research' } },
  ],
};

const statementNotes = {
  'pat@FY22': '−38%: ₹475 cr exceptional loss (₹299 cr after tax) in FY22.',
  'sales@FY23': '+13%: Curatio consolidated from 14-Oct-2022 (₹126 cr in FY23); India +16%.',
  'ebitdaMargin@FY24': '+190bp: India mix and price increases; gross margin 75%.',
  'sales@FY25': '+7%: India +13%; US flat; Brazil −2% in rupees (currency).',
  'pat@FY25': '+15%: margin and lower interest; NPPA demand settled (exceptional).',
  'sales@FY26': 'Pro forma ₹17,352 cr with JB for the full year (AR note 42); reported ₹13,980 cr (+21%; base +15%).',
  'ebitda@FY26': 'Pro forma: reported ₹4,559 cr + JB before 21-Jan-2026 ₹884 cr.',
  'dep@FY26': 'Pro forma: incl. a full year (₹1,340 cr) of JB brand amortisation; reported ₹1,119 cr.',
  'pat@FY26': 'Pro forma ₹1,333 cr (full-year deal interest and amortisation); reported to owners ₹2,163 cr.',
  'eps@FY26': 'Pro forma ₹35.0 on 38.04 cr shares; reported ₹63.92 on 33.84 cr shares.',
  'otherIncome@FY26': 'Hedging/FX loss ₹183 cr and ₹89 cr of exceptional items (deal costs ₹70 cr, JB severance ₹19 cr).',
  'sales@Q4FY26': '+42%: JB consolidated from 21-Jan-2026 (₹775 cr); base +16%.',
  'dep@Q4FY26': 'Includes ₹257 cr of JB brand amortisation for 70 days.',
  'pat@Q4FY26': 'Profit to owners ₹389 cr (minority share −₹25 cr); exceptional −₹66 cr.',
  'sales@Q1FY27': '+55%: base +17% (India +19%), JB ₹1,201 cr (+10%).',
  'pat@Q1FY27': '+3%: brand amortisation (~₹335 cr) and interest (₹305 cr); EPS ₹14.87 on the post-merger share count.',
  'sales@FY27E': 'GAM build: India base +16%, JB India +10%, Brazil +16%, US +12%, Germany +4%.',
  'ebitdaMargin@FY27E': 'Torrent base 33.3% (+50bp), JB 35.5% with early synergies.',
  'eps@FY27E': 'Before JB amortisation: ~₹88.',
  'eps@FY29E': 'Before JB amortisation: ~₹132; net debt ~0.6x EBITDA.',
};

module.exports = { glossary, statementNotes };
