import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private layoutModalInteractions = new Subject<void>();


  openLayoutModal = () => {
    this.layoutModalInteractions.next();
  };

  onLayoutEmit = () => {
    return this.layoutModalInteractions;
  };
}
