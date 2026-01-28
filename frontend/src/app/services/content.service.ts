import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DisplayService } from './display.service';

type ContentIdsDto = { content_id: number };

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(private http: HttpClient, private displayService: DisplayService) {}

  private baseURL: string = "http://localhost:5000";

  getContentIdsByLevel(level: number): Observable<number[]> {
    return this.http
      .get<ContentIdsDto[]>(`${this.baseURL}/content/level/${level}`)
      .pipe(
        map(items => items.map(x => x.content_id)),
        catchError((err: HttpErrorResponse) => {
          let msg: string;

          if (err.error && typeof err.error === 'object') {
            msg = err.error.message;
          }

          return throwError(() => new Error(msg ?? `HTTP ${err.status}`));
        })
      );
  }

  getContentById(content_id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/content/${content_id}`);
  }

  renderContentFromLink(content_link: string): string {
    const fileEnding: string = content_link.substring(content_link.lastIndexOf("."));
    let contentHtml: string;

    let imageWidth: number = 60;
    let imageHeight: number = 60;
    let videoWidth: number = 50;
    let videoHeight: number = 50;
    let iframeWidth: number = 100;
    let iframeHeight: number = 400;
    let autoplayString: string = "autoplay";

    if (this.displayService.getView() == "Result"){
      imageWidth = 35;
      imageHeight = 35;
      videoWidth = 30;
      videoHeight = 30;
      iframeWidth = 40;
      iframeHeight = 150;
      autoplayString = "";
    }

    if ([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".tiff", ".bmp"].includes(fileEnding)){
      contentHtml = `<img src="${content_link}" width="${imageWidth}%" height="${imageHeight}%"/>`;
    }

    else if ([".mp3", ".aac", ".ogg", ".flac", ".alac", ".wav", ".aiff"].includes(fileEnding)){
      contentHtml = `<audio src="${content_link}" controls ${autoplayString}></audio>`;
    }

    else if ([".mp4", ".mkv", ".mov", ".avi", ".wmv", ".webm"].includes(fileEnding)) {
      contentHtml = `<video src="${content_link}" width="${videoWidth}%" height="${videoHeight}%" controls ${autoplayString}></video>`
    }
    
    else {
      contentHtml = `<iframe src="${content_link}" width="${iframeWidth}%" height="${iframeHeight}vh"></iframe>`;
    }

    return contentHtml;
  }
}