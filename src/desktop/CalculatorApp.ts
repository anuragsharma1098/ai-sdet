import type { WindowsSession } from './windowsDriver';

/** Maps calculation tokens to Windows Calculator automation IDs. */
const calculatorButtons: Record<string, string> = {
  '0': 'num0Button',
  '1': 'num1Button',
  '2': 'num2Button',
  '3': 'num3Button',
  '4': 'num4Button',
  '5': 'num5Button',
  '6': 'num6Button',
  '7': 'num7Button',
  '8': 'num8Button',
  '9': 'num9Button',
  '+': 'plusButton',
  '-': 'minusButton',
  '*': 'multiplyButton',
  '/': 'divideButton',
  '=': 'equalButton',
  C: 'clearButton'
};

/** High-level Windows Calculator actions built on an Appium/WinAppDriver session. */
export class CalculatorApp {
  constructor(private readonly app: WindowsSession) {}

  /** Enters the supplied token sequence, evaluates it, and returns display text. */
  async calculate(tokens: string[]): Promise<string> {
    await this.press('C');
    for (const token of tokens) {
      await this.pressToken(token);
    }
    await this.press('=');
    return this.result();
  }

  /** Expands multi-digit tokens into individual calculator button presses. */
  private async pressToken(token: string): Promise<void> {
    if (/^\d+$/.test(token)) {
      for (const digit of token) {
        await this.press(digit);
      }
      return;
    }

    await this.press(token);
  }

  /** Presses a calculator button by stable accessibility ID. */
  private async press(symbol: string): Promise<void> {
    const automationId = calculatorButtons[symbol];
    if (!automationId) {
      throw new Error(`Unsupported calculator token: ${symbol}`);
    }
    await this.app.$(`accessibility id:${automationId}`).click();
  }

  /** Normalizes the Windows Calculator display text to the raw result value. */
  private async result(): Promise<string> {
    const display = await this.app.$('accessibility id:CalculatorResults').getText();
    return display.replace(/^Display is\s*/i, '').trim();
  }
}
