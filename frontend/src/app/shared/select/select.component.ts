import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select
      [value]="selectedValue()"
      (change)="onSelectionChange($event)"
      [disabled]="disabled()"
      [class]="selectClasses()"
      [attr.aria-label]="ariaLabel()"
    >
      <option *ngIf="placeholder()" value="" disabled [selected]="!selectedValue()">
        {{ placeholder() }}
      </option>

      <option
        *ngFor="let option of options(); trackBy: trackByValue"
        [value]="option.value"
        [disabled]="option.disabled"
        [selected]="option.value === selectedValue()"
      >
        {{ option.label }}
      </option>
    </select>
  `,
  styleUrls: [],
})
export class CustomSelectComponent {
  // Inputs usando la nueva API de signals
  options = input.required<SelectOption[]>();
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  ariaLabel = input<string>('Select an option');

  // Output para emitir cambios
  valueChange = output<string | number>();

  // Signal interno para el valor seleccionado
  private _selectedValue = signal<string | number>('');

  // Getter público para el valor seleccionado
  selectedValue = computed(() => this._selectedValue());

  // Computed para las clases CSS
  selectClasses = computed(() => {
    const baseClasses =
      'block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm transition-colors duration-200';
    const stateClasses = this.disabled()
      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';

    return `${baseClasses} ${stateClasses}`;
  });

  // Effect para validar opciones (principio de responsabilidad única)
  private validationEffect = effect(() => {
    const opts = this.options();
    if (!Array.isArray(opts) || opts.length === 0) {
      console.warn('CustomSelectComponent: No options provided or empty array');
    }

    // Validar que cada opción tenga la estructura correcta
    opts.forEach((option, index) => {
      if (!option.hasOwnProperty('value') || !option.hasOwnProperty('label')) {
        console.warn(
          `CustomSelectComponent: Option at index ${index} is missing required properties (value, label)`,
        );
      }
    });
  });

  /**
   * Maneja el cambio de selección
   * Principio de responsabilidad única: solo se encarga de manejar el evento de cambio
   */
  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = this.parseValue(target.value);

    this._selectedValue.set(value);
    this.valueChange.emit(value);
  }

  /**
   * Función para el trackBy del ngFor (optimización de rendimiento)
   */
  trackByValue = (index: number, option: SelectOption): string | number => {
    return option.value;
  };

  /**
   * Establece el valor seleccionado desde el componente padre
   * Principio abierto/cerrado: permite extensión sin modificar el código existente
   */
  setValue(value: string | number): void {
    const validOption = this.options().find((option) => option.value === value);
    if (validOption && !validOption.disabled) {
      this._selectedValue.set(value);
    } else {
      console.warn(`CustomSelectComponent: Invalid or disabled value: ${value}`);
    }
  }

  /**
   * Obtiene el valor seleccionado actual
   */
  getValue(): string | number {
    return this._selectedValue();
  }

  /**
   * Limpia la selección
   */
  clearSelection(): void {
    this._selectedValue.set('');
    this.valueChange.emit('');
  }

  /**
   * Verifica si una opción específica está seleccionada
   */
  isOptionSelected(value: string | number): boolean {
    return this._selectedValue() === value;
  }

  /**
   * Parsea el valor del input considerando tipos numéricos
   * Principio de responsabilidad única: solo se encarga de la conversión de tipos
   */
  private parseValue(value: string): string | number {
    // Intentar convertir a número si es posible
    const numValue = Number(value);
    return !isNaN(numValue) && value !== '' ? numValue : value;
  }
}
