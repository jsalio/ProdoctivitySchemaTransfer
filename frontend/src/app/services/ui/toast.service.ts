import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  duration: number;
}

export const defaultTimeDisplay = 1000;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastNotification = new Subject<Toast>();

  emitNotification = (message: Toast) => {
    this.toastNotification.next(message);
  };

  onNotify = () => {
    return this.toastNotification;
  };
}
