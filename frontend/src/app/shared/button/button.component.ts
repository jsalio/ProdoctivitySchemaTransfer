import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'error' | 'alert';
type ButtonType = 'button' | 'submit' | 'reset';
type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styles: [],
})
export class ButtonComponent {
  // Inputs as signals with default values
  @Input({ required: false })
  set variant(value: ButtonVariant) {
    this.variantSignal.set(value || 'primary');
  }
  variantSignal = signal<ButtonVariant>('primary');

  @Input({ required: false })
  set type(value: ButtonType) {
    this.typeSignal.set(value || 'button');
  }
  typeSignal = signal<ButtonType>('button');

  @Input({ required: false })
  set disabled(value: boolean) {
    this.disabledSignal.set(value ?? false);
  }
  disabledSignal = signal<boolean>(false);

  @Input({ required: false })
  set fullWidth(value: boolean) {
    this.fullWidthSignal.set(value ?? true);
  }
  fullWidthSignal = signal<boolean>(true);

  @Input({ required: false })
  set size(value: ButtonSize) {
    this.sizeSignal.set(value || 'medium');
  }
  sizeSignal = signal<ButtonSize>('medium');

  @Input({ required: false })
  set ariaLabel(value: string) {
    this.ariaLabelSignal.set(value);
  }
  ariaLabelSignal = signal<string | undefined>(undefined);

  @Output() clicked = new EventEmitter<Event>();

  // Computed signal for button classes
  buttonClasses = computed(() => {
    const variant = this.variantSignal();
    const size = this.sizeSignal();
    const fullWidth = this.fullWidthSignal();
    const disabled = this.disabledSignal();

    return [
      // Base styles
      'inline-flex justify-center py-2 px-4 border border-transparent',
      'rounded-md shadow-sm text-sm font-medium text-white',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'transition-colors duration-200',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',

      // Sizes
      size === 'small' && 'text-xs py-1 px-3',
      size === 'medium' && 'text-sm py-2 px-4',
      size === 'large' && 'text-base py-3 px-6',

      // Variants
      variant === 'primary' && 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      variant === 'secondary' && 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
      variant === 'error' && 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      variant === 'alert' && 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',

      // Full width
      fullWidth && 'w-full',
    ]
      .filter(Boolean)
      .join(' ');
  });

  // Getters for template
  // type = this.typeSignal;
  // disabled = this.disabledSignal;
  // ariaLabel = this.ariaLabelSignal;

  onClick(event: Event): void {
    console.log('Ready');
    if (!this.disabledSignal()) {
      this.clicked.emit(event);
    }
  }
}
