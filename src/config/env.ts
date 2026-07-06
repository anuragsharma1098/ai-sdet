const supportedTestEnvironments = ['dev', 'qa', 'prd'] as const;

export type TestEnvironment = (typeof supportedTestEnvironments)[number];

type TargetDefaults = {
  orangeBaseUrl: string;
  orangeUsername: string;
  orangePassword: string;
  restfulBookerBaseUrl: string;
  restfulBookerUsername: string;
  restfulBookerPassword: string;
};

const publicDemoDefaults: TargetDefaults = {
  orangeBaseUrl: 'https://opensource-demo.orangehrmlive.com',
  orangeUsername: 'Admin',
  orangePassword: 'admin123',
  restfulBookerBaseUrl: 'https://restful-booker.herokuapp.com',
  restfulBookerUsername: 'admin',
  restfulBookerPassword: 'password123'
};

const targetDefaults: Record<TestEnvironment, TargetDefaults> = {
  dev: publicDemoDefaults,
  qa: publicDemoDefaults,
  prd: publicDemoDefaults
};

function resolveTestEnvironment(): TestEnvironment {
  const rawEnvironment = process.env.TEST_ENV ?? 'dev';
  const normalizedEnvironment = rawEnvironment.trim().toLowerCase();
  const canonicalEnvironment = normalizedEnvironment === 'prod' ? 'prd' : normalizedEnvironment;

  if (supportedTestEnvironments.includes(canonicalEnvironment as TestEnvironment)) {
    return canonicalEnvironment as TestEnvironment;
  }

  throw new Error(
    `Unsupported TEST_ENV "${rawEnvironment}". Supported values: ${supportedTestEnvironments.join(', ')}.`
  );
}

function readEnvironmentOverride(environment: TestEnvironment, variableName: string): string | undefined {
  return process.env[`${environment.toUpperCase()}_${variableName}`] ?? process.env[variableName];
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

const testEnvironment = resolveTestEnvironment();
const defaults = targetDefaults[testEnvironment];

/**
 * Centralized runtime configuration.
 *
 * TEST_ENV selects dev, qa, or prd target defaults. Global env vars override
 * defaults, and env-specific vars such as QA_ORANGE_BASE_URL override globals.
 */
export const env = {
  testEnvironment,
  orangeBaseUrl: normalizeBaseUrl(
    readEnvironmentOverride(testEnvironment, 'ORANGE_BASE_URL') ?? defaults.orangeBaseUrl
  ),
  orangeUsername: readEnvironmentOverride(testEnvironment, 'ORANGE_USERNAME') ?? defaults.orangeUsername,
  orangePassword: readEnvironmentOverride(testEnvironment, 'ORANGE_PASSWORD') ?? defaults.orangePassword,
  restfulBookerBaseUrl: normalizeBaseUrl(
    readEnvironmentOverride(testEnvironment, 'RESTFUL_BOOKER_BASE_URL') ?? defaults.restfulBookerBaseUrl
  ),
  restfulBookerUsername:
    readEnvironmentOverride(testEnvironment, 'RESTFUL_BOOKER_USERNAME') ?? defaults.restfulBookerUsername,
  restfulBookerPassword:
    readEnvironmentOverride(testEnvironment, 'RESTFUL_BOOKER_PASSWORD') ?? defaults.restfulBookerPassword,
  appiumHost: readEnvironmentOverride(testEnvironment, 'APPIUM_HOST') ?? '127.0.0.1',
  appiumPort: Number(readEnvironmentOverride(testEnvironment, 'APPIUM_PORT') ?? 4723),
  androidDeviceName: readEnvironmentOverride(testEnvironment, 'ANDROID_DEVICE_NAME') ?? 'Android Emulator',
  androidPlatformVersion: readEnvironmentOverride(testEnvironment, 'ANDROID_PLATFORM_VERSION')
};
