import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { GameLibraryService, Game } from '@services/game-library.service';
import { GameLibraryDrawer } from '@components/emulator/game-library-drawer/game-library-drawer';
import { VirtualKeyboard } from '@components/emulator/virtual-keyboard/virtual-keyboard';

declare const EstyJs: any;

@Component({
  selector: 'app-emulator',
  imports: [GameLibraryDrawer, VirtualKeyboard],
  templateUrl: './emulator.html',
  styleUrl: './emulator.scss',
})
export class Emulator implements AfterViewInit, OnDestroy {
  private emulator: any = null;

  soundLabel = 'Turn sound on';
  pauseLabel = 'Pause';
  mouseLockLabel = 'Lock mouse';
  selectedGame: Game | null = null;
  libraryOpen = false;
  fullscreen = false;
  monoMonitor = false;
  tosLabel: string | null = null;
  private mousePollInterval: any = null;

  constructor(public gameLibrary: GameLibraryService) {}

  private readonly SCRIPTS = [
    'estyjs/estyjs.js',
    'estyjs/bug.js',
    'estyjs/memory.js',
    'estyjs/processor.js',
    'estyjs/display.js',
    'estyjs/keyboard.js',
    'estyjs/mfp.js',
    'estyjs/fdc.js',
    'estyjs/io.js',
    'estyjs/sound.js',
    'estyjs/snapshot.js',
    'estyjs/rawinflate.js',
    'estyjs/js-unzip.js',
    'estyjs/files.js',
  ];

  ngAfterViewInit(): void {
    this.loadScriptsSequentially(0);
  }

  private loadScriptsSequentially(index: number): void {
    if (index >= this.SCRIPTS.length) {
      this.initEmulator();
      return;
    }
    const script = document.createElement('script');
    script.src = this.SCRIPTS[index];
    script.dataset['estyjs'] = 'true';
    script.onload = () => this.loadScriptsSequentially(index + 1);
    document.body.appendChild(script);
  }

  private initEmulator(): void {
    this.emulator = EstyJs('EstyJsOutput');
    this.emulator.setRowSkip(false);
    this.emulator.setMonoMonitor(false);
    this.mousePollInterval = setInterval(() => {
      if (this.emulator) {
        const locked = this.emulator.getMouseLocked();
        this.mouseLockLabel = locked ? 'Unlock mouse' : 'Lock mouse';
      }
    }, 250);
  }

  onReset(): void { this.emulator?.reset(); }

onPauseResume(): void {
    const running = this.emulator?.pauseResume();
    this.pauseLabel = running ? 'Pause' : 'Resume';
  }

  onSoundToggle(): void {
    const on = this.emulator?.soundToggle();
    this.soundLabel = on ? 'Turn sound off' : 'Turn sound on';
  }

  onLockMouse(): void { this.emulator?.lockMouse(); }

  onToggleMonitor(): void {
    this.monoMonitor = !this.monoMonitor;
    this.emulator?.setMonoMonitor(this.monoMonitor);
    this.emulator?.reset();
  }

  onChangeTOS(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) return;
    const file = files[0];
    this.tosLabel = file.name;
    this.emulator?.changeTOS(file);
  }

  onToggleFullscreen(): void {
    const canvas = document.getElementById('EstyJsOutput');
    if (!this.fullscreen) {
      canvas?.requestFullscreen().then(() => {
        this.emulator?.lockMouse();
      });
    } else {
      document.exitFullscreen();
    }
    this.fullscreen = !this.fullscreen;
  }

  onGameClick(game: Game): void {
    this.selectedGame = game;
    this.emulator?.openFloppyFile('A', 'estyjs/games/' + game.file);
  }

  onFileA(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) return;
    const file = files[0];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (ext === '.sts') this.emulator?.openSnapshotFile(file);
    else if (ext === '.st' || ext === '.msa') this.emulator?.openFloppyFile('A', file);
    else if (ext === '.zip') this.emulator?.openZipFile('A', file);
  }

  toggleLibrary(): void { this.libraryOpen = !this.libraryOpen; }

  onEjectA(): void {
    this.selectedGame = null;
    this.emulator?.openFloppyFile('A', null);
  }

  onFileB(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) return;
    const file = files[0];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (ext === '.sts') this.emulator?.openSnapshotFile(file);
    else if (ext === '.st' || ext === '.msa') this.emulator?.openFloppyFile('B', file);
    else if (ext === '.zip') this.emulator?.openZipFile('B', file);
  }

  ngOnDestroy(): void {
    if (this.mousePollInterval) clearInterval(this.mousePollInterval);
  }
}
