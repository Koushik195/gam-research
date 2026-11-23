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
- December year-end companies (e.g. CASTROLIND, SCHAEFFLER) need December-year support before they can be written.
- (B, 23-Nov) Excel export fails ("Cannot read properties of undefined") for a segment model without an `esop` array; TMPV works around it with `esop: [0,0,0]`.
- (B, 23-Nov) `data/models/MARUTI.json` shows an as-of of 23-Oct-2026, not 30-Sep-2026; please check. TMPV used only Maruti's reported EBITDA because of it.
- (B, 23-Nov) Industrial engine has no share-issue line: a QIP before the as-of date (BHARATFORG, Sep-2026) needs a patch for the post-issue share count, and the QIP cash isn't on the balance sheet.
- (B, 23-Nov) Team B fetched `data/raw/TATATECH/screener.json` as a TMPV peer (TATATECH is in Team A's queue); refetch freely.
- (B, 23-Nov) Chart palette has only 4 colours; a fifth series crashes the chart (MOTHERSON sets it explicitly). DCF value and sensitivity grid round to ₹10, coarse for low-priced stocks.
- (B, 23-Nov) No acquisition line; and Screener back-fills restated quarters after a common-control deal (BOSCHLTD's Sep-2025 and Jun-2026 quarters show the Nov-2026 RBIC restatement), which is look-ahead. BOSCHLTD.patch.js restores the as-reported figures.
- (B, 23-Nov) Year-end change: MRF's Screener history starts with Sep-2014 and an 18-month Mar-2016 column (MRF.patch.js drops both). Treasury yield applies to net treasury, so income on debt-funded investments must go in `otherIncome`. Small Excel/engine differences can flip the ₹10 rounding of a scenario target. `snap-ic` doesn't check for raw `{{...}}` tokens.

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

- A18 · claimed (A, 23-Nov-2026) · SUNPHARMA published (HOLD, 1,800), DIVISLAB, TORNTPHARM, ZYDUSLIFE, CIPLA published (BUY, 1,670)
- A19 · queued · LAURUSLABS, DRREDDY, MANKIND, AUROPHARMA, LUPIN
- A20 · queued · GLENMARK, ALKEM, ABBOTINDIA, BIOCON, IPCALAB
- A21 · queued · GLAND, ANTHEM, AJANTPHARM, GLAXO, EMCURE
- A22 · queued · LALPATHLAB, SAILIFE, WOCKPHARMA, ACUTAAS, PPLPHARMA
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
- B23 · claimed (B, 23-Nov-2026) · UNOMINDA published (HOLD, 1,180), SCHAEFFLER (blocked: December year-end, waits for engine support), ATHERENERG, MRF published (BUY, 1,46,570), SONACOMS
- B24 · claimed (B, 23-Nov-2026) · BALKRISIND, TIINDIA, ENDURANCE, EXIDEIND, CRAFTSMAN
- B25 · queued · APOLLOTYRE, ZFCVINDIA, GABRIEL, MSUMI, ASAHIINDIA
- B26 · queued · FORCEMOT, BELRISE, TENNIND, OLAELEC, MINDACORP
- B27 · queued · CIEINDIA, ARE&M, CEATLTD, JBMA, RKFORGE
- B28 · queued · OLECTRA

### Consumer Services (21)

- B29 · queued · ETERNAL, DMART, TRENT, INDHOTEL, LENSKART
- B30 · queued · MEESHO, NYKAA, NAUKRI, VMM, IRCTC
- B31 · queued · PWL, ITCHOTELS, JUBLFOOD, URBANCO, EIHOTEL
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
