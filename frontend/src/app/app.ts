import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  helloMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private http = inject(HttpClient);

  loadHello(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<{ message: string }>('/api/hello').subscribe({
      next: (data) => {
        this.helloMessage.set(data.message);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load hello message');
        this.isLoading.set(false);
      }
    });
  }}
