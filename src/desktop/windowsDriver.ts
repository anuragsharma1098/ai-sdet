import { remote } from 'webdriverio';
import { env } from '../config/env';

/** WebdriverIO session type returned by the Windows Appium driver. */
export type WindowsSession = Awaited<ReturnType<typeof remote>>;

/**
 * Creates a Windows Appium session for packaged apps or executable paths.
 * Optional app arguments are used when reopening saved files in Notepad.
 */
export async function createWindowsSession(
  app: string,
  appArguments?: string
): Promise<WindowsSession> {
  return remote({
    hostname: env.appiumHost,
    port: env.appiumPort,
    path: '/',
    logLevel: 'error',
    capabilities: {
      platformName: 'Windows',
      'appium:automationName': 'Windows',
      'appium:app': app,
      ...(appArguments ? { 'appium:appArguments': appArguments } : {})
    }
  });
}
