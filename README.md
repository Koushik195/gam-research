# GAM Research

Internal equity research app for GAM Research. It holds initiating-coverage reports on BSE-500
companies, each with a live Excel model, a 12-month target and a BUY / HOLD / SELL rating, plus a
library that tracks rating changes over time.

Research reports and models are GAM Research's own analysis, written as of the date stated in each
report; they are not investment advice. Source data comes from Screener.in, NSE and company filings.

## Run it on your computer

1. Install [Node.js](https://nodejs.org) 20 or later, and Google Chrome (used for PDF export and
   screenshots).
2. In this folder, run:

   ```bash
   npm install
   npm start
   ```

3. Open http://localhost:5180/library in your browser.

If Chrome is not in its usual place, set `CHROME_PATH` to the full path of `chrome.exe` before
`npm start`.

## What is where

| Folder | What it holds |
|---|---|
| `src/` | The engine: data fetch, model builder, forecasts (operating companies, insurers, lenders), Excel workbook, server |
| `public/` | The web pages: library, company pages, report renderer |
| `tools/` | Publishing, look-ahead check, render check; `tools/authoring/` has each company's report scripts |
| `tools/PLAYBOOK.md` | **How every report is built**: as-of rule, valuation rules, checks. Read this first |
| `data/raw/<SYMBOL>/` | Screener data and each company's research files (`research/*.json`) |
| `data/models/` | Built models (rebuilt automatically) |
| `data/market/` | Exact NSE closes used for as-of pricing |

## Common commands

```bash
node src/fetch-screener.js SYMBOL                 # download or refresh a company's data
node src/model.js SYMBOL                          # rebuild a model
node tools/authoring/SYMBOL.js                    # regenerate a report from its scripts
node tools/publish.js SYMBOL --asof 2026-09-30    # publish (rating rule, version snapshot, history)
node tools/lookahead.js SYMBOL 2026-09-30         # check a report has no information after its as-of date
```

## Ratings

Upside from the as-of price to the 12-month target: **BUY** at +15% or more, **HOLD** from −5% to
+15%, **SELL** below −5% (`src/ratings.js`).

## Website version (GitHub Pages)

A read-only snapshot of the published library is online at
https://koushik195.github.io/gam-research/library/ (no install needed). To update it after publishing
reports, start the app and run `node tools/deploy-pages.js`. Preview the export locally with
`node tools/serve-static.js` and open http://localhost:5190/gam-research/.
