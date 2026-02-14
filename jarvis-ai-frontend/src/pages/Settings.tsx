import { useState } from 'react';
import { Save } from 'lucide-react';
import { useLocalStorage } from '../hooks/useFetch';
import './Settings.css';

interface AppSettings {
  backendUrl: string;
  refreshInterval: number;
  theme: 'dark' | 'light';
  showNotifications: boolean;
}

const defaultSettings: AppSettings = {
  backendUrl: 'http://localhost:4000',
  refreshInterval: 15,
  theme: 'dark',
  showNotifications: true,
};

export default function Settings() {
  const [saved, setSaved] = useLocalStorage<AppSettings>('jarvis-settings', defaultSettings);
  const [settings, setSettings] = useState<AppSettings>(saved);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setSaved(settings);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setSaved(defaultSettings);
  };

  return (
    <div className="settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your Jarvis AI dashboard preferences</p>
      </div>

      <div className="card settings-card">
        <div className="card-header">
          <h3 className="card-title">Connection</h3>
        </div>
        <div className="settings-group">
          <div className="setting-item">
            <label htmlFor="backendUrl">Backend URL</label>
            <input
              id="backendUrl"
              type="text"
              value={settings.backendUrl}
              onChange={(e) => setSettings({ ...settings, backendUrl: e.target.value })}
              className="setting-input"
            />
            <span className="setting-hint">The URL where Jarvis AI backend is running</span>
          </div>

          <div className="setting-item">
            <label htmlFor="refreshInterval">Auto-refresh Interval (seconds)</label>
            <input
              id="refreshInterval"
              type="number"
              min={5}
              max={300}
              value={settings.refreshInterval}
              onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) || 15 })}
              className="setting-input"
            />
            <span className="setting-hint">How often to poll for health status updates</span>
          </div>
        </div>
      </div>

      <div className="card settings-card">
        <div className="card-header">
          <h3 className="card-title">Preferences</h3>
        </div>
        <div className="settings-group">
          <div className="setting-item">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'dark' | 'light' })}
              className="setting-input"
            >
              <option value="dark">Dark</option>
              <option value="light">Light (Coming Soon)</option>
            </select>
          </div>

          <div className="setting-item setting-toggle">
            <div>
              <label htmlFor="notifications">Show Notifications</label>
              <span className="setting-hint">Display status change notifications</span>
            </div>
            <button
              className={`toggle ${settings.showNotifications ? 'active' : ''}`}
              onClick={() => setSettings({ ...settings, showNotifications: !settings.showNotifications })}
            >
              <div className="toggle-thumb" />
            </button>
          </div>
        </div>
      </div>

      <div className="card settings-card">
        <div className="card-header">
          <h3 className="card-title">About</h3>
        </div>
        <div className="about-info">
          <div className="about-row">
            <span>Application</span>
            <strong>Jarvis AI Enterprise Dashboard</strong>
          </div>
          <div className="about-row">
            <span>Version</span>
            <strong>1.0.0</strong>
          </div>
          <div className="about-row">
            <span>Sprint</span>
            <strong>Phase 2A (Feb 24 - Mar 13, 2026)</strong>
          </div>
          <div className="about-row">
            <span>Stack</span>
            <strong>React 18 + TypeScript + Vite</strong>
          </div>
          <div className="about-row">
            <span>Backend</span>
            <strong>Node.js + Express + Redis Sentinel</strong>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} />
          Save Settings
        </button>
        <button className="btn btn-ghost" onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>

      {showSaved && (
        <div className="toast" style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success)' }}>
          Settings saved successfully!
        </div>
      )}
    </div>
  );
}
