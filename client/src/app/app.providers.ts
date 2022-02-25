import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, PLATFORM_ID, Provider } from '@angular/core';
import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';
import { AppErrorHandler } from './app-error.handler';
import { ObjectSafe } from './shared/helpers/common';
import { FSC_DOCUMENT, FSC_WINDOW } from './shared/injection-tokens';
import { Utilities } from './shared/services/utilities';
import { AuthGuard } from './_guards/auth.guard';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { NoCacheHeadersInterceptor } from './_interceptors/cache.interceptor';

const windowFactory = (platformId: ObjectSafe): Window | undefined => {
  return isPlatformBrowser(platformId) ? window : undefined;
};

export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    const possibleSeparators = /[?;#]/;
    const indexOfSeparator = url.search(possibleSeparators);
    let processedUrl: string;

    if (indexOfSeparator > -1) {
      const separator = url.charAt(indexOfSeparator);
      const urlParts = Utilities.splitInTwo(url, separator);
      urlParts.firstPart = urlParts.firstPart.toLowerCase();

      processedUrl = urlParts.firstPart + separator + urlParts.secondPart;
    } else {
      processedUrl = url.toLowerCase();
    }

    return super.parse(processedUrl);
  }
}

export const appProviders: Provider[] = [
  { provide: HTTP_INTERCEPTORS, useClass: NoCacheHeadersInterceptor, multi: true },
  { provide: FSC_DOCUMENT, useExisting: DOCUMENT },
  { provide: FSC_WINDOW, useFactory: windowFactory, deps: [PLATFORM_ID] },
  AuthGuard,
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
  { provide: ErrorHandler, useClass: AppErrorHandler },
];
