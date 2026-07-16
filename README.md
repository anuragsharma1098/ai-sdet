# AI-SDET Automation

Enterprise-oriented Playwright + TypeScript automation framework covering:

- Web automation for OrangeHRM
- API automation for RESTful Booker
- Desktop automation for Windows Calculator and Notepad through Appium or WinAppDriver
- Mobile automation for native Android Calculator through Appium UiAutomator2
- AI-assisted test-data generation with schema validation before use
- Playwright, JSON, JUnit, and Allure reporting

## Tool Versions

- Node.js: 22 recommended, 20+ supported
- TypeScript: 5.x
- Playwright Test: 1.61.x
- Appium: 2.x
- WebdriverIO: 9.x for Appium desktop/mobile sessions
- WinAppDriver 1.2+ or Appium Windows driver for desktop execution
- Android emulator, physical device, or cloud device for mobile execution
- Allure CLI through `allure-commandline`; report generation requires Java, installed by the devcontainer and CI system dependency script
- Codex CLI through `@openai/codex`
- VS Code extensions installed by the devcontainer for Playwright, TypeScript, ESLint, Prettier, EditorConfig, GitLens, GitHub Pull Requests, GitHub Actions, YAML, Markdown linting, Docker, Dev Containers, and Office Viewer

## Setup-

PowerShell:

```powershell
npm install
npx playwright install chromium
```

Bash (Linux/macOS):

```bash
npm install
npx playwright install chromium
```

## Devcontainer Setup

This repository includes a VS Code devcontainer in `.devcontainer`.

Open the folder in VS Code and select **Dev Containers: Reopen in Container**. The container installs npm dependencies and Chromium automatically through `postCreateCommand`.

The devcontainer includes Playwright browser dependencies, Appium, UiAutomator2, ADB, a headless Java runtime, recommended VS Code extensions, and the npm dependencies from `package.json`. Codex and Allure are installed as project dev dependencies during `npm install`.

Native Windows desktop automation cannot execute inside the Linux devcontainer because Calculator and Notepad require a Windows GUI session. Run desktop tests from a Windows host or point the tests at a reachable Windows Appium endpoint.

## Code Quality

The project includes Prettier, ESLint, Husky, lint-staged, strict TypeScript, and GitHub Actions.

PowerShell:

```powershell
npm run format
npm run format:check
npm run lint
npm run typecheck
```

Bash (Linux/macOS):

```bash
npm run format
npm run format:check
npm run lint
npm run typecheck
```

Husky runs `lint-staged` before commits after dependencies are installed.

## Execution

Run the default CI-safe suite. This runs web and API tests only; desktop and mobile are excluded because they require host or device infrastructure.

PowerShell:

```powershell
npm test
```

Bash (Linux/macOS):

```bash
npm test
```

Run the same CI-safe suite against a named target environment:

PowerShell:

```powershell
npm run test:dev
npm run test:qa
npm run test:prd
```

Bash (Linux/macOS):

```bash
npm run test:dev
npm run test:qa
npm run test:prd
```

Run only web:

PowerShell:

```powershell
npm run test:web
```

Bash (Linux/macOS):

```bash
npm run test:web
```

Run only API:

PowerShell:

```powershell
npm run test:api
```

Bash (Linux/macOS):

```bash
npm run test:api
```

Run desktop tests from a Windows host or Windows Appium endpoint:

PowerShell:

```powershell
npm run test:desktop
```

Bash (Linux/macOS, against a reachable Windows Appium endpoint only):

```bash
npm run test:desktop
```

Run mobile tests after Appium and an Android emulator, physical device, or cloud device are available:

PowerShell:

```powershell
npm run test:mobile
```

Bash (Linux/macOS):

```bash
npm run test:mobile
```

Open Playwright HTML report:

PowerShell:

```powershell
npm run report
```

Bash (Linux/macOS):

```bash
npm run report
```

Generate Allure report:

PowerShell:

```powershell
npm run report:allure
```

Bash (Linux/macOS):

```bash
npm run report:allure
```

Open generated Allure report:

PowerShell:

```powershell
npm run report:allure:open
```

Bash (Linux/macOS):

```bash
npm run report:allure:open
```

## Environment Variables

`TEST_ENV` selects the active target environment. Supported values are `dev`, `qa`, and `prd`; `prod` is accepted as an alias for `prd`. The default is `dev`.

The checked-in defaults point every environment at the same public demo apps. For real systems, set global variables such as `ORANGE_BASE_URL`, or environment-specific variables such as `QA_ORANGE_BASE_URL`. Environment-specific values win over global values.

| Variable                   | Default                                     | Purpose                           |
| -------------------------- | ------------------------------------------- | --------------------------------- |
| `TEST_ENV`                 | `dev`                                       | Active target environment         |
| `ORANGE_BASE_URL`          | `https://opensource-demo.orangehrmlive.com` | OrangeHRM base URL                |
| `ORANGE_USERNAME`          | `Admin`                                     | OrangeHRM login username          |
| `ORANGE_PASSWORD`          | `admin123`                                  | OrangeHRM login password          |
| `RESTFUL_BOOKER_BASE_URL`  | `https://restful-booker.herokuapp.com`      | RESTful Booker base URL           |
| `RESTFUL_BOOKER_USERNAME`  | `admin`                                     | RESTful Booker auth username      |
| `RESTFUL_BOOKER_PASSWORD`  | `password123`                               | RESTful Booker auth password      |
| `APPIUM_HOST`              | `127.0.0.1`                                 | Appium server host                |
| `APPIUM_PORT`              | `4723`                                      | Appium server port                |
| `ANDROID_DEVICE_NAME`      | `Android Emulator`                          | Mobile device name                |
| `ANDROID_PLATFORM_VERSION` | unset                                       | Optional Android platform version |

Environment-specific overrides use the environment prefix:

| Prefix | Example                      |
| ------ | ---------------------------- |
| `DEV_` | `DEV_ORANGE_BASE_URL`        |
| `QA_`  | `QA_RESTFUL_BOOKER_BASE_URL` |
| `PRD_` | `PRD_ORANGE_USERNAME`        |

## Framework Design

Board-facing architecture and presentation material: `docs/ARCHITECTURE_TSD.md`.

- `src/pages`: Page Object Model for OrangeHRM web flows.
- `src/api`: typed REST clients and API helpers.
- `src/data`: dynamic data factories and AI output validation.
- `src/desktop`: Windows Calculator and Notepad automation helpers.
- `src/mobile`: native Android Calculator automation helpers.
- `tests`: Playwright specs grouped by capability.
- `artifacts/ai`: stored AI-generated data and scenarios consumed by tests.
- `.github/workflows`: CI quality gates, default test execution, and report artifact upload.

## Reporting

Playwright is configured to generate:

- console list output
- HTML report in `playwright-report`
- JSON results in `test-results/results.json`
- JUnit XML in `test-results/results.xml`
- Allure results in `allure-results`

`npm test` runs `npm run clean:allure` first, removing previous `allure-results` and `allure-report` folders before a fresh run. Generate the browsable Allure report with `npm run report:allure`; it writes to `allure-report`.

CI installs shared system dependencies from `.devcontainer/install-system-deps.sh`, including the headless Java runtime required by Allure. Push and pull-request runs execute the CI-safe web/API suite against `dev` by default; manual workflow runs can select `dev`, `qa`, or `prd`. CI uploads Playwright reports, raw test results, Allure results, and the generated Allure report as environment-named artifacts.

Screenshots, traces, videos, and Allure artifacts are retained on failure.

## AI Usage

The file `artifacts/ai/ai-generated-test-data.json` contains AI-generated API booking templates and negative scenarios. Before tests consume this data, `src/data/aiDataValidator.ts` validates it with Zod. Invalid AI output fails fast and is not used by the framework.

## Current Execution Notes

- `npm test` is the recommended CI path and covers web plus API.
- Desktop automation is implemented but requires Windows host infrastructure.
- Mobile automation is implemented for Android Calculator and requires Appium plus a connected device, emulator, or cloud device.
- Public demo applications can be slower than local systems; the framework uses Playwright assertions and targeted readiness checks instead of fixed waits.

## AI Development With Any AI Agent

This repository includes shared, agent-neutral AI guidance:

- `.ai/agent-guide.md`: repository expectations, commands, architecture rules, and verification rules.
- `.ai/skills.md`: workflow routing for framework, web, API, desktop, mobile, and docs work.
- `.ai/mcp.json`: portable MCP server config shape for Claude, Cursor, and other MCP clients.
- `AGENTS.md`: Codex-compatible entry point that points back to `.ai`.
- `.codex/config.toml`: Codex-specific project MCP wiring.

Recommended bootstrap prompt for any AI agent:

```text
Before changing this repository, read .ai/agent-guide.md and .ai/skills.md. Use .ai/mcp.json if your client supports MCP. Follow the verification rules in the shared guide.
```

Playwright MCP is installed as a dev dependency. Run it locally with:

```bash
npm run mcp:playwright
```

For Codex, restart after changing `.codex/config.toml` and use `/mcp` to confirm the `playwright` MCP server is available. For Claude or other MCP clients, copy or reference `.ai/mcp.json` in that client's MCP settings.
