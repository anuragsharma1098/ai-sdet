import type { MobileSession } from './mobileDriver';

/** Maps calculation tokens to Google Android Calculator resource IDs. */
const androidButtonIds: Record<string, string> = {
  '0': 'digit_0',
  '1': 'digit_1',
  '2': 'digit_2',
  '3': 'digit_3',
  '4': 'digit_4',
  '5': 'digit_5',
  '6': 'digit_6',
  '7': 'digit_7',
  '8': 'digit_8',
  '9': 'digit_9',
  '+': 'op_add',
  '-': 'op_sub',
  '*': 'op_mul',
  '/': 'op_div',
  '=': 'eq',
  C: 'clr',
  '(': 'lparen',
  ')': 'rparen'
};

/** High-level Android Calculator actions built on an Appium UiAutomator2 session. */
export class MobileCalculatorApp {
  constructor(private readonly app: MobileSession) {}

  /** Enters the supplied token sequence, evaluates it, and returns display text. */
  async calculate(tokens: string[]): Promise<string> {
    await this.clear();
    for (const token of tokens) {
      await this.tapToken(token);
    }
    await this.tap('=');
    return this.result();
  }

  /** Clears calculator history when the device/app variant exposes that menu. */
  async clearHistory(): Promise<void> {
    await this.clear();
    const moreOptions = await this.app.$('~More options');
    if (!(await moreOptions.isExisting())) {
      return;
    }

    await moreOptions.click();
    const history = await this.app.$('android=new UiSelector().textContains("History")');
    if (await history.isExisting()) {
      await history.click();
    }

    const clearHistory = await this.app.$('android=new UiSelector().textContains("Clear")');
    if (await clearHistory.isExisting()) {
      await clearHistory.click();
      const confirm = await this.app.$(
        'android=new UiSelector().textMatches("(?i)(OK|Delete|Clear)")'
      );
      if (await confirm.isExisting()) {
        await confirm.click();
      }
    }
  }

  /** Clears the current expression if the clear button is present. */
  private async clear(): Promise<void> {
    const clearButton = await this.app.$(this.byId(androidButtonIds.C));
    if (await clearButton.isExisting()) {
      await clearButton.click();
    }
  }

  /** Expands multi-digit tokens into individual calculator taps. */
  private async tapToken(token: string): Promise<void> {
    if (/^\d+$/.test(token)) {
      for (const digit of token) {
        await this.tap(digit);
      }
      return;
    }

    await this.tap(token);
  }

  /** Taps a calculator control by resource ID and fails fast on unsupported tokens. */
  private async tap(symbol: string): Promise<void> {
    const id = androidButtonIds[symbol];
    if (!id) {
      throw new Error(`Unsupported mobile calculator token: ${symbol}`);
    }
    await this.app.$(this.byId(id)).click();
  }

  /** Reads the final result, falling back for calculator versions with older IDs. */
  private async result(): Promise<string> {
    const result = await this.app.$(this.byId('result_final'));
    if (await result.isExisting()) {
      return result.getText();
    }

    return this.app.$(this.byId('result')).getText();
  }

  /** Builds a Google Calculator resource-id selector. */
  private byId(id: string): string {
    return `id=com.google.android.calculator:id/${id}`;
  }
}
