import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type HelloResponse = { message: string };
type IdOnly = { content_id: number };
type ContentDetail = { content_link: string; content_creator: string };

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: []
})
export class App {
  // Hello
  helloMessage = signal<string>('');
  isLoadingHello = signal<boolean>(false);
  helloError = signal<string | null>(null);

  // Content IDs by level
  level = signal<number>(1);
  ids = signal<number[]>([]);
  isLoadingIds = signal<boolean>(false);
  idsError = signal<string | null>(null);

  // Selected content detail
  selectedId = signal<number | null>(null);
  detail = signal<ContentDetail | null>(null);
  isLoadingDetail = signal<boolean>(false);
  detailError = signal<string | null>(null);

  private http = inject(HttpClient);

  // Derive a proxied link for static assets (served by backend)
  detailLink = computed(() => {
    const d = this.detail();
    if (!d) return null;
    const link = d.content_link || '';
    return link.startsWith('/static') ? `/api${link}` : link;
  });

  loadHello(): void {
    this.isLoadingHello.set(true);
    this.helloError.set(null);

    this.http.get<HelloResponse>('/api/hello').subscribe({
      next: (data) => {
        this.helloMessage.set(data.message);
        this.isLoadingHello.set(false);
      },
      error: () => {
        this.helloError.set('Failed to load hello message');
        this.isLoadingHello.set(false);
      }
    });
  }

  loadIds(): void {
    this.isLoadingIds.set(true);
    this.idsError.set(null);
    this.ids.set([]);
    this.selectedId.set(null);
    this.detail.set(null);

    const level = this.level();
    this.http.get<IdOnly[]>(`/api/content/level/${level}`).subscribe({
      next: (rows) => {
        const idList = (rows || []).map(r => r.content_id);
        this.ids.set(idList);
        this.isLoadingIds.set(false);
      },
      error: (err) => {
        this.isLoadingIds.set(false);
        if (err?.status === 404) {
          this.idsError.set('Für dieses Level gibt es keine Inhalte.');
        } else {
          this.idsError.set('Konnte IDs nicht laden.');
        }
      }
    });
  }

  selectId(id: number): void {
    this.selectedId.set(id);
    this.detail.set(null);
    this.detailError.set(null);
    this.isLoadingDetail.set(true);

    this.http.get<ContentDetail>(`/api/content/${id}`).subscribe({
      next: (d) => {
        this.detail.set(d);
        this.isLoadingDetail.set(false);
      },
      error: (err) => {
        this.isLoadingDetail.set(false);
        if (err?.status === 404) {
          this.detailError.set('Inhalt mit dieser ID existiert nicht.');
        } else {
          this.detailError.set('Konnte Inhalt nicht laden.');
        }
      }
    });
  }
}
