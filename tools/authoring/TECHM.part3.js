// Tech Mahindra report, part 3: the operating chapters - the dollar revenue build (verticals, geographies),
// deals/clients/people, margins (Project Fortius and what is left), other income and FX hedges.
const X = require('./TECHM.ctx');
const { C, F, A, AS, UB, vert, usdCheck, ebitM, n0, n1, pc, pc1, SQ, QL, SA, Q1, FY26, streetEbit } = X;
const A26 = SA.find(a => a.fy === 'FY26');
const VN = { comms: 'Communications', mfg: 'Manufacturing', bfsi: 'BFSI', tme: 'Technology, media & ent.', rlt: 'Retail, logistics & transport', hls: 'Healthcare & life sciences', others: 'Others' };
const OI = C.otherIncomeNote, SRCQ = 'Company presentations and calls; GAM Research estimates';

const growth = {
  id: 'growth', nav: 'Revenue build (USD)', kicker: 'Segment: revenue', title: 'Our dollar build: 6% growth in FY27, then 5% a year; manufacturing and BFSI lead, communications lags',
  blocks: [
    { p: `IT services revenue is earned in dollars, euros and pounds, so we forecast in dollars and convert. We grow each vertical from its FY26 base (USD ${n0(UB.base.usdRev)} mn) at the rates below, which gives USD ${n0(UB.usdRev[0])} mn in FY27E (${pc1(UB.usdGrowthPct[0])}), ${n0(UB.usdRev[1])} mn in FY28E and ${n0(UB.usdRev[2])} mn in FY29E. At ${UB.inrUsdAvg.join(' / ')} rupees per dollar (FY26: 89.0; Q1FY27: 94.6; 30-Sep close: ~95.8) that is ₹{{F.sales.0|num}} cr, ₹{{F.sales.1|num}} cr and ₹{{F.sales.2|num}} cr. FY27's rupee growth of {{F.salesGrowth.0|pct}} is mostly currency: 6.1% in dollars and ~7.3% from the weaker rupee.` },
    { exhibit: { type: 'table', title: 'Revenue build by vertical (USD mn)', head: ['Vertical', 'FY26', 'FY27E', 'FY28E', 'FY29E', 'Growth FY27E / 28E / 29E', 'Why'], wide: [6], rows: [
      ...Object.keys(VN).map(k => [VN[k], n0(vert[0][k]), n0(vert[1][k]), n0(vert[2][k]), n0(vert[3][k]), UB.verticalGrowthPct[k].map(g => pc1(g)).join(' / '), {
        comms: 'Large-deal ramps vs a volatile US telecom client and AI pressure on run work',
        mfg: 'Aerospace and auto; FY27 helped by the early European auto delivery',
        bfsi: 'Payments, wealth, insurance; Avant from Jun-2026',
        tme: 'Volatile client spend; cloud pass-through lost',
        rlt: 'Logistics modernisation; +8.6% in Q1',
        hls: 'Provider and life-sciences wins; +7.2% in Q1',
        others: 'Shrinking',
      }[k]]),
      { hl: true, cells: ['**Total (USD mn)**', `**${n0(UB.base.usdRev)}**`, ...UB.usdRev.map(v => `**${n0(v)}**`), `**${UB.usdGrowthPct.map(g => pc1(g)).join(' / ')}**`, 'Street FY27E: USD 6,745-6,792 mn'] },
      ['INR/USD (average)', '89.0', ...UB.inrUsdAvg.map(v => n1(v)), '', 'BMI 97 by Mar-27, 99 by Mar-28'],
      { hl: true, cells: ['**Revenue (₹ cr) = USD x rate**', `**${n0(FY26.inrRevenue)}**`, ...usdCheck.map(u => `**${n0(u.inr)}**`), '', 'Ties to the model (check in our files)'] },
    ], source: SRCQ } },
    { pair: [
      { type: 'stacked', title: 'Mix shifts slowly: communications falls from 33% to ~31%', unit: 'Revenue by vertical (USD mn)', x: ['FY26', 'FY27E', 'FY28E', 'FY29E'], series: [['comms', 'Communications'], ['mfg', 'Manufacturing'], ['bfsi', 'BFSI']].map(([k, nm]) => ({ name: nm, values: vert.map(v => Math.round(v[k])), fmt: 'num' })).concat([{ name: 'Other verticals', values: vert.map(v => Math.round(v.tme + v.rlt + v.hls + v.others)), fmt: 'num' }]), minLabel: 400, source: SRCQ },
      { type: 'column', title: 'Europe is the fastest-growing region (+12% YoY in Q1)', unit: 'Revenue share by geography (%)', x: QL.filter((_, i) => SQ[i].amPct), series: [{ name: 'Americas', values: SQ.filter(q => q.amPct).map(q => q.amPct), fmt: 'pct' }, { name: 'Europe', values: SQ.filter(q => q.amPct).map(q => q.euPct), fmt: 'pct' }, { name: 'Rest of world', values: SQ.filter(q => q.amPct).map(q => q.rowPct), fmt: 'pct' }], labels: 'none', source: 'Company presentations' },
    ] },
    { callout: '**Why not faster after FY27?** Peers guide 1-4% for FY27 and the brokers that model FY28 expect 5-7.5% for Tech Mahindra. We sit at the low end (5%): by FY28 the large-deal ramps are in the base, and the same AI productivity pass-backs that HCLTech and Cognizant describe will reach Tech Mahindra\'s run contracts. Each 1 point of extra dollar growth adds ~1% to FY28E EPS.' },
  ],
};

const rpe = (usd, hc) => usd / hc * 1e3; // USD '000 per head
const people = {
  id: 'people', nav: 'Deals, clients & people', kicker: 'Segment: operations', title: 'Fewer people, more revenue: IT headcount −7% while revenue grew 6%',
  blocks: [
    { p: `Tech Mahindra won USD ${n0(Q1.tcvUsd)} mn of new deals in Q1FY27, its third straight USD 1 bn+ quarter (USD 4,063 mn over twelve months, +37.5%). Clients paying over USD 50 mn rose from 26 to 33 in a year. At the same time IT headcount fell to ${n0(C.profile.headcount.it)} (−7% YoY): management says AI tools lifted productivity on its large fixed-price portfolio, so leavers were not replaced. IT revenue per IT employee rose from ~USD 69,000 in FY26 to ~USD 75,000 (Q1FY27 annualised). Utilisation is a high 87.0%, attrition 11.8%. Wage hikes start in Q2FY27, phased. Two levers are nearly used up: utilisation (little room above 87%) and the onsite mix (22.5%, which large rebadging deals and SAP/ServiceNow work will keep up this year).` },
    { pair: [
      { type: 'column', title: 'Third straight USD 1 bn+ quarter of deal wins', unit: 'New deal wins (TCV, USD mn)', x: QL, series: [{ name: 'TCV', values: SQ.map(q => q.tcv), fmt: 'num' }], labels: 'all', source: 'Company presentations (Q3FY25 derived from LTM figures)' },
      { type: 'line', title: 'IT headcount down ~5,900 since Mar-2025', unit: 'Headcount (nos)', x: QL, series: [{ name: 'IT', values: SQ.map(q => q.hcIt), fmt: 'num' }, { name: 'BPS', values: SQ.map(q => q.hcBps), fmt: 'num' }], labels: 'last', source: 'Company presentations' },
    ] },
    { exhibit: { type: 'table', title: 'Operating KPIs', head: ['', 'Q1FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'], rows: [
      ['Revenue (USD mn)', ...['Q1FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'].map(q => n0(SQ.find(x => x.q === q).usdRev))],
      ['EBIT margin', ...['Q1FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'].map(q => n1(SQ.find(x => x.q === q).ebitPct) + '%')],
      ['Total headcount', ...['Q1FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'].map(q => n0(SQ.find(x => x.q === q).hcTotal))],
      ['Revenue per employee, annualised (USD \'000)', ...['Q1FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'].map(q => { const x = SQ.find(y => y.q === q); return n1(rpe(x.usdRev * 4, x.hcTotal)); })],
      ['IT utilisation / attrition (LTM)', ...['Q1FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'].map(q => { const x = SQ.find(y => y.q === q); return `${n1(x.utilPct)}% / ${n1(x.attrPct)}%`; })],
      ['IT onsite mix', ...['Q1FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'].map(q => n1(SQ.find(x => x.q === q).onsitePct) + '%')],
      ['Clients > USD 50 mn / top-10 share', '24 / 25.1%', '26 / 25.2%', '29 / 24.3%', '33 / 24.0%'],
      ['DSO (days) / FCF (USD mn)', ...['Q1FY25', 'Q1FY26', 'Q4FY26', 'Q1FY27'].map(q => { const x = SQ.find(y => y.q === q); return `${x.dso} / ${x.fcfUsd}`; })],
    ], source: 'Company presentations' } },
    { callout: '**So what:** revenue growth with falling headcount is the AI story in miniature. It flatters margins today (fewer people per dollar) but it is also the mechanism of deflation: when clients renew, they ask for the same savings. Tech Mahindra says it refuses deals that bake in 70-80% productivity over five years; its peers say deal sizes are shrinking ~20%. We assume headcount starts rising again in H2FY27 as management expects.' },
  ],
};

const margins = {
  id: 'margins', nav: 'Margins: what is left', kicker: 'Segment: margins', title: 'Margins: 6.1% to 14.4% in two years; the last 60-100 bp to 15% is the hardest',
  blocks: [
    { p: `Project Fortius took the company EBIT margin from 6.1% (FY24) to 12.6% (FY26) and 14.4% in Q1FY27. The Analyst Day bridge (Apr-2026) lists the levers: offshoring, fixed-price productivity, rotating staff to cheaper grades (N-1), cutting subcontractors, G&A savings, pricing, and FX tailwinds, against wage hikes and investments. Compensation fell to 64.4% of revenue in FY26 (−250 bp). In Q1FY27 the gain came from SG&A (portfolio-company back offices merged) while gross margin was hit by visa costs, Comviva seasonality and the low-margin auto acceleration. Q2 brings wage hikes and the auto reversal; management says Q4FY27 "has to be upwards of 15%" and that it will "hit" 15% for the year, but has set no path beyond FY27.` },
    { pair: [
      { type: 'column', title: 'EBIT margin by quarter vs the 15% goal', unit: 'EBIT margin, company definition (%)', x: QL, series: [{ name: 'EBIT margin', values: SQ.map(q => q.ebitPct), fmt: 'pct' }], labels: 'all', lines: [{ v: 15, text: '15%' }], min: 0, source: 'Company presentations' },
      { type: 'line', title: `Our EBIT margin: ${n1(ebitM[0])}% / ${n1(ebitM[1])}% / ${n1(ebitM[2])}%`, unit: 'EBIT margin (%), Screener basis; FY27-29E GAM', x: 'fin.labels', from: 'FY19', to: 'FY29E', series: [{ name: 'EBIT margin', ref: 'fin.ebitMargin', fmt: 'pct' }], labels: 'all', min: 0, max: 20, source: 'Screener.in; GAM estimates' },
    ] },
    { exhibit: { type: 'table', title: 'Margin levers: used and remaining', head: ['Lever', 'Used so far', 'Left?'], wide: [1, 2], rows: [
      ['Subcontractors', 'Subcontracting 11.0% of revenue in FY25, 10.7% in FY26', 'Rose to 11.4% in Q1FY27 (auto programme); some room'],
      ['Offshoring / pyramid', 'Onsite 24.6% (Q1FY25) to 21.4% (Q1FY26)', 'Back to 22.5%; limited this year (rebadged large deals)'],
      ['Utilisation', '85.0% (Q1FY26) to 87.0%', 'Little; 87% is near the ceiling'],
      ['Fixed-price productivity (AI tools)', 'IT headcount −7% YoY', 'Yes, but clients will ask for a share at renewal'],
      ['SG&A / portfolio companies', 'SG&A 13.9% of revenue in FY26, 13.0% in Q1FY27', 'Some (integration ~95% done)'],
      ['Rupee', 'Average 85.3 (Q1FY26) to 94.6 (Q1FY27)', 'We assume ~1.5% a year: a small tailwind; hedge losses offset part below EBIT'],
      ['Wage hikes', '—', 'A headwind from Q2FY27'],
    ], source: 'Company presentations, results and calls; Screener.in' } },
    { callout: `**Our forecast:** EBIT margin {{as.ebitMarginTargetPct.0|n1}}% in FY27E (just below the 15% target, because Q2 carries wages), {{as.ebitMarginTargetPct.1|n1}}% in FY28E and {{as.ebitMarginTargetPct.2|n1}}% in FY29E; the street has ${streetEbit('FY27E')?.join('-')}% for FY27E and ${streetEbit('FY28E')?.join('-')}% for FY28E. Each 1 pp of margin is ~₹{{F.sales.1|num}} cr x 1% ≈ ${pc(F.sales[1] * 0.01 * (1 - AS.taxRate[1] / 100) / F.pat[1] * 100)} of FY28E EPS. Tech Mahindra has not reported an EBIT margin above 15% since FY15 (15.8%); we do not assume a big step beyond it now.` },
  ],
};

module.exports = { growth, people, margins };
