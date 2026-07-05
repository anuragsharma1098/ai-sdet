/**
 * Centralized runtime configuration.
 *
 * Defaults support the public demo apps and local Appium usage while allowing CI,
 * cloud devices, or host-specific credentials to override values through env vars.
 */
export const env = {
  orangeUsername: process.env.ORANGE_USERNAME ?? 'Admin',
  orangePassword: process.env.ORANGE_PASSWORD ?? 'admin123',
  appiumHost: process.env.APPIUM_HOST ?? '127.0.0.1',
  appiumPort: Number(process.env.APPIUM_PORT ?? 4723),
  androidDeviceName: process.env.ANDROID_DEVICE_NAME ?? 'Android Emulator',
  androidPlatformVersion: process.env.ANDROID_PLATFORM_VERSION
};
