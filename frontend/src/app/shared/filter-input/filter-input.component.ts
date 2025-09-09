import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-filter-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-input.component.html',
  styleUrl: './filter-input.component.css',
})
export class FilterInputComponent {
  // Usamos signal en vez de two-way binding tradicional
  filterText = signal('');
  placeholder? = input<string>('');
  disable? = input<boolean>(false);

  @Output() filterChanged = new EventEmitter<string>();

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
    this.filterChanged.emit(value);
  }

  clearFilter() {
    this.filterText.set('');
    this.filterChanged.emit('');
  }
}
