import { Component, input, output, signal } from '@angular/core';
import { Game } from '@services/game-library.service';

@Component({
  selector: 'app-game-box-modal',
  imports: [],
  templateUrl: './game-box-modal.html',
  styleUrl: './game-box-modal.scss',
})
export class GameBoxModal {
  game = input.required<Game>();
  closed = output<void>();

  frontVisible = signal(true);
  backVisible = signal(true);

  get frontUrl(): string {
    return `images/games/big/${this.game().image}-front-big.webp`;
  }

  get backUrl(): string {
    return `images/games/big/${this.game().image}-back-big.webp`;
  }

  onClose(): void {
    this.closed.emit();
  }
}
