import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {
    private lastLevel: number = 5;
    private maxQuestionsPerLevel: number = 2;
    private currentLevel: number = 0;
    private askedQuestionsForLevel: string[] = [];
    private userAnswersForLevel: string[] = [];
    private correctAnswersForLevel: string[] = [];
    private levelResults: string[] = [];

    getLastLevel(): number {
        return this.lastLevel;
    }
    
    getMaxQuestionsPerLevel(): number {
        return this.maxQuestionsPerLevel;
    }

    getCurrentLevel(): number {
        return this.currentLevel;
    }

    increaseCurrentLevel(): void {
        this.currentLevel++;
    }

    getAskedQuestionsForLevel(): string[] {
        return this.askedQuestionsForLevel;
    }

    addAskedQuestionForLevel(content_link: string): void {
        this.askedQuestionsForLevel.push(content_link);
    }

    getUserAnswersForLevel(): string[] {
        return this.userAnswersForLevel;
    }

    addUserAnswerForLevel(userAnswer: string): void {
        this.userAnswersForLevel.push(userAnswer);
    }

    getCorrectAnswersForLevel(): string[] {
        return this.correctAnswersForLevel;
    }

    addCorrectAnswerForLevel(correctAnswer: string): void {
        this.correctAnswersForLevel.push(correctAnswer);
    }

    getLevelResult(level: number): string {
        return this.levelResults[level - 1];
    }

    getScore(): string {
        let pointsGot: number = 0;
        let pointsPossible: number = 0;

        for (let levelResult of this.levelResults) {
            pointsGot += Number(levelResult.split("/")[0]);
            pointsPossible += Number(levelResult.split("/")[1])
        }

        return pointsGot + "/" + pointsPossible;
    }

    addLevelResult(resultString: string): void {
        this.levelResults.push(resultString);
    }

    levelReset(): void {
        this.askedQuestionsForLevel = [];
        this.userAnswersForLevel = [];
        this.correctAnswersForLevel = [];
    }
}