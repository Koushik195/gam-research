# Work split between the two teams

Two Claude accounts write reports **on the same computer, in the same folder, against the same app (http://localhost:5180)**. **Each team works only on its own queue below.** No symbol appears in both queues, so there is no overlap.

- **Team A** = the first account (owns `src/`, `public/`, shared tools, the playbook, the app server, git and the website deploy).
- **Team B** = the second account (writes its own companies' reports only; no git, no deploy, no server restarts).

## How to use this file

1. Before starting a batch: re-read this file, change the batch's status from `queued` to `claimed (team, date)` and save it (edit only that line). Team A commits this file to GitHub with everything else.
2. Work through your own queue in order (you may reorder batches within your own queue, never take symbols from the other queue).
3. When a report is published, mark the symbol `published` with its rating and target.
4. If your queue runs out, ask GAM Research to move a whole batch from the other queue; the owning team marks it `moved to A/B` first.
5. Engine gaps (banks, December year-ends, missing features) go to Team A as a note here under "Engine requests"; Team B does not edit shared files.

Queues built 23-Nov-2026: 440 companies left (BSE-500 minus 56 published minus 4 in progress). Industry labels come from the Nifty 500 list; names outside it are under "Other".

## In progress

| Symbol | Team | Status |
|---|---|---|
| M&M | A | published (SELL, ₹2,600) |
| BAJAJ-AUTO | A | published (SELL, ₹10,030) |
| HEROMOTOCO | A | published (BUY, ₹6,110) |
| TVSMOTOR | A | published (SELL, ₹3,330) |

## Engine requests (for Team A)

- Banks need a bank layout in the lender engine (deposits/CASA, fees in other income, CRR/SLR, risk-weighted capital). Until then, Team A writes all banks.
- December year-end companies (e.g. CASTROLIND, SCHAEFFLER, CIEINDIA) need December-year support before they can be written.
- (B, 23-Nov) Excel export fails ("Cannot read properties of undefined") for a segment model without an `esop` array; TMPV works around it with `esop: [0,0,0]`.
- (B, 23-Nov) `data/models/MARUTI.json` shows an as-of of 23-Oct-2026, not 30-Sep-2026; please check. TMPV used only Maruti's reported EBITDA because of it.
- (B, 23-Nov) Industrial engine has no share-issue line: a QIP before the as-of date (BHARATFORG, Sep-2026) needs a patch for the post-issue share count, and the QIP cash isn't on the balance sheet.
- (B, 23-Nov) Team B fetched `data/raw/TATATECH/screener.json` as a TMPV peer (TATATECH is in Team A's queue); refetch freely.
- (B, 23-Nov) Chart palette has only 4 colours; a fifth series crashes the chart (MOTHERSON sets it explicitly). DCF value and sensitivity grid round to ₹10, coarse for low-priced stocks.
- (B, 23-Nov) No acquisition line; and Screener back-fills restated quarters after a common-control deal (BOSCHLTD's Sep-2025 and Jun-2026 quarters show the Nov-2026 RBIC restatement), which is look-ahead. BOSCHLTD.patch.js restores the as-reported figures.
- (B, 23-Nov) Year-end change: MRF's Screener history starts with Sep-2014 and an 18-month Mar-2016 column (MRF.patch.js drops both). Treasury yield applies to net treasury, so income on debt-funded investments must go in `otherIncome`. Small Excel/engine differences can flip the ₹10 rounding of a scenario target. `snap-ic` doesn't check for raw `{{...}}` tokens.
- **FIXED by Team A (24-Nov): MROUND replaced with ROUND(x/n,0)*n in all Excel target formulas (identical for positive values); app restarted. Team B: re-run verify-xlsx for OLAELEC and publish.** (B, 24-Nov) **Blocks OLAELEC:** the Excel DCF sensitivity grid uses MROUND, which returns #NUM! when the DCF value is negative (25 error cells). Suggested fix in the export: `ROUND(x/10,0)*10`. OLAELEC is built (SELL, ₹35) and held unpublished until this is fixed; Team B will re-run the checks and publish.
- (B, 24-Nov) **Possible look-ahead on covers (please check all reports):** the as-of filter doesn't catch an off-cycle Screener shareholding column dated after the as-of date (OLAELEC showed "Nov 2026"), and the cover's market cap used a post-as-of share count (after a later rights issue). OLAELEC.patch.js works around both.
- (B, 24-Nov) `data/raw/ARE&M/screener.json` is now the standalone fetch (its model basis); the consolidated copy is in `data/raw/ARE&M/research/screener-consolidated.json`. EXIDEIND's peer row for Amara Raja would change if EXIDEIND is rebuilt (sector median unchanged).
- (B, 24-Nov) Playbook question: for turnaround stocks the own forward-P/E median (on realised forward EPS) is dragged down by the years before the turnaround, and the trough rule doesn't catch them. FORCEMOT: 9.8x median → SELL ₹8,810 (−48%) vs street ₹21,470, DCF ₹14,921, EV/EBITDA ₹16,427; since-Apr-2024 median 17.5x → ₹17,140. Published per the rule; GAM Research to decide whether the rule needs a turnaround exception. Same pattern in JBMA (BUY ₹760 on a 51.7x own median that includes the 2023-24 e-bus re-rating; without those years 36.5x → ₹590 HOLD; DCF ₹141). Related: INDHOTEL's hotel sector move (−32.9%) rests on only two peers (EIHOTEL, LEMONTREE; CHALET excluded for flat-sale income, ITCHOTELS too new) and drives a SELL ₹540 vs street ₹840; without it ~₹790 (HOLD). GAM Research may want a minimum peer count for the sector move. Also: Excel reads unpatched Screener schedules, so balance-sheet patches make Excel's DCF disagree with the report (JBMA used `otherTreasury` instead).
  - **Decision (GAM Research, 24-Nov): redo FORCEMOT.** Use the post-turnaround window: own one-year-forward P/E median **since 1-Apr-2024** (EPS before one-offs) × the auto-OEM peers' move against their own medians over the **same window** (HYUNDAI/BAJAJHFL same-window rule), nearest half-turn; keep the since-2021 median (9.8x) as a sensitivity row. Rebuild, rerun the four checks and republish on the same date (it replaces the event). Team A holds FORCEMOT off GitHub until then. Rule added to PLAYBOOK §7c (turnarounds).
- (B, 23-Nov) SOTP parts can only be segment metric × multiple (no P/E-on-PAT part; scenarios only change per-segment inputs); EXIDEIND computes parts in its ctx. Net cash includes strategic stakes (HDFC Life, subsidiaries). No segment-EBIT model (CRAFTSMAN reports EBIT only). Interest isn't linked to the debt path and the summary tables have no interest row; forecast ROCE is effectively pre-tax ROE.
- (B, 23-Nov) Screener data quirks for recent listings (ATHERENERG): standalone years labelled "Mar 2024 (S)" in tables but "Mar 2024" in schedules (capex/cash blank unless patched); cash-flow rows one year late; a missing quarter. No forward EV/Sales routine; ESOP array only for segment models; the cover's implied P/E row shows for loss-makers.

## Team A queue (220 companies)

### Financial Services (82)

- A01 · queued · HDFCBANK, ICICIBANK, SBIN, LICI, KOTAKBANK
- A02 · queued · AXISBANK, BAJAJFINSV, SBILIFE, PNB, UNIONBANK
- A03 · queued · JIOFIN, ICICIAMC, TATACAP, BAJAJHLDNG, BANKBARODA
- A04 · queued · GROWW, INDIANB, HDFCLIFE, CANBK, PFC
- A05 · queued · PAYTM, IRFC, HDFCAMC, FEDERALBNK, IDBI
- A06 · queued · ICICIGI, RECLTD, MCX, AUBANK, INDUSINDBK
- A07 · queued · IDFCFIRSTB, ICICILIFE, BANKINDIA, MAHABANK, NAM-INDIA
- A08 · queued · MOTILALOFS, IOB, GICRE, RBLBANK, YESBANK
- A09 · queued · POLICYBZR, PIRAMALFIN, AIIL, MFSL, 360ONE
- A10 · queued · ANANDRATHI, CRISIL, STARHEALTH, NUVAMA, HUDCO
- A11 · queued · PNBHOUSING, IREDA, TATAINVEST, MANAPPURAM, UCOBANK
- A12 · queued · LICHSGFIN, NIACL, CENTRALBK, ANGELONE, ABSLAMC
- A13 · queued · BANDHANBNK, CHOLAHLDNG, IIFL, CGCL, CUB
- A14 · queued · AADHARHFC, PINELABS, CREDITACC, CAMS, IFCI
- A15 · queued · CHOICEIN, KFINTECH, FIVESTAR, SAMMAANCAP, J&KBANK
- A16 · queued · UTIAMC, HOMEFIRST, JMFINANCIL, APTUS, CANFINHOME
- A17 · queued · IEX, AAVAS

### Healthcare (34)

- A18 · published (A, 23-Nov-2026) · SUNPHARMA published (HOLD, 1,800), DIVISLAB published (SELL, 8,710), TORNTPHARM published (SELL, 4,260), ZYDUSLIFE published (SELL, 950), CIPLA published (BUY, 1,670)
- A19 · published (A, 23-Nov-2026) · LAURUSLABS published (SELL, 1,150), DRREDDY published (HOLD, 1,200), MANKIND published (BUY, 3,490), AUROPHARMA published (HOLD, 1,660), LUPIN published (HOLD, 1,950)
- A20 · published (A, 24-Nov-2026) · GLENMARK published (SELL, 1,780), ALKEM published (BUY, 6,720), ABBOTINDIA published (BUY, 36,210), BIOCON published (BUY, 490), IPCALAB published (HOLD, 2,130)
- A21 · published (A, 24-Nov-2026) · GLAND published (HOLD, 2,990), ANTHEM published (BUY, 990), AJANTPHARM published (SELL, 3,400), GLAXO published (BUY, 3,320), EMCURE published (HOLD, 2,170)
- A22 · in progress (A, 24-Nov-2026) · LALPATHLAB published (HOLD, 2,200), SAILIFE published (SELL, 1,250), WOCKPHARMA, ACUTAAS published (SELL, 2,280), PPLPHARMA
- A23 · queued · NEULANDLAB, GRANULES, COHANCE, CAPLIPOINT, NATCOPHARM
- A24 · queued · ONESOURCE, SYNGENE, POLYMED, CONCORDBIO

### Fast Moving Consumer Goods (26)

- A25 · queued · HINDUNILVR, ITC, NESTLEIND, VBL, BRITANNIA
- A26 · queued · MARICO, TATACONSUM, UNITDSPR, GODREJCP, DABUR
- A27 · queued · RADICO, COLPAL, PATANJALI, UBL, GODFRYPHLP
- A28 · queued · GILLETTE, AWL, ABDL, EMAMILTD, ZYDUSWELL
- A29 · queued · HONASA, BALRAMCHIN, LTFOODS, CCL, DOMS
- A30 · queued · EIDPARRY

### Information Technology (18)

- A31 · queued · LTM, PERSISTENT, COFORGE, OFSS, MPHASIS
- A32 · queued · LTTS, HEXT, IKS, TATATECH, NETWEB
- A33 · queued · TATAELXSI, SAGILITY, AFFLE, KPITTECH, CYIENT
- A34 · queued · ZENSARTECH, BSOFT, INTELLECT

### Power (17)

- A35 · queued · ADANIPOWER, NTPC, POWERGRID, ADANIGREEN, ADANIENSOL
- A36 · queued · TATAPOWER, JSWENERGY, NHPC, NTPCGREEN, TORNTPOWER
- A37 · queued · NLCINDIA, ACMESOLAR, SJVN, CESC, NAVA
- A38 · queued · JPPOWER, RPOWER

### Construction (13)

- A39 · queued · LT, RVNL, KPIL, CEMPRO, IRB
- A40 · queued · NBCC, ENGINERSIN, TECHNOE, IRCON, RITES
- A41 · queued · KEC, AFCONS, NCC

### Services (11)

- A42 · queued · ADANIPORTS, INDIGO, GMRAIRPORT, JSWINFRA, CONCOR
- A43 · queued · REDINGTON, DELHIVERY, GESHIP, FSL, ECLERX
- A44 · queued · IGIL

### Realty (11)

- A45 · queued · DLF, LODHA, PHOENIXLTD, PRESTIGE, OBEROIRLTY
- A46 · queued · GODREJPROP, BRIGADE, ANANTRAJ, SOBHA, ABREL
- A47 · queued · SIGNATURE

### Textiles (5)

- A48 · queued · PAGEIND, KPRMILL, WELSPUNLIV, VTL, TRIDENT

### Media Entertainment & Publication (3)

- A49 · queued · SUNTV, PFOCUS, PVRINOX

## Team B queue (220 companies)

### Capital Goods (63)

- B01 · queued · HAL, BEL, TMCV, BHEL, ABB
- B02 · queued · CGPOWER, CUMMINSIND, POWERINDIA, SIEMENS, POLYCAB
- B03 · queued · ENRIN, GVT&D, ASHOKLEY, MAZDOCK, WAAREEENER
- B04 · queued · WELCORP, APARINDS, APLAPOLLO, SUZLON, CPPLUS
- B05 · queued · SUPREMEIND, PREMIERENE, PTCIL, BDL, ASTRAL
- B06 · queued · THERMAX, KEI, AIAENG, SHYAMMETL, COCHINSHIP
- B07 · queued · ESCORTS, HONAUT, SYRMA, KIRLOSENG, SCHNEIDER
- B08 · queued · RRKABEL, KAYNES, GRSE, DATAPATTNS, HBLENGINE
- B09 · queued · TIMKEN, JYOTICNC, CARBORUNIV, FINCABLES, EMMVEE
- B10 · queued · ELGIEQUIP, BEML, JINDALSAW, TRITURBINE, USHAMART
- B11 · queued · ZENTEC, GRAPHITE, GPIL, GALLANTT, KIRLOSBROS
- B12 · queued · ACE, INOXWIND, ELECON, TARIL, TITAGARH
- B13 · queued · JWL, RHIM, HEGAM

### Other / not in Nifty 500 list (36)

- B14 · queued · 3MINDIA, TVSHLTD, PGHH, GRINDWELL, GUJENERGY
- B15 · queued · THELEELA, CHALET, ERIS, DCMSHRIRAM, TRAVELFOOD
- B16 · queued · JUBLPHARMA, 544467, INDGN, JSWDULUX, JSWHL
- B17 · queued · MANYAVAR, BIKAJI, BLUEDART, FINPIPE, ABLBL
- B18 · queued · CELLO, BBTC, MAHSEAMLES, MEDPLUS, EMBDL
- B19 · queued · SONATSOFTW, JYOTHYLAB, NEWGEN, SAPPHIRE, JKLAKSHMI
- B20 · queued · CERA, RCF, ABFRL, LATENTVIEW, MAPMYINDIA
- B21 · queued · ALOKINDS

### Automobile and Auto Components (31)

- B22 · published (B, 23-Nov-2026) · MOTHERSON published (SELL, 131), HYUNDAI published (HOLD, 2,160), BOSCHLTD published (SELL, 35,800), TMPV published (BUY, 380), BHARATFORG published (HOLD, 2,070)
- B23 · published except SCHAEFFLER (B, 23-Nov-2026) · UNOMINDA published (HOLD, 1,180), SCHAEFFLER (blocked: December year-end, waits for engine support), ATHERENERG published (SELL, 1,010), MRF published (BUY, 1,46,570), SONACOMS published (SELL, 760)
- B24 · published (B, 23-Nov-2026) · BALKRISIND published (HOLD, 2,430), TIINDIA published (BUY, 3,680), ENDURANCE published (HOLD, 2,770), EXIDEIND published (HOLD, 400), CRAFTSMAN published (SELL, 8,580)
- B25 · published (B, 23-Nov-2026) · APOLLOTYRE published (BUY, 540), ZFCVINDIA published (HOLD, 2,590), GABRIEL published (HOLD, 1,290), MSUMI published (BUY, 54), ASAHIINDIA published (SELL, 810)
- B26 · claimed (B, 23-Nov-2026; FORCEMOT, BELRISE, TENNIND now; OLAELEC, MINDACORP later) · FORCEMOT published (SELL, 8,810), BELRISE published (SELL, 225), TENNIND published (BUY, 620), OLAELEC (built, held: Excel MROUND engine fix needed), MINDACORP published (SELL, 650)
- B27 · published except CIEINDIA (B, 24-Nov-2026) · CIEINDIA (blocked: December year-end, waits for engine support), ARE&M published (BUY, 1,030), CEATLTD published (HOLD, 3,340), JBMA published (BUY, 760), RKFORGE published (SELL, 330)
- B28 · published (B, 24-Nov-2026) · OLECTRA published (BUY, 1,960)

### Consumer Services (21)

- B29 · claimed (B, 24-Nov-2026; ETERNAL, DMART, INDHOTEL in progress; TRENT, LENSKART later) · ETERNAL published (HOLD, 360), DMART published (HOLD, 4,040), TRENT published (SELL, 2,410), INDHOTEL published (SELL, 540), LENSKART published (SELL, 570)
- B30 · claimed (B, 24-Nov-2026) · MEESHO published (SELL, 205), NYKAA published (HOLD, 365), NAUKRI published (HOLD, 1,270), VMM published (BUY, 120), IRCTC (paused: built, needs peer-set fix before publishing)
- B31 · claimed (B, 24-Nov-2026; paused: PWL built, JUBLFOOD part-done, URBANCO and EIHOTEL just started) · PWL, ITCHOTELS published (BUY, 205), JUBLFOOD, URBANCO, EIHOTEL
- B32 · queued · TBOTEK, DEVYANI, INDIAMART, BLS, LEMONTREE
- B33 · queued · FIRSTCRY

### Oil Gas & Consumable Fuels (17)

- B34 · queued · RELIANCE, ONGC, COALINDIA, IOC, BPCL
- B35 · queued · GAIL, OIL, HINDPETRO, ATGL, AEGISLOG
- B36 · queued · PETRONET, MRPL, AEGISVOPAK, CHENNPETRO, IGL
- B37 · queued · CASTROLIND, MGL

### Metals & Mining (17)

- B38 · queued · ADANIENT, JSWSTEEL, HINDZINC, TATASTEEL, HINDALCO
- B39 · queued · VAML, JINDALSTEL, LLOYDSME, SAIL, NMDC
- B40 · queued · JSL, NATIONALUM, HINDCOPPER, SARDAEN, GMDCLTD
- B41 · queued · NSLNISP, GRAVITA

### Consumer Durables (12)

- B42 · queued · TITAN, LGEINDIA, DIXON, HAVELLS, VOLTAS
- B43 · queued · BLUESTARCO, AMBER, KAJARIACER, PGEL, CROMPTON
- B44 · queued · WHIRLPOOL, BATAINDIA

### Construction Materials (11)

- B45 · queued · ULTRACEMCO, GRASIM, AMBUJACEM, SHREECEM, JKCEMENT
- B46 · queued · DALBHARAT, ACC, RAMCOCEM, JSWCEMENT, NUVOCO
- B47 · queued · INDIACEM

### Telecommunication (8)

- B48 · queued · BHARTIARTL, IDEA, INDUSTOWER, BHARTIHEXA, TATACOMM
- B49 · queued · HFCL, RAILTEL, TEJASNET

### Chemicals (4)

- B50 · queued · AETHER, JUBLINGREA, CLEAN, SWANCORP
