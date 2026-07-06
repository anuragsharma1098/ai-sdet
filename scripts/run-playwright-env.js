/* global console, process, require */

const { spawnSync } = require('node:child_process');

const supportedEnvironments = new Set(['dev', 'qa', 'prd', 'prod']);
const requestedEnvironment = process.argv[2]?.trim().toLowerCase();

if (!requestedEnvironment || !supportedEnvironments.has(requestedEnvironment)) {
  console.error('Usage: node scripts/run-playwright-env.js <dev|qa|prd> [playwright args...]');
  process.exit(1);
}

const testEnvironment = requestedEnvironment === 'prod' ? 'prd' : requestedEnvironment;
const extraArgs = process.argv.slice(3);
const defaultArgs = ['--grep-invert', '@desktop|@mobile'];
const playwrightArgs = [
  require.resolve('@playwright/test/cli'),
  'test',
  ...(extraArgs.length > 0 ? extraArgs : defaultArgs)
];

const result = spawnSync(process.execPath, playwrightArgs, {
  stdio: 'inherit',
  env: {
    ...process.env,
    TEST_ENV: testEnvironment
  }
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
