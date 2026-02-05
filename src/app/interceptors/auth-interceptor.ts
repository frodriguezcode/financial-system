import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,private Auth:AuthService) {}

intercept(req: HttpRequest<any>, next: HttpHandler) {
  const accessToken = localStorage.getItem('access_token');

  let authReq = req;

  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next.handle(authReq).pipe(
    catchError(err => {

      // 🔴 NO interceptar el login
      if (req.url.includes('login')) {
        return throwError(() => err);
      }

      if (err.status === 401) {
        return this.Auth.refreshToken().pipe(
          switchMap((token: any) => {
            localStorage.setItem('access_token', token);

            return next.handle(
              req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              })
            );
          }),
          catchError(refreshError => {
            this.router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => err);
    })
  );
}


}
