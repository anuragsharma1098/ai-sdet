# Devcontainer Usage

Open this repository in VS Code and choose **Dev Containers: Reopen in Container**.

The container includes:

- Node.js from the official Playwright image
- Playwright browser dependencies
- Playwright Docker image `mcr.microsoft.com/playwright:v1.61.0-noble`
- Chromium browser installation through `postCreateCommand`
- npm project dependencies through `npm install`
- Allure CLI and reporter from project dev dependencies
- Codex CLI from project dev dependencies
- VS Code extensions for Playwright, TypeScript, ESLint, Prettier, EditorConfig, GitLens, GitHub Pull Requests, GitHub Actions, YAML, Markdown linting, Docker, Dev Containers, and Office Viewer
- Appium 2
- Appium UiAutomator2 driver
- Android Debug Bridge tools
- Headless Java runtime for Allure and Android tooling

## Commands

```bash
npm test
npm run test:web
npm run test:api
npm run test:mobile
npm run report
npm run report:allure
npm run report:allure:open
```

`npm test` cleans previous Allure output before running the default web plus API suite.

The same system dependency script, `.devcontainer/install-system-deps.sh`, is used by the devcontainer Dockerfile and GitHub Actions so Java, ADB, and zip stay aligned across local containers and CI.

## Mobile Execution

Start Appium inside the container:

```bash
appium --address 0.0.0.0 --port 4723
```

Use an Android emulator exposed to the container through ADB, connect a physical device, or connect a cloud device provider and update capabilities through environment variables.

## Desktop Execution

Windows Calculator and Notepad are native Windows GUI apps and cannot run inside this Linux devcontainer. The desktop test code is included in the same TypeScript framework, but execution must target WinAppDriver or Appium Windows driver on a Windows host or Windows VM.

For desktop review execution:

1. Start WinAppDriver or Appium Windows driver on the Windows host.
2. Run `npm run test:desktop` from the Windows host, or expose the host Appium endpoint and set `APPIUM_HOST` inside the container.

## Reports

- Playwright HTML report: `playwright-report`
- JSON and JUnit results: `test-results`
- Allure raw results: `allure-results`
- Generated Allure report: `allure-report`
