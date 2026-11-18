// UPL report, part B (2b of 4): the reorganisation / holding-company question, and the moat scorecard.
const X = require('./UPL.common');
const { C, n0, n1, price, mcap, mv, P, F, V } = X;
const R = C.reorg, H = R.postHolding;
const sotpV = mv('sotp').value, gross = P.slice(0, 4).reduce((t, p) => t + p.value, 0);
const minorities = -P.filter(p => /owned by/.test(p.name)).reduce((t, p) => t + p.value, 0);

const reorg = {
  id: 'reorg', nav: 'Reorganisation & holdco', kicker: 'Corporate structure', title: 'The reorganisation: three listed platforms, and a parent the market may discount',
  blocks: [
    { p: 'On 20-Feb-2026 UPL\'s board approved a scheme to create **UPL Global**, a single listed crop-protection company combining UPL Corp (international) and UPL SAS (India). Together with the Advanta IPO, UPL Ltd would end up as the parent of two listed platforms (UPL Global, Advanta) and one unlisted one (SUPERFORM), plus its own Indian formulation, R&D and investment businesses. The stock fell 14.3% on the first trading day after the announcement, its worst day of the year.' },
    { exhibit: { type: 'table', title: 'How the scheme works', head: ['Step', 'What happens', 'Exchange ratio'], wide: [1], rows: [
      ['1', 'UPL SAS (India crop protection) merges into UPL Ltd; its private-equity holders (9.09%) receive UPL Ltd shares', '1,000 UPL shares for every 48 UPL SAS shares'],
      ['2', 'India crop protection is demerged from UPL Ltd into UPL Global; every UPL shareholder receives UPL Global shares directly', '1 UPL Global share for every 1 UPL share'],
      ['3', 'UPL Corp (Cayman) merges into UPL Global; TPG, ADIA and Brookfield swap their 22.2% for UPL Global shares', '1,000 UPL Global shares for every 213 UPL Corp shares'],
    ], source: `UPL reorganisation presentation and Reg-30 disclosure (${R.published}); valuation by ${R.valuers.replace('Joint valuation by ', '')}` } },
    { exhibit: { type: 'table', title: 'Who will own UPL Global', head: ['Holder', 'Stake', 'Note'], wide: [2], rows: [
      ['UPL Ltd', H.uplGlobal.uplLtd + '%', 'UPL Ltd\'s own shareholders therefore keep an indirect stake'],
      ['Shroff family (directly)', H.uplGlobal.promoterDirect + '%', 'Received in the 1:1 demerger'],
      ['Public (directly)', H.uplGlobal.public + '%', 'UPL\'s public shareholders, through the 1:1 demerger'],
      ['TPG, ADIA, Brookfield', H.uplGlobal.privateEquity + '%', 'Converted from UPL Corp; no lock-in reported (Antique)'],
      { hl: true, cells: ['**UPL Ltd promoter stake after the scheme**', `**${H.uplLtdPromoter}%**`, 'from 33.51%: new UPL shares go to UPL SAS\'s investors'] },
    ], source: 'UPL reorganisation presentation (20-Feb-2026), pp. 20-24' } },
    { bullets: [
      `**Status at 30-Sep-2026:** ${R.status}. Advanta's IPO (SEBI approval 3-Jun-2026) is a separate track.`,
      `**UPL Global on its own (proforma):** revenue ₹${n0(R.uplGlobalProforma.ttmDec25Rev)} cr and EBITDA ₹${n0(R.uplGlobalProforma.ttmDec25Ebitda)} cr (15.5%) in the twelve months to Dec-2025; net debt/EBITDA guided at ${R.uplGlobalProforma.netDebtToEbitdaListingYear} in the listing year, so most of the group's debt sits with it. Nuvama put UPL Global's net debt at ~₹19,000 cr and UPL Ltd standalone at ~₹3,200 cr (secondary report; not disclosed by UPL).`,
      '**What management says it achieves:** a "pure-play" listed crop-protection company (#2 worldwide by its own count), valuation of each platform against its own peers, and deleveraging from the Advanta sale, a possible SUPERFORM capital raise and dividends from the platforms.',
      '**What critics say:** it mainly gives the private-equity investors a listed exit (Kotak, Antique); UPL Ltd becomes a holding company, and holding companies usually trade below the value of their stakes (Antique put UPL\'s discount at 25-30% in Feb-2026; DAM Capital at 61% in Aug-2026); and the person named to run UPL Global (Mike Frank) and the group COO left within six months.',
    ] },
    { exhibit: { type: 'table', title: 'The holding-company discount the market is applying today', head: ['', '₹ crore', '₹ / share'], rows: [
      ['Four platforms at our multiples (100%, Sep-28E EV/EBITDA)', n0(gross), n0(gross / F.shares)],
      ['Less: group items, partners\' share of the platforms and net debt', n0(sotpV * F.shares - gross), n0(sotpV - gross / F.shares)],
      { hl: true, cells: ['**Sum of the parts for UPL shareholders (no discount)**', `**${n0(sotpV * F.shares)}**`, `**${n0(sotpV)}**`] },
      ['Market value at the 30-Sep-2026 close', n0(mcap), n0(price)],
      { hl: true, cells: ['**Implied discount to the parts**', '', `**${Math.round((1 - price / sotpV) * 100)}%**`] },
    ], source: 'GAM Research (SOTP detail in the valuation chapter); DAM Capital estimated a 61% holdco discount (Aug-2026)' } },
    { callout: `**How we treat the scheme:** we value UPL on today's structure (UPL owns 77.8% of UPL Corp, 90.9% of UPL SAS, 78.2% of Advanta and 100% of SUPERFORM). The exchange ratios were set by independent valuers, so the scheme should not change the total value a UPL shareholder owns: after it, one UPL share today = one UPL Ltd share plus one UPL Global share. Our target is the value of that bundle. Minority partners take ₹${n0(minorities)} cr of platform value in our sum of the parts (₹${n0(minorities / F.shares)} a share).` },
  ],
};

const moat = {
  id: 'moat', nav: 'Competitive advantage', kicker: 'Moat', title: 'Competitive advantage: scale, registrations and seeds, but no pricing power in generics',
  blocks: [
    { verdicts: [
      ['Registrations and market access', 'Advantage', '>16,000 product registrations; ~2,700 approvals in FY26; sales in >140 countries; 57 crop-protection R&D centres.', 'Takes years and money to copy; protects distribution, not price.'],
      ['Scale and backward integration', 'Advantage', '43 crop-protection plants; SUPERFORM makes key active ingredients in India; "India-sourced" supply.', 'Lower cost and supply security vs smaller generic players.'],
      ['Cost position vs Chinese producers', 'Disadvantage', 'Chinese oversupply crashed prices in FY24; UPL Corp prices −3% in FY26 even as volumes rose 7%.', 'China sets the floor price for off-patent molecules.'],
      ['Innovation / differentiated products', 'Parity', 'Innovation rate ~16% (target >20% by FY30); biologicals and new formulations; peak pipeline ~$4.4 bn risk-adjusted.', 'Improving mix, but most sales are still generic.'],
      ['Seeds germplasm (Advanta)', 'Advantage', '900+ hybrids across 40 crops; leader in grain sorghum; 25% EBITDA margin; volume +12% in FY26.', 'The highest-quality franchise in the group.'],
      ['Brands in India (UPL SAS)', 'Parity', 'Big brands growing, but revenue flat for two years; margin swings with the monsoon.', 'Competitive market with many strong local players.'],
      ['Balance sheet', 'Disadvantage', 'Net debt $2.5 bn at Jun-26 (2.4x EBITDA); ₹6,800-10,200 cr of receivables factored; BB / Ba2 international ratings.', 'Limits pricing flexibility in a downturn (FY24) and absorbs cash.'],
      ['Working capital and credit', 'Disadvantage', 'NWC 110 days at Jun-26; ₹750 cr of credit-loss charges in FY26 (Latin America).', 'Selling on credit to distributors is how UPL wins volume; it is also its biggest risk.'],
    ], head: ['Dimension', 'Verdict', 'Evidence', 'So what'], title: 'Moat scorecard', source: 'UPL presentations (FY26, Q1FY27, reorganisation), annual report FY26, GAM Research' },
    { callout: '**Honest verdict:** UPL\'s advantage is **reach**: registrations in dozens of countries, a global distribution network and its own Indian factories. That lets it sell more volume than most generic rivals, and the seeds business (Advanta) has a genuine moat. But in its core off-patent chemistry UPL has **no pricing power**: when Chinese supply floods the market, its prices and margins fall with everyone else\'s, as FY24 showed (ROE −4.6%). Group ROCE has not exceeded 14% since the Arysta deal. This is a cyclical, scale business, not a compounder.' },
  ],
};

module.exports = { sections: () => [reorg, moat] };
