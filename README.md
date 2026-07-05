# AI-SDET Assignment Automation

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

## Setup

```powershell
npm install
npx playwright install chromium
```

## Devcontainer Setup

This repository includes a VS Code devcontainer in `.devcontainer`.

Open the folder in VS Code and select **Dev Containers: Reopen in Container**. The container installs npm dependencies and Chromium automatically through `postCreateCommand`.

The devcontainer includes Playwright browser dependencies, Appium, UiAutomator2, ADB, a headless Java runtime, and the npm dependencies from `package.json`. Codex and Allure are installed as project dev dependencies during `npm install`.

Native Windows desktop automation cannot execute inside the Linux devcontainer because Calculator and Notepad require a Windows GUI session. Run desktop tests from a Windows host or point the tests at a reachable Windows Appium endpoint.

## Code Quality

The project includes Prettier, ESLint, Husky, lint-staged, strict TypeScript, and GitHub Actions.

```powershell
npm run format
npm run format:check
npm run lint
npm run typecheck
```

Husky runs `lint-staged` before commits after dependencies are installed.

## Execution

Run the default CI-safe suite. This runs web and API tests only; desktop and mobile are excluded because they require host or device infrastructure.

```powershell
npm test
```

Run only web:

```powershell
npm run test:web
```

Run only API:

```powershell
npm run test:api
```

Run desktop tests from a Windows host or Windows Appium endpoint:

```powershell
npm run test:desktop
```

Run mobile tests after Appium and an Android emulator, physical device, or cloud device are available:

```powershell
npm run test:mobile
```

Open Playwright HTML report:

```powershell
npm run report
```

Generate Allure report:

```powershell
npm run report:allure
```

Open generated Allure report:

```powershell
npm run report:allure:open
```

## Environment Variables

| Variable                   | Default            | Purpose                           |
| -------------------------- | ------------------ | --------------------------------- |
| `ORANGE_USERNAME`          | `Admin`            | OrangeHRM login username          |
| `ORANGE_PASSWORD`          | `admin123`         | OrangeHRM login password          |
| `APPIUM_HOST`              | `127.0.0.1`        | Appium server host                |
| `APPIUM_PORT`              | `4723`             | Appium server port                |
| `ANDROID_DEVICE_NAME`      | `Android Emulator` | Mobile device name                |
| `ANDROID_PLATFORM_VERSION` | unset              | Optional Android platform version |

## Framework Design

- `src/pages`: Page Object Model for OrangeHRM web flows.
- `src/api`: typed REST clients and API helpers.
- `src/data`: dynamic data factories and AI output validation.
- `src/desktop`: Windows Calculator and Notepad automation helpers.
- `src/mobile`: native Android Calculator automation helpers.
- `tests`: Playwright specs grouped by assignment question and capability.
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

CI installs shared system dependencies from `.devcontainer/install-system-deps.sh`, including the headless Java runtime required by Allure, then uploads Playwright reports, raw test results, Allure results, and the generated Allure report as artifacts.

Screenshots, traces, videos, and Allure artifacts are retained on failure.

## AI Usage

The file `artifacts/ai/ai-generated-test-data.json` contains AI-generated API booking templates and negative scenarios. Before tests consume this data, `src/data/aiDataValidator.ts` validates it with Zod. Invalid AI output fails fast and is not used by the framework.

## Current Execution Notes

- `npm test` is the recommended CI path and covers web plus API.
- Desktop automation is implemented but requires Windows host infrastructure.
- Mobile automation is implemented for Android Calculator and requires Appium plus a connected device, emulator, or cloud device.
- Public demo applications can be slower than local systems; the framework uses Playwright assertions and targeted readiness checks instead of fixed waits.
