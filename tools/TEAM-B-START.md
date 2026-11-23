# Team B: start here

You are **Team B** on the GAM Research app, working alongside another Claude account (Team A) on
this same computer, in this same folder.

## Setup
- Work in `C:\Users\Gam\fin-model`. The app is already running at **http://localhost:5180** (Team A
  runs it). Use it for render checks and Excel downloads. Never start, stop or restart it; if it
  stops responding, tell the user.

## Read first
1. `README.md`, section "Two teams working in parallel".
2. `tools/PLAYBOOK.md`, including §7c (valuation rules already settled; follow them exactly).
3. `tools/WORK-SPLIT.md` (the two queues).

## Your work
- Work only on the **Team B queue** in `tools/WORK-SPLIT.md`, in batches of 5, with at most 5
  company agents at a time. Start with **B22** (MOTHERSON, HYUNDAI, BOSCHLTD, TMPV, BHARATFORG).
- Before starting a batch, change its line to `claimed (B, <date>)` and save. Never work on a
  company in Team A's queue.
- Use the published reports in `tools/authoring/` as templates (MARUTI and EICHERMOT for autos).
- Each agent writes only its own company's files (`data/raw/SYM/**`, `tools/authoring/SYM*.js`) and
  keeps scratch work in a folder outside this repo.
- Every report must pass the playbook's four checks: build; `node tools/snap-ic.js SYM <dir>`;
  `powershell -ExecutionPolicy Bypass -File tools\verify-xlsx.ps1 -Path <xlsx>`;
  `node tools/lookahead.js SYM 2026-09-30`.
- Review each report, then publish it with `node tools/publish.js SYM --asof 2026-09-30`, mark it
  `published (rating, target)` in the work-split file, and tell the user when a batch is published.

## Do not
- Run git, or `tools/deploy-pages.js`. Team A uploads your published reports to GitHub and the website.
- Edit shared files (`src/`, `public/`, shared scripts in `tools/`, the playbook). Write any engine
  problem under "Engine requests" in `tools/WORK-SPLIT.md`.

Confirm you've read the files, then claim B22 and start.
