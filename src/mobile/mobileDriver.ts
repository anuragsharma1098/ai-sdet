import { remote } from 'webdriverio';
import { env } from '../config/env';

/** WebdriverIO session type returned by the Android Appium driver. */
export type MobileSession = Awaited<ReturnType<typeof remote>>;

/** Creates an Appium UiAutomator2 session for the Android Calculator app. */
export async function createAndroidCalculatorSession(): Promise<MobileSession> {
  return remote({
    hostname: env.appiumHost,
    port: env.appiumPort,
    path: '/',
    logLevel: 'error',
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': env.androidDeviceName,
      ...(env.androidPlatformVersion
        ? { 'appium:platformVersion': env.androidPlatformVersion }
        : {}),
      'appium:appPackage': 'com.google.android.calculator',
      'appium:appActivity': 'com.android.calculator2.Calculator',
      'appium:noReset': true
    }
  });
}
