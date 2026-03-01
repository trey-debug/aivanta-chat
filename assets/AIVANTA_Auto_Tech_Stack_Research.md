# AIVANTA Automations — Automotive Shop Tech Stack
## Integration Research & Automation Opportunity Map

**Prepared by:** Trey Davidson, Founder & CDO  
**Organization:** AIVANTA Automations, LLC  
**Date:** February 2026  
**Classification:** Internal Strategic Document — Confidential

---

## Purpose

This document maps the complete technology ecosystem that independent automotive repair shops use across their operations — from shop management systems and diagnostic tools to DVI platforms, CRM/marketing automation, and parts procurement. For each platform, it documents the integration pathway available (Full API, Webhook, Partial, or Workaround), the automation opportunities AIVANTA can exploit, and a strategic priority ranking for service packaging.

---

## 1. Executive Summary

The average independent auto repair shop uses 5–8 separate software platforms to run their business. Most of these platforms either don't talk to each other at all, or require expensive custom development to connect. This creates exactly the integration gap AIVANTA is built to fill.

Our research identifies **21 platforms across 6 categories**. The headline finding: Tekmetric, Shopmonkey, and CDK Global — covering the full spectrum from independent shops to franchised dealer service centers — all offer robust REST APIs with event-driven capabilities, making them the ideal anchor for AIVANTA automation workflows.

> **KEY INSIGHT:** Tekmetric's open REST API + custom webhooks means AIVANTA can build event-driven automations that trigger on any repair order activity — estimate sent, approval received, job complete, invoice paid — without any screen scraping or manual workarounds.

### Integration Landscape at a Glance

| Category | # Platforms | API/Webhook Available | Top AIVANTA Opportunity |
|---|---|---|---|
| Shop Management Systems (SMS) | 7 | 4 of 7 (Tekmetric, Shopmonkey, Shop-Ware, CDK Global via Fortellis) | Trigger automations on RO events; sync customer & vehicle data; CDK opens dealer market |
| Diagnostic & Repair Info | 3 | 1 of 3 partial (Mitchell1 ProDemand) | AI-assisted diagnostic lookup; declined service tracking |
| Digital Vehicle Inspection (DVI) | 3 | 1 of 3 (myKaarma) | Auto-send inspection results; follow up on declined items |
| CRM & Marketing Automation | 4 | 2 of 4 (Steer, custom via webhook) | Lapsed customer re-engagement; review generation campaigns |
| Parts Procurement | 2 | 2 of 2 (PartsTech, Nexpart) | Auto-populate ROs; backorder alerts; predictive ordering |
| Accounting & Payments | 2 | 2 of 2 (QuickBooks, Stripe/Square) | Automated invoicing; overdue follow-up; financial dashboards |

---

## 2. Shop Management Systems (SMS)

The SMS is the central nervous system of any repair shop. It is where repair orders are created, estimates built, jobs tracked, and invoices generated. Every AIVANTA automation should start here — these platforms are the richest source of trigger events and customer data.

---

### 2.1 Tekmetric

| Attribute | Detail |
|---|---|
| Integration Type | Full REST API + Custom Webhooks (Best-in-class for automation) |
| API Docs | api.tekmetric.com — public REST API, OAuth authentication |
| Webhook Events | RO created, estimate sent, job approved, job complete, invoice paid, customer updated |
| Native Integrations | 70+ including QuickBooks, PartsTech, Slack, Advance Auto, AutoVitals, MyShopManager, Kukui |
| Market Position | Fastest-growing cloud SMS; preferred by progressive shops ($750K–$5M revenue) |
| Pricing | Custom; cloud-based, per-location subscription |

**AIVANTA Automation Opportunities:**
- **Lapsed Customer Re-engagement:** Webhook fires when customer RO closes → AI checks vehicle service history → if customer hasn't returned in 6+ months, trigger SMS/email campaign with next service recommendation
- **Declined Services Follow-Up:** When advisor marks a job as 'declined' on RO → auto-log to follow-up queue → send customer educational message + re-offer in 30/60/90 days with seasonal hooks
- **Estimate Approval Acceleration:** Estimate sent event → if no response in 4 hours → AI sends personalized follow-up text with video link from myKaarma inspection
- **Review Generation:** Invoice paid event → 2-hour delay → automated Google Review request via SMS with vehicle/service context ('How did we do on your BMW 3-series brake service?')
- **Owner Dashboard Automation:** Pull Tekmetric reporting data nightly → AI generates weekly shop performance summary → delivered to owner's phone via SMS or Slack by 8am Monday

> **PRIORITY: ⭐⭐⭐ CRITICAL** — Tekmetric is AIVANTA's primary integration target. Build all core automations around the Tekmetric webhook system first. Many shops upgrading to Tekmetric are specifically looking for better automation — position AIVANTA as the missing automation layer.

---

### 2.2 Shopmonkey

| Attribute | Detail |
|---|---|
| Integration Type | Full REST API + Webhooks (Developer portal: shopmonkey.dev) |
| API Docs | developer.shopmonkey.io — full API reference, OAuth 2.0 |
| Webhook Events | Calendar appointments, invoices, work orders, customer records |
| Native Integrations | PartsTech, Nexpart, RepairLink, QuickBooks Online |
| Market Position | Cloud-native SMS popular with tech-forward independent shops |
| Pricing | Tiered subscription model; Clever level and above includes QuickBooks sync |

**AIVANTA Automation Opportunities:**
- **Appointment Confirmation Flows:** New appointment webhook → AI-personalized confirmation text → 24-hour reminder → 2-hour reminder with directions
- **No-Show Recovery:** Appointment status missed event → automated re-booking text sent within 30 min → if no response in 24hrs, calls queue for human follow-up
- **Post-Service Surveys:** Invoice closed event → send 3-question satisfaction survey via SMS → auto-flag negative responses for owner review
- **Slow Day Campaign Trigger:** Monitor appointment calendar daily → if tomorrow has 3+ open bays → AI generates last-minute campaign offer → sends to lapsed customer segment

> **PRIORITY: ⭐⭐⭐ CRITICAL** — Shopmonkey is the #2 choice for cloud-first shops. Build automation workflows that are fully compatible with both Tekmetric and Shopmonkey; this doubles the addressable market.

---

### 2.3 Shop-Ware

| Attribute | Detail |
|---|---|
| Integration Type | REST API (partner program; api.shop-ware.com) |
| API Docs | Partner integration program — apply for API access |
| Webhook Events | Work order updates, technician dispatching, customer communication events |
| Native Integrations | AutoVitals DVI (deep V2 integration), PartsTech, QuickBooks |
| Market Position | High-end cloud SMS loved by performance shops; Apple-esque UI philosophy |

**AIVANTA Automation Opportunities:**
- Works identically to Tekmetric/Shopmonkey automation patterns — all core AIVANTA automations should be SMS-agnostic via webhook layer
- Deep AutoVitals integration means DVI data flows into Shop-Ware natively — AIVANTA can read declined DVI items and trigger targeted follow-ups

> **PRIORITY: ⭐⭐ HIGH** — Requires partner program application.

---

### 2.4 CDK Global (CDK Drive DMS)

| Attribute | Detail |
|---|---|
| Integration Type | Full REST API + Async Event-Driven APIs — accessed exclusively via Fortellis platform |
| API Platform | Fortellis Automotive Commerce Exchange™ (fortellis.io) — CDK's developer marketplace |
| API Coverage | Repair Order (full lifecycle CRUD), Customers, Vehicles, Appointments, Parts, F&I, Payments, Workshop Management, CRM (Elead) |
| Async APIs | Event-driven APIs using OpenAPI Async spec — Repair Order status updates, Appointment changes, Parts Inventory — real-time push, not polling |
| Authentication | OAuth 2.0 via Fortellis; developers register as ISV (Independent Software Vendor) on Fortellis Developer Network |
| Access Model | Pay-as-you-go API pricing via Fortellis Marketplace; dealer must subscribe to your app AND grant consent for data access |
| Market Position | Dominant DMS for franchised dealerships and dealer groups (30,000+ locations globally); NOT typically used by small independent shops |
| Notable Partners | Xtime (Cox Automotive), myKaarma, GoMoto, Microsoft Power Platform (native connector) |
| Key Constraint | Access requires developer registration on Fortellis AND dealer-level consent/subscription |

**CDK Fortellis API Coverage — Service Department Relevant Endpoints:**

| API | What It Enables | AIVANTA Use Case |
|---|---|---|
| CDK Drive Repair Order V2 | Full RO lifecycle: create, read, update, monitor status | Trigger AIVANTA automations on RO events identical to Tekmetric |
| CDK Drive Repair Order Async | Real-time event push for RO status changes (no polling required) | Best-in-class trigger mechanism — RO event fires → AIVANTA receives instantly |
| CDK Drive Appointment Async | Real-time appointment booking and update events | Appointment confirmation, reminder, and no-show re-booking automations |
| CDK Drive Customer API | Read/write customer records linked to ROs and vehicles | Customer profile enrichment; sync to AIVANTA AI segmentation layer |
| CDK Drive Vehicle API | Vehicle data including service history and VIN-linked records | Predictive service triggers based on vehicle age, mileage, service history |
| CDK Elead CRM APIs | Sales opportunities, activities, customer interactions | Sales follow-up automation for dealer service centers |
| CDK Payment Settling API | Update DMS with external payment results; query payment status | Payment received → trigger review request + thank-you sequence |

**AIVANTA Automation Opportunities:**
- All five core AIVANTA automations apply identically — CDK's Fortellis APIs provide the same trigger events as Tekmetric webhooks, through a different access model
- Async API advantage: CDK's event-driven APIs are more scalable than polling-based REST — real-time RO events without hitting rate limits
- Dealer service center expansion play: CDK shops are franchised dealers (Toyota, BMW, Ford service departments) — this is AIVANTA's pathway into the dealer market, a higher-revenue tier
- myKaarma bridge: myKaarma already integrates with CDK Drive — AIVANTA can leverage this existing connection

> **⚠️ ACCESS MODEL DIFFERENCE:** CDK via Fortellis is NOT self-serve like Tekmetric's API. You must (1) register as an ISV on fortellis.io, (2) build and certify your app, (3) list it in the Fortellis Marketplace, and (4) each dealer subscribes and grants consent. This is a structured partner program — but CDK provides validation and marketplace distribution as part of the deal.

> **STRATEGIC NOTE:** CDK is AIVANTA's bridge to franchised dealer service centers — a significantly larger revenue tier. An independent shop might pay $1,500/mo. A Toyota dealer handling 400+ ROs/month could justify $3,000–$5,000/mo. Registering on Fortellis opens this entire market segment. Recommend pursuing Fortellis ISV registration in **Phase 2 development**.

> **PRIORITY: ⭐⭐⭐ HIGH** — Dealer market expansion.

---

### 2.5 Mitchell1 Manager SE

| Attribute | Detail |
|---|---|
| Integration Type | LIMITED — On-premise software; no native webhook/REST API for automation |
| Integration Options | Export customer lists to CSV; Accounting Link for QuickBooks; SocialCRM for marketing |
| API Notes | Mitchell1 offers a 'data integration inquiry' form for approved partners — not self-serve |
| Native Integrations | ProDemand repair info (pass-through), PartsTech, QuickBooks Accounting Link |
| Market Position | Veteran choice; still widely used by established shops (10+ years on platform) |

**AIVANTA Workaround Strategies:**
- Scheduled data sync: Use Mitchell1's export functions on a daily/weekly schedule → AIVANTA reads CSV → processes customer list through automation pipeline
- SocialCRM bypass: Mitchell1's own SocialCRM handles basic follow-up — AIVANTA pitch is to replace SocialCRM with superior AI-driven messaging
- Migration opportunity: Shops still on Mitchell1 are prime candidates for Tekmetric/Shopmonkey upgrade — AIVANTA can frame the SMS migration as part of the automation package

> **STRATEGY:** For Mitchell1 shops, position the SMS upgrade (to Tekmetric or Shopmonkey) as the **first step** in the AIVANTA engagement. The data migration pays for itself in automation ROI.

> **PRIORITY: ⭐ LOW** — Recommend upgrade path.

---

### 2.6 AutoLeap

| Attribute | Detail |
|---|---|
| Integration Type | NO public API — integrations are all native/built-in partnerships |
| Native Integrations | QuickBooks Online, Mitchell1 ProDemand, CARFAX, PartsTech, RepairLink, Nexpart, TireHub |
| Market Position | Fastest-growing SMS by user ratings (4.9/5 on major review sites) |

**AIVANTA Automation Opportunities:**
- Position AIVANTA as the AI intelligence layer on top of AutoLeap's native automation — handling complex scenarios AutoLeap can't: lapsed customer analysis, predictive service recommendations, owner business intelligence
- Customer list export → AIVANTA AI segments and re-engages outside the platform

> **PRIORITY: ⭐ MEDIUM** — Workaround via data sync.

---

### 2.7 Identifix ShopCentral (by Solera)

| Attribute | Detail |
|---|---|
| Integration Type | NO public API for ShopCentral |
| Native Integrations | AutoVitals, Broadly (reviews), QuickBooks Enterprise, Steer CRM, Kukui, PartsTech |
| Parent Company | Solera — enterprise platform; launched AI-powered ShopCentral (Nov 2025) |

> **NOTE:** Identifix is primarily a diagnostic information tool (3M+ confirmed fixes database), not a shop management system. AIVANTA automation hooks into the SMS, not Identifix directly.

> **PRIORITY: ⭐ LOW**

---

## 3. Diagnostic & Repair Information Platforms

These tools are used by technicians to diagnose problems and look up repair procedures. They are read-only information resources — not transactional platforms — so direct automation integration is limited. However, understanding what shops pay for here helps AIVANTA frame the AI diagnostic assistant upsell.

| Platform | Integration Type | What It Does | AIVANTA Opportunity |
|---|---|---|---|
| Identifix Direct-Hit® (Solera) | NONE (No public API) | 3M+ technician-confirmed fixes; wiring diagrams; live tech hotline. Most shops pay $100–$200/mo. | AIVANTA AI serves as first-pass diagnostic assistant, cross-referencing common fixes BEFORE tech reaches for Identifix — demonstrating value and reducing subscription dependency. |
| ALLDATA (AutoZone) | LIMITED (partner inquiry only) | OEM repair information, wiring diagrams, technical service bulletins (TSBs). Industry standard for older vehicles. | AI pre-screening of common TSBs reduces tech time hunting. ALLDATA integration requires enterprise partnership with AutoZone. |
| Mitchell1 ProDemand | PARTIAL API (Web Intent / TAPE) | OEM repair info, SureTrack real-world fixes, estimating, labor times. Integrates with SMS via pass-through. | ProDemand's 'Web Intent' API allows passing VIN/YMM data to launch ProDemand lookup — useful for AI workflow where VIN triggers auto-research into common failure patterns for that specific vehicle. |

> **STRATEGIC NOTE:** Shops pay $300–$500/month collectively for Identifix + ALLDATA + ProDemand. An AIVANTA AI diagnostic assistant that surfaces common fixes and TSBs instantly — layered on top of the shop's existing SMS vehicle history — represents a compelling ROI story and potential upsell.

---

## 4. Digital Vehicle Inspection (DVI) Platforms

DVI tools allow technicians to document vehicle condition with photos and videos, then send inspection reports to customers for work approval. These platforms directly impact ARO (Average Repair Order) because customers who see visual evidence of a problem approve more work. They are a critical source of 'declined work' data that AIVANTA can mine for follow-up automation.

---

### 4.1 myKaarma

| Attribute | Detail |
|---|---|
| Integration Type | Full REST API (api.mykaarma.com; docs.mykaarma.com) |
| API Coverage | Video Walkaround API (RESTful), Inspection API — full read/write access |
| Key Events | Inspection completed, video uploaded, customer viewed inspection, work approved/declined |
| Platform | Primarily used at dealerships; growing in independent shop market |
| Native Integrations | DMS integrations; UVeye AI inspection partnership; CDK Global |

**AIVANTA Automation Opportunities:**
- **Inspection Video Follow-Up:** Webhook triggers when tech completes video walkaround → API pulls inspection link → auto-sends personalized text: 'Your tech just finished your inspection — click here to see exactly what we found on your [Year/Make/Model]'
- **Declined Work Mining:** After RO closes, query myKaarma API for all declined inspection items → add to AIVANTA 'declined services' follow-up queue → trigger re-engagement at 30/60/90 day intervals with educational content about each declined item
- **Approval Acceleration:** Customer receives inspection link but hasn't opened after 2 hours → AIVANTA triggers follow-up text
- **UVeye AI Integration:** myKaarma + UVeye partnership means shops get automated AI inspection reports → AIVANTA can route those reports into customer communication flows automatically

> **PRIORITY: ⭐⭐⭐ CRITICAL** — myKaarma has a public API and video inspection is the #1 trust-building tool for shops. An automation that instantly sends inspection videos to customers (rather than waiting for the advisor to manually share) is a simple, high-impact workflow.

---

### 4.2 AutoVitals

| Attribute | Detail |
|---|---|
| Integration Type | NO public API (confirmed by multiple sources) |
| Native Integrations | Deep integration with NAPA TRACS, Shop-Ware, Tekmetric, Protractor, and 10+ other SMS |
| Market Position | Market leader for independent shop DVI; used by Meineke, 1-800 franchises |

**AIVANTA Strategy with AutoVitals Shops:**
- Integration path: AutoVitals writes data back to the SMS (Tekmetric, Shop-Ware, etc.) → AIVANTA reads from SMS via its API → no need to integrate with AutoVitals directly
- Positioning: *"AutoVitals does the inspection. AIVANTA does the intelligence."* Frame as complementary, not competitive.

> **PRIORITY: ⭐⭐ HIGH** — Via SMS passthrough.

---

### 4.3 SMS-Native DVI (Tekmetric, Shopmonkey, AutoLeap)

Many shops use DVI features built directly into their SMS rather than a standalone tool.

**AIVANTA Automation Opportunities:**
- All DVI data from Tekmetric/Shopmonkey DVI is accessible via the SMS API — same webhook/API approach applies
- Auto-detection: When a tech adds photos to an estimate in Tekmetric, trigger customer notification immediately rather than waiting for advisor action
- Declined item tracking is native in the SMS data model — no separate DVI tool needed for core AIVANTA workflows

---

## 5. CRM & Marketing Automation Platforms

This is the category where AIVANTA competes most directly. Existing CRM tools for shops are generic, template-based, and lack AI intelligence. They send the same oil change reminder to every customer on a schedule. AIVANTA's AI automation personalizes messaging based on actual vehicle data, service history, and customer behavior.

### 5.1 Competitive Landscape

| Platform | Type | Integration | Monthly Cost | AIVANTA Advantage |
|---|---|---|---|---|
| MyShopManager (Bolton Tech) | Marketing automation + DVI + texting | Integrates with most SMS via data sync; no public API | $200–$400/mo | AIVANTA replaces MyShopManager with AI-personalized messaging. Bolton acquisition hurt product quality per reviews. |
| Steer CRM | Booking, texting, reviews, reminders | REST API available; integrates with Tekmetric, Mitchell1, NAPA TRACS | $200–$350/mo | AIVANTA can supplement or replace Steer — especially for lapsed customer AI and business intelligence. |
| Kukui | Website + marketing + CRM | API access via partner program; native Tekmetric integration | $300–$600/mo | Kukui is primarily a website/SEO platform — AIVANTA is the automation layer Kukui lacks. |
| AutoVitals CRM | Retention + DVI + workflow bundled | No public API; reads from SMS | Bundled with DVI | AutoVitals CRM handles basics — AIVANTA handles AI-driven intelligence and complex re-engagement flows. |

---

### 5.2 Steer CRM (Integration Detail)

| Attribute | Detail |
|---|---|
| Integration Type | REST API available; webhook support for key events |
| Native Integrations | Tekmetric, Mitchell1, NAPA TRACS, AutoLeap, Shop Boss |
| Key Features | Online booking (AutoOps), text/email follow-ups, review requests, call tracking, campaign manager |
| Market Position | Gaining momentum with multi-location shops (26+ Grease Monkey locations) |

**AIVANTA + Steer Partnership Opportunity:**
- Rather than competing with Steer directly, consider a white-label or co-sell arrangement: AIVANTA provides the AI intelligence/content generation layer, Steer provides the delivery infrastructure
- Differentiation angle: *"Steer sends the message. AIVANTA decides what to say and when."*

> **PRIORITY: ⭐⭐ HIGH** — Partnership opportunity.

---

## 6. Parts Procurement Platforms

Parts procurement is one of the largest time-wasters in a repair shop. Advisors spend 15–30 minutes per RO calling different suppliers to check availability and price.

| Platform | Integration Type | API Details | AIVANTA Opportunity |
|---|---|---|---|
| PartsTech | FULL API (punchout + full catalog API) | Partner API program — 35+ SMS integrations; REST API for parts lookup, pricing, ordering. Free account + API key. | AI-powered predictive ordering: analyze RO history by vehicle type → pre-identify parts likely needed → surface them to advisor before they start estimate. Backorder alert automation when ordered part is unavailable. |
| Nexpart (UAP/NAPA) | API available via partner program | Similar to PartsTech — parts search and ordering API. Used natively in AutoLeap, Shop-Ware, Shopmonkey. | Same predictive ordering opportunity. Nexpart is the primary supplier API for NAPA-aligned shops. |

> **AUTOMATION IDEA: 'Warranty Reminder Automation'** — When a customer returns to the shop, query PartsTech order history for parts installed 6–12 months ago → AI checks if any have known early failure rates or active warranties → advisor is automatically notified before the customer even walks in.

---

## 7. Accounting & Payment Platforms

| Platform | Integration Type | AIVANTA Opportunity |
|---|---|---|
| QuickBooks Online | Full API + Webhooks (Intuit Developer Platform; OAuth 2.0) | Auto-sync invoices from SMS to QB on close. Weekly financial summary AI report delivered to owner. Flag P&L anomalies (parts cost spike, labor efficiency drop) with AI-generated explanation. |
| Stripe / Square | Full REST API + Webhooks | Payment received webhook → auto-trigger thank-you message + review request. Failed payment → auto-follow-up sequence. Integrate with owner dashboard for real-time cash flow visibility. |
| AutoLeap Payments (Worldpay) | Via AutoLeap native (no standalone API) | Accessible through AutoLeap's reporting exports. Feed into AIVANTA dashboard via scheduled data pull. |

---

## 8. Automation Opportunity Matrix

This matrix maps the five core AIVANTA automations to the specific integration paths required to build them.

| AIVANTA Automation | Primary Integration | Secondary Integration | Trigger Event | n8n Workflow Complexity | Priority |
|---|---|---|---|---|---|
| Lapsed Customer Re-engagement (Core Offer #1) | Tekmetric API / Shopmonkey API | Twilio SMS / Sendgrid Email | Customer last visit > 90 days (scheduled daily check) | Medium — scheduled query + AI message generation + send | **P0** |
| Declined Services Follow-Up (Core Offer #2) | Tekmetric Webhook (RO close event) | myKaarma API (inspection items) | Job marked 'declined' on repair order | Medium — webhook → AI categorize service → queue drip sequence | **P0** |
| Appointment Reminder + Confirmation (Core Offer #3) | Tekmetric/Shopmonkey calendar API | Twilio SMS | Appointment created or 24hr/2hr before appointment | Low — time-based triggers, no AI needed | **P0** |
| Review Generation (Core Offer #4) | Tekmetric Webhook (invoice paid) | Google My Business API / Birdeye | Invoice marked paid | Low — webhook + 2hr delay + personalized SMS send | **P0** |
| AI Owner Dashboard (Upsell #1 — $500 + $97/mo) | Tekmetric API + QuickBooks API | AI analysis layer (Claude/GPT) | Nightly scheduled data pull | High — multi-source aggregation + AI analysis + formatted delivery | **P1** |
| Predictive Vehicle Service Reminders (Differentiator) | Tekmetric API (vehicle history) | CARFAX / PartsTech API | Mileage-based trigger or time since last service type | High — AI reasoning on service history + predictive model | **P1** |
| Warranty Hold Time Reduction (Pain Point #1) | Tekmetric API (parts on RO) | PartsTech API (order status) | Part ordered, tracks until confirmed in-shop | Medium — parts order status polling + customer ETA updates | **P1** |
| Slow Day Fill Campaign (Bonus Automation) | Tekmetric/Shopmonkey calendar API | Twilio SMS | Daily 6am: if tomorrow has open bays → trigger | Medium — calendar analysis + AI offer generation + broadcast send | **P2** |

---

## 9. Integration Tier Summary

Use this tiered classification when scoping automation packages for client onboarding.

| Tier | Shop Profile | Primary SMS | Integration Path | AIVANTA Deployment |
|---|---|---|---|---|
| **Tier 1** | Modern cloud SMS, actively using Tekmetric or Shopmonkey | Tekmetric / Shopmonkey | REST API + Webhooks — no barriers, go live in 24hrs | Full 5-automation package on day one. Zero manual data entry required. |
| **Tier 2** | Cloud SMS with partial API (Shop-Ware, AutoLeap) | Shop-Ware / AutoLeap | API/partner program access + native integrations only | Core automations (lapsed customers, reviews) day one. Advanced features after API access granted. |
| **Tier 3** | Legacy on-premise SMS (Mitchell1, older systems) | Mitchell1 Manager SE | CSV export + manual data sync only | Start with Mitchell1 SocialCRM replacement pitch. Recommend SMS upgrade as condition for full package. |

> **SALES INSIGHT:** When prospecting, ask *"What software are you using to manage your shop?"* before quoting. A Tekmetric shop gets your full pitch — same day automation. A Mitchell1 shop needs the *"we'll upgrade your whole system"* conversation first.

---

## 10. Implementation Playbook

### Phase 1: Core Integration Build (Weeks 1–4)
- Set up Tekmetric developer account and test webhook receiver in n8n
- Build 4 core event handlers: RO opened, estimate sent, job declined, invoice paid
- Connect Twilio for SMS delivery and Sendgrid for email delivery
- Build lapsed customer scheduler: daily Tekmetric API query → AI message generation → send queue
- Test with AIVANTA internal demo shop account

### Phase 2: DVI & Parts Integration (Weeks 5–8)
- Integrate myKaarma API: pull inspection results, declined items, video links
- Connect PartsTech API: parts order status monitoring, backorder alerts
- Build declined services drip sequence: 30/60/90 day follow-up with educational content
- Add Google My Business API for review generation automation
- CDK Global / Fortellis ISV registration — begin certification process to unlock dealer service center market

### Phase 3: Intelligence Layer (Weeks 9–12)
- Build AI owner dashboard: nightly Tekmetric + QuickBooks data aggregation → AI report → SMS/email delivery
- Implement predictive service recommendation engine using vehicle history + CARFAX data
- Create Shopmonkey variant of all Phase 1 automations (parallel SMS compatibility)
- Build client onboarding template library for rapid deployment (Tier 1, 2, 3 templates)

> **DEVELOPMENT NOTE:** All workflows should be built as modular n8n workflows that can be toggled on/off per client. Each automation should have its own workflow file so individual modules can be sold separately (upsell stack) or bundled in the core package.

---

## 11. Data Flow Architecture

All customer and vehicle data originates in the shop's SMS — AIVANTA reads it via API and orchestrates all downstream actions without modifying the shop's core data.

| Data Layer | Source | AIVANTA Action | Destination |
|---|---|---|---|
| Customer Data | SMS (Tekmetric / Shopmonkey) | Read via API; store in AIVANTA CRM layer | AI segmentation engine |
| Vehicle Service History | SMS repair order history | Query via API on trigger events | AI recommendation engine |
| Inspection Results | myKaarma API / SMS-native DVI | Pull on RO close event | Declined services follow-up queue |
| Appointment Calendar | SMS calendar API | Daily query; monitor fill rate | Slow-day campaign trigger |
| Invoice & Payment Data | SMS invoice events + QuickBooks | Webhook triggers on payment | Review request queue + owner dashboard |
| Parts Order Status | PartsTech / Nexpart API | Poll on open orders | Customer ETA updates; advisor alerts |
| AI-Generated Messages | Claude/OpenAI via AIVANTA | Generate personalized content | Twilio SMS / Sendgrid Email / GBP Review link |
| Performance Reports | All sources aggregated | Nightly AI analysis | Owner dashboard (SMS/email/Slack) |

---

## 12. Quick Reference — Full Platform Integration Status

| Platform | Category | API Status | Webhook | AIVANTA Priority |
|---|---|---|---|---|
| Tekmetric | Shop Management | ✅ Full REST API | ✅ Yes | ⭐⭐⭐ CRITICAL |
| Shopmonkey | Shop Management | ✅ Full REST API | ✅ Yes | ⭐⭐⭐ CRITICAL |
| Shop-Ware | Shop Management | ✅ Partner API | ✅ Yes | ⭐⭐ HIGH |
| CDK Global (Drive DMS) | Shop Management / Dealer DMS | ✅ Full REST + Async APIs (via Fortellis) | ✅ Yes (Async event-driven) | ⭐⭐⭐ HIGH — Dealer market expansion |
| AutoLeap | Shop Management | ❌ No public API | ❌ No | ⭐ MEDIUM (workaround) |
| Mitchell1 Manager SE | Shop Management | ❌ No (partner inquiry) | ❌ No | ⭐ LOW (recommend upgrade) |
| Identifix ShopCentral | Shop Management | ❌ No public API | ❌ No | ⭐ LOW |
| myKaarma | DVI / Video Inspection | ✅ Full REST API | ✅ Yes | ⭐⭐⭐ CRITICAL |
| AutoVitals | DVI / Workflow | ❌ No public API | ❌ No | ⭐⭐ HIGH (via SMS passthrough) |
| Mitchell1 ProDemand | Diagnostic Info | ⚠️ Web Intent / TAPE (partial) | ❌ No | ⭐ LOW (read only) |
| Identifix Direct-Hit | Diagnostic Info | ❌ No public API | ❌ No | ⭐ LOW |
| ALLDATA | Diagnostic Info | ⚠️ Partner program only | ❌ No | ⭐ LOW |
| MyShopManager | CRM / Marketing | ⚠️ No public API; data sync only | ❌ No | ⭐ MEDIUM (replace it) |
| Steer CRM | CRM / Marketing | ✅ REST API | ✅ Yes | ⭐⭐ HIGH |
| Kukui | Website / CRM | ⚠️ Partner program | ⚠️ Limited | ⭐ MEDIUM |
| PartsTech | Parts Procurement | ✅ Full Parts Ordering API | ❌ No | ⭐⭐⭐ HIGH |
| Nexpart | Parts Procurement | ✅ Partner API | ❌ No | ⭐⭐ HIGH |
| QuickBooks Online | Accounting | ✅ Full API + Webhooks | ✅ Yes | ⭐⭐ HIGH |
| Stripe / Square | Payments | ✅ Full API + Webhooks | ✅ Yes | ⭐⭐ HIGH |
| CARFAX | Vehicle History | ✅ Partner API | ❌ No | ⭐⭐ HIGH (predictive triggers) |
| Twilio / Sendgrid | Communications | ✅ Full API | ✅ Yes | ⭐⭐⭐ CRITICAL (delivery layer) |

---

## 13. Recommended Development Priorities

### Immediate — Required for Grand Slam Offer
- Tekmetric REST API integration — webhook receiver + core event handlers
- Shopmonkey REST API integration — mirror of Tekmetric workflows
- Twilio SMS delivery layer — all customer-facing messages
- Lapsed customer automation — daily scheduled query → AI personalized message
- Review generation automation — invoice paid → 2hr delay → Google Review link

### Phase 2 — Add-On Upsell Features (Months 2–3)
- myKaarma API integration — video inspection delivery + declined services pipeline
- QuickBooks Online integration — nightly sync + AI financial reporting
- PartsTech API — parts status monitoring + backorder alerts
- Owner AI Dashboard — aggregated data + nightly AI analysis delivery
- CDK Global / Fortellis ISV registration — begin certification process to unlock dealer service center market

### Phase 3 — Differentiation & Moat (Month 4+)
- CARFAX integration — predictive service triggers based on vehicle age/mileage
- Steer CRM partnership or replacement workflow
- Multi-SMS compatibility layer — single AIVANTA workflow serves Tekmetric, Shopmonkey, and Shop-Ware clients
- AI diagnostic assistant — pre-screening common fixes for tech before they reach Identifix/ALLDATA

---

> **BOTTOM LINE:** The integration landscape strongly favors AIVANTA. Tekmetric and Shopmonkey — which together power the fastest-growing segment of independent shops — both have open APIs and webhook systems purpose-built for exactly what we are building. The shops that are already investing in modern SMS are the same shops ready to invest in AI automation. We are selling to the right people with the right tools.

---

*Document prepared by AIVANTA Automations, LLC | February 2026 | Confidential — Do Not Distribute*
