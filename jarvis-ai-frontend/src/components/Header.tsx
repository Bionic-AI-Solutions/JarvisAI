import { RefreshCw } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import api from '../services/api';
import './Header.css';

export default function Header() {
  const { data: health } = useFetch(() => api.health.check(), 30000);

  const statusColor = health?.status === 'ok' ? 'green' : 'red';

  return (
    <header className="app-header">
      <div className="header-left">
        <h2 className="header-title">Enterprise Dashboard</h2>
      </div>

      <div className="header-right">
        <div className="header-status">
          <div className={`pulse pulse-${statusColor}`} />
          <span className="status-text">
            {health ? (health.status === 'ok' ? 'All Systems Operational' : 'Issues Detected') : 'Connecting...'}
          </span>
        </div>

        <button
          className="btn btn-ghost header-refresh"
          onClick={() => window.location.reload()}
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  );
}
