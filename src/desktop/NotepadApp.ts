import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { WindowsSession } from './windowsDriver';

export class NotepadApp {
  constructor(private readonly app: WindowsSession) {}

  async write(text: string): Promise<void> {
    const editor = await this.editor();
    await editor.click();
    await this.app.keys(text);
  }

  async saveAs(filePath: string): Promise<void> {
    mkdirSync(dirname(filePath), { recursive: true });
    await this.app.keys(['Control', 's']);
    await this.app.keys(filePath);
    await this.app.keys('Enter');
  }

  async readAll(): Promise<string> {
    return this.editorText();
  }

  private async editor() {
    const modernEditor = await this.app.$('accessibility id:RichEditD2DPT');
    if (await modernEditor.isExisting()) {
      return modernEditor;
    }
    return this.app.$('class name:Edit');
  }

  private async editorText(): Promise<string> {
    const editor = await this.editor();
    const value = await editor.getAttribute('Value.Value');
    if (value) {
      return value;
    }
    return editor.getText();
  }
}
