import { Component } from '@angular/core';

interface VKey {
  label: string;
  keyCode: number;
  wide?: boolean;
  spacer?: boolean;
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
      { label: 'FIRE', keyCode: 17 },
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

  protected pressed = new Set<number>();

  private dispatch(type: 'keydown' | 'keyup', keyCode: number): void {
    document.dispatchEvent(new KeyboardEvent(type, { keyCode, which: keyCode, bubbles: true }));
  }

  onTouchStart(event: TouchEvent, vkey: VKey): void {
    event.preventDefault();
    if (!this.pressed.has(vkey.keyCode)) {
      this.pressed.add(vkey.keyCode);
      this.dispatch('keydown', vkey.keyCode);
    }
  }

  onTouchEnd(event: TouchEvent, vkey: VKey): void {
    event.preventDefault();
    this.pressed.delete(vkey.keyCode);
    this.dispatch('keyup', vkey.keyCode);
  }

  onMouseDown(vkey: VKey): void {
    if (!this.pressed.has(vkey.keyCode)) {
      this.pressed.add(vkey.keyCode);
      this.dispatch('keydown', vkey.keyCode);
    }
  }

  onMouseUp(vkey: VKey): void {
    this.pressed.delete(vkey.keyCode);
    this.dispatch('keyup', vkey.keyCode);
  }
}
