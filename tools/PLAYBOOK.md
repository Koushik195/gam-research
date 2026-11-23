# GAM Research: initiation playbook (Q1FY27 library)

How every initiating-coverage report in this app is built. The standard is the Maruti, SRF and
Sumitomo reports: sell-side depth, plain English, brutally honest, tailored to the business.

## 1. The as-of rule (most important)

- Every Q1FY27 initiation is written **as of 30-Sep-2026**: after all Q1FY27 (Jun-2026 quarter)
  results, before any Q2FY27 results. Today's date is later, so most sources mention later events.
- Use **only information published on or before 30-Sep-2026**. Check the publication date of every
  source. No Q2FY27 numbers, no October broker notes, no Sep-2026 shareholding pattern (filed in
  October; use Jun-2026), no later prices.
- `assumptions.json` carries `"asOf": "2026-09-30"`. The model then freezes the data automatically:
  quarters released by then (≤ Q1FY27), shareholding to Jun-2026, prices and multiples to the
  as-of date, using the exact NSE close in `data/market/closes/2026-09-30.json`.
- `tools/publish.js` refuses any report whose content contains an ISO date (YYYY-MM-DD) after the
  as-of date. Keep later dates out of the text and exhibits.

## 2. Files for each company (SYM = NSE symbol)

| File | What it holds |
|---|---|
| `data/raw/SYM/screener.json` | Screener data: `node src/fetch-screener.js SYM` (add `--standalone` if the consolidated page is stale) |
| `data/raw/SYM/research/company.json` | Company fact base: segments, guidance, Q1FY27 results and call, capex, history, corporate actions, management, governance, accounting. Every number has `src` (URL) and `published` (date) |
| `data/raw/SYM/research/deep.json` | Industry, peers, street (brokers' rating, target, method, multiple, earnings year, thesis, date), consensus, ownership (Jun-2026), stock events, moat, critiques, `gaps`, `conflicts` |
| `data/raw/SYM/research/segments.json` | `annual` (FY rows) and `quarterly` (≤ Q1FY27) segment data, plus `kpiBlocks` for the Excel KPI sheet |
| `data/raw/SYM/research/assumptions.json` | Forecast drivers, each with a `_why`; DCF block; scenarios; valuation |
| `tools/authoring/SYM.js` | Part A: chapters built on reported financials + the main writer (date `'30 September 2026'`) |
| `tools/authoring/SYM.research.js` | Part B: all research chapters, cover, rating, statement notes |

Worked examples to copy from:
- **SRF**: segment model (EBITDA margin by segment), SOTP primary (`roll` Sep-28E, corporate-cost
  part, net debt at target date), P/E and DCF cross-checks, as-of street table and peers.
- **SUMICHEM**: single-segment `revenueGrowth` + `ebitdaMargin` model, P/E primary via
  `streetBlocks`, EV/EBITDA and DCF cross-checks, `otherTreasury` for deposits inside other assets.
- **KALYANKJIL**: segment model with P/E primary. **SWIGGY**: platform SOTP. **MARUTI**: volume ×
  price model. **GODIGIT**: insurer model.

## 3. Steps

1. **Data.** Fetch Screener if missing or stale. Check `basis` (consolidated vs standalone).
2. **Fact base.** Research only to 30-Sep-2026: annual reports (Screener `documents`), Q1FY27
   results, presentation and call transcript (Jul/Aug-2026), broker notes (Trendlyne research
   reports, press roundups), CRISIL/ICRA, industry sources. Download PDFs into your own new
   scratchpad folder and read them with the Read tool (no Python on this machine), at most ~10 pages
   per read; for long documents extract text first with
   `node tools/pdfpages-pos.js <pdf> <firstPage> <lastPage> <out.txt>` and search it. Save each
   research JSON as soon as it is ready. Never estimate a number from memory: record it in `gaps`.
3. **segments.json** from reported segment data (annual FY20-FY26 where possible; quarterly Q1FY25-Q1FY27).
4. **assumptions.json.** FY27E-FY29E drivers grounded in Q1FY27 and guidance known then; capex from
   guidance; depreciation rate on gross block; treasury yield / other income; interest; tax;
   payout; `dcf` block (rf 6.5, erp 6, beta ~0.8-1.1, terminal growth ~5-6%); bull/bear scenarios;
   `valuation` (see §4).
5. **Authoring files** (§5). Write Part B in pieces of about 150 lines or fewer per file write
   (`SYM.research.js` merging `SYM.part2.js`, `part3.js`…, as MARUTI does); one huge write can stall
   the run. When reviewing screenshots, read them one or two at a time (big batches also stall).
   Then build and check:
   - `node src/model.js SYM` → `node tools/authoring/SYM.js` → `node src/model.js SYM`
   - Render check: `node tools/snap-ic.js SYM <your scratchpad dir>` must print `errors: none`
     (needs the app running at http://localhost:5180). Look at the cover and valuation screenshots.
   - Excel check: download `http://localhost:5180/api/excel/SYM` and run
     `powershell -ExecutionPolicy Bypass -File tools\verify-xlsx.ps1 -Path <file>` (needs Microsoft
     Excel): zero error cells on every sheet; TargetPrice equals the report's target in all scenarios.
   - Rendered-text check: no raw `{{...}}` token may appear in the rendered report (table
     `source`/`title` fields are not token-rendered — build those strings in JS).
   - Look-ahead check: `node tools/lookahead.js SYM 2026-09-30` → no ISO date after the as-of date,
     and read every "later month-date" it lists. Forward guidance known by 30-Sep is fine
     ("commissioning by Mar-2027"); exact dates announced later are not (a Q2 board-meeting date,
     a competitor's inauguration day). Write "Q2FY27 results (due by mid-November 2026)".
6. **Do not publish.** GAM Research reviews the rating and target first, then runs
   `node tools/publish.js SYM --asof 2026-09-30`.

## 4. Valuation rules

- **Primary method = how the street values this stock** (P/E on which year, EV/EBITDA, SOTP by
  segment, P/B–ROE, DCF). Build a street table: broker, rating, target, method, multiple, earnings
  year, thesis, date, standing on 30-Sep-2026.
- **12-month target, Sep-28E basis**: `roll: ["FY28E", "FY29E", 0.5]`.
- **Derive the multiple**, don't pick it: (1) the median of the stock's own one-year-forward (not trailing)
  P/E from Apr-2021 to the as-of date, or from listing / demerger if later, **leaving out trough
  years** (forward EPS a loss or below half the highest EPS of the previous three years) — always
  from `forwardMedian(sym, M)` in `tools/authoring/valuation-blend.js` (returns median, medianAll,
  troughYears); state the excluded years in the derivation table; (2) how far the sector had
  de-rated by 30-Sep-2026 (peers' P/E vs their five-year medians from their `screener.json`);
  (3) growth vs what the street's multiples assume; (4) peers (`tools/authoring/asof-peers.js`,
  multiples at the 30-Sep close); (5) returns vs cost of capital. Show the derivation table.
- **One-offs in history:** if reported EPS carries large one-offs (land or asset-sale gains, big
  exceptional items), also compute the median on EPS before them in your own files, show both, and
  say which you use and why (see KANSAINER).
- **Holding companies:** derive the holdco discount the same way: the median of the stock's own
  discount to look-through value since Apr-2021, then judge against the as-of level (see GODREJIND).
- **Other income must be built, not plugged:** treasury yield on net cash + JV/associate share +
  recurring items, each sourced (annual-report other-income note). FY27E must reconcile to the TTM
  and the last full year; explain any gap with a source or leave it out (see BERGEPAINT).
- **Cross-checks only, never weights**: DCF plus one relative method (EV/EBITDA or P/E).
- **Rating comes from the rule** in `src/ratings.js` (BUY ≥ +15%, HOLD −5% to +15%, SELL < −5%
  upside from the as-of price to the target). Use `ruleText`, `buyBelow`, `sellAbove`; never type
  thresholds. Do not tune a multiple to land on a rating; derive it consistently and accept the result.

## 5. Report chapters (tailor them; a bank is not a chemicals company)

Cover (headline, lead, four arguments, flags, catalysts, key rows) · the story in 8 exhibits ·
what the company does · history & corporate actions (with impact on the numbers) · industry ·
tailwind test (does the sector tailwind reach this company?) · one chapter per important segment ·
competitive advantage scorecard with an honest verdict ("if there is no moat, say so") ·
financial trajectory · capital allocation / returns where relevant · earnings quality (accounting
flag) · balance sheet & cash · ownership (named holders, Jun-2026) · management & governance
scorecard · our forecasts vs the street (estimates standing on 30-Sep) · street view and critiques ·
valuation (street table, multiple derivation, forward-multiple chart, cross-checks, scenarios,
DCF detail and sensitivity, peers) · risks & honest summary (what you buy, what you pay, triggers,
how we would act) · annotated statements (`statementNotes` explain every big change) · glossary.

## 6. Style

Professional but very simple English; short sentences; explain every term once (glossary). Say
what the numbers mean ("so what"). Charts: one point per chart, stated in the title, values
printed. Be brutally honest: weak growth, no moat, poor governance, expensive valuation — say it.
Every number must trace to a source or to the model (prefer live tokens like `{{dcf.tp|inr}}`).

## 7. Known engine limits (work around them in your own files, and say so in the report)

- `fin.treasury` is gross cash in actual years but net cash in forecasts: label the row, or show
  a net-debt table instead (indebted companies).
- The DCF discounts at the cost of equity (no separate WACC input in Excel); for leveraged names set
  beta so the rate equals your WACC and explain it. Long capex-heavy horizons can turn the DCF
  negative: use `dcf.years` to shorten the explicit period.
- CWIP is held flat (capex is depreciated at once): pick the depreciation rate with that in mind.
- `forwardSeries` charts forward P/E or P/B only; compute EV/EBITDA history in your research file.
- `owcPctOfSales` is not in the Excel model; don't use it. No inter-segment elimination line: add a
  negative segment with zero margin.
- Single-segment companies: keep the business-line build in `assumptions.json` and check it sums
  to model revenue in the authoring script.
- No minority-interest line; the share count is FY26 profit ÷ EPS, which is wrong when minorities
  are large. Check implied shares against the actual count; if they differ, add
  `tools/authoring/SYM.patch.js` exporting `patchRaw(raw)` (see UPL.patch.js / TATACHEM.patch.js:
  Net Profit → Screener's "Profit for EPS"); src/model.js applies it on every build. Never edit
  `screener.json` by hand: a re-fetch would undo it.

## 7b. Lenders (NBFCs; banks later)

Set `"type": "lender"` in assumptions.json; schema, tokens and an example valuation block are in
`tools/authoring/LENDER-NOTES.md`. Record closing AUM, provisions (impairment) and fee income for
every year you can source (FY26 required) in `assumptions.history` or `company.json` annualKpis, with
sources; the engine maps Screener's NBFC rows (Revenue = interest + fees; Expenses = opex +
provisions) and the Model sheet shows the tie-out. Forecast with AUM growth, yield and fees on
average AUM, cost of funds on average borrowings, opex and credit cost on average AUM, tax and payout;
borrowings are the balancing item. Value on the street's method, usually P/B on Sep-28E book
(`roll ["FY28E","FY29E",0.5]`) or P/E. Derive the multiple from `forwardMedianPb` (or
`forwardMedian`) plus the sector de-rating and ROE-versus-cost-of-equity. Show justified P/B
((ROE − g) ÷ (Ke − g), on book at the target date) and residual income as cross-checks. Replace
margin/capex chapters with lender chapters: franchise and AUM mix, spread and NIM, asset quality and
credit cost, funding and liquidity, capital and leverage, and the ROA → ROE tree. Engine limits: no
bank layout (deposits/CASA, fees in other income, CRR/SLR, risk-weighted capital), one AUM line, no
stage-wise ECL forecast.

Peer data notes: `data/raw/ABCAPITAL/screener.json` is the **standalone** fetch (its lender model);
use `data/raw/ABCAPITAL/research/screener-consolidated.json` when ABCL is a peer. `HDBFS` is also
standalone (no subsidiaries). `forwardSeries` keeps every 5th weekly point and can drop the as-of
close: for short histories compute the series on all weekly closes in your ctx (see HDBFS, CHOLAFIN).

## 7c. Batch valuation rules settled so far (apply them; don't re-litigate)

- Sector de-rating = median of the sector peer set's P/E (or P/B for lenders, EV/EBITDA for
  hospitals) at the 30-Sep close vs their five-year medians, **excluding the company itself** and any
  peer whose earnings are distorted (say which and why). Use the full peer set, no hand-picked
  sub-sets (sub-sets may be shown as sensitivity rows).
- **Do not blend in the stock's own de-rating** (no midpoint of sector and own), and add no growth
  or returns uplift/discount to the base multiple; show such views as sensitivity rows and explain
  them in the text and cross-checks.
- Round a derived multiple to the nearest half-turn (P/E, EV/EBITDA) or 0.05x/0.1x (P/B), never
  further in one direction.
- Start-up losses in a SOTP: present value of losses to breakeven, not a perpetuity multiple.
- SOTP minorities: deduct only minorities in parts valued at 100%; never double count a stake already
  valued at the parent's share.
- Recently listed stocks: skip the post-listing/IPO-premium months; a 12-month window is acceptable
  (see BAJAJHFL, HDBFS).
- IT peer set: TCS, INFY, HCLTECH, WIPRO, LTIM (data/raw/LTM), PERSISTENT, COFORGE, MPHASIS, LTTS;
  TECHM excluded as a peer (trough-distorted).
- Auto OEM peer set: MARUTI, M&M, BAJAJ-AUTO, EICHERMOT, HEROMOTOCO, TVSMOTOR, ASHOKLEY, ESCORTS;
  ESCORTS excluded (FY26 profit inflated by the railway-business sale). Median at 30-Sep: −6.9%,
  the same with or without Escorts or Bajaj. Names without a five-year P/E history (TMPV, TMCV,
  HYUNDAI) are not peers. When such a name is valued on a 12-month own median, use the same peers'
  move against their own 12-month medians (same window, as BAJAJHFL and HYUNDAI do), not −6.9%.
- Pharma peer set (set 23-Nov-2026): SUNPHARMA, DIVISLAB, TORNTPHARM, ZYDUSLIFE, CIPLA, AUROPHARMA,
  ALKEM, IPCALAB, ABBOTINDIA. Excluded as distorted: LUPIN and GLENMARK (loss years inside the
  window), BIOCON and LAURUSLABS (one-off or boom-bust EPS; P/E above 100x inside the window),
  DRREDDY (gRevlimid windfall FY23-26, then the cliff; Q4FY26 EPS ₹2.65), MANKIND (listed May-2023,
  no five-year median). For the five A18 names, including all 15 gives the same medians (for names
  outside the set the all-names median is lower, ~+5.4%; the nine-name set governs). At 30-Sep
  pharma trades **above**
  its five-year medians, so the factor is a re-rating; apply it the same way (it works in both
  directions). Factors excluding self: SUNPHARMA +10.25%, CIPLA +7.5%, DIVISLAB / TORNTPHARM /
  ZYDUSLIFE +5.45%. A limited-competition windfall (e.g., gRevlimid) is not a one-off under §4: the
  base median uses reported EPS, and an ex-windfall median may be shown as a sensitivity row.
  Names outside the set use the median of all nine: +8.2% (LAURUSLABS, DRREDDY, LUPIN). AUROPHARMA
  +5.45%. MANKIND (listed May-2023): own median since 1-Nov-2023 (IPO months skipped) × the nine
  peers' move against their medians over the same window, +11.0%. Batch practice (A18): where
  exceptional items are material, the base median uses EPS before them (forecasts carry none) and
  the reported-EPS median is a sensitivity row. A pharma name valued on EV/EBITDA uses the EV/EBITDA
  analogue of the factor (e.g., TORNTPHARM +5.55%).

## 8. Do not

Bypass a site that blocks automated access (no forged referer/origin headers, no scraping around a
block): use another public source and record the gap.


Edit anything under `src/`, `public/`, `tools/authoring/valuation-blend.js`, `tools/authoring/asof-peers.js`,
or another company's files. If the engine cannot do something you need, work around it in your
own files and report the gap.
