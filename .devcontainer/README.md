# Devcontainer Usage

Open this repository in VS Code and choose **Dev Containers: Reopen in Container**.

The container includes:

- Node.js from the official Playwright image
- Playwright browser dependencies
- Playwright Docker image `mcr.microsoft.com/playwright:v1.61.0-noble`
- Chromium browser installation through `postCreateCommand`
- Appium 2
- Appium UiAutomator2 driver
- Android Debug Bridge tools
- Java runtime for Android tooling

## Commands

```bash
npm test
npm run test:web
npm run test:api
npm run test:mobile
npm run report
```

## Mobile Execution

Start Appium inside the container:

```bash
appium --address 0.0.0.0 --port 4723
```

Use an Android emulator exposed to the container through ADB, or connect a cloud/device provider and update capabilities through environment variables.

## Desktop Execution

Windows Calculator and Notepad are native Windows GUI apps and cannot run inside this Linux devcontainer. The desktop test code is included in the same TypeScript framework, but execution must target WinAppDriver/Appium on the Windows host or a Windows VM.

For desktop review execution:

1. Start WinAppDriver or Appium Windows driver on the Windows host.
2. Run `npm run test:desktop` from the Windows host, or expose the host Appium endpoint and set `APPIUM_HOST` inside the container.
