import { expect, test } from '@playwright/test';
import { MobileCalculatorApp } from '../../src/mobile/MobileCalculatorApp';
import { createAndroidCalculatorSession } from '../../src/mobile/mobileDriver';

/**
 * Android Calculator workflow. The @mobile tag keeps device-dependent execution
 * separate from the default CI-safe web/API suite.
 */
test.describe('Question #4: Native mobile calculator automation @mobile', () => {
  test('executes and validates calculator scenarios, then clears history', async () => {
    const session = await createAndroidCalculatorSession();
    const calculator = new MobileCalculatorApp(session);

    try {
      // Tokens mirror calculator button presses while expected values assert outcomes.
      const scenarios = [
        {
          expression: '(25 + 15) * 3 - 10',
          tokens: ['(', '25', '+', '15', ')', '*', '3', '-', '10'],
          expected: '110'
        },
        { expression: '125 / 5 + 18', tokens: ['125', '/', '5', '+', '18'], expected: '43' },
        { expression: '99 * 2 - 45', tokens: ['99', '*', '2', '-', '45'], expected: '153' }
      ];

      for (const scenario of scenarios) {
        const result = await calculator.calculate(scenario.tokens);
        expect(result, scenario.expression).toContain(scenario.expected);
      }

      await calculator.clearHistory();
    } finally {
      await session.deleteSession();
    }
  });
});
