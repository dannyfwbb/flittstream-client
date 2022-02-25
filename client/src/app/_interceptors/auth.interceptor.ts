import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, filter, mergeMap, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshingLogin: boolean;
  private refreshTokenSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = req;

    if (this.authService.isLoggedIn && !authReq.url.includes('connect/token')) {
      authReq = this.addTokenHeader(req)
    }

    return next.handle(authReq).pipe(catchError((error) => {
      if (error instanceof HttpErrorResponse && !authReq.url.includes('connect/token') && error.status === 401) {
        return this.handle401Error(authReq, next);
      }
      return throwError(() => new Error(error));
    }));
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler) {
    if (!this.isRefreshingLogin) {
      this.isRefreshingLogin = true;
      this.refreshTokenSubject$.next(false);

      return from(this.authService.refreshLogin()).pipe(
        mergeMap(() => {
          this.isRefreshingLogin = false;
          this.refreshTokenSubject$.next(true);

          return next.handle(this.addTokenHeader(request));
        }),
        catchError((refreshLoginError) => {
          this.isRefreshingLogin = false;
          //this.authService.logout();

          if (refreshLoginError.status == 401 || (refreshLoginError.error && refreshLoginError.error.error == 'invalid_grant')) {
            return throwError(() => new Error('session expired'));
          } else {
            return throwError(() => new Error(refreshLoginError || 'server error'));
          }
        }));
    }

    return this.refreshTokenSubject$.pipe(
      filter((value) => value),
      take(1),
      switchMap(() => next.handle(this.addTokenHeader(request)))
    );
  }

  private addTokenHeader(request: HttpRequest<unknown>) {
    return request.clone({ setHeaders: {
      Authorization: 'Bearer ' + this.authService.accessToken,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*' }
    });
  }
}

