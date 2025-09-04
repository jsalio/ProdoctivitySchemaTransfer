import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-error-indicator',
  standalone: true,
  imports: [],
  templateUrl: './error-indicator.component.html',
  styleUrl: './error-indicator.component.css',
})
export class ErrorIndicatorComponent {
  labelText = input<string>('');
}
