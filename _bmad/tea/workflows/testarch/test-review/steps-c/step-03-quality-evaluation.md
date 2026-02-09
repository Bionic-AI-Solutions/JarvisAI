---
name: 'step-03-quality-evaluation'
description: 'Orchestrate parallel quality dimension checks (5 subprocesses)'
nextStepFile: './step-03f-aggregate-scores.md'
---

# Step 3: Orchestrate Parallel Quality Evaluation

## STEP GOAL

Launch 5 parallel subprocesses to evaluate independent quality dimensions simultaneously for maximum performance.

## MANDATORY EXECUTION RULES

- 📖 Read the entire step file before acting
- ✅ Speak in `{communication_language}`
- ✅ Launch FIVE subprocesses in PARALLEL
- ✅ Wait for ALL subprocesses to complete
- ❌ Do NOT evaluate quality sequentially (use subprocesses)
- ❌ Do NOT proceed until all subprocesses finish

---

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Wait for subprocess outputs
- 📖 Load the next step only when instructed

## CONTEXT BOUNDARIES:

- Available context: test files from Step 2, knowledge fragments
- Focus: subprocess orchestration only
- Limits: do not evaluate quality directly (delegate to subprocesses)

---

## MANDATORY SEQUENCE

### 1. Prepare Subprocess Inputs

**Generate unique timestamp:**

```javascript
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
```

**Prepare context for all subprocesses:**

```javascript
const subprocessContext = {
  test_files: /* from Step 2 */,
  knowledge_fragments_loaded: ['test-quality'],
  timestamp: timestamp
};
```

---

### 2. Launch 5 Parallel Quality Subprocesses

**Subprocess A: Determinism Check**

- File: `./step-03a-subprocess-determinism.md`
- Output: `/tmp/tea-test-review-determinism-${timestamp}.json`
- Status: Running in parallel... ⟳

**Subprocess B: Isolation Check**

- File: `./step-03b-subprocess-isolation.md`
- Output: `/tmp/tea-test-review-isolation-${timestamp}.json`
- Status: Running in parallel... ⟳

**Subprocess C: Maintainability Check**

- File: `./step-03c-subprocess-maintainability.md`
- Output: `/tmp/tea-test-review-maintainability-${timestamp}.json`
- Status: Running in parallel... ⟳

**Subprocess D: Coverage Check**

- File: `./step-03d-subprocess-coverage.md`
- Output: `/tmp/tea-test-review-coverage-${timestamp}.json`
- Status: Running in parallel... ⟳

**Subprocess E: Performance Check**

- File: `./step-03e-subprocess-performance.md`
- Output: `/tmp/tea-test-review-performance-${timestamp}.json`
- Status: Running in parallel... ⟳

---

### 3. Wait for All Subprocesses

```
⏳ Waiting for 5 quality subprocesses to complete...
  ├── Subprocess A (Determinism): Running... ⟳
  ├── Subprocess B (Isolation): Running... ⟳
  ├── Subprocess C (Maintainability): Running... ⟳
  ├── Subprocess D (Coverage): Running... ⟳
  └── Subprocess E (Performance): Running... ⟳

[... time passes ...]

  ├── Subprocess A (Determinism): Complete ✅
  ├── Subprocess B (Isolation): Complete ✅
  ├── Subprocess C (Maintainability): Complete ✅
  ├── Subprocess D (Coverage): Complete ✅
  └── Subprocess E (Performance): Complete ✅

✅ All 5 quality subprocesses completed successfully!
```

---

### 4. Verify All Outputs Exist

```javascript
const outputs = ['determinism', 'isolation', 'maintainability', 'coverage', 'performance'].map(
  (dim) => `/tmp/tea-test-review-${dim}-${timestamp}.json`,
);

outputs.forEach((output) => {
  if (!fs.existsSync(output)) {
    throw new Error(`Subprocess output missing: ${output}`);
  }
});
```

---

### 5. Performance Report

```
🚀 Performance Report:
- Execution Mode: PARALLEL (5 subprocesses)
- Total Elapsed: ~max(all subprocesses) minutes
- Sequential Would Take: ~sum(all subprocesses) minutes
- Performance Gain: ~60-70% faster!
```

---

### 6. Proceed to Aggregation

Load next step: `{nextStepFile}`

The aggregation step (3F) will:

- Read all 5 subprocess outputs
- Calculate weighted overall score (0-100)
- Aggregate violations by severity
- Generate review report with top suggestions

---

## EXIT CONDITION

Proceed to Step 3F when:

- ✅ All 5 subprocesses completed successfully
- ✅ All output files exist and are valid JSON
- ✅ Performance metrics displayed

**Do NOT proceed if any subprocess failed.**

---

## 🚨 SYSTEM SUCCESS METRICS

### ✅ SUCCESS:

- All 5 subprocesses launched and completed
- Output files generated and valid
- Parallel execution achieved ~60% performance gain

### ❌ FAILURE:

- One or more subprocesses failed
- Output files missing or invalid
- Sequential evaluation instead of parallel

**Master Rule:** Parallel subprocess execution is MANDATORY for performance.
