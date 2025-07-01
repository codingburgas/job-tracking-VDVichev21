import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Sending login request:', credentials);
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
        .pipe(
            tap(response => {
              if (environment.features.enableConsoleLogging) {
                console.log('✅ Login response received:', response);
                console.log('👤 User role from response:', response.user.role);
              }
              this.setAuthData(response);
            })
        );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Sending registration request:', userData);
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
        .pipe(
            tap(response => {
              if (environment.features.enableConsoleLogging) {
                console.log('✅ Registration response received:', response);
                console.log('👤 User role from response:', response.user.role);
              }
              this.setAuthData(response);
            })
        );
  }

  logout(): void {
    if (environment.features.enableConsoleLogging) {
      console.log('🚪 Logging out user');
    }

    localStorage.removeItem(environment.auth.tokenKey);
    localStorage.removeItem(environment.auth.userKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;

    if (environment.features.enableConsoleLogging) {
      console.log('🔐 Authentication check:', isAuth, 'Token exists:', !!token);
    }

    // Additional check: verify token isn't expired
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = (payload.exp * 1000) < (Date.now() + environment.auth.tokenExpirationBuffer);
        if (isExpired) {
          if (environment.features.enableConsoleLogging) {
            console.log('⏰ Token is expired, logging out');
          }
          this.logout();
          return false;
        }
      } catch (error) {
        if (environment.features.enableConsoleLogging) {
          console.log('❌ Invalid token format, logging out');
        }
        this.logout();
        return false;
      }
    }

    return isAuth;
  }

  // Since we removed admin functionality, this method now always returns false
  // but we keep it for backward compatibility with existing components
  isAdmin(): boolean {
    if (environment.features.enableConsoleLogging) {
      console.log('👑 Admin check - Admin functionality has been removed, everyone has equal access');
    }
    return false;
  }

  getToken(): string | null {
    const token = localStorage.getItem(environment.auth.tokenKey);
    if (environment.features.enableConsoleLogging) {
      console.log('🎫 Getting token:', token ? 'Token exists' : 'No token found');
    }
    return token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setAuthData(response: AuthResponse): void {
    if (environment.features.enableConsoleLogging) {
      console.log('💾 Setting auth data for user:', response.user.username, 'with role:', response.user.role);
    }

    localStorage.setItem(environment.auth.tokenKey, response.token);
    localStorage.setItem(environment.auth.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);

    // Verify the data was stored correctly
    if (environment.features.enableConsoleLogging) {
      const storedUser = JSON.parse(localStorage.getItem(environment.auth.userKey) || '{}');
      console.log('✅ Verified stored user data:', storedUser);
      console.log('🎫 Token stored:', !!localStorage.getItem(environment.auth.tokenKey));
    }
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem(environment.auth.userKey);
    const token = localStorage.getItem(environment.auth.tokenKey);

    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        if (environment.features.enableConsoleLogging) {
          console.log('📱 User loaded from storage:', user.username, 'with role:', user.role);
        }

        // Check if token is still valid
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = (payload.exp * 1000) < (Date.now() + environment.auth.tokenExpirationBuffer);

        if (isExpired) {
          if (environment.features.enableConsoleLogging) {
            console.log('⏰ Stored token is expired, clearing storage');
          }
          this.logout();
        } else {
          this.currentUserSubject.next(user);
          if (environment.features.enableConsoleLogging) {
            console.log('✅ Valid token found, user authenticated');
          }
        }
      } catch (error) {
        if (environment.features.enableConsoleLogging) {
          console.error('❌ Error loading user from storage:', error);
        }
        this.logout();
      }
    } else {
      if (environment.features.enableConsoleLogging) {
        console.log('📱 No user data or token found in storage');
      }
    }
  }
}