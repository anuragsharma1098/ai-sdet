import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { WindowsSession } from './windowsDriver';

/** High-level Notepad file interactions built on an Appium/WinAppDriver session. */
export class NotepadApp {
  constructor(private readonly app: WindowsSession) {}

  /** Writes multiline text into the active Notepad editor. */
  async write(text: string): Promise<void> {
    const editor = await this.editor();
    await editor.click();
    await this.app.keys(text);
  }

  /** Saves the current document to an absolute or workspace-relative file path. */
  async saveAs(filePath: string): Promise<void> {
    mkdirSync(dirname(filePath), { recursive: true });
    await this.app.keys(['Control', 's']);
    await this.app.keys(filePath);
    await this.app.keys('Enter');
  }

  /** Reads all visible text from the opened Notepad document. */
  async readAll(): Promise<string> {
    return this.editorText();
  }

  /** Supports both modern Windows 11 Notepad and classic Edit control variants. */
  private async editor() {
    const modernEditor = await this.app.$('accessibility id:RichEditD2DPT');
    if (await modernEditor.isExisting()) {
      return modernEditor;
    }
    return this.app.$('class name:Edit');
  }

  /** Reads editor content through ValuePattern first, then falls back to text. */
  private async editorText(): Promise<string> {
    const editor = await this.editor();
    const value = await editor.getAttribute('Value.Value');
    if (value) {
      return value;
    }
    return editor.getText();
  }
}
