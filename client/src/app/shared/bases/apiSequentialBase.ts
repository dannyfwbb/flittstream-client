import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ApiServiceBase } from './apiBase';

export class PendingRequest {
  url: string;
  options: unknown;
  subscription$: Subject<unknown>;

  constructor(url: string, options: unknown, subscription$: Subject<unknown>) {
    this.url = url;
    this.options = options;
    this.subscription$ = subscription$;
  }
}

export abstract class BaseSequentialApi extends ApiServiceBase {
  private requests$ = new Subject<unknown>();
  private queue: PendingRequest[] = [];

  constructor(private httpClient: HttpClient, controllerPath?: string) {
    super(controllerPath);
    this.requests$.subscribe((request) => this.execute(request));
  }

  addRequestToQueue(url: string, options: unknown): Subject<unknown> {
    const sub$ = new Subject<unknown>();
    const request = new PendingRequest(url, options, sub$);

    this.queue.push(request);
    if (this.queue.length === 1) {
      this.startNextRequest();
    }
    return sub$;
  }

  private execute(requestData: PendingRequest) {
    const sub$ = requestData.subscription$;
    this.httpClient.post(requestData.url, requestData.options)
      .subscribe({
        next: (res) => {
          sub$.next(res);
          this.queue.shift();
          this.startNextRequest();
        },
        error: (err) => {
          sub$.error(err || 'Failed to execute.');
          this.queue.shift();
          this.startNextRequest();
        }
      });
  }

  private startNextRequest() {
    if (this.queue.length > 0) {
      this.execute(this.queue[0]);
    }
  }
}
