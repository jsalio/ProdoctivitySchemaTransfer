import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private layoutModalInteractions = new Subject<void>();
  private modalLayout = new Subject<'Cloud' | 'Fluency'>();
  private modalTransferLine = new Subject<void>();
  private modalProfileList = new Subject<void>();
  private modalTransferProfile = new Subject<void>();

  onLayoutEmit = () => {
    return this.layoutModalInteractions;
  };

  modalLayoutEmit = () => {
    return this.modalLayout;
  };

  modalTransferLineEmit = () => {
    return this.modalTransferLine;
  };

  modalProfileListEmit = () => {
    return this.modalProfileList;
  };

  modalTransferProfileEmit = () => {
    return this.modalTransferProfile;
  };

  modalProfileListSubject = () => {
    this.modalProfileList.next();
  };

  openModalLayout = (value: 'Cloud' | 'Fluency') => {
    this.modalLayout.next(value);
  };

  modalTransferLinSubject = () => {
    this.modalTransferLine.next();
  };

  openLayoutModal = () => {
    this.layoutModalInteractions.next();
  };

  modalTransferProfileSubject = () => {
    this.modalTransferProfile.next();
  };
}
