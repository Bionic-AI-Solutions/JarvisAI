import { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import './Shell.css';

const bashScript = `#!/bin/bash
# Jarvis AI CLI - Bash Completion
# Add to ~/.bashrc: source <(jarvis completion bash)

_jarvis_completions() {
  local cur="\${COMP_WORDS[COMP_CWORD]}"
  local commands="start stop status config health ping docs version help"
  local flags="--help --version --config --verbose --quiet --json --format"
  
  case "\${COMP_WORDS[1]}" in
    start)
      COMPREPLY=( $(compgen -W "--port --host --redis --sentinel --log-level" -- "$cur") )
      ;;
    config)
      COMPREPLY=( $(compgen -W "get set list reset --global --local" -- "$cur") )
      ;;
    health)
      COMPREPLY=( $(compgen -W "--json --verbose --timeout" -- "$cur") )
      ;;
    *)
      COMPREPLY=( $(compgen -W "$commands $flags" -- "$cur") )
      ;;
  esac
}
complete -F _jarvis_completions jarvis`;

const zshScript = `#compdef jarvis
# Jarvis AI CLI - Zsh Completion
# Add to ~/.zshrc: source <(jarvis completion zsh)

_jarvis() {
  local -a commands=(
    'start:Start the Jarvis AI server'
    'stop:Stop the running server'
    'status:Show server status'
    'config:Manage configuration'
    'health:Check system health'
    'ping:Test connectivity'
    'docs:Open API documentation'
    'version:Show version info'
    'help:Show help information'
  )

  _arguments -C \\
    '(-h --help)'{-h,--help}'[Show help]' \\
    '(-v --version)'{-v,--version}'[Show version]' \\
    '--config[Config file path]:file:_files' \\
    '--verbose[Enable verbose output]' \\
    '--json[Output as JSON]' \\
    '1: :->command' \\
    '*::arg:->args'

  case $state in
    command)
      _describe 'command' commands
      ;;
  esac
}

_jarvis "$@"`;

export default function Shell() {
  const [activeTab, setActiveTab] = useState<'bash' | 'zsh'>('bash');
  const [copied, setCopied] = useState(false);

  const currentScript = activeTab === 'bash' ? bashScript : zshScript;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="shell-page">
      <div className="page-header">
        <h1>Shell Completion</h1>
        <p>Auto-completion scripts for Bash and Zsh shells</p>
      </div>

      <div className="card install-card">
        <div className="card-header">
          <h3 className="card-title">Quick Install</h3>
        </div>
        <div className="install-grid">
          <div className="install-item">
            <h4>Bash</h4>
            <pre><code>echo 'source &lt;(jarvis completion bash)' &gt;&gt; ~/.bashrc{'\n'}source ~/.bashrc</code></pre>
          </div>
          <div className="install-item">
            <h4>Zsh</h4>
            <pre><code>echo 'source &lt;(jarvis completion zsh)' &gt;&gt; ~/.zshrc{'\n'}source ~/.zshrc</code></pre>
          </div>
        </div>
      </div>

      <div className="card script-card">
        <div className="card-header">
          <div className="tabs" style={{ margin: 0, border: 'none' }}>
            <button
              className={`tab ${activeTab === 'bash' ? 'active' : ''}`}
              onClick={() => setActiveTab('bash')}
            >
              <Terminal size={16} />
              Bash
            </button>
            <button
              className={`tab ${activeTab === 'zsh' ? 'active' : ''}`}
              onClick={() => setActiveTab('zsh')}
            >
              <Terminal size={16} />
              Zsh
            </button>
          </div>
          <button className="btn btn-ghost" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="script-content">
          <code>{currentScript}</code>
        </pre>
      </div>
    </div>
  );
}
