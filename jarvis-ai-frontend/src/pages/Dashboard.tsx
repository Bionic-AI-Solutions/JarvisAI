import { Activity, Server, Database, Zap, Clock, CheckCircle } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import api from '../services/api';
import StatusCard from '../components/StatusCard';
import './Dashboard.css';

export default function Dashboard() {
  const { data: health, loading, error } = useFetch(() => api.health.check(), 15000);
  const { data: ping } = useFetch(() => api.ping.send(), 30000);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Connecting to Jarvis AI Backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-card card">
          <Server size={48} className="error-icon" />
          <h2>Unable to Connect</h2>
          <p>Cannot reach the Jarvis AI backend server.</p>
          <p className="error-detail">{error}</p>
          <div className="error-help">
            <h3>Quick Fix:</h3>
            <pre>
              <code>cd jarvis-ai-backend{'\n'}npm run dev</code>
            </pre>
            <p>The backend runs on <strong>http://localhost:4000</strong> by default.</p>
          </div>
        </div>
      </div>
    );
  }

  const uptimeStr = health ? formatUptime(health.uptime) : '—';
  const redisStatus = health?.redis || 'unknown';

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Real-time overview of your Jarvis AI instance</p>
      </div>

      <div className="grid-4">
        <StatusCard
          title="System Status"
          value={health?.status === 'ok' ? 'Healthy' : 'Degraded'}
          subtitle="All services running"
          status={health?.status === 'ok' ? 'success' : 'warning'}
          icon={<CheckCircle size={18} />}
        />
        <StatusCard
          title="Uptime"
          value={uptimeStr}
          subtitle="Since last restart"
          status="info"
          icon={<Clock size={18} />}
        />
        <StatusCard
          title="Redis"
          value={redisStatus === 'connected' ? 'Connected' : 'Fallback'}
          subtitle={redisStatus === 'connected' ? 'Sentinel HA active' : 'Using in-memory store'}
          status={redisStatus === 'connected' ? 'success' : 'warning'}
          icon={<Database size={18} />}
        />
        <StatusCard
          title="API Version"
          value={health?.version || 'v1'}
          subtitle="Current deployment"
          status="info"
          icon={<Zap size={18} />}
        />
      </div>

      <div className="grid-2 dashboard-details">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Health Check Response</h3>
            <span className="badge badge-success">Live</span>
          </div>
          <pre>
            <code>{JSON.stringify(health, null, 2)}</code>
          </pre>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">API Ping Test</h3>
            <span className="badge badge-info">v1</span>
          </div>
          {ping ? (
            <div className="ping-result">
              <div className="ping-message">
                <Activity size={20} />
                <span>{ping.message}</span>
              </div>
              <p className="ping-time">Response at: {new Date(ping.timestamp).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-muted">Sending ping...</p>
          )}
        </div>
      </div>

      <div className="card feature-overview">
        <div className="card-header">
          <h3 className="card-title">Enterprise Features — Phase 2A</h3>
        </div>
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.name} className="feature-item">
              <div className={`feature-status ${f.status}`} />
              <div>
                <h4>{f.name}</h4>
                <p>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  { name: 'OpenAPI / Swagger', description: 'Auto-generated API documentation with validation', status: 'active' },
  { name: 'CORS Management', description: 'Origin whitelisting with security headers', status: 'active' },
  { name: 'Rate Limiting', description: 'Dual-layer Redis-backed request throttling', status: 'active' },
  { name: 'Shell Completion', description: 'Bash & Zsh auto-completion scripts', status: 'active' },
  { name: 'CLI Help System', description: 'Registered command help with usage info', status: 'active' },
];

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
}
