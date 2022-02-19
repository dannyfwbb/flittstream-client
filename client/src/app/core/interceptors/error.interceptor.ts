import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Utilities } from '../../shared/helpers/utilities';
import { CustomHttpParams, HttpResponseMessage, HttpResponseType } from '../../shared/models/http/http';
import { AlertService } from '../../shared/services/alert.service';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((err: HttpResponseBase) => {
          return Utilities.getHttpResponseMessages(err).pipe(
            switchMap((messages) => {
              this.processMessages(messages, request.params as CustomHttpParams);
              return throwError(err);
            }),
          );
        }),
      );
  }

  processMessages(messages: HttpResponseMessage[] | null, requestParams: CustomHttpParams): void {
    if (messages == null) {
      return;
    }

    for (const msg of messages) {
      switch (msg.type) {
        case HttpResponseType.notFound: {
          if (requestParams?.ignoreNotFound) {
            continue;
          }
          break;
        }
        case HttpResponseType.notAuthenticated: {
          this.authService.removeCurrentUser();
          break;
        }
      }

      this.alertService.showHttpResponseMessage(msg);
    }
  }
}
