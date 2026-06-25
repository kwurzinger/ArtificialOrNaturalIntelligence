import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DisplayService } from '../services/display.service';
import { GameService } from '../services/game.service';
import { ContentService } from '../services/content.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  constructor(
    private gameService: GameService,
    private contentService: ContentService,
    private displayService: DisplayService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  resultsHTML: SafeHtml[] = [];
  loading = true;

  getLevel(): number {
    return this.gameService.getCurrentLevel();
  }

  onContinue(): void {
    if (this.gameService.getCurrentLevel() == this.gameService.getLastLevel()) {
      this.displayService.setView('Finish');
    } else {
      this.displayService.setView('Question');
    }
  }

  private buildResultHTML(contentHTML: string, userguess: string, isCorrect: boolean): string {
    const colorClass = isCorrect ? 'answer-correct' : 'answer-wrong';
    const label = `Deine Antwort "${userguess}" ist ${isCorrect ? 'Richtig' : 'Falsch'}`;
    return `
      <div class="result-row">
        <div class="result-content">${contentHTML}</div>
        <span class="result-label ${colorClass}">${label}</span>
      </div>`;
  }

  ngOnInit(): void {
    const askedQuestions = this.gameService.getAskedQuestionsForLevel();
    const correctAnswers = this.gameService.getCorrectAnswersForLevel();
    const userAnswers = this.gameService.getUserAnswersForLevel();
    let numberOfCorrectAnswers = 0;

    if (!(askedQuestions.length === correctAnswers.length && askedQuestions.length === userAnswers.length)) {
      throw new Error('Fataler Fehler! Die Anzahl der gestellten Fragen muss mit der Anzahl der Antworten übereinstimmen!');
    }

    // Pre-fill array with placeholders to maintain order
    this.resultsHTML = askedQuestions.map(() =>
      this.sanitizer.bypassSecurityTrustHtml('<div class="result-row"><span class="txt-loading">Lade...</span></div>')
    );

    let pending = 0;

    for (let i = 0; i < askedQuestions.length; i++) {
      const link = askedQuestions[i];
      const isCorrect = userAnswers[i] == correctAnswers[i];
      if (isCorrect) numberOfCorrectAnswers++;

      const ext = link.substring(link.lastIndexOf('.')).toLowerCase();

      if (ext === '.txt') {
        pending++;
        this.http.get(link, { responseType: 'text' }).subscribe({
          next: (text: string) => {
            const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const contentHTML = `<pre class="txt-content">${escaped}</pre>`;
            this.resultsHTML[i] = this.sanitizer.bypassSecurityTrustHtml(this.buildResultHTML(contentHTML, userAnswers[i], isCorrect));
            pending--;
            if (pending === 0) this.gameService.addLevelResult(numberOfCorrectAnswers + '/' + askedQuestions.length);
          },
          error: () => {
            const contentHTML = this.contentService.renderContentFromLink(link);
            this.resultsHTML[i] = this.sanitizer.bypassSecurityTrustHtml(this.buildResultHTML(contentHTML, userAnswers[i], isCorrect));
            pending--;
            if (pending === 0) this.gameService.addLevelResult(numberOfCorrectAnswers + '/' + askedQuestions.length);
          }
        });
      } else {
        const contentHTML = this.contentService.renderContentFromLink(link);
        this.resultsHTML[i] = this.sanitizer.bypassSecurityTrustHtml(this.buildResultHTML(contentHTML, userAnswers[i], isCorrect));
      }
    }

    if (pending === 0) {
      this.gameService.addLevelResult(numberOfCorrectAnswers + '/' + askedQuestions.length);
    }
  }
}
