import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ActionData } from '../../pages/schema-transfer/utils/ActionData';
import { ActionProgress } from '../../pages/schema-transfer/utils/ActionProgress';

@Injectable({
  providedIn: 'root',
})
export class TranferResumeService {

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
