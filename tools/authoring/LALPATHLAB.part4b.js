// Dr Lal PathLabs report, part 4b: management & governance, our forecasts vs the street.
const X = require('./LALPATHLAB.ctx');
const { F, A, AS, n0, n1, epsU, epsBase, epsRep, MIN, emkay, jm, kie, nom, oiBuild, OI, oi26Basis, ttmOi, TY, MISC, yld26, intBuild, daBuild, daDiff, daEpsEffect, SHARES, epsSep, SNG } = X;

const governance = {
  id: 'governance', nav: 'Management & governance', kicker: 'Governance', title: 'Management & governance: a founder family with a professional CEO; the MD left in 2025; pay is modest, capital allocation is the question',
  blocks: [
    { p: 'Dr Arvind Lal (Executive Chairman, a pathologist and Padma Shri) and Dr Vandana Lal (Executive Director) represent the founding family; Dr Archana Lal Erdmann is a promoter-group non-executive director. Day-to-day leadership moved to professionals: Om Prakash Manchanda, Managing Director for over a decade, stepped down on 31-Mar-2025, and Shankha Banerjee (CEO) now runs the business with Ved Prakash Goel (Group CFO and CEO, International), who leads the earnings calls. The board has nine members: two executive (both family), two non-executive non-independent (one family) and five independents (including Arun Duggal and Rohit Bhasin).' },
    { exhibit: { type: 'table', title: 'Governance scorecard', head: ['Area', 'Score', 'Evidence'], wide: [2], rows: [
      ['Control and board', 'AMBER', 'Executive Chairman and an Executive Director from one family; 5 of 9 directors independent'],
      ['Succession and continuity', 'AMBER', 'MD Om Prakash Manchanda left on 31-Mar-2025 (Emkay: "leadership transition"); CEO Shankha Banerjee and CFO Ved Goel in place; growth has improved since'],
      ['Pay', 'GREEN', 'Executive Chairman ₹4.0 cr and Executive Director ₹3.2 cr in FY26 (1.4% of profit together; 80x and 64x the median employee); raised 25% vs 6.75% for the median employee'],
      ['Related parties', 'GREEN', 'No material related-party businesses found; subsidiaries are diagnostics operations with 20-30% local partners'],
      ['Capital allocation', 'AMBER', 'Suburban (₹925 cr) has not delivered a second home market; cash pile of ₹1,693 cr earmarked for M&A; payout ~45%'],
      ['Disclosure', 'GREEN', 'Patients, samples, RPP, tests per patient, SwasthFit and regional mix every quarter; Suburban no longer reported separately'],
      ['Accounting and audit', 'GREEN', 'Deloitte; unmodified opinion; one-offs clearly flagged'],
      ['Minority treatment', 'GREEN', 'No dilutive issues; 1:1 bonus; regular dividends; CARE AA+/Stable'],
    ], source: 'AR FY26 (directors\' report, corporate governance report, remuneration disclosures); Q4FY26 and Q1FY27 calls; Emkay (Jul-2025)' } },
    { callout: '**Overall: AMBER.** Clean, conservative and shareholder-friendly in the basics. The open issues are the departure of a long-serving MD in 2025 (the new team has done well so far) and how a family-controlled board will deploy ₹1,700 cr of cash.' },
  ],
};

const STREET_F = [['Emkay (24-Jul)', emkay]];
const val = (o, key) => (o[key] ? Object.values(o[key]).map(v => (key === 'eps' ? n1(v) : n0(v))).join(' / ') : '–');
const forecasts = {
  id: 'forecasts', nav: 'Forecasts vs the street', kicker: 'Forecasts', title: `Our forecasts: EPS ₹${n1(epsU[0])} / ${n1(epsU[1])} / ${n1(epsU[2])}, 3-7% above Emkay on a higher FY27 margin and more treasury income`,
  blocks: [
    { p: `We forecast revenue of {{F.sales.0|num}} / {{F.sales.1|num}} / {{F.sales.2|num}} cr for FY27-29E (+{{F.salesGrowth.0|pct}} / +{{F.salesGrowth.1|pct}} / +{{F.salesGrowth.2|pct}}), EBITDA margin of {{F.ebitdaMargin.0|pct}} / {{F.ebitdaMargin.1|pct}} / {{F.ebitdaMargin.2|pct}} and EPS to shareholders of ₹{{F.eps.0|n1}} / {{F.eps.1|n1}} / {{F.eps.2|n1}} (minorities of ₹${MIN.join(' / ')} cr deducted). FY27E EPS is up ${Math.round((epsU[0] / epsBase[2026] - 1) * 100)}% on FY26's ₹${n1(epsBase[2026])} before exceptional items (${Math.round((epsU[0] / epsRep[2026] - 1) * 100)}% on the reported ₹${epsRep[2026]}). The forecasts exclude SN Genelab and Ghana (not consolidated by 30-Sep-2026; Emkay also excludes them).` },
    { exhibit: { type: 'table', title: 'GAM vs the street (estimates standing on 30-Sep-2026)', head: ['', 'GAM FY27E', 'GAM FY28E', 'GAM FY29E', 'Emkay FY27-29E', 'Others'], wide: [5], rows: [
      ['Revenue (₹ cr)', '{{F.sales.0|num}}', '{{F.sales.1|num}}', '{{F.sales.2|num}}', val(emkay, 'sales'), 'Kotak: mid-teens FY27 growth'],
      ['EBITDA (₹ cr)', '{{F.ebitda.0|num}}', '{{F.ebitda.1|num}}', '{{F.ebitda.2|num}}', val(emkay, 'ebitda'), 'Kotak: EBITDA CAGR ~16% FY26-29E'],
      ['EBITDA margin', '{{F.ebitdaMargin.0|pct}}', '{{F.ebitdaMargin.1|pct}}', '{{F.ebitdaMargin.2|pct}}', '28.8% / 29.0% / 29.4%', 'Guidance 27-28%'],
      ['EPS (₹)', '{{F.eps.0|n1}}', '{{F.eps.1|n1}}', '{{F.eps.2|n1}}', val(emkay, 'eps'), `JM: ~₹${n1(jm.tp / 48)} Jun-28E (₹${n0(jm.tp)} ÷ 48x); Nomura ₹41.3 Mar-28E (May-26); Kotak adj. EPS CAGR ~15%`],
    ], source: 'Emkay (24-Jul-2026, ex-acquisition); JM Financial, Nomura, Kotak summaries; GAM' } },
    { exhibit: { type: 'table', title: 'How we build profit below EBITDA (₹ crore)', head: ['', 'FY26', ...F.years, 'Basis'], wide: [4], rows: [
      ['Treasury income', n1(OI.bankInterest + OI.fvtplGain + OI.saleGain), ...X.oiTreas.map(n1), `${TY}% on average gross cash (FY26 ${n1(yld26)}%)`],
      ['Rent, keyman policy, miscellaneous', n1(OI.rental + OI.keyman + OI.misc), ...F.years.map(() => n1(MISC)), 'AR FY26 note 27'],
      { hl: true, cells: ['**Other income**', `**${n1(oi26Basis)}**`, ...oiBuild.map(v => `**${v}**`), `Twelve months to Jun-26: ₹${n1(ttmOi)} cr`] },
      ['Interest (leases)', '22.8', ...intBuild.map(n1), '11.5% of average lease liabilities + ₹0.5 cr'],
      ['D&A: engine (6.4% of gross block)', '161.8', ...F.dep.map(n1), 'One rate on gross block incl. new leases'],
      ['D&A: bottom-up schedule', '161.8', ...daBuild.map(n1), 'Suburban brand amortisation ends in FY27'],
      ['EPS effect of the engine shortcut (₹)', '–', ...daEpsEffect.map(v => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}`), 'FY27E slightly high, FY28-29E slightly low'],
      ['Tax + minorities (% of PBT)', '25.6% + ₹5 cr', ...AS.taxRate.map(v => `${v}%`), '25.4% tax + minorities'],
    ], source: 'AR FY26 notes 27, 30, 31, 33; GAM (checked in LALPATHLAB.ctx.js)' } },
    { exhibit: { type: 'table', title: 'SN Genelab and Ghana: outside the base, roughly EPS-neutral', head: ['Item', 'Value', 'Basis'], wide: [2], rows: [
      ['Cash paid (SN Genelab 70% + Ghana 80%)', `~₹${SNG.cash + SNG.ghana} cr (+ earn-out up to ₹${SNG.earnout} cr)`, 'Board approvals 24-Jul and 24-Sep-2026'],
      ['SN Genelab revenue / implied EBITDA (FY26)', `₹${SNG.rev26} cr / ~₹${n1(SNG.ebitda26)} cr (${n1(SNG.margin)}%)`, `~${SNG.evEbitda}x FY26 EV/EBITDA (Emkay)`],
      ['Dr Lal\'s 70% share of SN Genelab profit, Sep-28E', `₹${n1(SNG.patShareSep)} cr`, `Revenue +${SNG.g}% a year, D&A ${SNG.dep}% of revenue, tax 25.4%`],
      ['Treasury income given up (after tax)', `−₹${n1(SNG.lostOi + SNG.lostOiGhana)} cr`, `${TY}% on ₹${SNG.cash + SNG.ghana} cr`],
      { hl: true, cells: ['**Net effect on Sep-28E EPS**', `**${SNG.epsEffectAll >= 0 ? '+' : '−'}₹${Math.abs(SNG.epsEffectAll).toFixed(2)}**`, `vs our ₹${n1(epsSep)}; Ghana's profit not disclosed`] },
    ], source: 'Kotak Neo and Emkay (Sep-2026); GAM' } },
    { callout: `**Where we differ from the street:** our revenue is close to Emkay\'s; our EPS is higher mainly because we keep more of Q1\'s margin in FY27 (we model ~50bp above Emkay), we credit treasury income on a cash pile that keeps growing (₹1,526 cr at Mar-26 to ~₹${n0(X.grossCash[3])} cr gross by Mar-29E on a 45% payout), and the Suburban brand amortisation ends. The risk to our numbers is the opposite of the usual one: management may choose to reinvest the margin, as it says it will.` },
  ],
};

module.exports = { governance, forecasts };
