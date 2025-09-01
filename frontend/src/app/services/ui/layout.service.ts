import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private layoutModalInteractions = new Subject<void>()

  constructor() { }


  openLayoutModal = () => {
    this.layoutModalInteractions.next()
  }

  onLayoutEmit = () => {
    return this.layoutModalInteractions
  }
}
