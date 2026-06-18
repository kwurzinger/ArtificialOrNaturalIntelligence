import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

type AdminLoginResponse = { access_token: string };
export type AdminUser = { admin_id: number; username: string };
export type ContentAdminItem = {
  content_id: number;
  content_level: number;
  content_link: string;
  content_creator: string;
  content_advisory_text?: string;
};

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseURL: string = 'http://localhost:5000';
  private tokenStorageKey: string = 'adminAccessToken';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<void> {
    return this.http.post<AdminLoginResponse>(`${this.baseURL}/admin/login`, { username, password }).pipe(
      map(response => {
        localStorage.setItem(this.tokenStorageKey, response.access_token);
      }),
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  getCurrentUsername(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payloadPart = token.split('.')[1] ?? '';
      const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
      const payload = JSON.parse(atob(paddedPayload));
      return payload?.username ?? '';
    } catch {
      return '';
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
  }

  isLoggedIn(): boolean {
    return Boolean(this.getToken());
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` });
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.baseURL}/admin/users`, { headers: this.getAuthHeaders() }).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  createUser(username: string, password: string): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${this.baseURL}/admin`, { username, password }, { headers: this.getAuthHeaders() }).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  deleteUser(username: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/admin/${encodeURIComponent(username)}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  changePassword(username: string, currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/admin/change-password`, {
      username,
      currentPassword,
      newPassword,
    }, { headers: this.getAuthHeaders() }).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  uploadContent(content_level: number, content_creator: string, content_advisory_text: string, file: File): Observable<ContentAdminItem> {
    const formData = new FormData();
    formData.append('content_level', String(content_level));
    formData.append('content_creator', content_creator);
    formData.append('content_advisory_text', content_advisory_text ?? '');
    formData.append('file', file);

    return this.http.post<ContentAdminItem>(`${this.baseURL}/content`, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  deleteContent(content_id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/content/${content_id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let msg: string = `HTTP ${err.status}`;

    if (err.error && typeof err.error === 'object' && err.error.message) {
      msg = Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
    } else if (typeof err.error === 'string') {
      msg = err.error;
    }

    if (err.status === 401) {
      msg = msg || 'Nicht angemeldet oder Session abgelaufen.';
    }

    return throwError(() => new Error(msg));
  }
}
