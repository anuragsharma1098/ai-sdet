# Shared AI Agent Guide

This is the agent-neutral source of truth for AI-assisted work in this repository. Codex, Claude, Cursor, Copilot, and other agents can read this file directly before changing the framework.

## Repository Expectations

- Treat this as an enterprise-grade Playwright + TypeScript automation framework.
- Keep tests readable at scenario level; put selectors, synchronization, and app-specific mechanics in helpers or page objects.
- Prefer typed contracts, reusable clients, and data factories over inline payloads and duplicated logic.
- Keep generated folders out of source control: `playwright-report`, `test-results`, `allure-results`, `allure-report`, `.codex/playwright-mcp-output`, and `.ai/mcp-output`.

## Commands

- Format: `npm run format`
- Format check: `npm run format:check`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Default CI-safe tests: `npm test`
- Web only: `npm run test:web`
- API only: `npm run test:api`
- Desktop only, Windows/Appium required: `npm run test:desktop`
- Mobile only, Appium/device required: `npm run test:mobile`
- Generate Allure report: `npm run report:allure`
- Run Playwright MCP locally: `npm run mcp:playwright`

## Verification Rules

- After framework, config, or shared helper changes, run `npm run format:check`, `npm run lint`, and `npm run typecheck`.
- After web behavior changes, run `npm run test:web` when network/browser access is available.
- After API behavior changes, run `npm run test:api` when network access is available.
- Do not run desktop/mobile tests in Linux CI or a Linux devcontainer unless a compatible remote Appium target is explicitly configured.

## Architecture Rules

- Web POM files live under `src/pages`.
- API client code lives under `src/api`.
- Dynamic data and AI output validation live under `src/data`.
- Desktop helpers live under `src/desktop`.
- Mobile helpers live under `src/mobile`.
- Tests live under `tests/<capability>` and should describe business behavior.

## Reporting Rules

- Allure report generation requires Java. CI and the devcontainer install `default-jre-headless` through `.devcontainer/install-system-deps.sh`.
- `npm test` cleans old Allure output before running.
- CI uploads Playwright report, raw test results, Allure results, and generated Allure report artifacts.

## Tool-Agnostic Usage

- Codex should also load `AGENTS.md` automatically.
- Claude, Cursor, Copilot, and other agents should be pointed at `.ai/agent-guide.md`, `.ai/skills.md`, and `.ai/mcp.json`.
- Keep tool-specific config thin and point back to `.ai` docs to avoid drift.
