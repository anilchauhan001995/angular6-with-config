import { Injectable } from '@angular/core';
import { ToasterService, Toast } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';

export interface INotificationService {
  success(detail: string, summary?: string): void;
  info(detail: string, summary?: string): void;
  warning(detail: string, summary?: string): void;
  error(detail: string, summary?: string): void;
}

export enum NotificationType {
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success'
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService  implements INotificationService {

  message: Toast[];
  constructor(private toasterService: ToasterService, private translateService: TranslateService) {
    this.message = [];
  }

  success(detail: string, summary?: string, interpolateParams?: Object): void {
    this.notify({ message: NotificationType.SUCCESS, toastName: NotificationType.SUCCESS }, detail, summary, interpolateParams);
  }

  info(detail: string, summary?: string, interpolateParams?: Object): void {
    this.notify({ message: NotificationType.INFO, toastName: NotificationType.INFO }, detail, summary, interpolateParams);
  }

  warning(detail: string, summary?: string, interpolateParams?: Object): void {
    this.notify({ message: NotificationType.WARNING, toastName: 'warn' }, detail, summary, interpolateParams);
  }

  error(error: string, summary?: string, interpolateParams?: Object): void {
    this.notify({ message: NotificationType.ERROR, toastName: NotificationType.ERROR }, error, summary, interpolateParams);
  }

  private notify(typeName: { message: string, toastName: string }, detail: string, summary?: string, interpolateParams?: Object) {
    try {
      detail = this.translateService.instant(detail, interpolateParams);
      summary = this.translateService.instant(summary);
    } catch { }

    let toast: Toast = { type: typeName.message, title: summary, body: detail };
    if (typeName.toastName === NotificationType.SUCCESS) {
      toast = { type: typeName.toastName, timeout: 5000, title: summary, body: detail };
    }
    this.toasterService.pop(toast);
    this.message.push({ type: typeName.toastName, title: summary, body: detail });
  }

}
