import { Component, OnInit } from '@angular/core';
import { ContentService } from '../services/content.service';
import { DisplayService } from '../services/display.service';
import { GameService } from '../services/game.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
    constructor(private contentService: ContentService,
        private gameService: GameService,
        private displayService: DisplayService,
        private sanitizer: DomSanitizer,
        private http: HttpClient) {}

    private buttonsDisabled: boolean;
    private numberOfDrawnQuestionsInLevel: number;
    private contentIdsForLevel: number[];

    contentHTML: SafeHtml = [];
    hintsEnabled: boolean = this.gameService.getHintsEnabled();
    hintText: string = "";

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
        const isActive = n <= this.gameService.getCurrentLevel();
        const mode = document.documentElement.getAttribute('data-mode');
        if (isActive) {
            return mode === 'light' ? '#E67E51' : '#00E0FF';
        }
        return 'var(--seg-bg)';
    }

    getSegTextColor(n: number): string {
        const isActive = n <= this.gameService.getCurrentLevel();
        if (isActive) {
            const mode = document.documentElement.getAttribute('data-mode');
            return mode === 'light' ? '#ffffff' : '#001f25';
        }
        return 'var(--text-muted)';
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
                const el = document.getElementById("content");
                if (el) el.innerHTML = `<h1>${err.message}</h1>`;
                this.buttonsDisabled = true;
            }
        });
    }

    ngOnInit(): void {
        this.startNewLevel();
    }

    loadContentForQuestion(): void {
        if (this.numberOfDrawnQuestionsInLevel >= this.gameService.getMaxQuestionsPerLevel()
            || this.contentIdsForLevel.length === 0) {
            this.displayService.setView('Result');
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.contentIdsForLevel.length);
        const randomContentId = this.contentIdsForLevel[randomIndex];
        this.contentIdsForLevel.splice(randomIndex, 1);

        this.buttonsDisabled = true;
        this.contentService.getContentById(randomContentId).subscribe({
            next: content => {
                this.gameService.addCorrectAnswerForLevel(content.content_creator);
                this.hintText = content.content_advisory_text;
                this.gameService.addAskedQuestionForLevel(content.content_link);
                this.contentIdsForLevel.splice(randomIndex, 1);
                this.numberOfDrawnQuestionsInLevel++;

                const link: string = content.content_link;
                const ext = link.substring(link.lastIndexOf('.')).toLowerCase();

                if (ext === '.txt') {
                    this.contentHTML = this.sanitizer.bypassSecurityTrustHtml('<span class="txt-loading">Lade Text...</span>');
                    
                    this.http.get(link, { responseType: 'text' }).subscribe({
                        next: (text: string) => {
                            const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                            this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(`<pre class="txt-content">${escaped}</pre>`);
                            this.buttonsDisabled = false;
                        },
                        error: (err: any) => {
                            console.error('TXT load error:', err);
                            const html = this.contentService.renderContentFromLink(link);
                            this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(html);
                            this.buttonsDisabled = false;
                        }
                    });
                } else {
                    const html = this.contentService.renderContentFromLink(link);
                    this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(html);
                    this.buttonsDisabled = false;
                }
            }
        });
    }
}
