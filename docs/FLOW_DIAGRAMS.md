# Crawlia — Master Visual Flow Diagrams
**The Complete Architecture, Navigation, Execution Loops, and Lifecycle Flowcharts**

---

## 1. Master System Topology & Component Wiring
This diagram maps how every part of the Crawlia platform interconnects: from user interaction in the web browser down to external LLM providers and headless browser workers.

```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer (Frontend)"]
        UI["React / Next.js Web Application"]
        SSEClient["Server-Sent Events (SSE) Listener"]
    end

    subgraph APILayer ["API & Gateway Layer"]
        Gateway["API Gateway & Auth (JWT/OAuth)"]
        SSEHub["Real-time SSE Broadcast Hub"]
    end

    subgraph ServicesLayer ["Core Microservices"]
        LeadSvc["Lead Discovery & Dedupe Service"]
        AnalysisSvc["Analysis & Scoring Service"]
        WriteSvc["AI Email Writing Service"]
        CampSvc["Campaign & Scheduler Service"]
        SendSvc["Mailbox & Sending Service"]
        ReplySvc["Inbound Reply & Triage Service"]
        BillingSvc["Billing & Credit Ledger Service"]
    end

    subgraph AsyncWorkers ["Async Background Fleet (Redis Queue)"]
        CrawlFleet["Headless Chromium Fleet (DOM/Screenshots)"]
        LLMFleet["LLM Worker Fleet (Claude/Gemini)"]
        CronSched["Minute-by-Minute Send Scheduler"]
    end

    subgraph StorageLayer ["Data & Asset Storage"]
        Postgres[(Postgres Primary Database)]
        Redis[(Redis Queues & Cache)]
        S3[(S3 Asset Store - WebP & JSON)]
    end

    subgraph ExternalAPIs ["External Integrations"]
        PlacesAPI["Google Places / Local Search API"]
        VerifyAPI["Email Verification API (Bounceban)"]
        LLMProvider["OpenAI / Anthropic / Gemini APIs"]
        MailServer["Gmail & Microsoft Graph OAuth / SMTP"]
        StripeAPI["Stripe Billing & Subscriptions"]
    end

    %% Client Wiring
    UI <-->|"REST API / JSON"| Gateway
    SSEHub -->|"Live Event Stream (/api/v1/events/stream)"| SSEClient
    Gateway <-->|"Auth & Route"| ServicesLayer
    Gateway -->|"Emit Live Events"| SSEHub

    %% Service to Storage & Queue
    ServicesLayer <-->|"Read/Write Entities"| Postgres
    ServicesLayer <-->|"Cache & Locks"| Redis
    AnalysisSvc -->|"LPUSH crawl:jobs"| Redis
    CampSvc -->|"LPUSH send:jobs"| Redis

    %% Workers to Queue & Storage
    Redis -->|"BRPOP jobs"| CrawlFleet
    Redis -->|"BRPOP jobs"| LLMFleet
    CrawlFleet -->|"Store Screenshots & DOM"| S3
    CrawlFleet <-->|"Grounding Evidence"| LLMFleet
    CronSched <-->|"Poll Approved Sends"| Postgres

    %% External Integrations
    LeadSvc <-->|"Discover Leads"| PlacesAPI
    LeadSvc <-->|"Verify Emails"| VerifyAPI
    LLMFleet <-->|"Generate Scores & Drafts"| LLMProvider
    SendSvc <-->|"Send Outreach"| MailServer
    ReplySvc <-->|"Ingest Inbound Webhooks"| MailServer
    BillingSvc <-->|"Two-Phase Ledger Sync"| StripeAPI
```

---

## 2. Master User Journey & Screen Navigation Flow
How a user navigates through Crawlia's 14 primary screens to go from zero leads to closed sales meetings.

```mermaid
flowchart LR
    subgraph OnboardingFlow ["1. Onboarding & Aha Moment"]
        Start(["User Signup / Login"]) --> OnboardWizard["Onboarding Wizard"]
        OnboardWizard --> ConnectMailbox["Connect Mailbox (OAuth/SMTP)"]
        ConnectMailbox --> QuickAnalyze["Run 1st Standalone Website Audit"]
    end

    subgraph MainWorkspace ["2. Core Workspace & Discovery"]
        QuickAnalyze --> Dashboard["Dashboard / KPI Overview"]
        Dashboard --> Standalone["Standalone Analyzer (/analyze)"]
        Dashboard --> LeadsList["Leads & Prospects List (/leads)"]
        LeadsList --> LeadDetail["Lead Detail View (/leads/id)"]
        LeadsList --> DiscoverModal["Places Lead Discovery Modal"]
        LeadsList --> ImportCSV["CSV Bulk Import & Dedupe"]
    end

    subgraph CampaignExecution ["3. Outreach & Review Loop"]
        LeadsList --> CampList["Campaigns List (/campaigns)"]
        CampList --> CampBuilder["Campaign Wizard (/campaigns/new)"]
        CampBuilder --> ReviewQueue["Draft Review Queue (/review)"]
        ReviewQueue -->|"Approve / Edit / Regenerate"| SchedQueue["Active Sending Queue"]
    end

    subgraph TriageAndManagement ["4. Triage & Administration"]
        SchedQueue --> Calendar["Calendar Scheduling View (/calendar)"]
        SchedQueue --> Inbox["Unified AI Inbox (/inbox)"]
        Inbox -->|"Intent Classified (Meeting Request / Interested)"| DealClosed(["CRM / Deal Won"])
        
        Dashboard --> History["Analysis History (/history)"]
        Dashboard --> Warmup["Email Warmup Health (/warmup)"]
        Dashboard --> Verify["Email Verification Hub (/verify)"]
        Dashboard --> Affiliates["Affiliate & Referrals (/referrals)"]
        Dashboard --> Settings["Settings & Billing (/settings)"]
    end
```

---

## 3. The 5-Stage Website Crawl & AI Audit Flow (Standalone & Bulk)
This diagram illustrates what happens inside Crawlia's backend from the moment a URL is submitted until the final 4-pillar score is produced.

```mermaid
flowchart TB
    Start(["Receive Audit Request (URL + Workspace ID)"]) --> CheckBilling["Billing Service: Check Balance & Lock 1 Credit"]
    
    CheckBilling -->|"Insufficient Balance"| ErrBilling["Return 402 Payment Required Modal"]
    CheckBilling -->|"Credit Locked (2PC)"| QueueJob["Push Job to Redis Queue (crawl:jobs)"]
    
    QueueJob --> Stage1["SSE Stage 1: Queued & Waiting for Worker"]
    Stage1 --> WorkerPull["Headless Chromium Worker Pops Job"]
    
    WorkerPull --> Stage2["SSE Stage 2: Visiting Website in Headless Browser"]
    Stage2 --> LaunchChromium["Launch Chromium & Bypass Cloudflare/Bot Shields"]
    
    LaunchChromium -->|"HTTP 403 / Bot Blocked (after 3 proxies)"| ErrBot["Move to DLQ & REFUND 1 Credit"]
    LaunchChromium -->|"HTTP 404 / 500 Unreachable"| ErrDNS["Mark Failed Unreachable & REFUND 1 Credit"]
    
    LaunchChromium -->|"Page Loaded Successfully"| Stage3["SSE Stage 3: Extracting Web Vitals & SEO Signals"]
    Stage3 --> CaptureAssets["Capture Desktop WebP + Mobile WebP Screenshots"]
    Stage3 --> ParseDOM["Extract Filtered DOM Text + Structured Data + Sitemap"]
    Stage3 --> RunLighthouse["Execute Lighthouse Vitals (LCP, FCP, CLS, TBT)"]
    
    CaptureAssets & ParseDOM & RunLighthouse --> UploadS3["Upload Screenshots & DOM JSON to S3 Bucket"]
    
    UploadS3 --> Stage4["SSE Stage 4: AI Synthesizing Executive Critique"]
    Stage4 --> BuildPrompt["Construct Grounded Prompt with S3 URLs & Metrics"]
    BuildPrompt --> CallLLM["Dispatch to Claude / Gemini LLM Worker"]
    
    CallLLM --> CalcScore["LLM Evaluates 4 Pillars:\nDesign (30%) + SEO (30%) + Speed (25%) + Mobile (15%)"]
    CalcScore --> GenerateHooks["Generate Verifiable Outreach Hooks & Severity Tags"]
    
    GenerateHooks --> Stage5["SSE Stage 5: Completed!"]
    Stage5 --> SaveDB["INSERT INTO analyses (Score, Findings, Assets)"]
    SaveDB --> SettleCredit["Billing Service: Settle Credit Reservation (-1 Credit)"]
    SettleCredit --> End(["Broadcast Complete Payload to UI"])
```

---

## 4. Bulk Campaign Setup & AI Email Generation Flow
How Crawlia automates lead discovery, bulk website auditing, and evidence-grounded email drafting across hundreds of prospects.

```mermaid
flowchart TB
    Start(["User Starts Campaign Builder"]) --> Step1["Step 1: Select Type (Smart Site Audit vs. Manual)"]
    Step1 --> Step2["Step 2: Select or Discover Leads (e.g., 500 Architects in Austin)"]
    
    Step2 --> DedupeEngine["Lead Service: Run Deduplication against Workspace Ledger"]
    DedupeEngine -->|"480 Unique / 20 Duplicates Skipped"| Step3["Step 3: Define Writing Style Rules & Tone"]
    
    Step3 --> Step4["Step 4: Select Mailboxes & Schedule Windows"]
    Step4 --> BudgetEst["Billing Service: Calculate Campaign Budget\n(480 Audits * 1 + 480 Drafts * 0.5 = 720 Credits)"]
    
    BudgetEst --> LockBudget["Two-Phase Commit: Lock 720 Credits in Ledger"]
    LockBudget --> Launch["Launch Campaign (Status: processing)"]
    
    Launch --> BatchQueue["Dispatch 480 Audit Jobs to Worker Fleet"]
    
    subgraph ParallelWorkerFleet ["Async Fleet Processing (Concurrency Capped)"]
        AuditWorker["Worker Fleet Executes 480 Website Audits"]
        AuditWorker -->|"470 Success / 10 Offline Sites"| DraftEngine["AI Writing Engine (LLM Worker)"]
        
        DraftEngine --> PromptGrounding["Ground LLM Prompt in Verified DOM Evidence\n(No Generic Compliments / No Hallucinations)"]
        PromptGrounding --> WriteDraft["Generate Personalized Subject & Body with Citation Tags"]
        WriteDraft --> SaveDraft["Save to email_drafts & Set Status: review_pending"]
    end
    
    SaveDraft --> UpdateProgress["Broadcast Live Progress via SSE (470/480 Ready)"]
    UpdateProgress --> FinalSettle["Billing Settlement: Charge 705 Credits / Refund 15 Credits"]
    FinalSettle --> NotifyUser["Notification Bell: '470 Drafts Ready for Review'"]
    NotifyUser --> ReviewScreen["User Opens Draft Review Queue"]
```

---

## 5. Smart Sending, Mailbox Rotation & Warmup Flow
The minute-by-minute execution cycle that ensures high deliverability, domain protection, and automated tracking.

```mermaid
flowchart TB
    Start(["Cron Scheduler Tick (Every 1 Minute)"]) --> QueryDB["Query DB for Approved Leads in Active Campaign Windows"]
    
    QueryDB -->|"No Eligible Leads"| Sleep(["Sleep Until Next Tick"])
    QueryDB -->|"Batch of Eligible Leads Found"| CheckHealth["Mailbox Service: Evaluate Workspace Mailbox Health"]
    
    subgraph HealthValidation ["Mailbox Health & Safety Check"]
        CheckHealth --> CheckDNS["Verify SPF, DKIM & DMARC Records OK"]
        CheckDNS --> CheckCap["Check Daily Send Cap (e.g., 34 / 50 sent today)"]
        CheckCap --> CheckWarmup["Verify Warmup Status & Throttle Limits"]
    end
    
    CheckWarmup -->|"Mailbox Throttled / Cap Reached / DNS Error"| DeferSend["Defer Send to Next Window (No Email Sent)"]
    CheckWarmup -->|"Mailbox Healthy & Cap Available"| AcquireLock["Acquire Atomic Lock on Mailbox ID"]
    
    AcquireLock --> InjectTracking["Inject Custom Tracking Domain Links & Open Pixel"]
    InjectTracking --> ExecuteSMTP["Dispatch via Gmail OAuth / Microsoft Graph / SMTP API"]
    
    ExecuteSMTP -->|"SMTP 5xx / Hard Bounce"| HandleBounce["Mark Lead Status: bounced & Log Error"]
    ExecuteSMTP -->|"250 Message Accepted"| LogSend["INSERT INTO sends (message_id, timestamp)"]
    
    LogSend --> UpdateLead["UPDATE campaign_leads SET status = 'contacted'"]
    UpdateLead --> IncrementBalance["SSE Broadcast: Increment Live Sent Counter ⚡"]
    
    IncrementBalance --> ScheduleFollowup["Calculate Day Offset for Follow-up Step #2"]
    ScheduleFollowup --> End(["Wait for Reply or Next Scheduled Follow-up Date"])
```

---

## 6. Inbound Reply Ingestion & Intent Triage Flow
How Crawlia closes the outbound loop by ingesting replies, stopping follow-ups immediately, and categorizing prospect intent.

```mermaid
flowchart TB
    Prospect(["Prospect Replies to Email"]) --> MailServer["Gmail / Outlook Mail Server Receives Message"]
    MailServer --> Webhook["Push Webhook to API Gateway (/api/v1/webhooks/inbound)"]
    
    Webhook --> VerifySig["Reply Service: Verify Webhook Signature & Authenticity"]
    VerifySig --> MatchThread["Match In-Reply-To Header & Email Address against Database"]
    
    MatchThread -->|"No Match Found"| Ignore(["Log Unmatched Webhook & Ignore"])
    MatchThread -->|"Match Found (Lead ID + Campaign ID)"| CancelFollowups["CRITICAL ACTION:\nIMMEDIATELY CANCEL ALL PENDING FOLLOW-UP STEPS\n(SET campaign_leads.status = 'replied')"]
    
    CancelFollowups --> DispatchLLM["Dispatch Reply Text + Original Outreach Context to LLM Classifier"]
    
    subgraph IntentTaxonomy ["LLM Intent Classification Engine"]
        DispatchLLM --> Classify["Classify into Taxonomy & Calculate Confidence Score"]
        Classify -->|"High Intent / Demo"| IntentYes["Intent: interested / meeting_request"]
        Classify -->|"Rejection"| IntentNo["Intent: not_interested"]
        Classify -->|"Auto-Reply"| IntentOOO["Intent: out_of_office"]
        Classify -->|"Unsubscribe Request"| IntentUnsub["Intent: unsubscribe"]
    end
    
    IntentYes --> UpdateCRM["Set Lead Status: replied_interested\nMove to CRM Stage: Demo Requested"]
    IntentNo --> ArchiveLead["Set Lead Status: replied_not_interested\nArchive Lead"]
    IntentOOO --> PauseTemp["Pause Campaign Lead & Schedule Resume Date"]
    IntentUnsub --> SuppressGlobal["Add Prospect Email & Domain to Workspace Suppression List"]
    
    UpdateCRM & ArchiveLead & PauseTemp & SuppressGlobal --> SaveReply["INSERT INTO replies (intent, confidence, raw_content)"]
    SaveReply --> PushUI["SSE Broadcast: Increment Unread Inbox Badge +1"]
    PushUI --> RingBell["Notification Bell Alert:\n'🔥 High Intent Reply from Sarah at Relay Studio!'"]
    RingBell --> End(["User Opens Unified Inbox to Respond"])
```

---

## 7. Two-Phase Commit (2PC) Credit Ledger & Refund Flow
How Crawlia manages credit balances atomically in Postgres and Redis without negative balances or race conditions.

```mermaid
flowchart TB
    Start(["User Initiates Paid Action (e.g., 500 Audits)"]) --> CalcCost["Calculate Required Credits (500 Credits)"]
    CalcCost --> CheckRedis["Check Redis Available Balance (e.g., 1,200 Credits Available)"]
    
    CheckRedis -->|"Balance < Required (e.g., only 300 left)"| Return402["Return 402 Payment Required & Prompt Upgrade"]
    CheckRedis -->|"Balance >= Required"| Phase1["PHASE 1: RESERVE CREDITS (LOCK)"]
    
    subgraph ReservationPhase ["Atomic Ledger Reservation"]
        Phase1 --> WriteLedgerLock["INSERT INTO workspace_credits_ledger\n(type: 'reservation', amount: -500, status: 'locked')"]
        WriteLedgerLock --> DeductAvailable["Redis Atomic Decrement: Available Balance = 700\n(Total Balance Remains 1,200 until settlement)"]
    end
    
    DeductAvailable --> DispatchJobs["Dispatch 500 Jobs to Async Worker Fleet"]
    
    subgraph ExecutionPhase ["Job Execution Results"]
        DispatchJobs --> WorkerResults["Workers Process 500 Website Audits"]
        WorkerResults -->|"485 Successful Audits"| SuccessCount["Success Count: 485"]
        WorkerResults -->|"15 Unreachable / Parked / Bot-Blocked"| FailCount["Failed Count: 15"]
    end
    
    SuccessCount & FailCount --> Phase2["PHASE 2: SETTLEMENT & REFUND"]
    
    subgraph SettlementPhase ["Atomic Settlement Transaction"]
        Phase2 --> UpdateReservation["UPDATE ledger SET status = 'settled' WHERE lock_id = X"]
        UpdateReservation --> WriteDebit["INSERT INTO ledger\n(type: 'usage_charge', amount: -485, status: 'settled')"]
        WriteDebit --> WriteRefund["INSERT INTO ledger\n(type: 'refund_unreachable', amount: +15, status: 'settled')"]
        WriteRefund --> FinalizeRedis["Redis Atomic Sync:\nAvailable Balance = 715 | Total Balance = 715"]
    end
    
    FinalizeRedis --> SSEBalance["SSE Broadcast to UI Header: ⚡ 715 Credits"]
    SSEBalance --> End(["Transaction Complete"])
```
