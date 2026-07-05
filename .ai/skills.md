# Shared AI Skills

Use this catalogue to route AI work regardless of the assistant being used.

## Framework Maintainer

Use when changing shared framework structure, dependencies, configuration, CI, reports, or cross-cutting test behavior.

- Read `README.md`, `docs/AI_SDET_APPROACH.md`, `package.json`, `playwright.config.ts`, and `.github/workflows/ci.yml` before broad changes.
- Preserve the default CI-safe contract: `npm test` runs web and API only; desktop and mobile remain explicit infrastructure-dependent scripts.
- Run `npm run format:check`, `npm run lint`, and `npm run typecheck` after framework edits.

## Web Automation Specialist

Use when changing OrangeHRM browser automation.

- Start with `tests/web/orangehrm.employee.spec.ts`, `src/pages/LoginPage.ts`, and `src/pages/PimPage.ts`.
- Keep selectors inside page objects, not specs.
- Prefer Playwright role, placeholder, and scoped locators over brittle CSS.
- Use assertions as synchronization; avoid fixed waits.
- Run `npm run test:web` for behavior changes.
- Use Playwright MCP for exploratory DOM inspection when the live OrangeHRM UI changes.

## API Automation Specialist

Use when changing RESTful Booker API automation.

- Start with `tests/api/restful-booker.spec.ts`, `src/api/RestfulBookerClient.ts`, `src/data/testDataFactory.ts`, and `src/data/aiDataValidator.ts`.
- Keep positive-path assertions inside typed client methods when they represent endpoint contracts.
- Keep negative-path helpers raw so tests can assert status codes explicitly.
- Validate AI-generated data with Zod before consuming it.
- Run `npm run test:api` for behavior changes.

## Desktop Automation Specialist

Use when changing Windows Calculator or Notepad automation.

- Start with `tests/desktop/windows-calculator-notepad.spec.ts` and `src/desktop`.
- Preserve the `@desktop` tag so the suite stays out of default Linux CI.
- Use stable accessibility IDs where available.
- Document any Windows host, WinAppDriver, or Appium Windows driver requirement.
- Run `npm run test:desktop` only from a Windows-capable environment.

## Mobile Automation Specialist

Use when changing native Android Calculator automation.

- Start with `tests/mobile/native-calculator.spec.ts` and `src/mobile`.
- Preserve the `@mobile` tag so the suite stays out of default CI.
- Keep capability values configurable through `src/config/env.ts`.
- Prefer resource-id selectors for calculator buttons.
- Run `npm run test:mobile` only when Appium and a device/emulator/cloud device are available.

## Documentation And Review

Use when changing README, approach docs, CI notes, or agent guidance.

- Keep docs aligned with actual scripts in `package.json`.
- Call out infrastructure-dependent execution clearly.
- Mention Allure Java dependency when touching report setup.
- For reviews, lead with bugs, risks, and missing tests before summaries.
