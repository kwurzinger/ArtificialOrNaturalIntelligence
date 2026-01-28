import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DisplayService } from '../services/display.service';
import { GameService } from '../services/game.service';
import { ContentService } from '../services/content.service';

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
    private sanitizer: DomSanitizer
  ) {}

  resultsHTML: SafeHtml[] = [];

  getLevel(): number {
    return this.gameService.getCurrentLevel();
  }

  onContinue(): void {
    if (this.gameService.getCurrentLevel() == this.gameService.getLastLevel()){
      this.displayService.setView("Finish");
    }

    else {
      this.displayService.setView("Question");
    }
  }

  ngOnInit(): void {
    const askedQuestions = this.gameService.getAskedQuestionsForLevel();
    const correctAnswers = this.gameService.getCorrectAnswersForLevel();
    const userAnswers = this.gameService.getUserAnswersForLevel();
    let numberOfCorrectAnswers = 0;

    if (!(askedQuestions.length === correctAnswers.length && askedQuestions.length === userAnswers.length)) {
      throw new Error("Fataler Fehler! Die Anzahl der gestellten Fragen muss mit der Anzahl der Antworten übereinstimmen!");
    }

    for (let index in askedQuestions) {
      const isUserAnswerCorrect: boolean = userAnswers[index] == correctAnswers[index];

      if (isUserAnswerCorrect) {
        numberOfCorrectAnswers++;
      }

      const contentHTML: string = this.contentService.renderContentFromLink(askedQuestions[index]);
      let finalHTML = "<div style='display: flex; align-items: center;'>";
      finalHTML += contentHTML;
      finalHTML += `<span style='margin-left: 1em; font-size: 1.5em; color: ${isUserAnswerCorrect ? "green" : "red"};'>`;
      finalHTML += `Deine Antwort: ${userAnswers[index]} ist ${isUserAnswerCorrect ? "richtig" : "falsch"}`;
      finalHTML += "<span></div>";
      this.resultsHTML.push(this.sanitizer.bypassSecurityTrustHtml(finalHTML));
    }

    this.gameService.addLevelResult(numberOfCorrectAnswers + "/" + askedQuestions.length);
  }
}