import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, PLATFORM_ID, Provider } from '@angular/core';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { NoCacheHeadersInterceptor } from './core/interceptors/cache.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ObjectSafe } from './shared/helpers/common';
import { FSC_DOCUMENT, FSC_WINDOW } from './shared/injection-tokens';
import { ConfigurationService } from './shared/services/configuration.service';

const windowFactory = (platformId: ObjectSafe): Window | undefined => {
  return isPlatformBrowser(platformId) ? window : undefined;
};

const initConfig = (config: ConfigurationService) => {
  return (): Promise<unknown> => config.loadAppConfig();
};

export const appProviders: Provider[] = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: NoCacheHeadersInterceptor, multi: true },
  { provide: FSC_DOCUMENT, useExisting: DOCUMENT },
  { provide: FSC_WINDOW, useFactory: windowFactory, deps: [PLATFORM_ID] },
  { provide: APP_INITIALIZER, useFactory: initConfig, multi: true, deps: [ConfigurationService] },
  // { provide: ErrorHandler, useClass: AppErrorHandler },
];
