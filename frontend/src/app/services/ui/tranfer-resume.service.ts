import { Injectable } from '@angular/core';
import { Subject, Subscriber, Subscription } from 'rxjs';
import { ActionContext, ActionData } from '../../pages/schema-transfer/ActionBuilder';

@Injectable({
  providedIn: 'root'
})
export class TranferResumeService {

  constructor() { }

  private resume = new  Subject<ActionData>;

  public resumeData() {

    return this.resume.asObservable();
  }

  public emitResume(resume: ActionData) {
    this.resume.next(resume);
  }
}
