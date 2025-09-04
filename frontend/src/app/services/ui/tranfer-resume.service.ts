import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscriber, Subscription } from 'rxjs';
import { ActionData } from '../../pages/schema-transfer/utils/ActionData';
import { ActionContext } from '../../pages/schema-transfer/utils/ActionContext';
import { ActionProgress } from '../../pages/schema-transfer/utils/ActionProgress';

@Injectable({
  providedIn: 'root',
})
export class TranferResumeService {
  constructor() {}

  private resume = new Subject<ActionData>();
  private progressSubject = new BehaviorSubject<ActionProgress | null>(null);
  public progress$ = this.progressSubject.asObservable();

  public resumeData() {
    return this.resume.asObservable();
  }

  public emitResume(resume: ActionData) {
    this.resume.next(resume);
  }

  public emitProgress(progress: ActionProgress | null) {
    this.progressSubject.next(progress);
  }

  public progress() {
    return this.progressSubject.value;
  }
}
