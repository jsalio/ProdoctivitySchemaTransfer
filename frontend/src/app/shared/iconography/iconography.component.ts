import { Component, input } from '@angular/core';
import { SyncComponent } from '../icons/sync/sync.component';
import { CheckComponent } from '../icons/check/check.component';
import { NotSyncComponent } from '../icons/not-sync/not-sync.component';
import { WarnComponent } from '../icons/warn/warn.component';
import { UnasignComponent } from '../icons/unasign/unasign.component';

@Component({
  selector: 'app-iconography',
  standalone: true,
  imports: [SyncComponent, CheckComponent, NotSyncComponent, WarnComponent, UnasignComponent],
  templateUrl: './iconography.component.html',
  styleUrl: './iconography.component.css',
})
export class IconographyComponent {
  iconType = input<'sync' | 'check' | 'not-sync' | 'warn' | 'info' | 'unasign' | ''>('');
  iconSize = input<'small' | 'medium' | 'large'>('medium');
  tooltipText = input<string>('');
}
