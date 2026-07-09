import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.hasSession());
  private currentUser = new BehaviorSubject<string>(this.getStoredUsername());
  private currentUserRole = new BehaviorSubject<string>(this.getStoredRole());

  isLoggedIn$ = this.loggedIn.asObservable();
  currentUser$ = this.currentUser.asObservable();
  currentUserRole$ = this.currentUserRole.asObservable();

  constructor(private http: HttpClient) {}

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        sessionStorage.setItem('crm_user', response.username);
        sessionStorage.setItem('crm_token', response.token);
        if (response.role) {
          sessionStorage.setItem('crm_role', response.role);
          this.currentUserRole.next(response.role);
        }
        this.loggedIn.next(true);
        this.currentUser.next(response.username);
      })
    );
  }

  signup(request: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request);
  }

  logout(): void {
    sessionStorage.removeItem('crm_user');
    sessionStorage.removeItem('crm_token');
    sessionStorage.removeItem('crm_role');
    this.loggedIn.next(false);
    this.currentUser.next('');
    this.currentUserRole.next('');
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  getUsername(): string {
    return this.currentUser.value;
  }

  getRole(): string {
    return this.currentUserRole.value;
  }

  hasRole(allowedRoles: string[]): boolean {
    const role = this.getRole();
    return allowedRoles.includes(role);
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  private hasSession(): boolean {
    return !!sessionStorage.getItem('crm_user');
  }

  private getStoredUsername(): string {
    return sessionStorage.getItem('crm_user') || '';
  }

  private getStoredRole(): string {
    return sessionStorage.getItem('crm_role') || '';
  }
}
