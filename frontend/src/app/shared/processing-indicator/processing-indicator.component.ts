import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-processing-indicator',
  standalone: true,
  imports: [],
  templateUrl: './processing-indicator.component.html',
  styleUrl: './processing-indicator.component.css',
})
export class ProcessingIndicatorComponent {
  labelText = input<string>('');
}
