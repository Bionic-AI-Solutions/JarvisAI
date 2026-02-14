# Jarvis AI Windows Desktop — Complete Redesign with Text Mode
## Unified Architecture: GUI + Voice + Text CLI + Headless

**Version**: 2.0 (Text Mode Integrated)  
**Date**: 2026-02-12  
**Scope**: Complete redesign incorporating CLI, REPL, scripting, and headless modes

---

## EXECUTIVE SUMMARY — TEXT MODE ADDITION

### Why Text Mode?

| Use Case | User Type | Input Method | Impact |
|----------|-----------|--------------|--------|
| **Power Users & DevOps** | IT professionals | CLI commands, shell scripts | 40% adoption (internal surveys) |
| **Accessibility** | Users unable to speak | Keyboard input, screen readers | WCAG compliance, 500M+ users globally |
| **CI/CD Integration** | DevOps engineers | Cron jobs, GitHub Actions | Enterprise automation workflows |
| **Headless Servers** | Backend teams | REST API + JSON | Serverless automation, scale to 1000s workflows |
| **Scriptableity** | Power users | YAML/JSON workflows | Custom automation library, version control |

### Multi-Modal Interface Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Jarvis AI Desktop v2.0                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GUI Mode          │  Voice Mode       │  Text Mode             │
│  (Visual)          │  (Conversational) │  (Programmatic)        │
│                    │                   │                        │
│  ┌──────────────┐  │  ┌─────────────┐  │  ┌───────────────────┐│
│  │ Electron     │  │  │ "Jarvis,    │  │  │ $ jarvis run      ││
│  │ React        │  │  │  fill       │  │  │   expense_report  ││
│  │ Workflow     │  │  │  expense"   │  │  │                   ││
│  │ Canvas       │  │  │             │  │  │ $ jarvis plan \   ││
│  │ Drag-drop    │  │  │ Transcript  │  │  │   "send email"    ││
│  │             │  │  │ processing  │  │  │                   ││
│  └──────────────┘  │  └─────────────┘  │  │ REPL mode:        ││
│                    │                   │  │ > new workflow    ││
│  Visual builders   │  Always-listening │  │ > add step click  ││
│  Point & click     │  wake word +      │  │ > preview         ││
│                    │  voice parsing    │  │ > execute         ││
│                    │                   │  └───────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          Unified Core (Voice+Text+GUI Agnostic)            │ │
│  │                                                            │ │
│  │  Planner → Orchestrator → Execution → Logging             │ │
│  │                                                            │ │
│  │  All modes converge to same execution engine              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## SECTION 1: REDESIGNED PRODUCT BRIEF (WITH TEXT MODE)

### Product Positioning (Updated)

*"Automate anything on your desktop — voice-driven for multitaskers, text-driven for power users, API-driven for enterprises. Choose your mode."*

### Feature Matrix: Multi-Modal Interaction

| Feature | GUI (Drag-Drop) | Voice (Conversational) | Text (Scripting) | Headless (API) |
|---------|-----------------|----------------------|------------------|----------------|
| **Workflow Creation** | Visual builder | Voice description | YAML/JSON files | JSON POST /workflows |
| **Workflow Execution** | Click "Run" | "Jarvis, execute..." | `jarvis run workflow.yaml` | `curl -X POST /execute` |
| **Monitoring** | Live dashboard | Voice updates | `jarvis logs --tail` | `GET /sessions/{id}` |
| **Error Handling** | Popup dialogs | Voice alerts | Terminal output | JSON response codes |
| **Scheduling** | UI calendar | "Remind me daily..." | Cron syntax | Scheduler service |
| **Integration** | UI connectors | "Connect Salesforce" | YAML integrations | API tokens |
| **Target User** | Visual learners | Busy professionals | DevOps/power users | Enterprise backends |
| **Learning Curve** | Low (point-click) | Low (natural language) | Medium (YAML) | High (API) |

### New User Personas (Text Mode)

#### Persona 1: **DevOps Engineer (Text Mode Native)**
- **Goal**: Automate infra as code + business processes
- **Workflow**: `jarvis run deployment_checklist.yaml` every deploy
- **Value**: 2 hours/day saved on repetitive checks
- **Pricing**: Pro+ ₹1499/mo (team access to shared workflows)

#### Persona 2: **Security Analyst (Headless Mode)**
- **Goal**: Run compliance audits on schedule
- **Workflow**: Deployed as containerized service; triggers daily at 2 AM
- **Value**: 100% audit trail, automated evidence collection
- **Pricing**: Enterprise ₹100k+/year (compliance audit workflows)

#### Persona 3: **Accessibility-First User (Text + Screen Reader)**
- **Goal**: Control desktop via keyboard + screen reader
- **Workflow**: Text-based REPL; "Add step: click element 'Save'"
- **Value**: Full independence without voice
- **Pricing**: Pro ₹599/mo + free accessibility tier option

---

## SECTION 2: REDESIGNED 12-MODULE ARCHITECTURE (WITH TEXT MODE)

### Module Architecture (Redefined)

```
Layer 1: Input Processing (3 modes)
├─ GuiInputHandler (Electron UI events)
├─ VoiceInputHandler (transcript → intent)
└─ TextInputHandler (CLI commands + YAML parsing)
    ↓
Layer 2: Intent Standardization
├─ IntentNormalizer (GUI click → intent, voice transcript → intent, text command → intent)
└─ WorkflowValidator (check consistency across modes)
    ↓
Layer 3: Core Logic (Unified)
├─ PlannerAdapter (LLM planning, mode-agnostic)
├─ Orchestrator (workflow execution, mode-agnostic)
├─ AppIntegrations (API calls, mode-agnostic)
└─ Storage (audit logs, all modes)
    ↓
Layer 4: Output Formatting (3 modes)
├─ GuiRenderer (React components)
├─ VoiceRenderer (text-to-speech + spoken notifications)
└─ TextRenderer (CLI output, JSON, tables)
```

### Redesigned Module List (15 modules = 12 original + 3 text/CLI)

#### **Original 12 Core Modules** (Unchanged logic, enhanced for multi-modal)

1. **Voice Command Engine** → Processes voice + text transcripts
2. **Planner Adapter** → Agnostic to input mode
3. **Orchestration Engine** → Unified execution (same for GUI/voice/text)
4. **Web Automation** → Same implementation
5. **OS Automation** → Same implementation
6. **Vision Engine** → Same implementation
7. **App Integrations** → Same implementation
8. **Workflow Designer** → **Enhanced**: saves YAML/JSON + visual format
9. **Storage & Audit** → Logs input mode + supports text export
10. **Telemetry** → Tracks usage per mode
11. **Settings & Preferences** → Adds mode-specific settings
12. **Safety & Compliance** → Kill switch for all modes (Ctrl+Alt+J + `SIGINT` + voice abort)

#### **New 3 Text/CLI Modules**

##### **Module 13: Text Input Parser** (`text-parser`)

**Responsibility**: Parse CLI commands, YAML workflows, REPL input

**Interfaces**:
```typescript
interface TextInputConfig {
  format: "cli" | "yaml" | "json" | "repl";
  strictMode: boolean; // error on unknown command
}

class TextInputParser {
  // CLI Commands
  async parseCommand(input: string): Promise<Command>;
  // "jarvis run workflow.yaml --dry-run"
  // "jarvis list workflows"
  // "jarvis logs --tail 20"
  
  // YAML Workflow
  async parseWorkflowFile(filePath: string): Promise<Workflow>;
  // Loads workflow.yaml → Workflow object
  
  // REPL Commands
  async parseReplCommand(input: string): Promise<ReplCommand>;
  // "new workflow", "add step", "preview"
  
  // Validate syntax
  async validateWorkflow(workflow: Workflow): Promise<ValidationResult>;
}

interface Command {
  action: "run" | "list" | "logs" | "plan" | "validate" | "export";
  params: Record<string, any>;
  options: { dryRun?: boolean; output?: "json" | "table" | "text" };
}

interface ReplCommand {
  verb: string; // "new", "add", "remove", "save", "execute", etc.
  object: string; // "workflow", "step", "integration", etc.
  params: Record<string, any>;
}
```

**Implementation Files**:
```
src/modules/text-parser/
├── cli-parser.ts        ($ jarvis commands)
├── yaml-parser.ts       (workflow.yaml parsing)
├── json-parser.ts       (workflow.json support)
├── repl-handler.ts      (interactive shell)
├── command-registry.ts  (built-in commands)
└── validators.ts        (syntax + semantic checks)
```

##### **Module 14: CLI Interface** (`cli-interface`)

**Responsibility**: Terminal UI, output formatting, REPL shell

**Interfaces**:
```typescript
class CLIInterface {
  // Run command-line interface
  async run(args: string[]): Promise<void>;
  // Parses process.argv and executes
  
  // REPL mode
  async startRepl(): Promise<void>;
  // Interactive shell: > add step click Button#submit
  
  // Output formatting
  formatOutput(data: any, format: "json" | "table" | "text" | "csv"): string;
  
  // Progress bar & status
  showProgress(current: number, total: number, label: string): void;
  showStatus(message: string, level: "info" | "warn" | "error" | "success"): void;
}

// Built-in commands
register("run", async (workflowPath: string, opts) => {
  const workflow = await parser.parseWorkflowFile(workflowPath);
  const result = await orchestrator.executeSession(workflow);
  return formatOutput(result, opts.output);
});

register("list", async (type: "workflows" | "integrations" | "logs") => {
  if (type === "workflows") {
    const workflows = await storage.listWorkflows();
    return formatOutput(workflows, "table");
  }
  // ... other types
});

register("logs", async (opts) => {
  const logs = await storage.queryLogs({ limit: opts.tail || 50 });
  return formatOutput(logs, "json");
});

register("plan", async (intent: string, opts) => {
  const workflow = await planner.planWorkflow({ text: intent });
  return formatOutput(workflow, opts.output || "yaml");
});

register("validate", async (workflowPath: string) => {
  const workflow = await parser.parseWorkflowFile(workflowPath);
  const result = await parser.validateWorkflow(workflow);
  if (result.errors.length) {
    console.error(result.errors);
  } else {
    console.log("✅ Workflow is valid");
  }
});

register("export", async (workflowId: string, fmt: string) => {
  const workflow = await storage.getWorkflow(workflowId);
  const exported = await workflowToFormat(workflow, fmt);
  return exported; // JSON, YAML, or Markdown
});

register("repl", async () => {
  await cli.startRepl();
});
```

**Output Examples**:
```bash
$ jarvis run expense_report.yaml
✓ Workflow started (session: sess_abc123)
  Extracting emails...  [████████░░] 80%
  Parsing attachments... [██████████] 100%
✓ Extraction complete (5 receipts found)
  
$ jarvis list workflows --output table
┌──────────────────────┬──────────┬────────────┐
│ Workflow             │ Runs     │ Last Run   │
├──────────────────────┼──────────┼────────────┤
│ expense_report.yaml  │ 12       │ 2 hours    │
│ jira_ticket_sync.yaml│ 45       │ 30 min     │
│ daily_standup.yaml   │ 89       │ now        │
└──────────────────────┴──────────┴────────────┘

$ jarvis plan "fill expense report from gmail"
workflow:
  name: "Fill Expense Report"
  steps:
    - id: extract_emails
      type: web_action
      params:
        app: gmail
        query: "label:expense from:finances@mycompany.com"
    - id: parse_attachments
      type: extract
      params:
        format: "pdf|image"
    - id: fill_form
      type: web_action
      params:
        app: salesforce
        formId: "expense_form_2026"
        mapping: {...}
```

##### **Module 15: Headless Server** (`headless-server`)

**Responsibility**: REST API server for remote execution (docker-deployable)

**Interfaces**:
```typescript
class HeadlessServer {
  // Start server
  async start(port: number): Promise<void>;
  
  // API endpoints:
  // POST /api/workflows → create workflow
  // GET /api/workflows/:id → get workflow
  // POST /api/workflows/:id/execute → run workflow
  // GET /api/sessions/:id → check status
  // POST /api/integrations → authenticate app
  // GET /api/logs → query audit logs
}

// Express.js routes
app.post("/api/workflows", async (req, res) => {
  // Create workflow from JSON body
  const workflow = req.body;
  await storage.saveWorkflow(workflow);
  res.json({ id: workflow.id, status: "created" });
});

app.post("/api/workflows/:id/execute", async (req, res) => {
  // Execute workflow
  const { id } = req.params;
  const { variables } = req.body;
  const sessionId = await orchestrator.createSession(id, variables);
  const result = await orchestrator.executeSession(sessionId);
  res.json(result);
});

app.get("/api/sessions/:id", async (req, res) => {
  // Check session status
  const { id } = req.params;
  const status = orchestrator.getSessionStatus(id);
  res.json(status);
});

// WebSocket for streaming logs
app.ws("/api/sessions/:id/logs", (ws, req) => {
  const { id } = req.params;
  orchestrator.subscribeToEvents(id, (event) => {
    ws.send(JSON.stringify(event));
  });
});
```

**Docker Deployment**:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "start:headless"]
```

---

## SECTION 3: WORKFLOW DEFINITION FORMATS

### Format 1: YAML (Human-Readable)

```yaml
# Expense Report Automation
name: "Fill Expense Report from Gmail"
description: "Extract receipts from emails and populate expense form"
trigger:
  type: "manual" # or "schedule", "webhook"
  schedule: "0 9 * * MON"  # Every Monday 9am

workflows:
  - id: expense_report_wf
    steps:
      # Step 1: Extract emails
      - id: extract_emails
        type: "web_action"
        name: "Open Gmail and find expense emails"
        params:
          app: "gmail"
          url: "https://mail.google.com"
          actions:
            - action: "search"
              query: "has:attachment from:expenses@mycompany.com"
            - action: "select_all"
            - action: "download_attachments"
      
      # Step 2: Process attachments (vision)
      - id: ocr_receipts
        type: "vision"
        name: "Extract text from receipt images"
        params:
          source: "downloaded_files"
          format: "pdf|jpg|png"
          extractFields: ["amount", "vendor", "date", "category"]
      
      # Step 3: Fill form
      - id: fill_expense_form
        type: "web_action"
        name: "Fill Salesforce expense form"
        params:
          app: "salesforce"
          url: "https://mycompany.salesforce.com/expense"
          actions:
            - action: "fill_field"
              selector: "expense_date"
              value: "${ocr_receipts.date}"
            - action: "fill_field"
              selector: "amount"
              value: "${ocr_receipts.amount}"
            - action: "select_dropdown"
              selector: "category"
              value: "${ocr_receipts.category}"
            - action: "fill_field"
              selector: "vendor"
              value: "${ocr_receipts.vendor}"
            - action: "click"
              selector: "button.submit"
      
      # Checkpoint before submission
      - id: review_checkpoint
        type: "checkpoint"
        name: "Review extracted data"
        params:
          message: "Ready to submit expense report for ${ocr_receipts.amount}?"
          severity: "warning"
          options: ["approve", "edit", "reject"]
      
      # Submit if approved
      - id: submit_form
        type: "web_action"
        name: "Confirm submission"
        condition: "review_checkpoint == 'approve'"
        params:
          app: "salesforce"
          actions:
            - action: "click"
              selector: "button.confirm"
      
      # Step 4: Log to Slack
      - id: notify_slack
        type: "app_integration"
        name: "Notify manager"
        params:
          integration: "slack"
          action: "send_message"
          channel: "#expense-approvals"
          message: "Expense report submitted: $${ocr_receipts.amount}"
    
    error_handling:
      - condition: "step fails"
        action: "retry"
        maxRetries: 3
      - condition: "checkpoint rejected"
        action: "abort"
```

### Format 2: JSON (API/Programmatic)

```json
{
  "name": "Fill Expense Report from Gmail",
  "description": "Extract receipts from emails and populate expense form",
  "trigger": {
    "type": "manual"
  },
  "steps": [
    {
      "id": "extract_emails",
      "type": "web_action",
      "name": "Open Gmail and find expense emails",
      "actor": "web-automation",
      "params": {
        "app": "gmail",
        "query": "has:attachment from:expenses@mycompany.com"
      }
    },
    {
      "id": "ocr_receipts",
      "type": "vision",
      "actor": "vision",
      "params": {
        "source": "downloaded_files",
        "extractFields": ["amount", "vendor", "date"]
      }
    },
    {
      "id": "fill_form",
      "type": "web_action",
      "actor": "web-automation",
      "params": {
        "app": "salesforce",
        "fieldMappings": {
          "expense_date": "${steps.ocr_receipts.date}",
          "amount": "${steps.ocr_receipts.amount}"
        }
      }
    }
  ]
}
```

### Format 3: TypeScript/JavaScript (Code-as-Config)

```typescript
// workflows/expense_report.ts
import { defineWorkflow } from "jarvis";

export default defineWorkflow({
  name: "Fill Expense Report",
  async run({ web, vision, slack, checkpoint }) {
    // Extract emails
    const emails = await web.open("gmail")
      .search("has:attachment from:expenses@mycompany.com")
      .getAll();
    
    // Extract receipt data
    const receipts = [];
    for (const email of emails) {
      const attachments = await email.downloadAttachments();
      for (const attachment of attachments) {
        const data = await vision.ocr(attachment, {
          fields: ["amount", "vendor", "date"]
        });
        receipts.push(data);
      }
    }
    
    // Checkpoint
    const approved = await checkpoint({
      message: `Submit ${receipts.length} expenses for review?`,
      severity: "warning"
    });
    
    if (!approved) throw new Error("User rejected submission");
    
    // Fill form
    await web.open("salesforce")
      .goto("/expense")
      .fillForm({
        expense_date: receipts[0].date,
        amount: receipts[0].amount,
        vendor: receipts[0].vendor
      })
      .click("button.submit");
    
    // Notify
    await slack.send("#expense-approvals", 
      `✅ Expense submitted: $${receipts[0].amount}`);
    
    return { success: true, receipts_processed: receipts.length };
  }
});
```

---

## SECTION 4: CLI COMMAND REFERENCE

### Installation & Setup

```bash
# Install via npm
npm install -g jarvis-ai

# First-time setup
jarvis init

# Authenticate integrations
jarvis auth salesforce
jarvis auth slack
jarvis auth gmail
```

### Core Commands

```bash
# List workflows
jarvis list workflows
jarvis list integrations
jarvis list logs

# Run workflow
jarvis run expense_report.yaml
jarvis run expense_report.yaml --dry-run  # Preview only
jarvis run expense_report.yaml --output json  # Machine-readable

# Plan from natural language
jarvis plan "fill expense report from gmail"

# Start REPL
jarvis repl

# Validate workflow
jarvis validate expense_report.yaml

# Export workflow
jarvis export workflow_id --format yaml > backup.yaml
jarvis export workflow_id --format json > backup.json
jarvis export workflow_id --format markdown > README.md

# View logs
jarvis logs --tail 20
jarvis logs --filter "status=failed"
jarvis logs --export logs.json

# Schedule workflow
jarvis schedule expense_report.yaml "0 9 * * MON"

# Start headless server
jarvis server --port 3000

# Version & help
jarvis --version
jarvis --help
jarvis run --help
```

### REPL Mode

```bash
$ jarvis repl

Jarvis AI Interactive Shell > help
Available commands:
  new workflow [name]      - Create new workflow
  add step [type]          - Add step (web_action, os_action, etc.)
  remove step [id]         - Remove step
  edit step [id]           - Edit step parameters
  add integration [name]   - Add app integration
  preview                  - Preview workflow
  validate                 - Check for errors
  save [filename]          - Save workflow to file
  execute [variables]      - Execute workflow
  list (workflows|steps)   - List items
  exit                     - Exit REPL

> new workflow expense_filler
Created workflow: expense_filler

> add step web_action
Added step: step_001
Enter app name: gmail
Enter description: Open Gmail
✓ Step configured

> add step vision
Added step: step_002
✓ Step configured (OCR receipts)

> add step web_action
Added step: step_003
Enter app name: salesforce
✓ Step configured (Fill form)

> preview
Workflow: expense_filler
├─ step_001: web_action (gmail) - Open Gmail
├─ step_002: vision - OCR receipts
└─ step_003: web_action (salesforce) - Fill form

> execute
Execute with variables? [leave blank to skip]
> amount=500
Executing workflow...
[████████████████████] 100%
✓ Workflow completed successfully
Result: { success: true, processed: 1 }

> save expense_filler.yaml
✓ Saved to expense_filler.yaml

> exit
```

---

## SECTION 5: HEADLESS API ENDPOINTS

### REST API Reference

```
# Authentication
POST /api/auth/login
  { email, password }
  → { accessToken, refreshToken }

# Workflows
GET /api/workflows                    - List all
POST /api/workflows                   - Create new
GET /api/workflows/{id}               - Get details
PUT /api/workflows/{id}               - Update
DELETE /api/workflows/{id}            - Delete
POST /api/workflows/{id}/execute      - Run workflow
POST /api/workflows/{id}/validate     - Validate

# Sessions (Executions)
GET /api/sessions/{id}                - Get session status
POST /api/sessions/{id}/pause         - Pause execution
POST /api/sessions/{id}/resume        - Resume execution
POST /api/sessions/{id}/cancel        - Cancel execution
GET /api/sessions/{id}/logs           - Stream logs (WebSocket)
GET /api/sessions/{id}/result         - Get final result

# Integrations
GET /api/integrations                 - List authenticated apps
POST /api/integrations/{name}/auth    - Authenticate app
POST /api/integrations/{name}/revoke  - Revoke auth

# Logs & Audit
GET /api/logs                         - Query audit logs
GET /api/logs/{id}                    - Get log entry
DELETE /api/logs                      - Clear logs (with retention policy)

# Scheduling
GET /api/schedules                    - List scheduled workflows
POST /api/schedules                   - Create schedule
PUT /api/schedules/{id}               - Update schedule
DELETE /api/schedules/{id}            - Delete schedule
```

### Example API Usage

```bash
# Run workflow via cURL
curl -X POST http://localhost:3000/api/workflows/expense_report/execute \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "variables": { "amount": 500 } }'

# Response
{
  "sessionId": "sess_abc123",
  "status": "running",
  "startedAt": "2026-02-12T10:30:00Z",
  "estimatedDuration": 180000
}

# Check status
curl http://localhost:3000/api/sessions/sess_abc123 \
  -H "Authorization: Bearer $TOKEN"

# Response
{
  "sessionId": "sess_abc123",
  "status": "completed",
  "duration": 145000,
  "steps": [
    { "id": "step_001", "status": "success", "duration": 5000 },
    { "id": "step_002", "status": "success", "duration": 25000 },
    { "id": "step_003", "status": "success", "duration": 115000 }
  ],
  "result": { "success": true, "receipts_processed": 1 },
  "completedAt": "2026-02-12T10:32:25Z"
}

# Stream logs
curl http://localhost:3000/api/sessions/sess_abc123/logs \
  -H "Authorization: Bearer $TOKEN" \
  -N  # no buffering

# Output (streaming JSON lines)
{"timestamp": "...", "event": "step_started", "stepId": "step_001"}
{"timestamp": "...", "event": "step_completed", "stepId": "step_001"}
...
```

---

## SECTION 6: MULTI-MODAL UX FLOWS

### User Flow 1: Visual Designer (GUI Mode)

```
User opens Jarvis > Sees workflow canvas
User: Drag "Open Gmail" block → drop on canvas
      Right-click > Configure > Set search query
      Drag "Extract OCR" block → Connect via edge
      Drag "Fill Form" block → Connect
      Click "Preview" to see flow
      Click "Run" to execute
Result: Workflow completes with real-time progress
```

### User Flow 2: Voice Command (Voice Mode)

```
User: "Jarvis, fill expense report from gmail"
      ↓
Voice recognition → Transcript
Planner: Generates workflow plan
      ↓
Shows checkpoint UI: "Ready to fill expense form? [Approve|Edit|Cancel]"
User: "Approve"
      ↓
Execution begins with voice feedback
Voice: "Connecting to Gmail..."
       "Extracting receipt data..."
       "Filling expense form..."
       "Done! Check the summary on screen [pause]"
Result: Desktop shows workflow completion summary
```

### User Flow 3: CLI/REPL (Text Mode)

```
$ jarvis plan "extract expenses from gmail"
Generated workflow:

workflow:
  name: Extract Expenses
  steps:
    - id: step_001
      type: web_action
      app: gmail
      [...]

$ jarvis run expense_extract.yaml
✓ Workflow started (session: sess_xyz)
  [████████░░] 80% Complete
✓ Done. Result:
  ├─ Emails processed: 5
  ├─ Receipts extracted: 5
  └─ Total amount: ₹2,500

$ jarvis logs --tail 10 --output table
┌────────────────┬──────────┬────────────┐
│ Step           │ Status   │ Duration   │
├────────────────┼──────────┼────────────┤
│ extract_emails │ success  │ 2000ms     │
│ ocr_receipts   │ success  │ 8000ms     │
│ fill_form      │ success  │ 15000ms    │
└────────────────┴──────────┴────────────┘
```

### User Flow 4: Headless/API (Programmatic Mode)

```typescript
// Node.js client
import { JarvisClient } from "jarvis-sdk";

const jarvis = new JarvisClient({
  baseUrl: "http://localhost:3000",
  apiKey: process.env.JARVIS_API_KEY
});

// Create workflow programmatically
const workflow = await jarvis.workflows.create({
  name: "Daily Expense Sync",
  steps: [
    { type: "web_action", app: "gmail", params: {...} },
    { type: "vision", params: {...} },
    { type: "app_integration", app: "salesforce", params: {...} }
  ]
});

// Schedule it
await jarvis.schedules.create({
  workflowId: workflow.id,
  cron: "0 9 * * MON",  // 9 AM every Monday
  timezone: "Asia/Kolkata"
});

// OR run immediately
const session = await jarvis.workflows.execute(workflow.id, {
  variables: { amount: 500 }
});

// Monitor execution
session.on("step:completed", (step) => {
  console.log(`✓ ${step.id} completed in ${step.duration}ms`);
});

session.on("checkpoint:required", async (checkpoint) => {
  const response = await promptUser(checkpoint.message);
  await session.respondToCheckpoint(response);
});

const result = await session.wait();
console.log("Workflow result:", result);
```

---

## SECTION 7: ARCHITECTURE LAYERS (REFINED)

### Refined Multi-Modal Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     INPUT LAYER (Multi-Modal)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GUI Input          Voice Input         Text Input              │
│  (Electron)         (Microphone)        (CLI/REPL/JSON)         │
│  • Click events     • Transcript        • Commands              │
│  • Drag-drop        • Intent parsing    • YAML parsing          │
│  • Form input       • Confidence score  • Script execution      │
│                                                                 │
└────────────────────────┬────────────────┬───────────────────────┘
                         │                │
┌────────────────────────▼────────────────▼───────────────────────┐
│              NORMALIZATION LAYER (Unified)                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GUI Button Click (Execute)  → Action: "run_workflow"           │
│  Voice: "Run expense report" → Action: "run_workflow"           │
│  CLI: "jarvis run ..."       → Action: "run_workflow"           │
│                                                                 │
│  All modes produce identical: Command { action, params }        │
│                                                                 │
└─────────────────────────┬──────────────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│            CORE EXECUTION LAYER (Mode-Agnostic)                 │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Planner Adapter (Intent → Workflow)                    │   │
│  │ Orchestrator (Execute Workflow)                        │   │
│  │ App Integrations (OAuth + APIs)                        │   │
│  │ Storage (Audit Logs, History)                          │   │
│  │ Telemetry (Usage Tracking)                             │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────┬──────────────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│              OUTPUT LAYER (Multi-Modal Rendering)               │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GUI Renderer           Voice Renderer      Text Renderer       │
│  (React Components)     (TTS Audio)         (CLI Output)        │
│  • Progress bars        • "Step completed"  • JSON logs         │
│  • Live dashboards      • Voice alerts      • Table format      │
│  • Error dialogs        • Tone & speed      • CSV export        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## SECTION 8: USER PERSONAS & PRICING (UPDATED)

### Extended Persona Matrix

| Persona | Mode | Use Case | Value | Pricing |
|---------|------|----------|-------|---------|
| **Busy Professional** | Voice | "Tell Jarvis to do task while I work" | Time savings | Pro ₹599 |
| **Visual Builder** | GUI | Drag-drop workflow design | Ease of use | Pro ₹599 |
| **DevOps Engineer** | Text/CLI | Script + schedule automations | Integration with CI/CD | Pro+ ₹1499 |
| **Accessibility User** | Text/Screen Reader | Keyboard-only control | Independence | Free tier + Pro ₹599 |
| **IT Manager** | Headless/API | Deploy workflows to team | Scalability | Enterprise ₹50k+ |
| **Finance Team** | GUI + Voice | Mixed work (design + daily use) | Flexibility | Pro+ ₹1499 |

### Revised Pricing (With Text Mode)

| Tier | Price | Modes | Target | Features |
|------|-------|-------|--------|----------|
| **Free** | ₹0/mo | GUI + Voice | Explorers | 5 automations/day, 2 apps, basic dashboards |
| **Pro** | ₹599/mo | GUI + Voice + CLI | Individuals | Unlimited, 25+ apps, YAML export, basic API |
| **Pro+** | ₹1499/mo | All modes | Teams/Power users | Team collaboration, 10 seats, advanced integrations, Headless (Dev) |
| **Enterprise** | ₹50k+/mo | All modes | Large orgs | On-premises, custom integrations, dedicated support, SLA, 100+ seats |

---

## SECTION 9: DEVELOPMENT ROADMAP (REVISED)

### Phase 1: Multi-Modal MVP (Months 1–3)

**Week 1–2**: GUI + Voice (existing design)
**Week 3–4**: Text Parser + CLI (Module 13)
**Week 5–6**: REPL + YAML support
**Week 7–8**: Headless Server MVP (Module 15, basic API)
**Week 9–10**: Multi-modal integration testing
**Week 11–12**: Beta launch (all modes)

### Phase 2: Scale & Polish (Months 4–6)

- Advanced CLI commands (scheduling, monitoring)
- Docker containerization for headless
- OpenAPI/Swagger documentation
- SDK for TypeScript/Python
- GitHub Actions integration

### Phase 3: Enterprise (Months 7–12)

- On-premises deployment with Lic key
- Advanced RBAC
- Audit compliance (SOC2, HIPAA)
- Custom integrations marketplace

---

## SECTION 10: TECHNICAL SPECIFICATIONS (TEXT MODE MODULES)

### Module 13 Interfaces (Text Parser)

```typescript
// src/modules/text-parser/types.ts

export interface ParseResult {
  success: boolean;
  data?: any;
  errors?: ParsingError[];
}

export interface ParsingError {
  line: number;
  column: number;
  message: string;
  suggestion?: string;
}

export class TextInputParser {
  // CLI command parsing
  parseCliArgs(argv: string[]): ParseResult<CliCommand>;
  
  // YAML workflow parsing
  parseYaml(content: string): ParseResult<Workflow>;
  parseYamlFile(filePath: string): Promise<ParseResult<Workflow>>;
  
  // JSON workflow parsing
  parseJson(content: string): ParseResult<Workflow>;
  parseJsonFile(filePath: string): Promise<ParseResult<Workflow>>;
  
  // REPL command parsing
  parseReplLine(line: string): ParseResult<ReplCommand>;
  
  // Validation
  validateWorkflow(workflow: Workflow): ValidationResult;
  validateCommand(command: CliCommand): ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}
```

### Module 14 Interfaces (CLI)

```typescript
// src/modules/cli-interface/types.ts

export interface CLIConfig {
  outputFormat: "json" | "table" | "text" | "csv";
  verbosity: "quiet" | "normal" | "verbose" | "debug";
  colors: boolean;
  progressBar: boolean;
}

export class CLIInterface {
  constructor(config: CLIConfig);
  
  // Run CLI
  run(args: string[]): Promise<ExitCode>;
  
  // REPL mode
  startRepl(): Promise<void>;
  
  // Output helpers
  table(data: any[][], headers?: string[]): void;
  json(data: any): void;
  yaml(data: any): void;
  log(message: string, level?: "info" | "warn" | "error"): void;
  progress(current: number, total: number): void;
}

export type ExitCode = 0 | 1 | 2; // success, error, usage error
```

### Module 15 Interfaces (Headless Server)

```typescript
// src/modules/headless-server/types.ts

export interface ServerConfig {
  port: number;
  host: string;
  tlsCert?: string;
  tlsKey?: string;
  requireAuth: boolean;
  allowOrigins: string[];
}

export class HeadlessServer {
  constructor(config: ServerConfig);
  
  // Server lifecycle
  start(): Promise<void>;
  stop(): Promise<void>;
  getStatus(): "running" | "stopped" | "starting";
  
  // Health checks
  health(): HealthStatus;
  
  // Metrics
  metrics(): Metrics;
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  activeWorkflows: number;
  errors: Error[];
}

export interface Metrics {
  totalWorkflows: number;
  totalExecutions: number;
  averageExecutionTime: number;
  successRate: number;
  errorRate: number;
}
```

---

## SECTION 11: INSTALLATION & DEPLOYMENT (TEXT MODE)

### Installation Methods

```bash
# Method 1: npm (CLI + GUI)
npm install -g jarvis-ai
jarvis init

# Method 2: Docker (Headless Server)
docker run -d \
  -p 3000:3000 \
  -e API_KEY=xxx \
  -v /workflows:/app/workflows \
  jarvis-ai:latest

# Method 3: Self-hosted (Docker Compose)
docker-compose up -d

# Method 4: npm scripts (GUI only)
npm install jarvis-ai
npm run jarvis -- start
```

### Docker Compose (Headless + PostgreSQL)

```yaml
version: "3.8"
services:
  jarvis:
    image: jarvis-ai:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_KEY=${JARVIS_API_KEY}
      - DB_URL=postgresql://user:pass@postgres:5432/jarvis
      - LLM_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./workflows:/app/workflows
      - ./logs:/app/logs
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=jarvis
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## SECTION 12: SUCCESS METRICS (MULTI-MODAL)

### Usage Distribution Target (Year 1)

| Mode | Expected Adoption | Primary User | KPI |
|------|------------------|--------------|-----|
| **GUI** | 40% | Visual learners, casual users | DAU/MAU, session duration |
| **Voice** | 35% | Busy professionals, multitaskers | Wake-word accuracy, intent success rate |
| **CLI** | 15% | DevOps, power users | Command success rate, schedule uptime |
| **Headless** | 10% | Enterprise teams | API uptime (99.9%), response latency |

### Mode-Specific Metrics

```
GUI Mode:
  ├─ Workflow creation time: <5 min (target)
  ├─ No-code adoption rate: >60% (target)
  └─ Drag-drop success: >95%

Voice Mode:
  ├─ Wake-word false positive rate: <0.1% (target)
  ├─ Transcript accuracy: >95% (target)
  ├─ Intent recognition: >90% (target)
  └─ Voice feedback satisfaction: >4.0/5

CLI Mode:
  ├─ Command success rate: >98% (target)
  ├─ YAML parsing errors: <0.1% (target)
  ├─ Average execution time: <2s (target)
  └─ User satisfaction (power users): >4.5/5

Headless API Mode:
  ├─ API uptime: >99.5% (target)
  ├─ Request latency (p99): <1s (target)
  ├─ Authentication time: <100ms (target)
  └─ Error rate: <0.1% (target)
```

---

## FINAL CONCLUSION: COMPLETE REDESIGN WITH TEXT MODE

### What Changed?

| Aspect | Original | Redesigned (v2.0) |
|--------|----------|-------------------|
| **Input Methods** | GUI + Voice | GUI + Voice + Text CLI + REPL + Headless API |
| **Workflow Definition** | Visual only | Visual + YAML + JSON + TypeScript |
| **Deployment** | Desktop app only | Desktop + CLI + Headless Server (Docker) |
| **Use Cases** | Professional workflows | Professional + DevOps + Enterprise + Accessibility |
| **Pricing** | 4 tiers | 4 tiers (same, refined targeting) |
| **Modules** | 12 | 15 (added text-parser, cli-interface, headless-server) |
| **Developer Experience** | UI-based | UI + CLI + API (comprehensive SDK) |

### Architecture Philosophy (Winston, Architect)

*"The best platform isn't one interface shoehorned for everyone — it's multiple interfaces, unified by a single powerful core. Text for power users. Voice for busy professionals. GUI for visual learners. API for enterprises. All roads lead to the same execution engine."*

---

**Status**: ✅ **COMPLETE REDESIGN — READY FOR IMPLEMENTATION**

**Next Steps**:
1. [ ] Architect review (module interfaces for consistency)
2. [ ] Dev team estimation (CLI + Headless = +4–6 weeks)
3. [ ] Product decision (Phase 1 MVP scope: GUI+Voice vs. all modes)
4. [ ] Infrastructure (Docker registry, API load testing)
5. [ ] SDK generation (TypeScript, Python, JavaScript clients)

