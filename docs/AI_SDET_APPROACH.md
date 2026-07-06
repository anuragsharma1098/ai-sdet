# AI-SDET Framework Approach

## Framework Design

The project uses Playwright Test as the common TypeScript test runner and reporting layer. Browser, API, desktop, and mobile tests share one reporting and quality-gate surface while keeping implementation details isolated by capability.

- Web tests use Playwright browser automation with Page Object Model classes under `src/pages`.
- API tests use Playwright `APIRequestContext` with a typed reusable REST client under `src/api`.
- Desktop tests use Appium or WinAppDriver sessions from Playwright specs because native Windows apps are outside Playwright browser automation.
- Mobile tests use Appium UiAutomator2 sessions from Playwright specs for native Android Calculator automation.
- Runtime target selection is centralized in `src/config/env.ts`; `TEST_ENV` selects `dev`, `qa`, or `prd`, while global or environment-specific variables override URLs, credentials, and device settings.
- Dynamic data factories and AI output validation live in `src/data` and are isolated from test flow logic.
- CI runs formatting, lint, typecheck, and the default web plus API suite before uploading reports. Push and pull-request runs target `dev`; manual workflow runs can select `dev`, `qa`, or `prd`.

## Reporting Approach

Playwright is configured to generate list, HTML, JSON, JUnit, and Allure reports. `npm test` cleans previous Allure output before execution so every default run starts with fresh Allure results.

Traces, screenshots, and videos are retained on failure to support debugging. CI uploads Playwright reports, raw test results, Allure results, and the generated Allure report as artifacts.

## Validation Strategy

Web validations check that employee records are visible after create/search, that editable personal details persist after update, that the deleted employee row is absent after deletion, and that the second employee remains searchable.

API validations check status codes, response bodies, created booking IDs, retrieved booking content, updated booking fields, deletion status, and `404` after delete.

Desktop validations compare captured Calculator results with expected results, save them into Notepad, reopen the saved file, and assert the summary contents.

Mobile validations compare native Calculator results with expected values and clear history after execution.

## AI Usage

AI was used to generate sample RESTful Booker booking templates and negative API scenarios. The generated output is stored in `artifacts/ai/ai-generated-test-data.json` so it can be reviewed and traced as an execution artifact.

The API suite consumes the generated booking templates for positive CRUD coverage and consumes generated negative scenarios for invalid-data and authorization checks.

## AI Output Validation

The AI artifact is validated by `src/data/aiDataValidator.ts` using a Zod schema before test data is consumed. The schema verifies required fields, data types, date formats, and the minimum number of negative scenarios. If the generated output is malformed, tests fail before sending requests to the target application.

## Scalability Notes

- Page objects and app helpers own selectors and app-specific synchronization.
- Tests describe business scenarios and delegate implementation details to reusable helpers.
- Environment-specific app URLs and credentials are read from typed configuration instead of being embedded in tests or clients.
- API payloads are typed through shared data contracts.
- Desktop and mobile execution are separated from the default suite because they require external infrastructure.
- Generated report folders are ignored by Git, Prettier, and ESLint.

## Architecture Presentation

A board-facing technical solution design with Mermaid diagrams is available in `docs/ARCHITECTURE_TSD.md`.
