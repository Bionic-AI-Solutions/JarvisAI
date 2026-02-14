import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import api from '../services/api';
import './ApiDocs.css';

const endpoints = [
  {
    method: 'GET' as const,
    path: '/health',
    description: 'Health check endpoint — returns system status, uptime, and Redis connectivity',
    response: '{ "status": "ok", "timestamp": "...", "uptime": 1234, "version": "1.0.0", "redis": "connected" }',
  },
  {
    method: 'GET' as const,
    path: '/api/v1/ping',
    description: 'Simple ping endpoint for connectivity testing',
    response: '{ "message": "pong", "timestamp": "..." }',
  },
  {
    method: 'GET' as const,
    path: '/api-docs',
    description: 'OpenAPI specification in JSON format',
    response: '{ "openapi": "3.0.0", "info": {...}, "paths": {...} }',
  },
];

export default function ApiDocs() {
  const { data: spec, loading } = useFetch(() => api.docs.getSpec());
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="api-docs">
      <div className="page-header">
        <h1>API Documentation</h1>
        <p>Interactive reference for all Jarvis AI API endpoints</p>
      </div>

      <div className="card api-info-card">
        <div className="api-info-grid">
          <div>
            <span className="api-info-label">Base URL</span>
            <code className="api-info-value">http://localhost:4000</code>
          </div>
          <div>
            <span className="api-info-label">API Version</span>
            <code className="api-info-value">v1</code>
          </div>
          <div>
            <span className="api-info-label">Format</span>
            <code className="api-info-value">JSON</code>
          </div>
          <div>
            <span className="api-info-label">Auth</span>
            <code className="api-info-value">API Key (header)</code>
          </div>
        </div>
      </div>

      <div className="endpoints-list">
        <h2>Endpoints</h2>
        {endpoints.map((ep, idx) => (
          <div key={idx} className="endpoint-card card">
            <button
              className="endpoint-header"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            >
              <div className="endpoint-method-path">
                <span className={`method-badge method-${ep.method.toLowerCase()}`}>
                  {ep.method}
                </span>
                <code className="endpoint-path">{ep.path}</code>
              </div>
              <span className="endpoint-desc">{ep.description}</span>
            </button>

            {expandedIdx === idx && (
              <div className="endpoint-details">
                <div className="endpoint-section">
                  <h4>Response Example</h4>
                  <pre>
                    <code>{ep.response}</code>
                  </pre>
                </div>
                <div className="endpoint-section">
                  <h4>Try It</h4>
                  <pre>
                    <code>{`curl http://localhost:4000${ep.path}`}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {spec && (
        <div className="card openapi-raw">
          <div className="card-header">
            <h3 className="card-title">Raw OpenAPI Specification</h3>
            <span className="badge badge-info">JSON</span>
          </div>
          <pre>
            <code>{loading ? 'Loading...' : JSON.stringify(spec, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
