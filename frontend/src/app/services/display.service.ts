import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  private view: string = "Question";

  setView(view: string){
    this.view = view;
  }

  getView(): string {
    return this.view;
  }
}