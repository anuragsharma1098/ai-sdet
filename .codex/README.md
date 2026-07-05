# Codex Project Setup

This directory contains Codex-specific configuration for the AI-SDET framework.

Shared agent-neutral guidance lives in `.ai/`:

- `.ai/agent-guide.md`
- `.ai/skills.md`
- `.ai/mcp.json`

Codex-specific files:

- `config.toml`: project MCP configuration for Codex, including Playwright MCP.
- `skills.md`: bridge to the shared skill catalogue.
- `mcp.md`: bridge to the shared MCP notes.

Restart Codex after changes to `.codex/config.toml`. Use `/mcp` inside Codex to confirm the `playwright` MCP server is available.
