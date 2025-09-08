import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  duration: number;
}

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
  // private toasts = new BehaviorSubject<Toast[]>([]);
  // toasts$ = this.toasts.asObservable();

  // show(message: string, duration: number = 3000): void {
  //   const toast: Toast = { message, duration };
  //   this.toasts.next([...this.toasts.value, toast]);
  //   setTimeout(() => {
  //     this.remove(toast);
  //   }, duration);
  // }

  // remove(toast: Toast): void {
  //   this.toasts.next(this.toasts.value.filter((t) => t !== toast));
  // }
}
