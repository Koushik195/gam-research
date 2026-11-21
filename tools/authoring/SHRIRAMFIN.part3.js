// Shriram Finance report, part 3: franchise and AUM mix, spread and NIM, asset quality and credit cost.
const X = require('./SHRIRAMFIN.ctx');
const { C, SG, F, A, AS, fin, fi, n0, n1, n2, pc, Q1, G27, LT } = X;
const QN = SG.quarterly.find(q => q.q === 'Q1FY27'), QO = SG.quarterly.find(q => q.q === 'Q1FY26');
const A26 = SG.annual.find(a => a.fy === 'FY26'), A25 = SG.annual.find(a => a.fy === 'FY25');
const NAMES = Object.fromEntries(SG.lines.map(l => [l.key, l.name.replace(/ \(.*\)$/, '')]));
const add26 = SG.lines.map(l => [NAMES[l.key], A26[l.key] - A25[l.key]]).sort((a, c) => c[1] - a[1]);
const st = SG.stages, tot = s => s.s1 + s.s2 + s.s3, s23 = s => (s.s2 + s.s3) / tot(s) * 100, ecl = s => (s.ecl1 + s.ecl2 + s.ecl3) / tot(s) * 100;
const cc10 = F.avgAum[1] * 0.001 * (1 - AS.taxRate[1] / 100) / F.patAttrib[1] * 100;
const QK = C.quarterlyKpis.filter(q => q.gnpa != null);

const franchise = {
  id: 'franchise', nav: 'Franchise & AUM mix', kicker: 'Franchise and growth', title: 'Growth: trucks still carry the book; new vehicles, gold and MSME are the add-ons',
  blocks: [
    { p: `AUM grew ${n1(fin.aumGrowth[fi('FY26')])}% in FY26 to ₹${n0(A26.total)} cr, in line with the ~15% management said at the start of the year, and 15.3% to ₹${n0(QN.total)} cr by Jun-2026. Commercial vehicles supplied over half of FY26's increase. Disbursements were ₹${n0(C.fy26.disbursements)} cr in FY26 and ₹${n0(Q1.disbursements)} cr in Q1FY27 (+19.5%). The company now has four extra levers: **new vehicles** (16-17% of disbursements from ~10%, targeted at 20-25%, so that new vehicles become 30%+ of the book), **gold loans** (${n1(QN.gold / QN.total * 100)}% of AUM, to ~5% in three years from ~2,200 gold-ready branches), **MSME** (${n1(QN.msme / QN.total * 100)}% of AUM, to ~20% by expanding beyond the South) and **personal loans** to customers other than two-wheeler borrowers. About 150 branches are to be added in FY27.` },
    { pair: [
      { type: 'hbar', title: `Where FY26's ₹${n0(A26.total - A25.total)} cr of AUM growth came from`, unit: 'Increase in AUM, Mar-25 to Mar-26 (₹ crore)', x: add26.map(r => r[0]), series: [{ name: 'Added', values: add26.map(r => r[1]), fmt: 'num' }], labels: 'all', source: 'Q4FY26 investor update p9' },
      { type: 'hbar', title: 'Growth by product, Jun-25 to Jun-26', unit: 'AUM growth year on year (%)', x: SG.lines.map(l => NAMES[l.key]), series: [{ name: 'Growth', values: SG.lines.map(l => Math.round((QN[l.key] / QO[l.key] - 1) * 1000) / 10), fmt: 'pct0' }], labels: 'all', source: 'Q1FY27 investor update p7' },
    ] },
    { exhibit: { type: 'table', title: 'Our AUM build vs guidance', head: ['', 'FY25', 'FY26', 'FY27E', 'FY28E', 'FY29E'], rows: [
      ['AUM (₹ cr)', '{{fin.aum.10|num}}', '{{fin.aum.11|num}}', '{{F.aum.0|num}}', '{{F.aum.1|num}}', '{{F.aum.2|num}}'],
      ['Growth', '{{fin.aumGrowth.10|pct}}', '{{fin.aumGrowth.11|pct}}', '{{F.aumGrowth.0|pct}}', '{{F.aumGrowth.1|pct}}', '{{F.aumGrowth.2|pct}}'],
      ['Company guidance', 'n.d.', '~15% (delivered 14.85%)', '~18% (budget; Q2 15-16%)', 'long-term ~18-20%', 'long-term ~18-20%'],
      ['Street', '', '', 'PL 17%, Emkay 17%, MOSL ~17%', 'PL 18%, Emkay 18%', 'Emkay 18%'],
    ], source: 'Company calls and FY26 annual report; broker notes (Jul-Sep 2026); GAM estimates. FY25 guidance not in our sources (n.d.).' } },
    { callout: '**Our view:** we take 17% for FY27, a notch under guidance, because Q1 grew 15.3%, management itself expects 15-16% in Q2 and the monsoon is weak; then 18% as the capital is put to work. The quality of the growth matters more than the rate: the fastest-growing books are new vehicles (lower yield), gold (low loss but small) and MSME (higher yield, higher loss). We do not assume the 20%+ that the new capital would allow, because Shriram has rarely grown above 20% outside the merger year.' },
  ],
};

const spread = {
  id: 'spread', nav: 'Spread & NIM', kicker: 'Margins', title: 'NIM jumps in FY27 because equity replaced debt; management itself expects it to drift back',
  blocks: [
    { p: `On our basis (NII ÷ average AUM) the margin was {{fin.nim.10|pct}} in FY25 and {{fin.nim.11|pct}} in FY26; the company's own NIM (on average total assets) was 8.55% and 8.38%. The yield on AUM has held at ~16.5% while the cost of borrowing rose with the FY24-FY25 rate cycle (company cost of liabilities 8.69% in Dec-25, 8.59% in Mar-26). Q1FY27 changed the picture: company NIM jumped to 9.04%, because ₹37,451 cr of MUFG money repaid borrowings in April. Management said ~₹500 cr of Q1's NII came from the new capital, and expects the current NIM to hold for two quarters before easing to ~8.5% over two to three years as new-vehicle loans (lower yield) grow and cheaper funding is passed on.` },
    { exhibit: { type: 'table', title: 'Spread and margin: history and our forecast (% of average AUM unless stated)', x: 'fin.labels', from: 'FY24', to: 'FY29E', rowsRef: [
      { name: 'Yield on average AUM (%)', ref: 'fin.yieldOnAum', fmt: 'pct' }, { name: 'Cost of funds on average borrowings (%)', ref: 'fin.costOfFunds', fmt: 'pct' },
      { name: 'Spread (pp)', ref: 'fin.spread', fmt: 'n2' }, { name: 'NIM: NII ÷ average AUM (%)', ref: 'fin.nim', fmt: 'pct', hl: true },
      { name: 'Fees & other income ÷ average AUM (%)', ref: 'fin.feePct', fmt: 'pct' }, { name: 'Net total income ÷ average AUM (%)', ref: 'fin.ntiPct', fmt: 'pct' },
    ], source: 'Company, Screener.in; GAM estimates. FY24 income includes Shriram Housing Finance (FY24 turnover ₹1,430 cr, ~0.7% of average AUM), so FY24 yield and NIM read high. FY27E cost of funds is entered at 8.5% to offset the engine\'s opening/closing average of borrowings (the April equity cut borrowings for the whole year); the underlying rate is ~8.85% on our basis.' } },
    { p: `**The MUFG arithmetic.** ₹39,618 cr of equity that replaces debt costing ~8.85% (our basis) saves ~₹3,500 cr of interest a year, ~₹2,600 cr after tax, about 1pp of NIM on FY27E AUM. That is the whole of the FY27E margin jump in our model (from {{fin.nim.11|pct}} to {{F.nim.0|pct}}). It does not fade in rupees, but it shrinks as a share of a growing book: by FY29E, with AUM 63% larger and borrowings back up, our NIM is {{F.nim.2|pct}}. Analysts on the Q1 call argued the 8.5% guidance is too conservative; we agree in part (our FY29E NIM is ~${n1(F.nii[2] / ((F.totalAssets[1] + F.totalAssets[2]) / 2) * 100)}% on the company's total-assets basis), but we also take yields down 15-25bp a year because management told us it is using cheaper funding to win new-vehicle customers.` },
    { pair: [
      { type: 'column', title: 'NII growth runs ahead of AUM growth in FY27E only', unit: 'Growth (%)', x: 'fin.labels', from: 'FY25', to: 'FY29E', series: [{ name: 'AUM growth', ref: 'fin.aumGrowth', fmt: 'pct0' }, { name: 'NII growth', ref: 'fin.niiGrowth', fmt: 'pct0' }], labels: 'all', source: 'Company, Screener.in; GAM estimates' },
      { type: 'column', title: 'Company NIM: 8.1-8.6% for a year, then 9.04%', unit: 'Reported NIM (% of average total assets), quarterly', x: QK.map(q => q.q), series: [{ name: 'NIM', values: QK.map(q => q.nim), fmt: 'n2' }], labels: 'all', min: 7, max: 9.5, highlight: 'Q1FY27', source: 'Q4FY26 investor update p26; Q1FY27 investor update p24' },
    ] },
    { callout: '**Our view:** FY27E NIM of {{F.nim.0|pct}} (our basis) is roughly Q1\'s run-rate held for the year, in line with "the current NIM will hold good" for two quarters. We then let it ease to {{F.nim.2|pct}} by FY29E. The bear case takes yields 30bp lower and funding 30bp dearer.' },
  ],
};

const quality = {
  id: 'quality', nav: 'Asset quality & credit cost', kicker: 'Asset quality', title: 'Asset quality: bad loans fell from 7% to 4.6% after the merger, and have stopped falling',
  blocks: [
    { p: `Gross Stage 3 (non-performing) loans fell from 7.1% in FY22 to 6.2% (FY23), 5.5% (FY24) and 4.55% (FY25), helped by the merger with a cleaner book, write-offs and better collections. Since then the ratio has gone sideways: 4.58% in Mar-26 and ${Q1.gnpa}% in Jun-26 (4.53% a year earlier). Net Stage 3 kept improving, to ${Q1.nnpa}%, only because provision coverage rose from 43% to ${n0(Q1.pcr)}%. Within the book, commercial and passenger vehicles improved year on year while MSME (4.1% to 5.2%), construction equipment (5.9% to 7.1%), gold (2.1% to 2.6%), personal loans and two-wheelers worsened. Management calls the Q1 rise seasonal and says it sees no stress from fuel prices or vehicle idling.` },
    { pair: [
      { type: 'line', title: 'Gross Stage 3 stuck near 4.6%; net Stage 3 down to 2.3%', unit: 'Gross / net Stage 3 (% of loans), quarter-end', x: QK.map(q => q.q), series: [{ name: 'Gross Stage 3', values: QK.map(q => q.gnpa), fmt: 'n2' }, { name: 'Net Stage 3', values: QK.map(q => q.nnpa), fmt: 'n2' }], labels: 'ends', min: 0, max: 5.5, source: 'Q4FY26 investor update p10; Q1FY27 investor update p8' },
      { type: 'column', title: 'Stage 2 + 3 loans: ~11.6% of the book, flat for a year', unit: 'Stage 2 + Stage 3 gross loans (% of gross loans)', x: ['Mar-25', 'Jun-25', 'Mar-26', 'Jun-26'], series: [{ name: 'Stage 2+3', values: [st.mar25, st.jun25, st.mar26, st.jun26].map(s => Math.round(s23(s) * 100) / 100), fmt: 'n2' }], labels: 'all', min: 0, max: 14, source: 'Q4FY26 investor update p10; Q1FY27 investor update p8' },
    ] },
    { exhibit: { type: 'table', title: 'Gross Stage 3 by product: the newer books are slipping', head: SG.assetQuality.head, rows: SG.assetQuality.rows.map(r => [r[0], `${r[1].toFixed(2)}%`, `${r[2].toFixed(2)}%`, `${r[3].toFixed(2)}%`, `${r[4].toFixed(2)}%`, `${r[5].toFixed(1)}%`]), source: 'Q1FY27 investor update p9-17' } },
    { p: `**A thick provision cushion.** Expected-credit-loss provisions were ₹${n0(st.jun26.ecl1 + st.jun26.ecl2 + st.jun26.ecl3)} cr in Jun-2026, ${n2(ecl(st.jun26))}% of gross loans (${n2(ecl(st.mar25))}% in Mar-25). Even performing (Stage 1) loans carry a 3.45% provision, against ~1.1% at Bajaj Finance, which reflects the higher expected losses of informal, vehicle-backed lending. The cushion means a bad monsoon need not produce a spike in reported credit cost; it does not change the fact that Stage 3 runs at 4.5-5% in a business that lends against old vehicles to informal borrowers.` },
    { callout: `**Our forecast:** credit cost of {{F.creditCost.0|n2}}% / {{F.creditCost.1|n2}}% / {{F.creditCost.2|n2}}% of average AUM for FY27-29E against 1.89% in FY26 and 1.90% annualised in Q1FY27. Management guides "around 2%" on its own yardstick (credit cost to total assets: 1.65% FY26, 1.66% Q1), so it has run well inside guidance. Each 10bp of credit cost is ~${n1(cc10)}% of FY28E profit. Bear case: ~2.6% (FY25's 2.18% plus a rural shock).` },
  ],
};

module.exports = { franchise, spread, quality };
