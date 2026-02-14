# Jarvis AI — Windows/Desktop Product Brief & Architecture
## Comprehensive Guide for Laptop/Desktop Implementation

**Status**: Phase 2 Architecture (Post-Android MVP Validation)  
**Date**: 2026-02-12  
**Created by**: BMAD Architect Agent (Consulting Winston, Senior Systems Architect)  
**Target Platform**: Windows 10+, macOS (Future), Linux (Future)

---

## EXECUTIVE OVERVIEW — DESKTOP EDITION

### Product Vision
Jarvis AI Desktop extends the voice-first automation platform to professional and enterprise users (IT professionals, accountants, business analysts, creatives), enabling hands-free multi-app workflows on laptops/desktops with premium features, higher ARPU, and enterprise integrations.

### Key Differentiators (Desktop vs. Mobile)
| Aspect | Mobile (Android) | Desktop (Windows/Mac) |
|--------|-----------------|----------------------|
| **Input** | Voice-first, tactile | Voice + Keyboard/Mouse + Screen |
| **Output** | Mobile screen | Multi-monitor (up to 3–4 screens) |
| **Automation Scope** | Single-app primarily (Swiggy, Uber, PhonePe) | **30+ apps** (Excel, Salesforce, Notion, Slack, Gmail, Teams) |
| **Cost Model** | Per-action (₹2–5) | Per-seat subscription (₹599–1999/month) |
| **Use Cases** | Transactions (food, rides, bills) | **Workflows** (expense report automation, CRM data entry, email processing) |
| **Target Users** | Mass market (consumers) | **Professionals** (IT, finance, consulting, creative) |
| **Revenue Model** | Freemium → Pro (₹299/mo) | SaaS subscription + Enterprise (₹599–1999/mo) |
| **ARPU Potential** | ₹299/mo (~$3.50) | ₹1200/mo (~$14+) **4x higher** |

### Market Opportunity (Desktop Focus)
- **Global TAM**: 1.5B+ knowledge workers globally; 300M+ in India (IT, finance, business services)
- **Addressable Market** (Tier 1 professionals in India): 50M+ professionals with ₹40k+/month income
- **Unit Economics**: ARPU ₹1200/mo vs CAC ₹500 = LTV:CAC 7:1 (healthier than mobile)
- **Year 1 Target** (Desktop, after Android validation M6+): 50k users → ₹50M ARR (enterprise + premium)

### Product Positioning
*"Automate repetitive work so professionals can focus on what matters. Voice-first on your desktop."*

---

## SECTION 1: WINDOWS/DESKTOP PRODUCT BRIEF

### Target Users (Detailed)

**Segment 1: IT & DevOps Engineers** (Primary)
- Pain: Repetitive ticket triage, log analysis, deployment scripting
- Automation: Parse Jira tickets → create tasks → log notes → escalate
- Willingness to pay: High (₹1500–2000/mo)

**Segment 2: Financial Services (Accounting, Finance)**
- Pain: Manual expense report approval, invoice entry, reconciliation
- Automation: Extract PDF invoice → fill ERP → approve → archive
- Willingness to pay: Higher (₹1500–2000+/mo for compliance + audit trail)

**Segment 3: Customer Success & Sales**
- Pain: CRM data entry (notes, activity logging), follow-up scheduling
- Automation: Email received → extract key details → update Salesforce → schedule follow-up
- Willingness to pay: Medium to high (₹1000–1500/mo)

**Segment 4: Content & Marketing Teams**
- Pain: Content scheduling, asset management, social media posting
- Automation: Draft blog → auto-generate social snippets → schedule posts → archive
- Willingness to pay: Medium (₹800–1200/mo)

**Segment 5: Government & Compliance Teams** (Enterprise)
- Pain: Document workflows, accessibility mandates for e-governance
- Automation: Form filling, process routing, audit logging with full transparency
- Willingness to pay: Very high (₹2000–5000+/mo enterprise contracts)

### Pricing & Tiers (Desktop)

**Free Tier**
- 5 automations/day
- 2 connected apps
- Basic manual workflows
- ₹0/month

**Pro (Individuals)**
- Unlimited automations
- 25+ integrated apps
- Advanced voice commands
- Priority support
- ₹599/month (~$7.20)

**Pro+ (Teams)**
- All Pro features
- Team collaboration (3–10 people)
- Shared automation library
- Admin dashboard & audit logs
- ₹1499/month (~$18)

**Enterprise**
- Unlimited everything
- Custom integrations (SAP, Oracle, Salesforce APIs)
- Dedicated support, SLA guarantee, on-premises option
- Custom pricing (starts ₹50k+/month or ₹500k+/year)

### User Growth Projections (Desktop Phase, Post-Android Validation)

Assuming Android reaches 500k users by Month 12, upsell to desktop Pro+ begins Month 6:

| Timeline | Free Users | Paid Pro | Paid Pro+ | MRR | ARR |
|----------|-----------|----------|-----------|-----|-----|
| **Month 1 (Desktop launch)** | 5k | 1k | 200 | ₹750k | ₹9M |
| **Month 3** | 20k | 8k | 2k | ₹7M | ₹84M |
| **Month 6** | 50k | 25k | 5k | ₹20M | ₹240M |
| **Month 12** | 150k | 75k | 15k | ₹63M | ₹756M |

**Note**: These are aspirational; actual will depend on Android traction and GTM execution.

### Key Features (Desktop MVP to Premium)

#### MVP Features (M1)
1. **Voice Control**: Always-listening wake word; "Jarvis, ..." commands
2. **Screen Reading**: Tesseract OCR + GPT-4V for visual understanding
3. **Basic Web Automation**: Open apps, fill forms, click buttons via Puppeteer/Selenium
4. **OS-Level Automation**: Keyboard shortcuts, window management via RobotJS
5. **Workflow Builder**: Visual workflow designer (drag-drop) for non-technical users
6. **Audit Logging**: Full transparency of automated actions with timestamps

#### Phase 2 Features (M3+)
7. **Multi-Window Orchestration**: Coordinate 2–4 apps simultaneously
8. **AI-Powered Form Filling**: Extract data from documents → auto-fill forms
9. **Email Parser**: Parse incoming emails, extract structured data, trigger workflows
10. **PDF Processing**: Extract tables, text, signatures from PDFs using Tesseract + ML
11. **Team Collaboration**: Shared automations, role-based access control
12. **Advanced Integrations**: Salesforce, SAP, Oracle, Microsoft Graph, Slack, Zapier

#### Enterprise Features (M6+)
13. **On-Premises Deployment**: Private cloud or self-hosted option
14. **Advanced Compliance**: HIPAA, SOC2, ISO 27001 audit trails
15. **Custom LLMs**: Support for private enterprise LLMs (avoid cloud data exposure)
16. **Webhook Support**: Trigger automations from external systems
17. **API Gateway**: Expose automations as REST APIs for other tools

### Go-to-Market (Desktop)

**Phase 1 (Month 6–8, Post-Android M6): Soft Launch**
- Target: IT/DevOps early adopters (beta program)
- Channels: LinkedIn, dev communities (HackerNews, ProductHunt), IT newsletters
- Goal: 1k–5k signups, gather feedback, refine MVP

**Phase 2 (Month 9–12): Scale Professional Segment**
- Expand to finance, sales, marketing
- Integration partnerships (Salesforce, Jira, SAP)
- Enterprise GTM (trials, demos, case studies)
- Goal: 50k Pro + 5k Pro+ users

**Phase 3 (Year 2): Enterprise & Government**
- Direct sales team for enterprise (₹50k+/year ARR contracts)
- Government e-governance programs (compliance + accessibility)
- Vertical-specific solutions (e.g., "Jarvis for Finance," "Jarvis for Healthcare")

---

## SECTION 2: WINDOWS/DESKTOP TECHNICAL ARCHITECTURE

### Design Principles (Architect's Perspective)

1. **Cross-Platform Ready**: Design for Windows first; macOS/Linux support via abstraction layers
2. **Security-First**: No data leaves the device except encrypted telemetry and compliance logs
3. **Modular & Composable**: Each module has clear boundaries; can be deployed independently for enterprise self-hosting
4. **Developer Experience**: Rich APIs for third-party integrations; well-documented SDKs
5. **Scalable Backend**: Handle 100k+ concurrent automation sessions with <5s latency
6. **Zero-Trust Compliance**: Full audit trail, encryption at rest/transit, no plaintext credentials stored

### High-Level Architecture

```
┌──────────────────────── WINDOWS DESKTOP APPLICATION ──────────────────────┐
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Electron Renderer (React/Vue.js Frontend)                          │   │
│  │  - Voice UI (waveform, transcript display)                         │   │
│  │  - Workflow Builder (drag-drop canvas)                             │   │
│  │  - Automation Dashboard (history, logs, performance)               │   │
│  │  - Settings & Integrations                                         │   │
│  └──────────────┬──────────────────────────────────────────────────────┘   │
│                 │                                                           │
│  ┌──────────────┼──────────────────────────────────────────────────────┐   │
│  │ Electron Main (IPC Bridge)                                         │   │
│  │  - Process management                                              │   │
│  │  - Native notification & system integration                        │   │
│  │  - File I/O & app lifecycle                                        │   │
│  └──────────────┬──────────────────────────────────────────────────────┘   │
│                 │                                                           │
│  ┌──────────────▼──────────────────────────────────────────────────────┐   │
│  │ Core Automation Engine (Node.js + Native Modules)                  │   │
│  │                                                                    │   │
│  │  ┌───────────────────┐  ┌────────────────────┐  ┌──────────────┐ │   │
│  │  │Voice Commands     │  │Web Automation      │  │OS Automation │ │   │
│  │  │ (Wake Word +      │  │ (Puppeteer/        │  │ (RobotJS)    │ │   │
│  │  │  STT Whisper)     │  │  Selenium + Axe)   │  │              │ │   │
│  │  └─────────┬─────────┘  └────────┬───────────┘  └──────┬───────┘ │   │
│  │            │                     │                    │         │   │
│  │  ┌─────────▼─────────────────────▼────────────────────▼──────┐  │   │
│  │  │ Orchestration Engine (Scheduler + State Machine)          │  │   │
│  │  │ - Parse intent → build execution plan                      │  │   │
│  │  │ - Execute steps sequentially or parallel                    │  │   │
│  │  │ - Pause/resume/rollback on errors                           │  │   │
│  │  └─────────┬───────────────────────────────────────────────────┘  │   │
│  │            │                                                       │   │
│  │  ┌─────────▼──────────────────────────────────────────────────┐   │   │
│  │  │ Local Storage & Queuing (SQLite + Encryption)             │   │   │
│  │  │ - Audit logs (encrypted)                                  │   │   │
│  │  │ - Workflow state & checkpoints                            │   │   │
│  │  │ - Offline queue for cloud-dependent operations            │   │   │
│  │  └────────────────────────────────────────────────────────────┘   │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ System Integration Layer                                            │   │
│  │  - Windows Registry (app detection, configuration)                  │   │
│  │  - UIA (UI Automation) for OS-level element inspection               │   │
│  │  - WinRT APIs (notifications, system tray, clipboard)               │   │
│  │  - Process monitoring & window management                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
        ┌───────────▼──┐  ┌──────▼─────┐  ┌─▼─────────────┐
        │ Voice Model  │  │  LLM Cloud  │  │ Backend Auth  │
        │ (Offline:    │  │  (GPT-4o &  │  │ & Telemetry   │
        │  Vosk)       │  │  Embeddings)│  │ (Supabase)    │
        │              │  │             │  │               │
        │  OR Cloud:   │  │  Inference  │  │ - Auth tokens │
        │  Whisper API │  │  cache      │  │ - Usage logs  │
        └──────────────┘  └─────────────┘  └───────────────┘
```

### Module Architecture (12 Modules for Windows)

#### **Module 1: Voice Command Engine** (`voice-engine`)
**Responsibility**: Wake-word detection, speech-to-text, voice command parsing

**Tech Stack**:
- Wake word (Porcupine commercial license or Vosk open-source)
- STT: Offline Vosk + cloud Whisper API fallback
- Voice activity detection (VAD) for auto-pause

**Interfaces**:
```typescript
class VoiceEngine {
  startListening(context?: { foregroundApp?: string }): ListeningSession;
  stopListening(sessionId: string): { transcript: string, confidence: float };
  onWakeWord(handler: (sessionId) => void);
  pauseListening(sessionId: string);
  resumeListening(sessionId: string);
}
```

**API Contract**:
```
POST /api/transcribe { audio_bytes, model } → { text, confidence, language }
```

---

#### **Module 2: Planner Adapter** (`planner-adapter`)
**Responsibility**: Convert natural language intent to executable workflow plan

**Tech Stack**:
- GPT-4o API for complex reasoning
- Local embeddings (ONNX model) for semantic caching
- Plan cache (SQLite on-device)

**Interfaces**:
```typescript
class PlannerAdapter {
  planWorkflow(intent: string, context: AppContext): Promise<Workflow>;
  getCachedPlan(intentHash: string): Workflow | null;
  invalidateCache(key?: string);
  getFallbackUIPlan(intent: string): Workflow; // local heuristics
}
```

**API Contract**:
```
POST /api/v1/plan {
  intent: "Fill expense report from Gmail",
  context: { foregroundApp: "Excel", openTabs: [...] },
  userProfile: { role: "Finance PM", timezone: "IST" }
}
Response: {
  workflows: [{
    id, name, steps: [
      { id, type: "extract", source: "gmail", selector: {...} },
      { id, type: "fill_form", app: "excel", fields: {...} },
      { id, type: "notify", message: "Done" }
    ],
    estimatedCost, confidence
  }],
  recommendedSteps: [...]
}
```

---

#### **Module 3: Orchestration Engine** (`orchestrator`)
**Responsibility**: Execute workflows step-by-step, manage state, checkpoints, retries

**Tech Stack**:
- Node.js state machine library (XState)
- Task queuing (Bull with Redis fallback to SQLite)
- Telemetry event bus

**Interfaces**:
```typescript
class Orchestrator {
  createSession(workflow: Workflow): Session;
  executeSession(sessionId: string): Promise<ExecutionResult>;
  pauseSession(sessionId: string);
  resumeSession(sessionId: string);
  cancelSession(sessionId: string, reason?: string);
  getSessionStatus(sessionId: string): SessionStatus;
}
```

**Internal Step Executor**:
```typescript
executeStep(step: Step, context: ExecutionContext): Promise<StepResult> {
  // Route to appropriate executor:
  // - "web_action" → WebAutomation module
  // - "os_action" → OSAutomation module
  // - "voice_action" → generate voice response
  // - "wait" → timeout
  // - "checkpoint" → prompt user confirmation
}
```

---

#### **Module 4: Web Automation Engine** (`web-automation`)
**Responsibility**: Automate web apps (Salesforce, Gmail, Jira, Notion, etc.)

**Tech Stack**:
- Puppeteer (for headless Chrome automation + screenshot capture)
- Selenium + Eggplant (for interactive apps with visual recognition)
- Tesseract OCR + GPT-4V for complex element detection
- Accessibility Tree parsing (W3C Accessibility Inspector)

**Interfaces**:
```typescript
class WebAutomation {
  openApp(appName: string, url?: string): Promise<void>;
  clickElement(selector: Selector): Promise<void>;
  typeText(selector: Selector, text: string): Promise<void>;
  extractData(selector: Selector): Promise<string>;
  screenshot(): Promise<Buffer>;
  waitForElement(selector: Selector, timeout?: number): Promise<void>;
  scrollPage(direction: "up"|"down", amount: number): Promise<void>;
  switchToTab(index: number): Promise<void>;
}
```

**Selector Types**:
```typescript
type Selector = 
  | { type: "xpath", value: string }
  | { type: "css", value: string }
  | { type: "text", value: string, matchType: "exact"|"contains"|"regex" }
  | { type: "accessibility_id", value: string }
  | { type: "visual", description: string } // OCR-based
  | { type: "composite", rules: Selector[] }; // fallback chain
```

---

#### **Module 5: OS Automation Engine** (`os-automation`)
**Responsibility**: OS-level actions (keyboard/mouse, window management, clipboard)

**Tech Stack**:
- RobotJS (keyboard/mouse input, screen capture)
- Windows UIA (UI Automation) for element discovery
- WinRT APIs for app processes and events

**Interfaces**:
```typescript
class OSAutomation {
  moveMouse(x: number, y: number): Promise<void>;
  click(x: number, y: number, button?: "left"|"right"): Promise<void>;
  doubleClick(x: number, y: number): Promise<void>;
  typeKeyboard(text: string): Promise<void>;
  pressKey(key: string, modifiers?: string[]): Promise<void>; // Ctrl+C, Alt+Tab
  getClipboard(): string;
  setClipboard(text: string): void;
  getActiveWindow(): WindowInfo;
  getWindowByTitle(pattern: string): WindowInfo | null;
  captureScreen(area?: Rect): Buffer;
  getUIAElement(selector: UIASelector): UIAElement | null;
}
```

**UIA Integration**:
```typescript
// Windows-native UI Automation for robust element discovery
type UIASelector = {
  automationId?: string;
  name?: string; // control name/label
  className?: string;
  controlType?: string; // Button, TextBox, etc.
};
```

---

#### **Module 6: Screen Understanding Engine** (`vision`)
**Responsibility**: OCR, visual element recognition, screen analysis using AI

**Tech Stack**:
- Tesseract.js (local OCR, lightweight)
- GPT-4 Vision (cloud, for complex layouts)
- YOLO (on-device object detection for UI elements)

**Interfaces**:
```typescript
class Vision {
  ocrScreen(area?: Rect): Promise<OCRResult>;
  findUIElement(description: string, screenshot?: Buffer): Promise<ElementLocation>;
  readData(region: Rect, format?: "text"|"table"|"form"): Promise<string>;
  analyzeLayout(screenshot: Buffer): Promise<LayoutAnalysis>;
}
```

---

#### **Module 7: App Integration Layer** (`app-integrations`)
**Responsibility**: Connectors for third-party APIs (Salesforce, SAP, Slack, etc.)

**Tech Stack**:
- OAuth 2.0 for SaaS platforms
- REST client (Axios)
- Zapier/IFTTT connectors (for extensibility)

**Interfaces**:
```typescript
class AppIntegrations {
  authenticate(appName: string, credentials: Credentials): Promise<Token>;
  callAPI(appName: string, method: string, params: object): Promise<any>;
  subscribeToEvent(appName: string, event: string, callback: Function);
  
  // Pre-built connectors:
  salesforce: SalesforceConnector;
  jira: JiraConnector;
  outlook: OutlookConnector;
  slack: SlackConnector;
  // ... 20+ more
}
```

---

#### **Module 8: Workflow Builder & UI** (`workflow-designer`)
**Responsibility**: Visual no-code workflow designer for non-technical users

**Tech Stack**:
- React Flow (or XCraft) for canvas
- React Query for state management
- Electron preload scripts for IPC

**Components**:
- Canvas: drag-drop workflow nodes
- Node library: pre-built actions (click, type, extract, wait, checkpoint, etc.)
- Inspector: configure node parameters
- Validator: syntax + execution path checking

---

#### **Module 9: Local Storage & Audit Logger** (`storage`)
**Responsibility**: Encrypted audit logs, workflow state, offline queuing

**Tech Stack**:
- SQLite (local database)
- libsodium (encryption at rest)
- WAL mode (write-ahead logging for reliability)

**Interfaces**:
```typescript
class Storage {
  logAction(action: AuditEntry): Promise<void>;
  queryLogs(filter: LogFilter): Promise<AuditEntry[]>;
  saveWorkflow(workflow: Workflow): Promise<void>;
  getWorkflow(id: string): Promise<Workflow>;
  deleteWorkflow(id: string): Promise<void>;
  enqueueOfflineTask(task: OfflineTask): Promise<void>;
  getFaliledTasks(): Promise<OfflineTask[]>;
}
```

---

#### **Module 10: Telemetry & Sync** (`telemetry`)
**Responsibility**: Collect anonymized usage metrics, sync across devices

**Tech Stack**:
- Event bus pattern (Node.js EventEmitter)
- Batch upload to backend (encrypted)
- Device fingerprinting (non-PII)

**Interfaces**:
```typescript
class Telemetry {
  trackEvent(eventType: string, properties: object);
  trackWorkflowExecution(workflowId, status, duration, cost);
  syncUserPreferences(preferences: object);
  reportError(error: Error, context: object);
}
```

---

#### **Module 11: User Preferences & Integrations** (`settings`)
**Responsibility**: Settings UI, app integrations, permission management

**Tech Stack**:
- Store.js (persistent config storage, encrypted)
- OAuth desktop flow + token refresh

**Config Schema**:
```typescript
interface UserSettings {
  voiceLanguage: "en-IN" | "en-US" | "hi-IN";
  voiceGender: "male" | "female";
  autoSuggestWorkflows: boolean;
  privacyMode: "off" | "lite" | "strict";
  cloudBackup: boolean;
  telemetryOptIn: boolean;
  integrations: {
    [appName: string]: {
      authenticated: boolean;
      scopes: string[];
      syncSchedule?: string; // cron
    }
  };
}
```

---

#### **Module 12: Safety & Compliance** (`safety`)
**Responsibility**: Kill switch, checkpoints, compliance logging

**Tech Stack**:
- Global hotkey listener (uIOhook for cross-platform)
- Privilege escalation for sensitive operations

**Interfaces**:
```typescript
class Safety {
  registerGlobalKillSwitch(hotkey: string = "Ctrl+Alt+J");
  onKillSwitch(handler: () => void);
  requestUserCheckpoint(message: string): Promise<boolean>;
  canExecuteAction(action: Step, context: ExecutionContext): boolean;
  logComplianceEvent(event: ComplianceLog): Promise<void>;
}
```

---

### Data Models

#### Workflow Schema
```typescript
interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: Trigger; // manual, scheduled, webhook
  steps: Step[];
  outputs?: Output[];
  settings: {
    runMode: "sequential" | "parallel-safe";
    retryPolicy: { maxRetries: number, backoffMs: number };
    timeoutMs?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  isPublic: boolean;
}

interface Step {
  id: string;
  type: string; // "web_action", "os_action", "wait", "checkpoint", "branch", etc.
  name: string;
  actor: string; // module responsible (e.g., "web-automation", "os-automation")
  params: Record<string, any>;
  errorHandler?: ErrorHandler;
  requiredCheckpoint?: string;
}

interface Trigger {
  type: "manual" | "schedule" | "webhook" | "event";
  config: any;
}

interface AuditEntry {
  id: string;
  timestamp: Date;
  sessionId: string;
  userId: string;
  workflowId: string;
  stepId: string;
  action: string; // "click", "type", "extract", etc.
  result: "success" | "failed" | "checkpoint_pending" | string;
  error?: string;
  metadata: Record<string, any>;
}
```

---

### API Contracts (Backend ↔ Desktop App)

#### Authentication
```
POST /api/auth/login
Request: { email, password }
Response: { accessToken, refreshToken, expiresIn }

POST /api/auth/refresh
Request: { refreshToken }
Response: { accessToken, expiresIn }
```

#### Workflow Planning
```
POST /api/v1/plan
Request: {
  intent: string,
  context: { foregroundApp, openApps, userProfile },
  recentWorkflows?: string[]
}
Response: {
  workflows: Workflow[],
  confidence: float,
  estimatedDuration: number,
  requiredIntegrations: string[]
}
```

#### Workflow Execution
```
POST /api/v1/workflows/:id/execute
Request: { variables?: Record<string, any> }
Response: { sessionId, status, estimatedDuration }

GET /api/v1/sessions/:sessionId
Response: { status: "running"|"completed"|"failed", progress: float, logs: AuditEntry[] }
```

#### Telemetry
```
POST /api/telemetry/events
Request: {
  events: [
    { type: "workflow_executed", workflowId, status, duration, costEstimate },
    { type: "app_integrated", appName, timestamp },
    ...
  ]
}
Response: { received: number, processed: number }
```

---

## SECTION 3: DEPLOYMENT & INFRASTRUCTURE

### Development Environment

**Local Setup**:
```bash
# Install dependencies
npm install

# Start Electron dev server
npm run dev

# Run tests
npm run test

# Build distribution
npm run build:win  # Windows NSIS installer
npm run build:mac  # macOS DMG
npm run build:linux  # AppImage
```

### Deployment Strategy

#### **Phase 1: Windows (MVP)**
- **Distribution**: Direct download (website) + GitHub releases
- **Update mechanism**: Electron updater (differential updates, ~10MB)
- **Signing**: EV code-signing certificate (builds trust, reduces SmartScreen warnings)

#### **Phase 2: App Stores**
- **Microsoft Store**: Ship Pro tier through official store (enterprise discovery)
- **Chocolatey**: Community package manager (IT ops adoption)

#### **Phase 3: Enterprise**
- **On-Premises**: Docker container for private deployment
- **MSI Installer**: Group Policy-deployable for Windows AD environments
- **License Server**: IP-based or license key validation

### Backend Infrastructure

**Planner Service**:
- **Scale**: Handle 100k concurrent sessions
- **Infra**: Cloud Run (Google) or Lambda (AWS) autoscaling
- **Cost Optimization**: Plan cache reduces API calls by 70%; batch inference via vLLM

**Backend API**:
- **Supabase**: Managed Postgres + auth + real-time
- **CDN**: Cloudflare for telemetry ingestion (edge processing)
- **Database**: PostgRES with partitioning by user for multi-tenancy

**Telemetry Pipeline**:
- **Ingestion**: Kafka (or GCP Pub/Sub)
- **Processing**: dbt for aggregation
- **Storage**: BigQuery for analytics
- **Dashboards**: Grafana + Looker for ops visibility

### Security Model

**At Rest**:
- SQLite audit logs encrypted with libsodium (ChaCha20-Poly1305)
- API tokens stored in OS keychain (Windows Credential Manager)
- User settings encrypted via native DPAPI

**In Transit**:
- TLS 1.3 for all API calls
- Certificate pinning for critical endpoints
- No unencrypted logging of sensitive data

**Runtime**:
- Kill switch (global hotkey) aborts execution in <100ms
- Sandboxing: Puppeteer runs in isolated Chrome profiles
- Permission model: User consent before accessing Salesforce, Gmail, etc.

**Compliance**:
- GDPR: Data deletion, export, audit trail
- SOC2: Access controls, incident response, monitoring
- India Privacy: No data residency requirement (all optional cloud sync)

---

## SECTION 4: ROADMAP & MILESTONES

### Phase 1: MVP (Months 1–3, Post-Android M6)
**Goal**: Validate desktop automation for IT/Finance professionals

| Milestone | Deliverable | Owner |
|-----------|-----------|-------|
| **M1.1 (Week 1)** | Electron shell + voice input | Dev Lead |
| **M1.2 (Week 2)** | Web automation (Puppeteer spike) | Automation Eng |
| **M1.3 (Week 3)** | First workflow (e.g., Jira ticket → email) | Dev Lead + QA |
| **M1.4 (Week 4–6)** | Hardening + offline queue + audit logs | Backend Lead |
| **M1.5 (Week 7–8)** | Beta testing (100 IT professionals) | QA + Product |
| **M1.6 (Week 9)** | Public launch + landing page | Marketing |

**Success Criteria**:
- 5k+ beta signups
- 30-day retention >40%
- NPS >50
- Cost per user <₹500

### Phase 2: Scale (Months 4–6)
**Goal**: Expand to finance, sales, marketing; build integrations

**Initiatives**:
- Add Salesforce, Outlook, Slack, Notion connectors
- Workflow template library (50+ pre-built workflows)
- Team collaboration (shared workflows, role-based access)
- Advanced AI features (form extraction, email parsing)

**Success Criteria**:
- 50k Pro users
- 2k Pro+ team subscriptions
- MRR ₹20M

### Phase 3: Enterprise (Months 7–12)
**Goal**: High-touch enterprise sales for Government & Large Orgs

**Initiatives**:
- On-premises deployment (Docker)
- Custom integrations (SAP, Oracle)
- Dedicated support + SLA
- Compliance certifications (SOC2, ISO 27001)

**Success Criteria**:
- 10–20 enterprise contracts (₹500k–5M each)
- ₹50M+ ARR from desktop

---

## SECTION 5: SUCCESS METRICS & KPIs

### User-Centric
| Metric | Target (Month 6) | Target (Year 1) |
|--------|-----------------|-----------------|
| **MAU (Monthly Active Users)** | 50k | 150k |
| **Pro Conversion Rate** | 15% | 20% |
| **Pro+ Team Adoption** | 10% of Pro | 20% of Pro |
| **30-Day Retention** | >50% | >60% |
| **NPS** | >50 | >60 |
| **Workflow Execution Success Rate** | >95% | >98% |

### Business
| Metric | Target (Month 6) | Target (Year 1) |
|--------|-----------------|-----------------|
| **MRR** | ₹20M | ₹63M |
| **ARR** | ₹240M | ₹756M |
| **CAC** | ₹500 | ₹400 |
| **LTV** | ₹15k (~$180) | ₹25k (~$300) |
| **LTV:CAC** | 30:1 | 62.5:1 |
| **Gross Margin** | 70% | 75% |

### Technical
| Metric | Target |
|--------|--------|
| **API Latency (p99)** | <500ms (plan), <2s (execute) |
| **Workflow Success Rate** | >95% |
| **Mean Time to Recovery (MTTR)** | <5 min |
| **Uptime SLA** | 99.5% |
| **Cost per Plan** | <₹1 (LLM API) |

---

## SECTION 6: RISKS & MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|----------|--------|-----------|
| **UI fragility across Window versions** | Medium | High | Maintain UIA + visual fallback; test on W10, W11, W12 |
| **Web app DOM changes break automations** | High | Medium | Plan cache + version retraining; user-repair UI |
| **Enterprise GTM adoption slow** | Medium | High | Start with IT/DevOps; build from viral up |
| **Data privacy concern blocks adoption** | Medium | High | Lite mode (offline-only); transparent audit logs |
| **Competitive threat (Zapier, Make)** | Low | Medium | Differentiate: voice + local-first + compliance |
| **LLM cost scaling with users** | Medium | High | Aggressive caching; on-device model fallback |
| **Payment gateway compliance (PCI, HSM)** | Low | Medium | No direct payment handling; SaaS subscriptions only |

---

## SECTION 7: COMPETITIVE POSITIONING

### Competitor Comparison

| Feature | Jarvis (Desktop) | Zapier | Make.com | Power Automate | Shortcuts |
|---------|-----------------|--------|---------|-----------------|-----------|
| **Voice Control** | ✅ YES (native) | ❌ NO | ❌ NO | ❌ NO | Limited (iOS) |
| **No-Code Workflows** | ✅ YES (visual) | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| **Local Processing** | ✅ YES (first) | ❌ Cloud only | ❌ Cloud only | ❌ Cloud only | ✅ YES (iOS) |
| **On-Device AI** | ✅ YES (fallback) | ❌ NO | ❌ NO | ✅ YES (limited) | ✅ YES (limited) |
| **App Integrations** | 50+ (growing) | 7000+ | 1000+ | 600+ | 200+ |
| **On-Premises** | ✅ YES (M6+) | ❌ NO | ❌ NO | ✅ YES (expensive) | ❌ NO |
| **ARPU** | ₹1200 | $29–99 | $10–50 | $15–50 | Free (iOS only) |
| **Positioning** | Voice + Local | API-first automation | No-code visual | Enterprise process | iOS shortcuts |

**Jarvis Advantage**: Voice + Local-first + No-code + Compliance = Unique bundle for professionals.

---

## SECTION 8: CONCLUSION & NEXT STEPS

### Why Windows/Desktop is Strategic After Android MVP

1. **Market Size**: 300M+ professionals in India vs. 500M consumers → higher ARPU = faster to profitability
2. **Lower CAC**: LinkedIn + dev communities are cheaper to acquire than mass-market Android
3. **Enterprise Upsell**: Android proves concept; desktop monetizes via SaaS
4. **Risk De-Risking**: Android MVP validates core tech (voice, LLM, automation); desktop leverages proven components
5. **Talent Pool**: Easier to hire Windows desktop devs in India than Android experts

### Architectural Philosophy (Architect's Final Note)

*"Successful platforms are built on three pillars: (1) clear module boundaries that enable parallel development, (2) proven tech that ships fast without surprises, and (3) scalable infrastructure that grows with usage without breaking the unit economics."*

Jarvis Desktop achieves this via:
- **Modular design** (12 independent modules; desktop can scale from 1 developer to 10)
- **Proven tech stack** (Electron, Puppeteer, Node.js — battle-tested in production at scale)
- **Cost-efficient backend** (plan caching reduces API calls; SQLite + Supabase scales sub-linearly)

---

## APPENDIX: Technical Deep-Dives

### A. Selector Strategy for Robust Element Detection

```typescript
// Fallback priority:
1. Resource ID (Salesforce Form IDs, Jira automation IDs)
2. XPath (standard selectors)
3. CSS selectors (modern web apps)
4. Accessibility text (labels, ARIA)
5. Visual OCR (last resort; slower but works)

// Example: Find "Save" button in Salesforce
const selector: CompositeSelector = [
  { type: "xpath", value: "//button[@type='submit']" },
  { type: "text", value: "Save", matchType: "exact" },
  { type: "visual", description: "Green button labeled Save" }
];
// Try 1 → fail → try 2 → fail → try 3 ← succeeds
```

### B. Performance Optimization: Plan Caching

```
User says: "Extract invoice from email and fill expense report"
1. Hash intent: "extract_invoice_fill_expense"
2. Check cache: HIT
3. Return cached plan (0ms)
4. Execute with variable substitution (email attachment, date, amount)

Without cache: 2–5 seconds (LLM inference)
With cache: <100ms
```

### C. Offline Architecture

```
When network is down:
1. Store automation intent + result in SQLite
2. Execute with cached plans (no cloud planner)
3. Sync results when network restores
4. Handle conflicts (user executed manually while offline?)

SyncStrategy: Last-write-wins with conflict log for audit.
```

---

**Document Status**: ✅ **Ready for Architect Review & Engineering Handoff**

**Next Actions**:
1. [ ] Architect: Review module interfaces for consistency
2. [ ] Dev Lead: Estimate timeline for each module
3. [ ] Product: Validate feature priority (MVP vs. Phase 2)
4. [ ] Infra: Provision development + staging Supabase instances
5. [ ] Security: Conduct threat model review before Phase 1 launch
