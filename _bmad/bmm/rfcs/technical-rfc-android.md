# Technical RFC — Android Implementation (Mobile‑First)

Status: Draft
Authors: `architect`, `dev`, `pm`, `tech-writer`
Date: 2026-02-10

Summary
-------
This RFC defines the technical architecture, module boundaries, interfaces, and API contracts for the Android (mobile‑first) implementation of Jarvis AI. The goal is to deliver a production‑grade Android spike that demonstrates end‑to‑end automation for a prioritized flow (food ordering) with secure UPI biometric confirmation, telemetry, and robust safety controls.

Design principles
-----------------
- Mobile‑first: reliable native Android implementation for version 1.
- Safety first: explicit human checkpoints, biometric confirmation, kill switch, and audit logs.
- Hybrid planner: cloud LLM planner + cached plans and on‑device heuristics for repeatable flows.
- Modular and testable: small modules with clearly defined interfaces and unit tests.

High-level architecture
-----------------------
- Device layer (Android app):
  - Wake/Voice stack
  - Automation Core (executor)
  - Accessibility Adapter (AccessibilityService & UIAutomator wrapper)
  - Local Policy Engine (safety & consent)
  - Payments Adapter (UPI SDK integration + biometric confirmations)
  - Data & Storage (encrypted local store, audit logs)
- Cloud layer:
  - Planner Service (LLM planner API)
  - Backend (auth, telemetry, feature flags) — Supabase recommended
  - Payment Orchestration / reconciliation

Module list & responsibilities
------------------------------
1) Wake Word & Voice Engine (`voice-engine`)
   - Responsibility: detect wake word, record audio, run STT (on‑device fallback) and forward transcripts.
   - Interfaces:
     - startListening(triggerContext) -> ListeningSessionId
     - stopListening(sessionId) -> Transcript
     - onWake(handler: (sessionId) -> void)
   - Implementation notes: Porcupine or custom on‑device wake; Whisper Nano for local STT; fallback to cloud STT when allowed.

2) Planner Adapter (`planner-adapter`)
   - Responsibility: wrap cloud LLM planner calls, serialize plan results, manage caching & retries.
   - Interfaces:
     - planIntent(userId, intentPayload, context) -> Plan{steps: Step[] , confidence}
     - getCachedPlan(key) -> Plan | null
     - invalidatePlan(key)
   - API contract (PlannerService HTTP): POST /api/v1/plan { userId, intent, context } -> { planId, steps[], meta }

3) Automation Core (`automation-core`)
   - Responsibility: orchestrate execution of a `Plan` by invoking the Accessibility Adapter and managing checkpoints, rollbacks, and retries.
   - Interfaces:
     - executePlan(plan: Plan, execOptions) -> ExecutionResult
     - pauseExecution(execId)
     - resumeExecution(execId)
     - cancelExecution(execId)
   - Execution model: step-by-step, synchronous per step with checkpoint callback before any critical action.

4) Accessibility Adapter (`accessibility-adapter`)
   - Responsibility: translate abstract step actions into concrete Android UI operations using `AccessibilityService`, `UIAutomator`, and Vision heuristics.
   - Interfaces:
     - performAction(action: UIAction) -> ActionResult
     - findElement(selector: Selector) -> ElementRef | null
     - watchForEvent(eventSpec, timeout) -> EventResult
   - Selector model: support text anchors, resource IDs, relative traversal, and vision fallback (OCR + bounding box).

5) UI Mapper / Heuristics (`ui-mapper`)
   - Responsibility: map planner intents and app contexts to selectors and actions; provide resilience to UI drift.
   - Interfaces:
     - mapStepToAction(step: PlanStep, appContext) -> UIAction
     - scoreActionRobustness(action) -> float
   - Heuristics: prefer resource-id > text anchor > visual OCR anchor.

6) Payments Adapter (`payments-adapter`)
   - Responsibility: integrate with UPI SDKs (PhonePe/GPay) and manage biometric confirmation flows.
   - Interfaces:
     - initiatePayment(paymentRequest) -> PaymentSession
     - confirmPayment(sessionId, biometricToken) -> PaymentResult
     - reconcilePayment(sessionId) -> ReconciliationResult
   - Security: never store raw payment credentials; store tokenized receipts only.

7) Local Policy Engine (`local-policy`)
   - Responsibility: enforce kill switch, consent, step rate limits, safety checks before critical actions.
   - Interfaces:
     - evaluate(actionContext) -> PolicyDecision{allow|deny|require_confirmation}
     - registerKillSwitch(handler)

8) Audit & Persistence (`audit-logger` & `storage`)
   - Responsibility: persist encrypted audit logs of executed actions, approval decisions, and outcomes. Provide export and deletion flows.
   - Interfaces:
     - logAction(execId, step, result, metadata)
     - queryLogs(filter) -> LogEntries
     - deleteLogs(userRequest)

9) Telemetry & Sync (`telemetry`, `sync`) 
   - Responsibility: collect anonymized telemetry, sync preferences and plan caches across devices, and send events to backend.
   - Interfaces:
     - trackEvent(userId, eventType, payload)
     - syncState(userId, statePayload)

10) Onboarding & UX Components (`onboarding`, `ui`) 
    - Responsibility: consent screens, permission flows, failure recovery UI, and human checkpoint prompts.

Data models
-----------
- Plan: { planId, steps:[{id, actionType, params}], estimated_cost, confidence }
- Step: { id, actionType, params, requiresCheckpoint:boolean }
- ExecutionResult: { execId, status, stepResults: [ {stepId, status, error?} ], metrics }
- AuditEntry: { execId, userId, timestamp, stepId, action, result, confirmationType }

APIs (device ↔ cloud)
----------------------
- POST /api/v1/plan
  Request: { userId, intentText, appContext, recentHistory }
  Response: { planId, steps, estimatedCost, meta }
- POST /api/v1/telemetry
  Request: { userId, events[] }
- Auth: JWT token with short TTL, refresh via refresh token in secure storage.

Error handling and fallback
--------------------------
- If `performAction` fails: try visual fallback; if still fails, prompt user with human‑assisted tap UI and abort or continue per policy.
- For payment failures: always rollback local state and surface clear error and recovery steps.

Testing strategy
----------------
- Unit: each module with mocked downstream adapters.
- Integration: Espresso + UIAutomator flows on representative real devices and emulators; run scheduled regression against major partner apps (Swiggy, Uber, etc.)
- Acceptance: ATDD scenarios for prioritized flows (food ordering, rides, payments) with failing tests written before implementation.

Security & privacy
------------------
- Keep biometric verification local; use tokenized payment confirmations for server reconciliation.
- Encrypt audit logs at rest; provide user data deletion path.
- Minimize PII sent to cloud; strip personal identifiers from telemetry.

Developer UX & packaging
-----------------------
- Module layout (Gradle modules):
  - :voice_engine
  - :automation_core
  - :accessibility_adapter
  - :payments_adapter
  - :planner_adapter
  - :storage
  - :ui_onboarding
- Each module publishes a well‑documented API (Kotlin interfaces) and unit tests.

Deployment & infra
-------------------
- Planner Service: containerized service (Docker + Cloud Run or GKE); autoscale with request queue; cost monitoring.
- Backend: Supabase for auth and storage; use managed Postgres.
- CI: GitHub Actions with matrix for Android API levels; nightly E2E runs on device farm (Firebase Test Lab / AWS Device Farm).

Roadmap & milestones (aligned with product brief)
-----------------------------------------------
- Week 0–2: infra + design + permissions/consent flows
- Week 3–6: Android native spike (food ordering) — deliver runnable sideloadable APK
- Week 7–10: reliability, telemetry, payments integration, alpha
- Week 11–14: closed alpha rollout, instrumentation, iterate

Open questions
--------------
1. Which single flow do we choose as the MVP (recommendation: Food Ordering)?
2. Do we require a pre‑negotiated integration with PhonePe/GPay for early testing, or will test UPI flows use sandbox endpoints? 
3. Device coverage targets (min Android API level and OEMs for alpha)?

Appendix: Example Kotlin interfaces (simplified)
---------------------------------------------
interface PlannerAdapter {
    suspend fun planIntent(userId: String, intent: IntentPayload): Plan
}

interface AutomationCore {
    suspend fun executePlan(plan: Plan, options: ExecOptions): ExecutionResult
    fun pause(execId: String)
    fun resume(execId: String)
}

interface AccessibilityAdapter {
    suspend fun performAction(action: UIAction): ActionResult
    suspend fun findElement(selector: Selector): ElementRef?
}

interface PaymentsAdapter {
    suspend fun initiatePayment(req: PaymentRequest): PaymentSession
    suspend fun confirmPayment(sessionId: String, biometricToken: String): PaymentResult
}

Conclusion
----------
This RFC provides concrete module boundaries, interfaces, and a pragmatic plan for delivering a production-validated Android implementation. Next steps: resolve the open questions, allocate the 3–4 person spike team, and begin Week 0 design + infra prep.
