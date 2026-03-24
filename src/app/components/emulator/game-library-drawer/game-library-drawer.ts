import { Component, inject, input, output } from '@angular/core';
import { Game, GameLibraryService } from '@services/game-library.service';
import { GameBoxModal } from '@components/emulator/game-box-modal/game-box-modal';

@Component({
  selector: 'app-game-library-drawer',
  imports: [GameBoxModal],
  templateUrl: './game-library-drawer.html',
  styleUrl: './game-library-drawer.scss',
})
export class GameLibraryDrawer {
  readonly gameLibrary = inject(GameLibraryService);

  isOpen = input<boolean>(false);
  selectedGame = input<Game | null>(null);
  gamePicked = output<Game>();
  toggled = output<void>();

  previewGame: Game | null = null;

  onToggle(): void {
    this.toggled.emit();
  }

  onGameClick(game: Game): void {
    this.gamePicked.emit(game);
  }

  onGameRightClick(event: MouseEvent, game: Game): void {
    event.preventDefault();
    this.previewGame = game;
  }

  onModalClose(): void {
    this.previewGame = null;
  }

  miniUrl(game: Game): string {
    return `images/games/mini/${game.image}-front-mini.webp`;
  }
}
