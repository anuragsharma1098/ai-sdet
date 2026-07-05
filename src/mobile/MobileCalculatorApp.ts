import type { MobileSession } from './mobileDriver';

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

export class MobileCalculatorApp {
  constructor(private readonly app: MobileSession) {}

  async calculate(tokens: string[]): Promise<string> {
    await this.clear();
    for (const token of tokens) {
      await this.tapToken(token);
    }
    await this.tap('=');
    return this.result();
  }

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
      const confirm = await this.app.$('android=new UiSelector().textMatches("(?i)(OK|Delete|Clear)")');
      if (await confirm.isExisting()) {
        await confirm.click();
      }
    }
  }

  private async clear(): Promise<void> {
    const clearButton = await this.app.$(this.byId(androidButtonIds.C));
    if (await clearButton.isExisting()) {
      await clearButton.click();
    }
  }

  private async tapToken(token: string): Promise<void> {
    if (/^\d+$/.test(token)) {
      for (const digit of token) {
        await this.tap(digit);
      }
      return;
    }

    await this.tap(token);
  }

  private async tap(symbol: string): Promise<void> {
    const id = androidButtonIds[symbol];
    if (!id) {
      throw new Error(`Unsupported mobile calculator token: ${symbol}`);
    }
    await this.app.$(this.byId(id)).click();
  }

  private async result(): Promise<string> {
    const result = await this.app.$(this.byId('result_final'));
    if (await result.isExisting()) {
      return result.getText();
    }

    return this.app.$(this.byId('result')).getText();
  }

  private byId(id: string): string {
    return `id=com.google.android.calculator:id/${id}`;
  }
}
