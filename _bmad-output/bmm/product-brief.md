# Jarvis AI — Product Brief (Detailed)

Source: `Jarvis AI Business Plan.pdf` (extracted to `_bmad-output/bmm/jarvis-business-plan.txt`).

Prepared: 2026-02-10

## Executive Summary
Jarvis AI is a voice‑first automation platform that executes multi‑step tasks across mobile and desktop apps, designed to reduce average smartphone screen time (target: ~70% reduction for supported flows), improve accessibility, and enable secure hands‑free transactions. India‑first go‑to‑market with global desktop upsell for professionals.

Key investor-facing highlights pulled from the business plan:
- Market: Global voice assistant market ~ $27.16B by 2026.
- India opportunity: 500M+ Android users, strong UPI transaction volumes and high sideloading rates.
- Year‑1 target: ARR projection ~ ₹358M (~$4.3M) under conservative assumptions; plan references $5M ARR Year 1 as an aspirational target.

## Product Overview
- Platforms: Android mobile (primary), Desktop Electron app (secondary), iOS Lite (Year 2).
- Core capabilities: always‑listening wake word, AI planning (GPT‑style), accessibility‑driven automation (AccessibilityService/UIAutomator), human checkpoints, biometric UPI payments, habit learning, multi‑language support, offline basics, audit logs.

## Target Users
- Primary: Indian Android consumers (mass market), including power users who sideload apps.
- Secondary: Professionals and teams (desktop users) with higher ARPU.
- Accessibility segment: users with visual/motor impairments (government/enterprise programs).

## Financials (extract from plan)
Conservative financial projection summary (from plan tables):

- User growth targets (Year 1):
	- Month 1: 10,000 total users (1,000 paying)
	- Month 3: 100,000 total users (10,000 paying)
	- Month 6: 500,000 total users (50,000 paying)
	- Month 12: 1,000,000 total users (100,000 paying)

- Pricing & ARPU assumptions:
	- Pro mobile pricing example: ₹299/month (≈ $3.50)
	- Desktop higher ARPU: ~$19/mo (enterprise/professional tier)

- Revenue & ARR (conservative table):
	- MRR Month 12: ₹29.9M → ARR ≈ ₹358M (~$4.3M)
	- Reported aspirational target: $5M ARR Year 1 (plan references)

- Unit economics (Month 6 targets):
	- Target freemium conversion: 10% (voice apps often 15% observed)
	- Target blended CAC: ₹80 (Month 6 goal)
	- LTV (estimate): ₹3,661 (~$44)
	- LTV:CAC projected extremely healthy (>4:1 by Month 6)

- Cost assumptions (Month 6 estimated monthly costs):
	- AI API costs (GPT‑4o): ₹2,500,000
	- Cloud/infra (Supabase + infra): ₹800,000
	- Team salaries (8 people): ₹1,600,000
	- Marketing (CAC ₹100): ₹500,000
	- Ops & misc: ₹400,000
	- Total monthly: ~₹5.8M

## Profitability & Milestones (from plan)
- Profitability timeline in plan: breakeven ~ Month 3, profitable by Month 6, stronger margins Month 12.
- Month-by-month milestone targets embedded in plan: reach 1M users and ~100k paying users by Month 12, with gross margins >60% and ARR target ~₹358M.

## Go‑to‑Market & Roadmap (high level)
Phase 1 — India Sideload & Viral Launch (Month 1–2)
- Objective: 10k early adopters; validation and viral loops
- Tactics: Product Hunt, Reddit/creator blitz, maker/demo videos, emotional founder story

Phase 2 — Growth & Play Store Positioning (Month 3–6)
- Target: 100k→500k users
- Tactics: Play Store lite listing (accessibility/digital wellbeing positioning), referral virality, targeted ads (small $50 campaigns for signal), partnerships with aggregators/affiliates

Phase 3 — Scale & Monetize (Month 6–12)
- Target: 1M users; 100k paying
- Tactics: Desktop upsell, enterprise sales for accessibility & productivity bundles, affiliate revenue with food/ride/shopping partners

## Key Risks & Mitigations
- App store policy / approval risk: Dual‑launch strategy — Play Store lite (accessibility) + sideload Pro APK for full automation.
- Safety for payments and critical flows: biometric confirmations, explicit voice/fingerprint checkpoints, kill‑switch "Jarvis stop" and audit logs.
- Technical fragility across apps: prioritize robust AccessibilityService + fallback manual flows; Android‑first launch (iOS as Lite later).
- Cost sensitivity (AI API): optimize with on‑device models for lightweight flows and hybrid cloud for complex planning.

## KPIs to Track
- Activation & adoption: daily active users, new users/day
- Conversion: freemium → paid rate, ARPU
- Retention & engagement: 30/60/90‑day retention, task completion success rate
- Economics: CAC, LTV, LTV:CAC, payback period
- Safety: number of human checkpoint overrides, failed automations, critical incidents

## Recommended Immediate Next Steps
1. Confirm priority MVP flows (recommend top 3: food ordering, rides, bill payments).  
2. Technical spike: implement one end‑to‑end Android automation with UPI biometric confirmation to validate feasibility and cost per action.  
3. Shadow‑launch landing page + $50 validation campaign (small ad experiment) to measure CTR/conversion and waitlist intent.  
4. Instrument telemetry for task success, checkpoint conversions, and cost per user for API spend.  
5. Prepare Play Store lite listing and parallel sideload strategy; draft privacy/consent/kill‑switch UX.

## Files Created / Updated
- `_bmad-output/bmm/jarvis-business-plan.txt` — extracted PDF text
- `_bmad-output/bmm/product-brief.md` — this detailed brief (updated)

---
Document prepared from the business plan PDF and repo artifacts. If you want, I will now:
- pull exact tables (cost/ARR) into CSVs, or
- create a one‑page investor slide summarizing the financials and milestones.

## Technical Feasibility & Implementation Plan (Mobile‑First)

This section expands technical detail and a concrete plan to build Jarvis AI, focusing on Android mobile first, then desktop.

1) Architecture Overview (Mobile)
- On‑device components:
	- Wake word engine: lightweight on‑device engine (e.g., Porcupine / custom wake word) to avoid cloud wake traffic.
	- On‑device STT: Whisper Nano or similar tiny STT model for immediate voice capture and offline fallback.
	- Accessibility bridge: Android `AccessibilityService` + `UIAutomator` glue to translate planner actions into UI interactions.
	- Local policy engine: enforces kill switch, rate limits, user consent prompts, and critical action confirmations.
	- Audit & logs: local encrypted action logs for user review and compliance.

- Cloud components:
	- LLM planning layer: GPT‑4o (or equivalent) as a cloud planner to decompose goals into ordered UI actions and fallback plans; keep heavy reasoning in cloud, cache common plans on device.
	- Backend: Supabase or managed Postgres for auth, telemetry, logs, feature flags and user preferences.
	- Payment orchestration: tokenized UPI gateway integrations with PhonePe/GPay for server‑side reconciliation, but biometric confirmation remains local.
	- Telemetry & analytics: event pipeline (e.g., Supabase + Influx/Metabase) for usage metrics, error reporting and cost tracking.

2) Key Mobile Implementation Decisions
- Android‑first native spike (Kotlin):
	- Rationale: Full, reliable access to `AccessibilityService`, background execution constraints, and better control of UPI SDKs.
	- Alternatives: React Native/Electron only if parity of Accessibility features and background reliability proven; React Native may be used for UI/consumer features once automation core is stable.
- Hybrid LLM approach:
	- Short flows (confirmation prompts, simple parsing): use on‑device models (Whisper + local heuristics).
	- Complex planning: call cloud LLM for plan generation, but persist plan steps locally and prefetch to reduce API calls.

3) Mobile Data Flow (example — food ordering)
 1. Wake word triggers STT → local transcript.
 2. Device calls cloud planner with user intent + context (app list, stored preferences) → planner returns step sequence.
 3. Local engine executes step sequence via AccessibilityService/UIAutomator; after each critical step, present human checkpoint prompt.
 4. User approves (voice/fingerprint) → if payment required, invoke UPI SDK and local biometric confirmation.
 5. Finalize and save audit log; report anonymized telemetry to backend.

4) Security & Privacy
- Keep PII and payment consent local. Use tokenized payment flows and server reconciliation only for receipts and merchant confirmations.
- Voiceprint or device binding for anti‑spoofing; biometric confirmation for payments.
- GDPR/India privacy compliance: local processing where possible, explicit consent screens, and deletion workflow.

5) Testing Strategy
- Unit tests for planner adapters, UI action mapping, and payment adapters.
- Instrumented E2E tests via Espresso / UIAutomator for Android automation flows; ATDD: write failing acceptance tests first.
- Fuzzing / chaos tests for safety (simulate network interruptions, app UI changes, wrong confirmations).

6) Milestones & Timeline (mobile spike + initial roll)
- Week 0–2: Architecture design, infra provisioning, privacy & compliance checklist. (Team: 1 architect, 1 PM, 1 tech‑writer)
- Week 3–6 (Spike): Build Android native spike for Food Ordering flow (Kotlin): wake‑word → STT → planner call → AccessibilityService execution → UPI biometric confirm. (Team: 2 dev, 1 QA, 1 ux)
- Week 7–10: Harden automation for edge cases, add telemetry, integrate Supabase, build onboarding/consent flows. (Team expands: +1 infra, +1 dev)
- Week 11–14: Run closed alpha (sideload) with 1–2k users, collect metrics, iterate.
- Month 3: Prepare Play Store lite listing, broader sideload campaign, begin paid validation + early sales.

7) Resource Estimates (initial 3 months)
- Dev: 3 FTE (2 Android, 1 backend)  
- QA: 1 FTE (automation + manual)  
- Architect / PM / UX / TechWriter: 1 each (fractional)  
- Infra costs: initial ~$1–2k/month, LLM/API spend varies (plan estimates ₹2.5M/mo at scale—optimize with caching and on‑device models)

8) Desktop (follow‑on) — Technical Choices
- Stack: Electron app with native bridges; Puppeteer/Selenium for browser actions; RobotJS for system-level actions; Tesseract + GPT‑4o Vision for screen reading; local agent sync for cross‑device continuity.
- Migration strategy: after mobile validation, refactor automation core into cross‑platform `automation-core` library (Rust/Go native module or Kotlin multi‑platform) and create Electron wrappers.

9) How we achieve it (practical steps)
 1. Validate users and flows with shadow‑launch + small ad spend (per validation framework in plan).
 2. Deliver Android native spike for 1 high‑value flow (food ordering) with UPI biometric — use this as a technology and business proof.  
 3. Instrument metrics to measure success: task success rate, median flow time, checkpoint conversion, cost per planner call.  
 4. Iterate on reliability (robust selectors, heuristics for app UI drift) and implement graceful fallback (ask user to confirm manual tap if automation fails).  
 5. Harden safety: default kill‑switch, explicit consent, audit logging, and SDK level rate limits for automation.

10) Risks & Mitigations (technical focus)
- UI fragility across app updates: mitigate with heuristics (text anchors, AI vision fallback), frequent selector updates, and user‑driven repair UI.
- Background execution/inactivity: implement foreground service with clear consent and sleep policies; show persistent notification while automations run.
- Cost of LLM planning: implement plan caching, local heuristics, and cheaper on‑device models for repeated flows.

---
I will now mark the todo items complete. If you want, I can:
- extract the plan's financial tables into CSVs (`_bmad-output/bmm/financials/`), or
- generate a technical RFC doc in `_bmad/bmm/rfcs/technical-rfc-android.md` with APIs and module interfaces.


