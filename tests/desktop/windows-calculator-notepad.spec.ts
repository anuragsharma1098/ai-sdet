import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { CalculatorApp } from '../../src/desktop/CalculatorApp';
import { NotepadApp } from '../../src/desktop/NotepadApp';
import { createWindowsSession } from '../../src/desktop/windowsDriver';

/**
 * Windows-only desktop workflow. The @desktop tag keeps this out of the default
 * CI-safe suite because it requires a Windows GUI session and Appium endpoint.
 */
test.describe('Question #3: Windows desktop automation @desktop', () => {
  test('calculates results, saves summary in Notepad, and validates reopened file', async () => {
    // Timestamped files make repeated local or review runs non-destructive.
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = join(
      process.cwd(),
      'artifacts',
      'desktop',
      `calculator-summary-${timestamp}.txt`
    );
    const calculations = [
      { expression: '25 + 15', tokens: ['25', '+', '15'], expected: '40' },
      { expression: '144 / 12', tokens: ['144', '/', '12'], expected: '12' },
      { expression: '9 * 8 - 7', tokens: ['9', '*', '8', '-', '7'], expected: '65' }
    ];

    const calculatorSession = await createWindowsSession(
      'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App'
    );
    const calculator = new CalculatorApp(calculatorSession);
    const results: string[] = [];

    try {
      for (const calculation of calculations) {
        const result = await calculator.calculate(calculation.tokens);
        expect(result).toContain(calculation.expected);
        results.push(`${calculation.expression} = ${result}`);
      }
    } finally {
      await calculatorSession.deleteSession();
    }

    const summary = [
      'Windows Calculator Execution Summary',
      `Execution timestamp: ${timestamp}`,
      '',
      ...results
    ].join('\n');

    const notepadSession = await createWindowsSession('C:\\Windows\\System32\\notepad.exe');
    const notepad = new NotepadApp(notepadSession);
    try {
      await notepad.write(summary);
      await notepad.saveAs(filePath);
    } finally {
      await notepadSession.deleteSession();
    }

    expect(existsSync(filePath)).toBe(true);

    const reopenedSession = await createWindowsSession(
      'C:\\Windows\\System32\\notepad.exe',
      filePath
    );
    const reopenedNotepad = new NotepadApp(reopenedSession);
    try {
      const reopenedText = await reopenedNotepad.readAll();
      for (const result of results) {
        expect(reopenedText).toContain(result);
      }
      expect(reopenedText).toContain(`Execution timestamp: ${timestamp}`);
    } finally {
      await reopenedSession.deleteSession();
    }
  });
});
