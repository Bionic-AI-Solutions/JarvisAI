# Jarvis AI — Master Build Plan (Comprehensive)

Status: Curated from product brief, technical RFC, and multi-agent review  
Date: 2026-02-10  
Sources: Business plan PDF, technical RFC, party-mode agent input

---

## EXECUTIVE OVERVIEW

**Product**: Jarvis AI — voice-first automation platform reducing smartphone screen time by executing multi-step app tasks with safety checkpoints and secure payments.  
**Market**: India-first (500M+ Android users), global desktop expansion (professionals/enterprises).  
**Year 1 Financial Target**: ARR ~₹358M (~$4.3M) (conservative) / $5M aspirational.  
**MVP Scope**: Android native spike (Kotlin) for food ordering with UPI biometric confirmation.  
**Timeline**: 14 weeks to closed alpha (sideload); Month 3 Play Store + paid validation campaign.

---

## SECTION 1: BUSINESS STRATEGY & VALIDATION

### Market Opportunity
- Global voice assistant market: ~$27.16B by 2026 (CAGR 23.7%)
- India: 500M+ Android users; 12B+ UPI transactions/month; rising Tier 2/3 voice adoption (55%)
- Accessibility market: 1.3B people globally with disabilities; apps with accessibility see 520% higher downloads

### User Segments
1. **Mass Market (India)**: Android consumers seeking hands-free, screen-time reduction, accessibility
2. **Professionals/Teams**: Desktop users (higher ARPU ~$19/mo vs mobile ~$3.50/mo)
3. **Enterprise/Government**: Accessibility mandates, productivity bundles

### Pricing & Unit Economics (Year 1 targets)
- Free tier: 20 automations/day, 5 apps → drives viral adoption
- Pro (mobile): ₹299/month (~$3.50)
- Pro+ (desktop): ₹599/month
- Family: ₹799/month (5 devices, shared workflows)

Key metrics:
- Freemium conversion: 10% target (industry: 10–15% observed for voice)
- ARPU: ₹250(M1) → ₹299(M12) per paying user
- CAC (blended): ₹150(M1) → ₹80(M6, organic/referral optimized)
- LTV: ~₹3,661 (~$44) over 18-month lifetime
- Month 6: breakeven; Month 12: 60%+ gross margins

### User Growth Trajectory & Revenue
- Month 1: 10k total / 1k paying → MRR ₹250k
- Month 3: 100k total / 10k paying → MRR ₹2.75M
- Month 6: 500k total / 50k paying → MRR ₹14.5M (breakeven month)
- Month 12: 1M total / 100k paying → MRR ₹29.9M → ARR ₹358M

### Go-to-Market Phases

**Phase 1 (Week 0–8, M1–M2): India Sideload & Viral Launch**
- Objective: 10k early adopters, proof-of-concept, viral loops
- Channels: Product Hunt, Reddit tech communities, creator partnerships, emotional founder narrative
- Landing page + sideload APK distribution
- Initial validation: shadow landing page + $50 ad spend (CTR, conversion, waitlist intent)
- Success metric: 10k sideload installs, 5–10% engagement rate

**Phase 2 (Week 9–24, M3–M6): Play Store & Growth**
- Objective: 100k → 500k users
- Tactics: Play Store lite listing (accessibility + digital wellbeing positioning), organic referrals, targeted ads, affiliate partnerships (Swiggy/Uber/Amazon)
- Validation campaign: $500–1k/month for user acquisition and demand signal verification
- MVP flows live: food ordering, rides, bill payments
- Enterprise pre-sales conversations for Government Accessibility mandates
- Success metric: 50k paying users, 30–60 day retention >50%, CAC ₹80–100

**Phase 3 (Week 25–52, M7–M12): Scale & Enterprise**
- Objective: 1M users, 100k paying, enterprise revenue (5–10% of total)
- Tactics: Desktop upsell, enterprise sales (accessibility + productivity), affiliate revenue (food/ride/shopping partners)
- International expansion pilots (Singapore, Malaysia)
- Success metric: ARR ₹358M, gross margin >60%, CAC:LTV >4:1

---

## SECTION 2: TECHNICAL ARCHITECTURE & IMPLEMENTATION

### High-Level Architecture

```
┌─────────────────────── Android Device ──────────────────────┐
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Voice Engine │→ │Automation    │→ │Accessibility     │  │
│  │              │  │ Core         │  │ Adapter          │  │
│  │(Wake+STT)    │  │(Orchestrator)│  │(AccessService+   │  │
│  └──────────────┘  └──────────────┘  │UIAutomator)      │  │
│         ↓                  ↓                  ↓             │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │Local Policy  │  │Payments      │  │Audit & Storage   │  │
│  │Engine        │  │Adapter       │  │(Encrypted logs)  │  │
│  │(Kill switch, │  │(UPI+         │  │                  │  │
│  │consent)      │  │Biometric)    │  │                  │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
│                           ↓                                  │
│                  Encryption/Local Storage                    │
└──────────────────────────│────────────────────────────────────┘
                           ↓
         ┌─────────────────────────────────────┐
         │        Cloud Services               │
         │                                     │
         │ ┌─────────────┐ ┌──────────────┐   │
         │ │Planner      │ │Backend       │   │
         │ │Service      │ │(Supabase)    │   │
         │ │(GPT-4o+     │ │Auth, Logs,   │   │
         │ │Plan Cache)  │ │Telemetry     │   │
         │ └─────────────┘ └──────────────┘   │
         │       ↕                  ↕          │
         │ ┌─────────────────────────────────┐ │
         │ │Payment Orchestration & Gateway  │ │
         │ │(UPI tokenization, reconciliation)
         │ └─────────────────────────────────┘ │
         └─────────────────────────────────────┘
```

### Module Architecture (Kotlin Gradle Modules)

**Module 1: `voice-engine`**
- Wake-word detection (Porcupine / custom on-device)
- Audio recording and STT (Whisper Nano local + cloud fallback)
- Interface: `startListening() → stopListening() → Transcript`

**Module 2: `planner-adapter`**
- Cloud LLM planning (GPT-4o) with local caching
- Serialization and retry logic
- API: `planIntent(userId, intent, context) → Plan{steps[], confidence}`

**Module 3: `automation-core`**
- Orchestrates plan execution step-by-step
- Manages checkpoints, rollbacks, resumption
- API: `executePlan(plan) → ExecutionResult`

**Module 4: `accessibility-adapter`**
- Wraps Android `AccessibilityService` and `UIAutomator`
- Element finding: text anchors, resource IDs, OCR fallback
- Action execution with robustness scoring
- API: `performAction(action) → ActionResult`

**Module 5: `ui-mapper`**
- Maps planner steps to concrete UI actions
- Handles UI drift via heuristics and vision fallback
- API: `mapStepToAction(step, appContext) → UIAction`

**Module 6: `payments-adapter`**
- UPI SDK integration (PhonePe/GPay)
- Biometric confirmation workflow (local)
- Tokenized payment flow
- API: `initiatePayment() → confirmPayment(biometricToken) → PaymentResult`

**Module 7: `local-policy`**
- Kill switch enforcement
- Consent and approval rules
- Rate limiting and safety checks
- API: `evaluate(actionContext) → PolicyDecision{allow|deny|require_confirmation}`

**Module 8: `storage` & `audit-logger`**
- Encrypted local audit logs
- Action history persistence
- User data deletion workflows
- API: `logAction() → queryLogs() → deleteLogs()`

**Module 9: `telemetry`**
- Event tracking and anonymization
- Cross-device sync
- Backend reporting
- API: `trackEvent(eventType, payload) → syncState()`

**Module 10: `onboarding-ui`**
- Permission flows (Accessibility, Microphone, Biometric)
- Consent screens and privacy disclosures
- Checkpoint UX and failure recovery dialogs

### Data Models

```kotlin
data class Plan(
    val planId: String,
    val steps: List<Step>,
    val estimatedCost: Float,
    val confidence: Float
)

data class Step(
    val id: String,
    val actionType: String,  // "tap", "type", "wait", "verify", ...
    val params: Map<String, Any>,
    val requiresCheckpoint: Boolean
)

data class ExecutionResult(
    val execId: String,
    val status: String,  // "SUCCESS", "FAILED", "PAUSED", ...
    val stepResults: List<StepResult>,
    val metrics: Map<String, Any>
)

data class AuditEntry(
    val execId: String,
    val userId: String,
    val timestamp: Long,
    val stepId: String,
    val action: String,
    val result: String,
    val confirmationType: String?
)
```

### API Contracts (Cloud ↔ Device)

**POST /api/v1/plan**
```json
Request: {
  "userId": "...",
  "intentText": "order chicken biryani from Swiggy",
  "appContext": { "currentApp": "home", "recentApps": [...] },
  "recentHistory": [...]
}
Response: {
  "planId": "...",
  "steps": [...],
  "estimatedCost": 0.05,
  "meta": { "cached": false, "executionTimeMs": 2500 }
}
```

**POST /api/v1/telemetry**
```json
Request: {
  "userId": "...",
  "events": [
    { "type": "plan_executed", "planId": "...", "success": true, "duration": 15000 },
    { "type": "checkpoint_approved", "stepId": "..." }
  ]
}
```

**Auth**: Bearer JWT token (short TTL), refresh via secure storage

### Infra & Deployment

- **Android App**: Sideload APK (Week 6) + Play Store lite (Month 3)
- **Planner Service**: Containerized (Docker), Cloud Run auto-scaling
- **Backend**: Supabase (managed Postgres, auth, real-time subscriptions)
- **CI/CD**: GitHub Actions with Android API level matrix; nightly E2E on Firebase Test Lab
- **Monitoring**: Datadog / CloudWatch for API latency, error rates, cost tracking

---

## SECTION 3: PRODUCT & UX REQUIREMENTS

### Core MVP Flows (Phased)

**Phase 1: Food Ordering (Week 6 spike target)**
- User says "Jarvis, order chicken biryani from Swiggy"
- App launch → search → add to cart → confirm address → checkout → UPI biometric → order placed
- Checkpoint: before payment (price, address confirmation)
- Success criterion: end-to-end execution <30s median time

**Phase 2: Ride Booking (M2–M3)**
- User says "Jarvis, book Uber to office"
- App launch → set pickup/dropoff → confirm → book → UPI pay
- Checkpoint: before booking, show price

**Phase 3: Bill Payments (M2–M3)**
- User says "Jarvis, pay my electricity bill via PhonePe"
- Open PhonePe → bill payment → confirm amount → biometric pay
- Checkpoint: before payment

**Phase 4+: Social, Shopping, Productivity (M4+)**
- WhatsApp/Instagram reply, Amazon search/purchase, calendar/meeting setup, etc.

### UX Principles (per Accessibility & Usability)
1. **Voice-first**: all critical flows accessible via voice
2. **Explicit confirmation**: human must approve any payment, address change, or destructive action
3. **Error recovery**: clear, accessible error messages with fallback (manual tap UI)
4. **Accessibility**: WCAG 2.1 AA compliance; visual + voice + haptic feedback
5. **Consent**: privacy policies, consent screens, data deletion UI

### Onboarding UX Flow
1. Welcome screen (emotional pitch + safety messaging)
2. Permissions requests (Accessibility, Microphone, Biometric, Location)
3. Privacy & consent (explicit data handling, deletion policy)
4. Demo flow (watch 1 recorded automation, then try one)
5. Habit setup (learn user's frequent flows)

---

## SECTION 4: SECURITY, PRIVACY & COMPLIANCE

### Security Model
- **Never store** raw payment credentials; use tokenized flows only
- **Local biometric** for payment confirmations; keep fingerprint verification on-device
- **Voiceprint** anti-spoofing (match voice to user during onboarding)
- **Device binding**: tie automation session to device+user combo
- **Kill switch**: "Jarvis stop" triggers immediate abort (0.1s response target)

### Privacy & Data Handling
- **On-device processing**: STT, UI action execution, biometric confirmation all local
- **Server**: only send anonymized telemetry, plan requests (no PII), and payment confirm receipts
- **Audit logs**: encrypted locally; user-controlled export and deletion
- **GDPR/India compliance**:
  - User data deletion workflow (data.request@jarvisai.com)
  - Transparent telemetry (data usage dashboard in app)
  - No third-party data sharing

### Compliance Checklist
- [ ] India Disability Act 2016 alignment (accessibility features, government procurement)
- [ ] UPI SDK compliance (PhonePe/GPay integration legal terms)
- [ ] Google Play Store accessibility requirements (WCAG 2.1, feature parity)
- [ ] Apple App Store (future; iOS Lite requires Siri Shortcuts review)
- [ ] Data residency (India PII storage, MEITY rules if applicable)

---

## SECTION 5: TESTING & QA STRATEGY

### Testing Pyramid
- **Unit**: 70% (module interfaces, adapters, mappers, policy engine)
- **Integration**: 20% (voice → planner → automation → payments; cross-module)
- **E2E**: 10% (Espresso/UIAutomator real app + real partner app simulations on Firebase Test Lab)

### ATDD (Acceptance-Test-Driven Development)
- Write failing acceptance tests for each user story before implementation
- Example: `test_food_order_success_with_checkpoint_approval()`
- Test both happy path and error cases (network failure, app UI change, wrong confirmation)

### Safety & Regression Coverage
- **Fuzzing**: random action sequences, rapid UI changes, network interruptions
- **Chaos**: simulate app crashes, permission revocation, device lock/unlock
- **Regression**: nightly full suite on Firebase Test Lab (5+ devices: API 25, 28, 30, 32, 34)
- **Critical flows**: payment authorization, data deletion, kill switch (100% pass rate required)

### QA Milestone Targets
- Week 6 (spike): 50+ unit tests, 10+ E2E scenarios for food ordering
- Week 10: 80% code coverage (unit+integration), zero critical bugs
- Week 14 (alpha): daily regression, manual UAT with 50–100 early adopters

---

## SECTION 6: TIMELINE & RESOURCE PLAN

### Phase 1: Foundation & Spike (Week 0–6, 14 people-weeks)

**Week 0–2: Architecture & Infra Setup**
- Roles: 1 architect, 1 PM, 1 tech-writer, 1 infra eng
- Tasks:
  - Finalize module interfaces and API contracts
  - Set up GitHub repos, CI/CD (GitHub Actions)
  - Provision Supabase backend and payment sandbox (PhonePe/GPay test keys)
  - Design privacy policies and consent flows
  - Create infrastructure-as-code (terraform/Pulumi)
- Deliverable: documented API spec, infra running, CI/CD green

**Week 3–6: Android Spike (Food Ordering MVP)**
- Roles: 2 dev (Kotlin), 1 QA, 1 UX, 1 arch (part-time)
- Tasks:
  - Build voice-engine (Porcupine wake + Whisper Nano STT)
  - Build planner-adapter (GPT-4o planning + local caching)
  - Build automation-core (plan orchestration)
  - Build accessibility-adapter (AccessibilityService integration)
  - Build payments-adapter (UPI biometric flow)
  - Build local-policy and audit-logger
  - Create onboarding UI + consent flows
  - Write 60+ unit tests (ATDD)
  - Create 10+ E2E test scenarios (Espresso)
  - Design and iterate UX for checkpoint flows
- Deliverable: Functioning sideload APK (food ordering end-to-end, <30s median time), test suite, documentation

### Phase 2: Hardening & Alpha (Week 7–14, 18 people-weeks)

**Week 7–10: Edge Cases & Telemetry**
- Roles: +1 infra eng, +1 senior dev (expansion from spike team)
- Tasks:
  - Hardening automation (handle UI drift, app updates, permission changes)
  - Implement telemetry and cost instrumentation
  - Migrate to production Supabase
  - Build cross-device sync and habit learning
  - 20+ additional edge-case tests
- Deliverable: Robust APK, telemetry dashboard, cost model validated

**Week 11–14: Closed Alpha & Iteration**
- Roles: Marketing (2), Community manager (1), expanded QA (1)
- Tasks:
  - Recruit 1–2k alpha users (sideload)
  - Daily regression testing + UAT with subset
  - Collect feedback, prioritize fixes
  - Prepare Play Store listing and metadata
  - Document release notes and known issues
- Deliverable: Stable alpha, release candidate APK, Play Store lite listing ready

### Resource Budget (14 weeks)

| Role | Count | Weekly Load | Total | Notes |
|------|-------|----------|-------|-------|
| Senior Backend Dev | 1 | 5 days | 70 days | Infra, APIs, payment gateway |
| Android Dev (Kotlin) | 2 | 5 days | 140 days | Core automation spike |
| QA Automation Eng | 1 | 5 days | 70 days | ATDD, E2E, regression |
| Architect | 1 | 3 days | 42 days | Design reviews, tech spikes |
| PM | 1 | 4 days | 56 days | Requirements, validation, prioritization |
| UX Designer | 1 | 3 days | 42 days | Onboarding, checkpoint UX, flows |
| Tech Writer | 1 | 2 days | 28 days | API specs, docs, release notes |
| Infra / DevOps | 1 | 2 days (W7+) | 20 days | CI/CD, monitoring, deployment |
| **Total** | **9** | **~30 days** | **~468 person-days** | ~3.5 full-time equivalent |

**Cost estimates (Week 0–14, India-based team assumed)**:
- Salaries: ~₹1.2–1.6M/week (₹200–250k/person/month avg) = ~₹20–25M over 14 weeks
- Cloud infra (Supabase, GCP, Firebase): ~₹100–150k/week = ~₹1.5–2M
- Tools & services (GitHub, monitoring, payment SDKs): ~₹50k/week = ~₹700k
- **Total Phase 1 cost: ~₹23–28M (~$276–336k USD)** for spike + alpha

### Phase 2–3: Scale & Enterprise (Month 3–12)
- Month 3–6: Growth & hardening (team: +3 backend, +2 marketing, +1 compliance)
- Month 6–12: Scale & new flows (team stability, +1 enterprise sales, +1 customer success)
- Ongoing infra scaling and API cost optimization

---

## SECTION 7: SUCCESS CRITERIA & RISK MITIGATION

### Success Criteria

| Milestone | Metric | Target |
|-----------|--------|--------|
| Week 6 (Spike) | Food order automation end-to-end | <30s median, 90% success |
| Week 14 (Alpha) | Sideload installations | 1–2k users |
| Month 2 | Engagement & retention | 30-day retention >50%, DAU/MAU >30% |
| Month 3 | Play Store launch | Approval achieved, 5k+ downloads week 1 |
| Month 6 | Unit economics | CAC ₹80, LTV:CAC >4:1, profitability |
| Month 12 | Scale | 1M users, 100k paying, ARR ₹358M |

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| App store (Play Store) rejects automation | Medium | Critical | Dual launch: lite (accessibility) + sideload (pro) |
| UI fragility across app updates | High | High | AI vision fallback, user-driven repair UI, heuristics |
| Cost overrun (LLM API spend) | Medium | High | Aggressive caching, on-device models, cheaper planner variant |
| Payment gateway delays (UPI) | Low | Critical | Negotiate early PhonePe/GPay integration; sandbox first |
| Team turnover (key devs) | Low | Medium | Clear handoff docs, modular design, knowledge sharing |
| Market doesn't want sideload APK | Low | High | Early validation + landing page experiment (Week 2) |
| Accessibility compliance issues | Low | Medium | Partner with accessibility consultant; WCAG audits by Week 10 |
| Biometric spoofing exploits | Very Low | Critical | Voiceprint + device binding + liveness detection |

---

## SECTION 8: IMMEDIATE NEXT STEPS

1. **Week 0 (This week)**:
   - [ ] Confirm food ordering as MVP flow with stakeholders
   - [ ] Allocate spike team (2 dev, 1 QA, 1 UX, 1 arch part-time)
   - [ ] Create GitHub repos and branch strategy
   - [ ] Order PhonePe/GPay test credentials and sandbox access

2. **Week 1**:
   - [ ] Finalize API specs (OpenAPI 3.0 format)
   - [ ] Set up Supabase backend and CI/CD pipelines
   - [ ] Design onboarding & consent UX flows (Figma)
   - [ ] Begin user interviews (5–10) for food ordering MVP

3. **Week 2**:
   - [ ] Launch shadow landing page ($50 ad test)
   - [ ] Module interface review and IDE setup (IntelliJ + Gradle)
   - [ ] Create ATDD test scenarios (BDD format)

4. **Week 3**:
   - [ ] Begin voice-engine spike (Porcupine + Whisper)
   - [ ] Begin planner-adapter integration (GPT-4o test calls)
   - [ ] First unit tests written (TDD)

---

## FILES & ARTIFACTS GENERATED

- `product-brief.md` — business & technical overview
- `technical-rfc-android.md` — module interfaces & API contracts
- `master-build-plan.md` — this comprehensive document
- `jarvis-business-plan.txt` — extracted from original PDF
- `party-mode-session.md` — multi-agent recommendations (simulated)
- API spec (OpenAPI 3.0 — to be generated Week 1)
- Privacy policy & compliance checklist (to be finalized Week 0–1)

---

**Status**: Ready for leadership review and team kickoff.  
**Questions?** Tag PM or architect in BMAD party-mode to refine any section.
