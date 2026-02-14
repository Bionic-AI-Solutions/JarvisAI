import { useState } from 'react';
import { Search } from 'lucide-react';
import './CliHelp.css';

const commands = [
  {
    name: 'jarvis start',
    description: 'Start the Jarvis AI server',
    usage: 'jarvis start [options]',
    options: [
      { flag: '--port <number>', description: 'Server port (default: 4000)', required: false },
      { flag: '--host <string>', description: 'Server host (default: 0.0.0.0)', required: false },
      { flag: '--redis <url>', description: 'Redis connection URL', required: false },
      { flag: '--log-level <level>', description: 'Log level: error, warn, info, debug', required: false },
    ],
    examples: [
      'jarvis start',
      'jarvis start --port 8080 --log-level debug',
      'jarvis start --redis redis://localhost:6379',
    ],
  },
  {
    name: 'jarvis stop',
    description: 'Gracefully stop the running server',
    usage: 'jarvis stop [options]',
    options: [
      { flag: '--force', description: 'Force stop without graceful shutdown', required: false },
      { flag: '--timeout <ms>', description: 'Shutdown timeout in milliseconds', required: false },
    ],
    examples: ['jarvis stop', 'jarvis stop --force'],
  },
  {
    name: 'jarvis status',
    description: 'Show current server status and metrics',
    usage: 'jarvis status [options]',
    options: [
      { flag: '--json', description: 'Output in JSON format', required: false },
      { flag: '--verbose', description: 'Show detailed metrics', required: false },
    ],
    examples: ['jarvis status', 'jarvis status --json --verbose'],
  },
  {
    name: 'jarvis config',
    description: 'Manage server configuration',
    usage: 'jarvis config <subcommand> [key] [value]',
    options: [
      { flag: 'get <key>', description: 'Get a config value', required: false },
      { flag: 'set <key> <value>', description: 'Set a config value', required: false },
      { flag: 'list', description: 'List all config values', required: false },
      { flag: 'reset', description: 'Reset to defaults', required: false },
      { flag: '--global', description: 'Use global config file', required: false },
    ],
    examples: [
      'jarvis config list',
      'jarvis config get server.port',
      'jarvis config set server.port 8080',
    ],
  },
  {
    name: 'jarvis health',
    description: 'Check system health and connectivity',
    usage: 'jarvis health [options]',
    options: [
      { flag: '--json', description: 'Output in JSON format', required: false },
      { flag: '--timeout <ms>', description: 'Health check timeout', required: false },
    ],
    examples: ['jarvis health', 'jarvis health --json'],
  },
  {
    name: 'jarvis completion',
    description: 'Generate shell completion scripts',
    usage: 'jarvis completion <shell>',
    options: [
      { flag: 'bash', description: 'Generate bash completions', required: false },
      { flag: 'zsh', description: 'Generate zsh completions', required: false },
    ],
    examples: [
      'jarvis completion bash',
      'source <(jarvis completion zsh)',
    ],
  },
];

export default function CliHelp() {
  const [search, setSearch] = useState('');
  const [expandedCmd, setExpandedCmd] = useState<string | null>(null);

  const filtered = commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="cli-help">
      <div className="page-header">
        <h1>CLI Help</h1>
        <p>Command reference for the Jarvis AI CLI tool</p>
      </div>

      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search commands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="commands-list">
        {filtered.map((cmd) => (
          <div key={cmd.name} className="card command-card">
            <button
              className="command-header"
              onClick={() => setExpandedCmd(expandedCmd === cmd.name ? null : cmd.name)}
            >
              <div className="command-name-line">
                <code className="command-name">{cmd.name}</code>
                <span className="command-desc">{cmd.description}</span>
              </div>
            </button>

            {expandedCmd === cmd.name && (
              <div className="command-details">
                <div className="detail-section">
                  <h4>Usage</h4>
                  <pre><code>{cmd.usage}</code></pre>
                </div>

                <div className="detail-section">
                  <h4>Options</h4>
                  <div className="options-list">
                    {cmd.options.map((opt) => (
                      <div key={opt.flag} className="option-item">
                        <code className="option-flag">{opt.flag}</code>
                        <span className="option-desc">{opt.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Examples</h4>
                  {cmd.examples.map((ex, i) => (
                    <pre key={i}><code>$ {ex}</code></pre>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="no-results">
            <p>No commands matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
