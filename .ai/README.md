# Shared AI Development Setup

This directory is intentionally tool-neutral. Any AI coding agent can be pointed here for repository guidance and MCP setup.

## Files

- `agent-guide.md`: repository expectations, architecture rules, commands, and verification rules.
- `skills.md`: role-based workflow routing for framework, web, API, desktop, mobile, and docs work.
- `mcp.json`: portable MCP server configuration shape for tools such as Claude Desktop, Claude Code, Cursor, and other MCP clients.
- `mcp-output/`: generated MCP artifacts; ignored by Git.

## Recommended Agent Bootstrap Prompt

```text
Before changing this repository, read .ai/agent-guide.md and .ai/skills.md. Use .ai/mcp.json if your client supports MCP. Follow the verification rules in the shared guide.
```

## Tool-Specific Bridges

- Codex: `AGENTS.md` and `.codex/*` point back to this shared guidance.
- Claude: copy or reference `.ai/mcp.json` in Claude MCP settings and include the bootstrap prompt above.
- Cursor/Copilot/other agents: add `.ai/agent-guide.md` and `.ai/skills.md` to the agent context or custom instructions.
