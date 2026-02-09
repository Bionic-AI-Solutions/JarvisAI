# Dev Container (solo-social)

This devcontainer is self-contained in this repo. Use it when you open this folder as its own repository.

## Includes

- **Node.js 20** and **Python 3.11** with Poetry
- **sudo** for the `vscode` user (NOPASSWD)
- **Docker CLI** using the host Docker engine (socket mount)
- **kubectl** and mount for `~/.kube`
- **Claude Code** and other VS Code extensions
- **Git**, **gh**, and common dev tools

## Prerequisites

- Docker Desktop (or Docker Engine) running on the host
- Create on host if missing:
  - `%USERPROFILE%\.kube` (folder)
  - `%USERPROFILE%\.cursor\mcp.json` (file, e.g. `{}`)

## Usage

1. Open this folder (solo-social) in Cursor/VS Code.
2. **Dev Containers: Reopen in Container** (or Rebuild and Reopen).
3. Wait for the image build and post-create script to finish.

After that, `docker`, `kubectl`, `node`, `python`, and `sudo` are available inside the container.
