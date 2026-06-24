import { Component, OnInit } from '@angular/core';
import { DisplayService } from './services/display.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MatSnackBar],
})
export class AppComponent implements OnInit {
  isAIMode = true;

  constructor(private gameService: GameService, private displayService: DisplayService) {}

  ngOnInit(): void {
    const path = window.location.pathname.replace(/\/$/, '');
    if (path === '/admin') {
      this.displayService.setView('Admin');
    }

    const saved = localStorage.getItem('mode');
    this.isAIMode = saved !== 'human';
    this.applyMode(false);
  }

  toggleMode(): void {
    this.isAIMode = !this.isAIMode;
    this.applyMode(true);
    localStorage.setItem('mode', this.isAIMode ? 'ai' : 'human');
  }

  private applyMode(animate: boolean): void {
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-mode', this.isAIMode ? 'ai' : 'human');

    if (animate) {
      const cls = this.isAIMode ? 'mode-switch-ai' : 'mode-switch-human';
      body.classList.add(cls);
      setTimeout(() => body.classList.remove(cls), 500);
    }
  }

  get levels(): number[] {
    return Array.from({ length: this.gameService.getLastLevel() }, (_, i) => i + 1);
  }

  getLevelResult(level: number): string {
    return this.gameService.getLevelResult(level);
  }

  getScore(): string {
    return this.gameService.getScore();
  }

  restartGame(): void {
    window.location.reload();
  }

  isQuestionView(): boolean { return this.displayService.getView() == 'Question'; }
  isResultView(): boolean   { return this.displayService.getView() == 'Result'; }
  isFinishView(): boolean   { return this.displayService.getView() == 'Finish'; }
  isAdminView(): boolean    { return this.displayService.getView() == 'Admin'; }
}
