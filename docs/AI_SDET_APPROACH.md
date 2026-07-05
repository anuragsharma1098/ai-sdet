# AI-SDET Framework Approach

## Framework Design

The project uses Playwright Test as the common TypeScript test runner and reporting layer.

- Web tests use Playwright browser automation with Page Object Model classes.
- API tests use Playwright `APIRequestContext` with a reusable REST client.
- Desktop tests use Appium/WinAppDriver sessions from Playwright specs because native Windows apps are outside Playwright browser automation.
- Mobile tests use Appium UiAutomator2 sessions from Playwright specs for the same reason.
- Dynamic data factories live in `src/data` and are isolated from test flow logic.

## Reporting Approach

Playwright is configured to generate list, HTML, JSON, JUnit, and Allure reports. Traces, screenshots, and videos are retained on failure to support review-call debugging.

## Validation Strategy

Web validations check that employee records are visible after create/search, that edited personal details are persisted, that a deleted employee returns no records, and that the second employee remains searchable.

API validations check status codes, response bodies, created booking IDs, retrieved booking content, updated booking fields, deletion status, and `404` after delete.

Desktop validations compare captured Calculator results with expected results, save them into Notepad, reopen the saved file, and assert the summary contents.

Mobile validations compare native Calculator results with expected values and clear history after execution.

## AI Usage

AI was used to generate sample booking templates and negative API scenarios. The generated output is stored in `artifacts/ai/ai-generated-test-data.json` so it can be reviewed and traced as an execution artifact.

## AI Output Validation

The AI artifact is validated by `src/data/aiDataValidator.ts` using a Zod schema before test data is consumed. The schema verifies required fields, data types, date formats, and the minimum number of negative scenarios. If the generated output is malformed, the tests fail before sending requests to the target application.
