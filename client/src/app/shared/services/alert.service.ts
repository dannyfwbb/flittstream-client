import { Injectable } from '@angular/core';
import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';
import { AlertSeverity } from '../models/alert/alert';
import { HttpResponseMessage, HttpResponseType } from '../models/http/http';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private toastrService: ToastrService,
  ) {
  }

  showMessageLocalized(title: string, message?: string, severity?: AlertSeverity): void {
    return this.showMessageHelper(
      title,
      message,
      severity ?? AlertSeverity.Default,
      false
    );
  }

  showMessage(title: string, message?: string, severity?: AlertSeverity): void {
    if (!severity) {
      severity = AlertSeverity.Default;
    }

    this.showMessageHelper(title, message, severity, false);
  }

  showStickyMessage(
    title: string,
    message?: string,
    severity?: AlertSeverity,
    error?: unknown,
    onRemove?: () => unknown
  ): void {

    if (!severity) {
      severity = AlertSeverity.Default;
    }

    if (error) {
      const msg = `Severity: "${AlertSeverity[severity]}", Summary: "${title}", Detail: "${message ?? ''}", Error: "${error}"`;

      switch (severity) {
        case AlertSeverity.Default:
        case AlertSeverity.Info:
          console.info(msg);
          break;
        case AlertSeverity.Success:
          console.log(msg);
          break;
        case AlertSeverity.Error:
          console.error(msg);
          break;
        case AlertSeverity.Warn:
          console.warn(msg);
          break;
        case AlertSeverity.Wait:
          console.trace(msg);
          break;
      }
    }

    this.showMessageHelper(title, message, severity, true, onRemove);
  }

  showHttpResponseMessage(response: HttpResponseMessage): void {
    const type = response.type ?? HttpResponseType.common;
    const title = response.title;
    const message = response.message;

    if (title || message) {
      const severity = type === HttpResponseType.common ? AlertSeverity.Default : AlertSeverity.Error;
      this.showMessageHelper(title, message, severity, false);
    }
  }

  private showMessageHelper(
    title: string,
    message: string,
    severity: AlertSeverity,
    isSticky: boolean,
    onRemove?: () => unknown
  ): void {
    const toastConfig: Partial<IndividualConfig> = {
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      tapToDismiss: true,
      timeOut: 4000,
      disableTimeOut: isSticky,
    };

    let toast: ActiveToast<unknown>;
    switch (severity) {
      case AlertSeverity.Info:
        toast = this.toastrService.info(message, title, toastConfig);
        break;
      case AlertSeverity.Success:
        toast = this.toastrService.success(message, title, toastConfig);
        break;
      case AlertSeverity.Error:
        toast = this.toastrService.error(message, title, toastConfig);
        break;
      case AlertSeverity.Warn:
        toast = this.toastrService.warning(message, title, toastConfig);
        break;
      default:
        return;
    }

    toast.onHidden
      .subscribe(() => {
        onRemove?.();
      });
  }

  resetAllMessages(): void {
    this.toastrService.clear();
  }
}

//#region re-export for compatibility

export {
  AlertSeverity
} from '../models/alert/alert';

//#endregion re-export for compatibility
