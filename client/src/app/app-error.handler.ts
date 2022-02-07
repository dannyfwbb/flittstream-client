import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class AppErrorHandler extends ErrorHandler {
  private readonly msg = 'Fatal Error!\nAn unresolved error has occurred. Do you want to reload the page to correct this?';

  constructor() {
    super();
  }

  override handleError(error: unknown): void {
    let message = (error as { message?: string })?.message;
    message = message ? `\n\nError: ${message}` : '';

    if (confirm(`${this.msg}${message}`)) {
      window.location.reload();
    }

    super.handleError(error);
  }
}
