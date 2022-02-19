import { HttpErrorResponse, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { MonoTypeOperatorFunction, Observable, ObservableInput, OperatorFunction, throwError } from 'rxjs';
import { catchError, scan, tap } from 'rxjs/operators';
import { HttpDownloadProgress, HttpDownloadState } from '../models/http/httpDownloadProgress';

export function catchHttpError<T>(selector: () => void, ...errorCodes: number[]): OperatorFunction<T, T> {
  return catchError<T, ObservableInput<T>>((err: HttpErrorResponse, _$: Observable<T>) => {
    if (errorCodes.length === 0 || errorCodes.includes(err.status)) {
      selector();
    }
    return throwError(err);
  });
}

export function withDownloadProgress<T>(): OperatorFunction<HttpEvent<T>, HttpDownloadProgress<T>> {
  const getProgress = (event: HttpProgressEvent): number | null => event.total ? Math.round(100 * event.loaded / event.total) : null;
  const initial: HttpDownloadProgress<T> = {
    state: HttpDownloadState.pending,
    progress: 0,
  };
  return scan((previous: HttpDownloadProgress<T>, event: HttpEvent<T>): HttpDownloadProgress<T> => {
    if (event.type === HttpEventType.DownloadProgress) {
      return {
        state: HttpDownloadState.inProgress,
        progress: getProgress(event as HttpProgressEvent) ?? previous?.progress,
      };
    }

    if (event.type === HttpEventType.Response) {
      return {
        state: HttpDownloadState.done,
        response: event as HttpResponse<T>,
        progress: 100,
      }
    }

    return previous;
  }, initial);
}

export function debug<T>(message?: string): MonoTypeOperatorFunction<T> {
  return tap({next: (value) => {
    if (message) {
      console.log(message, value);
    } else {
      console.log(value);
    }
  }});
}
