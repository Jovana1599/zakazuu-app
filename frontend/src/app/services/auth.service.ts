import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

interface User {
  id: number;
  name: string;
  email: string;
  role_as: number;
}

interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    role_as: number
  ): Observable<AuthResponse> {
    return this.apiService
      .post<AuthResponse>('/register', {
        name,
        email,
        password,
        password_confirmation,
        role_as,
      })
      .pipe(tap((response) => this.saveAuthData(response)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.apiService
      .post<AuthResponse>('/login', {
        email,
        password,
      })
      .pipe(tap((response) => this.saveAuthData(response)));
  }

  logout(): Observable<any> {
    return this.apiService.post('/logout', {}).pipe(tap(() => this.clearAuthData()));
  }

  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isParent(): boolean {
    const user = this.getCurrentUser();
    return user?.role_as === 0;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role_as === 1;
  }

  isInstitution(): boolean {
    const user = this.getCurrentUser();
    return user?.role_as === 2;
  }
}
