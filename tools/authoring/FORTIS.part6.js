// Fortis report, part 6: glossary.
const glossary = {
  id: 'glossary', nav: 'Glossary', kicker: 'Appendix', title: 'Glossary',
  blocks: [
    { exhibit: { type: 'table', title: 'Terms used in this report', head: ['Term', 'What it means'], wide: [1], rows: [
      ['Operational / O&M beds', 'Beds open and staffed. O&M (operations & management) beds belong to other owners; Fortis runs them for a fee (e.g. 3% of revenue at Gleneagles) and does not consolidate their revenue.'],
      ['Occupancy', 'Occupied beds ÷ operational beds, averaged over the period.'],
      ['ARPOB', 'Average revenue per occupied bed. Fortis quotes it in ₹ crore per bed per year on gross revenue (₹2.51 cr in FY26 ≈ ₹68,800 per bed-day); reported revenue is ~5% lower.'],
      ['ALOS', 'Average length of stay of an inpatient (days). Fortis does not report it; a broker put it at 4.19 days in Q1FY27.'],
      ['Brownfield / greenfield', 'Adding beds to an existing hospital (new floors or towers) vs building a new hospital on a new site. Brownfield beds fill faster and cost less.'],
      ['Margin matrix', 'Fortis\'s quarterly grouping of its hospitals by EBITDA margin band (>20%, 15-20%, 10-15%, <10%).'],
      ['Operating EBITDA', 'Company measure: revenue less operating costs, excluding other income and (from Q1FY27) the ESOP charge. Our model EBITDA deducts the ESOP charge.'],
      ['ESOP', 'Employee stock option plan: shares granted to doctors and staff; the fair value is charged to profit over the vesting period (non-cash).'],
      ['TPA', 'Third-party administrator: processes claims for health insurers; stands for insured patients in the payer mix.'],
      ['CGHS / ECHS', 'Central Government Health Scheme and Ex-servicemen Contributory Health Scheme: government payers that set package prices and, since FY26, cap chemotherapy drug prices at MRP less 30%.'],
      ['B2C / B2B (diagnostics)', 'Tests sold to patients directly vs to hospitals, labs and corporates. B2C is stickier and more profitable.'],
      ['Customer touchpoints', 'Agilus collection centres and pick-up points (4,493 at Jun-2026).'],
      ['Ind AS 116 (leases)', 'Accounting rule that puts leased buildings on the balance sheet: rent becomes depreciation and interest; future rent appears as a lease liability (₹600 cr for Fortis at Mar-2026).'],
      ['Minority interest', 'The part of a subsidiary owned by others: 11.68% of Agilus. Their share of profit is not Fortis shareholders\' profit.'],
      ['Forensic audit', 'A court-ordered investigation of transactions; here into the 2016-2018 dissipation of the former promoters\' Fortis shares, IHH\'s 2018 investment and the RHT buyback.'],
      ['Open offer / MTO', 'Mandatory tender offer an acquirer must make to minority shareholders under SEBI rules; IHH\'s, at ₹170 a share, was frozen from 2018 and completed in Nov-2025.'],
      ['Sum of the parts (SOTP)', 'Valuing each business separately (here hospitals and Agilus on EV/EBITDA), then deducting net debt and minorities.'],
      ['EV/EBITDA, P/E', 'Enterprise value (market value plus net debt, incl. lease liabilities, plus minorities) ÷ EBITDA; share price ÷ earnings per share.'],
      ['Sep-28E', 'Half of FY28E plus half of FY29E: the 12-month-forward earnings the market will look at in September 2027.'],
      ['DCF / WACC', 'Discounted cash flow valuation; WACC is the required annual return used to discount future cash (here 11.6%, close to the cost of equity because debt is small).'],
    ], source: 'GAM Research' } },
  ],
};

module.exports = { glossary, statementNotes: {} };
