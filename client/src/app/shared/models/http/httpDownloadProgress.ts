import { HttpResponse } from '@angular/common/http';

export interface HttpDownloadProgress<T> {
  state: HttpDownloadState;
  progress?: number;
  response?: HttpResponse<T>;
}

export enum HttpDownloadState {
  pending = 1,
  inProgress,
  done,
}
