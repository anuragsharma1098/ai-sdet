# AI-SDET Assignment Automation

Playwright + TypeScript automation framework covering:

- Web automation for OrangeHRM
- API automation for RESTful Booker
- Desktop automation for Windows Calculator and Notepad through Appium/WinAppDriver
- Mobile automation for native Calculator through Appium
- AI-assisted test-data generation with schema validation before use

## Tool Versions

- Node.js: 20+
- TypeScript: 5.x
- Playwright Test: 1.53+
- Appium: 2.x
- WinAppDriver: 1.2+ or Appium Windows driver
- Android Emulator/iOS Simulator for mobile execution

## Setup

```powershell
npm install
npx playwright install chromium
```

## Devcontainer Setup

This repository includes a complete VS Code devcontainer in `.devcontainer`.

Open the folder in VS Code and select **Dev Containers: Reopen in Container**. The container installs npm dependencies and Chromium automatically.

Native Windows desktop automation cannot execute inside a Linux container because Calculator and Notepad require the Windows GUI session. The desktop code is included in the framework and can be run from the Windows host or against a host/VM Appium Windows endpoint.

## Code Quality

The project includes Prettier, ESLint, Husky, lint-staged, and GitHub Actions.

```powershell
npm run format
npm run format:check
npm run lint
npm run typecheck
```

Husky runs `lint-staged` before commits after dependencies are installed.

For desktop automation, start WinAppDriver or Appium with the Windows driver before running desktop tests.

For mobile automation, start Appium and ensure an emulator/simulator is running.

## Execution

Run web and API tests:

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

Run desktop tests:

```powershell
npm run test:desktop
```

Run mobile tests:

```powershell
npm run test:mobile
```

Open HTML report:

```powershell
npm run report
```

Generate Allure report:

```powershell
npm run report:allure
```

Open Allure report:

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

- `src/pages`: Page Object Model for web flows.
- `src/api`: REST clients and API helpers.
- `src/data`: Dynamic data factories and AI output validation.
- `src/desktop`: Windows Calculator and Notepad automation helpers.
- `src/mobile`: Native mobile calculator automation helpers.
- `tests`: Playwright specs grouped by assignment question.
- `artifacts/ai`: Stored AI-generated data and scenarios consumed by tests.

## Reporting

Playwright generates:

- HTML report in `playwright-report`
- JSON results in `test-results/results.json`
- JUnit XML in `test-results/results.xml`
- Allure results in `allure-results`

`npm test` runs `npm run clean:allure` first, removing previous `allure-results` and `allure-report` folders before a fresh run. Generate the browsable Allure report with `npm run report:allure`; it writes to `allure-report`.

Screenshots, traces, videos, and Allure artifacts are retained on failure.

## AI Usage

The file `artifacts/ai/ai-generated-test-data.json` contains generated API test data and negative scenarios. Before tests consume this data, `src/data/aiDataValidator.ts` validates it with Zod. Invalid AI output fails fast and is not used by the framework.
