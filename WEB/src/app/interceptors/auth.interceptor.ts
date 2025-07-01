import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    console.log('🔄 HTTP Interceptor - URL:', req.url, 'Token exists:', !!token);

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      console.log('✅ Added Authorization header to request');
      return next.handle(authReq);
    }

    console.log('⚠️ No token found, sending request without Authorization header');
    return next.handle(req);
  }
}