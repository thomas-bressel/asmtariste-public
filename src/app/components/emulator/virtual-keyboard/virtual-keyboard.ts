import { Component } from '@angular/core';

interface VKey {
  label: string;
  keyCode: number;
  wide?: boolean;
}

@Component({
  selector: 'app-virtual-keyboard',
  imports: [],
  templateUrl: './virtual-keyboard.html',
  styleUrl: './virtual-keyboard.scss',
})
export class VirtualKeyboard {

  readonly rows: VKey[][] = [
    [
      { label: 'ESC',   keyCode: 27 },
      { label: 'Enter', keyCode: 13 },
      { label: 'SPACE', keyCode: 32, wide: true },
    ],
    [
      { label: '↑', keyCode: 38 },
    ],
    [
      { label: '←', keyCode: 37 },
      { label: '↓', keyCode: 40 },
      { label: '→', keyCode: 39 },
    ],
  ];

  fire(vkey: VKey): void {
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: vkey.keyCode, which: vkey.keyCode, bubbles: true }));
  }

  release(vkey: VKey): void {
    document.dispatchEvent(new KeyboardEvent('keyup', { keyCode: vkey.keyCode, which: vkey.keyCode, bubbles: true }));
  }
}
