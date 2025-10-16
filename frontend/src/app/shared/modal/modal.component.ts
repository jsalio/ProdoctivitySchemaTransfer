import { Component, EventEmitter, Output, input } from '@angular/core';

import { CommonModule } from '@angular/common';

/**
 * A reusable component for displaying content in a modal window.
 *
 * @example
 * <app-modal [isOpen]="isModalOpen" (modalClose)="isModalOpen = false">
 *   <p>Modal content</p>
 * </app-modal>
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  /** Controls whether the modal is open or closed. */
  isOpen = input<boolean>(false);

  /** Event emitted when the modal is closed. */
  @Output() modalClose = new EventEmitter<void>();

  /** Defines the size of the modal. */
  size = input<'basic' | 'medium' | 'big' | 'custom'>('basic');

  /** Defines the custom width of the modal when `size` is 'custom'. */
  customWidth = input<string>('80%');

  /** Emits the `modalClose` event to close the modal. */
  onClose() {
    this.modalClose.emit();
  }

  /** @internal */
  get modalWidthClasses(): string | string[] {
    switch (this.size()) {
      case 'medium':
        return 'max-w-3xl';
      case 'big':
        return 'max-w-7xl w-[80%]';
      case 'custom':
        return ''; // classes are handled inline with [ngStyle]
      default:
        return 'max-w-md';
    }
  }

  /** @internal */
  get modalStyle(): Record<string, string> | null {
    if (this.size() === 'custom') {
      return { width: this.customWidth() };
    }
    return null;
  }
}
