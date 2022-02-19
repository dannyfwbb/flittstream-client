import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../shared/services/configuration.service';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private apiUrl: string = null;

  constructor(
    private authService: AuthService,
    configService: ConfigurationService,
  ) {
    configService.appSettingsLoaded$
      .subscribe({
        next: (loaded: boolean) => {
          if (loaded) {
            this.apiUrl = configService.settings.api.url;
          }
        },
      });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.isAuthenticated) {
      const isApiUrl = this.apiUrl && request.url.startsWith(this.apiUrl);
      if (isApiUrl) {
        request = request.clone({
          setHeaders: {
            Authorization: this.authService.authorizationHeaderValue,
          },
          withCredentials: true,
        });
      }
    }

    return next.handle(request);
  }
}
