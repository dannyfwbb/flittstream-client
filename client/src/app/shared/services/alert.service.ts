import { HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastaService, ToastData, ToastOptions } from 'ngx-toasta';
import { Observable, Subject } from 'rxjs';
import { Utilities } from '../services/utilities';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private messages$ = new Subject<AlertCommand>();
  private dialogs$ = new Subject<AlertDialog>();
  private loadingMessageTimeoutId: NodeJS.Timeout;
  private stickyToasties: number[] = [];

  constructor(
    private toastaService: ToastaService) {
    //
  }

  showDialog(title: string, message: string): void;
  showDialog(title: string, message: string, type: DialogType, okCallback: (val?: unknown) => unknown): void;
  showDialog(
    title: string,
    message: string,
    type: DialogType,
    okCallback?: (val?: unknown) => unknown,
    cancelCallback?: () => unknown,
    okLabel?: string,
    cancelLabel?: string,
    defaultValue?: string): void;
  showDialog(
    title: string,
    message: string,
    type?: DialogType,
    okCallback?: (val?: unknown) => unknown,
    cancelCallback?: () => unknown,
    okLabel?: string,
    cancelLabel?: string,
    defaultValue?: string): void {
    if (!type) {
      type = DialogType.alert;
    }

    this.dialogs$.next({ title, message, type, okCallback, cancelCallback, okLabel, cancelLabel, defaultValue });
  }

  showMessage(summary: string): void;
  showMessage(summary: string, detail: string, severity: MessageSeverity): void;
  showMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity): void;
  showMessage(response: HttpResponseBase, ignoreValue_useNull: string, severity: MessageSeverity): void;
  showMessage(data: unknown, separatorOrDetail?: string, severity?: MessageSeverity) {
    if (!severity) {
      severity = MessageSeverity.default;
    }

    if (data instanceof HttpResponseBase) {
      data = Utilities.getHttpResponseMessages(data);
      separatorOrDetail = Utilities.captionAndMessageSeparator;
    }

    if (data instanceof Array) {
      for (const message of data) {
        const msgObject = Utilities.splitInTwo(message, separatorOrDetail);

        this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, false);
      }
    } else {
      this.showMessageHelper(data as string, separatorOrDetail, severity, false);
    }
  }

  showStickyMessage(summary: string): void;
  showStickyMessage(summary: string, detail: string, severity: MessageSeverity, error?: unknown): void;
  showStickyMessage(summary: string, detail: string, severity: MessageSeverity, error?: void, onRemove?: () => unknown): void;
  showStickyMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity): void;
  showStickyMessage(response: HttpResponseBase, ignoreValue_useNull: string, severity: MessageSeverity): void;
  showStickyMessage(
    data: string | string[] | HttpResponseBase,
    separatorOrDetail?: string,
    severity?: MessageSeverity,
    error?: unknown,
    onRemove?: () => unknown): void {

    if (!severity) {
      severity = MessageSeverity.default;
    }

    if (data instanceof HttpResponseBase) {
      data = Utilities.getHttpResponseMessages(data);
      separatorOrDetail = Utilities.captionAndMessageSeparator;
    }

    if (data instanceof Array) {
      for (const message of data) {
        const msgObject = Utilities.splitInTwo(message, separatorOrDetail);
        this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, true);
      }
    } else {
      this.showMessageHelper(data, separatorOrDetail, severity, true, onRemove);
    }
  }

  private showMessageHelper(summary: string, detail: string, severity: MessageSeverity, isSticky: boolean, onRemove?: () => unknown) {
    const alert: AlertCommand = {
      operation: isSticky ? 'add_sticky' : 'add',
      message: { severity, summary, detail },
      onRemove
    };

    if (alert.operation == 'clear') {
      for (const id of this.stickyToasties.slice(0)) {
        this.toastaService.clear(id);
      }

      return;
    }

    const toastOptions: ToastOptions = {
      title: alert.message.summary,
      msg: alert.message.detail,
    };


    if (alert.operation == 'add_sticky') {
      toastOptions.timeout = 0;

      toastOptions.onAdd = (toast: ToastData) => {
        this.stickyToasties.push(toast.id);
      };

      toastOptions.onRemove = (toast: ToastData) => {
        const index = this.stickyToasties.indexOf(toast.id, 0);

        if (index > -1) {
          this.stickyToasties.splice(index, 1);
        }

        if (alert.onRemove) {
          alert.onRemove();
        }

        toast.onAdd = null;
        toast.onRemove = null;
      };
    } else {
      toastOptions.timeout = 4000;
    }

    switch (alert.message.severity) {
      case MessageSeverity.default: this.toastaService.default(toastOptions); break;
      case MessageSeverity.info: this.toastaService.info(toastOptions); break;
      case MessageSeverity.success: this.toastaService.success(toastOptions); break;
      case MessageSeverity.error: this.toastaService.error(toastOptions); break;
      case MessageSeverity.warn: this.toastaService.warning(toastOptions); break;
      case MessageSeverity.wait: this.toastaService.wait(toastOptions); break;
    }
  }

  resetStickyMessage() {
    this.messages$.next({ operation: 'clear' });
  }

  startLoadingMessage(message = 'Loading...', caption = '') {
    clearTimeout(this.loadingMessageTimeoutId);

    this.loadingMessageTimeoutId = setTimeout(() => {
      this.showStickyMessage(caption, message, MessageSeverity.wait);
    }, 1000);
  }

  stopLoadingMessage() {
    clearTimeout(this.loadingMessageTimeoutId);
    this.resetStickyMessage();
  }

  showValidationError() {
    this.resetStickyMessage();
    this.showStickyMessage('fve', 'fve', MessageSeverity.error);
  }

  getDialogEvent(): Observable<AlertDialog> {
    return this.dialogs$.asObservable();
  }

  getMessageEvent(): Observable<AlertCommand> {
    return this.messages$.asObservable();
  }
}

export class AlertDialog {
  constructor(
    public title: string,
    public message: string,
    public type: DialogType,
    public okCallback: (val?: unknown) => unknown,
    public cancelCallback: () => unknown,
    public defaultValue: string,
    public okLabel: string,
    public cancelLabel: string) {

  }
}

export enum DialogType {
  alert,
  confirm,
  prompt
}

export class AlertCommand {
  constructor(
    public operation: 'clear' | 'add' | 'add_sticky',
    public message?: AlertMessage,
    public onRemove?: () => unknown) { }
}

export class AlertMessage {
  constructor(
    public severity: MessageSeverity,
    public summary: string,
    public detail: string) { }
}

export enum MessageSeverity {
  default,
  info,
  success,
  error,
  warn,
  wait
}
