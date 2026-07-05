import { remote } from 'webdriverio';
import { env } from '../config/env';

export type MobileSession = Awaited<ReturnType<typeof remote>>;

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
      ...(env.androidPlatformVersion ? { 'appium:platformVersion': env.androidPlatformVersion } : {}),
      'appium:appPackage': 'com.google.android.calculator',
      'appium:appActivity': 'com.android.calculator2.Calculator',
      'appium:noReset': true
    }
  });
}
