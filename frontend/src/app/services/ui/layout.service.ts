import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private layoutModalInteractions = new Subject<void>();
  private modalLayout = new Subject<'Cloud' | 'Fluency'>();
  private modalTransferLine = new Subject<void>();

  openLayoutModal = () => {
    this.layoutModalInteractions.next();
  };

  openModalLayout = (value: 'Cloud' | 'Fluency') => {
    this.modalLayout.next(value);
  };

  modalTransferLinSubject = () => {
    this.modalTransferLine.next();
  };

  onLayoutEmit = () => {
    return this.layoutModalInteractions;
  };

  modalLayoutEmit = () => {
    return this.modalLayout;
  };

  modalTransferLineEmit = () => {
    return this.modalTransferLine;
  };
}
