import { remote } from 'webdriverio';
import { env } from '../config/env';

export type WindowsSession = Awaited<ReturnType<typeof remote>>;

export async function createWindowsSession(app: string, appArguments?: string): Promise<WindowsSession> {
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
