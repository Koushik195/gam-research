// BLS report, part 2: what the company does, history and corporate actions (incl. the MEA debarment and its reversal),
// industry and the tailwind test.
const X = require('./BLS.ctx');
const { C, D, SA, A26, n0, n1, pc } = X;
const I = D.industry, A25 = X.yr('FY25'), A23 = X.yr('FY23');
const share = (x, t) => n1(x / t * 100) + '%';

const business = {
  id: 'business', nav: 'What BLS does', kicker: 'The business', title: 'A visa-centre operator that earns 90% of its profit from 61% of its revenue, plus a fast-growing, thin-margin digital arm',
  blocks: [
    { p: 'BLS International runs visa application centres for foreign governments. An embassy outsources the front office (appointments, document checks, fingerprints and photos, passport return) and keeps the decision; the applicant pays BLS a service fee on top of the visa fee and can buy extras (premium lounge, courier, SMS, form filling, insurance). The government pays nothing, so BLS earns on volume, the fee set in the tender and how many extras it sells. It works for 46 governments in 100+ countries: Spain (global contract since 2016), Italy, Portugal, Poland, Slovakia, Cyprus and Canada among them, Germany and Italy through iDATA (Turkey, bought in FY25) and the Indian government itself (passport, visa and attestation services at Indian missions abroad, and from FY26 visa centres in China and Aadhaar Seva Kendras in India). It also sells residency and citizenship-by-investment advice (Citizenship Invest, Dubai) and owns a UK hotel. Its listed subsidiary **BLS E-Services** (BLS 51% at Mar-26, 53% after Apr-Aug 2026 purchases) is a different business: banking-correspondent outlets for SBI and other banks, assisted e-government services, loan distribution (Aadifidelis, 57%) and, from Jul-2026, Atyati Technologies.' },
    { exhibit: { type: 'table', title: 'The two segments, FY26 (₹ crore)', head: ['Segment', 'Revenue', 'Share', 'EBITDA (margin)', 'Share of EBITDA', 'How it earns'], wide: [5], rows: [
      ['**Visa & Consular Services**', `**${n0(A26.visaRev)}**`, share(A26.visaRev, A26.sales), `${n0(A26.visaEbitda)} (${n1(A26.visaMargin)}%)`, share(A26.visaEbitda, A26.ebitdaCo), 'Fee per application (user-pay), value-added services, consular and attestation fees; Citizenship Invest advisory fees; hotel'],
      ['**Digital Services (BLS E-Services)**', n0(A26.digRev), share(A26.digRev, A26.sales), `${n0(A26.digEbitda)} (${n1(A26.digMargin)}%)`, share(A26.digEbitda, A26.ebitdaCo), 'Commissions from banks per BC transaction (GTV ₹1.1 lakh cr in FY26); loan-distribution commission of 2-2.5% of loans, most passed to agents; per-service fees'],
      { hl: true, cells: ['**BLS (revenue from operations)**', `**${n0(A26.sales)}**`, '', `**${n0(A26.ebitdaCo)} (27.3%)**`, '', 'Company basis (bank charges inside costs)'] },
    ], source: 'Q4FY26 and Q1FY27 investor presentations; Q4FY26 call (20-May-2026)' } },
    { exhibit: { type: 'table', title: 'Scale and reach', head: ['', 'Detail'], wide: [1], rows: [
      ['Visa applications', `${A26.apps} lakh in FY26 (${A25.apps} lakh in FY25, ${A23.apps} lakh in FY23); 11.3 lakh in Q1FY27, flat year on year`],
      ['Net revenue per application', `₹${n0(A26.nrpa)} in FY26 (₹${n0(A23.nrpa)} in FY23); ₹3,521 in Q1FY27 (+11%)`],
      ['Market position', '~10% of outsourced visa applications and ~17% by value (2024, ex-USA; company estimate); one of two global leaders with the unlisted VFS Global'],
      ['Digital network', '~1.58 lakh touchpoints and ~45,800 channel partners; BC GTV ₹29,500 cr in Q1FY27 (₹26,200 cr a year earlier)'],
      ['New contracts (FY26-27)', 'UIDAI Aadhaar Seva Kendras (₹2,055 cr work order, 6 years), Bihar enrolment centres (₹100 cr), MEA China visa centres (3 years), Slovakia (5-year global), Cyprus, Belarus (Mumbai), West Bengal Ayushman Bharat approvals'],
    ], source: 'Company decks and calls (May and Aug-2026)' } },
  ],
};

const history = {
  id: 'history', nav: 'History & corporate actions', kicker: 'History', title: 'Twenty years of tenders, a model change that tripled margins, a buying spree, and a government ban that a court threw out',
  blocks: [
    { exhibit: { type: 'table', title: 'Milestones and what they did to the numbers', head: ['When', 'Event', 'Impact'], wide: [1, 2], rows: [
      ['2005-2015', 'First visa contract (Portuguese embassy, New Delhi, 2005); services for Indian missions abroad', 'Built the base business, largely through local partners'],
      ['2016-17', 'Listed on NSE/BSE; won the global Spain contract (renewed 2023)', 'Spain became the anchor client'],
      ['FY22-FY24', 'Moved from partner-run to self-managed centres; more value-added services', 'Visa EBITDA margin 14.6% (FY22) → 22.1% (FY24) → 40.1% (FY26)'],
      ['FY23 / FY24', '1:3 bonus (capital ₹10 cr → ₹41 cr); Zero Mass (BC network) bought in Jun-2022 (88% at a ₹120 cr valuation); BLS E-Services IPO (₹296 cr raised, Feb-2024)', 'Share count 41.17 cr; minorities appear in the digital arm'],
      ['FY25', 'Citizenship Invest (₹260 cr), iDATA (Turkey) and 57% of Aadifidelis; ₹205 cr of borrowings', '₹899 cr of acquisition outflow; goodwill ₹1,026 cr; Digital revenue doubled in FY26'],
      ['9-Oct-2025', 'MEA debarred BLS from new tenders of the Ministry and Indian missions for two years (GFR Rule 151(iii)), citing complaints including charging for optional services, late-paid penalties and repeated tender litigation; existing contracts continued', 'Stock fell ~18% on 13-Oct-2025. Indian missions were ~12% of revenue and ~8% of EBITDA (Q1FY26)'],
      ['18-Dec-2025', 'Delhi High Court quashed the order (W.P.(C) 16352/2025): litigation-based grounds untenable, complaints never put to BLS, two-year term unexplained. MEA may issue a fresh, specific show-cause notice only on alleged substandard service', 'BLS can bid for Indian tenders again; we found no appeal or fresh notice by 30-Sep-2026, but the risk is not closed'],
      ['FY26', 'UIDAI Aadhaar order (₹2,055 cr), MEA China centres, Slovakia, Cyprus; Trefeddian Hotel (UK) bought for ~₹78 cr', 'New, lower-margin growth lines from FY27'],
      ['Feb-Jul 2026', 'BLS E-Services agreed (16-Feb) and completed (2-Jul) the purchase of Atyati Technologies for ₹156.82 cr', '~₹275 cr revenue and ₹20-21 cr EBITDA a year added to Digital from Q2FY27'],
      ['Apr-Aug 2026', 'BLS bought 2.21% more of BLS E-Services for ₹45.22 cr', 'Minorities slightly lower'],
    ], source: 'Company decks, AR FY26, MEA order coverage (Business Today, 12/13-Oct-2025), Delhi High Court judgment (18-Dec-2025), company releases (Jul/Aug-2026)' } },
    { callout: '**Why the MEA episode matters even though it was overturned.** The court set the order aside on process, not on the merits of the complaints. The MEA kept the right to issue a fresh, specific notice on service quality. India is BLS\'s home market and one of its largest clients (Indian missions, China centres, attestation, now Aadhaar), and the case showed that a client government can try to shut BLS out of future tenders. We treat it as a live risk in the bear case and in the governance score, not as a closed chapter.' },
  ],
};

const industry = {
  id: 'industry', nav: 'Industry', kicker: 'Industry', title: 'A duopoly-like niche that is still growing, as more governments outsource and more people travel',
  blocks: [
    { p: `${I.market} ${I.structure}` },
    { bullets: [
      '**Growth comes from three places:** more cross-border travel (outbound from India, the Gulf, China and Africa); more governments outsourcing (the outsourced share of applications ~38% in 2024, seen at ~50% by 2029); and more spend per applicant (value-added services, premium lounges, home biometrics).',
      `**Against it:** ${I.drivers}`,
      '**How contracts are won:** by tender, typically for 3-10 years and exclusive by country or region. Technical scores (security, biometrics, data protection, track record) decide eligibility; price decides the winner. Incumbents usually renew, but losses happen and bidders litigate (the MEA order cited BLS\'s own tender challenges).',
    ] },
    { callout: '**So what:** the industry tailwind is real but modest (high single digits in volume, low teens in value, on the company\'s own industry figures), and it is a tender market: growth arrives in lumps when contracts are won and can disappear when one is lost.' },
  ],
};

const tailwind = {
  id: 'tailwind', nav: 'Tailwind test', kicker: 'Tailwind test', title: 'Does the travel tailwind reach BLS? Yes, but FY27 growth is coming from new lines, not from visas',
  blocks: [
    { exhibit: { type: 'table', title: 'Tailwind test', head: ['Question', 'Evidence', 'Verdict'], wide: [1], rows: [
      ['Is the market growing?', 'Outsourced visa value +14% a year to 2029 (industry estimates in the company deck); travel +7-8%', 'Yes'],
      ['Is BLS growing with it?', 'Applications +17.6% in FY26 (new contracts); flat in Q1FY27 (West Asia war); net revenue per application +14% (FY26), +11% (Q1FY27), now "stabilising"', 'Partly: FY27 visa growth is price/mix-led'],
      ['Does growth reach the margin?', 'Visa EBITDA margin 34.5% → 40.1% (FY26), 40.3% in Q1FY27; management targets "maintain"', 'It did; no further gain guided'],
      ['Does it reach earnings per share?', 'Group margin 28.7% (FY25) → 27.3% (FY26) as digital grew; tax-plus-minorities leakage 13.8% (FY26) → 19.5% (Q1FY27); EPS +11% in Q1FY27 on revenue +25%', 'Less than revenue suggests'],
      ['Can a competitor take it away?', 'Contracts are re-tendered; VFS Global competes everywhere; a client government tried to bar BLS (2025)', 'Yes, at each renewal'],
    ], source: 'Company decks and calls; GAM Research' } },
  ],
};

module.exports = { business, history, industry, tailwind };
