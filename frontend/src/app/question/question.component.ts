import { Component, OnInit } from '@angular/core';
import { ContentService } from '../services/content.service';
import { DisplayService } from '../services/display.service';
import { GameService } from '../services/game.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
    constructor(private contentService: ContentService,
        private gameService: GameService,
        private displayService: DisplayService,
        private sanitizer: DomSanitizer) {}

    private buttonsDisabled: boolean;
    private numberOfDrawnQuestionsInLevel: number;
    private contentIdsForLevel: number[];

    contentHTML: SafeHtml = [];

    get levels(): number[] {
        return Array.from({ length: this.gameService.getLastLevel() }, (_, i) => i + 1);
    }

    areButtonsDisabled(): boolean {
        return this.buttonsDisabled;
    }

    onChoice(choice: string): void {
        this.gameService.addUserAnswerForLevel(choice);
        this.loadContentForQuestion();
    }

    getBg(n: number): string {
        return n <= this.gameService.getCurrentLevel() ? '#33b400' : '#ffffff';
    }

    startNewLevel(): void {
        this.gameService.levelReset();
        this.gameService.increaseCurrentLevel();
        this.numberOfDrawnQuestionsInLevel = 0;

        this.contentService.getContentIdsByLevel(this.gameService.getCurrentLevel()).subscribe({
            next: ids => {
                this.contentIdsForLevel = ids;
                this.loadContentForQuestion();
            },
            error: (err) => {
                this.contentIdsForLevel = [];
                document.getElementById("content").innerHTML = `<h1>${err.message}</h1>`;
                this.buttonsDisabled = true;
            }
        });
    }
    
    loadContentForQuestion(): void {
        if (this.contentIdsForLevel.length === 0 || this.numberOfDrawnQuestionsInLevel === this.gameService.getMaxQuestionsPerLevel()) {
            this.displayService.setView("Result");
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.contentIdsForLevel.length);
        const randomContentId = this.contentIdsForLevel[randomIndex];

        this.contentService.getContentById(randomContentId).subscribe({
            next: content => {
                this.gameService.addCorrectAnswerForLevel(content.content_creator);
                const html = this.contentService.renderContentFromLink(content.content_link);
                this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(html);
                this.gameService.addAskedQuestionForLevel(content.content_link);
                this.contentIdsForLevel.splice(randomIndex, 1)
                this.numberOfDrawnQuestionsInLevel++;
            }
        });
    }

    ngOnInit(): void {
        this.buttonsDisabled = false;
        this.startNewLevel();
    }
}