// core/services/auth.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'st_token';
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signal — fuente de verdad del estado de auth
  private _token = signal<string | null>(
    localStorage.getItem(this.TOKEN_KEY)
  );

  // Computed — derivado del signal
  isAuthenticated = computed(() => !!this._token());

  getToken(): string | null {
    return this._token();
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this._token.set(response.token);
      })
    );
  }

  register(username: string, email: string, password: string) {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/auth/register`,
      { username, email, password }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this._token.set(response.token);
      })
    );
  }

  logout() {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe();
    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }
}