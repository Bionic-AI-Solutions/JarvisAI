import { Shield, Users, Globe } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import './RateLimits.css';

const rateLimitTiers = [
  {
    tier: 'Free',
    requestsPerWindow: 100,
    windowMs: 60000,
    burstLimit: 10,
    description: 'Default tier for unauthenticated requests',
  },
  {
    tier: 'Basic',
    requestsPerWindow: 1000,
    windowMs: 60000,
    burstLimit: 50,
    description: 'Authenticated users with basic plan',
  },
  {
    tier: 'Pro',
    requestsPerWindow: 5000,
    windowMs: 60000,
    burstLimit: 200,
    description: 'Professional tier with higher quotas',
  },
  {
    tier: 'Enterprise',
    requestsPerWindow: 50000,
    windowMs: 60000,
    burstLimit: 1000,
    description: 'Custom enterprise limits with SLA',
  },
];

export default function RateLimits() {
  return (
    <div className="rate-limits">
      <div className="page-header">
        <h1>Rate Limiting</h1>
        <p>Dual-layer rate limiting with Redis-backed counters and in-memory fallback</p>
      </div>

      <div className="grid-3">
        <StatusCard
          title="Strategy"
          value="Dual Layer"
          subtitle="Customer ID + IP address"
          status="info"
          icon={<Shield size={18} />}
        />
        <StatusCard
          title="Backend"
          value="Redis"
          subtitle="Atomic Lua script counters"
          status="success"
          icon={<Globe size={18} />}
        />
        <StatusCard
          title="Fallback"
          value="In-Memory"
          subtitle="Automatic when Redis unavailable"
          status="warning"
          icon={<Users size={18} />}
        />
      </div>

      <div className="card tiers-card">
        <div className="card-header">
          <h3 className="card-title">Rate Limit Tiers</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tier</th>
                <th>Requests / Window</th>
                <th>Window</th>
                <th>Burst Limit</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {rateLimitTiers.map((tier) => (
                <tr key={tier.tier}>
                  <td>
                    <span className={`badge badge-${getTierBadge(tier.tier)}`}>{tier.tier}</span>
                  </td>
                  <td><strong>{tier.requestsPerWindow.toLocaleString()}</strong></td>
                  <td>{tier.windowMs / 1000}s</td>
                  <td>{tier.burstLimit}</td>
                  <td className="tier-desc">{tier.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Response Headers</h3>
          </div>
          <div className="headers-list">
            {responseHeaders.map((h) => (
              <div key={h.name} className="header-item">
                <code className="header-name">{h.name}</code>
                <span className="header-desc">{h.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Lua Script (Atomic Counter)</h3>
          </div>
          <pre>
            <code>{luaScript}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function getTierBadge(tier: string): string {
  switch (tier) {
    case 'Free': return 'info';
    case 'Basic': return 'success';
    case 'Pro': return 'warning';
    case 'Enterprise': return 'error';
    default: return 'info';
  }
}

const responseHeaders = [
  { name: 'X-RateLimit-Limit', description: 'Maximum requests allowed in the current window' },
  { name: 'X-RateLimit-Remaining', description: 'Remaining requests in the current window' },
  { name: 'X-RateLimit-Reset', description: 'UTC epoch time when the window resets' },
  { name: 'Retry-After', description: 'Seconds to wait before retrying (when rate limited)' },
];

const luaScript = `local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local current = tonumber(redis.call('GET', key) or '0')

if current >= limit then
  return 0
end

current = redis.call('INCR', key)
if current == 1 then
  redis.call('EXPIRE', key, window)
end
return limit - current`;
