# Team Onboarding - Phase 2A Sprint

**Date**: February 14, 2026  
**Sprint Start**: February 24, 2026 (Monday)  
**Sprint End**: March 13, 2026 (Friday - 14 business days)  
**Phase 1 (Week 1)**: Feb 24-28 — Core Features (11-12 story points)

---

## Team Roster & Assignments

| Role | Name | Feature Assignment | Story Points |
|------|------|--------------------|--------------|
| **Lead Developer** | Amelia | OpenAPI (OAI-001/002/003) | 7 pts |
| **Developer 2** | TBD | CORS (CORS-001/002) + Shell (SHELL-001/002/003) | 6 pts |
| **QA Lead** | Quinn | All features — testing & validation | Cross-cutting |
| **Tech Writer** | Paige | API docs, help content, README updates | Cross-cutting |
| **Architect** | Winston | Architecture review, Redis HA oversight | Advisory |
| **PM** | John | Sprint tracking, blockers, stakeholder comms | Management |
| **Scrum Master** | Bob | Standup facilitation, velocity tracking | Management |
| **Developer 3** | TBD | Rate Limiting (RL-001-005) + CLI Help | 15 pts |

---

## Pre-Sprint Checklist (Complete by Feb 23)

### For Every Team Member
- [ ] Clone the repository: `git clone <repo-url>`
- [ ] Navigate to project: `cd jarvis-ai-backend`
- [ ] Install dependencies: `npm install`
- [ ] Copy environment: `cp .env.example .env`
- [ ] Verify TypeScript: `npm run type-check`
- [ ] Run tests: `npm test`
- [ ] Start dev server: `npm run dev`
- [ ] Confirm health check: `curl http://localhost:3000/health`

### For Developers
- [ ] Read TECH-SPECS-DETAILED.md (your assigned feature section)
- [ ] Read docs/FEATURE-DEV-GUIDE.md (coding standards)
- [ ] Read docs/LOCAL-SETUP.md (environment walkthrough)
- [ ] Review existing code in `src/features/<your-feature>/`
- [ ] Identify questions/blockers before Feb 24

### For QA
- [ ] Read TEST-FRAMEWORK-SETUP.md
- [ ] Review test fixtures in `tests/fixtures/`
- [ ] Setup test environment variables
- [ ] Prepare test plan for Phase 1 features

### For PM/Scrum
- [ ] Import tasks from PHASE1-SPRINT-BOARD.md into tracking tool
- [ ] Set up daily standup cadence (9:30 AM IST)
- [ ] Create #jarvis-phase2a Slack channel
- [ ] Schedule sprint retrospective (Feb 28 PM)

---

## Documents to Read (Priority Order)

### Must-Read Before Sprint (1-2 hours)
1. **IMPLEMENTATION-TOOLKIT-INDEX.md** — Start here, navigation guide
2. **PHASE1-SPRINT-BOARD.md** — Your daily tasks for Week 1
3. **TECH-SPECS-DETAILED.md** — Detailed specifications per feature
4. **docs/LOCAL-SETUP.md** — How to set up your machine

### Should-Read Before Sprint (30 min)
5. **docs/FEATURE-DEV-GUIDE.md** — How to implement features
6. **COMPETITIVE-ANALYSIS-CLAWDBOT-MINIMAX.md** — Why we're building this
7. **README.md** — Project overview and quick start

### Reference During Sprint
8. **docs/DEBUGGING.md** — When things break
9. **docs/API-TESTING.md** — How to test your endpoints
10. **SETUP-TROUBLESHOOTING.md** — Common setup issues

---

## Sprint Ceremony Schedule

| Ceremony | When | Duration | Who |
|----------|------|----------|-----|
| **Daily Standup** | Mon-Fri 9:30 AM IST | 15 min | All |
| **Sprint Planning** | Mon Feb 24, 10:00 AM | 2 hrs | All |
| **Mid-Sprint Review** | Wed Feb 26, 3:00 PM | 30 min | All |
| **Sprint Demo** | Fri Feb 28, 4:00 PM | 1 hr | All |
| **Retrospective** | Fri Feb 28, 5:00 PM | 30 min | All |

---

## Phase 1 Week 1 Feature Breakdown

### Day 1 (Mon Feb 24): Sprint Kickoff
| Time | Activity | Owner |
|------|----------|-------|
| 9:30 | Daily standup | All |
| 10:00 | Sprint planning & task assignment | PM + All |
| 12:00 | Begin OAI-001 (Zod schema generation) | Amelia |
| 12:00 | Begin CORS-001 testing & hardening | Dev 2 |
| 14:00 | Begin RL-001 unit tests | Dev 3 |
| EOD | First PR opened (any feature) | Devs |

### Day 2 (Tue Feb 25): Core Development
| Time | Activity | Owner |
|------|----------|-------|
| 9:30 | Standup: Day 1 progress | All |
| 10:00 | OAI-001 completion target | Amelia |
| 10:00 | CORS-002 security header tests | Dev 2 |
| 14:00 | OAI-002 start (request validation) | Amelia |
| EOD | OAI-001 PR merged, CORS tests passing | Devs |

### Day 3 (Wed Feb 26): Feature Buildout
| Time | Activity | Owner |
|------|----------|-------|
| 9:30 | Standup: Progress check | All |
| 10:00 | OAI-002/003 continuation | Amelia |
| 10:00 | SHELL-001 start (Bash completion) | Dev 2 |
| 14:00 | RL-002/003 (per-customer/IP) | Dev 3 |
| 15:00 | Mid-sprint review checkpoint | All |

### Day 4 (Thu Feb 27): Integration & Testing
| Time | Activity | Owner |
|------|----------|-------|
| 9:30 | Standup | All |
| 10:00 | OpenAPI complete, integration testing | Amelia + QA |
| 10:00 | SHELL-002 (Zsh) + HELP-001 start | Dev 2 |
| 14:00 | RL-004/005 (dual-layer + failover) | Dev 3 |
| EOD | All Phase 1 features code-complete target | Devs |

### Day 5 (Fri Feb 28): Testing & Demo
| Time | Activity | Owner |
|------|----------|-------|
| 9:30 | Standup: Final status | All |
| 10:00 | Bug fixes & test coverage push | All devs |
| 14:00 | Integration testing (full middleware chain) | QA |
| 16:00 | Sprint demo (5 features working) | All |
| 17:00 | Retrospective | All |

---

## Communication Channels

| Channel | Purpose | Tool |
|---------|---------|------|
| **#jarvis-phase2a** | Sprint channel, daily updates | Slack |
| **#jarvis-blockers** | Immediate blockers only | Slack |
| **Daily Standup** | Progress sync | Google Meet/Zoom |
| **Code Reviews** | PR reviews within 4 hours | GitHub |
| **Sprint Board** | Task tracking | Jira/Linear/GitHub Projects |

---

## Definition of Done (Per Feature)

A feature is "Done" when:
- [ ] Code implemented and compiles (`npm run type-check` passes)
- [ ] Unit tests written and passing (>75% coverage for feature)
- [ ] Integration tests written for middleware chain
- [ ] Code reviewed by at least 1 other developer
- [ ] Documentation updated (inline comments + README section)
- [ ] No lint errors (`npm run lint`)
- [ ] PR merged to `main` branch
- [ ] QA sign-off (manual test checklist passed)

---

## Escalation Path

| Issue Type | First Contact | Escalation | Timeline |
|------------|---------------|------------|----------|
| **Code Blocker** | Slack #jarvis-blockers | Amelia (Lead Dev) | 30 min |
| **Infrastructure** | DevOps channel | Winston (Architect) | 1 hour |
| **Scope Change** | John (PM) | Stakeholder meeting | 4 hours |
| **Team Conflict** | Bob (Scrum Master) | John (PM) | Same day |

---

## Quick Reference Commands

```bash
# Setup
npm install                    # Install dependencies
cp .env.example .env           # Create environment file
npm run dev                    # Start development server

# Development
npm run type-check             # TypeScript validation
npm run lint                   # ESLint check
npm run lint:fix               # Auto-fix lint issues

# Testing
npm test                       # Run all tests
npm test -- --watch            # Watch mode
npm test -- --coverage         # Coverage report
npm test -- --testPathPattern="cors"  # Run specific tests

# Build
npm run build                  # Compile TypeScript
npm start                      # Start production server

# Docker
docker compose up -d           # Start Redis + app locally
docker compose down            # Stop all services
```

---

## First Day Email Template

```
Subject: Phase 2A Sprint Kickoff - Feb 24 | Action Required

Hi Team,

We're launching Phase 2A sprint on Monday, Feb 24. Here's what you need to do 
BEFORE the kickoff:

1. Clone the repo and run setup (see TEAM-ONBOARDING.md)
2. Read your assigned feature spec (TECH-SPECS-DETAILED.md)
3. Review the sprint board (PHASE1-SPRINT-BOARD.md)

Sprint Planning: Mon Feb 24, 10:00 AM IST (2 hours)
Daily Standups: 9:30 AM IST, Mon-Fri

Your Assignment:
- [Name]: [Feature] ([Story Points] pts)

Documents Location: _bmad-output/bmm/
Code Location: jarvis-ai-backend/

Questions? Drop them in #jarvis-phase2a.

Let's ship this!
```

---

**Document Owner**: PM (John)  
**Last Updated**: February 14, 2026
