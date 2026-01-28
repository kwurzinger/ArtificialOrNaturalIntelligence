import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { QuestionComponent } from './question/question.component';
import { ResultComponent } from './result/result.component';
import { GameService } from './services/game.service';

export function initGameConfig(gameService: GameService) {
  return () => gameService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    ResultComponent,
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    NgIf,
    NgFor,
    HttpClientModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initGameConfig, deps: [GameService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }