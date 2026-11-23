// Gabriel India report, part 2: what the company does, history and corporate actions, industry and the tailwind test.
const X = require('./GABRIEL.ctx');
const { C, D, n0, n1 } = X;
const I = D.industry, rup = s => String(s).replace(/Rs ?(?=[0-9])/g, '₹');
const ST = C.business.structure;

const business = {
  id: 'business', nav: 'What Gabriel does', kicker: 'The business', title: 'A ride-control maker that is becoming the Anand Group\'s listed holding company for auto parts',
  blocks: [
    { p: rup('Gabriel India was set up in 1961 and is the flagship listed company of the Anand Group (promoter: Asia Investments Pvt Ltd, controlled by the Anand family). Its own business is ride control: shock absorbers, struts and front forks (500+ models) made in plants at Hosur, Nashik, Parwanoo, Sanand, Chhatrapati Sambhajinagar, Chakan (two plants), Khandsa (Gurgaon) and Dewas (AR FY26), sold to two- and three-wheeler, car, truck and railway makers (88% of revenue) and through the aftermarket (12%). In FY26 two- and three-wheelers were ~62% of standalone sales, cars ~24%, trucks and railways ~13%. Since the scheme it also sells Anchemco\'s automotive fluids (diesel exhaust fluid, coolants, brake fluids), owns a sunroof maker (IGSS, with Inalfa of the Netherlands), 76% of a synchroniser-ring and aluminium-forging maker (ACYM) and 51% of a fastener start-up (with Jinhap of Korea). And it now holds minority stakes in five businesses run by foreign partners.') },
    { exhibit: { type: 'table', title: 'The new Gabriel, entity by entity (FY26, 100% figures, ₹ crore)', head: ['Entity', 'What it makes', 'Gabriel\'s stake', 'How it is counted', 'Revenue', 'PAT / EBITDA'], wide: [1], rows: ST.map(e => [e.entity.replace(/ \(.*\)$/, ''), (e.entity.match(/\((.*)\)$/) || [])[1] || '', `${e.stake}%`, e.accounting, e.fy26Revenue ? n0(e.fy26Revenue) : '–', e.fy26Pat ? `PAT ${n0(e.fy26Pat)}` : e.fy26Ebitda ? `EBITDA ${n1(e.fy26Ebitda)}` : e.fy26AdjEbitda ? `adj. EBITDA ~${e.fy26AdjEbitda}` : '–']), source: 'Q1FY27 deck slides 18-23 (21-Jul-2026); Q4FY26 deck and call; KPMG/BDO valuation report; Project Lavender disclosure' } },
    { exhibit: { type: 'table', title: 'Where Gabriel sells shock absorbers (FY26)', head: ['Segment', 'Share of standalone sales', 'Gabriel market share', 'Key customers', 'FY26 industry production'], wide: [3], rows: [
      ['Two- and three-wheelers', '~62%', '32% (electric 2W ~60%)', 'TVS, HMSI, Yamaha, Suzuki, Greaves; EV makers', '2W +11.8%, 3W +23.9%'],
      ['Passenger vehicles', '~24%', '25%', 'Maruti Suzuki, Mahindra, Skoda/VW', '+9.4% (UVs +12.2%)'],
      ['Commercial vehicles and railways', '~13%', '88%', 'Tata Motors, Ashok Leyland, Mahindra, VECV; railways', '+13.1%'],
    ], source: 'Q4FY26 deck slides 17-18 (company market-share estimates; SIAM production)' } },
    { callout: '**In one line:** Gabriel\'s factories make a commodity-like but technically demanding product for every Indian vehicle maker; its share price now also reflects stakes in group companies that are better businesses than Gabriel itself but are controlled by Dana, Henkel and HL.' },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Sixty years of shock absorbers; two years of transformation',
  blocks: [
    { exhibit: { type: 'table', title: 'Milestones and what they did to the numbers', head: ['When', 'Event', 'Impact on the numbers'], wide: [1, 2], rows: [
      ['1961', 'Gabriel India set up (Anand Group flagship)', 'Single-product ride-control company for 60 years'],
      ['May-2023', 'Sunroof subsidiary IGSS (with Inalfa) starts supplying Hyundai and Kia', 'Consolidated accounts from FY24; FY26 IGSS revenue ₹434 cr, EBITDA 15.1%'],
      ['Apr-2025', 'Marelli Motherson Auto Suspension assets (Chakan-2: 3.2 mn shock absorbers, 1 mn gas springs) bought; Marelli licence', 'In standalone FY26 revenue'],
      ['30-Jun-2025', 'Board approves the composite scheme ("Project Rise")', 'Stock re-rated: weekly close ₹667 → ₹951 in a week'],
      ['27-Feb-2026', 'Jinhap Gabriel (51%, fasteners) and SK Enmove Gabriel (49%, lubricants) begin', 'Small start-up losses'],
      ['11/22-May-2026', 'NCLT sanction; scheme effective', 'FY26 restated: revenue ₹4,667 → ₹5,245 cr, PAT ₹252 → ₹431 cr'],
      ['9-Jun-2026', '3.36 cr shares allotted to AIPL\'s shareholders', 'Shares 14.36 → 17.72 cr; promoters 55.0% → 63.6%'],
      ['21-Jul-2026', '"Project Jupiter" announced with Q1FY27 results', 'HL Mando Anand 28.99% (₹2,231 cr) and HL Klemove ~30% (US$98.44 mn)'],
      ['21-Aug-2026', 'HL Klemove JV and share purchase agreements executed', 'Associate from closing (75% of the price at closing)'],
      ['10/11-Sep-2026', '₹1,000 cr 8.15% NCDs (CRISIL AA+); 1.44 cr shares to AIPL at ₹1,305.89', 'Shares 19.16 cr; borrowings ~₹1,500 cr incl. the deferred payment'],
    ], source: 'Exchange filings and results; Q4FY26 and Q1FY27 decks and calls; Screener.in prices' } },
    { callout: '**What the history means for the numbers:** three bases in eight years. FY19-23 are the standalone company, FY24-25 the consolidated company before the scheme, FY26 the restated company after it, and FY27 adds the two Jupiter stakes from mid-September. EPS growth across those lines (₹17.05 → ₹24.29 → our ₹{{F.eps.0|n1}}) is partly accounting and dilution, not operations.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'Indian vehicle production is strong in 2026; ride control grows with it, not much faster',
  blocks: [
    { p: rup(`${I.fy26} ${I.q1fy27} The Sep-2025 GST cut on small cars and two-wheelers lifted demand from Q3FY26, so the FY27 comparison base rises from October. Shock absorbers are fitted to every vehicle (two on a scooter's rear or a fork at the front, four on a car, more on trucks), so volumes track production; value per vehicle rises with premiumisation (gas-charged and adjustable dampers, inverted forks on bigger motorcycles, SUVs taking a larger share of cars) and with new uses (cabin dampers on trucks, solar-tracker dampers, e-bike forks). Competitors include Munjal Showa, Endurance, ZF (Sachs), KYB, Tenneco and Mando itself.`) },
    { exhibit: { type: 'table', title: 'New markets Gabriel and its stakes address', head: ['Market', 'Size / growth', 'Gabriel\'s position'], wide: [2], rows: [
      ['Sunroofs', 'Domestic sunroof industry +16% CAGR FY24-27 (company)', 'IGSS: 2 lines of 2 lakh units; Hyundai/Kia anchor customers'],
      ['Solar-tracker dampers', 'US$160 mn in 2026, +16% CAGR to 2034 (company)', 'Orders from 3 customers, domestic and export'],
      ['ADAS (driver assistance)', 'Content ₹20,000-70,000 per vehicle (Group CEO)', 'HL Klemove India: Mahindra and Tata programmes won; ~30% stake'],
      ['Brakes and steering', 'HL Mando Anand FY26 revenue ₹5,886 cr, ~40% from non-Korean OEMs', '28.99% stake; India is ~10-12% of HL Mando global revenue, its fourth-largest unit (call)'],
      ['Drivelines, adhesives', 'Dana Anand ₹2,987 cr, Henkel Anand ₹956 cr (FY26)', '25.1% and 49% stakes'],
    ], source: rup(I.src) } },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the auto tailwind reach Gabriel? Volumes yes, margins no',
  blocks: [
    { exhibit: { type: 'table', title: 'The tailwind, tested', head: ['Tailwind', 'Does it reach Gabriel?', 'Evidence'], wide: [2], rows: [
      ['Two-wheeler and EV boom', 'Yes', 'Q1FY27 2W production +23%; Gabriel ~60% of e-2W shock absorbers; 2W/3W ~58% of Q1 revenue'],
      ['SUV mix in cars', 'Partly', 'PV revenue +5.5% in Q1FY27 vs industry +15%: absent on some fast-growing UV platforms (call)'],
      ['Truck cycle and railways', 'Yes', 'CV share 88%; CV revenue +15.5% in Q1FY27'],
      ['Premiumisation / content per vehicle', 'Slowly', 'EBITDA margin still ~9%: pricing is reset with customers, commodity costs passed through with a lag'],
      ['Group consolidation', 'Yes, at a price', 'Stakes add ~₹{{as.otherIncome.1|num}} cr of FY28E other income incl. JV profit; paid in new shares and debt'],
      ['Exports', 'Not yet', '3-4% of standalone revenue; 10% target without a date'],
    ], source: 'Q1FY27 call and deck; Q4FY26 deck; GAM Research' } },
    { callout: '**Verdict:** the volume tailwind reaches Gabriel in full; the profit tailwind mostly does not, because the business has never shown pricing power. The earnings acceleration in our model comes mainly from the stakes, not from the factories.' },
  ],
};

module.exports = { business, history, industry, tailwind };
