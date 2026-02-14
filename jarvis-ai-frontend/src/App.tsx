import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ApiDocs from './pages/ApiDocs';
import RateLimits from './pages/RateLimits';
import Shell from './pages/Shell';
import CliHelp from './pages/CliHelp';
import Monitoring from './pages/Monitoring';
import Settings from './pages/Settings';

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/rate-limits" element={<RateLimits />} />
            <Route path="/shell" element={<Shell />} />
            <Route path="/cli-help" element={<CliHelp />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
