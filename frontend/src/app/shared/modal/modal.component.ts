import { Component, EventEmitter, Input, Output, input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  size=input<'basic'|'medium'|'big'|'custom'>('basic'); 
  customWidth= input<string>('80%');

  onClose() {
    this.close.emit();
  }

  get modalWidthClasses(): string | string[] {
    switch (this.size()) {
      case 'medium':
        return 'max-w-3xl';
      case 'big':
        return 'max-w-5xl w-[80%]';
      case 'custom':
        return ''; // clases se manejan inline con [ngStyle]
      default:
        return 'max-w-md';
    }
  }

  get modalStyle(): Record<string, string> | null {
    if (this.size() === 'custom') {
      return { width: this.customWidth() };
    }
    return null;
  }
}
