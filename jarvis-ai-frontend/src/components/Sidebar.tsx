import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCode2,
  Shield,
  Terminal,
  Settings,
  Activity,
  BookOpen,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/api-docs', icon: FileCode2, label: 'API Documentation' },
  { to: '/rate-limits', icon: Shield, label: 'Rate Limits' },
  { to: '/shell', icon: Terminal, label: 'Shell Completion' },
  { to: '/cli-help', icon: BookOpen, label: 'CLI Help' },
  { to: '/monitoring', icon: Activity, label: 'Monitoring' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">J</div>
        <div className="brand-text">
          <span className="brand-name">Jarvis AI</span>
          <span className="brand-tag">Enterprise</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Main</span>
          {navItems.slice(0, 3).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Tools</span>
          {navItems.slice(3, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-section">
          <span className="nav-section-title">System</span>
          {navItems.slice(5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="version-info">
          <span>v1.0.0</span>
          <span className="badge badge-success">Phase 2A</span>
        </div>
      </div>
    </aside>
  );
}
