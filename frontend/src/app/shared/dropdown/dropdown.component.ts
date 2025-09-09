import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LayoutService } from '../../services/ui/layout.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  animations: [
    trigger('dropdownAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(-10px)',
        }),
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        }),
      ),
      transition('void => *', [animate('150ms ease-out')]),
      transition('* => void', [animate('125ms ease-in')]),
    ]),
  ],
})
export class DropdownComponent {
  open = signal<boolean>(false);
  private readonly layoutService = inject(LayoutService);

  toggleDropdown = () => {
    this.open.set(!this.open());
  };

  closeDropdown = () => {
    this.open.set(false);
  };

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-dropdown')) {
      this.open.set(false);
    }
  }

  openModalForCredentialCloud = () => {
    this.layoutService.openModalLayout('Cloud');
  };

  openModalForCredentialFluency = () => {
    this.open.set(false);
    this.layoutService.openModalLayout('Fluency');
  };

  openTranferLine = () => {
    this.open.set(false);
    this.layoutService.modalTransferLinSubject();
  };
}
