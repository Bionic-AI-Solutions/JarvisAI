# Infrastructure Readiness Checklist

**Sprint Start**: February 24, 2026  
**All items must be GREEN by**: February 23, 2026 (EOD)

---

## Status Key
- ✅ Ready
- 🔄 In Progress
- ❌ Not Started
- ⚠️ Blocked

---

## 1. Development Environment

| Item | Status | Owner | Due Date | Notes |
|------|--------|-------|----------|-------|
| Node.js 18+ installed (all devs) | ❌ | All | Feb 21 | `node --version` |
| Git configured | ❌ | All | Feb 21 | With SSH keys |
| Repository access granted | ❌ | DevOps | Feb 20 | All team members |
| IDE setup (VS Code/WebStorm) | ❌ | All | Feb 21 | With extensions |
| `npm install` succeeds | ❌ | All | Feb 22 | No errors |
| `npm run dev` starts server | ❌ | All | Feb 22 | Port 3000 |
| `npm test` passes | ❌ | All | Feb 22 | All green |
| Docker Desktop installed | ❌ | All | Feb 21 | For Redis |

---

## 2. Redis Infrastructure

| Item | Status | Owner | Due Date | Notes |
|------|--------|-------|----------|-------|
| Redis 7.x provisioned | ❌ | DevOps | Feb 21 | Master + replicas |
| Sentinel cluster (3 nodes) | ❌ | DevOps | Feb 21 | Quorum = 2 |
| Connection credentials set | ❌ | DevOps | Feb 21 | Secure password |
| docker-compose.yml tested | ❌ | DevOps | Feb 22 | Local dev setup |
| Failover tested | ❌ | DevOps | Feb 23 | Kill master, verify failover |
| Connection from app tested | ❌ | Lead Dev | Feb 23 | Health check = "connected" |
| Memory limits configured | ❌ | DevOps | Feb 22 | maxmemory + policy |
| Persistence configured | ❌ | DevOps | Feb 22 | AOF enabled |

### Redis Config Validation
```bash
# On each Sentinel node, verify:
redis-cli -p 26379 sentinel master mymaster
# Expected: master at correct IP, flags=master

# On master:
redis-cli INFO replication
# Expected: role:master, connected_slaves:2

# Test failover:
redis-cli -p 26379 sentinel failover mymaster
# Verify new master elected within 10 seconds
```

---

## 3. CI/CD Pipeline

| Item | Status | Owner | Due Date | Notes |
|------|--------|-------|----------|-------|
| GitHub repository created | ❌ | DevOps | Feb 18 | With branch protection |
| Branch protection rules | ❌ | DevOps | Feb 18 | Require PR reviews |
| CI workflow (.github/workflows/ci.yml) | ✅ | Created | Feb 14 | Already in repo |
| CI pipeline runs successfully | ❌ | DevOps | Feb 22 | Test on push |
| Docker image builds | ❌ | DevOps | Feb 22 | Multi-stage |
| Container registry access | ❌ | DevOps | Feb 22 | GHCR or ECR |
| Staging environment ready | ❌ | DevOps | Feb 23 | Deploy target |

### CI Validation
```bash
# Trigger CI manually:
git push origin feature/ci-test

# Expected stages:
# 1. type-check ✓
# 2. lint ✓
# 3. test-unit ✓
# 4. test-integration ✓ (with Redis service)
# 5. build ✓
# 6. docker ✓ (on main/develop only)
```

---

## 4. Staging Environment

| Item | Status | Owner | Due Date | Notes |
|------|--------|-------|----------|-------|
| Server/cluster provisioned | ❌ | DevOps | Feb 22 | K8s/ECS/VM |
| Domain/URL configured | ❌ | DevOps | Feb 22 | staging.jarvis-api.com |
| SSL certificate | ❌ | DevOps | Feb 22 | Let's Encrypt or ACM |
| Environment variables set | ❌ | DevOps | Feb 23 | All from .env.example |
| Health check accessible | ❌ | DevOps | Feb 23 | /health returns 200 |
| Logs accessible | ❌ | DevOps | Feb 23 | CloudWatch/ELK |

---

## 5. Monitoring & Alerting

| Item | Status | Owner | Due Date | Notes |
|------|--------|-------|----------|-------|
| Error tracking (Sentry/Rollbar) | ❌ | DevOps | Feb 23 | Optional for Week 1 |
| Log aggregation | ❌ | DevOps | Feb 23 | Winston → CloudWatch |
| Uptime monitoring | ❌ | DevOps | Feb 23 | /health endpoint |
| Alerting rules | ❌ | DevOps | Feb 23 | 5xx > 5/min |

---

## 6. Security

| Item | Status | Owner | Due Date | Notes |
|------|--------|-------|----------|-------|
| Secrets management | ❌ | DevOps | Feb 22 | GitHub Secrets / Vault |
| Redis password rotated | ❌ | DevOps | Feb 23 | Not default password |
| CORS origins configured | ❌ | DevOps | Feb 23 | Production whitelist |
| Rate limit thresholds reviewed | ❌ | Architect | Feb 22 | Per-customer + IP |
| CSP headers reviewed | ❌ | Security | Feb 23 | Content-Security-Policy |

---

## 7. Team Readiness

| Item | Status | Owner | Due Date | Notes |
|------|--------|-------|----------|-------|
| All docs distributed | ❌ | PM | Feb 17 | See TEAM-ONBOARDING.md |
| Kickoff meeting scheduled | ❌ | PM | Feb 17 | 2 hours, all team |
| Slack channel created | ❌ | PM | Feb 17 | #jarvis-phase2a |
| Task board populated | ❌ | PM | Feb 21 | Jira/Linear/GitHub |
| Feature assignments confirmed | ❌ | PM | Feb 21 | Each dev knows their focus |
| Sprint ceremonies scheduled | ❌ | Scrum Master | Feb 21 | Standups, retro, demo |

---

## Sign-Off

| Role | Name | Status | Date |
|------|------|--------|------|
| **PM** | John | ❌ Pending | |
| **Architect** | Winston | ❌ Pending | |
| **Lead Dev** | Amelia | ❌ Pending | |
| **QA Lead** | Quinn | ❌ Pending | |
| **DevOps** | TBD | ❌ Pending | |

**All sign-offs required by February 23, 2026 EOD.**

---

**Last Updated**: February 14, 2026
