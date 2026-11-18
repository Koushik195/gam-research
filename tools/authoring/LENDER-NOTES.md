# Lender model (`"type": "lender"`): notes for the analyst

For NBFCs (and, later, banks). Engine: `src/forecast-lender.js`; workbook: `src/excel-lender.js` and
`src/excel-lender-sheets.js`. Everything else (as-of freeze, rating rule, publish, history) works as for
other companies. `data/raw/BAJFINANCE/research/assumptions.json` is an ENGINE TEST FIXTURE: replace
every number and every `_why` with sourced values.

## How the forecast works

    AUM_t = AUM_t-1 × (1 + aumGrowth);  average AUM = (opening + closing) ÷ 2
    interest income = yieldOnAum × avg AUM;  fees & other operating income = feeIncomePct × avg AUM
    interest expense = costOfFunds × average borrowings
    borrowings = total assets − net worth − other liabilities   (balancing item)
    total assets = AUM × (loans & other % + liquidity % + fixed assets %);  other liabilities = AUM × %
    opex (incl. depreciation) = opexPct × avg AUM;  provisions = creditCost × avg AUM
    PBT = NII + fees − opex − provisions + otherIncome;  PAT = PBT × (1 − tax)
    minority = minorityPct × PAT;  EPS = attributable PAT ÷ shares;  DPS = EPS × payout
    net worth += attributable PAT − dividends + capitalRaise

Interest and retained profit depend on each other; the engine solves this in closed form (no circular
reference), and the Excel "Funding" block shows the same algebra.

**Screener mapping (NBFC layout).** Revenue = interest income + fees & other operating income;
Interest = finance cost; Expenses = opex excl. depreciation + impairment; Financing Profit = Revenue −
Interest − Expenses; Other Income = non-operating items incl. exceptional; PBT = PPOP − provisions + other
income (the Model shows a tie-out check row). Net Profit is consolidated (before minority interest);
EPS uses Screener's "Profit for EPS". For lenders the engine sets `A.shares` / `A.bvps` (and so `fin.bvps`
and the forward P/B history) from attributable profit ÷ EPS, which is right when there are minorities.

## assumptions.json schema (₹ crore; percentages as numbers, 15 = 15%)

| Key | Meaning | Default |
|---|---|---|
| `type` | `"lender"` | required |
| `asOf`, `years` | as for other companies (`["FY27E","FY28E","FY29E"]`) | required |
| `history.aum` | closing AUM by FY, e.g. `{"FY24": …, "FY26": …}` | **FY26 required** |
| `history.provisions` | impairment on financial instruments (inside Screener Expenses) | **FY26 required** |
| `history.feeIncome` | fees, commission & other operating income (inside Screener Revenue) | none → all revenue = interest |
| `aumGrowth` | AUM growth % | required |
| `yieldOnAum` | interest income ÷ average AUM % | required |
| `feeIncomePct` | fees & other operating income ÷ average AUM % | 0 |
| `costOfFunds` | interest expense ÷ average borrowings % | required |
| `opexPct` | operating expenses incl. depreciation ÷ average AUM % (cost-to-income is an output) | required |
| `creditCost` | provisions ÷ average AUM % | required |
| `taxRate`, `payout` | tax % of PBT; payout % of attributable EPS | required / 0 |
| `minorityPct` | minority interest % of PAT | FY26 actual |
| `otherIncome` | non-operating income, ₹ cr per year | 0 |
| `capitalRaise`, `newShares` | equity raised (₹ cr) and new shares (crore) per year | 0 |
| `bs.loansPctOfAum`, `bs.liquidityPctOfAum`, `bs.fixedPctOfAum`, `bs.otherLiabPctOfAum` | balance sheet as % of closing AUM | FY26 actual |
| `depShareOfOpex` | depreciation % of opex (splits opex back into Screener lines) | FY26 actual |
| `base.shares` | share count override (crore) | Profit for EPS ÷ EPS |

`history.*` may instead come from `company.json` → `annualKpis` (`aum`, `provisions`, `feeIncome`);
`assumptions.history` wins. Each driver can be a number or a per-year array. Put the reasoning in
`_<key>Why` (e.g. `_creditCostWhy`); the Excel Assumptions sheet shows it.

**Scenarios** (`scenarios.bull` / `.bear`): `aumGrowthDelta`, `yieldDelta`, `feeDelta`, `cofDelta`,
`opexDelta`, `creditCostDelta`, `payoutDelta` (added to every year), `sustainableRoe` (long-run ROE),
`label`, `narrative`. Multiples come from each method's `multiple.bull` / `.bear`.

## Valuation

`valuation`: `rf`, `beta`, `erp` (or `ke` directly); `g` = long-run growth in the justified P/B;
`sustainableRoe`; residual income: `terminalGrowth`, `years` (15), `fadeYears` (8), `payoutTo` (30),
`rollForwardMonths` (6), optional `bookUpliftPerShare`. `blend.methods` (one `role: "primary"`, the rest
cross-checks, no weights; `round` default 10):

- `pe`: EPS × multiple; `pb`: book value per share × multiple. Use `roll: ["FY28E","FY29E",0.5]` for Sep-28E.
- `jpb`: justified P/B = (sustainableRoe − g) ÷ (Ke − g) × book. Default book = the 12-month target
  date (`roll ["FY27E","FY28E",0.5]`). It is a trailing-book multiple: do not apply it to Sep-28E book.
- `ri`: residual income (same code as the insurer model), rolled forward to 12 months.

```json
"valuation": { "rf": 6.5, "beta": 1.1, "erp": 6, "g": 10, "sustainableRoe": 19, "terminalGrowth": 6,
  "years": 15, "fadeYears": 8, "payoutTo": 30, "rollForwardMonths": 6, "_why": "…",
  "blend": { "round": 10, "methods": [
    { "key": "pb", "name": "P/B", "method": "pb", "role": "primary", "year": "Sep-28E", "roll": ["FY28E","FY29E",0.5], "multiple": { "base": 4.5, "bull": 5.5, "bear": 3.5 }, "why": "…" },
    { "key": "pe", "name": "P/E", "method": "pe", "role": "cross-check", "year": "Sep-28E", "roll": ["FY28E","FY29E",0.5], "multiple": { "base": 25, "bull": 30, "bear": 20 }, "why": "…" },
    { "key": "jpb", "name": "Justified P/B", "method": "jpb", "role": "cross-check", "year": "Sep-27E", "roll": ["FY27E","FY28E",0.5], "why": "…" },
    { "key": "ri", "name": "Residual income", "method": "ri", "role": "cross-check", "why": "…" } ] } }
```

Derive the multiple as PLAYBOOK §4 says. For P/B: `forwardMedianPb(sym, M)` in `valuation-blend.js`
(median one-year-forward P/B since Apr-2021; book does not collapse, so no trough years);
`forwardSeries(sym, M, 'bvps')` for the chart; `streetBlocks(..., { history: { field: 'bvps', … } })`
works, and set `noOurEps: true` when the street values the stock on P/B.

## Tokens available

- `F.*` (forecast years, index 0–2): `aum`, `avgAum`, `interestIncome`, `feeIncome`, `sales` (total income),
  `interest`, `nii`, `nti`, `opex`, `dep`, `ppop`, `provisions`, `otherIncome`, `pbt`, `tax`, `pat`,
  `minority`, `patAttrib`, `eps`, `dps`, `netWorth`, `bvps`, `borrowings`, `totalAssets`, `loans`,
  `liquidity`; ratios `yieldOnAum`, `costOfFunds`, `spread`, `nim`, `feePct`, `ntiPct`, `opexPct`,
  `costToIncome`, `creditCost`, `ppopPct`, `roa`, `roaAum`, `roe`, `leverage` (AUM ÷ net worth),
  `assetsToEquity`, `equityToAum`, `debtEquity`; growth `aumGrowth`, `salesGrowth`, `niiGrowth`,
  `ppopGrowth`, `patGrowth`, `epsGrowth`, `bvpsGrowth`; `pe`, `pb`, `divYield` at CMP; `ebitda` =
  financing profit, `ebitdaMargin` = financing margin. `F.shares` = base share count.
- `fin.*` (FY15 … FY29E, history + forecast, for charts, statements and cover `keyRows`): all of the
  above lender lines, plus the usual `sales`, `pat`, `eps`, `dps`, `bvps`, `roe`, `pbt`, `netWorth`.
  History ratios need `history.aum` (and provisions / fees) for those years; otherwise they are blank.
- `dcf.*`: `tp`, `upside`, `method`, `ke`, `g`, `sustainableRoe`, `justifiedPb`, `book` (book used by
  the justified P/B), `riValue` (12-month RI value), `perShare`, `pvRi`, `pvTv`, `impliedRoe` (long-run
  ROE the price implies, RI), `impliedRoeJpb` (same via Gordon P/B), `currentPb` (CMP ÷ FY26 book),
  `currentBvps`, `forwardPb`, `impliedPe` / `impliedPeLabel`, `impliedPb` / `impliedPbLabel`,
  `blend.methods.<i>.value|metric|mult|vsTarget`, `sens` (justified P/B value: Ke × ROE grid),
  `sensPrimary` (primary multiple × bear/base/bull metric).
- `scen.bull|bear.*`: `tp`, `upside`, `eps`, `bvps`, `roe`, `roa`, `nim`, `creditCost`, `aum`, `pe`,
  `pb`, `justifiedPb`, `riValue`, `blend`.
- Cover `keyRows` example: `[['AUM (₹ cr)','aum','num'], ['AUM growth','aumGrowth','chg'], ['NII (₹ cr)','nii','num'], ['NIM','nim','pct'], ['Credit cost','creditCost','pct'], ['PAT (₹ cr)','pat','num'], ['EPS (₹)','eps','n2'], ['BVPS (₹)','bvps','n1'], ['ROA','roa','pct'], ['ROE','roe','pct']]`.
- Statement-note keys (`statementNotes["<key>@FY25"]`) match Model rows: `aum`, `sales`, `interest`,
  `nii`, `nti`, `opex`, `ppop`, `provisions`, `pbt`, `pat`, `eps`, `netWorth`, `borrowings`,
  `totalAssets`; they become cell comments in Excel.

## Excel workbook

Cover (live target) · Assumptions (drivers in blue, Base/Bull/Bear switch, FY26-default ratios in
green, valuation inputs) · Model (AUM → NII → PPOP → provisions → PAT → book → ROA/ROE; Screener
tie-out rows; balance check; funding solver) · Valuation (`TargetPrice`, `Upside`, `RIValue`,
`JustifiedPB`; justified P/B and RI tables; Ke × ROE and multiple sensitivities) · KPIs (core metrics
linked to the Model + `annualKpis`) · Quarterly (lender format, gross / net NPA, `quarterlyKpis`) ·
Quarterly history · Cash Flow (reported) · Valuation history (P/E, P/B) · Shareholding.
Run `verify-xlsx.ps1` as usual: zero error cells, TargetPrice = report target in scenarios 1/2/3.

## Limits (say so in the report where relevant)

- Bank layout is not built yet: on Screener a bank's fees and treasury income sit in Other Income and
  the funding mix is deposits + borrowings. Needs a deposit/CASA build, fee income in other income,
  CRR/SLR liquidity, and capital ratios (CRAR/CET1, risk-weighted assets) as an output.
- One AUM line (no product segments), AUM ≈ loan book (no off-book / securitised split), one blended
  yield and cost of funds; no stage-wise ECL or GNPA forecast (enter asset quality as KPIs).
- Capital adequacy is proxied by net worth ÷ AUM; no risk weights. Equity raises are inputs.
- Dividends are paid in the year they are earned (as elsewhere in the engine).
