# Jarvis AI Text Mode — Practical Implementation Guide
## Real-World Use Cases & Code Examples

**Version**: 2.0 (Text Mode Implementation Examples)  
**Date**: 2026-02-12

---

## SECTION 1: WORKFLOW FILE EXAMPLES

### Example 1: Expense Report Automation (YAML Format)

**File: `workflows/expense_report.yaml`**

```yaml
name: "Fill Expense Report from Gmail"
description: "Extract receipts from Gmail and populate expense form in Salesforce"

trigger:
  type: "manual"
  # Un-comment to schedule weekly
  # type: "schedule"
  # cron: "0 9 * * MON"
  # timezone: "Asia/Kolkata"

variables:
  - name: "email_filter"
    type: "string"
    default: "has:attachment from:finance@company.com"
    description: "Gmail search query to find expense emails"
  
  - name: "max_amount"
    type: "number"
    default: 50000
    description: "Maximum expense amount (validation)"

steps:
  # Step 1: Open Gmail and search
  - id: "search_emails"
    type: "web_action"
    name: "Search Gmail for expense emails"
    params:
      app: "gmail"
      url: "https://mail.google.com"
      selectors:
        - type: "xpath"
          value: "//input[@aria-label='Search mail']"
      actions:
        - action: "click"
          selector:
            type: "xpath"
            value: "//input[@aria-label='Search mail']"
        
        - action: "type"
          text: "${email_filter}"
          delay: 100
        
        - action: "press_key"
          key: "Return"
          delay: 2000
    timeout: 10000
    retry:
      maxAttempts: 3
      backoffMs: 1000

  # Step 2: Download attachments
  - id: "download_attachments"
    type: "web_action"
    name: "Download receipt attachments"
    params:
      app: "gmail"
      actions:
        - action: "select_all"
        - action: "download_attachments"
          format: "pdf|jpg|png"
    depends_on: "search_emails"
    timeout: 30000

  # Step 3: Extract data using vision (OCR)
  - id: "ocr_receipts"
    type: "vision"
    name: "Extract text and amounts from receipts"
    actor: "vision"
    params:
      source: "temp_directory"
      format: "pdf|jpg|png"
      extractFields:
        - amount
        - vendor
        - date
        - category
        - tax
      confidence_threshold: 0.85
    timeout: 60000

  # Step 4: Open Salesforce expense form
  - id: "open_salesforce_form"
    type: "web_action"
    name: "Open Salesforce expense form"
    params:
      app: "salesforce"
      url: "https://mycompany.salesforce.com/expense"
      wait_for_element:
        type: "xpath"
        value: "//button[contains(text(), 'New Expense')]"
      actions:
        - action: "click"
          selector:
            type: "xpath"
            value: "//button[contains(text(), 'New Expense')]"
    timeout: 15000
    depends_on: "ocr_receipts"

  # Step 5: Fill form fields
  - id: "fill_form"
    type: "web_action"
    name: "Fill expense form with OCR data"
    params:
      app: "salesforce"
      actions:
        # Fill date
        - action: "fill_field"
          selector:
            type: "css"
            value: "input[name='expense_date']"
          value: "${steps.ocr_receipts.date}"
        
        # Fill amount
        - action: "fill_field"
          selector:
            type: "css"
            value: "input[name='amount']"
          value: "${steps.ocr_receipts.amount}"
          validation:
            type: "number"
            min: 0
            max: "${max_amount}"
        
        # Fill vendor
        - action: "fill_field"
          selector:
            type: "css"
            value: "input[name='vendor']"
          value: "${steps.ocr_receipts.vendor}"
        
        # Select category
        - action: "select_dropdown"
          selector:
            type: "css"
            value: "select[name='category']"
          value: "${steps.ocr_receipts.category}"
        
        # Fill tax
        - action: "fill_field"
          selector:
            type: "css"
            value: "input[name='tax']"
          value: "${steps.ocr_receipts.tax}"
    
    depends_on: "open_salesforce_form"
    timeout: 20000

  # Step 6: Checkpoint - review before submission
  - id: "review_checkpoint"
    type: "checkpoint"
    name: "Review extracted data"
    params:
      message: |
        Ready to submit expense?
        Amount: ${steps.ocr_receipts.amount}
        Vendor: ${steps.ocr_receipts.vendor}
        Date: ${steps.ocr_receipts.date}
      severity: "critical"
      timeout: 300000  # 5 minute timeout for user
      options:
        - label: "Approve"
          value: "approve"
        - label: "Edit"
          value: "edit"
        - label: "Reject"
          value: "reject"
    depends_on: "fill_form"

  # Step 7: Conditional submit (only if approved)
  - id: "submit_form"
    type: "web_action"
    name: "Submit expense form"
    condition: "${steps.review_checkpoint.response} == 'approve'"
    params:
      app: "salesforce"
      actions:
        - action: "click"
          selector:
            type: "xpath"
            value: "//button[contains(text(), 'Submit')]"
        - action: "wait"
          time: 2000
    depends_on: "review_checkpoint"
    timeout: 15000

  # Step 8: Notify via Slack
  - id: "notify_slack"
    type: "app_integration"
    name: "Notify manager in Slack"
    condition: "${steps.review_checkpoint.response} == 'approve'"
    actor: "app-integrations"
    params:
      integration: "slack"
      method: "send_message"
      channel: "#expense-approvals"
      message: |
        ✅ Expense submitted successfully!
        Amount: ₹${steps.ocr_receipts.amount}
        Vendor: ${steps.ocr_receipts.vendor}
        Submitted by: ${current_user.email}
      mention_user: false
    depends_on: "submit_form"
    timeout: 5000

  # Step 9: Log audit event
  - id: "log_audit"
    type: "web_action"
    name: "Log to company audit system"
    params:
      app: "internal_api"
      url: "https://api.internal.com/audit"
      method: "POST"
      payload:
        action: "expense_submitted"
        amount: "${steps.ocr_receipts.amount}"
        timestamp: "${now()}"
        user_id: "${current_user.id}"

error_handling:
  - condition: "step fails"
    action: "retry"
    maxRetries: 2
    backoffMs: 1000
  
  - condition: "step_id == 'ocr_receipts' && fails"
    action: "skip"
    message: "Could not read receipts, skipping OCR validation"
  
  - condition: "step_id == 'review_checkpoint' && rejected"
    action: "abort"
    message: "User rejected submission"

post_execution:
  - type: "log_result"
    params:
      include_screenshot: false
      include_logs: true
  
  - type: "cleanup"
    params:
      delete_temp_files: true
      close_browsers: true
```

### Example 2: Jira Ticket Sync (YAML Format)

```yaml
name: "Daily Jira Ticket Sync to Spreadsheet"
description: "Sync open Jira tickets to Google Sheets for reporting"

trigger:
  type: "schedule"
  cron: "0 8 * * MON-FRI"  # Every weekday at 8 AM

steps:
  - id: "auth_jira"
    type: "app_integration"
    name: "Authenticate with Jira"
    params:
      integration: "jira"
      method: "get_tickets"
      query: "project = PROJ AND status NOT IN (Done, Closed) AND assignee = currentUser()"

  - id: "auth_sheets"
    type: "app_integration"
    name: "Authenticate with Google Sheets"
    params:
      integration: "google_sheets"
      method: "open_sheet"
      sheetId: "${process.env.GOOGLE_SHEET_ID}"

  - id: "sync_tickets"
    type: "os_action"
    name: "Process and sync tickets"
    params:
      script: |
        const jiraTickets = ${steps.auth_jira.result};
        const rows = jiraTickets.map(ticket => [
          ticket.key,
          ticket.summary,
          ticket.status,
          ticket.assignee,
          ticket.dueDate
        ]);
        return rows;

  - id: "write_to_sheet"
    type: "web_action"
    name: "Write to Google Sheet"
    params:
      app: "google_sheets"
      action: "clear_and_write"
      range: "A1:E100"
      data: "${steps.sync_tickets.result}"

  - id: "format_sheet"
    type: "web_action"
    name: "Format sheet (headers, colors)"
    params:
      app: "google_sheets"
      actions:
        - action: "freeze_rows"
          count: 1
        - action: "auto_resize_columns"
        - action: "format_header"
          row: 1
          background_color: "#1F497D"
          text_color: "#FFFFFF"
          bold: true

error_handling:
  - condition: "auth fails"
    action: "alert"
    message: "Failed to authenticate with Jira or Google Sheets"
```

### Example 3: TypeScript Workflow (Programmatic)

**File: `workflows/expense_report.ts`**

```typescript
import { defineWorkflow } from "@jarvis/workflows";
import { WebAutomation, Vision, Telemetry } from "@jarvis/modules";

export const expenseReportWorkflow = defineWorkflow({
  name: "Fill Expense Report",
  
  async run({ 
    web,           // WebAutomation instance
    vision,        // Vision instance
    slack,         // App integration helper
    checkpoint,    // Safety checkpoint
    telemetry,     // Usage tracking
    context
  }) {
    
    telemetry.trackEvent("workflow_started", { 
      workflow: "expense_report" 
    });

    try {
      // Step 1: Open Gmail
      const gmailTab = await web.open("gmail", {
        url: "https://mail.google.com",
        waitForLoad: true
      });

      // Step 2: Search for expense emails
      await gmailTab.click("[aria-label='Search mail']");
      await gmailTab.type("has:attachment from:finance");
      await gmailTab.pressKey("Enter");
      await gmailTab.waitFor(2000);

      // Step 3: Download attachments
      const attachments = await gmailTab.downloadAttachments({
        formats: ["pdf", "jpg", "png"],
        destination: "/tmp/receipts"
      });

      telemetry.trackEvent("attachments_downloaded", { 
        count: attachments.length 
      });

      // Step 4: Extract receipt data via vision
      const receipts: ReceiptData[] = [];
      
      for (const filePath of attachments) {
        const ocrResult = await vision.ocr(filePath, {
          extractFields: ["amount", "vendor", "date", "tax"],
          confidence: 0.85
        });

        if (ocrResult.success) {
          receipts.push({
            path: filePath,
            amount: ocrResult.fields.amount,
            vendor: ocrResult.fields.vendor,
            date: ocrResult.fields.date,
            tax: ocrResult.fields.tax
          });
        }
      }

      // Step 5: Validate amounts
      for (const receipt of receipts) {
        if (receipt.amount > 50000) {
          throw new Error(`Amount exceeds limit: ${receipt.amount}`);
        }
      }

      // Step 6: Open Salesforce
      const sfTab = await web.open("salesforce", {
        url: "https://mycompany.salesforce.com/expense"
      });

      // Step 7: Fill form for each receipt
      for (let i = 0; i < receipts.length; i++) {
        const receipt = receipts[i];

        if (i > 0) {
          // Click "Add Another" button
          await sfTab.click("[data-testid='add-expense-button']");
          await sfTab.waitFor(1000);
        }

        // Fill form fields
        await sfTab.fillForm({
          "expense_date": receipt.date,
          "amount": receipt.amount,
          "vendor": receipt.vendor,
          "tax": receipt.tax,
          "category": "Travel" // Configurable
        });

        telemetry.trackEvent("form_filled", { 
          index: i,
          amount: receipt.amount 
        });
      }

      // Step 8: Checkpoint - Ask user to review
      const approved = await checkpoint({
        title: "Review Expense Report",
        message: `Ready to submit ${receipts.length} expense(s) totaling ₹${
          receipts.reduce((sum, r) => sum + parseFloat(r.amount), 0).toFixed(2)
        }?`,
        severity: "critical",
        timeout: 5 * 60 * 1000 // 5 minutes
      });

      if (!approved) {
        throw new Error("User cancelled expense submission");
      }

      // Step 9: Submit form
      await sfTab.click("[data-testid='submit-button']");
      await sfTab.waitFor(3000);

      // Step 10: Verify success
      const confirmation = await sfTab.findElement("[data-testid='success-message']");
      if (!confirmation) {
        throw new Error("Submission may have failed - no confirmation visible");
      }

      // Step 11: Notify via Slack
      await slack.send("#expense-approvals", {
        text: `✅ Expense report submitted`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Expense Report Submitted*\n• *Number of receipts:* ${receipts.length}\n• *Total amount:* ₹${receipts.reduce((sum, r) => sum + parseFloat(r.amount), 0).toFixed(2)}\n• *User:* ${context.user.email}`
            }
          }
        ]
      });

      telemetry.trackEvent("workflow_completed", {
        status: "success",
        receipts_count: receipts.length,
        total_amount: receipts.reduce((sum, r) => sum + parseFloat(r.amount), 0)
      });

      return {
        success: true,
        receipts_processed: receipts.length,
        total_amount: receipts.reduce((sum, r) => sum + parseFloat(r.amount), 0)
      };

    } catch (error) {
      telemetry.trackEvent("workflow_failed", {
        error: error instanceof Error ? error.message : "Unknown error"
      });

      // Notify user of failure
      await slack.send(context.user.email, {
        text: `❌ Expense report workflow failed: ${error instanceof Error ? error.message : "Unknown error"}`
      });

      throw error;
    }
  }
});

// Type definitions
interface ReceiptData {
  path: string;
  amount: string;
  vendor: string;
  date: string;
  tax: string;
}
```

---

## SECTION 2: CLI USAGE EXAMPLES

### Basic Commands

```bash
# Install
npm install -g jarvis-ai

# First run - setup
jarvis init

# Authenticate with apps
jarvis auth gmail
jarvis auth salesforce
jarvis auth slack

# Run workflow
jarvis run workflows/expense_report.yaml

# Run with dry-run (preview only)
jarvis run workflows/expense_report.yaml --dry-run

# Run with specific output format
jarvis run workflows/expense_report.yaml --output json > result.json
jarvis run workflows/expense_report.yaml --output yaml > result.yaml

# List all workflows
jarvis list workflows

# List integrations
jarvis list integrations

# View recent logs
jarvis logs --tail 50
jarvis logs --filter "status=failed"
jarvis logs --output json > audit.json

# Validate workflow file
jarvis validate workflows/expense_report.yaml

# Export workflow
jarvis export expense_report --format yaml > backup.yaml
jarvis export expense_report --format json > backup.json
jarvis export expense_report --format markdown > README.md

# Plan workflow from natural language
jarvis plan "Fill expense report from gmail"

# Schedule workflow to run daily
jarvis schedule workflows/daily_standup.yaml "0 9 * * *"

# View version
jarvis --version

# Get help
jarvis --help
jarvis run --help
```

### Advanced Examples

```bash
# Run workflow and wait for completion (blocking)
jarvis run expense_report.yaml --wait --timeout 300

# Run with variable override
jarvis run expense_report.yaml \
  --var email_filter="from:manager@company.com" \
  --var max_amount=100000

# Run and capture metrics
jarvis run expense_report.yaml \
  --metrics \
  --output json | jq '.metrics'

# Run multiple workflows in sequence
jarvis run workflow1.yaml && jarvis run workflow2.yaml

# Run workflow and watch logs in real-time
jarvis run expense_report.yaml --watch-logs

# Export workflow execution as HTML report
jarvis logs --export report.html --format html

# Clean old logs (keep last 30 days)
jarvis logs --cleanup --days 30

# Backup all workflows
jarvis export "*" --format yaml --output workflows-backup/

# Compare two workflow versions
jarvis diff workflow-v1.yaml workflow-v2.yaml
```

---

## SECTION 3: REPL MODE EXAMPLES

### Interactive Workflow Building

```bash
$ jarvis repl

Welcome to Jarvis AI REPL
> help

Available REPL Commands:
  new workflow [name]      - Create new workflow
  add step [type]          - Add automation step
  remove step [id]         - Remove step by ID
  edit step [id]           - Edit step parameters
  list steps               - List all steps in current workflow
  add integration [name]   - Add app integration
  preview                  - Preview workflow structure
  validate                 - Validate workflow for errors
  save [filename]          - Save workflow to YAML file
  execute [variables]      - Run workflow immediately
  clear                    - Clear current workflow
  exit                     - Exit REPL

> new workflow daily_report
Created workflow: daily_report

> add step web_action
Step ID: step_001
Step type: web_action
Enter app name: gmail
Enter description (optional): Open Gmail and search inbox
✓ Step added

> add step web_action
Step ID: step_002
Enter app name: salesforce
Enter description (optional): Open Salesforce reports
✓ Step added

> add step app_integration
Step ID: step_003
Enter integration name: slack
Integration method: send_message
Channel: #daily-reports
✓ Step added

> list steps
┌──────────┬──────────────┬────────────────────────┐
│ Step ID  │ Type         │ Description            │
├──────────┼──────────────┼────────────────────────┤
│ step_001 │ web_action   │ Open Gmail             │
│ step_002 │ web_action   │ Open Salesforce        │
│ step_003 │ app_integ    │ Send Slack message     │
└──────────┴──────────────┴────────────────────────┘

> edit step step_001
Current params: {"app": "gmail", ...}
New description: Check Gmail for reports
✓ Updated

> preview
Workflow: daily_report
├─ step_001: web_action (gmail) - Check Gmail for reports
├─ step_002: web_action (salesforce) - Open Salesforce reports
└─ step_003: app_integration (slack) - Send Slack message

> save daily_report.yaml
✓ Saved to daily_report.yaml

> execute
Execute workflow immediately? [Y/n] y
Executing: daily_report
[████████████████████] 100%
✓ Workflow completed
Execution time: 45s
Result: { success: true, steps_completed: 3 }

> exit
Goodbye!
```

---

## SECTION 4: HEADLESS SERVER EXAMPLES

### Start Server

```bash
# Start development server
jarvis server --port 3000 --host localhost

# Start production server with auth
jarvis server \
  --port 3000 \
  --host 0.0.0.0 \
  --require-auth \
  --api-key-env JARVIS_API_KEY

# Start via Docker
docker run -d \
  -p 3000:3000 \
  -e API_KEY=your-secret-key \
  -v $(pwd)/workflows:/app/workflows \
  jarvis-ai:latest

# Check server health
curl http://localhost:3000/health
# Response: {"status":"ok","uptime":1234.56}
```

### API Usage Examples

```bash
# Create a workflow via API
curl -X POST http://localhost:3000/api/workflows \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workflow",
    "steps": [
      {"type": "web_action", "app": "gmail", "params": {...}}
    ]
  }'

# List workflows
curl http://localhost:3000/api/workflows \
  -H "X-API-Key: your-api-key"

# Execute workflow
curl -X POST http://localhost:3000/api/workflows/expense_report/execute \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"variables": {"email_filter": "from:mgr"}}'

# Response
{
  "sessionId": "sess_abc123",
  "status": "started",
  "startedAt": "2026-02-12T10:30:00Z",
  "estimatedDuration": 180000
}

# Check execution status
curl http://localhost:3000/api/sessions/sess_abc123 \
  -H "X-API-Key: your-api-key"

# Stream logs
curl -N http://localhost:3000/api/sessions/sess_abc123/logs \
  -H "X-API-Key: your-api-key"

# Output (streaming JSON lines)
{"timestamp":"...", "event":"step_started", "stepId":"step_001"}
{"timestamp":"...", "event":"step_completed", "stepId":"step_001", "duration":5000}
...
```

### Node.js SDK Usage

```typescript
// npm install jarvis-sdk

import { JarvisClient } from "jarvis-sdk";

const jarvis = new JarvisClient({
  baseUrl: "http://localhost:3000",
  apiKey: process.env.JARVIS_API_KEY
});

// Create and run workflow
async function runExpenseReport() {
  // Get workflow
  const workflow = await jarvis.workflows.get("expense_report");

  // Run it
  const session = await jarvis.workflows.execute("expense_report", {
    variables: {
      email_filter: "has:attachment from:finance@company.com"
    }
  });

  // Monitor progress
  session.on("step:started", (step) => {
    console.log(`▶️ ${step.name} started`);
  });

  session.on("step:completed", (step) => {
    console.log(`✓ ${step.name} completed in ${step.duration}ms`);
  });

  session.on("checkpoint:required", async (checkpoint) => {
    console.log(`⏸️ Checkpoint: ${checkpoint.message}`);
    const response = await promptUser(checkpoint.options);
    await session.respondToCheckpoint(response);
  });

  session.on("error", (error) => {
    console.error(`✗ Error: ${error.message}`);
  });

  // Wait for completion
  const result = await session.wait();
  console.log("Workflow result:", result);
}

runExpenseReport().catch(console.error);
```

---

## SECTION 5: INTEGRATION WITH CI/CD

### GitHub Actions Example

```yaml
# .github/workflows/daily-expense-sync.yml

name: Daily Expense Report Sync

on:
  schedule:
    - cron: '0 9 * * MON-FRI'  # Every weekday at 9 AM

jobs:
  expense-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install Jarvis
        run: npm install -g jarvis-ai

      - name: Authenticate
        run: |
          jarvis auth gmail --token ${{ secrets.GMAIL_TOKEN }}
          jarvis auth salesforce --token ${{ secrets.SALESFORCE_TOKEN }}

      - name: Run expense report workflow
        run: |
          jarvis run workflows/expense_report.yaml \
            --output json > result.json

      - name: Upload result
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: expense-result
          path: result.json

      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ Expense sync workflow failed'
            })
```

### GitLab CI Example

```yaml
# .gitlab-ci.yml

stages:
  - schedule

daily_expense_report:
  stage: schedule
  image: node:18
  script:
    - npm install -g jarvis-ai
    - jarvis auth gmail --token ${GMAIL_TOKEN}
    - jarvis auth salesforce --token ${SALESFORCE_TOKEN}
    - jarvis run workflows/expense_report.yaml --output json > result.json
  artifacts:
    paths:
      - result.json
  only:
    - schedules
```

---

## SECTION 6: DEPLOYMENT EXAMPLES

### Docker Compose (Complete Stack)

```yaml
# docker-compose.yml

version: '3.8'

services:
  jarvis:
    image: jarvis-ai:latest
    container_name: jarvis-server
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      API_KEY: ${JARVIS_API_KEY}
      DB_URL: postgresql://jarvis:password@postgres:5432/jarvis
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      LOG_LEVEL: info
    volumes:
      - ./workflows:/app/workflows
      - ./logs:/app/logs
      - ./config:/app/config
    depends_on:
      - postgres
      - redis
    networks:
      - jarvis-net
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    container_name: jarvis-db
    environment:
      POSTGRES_DB: jarvis
      POSTGRES_USER: jarvis
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - jarvis-net
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: jarvis-cache
    networks:
      - jarvis-net
    restart: unless-stopped

  # Optional: ngrok for secure tunneling
  ngrok:
    image: ngrok/ngrok:latest
    command: http 3000 --authtoken ${NGROK_AUTH_TOKEN}
    ports:
      - "4040:4040"
    networks:
      - jarvis-net

volumes:
  postgres_data:

networks:
  jarvis-net:
    driver: bridge
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: jarvis-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: jarvis
  template:
    metadata:
      labels:
        app: jarvis
    spec:
      containers:
      - name: jarvis
        image: jarvis-ai:latest
        ports:
        - containerPort: 3000
        env:
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: jarvis-secrets
              key: api-key
        - name: DB_URL
          valueFrom:
            configMapKeyRef:
              name: jarvis-config
              key: db-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: jarvis-service
spec:
  type: LoadBalancer
  selector:
    app: jarvis
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

---

## SECTION 7: ERROR HANDLING & DEBUGGING

### Comprehensive Error Handling in Workflows

```yaml
# workflows/robust_automation.yaml

steps:
  - id: "fetch_data"
    type: "web_action"
    params:
      app: "api"
      url: "https://api.example.com/data"
    
    # Step-level error handling
    error_handler:
      - condition: "network_error"
        action: "retry"
        maxRetries: 3
        backoff: "exponential"
        backoff_initial_ms: 1000
        backoff_max_ms: 10000
      
      - condition: "timeout"
        action: "fallback"
        fallback_step: "fetch_data_cached"
      
      - condition: "auth_error"
        action: "alert"
        message: "API authentication failed. Please check credentials."
    
    timeout: 30000  # 30 seconds

  - id: "fetch_data_cached"
    type: "web_action"
    name: "Fetch data from cache (fallback)"
    params:
      app: "cache"
      method: "get_latest"

  - id: "process_data"
    type: "os_action"
    params:
      script: |
        try {
          return process(${steps.fetch_data.result});
        } catch (err) {
          logger.error("Processing failed", err);
          return null;
        }
    
    # Conditional step - only run if fetch succeeded
    condition: "${steps.fetch_data.status} == 'success'"

# Workflow-level error handling
error_handling:
  - condition: "any_step fails"
    action: "retry_entire_workflow"
    maxRetries: 2
  
  - condition: "checkpoint rejected"
    action: "abort_with_notification"
    notify_channels: ["#ops", "ops@company.com"]
  
  - condition: "workflow_timeout"
    action: "cancel_and_alert"
    timeout: 3600000  # 1 hour

post_execution:
  - type: "log_metrics"
    params:
      success_count: "${completed_steps}"
      failure_count: "${failed_steps}"
      duration_ms: "${total_duration}"
      status: "${workflow_status}"
  
  - type: "send_report"
    condition: "${workflow_status} != 'success'"
    params:
      to: ["ops@company.com"]
      subject: "Workflow Failed: ${workflow.name}"
      include: ["logs", "screenshots", "metrics"]
```

---

## SUMMARY: TEXT MODE IMPLEMENTATION ROADMAP

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| **Phase 1** | Week 1–2 | Text Parser (Module 13) + YAML parsing |
| **Phase 2** | Week 3–4 | CLI Interface (Module 14) + core commands |
| **Phase 3** | Week 5–6 | REPL mode + interactive shell |
| **Phase 4** | Week 7–8 | Headless Server (Module 15) + REST API |
| **Phase 5** | Week 9–10 | Multi-modal integration + testing |
| **Phase 6** | Week 11–12 | SDK + documentation + beta launch |

**Development Effort**: ~6–8 weeks for 1–2 engineers (1,500 TypeScript lines + tests)

**GO/NO-GO Launch**: Recommend delaying text mode to Phase 2 of product (post-MVP GUI+Voice), or parallel track if team has capacity.

