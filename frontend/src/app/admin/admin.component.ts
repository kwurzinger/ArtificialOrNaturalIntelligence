import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { AdminService, AdminUser, ContentAdminItem } from '../services/admin.service';
import { ContentService } from '../services/content.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  username: string = '';
  password: string = '';
  message: string = '';
  error: string = '';
  loading: boolean = false;

  admins: AdminUser[] = [];
  newAdminUsername: string = '';
  newAdminPassword: string = '';

  passwordUsername: string = '';
  currentPassword: string = '';
  newPassword: string = '';

  contentItems: ContentAdminItem[] = [];
  txtCache: Map<string, string> = new Map();
  selectedLevel: number = 1;
  selectedCreator: string = 'AI';
  advisoryText: string = '';
  selectedFile: File | null = null;

  constructor(
    private adminService: AdminService,
    private contentService: ContentService,
    private gameService: GameService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.passwordUsername = this.currentUsername;
      this.loadAdminData();
    }
  }

  isLoggedIn(): boolean {
    return this.adminService.isLoggedIn();
  }

  get levels(): number[] {
    return Array.from({ length: this.gameService.getLastLevel() }, (_, i) => i + 1);
  }

  get creators(): string[] {
    return ['AI', 'Human'];
  }

  get currentUsername(): string {
    return this.adminService.getCurrentUsername();
  }

  isCurrentAdmin(username: string): boolean {
    return username === this.currentUsername;
  }

  showMessage(text: string): void {
    this.message = text;
    this.error = '';
  }

  showError(text: string): void {
    this.error = text;
    this.message = '';
  }

  login(): void {
    this.loading = true;
    this.adminService.login(this.username, this.password).subscribe({
      next: () => {
        this.passwordUsername = this.currentUsername || this.username;
        this.password = '';
        this.showMessage('Login erfolgreich.');
        this.loadAdminData();
      },
      error: err => {
        this.loading = false;
        this.showError(err.message);
      }
    });
  }

  logout(): void {
    this.adminService.logout();
    this.admins = [];
    this.contentItems = [];
    this.passwordUsername = '';
    this.currentPassword = '';
    this.newPassword = '';
    this.showMessage('Logout erfolgreich.');
  }

  backToGame(): void {
    const path = window.location.pathname;
    const newPath = path.substring(0, path.lastIndexOf('/'));
    window.location.assign(newPath || '/');
  }

  loadAdminData(): void {
    this.loading = true;
    forkJoin({
      admins: this.adminService.getUsers(),
      contents: this.loadContentsForAllLevels(),
    }).subscribe({
      next: result => {
        this.admins = result.admins;
        this.contentItems = result.contents;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.showError(err.message);
      }
    });
  }

  loadContentsForAllLevels() {
    const requests = this.levels.map(level =>
      this.contentService.getContentIdsByLevel(level).pipe(
        mergeMap(ids => {
          if (ids.length === 0) return of([] as ContentAdminItem[]);

          return forkJoin(ids.map(id =>
            this.contentService.getContentById(id).pipe(
              map(content => ({
                content_id: id,
                content_level: level,
                content_link: content.content_link,
                content_creator: content.content_creator,
                content_advisory_text: content.content_advisory_text,
              } as ContentAdminItem))
            )
          ));
        }),
        catchError(() => of([] as ContentAdminItem[]))
      )
    );

    if (requests.length === 0) return of([] as ContentAdminItem[]);

    return forkJoin(requests).pipe(
      map(levelResults => ([] as ContentAdminItem[]).concat(...levelResults))
    );
  }

  createAdmin(): void {
    this.loading = true;
    this.adminService.createUser(this.newAdminUsername, this.newAdminPassword).subscribe({
      next: () => {
        this.newAdminUsername = '';
        this.newAdminPassword = '';
        this.showMessage('Admin-User wurde angelegt.');
        this.loadAdminData();
      },
      error: err => {
        this.loading = false;
        this.showError(err.message);
      }
    });
  }

  deleteAdmin(username: string): void {
    if (this.isCurrentAdmin(username)) {
      this.showError('Du kannst deinen eigenen Admin-User nicht löschen.');
      return;
    }

    if (!confirm(`Admin-User "${username}" wirklich löschen?`)) return;

    this.loading = true;
    this.adminService.deleteUser(username).subscribe({
      next: () => {
        this.showMessage('Admin-User wurde gelöscht.');
        this.loadAdminData();
      },
      error: err => {
        this.loading = false;
        this.showError(err.message);
      }
    });
  }

  changePassword(): void {
    const ownUsername = this.currentUsername || this.passwordUsername;
    if (!ownUsername) {
      this.loading = false;
      this.showError('Eingeloggter User konnte nicht ermittelt werden. Bitte neu einloggen.');
      return;
    }

    this.loading = true;

    this.passwordUsername = ownUsername;
    this.adminService.changePassword(ownUsername, this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.currentPassword = '';
        this.newPassword = '';
        this.showMessage('Passwort wurde geändert.');
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.showError(err.message);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length > 0 ? input.files[0] : null;
  }

  uploadContent(): void {
    if (!this.selectedFile) {
      this.showError('Bitte zuerst eine Datei auswählen.');
      return;
    }

    this.loading = true;
    this.adminService.uploadContent(this.selectedLevel, this.selectedCreator, this.advisoryText, this.selectedFile).subscribe({
      next: () => {
        this.advisoryText = '';
        this.selectedFile = null;
        const fileInput = document.getElementById('contentFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        this.showMessage('Content wurde hochgeladen.');
        this.loadAdminData();
      },
      error: err => {
        this.loading = false;
        this.showError(err.message);
      }
    });
  }

  deleteContent(content_id: number): void {
    if (!confirm(`Content ${content_id} wirklich löschen?`)) return;

    this.loading = true;
    this.adminService.deleteContent(content_id).subscribe({
      next: () => {
        this.showMessage('Content wurde gelöscht.');
        this.loadAdminData();
      },
      error: err => {
        this.loading = false;
        this.showError(err.message);
      }
    });
  }

  renderPreview(content_link: string): SafeHtml {
    const fileEnding = content_link.substring(content_link.lastIndexOf('.')).toLowerCase();
    let html: string;

    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.tiff', '.bmp'].includes(fileEnding)) {
      html = `<img src="${content_link}" style="display:block;width:100%;max-width:420px;height:auto;margin:0 auto;"/>`;
    } else if (['.mp3', '.aac', '.ogg', '.flac', '.alac', '.wav', '.aiff'].includes(fileEnding)) {
      html = `<audio src="${content_link}" controls style="display:block;width:100%;max-width:420px;margin:0 auto;"></audio>`;
    } else if (['.mp4', '.mkv', '.mov', '.avi', '.wmv', '.webm'].includes(fileEnding)) {
      html = `<video src="${content_link}" controls style="display:block;width:100%;max-width:420px;height:auto;margin:0 auto;"></video>`;
    } else if (fileEnding === '.txt') {
      if (this.txtCache.has(content_link)) {
        html = `<pre class="txt-content">${this.txtCache.get(content_link)}</pre>`;
      } else {
        this.http.get(content_link, { responseType: 'text' }).subscribe({
          next: (text: string) => {
            const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            this.txtCache.set(content_link, escaped);
          },
          error: () => this.txtCache.set(content_link, '(Fehler beim Laden)')
        });
        html = '<span class="txt-loading">Lade Text...</span>';
      }
    } else {
      html = `<iframe src="${content_link}" style="display:block;width:100%;max-width:420px;height:160px;margin:0 auto;border:0;"></iframe>`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
