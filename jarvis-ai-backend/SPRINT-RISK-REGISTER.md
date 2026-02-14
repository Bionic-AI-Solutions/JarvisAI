# Sprint Risk Register

**Sprint**: Phase 2A Week 1 (Feb 24-28, 2026)  
**Risk Owner**: PM (John) + Scrum Master (Bob)

---

## Risk Matrix

| Impact ↓ / Probability → | Low (1) | Medium (2) | High (3) |
|---------------------------|---------|------------|----------|
| **Critical (3)** | 3 | 6 | **9** |
| **Major (2)** | 2 | 4 | 6 |
| **Minor (1)** | 1 | 2 | 3 |

**Score Thresholds**: 1-2 Accept | 3-4 Monitor | 5-6 Mitigate | 7-9 Escalate

---

## Active Risks

### R001: Redis Infrastructure Not Ready by Sprint Start
| Attribute | Detail |
|-----------|--------|
| **Score** | **9** (Critical × High) |
| **Category** | Infrastructure |
| **Description** | Redis Sentinel cluster may not be provisioned and tested by Feb 24 |
| **Impact** | Rate limiting feature (RL-001-005) cannot be tested with Redis; blocks 15 story points |
| **Probability** | High — infrastructure work not yet started |
| **Mitigation** | Use docker-compose.yml for local Redis; in-memory fallback available; prioritize infra setup this week |
| **Contingency** | Develop/test with in-memory fallback; defer Redis integration tests to Week 2 |
| **Owner** | DevOps Lead |
| **Status** | ⚠️ OPEN |
| **Due Date** | Feb 21 |

---

### R002: Team Not Onboarded Before Sprint
| Attribute | Detail |
|-----------|--------|
| **Score** | **6** (Critical × Medium) |
| **Category** | People |
| **Description** | Team members may not have read docs, setup local env, or understand sprint plan |
| **Impact** | Day 1-2 lost to setup issues, questions, miscommunication |
| **Probability** | Medium — docs created but not yet distributed |
| **Mitigation** | Send onboarding email ASAP; schedule kickoff meeting Feb 17-21; verify each dev can run `npm run dev` |
| **Contingency** | Day 1 becomes setup day (lose 1 day of development) |
| **Owner** | PM (John) |
| **Status** | ⚠️ OPEN |
| **Due Date** | Feb 17 (send docs), Feb 21 (verify setup) |

---

### R003: CI/CD Pipeline Not Configured
| Attribute | Detail |
|-----------|--------|
| **Score** | **4** (Major × Medium) |
| **Category** | DevOps |
| **Description** | GitHub Actions workflow exists but has never been tested end-to-end |
| **Impact** | PRs can't be automatically validated; manual testing burden on QA |
| **Probability** | Medium — workflow created but may have config issues |
| **Mitigation** | Push test branch to trigger CI; fix issues before Feb 24; create GitHub repository first |
| **Contingency** | Manual `npm test && npm run lint && npm run build` before each PR |
| **Owner** | DevOps Lead |
| **Status** | ⚠️ OPEN |
| **Due Date** | Feb 22 |

---

### R004: Dependency Version Conflicts
| Attribute | Detail |
|-----------|--------|
| **Score** | **3** (Minor × High) |
| **Category** | Technical |
| **Description** | npm packages may have peer dependency conflicts on different machines |
| **Impact** | Setup delays (30 min - 2 hours per dev) |
| **Probability** | High — common with TypeScript + ESLint + Jest combos |
| **Mitigation** | Pin dependency versions in package-lock.json; use `npm ci` instead of `npm install`; test on clean machine |
| **Contingency** | Use `--legacy-peer-deps` flag; document in SETUP-TROUBLESHOOTING.md |
| **Owner** | Lead Dev (Amelia) |
| **Status** | 🟢 Mitigated (troubleshooting guide exists) |
| **Due Date** | Feb 22 |

---

### R005: Scope Creep from Competitive Analysis
| Attribute | Detail |
|-----------|--------|
| **Score** | **4** (Major × Medium) |
| **Category** | Scope |
| **Description** | After reading competitive analysis vs ClawdBot/MiniMax, team may want to add messaging integration, multimodal features, etc. |
| **Impact** | Sprint goals diluted; 5 features delayed; burnout |
| **Probability** | Medium — competitive pressure creates FOMO |
| **Mitigation** | Sprint scope is LOCKED — 5 features only; competitive features go to Phase 2B+ backlog; PM to protect scope |
| **Contingency** | Create "Competitive Response Backlog" for Phase 2B planning |
| **Owner** | PM (John) |
| **Status** | 🟢 Mitigated (scope documented) |
| **Due Date** | Ongoing |

---

### R006: Rate Limiting Performance Under Load
| Attribute | Detail |
|-----------|--------|
| **Score** | **4** (Major × Medium) |
| **Category** | Technical |
| **Description** | Dual-layer rate limiting (customer + IP) with Lua scripts may have performance issues at scale |
| **Impact** | Increased latency (>100ms per request); may need architecture change |
| **Probability** | Medium — Lua scripts are atomic but add Redis round-trip |
| **Mitigation** | Benchmark early (Day 2-3); use pipelining; consider local cache with Redis sync |
| **Contingency** | Simplify to single-layer rate limiting; use sliding window approximation |
| **Owner** | Lead Dev (Amelia) + Architect (Winston) |
| **Status** | 🟡 MONITORING |
| **Due Date** | Feb 26 (mid-sprint benchmark) |

---

### R007: OpenAPI Schema Complexity
| Attribute | Detail |
|-----------|--------|
| **Score** | **3** (Minor × High) |
| **Category** | Technical |
| **Description** | Zod-to-OpenAPI conversion may have edge cases (circular refs, discriminated unions) |
| **Impact** | OAI-001 takes longer than estimated (2 pts instead of 3 pts) |
| **Probability** | High — schema generation tools have known limitations |
| **Mitigation** | Start with simple schemas; use @asteasolutions/zod-to-openapi library; avoid complex types in Week 1 |
| **Contingency** | Hand-write OpenAPI spec for complex types; automate later |
| **Owner** | Amelia |
| **Status** | 🟡 MONITORING |
| **Due Date** | Feb 25 |

---

### R008: Test Coverage Below Threshold
| Attribute | Detail |
|-----------|--------|
| **Score** | **3** (Minor × High) |
| **Category** | Quality |
| **Description** | Only 2 sample test files exist; 75% coverage threshold may not be met |
| **Impact** | CI failures; false confidence in code quality |
| **Probability** | High — most test files not yet created |
| **Mitigation** | TDD approach (test first, then implement); pair dev + QA on test writing; created test templates |
| **Contingency** | Temporarily lower threshold to 50% for Week 1; raise to 75% by sprint end |
| **Owner** | QA Lead (Quinn) |
| **Status** | ⚠️ OPEN |
| **Due Date** | Feb 28 |

---

## Risk Summary

| Score | Count | Risks |
|-------|-------|-------|
| **9 (Escalate)** | 1 | R001: Redis not ready |
| **6 (Mitigate)** | 1 | R002: Team not onboarded |
| **4 (Monitor)** | 3 | R003: CI/CD, R005: Scope creep, R006: Rate limit perf |
| **3 (Monitor)** | 3 | R004: Deps, R007: OpenAPI, R008: Test coverage |

---

## Risk Trend

```
Week of Feb 14-23 (Pre-Sprint):
  Overall Risk Level: 🟡 MEDIUM-HIGH
  
  Must be resolved before Feb 24:
  - R001: Redis infrastructure ← TOP PRIORITY
  - R002: Team onboarding ← SEND DOCS TODAY
  - R003: CI/CD validation ← Test this week

  Can be monitored during sprint:
  - R004-R008: Technical risks managed via daily standups
```

---

## Risk Response Actions (Next 10 Days)

| Day | Action | Risk | Owner |
|-----|--------|------|-------|
| Feb 14 (Today) | Send onboarding email + docs | R002 | PM |
| Feb 17 | Schedule kickoff meeting | R002 | PM |
| Feb 18 | Create GitHub repository | R003 | DevOps |
| Feb 19 | Start Redis provisioning | R001 | DevOps |
| Feb 20 | Grant repo access to all | R002 | DevOps |
| Feb 21 | Redis Sentinel tested | R001 | DevOps |
| Feb 21 | Verify all devs can `npm install` | R004 | Lead Dev |
| Feb 22 | CI pipeline tested end-to-end | R003 | DevOps |
| Feb 22 | Kickoff meeting (2 hrs) | R002 | All |
| Feb 23 | Final infrastructure verification | R001 | DevOps |
| Feb 23 | All sign-offs collected | All | PM |

---

**Review Frequency**: Daily during pre-sprint, then at each standup  
**Escalation Path**: Risk Owner → PM → Stakeholder  
**Last Updated**: February 14, 2026
