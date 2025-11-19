import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ProtectedResponse
} from '../models/user.model';
import { ApiMessageResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register/`, data);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.setUser(response.user);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): Observable<ApiMessageResponse> {
    const token = this.getToken();
    return this.http.post<ApiMessageResponse>(`${this.apiUrl}/logout/${token}/`, {})
      .pipe(
        tap(() => {
          this.clearAuth();
        })
      );
  }

  protected(): Observable<ProtectedResponse> {
    const token = this.getToken();
    return this.http.get<ProtectedResponse>(`${this.apiUrl}/protected/${token}/`);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getUser(): User | null {
    return this.getUserFromStorage();
  }

  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
