import { Component } from '@angular/core';
import { DisplayService } from './services/display.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MatSnackBar],
})
export class AppComponent {
  constructor(private gameService: GameService, private displayService: DisplayService){}

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

  changeView(newView: string): void {
    this.displayService.setView(newView);
  }

  isQuestionView(): boolean {
    return this.displayService.getView() == "Question";
  }

  isResultView(): boolean {
    return this.displayService.getView() == "Result";
  }

  isFinishView(): boolean {
    return this.displayService.getView() == "Finish";
  }
}